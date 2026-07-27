<template>
  <div>
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="mb-0">Create New Blog Post</h4>
        <p class="text-muted mb-0">Add a new blog post to your website</p>
      </div>
      <NuxtLink to="/manage-blog" class="btn btn-secondary">
        <i class="bi bi-arrow-left me-2"></i>Back to List
      </NuxtLink>
    </div>

    <!-- Form Card -->
    <div class="card">
      <div class="card-body blog-create-body">
        <form @submit.prevent="handleSubmit">
          <div class="row g-3">
            <!-- Title -->
            <div class="col-12">
              <label for="blog_title" class="form-label fw-medium">
                Title <span class="text-danger">*</span>
              </label>
              <input id="blog_title" v-model="form.title" type="text" required class="form-control"
                :class="{ 'is-invalid': errors.title }" placeholder="Enter blog title" @input="generateSlugFromTitle" />
              <div v-if="errors.title" class="invalid-feedback d-block">
                {{ errors.title[0] }}
              </div>
            </div>

            <!-- Slug -->
            <div class="col-12">
              <label for="blog_slug" class="form-label fw-medium">
                Slug
              </label>
              <input id="blog_slug" v-model="form.slug" type="text" class="form-control"
                :class="{ 'is-invalid': errors.slug }" placeholder="Auto generated slug" readonly
                style="background:#f8f9fa;" />
              <div v-if="errors.slug" class="invalid-feedback d-block">
                {{ errors.slug[0] }}
              </div>
            </div>

            <!-- Short Description -->
            <div class="col-12">
              <label for="blog_short_desc" class="form-label fw-medium">
                Short Description (Excerpt) <span class="text-danger">*</span>
              </label>
              <TiptapEditor v-model="form.short_desc" placeholder="Short summary of the blog post"
                :error-message="errors.short_desc ? errors.short_desc[0] : ''" />
            </div>

            <!-- Content (Long Description) -->
            <div class="col-12">
              <label for="blog_long_desc" class="form-label fw-medium">
                Content <span class="text-danger">*</span>
              </label>
              <TiptapEditor v-model="form.long_desc" placeholder="Write your blog content here..."
                :error-message="errors.long_desc ? errors.long_desc[0] : ''" />
            </div>

            <!-- Category -->
            <div class="col-md-6">
              <label for="blog_category" class="form-label fw-medium">
                Category <span class="text-danger">*</span>
              </label>
              <div class="d-flex gap-2">
                <select id="blog_category" v-model="form.fk_category" required class="form-select"
                  :class="{ 'is-invalid': errors.fk_category }" :disabled="loadingCategories">
                  <option value="">Select category</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
                <button type="button" class="btn btn-success btn-sm shrink-0" title="Manage Categories"
                  data-bs-toggle="modal" data-bs-target="#manageCategoriesModal">
                  Add
                </button>
              </div>
              <div v-if="errors.fk_category" class="invalid-feedback d-block">
                {{ errors.fk_category[0] }}
              </div>
            </div>

            <!-- Status -->
            <div class="col-md-6 d-none">
              <label class="form-label fw-medium">Status</label>
              <div>
                <div class="form-check form-check-inline">
                  <input id="blog_status_draft" v-model="form.status" class="form-check-input" type="radio"
                    name="blog_status" value="draft" />
                  <label class="form-check-label" for="blog_status_draft">
                    Draft
                  </label>
                </div>
                <div class="form-check form-check-inline">
                  <input id="blog_status_published" v-model="form.status" class="form-check-input" type="radio"
                    name="blog_status" value="published" />
                  <label class="form-check-label" for="blog_status_published">
                    Published
                  </label>
                </div>
              </div>
            </div>

            <!-- Featured Image -->
            <div class="col-12">
              <label for="blog_cover" class="form-label fw-medium">
                Featured Image
              </label>
              <input id="blog_cover" type="file" accept="image/*" class="form-control"
                :class="{ 'is-invalid': errors.cover }" @change="handleImageUpload" />
              <small class="text-muted">Max 2MB, JPG/PNG</small>
              <div v-if="errors.cover" class="invalid-feedback d-block">
                {{ errors.cover[0] }}
              </div>
              <div v-if="imagePreview" class="mt-3">
                <img :src="imagePreview" alt="Preview"
                  style="max-width: 100%; max-height: 300px; border-radius: 4px; object-fit: cover;" />
              </div>
            </div>

            <!-- Hot News -->
            <div class="col-12">
              <div class="form-check">
                <input id="blog_hot_news" v-model="form.hot_news" class="form-check-input" type="checkbox" />
                <label class="form-check-label" for="blog_hot_news">
                  Hot News
                </label>
              </div>
            </div>

            <!-- SEO Metadata Preview -->
            <div class="col-12 mt-2">
              <div class="seo-meta-panel rounded border px-3 py-2">
                <div
                  class="d-flex flex-column flex-md-row justify-content-between gap-2 mb-2"
                >
                  <div class="d-flex align-items-center text-muted small fw-semibold">
                    <i class="bi bi-search me-2"></i>SEO Metadata
                  </div>
                </div>
                <div class="row g-2">
                  <div class="col-md-5">
                    <div class="seo-meta-item rounded px-2 py-2">
                      <div class="small text-muted mb-1">Meta Title</div>
                      <p class="mb-0 small text-dark">
                        {{ form.meta_title || form.title || "—" }}
                      </p>
                    </div>
                  </div>
                  <div class="col-md-7">
                    <div class="seo-meta-item rounded px-2 py-2">
                      <div class="small text-muted mb-1">Meta Description</div>
                      <p class="mb-0 small text-dark">
                        {{ form.meta_description || form.short_desc || "—" }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Error/Success Message -->
            <div v-if="message" class="col-12">
              <div class="alert" :class="messageType === 'success' ? 'alert-success' : 'alert-danger'">
                {{ message }}
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="mt-4 d-flex justify-content-end gap-2">
            <NuxtLink to="/manage-blog" class="btn btn-secondary" :disabled="loading">
              Cancel
            </NuxtLink>
            <button type="submit" class="btn btn-primary action-btn-dark" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"
                aria-hidden="true"></span>
              <span v-if="loading">Creating...</span>
              <span v-else>Create Blog Post</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Manage Categories Modal -->
    <div id="manageCategoriesModal" class="modal fade" tabindex="-1" aria-labelledby="manageCategoriesModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="manageCategoriesModalLabel">Manage Blog Categories</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- Create New Category Form -->
            <div class="card mb-3">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h6 class="mb-0">Add New Category</h6>
                <button type="button" class="btn btn-sm btn-success"
                  @click="showCreateCategoryForm = !showCreateCategoryForm">
                  <i :class="showCreateCategoryForm ? 'bi bi-dash' : 'bi bi-plus'"></i>
                  {{ showCreateCategoryForm ? 'Hide' : 'New' }}
                </button>
              </div>
              <div v-if="showCreateCategoryForm" class="card-body">
                <div class="row g-2">
                  <div class="col-md-5">
                    <input v-model="newCategory.name" type="text" class="form-control form-control-sm"
                      placeholder="Category name" @input="generateCategorySlug" />
                  </div>
                  <div class="col-md-4">
                    <input v-model="newCategory.slug" type="text" class="form-control form-control-sm"
                      placeholder="Slug (auto)" readonly style="background:#f8f9fa;" />
                  </div>
                  <div class="col-md-3">
                    <button type="button" class="btn btn-success btn-sm w-100"
                      :disabled="!newCategory.name || savingCategory" @click="handleCreateCategory">
                      <span v-if="savingCategory" class="spinner-border spinner-border-sm me-1"></span>
                      Add
                    </button>
                  </div>
                  <div class="col-12">
                    <textarea v-model="newCategory.description" class="form-control form-control-sm" rows="2"
                      placeholder="Description (optional)"></textarea>
                  </div>
                </div>
              </div>
            </div>

            <!-- Categories List -->
            <div v-if="loadingCategories" class="text-center py-3">
              <div class="spinner-border spinner-border-sm text-primary"></div>
              <span class="ms-2 text-muted">Loading categories...</span>
            </div>
            <div v-else-if="categories.length === 0" class="text-center py-3">
              <p class="text-muted mb-0">No categories yet. Create your first one above.</p>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-sm table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Slug</th>
                    <th style="width: 80px;">Status</th>
                    <th style="width: 100px;" class="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="cat in categories" :key="cat.id">
                    <td>
                      <template v-if="editingCategory?.id === cat.id">
                        <input v-model="editingCategory.name" type="text" class="form-control form-control-sm"
                          @input="generateEditCategorySlug" />
                      </template>
                      <template v-else>
                        <strong>{{ cat.name }}</strong>
                        <br v-if="cat.description" />
                        <small v-if="cat.description" class="text-muted">{{ cat.description }}</small>
                      </template>
                    </td>
                    <td>
                      <template v-if="editingCategory?.id === cat.id">
                        <input v-model="editingCategory.slug" type="text" class="form-control form-control-sm" readonly
                          style="background:#f8f9fa;" />
                      </template>
                      <template v-else>
                        <code>{{ cat.slug }}</code>
                      </template>
                    </td>
                    <td>
                      <template v-if="editingCategory?.id === cat.id">
                        <select v-model="editingCategory.status" class="form-select form-select-sm">
                          <option :value="true">Active</option>
                          <option :value="false">Inactive</option>
                        </select>
                      </template>
                      <template v-else>
                        <span :class="`badge ${cat.status === true || cat.status === 1 ? 'bg-success' : 'bg-warning'}`">
                          {{ cat.status === true || cat.status === 1 ? 'Active' : 'Inactive' }}
                        </span>
                      </template>
                    </td>
                    <td class="text-end">
                      <template v-if="editingCategory?.id === cat.id">
                        <button type="button" class="btn btn-sm btn-success me-1" @click="handleUpdateCategory"
                          :disabled="savingCategory">
                          <i class="bi bi-check"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-secondary" @click="editingCategory = null">
                          <i class="bi bi-x"></i>
                        </button>
                      </template>
                      <template v-else>
                        <button type="button" class="btn btn-sm btn-outline-primary me-1"
                          @click="startEditCategory(cat)" title="Edit">
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-danger" @click="handleDeleteCategory(cat)"
                          title="Delete" :disabled="deletingCategory === cat.id">
                          <i class="bi bi-trash"></i>
                        </button>
                      </template>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BlogCreatePayload, CategoryBlog, CategoryBlogCreatePayload } from '~/types/blog'
