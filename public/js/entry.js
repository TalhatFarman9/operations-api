// Client-side logic for the daily entry form:
// 1) load courses  2) validate inputs  3) POST to /records with fetch  4) show banner

const form = document.getElementById('record-form');
const banner = document.getElementById('banner');
const courseSelect = document.getElementById('course_id');
const submitBtn = document.getElementById('submit-btn');
const FIELDS = ['date', 'course_id', 'enrollments', 'completions', 'revenue'];

// Default the date picker to today (local time, not UTC)
const now = new Date();
form.elements.date.value =
  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

function showBanner(type, message) {
  banner.className = `banner show ${type}`;   // type: "success" or "error"
  banner.textContent = message;
  banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideBanner() {
  banner.className = 'banner';
  banner.textContent = '';
}

function setFieldError(name, message) {
  form.querySelector(`.hint[data-for="${name}"]`).textContent = message || '';
  form.elements[name].classList.toggle('invalid', Boolean(message));
}

// ---- 1) load course list from the API ----
async function loadCourses() {
  try {
    const res = await fetch('/courses');
    if (!res.ok) throw new Error('bad response');
    const courses = await res.json();

    courseSelect.replaceChildren(new Option('Select a course', ''));
    for (const c of courses) courseSelect.add(new Option(c.name, c.id));
  } catch {
    courseSelect.replaceChildren(new Option('Could not load courses', ''));
    showBanner('error', 'Could not load courses from the server. Is the API running?');
  }
}

// ---- 2) validation ----
// Returns true when everything is valid; otherwise shows a message under each bad field.
function validate() {
  let ok = true;
  FIELDS.forEach((n) => setFieldError(n, ''));
  const value = (n) => form.elements[n].value.trim();

  if (!value('date')) { setFieldError('date', 'Please pick a date'); ok = false; }
  if (!value('course_id')) { setFieldError('course_id', 'Please choose a course'); ok = false; }

  for (const n of ['enrollments', 'completions']) {
    const v = value(n);
    if (v === '') { setFieldError(n, 'This field is required'); ok = false; }
    else if (Number(v) < 0) { setFieldError(n, 'Negative numbers are not allowed'); ok = false; }
    else if (!/^\d+$/.test(v)) { setFieldError(n, 'Enter a whole number (0 or more)'); ok = false; }
  }

  const rev = value('revenue');
  if (rev === '') { setFieldError('revenue', 'This field is required'); ok = false; }
  else if (Number.isNaN(Number(rev))) { setFieldError('revenue', 'Enter a valid amount'); ok = false; }
  else if (Number(rev) < 0) { setFieldError('revenue', 'Negative numbers are not allowed'); ok = false; }

  return ok;
}

// ---- 3) + 4) submit ----
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  hideBanner();

  if (!validate()) {
    showBanner('error', 'Please fix the highlighted fields and try again.');
    return;
  }

  const payload = {
    date: form.elements.date.value,
    course_id: Number(form.elements.course_id.value),
    enrollments: Number(form.elements.enrollments.value),
    completions: Number(form.elements.completions.value),
    revenue: Number(form.elements.revenue.value),
  };

  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving...';
  try {
    const res = await fetch('/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (res.ok) {
      showBanner('success', 'Record saved successfully!');
      ['enrollments', 'completions', 'revenue'].forEach((n) => { form.elements[n].value = ''; });
    } else {
      // 400 validation errors and 409 duplicates both come back as { errors: [...] }
      showBanner('error', (data.errors || ['Something went wrong']).join(' | '));
    }
  } catch {
    showBanner('error', 'Network error: could not reach the server. Please try again.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit record';
  }
});

loadCourses();
