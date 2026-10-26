const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /records returns every row as a JSON array, newest date first
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM records ORDER BY date DESC, id DESC').all();
  res.json(rows);
});

module.exports = router;