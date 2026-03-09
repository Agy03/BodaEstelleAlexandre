import { NextResponse } from 'next/server';
import { auth } from '@/auth';

// Extract image URL from HTML meta tags
function extractImage(html: string): string | null {
  // Try og:image first (most reliable)
  const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  if (ogMatch) return ogMatch[1];

  // Try twitter:image
  const twMatch = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);
  if (twMatch) return twMatch[1];

  // Amazon-specific: landingImage or main image
  const amzMatch = html.match(/"hiRes"\s*:\s*"(https:\/\/m\.media-amazon\.com\/images\/[^"]+)"/i)
    || html.match(/"large"\s*:\s*"(https:\/\/m\.media-amazon\.com\/images\/[^"]+)"/i)
    || html.match(/id=["']landingImage["'][^>]+src=["']([^"']+)["']/i)
    || html.match(/id=["']imgBlkFront["'][^>]+src=["']([^"']+)["']/i);
  if (amzMatch) return amzMatch[1];

  return null;
}

// Extract title from HTML
function extractTitle(html: string): string | null {
  const ogTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);
  if (ogTitle) return ogTitle[1];

  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) return titleMatch[1].trim();

  return null;
}

// Extract price from HTML (Amazon-specific)
function extractPrice(html: string): string | null {
  // Amazon price patterns
  const priceMatch = html.match(/<span[^>]*class="[^"]*a-price-whole[^"]*"[^>]*>([^<]+)</)
    || html.match(/"priceAmount"\s*:\s*"?(\d+[.,]\d{2})"?/i);
  if (priceMatch) {
    const whole = priceMatch[1].replace(/[.,]$/, '');
    const fractionMatch = html.match(/<span[^>]*class="[^"]*a-price-fraction[^"]*"[^>]*>([^<]+)</);
    const fraction = fractionMatch ? fractionMatch[1] : '00';
    return `${whole}.${fraction}`;
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || !('role' in session.user) || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    // Only allow HTTPS
    if (parsedUrl.protocol !== 'https:') {
      return NextResponse.json({ error: 'Only HTTPS URLs are supported' }, { status: 400 });
    }

    // Block private/internal IPs (SSRF protection)
    const hostname = parsedUrl.hostname;
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('172.') ||
      hostname === '0.0.0.0' ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal')
    ) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(10000),
      redirect: 'follow',
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch URL' }, { status: 502 });
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      return NextResponse.json({ error: 'URL does not return HTML' }, { status: 400 });
    }

    const html = await response.text();

    const image = extractImage(html);
    const title = extractTitle(html);
    const price = extractPrice(html);

    return NextResponse.json({
      image: image || null,
      title: title || null,
      price: price || null,
    });
  } catch (error) {
    console.error('Link preview error:', error);
    return NextResponse.json({ error: 'Failed to extract preview' }, { status: 500 });
  }
}
