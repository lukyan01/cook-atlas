import { Box, Container } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';

const PageContainer = ({ children, maxWidth = 'lg' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      <Navbar />
      <Container 
        component="main" 
        maxWidth={maxWidth} 
        sx={{ 
          mt: { xs: 2, md: 4 }, 
          mb: { xs: 2, md: 4 },
          px: { xs: 2, sm: 3 },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ flex: 1 }}>
          {children}
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default PageContainer;