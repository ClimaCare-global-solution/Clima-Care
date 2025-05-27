export interface Donation {
  id: string
  ngoId: string
  ngoName: string
  amount: number
  type: "money" | "item" | "service"
  description: string
  date: string
  status: "pending" | "completed" | "cancelled"
}

export interface DonationStats {
  totalDonations: number
  totalAmount: number
  donationHistory: Donation[]
}
