"use client"

import type React from "react"
import { useState } from "react"
import { Tabs, Tab, Box } from "@mui/material"
import { SchedulingForms } from "./SchedulingForms"
import { FinancialBillingForms } from "./FinancialBillingForms"
import { ReportingAnalytics } from "./ReportingAnalytics"
import { ComplianceDocumentation } from "./ComplianceDocumentation"
import { AgencyClientCommunication } from "./AgencyClientCommunication"
import { AdvancedMarketplaceFeatures } from "./AdvancedMarketplaceFeatures"
import { SeasonalSpecialEventForms } from "./SeasonalSpecialEventForms"

export const AgencySpecificDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="agency specific dashboard tabs">
          <Tab label="Scheduling" />
          <Tab label="Financial & Billing" />
          <Tab label="Reporting & Analytics" />
          <Tab label="Compliance & Documentation" />
          <Tab label="Client Communication" />
          <Tab label="Advanced Marketplace" />
          <Tab label="Seasonal & Special Events" />
        </Tabs>
      </Box>
      <Box sx={{ p: 3 }}>
        {activeTab === 0 && <SchedulingForms />}
        {activeTab === 1 && <FinancialBillingForms />}
        {activeTab === 2 && <ReportingAnalytics />}
        {activeTab === 3 && <ComplianceDocumentation />}
        {activeTab === 4 && <AgencyClientCommunication />}
        {activeTab === 5 && <AdvancedMarketplaceFeatures />}
        {activeTab === 6 && <SeasonalSpecialEventForms />}
      </Box>
    </Box>
  )
}

