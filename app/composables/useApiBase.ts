/**
 * Base API composable with common utilities
 * Provides shared functionality for all API calls
 */
export const useApiBase = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase || "http://127.0.0.1:8000/api";
  const token = useCookie("auth_token");

  const getHeaders = (isFormData = false) => {
    const headers: Record<string, string> = {
      Accept: "application/json",
    };

    if (token.value) {
      headers["Authorization"] = `Bearer ${token.value}`;
    }

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    return headers;
  };

  return {
    baseURL,
    token,
    getHeaders,
  };
};
