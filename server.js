const express = require('express');
const path = require('path');
const dbModule = require('./db');
const db = dbModule.db || dbModule.default || dbModule;

// Import Routers
const recordsRouter = require('./routes/records');

const app = express();
const PORT = process.env.PORT || 3000;

// Helper: works with sqlite3 (db.all) and better-sqlite3 / node:sqlite (db.prepare().all)
function queryAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        if (typeof db.all === 'function') {
            db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
        } else if (typeof db.prepare === 'function') {
            try {
                resolve(db.prepare(sql).all(...params));
            } catch (err) {
                reject(err);
            }
        } else {
            reject(new Error('Unsupported db object. Check what db.js exports.'));
        }
    });
}

// CSV helper: quotes every text value safely
function csvCell(value) {
    const s = value === null || value === undefined ? '' : String(value);
    return `"${s.replace(/"/g, '""')}"`;
}

// 1. Basic Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Static Files (public folder)
app.use(express.static(path.join(__dirname, 'public')));

// 3. GET /export - CSV Download Route
app.get('/export', async (req, res) => {
    const query = `
        SELECT r.id, r.date, c.name AS course_name, r.enrollments, r.completions, r.revenue, r.created_at
        FROM records r
        LEFT JOIN courses c ON r.course_id = c.id
        ORDER BY r.date DESC
    `;

    try {
        const rows = await queryAll(query);

        let csv = 'ID,Date,Course Name,Enrollments,Completions,Revenue (PKR),Created At\n';
        rows.forEach(row => {
            csv += [
                row.id, row.date, csvCell(row.course_name),
                row.enrollments, row.completions, row.revenue, csvCell(row.created_at)
            ].join(',') + '\n';
        });

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="operations_records.csv"');
        res.status(200).send(csv);
    } catch (err) {
        console.error('Export Error:', err);
        res.status(500).json({ error: 'Failed to export data' });
    }
});

// 4. API Routes
app.use('/records', recordsRouter);

app.get('/courses', async (req, res) => {
    try {
        const rows = await queryAll('SELECT * FROM courses');
        res.json(rows);
    } catch (err) {
        console.error('Courses Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// 5. Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});