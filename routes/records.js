const express = require('express');
const db = require('../db');
const validateRecord = require('../middleware/validateRecord');

const router = express.Router();

// GET /records returns every row as a JSON array, newest date first
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM records ORDER BY date DESC, id DESC').all();
  res.json(rows);
});

// POST /records saves a new row, but only after validateRecord has approved the body
router.post('/', validateRecord, (req, res) => {
  const { date, course_id, enrollments, completions, revenue } = req.record;

  const result = db
    .prepare(
      'INSERT INTO records (date, course_id, enrollments, completions, revenue) VALUES (?, ?, ?, ?, ?)'
    )
    .run(date, course_id, enrollments, completions, revenue);

  const created = db.prepare('SELECT * FROM records WHERE id = ?').get(result.lastInsertRowid);

  res.status(201).json(created);
});

module.exports = router;