import { generateSlug } from '~/utils/helpers'

definePageMeta({
  middleware: 'auth',
  layout: 'dashboard'
})

useAppTitle("Create Blog Post")

const { createBlog, getCategories, createCategory, updateCategory, deleteCategory } = useBlogApi()
const toast = useToast()
const router = useRouter()

type BlogForm = {
  title: string
  slug: string
  short_desc: string
  long_desc: string
  fk_category: number | undefined
  cover: File | undefined
  status: 'published' | 'draft'
  hot_news: boolean
  meta_title: string
  meta_description: string
}

const form = reactive<BlogForm>({
  title: '',
  slug: '',
  short_desc: '',
  long_desc: '',
  fk_category: undefined,
  cover: undefined,
  status: 'draft',
  hot_news: false,
  meta_title: '',
  meta_description: '',
})

const categories = ref<CategoryBlog[]>([])
const loadingCategories = ref(false)
const imagePreview = ref<string>('')
const errors = ref<Record<string, string[]>>({})
const message = ref('')
const messageType = ref<'success' | 'error'>('error')
const loading = ref(false)

// Category management state
const showCreateCategoryForm = ref(true)
const savingCategory = ref(false)
const deletingCategory = ref<number | null>(null)
const editingCategory = ref<{ id: number; name: string; slug: string; description: string; status: boolean } | null>(null)
const newCategory = reactive<CategoryBlogCreatePayload>({
  name: '',
  slug: '',
  description: '',
  status: true,
})

