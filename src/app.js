// ============================================================================
// AI-Book — AI-Book: Learning Log (Living Editorial E-Book Engine)
// - 좌측 고정 사이드바(전체 6부작 24단원 목차 트리 + 부록) + 우측 100% 단행본 지면
// - 탭으로 가리지 않는 서적 본문 조판 (개념 -> 대형 도판 -> 입문/중급/심화 -> 용어 -> 실습/퀴즈)
// - 큰 글씨(14px~17px) 기반 단원별 맞춤 SVG 애니메이션 도해 엔진
// ============================================================================

(function () {
  'use strict';

  const STORAGE_KEYS = {
    LEARNED: 'ai_ebook_learned_v3',
    BOOKMARKS: 'ai_ebook_bookmarks_v3',
    QUIZ_PASSED: 'ai_ebook_quiz_passed_v3',
    USER_NOTES: 'ai_ebook_user_notes_v3',
    COVER_IDX: 'ai_ebook_cover_v3'
  };

  let appState = {
    currentView: 'toc',          // 'toc', 'ebook', 'roles', 'architecture', 'tools', 'playbook', 'indexgrid'
    selectedCoverIdx: 0,
    currentPageIdx: 0,
    diagramAnimPaused: false,
    desktopSidebarCollapsed: false,
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
    exportMode: 'markdown',      // 'markdown' | 'backup'
    terms: [],
    learnedIds: {},
    bookmarkedIds: {},
    quizPassedIds: {},
    userNotes: {}
  };

  // --------------------------------------------------------------------------
  // 1. 코드 기반 목차 번호(sectionCode) 비교 및 자동 정렬 엔진
  //    (src/data/parts/*.js 에 새 단원을 코드로 추가하면 sectionCode 순서대로 자동 정렬됨)
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

  // --------------------------------------------------------------------------
  // 2. 로컬 스토리지 상태 로드 및 저장 (독서 진도 · 책갈피 · 개인 메모)
  // --------------------------------------------------------------------------
  function loadSavedState() {
    const initialList = Array.isArray(window.BOOK_PARTS_DATA) ? [...window.BOOK_PARTS_DATA] : [];
    appState.terms = [...initialList];
    sortAllTerms();

    try {
      const savedLearned = localStorage.getItem(STORAGE_KEYS.LEARNED);
      const savedBookmarks = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      const savedQuiz = localStorage.getItem(STORAGE_KEYS.QUIZ_PASSED);
      const savedNotes = localStorage.getItem(STORAGE_KEYS.USER_NOTES);
      const savedCover = localStorage.getItem(STORAGE_KEYS.COVER_IDX);

      appState.learnedIds = savedLearned ? JSON.parse(savedLearned) : {};
      appState.bookmarkedIds = savedBookmarks ? JSON.parse(savedBookmarks) : {};
      appState.quizPassedIds = savedQuiz ? JSON.parse(savedQuiz) : {};
      appState.userNotes = savedNotes ? JSON.parse(savedNotes) : {};
      if (savedCover !== null) {
        appState.selectedCoverIdx = parseInt(savedCover, 10) || 0;
      }
    } catch (e) {
      // Ignore storage read errors
    }
  }

  function saveProgressState() {
    try {
      localStorage.setItem(STORAGE_KEYS.LEARNED, JSON.stringify(appState.learnedIds));
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(appState.bookmarkedIds));
      localStorage.setItem(STORAGE_KEYS.QUIZ_PASSED, JSON.stringify(appState.quizPassedIds));
      localStorage.setItem(STORAGE_KEYS.USER_NOTES, JSON.stringify(appState.userNotes));
      localStorage.setItem(STORAGE_KEYS.COVER_IDX, String(appState.selectedCoverIdx));
    } catch (e) {
      // Ignore quota errors
    }
  }

  // --------------------------------------------------------------------------
  // 3. 공통 유틸리티 및 단행본 문단 포매터
  // --------------------------------------------------------------------------
  function stopProcessTimer() {
    if (appState.processInterval) {
      clearInterval(appState.processInterval);
      appState.processInterval = null;
    }
    const playBtn = document.getElementById('btnPlayProcess');
    if (playBtn) playBtn.textContent = '단계 자동 재생';
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

  function formatReadableHtml(rawText) {
    if (!rawText) return '';
    const clean = String(rawText).trim();
    const sentences = clean.split(/(?<=\.)\s+/);
    if (sentences.length <= 2) {
      return `<p>${escapeHtml(clean)}</p>`;
    }
    const paragraphs = [];
    for (let i = 0; i < sentences.length; i += 2) {
      paragraphs.push(sentences.slice(i, i + 2).join(' '));
    }
    return paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('');
  }

  function formatStudyStepsHtml(rawGuide) {
    if (!rawGuide) {
      return `<p class="text-sm sm:text-base text-stone-800">1단계(비유와 정의로 개념 뼈대 잡기) → 2단계(상단 그림 도판과 4단계 애니메이션으로 데이터 흐름 확인) → 3단계(하단 실습 코드 실행 및 확인 퀴즈 풀이) 순서로 학습하세요.</p>`;
    }
    const clean = String(rawGuide).replace(/^\[[^\]]+\]\s*/, '').trim();
    const steps = clean.split(/\s*→\s*/).filter(Boolean);
    if (steps.length >= 2) {
      return `<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">` + steps.map((st, idx) => `
        <div class="bg-[#faf8f3] border border-[#ccc4b4] rounded-xl p-4 flex items-start gap-3">
          <span class="text-xs font-mono-code font-bold px-2 py-0.5 rounded bg-[#2c3e50] text-white shrink-0 mt-0.5">STEP 0${idx + 1}</span>
          <span class="text-sm sm:text-[15px] text-stone-800 leading-relaxed">${escapeHtml(st.replace(/^[①②③④⑤]\s*/, ''))}</span>
        </div>
      `).join('') + `</div>`;
    }
    return `<p class="text-sm sm:text-base text-stone-800 leading-relaxed">${escapeHtml(rawGuide)}</p>`;
  }

  function getDifficultyMeta(diffKey) {
    return (window.DIFFICULTY_LEVELS && window.DIFFICULTY_LEVELS[diffKey]) ||
      window.DIFFICULTY_LEVELS.elementary;
  }

  function getRoleMeta(roleId) {
    return (window.JOB_ROLES || []).find(r => r.id === roleId);
  }

  // --------------------------------------------------------------------------
  // 4. 좌측 고정 사이드바 목차 트리 렌더링 & 모바일 드로어 제어
  // --------------------------------------------------------------------------
  function closeMobileSidebar() {
    const sb = document.getElementById('bookSidebar');
    const bd = document.getElementById('sidebarBackdrop');
    if (sb) sb.classList.add('-translate-x-full');
    if (bd) bd.classList.add('hidden');
  }

  function openMobileSidebar() {
    const sb = document.getElementById('bookSidebar');
    const bd = document.getElementById('sidebarBackdrop');
    if (sb) sb.classList.remove('-translate-x-full');
    if (bd) bd.classList.remove('hidden');
  }

  function renderSidebarTree() {
    const treeEl = document.getElementById('sidebarChapterTree');
    const totalBadge = document.getElementById('sidebarTotalUnitsBadge');
    const topQuick = document.getElementById('topQuickStatus');
    if (totalBadge) totalBadge.textContent = `전 ${appState.terms.length}단원`;
    if (topQuick) topQuick.textContent = `전 6부 ${appState.terms.length}단원 수록`;
    if (!treeEl) return;

    treeEl.innerHTML = '';

    window.CHAPTERS.forEach(ch => {
      const chTerms = [];
      appState.terms.forEach((t, gIdx) => {
        if (Number(t.chapter) === Number(ch.id)) {
          chTerms.push({ termObj: t, globalIdx: gIdx });
        }
      });

      const partBlock = document.createElement('div');
      partBlock.className = 'space-y-1';

      const partTitle = document.createElement('div');
      partTitle.className = 'px-2.5 py-1 text-xs font-bold text-amber-300/90 flex items-center justify-between';
      partTitle.innerHTML = `
        <span>${escapeHtml(ch.shortLabel)}</span>
        <span class="text-[11px] font-mono-code text-stone-400">${chTerms.length}</span>
      `;
      partBlock.appendChild(partTitle);

      const listWrap = document.createElement('div');
      listWrap.className = 'space-y-0.5 pl-1';

      chTerms.forEach(({ termObj, globalIdx }) => {
        const isCurrent = appState.currentView === 'ebook' && appState.currentPageIdx === globalIdx;
        const isLearned = !!appState.learnedIds[termObj.id];
        const secCode = termObj.sectionCode || `${ch.id}.${globalIdx + 1}`;
        const shortName = termObj.term.split('(')[0].trim();

        const itemBtn = document.createElement('button');
        itemBtn.type = 'button';
        itemBtn.className = 'w-full text-left px-2.5 py-1.5 rounded-lg text-xs sm:text-[13px] transition flex items-center justify-between gap-2 ' +
          (isCurrent
            ? 'bg-amber-400/15 text-amber-200 font-semibold border border-amber-400/40'
            : 'text-stone-300 hover:bg-[#2a323c] hover:text-white');
        itemBtn.innerHTML = `
          <div class="flex items-center gap-2 min-w-0">
            <span class="font-mono-code text-[11px] ${isCurrent ? 'text-amber-300 font-bold' : 'text-stone-400'} shrink-0">${escapeHtml(secCode)}</span>
            <span class="truncate">${escapeHtml(shortName)}</span>
          </div>
          <span class="text-[10px] font-mono-code shrink-0 ${isLearned ? 'text-emerald-400 font-bold' : 'text-stone-500'}">
            ${isLearned ? 'DONE' : 'p.' + String(globalIdx + 1).padStart(2, '0')}
          </span>
        `;
        itemBtn.addEventListener('click', () => {
          closeMobileSidebar();
          openBookAtPage(globalIdx);
        });
        listWrap.appendChild(itemBtn);
      });

      partBlock.appendChild(listWrap);
      treeEl.appendChild(partBlock);
    });
  }

  // --------------------------------------------------------------------------
  // 5. 단원별 대형 그림 설명 & 애니메이션 도판 생성 엔진 (큰 글씨 14px~16px 적용)
  // --------------------------------------------------------------------------
  function buildConceptAnimatedSvg(item, stepIdx) {
    const s = Number(stepIdx) || 0;
    const id = item.id || '';
    const sec = String(item.sectionCode || '').trim();
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

    // 1.1 AI 패러다임 (p1-paradigm / 1.1)
    if (sec === '1.1' || id === 'p1-paradigm') {
      return `
        <div class="${pauseClass} space-y-2">
          <div class="flex items-center justify-between text-xs font-mono-code font-bold text-[#7c5e3c]">
            <span>FIGURE ${escapeHtml(sec)} · 기호주의(논리·온톨로지) + 연결주의(신경망 학습) 하이브리드 결합</span>
            <span>현재 단계: STEP 0${s + 1}</span>
          </div>
          <svg viewBox="0 0 760 220" class="w-full h-auto min-w-[560px]">
            ${commonDefs}
            <rect x="16" y="20" width="220" height="76" rx="8" fill="${s === 0 ? '#2c3e50' : '#f3efe6'}" stroke="#2c3e50" stroke-width="2"/>
            <text x="126" y="50" text-anchor="middle" font-size="15" font-weight="700" fill="${s === 0 ? '#ffffff' : '#1c1917'}">기호주의 (Symbolic AI)</text>
            <text x="126" y="74" text-anchor="middle" font-size="13" fill="${s === 0 ? '#fcd34d' : '#7c5e3c'}">명시적 규칙 · 논리 · 온톨로지</text>

            <rect x="16" y="120" width="220" height="76" rx="8" fill="${s === 1 || s === 2 ? '#2c3e50' : '#f3efe6'}" stroke="#2c3e50" stroke-width="2"/>
            <text x="126" y="150" text-anchor="middle" font-size="15" font-weight="700" fill="${s === 1 || s === 2 ? '#ffffff' : '#1c1917'}">연결주의 (Connectionism)</text>
            <text x="126" y="174" text-anchor="middle" font-size="13" fill="${s === 1 || s === 2 ? '#fcd34d' : '#7c5e3c'}">머신러닝 · 딥러닝 · 강화학습</text>

            <path d="M 236 58 C 285 58, 290 108, 336 108" fill="none" stroke="#7c5e3c" stroke-width="2.5" class="svg-flow-line" marker-end="url(#arrBronze)"/>
            <path d="M 236 158 C 285 158, 290 108, 336 108" fill="none" stroke="#2c3e50" stroke-width="2.5" class="svg-flow-line" marker-end="url(#arrNavy)"/>

            <rect x="344" y="56" width="210" height="104" rx="10" fill="${s === 3 ? '#2c3e50' : '#ebe6dc'}" stroke="#2c3e50" stroke-width="2.2" class="svg-pulse-node"/>
            <text x="449" y="92" text-anchor="middle" font-size="16" font-weight="700" fill="${s === 3 ? '#ffffff' : '#1c1917'}">현대 하이브리드 AI</text>
            <text x="449" y="116" text-anchor="middle" font-size="13.5" fill="${s === 3 ? '#fcd34d' : '#44403c'}">LLM 직관 + 온톨로지 검증</text>
            <text x="449" y="138" text-anchor="middle" font-size="12" font-family="JetBrains Mono" fill="${s === 3 ? '#e7e5e4' : '#7c5e3c'}">GraphRAG + RL + Harness</text>

            <line x1="554" y1="108" x2="598" y2="108" stroke="#1f5f4b" stroke-width="2.5" class="svg-flow-fast" marker-end="url(#arrEmerald)"/>

            <rect x="606" y="66" width="138" height="84" rx="8" fill="#f3efe6" stroke="#1f5f4b" stroke-width="2"/>
            <text x="675" y="102" text-anchor="middle" font-size="15" font-weight="700" fill="#1f5f4b">무환각 실행</text>
            <text x="675" y="126" text-anchor="middle" font-size="13" fill="#44403c">결정론적 신뢰성</text>
          </svg>
        </div>
      `;
    }

    // 1.2 토큰과 컨텍스트 윈도우 (t1 / 1.2)
    if (sec === '1.2' || id === 't1') {
      return `
        <div class="${pauseClass} space-y-2">
          <div class="flex items-center justify-between text-xs font-mono-code font-bold text-[#7c5e3c]">
            <span>FIGURE ${escapeHtml(sec)} · 서브워드 토큰 분해(Tokenization) 및 컨텍스트 윈도우 메모리 구조</span>
            <span>현재 단계: STEP 0${s + 1}</span>
          </div>
          <svg viewBox="0 0 760 225" class="w-full h-auto min-w-[560px]">
            ${commonDefs}
            <text x="18" y="28" font-size="14" font-weight="700" fill="#2c3e50">1. 입력 문장의 토큰 조각 분해 및 숫자 ID 변환</text>

            <rect x="18" y="42" width="96" height="54" rx="6" fill="${s === 0 || s === 1 ? '#2c3e50' : '#f3efe6'}" stroke="#2c3e50" stroke-width="1.8"/>
            <text x="66" y="66" text-anchor="middle" font-size="15" font-weight="700" fill="${s === 0 || s === 1 ? '#ffffff' : '#1c1917'}">"온톨로지"</text>
            <text x="66" y="86" text-anchor="middle" font-size="12" font-family="JetBrains Mono" fill="${s === 0 || s === 1 ? '#fcd34d' : '#7c5e3c'}">ID: 48102</text>

            <rect x="122" y="42" width="86" height="54" rx="6" fill="${s === 1 || s === 2 ? '#2c3e50' : '#f3efe6'}" stroke="#2c3e50" stroke-width="1.8"/>
            <text x="165" y="66" text-anchor="middle" font-size="15" font-weight="700" fill="${s === 1 || s === 2 ? '#ffffff' : '#1c1917'}">"설계"</text>
            <text x="165" y="86" text-anchor="middle" font-size="12" font-family="JetBrains Mono" fill="${s === 1 || s === 2 ? '#fcd34d' : '#7c5e3c'}">ID: 19204</text>

            <rect x="216" y="42" width="86" height="54" rx="6" fill="${s === 2 ? '#2c3e50' : '#f3efe6'}" stroke="#2c3e50" stroke-width="1.8"/>
            <text x="259" y="66" text-anchor="middle" font-size="15" font-weight="700" fill="${s === 2 ? '#ffffff' : '#1c1917'}">"원리"</text>
            <text x="259" y="86" text-anchor="middle" font-size="12" font-family="JetBrains Mono" fill="${s === 2 ? '#fcd34d' : '#7c5e3c'}">ID: 33091</text>

            <line x1="308" y1="69" x2="358" y2="69" stroke="#7c5e3c" stroke-width="2.5" class="svg-flow-fast" marker-end="url(#arrBronze)"/>

            <!-- Context Window Box -->
            <rect x="366" y="18" width="376" height="188" rx="10" fill="#f3efe6" stroke="#2c3e50" stroke-width="2" stroke-dasharray="6 4"/>
            <text x="384" y="44" font-size="14.5" font-weight="700" fill="#2c3e50">2. 컨텍스트 윈도우 작업 책상 (예: 128K ~ 2M 토큰)</text>

            <rect x="384" y="58" width="108" height="64" rx="6" fill="#faf8f3" stroke="#78716c" stroke-width="1.5"/>
            <text x="438" y="84" text-anchor="middle" font-size="13.5" font-weight="700" fill="#1c1917">시스템 지시문</text>
            <text x="438" y="106" text-anchor="middle" font-size="12" fill="#57534e">고정 규칙</text>

            <rect x="500" y="58" width="112" height="64" rx="6" fill="#faf8f3" stroke="#7c5e3c" stroke-width="1.5"/>
            <text x="556" y="84" text-anchor="middle" font-size="13.5" font-weight="700" fill="#7c5e3c">첨부 문서 · 코드</text>
            <text x="556" y="106" text-anchor="middle" font-size="12" fill="#57534e">KV 캐시 적재</text>

            <rect x="620" y="58" width="104" height="64" rx="6" fill="#2c3e50" class="svg-pulse-node"/>
            <text x="672" y="84" text-anchor="middle" font-size="13.5" font-weight="700" fill="#ffffff">신규 답변 생성</text>
            <text x="672" y="106" text-anchor="middle" font-size="12" fill="#fcd34d">1토큰씩 출력</text>

            <!-- KV Cache Gauge -->
            <rect x="384" y="140" width="340" height="18" rx="9" fill="#dcd6c8"/>
            <rect x="384" y="140" width="${140 + s * 48}" height="18" rx="9" fill="#7c5e3c"/>
            <text x="554" y="182" text-anchor="middle" font-size="13" font-weight="600" fill="#44403c">대화가 길어질수록 KV 캐시(GPU 메모리) 사용량 비례 증가</text>

            <!-- Left Bottom Note -->
            <rect x="18" y="118" width="320" height="88" rx="8" fill="#f3efe6" stroke="#ccc4b4" stroke-width="1.5"/>
            <text x="178" y="150" text-anchor="middle" font-size="14" font-weight="700" fill="#7c5e3c">왜 컨텍스트 한계가 중요한가?</text>
            <text x="178" y="176" text-anchor="middle" font-size="12.5" fill="#44403c">책상 넓이를 초과하면 앞부분 기억이 유실됨 → RAG·온톨로지 필수</text>
          </svg>
        </div>
      `;
    }

    // 1.3 파라미터와 체급 계산 (t2 / 1.3)
    if (sec === '1.3' || id === 't2') {
      return `
        <div class="${pauseClass} space-y-2">
          <div class="flex items-center justify-between text-xs font-mono-code font-bold text-[#7c5e3c]">
            <span>FIGURE ${escapeHtml(sec)} · 신경망 가중치 파라미터(Weight Matrix)와 정밀도별 VRAM 메모리 계산</span>
            <span>현재 단계: STEP 0${s + 1}</span>
          </div>
          <svg viewBox="0 0 760 220" class="w-full h-auto min-w-[560px]">
            ${commonDefs}
            <!-- Neural Synapse Matrix -->
            <rect x="18" y="24" width="230" height="172" rx="10" fill="#f3efe6" stroke="#2c3e50" stroke-width="2"/>
            <text x="133" y="52" text-anchor="middle" font-size="15" font-weight="700" fill="#2c3e50">신경망 시냅스 가중치 (W)</text>
            <circle cx="65" cy="95" r="12" fill="#2c3e50"/><circle cx="65" cy="145" r="12" fill="#2c3e50"/>
            <circle cx="133" cy="80" r="12" fill="#7c5e3c"/><circle cx="133" cy="120" r="12" fill="#7c5e3c"/><circle cx="133" cy="160" r="12" fill="#7c5e3c"/>
            <circle cx="200" cy="95" r="12" fill="#1f5f4b"/><circle cx="200" cy="145" r="12" fill="#1f5f4b"/>
            <line x1="77" y1="95" x2="121" y2="80" stroke="#7c5e3c" stroke-width="2" class="svg-flow-fast"/>
            <line x1="77" y1="95" x2="121" y2="120" stroke="#2c3e50" stroke-width="2" class="svg-flow-line"/>
            <line x1="77" y1="145" x2="121" y2="160" stroke="#7c5e3c" stroke-width="2" class="svg-flow-fast"/>
            <line x1="145" y1="120" x2="188" y2="95" stroke="#1f5f4b" stroke-width="2" class="svg-flow-fast"/>
            <line x1="145" y1="120" x2="188" y2="145" stroke="#1f5f4b" stroke-width="2" class="svg-flow-line"/>
            <text x="133" y="185" text-anchor="middle" font-size="12.5" font-weight="600" fill="#44403c">70B = 700억 개의 연결 숫자</text>

            <line x1="248" y1="110" x2="296" y2="110" stroke="#2c3e50" stroke-width="2.5" class="svg-flow-fast" marker-end="url(#arrNavy)"/>

            <!-- VRAM Comparison Bars -->
            <rect x="304" y="24" width="438" height="172" rx="10" fill="#f3efe6" stroke="#dcd6c8" stroke-width="2"/>
            <text x="326" y="54" font-size="15" font-weight="700" fill="#1c1917">70B(700억 파라미터) 모델 구동에 필요한 GPU VRAM 비교</text>

            <text x="326" y="88" font-size="13.5" font-weight="700" fill="#9f1239">FP16 원본 (파라미터당 2 Byte)</text>
            <rect x="326" y="96" width="380" height="24" rx="5" fill="#9f1239"/>
            <text x="516" y="113" text-anchor="middle" font-size="13" font-weight="700" fill="#ffffff">약 140 GB VRAM 필요 (서버급 GPU 다수 필요)</text>

            <text x="326" y="144" font-size="13.5" font-weight="700" fill="#1f5f4b">INT4 4-bit 양자화 (파라미터당 0.5 Byte)</text>
            <rect x="326" y="152" width="125" height="24" rx="5" fill="#1f5f4b" class="svg-pulse-node"/>
            <text x="466" y="169" font-size="13.5" font-weight="700" fill="#1f5f4b">→ 약 35~42 GB로 75% 압축 (로컬 구동 가능!)</text>
          </svg>
        </div>
      `;
    }

    // 2.1 머신러닝 & 경사하강법 (p2-ml-fundamentals / 2.1)
    if (sec === '2.1' || id === 'p2-ml-fundamentals') {
      const ballPositions = [
        { cx: 135, cy: 52, label: 'STEP 1: 초기 가중치 (오차 큼)' },
        { cx: 210, cy: 105, label: 'STEP 2: 미분 기울기 방향 하강' },
        { cx: 290, cy: 152, label: 'STEP 3: 오차 급감 구간 통과' },
        { cx: 375, cy: 172, label: 'STEP 4: 최적점(Global Minimum) 도달!' }
      ];
      const pos = ballPositions[s] || ballPositions[0];
      return `
        <div class="${pauseClass} space-y-2">
          <div class="flex items-center justify-between text-xs font-mono-code font-bold text-[#7c5e3c]">
            <span>FIGURE ${escapeHtml(sec)} · 손실 함수 곡선 L(θ) 위를 기울기(미분)를 따라 내려가는 경사하강법</span>
            <span>θ_new = θ - η·∇L(θ)</span>
          </div>
          <svg viewBox="0 0 760 225" class="w-full h-auto min-w-[560px]">
            ${commonDefs}
            <line x1="70" y1="20" x2="70" y2="190" stroke="#57534e" stroke-width="2"/>
            <line x1="70" y1="190" x2="510" y2="190" stroke="#57534e" stroke-width="2"/>
            <text x="60" y="36" text-anchor="end" font-size="13" font-weight="700" fill="#2c3e50">오차(Loss)</text>
            <text x="505" y="212" text-anchor="end" font-size="13" font-weight="700" fill="#2c3e50">가중치 파라미터 (θ)</text>

            <path d="M 100 28 Q 375 316 500 32" fill="none" stroke="#2c3e50" stroke-width="3"/>
            <path d="M 135 52 Q 255 162 375 172" fill="none" stroke="#7c5e3c" stroke-width="2.5" class="svg-flow-fast" marker-end="url(#arrBronze)"/>

            <circle cx="135" cy="52" r="6" fill="#d6cfc2" stroke="#78716c"/>
            <circle cx="210" cy="105" r="6" fill="#d6cfc2" stroke="#78716c"/>
            <circle cx="290" cy="152" r="6" fill="#d6cfc2" stroke="#78716c"/>
            <circle cx="375" cy="172" r="7" fill="#d6cfc2" stroke="#1f5f4b"/>

            <circle cx="${pos.cx}" cy="${pos.cy}" r="11" fill="#7c5e3c" stroke="#ffffff" stroke-width="2.5" class="svg-pulse-node"/>
            <rect x="${Math.max(80, pos.cx - 115)}" y="${pos.cy - 42}" width="230" height="26" rx="5" fill="#2c3e50"/>
            <text x="${Math.max(195, pos.cx)}" y="${pos.cy - 24}" text-anchor="middle" font-size="13" font-weight="700" fill="#ffffff">${pos.label}</text>

            <rect x="530" y="26" width="212" height="164" rx="10" fill="#f3efe6" stroke="#dcd6c8" stroke-width="1.8"/>
            <text x="636" y="54" text-anchor="middle" font-size="15" font-weight="700" fill="#2c3e50">경사하강법 핵심 원리</text>
            <text x="546" y="84" font-size="13.5" fill="#44403c">1. 현재 가중치로 예측 수행</text>
            <text x="546" y="110" font-size="13.5" fill="#44403c">2. 정답과의 오차(Loss) 계산</text>
            <text x="546" y="136" font-size="13.5" font-weight="700" fill="#7c5e3c">3. 미분으로 경사(∇L) 측정</text>
            <text x="546" y="162" font-size="13.5" font-weight="700" fill="#1f5f4b">4. 경사 반대 방향으로 이동</text>
          </svg>
        </div>
      `;
    }

    // 2.2 딥러닝 & 트랜스포머 Self-Attention (p2-dl-transformer / 2.2)
    if (sec === '2.2' || id === 'p2-dl-transformer') {
      return `
        <div class="${pauseClass} space-y-2">
          <div class="flex items-center justify-between text-xs font-mono-code font-bold text-[#7c5e3c]">
            <span>FIGURE ${escapeHtml(sec)} · 트랜스포머 Self-Attention (Query · Key · Value 문맥 연관도 계산)</span>
            <span>현재 단계: STEP 0${s + 1}</span>
          </div>
          <svg viewBox="0 0 760 220" class="w-full h-auto min-w-[560px]">
            ${commonDefs}
            <rect x="18" y="24" width="120" height="42" rx="6" fill="#f3efe6" stroke="#2c3e50" stroke-width="1.8"/>
            <text x="78" y="50" text-anchor="middle" font-size="15" font-weight="700" fill="#1c1917">"은행에"</text>

            <rect x="18" y="88" width="120" height="42" rx="6" fill="#f3efe6" stroke="#7c5e3c" stroke-width="2"/>
            <text x="78" y="114" text-anchor="middle" font-size="15" font-weight="700" fill="#7c5e3c">"예금을"</text>

            <rect x="18" y="152" width="120" height="42" rx="6" fill="#2c3e50"/>
            <text x="78" y="178" text-anchor="middle" font-size="15" font-weight="700" fill="#ffffff">"맡겼다"</text>

            <path d="M 138 45 L 275 68" stroke="#7c5e3c" stroke-width="3" class="svg-flow-fast" marker-end="url(#arrBronze)"/>
            <path d="M 138 109 L 275 109" stroke="#7c5e3c" stroke-width="3.5" class="svg-flow-fast" marker-end="url(#arrBronze)"/>
            <path d="M 138 173 L 275 150" stroke="#2c3e50" stroke-width="2.2" class="svg-flow-line" marker-end="url(#arrNavy)"/>

            <rect x="284" y="28" width="215" height="162" rx="10" fill="#f3efe6" stroke="#2c3e50" stroke-width="2"/>
            <text x="391" y="56" text-anchor="middle" font-size="15.5" font-weight="700" fill="#2c3e50">Self-Attention 메커니즘</text>
            <rect x="304" y="72" width="52" height="32" rx="5" fill="#2c3e50"/><text x="330" y="93" text-anchor="middle" font-size="14" font-weight="700" fill="#ffffff">Q</text>
            <rect x="365" y="72" width="52" height="32" rx="5" fill="#7c5e3c"/><text x="391" y="93" text-anchor="middle" font-size="14" font-weight="700" fill="#ffffff">K</text>
            <rect x="426" y="72" width="52" height="32" rx="5" fill="#1f5f4b"/><text x="452" y="93" text-anchor="middle" font-size="14" font-weight="700" fill="#ffffff">V</text>
            <text x="391" y="132" text-anchor="middle" font-size="13" font-family="JetBrains Mono" font-weight="600" fill="#1c1917">Softmax(Q·K^T / √d_k) · V</text>
            <text x="391" y="160" text-anchor="middle" font-size="13" fill="#7c5e3c" font-weight="600">문장 내 모든 단어 간 관련도 계산</text>

            <line x1="499" y1="109" x2="548" y2="109" stroke="#1f5f4b" stroke-width="2.5" class="svg-flow-fast" marker-end="url(#arrEmerald)"/>

            <rect x="556" y="42" width="186" height="134" rx="10" fill="#2c3e50" class="svg-pulse-node"/>
            <text x="649" y="78" text-anchor="middle" font-size="15" font-weight="700" fill="#ffffff">문맥 파악 완료</text>
            <text x="649" y="108" text-anchor="middle" font-size="14" font-weight="700" fill="#fcd34d">"은행" = 금융기관 (97%)</text>
            <text x="649" y="136" text-anchor="middle" font-size="12.5" fill="#e7e5e4">"예금"과의 강한 어텐션으로</text>
            <text x="649" y="156" text-anchor="middle" font-size="12.5" fill="#e7e5e4">동음이의어 모호성 완벽 해결</text>
          </svg>
        </div>
      `;
    }

    // 2.3 강화학습 (p2-reinforcement-learning / 2.3)
    if (sec === '2.3' || id === 'p2-reinforcement-learning') {
      return `
        <div class="${pauseClass} space-y-2">
          <div class="flex items-center justify-between text-xs font-mono-code font-bold text-[#7c5e3c]">
            <span>FIGURE ${escapeHtml(sec)} · 강화학습(MDP · PPO · GRPO) 상태-행동-보상 피드백 루프</span>
            <span>현재 단계: STEP 0${s + 1}</span>
          </div>
          <svg viewBox="0 0 760 220" class="w-full h-auto min-w-[560px]">
            ${commonDefs}
            <rect x="24" y="54" width="215" height="110" rx="10" fill="#2c3e50" class="svg-pulse-node"/>
            <text x="131" y="90" text-anchor="middle" font-size="16" font-weight="700" fill="#ffffff">에이전트 (Agent)</text>
            <text x="131" y="116" text-anchor="middle" font-size="13.5" fill="#fcd34d">정책 신경망 π_θ (s_t)</text>
            <text x="131" y="142" text-anchor="middle" font-size="12.5" fill="#e7e5e4">GRPO: 여러 추론 답안 동시 생성</text>

            <path d="M 239 78 Q 380 18 512 78" fill="none" stroke="#2c3e50" stroke-width="2.8" class="svg-flow-fast" marker-end="url(#arrNavy)"/>
            <rect x="285" y="16" width="190" height="32" rx="6" fill="#f3efe6" stroke="#2c3e50" stroke-width="1.5"/>
            <text x="380" y="37" text-anchor="middle" font-size="14" font-weight="700" fill="#2c3e50">행동 선택 · 추론 과정 (a_t)</text>

            <rect x="520" y="54" width="216" height="110" rx="10" fill="#f3efe6" stroke="#7c5e3c" stroke-width="2.2"/>
            <text x="628" y="90" text-anchor="middle" font-size="16" font-weight="700" fill="#1c1917">환경 · 검증기 (Verifier)</text>
            <text x="628" y="116" text-anchor="middle" font-size="13.5" fill="#7c5e3c">코드 테스트 · 수학 정답 채점</text>
            <text x="628" y="142" text-anchor="middle" font-size="13" font-weight="700" fill="#1f5f4b">그룹 상대 이득 A_i = (r_i - μ)/σ</text>

            <path d="M 520 142 Q 380 204 245 142" fill="none" stroke="#7c5e3c" stroke-width="2.8" class="svg-flow-fast" marker-end="url(#arrBronze)"/>
            <rect x="260" y="166" width="240" height="34" rx="6" fill="#f3efe6" stroke="#7c5e3c" stroke-width="1.5"/>
            <text x="380" y="188" text-anchor="middle" font-size="14" font-weight="700" fill="#7c5e3c">다음 상태(s_t+1) + 보상 점수(Reward r_t)</text>
          </svg>
        </div>
      `;
    }

    // 3.1 온톨로지 (p3-ontology-core / 3.1)
    if (sec === '3.1' || id === 'p3-ontology-core') {
      return `
        <div class="${pauseClass} space-y-2">
          <div class="flex items-center justify-between text-xs font-mono-code font-bold text-[#7c5e3c]">
            <span>FIGURE ${escapeHtml(sec)} · 온톨로지 4대 구성요소 (Class · Property · Axiom · Reasoner 추론기)</span>
            <span>현재 단계: STEP 0${s + 1}</span>
          </div>
          <svg viewBox="0 0 760 225" class="w-full h-auto min-w-[560px]">
            ${commonDefs}
            <rect x="18" y="18" width="170" height="44" rx="6" fill="#2c3e50"/>
            <text x="103" y="45" text-anchor="middle" font-size="15" font-weight="700" fill="#ffffff">상위 클래스: 임직원</text>

            <line x1="60" y1="62" x2="60" y2="94" stroke="#2c3e50" stroke-width="2"/>
            <line x1="146" y1="62" x2="146" y2="94" stroke="#2c3e50" stroke-width="2"/>

            <rect x="14" y="94" width="92" height="42" rx="6" fill="#f3efe6" stroke="#1f5f4b" stroke-width="2"/>
            <text x="60" y="120" text-anchor="middle" font-size="14" font-weight="700" fill="#1f5f4b">정직원</text>

            <rect x="114" y="94" width="92" height="42" rx="6" fill="#f3efe6" stroke="#7c5e3c" stroke-width="2"/>
            <text x="160" y="120" text-anchor="middle" font-size="14" font-weight="700" fill="#7c5e3c">인턴</text>

            <rect x="18" y="152" width="188" height="42" rx="6" fill="#ebe6dc" stroke="#7c5e3c" stroke-width="1.8" stroke-dasharray="4 3"/>
            <text x="112" y="178" text-anchor="middle" font-size="13" font-weight="700" fill="#7c5e3c">공리(Axiom): 상호배타(Disjoint)</text>

            <line x1="106" y1="115" x2="306" y2="62" stroke="#1f5f4b" stroke-width="2.5" class="svg-flow-fast" marker-end="url(#arrEmerald)"/>
            <rect x="172" y="52" width="124" height="28" rx="5" fill="#faf8f3" stroke="#1f5f4b" stroke-width="1.5"/>
            <text x="234" y="71" text-anchor="middle" font-size="12.5" font-weight="700" fill="#1f5f4b">열람권한(Property)</text>

            <rect x="314" y="30" width="176" height="62" rx="8" fill="#f3efe6" stroke="#2c3e50" stroke-width="2"/>
            <text x="402" y="58" text-anchor="middle" font-size="15" font-weight="700" fill="#1c1917">클래스: 1급 기밀문서</text>
            <text x="402" y="80" text-anchor="middle" font-size="12.5" fill="#7c5e3c" font-weight="600">ONLY 정직원 접근 허용</text>

            <rect x="304" y="118" width="196" height="76" rx="8" fill="#2c3e50" class="svg-pulse-node"/>
            <text x="402" y="150" text-anchor="middle" font-size="15.5" font-weight="700" fill="#ffffff">추론기 (OWL Reasoner)</text>
            <text x="402" y="174" text-anchor="middle" font-size="13" fill="#fcd34d">숨은 관계 도출 · 규칙 위반 차단</text>

            <line x1="500" y1="156" x2="546" y2="156" stroke="#2c3e50" stroke-width="2.5" class="svg-flow-fast" marker-end="url(#arrNavy)"/>

            <rect x="554" y="34" width="188" height="160" rx="10" fill="#f3efe6" stroke="#1f5f4b" stroke-width="2"/>
            <text x="648" y="68" text-anchor="middle" font-size="15" font-weight="700" fill="#1f5f4b">온톨로지 검증 결과</text>
            <text x="648" y="102" text-anchor="middle" font-size="13.5" font-weight="700" fill="#1c1917">[승인] 정직원 → 열람 가능</text>
            <text x="648" y="132" text-anchor="middle" font-size="13.5" font-weight="700" fill="#9f1239">[차단] 인턴 → 공리 위반!</text>
            <text x="648" y="166" text-anchor="middle" font-size="12.5" fill="#57534e">LLM 환각에 의존하지 않는</text>
            <text x="648" y="184" text-anchor="middle" font-size="12.5" fill="#57534e">결정론적 기업 지식 설계도</text>
          </svg>
        </div>
      `;
    }

    // 3.2 지식 그래프 & 3.3 임베딩/GraphRAG (3.2, 3.3)
    if (sec === '3.2' || sec === '3.3' || id === 'p3-knowledge-graph' || id === 'p3-graphrag-embedding') {
      return `
        <div class="${pauseClass} space-y-2">
          <div class="flex items-center justify-between text-xs font-mono-code font-bold text-[#7c5e3c]">
            <span>FIGURE ${escapeHtml(sec)} · 지식 그래프 다중 홉(Multi-hop) 관계 추론과 하이브리드 GraphRAG</span>
            <span>현재 단계: STEP 0${s + 1}</span>
          </div>
          <svg viewBox="0 0 760 220" class="w-full h-auto min-w-[560px]">
            ${commonDefs}
            <rect x="18" y="20" width="235" height="68" rx="8" fill="#f3efe6" stroke="#2c3e50" stroke-width="1.8"/>
            <text x="135" y="48" text-anchor="middle" font-size="15" font-weight="700" fill="#2c3e50">1. 벡터 임베딩 검색 (Vector DB)</text>
            <text x="135" y="72" text-anchor="middle" font-size="13" fill="#57534e">의미 유사도로 시작 개체(Node) 탐색</text>

            <!-- Multi-hop nodes -->
            <rect x="18" y="122" width="110" height="68" rx="8" fill="#2c3e50"/>
            <text x="73" y="152" text-anchor="middle" font-size="14.5" font-weight="700" fill="#ffffff">장애 부품 A</text>
            <text x="73" y="174" text-anchor="middle" font-size="12" fill="#fcd34d">주어 (Subject)</text>

            <line x1="128" y1="156" x2="196" y2="156" stroke="#7c5e3c" stroke-width="2.5" class="svg-flow-fast" marker-end="url(#arrBronze)"/>
            <text x="162" y="144" text-anchor="middle" font-size="12" font-weight="700" fill="#7c5e3c">탑재됨(1-Hop)</text>

            <rect x="202" y="122" width="110" height="68" rx="8" fill="#f3efe6" stroke="#7c5e3c" stroke-width="2"/>
            <text x="257" y="152" text-anchor="middle" font-size="14.5" font-weight="700" fill="#1c1917">결제 모듈 B</text>
            <text x="257" y="174" text-anchor="middle" font-size="12" fill="#7c5e3c">매개 노드</text>

            <line x1="312" y1="156" x2="380" y2="156" stroke="#7c5e3c" stroke-width="2.5" class="svg-flow-fast" marker-end="url(#arrBronze)"/>
            <text x="346" y="144" text-anchor="middle" font-size="12" font-weight="700" fill="#7c5e3c">담당팀(2-Hop)</text>

            <rect x="386" y="122" width="114" height="68" rx="8" fill="#f3efe6" stroke="#1f5f4b" stroke-width="2.2" class="svg-pulse-node"/>
            <text x="443" y="152" text-anchor="middle" font-size="14.5" font-weight="700" fill="#1f5f4b">보안인프라팀</text>
            <text x="443" y="174" text-anchor="middle" font-size="12" fill="#44403c">최종 타겟 도출</text>

            <path d="M 253 54 C 380 54, 440 88, 526 88" fill="none" stroke="#2c3e50" stroke-width="2.2" class="svg-flow-line" marker-end="url(#arrNavy)"/>
            <path d="M 500 156 C 515 156, 515 125, 526 125" fill="none" stroke="#1f5f4b" stroke-width="2.2" class="svg-flow-line" marker-end="url(#arrEmerald)"/>

            <rect x="534" y="42" width="208" height="148" rx="10" fill="#2c3e50"/>
            <text x="638" y="82" text-anchor="middle" font-size="16" font-weight="700" fill="#ffffff">Hybrid GraphRAG</text>
            <text x="638" y="112" text-anchor="middle" font-size="13.5" fill="#fcd34d">벡터 문맥 + 그래프 관계 경로</text>
            <text x="638" y="142" text-anchor="middle" font-size="12.5" fill="#e7e5e4">단순 문서 검색이 못 찾는</text>
            <text x="638" y="164" text-anchor="middle" font-size="12.5" fill="#e7e5e4">다중 인과관계를 정확히 추론</text>
          </svg>
        </div>
      `;
    }

    // Part 4 (LLM · 멀티모달 · MoE · 루프 트랜스포머 · System 1)
    if (Number(item.chapter) === 4) {
      return `
        <div class="${pauseClass} space-y-2">
          <div class="flex items-center justify-between text-xs font-mono-code font-bold text-[#7c5e3c]">
            <span>FIGURE ${escapeHtml(sec)} · 차세대 LLM 신경망 아키텍처 (선택적 전문가 라우팅 &amp; 고효율 추론)</span>
            <span>현재 단계: STEP 0${s + 1}</span>
          </div>
          <svg viewBox="0 0 760 220" class="w-full h-auto min-w-[560px]">
            ${commonDefs}
            <rect x="18" y="62" width="150" height="96" rx="8" fill="#f3efe6" stroke="#2c3e50" stroke-width="2"/>
            <text x="93" y="102" text-anchor="middle" font-size="15" font-weight="700" fill="#1c1917">입력 프롬프트</text>
            <text x="93" y="128" text-anchor="middle" font-size="13" fill="#7c5e3c">텍스트 · 이미지 · 음성</text>

            <line x1="168" y1="110" x2="222" y2="110" stroke="#2c3e50" stroke-width="2.5" class="svg-flow-line" marker-end="url(#arrNavy)"/>

            <rect x="230" y="54" width="150" height="112" rx="10" fill="#2c3e50" class="svg-pulse-node"/>
            <text x="305" y="96" text-anchor="middle" font-size="15.5" font-weight="700" fill="#ffffff">라우터 / 제어 게이트</text>
            <text x="305" y="122" text-anchor="middle" font-size="13" fill="#fcd34d">필요한 전문가·경로만</text>
            <text x="305" y="142" text-anchor="middle" font-size="13" fill="#fcd34d">실시간 선택 활성화</text>

            <path d="M 380 82 L 446 44" stroke="#1f5f4b" stroke-width="2.5" class="svg-flow-fast" marker-end="url(#arrEmerald)"/>
            <path d="M 380 110 L 446 110" stroke="#ccc4b4" stroke-width="1.8" stroke-dasharray="4 4"/>
            <path d="M 380 138 L 446 176" stroke="#7c5e3c" stroke-width="2.5" class="svg-flow-fast" marker-end="url(#arrBronze)"/>

            <rect x="454" y="20" width="150" height="48" rx="6" fill="#f3efe6" stroke="#1f5f4b" stroke-width="2"/>
            <text x="529" y="49" text-anchor="middle" font-size="14" font-weight="700" fill="#1f5f4b">활성 전문가 A (ON)</text>

            <rect x="454" y="86" width="150" height="48" rx="6" fill="#ebe6dc" stroke="#ccc4b4"/>
            <text x="529" y="115" text-anchor="middle" font-size="13.5" fill="#78716c">휴면 전문가 B (절전)</text>

            <rect x="454" y="152" width="150" height="48" rx="6" fill="#f3efe6" stroke="#7c5e3c" stroke-width="2"/>
            <text x="529" y="181" text-anchor="middle" font-size="14" font-weight="700" fill="#7c5e3c">활성 전문가 C (ON)</text>

            <path d="M 604 44 L 638 92" stroke="#1f5f4b" stroke-width="2" class="svg-flow-line"/>
            <path d="M 604 176 L 638 128" stroke="#7c5e3c" stroke-width="2" class="svg-flow-line"/>

            <rect x="640" y="62" width="104" height="96" rx="8" fill="#2c3e50"/>
            <text x="692" y="102" text-anchor="middle" font-size="14.5" font-weight="700" fill="#ffffff">초고속 출력</text>
            <text x="692" y="128" text-anchor="middle" font-size="12.5" fill="#fcd34d">연산비 대폭 절감</text>
          </svg>
        </div>
      `;
    }

    // Part 5 (자율 에이전트 하네스 · MCP · A2A · 체화된 에이전트 · 증류/RSI)
    if (Number(item.chapter) === 5) {
      return `
        <div class="${pauseClass} space-y-2">
          <div class="flex items-center justify-between text-xs font-mono-code font-bold text-[#7c5e3c]">
            <span>FIGURE ${escapeHtml(sec)} · 에이전틱 하네스(Harness) 및 MCP / A2A 표준 프로토콜 아키텍처</span>
            <span>현재 단계: STEP 0${s + 1}</span>
          </div>
          <svg viewBox="0 0 760 220" class="w-full h-auto min-w-[560px]">
            ${commonDefs}
            <rect x="18" y="24" width="175" height="72" rx="8" fill="#f3efe6" stroke="#7c5e3c" stroke-width="2"/>
            <text x="105" y="54" text-anchor="middle" font-size="14.5" font-weight="700" fill="#7c5e3c">영구 메모리 &amp; 스킬북</text>
            <text x="105" y="78" text-anchor="middle" font-size="12.5" fill="#44403c">세션 간 경험·지식 보존</text>

            <rect x="18" y="122" width="175" height="72" rx="8" fill="#f3efe6" stroke="#2c3e50" stroke-width="2"/>
            <text x="105" y="152" text-anchor="middle" font-size="14.5" font-weight="700" fill="#2c3e50">목표 관리 &amp; 스케줄러</text>
            <text x="105" y="176" text-anchor="middle" font-size="12.5" fill="#44403c">24시간 상시 작업 루프</text>

            <line x1="193" y1="60" x2="262" y2="92" stroke="#7c5e3c" stroke-width="2.2" class="svg-flow-line" marker-end="url(#arrBronze)"/>
            <line x1="193" y1="158" x2="262" y2="126" stroke="#2c3e50" stroke-width="2.2" class="svg-flow-line" marker-end="url(#arrNavy)"/>

            <rect x="270" y="48" width="205" height="122" rx="10" fill="#2c3e50" class="svg-pulse-node"/>
            <text x="372" y="86" text-anchor="middle" font-size="16" font-weight="700" fill="#ffffff">에이전틱 하네스 본체</text>
            <text x="372" y="114" text-anchor="middle" font-size="13.5" fill="#fcd34d">관찰 → 계획 → 실행 → 자기검증</text>
            <text x="372" y="142" text-anchor="middle" font-size="12.5" font-family="JetBrains Mono" fill="#e7e5e4">MCP / A2A Standard Bus</text>

            <line x1="475" y1="80" x2="546" y2="44" stroke="#1f5f4b" stroke-width="2.5" class="svg-flow-fast" marker-end="url(#arrEmerald)"/>
            <line x1="475" y1="109" x2="546" y2="109" stroke="#1f5f4b" stroke-width="2.5" class="svg-flow-fast" marker-end="url(#arrEmerald)"/>
            <line x1="475" y1="138" x2="546" y2="174" stroke="#1f5f4b" stroke-width="2.5" class="svg-flow-fast" marker-end="url(#arrEmerald)"/>

            <rect x="554" y="18" width="188" height="50" rx="6" fill="#f3efe6" stroke="#1f5f4b" stroke-width="1.8"/>
            <text x="648" y="48" text-anchor="middle" font-size="14" font-weight="700" fill="#1c1917">MCP 도구 (터미널·DB·웹)</text>

            <rect x="554" y="84" width="188" height="50" rx="6" fill="#f3efe6" stroke="#1f5f4b" stroke-width="1.8"/>
            <text x="648" y="114" text-anchor="middle" font-size="14" font-weight="700" fill="#1c1917">물리·가상 환경 제어 API</text>

            <rect x="554" y="150" width="188" height="50" rx="6" fill="#f3efe6" stroke="#1f5f4b" stroke-width="1.8"/>
            <text x="648" y="180" text-anchor="middle" font-size="14" font-weight="700" fill="#1c1917">동료 에이전트 협업 (A2A)</text>
          </svg>
        </div>
      `;
    }

    // Part 6 및 기타 단원 (양자화 · vLLM · 오픈웨이트 · 벤치마크 · 신규 단원)
    const steps = item.processSteps || [
      { title: '1단계', nodes: ['입력 데이터'] },
      { title: '2단계', nodes: ['핵심 처리'] },
      { title: '3단계', nodes: ['최적화 연동'] },
      { title: '4단계', nodes: ['검증 출력'] }
    ];
    const labels = steps.map((st, idx) => (st.nodes && st.nodes[0]) ? st.nodes[0] : `단계 0${idx + 1}`);

    return `
      <div class="${pauseClass} space-y-2">
        <div class="flex items-center justify-between text-xs font-mono-code font-bold text-[#7c5e3c]">
          <span>FIGURE ${escapeHtml(sec)} · 핵심 엔지니어링 파이프라인 및 데이터 흐름도</span>
          <span>현재 활성 단계: STEP 0${s + 1}</span>
        </div>
        <svg viewBox="0 0 760 205" class="w-full h-auto min-w-[560px]">
          ${commonDefs}
          ${[0, 1, 2, 3].map(idx => {
            const x = 18 + idx * 184;
            const isCur = idx === s;
            const lbl = labels[idx] || `STAGE 0${idx + 1}`;
            return `
              <rect x="${x}" y="32" width="158" height="96" rx="9"
                fill="${isCur ? '#2c3e50' : '#f3efe6'}"
                stroke="${isCur ? '#1c1917' : '#2c3e50'}"
                stroke-width="${isCur ? '2.5' : '1.8'}"
                class="${isCur ? 'svg-pulse-node' : ''}"/>
              <text x="${x + 79}" y="64" text-anchor="middle" font-size="12.5" font-family="JetBrains Mono" font-weight="700" fill="${isCur ? '#fcd34d' : '#7c5e3c'}">STAGE 0${idx + 1}</text>
              <text x="${x + 79}" y="96" text-anchor="middle" font-size="14.5" font-weight="700" fill="${isCur ? '#ffffff' : '#1c1917'}">${escapeHtml(lbl.slice(0, 11))}</text>
              ${idx < 3 ? `<line x1="${x + 158}" y1="80" x2="${x + 182}" y2="80" stroke="#7c5e3c" stroke-width="2.5" class="svg-flow-fast" marker-end="url(#arrBronze)"/>` : ''}
            `;
          }).join('')}
          <path d="M 670 128 Q 380 185 95 128" fill="none" stroke="#2c3e50" stroke-width="2" class="svg-flow-line" marker-end="url(#arrNavy)"/>
          <text x="380" y="182" text-anchor="middle" font-size="12.5" font-family="JetBrains Mono" font-weight="600" fill="#44403c">CONTINUOUS VERIFICATION &amp; OPTIMIZATION LOOP</text>
        </svg>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // 6. 상단/사이드바 진도율 렌더링
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
    renderSidebarTree();
  }

  // --------------------------------------------------------------------------
  // 7. VIEW 0: 첫 표지 · 첫 페이지(인사말·소개) · 마스터 목차 렌더링
  // --------------------------------------------------------------------------
  function renderTocView() {
    renderProgress();

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
        box.className = 'text-left p-5 rounded-xl bg-[#f3efe6] hover:bg-[#eae4d7] border border-[#dcd6c8] transition flex flex-col justify-between group shadow-sm';
        box.innerHTML = `
          <div>
            <div class="flex items-center justify-between text-xs font-mono-code font-bold text-[#7c5e3c]">
              <span>${escapeHtml(ch.badge)}</span>
              <span>${escapeHtml(pageRange)}</span>
            </div>
            <div class="text-base sm:text-lg font-serif-book font-bold text-stone-900 mt-1.5 group-hover:text-[#2c3e50]">${escapeHtml(ch.title)}</div>
            <p class="text-xs sm:text-sm text-stone-600 mt-1.5 leading-relaxed">${escapeHtml(ch.subtitle)}</p>
          </div>
          <div class="mt-4 pt-2.5 border-t border-[#e2ddd3] flex items-center justify-between text-xs">
            <span class="text-stone-500 font-medium">${escapeHtml(ch.targetLevel || '')}</span>
            <span class="font-bold text-[#2c3e50]">단원 ${chTerms.length}개 읽기 →</span>
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
        ? 'toc-diff-btn px-3 py-1.5 rounded text-xs font-semibold bg-[#2c3e50] text-stone-100 transition'
        : 'toc-diff-btn px-3 py-1.5 rounded text-xs font-medium bg-[#faf8f3] text-stone-700 border border-[#ccc4b4] hover:bg-stone-200 transition';
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
      partWrap.className = 'space-y-2';

      const pageRange = getChapterPageRange(ch.id);
      const header = document.createElement('div');
      header.className = 'text-sm sm:text-base font-serif-book font-bold text-stone-900 border-b border-[#ccc4b4] pb-1.5 flex items-center justify-between';
      header.innerHTML = `
        <span>${escapeHtml(ch.badge)} — ${escapeHtml(ch.title)}</span>
        <span class="text-xs font-mono-code font-normal text-stone-500">${escapeHtml(pageRange)}</span>
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
        row.className = 'w-full text-left py-2 px-3 rounded-lg hover:bg-[#eae4d7] transition flex items-baseline justify-between gap-2 group';
        row.innerHTML = `
          <div class="flex items-baseline gap-2.5 min-w-0">
            <span class="text-xs sm:text-sm font-mono-code font-bold text-[#7c5e3c] shrink-0">[${escapeHtml(secCode)}]</span>
            <span class="text-sm sm:text-base font-medium text-stone-900 group-hover:text-[#2c3e50] truncate">${escapeHtml(item.term)}</span>
            <span class="text-xs px-2 py-0.5 rounded border ${diffMeta.colorClass} shrink-0 hidden sm:inline-block">${diffMeta.badge}</span>
            ${isLearned ? '<span class="text-xs px-2 py-0.5 rounded bg-stone-800 text-stone-100 shrink-0">완독</span>' : ''}
            ${isQuizPassed ? '<span class="text-xs px-2 py-0.5 rounded bg-emerald-800 text-stone-100 shrink-0">퀴즈통과</span>' : ''}
            ${isBookmarked ? '<span class="text-xs px-2 py-0.5 rounded bg-amber-200 text-amber-950 shrink-0">책갈피</span>' : ''}
          </div>
          <div class="flex-1 border-b border-dotted border-stone-400 mx-2 min-w-[20px]"></div>
          <span class="text-xs sm:text-sm font-serif-book font-bold text-stone-700 shrink-0">p. ${pageNumStr}</span>
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
    switchMainView('ebook');
  }

  // --------------------------------------------------------------------------
  // 8. VIEW 1: 단행본 본문 챕터 리더 렌더링 (가독성 최우선 대형 레이아웃)
  // --------------------------------------------------------------------------
  function renderBookSpreadView() {
    renderProgress();

    const totalPages = appState.terms.length;
    if (totalPages === 0) return;
    if (appState.currentPageIdx >= totalPages) appState.currentPageIdx = totalPages - 1;
    if (appState.currentPageIdx < 0) appState.currentPageIdx = 0;

    const currentItem = appState.terms[appState.currentPageIdx];
    const currentChapter = window.CHAPTERS.find(c => Number(c.id) === Number(currentItem.chapter)) || window.CHAPTERS[0];
    appState.selectedChapter = currentChapter.id;

    const pageNumStr = String(appState.currentPageIdx + 1).padStart(2, '0');
    const secCodeStr = currentItem.sectionCode || `${currentChapter.id}.1`;
    const diffMeta = getDifficultyMeta(currentItem.difficulty);
    const layerObj = window.ARCH_LAYERS.find(l => l.id === currentItem.layer) || window.ARCH_LAYERS[0];

    document.getElementById('leftPagePartHeader').textContent = `${currentChapter.badge} — ${currentChapter.title}`;
    document.getElementById('leftPageLayerBtn').textContent = `${currentItem.layer} · ${layerObj.name.replace(' 계층', '')}`;
    document.getElementById('leftPageSectionNum').textContent = `CHAPTER ${secCodeStr} · PAGE ${pageNumStr} OF ${String(totalPages).padStart(2, '0')}`;

    const diffBadgeEl = document.getElementById('leftPageDifficultyBadge');
    if (diffBadgeEl) {
      diffBadgeEl.className = `text-xs font-semibold px-3 py-1 rounded border ${diffMeta.colorClass}`;
      diffBadgeEl.textContent = diffMeta.label;
    }

    document.getElementById('leftPageTitle').textContent = currentItem.term;
    document.getElementById('leftPageAnalogy').textContent = currentItem.analogy;

    // 제1절: 본문 상세 해설 및 실무 노트
    document.getElementById('leftPageDefinition').innerHTML = formatReadableHtml(currentItem.definition);
    document.getElementById('leftPageDeepNote').innerHTML = formatReadableHtml(
      currentItem.deepNote || `실무 요약: 이 개념은 ${layerObj.name}에서 핵심적인 역할을 담당합니다.`
    );

    // 제3절: 탭으로 숨기지 않고 입문 / 중급 / 심화 3단계를 한눈에 읽는 카드 + 공부 순서
    const multiDepthEl = document.getElementById('multiDepthCardsContainer');
    if (multiDepthEl) {
      const lv = currentItem.levels || {};
      const begText = lv.beginner || currentItem.analogy;
      const intText = lv.intermediate || currentItem.definition;
      const advText = lv.advanced || currentItem.deepNote || currentItem.definition;

      multiDepthEl.innerHTML = `
        <div class="bg-[#f3efe6] border border-[#dcd6c8] rounded-xl p-5 space-y-2.5 flex flex-col justify-between">
          <div class="space-y-2">
            <span class="inline-block text-xs font-mono-code font-bold px-2.5 py-1 rounded bg-emerald-900/10 text-emerald-900 border border-emerald-800/30">STEP 1 · Lv.1 입문 개념</span>
            <p class="text-sm sm:text-[15px] text-stone-800 leading-[1.85]">${escapeHtml(begText.replace(/^입문\s*개념:\s*/, ''))}</p>
          </div>
        </div>
        <div class="bg-[#f3efe6] border border-[#dcd6c8] rounded-xl p-5 space-y-2.5 flex flex-col justify-between">
          <div class="space-y-2">
            <span class="inline-block text-xs font-mono-code font-bold px-2.5 py-1 rounded bg-amber-900/15 text-amber-950 border border-amber-800/40">STEP 2 · Lv.3 중급 원리</span>
            <p class="text-sm sm:text-[15px] text-stone-800 leading-[1.85]">${escapeHtml(intText.replace(/^중급\s*원리:\s*/, ''))}</p>
          </div>
        </div>
        <div class="bg-[#f3efe6] border border-[#dcd6c8] rounded-xl p-5 space-y-2.5 flex flex-col justify-between">
          <div class="space-y-2">
            <span class="inline-block text-xs font-mono-code font-bold px-2.5 py-1 rounded bg-rose-900/15 text-rose-950 border border-rose-800/40">STEP 3 · Lv.4 심화 엔지니어링</span>
            <p class="text-sm sm:text-[15px] text-stone-800 leading-[1.85]">${escapeHtml(advText.replace(/^심화\s*엔지니어링:\s*/, ''))}</p>
          </div>
        </div>
      `;
    }

    const studyOrderEl = document.getElementById('studyOrderStepsContainer');
    if (studyOrderEl) {
      studyOrderEl.innerHTML = formatStudyStepsHtml(currentItem.studyGuide);
    }

    // 제4절: 핵심 용어 미니 사전 (keyTerms) — 큰 글씨 적용
    const glossaryBox = document.getElementById('leftPageKeyTermsBox');
    const glossaryList = document.getElementById('leftPageKeyTermsList');
    if (glossaryBox && glossaryList) {
      const kTerms = currentItem.keyTerms || [];
      if (kTerms.length > 0) {
        glossaryBox.classList.remove('hidden');
        glossaryList.innerHTML = kTerms.map((kt, idx) => `
          <div class="bg-[#f3efe6] border border-[#dcd6c8] rounded-xl p-4 sm:p-5 space-y-1.5">
            <div class="flex items-center gap-2">
              <span class="text-xs font-mono-code font-bold px-2 py-0.5 rounded bg-[#ebe6dc] text-[#7c5e3c]">TERM 0${idx + 1}</span>
              <h3 class="text-base font-serif-book font-bold text-[#2c3e50]">${escapeHtml(kt.term)}</h3>
            </div>
            <p class="text-sm sm:text-[15px] text-stone-700 leading-[1.8] pt-0.5">${escapeHtml(kt.desc)}</p>
          </div>
        `).join('');
      } else {
        glossaryBox.classList.add('hidden');
      }
    }

    // 추천 직군 배지 & 연계 도구 렌더링
    const rolesContainer = document.getElementById('leftPageRolesContainer');
    if (rolesContainer) {
      rolesContainer.innerHTML = '';
      (currentItem.roles || ['pm', 'app-be']).forEach(rId => {
        const rMeta = getRoleMeta(rId);
        if (!rMeta) return;
        const badge = document.createElement('button');
        badge.type = 'button';
        badge.className = 'text-xs font-semibold px-3 py-1 rounded-lg bg-[#f3efe6] hover:bg-[#e6dfd1] text-[#7c5e3c] border border-[#d6cfc2] transition';
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
        chip.className = 'text-xs sm:text-sm font-medium px-3 py-1 rounded-lg bg-[#ebe6dc] hover:bg-[#dfd9cc] text-stone-800 border border-[#ccc4b4] transition';
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

    // 하단 페이지 번호 및 이전/다음 단원 제목 표시
    document.getElementById('leftPageNumber').textContent = `Page ${pageNumStr} of ${String(totalPages).padStart(2, '0')} · [${secCodeStr}]`;

    const mobIndicator = document.getElementById('mobileDockPageIndicator');
    if (mobIndicator) {
      mobIndicator.textContent = `p.${pageNumStr} / ${String(totalPages).padStart(2, '0')} (${secCodeStr})`;
    }

    const isBookmarked = !!appState.bookmarkedIds[currentItem.id];
    const isLearned = !!appState.learnedIds[currentItem.id];

    const bmBtn = document.getElementById('btnToggleBookmark');
    if (bmBtn) {
      bmBtn.textContent = isBookmarked ? '[책갈피 설정됨]' : '책갈피 추가';
      bmBtn.className = 'px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium border transition ' +
        (isBookmarked ? 'bg-amber-900/15 border-amber-800/50 text-amber-950 font-semibold' : 'border-[#ccc4b4] bg-[#f3efe6] text-stone-700 hover:bg-stone-200');
    }

    const learnBtn = document.getElementById('btnToggleLearned');
    if (learnBtn) {
      learnBtn.textContent = isLearned ? '[완독 완료됨]' : '학습 완료 표시';
      learnBtn.className = 'px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold border transition ' +
        (isLearned ? 'bg-emerald-800 border-emerald-800 text-white' : 'border-[#2c3e50] bg-[#2c3e50] text-white hover:bg-[#1e2b38]');
    }

    // 이전/다음 단원 하단 카드 업데이트
    const prevBtn = document.getElementById('btnPrevPage');
    const prevLbl = document.getElementById('prevChapterLabel');
    const nextLbl = document.getElementById('nextChapterLabel');

    if (prevBtn && prevLbl) {
      if (appState.currentPageIdx > 0) {
        const prevItem = appState.terms[appState.currentPageIdx - 1];
        prevBtn.disabled = false;
        prevBtn.className = 'flex-1 text-left p-4 rounded-xl bg-[#f3efe6] hover:bg-[#eae4d7] border border-[#ccc4b4] transition';
        prevLbl.textContent = `[${prevItem.sectionCode}] ${prevItem.term}`;
      } else {
        prevBtn.disabled = false;
        prevLbl.textContent = '00. 첫 표지 · 여는 글 (서문)으로 이동';
      }
    }

    if (nextLbl) {
      if (appState.currentPageIdx < totalPages - 1) {
        const nextItem = appState.terms[appState.currentPageIdx + 1];
        nextLbl.textContent = `[${nextItem.sectionCode}] ${nextItem.term}`;
      } else {
        nextLbl.textContent = '전체 목차(서문)로 돌아가기';
      }
    }

    // 제2절 대형 애니메이션 도판 및 제5절 코드·퀴즈 렌더링
    renderRightLabPage(currentItem);
  }

  function triggerPageFlipAnimation() {
    const spread = document.getElementById('bookSpreadContainer');
    if (!spread) return;
    spread.classList.remove('page-turn-effect');
    void spread.offsetWidth;
    spread.classList.add('page-turn-effect');
  }

  // --------------------------------------------------------------------------
  // 9. 제2절 대형 애니메이션 도판 & 제5절 코딩/퀴즈 렌더링
  // --------------------------------------------------------------------------
  function renderRightLabPage(item) {
    const steps = item.processSteps || [
      { title: '1단계: 개념 정의 및 입력', desc: '입력 데이터와 도메인 규칙이 시스템으로 전달됩니다.', nodes: ['데이터 유입', '전처리', '컨텍스트 구성', '준비 완료'] },
      { title: '2단계: 핵심 아키텍처 작동', desc: item.term + ' 핵심 메커니즘이 작동합니다.', nodes: ['핵심 연산 가동', '파라미터/규칙 활성화', '최적화 수행', '중간 검증'] },
      { title: '3단계: 도구 및 메모리 연동', desc: '연계된 프로그램(' + ((item.relatedTools || [])[0] || '도구') + ')과 상호작용합니다.', nodes: ['외부 도구 연결', '상태 업데이트', '오류 보정', '출력 생성'] },
      { title: '4단계: 최종 결과 반환', desc: '처리가 완료되어 사용자에게 검증된 결과가 전달됩니다.', nodes: ['결과 검증 완료', '비용/속도 최적화', '로그 기록', '응답 반환'] }
    ];

    if (appState.currentProcessStep >= steps.length) appState.currentProcessStep = 0;
    const activeStep = steps[appState.currentProcessStep];

    document.getElementById('visualDiagramTitle').textContent =
      `그림과 애니메이션으로 보는 작동 구조 — ${item.term.split('(')[0].trim()}`;

    // 대형 SVG 도해 렌더링 (1곳에 통합하여 큼직하게 표시)
    const leftDiagramBox = document.getElementById('leftPageConceptDiagramBox');
    if (leftDiagramBox) {
      leftDiagramBox.innerHTML = buildConceptAnimatedSvg(item, appState.currentProcessStep);
    }

    // 4단계 프로세스 탭 버튼 (큼직한 폰트 `text-sm sm:text-base`)
    const stepTabsEl = document.getElementById('processStepTabs');
    if (stepTabsEl) {
      stepTabsEl.innerHTML = '';
      steps.forEach((st, idx) => {
        const isCurrent = idx === appState.currentProcessStep;
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'text-left p-3.5 rounded-xl border transition ' +
          (isCurrent
            ? 'bg-[#2c3e50] text-white border-[#2c3e50] shadow-md'
            : 'bg-[#faf8f3] text-stone-800 border-[#ccc4b4] hover:bg-[#ebe6dc]');
        b.innerHTML = `
          <div class="text-xs font-mono-code font-bold ${isCurrent ? 'text-amber-300' : 'text-[#7c5e3c]'}">STEP 0${idx + 1}</div>
          <div class="text-sm sm:text-base font-bold mt-1 leading-snug">${escapeHtml(st.title.replace(/^\d단계:\s*/, ''))}</div>
        `;
        b.addEventListener('click', () => {
          stopProcessTimer();
          appState.currentProcessStep = idx;
          renderRightLabPage(item);
        });
        stepTabsEl.appendChild(b);
      });
    }

    // 세부 노드 상태 파이프라인 카드 (큰 글씨 `text-sm sm:text-base`)
    const stageEl = document.getElementById('visualStageBox');
    if (stageEl) {
      const nodes = activeStep.nodes || [];
      stageEl.innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          ${nodes.map((nodeText, nIdx) => `
            <div class="p-4 rounded-xl border ${nIdx === appState.currentProcessStep ? 'bg-[#2c3e50] text-white border-[#2c3e50] shadow-md' : 'bg-[#faf8f3] text-stone-800 border-[#ccc4b4]'} flex flex-col justify-between min-h-[88px] transition-all duration-300">
              <div class="flex items-center justify-between text-xs font-mono-code font-bold ${nIdx === appState.currentProcessStep ? 'text-amber-300' : 'text-stone-500'}">
                <span>NODE 0${nIdx + 1}</span>
                <span>${nIdx <= appState.currentProcessStep ? 'ACTIVE' : 'WAIT'}</span>
              </div>
              <div class="text-sm sm:text-base font-bold leading-snug mt-2">${escapeHtml(nodeText)}</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    document.getElementById('processStepBadge').textContent = `STEP 0${appState.currentProcessStep + 1} / 0${steps.length} · ${activeStep.title}`;
    document.getElementById('processStepStatus').textContent = appState.processInterval ? '자동 순환 재생 중...' : '단계를 클릭하거나 [단계 자동 재생]을 누르세요';
    document.getElementById('processStepCaption').textContent = activeStep.desc;

    // 제5절: 코딩 샌드박스 설정
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
          <label class="block text-xs sm:text-sm font-bold text-stone-800">${escapeHtml(lab.paramLabel)}</label>
          <select id="labDynamicParam" class="w-full bg-white border border-[#ccc4b4] rounded-lg px-3.5 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none">
            ${lab.options.map(opt => `<option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`).join('')}
          </select>
        `;
      } else {
        paramBox.innerHTML = `
          <label class="block text-xs sm:text-sm font-bold text-stone-800">${escapeHtml(lab.paramLabel)}</label>
          <input id="labDynamicParam" type="text" value="${escapeHtml(lab.defaultParam)}" class="w-full bg-white border border-[#ccc4b4] rounded-lg px-3.5 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none">
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
      <div class="space-y-4">
        <div class="bg-[#f3efe6] border border-[#dcd6c8] rounded-2xl p-5 sm:p-6 space-y-4">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <span class="text-xs font-mono-code font-bold text-[#7c5e3c]">CONCEPT CHECK QUIZ</span>
            <span id="quizStatusBadge" class="text-xs font-semibold px-2.5 py-1 rounded ${isPassed ? 'bg-emerald-800 text-stone-100' : 'bg-[#ebe6dc] text-stone-700'}">
              ${isPassed ? '[정답 통과 완료]' : '보기를 선택해 문제를 풀어보세요'}
            </span>
          </div>
          <p class="text-base sm:text-lg font-serif-book font-bold text-stone-900 leading-relaxed">Q. ${escapeHtml(quiz.question)}</p>
          <div class="space-y-2.5 pt-1" id="quizOptionsList">
            ${quiz.options.map((opt, oIdx) => `
              <button type="button" data-opt-idx="${oIdx}" class="quiz-opt-btn w-full text-left p-3.5 rounded-xl border border-[#ccc4b4] bg-[#faf8f3] hover:bg-[#ebe6dc] text-sm sm:text-[15px] text-stone-800 transition flex items-start gap-2.5">
                <span class="font-mono-code font-bold text-[#7c5e3c] shrink-0">0${oIdx + 1}.</span>
                <span class="leading-relaxed">${escapeHtml(opt)}</span>
              </button>
            `).join('')}
          </div>
          <div id="quizFeedbackBox" class="${isPassed ? '' : 'hidden'} p-4 rounded-xl bg-[#faf8f3] border border-[#ccc4b4] text-sm text-stone-800 leading-relaxed">
            <strong class="text-[#2c3e50]">정답 해설:</strong> ${escapeHtml(quiz.explanation)}
          </div>
        </div>

        <!-- 나만의 학습 노트 기록장 -->
        <div class="bg-[#f3efe6] border border-[#dcd6c8] rounded-2xl p-5 space-y-3">
          <div class="flex items-center justify-between">
            <label for="userPersonalNoteInput" class="text-sm font-bold text-stone-900">나의 Learning Log 메모 및 질문 기록</label>
            <button type="button" id="btnSavePersonalNote" class="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#2c3e50] text-stone-100 hover:bg-[#1e2b38] transition">
              메모 저장
            </button>
          </div>
          <textarea id="userPersonalNoteInput" rows="3" placeholder="이 단원을 공부하며 깨달은 점이나 내 실무 프로젝트 적용 아이디어를 적어두세요..." class="w-full bg-[#faf8f3] border border-[#ccc4b4] rounded-xl p-3 text-sm text-stone-800 focus:outline-none focus:border-[#2c3e50]">${escapeHtml(savedNote)}</textarea>
        </div>
      </div>
    `;

    quizContainer.querySelectorAll('.quiz-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const chosen = parseInt(btn.getAttribute('data-opt-idx'), 10);
        const fb = document.getElementById('quizFeedbackBox');
        const badge = document.getElementById('quizStatusBadge');

        quizContainer.querySelectorAll('.quiz-opt-btn').forEach((b, idx) => {
          if (idx === quiz.answerIndex) {
            b.className = 'quiz-opt-btn w-full text-left p-3.5 rounded-xl border-2 border-emerald-700 bg-emerald-50 text-sm sm:text-[15px] font-semibold text-emerald-950 flex items-start gap-2.5';
          } else if (idx === chosen && chosen !== quiz.answerIndex) {
            b.className = 'quiz-opt-btn w-full text-left p-3.5 rounded-xl border-2 border-rose-700 bg-rose-50 text-sm sm:text-[15px] text-rose-950 flex items-start gap-2.5';
          } else {
            b.className = 'quiz-opt-btn w-full text-left p-3.5 rounded-xl border border-[#ccc4b4] bg-[#faf8f3] opacity-70 text-sm sm:text-[15px] text-stone-700 flex items-start gap-2.5';
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
            badge.className = 'text-xs font-semibold px-2.5 py-1 rounded bg-emerald-800 text-stone-100';
          }
          showToast('정답입니다. 해당 단원이 완독 및 퀴즈 통과 처리되었습니다.');
        } else {
          if (badge) {
            badge.textContent = '오답입니다. 아래 정답 해설을 확인해 보세요.';
            badge.className = 'text-xs font-semibold px-2.5 py-1 rounded bg-rose-800 text-stone-100';
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
  // 10. VIEW 2: 직업군별(6대 직군) 맞춤 기술·개념·용어 로드맵 뷰
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
      btn.className = 'w-full text-left rounded-xl p-4 border transition-all ' +
        (isSelected ? 'layer-active' : 'bg-[#f3efe6] border-[#dcd6c8] hover:bg-[#eae4d7]');
      btn.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="text-xs font-mono-code font-bold text-[#7c5e3c]">${escapeHtml(role.code)} · ${escapeHtml(role.shortName)}</span>
          <span class="text-xs font-mono-code px-2 py-0.5 rounded bg-[#ebe6dc] text-stone-700">필수 단원 ${learnedInRole}/${roleTerms.length}</span>
        </div>
        <h3 class="text-base font-serif-book font-bold text-stone-900 mt-1">${escapeHtml(role.name)}</h3>
        <p class="text-xs sm:text-sm text-stone-600 mt-1 line-clamp-2">${escapeHtml(role.tagline)}</p>
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
      <div class="bg-[#faf8f3] border border-[#dcd6c8] rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center gap-2.5">
        <span class="text-xs font-mono-code font-bold text-[#7c5e3c] shrink-0 sm:w-32">${escapeHtml(rm.step)}</span>
        <span class="text-sm text-stone-800 leading-relaxed">${escapeHtml(rm.focus)}</span>
      </div>
    `).join('');

    const keyTermsHtml = (activeRole.keyTerms || []).map(kt => `
      <button type="button" data-role-term="${escapeHtml(kt)}" class="btn-role-term-search text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg bg-[#faf8f3] hover:bg-[#2c3e50] hover:text-stone-100 text-stone-800 border border-[#ccc4b4] transition">
        ${escapeHtml(kt)} →
      </button>
    `).join('');

    const matchedCardsHtml = roleTerms.map(t => {
      const pageIdx = appState.terms.findIndex(x => x.id === t.id);
      const pStr = String(pageIdx + 1).padStart(2, '0');
      const diffMeta = getDifficultyMeta(t.difficulty);
      const isLearned = !!appState.learnedIds[t.id];
      return `
        <div class="bg-[#faf8f3] border border-[#dcd6c8] rounded-xl p-4 space-y-2 flex flex-col justify-between">
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-mono-code font-bold text-[#7c5e3c]">[${escapeHtml(t.sectionCode || '')}]</span>
              <span class="text-xs px-2 py-0.5 rounded border ${diffMeta.colorClass}">${diffMeta.badge}</span>
              ${isLearned ? '<span class="text-xs px-2 py-0.5 rounded bg-stone-800 text-stone-100">완독</span>' : ''}
            </div>
            <button type="button" data-open-page="${pageIdx}" class="btn-role-open-page text-xs sm:text-sm font-bold text-[#2c3e50] hover:underline shrink-0">
              p.${pStr} 본문 읽기 →
            </button>
          </div>
          <h4 class="text-base font-serif-book font-bold text-stone-900">${escapeHtml(t.term)}</h4>
          <p class="text-xs sm:text-sm text-stone-600 line-clamp-2">${escapeHtml(t.analogy)}</p>
        </div>
      `;
    }).join('');

    detailEl.innerHTML = `
      <div class="border-b border-[#dcd6c8] pb-4">
        <span class="text-xs font-mono-code font-bold text-[#7c5e3c]">${escapeHtml(activeRole.code)} · ROLE-BASED LEARNING TRACK</span>
        <h3 class="text-xl sm:text-2xl font-serif-book font-bold text-stone-900 mt-1">${escapeHtml(activeRole.name)}</h3>
        <p class="text-sm sm:text-base text-stone-700 mt-2 leading-relaxed">${escapeHtml(activeRole.summary)}</p>
      </div>

      <div>
        <h4 class="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">단계별 추천 커리큘럼 (입문 → 심화)</h4>
        <div class="space-y-2.5">
          ${roadmapHtml}
        </div>
      </div>

      <div>
        <h4 class="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">이 직군의 필수 숙지 개념 · 용어 (클릭 시 검색)</h4>
        <div class="flex flex-wrap gap-2">
          ${keyTermsHtml}
        </div>
      </div>

      <div>
        <h4 class="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">이 직군이 반드시 읽어야 할 본문 단원 (${roleTerms.length}개)</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
  // 11. VIEW 3: 5계층 아키텍처 뷰
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
      btn.className = 'w-full text-left rounded-xl p-4 border transition-all ' +
        (isSelected ? 'layer-active' : 'bg-[#f3efe6] border-[#dcd6c8] hover:bg-[#eae4d7]');
      btn.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="text-xs font-mono-code font-bold text-[#7c5e3c]">${escapeHtml(layer.order)}</span>
          <span class="text-xs font-medium px-2 py-0.5 rounded bg-[#ebe6dc] text-stone-700">수록 단원 ${countInLayer}개</span>
        </div>
        <h3 class="text-base font-serif-book font-bold text-stone-900 mt-1">${escapeHtml(layer.name)}</h3>
        <p class="text-xs sm:text-sm text-stone-600 mt-1 line-clamp-2">${escapeHtml(layer.summary)}</p>
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
      `<span class="text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg bg-[#faf8f3] text-stone-800 border border-[#ccc4b4]">${escapeHtml(p)}</span>`
    ).join('');

    const termsHtml = layerTerms.map(t => {
      const pageIdx = appState.terms.findIndex(x => x.id === t.id);
      const pStr = String(pageIdx + 1).padStart(2, '0');
      return `
        <div class="bg-[#faf8f3] border border-[#dcd6c8] rounded-xl p-4 space-y-2 flex flex-col justify-between">
          <div class="flex items-center justify-between gap-2">
            <h4 class="text-base font-serif-book font-bold text-stone-900">[${escapeHtml(t.sectionCode || '')}] ${escapeHtml(t.term)}</h4>
            <button type="button" data-open-page="${pageIdx}" class="btn-arch-open-page text-xs sm:text-sm font-bold text-[#2c3e50] hover:underline shrink-0">
              p.${pStr} 본문 펼치기 →
            </button>
          </div>
          <p class="text-xs sm:text-sm text-[#7c5e3c] font-medium">비유: ${escapeHtml(t.analogy)}</p>
          <p class="text-xs sm:text-sm text-stone-600 leading-relaxed">${escapeHtml(t.definition)}</p>
        </div>
      `;
    }).join('');

    detailEl.innerHTML = `
      <div class="border-b border-[#dcd6c8] pb-4">
        <span class="text-xs font-mono-code font-bold text-[#7c5e3c]">${escapeHtml(activeLayer.order)}</span>
        <h3 class="text-xl sm:text-2xl font-serif-book font-bold text-stone-900 mt-1">${escapeHtml(activeLayer.name)}</h3>
        <p class="text-sm sm:text-base text-stone-700 mt-2 leading-relaxed">${escapeHtml(activeLayer.summary)}</p>
      </div>
      <div class="bg-[#faf8f3] border-l-4 border-[#2c3e50] p-4 rounded-r-xl">
        <div class="text-xs font-bold text-stone-800 mb-1">핵심 엔지니어링 포인트</div>
        <p class="text-sm sm:text-base text-stone-700 leading-relaxed">${escapeHtml(activeLayer.whyItMatters)}</p>
      </div>
      <div>
        <h4 class="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">대표 프로그램 · 모델 · 프로토콜</h4>
        <div class="flex flex-wrap gap-2">${programsHtml}</div>
      </div>
      <div>
        <h4 class="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">이 계층에 속하는 본문 단원 (${layerTerms.length}개)</h4>
        <div class="space-y-3">${termsHtml}</div>
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
  // 12. VIEW 4 & 5: 실전 도구 디렉터리 및 플레이북 레시피
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
          <p class="text-base font-semibold text-stone-700">검색 조건에 해당하는 도구가 없습니다.</p>
          <button id="btnResetToolSearch" type="button" class="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-[#2c3e50] text-stone-100">전체 도구 목록 보기</button>
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
        `<li class="text-xs sm:text-sm text-stone-700 flex items-start gap-2"><span class="font-mono-code font-bold text-[#7c5e3c] shrink-0">0${idx + 1}.</span><span>${escapeHtml(s)}</span></li>`
      ).join('');

      const card = document.createElement('div');
      card.className = 'bg-[#f3efe6] border border-[#dcd6c8] rounded-2xl p-6 flex flex-col justify-between space-y-4';
      card.innerHTML = `
        <div class="space-y-3.5">
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs font-semibold px-2.5 py-1 rounded bg-[#ebe6dc] text-stone-800 border border-[#ccc4b4]">${escapeHtml(tool.catLabel)}</span>
            <span class="text-xs font-mono-code text-stone-500">${escapeHtml(tool.layer)} 계층 · Part ${tool.chapter}</span>
          </div>
          <div>
            <div class="flex items-baseline gap-2">
              <h3 class="text-lg sm:text-xl font-serif-book font-bold text-stone-900">${escapeHtml(tool.name)}</h3>
              <span class="text-xs text-stone-500">by ${escapeHtml(tool.org)}</span>
            </div>
            <p class="text-sm text-stone-700 mt-1.5 leading-relaxed">${escapeHtml(tool.summary)}</p>
          </div>
          <div class="bg-[#1c1917] rounded-xl p-3.5 flex items-center justify-between gap-2">
            <code class="text-xs sm:text-sm font-mono-code text-stone-200 overflow-x-auto custom-scrollbar whitespace-nowrap">${escapeHtml(tool.installCmd)}</code>
            <button type="button" data-copy-cmd="${escapeHtml(tool.installCmd)}" class="btn-copy-cmd shrink-0 text-xs font-medium px-3 py-1 rounded bg-stone-700 hover:bg-stone-600 text-stone-100">복사</button>
          </div>
          <div class="space-y-2">
            <div class="text-xs font-bold uppercase tracking-wider text-stone-500">3단계 실전 사용 절차</div>
            <ul class="space-y-1.5">${stepsHtml}</ul>
          </div>
        </div>
        <div class="pt-3 border-t border-[#dcd6c8] flex items-center justify-between gap-2 flex-wrap">
          <div class="flex flex-wrap gap-1.5">
            ${tool.relatedTerms.map(rt => `<span class="text-xs px-2.5 py-0.5 rounded bg-[#faf8f3] text-stone-600 border border-[#dcd6c8]">${escapeHtml(rt)}</span>`).join('')}
          </div>
          <a href="${escapeHtml(tool.url)}" target="_blank" rel="noopener noreferrer" class="text-xs sm:text-sm font-bold text-[#2c3e50] hover:underline">공식 문서 →</a>
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
        ? 'tool-cat-btn px-3 py-1.5 rounded text-xs font-semibold bg-[#2c3e50] text-stone-100'
        : 'tool-cat-btn px-3 py-1.5 rounded text-xs font-medium bg-[#ebe6dc] text-stone-700 hover:bg-stone-300';
    });
  }

  function renderPlaybookView() {
    const grid = document.getElementById('playbookGrid');
    if (!grid) return;
    grid.innerHTML = '';

    window.PLAYBOOK_RECIPES.forEach(recipe => {
      const stackHtml = recipe.stack.map(s => `
        <div class="flex items-center justify-between bg-[#faf8f3] border border-[#dcd6c8] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm">
          <span class="font-medium text-stone-500">${escapeHtml(s.role)}</span>
          <span class="font-bold text-stone-900">${escapeHtml(s.item)}</span>
        </div>
      `).join('');

      const card = document.createElement('div');
      card.className = 'bg-[#f3efe6] border border-[#dcd6c8] rounded-2xl p-6 space-y-4 flex flex-col justify-between';
      card.innerHTML = `
        <div class="space-y-3">
          <div>
            <span class="text-xs font-semibold px-2.5 py-1 rounded bg-[#ebe6dc] text-[#7c5e3c] border border-[#ccc4b4]">${escapeHtml(recipe.target)}</span>
          </div>
          <h3 class="text-lg sm:text-xl font-serif-book font-bold text-stone-900">${escapeHtml(recipe.title)}</h3>
          <p class="text-sm text-stone-700 leading-relaxed">${escapeHtml(recipe.goal)}</p>
          <div class="space-y-2 pt-1">${stackHtml}</div>
        </div>
        <div class="bg-[#faf8f3] border-l-4 border-[#7c5e3c] p-4 rounded-r-xl text-xs sm:text-sm text-stone-700 leading-relaxed">
          <strong class="text-stone-900">실무 조언:</strong> ${escapeHtml(recipe.tip)}
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // --------------------------------------------------------------------------
  // 13. VIEW 6: 전체 수록 용어 · 개념 색인표
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
      card.className = 'bg-[#f3efe6] hover:bg-[#ebe5d8] border border-[#dcd6c8] rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition';
      card.innerHTML = `
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs text-stone-500">
            <div class="flex items-center gap-2">
              <span class="font-mono-code font-bold text-[#7c5e3c]">[${escapeHtml(secStr)}]</span>
              <span class="font-semibold text-stone-700">${escapeHtml(ch.shortLabel)}</span>
              <span class="text-xs px-2 py-0.5 rounded border ${diffMeta.colorClass}">${diffMeta.badge}</span>
            </div>
            <span class="font-serif-book font-bold text-stone-700">p. ${pStr}</span>
          </div>
          <h3 class="text-base sm:text-lg font-serif-book font-bold text-stone-900">${escapeHtml(item.term)}</h3>
          <p class="text-xs sm:text-sm text-stone-700 line-clamp-2 leading-relaxed">${escapeHtml(item.analogy)}</p>
        </div>
        <div class="mt-4 pt-2.5 border-t border-[#dcd6c8] flex items-center justify-between text-xs sm:text-sm font-bold text-[#2c3e50]">
          <span>본문 챕터 · 그림 도판 열기</span>
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
  // 14. 메인 뷰 전환
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
        ? 'nav-tab w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition bg-[#2c3e50] text-white flex items-center justify-between'
        : 'nav-tab w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-stone-300 hover:bg-[#2a323c] transition flex items-center justify-between';
    });

    renderSidebarTree();

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
  // 15. 전체 마크다운 원고 및 학습 노트 백업 빌더
  // --------------------------------------------------------------------------
  function buildExportContent() {
    if (appState.exportMode === 'backup') {
      return JSON.stringify({
        project: 'AI-Book: Learning Log',
        exportedAt: new Date().toISOString(),
        learnedIds: appState.learnedIds,
        bookmarkedIds: appState.bookmarkedIds,
        quizPassedIds: appState.quizPassedIds,
        userNotes: appState.userNotes
      }, null, 2);
    }

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
  // 16. 이벤트 바인딩 및 초기화
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

    // 사이드바 브랜드 클릭 시 서문으로 이동
    const brandBtn = document.getElementById('btnBrandGoCover');
    if (brandBtn) brandBtn.addEventListener('click', () => {
      closeMobileSidebar();
      switchMainView('toc');
    });

    // 모바일 사이드바 열기/닫기
    const btnMobOpen = document.getElementById('btnMobileOpenSidebar');
    const btnMobClose = document.getElementById('btnCloseMobileSidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    if (btnMobOpen) btnMobOpen.addEventListener('click', openMobileSidebar);
    if (btnMobClose) btnMobClose.addEventListener('click', closeMobileSidebar);
    if (backdrop) backdrop.addEventListener('click', closeMobileSidebar);

    // 데스크톱 좌측 사이드바 접기/펼치기 토글
    const btnToggleDesktopSb = document.getElementById('btnToggleDesktopSidebar');
    if (btnToggleDesktopSb) {
      btnToggleDesktopSb.addEventListener('click', () => {
        const sb = document.getElementById('bookSidebar');
        if (!sb) return;
        appState.desktopSidebarCollapsed = !appState.desktopSidebarCollapsed;
        if (appState.desktopSidebarCollapsed) {
          sb.classList.add('lg:hidden');
        } else {
          sb.classList.remove('lg:hidden');
        }
      });
    }

    // 사이드바 내비게이션 탭
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        closeMobileSidebar();
        switchMainView(tab.getAttribute('data-view'));
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

    // 첫 페이지 펼치기
    const btnStart = document.getElementById('btnStartFirstPage');
    if (btnStart) btnStart.addEventListener('click', () => openBookAtPage(0));

    // 도해 애니메이션 일시정지/재생 토글
    const btnToggleAnim = document.getElementById('btnToggleDiagramAnim');
    if (btnToggleAnim) {
      btnToggleAnim.addEventListener('click', () => {
        appState.diagramAnimPaused = !appState.diagramAnimPaused;
        btnToggleAnim.textContent = appState.diagramAnimPaused ? '점선 흐름 재생' : '점선 흐름 일시정지';
        renderBookSpreadView();
      });
    }

    // 계층 배지 클릭
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
      showToast(appState.bookmarkedIds[cur.id] ? '이 단원에 책갈피를 추가했습니다.' : '책갈피를 해제했습니다.');
    });

    document.getElementById('btnToggleLearned').addEventListener('click', () => {
      const cur = appState.terms[appState.currentPageIdx];
      if (!cur) return;
      appState.learnedIds[cur.id] = !appState.learnedIds[cur.id];
      saveProgressState();
      renderBookSpreadView();
      showToast(appState.learnedIds[cur.id] ? '이 단원을 완독 표시했습니다.' : '완독 표시를 해제했습니다.');
    });

    // 이전/다음 단원 이동 함수
    function goPrevPage() {
      stopProcessTimer();
      if (appState.currentPageIdx > 0) {
        appState.currentPageIdx--;
        appState.currentProcessStep = 0;
        triggerPageFlipAnimation();
        renderBookSpreadView();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        switchMainView('toc');
      }
    }
    function goNextPage() {
      stopProcessTimer();
      if (appState.currentPageIdx < appState.terms.length - 1) {
        appState.currentPageIdx++;
        appState.currentProcessStep = 0;
        triggerPageFlipAnimation();
        renderBookSpreadView();
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

    // 키보드 좌우 화살표 이동
    window.addEventListener('keydown', (e) => {
      if (appState.currentView !== 'ebook') return;
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') return;
      if (e.key === 'ArrowRight') goNextPage();
      else if (e.key === 'ArrowLeft') goPrevPage();
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
      document.getElementById('btnPlayProcess').textContent = '자동 재생 정지';
      appState.processInterval = setInterval(() => {
        const item = appState.terms[appState.currentPageIdx];
        const maxSteps = (item.processSteps || []).length || 4;
        appState.currentProcessStep = (appState.currentProcessStep + 1) % maxSteps;
        renderRightLabPage(item);
        document.getElementById('btnPlayProcess').textContent = '자동 재생 정지';
      }, 2200);
    });

    document.getElementById('btnNextStepProcess').addEventListener('click', () => {
      stopProcessTimer();
      const cur = appState.terms[appState.currentPageIdx];
      const maxSteps = (cur.processSteps || []).length || 4;
      appState.currentProcessStep = (appState.currentProcessStep + 1) % maxSteps;
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
    // 모달: 전체 마크다운 원고 & 내 학습 노트 백업
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
      closeMobileSidebar();
      refreshExportArea();
      modalExport.classList.remove('hidden');
    });
    document.getElementById('btnCloseExportModal').addEventListener('click', () => modalExport.classList.add('hidden'));
    document.getElementById('btnDoneExport').addEventListener('click', () => modalExport.classList.add('hidden'));

    document.querySelectorAll('.export-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        appState.exportMode = btn.getAttribute('data-exportmode') || 'markdown';
        refreshExportArea();
      });
    });

    document.getElementById('btnCopyMarkdown').addEventListener('click', () => {
      const content = document.getElementById('exportMarkdownArea').value;
      copyTextSafe(content, '원고가 클립보드에 복사되었습니다.');
    });

    document.getElementById('btnDownloadExportFile').addEventListener('click', () => {
      const content = document.getElementById('exportMarkdownArea').value;
      const ext = appState.exportMode === 'backup' ? 'json' : 'md';
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
