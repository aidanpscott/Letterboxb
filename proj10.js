/**
 * Project 10 - Interactive Drag and Drop Book Cover Puzzle Game
 */

// Wait for the DOM to be fully loaded before executing
document.addEventListener('DOMContentLoaded', function () {
    // Game variables
    let timer;
    let startTime;
    let gameActive = false;
    let correctPieces = 0;
    let totalPieces = 0;
    let currentDifficulty = 3; // Default grid size (3x3)
    let currentBook = 'fall-of-reach'; // Default book

    // Cache DOM elements
    const puzzleBoard = document.getElementById('puzzleBoard');
    const timerDisplay = document.getElementById('timer');
    const completeMessage = document.getElementById('completeMessage');
    const completionTimeDisplay = document.getElementById('completionTime');
    const startButton = document.getElementById('startBtn');
    const resetButton = document.getElementById('resetBtn');
    const difficultySelector = document.getElementById('difficulty');
    const bookSelector = document.getElementById('bookSelect');
    const referenceImage = document.getElementById('referenceImage');
    const topScoresContainer = document.getElementById('topScores');

    // Initialize event listeners
    startButton.addEventListener('click', startGame);
    resetButton.addEventListener('click', resetGame);
    difficultySelector.addEventListener('change', function () {
        currentDifficulty = parseInt(this.value);
    });
    bookSelector.addEventListener('change', function () {
        currentBook = this.value;
        referenceImage.src = `book-images/${currentBook}.jpg`;
    });

    /**
     * Start a new puzzle game
     */
    function startGame() {
        // Reset game state
        resetGame();

        // Set game as active
        gameActive = true;

        // Clear the puzzle board
        puzzleBoard.innerHTML = '';

        // Add the complete message element back
        puzzleBoard.appendChild(completeMessage);

        // Update grid template based on difficulty
        puzzleBoard.style.gridTemplateColumns = `repeat(${currentDifficulty}, 1fr)`;

        // Create puzzle pieces
        createPuzzlePieces();

        // Start the timer
        startTimer();

        // Disable the start button and difficulty selection during gameplay
        startButton.disabled = true;
        difficultySelector.disabled = true;
        bookSelector.disabled = true;
    }

    /**
     * Reset the current game
     */
    function resetGame() {
        // Stop the timer
        clearInterval(timer);

        // Reset timer display
        timerDisplay.textContent = '00:00';

        // Hide completion message
        completeMessage.classList.remove('show');

        // Reset game state
        gameActive = false;
        correctPieces = 0;

        // Enable controls
        startButton.disabled = false;
        difficultySelector.disabled = false;
        bookSelector.disabled = false;
    }

    /**
     * Create puzzle pieces and drop zones based on current difficulty
     */
    function createPuzzlePieces() {
        totalPieces = currentDifficulty * currentDifficulty;

        // Create a shuffled array of position indices
        const positions = Array.from({ length: totalPieces }, (_, i) => i);
        shuffleArray(positions);

        // Create drop zones and puzzle pieces
        for (let i = 0; i < totalPieces; i++) {
            // Create a drop zone
            const dropZone = document.createElement('div');
            dropZone.className = 'drop-zone';
            dropZone.dataset.position = i;

            // Set up drop zone event listeners
            dropZone.addEventListener('dragover', handleDragOver);
            dropZone.addEventListener('dragleave', handleDragLeave);
            dropZone.addEventListener('drop', handleDrop);

            // Create a puzzle piece
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.draggable = true;
            piece.dataset.correctPosition = positions[i];

            // Calculate background position based on correct position
            const correctPosition = parseInt(piece.dataset.correctPosition);
            const row = Math.floor(correctPosition / currentDifficulty);
            const col = correctPosition % currentDifficulty;

            // Set the background image and position
            piece.style.backgroundImage = `url(book-images/${currentBook}.jpg)`;
            piece.style.backgroundSize = `${currentDifficulty * 100}% ${currentDifficulty * 100}%`;
            piece.style.backgroundPosition = `${col * 100 / (currentDifficulty - 1)}% ${row * 100 / (currentDifficulty - 1)}%`;

            // Set up puzzle piece event listeners
            piece.addEventListener('dragstart', handleDragStart);
            piece.addEventListener('dragend', handleDragEnd);

            // Add the piece to the drop zone
            dropZone.appendChild(piece);

            // Add the drop zone to the puzzle board
            puzzleBoard.appendChild(dropZone);
        }
    }

    /**
     * Shuffle an array using the Fisher-Yates algorithm
     * @param {Array} array - The array to shuffle
     */
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    /**
     * Start the game timer
     */
    function startTimer() {
        startTime = Date.now();
        timer = setInterval(updateTimer, 1000);
        updateTimer(); // Update immediately
    }

    /**
     * Update the timer display
     */
    function updateTimer() {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
        const seconds = (elapsedTime % 60).toString().padStart(2, '0');
        timerDisplay.textContent = `${minutes}:${seconds}`;
    }

    /**
     * Check if the puzzle is complete
     */
    function checkCompletion() {
        if (correctPieces === totalPieces) {
            // Stop the timer
            clearInterval(timer);

            // Calculate final time
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
            const seconds = (elapsedTime % 60).toString().padStart(2, '0');
            const timeString = `${minutes}:${seconds}`;

            // Display completion message with time
            completionTimeDisplay.textContent = timeString;
            completeMessage.classList.add('show');

            // Save score
            saveScore(elapsedTime);

            // End game
            gameActive = false;

            // Enable controls
            startButton.disabled = false;
            difficultySelector.disabled = false;
            bookSelector.disabled = false;
        }
    }

    /**
     * Save a completed puzzle score
     * @param {number} time - Time in seconds
     */
    function saveScore(time) {
        // Get existing scores from localStorage
        let scores = JSON.parse(localStorage.getItem('puzzleScores') || '[]');

        // Add new score
        const newScore = {
            book: currentBook,
            difficulty: currentDifficulty,
            time: time,
            date: new Date().toISOString()
        };
        scores.push(newScore);

        // Sort scores by difficulty (higher first) and time (lower first)
        scores.sort((a, b) => {
            if (a.difficulty !== b.difficulty) {
                return b.difficulty - a.difficulty; // Higher difficulty first
            }
            return a.time - b.time; // Lower time first
        });

        // Keep only top 10 scores
        scores = scores.slice(0, 10);

        // Save back to localStorage
        localStorage.setItem('puzzleScores', JSON.stringify(scores));

        // Update scoreboard display
        updateScoreboard();
    }

    /**
     * Update the scoreboard with saved scores
     */
    function updateScoreboard() {
        // Get scores from localStorage
        const scores = JSON.parse(localStorage.getItem('puzzleScores') || '[]');

        // Clear scoreboard
        topScoresContainer.innerHTML = '';

        if (scores.length === 0) {
            topScoresContainer.innerHTML = `
                <div class="score-entry">
                    <span>No scores yet. Complete a puzzle to set a record!</span>
                </div>
            `;
            return;
        }

        // Add each score to the scoreboard
        scores.forEach((score, index) => {
            const minutes = Math.floor(score.time / 60).toString().padStart(2, '0');
            const seconds = (score.time % 60).toString().padStart(2, '0');
            const timeString = `${minutes}:${seconds}`;

            // Format the date
            const date = new Date(score.date);
            const dateString = date.toLocaleDateString();

            // Get book title
            let bookTitle = score.book.split('-').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');

            // Special cases for book titles
            if (score.book === 'fall-of-reach') {
                bookTitle = 'Halo: The Fall of Reach';
            }

            const scoreElement = document.createElement('div');
            scoreElement.className = 'score-entry';
            scoreElement.innerHTML = `
                <span>#${index + 1}: ${bookTitle} (${score.difficulty}×${score.difficulty}) - ${timeString}</span>
                <span class="score-date">${dateString}</span>
            `;

            topScoresContainer.appendChild(scoreElement);
        });
    }

    // ====== DRAG AND DROP HANDLERS ======

    // Store the currently dragged piece
    let draggedPiece = null;

    /**
     * Handle the dragstart event
     * @param {DragEvent} e - The drag event
     */
    function handleDragStart(e) {
        if (!gameActive) return;

        // Store reference to the dragged piece
        draggedPiece = this;

        // Add a class for styling
        this.classList.add('dragging');

        // Set the drag data (required for Firefox)
        e.dataTransfer.setData('text/plain', '');
        e.dataTransfer.effectAllowed = 'move';

        // If the piece is already correct, prevent dragging
        if (this.classList.contains('correct')) {
            e.preventDefault();
            return false;
        }
    }

    /**
     * Handle the dragend event
     */
    function handleDragEnd() {
        // Remove the dragging class
        this.classList.remove('dragging');
        draggedPiece = null;
    }

    /**
     * Handle the dragover event
     * @param {DragEvent} e - The drag event
     */
    function handleDragOver(e) {
        // Prevent default to allow drop
        e.preventDefault();

        // Add highlight class
        this.classList.add('highlight');
    }

    /**
     * Handle the dragleave event
     */
    function handleDragLeave() {
        // Remove highlight class
        this.classList.remove('highlight');
    }

    /**
     * Handle the drop event
     * @param {DragEvent} e - The drag event
     */
    function handleDrop(e) {
        // Prevent default action
        e.preventDefault();

        // Remove highlight class
        this.classList.remove('highlight');

        // If no piece is being dragged or game is not active, exit
        if (!draggedPiece || !gameActive) return;

        // Get the current drop zone and the original drop zone
        const currentDropZone = draggedPiece.parentNode;

        // If dropping in the same zone, do nothing
        if (currentDropZone === this) return;

        // Check if the drop zone already has a piece
        const targetPiece = this.firstElementChild;

        // If the target has a piece and it's marked as correct, don't allow the drop
        if (targetPiece && targetPiece.classList.contains('correct')) return;

        // Perform the swap
        if (targetPiece) {
            // There's already a piece here, swap them
            currentDropZone.appendChild(targetPiece);
            this.appendChild(draggedPiece);
        } else {
            // No piece here, just move the dragged piece
            this.appendChild(draggedPiece);
        }

        // Check if pieces are in correct positions
        checkPiecePositions();
    }

    /**
     * Check if puzzle pieces are in their correct positions
     */
    function checkPiecePositions() {
        // Reset counter
        correctPieces = 0;

        // Get all drop zones
        const dropZones = document.querySelectorAll('.drop-zone');

        // Check each drop zone
        dropZones.forEach(dropZone => {
            const piece = dropZone.firstElementChild;

            // Skip if no piece
            if (!piece) return;

            // Get the positions
            const dropPosition = parseInt(dropZone.dataset.position);
            const correctPosition = parseInt(piece.dataset.correctPosition);

            // Compare positions
            if (dropPosition === correctPosition) {
                // Mark as correct if not already marked
                if (!piece.classList.contains('correct')) {
                    piece.classList.add('correct');

                    // Play a snap sound or animation
                    animateCorrectPiece(piece);
                }

                // Make the piece non-draggable
                piece.draggable = false;

                // Increment counter
                correctPieces++;
            } else {
                // Remove correct class if it was previously correct
                piece.classList.remove('correct');

                // Ensure it's draggable
                piece.draggable = true;
            }
        });

        // Check if the puzzle is complete
        checkCompletion();
    }

    /**
     * Animate a correctly placed puzzle piece
     * @param {HTMLElement} piece - The puzzle piece element
     */
    function animateCorrectPiece(piece) {
        // Add and remove a class to trigger CSS animation
        piece.style.transition = 'transform 0.3s ease-in-out';
        piece.style.transform = 'scale(1.1)';

        setTimeout(() => {
            piece.style.transform = 'scale(1)';
        }, 300);
    }

    // Initialize the scoreboard
    updateScoreboard();
});