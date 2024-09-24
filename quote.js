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

        const quote = data[0]; // Assuming the response is an array and you want the first quote
        document.getElementById('quote').innerText = quote.quote;
        document.getElementById('author').innerText = `— ${quote.author}`;
    } catch (error) {
        console.error('Error fetching quote:', error);
        document.getElementById('quote').innerText = 'Error fetching quote.';
        document.getElementById('author').innerText = '';
    }
}

document.getElementById('fetchQuoteButton').addEventListener('click', fetchQuote);
