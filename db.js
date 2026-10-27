const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

// The database file lives in the data folder (DB_FILE can override it)
const dbFile = process.env.DB_FILE || path.join(__dirname, 'data', 'operations.db');
fs.mkdirSync(path.dirname(dbFile), { recursive: true });

const db = new DatabaseSync(dbFile);

module.exports = db;