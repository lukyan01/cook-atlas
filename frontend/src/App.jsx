import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import PageContainer from './components/layout/PageContainer';

// Pages
import HomePage from './pages/home/HomePage';
import RecipesPage from './pages/recipes/RecipesPage';
import RecipeDetailPage from './pages/recipes/RecipeDetailPage';
import NewRecipePage from './pages/recipes/NewRecipePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/profile/ProfilePage';

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#ff5722', // Deep orange
    },
    secondary: {
      main: '#4caf50', // Green
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
    },
    h2: {
      fontWeight: 500,
    },
    h3: {
      fontWeight: 500,
    },
    h4: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingTop: '1rem',
          paddingBottom: '1rem',
          flex: 1,
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: `
        html, body, #root {
          height: 100%;
          width: 100%;
        }
        #root {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
      `,
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // If still loading auth state, return null
  if (loading) return null;

  // If not authenticated, redirect to login
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  // If authenticated, render children
  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Home */}
            <Route path="/" element={
              <PageContainer>
                <HomePage />
              </PageContainer>
            } />

            <Route path="/recipes/search" element={
              <PageContainer>
                <RecipesPage />
              </PageContainer>
            } />
            
            <Route path="/recipes/new" element={
              <ProtectedRoute>
                <PageContainer>
                  <NewRecipePage />
                </PageContainer>
              </ProtectedRoute>
            } />
            
            <Route path="/recipes/:recipeId" element={
              <PageContainer>
                <RecipeDetailPage />
              </PageContainer>
            } />
            
            <Route path="/recipes" element={
              <PageContainer>
                <RecipesPage />
              </PageContainer>
            } />
            
            {/* Auth Routes */}
            <Route path="/login" element={
              <PageContainer maxWidth="sm">
                <LoginPage />
              </PageContainer>
            } />
            
            <Route path="/register" element={
              <PageContainer maxWidth="sm">
                <RegisterPage />
              </PageContainer>
            } />
            
            {/* Profile Routes */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <PageContainer>
                  <ProfilePage />
                </PageContainer>
              </ProtectedRoute>
            } />
            
            <Route path="/bookmarks" element={
              <ProtectedRoute>
                <PageContainer>
                  <ProfilePage />
                </PageContainer>
              </ProtectedRoute>
            } />
            
            {/* Placeholder routes for future features */}
            <Route path="/meal-plans" element={
              <PageContainer>
                <div>
                  <h2>Meal Plans</h2>
                  <p>This feature is coming soon!</p>
                </div>
              </PageContainer>
            } />
            
            <Route path="/shopping-lists" element={
              <PageContainer>
                <div>
                  <h2>Shopping Lists</h2>
                  <p>This feature is coming soon!</p>
                </div>
              </PageContainer>
            } />
            
            {/* Fallback route */}
            <Route path="*" element={
              <PageContainer>
                <div>
                  <h2>404 Page Not Found</h2>
                  <p>The page you're looking for doesn't exist.</p>
                </div>
              </PageContainer>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;