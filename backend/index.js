const express = require('express');
const app = express();
const pool = require('./db');
require('dotenv').config();

// Enable CORS
const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// === ROUTES ===

// === RECIPE ROUTES ===

// Get all recipes
app.get('/recipes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM recipes ORDER BY recipe_id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Failed to fetch recipes: ' + err.message);
  }
});

// Get recipe by ID
app.get('/recipes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM recipes WHERE recipe_id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send('Failed to fetch recipe: ' + err.message);
  }
});

// Search recipes
app.get('/search', async (req, res) => {
  const { query, tags, skill_level, min_cook_time, max_cook_time, min_prep_time, max_prep_time } = req.query;
  
  try {
    let sql = 'SELECT * FROM recipes WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    // Text search
    if (query) {
      sql += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex + 1})`;
      params.push(`%${query}%`, `%${query}%`);
      paramIndex += 2;
    }

    // Tag search
    if (tags) {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      if (tagsArray.length > 0) {
        tagsArray.forEach((tag) => {
          sql += ` AND (
            description ILIKE $${paramIndex} 
            OR skill_level ILIKE $${paramIndex} 
            OR source_platform ILIKE $${paramIndex}
          )`;
          params.push(`%${tag}%`);
          paramIndex += 1;
        });
      }
    }

    // Skill level filter
    if (skill_level) {
      sql += ` AND skill_level = $${paramIndex}`;
      params.push(skill_level);
      paramIndex += 1;
    }

    // Cook time range
    if (min_cook_time) {
      sql += ` AND cook_time >= $${paramIndex}`;
      params.push(parseInt(min_cook_time));
      paramIndex += 1;
    }
    
    if (max_cook_time) {
      sql += ` AND cook_time <= $${paramIndex}`;
      params.push(parseInt(max_cook_time));
      paramIndex += 1;
    }

    // Prep time range
    if (min_prep_time) {
      sql += ` AND prep_time >= $${paramIndex}`;
      params.push(parseInt(min_prep_time));
      paramIndex += 1;
    }
    
    if (max_prep_time) {
      sql += ` AND prep_time <= $${paramIndex}`;
      params.push(parseInt(max_prep_time));
      paramIndex += 1;
    }

    sql += ' ORDER BY recipe_id DESC';
    const result = await pool.query(sql, params);
    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).send('Search failed: ' + err.message);
  }
});

// Insert recipe
app.post('/recipes', async (req, res) => {
  const {
    creator_id,
    title,
    description,
    cook_time,
    prep_time,
    skill_level,
    source_platform,
    source_url,
  } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO recipes (
        creator_id, title, description, cook_time, prep_time, skill_level, source_platform, source_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [creator_id, title, description, cook_time, prep_time, skill_level, source_platform, source_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send('Insert failed: ' + err.message);
  }
});

// Update recipe
app.put('/recipes/:id', async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    cook_time,
    prep_time,
    skill_level,
    source_platform,
    source_url,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE recipes 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           cook_time = COALESCE($3, cook_time),
           prep_time = COALESCE($4, prep_time),
           skill_level = COALESCE($5, skill_level),
           source_platform = COALESCE($6, source_platform),
           source_url = COALESCE($7, source_url)
       WHERE recipe_id = $8
       RETURNING *`,
      [title, description, cook_time, prep_time, skill_level, source_platform, source_url, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send('Update failed: ' + err.message);
  }
});

// Delete recipe
app.delete('/recipes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM recipes WHERE recipe_id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    res.json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    res.status(500).send('Delete failed: ' + err.message);
  }
});

