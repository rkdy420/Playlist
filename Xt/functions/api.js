// ==========================================
// M3U PLAYLIST FILTER API
// Cloudflare Pages Function
// ==========================================

// 🔧 YOUR M3U URL (Already configured!)
const M3U_PLAYLIST_URL = 'http://b1g.uk:80/get.php?username=201&password=102&type=m3u_plus';

export async function onRequest(context) {
  const { request } = context;

  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  try {
    console.log('Fetching playlist from:', M3U_PLAYLIST_URL);

    // Fetch the M3U playlist
    const response = await fetch(M3U_PLAYLIST_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch playlist: ${response.status} ${response.statusText}`);
    }

    let content = await response.text();

    // Validate M3U format
    if (!content.includes('#EXTM3U') && !content.includes('#EXTINF')) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid M3U playlist format',
          message: 'The source does not appear to be a valid M3U playlist',
          source: M3U_PLAYLIST_URL 
        }),
        { 
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }

    console.log('Original playlist size:', content.length);

    // Count original streams
    const originalStreams = (content.match(/#EXTINF/g) || []).length;

    // 🧹 Filter out video formats (keep only audio streams)
    const videoFormats = /\.(mp4|mkv|avi|flv|webp|webm|divx|ts|mov|wmv|m4v|mpg|mpeg|3gp|ogv)(\?[^\n]*)?\s*$/gi;
    
    const lines = content.split('\n');
    const filtered = [];
    let skipNext = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines initially
      if (!line && filtered.length === 0) continue;
      
      // Check if this is an EXTINF line
      if (line.startsWith('#EXTINF')) {
        // Look ahead to the next non-empty line (the URL)
        let urlLine = '';
        for (let j = i + 1; j < lines.length; j++) {
          const nextLine = lines[j].trim();
          if (nextLine && !nextLine.startsWith('#')) {
            urlLine = nextLine;
            break;
          }
        }
        
        // Check if URL contains video format
        if (videoFormats.test(urlLine)) {
          skipNext = true;
          continue;
        }
      }

      // Skip the URL line if it was marked as video
      if (skipNext && !line.startsWith('#') && line) {
        skipNext = false;
        continue;
      }

      filtered.push(lines[i]); // Keep original line with whitespace
    }

    content = filtered.join('\n');

    // Clean up excessive blank lines (more than 2 consecutive)
    content = content.replace(/\n{3,}/g, '\n\n');

    // Count filtered streams
    const totalStreams = (content.match(/#EXTINF/g) || []).length;
    const removedStreams = originalStreams - totalStreams;

    console.log('Filtered streams:', totalStreams);
    console.log('Removed streams:', removedStreams);

    // Return filtered playlist
    return new Response(content, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpegurl; charset=utf-8',
        'Content-Disposition': 'attachment; filename="filtered_playlist.m3u"',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300, s-maxage=600',
        'X-Total-Streams': totalStreams.toString(),
        'X-Removed-Streams': removedStreams.toString(),
        'X-Original-Streams': originalStreams.toString(),
        'X-Source-URL': M3U_PLAYLIST_URL,
      },
    });

  } catch (error) {
    console.error('Error processing playlist:', error);

    return new Response(
      JSON.stringify({
        error: 'Server Error',
        message: error.message,
        source: M3U_PLAYLIST_URL,
        tip: 'Ensure the M3U URL is publicly accessible and returns a valid M3U playlist',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
