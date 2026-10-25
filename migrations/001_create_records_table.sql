CREATE TABLE records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  course_id INTEGER NOT NULL,
  enrollments INTEGER NOT NULL CHECK (enrollments >= 0),
  completions INTEGER NOT NULL CHECK (completions >= 0),
  revenue REAL NOT NULL CHECK (revenue >= 0),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_records_date ON records (date);