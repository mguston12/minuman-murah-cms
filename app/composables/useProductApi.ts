/**
 * Product API composable
 * Handles all product-related API calls
 */
import type { ProductsResponse, ProductResponse, ProductCreatePayload, ProductUpdatePayload } from '~/types/product'

export const useProductApi = () => {
  const { baseURL, getHeaders } = useApiBase()

  const getProducts = async (
    page: number = 1,
    perPage: number = 15,
    sortBy?: string,
    sortDirection: 'asc' | 'desc' = 'desc',
    categoryIds?: number[],
    search?: string,
    filters?: {
      isNewArrival?: boolean
      minRating?: number
      minPrice?: number
      maxPrice?: number
      status?: string
      is_freeshiping?: string
    }
  ) => {
    try {
      const params: Record<string, any> = {
        page,
        per_page: perPage,
        ...(sortBy && { sort_by: sortBy }),
        sort_direction: sortDirection,
      }
      
      // Add search query if provided
      if (search && search.trim()) {
        params.search = search.trim()
      }
      
      // Add category_ids if provided
      // Format as comma-separated string for Laravel compatibility
      if (categoryIds && categoryIds.length > 0) {
        params.category_ids = categoryIds.join(',')
      }
      
      // Add filter parameters if provided
      if (filters) {
        if (filters.isNewArrival !== undefined) {
          params.is_new_arrival = filters.isNewArrival
        }
        if (filters.minRating !== undefined && filters.minRating > 0) {
          params.min_rating = filters.minRating
        }
        if (filters.minPrice !== undefined && filters.minPrice > 0) {
          params.min_price = filters.minPrice
        }
        if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
          params.max_price = filters.maxPrice
        }
        if (filters.status) {
          params.status = filters.status
        }
        if (filters.is_freeshiping) {
          params.is_freeshiping = filters.is_freeshiping
        }
      }
      
      const response = await $fetch<ProductsResponse>(`${baseURL}/products`, {
        method: 'GET',
        params,
        headers: getHeaders(),
      })
      return { data: response, error: null }
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || 'An error occurred',
        },
      }
    }
  }

  const getProduct = async (slug: string) => {
    try {
      const response = await $fetch<ProductResponse>(`${baseURL}/products/${slug}`, {
        method: 'GET',
        headers: getHeaders(),
      })
      return { data: response, error: null }
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || 'An error occurred',
        },
      }
    }
  }

  const createProduct = async (data: ProductCreatePayload) => {
    try {
      const response = await $fetch<ProductResponse>(`${baseURL}/products`, {
        method: 'POST',
        body: data,
        headers: getHeaders(),
      })
      return { data: response, error: null }
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || 'An error occurred',
          errors: error.data?.errors || {},
        },
      }
    }
  }

  const updateProduct = async (id: number, data: ProductUpdatePayload) => {
    try {
      const response = await $fetch<ProductResponse>(`${baseURL}/products/${id}`, {
        method: 'PUT',
        body: data,
        headers: getHeaders(),
      })
      return { data: response, error: null }
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || 'An error occurred',
          errors: error.data?.errors || {},
        },
      }
    }
  }

  const deleteProduct = async (id: number) => {
    try {
      const response = await $fetch<{
        success: boolean
        message: string
      }>(`${baseURL}/products/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      })
      return { data: response, error: null }
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || 'An error occurred',
        },
      }
    }
  }

  const getAllProducts = async () => {
    try {
      const response = await $fetch<{
        success: boolean
        data?: {
          products: Array<{
            id: number
            name: string
            slug: string
            base_price?: number | null
            status?: 'PUBLISH' | 'INACTIVE' | 'DRAFT' | null
            categories?: Array<{
              id: number
              product_id: number
              category_id: number
            }>
            variants?: Array<{
              id: number
              sku?: string | null
              price?: number | null
            }>
            created_at?: string
            updated_at?: string
          }>
          total?: number
        }
      }>(`${baseURL}/products`, {
        method: 'GET',
        headers: getHeaders(),
        // Don't include per_page parameter to get all products
      })
      return { data: response, error: null }
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || 'An error occurred',
        },
      }
    }
  }

  return {
    getProducts,
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  }
}

