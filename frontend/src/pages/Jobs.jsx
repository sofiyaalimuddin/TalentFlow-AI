import { useEffect, useState } from "react";
import {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
} from "../services/jobService";

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
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SidebarLayout from "../components/SidebarLayout";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [job, setJob] = useState({
    title: "",
    department: "",
    required_skills: "",
    description: "",
  });

  async function loadJobs() {
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  async function handleSubmit() {
    try {
      if (editingId) {
        await updateJob(editingId, job);
        setEditingId(null);
      } else {
        await createJob(job);
      }
      setJob({
        title: "",
        department: "",
        required_skills: "",
        description: "",
      });
      loadJobs();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteJob(id);
      loadJobs();
    } catch (error) {
      console.error(error);
    }
  }

  function handleEdit(targetJob) {
    setJob({
      title: targetJob.title,
      department: targetJob.department,
      required_skills: targetJob.required_skills,
      description: targetJob.description,
    });
    setEditingId(targetJob.id);
  }

  return (
    <SidebarLayout>
      <Container maxWidth="lg" sx={{ py: 2 }}>
        
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="700" sx={{ color: "#1E293B", letterSpacing: "-0.5px", mb: 1 }}>
            Job Positions
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B" }}>
            Create, update, and manage job openings within your automated talent framework.
          </Typography>
        </Box>

        {/* Job Action / Creation Form */}
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
            {editingId ? "Modify Existing Position" : "Create New Job Opening"}
          </Typography>
          
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Job Title"
                value={job.title}
                onChange={(e) => setJob({ ...job, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Department"
                value={job.department}
                onChange={(e) => setJob({ ...job, department: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Required Skills"
                placeholder="e.g. Python, FastAPI, PostgreSQL, React"
                helperText="Separate multiple target skills using commas"
                value={job.required_skills || ""}
                onChange={(e) => setJob({ ...job, required_skills: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Job Description"
                multiline
                rows={3}
                value={job.description}
                onChange={(e) => setJob({ ...job, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              {editingId && (
                <Button 
                  variant="outlined" 
                  color="inherit" 
                  sx={{ textTransform: "none", borderRadius: "8px", px: 3 }}
                  onClick={() => {
                    setEditingId(null);
                    setJob({ title: "", department: "", required_skills: "", description: "" });
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleSubmit}
                disableElevation
                sx={{ 
                  textTransform: "none", 
                  borderRadius: "8px", 
                  px: 4,
                  bgcolor: "#1677FF",
                  "&:hover": { bgcolor: "#0958d9" }
                }}
              >
                {editingId ? "Update Position Details" : "Publish Job Opening"}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Positions Overview Table */}
        <Typography variant="h6" fontWeight="600" sx={{ mb: 2, color: "#1E293B" }}>
          Active Postings ({jobs.length})
        </Typography>

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
                <TableCell sx={{ fontWeight: "600", color: "#475569" }}>Title</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#475569" }}>Department</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#475569" }}>Required Skills</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#475569" }}>Description</TableCell>
                <TableCell align="center" sx={{ fontWeight: "600", color: "#475569" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6, color: "#94A3B8" }}>
                    No job records available. Use the form above to add an opening.
                  </TableCell>
                </TableRow>
              ) : (
                jobs.map((item) => (
                  <TableRow key={item.id} hover sx={{ "&:last-child cell": { border: 0 } }}>
                    <TableCell sx={{ fontWeight: "500", color: "#1E293B" }}>{item.title}</TableCell>
                    <TableCell sx={{ color: "#334155" }}>{item.department}</TableCell>
                    <TableCell sx={{ color: "#334155" }}>{item.required_skills}</TableCell>
                    <TableCell sx={{ color: "#64748B", maxWidth: "280px" }}>{item.description}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                        <IconButton onClick={() => handleEdit(item)} color="primary" size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(item.id)} color="error" size="small">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
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