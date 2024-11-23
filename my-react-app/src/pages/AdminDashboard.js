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
  CardActions 
} from '@mui/material';

function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', isbn: '', image_url: '' });

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
    <Container>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      <form onSubmit={handleAddBook}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Title"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Author"
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="ISBN"
              value={newBook.isbn}
              onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Image URL"
              value={newBook.image_url}
              onChange={(e) => setNewBook({ ...newBook, image_url: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">Add Book</Button>
          </Grid>
        </Grid>
      </form>
      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        {books.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={book.image_url || 'https://via.placeholder.com/140x200'}
                alt={book.title}
              />
              <CardContent>
                <Typography variant="h6">{book.title}</Typography>
                <Typography variant="subtitle1">by {book.author}</Typography>
                <Typography variant="body2">ISBN: {book.isbn}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="secondary" onClick={() => handleDeleteBook(book.id)}>Delete</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default AdminDashboard;