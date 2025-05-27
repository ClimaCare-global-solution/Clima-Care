import { type NextRequest, NextResponse } from "next/server"
import { helpRequestSchema } from "@/lib/schemas"
import type { HelpRequest } from "@/types"

// Mock help requests data
const mockHelpRequests: HelpRequest[] = [
  {
    id: "1",
    title: "Preciso de água potável",
    description: "Família com 4 pessoas sem acesso a água potável devido ao calor extremo.",
    category: "water",
    urgency: "high",
    location: "Vila Madalena, São Paulo",
    requesterId: "1",
    requesterName: "Ana Costa",
    status: "open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Abrigo temporário",
    description: "Idoso precisa de abrigo aquecido durante a onda de frio.",
    category: "shelter",
    urgency: "critical",
    location: "Centro, Porto Alegre",
    requesterId: "2",
    requesterName: "José Silva",
    status: "open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export async function GET() {
  return NextResponse.json(mockHelpRequests)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const requestData = helpRequestSchema.parse(body)

    const newRequest: HelpRequest = {
      id: Math.random().toString(36).substr(2, 9),
      ...requestData,
      requesterId: body.requesterId || "anonymous",
      requesterName: body.requesterName || "Usuário Anônimo",
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockHelpRequests.push(newRequest)

    return NextResponse.json({
      request: newRequest,
      message: "Pedido de ajuda criado com sucesso",
    })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar pedido de ajuda" }, { status: 400 })
  }
}
