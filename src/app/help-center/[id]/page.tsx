"use client"

import type React from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart, MapPin, Globe, Phone, Mail, ExternalLink, CheckCircle, Home, Utensils, Stethoscope } from "lucide-react"

import Link from "next/link"
import { PageContainer } from "@/components/body/page-container"
import { SectionContainer } from "@/components/body/section-container"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { ToastContainer } from "@/components/ui/toast"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { NGO } from "@/types/ngo"

export default function NGODetailPage() {
  const params = useParams()
  const router = useRouter()
  const ngoId = params.id as string

  const { user } = useAuth()
  const { toasts, addToast, removeToast } = useToast()

  const [showDonationForm, setShowDonationForm] = useState(false)
  const [donationForm, setDonationForm] = useState({
    amount: "",
    type: "money" as "money" | "item" | "service",
    description: "",
  })

 
  const [ngo, setNgo] = useState<NGO | null>(null)

  useEffect(() => {
    setNgo(null)
    fetch(`http://localhost:8080/ong/${ngoId}`)
      .then(res => res.json())
      .then(data => setNgo(data))
      .catch(() => {
        addToast({ type: "error", title: "Erro", description: "ONG não encontrada." })
        router.push("/help-center")
      })
  }, [ngoId, addToast, router])

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!ngo || !user) return

    const valor = parseFloat(donationForm.amount)
    if (isNaN(valor) || valor <= 0) {
      addToast({
        type: "error",
        title: "Valor inválido",
        description: "Insira um valor maior que zero.",
      })
      return
    }

    const doacao = {
      tipoDoacao: donationForm.type,
      valor: valor,
      usuarioId: parseInt(user.id),
      ongId: parseInt(ngoId),
    }

    try {
      const response = await fetch("http://localhost:8080/help-center", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(doacao),
      })

      if (!response.ok) throw new Error("Erro ao registrar doação")

      addToast({
        type: "success",
        title: "Doação registrada!",
        description: `Doação para ${ngo.nome} enviada com sucesso.`,
      })

      setDonationForm({ amount: "", type: "money", description: "" })
      setShowDonationForm(false)
    } catch (err) {
      console.error(err)
      addToast({
        type: "error",
        title: "Erro ao doar",
        description: "Tente novamente em instantes.",
      })
    }
  }

    const getCategoryLabel = (category: string) => {
    switch (category) {
      case "shelter":
        return "Abrigo"
      case "food":
        return "Alimentação"
      case "medical":
        return "Médico"
      case "general":
        return "Geral"
      default:
        return category
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "shelter":
        return <Home className="w-10 h-10 text-blue-600" />
      case "food":
        return <Utensils className="w-10 h-10 text-green-600" />
      case "medical":
        return <Stethoscope className="w-10 h-10 text-red-600" />
      case "general":
      default:
        return <Heart className="w-10 h-10 text-purple-600" />
    }
  }
    const getCategoryColor = (category: string) => {
    switch (category) {
      case "shelter":
        return "bg-blue-100 text-blue-800"
      case "food":
        return "bg-green-100 text-green-800"
      case "medical":
        return "bg-red-100 text-red-800"
      case "general":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIconBg = (category: string) => {
    switch (category) {
      case "shelter":
        return "bg-blue-100"
      case "food":
        return "bg-green-100"
      case "medical":
        return "bg-red-100"
      case "general":
      default:
        return "bg-purple-100"
    }
  }

  if (!ngo) {
    return (
      <PageContainer background="default">
        <SectionContainer className="py-20 text-center text-gray-600">
          <p>Carregando dados da organização...</p>
        </SectionContainer>
      </PageContainer>
    )
  }

  return (
    <PageContainer background="default">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <SectionContainer className="py-8">
        <div className="container mx-auto px-4 py-8">

          {/* Donation Modal */}
          {showDonationForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md bg-white rounded-xl shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span>Doar para {ngo.nome}</span>
                  </CardTitle>
                  <CardDescription>Preencha os dados da sua doação</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleDonationSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="type">Tipo de Doação</Label>
                      <Select
                        value={donationForm.type}
                        onValueChange={(value) =>
                          setDonationForm((prev) => ({ ...prev, type: value as "money" | "item" | "service" }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de doação" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="money">💰 Dinheiro</SelectItem>
                          <SelectItem value="item">📦 Itens/Produtos</SelectItem>
                          <SelectItem value="service">🕐 Serviço/Tempo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="amount">Valor</Label>
                      <Input
                        id="amount"
                        type="number"
                        min="0.01"
                        value={donationForm.amount}
                        onChange={(e) => setDonationForm((prev) => ({ ...prev, amount: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={donationForm.description}
                        onChange={(e) => setDonationForm((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Descreva sua doação..."
                        required
                      />
                    </div>

                    <div className="flex space-x-3">
                      <Button type="submit" className="flex-1">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Confirmar Doação
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowDonationForm(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Voltar */}
          <div className="mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4">
                    
                    <div
                      className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${getCategoryIconBg(ngo.categoria)}`}
                    >
                      {getCategoryIcon(ngo.categoria)}
                    </div>
                  </div>
                  <CardTitle className="text-3xl text-gray-900">{ngo.nome}</CardTitle>
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-600">{ngo.endereco}</span>
                  </div>
                  <div className="mt-3">
                    <Badge className={getCategoryColor(ngo.categoria)}>{getCategoryLabel(ngo.categoria)}</Badge>
                  </div>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Nossa Missão</CardTitle>
                  <CardDescription className="text-sm mt-1">
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{ngo.missao}</p>
                </CardContent>
              </Card>


              <Card>
                <CardHeader>
                  <CardTitle>Como Doar</CardTitle>
                  <CardDescription className="text-green-700">
                    Sua contribuição faz a diferença na vida de muitas pessoas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  
                  <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => setShowDonationForm(true)}>
                    <Heart className="w-4 h-4 mr-2" />
                    Doar para esta organização
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {ngo.telefone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">Telefone</p>
                        <p className="text-gray-600">{ngo.telefone}</p>
                      </div>
                    </div>
                  )}

                  {ngo.email && (
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <p className="text-gray-600 break-all">{ngo.email}</p>
                      </div>
                    </div>
                  )}

                  {ngo.site && (
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">Website</p>
                        <a
                          href={ngo.site}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                        >
                          <span className="break-all">{ngo.site}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <p className="text-blue-800 text-sm mb-3">
                    Explore outras organizações que também precisam de ajuda
                  </p>
                  <Link href="/help-center">
                    <Button variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-100">
                      Ver Todas as Organizações
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SectionContainer>
    </PageContainer>
  )
}
