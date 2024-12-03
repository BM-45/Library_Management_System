import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Paper, Box, Divider, IconButton, Stack } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import BookIcon from '@mui/icons-material/Book';

function AddBook() {
  const [book, setBook] = useState({
    title: '',
    author: '',
    isbn: '',
    text_viewer: '',
    category: ''
  });
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBook(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.keys(book).forEach(key => {
      formData.append(key, book[key]);
    });

    if (image) {
      formData.append('image', image);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/books', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        setBook({
          title: '',
          author: '',
          isbn: '',
          category: '',
          text_viewer: ''
        });
        setImage(null);
        setPreviewUrl(null);
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to add book');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Error:', err);
    }
  };

  return (
    <Container maxWidth="md" sx={{
      py: 4, display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh'
    }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          backgroundColor: '#ffffff',
          borderRadius: 2,
          width: 400,
          height: 900
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <BookIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" color="primary">
            Add New Book
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={book.title}
                onChange={handleInputChange}
                rows={2}
                required
                variant="outlined"
                sx={{ flex: 2 }}
              />

              <TextField
                fullWidth
                label="Author"
                name="author"
                value={book.author}
                onChange={handleInputChange}
                rows={2}
                required
                variant="outlined"
                sx={{ flex: 2 }}
              />
            </Box>

            <TextField
              fullWidth
              label="ISBN"
              name="isbn"
              value={book.isbn}
              onChange={handleInputChange}
              required
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Description"
              name="text_viewer"
              value={book.text_viewer}
              onChange={handleInputChange}
              multiline
              rows={6}
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Category"
              name="category"
              value={book.category}
              onChange={handleInputChange}
              required
              variant="outlined"
              sx={{ mb: 2 }}
            />

            <Box sx={{
              border: '2px dashed #ccc',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              backgroundColor: '#f8f8f8'
            }}>
              {previewUrl ? (
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{
                      maxWidth: '200px',
                      maxHeight: '200px',
                      objectFit: 'contain'
                    }}
                  />
                  <IconButton
                    onClick={handleRemoveImage}
                    sx={{
                      position: 'absolute',
                      top: -20,
                      right: -20,
                      backgroundColor: 'white',
                      '&:hover': { backgroundColor: '#f5f5f5' }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ) : (
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    py: 2,
                    px: 4,
                    backgroundColor: 'white',
                    color: 'primary.main',
                    '&:hover': { backgroundColor: '#f5f5f5' }
                  }}
                >
                  Upload Cover Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
              )}
            </Box>

            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                mt: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}
            >
              Add Book
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}

export default AddBook;