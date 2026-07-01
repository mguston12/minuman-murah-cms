<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <p class="text-muted mb-0">Manage merk</p>
      </div>
      <button type="button" class="btn btn-primary action-btn-dark" @click="handleCreateBrandClick">
        <span class="me-2">+</span>Create New Merk
      </button>
    </div>
    <!-- Filter Section -->
    <div class="card mb-4">
      <div class="card-body p-3">
        <div class="row g-2">
          <div class="col-md-4">
            <input
              v-model="filters.search"
              type="text"
              class="form-control form-control-sm"
              placeholder="Search name or slug..."
              @input="handleSearch"
            />
          </div>
          <div class="col-md-3">
            <select v-model="filters.status" class="form-select form-select-sm" @change="handleSearch">
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <section class="section">
      <div class="card">
        <div>
          <!-- Brands Table -->
          <div >
            <div class="card-body">
              <div v-if="loadingBrands" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2 text-muted">Loading brands...</p>
              </div>

              <div v-else-if="filteredBrands.length === 0" class="text-center py-5">
                <p class="text-muted">No brands found. Create your first brand!</p>
              </div>

              <div v-else class="table-responsive">
                <table class="table table-striped table-hover align-middle">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Logo</th>
                      <th>Name</th>
                      <th>Slug</th>
                      <th>Order</th>
                      <th>Status</th>
                      <th class="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(brand, index) in filteredBrands" :key="brand.id">
                      <td>
                        <span class="badge bg-secondary">{{ index + 1 }}</span>
                      </td>
                      <td>
                        <img v-if="brand.logo" :src="brand.logo" :alt="brand.name" class="img-thumbnail" style="
                            max-width: 80px;
                            max-height: 50px;
                            object-fit: contain;
                          " />
                        <span v-else class="text-muted">No logo</span>
                      </td>
                      <td>{{ brand.name }}</td>
                      <td>{{ brand.slug }}</td>
                      <td>{{ brand.order || 0 }}</td>
                      <td>
                        <span :class="[
                          'badge',
                          brand.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary',
                        ]">
                          {{ brand.status || "INACTIVE" }}
                        </span>
                      </td>
                      <td class="text-end">
                        <div class="d-flex justify-content-end gap-2">
                          <button type="button" class="btn btn-sm btn-outline-primary"
                            @click="handleEditBrandClick(brand)" title="Edit">
                            <i class="bi bi-pencil"></i>
                          </button>
                          <button type="button" class="btn btn-sm btn-outline-danger"
                            @click="handleDeleteBrandClick(brand)" title="Delete"
                            :disabled="isLoading">
                            <i class="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Create Brand Modal -->
    <div id="createBrandModal" class="modal fade" tabindex="-1" aria-labelledby="createBrandModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="createBrandModalLabel">
              Create New Merk
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
              @click="resetBrandForm"></button>
          </div>
          <form @submit.prevent="handleCreateBrand">
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-md-12">
                  <label class="form-label">Brand Name <span class="text-danger">*</span></label>
                  <input v-model="brandForm.name" type="text" required class="form-control"
                    :class="{ 'is-invalid': brandFormErrors.name }" placeholder="Brand Name" />
                  <div v-if="brandFormErrors.name" class="invalid-feedback">
                    {{ brandFormErrors.name[0] }}
                  </div>
                </div>
                <div class="col-md-12">
                  <label class="form-label">Brand Slug <span class="text-danger">*</span></label>
                  <input v-model="brandForm.slug" type="text" required class="form-control"
                    :class="{ 'is-invalid': brandFormErrors.slug }" placeholder="Brand Slug" readonly />
                  <div v-if="brandFormErrors.slug" class="invalid-feedback">
                    {{ brandFormErrors.slug[0] }}
                  </div>
                </div>
                <div class="col-12">
                  <label class="form-label">Logo</label>
                  <div class="mb-2" v-if="brandLogoPreview">
                    <img :src="brandLogoPreview" alt="Brand Logo Preview" class="img-thumbnail"
                      style="max-height: 100px" />
                  </div>
                  <input type="file" accept="image/*" @change="onBrandLogoChange" class="form-control" />
                  <div class="form-text">
                    Upload brand logo image (max 5MB, formats: jpeg, jpg, png,
                    gif, webp)
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Status</label>
                  <select v-model="brandForm.status" class="form-select">
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Order</label>
                  <input v-model.number="brandForm.order" type="number" min="0" class="form-control" placeholder="0" />
                  <div class="form-text">Lower numbers appear first</div>
                </div>
                <div class="col-12">
                  <label class="form-label">Description</label>
                  <textarea v-model="brandForm.description" class="form-control" rows="3"
                    placeholder="Brand description"></textarea>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="resetBrandForm">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary action-btn-dark" :disabled="isLoading">
                {{ isLoading ? "Creating..." : "Create merk" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Edit Brand Modal -->
    <div id="editBrandModal" class="modal fade" tabindex="-1" aria-labelledby="editBrandModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editBrandModalLabel">Edit Merk</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
              @click="resetBrandForm"></button>
          </div>
          <form @submit.prevent="handleUpdateBrand">
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-md-12">
                  <label class="form-label">Brand Name <span class="text-danger">*</span></label>
                  <input v-model="brandForm.name" type="text" required class="form-control"
                    :class="{ 'is-invalid': brandFormErrors.name }" />
                  <div v-if="brandFormErrors.name" class="invalid-feedback">
                    {{ brandFormErrors.name[0] }}
                  </div>
                </div>
                <div class="col-md-12">
                  <label class="form-label">Brand Slug <span class="text-danger">*</span></label>
                  <input v-model="brandForm.slug" type="text" required class="form-control"
                    :class="{ 'is-invalid': brandFormErrors.slug }" readonly />
                  <div v-if="brandFormErrors.slug" class="invalid-feedback">
                    {{ brandFormErrors.slug[0] }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Logo</label>
                  <div class="mb-2" v-if="brandLogoPreview">
                    <img :src="brandLogoPreview" alt="Brand Logo Preview" class="img-thumbnail"
                      style="max-height: 100px" />
                  </div>
                  <input type="file" accept="image/*" @change="onBrandLogoChange" class="form-control" />
                  <div class="form-text">
                    Upload brand logo image (max 5MB, formats: jpeg, jpg, png,
                    gif, webp)
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Status</label>
                  <select v-model="brandForm.status" class="form-select">
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Order</label>
                  <input v-model.number="brandForm.order" type="number" min="0" class="form-control" />
                  <div class="form-text">Lower numbers appear first</div>
                </div>
                <div class="col-12">
                  <label class="form-label">Description</label>
                  <textarea v-model="brandForm.description" class="form-control" rows="3"></textarea>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="resetBrandForm">
                Cancel
              </button>
              <button type="submit" class="btn btn-success" :disabled="isLoading">
                {{ isLoading ? "Updating..." : "Update Merk" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Brand Modal -->
    <div id="deleteBrandModal" class="modal fade" tabindex="-1" aria-labelledby="deleteBrandModalLabel"
      aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteBrandModalLabel">Delete Merk</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>
              Are you sure you want to delete
              <strong>{{ brandToDelete?.name }}</strong>? This action cannot be undone.
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="button" class="btn btn-danger" @click="handleDeleteBrand" :disabled="isLoading">
              {{ isLoading ? "Deleting..." : "Delete Brand" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Brand } from "~/types/brand";
import { generateSlug } from "~/utils/helpers";

definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

const { token } = useApiBase();
const { getAllBrands, createBrand, updateBrand, deleteBrand } = useBrandApi();
const toast = useToast();

const isLoading = ref(false);
const brands = ref<Brand[]>([]);
const loadingBrands = ref(false);
const filters = ref({ search: '', status: '' });

const filteredBrands = computed(() => {
  let list = brands.value;
  const q = filters.value.search.toLowerCase().trim();
  if (q) {
    list = list.filter(
      (brand) =>
        brand.name.toLowerCase().includes(q) ||
        brand.slug.toLowerCase().includes(q)
    );
  }
  if (filters.value.status) {
    list = list.filter((brand) => brand.status === filters.value.status);
  }
  return list;
});

const handleSearch = () => {
  // ponytail: client-side filter, computed handles it
};

const brandToEdit = ref<Brand | null>(null);
const brandToDelete = ref<Brand | null>(null);
const isHydratingBrandForm = ref(false);
const brandForm = ref({
  name: "",
  slug: "",
  status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  order: 0,
  description: "",
});
const brandFormErrors = ref<Record<string, string[]>>({});
const brandLogoPreview = ref<string>("");
const brandLogoFile = ref<File | null>(null);

const syncBrandSlug = (name: string) => {
  const trimmedName = name.trim();
  brandForm.value.slug = trimmedName ? generateSlug(trimmedName) : "";
};

const handleCreateBrandClick = () => {
  resetBrandForm();
  const modalEl = document.getElementById("createBrandModal");
  if (modalEl) {
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  }
};

const handleEditBrandClick = async (brand: Brand) => {
  brandToEdit.value = brand;
  isHydratingBrandForm.value = true;
  brandForm.value = {
    name: brand.name || "",
    slug: brand.slug || "",
    status: (brand.status as "ACTIVE" | "INACTIVE") || "ACTIVE",
    order: brand.order || 0,
    description: brand.description || "",
  };
  brandLogoPreview.value = brand.logo || "";
  brandLogoFile.value = null;
  await nextTick();
  isHydratingBrandForm.value = false;
  const modal = new (window as any).bootstrap.Modal(
    document.getElementById("editBrandModal"),
  );
  modal.show();
};

const handleDeleteBrandClick = async (brand: Brand) => {
  brandToDelete.value = brand;
  await nextTick();
  const modal = new (window as any).bootstrap.Modal(
    document.getElementById("deleteBrandModal"),
  );
  modal.show();
};

const handleCreateBrand = async () => {
  try {
    isLoading.value = true;
    brandFormErrors.value = {};

    const formData = new FormData();
    formData.append("name", brandForm.value.name);
    formData.append("slug", brandForm.value.slug);
    const statusValue = brandForm.value.status || "ACTIVE";
    formData.append("status", String(statusValue));
    formData.append("order", String(brandForm.value.order));
    if (brandForm.value.description) {
      formData.append("description", brandForm.value.description);
    }
    if (brandLogoFile.value) {
      formData.append("logo", brandLogoFile.value);
    }

    const { data, error } = await createBrand(formData);
    if (error) {
      if (error.errors) {
        brandFormErrors.value = error.errors;
      } else {
        toast.error(error.message || "Failed to create merk");
      }
      return;
    }
    if (data?.success) {
      toast.success("Brand created successfully");
      const modal = (window as any).bootstrap.Modal.getInstance(
        document.getElementById("createBrandModal"),
      );
      modal?.hide();
      resetBrandForm();
      await loadBrands();
    }
  } catch (err) {
    toast.error(err instanceof Error ? err.message : "Failed to create merk");
  } finally {
    isLoading.value = false;
  }
};

const handleUpdateBrand = async () => {
  if (!brandToEdit.value) return;
  try {
    isLoading.value = true;
    brandFormErrors.value = {};

    const formData = new FormData();
    formData.append("name", brandForm.value.name || "");
    formData.append("slug", brandForm.value.slug || "");
    formData.append("status", brandForm.value.status || "ACTIVE");
    formData.append("order", String(brandForm.value.order || 0));
    formData.append("description", brandForm.value.description || "");
    if (brandLogoFile.value) {
      formData.append("logo", brandLogoFile.value);
    }

    const { data, error } = await updateBrand(brandToEdit.value.id, formData);
    if (error) {
      if (error.errors) {
        brandFormErrors.value = error.errors;
      } else {
        toast.error(error.message || "Failed to update merk");
      }
      return;
    }
    if (data?.success) {
      toast.success("Merk updated successfully");
      const modal = (window as any).bootstrap.Modal.getInstance(
        document.getElementById("editBrandModal"),
      );
      modal?.hide();
      resetBrandForm();
      await loadBrands();
    }
  } catch (err) {
    toast.error(err instanceof Error ? err.message : "Failed to update merk");
  } finally {
    isLoading.value = false;
  }
};

const handleDeleteBrand = async () => {
  if (!brandToDelete.value) return;
  try {
    isLoading.value = true;
    const { data, error } = await deleteBrand(brandToDelete.value.id);
    if (error) {
      toast.error(error.message || "Failed to delete brand");
      return;
    }
    if (data?.success) {
      toast.success("Brand deleted successfully");
      const modal = (window as any).bootstrap.Modal.getInstance(
        document.getElementById("deleteBrandModal"),
      );
      modal?.hide();
      brandToDelete.value = null;
      await loadBrands();
    }
  } catch (err) {
    toast.error(err instanceof Error ? err.message : "Failed to delete brand");
  } finally {
    isLoading.value = false;
  }
};

const onBrandLogoChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (!input || !input.files || !input.files[0]) return;

  const file = input.files[0];
  brandLogoFile.value = file;
  brandLogoPreview.value = URL.createObjectURL(file);
};

const resetBrandForm = () => {
  isHydratingBrandForm.value = false;
  brandForm.value = {
    name: "",
    slug: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
    order: 0,
    description: "",
  };
  brandFormErrors.value = {};
  brandToEdit.value = null;
  brandLogoPreview.value = "";
  brandLogoFile.value = null;
};

watch(
  () => brandForm.value.name,
  (name, previousName) => {
    if (isHydratingBrandForm.value || name === previousName) {
      return;
    }

    syncBrandSlug(name || "");
  },
);

const loadBrands = async () => {
  loadingBrands.value = true;
  try {
    const { data, error } = await getAllBrands();
    if (error || !data?.success) {
      console.error("Failed to load brands:", error);
      brands.value = [];
    } else if (data.data) {
      if (Array.isArray(data.data.brands)) {
        brands.value = data.data.brands;
      }
    }
  } catch (err) {
    console.error("Error loading brands:", err);
    brands.value = [];
  } finally {
    loadingBrands.value = false;
  }
};

onMounted(async () => {
  await loadBrands();
});
</script>

<style scoped>
.table .badge {
  font-weight: 600;
}

.table .badge.bg-secondary {
  background-color: #e5e7eb !important;
  color: #374151 !important;
}

.table .badge.bg-success {
  background-color: #dff3e7 !important;
  color: #166534 !important;
}

.img-thumbnail {
  object-fit: contain;
  border: 1px solid #e9ecef;
  padding: 4px;
  background: #fff;
}
</style>
