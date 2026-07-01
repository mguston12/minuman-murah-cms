<template>
  <div>
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <p class="mb-0">Manage Product Groups</p>
      </div>
      <NuxtLink to="/manage-product-groups/create" class="btn btn-primary action-btn-dark">
        <i class="bi bi-plus-circle me-2"></i>Create Group
      </NuxtLink>
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
              placeholder="Search title..."
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
      <p class="mt-2 text-muted">Loading product groups...</p>
    </div>

    <!-- Product Groups Table -->
    <div v-else class="card">
      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Sub-Groups</th>
              <th>Status</th>
              <th>Sort</th>
              <th class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredGroups.length === 0">
              <td colspan="6" class="text-center py-5 text-muted">
                No product groups found. Create your first group!
              </td>
            </tr>
            <tr v-for="group in filteredGroups" :key="group.id">
              <td>
                <img
                  v-if="group.image_url"
                  :src="group.image_url"
                  :alt="group.title"
                  class="img-thumbnail"
                  style="max-width: 80px; max-height: 80px; object-fit: cover"
                />
                <span v-else class="text-muted small">No image</span>
              </td>
              <td>
                <strong>{{ group.title }}</strong>
              </td>
              <td>
                <NuxtLink
                  :to="`/manage-product-groups/${group.id}`"
                  class="badge bg-info text-decoration-none"
                >
                  {{ group.sub_groups?.length || 0 }}
                  sub-groups
                  <i class="bi bi-arrow-right-short ms-1"></i>
                </NuxtLink>
              </td>
              <td>
                <span
                  :class="[
                    'badge',
                    group.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary',
                  ]"
                >
                  {{ group.status }}
                </span>
              </td>
              <td>{{ group.sort }}</td>
              <td class="text-end">
                <NuxtLink
                  :to="`/manage-product-groups/${group.id}/edit`"
                  class="btn btn-sm btn-outline-primary me-2"
                  title="Edit"
                >
                  <i class="bi bi-pencil"></i>
                </NuxtLink>
                <button
                  type="button"
                  class="btn btn-sm btn-outline-danger"
                  @click="handleDelete(group.id)"
                  title="Delete"
                  :disabled="deleting === group.id"
                >
                  <i
                    v-if="deleting === group.id"
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
    <div
      v-if="!loading && totalPages > 1"
      class="d-flex justify-content-center mt-4"
    >
      <nav>
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button
              class="page-link action-btn-dark"
              @click="fetchGroups(currentPage - 1)"
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
            <button class="page-link action-btn-dark" @click="fetchGroups(page)">
              {{ page }}
            </button>
          </li>
          <li
            class="page-item"
            :class="{ disabled: currentPage === totalPages }"
          >
            <button
              class="page-link"
              @click="fetchGroups(currentPage + 1)"
              :disabled="currentPage === totalPages"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

import type { ProductGroup } from "~/types/product-group";

const { getProductGroups, deleteProductGroup } = useProductGroupApi();

const groups = ref<ProductGroup[]>([]);
const loading = ref(true);
const deleting = ref<number | null>(null);
const currentPage = ref(1);
const totalPages = ref(1);
const filters = ref({ search: '', status: '' });

const filteredGroups = computed(() => {
  let list = groups.value;
  const search = filters.value.search?.toLowerCase().trim();
  if (search) {
    list = list.filter((g) => g.title?.toLowerCase().includes(search));
  }
  if (filters.value.status) {
    list = list.filter((g) => g.status === filters.value.status);
  }
  return list;
});

const handleSearch = () => {
  fetchGroups(1);
};

const fetchGroups = async (page = 1) => {
  loading.value = true;

  const { data, error } = await getProductGroups(page, filters.value.search || undefined);

  if (error) {
    console.error("Failed to fetch product groups:", error);
  } else if (data) {
    groups.value = data.data.data;
    currentPage.value = data.data.current_page;
    totalPages.value = data.data.last_page;
  }

  loading.value = false;
};

const handleDelete = async (id: number) => {
  if (
    !confirm(
      "Are you sure you want to delete this group? Sub-groups will also be deleted.",
    )
  ) {
    return;
  }

  deleting.value = id;

  const { error } = await deleteProductGroup(id);

  if (error) {
    console.error("Failed to delete product group:", error);
    alert("Failed to delete product group");
  } else {
    await fetchGroups(currentPage.value);
  }

  deleting.value = null;
};

onMounted(fetchGroups);
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
