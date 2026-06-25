<template>
  <div class="register-page">
    <!-- Main Section -->
    <main>
      <div class="container">
        <section
          class="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4"
        >
          <div class="container">
            <div class="row justify-content-center">
              <div
                class="col-lg-5 col-md-6 d-flex flex-column align-items-center justify-content-center"
              >
                <!-- Logo -->
                <div class="d-flex justify-content-center py-4">
                  <NuxtLink
                    to="/"
                    class="logo d-flex align-items-center w-auto"
                  >
                    <img
                      :src="logoUrl || '/assets/img/images.png'"
                      :alt="`${appName} Logo`"
                      @error="handleLogoError"
                    />
                  </NuxtLink>
                </div>
                <!-- End Logo -->

                <!-- Alert Messages -->
                <div
                  v-if="showAlert"
                  :class="[
                    'alert',
                    `alert-${alertType === 'success' ? 'success' : alertType === 'error' ? 'danger' : 'warning'}`,
                    'alert-dismissible',
                    'fade',
                    'show',
                    'mb-3',
                    'w-100',
                  ]"
                  role="alert"
                >
                  <i
                    :class="[
                      'bi',
                      'me-2',
                      alertType === 'success'
                        ? 'bi-check-circle'
                        : alertType === 'error'
                          ? 'bi-exclamation-circle'
                          : 'bi-exclamation-triangle',
                    ]"
                  ></i>
                  <strong>{{ alertTitle }}</strong>
                  <br />
                  <small>{{ alertMessage }}</small>
                  <button
                    type="button"
                    class="btn-close"
                    @click="closeAlert"
                    aria-label="Close"
                  ></button>
                </div>

                <!-- Register Card -->
                <div class="card mb-3 w-100">
                  <div class="card-body">
                    <!-- Title -->
                    <div class="pt-4 pb-2">
                      <h5 class="card-title text-center pb-0 fs-4">
                        Create Account
                      </h5>
                      <p class="text-center small">
                        Register new account to get access to dashboard
                      </p>
                    </div>

                    <!-- Register Form -->
                    <form @submit.prevent="handleRegister" class="row g-3">
                      <!-- First Name -->
                      <div class="col-md-6">
                        <label for="firstName" class="form-label"
                          >First Name</label
                        >
                        <input
                          v-model="formData.name"
                          type="text"
                          class="form-control"
                          id="firstName"
                          placeholder="John"
                          required
                          :disabled="isLoading"
                        />
                      </div>

                      <!-- Last Name -->
                      <div class="col-md-6">
                        <label for="lastName" class="form-label"
                          >Last Name</label
                        >
                        <input
                          v-model="formData.last_name"
                          type="text"
                          class="form-control"
                          id="lastName"
                          placeholder="Doe"
                          required
                          :disabled="isLoading"
                        />
                      </div>

                      <!-- Email -->
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

                      <!-- Phone -->
                      <div class="col-12">
                        <label for="phone" class="form-label"
                          >Phone Number</label
                        >
                        <div class="input-group has-validation">
                          <span class="input-group-text rounded-end-0">
                            <i class="bi bi-telephone"></i>
                          </span>
                          <input
                            v-model="formData.phone"
                            type="tel"
                            class="form-control"
                            id="phone"
                            placeholder="+62812345678"
                            required
                            :disabled="isLoading"
                          />
                        </div>
                      </div>

                      <!-- Date of Birth -->
                      <div class="col-md-6">
                        <label for="dob" class="form-label"
                          >Date of Birth</label
                        >
                        <input
                          v-model="formData.dob"
                          type="date"
                          class="form-control"
                          id="dob"
                          required
                          :disabled="isLoading"
                        />
                      </div>

                      <!-- Gender -->
                      <div class="col-md-6">
                        <label for="gender" class="form-label">Gender</label>
                        <select
                          v-model="formData.gender"
                          class="form-select"
                          id="gender"
                          required
                          :disabled="isLoading"
                        >
                          <option value="">Select gender</option>
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                        </select>
                      </div>

                      <!-- Password -->
                      <div class="col-12">
                        <label for="password" class="form-label"
                          >Password</label
                        >
                        <div class="input-group has-validation">
                          <span class="input-group-text rounded-end-0">
                            <i class="bi bi-lock"></i>
                          </span>

                          <input
                            v-model="formData.password"
                            :type="showPassword ? 'text' : 'password'"
                            class="form-control rounded-end-0"
                            id="password"
                            placeholder="Enter password (min 8 characters)"
                            required
                            minlength="8"
                            :disabled="isLoading"
                          />

                          <button
                            type="button"
                            class="input-group-text rounded-start-0 border-start-0"
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
                        <small class="text-muted">Minimum 8 characters</small>
                      </div>

                      <!-- Confirm Password -->
                      <div class="col-12">
                        <label for="passwordConfirm" class="form-label"
                          >Confirm Password</label
                        >
                        <div class="input-group has-validation">
                          <span class="input-group-text rounded-end-0">
                            <i class="bi bi-lock"></i>
                          </span>

                          <input
                            v-model="formData.password_confirmation"
                            :type="showConfirmPassword ? 'text' : 'password'"
                            class="form-control rounded-end-0"
                            id="passwordConfirm"
                            placeholder="Confirm password"
                            required
                            :disabled="isLoading"
                          />

                          <button
                            type="button"
                            class="input-group-text rounded-start-0 border-start-0"
                            @click="toggleConfirmPassword"
                            :disabled="isLoading"
                            style="cursor: pointer"
                          >
                            <i
                              :class="
                                showConfirmPassword
                                  ? 'bi bi-eye-slash'
                                  : 'bi bi-eye'
                              "
                            ></i>
                          </button>
                        </div>
                      </div>

                      <!-- Terms & Conditions -->
                      <div class="col-12">
                        <div class="form-check">
                          <input
                            v-model="formData.agreeTerms"
                            class="form-check-input"
                            type="checkbox"
                            id="agreeTerms"
                            required
                          />
                          <label class="form-check-label" for="agreeTerms">
                            I agree to the terms & conditions
                          </label>
                        </div>
                      </div>

                      <!-- Submit Button -->
                      <div class="col-12">
                        <button
                          type="submit"
                          class="btn btn-auth-dark w-100"
                          :disabled="isLoading || !formData.agreeTerms"
                        >
                          <span
                            v-if="isLoading"
                            class="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          {{
                            isLoading ? "Creating Account..." : "Create Account"
                          }}
                        </button>
                      </div>

                      <!-- Login Link -->
                      <div class="col-12">
                        <p class="small mb-0">
                          Already have account?
                          <NuxtLink to="/login" class="text-primary fw-bold">
                            Login here
                          </NuxtLink>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>

                <!-- Footer Credits -->
                <div class="credits"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- Back to Top -->
    <a
      href="#"
      class="back-to-top d-flex align-items-center justify-content-center"
    >
      <i class="bi bi-arrow-up-short"></i>
    </a>
  </div>
