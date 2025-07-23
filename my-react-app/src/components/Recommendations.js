import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      const response = await axios.get(`http://localhost:8000/recommendations/${userId}`);
      setRecommendations(response.data.recommendations);
    } catch (error) {
      setError('Error fetching recommendations');
      console.error(error);
    }
  };

  const handleViewDetails = async (book) => {
    setSelectedBook(book);
    setOpenDialog(true);
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/books/${book.id}/summary`);
      setSummary(response.data.summary);
    } catch (error) {
      setSummary('Error fetching book summary');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBook(null);
    setSummary('');
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Recommended Books for You
      </Typography>
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Grid container spacing={3}>
          {recommendations.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book.id}>
              <Card sx={{ display: 'flex', height: '100%' }}>
                <Box sx={{ width: 100, flexShrink: 0 }}>
                  <CardMedia
                    component="img"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    image={book.image_url || 'https://via.placeholder.com/100x150'}
                    alt={book.title}
                  />
                </Box>
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <Typography variant="h6" component="div" noWrap>
                    {book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    by {book.author}
                  </Typography>
                  <Button 
                    size="small" 
                    color="primary" 
                    sx={{ mt: 1 }}
                    onClick={() => handleViewDetails(book)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedBook && (
          <>
            <DialogTitle>{selectedBook.title}</DialogTitle>
            <DialogContent>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Typography variant="body1">{summary}</Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
}

export default Recommendations;