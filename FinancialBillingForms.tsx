import type React from "react"
import { Box, Typography, Button } from "@mui/material"

export const FinancialBillingForms: React.FC = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Financial & Billing Forms
      </Typography>
      <Button variant="contained" sx={{ m: 1 }}>
        Client Billing Setup
      </Button>
      <Button variant="contained" sx={{ m: 1 }}>
        Worker Payment Configuration
      </Button>
      <Button variant="contained" sx={{ m: 1 }}>
        Markup/Rate Management
      </Button>
      <Button variant="contained" sx={{ m: 1 }}>
        Consolidated Invoice Generator
      </Button>
      <Button variant="contained" sx={{ m: 1 }}>
        Payment Discrepancy Resolution
      </Button>
      <Button variant="contained" sx={{ m: 1 }}>
        Tax Documents Management
      </Button>
    </Box>
  )
}

