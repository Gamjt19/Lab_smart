const codeReader = new ZXing.BrowserQRCodeReader();
const videoElement = document.getElementById('videoElement');
const resultDiv = document.getElementById('result');
const punchInButton = document.getElementById('punchInButton');
const punchOutButton = document.getElementById('punchOutButton');
const punchInTimeElement = document.getElementById('punchInTime');
const punchOutTimeElement = document.getElementById('punchOutTime');
let studentId; // Declare studentId variable
let punchedIn = false; // Track punch-in status
let scanning = false;


console.log('Attempting to start camera...'); // Debugging log


// Function to start camera and scan QR code
function startScanning() {
    console.log('Accessing video camera...');
    scanning = true;

    codeReader.decodeFromVideoDevice(null, videoElement, (result, error) => {
        if (!scanning) return; // Prevent multiple scans

        if (result) {
            console.log(`QR Code detected: ${result.text}`);
            scanning = false;
            codeReader.reset(); // 🚫 Stop camera + QR scanning
            verifyStudent(result.text); // Proceed to verification
        }

        if (error) {
            if (error instanceof ZXing.NotFoundException) {
                resultDiv.textContent = 'No QR Code found.';
            } else {
                console.error('Error accessing camera:', error);
                resultDiv.textContent = 'Error accessing camera: ' + error.message;
            }
        }
    });

    // Disable mirror effect
    videoElement.style.transform = 'scaleX(-1)';
}


// Function to verify student with a backend check
function verifyStudent(qrCodeUrl) {
    // Extract student ID from the URL
    studentId = qrCodeUrl.split('/').pop(); // Get the last part of the URL

    // Fetch the student data from the backend
    fetch(`http://localhost:3002/verify/${studentId}`) // Updated URL
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            resultDiv.textContent = `${data.message} - Name: ${data.name}`; // Display the verification result and student's name
            if (data.message === "Student found") {
                // Show dropdown notification
                showNotification(`${studentId} successfully verified`);
                    punchInButton.style.display = 'block'; // Show punch-in button
                    punchOutButton.style.display = 'block'; // Show punch-out button
                    resultDiv.textContent = `${data.name} Verification complete!` ; // Update message
                    videoElement.style.pointerEvents = 'auto'; // Re-enable interactions
            } else {
                punchInButton.style.display = 'none'; // Hide buttons if not found
                punchOutButton.style.display = 'none';
            }
        })
        .catch(error => {
            resultDiv.textContent = 'Error verifying student: ' + error.message;
            console.error('Error:', error);
        });
}

// Function to show dropdown notification
// Function to show notification
function showNotification(message, type = 'success') {
    const popup = document.createElement('div');
    popup.className = `popup-notification ${type}`; // Add class based on type
    popup.textContent = message;

    document.body.appendChild(popup);

    // Remove the popup after the animation ends
    setTimeout(() => {
        popup.remove();
    }, 3000); // Matches the fadeOut animation duration
}

// Function to show loading animation
function showLoadingAnimation() {
    const loadingContainer = document.createElement('div');
    loadingContainer.className = 'loading-container';

    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';

    const text = document.createElement('div');
    text.className = 'loading-text';
    text.textContent = 'Processing...';

    loadingContainer.appendChild(spinner);
    loadingContainer.appendChild(text);
    document.body.appendChild(loadingContainer);
}

// Function to hide loading animation
function hideLoadingAnimation() {
    const loadingContainer = document.querySelector('.loading-container');
    if (loadingContainer) {
        loadingContainer.remove();
    }
}

function punchIn() {
    console.log('Punch-in function called with studentId:', studentId);

    if (!studentId) {
        resultDiv.textContent = "Error: No student ID detected.";
        return;
    }

    showLoadingAnimation(); // Show loading animation

    console.log('Sending punch-in request to the server...');

    fetch(`http://localhost:3002/punch-in/${studentId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        hideLoadingAnimation(); // Hide loading animation
        resultDiv.textContent = data.message;
        showNotification(data.message, data.success ? 'success' : 'error'); // Show notification
        
        if (data.success) { 
            punchedIn = true;
            punchInButton.disabled = true;
            punchInButton.style.backgroundColor = '#ccc';
            punchInButton.style.cursor = 'not-allowed';
            punchOutButton.disabled = false;

            const beep = new Audio('beep.mp3');
            beep.play();
            beep.onended = () => {
                location.reload();
            };
        } else {
            punchInButton.disabled = false;
            const errorSound = new Audio('error.mp3');
            errorSound.play();
        }
    })
    .catch(error => {
        hideLoadingAnimation(); // Hide loading animation
        resultDiv.textContent = 'Error punching in: ' + error.message;
        console.error('Error:', error);
    });
}

// Function to handle punch-out
function punchOut() {
    console.log('Punch-out function called with studentId:', studentId);

    if (!studentId) {
        resultDiv.textContent = "Error: No student ID detected.";
        return;
    }

    showLoadingAnimation(); // Show loading animation

    console.log('Sending punch-out request to the server...');

    fetch(`http://localhost:3002/punch-out/${studentId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        hideLoadingAnimation(); // Hide loading animation
        resultDiv.textContent = data.message;
        showNotification(data.message, data.success ? 'success' : 'error'); // Show notification

        if (data.success) {
            punchedIn = false;
            punchInButton.disabled = false; // Enable punch-in button
            punchOutButton.disabled = true;

            const beep = new Audio('beep.mp3');
            beep.play();
            beep.onended = () => {
                location.reload();
            };

        } else {
            punchOutButton.disabled = false;
            const errorSound = new Audio('error.mp3');
            errorSound.play();
        }
    })
    .catch(error => {
        hideLoadingAnimation(); // Hide loading animation
        resultDiv.textContent = 'Error punching out: ' + error.message;
        console.error('Error:', error);
    });
}


// Add event listeners for punch-in and punch-out buttons
punchInButton.addEventListener('click', punchIn);
punchOutButton.addEventListener('click', punchOut);

// Start scanning when the page loads
startScanning();


