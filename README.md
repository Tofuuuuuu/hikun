/*
  HIKUN 月球電台｜單檔 Cloudflare Worker

  使用方式
  1. 將這份程式碼完整貼入 Cloudflare Workers。
  2. 在 Worker 設定新增密鑰 ELEVENLABS_API_KEY。
  3. 填入你的 ElevenLabs API 金鑰後部署。
  4. 使用 HTTPS 網址開啟網站。

  自訂音色 ID 已填入。
  沒有語音金鑰或自訂朗讀失敗時，使用裝置中文朗讀。
  個人來信產生的廣播使用裝置朗讀。
  備用錄音轉文字需要 ElevenLabs 語音轉文字權限及額度。
*/

const CONFIG = {
  voiceId: "KYmste4TMrmLI6wWlLXk",
  voiceModel: "eleven_multilingual_v2",
  assetSite: "https://hikun-moon-radio.aquamacaw1024.chatgpt.site",
  source: "https://linefriends.com/ko-kr/characters-list/ip-truz"
};

const CONTENT = {
  greeting:
    "晚安，這裡是 HIKUN 月球電台。你可以把今天的心情寫成一則廣播，也可以找我聊角色、寫來信，或玩一場電台小測驗。",
  unknown:
    "這個問題還沒有收錄。你可以點選下面的建議問題，或問我「聽眾來信怎麼寫」。",
  retry:
    "差一點點，再選一次吧！",
  complete:
    "九題都完成了！謝謝你參加今晚的月球電台小測驗。",
  characters: [
    {
      question: "HIKUN 是誰？",
      keys: ["hikun", "機器人", "你是誰", "你的個性"],
      answer:
        "HIKUN 是 TRUZ 裡情感豐富的小機器人。剛認識時看起來有點冷淡，熟悉後會露出各種搞怪表情。在這個網站裡，我是陪你收集日常的電台主持人。"
    },
    {
      question: "TRUZ 的故事從哪裡開始？",
      keys: ["truz", "世界觀", "實驗室", "故事背景"],
      answer:
        "TRUZ 的夥伴們在實驗室醒來，記不起自己的來歷。每個人都有特殊能力，大家一起踏上尋找自我的旅程。"
    },
    {
      question: "RURU 有什麼能力？",
      keys: ["ruru", "棉花糖"],
      answer:
        "RURU 是小小的棉花糖角色，可以複製自己的身體，也能讓冷掉的氣氛變暖。"
    },
    {
      question: "CHILLI 是怎樣的角色？",
      keys: ["chilli", "辣椒"],
      answer:
        "CHILLI 很想成為帥氣的角色。只要下定決心，就會努力把事情做完。"
    },
    {
      question: "ROMY 喜歡做什麼？",
      keys: ["romy", "白玫瑰"],
      answer:
        "ROMY 是笑容迷人的白玫瑰，喜歡唱歌跳舞，總能讓周圍的氣氛更明亮。"
    },
    {
      question: "可以介紹你的朋友嗎？",
      keys: ["朋友", "其他角色", "夥伴"],
      answer:
        "今晚的來賓有 RURU、CHILLI 和 ROMY。直接輸入其中一個名字，我就介紹給你聽。"
    }
  ],
  mail: [
    {
      question: "想點歌給朋友，怎麼開口？",
      keys: ["點歌", "送首歌"],
      answer:
        "先叫對方的名字，再說一個只有你們知道的小細節。例如：給總在放學後等我的你，這首歌陪你走回家。"
    },
    {
      question: "忘記廣播台詞怎麼辦？",
      keys: ["忘詞", "忘記台詞", "忘記廣播"],
      answer:
        "先停一拍，想起上一個關鍵字。也可以笑著說：「剛剛訊號去月球繞了一圈。」再接下一句。"
    },
    {
      question: "雨天適合收集什麼聲音？",
      keys: ["雨天", "雨聲"],
      answer:
        "試著聽窗戶、雨傘和屋簷上的雨聲。哪一個像鼓？選一個當今晚的片頭。"
    },
    {
      question: "今天沒大事也能投稿嗎？",
      keys: ["沒大事", "小事", "平凡"],
      answer:
        "可以。從一個細節開始，比如早餐店阿姨今天記得你的點單。這就夠寫成一句來信了。"
    },
    {
      question: "第一次主持怎麼開場？",
      keys: ["開場", "第一次主持"],
      answer:
        "用一句問候、一個地點和一個問題開場。例如：「晚安，這裡是月球。你那邊還有哪一盞燈亮著？」"
    },
    {
      question: "如何替節目取名字？",
      keys: ["取名", "節目名字"],
      answer:
        "選一個地點，再加一種聲音。像「樓梯間的腳步」或「凌晨廚房的水聲」，一聽就有畫面。"
    },
    {
      question: "怎麼形容今天的開心？",
      keys: ["開心", "好開心"],
      answer:
        "把開心說成一個動作吧。你是忍不住跳了一下，還是走回家的時候一路哼著歌？"
    },
    {
      question: "怎麼謝謝陪我的人？",
      keys: ["謝謝", "感謝"],
      answer:
        "把「謝謝你」接上一件具體的事。像是：「謝謝你在我報告忘詞時，在台下對我點了一下頭。」"
    },
    {
      question: "適合用什麼聲音收播？",
      keys: ["聲音收播", "結尾音"],
      answer:
        "輕敲杯子一下，等尾音散去，再說晚安。留一秒安靜，讓聽眾知道今天的節目結束了。"
    },
    {
      question: "聽眾來信要怎麼寫？",
      keys: ["來信", "寫信"],
      answer:
        "試試三句話：今天發生了什麼、那時候的心情、想留給自己的一句話。按上方的「開始今晚的廣播」，我會陪你寫完。"
    },
    {
      question: "上台前好緊張怎麼辦？",
      keys: ["緊張", "上台前"],
      answer:
        "先把第一句說給我聽就好。等開場那句變熟了，再接第二句，今天不用一口氣練完整段。"
    },
    {
      question: "可以給我一句收播詞嗎？",
      keys: ["收播詞", "晚安詞"],
      answer:
        "今晚的訊號就到這裡。把今天的小事放進口袋，明天見。你也可以把最後三個字換成自己的口頭禪。"
    }
  ],
  radio: [
    {
      question: "我今天有點累",
      keys: ["有點累", "好累", "辛苦", "壓力"],
      answer:
        "收到你的訊號了。今天先把肩膀放鬆一點吧。月球電台陪你休息一首歌的時間。"
    },
    {
      question: "今天的月球天氣？",
      keys: ["月球天氣", "電台天氣"],
      answer:
        "想像中的月球氣象台報告：今晚心情晴時多雲，窗邊有微量星光，適合把今天的小事寫進日記。"
    },
    {
      question: "給我一個畫畫題目",
      keys: ["畫畫", "畫圖", "畫什麼"],
      answer:
        "今天的畫題是「機器人的口袋」。畫出我從月球帶回來的三樣小東西，其中一樣要能發出聲音。"
    },
    {
      question: "給我一個小任務",
      keys: ["小任務", "挑戰", "觀察"],
      answer:
        "找找身邊有沒有藍色的東西。想像它是月球電台的設備，你會替它取什麼名字？"
    },
    {
      question: "怎麼用麥克風？",
      keys: ["麥克風", "語音輸入", "怎麼用語音"],
      answer:
        "按輸入框旁的「語音提問」，允許使用麥克風後說出問題。文字會先填進輸入框。若瀏覽器辨識失敗，可以按「備用錄音轉文字」。"
    },
    {
      question: "怎麼讓你說話？",
      keys: ["朗讀", "讓你說話", "念給我", "唸給我"],
      answer:
        "按每則回覆下面的「朗讀完整內容」。測驗會把題目和所有選項一起念出來，也可以勾選「自動朗讀回覆」。"
    }
  ],
  postcards: [
    "寄給地球上的你。今天月球收到了很多訊號，我認得你的那一個。晚安，HIKUN。",
    "今天的明信片只畫了一扇窗。你抬頭看月亮的時候，就當作我們同時打開了它。",
    "如果今天有一件很小、很開心的事，記得把它留下來。月球郵局替你蓋了一顆星星章。"
  ],
  quiz: [
    {
      question: "TRUZ 的故事從哪裡開始？",
      options: ["實驗室", "海邊", "車站"],
      answer: 0,
      feedback: "大家在實驗室醒來，一起尋找自己的來歷。"
    },
    {
      question: "誰可以複製自己的身體？",
      options: ["ROMY", "RURU", "CHILLI"],
      answer: 1,
      feedback: "RURU 是可以複製自己的小棉花糖。"
    },
    {
      question: "哪個角色是喜歡唱歌跳舞的白玫瑰？",
      options: ["HIKUN", "CHILLI", "ROMY"],
      answer: 2,
      feedback: "ROMY 喜歡唱歌跳舞。"
    },
    {
      question: "哪位夥伴想成為帥氣的角色？",
      options: ["ROMY", "CHILLI", "RURU"],
      answer: 1,
      feedback: "CHILLI 下定決心後會努力把事情做完。"
    },
    {
      question: "熟悉之後，HIKUN 常露出什麼？",
      options: ["搞怪表情", "透明翅膀", "彩色尾巴"],
      answer: 0,
      feedback: "HIKUN 是情感豐富的小機器人。"
    },
    {
      question: "想把朋友的聲音放進節目，先做什麼？",
      options: ["直接播放", "先問朋友是否願意", "調大音量"],
      answer: 1,
      feedback: "先說明會給誰聽，讓朋友自己決定。"
    },
    {
      question: "哪句來信最能讓人想像畫面？",
      options: ["今天很好", "有些事情發生了", "台下的朋友朝我比了個讚"],
      answer: 2,
      feedback: "具體的小動作能讓聽眾看見那一刻。"
    },
    {
      question: "聽不見開台音效時，可以看哪裡？",
      options: ["聲音描述", "網址列", "音量圖示"],
      answer: 0,
      feedback: "聲音描述會用文字說明音效的變化。"
    },
    {
      question: "語音辨識把名字聽錯了，下一步呢？",
      options: ["放棄來信", "修改文字再送出", "提高播放音量"],
      answer: 1,
      feedback: "先確認輸入框中的文字，就能保留原意。"
    }
  ]
};

