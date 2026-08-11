<script setup lang="ts">
const auth = useAuth()

const token = useCookie('auth_token')
if (token.value) {
  await auth.initAuth()
}

await navigateTo('/dashboard')
</script>

<template>
  <div>
  </div>
</template>

