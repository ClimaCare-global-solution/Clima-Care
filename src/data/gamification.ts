import type { Achievement, UserLevel } from "@/types/gamification"

export const achievements: Achievement[] = [
  {
    id: "first-donation",
    title: "Primeiro Passo",
    description: "Fez sua primeira doação",
    icon: "🎯",
    category: "donation",
    requirement: 1,
    points: 50,
  },
  {
    id: "generous-heart",
    title: "Coração Generoso",
    description: "Fez 5 doações",
    icon: "❤️",
    category: "donation",
    requirement: 5,
    points: 200,
  },
  {
    id: "donation-hero",
    title: "Herói das Doações",
    description: "Fez 10 doações",
    icon: "🦸",
    category: "donation",
    requirement: 10,
    points: 500,
  },
  {
    id: "community-champion",
    title: "Campeão da Comunidade",
    description: "Fez 25 doações",
    icon: "🏆",
    category: "donation",
    requirement: 25,
    points: 1000,
  },
  {
    id: "helping-hand",
    title: "Mão Amiga",
    description: "Ajudou 5 pessoas",
    icon: "🤝",
    category: "volunteer",
    requirement: 5,
    points: 300,
  },
  {
    id: "volunteer-master",
    title: "Mestre Voluntário",
    description: "Ajudou 20 pessoas",
    icon: "⭐",
    category: "volunteer",
    requirement: 20,
    points: 800,
  },
  {
    id: "emergency-responder",
    title: "Socorrista",
    description: "Respondeu a 3 emergências climáticas",
    icon: "🚨",
    category: "special",
    requirement: 3,
    points: 600,
  },
  {
    id: "weather-warrior",
    title: "Guerreiro do Clima",
    description: "Ativo durante 5 alertas climáticos",
    icon: "⛈️",
    category: "special",
    requirement: 5,
    points: 1200,
  },
]

export const userLevels: UserLevel[] = [
  {
    level: 1,
    title: "Iniciante",
    minPoints: 0,
    maxPoints: 199,
    color: "bg-gray-100 text-gray-800",
    benefits: ["Acesso básico à plataforma"],
  },
  {
    level: 2,
    title: "Colaborador",
    minPoints: 200,
    maxPoints: 499,
    color: "bg-green-100 text-green-800",
    benefits: ["Badge de colaborador", "Prioridade em eventos"],
  },
  {
    level: 3,
    title: "Voluntário",
    minPoints: 500,
    maxPoints: 999,
    color: "bg-blue-100 text-blue-800",
    benefits: ["Badge de voluntário", "Acesso a grupos especiais", "Desconto em eventos"],
  },
  {
    level: 4,
    title: "Defensor",
    minPoints: 1000,
    maxPoints: 1999,
    color: "bg-purple-100 text-purple-800",
    benefits: ["Badge de defensor", "Mentoria de novos voluntários", "Acesso VIP"],
  },
  {
    level: 5,
    title: "Campeão",
    minPoints: 2000,
    maxPoints: 3999,
    color: "bg-orange-100 text-orange-800",
    benefits: ["Badge de campeão", "Participação em decisões", "Eventos exclusivos"],
  },
  {
    level: 6,
    title: "Lenda",
    minPoints: 4000,
    maxPoints: 9999,
    color: "bg-red-100 text-red-800",
    benefits: ["Badge de lenda", "Reconhecimento público", "Programa de embaixador"],
  },
]

export function calculateUserLevel(points: number): UserLevel {
  return userLevels.find((level) => points >= level.minPoints && points <= level.maxPoints) || userLevels[0]
}

export function getNextLevel(currentLevel: UserLevel): UserLevel | undefined {
  const currentIndex = userLevels.findIndex((level) => level.level === currentLevel.level)
  return currentIndex < userLevels.length - 1 ? userLevels[currentIndex + 1] : undefined
}

export function calculateDonationPoints(amount: number, type: "money" | "item" | "service"): number {
  switch (type) {
    case "money":
      return Math.floor(amount / 10) * 5 // 5 points per R$10
    case "item":
      return amount * 10 // 10 points per item
    case "service":
      return amount * 20 // 20 points per hour of service
    default:
      return 0
  }
}
