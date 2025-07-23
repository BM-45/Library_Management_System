import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Box,
  Button,
  Grid,
  Paper,
  Divider,
  Alert
} from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import axios from 'axios';

function UserCheckouts() {
  const [checkouts, setCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCheckouts = async () => {
    try {
      const token = localStorage.getItem('token');
      //const userId = localStorage.getItem('user_id'); // Assuming you store user_id after login

      const response = await axios.get(`http://localhost:8000/checkouts`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch book details for each checkout
      const checkoutsWithBooks = await Promise.all(
        response.data.map(async (checkout) => {
          const bookResponse = await axios.get(`http://localhost:8000/books/${checkout.book_id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          return {
            ...checkout,
            book: bookResponse.data
          };
        })
      );

      setCheckouts(checkoutsWithBooks);
      setError(null);
    } catch (err) {
      setError('Failed to fetch your checkouts. Please try again.');
      console.error('Error fetching checkouts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:8000/return/${bookId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCheckouts();
    } catch (err) {
      setError('Failed to return the book. Please try again.');
    }
  };

  useEffect(() => {
    fetchCheckouts();
  }, []);

  if (loading) return (
    <Container>
      <Typography variant="h5" sx={{ mt: 4 }}>Loading...</Typography>
    </Container>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LibraryBooksIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            My Checked Out Books
          </Typography>
        </Box>
        <Divider />
      </Paper>

      {checkouts.length === 0 ? (
        <Typography variant="h6">You have no books checked out.</Typography>
      ) : (
        <Grid container spacing={3}>
          {checkouts.map(checkout => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={checkout.id}>
              <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: '0.3s',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-5px)'
                }
              }}>
                <Box sx={{ position: 'relative', pt: '140%' }}>

                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      zIndex: 1,
                      fontSize: '0.875rem'
                    }}
                  >
                    Due in {Math.ceil((new Date(checkout.due_date) - new Date()) / (1000 * 60 * 60 * 24))} days
                  </Box>


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
                    image={checkout.book.image_url || 'https://via.placeholder.com/300x400'}
                    alt={checkout.book.title}
                  />

                 
                </Box>

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {checkout.book.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Due Date: {new Date(checkout.due_date).toLocaleDateString()}
                  </Typography>

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleReturn(checkout.book.id)}
                  >
                    Return Book
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default UserCheckouts;