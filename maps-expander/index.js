const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/expand', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'No URL provided' });

  try {
    // Only follow the first redirect (shortened URL)
    const response = await axios.get(url, { maxRedirects: 0, validateStatus: null });
    const location = response.headers.location;
    if (location) {
      res.json({ expanded: location });
    } else {
      res.status(400).json({ error: 'No redirect found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to expand URL' });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`URL expander running on port ${PORT}`)); 