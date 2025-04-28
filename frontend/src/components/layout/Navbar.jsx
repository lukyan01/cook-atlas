import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  InputBase,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Tooltip,
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Search as SearchIcon, 
  AccountCircle, 
  Home, 
  Restaurant, 
  BookmarkBorder,
  Event, 
  ShoppingCart,
  Person,
  Login,
  Logout,
  LightMode,
  DarkMode,
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import logoImg from '../../assets/cook-atlas_logo.png';

// Styled search input
const SearchInput = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  marginRight: theme.spacing(2),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/recipes/search?query=${searchQuery}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const mainNavItems = [
    { text: 'Home', icon: <Home />, link: '/' },
    { text: 'Recipes', icon: <Restaurant />, link: '/recipes' },
    { text: 'Meal Plans', icon: <Event />, link: '/meal-plans' },
    { text: 'Shopping Lists', icon: <ShoppingCart />, link: '/shopping-lists' },
  ];

  const drawer = (
    <Box sx={{ width: 250 }} onClick={handleDrawerToggle}>
      <Box sx={{ display: 'flex', alignItems: 'center', my: 2, mx: 2 }}>
        <Box
          component="img"
          src={logoImg}
          alt="CookAtlas Logo"
          sx={{ height: 40, mr: 1 }}
        />
        <Typography variant="h6">
          CookAtlas
        </Typography>
      </Box>
      <Divider />
      <List>
        {mainNavItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={RouterLink} to={item.link}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {isAuthenticated() ? (
          <>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/profile">
                <ListItemIcon><Person /></ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/bookmarks">
                <ListItemIcon><BookmarkBorder /></ListItemIcon>
                <ListItemText primary="Bookmarks" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon><Logout /></ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to="/login">
              <ListItemIcon><Login /></ListItemIcon>
              <ListItemText primary="Login / Register" />
            </ListItemButton>
          </ListItem>
        )}
        <Divider />
        <ListItem disablePadding>
          <ListItemButton onClick={toggleTheme}>
            <ListItemIcon>{mode === 'dark' ? <LightMode /> : <DarkMode />}</ListItemIcon>
            <ListItemText primary={`Switch to ${mode === 'dark' ? 'Light' : 'Dark'} Mode`} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Mobile menu icon */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo */}
            <Box 
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                textDecoration: 'none',
              }}
            >
              <Box
                component="img"
                src={logoImg}
                alt="CookAtlas Logo"
                sx={{
                  height: 40,
                  mr: 1,
                }}
              />
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontWeight: 700,
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                CookAtlas
              </Typography>
            </Box>

            {/* Desktop navigation */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {mainNavItems.map((item) => (
                <Button
                  key={item.text}
                  component={RouterLink}
                  to={item.link}
                  sx={{ color: 'white', display: 'block', mx: 1 }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>

            {/* Search */}
            <SearchInput>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search recipes…"
                inputProps={{ 'aria-label': 'search' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
            </SearchInput>

            {/* Theme Toggle */}
            <Box sx={{ mr: 1 }}>
              <Tooltip title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                <IconButton color="inherit" onClick={toggleTheme}>
                  {mode === 'dark' ? <LightMode /> : <DarkMode />}
                </IconButton>
              </Tooltip>
            </Box>

            {/* User menu */}
            {isAuthenticated() ? (
              <Box sx={{ display: 'flex' }}>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem component={RouterLink} to="/profile" onClick={handleMenuClose}>
                    Profile
                  </MenuItem>
                  <MenuItem component={RouterLink} to="/bookmarks" onClick={handleMenuClose}>
                    Bookmarks
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button color="inherit" component={RouterLink} to="/login">
                Login
              </Button>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;