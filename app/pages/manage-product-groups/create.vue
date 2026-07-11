<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="mb-0">Create Product Group</h4>
        <p class="text-muted mb-0">Add a new product group</p>
      </div>
      <NuxtLink to="/manage-product-groups" class="btn btn-secondary">
        <i class="bi bi-arrow-left me-2"></i>Back to List
      </NuxtLink>
    </div>

    <div class="card">
      <div class="card-body py-4">
        <form @submit.prevent="handleSubmit">
          <div class="row g-3 mb-4">
            <div class="col-md-6">
              <label class="form-label">
                Title <span class="text-danger">*</span>
              </label>
              <input
                v-model="form.title"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.title }"
                required
              />
              <div v-if="errors.title" class="invalid-feedback d-block">
                {{ errors.title[0] }}
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label">
                Key <span class="text-danger">*</span>
              </label>
              <input
                v-model="form.key"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.key }"
                placeholder="rekomendasi-untukmu"
                required
              />
              <div v-if="errors.key" class="invalid-feedback d-block">
                {{ errors.key[0] }}
              </div>
            </div>

            <div class="col-12">
              <label class="form-label">Description</label>
              <textarea
                v-model="form.description"
                class="form-control"
                rows="3"
                placeholder="Deskripsi singkat product group"
              ></textarea>
            </div>

            <div class="col-md-6">
              <label class="form-label">
                Status <span class="text-danger">*</span>
              </label>
              <select v-model="form.status" class="form-select">
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            <div class="col-md-6">
              <label class="form-label">Sort Order</label>
              <input
                v-model.number="form.sort"
                type="number"
                class="form-control"
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">Image</label>
              <input
                type="file"
                accept="image/*"
                class="form-control"
                @change="handleImageSelect"
              />
              <div v-if="imagePreview" class="mt-2">
                <img
                  :src="imagePreview"
                  class="img-thumbnail"
                  style="max-width: 200px; max-height: 200px; object-fit: cover"
                />
              </div>
            </div>
          </div>

          <div class="d-flex gap-2">
            <button
              type="submit"
              class="btn btn-primary action-btn-dark"
              :disabled="submitting"
            >
              <i v-if="submitting" class="bi bi-hourglass-split me-2"></i>
              {{ submitting ? "Creating..." : "Create Group" }}
            </button>
            <NuxtLink to="/manage-product-groups" class="btn btn-secondary">
              Cancel
            </NuxtLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

import type { ProductGroupStatus } from "~/types/product-group";

interface ProductGroupCreateForm {
  title: string;
  key: string;
  description: string;
  status: ProductGroupStatus;
  sort: number;
  image: File | null;
}

const router = useRouter();
const { createProductGroup } = useProductGroupApi();

const form = ref<ProductGroupCreateForm>({
  title: "",
  key: "",
  description: "",
  status: "ACTIVE",
  sort: 0,
  image: null,
});

const imagePreview = ref<string | null>(null);
const errors = ref<Record<string, string[]>>({});
const submitting = ref(false);

const handleImageSelect = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  form.value.image = file;

  const reader = new FileReader();
  reader.onload = () => {
    imagePreview.value = reader.result as string;
  };
  reader.readAsDataURL(file);
};

const handleSubmit = async () => {
  submitting.value = true;
  errors.value = {};

  const { data, error } = await createProductGroup(form.value);

  if (error) {
    errors.value = error.errors || {};
    submitting.value = false;
    return;
  }

  if (data?.success) {
    await router.push("/manage-product-groups");
  }

  submitting.value = false;
};
</script>
