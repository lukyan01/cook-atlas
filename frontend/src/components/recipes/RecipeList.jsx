import { Grid, Box, Typography, CircularProgress, useTheme as useMuiTheme } from '@mui/material';
import RecipeCard from './RecipeCard';

const RecipeList = ({ recipes, loading, error }) => {
  const theme = useMuiTheme();
  // Show loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography color="error" align="center">
          Error loading recipes: {error.message || 'Unknown error'}
        </Typography>
      </Box>
    );
  }

  // Show empty state
  if (!recipes || recipes.length === 0) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="h6" align="center" color="text.secondary">
          No recipes found. Try adjusting your search criteria.
        </Typography>
      </Box>
    );
  }

  // Show recipes grid
  return (
    <Grid container spacing={3} sx={{ backgroundColor: theme.palette.background.default }}>
      {recipes.map((recipe) => (
        <Grid item xs={12} sm={6} md={4} key={recipe.recipe_id}>
          <RecipeCard recipe={recipe} />
        </Grid>
      ))}
    </Grid>
  );
};

export default RecipeList;