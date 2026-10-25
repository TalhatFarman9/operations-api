const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

// The database file lives in the data folder (DB_FILE can override it)
const dbFile = process.env.DB_FILE || path.join(__dirname, 'data', 'operations.db');
fs.mkdirSync(path.dirname(dbFile), { recursive: true });

const db = new Database(dbFile);

module.exports = db;