import create from "zustand"
import { persist } from "zustand/middleware"

type UserRole = "worker" | "agency" | "company" | "admin" | null

interface UserState {
  user: {
    id: string
    email: string
    role: UserRole
  } | null
  setUser: (user: UserState["user"]) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage",
    },
  ),
)

