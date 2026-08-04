<template>
  <div
    id="variantModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="variantModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header bg-primary text-white">
          <h5
            class="modal-title d-flex align-items-center"
            id="variantModalLabel"
          >
            <i class="bi bi-box-seam me-2"></i>
            {{
              editingVariantIndex !== null ? "Edit Variant" : "Add New Variant"
            }}
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="handleCancel"
          ></button>
        </div>
        <div class="modal-body">
          <ul class="nav nav-tabs mb-4" role="tablist">
            <li class="nav-item" role="presentation">
              <button
                class="nav-link active"
                id="attributes-tab"
                data-bs-toggle="tab"
                data-bs-target="#attributes-pane"
                type="button"
                role="tab"
              >
                <i class="bi bi-tags me-1"></i>Attributes
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                id="details-tab"
                data-bs-toggle="tab"
                data-bs-target="#details-pane"
                type="button"
                role="tab"
              >
                <i class="bi bi-info-circle me-1"></i>Details
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                id="store-tab"
                data-bs-toggle="tab"
                data-bs-target="#store-pane"
                type="button"
                role="tab"
              >
                <i class="bi bi-shop me-1"></i>Store
              </button>
            </li>
          </ul>

          <div class="tab-content">
            <div
              class="tab-pane fade show active"
              id="attributes-pane"
              role="tabpanel"
            >
              <div class="row g-3">
                <div class="col-12 border-bottom pb-3 mb-2">
                  <div class="form-check form-switch">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="singleVariantToggle"
                      v-model="isSingleVariant"
                      :disabled="editingVariantIndex !== null || availableAttributes.length == 0"
                    />
                    <label class="form-check-label fw-bold" for="singleVariantToggle">
                      Allow variant without attributes (single variant)
                    </label>
                  </div>
                </div>

                <div class="col-12">
                  <div
                    v-if="selectedAttributes.length === 0"
                    class="text-muted small"
                  >
                    No attributes available.
                  </div>

                  <div v-else class="row g-3">
                    <div
                      v-for="selectedAttr in selectedAttributes"
                      :key="selectedAttr.attribute_id"
                      class="col-12"
                    >
                      <div class="card border-primary">
                        <div class="card-header bg-light">
                          <label class="form-label fw-bold mb-0">
                            <i class="bi bi-tag me-2"></i>
                            {{ getAttributeName(selectedAttr.attribute_id) }}
                          </label>
                        </div>
                        <div class="card-body">
                          <div class="row g-3">
                            <div
                              v-for="value in getAttributeValuesList(
                                selectedAttr.attribute_id,
                              )"
                              :key="value.id"
                              class="col-md-3 col-sm-6 col-12"
                            >
                              <div
                                class="form-check variant-attribute-option p-2 rounded mb-0 h-100 d-flex align-items-center"
                                :class="{
                                  'is-selected':
                                    localVariantForm.selectedAttributeValues[
                                      selectedAttr.attribute_id
                                    ] === value.id,
                                  'is-disabled':
                                    editingVariantIndex !== null ||
                                    value.status === 'INACTIVE' ||
                                    isSingleVariant,
                                }"
                              >
                                <input
                                  class="form-check-input me-2 mt-0"
                                  type="radio"
                                  :name="`attr-${selectedAttr.attribute_id}`"
                                  :value="value.id"
                                  :id="`variant-attr-${selectedAttr.attribute_id}-value-${value.id}`"
                                  v-model="
                                    localVariantForm.selectedAttributeValues[
                                      selectedAttr.attribute_id
                                    ]
                                  "
                                  @change="handleUpdateVariantName"
                                  :disabled="
                                    editingVariantIndex !== null ||
                                    value.status === 'INACTIVE' ||
                                    isSingleVariant
                                  "
                                  :title="
                                    value.status === 'INACTIVE'
                                      ? 'INACTIVE values cannot be selected'
                                      : ''
                                  "
                                />
                                <label
                                  class="form-check-label flex-grow-1 mb-0"
                                  :for="`variant-attr-${selectedAttr.attribute_id}-value-${value.id}`"
                                  :class="{
                                    'text-muted':
                                      (editingVariantIndex !== null ||
                                        value.status === 'INACTIVE' ||
                                        isSingleVariant) &&
                                      localVariantForm.selectedAttributeValues[
                                        selectedAttr.attribute_id
                                      ] !== value.id,
                                    'selected-option-label':
                                      localVariantForm.selectedAttributeValues[
                                        selectedAttr.attribute_id
                                      ] === value.id,
                                    'cursor-not-allowed':
                                      value.status === 'INACTIVE' || isSingleVariant,
                                  }"
                                >
                                  {{ value.value }}
                                  <span
                                    v-if="value.status === 'INACTIVE'"
                                    class="badge bg-secondary ms-2"
                                  >
                                    INACTIVE
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>
                          <div
                            v-if="
                              getAttributeValuesList(selectedAttr.attribute_id)
                                .length === 0
                            "
                            class="text-muted small mt-2"
                          >
                            No values available.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-12 mt-3">
                    <label class="form-label fw-bold">
                      <i class="bi bi-pencil-square me-1"></i>
                      Variant Name
                    </label>
                    <input
                      v-model="localVariantForm.variant_name"
                      type="text"
                      class="form-control form-control-lg"
                      placeholder="Variant name"
                      :disabled="localVariantForm.variant_name === 'No Variant' && isSingleVariant"
                    />
                  </div>

                </div>
              </div>
            </div>

            <div class="tab-pane fade" id="details-pane" role="tabpanel">
              <div class="row g-3">
                <div class="col-12">
                </div>
                <div class="col-12">
                  <div class="variant-image-upload">
                    <input
                      ref="variantImageInput"
                      type="file"
                      accept="image/*"
                      class="d-none"
                      @change="handleVariantImageSelect"
                    />

                    <div
                      class="variant-image-box"
                      :class="{
                        'has-image':
                          localVariantForm.image_preview ||
                          localVariantForm.image_path,
                      }"
                      role="button"
                      tabindex="0"
                      @click="triggerVariantImageInput"
                      @keydown.enter="triggerVariantImageInput"
                      @keydown.space.prevent="triggerVariantImageInput"
                    >
                      <template
                        v-if="
                          localVariantForm.image_preview ||
                          localVariantForm.image_path
                        "
                      >
                        <img
                          :src="
                            localVariantForm.image_preview ??
                            localVariantForm.image_path ??
                            undefined
                          "
                          alt="Variant preview"
                          class="variant-image-preview"
                        />
                        <div
                          class="variant-image-overlay d-flex align-items-center justify-content-center"
                        >
                          <i class="bi bi-pencil"></i>
                        </div>
                        <button
                          type="button"
                          class="btn-remove-variant-image"
                          @click.stop="handleClearVariantImage"
                        >
                          <i class="bi bi-x"></i>
                        </button>
                      </template>
                      <template v-else>
                        <i class="bi bi-image variant-image-icon"></i>
                        <span class="mt-2">Upload Variant Image</span>
                      </template>
                    </div>
                  </div>
                  <small class="text-muted d-block mt-2">
                    Supported formats: JPG, PNG, GIF, WEBP. Max size: 5MB.
                  </small>
                </div>

                <div class="col-12 mt-4">
                  <div class="border-bottom pb-2 mb-3">
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">
                    <i class="bi bi-upc me-1"></i>
                    SKU
                  </label>
                  <input
                    v-model="localVariantForm.sku"
                    type="text"
                    :class="['form-control', { 'is-invalid': formErrors.sku || apiErrors.sku }]"
                    placeholder="SKU-001"
                    @input="clearError('sku')"
                  />
                  <div v-if="formErrors.sku || apiErrors.sku" class="invalid-feedback d-block">
                    {{ formErrors.sku || (apiErrors.sku || []).join(', ') }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">
                    <i class="bi bi-currency-dollar me-1"></i>
                    Selling Price <span class="text-danger">*</span>
                  </label>
                  <div class="input-group" :class="{ 'is-invalid': formErrors.price || apiErrors.price }">
                    <span class="input-group-text">Rp</span>
                    <input
                      v-model.number="localVariantForm.price"
                      type="number"
                      step="0.01"
                      required
                      :class="['form-control', { 'is-invalid': formErrors.price || apiErrors.price }]"
                      placeholder="0.00"
                      @input="clearError('price')"
                    />
                  </div>
                  <div v-if="formErrors.price || apiErrors.price" class="invalid-feedback d-block">
                    {{ formErrors.price || (apiErrors.price || []).join(', ') }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">
                    <i class="bi bi-tag me-1"></i>
                    Strike Price 
                    <span
                      v-if="discountPercentage !== null"
                      class="badge bg-danger ms-2"
                    >
                      {{ discountPercentage }}% OFF
                    </span>
                  </label>
                  <div class="input-group">
                    <span class="input-group-text">Rp</span>
                    <input
                      v-model.number="localVariantForm.strike_price"
                      type="number"
                      step="0.01"
                      class="form-control"
                      placeholder="0.00"
                    />
                  </div>
                  <small
                    v-if="discountPercentage !== null"
                    class="text-success d-block mt-1"
                  >
                    <i class="bi bi-percent me-1"></i>
                    Discount: {{ discountPercentage }}%
                  </small>
                </div>
                <div class="col-md-6">
                  <label class="form-label">
                    <i class="bi bi-toggle-on me-1"></i>
                    Status
                  </label>
                  <select v-model="localVariantForm.status" class="form-select">
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label"
                    >Weight ({{
                      localVariantForm.type_weight === "GRAM" ? "g" : "kg"
                    }})</label
                  >
                  <input
                    v-model.number="localVariantForm.weight"
                    type="number"
                    step="0.01"
                    min="0"
                    class="form-control"
                    placeholder="0.00"
                  />
                </div>
                <div class="col-md-6" >
                  <label class="form-label">Weight Type</label>
                  <select
                    v-model="localVariantForm.type_weight"
                    class="form-select"
                  >
                    <option value="GRAM">Gram</option>
                    <option value="KG">Kilogram</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="tab-pane fade" id="store-pane" role="tabpanel">
              <div class="row g-3">
                <div class="col-12">

                  <div
                    class="card mb-4"
                    :class="{ 'border-primary': localEditingStoreStockIndex !== null }"
                  >
                    <div class="card-header bg-white">
                      <div class="d-flex justify-content-between align-items-center">
                        
                        <button
                          v-if="localEditingStoreStockIndex !== null"
                          type="button"
                          class="btn btn-sm btn-outline-secondary"
                          @click="handleResetStoreStockForm"
                        >
                          <i class="bi bi-x-circle me-1"></i> Cancel
                        </button>
                      </div>
                    </div>
                    <div class="card-body">
                      <div class="row g-3 align-items-end">
                        <div class="col-lg-4 col-md-6">
                          <div class="stock-form-field h-100 d-flex flex-column">
                            <label class="form-label fw-semibold">Store <span class="text-danger">*</span></label>
                            <select
                              v-model.number="localStoreStockForm.store_id"
                              class="form-select"
                              :disabled="loadingStores"
                              @focus="handleLoadStores"
                            >
                              <option value="">Select a store</option>
                              <option
                                v-for="store in availableStoreOptions"
                                :key="store.id"
                                :value="store.id"
                              >
                                {{ store.name }}{{ store.code ? ` (${store.code})` : "" }}
                              </option>
                            </select>
                          </div>
                        </div>
                        <div class="col-lg-2 col-md-3 col-6">
                          <div class="stock-form-field h-100 d-flex flex-column">
                            <label class="form-label fw-semibold">Stock Qty <span class="text-danger">*</span></label>
                            <input
                              v-model.number="localStoreStockForm.qty"
                              type="number"
                              min="0"
                              step="1"
                              class="form-control"
                              placeholder="0"
                            />
                          </div>
                        </div>
                        <div class="col-lg-2 col-md-3 col-6">
                          <div class="stock-form-field h-100 d-flex flex-column">
                            <label class="form-label fw-semibold">Reserved Qty</label>
                            <input
                              v-model.number="localStoreStockForm.reserved_qty"
                              type="number"
                              min="0"
                              step="1"
                              class="form-control"
                              placeholder="0"
                            />
                          </div>
                        </div>
                        <div class="col-lg-4 col-md-6 col-12">
                          <div class="stock-form-field h-100 d-flex flex-column">
                            <label class="form-label fw-semibold">Available</label>
                            <div class="form-control bg-light">{{ stockFormAvailableQty }}</div>
                          </div>
                        </div>
                      </div>

                      <div
                        v-if="isStoreStockDuplicate"
                        class="alert alert-light border mb-0 mt-3 py-2"
                        role="alert"
                      >
                        Store already added.
                      </div>
                      <div
                        v-else-if="isReservedExceedingQty"
                        class="alert alert-light border mb-0 mt-3 py-2"
                        role="alert"
                      >
                        Reserved cannot exceed stock.
                      </div>
                    </div>
                  </div>

                  <div
                    v-if="sortedVariantStoreStocks.length > 0"
                    class="table-responsive stock-table-wrap"
                  >
                    <table class="table table-sm table-bordered">
                      <thead class="table-light">
                        <tr>
                          <th style="width: 32%;">Store</th>
                          <th class="text-center" style="width: 14%;">Stock</th>
                          <th class="text-center" style="width: 14%;">Reserved</th>
                          <th class="text-center" style="width: 14%;">Available</th>
                          <th class="text-center" style="width: 16%;">Status</th>
                          <th class="text-center" style="width: 10%;">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="({ storeStock, index }) in sortedVariantStoreStocks"
                          :key="storeStock.id || `store-${storeStock.store_id}-${index}`"
                        >
                          <td>
                            <div class="fw-semibold">{{ storeStock.store?.name || "N/A" }}</div>
                            <small v-if="storeStock.store?.code" class="text-muted">{{ storeStock.store.code }}</small>
                          </td>
                          <td class="text-center fw-semibold">{{ storeStock.qty }}</td>
                          <td class="text-center">{{ storeStock.reserved_qty || 0 }}</td>
                          <td class="text-center fw-semibold">
                            {{ (storeStock.qty || 0) - (storeStock.reserved_qty || 0) }}
                          </td>
                          <td class="text-center">
                            <span class="badge" :class="getStockStatusBadgeClass(storeStock)">
                              {{ getStockStatusLabel(storeStock) }}
                            </span>
                          </td>
                          <td class="text-center">
                            <div class="btn-group btn-group-sm" role="group">
                              <button
                                type="button"
                                class="btn btn-outline-secondary"
                                title="Edit"
                                @click="handleEditStoreStock(index)"
                              >
                                <i class="bi bi-pencil"></i>
                              </button>
                              <button
                                type="button"
                                class="btn btn-outline-secondary"
                                title="Delete"
                                @click="handleDeleteStoreStock(index)"
                              >
                                <i class="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                      <tfoot class="table-light">
                        <tr>
                          <th class="fw-bold text-secondary">Total</th>
                          <th class="fw-bold">{{ totalVariantStock }}</th>
                          <th class="fw-bold">{{ totalReservedStock }}</th>
                          <th class="fw-bold">{{ totalAvailableStock }}</th>
                          <th></th>
                          <th></th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  <div v-else class="text-center py-4">
                    <i class="bi bi-inbox fs-1 text-muted mb-2"></i>
                    <p class="text-muted mb-0">No stock yet</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div class="modal-footer flex-column align-items-stretch gap-2">
          <div v-if="hasApiErrors" class="alert alert-danger mb-0 py-2 w-100">
            <div class="fw-semibold mb-1 d-flex align-items-center gap-1">
              <i class="bi bi-exclamation-triangle-fill"></i> Failed to save variant:
            </div>
            <ul class="mb-0 ps-3">
              <template v-for="(msgs, field) in apiErrors" :key="field">
                <li v-for="msg in msgs" :key="msg">
                  <strong>{{ fieldLabel(String(field)) }}:</strong> {{ msg }}
                </li>
              </template>
            </ul>
          </div>
          <div class="d-flex justify-content-end gap-2 w-100">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              @click="handleCancel"
            >
              Cancel
            </button>
            <button
              type="button"
              :class="
                editingVariantIndex !== null
                  ? 'btn btn-success'
                  : 'btn btn-primary action-btn-dark'
              "
              @click="handleSave"
              :disabled="savingVariant"
            >
              <span
                v-if="savingVariant"
                class="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
              {{
                editingVariantIndex !== null ? "Update Variant" : "Add Variant"
              }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from "vue";
import { useToast } from "~/composables/useToast";
import { useStoreApi } from "~/composables/useStoreApi";

interface Props {
  selectedAttributes: Array<{
    attribute_id: number;
    sort: number;
    values: number[];
  }>;
  variantForm: {
    selectedAttributeValues: Record<number, number>;
    attribute_value_ids: number[];
    variant_name: string;
    sku: string;
    price: number;
    strike_price: number | null;
    status: "ACTIVE" | "INACTIVE";
    image_file: File | null;
    image_preview: string | null;
    image_path: string | null;
    weight: number | null;
    type_weight: "GRAM" | "KG";
  };
  variantStoreStocks: Array<{
    id?: number;
    store_id: number;
    qty: number;
    reserved_qty: number;
    store?: {
      id: number;
      name: string;
      code?: string;
    };
  }>;
  editingVariantIndex: number | null;
  availableAttributes: Array<{
    id: number;
    name: string;
    slug: string;
    attribute_values?: Array<{
      id: number;
      value: string;
      slug: string;
      status?: string;
    }>;
  }>;
  productSlug?: string;
  apiErrors?: Record<string, string[]>;
}

const props = withDefaults(defineProps<Props>(), {
  apiErrors: () => ({}),
});

const emit = defineEmits<{
  save: [variantData: any];
  cancel: [];
  "update:variantForm": [form: Props["variantForm"]];
  "update:variantStoreStocks": [stocks: Props["variantStoreStocks"]];
  "update-variant-name": [];
  "update-variant-sku": [];
}>();

const toast = useToast();
const { getAllStores } = useStoreApi();

const localVariantForm = ref({ ...props.variantForm });
const localVariantStoreStocks = ref([...props.variantStoreStocks]);
const localEditingStoreStockIndex = ref<number | null>(null);
const localStoreStockForm = ref({
  store_id: null as number | null,
  qty: 0,
  reserved_qty: 0,
});

const isSingleVariant = ref(false);

const formErrors = ref<Record<string, string>>({});

const hasApiErrors = computed(() => {
  const errs = props.apiErrors;
  return !!errs && Object.keys(errs).length > 0;
});

const clearError = (field: string) => {
  delete formErrors.value[field];
};

const fieldLabel = (field: string): string => {
  const labels: Record<string, string> = {
    sku: "SKU",
    price: "Selling Price",
    strike_price: "Strike Price",
    variant_name: "Variant Name",
    attribute_value_ids: "Attribute",
    qty: "Stock Qty",
    reserved_qty: "Reserved Qty",
    store_id: "Store",
  };
  return labels[field] ?? field.replace(/_/g, " ");
};

const stores = ref<Array<{ id: number; name: string; code?: string }>>([]);
const loadingStores = ref(false);
const savingVariant = ref(false);
const variantImageInput = ref<HTMLInputElement | null>(null);

const generateSKU = () => {
  const productPrefix = props.productSlug
    ? props.productSlug.replace(/[^a-zA-Z0-9]/g, "-").toUpperCase().substring(0, 6)
    : "SKU";

  const attrValueSlugs: string[] = [];

  const sortedAttrs = [...props.selectedAttributes].sort(
    (a, b) => a.attribute_id - b.attribute_id
  );

  sortedAttrs.forEach((selectedAttr) => {
    const selectedValueId =
      localVariantForm.value.selectedAttributeValues[selectedAttr.attribute_id];
    if (selectedValueId) {
      const value = getAttributeValuesList(selectedAttr.attribute_id).find(
        (v) => v.id === selectedValueId,
      );
      if (value && value.slug) {
        attrValueSlugs.push(value.slug.substring(0, 3).toUpperCase());
      } else if (value) {
        attrValueSlugs.push(value.value.substring(0, 3).toUpperCase());
      }
    }
  });

  if (attrValueSlugs.length === 0) {
    const timestamp = Date.now().toString(36).toUpperCase();
    return `${productPrefix}-${timestamp}`;
  }

  const attrSuffix = attrValueSlugs.join("-");
  return `${productPrefix}-${attrSuffix}`;
};

watch(isSingleVariant, (val) => {
  if (props.editingVariantIndex !== null) return;

  if (val) {
    localVariantForm.value.variant_name = "No Variant";
    localVariantForm.value.sku = generateSKU();
    localVariantForm.value.selectedAttributeValues = {};
    localVariantForm.value.attribute_value_ids = [];
  } else {
    localVariantForm.value.variant_name = "";
    const hasSelected = props.selectedAttributes.some(
      (attr) => localVariantForm.value.selectedAttributeValues[attr.attribute_id]
    );
    if (hasSelected) {
      handleUpdateVariantName();
    } else {
      localVariantForm.value.sku = generateSKU();
    }
  }
  emit("update:variantForm", { ...localVariantForm.value });
});

watch(
  () => props.variantForm,
  (newForm) => { 
    localVariantForm.value = { ...newForm }; 
    
    if (props.editingVariantIndex !== null) {
      isSingleVariant.value = (!newForm.attribute_value_ids || newForm.attribute_value_ids.length === 0);
    } else {
      // Default: toggle off. Do not auto-enable when selectedAttributes empty.
      // If availableAttributes is empty, toggle is disabled anyway.
      // If attributes exist but none selected, user can toggle manually.
      if (isSingleVariant.value) {
        // If somehow true, populate defaults
        if (!localVariantForm.value.variant_name) {
          localVariantForm.value.variant_name = "No Variant";
        }
        if (!localVariantForm.value.sku) {
          localVariantForm.value.sku = generateSKU();
        }
      }
    }
  },
  { deep: true, immediate: true },
);

watch(
  () => props.variantStoreStocks,
  (newStocks) => { localVariantStoreStocks.value = [...newStocks]; },
  { deep: true },
);

const totalVariantStock = computed(() =>
  localVariantStoreStocks.value.reduce((sum, s) => sum + (s.qty || 0), 0),
);

const totalReservedStock = computed(() =>
  localVariantStoreStocks.value.reduce((sum, s) => sum + (s.reserved_qty || 0), 0),
);

const totalAvailableStock = computed(() => totalVariantStock.value - totalReservedStock.value);

const assignedStoreIds = computed(() =>
  new Set(
    localVariantStoreStocks.value
      .filter((_, idx) => idx !== localEditingStoreStockIndex.value)
      .map((s) => s.store_id),
  ),
);

const availableStoreOptions = computed(() =>
  [...stores.value].sort((a, b) => {
    const aA = assignedStoreIds.value.has(a.id);
    const bA = assignedStoreIds.value.has(b.id);
    if (aA !== bA) return Number(aA) - Number(bA);
    return a.name.localeCompare(b.name);
  }),
);

const stockFormAvailableQty = computed(() => {
  const qty = Number(localStoreStockForm.value.qty) || 0;
  const reservedQty = Number(localStoreStockForm.value.reserved_qty) || 0;
  return Math.max(0, qty - reservedQty);
});

const isStoreStockDuplicate = computed(() => {
  if (!localStoreStockForm.value.store_id) return false;
  return localVariantStoreStocks.value.some(
    (s, idx) =>
      s.store_id === localStoreStockForm.value.store_id &&
      idx !== localEditingStoreStockIndex.value,
  );
});

const isReservedExceedingQty = computed(() =>
  (Number(localStoreStockForm.value.reserved_qty) || 0) >
  (Number(localStoreStockForm.value.qty) || 0),
);

const hasPendingStoreStockForm = computed(() =>
  Boolean(
    localStoreStockForm.value.store_id ||
      Number(localStoreStockForm.value.qty) > 0 ||
      Number(localStoreStockForm.value.reserved_qty) > 0,
  ),
);

const sortedVariantStoreStocks = computed(() =>
  localVariantStoreStocks.value
    .map((storeStock, index) => ({ storeStock, index }))
    .sort((a, b) =>
      (a.storeStock.store?.name || "").localeCompare(b.storeStock.store?.name || ""),
    ),
);

const discountPercentage = computed(() => {
  if (
    !localVariantForm.value.strike_price ||
    !localVariantForm.value.price ||
    localVariantForm.value.strike_price <= 0 ||
    localVariantForm.value.price >= localVariantForm.value.strike_price
  ) {
    return null;
  }
  const discount =
    ((localVariantForm.value.strike_price - localVariantForm.value.price) /
      localVariantForm.value.strike_price) *
    100;
  return Math.round(discount * 100) / 100;
});

const getAttributeName = (attributeId: number) => {
  const attribute = props.availableAttributes.find(
    (attr) => attr.id === attributeId,
  );
  return attribute?.name || `Attribute ${attributeId}`;
};

const getAttributeValuesList = (attributeId: number) => {
  const attribute = props.availableAttributes.find(
    (attr) => attr.id === attributeId,
  );
  const allValues = attribute?.attribute_values || [];

  const selectedAttr = props.selectedAttributes.find(
    (sa) => sa.attribute_id === attributeId,
  );
  if (selectedAttr && selectedAttr.values.length > 0) {
    return allValues.filter((v) => selectedAttr.values.includes(v.id));
  }
  return [];
};

const handleUpdateVariantName = () => {
  if (isSingleVariant.value) return;

  const variantNameParts: string[] = [];
  const selectedValueIds: number[] = [];

  props.selectedAttributes.forEach((selectedAttr) => {
    const selectedValueId =
      localVariantForm.value.selectedAttributeValues[selectedAttr.attribute_id];
    if (selectedValueId) {
      if (selectedAttr.values.includes(selectedValueId)) {
        selectedValueIds.push(selectedValueId);
        const value = getAttributeValuesList(selectedAttr.attribute_id).find(
          (v) => v.id === selectedValueId,
        );
        if (value) {
          const attrName = getAttributeName(selectedAttr.attribute_id);
          variantNameParts.push(`${attrName}: ${value.value}`);
        }
      } else {
        delete localVariantForm.value.selectedAttributeValues[
          selectedAttr.attribute_id
        ];
      }
    }
  });

  if (variantNameParts.length === 0) {
    localVariantForm.value.variant_name = "";
  } else {
    localVariantForm.value.variant_name = variantNameParts.join(" - ");
  }
  localVariantForm.value.attribute_value_ids = selectedValueIds;

  if (props.editingVariantIndex === null) {
    localVariantForm.value.sku = generateSKU();
  }

  emit("update:variantForm", { ...localVariantForm.value });
  emit("update-variant-name");
  emit("update-variant-sku");
};

const handleLoadStores = async () => {
  if (stores.value.length > 0) return;

  loadingStores.value = true;
  try {
    const { data, error } = await getAllStores();
    if (data?.data?.stores) {
      stores.value = data.data.stores.map((store: any) => ({
        id: store.id,
        name: store.name,
        code: store.code,
      }));
    } else if (error) {
      toast.error(error.message || "Failed to load stores");
    }
  } catch (err) {
    console.error("Error loading stores:", err);
    toast.error("Failed to load stores");
  } finally {
    loadingStores.value = false;
  }
};

const handleEditStoreStock = async (index: number) => {
  await handleLoadStores();
  const storeStock = localVariantStoreStocks.value[index];
  if (!storeStock) return;

  localEditingStoreStockIndex.value = index;
  localStoreStockForm.value = {
    store_id: storeStock.store_id,
    qty: storeStock.qty,
    reserved_qty: storeStock.reserved_qty || 0,
  };

  await nextTick();
  const formEl = document.querySelector(".card.border-primary");
  if (formEl) formEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
};

const handleDeleteStoreStock = (index: number) => {
  localVariantStoreStocks.value.splice(index, 1);
  emit("update:variantStoreStocks", [...localVariantStoreStocks.value]);
  toast.success("Stock removed successfully");
};

const commitPendingStoreStock = () => {
  if (!hasPendingStoreStockForm.value) return true;

  if (!localStoreStockForm.value.store_id) {
    toast.error("Please select a store");
    return false;
  }
  if (isReservedExceedingQty.value) {
    toast.error("Reserved quantity cannot be greater than stock quantity");
    return false;
  }
  if (isStoreStockDuplicate.value) {
    toast.error("This store already has stock assigned");
    return false;
  }

  const store = stores.value.find((s) => s.id === localStoreStockForm.value.store_id);
  if (!store) {
    toast.error("Store not found");
    return false;
  }

  const stockEntry = {
    store_id: localStoreStockForm.value.store_id!,
    qty: localStoreStockForm.value.qty,
    reserved_qty: localStoreStockForm.value.reserved_qty,
    store,
  };

  if (localEditingStoreStockIndex.value !== null) {
    localVariantStoreStocks.value[localEditingStoreStockIndex.value] = {
      ...localVariantStoreStocks.value[localEditingStoreStockIndex.value],
      ...stockEntry,
    };
  } else {
    localVariantStoreStocks.value.push(stockEntry);
  }

  emit("update:variantStoreStocks", [...localVariantStoreStocks.value]);
  handleResetStoreStockForm();
  return true;
};

const handleResetStoreStockForm = () => {
  localStoreStockForm.value = { store_id: null, qty: 0, reserved_qty: 0 };
  localEditingStoreStockIndex.value = null;
};

const getStoreAvailableQty = (storeStock: Props["variantStoreStocks"][number]) =>
  Math.max(0, (storeStock.qty || 0) - (storeStock.reserved_qty || 0));

const getStockStatusLabel = (storeStock: Props["variantStoreStocks"][number]) => {
  const avail = getStoreAvailableQty(storeStock);
  if ((storeStock.qty || 0) <= 0) return "Out of stock";
  if (avail <= 0) return "Fully reserved";
  return "Available";
};

const getStockStatusBadgeClass = (storeStock: Props["variantStoreStocks"][number]) => {
  const avail = getStoreAvailableQty(storeStock);
  if ((storeStock.qty || 0) <= 0) return "bg-secondary text-white";
  if (avail <= 0) return "bg-dark text-white";
  return "bg-light text-dark border";
};

const triggerVariantImageInput = () => {
  variantImageInput.value?.click();
};

const handleVariantImageSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target) return;

  const file = target.files?.[0];
  if (file) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      if (variantImageInput.value) {
        variantImageInput.value.value = "";
      }
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      if (variantImageInput.value) {
        variantImageInput.value.value = "";
      }
      return;
    }

    localVariantForm.value.image_file = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      localVariantForm.value.image_preview = e.target?.result as string;
    };
    reader.onerror = () => {
      toast.error("Failed to read image file");
      localVariantForm.value.image_file = null;
      localVariantForm.value.image_preview = null;
    };
    reader.readAsDataURL(file);
  }

  emit("update:variantForm", { ...localVariantForm.value });
};

