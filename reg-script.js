document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const id = document.getElementById('id').value;
    const name = document.getElementById('name').value;
    const plan = document.getElementById('plan').value;
    const valid_date = document.getElementById('valid_date').value;
    const toll_free_number = 123456789 ;
    
    // Client-side validation
    if (!name) {
        showMessage('Please provide a name', 'error');
        return;
    }
    
    // Prepare data for submission
    const formData = {
        id,
        name,
        plan,
        valid_date,
        toll_free_number
    };
    
    // Send data to server
    fetch('/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(data => {
        showMessage('Registration successful!', 'success');
        // Optional: reset form after successful submission
        document.getElementById('registrationForm').reset();
    })
    .catch(error => {
        console.error('Error:', error);
        const errorMsg = error.error || 'Registration failed. Please try again.';
        showMessage(errorMsg, 'error');
    });
});

function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = 'message ' + type;
    
    // Hide message after 5 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
    messageDiv.style.display = 'block';
}