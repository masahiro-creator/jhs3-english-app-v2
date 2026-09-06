// 中学3年間の英単語・熟語データベース（レベル別・カテゴリー別）
window.JHS_WORDS = [
  // ==========================================
  // 【STAGE 1: 中1レベル (基礎必須単語)】
  // ==========================================
  { id: 'w1_01', word: 'friend', meaning: '友達', grade: 1, category: '人物・学校', example: 'Ken is my best friend.', exampleMeaning: 'ケンは私の親友です。' },
  { id: 'w1_02', word: 'family', meaning: '家族', grade: 1, category: '人物・学校', example: 'I love my family.', exampleMeaning: '私は家族を愛しています。' },
  { id: 'w1_03', word: 'student', meaning: '生徒・学生', grade: 1, category: '人物・学校', example: 'She is a high school student.', exampleMeaning: '彼女は高校生です。' },
  { id: 'w1_04', word: 'teacher', meaning: '先生・教師', grade: 1, category: '人物・学校', example: 'Mr. Brown is an English teacher.', exampleMeaning: 'ブラウン先生は英語の先生です。' },
  { id: 'w1_05', word: 'subject', meaning: '教科・科目', grade: 1, category: '人物・学校', example: 'Math is my favorite subject.', exampleMeaning: '数学は私の大好きな教科です。' },
  { id: 'w1_06', word: 'library', meaning: '図書館', grade: 1, category: '場所・施設', example: 'Let’s study in the library.', exampleMeaning: '図書館で勉強しましょう。' },
  { id: 'w1_07', word: 'station', meaning: '駅', grade: 1, category: '場所・施設', example: 'The station is near my house.', exampleMeaning: '駅は私の家の近くにあります。' },
  { id: 'w1_08', word: 'season', meaning: '季節', grade: 1, category: '自然・時間', example: 'Spring is my favorite season.', exampleMeaning: '春は私の大好きな季節です。' },
  { id: 'w1_09', word: 'beautiful', meaning: '美しい・きれいな', grade: 1, category: '形容詞', example: 'Look at the beautiful flowers.', exampleMeaning: '美しい花を見て。' },
  { id: 'w1_10', word: 'important', meaning: '重要な・大切な', grade: 1, category: '形容詞', example: 'Health is very important.', exampleMeaning: '健康はとても大切です。' },
  { id: 'w1_11', word: 'different', meaning: '異なる・違った', grade: 1, category: '形容詞', example: 'We have different opinions.', exampleMeaning: '私達は違った意見を持っています。' },
  { id: 'w1_12', word: 'difficult', meaning: '難しい', grade: 1, category: '形容詞', example: 'English is not so difficult.', exampleMeaning: '英語はそれほど難しくありません。' },
  { id: 'w1_13', word: 'practice', meaning: '練習する', grade: 1, category: '動詞', example: 'I practice soccer every day.', exampleMeaning: '私は毎日サッカーを練習します。' },
  { id: 'w1_14', word: 'remember', meaning: '覚えている・思い出す', grade: 1, category: '動詞', example: 'I remember your name.', exampleMeaning: 'あなたの名前を覚えています。' },
  { id: 'w1_15', word: 'enjoy', meaning: '〜を楽しむ', grade: 1, category: '動詞', example: 'Enjoy your summer vacation!', exampleMeaning: '夏休みを楽しんでね！' },

  // ==========================================
  // 【STAGE 2: 中2レベル (標準単語・表現)】
  // ==========================================
  { id: 'w2_01', word: 'weather', meaning: '天気・気候', grade: 2, category: '自然・日常生活', example: 'How is the weather today?', exampleMeaning: '今日の天気はどうですか？' },
  { id: 'w2_02', word: 'temperature', meaning: '気温・温度', grade: 2, category: '自然・日常生活', example: 'The temperature is rising.', exampleMeaning: '気温が上がっています。' },
  { id: 'w2_03', word: 'experience', meaning: '経験・体験', grade: 2, category: '抽象名詞', example: 'It was a great experience.', exampleMeaning: 'それは素晴らしい体験でした。' },
  { id: 'w2_04', word: 'schedule', meaning: '予定・スケジュール', grade: 2, category: '日常生活', example: 'Check your busy schedule.', exampleMeaning: '忙しいスケジュールを確認してください。' },
  { id: 'w2_05', word: 'excited', meaning: '興奮した・わくわくした', grade: 2, category: '感情・形容詞', example: 'I am excited about the trip.', exampleMeaning: '私は旅行にワクワクしています。' },
  { id: 'w2_06', word: 'surprised', meaning: '驚いた', grade: 2, category: '感情・形容詞', example: 'We were surprised at the news.', exampleMeaning: '私達はそのニュースに驚きました。' },
  { id: 'w2_07', word: 'popular', meaning: '人気のある', grade: 2, category: '形容詞', example: 'This game is popular among teenagers.', exampleMeaning: 'このゲームは10代に人気があります。' },
  { id: 'w2_08', word: 'convenient', meaning: '便利な', grade: 2, category: '形容詞', example: 'Smartphones are very convenient.', exampleMeaning: 'スマートフォンはとても便利です。' },
  { id: 'w2_09', word: 'because', meaning: '〜だから（理由）', grade: 2, category: '接続詞', example: 'I was absent because I was sick.', exampleMeaning: '風邪を引いていたので欠席しました。' },
  { id: 'w2_10', word: 'although', meaning: '〜だけれども', grade: 2, category: '接続詞', example: 'Although it rained, we enjoyed it.', exampleMeaning: '雨が降っていたけれど楽しめました。' },
  { id: 'w2_11', word: 'already', meaning: 'すでに・もう', grade: 2, category: '副詞', example: 'I have already finished dinner.', exampleMeaning: '私はすでに夕食を食べ終えました。' },
  { id: 'w2_12', word: 'almost', meaning: 'ほとんど・もう少しで', grade: 2, category: '副詞', example: 'It is almost time to go.', exampleMeaning: 'そろそろ出かける時間です。' },
  { id: 'w2_13', word: 'travel', meaning: '旅行する', grade: 2, category: '動詞', example: 'I want to travel around the world.', exampleMeaning: '世界中を旅行したいです。' },
  { id: 'w2_14', word: 'explain', meaning: '説明する', grade: 2, category: '動詞', example: 'Can you explain the rule?', exampleMeaning: 'ルールを説明してくれますか？' },
  { id: 'w2_15', word: 'suggest', meaning: '提案する', grade: 2, category: '動詞', example: 'She suggested a good idea.', exampleMeaning: '彼女は良いアイディアを提案した。' },

  // ==========================================
  // 【STAGE 3: 中3・高校入試頻出レベル】
  // ==========================================
  { id: 'w3_01', word: 'environment', meaning: '環境', grade: 3, category: '社会・環境', example: 'We must protect the environment.', exampleMeaning: '私たちは環境を守らなければなりません。' },
  { id: 'w3_02', word: 'society', meaning: '社会', grade: 3, category: '社会・環境', example: 'Volunteers contribute to society.', exampleMeaning: 'ボランティアは社会に貢献します。' },
  { id: 'w3_03', word: 'technology', meaning: '技術・テクノロジー', grade: 3, category: '科学・技術', example: 'Modern technology improves our lives.', exampleMeaning: '現代技術は私たちの生活を向上させます。' },
  { id: 'w3_04', word: 'opportunity', meaning: '機会・チャンス', grade: 3, category: '抽象名詞', example: 'Don’t miss this opportunity.', exampleMeaning: 'このチャンスを逃さないで。' },
  { id: 'w3_05', word: 'advantage', meaning: '利点・強み', grade: 3, category: '抽象名詞', example: 'Reading books has many advantages.', exampleMeaning: '読書にはたくさんのメリットがあります。' },
  { id: 'w3_06', word: 'international', meaning: '国際的な', grade: 3, category: '形容詞', example: 'English is an international language.', exampleMeaning: '英語は国際共通語です。' },
  { id: 'w3_07', word: 'necessary', meaning: '必要な・欠かせない', grade: 3, category: '形容詞', example: 'Water is necessary for life.', exampleMeaning: '水は生命にとって必要不可欠です。' },
  { id: 'w3_08', word: 'traditional', meaning: '伝統的な', grade: 3, category: '形容詞', example: 'Kyoto is famous for traditional culture.', exampleMeaning: '京都は伝統文化で有名です。' },
  { id: 'w3_09', word: 'increase', meaning: '増加する・増やす', grade: 3, category: '動詞', example: 'The population continues to increase.', exampleMeaning: '人口は増加し続けています。' },
  { id: 'w3_10', word: 'decrease', meaning: '減少する・減らす', grade: 3, category: '動詞', example: 'The cost decreased rapidly.', exampleMeaning: '費用は急速に減少した。' },
  { id: 'w3_11', word: 'encourage', meaning: '励ます・勇気づける', grade: 3, category: '動詞', example: 'My friends encouraged me.', exampleMeaning: '友達が私を励ましてくれた。' },
  { id: 'w3_12', word: 'succeed', meaning: '成功する', grade: 3, category: '動詞', example: 'If you work hard, you will succeed.', exampleMeaning: '一生懸命頑張れば成功します。' },
  { id: 'w3_13', word: 'influence', meaning: '影響・影響を与える', grade: 3, category: '抽象名詞・動詞', example: 'Music has a great influence on youth.', exampleMeaning: '音楽は若者に大きな影響を与えます。' },
  { id: 'w3_14', word: 'participate', meaning: '参加する (participate in)', grade: 3, category: '動詞', example: 'Many students participated in the event.', exampleMeaning: '多くの生徒がイベントに参加した。' },
  { id: 'w3_15', word: 'relationship', meaning: '関係・人間関係', grade: 3, category: '抽象名詞', example: 'Good communication builds trust in a relationship.', exampleMeaning: '良好な対話は人間関係の信頼を築く。' },

  // ==========================================
  // 【入試最重要熟語・イディオム (Idioms)】
  // ==========================================
  { id: 'id_01', word: 'look forward to ~ing', meaning: '〜を楽しみに待つ', grade: 4, category: '最重要熟語', example: 'I am looking forward to seeing you.', exampleMeaning: 'あなたにお会いできるのを楽しみにしております。' },
  { id: 'id_02', word: 'be able to', meaning: '〜することができる', grade: 4, category: '最重要熟語', example: 'He will be able to speak English soon.', exampleMeaning: '彼はもうすぐ英語を話せるようになるでしょう。' },
  { id: 'id_03', word: 'take care of', meaning: '〜の世話をする', grade: 4, category: '最重要熟語', example: 'She takes care of her younger brother.', exampleMeaning: '彼女は弟の世話をします。' },
  { id: 'id_04', word: 'be good at', meaning: '〜が得意である', grade: 4, category: '最重要熟語', example: 'Ken is good at playing basketball.', exampleMeaning: 'ケンはバスケットボールが得意です。' },
  { id: 'id_05', word: 'spend A -ing', meaning: 'A（時間・お金）を〜して過ごす', grade: 4, category: '最重要熟語', example: 'I spent two hours reading a book.', exampleMeaning: '私は読書に2時間を費やしました。' },
  { id: 'id_06', word: 'as soon as', meaning: '〜するとすぐに', grade: 4, category: '最重要熟語', example: 'Call me as soon as you arrive.', exampleMeaning: '到着したらすぐ電話してください。' },
  { id: 'id_07', word: 'remind A of B', meaning: 'AにBを思い出させる', grade: 4, category: '最重要熟語', example: 'This song reminds me of my hometown.', exampleMeaning: 'この歌は私に故郷を思い起こさせます。' },
  { id: 'id_08', word: 'in order to', meaning: '〜するために', grade: 4, category: '最重要熟語', example: 'He got up early in order to catch the train.', exampleMeaning: '彼は電車に乗るために早起きした。' },
  { id: 'id_09', word: 'depend on', meaning: '〜に依存する・〜次第である', grade: 4, category: '最重要熟語', example: 'Our plan depends on the weather.', exampleMeaning: '私たちの計画は天気次第です。' },
  { id: 'id_10', word: 'be proud of', meaning: '〜を誇りに思っている', grade: 4, category: '最重要熟語', example: 'We are proud of your achievement.', exampleMeaning: '私たちはあなたの成果を誇りに思っています。' }
];
