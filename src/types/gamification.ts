export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: "donation" | "volunteer" | "community" | "special"
  requirement: number
  points: number
  unlockedAt?: string
}

export interface UserLevel {
  level: number
  title: string
  minPoints: number
  maxPoints: number
  color: string
  benefits: string[]
}

export interface DonationRecord {
  id: string
  amount: number
  type: "money" | "item" | "service"
  description: string
  recipientId?: string
  recipientName?: string
  ngoId?: string
  ngoName?: string
  date: string
  points: number
  verified: boolean
}

export interface VolunteerStats {
  totalPoints: number
  currentLevel: UserLevel
  nextLevel?: UserLevel
  totalDonations: number
  totalAmount: number
  helpRequestsFulfilled: number
  peopleHelped: number
  achievements: Achievement[]
  donationHistory: DonationRecord[]
  rank: number
  totalVolunteers: number
}
