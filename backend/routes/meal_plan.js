const express = require("express");
const pool = require("../db");
const router = express.Router();

// GET /meal_plan — list all meal plans
router.get("/", async (req, res) => {
  console.log("🔍 GET /meal_plan");
  try {
    const { rows } = await pool.query(
      "SELECT * FROM meal_plan ORDER BY meal_plan_id"
    );
    console.log(`✅ Fetched ${rows.length} meal plans`);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching meal plans:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /meal_plan/:id — get a single meal plan by ID
router.get("/:id", async (req, res) => {
  console.log(`🔍 GET /meal_plan/${req.params.id}`);
  try {
    const { rows } = await pool.query(
      "SELECT * FROM meal_plan WHERE meal_plan_id = $1",
      [req.params.id]
    );
    if (rows.length === 0) {
      console.warn(`⚠️ Meal plan ${req.params.id} not found`);
      return res.status(404).json({ error: "Meal plan not found" });
    }
    console.log(`✅ Fetched meal plan ${req.params.id}`);
    res.json(rows[0]);
  } catch (err) {
    console.error(`❌ Error fetching meal plan ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

// POST /meal_plan — create a new meal plan
router.post("/", async (req, res) => {
  console.log("🔔 POST /meal_plan payload:", req.body);
  const { user_id, name, description } = req.body; // adjust fields as needed
  try {
    const { rows } = await pool.query(
      `INSERT INTO meal_plan (user_id, name, description)
       VALUES ($1, $2, $3)
       RETURNING meal_plan_id`,
      [user_id, name, description]
    );
    console.log(`✅ Meal plan created with ID ${rows[0].meal_plan_id}`);
    res.status(201).json({ meal_plan_id: rows[0].meal_plan_id });
  } catch (err) {
    console.error("❌ Error creating meal plan:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /meal_plan/:id — update an existing meal plan
router.put("/:id", async (req, res) => {
  console.log(`✏️ PUT /meal_plan/${req.params.id} payload:`, req.body);
  const { user_id, name, description } = req.body; // adjust fields as needed
  try {
    const result = await pool.query(
      `UPDATE meal_plan
       SET user_id    = $1,
           name       = $2,
           description= $3
       WHERE meal_plan_id = $4`,
      [user_id, name, description, req.params.id]
    );
    if (result.rowCount === 0) {
      console.warn(`⚠️ No meal plan updated for ID ${req.params.id}`);
      return res.status(404).json({ error: "Meal plan not found" });
    }
    console.log(`✅ Meal plan ${req.params.id} updated`);
    res.sendStatus(204);
  } catch (err) {
    console.error(`❌ Error updating meal plan ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /meal_plan/:id — delete a meal plan
router.delete("/:id", async (req, res) => {
  console.log(`🗑️ DELETE /meal_plan/${req.params.id}`);
  try {
    const result = await pool.query(
      "DELETE FROM meal_plan WHERE meal_plan_id = $1",
      [req.params.id]
    );
    if (result.rowCount === 0) {
      console.warn(`⚠️ No meal plan deleted for ID ${req.params.id}`);
      return res.status(404).json({ error: "Meal plan not found" });
    }
    console.log(`✅ Meal plan ${req.params.id} deleted`);
    res.sendStatus(204);
  } catch (err) {
    console.error(`❌ Error deleting meal plan ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
