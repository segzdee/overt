export const PUBLIC_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  TOKEN_VALIDATION: "/token-validation",
}

export const DASHBOARD_ROUTES = {
  DASHBOARD: "/dashboard",
  AGENCY_DASHBOARD: "/dashboard/agency",
  COMPANY_DASHBOARD: "/dashboard/company",
  SHIFT_WORKER_DASHBOARD: "/dashboard/shift-worker",
  PLATFORM_ADMIN_DASHBOARD: "/dashboard/platform-admin",
}

export const ROUTE_ACCESS_CONTROL = {
  [PUBLIC_ROUTES.HOME]: {
    requiredRole: null,
    description: "Landing page with registration and login options",
  },
  [PUBLIC_ROUTES.LOGIN]: {
    requiredRole: null,
    description: "User login page",
  },
  [PUBLIC_ROUTES.REGISTER]: {
    requiredRole: null,
    description: "User registration page with type-based customization",
  },
  [PUBLIC_ROUTES.FORGOT_PASSWORD]: {
    requiredRole: null,
    description: "Password reset initiation",
  },
  [PUBLIC_ROUTES.RESET_PASSWORD]: {
    requiredRole: null,
    description: "Set new password",
  },
  [PUBLIC_ROUTES.TOKEN_VALIDATION]: {
    requiredRole: null,
    description: "AI Agent Token Validation",
  },
  [DASHBOARD_ROUTES.DASHBOARD]: {
    requiredRole: ["any"],
    description: "Dashboard selector and role-based redirection",
  },
  [DASHBOARD_ROUTES.AGENCY_DASHBOARD]: {
    requiredRole: ["agency", "platform_admin"],
    description: "Agency and company management dashboard",
  },
  [DASHBOARD_ROUTES.COMPANY_DASHBOARD]: {
    requiredRole: ["company", "platform_admin"],
    description: "Company-specific dashboard",
  },
  [DASHBOARD_ROUTES.SHIFT_WORKER_DASHBOARD]: {
    requiredRole: ["shift_worker", "platform_admin"],
    description: "Shift worker personal dashboard",
  },
  [DASHBOARD_ROUTES.PLATFORM_ADMIN_DASHBOARD]: {
    requiredRole: ["platform_admin"],
    description: "Platform administration dashboard",
  },
}

export const LANDING_PAGE_CONFIG = {
  findExtraStaff: {
    label: "Find Extra Staff",
    redirectTo: `${PUBLIC_ROUTES.REGISTER}?userType=company,agency`,
    description: "Registration for companies and agencies seeking staff",
  },
  findExtraShifts: {
    label: "Find Extra Shifts",
    redirectTo: `${PUBLIC_ROUTES.REGISTER}?userType=shift-worker`,
    description: "Registration for shift workers looking for opportunities",
  },
  signUp: {
    label: "Sign Up",
    redirectTo: PUBLIC_ROUTES.REGISTER,
    description: "Generic registration for all user types",
  },
  loginOptions: {
    userLogin: {
      label: "User Login",
      redirectTo: PUBLIC_ROUTES.LOGIN,
      description: "Login for existing users",
    },
    aiLogin: {
      label: "AI Agent Login",
      redirectTo: PUBLIC_ROUTES.TOKEN_VALIDATION,
      description: "Login via AI Agent Token",
    },
  },
}

