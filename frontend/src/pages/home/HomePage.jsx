import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  InputBase,
  IconButton,
  Divider,
  Container,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import RecipeList from '../../components/recipes/RecipeList';
import { recipeApi } from '../../services/api';

const featuredCategories = [
  { name: 'Quick & Easy', tag: 'quick' },
  { name: 'Beginner-Friendly', tag: 'beginner' },
  { name: 'Healthy Options', tag: 'healthy' },
  { name: 'Popular', tag: 'popular' },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentRecipes = async () => {
      try {
        setLoading(true);
        const recipes = await recipeApi.getRecipes();
        setRecentRecipes(recipes);
        setError(null);
      } catch (err) {
        console.error('Error fetching recent recipes:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentRecipes();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/recipes/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/recipes/search?tags=${encodeURIComponent(category.tag)}`);
  };

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: 'url(https://source.unsplash.com/random?cooking)',
          height: '400px',
        }}
      >
        {/* Increase the priority of the hero background image */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.55)',
          }}
        />
        <Container
          sx={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            component="h1"
            variant="h2"
            color="inherit"
            align="center"
            gutterBottom
          >
            CookAtlas
          </Typography>
          <Typography
            variant="h5"
            color="inherit"
            align="center"
            paragraph
            sx={{ maxWidth: '700px', mb: 4 }}
          >
            Discover the perfect recipe for any occasion. From quick weeknight meals to impressive dinner party dishes.
          </Typography>

          {/* Search Bar */}
          <Paper
            component="form"
            onSubmit={handleSearch}
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              width: { xs: '90%', sm: '70%', md: '50%' },
              maxWidth: '600px',
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search for recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Container>
      </Paper>

      {/* Categories Section */}
      <Typography variant="h5" gutterBottom>
        Explore Categories
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {featuredCategories.map((category) => (
          <Grid item xs={6} sm={3} key={category.name}>
            <Button
              fullWidth
              variant="outlined"
              sx={{ py: 2 }}
              onClick={() => handleCategoryClick(category)}
            >
              {category.name}
            </Button>
          </Grid>
        ))}
      </Grid>

      {/* Recent Recipes Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Recent Recipes</Typography>
          <Button onClick={() => navigate('/recipes')}>View All</Button>
        </Box>
        <RecipeList
          recipes={recentRecipes.slice(0, 6)} // Show first 6 recipes
          loading={loading}
          error={error}
        />
      </Box>
    </Box>
  );
};

export default HomePage;