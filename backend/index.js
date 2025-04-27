const express = require("express");
const app = express();
const pool = require("./db");
require("dotenv").config();

// Enable CORS
const cors = require("cors");
app.use(cors());

const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// === ROUTES ===

// Get all recipes
app.get("/recipes", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM recipes ORDER BY recipe_id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Fetch failed:", err);
    // sends the real error message back so you can see it in the browser/network tab
    res.status(500).send("Failed to fetch recipes: " + err.message);
  }
});

app.get('/search', async (req, res) => {
  const { query, tags } = req.query;
  
  try {
    let sql = 'SELECT * FROM recipes WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (query) {
      sql += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex + 1})`;
      params.push(`%${query}%`, `%${query}%`);
      paramIndex += 2;
    }

    if (tags) {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      if (tagsArray.length > 0) {
        tagsArray.forEach((tag) => {
          sql += ` AND (
            description ILIKE $${paramIndex} 
            OR skill_level ILIKE $${paramIndex} 
            OR source_platform ILIKE $${paramIndex}
          )`;
          params.push(`%${tag}%`);
          paramIndex += 1;
        });
      }
    }

    sql += ' ORDER BY recipe_id ASC';
    const result = await pool.query(sql, params);
    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).send('Search failed: ' + err.message);
  }
});




// Insert recipe
app.post("/insert", async (req, res) => {
  console.log("🔔 Insert payload:", req.body);
  const {
    creator_id,
    title,
    description,
    cook_time,
    prep_time,
    skill_level,
    source_platform,
    source_url,
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO recipes (
        creator_id, title, description, cook_time, prep_time, skill_level, source_platform, source_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        creator_id,
        title,
        description,
        cook_time,
        prep_time,
        skill_level,
        source_platform,
        source_url,
      ]
    );
    console.log("✅ Insert succeeded");
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Insert failed:", err);
    res.status(500).send("Insert failed: " + err.message);
  }
});

// Delete recipe
app.post("/delete", async (req, res) => {
  const { recipe_id } = req.body;
  try {
    await pool.query("DELETE FROM recipes WHERE recipe_id = $1", [recipe_id]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send("Delete failed: " + err.message);
  }
});

// Update recipe (only title + description for now)
app.post("/update", async (req, res) => {
  const { recipe_id, title, description } = req.body;
  try {
    await pool.query(
      "UPDATE recipes SET title = $1, description = $2 WHERE recipe_id = $3",
      [title, description, recipe_id]
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send("Update failed: " + err.message);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend server running at http://localhost:${PORT}`);
});
