<template>
  <div id="app">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const { appName } = useAppIdentity();

useHead({
  title: computed(() => appName.value),
  meta: [
    {
      key: "description",
      name: "description",
      content: computed(() => `${appName.value} - Toko Online Terpercaya`),
    },
    {
      key: "og:title",
      property: "og:title",
      content: computed(() => appName.value),
    },
    {
      key: "og:description",
      property: "og:description",
      content: computed(() => `${appName.value} - Toko Online Terpercaya`),
    },
  ],
});
</script>

<style>
:root {
  --app-text-black: #1E1E1E;
  --app-text-muted: #4f5b66;
  --app-light-surface: #f3f4f6;
  --app-light-border: #d3d7dd;
  --app-warning-text: #3b2f00;
  --app-info-text: #083344;
  --app-action-dark-bg: #1f1f1f;
  --app-action-dark-hover-bg: #2d2d2d;
  --app-action-dark-disabled-bg: #636363;
  --app-primary-soft-bg: #2a79f6;
  --app-primary-soft-hover-bg: #1f6fe8;
  --app-primary-soft-disabled-bg: #8fb5ee;
  --app-success-soft-bg: #2c9160;
  --app-success-soft-hover-bg: #257c52;
  --app-success-soft-disabled-bg: #91bea6;
}

.text-primary,
.text-primary:hover,
.text-primary:focus,
.link-primary,
.link-primary:hover,
.link-primary:focus,
a.text-primary,
a.text-primary:hover,
a.text-primary:focus,
.page-link,
.page-link:hover,
.page-link:focus,
.nav-tabs .nav-link.active,
.nav-pills .nav-link.active,
.accordion-button:not(.collapsed) {
  color: var(--app-text-black) !important;
}

.btn-outline-primary {
  color: #b7791f !important;
  border-color: rgba(212, 160, 23, 0.72) !important;
  background-color: rgba(212, 160, 23, 0.03) !important;
}

.btn-outline-primary i {
  color: #b7791f !important;
}

.text-muted,
.text-body-secondary,
small.text-muted,
.form-text,
.breadcrumb-item,
.breadcrumb-item a {
  color: var(--app-text-muted) !important;
}

.bg-light,
.card-header.bg-light,
.form-control.bg-light,
.alert-light,
.table-light {
  background-color: var(--app-light-surface) !important;
  color: var(--app-text-black) !important;
}

.bg-light,
.card-header.bg-light,
.form-control.bg-light,
.alert-light {
  border-color: var(--app-light-border) !important;
}

.badge.bg-warning,
.badge.text-bg-warning,
.bg-warning.badge {
  color: var(--app-warning-text) !important;
}

.badge.bg-info,
.badge.text-bg-info,
.bg-info.badge {
  color: var(--app-info-text) !important;
}

.btn-outline-primary:hover,
.btn-outline-primary:focus,
.btn-outline-primary:active {
  color: #b7791f !important;
  background-color: rgba(212, 160, 23, 0.1) !important;
  border-color: rgba(212, 160, 23, 0.78) !important;
  box-shadow: none !important;
}

.btn-outline-primary:hover i,
.btn-outline-primary:focus i,
.btn-outline-primary:active i {
  color: #b7791f !important;
}

.btn-outline-success {
  color: #198754 !important;
  border-color: rgba(25, 135, 84, 0.72) !important;
  background-color: rgba(25, 135, 84, 0.03) !important;
}

.btn-outline-success i {
  color: #198754 !important;
}

.btn-outline-success:hover,
.btn-outline-success:focus,
.btn-outline-success:active {
  color: #198754 !important;
  background-color: rgba(25, 135, 84, 0.1) !important;
  border-color: rgba(25, 135, 84, 0.78) !important;
  box-shadow: none !important;
}

.btn-outline-success:hover i,
.btn-outline-success:focus i,
.btn-outline-success:active i {
  color: #198754 !important;
}

.btn-outline-info {
  color: #0c7489 !important;
  border-color: rgba(14, 165, 183, 0.72) !important;
  background-color: rgba(14, 165, 183, 0.03) !important;
}

.btn-outline-info i {
  color: #0c7489 !important;
}

.btn-outline-info:hover,
.btn-outline-info:focus,
.btn-outline-info:active {
  color: #0c7489 !important;
  background-color: rgba(14, 165, 183, 0.1) !important;
  border-color: rgba(14, 165, 183, 0.78) !important;
  box-shadow: none !important;
}

.btn-outline-info:hover i,
.btn-outline-info:focus i,
.btn-outline-info:active i {
  color: #0c7489 !important;
}

.btn-outline-danger {
  color: #c2410c !important;
  border-color: #dc3545 !important;
  background-color: transparent !important;
}

.btn-outline-danger i {
  color: #c2410c !important;
}

.btn-outline-danger:hover,
.btn-outline-danger:focus,
.btn-outline-danger:active {
  color: #c2410c !important;
  background-color: rgba(220, 53, 69, 0.14) !important;
  border-color: #dc3545 !important;
  box-shadow: none !important;
}

.btn-outline-danger:hover i,
.btn-outline-danger:focus i,
.btn-outline-danger:active i {
  color: #c2410c !important;
}

