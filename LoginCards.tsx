import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Users2, UserCircle, Bot } from "lucide-react"

const loginCards = [
  {
    title: "Staffing Agency",
    description: "Manage Clients and Staff", // Updated this line
    icon: Building2,
  },
  {
    title: "Hotels & Businesses",
    description: "Post shifts and Hire Extra Staff",
    icon: Users2,
  },
  {
    title: "Shift Workers",
    description: "Clock-in for Extra Shifts",
    icon: UserCircle,
  },
  {
    title: "AI Agent",
    description: "Activate Agent for Automation",
    icon: Bot,
  },
]

export function LoginCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
      {loginCards.map((card, index) => (
        <Card key={index} className="bg-white shadow-lg h-[280px] flex flex-col">
          <CardContent className="p-6 flex flex-col h-full">
            <div className="h-16 w-full bg-gradient-to-r from-purple-100 to-green-100 rounded-lg flex items-center justify-center mb-6">
              <card.icon className="h-8 w-8 text-purple-600" />
            </div>

            <div className="flex flex-col flex-grow items-center justify-start">
              <h3 className="font-semibold text-center text-base mb-3">{card.title}</h3>
              <p className="text-sm text-gray-600 text-center mb-6">{card.description}</p>
            </div>

            <div className="w-full mt-auto">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700">
                LOGIN
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

