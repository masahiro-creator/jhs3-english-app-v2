// 英単語・熟語セクション コンポーネント
window.WordSectionComponent = {
  selectedGrade: 'ALL',
  currentIndex: 0,
  isFlipped: false,
  mode: 'cards', // 'cards' | 'quiz'
  words: [],
  quizQueue: [],

  init(containerId) {
    this.words = window.JHS_WORDS || [];
    this.render(containerId);
  },

  setGrade(grade, containerId) {
    this.selectedGrade = grade;
    this.currentIndex = 0;
    this.isFlipped = false;
    this.shuffleQuizQueue();
    this.render(containerId);
  },

  setMode(mode, containerId) {
    this.mode = mode;
    this.currentIndex = 0;
    this.isFlipped = false;
    if (mode === 'quiz') {
      this.shuffleQuizQueue();
    }
    this.render(containerId);
  },

  getFilteredWords() {
    if (this.selectedGrade === 'ALL') return this.words;
    const g = parseInt(this.selectedGrade, 10);
    return this.words.filter(w => w.grade === g);
  },

  shuffleQuizQueue() {
    const filtered = this.getFilteredWords();
    this.quizQueue = [...filtered].sort(() => Math.random() - 0.5);
  },

  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const filtered = this.getFilteredWords();
    const currentList = (this.mode === 'quiz') ? (this.quizQueue.length ? this.quizQueue : filtered) : filtered;
    const current = currentList[this.currentIndex] || currentList[0];

    if (!current) {
      container.innerHTML = '<div class="glass-card">単語が見つかりません。</div>';
      return;
    }

    container.innerHTML = `
      <div style="display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap;">
        <button class="option-btn ${this.mode === 'cards' ? 'correct' : ''}" style="padding: 10px 16px; min-height: 44px; font-size: 14px;" onclick="window.WordSectionComponent.setMode('cards', '${containerId}')">🃏 単語カード</button>
        <button class="option-btn ${this.mode === 'quiz' ? 'correct' : ''}" style="padding: 10px 16px; min-height: 44px; font-size: 14px;" onclick="window.WordSectionComponent.setMode('quiz', '${containerId}')">⚡ 4択スピードテスト (ランダム)</button>
      </div>

      <div style="display: flex; gap: 8px; margin-bottom: 20px; overflow-x: auto; padding-bottom: 4px;">
        ${[
          { id: 'ALL', label: '全単語' },
          { id: '1', label: '中1基礎' },
          { id: '2', label: '中2標準' },
          { id: '3', label: '中3・入試' },
          { id: '4', label: '最重要熟語' }
        ].map(t => `
          <button class="option-btn ${this.selectedGrade === t.id ? 'active' : ''}" style="padding: 8px 14px; min-height: 38px; font-size: 13px; background: ${this.selectedGrade === t.id ? 'var(--theme-btn-grad)' : 'rgba(255,255,255,0.05)'};" onclick="window.WordSectionComponent.setGrade('${t.id}', '${containerId}')">
            ${t.label}
          </button>
        `).join('')}
      </div>

      ${this.mode === 'cards' ? this.renderCardView(current, currentList.length, containerId) : this.renderQuizView(current, this.words, containerId)}
    `;

    if (this.mode === 'cards' && window.AudioEngine.autoPlay && current && !this.isFlipped) {
      setTimeout(() => {
        window.AudioEngine.speak(current.word);
      }, 150);
    }
  },

  renderCardView(word, totalCount, containerId) {
    return `
      <div class="flashcard-wrapper" onclick="window.WordSectionComponent.toggleFlip()">
        <div class="flashcard ${this.isFlipped ? 'flipped' : ''}" id="word-flashcard">
          <!-- 表面: 英語 & カテゴリー -->
          <div class="card-face">
            <div class="card-phonetic">【${word.category}】</div>
            <div class="card-word">${word.word}</div>
            <button class="audio-btn" onclick="event.stopPropagation(); window.AudioEngine.speak('${word.word}')" title="発音再生">🔊</button>
            <div style="font-size: 12px; color: var(--theme-text-sub); margin-top: 16px;">タップで日本語訳を表示</div>
          </div>
          <!-- 裏面: 意味 & 例文 -->
          <div class="card-face card-back">
            <div class="card-meaning">${word.meaning}</div>
            <div class="card-example">"${word.example}"<br>(${word.exampleMeaning})</div>
            <button class="audio-btn" onclick="event.stopPropagation(); window.AudioEngine.speak('${word.example}')" title="例文再生">🔊</button>
          </div>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; max-width: 540px; margin: 0 auto;">
        <button class="option-btn" style="min-width: 120px;" onclick="window.WordSectionComponent.prev('${containerId}')">◀ 前へ</button>
        <span style="font-weight: 700; color: var(--theme-text-sub);">${this.currentIndex + 1} / ${totalCount}</span>
        <button class="option-btn" style="min-width: 120px;" onclick="window.WordSectionComponent.next('${containerId}')">次へ ▶</button>
      </div>
    `;
  },

  renderQuizView(word, allList, containerId) {
    const options = [word];
    while (options.length < 4) {
      const rand = allList[Math.floor(Math.random() * allList.length)];
      if (!options.find(o => o.id === rand.id)) options.push(rand);
    }
    options.sort(() => Math.random() - 0.5);

    return `
      <div id="word-quiz-box" class="glass-card" style="text-align: center; max-width: 600px; margin: 0 auto 20px auto;">
        <div style="font-size: 14px; color: var(--theme-primary); font-weight: 700; margin-bottom: 8px;">英単語・熟語 4択クイズ</div>
        <h3 style="font-size: 36px; font-weight: 800; margin-bottom: 12px; color: var(--theme-primary);">${word.word}</h3>
        <p style="font-size: 16px; color: var(--theme-text-sub);">正しい日本語の意味を選んでください：</p>
        <button class="audio-btn" style="margin: 12px auto;" onclick="window.AudioEngine.speak('${word.word}')">🔊</button>
      </div>

      <div class="quiz-options">
        ${options.map(opt => `
          <button class="option-btn" data-id="${opt.id}" onclick="window.WordSectionComponent.checkAnswer('${opt.id}', '${word.id}', '${containerId}')">
            ${opt.meaning}
          </button>
        `).join('')}
      </div>
    `;
  },

  toggleFlip() {
    this.isFlipped = !this.isFlipped;
    const card = document.getElementById('word-flashcard');
    if (card) card.classList.toggle('flipped', this.isFlipped);

    const filtered = this.getFilteredWords();
    const current = filtered[this.currentIndex];
    if (window.AudioEngine.autoPlay && current) {
      if (this.isFlipped) {
        window.AudioEngine.speak(current.example);
      } else {
        window.AudioEngine.speak(current.word);
      }
    }
  },

  next(containerId) {
    const currentList = (this.mode === 'quiz') ? this.quizQueue : this.getFilteredWords();
    this.currentIndex = (this.currentIndex + 1) % currentList.length;
    this.isFlipped = false;
    this.render(containerId);
  },

  prev(containerId) {
    const currentList = (this.mode === 'quiz') ? this.quizQueue : this.getFilteredWords();
    this.currentIndex = (this.currentIndex - 1 + currentList.length) % currentList.length;
    this.isFlipped = false;
    this.render(containerId);
  },

  checkAnswer(selectedId, correctId, containerId) {
    const isCorrect = selectedId === correctId;
    window.StorageEngine.recordResult(correctId, isCorrect);

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

    const targetWord = this.words.find(w => w.id === correctId);

    if (isCorrect) {
      window.CheeringEngine.triggerConfetti();
      window.CheeringEngine.showCustomMessage('GREAT! 単語の意味をバッチリ記憶できてるよ！🌟');
      if (targetWord) window.AudioEngine.speak(targetWord.word);
    } else {
      const quizBox = document.getElementById('word-quiz-box');
      if (quizBox) {
        quizBox.classList.add('shake');
        setTimeout(() => quizBox.classList.remove('shake'), 400);
      }

      window.CheeringEngine.showCustomMessage(`正解は「${targetWord ? targetWord.meaning : ''}」でした！しっかり復習しよう！💪`);
      if (targetWord) window.AudioEngine.speak(targetWord.word);
    }

    setTimeout(() => {
      this.next(containerId);
    }, isCorrect ? 1300 : 2300);
  }
};
