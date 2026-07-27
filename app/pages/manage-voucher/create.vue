<template>
  <div>
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4 ">
      <div>
        <h4 class="mb-0">Create New Voucher</h4>
        <p class="text-muted mb-0">Add a new voucher to your website</p>
      </div>
      <NuxtLink to="/manage-voucher" class="btn btn-secondary">
        <i class="bi bi-arrow-left me-2"></i>Back to List
      </NuxtLink>
    </div>

    <!-- Form Card -->
    <div class="card">
      <div class="card-body">
        <div class="mb-4"></div>
        <form @submit.prevent="handleSubmit">
          <div class="row g-3">
            <!-- Name -->
            <div class="col-md-6">
              <label class="form-label fw-medium"
                >Voucher Name <span class="text-danger">*</span></label
              >
              <input
                v-model="form.name"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.name }"
                placeholder="Voucher Name"
                @input="generateSlugFromName"
              />
              <div v-if="errors.name" class="invalid-feedback d-block">
                {{ errors.name[0] }}
              </div>
            </div>

            <!-- Code -->
            <div class="col-md-6">
              <label class="form-label fw-medium"
                >Voucher Code <span class="text-danger">*</span></label
              >
              <input
                v-model="form.code"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.code }"
                placeholder="e.g. SAVE20"
              />
              <div v-if="errors.code" class="invalid-feedback d-block">
                {{ errors.code[0] }}
              </div>
            </div>

            <!-- minimum purchase -->
            <div class="col-md-6">
              <label class="form-label fw-medium"
                >Minimum Purchase <span class="text-danger">*</span></label
              >
              <input
                v-model.number="form.min_purchase"
                type="number"
                class="form-control"
                :class="{ 'is-invalid': errors.min_purchase }"
                placeholder="e.g. 100000"
              />
              <div v-if="errors.min_purchase" class="invalid-feedback d-block">
                {{ errors.min_purchase[0] }}
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-medium">Status Publish</label>
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="is_published"
                  v-model="form.is_published"
                  :class="{ 'is-invalid': errors.is_published }"
                />
                <label class="form-check-label" for="is_published">
                  {{ form.is_published ? "Published" : "Unpublished" }}
                </label>
                <div
                  v-if="errors.is_published"
                  class="invalid-feedback d-block"
                >
                  {{ errors.is_published[0] }}
                </div>
              </div>
            </div>

            <!-- Category Selector -->
            <!-- <div class="col-md-12">
              <label class="form-label fw-medium">Category</label>

              <div class="dropdown">
                <button
                  class="form-control dropdown-toggle text-start d-flex flex-wrap align-items-center gap-1"
                  type="button"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="outside"
                  aria-expanded="false"
                >
                  <div class="d-flex flex-wrap gap-1 flex-grow-1">
                    <span
                      v-if="selectedCategories.length === 0"
                      class="text-muted"
                    >
                      Select categories...
                    </span>

                    <span
                      v-for="cat in selectedCategories"
                      :key="cat.id"
                      class="badge bg-primary"
                    >
                      {{ cat.taxonomy_name }}
                      <span
                        class="ms-1"
                        @click.stop="removeCategory(cat.id)"
                        style="cursor: pointer"
                      >
                        ×
                      </span>
                    </span>
                  </div>
                </button>
                <ul class="dropdown-menu w-100">
                  <li v-for="cat in categories" :key="cat.id">
                    <a
                      class="dropdown-item d-flex justify-content-between align-items-center"
                      :class="{ 'bg-light fw-medium': isSelected(cat.id) }"
                      href="#"
                      @click.prevent="toggleCategory(cat)"
                    >
                      <span>{{ cat.taxonomy_name }}</span>

                      <i
                        v-if="isSelected(cat.id)"
                        class="bi bi-check-lg text-primary"
                      ></i>
                    </a>
                  </li>
                </ul>
              </div>

              <div
                v-if="errors.fk_category_id"
                class="invalid-feedback d-block"
              >
                {{ errors.fk_category_id[0] }}
              </div>
            </div> -->

            <!-- Discount Type -->
            <div class="col-md-6">
              <label class="form-label fw-medium"
                >Discount Type <span class="text-danger">*</span></label
              >
              <select
                v-model="form.discount_type"
                class="form-select"
                :class="{ 'is-invalid': errors.discount_type }"
              >
                <option value="">Select Type</option>
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED">Fixed</option>
              </select>
              <div v-if="errors.discount_type" class="invalid-feedback d-block">
                {{ errors.discount_type[0] }}
              </div>
            </div>

            <!-- Discount Value -->
            <div class="col-md-6">
              <label class="form-label fw-medium"
                >Discount Value <span class="text-danger">*</span></label
              >
              <input
                v-model.number="form.discount_value"
                type="number"
                min="0"
                max="form.discount_type === 'PERCENTAGE' ? 100 : null"
                class="form-control"
                :class="{ 'is-invalid': errors.discount_value }"
                placeholder="0"
              />
              <div
                v-if="errors.discount_value"
                class="invalid-feedback d-block"
              >
                {{ errors.discount_value[0] }}
              </div>
            </div>

            <!-- Limit User -->
            <div class="col-md-6">
              <label class="form-label fw-medium">Limit Users</label>
              <input
                v-model.number="form.limit_user"
                type="number"
                min="1"
                class="form-control"
                :class="{ 'is-invalid': errors.limit_user }"
                placeholder="Leave empty for unlimited"
              />
              <div v-if="errors.limit_user" class="invalid-feedback d-block">
                {{ errors.limit_user[0] }}
              </div>
            </div>

            <!-- Status -->
            <div class="col-md-6">
              <label class="form-label fw-medium">Status</label>
              <select
                v-model="form.status"
                class="form-select"
                :class="{ 'is-invalid': errors.status }"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="DRAFT">Draft</option>
              </select>
              <div v-if="errors.status" class="invalid-feedback d-block">
                {{ errors.status[0] }}
              </div>
            </div>

            <!-- Start Date -->
            <div class="col-md-6">
              <label class="form-label fw-medium">Start Date</label>
              <input
                v-model="form.start_date"
                type="datetime-local"
                class="form-control"
                :class="{ 'is-invalid': errors.start_date }"
              />
              <div v-if="errors.start_date" class="invalid-feedback d-block">
                {{ errors.start_date[0] }}
              </div>
            </div>

            <!-- End Date -->
            <div class="col-md-6">
              <label class="form-label fw-medium">End Date</label>
              <input
                v-model="form.end_date"
                type="datetime-local"
                class="form-control"
                :class="{ 'is-invalid': errors.end_date }"
              />
              <div v-if="errors.end_date" class="invalid-feedback d-block">
                {{ errors.end_date[0] }}
              </div>
            </div>

            <!-- Description -->
            <div class="col-12">
              <label class="form-label fw-medium">Description</label>
              <TiptapEditor v-model="form.description" placeholder="Optional description..." />
            </div>

            <!-- Message -->
            <div v-if="message" class="col-12">
              <div
                class="alert"
                :class="
                  messageType === 'success' ? 'alert-success' : 'alert-danger'
                "
              >
                {{ message }}
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-4 d-flex justify-content-end gap-2">
            <NuxtLink
              to="/manage-voucher"
              class="btn btn-secondary"
              :disabled="loading"
            >
              Cancel
            </NuxtLink>

            <button type="submit" class="btn btn-primary action-btn-dark" :disabled="loading">
              <span
                v-if="loading"
                class="spinner-border spinner-border-sm me-2 "
                role="status"
                aria-hidden="true"
              ></span>
              <span v-if="loading">Creating...</span>
              <span v-else>Create Voucher</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VoucherCategory, VoucherCreatePayload } from "~/types/voucher";
