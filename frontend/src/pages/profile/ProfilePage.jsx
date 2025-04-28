import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Grid,
  Avatar,
  TextField,
  Divider,
  Alert,
  CircularProgress,
  Container,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Bookmark as BookmarkIcon,
  Restaurant as RestaurantIcon,
  Event as EventIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import RecipeList from '../../components/recipes/RecipeList';
import { bookmarkApi, userApi } from '../../services/api';

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [bookmarksLoading, setBookmarksLoading] = useState(true);
  const [bookmarkError, setBookmarkError] = useState(null);
  const [profileData, setProfileData] = useState({
    name: user?.username || '',
    email: user?.email || '',
    bio: 'Food enthusiast and home cook',
    dietaryPreferences: 'Vegetarian, Dairy-free',
    favoriteIngredients: 'Garlic, Olive oil, Fresh herbs',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);
  const [createdRecipes, setCreatedRecipes] = useState([]);

  // Fetch user's bookmarks
  useEffect(() => {
    const fetchUserBookmarks = async () => {
      if (!user) return;
      
      try {
        setBookmarksLoading(true);
        setBookmarkError(null);
        const bookmarks = await bookmarkApi.getBookmarks(user.user_id);
        setBookmarkedRecipes(bookmarks);
      } catch (err) {
        console.error('Error fetching bookmarks:', err);
        setBookmarkError('Failed to load bookmarks. Please try again later.');
      } finally {
        setBookmarksLoading(false);
      }
    };

    fetchUserBookmarks();
  }, [user]);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        setProfileLoading(true);
        const profile = await userApi.getProfile(user.user_id);
        
        setProfileData(prevData => ({
          ...prevData,
          name: profile.username || '',
          email: profile.email || '',
        }));
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleEditProfile = () => {
    setEditMode(true);
    setError('');
    setSuccess('');
  };

  const handleCancelEdit = () => {
    // Reset form to original data
    setProfileData({
      name: user?.username || '',
      email: user?.email || '',
      bio: 'Food enthusiast and home cook',
      dietaryPreferences: 'Vegetarian, Dairy-free',
      favoriteIngredients: 'Garlic, Olive oil, Fresh herbs',
    });
    setEditMode(false);
    setError('');
    setSuccess('');
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    
    try {
      // Update profile through API
      await userApi.updateProfile(user.user_id, {
        username: profileData.name,
        email: profileData.email,
      });
      
      setSuccess('Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      setError('Failed to update profile: ' + (err.message || 'Unknown error'));
      console.error('Update profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  // If user isn't authenticated, redirect to login
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Box>
      {profileLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper 
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            mb: 3,
            borderRadius: 2,
            boxShadow: 3
          }}
        >
          <Grid container spacing={3}>
            <Grid 
              item 
              xs={12} 
              md={3} 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: { xs: 'center', md: 'flex-start' } 
              }}
            >
              <Avatar
                sx={{
                  width: { xs: 80, sm: 120 },
                  height: { xs: 80, sm: 120 },
                  mb: 2,
                  fontSize: { xs: '2rem', sm: '3rem' },
                  bgcolor: 'primary.main',
                }}
              >
                {profileData.name.charAt(0).toUpperCase()}
              </Avatar>
              {!editMode && (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleEditProfile}
                  sx={{ width: { xs: '100%', md: 'auto' } }}
                >
                  Edit Profile
                </Button>
              )}
            </Grid>

            <Grid item xs={12} md={9}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              
              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              )}

              {editMode ? (
                <Box component="form">
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Bio"
                        name="bio"
                        multiline
                        rows={3}
                        value={profileData.bio}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Dietary Preferences"
                        name="dietaryPreferences"
                        value={profileData.dietaryPreferences}
                        onChange={handleInputChange}
                        helperText="Separate multiple preferences with commas"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Favorite Ingredients"
                        name="favoriteIngredients"
                        value={profileData.favoriteIngredients}
                        onChange={handleInputChange}
                        helperText="Separate multiple ingredients with commas"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                          onClick={handleSaveProfile}
                          disabled={loading}
                        >
                          Save Changes
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              ) : (
                <Box>
                  <Typography 
                    variant={isMobile ? "h5" : "h4"} 
                    gutterBottom
                    sx={{ fontWeight: 500 }}
                  >
                    {profileData.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    {profileData.email}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Bio
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {profileData.bio}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Dietary Preferences
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {profileData.dietaryPreferences}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Favorite Ingredients
                  </Typography>
                  <Typography variant="body1">
                    {profileData.favoriteIngredients}
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </Paper>
      )}

      <Box sx={{ mb: 2 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: { xs: '0.875rem', sm: '1rem' },
            }
          }}
        >
          <Tab icon={<BookmarkIcon />} label="Bookmarked Recipes" id="tab-0" aria-controls="tabpanel-0" />
          <Tab icon={<RestaurantIcon />} label="My Recipes" id="tab-1" aria-controls="tabpanel-1" />
          <Tab icon={<EventIcon />} label="Meal Plans" id="tab-2" aria-controls="tabpanel-2" />
          <Tab icon={<ShoppingCartIcon />} label="Shopping Lists" id="tab-3" aria-controls="tabpanel-3" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <div
        role="tabpanel"
        hidden={activeTab !== 0}
        id="tabpanel-0"
        aria-labelledby="tab-0"
      >
        {activeTab === 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Bookmarked Recipes
              </Typography>
              <Button onClick={() => navigate('/recipes')}>Browse Recipes</Button>
            </Box>
            
            {bookmarksLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : bookmarkError ? (
              <Alert severity="error" sx={{ mb: 3 }}>
                {bookmarkError}
              </Alert>
            ) : bookmarkedRecipes.length > 0 ? (
              <RecipeList recipes={bookmarkedRecipes} />
            ) : (
              <Paper 
                sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  borderRadius: 2
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  You haven't bookmarked any recipes yet.
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/recipes')}
                >
                  Browse Recipes
                </Button>
              </Paper>
            )}
          </Box>
        )}
      </div>

      <div
        role="tabpanel"
        hidden={activeTab !== 1}
        id="tabpanel-1"
        aria-labelledby="tab-1"
      >
        {activeTab === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                My Recipes
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate('/recipes/new')}
              >
                Add New Recipe
              </Button>
            </Box>
            {createdRecipes.length > 0 ? (
              <RecipeList recipes={createdRecipes} />
            ) : (
              <Paper 
                sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  borderRadius: 2 
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  You haven't created any recipes yet.
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/recipes/new')}
                >
                  Create Recipe
                </Button>
              </Paper>
            )}
          </Box>
        )}
      </div>

      <div
        role="tabpanel"
        hidden={activeTab !== 2}
        id="tabpanel-2"
        aria-labelledby="tab-2"
      >
        {activeTab === 2 && (
          <Paper 
            sx={{ 
              p: 3, 
              textAlign: 'center',
              borderRadius: 2
            }}
          >
            <Typography variant="body1" color="text.secondary">
              You don't have any meal plans yet.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              This feature is coming soon!
            </Typography>
            <Button 
              variant="contained" 
              sx={{ mt: 1 }}
              disabled
            >
              Create Meal Plan
            </Button>
          </Paper>
        )}
      </div>

      <div
        role="tabpanel"
        hidden={activeTab !== 3}
        id="tabpanel-3"
        aria-labelledby="tab-3"
      >
        {activeTab === 3 && (
          <Paper 
            sx={{ 
              p: 3, 
              textAlign: 'center',
              borderRadius: 2
            }}
          >
            <Typography variant="body1" color="text.secondary">
              You don't have any shopping lists yet.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              This feature is coming soon!
            </Typography>
            <Button 
              variant="contained" 
              sx={{ mt: 1 }}
              disabled
            >
              Create Shopping List
            </Button>
          </Paper>
        )}
      </div>
    </Box>
  );
};

export default ProfilePage;