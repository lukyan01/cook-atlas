import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { AuthProvider, useAuth } from "./context/AuthContext";
import {
  ThemeProvider as CustomThemeProvider,
  useTheme,
} from "./context/ThemeContext";
import PageContainer from "./components/layout/PageContainer";

// Pages
import HomePage from "./pages/home/HomePage";
import RecipesPage from "./pages/recipes/RecipesPage";
import RecipeDetailPage from "./pages/recipes/RecipeDetailPage";
import NewRecipePage from "./pages/recipes/NewRecipePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProfilePage from "./pages/profile/ProfilePage";
import StatsPage from "./pages/stats/StatsPage";
import AdminRoute from "./components/AdminRoute";

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

function AppContent() {
  const { theme } = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Home */}
          <Route
            path="/"
            element={
              <PageContainer>
                <HomePage />
              </PageContainer>
            }
          />

          <Route
            path="/recipes/search"
            element={
              <PageContainer>
                <RecipesPage />
              </PageContainer>
            }
          />

          <Route
            path="/recipes/new"
            element={
              <ProtectedRoute>
                <PageContainer>
                  <NewRecipePage />
                </PageContainer>
              </ProtectedRoute>
            }
          />

          <Route
            path="/recipes/:recipeId"
            element={
              <PageContainer>
                <RecipeDetailPage />
              </PageContainer>
            }
          />

          <Route
            path="/recipes"
            element={
              <PageContainer>
                <RecipesPage />
              </PageContainer>
            }
          />

          {/* Auth Routes */}
          <Route
            path="/login"
            element={
              <PageContainer maxWidth="sm">
                <LoginPage />
              </PageContainer>
            }
          />

          <Route
            path="/register"
            element={
              <PageContainer maxWidth="sm">
                <RegisterPage />
              </PageContainer>
            }
          />

          {/* Profile Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <PageContainer>
                  <ProfilePage />
                </PageContainer>
              </ProtectedRoute>
            }
          />

          <Route
            path="/bookmarks"
            element={
              <ProtectedRoute>
                <PageContainer>
                  <ProfilePage />
                </PageContainer>
              </ProtectedRoute>
            }
          />

          <Route
            path="/stats"
            element={
              <AdminRoute>
                <PageContainer>
                  <StatsPage />
                </PageContainer>
              </AdminRoute>
            }
          />

          {/* Placeholder routes for future features */}
          <Route
            path="/meal-plans"
            element={
              <PageContainer>
                <div>
                  <h2>Meal Plans</h2>
                  <p>This feature is coming soon!</p>
                </div>
              </PageContainer>
            }
          />

          <Route
            path="/shopping-lists"
            element={
              <PageContainer>
                <div>
                  <h2>Shopping Lists</h2>
                  <p>This feature is coming soon!</p>
                </div>
              </PageContainer>
            }
          />

          {/* Fallback route */}
          <Route
            path="*"
            element={
              <PageContainer>
                <div>
                  <h2>404 Page Not Found</h2>
                  <p>The page you're looking for doesn't exist.</p>
                </div>
              </PageContainer>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

function App() {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </CustomThemeProvider>
  );
}

export default App;
