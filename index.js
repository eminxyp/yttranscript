export default {
  async fetch(request, env) {
    // CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    const url = new URL(request.url);
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    try {
      if (url.pathname === '/transcript' && request.method === 'POST') {
        return await handleTranscript(request, corsHeaders);
      } else if (url.pathname === '/translate' && request.method === 'POST') {
        return await handleTranslate(request, corsHeaders);
      } else {
        return new Response(JSON.stringify({ error: 'Not found' }), {
          status: 404,
          headers: corsHeaders
        });
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }
};

async function handleTranscript(request, corsHeaders) {
  const body = await request.json();
  const videoUrl = body.url;

  if (!videoUrl) {
    return new Response(JSON.stringify({ error: 'URL gereklidir' }), {
      status: 400,
      headers: corsHeaders
    });
  }

  // Video ID'sini çıkar
  const videoId = extractVideoId(videoUrl);
  if (!videoId) {
    return new Response(JSON.stringify({ error: 'Geçersiz YouTube URL' }), {
      status: 400,
      headers: corsHeaders
    });
  }

  try {
    // YouTube'tan transcript'i çek
    const transcript = await getYoutubeTranscript(videoId);

    if (!transcript) {
      return new Response(JSON.stringify({ error: 'Bu video için transcript bulunamadı' }), {
        status: 400,
        headers: corsHeaders
      });
    }

    return new Response(JSON.stringify({
      success: true,
      transcript: transcript
    }), {
      headers: corsHeaders
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: corsHeaders
    });
  }
}

async function handleTranslate(request, corsHeaders) {
  const body = await request.json();
  const text = body.text;
  const targetLang = body.lang;

  if (!text || !targetLang) {
    return new Response(JSON.stringify({ error: 'Text ve lang gereklidir' }), {
      status: 400,
      headers: corsHeaders
    });
  }

  try {
    const translated = await translateText(text, targetLang);

    return new Response(JSON.stringify({
      success: true,
      translated: translated
    }), {
      headers: corsHeaders
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: corsHeaders
    });
  }
}

function extractVideoId(url) {
  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
}

async function getYoutubeTranscript(videoId) {
  try {
    // YouTube'un internal API'sine istek gönder
    const response = await fetch(`https://www.youtube.com/api/timedtext?v=${videoId}&lang=tr&fmt=json3`);

    if (!response.ok) {
      // Türkçe transcript yoksa İngilizceyi dene
      const engResponse = await fetch(`https://www.youtube.com/api/timedtext?v=${videoId}&lang=en&fmt=json3`);
      if (!engResponse.ok) {
        return null;
      }
      return parseTranscriptJson(await engResponse.json());
    }

    return parseTranscriptJson(await response.json());
  } catch (error) {
    console.error('Transcript fetch error:', error);
    return null;
  }
}

function parseTranscriptJson(data) {
  if (!data.events) {
    return null;
  }

  let formatted = '';
  for (const event of data.events) {
    if (!event.tStartMs || !event.segs) {
      continue;
    }

    const seconds = Math.floor(parseInt(event.tStartMs) / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const timeStr = `[${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}]`;

    const text = event.segs.map(seg => seg.utf8 || '').join('');
    if (text.trim()) {
      formatted += `${timeStr} ${text}\n`;
    }
  }

  return formatted;
}

async function translateText(text, targetLang) {
  // MyMemory API - Tamamen ücretsiz, key gerekmiyor
  const langMap = {
    'tr': 'tr',
    'en': 'en',
    'de': 'de',
    'ar': 'ar',
    'fr': 'fr',
    'es': 'es',
    'pt': 'pt',
    'ru': 'ru',
    'pl': 'pl'
  };

  const lang = langMap[targetLang] || 'en';

  // MyMemory API'nin limit'leri: her istek max 500 karakter
  // Metni böl
  const chunks = [];
  const words = text.split(' ');
  let currentChunk = '';

  for (const word of words) {
    if ((currentChunk + ' ' + word).length > 450) {
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = word;
    } else {
      currentChunk += (currentChunk ? ' ' : '') + word;
    }
  }
  if (currentChunk) chunks.push(currentChunk);

  // Her chunk'ı çevir
  const translatedChunks = [];
  for (const chunk of chunks) {
    try {
      const encodedText = encodeURIComponent(chunk);
      const apiUrl = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=tr|${lang}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.responseStatus === 200 && data.responseData.translatedText) {
        translatedChunks.push(data.responseData.translatedText);
      } else {
        translatedChunks.push(chunk); // Çevirme başarısız, orijinal metni kullan
      }

      // Rate limit'ten kaçınmak için kısa delay
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      translatedChunks.push(chunk);
    }
  }

  return translatedChunks.join(' ');
}
