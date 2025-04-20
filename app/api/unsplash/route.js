import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 3600; 

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || 'nature';
  const randomCount = Math.floor(Math.random() * 10) + 1; 
  try {
    const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
    
    if (!ACCESS_KEY) {
      throw new Error('Unsplash API key is not configured');
    }

    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&client_id=${ACCESS_KEY}&count=${randomCount}&orientation=landscape`,
      {
        headers: { 
          'Accept-Version': 'v1',
          'Accept': 'application/json'
        },
        cache: 'force-cache'
      }
    );
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Unsplash API error: ${error}`);
    }

    const data = await response.json();
    const selectedImage = data[Math.floor(Math.random() * data.length)];
    
    return NextResponse.json({ 
      url: selectedImage.urls.regular,
      photographer: selectedImage.user.name,
      photographerUrl: selectedImage.user.links.html,
      cache: 'force-cache'
    });

  } catch (error) {
    console.error('Unsplash API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image' }, 
      { status: 500 }
    );
  }
}