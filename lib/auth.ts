import { supabase } from "./supabase"
import { useAuthStore } from "./store"

export async function signUp(email: string, password: string, role: "worker" | "agency" | "company") {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) throw error

  if (data.user) {
    // Add the user's role to the users table
    const { error: profileError } = await supabase
      .from("users")
      .insert({ id: data.user.id, email: data.user.email, role })

    if (profileError) throw profileError

    useAuthStore.getState().setUser({ id: data.user.id, email: data.user.email, role })
  }

  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error

  if (data.user) {
    // Fetch the user's role from the users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", data.user.id)
      .single()

    if (userError) throw userError

    useAuthStore.getState().setUser({ id: data.user.id, email: data.user.email, role: userData.role })
  }

  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
  useAuthStore.getState().setUser(null)
}

export async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

