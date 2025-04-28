import { Box, Container, Typography, Link, Grid } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[200],
        borderTop: '1px solid',
        borderColor: 'divider',
        width: '100%',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              CookAtlas
            </Typography>
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