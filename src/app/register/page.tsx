'use client'

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Eye, EyeOff } from "lucide-react"

type RegisterFormData = {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: "cidadao" | "voluntario"
  phone?: string
  location?: string
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "cidadao",
    phone: "",
    location: "",
  })
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { register } = useAuth()
  const router = useRouter()
  const {  addToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "As senhas não coincidem" })
      setLoading(false)
      return
    }

    const mappedData = {
      nome: formData.name,
      email: formData.email,
      senha: formData.password,
      tipo: formData.role,
      telefone: formData.phone,
    }

    const success = await register(mappedData)

    if (success === true) {
      addToast({
        type: "success",
        title: "Cadastro realizado com sucesso!",
        description: "Bem-vindo ao ClimaCare.",
      })
      router.push("/")
    } else {
      addToast({
        type: "error",
        title: "Erro no cadastro",
        description: typeof success === "string" ? success : "Não foi possível criar sua conta.",
      })
    }

    setLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof RegisterFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value as "cidadao" | "voluntario" }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Cadastrar no ClimaCare</h2>
          <p className="mt-2 text-sm text-gray-600">Crie sua conta e comece a ajudar sua comunidade</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Criar Conta</CardTitle>
            <CardDescription>Preencha os dados abaixo para se cadastrar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "border-red-500" : ""}
                  placeholder="Seu nome completo"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "border-red-500" : ""}
                  placeholder="seu@email.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="role">Tipo de Usuário</Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="cidadao">Cidadão</SelectItem>
                    <SelectItem value="voluntario">Voluntário</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  name="location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className={errors.location ? "border-red-500" : ""}
                  placeholder="Cidade, Estado"
                />
                {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Telefone (Opcional)</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? "border-red-500" : ""}
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? "border-red-500" : ""}
                    placeholder="Confirme sua senha"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              <Button type="submit" className="bg-blue-400 text-white px-4 py-2 rounded flex items-center cursor-pointer hover:bg-blue-700 transition-colors" disabled={loading}>
                {loading ? "Criando conta..." : "Criar Conta"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{" "}
                <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Faça login aqui
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
