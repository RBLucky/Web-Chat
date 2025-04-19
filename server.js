import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import chatHandler from './api/chat.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - using express's built-in json parser
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// API endpoint
app.post('/api/chat', async (req, res) => {
  await chatHandler(req, res);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});