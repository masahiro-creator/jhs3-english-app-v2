// Web Speech API 発音再生モジュール (iPadOS/Safari/Chrome 完全対応)
window.AudioEngine = {
  speechRate: 0.9, // 聞き取りやすいクリアな速度
  autoPlay: true,   // 単語切り替え時の自動発音再生 (デフォルト: ON)

  _voices: [],
  _voicesReady: null,

  /**
   * 現時点で取得できる音声一覧をキャッシュに反映
   */
  _loadVoices() {
    this._voices = window.speechSynthesis.getVoices();
    return this._voices;
  },

  /**
   * 音声リストの読み込み完了を待つ
   * iOS Safariは初回アクセス時に getVoices() が空配列を返すことがあり、
   * その状態で発音すると声を選べずOS標準（男声になることがある）にフォールバックしてしまう。
   * voiceschanged を待つか、最大1.5秒でタイムアウトして進める。
   */
  _ensureVoicesReady() {
    if (this._voicesReady) return this._voicesReady;

    this._voicesReady = new Promise((resolve) => {
      const existing = this._loadVoices();
      if (existing.length > 0) {
        resolve(existing);
        return;
      }

      const onChanged = () => {
        window.speechSynthesis.removeEventListener('voiceschanged', onChanged);
        clearTimeout(timeoutId);
        resolve(this._loadVoices());
      };
      window.speechSynthesis.addEventListener('voiceschanged', onChanged);

      const timeoutId = setTimeout(() => {
        window.speechSynthesis.removeEventListener('voiceschanged', onChanged);
        resolve(this._loadVoices());
      }, 1500);
    });

    return this._voicesReady;
  },

  /**
   * 女性の声を優先して選択（端末・ブラウザごとに声の名前が異なるため候補を広めに用意）
   */
  _pickVoice(voices) {
    const preferredVoices = [
      'Google US English',      // PC(Chrome)の女性
      'Microsoft Zira',         // PC(Windows)の女性
      'Microsoft Aria',         // PC(Windows 新)の女性
      'Samantha',               // iOS/macOSの標準女性
      'Ava',                    // iOS/macOSの女性（新しめ）
      'Allison',                // iOS/macOSの女性
      'Susan',                  // iOS/macOSの女性
      'Victoria',               // iOS/macOSの女性
      'Karen',                  // iOS/macOSの女性（豪州）
      'Moira',                  // iOS/macOSの女性（アイルランド）
      'Tessa',                  // iOS/macOSの女性（南ア）
      'Serena',                 // iOS/macOSの女性（英）
      'Fiona',                  // iOS/macOSの女性（スコットランド）
      'Kate',                   // iOS/macOSの女性（英）
      'Zoe',                    // iOS/macOSの女性
      'Google UK English Female'
    ];

    for (const name of preferredVoices) {
      const found = voices.find(v => v.lang.startsWith('en') && v.name.includes(name));
      if (found) return found;
    }

    // 候補にない場合も、できるだけ en-US の声から選ぶ
    return voices.find(v => v.lang === 'en-US') ||
           voices.find(v => v.lang.startsWith('en')) ||
           null;
  },

  /**
   * 単語・文章の英語発音再生
   * @param {string} text 発音する英語
   * @param {function} onEnd 再生終了時コールバック
   * @param {number} customRate 個別速度設定（省略時はデフォルト）
   */
  speak(text, onEnd = null, customRate = null) {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech Synthesis API に未対応のブラウザです。');
      if (onEnd) onEnd();
      return;
    }

    // 再生中の音声をキャンセル
    window.speechSynthesis.cancel();

    // 不要な記号・注釈・括弧を除去
    const cleanText = text.replace(/~ing|~|\(.*\)/g, '').replace(/\//g, ' ').trim();

    this._ensureVoicesReady().then((voices) => {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'en-US';
      utterance.rate = customRate || this.speechRate;
      utterance.pitch = 1.0;

      const englishVoice = this._pickVoice(voices);
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      if (onEnd) {
        utterance.onend = onEnd;
        utterance.onerror = onEnd;
      }

      window.speechSynthesis.speak(utterance);
    });
  },

  /**
   * 不規則動詞の3活用をナチュラル＆クリアなリズムで再生
   * (カンマを挟むことで "have, had, had." のように早口にならず1語ずつハッキリ朗読)
   */
  speakVerbForms(present, past, participle, onComplete = null) {
    if (!('speechSynthesis' in window)) {
      if (onComplete) onComplete();
      return;
    }

    let cleanPresent = present.replace(/~ing|~|\(.*\)/g, '').trim();
    let cleanPast = past.replace(/~ing|~|\(.*\)/g, '').trim();
    let cleanParticiple = participle.replace(/~ing|~|\(.*\)/g, '').trim();

    // 【発音特別補正 1】 'be' (be - was/were - been)
    if (cleanPresent.toLowerCase() === 'be') {
      cleanPresent = 'be';
      cleanPast = 'was';
    }

    // 【発音特別補正 2】 'read' (原形: リード / 過去: レッド / 過去分詞: レッド)
    if (cleanPresent.toLowerCase() === 'read') {
      cleanPast = 'red';
      cleanParticiple = 'red';
    }

    // 【発音特別補正 3】 'lead' (原形: リード / 過去: レッド / 過去分詞: レッド)
    if (cleanPresent.toLowerCase() === 'lead') {
      cleanPresent = 'leed';
    }

    // 単語間にカンマ `, ` を挟み、早口・巻き込み発音を防止してクリアに朗読
    const combinedText = `${cleanPresent}, ${cleanPast}, ${cleanParticiple}.`;
    this.speak(combinedText, onComplete);
  },

  /**
   * 自動再生ON/OFFの切り替え
   */
  toggleAutoPlay() {
    this.autoPlay = !this.autoPlay;
    const btn = document.getElementById('auto-play-btn');
    if (btn) {
      btn.textContent = this.autoPlay ? '🔊 自動音声: ON' : '🔇 自動音声: OFF';
      btn.style.background = this.autoPlay ? 'var(--theme-btn-grad)' : 'rgba(255,255,255,0.1)';
    }
    return this.autoPlay;
  },

  /**
   * 音声速度設定 (0.7 = ゆっくり, 0.78 = 標準クリア, 0.95 = 早め)
   */
  setRate(rate) {
    this.speechRate = rate;
  }
};

// iOS Safari での getVoices 読み込み待機対策（ページ読み込み時点で先読みしておく）
if ('speechSynthesis' in window) {
  window.AudioEngine._loadVoices();
  window.speechSynthesis.addEventListener('voiceschanged', () => {
    window.AudioEngine._loadVoices();
  });
}
