<template>
  <main class="min-h-screen bg-white"></main>
</template>

<script setup lang="ts">
const route = useRoute();
const config = useRuntimeConfig();

const query = new URLSearchParams();
Object.entries(route.query).forEach(([key, value]) => {
  if (Array.isArray(value)) {
    value.forEach((item) => {
      if (item !== null && item !== undefined) {
        query.append(key, item);
      }
    });
    return;
  }

  if (value !== null && value !== undefined) {
    query.set(key, value);
  }
});

const customerUrl = String(config.public.customerFrontendUrl || "http://localhost:3000").replace(/\/$/, "");
const target = `${customerUrl}/account/orders${query.toString() ? `?${query.toString()}` : ""}`;

await navigateTo(target, { external: true, redirectCode: 302 });
</script>
