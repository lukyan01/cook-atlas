const express = require("express");
const pool = require("../db");
const router = express.Router();

// GET /meal_plan_recipe — list all plan–recipe mappings
router.get("/", async (req, res) => {
  console.log("🔍 GET /meal_plan_recipe");
  try {
    const { rows } = await pool.query(
      "SELECT * FROM meal_plan_recipe ORDER BY meal_plan_id, recipe_id"
    );
    console.log(`✅ Fetched ${rows.length} mappings`);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching mappings:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /meal_plan_recipe/:planId/:recipeId — get a single mapping
router.get("/:planId/:recipeId", async (req, res) => {
  const { planId, recipeId } = req.params;
  console.log(`🔍 GET /meal_plan_recipe/${planId}/${recipeId}`);
  try {
    const { rows } = await pool.query(
      "SELECT * FROM meal_plan_recipe WHERE meal_plan_id = $1 AND recipe_id = $2",
      [planId, recipeId]
    );
    if (rows.length === 0) {
      console.warn(`⚠️ Mapping ${planId},${recipeId} not found`);
      return res.status(404).json({ error: "Mapping not found" });
    }
    console.log(`✅ Fetched mapping ${planId},${recipeId}`);
    res.json(rows[0]);
  } catch (err) {
    console.error(`❌ Error fetching mapping ${planId},${recipeId}:`, err);
    res.status(500).json({ error: err.message });
  }
});

// POST /meal_plan_recipe — create a new mapping
router.post("/", async (req, res) => {
  console.log("🔔 POST /meal_plan_recipe payload:", req.body);
  const { meal_plan_id, recipe_id } = req.body;
  try {
    await pool.query(
      "INSERT INTO meal_plan_recipe (meal_plan_id, recipe_id) VALUES ($1, $2)",
      [meal_plan_id, recipe_id]
    );
    console.log(
      `✅ Mapping created for meal plan ${meal_plan_id} and recipe ${recipe_id}`
    );
    res.sendStatus(201);
  } catch (err) {
    console.error("❌ Error creating mapping:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /meal_plan_recipe/:planId/:recipeId — delete a mapping
router.delete("/:planId/:recipeId", async (req, res) => {
  const { planId, recipeId } = req.params;
  console.log(`🗑️ DELETE /meal_plan_recipe/${planId}/${recipeId}`);
  try {
    const result = await pool.query(
      "DELETE FROM meal_plan_recipe WHERE meal_plan_id = $1 AND recipe_id = $2",
      [planId, recipeId]
    );
    if (result.rowCount === 0) {
      console.warn(`⚠️ No mapping deleted for ${planId},${recipeId}`);
      return res.status(404).json({ error: "Mapping not found" });
    }
    console.log(`✅ Mapping ${planId},${recipeId} deleted`);
    res.sendStatus(204);
  } catch (err) {
    console.error(`❌ Error deleting mapping ${planId},${recipeId}:`, err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
