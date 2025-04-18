/**
 * jquery.js - jQuery Implementation for Book Discovery Page
 * 
 * This file implements jQuery effects and autocomplete for the book search page
 */

$(document).ready(function () {
    // ******************************
    // PART 1: JQUERY EFFECTS
    // ******************************

    // Effect 1: Fade in the search container when the page loads
    $(".search-container").hide().fadeIn(1000);

    // Effect 2: Add slide animation to the API toggle buttons
    $("#fetchBtn, #xhrBtn").click(function () {
        // Find the previously active button and slide it up slightly
        $(".api-toggle-btn.active").animate({
            marginTop: '-5px'
        }, 300).animate({
            marginTop: '0px'
        }, 300);
    });

    // Effect 3: Add hover effects to subject tags
    $(".subject-tag").hover(
        function () {
            // Mouse enter
            $(this).animate({
                paddingLeft: '20px',
                paddingRight: '20px'
            }, 200);
        },
        function () {
            // Mouse leave
            $(this).animate({
                paddingLeft: '15px',
                paddingRight: '15px'
            }, 200);
        }
    );

    // ******************************
    // PART 2: AUTOCOMPLETE IMPLEMENTATION
    // ******************************

    // Array of common book search terms for autocomplete
    const bookSearchTerms = [
        "Harry Potter", "Lord of the Rings", "Game of Thrones",
        "Dune", "Pride and Prejudice", "To Kill a Mockingbird",
        "The Great Gatsby", "Moby Dick", "War and Peace",
        "Crime and Punishment", "The Odyssey", "The Iliad",
        "Jane Eyre", "Dracula", "Frankenstein",
        "The Hobbit", "1984", "Brave New World",
        "The Catcher in the Rye", "Fahrenheit 451",
        "The Alchemist", "Don Quixote", "The Divine Comedy",
        "Alice in Wonderland", "Oliver Twist", "David Copperfield",
        "Wuthering Heights", "Little Women", "Anna Karenina",
        "Les Misérables", "The Count of Monte Cristo"
    ];

    // Author names for autocomplete
    const authorNames = [
        "J.K. Rowling", "J.R.R. Tolkien", "George R.R. Martin",
        "Frank Herbert", "Jane Austen", "Harper Lee",
        "F. Scott Fitzgerald", "Herman Melville", "Leo Tolstoy",
        "Fyodor Dostoevsky", "Homer", "Charlotte Brontë",
        "Bram Stoker", "Mary Shelley", "George Orwell",
        "Aldous Huxley", "J.D. Salinger", "Ray Bradbury",
        "Paulo Coelho", "Miguel de Cervantes", "Dante Alighieri",
        "Lewis Carroll", "Charles Dickens", "Emily Brontë",
        "Louisa May Alcott", "Victor Hugo", "Alexandre Dumas"
    ];

    // Genre names for autocomplete
    const genreNames = [
        "Fantasy", "Science Fiction", "Mystery", "Thriller",
        "Romance", "Historical Fiction", "Non-Fiction", "Biography",
        "Autobiography", "Horror", "Young Adult", "Children's",
        "Poetry", "Drama", "Classic", "Literary Fiction",
        "Crime", "Adventure", "Dystopian", "Graphic Novel",
        "Paranormal", "Philosophy", "Psychology", "Reference",
        "Self-Help", "Travel", "True Crime", "Western"
    ];

    // Combine all terms for autocomplete
    const allSearchTerms = [
        ...bookSearchTerms,
        ...authorNames.map(name => "author:" + name),
        ...genreNames.map(genre => "genre:" + genre)
    ];

    // Initialize jQuery UI autocomplete
    $("#searchInput").autocomplete({
        source: function (request, response) {
            // Filter the array based on what the user has typed
            const term = request.term.toLowerCase();
            const matches = allSearchTerms.filter(item =>
                item.toLowerCase().indexOf(term) !== -1
            );

            // Return the filtered array
            response(matches.slice(0, 10)); // Limit to 10 suggestions
        },
        minLength: 2,  // Start showing suggestions after 2 characters
        delay: 300,    // Small delay for better performance
        select: function (event, ui) {
            // When an item is selected, perform a search
            $("#searchInput").val(ui.item.value);
            $("#searchBtn").click();
            return false;
        }
    });

    // Add explanation tooltip for search syntax
    const tooltipHTML = `
        <div class="search-tooltip">
            <p><strong>Search Tips:</strong></p>
            <ul>
                <li>Search for books by title, author, or genre</li>
                <li>Use "author:" prefix to search by author name</li>
                <li>Use "genre:" prefix to search by specific genre</li>
            </ul>
        </div>
    `;

    // Add a help icon after the search input
    $("<span>").addClass("help-icon").html("?").insertAfter("#searchInput")
        .on("mouseenter", function () {
            // Create and show tooltip
            if (!$(this).data("tooltip-created")) {
                $(this).data("tooltip-created", true);
                const tooltip = $(tooltipHTML).hide().appendTo("body");
                tooltip.css({
                    position: "absolute",
                    top: $(this).offset().top + 30,
                    left: $(this).offset().left,
                    backgroundColor: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
                    zIndex: 1000,
                    width: "250px"
                });
                $(this).data("tooltip", tooltip);
            }

            $(this).data("tooltip").fadeIn(200);
        })
        .on("mouseleave", function () {
            // Hide tooltip
            $(this).data("tooltip").fadeOut(200);
        });

    // ******************************
    // PART 3: ENHANCE EXISTING FUNCTIONALITY
    // ******************************

    // Add animations to search results
    const originalSearchBooksFetch = window.searchBooksFetch;
    window.searchBooksFetch = function (query) {
        // Show loading with jQuery animation
        $("#resultsContainer").slideUp(300, function () {
            // After sliding up, show the loading indicator
            $(this).html(`
                <div class="loading">
                    <div class="loading-spinner"></div>
                </div>
            `).slideDown(300);

            // Call the original function
            originalSearchBooksFetch(query);
        });
    };

    // Override display results to add animation
    const originalDisplayResults = window.displayResults;
    window.displayResults = function (data) {
        // Slide up the container
        $("#resultsContainer").slideUp(300, function () {
            // Call the original function to populate results
            originalDisplayResults(data);

            // After populating, slide down with animation
            $(this).slideDown(500);

            // Add a fade-in effect to each book card
            $(".book-card").each(function (index) {
                $(this).css("opacity", 0).delay(index * 100).animate({ opacity: 1 }, 500);
            });
        });
    };
});