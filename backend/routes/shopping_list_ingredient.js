const express = require("express");
const pool = require("../db");
const router = express.Router();

// GET /shopping_list_ingredient — list all list–ingredient mappings
router.get("/", async (req, res) => {
  console.log("🔍 GET /shopping_list_ingredient");
  try {
    const { rows } = await pool.query(
      "SELECT * FROM shopping_list_ingredient ORDER BY shopping_list_id, ingredient_id"
    );
    console.log(`✅ Fetched ${rows.length} mappings`);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching mappings:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /shopping_list_ingredient/:listId/:ingredientId — get one mapping
router.get("/:listId/:ingredientId", async (req, res) => {
  const { listId, ingredientId } = req.params;
  console.log(`🔍 GET /shopping_list_ingredient/${listId}/${ingredientId}`);
  try {
    const { rows } = await pool.query(
      "SELECT * FROM shopping_list_ingredient WHERE shopping_list_id = $1 AND ingredient_id = $2",
      [listId, ingredientId]
    );
    if (rows.length === 0) {
      console.warn(`⚠️ Mapping ${listId},${ingredientId} not found`);
      return res.status(404).json({ error: "Mapping not found" });
    }
    console.log(`✅ Fetched mapping ${listId},${ingredientId}`);
    res.json(rows[0]);
  } catch (err) {
    console.error(`❌ Error fetching mapping ${listId},${ingredientId}:`, err);
    res.status(500).json({ error: err.message });
  }
});

// POST /shopping_list_ingredient — create a new mapping
router.post("/", async (req, res) => {
  console.log("🔔 POST /shopping_list_ingredient payload:", req.body);
  const { shopping_list_id, ingredient_id } = req.body;
  try {
    await pool.query(
      "INSERT INTO shopping_list_ingredient (shopping_list_id, ingredient_id) VALUES ($1, $2)",
      [shopping_list_id, ingredient_id]
    );
    console.log(
      `✅ Mapping created for list ${shopping_list_id} and ingredient ${ingredient_id}`
    );
    res.sendStatus(201);
  } catch (err) {
    console.error("❌ Error creating mapping:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /shopping_list_ingredient/:listId/:ingredientId — delete a mapping
router.delete("/:listId/:ingredientId", async (req, res) => {
  const { listId, ingredientId } = req.params;
  console.log(`🗑️ DELETE /shopping_list_ingredient/${listId}/${ingredientId}`);
  try {
    const result = await pool.query(
      "DELETE FROM shopping_list_ingredient WHERE shopping_list_id = $1 AND ingredient_id = $2",
      [listId, ingredientId]
    );
    if (result.rowCount === 0) {
      console.warn(`⚠️ No mapping deleted for ${listId},${ingredientId}`);
      return res.status(404).json({ error: "Mapping not found" });
    }
    console.log(`✅ Mapping ${listId},${ingredientId} deleted`);
    res.sendStatus(204);
  } catch (err) {
    console.error(`❌ Error deleting mapping ${listId},${ingredientId}:`, err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
