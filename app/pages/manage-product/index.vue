<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <p class="text-muted mb-0">Manage products</p>
      </div>
      <NuxtLink 
        v-if="hasPermission('products.create')"
        to="/manage-product/create" 
        class="btn btn-primary action-btn-dark"
      >
        <span class="me-2">+</span>Create New Product
      </NuxtLink>
    </div>

    <!-- Filter Section -->
    <div class="card mb-4">
      <div class="card-body p-3">
        <div class="row g-2">
          <div class="col-md-6">
            <input
              v-model="filters.search"
              type="text"
              class="form-control form-control-sm"
              placeholder="Search name or slug..."
              @input="handleSearch"
            />
          </div>
          <div class="col-md-3">
            <select
              v-model="filters.status"
              class="form-select form-select-sm"
              @change="loadProducts(1)"
            >
              <option value="">All Status</option>
              <option value="PUBLISH">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <div class="col-md-3">
            <select
              v-model="filters.freeShipping"
              class="form-select form-select-sm"
              @change="loadProducts(1)"
            >
              <option value="">All Shipping</option>
              <option value="ACTIVE">Free Shipping</option>
              <option value="INACTIVE">No Free Shipping</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Products Table -->
    <div v-if="hasPermission('products.read')" class="card">
      <div class="card-body">
        <div v-if="loadingProducts" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2 text-muted">Loading products...</p>
        </div>

        <div v-else-if="products.length === 0" class="text-center py-5">
          <p class="text-muted">No products found. Create your first product!</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-striped table-hover align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Free Shipping</th>
                <th>Categories</th>
                <th>Variants</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in products" :key="product.id">
                <td>
                  <span class="badge bg-secondary">{{ getRowNumber(index) }}</span>
                </td>
                <td>
                  <strong>{{ product.name }}</strong>
                </td>
                <td>
                  <code class="text-muted">{{ product.slug }}</code>
                </td>
                <td>
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
                </td>
                <td>
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
                </td>
                <td>
                  <div class="d-flex flex-wrap gap-1">
                    <span
                      v-for="category in getProductCategories(product.id)"
                      :key="category.id"
                      class="badge bg-info"
                    >
                      {{ category.category_name || 'N/A' }}
                    </span>
                    <span v-if="getProductCategories(product.id).length === 0" class="text-muted small">
                      No categories
                    </span>
                  </div>
                </td>
                <td>
                  <span class="badge bg-primary">
                    {{ product.variants?.length || 0 }} variants
                  </span>
                </td>
                <td class="text-end">
                  <div class="d-flex justify-content-end gap-2">
                    <NuxtLink
                      v-if="hasPermission('products.read')"
                      :to="`/manage-product/${product.slug}`"
                      class="btn btn-sm btn-outline-info"
                      title="View"
                    >
                      <i class="bi bi-eye"></i>
                    </NuxtLink>
                    <NuxtLink
                      v-if="hasPermission('products.update')"
                      :to="`/manage-product/edit/${product.slug}`"
                      class="btn btn-sm btn-outline-primary"
                      title="Edit"
                    >
                      <i class="bi bi-pencil"></i>
                    </NuxtLink>
                    <button
                      v-if="hasPermission('products.delete')"
                      type="button"
                      class="btn btn-sm btn-outline-danger"
                      @click="handleDeleteClick(product)"
                      title="Delete"
                      :disabled="isLoading"
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
          <div class="d-flex flex-column flex-md-row justify-content-center justify-content-md-between align-items-center gap-2">
            <div class="text-muted text-center text-md-start small" style="font-size: 0.875rem;">
              Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} entries
            </div>
            <nav aria-label="Page navigation">
              <ul class="pagination mb-0">
                <li class="page-item" :class="{ disabled: pagination.current_page === 1 }">
                  <a
                    class="page-link action-btn-dark"
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
                  :class="{ active: typeof page === 'number' && page === pagination.current_page, disabled: page === '...' }"
                >
                  <a
                    v-if="page !== '...'"
                    class="page-link action-btn-dark"
                    href="#"
                    @click.prevent="changePage(Number(page))"
                  >
                    {{ page }}
                  </a>
                  <span v-else class="page-link">{{ page }}</span>
                </li>
                <li class="page-item" :class="{ disabled: pagination.current_page === pagination.last_page }">
                  <a
                    class="page-link action-btn-dark"
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
          <p class="text-muted">You don't have permission to view products.</p>
        </div>
      </div>
    </div>

    <!-- Delete Product Modal -->
    <div
      id="deleteProductModal"
      class="modal fade"
      tabindex="-1"
      aria-labelledby="deleteProductModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteProductModalLabel">Delete Product</h5>
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
              <strong>{{ productToDelete?.name }}</strong>? This action cannot be
              undone.
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
              @click="handleDeleteProduct"
              :disabled="isLoading"
            >
              {{ isLoading ? "Deleting..." : "Delete Product" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Category Modal -->
    <div
      id="addCategoryModal"
      class="modal fade"
      tabindex="-1"
      aria-labelledby="addCategoryModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addCategoryModalLabel">
              Add Category to Product
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div v-if="productToAddCategory">
              <p class="mb-3">
                <strong>Product:</strong> {{ productToAddCategory.name }}
              </p>
              <div class="mb-3">
                <label for="category_select" class="form-label">
                  Select Category <span class="text-danger">*</span>
                </label>
                <select
                  id="category_select"
                  v-model="selectedCategoryId"
                  class="form-select"
                  :class="{ 'is-invalid': formErrors.category_id }"
                  :disabled="loadingCategories || isLoading"
                >
                  <option value="">Choose a category...</option>
                  <option
                    v-for="category in availableCategoriesForProduct"
                    :key="category.id"
                    :value="category.id"
                  >
                    {{ category.taxonomy_name }}
                  </option>
                </select>
                <div v-if="formErrors.category_id" class="invalid-feedback">
                  {{ formErrors.category_id[0] }}
                </div>
                <small v-if="availableCategoriesForProduct.length === 0" class="form-text text-muted">
                  All categories are already assigned to this product
                </small>
              </div>
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
              class="btn btn-primary action-btn-dark"
              @click="handleAddCategory"
              :disabled="isLoading || !selectedCategoryId"
            >
              {{ isLoading ? 'Adding...' : 'Add Category' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'

definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
})

useAppTitle("Manage Products")

const { getProducts, deleteProduct } = useProductApi()
const { attachCategories, getCategoryProducts, getCategoryProductsByProduct } = useCategoryProductApi()
const { getTaxoListsByType } = useProductRelationsApi()
const { hasPermission } = usePermission()
const toast = useToast()

const products = ref<Product[]>([])
const categoryProducts = ref<any[]>([])
const categories = ref<any[]>([])
const loadingProducts = ref(false)
const loadingCategories = ref(false)
const isLoading = ref(false)
const currentPage = ref(1)
const perPage = ref(15)
const pagination = ref<{
  current_page: number
  per_page: number
  total: number
  last_page: number
  from: number | null
  to: number | null
} | null>(null)
const filters = ref({
  search: '',
  status: '',
  freeShipping: '',
})
const productToDelete = ref<Product | null>(null)
const productToAddCategory = ref<Product | null>(null)
const selectedCategoryId = ref<number | string | null>(null)
const formErrors = ref<Record<string, string[]>>({})

const loadProducts = async (page: number = currentPage.value) => {
  loadingProducts.value = true
  currentPage.value = page
  try {
    const { data, error } = await getProducts(
      page,
      perPage.value,
      undefined,
      'desc',
      undefined,
      filters.value.search || undefined,
      {
        status: filters.value.status || undefined,
        is_freeshiping: filters.value.freeShipping || undefined,
      }
    )
    if (error || !data?.success) {
      console.error('Failed to load products:', error)
      products.value = []
    } else if (data.data) {
      products.value = data.data.products || []
      if (data.data.pagination) {
        pagination.value = {
          ...data.data.pagination,
          from: data.data.pagination.from || null,
          to: data.data.pagination.to || null,
        }
      }
    }
    // Load category products for all products
    await loadCategoryProducts()
  } catch (err) {
    console.error('Error loading products:', err)
    products.value = []
  } finally {
    loadingProducts.value = false
  }
}

const loadCategoryProducts = async () => {
  try {
    const { data, error } = await getCategoryProducts()
    if (!error && data?.success && data.data) {
      categoryProducts.value = Array.isArray(data.data) ? data.data : []
    }
  } catch (err) {
    console.error('Error loading category products:', err)
    categoryProducts.value = []
  }
}

const loadCategories = async () => {
  loadingCategories.value = true
  try {
    const [type2, type3] = await Promise.all([
      getTaxoListsByType(2),
      getTaxoListsByType(3),
    ])

    const categories2 = type2.data?.data?.taxo_lists || []
    const categories3 = type3.data?.data?.taxo_lists || []

    const allCategories = [...categories2, ...categories3]
      .filter((cat: any) => cat.taxonomy_status === 'ACTIVE')
      .map((cat: any) => ({
        id: cat.id,
        taxonomy_name: cat.taxonomy_name,
        taxonomy_slug: cat.taxonomy_slug,
      }))

    categories.value = allCategories
  } catch (err) {
    console.error('Error loading categories:', err)
    toast.error('Error loading categories')
    categories.value = []
  } finally {
    loadingCategories.value = false
  }
}

const getProductCategories = (productId: number) => {
  return categoryProducts.value
    .filter(cp => cp.fk_product_id === productId)
    .map(cp => ({
      id: cp.fk_category_id,
      category_name: cp.fk_category?.taxonomy_name || 'N/A',
      category_slug: cp.fk_category?.taxonomy_slug || 'N/A',
    }))
}

const availableCategoriesForProduct = computed(() => {
  if (!productToAddCategory.value) return []
  
  const assignedCategoryIds = getProductCategories(productToAddCategory.value.id).map(c => c.id)
  return categories.value.filter(cat => !assignedCategoryIds.includes(cat.id))
})

const searchTimer = ref<ReturnType<typeof setTimeout> | null>(null)

const handleSearch = () => {
  if (searchTimer.value) clearTimeout(searchTimer.value)
  searchTimer.value = setTimeout(() => {
    loadProducts(1)
  }, 300)
}

const changePage = (page: number) => {
  if (page >= 1 && page <= (pagination.value?.last_page || 1)) {
    loadProducts(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const getPageNumbers = (): (number | string)[] => {
  if (!pagination.value) return []
  
  const current = pagination.value.current_page
  const last = pagination.value.last_page
  const pages: (number | string)[] = []
  
  if (last <= 7) {
    for (let i = 1; i <= last; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    
    if (current > 3) {
      pages.push('...')
    }
    
    const start = Math.max(2, current - 1)
    const end = Math.min(last - 1, current + 1)
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    if (current < last - 2) {
      pages.push('...')
    }
    
    pages.push(last)
  }
  
  return pages
}

const handleDeleteClick = async (product: Product) => {
  productToDelete.value = product
  await nextTick()
  const modal = new (window as any).bootstrap.Modal(
    document.getElementById('deleteProductModal')
  )
  modal.show()
}

const handleAddCategoryClick = async (product: Product) => {
  productToAddCategory.value = product
  selectedCategoryId.value = null
  formErrors.value = {}
  
  // Load categories if not loaded
  if (categories.value.length === 0) {
    await loadCategories()
  }
  
  await nextTick()
  const modal = new (window as any).bootstrap.Modal(
    document.getElementById('addCategoryModal')
  )
  modal.show()
}

const handleAddCategory = async () => {
  if (!productToAddCategory.value || !selectedCategoryId.value) {
    toast.error('Please select a category')
    return
  }

  isLoading.value = true
  formErrors.value = {}
  
  try {
    const categoryId = typeof selectedCategoryId.value === 'string' 
      ? parseInt(selectedCategoryId.value) 
      : selectedCategoryId.value
    
    const { data, error } = await attachCategories(productToAddCategory.value.id, [categoryId])
    if (error) {
      if (error.errors) {
        formErrors.value = error.errors
      } else {
        toast.error(error.message || 'Failed to add category')
      }
      return
    }

    if (data?.success) {
      toast.success('Category added successfully')
      const modal = (window as any).bootstrap.Modal.getInstance(
        document.getElementById('addCategoryModal')
      )
      modal?.hide()
      selectedCategoryId.value = null
      formErrors.value = {}
      productToAddCategory.value = null
      await loadCategoryProducts()
    }
  } catch (err) {
    console.error('Error adding category:', err)
    toast.error('Error adding category')
  } finally {
    isLoading.value = false
  }
}

const handleDeleteProduct = async () => {
  if (!productToDelete.value) return
  try {
    isLoading.value = true
    const { data, error } = await deleteProduct(productToDelete.value.id)
    if (error) {
      alert(error.message || 'Failed to delete product')
      return
    }
    if (data?.success) {
      const modal = (window as any).bootstrap.Modal.getInstance(
        document.getElementById('deleteProductModal')
      )
      modal?.hide()
      productToDelete.value = null
      if (products.value.length === 1 && currentPage.value > 1) {
        await loadProducts(currentPage.value - 1)
      } else {
        await loadProducts(currentPage.value)
      }
    }
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Failed to delete product')
  } finally {
    isLoading.value = false
  }
}

const formatDate = (date: string | undefined) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID')
}

const getRowNumber = (index: number) => {
  if (!pagination.value || !pagination.value.from) {
    return index + 1
  }
  return pagination.value.from + index
}

onMounted(async () => {
  await loadProducts()
  await loadCategories()
})

onUnmounted(() => {
  if (searchTimer.value) clearTimeout(searchTimer.value)
})
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
</style>

