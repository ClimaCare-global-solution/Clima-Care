export type UserRole = "citizen" | "volunteer" | "admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  phone?: string
  location?: string
  createdAt: string
}

export interface ClimateAlert {
  id: string
  type: "heat" | "cold"
  severity: "low" | "medium" | "high" | "extreme"
  temperature: number
  location: string
  description: string
  startDate: string
  endDate?: string
  isActive: boolean
}

export interface HelpRequest {
  id: string
  title: string
  description: string
  category: "water" | "food" | "shelter" | "medical" | "transport" | "other"
  urgency: "low" | "medium" | "high" | "critical"
  location: string
  requesterId: string
  requesterName: string
  status: "open" | "in_progress" | "completed" | "cancelled"
  volunteerId?: string
  volunteerName?: string
  createdAt: string
  updatedAt: string
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: RegisterData) => Promise<boolean>
  logout: () => void
  loading: boolean
}

export interface RegisterData {
  name: string
  email: string
  password: string
  role: UserRole
  phone?: string
  location?: string
}
