import create from "zustand"
import { persist } from "zustand/middleware"
import { supabase } from "../utils/supabaseClient"

interface UserState {
  user: any | null
  setUser: (user: any | null) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  error: string | null
  setError: (error: string | null) => void
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      isLoading: false,
      setIsLoading: (isLoading) => set({ isLoading }),
      error: null,
      setError: (error) => set({ error }),
      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password })
          if (error) throw error
          set({ user: data.user, isLoading: false })
        } catch (error) {
          set({ error: error.message, isLoading: false })
        }
      },
      logout: async () => {
        set({ isLoading: true, error: null })
        try {
          const { error } = await supabase.auth.signOut()
          if (error) throw error
          set({ user: null, isLoading: false })
        } catch (error) {
          set({ error: error.message, isLoading: false })
        }
      },
    }),
    {
      name: "user-storage",
    },
  ),
)