function quizText(index) {
  const item = CONTENT.quiz[index];
  return (
    "第 " + (index + 1) + " 題，共 " + CONTENT.quiz.length + " 題。" +
    item.question +
    "選項是：" +
    item.options.map((text, i) => (i + 1) + "，" + text).join("。") +
    "。"
  );
}

const allowedSpeech = new Set([
  CONTENT.greeting,
  CONTENT.unknown,
  CONTENT.retry,
  CONTENT.complete,
  ...CONTENT.characters.map(item => item.answer),
  ...CONTENT.mail.map(item => item.answer),
  ...CONTENT.radio.map(item => item.answer),
  ...CONTENT.postcards,
  ...CONTENT.quiz.map((item, index) => quizText(index)),
  ...CONTENT.quiz.map(item => "答對了！" + item.feedback)
]);

function errorResponse(status, message) {
  return Response.json(
    { error: message },
    { status, headers: { "Cache-Control": "no-store" } }
  );
}

function audioResponse(buffer, request) {
  const size = buffer.byteLength;
  const headers = new Headers({
    "Content-Type": "audio/mpeg",
    "Accept-Ranges": "bytes",
    "Cache-Control": "private, max-age=86400"
  });

  const range = request.headers.get("Range");
  let start = 0;
  let end = size - 1;
  let status = 200;

  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);

    if (!match || (!match[1] && !match[2])) {
      return new Response(null, {
        status: 416,
        headers: { "Content-Range": "bytes */" + size }
      });
    }

    if (match[1]) {
      start = Number(match[1]);
      end = match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
    } else {
      const suffix = Number(match[2]);
      if (suffix < 1) {
        return new Response(null, {
          status: 416,
          headers: { "Content-Range": "bytes */" + size }
        });
      }
      start = Math.max(0, size - suffix);
    }

    if (!Number.isSafeInteger(start) || start > end || start >= size) {
      return new Response(null, {
        status: 416,
        headers: { "Content-Range": "bytes */" + size }
      });
    }

    status = 206;
    headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
  }

  headers.set("Content-Length", String(end - start + 1));

  return new Response(
    request.method === "HEAD" ? null : buffer.slice(start, end + 1),
    { status, headers }
  );
}

