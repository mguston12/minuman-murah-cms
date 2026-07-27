<template>
  <div class="product-detail-page">
    <!-- Loading State -->
    <div v-if="loadingProduct" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2 text-muted">Loading product...</p>
    </div>

    <!-- Product Not Found -->
    <div v-else-if="!product" class="card">
      <div class="card-body text-center py-5">
        <h5>Product not found</h5>
        <p class="text-muted">The product you're looking for doesn't exist.</p>
        <NuxtLink to="/manage-product" class="btn btn-primary action-btn-dark">
          Back to Products
        </NuxtLink>
      </div>
    </div>

    <!-- Product Details -->
    <div v-else>
      <!-- Page Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 class="mb-0">{{ product.name }}</h4>
          <p class="text-muted mb-0">
            <code>{{ product.slug }}</code>
          </p>
        </div>
        <div class="d-flex gap-2">
          <NuxtLink to="/manage-product" class="btn back-nav-btn">
            <i class="bi bi-arrow-left me-2"></i>Back to List
          </NuxtLink>
          <NuxtLink
            :to="`/manage-product/edit/${product.slug}`"
            class="btn btn-primary action-btn-dark"
          >
            <i class="bi bi-pencil me-2"></i>Edit Product
          </NuxtLink>
        </div>
      </div>

      <div class="row">
        <!-- Main Info -->
        <div class="col-md-8">
          <div class="card mb-4">
            <div class="card-header">
            </div>
            <div class="card-body">
              <div class="row mb-3">
                <div class="col-sm-4"><strong>Status:</strong></div>
                <div class="col-sm-8">
                  <span
                    :class="[
                      'badge',
                      product.status === 'PUBLISH'
                        ? 'bg-success'
                        : product.status === 'DRAFT'
                          ? 'bg-warning'
                          : 'bg-secondary',
                    ]"
                  >
                    {{ product.status || 'DRAFT' }}
                  </span>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-sm-4"><strong>Free Shipping:</strong></div>
                <div class="col-sm-8">
                  <span
                    :class="[
                      'badge',
                      product.is_freeshiping === 'ACTIVE'
                        ? 'bg-info'
                        : 'bg-secondary',
                    ]"
                  >
                    {{ product.is_freeshiping || 'INACTIVE' }}
                  </span>
                </div>
              </div>
              <div class="row mb-3" v-if="product.product_information">
                <div class="col-sm-4"><strong>Information:</strong></div>
                <div class="col-sm-8" v-html="product.product_information "></div>
              </div>
              <div class="row mb-3" v-if="product.tags">
                <div class="col-sm-4"><strong>Tags:</strong></div>
                <div class="col-sm-8">
                  <span
                    v-for="tag in product.tags.split(',')"
                    :key="tag.trim()"
                    class="badge bg-secondary me-1"
                  >
                    {{ tag.trim() }}
                  </span>
                </div>
              </div>
              <div class="row mb-3" v-if="product.material">
                <div class="col-sm-4"><strong>Material:</strong></div>
                <div class="col-sm-8">{{ product.material }}</div>
              </div>
              <div class="row mb-3" v-if="product.style">
                <div class="col-sm-4"><strong>Style:</strong></div>
                <div class="col-sm-8">{{ product.style }}</div>
              </div>
              <div class="row mb-3" v-if="product.color">
                <div class="col-sm-4"><strong>Color:</strong></div>
                <div class="col-sm-8">{{ product.color }}</div>
              </div>
              <div class="row mb-3" v-if="product.sku">
                <div class="col-sm-4"><strong>SKU:</strong></div>
                <div class="col-sm-8"><code>{{ product.sku }}</code></div>
              </div>
            </div>
          </div>

          <!-- Weight & Shipping -->
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">Weight & Shipping</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6 mb-3" v-if="product.weight">
                  <strong>Weight:</strong>
                  {{ product.weight }} {{ product.type_weight || 'GRAM' }}
                </div>
                <div class="col-md-6 mb-3" v-if="product.size_long || product.size_wide || product.size_tall">
                  <strong>Package Size:</strong>
                  <span v-if="product.size_long">{{ product.size_long }} × </span>
                  <span v-if="product.size_wide">{{ product.size_wide }} × </span>
                  <span v-if="product.size_tall">{{ product.size_tall }}</span>
                  <span v-if="product.type_size"> {{ product.type_size }}</span>
                </div>
                <div class="col-md-6 mb-3" v-if="product.package_long || product.package_wide || product.package_tall">
                  <strong>Package Dimensions:</strong>
                  <span v-if="product.package_long">{{ product.package_long }} × </span>
                  <span v-if="product.package_wide">{{ product.package_wide }} × </span>
                  <span v-if="product.package_tall">{{ product.package_tall }} cm</span>
                </div>
                <div class="col-md-6 mb-3" v-if="product.sort !== null && product.sort !== undefined">
                  <strong>Sort Order:</strong> {{ product.sort }}
                </div>
              </div>
            </div>
          </div>

          <!-- SEO Information -->
          <div class="card mb-4" v-if="product.meta_title || product.meta_description || product.meta_keywords">
            <div class="card-header">
              <h5 class="mb-0">SEO Information</h5>
            </div>
            <div class="card-body">
              <div class="row mb-3" v-if="product.meta_title">
                <div class="col-sm-4"><strong>Meta Title:</strong></div>
                <div class="col-sm-8">{{ product.meta_title }}</div>
              </div>
              <div class="row mb-3" v-if="product.meta_description">
                <div class="col-sm-4"><strong>Meta Description:</strong></div>
                <div class="col-sm-8">{{ product.meta_description }}</div>
              </div>
              <div class="row mb-3" v-if="product.meta_keywords">
                <div class="col-sm-4"><strong>Meta Keywords:</strong></div>
                <div class="col-sm-8">{{ product.meta_keywords }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="col-md-4">
          <!-- Quick Info -->
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">Quick Info</h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <strong>Product ID:</strong><br />
                <code>{{ product.id }}</code>
              </div>
              <div class="mb-3" v-if="product.timestamps?.created_at || product.created_at">
                <strong>Created:</strong><br />
                {{ formatDate(product.timestamps?.created_at || product.created_at) }}
              </div>
              <div class="mb-3" v-if="product.timestamps?.updated_at || product.updated_at">
                <strong>Last Updated:</strong><br />
                {{ formatDate(product.timestamps?.updated_at || product.updated_at) }}
              </div>
            </div>
          </div>

          <!-- Variants -->
          <div class="card mb-4" v-if="product.variants && product.variants.length > 0">
            <div class="card-header">
              <h5 class="mb-0">Variants ({{ product.variants.length }})</h5>
            </div>
            <div class="card-body">
              <div
                v-for="variant in product.variants"
                :key="variant.id"
                class="mb-2 p-2 border rounded"
              >
                <div v-if="variant.color"><strong>Color:</strong> {{ variant.color }}</div>
                <div v-if="variant.size"><strong>Size:</strong> {{ variant.size }}</div>
                <div v-if="variant.model"><strong>Model:</strong> {{ variant.model }}</div>
                <div><strong>SKU:</strong> {{ variant.sku || 'N/A' }}</div>
                <div><strong>Stock:</strong> {{ variant.stock }}</div>
                <div><strong>Price:</strong> Rp {{ formatNumber(variant.price || 0) }}</div>
                <div v-if="variant.discount">
                  <strong>Discount:</strong> Rp {{ formatNumber(variant.discount) }}
                </div>
                <div>
                  <span
                    :class="[
                      'badge',
                      variant.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary',
                    ]"
                  >
                    {{ variant.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Categories -->
          <div class="card mb-4" v-if="product.categories && product.categories.length > 0">
            <div class="card-header">
              <h5 class="mb-0">Categories ({{ product.categories.length }})</h5>
            </div>
            <div class="card-body">
              <div
                v-for="category in product.categories"
                :key="category.id"
                class="badge bg-info me-1 mb-1"
              >
                {{ category.category_name || `Category ID: ${category.category_id}` }}
              </div>
            </div>
          </div>

          <!-- Brands -->
          <div class="card mb-4" v-if="product.brands && product.brands.length > 0">
            <div class="card-header">
              <h5 class="mb-0">Brands ({{ product.brands.length }})</h5>
            </div>
            <div class="card-body">
              <span
                v-for="bp in product.brands"
                :key="bp.id"
                class="badge bg-info me-1 mb-1"
              >
                {{ bp.name || bp.brand?.name || `Brand ID: ${bp.brand_id}` }}
              </span>
            </div>
          </div>

          <!-- Images -->
          <div class="card mb-4" v-if="product.images && product.images.length > 0">
            <div class="card-header">
              <h5 class="mb-0">Images ({{ product.images.length }})</h5>
            </div>
            <div class="card-body">
              <div class="row g-2">
                <div
                  v-for="image in product.images"
                  :key="image.id"
                  class="col-6"
                >
                  <img
                    :src="image.path"
                    :alt="product.name"
                    class="img-fluid rounded"
                    style="max-height: 100px; object-fit: cover; width: 100%;"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'
import { formatNumber } from '~/utils/helpers'

definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
})

