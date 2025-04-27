const express = require("express");
const pool = require("../db");
const router = express.Router();

// GET /tag — list all tags
router.get("/", async (req, res) => {
  console.log("🔍 GET /tag");
  try {
    const { rows } = await pool.query("SELECT * FROM tag ORDER BY tag_id");
    console.log(`✅ Fetched ${rows.length} tags`);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching tags:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /tag/:id — get a single tag by ID
router.get("/:id", async (req, res) => {
  console.log(`🔍 GET /tag/${req.params.id}`);
  try {
    const { rows } = await pool.query("SELECT * FROM tag WHERE tag_id = $1", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      console.warn(`⚠️ Tag ${req.params.id} not found`);
      return res.status(404).json({ error: "Tag not found" });
    }
    console.log(`✅ Fetched tag ${req.params.id}`);
    res.json(rows[0]);
  } catch (err) {
    console.error(`❌ Error fetching tag ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

// POST /tag — create a new tag
router.post("/", async (req, res) => {
  console.log("🔔 POST /tag payload:", req.body);
  const { name } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO tag (name) VALUES ($1) RETURNING tag_id`,
      [name]
    );
    console.log(`✅ Tag created with ID ${rows[0].tag_id}`);
    res.status(201).json({ tag_id: rows[0].tag_id });
  } catch (err) {
    console.error("❌ Error creating tag:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /tag/:id — update an existing tag
router.put("/:id", async (req, res) => {
  console.log(`✏️ PUT /tag/${req.params.id} payload:`, req.body);
  const { name } = req.body;
  try {
    const result = await pool.query(
      `UPDATE tag SET name = $1 WHERE tag_id = $2`,
      [name, req.params.id]
    );
    if (result.rowCount === 0) {
      console.warn(`⚠️ No tag updated for ID ${req.params.id}`);
      return res.status(404).json({ error: "Tag not found" });
    }
    console.log(`✅ Tag ${req.params.id} updated`);
    res.sendStatus(204);
  } catch (err) {
    console.error(`❌ Error updating tag ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /tag/:id — delete a tag
router.delete("/:id", async (req, res) => {
  console.log(`🗑️ DELETE /tag/${req.params.id}`);
  try {
    const result = await pool.query("DELETE FROM tag WHERE tag_id = $1", [
      req.params.id,
    ]);
    if (result.rowCount === 0) {
      console.warn(`⚠️ No tag deleted for ID ${req.params.id}`);
      return res.status(404).json({ error: "Tag not found" });
    }
    console.log(`✅ Tag ${req.params.id} deleted`);
    res.sendStatus(204);
  } catch (err) {
    console.error(`❌ Error deleting tag ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
