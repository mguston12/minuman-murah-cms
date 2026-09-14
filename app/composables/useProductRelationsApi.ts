/**
 * Product Relations API composable
 * Handles all product-related API calls for images, variants, categories, prices
 */
import type { Product } from "~/types/product";

export const useProductRelationsApi = () => {
  const { baseURL, getHeaders } = useApiBase();

  // ==================== Product Images ====================
  const getProductImages = async (productId: number) => {
    try {
      const response = await $fetch<{
        success: boolean;
        data: {
          images: Array<{
            id: number;
            fk_product_id: number;
            path: string;
            order_number: number;
            created_at?: string;
            updated_at?: string;
          }>;
        };
      }>(`${baseURL}/product-images/product/${productId}`, {
        method: "GET",
        headers: getHeaders(),
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
        },
      };
    }
  };

  const uploadProductImage = async (
    productId: number,
    file: File,
    orderNumber: number = 0,
    isFeatured: boolean = false,
  ) => {
    try {
      const formData = new FormData();
      formData.append("fk_product_id", productId.toString());
      formData.append("image", file);
      formData.append("order_number", orderNumber.toString());
      formData.append("is_featured", isFeatured ? "1" : "0");

      const headers = getHeaders();
      // Remove Content-Type header for FormData, browser will set it with boundary
      const { "Content-Type": _, ...headersWithoutContentType } =
        headers as any;

      const response = await $fetch<{
        success: boolean;
        data: {
          image: {
            id: number;
            path: string;
            order_number: number;
          };
        };
      }>(`${baseURL}/product-images-upload/single`, {
        method: "POST",
        body: formData,
        headers: headersWithoutContentType,
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
        },
      };
    }
  };

  const updateProductImageOrder = async (
    imageId: number,
    orderNumber: number,
  ) => {
    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
      }>(`${baseURL}/product-images/${imageId}`, {
        method: "PUT",
        body: {
          order_number: orderNumber,
        },
        headers: getHeaders(),
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
        },
      };
    }
  };

  const deleteProductImage = async (imageId: number) => {
    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
      }>(`${baseURL}/product-images-upload/${imageId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
        },
      };
    }
  };

  const setFeaturedImage = async (imageId: number) => {
    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
        data: {
          id: number;
          fk_product_id: number;
          path: string;
          order_number: number;
          is_featured: boolean;
        };
      }>(`${baseURL}/product-images/${imageId}/set-featured`, {
        method: "POST",
        headers: getHeaders(),
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
        },
      };
    }
  };

  // ==================== Product Variants ====================
  const getProductVariants = async (productId: number) => {
    try {
      const response = await $fetch<{
        success: boolean;
        data: {
          variants: Array<{
            id: number;
            fk_product_id: number;
            fk_attribute_parent_id?: number | null;
            fk_attribute_child_id?: number | null;
            sku?: string | null;
            image_path?: string | null;
            price?: number | null;
            discount?: number | null;
            is_ignore_stock: boolean;
            status: "ACTIVE" | "INACTIVE";
            weight?: number | null;
            type_weight?: "GRAM" | "KG" | null;
            created_at?: string;
            updated_at?: string;
          }>;
        };
      }>(`${baseURL}/product-variants/product/${productId}`, {
        method: "GET",
        headers: getHeaders(),
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
        },
      };
    }
  };

  const createProductVariant = async (data: {
    fk_product_id: number;
    fk_attribute_parent_id?: number | null;
    fk_attribute_child_id?: number | null;
    variant_name?: string | null;
    attribute_value_ids?: number[];
    color?: string | null;
    size?: string | null;
    model?: string | null;
    sku?: string | null;
    image_path?: string | null;
    price?: number | null;
    discount?: number | null;
    strike_price?: number | null;
    is_ignore_stock?: boolean;
    status?: "ACTIVE" | "INACTIVE";
    weight?: number | null;
    type_weight?: "GRAM" | "KG" | null;
  }) => {
    try {
      const response = await $fetch<{
        success: boolean;
        data: {
          variant?: any;
          id?: number;
        };
      }>(`${baseURL}/product-variants`, {
        method: "POST",
        body: data,
        headers: getHeaders(),
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
          errors: error.data?.errors || {},
        },
      };
    }
  };

  const updateProductVariant = async (
    variantId: number,
    data: {
      fk_attribute_parent_id?: number | null;
      fk_attribute_child_id?: number | null;
      variant_name?: string | null;
      attribute_value_ids?: number[];
      color?: string | null;
      size?: string | null;
      model?: string | null;
      sku?: string | null;
      image_path?: string | null;
      price?: number | null;
      discount?: number | null;
      strike_price?: number | null;
      is_ignore_stock?: boolean;
      status?: "ACTIVE" | "INACTIVE";
      weight?: number | null;
      type_weight?: "GRAM" | "KG" | null;
    },
  ) => {
    try {
      const response = await $fetch<{
        success: boolean;
        data: {
          variant: any;
        };
      }>(`${baseURL}/product-variants/${variantId}`, {
        method: "PUT",
        body: data,
        headers: getHeaders(),
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
          errors: error.data?.errors || {},
        },
      };
    }
  };

  const deleteProductVariant = async (variantId: number) => {
    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
      }>(`${baseURL}/product-variants/${variantId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
        },
      };
    }
  };

  const uploadVariantImage = async (productId: number, file: File) => {
    try {
      const formData = new FormData();
      formData.append("fk_product_id", productId.toString());
      formData.append("image", file);

      const headers = getHeaders();
      // Remove Content-Type header for FormData, browser will set it with boundary
      const { "Content-Type": _, ...headersWithoutContentType } =
        headers as any;

      const response = await $fetch<{
        success: boolean;
        data: {
          path: string;
          url: string;
        };
      }>(`${baseURL}/product-variants/upload-image`, {
        method: "POST",
        body: formData,
        headers: headersWithoutContentType,
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
        },
      };
    }
  };

  // ==================== Store Variant Stocks ====================
  const getVariantStoreStocks = async (variantId: number) => {
    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
        data: Array<{
          id: number;
          variant_id: number;
          store_id: number;
          qty: number;
          reserved_qty: number;
          store?: {
            id: number;
            name: string;
            code?: string;
          };
          created_at?: string;
          updated_at?: string;
        }>;
      }>(`${baseURL}/product-variants/${variantId}/store-stocks`, {
        method: "GET",
        headers: getHeaders(),
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
        },
      };
    }
  };

  const createOrUpdateVariantStoreStock = async (
    variantId: number,
    data: {
      store_id: number;
      qty: number;
      reserved_qty?: number;
    },
  ) => {
    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
        data: {
          id: number;
          variant_id: number;
          store_id: number;
          qty: number;
          reserved_qty: number;
          store?: {
            id: number;
            name: string;
            code?: string;
          };
        };
      }>(`${baseURL}/product-variants/${variantId}/store-stocks`, {
        method: "POST",
        body: data,
        headers: getHeaders(),
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
          errors: error.data?.errors || {},
        },
      };
    }
  };

  const deleteVariantStoreStock = async (
    variantId: number,
    storeId: number,
  ) => {
    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
      }>(`${baseURL}/product-variants/${variantId}/store-stocks/${storeId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
        },
      };
    }
  };

  // ==================== Product Categories ====================
  const getProductCategories = async (productId: number) => {
    try {
      const response = await $fetch<{
        success: boolean;
        data: {
          categories: Array<{
            id: number;
            fk_product_id: number;
            fk_category_id: number;
          }>;
        };
      }>(`${baseURL}/category-products/product/${productId}`, {
        method: "GET",
        headers: getHeaders(),
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
        },
      };
    }
  };

  const attachProductCategories = async (
    productId: number,
    categoryIds: number[],
  ) => {
    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
      }>(`${baseURL}/category-products/attach`, {
        method: "POST",
        body: {
          fk_product_id: productId,
          category_ids: categoryIds,
        },
        headers: getHeaders(),
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
        },
      };
    }
  };

  const detachProductCategories = async (
    productId: number,
    categoryIds: number[],
  ) => {
    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
      }>(`${baseURL}/category-products/detach`, {
        method: "POST",
        body: {
          fk_product_id: productId,
          category_ids: categoryIds,
        },
        headers: getHeaders(),
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
        },
      };
    }
  };

  // ==================== Product Brands ====================
  const getProductBrands = async (productId: number) => {
    try {
      const response = await $fetch<{
        success: boolean;
        data: {
          brands: Array<{
            id: number;
            fk_product_id: number;
            fk_brand_id: number;
            brand?: {
              id: number;
              name: string;
              description?: string;
            };
          }>;
        };
      }>(`${baseURL}/brand-products/product/${productId}`, {
        method: "GET",
        headers: getHeaders(),
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
        },
      };
    }
  };

  const attachProductBrands = async (productId: number, brandIds: number[]) => {
    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
      }>(`${baseURL}/brand-products/attach`, {
        method: "POST",
        body: {
          fk_product_id: productId,
          brand_ids: brandIds,
        },
        headers: getHeaders(),
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
        },
      };
    }
  };

  const detachProductBrands = async (productId: number, brandIds: number[]) => {
    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
      }>(`${baseURL}/brand-products/detach`, {
        method: "POST",
        body: {
          fk_product_id: productId,
          brand_ids: brandIds,
        },
        headers: getHeaders(),
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
        },
      };
    }
  };

  // ==================== Product Prices ====================
  const getProductPrices = async (productId: number) => {
    try {
      const response = await $fetch<{
        success: boolean;
        data: {
          prices: Array<{
            id: number;
            fk_product_id: number;
            start_qty: number;
            price: number;
            discount?: number | null;
            created_at?: string;
            updated_at?: string;
          }>;
        };
      }>(`${baseURL}/product-prices/product/${productId}`, {
        method: "GET",
        headers: getHeaders(),
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
        },
      };
    }
  };

  const createProductPrice = async (data: {
    fk_product_id: number;
    start_qty: number;
    price: number;
    discount?: number | null;
  }) => {
    try {
      const response = await $fetch<{
        success: boolean;
        data: {
          price: any;
        };
      }>(`${baseURL}/product-prices`, {
        method: "POST",
        body: data,
        headers: getHeaders(),
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
          errors: error.data?.errors || {},
        },
      };
    }
  };

  const updateProductPrice = async (
    priceId: number,
    data: {
      start_qty?: number;
      price?: number;
      discount?: number | null;
    },
  ) => {
    try {
      const response = await $fetch<{
        success: boolean;
        data: {
          price: any;
        };
      }>(`${baseURL}/product-prices/${priceId}`, {
        method: "PUT",
        body: data,
        headers: getHeaders(),
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
          errors: error.data?.errors || {},
        },
      };
    }
  };

  const deleteProductPrice = async (priceId: number) => {
    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
      }>(`${baseURL}/product-prices/${priceId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
        },
      };
    }
  };

  // ==================== TaxoList (Categories & Collections) ====================
  const getTaxoListsByType = async (type: number) => {
    try {
      const response = await $fetch<{
        success: boolean;
        data: {
          taxo_lists: Array<{
            id: number;
            parent?: number | null;
            taxonomy_ref_key?: string | null;
            taxonomy_name: string;
            taxonomy_description?: string | null;
            taxonomy_slug?: string | null;
            taxonomy_type: number;
            taxonomy_image?: string | null;
            taxonomy_sort?: number | null;
            taxonomy_status?: string | null;
          }>;
        };
      }>(`${baseURL}/taxo-lists/type/${type}`, {
        method: "GET",
        headers: getHeaders(),
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
        },
      };
    }
  };

  const createTaxoList = async (data: {
    parent?: number | null;
    taxonomy_ref_key?: number | null;
    taxonomy_name: string;
    taxonomy_description?: string | null;
    taxonomy_slug?: string | null;
    taxonomy_type: number;
    taxonomy_image?: string | null;
    taxonomy_sort?: number | null;
    taxonomy_status?: "ACTIVE" | "INACTIVE";
  }) => {
    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
        data: {
          id: number;
          parent?: number | null;
          taxonomy_ref_key?: number | null;
          taxonomy_name: string;
          taxonomy_description?: string | null;
          taxonomy_slug?: string | null;
          taxonomy_type: number;
          taxonomy_image?: string | null;
          taxonomy_sort?: number | null;
          taxonomy_status?: string | null;
        };
      }>(`${baseURL}/taxo-lists`, {
        method: "POST",
        body: data,
        headers: getHeaders(),
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
          errors: error.data?.errors || {},
        },
      };
    }
  };

  // ==================== Brands ====================
  const getBrands = async () => {
    try {
      const response = await $fetch<{
        success: boolean;
        data: {
          brands: Array<{
            id: number;
            name: string;
            slug?: string;
            description?: string | null;
            logo?: string | null;
            status?: "ACTIVE" | "INACTIVE";
            created_at?: string;
            updated_at?: string;
          }>;
        };
      }>(`${baseURL}/brands/all`, {
        method: "GET",
        headers: getHeaders(),
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
        },
      };
    }
  };

  const createBrand = async (data: {
    name: string;
    slug?: string;
    description?: string | null;
    logo?: string | null;
    status?: "ACTIVE" | "INACTIVE";
  }) => {
    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
        data: {
          brand: {
            id: number;
            name: string;
            slug?: string;
            description?: string | null;
            logo?: string | null;
            status?: string;
          };
        };
      }>(`${baseURL}/brands`, {
        method: "POST",
        body: data,
        headers: getHeaders(),
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
          errors: error.data?.errors || {},
        },
      };
    }
  };

  const updateTaxoList = async (
    id: number,
    data:
      | {
          parent?: number | null;
          taxonomy_ref_key?: number | null;
          taxonomy_name?: string;
          taxonomy_description?: string | null;
          taxonomy_slug?: string | null;
          taxonomy_type?: number;
          taxonomy_image?: string | null;
          taxonomy_sort?: number | null;
          taxonomy_status?: "ACTIVE" | "INACTIVE";
        }
      | FormData,
  ) => {
    try {
      const isFormData = data instanceof FormData;
      const headers = getHeaders();
      // Untuk FormData, hapus Content-Type biar browser yang set (dengan boundary-nya)
      const { "Content-Type": _, ...headersWithoutContentType } =
        headers as any;

      const response = await $fetch<{
        success: boolean;
        message: string;
        data: {
          id: number;
          parent?: number | null;
          taxonomy_ref_key?: number | null;
          taxonomy_name: string;
          taxonomy_description?: string | null;
          taxonomy_slug?: string | null;
          taxonomy_type: number;
          taxonomy_image?: string | null;
          taxonomy_sort?: number | null;
          taxonomy_status?: string | null;
        };
      }>(`${baseURL}/taxo-lists/${id}`, {
        method: isFormData ? "POST" : "PUT",
        body: data,
        headers: isFormData ? headersWithoutContentType : headers,
      });

      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
          errors: error.data?.errors || {},
        },
      };
    }
  };

  const deleteTaxoList = async (id: number) => {
    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
      }>(`${baseURL}/taxo-lists/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
        },
      };
    }
  };

  // ==================== Attributes ====================
  const getAttributes = async () => {
    try {
      const response = await $fetch<{
        success: boolean;
        data: Array<{
          id: number;
          name: string;
          slug: string;
          sort: number;
          status: string;
          attribute_values?: Array<{
            id: number;
            attribute_id: number;
            value: string;
            slug: string;
            sort: number;
            status: string;
          }>;
        }>;
      }>(`${baseURL}/attributes`, {
        method: "GET",
        headers: getHeaders(),
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
        },
      };
    }
  };

  const getActiveAttributes = async () => {
    try {
      const response = await $fetch<{
        success: boolean;
        data: Array<{
          id: number;
          name: string;
          slug: string;
          sort: number;
          status: string;
          attribute_values?: Array<{
            id: number;
            attribute_id: number;
            value: string;
            slug: string;
            sort: number;
            status: string;
          }>;
        }>;
      }>(`${baseURL}/attributes/active`, {
        method: "GET",
        headers: getHeaders(),
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
        },
      };
    }
  };

  const createAttribute = async (data: {
    name: string;
    sort?: number;
    status?: string;
  }) => {
    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
        data: any;
      }>(`${baseURL}/attributes`, {
        method: "POST",
        headers: getHeaders(),
        body: data,
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
        },
      };
    }
  };

  const updateAttribute = async (
    id: number,
    data: {
      name: string;
      sort?: number;
      status?: string;
    },
  ) => {
    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
        data: any;
      }>(`${baseURL}/attributes/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: data,
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
        },
      };
    }
  };

  const deleteAttribute = async (id: number) => {
    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
      }>(`${baseURL}/attributes/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
        },
      };
    }
  };

  // ==================== Attribute Values ====================
  const getAttributeValues = async (attributeId?: number) => {
    try {
      const url = attributeId
        ? `${baseURL}/attribute-values/attribute/${attributeId}`
        : `${baseURL}/attribute-values`;
      const response = await $fetch<{
        success: boolean;
        data: Array<{
          id: number;
          attribute_id: number;
          value: string;
          slug: string;
          sort: number;
          status: string;
        }>;
      }>(url, {
        method: "GET",
        headers: getHeaders(),
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
        },
      };
    }
  };

  const createAttributeValue = async (data: {
    attribute_id: number;
    value: string;
    sort?: number;
    status?: string;
  }) => {
    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
        data: any;
      }>(`${baseURL}/attribute-values`, {
        method: "POST",
        headers: getHeaders(),
        body: data,
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
        },
      };
    }
  };

  const updateAttributeValue = async (
    id: number,
    data: {
      value: string;
      sort?: number;
      status?: string;
    },
  ) => {
    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
        data: any;
      }>(`${baseURL}/attribute-values/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: data,
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
        },
      };
    }
  };

  const deleteAttributeValue = async (id: number) => {
    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
      }>(`${baseURL}/attribute-values/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
        },
      };
    }
  };

  // ==================== Product Attributes ====================
  const getProductAttributes = async (productId: number) => {
    try {
      const response = await $fetch<{
        success: boolean;
        data: Array<{
          id: number;
          product_id: number;
          attribute_id: number;
          sort: number;
          attribute: {
            id: number;
            name: string;
            slug: string;
          };
          attribute_values: Array<{
            id: number;
            product_attribute_id: number;
            attribute_value_id: number;
            attribute_value: {
              id: number;
              attribute_id: number;
              value: string;
              slug: string;
            };
          }>;
        }>;
      }>(`${baseURL}/product-attributes/product/${productId}`, {
        method: "GET",
        headers: getHeaders(),
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
        },
      };
    }
  };

  const attachProductAttributes = async (
    productId: number,
    attributes: Array<{
      attribute_id: number;
      sort?: number;
      values: number[];
    }>,
  ) => {
    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
        data: any;
      }>(`${baseURL}/product-attributes/product/${productId}/attach`, {
        method: "POST",
        headers: getHeaders(),
        body: { attributes },
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
        },
      };
    }
  };

  const detachProductAttributes = async (
    productId: number,
    attributeId: number,
  ) => {
    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
      }>(
        `${baseURL}/product-attributes/product/${productId}/attribute/${attributeId}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        },
      );
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || { message: error.message || "An error occurred" },
      };
    }
  };

  return {
    // Images
    getProductImages,
    uploadProductImage,
    updateProductImageOrder,
    deleteProductImage,
    setFeaturedImage,
    // Variants
    getProductVariants,
    createProductVariant,
    updateProductVariant,
    deleteProductVariant,
    uploadVariantImage,
    // Store Variant Stocks
    getVariantStoreStocks,
    createOrUpdateVariantStoreStock,
    deleteVariantStoreStock,
    // Categories
    getProductCategories,
    attachProductCategories,
    detachProductCategories,
    // Product Brands
    getProductBrands,
    attachProductBrands,
    detachProductBrands,
    // Brands
    getBrands,
    createBrand,
    // Prices
    getProductPrices,
    createProductPrice,
    updateProductPrice,
    deleteProductPrice,
    // TaxoList
    getTaxoListsByType,
    createTaxoList,
    updateTaxoList,
    deleteTaxoList,
    // Attributes
    getAttributes,
    getActiveAttributes,
    createAttribute,
    updateAttribute,
    deleteAttribute,
    // Attribute Values
    getAttributeValues,
    createAttributeValue,
    updateAttributeValue,
    deleteAttributeValue,
    // Product Attributes
    getProductAttributes,
    attachProductAttributes,
    detachProductAttributes,
  };
};
