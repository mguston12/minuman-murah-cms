<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="mb-0">Products in {{ subGroup?.title || "Sub-Group" }}</h4>
        <p class="text-muted mb-0">Group: {{ group?.title }}</p>
      </div>

      <div>
        <button class="btn btn-primary action-btn-dark me-2" @click="openAddModal">
          <i class="bi bi-plus-circle me-1"></i>Tambah Produk
        </button>

        <NuxtLink
          :to="`/manage-product-groups/${groupId}`"
          class="btn btn-secondary"
        >
          <i class="bi bi-arrow-left me-1"></i>Back
        </NuxtLink>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <!-- PRODUCTS TABLE -->
    <div v-else class="card">
      <div class="card-header">
        <h5 class="mb-0">Produk di Sub-Group ({{ products.length }})</h5>
      </div>

      <div class="card-body">
        <div v-if="products.length === 0" class="text-muted text-center py-4">
          Belum ada produk
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead class="table-light">
              <tr>
                <th>Nama</th>
                <th>Harga</th>
                <th class="text-end">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in products" :key="p.id">
                <td>{{ p.name }}</td>
                <td>Rp {{ formatPrice(p.base_price) }}</td>
                <td class="text-end">
                  <button
                    class="btn btn-sm btn-outline-danger"
                    :disabled="removing === p.id"
                    @click="handleRemove(p.id)"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ADD PRODUCT MODAL -->
    <div
      v-if="showAddModal"
      class="modal fade show d-block"
      style="background: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Tambah Produk</h5>
            <button class="btn-close" @click="closeAddModal"></button>
          </div>

          <div class="modal-body">
            <div v-if="loadingProducts" class="text-center py-4">
              <div class="spinner-border text-primary"></div>
            </div>

            <div v-else class="position-relative">
              <!-- SEARCHABLE SELECT -->
              <input
                v-model="search"
                type="text"
                class="form-control"
                placeholder="Cari & pilih produk..."
                @focus="dropdownOpen = true"
              />

              <!-- DROPDOWN -->
              <div
                v-if="dropdownOpen"
                class="border rounded mt-1 bg-white"
                style="max-height: 300px; overflow: auto"
              >
                <div
                  v-for="p in filteredProducts"
                  :key="p.id"
                  class="px-3 py-2 d-flex justify-content-between align-items-center"
                  style="cursor: pointer"
                  :class="{
                    'bg-light': selectedProductId === p.id,
                    'text-muted': productIds.has(p.id),
                  }"
                  @click="!productIds.has(p.id) && selectProduct(p)"
                >
                  <div>
                    <div class="fw-semibold">{{ p.name }}</div>
                  </div>

                  <small v-if="productIds.has(p.id)"> sudah ditambahkan </small>
                </div>

                <div
                  v-if="filteredProducts.length === 0"
                  class="px-3 py-2 text-muted"
                >
                  Produk tidak ditemukan
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeAddModal">
              Tutup
            </button>

            <button
              class="btn btn-primary action-btn-dark"
              :disabled="!selectedProductId || adding"
              @click="handleAddSelected"
            >
              <span v-if="adding" class="spinner-border spinner-border-sm me-1"></span>
              {{ adding ? 'Menambah...' : 'Tambah' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductGroup } from "~/types/product-group";
import type { Product } from "~/types/product";

definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

interface SubGroupWithProducts {
  id: number;
  product_group_id: number;
  title: string;
  sort: number;
  status: string;
  products: Product[];
}

const route = useRoute();
const groupId = Number(route.params.id);
const subGroupId = Number(route.params.subGroupId);

const { getProductGroup } = useProductGroupApi();
const { getSubGroup, addProducts, removeProduct } = useProductSubGroupApi();
const { getAllProducts } = useProductApi();

const group = ref<ProductGroup | null>(null);
const subGroup = ref<SubGroupWithProducts | null>(null);

const products = ref<Product[]>([]);
const allProducts = ref<Product[]>([]);

const loading = ref(true);
const loadingProducts = ref(false);
const removing = ref<number | null>(null);
const adding = ref(false);

const showAddModal = ref(false);

const search = ref("");
const selectedProductId = ref<number | null>(null);
const dropdownOpen = ref(false);

// ================= COMPUTED =================
const productIds = computed(() => new Set(products.value.map((p) => p.id)));

const filteredProducts = computed(() => {
  if (!search.value) return allProducts.value;

  const q = search.value.toLowerCase();
  return allProducts.value.filter((p) => p.name.toLowerCase().includes(q));
});

// ================= UTILS =================
const formatPrice = (v: number) => new Intl.NumberFormat("id-ID").format(v);

// ================= FETCH =================
const fetchData = async () => {
  loading.value = true;

  const { data: g } = await getProductGroup(groupId);
  if (g?.success) group.value = g.data;

  const { data: s } = await getSubGroup(groupId, subGroupId);
  if (s?.success) {
    subGroup.value = s.data;
    products.value = s.data.products || [];
  }

  loading.value = false;
};

const openAddModal = async () => {
  showAddModal.value = true;
  dropdownOpen.value = true;

  if (allProducts.value.length === 0) {
    loadingProducts.value = true;

    const { data } = await getAllProducts();
    if (data?.success) {
      allProducts.value = data.data?.products || [];
    }

    loadingProducts.value = false;
  }
};

const closeAddModal = () => {
  showAddModal.value = false;
  dropdownOpen.value = false;
  selectedProductId.value = null;
  search.value = "";
};

// ================= SELECT LOGIC =================
const selectProduct = (product: any) => {
  if (productIds.value.has(product.id)) return;

  selectedProductId.value = product.id;
  search.value = product.name;
  dropdownOpen.value = false;
};

// ================= ACTION =================
const handleAddSelected = async () => {
  if (!selectedProductId.value || adding.value) return;

  adding.value = true;
  try {
    await addProducts(groupId, subGroupId, [selectedProductId.value]);

    selectedProductId.value = null;
    search.value = "";
    dropdownOpen.value = false;

    await fetchData();
  } finally {
    adding.value = false;
  }
};

const handleRemove = async (productId: number) => {
  if (!confirm("Hapus produk dari sub-group?")) return;

  removing.value = productId;
  await removeProduct(groupId, subGroupId, productId);
  removing.value = null;

  await fetchData();
};

// ================= LIFECYCLE =================
onMounted(fetchData);
</script>


