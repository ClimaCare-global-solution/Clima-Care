import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
})

export const registerSchema = z
  .object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string(),
    role: z.enum(["citizen", "volunteer"]),
    phone: z.string().optional(),
    location: z.string().min(2, "Localização é obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  })

export const helpRequestSchema = z.object({
  title: z.string().min(5, "Título deve ter pelo menos 5 caracteres"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  category: z.enum(["water", "food", "shelter", "medical", "transport", "other"]),
  urgency: z.enum(["low", "medium", "high", "critical"]),
  location: z.string().min(2, "Localização é obrigatória"),
})

export const ngoRegistrationSchema = z.object({
  name: z.string().min(3, "Nome da organização deve ter pelo menos 3 caracteres"),
  description: z.string().min(20, "Descrição deve ter pelo menos 20 caracteres"),
  email: z.string().email("Email inválido"),
  location: z.string().min(2, "Localização é obrigatória"),
  category: z.enum(["shelter", "food", "medical", "general"]),
  phone: z.string().optional(),
  website: z.string().url("URL inválida").optional().or(z.literal("")),
  mission: z.string().min(10, "Missão deve ter pelo menos 10 caracteres"),
  cnpj: z.string().min(14, "CNPJ deve ter 14 dígitos").max(18, "CNPJ inválido"),
})

export const profileUpdateSchema = z
  .object({
    email: z.string().email("Email inválido"),
    currentPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: z.string().min(6, "Nova senha deve ter pelo menos 6 caracteres").optional().or(z.literal("")),
    confirmNewPassword: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword !== data.confirmNewPassword) {
        return false
      }
      return true
    },
    {
      message: "Novas senhas não coincidem",
      path: ["confirmNewPassword"],
    },
  )

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type HelpRequestFormData = z.infer<typeof helpRequestSchema>
export type NGORegistrationFormData = z.infer<typeof ngoRegistrationSchema>
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>
