<template>
  <div class="py-2">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="mb-0">Edit Product Group</h4>
        <p class="text-muted mb-0">Update product group data</p>
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
                required
              />
              <div v-if="errors.key" class="invalid-feedback d-block">
                {{ errors.key[0] }}
              </div>
            </div>

            <div class="col-12">
              <label class="form-label">Description</label>
              <TiptapEditor v-model="form.description" placeholder="Deskripsi singkat product group" />
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
              class="btn btn-success"
              :disabled="submitting"
            >
              <i v-if="submitting" class="bi bi-hourglass-split me-2"></i>
              {{ submitting ? "Updating..." : "Update Group" }}
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

interface ProductGroupEditForm {
  title: string;
  key: string;
  description: string;
  status: ProductGroupStatus;
  sort: number;
  image?: File | null;
}

const route = useRoute();
const router = useRouter();
const { getProductGroup, updateProductGroup } = useProductGroupApi();

const groupId = Number(route.params.id);

const form = ref<ProductGroupEditForm>({
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
const loading = ref(true);

/**
 * Fetch existing data
 */
const fetchGroup = async () => {
  try {
    const { data, error } = await getProductGroup(groupId);

    if (error) return;

    const group = data?.data;
    if (!group) return;

    form.value.title = group.title;
    form.value.key = group.key;
    form.value.description = group.description ?? "";
    form.value.status = group.status;
    form.value.sort = group.sort ?? 0;
    imagePreview.value = group.image_url ?? null;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchGroup);

/**
 * Image select
 */
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

/**
 * Submit update
 */
const handleSubmit = async () => {
  submitting.value = true;
  errors.value = {};

  const { data, error } = await updateProductGroup(groupId, form.value);

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
