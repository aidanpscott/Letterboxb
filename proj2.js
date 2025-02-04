// Function to calculate age in months
function calculateAgeInMonths(age) {
    return age * 12;
}

// Function to calculate birth year
function calculateBirthYear(age) {
    const currentYear = new Date().getFullYear();
    return currentYear - age;
}

// Function to generate inspirational message based on age
function generateMessage(age) {
    if (age < 20) {
        return "You have your whole reading journey ahead of you!";
    } else if (age < 30) {
        return "The perfect time to explore new literary worlds!";
    } else if (age < 50) {
        return "Your reading wisdom grows with each passing year!";
    } else {
        return "Your literary experience is truly valuable!";
    }
}

// Function to validate form data
function validateForm(formData) {
    const errors = [];

    if (!formData.name.trim()) {
        errors.push("Name is required");
    }

    if (!formData.age || formData.age < 1 || formData.age > 120) {
        errors.push("Please enter a valid age between 1 and 120");
    }

    if (!formData.bookTitle.trim()) {
        errors.push("Book title is required");
    }

    if (!formData.author.trim()) {
        errors.push("Author name is required");
    }

    if (!formData.genre) {
        errors.push("Please select a genre");
    }

    if (!formData.review.trim()) {
        errors.push("Please share your thoughts about the book");
    }

    return errors;
}

// Function to create result display
function createResultDisplay(formData, ageInMonths, birthYear) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'result-message';

    const html = `
        <h3>Hello, ${formData.name}!</h3>
        <p>At ${formData.age} years (${ageInMonths} months) old, you were born around ${birthYear}.</p>
        <p>${generateMessage(formData.age)}</p>
        <div class="book-details">
            <h4>Your Favorite Book:</h4>
            <p><strong>Title:</strong> ${formData.bookTitle}</p>
            <p><strong>Author:</strong> ${formData.author}</p>
            <p><strong>Genre:</strong> ${formData.genre}</p>
            <p><strong>Your Thoughts:</strong> ${formData.review}</p>
        </div>
    `;

    messageDiv.innerHTML = html;
    return messageDiv;
}

// Main form handler
function handleSubmit(event) {
    event.preventDefault();
    console.log("Form submission started");

    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        age: parseInt(document.getElementById('age').value),
        bookTitle: document.getElementById('bookTitle').value,
        author: document.getElementById('author').value,
        genre: document.getElementById('genre').value,
        review: document.getElementById('review').value
    };

    // Log form data
    console.log("Form Data:", formData);

    // Validate form
    const errors = validateForm(formData);
    if (errors.length > 0) {
        console.warn("Validation errors:", errors);
        alert(errors.join("\n"));
        return;
    }

    // Perform calculations
    const ageInMonths = calculateAgeInMonths(formData.age);
    const birthYear = calculateBirthYear(formData.age);

    // Log calculations
    console.log("Age in months:", ageInMonths);
    console.log("Birth year:", birthYear);

    // Create and display result
    const resultDisplay = createResultDisplay(formData, ageInMonths, birthYear);

    // Clear any existing results
    const existingResult = document.getElementById('formResult');
    if (existingResult) {
        existingResult.remove();
    }

    // Add new results
    resultDisplay.id = 'formResult';
    document.querySelector('.profile-section').appendChild(resultDisplay);

    // Store in localStorage for book-info.html
    localStorage.setItem('bookData', JSON.stringify({
        ...formData,
        ageInMonths,
        birthYear,
        message: generateMessage(formData.age)
    }));

    console.log("Form submission completed successfully");
}

// Event listener goes when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('bookForm');
    if (form) {
        form.addEventListener('submit', handleSubmit);
        console.log("Form event listener attached");
    }
});