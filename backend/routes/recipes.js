const express = require("express");
const pool = require("../db");
const router = express.Router();

// GET /recipes — list all recipes
router.get("/", async (req, res) => {
  console.log("🔍 GET /recipes");
  try {
    const { rows } = await pool.query(
      "SELECT * FROM recipes ORDER BY recipe_id"
    );
    console.log(`✅ Fetched ${rows.length} recipes`);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching recipes:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /recipes/search — search by query and tags
router.get("/search", async (req, res) => {
  console.log("🔍 GET /recipes/search payload:", req.query);
  const { query, tags } = req.query;
  try {
    let sql = "SELECT * FROM recipes WHERE 1=1";
    const params = [];
    let idx = 1;

    if (query) {
      sql += ` AND (title ILIKE $${idx} OR description ILIKE $${idx + 1})`;
      params.push(`%${query}%`, `%${query}%`);
      idx += 2;
    }

    if (tags) {
      const tagsArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      tagsArray.forEach((tag) => {
        sql += ` AND (description ILIKE $${idx} OR skill_level ILIKE $${idx} OR source_platform ILIKE $${idx})`;
        params.push(`%${tag}%`);
        idx++;
      });
    }

    sql += " ORDER BY recipe_id";
    console.log("📋 SQL:", sql, "Params:", params);

    const { rows } = await pool.query(sql, params);
    console.log(`✅ Search returned ${rows.length} recipes`);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error searching recipes:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /recipes — insert a new recipe
router.post("/", async (req, res) => {
  console.log("🔔 POST /recipes payload:", req.body);
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
    console.log("✅ Recipe inserted");
    res.sendStatus(201);
  } catch (err) {
    console.error("❌ Error inserting recipe:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /recipes/:id — update title & description
router.put("/:id", async (req, res) => {
  console.log(`✏️ PUT /recipes/${req.params.id} payload:`, req.body);
  const { title, description } = req.body;

  try {
    await pool.query(
      "UPDATE recipes SET title = $1, description = $2 WHERE recipe_id = $3",
      [title, description, req.params.id]
    );
    console.log("✅ Recipe updated");
    res.sendStatus(204);
  } catch (err) {
    console.error("❌ Error updating recipe:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /recipes/:id — delete a recipe
router.delete("/:id", async (req, res) => {
  console.log(`🗑️ DELETE /recipes/${req.params.id}`);
  try {
    await pool.query("DELETE FROM recipes WHERE recipe_id = $1", [
      req.params.id,
    ]);
    console.log("✅ Recipe deleted");
    res.sendStatus(204);
  } catch (err) {
    console.error("❌ Error deleting recipe:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