async function synthesize(request, env, ctx) {
  const url = new URL(request.url);
  const text = url.searchParams.get("text");

  if (!allowedSpeech.has(text)) {
    return errorResponse(400, "這段文字沒有收錄於電台朗讀內容。");
  }

  if (!env.ELEVENLABS_API_KEY) {
    return errorResponse(503, "尚未設定語音金鑰。");
  }

  const cacheURL = new URL("/voice-cache", url.origin);
  cacheURL.search = new URLSearchParams({
    text,
    voice: CONFIG.voiceId,
    model: CONFIG.voiceModel
  }).toString();

  const cacheKey = new Request(cacheURL);
  const cache = caches.default;

  try {
    const cached = await cache.match(cacheKey);

    if (cached) {
      return audioResponse(await cached.arrayBuffer(), request);
    }

    const endpoint =
      "https://api.elevenlabs.io/v1/text-to-speech/" +
      CONFIG.voiceId +
      "?output_format=mp3_44100_64";

    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "xi-api-key": env.ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg"
      },
      body: JSON.stringify({
        text,
        model_id: CONFIG.voiceModel,
        voice_settings: {
          stability: 0.55,
          similarity_boost: 0.8
        }
      }),
      signal: AbortSignal.timeout(20000)
    });

    if (!result.ok ||
        !result.headers.get("Content-Type")?.startsWith("audio/")) {
      console.error("Voice provider status", result.status);
      return errorResponse(502, "自訂音色暫時無法使用。");
    }

    const buffer = await result.arrayBuffer();

    if (!buffer.byteLength) {
      return errorResponse(502, "沒有收到音訊。");
    }

    ctx.waitUntil(
      cache.put(
        cacheKey,
        new Response(buffer.slice(0), {
          headers: {
            "Content-Type": "audio/mpeg",
            "Cache-Control": "public, max-age=2592000"
          }
        })
      )
    );

    return audioResponse(buffer, request);
  } catch {
    return errorResponse(503, "語音服務連線中斷。");
  }
}

async function transcribe(request, env) {
  const url = new URL(request.url);

  if (request.headers.get("Origin") !== url.origin) {
    return errorResponse(403, "請從網站內送出錄音。");
  }

  if (!env.ELEVENLABS_API_KEY) {
    return errorResponse(503, "尚未設定語音金鑰。");
  }

  const type = (request.headers.get("Content-Type") || "").split(";")[0];
  const supported = ["audio/webm", "audio/mp4", "audio/ogg", "video/mp4"];

  if (!supported.includes(type)) {
    return errorResponse(415, "這個錄音格式暫時無法辨識。");
  }

  const limit = 1500000;
  const reader = request.body?.getReader();

  if (!reader) {
    return errorResponse(400, "沒有錄音內容。");
  }

  const chunks = [];
  let size = 0;

  while (true) {
    const part = await reader.read();
    if (part.done) break;

    size += part.value.byteLength;

    if (size > limit) {
      await reader.cancel();
      return errorResponse(413, "錄音太大，請縮短錄音時間。");
    }

    chunks.push(part.value);
  }

  if (!size) {
    return errorResponse(400, "錄音沒有聲音資料。");
  }

  try {
    const form = new FormData();
    form.append("model_id", "scribe_v2");
    form.append("language_code", "zho");
    form.append(
      "file",
      new Blob(chunks, { type }),
      "question." + type.split("/")[1]
    );

    const result = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
      method: "POST",
      headers: { "xi-api-key": env.ELEVENLABS_API_KEY },
      body: form,
      signal: AbortSignal.timeout(25000)
    });

    if (!result.ok) {
      return errorResponse(result.status, "辨識服務權限或額度暫時無法使用。");
    }

    const data = await result.json();

    return Response.json(
      { text: String(data.text || "") },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return errorResponse(503, "辨識服務暫時無法連線。");
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/api/transcribe" && request.method === "POST") {
      return transcribe(request, env);
    }

    if (!["GET", "HEAD"].includes(request.method)) {
      return errorResponse(405, "不支援這個請求方式。");
    }

    if (url.pathname === "/api/speech") {
      return synthesize(request, env, ctx);
    }

    if (url.pathname !== "/" && url.pathname !== "/index.html") {
      return errorResponse(404, "找不到頁面。");
    }

    return new Response(
      request.method === "HEAD"
        ? null
        : renderPage(Boolean(env.ELEVENLABS_API_KEY)),
      {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-cache"
        }
      }
    );
  }
};

