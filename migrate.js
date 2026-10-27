const fs = require('fs');
const path = require('path');
const db = require('./db');

// This table remembers which migration files have already been run
db.exec(`
  CREATE TABLE IF NOT EXISTS schema_migrations (
    name TEXT PRIMARY KEY,
    applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

const folder = path.join(__dirname, 'migrations');
const files = fs.readdirSync(folder).filter((file) => file.endsWith('.sql')).sort();

const alreadyApplied = new Set(
  db.prepare('SELECT name FROM schema_migrations').all().map((row) => row.name)
);

let applied = 0;

for (const file of files) {
  if (alreadyApplied.has(file)) {
    continue;
  }

  const sql = fs.readFileSync(path.join(folder, file), 'utf8');

  // Run the file and note it down together, so a half finished migration is never saved
  db.exec('BEGIN');
  try {
    db.exec(sql);
    db.prepare('INSERT INTO schema_migrations (name) VALUES (?)').run(file);
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }

  console.log('Applied migration:', file);
  applied++;
}

console.log(
  applied === 0
    ? 'Nothing to migrate, the database is already up to date.'
    : `Done. ${applied} migration(s) applied.`
);