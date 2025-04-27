const express = require("express");
const pool = require("../db");
const router = express.Router();

// GET /rating — list all ratings
router.get("/", async (req, res) => {
  console.log("🔍 GET /rating");
  try {
    const { rows } = await pool.query(
      "SELECT * FROM rating ORDER BY rating_id"
    );
    console.log(`✅ Fetched ${rows.length} ratings`);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching ratings:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /rating/:id — get a single rating by ID
router.get("/:id", async (req, res) => {
  console.log(`🔍 GET /rating/${req.params.id}`);
  try {
    const { rows } = await pool.query(
      "SELECT * FROM rating WHERE rating_id = $1",
      [req.params.id]
    );
    if (rows.length === 0) {
      console.warn(`⚠️ Rating ${req.params.id} not found`);
      return res.status(404).json({ error: "Rating not found" });
    }
    console.log(`✅ Fetched rating ${req.params.id}`);
    res.json(rows[0]);
  } catch (err) {
    console.error(`❌ Error fetching rating ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

// POST /rating — create a new rating
router.post("/", async (req, res) => {
  console.log("🔔 POST /rating payload:", req.body);
  const { user_id, recipe_id, score, comment } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO rating (user_id, recipe_id, score, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING rating_id`,
      [user_id, recipe_id, score, comment]
    );
    console.log(`✅ Rating created with ID ${rows[0].rating_id}`);
    res.status(201).json({ rating_id: rows[0].rating_id });
  } catch (err) {
    console.error("❌ Error creating rating:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /rating/:id — update an existing rating
router.put("/:id", async (req, res) => {
  console.log(`✏️ PUT /rating/${req.params.id} payload:`, req.body);
  const { score, comment } = req.body;
  try {
    const result = await pool.query(
      `UPDATE rating
       SET score   = $1,
           comment = $2
       WHERE rating_id = $3`,
      [score, comment, req.params.id]
    );
    if (result.rowCount === 0) {
      console.warn(`⚠️ No rating updated for ID ${req.params.id}`);
      return res.status(404).json({ error: "Rating not found" });
    }
    console.log(`✅ Rating ${req.params.id} updated`);
    res.sendStatus(204);
  } catch (err) {
    console.error(`❌ Error updating rating ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /rating/:id — delete a rating
router.delete("/:id", async (req, res) => {
  console.log(`🗑️ DELETE /rating/${req.params.id}`);
  try {
    const result = await pool.query("DELETE FROM rating WHERE rating_id = $1", [
      req.params.id,
    ]);
    if (result.rowCount === 0) {
      console.warn(`⚠️ No rating deleted for ID ${req.params.id}`);
      return res.status(404).json({ error: "Rating not found" });
    }
    console.log(`✅ Rating ${req.params.id} deleted`);
    res.sendStatus(204);
  } catch (err) {
    console.error(`❌ Error deleting rating ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
