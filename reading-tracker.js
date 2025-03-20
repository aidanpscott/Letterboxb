/**
 * Project 8 - Reading Tracker Implementation
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Check if we're on the currently reading page
    const bookGrid = document.querySelector('.book-grid');
    if (!bookGrid) {
        console.log('Not on the currently reading page');
        return;
    }

    console.log('Initializing reading tracker');

    // Initialize the reading tracker
    initializeReadingTracker();
});

/**
 * Initialize the reading tracker functionality
 */
function initializeReadingTracker() {
    // Get the book cards from the page
    const bookCards = document.querySelectorAll('.book-card');

    // Store reading tasks
    const readingTasks = [];

    // Clear any existing reading tasks first
    localStorage.removeItem('readingTasks');

    // Load saved reading tasks from localStorage
    loadReadingTasks();

    // Add event listeners to page input fields
    setupInputListeners();

    // Add reading statistics section to the page
    addReadingStatsSection();

    /**
     * Load reading tasks from localStorage
     */
    function loadReadingTasks() {
        // Try to get saved reading tasks
        const savedTasks = localStorage.getItem('readingTasks');

        if (savedTasks) {
            try {
                // Parse the JSON array of tasks
                const taskArray = JSON.parse(savedTasks);

                // Create ReadingTask objects from the saved data
                taskArray.forEach(taskJson => {
                    // Create a new ReadingTask instance using the static fromJSON method
                    const task = ReadingTask.fromJSON(JSON.stringify(taskJson));
                    readingTasks.push(task);

                    // Update the UI with loaded task data
                    updateBookCardWithTask(task);
                });

                console.log(`Loaded ${readingTasks.length} reading tasks`);
            } catch (error) {
                console.error('Error loading reading tasks:', error);
            }
        } else {
            // If no tasks exist yet, create tasks from current book cards
            bookCards.forEach(card => {
                createTaskFromBookCard(card);
            });

            // Save the initial tasks
            saveReadingTasks();
        }
    }

    /**
     * Create a ReadingTask from a book card element
     * 
     * @param {HTMLElement} bookCard - The book card element
     * @returns {ReadingTask} - The created reading task
     */
    function createTaskFromBookCard(bookCard) {
        // Get book details from the card
        const title = bookCard.querySelector('h3').textContent;
        const authorElement = bookCard.querySelector('.book-author');
        const author = authorElement ? authorElement.textContent.replace('By ', '') : 'Unknown';

        // Get progress info
        const progressElement = bookCard.querySelector('.book-progress');
        const pageInput = progressElement.querySelector('.page-input');
        const currentPage = parseInt(pageInput.value) || 0;
        const totalPages = parseInt(pageInput.dataset.total) || 100;

        // Get data-book attribute to use as a reference
        const bookId = pageInput.dataset.book;

        // Create a new ReadingTask
        const task = new ReadingTask({
            bookTitle: title,
            author: author,
            totalPages: totalPages,
            currentPage: currentPage,
            // Default dates and goals
            startDate: new Date(),
            targetEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        });

        // Store the book ID for reference
        task.bookId = bookId;

        // Add to the tasks array
        readingTasks.push(task);

        // Update the UI with the task data
        updateBookCardWithTask(task);

        return task;
    }

    /**
     * Update a book card with data from a ReadingTask
     * 
     * @param {ReadingTask} task - The reading task
     */
    function updateBookCardWithTask(task) {
        // Find the book card for this task
        const bookCards = document.querySelectorAll('.book-card');
        let targetCard = null;

        for (const card of bookCards) {
            const title = card.querySelector('h3').textContent;
            if (title === task.bookTitle) {
                targetCard = card;
                break;
            }
        }

        if (!targetCard) {
            console.warn(`Book card not found for task: ${task.bookTitle}`);
            return;
        }

        // Get the progress element
        const progressElement = targetCard.querySelector('.book-progress');
        if (!progressElement) {
            console.warn(`Progress element not found for: ${task.bookTitle}`);
            return;
        }

        // Update page input value
        const pageInput = progressElement.querySelector('.page-input');
        if (pageInput) {
            pageInput.value = task.currentPage;

            // Dispatch change event to update the progress bar
            pageInput.dispatchEvent(new Event('change'));
        }

        // Check if reading stats section already exists
        let statsSection = targetCard.querySelector('.reading-stats');

        // Create it if it doesn't exist
        if (!statsSection) {
            statsSection = document.createElement('div');
            statsSection.className = 'reading-stats';
            targetCard.querySelector('.book-info').appendChild(statsSection);
        }

        // Update reading stats content
        const summary = task.getSummary();
        statsSection.innerHTML = `
            <div class="reading-pace ${summary.pace.isOnTrack ? 'on-track' : 'behind'}">
                <span class="pace-indicator">
                    ${summary.pace.isOnTrack ? '✓ On track' : '⚠ Behind schedule'}
                </span>
            </div>
            <div class="reading-details">
                <p><strong>Started:</strong> ${summary.dates.startDate}</p>
                <p><strong>Target:</strong> ${summary.dates.targetEndDate} 
                   (${summary.dates.daysLeft} days left)</p>
                <p><strong>Daily Goal:</strong> ${summary.pace.neededPace} pages/day</p>
                <p><strong>Current Pace:</strong> ${summary.pace.currentPace} pages/day</p>
            </div>
        `;
    }

    /**
     * Setup event listeners for page input fields
     */
    function setupInputListeners() {
        // Get all page input fields
        const pageInputs = document.querySelectorAll('.page-input');

        pageInputs.forEach(input => {
            // Replace the original change handler to use our ReadingTask system
            // Remove any existing event listeners
            const newInput = input.cloneNode(true);
            input.parentNode.replaceChild(newInput, input);

            // Add enhanced listener to the new input
            newInput.addEventListener('change', function (e) {
                const bookId = this.dataset.book;
                const newPage = parseInt(this.value);

                // Find the corresponding task
                const task = readingTasks.find(t => t.bookId === bookId);

                if (task) {
                    // Update the task progress
                    task.updateProgress(newPage);

                    // Update the UI
                    updateBookCardWithTask(task);

                    // Save changes
                    saveReadingTasks();

                    // Update the reading stats section
                    updateReadingStatsSection();

                    // Show a small notification to confirm update
                    showUpdateNotification(task);
                }
            });

            // Also add input event to make updates more responsive
            newInput.addEventListener('input', function (e) {
                const bookId = this.dataset.book;
                const newPage = parseInt(this.value);

                // Only proceed if the value is valid
                if (isNaN(newPage) || newPage < 0 || newPage > parseInt(this.dataset.total)) {
                    return;
                }

                // Find the corresponding task
                const task = readingTasks.find(t => t.bookId === bookId);

                if (task) {
                    // Temporarily update the task's current page for statistics calculation
                    const oldPage = task.currentPage;
                    task.currentPage = newPage;

                    // Update the stats immediately for a responsive feel
                    updateReadingStatsSection();

                    // Update just the progress visuals without saving yet
                    // This gives immediate feedback while typing
                    const percentage = ((newPage / task.totalPages) * 100).toFixed(1);
                    const progressBar = this.parentElement.querySelector('.progress');
                    const completion = this.parentElement.querySelector('.completion');

                    progressBar.style.width = `${percentage}%`;
                    completion.textContent = `${percentage}% complete`;

                    // If we're just in the input event (not change), restore the original value
                    // until the change is committed
                    if (e.type === 'input') {
                        task.currentPage = oldPage;
                    }
                }
            });
        });
    }

    /**
     * Save all reading tasks to localStorage
     */
    function saveReadingTasks() {
        try {
            // Convert tasks to plain objects for storage
            const tasksToSave = readingTasks.map(task => JSON.parse(task.toJSON()));

            // Save to localStorage
            localStorage.setItem('readingTasks', JSON.stringify(tasksToSave));
            console.log(`Saved ${tasksToSave.length} reading tasks`);
        } catch (error) {
            console.error('Error saving reading tasks:', error);
        }
    }

    /**
     * Add a reading statistics section to the page
     */
    function addReadingStatsSection() {
        // Create the section
        const statsSection = document.createElement('section');
        statsSection.className = 'profile-section reading-stats-section';
        statsSection.innerHTML = `
            <h2 class="section-title">Reading Statistics</h2>
            <div id="reading-stats-container">
                <div class="stats-summary">
                    <p>Loading reading statistics...</p>
                </div>
            </div>
        `;

        // Insert before the "About My Reading" section
        const aboutSection = document.querySelector('.profile-section:last-child');
        document.body.insertBefore(statsSection, aboutSection);

        // Update the stats display
        updateReadingStatsSection();
    }

    /**
     * Update the reading statistics section
     */
    /**
     * Shows a brief notification when a reading task is updated
     * @param {ReadingTask} task - The updated task
     */
    function showUpdateNotification(task) {
        // Create notification element if it doesn't exist
        let notification = document.querySelector('.update-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'update-notification';
            document.body.appendChild(notification);
        }

        // Update notification content
        notification.textContent = `Updated progress for "${task.bookTitle}" to ${task.currentPage} of ${task.totalPages} pages (${task.calculatePercentComplete()}%)`;
        notification.classList.add('show');

        // Hide notification after a delay
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    function updateReadingStatsSection() {
        const statsContainer = document.getElementById('reading-stats-container');
        if (!statsContainer) return;

        // Calculate overall statistics
        const totalBooks = readingTasks.length;
        const totalPages = readingTasks.reduce((sum, task) => sum + task.totalPages, 0);
        const totalPagesRead = readingTasks.reduce((sum, task) => sum + task.currentPage, 0);
        const overallPercent = Math.round((totalPagesRead / totalPages) * 100) || 0;

        // Count books on track
        const booksOnTrack = readingTasks.filter(task => task.isOnTrack()).length;
        const booksOffTrack = totalBooks - booksOnTrack;

        // Generate HTML for the stats
        statsContainer.innerHTML = `
            <div class="stats-summary">
                <div class="stat-box">
                    <div class="stat-value">${totalBooks}</div>
                    <div class="stat-label">Books in Progress</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${overallPercent}%</div>
                    <div class="stat-label">Overall Completion</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${totalPagesRead} / ${totalPages}</div>
                    <div class="stat-label">Pages Read</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${booksOnTrack} / ${totalBooks}</div>
                    <div class="stat-label">Books On Track</div>
                </div>
            </div>
            
            <div class="overall-progress">
                <div class="progress-label">Overall Reading Progress</div>
                <div class="progress-bar">
                    <div class="progress" style="width: ${overallPercent}%"></div>
                </div>
            </div>
        `;

        // Add reading projection if there are books
        if (totalBooks > 0) {
            const projectionContainer = document.createElement('div');
            projectionContainer.className = 'reading-projection';
            projectionContainer.innerHTML = `
                <h3>Reading Projections</h3>
                <ul class="projection-list">
                    ${readingTasks.map(task => {
                const summary = task.getSummary();
                return `
                            <li class="projection-item ${summary.pace.isOnTrack ? 'on-track' : 'behind'}">
                                <div class="book-info">
                                    <span class="book-title">${task.bookTitle}</span>
                                    <span class="completion">${summary.progress.percentComplete}% complete</span>
                                </div>
                                <div class="projection-details">
                                    <span class="finish-date">
                                        Projected Finish: ${summary.pace.isOnTrack ? summary.dates.targetEndDate : 'Delayed'}
                                    </span>
                                </div>
                            </li>
                        `;
            }).join('')}
                </ul>
            `;

            statsContainer.appendChild(projectionContainer);
        }
    }
}

// Example of creating a new ReadingTask instance using the new keyword
// This would typically be done when a user adds a new book to their reading list
/**
 * Create a new reading task for a book
 * 
 * @param {string} title - Book title
 * @param {string} author - Book author
 * @param {number} totalPages - Total pages in the book
 * @returns {ReadingTask} - New reading task
 */
function createNewReadingTask(title, author, totalPages) {
    // Create a new task using the ReadingTask constructor
    let newTask = new ReadingTask({
        bookTitle: title,
        author: author,
        totalPages: totalPages,
        currentPage: 0,
        startDate: new Date(),
        // Default target is 30 days from now
        targetEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    console.log(`Created new reading task for "${title}"`);
    return newTask;
}