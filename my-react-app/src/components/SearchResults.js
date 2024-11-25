import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Box,
  Button,
  Paper,
  Divider
} from '@mui/material';
import BookIcon from '@mui/icons-material/Book';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const category = searchParams.get('category');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/search?query=${query}&category=${category}`);
        setResults(response.data);
        setError(null);
      } catch (err) {
        setError('An error occurred while fetching results. Please try again.');
        console.error('Error fetching search results:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, category]);

  if (loading) return (
    <Container>
      <Typography variant="h5" sx={{ mt: 4 }}>Loading...</Typography>
    </Container>
  );
  
  if (error) return (
    <Container>
      <Typography color="error" sx={{ mt: 4 }}>{error}</Typography>
    </Container>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <BookIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Search Results for "{query}" in {category}
          </Typography>
        </Box>
        <Divider />
      </Paper>

      {results.length === 0 ? (
        <Typography variant="h6">No results found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {results.map(book => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: '0.3s',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-5px)'
                  }
                }}
              >
                <Box sx={{ position: 'relative', pt: '140%' }}>
                  <CardMedia
                    component="img"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      height: '100%',
                      objectFit: 'contain',
                      p: 2
                    }}
                    image={book.image_url || 'https://via.placeholder.com/300x400'}
                    alt={book.title}
                  />
                </Box>
                
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      mb: 1,
                      height: '2.4em',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {book.title}
                  </Typography>
                  
                  <Typography 
                    variant="subtitle1" 
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    by <Box component="span" sx={{ color: 'primary.main' }}>{book.author}</Box>
                  </Typography>
                  
                  <Typography variant="caption" display="block">
                    ISBN: {book.isbn}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      <Button 
        component={Link} 
        to="/" 
        variant="contained" 
        sx={{ mt: 4 }}
      >
        Back to Search
      </Button>
    </Container>
  );
}

export default SearchResults;