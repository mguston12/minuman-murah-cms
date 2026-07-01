<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <p class="text-muted mb-0">Manage blog categories</p>
      </div>
      <button
        v-if="hasPermission('blogs.create')"
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#createCategoryModal"
      >
        <span class="me-2">+</span>Create New Category
      </button>
    </div>

    <!-- Categories Table -->
    <div v-if="hasPermission('blogs.read')" class="card">
      <div class="card-body">
        <div v-if="loadingCategories" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2 text-muted">Loading categories...</p>
        </div>

        <div v-else-if="categories.length === 0" class="text-center py-5">
          <p class="text-muted">No categories found. Create your first category!</p>
        </div>

        <div v-else>
          <div class="table-responsive">
            <table class="table table-striped table-hover align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th style="width: 200px;">Slug</th>
                  <th style="width: 100px;">Status</th>
                  <th class="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="category in categories" :key="category.id">
                  <td>
                    <strong>{{ category.name }}</strong>
                    <br />
                    <small class="text-muted">{{ category.description || '-' }}</small>
                  </td>
                  <td>
                    <code>{{ category.slug }}</code>
                  </td>
                  <td>
                    <span :class="`badge ${category.status === true || category.status === 1 ? 'bg-success' : 'bg-warning'}`">
                      {{ category.status === true || category.status === 1 ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="text-end">
                    <div class="d-flex justify-content-end gap-2">
                      <button
                        v-if="hasPermission('blogs.update')"
                        type="button"
                        class="btn btn-sm btn-outline-primary"
                        @click="handleEditClick(category)"
                        title="Edit"
                        :disabled="loadingCategories"
                      >
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button
                        v-if="hasPermission('blogs.delete')"
                        type="button"
                        class="btn btn-sm btn-outline-danger"
                        @click="handleDeleteClick(category)"
                        title="Delete"
                        :disabled="loadingCategories || getBlogsCount(category) > 0"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="card">
      <div class="card-body">
        <div class="text-center py-5">
          <p class="text-muted">You don't have permission to view categories.</p>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <CategoryCreateModal @created="handleCategoryCreated" />
    <CategoryEditModal
      v-if="categoryToEdit"
      :category="categoryToEdit"
      @updated="handleCategoryUpdated"
    />
    <CategoryDeleteModal
      v-if="categoryToDelete"
      :category="categoryToDelete"
      @deleted="handleCategoryDeleted"
    />
  </div>
</template>

<script setup lang="ts">
import type { CategoryBlog } from '~/types/blog'

definePageMeta({
  middleware: 'auth',
  layout: 'dashboard'
})

useAppTitle("Blog Categories")

const { getCategories } = useBlogApi()
const { hasPermission } = usePermission()

const categories = ref<CategoryBlog[]>([])
const loadingCategories = ref(false)

const categoryToEdit = ref<CategoryBlog | null>(null)
const categoryToDelete = ref<CategoryBlog | null>(null)

const loadCategories = async () => {
  loadingCategories.value = true
  const { data, error } = await getCategories()

  if (error || !data?.success) {
    console.error("Failed to load categories:", error)
  } else if (data.data) {
    // Handle response structure
    if (Array.isArray(data.data)) {
      categories.value = data.data
    } else if (data.data && typeof data.data === 'object' && 'categories' in data.data && Array.isArray((data.data as any).categories)) {
      categories.value = (data.data as any).categories
    }
  }

  loadingCategories.value = false
}

const { showModal } = useModal()

const handleEditClick = async (category: CategoryBlog) => {
  categoryToEdit.value = category
  await nextTick()
  await showModal('editCategoryModal')
}

const handleDeleteClick = async (category: CategoryBlog) => {
  categoryToDelete.value = category
  await nextTick()
  await showModal('deleteCategoryModal')
}

const handleCategoryCreated = () => {
  loadCategories()
}

const handleCategoryUpdated = () => {
  categoryToEdit.value = null
  loadCategories()
}

const handleCategoryDeleted = () => {
  categoryToDelete.value = null
  loadCategories()
}

const getBlogsCount = (category: CategoryBlog): number => {
  return (category as any).blogs_count || 0
}

onMounted(async () => {
  await loadCategories()
})
</script>

<style scoped>
/* Styles for blog categories page */
</style>
