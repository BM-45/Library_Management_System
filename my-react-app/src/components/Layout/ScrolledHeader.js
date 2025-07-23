import React, {useState} from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button
} from '@mui/material';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import UserMenu from '../UserMenu';

function ScrolledHeader() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCheckouts = () => {
    navigate('/checkout');
    handleMenuClose();
  };


  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    handleMenuClose();
  };

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
        <IconButton 
              edge="start" 
              color="primary" 
              aria-label="logo"
              onClick={() => navigate('/')}
            >
              <LocalLibraryIcon sx={{ fontSize: 40 }} />
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

        {/* Auth Buttons or User Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isLoggedIn ? (
            <>
              <IconButton color="primary" onClick={handleMenuOpen}>
                <AccountCircleIcon sx={{ fontSize: 32 }} />
              </IconButton>
              {/* User Menu */}
              <UserMenu
                anchorEl={anchorEl}
                handleMenuClose={handleMenuClose}
                handleCheckouts={handleCheckouts}
                handleProfileClick={handleProfileClick}
                handleLogout={handleLogout}
              />
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate('/login')}
                sx={{ display: { xs: 'none', sm: 'block' } }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/register')}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default ScrolledHeader;