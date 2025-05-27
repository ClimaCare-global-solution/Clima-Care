export interface NGO {
  id: string
  name: string
  logo: string
  mission: string
  description: string
  donationInstructions: string
  website?: string
  phone?: string
  email?: string
  location: string
  category: "shelter" | "food" | "medical" | "general"
}
