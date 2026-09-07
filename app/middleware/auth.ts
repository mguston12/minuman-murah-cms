export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.server) return;

  const { user, fetchUser } = useAuth();
  const authToken = useCookie("auth_token");

  if (!authToken.value) {
    if (to.path !== "/login") {
      return navigateTo("/login");
    }
    return;
  }

  if (authToken.value && !user.value) {
    try {
      await fetchUser();
    } catch (err) {
      console.error("Auth middleware error:", err);
    }
  }

  if (!user.value && to.path !== "/login") {
    return navigateTo("/login");
  }

  if (user.value && to.path === "/login") {
    return navigateTo("/dashboard");
  }
});
