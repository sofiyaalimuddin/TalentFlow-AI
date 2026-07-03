import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboardService";

import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";

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

  const cards = [
    {
      title: "Total Jobs",
      value: stats.total_jobs,
    },
    {
      title: "Candidates",
      value: stats.total_candidates,
    },
    {
      title: "Pending",
      value: stats.pending_onboarding,
    },
    {
      title: "Top Candidate",
      value: stats.top_candidate,
    },
  ];

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        TalentFlow AI Dashboard
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card>
              <CardContent>
                <Typography color="text.secondary">
                  {card.title}
                </Typography>

                <Typography variant="h4">
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}