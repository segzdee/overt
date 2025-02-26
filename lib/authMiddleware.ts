import type { NextApiRequest, NextApiResponse } from "next"
import { ROUTE_ACCESS_CONTROL, DASHBOARD_ROUTES, PUBLIC_ROUTES } from "./constants"

export const authMiddleware = {
  protectRoute: (route: string, userRole: string) => {
    const routeAccess = ROUTE_ACCESS_CONTROL[route]

    if (!routeAccess) {
      return false // Unknown route
    }

    // No role restriction
    if (!routeAccess.requiredRole) {
      return true
    }

    // Check for 'any' role or specific role match
    return routeAccess.requiredRole.includes("any") || routeAccess.requiredRole.includes(userRole)
  },

  determineInitialDashboard: (userRole: string) => {
    switch (userRole) {
      case "platform_admin":
        return DASHBOARD_ROUTES.PLATFORM_ADMIN_DASHBOARD
      case "agency":
      case "company":
        return DASHBOARD_ROUTES.AGENCY_DASHBOARD
      case "shift_worker":
        return DASHBOARD_ROUTES.SHIFT_WORKER_DASHBOARD
      default:
        return PUBLIC_ROUTES.LOGIN // Fallback
    }
  },
}

export function withAuth(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const user = req.session?.user
    const path = req.url

    if (!user && !PUBLIC_ROUTES[path]) {
      res.writeHead(302, { Location: PUBLIC_ROUTES.LOGIN })
      res.end()
      return
    }

    if (user && !authMiddleware.protectRoute(path, user.role)) {
      res.writeHead(302, { Location: authMiddleware.determineInitialDashboard(user.role) })
      res.end()
      return
    }

    return handler(req, res)
  }
}

