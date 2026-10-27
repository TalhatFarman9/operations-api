# Operations API

A small REST API that stores daily course records (date, course, enrollments, completions, revenue). Built with Node.js, Express and SQLite as an internship task.

## What it does
- `GET /records` returns all records as a JSON array, newest date first
- `POST /records` checks the request body and saves a new record

## Requirements
- Node.js 22.13 or newer (developed on Node 24). SQLite is built into Node, so there is nothing extra to install
- npm and Git

## Setup
1. Clone the repository and go into the folder: `git clone https://github.com/TalhatFarman9/operations-api.git` then `cd operations-api`
2. Install the packages: `npm install`
3. Run the migrations to create the database and the `records` table: `npm run migrate`
4. Optional, add 5 sample rows: `npm run seed`
5. Start the server: `npm start`

The server runs at http://localhost:3000. To use another port, set the `PORT` environment variable.

Node prints a warning like `ExperimentalWarning: SQLite is an experimental feature` when the scripts run. This is expected and harmless.

## Migrations
The SQL files live in the `migrations` folder. `npm run migrate` runs the files that have not been applied yet, in order, and notes each one in a `schema_migrations` table. Running it again does nothing, so it is safe to repeat. The SQLite database file is created automatically at `data/operations.db` and is not committed to Git.

The `records` table:

| Column | Type | Notes |
|---|---|---|
| id | INTEGER | primary key, counts up by itself |
| date | TEXT | format YYYY-MM-DD |
| course_id | INTEGER | 1 or more |
| enrollments | INTEGER | 0 or more |
| completions | INTEGER | 0 or more |
| revenue | REAL | 0 or more |
| created_at | TEXT | set by the database (UTC) |

## API

### GET /records
Returns a JSON array. Example: `curl http://localhost:3000/records`

```json
[
  {
    "id": 5,
    "date": "2026-10-22",
    "course_id": 2,
    "enrollments": 10,
    "completions": 3,
    "revenue": 20000,
    "created_at": "2026-10-26 09:57:25"
  }
]
```

### POST /records
Send a JSON body with all five fields.

Windows CMD:
```
curl -i -X POST http://localhost:3000/records -H "Content-Type: application/json" -d "{\"date\":\"2026-10-26\",\"course_id\":1,\"enrollments\":10,\"completions\":2,\"revenue\":15000}"
```

macOS or Linux:
```
curl -i -X POST http://localhost:3000/records -H "Content-Type: application/json" -d '{"date":"2026-10-26","course_id":1,"enrollments":10,"completions":2,"revenue":15000}'
```

In Postman: choose POST, enter the URL, open Body, pick raw and JSON, and paste the JSON.

A valid request returns `201 Created` and the saved row. An invalid one returns `400` and a list of what is wrong:

```json
{
  "error": "Validation failed",
  "details": ["revenue is required and must be a number, 0 or more"]
}
```

### Validation rules
- `date` must be a real date written as YYYY-MM-DD
- `course_id` must be a whole number of 1 or more
- `enrollments` and `completions` must be whole numbers, 0 or more
- `revenue` must be a number, 0 or more
- Numbers must be sent as JSON numbers, not text. `"5"` is rejected
- Extra fields in the request are ignored

### Status codes
| Code | When |
|---|---|
| 200 | GET worked |
| 201 | a record was created |
| 400 | invalid data, or the body is not valid JSON |
| 404 | the URL does not exist |
| 500 | something went wrong on the server |

## Project structure
```
server.js                      starts Express and connects the routes
db.js                          opens the SQLite database
migrate.js                     runs the migration files
seed.js                        adds 5 sample rows
migrations/                    SQL files for the table
middleware/validateRecord.js   checks the body of POST requests
routes/records.js              GET and POST /records
```

## Left out
- No update or delete endpoints, the task only asked for GET and POST
- `course_id` is not linked to a courses table, because there is no such table in this task
- The same date and course can be saved more than once