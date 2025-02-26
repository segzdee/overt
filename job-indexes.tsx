"use client"

import { useState, useEffect } from "react"
import { JobListing, type JobListingProps } from "./job-listing"
import { demoHospitalityJobs, demoEmergencyShifts } from "@/data/demoData"

async function fetchLiveData() {
  // This is where you'd normally fetch live data from your API
  // For now, we'll just return the demo data after a delay to simulate an API call
  await new Promise((resolve) => setTimeout(resolve, 2000))
  return {
    hospitalityJobs: demoHospitalityJobs,
    emergencyShifts: demoEmergencyShifts,
  }
}

export function JobIndexes() {
  const [hospitalityJobs, setHospitalityJobs] = useState<JobListingProps[]>(demoHospitalityJobs)
  const [emergencyShifts, setEmergencyShifts] = useState<JobListingProps[]>(demoEmergencyShifts)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    fetchLiveData().then((data) => {
      setHospitalityJobs(data.hospitalityJobs)
      setEmergencyShifts(data.emergencyShifts)
      setIsLoaded(true)
    })
  }, [])

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
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
      </div>

      {isLoaded && <div className="text-center text-green-500">Live data loaded successfully!</div>}
    </div>
  )
}

