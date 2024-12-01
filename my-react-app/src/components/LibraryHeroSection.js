import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Paper 
} from '@mui/material';
import SearchBar from './SearchBar';

function LibraryHeroSection({ onSearch }) {
  return (
    <Paper
      sx={{
        position: 'relative',
        backgroundColor: 'grey.800',
        color: '#fff',
        mb: 4,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: 'url(/images/library-bg.jpg)',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          backgroundColor: 'rgba(0,0,0,.5)',
        }}
      />
      <Container
        sx={{
          position: 'relative',
          py: { xs: 6, md: 12 },
          textAlign: 'center',
        }}
      >
        <Typography
          component="h1"
          variant="h2"
          color="inherit"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,.5)'
          }}
        >
          Welcome to Our Library
        </Typography>
        <Typography
          variant="h5"
          color="inherit"
          paragraph
          sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}
        >
          Discover millions of books and resources. Start your journey of knowledge today.
        </Typography>
        
        <Box sx={{ maxWidth: '600px', mx: 'auto' }}>
          <SearchBar onSearch={onSearch} />
        </Box>

        <Button
          variant="contained"
          size="large"
          sx={{ mt: 4 }}
        >
          Browse Catalog
        </Button>
      </Container>
    </Paper>
  );
}

export default LibraryHeroSection;