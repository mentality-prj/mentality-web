import toast from 'react-hot-toast'

export function useToast() {
  const triggerToast = (message: string, type: 'success' | 'error') => {
    if (type === 'success') toast.success(message)
    if (type === 'error') toast.error(message)
  }

  return { triggerToast }
}

export function notifySuccess(message: string) {
  toast.success(message)
}

export function notifyError(message: string) {
  toast.error(message)
}
