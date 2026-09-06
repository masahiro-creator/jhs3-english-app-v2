// 弱点克服モード コンポーネント
window.WeakSectionComponent = {
  currentIndex: 0,

  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const words = window.JHS_WORDS || [];
    const verbs = window.IRREGULAR_VERBS || [];
    const weakList = window.SRSEngine.getWeakItems(words, verbs);

    if (weakList.length === 0) {
      container.innerHTML = `
        <div class="glass-card" style="text-align: center; padding: 40px 20px;">
          <div style="font-size: 48px; margin-bottom: 12px;">🎉</div>
          <h2 style="font-size: 24px; font-weight: 800; color: #ffffff; margin-bottom: 8px;">弱点アイテムはゼロです！</h2>
          <p style="font-size: 15px; color: var(--theme-text-sub);">すべての問題で高い正答率を維持しています。素晴らしい！</p>
        </div>
      `;
      return;
    }

    // インデックスの境界値チェック
    if (this.currentIndex >= weakList.length) {
      this.currentIndex = 0;
    }

    const current = weakList[this.currentIndex];
    const isVerb = current.itemType === 'verb';
    const state = window.StorageEngine.getItem(current.id);

    container.innerHTML = `
      <div class="glass-card" style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h2 style="font-size: 20px; font-weight: 800; color: #ef4444;">🎯 弱点克服ノート (全${weakList.length}件)</h2>
          <span style="font-size: 14px; font-weight: 700; color: var(--theme-text-sub);">${this.currentIndex + 1} / ${weakList.length}</span>
        </div>
      </div>

      <div id="weak-card-box" class="glass-card" style="text-align: center; max-width: 600px; margin: 0 auto 20px auto; transition: all 0.5s ease;">
        <div style="font-size: 13px; color: #ef4444; font-weight: 700; margin-bottom: 8px;">
          過去誤答回数: ${state.wrong}回 (正答率: ${Math.round((state.correct / state.total) * 100)}%)
        </div>
        <h3 style="font-size: 36px; font-weight: 800; margin-bottom: 12px; color: var(--theme-primary);">
          ${isVerb ? current.present : current.word}
        </h3>
        <p style="font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 16px;">
          ${current.meaning}
        </p>
        ${isVerb ? `
          <div class="card-forms" style="justify-content: center; width: max-content; margin: 0 auto 16px auto;">
            ${current.present} ➔ ${current.past} ➔ ${current.participle}
          </div>
        ` : ''}
        <button class="audio-btn" style="margin: 0 auto;" onclick="window.AudioEngine.${isVerb ? 'speakVerbForms' : 'speak'}('${isVerb ? current.present : current.word}', '${isVerb ? current.past : ''}', '${isVerb ? current.participle : ''}')">🔊</button>
      </div>

      <div style="display: flex; gap: 14px; justify-content: center;">
        <button class="option-btn" style="min-width: 150px; background: #10b981;" onclick="window.WeakSectionComponent.markMastered('${current.id}', '${containerId}')">
          ✅ 完璧に覚えた！
        </button>
        <button class="option-btn" style="min-width: 150px; background: rgba(255,255,255,0.1);" onclick="window.WeakSectionComponent.next('${containerId}', ${weakList.length})">
          まだ不安（次へ ▶）
        </button>
      </div>
    `;
  },

  next(containerId, total) {
    const words = window.JHS_WORDS || [];
    const verbs = window.IRREGULAR_VERBS || [];
    const weakList = window.SRSEngine.getWeakItems(words, verbs);
    const current = weakList[this.currentIndex];

    if (current) {
      if (current.itemType === 'verb') {
        window.AudioEngine.speakVerbForms(current.present, current.past, current.participle);
      } else {
        window.AudioEngine.speak(current.word);
      }
    }

    this.currentIndex = (this.currentIndex + 1) % total;
    setTimeout(() => {
      this.render(containerId);
    }, 450);
  },

  markMastered(id, containerId) {
    const words = window.JHS_WORDS || [];
    const verbs = window.IRREGULAR_VERBS || [];
    const weakList = window.SRSEngine.getWeakItems(words, verbs);
    const current = weakList[this.currentIndex];

    if (current) {
      if (current.itemType === 'verb') {
        window.AudioEngine.speakVerbForms(current.present, current.past, current.participle);
      } else {
        window.AudioEngine.speak(current.word);
      }
    }

    // カード消滅アニメーション
    const cardBox = document.getElementById('weak-card-box');
    if (cardBox) {
      cardBox.classList.add('fade-out-scale');
    }

    window.CheeringEngine.triggerConfetti();
    window.CheeringEngine.showCustomMessage('ニガテ克服おめでとう！弱点ノートから卒業したよ！🔥');

    // 弱点ステータスを確実に解除（誤答数を0にして完全卒業扱いにする）
    const appData = window.StorageEngine.getData();
    if (appData.items[id]) {
      appData.items[id].wrong = 0;       // 誤答履歴をクリア
      appData.items[id].level = Math.max(appData.items[id].level || 0, 4); // マスター殿堂入りレベルに更新
      window.StorageEngine.saveData(appData);
    } else {
      window.StorageEngine.recordResult(id, true);
    }

    // アニメーション完了後、件数が減った新リストで次のカードへ遷移！
    setTimeout(() => {
      const remainingWeak = window.SRSEngine.getWeakItems(words, verbs);
      if (remainingWeak.length === 0) {
        this.currentIndex = 0;
      } else {
        this.currentIndex = this.currentIndex % remainingWeak.length;
      }
      this.render(containerId);
    }, 700);
  }
};
