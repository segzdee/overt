"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { getCurrentUser } from "../utils/auth"

const ProtectedRoute = ({ children, allowedRoles = [] }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser()
      if (!user) {
        router.push("/login")
      } else if (allowedRoles.length > 0 && !allowedRoles.includes(user.user_metadata.role)) {
        router.push("/unauthorized")
      } else {
        setIsAuthorized(true)
      }
    }

    checkAuth()
  }, [router, allowedRoles])

  if (!isAuthorized) {
    return null // or a loading spinner
  }

  return <>{children}</>
}

export default ProtectedRoute

