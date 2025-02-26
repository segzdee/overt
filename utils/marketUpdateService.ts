import { supabase } from "@/lib/supabase/client"
import type { MarketUpdate } from "../types/marketUpdate"
import { formatRate } from "./currencyUtils"

export const subscribeToMarketUpdates = (
  selectedCurrency: string,
  exchangeRates: Record<string, number>,
  onInsert: (update: MarketUpdate) => void,
  onUpdate: (update: MarketUpdate) => void,
) => {
  const channel = supabase
    .channel("market-updates")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "market_updates",
      },
      (payload) => {
        console.log("Real-time update received:", payload)

        if (payload.eventType === "INSERT") {
          const newUpdate = {
            ...(payload.new as MarketUpdate),
            isNew: true,
            rate: formatRate(payload.new.original_rate, selectedCurrency, exchangeRates),
          }
          onInsert(newUpdate)
        } else if (payload.eventType === "UPDATE") {
          const updatedMarket = {
            ...(payload.new as MarketUpdate),
            isUpdating: true,
            rate: formatRate(payload.new.original_rate, selectedCurrency, exchangeRates),
          }
          onUpdate(updatedMarket)
        }
      },
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

export const fetchMarketUpdates = async (selectedCurrency: string, exchangeRates: Record<string, number>) => {
  const { data, error } = await supabase
    .from("market_updates")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(8)

  if (error) {
    console.error("Error fetching updates:", error)
    throw error
  }

  if (data && data.length > 0) {
    return data.map((update) => ({
      ...update,
      isNew: true,
      rate: formatRate(update.original_rate, selectedCurrency, exchangeRates),
    }))
  }

  return null
}

