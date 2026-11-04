# Operations Tracking & Analytics API

A Node.js & Express REST API with SQLite database, interactive Chart.js analytics dashboard, CSV data export, and cloud deployment.

## 🚀 Live Demo
* **Deployment URL:** https://operations-api-9d0s.onrender.com
* **Dashboard:** https://operations-api-9d0s.onrender.com/dashboard.html
* **Operations Entry Form:** https://operations-api-9d0s.onrender.com/entry.html

---

## ✨ Features & Tasks Implemented

### Task 1: Express REST API & Database Integration
* Database schema with `courses` and `records` tables.
* Full CRUD endpoints for managing daily operation records (`GET`, `POST`, `PUT`, `DELETE`).
* SQL Foreign key constraints and transaction integrity.

### Task 2: Input Validation & Error Handling
* Express middleware to sanitize and validate request payload parameters.
* Proper HTTP status codes (`400 Bad Request`, `404 Not Found`, `500 Server Error`).

### Task 3: KPI Analytics Dashboard & Visualizations
* Aggregated metrics endpoint (`GET /records/summary`) calculating Total Enrollments, Total Completions, and Revenue.
* Modern web UI built with HTML5, CSS3, Bootstrap 5, and Chart.js visualizations.

### Task 4: CSV Export & Cloud Deployment
* File export endpoint (`GET /export`) generating formatted `operations_records.csv`.
* Automatic database setup and table initialization.
* Cloud deployment on Render.com (`render.yaml`).

---

## 📡 API Endpoints Specification

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/courses` | Fetch list of available courses |
| `GET` | `/records` | Retrieve operation records with optional filters |
| `POST` | `/records` | Add a new daily operation record |
| `PUT` | `/records/:id` | Update existing record by ID |
| `DELETE` | `/records/:id` | Delete record by ID |
| `GET` | `/records/summary` | Fetch KPI aggregated metrics |
| `GET` | `/export` | Download operations dataset as CSV file |

---

## 🛠️ Local Installation & Setup

1. **Clone Repository:**
   ```bash
   git clone [https://github.com/TalhatFarman9/operations-api.git](https://github.com/TalhatFarman9/operations-api.git)
   cd operations-api