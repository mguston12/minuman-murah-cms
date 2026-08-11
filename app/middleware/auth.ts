export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuth()

  // Always initialize auth state first (will validate token with backend)
  const token = useCookie('auth_token')
  
  // If we have a token, always verify it with backend first
  if (token.value) {
    // This will call backend API to validate token
    // If token is invalid/random, backend will return 401 and fetchUser() will clear token & user
    await auth.initAuth()
  }

  // After validation, check if user is authenticated
  // If token was random/invalid, isAuthenticated will be false (token & user already cleared)
  if (!auth.isAuthenticated.value) {
    return navigateTo('/login')
  }
})
