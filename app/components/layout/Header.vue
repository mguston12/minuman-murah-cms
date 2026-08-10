<template>
  <header
    id="header"
    class="header fixed-top d-flex align-items-center"
    :class="{ 'sidebar-collapsed': !isSidebarOpen }"
  >
    <div class="header-brand d-flex align-items-center justify-content-between">
      <button
        type="button"
        class="toggle-sidebar-btn"
        :class="{ collapsed: !isSidebarOpen }"
        :aria-label="isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'"
        :title="isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'"
        @click="toggleSidebar"
      >
        <i
          class="bi"
          :class="isSidebarOpen ? 'bi-layout-sidebar-inset' : 'bi-layout-sidebar-inset-reverse'"
          aria-hidden="true"
        ></i>
      </button>
      <NuxtLink to="/dashboard" class="logo d-flex align-items-center h-full">
        <img 
          :src="logoUrl || '/assets/img/logo.png'" 
          :alt="`${appName} Logo`" 
          @error="handleLogoError"
        />
        <span class="logo-text ms-2 fw-bold">{{ appName }}</span>
      </NuxtLink>
    </div>

    <nav class="header-nav ms-auto">
      <ul class="d-flex align-items-center">
        <!-- Profile -->
        <li v-if="user" class="nav-item dropdown pe-3">
          <a class="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
            <img v-if="userAvatar"
                    :src="userAvatar"
                    :alt="`${user?.name} ${user?.last_name}`" class="rounded-circle" />
            <span class="d-none d-md-block dropdown-toggle ps-2">{{ user?.name }}</span>
          </a>

          <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
            <li class="dropdown-header">
              <h6>{{ user?.name }} {{ user?.last_name }}</h6>
              <span>{{ userRoles?.[0] || 'User' }}</span>
            </li>
            <li>
              <hr class="dropdown-divider" />
            </li>

            <li>
              <NuxtLink class="dropdown-item d-flex align-items-center" to="/profile">
                <i class="bi bi-person"></i>
                <span>My Profile</span>
              </NuxtLink>
            </li>
            <li>
              <hr class="dropdown-divider" />
            </li>
            <li>
              <hr class="dropdown-divider" />
            </li>

            <li>
              <a class="dropdown-item d-flex align-items-center" href="#" @click.prevent="handleLogout" :class="{ disabled: isLoggingOut }">
                <i class="bi bi-box-arrow-right"></i>
                <span>{{ isLoggingOut ? 'Logging out...' : 'Logout' }}</span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
// Composables
const auth = useAuth()
const { logout } = auth
const { appName, logoUrl, loadAppIdentity } = useAppIdentity()

// State
const isLoggingOut = ref(false)

// Computed
const user = auth.user
const userAvatar = computed(() => user.value?.avatar_url || user.value?.avatar || null)
const userRoles = computed(() => {
  if (!user.value?.roles) return []
  return user.value.roles.map((r: any) => {
    if (typeof r === 'string') return r
    return r.name || String(r)
  })
})

// Sidebar management using composable
const { isOpen: isSidebarOpen, toggle: toggleSidebar } = useSidebar()

// Logo management
const handleLogoError = () => {
  logoUrl.value = '/assets/img/logo.png'
}

const loadLogo = async () => {
  await loadAppIdentity()
}

// Handle account settings
const handleAccountSettings = () => {
  console.log('Go to account settings')
}

// Handle logout
const handleLogout = async () => {
  if (isLoggingOut.value) return

  isLoggingOut.value = true
  try {
    await logout()
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    isLoggingOut.value = false
  }
}

// Initialize event listeners when component mounted
onMounted(() => {
  // Load logo from database
  loadLogo()

  // Handle back to top button
  const backtotop = document.querySelector('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    
    window.addEventListener('load', toggleBacktotop)
    window.addEventListener('scroll', toggleBacktotop)
    
    // Initial check
    toggleBacktotop()
  }

  // Close sidebar on overlay click (mobile)
  if (import.meta.client && window.innerWidth < 768) {
    document.addEventListener('click', (e: any) => {
      const target = e.target as HTMLElement
      const isSidebar = target.closest('.sidebar')
      const isToggleBtn = target.closest('.toggle-sidebar-btn')
      
      // If click on overlay (not sidebar, not toggle button)
      if (!isSidebar && !isToggleBtn && document.body.classList.contains('toggle-sidebar')) {
        toggleSidebar()
      }
    })
  }
})

</script>

<style scoped>
.header-brand {
  width: 320px;
  min-width: 320px;
  gap: 12px;
  overflow: hidden;
  transition:
    width 0.32s cubic-bezier(0.4, 0, 0.2, 1),
    min-width 0.32s cubic-bezier(0.4, 0, 0.2, 1),
    gap 0.32s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (max-width: 1199px) {
  .header-brand {
    width: auto;
    min-width: 0;
    justify-content: flex-start !important;
    gap: 8px;
  }
}

.logo {
  display: inline-flex;
  align-items: center;
  min-width: 0;
  max-width: 280px;
  overflow: hidden;
  flex-shrink: 0;
  transition:
    max-width 0.32s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.22s ease,
    transform 0.32s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo img {
  display: block;
  width: auto;
  height: 42px;
  transition:
    opacity 0.2s ease,
    transform 0.32s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo-text {
  display: inline-block;
  width: max-content;
  max-width: 180px;
  overflow: hidden;
  font-size: 1.25rem;
  white-space: nowrap;
  color: black;
  transition:
    max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.2s ease,
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    margin 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.header :deep(.nav-profile),
.header :deep(.nav-profile span),
.header :deep(.dropdown-toggle),
.header :deep(.dropdown-header h6),
.header :deep(.dropdown-header span),
.header :deep(.dropdown-item),
.header :deep(.dropdown-item span),
.header :deep(.dropdown-item i) {
  color: #000 !important;
}

.header :deep(.nav-profile:hover),
.header :deep(.nav-profile:focus),
.header :deep(.dropdown-item:hover),
.header :deep(.dropdown-item:focus) {
  color: #000 !important;
}

.toggle-sidebar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: #000;
  cursor: pointer;
  transition:
    background-color 0.25s ease,
    color 0.25s ease,
    margin 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    padding 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toggle-sidebar-btn i {
  font-size: 1.2rem;
  line-height: 1;
  color: inherit;
}

.toggle-sidebar-btn:hover {
  background-color: transparent;
}

.toggle-sidebar-btn:focus-visible {
  outline: 2px solid rgba(0, 0, 0, 0.35);
  outline-offset: 2px;
  background-color: transparent;
}

@media (min-width: 1200px) {
  .sidebar-collapsed .header-brand {
    width: 320px;
    min-width: 320px;
    justify-content: flex-start !important;
    gap: 12px;
  }

  .sidebar-collapsed .toggle-sidebar-btn {
    transform: translateX(0);
  }

  .sidebar-collapsed .logo {
    max-width: 280px;
    opacity: 1;
    transform: translateX(0);
    pointer-events: auto;
  }

  .sidebar-collapsed .logo img {
    opacity: 1;
    transform: scale(1);
  }

  .sidebar-collapsed .logo-text {
    opacity: 1;
    max-width: 180px;
    width: max-content;
    transform: translateX(0);
  }
}
</style>