const normalizeCategories = (
  data: CategoryBlog[] | { categories?: CategoryBlog[] } | undefined,
): CategoryBlog[] => {
  if (Array.isArray(data)) {
    return data
  }

  if (Array.isArray(data?.categories)) {
    return data.categories
  }

  return []
}

const loadCategories = async () => {
  loadingCategories.value = true
  const { data, error } = await getCategories()

  if (error || !data?.success) {
    console.error("Failed to load categories:", error)
  } else {
    categories.value = normalizeCategories(
      data.data as CategoryBlog[] | { categories?: CategoryBlog[] } | undefined,
    )
  }

  loadingCategories.value = false
}

const generateSlugFromTitle = () => {
  if (!form.title) {
    form.slug = ''
    return
  }
  form.slug = generateSlug(form.title)
}

const generateMetaFromTitle = () => {
  // If meta_title is empty, auto-populate from title
  if (!form.meta_title) {
    form.meta_title = form.title
  }
}

const generateMetaFromShortDesc = () => {
  // If meta_description is empty, auto-populate from short_desc
  if (!form.meta_description) {
    form.meta_description = form.short_desc
  }
}

const generateCategorySlug = () => {
  newCategory.slug = newCategory.name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const generateEditCategorySlug = () => {
  if (editingCategory.value) {
    editingCategory.value.slug = editingCategory.value.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
}

const handleCreateCategory = async () => {
  if (!newCategory.name) return
  savingCategory.value = true

  const { data, error } = await createCategory(newCategory)

  if (error) {
    toast.error(error.message || 'Failed to create category')
  } else if (data?.success) {
    toast.success('Category created successfully!')
    newCategory.name = ''
    newCategory.slug = ''
    newCategory.description = ''
    newCategory.status = true
    await loadCategories()
  }

  savingCategory.value = false
}

const startEditCategory = (cat: CategoryBlog) => {
  editingCategory.value = {
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description || '',
    status: cat.status === true || cat.status === 1,
  }
}

const handleUpdateCategory = async () => {
  if (!editingCategory.value) return
  savingCategory.value = true

  const { data, error } = await updateCategory(editingCategory.value.id, {
    name: editingCategory.value.name,
    slug: editingCategory.value.slug,
    description: editingCategory.value.description,
    status: editingCategory.value.status,
  })

  if (error) {
    toast.error(error.message || 'Failed to update category')
  } else if (data?.success) {
    toast.success('Category updated successfully!')
    editingCategory.value = null
    await loadCategories()
  }

  savingCategory.value = false
}

const handleDeleteCategory = async (cat: CategoryBlog) => {
  if (!confirm(`Are you sure you want to delete "${cat.name}"?`)) return
  deletingCategory.value = cat.id

  const { data, error } = await deleteCategory(cat.id)

  if (error) {
    toast.error(error.message || 'Failed to delete category')
  } else if (data?.success) {
    toast.success('Category deleted successfully!')
    // If the deleted category was selected, clear selection
    if (form.fk_category === cat.id) {
      form.fk_category = undefined
    }
    await loadCategories()
  }

  deletingCategory.value = null
}

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    form.cover = file
    // Revoke previous object URL to prevent memory leak
    if (imagePreview.value) {
      URL.revokeObjectURL(imagePreview.value)
    }
    imagePreview.value = URL.createObjectURL(file)
  }
}

