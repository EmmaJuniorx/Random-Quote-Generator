async function fetchQuote() {
    const category = document.getElementById('categorySelect').value; // Get selected category
    const url = `https://api.api-ninjas.com/v1/quotes${category ? `?category=${category}` : ''}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-Api-Key': '4/4Qg0RdkYHSNXXj5PtLTA==ekYKKyG1hQoACkZR', // Replace with your actual API key
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.length === 0) {
            throw new Error("No quotes found.");
        }

        const quote = data[0];
        document.getElementById('quote').innerText = quote.quote;
        document.getElementById('author').innerText = `— ${quote.author}`;
    } catch (error) {
        console.error('Error fetching quote:', error);
        document.getElementById('quote').innerText = 'Error fetching quote.';
        document.getElementById('author').innerText = '';
    }
}

document.getElementById('fetchQuoteButton').addEventListener('click', fetchQuote);

document.getElementById('generateImageButton').addEventListener('click', function () {
    const quoteText = document.getElementById('quote').innerText;
    const authorText = document.getElementById('author').innerText;

    // Get the canvas element
    const canvas = document.getElementById('quoteCanvas');
    const ctx = canvas.getContext('2d');

    // Get customization options
    const fontStyle = document.getElementById('fontSelect').value;
    const fontSize = document.getElementById('fontSizeSelect').value + 'px';
    const textColor = document.getElementById('textColorSelect').value;
    const bgColor = document.getElementById('bgColorSelect').value;
    const bgImageInput = document.getElementById('bgImageInput').files[0];

    // Set canvas background
    if (bgImageInput) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                drawText(); // Draw text after the image is loaded
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(bgImageInput);
    } else {
        // Fill background color if no image
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawText(); // Draw text immediately if no image
    }

    function drawText() {
        // Set font and text styles for the quote
        ctx.font = `${fontSize} ${fontStyle}`;
        ctx.fillStyle = textColor;
        ctx.textAlign = "center";

        // Add the quote text to the canvas
        wrapText(ctx, quoteText, canvas.width / 2, 200, 450, 30);

        // Add the author text below the quote
        ctx.font = `16px ${fontStyle}`; // Smaller font for author
        ctx.fillText(authorText, canvas.width / 2, 300);

        // Convert the canvas content to a downloadable image
        const image = canvas.toDataURL("image/png");
        const downloadLink = document.getElementById('downloadLink');
        downloadLink.href = image;
        downloadLink.style.display = 'inline';
    }
});

// Function to wrap long text for canvas
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let lines = [];

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line);

    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], x, y + (i * lineHeight));
    }
}
