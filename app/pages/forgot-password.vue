<template>
  <div class="forgot-password-page">
    <main>
      <div class="container">
        <section class="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                <!-- Logo -->
                <div class="d-flex justify-content-center py-4">
                  <NuxtLink to="/" class="logo d-flex align-items-center w-auto">
                    <img 
                      :src="logoUrl || '/assets/img/images.png'" 
                      :alt="`${appName} Logo`"
                      @error="handleLogoError"
                    />
                  </NuxtLink>
                </div>

                <!-- Forgot Password Card -->
                <div class="card mb-3 w-100">
                  <div class="card-body">
                    <div class="pt-4 pb-2">
                      <h5 class="card-title text-center pb-0 fs-4">Forgot Your Password?</h5>
                      <p class="text-center small">Enter your email to receive password reset link</p>
                    </div>

                    <!-- Alert Messages -->
                    <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
                      <i class="bi bi-check-circle me-2"></i>
                      {{ successMessage }}
                      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>

                    <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
                      <i class="bi bi-exclamation-circle me-2"></i>
                      {{ errorMessage }}
                      <button type="button" class="btn-close" @click="clearErrors" aria-label="Close"></button>
                    </div>

                    <!-- Form -->
                    <form @submit.prevent="handleForgotPassword" class="row g-3">
                      <div class="col-12">
                        <label for="email" class="form-label">Email Address</label>
                        <div class="input-group has-validation">
                          <span class="input-group-text">
                            <i class="bi bi-envelope"></i>
                          </span>
                          <input
                            v-model="email"
                            type="email"
                            class="form-control"
                            id="email"
                            placeholder="your@email.com"
                            required
                            :disabled="isLoading"
                          />
                        </div>
                        <small class="text-muted">We'll send you a link to reset your password</small>
                      </div>

                      <div class="col-12">
                        <button
                          type="submit"
                          class="btn btn-primary w-100"
                          :disabled="isLoading"
                        >
                          <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          {{ isLoading ? 'Sending...' : 'Send Password Reset Link' }}
                        </button>
                      </div>

                      <div class="col-12">
                        <p class="small mb-0">
                          Remember your password?
                          <NuxtLink to="/login" class="text-primary fw-bold">
                            Back to login
                          </NuxtLink>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>

                <!-- Footer -->
                <div class="credits">
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- Back to Top -->
    <a href="#" class="back-to-top d-flex align-items-center justify-content-center">
      <i class="bi bi-arrow-up-short"></i>
    </a>
  </div>
</template>

<script setup lang="ts">
import { useAuthApi } from '~/composables/useAuthApi'

definePageMeta({
  middleware: 'guest'
})

useAppTitle("Forgot Password")

const { forgotPassword } = useAuthApi()
const { appName, logoUrl, loadAppIdentity } = useAppIdentity()

const handleLogoError = () => {
  logoUrl.value = '/assets/img/images.png'
}

const loadLogo = async () => {
  await loadAppIdentity()
}

// State
const email = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Load logo on mount
onMounted(() => {
  loadLogo()
})

// Clear errors
const clearErrors = () => {
  errorMessage.value = ''
}

// Handle forgot password
const handleForgotPassword = async () => {
  if (!email.value) return

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const { data, error: apiError } = await forgotPassword(email.value)

    if (apiError || !data?.success) {
      throw new Error(apiError?.message || data?.message || 'Failed to send password reset link')
    }

    successMessage.value = 'Password reset link sent! Check your email inbox.'
    email.value = ''
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to send password reset link'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.forgot-password-page {
  background: #f6f9fc;
  min-height: 100vh;
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

.form-control {
  border: 1px solid #dee2e6;
  padding: 10px 15px;
  font-size: 14px;
}

.form-control:focus {
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

