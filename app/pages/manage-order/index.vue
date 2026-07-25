<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <p class="text-muted mb-0">Manage Orders</p>
      </div>
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
              placeholder="Search by order number..."
              @input="handleSearch"
            />
          </div>
          <div class="col-md-4">
            <select
              v-model="filters.status"
              class="form-select form-select-sm"
              @change="loadOrders(1)"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="PACKING">Packing</option>
              <option value="DELIVERING">Delivering</option>
              <option value="DELIVERED">Delivered</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Orders Table -->
    <div v-if="hasPermission('orders.read')" class="card">
      <div class="card-body">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2 text-muted">Loading orders...</p>
        </div>

        <div v-else-if="orders.length === 0" class="text-center py-5">
          <p class="text-muted">No orders found.</p>
        </div>

        <div v-else>
          <div class="table-responsive">
            <table class="table table-striped table-hover align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Order Number</th>
                  <th>Contact Email</th>
                  <th>Status</th>
                  <th>Payment Status</th>
                  <th>Resi Number</th>
                  <th>Date</th>
                  <th v-if="hasPermission('orders.update')" class="text-end">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(order, index) in orders" :key="order.id">
                  <td>
                    <span class="badge bg-secondary">{{
                      getRowNumber(index)
                    }}</span>
                  </td>
                  <td>
                    <NuxtLink :to="`/manage-order/${order.id}`">{{
                      order.order_number
                    }}</NuxtLink>
                  </td>
                  <td>
                    <span v-if="order.contact_email">
                      {{ order.contact_email }}
                    </span>
                    <span v-else class="text-muted">Guest</span>
                  </td>
                  <td>
                    <span :class="`badge ${getStatusBadge(order.status)}`">
                     {{ order.status === 'DELIVERING' ? "SHIPPED" : order.status }}
                    </span>
                  </td>
                  <td>
                    <span
                      :class="`badge ${getPaymentBadge(order.payment?.status)}`"
                      >{{ order.payment?.status }}</span
                    >
                  </td>
                  <td>
                    <span v-if="order.courier?.resi_number" class="text-muted">
                      {{ order.courier.resi_number }}
                    </span>
                    <span v-else class="text-muted">-</span>
                  </td>
                  <td>{{ formatDate(order.created_at) }}</td>
                  <td v-if="hasPermission('orders.update')" class="text-end">
                    <button
                      v-if="order.status === 'PACKING'"
                      @click="openUpdateStatusModal(order)"
                      class="btn btn-sm btn-outline-info"
                      title="Update Status ke Delivering"
                    >
                      <i class="bi bi-truck"></i>
                    </button>
                    <button
                      v-if="order.status === 'DELIVERING'"
                      @click="openUpdateStatusModal(order)"
                      class="btn btn-sm btn-outline-success"
                      title="Update Status ke Delivered"
                    >
                      <i class="bi bi-check-circle"></i>
                    </button>
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
                      disabled:
                        pagination.current_page === pagination.last_page,
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
    </div>
    <div v-else class="card">
      <div class="card-body">
        <div class="text-center py-5">
          <p class="text-muted">You don't have permission to view products.</p>
        </div>
      </div>
    </div>

    <!-- Update Status Modal -->
    <div
      v-if="orderToUpdate"
      class="modal fade"
      id="updateStatusModal"
      tabindex="-1"
      aria-labelledby="updateStatusModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="updateStatusModalLabel">
              Update Order Status
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
              <label class="form-label">Order Number</label>
              <input
                type="text"
                class="form-control"
                :value="orderToUpdate.order_number"
                disabled
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Current Status</label>
              <input
                type="text"
                class="form-control"
                :value="orderToUpdate?.status === 'DELIVERING' ? 'SHIPPED' : orderToUpdate?.status"
                disabled
              />
            </div>
            <div class="mb-3">
              <label class="form-label"
                >New Status <span class="text-danger">*</span></label
              >
              <select
                v-model="updateStatusForm.status"
                class="form-select"
                required
              >
                <option
                  v-if="orderToUpdate?.status === 'PACKING'"
                  value="DELIVERING"
                >
                  SHIPPED
                </option>
                <option
                  v-if="orderToUpdate?.status === 'DELIVERING'"
                  value="DELIVERED"
                >
                  DELIVERED
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">
                Nomor Resi
                <span
                  v-if="updateStatusForm.status === 'DELIVERING'"
                  class="text-danger"
                  >*</span
                >
              </label>
              <input
                v-model="updateStatusForm.resiNumber"
                type="text"
                class="form-control"
                placeholder="Masukkan nomor resi"
                :required="updateStatusForm.status === 'DELIVERING'"
              />
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
              class="btn btn-success"
              @click="handleUpdateStatus"
              :disabled="
                isUpdating ||
                (updateStatusForm.status === 'DELIVERING' &&
                  !updateStatusForm.resiNumber)
              "
            >
              <span
                v-if="isUpdating"
                class="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Update Status
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from "~/types/order";

definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

useAppTitle("Manage Orders");

