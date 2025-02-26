import type React from "react"
import { Box, Typography, Button } from "@mui/material"

export const AgencyClientCommunication: React.FC = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Agency-Client Communication
      </Typography>
      <Button variant="contained" sx={{ m: 1 }}>
        Client Portal Setup
      </Button>
      <Button variant="contained" sx={{ m: 1 }}>
        Automated Notification Rules
      </Button>
      <Button variant="contained" sx={{ m: 1 }}>
        Client Communication Preferences
      </Button>
      <Button variant="contained" sx={{ m: 1 }}>
        Escalation Path Configuration
      </Button>
      <Button variant="contained" sx={{ m: 1 }}>
        Feedback Collection Schedule
      </Button>
    </Box>
  )
}

