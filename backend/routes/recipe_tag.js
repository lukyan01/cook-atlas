const express = require("express");
const pool = require("../db");
const router = express.Router();

// GET /recipe_tag — list all recipe–tag mappings
router.get("/", async (req, res) => {
  console.log("🔍 GET /recipe_tag");
  try {
    const { rows } = await pool.query(
      "SELECT * FROM recipe_tag ORDER BY recipe_id, tag_id"
    );
    console.log(`✅ Fetched ${rows.length} mappings`);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching mappings:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /recipe_tag/:recipeId/:tagId — get a single mapping
router.get("/:recipeId/:tagId", async (req, res) => {
  const { recipeId, tagId } = req.params;
  console.log(`🔍 GET /recipe_tag/${recipeId}/${tagId}`);
  try {
    const { rows } = await pool.query(
      "SELECT * FROM recipe_tag WHERE recipe_id = $1 AND tag_id = $2",
      [recipeId, tagId]
    );
    if (rows.length === 0) {
      console.warn(`⚠️ Mapping ${recipeId},${tagId} not found`);
      return res.status(404).json({ error: "Mapping not found" });
    }
    console.log(`✅ Fetched mapping ${recipeId},${tagId}`);
    res.json(rows[0]);
  } catch (err) {
    console.error(`❌ Error fetching mapping ${recipeId},${tagId}:`, err);
    res.status(500).json({ error: err.message });
  }
});

// POST /recipe_tag — create a new mapping
router.post("/", async (req, res) => {
  console.log("🔔 POST /recipe_tag payload:", req.body);
  const { recipe_id, tag_id } = req.body;
  try {
    await pool.query(
      "INSERT INTO recipe_tag (recipe_id, tag_id) VALUES ($1, $2)",
      [recipe_id, tag_id]
    );
    console.log(`✅ Mapping created for recipe ${recipe_id} and tag ${tag_id}`);
    res.sendStatus(201);
  } catch (err) {
    console.error("❌ Error creating mapping:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /recipe_tag/:recipeId/:tagId — delete a mapping
router.delete("/:recipeId/:tagId", async (req, res) => {
  const { recipeId, tagId } = req.params;
  console.log(`🗑️ DELETE /recipe_tag/${recipeId}/${tagId}`);
  try {
    const result = await pool.query(
      "DELETE FROM recipe_tag WHERE recipe_id = $1 AND tag_id = $2",
      [recipeId, tagId]
    );
    if (result.rowCount === 0) {
      console.warn(`⚠️ No mapping deleted for ${recipeId},${tagId}`);
      return res.status(404).json({ error: "Mapping not found" });
    }
    console.log(`✅ Mapping ${recipeId},${tagId} deleted`);
    res.sendStatus(204);
  } catch (err) {
    console.error(`❌ Error deleting mapping ${recipeId},${tagId}:`, err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
