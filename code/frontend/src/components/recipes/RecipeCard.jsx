import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Chip,
    IconButton,
    Snackbar,
    Tooltip,
    Typography,
} from '@mui/material';
import {
    Bookmark as BookmarkIcon,
    BookmarkBorder as BookmarkBorderIcon,
    Restaurant as RestaurantIcon,
    Timer as TimerIcon,
    Delete as DeleteIcon,

} from '@mui/icons-material';
import {useAuth} from '../../context/AuthContext';
import {bookmarkApi} from '../../services/api';
import { recipeApi } from '../../services/api'; // Make sure this has the delete endpoint

// Placeholder image for recipes without images
const placeholderImage = 'https://source.unsplash.com/random?food';

const RecipeCard = ({recipe}) => {
    const {isAuthenticated, user} = useAuth();
    const navigate = useNavigate();
    const [bookmarked, setBookmarked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Check if recipe is bookmarked on component mount
    useEffect(() => {
        const checkBookmarkStatus = async () => {
            if (isAuthenticated() && user && recipe) {
                try {
                    const isBookmarked = await bookmarkApi.checkBookmark(user.user_id, recipe.recipe_id);
                    setBookmarked(isBookmarked);
                } catch (error) {
                    console.error('Error checking bookmark status:', error);
                }
            }
        };

        checkBookmarkStatus();
    }, [isAuthenticated, user, recipe]);

    const handleCardClick = () => {
        navigate(`/recipes/${recipe.recipe_id}`);
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this recipe?')) return;

        try {
            await recipeApi.deleteRecipe(recipe.recipe_id);
            setSnackbar({
                open: true,
                message: 'Recipe deleted successfully',
                severity: 'success',
            });
            // Optionally trigger a page reload or parent callback
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.message || 'Failed to delete recipe',
                severity: 'error',
            });
        }
    };


    const handleBookmarkClick = async (e) => {
        e.stopPropagation();

        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }

        try {
            setLoading(true);

            if (bookmarked) {
                await bookmarkApi.removeBookmark(user.user_id, recipe.recipe_id);
                setBookmarked(false);
                setSnackbar({
                    open: true,
                    message: 'Recipe removed from bookmarks',
                    severity: 'success'
                });
            } else {
                await bookmarkApi.addBookmark(user.user_id, recipe.recipe_id);
                setBookmarked(true);
                setSnackbar({
                    open: true,
                    message: 'Recipe added to bookmarks',
                    severity: 'success'
                });
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.message || 'Error updating bookmark',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({...snackbar, open: false});
    };

    // Get difficulty color
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

    // Format time from minutes to hours and minutes
    const formatTime = (minutes) => {
        if (!minutes) return 'N/A';

        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;

        if (hrs === 0) return `${mins} min`;
        if (mins === 0) return `${hrs} hr`;
        return `${hrs} hr ${mins} min`;
    };

    return (
        <>
            <Card
                sx={{
                    maxWidth: 345,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                        transform: 'scale(1.02)',
                    }
                }}
                onClick={handleCardClick}
                elevation={3}
            >
                <CardMedia
                    component="img"
                    height="140"
                    image={recipe.image_url || placeholderImage}
                    alt={recipe.title}
                />
                <CardContent sx={{flexGrow: 1}}>
                    <Typography gutterBottom variant="h6" component="div" noWrap>
                        {recipe.title}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 1.5,
                            height: {xs: '40px', sm: '60px'},
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical'
                        }}
                    >
                        {recipe.description}
                    </Typography>

                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1}}>
                        <Chip
                            label={recipe.skill_level}
                            size="small"
                            color={getDifficultyColor(recipe.skill_level)}
                        />
                        {recipe.source_platform && (
                            <Chip
                                label={recipe.source_platform}
                                size="small"
                                variant="outlined"
                            />
                        )}
                    </Box>

                    <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                        {recipe.prep_time && (
                            <Tooltip title="Prep Time">
                                <Box sx={{display: 'flex', alignItems: 'center'}}>
                                    <TimerIcon fontSize="small" sx={{mr: 0.5}}/>
                                    <Typography variant="body2">{formatTime(recipe.prep_time)}</Typography>
                                </Box>
                            </Tooltip>
                        )}

                        {recipe.cook_time && (
                            <Tooltip title="Cook Time">
                                <Box sx={{display: 'flex', alignItems: 'center'}}>
                                    <RestaurantIcon fontSize="small" sx={{mr: 0.5}}/>
                                    <Typography variant="body2">{formatTime(recipe.cook_time)}</Typography>
                                </Box>
                            </Tooltip>
                        )}
                    </Box>
                </CardContent>
                            
                <CardActions>
                    <Button
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/recipes/${recipe.recipe_id}`);
                        }}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'rgba(255, 87, 34, 0.08)'
                            }
                        }}
                    >
                        View Recipe
                    </Button>

                    <Box sx={{ml: 'auto'}}>
                        <IconButton
                            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark recipe'}
                            onClick={handleBookmarkClick}
                            color={bookmarked ? 'primary' : 'default'}
                            disabled={loading}
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 87, 34, 0.08)'
                                }
                            }}
                        >
                            {bookmarked ? <BookmarkIcon/> : <BookmarkBorderIcon/>}
                        </IconButton>
                        {(user?.role?.toLowerCase() === 'admin' || user?.user_id === recipe.creator_id) && (
                        <IconButton
                            aria-label="Delete recipe"
                            onClick={handleDelete}
                            color="error"
                            sx={{ 
                                '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' 

                                } 
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                        )}

                    </Box>
                </CardActions>
            </Card>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{width: '100%'}}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default RecipeCard;