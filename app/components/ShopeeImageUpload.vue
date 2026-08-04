<template>
  <div class="shopee-image-upload">
    <div>
      <label class="form-label fw-bold">
        Product Images
        <span
          class="badge ms-1"
          :class="atMaxImages ? 'text-bg-danger' : 'text-bg-secondary'"
        >
          {{ imagesModel.length }}/{{ MAX_IMAGES }}
        </span>
      </label>
      <small class="text-muted d-block mb-2">
        The leftmost image is automatically set as featured. Drag and drop images to change the featured image.
        Max {{ MAX_IMAGES }} Images.
      </small>

      <div class="product-images-upload">
        <div class="images-grid">
          <div
            v-for="(image, index) in imagesModel"
            :key="getImageKey(image) || index"
            class="product-image-box position-relative"
            :class="{
              'is-dragging': draggedIndex === index,
              'is-drop-target': dragOverIndex === index && draggedIndex !== index,
            }"
            :draggable="!disabled"
            @dragstart="handleDragStart(index, $event)"
            @dragover.prevent="handleDragOver(index)"
            @dragenter.prevent="handleDragOver(index)"
            @dragleave="handleDragLeave(index)"
            @drop.prevent="handleDrop(index)"
            @dragend="handleDragEnd"
          >
            <img
              :src="image.preview || image.path"
              :alt="image.name || `Product image ${index + 1}`"
              class="product-image-preview"
            />

            <span
              v-if="index === 0"
              class="badge-featured position-absolute top-0 start-0 m-2"
            >
              <i class="bi bi-star-fill"></i> Featured
            </span>

            <div
              v-if="!disabled"
              class="drag-hint position-absolute top-0 end-0 m-2"
              title="Drag untuk ubah urutan"
            >
              <i class="bi bi-grip-vertical"></i>
            </div>

            <div class="image-actions">
              <button
                v-if="!disabled"
                type="button"
                class="btn-action btn-remove"
                @click="removeImage(index)"
                title="Remove"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>

          <div
            v-if="!atMaxImages"
            class="image-upload-box"
            :class="{ 'is-disabled': disabled }"
            @click="!disabled && triggerMultiFileInput()"
            role="button"
            tabindex="0"
            @keydown.enter="!disabled && triggerMultiFileInput()"
            @keydown.space.prevent="!disabled && triggerMultiFileInput()"
          >
            <i class="bi bi-plus-lg upload-icon"></i>
            <span class="mt-2">Add Images</span>
          </div>
        </div>

        <input
          ref="multiFileInputRef"
          type="file"
          accept="image/*"
          multiple
          class="d-none"
          @change="handleMultipleImageSelect"
          :disabled="disabled"
        />
      </div>

      <small class="text-muted d-block mt-2" v-if="!disabled">
        <i class="bi bi-info-circle me-1"></i>
        Supported formats: JPG, PNG, GIF. Max size: 5MB per image. Max {{ MAX_IMAGES }} images.
      </small>
    </div>
  </div>
</template>

<script setup>
import { useToast } from "~/composables/useToast";

const toast = useToast();

const emit = defineEmits([
  "update:featured",
  "update:images",
  "change",
  "set-featured",
  "remove-image",
  "remove-featured",
]);

