import React from 'react';
import './Footer.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import { Box, Paper, Container, Grid, Typography, IconButton, Divider } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';


function Footer() {
  return (
    <footer className="footer">
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and Brand Section */}
          <Grid item xs={12} md={4}>
            <div
              
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'left',
                backgroundColor: '#0056b3',
                '& .MuiTypography-root': {
                  color: '#fff',
                  textAlign: 'center'  // Align text to left
                }
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <LocalLibraryIcon sx={{ fontSize: 40, color: '#fff' }} />
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                    Library System
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#fff', opacity: 0.8 }}>
                  EST. 1918
                </Typography>
                <Typography variant="p" sx={{ color: '#fff', mb: 2 }}>
                  Higher purpose. Greater good.
                </Typography>
              </Box>
            </ div>
          </Grid>

          {/* Quick Links Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
              Quick Links
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" component="a" href="#" sx={{ color: '#fff', opacity: 0.8, textDecoration: 'none', '&:hover': { opacity: 1 } }}>
                    Parents & Families
                  </Typography>
                  <Typography variant="body2" component="a" href="#" sx={{ color: '#fff', opacity: 0.8, textDecoration: 'none', '&:hover': { opacity: 1 } }}>
                    Alumni
                  </Typography>
                  <Typography variant="body2" component="a" href="#" sx={{ color: '#fff', opacity: 0.8, textDecoration: 'none', '&:hover': { opacity: 1 } }}>
                    Donors
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" component="a" href="#" sx={{ color: '#fff', opacity: 0.8, textDecoration: 'none', '&:hover': { opacity: 1 } }}>
                    Campus Map
                  </Typography>
                  <Typography variant="body2" component="a" href="#" sx={{ color: '#fff', opacity: 0.8, textDecoration: 'none', '&:hover': { opacity: 1 } }}>
                    Disclaimer
                  </Typography>
                  <Typography variant="body2" component="a" href="#" sx={{ color: '#fff', opacity: 0.8, textDecoration: 'none', '&:hover': { opacity: 1 } }}>
                    Emergency Info
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          {/* Social Media and Location Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
              Connect With Us
            </Typography>
            <Box sx={{ mb: 3 }}>
              <IconButton color="inherit" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="LinkedIn">
                <LinkedInIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="YouTube">
                <YouTubeIcon />
              </IconButton>
            </Box>
            <Typography variant="body2" sx={{ color: '#fff', opacity: 0.8 }}>
              St. Louis, Missouri.
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

        <Typography variant="body2" sx={{ color: '#fff', opacity: 0.8, textAlign: 'center', py: 2 }}>
          © 1918 - 2024 Library System. All rights reserved.
        </Typography>
      </Container>
    </footer>
  );
}

export default Footer;