// For backward compatibility
app.post('/insert', async (req, res) => {
  const {
    creator_id,
    title,
    description,
    cook_time,
    prep_time,
    skill_level,
    source_platform,
    source_url,
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO recipes (
        creator_id, title, description, cook_time, prep_time, skill_level, source_platform, source_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [creator_id, title, description, cook_time, prep_time, skill_level, source_platform, source_url]
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send('Insert failed: ' + err.message);
  }
});

app.post('/delete', async (req, res) => {
  const { recipe_id } = req.body;
  try {
    await pool.query('DELETE FROM recipes WHERE recipe_id = $1', [recipe_id]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send('Delete failed: ' + err.message);
  }
});

app.post('/update', async (req, res) => {
  const { recipe_id, title, description } = req.body;
  try {
    await pool.query(
      'UPDATE recipes SET title = $1, description = $2 WHERE recipe_id = $3',
      [title, description, recipe_id]
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send('Update failed: ' + err.message);
  }
});

// === USER ROUTES ===

// Register a new user
app.post('/auth/register', async (req, res) => {
  const { username, email, password, role = 'Registered User' } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  try {
    // Check if email already exists
    const emailCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Check if username already exists
    const usernameCheck = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (usernameCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Username already in use' });
    }

    // Insert new user
    // In a production app, you should hash the password before storing
    const result = await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING user_id, username, email, role',
      [username, email, password, role]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Registration failed: ' + err.message });
  }
});

// Login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // In a production app, you would hash the password and compare with stored hash
    const result = await pool.query('SELECT user_id, username, email, role FROM users WHERE email = $1 AND password = $2', 
      [email, password]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed: ' + err.message });
  }
});

// Get user profile
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT user_id, username, email, role FROM users WHERE user_id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user: ' + err.message });
  }
});

// Update user profile
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;

  try {
    const result = await pool.query(
      'UPDATE users SET username = COALESCE($1, username), email = COALESCE($2, email) WHERE user_id = $3 RETURNING user_id, username, email, role',
      [username, email, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Update failed: ' + err.message });
  }
});

// === BOOKMARK ROUTES ===

// Get bookmarks for a user
app.get('/users/:userId/bookmarks', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT r.* 
       FROM recipes r
       JOIN bookmark b ON r.recipe_id = b.recipe_id
       WHERE b.user_id = $1
       ORDER BY r.recipe_id DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookmarks: ' + err.message });
  }
});

// Add a bookmark
app.post('/bookmarks', async (req, res) => {
  const { user_id, recipe_id } = req.body;

  if (!user_id || !recipe_id) {
    return res.status(400).json({ message: 'User ID and Recipe ID are required' });
  }

  try {
    // Check if bookmark already exists
    const checkResult = await pool.query(
      'SELECT * FROM bookmark WHERE user_id = $1 AND recipe_id = $2',
      [user_id, recipe_id]
    );

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ message: 'Recipe already bookmarked' });
    }

    // Create bookmark
    const result = await pool.query(
      'INSERT INTO bookmark (user_id, recipe_id) VALUES ($1, $2) RETURNING *',
      [user_id, recipe_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add bookmark: ' + err.message });
  }
});

// Check if a recipe is bookmarked by a user
app.get('/bookmarks/check', async (req, res) => {
  const { user_id, recipe_id } = req.query;

  if (!user_id || !recipe_id) {
    return res.status(400).json({ message: 'User ID and Recipe ID are required' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM bookmark WHERE user_id = $1 AND recipe_id = $2',
      [user_id, recipe_id]
    );

    res.json({ bookmarked: result.rows.length > 0 });
  } catch (err) {
    res.status(500).json({ message: 'Failed to check bookmark: ' + err.message });
  }
});

// Remove a bookmark
app.delete('/bookmarks', async (req, res) => {
  const { user_id, recipe_id } = req.query;

  if (!user_id || !recipe_id) {
    return res.status(400).json({ message: 'User ID and Recipe ID are required' });
  }

  try {
    await pool.query(
      'DELETE FROM bookmark WHERE user_id = $1 AND recipe_id = $2',
      [user_id, recipe_id]
    );

    res.json({ message: 'Bookmark removed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove bookmark: ' + err.message });
  }
});

module.exports = app;

// Start server
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Backend server running at http://localhost:${PORT}`);
  });
}