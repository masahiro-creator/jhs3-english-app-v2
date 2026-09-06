// アプリ統合コントローラー
window.App = {
  currentTab: 'dashboard',
  srsSessionQueue: [],
  srsCurrentIndex: 0,

  init() {
    console.log('JHS 3rd Grade English Exam App Initializing...');

    // 9色推しカラーテーマピッカー初期化
    window.ThemeManager.init('theme-picker-container');

    // 応援メッセージ初期表示
    const initialMsg = window.CheeringEngine.getRandomMessage();
    window.CheeringEngine.showCustomMessage(initialMsg);

    // 各コンポーネント初期化
    window.VerbSectionComponent.init('tab-verbs');
    window.WordSectionComponent.init('tab-words');

    // 初期タブ表示
    this.switchTab('dashboard');
  },

  switchTab(tabId) {
    this.currentTab = tabId;

    // ナビゲーションタブの更新
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-tab') === tabId);
    });

    // タブコンテンツの表示切替
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.toggle('active', content.id === `tab-${tabId}`);
    });

    // タブごとのレンダリング
    if (tabId === 'dashboard') {
      window.DashboardComponent.render('tab-dashboard');
    } else if (tabId === 'weak') {
      window.WeakSectionComponent.render('tab-weak');
    } else if (tabId === 'verbs') {
      window.VerbSectionComponent.render('tab-verbs');
    } else if (tabId === 'words') {
      window.WordSectionComponent.render('tab-words');
    }
  },

  /**
   * エビングハウス忘却曲線 復習セッションの開始
   */
  startSRSSession() {
    const words = window.JHS_WORDS || [];
    const verbs = window.IRREGULAR_VERBS || [];
    const dueObj = window.SRSEngine.getDueItems(words, verbs);

    const queue = [
      ...dueObj.dueWords.map(w => ({ ...w, itemType: 'word' })),
      ...dueObj.dueVerbs.map(v => ({ ...v, itemType: 'verb' }))
    ];

    if (queue.length === 0) {
      alert('今日の忘却曲線復習はすべて完了しています！素晴らしい集中力です！🎉');
      return;
    }

    // キューをシャッフル
    this.srsSessionQueue = queue.sort(() => Math.random() - 0.5);
    this.srsCurrentIndex = 0;
    this.switchTab('srs');
    this.renderSRSStep();
  },

  renderSRSStep() {
    const container = document.getElementById('tab-srs');
    if (!container) return;

    if (this.srsCurrentIndex >= this.srsSessionQueue.length) {
      // セッション終了
      window.CheeringEngine.triggerConfetti();
      container.innerHTML = `
        <div class="glass-card" style="text-align: center; padding: 40px 20px;">
          <div style="font-size: 56px; margin-bottom: 12px;">🎉</div>
          <h2 style="font-size: 28px; font-weight: 800; color: #ffffff; margin-bottom: 12px;">今日の復習セッション達成！</h2>
          <p style="font-size: 16px; color: var(--theme-text-sub); margin-bottom: 24px;">
            全 ${this.srsSessionQueue.length} 問の記憶更新が完了しました！エビングハウス忘却曲線を完全クリア！
          </p>
          <button class="option-btn" style="background: var(--theme-btn-grad); max-width: 260px; margin: 0 auto;" onclick="window.App.switchTab('dashboard')">
            🏠 ダッシュボードに戻る
          </button>
        </div>
      `;
      return;
    }

    const current = this.srsSessionQueue[this.srsCurrentIndex];
    const isVerb = current.itemType === 'verb';

    // 選択肢作成
    const allList = isVerb ? window.IRREGULAR_VERBS : window.JHS_WORDS;
    const options = [current];
    while (options.length < 4) {
      const rand = allList[Math.floor(Math.random() * allList.length)];
      if (!options.find(o => o.id === rand.id)) options.push(rand);
    }
    options.sort(() => Math.random() - 0.5);

    container.innerHTML = `
      <div id="srs-card-box" class="glass-card" style="margin-bottom: 16px; text-align: center;">
        <div style="font-size: 13px; color: var(--theme-primary); font-weight: 700;">
          エビングハウス忘却曲線 復習 (${this.srsCurrentIndex + 1} / ${this.srsSessionQueue.length})
        </div>
        <h3 style="font-size: 38px; font-weight: 800; margin: 12px 0; color: var(--theme-primary);">
          ${isVerb ? current.present : current.word}
        </h3>
        <button class="audio-btn" style="margin: 0 auto 12px auto;" onclick="window.AudioEngine.${isVerb ? 'speakVerbForms' : 'speak'}('${isVerb ? current.present : current.word}', '${isVerb ? current.past : ''}', '${isVerb ? current.participle : ''}')">🔊</button>
      </div>

      <div class="quiz-options">
        ${options.map(opt => `
          <button class="option-btn" data-id="${opt.id}" onclick="window.App.handleSRSAnswer('${opt.id}', '${current.id}')">
            ${isVerb ? `${opt.past} - ${opt.participle} (${opt.meaning})` : opt.meaning}
          </button>
        `).join('')}
      </div>
    `;
  },

  handleSRSAnswer(selectedId, correctId) {
    const isCorrect = selectedId === correctId;
    window.StorageEngine.recordResult(correctId, isCorrect);

    const currentItem = this.srsSessionQueue[this.srsCurrentIndex];
    const isVerb = currentItem.itemType === 'verb';

    // 選択肢のボタン色制御
    const optionBtns = document.querySelectorAll('.quiz-options .option-btn');
    optionBtns.forEach(btn => {
      btn.style.pointerEvents = 'none';
      const btnId = btn.getAttribute('data-id');
      if (btnId === correctId) {
        btn.classList.add('correct-highlight');
        btn.innerHTML = `✅ ${btn.innerHTML}`;
      } else if (btnId === selectedId && !isCorrect) {
        btn.classList.add('wrong-highlight');
        btn.innerHTML = `❌ ${btn.innerHTML}`;
      }
    });

    if (isCorrect) {
      window.CheeringEngine.triggerConfetti();
      window.CheeringEngine.showCustomMessage('正解！記憶レベルがレベルアップしました！🔥');
      if (isVerb) {
        window.AudioEngine.speakVerbForms(currentItem.present, currentItem.past, currentItem.participle);
      } else {
        window.AudioEngine.speak(currentItem.word);
      }
    } else {
      const srsBox = document.getElementById('srs-card-box');
      if (srsBox) {
        srsBox.classList.add('shake');
        setTimeout(() => srsBox.classList.remove('shake'), 400);
      }

      window.CheeringEngine.showCustomMessage(`正解は「${isVerb ? currentItem.past + ' - ' + currentItem.participle : currentItem.meaning}」でした！明日再チャレンジ！💪`);
      if (isVerb) {
        window.AudioEngine.speakVerbForms(currentItem.present, currentItem.past, currentItem.participle);
      } else {
        window.AudioEngine.speak(currentItem.word);
      }
    }

    setTimeout(() => {
      this.srsCurrentIndex++;
      this.renderSRSStep();
    }, isCorrect ? 1300 : 2300);
  }
};

// DOMロード完了時の初期化
document.addEventListener('DOMContentLoaded', () => {
  window.App.init();
});
