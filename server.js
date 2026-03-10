require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// API routes before static files
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount domain-specific routes here as needed:
// app.use('/api/wrestling', require('./api/routes/wrestling'));

// Serve static files from Vite build output
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback: non-API, non-asset routes serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
