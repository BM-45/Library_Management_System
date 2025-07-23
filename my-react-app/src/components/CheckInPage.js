import React, { useState, useRef } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Paper, 
  Typography,
  CircularProgress
} from '@mui/material';
import { PhotoCamera, Upload } from '@mui/icons-material';

function CheckInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isbn, setIsbn] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleCapture = async (e) => {
    setIsLoading(true);
    const file = e.target.files[0];
    if (file) {
      // Show image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);

      // Create form data for API
      const formData = new FormData();
      formData.append('image', file);

      try {
        // Send to backend for ISBN detection
        const response = await fetch('http://localhost:8000/detect-isbn', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        setIsbn(data.isbn);
      } catch (error) {
        console.error('Error detecting ISBN:', error);
      }
      setIsLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!isbn) return;
    
    try {
      const response = await fetch('http://localhost:8000/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isbn })
      });
      // Handle check-in response
    } catch (error) {
      console.error('Error checking in book:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Book Check-In
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
          {/* Camera Capture Button */}
          <Button
            variant="contained"
            startIcon={<PhotoCamera />}
            onClick={() => fileInputRef.current.click()}
          >
            Capture ISBN
          </Button>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCapture}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />

          {/* Upload Button */}
          <Button
            variant="outlined"
            startIcon={<Upload />}
            component="label"
          >
            Upload Photo
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleCapture}
            />
          </Button>

          {/* Preview Area */}
          {previewUrl && (
            <Box sx={{ mt: 2 }}>
              <img 
                src={previewUrl} 
                alt="ISBN Preview" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '200px',
                  objectFit: 'contain' 
                }} 
              />
            </Box>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress />
            </Box>
          )}

          {/* ISBN Display */}
          {isbn && (
            <Typography variant="h6">
              Detected ISBN: {isbn}
            </Typography>
          )}

          {/* Check-in Button */}
          <Button
            variant="contained"
            color="primary"
            disabled={!isbn || isLoading}
            onClick={handleCheckIn}
            sx={{ mt: 2 }}
          >
            Check In Book
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default CheckInPage;