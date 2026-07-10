import api from "../api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
} from "@mui/material";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

   async function handleLogin() {
  if (!email || !password) {
    alert("Please enter your email and password.");
    return;
  }

  try {
    const response = await api.post("/auth/login", {
    email,
    password,
  });

    // Save JWT token
    localStorage.setItem("token", response.data.access_token);

    // Navigate after successful login
    navigate("/dashboard");
  } catch (error) {
    console.error(error);
    alert("Invalid email or password.");
  }
}

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#F8F9FA", // Modern airy off-white background
        background: "radial-gradient(circle at 50% 50%, #FFFFFF 0%, #F1F5F9 100%)",
      }}
    >
      <Paper
        elevation={0} // Removing harsh classic drop shadows
        sx={{
          width: 400,
          p: 5,
          borderRadius: "16px", // Softer, modern curves
          border: "1px solid #EAECEE",
          boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.04)", // Elegant SaaS shadow
          bgcolor: "#FFFFFF",
        }}
      >
        {/* Brand Name with gradient to match sidebar */}
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom
          sx={{
            fontWeight: 800,
            letterSpacing: "-1px",
            background: "linear-gradient(45deg, #2F54EB, #1890FF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 1,
          }}
        >
          TalentFlow AI
        </Typography>

        <Typography
          align="center"
          sx={{ 
            color: "#64748B", 
            mb: 4,
            fontSize: "14px",
            fontWeight: 500
          }}
        >
          Intelligent Recruitment Platform
        </Typography>

        <TextField
          fullWidth
          label="Email address"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputLabelProps={{ style: { color: '#64748B', fontSize: '14px' } }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "& fieldset": { borderColor: "#E2E8F0" },
              "&:hover fieldset": { borderColor: "#CBD5E1" },
            },
          }}
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputLabelProps={{ style: { color: '#64748B', fontSize: '14px' } }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "& fieldset": { borderColor: "#E2E8F0" },
              "&:hover fieldset": { borderColor: "#CBD5E1" },
            },
          }}
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          disableElevation
          onClick={handleLogin}
          sx={{ 
            mt: 4, 
            py: 1.5,
            borderRadius: "8px",
            bgcolor: "#1677FF",
            textTransform: "none",
            fontSize: "15px",
            fontWeight: 600,
            "&:hover": {
              bgcolor: "#0958D9",
            },
            transition: "all 0.2s ease"
          }}
        >
          Login
        </Button>
      </Paper>
    </Box>
  );
}

export default Login;