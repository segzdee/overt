import type React from "react"
import { Box, Typography, Button } from "@mui/material"

export const SchedulingForms: React.FC = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Scheduling Forms
      </Typography>
      <Button variant="contained" sx={{ m: 1 }}>
        Staff Replacement Request
      </Button>
      <Button variant="contained" sx={{ m: 1 }}>
        Last-minute Shift Fill
      </Button>
      <Button variant="contained" sx={{ m: 1 }}>
        Auto-assignment Rules
      </Button>
      <Button variant="contained" sx={{ m: 1 }}>
        Shift Coverage Heat Map
      </Button>
      <Button variant="contained" sx={{ m: 1 }}>
        Scheduling Conflict Resolution
      </Button>
    </Box>
  )
}

