"use client"

import React, { useState } from "react" // 🔧 Removido useEffect
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AlertTriangle, Eye, EyeOff } from "lucide-react"

interface LoginFormData {
  email: string
  password: string
}

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Partial<LoginFormData>>({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  const { login } = useAuth()
  const router = useRouter()
  const { addToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setLoginError(null)
    setLoading(true)

    if (!formData.email || !formData.password) {
      setErrors({
        email: !formData.email ? "Campo obrigatório" : undefined,
        password: !formData.password ? "Campo obrigatório" : undefined,
      })
      setLoading(false)
      return
    }

    const retryLogin = async () => {
      const result = await login(formData.email, formData.password)

      if (result === true) {
        addToast({
          type: "success",
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta ao ClimaCare.",
        })
        router.push("/")
      } else {
        setLoginError(typeof result === "string" ? result : "Email ou senha incorretos.")
      }

      clearTimeout(timeout)
      setLoading(false)
    }

    // 🔧 Corrigido: de `let` para `const`
    const timeout = setTimeout(() => {
      retryLogin()
    }, 10000)

    await retryLogin()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof LoginFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Entrar no ClimaCare</h2>
          <p className="mt-2 text-sm text-gray-600">Acesse sua conta para ajudar sua comunidade</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Entre com suas credenciais para acessar a plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loginError && (
              <div className="mb-4 flex items-start space-x-3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
                <AlertTriangle className="h-5 w-5 mt-0.5 text-red-500" />
                <p className="text-sm">{loginError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "border-red-500" : ""}
                  placeholder="seu@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? "border-red-500" : ""}
                    placeholder="Sua senha"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  type="submit"
                  className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  disabled={loading}
                >
                  Entrar
                </Button>

                {loading && (
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Não tem uma conta?{" "}
              <Link
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Cadastre-se aqui
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
