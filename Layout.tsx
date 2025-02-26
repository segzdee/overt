import type React from "react"
import { useUserStore } from "../store/userStore"
import Link from "next/link"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { user, logout, isLoading } = useUserStore()

  return (
    <div>
      <header>
        <nav>
          <Link href="/">Home</Link>
          {user ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <button onClick={logout} disabled={isLoading}>
                {isLoading ? "Logging out..." : "Log out"}
              </button>
            </>
          ) : (
            <Link href="/login">Log in</Link>
          )}
        </nav>
      </header>
      <main>{children}</main>
    </div>
  )
}

