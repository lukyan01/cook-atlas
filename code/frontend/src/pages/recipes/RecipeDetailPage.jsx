import {useEffect, useMemo, useState} from 'react';
import {Link as RouterLink, useParams} from 'react-router-dom';
import {
    Alert,
    Box,
    Breadcrumbs,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Grid,
    Link,
    Paper,
    Rating,
    Snackbar,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {
    AccessTime as AccessTimeIcon,
    ArrowBack as ArrowBackIcon,
    Bookmark as BookmarkIcon,
    BookmarkBorder as BookmarkBorderIcon,
    NavigateNext as NavigateNextIcon,
    Restaurant as RestaurantIcon,
    Share as ShareIcon,
} from '@mui/icons-material';
import {useAuth} from '../../context/AuthContext';
import {bookmarkApi, recipeApi} from '../../services/api';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

// Placeholder image for recipes without images
const placeholderImage = 'https://source.unsplash.com/random?food';

const RecipeDetailPage = () => {
    const {recipeId} = useParams();
    const {isAuthenticated, user} = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bookmarked, setBookmarked] = useState(false);
    const [bookmarkLoading, setBookmarkLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    // ────────────────────────────────────────────────────────────────
    // Data fetching / bookmarking state
    // ────────────────────────────────────────────────────────────────
    useEffect(() => {
        const fetchRecipeDetails = async () => {
            try {
                setLoading(true);
                const data = await recipeApi.getRecipeById(recipeId);
                setRecipe(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching recipe:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (recipeId) fetchRecipeDetails();
    }, [recipeId]);

    useEffect(() => {
        const checkBookmarkStatus = async () => {
            if (isAuthenticated() && user && recipe) {
                try {
                    const isBookmarked = await bookmarkApi.checkBookmark(
                        user.user_id,
                        recipe.recipe_id,
                    );
                    setBookmarked(isBookmarked);
                } catch (err) {
                    console.error('Error checking bookmark status:', err);
                }
            }
        };
        checkBookmarkStatus();
    }, [isAuthenticated, user, recipe]);

    // ────────────────────────────────────────────────────────────────
    // Helpers
    // ────────────────────────────────────────────────────────────────
    const handleBookmark = async () => {
        if (!isAuthenticated()) {
            setSnackbar({
                open: true,
                message: 'Please login to bookmark recipes',
                severity: 'info',
            });
            return;
        }

        try {
            setBookmarkLoading(true);
            if (bookmarked) {
                await bookmarkApi.removeBookmark(user.user_id, recipe.recipe_id);
                setBookmarked(false);
                setSnackbar({open: true, message: 'Recipe removed from bookmarks', severity: 'success'});
            } else {
                await bookmarkApi.addBookmark(user.user_id, recipe.recipe_id);
                setBookmarked(true);
                setSnackbar({open: true, message: 'Recipe added to bookmarks', severity: 'success'});
            }
        } catch (err) {
            setSnackbar({open: true, message: err.message || 'Error updating bookmark', severity: 'error'});
        } finally {
            setBookmarkLoading(false);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: recipe.title,
                    text: `Check out this recipe: ${recipe.title}`,
                    url: window.location.href,
                })
                .then(() => setSnackbar({open: true, message: 'Recipe shared successfully', severity: 'success'}))
                .catch((err) => setSnackbar({open: true, message: 'Error sharing recipe', severity: 'error'}));
        } else {
            navigator.clipboard
                .writeText(window.location.href)
                .then(() => setSnackbar({open: true, message: 'Recipe URL copied to clipboard', severity: 'success'}))
                .catch(() => setSnackbar({open: true, message: 'Error copying URL to clipboard', severity: 'error'}));
        }
    };

    const handleCloseSnackbar = () => setSnackbar((s) => ({...s, open: false}));

    const formatTime = (minutes) => {
        if (!minutes) return 'N/A';
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hrs === 0) return `${mins} min`;
        if (mins === 0) return `${hrs} hr`;
        return `${hrs} hr ${mins} min`;
    };

    const getDifficultyColor = (level) => {
        switch (level?.toLowerCase()) {
            case 'beginner':
                return 'success';
            case 'intermediate':
                return 'warning';
            case 'advanced':
                return 'error';
            default:
                return 'default';
        }
    };

    // ────────────────────────────────────────────────────────────────
    // Convert the stored (double‑escaped) markdown string back to real MD
    // ────────────────────────────────────────────────────────────────
    const decodedMd = useMemo(() => {
        if (!recipe?.instructions_md) return '';
        // Replace literal \n with newline characters, then trim
        return recipe.instructions_md.replace(/\\n/g, '\n').trim();
    }, [recipe?.instructions_md]);

    // ────────────────────────────────────────────────────────────────
    // Render
    // ────────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <Container sx={{display: 'flex', justifyContent: 'center', py: 4}}>
                <CircularProgress/>
            </Container>
        );
    }

    if (error || !recipe) {
        return (
            <Container sx={{py: 4}}>
                <Typography color="error" align="center">
                    {error ? `Error: ${error.message}` : 'Recipe not found'}
                </Typography>
                <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}>
                    <Button variant="contained" component={RouterLink} to="/recipes" startIcon={<ArrowBackIcon/>}>
                        Back to Recipes
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Box>
            {/* Breadcrumbs */}
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small"/>} aria-label="breadcrumb"
                         sx={{mb: 2, display: {xs: 'none', sm: 'flex'}}}>
                <Link component={RouterLink} to="/" underline="hover" color="inherit">
                    Home
                </Link>
                <Link component={RouterLink} to="/recipes" underline="hover" color="inherit">
                    Recipes
                </Link>
                <Typography color="text.primary" noWrap sx={{maxWidth: '200px'}}>
                    {recipe.title}
                </Typography>
            </Breadcrumbs>

            {/* Header */}
            <Paper sx={{mb: 4, overflow: 'hidden', borderRadius: {xs: 0, sm: 2}}} elevation={3}>
                <Box
                    sx={{
                        height: {xs: '200px', sm: '300px', md: '400px'},
                        position: 'relative',
                        backgroundImage: `url(${recipe.image_url || placeholderImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            width: '100%',
                            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                            p: {xs: 2, md: 3},
                            color: 'white',
                        }}
                    >
                        <Typography variant={isMobile ? 'h5' : 'h4'} component="h1" gutterBottom
                                    sx={{fontWeight: 'bold', textShadow: '1px 1px 3px rgba(0,0,0,0.5)'}}>
                            {recipe.title}
                        </Typography>
                        <Box sx={{display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1}}>
                            <Chip label={recipe.skill_level} size="small" color={getDifficultyColor(recipe.skill_level)}
                                  sx={{
                                      color: 'white',
                                      backgroundColor: (t) => t.palette[getDifficultyColor(recipe.skill_level)].main
                                  }}/>
                            {recipe.source_platform &&
                                <Chip label={recipe.source_platform} size="small" variant="outlined"
                                      sx={{color: 'white', borderColor: 'white'}}/>}
                            <Rating value={4.5} readOnly size="small" precision={0.5}/>
                        </Box>
                    </Box>
                </Box>
            </Paper>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    {/* Description */}
                    <Typography variant="body1" paragraph>
                        {recipe.description}
                    </Typography>

                    {/* Prep / cook times */}
                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3}}>
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <AccessTimeIcon sx={{mr: 1}}/>
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Prep Time
                                </Typography>
                                <Typography variant="body1">{formatTime(recipe.prep_time)}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <RestaurantIcon sx={{mr: 1}}/>
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Cook Time
                                </Typography>
                                <Typography variant="body1">{formatTime(recipe.cook_time)}</Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{mb: 3}}/>

                    {/* Action buttons */}
                    <Box sx={{display: 'flex', gap: 2, mb: 4}}>
                        <Button variant="outlined" startIcon={bookmarked ? <BookmarkIcon/> : <BookmarkBorderIcon/>}
                                onClick={handleBookmark} disabled={bookmarkLoading}>
                            {bookmarked ? 'Bookmarked' : 'Bookmark'}
                        </Button>
                        <Button variant="outlined" startIcon={<ShareIcon/>} onClick={handleShare}>
                            Share
                        </Button>
                    </Box>

                    {/* Instructions (Markdown) */}
                    <Typography variant="h5" gutterBottom>
                        Instructions
                    </Typography>
                    <Paper variant="outlined" sx={{p: 2, mb: 4, borderRadius: 2}}>
                        {decodedMd ? (
                            <ReactMarkdown remarkPlugins={[remarkBreaks, remarkGfm]}>{decodedMd}</ReactMarkdown>
                        ) : (
                            <Typography>No instructions available.</Typography>
                        )}
                    </Paper>

                    {/* Source link */}
                    {recipe.source_url && (
                        <Box sx={{mt: 4}}>
                            <Typography variant="body2" color="text.secondary">
                                Source:
                            </Typography>
                            <Link href={recipe.source_url} target="_blank" rel="noopener noreferrer">
                                {recipe.source_url}
                            </Link>
                        </Box>
                    )}
                </Grid>

                {/* Side column */}
                <Grid item xs={12} md={4}>
                    <Card sx={{mb: 3, borderRadius: 2}}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Nutritional Information
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                This is a placeholder for nutritional information. In a real app, this would contain
                                actual nutrition data.
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* Related recipes placeholder */}
                    <Typography variant="h6" gutterBottom>
                        You Might Also Like
                    </Typography>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                        <Card sx={{borderRadius: 2}}>
                            <CardContent>
                                <Typography variant="subtitle1">Related recipe placeholder</Typography>
                            </CardContent>
                        </Card>
                        <Card sx={{borderRadius: 2}}>
                            <CardContent>
                                <Typography variant="subtitle1">Related recipe placeholder</Typography>
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>
            </Grid>

            {/* Snackbar */}
            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}
                      anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{width: '100%'}}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default RecipeDetailPage;
