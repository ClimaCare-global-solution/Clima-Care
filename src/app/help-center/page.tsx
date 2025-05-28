"use client"

import type React from "react"

import { useState } from "react"
import { mockNGOs } from "@/data/ngos"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Heart, Search, MapPin, Globe, Phone, Mail, Building2 } from "lucide-react"
import Image from "next/image"
import { PageContainer } from "@/components/body/page-container"
import { SectionContainer } from "@/components/body/section-container"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { ToastContainer } from "@/components/ui/toast"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle } from "lucide-react"
import type { Donation } from "@/types/donation"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function HelpCenterPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  const [showDonationForm, setShowDonationForm] = useState(false)
  const [selectedNGO, setSelectedNGO] = useState<any>(null)
  const [donationForm, setDonationForm] = useState({
    amount: "",
    type: "money" as "money" | "item" | "service",
    description: "",
  })

  const { user } = useAuth()
  const { toasts, addToast, removeToast } = useToast()

  const filteredNGOs = mockNGOs.filter((ngo) => {
    const matchesSearch =
      ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.mission.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || ngo.category === categoryFilter

    return matchesSearch && matchesCategory
  })

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

  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedNGO) return

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
      ngoId: selectedNGO.id,
      ngoName: selectedNGO.name,
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
    setSelectedNGO(null)
    setDonationForm({ amount: "", type: "money", description: "" })

    addToast({
      type: "success",
      title: "Doação registrada!",
      description: `Sua doação para ${selectedNGO.name} foi registrada com sucesso.`,
    })
  }

  return (
    <PageContainer background="default">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      {/* Donation Form Modal */}
      {showDonationForm && selectedNGO && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span>Doar para {selectedNGO.name}</span>
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
                    placeholder={donationForm.type === "money" ? "100.00" : donationForm.type === "item" ? "5" : "3"}
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
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowDonationForm(false)
                      setSelectedNGO(null)
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
      <SectionContainer className="py-8">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-red-500 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">Central de Ajuda</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conheça as organizações que trabalham incansavelmente para ajudar comunidades durante eventos climáticos
              extremos
            </p>

            {/* Register NGO Button */}
            <div className="mt-6">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/help-center/register-ong">
                  <Building2 className="w-5 h-5 mr-2" />
                  Registrar uma Nova Organização
                </Link>
              </Button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar organizações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                <SelectItem value="shelter">Abrigo</SelectItem>
                <SelectItem value="food">Alimentação</SelectItem>
                <SelectItem value="medical">Médico</SelectItem>
                <SelectItem value="general">Geral</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* NGO Grid */}
          {filteredNGOs.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma organização encontrada</h3>
                <p className="text-gray-600">Tente ajustar os filtros ou termos de busca.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNGOs.map((ngo) => (
                <Card
                  key={ngo.id}
                  className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md"
                >
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 relative">
                      <Image
                        src={ngo.logo || "/placeholder.svg?height=80&width=80"}
                        alt={`Logo ${ngo.name}`}
                        width={80}
                        height={80}
                        className="rounded-full border-4 border-blue-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <CardTitle className="text-xl text-gray-900">{ngo.name}</CardTitle>
                      <div className="flex items-center justify-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{ngo.location}</span>
                      </div>
                      <Badge className={getCategoryColor(ngo.category)}>{getCategoryLabel(ngo.category)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-gray-700 leading-relaxed">{ngo.mission}</CardDescription>

                    <div className="space-y-2 text-sm text-gray-600">
                      {ngo.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>{ngo.phone}</span>
                        </div>
                      )}
                      {ngo.email && (
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span className="truncate">{ngo.email}</span>
                        </div>
                      )}
                      {ngo.website && (
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4" />
                          <span className="truncate">{ngo.website}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      {user && (
                        <Button
                          className="w-full bg-red-300 text-red-800 hover:bg-red-500 hover:text-red-100 cursor-pointer transition-colors duration-200"
                          onClick={() => {
                            setSelectedNGO(ngo)
                            setShowDonationForm(true)
                          }}
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Fazer Doação
                        </Button>
                      )}
                      <Button variant="outline" className="w-full" asChild>
                        <a href={`/help-center/${ngo.id}`}>Saiba mais</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </SectionContainer>
    </PageContainer>
  )
}
