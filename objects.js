/**
 * Project 8 - Reading Task Class

 */
class ReadingTask {
    /**
     * Constructor for creating a new ReadingTask
     * 
     * @param {Object} taskDetails - Details about the reading task
     * @param {string} taskDetails.bookTitle - Title of the book
     * @param {string} taskDetails.author - Author of the book
     * @param {number} taskDetails.totalPages - Total number of pages in the book
     * @param {number} taskDetails.currentPage - Current page the reader is on (default: 0)
     * @param {Date} taskDetails.startDate - Date when reading began (default: current date)
     * @param {Date} taskDetails.targetEndDate - Goal date for finishing the book (default: 30 days from now)
     * @param {string} taskDetails.notes - Reader's notes about the book (default: empty string)
     * @param {number} taskDetails.dailyGoal - Pages to read per day (default: calculated based on dates)
     */
    constructor(taskDetails) {
        // Required properties
        this.id = Date.now().toString(); // Generate unique ID based on timestamp
        this.bookTitle = taskDetails.bookTitle;
        this.author = taskDetails.author;
        this.totalPages = taskDetails.totalPages;

        // Optional properties with defaults
        this.currentPage = taskDetails.currentPage || 0;
        this.startDate = taskDetails.startDate || new Date();

        // Default target date is 30 days from start if not provided
        if (taskDetails.targetEndDate) {
            this.targetEndDate = new Date(taskDetails.targetEndDate);
        } else {
            this.targetEndDate = new Date(this.startDate);
            this.targetEndDate.setDate(this.targetEndDate.getDate() + 30);
        }

        this.notes = taskDetails.notes || '';

        // Calculate default daily goal if not provided
        if (taskDetails.dailyGoal) {
            this.dailyGoal = taskDetails.dailyGoal;
        } else {
            const daysToRead = this.getDaysLeft(this.startDate);
            this.dailyGoal = Math.ceil(this.totalPages / daysToRead);
        }

        // Initialize reading history
        this.readingSessions = [];

        // Add initial session if current page is greater than 0
        if (this.currentPage > 0) {
            this.addReadingSession(this.startDate, this.currentPage);
        }
    }

    /**
     * Update the current page number and record a reading session
     * 
     * @param {number} newPage - The new current page
     * @param {Date} date - Date of the reading session (default: current date)
     * @returns {boolean} - Whether the update was successful
     */
    updateProgress(newPage, date = new Date()) {
        // Validate input
        if (newPage < this.currentPage) {
            console.warn('New page cannot be less than current page');
            return false;
        }

        if (newPage > this.totalPages) {
            console.warn('New page cannot exceed total pages');
            return false;
        }

        // Calculate pages read in this session
        const pagesRead = newPage - this.currentPage;

        // Update current page
        this.currentPage = newPage;

        // Add reading session
        if (pagesRead > 0) {
            this.addReadingSession(date, pagesRead);
        }

        return true;
    }

    /**
     * Add a reading session to the history
     * 
     * @param {Date} date - Date of the reading session
     * @param {number} pagesRead - Number of pages read in this session
     */
    addReadingSession(date, pagesRead) {
        this.readingSessions.push({
            date: new Date(date),
            pagesRead: pagesRead
        });

        // Sort sessions by date (oldest first)
        this.readingSessions.sort((a, b) => a.date - b.date);
    }

    /**
     * Calculate the percentage of the book completed
     * 
     * @returns {number} - Completion percentage (0-100)
     */
    calculatePercentComplete() {
        return Math.round((this.currentPage / this.totalPages) * 100);
    }

    /**
     * Calculate how many pages should be read per day to finish on target
     * 
     * @returns {number} - Pages per day needed
     */
    calculatePagesPerDay() {
        const daysLeft = this.getDaysLeft();
        const pagesLeft = this.totalPages - this.currentPage;

        if (daysLeft <= 0) {
            return pagesLeft; // All remaining pages today if target date is today or past
        }

        return Math.ceil(pagesLeft / daysLeft);
    }

