// Project 9 - Page Customization System

// Initialize the customization system when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Create and add the customization form to the page
    createCustomizationForm();

    // Apply saved settings (from query string or cookies)
    applyCustomizations();

    // Set up event listener for the form submission
    setupFormHandler();

    // Display current settings to the user
    displayCurrentSettings();
});

// Function to create and add the customization form to the page
function createCustomizationForm() {
    // Create the form section
    const formSection = document.createElement('section');
    formSection.className = 'profile-section';
    formSection.id = 'customization-section';

    // Add form HTML
    formSection.innerHTML = `
        <h2 class="section-title">Customize Page Appearance</h2>
        <form id="customization-form" class="form-group">
            <div class="form-field">
                <label for="bgColor">Background Color:</label>
                <input type="color" id="bgColor" name="bgColor" value="#f5f5f5">
            </div>
            
            <div class="form-field">
                <label for="textColor">Text Color:</label>
                <input type="color" id="textColor" name="textColor" value="#2c3e50">
            </div>
            
            <div class="form-field">
                <label for="fontSize">Font Size:</label>
                <select id="fontSize" name="fontSize">
                    <option value="small">Small</option>
                    <option value="medium" selected>Medium</option>
                    <option value="large">Large</option>
                </select>
            </div>
            
            <div class="form-field">
                <label for="cookieExpiry">Remember for:</label>
                <select id="cookieExpiry" name="cookieExpiry">
                    <option value="1">1 Day</option>
                    <option value="7" selected>1 Week</option>
                    <option value="30">1 Month</option>
                    <option value="365">1 Year</option>
                </select>
            </div>
            
            <button type="submit" class="submit-btn">Apply Settings</button>
            <button type="button" id="reset-btn" class="submit-btn">Reset to Default</button>
        </form>
        
        <div id="settings-info" class="settings-info"></div>
    `;

    // Find where to insert the form (before the last section)
    const lastSection = document.querySelector('.profile-section:last-child');
    if (lastSection) {
        document.body.insertBefore(formSection, lastSection);
    } else {
        document.body.appendChild(formSection);
    }
}

// Function to parse query parameters from URL
function getQueryParams() {
    const params = {};
    const queryString = window.location.search.substring(1);

    if (queryString) {
        const pairs = queryString.split('&');
        for (const pair of pairs) {
            const [key, value] = pair.split('=');
            params[decodeURIComponent(key)] = decodeURIComponent(value);
        }
    }

    return params;
}

// Function to get a cookie by name
function getCookie(name) {
    const cookieString = document.cookie;
    const cookies = cookieString.split('; ');

    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === name) {
            return cookieValue;
        }
    }

    return null;
}

// Function to set a cookie with expiration
function setCookie(name, value, days) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);

    const cookieValue = `${name}=${value}; expires=${expiryDate.toUTCString()}; path=/`;
    document.cookie = cookieValue;
}

// Function to apply customizations from query params or cookies
function applyCustomizations() {
    // Get settings from URL query parameters first (higher priority)
    const queryParams = getQueryParams();

    // If no query params, try to get settings from cookies
    const bgColor = queryParams.bgColor || getCookie('bgColor') || '#f5f5f5';
    const textColor = queryParams.textColor || getCookie('textColor') || '#2c3e50';
    const fontSize = queryParams.fontSize || getCookie('fontSize') || 'medium';

    // Apply settings to the page
    document.body.style.backgroundColor = bgColor;
    document.body.style.color = textColor;

    // Apply font size
    let fontSizeValue;
    switch (fontSize) {
        case 'small':
            fontSizeValue = '14px';
            break;
        case 'large':
            fontSizeValue = '18px';
            break;
        default: // medium
            fontSizeValue = '16px';
    }
    document.body.style.fontSize = fontSizeValue;

    // Update form values to match current settings
    const form = document.getElementById('customization-form');
    if (form) {
        form.bgColor.value = bgColor;
        form.textColor.value = textColor;
        form.fontSize.value = fontSize;
    }
}

// Function to set up the form submission handler
function setupFormHandler() {
    const form = document.getElementById('customization-form');
    const resetBtn = document.getElementById('reset-btn');

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            // Get form values
            const bgColor = form.bgColor.value;
            const textColor = form.textColor.value;
            const fontSize = form.fontSize.value;
            const expiryDays = parseInt(form.cookieExpiry.value, 10);

            // Save settings in cookies
            setCookie('bgColor', bgColor, expiryDays);
            setCookie('textColor', textColor, expiryDays);
            setCookie('fontSize', fontSize, expiryDays);
            setCookie('cookieExpiry', expiryDays, expiryDays);

            // Create URL with query parameters
            const queryString = `?bgColor=${encodeURIComponent(bgColor)}&textColor=${encodeURIComponent(textColor)}&fontSize=${encodeURIComponent(fontSize)}`;

            // Update the URL (without reloading the page)
            window.history.replaceState({}, '', queryString);

            // Apply settings
            applyCustomizations();

            // Update display
            displayCurrentSettings();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            // Delete cookies by setting expiration to past date
            document.cookie = 'bgColor=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'textColor=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'fontSize=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'cookieExpiry=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

            // Clear URL parameters
            window.history.replaceState({}, '', window.location.pathname);

            // Reset to default values
            document.body.style.backgroundColor = '#f5f5f5';
            document.body.style.color = '#2c3e50';
            document.body.style.fontSize = '16px';

            // Reset form values
            const form = document.getElementById('customization-form');
            if (form) {
                form.bgColor.value = '#f5f5f5';
                form.textColor.value = '#2c3e50';
                form.fontSize.value = 'medium';
                form.cookieExpiry.value = '7';
            }

            // Update display
            displayCurrentSettings();
        });
    }
}

// Function to display current settings to the user
function displayCurrentSettings() {
    const settingsInfo = document.getElementById('settings-info');

    if (settingsInfo) {
        // Get current settings
        const bgColor = getCookie('bgColor') || '#f5f5f5';
        const textColor = getCookie('textColor') || '#2c3e50';
        const fontSize = getCookie('fontSize') || 'medium';
        const expiryDays = getCookie('cookieExpiry') || '7';

        // Create expiry date string
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + parseInt(expiryDays, 10));
        const expiryDateString = expiryDate.toLocaleDateString();

        // Create a message with current settings
        settingsInfo.innerHTML = `
            <h3>Current Settings</h3>
            <p><strong>Background Color:</strong> <span style="background-color: ${bgColor}; padding: 2px 10px; border: 1px solid #ddd;">${bgColor}</span></p>
            <p><strong>Text Color:</strong> <span style="background-color: ${textColor}; color: white; padding: 2px 10px; border: 1px solid #ddd;">${textColor}</span></p>
            <p><strong>Font Size:</strong> ${fontSize}</p>
            <p><strong>Settings saved until:</strong> ${expiryDateString}</p>
            <p><strong>Shareable URL with your settings:</strong><br>
            <a href="${window.location.pathname}?bgColor=${encodeURIComponent(bgColor)}&textColor=${encodeURIComponent(textColor)}&fontSize=${encodeURIComponent(fontSize)}">
                ${window.location.pathname}?bgColor=${bgColor}&textColor=${textColor}&fontSize=${fontSize}
            </a></p>
            <p class="source-note"><strong>Source:</strong> ${getCookie('bgColor') ? 'Cookies' : (getQueryParams().bgColor ? 'URL Parameters' : 'Default Settings')}</p>
        `;
    }
}