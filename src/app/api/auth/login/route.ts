import { type NextRequest, NextResponse } from "next/server"
import { loginSchema } from "@/lib/schemas"

// Mock user database - in a real app, this would be a proper database
const mockUsers = [
  {
    id: "1",
    email: "volunteer@example.com",
    password: "password123",
    name: "João Silva",
    role: "volunteer" as const,
    phone: "(11) 99999-9999",
    location: "São Paulo, SP",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    email: "admin@example.com",
    password: "admin123",
    name: "Maria Santos",
    role: "admin" as const,
    phone: "(11) 88888-8888",
    location: "Rio de Janeiro, RJ",
    createdAt: new Date().toISOString(),
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    // Find user in mock database
    const user = mockUsers.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      message: "Login realizado com sucesso",
    })
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
