"use client"

import { useEffect, useState, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import type { MarketUpdate } from "@/types/marketUpdate"
import { subscribeToMarketUpdates, fetchMarketUpdates } from "@/lib/marketUpdateService"
import { demoUpdates } from "@/lib/demoMarketUpdates"
import { MapPin, ArrowUpRight } from "lucide-react"

// Set to false in production when real data is available
const DEMO_MODE = true
// Time to wait before fetching real data (ms)
const REAL_DATA_DELAY = 200

export function MarketUpdates() {
  const [updates, setUpdates] = useState<MarketUpdate[]>(DEMO_MODE ? demoUpdates : [])
  const [selectedCurrency, setSelectedCurrency] = useState("EUR")
  const [exchangeRates] = useState<Record<string, number>>({ EUR: 1, USD: 1.1, GBP: 0.85, CAD: 1.5, ZAR: 15, DKK: 7.5 })
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialRender, setIsInitialRender] = useState(true)
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Handler for new updates
  const handleNewUpdate = useCallback((newUpdate: MarketUpdate) => {
    setUpdates(prev => {
      // Add to beginning, keeping most recent 12 items
      const updated = [newUpdate, ...prev].slice(0, 12);
      return updated;
    });
  }, []);

  // Handler for updated updates
  const handleUpdateUpdate = useCallback((updatedUpdate: MarketUpdate) => {
    setUpdates(prev => 
      prev.map(update => update.id === updatedUpdate.id ? updatedUpdate : update)
    );
  }, []);

  // Fetch real data after initial render with demo data
  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false);
      
      if (!DEMO_MODE) {
        // Delay real data fetch to ensure smooth initial render
        const timer = setTimeout(() => {
          setIsLoading(true);
          
          fetchMarketUpdates(selectedCurrency, exchangeRates)
            .then((initialUpdates) => {
              if (initialUpdates) {
                setUpdates(initialUpdates);
              }
            })
            .catch(error => {
              console.error("Error fetching market updates:", error);
              // Fallback to demo data if fetching real data fails
              if (updates.length === 0) {
                setUpdates(demoUpdates);
              }
            })
            .finally(() => {
              setIsLoading(false);
            });
        }, REAL_DATA_DELAY);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isInitialRender, selectedCurrency, exchangeRates, updates.length]);

  // Set up real-time subscription after initial data load
  useEffect(() => {
    if (!DEMO_MODE) {
      const unsubscribe = subscribeToMarketUpdates(
        selectedCurrency,
        exchangeRates,
        handleNewUpdate,
        handleUpdateUpdate
      );
      
      return () => {
        unsubscribe();
      };
    }
  }, [selectedCurrency, exchangeRates, handleNewUpdate, handleUpdateUpdate]);

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
    <div 
      key={update.id} 
      className={`bg-gray-800/80 rounded-lg p-4 hover:bg-gray-800/90 transition-colors relative ${update.isNew ? 'animate-highlight' : ''}`}
    >
      {update.isNew && (
        <div className="absolute top-2 right-2">
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
        </div>
      )}
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-2">
          <Badge className={getTypeColor(update.type)}>{update.type}</Badge>
          <Badge className={getUrgencyColor(update.urgency_level)}>{update.urgency_level.toUpperCase()}</Badge>
        </div>
        <span className="text-green-400 font-medium">{update.rate}/hr</span>
      </div>
      <h3 className="text-white font-medium mb-1 flex items-center">
        {update.title}
        {update.highlight && <ArrowUpRight className="ml-1 h-4 w-4 text-yellow-400" />}
      </h3>
      <p className="text-gray-400 text-sm mb-2">{update.location}</p>
      <div className="flex items-center text-gray-500 text-sm">
        <MapPin className="h-4 w-4 mr-1" />
        {update.region}
      </div>
    </div>
  )

  // Filter updates for the appropriate sections
  const liveHospitalityJobs = updates.filter((update) => update.type !== "SWAP").slice(0, 4)
  const emergencyAndSwapJobs = updates
    .filter((update) => update.type === "URGENT" || update.type === "SWAP")
    .slice(0, 4)

  return (
    <div className="space-y-8 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-800/30 flex items-center justify-center z-10 rounded-lg">
          <div className="bg-gray-900 text-white px-4 py-2 rounded-md">
            Updating market data...
          </div>
        </div>
      )}
      
      {/* Live Hospitality Index */}
      <div className="bg-gray-700/90 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-green-400 font-medium text-sm">LIVE HOSPITALITY INDEX</h4>
          <div className="flex items-center gap-4">
            <div className="bg-gray-800 rounded px-3 py-1 text-white text-sm">
              <select 
                className="bg-transparent outline-none cursor-pointer"
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
              >
                {Object.keys(exchangeRates).map(currency => (
                  <option key={currency} value={currency} className="bg-gray-800">{currency}</option>
                ))}
              </select>
            </div>
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
            <div className="bg-gray-800 rounded px-3 py-1 text-white text-sm">{selectedCurrency}</div>
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
