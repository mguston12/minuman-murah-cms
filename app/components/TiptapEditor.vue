<template>
  <div class="tiptap-editor">
    <div v-if="editor" class="editor-toolbar border-bottom p-2 bg-light">
      <div class="d-flex flex-wrap gap-2 align-items-center">
        <!-- Text Formatting -->
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          :class="{ active: editor.isActive('bold') }"
          @click="editor.chain().focus().toggleBold().run()"
          title="Bold"
        >
          <i class="bi bi-type-bold"></i>
        </button>
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          :class="{ active: editor.isActive('italic') }"
          @click="editor.chain().focus().toggleItalic().run()"
          title="Italic"
        >
          <i class="bi bi-type-italic"></i>
        </button>
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          :class="{ active: editor.isActive('strike') }"
          @click="editor.chain().focus().toggleStrike().run()"
          title="Strikethrough"
        >
          <i class="bi bi-type-strikethrough"></i>
        </button>

        <div class="vr"></div>

        <!-- Headings -->
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          :class="{ active: editor.isActive('heading', { level: 1 }) }"
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          :class="{ active: editor.isActive('heading', { level: 2 }) }"
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          :class="{ active: editor.isActive('heading', { level: 3 }) }"
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          title="Heading 3"
        >
          H3
        </button>

        <div class="vr"></div>

        <!-- Blockquote -->
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          :class="{ active: editor.isActive('blockquote') }"
          @click="editor.chain().focus().toggleBlockquote().run()"
          title="Blockquote"
        >
          <i class="bi bi-quote"></i>
        </button>

        <div class="vr"></div>

        <!-- Code -->
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          :class="{ active: editor.isActive('code') }"
          @click="editor.chain().focus().toggleCode().run()"
          title="Inline Code"
        >
          <i class="bi bi-code"></i>
        </button>
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          :class="{ active: editor.isActive('codeBlock') }"
          @click="editor.chain().focus().toggleCodeBlock().run()"
          title="Code Block"
        >
          <i class="bi bi-code-square"></i>
        </button>

        <div class="vr"></div>

        <!-- Image -->
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          @click="showImageModal = true"
          title="Insert Image"
        >
          <i class="bi bi-image"></i>
        </button>

        <div class="vr"></div>

        <!-- Horizontal Rule -->
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          @click="editor.chain().focus().setHorizontalRule().run()"
          title="Horizontal Rule"
        >
          <i class="bi bi-hr"></i>
        </button>

        <div class="vr"></div>

        <!-- Text Alignment -->
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          :class="{ active: editor.isActive({ textAlign: 'left' }) }"
          @click="editor.chain().focus().setTextAlign('left').run()"
          title="Align Left"
        >
          <i class="bi bi-text-left"></i>
        </button>
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          :class="{ active: editor.isActive({ textAlign: 'center' }) }"
          @click="editor.chain().focus().setTextAlign('center').run()"
          title="Align Center"
        >
          <i class="bi bi-text-center"></i>
        </button>
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          :class="{ active: editor.isActive({ textAlign: 'right' }) }"
          @click="editor.chain().focus().setTextAlign('right').run()"
          title="Align Right"
        >
          <i class="bi bi-text-right"></i>
        </button>
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          :class="{ active: editor.isActive({ textAlign: 'justify' }) }"
          @click="editor.chain().focus().setTextAlign('justify').run()"
          title="Justify"
        >
          <i class="bi bi-justify"></i>
        </button>

        <div class="vr"></div>

        <!-- Undo/Redo -->
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          :disabled="!editor.can().undo()"
          @click="editor.chain().focus().undo().run()"
          title="Undo"
        >
          <i class="bi bi-arrow-counterclockwise"></i>
        </button>
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          :disabled="!editor.can().redo()"
          @click="editor.chain().focus().redo().run()"
          title="Redo"
        >
          <i class="bi bi-arrow-clockwise"></i>
        </button>
      </div>
    </div>
    <div
      class="editor-content"
      :class="{ 'is-invalid': hasError }"
    >
      <EditorContent :editor="editor" />
    </div>
    <div v-if="errorMessage" class="invalid-feedback d-block mt-1">
      {{ errorMessage }}
    </div>

    <!-- Image Insert Modal -->
    <div
      v-if="showImageModal"
      class="modal fade show"
      style="display: block; background-color: rgba(0,0,0,0.5);"
      tabindex="-1"
      @click.self="showImageModal = false"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h5 class="modal-title">Insert Image</h5>
            <button
              type="button"
              class="btn-close"
              @click="showImageModal = false"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="image-url" class="form-label">Image URL</label>
              <input
                id="image-url"
                v-model="imageUrl"
                type="text"
                class="form-control"
                placeholder="https://example.com/image.jpg"
                @keyup.enter="insertImage"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Or Upload Image</label>
              <input
                type="file"
                accept="image/*"
                class="form-control"
                @change="handleImageUpload"
              />
            </div>
            <div v-if="imagePreview" class="mb-3">
              <img :src="imagePreview" alt="Preview" style="max-width: 100%; max-height: 200px; border-radius: 4px; object-fit: contain;" />
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="showImageModal = false"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="insertImage"
              :disabled="!imageUrl && !uploadedImageUrl"
            >
              Insert Image
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import Dropcursor from '@tiptap/extension-dropcursor'
import TextAlign from '@tiptap/extension-text-align'