const handleClearVariantImage = () => {
  localVariantForm.value.image_file = null;
  localVariantForm.value.image_preview = null;
  localVariantForm.value.image_path = null;

  if (variantImageInput.value) {
    variantImageInput.value.value = "";
  }

  emit("update:variantForm", { ...localVariantForm.value });
};

const handleSave = () => {
  formErrors.value = {};

  const selectedCount = Object.keys(
    localVariantForm.value.selectedAttributeValues,
  ).filter(
    (attrId) => localVariantForm.value.selectedAttributeValues[Number(attrId)],
  ).length;

  let hasError = false;

  // Only require attribute selection if:
  // - single variant is NOT enabled
  // - no attributes are selected
  // - there are available attributes in the system (so selection is possible)
  if (!isSingleVariant.value && selectedCount === 0 && props.availableAttributes.length > 0) {
    formErrors.value.attributes = "Please select at least one attribute value.";
    hasError = true;
  }

  if (!localVariantForm.value.price || localVariantForm.value.price <= 0) {
    formErrors.value.price = "Selling price is required and must be greater than 0.";
    hasError = true;
  }

  if (hasError) return;

  if (!commitPendingStoreStock()) return;

  savingVariant.value = true;
  emit("save", {
    ...localVariantForm.value,
    store_stocks: localVariantStoreStocks.value,
  });
  savingVariant.value = false;
};

