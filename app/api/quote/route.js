let cachedQuotes = [];
let lastFetchTime = 0;

export async function GET() {
  try {
    const now = Date.now();
    if (cachedQuotes.length === 0 || now - lastFetchTime > 30000) {
      const response = await fetch('https://zenquotes.io/api/quotes');
      const data = await response.json();
      cachedQuotes = data;
      lastFetchTime = now;
    }

    const randomQuote = cachedQuotes[Math.floor(Math.random() * cachedQuotes.length)];
    return new Response(JSON.stringify(randomQuote), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch quote' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}