    /**
     * Calculate the average number of pages read per day so far
     * 
     * @returns {number} - Average pages per day
     */
    calculateAveragePagesPerDay() {
        if (this.readingSessions.length === 0) {
            return 0;
        }

        // Calculate total pages read
        const totalPagesRead = this.readingSessions.reduce(
            (total, session) => total + session.pagesRead, 0
        );

        // Calculate days elapsed since start
        const firstSession = this.readingSessions[0].date;
        const lastSession = this.readingSessions[this.readingSessions.length - 1].date;
        const daysElapsed = Math.max(1, Math.ceil((lastSession - firstSession) / (1000 * 60 * 60 * 24)));

        return Math.round(totalPagesRead / daysElapsed);
    }

    /**
     * Determine if the reader is on track to meet their target end date
     * 
     * @returns {boolean} - Whether the reader is on track
     */
    isOnTrack() {
        const currentPagesPerDay = this.calculateAveragePagesPerDay();
        const neededPagesPerDay = this.calculatePagesPerDay();

        return currentPagesPerDay >= neededPagesPerDay;
    }

    /**
     * Calculate the number of days left until the target end date
     * 
     * @param {Date} fromDate - The date to calculate from (default: current date)
     * @returns {number} - Number of days left
     */
    getDaysLeft(fromDate = new Date()) {
        const currentDate = new Date(fromDate);
        const timeDiff = this.targetEndDate.getTime() - currentDate.getTime();
        return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    }

    /**
     * Format a date as a readable string
     * 
     * @param {Date} date - The date to format
     * @returns {string} - Formatted date string
     */
    formatDate(date) {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    /**
     * Create a summary of the reading task
     * 
     * @returns {Object} - Summary of reading progress and stats
     */
    getSummary() {
        return {
            id: this.id,
            bookTitle: this.bookTitle,
            author: this.author,
            progress: {
                currentPage: this.currentPage,
                totalPages: this.totalPages,
                percentComplete: this.calculatePercentComplete()
            },
            dates: {
                startDate: this.formatDate(this.startDate),
                targetEndDate: this.formatDate(this.targetEndDate),
                daysLeft: this.getDaysLeft()
            },
            pace: {
                dailyGoal: this.dailyGoal,
                currentPace: this.calculateAveragePagesPerDay(),
                neededPace: this.calculatePagesPerDay(),
                isOnTrack: this.isOnTrack()
            },
            sessions: this.readingSessions.length
        };
    }

    /**
     * Convert the reading task to JSON format for storage
     * 
     * @returns {string} - JSON string representation of the reading task
     */
    toJSON() {
        return JSON.stringify({
            id: this.id,
            bookTitle: this.bookTitle,
            author: this.author,
            totalPages: this.totalPages,
            currentPage: this.currentPage,
            startDate: this.startDate.toISOString(),
            targetEndDate: this.targetEndDate.toISOString(),
            notes: this.notes,
            dailyGoal: this.dailyGoal,
            readingSessions: this.readingSessions.map(session => ({
                date: session.date.toISOString(),
                pagesRead: session.pagesRead
            }))
        });
    }

    /**
     * Create a ReadingTask from JSON data
     * 
     * @param {string} json - JSON string of a reading task
     * @returns {ReadingTask} - New ReadingTask object
     */
    static fromJSON(json) {
        const data = JSON.parse(json);

        // Create basic task
        const task = new ReadingTask({
            bookTitle: data.bookTitle,
            author: data.author,
            totalPages: data.totalPages,
            currentPage: data.currentPage,
            startDate: new Date(data.startDate),
            targetEndDate: new Date(data.targetEndDate),
            notes: data.notes,
            dailyGoal: data.dailyGoal
        });

        // Override the generated ID with stored ID
        task.id = data.id;

        // Clear default reading session
        task.readingSessions = [];

        // Add all stored reading sessions
        if (data.readingSessions && Array.isArray(data.readingSessions)) {
            data.readingSessions.forEach(session => {
                task.readingSessions.push({
                    date: new Date(session.date),
                    pagesRead: session.pagesRead
                });
            });
        }

        return task;
    }
}

// Export the class for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ReadingTask };
}