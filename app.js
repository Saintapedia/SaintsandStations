/* ================================================================
   SAINTS & STATIONS — Game Logic
   ================================================================ */

/* ── State ──────────────────────────────────────────────────────── */
const S = {
  screen: 'welcome',       // welcome | station-info | challenge | prayer | completion
  stationIdx: 0,           // 0-based index into STATIONS
  completed: [],           // which station indices are done
  cd: null,                // challenge data object (varies by type)
  challengeDone: false,
  commitment: null,        // string chosen in Station 7
  quote: null,             // random SAINT_QUOTES entry for completion card
};

/* ── Boot ───────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
  render();
});

/* ── Core render ────────────────────────────────────────────────── */
function render() {
  const app = document.getElementById('app');
  app.style.opacity = '0';
  setTimeout(() => {
    window.scrollTo(0, 0);
    switch (S.screen) {
      case 'welcome':      app.innerHTML = renderWelcome();      break;
      case 'station-info': app.innerHTML = renderStationInfo();  break;
      case 'challenge':    app.innerHTML = renderChallenge();    break;
      case 'prayer':       app.innerHTML = renderPrayer();       break;
      case 'completion':   app.innerHTML = renderCompletion();   break;
    }
    app.style.opacity = '1';
  }, 180);
}

function go(screen) { S.screen = screen; render(); }

/* ================================================================
   WELCOME SCREEN
   ================================================================ */
function renderWelcome() {
  const pills = STATIONS.map(st => `<span class="station-pill">${st.id}. ${st.title}</span>`).join('');
  return `
<div class="screen welcome">
  <div class="rainbow-bar no-print"></div>
  <span class="welcome-icon">✝</span>
  <h1>Seven Stations of Virtue</h1>
  <p class="welcome-tagline">A 7-Stop Devotional Journey</p>
  <div class="divider"></div>
  <p class="welcome-desc">
    Walk through seven stations of virtue, mercy, and courage.
    At each stop you'll hear a saint's wisdom, reflect, and tackle a short challenge —
    then unlock a prayer to carry with you.
  </p>
  <div class="station-pills">${pills}</div>
  <button class="btn btn-primary" onclick="startJourney()">✦ Begin the Journey</button>
  <p class="mt-4" style="font-size:.78rem;color:var(--text3);">~10–15 minutes · Tweens edition</p>
  <a class="saintapedia-link mt-6" href="https://saintapedia.org/" target="_blank" rel="noopener">
    A <strong>Saintapedia</strong> Project
  </a>
</div>`;
}

function startJourney() {
  S.stationIdx = 0;
  S.completed = [];
  S.commitment = null;
  S.cd = null;
  S.challengeDone = false;
  go('station-info');
}

/* ================================================================
   STATION INFO SCREEN
   ================================================================ */
function renderStationInfo() {
  const st = STATIONS[S.stationIdx];
  return `
<div class="screen">
  ${progressBar()}
  <div class="rainbow-bar no-print" style="background:linear-gradient(to right, ${st.color}, ${st.color}88);opacity:.8;"></div>

  <p class="station-badge">Station ${st.id} of ${STATIONS.length}</p>
  <h2 class="station-title-h2">${st.title}</h2>
  <p class="station-location">${st.location}</p>

  <div class="scripture-card">
    <span class="ql">"</span>
    <p class="scripture-text">${st.scripture}</p>
    <p class="scripture-ref">— ${st.reference}</p>
  </div>

  <div class="reflect-card">
    <p class="reflect-label">🕯 Take a moment to reflect…</p>
    <p class="reflect-text">${st.reflectivePrompt}</p>
  </div>

  <div class="spacer"></div>
  <button class="btn btn-primary btn-full" onclick="goChallenge()">Ready for the Challenge →</button>
</div>`;
}

function goChallenge() {
  S.cd = initChallengeData(STATIONS[S.stationIdx].challenge);
  S.challengeDone = false;
  go('challenge');
}

/* ── Init challenge state by type ─── */
function initChallengeData(ch) {
  switch (ch.type) {
    case 'matching':
      return {
        leftSel: null,
        pairs: {}, // leftIdx → rightIdx
        checked: false,
        results: null, // null | bool[]
      };
    case 'quiz':
      return { qIdx: 0, answers: [], feedback: false };
    case 'dilemma':
      return { chosen: null, feedback: false };
    case 'sorting':
      return { selected: new Set() };
    case 'truefalse':
      return { qIdx: 0, answers: [], feedback: false };
    case 'commitment':
      return { selected: null, custom: '' };
    default:
      return {};
  }
}

