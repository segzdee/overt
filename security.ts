import type { NextApiRequest, NextApiResponse } from "next"
import cors from "cors"
import rateLimit from "express-rate-limit"
import sanitizeHtml from "sanitize-html"

// CORS configuration
const corsMiddleware = cors({
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || []
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
})

// Rate limiting configuration
const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
})

// Input sanitization
const sanitizeInput = (obj: any): any => {
  if (typeof obj !== "object" || obj === null) {
    return typeof obj === "string" ? sanitizeHtml(obj) : obj
  }

  return Object.keys(obj).reduce(
    (acc: any, key) => {
      acc[key] = sanitizeInput(obj[key])
      return acc
    },
    Array.isArray(obj) ? [] : {},
  )
}

// Middleware to apply all security measures
export const securityMiddleware = (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    await new Promise((resolve) => corsMiddleware(req, res, resolve as () => void))
    await new Promise((resolve) => rateLimitMiddleware(req, res, resolve as () => void))

    // Sanitize input
    req.body = sanitizeInput(req.body)
    req.query = sanitizeInput(req.query)

    return handler(req, res)
  }
}

