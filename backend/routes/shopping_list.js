const express = require("express");
const pool = require("../db");
const router = express.Router();

// GET /shopping_list — list all shopping lists
router.get("/", async (req, res) => {
  console.log("🔍 GET /shopping_list");
  try {
    const { rows } = await pool.query(
      "SELECT * FROM shopping_list ORDER BY shopping_list_id"
    );
    console.log(`✅ Fetched ${rows.length} shopping lists`);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching shopping lists:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /shopping_list/:id — get a single shopping list by ID
router.get("/:id", async (req, res) => {
  console.log(`🔍 GET /shopping_list/${req.params.id}`);
  try {
    const { rows } = await pool.query(
      "SELECT * FROM shopping_list WHERE shopping_list_id = $1",
      [req.params.id]
    );
    if (rows.length === 0) {
      console.warn(`⚠️ Shopping list ${req.params.id} not found`);
      return res.status(404).json({ error: "Shopping list not found" });
    }
    console.log(`✅ Fetched shopping list ${req.params.id}`);
    res.json(rows[0]);
  } catch (err) {
    console.error(`❌ Error fetching shopping list ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

// POST /shopping_list — create a new shopping list
router.post("/", async (req, res) => {
  console.log("🔔 POST /shopping_list payload:", req.body);
  const { user_id } = req.body;
  try {
    const { rows } = await pool.query(
      "INSERT INTO shopping_list (user_id) VALUES ($1) RETURNING shopping_list_id",
      [user_id]
    );
    console.log(`✅ Shopping list created with ID ${rows[0].shopping_list_id}`);
    res.status(201).json({ shopping_list_id: rows[0].shopping_list_id });
  } catch (err) {
    console.error("❌ Error creating shopping list:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /shopping_list/:id — update an existing shopping list
router.put("/:id", async (req, res) => {
  console.log(`✏️ PUT /shopping_list/${req.params.id} payload:`, req.body);
  const { user_id } = req.body;
  try {
    const result = await pool.query(
      "UPDATE shopping_list SET user_id = $1 WHERE shopping_list_id = $2",
      [user_id, req.params.id]
    );
    if (result.rowCount === 0) {
      console.warn(`⚠️ No shopping list updated for ID ${req.params.id}`);
      return res.status(404).json({ error: "Shopping list not found" });
    }
    console.log(`✅ Shopping list ${req.params.id} updated`);
    res.sendStatus(204);
  } catch (err) {
    console.error(`❌ Error updating shopping list ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /shopping_list/:id — delete a shopping list
router.delete("/:id", async (req, res) => {
  console.log(`🗑️ DELETE /shopping_list/${req.params.id}`);
  try {
    const result = await pool.query(
      "DELETE FROM shopping_list WHERE shopping_list_id = $1",
      [req.params.id]
    );
    if (result.rowCount === 0) {
      console.warn(`⚠️ No shopping list deleted for ID ${req.params.id}`);
      return res.status(404).json({ error: "Shopping list not found" });
    }
    console.log(`✅ Shopping list ${req.params.id} deleted`);
    res.sendStatus(204);
  } catch (err) {
    console.error(`❌ Error deleting shopping list ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
