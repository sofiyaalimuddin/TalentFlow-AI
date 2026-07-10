import { useState, useEffect, useRef } from "react";
import { sendMessage } from "../services/chatbotService";

import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Avatar,
} from "@mui/material";

export default function Chatbot() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "TalentFlow AI",
      text: "Hello! I am your AI Assistant. Ask me anything about your onboarding timeline, document statuses, or training modules.",
    },
  ]);
  
  const chatEndRef = useRef(null);

  // Auto-scroll to the bottom whenever a new chat message arrives
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!message.trim()) return;

    const userMessage = {
      sender: "You",
      text: message,
    };

    // Optimistically update the UI with user's message
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = message;
    setMessage(""); // Clear input early for a snappy feel

    try {
      const response = await sendMessage(currentInput);

      const botMessage = {
        sender: "TalentFlow AI",
        text: response.reply,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { sender: "TalentFlow AI", text: "Sorry, I ran into an issue connecting to the automation pipeline. Please try again." },
      ]);
    }
  }

  return (
      <Container maxWidth="100%"  sx={{ py: 2, bgcolor: '#F8F9FA', height: '100vh'}}>
        
        {/* Header section matching platform aesthetics */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight="700" sx={{ color: "#1E293B", letterSpacing: "-0.5px", mb: 0.5 }}>
            AI Assistant
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B" }}>
            Interact with the automation layer using natural language workflows.
          </Typography>
        </Box>

        {/* Chat Interface Container */}
        <Paper
          elevation={0}
          sx={{
            height: "500px",
            p: 3,
            borderRadius: "16px",
            border: "1px solid #EAECEE",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            bgcolor: "#F8FAFC"
          }}
        >
          {/* Scrollable Chat Message Area */}
          <Box 
            sx={{ 
              flexGrow: 1, 
              overflowY: "auto", 
              mb: 2,
              pr: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2
            }}
          >
            {messages.map((msg, index) => {
              const isUser = msg.sender === "You";
              return (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: isUser ? "flex-end" : "flex-start",
                    alignItems: "flex-start",
                    gap: 1.5
                  }}
                >
                  {/* Show Avatar for AI only */}
                  {!isUser && (
                    <Avatar sx={{ bgcolor: "#4F46E5", width: 32, height: 32, fontSize: "12px", fontWeight: "600" }}>
                      TF
                    </Avatar>
                  )}
                  
                  {/* Conversational Bubble Layout */}
                  <Box sx={{ maxWidth: "70%" }}>
                    <Typography 
                      variant="caption" 
                      sx={{ color: "#64748B", display: "block", mb: 0.5, ml: isUser ? 0 : 1, textAlign: isUser ? "right" : "left" }}
                    >
                      {msg.sender}
                    </Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                        bgcolor: isUser ? "#4F46E5" : "#FFFFFF",
                        color: isUser ? "#FFFFFF" : "#334155",
                        border: isUser ? "none" : "1px solid #E2E8F0",
                        boxShadow: "0px 2px 8px rgba(0,0,0,0.02)"
                      }}
                    >
                      <Typography variant="body2" sx={{ lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                        {msg.text}
                      </Typography>
                    </Paper>
                  </Box>
                </Box>
              );
            })}
            <div ref={chatEndRef} />
          </Box>

          {/* Interactive Action/Input Box */}
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              bgcolor: "#FFFFFF",
              p: 1,
              borderRadius: "12px",
              border: "1px solid #E2E8F0"
            }}
          >
            <TextField
              fullWidth
              variant="standard"
              placeholder="Ask a question about onboarding or application flows..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSend();
                }
              }}
              InputProps={{
                disableUnderline: true,
                sx: { px: 1.5, py: 1, fontSize: "14px" }
              }}
            />

            <Button
              variant="contained"
              disableElevation
              onClick={handleSend}
              sx={{
                borderRadius: "8px",
                px: 3,
                textTransform: "none",
                fontWeight: "600",
                bgcolor: "#1E293B",
                "&:hover": { bgcolor: "#0F172A" }
              }}
            >
              Send
            </Button>
          </Box>
        </Paper>

      </Container>
  );
}