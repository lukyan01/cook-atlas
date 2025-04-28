import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { recipeApi } from '../../services/api';

const NewRecipePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cook_time: '',
    prep_time: '',
    skill_level: 'Beginner',
    source_platform: '',
    source_url: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Check if user is authenticated
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      setError('Title and description are required');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const recipeData = {
        ...formData,
        creator_id: user.user_id,
        cook_time: formData.cook_time ? parseInt(formData.cook_time) : 0,
        prep_time: formData.prep_time ? parseInt(formData.prep_time) : 0,
      };
      
      await recipeApi.addRecipe(recipeData);
      
      setSnackbar({
        open: true,
        message: 'Recipe created successfully!',
        severity: 'success',
      });
      
      setTimeout(() => {
        navigate('/recipes');
      }, 2000);
      
    } catch (err) {
      console.error('Error creating recipe:', err);
      setError('Failed to create recipe: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  return (
    <Box>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        component="h1"
        gutterBottom
        sx={{ fontWeight: 500 }}
      >
        Create New Recipe
      </Typography>
      
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3 },
          mt: 2,
          borderRadius: 2,
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="title"
                label="Recipe Title"
                fullWidth
                required
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                fullWidth
                required
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
                helperText="Describe your recipe, including key ingredients and cooking method"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="prep_time"
                label="Prep Time (minutes)"
                type="number"
                fullWidth
                value={formData.prep_time}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="cook_time"
                label="Cook Time (minutes)"
                type="number"
                fullWidth
                value={formData.cook_time}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="skill-level-label">Skill Level</InputLabel>
                <Select
                  labelId="skill-level-label"
                  name="skill_level"
                  value={formData.skill_level}
                  label="Skill Level"
                  onChange={handleChange}
                >
                  <MenuItem value="Beginner">Beginner</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="source_platform"
                label="Source Platform"
                fullWidth
                value={formData.source_platform}
                onChange={handleChange}
                helperText="e.g., YouTube, Instagram, Personal Blog"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="source_url"
                label="Source URL"
                fullWidth
                value={formData.source_url}
                onChange={handleChange}
                helperText="Link to the original recipe if applicable"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/recipes')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading && <CircularProgress size={20} />}
                >
                  {loading ? 'Creating...' : 'Create Recipe'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NewRecipePage;