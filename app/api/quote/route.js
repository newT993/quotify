export async function GET() {
  try {
    const response = await fetch('https://zenquotes.io/api/random');
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
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