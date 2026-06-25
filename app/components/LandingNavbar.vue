<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm sticky-top">
    <div class="container">
      <!-- Brand -->
      <NuxtLink to="/" class="navbar-brand fw-bold">
        <i class="bi bi-shop me-2"></i>
        <span>{{ appName }}</span>
      </NuxtLink>

      <!-- Toggler for mobile -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navigation Links -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav mx-auto">
          <li class="nav-item">
            <NuxtLink to="/about" class="nav-link">About Us</NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink to="/blog" class="nav-link">Blog</NuxtLink>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#products">Products</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#contact">Contact</a>
          </li>
        </ul>

        <!-- Auth Section -->
        <div class="d-flex align-items-center">
          <div v-if="!isAuthenticated" class="ms-3">
            <NuxtLink to="/login" class="btn btn-primary btn-sm">
              <i class="bi bi-box-arrow-in-right me-1"></i>
              Login
            </NuxtLink>
          </div>

          <div v-else class="ms-3">
            <div class="dropdown">
              <button
                class="btn btn-outline-primary btn-sm dropdown-toggle"
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="bi bi-person-circle me-1"></i>
                {{ user?.name }}
              </button>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li>
                  <NuxtLink to="/profile" class="dropdown-item">
                    <i class="bi bi-person me-2"></i>
                    Profile
                  </NuxtLink>
                </li>
                <li v-if="hasAdminAccess">
                  <hr class="dropdown-divider" />
                </li>
                <li v-if="hasAdminAccess">
                  <NuxtLink to="/dashboard" class="dropdown-item">
                    <i class="bi bi-speedometer2 me-2"></i>
                    Dashboard
                  </NuxtLink>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>
                <li>
                  <a href="#" class="dropdown-item text-danger" @click.prevent="handleLogout">
                    <i class="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const auth = useAuth()
const router = useRouter()
const { appName } = useAppIdentity()

const isAuthenticated = computed(() => auth.isAuthenticated.value)
const user = computed(() => auth.user.value)
const hasAdminAccess = computed(() => {
  const userRoles = user.value?.roles || []
  return userRoles.some((role: any) => role.name === 'admin' || role.name === 'super-admin')
})

const handleLogout = async () => {
  await auth.logout()
}
</script>

<style scoped>
.navbar {
  background-color: #fff !important;
  border-bottom: 1px solid #e9ecef;
}

.navbar-brand {
  font-size: 20px;
  color: #1E1E1E !important;
  transition: opacity 0.3s;
}

.navbar-brand:hover {
  opacity: 0.8;
}

.nav-link {
  color: #495057 !important;
  font-weight: 500;
  transition: color 0.3s;
  margin: 0 10px;
}

.nav-link:hover {
  color: #1E1E1E !important;
}

.btn-primary {
  background-color: #012970;
  border-color: #012970;
}

.btn-primary:hover {
  background-color: #0a1e50;
  border-color: #0a1e50;
}

.dropdown-menu {
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
  color: #495057;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  color: #1E1E1E;
}

.dropdown-item.text-danger:hover {
  background-color: #fff5f5;
  color: #dc3545 !important;
}
</style>


