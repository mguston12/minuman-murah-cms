<template>
  <div class="login-page">
    <main>
      <div class="container">
        <section
          class="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4"
        >
          <div class="container">
            <div class="row justify-content-center">
              <div
                class="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center"
              >
                <div class="d-flex justify-content-center py-4">
                  <NuxtLink
                    to="/"
                    class="logo d-flex align-items-center w-auto"
                  >
                    <img
                      :src="logoUrl || '/assets/img/logo.png'"
                      :alt="`${appName} Logo`"
                      @error="handleLogoError"
                    />
                  </NuxtLink>
                </div>

                <div class="card mb-3 w-100">
                  <div class="card-body">
                    <div class="pt-4 pb-2">
                      <h5 class="card-title text-center pb-0 fs-4">
                        Login to Dashboard
                      </h5>
                      <p class="text-center small">
                        Enter your email & password to login
                      </p>
                    </div>

                    <div
                      v-if="successMessage"
                      class="alert alert-success alert-dismissible fade show"
                      role="alert"
                    >
                      <i class="bi bi-check-circle me-2"></i>
                      {{ successMessage }}
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="alert"
                        aria-label="Close"
                      ></button>
                    </div>

                    <div
                      v-if="localError"
                      class="alert alert-danger alert-dismissible fade show"
                      role="alert"
                    >
                      <i class="bi bi-exclamation-circle me-2"></i>
                      {{ localError }}
                      <button
                        type="button"
                        class="btn-close"
                        @click="clearError"
                        aria-label="Close"
                      ></button>
                    </div>

                    <form @submit.prevent="handleLogin" class="row g-3">
                      <div class="col-12">
                        <label for="email" class="form-label"
                          >Email Address</label
                        >
                        <div class="input-group has-validation">
                          <span class="input-group-text rounded-end-0">
                            <i class="bi bi-envelope"></i>
                          </span>
                          <input
                            v-model="formData.email"
                            type="email"
                            class="form-control"
                            id="email"
                            placeholder="your@email.com"
                            required
                            :disabled="isLoading"
                          />
                        </div>
                      </div>

                      <div class="col-12">
                        <label for="password" class="form-label"
                          >Password</label
                        >
                        <div class="input-group has-validation">
                          <span class="input-group-text">
                            <i class="bi bi-lock"></i>
                          </span>
                          <input
                            v-model="formData.password"
                            :type="showPassword ? 'text' : 'password'"
                            class="form-control rounded-end-0"
                            id="password"
                            placeholder="Enter password"
                            required
                            :disabled="isLoading"
                          />

                          <button
                            type="button"
                            class="input-group-text"
                            @click="togglePassword"
                            :disabled="isLoading"
                            style="cursor: pointer"
                          >
                            <i
                              :class="
                                showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'
                              "
                            ></i>
                          </button>
                        </div>
                      </div>

                      <div
                        class="col-12 d-flex justify-content-between align-items-center"
                      >
                        <div class="form-check">
                          <input
                            v-model="formData.rememberMe"
                            class="form-check-input"
                            type="checkbox"
                            id="rememberMe"
                          />
                          <label class="form-check-label" for="rememberMe">
                            Remember me
                          </label>
                        </div>
                        <NuxtLink
                          to="/forgot-password"
                          class="small text-primary"
                        >
                          Forgot password?
                        </NuxtLink>
                      </div>

                      <div class="col-12">
                        <button
                          type="submit"
                          class="btn btn-auth-dark w-100"
                          :disabled="isLoading"
                        >
                          <span
                            v-if="isLoading"
                            class="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          {{ isLoading ? "Logging in..." : "Login" }}
                        </button>
                      </div>

                      <div class="col-12">
                        <p class="small mb-0">
                          Don't have account?
                          <NuxtLink to="/register" class="text-primary fw-bold">
                            Create an account
                          </NuxtLink>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>

                <div class="credits"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <a
      href="#"
      class="back-to-top d-flex align-items-center justify-content-center"
    >
      <i class="bi bi-arrow-up-short"></i>
    </a>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { navigateTo } from "#app";
import { useAuth } from "~/composables/useAuth";

definePageMeta({
  middleware: "guest",
});

useAppTitle("Login");

const route = useRoute();
const { login } = useAuth();
const token = useCookie("auth_token");
const { appName, logoUrl, loadAppIdentity } = useAppIdentity();

const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleLogoError = () => {
  logoUrl.value = "/assets/img/logo.png";
};

const loadLogo = async () => {
  await loadAppIdentity();
};

onMounted(() => {
  loadLogo();
});

const isLoading = ref(false);
let isMounted = true;

const error = ref("");
const localError = computed(() => error.value || "");

const clearError = () => {
  error.value = "";
};

const formData = ref({
  email: "",
  password: "",
  rememberMe: false,
});

const successMessage = ref("");

onMounted(() => {
  clearError();

  if (route.query.registered === "true") {
    successMessage.value =
      "Registration successful! Please login with your credentials.";

    setTimeout(() => {
      successMessage.value = "";
    }, 5000);
  }
});

