<!doctype html>
<html lang="zh-Hant-TW" data-custom-voice="disabled">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#10204b">
<title>HIKUN 月球電台</title>
<style>
:root {
  font-family: system-ui, "Noto Sans TC", sans-serif;
  color: #192952;
  background: #f3f0ff;
  --ink: #182952;
  --yellow: #ffdd73;
}
* { box-sizing: border-box; }
body { margin: 0; }
button, input { font: inherit; }
a { color: inherit; }
button { cursor: pointer; }
button:disabled { cursor: default; opacity: .65; }
:focus-visible { outline: 3px solid #ac3c27; outline-offset: 3px; }

.skip {
  position: absolute;
  left: 1rem;
  top: -5rem;
  background: white;
  padding: .65rem;
  z-index: 9;
}
.skip:focus { top: .5rem; }
.sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
header { background: #101d43; color: white; }
.bar {
  max-width: 1180px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 24px;
  gap: 12px;
}
.brand { font-weight: 900; letter-spacing: .08em; }
.brand span { color: var(--yellow); margin-right: .55rem; }
.bar a { font-size: .86rem; }

main {
  max-width: 1180px;
  margin: 36px auto 20px;
  padding: 0 24px;
  display: grid;
  grid-template-columns: .91fr 1.22fr;
  gap: 22px;
  align-items: start;
}
.hero {
  position: relative;
  min-height: 590px;
  overflow: hidden;
  padding: 30px;
  border-radius: 27px;
  background: radial-gradient(ellipse at 50% 59%, #4957a5 0%, #29396f 43%, #14214c 77%);
  color: white;
}
.freq {
  font: 700 .75rem ui-monospace, monospace;
  letter-spacing: .16em;
  color: var(--yellow);
}
h1 {
  margin: 18px 0 12px;
  font-size: clamp(2.35rem, 5vw, 4.2rem);
  line-height: 1.02;
  letter-spacing: -.055em;
}
h1 small {
  display: block;
  margin-top: 9px;
  font-size: .52em;
  letter-spacing: .03em;
}
.intro { margin: 0; color: #e2e7ff; font-size: .94rem; }
.orbit {
  position: relative;
  display: grid;
  height: 280px;
  place-items: center;
  isolation: isolate;
}
.orbit::before, .orbit::after {
  content: "";
  position: absolute;
  width: 93%;
  height: 45%;
  border: 1px solid #c8d2ff4a;
  border-radius: 50%;
  transform: rotate(-19deg);
  z-index: -1;
}
.orbit::after { width: 75%; height: 66%; transform: rotate(23deg); }
.star { position: absolute; color: var(--yellow); font-size: 1.65rem; }
.one { left: 10%; top: 34%; }
.two { right: 10%; top: 24%; }
.three { right: 22%; bottom: 12%; }
.mascot-stage {
  --face-yellow: #fbd940;
  --left-eye: 35.5%;
  --right-eye: 62.5%;
  position: relative;
  z-index: 1;
  width: var(--mascot-width, 240px);
  max-width: 100%;
  aspect-ratio: 465 / 520;
}
.mascot {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 12px 16px #10173aa0);
}
.hero.pulse .mascot-stage { animation: hop .45s ease; }
@keyframes hop { 50% { transform: translateY(-13px); } }
.expression-controls {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
}
.expression-controls button {
  min-height: 44px;
  padding: 0 10px;
  border: 1px solid #a8b7f690;
  border-radius: 14px;
  background: #192957;
  color: white;
  font-size: .79rem;
  font-weight: 750;
}
.expression-controls button[aria-pressed="true"] {
  background: #ffe38c;
  color: #17294f;
  border-color: #ffe38c;
}
.expression-controls button:focus-visible { outline-color: white; }
.face-change { display: none; position: absolute; inset: 0; color: #151515; pointer-events: none; }
.mascot-stage:not([data-expression="curious"]) .face-change { display: block; }
.face-patch, .expression-eye, .expression-mouth, .expression-cheek { position: absolute; }
.face-patch {
  left: 23.3%;
  top: 32.5%;
  width: 54.2%;
  height: 26.5%;
  border-radius: 7%;
  background: var(--face-yellow);
}
.expression-eye {
  top: 44.5%;
  width: 10%;
  height: 6%;
  border: .32rem solid currentColor;
  border-bottom: 0;
  border-radius: 100% 100% 0 0;
  transform: translate(-50%, -50%);
}
.expression-eye.left { left: var(--left-eye); }
.expression-eye.right { left: var(--right-eye); }
.expression-mouth {
  left: 49.5%;
  top: 55%;
  width: 10%;
  height: 6%;
  border-radius: 10% 10% 95% 95%;
  background: currentColor;
  transform: translate(-50%, -50%);
}
.expression-cheek {
  top: 50%;
  width: 7%;
  height: 3.2%;
  background: #f89381;
  border-radius: 50%;
  transform: translateX(-50%);
}
.expression-cheek.left { left: calc(var(--left-eye) - 4%); }
.expression-cheek.right { left: calc(var(--right-eye) + 4%); }
[data-expression="wink"] .expression-eye.right,
[data-expression="surprised"] .expression-eye {
  width: 16%;
  height: 15%;
  border: 0;
  background: white;
  border-radius: 50%;
  display: grid;
  place-items: center;
}
[data-expression="wink"] .expression-eye.right::after,
[data-expression="surprised"] .expression-eye::after {
  content: "";
  width: 33%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: currentColor;
}
[data-expression="wink"] .expression-mouth {
  height: 3.5%;
  transform: translate(-50%, -50%) rotate(-9deg);
}
[data-expression="surprised"] .expression-mouth { border-radius: 50%; width: 6.5%; }
[data-expression="surprised"] .expression-cheek { display: none; }
.signal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border: 1px solid #a8b7f65c;
  border-radius: 16px;
  background: #111d42b0;
}
.signal p { margin: 0; font-size: .85rem; }
.signal strong { display: block; color: #ffe38c; margin-bottom: 4px; }
.signal button {
  min-height: 44px;
  border: 0;
  border-radius: 24px;
  padding: 9px 12px;
  background: #ffe38c;
  color: #17294f;
  font-weight: 800;
}
.credit { margin: 15px 0 0; font-size: .73rem; color: #e5e9ff; }

.chat-column { display: grid; gap: 14px; min-width: 0; }
.panel {
  min-width: 0;
  overflow: hidden;
  background: white;
  border: 1px solid #dddff3;
  border-radius: 27px;
  box-shadow: 0 13px 32px #2c225a0c;
}
.panelhead {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 17px 19px;
  border-bottom: 1px solid #e5e7f2;
}
.identity { display: flex; align-items: center; gap: 10px; }
.avatar {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 13px;
  background: #ffe391;
  flex: none;
}
.avatar img { width: 35px; height: 36px; object-fit: contain; }
.panel h2 { margin: 0; font-size: 1.05rem; }
.sub { margin: 3px 0 0; font-size: .75rem; color: #46577c; }
.tools, .chips, .prompt-categories, .quiz-options { display: flex; gap: 6px; flex-wrap: wrap; }
.tools { justify-content: end; gap: 5px; }
.tools button, .chip, .speak, .prompt-categories button, .quiz-options button {
  min-height: 44px;
  padding: 7px 10px;
  border: 1px solid #dce1f7;
  border-radius: 16px;
  color: #263978;
  background: #f3f4fe;
  font-size: .77rem;
  font-weight: 750;
}
.tools button[aria-pressed="true"], .prompt-categories button[aria-pressed="true"] {
  background: #253c93;
  color: white;
}
.chip, .speak, .prompt-categories button, .quiz-options button { background: white; }
.chip:hover, .tools button:hover, .speak:hover { border-color: #3b54ad; }
.speak { margin-top: 6px; }
.prompt-categories { margin-bottom: 9px; }
.chips { margin-bottom: 11px; }
.quiz-options { margin-top: 9px; }
.quiz-feedback { margin-top: 7px !important; font-weight: 700; }
.log {
  height: 315px;
  overflow: auto;
  padding: 20px;
  scroll-padding: 15px;
  background: #fafaff;
}
.entry { max-width: 87%; margin: 0 0 15px; }
.entry.user { margin-left: auto; }
.who { margin: 0 0 4px; font-size: .75rem; font-weight: 850; }
.user .who { text-align: right; }
.bubble {
  padding: 11px 14px;
  border-radius: 4px 16px 16px;
  background: #ebeefe;
  line-height: 1.65;
  overflow-wrap: anywhere;
  font-size: .91rem;
}
.user .bubble { background: #253c93; color: white; border-radius: 16px 4px 16px 16px; }
.bubble p { margin: 0; white-space: pre-wrap; }
.source { display: block; width: fit-content; margin-top: 7px; font-size: .75rem; }
.composer { padding: 14px 19px 17px; }
.row { display: flex; gap: 7px; }
.row input {
  min-width: 0;
  min-height: 46px;
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #a7afcf;
  border-radius: 12px;
  color: var(--ink);
}
.primary, .mic {
  min-height: 46px;
  padding: 8px 12px;
  border: 0;
  border-radius: 12px;
  font-weight: 800;
}
.primary { background: #253c93; color: white; }
.mic { background: #e9edff; color: #24336a; }
.mic[aria-pressed="true"] { background: #fee1a5; }
.status { min-height: 2.4em; margin: 8px 0 0; color: #425478; font-size: .77rem; }
.media { padding: 16px 19px; background: white; border: 1px solid #dddff3; border-radius: 20px; }
.media h2 { margin: 0 0 5px; font-size: 1rem; }
.media p { margin: 4px 0 9px; color: #46577c; font-size: .82rem; }
.media audio { display: block; width: 100%; max-width: 430px; height: 46px; }
.media details { margin-top: 9px; color: #354a78; font-size: .83rem; }
.media summary { min-height: 44px; line-height: 44px; font-weight: 700; cursor: pointer; }
.share-line {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  border-radius: 12px;
  padding: 0 12px;
  color: white;
  background: #08733d;
  font-weight: 800;
  font-size: .83rem;
  text-decoration: none;
}
.foot { padding: 8px 24px 22px; text-align: center; color: #46577c; font-size: .78rem; }

@media (max-width: 790px) {
  main { grid-template-columns: 1fr; max-width: 610px; margin-top: 17px; }
  .hero { min-height: 0; padding: 23px; }
  .orbit { height: 240px; }
  .mascot-stage { --mascot-width: 207px; }
}
@media (max-width: 460px) {
  main { padding: 0 12px; gap: 14px; }
  .bar { padding: 12px; }
  .composer, .panelhead, .log { padding-inline: 12px; }
  .hero { padding: 19px; }
  .orbit { height: 205px; }
  .mascot-stage { --mascot-width: 175px; }
  .entry { max-width: 94%; }
  .row input { font-size: 16px; }
  .primary, .mic, .expression-controls button { padding-inline: 8px; }
  .tools button { padding-inline: 7px; }
  .expression-eye { border-width: .23rem; border-bottom: 0; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; scroll-behavior: auto !important; }
}
</style>
</head>

<body>
<a class="skip" href="#prompt">跳到聊天輸入</a>

<header>
  <div class="bar">
    <div class="brand"><span aria-hidden="true">✦</span> HIKUN RADIO</div>
    <a href="#chat">前往聊天</a>
  </div>
</header>

<main>
  <section class="hero" id="hero" aria-labelledby="title">
    <div class="freq">FM 08.20 · MOON RADIO</div>
    <h1 id="title">HIKUN<small>月球電台</small></h1>
    <p class="intro">問我 TRUZ 小知識，或來領取一則月球訊號。</p>

    <div class="orbit">
      <span class="star one" aria-hidden="true">✧</span>
      <span class="star two" aria-hidden="true">✦</span>
      <span class="star three" aria-hidden="true">✧</span>
      <div class="mascot-stage" id="mascot-stage" data-expression="curious">
        <img class="mascot" src="hikun-clean.webp" alt="">
        <div class="face-change" aria-hidden="true">
          <span class="face-patch"></span>
          <span class="expression-eye left"></span>
          <span class="expression-eye right"></span>
          <span class="expression-cheek left"></span>
          <span class="expression-cheek right"></span>
          <span class="expression-mouth"></span>
        </div>
      </div>
    </div>

    <div class="expression-controls" role="group" aria-label="切換 HIKUN 表情">
      <button type="button" data-face="curious" aria-pressed="true">好奇</button>
      <button type="button" data-face="happy" aria-pressed="false">開心</button>
      <button type="button" data-face="wink" aria-pressed="false">眨眼</button>
      <button type="button" data-face="surprised" aria-pressed="false">驚訝</button>
    </div>
    <p class="sr" id="expression-status" role="status">HIKUN 現在的表情是好奇。</p>

    <div class="signal">
      <p><strong>月球來訊</strong>收一張 HIKUN 的星光明信片。</p>
      <button type="button" id="signal">接收訊號</button>
    </div>
    <p class="credit">
      TRUZ 粉絲課堂作品 ·
      <a href="https://linefriends.com/ko-kr/characters-list/ip-truz">LINE FRIENDS 角色資料</a>
    </p>
  </section>

  <div class="chat-column">
    <section class="panel" id="chat" aria-labelledby="chat-title">
      <div class="panelhead">
        <div class="identity">
          <span class="avatar" aria-hidden="true">
            <img src="hikun-clean.webp" width="35" height="36" alt="">
          </span>
          <div>
            <h2 id="chat-title">跟 HIKUN 對話</h2>
            <p class="sub">角色問答 · 電台互動</p>
          </div>
        </div>
        <div class="tools">
          <button id="voice" type="button" aria-pressed="false">自動朗讀</button>
          <button id="reset" type="button">重開對話</button>
        </div>
      </div>

      <div class="log" id="log" role="log" aria-label="聊天記錄" aria-live="polite" tabindex="0"></div>

      <div class="composer">
        <div class="prompt-categories" role="group" aria-label="提問主題">
          <button type="button" data-topic="characters" aria-pressed="true">角色與故事</button>
          <button type="button" data-topic="radio" aria-pressed="false">月球電台</button>
          <button type="button" data-topic="practice" aria-pressed="false">小測驗與語音</button>
        </div>
        <div class="chips" id="question-chips" role="group" aria-label="快速提問"></div>
        <form id="form">
          <label class="sr" for="prompt">輸入訊息</label>
          <div class="row">
            <input id="prompt" enterkeyhint="send" placeholder="輸入你想問的問題…" maxlength="240" required>
            <button id="mic" class="mic" type="button" aria-pressed="false">語音</button>
            <button class="primary" type="submit">送出</button>
          </div>
        </form>
        <p id="status" class="status" role="status">可打字或點選快速提問。語音輸入需瀏覽器支援及麥克風權限。</p>
        <noscript><p>請啟用 JavaScript 以使用聊天功能。</p></noscript>
      </div>
    </section>

    <section class="media" aria-labelledby="broadcast-title">
      <h2 id="broadcast-title">收聽月球電台片頭</h2>
      <p>4 秒原創音效，可暫停、重播或靜音。</p>
      <audio id="broadcast" controls preload="none" aria-labelledby="broadcast-title" aria-describedby="broadcast-caption">
        <source src="moon-signal.wav" type="audio/wav">
        此瀏覽器無法播放音效，請閱讀下方聲音描述。
      </audio>
      <details>
        <summary>聲音描述</summary>
        <p id="broadcast-caption">四聲像星星亮起的電子音依序升高，最後兩個音一起響起，再慢慢淡出。音效中沒有對白。</p>
      </details>
      <a class="share-line"
         href="https://line.me/R/share?text=HIKUN%20%E6%9C%88%E7%90%83%E9%9B%BB%E5%8F%B0%0Ahttps%3A%2F%2Fhikun-moon-radio.aquamacaw1024.chatgpt.site%2F"
         target="_blank" rel="noopener noreferrer">分享到 LINE（新視窗）</a>
    </section>
  </div>
</main>

<footer class="foot">
  角色設定屬於 TRUZ／LINE FRIENDS。月球電台與明信片為本作品原創情境。
  <a href="https://www.deviantart.com/bt21fanart/art/TRUZ-Hikun-Pose-1072015107">角色原畫參考：Bt21Fanart</a>
</footer>

<script type="application/json" id="knowledge">
[
  {
    "id": "hikun",
    "title": "HIKUN",
    "keys": ["hikun", "機器人", "個性", "表情", "你是誰", "你叫什麼", "喜坤", "希坤"],
    "text": "HIKUN 是 TRUZ 裡情感豐富的機器人。剛認識時可能有點冷淡，熟了以後就會露出各種搞怪的表情。",
    "source": "https://linefriends.com/ko-kr/characters-list/ip-truz"
  },
  {
    "id": "story",
    "title": "TRUZ 故事",
    "keys": ["truz", "故事", "實驗室", "背景", "設定", "由來", "世界觀"],
    "text": "TRUZ 的故事從實驗室開始。大家醒來後記不起自己的來歷，只知道每個人都有特殊能力，於是一起踏上尋找自我的旅程。",
    "source": "https://linefriends.com/ko-kr/characters-list/ip-truz"
  },
  {
    "id": "ruru",
    "title": "RURU",
    "keys": ["ruru", "棉花糖"],
    "text": "RURU 是小小的棉花糖角色，能讓冷掉的氣氛變暖，也可以複製自己的身體。",
    "source": "https://linefriends.com/ko-kr/characters-list/ip-truz"
  },
  {
    "id": "chilli",
    "title": "CHILLI",
    "keys": ["chilli", "辣椒"],
    "text": "CHILLI 想成為帥氣的角色。只要下定決心，即使熬夜也會把事情做完。",
    "source": "https://linefriends.com/ko-kr/characters-list/ip-truz"
  },
  {
    "id": "romy",
    "title": "ROMY",
    "keys": ["romy", "玫瑰"],
    "text": "ROMY 是笑容迷人的白玫瑰，喜歡唱歌跳舞，總能讓周圍的氣氛更明亮。",
    "source": "https://linefriends.com/ko-kr/characters-list/ip-truz"
  },
  {
    "id": "friends",
    "title": "其他角色",
    "keys": ["其他角色", "角色有哪些", "朋友", "還有誰", "角色介紹", "角色"],
    "text": "TRUZ 的角色有 RURU、CHILLI 和 ROMY 等。你可以直接輸入名字，聽我介紹其中一位。",
    "source": "https://linefriends.com/ko-kr/characters-list/ip-truz"
  }
]
</script>

<script type="application/json" id="voice-content">
{
  "greeting": "嗶——這裡是 HIKUN 月球電台！想知道我在 TRUZ 裡的故事，還是想收一張星光明信片？",
  "postcards": [
    "月球明信片 01／窗外一片黑的時候，也還是有星星。今天可以先做一件小事，剩下的明天再說。",
    "月球明信片 02／收到你的訊號了。累的話先休息一下，等你有力氣再回來，我會留著這個頻道。",
    "月球明信片 03／今天的星星有點慢才亮。沒關係，你也可以慢慢來。"
  ],
  "quiz": [
    {
      "prompt": "TRUZ 的故事從哪裡開始？",
      "choices": ["實驗室", "海邊", "車站"],
      "answer": 0,
      "feedback": "大家在實驗室醒來，只知道自己有特殊能力。"
    },
    {
      "prompt": "誰可以複製自己的身體？",
      "choices": ["ROMY", "RURU", "CHILLI"],
      "answer": 1,
      "feedback": "RURU 是可以複製自己的小棉花糖。"
    },
    {
      "prompt": "哪個角色是一朵喜歡唱歌跳舞的白玫瑰？",
      "choices": ["HIKUN", "CHILLI", "ROMY"],
      "answer": 2,
      "feedback": "ROMY 喜歡唱歌跳舞，總能讓氣氛更明亮。"
    }
  ],
  "radio": [
    "今天的月球電台有一點星光和一點安靜。這是電台故事裡的虛構天氣。",
    "拿一個圓形當起點，畫一個戴耳機的月亮。再替它畫出正在聽的聲音。",
    "月球任務：看看窗外，找一樣藍色的東西，再用三個字形容它。",
    "按輸入框旁的「語音」，允許麥克風後說出問題。辨識文字會先填進輸入框，確認後再按送出。也可以直接打字。",
    "可以！點聊天訊息下方的「朗讀這則」，也可以用上方的「自動朗讀」聽接下來的回覆。",
    "你可以問 TRUZ 角色、收明信片、做小測驗，或聽電台音效。用打字、語音或快速提問都可以。"
  ],
  "listen": "電台片頭在聊天室下方，也可以點這裡直接收聽。",
  "unavailable": "我的資料庫目前收錄 TRUZ 的故事和角色介紹，找不到這項資訊。你可以先問我「HIKUN 是誰？」",
  "unknown": "這題我沒有找到對應的資料。可以試試「TRUZ 的故事」或直接問我「RURU」。",
  "retry": "再試一次，HIKUN 還在等你的答案。"
}
</script>

<script>
const byId = id => document.getElementById(id);
const knowledge = JSON.parse(byId('knowledge').textContent);
const voiceContent = JSON.parse(byId('voice-content').textContent);
const { greeting, postcards, quiz } = voiceContent;

const log = byId('log');
const prompt = byId('prompt');
const status = byId('status');
const voice = byId('voice');
const mic = byId('mic');
const stage = byId('mascot-stage');
const broadcast = byId('broadcast');
const expressionButtons = [...document.querySelectorAll('[data-face]')];
const topicButtons = [...document.querySelectorAll('[data-topic]')];

const customVoiceEnabled = document.documentElement.dataset.customVoice === 'enabled';
const browserVoiceEnabled = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

let postcard = 0;
let lastTopic = null;
let speaking = false;
let recognition = null;
let activeSpeech = null;
let speechTimer;
let quizIndex = 0;
let quizAttempt = null;

const topics = {
  characters: [
    'HIKUN 是誰？', 'TRUZ 的故事從哪裡開始？', 'RURU 有什麼能力？',
    'CHILLI 想成為怎樣的角色？', 'ROMY 喜歡做什麼？', '其他角色'
  ],
  radio: [
    '我今天有點累', '可以送我一張明信片嗎？', '今天的月球天氣？',
    '給我一個畫畫題目', '給我一個小任務', '我要聽電台音效'
  ],
  practice: [
    '開始 TRUZ 小測驗', '怎麼用語音提問？', '可以念給我聽嗎？', '這個電台能做什麼？'
  ]
};

const radioReplies = [
  [/月球天氣|電台天氣/, voiceContent.radio[0]],
  [/畫畫|畫圖|畫什麼/, voiceContent.radio[1]],
  [/小任務|給我.*任務/, voiceContent.radio[2]],
  [/怎麼.*語音|語音提問|麥克風/, voiceContent.radio[3]],
  [/朗讀|念給我|唸給我/, voiceContent.radio[4]],
  [/能做什麼|怎麼玩|有哪些功能/, voiceContent.radio[5]]
];

function normalize(text) {
  return text.normalize('NFKC').toLowerCase().replace(/[\p{P}\p{Z}\s]+/gu, '');
}

function setExpression(expression) {
  if (stage.dataset.expression === expression) return;
  stage.dataset.expression = expression;

  expressionButtons.forEach(button => {
    const selected = button.dataset.face === expression;
    button.setAttribute('aria-pressed', String(selected));
    if (selected) {
      byId('expression-status').textContent = 'HIKUN 現在的表情是' + button.textContent + '。';
    }
  });
}

function stopSpeech() {
  clearTimeout(speechTimer);
  if (activeSpeech) {
    const audio = activeSpeech;
    activeSpeech = null;
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
    audio.remove();
  }
  if (browserVoiceEnabled) speechSynthesis.cancel();
}

function browserRead(text) {
  if (!browserVoiceEnabled) {
    status.textContent = '語音暫時無法播放，請閱讀對話文字。';
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-TW';
  utterance.rate = .93;
  utterance.onerror = event => {
    if (!['canceled', 'interrupted'].includes(event.error)) {
      status.textContent = '語音暫時無法播放，請閱讀對話文字。';
    }
  };
  speechSynthesis.speak(utterance);
}

function read(text) {
  stopSpeech();
  broadcast.pause();

  if (!customVoiceEnabled) {
    browserRead(text);
    return;
  }

  const audio = new Audio();
  audio.hidden = true;
  audio.preload = 'none';
  audio.src = '/api/speech?' + new URLSearchParams({ text });
  document.body.append(audio);
  activeSpeech = audio;
  status.textContent = '正在準備 HIKUN 的朗讀…';

  const fallback = () => {
    if (activeSpeech !== audio) return;
    stopSpeech();
    status.textContent = 'HIKUN 音色暫時無法播放，已切換至瀏覽器朗讀。';
    browserRead(text);
  };

  audio.addEventListener('error', fallback, { once: true });
  audio.addEventListener('playing', () => {
    if (activeSpeech !== audio) return;
    clearTimeout(speechTimer);
    status.textContent = 'HIKUN 正在朗讀。';
  }, { once: true });
  audio.addEventListener('ended', () => {
    if (activeSpeech !== audio) return;
    activeSpeech = null;
    audio.remove();
    status.textContent = '朗讀完成。';
  }, { once: true });

  speechTimer = setTimeout(fallback, 16000);
  audio.play().catch(fallback);
}

function add(name, content, source) {
  const isUser = name === '你';
  const entry = document.createElement('div');
  entry.className = isUser ? 'entry user' : 'entry';

  const who = document.createElement('p');
  who.className = 'who';
  who.textContent = name;

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  const body = document.createElement('p');
  body.textContent = content;
  bubble.append(body);

  if (source) {
    const link = document.createElement('a');
    link.className = 'source';
    link.href = source;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = 'LINE FRIENDS 角色資料（新分頁）';
    bubble.append(link);
  }

  entry.append(who, bubble);
  if (!isUser && !voice.disabled) {
    const button = document.createElement('button');
    button.className = 'speak';
    button.type = 'button';
    button.textContent = '朗讀這則';
    button.addEventListener('click', () => read(content));
    entry.append(button);
  }

  log.append(entry);
  log.scrollTop = log.scrollHeight;
  if (speaking && !isUser) read(content);
}

function retrieve(question, previous) {
  const normalized = normalize(question);
  const ranked = knowledge.map(doc => ({
    doc,
    score: doc.keys.reduce(
      (score, key) => normalized.includes(key) ? score + key.length ** 2 : score,
      0
    )
  })).sort((a, b) => b.score - a.score);

  if (ranked[0].score > 0) return ranked[0].doc;
  if (/^(他|她|牠|它|你)?(還有呢|詳細一點|再說一次|呢)$/.test(normalized)) return previous;
  return null;
}

function card() {
  const hero = byId('hero');
  hero.classList.remove('pulse');
  void hero.offsetWidth;
  hero.classList.add('pulse');
  setExpression('wink');
  add('HIKUN', postcards[postcard]);
  postcard = (postcard + 1) % postcards.length;
}

function showTopic(topic) {
  topicButtons.forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.topic === topic));
  });

  const buttons = topics[topic].map(question => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'chip';
    button.textContent = question;
    button.addEventListener('click', () => send(question));
    return button;
  });
  byId('question-chips').replaceChildren(...buttons);
}

function showQuizQuestion() {
  if (quizAttempt) quizAttempt.remove();
  const question = quiz[quizIndex];
  add('HIKUN', '第 ' + (quizIndex + 1) + '／' + quiz.length + ' 題　' + question.prompt);

  const group = document.createElement('div');
  group.className = 'quiz-options';
  group.setAttribute('role', 'group');
  group.setAttribute('aria-label', question.prompt);

  const feedback = document.createElement('p');
  feedback.className = 'quiz-feedback';
  feedback.setAttribute('role', 'status');

  const entry = log.lastElementChild;
  quizAttempt = group;

  question.choices.forEach((choice, index) => {
    const option = document.createElement('button');
    option.type = 'button';
    option.textContent = choice;
    option.addEventListener('click', () => {
      if (index !== question.answer) {
        setExpression('surprised');
        feedback.textContent = voiceContent.retry;
        if (speaking) read(feedback.textContent);
        return;
      }

      setExpression('happy');
      feedback.textContent = '答對了！' + question.feedback;
      if (speaking) read(feedback.textContent);

      const done = quizIndex === quiz.length - 1;
      const next = document.createElement('button');
      next.type = 'button';
      next.textContent = done ? '再玩一次' : '下一題';
      next.addEventListener('click', () => {
        quizIndex = done ? 0 : quizIndex + 1;
        showQuizQuestion();
        quizAttempt.querySelector('button').focus();
      });
      group.replaceChildren(next);
      next.focus();
    });
    group.append(option);
  });

  entry.append(group, feedback);
  log.scrollTop = log.scrollHeight;
}

function send(raw) {
  const question = raw.trim();
  if (!question) {
    status.textContent = '請輸入一點文字再送出。';
    return;
  }

  add('你', question);

  if (/小測驗|答題|考考我/.test(question)) {
    quizIndex = 0;
    showQuizQuestion();
    return;
  }

  if (/音效|片頭|收聽電台/.test(question)) {
    setExpression('wink');
    add('HIKUN', voiceContent.listen);

    const play = document.createElement('button');
    play.type = 'button';
    play.className = 'speak';
    play.textContent = '播放月球電台片頭';
    play.addEventListener('click', () => {
      stopSpeech();
      broadcast.focus();
      broadcast.play().catch(() => {
        status.textContent = '請使用下方的音效播放器。';
      });
    });

    log.lastElementChild.append(play);
    log.scrollTop = log.scrollHeight;
    return;
  }

  const radioReply = radioReplies.find(([pattern]) => pattern.test(question));
  if (radioReply) {
    setExpression('happy');
    add('HIKUN', radioReply[1]);
    return;
  }

  if (/打氣|明信片|訊號|心情不好|好累|有點累|加油/.test(question)) {
    card();
    return;
  }

  if (/^(你好|哈囉|嗨|hi|hello)$/.test(normalize(question))) {
    setExpression('happy');
    add('HIKUN', greeting);
    return;
  }

  if (/演唱會|票價|行程|今天幾點|購買|哪裡買|最新消息|生日/.test(question)) {
    setExpression('surprised');
    add('HIKUN', voiceContent.unavailable);
    return;
  }

  const match = retrieve(question, lastTopic);
  if (!match) {
    setExpression('surprised');
    add('HIKUN', voiceContent.unknown);
    return;
  }

  lastTopic = match;
  setExpression('happy');
  add('HIKUN', '月球電台收到。' + match.text, match.source);
}

expressionButtons.forEach(button => {
  button.addEventListener('click', () => setExpression(button.dataset.face));
});

topicButtons.forEach(button => {
  button.addEventListener('click', () => showTopic(button.dataset.topic));
});

byId('form').addEventListener('submit', event => {
  event.preventDefault();
  if (!prompt.value.trim()) {
    send('');
    return;
  }
  send(prompt.value);
  prompt.value = '';
  prompt.focus();
});

byId('signal').addEventListener('click', () => {
  send('接收月球訊號');
  byId('chat-title').setAttribute('tabindex', '-1');
  byId('chat-title').focus();
});

broadcast.addEventListener('play', stopSpeech);
voice.disabled = !customVoiceEnabled && !browserVoiceEnabled;
if (voice.disabled) voice.textContent = '朗讀未支援';

voice.addEventListener('click', () => {
  speaking = !speaking;
  voice.setAttribute('aria-pressed', String(speaking));
  if (!speaking) stopSpeech();
  status.textContent = speaking ? '已開啟自動朗讀。' : '已關閉自動朗讀。';
});

byId('reset').addEventListener('click', () => {
  if (recognition) {
    const active = recognition;
    recognition = null;
    active.abort();
    mic.setAttribute('aria-pressed', 'false');
    mic.textContent = '語音';
  }

  stopSpeech();
  broadcast.pause();
  log.replaceChildren();
  prompt.value = '';
  lastTopic = null;
  postcard = 0;
  quizIndex = 0;
  quizAttempt = null;
  setExpression('curious');
  add('HIKUN', greeting);
  status.textContent = '已重新開啟對話。';
  prompt.focus();
});

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!Recognition) {
  mic.disabled = true;
  status.textContent = '此瀏覽器未支援語音輸入，你可以打字或使用快速提問。';
}

mic.addEventListener('click', () => {
  if (recognition) {
    recognition.stop();
    return;
  }

  const current = new Recognition();
  recognition = current;
  current.lang = 'zh-TW';
  current.maxAlternatives = 1;

  current.onstart = () => {
    if (recognition !== current) return;
    mic.textContent = '停止';
    status.textContent = '正在聆聽，請說話。';
  };

  current.onresult = event => {
    if (recognition !== current) return;
    prompt.value = event.results[0][0].transcript.slice(0, 240);
    status.textContent = '已轉成文字，可以修改後再送出。';
    prompt.focus();
  };

  current.onerror = event => {
    if (recognition !== current) return;
    status.textContent = ['not-allowed', 'service-not-allowed'].includes(event.error)
      ? '麥克風權限或語音服務不可用，仍可打字提問。'
      : '沒有取得可用的語音內容，可以再試一次或直接打字。';
  };

  current.onend = () => {
    if (recognition !== current) return;
    recognition = null;
    mic.setAttribute('aria-pressed', 'false');
    mic.textContent = '語音';
    if (['正在聆聽，請說話。', '正在啟動麥克風…'].includes(status.textContent)) {
      status.textContent = '語音輸入已結束，可以再試一次或直接打字。';
    }
  };

  try {
    stopSpeech();
    current.start();
    mic.setAttribute('aria-pressed', 'true');
    status.textContent = '正在啟動麥克風…';
  } catch {
    recognition = null;
    status.textContent = '無法啟動麥克風，可以直接打字。';
  }
});

showTopic('characters');
add('HIKUN', greeting);
</script>
</body>
</html>