const route = useRoute()
const { getProduct } = useProductApi()

const product = ref<Product | null>(null)
const loadingProduct = ref(false)

const loadProduct = async () => {
  loadingProduct.value = true
  try {
    const productSlug = route.params.id as string
    const { data, error } = await getProduct(productSlug)
    if (error || !data?.success) {
      console.error('Failed to load product:', error)
      product.value = null
    } else if (data.data) {
      product.value = data.data.product
    }
  } catch (err) {
    console.error('Error loading product:', err)
    product.value = null
  } finally {
    loadingProduct.value = false
  }
}

const formatDate = (date: string | undefined) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}


useAppTitle(computed(() =>
  product.value ? `${product.value.name} - Product Details` : "Product Details",
))

onMounted(async () => {
  await loadProduct()
})
</script>

<style scoped>
.product-detail-page {
  color: #000;
}

.product-detail-page :deep(.text-muted) {
  color: #4f5b66 !important;
}

.product-detail-page :deep(.badge) {
  font-weight: 600;
}

.product-detail-page :deep(.badge.bg-secondary) {
  background-color: #e5e7eb !important;
  color: #374151 !important;
}

.product-detail-page :deep(.badge.bg-success) {
  background-color: #dff3e7 !important;
  color: #166534 !important;
}

.product-detail-page :deep(.badge.bg-warning) {
  background-color: #fdf1d3 !important;
  color: #8a5a00 !important;
}

