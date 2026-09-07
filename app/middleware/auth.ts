export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuth()
  const token = useCookie('auth_token')

  // Hanya jalankan initAuth jika ada token DAN user belum terisi di state
  if (token.value && !auth.user.value) {
    try {
      await auth.initAuth()
    } catch (e) {
      console.error('Failed to restore auth session:', e)
    }
  }

  // Jika TIDAK terautentikasi dan mencoba akses halaman terproteksi
  if (!auth.isAuthenticated.value && to.path !== '/login') {
    return navigateTo('/login')
  }

  // JIKA SUDAH terautentikasi tapi malah buka halaman /login -> lempar ke dashboard
  if (auth.isAuthenticated.value && to.path === '/login') {
    return navigateTo('/dashboard')
  }
})