import { useVoucherApi } from "~/composables/useVoucherApi";
import { generateSlug } from "~/utils/helpers";

definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

useAppTitle("Create Voucher");

const { createVoucher, getCategories } = useVoucherApi();
const toast = useToast();
const router = useRouter();

const categories = ref([]);

const form = reactive<VoucherCreatePayload>({
  name: "",
  code: "",
  description: null,
  status: "ACTIVE",
  limit_user: null,
  start_date: null,
  end_date: null,
  min_purchase: 0,
  is_published: true,
  fk_category_id: [],
  discount_type: null,
  discount_value: null,
});

const errors = ref<Record<string, string[]>>({});
const message = ref("");
const messageType = ref<"success" | "error">("error");
const loading = ref(false);

const validate = () => {
  errors.value = {};

  if (!form.name) errors.value.name = ["Name is required"];
  if (!form.code) errors.value.code = ["Code is required"];
  if (!form.discount_type)
    errors.value.discount_type = ["Discount type is required"];
  if (form.discount_value === null)
    errors.value.discount_value = ["Discount value is required"];
  if (form.min_purchase !== null && form.min_purchase < 0)
    errors.value.min_purchase = ["Minimum purchase must be >= 0"];
  if (form.discount_value !== null && form.discount_value < 0)
    errors.value.discount_value = ["Discount value must be >= 0"];
  if (form.discount_type === "PERCENTAGE" && form.discount_value !== null) {
    if (form.discount_value > 100) {
      errors.value.discount_value = ["Percentage cannot exceed 100%"];
    }
  }

  const now = new Date();

  if (
    form.start_date &&
    new Date(form.start_date) > now &&
    form.status === "ACTIVE"
  ) {
    errors.value.status = [
      "The voucher cannot be active before its start date",
    ];
  }

  if (form.end_date && form.start_date) {
    if (new Date(form.end_date) < new Date(form.start_date)) {
      errors.value.end_date = ["End date must be after start date"];
    }
  }

  if (
    form.end_date &&
    form.status === "ACTIVE" &&
    new Date(form.end_date) < now
  ) {
    errors.value.end_date = [
      "End date cannot be earlier than today for active vouchers",
    ];
  }

  return Object.keys(errors.value).length === 0;
};

