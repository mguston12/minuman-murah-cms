/**
 * Toast notification plugin for Bootstrap 5
 * Uses Bootstrap's native toast component
 */
export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    // Wait for Bootstrap to be available
    const waitForBootstrap = (): Promise<any> => {
      return new Promise((resolve) => {
        if (typeof window !== 'undefined') {
          const checkBootstrap = () => {
            const bootstrap = (window as any).bootstrap
            if (bootstrap && bootstrap.Toast) {
              resolve(bootstrap)
            } else {
              setTimeout(checkBootstrap, 50)
            }
          }
          checkBootstrap()
        } else {
          resolve(null)
        }
      })
    }

    // Toast container will be created dynamically
    const createToastContainer = () => {
      let container = document.getElementById('toast-container')
      if (!container) {
        container = document.createElement('div')
        container.id = 'toast-container'
        container.className = 'toast-container position-fixed top-0 end-0 p-3'
        container.style.zIndex = '1055'
        document.body.appendChild(container)
      }
      return container
    }

    // Show toast function
    const showToast = async (
      message: string,
      type: 'success' | 'error' | 'warning' | 'info' = 'info',
      duration: number = 3000
    ) => {
      if (typeof window === 'undefined') return

      try {
        const container = createToastContainer()
        const toastId = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

        // Icon and color mapping
        const typeConfig = {
          success: { icon: 'bi-check-circle-fill', color: 'text-success', bg: 'bg-success' },
          error: { icon: 'bi-x-circle-fill', color: 'text-danger', bg: 'bg-danger' },
          warning: { icon: 'bi-exclamation-triangle-fill', color: 'text-warning', bg: 'bg-warning' },
          info: { icon: 'bi-info-circle-fill', color: 'text-info', bg: 'bg-info' },
        }

        const config = typeConfig[type]

        // Create toast element
        const toastEl = document.createElement('div')
        toastEl.id = toastId
        toastEl.className = 'toast'
        toastEl.style.backgroundColor = '#ffffff'
        toastEl.style.backdropFilter = 'none'
        toastEl.setAttribute('role', 'alert')
        toastEl.setAttribute('aria-live', 'assertive')
        toastEl.setAttribute('aria-atomic', 'true')
        toastEl.setAttribute('data-bs-autohide', 'true')
        toastEl.setAttribute('data-bs-delay', duration.toString())

        toastEl.innerHTML = `
          <div class="toast-header ${config.bg} text-white">
            <i class="bi ${config.icon} me-2"></i>
            <strong class="me-auto">${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div class="toast-body">
            ${message}
          </div>
        `
        container.appendChild(toastEl)

        // Wait for Bootstrap and initialize Toast
        try {
          const bootstrap = await waitForBootstrap()
          if (bootstrap && bootstrap.Toast) {
            const toast = new bootstrap.Toast(toastEl, {
              autohide: true,
              delay: duration,
            })

            toastEl.classList.add('show')
            toast.show()

            // Remove element after hidden
            toastEl.addEventListener('hidden.bs.toast', () => {
              toastEl.remove()
            })
          } else {
            // Fallback: show toast manually and remove after duration
            toastEl.classList.add('show')
            setTimeout(() => {
              toastEl.classList.remove('show')
              setTimeout(() => {
                toastEl.remove()
              }, 300)
            }, duration)
          }
        } catch (error) {
          console.error('Error initializing toast:', error)
          // Fallback: show toast manually and remove after duration
          toastEl.classList.add('show')
          setTimeout(() => {
            toastEl.classList.remove('show')
            setTimeout(() => {
              toastEl.remove()
            }, 300)
          }, duration)
        }
      } catch (error) {
        console.error('Error showing toast:', error)
      }
    }

    // Provide toast methods globally
    return {
      provide: {
        toast: {
          success: (message: string, duration?: number) => showToast(message, 'success', duration || 3000),
          error: (message: string, duration?: number) => showToast(message, 'error', duration || 5000),
          warning: (message: string, duration?: number) => showToast(message, 'warning', duration || 4000),
          info: (message: string, duration?: number) => showToast(message, 'info', duration || 3000),
        },
      },
    }
  }
})
