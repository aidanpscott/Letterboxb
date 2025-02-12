// This goes through an array of books, categorizes them, and displays the relevant messages associated with them.

// Array of book objects containing title, author, genre, and pages read
const books = [
    { title: "Dune", author: "Frank Herbert", genre: "Science Fiction", pagesRead: 412 },
    { title: "Dracula", author: "Bram Stoker", genre: "Gothic Horror", pagesRead: 320 },
    { title: "The Name of the Rose", author: "Umberto Eco", genre: "Historical Mystery", pagesRead: 512 },
    { title: "The Fall of Reach", author: "Eric Nylund", genre: "Military Science Fiction", pagesRead: 384 }
];

// Function to analyze books and determine messages
function analyzeBooks(bookList) {
    let totalPages = 0;

    for (let i = 0; i < bookList.length; i++) {
        totalPages += bookList[i].pagesRead; // Using a for loop to calculate total pages read

        // If, else if, else to classify books based on genre
        if (bookList[i].genre === "Science Fiction") {
            console.log(`${bookList[i].title} is a thought-provoking sci-fi classic!`);
        } else if (bookList[i].genre === "Gothic Horror") {
            console.log(`${bookList[i].title} is a chilling horror masterpiece!`);
        } else if (bookList[i].genre === "Historical Mystery") {
            console.log(`${bookList[i].title} blends history and suspense beautifully!`);
        } else {
            console.log(`${bookList[i].title} is a must-read!`);
        }

        // Switch statement to provide different messages for specific books
        switch (bookList[i].title) {
            case "Dune":
                console.log("A must-read for any sci-fi fan, exploring politics, power, and survival.");
                break;
            case "Dracula":
                console.log("The original vampire tale that still haunts readers today!");
                break;
            case "The Name of the Rose":
                console.log("An intricate mystery set in a medieval monastery.");
                break;
            case "The Fall of Reach":
                console.log("A thrilling military sci-fi novel that expands the Halo universe.");
                break;
            default:
                console.log("An excellent read worth exploring!");
        }
    }

    console.log(`Total pages read across all books: ${totalPages}`);
}

// Execute function to analyze books
analyzeBooks(books);
