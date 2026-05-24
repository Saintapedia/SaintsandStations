/* ================================================================
   SAINTS & STATIONS — Game Data
   ================================================================ */

const STATIONS = [
  // ── Station 1 ─────────────────────────────────────────────────
  {
    id: 1,
    title: 'Turning Back to God',
    location: 'The Starting Place',
    color: '#7B2D8B',
    colorLight: 'rgba(123,45,139,0.18)',
    scripture: '"Turn away from sin and follow God."',
    reference: 'Matthew 4:17',
    reflectivePrompt:
      'Is there something you\'ve been doing that you know isn\'t right? What would turning back to God look like for you today?',
    challenge: {
      type: 'matching',
      instruction: 'Match each saint to what they did. Tap a name on the left, then tap the right description to pair them.',
      pairs: [
        { left: 'St. John the Baptist',  right: 'Told people to turn back to God' },
        { left: 'St. Augustine',          right: 'Changed his life completely to follow God' },
        { left: 'St. Mary Magdalene',     right: 'Started a brand-new life after meeting Jesus' },
      ],
      correctOrder: [0, 1, 2], // right[0] matches left[0], etc.
    },
    prayer: {
      saint: 'Prayer of Returning',
      text: 'God, help me turn back to you. Forgive me and help me try again. Amen.',
    },
  },

  // ── Station 2 ─────────────────────────────────────────────────
  {
    id: 2,
    title: 'Being Humble',
    location: 'The Valley of Meekness',
    color: '#2D6A9F',
    colorLight: 'rgba(45,106,159,0.18)',
    scripture: '"The humble will be raised up."',
    reference: 'Luke 14:11',
    reflectivePrompt:
      'Can you think of a time someone was humble and it made things better? How can you be humble today?',
    challenge: {
      type: 'quiz',
      instruction: 'Answer these three questions about humility:',
      questions: [
        {
          question:
            'A student won first place in a contest. Instead of bragging, she quietly thanked God and her teacher. Which saint is most like her?',
          options: [
            'St. Thérèse of Lisieux',
            'St. George',
            'St. Christopher',
            'St. Valentine',
          ],
          correct: 0,
          feedback:
            'St. Thérèse of Lisieux did small things with great love — without showing off. She called her way "The Little Way"!',
        },
        {
          question: 'What does humility really mean?',
          options: [
            'Thinking you are bad at everything',
            'Never accepting a compliment',
            'Knowing your gifts come from God and not bragging',
            'Being shy and quiet all the time',
          ],
          correct: 2,
          feedback:
            'Humility means recognizing that our gifts come from God — not thinking too highly OR too lowly of ourselves!',
        },
        {
          question: 'Which saint is famous for serving the poorest of the poor with humble love?',
          options: [
            'St. Patrick',
            'St. Nicholas',
            'St. Anthony',
            'St. Teresa of Calcutta',
          ],
          correct: 3,
          feedback:
            'Mother Teresa (St. Teresa of Calcutta) saw Jesus in every poor person she served. That\'s humble love in action!',
        },
      ],
    },
    prayer: {
      saint: 'Prayer of Humility',
      text: 'Jesus, help me be kind and not show off. Teach me to serve others. Amen.',
    },
  },

  // ── Station 3 ─────────────────────────────────────────────────
  {
    id: 3,
    title: 'Believing When It\'s Hard',
    location: 'The Place of Trust',
    color: '#2E8B57',
    colorLight: 'rgba(46,139,87,0.18)',
    scripture: '"We live by faith, not by what we see."',
    reference: '2 Corinthians 5:7',
    reflectivePrompt:
      'When is it hardest to trust God? What helps you believe even when you can\'t see?',
    challenge: {
      type: 'matching',
      instruction: 'Match each symbol to its meaning. Tap a symbol on the left, then tap the right meaning to pair them.',
      pairs: [
        { left: '✝️  Cross',   right: 'Jesus\' love for us' },
        { left: '🕊️  Dove',   right: 'The Holy Spirit' },
        { left: '🪔  Lamp',    right: 'God guiding my path' },
      ],
      correctOrder: [0, 1, 2],
    },
    prayer: {
      saint: 'Prayer of Faith',
      text: 'Lord, help me trust you even when I\'m unsure. Give me courage to follow you. Amen.',
    },
  },

  // ── Station 4 ─────────────────────────────────────────────────
  {
    id: 4,
    title: 'Being Brave in Tough Times',
    location: 'The Road of Courage',
    color: '#C0392B',
    colorLight: 'rgba(192,57,43,0.18)',
    scripture: '"Be faithful even when it\'s hard."',
    reference: 'Revelation 2:10',
    reflectivePrompt:
      'When have you had to be brave? What helped you get through it?',
    challenge: {
      type: 'dilemma',
      instruction: 'What would you do? Tap the bravest, kindest response:',
      scenario:
        'Your friend is being teased at school and everyone else is laughing. You know it\'s wrong — but speaking up might make them tease you too. What do you do?',
      options: [
        {
          text: 'Walk away and pretend not to notice.',
          feedback:
            'It can feel safer to stay quiet — but our friends need us. Next time, even a small act of kindness can make a big difference.',
          isBest: false,
        },
        {
          text: 'Stand next to your friend and say "Stop — that\'s not cool."',
          feedback:
            '🌟 Brave choice! Standing up for someone even when it\'s hard is exactly what Jesus asks us to do. That\'s the courage of a saint!',
          isBest: true,
        },
        {
          text: 'Find a teacher or adult to help right away.',
          feedback:
            'Great thinking! Asking for help is also brave and smart — especially when the situation needs an adult. That\'s wisdom in action!',
          isBest: false,
        },
      ],
    },
    prayer: {
      saint: 'Prayer of Courage (St. Joan of Arc)',
      text: 'God, give me strength when things are scary. Help me keep going and be brave. Amen.',
    },
  },

  // ── Station 5 ─────────────────────────────────────────────────
  {
    id: 5,
    title: 'Helping Others',
    location: 'The Works of Mercy',
    color: '#E67E22',
    colorLight: 'rgba(230,126,34,0.18)',
    scripture: '"When you helped others, you helped me."',
    reference: 'Matthew 25:35',
    reflectivePrompt:
      'Who in your life might need help right now? What could you do for them?',
    challenge: {
      type: 'sorting',
      instruction: 'Tap any 3 acts of mercy to add them to your "Do It Now" list:',
      required: 3,
      acts: [
        { text: 'Bring food to someone who is hungry',      icon: '🍞' },
        { text: 'Visit someone who is lonely',              icon: '🤝' },
        { text: 'Give clothes to someone who needs them',   icon: '👕' },
        { text: 'Say a kind word to someone who is sad',    icon: '💬' },
        { text: 'Pray for someone who is sick',             icon: '🙏' },
        { text: 'Help clean up at home without being asked',icon: '🧹' },
      ],
    },
    prayer: {
      saint: 'Prayer of Service',
      text: 'Lord, show me who needs help and help me serve with my hands and heart. Amen.',
    },
  },

  // ── Station 6 ─────────────────────────────────────────────────
  {
    id: 6,
    title: 'Saying Sorry and Forgiving',
    location: 'The Fountain of Mercy',
    color: '#8E44AD',
    colorLight: 'rgba(142,68,173,0.18)',
    scripture: '"If we say we\'re sorry, God forgives us."',
    reference: '1 John 1:9',
    reflectivePrompt:
      'Is there someone you need to forgive, or someone you need to say sorry to?',
    challenge: {
      type: 'truefalse',
      instruction: 'True or False? Think carefully!',
      questions: [
        {
          statement:
            'Forgiving someone means you have to pretend they didn\'t hurt you.',
          correct: false,
          feedback:
            'False! Forgiving means choosing not to hold a grudge — but it\'s okay to acknowledge you were hurt. God helps us forgive without erasing our feelings.',
        },
        {
          statement: 'Saying sorry when you\'ve done wrong is a sign of strength.',
          correct: true,
          feedback:
            'True! It takes real courage to admit when we\'re wrong. That\'s what saints do. Asking for forgiveness is one of the bravest things a person can do.',
        },
        {
          statement:
            'God will only forgive us if we do enough good things first.',
          correct: false,
          feedback:
            'False! God forgives us because He loves us — not because we earned it. We just need to be truly sorry. That\'s what mercy means.',
        },
      ],
    },
    prayer: {
      saint: 'Prayer of Mercy (St. Faustina)',
      text: 'Merciful God, help me say sorry when I\'m wrong and forgive others like you forgive me. Amen.',
    },
  },

  // ── Station 7 ─────────────────────────────────────────────────
  {
    id: 7,
    title: 'Go Share God\'s Love',
    location: 'The Sending Forth',
    color: '#27AE60',
    colorLight: 'rgba(39,174,96,0.18)',
    scripture: '"As the Father sent me, I send you."',
    reference: 'John 20:21',
    reflectivePrompt:
      'How can you share God\'s love with someone this week? Even small acts matter!',
    challenge: {
      type: 'commitment',
      instruction: 'Choose one thing you\'ll do this week to share God\'s love — or write your own:',
      suggestions: [
        { text: 'Help a neighbor with something they need',          icon: '🏠' },
        { text: 'Pray for a friend who is going through something hard', icon: '🙏' },
        { text: 'Share a snack or lunch with someone',               icon: '🍎' },
        { text: 'Write a kind note to a family member',              icon: '✉️' },
        { text: 'Smile and say hello to someone who looks lonely',   icon: '😊' },
      ],
    },
    prayer: {
      saint: 'Sending Prayer (St. Francis of Assisi)',
      text: 'Send me, Lord, to love others with a happy heart. Help me show your love this week. Amen.',
    },
  },
];

/* ── Saint quotes for the completion card ─────────────────────── */
const SAINT_QUOTES = [
  {
    saint: 'St. Thérèse of Lisieux',
    quote:
      'Miss no single opportunity of making some small sacrifice — here by a smiling look, there by a kindly word.',
  },
  {
    saint: 'St. Francis of Assisi',
    quote:
      'Start by doing what\'s necessary; then do what\'s possible; and suddenly you are doing the impossible.',
  },
  {
    saint: 'St. Teresa of Calcutta',
    quote: 'Not all of us can do great things. But we can do small things with great love.',
  },
  {
    saint: 'St. Augustine',
    quote: 'Our heart is restless, until it rests in You.',
  },
  {
    saint: 'St. Joan of Arc',
    quote: 'I am not afraid. I was born to do this.',
  },
  {
    saint: 'St. Faustina',
    quote: 'Every act of mercy echoes through eternity.',
  },
];
