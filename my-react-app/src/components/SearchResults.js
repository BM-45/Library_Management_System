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
  Divider,
  CardActions,
  IconButton,
  Tooltip,
  Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const category = searchParams.get('category');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);


  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/search?query=${query}&category=${category}`);
      // Fetch checkout dates for each book
      const booksWithDates = await Promise.all(
        response.data.map(async (book) => {
          const checkoutResponse = await axios.get(`http://localhost:8000/books/${book.id}/checkouts`);
          return {
            ...book,
            unavailableDates: checkoutResponse.data.dates
          };
        })
      );
      setResults(booksWithDates);
      setError(null);
    } catch (err) {
      setError('An error occurred while fetching results. Please try again.');
      console.error('Error fetching search results:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableDates = async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to continue');
        return;
      }

      const response = await axios.get(`http://localhost:8000/books/${bookId}/available-dates`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.available_dates) {
        setAvailableDates(response.data.available_dates);
        setOpenCalendar(true);
      }
    } catch (error) {
      console.error('Error fetching available dates:', error);
      setError(error.response?.data?.message || 'Failed to fetch available dates');
    }
  };

  useEffect(() => {
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

  const handleCheckout = async (date) => {
    if (!selectedBook || !date) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:8000/checkout/${selectedBook.id}`, {
        checkout_date: date
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOpenCalendar(false);
      setSelectedBook(null);
      setSelectedDate(null);
      fetchResults();
    } catch (err) {
      setError(err.response?.data?.message || 'Error checking out book');
    }
  };

  const handleReserve = async () => {
    if (!selectedDate || !selectedBook) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:8000/reserve/${selectedBook.id}`, {
        date: selectedDate
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOpenCalendar(false);
      setSelectedBook(null);
      setSelectedDate(null);
      fetchResults();
    } catch (err) {
      setError('Error reserving book. Please try again.');
    }
  };

  const handleCheckoutClick = (book) => {
    setSelectedBook(book);
    setOpenDialog(true);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <BookIcon sx={{ fontSize: 24, mr: 2, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Search Results for "{query}" in {category}
          </Typography>
        </Box>
        <Divider />
      </Paper>

      <Grid container spacing={3}>
        {results.map(book => (
          <Grid item xs={12} sm={6} md={3} lg={2} key={book.id}>
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
              <Box sx={{ position: 'relative', pt: '100%' }}>
                <CardMedia
                  component="img"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '80%',
                    width: '80%',
                    objectFit: 'contain',
                    p: 2
                  }}
                  image={book.image_url || 'https://via.placeholder.com/150x200'}
                  alt={book.title}
                />
              </Box>

              <CardContent sx={{ flexGrow: 1 }}>

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '1rem',
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

                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={async () => {
                      setSelectedBook(book);
                      await fetchAvailableDates(book.id);
                    }}
                  >
                    Select Date
                  </Button>
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{ mt: 1, textAlign: 'center' }}
                  >
                    {book.available_copies} copies available
                  </Typography>
                </Box>
              </CardContent>
              { /*
              <CardActions sx={{ p: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => handleCheckoutClick(book)}
                  disabled={book.available_copies <= 0}
                  sx={{
                    mt: 2,
                    backgroundColor: book.available_copies > 0 ? 'primary.main' : 'grey.400'
                  }}
                >
                  {book.available_copies > 0 ? 'Checkout' : 'Not Available'}
                </Button>
              </CardActions>
              */ }

            </Card>
          </Grid>
        ))}
      </Grid>


      {/* Add this at the bottom of your return statement */}
      <Dialog open={openCalendar} onClose={() => setOpenCalendar(false)}>
        <DialogTitle>Select Checkout Date</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Please select a date to checkout this book:
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Pickup Date"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              minDate={new Date()}
              maxDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)}
              shouldDisableDate={(date) => {
                const dateString = date.toISOString().split('T')[0];
                return !availableDates.includes(dateString);
              }}
              sx={{ width: '100%' }}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCalendar(false)}>Cancel</Button>
          <Button
            onClick={() => handleCheckout(selectedDate)}
            variant="contained"
            disabled={!selectedDate}
          >
            Checkout
          </Button>
        </DialogActions>
      </Dialog>

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