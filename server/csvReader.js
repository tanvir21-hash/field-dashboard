const fs = require('fs');
const csv = require('csv-parser');

function readCSV() {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream('./data/farmer.csv')
      .pipe(csv())
      .on('data', (row) => {

        // Clean and normalize each row
        const cleanedRow = {
          farmer_id: row.farmer_id ? row.farmer_id.trim() : null,
          district: row.district ? row.district.trim() : null,
          village: row.village ? row.village.trim() : null,
          crop_type: row.crop_type ? row.crop_type.trim() : null,
          
          // Convert yield to a real number
          yield_kg: row.yield_kg ? parseFloat(row.yield_kg) : null,
          
          climate_challenge: row.climate_challenge ? row.climate_challenge.trim() : null,
          
          // Convert Yes/No to true/false
          has_internet: row.has_internet ? row.has_internet.trim().toLowerCase() === 'yes' : false,
          has_smartphone: row.has_smartphone ? row.has_smartphone.trim().toLowerCase() === 'yes' : false,
          
          adaptation_strategy: row.adaptation_strategy ? row.adaptation_strategy.trim() : null,
        };

        results.push(cleanedRow);
      })
      .on('end', () => {
        console.log(`Read and cleaned ${results.length} records`);
        resolve(results);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

// Test it
readCSV().then((data) => {
  console.log('First cleaned record:');
  console.log(data[0]);
});
module.exports = readCSV;