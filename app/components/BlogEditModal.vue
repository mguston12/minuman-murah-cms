<template>
  <div
    id="editBlogModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="editBlogModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="editBlogModalLabel">Edit Blog Post</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="resetForm"
          ></button>
        </div>
        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <div class="mb-3">
              <label for="edit_blog_title" class="form-label fw-medium">
                Title <span class="text-danger">*</span>
              </label>
              <input
                id="edit_blog_title"
                v-model="form.title"
                type="text"
                required
                class="form-control"
                :class="{ 'is-invalid': errors.title }"
                placeholder="Enter blog title"
                @input="generateSlug"
              />
              <div v-if="errors.title" class="invalid-feedback">
                {{ errors.title[0] }}
              </div>
            </div>

            <div class="mb-3">
              <label for="edit_blog_slug" class="form-label fw-medium">
                Slug
              </label>
              <input
                id="edit_blog_slug"
                v-model="form.slug"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.slug }"
                placeholder="Auto generated slug"
                readonly
                style="background:#f8f9fa;"
              />
              <div v-if="errors.slug" class="invalid-feedback">
                {{ errors.slug[0] }}
              </div>
            </div>

            <div class="mb-3">
              <label for="edit_blog_short_desc" class="form-label fw-medium">
                Short Description (Excerpt) <span class="text-danger">*</span>
              </label>
              <TiptapEditor v-model="form.short_desc" placeholder="Short summary of the blog post"
                :error-message="errors.short_desc ? errors.short_desc[0] : ''" />
            </div>

            <div class="mb-3">
              <label for="edit_blog_long_desc" class="form-label fw-medium">
                Content <span class="text-danger">*</span>
              </label>
              <TiptapEditor v-model="form.long_desc" placeholder="Write your blog content here"
                :error-message="errors.long_desc ? errors.long_desc[0] : ''" />
            </div>

            <div class="mb-3">
              <label for="edit_blog_category" class="form-label fw-medium">
                Category <span class="text-danger">*</span>
              </label>
              <select
                id="edit_blog_category"
                v-model="form.fk_category"
                required
                class="form-select"
                :class="{ 'is-invalid': errors.fk_category }"
                :disabled="loadingCategories"
              >
                <option value="">Select category</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
              <div v-if="errors.fk_category" class="invalid-feedback">
                {{ errors.fk_category[0] }}
              </div>
            </div>

            <div class="mb-3">
              <label for="edit_blog_cover" class="form-label fw-medium">
                Featured Image
              </label>
              <input
                id="edit_blog_cover"
                type="file"
                accept="image/*"
                class="form-control"
                :class="{ 'is-invalid': errors.cover }"
                @change="handleImageUpload"
              />
              <small class="text-muted">Max 2MB, JPG/PNG. Leave empty to keep current image.</small>
              <div v-if="errors.cover" class="invalid-feedback">
                {{ errors.cover[0] }}
              </div>
              <div v-if="imagePreview || currentImage" class="mt-2">
                <img 
                  :src="imagePreview || currentImage" 
                  alt="Preview" 
                  style="max-width: 100%; max-height: 200px; border-radius: 4px; object-fit: contain; background: #f8f9fa; padding: 8px;"
                  @error="handleImageError"
                />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label fw-medium">Status</label>
              <div>
                <div class="form-check form-check-inline">
                  <input
                    id="edit_blog_status_draft"
                    v-model="form.status"
                    class="form-check-input"
                    type="radio"
                    name="edit_blog_status"
                    value="draft"
                  />
                  <label class="form-check-label" for="edit_blog_status_draft">
                    Draft
                  </label>
                </div>
                <div class="form-check form-check-inline">
                  <input
                    id="edit_blog_status_published"
                    v-model="form.status"
                    class="form-check-input"
                    type="radio"
                    name="edit_blog_status"
                    value="published"
                  />
                  <label class="form-check-label" for="edit_blog_status_published">
                    Published
                  </label>
                </div>
              </div>
            </div>

            <div class="mb-3">
              <div class="form-check">
                <input
                  id="edit_blog_hot_news"
                  v-model="form.hot_news"
                  class="form-check-input"
                  type="checkbox"
                />
                <label class="form-check-label" for="edit_blog_hot_news">
                  Hot News
                </label>
              </div>
            </div>

            <div v-if="message" class="alert mt-3 mb-0" :class="messageType === 'success' ? 'alert-success' : 'alert-danger'">
              {{ message }}
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              :disabled="loading"
              @click="resetForm"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-success"
              :disabled="loading"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              <span v-if="loading">Updating...</span>
              <span v-else>Update Blog Post</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Blog, BlogUpdatePayload, CategoryBlog } from '~/types/blog'

