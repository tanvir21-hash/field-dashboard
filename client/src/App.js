import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

// Colors for charts
const COLORS = ['#2c7a3a', '#4CAF50', '#FFC107', '#FF5722', '#2196F3', '#9C27B0'];

function App() {
  // State for all data
  const [farmers, setFarmers] = useState([]);
  const [yieldStats, setYieldStats] = useState([]);
  const [techStats, setTechStats] = useState({});
  const [climateYield, setClimateYield] = useState([]);
  const [digitalDivide, setDigitalDivide] = useState([]);
  const [adaptation, setAdaptation] = useState([]);
  const [districtFilter, setDistrictFilter] = useState('All');

  // Fetch all data when app loads
  useEffect(() => {
    axios.get('https://field-dashboard-j3tk.onrender.com/api/farmers')
      .then(res => setFarmers(res.data));

    axios.get('https://field-dashboard-j3tk.onrender.com/api/yield-by-crop')
      .then(res => setYieldStats(res.data));

    axios.get('https://field-dashboard-j3tk.onrender.com/api/technology')
      .then(res => setTechStats(res.data));

    axios.get('https://field-dashboard-j3tk.onrender.com/api/climate-yield')
      .then(res => setClimateYield(res.data));

    axios.get('https://field-dashboard-j3tk.onrender.com/api/digital-divide')
      .then(res => setDigitalDivide(res.data));

    axios.get('https://field-dashboard-j3tk.onrender.com/api/adaptation')
      .then(res => setAdaptation(res.data));
  }, []);

  // Get unique districts for filter
  const districts = ['All', ...new Set(farmers.map(f => f.district))];

  // Filter farmers table by district
  const filteredFarmers = districtFilter === 'All'
    ? farmers
    : farmers.filter(f => f.district === districtFilter);

  // Technology pie chart data
  const techData = [
    { name: 'Has Internet', value: parseInt(techStats.has_internet) || 0 },
    { name: 'No Internet', value: (parseInt(techStats.total_farmers) - parseInt(techStats.has_internet)) || 0 },
  ];

  // Adaptation pie chart data
  const adaptationData = adaptation.map(a => ({
    name: a.adaptation_strategy,
    value: parseInt(a.count)
  }));

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial', backgroundColor: '#f9fafb' }}>

      {/* Header */}
      <h1 style={{ color: '#2c7a3a', borderBottom: '3px solid #2c7a3a', paddingBottom: '10px' }}>
        🌾 Field Data Dashboard
      </h1>
      <p style={{ color: '#666' }}>Agricultural Survey — Small-scale Farmers, Bangladesh</p>

      {/* Stats Cards */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
        <div style={cardStyle('#2c7a3a')}>
          <h3>Total Farmers</h3>
          <p style={bigNumber}>{farmers.length}</p>
        </div>
        <div style={cardStyle('#2196F3')}>
          <h3>Internet Access</h3>
          <p style={bigNumber}>{techStats.has_internet} / {techStats.total_farmers}</p>
        </div>
        <div style={cardStyle('#FF9800')}>
          <h3>Smartphone Access</h3>
          <p style={bigNumber}>{techStats.has_smartphone} / {techStats.total_farmers}</p>
        </div>
        <div style={cardStyle('#9C27B0')}>
          <h3>Districts Covered</h3>
          <p style={bigNumber}>{districts.length - 1}</p>
        </div>
      </div>

      {/* ROW 1: Yield Charts */}
      <div style={rowStyle}>

        {/* Bar Chart - Yield by Crop */}
        <div style={chartBox}>
          <h2 style={chartTitle}>📊 Average Yield by Crop (kg)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={yieldStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="crop_type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="avg_yield" fill="#2c7a3a" name="Avg Yield (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Climate vs Yield */}
        <div style={chartBox}>
          <h2 style={chartTitle}>🌊 Climate Challenge vs Yield (kg)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={climateYield}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="climate_challenge" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="avg_yield" fill="#FF5722" name="Avg Yield (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* ROW 2: Digital Divide + Adaptation */}
      <div style={rowStyle}>

        {/* Grouped Bar Chart - Digital Divide by District */}
        <div style={chartBox}>
          <h2 style={chartTitle}>📡 Digital Divide by District</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={digitalDivide}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="district" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="has_internet" fill="#2196F3" name="Has Internet" />
              <Bar dataKey="has_smartphone" fill="#4CAF50" name="Has Smartphone" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Adaptation Strategies */}
        <div style={chartBox}>
          <h2 style={chartTitle}>🌱 Adaptation Strategies</h2>
          <PieChart width={400} height={280}>
            <Pie
              data={adaptationData}
              cx={200}
              cy={130}
              outerRadius={100}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {adaptationData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

      </div>

      {/* ROW 3: Internet Access Pie */}
      <div style={rowStyle}>
        <div style={chartBox}>
          <h2 style={chartTitle}>🌐 Internet Access Distribution</h2>
          <PieChart width={400} height={280}>
            <Pie
              data={techData}
              cx={200}
              cy={130}
              outerRadius={100}
              dataKey="value"
              label
            >
              {techData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>

      {/* Farmer Records Table */}
      <h2 style={chartTitle}>📋 Farmer Records</h2>
      <label style={{ fontWeight: 'bold' }}>Filter by District: </label>
      <select
        value={districtFilter}
        onChange={(e) => setDistrictFilter(e.target.value)}
        style={{ padding: '6px', marginBottom: '15px', marginLeft: '10px' }}
      >
        {districts.map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
        <thead>
          <tr style={{ backgroundColor: '#2c7a3a', color: 'white' }}>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>District</th>
            <th style={thStyle}>Village</th>
            <th style={thStyle}>Crop</th>
            <th style={thStyle}>Yield (kg)</th>
            <th style={thStyle}>Challenge</th>
            <th style={thStyle}>Internet</th>
            <th style={thStyle}>Smartphone</th>
            <th style={thStyle}>Strategy</th>
          </tr>
        </thead>
        <tbody>
          {filteredFarmers.map((farmer, index) => (
            <tr key={farmer.farmer_id}
              style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
              <td style={tdStyle}>{farmer.farmer_id}</td>
              <td style={tdStyle}>{farmer.district}</td>
              <td style={tdStyle}>{farmer.village}</td>
              <td style={tdStyle}>{farmer.crop_type}</td>
              <td style={tdStyle}>{farmer.yield_kg}</td>
              <td style={tdStyle}>{farmer.climate_challenge}</td>
              <td style={tdStyle}>{farmer.has_internet ? '✅' : '❌'}</td>
              <td style={tdStyle}>{farmer.has_smartphone ? '✅' : '❌'}</td>
              <td style={tdStyle}>{farmer.adaptation_strategy}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

// Style helpers
const cardStyle = (color) => ({
  backgroundColor: color,
  color: 'white',
  padding: '20px 30px',
  borderRadius: '12px',
  minWidth: '160px',
  textAlign: 'center',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
});

const bigNumber = {
  fontSize: '2rem',
  fontWeight: 'bold',
  margin: 0
};

const rowStyle = {
  display: 'flex',
  gap: '20px',
  marginBottom: '30px',
  flexWrap: 'wrap'
};

const chartBox = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  flex: 1,
  minWidth: '300px'
};

const chartTitle = {
  color: '#2c7a3a',
  marginTop: 0
};

const thStyle = {
  padding: '12px 10px',
  textAlign: 'left'
};

const tdStyle = {
  padding: '10px',
  borderBottom: '1px solid #eee'
};

export default App;