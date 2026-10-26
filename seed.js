const db = require('./db');

const hasTable = db
  .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'records'")
  .get();

if (!hasTable) {
  console.error('The records table is missing. Run "npm run migrate" first.');
  process.exit(1);
}

const existing = db.prepare('SELECT COUNT(*) AS total FROM records').get().total;

if (existing > 0) {
  console.log(`The records table already has ${existing} rows, nothing was added.`);
  process.exit(0);
}

// date, course_id, enrollments, completions, revenue
const sample = [
  ['2026-10-20', 1, 12, 4, 24000],
  ['2026-10-20', 2, 8, 2, 16000],
  ['2026-10-21', 1, 15, 5, 30000],
  ['2026-10-21', 3, 6, 1, 9000],
  ['2026-10-22', 2, 10, 3, 20000],
];

const insert = db.prepare(
  'INSERT INTO records (date, course_id, enrollments, completions, revenue) VALUES (?, ?, ?, ?, ?)'
);

const addAll = db.transaction((rows) => {
  for (const row of rows) {
    insert.run(...row);
  }
});

addAll(sample);
console.log(`Added ${sample.length} sample rows.`);