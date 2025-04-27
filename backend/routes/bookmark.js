const express = require("express");
const pool = require("../db");
const router = express.Router();

// GET /bookmark — list all bookmarks
router.get("/", async (req, res) => {
  console.log("🔍 GET /bookmark");
  try {
    const { rows } = await pool.query(
      "SELECT * FROM bookmark ORDER BY bookmark_id"
    );
    console.log(`✅ Fetched ${rows.length} bookmarks`);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching bookmarks:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /bookmark/:id — get a single bookmark by ID
router.get("/:id", async (req, res) => {
  console.log(`🔍 GET /bookmark/${req.params.id}`);
  try {
    const { rows } = await pool.query(
      "SELECT * FROM bookmark WHERE bookmark_id = $1",
      [req.params.id]
    );
    if (rows.length === 0) {
      console.warn(`⚠️ Bookmark ${req.params.id} not found`);
      return res.status(404).json({ error: "Bookmark not found" });
    }
    console.log(`✅ Fetched bookmark ${req.params.id}`);
    res.json(rows[0]);
  } catch (err) {
    console.error(`❌ Error fetching bookmark ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

// POST /bookmark — create a new bookmark
router.post("/", async (req, res) => {
  console.log("🔔 POST /bookmark payload:", req.body);
  const { user_id, recipe_id } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO bookmark (user_id, recipe_id)
       VALUES ($1, $2)
       RETURNING bookmark_id`,
      [user_id, recipe_id]
    );
    console.log(`✅ Bookmark created with ID ${rows[0].bookmark_id}`);
    res.status(201).json({ bookmark_id: rows[0].bookmark_id });
  } catch (err) {
    console.error("❌ Error creating bookmark:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /bookmark/:id — update an existing bookmark
router.put("/:id", async (req, res) => {
  console.log(`✏️ PUT /bookmark/${req.params.id} payload:`, req.body);
  const { user_id, recipe_id } = req.body;
  try {
    const result = await pool.query(
      `UPDATE bookmark
       SET user_id   = $1,
           recipe_id = $2
       WHERE bookmark_id = $3`,
      [user_id, recipe_id, req.params.id]
    );
    if (result.rowCount === 0) {
      console.warn(`⚠️ No bookmark updated for ID ${req.params.id}`);
      return res.status(404).json({ error: "Bookmark not found" });
    }
    console.log(`✅ Bookmark ${req.params.id} updated`);
    res.sendStatus(204);
  } catch (err) {
    console.error(`❌ Error updating bookmark ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /bookmark/:id — delete a bookmark
router.delete("/:id", async (req, res) => {
  console.log(`🗑️ DELETE /bookmark/${req.params.id}`);
  try {
    const result = await pool.query(
      "DELETE FROM bookmark WHERE bookmark_id = $1",
      [req.params.id]
    );
    if (result.rowCount === 0) {
      console.warn(`⚠️ No bookmark deleted for ID ${req.params.id}`);
      return res.status(404).json({ error: "Bookmark not found" });
    }
    console.log(`✅ Bookmark ${req.params.id} deleted`);
    res.sendStatus(204);
  } catch (err) {
    console.error(`❌ Error deleting bookmark ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
