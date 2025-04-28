import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Slider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  InputAdornment,
  IconButton,
  useMediaQuery,
  useTheme,
  Grid,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Close as CloseIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

const SearchFilters = ({ onApplyFilters, initialValues = {} }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [filters, setFilters] = useState({
    query: initialValues.query || '',
    cookTime: initialValues.cookTime || [0, 180],
    prepTime: initialValues.prepTime || [0, 60],
    skillLevel: initialValues.skillLevel || '',
    ingredients: initialValues.ingredients || [],
    tags: initialValues.tags || [],
  });

  const [newIngredient, setNewIngredient] = useState('');
  const [newTag, setNewTag] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleAddIngredient = () => {
    if (newIngredient.trim() && !filters.ingredients.includes(newIngredient.trim())) {
      setFilters({
        ...filters,
        ingredients: [...filters.ingredients, newIngredient.trim()],
      });
      setNewIngredient('');
    }
  };

  const handleRemoveIngredient = (ingredient) => {
    setFilters({
      ...filters,
      ingredients: filters.ingredients.filter((i) => i !== ingredient),
    });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !filters.tags.includes(newTag.trim())) {
      setFilters({
        ...filters,
        tags: [...filters.tags, newTag.trim()],
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFilters({
      ...filters,
      tags: filters.tags.filter((t) => t !== tag),
    });
  };

  const handleApplyFilters = () => {
    // Convert filter values to API parameters
    const apiParams = {
      query: filters.query,
      skill_level: filters.skillLevel,
      min_cook_time: filters.cookTime[0] > 0 ? filters.cookTime[0] : undefined,
      max_cook_time: filters.cookTime[1] < 180 ? filters.cookTime[1] : undefined,
      min_prep_time: filters.prepTime[0] > 0 ? filters.prepTime[0] : undefined,
      max_prep_time: filters.prepTime[1] < 60 ? filters.prepTime[1] : undefined,
    };

    // Add tags if there are any (includes ingredients for now, since the backend handles them the same)
    if (filters.tags.length > 0 || filters.ingredients.length > 0) {
      apiParams.tags = [...filters.tags, ...filters.ingredients].join(',');
    }

    onApplyFilters(apiParams);
  };

  const handleKeyDown = (e) => {
    // Apply filters on Enter key in search input
    if (e.key === 'Enter') {
      handleApplyFilters();
    }
  };

  const handleResetFilters = () => {
    setFilters({
      query: '',
      cookTime: [0, 180],
      prepTime: [0, 60],
      skillLevel: '',
      ingredients: [],
      tags: [],
    });
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: { xs: 2, sm: 3 }, 
        mb: 3,
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <FilterListIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6">Recipe Search</Typography>
        <Button 
          sx={{ ml: 'auto' }} 
          size="small" 
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </Box>

      {/* Basic search input always visible */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          label="Search recipes"
          variant="outlined"
          value={filters.query}
          onChange={(e) => handleFilterChange('query', e.target.value)}
          onKeyDown={handleKeyDown}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={handleApplyFilters}
                  aria-label="search"
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Advanced filters in accordion */}
      <Accordion 
        expanded={expanded} 
        onChange={() => setExpanded(!expanded)}
        disableGutters
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          '&:before': {
            display: 'none',
          },
          borderRadius: 1,
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="filter-panel-content"
          id="filter-panel-header"
        >
          <Typography>Advanced Filters</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            {/* Skill level filter */}
            <Grid item xs={12} md={6}>
              <FormControl component="fieldset" sx={{ mb: 2, width: '100%' }}>
                <FormLabel component="legend">Skill Level</FormLabel>
                <RadioGroup
                  row
                  value={filters.skillLevel}
                  onChange={(e) => handleFilterChange('skillLevel', e.target.value)}
                >
                  <FormControlLabel value="" control={<Radio />} label="Any" />
                  <FormControlLabel value="Beginner" control={<Radio />} label="Beginner" />
                  <FormControlLabel value="Intermediate" control={<Radio />} label="Intermediate" />
                  <FormControlLabel value="Advanced" control={<Radio />} label="Advanced" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Time sliders */}
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>Cook Time (minutes)</Typography>
                <Slider
                  value={filters.cookTime}
                  onChange={(e, newValue) => handleFilterChange('cookTime', newValue)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={180}
                  step={5}
                  marks={[
                    { value: 0, label: '0m' },
                    { value: 60, label: '1h' },
                    { value: 120, label: '2h' },
                    { value: 180, label: '3h' },
                  ]}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>Prep Time (minutes)</Typography>
                <Slider
                  value={filters.prepTime}
                  onChange={(e, newValue) => handleFilterChange('prepTime', newValue)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={60}
                  step={5}
                  marks={[
                    { value: 0, label: '0m' },
                    { value: 15, label: '15m' },
                    { value: 30, label: '30m' },
                    { value: 60, label: '1h' },
                  ]}
                />
              </Box>
            </Grid>

            {/* Ingredients filter */}
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>Ingredients</Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Add ingredient"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddIngredient()}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton edge="end" onClick={handleAddIngredient}>
                          <AddIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                  {filters.ingredients.map((ingredient) => (
                    <Chip
                      key={ingredient}
                      label={ingredient}
                      onDelete={() => handleRemoveIngredient(ingredient)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            </Grid>

            {/* Tags filter */}
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>Tags</Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Add tag (e.g., vegan, dessert)"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton edge="end" onClick={handleAddTag}>
                          <AddIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                  {filters.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                      color="secondary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
        <Button 
          variant="outlined" 
          onClick={handleResetFilters}
        >
          Reset
        </Button>
        <Button 
          variant="contained" 
          onClick={handleApplyFilters}
        >
          Apply Filters
        </Button>
      </Box>
    </Paper>
  );
};

export default SearchFilters;