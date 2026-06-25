<template>
  <div class="role-management">
    <!-- Action Buttons -->
    <div class="management-toolbar mb-4 d-flex gap-2 justify-content-between align-items-center">
      <h5 class="management-title mb-0">
        <i class="bi bi-shield-lock me-2"></i>
        Roles List
      </h5>
      <button class="btn btn-primary btn-sm action-btn-dark management-action-btn" @click="openCreateModal">
        <i class="bi bi-plus-circle me-2"></i>
        Add New Role
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="rolesPermissions.isLoading.value && rolesPermissions.roles.value.length === 0" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="rolesPermissions.roles.value.length === 0" class="alert alert-info text-center py-5">
      <i class="bi bi-inbox display-4"></i>
      <p class="mt-3 mb-0">No roles found.</p>
    </div>

    <!-- Roles Table -->
    <div v-else class="table-responsive">
      <table class="table table-hover mb-0">
        <thead class="table-light">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Permissions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="role in rolesPermissions.roles.value" :key="role.id">
            <td>
              <span class="badge bg-secondary">{{ role.id }}</span>
            </td>
            <td>
              <strong>{{ role.name }}</strong>
            </td>
            <td>
              <span v-if="role.permissions && role.permissions.length" class="badge bg-info">
                {{ role.permissions.length }} permissions
              </span>
              <span v-else class="text-muted">-</span>
            </td>
            <td>
              <button
                class="btn btn-sm btn-outline-primary me-2"
                @click="openEditModal(role)"
                :disabled="rolesPermissions.isLoading.value"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="confirmDelete(role)"
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
      id="roleModal"
      tabindex="-1"
      aria-labelledby="roleModalLabel"
      aria-hidden="true"
      ref="roleModalRef"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="roleModalLabel">
              <i :class="['bi', editingRole ? 'bi-pencil' : 'bi-plus-circle', 'me-2']"></i>
              {{ editingRole ? 'Edit Role' : 'Create New Role' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitRole">
              <!-- Name -->
              <div class="mb-3">
                <label for="roleName" class="form-label">Role Name <span class="text-danger">*</span></label>
                <input
                  v-model="formData.name"
                  type="text"
                  class="form-control"
                  id="roleName"
                  placeholder="e.g., Manager, Editor"
                  required
                />
              </div>

              <!-- Description -->
              <div class="mb-3">
                <label for="roleDesc" class="form-label">Description</label>
                <textarea
                  v-model="formData.description"
                  class="form-control"
                  id="roleDesc"
                  rows="3"
                  placeholder="Role description..."
                ></textarea>
              </div>

              <!-- Permissions -->
              <div class="mb-3">
                <label class="form-label">Permissions</label>
                <div class="permissions-list" v-if="rolesPermissions.permissions.value.length">
                  <div v-for="perm in rolesPermissions.permissions.value" :key="perm.id" class="form-check">
                    <input
                      v-model="formData.permissions"
                      type="checkbox"
                      :value="perm.id"
                      class="form-check-input"
                      :id="`perm-${perm.id}`"
                    />
                    <label class="form-check-label" :for="`perm-${perm.id}`">
                      <strong>{{ perm.name }}</strong>
                    </label>
                  </div>
                </div>
                <p v-else class="text-muted">No permissions available</p>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button
              type="button"
              :class="editingRole ? 'btn btn-success' : 'btn btn-primary action-btn-dark'"
              @click="submitRole"
              :disabled="rolesPermissions.isLoading.value"
            >
              <span v-if="rolesPermissions.isLoading.value" class="spinner-border spinner-border-sm me-2"></span>
              {{ editingRole ? 'Update Role' : 'Create Role' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      class="modal fade"
      id="deleteModal"
      tabindex="-1"
      aria-labelledby="deleteModalLabel"
      aria-hidden="true"
      ref="deleteModalRef"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="deleteModalLabel">
              <i class="bi bi-exclamation-triangle me-2"></i>
              Confirm Deletion
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p v-if="deletingRole">
              Are you sure you want to delete the role <strong>{{ deletingRole.name }}</strong>? This action cannot be
              undone.
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
              Delete Role
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Permission, Role } from '~/types/role'

interface Props {
  rolesPermissions: any
}

const props = defineProps<Props>()

// Refs
const roleModalRef = ref<HTMLElement>()
const deleteModalRef = ref<HTMLElement>()
const editingRole = ref<Role | null>(null)
const deletingRole = ref<Role | null>(null)

const formData = reactive({
  name: '',
  description: '',
  permissions: [] as number[]
})

// Open Create Modal
const openCreateModal = () => {
  editingRole.value = null
  formData.name = ''
  formData.description = ''
  formData.permissions = []

  const bootstrapModal = (window as any).bootstrap.Modal
  const modal = new bootstrapModal(roleModalRef.value!)
  modal.show()
}

// Open Edit Modal
const openEditModal = (role: Role) => {
  editingRole.value = role
  formData.name = role.name
  formData.description = role.description ?? ''
  formData.permissions = role.permissions?.map((p: Permission) => p.id) ?? []

  const bootstrapModal = (window as any).bootstrap.Modal
  const modal = new bootstrapModal(roleModalRef.value!)
  modal.show()
}

// Submit Form
const submitRole = async () => {
  const toast = useToast()
  if (!formData.name.trim()) {
    toast.warning('Please enter a role name')
    return
  }

  if (editingRole.value) {
    await props.rolesPermissions.updateRole(editingRole.value.id, {
      name: formData.name,
      description: formData.description,
      permissions: formData.permissions
    })
  } else {
    await props.rolesPermissions.createRole({
      name: formData.name,
      description: formData.description,
      permissions: formData.permissions
    })
  }

  // Close modal
  const bootstrapModal = (window as any).bootstrap.Modal
  const modal = bootstrapModal.getInstance(roleModalRef.value!)
  modal?.hide()
}

// Confirm Delete
const confirmDelete = (role: Role) => {
  deletingRole.value = role
  const bootstrapModal = (window as any).bootstrap.Modal
  const modal = new bootstrapModal(deleteModalRef.value!)
  modal.show()
}

// Perform Delete
const performDelete = async () => {
  if (deletingRole.value) {
    const success = await props.rolesPermissions.deleteRole(deletingRole.value.id)
    if (success) {
      const bootstrapModal = (window as any).bootstrap.Modal
      const modal = bootstrapModal.getInstance(deleteModalRef.value!)
      modal?.hide()
      deletingRole.value = null
    }
  }
}
</script>

<style scoped>
.role-management {
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

.permissions-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 1rem;
}

.form-check {
  padding: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
}

.form-check:last-child {
  border-bottom: none;
}

.form-check-label {
  margin-left: 0.5rem;
  cursor: pointer;
}

.badge {
  font-size: 0.8rem;
  padding: 0.4rem 0.6rem;
}

.role-management .badge.bg-info {
  color: #083344 !important;
  background-color: #cff4fc !important;
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

@media (max-width: 768px) {
  .role-management {
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

