<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <p class="text-muted mb-0">Manage vouchers</p>
      </div>
      <NuxtLink
        v-if="hasPermission('vouchers.create')"
        to="/manage-voucher/create"
        class="btn btn-primary action-btn-dark"
      >
        <span class="me-2">+</span>Create New Voucher
      </NuxtLink>
    </div>

    <!-- Vouchers Table -->
    <div v-if="hasPermission('vouchers.read')" class="card">
      <div class="card-body">
        <div v-if="loadingVouchers" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2 text-muted">Loading vouchers...</p>
        </div>

        <div v-else-if="vouchers.length === 0" class="text-center py-5">
          <p class="text-muted">
            No vouchers found. Create your first voucher!
          </p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-striped table-hover align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <!-- <th>Code</th> -->
                <th>Status</th>
                <th>Limit User</th>
                <th>Voucher Used</th>
                <th>Discount Value</th>
                <th>Voucher Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <!-- <th>Product Categories</th> -->
                <!-- <th>Discount Type</th> -->
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(voucher, index) in vouchers" :key="voucher.id">
                <td>
                  <span class="badge bg-secondary">{{
                    getRowNumber(index)
                  }}</span>
                </td>
                <td>
                  <strong>{{ voucher.name }}</strong>
                </td>
                <!-- <td>
                  <code class="text-muted">{{ voucher.code }}</code>
                </td> -->
                <td>
                  <span
                    :class="[
                      'badge',
                      voucher.status === 'ACTIVE'
                        ? 'bg-success'
                        : voucher.status === 'INACTIVE'
                          ? 'bg-warning'
                          : 'bg-secondary',
                    ]"
                  >
                    {{ voucher.status || "DRAFT" }}
                  </span>
                </td>
                <td class="text-end">
                  <span v-if="voucher.limit_user">
                    {{ voucher.limit_user }}
                  </span>
                  <span v-else class="badge bg-secondary">Infinite</span>
                </td>
                <td class="text-end">
                  {{ voucher.voucher_used === 0 ? "-" : voucher.voucher_used }}
                </td>
                <td>
                  {{ formatDiscountValue(voucher) }}
                </td>
                <td>{{ voucher.discount_type }}</td>
                <td>
                  <div v-if="formatDateTime(voucher.start_date)">
                    <div>{{ formatDateTime(voucher.start_date)?.date }}</div>
                    <small class="text-muted">
                      {{ formatDateTime(voucher.start_date)?.time }}
                    </small>
                  </div>
                  <span v-else>-</span>
                </td>
                <td>
                  <div v-if="formatDateTime(voucher.end_date)">
                    <div>{{ formatDateTime(voucher.end_date)?.date }}</div>
                    <small class="text-muted">
                      {{ formatDateTime(voucher.end_date)?.time }}
                    </small>
                  </div>
                  <span v-else>-</span>
                </td>
                <!-- <td style="max-width: 250px;">
                  <span v-if="voucher.categories?.length" class="d-flex flex-wrap gap-1">
                    <span
                      v-for="category in voucher.categories"
                      :key="category.id"
                      class="badge bg-info"
                    >
                      {{ category.taxonomy_name || '-' }}
                    </span>
                  </span>
                  <span v-else class="badge bg-secondary">All</span>
                </td> -->
                <!-- <td>
                  {{ voucher.discount_type || '-' }}
                </td> -->
                <td class="text-end">
                  <div class="d-flex justify-content-end gap-2">
                    <NuxtLink
                      v-if="hasPermission('vouchers.read')"
                      :to="`/manage-voucher/${voucher.id}`"
                      class="btn btn-sm btn-outline-info"
                      title="View"
                    >
                      <i class="bi bi-eye"></i>
                    </NuxtLink>
                    <NuxtLink
                      v-if="hasPermission('vouchers.update')"
                      :to="`/manage-voucher/edit/${voucher.id}`"
                      class="btn btn-sm btn-outline-primary"
                      title="Edit"
                    >
                      <i class="bi bi-pencil"></i>
                    </NuxtLink>
                    <button
                      v-if="hasPermission('vouchers.delete')"
                      type="button"
                      class="btn btn-sm btn-outline-danger"
                      @click="handleDeleteClick(voucher)"
                      title="Delete"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="pagination && pagination.last_page > 1" class="mt-3">
          <div
            class="d-flex flex-column flex-md-row justify-content-center justify-content-md-between align-items-center gap-2"
          >
            <div
              class="text-muted text-center text-md-start small"
              style="font-size: 0.875rem"
            >
              Showing {{ pagination.from }} to {{ pagination.to }} of
              {{ pagination.total }} entries
            </div>
            <nav aria-label="Page navigation">
              <ul class="pagination mb-0">
                <li
                  class="page-item"
                  :class="{ disabled: pagination.current_page === 1 }"
                >
                  <a
                    class="page-link"
                    href="#"
                    @click.prevent="changePage(pagination.current_page - 1)"
                  >
                    Previous
                  </a>
                </li>
                <li
                  v-for="page in getPageNumbers()"
                  :key="page"
                  class="page-item"
                  :class="{
                    active:
                      typeof page === 'number' &&
                      page === pagination.current_page,
                    disabled: page === '...',
                  }"
                >
                  <a
                    v-if="page !== '...'"
                    class="page-link"
                    href="#"
                    @click.prevent="changePage(Number(page))"
                  >
                    {{ page }}
                  </a>
                  <span v-else class="page-link">{{ page }}</span>
                </li>
                <li
                  class="page-item"
                  :class="{
                    disabled: pagination.current_page === pagination.last_page,
                  }"
                >
                  <a
                    class="page-link"
                    href="#"
                    @click.prevent="changePage(pagination.current_page + 1)"
                  >
                    Next
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="card">
      <div class="card-body">
        <div class="text-center py-5">
          <p class="text-muted">You don't have permission to view vouchers.</p>
        </div>
      </div>
    </div>

    <!-- Delete Voucher Modal -->
    <div
      id="deleteVoucherModal"
      class="modal fade"
      tabindex="-1"
      aria-labelledby="deleteVoucherModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteVoucherModalLabel">
              Delete Voucher
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>
              Are you sure you want to delete
              <strong>{{ voucherToDelete?.name }}</strong
              >? This action cannot be undone.
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
              @click="handleDeleteVoucher"
              :disabled="isLoading"
            >
              {{ isLoading ? "Deleting..." : "Delete Voucher" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Voucher } from "~/types/voucher";

definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

useAppTitle("Manage Vouchers");

const { getVouchers, deleteVoucher, getAllVouchers } = useVoucherApi();
const { hasPermission } = usePermission();

const vouchers = ref<Voucher[]>([]);
const loadingVouchers = ref(false);
const isLoading = ref(false);
const currentPage = ref(1);
const perPage = ref(15);
const pagination = ref<{
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number | null;
  to: number | null;
} | null>(null);
const voucherToDelete = ref<Voucher | null>(null);

const loadVouchers = async (page: number = currentPage.value) => {
  loadingVouchers.value = true;
  currentPage.value = page;
  try {
    const { data, error } = await getAllVouchers(page, perPage.value);
    if (error || !data?.success) {
      console.error("Failed to load vouchers:", error);
      vouchers.value = [];
    } else if (data.data) {
      vouchers.value = data.data.vouchers || [];
      if (data.data.pagination) {
        pagination.value = {
          ...data.data.pagination,
          from: data.data.pagination.from || null,
          to: data.data.pagination.to || null,
        };
      }
    }
  } catch (err) {
    console.error("Error loading vouchers:", err);
    vouchers.value = [];
  } finally {
    loadingVouchers.value = false;
  }
};

const changePage = (page: number) => {
  if (page >= 1 && page <= (pagination.value?.last_page || 1)) {
    loadVouchers(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const getPageNumbers = (): (number | string)[] => {
  if (!pagination.value) return [];

  const current = pagination.value.current_page;
  const last = pagination.value.last_page;
  const pages: (number | string)[] = [];

  if (last <= 7) {
    for (let i = 1; i <= last; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    if (current > 3) {
      pages.push("...");
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(last - 1, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current < last - 2) {
      pages.push("...");
    }

    pages.push(last);
  }

  return pages;
};

const handleDeleteClick = async (voucher: Voucher) => {
  voucherToDelete.value = voucher;
  await nextTick();
  const modal = new (window as any).bootstrap.Modal(
    document.getElementById("deleteVoucherModal"),
  );
  modal.show();
};

const handleDeleteVoucher = async () => {
  if (!voucherToDelete.value) return;
  try {
    isLoading.value = true;
    const { data, error } = await deleteVoucher(voucherToDelete.value.id);
    if (error) {
      alert(error.message || "Failed to delete voucher");
      return;
    }
    if (data?.success) {
      const modal = (window as any).bootstrap.Modal.getInstance(
        document.getElementById("deleteVoucherModal"),
      );
      modal?.hide();
      voucherToDelete.value = null;
      if (vouchers.value.length === 1 && currentPage.value > 1) {
        await loadVouchers(currentPage.value - 1);
      } else {
        await loadVouchers(currentPage.value);
      }
    }
  } catch (err) {
    alert(err instanceof Error ? err.message : "Failed to delete voucher");
  } finally {
    isLoading.value = false;
  }
};

const formatDateTime = (date: string | null | undefined) => {
  if (!date) return null;

  const d = new Date(date);

  return {
    date: d.toLocaleDateString("id-ID"),
    time: d
      .toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(".", ":"),
  };
};

const getRowNumber = (index: number) => {
  if (!pagination.value || !pagination.value.from) {
    return index + 1;
  }
  return pagination.value.from + index;
};

const formatDiscountValue = (voucher: Voucher) => {
  if (!voucher.discount_value) return "-";
  const value = Number(voucher.discount_value);

  if (voucher.discount_type === "PERCENTAGE") {
    return `${value % 1 === 0 ? value.toFixed(0) : value}%`;
  }

  return `Rp ${value.toLocaleString("id-ID")}`;
};

onMounted(async () => {
  await loadVouchers();
});
</script>
