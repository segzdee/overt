import type React from "react"
import { Box, Typography, Button } from "@mui/material"

export const SeasonalSpecialEventForms: React.FC = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Seasonal & Special Event Forms
      </Typography>
      <Button variant="contained" sx={{ m: 1 }}>
        Event Staffing Calculator
      </Button>
      <Button variant="contained" sx={{ m: 1 }}>
        Seasonal Demand Planning
      </Button>
      <Button variant="contained" sx={{ m: 1 }}>
        Special Project Staffing
      </Button>
      <Button variant="contained" sx={{ m: 1 }}>
        High-volume Recruitment Campaign
      </Button>
      <Button variant="contained" sx={{ m: 1 }}>
        Temporary Venue Configuration
      </Button>
    </Box>
  )
}

