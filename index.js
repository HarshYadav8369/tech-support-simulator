document.getElementById('ticketForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    
    try {
        const formData = new FormData(e.target);
        const response = await fetch('submit_ticket.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error || 'Submission failed');
        }

        // Display success
        document.getElementById('ticketId').textContent = result.ticketId;
        document.getElementById('ticketDisplay').style.display = 'block';
        updateTicketStatus();
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error: ' + error.message);
    } finally {
        submitBtn.disabled = false;
    }
});

function updateTicketStatus() {
    const statusSteps = document.querySelectorAll('.status-step');
    const progressBar = document.querySelector('.progress-bar');
    
    // Initial state
    statusSteps[0].classList.add('active');
    progressBar.style.width = '0%';
    
    // After 2 seconds: In Progress
    setTimeout(() => {
        statusSteps[1].classList.add('active');
        progressBar.style.width = '50%';
        
        // After another 3 seconds: Resolved
        setTimeout(() => {
            statusSteps[2].classList.add('active');
            progressBar.style.width = '100%';
        }, 3000);
    }, 2000);
}