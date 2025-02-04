import React, { useState } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "@/components/ui/alert-dialog";

const ReadingProgress = () => {
    const [books, setBooks] = useState([
        { id: 1, title: "Eleventh Cycle", author: "Kian N. Ardalan", pagesRead: 7, totalPages: 779, image: "book-images/eleventh-cycle.jpg" },
        { id: 2, title: "The Will of the Many", author: "James Islington", pagesRead: 237, totalPages: 720, image: "book-images/will-of-many.jpg" },
        { id: 3, title: "The Runelords", author: "David Farland", pagesRead: 108, totalPages: 613, image: "book-images/runelords.jpg" }
    ]);

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const handleUpdatePages = (id, newPages) => {
        const book = books.find(b => b.id === id);
        if (newPages > book.totalPages) {
            setAlertMessage(`Pages read cannot exceed total pages (${book.totalPages})`);
            setShowAlert(true);
            return;
        }

        setBooks(books.map(book =>
            book.id === id ? { ...book, pagesRead: newPages } : book
        ));
    };

    return (
        <section className="book-section">
            <h2 className="section-title">My Reading List</h2>
            <div className="book-grid">
                {books.map(book => (
                    <article key={book.id} className="book-card">
                        <img src={book.image} alt={book.title} />
                        <div className="book-info">
                            <h3>{book.title}</h3>
                            <p className="book-author">by {book.author}</p>
                            <div className="book-genre">
                                <div style={{ marginBottom: '10px' }}>
                                    <input
                                        type="number"
                                        value={book.pagesRead}
                                        onChange={(e) => handleUpdatePages(book.id, parseInt(e.target.value) || 0)}
                                        style={{
                                            width: '60px',
                                            padding: '4px',
                                            marginRight: '8px',
                                            border: '1px solid #bdc3c7',
                                            borderRadius: '4px'
                                        }}
                                        min="0"
                                        max={book.totalPages}
                                    />
                                    <span>of {book.totalPages} pages</span>
                                </div>

                                <div style={{
                                    width: '100%',
                                    backgroundColor: '#ecf0f1',
                                    height: '8px',
                                    borderRadius: '4px',
                                    overflow: 'hidden',
                                    marginBottom: '5px'
                                }}>
                                    <div style={{
                                        width: `${(book.pagesRead / book.totalPages) * 100}%`,
                                        backgroundColor: '#3498db',
                                        height: '100%',
                                        transition: 'width 0.3s ease'
                                    }} />
                                </div>

                                <p>{Math.round((book.pagesRead / book.totalPages) * 100)}% complete</p>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Invalid Page Count</AlertDialogTitle>
                        <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setShowAlert(false)}>OK</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </section>
    );
};

export default ReadingProgress;