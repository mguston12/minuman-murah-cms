export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuth()
  const token = useCookie('auth_token')

  // Cukup pastikan auth initialized
  if (token.value && !auth.user.value) {
    await auth.initAuth()
  }

  if (!auth.isAuthenticated.value) {
    return navigateTo('/login')
  }

  const user = auth.user.value
  const userRoles = user?.roles?.map((r: any) => typeof r === 'string' ? r : (r.name || String(r))) || []
  const adminRoles = ['Super Admin', 'Admin', 'Manager']

  const hasAdminAccess = userRoles.some((role: string) => adminRoles.includes(role))

  // Jika bukan admin DAN bukan sedang di /dashboard -> arahkan ke /dashboard
  if (!hasAdminAccess && to.path !== '/dashboard') {
    return navigateTo('/dashboard')
  }
})