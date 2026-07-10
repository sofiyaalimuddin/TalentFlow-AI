import { useEffect, useState } from "react";
import { uploadResume } from "../services/uploadService";
import { parseResume } from "../services/resumeService";

import {
  getCandidates,
  createCandidate,
  updateCandidate,
  deleteCandidate,
} from "../services/candidateService";

import { applyCandidate } from "../services/applicationService";
import { getJobs } from "../services/jobService";

import {
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
  Grid,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SidebarLayout from "../components/SidebarLayout";

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [resume, setResume] = useState(null);
  const [candidate, setCandidate] = useState({
    full_name: "",
    email: "",
    phone: "",
    skills: "",
    experience: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  async function loadCandidates() {
    try {
      const data = await getCandidates();
      setCandidates(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadJobs() {
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadCandidates();
    loadJobs();
  }, []);

  async function handleParseResume() {
    try {
      const data = await parseResume(resume);
      setCandidate({
        full_name: data.full_name || "",
        email: data.email || "",
        phone: data.phone || "",
        skills: Array.isArray(data.skills) ? data.skills.join(", ") : "",
        experience: "",
        resume_path: data.resume_path,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSubmit() {
    try {
      let resumePath = candidate.resume_path || null;

      if (resume) {
        const uploaded = await uploadResume(resume);
        resumePath = uploaded.path;
      }

      const candidateData = {
        ...candidate,
        resume_path: resumePath,
      };

      if (editingId) {
        await updateCandidate(editingId, candidateData);
        setEditingId(null);
      } else {
        await createCandidate(candidateData);
      }

      setCandidate({
        full_name: "",
        email: "",
        phone: "",
        skills: "",
        experience: "",
        resume_path: "",
      });
      setResume(null);
      loadCandidates();
    } catch (error) {
      console.error(error);
    }
  }

  function handleEdit(targetCandidate) {
    setCandidate({
      full_name: targetCandidate.full_name,
      email: targetCandidate.email,
      phone: targetCandidate.phone,
      skills: targetCandidate.skills,
      experience: targetCandidate.experience,
    });
    setEditingId(targetCandidate.id);
  }

async function handleDelete(id) {
  try {
    await deleteCandidate(id);
    await loadCandidates();

    alert("Candidate deleted successfully.");
  } catch (error) {
    console.error("Failed to delete candidate:", error);

    // Check if the backend rejected deletion because of related records
    if (error.response?.status === 400 || error.response?.status === 409) {
      alert("Cannot delete candidate because they have existing job applications.");
    } else {
      alert("Failed to delete candidate. Please try again.");
    }
  }
}


  function openApplyDialog(targetCandidate) {
    setSelectedCandidate(targetCandidate);
    setSelectedJob("");
    setOpenDialog(true);
  }

  async function handleApply() {
    try {
      await applyCandidate(selectedJob, selectedCandidate.id);
      alert("Candidate applied successfully!");
      setOpenDialog(false);
    } catch (error) {
      console.error(error);
      alert("Failed to apply candidate.");
    }
  }

  return (
    <SidebarLayout>
      <Container maxWidth="lg" sx={{ py: 2 }}>
        
        {/* Header Title Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="700" sx={{ color: "#1E293B", letterSpacing: "-0.5px", mb: 1 }}>
            Talent Pool
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B" }}>
            Upload resumes to trigger AI processing automation or update profile entries manually.
          </Typography>
        </Box>

        {/* Form Container */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            mb: 5, 
            borderRadius: "16px", 
            border: "1px solid #EAECEE",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.01)"
          }}
        >
          <Typography variant="h6" fontWeight="600" sx={{ mb: 3, color: "#1E293B" }}>
            {editingId ? "Modify Candidate Profile" : "Register Candidate Profile"}
          </Typography>

          <Grid container spacing={2.5}>
            {/* AI Resume Upload Row */}
            <Grid item xs={12}>
              <Box sx={{ p: 2.5, border: "1px dashed #CBD5E1", borderRadius: "12px", bgcolor: "#F8FAFC", display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                <Button variant="outlined" component="label" sx={{ textTransform: "none", borderRadius: "8px", color: "#475569", borderColor: "#CBD5E1", bgcolor: "#FFFFFF", "&:hover": { bgcolor: "#F1F5F9" } }}>
                  {resume ? resume.name : "Select Resume File"}
                  <input hidden type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResume(e.target.files[0])} />
                </Button>
                <Button variant="contained" disableElevation onClick={handleParseResume} disabled={!resume} sx={{ textTransform: "none", borderRadius: "8px", bgcolor: "#2F54EB", "&:hover": { bgcolor: "#1D39C4" } }}>
                  Parse with AI Automation
                </Button>
                <Typography variant="caption" sx={{ color: "#64748B" }}>
                  Supports PDF, DOC, DOCX files.
                </Typography>
              </Box>
            </Grid>

            {/* Profile Input Controls */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField fullWidth label="Full Name" value={candidate.full_name} onChange={(e) => setCandidate({ ...candidate, full_name: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField fullWidth label="Email Address" value={candidate.email} onChange={(e) => setCandidate({ ...candidate, email: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField fullWidth label="Phone Number" value={candidate.phone} onChange={(e) => setCandidate({ ...candidate, phone: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6} md={8}>
              <TextField fullWidth label="Skills" placeholder="e.g. Python, SQL, React" value={candidate.skills} onChange={(e) => setCandidate({ ...candidate, skills: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField fullWidth label="Experience" placeholder="e.g. 3 years" value={candidate.experience} onChange={(e) => setCandidate({ ...candidate, experience: e.target.value })} />
            </Grid>

            {/* Form Processing Controls */}
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
              {editingId && (
                <Button 
                  variant="outlined" 
                  color="inherit" 
                  sx={{ textTransform: "none", borderRadius: "8px", px: 3 }}
                  onClick={() => {
                    setEditingId(null);
                    setCandidate({ full_name: "", email: "", phone: "", skills: "", experience: "" });
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleSubmit}
                disableElevation
                sx={{ textTransform: "none", borderRadius: "8px", px: 4, bgcolor: "#1677FF", "&:hover": { bgcolor: "#0958d9" } }}
              >
                {editingId ? "Save Profile Changes" : "Save Candidate Profile"}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Candidate List Block */}
        <Typography variant="h6" fontWeight="600" sx={{ mb: 2, color: "#1E293B" }}>
          Registered Candidates ({candidates.length})
        </Typography>

        <Paper elevation={0} sx={{ borderRadius: "16px", border: "1px solid #EAECEE", overflow: "hidden", boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.01)" }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#F8FAFC" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "600", color: "#475569" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#475569" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#475569" }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#475569" }}>Skills</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#475569" }}>Experience</TableCell>
                <TableCell align="center" sx={{ fontWeight: "600", color: "#475569" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {candidates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: "#94A3B8" }}>
                    No candidates found. Use the profile generator panel above to fill your pipeline.
                  </TableCell>
                </TableRow>
              ) : (
                candidates.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell sx={{ fontWeight: "500", color: "#1E293B" }}>{item.full_name}</TableCell>
                    <TableCell sx={{ color: "#334155" }}>{item.email}</TableCell>
                    <TableCell sx={{ color: "#334155" }}>{item.phone}</TableCell>
                    <TableCell sx={{ color: "#334155", maxWidth: "200px" }}>{item.skills}</TableCell>
                    <TableCell sx={{ color: "#64748B" }}>{item.experience || "N/A"}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                        <IconButton onClick={() => handleEdit(item)} color="primary" size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(item.id)} color="error" size="small">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        <Button
                          size="small"
                          variant="outlined"
                          disableElevation
                          onClick={() => openApplyDialog(item)}
                          sx={{ textTransform: "none", borderRadius: "6px", py: 0.5, px: 1.5, fontSize: "12px", fontWeight: 600 }}
                        >
                          Apply
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>

        {/* Modal Apply Flow Controller */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} PaperProps={{ sx: { borderRadius: "12px", width: "100%", maxWidth: "450px", p: 1 } }}>
          <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Link Candidate to Job Opening</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Typography variant="body2" sx={{ color: "#64748B", mb: 2 }}>
              Select an open active role to process <strong>{selectedCandidate?.full_name}</strong> into the parsing matching matrix.
            </Typography>
            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel id="select-job-label">Select Active Position</InputLabel>
              <Select labelId="select-job-label" label="Select Active Position" value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)}>
                {jobs.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.title} ({item.department})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button onClick={() => setOpenDialog(false)} color="inherit" sx={{ textTransform: "none", fontWeight: 600 }}>
              Cancel
            </Button>
            <Button variant="contained" disableElevation onClick={handleApply} disabled={!selectedJob} sx={{ textTransform: "none", borderRadius: "6px", px: 3, bgcolor: "#1677FF" }}>
              Submit Application
            </Button>
          </DialogActions>
        </Dialog>

      </Container>
    </SidebarLayout>
  );
}