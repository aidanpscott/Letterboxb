/**
 * Project 11 - Third-Party API Integration
 */

// Wait for DOM to be fully loaded before executing
document.addEventListener('DOMContentLoaded', function () {
    // Cache DOM elements
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const fetchBtn = document.getElementById('fetchBtn');
    const xhrBtn = document.getElementById('xhrBtn');
    const resultsContainer = document.getElementById('resultsContainer');
    const subjectTags = document.querySelectorAll('.subject-tag');

    // State variables
    let currentApiMethod = 'fetch'; // Default to using fetch API
    let isLoading = false;

    // Set up event listeners
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    fetchBtn.addEventListener('click', function () {
        setApiMethod('fetch');
    });

    xhrBtn.addEventListener('click', function () {
        setApiMethod('xhr');
    });

    // Add event listeners to subject tags
    subjectTags.forEach(tag => {
        tag.addEventListener('click', function () {
            const subject = this.getAttribute('data-subject');
            searchInput.value = '';
            searchBySubject(subject);
        });
    });

    /**
     * Sets the API method to use (fetch or XMLHttpRequest)
     * @param {string} method - The API method to use
     */
    function setApiMethod(method) {
        currentApiMethod = method;

        // Update UI to show which method is active
        if (method === 'fetch') {
            fetchBtn.classList.add('active');
            xhrBtn.classList.remove('active');
        } else {
            xhrBtn.classList.add('active');
            fetchBtn.classList.remove('active');
        }

        console.log(`API method set to: ${method}`);
    }

    /**
     * Performs a search based on the input value
     */
    function performSearch() {
        const query = searchInput.value.trim();
        if (!query) return;

        console.log(`Searching for: ${query}`);

        if (currentApiMethod === 'fetch') {
            searchBooksFetch(query);
        } else {
            searchBooksXHR(query);
        }
    }

    /**
     * Searches for books by subject
     * @param {string} subject - The subject to search for
     */
    function searchBySubject(subject) {
        console.log(`Searching by subject: ${subject}`);

        if (currentApiMethod === 'fetch') {
            searchBooksFetch(`subject:${subject}`);
        } else {
            searchBooksXHR(`subject:${subject}`);
        }
    }

    /**
     * Searches for books using the Fetch API
     * @param {string} query - The search query
     */
    function searchBooksFetch(query) {
        // Show loading state
        showLoading();

        // Construct URL with query parameters
        const url = constructSearchUrl(query);

        console.log(`Fetching data from: ${url}`);

        // Make the fetch request
        fetch(url)
            .then(response => {
                // Check if the response is ok (status 200-299)
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Data received:', data);
                displayResults(data);
            })
            .catch(error => {
                console.error('Fetch error:', error);
                showError(`Failed to fetch books: ${error.message}`);
            })
            .finally(() => {
                hideLoading();
            });
    }

    /**
     * Searches for books using XMLHttpRequest
     * @param {string} query - The search query
     */
    function searchBooksXHR(query) {
        // Show loading state
        showLoading();

        // Construct URL with query parameters
        const url = constructSearchUrl(query);

        console.log(`Fetching data with XMLHttpRequest from: ${url}`);

        // Create new XMLHttpRequest object
        const xhr = new XMLHttpRequest();

        // Configure the request
        xhr.open('GET', url, true);

        // Set up event handlers
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                // Success
                try {
                    const data = JSON.parse(xhr.responseText);
                    console.log('Data received:', data);
                    displayResults(data);
                } catch (e) {
                    console.error('Error parsing JSON:', e);
                    showError('Failed to parse response data');
                }
            } else {
                // Error
                console.error('XHR Error:', xhr.statusText);
                showError(`Request failed: ${xhr.status} ${xhr.statusText}`);
            }
            hideLoading();
        };

        xhr.onerror = function () {
            console.error('Network error occurred');
            showError('A network error occurred. Please check your connection and try again.');
            hideLoading();
        };

        xhr.ontimeout = function () {
            console.error('Request timed out');
            showError('The request timed out. Please try again later.');
            hideLoading();
        };

        // Set timeout to 10 seconds
        xhr.timeout = 10000;

        // Send the request
        xhr.send();
    }

    /**
     * Constructs the search URL with proper query parameters
     * @param {string} query - The search query
     * @returns {string} The constructed URL
     */
    function constructSearchUrl(query) {
        // Create URL object
        const url = new URL('https://openlibrary.org/search.json');

        // Add query parameters
        url.searchParams.append('q', query);
        url.searchParams.append('limit', '20'); // Limit results to 20 books

        return url.toString();
    }

    /**
     * Displays the search results in the UI
     * @param {Object} data - The data returned from the API
     */
    function displayResults(data) {
        // Clear previous results
        resultsContainer.innerHTML = '';

        // Check if we have results
        if (!data.docs || data.docs.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <p>No books found matching your search. Try a different query.</p>
                </div>
            `;
            return;
        }

        // Create results container
        const booksGrid = document.createElement('div');
        booksGrid.className = 'results-container';

        // Process each book
        data.docs.forEach(book => {
            // Create book card
            const bookCard = createBookCard(book);
            booksGrid.appendChild(bookCard);
        });

        // Add to DOM
        resultsContainer.appendChild(booksGrid);
    }

    /**
     * Creates a book card element for a single book
     * @param {Object} book - The book data
     * @returns {HTMLElement} The book card element
     */
    function createBookCard(book) {
        const card = document.createElement('div');
        card.className = 'book-card';

        // Determine cover image URL
        let coverUrl = null;
        if (book.cover_i) {
            coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
        }

        // Get author(s)
        const authors = book.author_name ? book.author_name.join(', ') : 'Unknown Author';

        // Get a limited number of subjects
        const subjects = book.subject ? book.subject.slice(0, 3) : [];

        // Create card HTML
        card.innerHTML = `
            ${coverUrl
                ? `<img src="${coverUrl}" alt="${book.title}" class="book-cover">`
                : `<div class="book-cover placeholder">No Cover Available</div>`
            }
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">by ${authors}</p>
                ${subjects.length > 0 ? `
                    <div class="book-subjects">
                        ${subjects.map(subject => `<span class="book-subject">${subject}</span>`).join('')}
                    </div>
                ` : ''}
                <a href="https://openlibrary.org${book.key}" target="_blank" class="book-read-more">View on Open Library</a>
            </div>
        `;

        return card;
    }

    /**
     * Shows a loading spinner
     */
    function showLoading() {
        isLoading = true;
        resultsContainer.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
            </div>
        `;
    }

    /**
     * Hides the loading spinner
     */
    function hideLoading() {
        isLoading = false;
    }

    /**
     * Shows an error message
     * @param {string} message - The error message to display
     */
    function showError(message) {
        resultsContainer.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
                <p>Please try again later or try a different search term.</p>
            </div>
        `;
    }
});