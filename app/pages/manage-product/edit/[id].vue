<template>
  <div>
    <!-- Loading State -->
    <div v-if="loadingProduct" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2 text-muted">Loading product...</p>
    </div>

    <!-- Product Not Found -->
    <div v-else-if="!product" class="card">
      <div class="card-body text-center py-5">
        <h5>Product not found</h5>
        <p class="text-muted">The product you're looking for doesn't exist.</p>
        <NuxtLink to="/manage-product" class="btn btn-primary action-btn-dark">
          Back to Products
        </NuxtLink>
      </div>
    </div>

    <!-- Edit Form with Tabs -->
    <div v-else>
      <!-- Page Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 class="mb-0">Edit Product</h4>
        </div>
        <NuxtLink
          :to="`/manage-product/${product.slug}`"
          class="btn back-nav-btn"
        >
          <i class="bi bi-arrow-left me-2"></i>Back to Product
        </NuxtLink>
      </div>

      <!-- Progress Steps -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="overflow-auto">
            <ul
              class="nav nav-tabs mb-3 flex-nowrap"
              id="productStepsTabs"
              role="tablist"
            >
              <li
                class="nav-item"
                role="presentation"
                v-for="step in steps"
                :key="step.key"
              >
                <button
                  class="nav-link text-nowrap"
                  :class="{ active: currentStep === step.key }"
                  @click="goToStep(step.key)"
                  type="button"
                  :disabled="!canAccessStep(step.key)"
                >
                  <i :class="step.icon + ' me-2'"></i>
                  {{ step.label }}
                </button>
              </li>
            </ul>
          </div>
          <div class="card">
            <div class="card-body">
              <div class="tab-content">
                <!-- Step 1: Category -->
                <div v-if="currentStep === 1" class="tab-pane fade show active">
                  <div v-if="loadingCategories" class="text-center py-4">
                    <div
                      class="spinner-border spinner-border-sm text-primary"
                      role="status"
                    ></div>
                    <p class="mt-2 text-muted small">Loading categories...</p>
                  </div>

                  <div v-else class="category-flow">
                    <div class="category-panel border rounded p-3 h-100">
                      <div
                        class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-3"
                      >
                        <div>
                          <div class="d-flex align-items-center gap-2 mb-1">
                            <h5 class="mb-0">Category</h5>
                          </div>
                        </div>
                        <button
                          type="button"
                          class="btn btn-sm btn-success align-self-start"
                          @click="openCreateCategoryModal('primary')"
                        >
                          <i class="bi bi-plus-circle me-1"></i>New
                        </button>
                      </div>

                      <input
                        v-model="categorySearchQuery"
                        type="text"
                        class="form-control mb-3"
                        placeholder="Search categories..."
                      />

                      <div
                        class="list-group category-selection-list"
                        :class="{ 'is-empty': filteredPrimaryCategories.length === 0 }"
                      >
                        <button
                          v-for="category in filteredPrimaryCategories"
                          :key="category.id"
                          type="button"
                          class="list-group-item list-group-item-action d-flex justify-content-between align-items-center gap-2"
                          :class="{
                            active: selectedPrimaryCategoryId === category.id,
                          }"
                          @click="selectPrimaryCategory(category.id)"
                        >
                          <div class="text-start">
                            <div class="fw-semibold d-flex align-items-center gap-2">
                              {{ category.taxonomy_name }}
                            </div>
                            <small
                              v-if="category.taxonomy_description"
                              class="text-muted"
                            >
                              {{ category.taxonomy_description }}
                            </small>
                          </div>
                          <div class="d-flex gap-1">
                            <button
                              type="button"
                              class="btn btn-sm btn-outline-warning py-0 px-1"
                              @click.stop="openEditCategoryModalInStep(category)"
                              title="Edit Category"
                            >
                              <i class="bi bi-pencil" style="font-size: 0.7rem;"></i>
                            </button>
                            <button
                              type="button"
                              class="btn btn-sm btn-outline-danger py-0 px-1"
                              @click.stop="openDeleteCategoryModalInStep(category)"
                              title="Delete Category"
                            >
                              <i class="bi bi-trash" style="font-size: 0.7rem;"></i>
                            </button>
                          </div>
                        </button>

                        <div
                          v-if="filteredPrimaryCategories.length === 0"
                          class="text-center py-4 text-muted"
                        >
                          No matching categories found.
                        </div>
                      </div>
                    </div>

                    <div class="category-summary border rounded p-3">
                      <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
                        <div class="fw-semibold mb-0">Selected Category</div>
                      </div>
                      <div class="d-flex flex-column flex-md-row gap-2 gap-md-4">
                        <div>
                          Category:
                          <strong>{{
                            selectedPrimaryCategory
                              ? selectedPrimaryCategory.taxonomy_name
                              : "-"
                          }}</strong>
                        </div>
                        <div>
                          Subcategory:
                          <strong>{{
                            selectedSubcategory
                              ? selectedSubcategory.taxonomy_name
                              : "-"
                          }}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Step 2: SubCategory -->
                <div v-if="currentStep === 2" class="tab-pane fade show active">
                  <div v-if="loadingCategories" class="text-center py-4">
                    <div
                      class="spinner-border spinner-border-sm text-primary"
                      role="status"
                    ></div>
                    <p class="mt-2 text-muted small">Loading subcategories...</p>
                  </div>

                  <div v-else class="category-flow">
                    <div class="category-panel border rounded p-3 h-100">
                      <div
                        class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-3"
                      >
                        <div>
                          <div class="d-flex align-items-center gap-2 mb-1">
                            <h5 class="mb-0">Subcategory</h5>
                          </div>
                        </div>
                        <button
                          type="button"
                          class="btn btn-sm btn-success align-self-start"
                          :disabled="!selectedPrimaryCategoryId"
                          @click="openCreateCategoryModal('sub')"
                        >
                          <i class="bi bi-plus-circle me-1"></i>New
                        </button>
                      </div>

                      <input
                        v-model="subcategorySearchQuery"
                        type="text"
                        class="form-control mb-3"
                        placeholder="Search subcategories..."
                        :disabled="!selectedPrimaryCategoryId"
                      />

                      <div
                        v-if="!selectedPrimaryCategoryId"
                        class="alert alert-light border mb-0"
                      >
                        Select a category first to show its subcategories.
                      </div>

                      <div
                        v-else
                        class="list-group category-selection-list"
                        :class="{ 'is-empty': filteredSubcategories.length === 0 }"
                      >
                        <button
                          v-for="category in filteredSubcategories"
                          :key="category.id"
                          type="button"
                          class="list-group-item list-group-item-action d-flex justify-content-between align-items-center gap-2"
                          :class="{
                            active: selectedSubcategoryId === category.id,
                          }"
                          @click="selectSubcategory(category.id)"
                        >
                          <div class="text-start">
                            <div class="fw-semibold">
                              {{ category.taxonomy_name }}
                            </div>
                            <small
                              v-if="category.taxonomy_description"
                              class="text-muted"
                            >
                              {{ category.taxonomy_description }}
                            </small>
                          </div>
                          <div class="d-flex gap-1">
                            <button
                              type="button"
                              class="btn btn-sm btn-outline-warning py-0 px-1"
                              @click.stop="openEditCategoryModalInStep(category)"
                              title="Edit Category"
                            >
                              <i class="bi bi-pencil" style="font-size: 0.7rem;"></i>
                            </button>
                            <button
                              type="button"
                              class="btn btn-sm btn-outline-danger py-0 px-1"
                              @click.stop="openDeleteCategoryModalInStep(category)"
                              title="Delete Category"
                            >
                              <i class="bi bi-trash" style="font-size: 0.7rem;"></i>
                            </button>
                          </div>
                        </button>

                        <div
                          v-if="filteredSubcategories.length === 0"
                          class="text-center py-4 text-muted"
                        >
                          No subcategories found for this category.
                        </div>
                      </div>
                    </div>

                    <div class="category-summary border rounded p-3">
                      <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
                        <div class="fw-semibold mb-0">Selected Category</div>
                      </div>
                      <div class="d-flex flex-column flex-md-row gap-2 gap-md-4">
                        <div>
                          Category:
                          <strong>{{
                            selectedPrimaryCategory
                              ? selectedPrimaryCategory.taxonomy_name
                              : "-"
                          }}</strong>
                        </div>
                        <div>
                          Subcategory:
                          <strong>{{
                            selectedSubcategory
                              ? selectedSubcategory.taxonomy_name
                              : "-"
                          }}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  v-if="currentStep === 3"
                  class="tab-pane fade show active basic-info-step"
                >
                  <div class="row g-3">
                    <div class="col-12 d-none">
                      <div class="border-bottom pb-2 mb-3">
                        <h6 class="mb-0 text-dark">
                          <i class="bi bi-info-circle me-2"></i>Basic
                          Information
                        </h6>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label"
                        >Product Name <span class="text-danger">*</span></label
                      >
                      <input
                        v-model="productForm.name"
                        type="text"
                        required
                        class="form-control"
                        :class="{ 'is-invalid': productFormErrors.name }"
                        placeholder="Product Name"
                        @input="generateSlugFromName"
                      />
                      <div
                        v-if="productFormErrors.name"
                        class="invalid-feedback"
                      >
                        {{ productFormErrors.name[0] }}
                      </div>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label"
                        >Slug <span class="text-danger">*</span></label
                      >
                      <input
                        v-model="productForm.slug"
                        type="text"
                        required
                        class="form-control"
                        :class="{ 'is-invalid': productFormErrors.slug }"
                        placeholder="product-slug"
                        readonly
                      />
                      <small class="text-muted"></small>
                      <div
                        v-if="productFormErrors.slug"
                        class="invalid-feedback"
                      >
                        {{ productFormErrors.slug[0] }}
                      </div>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Status</label>
                      <select v-model="productForm.status" class="form-select">
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISH">Publish</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Free Shipping</label>
                      <select
                        v-model="productForm.is_freeshiping"
                        class="form-select"
                      >
                        <option value="INACTIVE">Inactive</option>
                        <option value="ACTIVE">Active</option>
                      </select>
                    </div>

                    <!-- Information -->
                    <div class="col-12 mt-4">
                      <div class="border-bottom pb-2 mb-3">
                      </div>
                    </div>
                    <div class="col-12">
                      <label class="form-label">Information</label>
                      <textarea
                        v-model="productForm.product_information"
                        class="form-control"
                        rows="4"
                        placeholder="Product information"
                      ></textarea>
                    </div>

                    <!-- Pricing -->
                    <div class="col-12 mt-4">
                      <div class="border-bottom pb-2 mb-3">
                      </div>
                    </div>

                    <div class="col-md-6">
                      <label class="form-label"
                        >Selling Price <span class="text-danger">*</span></label
                      >
                      <input
                        v-model.number="productForm.base_price"
                        type="number"
                        step="0.01"
                        class="form-control"
                        placeholder="0.00"
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label"
                        >Original Price (Strike Price)
                        <span class="text-muted">(Optional)</span></label
                      >
                      <input
                        v-model.number="productForm.base_strike_price"
                        type="number"
                        step="0.01"
                        class="form-control"
                        placeholder="0.00"
                      />
                    </div>

                    <!-- SEO Metadata (Auto-generated) -->
                    <div class="col-12 mt-3">
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
                                {{ productForm.meta_title || "—" }}
                              </p>
                            </div>
                          </div>
                          <div class="col-md-7">
                            <div class="seo-meta-item rounded px-2 py-2">
                              <div class="small text-muted mb-1">Meta Description</div>
                              <p class="mb-0 small text-dark">
                                {{ productForm.meta_description || "—" }}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-12 mt-4 d-none">
                      <div class="border-bottom pb-2 mb-3">
                        <h6 class="mb-0 text-dark">
                          <i class="bi bi-search me-2"></i>SEO Metadata
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Step 4: Images -->
                <div v-if="currentStep === 4" class="tab-pane fade show active">
                  <h5 class="mb-4">Product Images</h5>
                  
                  <ShopeeImageUpload
                    v-if="!loadingImages"
                    :images="existingImagesWithPending"
                    :disabled="uploadingImages"
                    @change="handleImageChange"
                    @set-featured="handleSetFeaturedFromUpload"
                    @remove-image="handleRemoveImageFromUpload"
                    @remove-featured="handleRemoveFeaturedFromUpload"
                  />
                  
                  <!-- Loading State -->
                  <div v-else class="text-center py-3">
                    <div
                      class="spinner-border spinner-border-sm text-primary"
                      role="status"
                    ></div>
                    <p class="mt-2 text-muted small">Loading images...</p>
                  </div>
                </div>

                <!-- Step 5: Attributes -->
                <div v-if="currentStep === 5" class="tab-pane fade show active">
                  <h5 class="mb-4">Product Attributes</h5>

                  <div class="mb-4">
                    <button
                      type="button"
                      class="btn btn-primary action-btn-dark"
                      @click="handleAddAttributeClick"
                      :disabled="loadingAttributes"
                    >
                      <i class="bi bi-plus-circle me-2"></i>Add Attribute
                    </button>
                  </div>

                  <div v-if="loadingAttributes" class="text-center py-3">
                    <div
                      class="spinner-border spinner-border-sm text-primary"
                      role="status"
                    ></div>
                    <p class="text-muted mt-2">Loading attributes...</p>
                  </div>

                  <div
                    v-else-if="selectedAttributes.length === 0"
                    class="text-center py-4"
                  >
                    <p class="text-muted mb-0">No attributes yet</p>
                  </div>

                  <div v-else class="row g-3">
                    <div
                      v-for="(selectedAttr, index) in selectedAttributes"
                      :key="index"
                      class="col-12"
                    >
                      <div class="card">
                        <div
                          class="card-header d-flex justify-content-between align-items-center"
                        >
                          <h6 class="mb-0">
                            {{ getAttributeName(selectedAttr.attribute_id) }}
                          </h6>
                          <button
                            type="button"
                            class="btn btn-sm btn-danger"
                            @click="removeAttribute(index)"
                          >
                            <i class="bi bi-trash"></i>
                          </button>
                        </div>
                        <div class="card-body">
                          <div
                            class="d-flex justify-content-between align-items-center mb-2"
                          >
                            <label class="form-label mb-0">Select Values</label>
                          </div>
                          <div class="row g-2">
                            <div
                              v-for="value in getAttributeValuesList(
                                selectedAttr.attribute_id,
                              )"
                              :key="value.id"
                              class="col-md-3"
                            >
                              <div
                                class="form-check attribute-value-option"
                                :class="{
                                  'is-disabled': value.status === 'INACTIVE',
                                }"
                              >
                                <input
                                  class="form-check-input"
                                  type="checkbox"
                                  :value="value.id"
                                  :id="`attr-${selectedAttr.attribute_id}-value-${value.id}`"
                                  v-model="selectedAttr.values"
                                  :disabled="value.status === 'INACTIVE'"
                                  :title="
                                    value.status === 'INACTIVE'
                                      ? 'INACTIVE values cannot be selected'
                                      : ''
                                  "
                                />
                                <label
                                  class="form-check-label"
                                  :for="`attr-${selectedAttr.attribute_id}-value-${value.id}`"
                                  :class="{
                                    'text-muted': value.status === 'INACTIVE',
                                    'cursor-not-allowed':
                                      value.status === 'INACTIVE',
                                  }"
                                >
                                  {{ value.value }}
                                  <span
                                    v-if="value.status === 'INACTIVE'"
                                    class="badge bg-secondary ms-2"
                                    >INACTIVE</span
                                  >
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
                            No values available
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Step 6: Variants -->
                <div v-if="currentStep === 6" class="tab-pane fade show active">
                  <h5 class="mb-4">Product Variants</h5>

                  <div class="mb-3">
                    <button
                      type="button"
                      class="btn btn-primary action-btn-dark"
                      @click="handleAddVariantClick"
                    >
                      <i class="bi bi-plus-circle me-2"></i>Add Variant
                    </button>
                  </div>

                  <div v-if="loadingVariants" class="text-center py-3">
                    <div
                      class="spinner-border spinner-border-sm text-primary"
                      role="status"
                    ></div>
                    <p class="mt-2 text-muted small">Loading variants...</p>
                  </div>

                  <div
                    v-else-if="!variants || variants.length === 0"
                    class="text-center py-4"
                  >
                    <p class="text-muted mb-0">No variants yet</p>
                  </div>

                  <div
                    v-else-if="variants && variants.length > 0"
                    class="table-responsive"
                  >
                    <table class="table table-striped">
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Variant Name</th>
                          <th>Attributes</th>
                          <th>SKU</th>
                          <th>Stock</th>
                          <th>Price</th>
                          <th>Strike Price</th>
                          <th>Discount %</th>
                          <th>Status</th>
                          <th class="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(variant, index) in variants"
                          :key="variant.id || index"
                        >
                          <td>
                            <img
                              v-if="variant.image_path"
                              :src="variant.image_path"
                              :alt="variant.variant_name || 'Variant'"
                              class="img-thumbnail"
                              style="
                                max-width: 60px;
                                max-height: 60px;
                                object-fit: cover;
                              "
                            />
                            <span v-else class="text-muted small"
                              >No image</span
                            >
                          </td>
                          <td>
                            {{ variant.variant_name || "Unnamed Variant" }}
                          </td>
                          <td>
                            <div class="d-flex flex-wrap gap-1">
                              <span
                                v-for="valueId in variant.attribute_value_ids"
                                :key="valueId"
                                class="badge bg-secondary"
                              >
                                {{ getAttributeValueName(valueId) }}
                              </span>
                            </div>
                          </td>
                          <td>{{ variant.sku || "N/A" }}</td>
                          <td class="text-nowrap">
                            {{ getVariantTotalStock(variant) }}
                          </td>
                          <td>Rp {{ formatNumber(variant.price || 0) }}</td>
                          <td class="text-nowrap">
                            <span v-if="variant.strike_price">
                              Rp {{ formatNumber(variant.strike_price) }}
                            </span>
                            <span v-else class="text-muted">-</span>
                          </td>
                          <td class="text-nowrap">
                            <span v-if="variant.discount_percent">
                              {{ variant.discount_percent }}%
                            </span>
                            <span v-else class="text-muted">-</span>
                          </td>
                          <td>
                            <span
                              :class="[
                                'badge',
                                variant.status === 'ACTIVE'
                                  ? 'bg-success'
                                  : 'bg-secondary',
                              ]"
                            >
                              {{ variant.status }}
                            </span>
                          </td>
                          <td class="text-end">
                            <div class="d-flex gap-2 justify-content-end">
                              <button
                                type="button"
                                class="btn btn-sm btn-outline-primary"
                                @click="editVariant(index)"
                              >
                                <i class="bi bi-pencil"></i>
                              </button>
                              <button
                                type="button"
                                class="btn btn-sm btn-outline-danger"
                                @click="handleDeleteVariant(variant.id, index)"
                                :disabled="deletingVariantId === variant.id"
                              >
                                <i class="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Step 7: Brands -->
                <div v-if="currentStep === 7" class="tab-pane fade show active">
                  <h5 class="mb-4 pt-3">Merk Product</h5>

                  <div
                    class="mb-3 d-flex justify-content-between align-items-center"
                  >
                    <div class="flex-grow-1">
                      <input
                        v-model="brandSearchQuery"
                        type="text"
                        class="form-control"
                        placeholder="Search brands..."
                      />
                    </div>

                  </div>

                  <div v-if="loadingBrands" class="text-center py-3">
                    <div
                      class="spinner-border spinner-border-sm text-primary"
                      role="status"
                    ></div>
                    <p class="mt-2 text-muted small">Loading brands...</p>
                  </div>

                  <div v-else>
                    <!-- Selected Brands -->
                    <div
                      v-if="selectedBrandIds && selectedBrandIds.length > 0"
                      class="mb-3"
                    >
                      <label class="form-label"
                        ><strong>Selected Brands:</strong></label
                      >
                      <div class="d-flex flex-wrap gap-2">
                        <span
                          v-for="brandId in selectedBrandIds"
                          :key="brandId"
                          class="badge bg-primary d-flex align-items-center gap-2"
                          style="font-size: 0.9rem; padding: 0.5rem 0.75rem"
                        >
                          {{ getBrandName(brandId) }}
                          <button
                            type="button"
                            class="btn-close btn-close-white"
                            style="font-size: 0.7rem"
                            @click="removeBrand(brandId)"
                            aria-label="Remove"
                          ></button>
                        </span>
                      </div>
                    </div>

                    <!-- Brands List -->
                    <div
                      class="border rounded p-3"
                      style="max-height: 400px; overflow-y: auto"
                    >
                      <div
                        v-if="filteredBrands.length === 0"
                        class="text-center py-4"
                      >
                        <p class="text-muted mb-0">No brands found</p>
                      </div>
                      <div v-else class="row g-2">
                        <div
                          v-for="brand in filteredBrands"
                          :key="brand.id"
                          class="col-12 col-md-6"
                        >
                          <div class="form-check">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              :value="Number(brand.id)"
                              :id="`brand-${brand.id}`"
                              v-model="selectedBrandIds"
                            />
                            <label
                              class="form-check-label"
                              :for="`brand-${brand.id}`"
                              style="cursor: pointer"
                            >
                              {{ brand?.name || "Unknown Brand" }}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Navigation Buttons -->
              <div class="mt-4 d-flex justify-content-between">
                <div>
                  <button
                    v-if="currentStep > 1"
                    type="button"
                    class="btn btn-secondary"
                    @click="previousStep"
                  >
                    <i class="bi bi-arrow-left me-2"></i>Previous
                  </button>
                </div>
                <div class="d-flex gap-2">
                  <NuxtLink
                    :to="`/manage-product/${product.slug}`"
                    class="btn btn-outline-secondary outline-dark-btn"
                  >
                    Cancel
                  </NuxtLink>
                  <button
                    v-if="currentStep < steps.length"
                    type="button"
                    class="btn btn-primary action-btn-dark"
                    @click="nextStep"
                    :disabled="!canProceedToNextStep"
                  >
                    Next<i class="bi bi-arrow-right ms-2"></i>
                  </button>
                  <button
                    v-else
                    type="button"
                    class="btn btn-success"
                    @click="handleUpdateProduct"
                    :disabled="isLoading || !canUpdateProduct"
                  >
                    {{ isLoading ? "Updating..." : "Update Product" }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Attribute Modal -->
    <div
      class="modal fade"
      id="addAttributeModal"
      tabindex="-1"
      aria-labelledby="addAttributeModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addAttributeModalLabel">
              Add Attribute
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <!-- Tabs -->
            <ul class="nav nav-tabs mb-3" role="tablist">
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link"
                  :class="{ active: attributeModalTab === 'select' }"
                  @click="attributeModalTab = 'select'"
                  type="button"
                >
                  <i class="bi bi-list-check me-2"></i>Select Existing
                </button>
              </li>
            </ul>

            <!-- Tab Content: Select Existing -->
            <div v-if="attributeModalTab === 'select'" class="tab-content">
              <div v-if="loadingAttributes" class="text-center py-3">
                <div
                  class="spinner-border spinner-border-sm text-primary"
                  role="status"
                ></div>
                <p class="text-muted mt-2">Loading attributes...</p>
              </div>
              <div
                v-else-if="unselectedAttributes.length === 0"
                class="text-center py-4"
              >
                <p class="text-muted">No available attributes to add</p>
                <p class="text-muted small">
                  All attributes have been selected or create a new one
                </p>
              </div>
              <div v-else class="list-group">
                <button
                  v-for="attr in unselectedAttributes"
                  :key="attr.id"
                  type="button"
                  class="list-group-item list-group-item-action"
                  @click="selectAttribute(attr.id)"
                >
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <h6 class="mb-1">{{ attr.name }}</h6>
                      <small class="text-muted">
                        {{
                          attr.attribute_values
                            ?.map((v) => v.value)
                            .join(", ") || "No values"
                        }}
                      </small>
                    </div>
                    <i class="bi bi-chevron-right"></i>
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              @click="resetNewAttributeForm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Attribute Value Modal -->
    <div
      class="modal fade"
      id="addAttributeValueModal"
      tabindex="-1"
      aria-labelledby="addAttributeValueModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addAttributeValueModalLabel">
              Add Value to
              {{
                addingValueToAttributeId
                  ? getAttributeName(addingValueToAttributeId)
                  : "Attribute"
              }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleCreateAttributeValue">
              <div class="mb-3">
                <label class="form-label"
                  >Value <span class="text-danger">*</span></label
                >
                <input
                  v-model="newAttributeValueForm.value"
                  type="text"
                  class="form-control"
                  placeholder="e.g., Red, Blue, Small, Large"
                  required
                  maxlength="100"
                />
                <small class="text-muted"
                  >Value for this attribute (e.g., Red for Color, Small for
                  Size)</small
                >
              </div>
              <div class="mb-3">
                <label class="form-label">Sort Order</label>
                <input
                  v-model.number="newAttributeValueForm.sort"
                  type="number"
                  class="form-control"
                  placeholder="0"
                  min="0"
                />
                <small class="text-muted"
                  >Display order (lower number appears first)</small
                >
              </div>
              <div class="d-flex gap-2">
                <button
                  type="submit"
                  class="btn btn-primary action-btn-dark"
                  :disabled="
                    creatingAttributeValue || !newAttributeValueForm.value
                  "
                >
                  <span
                    v-if="creatingAttributeValue"
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  <i v-else class="bi bi-check-circle me-2"></i>
                  Create & Add
                </button>
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="resetNewAttributeValueForm"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              @click="resetNewAttributeValueForm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Image Modal -->
    <div
      id="deleteImageModal"
      class="modal fade"
      tabindex="-1"
      aria-labelledby="deleteImageModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteImageModalLabel">Delete Image</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>
              Are you sure you want to delete this image? This action cannot be
              undone.
            </p>
            <div v-if="imageToDelete" class="text-center mt-3">
              <img
                :src="imageToDelete.path"
                :alt="`Image ${imageToDelete.order_number}`"
                class="img-thumbnail"
                style="max-height: 200px; max-width: 100%"
                @error="handleImageError"
              />
            </div>
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
              @click="handleConfirmDeleteImage"
              :disabled="deletingImageId !== null"
            >
              {{ deletingImageId !== null ? "Deleting..." : "Delete Image" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Category Modal -->
    <div
      class="modal fade"
      id="addCategoryModal"
      tabindex="-1"
      aria-labelledby="addCategoryModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addCategoryModalLabel">
              Create New Category
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleCreateCategory">
              <div class="mb-3">
                <label class="form-label"
                  >{{ newCategoryForm.taxonomy_type === 2 ? "Category" : "Subcategory" }}
                  <span class="text-danger">*</span></label
                >
                <input
                  v-model="newCategoryForm.taxonomy_name"
                  type="text"
                  class="form-control"
                  :placeholder="
                    newCategoryForm.taxonomy_type === 2
                      ? 'e.g., Tas, Dompet, Ikat Pinggang'
                      : 'e.g., Tas Selempang, Tas Ransel'
                  "
                  required
                  maxlength="250"
                  @input="generateCategorySlug"
                />
                <small class="text-muted">
                  {{
                    newCategoryForm.taxonomy_type === 2
                      ? "Main category name"
                      : "Subcategory name for the selected category"
                  }}
                </small>
              </div>
              <div class="mb-3">
                <label class="form-label">Category Type</label>
                <select
                  v-model="newCategoryForm.taxonomy_type"
                  class="form-select"
                >
                  <option :value="2">Category</option>
                  <option :value="3">Subcategory</option>
                </select>
              </div>
              <div v-if="newCategoryForm.taxonomy_type === 3" class="mb-3">
                <label class="form-label"
                  >Parent Category <span class="text-danger">*</span></label
                >
                <select v-model="newCategoryForm.parent" class="form-select">
                  <option :value="null">Select a category...</option>
                  <option
                    v-for="category in availablePrimaryCategories"
                    :key="category.id"
                    :value="category.id"
                  >
                    {{ category.taxonomy_name }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Slug</label>
                <input
                  v-model="newCategoryForm.taxonomy_slug"
                  type="text"
                  class="form-control"
                  placeholder="auto-generated-from-name"
                  maxlength="250"
                />
                <small class="text-muted"
                  >URL-friendly version of the name (auto-generated)</small
                >
              </div>
              <div class="mb-3">
                <label class="form-label">Status</label>
                <select
                  v-model="newCategoryForm.taxonomy_status"
                  class="form-select"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
              <div class="d-flex gap-2">
                <button
                  type="submit"
                  class="btn btn-primary action-btn-dark"
                  :disabled="creatingCategory || !newCategoryForm.taxonomy_name"
                >
                  <span
                    v-if="creatingCategory"
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  <i v-else class="bi bi-check-circle me-2"></i>
                  Create & Add
                </button>
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="resetNewCategoryForm"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              @click="resetNewCategoryForm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Category Modal -->
    <div
      class="modal fade"
      id="editCategoryInStepModal"
      tabindex="-1"
      aria-labelledby="editCategoryInStepModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editCategoryInStepModalLabel">Edit Category</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Category Name <span class="text-danger">*</span></label>
              <input
                v-model="editCategoryFormData.taxonomy_name"
                type="text"
                class="form-control"
                placeholder="Enter category name"
                @input="generateEditCategorySlug"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Slug</label>
              <input
                v-model="editCategoryFormData.taxonomy_slug"
                type="text"
                class="form-control"
                placeholder="auto-generated-from-name"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Status</label>
              <select v-model="editCategoryFormData.taxonomy_status" class="form-select">
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button
              type="button"
              class="btn btn-success"
              @click="handleEditCategoryInStep"
              :disabled="editingCategoryInStep"
            >
              {{ editingCategoryInStep ? 'Updating...' : 'Update Category' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Category Modal -->
    <div
      class="modal fade"
      id="deleteCategoryInStepModal"
      tabindex="-1"
      aria-labelledby="deleteCategoryInStepModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="deleteCategoryInStepModalLabel">Delete Category</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete <strong>{{ categoryToDeleteInStep?.taxonomy_name }}</strong>?</p>
            <p class="text-muted mb-0">This action cannot be undone.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button
              type="button"
              class="btn btn-danger"
              @click="handleDeleteCategoryInStep"
              :disabled="deletingCategoryInStep"
            >
              {{ deletingCategoryInStep ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Brand Modal -->
    <div
      id="createBrandModal"
      class="modal fade"
      :class="{ show: showBrandModal }"
      :style="showBrandModal ? 'display: block;' : ''"
      tabindex="-1"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addBrandModalLabel">
              Create New Brand
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              @click="resetNewBrandForm"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleCreateBrand">
              <div class="mb-3">
                <label class="form-label">
                  Brand Name <span class="text-danger">*</span>
                </label>
                <input
                  v-model="newBrand.name"
                  type="text"
                  class="form-control"
                  required
                  maxlength="250"
                />
                <small class="text-muted">Name of the brand</small>
              </div>
              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea
                  v-model="newBrand.description"
                  class="form-control"
                  rows="3"
                  placeholder="Brand description (optional)"
                  maxlength="500"
                ></textarea>
                <small class="text-muted">
                  Brief description of the brand
                </small>
              </div>
              <div class="d-flex gap-2">
                <button
                  type="submit"
                  class="btn btn-primary action-btn-dark"
                  :disabled="creatingBrand || !newBrand.name"
                >
                  <span
                    v-if="creatingBrand"
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  <i v-else class="bi bi-check-circle me-2"></i>
                  Create & Add
                </button>
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="resetInputField"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              @click="resetNewBrandForm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Variant Modal -->
    <VariantModal
      :selected-attributes="selectedAttributes"
      :variant-form="variantForm"
      :variant-store-stocks="variantStoreStocks"
      :editing-variant-index="editingVariantIndex"
      :available-attributes="availableAttributes"
      :product-slug="product?.slug"
      :api-errors="variantApiErrors"
      @save="handleSaveVariant"
      @cancel="handleCancelVariant"
      @update:variant-form="variantForm = $event"
      @update:variant-store-stocks="variantStoreStocks = $event"
      @update-variant-name="updateVariantName"
    />
  </div>
</template>

<script setup lang="ts">
import type { Product, ProductCreatePayload } from "~/types/product";
import { generateSlug } from "~/utils/helpers";
import ShopeeImageUpload from "~/components/ShopeeImageUpload.vue";
import VariantModal from "~/components/VariantModal.vue";

interface TaxonomyItem {
  id: number;
  parent?: number | null;
  taxonomy_name: string;
  taxonomy_description?: string | null;
  taxonomy_slug?: string | null;
  taxonomy_type: number;
  taxonomy_status?: string | null;
}

definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

const route = useRoute();
const router = useRouter();
const { getProduct, updateProduct } = useProductApi();
const {
  getProductImages,
  uploadProductImage,
  uploadVariantImage,
  deleteProductImage,
  getProductVariants,
  createProductVariant,
  updateProductVariant,
  deleteProductVariant,
  getProductCategories,
  attachProductCategories,
  detachProductCategories,
  createBrand,
  getBrands,
  getProductBrands,
  attachProductBrands,
  detachProductBrands,
  getTaxoListsByType,
  createTaxoList,
  updateTaxoList,
  deleteTaxoList,
  getActiveAttributes,
  getProductAttributes,
  attachProductAttributes,
  detachProductAttributes,
  createAttribute,
  getAttributeValues,
  createAttributeValue,
  getVariantStoreStocks,
  createOrUpdateVariantStoreStock,
  deleteVariantStoreStock,
} = useProductRelationsApi();
const { getAllStores } = useStoreApi();
const toast = useToast();

const currentStep = ref(1);
const isLoading = ref(false);
const loadingProduct = ref(false);
const productRelationSynced = ref(false);
const imagesLoaded = ref(false);
const attributesLoaded = ref(false);
const variantsLoaded = ref(false);
const brandsLoaded = ref(false);

const steps = [
  { key: 1, label: "Category", icon: "bi bi-tags" },
  { key: 2, label: "SubCategory", icon: "bi bi-diagram-2" },
  { key: 3, label: "Basic Info", icon: "bi bi-info-circle" },
  { key: 4, label: "Images", icon: "bi bi-images" },
  { key: 5, label: "Attributes", icon: "bi bi-list-check" },
  { key: 6, label: "Variants", icon: "bi bi-box-seam" },
  { key: 7, label: "Merk", icon: "bi bi-tag" },
];

const product = ref<Product | null>(null);

const productForm = ref<ProductCreatePayload>({
  name: "",
  slug: "",
  status: "DRAFT",
  is_freeshiping: "INACTIVE",
  product_information: "",
  material: "",
  style: "",
  color: "",
  weight: null,
  type_weight: "GRAM",
  size_long: null,
  size_wide: null,
  size_tall: null,
  type_size: "CM",
  package_long: null,
  package_wide: null,
  package_tall: null,
  sku: "",
  base_price: null,
  base_strike_price: null,
  sort: 0,
  tags: "",
  product_protection_percent: 0,
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
});

const productFormErrors = ref<Record<string, string[]>>({});

const existingImages = ref<
  Array<{
    id: number;
    path: string;
    order_number: number;
    is_featured: boolean;
  }>
>([]);
const pendingImages = ref<
  Array<{
    file: File;
    preview: string;
    is_featured?: boolean;
    name?: string;
  }>
>([]);
const uploadingImages = ref(false);
const deletingImageId = ref<number | null>(null);
const settingFeaturedId = ref<number | null>(null);
const loadingImages = ref(false);
const imageToDelete = ref<{
  id: number;
  path: string;
  order_number: number;
} | null>(null);

const existingImagesWithPending = computed(() => {
  const convertedExisting = existingImages.value.map((img) => ({
    ...img,
    file: undefined,
    preview: img.path,
    is_featured: img.is_featured,
  }));

  const pendingConverted = pendingImages.value.map((img) => ({
    ...img,
    is_featured: Boolean(img.is_featured),
  }));

  return [...convertedExisting, ...pendingConverted];
});

const getPendingImageKey = (image: {
  id?: number;
  file?: File;
  path?: string;
  preview?: string;
  name?: string;
}) => {
  if (image.id) {
    return `id:${image.id}`;
  }
  if (image.file) {
    return `file:${image.file.name}-${image.file.size}-${image.file.lastModified}`;
  }
  if (image.path) {
    return `path:${image.path}`;
  }
  if (image.preview) {
    return `preview:${image.preview}`;
  }
  return image.name || null;
};

const getPendingUploads = () => {
  const imageMap = new Map<
    string,
    { file: File; preview: string; is_featured?: boolean; name?: string }
  >();

  for (const image of pendingImages.value) {
    const imageKey = getPendingImageKey(image);
    if (!imageKey || !image.file) continue;

    if (imageMap.has(imageKey)) {
      const existing = imageMap.get(imageKey);
      if (existing) {
        existing.is_featured =
          Boolean(existing.is_featured) || Boolean(image.is_featured);
      }
      continue;
    }

    imageMap.set(imageKey, {
      file: image.file,
      preview: image.preview,
      is_featured: Boolean(image.is_featured),
      name: image.name,
    });
  }

  const uploads = Array.from(imageMap.values());

  if (uploads.length > 0 && !uploads.some((image) => image.is_featured)) {
    const firstUpload = uploads[0];
    if (firstUpload) {
      firstUpload.is_featured = true;
    }
  }

  return uploads;
};

const variants = ref<
  Array<{
    id?: number;
    attribute_value_ids: number[];
    options?: Array<{
      id?: number;
      variant_id?: number;
      attribute_id: number;
      attribute_value_id: number;
    }>;
    variant_name?: string;
    sku?: string;
    image_path?: string | null;
    image_file?: File | null;
    price: number;
    strike_price?: number | null;
    discount_percent?: number | null;
    status: "ACTIVE" | "INACTIVE";
    weight?: number | null;
    type_weight?: "GRAM" | "KG";
    stock_relations?: Array<{
      id?: number;
      variant_id?: number;
      store_id: number;
      qty: number;
      reserved_qty: number;
      store?: {
        id: number;
        name: string;
        code?: string;
      };
    }>;
    store_stocks?: Array<{
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
  }>
>([]);
const loadingVariants = ref(false);
const editingVariantIndex = ref<number | null>(null);
const deletingVariantId = ref<number | null>(null);
const savingVariant = ref(false);
const variantApiErrors = ref<Record<string, string[]>>({});

const variantForm = ref({
  selectedAttributeValues: {} as Record<number, number>,
  attribute_value_ids: [] as number[],
  variant_name: "",
  sku: "",
  price: 0,
  strike_price: null as number | null,
  status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  image_file: null as File | null,
  image_preview: null as string | null,
  image_path: null as string | null,
  weight: null as number | null,
  type_weight: "GRAM" as "GRAM" | "KG",
});

const variantStoreStocks = ref<
  Array<{
    id?: number;
    store_id: number;
    qty: number;
    reserved_qty: number;
    store?: {
      id: number;
      name: string;
      code?: string;
    };
  }>
>([]);

const stores = ref<
  Array<{
    id: number;
    name: string;
    code?: string;
  }>
>([]);
const loadingStores = ref(false);
const storeStockForm = ref({
  store_id: null as number | null,
  qty: 0,
  reserved_qty: 0,
});
const editingStoreStockIndex = ref<number | null>(null);
const savingStoreStock = ref(false);

const availableAttributes = ref<
  Array<{
    id: number;
    name: string;
    slug: string;
    sort: number;
    attribute_values?: Array<{
      id: number;
      attribute_id: number;
      value: string;
      slug: string;
      sort: number;
      status?: string;
    }>;
  }>
>([]);
const selectedAttributes = ref<
  Array<{
    attribute_id: number;
    sort: number;
    values: number[];
  }>
>([]);
const loadingAttributes = ref(false);
const attributeModalTab = ref<"select" | "create">("select");
const creatingAttribute = ref(false);
const newAttributeForm = ref({
  name: "",
  sort: 0,
});
const addingValueToAttributeId = ref<number | null>(null);
const creatingAttributeValue = ref(false);
const newAttributeValueForm = ref({
  value: "",
  sort: 0,
});

const availablePrimaryCategories = ref<TaxonomyItem[]>([]);
const availableSubcategories = ref<TaxonomyItem[]>([]);
const selectedPrimaryCategoryId = ref<number | null>(null);
const selectedSubcategoryId = ref<number | null>(null);
const loadingCategories = ref(false);
const categorySearchQuery = ref("");
const subcategorySearchQuery = ref("");
const creatingCategory = ref(false);
const initialProductCategoryIds = ref<number[]>([]);
const newCategoryForm = ref({
  parent: null as number | null,
  taxonomy_name: "",
  taxonomy_slug: "",
  taxonomy_description: "",
  taxonomy_type: 2,
  taxonomy_status: "ACTIVE" as "ACTIVE" | "INACTIVE",
});

const brands = ref<any[]>([]);
const loadingBrands = ref(false);
const selectedBrandIds = ref<number[]>([]);
const brandSearchQuery = ref("");
const showBrandModal = ref(false);
const creatingBrand = ref(false);
const newBrand = ref({
  name: "",
  description: "",
});

const loadProduct = async () => {
  loadingProduct.value = true;
  productRelationSynced.value = false;
  try {
    const productSlug = Array.isArray(route.params.id)
      ? route.params.id[0]
      : route.params.id;
    if (!productSlug) {
      product.value = null;
      return;
    }
    const { data, error } = await getProduct(productSlug);

    if (error || !data?.success) {
      product.value = null;
      return;
    }

    if (data.data) {
      product.value = data.data.product;
      initialProductCategoryIds.value =
        product.value.categories?.map((c) => Number(c.category_id || c.id)) ||
        [];
      selectedBrandIds.value =
        product.value.brands?.map((brand: any) => Number(brand.id)) || [];

      productForm.value = {
        name: product.value.name || "",
        slug: product.value.slug || "",
        status: product.value.status || "DRAFT",
        is_freeshiping: product.value.is_freeshiping || "INACTIVE",
        product_information: product.value.product_information || "",
        material: product.value.material || "",
        style: product.value.style || "",
        color: product.value.color || "",
        weight: product.value.weight || null,
        type_weight: product.value.type_weight || "GRAM",
        size_long: product.value.size_long || null,
        size_wide: product.value.size_wide || null,
        size_tall: product.value.size_tall || null,
        type_size: product.value.type_size || "CM",
        package_long: product.value.package_long || null,
        package_wide: product.value.package_wide || null,
        package_tall: product.value.package_tall || null,
        sku: product.value.sku || "",
        base_price: product.value.base_price || null,
        sort: product.value.sort || 0,
        tags: product.value.tags || "",
        product_protection_percent:
          product.value.product_protection_percent || 0,
        meta_title: product.value.meta_title || `Buy ${product.value.name || ''}`,
        meta_description: product.value.meta_description || `Shop ${product.value.name || ''} at the best price. High quality product with fast shipping and secure payment. Order now!`,
        meta_keywords: product.value.meta_keywords || "",
      };
    }
  } catch (err) {
    console.error("Error load product:", err);
    product.value = null;
  } finally {
    loadingProduct.value = false;
  }
};

const loadImages = async () => {
  if (!product.value) return;
  loadingImages.value = true;
  try {
    const { data, error } = await getProductImages(product.value.id);
    if (error || !data?.success) {
      console.error("Failed to load images:", error);
      existingImages.value = [];
    } else {
      existingImages.value = (data.data.images || [])
        .map((img: any) => ({
          id: img.id,
          path: img.path,
          order_number: img.order_number,
          is_featured: img.is_featured || false,
        }))
        .sort((a: any, b: any) => {
          if (Boolean(a.is_featured) !== Boolean(b.is_featured)) {
            return a.is_featured ? -1 : 1;
          }
          return (a.order_number || 0) - (b.order_number || 0);
        });
    }
  } catch (err) {
    console.error("Error loading images:", err);
    existingImages.value = [];
  } finally {
    loadingImages.value = false;
  }
};

const loadVariants = async () => {
  if (!product.value) return;
  loadingVariants.value = true;
  try {
    const { data, error } = await getProductVariants(product.value.id);
    if (error || !data?.success) {
      console.error("Failed to load variants:", error);
      variants.value = [];
    } else {
      const variantsArray = Array.isArray(data.data?.variants)
        ? data.data.variants
        : Array.isArray(data.data)
          ? data.data
          : [];

      variants.value = variantsArray.map((variant: any) => {
        let attributeValueIds: number[] = variant.attribute_value_ids || [];
        if (
          attributeValueIds.length === 0 &&
          variant.options &&
          Array.isArray(variant.options)
        ) {
          attributeValueIds = variant.options
            .map((opt: any) => opt.attribute_value_id)
            .filter((id: any) => id !== null && id !== undefined);
        }

        const storeStocks =
          variant.stock_relations ||
          variant.stockRelations ||
          variant.store_stocks ||
          [];

        return {
          id: variant.id,
          attribute_value_ids: attributeValueIds,
          options: variant.options || [],
          variant_name: variant.variant_name || undefined,
          sku: variant.sku || undefined,
          image_path: variant.image_path || null,
          price:
            typeof variant.price === "string"
              ? parseFloat(variant.price)
              : variant.price || 0,
          strike_price: variant.strike_price
            ? typeof variant.strike_price === "string"
              ? parseFloat(variant.strike_price)
              : variant.strike_price
            : null,
          discount_percent: variant.discount_percent || null,
          status: variant.status || "ACTIVE",
          store_stocks: Array.isArray(storeStocks) ? storeStocks : [],
          weight: variant.weight || null,
          type_weight: variant.type_weight || "GRAM",
        };
      });
    }
  } catch (err) {
    console.error("Error loading variants:", err);
    variants.value = [];
  } finally {
    loadingVariants.value = false;
  }
};

const loadProductCategories = async () => {
  if (!product.value) return;
  loadingCategories.value = true;
  try {
    const { data, error } = await getProductCategories(product.value.id);
    if (error || !data?.success) {
      console.error("Failed to load product categories:", error);
      initialProductCategoryIds.value = [];
    } else {
      initialProductCategoryIds.value = (data.data.categories || []).map(
        (cat: any) => cat.fk_category_id,
      );
      syncSelectedCategoriesFromIds(initialProductCategoryIds.value);
    }
    loadingCategories.value = false;
  } catch (err) {
    console.error("Error loading product categories:", err);
    initialProductCategoryIds.value = [];
    loadingCategories.value = false;
  }
};

const loadAvailableCategories = async () => {
  loadingCategories.value = true;
  try {
    const [type2, type3] = await Promise.all([
      getTaxoListsByType(2),
      getTaxoListsByType(3),
    ]);
    const categories2 = (type2.data?.data?.taxo_lists || [])
      .filter((category: TaxonomyItem) => category.taxonomy_status === "ACTIVE")
      .sort((a: TaxonomyItem, b: TaxonomyItem) =>
        a.taxonomy_name.localeCompare(b.taxonomy_name),
      );
    const categories3 = (type3.data?.data?.taxo_lists || [])
      .filter((category: TaxonomyItem) => category.taxonomy_status === "ACTIVE")
      .sort((a: TaxonomyItem, b: TaxonomyItem) =>
        a.taxonomy_name.localeCompare(b.taxonomy_name),
      );
    availablePrimaryCategories.value = categories2;
    availableSubcategories.value = categories3;
    syncSelectedCategoriesFromIds(initialProductCategoryIds.value);
  } catch (err) {
    console.error("Error loading available categories:", err);
    availablePrimaryCategories.value = [];
    availableSubcategories.value = [];
  } finally {
    loadingCategories.value = false;
  }
};

const loadBrands = async () => {
  loadingBrands.value = true;
  try {
    const res = await getBrands();
    const brandList = res.data?.data?.brands ?? [];
    const mappedBrands = brandList.map((b: any) => ({
      ...b,
      id: Number(b.id),
    }));

    brands.value = mappedBrands;
  } finally {
    loadingBrands.value = false;
  }
};

const loadAvailableAttributes = async () => {
  loadingAttributes.value = true;
  try {
    const { data, error } = await getActiveAttributes();
    if (error) {
      console.error("Error loading attributes:", error);
      availableAttributes.value = [];
      return;
    }
    availableAttributes.value = data?.data || [];
  } catch (err) {
    console.error("Error loading attributes:", err);
    availableAttributes.value = [];
  } finally {
    loadingAttributes.value = false;
  }
};

const loadProductAttributes = async () => {
  if (!product.value) return;

  loadingAttributes.value = true;

  try {
    const { data, error } = await getProductAttributes(product.value.id);

    if (error || !data?.success) {
      selectedAttributes.value = [];
      return;
    }

    const productAttributes = data.data || [];

    const productAttrMap = new Map();

    productAttributes.forEach((pa: any) => {
      productAttrMap.set(
        Number(pa.attribute_id),
        (pa.attribute_values || [])
          .map((v: any) => Number(v.attribute_value_id))
          .filter(Boolean),
      );
    });

    selectedAttributes.value = availableAttributes.value
      .filter((attr) => productAttrMap.has(attr.id))
      .map((attr) => ({
        attribute_id: attr.id,
        sort: attr.sort || 0,
        values: productAttrMap.get(attr.id) || [],
      }));

    attributesLoaded.value = true;
  } finally {
    loadingAttributes.value = false;
  }
};

const getAttributeName = (attributeId: number) => {
  const attribute = availableAttributes.value.find(
    (attr) => attr.id === attributeId,
  );
  return attribute?.name || `Attribute ${attributeId}`;
};

const getAttributeValuesList = (attributeId: number) => {
  const attribute = availableAttributes.value.find(
    (attr) => attr.id === attributeId,
  );
  if (!attribute) return [];

  const allValues = attribute.attribute_values || [];

  return allValues;
};

const getAttributeValueName = (valueId: number): string => {
  for (const attr of availableAttributes.value) {
    const value = attr.attribute_values?.find((v) => v.id === valueId);
    if (value) {
      return value.value;
    }
  }
  return `Value ${valueId}`;
};

const unselectedAttributes = computed(() => {
  return availableAttributes.value.filter(
    (attr) =>
      !selectedAttributes.value.some((sa) => sa.attribute_id === attr.id),
  );
});

const handleAddAttributeClick = () => {
  attributeModalTab.value = "select";
  resetNewAttributeForm();

  nextTick(() => {
    const modalElement = document.getElementById("addAttributeModal");
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement, {
        backdrop: true,
        keyboard: true,
      });
      modal.show();
    }
  });
};

const resetNewAttributeForm = () => {
  newAttributeForm.value = {
    name: "",
    sort: 0,
  };
  attributeModalTab.value = "select";
};

const selectAttribute = (attributeId: number) => {
  if (selectedAttributes.value.some((sa) => sa.attribute_id === attributeId))
    return;

  const attribute = availableAttributes.value.find((a) => a.id === attributeId);
  if (!attribute) return;

  const defaultValues = (attribute.attribute_values || [])
    .filter((v) => v.status === "ACTIVE")
    .map((v) => v.id);

  selectedAttributes.value.push({
    attribute_id: attributeId,
    sort: selectedAttributes.value.length + 1,
    values: defaultValues,
  });

  const modal = (window as any).bootstrap?.Modal.getInstance(
    document.getElementById("addAttributeModal"),
  );
  modal?.hide();
};

const handleCreateAttribute = async () => {
  if (!newAttributeForm.value.name.trim()) {
    return;
  }

  if (!product.value) {
    toast.error("Product not found");
    return;
  }

  creatingAttribute.value = true;
  try {
    const { data, error } = await createAttribute({
      name: newAttributeForm.value.name.trim(),
      sort: newAttributeForm.value.sort || 0,
      status: "ACTIVE",
    });

    if (error) {
      toast.error(error.message || "Failed to create attribute");
      return;
    }

    if (data?.success && data.data) {
      await loadAvailableAttributes();

      const newAttributeId = data.data.id;
      await selectAttribute(newAttributeId);

      resetNewAttributeForm();
    }
  } catch (err) {
    console.error("Error creating attribute:", err);
    toast.error("Failed to create attribute");
  } finally {
    creatingAttribute.value = false;
  }
};

const removeAttribute = (index: number) => {
  selectedAttributes.value.splice(index, 1);
};

const handleAddAttributeValueClick = async (attributeId: number) => {
  addingValueToAttributeId.value = attributeId;
  resetNewAttributeValueForm();

  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 50));

  const modalElement = document.getElementById("addAttributeValueModal");
  if (!modalElement) {
    console.error("Add Attribute Value modal element not found");
    return;
  }

  if (!(window as any).bootstrap || !(window as any).bootstrap.Modal) {
    console.error("Bootstrap Modal is not available");
    return;
  }

  try {
    let modal = (window as any).bootstrap.Modal.getInstance(modalElement);
    if (!modal) {
      modal = new (window as any).bootstrap.Modal(modalElement, {
        backdrop: true,
        keyboard: true,
      });
    }
    modal.show();
  } catch (error) {
    console.error("Error showing add attribute value modal:", error);
  }
};

const resetNewAttributeValueForm = () => {
  newAttributeValueForm.value = {
    value: "",
    sort: 0,
  };
};

const handleCreateAttributeValue = async () => {
  if (
    !newAttributeValueForm.value.value.trim() ||
    !addingValueToAttributeId.value
  ) {
    return;
  }

  if (!product.value) {
    toast.error("Product not found");
    return;
  }

  creatingAttributeValue.value = true;
  try {
    const { data, error } = await createAttributeValue({
      attribute_id: addingValueToAttributeId.value,
      value: newAttributeValueForm.value.value.trim(),
      sort: newAttributeValueForm.value.sort || 0,
      status: "ACTIVE",
    });

    if (error) {
      toast.error(error.message || "Failed to create attribute value");
      return;
    }

    if (data?.success && data.data) {
      const newValue = data.data;
      const newValueId = newValue.id;

      await loadAvailableAttributes();

      const selectedAttr = selectedAttributes.value.find(
        (sa) => sa.attribute_id === addingValueToAttributeId.value,
      );
      if (selectedAttr && !selectedAttr.values.includes(newValueId)) {
        selectedAttr.values.push(newValueId);

        const { data: saveData, error: saveError } =
          await attachProductAttributes(
            product.value.id,
            selectedAttributes.value,
          );

        if (saveError) {
          toast.error(
            saveError.message || "Failed to save attribute value to product",
          );
          selectedAttr.values = selectedAttr.values.filter(
            (v) => v !== newValueId,
          );
          return;
        }

        if (saveData?.success) {
          await loadProductAttributes();
          toast.success("Attribute value created and added successfully");
        }
      } else if (!selectedAttr) {
        toast.error("Attribute not found in selected attributes");
      }

      const modalElement = document.getElementById("addAttributeValueModal");
      if (modalElement) {
        const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
        modal?.hide();
      }

      resetNewAttributeValueForm();
    }
  } catch (err) {
    console.error("Error creating attribute value:", err);
    toast.error("Failed to create attribute value");
  } finally {
    creatingAttributeValue.value = false;
  }
};

const hasCategorySelection = computed(() => {
  return !!(selectedPrimaryCategoryId.value && selectedSubcategoryId.value);
});

const goToStep = async (step: number) => {
  if (!canAccessStep(step)) return;

  currentStep.value = step;

  try {
    if (
      step === 4 &&
      product.value &&
      !imagesLoaded.value &&
      !loadingImages.value
    ) {
      await loadImages();
      imagesLoaded.value = true;
    }

    if (
      step === 5 &&
      product.value &&
      !attributesLoaded.value &&
      !loadingAttributes.value
    ) {
      await loadAvailableAttributes();
      await loadProductAttributes();
    }

    if (
      step === 6 &&
      product.value &&
      !variantsLoaded.value &&
      !loadingVariants.value
    ) {
      await loadVariants();
      variantsLoaded.value = true;
    }

  } catch (err) {
    console.error("Error loading step data:", err);
  }
};

const canAccessStep = (step: number) => {
  if (step === 1) return true;
  if (step === 2) {
    return !!selectedPrimaryCategoryId.value;
  }
  if (step === 3) {
    return hasCategorySelection.value;
  }
  if (step > 3) {
    return !!(
      hasCategorySelection.value &&
      productForm.value.name &&
      productForm.value.slug
    );
  }
  return false;
};

const nextStep = () => {
  if (currentStep.value < steps.length && canProceedToNextStep.value) {
    goToStep(currentStep.value + 1);
  }
};

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const canProceedToNextStep = computed(() => {
  if (currentStep.value === 1) {
    return !!selectedPrimaryCategoryId.value;
  }
  if (currentStep.value === 2) {
    return !!selectedSubcategoryId.value;
  }
  if (currentStep.value === 3) {
    return productForm.value.name && productForm.value.slug;
  }
  return true;
});

const canUpdateProduct = computed(() => {
  return (
    hasCategorySelection.value &&
    productForm.value.name &&
    productForm.value.slug
  );
});

const handleSetFeatured = async (imageId: number) => {
  settingFeaturedId.value = imageId;
  try {
    const { setFeaturedImage } = useProductRelationsApi();
    const { data, error } = await setFeaturedImage(imageId);

    if (error || !data?.success) {
      toast.error(error?.message || "Gagal mengatur featured image");
      return;
    }

    toast.success("Featured image berhasil diatur");
    await loadImages();
  } catch (err) {
    console.error("Error setting featured image:", err);
    toast.error("Terjadi kesalahan saat mengatur featured image");
  } finally {
    settingFeaturedId.value = null;
  }
};

const isExistingProductImage = (image: any) => Boolean(image?.id && !image?.file);

const handleSetFeaturedFromUpload = async (image: any) => {
  if (!isExistingProductImage(image)) return;
  await handleSetFeatured(image.id);
};

const handleRemoveImageFromUpload = async (image: any) => {
  if (isExistingProductImage(image)) {
    await handleDeleteClick(image);
    return;
  }

  pendingImages.value = pendingImages.value.filter(
    (pendingImage) =>
      !(
        pendingImage.file.name === image?.file?.name &&
        pendingImage.file.size === image?.file?.size &&
        pendingImage.file.lastModified === image?.file?.lastModified
      ),
  );
};

const handleRemoveFeaturedFromUpload = async (image: any) => {
  if (isExistingProductImage(image)) {
    await handleDeleteClick(image);
    return;
  }
  await handleRemoveImageFromUpload(image);
};

const handleImageChange = ({ images }: { images: any }) => {
  if (images && Array.isArray(images)) {
    const existing = images.filter((img) => img.path && !img.file);
    const pending = images.filter((img) => img.file);

    existingImages.value = existing.map((img, index) => ({
      id: img.id,
      path: img.path,
      order_number: index + 1,
      is_featured: index === 0,
    }));
    pendingImages.value = pending.map((img, index) => ({
      file: img.file,
      preview: img.preview,
      is_featured: existing.length === 0 && index === 0,
      name: img.name,
    }));
  }
};

const handleDeleteClick = async (image: {
  id: number;
  path: string;
  order_number: number;
}) => {
  imageToDelete.value = image;
  await nextTick();
  const modal = new (window as any).bootstrap.Modal(
    document.getElementById("deleteImageModal"),
  );
  modal.show();
};

const handleConfirmDeleteImage = async () => {
  if (!imageToDelete.value) return;
  deletingImageId.value = imageToDelete.value.id;
  try {
    const { data, error } = await deleteProductImage(imageToDelete.value.id);
    if (error) {
      toast.error(error.message || "Failed to delete image");
      return;
    }
    if (data?.success) {
      const modal = (window as any).bootstrap.Modal.getInstance(
        document.getElementById("deleteImageModal"),
      );
      modal?.hide();
      imageToDelete.value = null;
      await loadImages();
      toast.success("Image deleted successfully");
    }
  } catch (err) {
    toast.error(err instanceof Error ? err.message : "Failed to delete image");
  } finally {
    deletingImageId.value = null;
  }
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = "/assets/img/products/placeholder.png";
};

const handleAddVariantClick = async () => {
  editingVariantIndex.value = null;
  variantForm.value = {
    selectedAttributeValues: {},
    attribute_value_ids: [],
    variant_name: "",
    sku: "",
    price: productForm.value.base_price || 0,
    strike_price: null,
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
    image_file: null,
    image_preview: null,
    image_path: null,
    weight: null,
    type_weight: "GRAM",
  };
  variantStoreStocks.value = [];

  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 50));

  const modalElement = document.getElementById("variantModal");
  if (!modalElement) {
    console.error("Variant modal element not found");
    return;
  }

  if (!(window as any).bootstrap || !(window as any).bootstrap.Modal) {
    console.error("Bootstrap Modal is not available");
    return;
  }

  try {
    let modal = (window as any).bootstrap.Modal.getInstance(modalElement);
    if (!modal) {
      modal = new (window as any).bootstrap.Modal(modalElement, {
        backdrop: true,
        keyboard: true,
      });
    }
    modal.show();
  } catch (error) {
    console.error("Error showing variant modal:", error);
  }
};

const updateVariantName = () => {
  const variantNameParts: string[] = [];
  const selectedValueIds: number[] = [];

  const currentEditingVariant =
    editingVariantIndex.value !== null
      ? variants.value[editingVariantIndex.value]
      : undefined;
  const editingVariantValueIds = currentEditingVariant?.attribute_value_ids || [];

  selectedAttributes.value.forEach((selectedAttr) => {
    const selectedValueId =
      variantForm.value.selectedAttributeValues[selectedAttr.attribute_id];
    if (selectedValueId) {
      const isInStep3Values = selectedAttr.values.includes(selectedValueId);
      const isFromEditingVariant =
        editingVariantValueIds.includes(selectedValueId);

      if (isInStep3Values || isFromEditingVariant) {
        selectedValueIds.push(selectedValueId);
        const value = getAttributeValuesList(selectedAttr.attribute_id).find(
          (v) => v.id === selectedValueId,
        );
        if (value) {
          const attrName = getAttributeName(selectedAttr.attribute_id);
          variantNameParts.push(`${attrName}: ${value.value}`);
        }
      } else {
        if (editingVariantIndex.value === null) {
          delete variantForm.value.selectedAttributeValues[
            selectedAttr.attribute_id
          ];
        }
      }
    }
  });

  if (variantNameParts.length === 0) {
    variantForm.value.variant_name = "No Variant";
  } else {
    variantForm.value.variant_name = variantNameParts.join(" - ");
  }
  variantForm.value.attribute_value_ids = selectedValueIds;

  if (editingVariantIndex.value === null) {
    variantForm.value.sku = generateSKU();
  }
};

const generateSKU = () => {
  const productPrefix = product.value?.slug
    ? product.value.slug.replace(/[^a-zA-Z0-9]/g, "-").toUpperCase().substring(0, 6)
    : "SKU";

  const attrValueSlugs: string[] = [];

  const sortedAttrs = [...selectedAttributes.value].sort(
    (a, b) => a.attribute_id - b.attribute_id
  );

  sortedAttrs.forEach((selectedAttr) => {
    const selectedValueId =
      variantForm.value.selectedAttributeValues[selectedAttr.attribute_id];
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
  const baseSku = `${productPrefix}-${attrSuffix}`;

  const existingSKUs = new Set(
    variants.value
      .filter((_, i) => i !== editingVariantIndex.value)
      .map((v) => v.sku)
      .filter(Boolean),
  );
  if (!existingSKUs.has(baseSku)) return baseSku;
  let counter = 2;
  while (existingSKUs.has(`${baseSku}-${counter}`)) counter++;
  return `${baseSku}-${counter}`;
};

const handleSaveVariant = async (variantData: any) => {
  if (!product.value) return;

  variantForm.value = {
    ...variantForm.value,
    ...variantData,
  };
  variantStoreStocks.value = variantData.store_stocks || [];

  await saveVariant();
};

const saveVariant = async () => {
  if (!product.value) return;

  const selectedCount = Object.keys(
    variantForm.value.selectedAttributeValues,
  ).filter(
    (attrId) => variantForm.value.selectedAttributeValues[Number(attrId)],
  ).length;

  // If no attributes are selected, it's a single variant
  const isSingleVariant = selectedCount === 0;

  if (isSingleVariant) {
    // Check if a single variant already exists
    const hasSingleVariant = variants.value.some(v => (v.attribute_value_ids || []).length === 0);
    if (hasSingleVariant && editingVariantIndex.value === null) {
      toast.error("A default variant already exists");
      savingVariant.value = false;
      return;
    }
  } else {
    // Check duplicates for attribute-based variants
    const newAttributeValueIds = [...variantForm.value.attribute_value_ids].sort(
      (a, b) => a - b,
    );

    const isDuplicate = variants.value.some((v, index) => {
      if (
        editingVariantIndex.value !== null &&
        index === editingVariantIndex.value
      ) {
        return false;
      }
      const existingIds = [...(v.attribute_value_ids || [])].sort(
        (a, b) => a - b,
      );
      return (
        existingIds.length === newAttributeValueIds.length &&
        existingIds.every((id, idx) => id === newAttributeValueIds[idx])
      );
    });

    if (isDuplicate) {
      toast.error("A variant with this combination already exists");
      savingVariant.value = false;
      return;
    }
  }

  if (!variantForm.value.price || variantForm.value.price <= 0) {
    toast.error("Price is required and must be greater than 0");
    savingVariant.value = false;
    return;
  }

  savingVariant.value = true;

  const getStringValue = (value: string | undefined | null): string | null => {
    if (!value) return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  };

  let variantImagePath = variantForm.value.image_path || null;
  if (variantForm.value.image_file && product.value) {
    try {
      const { data: imageData, error: imageError } = await uploadVariantImage(
        product.value.id,
        variantForm.value.image_file,
      );
      if (imageData?.data?.path) {
        variantImagePath = imageData.data.path;
      } else if (imageError) {
        console.error("Error uploading variant image:", imageError);
        toast.warning("Failed to upload variant image");
      }
    } catch (err) {
      console.error("Error uploading variant image:", err);
      toast.warning("Failed to upload variant image");
    }
  }

  const variantData: {
    fk_product_id: number;
    variant_name?: string | null;
    attribute_value_ids?: number[];
    sku?: string | null;
    image_path?: string | null;
    price: number;
    strike_price?: number | null;
    status: "ACTIVE" | "INACTIVE";
    weight?: number | null;
    type_weight?: "GRAM" | "KG";
  } = {
    fk_product_id: product.value.id,
    variant_name: getStringValue(variantForm.value.variant_name) || (isSingleVariant ? 'Default Variant' : null),
    attribute_value_ids: isSingleVariant ? [] : (variantForm.value.attribute_value_ids || []),
    sku: getStringValue(variantForm.value.sku),
    image_path: variantImagePath,
    price: variantForm.value.price || 0,
    strike_price: variantForm.value.strike_price || null,
    status: variantForm.value.status || "ACTIVE",
    weight: variantForm.value.weight,
    type_weight: variantForm.value.type_weight,
  };

  try {
    if (editingVariantIndex.value !== null) {
      const variant = variants.value[editingVariantIndex.value];
      if (variant && variant.id) {
        const { data, error } = await updateProductVariant(
          variant.id,
          variantData,
        );
        if (error) {
          variantApiErrors.value = (error as any).errors ?? {};
          toast.error(
            getVariantSaveErrorMessage(
              "update",
              variantForm.value.variant_name,
              error.message,
              variantApiErrors.value,
            ),
          );
          savingVariant.value = false;
          return;
        }
        variantApiErrors.value = {};

        if (variantStoreStocks.value.length > 0) {
          for (const storeStock of variantStoreStocks.value) {
            try {
              await createOrUpdateVariantStoreStock(variant.id, {
                store_id: storeStock.store_id,
                qty: storeStock.qty,
                reserved_qty: storeStock.reserved_qty || 0,
              });
            } catch (err) {
              console.error("Error saving store stock:", err);
              toast.warning(
                `Failed to save store stock for ${storeStock.store?.name || "store"}`,
              );
            }
          }
        }

        await loadVariants();

        toast.success("Variant updated successfully");
      } else {
        toast.error("Variant ID not found");
      }
    } else {
      const { data, error } = await createProductVariant(variantData);
      if (error) {
        variantApiErrors.value = (error as any).errors ?? {};
        toast.error(
          getVariantSaveErrorMessage(
            "create",
            variantForm.value.variant_name,
            error.message,
            variantApiErrors.value,
          ),
        );
        savingVariant.value = false;
        return;
      }
      variantApiErrors.value = {};

      const newVariantId = data?.data?.variant?.id ?? data?.data?.id;
      if (newVariantId) {
        if (variantStoreStocks.value.length > 0) {
          for (const storeStock of variantStoreStocks.value) {
            try {
              await createOrUpdateVariantStoreStock(newVariantId, {
                store_id: storeStock.store_id,
                qty: storeStock.qty,
                reserved_qty: storeStock.reserved_qty || 0,
              });
            } catch (err) {
              console.error("Error saving store stock:", err);
              toast.warning(
                `Failed to save store stock for ${storeStock.store?.name || "store"}`,
              );
            }
          }
        }

        await loadVariants();

        toast.success("Variant created successfully");
      } else {
        toast.error("Failed to get variant ID from response");
      }
    }

    const modalElement = document.getElementById("variantModal");
    if (
      modalElement &&
      (window as any).bootstrap &&
      (window as any).bootstrap.Modal
    ) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }

    handleCancelVariant();
  } catch (err) {
    console.error("Error saving variant:", err);
    toast.error("Failed to save variant");
  } finally {
    savingVariant.value = false;
  }
};


const editVariant = async (index: number) => {
  if (variants.value && variants.value[index]) {
    editingVariantIndex.value = index;
    const variant = variants.value[index];

    if (variant.id) {
      try {
        const { data, error } = await getVariantStoreStocks(variant.id);
        if (!error && data?.success && Array.isArray(data.data)) {
          variantStoreStocks.value = data.data.map((stock: any) => ({
            id: stock.id,
            store_id: stock.store_id,
            qty: stock.qty,
            reserved_qty: stock.reserved_qty || 0,
            store: stock.store,
          }));
        } else {
          variantStoreStocks.value = [];
        }
      } catch (err) {
        console.error("Error loading store stocks:", err);
        variantStoreStocks.value = [];
      }
    } else {
      variantStoreStocks.value = [];
    }

    const selectedAttributeValues: Record<number, number> = {};

    if (
      variant.options &&
      Array.isArray(variant.options) &&
      variant.options.length > 0
    ) {
      variant.options.forEach((opt: any) => {
        if (opt.attribute_id && opt.attribute_value_id) {
          let selectedAttr = selectedAttributes.value.find(
            (sa) => sa.attribute_id === opt.attribute_id,
          );
          if (!selectedAttr) {
            selectedAttributes.value.push({
              attribute_id: opt.attribute_id,
              sort: selectedAttributes.value.length + 1,
              values: [opt.attribute_value_id],
            });
          } else {
            if (!selectedAttr.values.includes(opt.attribute_value_id)) {
              selectedAttr.values.push(opt.attribute_value_id);
            }
          }

          selectedAttributeValues[opt.attribute_id] = opt.attribute_value_id;
        }
      });
    } else {
      variant.attribute_value_ids?.forEach((valueId) => {
        availableAttributes.value.forEach((attr) => {
          const value = attr.attribute_values?.find((v) => v.id === valueId);
          if (value) {
            let selectedAttr = selectedAttributes.value.find(
              (sa) => sa.attribute_id === attr.id,
            );
            if (!selectedAttr) {
              selectedAttributes.value.push({
                attribute_id: attr.id,
                sort: selectedAttributes.value.length + 1,
                values: [valueId],
              });
            } else {
              if (!selectedAttr.values.includes(valueId)) {
                selectedAttr.values.push(valueId);
              }
            }
            selectedAttributeValues[attr.id] = valueId;
          }
        });
      });
    }

    variantForm.value = {
      selectedAttributeValues,
      attribute_value_ids: variant.attribute_value_ids || [],
      variant_name: variant.variant_name || "",
      sku: variant.sku || "",
      price: variant.price || 0,
      strike_price: variant.strike_price || null,
      image_file: null,
      image_preview: variant.image_path || null,
      image_path: variant.image_path || null,
      status: variant.status || "ACTIVE",
      weight: variant.weight || null,
      type_weight: variant.type_weight || "GRAM",
    };

    await nextTick();
    updateVariantName();

    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 50));

    const modalElement = document.getElementById("variantModal");
    if (
      modalElement &&
      (window as any).bootstrap &&
      (window as any).bootstrap.Modal
    ) {
      try {
        let modal = (window as any).bootstrap.Modal.getInstance(modalElement);
        if (!modal) {
          modal = new (window as any).bootstrap.Modal(modalElement);
        }
        modal.show();
      } catch (error) {
        console.error("Error showing variant modal:", error);
      }
    }
  }
};

const handleDeleteVariant = async (
  variantId: number | undefined,
  index: number,
) => {
  if (!variantId) {
    variants.value.splice(index, 1);
    return;
  }

  if (!confirm("Are you sure you want to delete this variant?")) return;
  deletingVariantId.value = variantId;
  try {
    const { data, error } = await deleteProductVariant(variantId);
    if (error) {
      alert(error.message || "Failed to delete variant");
      return;
    }
    if (data?.success) {
      await loadVariants();
    }
  } catch (err) {
    alert(err instanceof Error ? err.message : "Failed to delete variant");
  } finally {
    deletingVariantId.value = null;
  }
};

const handleCancelVariant = () => {
  variantApiErrors.value = {};
  editingVariantIndex.value = null;
  variantForm.value = {
    selectedAttributeValues: {},
    attribute_value_ids: [],
    variant_name: "",
    sku: "",
    price: product.value?.base_price || 0,
    strike_price: product.value?.base_strike_price || null,
    status: "ACTIVE",
    image_file: null,
    image_preview: null,
    image_path: null,
    weight: 0,
    type_weight: "GRAM",
  };
  variantStoreStocks.value = [];
};

const syncSelectedCategoriesFromIds = (categoryIds: number[]) => {
  const ids = categoryIds.map((id) => Number(id)).filter(Boolean);
  const primaryCategory =
    availablePrimaryCategories.value.find((category) => ids.includes(category.id)) ||
    null;

  let subcategory =
    availableSubcategories.value.find((category) => ids.includes(category.id)) ||
    null;

  if (!primaryCategory && subcategory?.parent) {
    const parentCategory = availablePrimaryCategories.value.find(
      (category) => category.id === Number(subcategory?.parent),
    );
    if (parentCategory) {
      selectedPrimaryCategoryId.value = parentCategory.id;
      selectedSubcategoryId.value = subcategory.id;
      return;
    }
  }

  if (primaryCategory && !subcategory) {
    subcategory =
      availableSubcategories.value.find(
        (category) =>
          ids.includes(category.id) &&
          Number(category.parent) === primaryCategory.id,
      ) || null;
  }

  selectedPrimaryCategoryId.value = primaryCategory?.id || null;
  selectedSubcategoryId.value =
    subcategory && (!primaryCategory || Number(subcategory.parent) === primaryCategory.id)
      ? subcategory.id
      : null;
};

const loadStores = async () => {
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

const editStoreStock = async (index: number) => {
  await loadStores();
  const storeStock = variantStoreStocks.value[index];
  if (!storeStock) return;

  editingStoreStockIndex.value = index;
  storeStockForm.value = {
    store_id: storeStock.store_id,
    qty: storeStock.qty,
    reserved_qty: storeStock.reserved_qty || 0,
  };

  await nextTick();
  const formElement = document.querySelector(".card.border-primary");
  if (formElement) {
    formElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
};

const deleteStoreStock = async (index: number) => {
  const storeStock = variantStoreStocks.value[index];
  if (!storeStock) return;

  if (
    editingVariantIndex.value !== null &&
    variants.value[editingVariantIndex.value]?.id &&
    storeStock.id
  ) {
    try {
      const currentVariant = variants.value[editingVariantIndex.value];
      if (!currentVariant?.id) return;
      const variantId = currentVariant.id;
      const { error } = await deleteVariantStoreStock(
        variantId,
        storeStock.store_id,
      );
      if (error) {
        toast.error(error.message || "Failed to delete store stock");
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 100));

      try {
        const { data: stocksData, error: stocksError } =
          await getVariantStoreStocks(variantId);
        if (
          !stocksError &&
          stocksData?.success &&
          Array.isArray(stocksData.data)
        ) {
          const freshStocks = stocksData.data.map(mapStoreStock);

          variantStoreStocks.value.length = 0;
          variantStoreStocks.value.push(...freshStocks);

          if (
            editingVariantIndex.value !== null &&
            variants.value[editingVariantIndex.value]
          ) {
            const currentVariant = variants.value[editingVariantIndex.value];
            if (!currentVariant) return;
            variants.value[editingVariantIndex.value] = {
              ...currentVariant,
              attribute_value_ids: currentVariant.attribute_value_ids ?? [],
              store_stocks: freshStocks,
            };
          }

          await nextTick();
        } else {
          variantStoreStocks.value.splice(index, 1);

          if (
            editingVariantIndex.value !== null &&
            variants.value[editingVariantIndex.value]
          ) {
            const updatedStocks = [...variantStoreStocks.value];
            const currentVariant = variants.value[editingVariantIndex.value];
            if (!currentVariant) return;
            variants.value[editingVariantIndex.value] = {
              ...currentVariant,
              attribute_value_ids: currentVariant.attribute_value_ids ?? [],
              store_stocks: updatedStocks,
            };
          }
        }
      } catch (reloadErr) {
        console.error("Error reloading store stocks after delete:", reloadErr);
        variantStoreStocks.value.splice(index, 1);
      }

      toast.success("Store stock deleted successfully");
    } catch (err) {
      console.error("Error deleting store stock:", err);
      toast.error("Failed to delete store stock");
      return;
    }
  } else {
    variantStoreStocks.value.splice(index, 1);
  }
};

const saveStoreStock = async () => {
  if (!storeStockForm.value.store_id) {
    toast.error("Please select a store");
    return;
  }

  if (storeStockForm.value.qty < 0) {
    toast.error("Stock quantity cannot be negative");
    return;
  }

  if (storeStockForm.value.reserved_qty < 0) {
    toast.error("Reserved quantity cannot be negative");
    return;
  }

  const existingIndex = variantStoreStocks.value.findIndex(
    (stock, idx) =>
      stock.store_id === storeStockForm.value.store_id &&
      idx !== editingStoreStockIndex.value,
  );

  if (existingIndex !== -1) {
    toast.error("This store already has stock assigned");
    return;
  }

  const store = stores.value.find(
    (s) => s.id === storeStockForm.value.store_id,
  );
  if (!store) {
    toast.error("Store not found");
    savingStoreStock.value = false;
    return;
  }

  if (
    editingVariantIndex.value !== null &&
    variants.value[editingVariantIndex.value]?.id
  ) {
    savingStoreStock.value = true;
    try {
      const currentVariant = variants.value[editingVariantIndex.value];
      if (!currentVariant?.id) return;
      const variantId = currentVariant.id;
      const { data, error } = await createOrUpdateVariantStoreStock(variantId, {
        store_id: storeStockForm.value.store_id!,
        qty: storeStockForm.value.qty,
        reserved_qty: storeStockForm.value.reserved_qty,
      });

      if (error) {
        toast.error(error.message || "Failed to save store stock");
        savingStoreStock.value = false;
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 100));

      try {
        const { data: stocksData, error: stocksError } =
          await getVariantStoreStocks(variantId);
        if (
          !stocksError &&
          stocksData?.success &&
          Array.isArray(stocksData.data)
        ) {
          const freshStocks = stocksData.data.map(mapStoreStock);

          variantStoreStocks.value.length = 0;
          variantStoreStocks.value.push(...freshStocks);

          if (
            editingVariantIndex.value !== null &&
            variants.value[editingVariantIndex.value]
          ) {
            const currentVariant = variants.value[editingVariantIndex.value];
            if (!currentVariant) return;
            variants.value[editingVariantIndex.value] = {
              ...currentVariant,
              attribute_value_ids: currentVariant.attribute_value_ids ?? [],
              store_stocks: freshStocks,
            };
          }

          await nextTick();

          toast.success(
            editingStoreStockIndex.value !== null
              ? "Store stock updated successfully"
              : "Store stock added successfully",
          );
        } else {
          updateLocalStoreStockState(data?.data, store);
          await nextTick();
          toast.success(
            editingStoreStockIndex.value !== null
              ? "Store stock updated successfully"
              : "Store stock added successfully",
          );
        }
      } catch (reloadErr) {
        console.error("Error reloading store stocks:", reloadErr);
        updateLocalStoreStockState(data?.data, store);
        await nextTick();
        toast.success(
          editingStoreStockIndex.value !== null
            ? "Store stock updated successfully"
            : "Store stock added successfully",
        );
      }

      resetStoreStockForm();
    } catch (err) {
      console.error("Error saving store stock:", err);
      toast.error("Failed to save store stock");
      savingStoreStock.value = false;
      return;
    } finally {
      savingStoreStock.value = false;
    }
  } else {
    if (editingStoreStockIndex.value !== null) {
      variantStoreStocks.value[editingStoreStockIndex.value] = {
        ...variantStoreStocks.value[editingStoreStockIndex.value],
        store_id: storeStockForm.value.store_id!,
        qty: storeStockForm.value.qty,
        reserved_qty: storeStockForm.value.reserved_qty,
        store: store,
      };
    } else {
      variantStoreStocks.value.push({
        store_id: storeStockForm.value.store_id!,
        qty: storeStockForm.value.qty,
        reserved_qty: storeStockForm.value.reserved_qty,
        store: store,
      });
    }

    resetStoreStockForm();
  }
};

const resetStoreStockForm = () => {
  storeStockForm.value = {
    store_id: null,
    qty: 0,
    reserved_qty: 0,
  };
  editingStoreStockIndex.value = null;
};

const mapStoreStock = (stock: any) => ({
  id: stock.id,
  store_id: stock.store_id,
  qty: stock.qty,
  reserved_qty: stock.reserved_qty || 0,
  store: stock.store,
});

const updateLocalStoreStockState = (responseData: any, store: any) => {
  const stockData = {
    id: responseData?.id,
    store_id: storeStockForm.value.store_id!,
    qty: storeStockForm.value.qty,
    reserved_qty: storeStockForm.value.reserved_qty,
    store: responseData?.store || store,
  };

  if (editingStoreStockIndex.value !== null) {
    variantStoreStocks.value[editingStoreStockIndex.value] = {
      ...variantStoreStocks.value[editingStoreStockIndex.value],
      ...stockData,
    };
  } else {
    variantStoreStocks.value.push(stockData);
  }
};

const filteredPrimaryCategories = computed(() => {
  if (!categorySearchQuery.value.trim()) {
    return availablePrimaryCategories.value;
  }
  const query = categorySearchQuery.value.toLowerCase();
  return availablePrimaryCategories.value.filter(
    (cat) =>
      cat.taxonomy_name?.toLowerCase().includes(query) ||
      cat.taxonomy_description?.toLowerCase().includes(query),
  );
});

const filteredSubcategories = computed(() => {
  if (!selectedPrimaryCategoryId.value) {
    return [];
  }

  const subcategories = availableSubcategories.value.filter(
    (category) => Number(category.parent) === selectedPrimaryCategoryId.value,
  );
  if (!subcategorySearchQuery.value.trim()) {
    return subcategories;
  }

  const query = subcategorySearchQuery.value.toLowerCase();
  return subcategories.filter(
    (cat) =>
      cat.taxonomy_name?.toLowerCase().includes(query) ||
      cat.taxonomy_description?.toLowerCase().includes(query),
  );
});

const selectedPrimaryCategory = computed(() => {
  return (
    availablePrimaryCategories.value.find(
      (category) => category.id === selectedPrimaryCategoryId.value,
    ) || null
  );
});

const selectedSubcategory = computed(() => {
  return (
    availableSubcategories.value.find(
      (category) => category.id === selectedSubcategoryId.value,
    ) || null
  );
});

const selectedCategoryIds = computed(() => {
  return [
    selectedPrimaryCategoryId.value,
    selectedSubcategoryId.value,
  ].filter((id): id is number => typeof id === "number");
});

const selectPrimaryCategory = (categoryId: number) => {
  if (selectedPrimaryCategoryId.value === categoryId) {
    return;
  }

  selectedPrimaryCategoryId.value = categoryId;
  selectedSubcategoryId.value = null;
  subcategorySearchQuery.value = "";
};

const selectSubcategory = (categoryId: number) => {
  selectedSubcategoryId.value = categoryId;
};

watch(selectedPrimaryCategoryId, (categoryId) => {
  if (!categoryId) {
    selectedSubcategoryId.value = null;
    return;
  }

  if (
    selectedSubcategoryId.value &&
    !availableSubcategories.value.some(
      (category) =>
        category.id === selectedSubcategoryId.value &&
        Number(category.parent) === categoryId,
    )
  ) {
    selectedSubcategoryId.value = null;
  }
});

watch(
  () => newCategoryForm.value.taxonomy_type,
  (taxonomyType) => {
    if (taxonomyType === 2) {
      newCategoryForm.value.parent = null;
      return;
    }

    if (!newCategoryForm.value.parent && selectedPrimaryCategoryId.value) {
      newCategoryForm.value.parent = selectedPrimaryCategoryId.value;
    }
  },
);

const resetNewCategoryForm = () => {
  newCategoryForm.value = {
    parent: null,
    taxonomy_name: "",
    taxonomy_slug: "",
    taxonomy_description: "",
    taxonomy_type: 2,
    taxonomy_status: "ACTIVE",
  };
};

const generateCategorySlug = () => {
  if (!newCategoryForm.value.taxonomy_name) return;
  newCategoryForm.value.taxonomy_slug = newCategoryForm.value.taxonomy_name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const handleCreateCategory = async () => {
  if (!newCategoryForm.value.taxonomy_name.trim()) {
    toast.error("Category name is required");
    return;
  }

  if (newCategoryForm.value.taxonomy_type === 3 && !newCategoryForm.value.parent) {
    toast.error("Parent jenis barang harus dipilih untuk sub kategori");
    return;
  }

  creatingCategory.value = true;
  try {
    const { data, error } = await createTaxoList({
      parent:
        newCategoryForm.value.taxonomy_type === 3
          ? newCategoryForm.value.parent
          : null,
      taxonomy_name: newCategoryForm.value.taxonomy_name.trim(),
      taxonomy_slug: newCategoryForm.value.taxonomy_slug.trim() || undefined,
      taxonomy_description:
        newCategoryForm.value.taxonomy_description.trim() || undefined,
      taxonomy_type: newCategoryForm.value.taxonomy_type,
      taxonomy_status: newCategoryForm.value.taxonomy_status,
    });

    if (error) {
      toast.error(error.message || "Failed to create category");
      return;
    }

    if (data?.success && data.data) {
      await loadAvailableCategories();

      const newCategoryId = data.data.id;
      if (data.data.taxonomy_type === 2) {
        selectedPrimaryCategoryId.value = newCategoryId;
        selectedSubcategoryId.value = null;
      } else {
        selectedPrimaryCategoryId.value = data.data.parent || selectedPrimaryCategoryId.value;
        selectedSubcategoryId.value = newCategoryId;
      }

      const modalElement = document.getElementById("addCategoryModal");
      if (modalElement) {
        const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
        modal?.hide();
      }

      resetNewCategoryForm();
      toast.success("Category created and added successfully");
    }
  } catch (err) {
    console.error("Error creating category:", err);
    toast.error("Failed to create category");
  } finally {
    creatingCategory.value = false;
  }
};

const editCategoryFormData = ref<any>({
  id: null,
  parent: null,
  taxonomy_type: 2,
  taxonomy_name: "",
  taxonomy_slug: "",
  original_slug: "",
  taxonomy_description: "",
  taxonomy_status: "ACTIVE",
});
const editingCategoryInStep = ref(false);
const categoryToDeleteInStep = ref<any>(null);
const deletingCategoryInStep = ref(false);

const openCreateCategoryModal = (type: "primary" | "sub") => {
  resetNewCategoryForm();
  newCategoryForm.value.taxonomy_type = type === "primary" ? 2 : 3;
  newCategoryForm.value.parent =
    type === "sub" ? selectedPrimaryCategoryId.value : null;
  nextTick(() => {
    const modalEl = document.getElementById("addCategoryModal");
    if (modalEl) {
      const modal = (window as any).bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.show();
    }
  });
};

const generateEditCategorySlug = () => {
  if (!editCategoryFormData.value.taxonomy_name) return;
  editCategoryFormData.value.taxonomy_slug = editCategoryFormData.value.taxonomy_name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const openEditCategoryModalInStep = async (category: any) => {
  editCategoryFormData.value = {
    id: category.id,
    parent: category.parent ?? null,
    taxonomy_type: category.taxonomy_type ?? 2,
    taxonomy_name: category.taxonomy_name,
    taxonomy_slug: category.taxonomy_slug,
    original_slug: category.taxonomy_slug,
    taxonomy_description: category.taxonomy_description || "",
    taxonomy_status: category.taxonomy_status || "ACTIVE",
  };
  await nextTick();
  const modalEl = document.getElementById("editCategoryInStepModal");
  if (modalEl) {
    const modal = (window as any).bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  }
};

const handleEditCategoryInStep = async () => {
  editingCategoryInStep.value = true;
  try {
    const payload: any = {
      taxonomy_name: editCategoryFormData.value.taxonomy_name,
      taxonomy_slug: editCategoryFormData.value.taxonomy_slug,
      taxonomy_status: editCategoryFormData.value.taxonomy_status,
      taxonomy_description: editCategoryFormData.value.taxonomy_description,
    };
    if (
      editCategoryFormData.value.taxonomy_slug &&
      editCategoryFormData.value.taxonomy_slug !== editCategoryFormData.value.original_slug
    ) {
      payload.taxonomy_slug = editCategoryFormData.value.taxonomy_slug;
    } else {
      payload.taxonomy_slug = editCategoryFormData.value.taxonomy_name;
    }
    const { data, error } = await updateTaxoList(editCategoryFormData.value.id, payload);
    if (error) {
      toast.error(error.message || "Failed to update category");
      return;
    }
    toast.success("Category updated successfully");
    const modalEl = document.getElementById("editCategoryInStepModal");
    if (modalEl) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
      modal?.hide();
    }
    await loadAvailableCategories();
  } catch (err) {
    toast.error("Error updating category");
  } finally {
    editingCategoryInStep.value = false;
  }
};

const openDeleteCategoryModalInStep = async (category: any) => {
  categoryToDeleteInStep.value = category;
  await nextTick();
  const modalEl = document.getElementById("deleteCategoryInStepModal");
  if (modalEl) {
    const modal = (window as any).bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  }
};

const handleDeleteCategoryInStep = async () => {
  if (!categoryToDeleteInStep.value?.id) return;
  deletingCategoryInStep.value = true;
  try {
    const { data, error } = await deleteTaxoList(categoryToDeleteInStep.value.id);
    if (error) {
      toast.error(error.message || "Failed to delete category");
      return;
    }
    toast.success("Category deleted successfully");
    const modalEl = document.getElementById("deleteCategoryInStepModal");
    if (modalEl) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
      modal?.hide();
    }
    if (selectedPrimaryCategoryId.value === categoryToDeleteInStep.value.id) {
      selectedPrimaryCategoryId.value = null;
      selectedSubcategoryId.value = null;
    }
    if (selectedSubcategoryId.value === categoryToDeleteInStep.value.id) {
      selectedSubcategoryId.value = null;
    }
    categoryToDeleteInStep.value = null;
    await loadAvailableCategories();
  } catch (err) {
    toast.error("Error deleting category");
  } finally {
    deletingCategoryInStep.value = false;
  }
};

const resetNewBrandForm = () => {
  newBrand.value.name = "";
  newBrand.value.description = "";

  showBrandModal.value = false;
  const modalEl = document.getElementById("createBrandModal");
  if (modalEl) {
    const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
    modal?.hide();
  }
};

const resetInputField = () => {
  newBrand.value.name = "";
  newBrand.value.description = "";
};

const getBrandName = (brandId: number) => {
  const brand = brands.value.find((b: any) => Number(b.id) === brandId);
  return brand?.name || `Brand ${brandId}`;
};

const filteredBrands = computed(() => {
  if (!brandSearchQuery.value.trim()) {
    return brands.value;
  }

  const q = brandSearchQuery.value.toLowerCase();
  return brands.value.filter((b: any) => b.name?.toLowerCase().includes(q));
});

const getProductSaveErrorMessage = (message?: string) => {
  if (!message) return "Terjadi kesalahan saat update product";

  if (
    message.includes("base_discount_percent") ||
    message.includes("Numeric value out of range") ||
    message.includes("SQLSTATE[22003]")
  ) {
    return "Invalid discount price. Make sure the original price is higher than the selling price so the discount stays between 0% and 100%.";
  }

  if (message.includes("SQLSTATE[")) {
    return "Terjadi kesalahan saat menyimpan produk. Silakan cek kembali data harga dan diskon.";
  }

  return message;
};

const formatApiValidationErrors = (errors?: Record<string, string[] | string>) => {
  if (!errors || Object.keys(errors).length === 0) return "";

  return Object.entries(errors)
    .map(([field, messages]) => {
      const text = Array.isArray(messages) ? messages.join(", ") : messages;
      return `${field}: ${text}`;
    })
    .join(" | ");
};

const getVariantSaveErrorMessage = (
  action: "create" | "update",
  variantName: string | null | undefined,
  message?: string,
  errors?: Record<string, string[] | string>,
) => {
  const name = variantName || "Unnamed Variant";
  const validationDetails = formatApiValidationErrors(errors);
  const baseMessage = message || "Backend did not return a message";
  const actionLabel = action === "create" ? "create" : "update";

  return validationDetails
    ? `Failed to ${actionLabel} variant "${name}": ${baseMessage}. Detail: ${validationDetails}`
    : `Failed to ${actionLabel} variant "${name}": ${baseMessage}`;
};

const removeBrand = (brandId: number) => {
  selectedBrandIds.value = selectedBrandIds.value.filter(
    (id) => id !== brandId,
  );
};

const handleAddBrandClick = () => {
  showBrandModal.value = true;
};

const handleCreateBrand = async () => {
  if (!product.value || !newBrand.value.name.trim()) return;

  creatingBrand.value = true;
  try {
    const { data, error } = await createBrand({
      name: newBrand.value.name.trim(),
      description: newBrand.value.description,
      status: "ACTIVE",
    });

    if (error || !data?.success) {
      toast.error("Failed to create brand");
      return;
    }
    await loadBrands();

    resetNewBrandForm();

    toast.success("Brand created");
  } finally {
    creatingBrand.value = false;
  }
};

const handleUpdateProduct = async () => {
  if (!product.value) {
    console.warn("Product tidak ada");
    return;
  }

  isLoading.value = true;
  productFormErrors.value = {};

  console.group("🛠 handleUpdateProduct");

  try {
    const { data: updateData, error: updateError } = await updateProduct(
      product.value.id,
      productForm.value,
    );

    if (updateError || !updateData?.success) {
      productFormErrors.value = updateError?.errors || {};
      toast.error(getProductSaveErrorMessage(updateError?.message));
      return;
    }
    const pendingUploads = getPendingUploads();

    if (pendingUploads.length > 0) {
      uploadingImages.value = true;

      try {
        const uploadErrors: string[] = [];

        for (let i = 0; i < pendingUploads.length; i++) {
          const img = pendingUploads[i];
          if (!img) {
            continue;
          }

          const { data: uploadedImage, error: uploadError } =
            await uploadProductImage(
            product.value.id,
            img.file,
            (existingImages.value?.length || 0) + i + 1,
            Boolean(img.is_featured),
          );

          if (uploadError || !uploadedImage?.success) {
            const errorMsg =
              uploadError?.message || `Failed to upload image ${i + 1}`;
            console.error(`Error uploading image ${i + 1}:`, uploadError);
            uploadErrors.push(errorMsg);
          }
        }

        if (uploadErrors.length > 0) {
          toast.warning(`Beberapa gambar gagal diupload: ${uploadErrors.join(", ")}`);
        } else {
          pendingImages.value = [];
          await loadImages();
        }
      } catch (err) {
        console.warn("Upload image gagal", err);
        toast.warning("Beberapa gambar gagal diupload");
      } finally {
        uploadingImages.value = false;
      }
    }
    try {
      const { data: current } = await getProductAttributes(product.value.id);

      const currentMap = new Map(
        (current?.data || []).map((a) => [a.attribute_id, a]),
      );

      const toDetach = Array.from(currentMap.keys()).filter(
        (id) =>
          !selectedAttributes.value.some(
            (sa) => sa.attribute_id === Number(id),
          ),
      );

      if (toDetach.length > 0) {
        const productId = product.value.id;
        await Promise.all(
          toDetach.map((id) =>
            detachProductAttributes(productId, Number(id)),
          ),
        );
      }

      if (selectedAttributes.value.length > 0) {
        await attachProductAttributes(
          product.value.id,
          selectedAttributes.value,
        );
      }

      await loadProductAttributes();
    } catch (err) {
      console.warn("Sync attributes gagal", err);
    }

    try {
      const { data: currentCats } = await getProductCategories(
        product.value.id,
      );

      const currentCatIds = new Set(
        (currentCats?.data?.categories || []).map((c) => c.fk_category_id),
      );

      const toAddCats = selectedCategoryIds.value.filter(
        (id) => !currentCatIds.has(id),
      );

      const toRemoveCats = Array.from(currentCatIds).filter(
        (id) => !selectedCategoryIds.value.includes(id),
      );

      if (toAddCats.length > 0) {
        await attachProductCategories(product.value.id, toAddCats);
      }

      if (toRemoveCats.length > 0) {
        await detachProductCategories(product.value.id, toRemoveCats);
      }
    } catch (err) {
      console.warn("Sync categories gagal", err);
    }

    try {
      const { data: currentBrands } = await getProductBrands(product.value.id);

      const currentBrandIds = new Set(
        (currentBrands?.data?.brands || []).map((b: any) =>
          Number(b.fk_brand_id),
        ),
      );

      const toAddBrands = selectedBrandIds.value.filter(
        (id) => !currentBrandIds.has(id),
      );

      const toRemoveBrands = Array.from(currentBrandIds).filter(
        (id): id is number => typeof id === "number" && !selectedBrandIds.value.includes(id),
      );

      if (toAddBrands.length > 0) {
        await attachProductBrands(product.value.id, toAddBrands);
      }

      if (toRemoveBrands.length > 0) {
        await detachProductBrands(product.value.id, toRemoveBrands);
      }
    } catch (err) {
      console.warn("Sync brands gagal", err);
    }

    try {
      const { data: dbVariantsData } = await getProductVariants(
        product.value.id,
      );

      const dbVariants = dbVariantsData?.data?.variants || [];

      const localVariantIds = new Set(
        variants.value
          .map((v) => v.id)
          .filter((id): id is number => typeof id === "number"),
      );

      const toDelete = dbVariants.filter((v: any) => !localVariantIds.has(v.id));

      for (const v of toDelete) {
        await deleteProductVariant(v.id);
      }

      for (const variant of variants.value) {
        const updatePayload = {
          variant_name: variant.variant_name,
          attribute_value_ids: variant.attribute_value_ids || [],
          sku: variant.sku,
          price: variant.price,
          strike_price: variant.strike_price,
          status: variant.status,
          weight: variant.weight || null,
          type_weight: variant.type_weight || "GRAM",
        };

        let variantId = variant.id;

        if (variantId) {
          const { error: updateVariantError } = await updateProductVariant(
            variantId,
            updatePayload,
          );

          if (updateVariantError) {
            const message = getVariantSaveErrorMessage(
              "update",
              variant.variant_name,
              updateVariantError.message,
              updateVariantError.errors,
            );
            console.error("Error updating product variant:", {
              variant: variant.variant_name,
              variantId,
              payload: updatePayload,
              error: updateVariantError,
            });
            toast.error(message);
            continue;
          }
        } else {
          const createPayload = {
            fk_product_id: product.value.id,
            ...updatePayload,
          };
          const { data: newV, error: createVariantError } =
            await createProductVariant(createPayload);

          if (createVariantError || !newV?.success) {
            const message = getVariantSaveErrorMessage(
              "create",
              variant.variant_name,
              createVariantError?.message || (newV as any)?.message,
              createVariantError?.errors,
            );
            console.error("Error creating product variant:", {
              variant: variant.variant_name,
              payload: createPayload,
              error: createVariantError,
              response: newV,
            });
            toast.error(message);
            continue;
          }

          variantId = newV?.data?.variant?.id;
          variant.id = variantId;
        }

        if (variant.store_stocks?.length && variantId) {
          for (const stock of variant.store_stocks) {
            await createOrUpdateVariantStoreStock(variantId, {
              store_id: stock.store_id,
              qty: stock.qty,
              reserved_qty: stock.reserved_qty || 0,
            });
          }
        }
      }

      await loadVariants();
    } catch (err) {
      console.warn("Sync variants gagal", err);
    }

    toast.success("Produk berhasil diperbarui");
    router.push(`/manage-product/${productForm.value.slug}`);
  } catch (err) {
    console.error("Update product gagal", err);
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Terjadi kesalahan saat update product";
    toast.error(getProductSaveErrorMessage(errorMessage));
  } finally {
    isLoading.value = false;
    console.groupEnd();
  }
};

const generateSlugFromName = () => {
  if (!productForm.value.name) return;
  productForm.value.slug = generateSlug(productForm.value.name);
  productForm.value.meta_title = `Buy ${productForm.value.name}`;
  productForm.value.meta_description = `Shop ${productForm.value.name} at the best price. High quality product with fast shipping and secure payment. Order now!`;
};

const getVariantTotalStock = (variant: any) => {
  if (variant.stock !== undefined && variant.stock !== null) {
    return formatNumber(variant.stock);
  }

  const stockRelations =
    variant.stock_relations ||
    variant.stockRelations ||
    variant.store_stocks ||
    [];

  if (!Array.isArray(stockRelations) || stockRelations.length === 0) {
    return formatNumber(0);
  }

  const totalStock = stockRelations.reduce((sum: number, stock: any) => {
    const qty = stock.qty || 0;
    const reservedQty = stock.reserved_qty || 0;
    const availableQty = Math.max(0, qty - reservedQty);
    return sum + availableQty;
  }, 0);

  return formatNumber(totalStock);
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("id-ID").format(num);
};

useAppTitle(computed(() =>
  product.value ? `Edit ${product.value.name}` : "Edit Product",
));

onMounted(async () => {
  await loadProduct();
  await Promise.all([
    loadVariants(),
    loadAvailableAttributes(),
    loadProductAttributes(),
    loadAvailableCategories(),
    loadProductCategories(),
    loadBrands(),
  ]);
});
</script>

<style scoped>
.nav-tabs .nav-link {
  border: none;
  border-bottom: 2px solid transparent;
  color: #4f5b66;
  cursor: pointer;
}

.nav-tabs .nav-link:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-tabs .nav-link.active {
  border-bottom-color: #000;
  color: #000;
  font-weight: 500;
}

.edit-product-page :deep(.text-muted),
:deep(.text-muted) {
  color: #4f5b66 !important;
}

.category-flow {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-panel {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.04);
  transition:
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.category-panel:hover {
  border-color: #d0d7de;
  box-shadow: 0 0.35rem 0.8rem rgba(0, 0, 0, 0.06);
}

.category-selection-list {
  max-height: 26rem;
  overflow-y: auto;
}

.category-selection-list .list-group-item {
  color: #000;
  border-color: #dee2e6;
}

.category-selection-list .list-group-item.active {
  background: #000;
  border-color: #000;
  color: #fff;
}

.category-selection-list .list-group-item.active .text-muted,
.category-selection-list .list-group-item.active small,
.category-selection-list .list-group-item.active .fw-semibold,
.category-selection-list .list-group-item.active strong {
  color: #fff !important;
}

.category-selected-pill,
.category-count-pill {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  font-size: 0.75rem;
  line-height: 1;
  white-space: nowrap;
}

.category-count-pill {
  padding: 0.2rem 0.45rem;
  color: #4f5b66;
  background: #f3f4f6;
}

:deep(.badge) {
  font-weight: 600;
}

:deep(.badge.bg-secondary) {
  background-color: #e5e7eb !important;
  color: #374151 !important;
}

:deep(.badge.bg-success) {
  background-color: #dff3e7 !important;
  color: #166534 !important;
}

:deep(.badge.bg-primary) {
  background-color: #dbeafe !important;
  color: #1d4ed8 !important;
}

:deep(.alert-light) {
  background-color: #f3f4f6 !important;
  color: #374151 !important;
}

.category-summary {
  background: #f8fbff;
  border-color: #d8e8ff !important;
}

.category-flow-step {
  display: inline-flex;
  align-items: center;
  color: #4f5b66;
  font-size: 0.875rem;
  font-weight: 600;
  flex-shrink: 0;
}

.basic-info-step {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.seo-meta-panel {
  background: #fafafa;
  border-color: #e9ecef !important;
}

.seo-meta-item {
  background: #ffffff;
}

.btn-outline-secondary,
.outline-dark-btn {
  --bs-btn-color: #000;
  --bs-btn-border-color: #000;
  --bs-btn-hover-color: #000;
  --bs-btn-hover-bg: rgba(0, 0, 0, 0.08);
  --bs-btn-hover-border-color: #000;
  --bs-btn-focus-shadow-rgb: 33, 37, 41;
  --bs-btn-active-color: #000;
  --bs-btn-active-bg: rgba(0, 0, 0, 0.12);
  --bs-btn-active-border-color: #000;
  --bs-btn-disabled-color: #4b4b4b;
  --bs-btn-disabled-border-color: #4b4b4b;
}

.btn-outline-primary {
  --bs-btn-color: #b7791f;
  --bs-btn-border-color: rgba(212, 160, 23, 0.72);
  --bs-btn-bg: rgba(212, 160, 23, 0.03);
  --bs-btn-hover-color: #b7791f;
  --bs-btn-hover-bg: rgba(212, 160, 23, 0.1);
  --bs-btn-hover-border-color: rgba(212, 160, 23, 0.78);
  --bs-btn-focus-shadow-rgb: 212, 160, 23;
  --bs-btn-active-color: #b7791f;
  --bs-btn-active-bg: rgba(198, 146, 20, 0.12);
  --bs-btn-active-border-color: rgba(198, 146, 20, 0.8);
  --bs-btn-disabled-color: #c8a96a;
  --bs-btn-disabled-border-color: #e6d3a1;
}

.back-nav-btn {
  --bs-btn-color: #1f2937;
  --bs-btn-bg: #eef2f7;
  --bs-btn-border-color: #d6dee8;
  --bs-btn-hover-color: #111827;
  --bs-btn-hover-bg: #e2e8f0;
  --bs-btn-hover-border-color: #cbd5e1;
  --bs-btn-focus-shadow-rgb: 148, 163, 184;
  --bs-btn-active-color: #111827;
  --bs-btn-active-bg: #dbe4ee;
  --bs-btn-active-border-color: #cbd5e1;
}

.attribute-value-option,
.attribute-value-option .form-check-input,
.attribute-value-option .form-check-label {
  cursor: pointer;
}

.attribute-value-option.is-disabled,
.attribute-value-option.is-disabled .form-check-input,
.attribute-value-option.is-disabled .form-check-label {
  cursor: not-allowed;
}
</style>