const handleCancel = () => {
  emit("cancel");
};

onMounted(() => {
  handleLoadStores();
});
</script>

<style scoped>
.modal-header.bg-primary {
  background: #000 !important;
  color: #fff !important;
}

.modal-header.bg-primary .modal-title,
.modal-header.bg-primary .modal-title i {
  color: #fff !important;
}

.nav-tabs .nav-link {
  color: #000;
  border: none;
  border-bottom: 2px solid transparent;
}

.nav-tabs .nav-link.active {
  color: #000;
  border-bottom-color: #000;
  font-weight: 500;
}

.card.border-primary {
  border-color: #000 !important;
}

.card.border-primary .card-header,
.card.border-primary .card-header h6,
.card.border-primary .card-header i {
  color: #000 !important;
}

.text-primary {
  color: #000 !important;
}

.variant-attribute-option {
  background-color: transparent;
  border: 1px solid transparent;
  cursor: pointer;
}

.variant-attribute-option .form-check-input,
.variant-attribute-option .form-check-label {
  cursor: pointer;
}

.variant-attribute-option.is-selected {
  background-color: transparent !important;
  border-color: transparent !important;
  box-shadow: none;
}

.variant-attribute-option.is-disabled:not(.is-selected) {
  background-color: transparent;
}

.variant-attribute-option.is-disabled,
.variant-attribute-option.is-disabled .form-check-input,
.variant-attribute-option.is-disabled .form-check-label {
  cursor: not-allowed;
}

