const voiceId = 'KYmste4TMrmLI6wWlLXk';
const modelId = 'eleven_multilingual_v2';
const speechTexts = new Set(bundle.speech);

function sendBytes(bytes, type, request, cacheControl) {
  const headers = new Headers({
    'Content-Type': type,
    'Accept-Ranges': 'bytes',
    'Cache-Control': cacheControl
  });

  const range = request.headers.get('Range');
  if (range) {
    const match = range.match(/^bytes=(\d*)-(\d*)$/);
    let start = 0;
    let end = bytes.length - 1;

    if (match && match[1]) {
      start = Number(match[1]);
      if (match[2]) end = Math.min(end, Number(match[2]));
    } else if (match && Number(match[2]) > 0) {
      start = Math.max(0, bytes.length - Number(match[2]));
    } else {
      start = bytes.length;
    }

    if (start > end) {
      headers.set('Content-Range', `bytes */${bytes.length}`);
      return new Response(null, { status: 416, headers });
    }

    headers.set('Content-Range', `bytes ${start}-${end}/${bytes.length}`);
    headers.set('Content-Length', String(end - start + 1));

    return new Response(
      request.method === 'HEAD' ? null : bytes.slice(start, end + 1),
      { status: 206, headers }
    );
  }

  headers.set('Content-Length', String(bytes.length));
  return new Response(request.method === 'HEAD' ? null : bytes, { headers });
}

function makeError(status) {
  return new Response(null, {
    status,
    headers: { 'Cache-Control': 'no-store' }
  });
}

async function getSpeech(request, env, url) {
  const text = url.searchParams.get('text');

  // 只允許朗讀網站內建的回覆，避免對外提供任意文字合成。
  if (!speechTexts.has(text)) return makeError(400);
  if (!env.ELEVENLABS_API_KEY) return makeError(503);

  const cache = globalThis.caches?.default;
  const cacheUrl = new URL('/api/speech', url.origin);
  cacheUrl.search = new URLSearchParams({ text, voiceId, modelId }).toString();
  const key = cacheUrl.href;

  const saved = cache ? await cache.match(key).catch(() => undefined) : null;
  if (saved) {
    const data = new Uint8Array(await saved.arrayBuffer());
    return sendBytes(data, 'audio/mpeg', request, 'public, max-age=86400');
  }

  // 每次請求獨立處理，避免前一個已中斷的播放請求卡住下一次。
  try {
    const upstream = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_64`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': env.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({ text, model_id: modelId }),
        signal: AbortSignal.timeout(12000)
      }
    );

    if (!upstream.ok || !upstream.headers.get('Content-Type')?.startsWith('audio/')) {
      console.error('HIKUN speech provider rejected the request', upstream.status);
      return makeError(502);
    }

    const data = new Uint8Array(await upstream.arrayBuffer());
    if (!data.length) return makeError(502);

    if (cache) {
      await cache.put(key, new Response(data, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'public, max-age=2592000'
        }
      })).catch(() => {});
    }

    return sendBytes(data, 'audio/mpeg', request, 'public, max-age=86400');
  } catch (error) {
    console.error('HIKUN speech provider request failed', error?.name);
    return makeError(502);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!['GET', 'HEAD'].includes(request.method)) return makeError(405);

    if (url.pathname === '/api/speech') {
      if (request.method !== 'GET') return makeError(405);
      return getSpeech(request, env, url);
    }

    if (url.pathname === '/' || url.pathname === '/index.html') {
      const html = env.ELEVENLABS_API_KEY
        ? bundle.html.replace('data-custom-voice="disabled"', 'data-custom-voice="enabled"')
        : bundle.html;

      return new Response(request.method === 'HEAD' ? null : html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache'
        }
      });
    }

    if (url.pathname === '/hikun-clean.webp') {
      const image = Uint8Array.from(atob(bundle.image), character => character.charCodeAt(0));
      return sendBytes(image, 'image/webp', request, 'public, max-age=3600');
    }

    if (url.pathname === '/moon-signal.wav') {
      const music = Uint8Array.from(atob(bundle.music), character => character.charCodeAt(0));
      return sendBytes(music, 'audio/wav', request, 'public, max-age=3600');
    }

    return makeError(404);
  }
};
