# SkillUp Academy Operations Dashboard

Internal web app for SkillUp Academy staff to record daily enrollments, completions and revenue.

**Progress:** Task 1 (data model + REST API) done, Task 2 (daily entry form with validation) done.
Dashboard charts, CSV export and deployment come in Tasks 3 and 4.

## Requirements
- Node.js 22 or newer (`node -v` to check)

## Setup and run
```bash
npm install
npm run migrate     # creates data/skillup.db, the tables and the course list
npm start           # starts the server on http://localhost:3000
```

## How to open the form locally
1. Start the server as shown above (keep the terminal open).
2. Open **http://localhost:3000/entry.html** in your browser (or open http://localhost:3000 and click **Add today's record**).
3. Pick a date and course, fill in enrollments, completions and revenue, then press **Submit record**.

> Open the form through the server URL above. Do not double-click `entry.html`
> (a `file://` page cannot reach the API).

### What the form does
| Field | Input type | Rule |
|-------|-----------|------|
| Date | `date` (calendar picker, defaults to today) | required |
| Course | dropdown, loaded from `GET /courses` | required |
| Enrollments | `number`, `min="0"` | required, whole number >= 0 |
| Completions | `number`, `min="0"` | required, whole number >= 0 |
| Revenue (PKR) | `number`, `min="0"` | required, number >= 0 |

- JavaScript validates before sending: empty or negative values are blocked and a message appears under each bad field, and nothing is sent to the API.
- A valid form is sent with `fetch` as `POST /records`.
- A **green banner** appears on success; a **red banner** shows any server error (for example, a record for the same date and course already exists) or a network error.

### Checking that a record was saved
```bash
curl http://localhost:3000/records
```
or open http://localhost:3000/records in the browser: the new row appears in the JSON list.

## API
| Method | Path | Description |
|--------|------|-------------|
| GET | `/records` | JSON array of all records |
| POST | `/records` | Validate and store a record (201, 400 or 409) |
| GET | `/courses` | List of courses for the dropdown |

POST body: `{ "date": "2026-10-24", "course_id": 1, "enrollments": 5, "completions": 2, "revenue": 22500 }`

One record is allowed per date per course (duplicates return 409).

## Tests
```bash
npm test
```
Starts the server on a temporary database and checks the API and the form page. Your real `data/skillup.db` is not touched.

## Project structure
```
server.js                    Express app (API + static files)
db.js                        SQLite connection
migrations/                  SQL migrations (tables + seed courses)
scripts/migrate.js           Migration runner
scripts/smoke-test.js        npm test
middleware/validateRecord.js Server-side validation for POST /records
routes/records.js            GET/POST /records
routes/courses.js            GET /courses
public/index.html            Landing page
public/entry.html            Daily entry form
public/css/style.css         Shared styles (responsive)
public/js/entry.js           Form validation + fetch logic
```
