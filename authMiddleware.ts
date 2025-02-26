import type { NextApiRequest } from "next"
import { supabase } from "./supabaseClient"

export const authMiddleware = {
  authenticateUser: async (req: NextApiRequest) => {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) return null

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)
    if (error) return null

    return user
  },

  hasRole: (user: any, role: string) => {
    return user.user_metadata.role === role
  },

  hasPermission: (user: any, permission: string) => {
    // Implement your permission logic here
    // This is a simplified example
    const rolePermissions = {
      admin: ["create:shifts", "update:applications", "delete:applications"],
      agency: ["create:shifts", "update:applications"],
      business: ["create:shifts", "update:applications"],
      staff: [],
    }

    return rolePermissions[user.user_metadata.role]?.includes(permission) || false
  },
}

