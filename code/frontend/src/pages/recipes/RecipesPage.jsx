import {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {
  Alert,
  Box,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import RecipeList from '../../components/recipes/RecipeList';
import SearchFilters from '../../components/search/SearchFilters';
import {recipeApi} from '../../services/api';

const ITEMS_PER_PAGE = 9;

const RecipesPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [sortOrder, setSortOrder] = useState('newest');
    const [searchParams, setSearchParams] = useState({});

    // Parse query params on mount and when URL changes
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Parse URL parameters
                const query = new URLSearchParams(location.search);
                const params = {};

                for (const [key, value] of query.entries()) {
                    params[key] = value;
                }

                setSearchParams(params);

                // If there are search params, perform search
                let data;
                if (Object.keys(params).length > 0) {
                    data = await recipeApi.searchRecipes(params);
                } else {
                    data = await recipeApi.getRecipes();
                }

                // Sort recipes based on current sort order
                sortRecipes(data || [], sortOrder);

            } catch (err) {
                console.error('Error loading recipes:', err);
                setError(err.message || 'Failed to load recipes');
                setRecipes([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [location.search]);

    const sortRecipes = (recipeData, sortBy) => {
        let sortedRecipes = [...recipeData];

        switch (sortBy) {
            case 'alphabetical':
                sortedRecipes.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'cook-time-asc':
                sortedRecipes.sort((a, b) => (a.cook_time || 0) - (b.cook_time || 0));
                break;
            case 'cook-time-desc':
                sortedRecipes.sort((a, b) => (b.cook_time || 0) - (a.cook_time || 0));
                break;
            case 'newest':
            default:
                // Assuming recipe_id is incremental (newer recipes have higher IDs)
                sortedRecipes.sort((a, b) => b.recipe_id - a.recipe_id);
                break;
        }

        setRecipes(sortedRecipes);
    };

    // Handle search with filters
    const handleApplyFilters = (filters) => {
        // Build query string from filters
        const queryParams = new URLSearchParams();

        // Add non-empty parameters to the query
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.set(key, value);
            }
        });

        // Update URL with search parameters
        const queryString = queryParams.toString();
        navigate({
            pathname: '/recipes/search',
            search: queryString ? `?${queryString}` : '',
        });
    };

    // Handle sorting change
    const handleSortChange = (event) => {
        const newSortOrder = event.target.value;
        setSortOrder(newSortOrder);
        sortRecipes(recipes, newSortOrder);
    };

    // Get initial filter values from URL params
    const getInitialFilterValues = () => {
        const params = {};
        if (searchParams.query) params.query = searchParams.query;
        if (searchParams.skill_level) params.skillLevel = searchParams.skill_level;
        return params;
    };

    // Calculate pagination
    const totalPages = Math.max(1, Math.ceil(recipes.length / ITEMS_PER_PAGE));
    const paginatedRecipes = recipes.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    // Determine if we're on the search page
    const isSearchPage = location.pathname.includes('/search');
    const title = isSearchPage ? "Search Results" : "Browse Recipes";

    return (
        <Box sx={{width: '100%', minHeight: '50vh'}}>
            {/* Title */}
            <Typography
                variant={isMobile ? "h5" : "h4"}
                component="h1"
                gutterBottom
                sx={{fontWeight: 500}}
            >
                {title}
            </Typography>

            {/* Search filters */}
            <SearchFilters
                onApplyFilters={handleApplyFilters}
                initialValues={getInitialFilterValues()}
            />

            {/* Loading indicator */}
            {loading && (
                <Box sx={{display: 'flex', justifyContent: 'center', py: 4}}>
                    <CircularProgress/>
                </Box>
            )}

            {/* Error alert */}
            {error && !loading && (
                <Alert severity="error" sx={{mb: 3}}>
                    {error}
                </Alert>
            )}

            {/* Results section - only show if not loading */}
            {!loading && (
                <>
                    {/* Sort and results count */}
                    <Grid
                        container
                        spacing={2}
                        alignItems="center"
                        sx={{mb: 3}}
                    >
                        <Grid item xs={12} sm={6}>
                            <Typography>
                                {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} found
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{textAlign: {xs: 'left', sm: 'left'}}}>
                            <FormControl sx={{width: {xs: '100%', sm: 175}}} size="small">
                                <InputLabel id="sort-select-label">Sort by</InputLabel>
                                <Select
                                    labelId="sort-select-label"
                                    id="sort-select"
                                    value={sortOrder}
                                    label="Sort by"
                                    onChange={handleSortChange}
                                >
                                    <MenuItem value="newest">Newest</MenuItem>
                                    <MenuItem value="alphabetical">A-Z</MenuItem>
                                    <MenuItem value="cook-time-asc">Fastest to Cook</MenuItem>
                                    <MenuItem value="cook-time-desc">Longest to Cook</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    {/* Recipe list */}
                    <RecipeList recipes={paginatedRecipes}/>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Box sx={{display: 'flex', justifyContent: 'center', mt: 4}}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={(_, value) => setPage(value)}
                                color="primary"
                                size={isMobile ? "small" : "medium"}
                            />
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
};

export default RecipesPage;