function renderPage(customVoice) {
  const data = JSON.stringify({
    ...CONTENT,
    customVoice,
    source: CONFIG.source
  }).replace(/</g, "\\u003c");

  return `<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#19172f">
<title>HIKUN 月球電台</title>
<style>
*{box-sizing:border-box}
:root{
  color-scheme:dark;
  --bg:#19172f;
  --panel:#282440;
  --line:#655c7d;
  --text:#fff9ed;
  --muted:#d8cee6;
  --yellow:#ffdc93;
  --purple:#dbcbff;
}
body{
  margin:0;
  background:radial-gradient(ellipse at top left,#413456,var(--bg) 65%);
  color:var(--text);
  font:16px/1.75 system-ui,"PingFang TC","Microsoft JhengHei",sans-serif;
  min-height:100vh;
}
main{width:min(1120px,94%);margin:auto;padding:30px 0}
h1,h2,p{margin-top:0}
h1{font-size:clamp(2rem,5vw,3.3rem);line-height:1.2;margin-bottom:12px}
h2{font-size:1.25rem}
header{margin-bottom:24px}
header p{color:var(--muted);max-width:44rem}
.frequency{color:var(--yellow);font-weight:700;letter-spacing:.15em}
.card{
  background:var(--panel);
  border:1px solid var(--line);
  border-radius:24px;
  padding:24px;
  margin-bottom:18px;
}
.layout{display:grid;grid-template-columns:.8fr 1.5fr;gap:18px}
.host{text-align:center}
.portrait{
  width:230px;
  height:230px;
  max-width:100%;
  position:relative;
  display:grid;
  place-items:center;
  margin:16px auto;
  border-radius:50%;
  background:radial-gradient(circle,#ffe3a8,#c5b7e2 65%,transparent 66%);
}
.portrait img{width:80%;height:90%;object-fit:contain;transition:transform .2s}
.portrait[data-face="開心"] img{transform:rotate(-6deg) translateY(-4px)}
.portrait[data-face="眨眼"] img{transform:rotate(6deg)}
.portrait[data-face="驚訝"] img{transform:translateY(-8px)}
#faceMark{
  position:absolute;right:0;top:0;
  font-size:2rem;background:#ffe9ba;color:#49345c;
  border-radius:50%;min-width:1.6em;
}
.row,.choices,.tabs{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.host .row{justify-content:center}
button,input,textarea,.share{font:inherit}
button,.share{
  border:1px solid var(--line);
  border-radius:12px;
  background:#39324f;
  color:var(--text);
  padding:9px 14px;
  min-height:44px;
  cursor:pointer;
  text-decoration:none;
}
button:hover,.share:hover{background:#504361}
button[aria-pressed="true"],button.primary{
  background:var(--purple);color:#231a34;border-color:transparent;
}
button:disabled{opacity:.55;cursor:default}
:focus-visible{outline:3px solid var(--yellow);outline-offset:3px}
input[type="text"],textarea{
  width:100%;
  background:#171425;
  color:var(--text);
  border:1px solid var(--line);
  border-radius:12px;
  padding:12px;
}
textarea{resize:vertical;min-height:100px}
label{display:inline-flex;gap:7px;align-items:center;min-height:44px}
#chatForm{margin:12px 0}
#chatForm input{margin-bottom:8px}
#log{height:390px;overflow:auto;padding:4px}
.message{
  width:fit-content;
  max-width:96%;
  margin:10px 0;
  padding:12px 15px;
  border-radius:16px;
  background:#39324f;
  overflow-wrap:anywhere;
}
.message.user{margin-left:auto;background:#ded0f3;color:#21182f}
.message strong{font-size:.85rem}
.message p{white-space:pre-line;margin:4px 0}
.message button{font-size:.9rem;margin-top:6px}
a{color:var(--yellow)}
.tabs{margin-bottom:12px}
#status,#letterStatus{color:var(--yellow);min-height:1.75em}
#letterCue{white-space:pre-line}
#letterControls{display:grid;gap:12px}
audio{width:min(100%,500px)}
details{margin-top:12px}
summary{cursor:pointer;min-height:44px}
footer{color:var(--muted);font-size:.9rem}
.skip{position:absolute;top:-80px;left:8px;background:white;color:black;padding:10px}
.skip:focus{top:8px}
dialog{
  width:min(520px,92%);
  border:1px solid var(--line);
  border-radius:20px;
  background:var(--panel);
  color:var(--text);
  padding:24px;
}
dialog::backdrop{background:#000a}
@media(max-width:780px){
  .layout{grid-template-columns:1fr}
  .portrait{width:170px;height:170px}
  .card{padding:18px}
  #log{height:360px}
}
@media(max-width:460px){
  main{width:95%;padding-top:18px}
  .card{border-radius:18px;padding:15px}
  #chatForm .row button{flex:1}
}
@media(prefers-reduced-motion:reduce){
  *{transition:none!important;scroll-behavior:auto!important}
}
</style>
</head>
<body>
<a class="skip" href="#question">跳到聊天輸入框</a>
<main>
<header>
  <p class="frequency">FM 08.20</p>
  <h1>HIKUN 月球電台</h1>
  <p>把今天的心情，變成一則晚安廣播。這裡收得到你的晴天、陰天，和那些想留下的小事。</p>
</header>

<section class="card" id="letter" aria-labelledby="letterTitle">
  <h2 id="letterTitle">地球聽眾來信</h2>
  <p id="letterCue" tabindex="-1">
    選一種心情天氣，留下一個瞬間，再送一句話給今天的自己。
  </p>
  <div id="letterControls"></div>
  <p id="letterStatus" role="status"></p>
</section>

<div class="layout">
<section class="card host" aria-labelledby="hostTitle">
  <h2 id="hostTitle">今晚的主持人 · HIKUN</h2>
  <div id="portrait" class="portrait" data-face="好奇">
    <img src="${CONFIG.assetSite}/hikun-clean.webp"
         alt="戴藍色頭盔與紅色帽子的 HIKUN">
    <span id="faceMark" aria-hidden="true">？</span>
  </div>
  <p id="faceText">現在的心情是好奇</p>
  <div id="faces" class="row" aria-label="切換 HIKUN 的心情"></div>
</section>

<section class="card" id="chat" aria-labelledby="chatTitle">
  <h2 id="chatTitle">主持人聊天室</h2>
  <div id="log" role="log" aria-label="聊天紀錄"
       aria-live="polite" aria-relevant="additions" tabindex="0"></div>

  <form id="chatForm">
    <input id="question" type="text" maxlength="300"
           aria-label="給 HIKUN 的問題"
           placeholder="想跟 HIKUN 說什麼？" autocomplete="off">
    <div class="row">
      <button id="mic" type="button">語音提問</button>
      <button id="backup" type="button">備用錄音轉文字</button>
      <button type="submit" class="primary">送出</button>
    </div>
  </form>

  <div class="row">
    <label><input id="autoRead" type="checkbox">自動朗讀回覆</label>
    <button id="stopRead" type="button">停止朗讀</button>
    <button id="resetChat" type="button">重新聊天</button>
  </div>
  <p id="status" role="status"></p>

  <details>
    <summary>Safari 麥克風設定</summary>
    <p>Mac 請開啟 Safari → 設定 → 網站 → 麥克風，將這個網站設為「允許」，再重新整理網頁。</p>
    <p>iPhone 請從 Safari 網址列旁的網站選單開啟網站設定，將麥克風設為「允許」。選單名稱可能隨系統版本不同。</p>
    <p>允許麥克風後若語音辨識仍無法連線，可以使用「備用錄音轉文字」。</p>
  </details>
</section>
</div>

<section class="card" aria-labelledby="topicsTitle">
  <h2 id="topicsTitle">今晚想聊什麼？</h2>
  <div id="tabs" class="tabs" aria-label="問題分類"></div>
  <div id="questions" class="choices" aria-label="建議問題"></div>
</section>

<section class="card" aria-labelledby="audioTitle">
  <h2 id="audioTitle">收聽開台訊號</h2>
  <audio id="broadcast" controls preload="none"
         aria-label="月球電台開台音效"
         src="${CONFIG.assetSite}/moon-signal.wav"></audio>
  <details>
    <summary>閱讀聲音描述</summary>
    <p>幾個短短的電子音由低往高響起，像月球電台逐漸收到地球傳來的訊號。</p>
  </details>
</section>

<footer>
  <div class="row">
    <a id="lineShare" class="share" target="_blank" rel="noopener">分享到 LINE</a>
    <a href="${CONFIG.source}" target="_blank" rel="noopener">TRUZ 角色資料</a>
    <a href="https://www.deviantart.com/bt21fanart/art/TRUZ-Hikun-Pose-1072015107"
       target="_blank" rel="noopener">角色參考圖</a>
  </div>
  <p>課程互動作品。角色資料採站內關鍵字檢索，月球電台情境為創作內容。</p>
</footer>
</main>

<script type="application/json" id="content">${data}</script>
<script>(${startWebsite.toString()})();</script>
</body>
</html>`;
}

