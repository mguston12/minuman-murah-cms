<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="mb-0">Manage Products for Category</h4>
        <p class="text-muted mb-0">
          <strong>{{ category?.taxonomy_name || 'Loading...' }}</strong>
        </p>
      </div>
      <NuxtLink to="/manage-category-product" class="btn btn-secondary">
        <i class="bi bi-arrow-left me-2"></i>Back to List
      </NuxtLink>
    </div>

    <div v-if="loadingCategory" class="card">
      <div class="card-body text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-muted">Loading category...</p>
      </div>
    </div>

    <div v-else-if="!category" class="card">
      <div class="card-body text-center py-5">
        <p class="text-muted">Category not found</p>
        <NuxtLink to="/manage-category-product" class="btn btn-primary">
          Back to List
        </NuxtLink>
      </div>
    </div>

    <div v-else>
      <!-- Assigned Products -->
      <div class="card mb-4">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5 class="mb-0">Assigned Products ({{ assignedProducts.length }})</h5>
          <button
            @click="openAddProductModal"
            class="btn btn-primary btn-sm"
            :disabled="isLoading || loadingProducts || availableProducts.length === 0"
          >
            <i class="bi bi-plus-circle me-1"></i>Add Product
          </button>
        </div>
        <div class="card-body">
          <div v-if="loadingAssignedProducts" class="text-center py-3">
            <div class="spinner-border spinner-border-sm text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <div v-else-if="assignedProducts.length === 0" class="text-center py-3">
            <p class="text-muted mb-0">No products assigned to this category yet.</p>
          </div>
          <div v-else class="table-responsive">
            <table class="table table-sm table-hover">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Slug</th>
                  <th class="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in assignedProducts" :key="product.id">
                  <td>
                    <strong>{{ product.name }}</strong>
                  </td>
                  <td>
                    <code class="text-muted">{{ product.slug }}</code>
                  </td>
                  <td class="text-end">
                    <button
                      @click="handleRemoveProduct(product.id)"
                      class="btn btn-sm btn-outline-danger"
                      :disabled="isRemoving"
                      title="Remove Product"
                    >
                      <i class="bi bi-x-circle"></i> Remove
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>

    <!-- Add Product Modal -->
    <div
      class="modal fade"
      id="addProductModal"
      tabindex="-1"
      aria-labelledby="addProductModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addProductModalLabel">
              Add Products to Category
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
              <label for="product_select" class="form-label">
                Select Product <span class="text-danger">*</span>
              </label>
              <select
                id="product_select"
                v-model="selectedProductId"
                class="form-select"
                :class="{ 'is-invalid': formErrors.product_id }"
                :disabled="loadingProducts || isLoading"
              >
                <option value="">Choose a product...</option>
                <option
                  v-for="product in availableProducts"
                  :key="product.id"
                  :value="product.id"
                >
                  {{ product.name }} ({{ product.slug }})
                </option>
              </select>
              <div v-if="formErrors.product_id" class="invalid-feedback">
                {{ formErrors.product_id[0] }}
              </div>
              <small v-if="availableProducts.length === 0" class="form-text text-muted">
                No available products to add
              </small>
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
              class="btn btn-primary"
              @click="handleAddProduct"
              :disabled="isLoading || !selectedProductId"
            >
              {{ isLoading ? 'Adding...' : 'Add Product' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
})

const route = useRoute()
const categoryId = parseInt(route.params.id as string)

useAppTitle("Manage Category Products")

interface Category {
  id: number
  taxonomy_name: string
  taxonomy_slug: string
}

interface Product {
  id: number
  name: string
  slug: string
}

interface CategoryProduct {
  id: number
  fk_product_id: number
  fk_category_id: number
  fk_product?: Product
}

const { getCategoryProducts, attachCategories, detachCategories } = useCategoryProductApi()
const { getAllProducts } = useProductApi()
const { getTaxoListsByType } = useProductRelationsApi()
const { hasPermission } = usePermission()
const toast = useToast()

const category = ref<Category | null>(null)
const allProducts = ref<Product[]>([])
const categoryProducts = ref<CategoryProduct[]>([])
const selectedProductId = ref<number | string | null>(null)
const formErrors = ref<Record<string, string[]>>({})

const loadingCategory = ref(false)
const loadingProducts = ref(false)
const loadingAssignedProducts = ref(false)
const isLoading = ref(false)
const isRemoving = ref(false)

const assignedProducts = computed(() => {
  return categoryProducts.value
    .map(cp => {
      if (cp.fk_product) {
        return cp.fk_product
      }
      // Fallback: find product from allProducts if fk_product not loaded
      return allProducts.value.find(p => p.id === cp.fk_product_id)
    })
    .filter((p): p is Product => p !== undefined)
})

