// Web Speech API 発音再生モジュール (iPadOS/Safari/Chrome 完全対応)
window.AudioEngine = {
  speechRate: 0.9, // 聞き取りやすいクリアな速度
  autoPlay: true,   // 単語切り替え時の自動発音再生 (デフォルト: ON)

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

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    utterance.rate = customRate || this.speechRate;
    utterance.pitch = 1.0;
// 清晰な女性の英語音声を優先する設定
    const voices = window.speechSynthesis.getVoices();
    
    // 女性の声のみを厳選したリスト
    const preferredVoices = [
      'Google US English', // 1番目: PC(Chrome)の女性
      'Microsoft Zira',    // 2番目: PC(Windows)の女性
      'Samantha',          // 3番目: iOSの標準女性
      'Victoria',          // 4番目: iOSの別バージョンの女性
      'Karen'              // 5番目: iOSのオーストラリア女性
    ];

    let englishVoice = null;
    for (const name of preferredVoices) {
      englishVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes(name));
      if (englishVoice) break;
    }

    // リストにない場合は、とにかく「アメリカ英語」の最初に見つかった声を選ぶ
    if (!englishVoice) {
      englishVoice = voices.find(v => v.lang === 'en-US');
    }

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
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

// iOS Safari での getVoices 読み込み待機対策
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}
