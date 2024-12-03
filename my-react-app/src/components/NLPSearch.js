import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Grid, Card, CardContent, CardMedia, Box } from '@mui/material';
import axios from 'axios';

function NLPSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post('http://localhost:8000/nlp-search', { query });
      setResults(response.data.books);
    } catch (err) {
      setError('An error occurred while searching. Please try again.');
      console.error('Search error:', err);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>NLP Book Search</Typography>
      <form onSubmit={handleSearch}>
        <TextField
          fullWidth
          label="Search books"
          variant="outlined"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary">
          Search
        </Button>
      </form>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>
      )}

      <Grid container spacing={3} sx={{ mt: 4 }}>
        {results.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                sx={{ height: 140, objectFit: 'contain' }}
                image={book.image_url || 'https://via.placeholder.com/140x200'}
                alt={book.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div">
                  {book.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  by {book.author}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {results.length === 0 && query && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body1">No results found for your search.</Typography>
        </Box>
      )}
    </Container>
  );
}

export default NLPSearch;