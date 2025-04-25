let cachedQuotes = {};
let lastFetchTime = {};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');
    const now = Date.now();

    // If no tag is provided, fetch quote of the day
    if (!tag) {
      const response = await fetch('https://favqs.com/api/qotd', {
        headers: {
          'Authorization': `Token token=${process.env.FAVQS_API_KEY}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch quote of the day');
      const data = await response.json();
      return new Response(JSON.stringify(data.quote), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    try {
      // Check if we need to fetch new quotes for this tag
      if (!cachedQuotes[tag] || now - lastFetchTime[tag] > 30000) {
        const response = await fetch(
          `https://favqs.com/api/quotes?filter=${encodeURIComponent(tag)}&type=tag`,
          {
            headers: {
              'Authorization': `Token token=${process.env.FAVQS_API_KEY}`
            }
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch quotes: ${response.status}`);
        }

        const data = await response.json();

        if (!data.quotes || !Array.isArray(data.quotes)) {
          throw new Error('Invalid response format from FavQs API');
        }

        cachedQuotes[tag] = data.quotes;
        lastFetchTime[tag] = now;
      }

      // Make sure we have quotes before trying to select a random one
      if (!cachedQuotes[tag] || cachedQuotes[tag].length === 0) {
        throw new Error(`No quotes found for tag: ${tag}`);
      }

      const randomQuote = cachedQuotes[tag][Math.floor(Math.random() * cachedQuotes[tag].length)];
      return new Response(JSON.stringify(randomQuote), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (tagError) {
      console.error('Tag-specific error:', tagError);
      // Fallback to quote of the day if tag fetch fails
      const fallbackResponse = await fetch('https://favqs.com/api/qotd', {
        headers: {
          'Authorization': `Token token=${process.env.FAVQS_API_KEY}`
        }
      });
      const fallbackData = await fallbackResponse.json();
      return new Response(JSON.stringify(fallbackData.quote), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('Error fetching quotes:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to fetch quote' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}