.product-detail-page :deep(.badge.bg-info) {
  background-color: #d8f0f7 !important;
  color: #164e63 !important;
}

.action-btn-dark {
  --bs-btn-color: #fff;
  --bs-btn-bg: var(--app-action-dark-bg);
  --bs-btn-border-color: var(--app-action-dark-bg);
  --bs-btn-hover-color: #fff;
  --bs-btn-hover-bg: var(--app-action-dark-hover-bg);
  --bs-btn-hover-border-color: var(--app-action-dark-hover-bg);
  --bs-btn-focus-shadow-rgb: 33, 37, 41;
  --bs-btn-active-color: #fff;
  --bs-btn-active-bg: var(--app-action-dark-bg);
  --bs-btn-active-border-color: var(--app-action-dark-bg);
}

.back-nav-btn {
  --bs-btn-color: #1f2937;
  --bs-btn-bg: #eef2f7;
  --bs-btn-border-color: #d6dee8;
  --bs-btn-hover-color: #111827;
  --bs-btn-hover-bg: #e2e8f0;
  --bs-btn-hover-border-color: #cbd5e1;
  --bs-btn-focus-shadow-rgb: 148, 163, 184;
  --bs-btn-active-color: #111827;
  --bs-btn-active-bg: #dbe4ee;
  --bs-btn-active-border-color: #cbd5e1;
}
</style>

