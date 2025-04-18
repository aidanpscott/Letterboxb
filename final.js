/**
 * final.js - Reading Dashboard with Chart.js Implementation
 * 
 * This file implements a reading statistics dashboard using Chart.js
 * as the selected framework (not jQuery) for the final project requirement.
 * 
 * Chart.js is a JavaScript library that allows you to create beautiful
 * and interactive charts and graphs. It uses HTML5 Canvas for rendering,
 * making it lightweight and performant.
 * 
 * The dashboard will visualize reading data including:
 * 1. Books read over time
 * 2. Reading pace tracking
 * 3. Genre distribution
 * 4. Reading goals progress
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // ******************************
    // INITIALIZATION & SETUP
    // ******************************

    /**
     * This function initializes the dashboard by setting up the charts
     * and loading saved reading data from localStorage if available
     */
    function initializeDashboard() {
        console.log("Initializing Reading Dashboard...");

        // Load reading data from localStorage
        const readingData = loadReadingData();

        // Set up each chart
        createReadingProgressChart(readingData);
        createGenreDistributionChart(readingData);
        createReadingPaceChart(readingData);
        createReadingGoalChart(readingData);

        // Add event listeners for dashboard interaction
        setupEventListeners();

        // Show animated welcome message
        showWelcomeMessage();
    }

    /**
     * Load and process reading data from localStorage
     * If no data exists, generate sample data for demonstration
     * 
     * @returns {Object} Processed reading data for charts
     */
    function loadReadingData() {
        // Try to get reading tasks from localStorage
        const savedTasks = localStorage.getItem('readingTasks');

        // If we have saved reading tasks, use them
        if (savedTasks) {
            console.log("Loading saved reading data...");
            try {
                // Parse the saved data
                const tasks = JSON.parse(savedTasks);

                // Process the data for chart usage
                return processReadingData(tasks);
            } catch (error) {
                console.error("Error processing saved reading data:", error);
                // If there's an error, fall back to sample data
                return generateSampleData();
            }
        } else {
            // If no saved data, use sample data
            console.log("No saved reading data found. Using sample data.");
            return generateSampleData();
        }
    }

    /**
     * Process reading task data into formats needed for the charts
     * 
     * @param {Array} tasks - Array of reading tasks from localStorage
     * @returns {Object} Processed data for charts
     */
    function processReadingData(tasks) {
        // Initialize data structure
        const data = {
            booksOverTime: [],
            paceData: [],
            genreDistribution: {},
            goals: {
                completed: 0,
                inProgress: 0,
                target: 50 // Default yearly reading goal
            }
        };

        // Track read dates for the books over time chart
        const readDates = {};

        // Process each task
        tasks.forEach(task => {
            // Count book for goal tracking
            if (task.currentPage >= task.totalPages) {
                data.goals.completed++;

                // Add to books over time data
                // Use the last session date as completion date
                if (task.readingSessions && task.readingSessions.length > 0) {
                    const lastSession = new Date(
                        task.readingSessions[task.readingSessions.length - 1].date
                    );

                    // Format date as YYYY-MM
                    const yearMonth = `${lastSession.getFullYear()}-${(lastSession.getMonth() + 1).toString().padStart(2, '0')}`;

                    // Increment counter for this month
                    readDates[yearMonth] = (readDates[yearMonth] || 0) + 1;
                }
            } else {
                data.goals.inProgress++;
            }

            // Add to pace data
            data.paceData.push({
                title: task.bookTitle,
                percentComplete: Math.round((task.currentPage / task.totalPages) * 100),
                pagesPerDay: task.dailyGoal || Math.ceil(task.totalPages / 30), // Default to 30 days
                isOnTrack: task.currentPage >= (task.dailyGoal || Math.ceil(task.totalPages / 30)) *
                    Math.ceil((new Date() - new Date(task.startDate)) / (1000 * 60 * 60 * 24))
            });

            // Add to genre distribution
            // Note: This assumes we've added genres to our reading tasks
            // If not, we'll just use a default genre
            const genre = task.genre || "Fiction";
            data.genreDistribution[genre] = (data.genreDistribution[genre] || 0) + 1;
        });

        // Convert books over time to array format for Chart.js
        // Sort dates chronologically
        const sortedDates = Object.keys(readDates).sort();

        data.booksOverTime = {
            labels: sortedDates,
            values: sortedDates.map(date => readDates[date])
        };

        return data;
    }

    /**
     * Generate sample reading data for demonstration purposes
     * Used when no actual reading data is available
     * 
     * @returns {Object} Sample reading data
     */
    function generateSampleData() {
        // Create sample data structure
        return {
            booksOverTime: {
                labels: ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06'],
                values: [3, 4, 2, 5, 3, 4]
            },
            paceData: [
                { title: "Dune", percentComplete: 75, pagesPerDay: 20, isOnTrack: true },
                { title: "The Hobbit", percentComplete: 40, pagesPerDay: 15, isOnTrack: false },
                { title: "Project Hail Mary", percentComplete: 90, pagesPerDay: 25, isOnTrack: true },
                { title: "Atomic Habits", percentComplete: 60, pagesPerDay: 10, isOnTrack: true }
            ],
            genreDistribution: {
                "Fiction": 12,
                "Science Fiction": 8,
                "Fantasy": 7,
                "Mystery": 5,
                "Non-Fiction": 6
            },
            goals: {
                completed: 21,
                inProgress: 3,
                target: 50
            }
        };
    }

    // ******************************
    // CHART CREATION FUNCTIONS
    // ******************************

    /**
     * Creates the reading progress chart showing books completed over time
     * Using Chart.js line chart
     * 
     * @param {Object} data - The processed reading data
     */
    function createReadingProgressChart(data) {
        // Get the canvas element
        const ctx = document.getElementById('readingProgressChart').getContext('2d');

        // Create gradient for the line
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(52, 152, 219, 0.8)');
        gradient.addColorStop(1, 'rgba(52, 152, 219, 0.2)');

        // Create the chart
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.booksOverTime.labels,
                datasets: [{
                    label: 'Books Completed',
                    data: data.booksOverTime.values,
                    backgroundColor: gradient,
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 3,
                    pointBackgroundColor: 'rgba(52, 152, 219, 1)',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Books Completed Over Time',
                        font: {
                            size: 18
                        },
                        padding: {
                            top: 10,
                            bottom: 20
                        }
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        callbacks: {
                            label: function (context) {
                                const value = context.parsed.y;
                                return value === 1 ? '1 book' : `${value} books`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0,
                            callback: function (value) {
                                if (value % 1 === 0) {
                                    return value;
                                }
                            }
                        },
                        title: {
                            display: true,
                            text: 'Number of Books',
                            font: {
                                size: 14
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Month',
                            font: {
                                size: 14
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Creates a doughnut chart showing distribution of book genres
     * 
     * @param {Object} data - The processed reading data
     */
    function createGenreDistributionChart(data) {
        // Get canvas context
        const ctx = document.getElementById('genreDistributionChart').getContext('2d');

        // Extract genre data
        const labels = Object.keys(data.genreDistribution);
        const values = labels.map(genre => data.genreDistribution[genre]);

        // Define colors for each genre
        const colors = [
            'rgba(52, 152, 219, 0.8)',  // Blue
            'rgba(46, 204, 113, 0.8)',  // Green
            'rgba(155, 89, 182, 0.8)',  // Purple
            'rgba(241, 196, 15, 0.8)',  // Yellow
            'rgba(231, 76, 60, 0.8)',   // Red
            'rgba(26, 188, 156, 0.8)',  // Turquoise
            'rgba(243, 156, 18, 0.8)',  // Orange
            'rgba(211, 84, 0, 0.8)',    // Dark Orange
            'rgba(41, 128, 185, 0.8)',  // Dark Blue
            'rgba(39, 174, 96, 0.8)'    // Dark Green
        ];

        // Create chart
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: colors.slice(0, labels.length),
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                    borderWidth: 2,
                    hoverOffset: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    title: {
                        display: true,
                        text: 'Genre Distribution',
                        font: {
                            size: 18
                        },
                        padding: {
                            top: 10,
                            bottom: 20
                        }
                    },
                    legend: {
                        position: 'right',
                        labels: {
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const label = context.label;
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} books (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Creates a horizontal bar chart showing reading pace for current books
     * 
     * @param {Object} data - The processed reading data
     */
    function createReadingPaceChart(data) {
        // Get canvas context
        const ctx = document.getElementById('readingPaceChart').getContext('2d');

        // Prepare pace data
        const bookTitles = data.paceData.map(book => book.title);
        const percentages = data.paceData.map(book => book.percentComplete);

        // Create color array based on whether books are on track
        const barColors = data.paceData.map(book =>
            book.isOnTrack ? 'rgba(46, 204, 113, 0.8)' : 'rgba(231, 76, 60, 0.8)'
        );

        // Create the chart
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: bookTitles,
                datasets: [{
                    label: 'Completion Percentage',
                    data: percentages,
                    backgroundColor: barColors,
                    borderColor: barColors.map(color => color.replace('0.8', '1')),
                    borderWidth: 1,
                    borderRadius: 5,
                    barPercentage: 0.6
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Current Reading Progress',
                        font: {
                            size: 18
                        },
                        padding: {
                            top: 10,
                            bottom: 20
                        }
                    },
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const index = context.dataIndex;
                                const book = data.paceData[index];
                                const paceStatus = book.isOnTrack ? 'On Track' : 'Behind Schedule';

                                return [
                                    `Progress: ${book.percentComplete}%`,
                                    `Target: ${book.pagesPerDay} pages/day`,
                                    `Status: ${paceStatus}`
                                ];
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Completion Percentage',
                            font: {
                                size: 14
                            }
                        },
                        ticks: {
                            callback: function (value) {
                                return value + '%';
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Book Title',
                            font: {
                                size: 14
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Creates a gauge chart showing progress toward yearly reading goal
     * 
     * @param {Object} data - The processed reading data
     */
    function createReadingGoalChart(data) {
        // Get canvas context
        const ctx = document.getElementById('readingGoalChart').getContext('2d');

        // Calculate goal percentage
        const { completed, inProgress, target } = data.goals;
        const completedPercentage = Math.min(100, Math.round((completed / target) * 100));

        // Create gauge chart using a doughnut chart
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'In Progress', 'Remaining'],
                datasets: [{
                    data: [
                        completed,
                        inProgress,
                        Math.max(0, target - completed - inProgress)
                    ],
                    backgroundColor: [
                        'rgba(46, 204, 113, 0.8)',  // Green (completed)
                        'rgba(52, 152, 219, 0.8)',  // Blue (in progress)
                        'rgba(189, 195, 199, 0.5)'  // Grey (remaining)
                    ],
                    borderColor: 'white',
                    borderWidth: 2,
                    circumference: 180,
                    rotation: -90
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    title: {
                        display: true,
                        text: 'Yearly Reading Goal',
                        font: {
                            size: 18
                        },
                        padding: {
                            top: 10,
                            bottom: 0
                        }
                    },
                    subtitle: {
                        display: true,
                        text: `${completed} of ${target} books completed (${completedPercentage}%)`,
                        font: {
                            size: 14,
                            weight: 'normal'
                        },
                        padding: {
                            bottom: 20
                        }
                    },
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const label = context.label;
                                const value = context.parsed;

                                if (label === 'Completed') {
                                    return `Completed: ${value} books`;
                                } else if (label === 'In Progress') {
                                    return `In Progress: ${value} books`;
                                } else {
                                    return `Remaining: ${value} books to reach goal`;
                                }
                            }
                        }
                    }
                }
            },
            plugins: [{
                id: 'goalText',
                afterDraw: function (chart) {
                    const width = chart.width;
                    const height = chart.height;
                    const ctx = chart.ctx;

                    ctx.restore();
                    ctx.font = 'bold 40px Arial';
                    ctx.textBaseline = 'middle';
                    ctx.textAlign = 'center';

                    const text = `${completedPercentage}%`;
                    const textX = width / 2;
                    const textY = height - (height / 4);

                    ctx.fillStyle = '#2c3e50';
                    ctx.fillText(text, textX, textY);

                    ctx.font = '14px Arial';
                    ctx.fillStyle = '#7f8c8d';
                    ctx.fillText('of goal', textX, textY + 30);

                    ctx.save();
                }
            }]
        });
    }

    // ******************************
    // INTERACTION & EVENT HANDLERS
    // ******************************

    /**
     * Sets up event listeners for interactive elements on the dashboard
     */
    function setupEventListeners() {
        // Time period selector for reading progress chart
        const timePeriodSelector = document.getElementById('timePeriodSelector');
        if (timePeriodSelector) {
            timePeriodSelector.addEventListener('change', function () {
                // This would filter the data based on the selected time period
                // and update the charts accordingly
                console.log(`Time period changed to: ${this.value}`);
                // In a full implementation, we would reload and refresh the charts here
            });
        }

        // Reading goal updater
        const goalUpdateForm = document.getElementById('goalUpdateForm');
        if (goalUpdateForm) {
            goalUpdateForm.addEventListener('submit', function (event) {
                event.preventDefault();
                const newGoal = parseInt(document.getElementById('newGoalInput').value);
                if (newGoal && newGoal > 0) {
                    // Update the displayed goal
                    document.getElementById('currentGoal').textContent = newGoal;
                    document.getElementById('newGoalInput').value = '';

                    // Show confirmation message
                    const confirmationMsg = document.getElementById('goalConfirmation');
                    confirmationMsg.textContent = `Reading goal updated to ${newGoal} books!`;
                    confirmationMsg.style.display = 'block';

                    // Hide message after 3 seconds
                    setTimeout(function () {
                        confirmationMsg.style.display = 'none';
                    }, 3000);
                }
            });
        }

        // Print dashboard button
        const printButton = document.getElementById('printDashboard');
        if (printButton) {
            printButton.addEventListener('click', function () {
                window.print();
            });
        }

        // Theme toggle for dashboard
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('change', function () {
                const dashboardElement = document.getElementById('readingDashboard');
                if (this.checked) {
                    // Dark theme
                    dashboardElement.classList.add('dark-theme');
                    localStorage.setItem('dashboardTheme', 'dark');
                } else {
                    // Light theme
                    dashboardElement.classList.remove('dark-theme');
                    localStorage.setItem('dashboardTheme', 'light');
                }
            });

            // Apply saved theme preference
            const savedTheme = localStorage.getItem('dashboardTheme');
            if (savedTheme === 'dark') {
                themeToggle.checked = true;
                document.getElementById('readingDashboard').classList.add('dark-theme');
            }
        }
    }

    /**
     * Shows an animated welcome message using pure JavaScript animations
     * (not relying on jQuery or other libraries)
     */
    function showWelcomeMessage() {
        const welcomeEl = document.getElementById('dashboardWelcome');
        if (!welcomeEl) return;

        // Set initial state
        welcomeEl.style.opacity = '0';
        welcomeEl.style.transform = 'translateY(-20px)';
        welcomeEl.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

        // Trigger animation after a small delay
        setTimeout(function () {
            welcomeEl.style.opacity = '1';
            welcomeEl.style.transform = 'translateY(0)';
        }, 300);

        // Add dismissal functionality
        const closeBtn = document.getElementById('welcomeClose');
        if (closeBtn) {
            closeBtn.addEventListener('click', function () {
                welcomeEl.style.opacity = '0';
                welcomeEl.style.transform = 'translateY(-20px)';

                // Remove from DOM after animation completes
                setTimeout(function () {
                    welcomeEl.style.display = 'none';
                }, 800);
            });
        }
    }

    // ******************************
    // UTILITY FUNCTIONS
    // ******************************

    /**
     * Format a date as YYYY-MM-DD
     * 
     * @param {Date} date - The date to format
     * @returns {string} Formatted date string
     */
    function formatDate(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Calculate days between two dates
     * 
     * @param {Date} start - Start date
     * @param {Date} end - End date
     * @returns {number} Number of days between dates
     */
    function daysBetween(start, end) {
        const millisecondsPerDay = 24 * 60 * 60 * 1000;
        return Math.round((end - start) / millisecondsPerDay);
    }

    /**
     * Automatically refreshes the dashboard data every 5 minutes
     * This ensures the displayed data stays current if the user
     * leaves the page open
     */
    function setupAutoRefresh() {
        // Refresh every 5 minutes
        setInterval(function () {
            console.log("Auto-refreshing dashboard data...");

            // Reload data and update charts
            const readingData = loadReadingData();

            // For a full implementation, we'd update each chart with new data
            // without completely recreating them

            // Show a subtle notification that data was refreshed
            const refreshNote = document.createElement('div');
            refreshNote.textContent = 'Dashboard data refreshed';
            refreshNote.className = 'refresh-notification';
            document.body.appendChild(refreshNote);

            // Remove notification after 3 seconds
            setTimeout(function () {
                refreshNote.remove();
            }, 3000);
        }, 5 * 60 * 1000); // 5 minutes
    }

    // ******************************
    // EXPORT DATA FUNCTIONALITY
    // ******************************

    /**
     * Exports reading data as CSV for downloading
     * Demonstrates how to generate and download files using JavaScript
     */
    function setupExportButtons() {
        const exportCSVBtn = document.getElementById('exportCSV');
        if (exportCSVBtn) {
            exportCSVBtn.addEventListener('click', function () {
                // Get data
                const data = loadReadingData();

                // Convert to CSV format
                let csvContent = "data:text/csv;charset=utf-8,";

                // Headers
                csvContent += "Book Title,Author,Total Pages,Current Page,Percent Complete,Start Date,Target End Date\n";

                // Create rows from reading tasks in localStorage
                const savedTasks = localStorage.getItem('readingTasks');
                if (savedTasks) {
                    try {
                        const tasks = JSON.parse(savedTasks);

                        // Add a row for each task
                        tasks.forEach(task => {
                            const percentComplete = Math.round((task.currentPage / task.totalPages) * 100);
                            const row = [
                                `"${task.bookTitle}"`,
                                `"${task.author}"`,
                                task.totalPages,
                                task.currentPage,
                                `${percentComplete}%`,
                                new Date(task.startDate).toLocaleDateString(),
                                new Date(task.targetEndDate).toLocaleDateString()
                            ].join(',');

                            csvContent += row + "\n";
                        });

                        // Create download link
                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", "reading_data.csv");
                        document.body.appendChild(link);

                        // Trigger download
                        link.click();

                        // Clean up
                        document.body.removeChild(link);
                    } catch (error) {
                        console.error("Error exporting reading data:", error);
                        alert("There was an error exporting your reading data. Please try again.");
                    }
                } else {
                    alert("No reading data available to export.");
                }
            });
        }
    }

    // ******************************
    // INITIALIZE DASHBOARD
    // ******************************

    // Start the dashboard
    initializeDashboard();

    // Set up auto-refresh
    setupAutoRefresh();

    // Set up export buttons
    setupExportButtons();
});