document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch both records and courses simultaneously
        const [recordsRes, coursesRes] = await Promise.all([
            fetch('/records'),
            fetch('/courses')
        ]);

        const records = await recordsRes.json();
        const courses = await coursesRes.json();

        if (!Array.isArray(records) || records.length === 0) {
            console.warn('No records found to display on dashboard.');
            return;
        }

        // Map course IDs to Course Names
        const courseMap = {};
        courses.forEach(c => {
            courseMap[c.id] = c.name;
        });

        // 1. Calculate Aggregate Totals
        let totalEnrollments = 0;
        let totalCompletions = 0;
        let totalRevenue = 0;

        // Data containers for grouping
        const enrollmentsByDate = {};
        const revenueByCourse = {};

        records.forEach(rec => {
            totalEnrollments += Number(rec.enrollments || 0);
            totalCompletions += Number(rec.completions || 0);
            totalRevenue += Number(rec.revenue || 0);

            // Group enrollments by Date
            const dateStr = rec.date;
            enrollmentsByDate[dateStr] = (enrollmentsByDate[dateStr] || 0) + Number(rec.enrollments || 0);

            // Group revenue by Course Name
            const courseName = courseMap[rec.course_id] || `Course ${rec.course_id}`;
            revenueByCourse[courseName] = (revenueByCourse[courseName] || 0) + Number(rec.revenue || 0);
        });

        // Display Summary Totals
        document.getElementById('totalEnrollments').textContent = totalEnrollments.toLocaleString();
        document.getElementById('totalCompletions').textContent = totalCompletions.toLocaleString();
        document.getElementById('totalRevenue').textContent = `PKR ${totalRevenue.toLocaleString()}`;

        // 2. Prepare Line Chart Data (Enrollments over time)
        const sortedDates = Object.keys(enrollmentsByDate).sort();
        const enrollmentsData = sortedDates.map(date => enrollmentsByDate[date]);

        renderLineChart(sortedDates, enrollmentsData);

        // 3. Prepare Bar Chart Data (Revenue per course)
        const courseLabels = Object.keys(revenueByCourse);
        const revenueData = courseLabels.map(course => revenueByCourse[course]);

        renderBarChart(courseLabels, revenueData);

    } catch (err) {
        console.error('Error loading dashboard data:', err);
    }
});

// Render Line Chart
function renderLineChart(labels, data) {
    const ctx = document.getElementById('enrollmentsChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Enrollments',
                data: data,
                borderColor: '#0d6efd',
                backgroundColor: 'rgba(13, 110, 253, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, precision: 0 }
            }
        }
    });
}

// Render Bar Chart
function renderBarChart(labels, data) {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Revenue (PKR)',
                data: data,
                backgroundColor: ['#198754', '#0dcaf0', '#ffc107', '#6f42c1', '#fd7e14'],
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}