<template>
  <aside id="sidebar" class="sidebar">
    <ul class="sidebar-nav" id="sidebar-nav">
      <!-- Dashboard -->
      <li class="nav-heading">Manage Control</li>
      <li class="nav-item">
        <NuxtLink
          to="/dashboard"
          class="nav-link"
          :class="{ active: isActive('/dashboard') }"
        >
          <i class="bi bi-grid"></i>
          <span>Dashboard</span>
        </NuxtLink>
      </li>
      <!-- Brand (Merk) -->
      <li v-if="hasPermission('brands.read')" class="nav-item">
        <NuxtLink
          to="/manage-merk"
          class="nav-link"
          :class="{ active: isActive('/manage-merk') }"
        >
          <i class="bi bi-tag"></i>
          <span>Merk</span>
        </NuxtLink>
      </li>
      <!-- Products -->
      <li v-if="hasPermission('products.read')" class="nav-item">
        <NuxtLink
          to="/manage-product"
          class="nav-link"
          :class="{ active: isActive('/manage-product') }"
        >
          <i class="bi bi-bag"></i>
          <span>Products</span>
        </NuxtLink>
      </li>
      <!-- Category Products (hidden - merged into product search) -->
      <!-- <li v-if="hasPermission('products.read')" class="nav-item">
        <NuxtLink
          to="/manage-category-product"
          class="nav-link"
          :class="{ active: isActive('/manage-category-product') }"
        >
          <i class="bi bi-tag"></i>
          <span>Category Products</span>
        </NuxtLink>
      </li> -->
      <!-- Product Groups -->
      <li v-if="hasPermission('products.read')" class="nav-item">
        <NuxtLink
          to="/manage-product-groups"
          class="nav-link"
          :class="{ active: isActive('/manage-product-groups') }"
        >
          <i class="bi bi-collection"></i>
          <span>Product Groups</span>
        </NuxtLink>
      </li>
      <!-- Attributes -->
      <li v-if="hasPermission('product-attributes.read')" class="nav-item">
        <NuxtLink
          to="/manage-product-attribute"
          class="nav-link"
          :class="{ active: isActive('/manage-product-attribute') }"
        >
          <i class="bi bi-collection"></i>
          <span>Product Attribute</span>
        </NuxtLink>
      </li>
      <!-- Vouchers -->
      <li v-if="hasPermission('vouchers.read')" class="nav-item">
        <NuxtLink
          to="/manage-voucher"
          class="nav-link"
          :class="{ active: isActive('/manage-voucher') }"
        >
          <i class="bi bi-ticket"></i>
          <span>Vouchers</span>
        </NuxtLink>
      </li>
      <!-- Orders -->
      <li v-if="hasPermission('orders.read')" class="nav-item">
        <NuxtLink
          to="/manage-order"
          class="nav-link"
          :class="{ active: isActive('/manage-order') }"
        >
          <i class="bi bi-receipt"></i>
          <span>Orders</span>
        </NuxtLink>
      </li>
      <!-- Blog Management -->
      <li v-if="hasPermission('blogs.read')" class="nav-item">
        <NuxtLink
          to="/manage-blog"
          class="nav-link"
          :class="{ active: isActive('/manage-blog') }"
        >
          <i class="bi bi-newspaper"></i>
          <span>Manage Blog</span>
        </NuxtLink>
      </li>

      <!-- Blog Categories (merged into Manage Blog create/edit) -->
      <!-- <li v-if="hasPermission('blog-categories.read')" class="nav-item">
        <NuxtLink
          to="/manage-blog-categories"
          class="nav-link"
          :class="{ active: isActive('/manage-blog-categories') }"
        >
          <i class="bi bi-tags"></i>
          <span>Blog Categories</span>
        </NuxtLink>
      </li> -->

      <!-- Pages Heading -->
      <li class="nav-heading">Management</li>

      <!-- User Management -->
      <li v-if="hasPermission('users.read')" class="nav-item">
        <NuxtLink
          to="/users"
          class="nav-link"
          :class="{ active: isActive('/users') }"
        >
          <i class="bi bi-people"></i>
          <span>User Management</span>
        </NuxtLink>
      </li>
      <!-- Roles & Permissions (Direct Link) -->
      <li
        v-if="hasPermission('roles.read') || hasPermission('permissions.read')"
        class="nav-item"
      >
        <NuxtLink
          to="/manage-roles-permissions"
          class="nav-link"
          :class="{ active: isActive('/manage-roles-permissions') }"
        >
          <i class="bi bi-shield-lock"></i>
          <span>Roles & Permissions</span>
        </NuxtLink>
      </li>

      <!-- Settings -->
      <li class="nav-item">
        <NuxtLink
          v-if="
            hasPermission('stores.read') ||
            hasPermission('configs.read')
          "
          to="/setting"
          class="nav-link"
          :class="{ active: isActive('/setting') || isActive('/settings') }"
        >
          <i class="bi bi-gear"></i>
          <span>Settings</span>
        </NuxtLink>
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { usePermission } from "~/composables/usePermission";

const route = useRoute();
const { hasPermission } = usePermission();

const isActive = (path: string) => {
  // Exact match atau jika path diikuti dengan / (untuk sub-routes)
  return route.path === path || route.path.startsWith(path + "/");
};
</script>

<style scoped>
.sidebar-nav .nav-link {
  background-color: #ffffff;
  transition: all 0.3s ease;
  font-family: var(--font-poppins), 'Open Sans', sans-serif;
  color: #000000;
}

.sidebar-nav .nav-link i,
.sidebar-nav .nav-link span {
  color: inherit;
}

.sidebar-nav .nav-link.active {
  background-color: rgba(0, 0, 0, 0.08);
  border-left: 3px solid #000000;
  padding-left: calc(0.625rem - 3px);
  color: #000000;
}

.sidebar-nav .nav-link.active i {
  color: #000000;
}

.sidebar-nav .nav-link.collapsed {
  color: #1a1a1a;
  background: #fff;
}

.sidebar-nav .nav-link.collapsed i {
  color: #6b7280;
}

.sidebar-nav .nav-link:hover {
  color: #000000;
  background: #f5f5f5;
}

.sidebar-nav .nav-link:hover i {
  color: #000000;
}

.sidebar-nav .nav-heading {
  font-family: var(--font-poppins), 'Open Sans', sans-serif;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #8b949e;
  padding: 10px 15px;
  font-weight: 700;
}
</style>