function startWebsite() {
  const $ = id => document.getElementById(id);
  const data = JSON.parse($("content").textContent);

  let activeAudio = null;
  let audioTimer = null;
  let currentUtterance = null;
  let speechRun = 0;
  let recognition = null;
  let quizIndex = -1;
  let quizControls = null;
  let lastAnswer = null;
  let postcardIndex = 0;
  let letterWeather = "";
  let letterStory = "";
  let letterStep = 0;

  const browserVoice =
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window;

  const faceMarks = {
    好奇: "？",
    開心: "♡",
    眨眼: "✦",
    驚訝: "！"
  };

  function setStatus(text) {
    $("status").textContent = text;
  }

  function button(text, action) {
    const element = document.createElement("button");
    element.type = "button";
    element.textContent = text;
    element.addEventListener("click", action);
    return element;
  }

  function setFace(face) {
    $("portrait").dataset.face = face;
    $("faceMark").textContent = faceMarks[face];
    $("faceText").textContent = "現在的心情是" + face;

    for (const item of $("faces").children) {
      item.setAttribute("aria-pressed", String(item.textContent === face));
    }
  }

  for (const face of Object.keys(faceMarks)) {
    $("faces").append(button(face, () => setFace(face)));
  }

  function stopSpeech() {
    speechRun++;
    clearTimeout(audioTimer);
    currentUtterance = null;

    if (activeAudio) {
      const audio = activeAudio;
      activeAudio = null;
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      audio.remove();
    }

    if (browserVoice) {
      window.speechSynthesis.cancel();
    }
  }

  function readWithDevice(text) {
    if (!browserVoice) {
      setStatus("這個裝置尚未提供朗讀功能，完整內容已顯示在畫面上。");
      return;
    }

    const run = speechRun;
    const sentences = text.match(/[^。！？\n]+[。！？]?|[。！？]/g) || [text];
    const chunks = [];

    for (const sentence of sentences) {
      for (let start = 0; start < sentence.length; start += 70) {
        chunks.push(sentence.slice(start, start + 70));
      }
    }

    let index = 0;

    function next() {
      if (run !== speechRun) return;

      if (index >= chunks.length) {
        currentUtterance = null;
        setStatus("完整朗讀完成。");
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunks[index++]);
      currentUtterance = utterance;
      utterance.lang = "zh-TW";
      utterance.rate = 0.93;

      const voices = speechSynthesis.getVoices();
      const voice =
        voices.find(item => item.lang === "zh-TW") ||
        voices.find(item => item.lang.startsWith("zh"));

      if (voice) utterance.voice = voice;

      utterance.onend = next;
      utterance.onerror = event => {
        if (
          run === speechRun &&
          !["canceled", "interrupted"].includes(event.error)
        ) {
          setStatus("裝置朗讀中斷，可以再按一次朗讀。");
        }
      };

      setStatus("正在朗讀，第 " + index + "／" + chunks.length + " 段。");
      speechSynthesis.speak(utterance);
    }

    next();
  }

  function read(text, deviceOnly = false) {
    stopSpeech();
    $("broadcast").pause();

    if (deviceOnly || !data.customVoice) {
      readWithDevice(text);
      return;
    }

    const audio = new Audio();
    audio.hidden = true;
    audio.preload = "none";
    audio.src = "/api/speech?" + new URLSearchParams({ text });
    document.body.append(audio);
    activeAudio = audio;

    setStatus("正在準備 HIKUN 的完整朗讀…");

    function fallback() {
      if (activeAudio !== audio) return;
      stopSpeech();
      readWithDevice(text);
    }

    audio.addEventListener("error", fallback, { once: true });

    audio.addEventListener("playing", () => {
      if (activeAudio !== audio) return;
      clearTimeout(audioTimer);
      setStatus("HIKUN 正在朗讀完整內容。");
    });

    audio.addEventListener("ended", () => {
      if (activeAudio !== audio) return;
      clearTimeout(audioTimer);
      activeAudio = null;
      audio.remove();
      setStatus("完整朗讀完成。");
    });

    // 計時器只等待開始播放，播放後即清除。
    audioTimer = setTimeout(fallback, 25000);
    audio.play().catch(fallback);
  }

  function addMessage(text, mine = false, source = false) {
    const box = document.createElement("div");
    box.className = mine ? "message user" : "message";

    const sender = document.createElement("strong");
    sender.textContent = mine ? "你" : "HIKUN";

    const body = document.createElement("p");
    body.textContent = text;
    box.append(sender, body);

    if (source) {
      const link = document.createElement("a");
      link.href = data.source;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = "查看角色資料";
      box.append(link, document.createElement("br"));
    }

    if (!mine) {
      box.append(button("朗讀完整內容", () => read(text)));
    }

    $("log").append(box);
    $("log").scrollTop = $("log").scrollHeight;

    if (!mine && $("autoRead").checked) read(text);

    return box;
  }

  function normalize(text) {
    return text.normalize("NFKC").toLowerCase()
      .replace(/[\s\p{P}\p{S}]/gu, "");
  }

  function removeQuizControls() {
    quizControls?.remove();
    quizControls = null;
  }

  function attachQuizControls(box, items) {
    removeQuizControls();
    quizControls = document.createElement("div");
    quizControls.className = "row";
    quizControls.setAttribute("role", "group");
    quizControls.setAttribute("aria-label", "測驗選項");
    quizControls.append(...items);
    box.append(quizControls);
    $("log").scrollTop = $("log").scrollHeight;
  }

  function fullQuizText(index) {
    const item = data.quiz[index];
    return (
      "第 " + (index + 1) + " 題，共 " + data.quiz.length + " 題。" +
      item.question +
      "選項是：" +
      item.options.map((text, i) => (i + 1) + "，" + text).join("。") +
      "。"
    );
  }

  function showQuiz(index) {
    quizIndex = index;
    setFace("好奇");

    const item = data.quiz[index];
    const box = addMessage(fullQuizText(index));

    attachQuizControls(
      box,
      item.options.map((text, i) =>
        button((i + 1) + "．" + text, () => answerQuiz(i))
      )
    );
  }

  function answerQuiz(choice) {
    const item = data.quiz[quizIndex];
    if (!item) return;

    addMessage(item.options[choice], true);

    if (choice !== item.answer) {
      setFace("驚訝");
      const box = addMessage(data.retry);

      attachQuizControls(
        box,
        item.options.map((text, i) =>
          button((i + 1) + "．" + text, () => answerQuiz(i))
        )
      );
      quizControls.querySelector("button")?.focus();
      return;
    }

    setFace("開心");

    const next = quizIndex + 1;
    quizIndex = -1;
    const box = addMessage("答對了！" + item.feedback);

    attachQuizControls(box, [
      button(next < data.quiz.length ? "下一題" : "完成測驗", () => {
        if (next < data.quiz.length) {
          showQuiz(next);
        } else {
          const end = addMessage(data.complete);
          attachQuizControls(end, [
            button("再玩一次", () => showQuiz(0))
          ]);
        }
        quizControls.querySelector("button")?.focus();
      })
    ]);

    quizControls.querySelector("button")?.focus();
  }

  const categories = {
    "主持人信箱": data.mail.map(item => item.question),
    "角色與故事": data.characters.map(item => item.question),
    "月球電台": [
      ...data.radio.map(item => item.question),
      "送我一張明信片",
      "我要聽開台音效"
    ],
    "電台小測驗": ["開始九題小測驗"]
  };

  function showCategory(name) {
    for (const tab of $("tabs").children) {
      tab.setAttribute("aria-pressed", String(tab.textContent === name));
    }

    $("questions").replaceChildren(
      ...categories[name].map(text => button(text, () => send(text)))
    );
  }

  for (const name of Object.keys(categories)) {
    $("tabs").append(button(name, () => showCategory(name)));
  }

  function send(raw) {
    const text = raw.trim();
    if (!text) return;

    const q = normalize(text);
    $("question").value = "";

    if (quizIndex >= 0) {
      const options = data.quiz[quizIndex].options;
      const choice = options.findIndex(
        (option, i) => normalize(option) === q || String(i + 1) === q
      );

      if (choice >= 0) {
        answerQuiz(choice);
        return;
      }
    }

    removeQuizControls();
    quizIndex = -1;
    addMessage(text, true);
    setFace("開心");

    if (/測驗|考考我|答題/.test(q)) {
      showQuiz(0);
      return;
    }

    if (/明信片|打氣|加油/.test(q)) {
      setFace("眨眼");
      addMessage(data.postcards[postcardIndex]);
      postcardIndex = (postcardIndex + 1) % data.postcards.length;
      return;
    }

    if (/音效|片頭|開台訊號/.test(q)) {
      $("broadcast").scrollIntoView({ block: "center" });
      $("broadcast").focus();
      stopSpeech();
      $("broadcast").play().catch(() => {
        setStatus("請點下方音效播放器的播放按鈕。");
      });
      return;
    }

    if (/^(你好|嗨|哈囉|hi|hello)$/.test(q)) {
      addMessage(data.greeting);
      return;
    }

    if (lastAnswer && /^(還有呢|再說一次|詳細一點)$/.test(q)) {
      addMessage(lastAnswer.answer, false, lastAnswer.source);
      return;
    }

    const docs = [
      ...data.mail.map(item => ({ ...item, source: false })),
      ...data.characters.map(item => ({ ...item, source: true })),
      ...data.radio.map(item => ({ ...item, source: false }))
    ];

    let best = null;
    let bestScore = 0;

    for (const doc of docs) {
      let score = normalize(doc.question) === q ? 10000 : 0;

      for (const key of doc.keys) {
        const term = normalize(key);
        if (q.includes(term)) score += term.length ** 2;
      }

      if (score > bestScore) {
        best = doc;
        bestScore = score;
      }
    }

    if (best) {
      lastAnswer = best;
      addMessage(best.answer, false, best.source);
    } else {
      setFace("驚訝");
      addMessage(data.unknown);
    }
  }

  function abortRecognition() {
    if (!recognition) return;
    const session = recognition;
    recognition = null;
    session.abort();
    $("mic").textContent = "語音提問";
    $("mic").setAttribute("aria-pressed", "false");
  }

  $("chatForm").addEventListener("submit", event => {
    event.preventDefault();
    send($("question").value);
    $("question").focus();
  });

  $("stopRead").onclick = () => {
    stopSpeech();
    setStatus("已停止朗讀。");
  };

  $("autoRead").onchange = () => {
    if (!$("autoRead").checked) stopSpeech();
    setStatus(
      $("autoRead").checked ? "已開啟自動朗讀。" : "已關閉自動朗讀。"
    );
  };

  $("broadcast").addEventListener("play", stopSpeech);

  $("mic").onclick = () => {
    if (recognition) {
      recognition.stop();
      return;
    }

    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Recognition) {
      setStatus("這個瀏覽器沒有提供即時辨識，請使用「備用錄音轉文字」。");
      return;
    }

    stopSpeech();
    $("broadcast").pause();

    const session = new Recognition();
    recognition = session;
    session.lang = "zh-TW";
    session.interimResults = false;

    session.onstart = () => {
      if (recognition !== session) return;
      $("mic").textContent = "結束收音";
      $("mic").setAttribute("aria-pressed", "true");
      setStatus("正在收音，請說出你的問題。");
    };

    session.onresult = event => {
      if (recognition !== session) return;
      $("question").value = event.results[0][0].transcript.slice(0, 300);
      setStatus("已放進輸入框，確認後再送出。");
      $("question").focus();
    };

    session.onerror = event => {
      if (recognition !== session) return;

      setStatus(
        ["not-allowed", "service-not-allowed"].includes(event.error)
          ? "請確認 Safari 已允許麥克風。也可以使用「備用錄音轉文字」。"
          : "即時辨識沒有取得文字，可以再試一次或使用備用錄音。"
      );
    };

    session.onend = () => {
      if (recognition !== session) return;
      recognition = null;
      $("mic").textContent = "語音提問";
      $("mic").setAttribute("aria-pressed", "false");
    };

    try {
      session.start();
      setStatus("正在啟動麥克風…");
    } catch {
      recognition = null;
      setStatus("無法啟動即時辨識，請使用「備用錄音轉文字」。");
    }
  };

  function openRecorder(target) {
    abortRecognition();
    stopSpeech();
    $("broadcast").pause();

    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setStatus("這個瀏覽器無法錄音，可以使用裝置鍵盤的聽寫功能輸入。");
      return;
    }

    const dialog = document.createElement("dialog");
    dialog.setAttribute("aria-label", "備用錄音轉文字");

    const title = document.createElement("h2");
    title.textContent = "備用錄音轉文字";

    const tip = document.createElement("p");
    tip.setAttribute("role", "status");
    tip.textContent =
      "最多錄 15 秒。按「送交辨識」才會將錄音傳給 ElevenLabs，辨識後可以先修改文字。";

    const controls = document.createElement("div");
    controls.className = "row";
    dialog.append(title, tip, controls);
    document.body.append(dialog);

    let recorder = null;
    let stream = null;
    let timer = null;
    let recording = null;
    let closed = false;

    function release() {
      clearTimeout(timer);
      stream?.getTracks().forEach(track => track.stop());
    }

    dialog.addEventListener("close", () => {
      closed = true;
      if (recorder?.state === "recording") recorder.stop();
      release();
      dialog.remove();
      target.focus();
    });

    const start = button("開始錄音", async () => {
      start.disabled = true;

      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        if (closed) {
          release();
          return;
        }

        recorder = new MediaRecorder(stream);
        const chunks = [];

        recorder.ondataavailable = event => {
          if (event.data.size) chunks.push(event.data);
        };

        recorder.onstop = () => {
          release();
          if (closed) return;

          recording = new Blob(chunks, { type: recorder.mimeType });
          stop.disabled = true;
          upload.disabled = !recording.size;
          tip.textContent = "錄音完成，可以送交辨識。";
        };

        recorder.onerror = () => {
          release();
          if (closed) return;
          tip.textContent = "錄音中斷，請關閉後再試一次。";
          stop.disabled = true;
        };

        recorder.start();
        stop.disabled = false;
        tip.textContent = "正在錄音，說完請按「結束錄音」。";

        timer = setTimeout(() => {
          if (recorder.state === "recording") recorder.stop();
        }, 15000);
      } catch {
        release();
        start.disabled = false;
        tip.textContent =
          "麥克風無法開啟。請先在 Safari 的網站設定允許麥克風，再試一次。";
      }
    });

    const stop = button("結束錄音", () => {
      if (recorder?.state === "recording") recorder.stop();
    });
    stop.disabled = true;

    const upload = button("送交辨識", async () => {
      if (!recording) return;
      upload.disabled = true;
      tip.textContent = "正在辨識…";

      try {
        const result = await fetch("/api/transcribe", {
          method: "POST",
          body: recording,
          signal: AbortSignal.timeout(30000)
        });

        if (!result.ok) throw new Error(String(result.status));

        const resultData = await result.json();
        if (closed) return;

        if (!resultData.text?.trim()) throw new Error("empty");

        const limit = target.maxLength > 0 ? target.maxLength : 300;
        target.value = resultData.text.trim().slice(0, limit);
        dialog.close();
        setStatus("錄音已轉成文字，可以修改後再送出。");
      } catch (error) {
        if (closed) return;
        upload.disabled = false;

        tip.textContent = ["401", "402", "403", "429"].includes(error.message)
          ? "辨識服務的權限或額度目前無法使用。可以改用裝置鍵盤的聽寫功能。"
          : "這次沒有取得文字，可以重試，或關閉後打字輸入。";
      }
    });
    upload.disabled = true;

    controls.append(
      start,
      stop,
      upload,
      button("關閉", () => dialog.close())
    );

    dialog.showModal();
  }

  $("backup").onclick = () => openRecorder($("question"));

  function letterStage(text) {
    $("letterControls").replaceChildren();
    $("letterCue").textContent = text;
    $("letterStatus").textContent = "";
    $("letterCue").focus();
  }

  function startLetter() {
    stopSpeech();
    setFace("好奇");
    letterStep = 0;
    letterStory = "";

    letterStage(
      "滋——收到地球的訊號了。如果今天的心情有天氣，你那邊是晴天、陰天，還是下雨？"
    );

    const row = document.createElement("div");
    row.className = "row";

    for (const weather of ["晴天", "陰天", "雨天"]) {
      row.append(button(weather, () => {
        letterWeather = weather;
        letterStep = 1;
        askLetter();
      }));
    }

    $("letterControls").append(row);
  }

  function askLetter() {
    const prompts = {
      晴天: "晴天頻道接通了。今天哪個瞬間，讓你想按下重播？",
      陰天: "收到，今晚是陰天頻道。今天哪個瞬間，讓你想把音量轉小一點？",
      雨天: "這裡收得到你的雨聲。今天有什麼事，你想找個地方放一放？"
    };

    letterStage(
      letterStep === 1
        ? prompts[letterWeather]
        : "收播前，你想送一句什麼話給今天的自己？"
    );

    const input = document.createElement("textarea");
    input.maxLength = 300;
    input.rows = 3;
    input.setAttribute("aria-label", $("letterCue").textContent);

    const row = document.createElement("div");
    row.className = "row";

    function next(text) {
      if (letterStep === 1) {
        letterStory = text;
        letterStep = 2;
        askLetter();
      } else {
        finishLetter(text);
      }
    }

    row.append(
      button("備用錄音轉文字", () => openRecorder(input)),
      button("送出", () => {
        const text = input.value.trim();

        if (!text) {
          $("letterStatus").textContent = "可以寫一句話，也可以按「跳過」。";
          input.focus();
          return;
        }

        next(text);
      }),
      button("跳過", () => next(""))
    );

    $("letterControls").append(input, row);
    input.focus();
  }

  function finishLetter(ending) {
    setFace("眨眼");

    const script =
      "這裡是 FM 08.20，HIKUN 月球電台。\n" +
      "今晚，地球傳來了" + letterWeather + "的訊號。\n" +
      (letterStory
        ? "聽眾寫道：「" + letterStory + "」\n"
        : "今晚的聽眾想靜靜聽一會兒。\n") +
      (ending
        ? "今天的收播詞是：「" + ending + "」\n"
        : "願你今晚好好休息。\n") +
      "我是 HIKUN，我們下次空中見。";

    letterStage(script);

    const row = document.createElement("div");
    row.className = "row";
    row.append(
      button("播放我的完整廣播", () => read(script, true)),
      button("停止播放", () => {
        stopSpeech();
        setStatus("已停止朗讀。");
      }),
      button("再寫一封", startLetter)
    );

    $("letterControls").append(row);
    $("letterStatus").textContent = "你的廣播已完成，播放時使用裝置中文聲音。";
  }

  function resetChat() {
    abortRecognition();
    stopSpeech();
    $("broadcast").pause();
    removeQuizControls();

    quizIndex = -1;
    lastAnswer = null;
    postcardIndex = 0;
    $("autoRead").checked = false;
    $("question").value = "";
    $("log").replaceChildren();

    setFace("好奇");
    setStatus("");
    showCategory("主持人信箱");
    addMessage(data.greeting);
  }

  $("resetChat").onclick = () => {
    resetChat();
    $("question").focus();
  };

  $("lineShare").href =
    "https://social-plugins.line.me/lineit/share?url=" +
    encodeURIComponent(location.origin + "/");

  $("letterControls").append(
    button("開始今晚的廣播", startLetter)
  );

  resetChat();
}
