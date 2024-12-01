import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import NavBar from '../components/Layout/NavBar';
import Footer from '../components/Layout/Footer';
import LibraryHeroSection from '../components/LibraryHeroSection';
import FeaturedBooks from '../components/FeaturedBooks';
import LibraryHoursCalendar from '../components/LibraryHoursCalendar';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BookIcon from '@mui/icons-material/Book';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (query, category) => {
    navigate(`/search?query=${query}&category=${category}`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Hero Section */}
        <Paper
          sx={{
            position: 'relative',
            backgroundColor: 'grey.800',
            color: '#fff',
            mb: 4,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: 'url(/library-bg.jpg)',
            py: 8
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography
                  component="h1"
                  variant="h2"
                  color="inherit"
                  gutterBottom
                >
                  Welcome to Our Library
                </Typography>
                <Typography variant="h5" color="inherit" paragraph>
                  Discover millions of books, research materials, and resources
                </Typography>
                <SearchBar onSearch={handleSearch} />
              </Grid>
            </Grid>
          </Container>
        </Paper>

        {/* Featured Books Section */}
        <Container maxWidth="lg" sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Featured Books
          </Typography>
          <Grid container spacing={4}>
            {[1, 2, 3, 4].map((item) => (
              <Grid item key={item} xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={`/book-${item}.jpg`}
                    alt={`Featured book ${item}`}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6">
                      Featured Book {item}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Description of the featured book goes here.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Library Info Section */}
        <Box sx={{ bgcolor: 'grey.100', py: 6 }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <LibraryHoursCalendar />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  Contact Us
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><EmailIcon /></ListItemIcon>
                    <ListItemText primary="library@example.com" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><PhoneIcon /></ListItemIcon>
                    <ListItemText primary="(555) 123-4567" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><LocationOnIcon /></ListItemIcon>
                    <ListItemText primary="123 Library Street" />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  Resources
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><BookIcon /></ListItemIcon>
                    <ListItemText primary="Digital Resources" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><BookIcon /></ListItemIcon>
                    <ListItemText primary="Research Materials" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><BookIcon /></ListItemIcon>
                    <ListItemText primary="Online Catalogs" />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>


    </Box>
  );
}

export default HomePage;