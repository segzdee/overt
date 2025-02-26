"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import type { MarketUpdate } from "@/types/marketUpdate"
import { subscribeToMarketUpdates, fetchMarketUpdates } from "@/lib/marketUpdateService"
import { demoUpdates } from "@/lib/demoMarketUpdates"
import { MapPin } from "lucide-react"

const DEMO_MODE = true

export function MarketUpdates() {
  const [updates, setUpdates] = useState<MarketUpdate[]>(DEMO_MODE ? demoUpdates : [])
  const [selectedCurrency] = useState("EUR")
  const [exchangeRates] = useState<Record<string, number>>({ EUR: 1 })
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!DEMO_MODE) {
      fetchMarketUpdates(selectedCurrency, exchangeRates)
        .then((initialUpdates) => {
          if (initialUpdates) {
            setUpdates(initialUpdates)
          }
        })
        .catch(console.error)

      const unsubscribe = subscribeToMarketUpdates(
        selectedCurrency,
        exchangeRates,
        (newUpdate) => {
          setUpdates((prev) => [newUpdate, ...prev])
        },
        (updatedMarket) => {
          setUpdates((prev) => prev.map((update) => (update.id === updatedMarket.id ? updatedMarket : update)))
        },
      )

      return () => {
        unsubscribe()
      }
    }
  }, [selectedCurrency, exchangeRates])

  const getTypeColor = (type: string) => {
    switch (type) {
      case "URGENT":
        return "bg-red-500 text-white"
      case "SWAP":
        return "bg-orange-500 text-white"
      case "PREMIUM":
        return "bg-purple-600 text-white"
      default:
        return "bg-gray-600 text-white"
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-yellow-500 text-black"
      case "medium":
        return "bg-yellow-400 text-black"
      default:
        return "bg-yellow-300 text-black"
    }
  }

  const formatTime = (date: Date) => {
    return (
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "UTC",
      }) + " UTC"
    )
  }

  const renderJobCard = (update: MarketUpdate) => (
    <div key={update.id} className="bg-gray-800/80 rounded-lg p-4 hover:bg-gray-800/90 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-2">
          <Badge className={getTypeColor(update.type)}>{update.type}</Badge>
          <Badge className={getUrgencyColor(update.urgency_level)}>{update.urgency_level.toUpperCase()}</Badge>
        </div>
        <span className="text-green-400 font-medium">{update.rate}/hr</span>
      </div>
      <h3 className="text-white font-medium mb-1">{update.title}</h3>
      <p className="text-gray-400 text-sm mb-2">{update.location}</p>
      <div className="flex items-center text-gray-500 text-sm">
        <MapPin className="h-4 w-4 mr-1" />
        {update.region}
      </div>
    </div>
  )

  const liveHospitalityJobs = updates.filter((update) => update.type !== "SWAP").slice(0, 4)
  const emergencyAndSwapJobs = updates
    .filter((update) => update.type === "URGENT" || update.type === "SWAP")
    .slice(0, 4)

  return (
    <div className="space-y-8">
      {/* Live Hospitality Index */}
      <div className="bg-gray-700/90 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-green-400 font-medium text-sm">LIVE HOSPITALITY INDEX</h4>
          <div className="flex items-center gap-4">
            <div className="bg-gray-800 rounded px-3 py-1 text-white text-sm">{selectedCurrency} ▾</div>
            <div className="text-gray-300 text-sm">{formatTime(currentTime)}</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {liveHospitalityJobs.map(renderJobCard)}
        </div>
        <div className="mt-4 text-gray-400 text-sm flex justify-between">
          <span>Updated every 5 minutes</span>
          <span>{updates.length} new positions added today</span>
        </div>
      </div>

      {/* Emergency & Shift Swap Index */}
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h4 className="text-green-400 font-medium text-sm">EMERGENCY & SHIFT SWAP INDEX</h4>
            <Badge className="bg-red-500 text-white">{emergencyAndSwapJobs.length} Active</Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-gray-800 rounded px-3 py-1 text-white text-sm">{selectedCurrency} ▾</div>
            <div className="text-gray-300 text-sm">{formatTime(currentTime)}</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {emergencyAndSwapJobs.map(renderJobCard)}
        </div>
        <div className="mt-4 text-gray-400 text-sm">
          <span>Emergency updates in real-time</span>
        </div>
      </div>
    </div>
  )
}

