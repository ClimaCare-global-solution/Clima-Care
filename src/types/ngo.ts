export interface NGO {
  id: string
  nome: string
  missao: string
  site?: string
  cnpj: string
  telefone?: string
  email?: string
  endereco: string
  categoria: "shelter" | "food" | "medical" | "general"
}