const availableProducts = computed(() => {
  const assignedIds = categoryProducts.value.map(cp => cp.fk_product_id)
  return allProducts.value.filter(p => !assignedIds.includes(p.id))
})

const loadCategory = async () => {
  loadingCategory.value = true
  try {
    // Load categories from type 2 and 3 (product categories)
    // Same structure as frontend products page
    const [type2, type3] = await Promise.all([
      getTaxoListsByType(2),
      getTaxoListsByType(3),
    ])

    const categories2 = type2.data?.data?.taxo_lists || []
    const categories3 = type3.data?.data?.taxo_lists || []

    // Combine and filter only ACTIVE categories, same as frontend
    const allCategories = [...categories2, ...categories3]
      .filter((cat: any) => cat.taxonomy_status === 'ACTIVE')
      .map((cat: any) => ({
        id: cat.id,
        taxonomy_name: cat.taxonomy_name,
        taxonomy_slug: cat.taxonomy_slug,
      }))

    const foundCategory = allCategories.find(c => c.id === categoryId)
    if (foundCategory) {
      category.value = foundCategory
    } else {
      toast.error('Category not found')
    }
  } catch (err) {
    console.error('Error loading category:', err)
    toast.error('Error loading category')
  } finally {
    loadingCategory.value = false
  }
}

const loadProducts = async () => {
  console.log('loadProducts called')
  loadingProducts.value = true
  try {
    console.log('Calling getAllProducts...')
    const { data, error } = await getAllProducts()
    console.log('getAllProducts response:', { data, error })
    
    if (error || !data?.success) {
      console.error('Failed to load products:', error)
      toast.error(error?.message || 'Failed to load products')
      allProducts.value = []
    } else if (data.data) {
      console.log('Products loaded:', data.data.products?.length || 0)
      allProducts.value = data.data.products || []
    } else {
      console.warn('No data in response:', data)
      allProducts.value = []
    }
  } catch (err) {
    console.error('Error loading products:', err)
    toast.error('Error loading products')
    allProducts.value = []
  } finally {
    loadingProducts.value = false
  }
}

const loadAssignedProducts = async () => {
  loadingAssignedProducts.value = true
  try {
    const { data, error } = await getCategoryProducts()
    if (error || !data?.success) {
      console.error('Failed to load assigned products:', error)
      categoryProducts.value = []
    } else if (data.data) {
      const allCategoryProducts = Array.isArray(data.data) ? data.data : []
      categoryProducts.value = allCategoryProducts.filter(
        (cp: CategoryProduct) => cp.fk_category_id === categoryId
      )
    }
  } catch (err) {
    console.error('Error loading assigned products:', err)
    categoryProducts.value = []
  } finally {
    loadingAssignedProducts.value = false
  }
}

const openAddProductModal = async () => {
  selectedProductId.value = null
  formErrors.value = {}
  await nextTick()
  const modal = new (window as any).bootstrap.Modal(
    document.getElementById('addProductModal')
  )
  modal.show()
}

const handleAddProduct = async () => {
  if (!selectedProductId.value) {
    toast.error('Please select a product')
    return
  }

  isLoading.value = true
  formErrors.value = {}
  
  try {
    const productId = typeof selectedProductId.value === 'string' 
      ? parseInt(selectedProductId.value) 
      : selectedProductId.value
    
    const { data, error } = await attachCategories(productId, [categoryId])
    if (error) {
      if (error.errors) {
        formErrors.value = error.errors
      } else {
        toast.error(error.message || 'Failed to add product')
      }
      return
    }

    if (data?.success) {
      toast.success('Product added successfully')
      const modal = (window as any).bootstrap.Modal.getInstance(
        document.getElementById('addProductModal')
      )
      modal?.hide()
      selectedProductId.value = null
      formErrors.value = {}
      await loadAssignedProducts()
    }
  } catch (err) {
    console.error('Error adding product:', err)
    toast.error('Error adding product')
  } finally {
    isLoading.value = false
  }
}

const handleRemoveProduct = async (productId: number) => {
  isRemoving.value = true
  try {
    const { data, error } = await detachCategories(categoryId, [productId])
    if (error) {
      toast.error(error.message || 'Failed to remove product')
      return
    }

    if (data?.success) {
      toast.success('Product removed successfully')
      await loadAssignedProducts()
    }
  } catch (err) {
    console.error('Error removing product:', err)
    toast.error('Error removing product')
  } finally {
    isRemoving.value = false
  }
}

onMounted(async () => {
  console.log('onMounted called - Category Product Edit, categoryId:', categoryId)
  
  // Load products first (independent of category)
  await loadProducts()
  
  // Then load category and assigned products
  try {
    await loadCategory()
    await loadAssignedProducts()
  } catch (err) {
    console.error('Error loading category or assigned products:', err)
  }
})
</script>