/* ================================================================
   CHALLENGE SCREEN
   ================================================================ */
function renderChallenge() {
  const st = STATIONS[S.stationIdx];
  const ch = st.challenge;

  let body = '';
  switch (ch.type) {
    case 'matching':    body = renderMatching(ch);    break;
    case 'quiz':        body = renderQuiz(ch);        break;
    case 'dilemma':     body = renderDilemma(ch);     break;
    case 'sorting':     body = renderSorting(ch);     break;
    case 'truefalse':   body = renderTrueFalse(ch);   break;
    case 'commitment':  body = renderCommitment(ch);  break;
  }

  const doneBtn = S.challengeDone
    ? `<button class="btn btn-primary btn-full mt-6" onclick="finishChallenge()">Unlock Your Prayer →</button>`
    : `<button class="btn btn-primary btn-full mt-6" onclick="finishChallenge()" disabled>Unlock Your Prayer →</button>`;

  return `
<div class="screen">
  ${progressBar()}
  <div class="challenge-header">
    <span class="challenge-badge">⚡ Challenge</span>
    <h3 class="challenge-title-h3">${st.title}</h3>
  </div>
  <p class="challenge-instruction">${ch.instruction}</p>
  ${body}
  ${doneBtn}
</div>`;
}

function finishChallenge() {
  if (!S.challengeDone) return;
  S.completed.push(S.stationIdx);
  go('prayer');
}

/* ─── Helper: mark challenge done and re-render ─── */
function markDone() {
  S.challengeDone = true;
  // re-render challenge screen so button enables (plus show any final state)
  const app = document.getElementById('app');
  const st = STATIONS[S.stationIdx];
  const ch = st.challenge;
  let body = '';
  switch (ch.type) {
    case 'matching':   body = renderMatching(ch);   break;
    case 'quiz':       body = renderQuiz(ch);       break;
    case 'dilemma':    body = renderDilemma(ch);    break;
    case 'sorting':    body = renderSorting(ch);    break;
    case 'truefalse':  body = renderTrueFalse(ch);  break;
    case 'commitment': body = renderCommitment(ch); break;
  }
  const challengeContent = app.querySelector('.screen');
  if (challengeContent) {
    // Update only the challenge body + button
    const bodyEl = challengeContent.querySelector('.challenge-body');
    if (bodyEl) bodyEl.innerHTML = body;
    const btnEl = challengeContent.querySelector('.complete-btn');
    if (btnEl) btnEl.disabled = false;
  }
}

/* ─── Full re-render of just the challenge screen ─── */
function rerenderChallenge() {
  document.getElementById('app').innerHTML = renderChallenge();
}

/* ================================================================
   MATCHING CHALLENGE  (used by station 1 & 3)
   ================================================================ */