.selected-option-label {
  color: inherit !important;
  font-weight: 400;
}

.variant-image-upload {
  max-width: 180px;
}

.variant-image-box {
  width: 100%;
  aspect-ratio: 1 / 1;
  border: 2px dashed #000;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  background-color: #fafafa;
}

.variant-image-box:hover {
  border-color: #000;
  background-color: #f3f3f3;
}

.variant-image-box:focus-visible {
  outline: 2px solid #000;
  outline-offset: 2px;
}

.variant-image-box.has-image {
  border-style: solid;
}

.variant-image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.variant-image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.2s ease;
  color: white;
  font-size: 1.8rem;
}

.variant-image-box:hover .variant-image-overlay {
  opacity: 1;
}

.btn-remove-variant-image {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  color: #ff4d4f;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 2;
}

.variant-image-box.has-image:hover .btn-remove-variant-image {
  opacity: 1;
}

.variant-image-icon {
  font-size: 2.5rem;
  color: #000;
}

.btn-outline-primary {
  color: #b7791f !important;
  border-color: rgba(212, 160, 23, 0.72) !important;
  background-color: rgba(212, 160, 23, 0.03) !important;
}

.modal-content .btn-primary,
.modal-content .btn-secondary,
.modal-content .btn-outline-secondary,
.modal-content .btn-outline-danger {
  color: #000 !important;
  background-color: #fff !important;
  border-color: #000 !important;
}

