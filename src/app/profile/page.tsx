"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PageContainer } from "@/components/body/page-container"
import { SectionContainer } from "@/components/body/section-container"
import {
  User, Mail, Phone, Edit, Heart, Users, 
  Activity, DollarSign, 
} from "lucide-react"
import Link from "next/link"

import { useToast } from "@/hooks/use-toast"

interface Donation {
  tipoDoacao: string
  valor: number
  ongId: number
  usuarioId: number
}

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { addToast} = useToast()

  const [donations, setDonations] = useState<Donation[]>([])
  const [totalDonated, setTotalDonated] = useState(0)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (user) {
      fetch(`https://crudjava.onrender.com/profile?email=${user.email}`)
        .then(res => res.json())
        .then(data => {
          setDonations(data.doacoes || [])
          const total = (data.doacoes || []).reduce((acc: number, d: { valor: number }) => acc + (d.valor || 0), 0)
          setTotalDonated(total)
        })
        .catch(() => {
          addToast({ type: "error", title: "Erro", description: "Falha ao carregar perfil" })
        })
    }
  }, [user, loading,addToast,router])

  if (loading || !user) return null

  const getInitials = (nome?: string) =>
    nome?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?"

  const getRoleInfo = (tipo: string) => {
    switch (tipo) {
      case "voluntario":
        return { label: "Voluntário", color: "bg-blue-100 text-blue-800", icon: Heart }
      case "cidadao":
        return { label: "Cidadão", color: "bg-green-100 text-green-800", icon: Users }
      default:
        return { label: "Usuário", color: "bg-gray-100 text-gray-800", icon: User }
    }
  }

  const roleInfo = getRoleInfo(user.tipo)
  const RoleIcon = roleInfo.icon

  return (
    <PageContainer background="default">
      
      <SectionContainer className="py-8 ">
        <h1 className="flex justify-center text-3xl font-bold text-gray-900 mb-2">Meu Perfil</h1>
        <p className="flex justify-center text-lg text-gray-600 mb-8">Gerencie suas informações e acompanhe sua atividade na plataforma</p>

        <div className="flex justify-center">
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-24" />
              <CardContent className="relative pt-0 pb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-12">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.nome}`} />
                    <AvatarFallback>{getInitials(user.nome)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{user.nome}</h2>
                        <div className="flex items-center gap-2 mt-1">
                          <RoleIcon className="w-4 h-4 text-gray-500" />
                          <Badge className={roleInfo.color}>{roleInfo.label}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Membro da comunidade</p>
                      </div>
                      <Button className="mt-4 sm:mt-0" variant="outline" asChild>
                        <Link href="/update-user">
                          <Edit className="w-4 h-4 mr-2" />
                          Editar Perfil
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" /> Informações de Contato
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p><Mail className="inline w-4 h-4 mr-2 text-gray-400" />{user.email}</p>
                {user.telefone && <p><Phone className="inline w-4 h-4 mr-2 text-gray-400" />{user.telefone}</p>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" /> Estatísticas de Atividade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="justify-items-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-red-50 flex gap-3 items-center">
                    <Heart className="w-6 h-6 text-red-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Doações Feitas</p>
                      <p className="text-2xl font-bold text-gray-900">{donations.length}</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-green-50 flex gap-3 items-center">
                    <DollarSign className="w-6 h-6 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Valor Total Doado</p>
                      <p className="text-2xl font-bold text-gray-900">R$ {totalDonated.toFixed(2)}</p>
                    </div>
                  </div>
                  
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SectionContainer>
    </PageContainer>
  )
}
