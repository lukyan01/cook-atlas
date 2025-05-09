import React, { useEffect, useState } from "react";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { userApi, recipeApi, bookmarkApi } from "../../services/api";

const COLORS = ["#8884d8", "#8dd1e1", "#82ca9d"];

const StatsPage = () => {
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [chartType, setChartType] = useState("recipeDifficulty");

  // Handler to fetch users
  const handleFetchUsers = async () => {
    try {
      const data = await userApi.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Handler to fetch recipes
  const handleFetchRecipes = async () => {
    try {
      const data = await recipeApi.getRecipes();
      setRecipes(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const handleFetchBookmarks = async () => {
    try {
      const data = await bookmarkApi.getAllBookmarks();
      setBookmarks(data);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  };

  // Handler to delete a user by id
  const handleDeleteUser = async (id) => {
    try {
      await userApi.deleteUser(id);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Calculate recipe difficulty distribution for the pie chart\

  const handleDifficultyDistribution = () => {
    const distribution = { Beginner: 0, Intermediate: 0, Advanced: 0 };
    recipes.forEach((recipe) => {
      if (
        recipe.skill_level &&
        Object.prototype.hasOwnProperty.call(distribution, recipe.skill_level)
      ) {
        distribution[recipe.skill_level] += 1;
      }
    });
    return Object.keys(distribution).map((key) => ({
      name: key,
      count: distribution[key],
    }));
  };

  // Calculate total time distribution (preptime + cooktime)

  const handleTotalTimeDistribution = () => {
    const bins = {
      "Under 30": 0,
      "30-60": 0,
      "60-90": 0,
      "90-120": 0,
      "Over 120": 0,
    };
    recipes.forEach((recipe) => {
      const prep = recipe.prep_time || 0;
      const cook = recipe.cook_time || 0;
      const total = prep + cook;
      if (total < 30) {
        bins["Under 30"] += 1;
      } else if (total < 60) {
        bins["30-60"] += 1;
      } else if (total < 90) {
        bins["60-90"] += 1;
      } else if (total < 120) {
        bins["90-120"] += 1;
      } else {
        bins["Over 120"] += 1;
      }
    });
    return Object.keys(bins).map((key) => ({
      name: key,
      count: bins[key],
    }));
  };

  const handleChartTypeChange = (event) => {
    setChartType(event.target.value);
  };

  useEffect(() => {
    handleFetchUsers();
  }, []);

  useEffect(() => {
    handleFetchRecipes();
  }, []);

  useEffect(() => {
    handleFetchBookmarks();
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Admin Statistics Dashboard
      </Typography>

      {/* Dropdown menu */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <FormControl sx={{ width: "50%" }}>
          <InputLabel id="chart-select-label">Chart Type</InputLabel>
          <Select
            labelId="chart-select-label"
            id="chart-select"
            value={chartType}
            label="Chart Type"
            onChange={handleChartTypeChange}
          >
            <MenuItem value={"generalStats"}>General Stats</MenuItem>
            <MenuItem value={"recipeDifficulty"}>
              Recipe Skill Level Distribution
            </MenuItem>
            <MenuItem value={"totalTimeDistribution"}>
              Cook and Prep Time Distribution
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* flex container for list and chart/stats */}
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "space-evenly",
          gap: "3rem",
          alignItems: "flex-start",
        }}
      >
        {/* User List */}
        <Paper
          sx={{
            width: "50%",
            minWidth: 600,
            height: 600,
            overflowY: "auto",
            padding: "1rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Users
            </Typography>
            <Typography variant="subtitle1">
              {users.length} users found
            </Typography>
          </Box>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Button
                      color="error"
                      onClick={() => handleDeleteUser(user.id)}
                      size="small"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        {/* Chart/Stats Box */}
        <Paper
          sx={{
            width: "50%",
            minWidth: 600,
            height: 600,
            overflowY: "visible",
            padding: "1rem",
          }}
        >
          {chartType === "recipeDifficulty" && (
            <>
              <Typography variant="h6" gutterBottom>
                Recipe Difficulty Distribution
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={handleDifficultyDistribution()}
                    cx="50%"
                    cy="50%"
                    outerRadius={200}
                    dataKey="count"
                  >
                    {handleDifficultyDistribution().map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} Recipes`, name]}
                  />
                  <Legend
                    verticalAlign="top"
                    align="center"
                    wrapperStyle={{ top: 10 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </>
          )}

          {chartType === "totalTimeDistribution" && (
            <>
              <Typography variant="h6" gutterBottom>
                Total Time Distribution
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={handleTotalTimeDistribution()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend
                    verticalAlign="top"
                    align="center"
                    wrapperStyle={{ top: 10, padding: 20 }}
                  />
                  <Bar dataKey="count" fill="#82ca9d" name="Recipe Count" />
                </BarChart>
              </ResponsiveContainer>
            </>
          )}
          {chartType === "generalStats" && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                p: 2,
              }}
            >
              <Typography variant="h4" gutterBottom>
                General Stats
              </Typography>
              <Typography variant="h5" sx={{ mt: 2 }}>
                Total Users: {users.length}
              </Typography>
              <Typography variant="h5" sx={{ mt: 2 }}>
                Total Recipes: {recipes.length}
              </Typography>
              <Typography variant="h5" sx={{ mt: 2 }}>
                Total Bookmarks: {bookmarks.length}
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </div>
  );
};

export default StatsPage;