const { hasPermission } = usePermission();
const { getOrders, updateOrderStatus } = useOrderApi();
const toast = useToast();

const currentPage = ref(1);
const perPage = ref(15);

const filters = reactive({
  search: "",
  status: "",
});

const orders = ref<Order[]>([]);
const pagination = ref<any>(null);
const loading = ref(false);
const orderToUpdate = ref<Order | null>(null);
const isUpdating = ref(false);
const updateStatusForm = reactive({
  status: "DELIVERING" as Order["status"],
  resiNumber: "",
});

/**
 * Load orders
 */
const loadOrders = async (page: number = currentPage.value) => {
  currentPage.value = page;
  loading.value = true;

  const { data, error } = await getOrders(
    page,
    perPage.value,
    filters.search || undefined,
    filters.status || undefined,
  );

  if (error || !data?.success) {
    orders.value = [];
    pagination.value = null;
  } else if (Array.isArray(data.data)) {
    orders.value = data.data;
    pagination.value = null;
  } else {
    orders.value = data.data.orders || [];
    pagination.value = data.data.pagination ?? null;
  }

  loading.value = false;
};

/**
 * Pagination
 */
const changePage = (page: number) => {
  if (!pagination.value) return;
  if (page < 1 || page > pagination.value.last_page) return;

  loadOrders(page);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const getPageNumbers = (): (number | string)[] => {
  if (!pagination.value) return [];

  const current = pagination.value.current_page;
  const last = pagination.value.last_page;
  const pages: (number | string)[] = [];

  if (last <= 7) {
    for (let i = 1; i <= last; i++) pages.push(i);
  } else {
    pages.push(1);

    if (current > 3) pages.push("...");

    const start = Math.max(2, current - 1);
    const end = Math.min(last - 1, current + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (current < last - 2) pages.push("...");

    pages.push(last);
  }

  return pages;
};

/**
 * Filters
 */
let searchTimeout: ReturnType<typeof setTimeout>;

const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    loadOrders(1);
  }, 400);
};

const getRowNumber = (index: number) => {
  if (!pagination.value || !pagination.value.from) {
    return index + 1;
  }
  return pagination.value.from + index;
};

/**
 * Helpers
 */
const formatDate = (date?: string) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID");
};

const getStatusBadge = (status: Order["status"]) => {
  switch (status) {
    case "PENDING":
      return "bg-warning";
    case "PACKING":
      return "bg-info";
    case "DELIVERING":
      return "bg-primary";
    case "DELIVERED":
      return "bg-success";
    case "COMPLETED":
      return "bg-success";
    case "CANCELLED":
      return "bg-danger";
    default:
      return "bg-secondary";
  }
};

type PaymentStatus = NonNullable<Order["payment"]>["status"];

const getPaymentBadge = (status?: PaymentStatus) => {
  switch (status) {
    case "PAID":
      return "bg-success";
    case "PENDING":
      return "bg-warning";
    case "FAILED":
      return "bg-danger";
    case "CANCELLED":
      return "bg-secondary";
    case "REFUNDED":
      return "bg-info";
    default:
      return "bg-secondary";
  }
};

const openUpdateStatusModal = (order: Order) => {
  orderToUpdate.value = order;
  if (order.status === "PACKING") {
    updateStatusForm.status = "DELIVERING";
  } else if (order.status === "DELIVERING") {
    updateStatusForm.status = "DELIVERED";
  }
  updateStatusForm.resiNumber = order.courier?.resi_number || "";

  nextTick(() => {
    const modalElement = document.getElementById("updateStatusModal");
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();

      modalElement.addEventListener(
        "hidden.bs.modal",
        () => {
          orderToUpdate.value = null;
          updateStatusForm.resiNumber = "";
        },
        { once: true },
      );
    }
  });
};

const handleUpdateStatus = async () => {
  if (!orderToUpdate.value) return;

  if (updateStatusForm.status === "DELIVERING" && !updateStatusForm.resiNumber)
    return;

  isUpdating.value = true;
  try {
    const { data, error } = await updateOrderStatus(
      orderToUpdate.value.id,
      updateStatusForm.status,
      updateStatusForm.resiNumber,
    );

    if (error || !data?.success) {
      toast.error(error?.message || "Failed to update order status");
      return;
    }

    toast.success("Order status updated successfully");

    const modalElement = document.getElementById("updateStatusModal");
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }

    await loadOrders(currentPage.value);
  } catch (err) {
    toast.error("An error occurred while updating order status");
  } finally {
    isUpdating.value = false;
  }
};

onMounted(() => {
  loadOrders();
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

.table .badge.bg-warning {
  background-color: #fdf1d3 !important;
  color: #8a5a00 !important;
}

.table .badge.bg-info {
  background-color: #d8f0f7 !important;
  color: #164e63 !important;
}

.table .badge.bg-primary {
  background-color: #dbeafe !important;
  color: #1d4ed8 !important;
}

.table .badge.bg-danger {
  background-color: #fee2e2 !important;
  color: #b91c1c !important;
}
</style>
