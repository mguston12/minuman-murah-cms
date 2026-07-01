import type {
  ProductGroupsResponse,
  ProductGroupCreatePayload,
  ProductGroupResponse,
  ProductGroupUpdatePayload,
} from "~/types/product-group";

export const useProductGroupApi = () => {
  const { baseURL, getHeaders } = useApiBase();
  const assetBaseURL = baseURL.replace(/\/api\/?$/, "");
  const backendOrigin = (() => {
    try {
      return new URL(assetBaseURL).origin;
    } catch {
      return assetBaseURL;
    }
  })();

  const resolveImageUrl = (value?: string | null) => {
    if (!value) return null;
    if (value.startsWith("data:")) {
      return value;
    }

    if (/^https?:\/\//i.test(value)) {
      try {
        const url = new URL(value);
        const backendUrl = new URL(assetBaseURL);

        // Backend kadang mengirim http://localhost/... tanpa port.
        // Untuk asset lokal, pakai origin backend dari apiBase agar file storage terbaca.
        if (
          url.hostname === backendUrl.hostname &&
          url.port !== backendUrl.port
        ) {
          return `${backendOrigin}${url.pathname}${url.search}${url.hash}`;
        }

        return value;
      } catch {
        return value;
      }
    }

    const normalizedPath = value.startsWith("/") ? value : `/${value}`;
    return `${assetBaseURL}${normalizedPath}`;
  };

  const normalizeProductGroup = <T extends { image?: string | null; image_url?: string | null }>(
    group: T,
  ): T => {
    if (!group) return group;

    const resolvedImageUrl =
      resolveImageUrl(group.image_url) || resolveImageUrl(group.image) || null;

    return {
      ...group,
      image_url: resolvedImageUrl,
    };
  };

  const fetchWithHandling = async <T>(url: string, options: any = {}) => {
    try {
      const response = await $fetch<T>(url, {
        ...options,
        headers: getHeaders(options.isFormData ?? false),
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data || {
          message: error.message || "Terjadi kesalahan",
          errors: error.errors || {},
        },
      };
    }
  };

  const getProductGroups = async (page = 1, search?: string) => {
    let url = `${baseURL}/product-groups?page=${page}`
    if (search && search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`
    }
    const result = await fetchWithHandling<ProductGroupsResponse>(
      url,
      { method: "GET" },
    );

    if (result.data?.data?.data) {
      result.data.data.data = result.data.data.data.map((group) =>
        normalizeProductGroup(group),
      );
    }

    return result;
  };

  const getProductGroup = async (id: number) => {
    const result = await fetchWithHandling<ProductGroupResponse>(
      `${baseURL}/product-groups/${id}`,
      { method: "GET" },
    );

    if (result.data?.data) {
      result.data.data = normalizeProductGroup(result.data.data);
    }

    return result;
  };

  const getProductGroupByKey = async (key: string) => {
    const result = await fetchWithHandling<ProductGroupResponse>(
      `${baseURL}/product-groups/key/${key}`,
      { method: "GET" },
    );

    if (result.data?.data) {
      result.data.data = normalizeProductGroup(result.data.data);
    }

    return result;
  };

  const createProductGroup = async (payload: ProductGroupCreatePayload) => {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("key", payload.key);
    formData.append("status", payload.status);

    if (payload.sort !== undefined) {
      formData.append("sort", payload.sort.toString());
    }

    if (payload.image) {
      formData.append("image", payload.image);
    }

    const result = await fetchWithHandling<ProductGroupResponse>(
      `${baseURL}/product-groups`,
      {
        method: "POST",
        body: formData,
        isFormData: true,
      },
    );

    if (result.data?.data) {
      result.data.data = normalizeProductGroup(result.data.data);
    }

    return result;
  };

  const updateProductGroup = async (
    id: number,
    payload: ProductGroupUpdatePayload & { image?: File | null },
  ) => {
    const formData = new FormData();
    formData.append("_method", "PUT"); // <-- Ini yang penting!
    formData.append("title", payload.title);
    formData.append("key", payload.key);
    formData.append("status", payload.status);

    if (payload.sort !== undefined) {
      formData.append("sort", payload.sort.toString());
    }

    if (payload.image) {
      formData.append("image", payload.image);
    }

    const result = await fetchWithHandling<ProductGroupResponse>(
      `${baseURL}/product-groups/${id}`,
      {
        method: "POST", // <-- Ganti jadi POST
        body: formData,
        isFormData: true,
      },
    );

    if (result.data?.data) {
      result.data.data = normalizeProductGroup(result.data.data);
    }

    return result;
  };

  const deleteProductGroup = async (id: number) => {
    return fetchWithHandling<{ success: boolean; message: string }>(
      `${baseURL}/product-groups/${id}`,
      { method: "DELETE" },
    );
  };

  return {
    getProductGroups,
    getProductGroup,
    getProductGroupByKey,
    createProductGroup,
    updateProductGroup,
    deleteProductGroup,
  };
};
