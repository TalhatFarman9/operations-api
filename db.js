const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'app.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to SQLite database at', dbPath);
    }
});

// Auto-create tables & seed initial courses on startup
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            course_id INTEGER NOT NULL,
            enrollments INTEGER NOT NULL,
            completions INTEGER NOT NULL,
            revenue REAL NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (course_id) REFERENCES courses(id)
        )
    `);

    // Seed default courses if table is empty
    db.get("SELECT COUNT(*) as count FROM courses", [], (err, row) => {
        if (!err && row && row.count === 0) {
            const stmt = db.prepare("INSERT INTO courses (name) VALUES (?)");
            const defaultCourses = [
                'Web Development',
                'Data Science',
                'Graphic Design',
                'Digital Marketing'
            ];
            defaultCourses.forEach(course => stmt.run(course));
            stmt.finalize();
            console.log('Default courses seeded successfully.');
        }
    });
});

module.exports = db;