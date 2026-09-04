import type { AuthUser } from "~/types/auth";
import { useAuthApi } from "./useAuthApi";

export const useAuth = () => {
  const token = useCookie("auth_token");
  const user = useState<AuthUser | null>("auth_user", () => null);
  const { login: apiLogin, logout: apiLogout, getMe } = useAuthApi();

  const error = ref<string | null>(null);
  const isLoading = ref(false);

  const clearError = () => {
    error.value = null;
  };

  const isAuthenticated = computed(() => !!token.value && !!user.value);

  const login = async (email: string, password: string) => {
    isLoading.value = true;
    error.value = null;

    const { data, error: apiError } = await apiLogin({ email, password });

    isLoading.value = false;

    if (apiError || !data?.success) {
      const errorResponse = apiError || data;

      const errorMessage =
        errorResponse?.data?.message ||
        errorResponse?.message ||
        "Login failed";

      error.value = errorMessage;
      return {
        success: false,
        error: {
          message: errorMessage,
          data: errorResponse?.data || null,
          errors: errorResponse?.errors || null,
        },
      };
    }

    token.value = data.data?.token || null;
    user.value = data.data?.user || null;

    return { success: true, data: data.data };
  };

  const logout = async () => {
    await apiLogout();
    user.value = null;
    token.value = null;
    navigateTo("/login");
  };

  const fetchUser = async () => {
    if (!token.value) {
      user.value = null;
      return;
    }

    const ssrHeaders = import.meta.server
      ? (useRequestHeaders(["cookie"]) as Record<string, string>)
      : {};

    const { data, error: apiError } = await getMe(ssrHeaders);

    if (apiError || !data?.success) {
      const status =
        apiError?.status || apiError?.statusCode || apiError?.response?.status;
      if (status === 401) {
        token.value = null;
        user.value = null;
      }
      return;
    }

    // Pastikan pemetaan mengarah langsung ke user object
    user.value = data.data?.user || data.data || null;
  };

  const initAuth = async () => {
    if (token.value) {
      await fetchUser();
    } else {
      user.value = null;
    }
  };

  return {
    user,
    isAuthenticated,
    login,
    logout,
    fetchUser,
    initAuth,
    error,
    isLoading,
    clearError,
  };
};
