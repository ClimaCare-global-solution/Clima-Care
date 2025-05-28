"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { ToastContainer } from "@/components/ui/toast"
import { ngoRegistrationSchema, type NGORegistrationFormData } from "@/lib/schemas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageContainer } from "@/components/body/page-container"
import { SectionContainer } from "@/components/body/section-container"
import { ArrowLeft, Building2, CheckCircle, Lock, User } from "lucide-react"
import Link from "next/link"

export default function RegisterNGOPage() {
  const [formData, setFormData] = useState<NGORegistrationFormData>({
    name: "",
    description: "",
    email: "",
    location: "",
    category: "general",
    phone: "",
    website: "",
    mission: "",
    cnpj: "",
  })
  const [errors, setErrors] = useState<Partial<NGORegistrationFormData>>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toasts, addToast, removeToast } = useToast()

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      addToast({
        type: "error",
        title: "Acesso negado",
        description: "Você precisa estar logado para cadastrar uma organização.",
      })
      router.push("/login")
    }
  }, [user, authLoading, router, addToast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const validatedData = ngoRegistrationSchema.parse(formData)

      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSubmitted(true)
      addToast({
        type: "success",
        title: "Cadastro enviado com sucesso!",
        description: "Sua solicitação será analisada pela nossa equipe.",
      })
    } catch (error: any) {
      if (error.errors) {
        const fieldErrors: Partial<NGORegistrationFormData> = {}
        error.errors.forEach((err: any) => {
          fieldErrors[err.path[0] as keyof NGORegistrationFormData] = err.message
        })
        setErrors(fieldErrors)
      }

      addToast({
        type: "error",
        title: "Erro no cadastro",
        description: "Por favor, verifique os campos e tente novamente.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof NGORegistrationFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value as NGORegistrationFormData["category"] }))
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: undefined }))
    }
  }

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <PageContainer background="default">
        <SectionContainer className="py-12">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="pt-6 pb-8 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Verificando autenticação...</p>
              </CardContent>
            </Card>
          </div>
        </SectionContainer>
      </PageContainer>
    )
  }

  // Show login required message if user is not authenticated
  if (!user) {
    return (
      <PageContainer background="default">
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        <SectionContainer className="py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6 pb-8 text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-bold text-yellow-800 mb-4">Acesso Restrito</h2>
                <p className="text-yellow-700 mb-6">
                  Você precisa estar logado para cadastrar uma nova organização na plataforma.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button asChild>
                    <Link href="/login">
                      <User className="w-4 h-4 mr-2" />
                      Fazer Login
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/register">Criar Conta</Link>
                  </Button>
                </div>
                <div className="mt-4">
                  <Button asChild variant="ghost">
                    <Link href="/help-center">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Voltar para Central de Ajuda
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </SectionContainer>
      </PageContainer>
    )
  }

  if (submitted) {
    return (
      <PageContainer background="default">
        <SectionContainer className="py-12">
          <Card className="max-w-2xl mx-auto border-green-200 bg-green-50">
            <CardContent className="pt-6 pb-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-green-800 mb-4">Cadastro Recebido!</h2>
              <p className="text-green-700 mb-6">
                Sua solicitação de cadastro para <strong>{formData.name}</strong> foi recebida com sucesso.
              </p>
              <div className="bg-white p-6 rounded-lg border border-green-200 mb-6 text-left">
                <p className="text-gray-700 mb-4">
                  <strong>Próximos passos:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>
                    Sua solicitação passará por um processo de revisão para confirmar a legitimidade da organização.
                  </li>
                  <li>
                    Nossa equipe poderá entrar em contato através do email fornecido para solicitar documentos
                    adicionais.
                  </li>
                  <li>O processo de revisão geralmente leva de 3 a 5 dias úteis.</li>
                  <li>Você receberá uma notificação por email quando sua organização for aprovada.</li>
                </ul>
              </div>
              <div className="flex justify-center space-x-4">
                <Button asChild variant="outline">
                  <Link href="/help-center">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar para Central de Ajuda
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/">Ir para Dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </SectionContainer>
      </PageContainer>
    )
  }

  return (
    <PageContainer background="default">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <SectionContainer className="py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </Button>
          </div>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Cadastrar Nova Organização</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Registre sua organização para ajudar comunidades durante eventos climáticos extremos
            </p>

            {/* User info display */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 max-w-md mx-auto">
              <p className="text-sm text-blue-800">
                <User className="w-4 h-4 inline mr-1" />
                Cadastrando como: <strong>{user.name}</strong> ({user.email})
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informações da Organização</CardTitle>
              <CardDescription>
                Preencha os dados abaixo para cadastrar sua organização. Todos os campos marcados com * são
                obrigatórios.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">
                      Nome da Organização <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={errors.name ? "border-red-500" : ""}
                      placeholder="Nome completo da organização"
                      required
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div>
                    <Label htmlFor="mission">
                      Missão <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="mission"
                      name="mission"
                      value={formData.mission}
                      onChange={handleChange}
                      className={errors.mission ? "border-red-500" : ""}
                      placeholder="Descreva brevemente a missão da sua organização"
                      required
                    />
                    {errors.mission && <p className="mt-1 text-sm text-red-600">{errors.mission}</p>}
                  </div>

                  <div>
                    <Label htmlFor="description">
                      Descrição Detalhada <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className={`${errors.description ? "border-red-500" : ""} min-h-[120px]`}
                      placeholder="Descreva detalhadamente o trabalho da sua organização, histórico e como ajuda durante eventos climáticos"
                      required
                    />
                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">
                        Email de Contato <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? "border-red-500" : ""}
                        placeholder="contato@suaorganizacao.org"
                        required
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={errors.phone ? "border-red-500" : ""}
                        placeholder="(11) 99999-9999"
                      />
                      {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cnpj">
                        CNPJ <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="cnpj"
                        name="cnpj"
                        value={formData.cnpj}
                        onChange={handleChange}
                        className={errors.cnpj ? "border-red-500" : ""}
                        placeholder="00.000.000/0000-00"
                        required
                      />
                      {errors.cnpj && <p className="mt-1 text-sm text-red-600">{errors.cnpj}</p>}
                      <p className="mt-1 text-xs text-gray-500">
                        Digite apenas números ou no formato XX.XXX.XXX/XXXX-XX
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="location">
                        Localização <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className={errors.location ? "border-red-500" : ""}
                        placeholder="Cidade, Estado"
                        required
                      />
                      {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="category">
                      Categoria <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.category} onValueChange={handleCategoryChange}>
                      <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shelter">Abrigo</SelectItem>
                        <SelectItem value="food">Alimentação</SelectItem>
                        <SelectItem value="medical">Médico</SelectItem>
                        <SelectItem value="general">Geral</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                  </div>

                  <div>
                    <Label htmlFor="website">Website (Opcional)</Label>
                    <Input
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className={errors.website ? "border-red-500" : ""}
                      placeholder="https://www.suaorganizacao.org"
                    />
                    {errors.website && <p className="mt-1 text-sm text-red-600">{errors.website}</p>}
                    <p className="mt-1 text-xs text-gray-500">Inclua o protocolo (http:// ou https://)</p>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Importante:</strong> Todas as organizações passam por um processo de verificação antes de
                    serem listadas na plataforma. Poderemos solicitar documentos adicionais para comprovar a
                    legitimidade da organização.
                  </p>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Enviando..." : "Cadastrar Organização"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </SectionContainer>
    </PageContainer>
  )
}
