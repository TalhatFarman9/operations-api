// Checks that a string like 2026-10-25 is a real calendar date
function isRealDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function validateRecord(req, res, next) {
  const body = req.body;

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: 'Request body must be a JSON object' });
  }

  const errors = [];

  if (!isRealDate(body.date)) {
    errors.push('date is required and must be a real date in YYYY-MM-DD format');
  }
  if (!Number.isInteger(body.course_id) || body.course_id < 1) {
    errors.push('course_id is required and must be a whole number of 1 or more');
  }
  if (!Number.isInteger(body.enrollments) || body.enrollments < 0) {
    errors.push('enrollments is required and must be a whole number, 0 or more');
  }
  if (!Number.isInteger(body.completions) || body.completions < 0) {
    errors.push('completions is required and must be a whole number, 0 or more');
  }
  if (typeof body.revenue !== 'number' || !Number.isFinite(body.revenue) || body.revenue < 0) {
    errors.push('revenue is required and must be a number, 0 or more');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  // Keep only the five fields we store, anything extra in the request is ignored
  req.record = {
    date: body.date,
    course_id: body.course_id,
    enrollments: body.enrollments,
    completions: body.completions,
    revenue: body.revenue,
  };

  next();
}

module.exports = validateRecord;