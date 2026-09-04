/**
 * Auth API composable
 * Handles all authentication-related API calls
 */
import type {
  RegisterPayload,
  LoginPayload,
  AuthResponse,
  UserResponse,
} from "~/types/auth";

export const useAuthApi = () => {
  const { baseURL, token, getHeaders } = useApiBase();

  const register = async (data: RegisterPayload) => {
    try {
      const response = await $fetch<AuthResponse>(`${baseURL}/auth/register`, {
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

  const login = async (data: LoginPayload) => {
    try {
      const response = await $fetch<AuthResponse>(`${baseURL}/auth/login`, {
        method: "POST",
        body: data,
        headers: getHeaders(),
      });

      return { data: response, error: null };
    } catch (error: any) {
      const errorData = error.data || error.response?._data || null;

      return {
        data: null,
        error: errorData || {
          message: error.message || "An error occurred",
          errors: error.data?.errors || {},
        },
      };
    }
  };

  const logout = async () => {
    try {
      await $fetch(`${baseURL}/auth/logout`, {
        method: "POST",
        headers: getHeaders(),
      });
      token.value = null;
      return { data: { success: true }, error: null };
    } catch (error: any) {
      token.value = null;
      return {
        data: null,
        error: error.data || {
          message: error.message || "An error occurred",
        },
      };
    }
  };

  // getMe tunggal dengan dukungan customHeaders & penanganan status code
  const getMe = async (customHeaders: Record<string, string> = {}) => {
    try {
      const response = await $fetch<UserResponse>(`${baseURL}/auth/me`, {
        method: "GET",
        headers: {
          ...getHeaders(),
          ...customHeaders,
        },
      });
      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: {
          status: error.status || error.statusCode || error.response?.status,
          message: error.data?.message || error.message || "An error occurred",
          data: error.data || null,
        },
      };
    }
  };

  const verifyEmail = async (emailToken: string, email: string) => {
    try {
      const response = await $fetch<AuthResponse>(
        `${baseURL}/auth/verify-email/${emailToken}?email=${encodeURIComponent(email)}`,
        {
          method: "GET",
          headers: getHeaders(),
        },
      );
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

  const resendVerificationEmail = async (email: string) => {
    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
      }>(`${baseURL}/auth/resend-verification-email`, {
        method: "POST",
        body: { email },
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

  const forgotPassword = async (email: string) => {
    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
      }>(`${baseURL}/cms/auth/forgot-password`, {
        method: "POST",
        body: { email },
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

  const resetPassword = async (
    token: string,
    email: string,
    password: string,
    passwordConfirmation: string,
  ) => {
    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
      }>(`${baseURL}/auth/reset-password/${token}`, {
        method: "POST",
        body: {
          email,
          password,
          password_confirmation: passwordConfirmation,
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

  return {
    register,
    login,
    logout,
    getMe,
    verifyEmail,
    resendVerificationEmail,
    forgotPassword,
    resetPassword,
  };
};