#!/usr/bin/env node
// Google Cloud Text-to-Speech (en-US-Chirp3-HD-Zephyr) で単語・例文の音声ファイルを
// 事前生成するスクリプト。アプリの実行時にはAPIを呼び出さない
// （一度だけ実行してaudio/以下にmp3を生成する。Web Speech APIへのフォールバックは無し）。
//
// 使い方:
//   GOOGLE_TTS_API_KEY=xxxxx node scripts/generate-audio.js
//
// 再生成が必要になったとき（単語・例文を追加/変更したとき）に再実行する。

const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = process.env.GOOGLE_TTS_API_KEY;
if (!API_KEY) {
  console.error('環境変数 GOOGLE_TTS_API_KEY を設定してください。');
  process.exit(1);
}

const ROOT = path.join(__dirname, '..');

// words.js / verbs.js は window.XXX に代入する形なので window を用意して読み込む
global.window = global;
require(path.join(ROOT, 'js/data/verbs.js'));
require(path.join(ROOT, 'js/data/words.js'));

const words = global.JHS_WORDS;
const verbs = global.IRREGULAR_VERBS;

// audio.js の speak() と同じクリーニングルール
function cleanText(text) {
  return text.replace(/~ing|~|\(.*\)/g, '').replace(/\//g, ' ').trim();
}

// audio.js の speakVerbForms() と同じ組み立てロジック
function buildVerbCombined(present, past, participle) {
  let cleanPresent = present.replace(/~ing|~|\(.*\)/g, '').trim();
  let cleanPast = past.replace(/~ing|~|\(.*\)/g, '').trim();
  let cleanParticiple = participle.replace(/~ing|~|\(.*\)/g, '').trim();

  if (cleanPresent.toLowerCase() === 'be') {
    cleanPresent = 'be';
    cleanPast = 'was';
  }
  if (cleanPresent.toLowerCase() === 'read') {
    cleanPast = 'red';
    cleanParticiple = 'red';
  }
  if (cleanPresent.toLowerCase() === 'lead') {
    cleanPresent = 'leed';
  }

  return `${cleanPresent}, ${cleanPast}, ${cleanParticiple}.`;
}

// text(発音される文字列そのまま) -> ファイル名(拡張子なし) のMap
const entries = new Map();

function addEntry(text, slug) {
  const clean = cleanText(text);
  if (!clean || entries.has(clean)) return;
  entries.set(clean, slug);
}

words.forEach((w) => {
  addEntry(w.word, `word-${w.id}`);
  addEntry(w.example, `word-${w.id}-example`);
});

verbs.forEach((v) => {
  const combined = buildVerbCombined(v.present, v.past, v.participle);
  if (!entries.has(combined)) entries.set(combined, `verb-${v.id}`);
  addEntry(v.example, `verb-${v.id}-example`);
});

console.log(`生成対象: ${entries.size} 件`);

const outDir = path.join(ROOT, 'audio');
fs.mkdirSync(outDir, { recursive: true });

function synthesize(text) {
  const body = JSON.stringify({
    input: { text },
    voice: { languageCode: 'en-US', name: 'en-US-Chirp3-HD-Zephyr' },
    audioConfig: { audioEncoding: 'MP3', speakingRate: 1.0, pitch: 0 },
  });

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'texttospeech.googleapis.com',
        path: `/v1/text:synthesize?key=${API_KEY}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          if (res.statusCode !== 200) {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
            return;
          }
          try {
            resolve(JSON.parse(data).audioContent);
          } catch (e) {
            reject(e);
          }
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

const manifest = {};

async function main() {
  let i = 0;
  const failures = [];
  for (const [text, slug] of entries) {
    i++;
    const filename = `${slug}.mp3`;
    const filePath = path.join(outDir, filename);
    process.stdout.write(`[${i}/${entries.size}] ${text}\n`);
    try {
      const audioContentB64 = await synthesize(text);
      fs.writeFileSync(filePath, Buffer.from(audioContentB64, 'base64'));
      manifest[text] = `audio/${filename}`;
    } catch (err) {
      failures.push({ text, error: err.message });
      console.error(`  失敗: ${err.message}`);
    }
    await new Promise((r) => setTimeout(r, 30));
  }

  const manifestPath = path.join(ROOT, 'js/data/audioManifest.js');
  fs.writeFileSync(
    manifestPath,
    `// 自動生成ファイル: scripts/generate-audio.js で作成\n` +
      `// Google Cloud Text-to-Speechで事前生成した音声の (発音テキスト -> mp3パス) マッピング\n` +
      `window.AUDIO_MANIFEST = ${JSON.stringify(manifest, null, 2)};\n`
  );

  console.log(`\n完了: ${entries.size - failures.length}/${entries.size} 件成功`);
  if (failures.length > 0) {
    console.log('失敗一覧:');
    failures.forEach((f) => console.log(`  - ${f.text}: ${f.error}`));
  }
}

main();
