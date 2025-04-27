const express = require("express");
const pool = require("../db");
const router = express.Router();

// GET /ingredient — list all ingredients
router.get("/", async (req, res) => {
  console.log("🔍 GET /ingredient");
  try {
    const { rows } = await pool.query(
      "SELECT * FROM ingredient ORDER BY ingredient_id"
    );
    console.log(`✅ Fetched ${rows.length} ingredients`);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching ingredients:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /ingredient/:id — get a single ingredient by ID
router.get("/:id", async (req, res) => {
  console.log(`🔍 GET /ingredient/${req.params.id}`);
  try {
    const { rows } = await pool.query(
      "SELECT * FROM ingredient WHERE ingredient_id = $1",
      [req.params.id]
    );
    if (rows.length === 0) {
      console.warn(`⚠️ Ingredient ${req.params.id} not found`);
      return res.status(404).json({ error: "Ingredient not found" });
    }
    console.log(`✅ Fetched ingredient ${req.params.id}`);
    res.json(rows[0]);
  } catch (err) {
    console.error(`❌ Error fetching ingredient ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

// POST /ingredient — create a new ingredient
router.post("/", async (req, res) => {
  console.log("🔔 POST /ingredient payload:", req.body);
  const { name } = req.body;
  try {
    const { rows } = await pool.query(
      "INSERT INTO ingredient (name) VALUES ($1) RETURNING ingredient_id",
      [name]
    );
    console.log(`✅ Ingredient created with ID ${rows[0].ingredient_id}`);
    res.status(201).json({ ingredient_id: rows[0].ingredient_id });
  } catch (err) {
    console.error("❌ Error creating ingredient:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /ingredient/:id — update an existing ingredient
router.put("/:id", async (req, res) => {
  console.log(`✏️ PUT /ingredient/${req.params.id} payload:`, req.body);
  const { name } = req.body;
  try {
    const result = await pool.query(
      "UPDATE ingredient SET name = $1 WHERE ingredient_id = $2",
      [name, req.params.id]
    );
    if (result.rowCount === 0) {
      console.warn(`⚠️ No ingredient updated for ID ${req.params.id}`);
      return res.status(404).json({ error: "Ingredient not found" });
    }
    console.log(`✅ Ingredient ${req.params.id} updated`);
    res.sendStatus(204);
  } catch (err) {
    console.error(`❌ Error updating ingredient ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /ingredient/:id — delete an ingredient
router.delete("/:id", async (req, res) => {
  console.log(`🗑️ DELETE /ingredient/${req.params.id}`);
  try {
    const result = await pool.query(
      "DELETE FROM ingredient WHERE ingredient_id = $1",
      [req.params.id]
    );
    if (result.rowCount === 0) {
      console.warn(`⚠️ No ingredient deleted for ID ${req.params.id}`);
      return res.status(404).json({ error: "Ingredient not found" });
    }
    console.log(`✅ Ingredient ${req.params.id} deleted`);
    res.sendStatus(204);
  } catch (err) {
    console.error(`❌ Error deleting ingredient ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
