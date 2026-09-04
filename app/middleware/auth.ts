export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, fetchUser } = useAuth();
  const authToken = useCookie("auth_token");

  if (authToken.value && !user.value) {
    await fetchUser();
  }

  if (!authToken.value && to.path !== "/login") {
    return navigateTo("/login");
  }

  if (authToken.value && to.path === "/login") {
    return navigateTo("/dashboard");
  }
});
