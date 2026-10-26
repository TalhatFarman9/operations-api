const express = require('express');
const db = require('./db');
const recordsRouter = require('./routes/records');

const app = express();
const PORT = process.env.PORT || 3000;

// Stop early with a clear message if the migration was never run
const hasTable = db
  .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'records'")
  .get();

if (!hasTable) {
  console.error('The records table is missing. Run "npm run migrate" first.');
  process.exit(1);
}

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Operations API is running',
    endpoints: ['GET /records', 'POST /records'],
  });
});

app.use('/records', recordsRouter);

// Any other URL
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Errors, for example a request body that is not valid JSON
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Request body is not valid JSON' });
  }
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

app.listen(PORT, () => {
  console.log(`Operations API listening on http://localhost:${PORT}`);
});