function createAlternateImage(imagePath) {
    // Create a new image object
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imagePath;

    img.onload = function () {
        // Create canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas dimensions to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0);

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Convert to grayscale (or apply other effects)
        for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg;     // red
            data[i + 1] = avg; // green
            data[i + 2] = avg; // blue
            // data[i + 3] is alpha (we keep it unchanged)
        }

        // Put the modified data back
        ctx.putImageData(imageData, 0, 0);

        // Create alternate filename
        const altPath = imagePath.replace('.jpg', '-alt.jpg');

        // In a real environment, you would save this canvas as an image file
        console.log(`Created alternate version: ${altPath}`);

        // For demonstration purposes, we'd download it in browser
        // const link = document.createElement('a');
        // link.download = altPath.split('/').pop();
        // link.href = canvas.toDataURL('image/jpeg', 0.8);
        // link.click();
    };
}

/*
// Example usage (for reference)
document.addEventListener('DOMContentLoaded', function() {
    const bookImages = [
        'book-images/fall-of-reach.jpg',
        'book-images/dune.jpg',
        'book-images/between-two-fires.jpg',
        // Add other book images here
    ];
    
    bookImages.forEach(createAlternateImage);
});
*/