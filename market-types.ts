/**
 * Market Update Types for OvertimeStaff Platform
 */

/**
 * Types of market listings
 */
export type MarketUpdateType = "URGENT" | "SWAP" | "PREMIUM";

/**
 * Urgency levels for market listings
 */
export type UrgencyLevel = "low" | "medium" | "high";

/**
 * Base MarketUpdate interface
 */
export interface MarketUpdate {
  /** Unique identifier */
  id: string;
  
  /** Type of listing */
  type: MarketUpdateType;
  
  /** Job title or position */
  title: string;
  
  /** Location name (e.g., hotel or restaurant name) */
  location: string;
  
  /** Formatted rate with currency symbol */
  rate: string;
  
  /** Whether to highlight this listing */
  highlight: boolean;
  
  /** ISO timestamp when created */
  created_at: string;
  
  /** Geographic region */
  region: string;
  
  /** Currency code (e.g., EUR, USD) */
  currency: string;
  
  /** Original numeric rate before formatting */
  original_rate: number;
  
  /** Exchange rate relative to base currency */
  currency_rate: number;
  
  /** Urgency level */
  urgency_level: UrgencyLevel;
  
  /** UI flag for newly added items */
  isNew?: boolean;
  
  /** UI flag for items being updated */
  isUpdating?: boolean;
}

/**
 * Database representation of a market update
 * (Used for Supabase database operations)
 */
export interface MarketUpdateRecord {
  id: string;
  type: MarketUpdateType;
  title: string;
  location: string;
  highlight: boolean;
  created_at: string;
  region: string;
  currency: string;
  original_rate: number;
  currency_rate: number;
  urgency_level: UrgencyLevel;
  updated_at: string;
}

/**
 * Input for creating a new market update
 */
export interface CreateMarketUpdateInput {
  type: MarketUpdateType;
  title: string;
  location: string;
  highlight?: boolean;
  region: string;
  currency: string;
  original_rate: number;
  urgency_level: UrgencyLevel;
}

/**
 * Market update with statistics
 */
export interface MarketUpdateWithStats extends MarketUpdate {
  /** Number of views */
  views?: number;
  
  /** Number of applications */
  applications?: number;
  
  /** Time since posting */
  age?: string;
  
  /** Time until expiration */
  expiresIn?: string;
}

/**
 * Shift type linked to market update
 */
export interface Shift {
  id: string;
  title: string;
  description?: string;
  business_id: string;
  agency_id?: string;
  worker_id?: string;
  status: 'available' | 'pending' | 'assigned' | 'completed' | 'cancelled';
  hourly_rate: number;
  currency: string;
  start_time: string;
  end_time: string;
  location: string;
  region?: string;
  skills?: string[];
  requirements?: string;
  position_type: string;
  is_urgent: boolean;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
}

/**
 * Currency exchange rates
 */
export interface ExchangeRates {
  [currency: string]: number;
}

/**
 * Market filter options
 */
export interface MarketFilterOptions {
  types?: MarketUpdateType[];
  urgencyLevels?: UrgencyLevel[];
  regions?: string[];
  minRate?: number;
  maxRate?: number;
  currency?: string;
}
