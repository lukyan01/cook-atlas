import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Recipe API functions
export const recipeApi = {
  // Get all recipes
  getRecipes: async () => {
    try {
      const response = await api.get("/recipes");
      return response.data;
    } catch (error) {
      console.error("Error fetching recipes:", error);
      throw error;
    }
  },

  // Get recipe by ID
  getRecipeById: async (id) => {
    try {
      const response = await api.get(`/recipes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching recipe #${id}:`, error);
      throw error;
    }
  },

  // Get recipes by user ID
  getUserRecipes: async (userId) => {
    try {
      const response = await api.get(`/recipes/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching recipes for user #${userId}:`, error);
      throw error;
    }
  },

  // Search recipes with filters
  searchRecipes: async (params) => {
    try {
      const response = await api.get("/search", { params });
      return response.data;
    } catch (error) {
      console.error("Error searching recipes:", error);
      throw error;
    }
  },

  // Add new recipe
  addRecipe: async (recipeData) => {
    try {
      const response = await api.post("/recipes", recipeData);
      return response.data;
    } catch (error) {
      console.error("Error adding recipe:", error);
      throw error;
    }
  },

  // Update recipe
  updateRecipe: async (id, recipeData) => {
    try {
      const response = await api.put(`/recipes/${id}`, recipeData);
      return response.data;
    } catch (error) {
      console.error(`Error updating recipe #${id}:`, error);
      throw error;
    }
  },

  // Delete recipe
  deleteRecipe: async (id) => {
    try {
      const response = await api.delete(`/recipes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting recipe #${id}:`, error);
      throw error;
    }
  },

  // For backward compatibility
  legacyAddRecipe: async (recipeData) => {
    try {
      const response = await api.post("/insert", recipeData);
      return response.data;
    } catch (error) {
      console.error("Error adding recipe (legacy):", error);
      throw error;
    }
  },

  legacyUpdateRecipe: async (id, title, description) => {
    try {
      const response = await api.post("/update", {
        recipe_id: id,
        title,
        description,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating recipe (legacy):", error);
      throw error;
    }
  },

  legacyDeleteRecipe: async (id) => {
    try {
      const response = await api.post("/delete", { recipe_id: id });
      return response.data;
    } catch (error) {
      console.error("Error deleting recipe (legacy):", error);
      throw error;
    }
  },
};

// User API functions
export const userApi = {
    // Register user
    register: async (userData) => {
        try {
            const response = await api.post('/users/auth/register', userData);
            return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error.response?.data || error;
        }
    },

    // Login user
    login: async (credentials) => {
        try {
            const response = await api.post('/users/auth/login', credentials);
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error.response?.data || error;
        }
    },

  // Get user profile
  getProfile: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (userId, profileData) => {
    try {
      const response = await api.put(`/users/${userId}`, profileData);
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  // Request password reset link
    requestPasswordReset: async (email) => {
        try {
            const response = await api.post('/users/auth/forgot-password', { email });
            return response.data;
        } catch (error) {
            console.error('Password reset request error:', error);
            throw error.response?.data || error;
        }
    },

    // Reset password with token
    resetPasswordWithToken: async (token, newPassword) => {
        try {
            const response = await api.post('/users/auth/reset-password', {
                token,
                newPassword
            });
            return response.data;
        } catch (error) {
            console.error('Password reset error:', error);
            throw error.response?.data || error;
        }
    },

  // Get all users (For Admin's StatsPage)
  getAllUsers: async () => {
    const response = await api.get("/users");
    return response.data;
  },

  // Delete user (For Admin's StatsPage)
  deleteUser: async (id) => {
    await api.delete(`/users/${id}`);
  },
};

// Bookmark API functions
export const bookmarkApi = {
  // Get user's bookmarks
  getBookmarks: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/bookmarks`);
      return response.data;
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      throw error;
    }
  },

  // Add bookmark
  addBookmark: async (userId, recipeId) => {
    try {
      const response = await api.post("/bookmarks", {
        user_id: userId,
        recipe_id: recipeId,
      });
      return response.data;
    } catch (error) {
      console.error("Error adding bookmark:", error);
      throw error;
    }
  },

  // Check if a recipe is bookmarked
  checkBookmark: async (userId, recipeId) => {
    try {
      const response = await api.get("/bookmarks/check", {
        params: {
          user_id: userId,
          recipe_id: recipeId,
        },
      });
      return response.data.bookmarked;
    } catch (error) {
      console.error("Error checking bookmark:", error);
      throw error;
    }
  },

  // Remove bookmark
  removeBookmark: async (userId, recipeId) => {
    try {
      const response = await api.delete("/bookmarks", {
        params: {
          user_id: userId,
          recipe_id: recipeId,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error removing bookmark:", error);
      throw error;
    }
  },

  // Get all bookmarks (For Admin's StatsPage)
  getAllBookmarks: async () => {
    const response = await api.get("/bookmarks");
    return response.data;
  },
};

// Meal Plan API functions (to be implemented when backend supports them)
export const mealPlanApi = {
  // Mock function for now
  getMealPlans: async () => {
    return []; // Will implement when backend is ready
  },
};

export default api;
