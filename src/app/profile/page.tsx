"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PageContainer } from "@/components/body/page-container"
import { SectionContainer } from "@/components/body/section-container"
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Phone,
  Edit,
  Heart,
  HandHeart,
  Users,
  Award,
  Activity,
  Clock,
  DollarSign,
  Package,
  History,
} from "lucide-react"
import Link from "next/link"
import type { Donation } from "@/types/donation"

interface UserStats {
  donationsMade: number
  donationsReceived: number
  helpRequestsCreated: number
  helpRequestsFulfilled: number
  volunteersHelped: number
  totalImpact: number
  donationHistory: Donation[]
  totalDonationAmount: number
}

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [userStats, setUserStats] = useState<UserStats>({
    donationsMade: 0,
    donationsReceived: 0,
    helpRequestsCreated: 0,
    helpRequestsFulfilled: 0,
    volunteersHelped: 0,
    totalImpact: 0,
    donationHistory: [],
    totalDonationAmount: 0,
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    // Load donation history from localStorage
    if (user) {
      const donationHistory: Donation[] = JSON.parse(localStorage.getItem("userDonations") || "[]")
      const totalDonationAmount = donationHistory
        .filter((d) => d.type === "money")
        .reduce((sum, d) => sum + d.amount, 0)

      const mockStats: UserStats = {
        donationsMade: donationHistory.length,
        donationsReceived: donationHistory.length,
        helpRequestsCreated:
          user.role === "citizen" ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 2),
        helpRequestsFulfilled: user.role === "volunteer" ? Math.floor(Math.random() * 12) + 3 : 0,
        volunteersHelped: 0,
        totalImpact: 0,
        donationHistory,
        totalDonationAmount,
      }

      // Calculate total impact
      mockStats.totalImpact = mockStats.donationsMade + mockStats.helpRequestsFulfilled + mockStats.volunteersHelped

      setUserStats(mockStats)
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <PageContainer background="default">
        <SectionContainer className="py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
                <div className="h-48 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="space-y-6">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
                <div className="h-48 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </SectionContainer>
      </PageContainer>
    )
  }

  if (!user) {
    return null
  }

  const getRoleInfo = (role: string) => {
    switch (role) {
      case "volunteer":
        return {
          label: "Voluntário",
          description: "Ajuda a comunidade durante emergências climáticas",
          color: "bg-blue-100 text-blue-800",
          icon: Heart,
        }
      case "citizen":
        return {
          label: "Cidadão",
          description: "Membro da comunidade",
          color: "bg-green-100 text-green-800",
          icon: Users,
        }
      default:
        return {
          label: "Usuário",
          description: "Membro da plataforma",
          color: "bg-gray-100 text-gray-800",
          icon: User,
        }
    }
  }

  const roleInfo = getRoleInfo(user.role)
  const RoleIcon = roleInfo.icon

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  const getStatCards = () => {
    const baseStats = [
      {
        title: "Doações Feitas",
        value: userStats.donationsMade,
        icon: Heart,
        color: "text-red-500",
        bgColor: "bg-red-50",
      },
      {
        title: "Valor Total Doado",
        value: `R$ ${userStats.totalDonationAmount.toFixed(2)}`,
        icon: DollarSign,
        color: "text-green-500",
        bgColor: "bg-green-50",
      },
      {
        title: "Ajudas Prestadas",
        value: userStats.donationsReceived,
        icon: HandHeart,
        color: "text-purple-500",
        bgColor: "bg-purple-50",
      },
    ]

    return baseStats
  }

  return (
    <PageContainer background="default">
      <SectionContainer className="py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meu Perfil</h1>
          <p className="text-lg text-gray-600">Gerencie suas informações e acompanhe sua atividade na plataforma</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-24"></div>
              <CardContent className="relative pt-0 pb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-6 -mt-12">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                    <AvatarFallback className="text-xl font-bold bg-blue-100 text-blue-800">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 truncate">{user.name}</h2>
                        <div className="flex items-center space-x-2 mt-1">
                          <RoleIcon className="w-4 h-4 text-gray-500" />
                          <Badge className={roleInfo.color}>{roleInfo.label}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{roleInfo.description}</p>
                      </div>

                      <Button className="mt-4 sm:mt-0" variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        Editar Perfil
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Informações de Contato</span>
                </CardTitle>
                <CardDescription>Suas informações pessoais e de contato</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                  </div>

                  {user.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Telefone</p>
                        <p className="text-gray-900">{user.phone}</p>
                      </div>
                    </div>
                  )}

                  {user.location && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Localização</p>
                        <p className="text-gray-900">{user.location}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Membro desde</p>
                      <p className="text-gray-900">{formatDate(user.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Estatísticas de Atividade</span>
                </CardTitle>
                <CardDescription>Resumo das suas contribuições para a comunidade</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getStatCards().map((stat, index) => (
                    <div key={index} className={`p-4 rounded-lg ${stat.bgColor}`}>
                      <div className="flex items-center space-x-3">
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Donation History */}
            {userStats.donationHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <History className="w-5 h-5" />
                    <span>Histórico de Doações</span>
                  </CardTitle>
                  <CardDescription>Suas doações mais recentes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userStats.donationHistory.slice(0, 5).map((donation) => (
                      <div key={donation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            {donation.type === "money" && <DollarSign className="w-5 h-5 text-green-600" />}
                            {donation.type === "item" && <Package className="w-5 h-5 text-blue-600" />}
                            {donation.type === "service" && <Clock className="w-5 h-5 text-purple-600" />}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{donation.description}</p>
                            <p className="text-sm text-gray-600">Para: {donation.ngoName}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(donation.date).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            {donation.type === "money" && `R$ ${donation.amount.toFixed(2)}`}
                            {donation.type === "item" && `${donation.amount} itens`}
                            {donation.type === "service" && `${donation.amount}h`}
                          </p>
                          <Badge
                            variant={donation.status === "completed" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {donation.status === "completed" ? "Concluída" : "Pendente"}
                          </Badge>
                        </div>
                      </div>
                    ))}

                    {userStats.donationHistory.length > 5 && (
                      <div className="text-center">
                        <Button variant="outline" size="sm">
                          Ver todas as doações ({userStats.donationHistory.length})
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Impact Summary */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-800">
                  <Award className="w-5 h-5" />
                  <span>Impacto Total</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-900 mb-2">{userStats.totalImpact}</div>
                  <p className="text-blue-700 text-sm">
                    {user.role === "volunteer" && "Pessoas ajudadas através de suas ações"}
                    {user.role === "citizen" && "Interações positivas na comunidade"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Atividade Recente</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Perfil atualizado</p>
                      <p className="text-xs text-gray-500">Hoje</p>
                    </div>
                  </div>

                  {userStats.donationHistory.length > 0 && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Doação realizada</p>
                        <p className="text-xs text-gray-500">
                          {new Date(userStats.donationHistory[0].date).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  )}

                  {user.role === "volunteer" && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Ajuda prestada</p>
                        <p className="text-xs text-gray-500">2 dias atrás</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Conta criada</p>
                      <p className="text-xs text-gray-500">{formatDate(user.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/help-center">
                  <Button className="w-full" variant="default">
                    <Heart className="w-4 h-4 mr-2" />
                    Fazer Doação
                  </Button>
                </Link>

                {user.role === "volunteer" && (
                  <Link href="/help-center">
                    <Button className="w-full" variant="outline">
                      <HandHeart className="w-4 h-4 mr-2" />
                      Oferecer Ajuda
                    </Button>
                  </Link>
                )}

                <Link href="/help-center">
                  <Button className="w-full" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Ver Organizações
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-700">Configurações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-gray-900">
                  Notificações
                </Button>
                <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-gray-900">
                  Privacidade
                </Button>
                <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-gray-900">
                  Segurança
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Excluir Conta
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </SectionContainer>
    </PageContainer>
  )
}
