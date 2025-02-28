/**
 * Project 4
 * 
 * This script provides comprehensive validation for a user registration form
 * with real-time feedback and error handling.
 */

// Wait for the DOM to be fully loaded before executing
document.addEventListener('DOMContentLoaded', function () {
    // Locate the registration form by using form element
    const registrationForm = document.querySelector('form.registration-form');

    // If the form doesn't exist on the page, log a warning and exit
    if (!registrationForm) {
        console.warn('Registration form not found on this page. Form validation not initialized.');
        return;
    }

    // Reference form elements
    const fullNameInput = registrationForm.querySelector('input[name="fullName"]');
    const usernameInput = registrationForm.querySelector('input[name="username"]');
    const emailInput = registrationForm.querySelector('input[name="email"]');
    const passwordInput = registrationForm.querySelector('input[name="password"]');
    const confirmPasswordInput = registrationForm.querySelector('input[name="confirmPassword"]');
    const phoneInput = registrationForm.querySelector('input[name="phone"]');
    const dobInput = registrationForm.querySelector('input[name="dateOfBirth"]');
    const termsCheckbox = registrationForm.querySelector('input[name="agreeTerms"]');

    // Create error message display elements for each input
    const formElements = [
        fullNameInput, usernameInput, emailInput, passwordInput,
        confirmPasswordInput, phoneInput, dobInput, termsCheckbox
    ];

    // Initialize error message containers for each input
    formElements.forEach(element => {
        if (element) {
            // Create error message container
            const errorSpan = document.createElement('span');
            errorSpan.className = 'error-message';
            errorSpan.style.color = 'red';
            errorSpan.style.fontSize = '0.85em';
            errorSpan.style.display = 'none';

            // Insert error message after the input element
            element.parentNode.insertBefore(errorSpan, element.nextSibling);

            // Add event listeners for real-time validation
            if (element !== termsCheckbox) {
                element.addEventListener('input', function () {
                    validateField(element);
                });

                element.addEventListener('blur', function () {
                    validateField(element);
                });
            } else {
                // For checkbox, use change event
                element.addEventListener('change', function () {
                    validateField(element);
                });
            }
        }
    });

    // Form submission handler
    registrationForm.addEventListener('submit', function (event) {
        try {
            // Prevent form submission by default
            event.preventDefault();

            // Clear all previous errors
            clearAllErrors();

            // Validate all fields
            let isValid = true;

            formElements.forEach(element => {
                if (element) {
                    const fieldValid = validateField(element);
                    isValid = isValid && fieldValid;
                }
            });

            // Additionally validate password match
            if (passwordInput && confirmPasswordInput) {
                const passwordsMatch = validatePasswordMatch(passwordInput, confirmPasswordInput);
                isValid = isValid && passwordsMatch;
            }

            // Submit the form if everything is valid
            if (isValid) {
                console.log('Form validation successful. Submitting form...');

                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.style.backgroundColor = '#d4edda';
                successMessage.style.color = '#155724';
                successMessage.style.padding = '10px';
                successMessage.style.borderRadius = '5px';
                successMessage.style.marginTop = '20px';
                successMessage.textContent = 'Registration successful! Welcome aboard.';

                registrationForm.appendChild(successMessage);

                // In a real application, you might uncomment the following line to submit the form
                // registrationForm.submit();
            } else {
                throw new Error('Form validation failed. Please correct the errors and try again.');
            }
        } catch (error) {
            // Log the error
            console.error('Form submission error:', error.message);

            // Display general error message at the top of the form
            const generalError = document.createElement('div');
            generalError.className = 'general-error';
            generalError.style.backgroundColor = '#f8d7da';
            generalError.style.color = '#721c24';
            generalError.style.padding = '10px';
            generalError.style.borderRadius = '5px';
            generalError.style.marginBottom = '20px';
            generalError.textContent = error.message;

            registrationForm.insertBefore(generalError, registrationForm.firstChild);

            // Auto-remove the error after 5 seconds
            setTimeout(() => {
                if (generalError.parentNode) {
                    generalError.parentNode.removeChild(generalError);
                }
            }, 5000);
        }
    });

    /**
     * Validates an individual form field based on its type
     * @param {HTMLElement} field - The form field to validate
     * @return {boolean} - Whether the field is valid
     */
    function validateField(field) {
        if (!field) return true;

        const errorSpan = field.nextElementSibling;
        if (!errorSpan || !errorSpan.classList.contains('error-message')) {
            console.warn('Error message element not found for:', field.name);
            return true;
        }

        let isValid = true;
        let errorMessage = '';

        try {
            const value = field.value.trim();
            const fieldName = field.name;

            switch (fieldName) {
                case 'fullName':
                    // Full name validation: non-empty, no numbers or special characters
                    if (!value) {
                        isValid = false;
                        errorMessage = 'Full name is required.';
                    } else if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(value)) {
                        isValid = false;
                        errorMessage = 'Full name should not contain numbers or special characters.';
                    }
                    break;

                case 'username':
                    // Username validation: 6-15 chars, alphanumeric, cannot start with number
                    if (!value) {
                        isValid = false;
                        errorMessage = 'Username is required.';
                    } else if (value.length < 6 || value.length > 15) {
                        isValid = false;
                        errorMessage = 'Username must be between 6 and 15 characters.';
                    } else if (/^[0-9]/.test(value)) {
                        isValid = false;
                        errorMessage = 'Username cannot start with a number.';
                    } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
                        isValid = false;
                        errorMessage = 'Username can only contain letters and numbers.';
                    }
                    break;

                case 'email':
                    // Email validation: valid email format
                    if (!value) {
                        isValid = false;
                        errorMessage = 'Email is required.';
                    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid email address (e.g., user@example.com).';
                    }
                    break;

                case 'password':
                    // Password validation: 8-20 chars, upper, lower, digit, special char
                    if (!value) {
                        isValid = false;
                        errorMessage = 'Password is required.';
                    } else if (value.length < 8 || value.length > 20) {
                        isValid = false;
                        errorMessage = 'Password must be between 8 and 20 characters.';
                    } else if (!/[A-Z]/.test(value)) {
                        isValid = false;
                        errorMessage = 'Password must contain at least one uppercase letter.';
                    } else if (!/[a-z]/.test(value)) {
                        isValid = false;
                        errorMessage = 'Password must contain at least one lowercase letter.';
                    } else if (!/[0-9]/.test(value)) {
                        isValid = false;
                        errorMessage = 'Password must contain at least one digit.';
                    } else if (!/[!@#$%^&*]/.test(value)) {
                        isValid = false;
                        errorMessage = 'Password must contain at least one special character (!@#$%^&*).';
                    }

                    // If password is valid and confirm password exists, validate match
                    if (isValid && confirmPasswordInput && confirmPasswordInput.value.trim()) {
                        validatePasswordMatch(passwordInput, confirmPasswordInput);
                    }
                    break;

                case 'confirmPassword':
                    // Confirm password validation: matches password
                    if (!value) {
                        isValid = false;
                        errorMessage = 'Please confirm your password.';
                    } else if (passwordInput && value !== passwordInput.value.trim()) {
                        isValid = false;
                        errorMessage = 'Passwords do not match.';
                    }
                    break;

                case 'phone':
                    // Phone validation: valid format (e.g., 123-456-7890)
                    if (!value) {
                        isValid = false;
                        errorMessage = 'Phone number is required.';
                    } else if (!/^\d{3}-\d{3}-\d{4}$/.test(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid phone number (e.g., 123-456-7890).';
                    }
                    break;

                case 'dateOfBirth':
                    // Date of birth validation: user must be at least 18 years old
                    if (!value) {
                        isValid = false;
                        errorMessage = 'Date of birth is required.';
                    } else {
                        const dob = new Date(value);
                        const today = new Date();
                        const eighteenYearsAgo = new Date();
                        eighteenYearsAgo.setFullYear(today.getFullYear() - 18);

                        if (isNaN(dob.getTime())) {
                            isValid = false;
                            errorMessage = 'Please enter a valid date.';
                        } else if (dob > eighteenYearsAgo) {
                            isValid = false;
                            errorMessage = 'You must be at least 18 years old to register.';
                        }
                    }
                    break;

                case 'agreeTerms':
                    // Terms checkbox validation: must be checked
                    if (!field.checked) {
                        isValid = false;
                        errorMessage = 'You must agree to the terms and conditions to continue.';
                    }
                    break;

                default:
                    console.warn(`Validation for ${fieldName} not implemented.`);
            }

            // Update UI based on validation result
            if (!isValid) {
                field.classList.add('invalid');
                errorSpan.textContent = errorMessage;
                errorSpan.style.display = 'block';
                console.warn(`Validation failed for ${fieldName}: ${errorMessage}`);
            } else {
                field.classList.remove('invalid');
                errorSpan.style.display = 'none';
            }
        } catch (error) {
            console.error(`Error validating ${field.name}:`, error);
            isValid = false;
        }

        return isValid;
    }

    /**
     * Specifically validates that password and confirm password match
     * @param {HTMLElement} passwordField - The password field
     * @param {HTMLElement} confirmField - The confirm password field
     * @return {boolean} - Whether the passwords match
     */
    function validatePasswordMatch(passwordField, confirmField) {
        if (!passwordField || !confirmField) return true;

        const errorSpan = confirmField.nextElementSibling;
        if (!errorSpan || !errorSpan.classList.contains('error-message')) return true;

        const password = passwordField.value.trim();
        const confirmPassword = confirmField.value.trim();

        if (confirmPassword && password !== confirmPassword) {
            confirmField.classList.add('invalid');
            errorSpan.textContent = 'Passwords do not match.';
            errorSpan.style.display = 'block';
            console.warn('Password validation failed: Passwords do not match');
            return false;
        }

        return true;
    }

    /**
     * Clears all error messages
     */
    function clearAllErrors() {
        const errorMessages = registrationForm.querySelectorAll('.error-message');
        errorMessages.forEach(span => {
            span.style.display = 'none';
        });

        const generalError = registrationForm.querySelector('.general-error');
        if (generalError) {
            generalError.remove();
        }

        // Remove invalid class from all inputs
        formElements.forEach(element => {
            if (element) {
                element.classList.remove('invalid');
            }
        });
    }

    // Check if password field has a show/hide password toggle button
    const togglePasswordButtons = registrationForm.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function () {
            const targetInput = document.querySelector(this.getAttribute('data-target'));
            if (targetInput) {
                if (targetInput.type === 'password') {
                    targetInput.type = 'text';
                    this.textContent = 'Hide';
                } else {
                    targetInput.type = 'password';
                    this.textContent = 'Show';
                }
            }
        });
    });

    console.log('Form validation initialized successfully.');
});