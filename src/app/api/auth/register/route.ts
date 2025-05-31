import { type NextRequest, NextResponse } from "next/server"
import { registerSchema } from "@/lib/schemas"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const userData = registerSchema.parse(body)

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      email: userData.email,
      name: userData.name,
      role: userData.role,
      phone: userData.phone,
      location: userData.location,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({
      user: newUser,
      message: "Usuário cadastrado com sucesso",
    })
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao cadastrar usuário" }, { status: 400 })
  }
}
