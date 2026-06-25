<template>
  <div class="permission-management">
    <!-- Action Buttons -->
    <div class="management-toolbar mb-4 d-flex gap-2 justify-content-between align-items-center">
      <h5 class="management-title mb-0">
        <i class="bi bi-key me-2"></i>
        Permissions List
      </h5>
      <button class="btn btn-primary btn-sm action-btn-dark management-action-btn" @click="openCreateModal">
        <i class="bi bi-plus-circle me-2"></i>
        Add New Permission
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="rolesPermissions.isLoading.value && rolesPermissions.permissions.value.length === 0" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="rolesPermissions.permissions.value.length === 0" class="alert alert-info text-center py-5">
      <i class="bi bi-inbox display-4"></i>
      <p class="mt-3 mb-0">No permissions found.</p>
    </div>

    <!-- Permissions Table -->
    <div v-else class="table-responsive">
      <table class="table table-hover mb-0">
        <thead class="table-light">
          <tr>
            <th>ID</th>
            <th>Permission Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="permission in rolesPermissions.permissions.value" :key="permission.id">
            <td>
              <span class="badge bg-secondary">{{ permission.id }}</span>
            </td>
            <td>
              <strong>{{ permission.name }}</strong>
              <small class="text-muted d-block">{{ getModuleFromPermission(permission.name) }}</small>
            </td>
            <td>
              <button
                class="btn btn-sm btn-outline-primary me-2"
                @click="openEditModal(permission)"
                :disabled="rolesPermissions.isLoading.value"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="confirmDelete(permission)"
                :disabled="rolesPermissions.isLoading.value"
              >
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create/Edit Modal -->
    <div
      class="modal fade"
      id="permissionModal"
      tabindex="-1"
      aria-labelledby="permissionModalLabel"
      aria-hidden="true"
      ref="permissionModalRef"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title" id="permissionModalLabel">
                <i :class="['bi', editingPermission ? 'bi-pencil' : 'bi-plus-circle', 'me-2']"></i>
                {{ editingPermission ? 'Edit Permission' : 'Create New Permission' }}
              </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitPermission">
              <!-- Name -->
              <div class="mb-3">
                <label for="permissionName" class="form-label">Permission Name <span class="text-danger">*</span></label>
                <input
                  v-model="formData.name"
                  type="text"
                  class="form-control"
                  id="permissionName"
                  placeholder="e.g., products.create, users.delete"
                  required
                />
              </div>

              <!-- Description -->
              <div class="mb-3">
                <label for="permissionDesc" class="form-label">Description</label>
                <textarea
                  v-model="formData.description"
                  class="form-control"
                  id="permissionDesc"
                  rows="3"
                  placeholder="Permission description..."
                ></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button
              type="button"
              :class="editingPermission ? 'btn btn-success' : 'btn btn-primary action-btn-dark'"
              @click="submitPermission"
              :disabled="rolesPermissions.isLoading.value"
            >
              <span v-if="rolesPermissions.isLoading.value" class="spinner-border spinner-border-sm me-2"></span>
              {{ editingPermission ? 'Update Permission' : 'Create Permission' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      class="modal fade"
      id="deletePermissionModal"
      tabindex="-1"
      aria-labelledby="deletePermissionModalLabel"
      aria-hidden="true"
      ref="deletePermissionModalRef"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="deletePermissionModalLabel">
              <i class="bi bi-exclamation-triangle me-2"></i>
              Confirm Deletion
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p v-if="deletingPermission">
              Are you sure you want to delete the permission <strong>{{ deletingPermission.name }}</strong>? This action
              cannot be undone.
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button
              type="button"
              class="btn btn-danger"
              @click="performDelete"
              :disabled="rolesPermissions.isLoading.value"
            >
              <span v-if="rolesPermissions.isLoading.value" class="spinner-border spinner-border-sm me-2"></span>
              Delete Permission
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Permission } from '~/types/role'

interface Props {
  rolesPermissions: any
}

const props = defineProps<Props>()

// Refs
const permissionModalRef = ref<HTMLElement>()
const deletePermissionModalRef = ref<HTMLElement>()
const editingPermission = ref<Permission | null>(null)
const deletingPermission = ref<Permission | null>(null)

const formData = reactive({
  name: '',
  description: ''
})

// Helper: Extract module from permission name
const getModuleFromPermission = (permissionName: string): string => {
  const module = permissionName.split('.')[0]
  return module ? `Module: ${module}` : ''
}

// Open Create Modal
const openCreateModal = () => {
  editingPermission.value = null
  formData.name = ''
  formData.description = ''

  const bootstrapModal = (window as any).bootstrap.Modal
  const modal = new bootstrapModal(permissionModalRef.value!)
  modal.show()
}

// Open Edit Modal
const openEditModal = (permission: Permission) => {
  editingPermission.value = permission
  formData.name = permission.name
  formData.description = permission.description ?? ''

  const bootstrapModal = (window as any).bootstrap.Modal
  const modal = new bootstrapModal(permissionModalRef.value!)
  modal.show()
}

// Submit Form
const submitPermission = async () => {
  const toast = useToast()
  if (!formData.name.trim()) {
    toast.warning('Please enter a permission name')
    return
  }

  if (editingPermission.value) {
    await props.rolesPermissions.updatePermission(editingPermission.value.id, {
      name: formData.name,
      description: formData.description
    })
  } else {
    await props.rolesPermissions.createPermission({
      name: formData.name,
      description: formData.description
    })
  }

  // Close modal
  const bootstrapModal = (window as any).bootstrap.Modal
  const modal = bootstrapModal.getInstance(permissionModalRef.value!)
  modal?.hide()
}

// Confirm Delete
const confirmDelete = (permission: Permission) => {
  deletingPermission.value = permission
  const bootstrapModal = (window as any).bootstrap.Modal
  const modal = new bootstrapModal(deletePermissionModalRef.value!)
  modal.show()
}

// Perform Delete
const performDelete = async () => {
  if (deletingPermission.value) {
    const success = await props.rolesPermissions.deletePermission(deletingPermission.value.id)
    if (success) {
      const bootstrapModal = (window as any).bootstrap.Modal
      const modal = bootstrapModal.getInstance(deletePermissionModalRef.value!)
      modal?.hide()
      deletingPermission.value = null
    }
  }
}
</script>

<style scoped>
.permission-management {
  padding: 1.5rem 0;
}

.management-toolbar {
  flex-wrap: wrap;
}

.management-title {
  min-width: 0;
  overflow-wrap: anywhere;
}

.management-action-btn {
  flex-shrink: 0;
}

.table {
  margin-bottom: 0;
}

.table thead th {
  background-color: #f8f9fa;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  color: #666;
  border: none;
}

.table tbody tr {
  border-bottom: 1px solid #dee2e6;
  transition: background-color 0.2s ease;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
}

.badge {
  font-size: 0.8rem;
  padding: 0.4rem 0.6rem;
}

.btn-sm {
  padding: 0.4rem 0.6rem;
  font-size: 0.85rem;
}

.modal-header {
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
}

.modal-title {
  font-weight: 600;
  color: #1E1E1E;
}

.form-label {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.text-danger {
  font-weight: 600;
}

@media (max-width: 768px) {
  .permission-management {
    padding: 1rem 0;
  }

  .management-toolbar {
    align-items: stretch !important;
  }

  .management-action-btn {
    width: 100%;
  }
}
</style>

