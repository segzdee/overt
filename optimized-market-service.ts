import { supabase } from "@/lib/supabase/client"
import type { MarketUpdate } from "../types/marketUpdate"
import { formatRate, convertCurrency } from "./currencyUtils"

/**
 * Subscribe to real-time market updates
 * @param selectedCurrency Currency to display rates in
 * @param exchangeRates Exchange rates for currency conversion
 * @param onInsert Callback for new market updates
 * @param onUpdate Callback for updated market updates
 * @returns Function to unsubscribe
 */
export const subscribeToMarketUpdates = (
  selectedCurrency: string,
  exchangeRates: Record<string, number>,
  onInsert: (update: MarketUpdate) => void,
  onUpdate: (update: MarketUpdate) => void,
) => {
  let retryCount = 0;
  const MAX_RETRIES = 5;
  const RETRY_DELAY = 2000; // ms
  
  // Create the subscription channel
  const setupSubscription = () => {
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
      .on('system', { event: 'disconnect' }, () => {
        console.log('Disconnected from Supabase realtime');
        
        // Attempt to reconnect if within retry limits
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          console.log(`Attempting to reconnect (${retryCount}/${MAX_RETRIES})...`);
          setTimeout(() => {
            supabase.removeChannel(channel);
            setupSubscription();
          }, RETRY_DELAY);
        }
      })
      .on('system', { event: 'reconnect' }, () => {
        console.log('Reconnected to Supabase realtime');
        retryCount = 0;
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to market updates');
          retryCount = 0;
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to market updates');
        }
      });
      
    return channel;
  };
  
  const channel = setupSubscription();

  // Return unsubscribe function
  return () => {
    console.log('Unsubscribing from market updates');
    supabase.removeChannel(channel);
  }
}

/**
 * Fetch the latest market updates
 * @param selectedCurrency Currency to display rates in
 * @param exchangeRates Exchange rates for currency conversion
 * @returns Promise with market updates or null
 */
export const fetchMarketUpdates = async (selectedCurrency: string, exchangeRates: Record<string, number>) => {
  try {
    const { data, error } = await supabase
      .from("market_updates")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(12);

    if (error) {
      console.error("Error fetching market updates:", error);
      throw error;
    }

    if (data && data.length > 0) {
      return data.map((update) => {
        // Convert rate to selected currency
        const convertedRate = convertCurrency(
          update.original_rate, 
          update.currency, 
          selectedCurrency, 
          exchangeRates
        );
        
        return {
          ...update,
          rate: formatRate(convertedRate, selectedCurrency, exchangeRates),
        };
      });
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch market updates:", error);
    throw new Error(`Failed to fetch market updates: ${error.message}`);
  }
}

/**
 * Safe query wrapper for Supabase
 * @param queryFn Function that performs a Supabase query
 * @returns Promise with data or throws error
 */
export const safeQuery = async <T>(queryFn: () => Promise<{ data: T, error: any }>) => {
  try {
    const { data, error } = await queryFn();
    
    if (error) {
      console.error("Database query error:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Database query failed:", error);
    throw new Error(`Database query failed: ${error.message}`);
  }
}
