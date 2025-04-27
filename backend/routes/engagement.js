const express = require("express");
const pool = require("../db");
const router = express.Router();

// GET /engagement — list all engagements
router.get("/", async (req, res) => {
  console.log("🔍 GET /engagement");
  try {
    const { rows } = await pool.query(
      "SELECT * FROM engagement ORDER BY engagement_id"
    );
    console.log(`✅ Fetched ${rows.length} engagements`);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching engagements:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /engagement/:id — get a single engagement by ID
router.get("/:id", async (req, res) => {
  console.log(`🔍 GET /engagement/${req.params.id}`);
  try {
    const { rows } = await pool.query(
      "SELECT * FROM engagement WHERE engagement_id = $1",
      [req.params.id]
    );
    if (rows.length === 0) {
      console.warn(`⚠️ Engagement ${req.params.id} not found`);
      return res.status(404).json({ error: "Engagement not found" });
    }
    console.log(`✅ Fetched engagement ${req.params.id}`);
    res.json(rows[0]);
  } catch (err) {
    console.error(`❌ Error fetching engagement ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

// POST /engagement — create a new engagement
router.post("/", async (req, res) => {
  console.log("🔔 POST /engagement payload:", req.body);
  const { user_id, recipe_id, type } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO engagement (user_id, recipe_id, type)
       VALUES ($1, $2, $3)
       RETURNING engagement_id`,
      [user_id, recipe_id, type]
    );
    console.log(`✅ Engagement created with ID ${rows[0].engagement_id}`);
    res.status(201).json({ engagement_id: rows[0].engagement_id });
  } catch (err) {
    console.error("❌ Error creating engagement:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /engagement/:id — update an existing engagement
router.put("/:id", async (req, res) => {
  console.log(`✏️ PUT /engagement/${req.params.id} payload:`, req.body);
  const { user_id, recipe_id, type } = req.body;
  try {
    const result = await pool.query(
      `UPDATE engagement
       SET user_id   = $1,
           recipe_id = $2,
           type      = $3
       WHERE engagement_id = $4`,
      [user_id, recipe_id, type, req.params.id]
    );
    if (result.rowCount === 0) {
      console.warn(`⚠️ No engagement updated for ID ${req.params.id}`);
      return res.status(404).json({ error: "Engagement not found" });
    }
    console.log(`✅ Engagement ${req.params.id} updated`);
    res.sendStatus(204);
  } catch (err) {
    console.error(`❌ Error updating engagement ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /engagement/:id — delete an engagement
router.delete("/:id", async (req, res) => {
  console.log(`🗑️ DELETE /engagement/${req.params.id}`);
  try {
    const result = await pool.query(
      "DELETE FROM engagement WHERE engagement_id = $1",
      [req.params.id]
    );
    if (result.rowCount === 0) {
      console.warn(`⚠️ No engagement deleted for ID ${req.params.id}`);
      return res.status(404).json({ error: "Engagement not found" });
    }
    console.log(`✅ Engagement ${req.params.id} deleted`);
    res.sendStatus(204);
  } catch (err) {
    console.error(`❌ Error deleting engagement ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
