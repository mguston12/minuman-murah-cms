<template>
  <div class="tab-pane fade" :class="{ 'show active': isActive }">
    <h5 class="card-title mb-4">Middle Banner Configuration</h5>
    <form @submit.prevent="$emit('save-settings', 'topbanner')">
      <div class="row g-3">
        <div class="col-md-12">
          <label class="form-label">
            Middle Banner Text
          </label>
          <input v-model="formData.topbanner" type="text" class="form-control"
            placeholder="Masukkan text dari middle banner" />
        </div>
      </div>
      <div class="d-flex gap-2 mt-4">
        <button type="submit" class="btn btn-primary" :disabled="isLoading">
          {{ isLoading ? "Saving..." : "Save" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  formData: any;
  isLoading: boolean;
  isActive?: boolean;
}>();

defineEmits<{
  'save-settings': [category: string];
}>();
</script>