const handleLogin = async () => {
  if (!formData.value?.email || !formData.value?.password) {
    return;
  }

  if (!isMounted) return;

  isLoading.value = true;
  error.value = "";
  successMessage.value = "";

  try {
    const result = await login(formData.value.email, formData.value.password);

    if (!isMounted) return;

    if (!result.success || result.error) {
      if (isMounted) {
        // Display the error message from API response
        error.value = result.error?.message || "Login failed";

        // Check for email not verified status
        const errorData = result.error?.data;
        if (
          errorData?.status === "email_not_verified" ||
          result.error?.message?.toLowerCase().includes("email not verified") ||
          result.error?.message
            ?.toLowerCase()
            .includes("email belum diverifikasi")
        ) {
          // Redirect to resend verification page after showing message
          setTimeout(() => {
            if (isMounted && typeof window !== "undefined") {
              const email = errorData?.email || formData.value.email;
              window.location.href = `/resend-verification?email=${encodeURIComponent(email)}`;
            }
          }, 3000); // Give user time to read the message
        }

        isLoading.value = false;
      }
    } else {
      if (formData.value.rememberMe && isMounted) {
        const rememberedEmailCookie = useCookie<string>("remembered_email", {
          maxAge: 60 * 60 * 24 * 30,
          path: "/",
        });
        rememberedEmailCookie.value = formData.value.email;
      }

      await nextTick();

      if (!isMounted) return;

      // CMS Login: Only allow Admin/Super Admin/Manager roles
      const allowedRoles = ["Super Admin", "Admin", "Manager"];
      const userRoles = result.data?.user?.roles || [];
      const hasAdminAccess = userRoles.some((role: any) => {
        const roleName = typeof role === "string" ? role : role?.name;
        return roleName && allowedRoles.includes(roleName);
      });

      // Block login if user is not admin
      if (!hasAdminAccess) {
        if (isMounted) {
          error.value = "Akses ditolak. Hanya Admin yang dapat mengakses CMS.";
          isLoading.value = false;

          // Clear token and user data without redirect
          token.value = null;
          // User state will be cleared automatically when token is null
        }
        return;
      }

      const redirectPath = "/dashboard";

      if (isMounted) {
        isLoading.value = false;
      }

      // Wait a bit to ensure token is saved to cookie
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (!isMounted) return;

      // Use navigateTo instead of window.location.href to preserve state
      try {
        await navigateTo(redirectPath);
      } catch (err) {
        console.error("Navigation error:", err);
        // Fallback to hard redirect if navigateTo fails
        if (typeof window !== "undefined") {
          window.location.href = redirectPath;
        }
      }
    }
  } catch (err) {
    if (isMounted) {
      error.value = err instanceof Error ? err.message : "Login failed";
      isLoading.value = false;
    }
  }
};

onMounted(() => {
  isMounted = true;

  const rememberedEmailCookie = useCookie<string>("remembered_email");

  if (rememberedEmailCookie.value && formData.value) {
    formData.value.email = rememberedEmailCookie.value;
    formData.value.rememberMe = true;
  }
});

onBeforeUnmount(() => {
  isMounted = false;
  isLoading.value = false;
});
</script>

<style scoped>
.btn-auth-dark {
  background-color: #1E1E1E !important;
  border-color: #1E1E1E;
  color: #ffffff;
}

.btn-auth-dark:hover,
.btn-auth-dark:focus {
  background-color: #1E1E1E;
  border-color: #1E1E1E;
  color: #ffffff;
}

.btn-auth-dark:disabled {
  background-color: #1E1E1E;
  border-color: #1E1E1E;
  color: #ffffff;
  opacity: 0.7;
}
</style>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #f6f9fc;
  color: #1E1E1E;
}

.register {
  background: #f6f9fc;
}

.logo {
  text-decoration: none;
  color: #1E1E1E;
  font-weight: 700;
  font-size: 26px;
}

.logo span {
  color: #1E1E1E;
}

.card {
  box-shadow: 0 0 21px rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 10px;
}

.card-body {
  padding: 30px;
}

.card-title,
.form-label,
.form-check-label,
.small,
p,
.form-control {
  color: #1E1E1E;
}

.input-group-text {
  background-color: transparent;
  border: 1px solid #dee2e6;
  color: #1E1E1E;
}

.form-control {
  border: 1px solid #dee2e6;
  padding: 10px 15px;
  font-size: 14px;
}

.form-control:focus {
  border-color: #1E1E1E;
  box-shadow: 0 0 0 0.2rem rgba(17, 17, 17, 0.2);
}

.btn-primary {
  background-color: #1E1E1E;
  border-color: #1E1E1E;
  padding: 10px 20px;
  font-weight: 600;
}

.btn-primary:hover {
  background-color: #1E1E1E;
  border-color: #1E1E1E;
}

.btn-primary:disabled {
  background-color: #ccc;
  border-color: #ccc;
  cursor: not-allowed;
}

.text-primary {
  color: #1E1E1E !important;
}

.fw-bold {
  font-weight: 600 !important;
}

.credits {
  text-align: center;
  margin-top: 30px;
  font-size: 13px;
  color: #4f5b66;
}

.credits a {
  color: #1E1E1E;
  text-decoration: none;
}

.credits a:hover {
  text-decoration: underline;
}

.back-to-top {
  position: fixed;
  visibility: hidden;
  opacity: 0;
  right: 15px;
  bottom: 15px;
  z-index: 996;
  background: #012970;
  width: 40px;
  height: 40px;
  border-radius: 50px;
  transition: all 0.4s;
  color: #fff;
}

.back-to-top.active {
  visibility: visible;
  opacity: 1;
}

.back-to-top:hover {
  background: #080c63;
  bottom: 20px;
}
</style>