interface Props {
  modelValue: string
  placeholder?: string
  errorMessage?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Write your content here...',
  errorMessage: '',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const hasError = computed(() => !!props.errorMessage)

const showImageModal = ref(false)
const imageUrl = ref('')
const imagePreview = ref('')
const uploadedImageUrl = ref('')

const editor = useEditor({
  content: props.modelValue || '',
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
      // List extensions are handled explicitly below
      bulletList: false,
      orderedList: false,
      listItem: false,
    }),
    Placeholder.configure({
      placeholder: props.placeholder || 'Write your content here...',
    }),
    Image.configure({
      inline: false, // Set to false for resize to work properly
      allowBase64: true,
      resize: {
        enabled: true,
        directions: ['top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'],
        minWidth: 50,
        minHeight: 50,
        alwaysPreserveAspectRatio: true,
      },
    }),
    Dropcursor.configure({
      color: '#0d6efd',
      width: 2,
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      alignments: ['left', 'center', 'right', 'justify'],
      defaultAlignment: 'left',
    }),
  ],
  editable: !props.disabled,
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
  editorProps: {
    handleKeyDown: (view, event) => {
      // Handle Tab key for indentation
      if (event.key === 'Tab' && !event.shiftKey) {
        event.preventDefault()
        
        if (!editor.value) return false

        // Insert non-breaking space or use command to add indent
        // Simple approach: insert 4 spaces
        editor.value.chain().focus().insertContent('    ').run()
        return true
      }

      // Handle Shift+Tab for unindentation
      if (event.key === 'Tab' && event.shiftKey) {
        event.preventDefault()
        
        if (!editor.value) return false

        const { state } = view
        const { selection } = state
        const { $from } = selection
        
        // Get text before cursor in current line
        const lineStart = $from.start($from.depth)
        const textBefore = state.doc.textBetween(lineStart, $from.pos)
        
        // Remove up to 4 leading spaces
        if (textBefore.trim().length === 0 && textBefore.length > 0) {
          // If line only has spaces, remove them
          const spacesToRemove = Math.min(4, textBefore.length)
          const deleteFrom = $from.pos - spacesToRemove
          const deleteTo = $from.pos
          
          if (deleteFrom >= lineStart) {
            const tr = state.tr.delete(deleteFrom, deleteTo)
            view.dispatch(tr)
            return true
          }
        } else if (textBefore.endsWith('    ')) {
          // Remove 4 trailing spaces
          const deleteFrom = $from.pos - 4
          const tr = state.tr.delete(deleteFrom, $from.pos)
          view.dispatch(tr)
          return true
        }
        
        return false
      }

      return false
    },
  },
})

const insertImage = () => {
  if (!editor.value) return

  const url = uploadedImageUrl.value || imageUrl.value
  if (!url) return

  editor.value.chain().focus().setImage({ src: url }).run()
  
  // Reset modal
  showImageModal.value = false
  imageUrl.value = ''
  imagePreview.value = ''
  uploadedImageUrl.value = ''
}

const handleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || !input.files[0]) return

  const file = input.files[0]
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file')
    return
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('Image size should be less than 5MB')
    return
  }

  // Create preview
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }
  imagePreview.value = URL.createObjectURL(file)

  // Convert to base64 for embedding
  const reader = new FileReader()
  reader.onload = (e) => {
    uploadedImageUrl.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

// Watch for external changes to modelValue
watch(() => props.modelValue, (value) => {
  if (editor.value) {
    const currentContent = editor.value.getHTML()
    const newContent = value || ''
    // Only update if content is actually different
    if (currentContent !== newContent) {
      editor.value.commands.setContent(newContent, { emitUpdate: false })
    }
  }
}, { immediate: false })

// Watch for disabled prop changes
watch(() => props.disabled, (disabled) => {
  if (editor.value) {
    editor.value.setEditable(!disabled)
  }
})

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
  // Clean up object URL
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }
})
</script>

<style scoped>
.tiptap-editor {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  background: white;
}

.tiptap-editor .is-invalid {
  border-color: #dc3545;
}

.editor-toolbar {
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
  background-color: #f3f4f6 !important;
}

.editor-toolbar .btn.active {
  background-color: #1E1E1E;
  color: white;
  border-color: #1E1E1E;
}

.editor-toolbar .btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.editor-content {
  min-height: 300px;
  padding: 1rem;
}

.editor-content :deep(.ProseMirror) {
  outline: none;
  min-height: 300px;
}

