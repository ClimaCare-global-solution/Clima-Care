"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageContainer } from "@/components/body/page-container"
import { SectionContainer } from "@/components/body/section-container"
import { ArrowLeft, CheckCircle, Lock, User } from "lucide-react"
import Link from "next/link"

export default function RegisterNGOPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    category: "general",
    phone: "",
    website: "",
    missao: "",
    cnpj: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { addToast } = useToast()

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
      const response = await fetch("https://crudjava.onrender.com/ong/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formData.name,
          email: formData.email,
          telefone: formData.phone,
          site: formData.website,
          endereco: formData.location,
          cnpj: formData.cnpj,
          missao: formData.missao,
          categoria: formData.category,
        }),
      })

      if (response.status === 409) {
        addToast({
          type: "error",
          title: "CNPJ já cadastrado",
          description: "Já existe uma organização cadastrada com este CNPJ.",
        })
        setLoading(false)
        return
      }

      if (!response.ok) {
        throw new Error("Erro ao registrar organização")
      }

      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSubmitted(true)
      addToast({
        type: "success",
        title: "Cadastro enviado com sucesso!",
        description: "Sua solicitação será analisada pela nossa equipe.",
      })
    } catch (error) {
      console.error(error)
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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined })) 
    }
  }


  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: undefined }))
    }
  }

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

  if (!user) {
    return (
      <PageContainer background="default">

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
                  <Button asChild className="bg-blue-400 text-white px-4 py-2 rounded flex items-center cursor-pointer hover:bg-blue-700 transition-colors">
                    <Link href="/login" className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Fazer Login
                    </Link>
                  </Button>

                  <Button asChild variant="outline">
                    <Link href="/register">Criar Conta</Link>
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

      <SectionContainer className="py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informações da Organização</CardTitle>
              <CardDescription>
                Preencha os dados abaixo para cadastrar sua organização. Todos os campos marcados com * são obrigatórios.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome da Organização *</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                  </div>

                  <div>
                    <Label htmlFor="missao">Missão *</Label>
                    <Textarea
                      id="missao"
                      name="missao"
                      value={formData.missao}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email de Contato *</Label>
                    <Input id="email" name="email" value={formData.email} onChange={handleChange} required />
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                  </div>

                  <div>
                    <Label htmlFor="cnpj">CNPJ *</Label>
                    <Input id="cnpj" name="cnpj" value={formData.cnpj} onChange={handleChange} required />
                  </div>

                  <div>
                    <Label htmlFor="location">Localização *</Label>
                    <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
                  </div>

                  <div>
                    <Label htmlFor="category">Categoria *</Label>
                    <Select value={formData.category} onValueChange={handleCategoryChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="shelter">Abrigo</SelectItem>
                        <SelectItem value="food">Alimentação</SelectItem>
                        <SelectItem value="medical">Médico</SelectItem>
                        <SelectItem value="general">Geral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" name="website" value={formData.website} onChange={handleChange} />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancelar
                  </Button>
                  <Button className="w-full bg-gray-100 text-black hover:bg-blue-500 hover:text-white cursor-pointer transition-colors" type="submit" disabled={loading}>
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
