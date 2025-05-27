"use client"

import type React from "react"

import { useParams, useRouter } from "next/navigation"
import { mockNGOs } from "@/data/ngos"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart, MapPin, Globe, Phone, Mail, ExternalLink, Users, CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { PageContainer } from "@/components/body/page-container"
import { SectionContainer } from "@/components/body/section-container"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { ToastContainer } from "@/components/ui/toast"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import type { Donation } from "@/types/donation"
import { Input } from "@/components/ui/input"

export default function NGODetailPage() {
  const params = useParams()
  const router = useRouter()
  const ngoId = params.id as string

  const ngo = mockNGOs.find((n) => n.id === ngoId)

  const { user } = useAuth()
  const { toasts, addToast, removeToast } = useToast()

  const [showDonationForm, setShowDonationForm] = useState(false)
  const [showVolunteerForm, setShowVolunteerForm] = useState(false)
  const [donationForm, setDonationForm] = useState({
    amount: "",
    type: "money" as "money" | "item" | "service",
    description: "",
  })
  const [volunteerForm, setVolunteerForm] = useState({
    name: "",
    email: "",
    phone: "",
    availability: "",
    skills: "",
    motivation: "",
  })

  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!ngo) return

    const amount = Number.parseFloat(donationForm.amount)
    if (isNaN(amount) || amount <= 0) {
      addToast({
        type: "error",
        title: "Erro na doação",
        description: "Por favor, insira um valor válido maior que zero.",
      })
      return
    }

    const newDonation: Donation = {
      id: Date.now().toString(),
      ngoId: ngo.id,
      ngoName: ngo.name,
      amount,
      type: donationForm.type,
      description: donationForm.description,
      date: new Date().toISOString(),
      status: "completed",
    }

    const existingDonations = JSON.parse(localStorage.getItem("userDonations") || "[]")
    const updatedDonations = [newDonation, ...existingDonations]
    localStorage.setItem("userDonations", JSON.stringify(updatedDonations))

    setShowDonationForm(false)
    setDonationForm({ amount: "", type: "money", description: "" })

    addToast({
      type: "success",
      title: "Doação registrada!",
      description: `Sua doação para ${ngo.name} foi registrada com sucesso.`,
    })
  }

  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!ngo) return

    // In a real app, this would be sent to the NGO
    const volunteerApplication = {
      id: Date.now().toString(),
      ngoId: ngo.id,
      ngoName: ngo.name,
      ...volunteerForm,
      date: new Date().toISOString(),
      status: "pending",
    }

    // Save to localStorage for demo purposes
    const existingApplications = JSON.parse(localStorage.getItem("volunteerApplications") || "[]")
    const updatedApplications = [volunteerApplication, ...existingApplications]
    localStorage.setItem("volunteerApplications", JSON.stringify(updatedApplications))

    setShowVolunteerForm(false)
    setVolunteerForm({
      name: "",
      email: "",
      phone: "",
      availability: "",
      skills: "",
      motivation: "",
    })

    addToast({
      type: "success",
      title: "Inscrição enviada!",
      description: `Sua inscrição para ser voluntário em ${ngo.name} foi enviada com sucesso.`,
    })
  }

  if (!ngo) {
    return (
      <PageContainer background="default">
        <SectionContainer className="py-8">
          <div className="container mx-auto px-4 py-8">
            <Card className="text-center py-12">
              <CardContent>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Organização não encontrada</h3>
                <p className="text-gray-600 mb-4">A organização que você está procurando não existe.</p>
                <Link href="/help-center">
                  <Button>Voltar para Central de Ajuda</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </SectionContainer>
      </PageContainer>
    )
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

  return (
    <PageContainer background="default">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <SectionContainer className="py-8">
        <div className="container mx-auto px-4 py-8">
          {/* Donation Form Modal */}
          {showDonationForm && ngo && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span>Doar para {ngo.name}</span>
                  </CardTitle>
                  <CardDescription>Preencha os dados da sua doação</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleDonationSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="type">Tipo de Doação</Label>
                      <Select
                        value={donationForm.type}
                        onValueChange={(value: any) => setDonationForm((prev) => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="money">💰 Dinheiro</SelectItem>
                          <SelectItem value="item">📦 Itens/Produtos</SelectItem>
                          <SelectItem value="service">🕐 Serviço/Tempo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="amount">
                        {donationForm.type === "money" && "Valor (R$)"}
                        {donationForm.type === "item" && "Quantidade"}
                        {donationForm.type === "service" && "Horas"}
                      </Label>
                      <Input
                        id="amount"
                        type="number"
                        min="0.01"
                        step={donationForm.type === "money" ? "0.01" : "1"}
                        value={donationForm.amount}
                        onChange={(e) => setDonationForm((prev) => ({ ...prev, amount: e.target.value }))}
                        placeholder={
                          donationForm.type === "money" ? "100.00" : donationForm.type === "item" ? "5" : "3"
                        }
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

          {/* Volunteer Form Modal */}
          {showVolunteerForm && ngo && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    <span>Ser Voluntário - {ngo.name}</span>
                  </CardTitle>
                  <CardDescription>Preencha o formulário para se candidatar como voluntário</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="volunteer-name">Nome Completo</Label>
                      <Input
                        id="volunteer-name"
                        value={volunteerForm.name}
                        onChange={(e) => setVolunteerForm((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Seu nome completo"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="volunteer-email">Email</Label>
                      <Input
                        id="volunteer-email"
                        type="email"
                        value={volunteerForm.email}
                        onChange={(e) => setVolunteerForm((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="seu@email.com"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="volunteer-phone">Telefone</Label>
                      <Input
                        id="volunteer-phone"
                        value={volunteerForm.phone}
                        onChange={(e) => setVolunteerForm((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="(11) 99999-9999"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="availability">Disponibilidade</Label>
                      <Select
                        value={volunteerForm.availability}
                        onValueChange={(value) => setVolunteerForm((prev) => ({ ...prev, availability: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione sua disponibilidade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekdays">Dias de semana</SelectItem>
                          <SelectItem value="weekends">Fins de semana</SelectItem>
                          <SelectItem value="flexible">Horário flexível</SelectItem>
                          <SelectItem value="emergencies">Apenas emergências</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="skills">Habilidades e Experiências</Label>
                      <Textarea
                        id="skills"
                        value={volunteerForm.skills}
                        onChange={(e) => setVolunteerForm((prev) => ({ ...prev, skills: e.target.value }))}
                        placeholder="Descreva suas habilidades relevantes..."
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="motivation">Por que quer ser voluntário?</Label>
                      <Textarea
                        id="motivation"
                        value={volunteerForm.motivation}
                        onChange={(e) => setVolunteerForm((prev) => ({ ...prev, motivation: e.target.value }))}
                        placeholder="Conte-nos sua motivação..."
                        required
                      />
                    </div>

                    <div className="flex space-x-3">
                      <Button type="submit" className="flex-1">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Enviar Inscrição
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowVolunteerForm(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
          {/* Back Button */}
          <div className="mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header Card */}
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4">
                    <Image
                      src={ngo.logo || "/placeholder.svg"}
                      alt={`Logo ${ngo.name}`}
                      width={120}
                      height={120}
                      className="rounded-full border-4 border-blue-100"
                    />
                  </div>
                  <CardTitle className="text-3xl text-gray-900">{ngo.name}</CardTitle>
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-600">{ngo.location}</span>
                  </div>
                  <div className="mt-3">
                    <Badge className={getCategoryColor(ngo.category)}>{getCategoryLabel(ngo.category)}</Badge>
                  </div>
                </CardHeader>
              </Card>

              {/* Mission Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span>Nossa Missão</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed text-lg">{ngo.mission}</p>
                </CardContent>
              </Card>

              {/* Description Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Sobre a Organização</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{ngo.description}</p>
                </CardContent>
              </Card>

              {/* Donation Instructions Card */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-800">Como Doar</CardTitle>
                  <CardDescription className="text-green-700">
                    Sua contribuição faz a diferença na vida de muitas pessoas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-green-800 leading-relaxed mb-4">{ngo.donationInstructions}</p>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <Heart className="w-4 h-4 mr-2" />
                    Doar para esta organização
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {ngo.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">Telefone</p>
                        <p className="text-gray-600">{ngo.phone}</p>
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

                  {ngo.website && (
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">Website</p>
                        <a
                          href={ngo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                        >
                          <span className="break-all">{ngo.website}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {user ? (
                    <>
                      <Button className="w-full" variant="default" onClick={() => setShowDonationForm(true)}>
                        <Heart className="w-4 h-4 mr-2" />
                        Fazer Doação
                      </Button>
                      <Button className="w-full" variant="outline" onClick={() => setShowVolunteerForm(true)}>
                        <Users className="w-4 h-4 mr-2" />
                        Ser Voluntário
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-600 mb-3">Faça login para doar ou ser voluntário</p>
                      <Link href="/login">
                        <Button className="w-full">Fazer Login</Button>
                      </Link>
                    </div>
                  )}
                  <Button className="w-full" variant="outline">
                    Compartilhar
                  </Button>
                </CardContent>
              </Card>

              {/* Back to Help Center */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <p className="text-blue-800 text-sm mb-3">Explore outras organizações que também precisam de ajuda</p>
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
