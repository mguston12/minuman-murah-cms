<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="mb-0">Manage Category Products</h4>
        <p class="text-muted mb-0">Manage products by category</p>
      </div>
      <button
        v-if="hasPermission('products.create')"
        @click="openAddCategoryProductModal"
        class="btn btn-primary"
        :disabled="isLoading"
      >
        <span class="me-2">+</span>Add Category
      </button>
    </div>

    <!-- Categories Table -->
    <div v-if="hasPermission('products.read')" class="card">
      <div class="card-body">
        <div v-if="loadingCategories" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2 text-muted">Loading categories...</p>
        </div>

        <div v-else-if="categories.length === 0" class="text-center py-5">
          <p class="text-muted">No categories found.</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-striped table-hover align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Category Name</th>
                <th>Category Slug</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(category, index) in categoriesWithCount"
                :key="category.id"
              >
                <td>
                  <span class="badge bg-secondary">{{
                    getRowNumber(index)
                  }}</span>
                </td>
                <td>
                  <img
                    v-if="category.taxonomy_image"
                    :src="category.taxonomy_image"
                    alt="Category Image"
                    class="img-thumbnail"
                    style="max-width: 50px; max-height: 50px; object-fit: cover"
                  />
                  <span v-else class="text-muted small">No image</span>
                </td>
                <td>
                  <strong>{{ category.taxonomy_name || "N/A" }}</strong>
                </td>
                <td>
                  <code class="text-muted">{{
                    category.taxonomy_slug || "N/A"
                  }}</code>
                </td>
                <td class="text-end">
                  <button
                    v-if="hasPermission('products.update')"
                    class="btn btn-sm btn-outline-warning me-2"
                    @click="openEditCategoryModal(category)"
                    :disabled="isLoading"
                  >
                    <i class="bi bi-pencil me-1"></i>Edit Category
                  </button>

                  <button
                    v-if="hasPermission('products.delete')"
                    class="btn btn-sm btn-outline-danger"
                    @click="openDeleteCategoryModal(category)"
                    :disabled="isLoading"
                  >
                    <i class="bi bi-trash me-1"></i>Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add Category Product Modal -->
    <div
      class="modal fade"
      id="addCategoryProductModal"
      tabindex="-1"
      aria-labelledby="addCategoryProductModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addCategoryProductModalLabel">
              Add New Category
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="taxonomy_name" class="form-label">
                Category Name <span class="text-danger">*</span>
              </label>
              <input
                id="taxonomy_name"
                v-model="form.taxonomy_name"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': formErrors.taxonomy_name }"
                placeholder="Enter category name"
                :disabled="isLoading"
                required
                @input="generateSlug(form)"
              />
              <div v-if="formErrors.taxonomy_name" class="invalid-feedback">
                {{ formErrors.taxonomy_name[0] }}
              </div>
            </div>

            <div class="mb-3">
              <label for="taxonomy_slug" class="form-label">
                Category Slug
              </label>
              <input
                id="taxonomy_slug"
                v-model="form.taxonomy_slug"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': formErrors.taxonomy_slug }"
                placeholder="Enter category slug (auto-generated if empty)"
                :disabled="isLoading"
                required
              />
              <div v-if="formErrors.taxonomy_slug" class="invalid-feedback">
                {{ formErrors.taxonomy_slug[0] }}
              </div>
              <small class="form-text text-muted">
                Leave empty to auto-generate from category name
              </small>
            </div>

            <div class="mb-3">
              <label for="taxonomy_status" class="form-label">
                Status <span class="text-danger">*</span>
              </label>
              <select
                id="taxonomy_status"
                v-model="form.taxonomy_status"
                class="form-select"
                :class="{ 'is-invalid': formErrors.taxonomy_status }"
                :disabled="isLoading"
                required
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
              <div v-if="formErrors.taxonomy_status" class="invalid-feedback">
                {{ formErrors.taxonomy_status[0] }}
              </div>
            </div>

            <div class="mb-3">
              <label for="taxonomy_description" class="form-label">
                Description
              </label>
              <TiptapEditor
                v-model="form.taxonomy_description"
                placeholder="Enter category description (optional)"
                :error-message="
                  formErrors.taxonomy_description
                    ? formErrors.taxonomy_description[0]
                    : ''
                "
              />
            </div>

            <!-- Category Image -->
            <div class="mb-3">
              <label for="taxonomy_image" class="form-label">
                Category Image
              </label>
              <input
                id="taxonomy_image"
                type="file"
                accept="image/*"
                class="form-control"
                :class="{ 'is-invalid': formErrors.taxonomy_image }"
                :disabled="isLoading"
                @change="handleImageChange($event, 'add')"
              />
              <div v-if="formErrors.taxonomy_image" class="invalid-feedback">
                {{ formErrors.taxonomy_image[0] }}
              </div>
              <div v-if="imagePreview" class="mt-2">
                <img
                  :src="imagePreview"
                  alt="Preview"
                  class="img-thumbnail"
                  style="max-width: 150px; max-height: 150px; object-fit: cover"
                />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="handleAddCategoryProduct"
              :disabled="isLoading || !form.taxonomy_name"
            >
              {{ isLoading ? "Creating..." : "Create Category" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Taxolist Modal -->
    <div
      class="modal fade"
      id="editCategoryProductModal"
      tabindex="-1"
      aria-labelledby="editCategoryProductModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editCategoryProductModalLabel">
              Edit Category
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div class="modal-body">
            <!-- Category Name -->
            <div class="mb-3">
              <label class="form-label">Category Name *</label>
              <input
                v-model="editForm.taxonomy_name"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': editFormErrors.taxonomy_name }"
                placeholder="Enter category name"
                @input="generateSlug(editForm)"
                required
              />
              <div v-if="editFormErrors.taxonomy_name" class="invalid-feedback">
                {{ editFormErrors.taxonomy_name[0] }}
              </div>
            </div>

            <!-- Slug -->
            <div class="mb-3">
              <label class="form-label">Category Slug</label>
              <input
                v-model="editForm.taxonomy_slug"
                type="text"
                class="form-control"
                placeholder="Enter category slug (auto-generated if empty and not-updated)"
                required
              />
            </div>

            <!-- Status -->
            <div class="mb-3">
              <label class="form-label">Status *</label>
              <select
                v-model="editForm.taxonomy_status"
                class="form-select"
                :class="{ 'is-invalid': editFormErrors.taxonomy_status }"
                required
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
              <div
                v-if="editFormErrors.taxonomy_status"
                class="invalid-feedback"
              >
                {{ editFormErrors.taxonomy_status[0] }}
              </div>
            </div>

            <!-- Description -->
            <div class="mb-3">
              <label class="form-label">Description</label>
              <TiptapEditor
                v-model="editForm.taxonomy_description"
                placeholder="Enter category description (optional)"
              />
            </div>

            <!-- Category Image -->
            <div class="mb-3">
              <label class="form-label">Category Image</label>
              <input
                type="file"
                accept="image/*"
                class="form-control"
                :class="{ 'is-invalid': editFormErrors.taxonomy_image }"
                @change="handleImageChange($event, 'edit')"
              />
              <div
                v-if="editFormErrors.taxonomy_image"
                class="invalid-feedback"
              >
                {{ editFormErrors.taxonomy_image[0] }}
              </div>
              <div v-if="editImagePreview" class="mt-2">
                <img
                  :src="editImagePreview"
                  alt="Preview"
                  class="img-thumbnail"
                  style="max-width: 150px; max-height: 150px; object-fit: cover"
                />
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">
              Cancel
            </button>
            <button
              class="btn btn-success"
              @click="handleUpdateCategory"
              :disabled="isLoading"
            >
              {{ isLoading ? "Updating..." : "Update Category" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete TaxoList Modal -->
    <div
      class="modal fade"
      id="deleteCategoryModal"
      tabindex="-1"
      aria-labelledby="deleteCategoryModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="deleteCategoryModalLabel">
              Delete Category
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div class="modal-body">
            <p>
              Are you sure you want to delete
              <strong>{{ deleteTarget?.taxonomy_name }}</strong
              >?
            </p>
            <p class="text-muted mb-0">This action cannot be undone.</p>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">
              Cancel
            </button>
            <button
              class="btn btn-danger"
              @click="handleDeleteCategory"
              :disabled="isLoading"
            >
              {{ isLoading ? "Deleting..." : "Delete" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

useAppTitle("Manage Category Products");

interface Category {
  id: number;
  taxonomy_name: string;
  taxonomy_slug: string;
  taxonomy_image?: string | null;
  product_count?: number;
}

const { getCategoryProducts } = useCategoryProductApi();
const { getTaxoListsByType, createTaxoList, updateTaxoList, deleteTaxoList } =
  useProductRelationsApi();
const { hasPermission } = usePermission();
const toast = useToast();

const categories = ref<Category[]>([]);
const categoryProducts = ref<any[]>([]);
const loadingCategories = ref(false);
const isLoading = ref(false);
const form = ref({
  taxonomy_name: "",
  taxonomy_slug: "",
  taxonomy_type: 2, // Default to type 2 (Category)
  taxonomy_status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  taxonomy_description: "",
});
const formErrors = ref<Record<string, string[]>>({});
const editForm = ref<any>({
  id: null,
  taxonomy_name: "",
  taxonomy_slug: "",
  original_slug: "",
  taxonomy_type: 2,
  taxonomy_status: "ACTIVE",
  taxonomy_description: "",
});
const editFormErrors = ref<Record<string, string[]>>({});
const deleteTarget = ref<any>(null);

// Image handling - Add
const imageFile = ref<File | null>(null);
const imagePreview = ref<string>("");

// Image handling - Edit
const editImageFile = ref<File | null>(null);
const editImagePreview = ref<string>("");

const handleImageChange = (e: Event, mode: "add" | "edit") => {
  const input = e.target as HTMLInputElement;
  if (!input?.files?.[0]) return;

  const file = input.files[0];
  if (mode === "add") {
    imageFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  } else {
    editImageFile.value = file;
    editImagePreview.value = URL.createObjectURL(file);
  }
};

const categoriesWithCount = computed(() => {
  return categories.value.map((category) => {
    const count = categoryProducts.value.filter(
      (cp) => cp.fk_category_id === category.id,
    ).length;
    return {
      ...category,
      product_count: count,
    };
  });
});

const generateSlug = (target: any) => {
  if (!target.taxonomy_name) {
    target.taxonomy_slug = "";
    return;
  }

  target.taxonomy_slug = target.taxonomy_name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const loadCategories = async () => {
  loadingCategories.value = true;
  try {
    const [type2] = await Promise.all([getTaxoListsByType(2)]);

    const categories2 = type2.data?.data?.taxo_lists || [];

    const allCategories = [...categories2]
      .filter((cat: any) => cat.taxonomy_status === "ACTIVE")
      .map((cat: any) => ({
        id: cat.id,
        taxonomy_name: cat.taxonomy_name,
        taxonomy_slug: cat.taxonomy_slug,
        taxonomy_description: cat.taxonomy_description,
        taxonomy_image: cat.taxonomy_image || null,
      }));

    categories.value = allCategories;
  } catch (err) {
    toast.error("Error loading categories");
    categories.value = [];
  } finally {
    loadingCategories.value = false;
  }
};

const loadCategoryProducts = async () => {
  try {
    const { data, error } = await getCategoryProducts();
    if (error || !data?.success) {
      categoryProducts.value = [];
    } else if (data.data) {
      categoryProducts.value = Array.isArray(data.data) ? data.data : [];
    }
  } catch (err) {
    categoryProducts.value = [];
  }
};

const openAddCategoryProductModal = async () => {
  form.value = {
    taxonomy_name: "",
    taxonomy_slug: "",
    taxonomy_type: 2,
    taxonomy_status: "ACTIVE" as "ACTIVE" | "INACTIVE",
    taxonomy_description: "",
  };
  formErrors.value = {};
  imageFile.value = null;
  imagePreview.value = "";

  await nextTick();
  const modal = new (window as any).bootstrap.Modal(
    document.getElementById("addCategoryProductModal"),
  );
  modal.show();
};

const handleAddCategoryProduct = async () => {
  if (!form.value.taxonomy_name) {
    toast.error("Please fill in category name");
    return;
  }

  isLoading.value = true;
  formErrors.value = {};

  try {
    let payload: any;

    if (imageFile.value) {
      const fd = new FormData();
      fd.append("taxonomy_name", form.value.taxonomy_name);
      fd.append("taxonomy_type", String(form.value.taxonomy_type));
      fd.append("taxonomy_status", form.value.taxonomy_status);
      if (form.value.taxonomy_slug) {
        fd.append("taxonomy_slug", form.value.taxonomy_slug);
      }
      if (form.value.taxonomy_description) {
        fd.append("taxonomy_description", form.value.taxonomy_description);
      }
      fd.append("taxonomy_image", imageFile.value);
      payload = fd;
    } else {
      payload = {
        taxonomy_name: form.value.taxonomy_name,
        taxonomy_type: form.value.taxonomy_type,
        taxonomy_status: form.value.taxonomy_status,
      };
      if (form.value.taxonomy_slug) {
        payload.taxonomy_slug = form.value.taxonomy_slug;
      }
      if (form.value.taxonomy_description) {
        payload.taxonomy_description = form.value.taxonomy_description;
      }
    }

    const { data, error } = await createTaxoList(payload);

    if (error) {
      if (error.errors) {
        formErrors.value = error.errors;
      } else {
        toast.error(error.message || "Failed to create category");
      }
      return;
    }

    if (data?.success) {
      toast.success("Category created successfully");
      const modal = (window as any).bootstrap.Modal.getInstance(
        document.getElementById("addCategoryProductModal"),
      );
      modal?.hide();
      form.value = {
        taxonomy_name: "",
        taxonomy_slug: "",
        taxonomy_type: 2,
        taxonomy_status: "ACTIVE" as "ACTIVE" | "INACTIVE",
        taxonomy_description: "",
      };
      formErrors.value = {};
      imageFile.value = null;
      imagePreview.value = "";
      await loadCategories();
      await loadCategoryProducts();
    }
  } catch (err) {
    toast.error("Error creating category");
  } finally {
    isLoading.value = false;
  }
};

const openEditCategoryModal = async (category: any) => {
  editForm.value = {
    id: category.id,
    taxonomy_name: category.taxonomy_name,
    taxonomy_slug: category.taxonomy_slug,
    original_slug: category.taxonomy_slug,
    taxonomy_type: category.taxonomy_type || 2,
    taxonomy_status: category.taxonomy_status || "ACTIVE",
    taxonomy_description: category.taxonomy_description || "",
  };

  editFormErrors.value = {};
  editImageFile.value = null;
  editImagePreview.value = category.taxonomy_image || "";

  await nextTick();
  const modal = new (window as any).bootstrap.Modal(
    document.getElementById("editCategoryProductModal"),
  );
  modal.show();
};

const handleUpdateCategory = async () => {
  isLoading.value = true;
  editFormErrors.value = {};

  try {
    const finalSlug =
      editForm.value.taxonomy_slug &&
      editForm.value.taxonomy_slug !== editForm.value.original_slug
        ? editForm.value.taxonomy_slug
        : editForm.value.taxonomy_name;

    let payload: any;

    if (editImageFile.value) {
      const fd = new FormData();
      fd.append("taxonomy_name", editForm.value.taxonomy_name);
      fd.append("taxonomy_slug", finalSlug);
      fd.append("taxonomy_status", editForm.value.taxonomy_status);
      fd.append(
        "taxonomy_description",
        editForm.value.taxonomy_description || "",
      );
      fd.append("taxonomy_image", editImageFile.value);
      fd.append("_method", "PUT");
      payload = fd;
    } else {
      payload = {
        taxonomy_name: editForm.value.taxonomy_name,
        taxonomy_slug: finalSlug,
        taxonomy_status: editForm.value.taxonomy_status,
        taxonomy_description: editForm.value.taxonomy_description,
      };
    }

    const { data, error } = await updateTaxoList(editForm.value.id, payload);

    if (error) {
      editFormErrors.value = error.errors || {};
      return;
    }

    toast.success("Category updated successfully");

    const modal = (window as any).bootstrap.Modal.getInstance(
      document.getElementById("editCategoryProductModal"),
    );
    modal?.hide();

    editImageFile.value = null;
    editImagePreview.value = "";
    await loadCategories();
    await loadCategoryProducts();
  } catch (e) {
    toast.error("Error updating category");
  } finally {
    isLoading.value = false;
  }
};

const openDeleteCategoryModal = async (category: any) => {
  deleteTarget.value = category;

  await nextTick();
  const modal = new (window as any).bootstrap.Modal(
    document.getElementById("deleteCategoryModal"),
  );
  modal.show();
};

const handleDeleteCategory = async () => {
  if (!deleteTarget.value?.id) return;

  isLoading.value = true;

  try {
    const { data, error } = await deleteTaxoList(deleteTarget.value.id);

    if (error) {
      toast.error(error.message || "Failed to delete category");
      return;
    }

    toast.success("Category deleted successfully");

    const modal = (window as any).bootstrap.Modal.getInstance(
      document.getElementById("deleteCategoryModal"),
    );
    modal?.hide();

    deleteTarget.value = null;

    await loadCategories();
    await loadCategoryProducts();
  } catch (e) {
    toast.error("Error deleting category");
  } finally {
    isLoading.value = false;
  }
};

const getRowNumber = (index: number): number => {
  return index + 1;
};

onMounted(async () => {
  await Promise.all([loadCategories(), loadCategoryProducts()]);
});
</script>
