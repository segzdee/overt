export interface MarketUpdate {
  id: string
  type: "URGENT" | "SWAP" | "PREMIUM"
  title: string
  location: string
  rate: string
  highlight: boolean
  created_at: string
  region: string
  currency: string
  original_rate: number
  currency_rate: number
  urgency_level: "low" | "medium" | "high"
  isNew?: boolean
  isUpdating?: boolean
}