const props = defineProps({
  featured: {
    type: [Object, null],
    default: null,
  },
  images: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const MAX_IMAGES = 7;

const multiFileInputRef = ref(null);
const imagesModel = ref([]);
const draggedIndex = ref(null);
const dragOverIndex = ref(null);

const atMaxImages = computed(() => imagesModel.value.length >= MAX_IMAGES);

const getImageKey = (image) => {
  if (!image) return null;
  if (image.id) return `id:${image.id}`;
  if (image.file) {
    return `file:${image.file.name}-${image.file.size}-${image.file.lastModified}`;
  }
  if (image.path) return `path:${image.path}`;
  if (image.preview) return `preview:${image.preview}`;
  return image.name || null;
};

const getImagesSignature = (images) =>
  (images || [])
    .map((image, index) => `${getImageKey(image)}:${index === 0 ? 1 : 0}`)
    .join("|");

const normalizeImages = (images) => {
  const uniqueImages = [];
  const seen = new Set();

  for (const image of images || []) {
    if (uniqueImages.length >= MAX_IMAGES) break;
    const key = getImageKey(image);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    uniqueImages.push({
      ...image,
      is_featured: false,
    });
  }

  if (uniqueImages[0]) {
    uniqueImages[0].is_featured = true;
  }

  return uniqueImages;
};

const syncImages = (images) => {
  const normalized = normalizeImages(images);
  if (getImagesSignature(imagesModel.value) === getImagesSignature(normalized)) {
    return;
  }
  imagesModel.value = normalized;
};

const emitChanges = () => {
  const featured = imagesModel.value[0] || null;
  emit("update:featured", featured);
  emit("update:images", imagesModel.value);
  emit("change", { featured, images: imagesModel.value });
};

watch(
  () => props.images,
  (newVal) => {
    syncImages(newVal || []);
  },
  { immediate: true, deep: true },
);

watch(
  imagesModel,
  () => {
    emitChanges();
  },
  { deep: true },
);

const triggerMultiFileInput = () => {
  if (props.disabled) return;
  multiFileInputRef.value?.click();
};

const handleMultipleImageSelect = (event) => {
  const files = event.target.files;
  if (files && files.length > 0 && !props.disabled) {
    processMultipleFiles(files);
  }
  event.target.value = "";
};

const processMultipleFiles = (files) => {
  if (props.disabled) return;

  const remainingSlots = MAX_IMAGES - imagesModel.value.length;
  if (remainingSlots <= 0) {
    toast.warning(
      `Maksimal ${MAX_IMAGES} gambar. Hapus gambar terlebih dahulu untuk menambah gambar baru.`,
    );
    return;
  }

  // Kumpulan key gambar yang sudah ada (untuk pengecekan duplikat)
  const existingKeys = new Set(
    imagesModel.value.map((image) => getImageKey(image)).filter(Boolean),
  );

  const validFiles = [];
  let skippedDuplicate = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!validateImage(file)) continue;

    const key = getImageKey({ file });
    if (existingKeys.has(key)) {
      skippedDuplicate++;
      continue;
    }
    existingKeys.add(key);
    validFiles.push(file);
  }

  if (validFiles.length === 0) {
    if (skippedDuplicate > 0) {
      toast.warning(
        "Gambar yang dipilih sudah ada. Tidak ada gambar baru yang ditambahkan.",
      );
    }
    return;
  }

  const filesToAdd = validFiles.slice(0, remainingSlots);
  const skippedLimit = validFiles.length - filesToAdd.length;

  if (skippedLimit > 0) {
    toast.warning(
      `Maksimal ${MAX_IMAGES} gambar. Sisa slot ${remainingSlots}, ${skippedLimit} gambar tidak ditambahkan.`,
    );
  }

  filesToAdd.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Cek ulang duplikat saat callback selesai untuk mencegah race condition
      const currentKeys = new Set(
        imagesModel.value.map((image) => getImageKey(image)).filter(Boolean),
      );
      if (currentKeys.has(getImageKey({ file }))) return;

      imagesModel.value = normalizeImages([
        ...imagesModel.value,
        {
          file,
          preview: e.target.result,
          name: file.name,
          is_featured: false,
        },
      ]);
    };
    reader.onerror = () => {
      toast.error(`Gagal membaca file ${file.name}. Coba lagi.`);
    };
    reader.readAsDataURL(file);
  });
};

const validateImage = (file) => {
  const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  const maxSize = 5 * 1024 * 1024;

  if (!validTypes.includes(file.type)) {
    toast.error("Invalid file type. Please use JPG, PNG, GIF, or WEBP.");
    return false;
  }

  if (file.size > maxSize) {
    toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
    return false;
  }

  return true;
};