.modal-content .btn-outline-primary {
  color: #b7791f !important;
  background-color: #fff !important;
  border-color: rgba(212, 160, 23, 0.72) !important;
}

.modal-content .btn-primary.action-btn-dark {
  color: #fff !important;
  background-color: var(--app-action-dark-bg) !important;
  border-color: var(--app-action-dark-bg) !important;
}

.modal-content .btn-primary:hover,
.modal-content .btn-primary:focus,
.modal-content .btn-primary:active,
.modal-content .btn-secondary:hover,
.modal-content .btn-secondary:focus,
.modal-content .btn-secondary:active,
.modal-content .btn-outline-secondary:hover,
.modal-content .btn-outline-secondary:focus,
.modal-content .btn-outline-secondary:active,
.modal-content .btn-outline-danger:hover,
.modal-content .btn-outline-danger:focus,
.modal-content .btn-outline-danger:active {
  color: #fff !important;
  background-color: #000 !important;
  border-color: #000 !important;
}

.btn-outline-primary:hover,
.btn-outline-primary:focus,
.btn-outline-primary:active,
.modal-content .btn-outline-primary:hover,
.modal-content .btn-outline-primary:focus,
.modal-content .btn-outline-primary:active {
  color: #b7791f !important;
  background-color: rgba(212, 160, 23, 0.1) !important;
  border-color: rgba(212, 160, 23, 0.78) !important;
}

