// export default defineNuxtRouteMiddleware(async (to, from) => {
//   const auth = useAuth()

//   // Always initialize auth state first (will validate token with backend)
//   const token = useCookie('auth_token')
  
//   // If we have a token, always verify it with backend first
//   if (token.value) {
//     // This will call backend API to validate token
//     // If token is invalid/random, backend will return 401 and fetchUser() will clear token & user
//     await auth.initAuth()
//   }

//   // After validation, check if user is authenticated
//   // If token was random/invalid, isAuthenticated will be false (token & user already cleared)
//   if (!auth.isAuthenticated.value) {
//     return navigateTo('/login')
//   }
// })

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Jika tujuan halaman adalah /login, biarkan lewat (jangan di-redirect)
  if (to.path === '/login') {
    return
  }

  const auth = useAuth()
  const token = useCookie('auth_token')
  
  if (token.value) {
    await auth.initAuth()
  }

  // Jika tidak authenticated dan mencoba akses halaman terproteksi (seperti /dashboard)
  if (!auth.isAuthenticated.value) {
    return navigateTo('/login')
  }
})