import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Button } from '@mui/material';
import axios from 'axios';
 
function OverdueFeePage({ userId }) {
  const [overdueFee, setOverdueFee] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOverdueFee();
  }, []);

  const fetchOverdueFee = async () => {
    try {
    const userId = localStorage.getItem('user_id');
      const response = await axios.get(`http://localhost:8000/user/${userId}/overdue-fee`);
      setOverdueFee(response.data.total_overdue_fee);
    } catch (error) {
      setError('Error fetching overdue fee');
    }
  };

  const handlePayment = () => {
    // Implement payment logic here
    alert('Payment functionality is not yet implemented.');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Overdue Fee
        </Typography>
        {error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <>
            <Typography variant="body1">
              Your total overdue fee is: ${overdueFee.toFixed(2)}
            </Typography>
            <Button variant="contained" color="primary" onClick={handlePayment} sx={{ mt: 2 }}>
              Pay Now
            </Button>
          </>
        )}
      </Paper>
    </Container>
  );
}

export default OverdueFeePage;