.modal-content .btn-primary.action-btn-dark:hover,
.modal-content .btn-primary.action-btn-dark:focus,
.modal-content .btn-primary.action-btn-dark:active {
  color: #fff !important;
  background-color: var(--app-action-dark-hover-bg) !important;
  border-color: var(--app-action-dark-hover-bg) !important;
}

.modal-content .btn-primary:disabled,
.modal-content .btn-secondary:disabled,
.modal-content .btn-outline-secondary:disabled,
.modal-content .btn-outline-danger:disabled {
  color: #4b4b4b !important;
  background-color: #fff !important;
  border-color: #4b4b4b !important;
}

.modal-content .btn-outline-primary:disabled {
  color: #c8a96a !important;
  background-color: #fffdf5 !important;
  border-color: #e6d3a1 !important;
}

.modal-content .btn-primary.action-btn-dark:disabled {
  color: #fff !important;
  background-color: var(--app-action-dark-disabled-bg) !important;
  border-color: var(--app-action-dark-disabled-bg) !important;
}

.stock-summary-card {
  border-color: #000 !important;
}

.stock-summary-card {
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.stock-form-field .form-control,
.stock-form-field .form-select,
.stock-form-field .btn {
  min-height: 42px;
}

.stock-form-helper-placeholder {
  visibility: hidden;
}

.stock-table-wrap :deep(.table) {
  margin-bottom: 0;
}

.stock-table-wrap :deep(tbody tr) {
  vertical-align: middle;
}
</style>