interface Props {
  blog: Blog
  categories?: CategoryBlog[]
  loadingCategories?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => [],
  loadingCategories: false,
})

const emit = defineEmits<{
  (e: 'updated'): void
}>()

const { updateBlog } = useBlogApi()
const toast = useToast()

const form = reactive<BlogUpdatePayload & { status: 'published' | 'draft' }>({
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

const categories = ref<CategoryBlog[]>(props.categories || [])
const imagePreview = ref<string>('')
const currentImage = ref<string>('')
const errors = ref<Record<string, string[]>>({})
const message = ref('')
const messageType = ref<'success' | 'error'>('error')
const loading = ref(false)

// Watch props.categories - categories sudah di-fetch oleh parent (manage-blog.vue)
// Tidak perlu fetch lagi di sini untuk menghindari duplicate fetch
watch(() => props.categories, (newCategories) => {
  if (newCategories && newCategories.length > 0) {
    categories.value = newCategories
  }
}, { immediate: true })

// Initialize form when blog changes
watch(() => props.blog, (blog) => {
  if (blog) {
    form.title = blog.title
    form.slug = blog.slug
    form.short_desc = blog.short_desc || ''
    form.long_desc = blog.long_desc || ''
    form.fk_category = blog.fk_category
    form.status = (blog.status === 'published' || blog.status === 1 || (blog.status as any) === true) ? 'published' : 'draft'
    form.hot_news = (blog.hot_news === true || blog.hot_news === 1) as boolean
    form.meta_title = blog.meta_title || blog.title
    form.meta_description = blog.meta_description || blog.short_desc || ''
    form.cover = undefined
    imagePreview.value = ''
    currentImage.value = blog.cover_url || blog.cover || ''
    errors.value = {}
    message.value = ''
  }
}, { immediate: true })

const generateSlug = () => {
  if (!form.title) {
    form.slug = ''
    return
  }
  form.slug = form.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
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

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  if (target) {
    target.style.display = 'none'
    const parent = target.parentElement
    if (parent) {
      const placeholder = document.createElement('div')
      placeholder.className = 'text-center p-3 bg-light border rounded'
      placeholder.innerHTML = '<i class="bi bi-image text-muted" style="font-size: 2rem;"></i><p class="text-muted mb-0 mt-2 small">Image not available</p>'
      parent.appendChild(placeholder)
    }
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
  currentImage.value = ''
  errors.value = {}
  message.value = ''
}

const handleSubmit = async () => {
  loading.value = true
  message.value = ''
  errors.value = {}

  const payload: BlogUpdatePayload = {
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

  const { data, error } = await updateBlog(props.blog.id, payload)

  if (error) {
    message.value = error.message || 'Failed to update blog post'
    messageType.value = 'error'
    errors.value = error.errors || {}
    toast.error(error.message || 'Failed to update blog post')
  } else if (data?.success) {
    message.value = 'Blog post updated successfully!'
    messageType.value = 'success'
    errors.value = {}
    toast.success('Blog post updated successfully!')

    emit('updated')

    const { closeModal } = useModal()
    closeModal('editBlogModal')
  }

  loading.value = false
}
</script>

