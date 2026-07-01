interface DashboardSummaryResponse {
  success: boolean
  message?: string
  data: {
    total_products: number
    total_orders: number
    total_vouchers: number
    total_customers: number
  }
}

export const useDashboardApi = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase;

  const getHeaders = () => {
    const token = useCookie("auth_token");
    return {
      Authorization: `Bearer ${token.value}`,
    };
  };

  /**
   * Get dashboard summary (counting cards)
   */
  const getSummary = async () => {
    try {
      const response = await $fetch<DashboardSummaryResponse>(`${baseURL}/dashboard/summary`, {
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

  return {
    getSummary,
  };
};