const removeImage = (index) => {
  if (props.disabled) return;
  const image = imagesModel.value[index];
  if (!image) return;

  if (image.id && !image.file) {
    if (index === 0) {
      emit("remove-featured", image);
      return;
    }

    emit("remove-image", image);
    return;
  }

  imagesModel.value = normalizeImages(
    imagesModel.value.filter((_, currentIndex) => currentIndex !== index),
  );
};

const reorderImages = (fromIndex, toIndex) => {
  if (props.disabled) return;
  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= imagesModel.value.length ||
    toIndex >= imagesModel.value.length ||
    fromIndex === toIndex
  ) {
    return;
  }

  const previousFirst = imagesModel.value[0] || null;
  const reordered = [...imagesModel.value];
  const [movedImage] = reordered.splice(fromIndex, 1);
  reordered.splice(toIndex, 0, movedImage);
  imagesModel.value = normalizeImages(reordered);

  const nextFirst = imagesModel.value[0] || null;
  if (
    nextFirst?.id &&
    !nextFirst?.file &&
    getImageKey(previousFirst) !== getImageKey(nextFirst)
  ) {
    emit("set-featured", nextFirst);
  }
};

const handleDragStart = (index, event) => {
  if (props.disabled) return;
  draggedIndex.value = index;
  dragOverIndex.value = index;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(index));
  }
};

const handleDragOver = (index) => {
  if (props.disabled || draggedIndex.value === null) return;
  dragOverIndex.value = index;
};

const handleDragLeave = (index) => {
  if (dragOverIndex.value === index) {
    dragOverIndex.value = null;
  }
};

const handleDrop = (index) => {
  if (props.disabled || draggedIndex.value === null) return;
  reorderImages(draggedIndex.value, index);
  draggedIndex.value = null;
  dragOverIndex.value = null;
};

const handleDragEnd = () => {
  draggedIndex.value = null;
  dragOverIndex.value = null;
};

const clearAll = () => {
  imagesModel.value = [];
  draggedIndex.value = null;
  dragOverIndex.value = null;
};

defineExpose({
  clearAll,
});
</script>

<style scoped>
.shopee-image-upload {
  width: 100%;
}

.product-images-upload {
  width: 100%;
}

.images-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.image-upload-box,
.product-image-box {
  width: 160px;
  height: 160px;
  border: 2px dashed #000;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #fafafa;
  position: relative;
  overflow: hidden;
}

.image-upload-box:hover,
.product-image-box:hover {
  border-color: #000;
  background-color: #f3f3f3;
}

.product-image-box.is-dragging {
  opacity: 0.45;
  transform: scale(0.96);
}

.product-image-box.is-drop-target {
  border-color: #198754;
  box-shadow: 0 0 0 3px rgba(25, 135, 84, 0.18);
}

.image-upload-box:focus-visible {
  outline: 2px solid #000;
  outline-offset: 2px;
}

.image-upload-box.is-disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.image-upload-box .upload-icon {
  font-size: 2.5rem;
  color: #000;
}

.product-image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.drag-hint {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.72);
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.image-actions {
  position: absolute;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  opacity: 0;
  transition: opacity 0.2s;
  padding: 8px;
  box-sizing: border-box;
  z-index: 2;
}

.image-actions .btn-action {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
  color: white;
  padding: 0;
}

.image-actions .btn-action:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
}

.btn-remove {
  background: rgba(255, 77, 79, 0.8);
}

.btn-remove:hover {
  background: rgba(255, 77, 79, 1);
  transform: scale(1.1);
}

.product-image-box:hover .image-actions,
.product-image-box:focus-within .image-actions {
  opacity: 1;
}

.badge-featured {
  background: #52c41a;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 2;
}
</style>
