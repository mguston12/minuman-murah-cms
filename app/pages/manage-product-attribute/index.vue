<template>
  <div>
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <p class="mb-0">Manage Product Attributes</p>
      </div>
      <button @click="openCreateModal" class="btn btn-primary action-btn-dark">
        <i class="bi bi-plus-circle me-2"></i>Add Attribute
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

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2 text-muted">Loading attributes...</p>
    </div>

    <!-- Attributes Table -->
    <div v-else class="card">
      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Values</th>
              <th>Status</th>
              <th class="text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredAttributes.length === 0">
              <td colspan="7" class="text-center py-5 text-muted">
                Attributes not found yet
              </td>
            </tr>
            <tr v-for="(attr, i) in filteredAttributes" :key="i + 1">
              <td>{{ i + 1 }}</td>
              <td>
                <strong>{{ attr.name }}</strong>
              </td>
              <td>{{ attr.slug }}</td>
              <td>
                <NuxtLink
                  :to="`/manage-product-attribute/${attr.id}/values`"
                  class="badge bg-info text-decoration-none"
                >
                  {{ attr.attribute_values?.length || 0 }} values
                  <i class="bi bi-arrow-right-short ms-1"></i>
                </NuxtLink>
              </td>
              <td>
                <span
                  :class="[
                    'badge',
                    attr.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary',
                  ]"
                >
                  {{ attr.status }}
                </span>
              </td>

              <td class="text-end">
                <button
                  @click="openEditModal(attr)"
                  class="btn btn-sm btn-outline-primary me-2"
                  title="Edit"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button
                  type="button"
                  class="btn btn-sm btn-outline-danger"
                  @click="handleDelete(attr.id)"
                  title="Hapus"
                  :disabled="deleting === attr.id"
                >
                  <i
                    v-if="deleting === attr.id"
                    class="bi bi-hourglass-split"
                  ></i>
                  <i v-else class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <!-- <div
      v-if="!loading && totalPages > 1"
      class="d-flex justify-content-center mt-4"
    >
      <nav>
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button
              class="page-link"
              @click="fetchAttributes(currentPage - 1)"
              :disabled="currentPage === 1"
            >
              Previous
            </button>
          </li>
          <li
            v-for="page in totalPages"
            :key="page"
            class="page-item"
            :class="{ active: page === currentPage }"
          >
            <button class="page-link" @click="fetchAttributes(page)">
              {{ page }}
            </button>
          </li>
          <li
            class="page-item"
            :class="{ disabled: currentPage === totalPages }"
          >
            <button
              class="page-link"
              @click="fetchAttributes(currentPage + 1)"
              :disabled="currentPage === totalPages"
            >
              Next
            </button>
          </li>
        </ul>
      </nav> 
    </div> -->

    <!-- Modal Create/Edit Attribute -->
    <div class="modal fade" id="attributeModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ editId ? "Edit Attribute" : "Add Attribute" }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveAttribute">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input v-model="form.name" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Status</label>
                <select v-model="form.status" class="form-select">
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
              <button
                type="submit"
                :class="
                  editId
                    ? 'btn btn-success w-100'
                    : 'btn btn-primary action-btn-dark w-100'
                "
                :disabled="saving"
              >
                {{ saving ? "Saving..." : editId ? "Update" : "Save" }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Delete -->
    <div class="modal fade" id="deleteConfirmModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              Delete Attribute
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <p class="mb-0">
              Are you sure you want to delete this attribute?<br />
              <strong>All of values will be deleted.</strong><br />
              This action cannot be undone.
            </p>
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
              class="btn btn-danger"
              @click="confirmDelete"
              :disabled="deleting !== null"
            >
              <span v-if="deleting">
                <i class="bi bi-hourglass-split me-1"></i>Deleting...
              </span>
              <span v-else> <i class="bi bi-trash me-1"></i>Delete </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface AttributeValue {
  id: number;
  attribute_id: number;
  value: string;
  slug: string;
  sort: number;
  status: string;
}

interface Attribute {
  id: number;
  name: string;
  slug: string;
  sort: number;
  status: string;
  attribute_values?: AttributeValue[];
}

definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

const { getAttributes, createAttribute, updateAttribute, deleteAttribute } =
  useProductRelationsApi();

const attributes = ref<Attribute[]>([]);
const loading = ref(true);
const saving = ref(false);
const errorMessage = ref<string | null>(null);
const deleting = ref<number | null>(null);
const filters = ref({ search: '', status: '' });

const filteredAttributes = computed(() => {
  let list = attributes.value;
  const q = filters.value.search.toLowerCase().trim();
  if (q) {
    list = list.filter(
      (attr) =>
        attr.name.toLowerCase().includes(q) ||
        attr.slug.toLowerCase().includes(q)
    );
  }
  if (filters.value.status) {
    list = list.filter((attr) => attr.status === filters.value.status);
  }
  return list;
});

const handleSearch = () => {
  // ponytail: client-side filter, computed handles it
};

const deleteId = ref<number | null>(null);

const form = ref({
  name: "",
  sort: 0,
  status: "ACTIVE",
});

const editId = ref<number | null>(null);
const bootstrapModal = () => (window as any).bootstrap?.Modal;

const fetchAttributes = async () => {
  loading.value = true;
  const { data, error } = await getAttributes();
  if (error) {
    console.error("Error fetching attributes:", error);
  } else if (data?.success) {
    attributes.value = data.data;
  }
  loading.value = false;
};

const openCreateModal = () => {
  editId.value = null;
  form.value = { name: "", sort: 0, status: "ACTIVE" };
  const modal = bootstrapModal();
  if (!modal) return;
  new modal(document.getElementById("attributeModal")!).show();
};

const openEditModal = (attr: Attribute) => {
  editId.value = attr.id;
  form.value = { name: attr.name, sort: attr.sort, status: attr.status };
  const modal = bootstrapModal();
  if (!modal) return;
  new modal(document.getElementById("attributeModal")!).show();
};

const saveAttribute = async () => {
  saving.value = true;
  errorMessage.value = null;

  const payload = { ...form.value };

  let res;
  if (editId.value) {
    res = await updateAttribute(editId.value, payload);
  } else {
    res = await createAttribute(payload);
  }

  if (res.error) {
    errorMessage.value = res.error.message;
  } else if (res.data?.success) {
    await fetchAttributes();
    bootstrapModal()?.getInstance(
      document.getElementById("attributeModal")!,
    )?.hide();
  }

  saving.value = false;
};

const handleDelete = (id: number) => {
  deleteId.value = id;
  errorMessage.value = null;
  const modal = bootstrapModal();
  if (!modal) return;
  new modal(document.getElementById("deleteConfirmModal")!).show();
};

const confirmDelete = async () => {
  if (!deleteId.value) return;

  deleting.value = deleteId.value;
  errorMessage.value = null;

  const { error } = await deleteAttribute(deleteId.value);

  if (error) {
    errorMessage.value = error.message || "Gagal menghapus atribut";
  } else {
    await fetchAttributes();
  }

  deleting.value = null;
  deleteId.value = null;
  bootstrapModal()?.getInstance(
    document.getElementById("deleteConfirmModal")!,
  )?.hide();
};

onMounted(() => {
  fetchAttributes();
});
</script>

<style scoped>
.table .badge {
  font-weight: 600;
}

.table .badge.bg-info {
  background-color: #d8f0f7 !important;
  color: #164e63 !important;
}

.table .badge.bg-success {
  background-color: #dff3e7 !important;
  color: #166534 !important;
}

.table .badge.bg-secondary {
  background-color: #e5e7eb !important;
  color: #374151 !important;
}
</style>
