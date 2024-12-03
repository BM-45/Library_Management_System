import React, { useState } from 'react';
import { Box, Container, Grid, Paper, Typography, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LibraryHeroSection from '../components/LibraryHeroSection';
import LibraryHoursCalendar from '../components/LibraryHoursCalendar';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BookIcon from '@mui/icons-material/Book';
import NLPSearch from '../components/NLPSearch';
import Recommendations from '../components/Recommendations';

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Admin Navigation Bar */}
      <AppBar position="static" sx={{ mb: 2 }}>
        <Toolbar sx={{ justifyContent: 'flex-end', gap: 2 }}>
          <Button color="inherit" onClick={() => navigate('/addbook')}>
            Add Book
          </Button>
          <Button color="inherit" onClick={() => navigate('/metrics')}>
            Metrics
          </Button>
          <Button color="inherit" onClick={() => navigate('/overDue')}>
            Overdue
          </Button>
          <Button color="inherit" onClick={() => navigate('/checkin')}>
            Check In
          </Button>
        </Toolbar>
      </AppBar>

      {/* Rest of the HomePage content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <LibraryHeroSection />

        <Container maxWidth="lg" sx={{ mb: 8 }}>
          <Paper elevation={0} sx={{ p: 4, backgroundColor: 'grey.50', borderRadius: 2 }}>
            <NLPSearch />
          </Paper>
        </Container>

        <Container maxWidth="lg" sx={{ mb: 8 }}>
          <Recommendations />
        </Container>

        {/* Library Info Section with Enhanced Design */}
        <Box sx={{ py: 8 }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={6}
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'rgb(32, 31, 30)',
                    '& .MuiTypography-root': { color: '#fff' },
                    '& .MuiPickersCalendarHeader-root': { color: '#fff' },
                    '& .MuiDayPicker-weekDayLabel': { color: '#fff' },
                    '& .MuiPickersDay-root': { color: '#fff' }
                  }}
                >
                  <Typography variant="h6" gutterBottom sx={{ color: '#fff', fontWeight: 600 }}>
                    Library Hours
                  </Typography>
                  <Box sx={{ flex: 1 }}>
                    <LibraryHoursCalendar />
                  </Box>
                </Paper>
              </Grid>

              {/* Contact Section */}
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={6}
                  sx={{
                    p: 4,
                    height: '100%',
                    transition: 'transform 0.2s',
                    backgroundColor: 'rgb(32, 31, 30)',
                    '& .MuiTypography-root': { color: '#fff' },
                    '& .MuiListItemText-primary': { color: '#fff' },
                    '&:hover': {
                      transform: 'translateY(-5px)'
                    }
                  }}
                >
                  <Typography variant="h5" gutterBottom sx={{ color: '#fff', fontWeight: 600 }}>
                    Contact Us
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <EmailIcon sx={{ color: '#fff' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="library@example.com"
                        primaryTypographyProps={{ style: { wordBreak: 'break-word', color: '#fff' } }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <PhoneIcon sx={{ color: '#fff' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="(555) 123-4567"
                        primaryTypographyProps={{ style: { color: '#fff' } }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <LocationOnIcon sx={{ color: '#fff' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="123 Library Street"
                        primaryTypographyProps={{ style: { wordBreak: 'break-word', color: '#fff' } }}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>

              {/* Resources Section */}
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={6}
                  sx={{
                    p: 4,
                    height: '100%',
                    transition: 'transform 0.2s',
                    backgroundColor: 'rgb(32, 31, 30)',
                    '& .MuiTypography-root': { color: '#fff' },
                    '& .MuiListItemText-primary': { color: '#fff' },
                    '&:hover': {
                      transform: 'translateY(-5px)'
                    }
                  }}
                >
                  <Typography variant="h5" gutterBottom sx={{ color: '#fff', fontWeight: 600 }}>
                    Resources
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <BookIcon sx={{ color: '#fff' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Digital Resources"
                        primaryTypographyProps={{ style: { color: '#fff' } }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <BookIcon sx={{ color: '#fff' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Research Materials"
                        primaryTypographyProps={{ style: { color: '#fff' } }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <BookIcon sx={{ color: '#fff' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Online Catalogs"
                        primaryTypographyProps={{ style: { color: '#fff' } }}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}

export default AdminDashboard;