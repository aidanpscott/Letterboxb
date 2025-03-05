/**
 * Project 7 Stuff
 */

// Wait for the DOM to be fully loaded before executing
document.addEventListener('DOMContentLoaded', function () {
    // Check if we're on the book form page
    const bookForm = document.getElementById('bookForm');
    if (!bookForm) {
        console.warn('Book form not found on this page. Enhanced features not initialized.');
        return;
    }

    console.log('Initializing enhanced book form features...');

    // *** REQUIREMENT #1: Checkbox selection with array management ***

    // Initialize array to store selected categories
    let selectedCategories = [];

    // Create a categories section and add it to the form
    setupCategoriesSection();

    // Setup the categories display section
    const categoriesDisplaySection = document.createElement('div');
    categoriesDisplaySection.className = 'selected-categories-section';
    categoriesDisplaySection.innerHTML = `
        <h4>Selected Categories:</h4>
        <div id="categoriesDisplay" class="categories-display">
            <p class="empty-message">No categories selected yet.</p>
        </div>
    `;

    // Insert categories display after the categories section
    const categoriesSection = document.getElementById('categoriesSection');
    bookForm.insertBefore(categoriesDisplaySection, categoriesSection.nextSibling);

    // Add custom category input and button
    const customCategorySection = document.createElement('div');
    customCategorySection.className = 'custom-category-section';
    customCategorySection.innerHTML = `
        <div class="form-field">
            <label for="customCategory">Add Custom Category:</label>
            <div class="input-with-button">
                <input type="text" id="customCategory" placeholder="Enter a custom category">
                <button type="button" id="addCustomCategory" class="btn-add">Add</button>
            </div>
        </div>
    `;

    bookForm.insertBefore(customCategorySection, categoriesDisplaySection);

    // Add event listener for custom category button
    document.getElementById('addCustomCategory').addEventListener('click', function () {
        addCustomCategory();
    });

    // Allow pressing Enter to add custom category
    document.getElementById('customCategory').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addCustomCategory();
        }
    });

    // *** REQUIREMENT #2: Regular expression for phone field ***

    // Add a phone number field to the form
    const phoneNumberField = document.createElement('div');
    phoneNumberField.className = 'form-field';
    phoneNumberField.innerHTML = `
        <label for="phoneNumber">Your Phone Number (optional):</label>
        <input type="tel" id="phoneNumber" name="phoneNumber" placeholder="e.g. 123-456-7890 or 1234567890">
        <p class="field-hint">Enter with or without hyphens (123-456-7890 or 1234567890)</p>
    `;

    // Insert the phone field after the age field
    const ageField = document.querySelector('.form-field:nth-child(2)'); // Age is the second field
    bookForm.insertBefore(phoneNumberField, ageField.nextSibling);

    // Add validation for phone number when form is submitted
    bookForm.addEventListener('submit', function (event) {
        const phoneInput = document.getElementById('phoneNumber');
        if (phoneInput.value.trim() !== '') {
            if (!isValidPhoneNumber(phoneInput.value)) {
                event.preventDefault();
                alert('Please enter a valid 10-digit phone number (with or without hyphens).');
                phoneInput.focus();
            }
        }
    });

    // *** REQUIREMENT #3: File upload and display ***

    // Add file upload section to the form
    const fileUploadSection = document.createElement('div');
    fileUploadSection.className = 'form-field file-upload-section';
    fileUploadSection.innerHTML = `
        <label for="bookExcerpt">Upload Book Excerpt or Review (optional):</label>
        <input type="file" id="bookExcerpt" name="bookExcerpt" accept=".txt,.md,.doc,.docx">
        <p class="field-hint">Upload a text file containing an excerpt or review</p>
        <div id="fileContents" class="file-contents-preview" style="display: none;">
            <h4>File Contents:</h4>
            <pre id="fileContentsText"></pre>
        </div>
    `;

    // Insert file upload section before the review textarea
    const reviewField = document.querySelector('.form-field:nth-child(7)'); // Review is the 7th field
    bookForm.insertBefore(fileUploadSection, reviewField);

    // Add event listener for file upload
    document.getElementById('bookExcerpt').addEventListener('change', function (event) {
        handleFileUpload(event);
    });

    // Function to setup the categories section
    function setupCategoriesSection() {
        // Define common book categories
        const bookCategories = [
            'Fantasy', 'Science Fiction', 'Mystery', 'Thriller',
            'Romance', 'Historical Fiction', 'Non-Fiction', 'Biography',
            'Self-Help', 'Horror', 'Young Adult', 'Children\'s'
        ];

        // Create container for categories
        const categoriesSection = document.createElement('div');
        categoriesSection.id = 'categoriesSection';
        categoriesSection.className = 'form-field categories-section';

        // Create heading
        const categoriesHeading = document.createElement('label');
        categoriesHeading.textContent = 'Book Categories (select all that apply):';
        categoriesSection.appendChild(categoriesHeading);

        // Create checkboxes container
        const checkboxesContainer = document.createElement('div');
        checkboxesContainer.className = 'checkboxes-container';

        // Add checkboxes for each category
        bookCategories.forEach(category => {
            const checkboxWrapper = document.createElement('div');
            checkboxWrapper.className = 'checkbox-wrapper';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `category-${category.toLowerCase().replace(/\s+/g, '-')}`;
            checkbox.value = category;
            checkbox.className = 'category-checkbox';

            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = category;

            // Add event listener to each checkbox
            checkbox.addEventListener('change', function () {
                if (this.checked) {
                    addCategory(this.value);
                } else {
                    removeCategory(this.value);
                }
            });

            checkboxWrapper.appendChild(checkbox);
            checkboxWrapper.appendChild(label);
            checkboxesContainer.appendChild(checkboxWrapper);
        });

        categoriesSection.appendChild(checkboxesContainer);

        // Insert the categories section before the genre dropdown
        const genreField = document.querySelector('.form-field:nth-child(5)'); // Genre is the 5th field
        bookForm.insertBefore(categoriesSection, genreField);
    }

    // Function to add a category to the array and update display
    function addCategory(category) {
        // Check if category is already in the array
        if (!selectedCategories.includes(category)) {
            selectedCategories.push(category);
            updateCategoriesDisplay();
            console.log(`Category added: ${category}`);
            console.log('Current categories:', selectedCategories);
        }
    }

    // Function to remove a category from the array and update display
    function removeCategory(category) {
        // Find the index of the category
        const index = selectedCategories.indexOf(category);

        // Remove if found
        if (index !== -1) {
            selectedCategories.splice(index, 1);
            updateCategoriesDisplay();
            console.log(`Category removed: ${category}`);
            console.log('Current categories:', selectedCategories);
        }
    }

    // Function to update the categories display
    function updateCategoriesDisplay() {
        const displayElement = document.getElementById('categoriesDisplay');

        // Clear current display
        displayElement.innerHTML = '';

        // Show empty message if no categories
        if (selectedCategories.length === 0) {
            displayElement.innerHTML = '<p class="empty-message">No categories selected yet.</p>';
            return;
        }

        // Create a container for the category badges
        const badgesContainer = document.createElement('div');
        badgesContainer.className = 'category-badges';

        // Add each category as a badge
        selectedCategories.forEach(category => {
            const badge = document.createElement('span');
            badge.className = 'category-badge';
            badge.innerHTML = `
                ${category}
                <button type="button" class="remove-category" data-category="${category}">&times;</button>
            `;
            badgesContainer.appendChild(badge);
        });

        // Add badges to display
        displayElement.appendChild(badgesContainer);

        // Add event listeners to remove buttons
        const removeButtons = displayElement.querySelectorAll('.remove-category');
        removeButtons.forEach(button => {
            button.addEventListener('click', function () {
                const categoryToRemove = this.getAttribute('data-category');

                // Uncheck the corresponding checkbox if it exists
                const checkboxId = `category-${categoryToRemove.toLowerCase().replace(/\s+/g, '-')}`;
                const checkbox = document.getElementById(checkboxId);
                if (checkbox) {
                    checkbox.checked = false;
                }

                removeCategory(categoryToRemove);
            });
        });
    }

    // Function to add a custom category
    function addCustomCategory() {
        const customCategoryInput = document.getElementById('customCategory');
        const customCategory = customCategoryInput.value.trim();

        if (customCategory) {
            addCategory(customCategory);
            customCategoryInput.value = '';
        } else {
            alert('Please enter a category name.');
        }
    }

    // Function to validate phone number using regular expression
    function isValidPhoneNumber(phone) {
        // Remove any hyphens or spaces from the input
        const cleanedPhone = phone.replace(/[-\s]/g, '');

        // Check if it's a valid 10-digit number
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(cleanedPhone);
    }

    // Function to handle file upload and display contents
    function handleFileUpload(event) {
        const file = event.target.files[0];
        const fileContentsDiv = document.getElementById('fileContents');
        const fileContentsText = document.getElementById('fileContentsText');

        if (!file) {
            fileContentsDiv.style.display = 'none';
            return;
        }

        // Check if file is too large (>1MB)
        if (file.size > 1024 * 1024) {
            alert('File is too large. Please upload a file smaller than 1MB.');
            event.target.value = '';
            fileContentsDiv.style.display = 'none';
            return;
        }

        // Read the file contents
        const reader = new FileReader();

        reader.onload = function (e) {
            const contents = e.target.result;
            fileContentsText.textContent = contents;
            fileContentsDiv.style.display = 'block';
        };

        reader.onerror = function () {
            alert('Error reading file.');
            fileContentsDiv.style.display = 'none';
        };

        reader.readAsText(file);
    }

    // Update the original form handler to include the new data
    const originalSubmitHandler = bookForm.onsubmit;
    bookForm.onsubmit = function (event) {
        // Prevent default form submission
        event.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            age: parseInt(document.getElementById('age').value),
            phoneNumber: document.getElementById('phoneNumber').value,
            bookTitle: document.getElementById('bookTitle').value,
            author: document.getElementById('author').value,
            genre: document.getElementById('genre').value,
            categories: selectedCategories,
            review: document.getElementById('review').value
        };

        // Validate phone if provided
        if (formData.phoneNumber && !isValidPhoneNumber(formData.phoneNumber)) {
            alert('Please enter a valid 10-digit phone number (with or without hyphens).');
            return;
        }

        // Store the categories with the book data
        const bookData = {
            ...formData,
            categories: selectedCategories
        };

        // Store in localStorage for book-info.html
        localStorage.setItem('bookData', JSON.stringify(bookData));

        // Display success message with categories
        const messageDiv = document.createElement('div');
        messageDiv.className = 'result-message';

        let categoriesHtml = '';
        if (selectedCategories.length > 0) {
            categoriesHtml = `
                <div class="selected-categories">
                    <h4>Selected Categories:</h4>
                    <p>${selectedCategories.join(', ')}</p>
                </div>
            `;
        }

        // Display the uploaded file info if there is one
        let fileInfoHtml = '';
        const fileInput = document.getElementById('bookExcerpt');
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            fileInfoHtml = `
                <div class="uploaded-file-info">
                    <h4>Uploaded File:</h4>
                    <p>${file.name} (${Math.round(file.size / 1024)} KB)</p>
                </div>
            `;
        }

        const html = `
            <h3>Thank you, ${formData.name}!</h3>
            <p>Your book information has been saved:</p>
            <div class="book-details">
                <p><strong>Title:</strong> ${formData.bookTitle}</p>
                <p><strong>Author:</strong> ${formData.author}</p>
                <p><strong>Primary Genre:</strong> ${formData.genre}</p>
                ${categoriesHtml}
                ${fileInfoHtml}
            </div>
            <p>You can view your submission on the <a href="book-info.html">Book Info</a> page.</p>
        `;

        messageDiv.innerHTML = html;

        // Clear any existing results
        const existingResult = document.getElementById('formResult');
        if (existingResult) {
            existingResult.remove();
        }

        // Add new results
        messageDiv.id = 'formResult';
        document.querySelector('.profile-section').appendChild(messageDiv);

        // Scroll to the result
        messageDiv.scrollIntoView({ behavior: 'smooth' });

        console.log('Form submission completed with enhanced features!');
        console.log('Book data with categories:', bookData);
    };

    console.log('Enhanced book form features initialized successfully!');
});