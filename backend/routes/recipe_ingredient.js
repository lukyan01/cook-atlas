const express = require("express");
const pool = require("../db");
const router = express.Router();

// GET /recipe_ingredient — list all recipe–ingredient mappings
router.get("/", async (req, res) => {
  console.log("🔍 GET /recipe_ingredient");
  try {
    const { rows } = await pool.query(
      "SELECT * FROM recipe_ingredient ORDER BY recipe_id, ingredient_id"
    );
    console.log(`✅ Fetched ${rows.length} mappings`);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching mappings:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /recipe_ingredient/:recipeId/:ingredientId — get one mapping
router.get("/:recipeId/:ingredientId", async (req, res) => {
  const { recipeId, ingredientId } = req.params;
  console.log(`🔍 GET /recipe_ingredient/${recipeId}/${ingredientId}`);
  try {
    const { rows } = await pool.query(
      "SELECT * FROM recipe_ingredient WHERE recipe_id = $1 AND ingredient_id = $2",
      [recipeId, ingredientId]
    );
    if (rows.length === 0) {
      console.warn(`⚠️ Mapping ${recipeId},${ingredientId} not found`);
      return res.status(404).json({ error: "Mapping not found" });
    }
    console.log(`✅ Fetched mapping ${recipeId},${ingredientId}`);
    res.json(rows[0]);
  } catch (err) {
    console.error(
      `❌ Error fetching mapping ${recipeId},${ingredientId}:`,
      err
    );
    res.status(500).json({ error: err.message });
  }
});

// POST /recipe_ingredient — create a new mapping
router.post("/", async (req, res) => {
  console.log("🔔 POST /recipe_ingredient payload:", req.body);
  const { recipe_id, ingredient_id } = req.body;
  try {
    await pool.query(
      "INSERT INTO recipe_ingredient (recipe_id, ingredient_id) VALUES ($1, $2)",
      [recipe_id, ingredient_id]
    );
    console.log(
      `✅ Mapping created for recipe ${recipe_id} and ingredient ${ingredient_id}`
    );
    res.sendStatus(201);
  } catch (err) {
    console.error("❌ Error creating mapping:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /recipe_ingredient/:recipeId/:ingredientId — delete a mapping
router.delete("/:recipeId/:ingredientId", async (req, res) => {
  const { recipeId, ingredientId } = req.params;
  console.log(`🗑️ DELETE /recipe_ingredient/${recipeId}/${ingredientId}`);
  try {
    const result = await pool.query(
      "DELETE FROM recipe_ingredient WHERE recipe_id = $1 AND ingredient_id = $2",
      [recipeId, ingredientId]
    );
    if (result.rowCount === 0) {
      console.warn(`⚠️ No mapping deleted for ${recipeId},${ingredientId}`);
      return res.status(404).json({ error: "Mapping not found" });
    }
    console.log(`✅ Mapping ${recipeId},${ingredientId} deleted`);
    res.sendStatus(204);
  } catch (err) {
    console.error(
      `❌ Error deleting mapping ${recipeId},${ingredientId}:`,
      err
    );
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
