import express from 'express';
import cors from 'cors';

import { load_encrypted } from './back';

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

// Load vault (ENCRYPTED ONLY)
app.post('/vault/load', async (req, res) => {
  const { privateKey } = req.body;

  if (!privateKey) {
    return res.status(400).json({ error: 'privateKey missing' });
  }

  try {
    const client = await load_encrypted(privateKey);
    res.json(client);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
