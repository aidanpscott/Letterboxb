// *** REQUIREMENT #1 & #3: Overlay/Lightbox Implementation using createElement and appendChild ***
// This code creates an image overlay/lightbox that swaps images and uses opacity/positioning

// Create a function to set up the lightbox functionality
function setupLightbox() {
    // Get all book images on the page
    const bookImages = document.querySelectorAll('.book-card img, .author-card img');

    // Create overlay elements - using createElement as required
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.id = 'imageOverlay';

    const lightboxContainer = document.createElement('div');
    lightboxContainer.className = 'lightbox-container';

    const lightboxImage = document.createElement('img');
    lightboxImage.className = 'lightbox-image';
    lightboxImage.id = 'lightboxImage';

    const closeButton = document.createElement('span');
    closeButton.className = 'close-button';
    closeButton.innerHTML = '&times;';

    const swapButton = document.createElement('button');
    swapButton.className = 'swap-button';
    swapButton.textContent = 'Swap Image';

    // Using appendChild as required
    lightboxContainer.appendChild(lightboxImage);
    lightboxContainer.appendChild(closeButton);
    lightboxContainer.appendChild(swapButton);
    overlay.appendChild(lightboxContainer);
    document.body.appendChild(overlay);

    // Set up event listeners for each image
    bookImages.forEach(img => {
        img.addEventListener('click', function () {
            // Get the current image source
            const imgSrc = this.src;
            lightboxImage.src = imgSrc;

            // Store original image source
            lightboxImage.dataset.originalSrc = imgSrc;

            // Create alternate image source (grayscale version)
            // This creates a different format of the same image as specified in requirements
            const altImgSrc = imgSrc.replace('.jpg', '-alt.jpg');
            lightboxImage.dataset.altSrc = altImgSrc;

            // Show the overlay
            overlay.style.display = 'flex';

            // Add animation class
            setTimeout(() => {
                overlay.classList.add('active');
            }, 10);
        });
    });

    // Close button functionality
    closeButton.addEventListener('click', function () {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
    });

    // Swap button functionality - swaps between original and alternate version
    swapButton.addEventListener('click', function () {
        const currentSrc = lightboxImage.src;
        const originalSrc = lightboxImage.dataset.originalSrc;
        const altSrc = lightboxImage.dataset.altSrc;

        // Check if we're showing the original or alternate and swap
        if (currentSrc === originalSrc || currentSrc.endsWith('.jpg')) {
            lightboxImage.src = altSrc;
        } else {
            lightboxImage.src = originalSrc;
        }
    });

    // Close overlay when clicking outside the image
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        }
    });
}

// Initialize lightbox when DOM is loaded
document.addEventListener('DOMContentLoaded', setupLightbox);

// Helper function to ensure all pages have at least one image (Requirement #2)
function ensurePageHasImage() {
    // Check if page has images
    const hasImages = document.querySelectorAll('img').length > 0;

    // If no images exist on the page, add a default book image
    if (!hasImages) {
        // Create image element
        const defaultImage = document.createElement('img');
        defaultImage.src = 'book-images/default-book.jpg';
        defaultImage.alt = 'Book Icon';
        defaultImage.className = 'default-page-image';

        // Add the image to the first section on the page
        const firstSection = document.querySelector('section');
        if (firstSection) {
            firstSection.appendChild(defaultImage);
        } else {
            // If no section exists, add to body
            document.body.appendChild(defaultImage);
        }
    }
}

// Call the function to ensure all pages have images
document.addEventListener('DOMContentLoaded', ensurePageHasImage);