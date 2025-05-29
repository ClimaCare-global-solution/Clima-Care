"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User, AuthContextType, RegisterData } from "@/types"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean | string> => {
    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha: password }),
      })

      if (response.status === 404) {
        return "Email ou senha inválidos"
      }

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        return true
      }

      return "Erro ao fazer login"
    } catch (error) {
      console.error("Erro no login:", error)
      return "Erro de rede ao fazer login"
    }
  }

  const register = async (userData: RegisterData): Promise<boolean | string> => {
    try {
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })

      if (response.status === 409) {
        return "Email já cadastrado"
      }

      if (response.ok) {
        const result = await response.json()
        setUser(result)
        localStorage.setItem("user", JSON.stringify(result))
        return true
      }

      return "Erro ao registrar"
    } catch (error) {
      console.error("Erro no registro:", error)
      return "Erro de rede ao registrar"
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