function renderMatching(ch) {
  const cd = S.cd;
  const pairs = ch.pairs;
  const pairCount = Object.keys(cd.pairs).length;

  const leftItems = pairs.map((p, i) => {
    let cls = 'match-item';
    let badge = '';
    const pairedTo = cd.pairs[i];
    if (pairedTo !== undefined) {
      const pairNum = Object.keys(cd.pairs).sort().indexOf(String(i)) + 1;
      badge = `<span class="match-pair-badge">${pairNum}</span>`;
      cls += ' matched';
      if (cd.checked) cls += cd.results && cd.results[i] ? ' correct' : ' wrong';
    } else if (cd.leftSel === i) {
      cls += ' selected';
    }
    const onclick = (!cd.checked && pairedTo === undefined) ? `onclick="matchLeft(${i})"` : '';
    return `<div class="${cls}" ${onclick}>${badge}${p.left}</div>`;
  });

  // Build right items — need to know which right indices are already taken
  const usedRight = new Set(Object.values(cd.pairs));
  const rightItems = pairs.map((p, j) => {
    let cls = 'match-item';
    let badge = '';
    // Which left paired to this right?
    const matchedLeftIdx = Object.entries(cd.pairs).find(([l, r]) => r === j)?.[0];
    if (matchedLeftIdx !== undefined) {
      const pairNum = Object.keys(cd.pairs).sort().indexOf(String(matchedLeftIdx)) + 1;
      badge = `<span class="match-pair-badge">${pairNum}</span>`;
      cls += ' matched';
      if (cd.checked) cls += cd.results && cd.results[matchedLeftIdx] ? ' correct' : ' wrong';
    }
    const clickable = !cd.checked && matchedLeftIdx === undefined && cd.leftSel !== null;
    const onclick = clickable ? `onclick="matchRight(${j})"` : '';
    if (clickable) cls += ' target'; // pulse border when a left item is active
    return `<div class="${cls}" ${onclick}>${badge}${p.right}</div>`;
  });

  const checkBtn = (pairCount === pairs.length && !cd.checked)
    ? `<button class="btn btn-secondary btn-full mt-4" onclick="checkMatching()">✓ Check My Answers</button>`
    : '';

  let feedback = '';
  if (cd.checked && cd.results) {
    const allCorrect = cd.results.every(Boolean);
    feedback = `<div class="feedback-box show ${allCorrect ? 'correct' : 'wrong'}">${
      allCorrect
        ? '🌟 Perfect! You matched them all correctly!'
        : '❌ Not quite — the highlighted ones are off. Check the connections and remember them for next time!'
    }</div>`;
  }

  const hint = cd.leftSel !== null && !cd.checked
    ? `<p style="font-size:.78rem;color:var(--gold);text-align:center;margin-bottom:8px;animation:pulse 1s infinite alternate;">Now tap a description on the right →</p>`
    : (pairCount < pairs.length && !cd.checked
        ? `<p style="font-size:.78rem;color:var(--text3);text-align:center;margin-bottom:8px;">Tap a name on the left to start matching.</p>`
        : '');

  return `
<div class="match-grid" id="matchGrid">
  <div class="match-col">
    <p class="match-col-label">Names / Symbols</p>
    ${leftItems.join('')}
  </div>
  <div class="match-col">
    <p class="match-col-label">Meanings</p>
    ${rightItems.join('')}
  </div>
</div>
${hint}
${checkBtn}
${feedback}`;
}

function matchLeft(i) {
  const cd = S.cd;
  if (cd.checked) return;
  if (cd.pairs[i] !== undefined) return; // already paired
  cd.leftSel = (cd.leftSel === i) ? null : i; // toggle
  rerenderChallenge();
}

function matchRight(j) {
  const cd = S.cd;
  if (cd.checked) return;
  if (cd.leftSel === null) return;
  // Check right not already used
  const usedRight = new Set(Object.values(cd.pairs));
  if (usedRight.has(j)) return;
  cd.pairs[cd.leftSel] = j;
  cd.leftSel = null;
  rerenderChallenge();
}

function checkMatching() {
  const cd = S.cd;
  const ch = STATIONS[S.stationIdx].challenge;
  // correctOrder[i] = which right index matches left[i]
  const correct = ch.correctOrder;
  cd.results = ch.pairs.map((_, i) => cd.pairs[i] === correct[i]);
  cd.checked = true;
  S.challengeDone = true;
  rerenderChallenge();
}

/* ================================================================
   QUIZ CHALLENGE
   ================================================================ */
function renderQuiz(ch) {
  const cd = S.cd;
  const q = ch.questions[cd.qIdx];

  const opts = q.options.map((opt, i) => {
    let cls = 'quiz-opt';
    let disabled = '';
    if (cd.feedback) {
      disabled = 'disabled';
      if (i === cd.answers[cd.qIdx]) {
        cls += i === q.correct ? ' chosen correct' : ' chosen wrong';
      } else if (i === q.correct) {
        cls += ' show-correct';
      }
    }
    const onclick = !cd.feedback ? `onclick="answerQuiz(${i})"` : '';
    return `<button class="${cls}" ${disabled} ${onclick}>${opt}</button>`;
  });

  const feedback = cd.feedback
    ? `<div class="feedback-box show ${cd.answers[cd.qIdx] === q.correct ? 'correct' : 'wrong'}">${
        cd.answers[cd.qIdx] === q.correct ? '✅ ' : '❌ '
      }${q.feedback}</div>`
    : '';

  const nextBtn = cd.feedback
    ? (cd.qIdx < ch.questions.length - 1
        ? `<button class="btn btn-secondary" onclick="nextQuizQ()">Next Question →</button>`
        : '')
    : '';

  return `
<p class="quiz-progress">Question ${cd.qIdx + 1} of ${ch.questions.length}</p>
<div class="quiz-question">${q.question}</div>
<div class="quiz-options">${opts.join('')}</div>
${feedback}
${nextBtn}`;
}

