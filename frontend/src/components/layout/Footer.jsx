import { Box, Container, Typography, Link, Grid } from '@mui/material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { useTheme } from '../../context/ThemeContext';
import logoImg from '../../assets/cook-atlas_logo.png';

const Footer = () => {
  const muiTheme = useMuiTheme();
  const { mode } = useTheme();
  
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: mode === 'dark' ? 'background.paper' : muiTheme.palette.grey[200],
        borderTop: '1px solid',
        borderColor: 'divider',
        width: '100%',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box
                component="img"
                src={logoImg}
                alt="CookAtlas Logo"
                sx={{ height: 30, mr: 1 }}
              />
              <Typography variant="h6" color="text.primary">
                CookAtlas
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Your one-stop platform for discovering recipes from across the web
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Link href="/" color="inherit" display="block">Home</Link>
            <Link href="/recipes" color="inherit" display="block">Browse Recipes</Link>
            <Link href="/meal-plans" color="inherit" display="block">Meal Plans</Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Legal
            </Typography>
            <Link href="#" color="inherit" display="block">Privacy Policy</Link>
            <Link href="#" color="inherit" display="block">Terms of Service</Link>
          </Grid>
        </Grid>
        <Box mt={3}>
          <Typography variant="body2" color="text.secondary" align="center">
            {'© '}
            {new Date().getFullYear()}
            {' CookAtlas - CS4604 Database Management Systems Project'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;