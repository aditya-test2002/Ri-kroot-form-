// API endpoints
const API_ENDPOINT = 'https://ri-krootai.app.n8n.cloud/webhook/form-options';
const SUBMIT_ENDPOINT = 'https://ri-krootai.app.n8n.cloud/webhook/5c71a1df-7a00-4660-b22e-d1aa8107a7a2'; // Replace with your submit endpoint

// Get DOM elements
const selectField = document.getElementById('selectField');
const form = document.getElementById('dynamicForm');
const submitBtn = document.getElementById('submitBtn');
const messageDiv = document.getElementById('message');

// Fetch options from API and populate select field
async function loadSelectOptions() {
    try {
        const response = await fetch(API_ENDPOINT);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Clear loading option
        selectField.innerHTML = '<option value="">-- Select an option --</option>';

        // Populate select with options from API
        // Assuming API returns an array of objects with 'label' and 'value' properties
        data.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.label;
            selectField.appendChild(optionElement);
        });

        submitBtn.disabled = false;
        showMessage('Options loaded successfully', 'success');

    } catch (error) {
        console.error('Error fetching options:', error);
        selectField.innerHTML = '<option value="">Error loading options</option>';
        submitBtn.disabled = true;
        showMessage('Failed to load options. Please refresh the page.', 'error');
    }
}

// Handle form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const selectedValue = selectField.value;
    const selectedText = selectField.options[selectField.selectedIndex].text;

    if (!selectedValue) {
        showMessage('Please select an option', 'error');
        return;
    }

    // Disable submit button while processing
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
        // Send selected value to submit endpoint
        const response = await fetch(SUBMIT_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                value: selectedValue,
                label: selectedText
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Submit response:', result);

        showMessage(`Form submitted successfully! Selected: ${selectedText}`, 'success');

        // Optionally reset the form
        // form.reset();

    } catch (error) {
        console.error('Error submitting form:', error);
        showMessage('Failed to submit form. Please try again.', 'error');
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit';
    }
});

// Show message to user
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;

    // Clear message after 5 seconds
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = 'message';
    }, 5000);
}

// Load options when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadSelectOptions();
});
