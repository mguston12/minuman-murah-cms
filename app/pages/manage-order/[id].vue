<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2 text-muted">Loading order details...</p>
    </div>

    <!-- Order Not Found -->
    <div v-else-if="!order" class="card">
      <div class="card-body text-center py-5">
        <h5>Order not found</h5>
        <p class="text-muted">The order you're looking for doesn't exist.</p>
        <NuxtLink to="/manage-order" class="btn btn-primary">
          Back to Orders
        </NuxtLink>
      </div>
    </div>

    <!-- Order Detail Content -->
    <div v-else>
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 class="mb-0">Order Details</h4>
          <p class="text-muted mb-0">{{ order.order_number }}</p>
        </div>
        <div>
          <button class="btn btn-primary me-2 " @click="downloadPDF">
            <i class="bi bi-download me-2"></i>Download PDF
          </button>
          <NuxtLink to="/manage-order" class="btn btn-secondary">
            <i class="bi bi-arrow-left me-2"></i>Back
          </NuxtLink>
        </div>
      </div>

      <!-- Order Info Cards -->
      <div class="row g-4">
        <!-- Order Information -->
        <div class="col-md-6">
          <div class="card h-100">
            <div class="card-header">
              <h6 class="mb-0">Order Information</h6>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <label class="text-muted small">Order Number</label>
                <p class="mb-0 fw-semibold">{{ order.order_number }}</p>
              </div>
              <div class="mb-3">
                <label class="text-muted small">Order Date</label>
                <p class="mb-0">{{ formatDate(order.created_at) }}</p>
              </div>
              <div class="mb-3">
                <label class="text-muted small">Status</label>
                <span :class="`ml-2 badge ${getStatusBadge(order.status)}`">
                  {{ order.status === "DELIVERING" ? "SHIPPED" : order.status }} 
                </span> 
              </div>
              <div class="mb-3">
                <label class="text-muted small">Payment Status</label>
                <span
                  :class="`ml-2 badge ${getPaymentBadge(order.payment?.status)}`"
                >
                  {{ order.payment?.status }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Customer Information -->
        <div class="col-md-6">
          <div class="card h-100">
            <div class="card-header">
              <h6 class="mb-0">Customer Information</h6>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <label class="text-muted small">Name</label>
                <p class="mb-0 fw-semibold">
                  {{ order.shipping.first_name }}
                  {{ order.shipping.last_name || "" }}
                </p>
              </div>
              <div class="mb-3">
                <label class="text-muted small">Email</label>
                <p class="mb-0">{{ order.contact_email || "-" }}</p>
              </div>
              <div class="mb-3">
                <label class="text-muted small">Phone</label>
                <p class="mb-0">{{ order.contact_phone || "-" }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Shipping Address -->
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h6 class="mb-0">Shipping Address</h6>
            </div>
            <div class="card-body">
              <p class="mb-0">
                {{ order.shipping.address }}
                {{ order.shipping.city }}, {{ order.shipping.province }}
                {{ order.shipping.postal_code }}
              </p>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h6 class="mb-0">Order Items</h6>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in order.order_items" :key="item.id">
                      <td>
                        <div class="d-flex align-items-center gap-2">
                          <img
                            :src="item.product_image || '/placeholder.png'"
                            :alt="item.product_name"
                            class="rounded"
                            style="width: 50px; height: 50px; object-fit: cover"
                          />
                          <div>
                            <p class="mb-0 fw-semibold">
                              {{ item.product_name }}
                            </p>
                            <small
                              class="text-muted"
                              v-if="item.variant_description"
                            >
                              {{ item.variant_description }}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>{{ item.qty }}</td>
                      <td>{{ formatPrice(item.purchase_price) }}</td>
                      <td>{{ formatPrice(item.purchase_price * item.qty) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Summary -->
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h6 class="mb-0">Payment Summary</h6>
            </div>
            <div class="card-body">
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Subtotal</span>
                <span>{{ formatPrice(order.subtotal) }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Shipping</span>
                <span>{{ formatPrice(order.shipping_cost) }}</span>
              </div>
              <div
                class="d-flex justify-content-between mb-2"
                v-if="order.discount_amount > 0"
              >
                <span class="text-muted">Discount</span>
                <span class="text-danger"
                  >-{{ formatPrice(order.discount_amount) }}</span
                >
              </div>
              <hr />
              <div class="d-flex justify-content-between">
                <span class="fw-semibold">Total</span>
                <span class="fw-semibold text-primary">{{
                  formatPrice(order.total_amount)
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Courier Information -->
        <div class="col-md-6" v-if="order.courier">
          <div class="card">
            <div class="card-header">
              <h6 class="mb-0">Courier Information</h6>
            </div>
            <div class="card-body">
              <div class="mb-2">
                <label class="text-muted small">Courier</label>
                <p class="mb-0">
                  {{ order.courier.agent }} - {{ order.courier.service_desc }}
                </p>
              </div>
              <div class="mb-2" v-if="order.courier.resi_number">
                <label class="text-muted small">Tracking Number</label>
                <p class="mb-0 fw-semibold">{{ order.courier.resi_number }}</p>
              </div>
              <div class="mb-2" v-if="order.courier.estimate_delivered">
                <label class="text-muted small">Estimated Delivery</label>
                <p class="mb-0">{{ order.courier.estimate_delivered }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div ref="pdfContent" style="display: none; padding: 20px; font-family: Arial, sans-serif; max-width: 800px; margin: auto; background: white;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img 
      v-if="formData.store_logo_website" 
      :src="formData.store_logo_website" 
      alt="Logo" 
      style="height: 60px;" 
      />
        <h2 style="margin-top: 10px;">INVOICE</h2>
        <p style="font-size: 14px; color: #666;">Order #{{ order?.order_number }}</p>
      </div>

      <div style="margin-bottom: 20px;">
        <h4>Informasi Penerima</h4>
        <p><strong>Nama:</strong> {{ order?.shipping.first_name }} {{ order?.shipping.last_name || '' }}</p>
        <p><strong>Alamat:</strong> {{ order?.shipping.address }}, {{ order?.shipping.city }}, {{ order?.shipping.province }} {{ order?.shipping.postal_code }}</p>
        <p><strong>No. Telepon:</strong> {{ order?.contact_phone || '-' }}</p>
      </div>

      <div style="margin-bottom: 20px;">
        <h4 style="padding-bottom: 30px;">Daftar Produk</h4>
        <table style="width: 100%; border-collapse: collapse; ">
          <thead>
            <tr style="background: #f0f0f0;">
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Produk</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Warna</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Jumlah</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Harga</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in order?.order_items" :key="item.id">
              <td style="border: 1px solid #ddd; padding: 8px; ">{{ item.product_name }}</td>
              <td style="border: 1px solid #ddd; padding: 8px;  ">{{ extractColor(item) || '-' }}</td>
              <td style="border: 1px solid #ddd; padding: 8px;  text-align: center;">{{ item.qty }}</td>
              <td style="border: 1px solid #ddd; padding: 8px;  text-align: center;">{{ formatPrice(item.subtotal * item.qty)  }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="text-align: right; margin-top: 20px; border-top: 1px solid #ccc; padding-top: 10px;">
        <p><strong>Total:</strong> {{ formatPrice(order?.total_amount || 0) }}</p>
      </div>
    </div>
</template>

<script setup lang="ts">
import { nextTick } from 'vue'
import type { Order } from "~/types/order";

definePageMeta({
  middleware: ["auth", "admin-only"],
  layout: "dashboard",
});

useAppTitle("Order Details");

const route = useRoute();
const router = useRouter();
const { getOrder } = useOrderApi();
const toast = useToast();
const { token } = useApiBase();
const { fetchAllConfigs} = useConfig();
const order = ref<Order | null>(null);
const pdfContent = ref<HTMLElement | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const orderId = computed(() => {
  const id = route.params.id;
  return id ? parseInt(id as string) : null;
});
const config = useRequestURL();

const url = config.origin + "/storage/";
const formData = ref<any>({
  store_logo_website: "",
  store_favicon: "",
});

const loadOrder = async () => {
  if (!orderId.value) {
    error.value = "Order ID not found";
    loading.value = false;
    toast.error("Order ID not found");
    setTimeout(() => router.push("/manage-order"), 2000);
    return;
  }

  try {
    loading.value = true;
    error.value = null;

    const { data, error: apiError } = await getOrder(orderId.value);

    if (apiError || !data?.success) {
      error.value = apiError?.message || "Failed to load order";
      toast.error(error.value);
      order.value = null;
    } else {
      order.value = data.data?.order || null;

      if (!order.value) {
        error.value = "Order data is empty";
        toast.error("Order not found");
      }
    }
  } catch (err: any) {
    console.error("Load order error:", err);
    error.value = err.message || "Unexpected error occurred";
    toast.error(error.value);
    order.value = null;
  } finally {
    loading.value = false;
  }
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

const formatDate = (date?: string) => {
  if (!date) return "-";
  return new Date(date).toLocaleString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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
const extractColor = (item: any): string => {
  if (item.variant_description) {
    const match = item.variant_description.match(/Warna:\s*([^,]+)/i);
    if (match) return match[1].trim();
  }
  return item.color || item.variant_color || '';
};

const downloadPDF = async () => {
  if (!order.value) return;
  const element = pdfContent.value;
  if (!element) return;

  const originalDisplay = element.style.display;
  element.style.display = 'block';
  element.style.position = 'absolute';
  element.style.left = '-9999px';
  element.style.top = '0';
  element.style.width = '800px';
  element.style.background = 'white';
  element.style.padding = '20px';
  element.style.zIndex = '9999';

  await nextTick();

  try {
    const html2canvas = (await import('html2canvas')).default;
    const jsPDF = (await import('jspdf')).default;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: true,
      backgroundColor: '#ffffff',
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`invoice-${order.value.order_number}.pdf`);
  } catch (err) {
    console.error('PDF generation error:', err);
    toast.error('Gagal membuat PDF');
  } finally {
    element.style.display = originalDisplay;
    element.style.position = '';
    element.style.left = '';
    element.style.top = '';
    element.style.width = '';
    element.style.background = '';
    element.style.padding = '';
    element.style.zIndex = '';
  }
};

const loadSettings = async () => {
  try {
    if (!token.value) return;

    const res = await fetchAllConfigs(token.value);

    const configs = Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res)
        ? res
        : [];

    const incoming: Record<string, any> = {};
    const imageUrls: Record<string, string> = {};

    for (const cfg of configs) {
      if (!cfg.key) continue;

      const val = cfg.hasOwnProperty("casted_value")
        ? cfg.casted_value
        : cfg.value;
      if (cfg.type === "boolean") {
        incoming[cfg.key] = val === true || val === "true";
      } else if (cfg.type === "integer") {
        incoming[cfg.key] = val !== null && val !== undefined ? Number(val) : 0;
      } else {
        incoming[cfg.key] = val ?? "";
      }

      if (cfg.value_image) {
        imageUrls[cfg.key] = cfg.value_image;
      }
    }

    formData.value = {
      ...formData.value,
      ...incoming,
    };
    if (incoming.store_logo_website) {
      formData.value.store_logo_website = incoming.store_logo_website;
      if (!formData.value.app_logo)
        formData.value.app_logo = incoming.store_logo_website;
    } else if (incoming.app_logo) {
      formData.value.app_logo = incoming.app_logo;
      if (!formData.value.store_logo_website)
        formData.value.store_logo_website = incoming.app_logo;
    }
    formData.value.store_logo_website = await urlToBase64(url + formData.value.store_logo_website);
  } catch (err) {;
    toast.error("Failed to load settings");
  }
};

const getPaymentBadge = (status?: string) => {
  switch (status) {
    case "PAID":
      return "bg-success";
    case "PENDING":
      return "bg-warning";
    case "FAILED":
      return "bg-danger";
    case "CANCELLED":
      return "bg-secondary";
    default:
      return "bg-secondary";
  }
};

const urlToBase64 = async (url:string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const openUpdateStatusModal = () => {
  toast.info("Update status feature coming soon");
};

onMounted(async() => {
  loadOrder();
  await loadSettings();
});
</script>

<style scoped>
.badge {
  font-weight: 600;
}

.badge.bg-secondary {
  background-color: #e5e7eb !important;
  color: #374151 !important;
}

.badge.bg-success {
  background-color: #dff3e7 !important;
  color: #166534 !important;
}

.badge.bg-warning {
  background-color: #fdf1d3 !important;
  color: #8a5a00 !important;
}

.badge.bg-info {
  background-color: #d8f0f7 !important;
  color: #164e63 !important;
}

.badge.bg-primary {
  background-color: #dbeafe !important;
  color: #1d4ed8 !important;
}

.badge.bg-danger {
  background-color: #fee2e2 !important;
  color: #b91c1c !important;
}
</style>
