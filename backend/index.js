require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./db");

// Routers
const recipesRouter = require("./routes/recipes");
const usersRouter = require("./routes/users");
const tagRouter = require("./routes/tag");
const ingredientRouter = require("./routes/ingredient");
const engagementRouter = require("./routes/engagement");
const ratingRouter = require("./routes/rating");
const bookmarkRouter = require("./routes/bookmark");
const shoppingListRouter = require("./routes/shopping_list");
const shoppingListIngredientRouter = require("./routes/shopping_list_ingredient");
const recipeTagRouter = require("./routes/recipe_tag");
const recipeIngredientRouter = require("./routes/recipe_ingredient");
const mealPlanRouter = require("./routes/meal_plan");
const mealPlanRecipeRouter = require("./routes/meal_plan_recipe");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes
app.use("/recipes", recipesRouter);
app.use("/users", usersRouter);
app.use("/tag", tagRouter);
app.use("/ingredient", ingredientRouter);
app.use("/engagement", engagementRouter);
app.use("/rating", ratingRouter);
app.use("/bookmark", bookmarkRouter);
app.use("/shopping_list", shoppingListRouter);
app.use("/shopping_list_ingredient", shoppingListIngredientRouter);
app.use("/recipe_tag", recipeTagRouter);
app.use("/recipe_ingredient", recipeIngredientRouter);
app.use("/meal_plan", mealPlanRouter);
app.use("/meal_plan_recipe", mealPlanRecipeRouter);

// start backend server
defaultPort = 3000;
const PORT = process.env.PORT || defaultPort;
app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
});
