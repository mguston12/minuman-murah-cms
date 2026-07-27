<template>
  <div class="settings-page">
    <div class="pagetitle">
      <h1>Application Settings</h1>
      <nav>
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <NuxtLink to="/dashboard">Home</NuxtLink>
          </li>
          <li class="breadcrumb-item active">Settings</li>
        </ol>
      </nav>
    </div>

    <section class="section">
      <div class="card">
        <div class="card-body">
          <div class="overflow-auto">
            <ul
              class="nav nav-tabs flex-nowrap"
              id="settingsTabs"
              role="tablist"
            >
              <li
                class="nav-item"
                role="presentation"
                v-for="tab in tabs"
                :key="tab.key"
              >
                <button
                  class="nav-link text-nowrap"
                  :class="{ active: activeTab === tab.key }"
                  @click="activeTab = tab.key"
                  type="button"
                >
                  {{ tab.label }}
                </button>
              </li>
              <li class="nav-item ms-auto" role="presentation">
                <NuxtLink to="/profile" class="nav-link text-nowrap profile-link">
                  Profile
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div class="tab-content">
            <!-- Store Tab -->
            <StoreTab
              v-if="activeTab === 'store' && hasPermission('stores.read')"
              :stores="stores"
              :loading-stores="loadingStores"
              :is-active="activeTab === 'store'"
              @edit-store="handleEditClick"
              @delete-store="handleDeleteClick"
              @load-provinces="loadProvinces"
            />

            <!-- Product Protection Tab -->
            <ProductProtectionTab
              v-if="
                activeTab === 'productProtection' &&
                hasPermission('configs.read')
              "
              :form-data="formData"
              :is-loading="isLoading"
              :is-active="activeTab === 'productProtection'"
              @save-settings="saveSettings"
            />

            <!-- Email Tab -->
            <EmailTab
              v-if="activeTab === 'email' && hasPermission('configs.read')"
              :form-data="formData"
              :is-loading="isLoading"
              :is-active="activeTab === 'email'"
              @save-settings="saveSettings"
            />

            <!-- App Tab -->
            <AppTab
              v-if="activeTab === 'app' && hasPermission('configs.read')"
              :form-data="formData"
              :is-loading="isLoading"
              :app-logo-preview="appLogoPreview"
              :app-favicon-preview="appFaviconPreview"
              :is-active="activeTab === 'app'"
              @save-settings="saveSettings"
              @file-change="onFileChange"
            />

            <!-- Payment Tab -->
            <PaymentTab
              v-if="activeTab === 'payment' && hasPermission('configs.read')"
              :form-data="formData"
              :is-loading="isLoading"
              :is-active="activeTab === 'payment'"
              @save-settings="saveSettings"
              @toggle-method="togglePaymentMethod"
            />

            <!-- Gojek Instant Tab -->
            <GojekInstantTab
              v-if="activeTab === 'gojek_instant' && hasPermission('configs.read')"
              :form-data="formData"
              :is-loading="isLoading"
              :is-active="activeTab === 'gojek_instant'"
              @save-settings="saveSettings"
            />

            <!-- Social Tab -->
            <SocialTab
              v-if="activeTab === 'social' && hasPermission('configs.read')"
              :form-data="formData"
              :is-loading="isLoading"
              :is-active="activeTab === 'social'"
              @save-settings="saveSettings"
            />

            <!-- Notification Tab -->
            <NotificationTab
              v-if="
                activeTab === 'notification' && hasPermission('configs.read')
              "
              :form-data="formData"
              :is-loading="isLoading"
              :is-active="activeTab === 'notification'"
              @save-settings="saveSettings"
            />

            <!-- Point Tab (hidden) -->
            <!-- <PointTab
              v-if="activeTab === 'point' && hasPermission('configs.read')"
              :form-data="formData"
              :is-loading="isLoading"
              :is-active="activeTab === 'point'"
              @save-settings="saveSettings"
            /> -->

            <!-- Top Banner Tab -->
            <TopBannerTab
              v-if="activeTab === 'topbanner' && hasPermission('configs.read')"
              :form-data="formData"
              :is-loading="isLoading"
              :is-active="activeTab === 'topbanner'"
              @save-settings="saveSettings"
            />

            <!-- Main Banner Tab -->
            <MainBannerTab
              v-if="activeTab === 'mainBanner' && hasPermission('configs.read')"
              :is-active="activeTab === 'mainBanner'"
            />

            <!-- Popup Banner Tab -->
            <PopupBannerTab
              v-if="
                activeTab === 'popupBanner' && hasPermission('configs.read')
              "
              :popup-banners="popupBanners"
              :loading-popup-banners="loadingPopupBanners"
              :is-active="activeTab === 'popupBanner'"
              @create-banner="handleCreatePopupBannerClick"
              @edit-banner="handleEditPopupBannerClick"
              @delete-banner="handleDeletePopupBannerClick"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Create Store Modal -->
    <div
      id="createStoreModal"
      class="modal fade"
      tabindex="-1"
      aria-labelledby="createStoreModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="createStoreModalLabel">
              Create New Store
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="resetStoreForm"
            ></button>
          </div>
          <form @submit.prevent="handleCreateStore">
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label"
                    >Store Name <span class="text-danger">*</span></label
                  >
                  <input
                    v-model="storeForm.name"
                    type="text"
                    required
                    class="form-control"
                    :class="{ 'is-invalid': storeFormErrors.name }"
                    placeholder="Store Name"
                  />
                  <div v-if="storeFormErrors.name" class="invalid-feedback">
                    {{ storeFormErrors.name[0] }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Code</label>
                  <input
                    v-model="storeForm.code"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': storeFormErrors.code }"
                    placeholder="STORE001"
                  />
                  <div v-if="storeFormErrors.code" class="invalid-feedback">
                    {{ storeFormErrors.code[0] }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Email</label>
                  <input
                    v-model="storeForm.email"
                    type="email"
                    class="form-control"
                    :class="{ 'is-invalid': storeFormErrors.email }"
                    placeholder="store@example.com"
                  />
                  <div v-if="storeFormErrors.email" class="invalid-feedback">
                    {{ storeFormErrors.email[0] }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Phone</label>
                  <input
                    v-model="storeForm.phone"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': storeFormErrors.phone }"
                    placeholder="62812345678"
                  />
                  <div v-if="storeFormErrors.phone" class="invalid-feedback">
                    {{ storeFormErrors.phone[0] }}
                  </div>
                </div>
                <div class="col-12">
                  <label class="form-label">Address</label>
                  <textarea
                    v-model="storeForm.address"
                    class="form-control"
                    :class="{ 'is-invalid': storeFormErrors.address }"
                    rows="2"
                    placeholder="Full Address"
                  ></textarea>
                  <div v-if="storeFormErrors.address" class="invalid-feedback">
                    {{ storeFormErrors.address[0] }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Province</label>
                  <select
                    v-model="storeForm.selectedProvinceId"
                    @change="onProvinceChange"
                    class="form-select"
                    :disabled="loadingProvinces"
                  >
                    <option :value="null">Pilih Provinsi</option>
                    <option
                      v-for="province in provinces"
                      :key="province.id"
                      :value="province.id"
                    >
                      {{ province.name }}
                    </option>
                  </select>
                  <input v-model="storeForm.province" type="hidden" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">City/Kabupaten</label>
                  <select
                    v-model="storeForm.selectedCityId"
                    @change="onCityChange"
                    class="form-select"
                    :disabled="loadingCities || !storeForm.selectedProvinceId"
                  >
                    <option :value="null">Pilih Kota/Kabupaten</option>
                    <option
                      v-for="city in cities"
                      :key="city.id"
                      :value="city.id"
                    >
                      {{ city.name }}
                    </option>
                  </select>
                  <input v-model="storeForm.city" type="hidden" />
                  <input v-model="storeForm.city_id" type="hidden" />
                  <p v-if="loadingCities" class="text-muted small mt-1 mb-0">
                    Memuat kota...
                  </p>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Country</label>
                  <input
                    v-model="storeForm.country"
                    type="text"
                    class="form-control"
                    placeholder="Indonesia"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Postal Code</label>
                  <input
                    v-model="storeForm.postal_code"
                    type="text"
                    class="form-control"
                    placeholder="12345"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Status</label>
                  <select v-model="storeForm.status" class="form-select">
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
                <div class="col-12">
                  <label class="form-label">Description</label>
                  <TiptapEditor v-model="storeForm.description" placeholder="Store description" />
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                @click="resetStoreForm"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="isLoading"
              >
                {{ isLoading ? "Creating..." : "Create Store" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Edit Store Modal -->
    <div
      id="editStoreModal"
      class="modal fade"
      tabindex="-1"
      aria-labelledby="editStoreModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editStoreModalLabel">Edit Store</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="resetStoreForm"
            ></button>
          </div>
          <form @submit.prevent="handleUpdateStore">
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label"
                    >Store Name <span class="text-danger">*</span></label
                  >
                  <input
                    v-model="storeForm.name"
                    type="text"
                    required
                    class="form-control"
                    :class="{ 'is-invalid': storeFormErrors.name }"
                  />
                  <div v-if="storeFormErrors.name" class="invalid-feedback">
                    {{ storeFormErrors.name[0] }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Code</label>
                  <input
                    v-model="storeForm.code"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': storeFormErrors.code }"
                  />
                  <div v-if="storeFormErrors.code" class="invalid-feedback">
                    {{ storeFormErrors.code[0] }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Email</label>
                  <input
                    v-model="storeForm.email"
                    type="email"
                    class="form-control"
                    :class="{ 'is-invalid': storeFormErrors.email }"
                  />
                  <div v-if="storeFormErrors.email" class="invalid-feedback">
                    {{ storeFormErrors.email[0] }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Phone</label>
                  <input
                    v-model="storeForm.phone"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': storeFormErrors.phone }"
                  />
                  <div v-if="storeFormErrors.phone" class="invalid-feedback">
                    {{ storeFormErrors.phone[0] }}
                  </div>
                </div>
                <div class="col-12">
                  <label class="form-label">Address</label>
                  <textarea
                    v-model="storeForm.address"
                    class="form-control"
                    :class="{ 'is-invalid': storeFormErrors.address }"
                    rows="2"
                  ></textarea>
                  <div v-if="storeFormErrors.address" class="invalid-feedback">
                    {{ storeFormErrors.address[0] }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Province</label>
                  <select
                    v-model="storeForm.selectedProvinceId"
                    @change="onProvinceChange"
                    class="form-select"
                    :disabled="loadingProvinces"
                  >
                    <option :value="null">Pilih Provinsi</option>
                    <option
                      v-for="province in provinces"
                      :key="province.id"
                      :value="province.id"
                    >
                      {{ province.name }}
                    </option>
                  </select>
                  <input v-model="storeForm.province" type="hidden" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">City/Kabupaten</label>
                  <select
                    v-model="storeForm.selectedCityId"
                    @change="onCityChange"
                    class="form-select"
                    :disabled="loadingCities || !storeForm.selectedProvinceId"
                  >
                    <option :value="null">Pilih Kota/Kabupaten</option>
                    <option
                      v-for="city in cities"
                      :key="city.id"
                      :value="city.id"
                    >
                      {{ city.name }}
                    </option>
                  </select>
                  <input v-model="storeForm.city" type="hidden" />
                  <input v-model="storeForm.city_id" type="hidden" />
                  <p v-if="loadingCities" class="text-muted small mt-1 mb-0">
                    Memuat kota...
                  </p>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Country</label>
                  <input
                    v-model="storeForm.country"
                    type="text"
                    class="form-control"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Postal Code</label>
                  <input
                    v-model="storeForm.postal_code"
                    type="text"
                    class="form-control"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Status</label>
                  <select v-model="storeForm.status" class="form-select">
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
                <div class="col-12">
                  <label class="form-label">Description</label>
                  <TiptapEditor v-model="storeForm.description" placeholder="Store description" />
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                @click="resetStoreForm"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="btn btn-success"
                :disabled="isLoading"
              >
                {{ isLoading ? "Updating..." : "Update Store" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Store Modal -->
    <div
      id="deleteStoreModal"
      class="modal fade"
      tabindex="-1"
      aria-labelledby="deleteStoreModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteStoreModalLabel">Delete Store</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>
              Are you sure you want to delete
              <strong>{{ storeToDelete?.name }}</strong
              >? This action cannot be undone.
            </p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="handleDeleteStore"
              :disabled="isLoading"
            >
              {{ isLoading ? "Deleting..." : "Delete Store" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Popup Banner Modal -->
    <div class="modal fade" id="createPopupBannerModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create Popup Banner</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div class="modal-body">
            <form @submit.prevent="handleCreatePopupBanner">
              <div class="mb-3">
                <label class="form-label">Title</label>
                <input
                  v-model="popupBannerForm.title"
                  type="text"
                  class="form-control"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Description</label>
                <TiptapEditor v-model="popupBannerForm.description" placeholder="Popup banner description" />
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Start Date</label>
                  <input
                    v-model="popupBannerForm.start_date"
                    type="date"
                    class="form-control"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label">End Date</label>
                  <input
                    v-model="popupBannerForm.end_date"
                    type="date"
                    class="form-control"
                  />
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Url</label>
                <input
                  v-model="popupBannerForm.url"
                  type="text"
                  class="form-control"
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Image</label>
                <input
                  type="file"
                  class="form-control"
                  @change="handlePopupBannerImageChange"
                  required
                />
              </div>

              <div v-if="popupBannerImagePreview" class="mb-3">
                <img
                  :src="popupBannerImagePreview"
                  class="img-fluid rounded"
                  style="max-height: 150px"
                />
              </div>

              <div class="text-end">
                <button
                  type="button"
                  class="btn btn-secondary me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="isLoading"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Popup Banner Modal -->
    <div class="modal fade" id="editPopupBannerModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Popup Banner</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div class="modal-body">
            <form @submit.prevent="handleUpdatePopupBanner">
              <div class="mb-3">
                <label class="form-label">Title</label>
                <input
                  v-model="popupBannerForm.title"
                  type="text"
                  class="form-control"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Description</label>
                <TiptapEditor v-model="popupBannerForm.description" placeholder="Popup banner description" />
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Start Date</label>
                  <input
                    v-model="popupBannerForm.start_date"
                    type="date"
                    class="form-control"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label">End Date</label>
                  <input
                    v-model="popupBannerForm.end_date"
                    type="date"
                    class="form-control"
                  />
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Url</label>
                <input
                  v-model="popupBannerForm.url"
                  type="text"
                  class="form-control"
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Image</label>
                <input
                  type="file"
                  class="form-control"
                  @change="handlePopupBannerImageChange"
                />
              </div>

              <div v-if="popupBannerImagePreview" class="mb-3">
                <img
                  :src="popupBannerImagePreview"
                  class="img-fluid rounded"
                  style="max-height: 150px"
                />
              </div>

              <div class="text-end">
                <button
                  type="button"
                  class="btn btn-secondary me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="btn btn-success"
                  :disabled="isLoading"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <!-- Delete Popup Banner Modal -->
    <div
      id="deletePopupBannerModal"
      class="modal fade"
      tabindex="-1"
      aria-labelledby="deletePopupBannerModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deletePopupBannerModalLabel">
              Delete Popup Banner
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>
              Are you sure you want to delete
              <strong>{{ popupBannerToDelete?.title }}</strong
              >? This action cannot be undone.
            </p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="handleDeletePopupBanner"
              :disabled="isLoading"
            >
              {{ isLoading ? "Deleting..." : "Delete Popup Banner" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, nextTick, onMounted } from "vue";
import { useConfig } from "~/composables/useConfig";
import { useApiBase } from "~/composables/useApiBase";
import { useStoreApi } from "~/composables/useStoreApi";
import { usePermission } from "~/composables/usePermission";
import { useShippingApi } from "~/composables/useShippingApi";
import { usePopupBannerApi } from "~/composables/usePopupBannerApi";
import type { Store } from "~/types/store";
import type { MainBanner } from "~/types/mainBanner";
import type { PopupBanner } from "~/types/popupBanner";
import StoreTab from "~/components/settings/StoreTab.vue";
import ProductProtectionTab from "~/components/settings/ProductProtectionTab.vue";
import EmailTab from "~/components/settings/EmailTab.vue";
import AppTab from "~/components/settings/AppTab.vue";
import PaymentTab from "~/components/settings/PaymentTab.vue";
import GojekInstantTab from "~/components/settings/GojekInstantTab.vue";
import TopBannerTab from "~/components/settings/TopBannerTab.vue";
import SocialTab from "~/components/settings/SocialTab.vue";
import NotificationTab from "~/components/settings/NotificationTab.vue";
import PointTab from "~/components/settings/PointTab.vue";
import MainBannerTab from "~/components/settings/MainBannerTab.vue";
import PopupBannerTab from "~/components/settings/PopupBannerTab.vue";

definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

useAppTitle("Setting");

const { token } = useApiBase();
const { fetchAllConfigs, updateConfig } = useConfig();
const { getStores, getAllStores, createStore, updateStore, deleteStore } =
  useStoreApi();
const { getProvinces, getCities } = useShippingApi();
const {
  getPopupBanners,
  createPopupBanner,
  updatePopupBanner,
  deletePopupBanner,
} = usePopupBannerApi();
const toast = useToast();
const { hasPermission } = usePermission();

const isLoading = ref(false);
const activeTab = ref("store");
const successMessage = ref("");
const errorMessage = ref("");
const messageTimeout = ref<number | null>(null);

// Store management
const stores = ref<Store[]>([]);
const loadingStores = ref(false);
const storeToEdit = ref<Store | null>(null);
const storeToDelete = ref<Store | null>(null);
const storeForm = ref({
  name: "",
  code: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  province: "",
  country: "",
  postal_code: "",
  status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  description: "",
  city_id: null as number | null,
  selectedProvinceId: null as number | null,
  selectedCityId: null as number | null,
});
const storeFormErrors = ref<Record<string, string[]>>({});

const provinces = ref<any[]>([]);
const cities = ref<any[]>([]);
const loadingProvinces = ref(false);
const loadingCities = ref(false);

const popupBanners = ref<PopupBanner[]>([]);
const loadingPopupBanners = ref(false);
const popupBannerError = ref<string | null>(null);
const popupBannerToEdit = ref<PopupBanner | null>(null);
const popupBannerToDelete = ref<PopupBanner | null>(null);
const popupBannerForm = ref({
  title: "",
  description: "",
  start_date: "",
  end_date: "",
  url: "",
});

const popupBannerImageFile = ref<File | null>(null);
const popupBannerImagePreview = ref<string>("");

const allTabs = [
  { key: "store", label: "Store" },
  { key: "productProtection", label: "Product Protection" },
  { key: "email", label: "Email" },
  { key: "app", label: "App" },
  { key: "payment", label: "Payment" },
  { key: "gojek_instant", label: "Gojek Instant" },
  { key: "social", label: "Social Media" },
  { key: "notification", label: "Notifications" },
  // { key: "point", label: "Point System" },
  { key: "topbanner", label: "Top Banner" },
  { key: "mainBanner", label: "Main Banner" },
  { key: "popupBanner", label: "Popup Banner" },
];

const tabs = computed(() => {
  return allTabs.filter((tab) => {
    if (tab.key === "store") {
      return hasPermission("stores.read");
    }
    if (
      tab.key === "email" ||
      tab.key === "app" ||
      tab.key === "payment" ||
      tab.key === "gojek_instant" ||
      tab.key === "social" ||
      tab.key === "notification" ||
      tab.key === "point" ||
      tab.key === "productProtection"
    ) {
      return hasPermission("configs.read");
    }
    if (tab.key === "mainBanner") {
      return hasPermission("configs.read");
    }
    if (tab.key === "popupBanner") {
      return hasPermission("popup-banners.read");
    }
    return true;
  });
});

// Set default active tab based on available tabs
watch(
  tabs,
  (newTabs) => {
    const firstTab = newTabs[0];
    if (
      firstTab &&
      !newTabs.find((tab) => tab.key === activeTab.value)
    ) {
      activeTab.value = firstTab.key;
    }
  },
  { immediate: true },
);

// init with some defaults to avoid undefineds in template
const formData = ref<any>({
  // email
  email_driver: "",
  email_host: "",
  email_port: null,
  email_username: "",
  email_password: "",
  email_encryption: "",
  email_from_name: "",
  email_from_address: "",
  // app
  app_name: "",
  app_url: "",
  app_timezone: "",
  app_locale: "",
  app_logo: "",
  app_favicon: "",
  // store (API keys)
  store_logo_website: "",
  store_favicon: "",
  // store info
  store_name: "",
  store_email: "",
  store_phone: "",
  store_address: "",
  store_city: "",
  store_province: "",
  store_country: "",
  store_postal_code: "",
  store_currency: "",
  // payment
  midtrans_is_active: true,
  midtrans_server_key: "",
  midtrans_client_key: "",
  midtrans_is_production: false,
  xendit_is_active: false,
  xendit_secret_key: "",
  xendit_public_key: "",
  xendit_is_production: false,
  // gojek instant
  gojek_instant_key: "",
  // social
  social_instagram: "",
  social_tiktok: "",
  social_facebook: "",
  social_youtube: "",
  social_pinterest: "",
  social_whatsapp: "",
  // notification
  notification_email_enabled: false,
  notification_sms_enabled: false,
  // point
  point_minimum_usable_points: 250000,
  point_points_per_million: 25000,
  point_million_threshold: 1000000,
  // top banner
  topbanner: "",
  // product protection
  product_protection: 10,
});

// file refs and previews
const appLogoFile = ref<File | null>(null);
const appFaviconFile = ref<File | null>(null);
const appLogoPreview = ref<string>("");
const appFaviconPreview = ref<string>("");

// default dummy image (simple svg data URI)
const defaultImage =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><rect width="100%" height="100%" fill="%23e9ecef"/><text x="50%" y="50%" font-size="12" fill="%23909ca4" dy=".3em" text-anchor="middle">No image</text></svg>';

const clearMessagesAfterTimeout = () => {
  if (messageTimeout.value) {
    clearTimeout(messageTimeout.value);
    messageTimeout.value = null;
  }
  messageTimeout.value = window.setTimeout(() => {
    successMessage.value = "";
    errorMessage.value = "";
    messageTimeout.value = null;
  }, 3000);
};

const paymentMethods = ["midtrans", "xendit"] as const;

type PaymentMethod = (typeof paymentMethods)[number];

const ensureAtLeastOnePaymentMethodActive = (
  preferredMethod: PaymentMethod = "midtrans",
) => {
  const hasActiveMethod = paymentMethods.some(
    (method) => formData.value[`${method}_is_active`],
  );

  if (!hasActiveMethod) {
    formData.value[`${preferredMethod}_is_active`] = true;
  }
};

const loadSettings = async () => {
  try {
    if (!token.value) return;

    const res = await fetchAllConfigs(token.value);

    const configs = Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res)
        ? res
        : [];

    const incoming: Record<string, any> = {};
    const imageUrls: Record<string, string> = {};

    for (const cfg of configs) {
      if (!cfg.key) continue;

      const val = cfg.hasOwnProperty("casted_value")
        ? cfg.casted_value
        : cfg.value;
      if (cfg.type === "boolean") {
        incoming[cfg.key] = val === true || val === "true";
      } else if (cfg.type === "integer") {
        incoming[cfg.key] = val !== null && val !== undefined ? Number(val) : 0;
      } else {
        incoming[cfg.key] = val ?? "";
      }

      if (cfg.value_image) {
        imageUrls[cfg.key] = cfg.value_image;
      }
    }

    formData.value = {
      ...formData.value,
      ...incoming,
    };

    ensureAtLeastOnePaymentMethodActive();

    if (incoming.store_logo_website) {
      appLogoPreview.value =
        imageUrls.store_logo_website || String(incoming.store_logo_website);
      formData.value.store_logo_website = incoming.store_logo_website;
      if (!formData.value.app_logo)
        formData.value.app_logo = incoming.store_logo_website;
    } else if (incoming.app_logo) {
      appLogoPreview.value = imageUrls.app_logo || String(incoming.app_logo);
      formData.value.app_logo = incoming.app_logo;
      if (!formData.value.store_logo_website)
        formData.value.store_logo_website = incoming.app_logo;
    }

    if (incoming.store_favicon) {
      appFaviconPreview.value =
        imageUrls.store_favicon || String(incoming.store_favicon);
      formData.value.store_favicon = incoming.store_favicon;
      if (!formData.value.app_favicon)
        formData.value.app_favicon = incoming.store_favicon;
    } else if (incoming.app_favicon) {
      appFaviconPreview.value =
        imageUrls.app_favicon || String(incoming.app_favicon);
      formData.value.app_favicon = incoming.app_favicon;
      if (!formData.value.store_favicon)
        formData.value.store_favicon = incoming.app_favicon;
    }
  } catch (err) {
    errorMessage.value =
      err instanceof Error ? err.message : "Failed to load settings";
    clearMessagesAfterTimeout();
  }
};

function onFileChange(e: Event, type: "logo" | "favicon") {
  const input = e.target as HTMLInputElement;
  if (!input || !input.files || !input.files[0]) return;

  const file = input.files[0];
  if (type === "logo") {
    appLogoFile.value = file;
    appLogoPreview.value = URL.createObjectURL(file);
  } else {
    appFaviconFile.value = file;
    appFaviconPreview.value = URL.createObjectURL(file);
  }
}

const togglePaymentMethod = (method: PaymentMethod) => {
  const targetKey = `${method}_is_active`;
  const nextValue = !formData.value[targetKey];

  if (!nextValue) {
    const hasAnotherActiveMethod = paymentMethods.some(
      (paymentMethod) =>
        paymentMethod !== method &&
        Boolean(formData.value[`${paymentMethod}_is_active`]),
    );

    if (!hasAnotherActiveMethod) {
      const message = "At least one payment method must remain active";
      errorMessage.value = message;
      toast.error(message);
      clearMessagesAfterTimeout();
      return;
    }
  }

  formData.value[targetKey] = nextValue;
};

const updateConfigOrThrow = async (key: string, payload: any) => {
  const response = await updateConfig(key, payload, token.value || "");

  if (!response?.success) {
    throw new Error(`Failed to update ${key}`);
  }

  return response;
};

const saveSettings = async (category: string) => {
  try {
    isLoading.value = true;
    successMessage.value = "";
    errorMessage.value = "";

    if (!token.value) throw new Error("Token not found");

    // select keys related to this category (prefix match)
    let categoryKeys = Object.keys(formData.value).filter(
      (k) => k.startsWith(category + "_") || k === category,
    );

    if (category === "payment") {
      const hasActiveMethod = paymentMethods.some(
        (method) => formData.value[`${method}_is_active`],
      );

      if (!hasActiveMethod) {
        throw new Error("At least one payment method must remain active");
      }

      categoryKeys = Object.keys(formData.value).filter(
        (key) => key.startsWith("midtrans_") || key.startsWith("xendit_"),
      );

      categoryKeys.sort((a, b) => {
        const aActive = a.endsWith("_is_active") && formData.value[a] === true;
        const bActive = b.endsWith("_is_active") && formData.value[b] === true;
        const aInactive = a.endsWith("_is_active") && formData.value[a] === false;
        const bInactive = b.endsWith("_is_active") && formData.value[b] === false;

        if (aActive && !bActive) return -1;
        if (!aActive && bActive) return 1;
        if (aInactive && !bInactive) return 1;
        if (!aInactive && bInactive) return -1;
        return 0;
      });
    }

    // for APP tab also include image keys used by API
    if (category === "app") {
      categoryKeys = ["app_name", "app_url", "app_timezone", "app_locale"];

      if (appLogoFile.value) {
        categoryKeys.push("store_logo_website");
      }

      if (appFaviconFile.value) {
        categoryKeys.push("store_favicon");
      }
    }

    for (const key of categoryKeys) {
      // handle image uploads for API image keys (send FormData)
      if (key === "store_logo_website" && appLogoFile.value) {
        const fd = new FormData();
        fd.append("value", appLogoFile.value);
        await updateConfigOrThrow(key, fd);
        continue;
      }
      if (key === "store_favicon" && appFaviconFile.value) {
        const fd = new FormData();
        fd.append("value", appFaviconFile.value);
        await updateConfigOrThrow(key, fd);
        continue;
      }

      let valueToSend: any = formData.value[key];
      if (typeof valueToSend === "boolean") {
        valueToSend = String(valueToSend);
      } else if (typeof valueToSend === "number") {
        valueToSend = String(valueToSend);
      }

      // skip empty image keys to avoid overriding existing URLs
      if (
        (key === "store_logo_website" || key === "store_favicon") &&
        !valueToSend
      ) {
        continue;
      }

      await updateConfigOrThrow(key, { value: valueToSend });
    }

    appLogoFile.value = null;
    appFaviconFile.value = null;
    successMessage.value = "Setting Updated Successfully";
    toast.success(successMessage.value);
    clearMessagesAfterTimeout();
    await loadSettings();

    if (category === "app" && import.meta.client) {
      window.dispatchEvent(new CustomEvent("app-settings-updated"));
    }
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : "Failed to save settings";
    errorMessage.value = errorMsg;
    toast.error(errorMsg);
    clearMessagesAfterTimeout();
  } finally {
    isLoading.value = false;
  }
};

const loadStores = async () => {
  loadingStores.value = true;
  try {
    const { data, error } = await getAllStores();
    if (error || !data?.success) {
      console.error("Failed to load stores:", error);
      stores.value = [];
    } else if (data.data) {
      if (Array.isArray(data.data)) {
        stores.value = data.data;
      } else if (data.data.stores) {
        stores.value = data.data.stores;
      }
    }
  } catch (err) {
    console.error("Error loading stores:", err);
    stores.value = [];
  } finally {
    loadingStores.value = false;
  }
};

const resetStoreForm = () => {
  storeForm.value = {
    name: "",
    code: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    country: "",
    postal_code: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
    description: "",
    city_id: null,
    selectedProvinceId: null,
    selectedCityId: null,
  };
  storeFormErrors.value = {};
  storeToEdit.value = null;
  cities.value = [];
};

const loadProvinces = async () => {
  loadingProvinces.value = true;
  try {
    const { data, error } = await getProvinces();
    if (!error && data?.success && data.data) {
      provinces.value = data.data;
    }
  } catch (err) {
    console.error("Error loading provinces:", err);
  } finally {
    loadingProvinces.value = false;
  }
};

const loadCities = async (provinceId: number) => {
  loadingCities.value = true;
  cities.value = [];
  storeForm.value.selectedCityId = null;
  try {
    const { data, error } = await getCities(provinceId);
    if (!error && data?.success && data.data) {
      cities.value = data.data;
    }
  } catch (err) {
    console.error("Error loading cities:", err);
  } finally {
    loadingCities.value = false;
  }
};

const onProvinceChange = async () => {
  if (storeForm.value.selectedProvinceId) {
    const province = provinces.value.find(
      (p) => p.id === storeForm.value.selectedProvinceId,
    );
    if (province) {
      storeForm.value.province = province.name;
    }
    await loadCities(storeForm.value.selectedProvinceId);
  } else {
    storeForm.value.province = "";
    cities.value = [];
    storeForm.value.selectedCityId = null;
  }
};

const onCityChange = () => {
  if (storeForm.value.selectedCityId) {
    const city = cities.value.find(
      (c) => c.id === storeForm.value.selectedCityId,
    );
    if (city) {
      storeForm.value.city = city.name;
      storeForm.value.city_id = city.id;
    }
  } else {
    storeForm.value.city = "";
    storeForm.value.city_id = null;
  }
};

const findProvinceId = async (provinceName: string): Promise<number | null> => {
  if (!provinceName || provinces.value.length === 0) return null;
  const province = provinces.value.find(
    (p: any) =>
      p.name?.toLowerCase().includes(provinceName.toLowerCase()) ||
      provinceName.toLowerCase().includes(p.name?.toLowerCase() || ""),
  );
  return province ? province.id : null;
};

const findCityId = async (
  cityName: string,
  provinceId: number,
): Promise<number | null> => {
  if (!cityName || !provinceId) return null;
  if (cities.value.length === 0) {
    await loadCities(provinceId);
  }
  const city = cities.value.find((c: any) => {
    const cityNameLower = cityName.toLowerCase();
    const cityNameInData = c.name?.toLowerCase() || "";
    return (
      cityNameLower.includes(cityNameInData) ||
      cityNameInData.includes(cityNameLower) ||
      cityNameLower === cityNameInData
    );
  });
  return city ? city.id : null;
};

const handleEditClick = async (store: Store) => {
  storeToEdit.value = store;

  await loadProvinces();

  let provinceId: number | null = null;
  if (store.province) {
    provinceId = await findProvinceId(store.province);
  }

  if (provinceId) {
    storeForm.value.selectedProvinceId = provinceId;
    await loadCities(provinceId);

    if ((store as any).city_id) {
      storeForm.value.selectedCityId = (store as any).city_id;
      storeForm.value.city_id = (store as any).city_id;
    } else if (store.city) {
      const cityId = await findCityId(store.city, provinceId);
      if (cityId) {
        storeForm.value.selectedCityId = cityId;
        storeForm.value.city_id = cityId;
      }
    }
  }

  storeForm.value = {
    ...storeForm.value,
    name: store.name || "",
    code: store.code || "",
    email: store.email || "",
    phone: store.phone || "",
    address: store.address || "",
    city: store.city || "",
    province: store.province || "",
    country: store.country || "",
    postal_code: store.postal_code || "",
    status: (store.status || "ACTIVE") as "ACTIVE" | "INACTIVE",
    description: store.description || "",
    city_id: (store as any).city_id || null,
  };
  await nextTick();
  const modal = new (window as any).bootstrap.Modal(
    document.getElementById("editStoreModal"),
  );
  modal.show();
};

const handleDeleteClick = async (store: Store) => {
  storeToDelete.value = store;
  await nextTick();
  const modal = new (window as any).bootstrap.Modal(
    document.getElementById("deleteStoreModal"),
  );
  modal.show();
};

const handleCreateStore = async () => {
  try {
    isLoading.value = true;
    storeFormErrors.value = {};
    const { data, error } = await createStore(storeForm.value);
    if (error) {
      if (error.errors) {
        storeFormErrors.value = error.errors;
      } else {
        toast.error(error.message || "Failed to create store");
      }
      return;
    }
    if (data?.success) {
      toast.success("Store created successfully");
      const modal = (window as any).bootstrap.Modal.getInstance(
        document.getElementById("createStoreModal"),
      );
      modal?.hide();
      resetStoreForm();
      await loadStores();
    }
  } catch (err) {
    toast.error(err instanceof Error ? err.message : "Failed to create store");
  } finally {
    isLoading.value = false;
  }
};

const handleUpdateStore = async () => {
  if (!storeToEdit.value) return;
  try {
    isLoading.value = true;
    storeFormErrors.value = {};
    const { data, error } = await updateStore(
      storeToEdit.value.id,
      storeForm.value,
    );
    if (error) {
      if (error.errors) {
        storeFormErrors.value = error.errors;
      } else {
        toast.error(error.message || "Failed to update store");
      }
      return;
    }
    if (data?.success) {
      toast.success("Store updated successfully");
      const modal = (window as any).bootstrap.Modal.getInstance(
        document.getElementById("editStoreModal"),
      );
      modal?.hide();
      resetStoreForm();
      await loadStores();
    }
  } catch (err) {
    toast.error(err instanceof Error ? err.message : "Failed to update store");
  } finally {
    isLoading.value = false;
  }
};

const handleDeleteStore = async () => {
  if (!storeToDelete.value) return;
  try {
    isLoading.value = true;
    const { data, error } = await deleteStore(storeToDelete.value.id);
    if (error) {
      toast.error(error.message || "Failed to delete store");
      return;
    }
    if (data?.success) {
      toast.success("Store deleted successfully");
      const modal = (window as any).bootstrap.Modal.getInstance(
        document.getElementById("deleteStoreModal"),
      );
      modal?.hide();
      storeToDelete.value = null;
      await loadStores();
    }
  } catch (err) {
    toast.error(err instanceof Error ? err.message : "Failed to delete store");
  } finally {
    isLoading.value = false;
  }
};

const resetPopupBannerForm = () => {
  popupBannerToEdit.value = null;
  popupBannerForm.value = {
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    url: "",
  };
  popupBannerImageFile.value = null;
  popupBannerImagePreview.value = "";
};

const loadPopupBanners = async () => {
  loadingPopupBanners.value = true;
  popupBannerError.value = null;

  const { data, error } = await getPopupBanners();

  if (error) {
    popupBannerError.value = error.message;
  } else if (data) {
    popupBanners.value = data.data.popup_banners || [];
  }

  loadingPopupBanners.value = false;
};

const handleCreatePopupBannerClick = async () => {
  resetPopupBannerForm();
  await nextTick();

  const modal = new (window as any).bootstrap.Modal(
    document.getElementById("createPopupBannerModal"),
  );

  modal.show();
};

const handleEditPopupBannerClick = async (banner: PopupBanner) => {
  popupBannerToEdit.value = banner;

  popupBannerForm.value = {
    title: banner.title || "",
    description: banner.description || "",
    start_date: banner.start_date || "",
    end_date: banner.end_date || "",
    url: banner.url || "",
  };
  popupBannerImagePreview.value = banner.image || "";
  popupBannerImageFile.value = null;

  await nextTick();

  const modal = new (window as any).bootstrap.Modal(
    document.getElementById("editPopupBannerModal"),
  );

  modal.show();
};

const handleDeletePopupBannerClick = async (banner: PopupBanner) => {
  popupBannerToDelete.value = banner;
  await nextTick();
  const modal = new (window as any).bootstrap.Modal(
    document.getElementById("deletePopupBannerModal"),
  );
  modal.show();
};

const handleCreatePopupBanner = async () => {
  try {
    isLoading.value = true;

    const formData = new FormData();

    formData.append("title", popupBannerForm.value.title);
    formData.append("description", popupBannerForm.value.description || "");
    formData.append("start_date", popupBannerForm.value.start_date || "");
    formData.append("end_date", popupBannerForm.value.end_date || "");
    formData.append("url", popupBannerForm.value.url || "");

    if (popupBannerImageFile.value) {
      formData.append("image", popupBannerImageFile.value);
    }

    const { data, error } = await createPopupBanner(formData);

    if (error) {
      toast.error(error.message || "Failed to create popup banner");
      return;
    }

    console.log("Create popup banner response:", data);

    if (data?.success) {
      toast.success("Popup banner created successfully");

      const modal = (window as any).bootstrap.Modal.getInstance(
        document.getElementById("createPopupBannerModal"),
      );
      modal?.hide();

      await loadPopupBanners();
    }
  } catch (err) {
    toast.error(
      err instanceof Error ? err.message : "Failed to create popup banner",
    );
  } finally {
    isLoading.value = false;
  }
};

const handleUpdatePopupBanner = async () => {
  if (!popupBannerToEdit.value) return;

  try {
    isLoading.value = true;

    const formData = new FormData();

    formData.append("title", popupBannerForm.value.title);
    formData.append("description", popupBannerForm.value.description || "");
    formData.append("start_date", popupBannerForm.value.start_date || "");
    formData.append("end_date", popupBannerForm.value.end_date || "");
    formData.append("url", popupBannerForm.value.url || "");

    if (popupBannerImageFile.value) {
      formData.append("image", popupBannerImageFile.value);
    }

    formData.append("_method", "PUT");

    const { data, error } = await updatePopupBanner(
      popupBannerToEdit.value.id,
      formData,
    );

    if (error) {
      toast.error(error.message || "Failed to update popup banner");
      return;
    }

    if (data?.success) {
      toast.success("Popup banner updated successfully");

      const modal = (window as any).bootstrap.Modal.getInstance(
        document.getElementById("editPopupBannerModal"),
      );
      modal?.hide();

      popupBannerToEdit.value = null;
      await loadPopupBanners();
    }
  } catch (err) {
    toast.error(
      err instanceof Error ? err.message : "Failed to update popup banner",
    );
  } finally {
    isLoading.value = false;
  }
};

const handleDeletePopupBanner = async () => {
  if (!popupBannerToDelete.value) return;

  try {
    isLoading.value = true;

    const { error } = await deletePopupBanner(popupBannerToDelete.value.id);

    if (error) {
      toast.error(error.message || "Failed to delete popup banner");
      return;
    }

    toast.success("Popup banner deleted successfully");

    const modal = (window as any).bootstrap.Modal.getInstance(
      document.getElementById("deletePopupBannerModal"),
    );
    modal?.hide();

    popupBannerToDelete.value = null;
    await loadPopupBanners();
  } catch (err) {
    toast.error(
      err instanceof Error ? err.message : "Failed to delete popup banner",
    );
  } finally {
    isLoading.value = false;
  }
};

const handlePopupBannerImageChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (!input?.files?.[0]) return;

  popupBannerImageFile.value = input.files[0];
  popupBannerImagePreview.value = URL.createObjectURL(input.files[0]);
};

watch(
  () => activeTab.value,
  async (newTab) => {
    if (newTab === "store") {
      await loadProvinces();
    }
    if (newTab === "popupBanner") {
      await loadPopupBanners();
    }
  },
  { immediate: true },
);

onMounted(async () => {
  await loadSettings();
  if (hasPermission("stores.read")) {
    await loadStores();
  }
  if (hasPermission("popup-banners.read")) {
    await loadPopupBanners();
  }
});
</script>

<style scoped>
.settings-page,
.settings-page :deep(.pagetitle h1),
.settings-page :deep(.breadcrumb-item),
.settings-page :deep(.breadcrumb-item.active),
.settings-page :deep(.breadcrumb-item a),
.settings-page :deep(.card-title),
.settings-page :deep(.form-label),
.settings-page :deep(.table),
.settings-page :deep(.table th),
.settings-page :deep(.table td),
.settings-page :deep(.table a) {
  color: #000 !important;
}

.settings-page :deep(.form-text),
.settings-page :deep(.text-muted) {
  color: #4f5b66 !important;
}

.settings-page :deep(.table .badge) {
  font-weight: 600;
}

.settings-page :deep(.table .badge.bg-secondary) {
  background-color: #e5e7eb !important;
  color: #374151 !important;
}

.settings-page :deep(.table .badge.bg-success) {
  background-color: #dff3e7 !important;
  color: #166534 !important;
}

.settings-page :deep(.table .badge.bg-info) {
  background-color: #d8f0f7 !important;
  color: #164e63 !important;
}

.settings-page :deep(.table .badge.bg-warning) {
  background-color: #fdf1d3 !important;
  color: #8a5a00 !important;
}

.nav-tabs .nav-link {
  color: #000;
  border: none;
  border-bottom: 2px solid transparent;
}

.nav-tabs .nav-link.active {
  font-weight: 500;
  color: #000;
  border-bottom-color: #000;
}

.nav-tabs .profile-link {
  color: #000;
}

:deep(.btn.btn-primary) {
  background-color: var(--app-action-dark-bg) !important;
  border-color: var(--app-action-dark-bg) !important;
  color: #ffffff !important;
}

:deep(.btn.btn-primary:hover),
:deep(.btn.btn-primary:focus),
:deep(.btn.btn-primary:active) {
  background-color: var(--app-action-dark-hover-bg) !important;
  border-color: var(--app-action-dark-hover-bg) !important;
  color: #ffffff !important;
}

:deep(.btn.btn-primary:disabled) {
  background-color: var(--app-action-dark-disabled-bg) !important;
  border-color: var(--app-action-dark-disabled-bg) !important;
  color: #d9d9d9 !important;
}

.img-thumbnail {
  object-fit: contain;
  border: 1px solid #e9ecef;
  padding: 4px;
  background: #fff;
}
</style>
