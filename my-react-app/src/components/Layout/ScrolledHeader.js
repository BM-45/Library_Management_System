import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  IconButton
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import UserMenu from '../UserMenu';

function ScrolledHeader() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton edge="start" color="primary" aria-label="logo" onClick={() => navigate('/')}>
            <MenuBookIcon sx={{ fontSize: 32 }} />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              color: 'primary.main',
              fontWeight: 'bold',
              display: { xs: 'none', sm: 'block' }
            }}
          >
            Library System
          </Typography>
        </Box>

        <Box>
          {isLoggedIn ? (
            <IconButton color="primary" onClick={handleProfileClick}>
              <AccountCircleIcon sx={{ fontSize: 32 }} />
            </IconButton>
          ) : (
            <IconButton color="primary" onClick={handleLoginClick}>
              <AccountCircleIcon sx={{ fontSize: 32 }} />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default ScrolledHeader;