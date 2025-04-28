import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Registered User',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  function isPasswordStrong(password) {
    // At least 8 characters, contains numbers and letters
    return password.length >= 8 && password.length <= 100 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!isPasswordStrong(formData.password)) {
      setError('Password must be at least 8 characters and contain both letters and numbers');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Paper sx={{ p: 4, maxWidth: '500px', width: '100%' }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Create Account
        </Typography>
        
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
          Join CookAtlas to discover and share recipes
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            name="username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.username}
            onChange={handleChange}
            required
          />
          
          <TextField
            label="Email"
            name="email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <TextField
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            required
            helperText="Password must be at least 8 characters long"
          />
          
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-select-label">Account Type</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              name="role"
              value={formData.role}
              label="Account Type"
              onChange={handleChange}
            >
              <MenuItem value="Registered User">Food Enthusiast</MenuItem>
              <MenuItem value="Recipe Creator">Content Creator</MenuItem>
            </Select>
            <FormHelperText>
              Content Creators can upload and share their own recipes
            </FormHelperText>
          </FormControl>
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>
        
        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>
        
        <Grid container justifyContent="center">
          <Grid item>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login">
                Log in
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default RegisterPage;