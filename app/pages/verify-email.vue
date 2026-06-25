    <template>
  <div class="verify-email-page">
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

                <!-- Verification Card -->
                <div class="card mb-3 w-100">
                  <div class="card-body text-center">
                    <!-- Loading State -->
                    <div v-if="isVerifying" class="py-5">
                      <div class="spinner-border text-primary mb-3" role="status">
                        <span class="visually-hidden">Verifying...</span>
                      </div>
                      <h5 class="card-title">Verifying your email...</h5>
                      <p class="text-muted">Please wait while we verify your email address</p>
                    </div>

                    <!-- Success State -->
                    <div v-else-if="isSuccess" class="py-5">
                      <div class="success-icon mb-3">
                        <i class="bi bi-check-circle" style="font-size: 3rem; color: #28a745;"></i>
                      </div>
                      <h5 class="card-title mb-2">Email Verified Successfully!</h5>
                      <p class="text-muted mb-4">Your email has been verified. Redirecting to dashboard...</p>
                      <div class="alert alert-success" role="alert">
                        <i class="bi bi-info-circle me-2"></i>
                        Redirecting in {{ redirectCountdown }} seconds...
                      </div>
                    </div>

                    <!-- Error State -->
                    <div v-else-if="verificationError" class="py-5">
                      <div class="error-icon mb-3">
                        <i class="bi bi-x-circle" style="font-size: 3rem; color: #dc3545;"></i>
                      </div>
                      <h5 class="card-title mb-2">Verification Failed</h5>
                      <p class="text-muted mb-4">{{ verificationError }}</p>
                      <div class="d-grid gap-2">
                        <NuxtLink :to="{ path: '/resend-verification', query: { email: emailRef } }" class="btn btn-primary">
                          Resend Verification Email
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
import type { AuthUser } from '~/types/auth'
import { useRoute, useRouter } from 'vue-router'
import { useAuthApi } from '~/composables/useAuthApi'

definePageMeta({
  middleware: 'guest'
})

useAppTitle("Verify Email")

// Router
const route = useRoute()
const router = useRouter()
const { appName, logoUrl } = useAppIdentity()

// Auth state (using same pattern as useAuth composable)
const token = useCookie('auth_token')
const user = useState<AuthUser | null>('auth_user', () => null)

// API
const { verifyEmail } = useAuthApi()

// State
const isVerifying = ref(true)
const isSuccess = ref(false)
const verificationError = ref('')
const redirectCountdown = ref(3)
const emailRef = ref('')

// Verify email on mount
onMounted(async () => {
  const emailToken = route.query.token as string
  const email = route.query.email as string
  emailRef.value = email || ''

  if (!emailToken || !email) {
    verificationError.value = 'Invalid verification link. Missing token or email.'
    isVerifying.value = false
    return
  }

  try {
    // Call verify email API
    const { data, error: apiError } = await verifyEmail(emailToken, email)

    if (apiError || !data?.success) {
      throw new Error(apiError?.message || data?.message || 'Email verification failed')
    }

    if (data?.success && data?.data?.token && data?.data?.user) {
      // Save token and user (same pattern as useAuth)
      token.value = data.data.token
      user.value = data.data.user

      isSuccess.value = true
      isVerifying.value = false

      // Auto redirect ke dashboard dalam 3 detik
      const countdown = setInterval(() => {
        redirectCountdown.value--
        if (redirectCountdown.value <= 0) {
          clearInterval(countdown)
          router.push('/dashboard')
        }
      }, 1000)
    } else {
      throw new Error('Invalid response from server')
    }
  } catch (error) {
    verificationError.value = error instanceof Error ? error.message : 'Email verification failed'
    isVerifying.value = false
  }
})
</script>

<style scoped>
.verify-email-page {
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
  padding: 40px 30px;
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

.btn-primary {
  background-color: #012970;
  border-color: #012970;
}

.btn-primary:hover {
  background-color: #080c63;
  border-color: #080c63;
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

