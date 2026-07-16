<template>
  <div class="create-product-page">
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="mb-0">Create New Product</h4>
      </div>
      <NuxtLink to="/manage-product" class="btn btn-primary action-btn-dark">
        <i class="bi bi-arrow-left me-2"></i>Back to List
      </NuxtLink>
    </div>

    <!-- Progress Steps -->
    <div class="card mb-4">
      <div class="card-body">
        <ul class="nav nav-tabs mb-3" id="productStepsTabs" role="tablist">
          <li class="nav-item" role="presentation" v-for="step in steps" :key="step.key">
            <button class="nav-link" :class="{ active: currentStep === step.key }" @click="goToStep(step.key)"
              type="button" :disabled="!canAccessStep(step.key)">
              <i :class="step.icon + ' me-2'"></i>
              {{ step.label }}
            </button>
          </li>
        </ul>
        <div class="card">
          <div class="card-body">
            <div class="tab-content">
              <!-- Step 1: Category -->
              <div v-if="currentStep === 1" class="tab-pane fade show active">
                <div v-if="loadingCategories" class="text-center py-4">
                  <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                  <p class="mt-2 text-muted small">Loading categories...</p>
                </div>

                <div v-else class="category-flow">
                  <div class="row g-4 align-items-stretch">
                    <div class="col-12">
                      <div class="category-panel border rounded p-3 h-100">
                        <div
                          class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-3">
                          <div>
                            <div class="d-flex align-items-center gap-2 mb-1">
                              <h5 class="mb-0">Category</h5>
                            </div>
                          </div>
                          <button type="button" class="btn btn-sm btn-success align-self-start"
                            @click="openCreateCategoryModal('primary')">
                            <i class="bi bi-plus-circle me-1"></i>New
                          </button>
                        </div>

                        <input v-model="categorySearchQuery" type="text" class="form-control mb-3"
                          placeholder="Search categories..." />

                        <div class="list-group category-selection-list"
                          :class="{ 'is-empty': filteredPrimaryCategories.length === 0 }">
                          <button v-for="category in filteredPrimaryCategories" :key="category.id" type="button"
                            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center gap-2"
                            :class="{
                              active: selectedPrimaryCategoryId === category.id,
                            }" @click="selectPrimaryCategory(category.id)">
                            <div class="text-start">
                              <div class="fw-semibold d-flex align-items-center gap-2">
                                {{ category.taxonomy_name }}
                              </div>
                              <small v-if="category.taxonomy_description" class="text-muted">
                                {{ category.taxonomy_description }}
                              </small>
                            </div>
                            <div class="d-flex gap-1">
                              <button type="button" class="btn btn-sm btn-outline-warning py-0 px-1"
                                @click.stop="openEditCategoryModalInStep(category)" title="Edit Category">
                                <i class="bi bi-pencil" style="font-size: 0.7rem;"></i>
                              </button>
                              <button type="button" class="btn btn-sm btn-outline-danger py-0 px-1"
                                @click.stop="openDeleteCategoryModalInStep(category)" title="Delete Category">
                                <i class="bi bi-trash" style="font-size: 0.7rem;"></i>
                              </button>
                            </div>
                          </button>

                          <div v-if="filteredPrimaryCategories.length === 0" class="text-center py-4 text-muted">
                            No matching categories found.
                          </div>
                        </div>
                      </div>
                    </div>

                    <Transition name="subcategory-panel" mode="out-in">
                      <div v-if="false && selectedPrimaryCategoryId" key="subcategory-panel" class="col-12 col-xl-6">
                        <div class="category-panel border rounded p-3 h-100">
                          <div
                            class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-3">
                            <div>
                              <div class="d-flex align-items-center gap-2 mb-1">
                                <h class="mb-0">Subcategory</h>
                              </div>
                              <div class="d-flex flex-wrap align-items-center gap-2">
                                <span class="category-count-pill">
                                  {{ filteredSubcategories.length }} available
                                </span>
                              </div>
                            </div>
                            <button type="button" class="btn btn-sm btn-success align-self-start"
                              @click="openCreateCategoryModal('sub')">
                              <i class="bi bi-plus-circle me-1"></i>New
                            </button>
                          </div>

                          <input v-model="subcategorySearchQuery" type="text" class="form-control mb-3"
                            placeholder="Search subcategories..." />

                          <div class="list-group category-selection-list"
                            :class="{ 'is-empty': filteredSubcategories.length === 0 }">
                            <button v-for="category in filteredSubcategories" :key="category.id" type="button"
                              class="list-group-item list-group-item-action d-flex justify-content-between align-items-center gap-2"
                              :class="{
                                active: selectedSubcategoryId === category.id,
                              }" @click="selectSubcategory(category.id)">
                              <div class="text-start">
                                <div class="fw-semibold d-flex align-items-center gap-2">
                                  {{ category.taxonomy_name }}
                                </div>
                                <small v-if="category.taxonomy_description" class="text-muted">
                                  {{ category.taxonomy_description }}
                                </small>
                              </div>
                              <div class="d-flex gap-1">
                                <button type="button" class="btn btn-sm btn-outline-warning py-0 px-1"
                                  @click.stop="openEditCategoryModalInStep(category)" title="Edit Category">
                                  <i class="bi bi-pencil" style="font-size: 0.7rem;"></i>
                                </button>
                                <button type="button" class="btn btn-sm btn-outline-danger py-0 px-1"
                                  @click.stop="openDeleteCategoryModalInStep(category)" title="Delete Category">
                                  <i class="bi bi-trash" style="font-size: 0.7rem;"></i>
                                </button>
                              </div>
                            </button>

                            <div v-if="filteredSubcategories.length === 0" class="text-center py-4 text-muted">
                              No subcategories found for this category.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div v-else key="subcategory-placeholder" class="d-none"></div>
                    </Transition>
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
                  <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                  <p class="mt-2 text-muted small">Loading subcategories...</p>
                </div>

                <div v-else class="category-flow">
                  <div class="category-panel border rounded p-3 h-100">
                    <div
                      class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-3">
                      <div>
                        <div class="d-flex align-items-center gap-2 mb-1">
                          <h5 class="mb-0">Subcategory</h5>
                        </div>
                      </div>
                      <button type="button" class="btn btn-sm btn-success align-self-start"
                        @click="openCreateCategoryModal('sub')">
                        <i class="bi bi-plus-circle me-1"></i>New
                      </button>
                    </div>

                    <input v-model="subcategorySearchQuery" type="text" class="form-control mb-3"
                      placeholder="Search subcategories..." />

                    <div class="list-group category-selection-list"
                      :class="{ 'is-empty': filteredSubcategories.length === 0 }">
                      <button v-for="category in filteredSubcategories" :key="category.id" type="button"
                        class="list-group-item list-group-item-action d-flex justify-content-between align-items-center gap-2"
                        :class="{
                          active: selectedSubcategoryId === category.id,
                        }" @click="selectSubcategory(category.id)">
                        <div class="text-start">
                          <div class="fw-semibold d-flex align-items-center gap-2">
                            {{ category.taxonomy_name }}
                          </div>
                          <small v-if="category.taxonomy_description" class="text-muted">
                            {{ category.taxonomy_description }}
                          </small>
                        </div>
                        <div class="d-flex gap-1">
                          <button type="button" class="btn btn-sm btn-outline-warning py-0 px-1"
                            @click.stop="openEditCategoryModalInStep(category)" title="Edit Category">
                            <i class="bi bi-pencil" style="font-size: 0.7rem;"></i>
                          </button>
                          <button type="button" class="btn btn-sm btn-outline-danger py-0 px-1"
                            @click.stop="openDeleteCategoryModalInStep(category)" title="Delete Category">
                            <i class="bi bi-trash" style="font-size: 0.7rem;"></i>
                          </button>
                        </div>
                      </button>

                      <div v-if="filteredSubcategories.length === 0" class="text-center py-4 text-muted">
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

              <div v-if="currentStep === 3" class="tab-pane fade show active basic-info-step">
                <div class="row g-3">
                  <div class="col-12 d-none">
                    <div class="border-bottom pb-2 mb-3">
                      <h6 class="mb-0 text-dark">
                      </h6>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Product Name <span class="text-danger">*</span></label>
                    <input v-model="productForm.name" type="text" required class="form-control"
                      :class="{ 'is-invalid': productFormErrors.name }" placeholder="Product Name"
                      @input="generateSlugFromName" />
                    <div v-if="productFormErrors.name" class="invalid-feedback">
                      {{ productFormErrors.name[0] }}
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Slug <span class="text-danger">*</span></label>
                    <input v-model="productForm.slug" type="text" required class="form-control"
                      :class="{ 'is-invalid': productFormErrors.slug }" placeholder="product-slug" readonly />
                    <small class="text-muted"></small>
                    <div v-if="productFormErrors.slug" class="invalid-feedback">
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
                    <select v-model="productForm.is_freeshiping" class="form-select">
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
                    <textarea v-model="productForm.product_information" class="form-control" rows="4"
                      placeholder="Product information"></textarea>
                  </div>

                  <!-- Pricing -->
                  <div class="col-12 mt-4">
                    <div class="border-bottom pb-2 mb-3">
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Selling Price <span class="text-danger">*</span></label>
                    <input v-model.number="productForm.base_price" type="number" step="0.01" class="form-control"
                      placeholder="0.00" />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Original Price (Strike Price)
                      <span class="text-muted">(Optional)</span></label>
                    <input v-model.number="productForm.base_strike_price" type="number" step="0.01" class="form-control"
                      placeholder="0.00" />
                  </div>

                  <!-- SEO Metadata (Auto-generated) -->
                  <div class="col-12 mt-3">
                    <div class="seo-meta-panel rounded border px-3 py-2">
                      <div class="d-flex flex-column flex-md-row justify-content-between gap-2 mb-2">
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

                <ShopeeImageUpload v-model:images="pendingImages" :disabled="uploadingImages"
                  @change="handleImageChange" />
              </div>

              <!-- Step 5: Attributes -->
              <div v-if="currentStep === 5" class="tab-pane fade show active">
                <h5 class="mb-4">Product Attributes</h5>

                <div class="mb-4">
                  <button type="button" class="btn btn-success" @click="handleAddAttributeClick"
                    :disabled="loadingAttributes">
                    <i class="bi bi-plus-circle me-2"></i>Add Attribute
                  </button>
                </div>

                <div v-if="loadingAttributes" class="text-center py-3">
                  <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                  <p class="text-muted mt-2">Loading attributes...</p>
                </div>

                <div v-else-if="selectedAttributes.length === 0" class="text-center py-4">
                  <p class="text-muted mb-0">No attributes yet</p>
                </div>

                <div v-else class="row g-3">
                  <div v-for="(selectedAttr, index) in selectedAttributes" :key="index" class="col-12">
                    <div class="card">
                      <div class="card-header d-flex justify-content-between align-items-center">
                        <h6 class="mb-0">
                          {{ getAttributeName(selectedAttr.attribute_id) }}
                        </h6>
                        <button type="button" class="btn btn-sm btn-danger" @click="removeAttribute(index)">
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                      <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                          <label class="form-label mb-0">Select Values</label>
                        </div>
                        <div class="row g-2">
                          <div v-for="value in getAttributeValuesList(
                            selectedAttr.attribute_id,
                          )" :key="value.id" class="col-md-3">
                            <div class="form-check attribute-value-option" :class="{
                              'is-disabled': value.status === 'INACTIVE',
                            }">
                              <input class="form-check-input" type="checkbox" :value="value.id"
                                :id="`attr-${selectedAttr.attribute_id}-value-${value.id}`"
                                v-model="selectedAttr.values" :disabled="value.status === 'INACTIVE'" :title="value.status === 'INACTIVE'
                                    ? 'INACTIVE values cannot be selected'
                                    : ''
                                  " />
                              <label class="form-check-label"
                                :for="`attr-${selectedAttr.attribute_id}-value-${value.id}`" :class="{
                                  'text-muted': value.status === 'INACTIVE',
                                  'cursor-not-allowed':
                                    value.status === 'INACTIVE',
                                }">
                                {{ value.value }}
                                <span v-if="value.status === 'INACTIVE'" class="badge bg-secondary ms-2">INACTIVE</span>
                              </label>
                            </div>
                          </div>
                        </div>
                        <div v-if="
                          getAttributeValuesList(selectedAttr.attribute_id)
                            .length === 0
                        " class="text-muted small mt-2">
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
                  <button type="button" class="btn btn-primary action-btn-dark" @click="handleAddVariantClick"
                    :disabled="selectedAttributes.length === 0">
                    <i class="bi bi-plus-circle me-2"></i>Add Variant
                  </button>
                </div>

                <div v-if="selectedAttributes.length === 0" class="text-muted small mb-3">
                  Select attributes first.
                </div>

                <div v-else-if="!variants || variants.length === 0" class="text-center py-4">
                  <p class="text-muted mb-0">No variants yet</p>
                </div>

                <div v-else-if="variants && variants.length > 0" class="table-responsive">
                  <table class="table table-striped">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Variant Name</th>
                        <th>Attributes</th>
                        <th>SKU</th>
                        <th>Price</th>
                        <th>Discounted Price</th>
                        <th>Discount %</th>
                        <th>Status</th>
                        <th class="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(variant, index) in variants" :key="index">
                        <td>
                          <img v-if="variant.image_path || variant.image_preview"
                            :src="variant.image_path || variant.image_preview || undefined"
                            :alt="variant.variant_name || 'Variant'" class="img-thumbnail" style="
                              max-width: 60px;
                              max-height: 60px;
                              object-fit: cover;
                            " />
                          <span v-else class="text-muted small">No image</span>
                        </td>
                        <td>{{ variant.variant_name || "Unnamed Variant" }}</td>
                        <td>
                          <div class="d-flex flex-wrap gap-1">
                            <span v-for="valueId in variant.attribute_value_ids" :key="valueId"
                              class="badge bg-secondary">
                              {{ getAttributeValueName(valueId) }}
                            </span>
                          </div>
                        </td>
                        <td>{{ variant.sku || "N/A" }}</td>
                        <td>Rp {{ formatNumber(variant.price || 0) }}</td>
                        <td class="text-nowrap">
                          <span v-if="variant.strike_price">
                            Rp {{ formatNumber(variant.strike_price) }}
                          </span>
                          <span v-else class="text-muted">-</span>
                        </td>
                        <td class="text-nowrap">
                          <span v-if="getVariantDiscountPercent(variant) !== null">
                            {{ getVariantDiscountPercent(variant) }}%
                          </span>
                          <span v-else class="text-muted">-</span>
                        </td>
                        <td>
                          <span :class="[
                            'badge',
                            variant.status === 'ACTIVE'
                              ? 'bg-success'
                              : 'bg-secondary',
                          ]">
                            {{ variant.status }}
                          </span>
                        </td>
                        <td class="text-end">
                          <div class="d-flex gap-2 justify-content-end">
                            <button type="button" class="btn btn-sm btn-outline-primary" @click="editVariant(index)">
                              <i class="bi bi-pencil"></i>
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-danger" @click="removeVariant(index)"
                              :disabled="deletingVariantId === variant.id">
                              <i v-if="deletingVariantId === variant.id" class="bi bi-hourglass-split"></i>
                              <i v-else class="bi bi-trash"></i>
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

                <div class="mb-3 d-flex justify-content-between align-items-center">
                  <div class="flex-grow-1">
                    <input v-model="brandSearchQuery" type="text" class="form-control" placeholder="Search brands..." />
                  </div>

                </div>

                <div v-if="loadingBrands" class="text-center py-3">
                  <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                  <p class="mt-2 text-muted small">Loading brands...</p>
                </div>

                <div v-else>
                  <!-- Selected Brands -->
                  <div v-if="selectedBrandIds && selectedBrandIds.length > 0" class="mb-3">
                    <label class="form-label"><strong>Selected Brands:</strong></label>
                    <div class="d-flex flex-wrap gap-2">
                      <span v-for="brandId in selectedBrandIds" :key="brandId"
                        class="badge bg-primary d-flex align-items-center gap-2"
                        style="font-size: 0.9rem; padding: 0.5rem 0.75rem">
                        {{ getBrandName(brandId) }}
                        <button type="button" class="btn-close btn-close-white" style="font-size: 0.7rem"
                          @click="removeBrand(brandId)" aria-label="Remove"></button>
                      </span>
                    </div>
                  </div>

                  <!-- Brands List -->
                  <div class="border rounded p-3" style="max-height: 400px; overflow-y: auto">
                    <div v-if="filteredBrands.length === 0" class="text-center py-4">
                      <p class="text-muted mb-0">No brands found</p>
                    </div>
                    <div v-else class="row g-2">
                      <div v-for="brand in filteredBrands" :key="brand.id" class="col-12 col-md-6">
                        <div class="form-check">
                          <input class="form-check-input" type="checkbox" :value="brand.id" :id="`brand-${brand.id}`"
                            v-model="selectedBrandIds" />
                          <label class="form-check-label" :for="`brand-${brand.id}`" style="cursor: pointer">
                            {{ brand?.name || "Unknown Brand" }}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Add Attribute Modal -->
            <div class="modal fade" id="addAttributeModal" tabindex="-1" aria-labelledby="addAttributeModalLabel"
              aria-hidden="true">
              <div class="modal-dialog modal-lg">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="addAttributeModalLabel">
                      Add Attribute
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <!-- Tabs -->
                    <ul class="nav nav-tabs mb-3" role="tablist">
                      <li class="nav-item" role="presentation">
                        <button class="nav-link" :class="{ active: attributeModalTab === 'select' }"
                          @click="attributeModalTab = 'select'" type="button">
                          <i class="bi bi-list-check me-2"></i>Select Existing
                        </button>
                      </li>
                    </ul>

                    <!-- Tab Content: Select Existing -->
                    <div v-if="attributeModalTab === 'select'" class="tab-content">
                      <div v-if="loadingAttributes" class="text-center py-3">
                        <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                        <p class="text-muted mt-2">Loading attributes...</p>
                      </div>
                      <div v-else-if="unselectedAttributes.length === 0" class="text-center py-4">
                        <p class="text-muted">No available attributes to add</p>
                        <p class="text-muted small">
                          All attributes have been selected or create a new one
                        </p>
                      </div>
                      <div v-else class="list-group">
                        <button v-for="attr in unselectedAttributes" :key="attr.id" type="button"
                          class="list-group-item list-group-item-action" @click="selectAttribute(attr.id)">
                          <div class="d-flex justify-content-between align-items-center">
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
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                      @click="resetNewAttributeForm">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="mt-4 d-flex justify-content-between">
              <div>
                <button v-if="currentStep > 1" type="button" class="btn btn-secondary" @click="previousStep">
                  <i class="bi bi-arrow-left me-2"></i>Previous
                </button>
              </div>
              <div class="d-flex gap-2">
                <NuxtLink to="/manage-product" class="btn btn-outline-secondary outline-dark-btn">
                  Cancel
                </NuxtLink>
                <button v-if="currentStep < steps.length" type="button" class="btn btn-primary action-btn-dark"
                  @click="nextStep" :disabled="!canProceedToNextStep">
                  Next<i class="bi bi-arrow-right ms-2"></i>
                </button>
                <button v-else type="button" class="btn btn-success action-btn-dark" @click="handleCreateProduct"
                  :disabled="isLoading || !canCreateProduct">
                  {{ isLoading ? "Creating..." : "Create Product" }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Variant Modal -->
    <VariantModal :selected-attributes="selectedAttributes" :variant-form="variantForm"
      :variant-store-stocks="variantStoreStocks" :editing-variant-index="editingVariantIndex"
      :available-attributes="availableAttributes" :product-slug="productForm.slug" @save="handleSaveVariant"
      @cancel="handleCancelVariant" @update:variant-form="variantForm = $event"
      @update:variant-store-stocks="variantStoreStocks = $event" @update-variant-name="updateVariantName" />

    <!-- Add Category Modal -->
    <div class="modal fade" id="addCategoryModal" tabindex="-1" aria-labelledby="addCategoryModalLabel"
      aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addCategoryModalLabel">
              Create New Category
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleCreateCategory">
              <div class="mb-3">
                <label class="form-label">{{ newCategoryForm.taxonomy_type === 2 ? "Category" : "Subcategory" }}
                  <span class="text-danger">*</span></label>
                <input v-model="newCategoryForm.taxonomy_name" type="text" class="form-control" :placeholder="newCategoryForm.taxonomy_type === 2
                    ? 'e.g., Tas, Dompet, Ikat Pinggang'
                    : 'e.g., Tas Selempang, Tas Ransel'
                  " required maxlength="250" @input="generateCategorySlug" />
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
                <select v-model="newCategoryForm.taxonomy_type" class="form-select">
                  <option :value="2">Category</option>
                  <option :value="3">Subcategory</option>
                </select>
              </div>
              <div v-if="newCategoryForm.taxonomy_type === 3" class="mb-3">
                <label class="form-label">Parent Category <span class="text-danger">*</span></label>
                <select v-model="newCategoryForm.parent" class="form-select">
                  <option :value="null">Select a category...</option>
                  <option v-for="category in availablePrimaryCategories" :key="category.id" :value="category.id">
                    {{ category.taxonomy_name }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Slug</label>
                <input v-model="newCategoryForm.taxonomy_slug" type="text" class="form-control"
                  placeholder="auto-generated-from-name" maxlength="250" />
                <small class="text-muted">URL-friendly version of the name (auto-generated)</small>
              </div>
              <div class="mb-3">
                <label class="form-label">Status</label>
                <select v-model="newCategoryForm.taxonomy_status" class="form-select">
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-primary action-btn-dark"
                  :disabled="creatingCategory || !newCategoryForm.taxonomy_name">
                  <span v-if="creatingCategory" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  <i v-else class="bi bi-check-circle me-2"></i>
                  Create & Add
                </button>
                <button type="button" class="btn btn-secondary" @click="resetNewCategoryForm">
                  Reset
                </button>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="resetNewCategoryForm">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Edit Category Modal -->
    <div class="modal fade" id="editCategoryInStepModal" tabindex="-1" aria-labelledby="editCategoryInStepModalLabel"
      aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editCategoryInStepModalLabel">Edit Category</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Category Name <span class="text-danger">*</span></label>
              <input v-model="editCategoryFormData.taxonomy_name" type="text" class="form-control"
                placeholder="Enter category name" @input="generateEditCategorySlug" />
            </div>
            <div class="mb-3">
              <label class="form-label">Slug</label>
              <input v-model="editCategoryFormData.taxonomy_slug" type="text" class="form-control"
                placeholder="auto-generated-from-name" />
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
            <button type="button" class="btn btn-success" @click="handleEditCategoryInStep"
              :disabled="editingCategoryInStep">
              {{ editingCategoryInStep ? 'Updating...' : 'Update Category' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Delete Category Modal -->
    <div class="modal fade" id="deleteCategoryInStepModal" tabindex="-1"
      aria-labelledby="deleteCategoryInStepModalLabel" aria-hidden="true">
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
            <button type="button" class="btn btn-danger" @click="handleDeleteCategoryInStep"
              :disabled="deletingCategoryInStep">
              {{ deletingCategoryInStep ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Create Brand Modal -->
    <div class="modal fade" id="createBrandModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create New Brand</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" />
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Brand Name</label>
              <input v-model="newBrand.name" type="text" class="form-control" placeholder="e.g. Nike" />
            </div>

            <div class="mb-3">
              <label class="form-label">Description (optional)</label>
              <textarea v-model="newBrand.description" class="form-control" rows="3" />
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="button" class="btn btn-primary action-btn-dark" :disabled="creatingBrand || !newBrand.name"
              @click="submitCreateBrand">
              <span v-if="creatingBrand" class="spinner-border spinner-border-sm me-2"></span>
              Create Brand
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductCreatePayload } from "~/types/product";
import { formatNumber, generateSlug } from "~/utils/helpers";

definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

useAppTitle("Create Product");

// Register components
import ShopeeImageUpload from "~/components/ShopeeImageUpload.vue";

interface TaxonomyItem {
  id: number;
  parent?: number | null;
  taxonomy_name: string;
  taxonomy_description?: string | null;
  taxonomy_slug?: string | null;
  taxonomy_type: number;
  taxonomy_status?: string | null;
}

const { createProduct } = useProductApi();
const {
  uploadProductImage,
  uploadVariantImage,
  attachProductCategories,
  attachProductBrands,
  getProductBrands,
  getBrands,
  createBrand,
  createProductVariant,
  getTaxoListsByType,
  createTaxoList,
  updateTaxoList,
  deleteTaxoList,
  getActiveAttributes,
  attachProductAttributes,
  createAttribute,
  getAttributeValues,
  createAttributeValue,
  getVariantStoreStocks,
  createOrUpdateVariantStoreStock,
  deleteVariantStoreStock,
  deleteProductVariant,
} = useProductRelationsApi();
const { getAllStores } = useStoreApi();
const router = useRouter();
const toast = useToast();

// Step management
const currentStep = ref(1);
const isLoading = ref(false);
const deletingVariantId = ref<number | null>(null);

const steps = [
  { key: 1, label: "Category", icon: "bi bi-tags" },
  { key: 2, label: "SubCategory", icon: "bi bi-diagram-2" },
  { key: 3, label: "Basic Info", icon: "bi bi-info-circle" },
  { key: 4, label: "Images", icon: "bi bi-images" },
  { key: 5, label: "Attributes", icon: "bi bi-list-check" },
  { key: 6, label: "Variants", icon: "bi bi-box-seam" },
  { key: 7, label: "Merk", icon: "bi bi-tag" },
];

// Product form
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

// Images
const pendingImages = ref<
  Array<{ file: File; preview: string; is_featured?: boolean; name?: string }>
>([]);
const uploadingImages = ref(false);

// Variants
const variants = ref<
  Array<{
    id?: number;
    attribute_value_ids: number[];
    variant_name?: string;
    sku?: string;
    image_path?: string | null;
    image_file?: File | null;
    image_preview?: string | null;
    price: number;
    strike_price?: number | null;
    discount_percent?: number | null;
    status: "ACTIVE" | "INACTIVE";
    weight?: number | null;
    type_weight?: "GRAM" | "KG";
    store_stocks?: Array<{
      store_id: number;
      qty: number;
      reserved_qty: number;
    }>;
  }>
>([]);
const editingVariantIndex = ref<number | null>(null);

const variantForm = ref({
  selectedAttributeValues: {} as Record<number, number>, // attribute_id -> attribute_value_id
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

// Store Stock Management
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

// Attributes
const availableAttributes = ref<
  Array<{
    id: number;
    name: string;
    slug: string;
    attribute_values?: Array<{
      id: number;
      attribute_id: number;
      value: string;
      slug: string;
      sort: number;
      status: string;
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

// Categories
const availablePrimaryCategories = ref<TaxonomyItem[]>([]);
const availableSubcategories = ref<TaxonomyItem[]>([]);
const selectedPrimaryCategoryId = ref<number | null>(null);
const selectedSubcategoryId = ref<number | null>(null);
const loadingCategories = ref(false);
const categorySearchQuery = ref("");
const subcategorySearchQuery = ref("");
const creatingCategory = ref(false);
const newCategoryForm = ref({
  parent: null as number | null,
  taxonomy_name: "",
  taxonomy_slug: "",
  taxonomy_description: "",
  taxonomy_type: 2, // Default to type 2 (category)
  taxonomy_status: "ACTIVE" as "ACTIVE" | "INACTIVE",
});

// Brands
const availableBrands = ref<any[]>([]);
const selectedBrandIds = ref<number[]>([]);
const loadingBrands = ref(false);
const brandSearchQuery = ref("");

const creatingBrand = ref(false);

const newBrand = ref({
  name: "",
  description: "",
});

const calculateVariantDiscountPercent = (
  price?: number | null,
  strikePrice?: number | null,
) => {
  const sellingPrice = Number(price) || 0;
  const originalPrice = Number(strikePrice) || 0;

  if (originalPrice <= 0 || sellingPrice <= 0 || sellingPrice >= originalPrice) {
    return null;
  }

  return Math.round(((originalPrice - sellingPrice) / originalPrice) * 10000) / 100;
};

const getVariantDiscountPercent = (variant: {
  price?: number | null;
  strike_price?: number | null;
  discount_percent?: number | null;
}) => {
  return variant.discount_percent ?? calculateVariantDiscountPercent(
    variant.price,
    variant.strike_price,
  );
};

const generateSlugFromName = () => {
  if (!productForm.value.name) return;
  productForm.value.slug = generateSlug(productForm.value.name);
  // Auto-generate SEO metadata
  productForm.value.meta_title = `Buy ${productForm.value.name}`;
  productForm.value.meta_description = `Shop ${productForm.value.name} at the best price. High quality product with fast shipping and secure payment. Order now!`;
};

const goToStep = (step: number) => {
  if (canAccessStep(step)) {
    currentStep.value = step;
  }
};

const hasCategorySelection = computed(() => {
  return !!(selectedPrimaryCategoryId.value && selectedSubcategoryId.value);
});

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
  const allValues = attribute?.attribute_values || [];

  // In variants step, only show values that were selected in attributes step.
  if (currentStep.value === 6) {
    const selectedAttr = selectedAttributes.value.find(
      (sa) => sa.attribute_id === attributeId,
    );
    if (selectedAttr && selectedAttr.values.length > 0) {
      // Filter to only show values that were checked in attributes step
      return allValues.filter((v) => selectedAttr.values.includes(v.id));
    }
    // If no values selected yet, return empty array
    return [];
  }

  // Attributes step: show all values
  return allValues;
};

const unselectedAttributes = computed(() => {
  return availableAttributes.value.filter(
    (attr) =>
      !selectedAttributes.value.some((sa) => sa.attribute_id === attr.id),
  );
});

const handleAddAttributeClick = () => {
  // Open modal to select attribute
  const modalElement = document.getElementById("addAttributeModal");
  if (modalElement) {
    const modal = new (window as any).bootstrap.Modal(modalElement);
    modal.show();
  }
};

const selectAttribute = (attributeId: number) => {
  // Add selected attribute
  selectedAttributes.value.push({
    attribute_id: attributeId,
    sort: selectedAttributes.value.length,
    values: [],
  });

  // Close modal
  const modalElement = document.getElementById("addAttributeModal");
  if (modalElement) {
    const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
    modal?.hide();
  }
  resetNewAttributeForm();
};

const resetNewAttributeForm = () => {
  newAttributeForm.value = {
    name: "",
    sort: 0,
  };
  attributeModalTab.value = "select";
};

const handleCreateAttribute = async () => {
  if (!newAttributeForm.value.name.trim()) {
    return;
  }

  creatingAttribute.value = true;
  try {
    const { data, error } = await createAttribute({
      name: newAttributeForm.value.name.trim(),
      sort: newAttributeForm.value.sort || 0,
      status: "ACTIVE", // Always ACTIVE for new attributes
    });

    if (error) {
      toast.error(error.message || "Failed to create attribute");
      return;
    }

    if (data?.success && data.data) {
      // Reload attributes to get the new one
      await loadAvailableAttributes();

      // Automatically select the newly created attribute
      const newAttributeId = data.data.id;
      selectAttribute(newAttributeId);

      // Show success message
      toast.success("Attribute created and added successfully");
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
  // Note: Variants are now created manually, so we don't auto-regenerate
};

const handleAddAttributeValueClick = async (attributeId: number) => {
  addingValueToAttributeId.value = attributeId;
  resetNewAttributeValueForm();

  // Open modal
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

  creatingAttributeValue.value = true;
  try {
    const { data, error } = await createAttributeValue({
      attribute_id: addingValueToAttributeId.value,
      value: newAttributeValueForm.value.value.trim(),
      sort: newAttributeValueForm.value.sort || 0,
      status: "ACTIVE", // Always ACTIVE for new values
    });

    if (error) {
      toast.error(error.message || "Failed to create attribute value");
      return;
    }

    if (data?.success && data.data) {
      const newValue = data.data;
      const newValueId = newValue.id;
      const newValueStatus = newValue.status || "ACTIVE";

      // Reload attributes to get the new value (only ACTIVE values will appear)
      await loadAvailableAttributes();

      // Only auto-select if status is ACTIVE
      if (newValueStatus === "ACTIVE") {
        const selectedAttr = selectedAttributes.value.find(
          (sa) => sa.attribute_id === addingValueToAttributeId.value,
        );
        if (selectedAttr && !selectedAttr.values.includes(newValueId)) {
          selectedAttr.values.push(newValueId);
        }
        toast.success("Attribute value created and added successfully");
      } else {
        // For INACTIVE values, manually add to availableAttributes so it appears in UI
        const attribute = availableAttributes.value.find(
          (attr) => attr.id === addingValueToAttributeId.value,
        );
        if (attribute) {
          // Add the INACTIVE value to the attribute's values array
          if (!attribute.attribute_values) {
            attribute.attribute_values = [];
          }
          // Check if value already exists
          const exists = attribute.attribute_values.some(
            (v: any) => v.id === newValueId,
          );
          if (!exists) {
            attribute.attribute_values.push({
              id: newValue.id,
              attribute_id: newValue.attribute_id,
              value: newValue.value,
              slug: newValue.slug,
              sort: newValue.sort,
              status: newValue.status,
            });
            // Sort by sort order
            attribute.attribute_values.sort(
              (a: any, b: any) => a.sort - b.sort,
            );
          }
        }
        toast.success(
          "Attribute value created (INACTIVE - not automatically selected)",
        );
      }

      // Close modal
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

// Generate variant combinations from selected attributes (Cartesian Product)
const generateVariantCombinations = () => {
  if (selectedAttributes.value.length === 0) {
    variants.value = [];
    return;
  }

  // Get all selected attribute values
  const attributeValueArrays: number[][] = [];
  const attributeNames: string[] = [];

  selectedAttributes.value.forEach((selectedAttr) => {
    const attribute = availableAttributes.value.find(
      (attr) => attr.id === selectedAttr.attribute_id,
    );
    if (attribute && selectedAttr.values.length > 0) {
      attributeValueArrays.push(selectedAttr.values);
      attributeNames.push(attribute.name);
    }
  });

  // If no values selected, clear variants
  if (attributeValueArrays.length === 0) {
    variants.value = [];
    return;
  }

  // Generate Cartesian Product
  const combinations: number[][] = [];
  const generateCombinations = (
    arrays: number[][],
    current: number[] = [],
    index: number = 0,
  ) => {
    if (index === arrays.length) {
      combinations.push([...current]);
      return;
    }
    const currentArray = arrays[index];
    if (!currentArray) {
      return;
    }
    for (const value of currentArray) {
      current.push(value);
      generateCombinations(arrays, current, index + 1);
      current.pop();
    }
  };

  generateCombinations(attributeValueArrays);

  // Create variant objects with attribute_value_ids
  const existingVariants = variants.value.filter(
    (v) => v.attribute_value_ids && v.attribute_value_ids.length > 0,
  );
  const newVariants: typeof variants.value = combinations.map((combo) => {
    // Check if this combination already exists
    const existing = existingVariants.find((v) => {
      if (
        !v.attribute_value_ids ||
        v.attribute_value_ids.length !== combo.length
      )
        return false;
      return (
        v.attribute_value_ids.every((id) => combo.includes(id)) &&
        combo.every((id) => v.attribute_value_ids!.includes(id))
      );
    });

    if (existing) {
      // Keep existing variant data
      return existing;
    }

    // Generate variant name from attribute values
    const variantNameParts: string[] = [];
    combo.forEach((valueId) => {
      selectedAttributes.value.forEach((selectedAttr) => {
        const attribute = availableAttributes.value.find(
          (attr) => attr.id === selectedAttr.attribute_id,
        );
        if (attribute) {
          const value = attribute.attribute_values?.find(
            (v) => v.id === valueId,
          );
          if (value) {
            variantNameParts.push(value.value);
          }
        }
      });
    });

    return {
      attribute_value_ids: combo,
      variant_name: variantNameParts.join(" - "),
      sku: "",
      price: productForm.value.base_price || 0,
      strike_price: productForm.value.base_strike_price || null,
      status: "ACTIVE" as "ACTIVE" | "INACTIVE",
    };
  });

  variants.value = newVariants;
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

const nextStep = () => {
  if (currentStep.value < steps.length && canProceedToNextStep.value) {
    currentStep.value++;
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

const canCreateProduct = computed(() => {
  return (
    hasCategorySelection.value &&
    productForm.value.name &&
    productForm.value.slug
  );
});

const getPendingImageKey = (image: {
  file?: File;
  path?: string;
  preview?: string;
  name?: string;
}) => {
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

const getImagesForUpload = () => {
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

  const imagesToUpload = Array.from(imageMap.values());

  if (
    imagesToUpload.length > 0 &&
    !imagesToUpload.some((image) => image.is_featured)
  ) {
    const firstImage = imagesToUpload[0];
    if (firstImage) {
      firstImage.is_featured = true;
    }
  }

  return imagesToUpload;
};

const handleImageChange = ({ images }: { images: any }) => {
  pendingImages.value = Array.isArray(images)
    ? images.map((img, index) => ({
      file: img.file,
      preview: img.preview,
      is_featured: index === 0,
      name: img.name,
    }))
    : [];
};

const handleAddVariantClick = async () => {
  if (selectedAttributes.value.length === 0) {
    toast.error("Please select attributes in Step 5 first");
    return;
  }

  editingVariantIndex.value = null;
  variantForm.value = {
    selectedAttributeValues: {},
    attribute_value_ids: [],
    variant_name: "",
    sku: "",
    price: productForm.value.base_price || 0,
    strike_price: productForm.value.base_strike_price || null,
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
    image_file: null,
    image_preview: null,
    image_path: null,
    weight: null,
    type_weight: "GRAM" as "GRAM" | "KG",
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
  // Generate variant name from selected attribute values (only selected ones)
  const variantNameParts: string[] = [];
  const selectedValueIds: number[] = [];

  selectedAttributes.value.forEach((selectedAttr) => {
    const selectedValueId =
      variantForm.value.selectedAttributeValues[selectedAttr.attribute_id];
    if (selectedValueId) {
      // Validate that the selected value is actually in the allowed list from the attributes step
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
        // If value is not in allowed list, clear it
        delete variantForm.value.selectedAttributeValues[
          selectedAttr.attribute_id
        ];
      }
    }
  });

  // If no values selected, use default name
  if (variantNameParts.length === 0) {
    variantForm.value.variant_name = "No Variant";
  } else {
    variantForm.value.variant_name = variantNameParts.join(" - ");
  }
  variantForm.value.attribute_value_ids = selectedValueIds;
};

const handleSaveVariant = (variantData: any) => {
  // Check for duplicate variant (same attribute_value_ids combination)
  const newAttributeValueIds = [...variantData.attribute_value_ids].sort(
    (a, b) => a - b,
  );
  const isDuplicate = variants.value.some((v, index) => {
    if (
      editingVariantIndex.value !== null &&
      index === editingVariantIndex.value
    ) {
      return false; // Skip current variant being edited
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
    return;
  }

  // Create variant data with store_stocks
  const finalVariantData = {
    ...variantData,
    variant_name: variantData.variant_name || "Unnamed Variant",
    sku: variantData.sku || "",
    price: variantData.price || 0,
    strike_price: variantData.strike_price || null,
    discount_percent: calculateVariantDiscountPercent(
      variantData.price,
      variantData.strike_price,
    ),
    status: variantData.status || "ACTIVE",
    store_stocks: variantData.store_stocks || [],
  };

  // Update or add variant
  if (
    editingVariantIndex.value !== null &&
    variants.value[editingVariantIndex.value]
  ) {
    variants.value[editingVariantIndex.value] = finalVariantData;
    editingVariantIndex.value = null;
    toast.success("Variant updated successfully");
  } else {
    variants.value.push(finalVariantData);
    toast.success("Variant added successfully");
  }

  // Close modal
  const modalElement = document.getElementById("variantModal");
  if (modalElement) {
    const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
    modal?.hide();
  }

  handleCancelVariant();
};

const handleCancelVariant = () => {
  variantStoreStocks.value = [];
  editingVariantIndex.value = null;
  variantForm.value = {
    selectedAttributeValues: {},
    attribute_value_ids: [],
    variant_name: "",
    image_file: null,
    image_preview: null,
    image_path: null,
    sku: "",
    price: productForm.value.base_price || 0,
    strike_price: productForm.value.base_strike_price || null,
    status: "ACTIVE",
    weight: 0,
    type_weight: "GRAM",
  };
};

const editVariant = async (index: number) => {
  if (variants.value && variants.value[index]) {
    editingVariantIndex.value = index;
    const variant = variants.value[index];

    // Load store stocks if variant has id (existing variant)
    if (variant.store_stocks) {
      variantStoreStocks.value = variant.store_stocks.map(mapStoreStock);
    } else {
      variantStoreStocks.value = [];
    }

    // Reconstruct selectedAttributeValues from attribute_value_ids
    const selectedAttributeValues: Record<number, number> = {};
    variant.attribute_value_ids?.forEach((valueId) => {
      // Find which attribute this value belongs to
      selectedAttributes.value.forEach((selectedAttr) => {
        const value = getAttributeValuesList(selectedAttr.attribute_id).find(
          (v) => v.id === valueId,
        );
        if (value) {
          selectedAttributeValues[selectedAttr.attribute_id] = valueId;
        }
      });
    });

    variantForm.value = {
      selectedAttributeValues,
      attribute_value_ids: variant.attribute_value_ids || [],
      variant_name: variant.variant_name || "",
      sku: variant.sku || "",
      price: variant.price || 0,
      strike_price: variant.strike_price || null,
      image_file: variant.image_file || null,
      image_preview: variant.image_preview || variant.image_path || null,
      image_path: variant.image_path || null,
      status: variant.status || "ACTIVE",
      weight: variant.weight || 0,
      type_weight: variant.type_weight || "GRAM",
    };

    // Open modal for editing
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

const removeVariant = async (index: number) => {
  const variant = variants.value[index];
  if (variant?.id) {
    if (!confirm("Are you sure you want to delete this variant?")) return;
    deletingVariantId.value = variant.id;
    const { error } = await deleteProductVariant(variant.id);
    deletingVariantId.value = null;
    if (error) {
      toast.error(error.message || "Failed to delete variant");
      return;
    }
  }
  variants.value.splice(index, 1);
};

// Helper function to map store stock data
const mapStoreStock = (stock: any) => ({
  id: stock.id,
  store_id: stock.store_id,
  qty: stock.qty,
  reserved_qty: stock.reserved_qty || 0,
  store: stock.store,
});

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
  } catch (err) {
    console.error("Error loading available categories:", err);
    availablePrimaryCategories.value = [];
    availableSubcategories.value = [];
  } finally {
    loadingCategories.value = false;
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
      // Reload categories to get the new one
      await loadAvailableCategories();

      // Automatically select the newly created category
      const newCategoryId = data.data.id;
      if (data.data.taxonomy_type === 2) {
        selectedPrimaryCategoryId.value = newCategoryId;
        selectedSubcategoryId.value = null;
      } else {
        selectedPrimaryCategoryId.value = data.data.parent || selectedPrimaryCategoryId.value;
        selectedSubcategoryId.value = newCategoryId;
      }

      // Close modal
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

// Edit/Delete Category in Step
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
    // Remove from selected if it was selected
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

const loadAvailableBrands = async () => {
  loadingBrands.value = true;
  try {
    const { data } = await getBrands();
    availableBrands.value = data?.data.brands || [];
  } catch (err) {
    console.error("Failed to load brands", err);
    availableBrands.value = [];
  } finally {
    loadingBrands.value = false;
  }
};

const getBrandName = (brandId: number) => {
  const brand = availableBrands.value.find((b) => b.id === brandId);
  return brand?.name || `Brand ${brandId}`;
};

const filteredBrands = computed(() => {
  if (!brandSearchQuery.value.trim()) return availableBrands.value;
  const q = brandSearchQuery.value.toLowerCase();
  return availableBrands.value.filter((b) => b.name?.toLowerCase().includes(q));
});

const getProductSaveErrorMessage = (message?: string) => {
  if (!message) return "Failed to create product";

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
  variantName: string | null | undefined,
  message?: string,
  errors?: Record<string, string[] | string>,
) => {
  const name = variantName || "Unnamed Variant";
  const validationDetails = formatApiValidationErrors(errors);
  const baseMessage = message || "Backend did not return a message";

  return validationDetails
    ? `Failed to create variant "${name}": ${baseMessage}. Detail: ${validationDetails}`
    : `Failed to create variant "${name}": ${baseMessage}`;
};

const removeBrand = (brandId: number) => {
  selectedBrandIds.value = selectedBrandIds.value.filter(
    (id) => id !== brandId,
  );
};

const openCreateBrandModal = () => {
  newBrand.value = { name: "", description: "" };
  const modal = new (window as any).bootstrap.Modal(
    document.getElementById("createBrandModal")!,
  );
  modal.show();
};

const submitCreateBrand = async () => {
  if (!newBrand.value.name) return;

  creatingBrand.value = true;
  try {
    const { data, error } = await createBrand({
      name: newBrand.value.name,
      description: newBrand.value.description,
      status: "ACTIVE",
    });

    if (error) throw error;

    const brand = data?.data.brand;
    if (brand) {
      // add to list
      availableBrands.value.unshift(brand);

      // auto-select
      selectedBrandIds.value.push(brand.id);
    }

    // close modal
    const modalEl = document.getElementById("createBrandModal");
    const modal = (window as any).bootstrap.Modal.getInstance(modalEl!);
    modal?.hide();
  } catch (err) {
    console.error("Create brand failed", err);
    toast.error("Failed to create brand");
  } finally {
    creatingBrand.value = false;
  }
};

const handleCreateProduct = async () => {
  try {
    isLoading.value = true;
    productFormErrors.value = {};

    // Step 1: Create product
    const { data, error } = await createProduct(productForm.value);
    if (error) {
      if (error.errors) {
        productFormErrors.value = error.errors;
        currentStep.value = 1; // Go back to first step if validation fails
      } else {
        toast.error(getProductSaveErrorMessage(error.message));
      }
      return;
    }

    if (!data?.success || !data.data.product) {
      toast.error("Failed to create product");
      return;
    }

    const productId = data.data.product.id;

    // Step 2: Upload images
    const imagesToUpload = getImagesForUpload();

    if (imagesToUpload.length > 0) {
      uploadingImages.value = true;
      const uploadErrors: string[] = [];

      try {
        // Filter out any invalid images first
        const validImages = imagesToUpload.filter((img, idx) => {
          if (!img || !img.file) {
            console.warn(`Skipping invalid image at index ${idx}`);
            return false;
          }
          return true;
        });

        // Upload images sequentially to maintain order
        for (let i = 0; i < validImages.length; i++) {
          const image = validImages[i];
          if (!image || !image.file) {
            console.warn(`Skipping invalid image at index ${i}`);
            continue;
          }

          try {
            const { data: uploadedImage, error: uploadError } =
              await uploadProductImage(
                productId,
                image.file,
                i + 1,
                image.is_featured || false,
              );

            if (uploadError || !uploadedImage?.success) {
              const errorMsg =
                uploadError?.message ||
                `Failed to upload image ${i + 1}`;
              console.error(`Error uploading image ${i + 1}:`, uploadError);
              uploadErrors.push(errorMsg);
            }
          } catch (err: any) {
            const errorMsg = err?.message || `Failed to upload image ${i + 1}`;
            console.error(`Error uploading image ${i + 1}:`, err);
            uploadErrors.push(errorMsg);
            // Continue with next image even if one fails
          }
        }

        if (uploadErrors.length > 0) {
          toast.warning(
            `Some images failed to upload: ${uploadErrors.join(", ")}`,
          );
        } else if (validImages.length > 0) {
          toast.success(`Successfully uploaded ${validImages.length} image(s)`);
          pendingImages.value = [];
        }
      } catch (err) {
        console.error("Error in image upload process:", err);
        toast.error("Error uploading images");
      } finally {
        uploadingImages.value = false;
      }
    }

    // Step 3: Attach attributes
    if (selectedAttributes.value && selectedAttributes.value.length > 0) {
      try {
        await attachProductAttributes(productId, selectedAttributes.value);
      } catch (err) {
        console.error("Error attaching attributes:", err);
        // Continue even if attribute attachment fails
      }
    }

    // Step 4: Create variants
    if (variants.value && variants.value.length > 0) {
      try {
        for (const variant of variants.value) {
          let variantImagePath = variant.image_path || null;

          // If variant has image_file, upload it first
          if (variant.image_file) {
            try {
              const { data: imageData, error: imageError } =
                await uploadVariantImage(productId, variant.image_file);
              if (imageData?.data?.path) {
                variantImagePath = imageData.data.path;
              } else if (imageError) {
                console.error("Error uploading variant image:", imageError);
                toast.warning(
                  `Failed to upload image for variant ${variant.variant_name}`,
                );
              }
            } catch (err) {
              console.error("Error uploading variant image:", err);
              toast.warning(
                `Failed to upload image for variant ${variant.variant_name}`,
              );
            }
          }

          const variantPayload = {
            fk_product_id: productId,
            variant_name: variant.variant_name || null,
            attribute_value_ids: variant.attribute_value_ids || [],
            sku: variant.sku || null,
            image_path: variantImagePath,
            price: variant.price || null,
            strike_price: variant.strike_price || null,
            status: variant.status,
            weight: variant.weight || null,
            type_weight: variant.type_weight || null,
          };

          const variantResponse = await createProductVariant(variantPayload);

          if (variantResponse.error || !variantResponse.data?.success) {
            const message = getVariantSaveErrorMessage(
              variant.variant_name,
              variantResponse.error?.message || (variantResponse.data as any)?.message,
              variantResponse.error?.errors,
            );

            console.error("Error creating product variant:", {
              variant: variant.variant_name,
              payload: variantPayload,
              error: variantResponse.error,
              response: variantResponse.data,
            });
            toast.error(message);
            continue;
          }

          // Create store stocks if variant has store stocks
          const newVariantId = variantResponse.data?.data?.variant?.id ?? variantResponse.data?.data?.id;
          if (
            variant.store_stocks &&
            variant.store_stocks.length > 0 &&
            newVariantId
          ) {
            const variantId = newVariantId;
            for (const storeStock of variant.store_stocks) {
              try {
                await createOrUpdateVariantStoreStock(variantId, {
                  store_id: storeStock.store_id,
                  qty: storeStock.qty,
                  reserved_qty: storeStock.reserved_qty || 0,
                });
              } catch (err) {
                console.error("Error creating store stock:", err);
                toast.warning(
                  `Failed to create store stock for variant ${variant.variant_name}`,
                );
              }
            }
          }
        }
      } catch (err) {
        console.error("Error creating variants:", err);
        // Continue even if variant creation fails
      }
    }

    // Step 5: Attach categories
    if (selectedCategoryIds.value && selectedCategoryIds.value.length > 0) {
      try {
        await attachProductCategories(productId, selectedCategoryIds.value);
      } catch (err) {
        console.error("Error attaching categories:", err);
        // Continue even if category attachment fails
      }
    }

    // Step 6: Attach brands
    if (selectedBrandIds.value && selectedBrandIds.value.length > 0) {
      try {
        await attachProductBrands(productId, selectedBrandIds.value);
      } catch (err) {
        console.error("Error attaching brands:", err);
      }
    }

    // Redirect to product detail page using slug
    const productSlug = data.data.product.slug;
    router.push(`/manage-product/${productSlug}`);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to create product";
    toast.error(getProductSaveErrorMessage(errorMessage));
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await Promise.all([
    loadAvailableCategories(),
    loadAvailableAttributes(),
    loadAvailableBrands(),
  ]);
});
</script>

<style scoped>
.create-product-page {
  color: var(--app-text-black);
}

.create-product-page :deep(.text-muted) {
  color: #4f5b66 !important;
}

.nav-tabs .nav-link {
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--app-text-black);
  cursor: pointer;
}

.nav-tabs .nav-link:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.nav-tabs .nav-link.active {
  border-bottom-color: var(--app-action-dark-bg);
  color: var(--app-text-black);
  font-weight: 500;
}

.create-product-page :deep(.badge) {
  font-weight: 600;
}

.create-product-page :deep(.badge.bg-secondary) {
  background-color: #e5e7eb !important;
  color: #374151 !important;
}

.create-product-page :deep(.badge.bg-success) {
  background-color: #dff3e7 !important;
  color: #166534 !important;
}

.create-product-page :deep(.badge.bg-primary) {
  background-color: #dbeafe !important;
  color: #1d4ed8 !important;
}

.create-product-page :deep(.alert-light) {
  background-color: #f3f4f6 !important;
  color: #374151 !important;
}

.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.category-flow {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-panel {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.category-selection-list {
  max-height: 26rem;
  overflow-y: auto;
}

.category-selection-list .list-group-item {
  color: var(--app-text-black);
  border-color: #dee2e6;
}

.category-selection-list .list-group-item.active {
  background: var(--app-action-dark-bg);
  border-color: var(--app-action-dark-bg);
  color: #fff;
}

.category-selection-list .list-group-item.active .text-muted,
.category-selection-list .list-group-item.active small,
.category-selection-list .list-group-item.active .fw-semibold,
.category-selection-list .list-group-item.active strong {
  color: #fff !important;
}

.category-panel:hover {
  border-color: #d0d7de;
  box-shadow: 0 0.35rem 0.8rem rgba(0, 0, 0, 0.06);
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

.category-selected-pill {
  padding: 0.2rem 0.45rem;
  border: 1px solid rgba(0, 0, 0, 0.2);
  color: var(--app-text-black);
  background: rgba(0, 0, 0, 0.08);
}

.category-selection-list .list-group-item.active .category-selected-pill {
  border-color: rgba(255, 255, 255, 0.3);
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
}

.category-count-pill {
  padding: 0.2rem 0.45rem;
  color: #4f5b66;
  background: #f3f4f6;
}

.category-summary {
  background: #f8fbff;
  border-color: #d8e8ff !important;
}

.subcategory-panel-enter-active,
.subcategory-panel-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.24s ease;
}

.subcategory-panel-enter-from,
.subcategory-panel-leave-to {
  opacity: 0;
  transform: translateX(18px);
}

.subcategory-panel-enter-to,
.subcategory-panel-leave-from {
  opacity: 1;
  transform: translateX(0);
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
