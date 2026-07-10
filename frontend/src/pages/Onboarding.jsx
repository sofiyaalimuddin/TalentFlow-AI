import { useEffect, useState } from "react";

import {
  getOnboarding,
  onboardCandidate,
} from "../services/onboardingService";

import {
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Chip,
  Box,
} from "@mui/material";

import SidebarLayout from "../components/SidebarLayout";

export default function Onboarding() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const data = await getOnboarding();
      setApplications(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleOnboard(id) {
    try {
      await onboardCandidate(id);
      loadData();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <SidebarLayout>
      <Container maxWidth="lg" sx={{ py: 2 }}>
        
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="700" sx={{ color: "#1E293B", letterSpacing: "-0.5px", mb: 1 }}>
            Employee Onboarding Portal
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B" }}>
            Final step of the automation suite. Finalize employee registration files and track workspace provisioning updates.
          </Typography>
        </Box>

        {/* Onboarding Table Pipeline */}
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: "16px", 
            border: "1px solid #EAECEE", 
            overflow: "hidden",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.01)"
          }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "#F8FAFC" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "600", color: "#475569", py: 2 }}>Candidate</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#475569", py: 2 }}>Assigned Job Role</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#475569", py: 2 }}>Provisioning Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: "600", color: "#475569", py: 2 }}>Workflow Execution</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 8, color: "#94A3B8" }}>
                    No hires pending modern onboarding workflows. Pass candidates through the selection filters first!
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((item) => (
                  <TableRow key={item.application_id} hover>
                    {/* Candidate Name Column */}
                    <TableCell sx={{ fontWeight: "500", color: "#1E293B", py: 2.5 }}>
                      {item.candidate_name}
                    </TableCell>

                    {/* Job Title Column */}
                    <TableCell sx={{ color: "#334155", py: 2.5 }}>
                      {item.job_title}
                    </TableCell>

                    {/* Styled Chip Status Column */}
                    <TableCell sx={{ py: 2.5 }}>
                      <Chip
                        label={item.status || "Pending Workflow"}
                        size="small"
                        variant={item.status === "Onboarded" ? "contained" : "outlined"}
                        color={item.status === "Onboarded" ? "success" : "warning"}
                        sx={{ 
                          fontWeight: "600", 
                          borderRadius: "6px",
                          px: 0.5,
                          fontSize: "12px"
                        }}
                      />
                    </TableCell>

                    {/* Conditional Action Buttons Column */}
                    <TableCell align="center" sx={{ py: 2.5 }}>
                      {item.status !== "Onboarded" ? (
                        <Button
                          variant="contained"
                          disableElevation
                          size="small"
                          onClick={() => handleOnboard(item.application_id)}
                          sx={{ 
                            textTransform: "none", 
                            borderRadius: "8px", 
                            fontWeight: "600",
                            px: 3,
                            bgcolor: "#001529",
                            "&:hover": { bgcolor: "#002140" }
                          }}
                        >
                          Initialize Onboarding
                        </Button>
                      ) : (
                        <Typography 
                          variant="body2" 
                          fontWeight="500" 
                          sx={{ color: "#52C41A", display: "inline-flex", alignItems: "center", gap: 0.5 }}
                        >
                          ✓ Profile Active
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>

      </Container>
    </SidebarLayout>
  );
}