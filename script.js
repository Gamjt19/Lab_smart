// Initialize ZXing library's QR code reader
const codeReader = new ZXing.BrowserQRCodeReader();
const videoElement = document.getElementById('videoElement');
const resultDiv = document.getElementById('result');

// Function to start camera and scan QR code
function startScanning() {
    // Access the video camera and start scanning
    codeReader.decodeFromVideoDevice(null, videoElement, (result, error) => {
        if (result) {
            resultDiv.textContent = `QR Code detected: ${result.text}`;
        }
        if (error) {
            if (error instanceof ZXing.NotFoundException) {
                resultDiv.textContent = 'No QR Code found.';
            }
        }
    });
}

// Start scanning when the page loads
startScanning();