const generateSlugFromName = () => {
  if (!form.name) {
    form.code = "";
    return;
  }
  form.code = generateSlug(form.name);
};

const loadCategories = async () => {
  const { data, error } = await getCategories();
  if (!error) {
    categories.value = data;
  }
};

onMounted(() => {
  loadCategories();
});

const selectedCategories = ref<VoucherCategory[]>([]);

const isSelected = (id: number) => {
  return selectedCategories.value.some((c) => c.id === id);
};

const toggleCategory = (cat: VoucherCategory) => {
  const index = selectedCategories.value.findIndex((c) => c.id === cat.id);

  if (index !== -1) {
    selectedCategories.value.splice(index, 1);
  } else {
    selectedCategories.value.push(cat);
  }
};

const removeCategory = (id: number) => {
  selectedCategories.value = selectedCategories.value.filter(
    (c) => c.id !== id,
  );
};

const handleSubmit = async () => {
  message.value = "";
  messageType.value = "error";
  form.fk_category_id = selectedCategories.value.map((c) => c.id);

  if (!validate()) {
    message.value = "Please fix the errors";
    return;
  }

  loading.value = true;

  const { data, error } = await createVoucher(form);

  if (error) {
    message.value = error.message || "Failed to create voucher";
    errors.value = error.errors || {};
    toast.error(message.value);
  } else {
    message.value = "Voucher created successfully!";
    messageType.value = "success";
    toast.success(message.value);

    setTimeout(() => {
      router.push("/manage-voucher");
    }, 1000);
  }

  loading.value = false;
};
</script>
<style scoped>
.dropdown-toggle.form-control {
  min-height: 38px;
  height: auto;
  white-space: normal;
  position: relative;
  padding-right: 2.5rem;
}

.dropdown-toggle::after {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
}
</style>