function answerQuiz(i) {
  const cd = S.cd;
  const ch = STATIONS[S.stationIdx].challenge;
  if (cd.feedback) return;
  cd.answers[cd.qIdx] = i;
  cd.feedback = true;
  // Last question answered?
  if (cd.qIdx === ch.questions.length - 1) {
    S.challengeDone = true;
  }
  rerenderChallenge();
}

function nextQuizQ() {
  const cd = S.cd;
  const ch = STATIONS[S.stationIdx].challenge;
  cd.qIdx++;
  cd.feedback = false;
  rerenderChallenge();
}

/* ================================================================
   DILEMMA CHALLENGE
   ================================================================ */
function renderDilemma(ch) {
  const cd = S.cd;

  const opts = ch.options.map((opt, i) => {
    let cls = 'dilemma-opt';
    let disabled = '';
    if (cd.feedback) {
      disabled = 'disabled';
      if (i === cd.chosen) cls += opt.isBest ? ' best' : ' chosen';
      else if (opt.isBest) cls += ' best';
    }
    const onclick = !cd.feedback ? `onclick="chooseDilemma(${i})"` : '';
    return `<button class="${cls}" ${disabled} ${onclick}>${opt.text}</button>`;
  });

  const feedback = cd.feedback
    ? `<div class="feedback-box show">${ch.options[cd.chosen].feedback}</div>`
    : '';

  return `
<div class="dilemma-scenario">${ch.scenario}</div>
<div class="dilemma-opts">${opts.join('')}</div>
${feedback}`;
}

function chooseDilemma(i) {
  const cd = S.cd;
  if (cd.feedback) return;
  cd.chosen = i;
  cd.feedback = true;
  S.challengeDone = true;
  rerenderChallenge();
}

/* ================================================================
   SORTING CHALLENGE
   ================================================================ */
function renderSorting(ch) {
  const cd = S.cd;
  const count = cd.selected.size;

  const cards = ch.acts.map((act, i) => {
    const isSel = cd.selected.has(i);
    const isDisabled = !isSel && count >= ch.required;
    let cls = 'act-card';
    if (isSel) cls += ' selected';
    if (isDisabled) cls += ' disabled';
    const onclick = !isDisabled ? `onclick="toggleAct(${i})"` : '';
    return `<div class="${cls}" ${onclick}>
      <span class="act-icon">${act.icon}</span>
      <span class="act-text">${act.text}</span>
    </div>`;
  });

  const counter = `<p class="sorting-counter">
    Selected: <span>${count}</span> / ${ch.required} needed
  </p>`;

  return `
<div class="acts-grid">${cards.join('')}</div>
${counter}`;
}

function toggleAct(i) {
  const cd = S.cd;
  const ch = STATIONS[S.stationIdx].challenge;
  if (cd.selected.has(i)) {
    cd.selected.delete(i);
  } else if (cd.selected.size < ch.required) {
    cd.selected.add(i);
  }
  if (cd.selected.size >= ch.required) {
    S.challengeDone = true;
  } else {
    S.challengeDone = false;
  }
  rerenderChallenge();
}

/* ================================================================
   TRUE / FALSE CHALLENGE
   ================================================================ */
