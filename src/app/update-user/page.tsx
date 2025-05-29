'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
import { ToastContainer } from '@/components/ui/toast'
import { profileUpdateSchema, type ProfileUpdateFormData } from '@/lib/schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { PageContainer } from '@/components/body/page-container'
import { SectionContainer } from '@/components/body/section-container'
import {
  ArrowLeft,
  User,
  Eye,
  EyeOff,
  Save,
  Lock,
} from 'lucide-react'
import Link from 'next/link'

export default function UpdateUserPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toasts, addToast, removeToast } = useToast()

  const [formData, setFormData] = useState<ProfileUpdateFormData>({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  })
  const [errors, setErrors] = useState<Partial<ProfileUpdateFormData>>({})
  const [loading, setLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      addToast({
        type: 'error',
        title: 'Acesso negado',
        description: 'Você precisa estar logado para editar seu perfil.',
      })
      router.push('/login')
    } else if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email,
      }))
    }
  }, [user, authLoading, router, addToast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof ProfileUpdateFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const validatedData = profileUpdateSchema.parse(formData)

      const response = await fetch('http://localhost:8080/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: validatedData.email,
          senha: validatedData.currentPassword,
          novaSenha: validatedData.newPassword,
        }),
      })

      if (response.ok) {
        addToast({
          type: 'success',
          title: 'Perfil atualizado!',
          description: 'Suas informações foram atualizadas com sucesso.',
        })

        setFormData((prev) => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        }))
      } else {
        addToast({
          type: 'error',
          title: 'Erro ao atualizar',
          description: 'Verifique se a senha atual está correta.',
        })
      }
    } catch (error: any) {
      if (error.errors) {
        const fieldErrors: Partial<ProfileUpdateFormData> = {}
        error.errors.forEach((err: any) => {
          fieldErrors[err.path[0] as keyof ProfileUpdateFormData] = err.message
        })
        setErrors(fieldErrors)
      }
      addToast({
        type: 'error',
        title: 'Erro ao atualizar',
        description: 'Verifique os campos e tente novamente.',
      })
    } finally {
      setLoading(false)
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
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        <SectionContainer className="py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6 pb-8 text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-bold text-yellow-800 mb-4">Acesso Restrito</h2>
                <p className="text-yellow-700 mb-6">Você precisa estar logado para editar seu perfil.</p>
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
              </CardContent>
            </Card>
          </div>
        </SectionContainer>
      </PageContainer>
    )
  }

  return (
    <PageContainer background="default">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <SectionContainer className="py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </Button>
          </div>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Atualizar Perfil</h1>
            </div>
            <p className="text-lg text-gray-600">Atualize suas informações de conta</p>

            {/* User info display */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 max-w-md mx-auto">
              <p className="text-sm text-blue-800">
                <User className="w-4 h-4 inline mr-1" />
                Editando perfil de: <strong>{user.nome}</strong>
              </p>
            </div>
          </div>

          {/* Update Form */}
          <Card>
            <CardHeader>
              <CardTitle>Informações da Conta</CardTitle>
              <CardDescription>
                Atualize seu email e senha. Todos os campos marcados com * são obrigatórios.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "border-red-500" : ""}
                    placeholder="seu@email.com"
                    required
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Alterar Senha</h3>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">
                        Senha Atual <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          value={formData.currentPassword}
                          onChange={handleChange}
                          className={errors.currentPassword ? "border-red-500" : ""}
                          placeholder="Digite sua senha atual"
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {errors.currentPassword && <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>}
                    </div>

                    <div>
                      <Label htmlFor="newPassword">Nova Senha (opcional)</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={formData.newPassword}
                          onChange={handleChange}
                          className={errors.newPassword ? "border-red-500" : ""}
                          placeholder="Deixe em branco para manter a senha atual"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>}
                      <p className="mt-1 text-xs text-gray-500">
                        Mínimo 6 caracteres. Deixe em branco se não quiser alterar.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="confirmNewPassword">Confirmar Nova Senha</Label>
                      <div className="relative">
                        <Input
                          id="confirmNewPassword"
                          name="confirmNewPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmNewPassword}
                          onChange={handleChange}
                          className={errors.confirmNewPassword ? "border-red-500" : ""}
                          placeholder="Confirme sua nova senha"
                          disabled={!formData.newPassword}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={!formData.newPassword}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {errors.confirmNewPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.confirmNewPassword}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>Importante:</strong> Para sua segurança, você deve fornecer sua senha atual para confirmar
                    qualquer alteração.
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Alterações
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-3">Outras opções</p>
            <div className="flex justify-center space-x-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/profile">Ver Perfil Completo</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/">Ir para Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </SectionContainer>
    </PageContainer>
  )
}
