"use client"

import { useToast } from "@/hooks/use-toast"
import { ToastContainer } from "@/components/ui/toast"
import type { Toast as CustomToast } from "@/components/ui/toast"

export function Toaster() {
  const { toasts, removeToast } = useToast()

  const mappedToasts: CustomToast[] = toasts.map((toast) => ({
    ...toast,
    type: toast.type ?? "info", 
  }))

  return <ToastContainer toasts={mappedToasts} onRemove={removeToast} />
}
