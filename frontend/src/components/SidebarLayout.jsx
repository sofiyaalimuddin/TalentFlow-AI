import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  Divider,
  Button
} from '@mui/material';

// 1. Corrected icon imports with uniform 'Outlined' naming
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import WorkOutlined from '@mui/icons-material/WorkOutlined';
import PeopleOutlined from '@mui/icons-material/PeopleOutlined';
import AssignmentOutlined from '@mui/icons-material/AssignmentOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import ChatOutlined from '@mui/icons-material/ChatOutlined';
import LogoutOutlined from '@mui/icons-material/LogoutOutlined';

const SIDEBAR_WIDTH = 260;

function SidebarLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  // 2. Corrected browser URL paths for navigation
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardOutlined />, path: '/dashboard' },
    { text: 'Jobs', icon: <WorkOutlined />, path: '/jobs' },
    { text: 'Candidate', icon: <PeopleOutlined />, path: '/candidates' },
    { text: 'Application', icon: <AssignmentOutlined />, path: '/applications' },
    { text: 'Onboarding', icon: <CheckCircleOutlined />, path: '/onboarding' },
    { text: 'AI Chatbot', icon: <ChatOutlined />, path: '/chatbot' },
  ];

const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.replace("/");
};

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8F9FA' }}>
      
      {/* SIDEBAR PANEL */}
      <Drawer
        variant="permanent"
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid #EAECEE',
            bgcolor: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'between',
          },
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          {/* Brand/App Title */}
          <Box sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                color: '#1E293B', 
                letterSpacing: '-0.5px',
                background: 'linear-gradient(45deg, #2F54EB, #1890FF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              TalentFlow AI
            </Typography>
          </Box>

          <Divider sx={{ borderColor: '#F1F5F9', mb: 2 }} />

          {/* Navigation List */}
          <List sx={{ px: 2 }}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    sx={{
                      borderRadius: '8px',
                      py: 1.2,
                      px: 2,
                      bgcolor: isActive ? '#E6F4FF' : 'transparent',
                      color: isActive ? '#1677FF' : '#64748B',
                      '&:hover': {
                        bgcolor: isActive ? '#E6F4FF' : '#F1F5F9',
                        color: isActive ? '#1677FF' : '#1E293B',
                        '& .MuiListItemIcon-root': {
                          color: isActive ? '#1677FF' : '#1E293B',
                        }
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        minWidth: 40, 
                        color: isActive ? '#1677FF' : '#94A3B8',
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text} 
                      primaryTypographyProps={{
                        fontSize: '14px',
                        fontWeight: isActive ? 600 : 500,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>

        {/* Bottom Logout Section */}
        <Box sx={{ p: 2, mt: 'auto' }}>
          <Divider sx={{ borderColor: '#F1F5F9', mb: 2 }} />
          <Button
            variant="text"
            fullWidth
            startIcon={<LogoutOutlined />}
            onClick={handleLogout}
            sx={{
              justifyContent: 'flex-start',
              px: 2,
              py: 1.2,
              borderRadius: '8px',
              color: '#94A3B8',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '14px',
              '&:hover': {
                bgcolor: '#FEF2F2',
                color: '#EF4444',
              },
              transition: 'all 0.2s ease',
            }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      {/* MAIN CONTENT AREA */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 4, 
          width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default SidebarLayout;