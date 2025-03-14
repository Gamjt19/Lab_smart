document.getElementById('filterForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const studentId = document.getElementById('studentId').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    fetchAttendanceRecords(studentId, startDate, endDate);
});

function fetchAttendanceRecords(studentId, startDate, endDate) {
    let url = 'http://localhost:3002/attendance';
    if (studentId || startDate || endDate) {
        url += '?';
        if (studentId) url += `studentId=${studentId}&`;
        if (startDate) url += `startDate=${new Date(startDate).toISOString()}&`;
        if (endDate) url += `endDate=${new Date(endDate).toISOString()}&`;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            populateTable(data);
        })
        .catch(error => {
            console.error('Error fetching attendance records:', error);
        });
}

function populateTable(records) {
    const tbody = document.querySelector('#attendanceTable tbody');
    tbody.innerHTML = '';
    const addedStudentIds = new Set(); // Track added student IDs

records.sort((a, b) => new Date(b.punch_in_time) - new Date(a.punch_in_time)); // Sort records by punch-in time descending
records.forEach(record => {

        if (!addedStudentIds.has(record.student_id)) { // Check for duplicates
            addedStudentIds.add(record.student_id); // Add to the set
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.student_name}</td>
                <td>${record.student_id}</td>
                <td>${formatISTTimestamp(record.punch_in_time)}</td>
                <td>${record.punched_out ? formatISTTimestamp(record.punch_out_time) : 'Not punched out'}</td>
                <td>${calculateDuration(record.punch_in_time, record.punch_out_time)}</td>
            `;
            tbody.appendChild(row);
        }
    });
}

// Function to format timestamps as local time (IST)
function formatISTTimestamp(timestamp) {
    if (!timestamp) return 'Invalid Date';

    // Parse the timestamp into a Date object
    const date = new Date(timestamp);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
        console.error('Invalid date:', timestamp);
        return 'Invalid Date';
    }

    // Format the date and time as local time (IST)
    return date.toLocaleString('en-IN', {
        day: '2-digit', // Two-digit day
        month: '2-digit', // Two-digit month
        year: 'numeric', // Full year
        hour: '2-digit', // Two-digit hour
        minute: '2-digit', // Two-digit minute
        second: '2-digit', // Two-digit second
        hour12: true, // Use 12-hour format
    });
}

// Function to calculate duration between two timestamps
function calculateDuration(punchInTime, punchOutTime) {
    if (!punchInTime || !punchOutTime) return 'N/A';

    const punchIn = new Date(punchInTime);
    const punchOut = new Date(punchOutTime);

    // Calculate duration in milliseconds
    const durationMs = punchOut - punchIn;

    // Convert duration to HH:MM:SS format
    const duration = new Date(durationMs).toISOString().substr(11, 8);
    return duration;
}

// Add sorting functionality
document.querySelectorAll('#attendanceTable th').forEach(header => {
    header.addEventListener('click', () => {
        const column = header.textContent.toLowerCase().replace(' ', '_');
        sortTable(column);
    });
});

function sortTable(column) {
    const tbody = document.querySelector('#attendanceTable tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
        const aValue = a.querySelector(`td:nth-child(${
            column === 'student_name' ? 1 : 
            column === 'student_id' ? 2 : 
            column === 'punch_in_time' ? 3 : 4
        })`).textContent;
        const bValue = b.querySelector(`td:nth-child(${
            column === 'student_name' ? 1 : 
            column === 'student_id' ? 2 : 
            column === 'punch_in_time' ? 3 : 4
        })`).textContent;

        if (column === 'punch_in_time' || column === 'punch_out_time') {
            return new Date(aValue) - new Date(bValue);
        } else {
            return aValue.localeCompare(bValue);
        }
    });

    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
}
