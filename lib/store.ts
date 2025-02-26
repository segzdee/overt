import create from "zustand"
import { persist } from "zustand/middleware"
import { supabase } from "./supabase"

type UserRole = "worker" | "agency" | "company" | "admin" | null

interface AuthState {
  user: {
    id: string
    email: string
    role: UserRole
  } | null
  setUser: (user: AuthState["user"]) => void
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      signOut: async () => {
        await supabase.auth.signOut()
        set({ user: null })
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)