const resetForm = () => {
  // Revoke object URL to prevent memory leak
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }
  form.title = ''
  form.slug = ''
  form.short_desc = ''
  form.long_desc = ''
  form.fk_category = undefined
  form.cover = undefined
  form.status = 'draft'
  form.hot_news = false
  form.meta_title = ''
  form.meta_description = ''
  imagePreview.value = ''
  errors.value = {}
  message.value = ''
}

const handleSubmit = async () => {
  loading.value = true
  message.value = ''
  errors.value = {}

  // Validate content is not empty (check for text or images)
  const contentHtml = form.long_desc || ''
  const contentText = contentHtml.replace(/<[^>]*>/g, '').trim()
  const hasImage = /<img[^>]*>/i.test(contentHtml)

  if (!contentText && !hasImage) {
    errors.value = { long_desc: ['Content is required'] }
    message.value = 'Please fill in all required fields'
    messageType.value = 'error'
    loading.value = false
    return
  }

  const payload: BlogCreatePayload = {
    title: form.title,
    slug: form.slug,
    short_desc: form.short_desc,
    long_desc: form.long_desc,
    fk_category: form.fk_category,
    cover: form.cover,
    status: form.status,
    hot_news: form.hot_news,
    meta_title: form.meta_title || form.title,
    meta_description: form.meta_description || form.short_desc,
  }

  const { data, error } = await createBlog(payload)

  if (error) {
    message.value = error.message || 'Failed to create blog post'
    messageType.value = 'error'
    errors.value = error.errors || {}
    toast.error(error.message || 'Failed to create blog post')
  } else if (data?.success) {
    message.value = 'Blog post created successfully!'
    messageType.value = 'success'
    errors.value = {}
    toast.success('Blog post created successfully!')

    // Redirect to blog list after 1 second
    setTimeout(() => {
      router.push('/manage-blog')
    }, 1000)
  }

  loading.value = false
}

onMounted(async () => {
  await loadCategories()
})

onUnmounted(() => {
  // Clean up object URL
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }
})
</script>

<style scoped>
.blog-create-body {
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
}

.badge {
  font-weight: 600;
}

.badge.bg-success {
  background-color: #dff3e7 !important;
  color: #166534 !important;
}

.badge.bg-warning {
  background-color: #fdf1d3 !important;
  color: #8a5a00 !important;
}

.seo-meta-panel {
  background: #fafafa;
  border-color: #e9ecef !important;
}

.seo-meta-item {
  background: #ffffff;
}
</style>
