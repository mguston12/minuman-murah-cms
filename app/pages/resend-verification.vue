<template>
  <div class="resend-verification-page">
    <main>
      <div class="container">
        <section class="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                <!-- Logo -->
                <div class="d-flex justify-content-center py-4">
                  <NuxtLink to="/" class="logo d-flex align-items-center w-auto">
                    <img :src="logoUrl" :alt="`${appName} Logo`" />
                    <span class="d-none d-lg-block">{{ appName }}</span>
                  </NuxtLink>
                </div>

                <!-- Resend Card -->
                <div class="card mb-3 w-100">
                  <div class="card-body">
                    <div class="pt-4 pb-2">
                      <h5 class="card-title text-center pb-0 fs-4">Resend Verification Email</h5>
                      <p class="text-center small">Enter your email to receive verification link</p>
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

                    <!-- Action (no form, single button) -->
                    <div class="row g-3">
                      <div class="col-12">
                        <label class="form-label">Email Address</label>
                        <div class="p-2 border rounded bg-light d-flex align-items-center">
                          <i class="bi bi-envelope me-2"></i>
                          <span>{{ email || 'No email detected' }}</span>
                        </div>
                      </div>

                      <div class="col-12">
                        <button
                          type="button"
                          class="btn btn-primary w-100"
                          :disabled="isLoading || !email"
                          @click="handleResend"
                        >
                          <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          {{ isLoading ? 'Sending...' : 'Send Verification Email' }}
                        </button>
                      </div>

                      <!-- <div  iv class="col-12">
                        <p class="small mb-0">
                          Already verified?
                          <NuxtLink to="/login" class="text-primary fw-bold">
                            Go to login
                          </NuxtLink>
                        </p>
                      </div> -->
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
import { useRoute } from 'vue-router'
import { useAuthApi } from '~/composables/useAuthApi'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  middleware: 'guest'
})

useAppTitle("Resend Verification Email")

// Auth composable
const { user } = useAuth()
const { resendVerificationEmail } = useAuthApi()

// State
const email = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Pre-fill email from query param, logged-in user, or remembered email
onMounted(() => {
const route = useRoute()
const { appName, logoUrl } = useAppIdentity()
  if (route.query.email) {
    email.value = route.query.email as string
  } else if (user.value?.email) {
    email.value = user.value.email
  } else if (process.client) {
    const remembered = localStorage.getItem('remembered_email')
    if (remembered) email.value = remembered
  }
})

// Clear errors
const clearErrors = () => {
  errorMessage.value = ''
}

// Handle resend
const handleResend = async () => {
  if (!email.value) {
    errorMessage.value = 'Email tidak ditemukan. Silakan kembali ke Login.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const { data, error: apiError } = await resendVerificationEmail(email.value)

    if (apiError || !data?.success) {
      throw new Error(apiError?.message || data?.message || 'Failed to send verification email')
    }

    successMessage.value = 'Verification email sent! Check your inbox.'
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to send verification email'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.resend-verification-page {
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
  color: #1E1E1E; !important;
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