function renderTrueFalse(ch) {
  const cd = S.cd;
  const q = ch.questions[cd.qIdx];
  const answered = cd.answers[cd.qIdx] !== undefined;

  const playerAnswer = cd.answers[cd.qIdx]; // true/false/undefined
  const isCorrect = answered && (playerAnswer === q.correct);

  let trueClass = 'tf-btn', falseClass = 'tf-btn';
  let disabled = '';
  if (answered) {
    disabled = 'disabled';
    if (playerAnswer === true)  trueClass  += q.correct === true  ? ' correct' : ' wrong';
    if (playerAnswer === false) falseClass += q.correct === false ? ' correct' : ' wrong';
    // Show which was correct if they got it wrong
    if (!isCorrect) {
      if (q.correct === true)  trueClass  += ' correct';
      if (q.correct === false) falseClass += ' correct';
    }
  }

  const feedback = answered
    ? `<div class="feedback-box show ${isCorrect ? 'correct' : 'wrong'}">${
        isCorrect ? '✅ ' : '❌ '
      }${q.feedback}</div>`
    : '';

  const nextBtn = answered
    ? (cd.qIdx < ch.questions.length - 1
        ? `<button class="btn btn-secondary" onclick="nextTFQ()">Next Statement →</button>`
        : '')
    : '';

  return `
<p class="quiz-progress">Statement ${cd.qIdx + 1} of ${ch.questions.length}</p>
<div class="tf-statement">${q.statement}</div>
<div class="tf-btns">
  <button class="${trueClass}" ${disabled} onclick="answerTF(true)">✓ True</button>
  <button class="${falseClass}" ${disabled} onclick="answerTF(false)">✗ False</button>
</div>
${feedback}
${nextBtn}`;
}

function answerTF(val) {
  const cd = S.cd;
  const ch = STATIONS[S.stationIdx].challenge;
  if (cd.answers[cd.qIdx] !== undefined) return;
  cd.answers[cd.qIdx] = val;
  if (cd.qIdx === ch.questions.length - 1) {
    S.challengeDone = true;
  }
  rerenderChallenge();
}

function nextTFQ() {
  const cd = S.cd;
  cd.qIdx++;
  rerenderChallenge();
}

/* ================================================================
   COMMITMENT CHALLENGE
   ================================================================ */
function renderCommitment(ch) {
  const cd = S.cd;

  const opts = ch.suggestions.map((s, i) => {
    const isSel = cd.selected === s.text;
    return `<button class="commit-opt ${isSel ? 'selected' : ''}" onclick="pickCommit(${i})">
      <span class="commit-icon-lg">${s.icon}</span>
      <span>${s.text}</span>
    </button>`;
  });

  return `
<div class="commit-list">${opts.join('')}</div>
<div class="custom-commit-wrap">
  <p class="custom-commit-label">…or write your own:</p>
  <input
    class="custom-commit-input"
    type="text"
    id="customCommit"
    placeholder="Something I'll do this week…"
    value="${escHtml(cd.custom)}"
    oninput="updateCustomCommit(this.value)"
    maxlength="120"
  >
</div>`;
}

function pickCommit(i) {
  const cd = S.cd;
  const ch = STATIONS[S.stationIdx].challenge;
  const s = ch.suggestions[i];
  cd.selected = (cd.selected === s.text) ? null : s.text;
  cd.custom = '';
  S.challengeDone = !!cd.selected;
  rerenderChallenge();
  // Focus stays fine
}

function updateCustomCommit(val) {
  const cd = S.cd;
  cd.custom = val.trim();
  cd.selected = null;
  S.challengeDone = cd.custom.length > 2;
  // Update only the unlock button to avoid losing focus
  const btn = document.querySelector('.screen .btn.btn-primary.btn-full');
  if (btn) btn.disabled = !S.challengeDone;
}

/* ================================================================
   PRAYER UNLOCK SCREEN
   ================================================================ */
function renderPrayer() {
  const st = STATIONS[S.stationIdx];
  const isLast = S.stationIdx === STATIONS.length - 1;
  const nextLabel = isLast ? '✦ See Your Completion Card' : `Continue to Station ${st.id + 1} →`;

  return `
<div class="screen prayer-screen">
  ${progressBar()}
  <span class="unlock-emoji">🙌</span>
  <h2 class="unlock-title">Station ${st.id} Complete!</h2>
  <p class="unlock-sub">You've unlocked a prayer card.</p>

  <div class="prayer-card">
    <span class="prayer-ornament">✦  ✦  ✦</span>
    <p class="prayer-saint-name">${st.prayer.saint}</p>
    <p class="prayer-text">${st.prayer.text}</p>
    <span class="prayer-ornament bottom">✦  ✦  ✦</span>
  </div>

  <button class="btn btn-primary btn-full" onclick="nextStation()">${nextLabel}</button>
  ${!isLast ? `<button class="btn btn-ghost btn-full mt-2 no-print" onclick="nextStation()">Skip ahead</button>` : ''}
</div>`;
}