.btn-primary:not(.action-btn-dark),
a.btn-primary:not(.action-btn-dark),
button.btn-primary:not(.action-btn-dark) {
  color: #fff !important;
  background-color: var(--app-primary-soft-bg) !important;
  border-color: var(--app-primary-soft-bg) !important;
}

.btn-primary:not(.action-btn-dark):hover,
.btn-primary:not(.action-btn-dark):focus,
.btn-primary:not(.action-btn-dark):active,
a.btn-primary:not(.action-btn-dark):hover,
a.btn-primary:not(.action-btn-dark):focus,
button.btn-primary:not(.action-btn-dark):hover,
button.btn-primary:not(.action-btn-dark):focus {
  color: #fff !important;
  background-color: var(--app-primary-soft-hover-bg) !important;
  border-color: var(--app-primary-soft-hover-bg) !important;
  box-shadow: none !important;
}

.btn-primary:not(.action-btn-dark):disabled,
.btn-primary:not(.action-btn-dark).disabled {
  color: #fff !important;
  background-color: var(--app-primary-soft-disabled-bg) !important;
  border-color: var(--app-primary-soft-disabled-bg) !important;
}

.btn-success:not(.action-btn-dark),
a.btn-success:not(.action-btn-dark),
button.btn-success:not(.action-btn-dark) {
  color: #fff !important;
  background-color: var(--app-success-soft-bg) !important;
  border-color: var(--app-success-soft-bg) !important;
}

.btn-success:not(.action-btn-dark):hover,
.btn-success:not(.action-btn-dark):focus,
.btn-success:not(.action-btn-dark):active,
a.btn-success:not(.action-btn-dark):hover,
a.btn-success:not(.action-btn-dark):focus,
button.btn-success:not(.action-btn-dark):hover,
button.btn-success:not(.action-btn-dark):focus {
  color: #fff !important;
  background-color: var(--app-success-soft-hover-bg) !important;
  border-color: var(--app-success-soft-hover-bg) !important;
  box-shadow: none !important;
}

.btn-success:not(.action-btn-dark):disabled,
.btn-success:not(.action-btn-dark).disabled {
  color: #fff !important;
  background-color: var(--app-success-soft-disabled-bg) !important;
  border-color: var(--app-success-soft-disabled-bg) !important;
}

.btn.action-btn-dark,
.btn-primary.action-btn-dark,
.btn-success.action-btn-dark,
a.action-btn-dark.btn,
button.action-btn-dark.btn {
  color: #fff !important;
  background-color: var(--app-action-dark-bg) !important;
  border-color: var(--app-action-dark-bg) !important;
}

.btn.action-btn-dark:hover,
.btn.action-btn-dark:focus,
.btn.action-btn-dark:active,
.btn-primary.action-btn-dark:hover,
.btn-primary.action-btn-dark:focus,
.btn-primary.action-btn-dark:active,
.btn-success.action-btn-dark:hover,
.btn-success.action-btn-dark:focus,
.btn-success.action-btn-dark:active,
a.action-btn-dark.btn:hover,
a.action-btn-dark.btn:focus,
button.action-btn-dark.btn:hover,
button.action-btn-dark.btn:focus {
  color: #fff !important;
  background-color: var(--app-action-dark-hover-bg) !important;
  border-color: var(--app-action-dark-hover-bg) !important;
  box-shadow: none !important;
}

.btn.action-btn-dark:disabled,
.btn-primary.action-btn-dark:disabled,
.btn-success.action-btn-dark:disabled,
.btn.action-btn-dark.disabled,
a.action-btn-dark.btn.disabled {
  color: #fff !important;
  background-color: var(--app-action-dark-disabled-bg) !important;
  border-color: var(--app-action-dark-disabled-bg) !important;
  opacity: 1 !important;
}

.page-link.action-btn-dark {
  color: #fff !important;
  background-color: var(--app-action-dark-bg) !important;
  border-color: var(--app-action-dark-bg) !important;
}

.page-link.action-btn-dark:hover,
.page-link.action-btn-dark:focus,
.page-link.action-btn-dark:active {
  color: #fff !important;
  background-color: var(--app-action-dark-hover-bg) !important;
  border-color: var(--app-action-dark-hover-bg) !important;
  box-shadow: none !important;
}

.page-item.disabled .page-link.action-btn-dark {
  color: #fff !important;
  background-color: var(--app-action-dark-disabled-bg) !important;
  border-color: var(--app-action-dark-disabled-bg) !important;
  opacity: 1 !important;
}

.spinner-border,
.spinner-grow,
.spinner-border.text-primary,
.spinner-grow.text-primary {
  color: #000 !important;
}

.form-check-input:checked {
  background-color: #000 !important;
  border-color: #000 !important;
}

.form-check-input:focus {
  border-color: #000 !important;
  box-shadow: 0 0 0 0.25rem rgba(0, 0, 0, 0.15) !important;
}

.form-switch .form-check-input:checked {
  background-color: #000 !important;
  border-color: #000 !important;
}

.form-control:focus,
.form-select:focus,
.form-control-lg:focus,
.form-control-sm:focus,
textarea.form-control:focus,
input.form-control:focus,
select.form-select:focus {
  border-color: #000 !important;
  box-shadow: 0 0 0 0.25rem rgba(0, 0, 0, 0.15) !important;
}

.input-group:focus-within .input-group-text {
  border-color: #000 !important;
}

input.form-control,
.form-select {
  border-width: 2px !important;
}

</style>