</template>

<script setup lang="ts">
import { navigateTo } from "#app";
import { useAuth } from "~/composables/useAuth";
import { useAuthApi } from "~/composables/useAuthApi";

// Auth
const { isLoading, error, clearError } = useAuth();
const { register: registerApi } = useAuthApi();
const { appName, logoUrl, loadAppIdentity } = useAppIdentity();

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

const handleLogoError = () => {
  logoUrl.value = "/assets/img/images.png";
};

const loadLogo = async () => {
  await loadAppIdentity();
};

onMounted(() => {
  loadLogo();
});

// Local error state (untuk avoid reactivity issue)
const localError = computed(() => error.value);

// Form Data
const formData = ref({
  name: "",
  last_name: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  password: "",
  password_confirmation: "",
  agreeTerms: false,
});

// Alert state
const showAlert = ref(false);
const alertType = ref<"success" | "error" | "warning">("success"); // success, error, warning
const alertTitle = ref("");
const alertMessage = ref("");

const closeAlert = () => {
  showAlert.value = false;
};

// Clear errors on mount
onMounted(() => {
  clearError();
});

// Handle Register
const handleRegister = async () => {
  // Clear previous alerts
  clearError();

  // Validate password match
  if (formData.value.password !== formData.value.password_confirmation) {
    alertType.value = "error";
    alertTitle.value = "Password Tidak Sama";
    alertMessage.value = "Password dan konfirmasi password harus sama!";
    showAlert.value = true;
    console.log("Alert shown for password mismatch");
    return;
  }

  // Validate terms
  if (!formData.value.agreeTerms) {
    alertType.value = "warning";
    alertTitle.value = "Setujui Terms & Conditions";
    alertMessage.value =
      "Anda harus menyetujui syarat dan ketentuan untuk melanjutkan";
    showAlert.value = true;
    console.log("Alert shown for terms not agreed");
    return;
  }

  try {
    isLoading.value = true;

    const { data, error: apiError } = await registerApi({
      name: formData.value.name,
      last_name: formData.value.last_name,
      email: formData.value.email,
      phone: formData.value.phone,
      dob: formData.value.dob,
      gender: formData.value.gender as "MALE" | "FEMALE",
      password: formData.value.password,
      password_confirmation: formData.value.password_confirmation,
    });

    if (apiError || !data?.success) {
      throw new Error(
        apiError?.message || data?.message || "Registration failed",
      );
    }

    if (data.success) {
      // Show success alert
      alertType.value = "success";
      alertTitle.value = "Registrasi Berhasil!";
      alertMessage.value = `Akun Anda telah berhasil dibuat! Silahkan periksa email: ${formData.value.email} untuk menerima link verifikasi akun.`;
      showAlert.value = true;

      // Auto redirect after 3 seconds
      setTimeout(async () => {
        await navigateTo({
          path: "/login",
          query: { registered: "true" },
        });
      }, 3000);
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Registration failed";

    alertType.value = "error";
    alertTitle.value = "Registrasi Gagal";
    alertMessage.value = message;
    showAlert.value = true;
  } finally {
    isLoading.value = false;
  }
};
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
.register-page {
  min-height: 100vh;
  background: #f6f9fc;
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
  color: #080c63;
}

.card {
  box-shadow: 0 0 21px rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 10px;
}

.card-body {
  padding: 30px;
}

.input-group-text {
  background-color: transparent;
  border: 1px solid #dee2e6;
  color: #495057;
}

.form-control,
.form-select {
  border: 1px solid #dee2e6;
  padding: 10px 15px;
  font-size: 14px;
}

.form-control:focus,
.form-select:focus {
  border-color: #012970;
  box-shadow: 0 0 0 0.2rem rgba(1, 41, 112, 0.25);
}

.btn-primary {
  background-color: #012970;
  border-color: #012970;
  padding: 10px 20px;
  font-weight: 600;
}

.btn-primary:hover {
  background-color: #080c63;
  border-color: #080c63;
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

.text-muted {
  color: #4f5b66 !important;
  font-size: 12px;
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

/* Back to Top Button */
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
  border-radius: 50%;
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