function nextStation() {
  // Save commitment if it was the last station
  if (S.stationIdx === STATIONS.length - 1) {
    const cd = S.cd;
    if (cd) {
      S.commitment = cd.selected || cd.custom || 'Show love to those around me';
    }
    S.quote = SAINT_QUOTES[Math.floor(Math.random() * SAINT_QUOTES.length)];
    go('completion');
    setTimeout(launchConfetti, 350);
  } else {
    S.stationIdx++;
    S.cd = null;
    S.challengeDone = false;
    go('station-info');
  }
}

/* ================================================================
   COMPLETION SCREEN
   ================================================================ */
function renderCompletion() {
  const q = S.quote || SAINT_QUOTES[0];

  const summary = STATIONS.map(st => `
    <div class="summary-item">
      <span class="check">✓</span>
      <span>${st.title}</span>
    </div>`).join('');

  const commitDisplay = S.commitment
    ? `<div class="commitment-display">
        <p class="label">✦ My Commitment This Week</p>
        <p class="value">${escHtml(S.commitment)}</p>
      </div>`
    : '';

  return `
<div class="screen completion-screen">
  <span class="completion-icon">✝</span>
  <h2 class="completion-title">Journey Complete!</h2>
  <p class="completion-sub">
    You've walked all seven stations. May God's grace go with you
    as you carry these virtues into the world. 🕊️
  </p>

  <div class="share-card" id="shareCard">
    <p class="card-title-line">✦ Seven Stations of Virtue — Completion Card ✦</p>
    <p class="card-quote">"${q.quote}"</p>
    <p class="card-saint">— ${q.saint}</p>
    ${commitDisplay}
    <p class="blessing-text">
      May you go in peace, to love and serve the Lord.<br>
      <em>Thanks be to God.</em>
    </p>
    <p class="card-saintapedia-credit">
      A <a href="https://saintapedia.org/" target="_blank" rel="noopener">Saintapedia</a> Project
    </p>
  </div>

  <div class="stations-summary no-print">
    <p class="summary-title">Stations completed</p>
    <div class="summary-grid">${summary}</div>
  </div>

  <div class="completion-actions no-print">
    <button class="btn btn-primary btn-full" onclick="printCard()">🖨 Save / Print My Card</button>
    <button class="btn btn-secondary btn-full" onclick="playAgain()">✦ Journey Again</button>
    <a class="saintapedia-link mt-2" href="https://saintapedia.org/" target="_blank" rel="noopener">
      Explore more saints at <strong>Saintapedia.org</strong> →
    </a>
  </div>
</div>`;
}

function printCard() { window.print(); }
function playAgain() { S.screen = 'welcome'; render(); }

/* ================================================================
   PROGRESS BAR
   ================================================================ */
function progressBar() {
  let html = '<div class="progress-row">';
  STATIONS.forEach((st, i) => {
    let cls = 'progress-dot';
    if (S.completed.includes(i)) cls += ' done';
    else if (i === S.stationIdx) cls += ' current';
    const icon = S.completed.includes(i) ? '✓' : (i === S.stationIdx ? '✦' : (i + 1));
    html += `<div class="${cls}" title="Station ${i+1}: ${st.title}">${icon}</div>`;
    if (i < STATIONS.length - 1) html += '<div class="progress-line"></div>';
  });
  html += '</div>';
  return html;
}

/* ================================================================
   CONFETTI
   ================================================================ */
function launchConfetti() {
  const colors = ['#d4af37','#f0d060','#7B2D8B','#2D6A9F','#2E8B57','#C0392B','#E67E22'];
  const wrap = document.createElement('div');
  wrap.className = 'confetti-wrap';
  document.body.appendChild(wrap);
  for (let i = 0; i < 70; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-particle';
    p.style.cssText = `
      left:${Math.random()*100}%;
      top:-${Math.random()*20}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      width:${6+Math.random()*8}px;
      height:${6+Math.random()*8}px;
      border-radius:${Math.random()>0.5?'50%':'2px'};
      animation-duration:${1.8+Math.random()*2.5}s;
      animation-delay:${Math.random()*1.2}s;
    `;
    wrap.appendChild(p);
  }
  setTimeout(() => wrap.remove(), 5000);
}

/* ================================================================
   UTILITIES
   ================================================================ */
function escHtml(s) {
  return (s || '')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}