.editor-content :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  color: #6b7280;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

.editor-content :deep(.ProseMirror h1) {
  font-size: 2rem;
  font-weight: 700;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.editor-content :deep(.ProseMirror h2) {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 0.75rem;
  margin-bottom: 0.5rem;
}

.editor-content :deep(.ProseMirror h3) {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.editor-content :deep(.ProseMirror p) {
  margin-bottom: 0.5rem;
  white-space: pre-wrap; /* Preserve whitespace and allow wrapping */
}

/* Text alignment styles */
.editor-content :deep(.ProseMirror [style*="text-align: left"]) {
  text-align: left;
}

.editor-content :deep(.ProseMirror [style*="text-align: center"]) {
  text-align: center;
}

.editor-content :deep(.ProseMirror [style*="text-align: right"]) {
  text-align: right;
}

.editor-content :deep(.ProseMirror [style*="text-align: justify"]) {
  text-align: justify;
  text-align-last: left; /* Align last line to left for better readability */
}

/* Image alignment styles - wrap images in paragraph for alignment */
.editor-content :deep(.ProseMirror p[style*="text-align: left"] img),
.editor-content :deep(.ProseMirror p[style*="text-align: center"] img),
.editor-content :deep(.ProseMirror p[style*="text-align: right"] img) {
  display: block;
}

.editor-content :deep(.ProseMirror p[style*="text-align: left"] img) {
  margin-left: 0;
  margin-right: auto;
}

.editor-content :deep(.ProseMirror p[style*="text-align: center"] img) {
  margin-left: auto;
  margin-right: auto;
}

.editor-content :deep(.ProseMirror p[style*="text-align: right"] img) {
  margin-left: auto;
  margin-right: 0;
}

/* For standalone images with text-align style */
.editor-content :deep(.ProseMirror img[style*="text-align: left"]) {
  display: block;
  margin-left: 0;
  margin-right: auto;
}

.editor-content :deep(.ProseMirror img[style*="text-align: center"]) {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.editor-content :deep(.ProseMirror img[style*="text-align: right"]) {
  display: block;
  margin-left: auto;
  margin-right: 0;
}

.editor-content :deep(.ProseMirror blockquote) {
  border-left: 4px solid #1E1E1E;
  padding-left: 1rem;
  margin: 1rem 0;
  font-style: italic;
  color: #4f5b66;
}

.editor-content :deep(.ProseMirror code) {
  background-color: #f8f9fa;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

.editor-content :deep(.ProseMirror pre) {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 0.375rem;
  margin: 1rem 0;
  overflow-x: auto;
}

.editor-content :deep(.ProseMirror pre code) {
  background-color: transparent;
  padding: 0;
}

.editor-content :deep(.ProseMirror hr) {
  border: none;
  border-top: 2px solid #dee2e6;
  margin: 1.5rem 0;
}

.editor-content :deep(.ProseMirror img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.375rem;
  margin: 1rem 0;
  cursor: pointer;
  display: block;
}

.editor-content :deep(.ProseMirror img.ProseMirror-selectednode) {
  outline: 2px solid #1E1E1E;
  outline-offset: 2px;
}

/* Image Resize Handles - Tiptap Built-in */
.editor-content :deep([data-resize-handle]) {
  position: absolute;
  background: #1E1E1E;
  border: 2px solid white;
  border-radius: 2px;
  width: 10px;
  height: 10px;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.editor-content :deep([data-resize-handle][data-direction="top"]) {
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  cursor: ns-resize;
}

.editor-content :deep([data-resize-handle][data-direction="bottom"]) {
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  cursor: ns-resize;
}

.editor-content :deep([data-resize-handle][data-direction="left"]) {
  left: -4px;
  top: 50%;
  transform: translateY(-50%);
  cursor: ew-resize;
}

.editor-content :deep([data-resize-handle][data-direction="right"]) {
  right: -4px;
  top: 50%;
  transform: translateY(-50%);
  cursor: ew-resize;
}

/* Corner handles */
.editor-content :deep([data-resize-handle][data-direction="top-left"]) {
  top: -5px;
  left: -5px;
  cursor: nwse-resize;
  border-radius: 50%;
}

.editor-content :deep([data-resize-handle][data-direction="top-right"]) {
  top: -5px;
  right: -5px;
  cursor: nesw-resize;
  border-radius: 50%;
}

.editor-content :deep([data-resize-handle][data-direction="bottom-left"]) {
  bottom: -5px;
  left: -5px;
  cursor: nesw-resize;
  border-radius: 50%;
}

.editor-content :deep([data-resize-handle][data-direction="bottom-right"]) {
  bottom: -5px;
  right: -5px;
  cursor: nwse-resize;
  border-radius: 50%;
}

.editor-content :deep(.is-resizing) {
  user-select: none;
}

.editor-content :deep(.ProseMirror-selectednode img) {
  position: relative;
}
</style>

