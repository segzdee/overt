import { z } from "zod"

export const profileSchema = z.object({
  username: z.string().min(3).max(50),
  full_name: z.string().min(1).max(100),
  avatar_url: z.string().url().optional(),
  website: z.string().url().optional(),
  role: z.enum(["admin", "agency", "business", "staff"]),
})

export const shiftSchema = z.object({
  position: z.string().min(1).max(100),
  company: z.string().min(1).max(100),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  hourlyRate: z.number().positive(),
})

export const applicationSchema = z.object({
  shift_id: z.string().uuid(),
  user_id: z.string().uuid(),
  status: z.enum(["pending", "accepted", "rejected"]),
})

export type Profile = z.infer<typeof profileSchema>
export type Shift = z.infer<typeof shiftSchema>
export type Application = z.infer<typeof applicationSchema>

