// Array of 10 books with details
const books = [
    {
        title: "Halo: The Fall of Reach",
        author: "Eric Nylund",
        genre: "Military Science Fiction",
        image: "book-images/fall-of-reach.jpg",
        review: "The book that got me into reading. Tight and accessible prose inside one of the greatest and most influential sci-fi series of all time."
    },
    {
        title: "Dune",
        author: "Frank Herbert",
        genre: "Science Fiction",
        image: "book-images/dune.jpg",
        review: "Perhaps the greatest science fiction novel of all time, and certainly the most influential."
    },
    {
        title: "Between Two Fires",
        author: "Christopher Buehlman",
        genre: "Historical Fantasy",
        image: "book-images/between-two-fires.jpg",
        review: "A macabre battleground of angels and demons during the Black Death."
    },
    {
        title: "Star Wars: Darth Plagueis",
        author: "James Luceno",
        genre: "Science Fiction",
        image: "book-images/darth-plagueis.jpg",
        review: "Read the tale of Darth Plagueis the Wise, one of the most powerful Sith Lords in history."
    },
    {
        title: "The Two Towers",
        author: "J.R.R. Tolkien",
        genre: "Epic Fantasy",
        image: "book-images/two-towers.jpg",
        review: "The second book in the legendary Lord of the Rings series."
    },
    {
        title: "The Name of the Rose",
        author: "Umberto Eco",
        genre: "Historical Mystery",
        image: "book-images/name-of-the-rose.jpg",
        review: "A masterpiece of historical fiction, blending mystery, philosophy, and theology."
    },
    {
        title: "Delusion's Master",
        author: "Tanith Lee",
        genre: "Dark Fantasy",
        image: "book-images/delusions-master.jpg",
        review: "A compelling story woven with myth, gods, and twisted fates."
    },
    {
        title: "A Throne of Bones",
        author: "Vox Day",
        genre: "Epic Fantasy",
        image: "book-images/throne-of-bones.jpg",
        review: "A vast and complex political fantasy, deeply inspired by historical conflicts."
    },
    {
        title: "A Game of Thrones",
        author: "George R.R. Martin",
        genre: "Epic Fantasy",
        image: "book-images/game-of-thrones.jpg",
        review: "The book that redefined modern fantasy with its deep world-building and intricate plots."
    },
    {
        title: "Dracula",
        author: "Bram Stoker",
        genre: "Gothic Horror",
        image: "book-images/dracula.jpg",
        review: "A timeless horror classic that introduced the world to the legend of Count Dracula."
    }
];

// Function to load books dynamically
function loadBooks() {
    const bookContainer = document.querySelector('.book-grid');
    bookContainer.innerHTML = ""; // Clear existing content

    for (let i = 0; i < books.length; i++) {
        let book = books[i];

        // Determine special messages based on genre using if-else statements
        let genreMessage = "";
        if (book.genre === "Science Fiction") {
            genreMessage = "🚀 Explore the stars with this Sci-Fi classic!";
        } else if (book.genre === "Epic Fantasy") {
            genreMessage = "🧙‍♂️ A must-read for fantasy lovers!";
        } else if (book.genre === "Gothic Horror") {
            genreMessage = "🦇 A chilling masterpiece of terror!";
        } else if (book.genre === "Military Science Fiction") {
            genreMessage = "🎖️ A gripping military sci-fi adventure!";
        } else {
            genreMessage = "📖 A great addition to your collection!";
        }

        // Switch statement to change the border color based on genre
        let borderColor;
        switch (book.genre) {
            case "Military Science Fiction":
                borderColor = "2px solid #27ae60"; // Green for military sci-fi
                break;
            case "Science Fiction":
                borderColor = "2px solid #3498db"; // Blue for sci-fi
                break;
            case "Epic Fantasy":
                borderColor = "2px solid #8e44ad"; // Purple for fantasy
                break;
            case "Historical Mystery":
                borderColor = "2px solid #e67e22"; // Orange for mystery
                break;
            case "Dark Fantasy":
                borderColor = "2px solid #2c3e50"; // Dark blue for dark fantasy
                break;
            case "Gothic Horror":
                borderColor = "2px solid #900C3F"; // Dark red for horror
                break;
            default:
                borderColor = "2px solid #7f8c8d"; // Gray for others
        }

        // Create book card dynamically
        let bookCard = `
            <article class="book-card" style="border:${borderColor}">
                <img src="${book.image}" alt="${book.title}">
                <div class="book-info">
                    <h3>${book.title}</h3>
                    <p class="book-author">By ${book.author}</p>
                    <p class="book-genre">Genre: ${book.genre}</p>
                    <p class="book-review">${book.review}</p>
                    <p class="genre-message">${genreMessage}</p>
                </div>
            </article>
        `;

        // Append book card to the container
        bookContainer.innerHTML += bookCard;
    }
}

// Run function when page loads
document.addEventListener("DOMContentLoaded", loadBooks);
