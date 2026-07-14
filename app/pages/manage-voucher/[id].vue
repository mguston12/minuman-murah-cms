<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="mb-0">Voucher Details</h4>
        <p class="text-muted mb-0">View voucher information</p>
      </div>
      <div>
        <NuxtLink to="/manage-voucher" class="btn btn-secondary me-2">
          <i class="bi bi-arrow-left me-2"></i>Back to List
        </NuxtLink>
        <NuxtLink
          :to="`/manage-voucher/edit/${voucher?.id}`"
          class="btn btn-primary action-btn-dark"
          v-if="voucher"
        >
          <i class="bi bi-pencil me-2"></i>Edit Voucher
        </NuxtLink>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status"></div>
    </div>

    <!-- Error -->
    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <!-- Voucher Details -->
    <div v-if="voucher" class="card">
      <div class="card-body">
        <div class="mb-4"></div>

        <!-- STATUS ON TOP LEFT -->
        <div class="row mb-3">
          <div class="col-12">
            <h6 class="text-muted">Status</h6>
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
          </div>
        </div>

        <div class="row g-3">
          <div class="col-md-6">
            <h6 class="text-muted">Name</h6>
            <p>{{ voucher.name }}</p>
          </div>

          <div class="col-md-6">
            <h6 class="text-muted">Code</h6>
            <p>{{ voucher.code }}</p>
          </div>

          <div class="col-md-6">
            <h6 class="text-muted">Discount Type</h6>
            <p>{{ voucher.discount_type }}</p>
          </div>

          <div class="col-md-6">
            <h6 class="text-muted">Discount Value</h6>
            {{ formatDiscountValue(voucher) }}
          </div>

          <div class="col-md-6">
            <h6 class="text-muted">Minimum Purchase</h6>
            <p>
              {{
                voucher.min_purchase
                  ? "Rp " + Number(voucher.min_purchase).toLocaleString("id-ID")
                  : "No minimum"
              }}
            </p>
          </div>

          <div class="col-md-6">
            <h6 class="text-muted">Limit User</h6>
            <p>{{ voucher.limit_user ?? "Unlimited" }}</p>
          </div>

          <div class="col-md-6">
            <h6 class="text-muted">Voucher Used</h6>
            <p>{{ voucher.voucher_used ?? "0" }}</p>
          </div>

          <div class="col-md-6">
            <h6 class="text-muted">Start Date</h6>
            <div v-if="formatDateTime(voucher.start_date)">
              <div>{{ formatDateTime(voucher.start_date)?.date }}</div>
              <small class="text-muted">
                {{ formatDateTime(voucher.start_date)?.time }}
              </small>
            </div>
          </div>

          <div class="col-md-6">
            <h6 class="text-muted">End Date</h6>
            <div v-if="formatDateTime(voucher.end_date)">
              <div>{{ formatDateTime(voucher.end_date)?.date }}</div>
              <small class="text-muted">
                {{ formatDateTime(voucher.end_date)?.time }}
              </small>
            </div>
          </div>

          <div class="col-md-6">
            <h6 class="text-muted">Categories</h6>
            <div>
              <span v-if="voucher.categories?.length">
                <span
                  v-for="category in voucher.categories"
                  :key="category.id"
                  class="badge bg-info me-1"
                >
                  {{ category.taxonomy_name || "-" }}
                </span>
              </span>
              <span v-else>-</span>
            </div>
          </div>

          <div class="col-12">
            <h6 class="text-muted">Description</h6>
            <p>{{ voucher.description ?? "-" }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Voucher } from "~/types/voucher";
import { useVoucherApi } from "~/composables/useVoucherApi";

definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

useAppTitle("Voucher Details");

const route = useRoute();
const { getAdminVoucher } = useVoucherApi();

const voucher = ref<Voucher | null>(null);
const loading = ref(false);
const error = ref("");

const loadVoucher = async () => {
  loading.value = true;
  error.value = "";

  const id = Number(route.params.id);

  const { data, error: apiError } = await getAdminVoucher(id);

  if (apiError) {
    error.value = apiError.message || "Failed to load voucher";
  } else if (data?.data) {
    voucher.value = data.data;
  }

  loading.value = false;
};

const formatDateTime = (date: string | null | undefined) => {
  if (!date) return null;

  const d = new Date(date);

  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;

  const formattedTime = `${String(hours).padStart(2, "0")}:${minutes}:${seconds} ${ampm}`;

  return {
    date: d.toLocaleDateString("id-ID"),
    time: formattedTime,
  };
};

const formatDiscountValue = (voucher: Voucher) => {
  if (voucher.discount_value === null || voucher.discount_value === undefined)
    return "-";
  const value = Number(voucher.discount_value);

  if (voucher.discount_type === "PERCENTAGE") {
    return `${value % 1 === 0 ? value.toFixed(0) : value}%`;
  }

  return `Rp ${value.toLocaleString("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

onMounted(() => {
  loadVoucher();
});
</script>
