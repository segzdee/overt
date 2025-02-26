"use client"

import { useState, useEffect, useCallback } from "react"
import { JobListing, type JobListingProps } from "./job-listing"
import { demoHospitalityJobs, demoEmergencyShifts } from "@/data/demoData"
import { supabase, safeQuery } from "@/lib/supabase/client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

// Constants
const DEMO_MODE = true; // Set to false in production
const REFRESH_INTERVAL = 60000; // 60 seconds
const INITIAL_LOAD_DELAY = 300; // ms

/**
 * Fetch live job data from the API
 */
async function fetchLiveJobData() {
  try {
    if (DEMO_MODE) {
      // In demo mode, simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return {
        hospitalityJobs: demoHospitalityJobs,
        emergencyShifts: demoEmergencyShifts,
      };
    }
    
    // Fetch hospitality jobs (non-emergency)
    const hospitalityJobs = await safeQuery(() => 
      supabase
        .from("shifts")
        .select("id, title:position_type, venue:location, location:region, type, urgency, rate:hourly_rate")
        .eq("is_urgent", false)
        .order("created_at", { ascending: false })
        .limit(4)
    );
    
    // Fetch emergency shifts
    const emergencyShifts = await safeQuery(() => 
      supabase
        .from("shifts")
        .select("id, title:position_type, venue:location, location:region, type, urgency, rate:hourly_rate")
        .eq("is_urgent", true)
        .order("created_at", { ascending: false })
        .limit(4)
    );
    
    return {
      hospitalityJobs: hospitalityJobs.map(mapShiftToJobListing),
      emergencyShifts: emergencyShifts.map(mapShiftToJobListing),
    };
  } catch (error) {
    console.error("Error fetching job data:", error);
    throw error;
  }
}

/**
 * Map database shift to JobListing props
 */
function mapShiftToJobListing(shift: any): JobListingProps {
  return {
    id: shift.id,
    type: shift.is_urgent ? "URGENT" : shift.is_premium ? "PREMIUM" : "SWAP",
    urgency: shift.urgency || "MEDIUM",
    rate: shift.rate.toString(),
    title: shift.title,
    venue: shift.venue,
    location: shift.location
  };
}

/**
 * JobIndexes component for displaying hospitality and emergency shifts
 */
export function JobIndexes() {
  // State variables
  const [hospitalityJobs, setHospitalityJobs] = useState<JobListingProps[]>(demoHospitalityJobs);
  const [emergencyShifts, setEmergencyShifts] = useState<JobListingProps[]>(demoEmergencyShifts);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Fetch data function
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchLiveJobData();
      setHospitalityJobs(data.hospitalityJobs);
      setEmergencyShifts(data.emergencyShifts);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching job data:", error);
      setError("Failed to load job data. Please try again later.");
      
      // Keep demo data if fetch fails
      if (hospitalityJobs.length === 0) {
        setHospitalityJobs(demoHospitalityJobs);
      }
      if (emergencyShifts.length === 0) {
        setEmergencyShifts(demoEmergencyShifts);
      }
    } finally {
      setIsLoading(false);
    }
  }, [hospitalityJobs.length, emergencyShifts.length]);

  // Initial data load
  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false);
      
      if (!DEMO_MODE) {
        // Delay the initial fetch to ensure demo data renders first
        const timer = setTimeout(() => {
          fetchData();
        }, INITIAL_LOAD_DELAY);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isInitialRender, fetchData]);

  // Set up periodic refresh
  useEffect(() => {
    if (!DEMO_MODE) {
      const intervalId = setInterval(() => {
        fetchData();
      }, REFRESH_INTERVAL);
      
      return () => clearInterval(intervalId);
    }
  }, [fetchData]);

  // Set up real-time subscription for emergency shifts
  useEffect(() => {
    if (!DEMO_MODE) {
      const channel = supabase
        .channel('emergency-shifts')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'shifts',
          filter: 'is_urgent=eq.true'
        }, (payload) => {
          // Add new emergency shift to the list
          const newShift = mapShiftToJobListing(payload.new);
          setEmergencyShifts((prev) => [newShift, ...prev.slice(0, 3)]);
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto relative">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Controls */}
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => fetchData()}
          disabled={isLoading}
          className="flex items-center gap-1"
        >
          <RefreshCcw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Live Hospitality Index */}
      <div className="bg-gray-700 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-green-400">LIVE HOSPITALITY INDEX</h4>
          <div className="flex items-center gap-2">
            <span className="text-white">EUR</span>
            <span className="text-white">{new Date().toUTCString()}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hospitalityJobs.map((job) => (
            <JobListing key={job.id} {...job} />
          ))}
        </div>
        <div className="mt-3 text-xs text-gray-400 flex justify-between items-center">
          <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          <span>{hospitalityJobs.length} positions available</span>
        </div>
      </div>

      {/* Emergency & Shift Swap Index */}
      <div className="bg-gray-900 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h4 className="text-green-400">EMERGENCY & SHIFT SWAP INDEX</h4>
            <span className="bg-red-600 text-white text-sm px-2 py-1 rounded">{emergencyShifts.length} Active</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white">EUR</span>
            <span className="text-white">{new Date().toUTCString()}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emergencyShifts.map((job) => (
            <JobListing key={job.id} {...job} />
          ))}
        </div>
        <div className="mt-3 text-xs text-gray-400">
          <span>Emergency updates in real-time</span>
        </div>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
          <div className="bg-gray-900 text-white px-4 py-2 rounded-md">
            Updating job listings...
          </div>
        </div>
      )}
    </div>
  );
}
