'use client'

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Heart, Search, MapPin, Globe, Phone, Mail, Building2, CheckCircle } from "lucide-react"
import Image from "next/image"
import { PageContainer } from "@/components/body/page-container"
import { SectionContainer } from "@/components/body/section-container"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { ToastContainer } from "@/components/ui/toast"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function HelpCenterPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [ngos, setNgos] = useState<any[]>([])
  const [showDonationForm, setShowDonationForm] = useState(false)
  const [selectedNGO, setSelectedNGO] = useState<any>(null)
  const [donationForm, setDonationForm] = useState({ amount: "", type: "money", description: "" })

  const { user } = useAuth()
  const { toasts, addToast, removeToast } = useToast()

  useEffect(() => {
    fetch("http://localhost:8080/ong")
      .then((res) => res.json())
      .then((data) => setNgos(data))
      .catch(() => {
        addToast({ type: "error", title: "Erro", description: "Erro ao buscar ONGs." })
      })
  }, [])

  const filteredNGOs = ngos.filter((ngo) => {
    const matchesSearch =
      ngo.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.missao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.endereco?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || ngo.categoria === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedNGO || !user) return

    const valor = parseFloat(donationForm.amount)
    if (isNaN(valor) || valor <= 0) {
      addToast({ type: "error", title: "Valor inválido", description: "Digite um valor válido." })
      return
    }

    const doacao = {
      tipoDoacao: donationForm.type,
      valor,
      usuarioId: parseInt(user.id),
      ongId: selectedNGO.id,
    }

    try {
      const response = await fetch("http://localhost:8080/help-center", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doacao),
      })

      if (!response.ok) throw new Error("Erro ao doar")

      addToast({ type: "success", title: "Doação registrada!", description: `Doação para ${selectedNGO.nome} enviada.` })
      setShowDonationForm(false)
      setSelectedNGO(null)
      setDonationForm({ amount: "", type: "money", description: "" })
    } catch {
      addToast({ type: "error", title: "Erro", description: "Tente novamente mais tarde." })
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "shelter": return "bg-blue-100 text-blue-800"
      case "food": return "bg-green-100 text-green-800"
      case "medical": return "bg-red-100 text-red-800"
      case "general": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "shelter": return "Abrigo"
      case "food": return "Alimentação"
      case "medical": return "Médico"
      case "general": return "Geral"
      default: return category
    }
  }

  return (
    <PageContainer background="default">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      {showDonationForm && selectedNGO && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span>Doar para {selectedNGO.nome}</span>
              </CardTitle>
              <CardDescription>Preencha os dados da sua doação</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDonationSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="type">Tipo de Doação</Label>
                  <Select value={donationForm.type} onValueChange={(value) => setDonationForm((prev) => ({ ...prev, type: value }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="money">💰 Dinheiro</SelectItem>
                      <SelectItem value="item">📦 Itens</SelectItem>
            
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount">{donationForm.type === "money" ? "Valor (R$)" : donationForm.type === "item" ? "Quantidade" : "Horas"}</Label>
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
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <Button type="submit" className="flex-1">
                    <CheckCircle className="w-4 h-4 mr-2" /> Confirmar Doação
                  </Button>
                  <Button type="button" variant="outline" onClick={() => { setShowDonationForm(false); setSelectedNGO(null) }}>
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
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-red-500 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">Central de Ajuda</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conheça as organizações que trabalham incansavelmente para ajudar comunidades durante eventos climáticos extremos
            </p>
            <div className="mt-6">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/help-center/register-ong">
                  <Building2 className="w-5 h-5 mr-2" /> Registrar uma Nova Organização
                </Link>
              </Button>
            </div>
          </div>
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
              <SelectContent className="bg-white">
                <SelectItem value="all">Todas as categorias</SelectItem>
                <SelectItem value="shelter">Abrigo</SelectItem>
                <SelectItem value="food">Alimentação</SelectItem>
                <SelectItem value="medical">Médico</SelectItem>
                <SelectItem value="general">Geral</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNGOs.map((ngo) => (
              <Card key={ngo.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
                <CardHeader className="text-center pb-4">
                  
                  <div className="space-y-2">
                    <CardTitle className="text-xl text-gray-900">{ngo.nome}</CardTitle>
                    <div className="flex items-center justify-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{ngo.endereco}</span>
                    </div>
                    <Badge className={getCategoryColor(ngo.categoria)}>{getCategoryLabel(ngo.categoria)}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-gray-700 leading-relaxed">{ngo.missao}</CardDescription>
                  <div className="space-y-2 text-sm text-gray-600">
                    {ngo.telefone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" /> <span>{ngo.telefone}</span>
                      </div>
                    )}
                    {ngo.email && (
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" /> <span className="truncate">{ngo.email}</span>
                      </div>
                    )}
                    {ngo.site && (
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4" /> <span className="truncate">{ngo.site}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    
                  <Button
                    variant="outline"
                    className="w-full bg-gray-100 text-black hover:bg-blue-500 hover:text-white cursor-pointer transition-colors"
                    asChild
                  >
                    <Link href={`/help-center/${ngo.id}`}>Saiba mais</Link>
                  </Button>

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </SectionContainer>
    </PageContainer>
  )
}
