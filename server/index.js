require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});

// ROUTE 1: Get all farmers
app.get('/api/farmers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM farmers');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ROUTE 2: Filter by district
app.get('/api/farmers/district/:district', async (req, res) => {
  try {
    const { district } = req.params;
    const result = await pool.query(
      'SELECT * FROM farmers WHERE district = $1',
      [district]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ROUTE 3: Filter by crop type
app.get('/api/farmers/crop/:crop_type', async (req, res) => {
  try {
    const { crop_type } = req.params;
    const result = await pool.query(
      'SELECT * FROM farmers WHERE crop_type = $1',
      [crop_type]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ROUTE 4: Get average yield by crop type
app.get('/api/stats/yield-by-crop', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT crop_type, 
              ROUND(AVG(yield_kg), 2) as avg_yield,
              COUNT(*) as farmer_count
       FROM farmers
       GROUP BY crop_type
       ORDER BY avg_yield DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ROUTE 5: Get technology access stats
app.get('/api/stats/technology', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        COUNT(*) as total_farmers,
        SUM(CASE WHEN has_internet THEN 1 ELSE 0 END) as has_internet,
        SUM(CASE WHEN has_smartphone THEN 1 ELSE 0 END) as has_smartphone
       FROM farmers`
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
// ROUTE 6: Climate challenge vs average yield
app.get('/api/stats/climate-yield', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT climate_challenge,
              ROUND(AVG(yield_kg), 2) as avg_yield,
              COUNT(*) as farmer_count
       FROM farmers
       GROUP BY climate_challenge
       ORDER BY avg_yield DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ROUTE 7: Digital divide by district
app.get('/api/stats/digital-divide', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT district,
              COUNT(*) as total,
              SUM(CASE WHEN has_internet THEN 1 ELSE 0 END) as has_internet,
              SUM(CASE WHEN has_smartphone THEN 1 ELSE 0 END) as has_smartphone
       FROM farmers
       GROUP BY district
       ORDER BY district`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ROUTE 8: Adaptation strategies distribution
app.get('/api/stats/adaptation', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT adaptation_strategy,
              COUNT(*) as count
       FROM farmers
       GROUP BY adaptation_strategy
       ORDER BY count DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ROUTE 9: Crop distribution by district
app.get('/api/stats/crop-district', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT district, crop_type,
              COUNT(*) as count
       FROM farmers
       GROUP BY district, crop_type
       ORDER BY district`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});