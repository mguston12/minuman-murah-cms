<template>
  <div class="dashboard-page">
    <!-- Page Title -->
    <div class="pagetitle">
      <h1>Dashboard</h1>
      <nav>
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <NuxtLink to="/dashboard">Home</NuxtLink>
          </li>
          <li class="breadcrumb-item active">Dashboard</li>
        </ol>
      </nav>
    </div>

    <section class="section dashboard">
      <div class="row">
        <!-- ================= STATS CARDS ================= -->
        <div class="col-12">
          <div class="row g-3">
            <div class="col-12 col-md-4">
              <NuxtLink to="/manage-product">
                <DashboardStatsCard
                  title="Total Products"
                  subtitle="In Catalog"
                  :value="formatNumber(dashboardStats.totalProducts)"
                  icon="bi-bag"
                  :loading="isLoading"
                />
              </NuxtLink>
            </div>

            <div class="col-12 col-md-4">
              <NuxtLink to="/manage-order">
                <DashboardStatsCard
                  title="Total Orders"
                  subtitle="All Orders"
                  :value="formatNumber(dashboardStats.totalOrders)"
                  icon="bi-cart"
                  :loading="isLoading"
                />
              </NuxtLink>
            </div>

            <div class="col-12 col-md-4">
              <NuxtLink to="/users">
                <DashboardStatsCard
                  title="Total Users"
                  subtitle="All Customers"
                  :value="formatNumber(dashboardStats.totalUsers)"
                  icon="bi-people"
                  :loading="isLoading"
                />
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- ================= RECENT ORDERS ================= -->
        <div class="col-lg-6">
          <div class="card recent-sales overflow-auto">
            <div class="card-body">
              <h5 class="card-title">Recent Orders <span>| Latest</span></h5>

              <div v-if="isLoading" class="text-center p-4">Loading...</div>

              <table v-else class="table table-borderless datatable">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Order No</th>
                    <th>User</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(order, index) in recentOrders" :key="order.id">
                    <td>{{ index + 1 }}</td>
                    <td class="fw-bold">{{ order.order_number }}</td>
                    <td>{{ order.user?.email }}</td>
                    <td>Rp {{ formatNumber(order.total_amount) }}</td>
                    <td>
                      <span
                        :class="[
                          'badge',
                          order.payment?.status === 'PAID'
                            ? 'bg-success'
                            : order.payment?.status === 'PENDING'
                              ? 'bg-warning'
                              : 'bg-secondary',
                        ]"
                      >
                        {{ order.payment?.status ?? "-" }}
                      </span>
                    </td>
                  </tr>

                  <tr v-if="!recentOrders.length && !isLoading">
                    <td colspan="5" class="text-center">No data available</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ================= RECENT USERS ================= -->
        <div class="col-lg-6">
          <div class="card recent-sales overflow-auto">
            <div class="card-body">
              <h5 class="card-title">Recent Users <span>| Latest</span></h5>

              <div v-if="isLoading" class="text-center p-4">Loading...</div>

              <table v-else class="table table-borderless datatable">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(user, index) in recentUsers" :key="user.id">
                    <td>{{ index + 1 }}</td>
                    <td class="fw-bold">
                      {{ user.name }} {{ user.last_name }}
                    </td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.phone }}</td>
                    <td>
                      <span
                        v-if="user.email_verified_at"
                        class="badge bg-success"
                      >
                        Verified
                      </span>
                      <span v-else class="badge bg-warning"> Unverified </span>
                    </td>
                  </tr>

                  <tr v-if="!recentUsers.length && !isLoading">
                    <td colspan="5" class="text-center">No data available</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useUserManagement } from "~/composables/useUserManagement";
import type { Order } from "~/types/order";

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

const userManagement = useUserManagement();
const { getOrders } = useOrderApi();
const { getSummary } = useDashboardApi();

const isLoading = ref(false);

const dashboardStats = ref({
  totalProducts: 0,
  totalOrders: 0,
  totalVouchers: 0,
  totalUsers: 0,
});

const recentUsers = ref<any[]>([]);
const recentOrders = ref<Order[]>([]);

const formatNumber = (value: number | undefined) => {
  return (value ?? 0).toLocaleString("id-ID");
};

const loadDashboardData = async () => {
  const token = useCookie("auth_token");
  if (!token.value) return;

  isLoading.value = true;

  try {
    // SUMMARY
    const summaryRes = await getSummary();
    if (summaryRes.data?.success) {
      dashboardStats.value.totalProducts =
        summaryRes.data.data.total_products ?? 0;
      dashboardStats.value.totalOrders = summaryRes.data.data.total_orders ?? 0;
      dashboardStats.value.totalVouchers =
        summaryRes.data.data.total_vouchers ?? 0;
      dashboardStats.value.totalUsers =
        summaryRes.data.data.total_customers ?? 0;
    }

    // USERS
    await userManagement.fetchUsers(token.value);
    recentUsers.value = userManagement.users.slice(0, 5);

    // ORDERS
    const orderRes = await getOrders(1, 5);
    if (orderRes.data?.success) {
      const ordersData = orderRes.data.data;
      recentOrders.value = Array.isArray(ordersData) ? ordersData : (ordersData.orders ?? []);
    }
  } catch (err) {
    console.error("Dashboard load error:", err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadDashboardData();
});
</script>

<style scoped>
.dashboard-page,
.dashboard-page :deep(.pagetitle h1),
.dashboard-page :deep(.card),
.dashboard-page :deep(.card-body),
.dashboard-page :deep(.card-title),
.dashboard-page :deep(.card-title span),
.dashboard-page :deep(table),
.dashboard-page :deep(th),
.dashboard-page :deep(td),
.dashboard-page :deep(h6),
.dashboard-page :deep(p),
.dashboard-page :deep(span) {
  color: #000;
}

.dashboard-page :deep(a) {
  text-decoration: none;
}

.dashboard-page :deep(.breadcrumb-item),
.dashboard-page :deep(.breadcrumb-item.active),
.dashboard-page :deep(.breadcrumb-item a) {
  color: #5f6b7a !important;
}

.dashboard-page :deep(.page-link) {
  background-color: #fff;
  border: 1px solid #000;
  color: #000;
}

.dashboard-page :deep(.page-item.active .page-link) {
  background-color: #000;
  border-color: #000;
  color: #fff;
}

.dashboard-page :deep(.page-item.disabled .page-link) {
  background-color: #fff;
  border-color: #ccc;
  color: #ccc;
}

.dashboard-page :deep(.badge) {
  font-weight: 600;
}

.dashboard-page :deep(.badge.bg-success) {
  background-color: #dff3e7 !important;
  color: #166534 !important;
}

.dashboard-page :deep(.badge.bg-warning) {
  background-color: #fdf1d3 !important;
  color: #8a5a00 !important;
}

.dashboard-page :deep(.badge.bg-secondary) {
  background-color: #e5e7eb !important;
  color: #374151 !important;
}

.activity-item {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}
.activity-item:last-child {
  border-bottom: none;
}
</style>
