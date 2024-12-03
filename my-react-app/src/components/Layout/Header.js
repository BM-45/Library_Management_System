import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  IconButton, 
  Button,
  Container,
  Stack
} from '@mui/material';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import UserMenu from '../UserMenu'; // Import the UserMenu component

function Header() {
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

  const handleProfileClick = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    handleMenuClose();
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: 'transparent',
        boxShadow: 'none',
        py: 2
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo and Brand */}
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
              variant="h4"
              component="div"
              sx={{ 
                ml: 2,
                color: 'primary.main',
                fontWeight: 'bold',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Library System
            </Typography>
          </Box>

          {/* Navigation Links */}
          {/*
          <Stack 
            direction="row" 
            spacing={3} 
            sx={{ 
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center'
            }}
          >
            <Button color="primary" onClick={() => navigate('/catalog')}>
              Catalog
            </Button>
            <Button color="primary" onClick={() => navigate('/about')}>
              About
            </Button>
            <Button color="primary" onClick={() => navigate('/contact')}>
              Contact
            </Button>
          </Stack>
          */}

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
      </Container>
    </AppBar>
  );
}

export default Header;