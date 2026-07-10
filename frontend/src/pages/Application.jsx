import { useEffect, useState } from "react";
import {
  getApplications,
  downloadOfferLetter,
  sendOfferEmail,
} from "../services/applicationService";

import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Stack,
  Box,
} from "@mui/material";

import SidebarLayout from "../components/SidebarLayout";

export default function Applications() {
  const [applications, setApplications] = useState([]);

  async function loadApplications() {
    try {
      // FIX: Moved the await inside the async function block to prevent global runtime compilation crashes
      const data = await getApplications();
      setApplications(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  async function handleOfferLetter(applicationId, candidateName) {
    try {
      const pdf = await downloadOfferLetter(applicationId);
      const url = window.URL.createObjectURL(
        new Blob([pdf], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = `Offer_Letter_${candidateName}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSendEmail(applicationId) {
    try {
      await sendOfferEmail(applicationId);
      alert("Offer Letter emailed successfully!");
      loadApplications();
    } catch (error) {
      console.error(error);
      alert("Failed to send email.");
    }
  }

  return (
    <SidebarLayout>
      <Container maxWidth="lg" sx={{ py: 2 }}>
        
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="700" sx={{ color: "#1E293B", letterSpacing: "-0.5px", mb: 1 }}>
            Application Pipeline
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B" }}>
            Monitor algorithmic skill matches, check fit metrics, and generate candidate documentation.
          </Typography>
        </Box>

        {/* Pipeline Data Grid Wrapper */}
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
                <TableCell sx={{ fontWeight: "600", color: "#475569" }}>Candidate</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#475569" }}>Target Role</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#475569" }}>Match Score</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#475569" }}>Verified Skills</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#475569" }}>Gaps Identified</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#475569" }}>Process Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: "600", color: "#475569" }}>Documentation Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6, color: "#94A3B8" }}>
                    No active processing pipelines found. Link a candidate to an opening to generate matches.
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((item) => (
                  <TableRow key={item.id} hover>
                    {/* Name */}
                    <TableCell sx={{ fontWeight: "500", color: "#1E293B" }}>
                      {item.candidate_name}
                    </TableCell>

                    {/* Job Title Badge */}
                    <TableCell>
                      <Chip 
                        label={item.job_title} 
                        variant="outlined"
                        size="small"
                        sx={{ fontWeight: "500", color: "#334155", borderColor: "#E2E8F0", bgcolor: "#F8FAFC" }} 
                      />
                    </TableCell>

                    {/* Match Percentage Badge */}
                    <TableCell>
                      <Chip
                        label={`${item.match_score}%`}
                        size="small"
                        variant={item.match_score >= 75 ? "contained" : "outlined"}
                        color={
                          item.match_score >= 80
                            ? "success"
                            : item.match_score >= 60
                            ? "warning"
                            : "error"
                        }
                        sx={{ fontWeight: "700", borderRadius: "6px" }}
                      />
                    </TableCell>

                    {/* Matched Skills Chips */}
                    <TableCell sx={{ maxWidth: "200px" }}>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {item.matched_skills ? (
                          item.matched_skills.split(",").map((skill) => (
                            <Chip
                              key={skill}
                              label={skill.trim()}
                              color="success"
                              variant="soft"
                              size="small"
                              sx={{ bgcolor: "#E6FFFB", color: "#08979C", border: "1px solid #B5F5EC", fontSize: "11px", fontWeight: "500" }}
                            />
                          ))
                        ) : (
                          <Typography variant="caption" sx={{ color: "#94A3B8" }}>None</Typography>
                        )}
                      </Box>
                    </TableCell>

                    {/* Missing Skills Chips */}
                    <TableCell sx={{ maxWidth: "200px" }}>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {item.missing_skills ? (
                          item.missing_skills.split(",").map((skill) => (
                            <Chip
                              key={skill}
                              label={skill.trim()}
                              color="error"
                              size="small"
                              sx={{ bgcolor: "#FFF1F0", color: "#CF1322", border: "1px solid #FFA39E", fontSize: "11px", fontWeight: "500" }}
                            />
                          ))
                        ) : (
                          <Chip
                            label="Fully Matched"
                            size="small"
                            sx={{ bgcolor: "#F6FFED", color: "#389E0D", border: "1px solid #B7EB8F", fontSize: "11px", fontWeight: "500" }}
                          />
                        )}
                      </Box>
                    </TableCell>

                    {/* Lifecycle Process Status */}
                    <TableCell>
                      <Chip
                        label={item.status || "In Review"}
                        size="small"
                        sx={{ 
                          fontWeight: "600",
                          textTransform: "capitalize",
                          bgcolor: item.status?.toLowerCase() === "hired" ? "#E6FFED" : "#E6F7FF", 
                          color: item.status?.toLowerCase() === "hired" ? "#389E0D" : "#096DD9",
                          border: item.status?.toLowerCase() === "hired" ? "1px solid #B7EB8F" : "1px solid #91D5FF"
                        }}
                      />
                    </TableCell>

                    {/* Pipeline Functional Automation Controls */}
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Button
                          size="small"
                          variant="contained"
                          disableElevation
                          onClick={() => handleOfferLetter(item.id, item.candidate_name)}
                          sx={{ textTransform: "none", borderRadius: "6px", fontSize: "12px", px: 1.5, bgcolor: "#4F46E5", "&:hover": { bgcolor: "#4338CA" } }}
                        >
                          Offer Letter
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="success"
                          onClick={() => handleSendEmail(item.id)}
                          sx={{ textTransform: "none", borderRadius: "6px", fontSize: "12px", px: 1.5, fontWeight: "600" }}
                        >
                          Send Email
                        </Button>
                      </Stack>
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