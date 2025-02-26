import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"

interface JobListingProps {
  type: "URGENT" | "SWAP" | "PREMIUM"
  urgency: "HIGH" | "MEDIUM"
  rate: string
  title: string
  venue: string
  location: string
}

export function JobListing({ type, urgency, rate, title, venue, location }: JobListingProps) {
  const getBadgeColor = (type: string) => {
    switch (type) {
      case "URGENT":
        return "bg-purple-600 text-white"
      case "SWAP":
        return "bg-orange-600 text-white"
      case "PREMIUM":
        return "bg-blue-600 text-white"
      default:
        return "bg-gray-600 text-white"
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <div className="flex gap-2">
          <Badge className={getBadgeColor(type)}>{type}</Badge>
          <Badge variant="outline" className="text-yellow-400 border-yellow-400">
            {urgency}
          </Badge>
        </div>
        <span className="text-green-400 font-semibold">{rate}/hr</span>
      </div>
      <h3 className="text-white font-semibold mb-1">{title}</h3>
      <p className="text-gray-400 text-sm mb-2">{venue}</p>
      <div className="flex items-center text-gray-400 text-sm">
        <MapPin className="h-4 w-4 mr-1" />
        {location}
      </div>
    </div>
  )
}

