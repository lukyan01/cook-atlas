const express = require("express");
const pool = require("../db");
const router = express.Router();

// GET /users — list all users
router.get("/", async (req, res) => {
  console.log("🔍 GET /users");
  try {
    const { rows } = await pool.query("SELECT * FROM users ORDER BY user_id");
    console.log(`✅ Fetched ${rows.length} users`);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /users/:id — get a single user by ID
router.get("/:id", async (req, res) => {
  console.log(`🔍 GET /users/${req.params.id}`);
  try {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [req.params.id]
    );
    if (rows.length === 0) {
      console.warn(`⚠️ User ${req.params.id} not found`);
      return res.status(404).json({ error: "User not found" });
    }
    console.log(`✅ Fetched user ${req.params.id}`);
    res.json(rows[0]);
  } catch (err) {
    console.error(`❌ Error fetching user ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

// POST /users — create a new user
router.post("/", async (req, res) => {
  console.log("🔔 POST /users payload:", req.body);
  const { username, email, password } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO users (username, email, password)
       VALUES ($1, $2, $3)
       RETURNING user_id`,
      [username, email, password]
    );
    console.log(`✅ User created with ID ${rows[0].user_id}`);
    res.status(201).json({ user_id: rows[0].user_id });
  } catch (err) {
    console.error("❌ Error creating user:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /users/:id — update an existing user
router.put("/:id", async (req, res) => {
  console.log(`✏️ PUT /users/${req.params.id} payload:`, req.body);
  const { username, email, password } = req.body;
  try {
    const result = await pool.query(
      `UPDATE users
       SET username = $1,
           email    = $2,
           password = $3
       WHERE user_id = $4`,
      [username, email, password, req.params.id]
    );
    if (result.rowCount === 0) {
      console.warn(`⚠️ No user updated for ID ${req.params.id}`);
      return res.status(404).json({ error: "User not found" });
    }
    console.log(`✅ User ${req.params.id} updated`);
    res.sendStatus(204);
  } catch (err) {
    console.error(`❌ Error updating user ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /users/:id — delete a user
router.delete("/:id", async (req, res) => {
  console.log(`🗑️ DELETE /users/${req.params.id}`);
  try {
    const result = await pool.query("DELETE FROM users WHERE user_id = $1", [
      req.params.id,
    ]);
    if (result.rowCount === 0) {
      console.warn(`⚠️ No user deleted for ID ${req.params.id}`);
      return res.status(404).json({ error: "User not found" });
    }
    console.log(`✅ User ${req.params.id} deleted`);
    res.sendStatus(204);
  } catch (err) {
    console.error(`❌ Error deleting user ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
