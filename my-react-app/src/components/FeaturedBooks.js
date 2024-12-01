import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent,
  Button 
} from '@mui/material';

function FeaturedBooks() {
  const featuredBooks = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      description: "A story of decadence and excess.",
      image: "/images/gatsby.jpg"
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      description: "A classic of modern American literature.",
      image: "/images/mockingbird.jpg"
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      description: "A dystopian social science fiction.",
      image: "/images/1984.jpg"
    }
  ];

  return (
    <Box sx={{ py: 6, backgroundColor: 'background.paper' }}>
      <Typography variant="h4" component="h2" sx={{ mb: 4, textAlign: 'center' }}>
        Featured Books
      </Typography>
      <Grid container spacing={4}>
        {featuredBooks.map((book) => (
          <Grid item key={book.id} xs={12} sm={6} md={4}>
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
                height="300"
                image={book.image}
                alt={book.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h3">
                  {book.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  by {book.author}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {book.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default FeaturedBooks;