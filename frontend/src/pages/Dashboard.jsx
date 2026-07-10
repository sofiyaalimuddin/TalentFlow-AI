import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboardService";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import SidebarLayout from "../components/SidebarLayout"; 

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_jobs: 0,
    total_candidates: 0,
    pending_onboarding: 0,
    top_candidate: "None",
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error(error);
    }
  }

  // Cards array structured 
  const cards = [
    { title: "TOTAL JOBS", value: stats.total_jobs, color: "#1677FF" },
    { title: "CANDIDATES", value: stats.total_candidates, color: "#2F54EB" },
    { title: "PENDING ONBOARDING", value: stats.pending_onboarding, color: "#FA8C16" },
    { title: "TOP CANDIDATE", value: stats.top_candidate, color: "#52C41A" },
  ];

return (
    <SidebarLayout>
      {/* We add display: flex, flexDirection: column, and alignItems: center here */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center", 
          width: "100%"
        }}
      >
        
        {/* Header Section - Centered text */}
        <Box sx={{ mb: 5, textAlign: "center" }}>
          <Typography 
            variant="h4" 
            fontWeight="700"
            sx={{ 
              color: "#1E293B", 
              letterSpacing: "-0.5px",
              mb: 1
            }}
          >
            Dashboard Overview
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B" }}>
            Welcome back! Here's an automated summary of your recruitment pipeline today.
          </Typography>
        </Box>

        {/* Analytics Cards Grid - Centered content alignment */}
        <Grid container spacing={3} justifyContent="center" alignItems="stretch"> 
          {cards.map((card) => (
            <Grid item xs={12} sm={6} md={3} key={card.title}>
              <Card
                elevation={0}
                sx={{
                  backgroundColor: "#FFFFFF",
                  color: "#1E293B",
                  borderRadius: "16px",
                  border: "1px solid #EAECEE",
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.02)",
                  transition: "all 0.2s ease-in-out",
                  height: "100%", 
                  display: "flex",      
                  flexDirection: "column",
                  position: "relative",
                  overflow: "hidden",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.06)",
                    borderColor: card.color
                  },
                }}
              >
                {/* Subtle top indicator bar */}
                <Box sx={{ height: "4px", width: "100%", bgcolor: card.color }} />
                
                <CardContent 
                  sx={{ 
                    p: 4, 
                    display: "flex", 
                    flexDirection: "column", 
                    justifyContent: "center", // Vertically centers text inside card
                    alignItems: "center",     // Horizontally centers text inside card
                    flexGrow: 1,            
                    textAlign: "center",
                    "&:last-child": { pb: 4 } 
                  }}
                >
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: "#64748B", 
                      mb: 2, 
                      letterSpacing: "0.5px", 
                      fontWeight: "600",
                      fontSize: "11px"
                    }}
                  >
                    {card.title}
                  </Typography>
                  <Typography 
                    variant="h4" 
                    fontWeight="700"
                    sx={{ 
                      fontSize: card.value.toString().length > 10 ? "1.5rem" : "2.2rem",
                      color: "#1E293B",
                      letterSpacing: "-0.5px"
                    }}
                  >
                    {card.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </SidebarLayout>
  );
}