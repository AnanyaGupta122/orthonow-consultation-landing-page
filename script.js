/**
 * OrthoNow Landing Page JavaScript
 * Handles form validation, submissions, and GTM dataLayer events.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Select all consultation forms on the page
    const forms = document.querySelectorAll('.consultation-form');
    
    // Regular expression for Indian Mobile Numbers (10 digits starting with 6,7,8,9)
    const mobileRegex = /^[6-9]\d{9}$/;

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission
            
            let isValid = true;
            
            // Clear previous errors
            clearErrors(form);

            // Get inputs
            const nameInput = form.querySelector('input[name="name"]');
            const phoneInput = form.querySelector('input[name="phone"]');
            const submitBtn = form.querySelector('.submit-btn');
            
            // Validate Full Name
            if (!nameInput.value.trim()) {
                showError(nameInput, "Please enter your full name");
                isValid = false;
            } else if (nameInput.value.trim().length < 2) {
                showError(nameInput, "Name must be at least 2 characters long");
                isValid = false;
            }

            // Validate Mobile Number
            if (!phoneInput.value.trim()) {
                showError(phoneInput, "Please enter your mobile number");
                isValid = false;
            } else if (!mobileRegex.test(phoneInput.value.trim())) {
                showError(phoneInput, "Please enter a valid 10-digit Indian mobile number");
                isValid = false;
            }

            // If valid, process submission
            if (isValid) {
                // Disable button and show processing state
                const originalBtnText = submitBtn.textContent;
                submitBtn.disabled = true;
                submitBtn.textContent = "Processing...";

                // Simulate API Call / Processing
                setTimeout(() => {
                    // 1. Push to dataLayer
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({
                        'event': 'consultation_form_submitted',
                        'formLocation': form.id === 'hero-consultation-form' ? 'hero' : 'bottom',
                        'clinicLocation': 'bengaluru'
                    });

                    // 2. Show Success State
                    showSuccessState(form);
                    
                }, 1500); // 1.5 seconds simulated delay
            }
        });
    });

    /**
     * Shows inline error message for a specific input
     */
    function showError(input, message) {
        input.classList.add('is-invalid');
        input.setAttribute('aria-invalid', 'true');
        
        const errorMsg = document.createElement('span');
        errorMsg.className = 'error-message';
        errorMsg.setAttribute('role', 'alert');
        errorMsg.textContent = message;
        
        // Insert error message after the input field
        input.parentNode.appendChild(errorMsg);
    }

    /**
     * Clears all error messages within a form
     */
    function clearErrors(form) {
        // Remove invalid classes
        form.querySelectorAll('.is-invalid').forEach(input => {
            input.classList.remove('is-invalid');
            input.removeAttribute('aria-invalid');
        });
        
        // Remove error message elements
        form.querySelectorAll('.error-message').forEach(msg => {
            msg.remove();
        });
    }

    /**
     * Replaces the form with a success message state
     */
    function showSuccessState(form) {
        // Create success container
        const successContainer = document.createElement('div');
        successContainer.className = 'success-message';
        
        // Add content
        successContainer.innerHTML = `
            <h3>Booking Request Received!</h3>
            <p>Thank you. Our specialists will contact you within 2 minutes.</p>
        `;

        // Replace form with success container
        form.parentNode.replaceChild(successContainer, form);
    }
});
