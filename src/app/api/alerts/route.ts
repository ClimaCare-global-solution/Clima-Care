import { NextResponse } from "next/server"
import type { ClimateAlert } from "@/types"

// Mock climate alerts data
const mockAlerts: ClimateAlert[] = [
  {
    id: "1",
    type: "heat",
    severity: "high",
    temperature: 42,
    location: "São Paulo, SP",
    description:
      "Onda de calor extremo prevista para os próximos 3 dias. Mantenha-se hidratado e evite exposição ao sol.",
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  },
  {
    id: "2",
    type: "cold",
    severity: "medium",
    temperature: 2,
    location: "Porto Alegre, RS",
    description: "Frente fria intensa com temperaturas próximas ao congelamento.",
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  },
]

export async function GET() {
  return NextResponse.json(mockAlerts)
}
