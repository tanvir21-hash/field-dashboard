// Import our CSV reader
const readCSV = require('./csvReader');

// Import database connection
const { Pool } = require('pg');

// Load environment variables
require('dotenv').config();

// Connect to database
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Function to insert all farmers into database
async function insertFarmers() {
  
  // First read and clean the CSV
  const farmers = await readCSV();

  console.log(`Inserting ${farmers.length} farmers into database...`);

  // Loop through each farmer and insert
  for (const farmer of farmers) {
    await pool.query(
      `INSERT INTO farmers 
        (farmer_id, district, village, crop_type, yield_kg, climate_challenge, has_internet, has_smartphone, adaptation_strategy)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (farmer_id) DO NOTHING`,
      [
        farmer.farmer_id,
        farmer.district,
        farmer.village,
        farmer.crop_type,
        farmer.yield_kg,
        farmer.climate_challenge,
        farmer.has_internet,
        farmer.has_smartphone,
        farmer.adaptation_strategy,
      ]
    );
  }

  console.log('All farmers inserted successfully!');
  
  // Close the database connection
  await pool.end();
}

// Run the function
insertFarmers();