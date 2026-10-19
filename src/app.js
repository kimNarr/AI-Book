// ============================================================================
// AI-Book — AI-Book: Learning Log (Living Editorial E-Book Engine)
// - 스마트 목차(sectionCode) 자동 정렬 및 끼워넣기 엔진
// - 첫 표지 & 첫 페이지(인사말·프로젝트 소개·역방향 학습 애니메이션 도해)
// - 단원별 맞춤 SVG 개념 도해 및 단계별 애니메이션 시뮬레이터
// - 초급~심화 수준별 해설 탭 + 공부 방법 가이드 + 미니 용어 사전
// - 6대 직군별 맞춤 로드맵 & Git 코드/마크다운 내보내기 (이모지 배제)
// ============================================================================

(function () {
  'use strict';

  const STORAGE_KEYS = {
    CUSTOM_TERMS: 'ai_ebook_custom_terms_v3',
    LEARNED: 'ai_ebook_learned_v3',
    BOOKMARKS: 'ai_ebook_bookmarks_v3',
    QUIZ_PASSED: 'ai_ebook_quiz_passed_v3',
    USER_NOTES: 'ai_ebook_user_notes_v3',
    COVER_IDX: 'ai_ebook_cover_v3'
  };

  let appState = {
    currentView: 'toc',          // 'toc', 'ebook', 'roles', 'architecture', 'tools', 'playbook', 'indexgrid'
    frontMode: 'all',            // 'all' (서문+목차), 'prologue' (첫 페이지 서문·소개), 'toc' (목차만)
    selectedCoverIdx: 0,
    currentPageIdx: 0,
    leftDepthTab: 'all',         // 'all', 'beginner', 'intermediate', 'advanced', 'study'
    rightLabMode: 'visual',      // 'visual', 'code', 'quiz'
    mobilePane: 'left',          // 'left' or 'right' on <1024px
    diagramAnimPaused: false,
    currentProcessStep: 0,
    processInterval: null,
    selectedChapter: 1,
    selectedRole: 'data-ontology',
    selectedArchLayer: 'L3',
    selectedToolCat: 'all',
    indexFilterDiff: 'all',
    indexFilterPart: 'all',
    tocFilterDiff: 'all',
    searchQuery: '',
    exportMode: 'gitcode',       // 'gitcode' | 'markdown' | 'backup'
    terms: [],
    learnedIds: {},
    bookmarkedIds: {},
    quizPassedIds: {},
    userNotes: {}
  };

  // --------------------------------------------------------------------------
  // 1. 스마트 목차 번호(sectionCode) 비교 및 자동 정렬 엔진
  // --------------------------------------------------------------------------
  function parseSectionParts(codeStr, fallbackChapter) {
    if (!codeStr || typeof codeStr !== 'string') {
      return [fallbackChapter || 99, 999];
    }
    return codeStr
      .trim()
      .split('.')
      .map(s => {
        const n = parseInt(s.replace(/[^\d]/g, ''), 10);
        return isNaN(n) ? 0 : n;
      });
  }

  function compareTermsByCurriculum(a, b) {
    const chA = Number(a.chapter) || 99;
    const chB = Number(b.chapter) || 99;
    if (chA !== chB) return chA - chB;

    const partsA = parseSectionParts(a.sectionCode, chA);
    const partsB = parseSectionParts(b.sectionCode, chB);
    const maxLen = Math.max(partsA.length, partsB.length);

    for (let i = 0; i < maxLen; i++) {
      const valA = partsA[i] !== undefined ? partsA[i] : 0;
      const valB = partsB[i] !== undefined ? partsB[i] : 0;
      if (valA !== valB) return valA - valB;
    }
    return String(a.id).localeCompare(String(b.id));
  }

  function sortAllTerms() {
    appState.terms.sort(compareTermsByCurriculum);
  }

  function getChapterPageRange(chapterId) {
    const indices = [];
    appState.terms.forEach((t, idx) => {
      if (Number(t.chapter) === Number(chapterId)) indices.push(idx + 1);
    });
    if (indices.length === 0) return '수록 예정';
    const first = String(indices[0]).padStart(2, '0');
    const last = String(indices[indices.length - 1]).padStart(2, '0');
    return first === last ? `p. ${first}` : `p. ${first} — p. ${last}`;
  }

  function suggestNextSectionCode(chapterId, afterTermId) {
    const chTerms = appState.terms.filter(t => Number(t.chapter) === Number(chapterId));
    if (chTerms.length === 0) return `${chapterId}.1`;

    if (!afterTermId || afterTermId === '__END__') {
      const lastTerm = chTerms[chTerms.length - 1];
      const parts = parseSectionParts(lastTerm.sectionCode, chapterId);
      if (parts.length >= 2) {
        return `${parts[0]}.${parts[1] + 1}`;
      }
      return `${chapterId}.${chTerms.length + 1}`;
    }

    if (afterTermId === '__START__') {
      return `${chapterId}.0.1`;
    }

    const idx = chTerms.findIndex(t => t.id === afterTermId);
    if (idx === -1) return `${chapterId}.${chTerms.length + 1}`;

    const target = chTerms[idx];
    const baseCode = target.sectionCode || `${chapterId}.${idx + 1}`;
    let subIdx = 1;
    while (chTerms.some(t => t.sectionCode === `${baseCode}.${subIdx}`)) {
      subIdx++;
    }
    return `${baseCode}.${subIdx}`;
  }

  // --------------------------------------------------------------------------
  // 2. 로컬 스토리지 상태 로드 및 저장
  // --------------------------------------------------------------------------
  function loadSavedState() {
    const initialList = Array.isArray(window.BOOK_PARTS_DATA) ? [...window.BOOK_PARTS_DATA] : [];
    try {
      const savedCustom = localStorage.getItem(STORAGE_KEYS.CUSTOM_TERMS);
      const savedLearned = localStorage.getItem(STORAGE_KEYS.LEARNED);
      const savedBookmarks = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      const savedQuiz = localStorage.getItem(STORAGE_KEYS.QUIZ_PASSED);
      const savedNotes = localStorage.getItem(STORAGE_KEYS.USER_NOTES);
      const savedCover = localStorage.getItem(STORAGE_KEYS.COVER_IDX);

      const customTerms = savedCustom ? JSON.parse(savedCustom) : [];
      const existingIds = new Set(initialList.map(t => t.id));
      const validCustom = customTerms.filter(t => t && t.id && !existingIds.has(t.id));

      appState.terms = [...initialList, ...validCustom];
      sortAllTerms();

      appState.learnedIds = savedLearned ? JSON.parse(savedLearned) : {};
      appState.bookmarkedIds = savedBookmarks ? JSON.parse(savedBookmarks) : {};
      appState.quizPassedIds = savedQuiz ? JSON.parse(savedQuiz) : {};
      appState.userNotes = savedNotes ? JSON.parse(savedNotes) : {};
      if (savedCover !== null) {
        appState.selectedCoverIdx = parseInt(savedCover, 10) || 0;
      }
    } catch (e) {
      appState.terms = [...initialList];
      sortAllTerms();
    }
  }

  function saveProgressState() {
    try {
      localStorage.setItem(STORAGE_KEYS.LEARNED, JSON.stringify(appState.learnedIds));
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(appState.bookmarkedIds));
      localStorage.setItem(STORAGE_KEYS.QUIZ_PASSED, JSON.stringify(appState.quizPassedIds));
      localStorage.setItem(STORAGE_KEYS.USER_NOTES, JSON.stringify(appState.userNotes));
      localStorage.setItem(STORAGE_KEYS.COVER_IDX, String(appState.selectedCoverIdx));
      const customTerms = appState.terms.filter(t => t.isCustom);
      localStorage.setItem(STORAGE_KEYS.CUSTOM_TERMS, JSON.stringify(customTerms));
    } catch (e) {
      // Ignore quota errors
    }
  }

  // --------------------------------------------------------------------------
  // 3. 공통 유틸리티 및 가독성 포매터
  // --------------------------------------------------------------------------
  function stopProcessTimer() {
    if (appState.processInterval) {
      clearInterval(appState.processInterval);
      appState.processInterval = null;
    }
    const playBtn = document.getElementById('btnPlayProcess');
    if (playBtn) playBtn.textContent = '과정 자동 재생';
  }

  function showToast(msg) {
    const toast = document.getElementById('toastBox');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove('hidden');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 2600);
  }

  function copyTextSafe(text, successMsg) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          showToast(successMsg || '클립보드에 복사되었습니다.');
        }).catch(() => fallbackCopy(text, successMsg));
      } else {
        fallbackCopy(text, successMsg);
      }
    } catch (e) {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast(successMsg || '클립보드에 복사되었습니다.');
    } catch (err) {
      showToast('복사에 실패했습니다.');
    }
    document.body.removeChild(ta);
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // 긴 문단을 가독성 높은 다중 문단 또는 단계별 블록으로 변환
  function formatReadableHtml(rawText) {
    if (!rawText) return '';
    const clean = String(rawText).trim();

    // 화살표(→)로 이어진 단계별 학습 가이드인 경우 단계별 카드로 변환
    if (clean.includes('→') && (clean.includes('1단계') || clean.includes('①'))) {
      const steps = clean.split(/\s*→\s*/).filter(Boolean);
      if (steps.length >= 2) {
        return `<div class="space-y-2">` + steps.map((st, idx) => `
          <div class="flex items-start gap-2.5 bg-[#f3efe6] border border-[#dcd6c8] rounded-lg px-3 py-2">
            <span class="text-[11px] font-mono-code font-bold text-[#7c5e3c] shrink-0 mt-0.5">STEP 0${idx + 1}</span>
            <span class="text-xs sm:text-sm text-stone-800 leading-relaxed">${escapeHtml(st.replace(/^[①②③④⑤]\s*/, ''))}</span>
          </div>
        `).join('') + `</div>`;
      }
    }

    // 일반 해설 문단인 경우 2문장 단위로 호흡을 나누어 가독성 향상
    const sentences = clean.split(/(?<=\.)\s+/);
    if (sentences.length <= 2) {
      return `<p class="leading-[1.9] text-stone-800">${escapeHtml(clean)}</p>`;
    }
    const paragraphs = [];
    for (let i = 0; i < sentences.length; i += 2) {
      paragraphs.push(sentences.slice(i, i + 2).join(' '));
    }
    return paragraphs.map(p => `<p class="leading-[1.9] text-stone-800">${escapeHtml(p)}</p>`).join('');
  }

  function getDifficultyMeta(diffKey) {
    return (window.DIFFICULTY_LEVELS && window.DIFFICULTY_LEVELS[diffKey]) ||
      window.DIFFICULTY_LEVELS.elementary;
  }

  function getRoleMeta(roleId) {
    return (window.JOB_ROLES || []).find(r => r.id === roleId);
  }

  // --------------------------------------------------------------------------
  // 4. 단원별 맞춤 그림 설명 & 애니메이션 SVG 생성 엔진
  // --------------------------------------------------------------------------
  function buildConceptAnimatedSvg(item, stepIdx) {
    const s = Number(stepIdx) || 0;
    const id = item.id || '';
    const sec = item.sectionCode || '1.1';
    const pauseClass = appState.diagramAnimPaused ? 'diagram-paused' : '';

    const commonDefs = `
      <defs>
        <marker id="arrNavy" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#2c3e50"/>
        </marker>
        <marker id="arrBronze" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#7c5e3c"/>
        </marker>
        <marker id="arrEmerald" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#1f5f4b"/>
        </marker>
      </defs>
    `;

    // 1.1 AI 패러다임 (기호주의 규칙 트리 + 연결주의 신경망 -> 뉴로심볼릭 결합)
    if (id === 'p1-ai-paradigm') {
      return `
        <div class="${pauseClass} space-y-1.5">
          <div class="flex items-center justify-between text-[10px] font-mono-code text-[#7c5e3c]">
            <span>FIG ${escapeHtml(sec)} · SYMBOLIC RULES + NEURAL LEARNING = NEURO-SYMBOLIC AI</span>
            <span>STAGE 0${s + 1} ACTIVE</span>
          </div>
          <svg viewBox="0 0 640 165" class="w-full h-auto min-w-[460px]">
            ${commonDefs}
            <!-- Symbolic AI Box -->
            <rect x="14" y="16" width="175" height="58" rx="6" fill="${s === 0 ? '#2c3e50' : '#faf8f3'}" stroke="#2c3e50" stroke-width="1.6"/>
            <text x="101" y="38" text-anchor="middle" font-size="11" font-weight="700" fill="${s === 0 ? '#faf8f3' : '#1c1917'}">기호주의 (Symbolic AI)</text>
            <text x="101" y="56" text-anchor="middle" font-size="9.5" fill="${s === 0 ? '#fcd34d' : '#7c5e3c'}">명시적 논리 · 규칙 · 온톨로지</text>

            <!-- Connectionist AI Box -->
            <rect x="14" y="92" width="175" height="58" rx="6" fill="${s === 1 || s === 2 ? '#2c3e50' : '#faf8f3'}" stroke="#2c3e50" stroke-width="1.6"/>
            <text x="101" y="114" text-anchor="middle" font-size="11" font-weight="700" fill="${s === 1 || s === 2 ? '#faf8f3' : '#1c1917'}">연결주의 (Connectionism)</text>
            <text x="101" y="132" text-anchor="middle" font-size="9.5" fill="${s === 1 || s === 2 ? '#fcd34d' : '#7c5e3c'}">머신러닝 · 딥러닝 · 강화학습</text>

            <!-- Flowing paths to Hybrid Core -->
            <path d="M 189 45 C 235 45, 240 82, 282 82" fill="none" stroke="#7c5e3c" stroke-width="2" class="svg-flow-line" marker-end="url(#arrBronze)"/>
            <path d="M 189 121 C 235 121, 240 82, 282 82" fill="none" stroke="#2c3e50" stroke-width="2" class="svg-flow-line" marker-end="url(#arrNavy)"/>

            <!-- Hybrid Core -->
            <rect x="288" y="46" width="165" height="74" rx="8" fill="${s === 3 ? '#2c3e50' : '#ebe6dc'}" stroke="#2c3e50" stroke-width="1.8" class="svg-pulse-node"/>
            <text x="370" y="74" text-anchor="middle" font-size="11.5" font-weight="700" fill="${s === 3 ? '#faf8f3' : '#1c1917'}">현대 하이브리드 AI</text>
            <text x="370" y="92" text-anchor="middle" font-size="9.5" fill="${s === 3 ? '#fcd34d' : '#57534e'}">LLM 직관 + 온톨로지 검증</text>
            <text x="370" y="107" text-anchor="middle" font-size="9" font-family="JetBrains Mono" fill="${s === 3 ? '#e7e5e4' : '#7c5e3c'}">GraphRAG + RL + Harness</text>

            <line x1="453" y1="83" x2="495" y2="83" stroke="#1f5f4b" stroke-width="2" class="svg-flow-fast" marker-end="url(#arrEmerald)"/>

            <!-- Verified Output -->
            <rect x="501" y="54" width="125" height="58" rx="6" fill="#faf8f3" stroke="#1f5f4b" stroke-width="1.6"/>
            <text x="563" y="78" text-anchor="middle" font-size="11" font-weight="700" fill="#1f5f4b">신뢰성 있는 실행</text>
            <text x="563" y="95" text-anchor="middle" font-size="9.5" fill="#44403c">환각 차단 · 근거 제시</text>
          </svg>
        </div>
      `;
    }

    // 1.2 토큰 & 컨텍스트 윈도우 (토큰 분할 블록 + 슬라이딩 컨텍스트 창)
    if (id === 'p1-token-context') {
      return `
        <div class="${pauseClass} space-y-1.5">
          <div class="flex items-center justify-between text-[10px] font-mono-code text-[#7c5e3c]">
            <span>FIG ${escapeHtml(sec)} · BPE TOKENIZATION &amp; SLIDING CONTEXT WINDOW</span>
            <span>KV CACHE ACTIVE</span>
          </div>
          <svg viewBox="0 0 640 165" class="w-full h-auto min-w-[460px]">
            ${commonDefs}
            <!-- Token Blocks -->
            <text x="16" y="24" font-size="10" font-weight="700" fill="#57534e">01. 입력 문장의 서브워드 토큰 분할 (Tokenization)</text>
            <rect x="16" y="34" width="76" height="36" rx="4" fill="#faf8f3" stroke="#2c3e50" stroke-width="1.5"/>
            <text x="54" y="50" text-anchor="middle" font-size="10.5" font-weight="700" fill="#1c1917">"온톨로지"</text>
            <text x="54" y="63" text-anchor="middle" font-size="8.5" font-family="JetBrains Mono" fill="#7c5e3c">ID: 48102</text>

            <rect x="98" y="34" width="66" height="36" rx="4" fill="#faf8f3" stroke="#2c3e50" stroke-width="1.5"/>
            <text x="131" y="50" text-anchor="middle" font-size="10.5" font-weight="700" fill="#1c1917">"설계"</text>
            <text x="131" y="63" text-anchor="middle" font-size="8.5" font-family="JetBrains Mono" fill="#7c5e3c">ID: 19204</text>

            <rect x="170" y="34" width="66" height="36" rx="4" fill="#faf8f3" stroke="#2c3e50" stroke-width="1.5"/>
            <text x="203" y="50" text-anchor="middle" font-size="10.5" font-weight="700" fill="#1c1917">"방법론"</text>
            <text x="203" y="63" text-anchor="middle" font-size="8.5" font-family="JetBrains Mono" fill="#7c5e3c">ID: 33091</text>

            <line x1="242" y1="52" x2="288" y2="52" stroke="#2c3e50" stroke-width="2" class="svg-flow-line" marker-end="url(#arrNavy)"/>

            <!-- Context Window Frame -->
            <rect x="294" y="18" width="330" height="132" rx="8" fill="#faf8f3" stroke="#2c3e50" stroke-width="1.8" stroke-dasharray="5 3"/>
            <text x="310" y="38" font-size="10.5" font-weight="700" fill="#2c3e50">02. 컨텍스트 윈도우 작업대 (예: 128K ~ 2M Tokens)</text>

            <rect x="310" y="48" width="90" height="44" rx="4" fill="#ebe6dc" stroke="#a8a29e"/>
            <text x="355" y="67" text-anchor="middle" font-size="9.5" font-weight="700" fill="#44403c">시스템 프롬프트</text>
            <text x="355" y="81" text-anchor="middle" font-size="8.5" fill="#78716c">고정 지시문</text>

            <rect x="408" y="48" width="102" height="44" rx="4" fill="#ebe6dc" stroke="#7c5e3c"/>
            <text x="459" y="67" text-anchor="middle" font-size="9.5" font-weight="700" fill="#7c5e3c">RAG · 첨부 문서</text>
            <text x="459" y="81" text-anchor="middle" font-size="8.5" fill="#57534e">KV Cache 저장</text>

            <rect x="518" y="48" width="90" height="44" rx="4" fill="#2c3e50" class="svg-pulse-node"/>
            <text x="563" y="67" text-anchor="middle" font-size="9.5" font-weight="700" fill="#faf8f3">신규 생성 토큰</text>
            <text x="563" y="81" text-anchor="middle" font-size="8.5" fill="#fcd34d">Autoregressive</text>

            <!-- Memory Bar -->
            <rect x="310" y="106" width="298" height="14" rx="7" fill="#e2ddd3"/>
            <rect x="310" y="106" width="${130 + s * 40}" height="14" rx="7" fill="#7c5e3c"/>
            <text x="459" y="136" text-anchor="middle" font-size="9.5" font-family="JetBrains Mono" fill="#57534e">Context Occupancy &amp; KV Cache Memory Growth</text>

            <!-- Forgotten Tokens Warning -->
            <rect x="16" y="92" width="220" height="56" rx="6" fill="#ebe6dc" stroke="#ccc4b4"/>
            <text x="126" y="114" text-anchor="middle" font-size="10" font-weight="700" fill="#7c5e3c">윈도우 초과 시: 오래된 토큰 탈락</text>
            <text x="126" y="132" text-anchor="middle" font-size="9" fill="#57534e">외부 메모리(RAG · 온톨로지)가 필요한 이유</text>
          </svg>
        </div>
      `;
    }

    // 2.1 머신러닝 & 경사하강법 (손실 함수 곡선 위의 공이 기울기를 따라 내려가는 애니메이션)
    if (id === 'p2-ml-fundamentals') {
      const ballPositions = [
        { cx: 115, cy: 42, label: '초기 가중치 (높은 오차 L)' },
        { cx: 175, cy: 86, label: '기울기(미분) 방향 이동 중' },
        { cx: 235, cy: 122, label: '오차 급감 구간 통과' },
        { cx: 300, cy: 138, label: '최적점(Global Minimum) 수렴!' }
      ];
      const pos = ballPositions[s] || ballPositions[0];
      return `
        <div class="${pauseClass} space-y-1.5">
          <div class="flex items-center justify-between text-[10px] font-mono-code text-[#7c5e3c]">
            <span>FIG ${escapeHtml(sec)} · GRADIENT DESCENT ON LOSS LANDSCAPE L(θ)</span>
            <span>θ_new = θ - η·∇L(θ)</span>
          </div>
          <svg viewBox="0 0 640 170" class="w-full h-auto min-w-[460px]">
            ${commonDefs}
            <!-- Axes -->
            <line x1="55" y1="18" x2="55" y2="150" stroke="#78716c" stroke-width="1.5"/>
            <line x1="55" y1="150" x2="460" y2="150" stroke="#78716c" stroke-width="1.5"/>
            <text x="48" y="30" text-anchor="end" font-size="9.5" font-family="JetBrains Mono" fill="#57534e">Loss L</text>
            <text x="455" y="164" text-anchor="end" font-size="9.5" font-family="JetBrains Mono" fill="#57534e">가중치 파라미터 (θ)</text>

            <!-- Parabola Loss Curve -->
            <path d="M 85 24 Q 300 252 435 28" fill="none" stroke="#2c3e50" stroke-width="2.5"/>

            <!-- Trajectory Dashed Path -->
            <path d="M 115 42 Q 210 130 300 138" fill="none" stroke="#7c5e3c" stroke-width="2" class="svg-flow-fast" marker-end="url(#arrBronze)"/>

            <!-- Ghost steps -->
            <circle cx="115" cy="42" r="5" fill="#d6cfc2" stroke="#78716c"/>
            <circle cx="175" cy="86" r="5" fill="#d6cfc2" stroke="#78716c"/>
            <circle cx="235" cy="122" r="5" fill="#d6cfc2" stroke="#78716c"/>
            <circle cx="300" cy="138" r="6" fill="#d6cfc2" stroke="#1f5f4b" stroke-dasharray="2 2"/>

            <!-- Active Rolling Ball -->
            <circle cx="${pos.cx}" cy="${pos.cy}" r="9" fill="#7c5e3c" stroke="#faf8f3" stroke-width="2" class="svg-pulse-node"/>
            <text x="${pos.cx}" y="${pos.cy - 14}" text-anchor="middle" font-size="10" font-weight="700" fill="#2c3e50">${pos.label}</text>

            <!-- Formula & Explanation Box on Right -->
            <rect x="475" y="24" width="150" height="122" rx="6" fill="#faf8f3" stroke="#dcd6c8"/>
            <text x="550" y="46" text-anchor="middle" font-size="10.5" font-weight="700" fill="#2c3e50">경사하강법 4박자</text>
            <text x="487" y="68" font-size="9.5" fill="#44403c">1. 순전파 예측값 계산</text>
            <text x="487" y="86" font-size="9.5" fill="#44403c">2. 손실(Loss) 오차 측정</text>
            <text x="487" y="104" font-size="9.5" fill="#7c5e3c" font-weight="700">3. 미분 기울기(∇L) 산출</text>
            <text x="487" y="122" font-size="9.5" fill="#1f5f4b" font-weight="700">4. 학습률(η)만큼 이동</text>
          </svg>
        </div>
      `;
    }

    // 2.2 딥러닝 & 트랜스포머 Self-Attention
    if (id === 'p2-dl-transformer') {
      return `
        <div class="${pauseClass} space-y-1.5">
          <div class="flex items-center justify-between text-[10px] font-mono-code text-[#7c5e3c]">
            <span>FIG ${escapeHtml(sec)} · TRANSFORMER SELF-ATTENTION (QUERY · KEY · VALUE)</span>
            <span>PARALLEL CONTEXT MATRIX</span>
          </div>
          <svg viewBox="0 0 640 170" class="w-full h-auto min-w-[460px]">
            ${commonDefs}
            <!-- Input Tokens -->
            <rect x="18" y="22" width="92" height="30" rx="4" fill="#faf8f3" stroke="#2c3e50" stroke-width="1.4"/>
            <text x="64" y="41" text-anchor="middle" font-size="10.5" font-weight="700" fill="#1c1917">"은행에"</text>

            <rect x="18" y="68" width="92" height="30" rx="4" fill="#faf8f3" stroke="#2c3e50" stroke-width="1.4"/>
            <text x="64" y="87" text-anchor="middle" font-size="10.5" font-weight="700" fill="#1c1917">"예금을"</text>

            <rect x="18" y="114" width="92" height="30" rx="4" fill="#2c3e50" stroke="#2c3e50" stroke-width="1.4"/>
            <text x="64" y="133" text-anchor="middle" font-size="10.5" font-weight="700" fill="#faf8f3">"맡겼다"</text>

            <!-- Attention Arcs -->
            <path d="M 110 37 L 235 50" stroke="#7c5e3c" stroke-width="2.6" class="svg-flow-fast" marker-end="url(#arrBronze)"/>
            <path d="M 110 83 L 235 83" stroke="#7c5e3c" stroke-width="3.2" class="svg-flow-fast" marker-end="url(#arrBronze)"/>
            <path d="M 110 129 L 235 116" stroke="#2c3e50" stroke-width="2" class="svg-flow-line" marker-end="url(#arrNavy)"/>

            <!-- Q, K, V Projection Box -->
            <rect x="242" y="26" width="165" height="114" rx="8" fill="#ebe6dc" stroke="#2c3e50" stroke-width="1.6"/>
            <text x="324" y="47" text-anchor="middle" font-size="10.5" font-weight="700" fill="#2c3e50">Self-Attention 연산</text>
            <rect x="256" y="56" width="40" height="24" rx="4" fill="#2c3e50"/><text x="276" y="72" text-anchor="middle" font-size="10" font-weight="700" fill="#faf8f3">Q</text>
            <rect x="304" y="56" width="40" height="24" rx="4" fill="#7c5e3c"/><text x="324" y="72" text-anchor="middle" font-size="10" font-weight="700" fill="#faf8f3">K</text>
            <rect x="352" y="56" width="40" height="24" rx="4" fill="#1f5f4b"/><text x="372" y="72" text-anchor="middle" font-size="10" font-weight="700" fill="#faf8f3">V</text>
            <text x="324" y="102" text-anchor="middle" font-size="9.5" font-family="JetBrains Mono" fill="#1c1917">Softmax(Q·K^T / √d_k)·V</text>
            <text x="324" y="124" text-anchor="middle" font-size="9" fill="#7c5e3c">문맥 연관도 가중치 결합</text>

            <line x1="407" y1="83" x2="455" y2="83" stroke="#1f5f4b" stroke-width="2.2" class="svg-flow-line" marker-end="url(#arrEmerald)"/>

            <!-- Contextualized Output -->
            <rect x="462" y="42" width="162" height="82" rx="8" fill="#faf8f3" stroke="#1f5f4b" stroke-width="1.8" class="svg-pulse-node"/>
            <text x="543" y="68" text-anchor="middle" font-size="11" font-weight="700" fill="#1f5f4b">문맥이 반영된 표현 벡터</text>
            <text x="543" y="88" text-anchor="middle" font-size="9.5" fill="#44403c">"은행" = 금융기관 (97.2%)</text>
            <text x="543" y="106" text-anchor="middle" font-size="9" fill="#78716c">(식물 은행나무 2.8% 배제)</text>
          </svg>
        </div>
      `;
    }

    // 2.3 강화학습 (MDP · 정책 경사 · PPO & GRPO 루프)
    if (id === 'p2-rl-mdp-grpo') {
      return `
        <div class="${pauseClass} space-y-1.5">
          <div class="flex items-center justify-between text-[10px] font-mono-code text-[#7c5e3c]">
            <span>FIG ${escapeHtml(sec)} · REINFORCEMENT LEARNING LOOP (MDP &amp; GRPO GROUP ADVANTAGE)</span>
            <span>POLICY π_θ UPDATE</span>
          </div>
          <svg viewBox="0 0 640 172" class="w-full h-auto min-w-[460px]">
            ${commonDefs}
            <!-- Agent Box -->
            <rect x="24" y="46" width="165" height="78" rx="8" fill="#2c3e50" stroke="#1c1917" stroke-width="1.6" class="svg-pulse-node"/>
            <text x="106" y="74" text-anchor="middle" font-size="11.5" font-weight="700" fill="#faf8f3">에이전트 (Agent)</text>
            <text x="106" y="93" text-anchor="middle" font-size="9.5" fill="#fcd34d">정책 신경망 π_θ (s_t)</text>
            <text x="106" y="110" text-anchor="middle" font-size="8.5" font-family="JetBrains Mono" fill="#e7e5e4">GRPO: G개 추론 경로 생성</text>

            <!-- Top Action Arrow -->
            <path d="M 189 64 Q 310 18 426 64" fill="none" stroke="#2c3e50" stroke-width="2.2" class="svg-flow-fast" marker-end="url(#arrNavy)"/>
            <rect x="240" y="18" width="140" height="22" rx="4" fill="#faf8f3" stroke="#ccc4b4"/>
            <text x="310" y="33" text-anchor="middle" font-size="10" font-weight="700" fill="#2c3e50">행동 / 추론 토큰 (a_t)</text>

            <!-- Environment / Verifier Box -->
            <rect x="432" y="46" width="184" height="78" rx="8" fill="#faf8f3" stroke="#7c5e3c" stroke-width="1.8"/>
            <text x="524" y="72" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1c1917">환경 · 검증기 (Environment)</text>
            <text x="524" y="91" text-anchor="middle" font-size="9.5" fill="#7c5e3c">컴파일러 · 수학 정답 · 시뮬레이터</text>
            <text x="524" y="108" text-anchor="middle" font-size="9" fill="#1f5f4b" font-weight="700">상대 이득 A_i = (r_i - μ) / σ</text>

            <!-- Bottom State + Reward Arrow -->
            <path d="M 432 108 Q 310 156 193 108" fill="none" stroke="#7c5e3c" stroke-width="2.2" class="svg-flow-fast" marker-end="url(#arrBronze)"/>
            <rect x="215" y="128" width="190" height="24" rx="4" fill="#f3efe6" stroke="#7c5e3c"/>
            <text x="310" y="144" text-anchor="middle" font-size="10" font-weight="700" fill="#7c5e3c">다음 상태 (s_t+1) + 보상 신호 (Reward r_t)</text>
          </svg>
        </div>
      `;
    }

    // 3.1 온톨로지 (Class · Property · Axiom · Reasoner)
    if (id === 'p3-ontology-core') {
      return `
        <div class="${pauseClass} space-y-1.5">
          <div class="flex items-center justify-between text-[10px] font-mono-code text-[#7c5e3c]">
            <span>FIG ${escapeHtml(sec)} · ONTOLOGY ARCHITECTURE (CLASS · PROPERTY · AXIOM · REASONER)</span>
            <span>OWL / SEMANTIC SCHEMA</span>
          </div>
          <svg viewBox="0 0 640 176" class="w-full h-auto min-w-[480px]">
            ${commonDefs}
            <!-- Class Hierarchy (TBox) -->
            <rect x="16" y="16" width="130" height="34" rx="5" fill="#2c3e50"/>
            <text x="81" y="37" text-anchor="middle" font-size="10.5" font-weight="700" fill="#faf8f3">Class: 임직원</text>

            <line x1="50" y1="50" x2="50" y2="76" stroke="#2c3e50" stroke-width="1.5"/>
            <line x1="112" y1="50" x2="112" y2="76" stroke="#2c3e50" stroke-width="1.5"/>

            <rect x="12" y="76" width="76" height="32" rx="4" fill="#faf8f3" stroke="#1f5f4b" stroke-width="1.6"/>
            <text x="50" y="96" text-anchor="middle" font-size="10" font-weight="700" fill="#1f5f4b">정직원</text>

            <rect x="96" y="76" width="76" height="32" rx="4" fill="#faf8f3" stroke="#7c5e3c" stroke-width="1.6"/>
            <text x="134" y="96" text-anchor="middle" font-size="10" font-weight="700" fill="#7c5e3c">인턴</text>

            <!-- Disjoint Axiom -->
            <rect x="22" y="122" width="140" height="28" rx="4" fill="#ebe6dc" stroke="#7c5e3c" stroke-dasharray="3 2"/>
            <text x="92" y="140" text-anchor="middle" font-size="9.5" font-weight="700" fill="#7c5e3c">공리(Axiom): 상호배타(Disjoint)</text>

            <!-- Object Property Relation -->
            <line x1="88" y1="92" x2="262" y2="54" stroke="#1f5f4b" stroke-width="2" class="svg-flow-line" marker-end="url(#arrEmerald)"/>
            <rect x="148" y="42" width="102" height="20" rx="3" fill="#faf8f3" stroke="#1f5f4b"/>
            <text x="199" y="55" text-anchor="middle" font-size="9" font-weight="700" fill="#1f5f4b">열람가능(Property)</text>

            <!-- Target Resource Class -->
            <rect x="268" y="32" width="136" height="44" rx="6" fill="#faf8f3" stroke="#2c3e50" stroke-width="1.6"/>
            <text x="336" y="52" text-anchor="middle" font-size="10.5" font-weight="700" fill="#1c1917">Class: 1급 기밀문서</text>
            <text x="336" y="67" text-anchor="middle" font-size="9" fill="#7c5e3c">ONLY 정직원 접근 허용</text>

            <!-- Reasoner Engine -->
            <rect x="256" y="102" width="160" height="52" rx="6" fill="#2c3e50" class="svg-pulse-node"/>
            <text x="336" y="124" text-anchor="middle" font-size="10.5" font-weight="700" fill="#faf8f3">추론기 (OWL Reasoner)</text>
            <text x="336" y="141" text-anchor="middle" font-size="9" fill="#fcd34d">숨은 관계 도출 · 모순 자동 차단</text>

            <line x1="416" y1="128" x2="462" y2="128" stroke="#2c3e50" stroke-width="2" class="svg-flow-fast" marker-end="url(#arrNavy)"/>

            <!-- Verified Grounding for LLM -->
            <rect x="468" y="36" width="156" height="118" rx="8" fill="#faf8f3" stroke="#1f5f4b" stroke-width="1.6"/>
            <text x="546" y="60" text-anchor="middle" font-size="10.5" font-weight="700" fill="#1f5f4b">결정론적 무결성 보장</text>
            <text x="546" y="82" text-anchor="middle" font-size="9.5" fill="#44403c">[OK] 정직원 → 열람 승인</text>
            <text x="546" y="102" text-anchor="middle" font-size="9.5" fill="#9f1239" font-weight="700">[차단] 인턴 → 공리 위반</text>
            <text x="546" y="128" text-anchor="middle" font-size="9" fill="#78716c">LLM 에이전트의 행동 가드레일</text>
          </svg>
        </div>
      `;
    }

    // 3.2 지식 그래프 (RDF Triple & Property Graph Multi-hop) || 3.3 임베딩 & GraphRAG
    if (id === 'p3-knowledge-graph' || id === 'p3-embedding-graphrag') {
      return `
        <div class="${pauseClass} space-y-1.5">
          <div class="flex items-center justify-between text-[10px] font-mono-code text-[#7c5e3c]">
            <span>FIG ${escapeHtml(sec)} · KNOWLEDGE GRAPH TRIPLES &amp; HYBRID GRAPHRAG TRAVERSAL</span>
            <span>MULTI-HOP REASONING</span>
          </div>
          <svg viewBox="0 0 640 172" class="w-full h-auto min-w-[460px]">
            ${commonDefs}
            <!-- Top Channel: Vector Similarity -->
            <rect x="16" y="18" width="185" height="54" rx="6" fill="#faf8f3" stroke="#2c3e50" stroke-width="1.5"/>
            <text x="108" y="40" text-anchor="middle" font-size="10.5" font-weight="700" fill="#2c3e50">1. 벡터 임베딩 공간 (Vector DB)</text>
            <text x="108" y="57" text-anchor="middle" font-size="9" fill="#57534e">코사인 유사도로 진입 노드 탐색</text>

            <!-- Bottom Channel: Knowledge Graph Multi-hop -->
            <circle cx="52" cy="128" r="24" fill="#2c3e50"/>
            <text x="52" y="125" text-anchor="middle" font-size="9.5" font-weight="700" fill="#faf8f3">부품 A</text>
            <text x="52" y="138" text-anchor="middle" font-size="8" fill="#fcd34d">Subject</text>

            <line x1="76" y1="128" x2="146" y2="128" stroke="#7c5e3c" stroke-width="2" class="svg-flow-fast" marker-end="url(#arrBronze)"/>
            <text x="111" y="118" text-anchor="middle" font-size="8.5" font-weight="700" fill="#7c5e3c">탑재됨(1-Hop)</text>

            <circle cx="174" cy="128" r="24" fill="#faf8f3" stroke="#7c5e3c" stroke-width="1.8"/>
            <text x="174" y="125" text-anchor="middle" font-size="9.5" font-weight="700" fill="#1c1917">모듈 B</text>
            <text x="174" y="138" text-anchor="middle" font-size="8" fill="#7c5e3c">Object</text>

            <line x1="198" y1="128" x2="268" y2="128" stroke="#7c5e3c" stroke-width="2" class="svg-flow-fast" marker-end="url(#arrBronze)"/>
            <text x="233" y="118" text-anchor="middle" font-size="8.5" font-weight="700" fill="#7c5e3c">책임팀(2-Hop)</text>

            <circle cx="296" cy="128" r="24" fill="#faf8f3" stroke="#1f5f4b" stroke-width="1.8" class="svg-pulse-node"/>
            <text x="296" y="125" text-anchor="middle" font-size="9.5" font-weight="700" fill="#1f5f4b">보안팀 C</text>
            <text x="296" y="138" text-anchor="middle" font-size="8" fill="#57534e">Target</text>

            <!-- Merge into Hybrid GraphRAG Context -->
            <path d="M 201 45 C 310 45, 340 76, 396 76" fill="none" stroke="#2c3e50" stroke-width="1.8" class="svg-flow-line" marker-end="url(#arrNavy)"/>
            <path d="M 320 128 C 360 128, 365 92, 396 92" fill="none" stroke="#1f5f4b" stroke-width="2" class="svg-flow-line" marker-end="url(#arrEmerald)"/>

            <rect x="404" y="42" width="218" height="90" rx="8" fill="#2c3e50"/>
            <text x="513" y="68" text-anchor="middle" font-size="11" font-weight="700" fill="#faf8f3">Hybrid GraphRAG 컨텍스트 결합</text>
            <text x="513" y="88" text-anchor="middle" font-size="9.5" fill="#fcd34d">비정형 문맥 + 다중 홉(Multi-hop) 관계망</text>
            <text x="513" y="108" text-anchor="middle" font-size="9" fill="#e7e5e4">복합 인과관계 질문에 무환각 답변 생성</text>
          </svg>
        </div>
      `;
    }

    // Part 4 (LLM · MoE · LoRA · 루프 트랜스포머 · System 1)
    if (Number(item.chapter) === 4) {
      return `
        <div class="${pauseClass} space-y-1.5">
          <div class="flex items-center justify-between text-[10px] font-mono-code text-[#7c5e3c]">
            <span>FIG ${escapeHtml(sec)} · NEXT-GEN LLM ARCHITECTURE (SPARSE MOE &amp; DYNAMIC ROUTING)</span>
            <span>SELECTIVE COMPUTE</span>
          </div>
          <svg viewBox="0 0 640 170" class="w-full h-auto min-w-[460px]">
            ${commonDefs}
            <!-- Input Token & Shared Context -->
            <rect x="16" y="54" width="120" height="62" rx="6" fill="#faf8f3" stroke="#2c3e50" stroke-width="1.6"/>
            <text x="76" y="80" text-anchor="middle" font-size="10.5" font-weight="700" fill="#1c1917">입력 토큰 &amp; 문맥</text>
            <text x="76" y="98" text-anchor="middle" font-size="9" fill="#7c5e3c">프리필 압축 / 임베딩</text>

            <line x1="136" y1="85" x2="184" y2="85" stroke="#2c3e50" stroke-width="2" class="svg-flow-line" marker-end="url(#arrNavy)"/>

            <!-- Router Gate -->
            <rect x="190" y="48" width="110" height="74" rx="8" fill="#2c3e50" class="svg-pulse-node"/>
            <text x="245" y="78" text-anchor="middle" font-size="10.5" font-weight="700" fill="#faf8f3">라우터 / 제어부</text>
            <text x="245" y="96" text-anchor="middle" font-size="9" fill="#fcd34d">Top-K 전문가 선택</text>

            <!-- Expert Paths -->
            <path d="M 300 68 L 368 36" stroke="#1f5f4b" stroke-width="2.2" class="svg-flow-fast" marker-end="url(#arrEmerald)"/>
            <path d="M 300 85 L 368 85" stroke="#ccc4b4" stroke-width="1.2" stroke-dasharray="3 3"/>
            <path d="M 300 102 L 368 134" stroke="#7c5e3c" stroke-width="2.2" class="svg-flow-fast" marker-end="url(#arrBronze)"/>

            <!-- Experts -->
            <rect x="374" y="16" width="128" height="38" rx="5" fill="#faf8f3" stroke="#1f5f4b" stroke-width="1.8"/>
            <text x="438" y="39" text-anchor="middle" font-size="10" font-weight="700" fill="#1f5f4b">활성 전문가 #1 (ON)</text>

            <rect x="374" y="66" width="128" height="38" rx="5" fill="#ebe6dc" stroke="#ccc4b4"/>
            <text x="438" y="89" text-anchor="middle" font-size="10" fill="#78716c">비활성 전문가 #2 (OFF)</text>

            <rect x="374" y="116" width="128" height="38" rx="5" fill="#faf8f3" stroke="#7c5e3c" stroke-width="1.8"/>
            <text x="438" y="139" text-anchor="middle" font-size="10" font-weight="700" fill="#7c5e3c">활성 전문가 #3 (ON)</text>

            <path d="M 502 35 L 542 74" stroke="#1f5f4b" stroke-width="1.8" class="svg-flow-line"/>
            <path d="M 502 135 L 542 96" stroke="#7c5e3c" stroke-width="1.8" class="svg-flow-line"/>

            <!-- Final Output -->
            <rect x="544" y="54" width="82" height="62" rx="6" fill="#2c3e50"/>
            <text x="585" y="80" text-anchor="middle" font-size="10" font-weight="700" fill="#faf8f3">고효율 추론</text>
            <text x="585" y="97" text-anchor="middle" font-size="8.5" fill="#fcd34d">비용 80% 절감</text>
          </svg>
        </div>
      `;
    }

    // Part 5 (자율 에이전트 하네스 · MCP · A2A · 체화된 에이전트 · 증류/RSI)
    if (Number(item.chapter) === 5) {
      return `
        <div class="${pauseClass} space-y-1.5">
          <div class="flex items-center justify-between text-[10px] font-mono-code text-[#7c5e3c]">
            <span>FIG ${escapeHtml(sec)} · AGENTIC HARNESS &amp; MCP UNIVERSAL TOOL PROTOCOL</span>
            <span>OBSERVE → PLAN → ACT → VERIFY</span>
          </div>
          <svg viewBox="0 0 640 172" class="w-full h-auto min-w-[460px]">
            ${commonDefs}
            <!-- Persistent Memory -->
            <rect x="16" y="22" width="142" height="52" rx="6" fill="#faf8f3" stroke="#7c5e3c" stroke-width="1.6"/>
            <text x="87" y="45" text-anchor="middle" font-size="10.5" font-weight="700" fill="#7c5e3c">영구 메모리 &amp; 스킬북</text>
            <text x="87" y="61" text-anchor="middle" font-size="9" fill="#57534e">세션 간 노하우 보존</text>

            <!-- Goal & Scheduler -->
            <rect x="16" y="96" width="142" height="52" rx="6" fill="#faf8f3" stroke="#2c3e50" stroke-width="1.6"/>
            <text x="87" y="119" text-anchor="middle" font-size="10.5" font-weight="700" fill="#2c3e50">목표 &amp; 상태 감시 루프</text>
            <text x="87" y="135" text-anchor="middle" font-size="9" fill="#57534e">24시간 자율 스케줄러</text>

            <line x1="158" y1="48" x2="218" y2="72" stroke="#7c5e3c" stroke-width="1.8" class="svg-flow-line" marker-end="url(#arrBronze)"/>
            <line x1="158" y1="122" x2="218" y2="98" stroke="#2c3e50" stroke-width="1.8" class="svg-flow-line" marker-end="url(#arrNavy)"/>

            <!-- Central Harness Core -->
            <rect x="224" y="42" width="170" height="86" rx="8" fill="#2c3e50" class="svg-pulse-node"/>
            <text x="309" y="70" text-anchor="middle" font-size="11.5" font-weight="700" fill="#faf8f3">에이전틱 하네스 (Harness)</text>
            <text x="309" y="89" text-anchor="middle" font-size="9.5" fill="#fcd34d">LLM 두뇌 + 오류 자기 복구</text>
            <text x="309" y="108" text-anchor="middle" font-size="9" font-family="JetBrains Mono" fill="#e7e5e4">MCP / A2A Standard Bus</text>

            <!-- MCP Connections -->
            <line x1="394" y1="62" x2="458" y2="38" stroke="#1f5f4b" stroke-width="2" class="svg-flow-fast" marker-end="url(#arrEmerald)"/>
            <line x1="394" y1="85" x2="458" y2="85" stroke="#1f5f4b" stroke-width="2" class="svg-flow-fast" marker-end="url(#arrEmerald)"/>
            <line x1="394" y1="108" x2="458" y2="132" stroke="#1f5f4b" stroke-width="2" class="svg-flow-fast" marker-end="url(#arrEmerald)"/>

            <!-- External Tools -->
            <rect x="464" y="16" width="160" height="38" rx="5" fill="#faf8f3" stroke="#1f5f4b" stroke-width="1.5"/>
            <text x="544" y="39" text-anchor="middle" font-size="10" font-weight="700" fill="#1c1917">MCP 도구: 터미널 · Git · DB</text>

            <rect x="464" y="66" width="160" height="38" rx="5" fill="#faf8f3" stroke="#1f5f4b" stroke-width="1.5"/>
            <text x="544" y="89" text-anchor="middle" font-size="10" font-weight="700" fill="#1c1917">가상 환경 API (Mineflayer)</text>

            <rect x="464" y="116" width="160" height="38" rx="5" fill="#faf8f3" stroke="#1f5f4b" stroke-width="1.5"/>
            <text x="544" y="139" text-anchor="middle" font-size="10" font-weight="700" fill="#1c1917">동료 에이전트 협업 (A2A)</text>
          </svg>
        </div>
      `;
    }

    // Default / Part 1.3 & Part 6 (파라미터 · 양자화 압축 · vLLM 서빙 · 벤치마크)
    const steps = item.processSteps || [
      { title: '1단계', nodes: ['입력 데이터'] },
      { title: '2단계', nodes: ['핵심 처리'] },
      { title: '3단계', nodes: ['최적화 연동'] },
      { title: '4단계', nodes: ['검증 출력'] }
    ];
    const labels = steps.map((st, idx) => (st.nodes && st.nodes[0]) ? st.nodes[0] : `단계 0${idx + 1}`);

    return `
      <div class="${pauseClass} space-y-1.5">
        <div class="flex items-center justify-between text-[10px] font-mono-code text-[#7c5e3c]">
          <span>FIG ${escapeHtml(sec)} · CONCEPTUAL ARCHITECTURE &amp; DATA FLOW SCHEMATIC</span>
          <span>ACTIVE STAGE 0${s + 1}</span>
        </div>
        <svg viewBox="0 0 640 155" class="w-full h-auto min-w-[460px]">
          ${commonDefs}
          ${[0, 1, 2, 3].map(idx => {
            const x = 16 + idx * 156;
            const isCur = idx === s;
            const lbl = labels[idx] || `STAGE 0${idx + 1}`;
            return `
              <rect x="${x}" y="34" width="132" height="76" rx="7"
                fill="${isCur ? '#2c3e50' : '#faf8f3'}"
                stroke="${isCur ? '#1c1917' : '#2c3e50'}"
                stroke-width="${isCur ? '2' : '1.4'}"
                class="${isCur ? 'svg-pulse-node' : ''}"/>
              <text x="${x + 66}" y="58" text-anchor="middle" font-size="9.5" font-family="JetBrains Mono" font-weight="700" fill="${isCur ? '#fcd34d' : '#7c5e3c'}">STAGE 0${idx + 1}</text>
              <text x="${x + 66}" y="82" text-anchor="middle" font-size="10.5" font-weight="700" fill="${isCur ? '#faf8f3' : '#1c1917'}">${escapeHtml(lbl.slice(0, 12))}</text>
              ${idx < 3 ? `<line x1="${x + 132}" y1="72" x2="${x + 154}" y2="72" stroke="#7c5e3c" stroke-width="2" class="svg-flow-fast" marker-end="url(#arrBronze)"/>` : ''}
            `;
          }).join('')}
          <path d="M 560 110 Q 320 148 82 110" fill="none" stroke="#2c3e50" stroke-width="1.4" class="svg-flow-line" marker-end="url(#arrNavy)"/>
          <text x="320" y="142" text-anchor="middle" font-size="9" font-family="JetBrains Mono" fill="#57534e">CONTINUOUS FEEDBACK &amp; VERIFICATION LOOP</text>
        </svg>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // 5. 상단 진도율 바 렌더링
  // --------------------------------------------------------------------------
  function renderProgress() {
    const total = appState.terms.length;
    const learnedCount = appState.terms.filter(t => appState.learnedIds[t.id]).length;
    const quizCount = appState.terms.filter(t => appState.quizPassedIds[t.id]).length;
    const pct = total > 0 ? Math.round((learnedCount / total) * 100) : 0;

    const bar = document.getElementById('progressBar');
    const txt = document.getElementById('progressText');
    const coverStats = document.getElementById('coverTotalStats');
    if (bar) bar.style.width = pct + '%';
    if (txt) txt.textContent = `${pct}% (${learnedCount}/${total} 완독 · 퀴즈 ${quizCount})`;
    if (coverStats) coverStats.textContent = `전 ${window.CHAPTERS.length}부 ${total}단원 수록`;
  }

  // --------------------------------------------------------------------------
  // 6. VIEW 0: 첫 표지 · 첫 페이지(인사말·소개) · 마스터 목차 렌더링
  // --------------------------------------------------------------------------
  function updateFrontPageModeUI() {
    const prologueSec = document.getElementById('frontPrologueSection');
    const tocSec = document.getElementById('frontTocSection');
    if (prologueSec && tocSec) {
      if (appState.frontMode === 'prologue') {
        prologueSec.classList.remove('hidden');
        tocSec.classList.add('hidden');
      } else if (appState.frontMode === 'toc') {
        prologueSec.classList.add('hidden');
        tocSec.classList.remove('hidden');
      } else {
        prologueSec.classList.remove('hidden');
        tocSec.classList.remove('hidden');
      }
    }

    document.querySelectorAll('.front-mode-btn').forEach(btn => {
      const m = btn.getAttribute('data-frontmode');
      btn.className = m === appState.frontMode
        ? 'front-mode-btn px-2.5 py-1 rounded text-xs font-semibold bg-[#2c3e50] text-stone-100 transition'
        : 'front-mode-btn px-2.5 py-1 rounded text-xs font-medium text-stone-700 hover:bg-stone-300/60 transition';
    });
  }

  function renderTocView() {
    renderProgress();
    updateFrontPageModeUI();

    const coverObj = window.COVER_DESIGNS[appState.selectedCoverIdx] || window.COVER_DESIGNS[0];
    const mainImg = document.getElementById('coverMainImg');
    if (mainImg && coverObj) {
      mainImg.src = coverObj.imgSrc;
    }
    const styleLabel = document.getElementById('coverStyleLabel');
    if (styleLabel && coverObj) styleLabel.textContent = coverObj.name;

    document.querySelectorAll('.cover-select-btn').forEach(btn => {
      const idx = parseInt(btn.getAttribute('data-cover'), 10);
      btn.className = idx === appState.selectedCoverIdx
        ? 'cover-select-btn px-2.5 py-1.5 rounded text-xs font-semibold bg-[#2c3e50] text-stone-100 border border-[#2c3e50] transition'
        : 'cover-select-btn px-2.5 py-1.5 rounded text-xs font-medium bg-[#faf8f3] text-stone-700 border border-[#ccc4b4] hover:bg-stone-200/60 transition';
    });

    // 6부작 대분류 요약 그리드
    const catSummaryEl = document.getElementById('tocCategorySummary');
    if (catSummaryEl) {
      catSummaryEl.innerHTML = '';
      window.CHAPTERS.forEach(ch => {
        const chTerms = appState.terms.filter(t => Number(t.chapter) === Number(ch.id));
        const firstIdx = appState.terms.findIndex(t => Number(t.chapter) === Number(ch.id));
        const pageRange = getChapterPageRange(ch.id);

        const box = document.createElement('button');
        box.type = 'button';
        box.className = 'text-left p-3 rounded-lg bg-[#f3efe6] hover:bg-[#eae4d7] border border-[#dcd6c8] transition flex flex-col justify-between group';
        box.innerHTML = `
          <div>
            <div class="flex items-center justify-between text-[11px] font-semibold text-[#7c5e3c]">
              <span>${escapeHtml(ch.badge)}</span>
              <span class="font-mono-code">${escapeHtml(pageRange)}</span>
            </div>
            <div class="text-xs sm:text-sm font-serif-book font-bold text-stone-900 mt-1 group-hover:text-[#2c3e50]">${escapeHtml(ch.title)}</div>
            <p class="text-[11px] text-stone-600 mt-0.5 line-clamp-1">${escapeHtml(ch.subtitle)}</p>
          </div>
          <div class="mt-2 pt-1.5 border-t border-[#e2ddd3] flex items-center justify-between text-[11px]">
            <span class="text-stone-500">${escapeHtml(ch.targetLevel || '')}</span>
            <span class="font-semibold text-[#2c3e50]">단원 ${chTerms.length}개 펼치기 →</span>
          </div>
        `;
        box.addEventListener('click', () => {
          openBookAtPage(firstIdx >= 0 ? firstIdx : 0);
        });
        catSummaryEl.appendChild(box);
      });
    }

    // 난이도 필터 버튼 상태 업데이트
    document.querySelectorAll('.toc-diff-btn').forEach(btn => {
      const d = btn.getAttribute('data-tocdiff');
      btn.className = d === appState.tocFilterDiff
        ? 'toc-diff-btn px-2.5 py-1 rounded text-[11px] font-semibold bg-[#2c3e50] text-stone-100 transition'
        : 'toc-diff-btn px-2.5 py-1 rounded text-[11px] font-medium bg-[#ebe6dc] text-stone-700 hover:bg-stone-300 transition';
    });

    // 세부 단원 차례 리스트
    const tocListEl = document.getElementById('tocPagesList');
    if (!tocListEl) return;
    tocListEl.innerHTML = '';

    window.CHAPTERS.forEach(ch => {
      const matchingTerms = [];
      appState.terms.forEach((item, globalIdx) => {
        if (Number(item.chapter) !== Number(ch.id)) return;
        if (appState.tocFilterDiff !== 'all' && item.difficulty !== appState.tocFilterDiff) return;
        matchingTerms.push({ item, globalIdx });
      });

      if (matchingTerms.length === 0) return;

      const partWrap = document.createElement('div');
      partWrap.className = 'space-y-1.5';

      const pageRange = getChapterPageRange(ch.id);
      const header = document.createElement('div');
      header.className = 'text-xs font-serif-book font-bold text-stone-800 border-b border-[#e2ddd3] pb-1 flex items-center justify-between';
      header.innerHTML = `
        <span>${escapeHtml(ch.badge)} — ${escapeHtml(ch.title)}</span>
        <span class="text-[11px] font-mono-code font-normal text-stone-500">${escapeHtml(pageRange)}</span>
      `;
      partWrap.appendChild(header);

      matchingTerms.forEach(({ item, globalIdx }) => {
        const pageNumStr = String(globalIdx + 1).padStart(2, '0');
        const secCode = item.sectionCode || `${ch.id}.${globalIdx + 1}`;
        const diffMeta = getDifficultyMeta(item.difficulty);
        const isLearned = !!appState.learnedIds[item.id];
        const isBookmarked = !!appState.bookmarkedIds[item.id];
        const isQuizPassed = !!appState.quizPassedIds[item.id];

        const row = document.createElement('button');
        row.type = 'button';
        row.className = 'w-full text-left py-1.5 px-2 rounded hover:bg-[#f0ece1] transition flex items-baseline justify-between gap-2 group';
        row.innerHTML = `
          <div class="flex items-baseline gap-2 min-w-0">
            <span class="text-[11px] font-mono-code font-semibold text-[#7c5e3c] shrink-0">[${escapeHtml(secCode)}]</span>
            <span class="text-xs sm:text-sm font-medium text-stone-800 group-hover:text-[#2c3e50] truncate">${escapeHtml(item.term)}</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded border ${diffMeta.colorClass} shrink-0 hidden sm:inline-block">${diffMeta.badge}</span>
            ${isLearned ? '<span class="text-[10px] px-1.5 py-0.2 rounded bg-stone-800 text-stone-100 shrink-0">완독</span>' : ''}
            ${isQuizPassed ? '<span class="text-[10px] px-1.5 py-0.2 rounded bg-emerald-800 text-stone-100 shrink-0">퀴즈통과</span>' : ''}
            ${isBookmarked ? '<span class="text-[10px] px-1.5 py-0.2 rounded bg-amber-200 text-amber-950 shrink-0">책갈피</span>' : ''}
            ${item.isCustom ? '<span class="text-[10px] px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-900 border border-indigo-300 shrink-0">신규수록</span>' : ''}
          </div>
          <div class="flex-1 border-b border-dotted border-stone-300 mx-1 min-w-[16px]"></div>
          <span class="text-xs font-serif-book font-semibold text-stone-600 shrink-0">p. ${pageNumStr}</span>
        `;
        row.addEventListener('click', () => {
          openBookAtPage(globalIdx);
        });
        partWrap.appendChild(row);
      });

      tocListEl.appendChild(partWrap);
    });
  }

  function openBookAtPage(pageIdx) {
    stopProcessTimer();
    appState.currentPageIdx = Math.max(0, Math.min(pageIdx, appState.terms.length - 1));
    appState.currentProcessStep = 0;
    appState.mobilePane = 'left';
    switchMainView('ebook');
  }

  // --------------------------------------------------------------------------
  // 7. VIEW 1: 본문 읽기 (양면 스프레드 & 모바일 탭 리더)
  // --------------------------------------------------------------------------
  function updateMobilePaneVisibility() {
    const leftPane = document.getElementById('bookLeftPagePane');
    const rightPane = document.getElementById('bookRightPagePane');
    const btnMobLeft = document.getElementById('btnMobilePaneLeft');
    const btnMobRight = document.getElementById('btnMobilePaneRight');
    if (!leftPane || !rightPane) return;

    if (appState.mobilePane === 'left') {
      leftPane.classList.remove('mobile-pane-hidden');
      rightPane.classList.add('mobile-pane-hidden');
      if (btnMobLeft) btnMobLeft.className = 'flex-1 py-2 rounded text-xs font-semibold bg-[#2c3e50] text-stone-100 transition';
      if (btnMobRight) btnMobRight.className = 'flex-1 py-2 rounded text-xs font-medium text-stone-700 hover:bg-stone-200 transition';
    } else {
      leftPane.classList.add('mobile-pane-hidden');
      rightPane.classList.remove('mobile-pane-hidden');
      if (btnMobRight) btnMobRight.className = 'flex-1 py-2 rounded text-xs font-semibold bg-[#2c3e50] text-stone-100 transition';
      if (btnMobLeft) btnMobLeft.className = 'flex-1 py-2 rounded text-xs font-medium text-stone-700 hover:bg-stone-200 transition';
    }
  }

  function renderBookSpreadView() {
    renderProgress();
    updateMobilePaneVisibility();

    const totalPages = appState.terms.length;
    if (totalPages === 0) return;
    if (appState.currentPageIdx >= totalPages) appState.currentPageIdx = totalPages - 1;
    if (appState.currentPageIdx < 0) appState.currentPageIdx = 0;

    const currentItem = appState.terms[appState.currentPageIdx];
    const currentChapter = window.CHAPTERS.find(c => Number(c.id) === Number(currentItem.chapter)) || window.CHAPTERS[0];
    appState.selectedChapter = currentChapter.id;

    // 상단 파트 점프 버튼 바
    const partBar = document.getElementById('chapterCardsContainer');
    if (partBar) {
      partBar.innerHTML = '';
      window.CHAPTERS.forEach(ch => {
        const isCurrentPart = Number(ch.id) === Number(currentItem.chapter);
        const firstIdx = appState.terms.findIndex(t => Number(t.chapter) === Number(ch.id));
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'px-2.5 py-1 rounded text-xs font-semibold transition ' +
          (isCurrentPart
            ? 'bg-[#2c3e50] text-stone-100'
            : 'bg-[#faf8f3] text-stone-700 hover:bg-stone-200 border border-[#ccc4b4]');
        btn.textContent = ch.shortLabel;
        btn.addEventListener('click', () => {
          if (firstIdx >= 0) {
            appState.currentPageIdx = firstIdx;
            appState.currentProcessStep = 0;
            triggerPageFlipAnimation();
            renderBookSpreadView();
          }
        });
        partBar.appendChild(btn);
      });
    }

    // 페이지 바로가기 셀렉트 박스
    const selectEl = document.getElementById('pageJumpSelect');
    if (selectEl) {
      selectEl.innerHTML = '';
      appState.terms.forEach((t, idx) => {
        const opt = document.createElement('option');
        opt.value = String(idx);
        const sec = t.sectionCode || `${t.chapter}.${idx + 1}`;
        opt.textContent = `p.${String(idx + 1).padStart(2, '0')} [${sec}] ${t.term.slice(0, 24)}`;
        if (idx === appState.currentPageIdx) opt.selected = true;
        selectEl.appendChild(opt);
      });
    }

    // 왼쪽 페이지 헤더 및 메타 정보
    const pageNumStr = String(appState.currentPageIdx + 1).padStart(2, '0');
    const secCodeStr = currentItem.sectionCode || `${currentChapter.id}.1`;
    const diffMeta = getDifficultyMeta(currentItem.difficulty);
    const layerObj = window.ARCH_LAYERS.find(l => l.id === currentItem.layer) || window.ARCH_LAYERS[0];

    document.getElementById('leftPagePartHeader').textContent = `${currentChapter.badge} — ${currentChapter.title}`;
    document.getElementById('leftPageLayerBtn').textContent = `${currentItem.layer} · ${layerObj.name.replace(' 계층', '')}`;
    document.getElementById('leftPageSectionNum').textContent = `SECTION ${secCodeStr} · PAGE ${pageNumStr} OF ${String(totalPages).padStart(2, '0')}`;

    const diffBadgeEl = document.getElementById('leftPageDifficultyBadge');
    if (diffBadgeEl) {
      diffBadgeEl.className = `text-[11px] font-semibold px-2.5 py-0.5 rounded border ${diffMeta.colorClass}`;
      diffBadgeEl.textContent = diffMeta.label;
    }

    document.getElementById('leftPageTitle').textContent = currentItem.term;
    document.getElementById('leftPageAnalogy').textContent = currentItem.analogy;

    // 왼쪽 페이지: 단원별 개념 구조 애니메이션 도해 렌더링
    const leftDiagramBox = document.getElementById('leftPageConceptDiagramBox');
    if (leftDiagramBox) {
      leftDiagramBox.innerHTML = buildConceptAnimatedSvg(currentItem, appState.currentProcessStep);
    }

    // 수준별 깊이 학습 탭 렌더링
    renderLeftDepthContent(currentItem, layerObj);

    // 핵심 용어 미니 사전 (keyTerms) 렌더링
    const glossaryBox = document.getElementById('leftPageKeyTermsBox');
    const glossaryList = document.getElementById('leftPageKeyTermsList');
    if (glossaryBox && glossaryList) {
      const kTerms = currentItem.keyTerms || [];
      if (kTerms.length > 0) {
        glossaryBox.classList.remove('hidden');
        glossaryList.innerHTML = kTerms.map((kt, idx) => `
          <div class="bg-[#f3efe6] border border-[#dcd6c8] rounded-lg p-3">
            <div class="flex items-center gap-1.5">
              <span class="text-[10px] font-mono-code font-bold text-[#7c5e3c]">0${idx + 1}</span>
              <span class="text-xs font-bold text-[#2c3e50]">${escapeHtml(kt.term)}</span>
            </div>
            <div class="text-xs text-stone-700 mt-1 leading-relaxed">${escapeHtml(kt.desc)}</div>
          </div>
        `).join('');
      } else {
        glossaryBox.classList.add('hidden');
      }
    }

    // 추천 직군 배지 & 연계 도구 렌더링 (이모지 제거)
    const rolesContainer = document.getElementById('leftPageRolesContainer');
    if (rolesContainer) {
      rolesContainer.innerHTML = '';
      (currentItem.roles || ['pm', 'app-be']).forEach(rId => {
        const rMeta = getRoleMeta(rId);
        if (!rMeta) return;
        const badge = document.createElement('button');
        badge.type = 'button';
        badge.className = 'text-[11px] font-semibold px-2.5 py-1 rounded bg-[#f4f0e6] hover:bg-[#e6dfd1] text-[#7c5e3c] border border-[#d6cfc2] transition';
        badge.textContent = `[${rMeta.code}] ${rMeta.shortName} 트랙 →`;
        badge.addEventListener('click', () => {
          appState.selectedRole = rMeta.id;
          switchMainView('roles');
        });
        rolesContainer.appendChild(badge);
      });
    }

    const relatedContainer = document.getElementById('leftPageRelatedTools');
    if (relatedContainer) {
      relatedContainer.innerHTML = '';
      (currentItem.relatedTools || []).forEach(toolLabel => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'text-xs font-medium px-2.5 py-1 rounded bg-[#ebe6dc] hover:bg-[#dfd9cc] text-stone-800 border border-[#ccc4b4] transition';
        chip.textContent = toolLabel + ' →';
        chip.addEventListener('click', () => {
          const cleanName = toolLabel.split('(')[0].trim();
          document.getElementById('globalSearchInput').value = cleanName;
          appState.searchQuery = cleanName;
          document.getElementById('btnClearSearch').classList.remove('hidden');
          switchMainView('tools');
        });
        relatedContainer.appendChild(chip);
      });
    }

    // 하단 페이지 번호 및 상태 버튼
    document.getElementById('leftPageNumber').textContent = `p. ${pageNumStr} [${secCodeStr} 개념·도해편]`;
    document.getElementById('rightPageNumber').textContent = `p. ${pageNumStr} [${secCodeStr} 실습·퀴즈]`;

    const mobIndicator = document.getElementById('mobileDockPageIndicator');
    if (mobIndicator) {
      mobIndicator.textContent = `p.${pageNumStr} / ${String(totalPages).padStart(2, '0')} (${secCodeStr})`;
    }

    const isBookmarked = !!appState.bookmarkedIds[currentItem.id];
    const isLearned = !!appState.learnedIds[currentItem.id];

    const bmBtn = document.getElementById('btnToggleBookmark');
    if (bmBtn) {
      bmBtn.textContent = isBookmarked ? '[책갈피 설정됨]' : '책갈피 추가';
      bmBtn.className = 'px-3 py-1 rounded text-xs font-medium border transition ' +
        (isBookmarked ? 'bg-amber-900/15 border-amber-800/50 text-amber-950 font-semibold' : 'border-[#ccc4b4] bg-[#f3efe6] text-stone-700 hover:bg-stone-200');
    }

    const learnBtn = document.getElementById('btnToggleLearned');
    if (learnBtn) {
      learnBtn.textContent = isLearned ? '[완독 완료]' : '학습 완료 표시';
      learnBtn.className = 'px-3 py-1 rounded text-xs font-semibold border transition ' +
        (isLearned ? 'bg-stone-800 border-stone-800 text-stone-100' : 'border-[#2c3e50] bg-[#faf8f3] text-[#2c3e50] hover:bg-stone-200');
    }

    // 이전/다음 페이지 버튼
    const prevBtn = document.getElementById('btnPrevPage');
    const nextBtn = document.getElementById('btnNextPage');
    if (prevBtn) {
      prevBtn.disabled = appState.currentPageIdx === 0;
      prevBtn.className = 'px-3.5 py-1.5 rounded text-xs font-semibold border transition ' +
        (appState.currentPageIdx === 0 ? 'bg-stone-200 text-stone-400 border-stone-300 cursor-not-allowed' : 'bg-[#ebe6dc] hover:bg-[#dfd9cc] text-stone-800 border-[#ccc4b4]');
    }
    if (nextBtn) {
      nextBtn.textContent = appState.currentPageIdx === totalPages - 1 ? '서문·목차로 돌아가기' : '다음 페이지 →';
    }

    // 오른쪽 페이지 렌더링 (Visual / Code / Quiz)
    renderRightLabPage(currentItem);
  }

  function renderLeftDepthContent(item, layerObj) {
    document.querySelectorAll('.left-depth-tab').forEach(btn => {
      const tab = btn.getAttribute('data-depthtab');
      btn.className = tab === appState.leftDepthTab
        ? 'left-depth-tab px-2.5 py-1 rounded text-[11px] font-semibold bg-[#2c3e50] text-stone-100 transition'
        : 'left-depth-tab px-2.5 py-1 rounded text-[11px] font-medium bg-[#ebe6dc] text-stone-700 hover:bg-stone-300 transition';
    });

    const defEl = document.getElementById('leftPageDefinition');
    const noteEl = document.getElementById('leftPageDeepNote');
    const levels = item.levels || {};

    let mainText = item.definition;
    let subNote = item.deepNote || `실무 요약: 이 개념은 ${layerObj.name}에서 핵심적인 역할을 담당합니다.`;

    if (appState.leftDepthTab === 'beginner' && levels.beginner) {
      mainText = levels.beginner;
      subNote = item.studyGuide || item.deepNote || '';
    } else if (appState.leftDepthTab === 'intermediate' && levels.intermediate) {
      mainText = levels.intermediate;
      subNote = item.deepNote || '';
    } else if (appState.leftDepthTab === 'advanced' && levels.advanced) {
      mainText = levels.advanced;
      subNote = item.deepNote || '';
    } else if (appState.leftDepthTab === 'study') {
      mainText = item.studyGuide || '1단계(입문 개념 비유 이해) → 2단계(상단 그림 도해와 우측 애니메이션으로 데이터 흐름 파악) → 3단계(실습 코드 실행 및 퀴즈 풀이) 순서로 학습하세요.';
      subNote = levels.beginner ? `[핵심 요약] ${levels.beginner}` : (item.deepNote || '');
    }

    defEl.innerHTML = formatReadableHtml(mainText);
    noteEl.innerHTML = formatReadableHtml(subNote);
  }

  function triggerPageFlipAnimation() {
    const spread = document.getElementById('bookSpreadContainer');
    if (!spread) return;
    spread.classList.remove('page-turn-effect');
    void spread.offsetWidth;
    spread.classList.add('page-turn-effect');
  }

  // --------------------------------------------------------------------------
  // 8. 오른쪽 페이지: 단계별 애니메이션 플레이어 / 코딩 샌드박스 / 퀴즈
  // --------------------------------------------------------------------------
  function renderRightLabPage(item) {
    const visualPane = document.getElementById('rightPaneVisualPlayer');
    const codePane = document.getElementById('rightPaneCodeLab');
    const quizPane = document.getElementById('rightPaneQuizLab');
    const btnVisual = document.getElementById('btnLabModeVisual');
    const btnCode = document.getElementById('btnLabModeCode');
    const btnQuiz = document.getElementById('btnLabModeQuiz');

    [visualPane, codePane, quizPane].forEach(p => p && p.classList.add('hidden'));
    [btnVisual, btnCode, btnQuiz].forEach(b => {
      if (b) b.className = 'px-2.5 py-1 rounded text-xs font-medium text-stone-700 hover:bg-stone-300/60 transition';
    });

    if (appState.rightLabMode === 'code') {
      if (codePane) codePane.classList.remove('hidden');
      if (btnCode) btnCode.className = 'px-2.5 py-1 rounded text-xs font-semibold bg-[#2c3e50] text-stone-100 transition';
    } else if (appState.rightLabMode === 'quiz') {
      if (quizPane) quizPane.classList.remove('hidden');
      if (btnQuiz) btnQuiz.className = 'px-2.5 py-1 rounded text-xs font-semibold bg-[#2c3e50] text-stone-100 transition';
    } else {
      if (visualPane) visualPane.classList.remove('hidden');
      if (btnVisual) btnVisual.className = 'px-2.5 py-1 rounded text-xs font-semibold bg-[#2c3e50] text-stone-100 transition';
    }

    // 1) 시각 과정 플레이어 설정
    const steps = item.processSteps || [
      { title: '1단계: 개념 정의 및 입력', desc: '입력 데이터와 도메인 규칙이 시스템으로 전달됩니다.', nodes: ['데이터 유입', '전처리', '컨텍스트 구성', '준비 완료'] },
      { title: '2단계: 핵심 아키텍처 작동', desc: item.term + ' 핵심 메커니즘이 작동합니다.', nodes: ['핵심 연산 가동', '파라미터/규칙 활성화', '최적화 수행', '중간 검증'] },
      { title: '3단계: 도구 및 메모리 연동', desc: '연계된 프로그램(' + ((item.relatedTools || [])[0] || '도구') + ')과 상호작용합니다.', nodes: ['외부 도구 연결', '상태 업데이트', '오류 보정', '출력 생성'] },
      { title: '4단계: 최종 결과 반환', desc: '처리가 완료되어 사용자에게 검증된 결과가 전달됩니다.', nodes: ['결과 검증 완료', '비용/속도 최적화', '로그 기록', '응답 반환'] }
    ];

    if (appState.currentProcessStep >= steps.length) appState.currentProcessStep = 0;
    const activeStep = steps[appState.currentProcessStep];

    document.getElementById('visualDiagramTitle').textContent = item.term.split('(')[0].trim() + ' — 단계별 작동 시뮬레이션';

    const stepTabsEl = document.getElementById('processStepTabs');
    if (stepTabsEl) {
      stepTabsEl.innerHTML = '';
      steps.forEach((st, idx) => {
        const isCurrent = idx === appState.currentProcessStep;
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'text-left p-2 rounded border transition ' +
          (isCurrent
            ? 'bg-[#2c3e50] text-stone-100 border-[#2c3e50]'
            : 'bg-[#faf8f3] text-stone-700 border-[#ccc4b4] hover:bg-stone-200/70');
        b.innerHTML = `
          <div class="text-[10px] font-mono-code opacity-80">STEP 0${idx + 1}</div>
          <div class="text-xs font-semibold truncate mt-0.5">${escapeHtml(st.title.replace(/^\d단계:\s*/, ''))}</div>
        `;
        b.addEventListener('click', () => {
          stopProcessTimer();
          appState.currentProcessStep = idx;
          const leftDiag = document.getElementById('leftPageConceptDiagramBox');
          if (leftDiag) leftDiag.innerHTML = buildConceptAnimatedSvg(item, idx);
          renderRightLabPage(item);
        });
        stepTabsEl.appendChild(b);
      });
    }

    const stageEl = document.getElementById('visualStageBox');
    if (stageEl) {
      const nodes = activeStep.nodes || [];
      stageEl.innerHTML = `
        <div class="w-full space-y-4">
          <div class="flex items-center justify-between text-[11px] text-stone-500 border-b border-[#e2ddd3] pb-2">
            <span class="font-mono-code font-semibold text-[#2c3e50]">STAGE 0${appState.currentProcessStep + 1} SCHEMATIC &amp; PIPELINE</span>
            <span>${escapeHtml(activeStep.title)}</span>
          </div>

          <!-- 단계 연동 SVG 애니메이션 도해 -->
          <div class="bg-[#f3efe6] border border-[#dcd6c8] rounded-lg p-2.5 overflow-x-auto">
            ${buildConceptAnimatedSvg(item, appState.currentProcessStep)}
          </div>

          <!-- 4개 세부 노드 상태 카드 -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-0.5">
            ${nodes.map((nodeText, nIdx) => `
              <div class="relative p-2.5 rounded-lg border ${nIdx === appState.currentProcessStep ? 'bg-[#2c3e50] text-stone-100 border-[#2c3e50] shadow-md' : 'bg-[#f3efe6] text-stone-800 border-[#ccc4b4]'} flex flex-col justify-between min-h-[72px] transition-all duration-300">
                <div class="flex items-center justify-between text-[10px] font-mono-code ${nIdx === appState.currentProcessStep ? 'text-amber-300' : 'text-stone-500'}">
                  <span>NODE 0${nIdx + 1}</span>
                  <span>${nIdx <= appState.currentProcessStep ? 'ACTIVE' : 'WAIT'}</span>
                </div>
                <div class="text-xs font-semibold leading-snug mt-1">${escapeHtml(nodeText)}</div>
              </div>
            `).join('')}
          </div>

          <div class="pt-1">
            <div class="w-full h-2 bg-[#e2ddd3] rounded-full overflow-hidden">
              <div class="h-full bg-[#7c5e3c] transition-all duration-500" style="width: ${((appState.currentProcessStep + 1) / steps.length) * 100}%"></div>
            </div>
            <div class="flex justify-between text-[10px] font-mono-code text-stone-500 mt-1">
              <span>INPUT SIGNAL</span>
              <span>PROGRESS (${Math.round(((appState.currentProcessStep + 1) / steps.length) * 100)}%)</span>
              <span>VERIFIED OUTPUT</span>
            </div>
          </div>
        </div>
      `;
    }

    document.getElementById('processStepBadge').textContent = `STEP 0${appState.currentProcessStep + 1} / 0${steps.length} · ${activeStep.title}`;
    document.getElementById('processStepStatus').textContent = appState.processInterval ? '자동 재생 중...' : '단계를 클릭하거나 [과정 자동 재생]을 누르세요';
    document.getElementById('processStepCaption').textContent = activeStep.desc;

    // 2) 코딩 샌드박스 설정
    const lab = item.labConfig || {
      paramLabel: '실습 입력 프롬프트 설정',
      paramType: 'text',
      defaultParam: item.term + ' 테스트 실행',
      codeLang: 'Python / CLI 실습 예제',
      starterCode: `# ${item.term} 실습 코드\nprint("Testing ${item.term}...")`,
      runOutput: `[실행 완료]\n${item.term} 검증이 정상적으로 완료되었습니다.`
    };

    document.getElementById('codeEditorLangLabel').textContent = lab.codeLang;
    const paramBox = document.getElementById('interactiveParamBox');
    if (paramBox) {
      if (lab.paramType === 'select' && lab.options) {
        paramBox.innerHTML = `
          <label class="block text-xs font-semibold text-stone-700">${escapeHtml(lab.paramLabel)}</label>
          <select id="labDynamicParam" class="w-full bg-white border border-[#ccc4b4] rounded px-3 py-1.5 text-xs text-stone-900 focus:outline-none">
            ${lab.options.map(opt => `<option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`).join('')}
          </select>
        `;
      } else {
        paramBox.innerHTML = `
          <label class="block text-xs font-semibold text-stone-700">${escapeHtml(lab.paramLabel)}</label>
          <input id="labDynamicParam" type="text" value="${escapeHtml(lab.defaultParam)}" class="w-full bg-white border border-[#ccc4b4] rounded px-3 py-1.5 text-xs text-stone-900 focus:outline-none">
        `;
      }
    }

    const codeEditor = document.getElementById('labCodeEditor');
    const consoleOut = document.getElementById('labConsoleOutput');
    if (codeEditor && consoleOut && codeEditor.getAttribute('data-loaded-id') !== item.id) {
      codeEditor.value = lab.starterCode;
      codeEditor.setAttribute('data-loaded-id', item.id);
      consoleOut.textContent = lab.runOutput;
      document.getElementById('labRunStatus').textContent = 'Ready';
    }

    const paramInput = document.getElementById('labDynamicParam');
    if (paramInput) {
      paramInput.addEventListener('change', () => {
        const val = paramInput.value;
        consoleOut.textContent = `[파라미터 변경 감지: "${val}"]\n우측 상단 [실행해보기 (Run)] 버튼을 누르면 변경된 설정으로 시뮬레이션 결과가 갱신됩니다.`;
        document.getElementById('labRunStatus').textContent = 'Modified';
      });
    }

    // 3) 이해도 점검 문제 풀이 (Quiz) 및 개인 학습 노트 설정
    renderQuizAndNotesBox(item);
  }

  function renderQuizAndNotesBox(item) {
    const quizContainer = document.getElementById('quizInteractiveContainer');
    if (!quizContainer) return;

    const quiz = item.quiz || {
      question: `"${item.term}" 개념의 핵심 의의로 가장 적절한 것은 무엇인가요?`,
      options: [
        item.analogy,
        '하드웨어 모니터의 밝기를 조절하는 기능이다.',
        '네트워크 케이블의 물리적 길이를 측정하는 도구이다.',
        '오직 1970년대 메인프레임에서만 작동하는 명령어이다.'
      ],
      answerIndex: 0,
      explanation: item.deepNote || item.definition
    };

    const isPassed = !!appState.quizPassedIds[item.id];
    const savedNote = appState.userNotes[item.id] || '';

    quizContainer.innerHTML = `
      <div class="bg-[#faf8f3] border border-[#d6cfc2] rounded-lg p-4 space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-mono-code font-bold text-[#7c5e3c]">CONCEPT CHECK QUIZ</span>
          <span id="quizStatusBadge" class="text-[11px] font-semibold px-2 py-0.5 rounded ${isPassed ? 'bg-emerald-800 text-stone-100' : 'bg-[#ebe6dc] text-stone-700'}">
            ${isPassed ? '[정답 통과 완료]' : '보기를 선택해 문제를 풀어보세요'}
          </span>
        </div>
        <p class="text-xs sm:text-sm font-serif-book font-bold text-stone-900 leading-relaxed">Q. ${escapeHtml(quiz.question)}</p>
        <div class="space-y-2 pt-1" id="quizOptionsList">
          ${quiz.options.map((opt, oIdx) => `
            <button type="button" data-opt-idx="${oIdx}" class="quiz-opt-btn w-full text-left p-2.5 rounded-lg border border-[#ccc4b4] bg-white hover:bg-[#f3efe6] text-xs text-stone-800 transition flex items-start gap-2">
              <span class="font-mono-code font-bold text-[#7c5e3c] shrink-0">0${oIdx + 1}.</span>
              <span class="leading-relaxed">${escapeHtml(opt)}</span>
            </button>
          `).join('')}
        </div>
        <div id="quizFeedbackBox" class="${isPassed ? '' : 'hidden'} p-3 rounded-lg bg-[#f3efe6] border border-[#dcd6c8] text-xs text-stone-800 leading-relaxed">
          <strong class="text-[#2c3e50]">정답 해설:</strong> ${escapeHtml(quiz.explanation)}
        </div>
      </div>

      <!-- 나만의 학습 노트 기록장 (웹/모바일 즉시 저장) -->
      <div class="bg-[#faf8f3] border border-[#d6cfc2] rounded-lg p-3.5 space-y-2">
        <div class="flex items-center justify-between">
          <label for="userPersonalNoteInput" class="text-xs font-bold text-stone-800">나의 Learning Log 메모 및 질문 기록</label>
          <button type="button" id="btnSavePersonalNote" class="px-2.5 py-1 rounded text-[11px] font-semibold bg-[#2c3e50] text-stone-100 hover:bg-[#1e2b38] transition">
            메모 저장
          </button>
        </div>
        <textarea id="userPersonalNoteInput" rows="2" placeholder="이 단원을 공부하며 깨달은 점이나 내 실무 프로젝트 적용 아이디어를 적어두세요..." class="w-full bg-white border border-[#ccc4b4] rounded p-2 text-xs text-stone-800 focus:outline-none focus:border-[#2c3e50]">${escapeHtml(savedNote)}</textarea>
      </div>
    `;

    quizContainer.querySelectorAll('.quiz-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const chosen = parseInt(btn.getAttribute('data-opt-idx'), 10);
        const fb = document.getElementById('quizFeedbackBox');
        const badge = document.getElementById('quizStatusBadge');

        quizContainer.querySelectorAll('.quiz-opt-btn').forEach((b, idx) => {
          if (idx === quiz.answerIndex) {
            b.className = 'quiz-opt-btn w-full text-left p-2.5 rounded-lg border-2 border-emerald-700 bg-emerald-50 text-xs font-semibold text-emerald-950 flex items-start gap-2';
          } else if (idx === chosen && chosen !== quiz.answerIndex) {
            b.className = 'quiz-opt-btn w-full text-left p-2.5 rounded-lg border-2 border-rose-700 bg-rose-50 text-xs text-rose-950 flex items-start gap-2';
          } else {
            b.className = 'quiz-opt-btn w-full text-left p-2.5 rounded-lg border border-[#ccc4b4] bg-white opacity-70 text-xs text-stone-700 flex items-start gap-2';
          }
        });

        if (fb) fb.classList.remove('hidden');

        if (chosen === quiz.answerIndex) {
          appState.quizPassedIds[item.id] = true;
          appState.learnedIds[item.id] = true;
          saveProgressState();
          renderProgress();
          if (badge) {
            badge.textContent = '[정답 확인 · 완독 및 퀴즈 통과 기록됨]';
            badge.className = 'text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-800 text-stone-100';
          }
          showToast('정답입니다. 해당 단원이 완독 및 퀴즈 통과 처리되었습니다.');
        } else {
          if (badge) {
            badge.textContent = '오답입니다. 아래 정답 해설을 확인해 보세요.';
            badge.className = 'text-[11px] font-semibold px-2 py-0.5 rounded bg-rose-800 text-stone-100';
          }
        }
      });
    });

    const saveNoteBtn = document.getElementById('btnSavePersonalNote');
    if (saveNoteBtn) {
      saveNoteBtn.addEventListener('click', () => {
        const val = document.getElementById('userPersonalNoteInput').value.trim();
        appState.userNotes[item.id] = val;
        saveProgressState();
        showToast('개인 학습 메모가 브라우저에 저장되었습니다.');
      });
    }
  }

  // --------------------------------------------------------------------------
  // 9. VIEW 2: 직업군별(6대 직군) 맞춤 기술·개념·용어 로드맵 뷰
  // --------------------------------------------------------------------------
  function renderRolesView() {
    const listEl = document.getElementById('jobRolesList');
    const detailEl = document.getElementById('jobRoleDetail');
    if (!listEl || !detailEl) return;

    listEl.innerHTML = '';
    (window.JOB_ROLES || []).forEach(role => {
      const isSelected = appState.selectedRole === role.id;
      const roleTerms = appState.terms.filter(t => (t.roles || []).includes(role.id));
      const learnedInRole = roleTerms.filter(t => appState.learnedIds[t.id]).length;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'w-full text-left rounded-lg p-4 border transition-all ' +
        (isSelected ? 'layer-active' : 'bg-[#faf8f3] border-[#dcd6c8] hover:bg-[#f3efe6]');
      btn.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="text-xs font-mono-code font-bold text-[#7c5e3c]">${escapeHtml(role.code)} · ${escapeHtml(role.shortName)}</span>
          <span class="text-[11px] font-mono-code px-2 py-0.5 rounded bg-[#ebe6dc] text-stone-700">필수 단원 ${learnedInRole}/${roleTerms.length}</span>
        </div>
        <h3 class="text-sm sm:text-base font-serif-book font-bold text-stone-900 mt-1">${escapeHtml(role.name)}</h3>
        <p class="text-xs text-stone-600 mt-1 line-clamp-2">${escapeHtml(role.tagline)}</p>
      `;
      btn.addEventListener('click', () => {
        appState.selectedRole = role.id;
        renderRolesView();
      });
      listEl.appendChild(btn);
    });

    const activeRole = (window.JOB_ROLES || []).find(r => r.id === appState.selectedRole) || window.JOB_ROLES[0];
    if (!activeRole) return;

    const roleTerms = appState.terms.filter(t => (t.roles || []).includes(activeRole.id));

    const roadmapHtml = (activeRole.studyRoadmap || []).map(rm => `
      <div class="bg-[#faf8f3] border border-[#dcd6c8] rounded-lg p-3 flex flex-col sm:flex-row sm:items-center gap-2">
        <span class="text-xs font-mono-code font-bold text-[#7c5e3c] shrink-0 sm:w-28">${escapeHtml(rm.step)}</span>
        <span class="text-xs text-stone-800 leading-relaxed">${escapeHtml(rm.focus)}</span>
      </div>
    `).join('');

    const keyTermsHtml = (activeRole.keyTerms || []).map(kt => `
      <button type="button" data-role-term="${escapeHtml(kt)}" class="btn-role-term-search text-xs font-medium px-2.5 py-1 rounded bg-[#faf8f3] hover:bg-[#2c3e50] hover:text-stone-100 text-stone-800 border border-[#ccc4b4] transition">
        ${escapeHtml(kt)} →
      </button>
    `).join('');

    const matchedCardsHtml = roleTerms.map(t => {
      const pageIdx = appState.terms.findIndex(x => x.id === t.id);
      const pStr = String(pageIdx + 1).padStart(2, '0');
      const diffMeta = getDifficultyMeta(t.difficulty);
      const isLearned = !!appState.learnedIds[t.id];
      return `
        <div class="bg-[#faf8f3] border border-[#dcd6c8] rounded-lg p-3.5 space-y-1.5 flex flex-col justify-between">
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <div class="flex items-center gap-1.5">
              <span class="text-[11px] font-mono-code font-bold text-[#7c5e3c]">[${escapeHtml(t.sectionCode || '')}]</span>
              <span class="text-[10px] px-1.5 py-0.2 rounded border ${diffMeta.colorClass}">${diffMeta.badge}</span>
              ${isLearned ? '<span class="text-[10px] px-1.5 py-0.2 rounded bg-stone-800 text-stone-100">완독</span>' : ''}
            </div>
            <button type="button" data-open-page="${pageIdx}" class="btn-role-open-page text-xs font-semibold text-[#2c3e50] hover:underline shrink-0">
              p.${pStr} 본문 학습 →
            </button>
          </div>
          <h4 class="text-sm font-serif-book font-bold text-stone-900">${escapeHtml(t.term)}</h4>
          <p class="text-xs text-stone-600 line-clamp-2">${escapeHtml(t.analogy)}</p>
        </div>
      `;
    }).join('');

    detailEl.innerHTML = `
      <div class="border-b border-[#dcd6c8] pb-3">
        <span class="text-xs font-mono-code font-bold text-[#7c5e3c]">${escapeHtml(activeRole.code)} · ROLE-BASED LEARNING TRACK</span>
        <h3 class="text-lg sm:text-xl font-serif-book font-bold text-stone-900 mt-1">${escapeHtml(activeRole.name)}</h3>
        <p class="text-xs sm:text-sm text-stone-700 mt-1.5 leading-relaxed">${escapeHtml(activeRole.summary)}</p>
      </div>

      <div>
        <h4 class="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">단계별 추천 커리큘럼 (입문 → 심화)</h4>
        <div class="space-y-2">
          ${roadmapHtml}
        </div>
      </div>

      <div>
        <h4 class="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">이 직군의 필수 숙지 개념 · 용어 (클릭 시 검색)</h4>
        <div class="flex flex-wrap gap-1.5">
          ${keyTermsHtml}
        </div>
      </div>

      <div>
        <h4 class="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">이 직군이 반드시 읽어야 할 본문 단원 (${roleTerms.length}개)</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto custom-scrollbar pr-1">
          ${matchedCardsHtml}
        </div>
      </div>
    `;

    detailEl.querySelectorAll('.btn-role-open-page').forEach(btn => {
      btn.addEventListener('click', () => {
        const pIdx = parseInt(btn.getAttribute('data-open-page'), 10) || 0;
        openBookAtPage(pIdx);
      });
    });

    detailEl.querySelectorAll('.btn-role-term-search').forEach(btn => {
      btn.addEventListener('click', () => {
        const kw = btn.getAttribute('data-role-term').split('(')[0].trim();
        document.getElementById('globalSearchInput').value = kw;
        appState.searchQuery = kw;
        document.getElementById('btnClearSearch').classList.remove('hidden');
        switchMainView('indexgrid');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 10. VIEW 3: 5계층 아키텍처 뷰 (상호작용 SVG 스택 도해 포함)
  // --------------------------------------------------------------------------
  function renderArchitectureView() {
    const listEl = document.getElementById('archLayersList');
    const detailEl = document.getElementById('archLayerDetail');
    if (!listEl || !detailEl) return;
    listEl.innerHTML = '';

    window.ARCH_LAYERS.forEach(layer => {
      const isSelected = appState.selectedArchLayer === layer.id;
      const countInLayer = appState.terms.filter(t => t.layer === layer.id).length;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'w-full text-left rounded-lg p-4 border transition-all ' +
        (isSelected ? 'layer-active' : 'bg-[#faf8f3] border-[#dcd6c8] hover:bg-[#f3efe6]');
      btn.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-mono-code font-bold text-[#7c5e3c]">${escapeHtml(layer.order)}</span>
          <span class="text-[11px] font-medium px-2 py-0.5 rounded bg-[#ebe6dc] text-stone-700">수록 단원 ${countInLayer}개</span>
        </div>
        <h3 class="text-sm sm:text-base font-serif-book font-bold text-stone-900 mt-1">${escapeHtml(layer.name)}</h3>
        <p class="text-xs text-stone-600 mt-1 line-clamp-2">${escapeHtml(layer.summary)}</p>
      `;
      btn.addEventListener('click', () => {
        appState.selectedArchLayer = layer.id;
        renderArchitectureView();
      });
      listEl.appendChild(btn);
    });

    const activeLayer = window.ARCH_LAYERS.find(l => l.id === appState.selectedArchLayer) || window.ARCH_LAYERS[0];
    const layerTerms = appState.terms.filter(t => t.layer === activeLayer.id);

    const programsHtml = activeLayer.keyPrograms.map(p =>
      `<span class="text-xs font-medium px-3 py-1 rounded bg-[#faf8f3] text-stone-800 border border-[#ccc4b4]">${escapeHtml(p)}</span>`
    ).join('');

    const termsHtml = layerTerms.map(t => {
      const pageIdx = appState.terms.findIndex(x => x.id === t.id);
      const pStr = String(pageIdx + 1).padStart(2, '0');
      return `
        <div class="bg-[#faf8f3] border border-[#dcd6c8] rounded-lg p-3.5 space-y-1.5 flex flex-col justify-between">
          <div class="flex items-center justify-between gap-2">
            <h4 class="text-sm font-serif-book font-bold text-stone-900">[${escapeHtml(t.sectionCode || '')}] ${escapeHtml(t.term)}</h4>
            <button type="button" data-open-page="${pageIdx}" class="btn-arch-open-page text-xs font-semibold text-[#2c3e50] hover:underline shrink-0">
              p.${pStr} 본문 펼치기 →
            </button>
          </div>
          <p class="text-xs text-[#7c5e3c] font-medium">비유: ${escapeHtml(t.analogy)}</p>
          <p class="text-xs text-stone-600">${escapeHtml(t.definition)}</p>
        </div>
      `;
    }).join('');

    detailEl.innerHTML = `
      <div class="border-b border-[#dcd6c8] pb-3">
        <span class="text-xs font-mono-code font-bold text-[#7c5e3c]">${escapeHtml(activeLayer.order)}</span>
        <h3 class="text-lg sm:text-xl font-serif-book font-bold text-stone-900 mt-1">${escapeHtml(activeLayer.name)}</h3>
        <p class="text-xs sm:text-sm text-stone-700 mt-1.5 leading-relaxed">${escapeHtml(activeLayer.summary)}</p>
      </div>
      <div class="bg-[#faf8f3] border-l-4 border-[#2c3e50] p-3.5 rounded-r-lg">
        <div class="text-xs font-bold text-stone-800 mb-1">핵심 엔지니어링 포인트</div>
        <p class="text-xs sm:text-sm text-stone-700 leading-relaxed">${escapeHtml(activeLayer.whyItMatters)}</p>
      </div>
      <div>
        <h4 class="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">대표 프로그램 · 모델 · 프로토콜</h4>
        <div class="flex flex-wrap gap-1.5">${programsHtml}</div>
      </div>
      <div>
        <h4 class="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">이 계층에 속하는 본문 단원 (${layerTerms.length}개)</h4>
        <div class="space-y-2.5 max-h-[340px] overflow-y-auto custom-scrollbar pr-1">${termsHtml}</div>
      </div>
    `;

    detailEl.querySelectorAll('.btn-arch-open-page').forEach(btn => {
      btn.addEventListener('click', () => {
        const pIdx = parseInt(btn.getAttribute('data-open-page'), 10) || 0;
        openBookAtPage(pIdx);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 11. VIEW 4 & 5: 실전 도구 디렉터리 및 플레이북 레시피
  // --------------------------------------------------------------------------
  function renderToolsView() {
    const grid = document.getElementById('toolsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const q = appState.searchQuery.trim().toLowerCase();
    const filtered = window.TOOLS_DATA.filter(tool => {
      if (appState.selectedToolCat !== 'all' && tool.category !== appState.selectedToolCat) return false;
      if (q) {
        const hay = (tool.name + ' ' + tool.org + ' ' + tool.summary + ' ' + tool.relatedTerms.join(' ')).toLowerCase();
        return hay.includes(q);
      }
      return true;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full bg-[#f3efe6] border border-[#dcd6c8] rounded-xl p-8 text-center space-y-3">
          <p class="text-sm font-semibold text-stone-700">검색 조건에 해당하는 도구가 없습니다.</p>
          <button id="btnResetToolSearch" type="button" class="px-3 py-1.5 rounded text-xs font-semibold bg-[#2c3e50] text-stone-100">전체 도구 목록 보기</button>
        </div>
      `;
      const resetBtn = document.getElementById('btnResetToolSearch');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          appState.searchQuery = '';
          appState.selectedToolCat = 'all';
          document.getElementById('globalSearchInput').value = '';
          document.getElementById('btnClearSearch').classList.add('hidden');
          updateToolCatButtonsUI();
          renderToolsView();
        });
      }
      return;
    }

    filtered.forEach(tool => {
      const stepsHtml = tool.usageSteps.map((s, idx) =>
        `<li class="text-xs text-stone-700 flex items-start gap-2"><span class="font-mono-code font-bold text-[#7c5e3c] shrink-0">0${idx + 1}.</span><span>${escapeHtml(s)}</span></li>`
      ).join('');

      const card = document.createElement('div');
      card.className = 'bg-[#f3efe6] border border-[#dcd6c8] rounded-xl p-5 flex flex-col justify-between space-y-4';
      card.innerHTML = `
        <div class="space-y-3">
          <div class="flex items-center justify-between gap-2">
            <span class="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-[#ebe6dc] text-stone-800 border border-[#ccc4b4]">${escapeHtml(tool.catLabel)}</span>
            <span class="text-[11px] font-mono-code text-stone-500">${escapeHtml(tool.layer)} 계층 · Part ${tool.chapter}</span>
          </div>
          <div>
            <div class="flex items-baseline gap-2">
              <h3 class="text-base sm:text-lg font-serif-book font-bold text-stone-900">${escapeHtml(tool.name)}</h3>
              <span class="text-xs text-stone-500">by ${escapeHtml(tool.org)}</span>
            </div>
            <p class="text-xs sm:text-sm text-stone-700 mt-1.5 leading-relaxed">${escapeHtml(tool.summary)}</p>
          </div>
          <div class="bg-[#1c1917] rounded-lg p-3 flex items-center justify-between gap-2">
            <code class="text-[11px] sm:text-xs font-mono-code text-stone-200 overflow-x-auto custom-scrollbar whitespace-nowrap">${escapeHtml(tool.installCmd)}</code>
            <button type="button" data-copy-cmd="${escapeHtml(tool.installCmd)}" class="btn-copy-cmd shrink-0 text-[11px] font-medium px-2.5 py-1 rounded bg-stone-700 hover:bg-stone-600 text-stone-100">복사</button>
          </div>
          <div class="space-y-1.5">
            <div class="text-[11px] font-bold uppercase tracking-wider text-stone-500">3단계 실전 사용 절차</div>
            <ul class="space-y-1.5">${stepsHtml}</ul>
          </div>
        </div>
        <div class="pt-3 border-t border-[#dcd6c8] flex items-center justify-between gap-2 flex-wrap">
          <div class="flex flex-wrap gap-1">
            ${tool.relatedTerms.map(rt => `<span class="text-[11px] px-2 py-0.5 rounded bg-[#faf8f3] text-stone-600 border border-[#dcd6c8]">${escapeHtml(rt)}</span>`).join('')}
          </div>
          <a href="${escapeHtml(tool.url)}" target="_blank" rel="noopener noreferrer" class="text-xs font-semibold text-[#2c3e50] hover:underline">공식 문서 →</a>
        </div>
      `;
      grid.appendChild(card);
    });

    grid.querySelectorAll('.btn-copy-cmd').forEach(btn => {
      btn.addEventListener('click', () => {
        copyTextSafe(btn.getAttribute('data-copy-cmd'), '설치 명령어가 복사되었습니다.');
      });
    });
  }

  function updateToolCatButtonsUI() {
    document.querySelectorAll('.tool-cat-btn').forEach(btn => {
      const c = btn.getAttribute('data-toolcat');
      btn.className = c === appState.selectedToolCat
        ? 'tool-cat-btn px-3 py-1 rounded text-xs font-semibold bg-[#2c3e50] text-stone-100'
        : 'tool-cat-btn px-3 py-1 rounded text-xs font-medium bg-[#ebe6dc] text-stone-700 hover:bg-stone-300';
    });
  }

  function renderPlaybookView() {
    const grid = document.getElementById('playbookGrid');
    if (!grid) return;
    grid.innerHTML = '';

    window.PLAYBOOK_RECIPES.forEach(recipe => {
      const stackHtml = recipe.stack.map(s => `
        <div class="flex items-center justify-between bg-[#faf8f3] border border-[#dcd6c8] rounded px-3 py-2 text-xs">
          <span class="font-medium text-stone-500">${escapeHtml(s.role)}</span>
          <span class="font-semibold text-stone-900">${escapeHtml(s.item)}</span>
        </div>
      `).join('');

      const card = document.createElement('div');
      card.className = 'bg-[#f3efe6] border border-[#dcd6c8] rounded-xl p-5 space-y-4 flex flex-col justify-between';
      card.innerHTML = `
        <div class="space-y-3">
          <div>
            <span class="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-[#ebe6dc] text-[#7c5e3c] border border-[#ccc4b4]">${escapeHtml(recipe.target)}</span>
          </div>
          <h3 class="text-base sm:text-lg font-serif-book font-bold text-stone-900">${escapeHtml(recipe.title)}</h3>
          <p class="text-xs sm:text-sm text-stone-700">${escapeHtml(recipe.goal)}</p>
          <div class="space-y-2 pt-1">${stackHtml}</div>
        </div>
        <div class="bg-[#faf8f3] border-l-4 border-[#7c5e3c] p-3 text-xs text-stone-700 leading-relaxed">
          <strong class="text-stone-900">실무 조언:</strong> ${escapeHtml(recipe.tip)}
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // --------------------------------------------------------------------------
  // 12. VIEW 6: 전체 수록 용어 · 개념 색인표
  // --------------------------------------------------------------------------
  function renderIndexGridView() {
    const grid = document.getElementById('ebookItemsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const q = appState.searchQuery.trim().toLowerCase();
    appState.terms.forEach((item, idx) => {
      if (appState.indexFilterPart !== 'all' && String(item.chapter) !== String(appState.indexFilterPart)) return;
      if (appState.indexFilterDiff !== 'all' && item.difficulty !== appState.indexFilterDiff) return;

      if (q) {
        const kTermsStr = (item.keyTerms || []).map(k => k.term + ' ' + k.desc).join(' ');
        const hay = (item.term + ' ' + item.analogy + ' ' + item.definition + ' ' + kTermsStr + ' ' + (item.relatedTools || []).join(' ')).toLowerCase();
        if (!hay.includes(q)) return;
      }

      const ch = window.CHAPTERS.find(c => Number(c.id) === Number(item.chapter)) || window.CHAPTERS[0];
      const diffMeta = getDifficultyMeta(item.difficulty);
      const pStr = String(idx + 1).padStart(2, '0');
      const secStr = item.sectionCode || `${ch.id}.${idx + 1}`;

      const card = document.createElement('div');
      card.className = 'bg-[#f3efe6] hover:bg-[#ebe5d8] border border-[#dcd6c8] rounded-xl p-4 flex flex-col justify-between cursor-pointer transition';
      card.innerHTML = `
        <div class="space-y-2">
          <div class="flex items-center justify-between text-[11px] text-stone-500">
            <div class="flex items-center gap-1.5">
              <span class="font-mono-code font-bold text-[#7c5e3c]">[${escapeHtml(secStr)}]</span>
              <span class="font-semibold text-stone-700">${escapeHtml(ch.shortLabel)}</span>
              <span class="text-[10px] px-1.5 py-0.2 rounded border ${diffMeta.colorClass}">${diffMeta.badge}</span>
            </div>
            <span class="font-serif-book font-bold text-stone-700">p. ${pStr}</span>
          </div>
          <h3 class="text-sm sm:text-base font-serif-book font-bold text-stone-900">${escapeHtml(item.term)}</h3>
          <p class="text-xs text-stone-700 line-clamp-2">${escapeHtml(item.analogy)}</p>
        </div>
        <div class="mt-3 pt-2 border-t border-[#dcd6c8] flex items-center justify-between text-xs font-semibold text-[#2c3e50]">
          <span>본문 · 그림 도해 · 실습 펼치기</span>
          <span>→</span>
        </div>
      `;
      card.addEventListener('click', () => {
        openBookAtPage(idx);
      });
      grid.appendChild(card);
    });
  }

  // --------------------------------------------------------------------------
  // 13. 메인 뷰 전환
  // --------------------------------------------------------------------------
  function switchMainView(viewName) {
    stopProcessTimer();
    appState.currentView = viewName;
    ['toc', 'ebook', 'roles', 'architecture', 'tools', 'playbook', 'indexgrid'].forEach(v => {
      const sec = document.getElementById('view-' + v);
      if (!sec) return;
      if (v === viewName) sec.classList.remove('hidden');
      else sec.classList.add('hidden');
    });

    document.querySelectorAll('.nav-tab').forEach(tab => {
      const v = tab.getAttribute('data-view');
      tab.className = v === viewName
        ? 'nav-tab px-3 py-1 rounded text-xs font-semibold transition bg-[#2c3e50] text-stone-100 whitespace-nowrap'
        : 'nav-tab px-3 py-1 rounded text-xs font-medium transition text-stone-600 hover:bg-stone-200/70 whitespace-nowrap';
    });

    if (viewName === 'toc') renderTocView();
    if (viewName === 'ebook') renderBookSpreadView();
    if (viewName === 'roles') renderRolesView();
    if (viewName === 'architecture') renderArchitectureView();
    if (viewName === 'tools') renderToolsView();
    if (viewName === 'playbook') renderPlaybookView();
    if (viewName === 'indexgrid') renderIndexGridView();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --------------------------------------------------------------------------
  // 14. 스마트 목차 끼워넣기 모달 & Git 원고 내보내기 빌더
  // --------------------------------------------------------------------------
  function populateAddModalPositionSelect() {
    const chVal = parseInt(document.getElementById('inputChapter').value, 10) || 3;
    const posSelect = document.getElementById('inputInsertPosition');
    const codeInput = document.getElementById('inputSectionCode');
    if (!posSelect || !codeInput) return;

    const chTerms = appState.terms.filter(t => Number(t.chapter) === chVal);
    posSelect.innerHTML = '';

    const optEnd = document.createElement('option');
    optEnd.value = '__END__';
    optEnd.textContent = `Part ${chVal}의 맨 마지막 단원으로 추가 (권장)`;
    posSelect.appendChild(optEnd);

    chTerms.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = `[${t.sectionCode}] ${t.term.slice(0, 28)} 바로 뒤에 끼워넣기`;
      posSelect.appendChild(opt);
    });

    const optStart = document.createElement('option');
    optStart.value = '__START__';
    optStart.textContent = `Part ${chVal}의 맨 앞(도입부)에 끼워넣기`;
    posSelect.appendChild(optStart);

    codeInput.value = suggestNextSectionCode(chVal, '__END__');
  }

  function buildExportContent() {
    if (appState.exportMode === 'gitcode') {
      const customList = appState.terms.filter(t => t.isCustom);
      const targetList = customList.length > 0 ? customList : [appState.terms[appState.currentPageIdx]];
      const lines = [
        '// ============================================================================',
        '// [AI-Book: Learning Log — Git 업데이트 코드]',
        '// 아래 코드를 복사하여 해당 Part 데이터 파일에 붙여넣으세요:',
        '// - Part 1: src/data/parts/part1-foundations.js',
        '// - Part 2: src/data/parts/part2-ml-dl-rl.js',
        '// - Part 3 (온톨로지/지식그래프): src/data/parts/part3-ontology-knowledge.js',
        '// - Part 4: src/data/parts/part4-llm-architecture.js',
        '// - Part 5: src/data/parts/part5-agents.js',
        '// - Part 6: src/data/parts/part6-mlops-serving.js',
        '// ============================================================================',
        '',
        'window.BOOK_PARTS_DATA.push('
      ];
      targetList.forEach((item, idx) => {
        const cleanCopy = Object.assign({}, item);
        delete cleanCopy.isCustom;
        const jsonStr = JSON.stringify(cleanCopy, null, 2);
        lines.push(jsonStr + (idx < targetList.length - 1 ? ',' : ''));
      });
      lines.push(');');
      return lines.join('\n');
    }

    if (appState.exportMode === 'backup') {
      return JSON.stringify({
        project: 'AI-Book: Learning Log',
        exportedAt: new Date().toISOString(),
        customTerms: appState.terms.filter(t => t.isCustom),
        learnedIds: appState.learnedIds,
        bookmarkedIds: appState.bookmarkedIds,
        quizPassedIds: appState.quizPassedIds,
        userNotes: appState.userNotes
      }, null, 2);
    }

    // Default: Markdown Export
    const lines = [];
    lines.push('# AI-Book — AI-Book: Learning Log');
    lines.push('');
    lines.push('> "공부의 순서만 바뀐 것이다. 안 해도 되는 건 아니다."');
    lines.push('');
    if (window.EBOOK_CONFIG && window.EBOOK_CONFIG.prologue) {
      lines.push('## 여는 글 (인사말)');
      window.EBOOK_CONFIG.prologue.paragraphs.forEach(p => {
        lines.push(p);
        lines.push('');
      });
    }
    window.CHAPTERS.forEach(ch => {
      lines.push(`## ${ch.badge} : ${ch.title}`);
      lines.push(`> ${ch.subtitle}`);
      lines.push('');
      const chTerms = appState.terms.filter(t => Number(t.chapter) === Number(ch.id));
      chTerms.forEach(t => {
        const check = appState.learnedIds[t.id] ? '[x]' : '[ ]';
        const diffMeta = getDifficultyMeta(t.difficulty);
        lines.push(`### ${check} [${t.sectionCode || ''}] ${t.term} (${diffMeta.badge} · ${t.layer})`);
        lines.push(`- **한 줄 비유**: ${t.analogy}`);
        lines.push(`- **핵심 원리 및 해설**: ${t.definition}`);
        if (t.studyGuide) lines.push(`- **공부 방법 로드맵**: ${t.studyGuide}`);
        if (t.keyTerms && t.keyTerms.length > 0) {
          lines.push(`- **핵심 용어**: ` + t.keyTerms.map(k => `**${k.term}**(${k.desc})`).join(' / '));
        }
        if (appState.userNotes[t.id]) {
          lines.push(`- **내 학습 메모**: ${appState.userNotes[t.id]}`);
        }
        lines.push('');
      });
    });
    return lines.join('\n');
  }

  // --------------------------------------------------------------------------
  // 15. 이벤트 바인딩 및 초기화
  // --------------------------------------------------------------------------
  window.addEventListener('DOMContentLoaded', () => {
    loadSavedState();
    renderTocView();
    renderBookSpreadView();
    renderRolesView();
    renderArchitectureView();
    renderToolsView();
    renderPlaybookView();
    renderIndexGridView();

    // 상단 네비게이션 탭
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        switchMainView(tab.getAttribute('data-view'));
      });
    });

    // 첫 페이지(서문·소개) / 목차 표시 전환 버튼
    document.querySelectorAll('.front-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        appState.frontMode = btn.getAttribute('data-frontmode') || 'all';
        updateFrontPageModeUI();
      });
    });

    document.querySelectorAll('.front-page-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        appState.frontMode = btn.getAttribute('data-fronttab') || 'all';
        updateFrontPageModeUI();
      });
    });

    // 표지 시안 선택 버튼
    document.querySelectorAll('.cover-select-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        appState.selectedCoverIdx = parseInt(btn.getAttribute('data-cover'), 10) || 0;
        saveProgressState();
        renderTocView();
      });
    });

    // 목차 내 난이도 필터 버튼
    document.querySelectorAll('.toc-diff-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        appState.tocFilterDiff = btn.getAttribute('data-tocdiff') || 'all';
        renderTocView();
      });
    });

    // 첫 페이지 펼치기 & 목차 복귀
    const btnStart = document.getElementById('btnStartFirstPage');
    if (btnStart) btnStart.addEventListener('click', () => openBookAtPage(0));

    const btnBackToc = document.getElementById('btnBackToToc');
    if (btnBackToc) btnBackToc.addEventListener('click', () => switchMainView('toc'));

    // 왼쪽 페이지 도해 애니메이션 일시정지/재생 토글
    const btnToggleAnim = document.getElementById('btnToggleDiagramAnim');
    if (btnToggleAnim) {
      btnToggleAnim.addEventListener('click', () => {
        appState.diagramAnimPaused = !appState.diagramAnimPaused;
        btnToggleAnim.textContent = appState.diagramAnimPaused ? '애니메이션 재생' : '애니메이션 일시정지';
        renderBookSpreadView();
      });
    }

    // 모바일 좌/우 페이지 전환 버튼
    const btnMobLeft = document.getElementById('btnMobilePaneLeft');
    const btnMobRight = document.getElementById('btnMobilePaneRight');
    if (btnMobLeft) {
      btnMobLeft.addEventListener('click', () => {
        appState.mobilePane = 'left';
        updateMobilePaneVisibility();
      });
    }
    if (btnMobRight) {
      btnMobRight.addEventListener('click', () => {
        appState.mobilePane = 'right';
        updateMobilePaneVisibility();
      });
    }

    // 왼쪽 페이지 수준별 깊이 탭
    document.querySelectorAll('.left-depth-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        appState.leftDepthTab = btn.getAttribute('data-depthtab') || 'all';
        const cur = appState.terms[appState.currentPageIdx];
        const layerObj = window.ARCH_LAYERS.find(l => l.id === cur.layer) || window.ARCH_LAYERS[0];
        renderLeftDepthContent(cur, layerObj);
      });
    });

    // 페이지 점프 드롭다운
    const pageJump = document.getElementById('pageJumpSelect');
    if (pageJump) {
      pageJump.addEventListener('change', (e) => {
        const idx = parseInt(e.target.value, 10) || 0;
        stopProcessTimer();
        appState.currentPageIdx = idx;
        appState.currentProcessStep = 0;
        triggerPageFlipAnimation();
        renderBookSpreadView();
      });
    }

    // 왼쪽 페이지 계층 배지 클릭
    const layerBtn = document.getElementById('leftPageLayerBtn');
    if (layerBtn) {
      layerBtn.addEventListener('click', () => {
        const cur = appState.terms[appState.currentPageIdx];
        if (cur) {
          appState.selectedArchLayer = cur.layer;
          switchMainView('architecture');
        }
      });
    }

    // 책갈피 및 완독 토글
    document.getElementById('btnToggleBookmark').addEventListener('click', () => {
      const cur = appState.terms[appState.currentPageIdx];
      if (!cur) return;
      appState.bookmarkedIds[cur.id] = !appState.bookmarkedIds[cur.id];
      saveProgressState();
      renderBookSpreadView();
      showToast(appState.bookmarkedIds[cur.id] ? '이 페이지에 책갈피를 추가했습니다.' : '책갈피를 해제했습니다.');
    });

    document.getElementById('btnToggleLearned').addEventListener('click', () => {
      const cur = appState.terms[appState.currentPageIdx];
      if (!cur) return;
      appState.learnedIds[cur.id] = !appState.learnedIds[cur.id];
      saveProgressState();
      renderBookSpreadView();
      showToast(appState.learnedIds[cur.id] ? '이 단원을 완독 표시했습니다.' : '완독 표시를 해제했습니다.');
    });

    // 이전/다음 페이지 이동 함수 (데스크톱 & 모바일 하단바 공용)
    function goPrevPage() {
      if (appState.currentPageIdx > 0) {
        stopProcessTimer();
        appState.currentPageIdx--;
        appState.currentProcessStep = 0;
        triggerPageFlipAnimation();
        renderBookSpreadView();
      }
    }
    function goNextPage() {
      stopProcessTimer();
      if (appState.currentPageIdx < appState.terms.length - 1) {
        appState.currentPageIdx++;
        appState.currentProcessStep = 0;
        triggerPageFlipAnimation();
        renderBookSpreadView();
      } else {
        switchMainView('toc');
      }
    }

    document.getElementById('btnPrevPage').addEventListener('click', goPrevPage);
    document.getElementById('btnNextPage').addEventListener('click', goNextPage);

    const mobPrev = document.getElementById('btnMobilePrevPage');
    const mobNext = document.getElementById('btnMobileNextPage');
    const mobToc = document.getElementById('btnMobileGoToc');
    if (mobPrev) mobPrev.addEventListener('click', () => {
      if (appState.currentView !== 'ebook') switchMainView('ebook');
      else goPrevPage();
    });
    if (mobNext) mobNext.addEventListener('click', () => {
      if (appState.currentView !== 'ebook') switchMainView('ebook');
      else goNextPage();
    });
    if (mobToc) mobToc.addEventListener('click', () => switchMainView('toc'));

    // 키보드 좌우 화살표 책장 넘김
    window.addEventListener('keydown', (e) => {
      if (appState.currentView !== 'ebook') return;
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') return;
      if (e.key === 'ArrowRight') goNextPage();
      else if (e.key === 'ArrowLeft') goPrevPage();
    });

    // 오른쪽 페이지 3가지 모드 전환 (단계별 애니메이션 / 코딩 실습 / 문제 풀이)
    document.getElementById('btnLabModeVisual').addEventListener('click', () => {
      appState.rightLabMode = 'visual';
      renderRightLabPage(appState.terms[appState.currentPageIdx]);
    });
    document.getElementById('btnLabModeCode').addEventListener('click', () => {
      stopProcessTimer();
      appState.rightLabMode = 'code';
      renderRightLabPage(appState.terms[appState.currentPageIdx]);
    });
    document.getElementById('btnLabModeQuiz').addEventListener('click', () => {
      stopProcessTimer();
      appState.rightLabMode = 'quiz';
      renderRightLabPage(appState.terms[appState.currentPageIdx]);
    });

    // 시각 과정 자동 재생 및 다음 단계
    document.getElementById('btnPlayProcess').addEventListener('click', () => {
      const cur = appState.terms[appState.currentPageIdx];
      if (!cur) return;
      if (appState.processInterval) {
        stopProcessTimer();
        renderRightLabPage(cur);
        return;
      }
      document.getElementById('btnPlayProcess').textContent = '일시정지';
      appState.processInterval = setInterval(() => {
        const item = appState.terms[appState.currentPageIdx];
        const maxSteps = (item.processSteps || []).length || 4;
        appState.currentProcessStep = (appState.currentProcessStep + 1) % maxSteps;
        const leftDiag = document.getElementById('leftPageConceptDiagramBox');
        if (leftDiag) leftDiag.innerHTML = buildConceptAnimatedSvg(item, appState.currentProcessStep);
        renderRightLabPage(item);
        document.getElementById('btnPlayProcess').textContent = '일시정지';
      }, 2200);
    });

    document.getElementById('btnNextStepProcess').addEventListener('click', () => {
      stopProcessTimer();
      const cur = appState.terms[appState.currentPageIdx];
      const maxSteps = (cur.processSteps || []).length || 4;
      appState.currentProcessStep = (appState.currentProcessStep + 1) % maxSteps;
      const leftDiag = document.getElementById('leftPageConceptDiagramBox');
      if (leftDiag) leftDiag.innerHTML = buildConceptAnimatedSvg(cur, appState.currentProcessStep);
      renderRightLabPage(cur);
    });

    // 코드 복사 및 실행 버튼
    document.getElementById('btnCopyLabCode').addEventListener('click', () => {
      const code = document.getElementById('labCodeEditor').value;
      copyTextSafe(code, '실습 코드가 복사되었습니다.');
    });

    document.getElementById('btnRunLabCode').addEventListener('click', () => {
      const cur = appState.terms[appState.currentPageIdx];
      const paramEl = document.getElementById('labDynamicParam');
      const paramVal = paramEl ? paramEl.value : '';
      const consoleEl = document.getElementById('labConsoleOutput');
      const statusEl = document.getElementById('labRunStatus');

      statusEl.textContent = 'Running...';
      consoleEl.textContent = '> 샌드박스 환경 초기화 및 코드 실행 중...\n';

      const baseOut = (cur.labConfig && cur.labConfig.runOutput) ? cur.labConfig.runOutput : '실행 완료';
      const fullOut = paramVal ? `[입력 설정값 적용: ${paramVal}]\n\n${baseOut}` : baseOut;

      setTimeout(() => {
        consoleEl.textContent = fullOut;
        statusEl.textContent = 'Exit 0 (Success)';
        showToast('실습 코드가 실행되었습니다.');
      }, 280);
    });

    // 도구 카테고리 필터
    document.querySelectorAll('.tool-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        appState.selectedToolCat = btn.getAttribute('data-toolcat');
        updateToolCatButtonsUI();
        renderToolsView();
      });
    });

    // 색인표 필터
    const idxPartSel = document.getElementById('indexFilterPartSelect');
    const idxDiffSel = document.getElementById('indexFilterDiffSelect');
    if (idxPartSel) {
      idxPartSel.addEventListener('change', (e) => {
        appState.indexFilterPart = e.target.value;
        renderIndexGridView();
      });
    }
    if (idxDiffSel) {
      idxDiffSel.addEventListener('change', (e) => {
        appState.indexFilterDiff = e.target.value;
        renderIndexGridView();
      });
    }

    // 글로벌 검색창
    const searchInput = document.getElementById('globalSearchInput');
    const clearBtn = document.getElementById('btnClearSearch');
    searchInput.addEventListener('input', (e) => {
      appState.searchQuery = e.target.value;
      if (appState.searchQuery) {
        clearBtn.classList.remove('hidden');
        if (appState.currentView !== 'tools' && appState.currentView !== 'indexgrid') {
          switchMainView('indexgrid');
        } else if (appState.currentView === 'tools') {
          renderToolsView();
        } else {
          renderIndexGridView();
        }
      } else {
        clearBtn.classList.add('hidden');
        if (appState.currentView === 'tools') renderToolsView();
        if (appState.currentView === 'indexgrid') renderIndexGridView();
      }
    });

    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      appState.searchQuery = '';
      clearBtn.classList.add('hidden');
      if (appState.currentView === 'tools') renderToolsView();
      if (appState.currentView === 'indexgrid') renderIndexGridView();
    });

    // ------------------------------------------------------------------------
    // 모달 1: 목차 순서에 맞게 새 단원 끼워넣기
    // ------------------------------------------------------------------------
    const modalAdd = document.getElementById('modalAdd');
    const inputChEl = document.getElementById('inputChapter');
    const inputPosEl = document.getElementById('inputInsertPosition');
    const inputSecCodeEl = document.getElementById('inputSectionCode');

    document.getElementById('btnOpenAddModal').addEventListener('click', () => {
      inputChEl.value = String(appState.selectedChapter || 3);
      populateAddModalPositionSelect();
      modalAdd.classList.remove('hidden');
    });
    document.getElementById('btnCloseAddModal').addEventListener('click', () => modalAdd.classList.add('hidden'));
    document.getElementById('btnCancelAdd').addEventListener('click', () => modalAdd.classList.add('hidden'));

    inputChEl.addEventListener('change', () => {
      populateAddModalPositionSelect();
    });
    inputPosEl.addEventListener('change', () => {
      const chVal = parseInt(inputChEl.value, 10) || 3;
      inputSecCodeEl.value = suggestNextSectionCode(chVal, inputPosEl.value);
    });

    document.getElementById('formAddItem').addEventListener('submit', (e) => {
      e.preventDefault();
      const ch = parseInt(inputChEl.value, 10) || 3;
      const sectionCode = (inputSecCodeEl.value || `${ch}.9`).trim();
      const difficulty = document.getElementById('inputDifficulty').value || 'intermediate';
      const layer = document.getElementById('inputLayer').value || 'L3';
      const term = document.getElementById('inputTermName').value.trim();
      const analogy = document.getElementById('inputAnalogy').value.trim();
      const definition = document.getElementById('inputDefinition').value.trim();
      const studyGuide = document.getElementById('inputStudyGuide').value.trim();
      const keyTermsRaw = document.getElementById('inputKeyTerms').value.trim();
      const toolsRaw = document.getElementById('inputRelatedTools').value.trim();
      const quizQ = document.getElementById('inputQuizQuestion').value.trim();
      const quizAns = document.getElementById('inputQuizAnswer').value.trim();

      if (!term || !analogy || !definition) return;

      const selectedRoles = [];
      document.querySelectorAll('.input-role-checkbox:checked').forEach(cb => {
        selectedRoles.push(cb.value);
      });

      const parsedKeyTerms = keyTermsRaw
        ? keyTermsRaw.split('\n').map(line => {
            const parts = line.split(':');
            if (parts.length >= 2) {
              return { term: parts[0].trim(), desc: parts.slice(1).join(':').trim() };
            }
            return { term: line.trim(), desc: '핵심 연관 용어' };
          }).filter(k => k.term)
        : [];

      const relatedTools = toolsRaw
        ? toolsRaw.split(',').map(s => s.trim()).filter(Boolean)
        : ['Custom Study Note'];

      const newItem = {
        id: 'custom_' + Date.now(),
        chapter: ch,
        sectionCode: sectionCode,
        layer: layer,
        difficulty: difficulty,
        roles: selectedRoles.length > 0 ? selectedRoles : ['pm', 'app-be', 'data-ontology'],
        term: term,
        analogy: analogy,
        definition: definition,
        deepNote: studyGuide ? `공부 및 실무 포인트: ${studyGuide}` : undefined,
        studyGuide: studyGuide || undefined,
        keyTerms: parsedKeyTerms,
        relatedTools: relatedTools,
        dateAdded: new Date().toISOString().slice(0, 10),
        isCustom: true
      };

      if (quizQ && quizAns) {
        newItem.quiz = {
          question: quizQ,
          options: [
            quizAns,
            '모델의 파라미터를 무작위로 초기화하여 삭제하는 작업이다.',
            '하드웨어 냉각 팬의 회전 속도를 수동으로 고정하는 방식이다.',
            '네트워크 연결을 영구적으로 차단하는 물리적 스위치이다.'
          ],
          answerIndex: 0,
          explanation: `핵심 정답: ${quizAns} (${analogy})`
        };
      }

      appState.terms.push(newItem);
      sortAllTerms();
      saveProgressState();

      const insertedIdx = appState.terms.findIndex(t => t.id === newItem.id);
      document.getElementById('formAddItem').reset();
      modalAdd.classList.add('hidden');
      renderTocView();
      openBookAtPage(insertedIdx >= 0 ? insertedIdx : appState.terms.length - 1);
      showToast(`[${sectionCode}] 단원이 목차 순서에 맞춰 p.${String(insertedIdx + 1).padStart(2, '0')}에 끼워 넣어졌습니다.`);
    });

    // ------------------------------------------------------------------------
    // 모달 2: 원고 내보내기 & Git 업데이트 코드 생성
    // ------------------------------------------------------------------------
    const modalExport = document.getElementById('modalExport');
    function refreshExportArea() {
      document.getElementById('exportMarkdownArea').value = buildExportContent();
      document.querySelectorAll('.export-mode-btn').forEach(btn => {
        const m = btn.getAttribute('data-exportmode');
        btn.className = m === appState.exportMode
          ? 'export-mode-btn px-3 py-1 rounded text-xs font-semibold bg-[#2c3e50] text-stone-100 transition'
          : 'export-mode-btn px-3 py-1 rounded text-xs font-medium bg-[#ebe6dc] text-stone-700 hover:bg-stone-300 transition';
      });
    }

    document.getElementById('btnOpenExportModal').addEventListener('click', () => {
      refreshExportArea();
      modalExport.classList.remove('hidden');
    });
    document.getElementById('btnCloseExportModal').addEventListener('click', () => modalExport.classList.add('hidden'));
    document.getElementById('btnDoneExport').addEventListener('click', () => modalExport.classList.add('hidden'));

    document.querySelectorAll('.export-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        appState.exportMode = btn.getAttribute('data-exportmode') || 'gitcode';
        refreshExportArea();
      });
    });

    document.getElementById('btnCopyMarkdown').addEventListener('click', () => {
      const content = document.getElementById('exportMarkdownArea').value;
      copyTextSafe(content, '원고 코드가 클립보드에 복사되었습니다.');
    });

    document.getElementById('btnDownloadExportFile').addEventListener('click', () => {
      const content = document.getElementById('exportMarkdownArea').value;
      const ext = appState.exportMode === 'gitcode' ? 'js' : (appState.exportMode === 'backup' ? 'json' : 'md');
      const filename = `ai-book-learning-log-${new Date().toISOString().slice(0, 10)}.${ext}`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(`${filename} 파일이 다운로드되었습니다.`);
    });

    document.getElementById('btnResetProgress').addEventListener('click', () => {
      appState.learnedIds = {};
      appState.quizPassedIds = {};
      saveProgressState();
      renderTocView();
      renderBookSpreadView();
      refreshExportArea();
      showToast('독서 및 퀴즈 진도가 초기화되었습니다.');
    });
  });
})();
