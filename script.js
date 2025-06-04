document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('qr-video');
    const canvas = document.getElementById('qr-canvas');
    const startScannerBtn = document.getElementById('start-scanner');
    const stopScannerBtn = document.getElementById('stop-scanner');
    const cardContainer = document.getElementById('card-container');
    const bookAppointmentBtn = document.getElementById('book-appointment');
    const notification = document.getElementById('notification');
    
    let scanning = false;
    let stream = null;
    
    // Start scanner button click handler
    startScannerBtn.addEventListener('click', startScanner);
    
    // Stop scanner button click handler
    stopScannerBtn.addEventListener('click', stopScanner);
    
    // Book appointment button click handler
    bookAppointmentBtn.addEventListener('click', copyTollFreeNumber);
    
    function startScanner() {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
            .then(function(s) {
                stream = s;
                video.srcObject = stream;
                video.play();
                scanning = true;
                startScannerBtn.style.display = 'none';
                stopScannerBtn.style.display = 'inline-block';
                scanQRCode();
            })
            .catch(function(err) {
                console.error("Error accessing camera: ", err);
                showNotification('Error accessing camera. Please ensure you have granted camera permissions.');
            });
    }
    
    function stopScanner() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        scanning = false;
        startScannerBtn.style.display = 'inline-block';
        stopScannerBtn.style.display = 'none';
    }
    
    function scanQRCode() {
        if (!scanning) return;
        
        const canvasElement = document.getElementById('qr-canvas');
        const canvas = canvasElement.getContext('2d');
        
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvasElement.height = video.videoHeight;
            canvasElement.width = video.videoWidth;
            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
            
            const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });
            
            if (code) {
                // Assuming QR code contains the patient ID
                const patientId = code.data;
                fetchPatientData(patientId);
                stopScanner();
            }
        }
        
        requestAnimationFrame(scanQRCode);
    }
    
    function fetchPatientData(patientId) {
        fetch(`http://localhost:3000/api/patient/${patientId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Patient not found');
                }
                return response.json();
            })
            .then(data => {
                // Update the card with patient data
                document.getElementById('patient-name').textContent = data.name;
                document.getElementById('patient-id').textContent = data.id;
                document.getElementById('patient-plan').textContent = data.plan;
                document.getElementById('patient-valid-date').textContent = data.valid_date;
                document.getElementById('image').src = data.image || 'https://via.placeholder.com/150?text=No+Image';

                // Store toll-free number in the button's data attribute
                bookAppointmentBtn.dataset.tollFreeNumber = data.toll_free_number;
                
                // Show the card
                cardContainer.style.display = 'block';
            })
            .catch(error => {
                console.error('Error fetching patient data:', error);
                showNotification('Patient not found. Please try again.');
            });
    }
    
    function copyTollFreeNumber() {
        const tollFreeNumber = bookAppointmentBtn.dataset.tollFreeNumber;
        if (!tollFreeNumber) {
            showNotification('No toll-free number available');
            return;
        }
        
        navigator.clipboard.writeText(tollFreeNumber)
            .then(() => {
                showNotification('Toll-free number copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                showNotification('Failed to copy number. Please copy manually: ' + tollFreeNumber);
            });
    }
    
    function showNotification(message) {
        notification.textContent = message;
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
});