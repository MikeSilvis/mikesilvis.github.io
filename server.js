const express = require('express');
const path = require('path');
const { fetchAllWeights, fetchWeight, WEIGHTS } = require('./api/scraper');
const Cache = require('./api/cache');

const app = express();
const cache = new Cache(60000); // 60-second TTL
const PORT = process.env.PORT || 3000;

// API routes before static files
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/results/:tournamentId', async (req, res) => {
  const { tournamentId } = req.params;
  const cacheKey = `all-${tournamentId}`;
  const cached = cache.get(cacheKey);

  if (cached && cached.fresh) {
    return res.json({ weights: cached.data, stale: false, cachedAt: cached.timestamp });
  }

  try {
    const weights = await fetchAllWeights(tournamentId);
    cache.set(cacheKey, weights);
    // Also cache individual weights
    for (const [wt, data] of Object.entries(weights)) {
      cache.set(`${tournamentId}-${wt}`, data);
    }
    res.json({ weights, stale: false });
  } catch (err) {
    console.error('Failed to fetch all weights:', err.message);
    if (cached) {
      return res.json({ weights: cached.data, stale: true, cachedAt: cached.timestamp });
    }
    res.status(502).json({ error: 'Failed to fetch results from TrackWrestling' });
  }
});

app.get('/api/results/:tournamentId/:weight', async (req, res) => {
  const { tournamentId, weight } = req.params;
  const wt = parseInt(weight);
  if (!WEIGHTS.includes(wt)) {
    return res.status(400).json({ error: 'Invalid weight class' });
  }

  const cacheKey = `${tournamentId}-${wt}`;
  const cached = cache.get(cacheKey);

  if (cached && cached.fresh) {
    return res.json({ weight: wt, data: cached.data, stale: false, cachedAt: cached.timestamp });
  }

  try {
    const data = await fetchWeight(tournamentId, wt);
    cache.set(cacheKey, data);
    res.json({ weight: wt, data, stale: false });
  } catch (err) {
    console.error(`Failed to fetch ${wt}:`, err.message);
    if (cached) {
      return res.json({ weight: wt, data: cached.data, stale: true, cachedAt: cached.timestamp });
    }
    res.status(502).json({ error: `Failed to fetch results for ${wt}` });
  }
});

// Serve static files from repo root
app.use(express.static(path.join(__dirname), {
  extensions: ['html']
}));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
