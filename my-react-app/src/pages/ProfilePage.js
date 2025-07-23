import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => { 
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('user_id');
      const response = await axios.get(`http://localhost:8000/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setEditedUser(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setEditedUser({
      ...editedUser,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('user_id');
      await axios.put(`http://localhost:8000/users/${userId}`, editedUser, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      
      setUser(editedUser);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Profile
          </Typography>
          {!isEditing && (
            <Button
              startIcon={<EditIcon />}
              onClick={() => setIsEditing(true)}
              sx={{ ml: 2 }}
            >
              Edit Profile
            </Button>
          )}
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Username"
            name="username"
            value={isEditing ? editedUser.username : user?.username}
            onChange={handleInputChange}
            disabled={!isEditing}
            fullWidth
          />

          <TextField
            label="Email"
            name="email"
            value={isEditing ? editedUser.email : user?.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            fullWidth
          />

          {isEditing && (
            <TextField
              label="New Password"
              name="password"
              type="password"
              onChange={handleInputChange}
              fullWidth
            />
          )}

          {isEditing && (
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default ProfilePage;