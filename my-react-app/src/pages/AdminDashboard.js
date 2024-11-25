import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions,
  Rating,
  Box,
  Divider,
  Paper,
  Stack
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BookmarkIcon from '@mui/icons-material/Bookmark';

function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ 
    title: '', 
    author: '', 
    isbn: '', 
    image_url: '',
    price: '',
    description: ''
  });

  // ... your existing fetchBooks, handleAddBook, and handleDeleteBook functions ...
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:8000/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/books', newBook, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewBook({ title: '', author: '', isbn: '', image_url: '' });
      fetchBooks();
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/books/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Your existing form code */}
      
      <Divider sx={{ my: 4 }} />
      
      <Grid container spacing={3}>
        {books.map((book) => (
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
                
                <Box sx={{ mb: 1 }}>
                  <Rating value={4.5} precision={0.5} readOnly size="small" />
                  <Typography variant="caption" sx={{ ml: 1 }}>
                    (245)
                  </Typography>
                </Box>
                
                <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                  ISBN: {book.isbn}
                </Typography>
                
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 1, 
                    mb: 2,
                    backgroundColor: '#f8f9fa'
                  }}
                >
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                    $29.99
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    Free delivery
                  </Typography>
                </Paper>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Stack spacing={1} width="100%">
                  <Button 
                    variant="contained" 
                    fullWidth 
                    startIcon={<ShoppingCartIcon />}
                    sx={{ 
                      backgroundColor: '#ffd814',
                      color: 'black',
                      '&:hover': {
                        backgroundColor: '#f7ca00'
                      }
                    }}
                  >
                    Add to Cart
                  </Button>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    startIcon={<BookmarkIcon />}
                    onClick={() => handleDeleteBook(book.id)}
                    color="secondary"
                  >
                    Delete
                  </Button>
                </Stack>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default AdminDashboard;