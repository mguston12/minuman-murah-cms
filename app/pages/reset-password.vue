<template>
  <div class="reset-password-page">
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

                <!-- Reset Password Card -->
                <div class="card mb-3 w-100">
                  <div class="card-body">
                    <!-- Valid Token State -->
                    <div v-if="isTokenValid && !isResetting">
                      <div class="pt-4 pb-2">
                        <h5 class="card-title text-center pb-0 fs-4">Reset Your Password</h5>
                        <p class="text-center small">Enter your new password below</p>
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
                      <form @submit.prevent="handleResetPassword" class="row g-3">
                        <!-- Password -->
                        <div class="col-12">
                          <label for="password" class="form-label">New Password</label>
                          <input
                            v-model="formData.password"
                            type="password"
                            class="form-control"
                            id="password"
                            placeholder="Enter new password (min 8 characters)"
                            required
                            minlength="8"
                            :disabled="isLoading"
                          />
                          <small class="text-muted">Minimum 8 characters</small>
                        </div>

                        <!-- Confirm Password -->
                        <div class="col-12">
                          <label for="passwordConfirm" class="form-label">Confirm Password</label>
                          <input
                            v-model="formData.password_confirmation"
                            type="password"
                            class="form-control"
                            id="passwordConfirm"
                            placeholder="Confirm new password"
                            required
                            :disabled="isLoading"
                          />
                        </div>

                        <!-- Submit Button -->
                        <div class="col-12">
                          <button
                            type="submit"
                            class="btn btn-primary w-100"
                            :disabled="isLoading"
                          >
                            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            {{ isLoading ? 'Resetting Password...' : 'Reset Password' }}
                          </button>
                        </div>

                        <div class="col-12">
                          <p class="small mb-0">
                            <NuxtLink to="/login" class="text-primary fw-bold">
                              Back to login
                            </NuxtLink>
                          </p>
                        </div>
                      </form>
                    </div>

                    <!-- Resetting State -->
                    <div v-else-if="isResetting" class="py-5 text-center">
                      <div class="spinner-border text-primary mb-3" role="status">
                        <span class="visually-hidden">Processing...</span>
                      </div>
                      <h5 class="card-title">Resetting your password...</h5>
                      <p class="text-muted">Please wait while we update your password</p>
                    </div>

                    <!-- Success State -->
                    <div v-else-if="isSuccess" class="py-5 text-center">
                      <div class="success-icon mb-3">
                        <i class="bi bi-check-circle" style="font-size: 3rem; color: #28a745;"></i>
                      </div>
                      <h5 class="card-title mb-2">Password Reset Successfully!</h5>
                      <p class="text-muted mb-4">Your password has been updated. Redirecting to login...</p>
                      <div class="alert alert-success" role="alert">
                        <i class="bi bi-info-circle me-2"></i>
                        Redirecting in {{ redirectCountdown }} seconds...
                      </div>
                    </div>

                    <!-- Invalid Token State -->
                    <div v-else-if="!isTokenValid" class="py-5 text-center">
                      <div class="error-icon mb-3">
                        <i class="bi bi-x-circle" style="font-size: 3rem; color: #dc3545;"></i>
                      </div>
                      <h5 class="card-title mb-2">Invalid Reset Link</h5>
                      <p class="text-muted mb-4">{{ errorMessage || 'The password reset link is invalid or has expired.' }}</p>
                      <div class="d-grid gap-2">
                        <NuxtLink to="/forgot-password" class="btn btn-primary">
                          Request New Reset Link
                        </NuxtLink>
                        <NuxtLink to="/login" class="btn btn-outline-secondary">
                          Back to Login
                        </NuxtLink>
                      </div>
                    </div>
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
import { useRoute, useRouter } from 'vue-router'
import { useAuthApi } from '~/composables/useAuthApi'

definePageMeta({
  middleware: 'guest'
})

useAppTitle("Reset Password")

const { resetPassword } = useAuthApi()
const { appName, logoUrl, loadAppIdentity } = useAppIdentity()

// Router
const route = useRoute()
const router = useRouter()

const handleLogoError = () => {
  logoUrl.value = '/assets/img/images.png'
}

const loadLogo = async () => {
  await loadAppIdentity()
}

// State
const token = ref('')
const email = ref('')
const isTokenValid = ref(false)
const isLoading = ref(false)
const isResetting = ref(false)
const isSuccess = ref(false)
const redirectCountdown = ref(3)
const errorMessage = ref('')
const successMessage = ref('')

const formData = ref({
  password: '',
  password_confirmation: ''
})

// Clear errors
const clearErrors = () => {
  errorMessage.value = ''
}

// Handle reset password
const handleResetPassword = async () => {
  if (!formData.value.password || !formData.value.password_confirmation) {
    errorMessage.value = 'Please fill in all password fields'
    return
  }

  if (formData.value.password !== formData.value.password_confirmation) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  if (formData.value.password.length < 8) {
    errorMessage.value = 'Password must be at least 8 characters'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    console.log('Resetting password with token:', token.value, 'email:', email.value)
    
    const { data, error: apiError } = await resetPassword(
      token.value,
      email.value,
      formData.value.password,
      formData.value.password_confirmation
    )

    console.log('Reset password response:', data)

    if (apiError || !data?.success) {
      throw new Error(apiError?.message || data?.message || 'Failed to reset password')
    }

    if (data.success) {
      isSuccess.value = true
      isLoading.value = false
      successMessage.value = 'Password reset successfully! Redirecting to login...'

      // Auto redirect ke login dalam 3 detik
      const countdown = setInterval(() => {
        redirectCountdown.value--
        if (redirectCountdown.value <= 0) {
          clearInterval(countdown)
          router.push('/login')
        }
      }, 1000)
    }
  } catch (error) {
    console.error('Reset password error:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Password reset failed'
    isLoading.value = false
  }
}

// Validate token on mount
onMounted(() => {
  // Load logo
  loadLogo()
  
  // Validate token
  token.value = route.query.token as string
  email.value = route.query.email as string

  if (token.value && email.value) {
    isTokenValid.value = true
  } else {
    errorMessage.value = 'Invalid or missing reset token'
    isTokenValid.value = false
  }
})
</script>

<style scoped>
.reset-password-page {
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

.btn-outline-secondary {
  color: #495057;
  border-color: #6c757d;
}

.btn-outline-secondary:hover {
  background-color: #6c757d;
  border-color: #6c757d;
  color: #fff;
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

.success-icon,
.error-icon {
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.alert {
  border-radius: 6px;
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

