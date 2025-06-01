"use client"

import { useEffect } from "react"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"

type ToastType = "success" | "error" | "warning" | "info"

interface Toast {
  id: string
  type: ToastType
  title?: string | React.ReactNode
  description?: string | React.ReactNode
}

interface ToastProps {
  toast: Toast
  onRemove: (id: string) => void
}

export function ToastComponent({ toast, onRemove }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id)
    }, 5000)

    return () => clearTimeout(timer)
  }, [toast.id, onRemove])

  const icons: Record<ToastType, React.FC<React.SVGProps<SVGSVGElement>>> = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }

  const colors: Record<ToastType, string> = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  }

  // Garantindo que toast.type está dentro do tipo esperado, com fallback
  const toastType: ToastType = toast.type ?? "info"
  const Icon = icons[toastType]

  return (
    <div
      className={`max-w-sm w-full border rounded-lg shadow-lg p-4 ${colors[toastType]} animate-in slide-in-from-right duration-300`}
    >
      <div className="flex items-start">
        <Icon className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-medium">{toast.title}</h4>
          {toast.description && <p className="mt-1 text-sm opacity-90">{toast.description}</p>}
        </div>
        <button onClick={() => onRemove(toast.id)} className="ml-3 flex-shrink-0 opacity-70 hover:opacity-100">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}
