# AI-Book

**부제: AI-Book: Learning Log**

> **"공부의 순서만 바뀐 것이다. 안 해도 되는 건 아니다."**

---

## 1. 여는 글 (인사말)

비전공자인 내가 IT업계에서 일하고 있지만 요즘 AI 사용 빈도가 높아짐에 따라 일을 쳐내는 데에는 별 무리가 없었지만 항상 **"내가 진정 알고 일을 하고 있나"**라는 질문이 머릿속을 떠나지 않았다.

그리고 대 AI 시대에 이전에는 공부를 하지 않으면 일을 할 수 없었지만 요즘은 바로 실무 투입해서 내가 원하는 것만 잘 입력하면 그럴듯한 결과물이 나오는 시대가 되어버린 지금, 오히려 뒤를 돌아볼 때가 아닌가 하는 생각으로 이 프로젝트를 시작한다.

**공부의 순서만 바뀐 것이다. 안 해도 되는 건 아니다.**

---

## 2. 프로젝트 소개 (AI-Book: Learning Log)

**AI-Book: Learning Log**는 실무에서 먼저 마주한 AI 결과물 너머의 원리를 역추적하여, 기초 개념 접근부터 연관 필수 용어, 머신러닝·딥러닝·강화학습·온톨로지·자율 에이전트 엔지니어링(Lv.1 입문 ~ Lv.4 심화), 그리고 6대 직군별 맞춤 로드맵까지 지속적으로 기록하고 공유하는 살아있는 E-Book 프로젝트입니다.

1. **역방향 학습 기록장 (Reverse-Order Learning Log)**
   - 과거: `[01. 기초 이론 학습] -> [02. 기술·코드 구현] -> [03. 실무 투입 및 결과물]`
   - 현재 (`AI-Book: Learning Log`): `[01. 실무 투입·프롬프트] -> [02. 결과물 도출] -> [03. 개념·용어·원리 역추적 및 체화]`
2. **가독성 중심 편집 및 시각 도해·애니메이션**
   - 불필요한 장식 기호(이모지)를 배제하고 서적 타이포그래피와 문단 호흡으로 가독성을 높였습니다.
   - 단원마다 핵심 작동 구조를 직관적으로 이해할 수 있는 **개념 도해(SVG 그림 설명)와 단계별 애니메이션 시뮬레이터**를 수록했습니다.
3. **코드 기반 목차 자동 정렬 (`sectionCode` 정렬 엔진)**
   - 외부 UI에서의 임의 단원 추가를 배제하고, 저자가 `src/data/parts/` 데이터 파일에 직접 단원 객체를 추가하여 관리합니다.
   - 코드에 새 단원(예: 온톨로지 추론 규칙 `sectionCode: '3.1.1'` 또는 `'3.4'`)을 추가하면, 기존 목차 번호 순서에 맞춰 원하는 위치에 자동으로 끼워 넣어지고 전체 페이지 번호(`p.01 ~ p.XX`)가 재정렬됩니다.

---

## 3. 6부작 마스터 목차 (Part 1 — Part 6)

| 대분류 | 데이터 파일 | 핵심 수록 주제 |
| :--- | :--- | :--- |
| **Part 1. 기초 개념과 수리적 직관** | `src/data/parts/part1-foundations.js` | `1.1` AI 패러다임(기호주의 vs 연결주의), `1.2` 토큰 & 컨텍스트 윈도우, `1.3` 파라미터 & VRAM 계산법 |
| **Part 2. 머신러닝 · 딥러닝 · 강화학습** | `src/data/parts/part2-ml-dl-rl.js` | `2.1` 머신러닝 & 경사하강법, `2.2` 딥러닝 신경망 & 트랜스포머 어텐션, `2.3` 강화학습(MDP · PPO · GRPO) |
| **Part 3. 지식 표현 · 온톨로지 · RAG** | `src/data/parts/part3-ontology-knowledge.js` | `3.1` 온톨로지(Ontology) 개념 접근 & 설계 4단계, `3.2` 지식 그래프(RDF/OWL vs LPG), `3.3` 임베딩 & 하이브리드 GraphRAG |
| **Part 4. 대규모 언어모델(LLM) 아키텍처** | `src/data/parts/part4-llm-architecture.js` | `4.1` 사전학습·LoRA·추론, `4.2` 네이티브 멀티모달, `4.3` MoE, `4.4` 비대칭 MoE & CED, `4.5` 루프 트랜스포머, `4.6` System 1 결정 모델 |
| **Part 5. 자율 에이전트 공학 및 프로토콜** | `src/data/parts/part5-agents.js` | `5.1` 에이전틱 하네스(Hermes), `5.2` MCP & A2A 통신 규격, `5.3` 체화된 에이전트(Mineflayer), `5.4` 모델 증류 & 재귀적 자기 개선(RSI) |
| **Part 6. MLOps · 양자화 · 서빙 · 벤치마크** | `src/data/parts/part6-mlops-serving.js` | `6.1` 오픈 웨이트 생태계, `6.2` 양자화(GGUF/NVFP4/2-bit), `6.3` 오프라인 STT(Buzz) & S2S, `6.4` 네오클라우드 & vLLM, `6.5` SWE-bench & GPQA |

---

## 4. 6대 직업군별 맞춤 트랙 (`TRACK 01 — 06`)

