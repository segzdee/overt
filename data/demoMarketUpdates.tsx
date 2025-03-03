import type { MarketUpdate } from "@/types/marketUpdate"

export const demoUpdates: MarketUpdate[] = [
  {
    id: "101",
    type: "URGENT",
    urgency_level: "high",
    rate: "€30",
    title: "Emergency Chef Needed",
    location: "Berlin",
    highlight: true,
    created_at: "2024-01-25T10:00:00Z",
    region: "Berlin, Germany",
    currency: "EUR",
    original_rate: 30,
    currency_rate: 1,
    description: "An emergency chef is needed for a high-end restaurant in Berlin."
  },
  {
    id: "102",
    type: "PREMIUM",
    urgency_level: "medium",
    rate: "€25",
    title: "Experienced Waiter",
    location: "Munich",
    highlight: false,
    created_at: "2024-01-25T09:30:00Z",
    region: "Munich, Germany",
    currency: "EUR",
    original_rate: 25,
    currency_rate: 1,
    description: "Looking for an experienced waiter for a busy restaurant in Munich."
  },
  {
    id: "103",
    type: "SWAP",
    urgency_level: "low",
    rate: "€22",
    title: "Bartender Shift Swap",
    location: "Hamburg",
    highlight: false,
    created_at: "2024-01-25T09:00:00Z",
    region: "Hamburg, Germany",
    currency: "EUR",
    original_rate: 22,
    currency_rate: 1,
    description: "Bartender needed for a shift swap in a popular bar in Hamburg."
  },
  {
    id: "104",
    type: "URGENT",
    urgency_level: "high",
    rate: "€28",
    title: "Urgent Dishwasher Needed",
    location: "Cologne",
    highlight: true,
    created_at: "2024-01-25T08:30:00Z",
    region: "Cologne, Germany",
    currency: "EUR",
    original_rate: 28,
    currency_rate: 1,
    description: "Urgent need for a dishwasher in a busy restaurant in Cologne."
  },
  {
    id: "105",
    type: "PREMIUM",
    urgency_level: "medium",
    rate: "€26",
    title: "Hotel Receptionist",
    location: "Frankfurt",
    highlight: false,
    created_at: "2024-01-25T08:00:00Z",
    region: "Frankfurt, Germany",
    currency: "EUR",
    original_rate: 26,
    currency_rate: 1,
    description: "Seeking a hotel receptionist for a luxury hotel in Frankfurt."
  },
  {
    id: "106",
    type: "SWAP",
    urgency_level: "low",
    rate: "€23",
    title: "Kitchen Staff Swap",
    location: "Stuttgart",
    highlight: false,
    created_at: "2024-01-25T07:30:00Z",
    region: "Stuttgart, Germany",
    currency: "EUR",
    original_rate: 23,
    currency_rate: 1,
    description: "Kitchen staff needed for a shift swap in a restaurant in Stuttgart."
  },
  {
    id: "107",
    type: "URGENT",
    urgency_level: "high",
    rate: "€32",
    title: "Emergency Cleaning Staff",
    location: "Dusseldorf",
    highlight: true,
    created_at: "2024-01-25T07:00:00Z",
    region: "Dusseldorf, Germany",
    currency: "EUR",
    original_rate: 32,
    currency_rate: 1,
    description: "Emergency cleaning staff needed for a large event in Dusseldorf."
  },
  {
    id: "108",
    type: "PREMIUM",
    urgency_level: "medium",
    rate: "€27",
    title: "Restaurant Manager",
    location: "Dortmund",
    highlight: false,
    created_at: "2024-01-25T06:30:00Z",
    region: "Dortmund, Germany",
    currency: "EUR",
    original_rate: 27,
    currency_rate: 1,
    description: "Restaurant manager needed for a high-end restaurant in Dortmund."
  },
]

