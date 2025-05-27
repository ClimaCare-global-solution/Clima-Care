import type React from "react"

interface PageContainerProps {
  children: React.ReactNode
  className?: string
  background?: "default" | "blue" | "gray"
}

export function PageContainer({ children, className = "", background = "default" }: PageContainerProps) {
  const backgroundClasses = {
    default: "bg-gray-50",
    blue: "bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100",
    gray: "bg-gray-100",
  }

  return <div className={`min-h-screen ${backgroundClasses[background]} ${className}`}>{children}</div>
}