- **TRACK 01 · 서비스 기획자 · PM / PO**: 비즈니스 문제 정의, 도메인 온톨로지 규칙 설계, 토큰 비용 및 벤치마크(Eval) 검증
- **TRACK 02 · 프로덕트 디자이너 · 프론트엔드(FE)**: 스트리밍 UX, 에이전트 추론 과정 시각화, 멀티모달 인터페이스 설계
- **TRACK 03 · AI 애플리케이션 · 백엔드(BE) 개발자**: MCP 서버 연동, GraphRAG 구축, 에이전틱 하네스 및 System 1 라우팅 파이프라인
- **TRACK 04 · 데이터 · 지식(온톨로지) 아키텍트**: OWL/RDF 및 속성 그래프 기반 도메인 온톨로지 모델링, 시맨틱 추론기 검증
- **TRACK 05 · ML · DL · RL 모델 엔지니어 / 리서처**: 트랜스포머 어텐션, LoRA 미세조정, 강화학습(PPO/GRPO), 지식 증류
- **TRACK 06 · MLOps · 추론 인프라 엔지니어**: Dynamic 2-bit/4-bit 양자화, vLLM PagedAttention 서빙, 플루이드 컴퓨팅 최적화

---

## 5. 디렉터리 구조 및 실행 방법

```text
AI-Book/
├── index.html                              # 메인 E-Book 엔트리 (빌드 없이 브라우저 즉시 실행)
├── manifest.json                           # 모바일/태블릿 PWA 앱 매니페스트
├── assets/
│   └── covers/                             # 표지 이미지 에셋 (cover-1~3.jpg)
├── src/
│   ├── app.js                              # 스마트 목차 정렬, SVG 애니메이션 도해, 실습/퀴즈 엔진
│   ├── styles/
│   │   └── ebook.css                       # 에디토리얼 북 스타일, 가독성 타이포그래피, SVG 애니메이션
│   └── data/
│       ├── taxonomy.js                     # 서문(인사말), 6부작 목차, 난이도, 6대 직군, 5계층, 도구/레시피
│       └── parts/                          # 파트별 분리된 지식 데이터 (Git 업데이트 단위)
│           ├── part1-foundations.js
│           ├── part2-ml-dl-rl.js
│           ├── part3-ontology-knowledge.js
│           ├── part4-llm-architecture.js
│           ├── part5-agents.js
│           └── part6-mlops-serving.js
└── docs/
    └── sample/
        └── ai_editorial_e_book.html        # 초기 레퍼런스 샘플 보존본
```

별도의 빌드 도구 없이 `index.html`을 브라우저에서 바로 열거나 GitHub Pages로 배포하면 PC와 모바일 웹에서 즉시 동작합니다.

---

## 6. 새 단원 코드 업데이트 가이드 (저자용)

단원 추가는 외부 웹 UI에 노출하지 않고 **`src/data/parts/` 내부 파일에 직접 코드를 추가**하여 관리합니다.

1. 추가할 주제의 성격에 맞는 파트 파일을 엽니다 (예: 온톨로지 심화 단원이라면 `src/data/parts/part3-ontology-knowledge.js`).
2. 배열 내부 원하는 위치(또는 맨 끝)에 아래 템플릿 형식으로 객체를 추가합니다. `sectionCode`(예: `'3.1.1'`, `'3.4'`)만 지정하면 앱 구동 시 자연수 비교 정렬 엔진이 자동으로 목차 순서와 페이지 번호를 맞춰 끼워 넣습니다.

```js
{
  id: 'p3-owl-reasoner',
  chapter: 3,                      // 1 ~ 6부 번호
  sectionCode: '3.1.1',            // 원하는 목차 위치 번호 ('3.1'과 '3.2' 사이에 자동 배치됨)
  layer: 'L3',                     // 'L1' ~ 'L5' 아키텍처 계층
  difficulty: 'intermediate',      // 'beginner'(Lv.1) | 'elementary'(Lv.2) | 'intermediate'(Lv.3) | 'advanced'(Lv.4)
  roles: ['pm', 'app-be', 'data-ontology'],
  term: 'OWL 추론기(Reasoner)와 도메인 공리 검증',
  analogy: '사람이 미처 적어두지 않은 숨은 관계나 규칙 위반을 법칙만으로 자동 찾아내는 논리 검수관',
  definition: '단원 본문 해설을 작성합니다...',
  deepNote: '실무 엔지니어링 핵심 포인트를 작성합니다...',
  studyGuide: '1단계: 기초 개념 파악 -> 2단계: 공리 설계 -> 3단계: 추론기 검증 실행',
  levels: {
    beginner: '입문자용 쉬운 설명...',
    intermediate: '중급 아키텍처 원리 설명...',
    advanced: '심화 엔지니어링 최적화 설명...'
  },
  keyTerms: [
    { term: '전이성 (Transitivity)', desc: 'A->B이고 B->C이면 자동으로 A->C가 성립하는 성질' }
  ],
  relatedTools: ['Protégé', 'HermiT'],
  processSteps: [
    { title: '1단계: 공리 정의', desc: '클래스와 속성 제약을 선언합니다.', nodes: ['클래스 선언', '속성 제약', 'Disjoint 설정', '스키마 로드'] },
    { title: '2단계: 추론기 실행', desc: 'HermiT/Pellet 추론기를 가동합니다.', nodes: ['TBox 검사', 'ABox 검사', '전이 추론', '일관성 확인'] }
  ]
}
```

3. 저장 후 Git 커밋 및 푸시(`git push origin main`)하면 GitHub Pages(`https://kimnarr.github.io/AI-Book/`)에 즉시 반영됩니다.
