// ============================================================================
// AI 기술 및 엔지니어링 총람 (Living Editorial E-Book)
// 1. 표지 시안, 6부작 대분류 목차, 난이도 체계, 6대 직군 트랙, 5계층 아키텍처, 도구 및 레시피
// ============================================================================

window.EBOOK_CONFIG = {
  version: 'Living Edition · 2026',
  title: 'AI-Book',
  subtitle: 'AI-Book: Learning Log',
  epigraph: '공부의 순서만 바뀐 것이다. 안 해도 되는 건 아니다.',
  prologue: {
    heading: '여는 글 — 인사말',
    paragraphs: [
      '비전공자인 내가 IT업계에서 일하고 있지만 요즘 AI 사용 빈도가 높아짐에 따라 일을 쳐내는 데에는 별 무리가 없었지만 항상 "내가 진정 알고 일을 하고 있나"라는 질문이 머릿속을 떠나지 않았다.',
      '그리고 대 AI 시대에 이전에는 공부를 하지 않으면 일을 할 수 없었지만 요즘은 바로 실무 투입해서 내가 원하는 것만 잘 입력하면 그럴듯한 결과물이 나오는 시대가 되어버린 지금, 오히려 뒤를 돌아볼 때가 아닌가 하는 생각으로 이 프로젝트를 시작한다.',
      '공부의 순서만 바뀐 것이다. 안 해도 되는 건 아니다.'
    ]
  },
  projectIntro: {
    heading: '프로젝트 소개 — AI-Book: Learning Log',
    lead: '실무에서 마주한 AI 결과물 너머의 원리를 역추적하여, 개념부터 용어·엔지니어링·심화 과정까지 체계적으로 기록하고 공유하는 살아있는 지식 아카이브입니다.',
    pillars: [
      {
        code: '01 · REVERSE LEARNING',
        title: '역방향 학습 (결과물에서 원리로)',
        desc: '프롬프트 입력으로 먼저 도출한 실무 결과물에서 출발해, 그 이면의 핵심 개념과 작동 구조를 거슬러 올라가며 진짜 내 지식으로 체화합니다.'
      },
      {
        code: '02 · CONCEPT TO DEPTH',
        title: '개념 접근 · 용어 · 수준별 심화',
        desc: '비전공자도 직관적인 비유와 시각 도해로 개념의 뼈대를 먼저 잡은 뒤, 관련 필수 용어와 입문(Lv.1)부터 심화(Lv.4) 엔지니어링까지 단계별로 확장합니다.'
      },
      {
        code: '03 · LIVING CURRICULUM',
        title: '살아있는 목차와 직군별 큐레이션',
        desc: '온톨로지, 딥러닝, 강화학습 등 새롭게 공부한 내용을 기존 목차 번호(sectionCode) 순서에 맞춰 끼워 넣으며 지속적으로 업데이트하고 직군별로 발췌해 학습합니다.'
      }
    ]
  }
};

// 1. 표지 디자인 시안 메타데이터 (base64 분리 -> 정적 에셋 참조)
window.COVER_DESIGNS = [
  {
    index: 0,
    name: '시안 1 · 리넨 지오메트릭 에디션',
    imgSrc: 'assets/covers/cover-1.jpg',
    cardBg: '#faf8f3'
  },
  {
    index: 1,
    name: '시안 2 · 클래식 엔지니어링 판화본',
    imgSrc: 'assets/covers/cover-2.jpg',
    cardBg: '#f9f6ee'
  },
  {
    index: 2,
    name: '시안 3 · 다크 슬레이트 아키텍처 도면본',
    imgSrc: 'assets/covers/cover-3.jpg',
    cardBg: '#f4f2ed'
  }
];

// 2. 4단계 난이도(학습 수준) 정의
window.DIFFICULTY_LEVELS = {
  beginner: {
    id: 'beginner',
    order: 1,
    badge: 'Lv.1 입문',
    label: 'Lv.1 입문 · 개념 접근',
    desc: '코딩이나 수학 배경지식 없이도 핵심 비유와 도해로 이해하는 기초 개념',
    colorClass: 'bg-emerald-900/10 text-emerald-900 border-emerald-800/30'
  },
  elementary: {
    id: 'elementary',
    order: 2,
    badge: 'Lv.2 초급',
    label: 'Lv.2 초급 · 원리 및 도구',
    desc: '데이터 흐름과 기본 작동 원리를 이해하고 오픈소스 도구·API를 직접 다뤄보는 단계',
    colorClass: 'bg-sky-900/10 text-sky-900 border-sky-800/30'
  },
  intermediate: {
    id: 'intermediate',
    order: 3,
    badge: 'Lv.3 중급',
    label: 'Lv.3 중급 · 아키텍처 설계',
    desc: '신경망 구조, 온톨로지 모델링, 강화학습 보상 설계 등 엔지니어링 구조를 설계하는 단계',
    colorClass: 'bg-amber-900/15 text-amber-950 border-amber-800/40'
  },
  advanced: {
    id: 'advanced',
    order: 4,
    badge: 'Lv.4 심화·숙련',
    label: 'Lv.4 심화 · 최적화 및 자율화',
    desc: '대규모 분산 서빙, 저비트 양자화, 멀티 에이전트 하네스, 재귀적 자기 개선 등 숙련자 과정',
    colorClass: 'bg-rose-900/15 text-rose-950 border-rose-800/40'
  }
};

// 3. 6부작 마스터 목차 (CHAPTERS / PARTS)
// 새로운 주제를 공부할 때 아래 6개 Part 중 적합한 Part와 sectionCode(예: "3.2", "3.2.1")만 부여하면
// 자동으로 목차 순서에 맞게 끼워 넣어지고 페이지 번호가 재정렬됩니다.
window.CHAPTERS = [
  {
    id: 1,
    badge: 'PART I · 기초 개념',
    shortLabel: 'Part 1 · 기초개념',
    title: 'AI 패러다임과 기초 개념 · 수리적 직관',
    subtitle: '인공지능의 지도, 벡터·확률적 사고, 토큰, 컨텍스트 윈도우, 파라미터의 근본 원리',
    targetLevel: 'Lv.1 입문 ~ Lv.2 초급',
    dataFile: 'src/data/parts/part1-foundations.js'
  },
  {
    id: 2,
    badge: 'PART II · 핵심 학습 기술',
    shortLabel: 'Part 2 · ML/DL/강화학습',
    title: '머신러닝 · 딥러닝 · 강화학습 핵심 메커니즘',
    subtitle: '지도·비지도학습, 심층 신경망과 어텐션, 강화학습(MDP·PPO·GRPO)의 개념부터 구현까지',
    targetLevel: 'Lv.1 입문 ~ Lv.4 심화',
    dataFile: 'src/data/parts/part2-ml-dl-rl.js'
  },
  {
    id: 3,
    badge: 'PART III · 지식 구조와 데이터',
    shortLabel: 'Part 3 · 온톨로지/지식그래프',
    title: '지식 표현 · 온톨로지(Ontology) · 지식 그래프와 RAG',
    subtitle: '도메인 개념 모델링(온톨로지), RDF/Property Graph, 시맨틱 추론과 GraphRAG 아키텍처',
    targetLevel: 'Lv.1 입문 ~ Lv.4 심화',
    dataFile: 'src/data/parts/part3-ontology-knowledge.js'
  },
  {
    id: 4,
    badge: 'PART IV · 차세대 모델 아키텍처',
    shortLabel: 'Part 4 · LLM/멀티모달',
    title: '대규모 언어모델(LLM)과 차세대 신경망 아키텍처',
    subtitle: '사전학습·LoRA, 네이티브 멀티모달, MoE, 비대칭 CED, 루프 트랜스포머, System 1 결정 모델',
    targetLevel: 'Lv.2 초급 ~ Lv.4 심화',
    dataFile: 'src/data/parts/part4-llm-architecture.js'
  },
  {
    id: 5,
    badge: 'PART V · 자율 에이전트 공학',
    shortLabel: 'Part 5 · 에이전트/하네스',
    title: '에이전틱 하네스 · 표준 프로토콜(MCP/A2A) · 자기 개선',
    subtitle: '영구 메모리 하네스(Hermes), MCP 도구 연결, 체화된 에이전트(Mineflayer), 모델 증류와 RSI',
    targetLevel: 'Lv.2 초급 ~ Lv.4 심화',
    dataFile: 'src/data/parts/part5-agents.js'
  },
  {
    id: 6,
    badge: 'PART VI · MLOps 및 실전 서빙',
    shortLabel: 'Part 6 · MLOps/로컬구동',
    title: '모델 압축(양자화) · 로컬 구동 · 고성능 서빙과 벤치마크',
    subtitle: '오픈 웨이트 생태계, GGUF/NVFP4 양자화, 오프라인 STT(Buzz), vLLM 서빙, SWE-bench 평가',
    targetLevel: 'Lv.2 초급 ~ Lv.4 심화',
    dataFile: 'src/data/parts/part6-mlops-serving.js'
  }
];

// 4. 6대 핵심 직업군(Role-based) 맞춤 트랙 정의 (이모지 배제, 에디토리얼 코드 적용)
window.JOB_ROLES = [
  {
    id: 'pm',
    name: '서비스 기획자 · PM / PO',
    shortName: '기획 · PM',
    code: 'TRACK 01',
    tagline: '비즈니스 문제를 AI 과제로 정의하고 도메인 규칙(온톨로지)과 평가 지표를 설계하는 역할',
    summary: '코드를 직접 짜지 않더라도 AI가 무엇을 할 수 있고 어디서 환각(Hallucination)을 일으키는지 정확히 파악해야 합니다. 특히 도메인 지식을 구조화하는 온톨로지 사고방식과 토큰 비용 산정, 벤치마크 해석 능력이 핵심입니다.',
    keyTerms: ['토큰 (Token)', '컨텍스트 윈도우', '온톨로지 (Ontology)', '택소노미 (Taxonomy)', '환각 (Hallucination)', 'System 1 라우팅', 'SWE-bench / GPQA', 'RAG (검색증강생성)'],
    studyRoadmap: [
      { step: '1단계 (입문)', focus: '토큰·컨텍스트 윈도우 비용 구조와 AI 패러다임(규칙 기반 vs 학습 기반) 이해하기' },
      { step: '2단계 (초급)', focus: '우리 서비스의 업무 개념을 정리하는 도메인 온톨로지(개체·관계·규칙) 설계법 익히기' },
      { step: '3단계 (중급)', focus: '만능 LLM 호출 대신 System 1 결정 모델 + RAG + 에이전트 역할 분담 워크플로 기획하기' },
      { step: '4단계 (심화)', focus: '벤치마크(SWE-bench 등)와 도메인 평가셋(Eval)으로 AI 도입 ROI 및 품질 검증하기' }
    ]
  },
  {
    id: 'designer-fe',
    name: '프로덕트 디자이너 · 프론트엔드(FE)',
    shortName: '디자이너 · FE',
    code: 'TRACK 02',
    tagline: 'AI의 추론 과정과 멀티모달 입출력을 사용자에게 직관적이고 신뢰감 있게 전달하는 인터페이스 설계자',
    summary: '단순한 채팅창을 넘어, 에이전트가 어떤 도구를 호출하고 어떤 근거(온톨로지 노드·문서 출처)로 답했는지 시각적으로 보여주는 Generative UI와 실시간 음성/시각 인터랙션 설계가 필수적입니다.',
    keyTerms: ['네이티브 멀티모달', '스트리밍 UX', '에이전트 상태 시각화', 'Speech-to-Speech', '온디바이스 추론', '지식 그래프 시각화', 'Human-in-the-Loop'],
    studyRoadmap: [
      { step: '1단계 (입문)', focus: '토큰 스트리밍 원리와 컨텍스트 한계가 UI/UX 대기 시간(TTFT)에 미치는 영향 파악' },
      { step: '2단계 (초급)', focus: '네이티브 멀티모달(이미지·음성·화면 공유) 입출력 패턴과 오프라인 음성 전사 활용' },
      { step: '3단계 (중급)', focus: '온톨로지·지식 그래프 탐색 UI 및 에이전트 도구 실행 단계(Step Player) 디자인' },
      { step: '4단계 (심화)', focus: 'MCP 클라이언트 연동 및 사용자 승인 가드레일(Human-in-the-Loop) 인터랙션 구현' }
    ]
  },
  {
    id: 'app-be',
    name: 'AI 애플리케이션 · 백엔드(BE) 개발자',
    shortName: 'AI 앱 · BE 개발',
    code: 'TRACK 03',
    tagline: '파운데이션 모델에 메모리·도구(MCP)·지식베이스(RAG)를 결합해 실전 서비스를 구축하는 엔지니어',
    summary: '모델 자체를 밑바닥부터 학습시키기보다, 이미 검증된 오픈 웨이트/상용 API 모델을 가져와 에이전틱 하네스, MCP 도구 서버, GraphRAG, System 1 분류기로 안정적인 프로덕션 파이프라인을 조립합니다.',
    keyTerms: ['MCP (Model Context Protocol)', 'A2A 규격', '에이전틱 하네스', '비대칭 MoE', 'System 1 결정 모델', '하이브리드 RAG / GraphRAG', 'Function Calling', '가드레일'],
    studyRoadmap: [
      { step: '1단계 (입문)', focus: '토큰화, 임베딩 벡터, 프롬프트 캐싱 및 기본 LLM API 호출 구조 마스터' },
      { step: '2단계 (초급)', focus: '로컬 오픈 웨이트(Ollama) 구동 및 정형 출력(Structured Outputs / Pydantic) 제어' },
      { step: '3단계 (중급)', focus: '온톨로지 기반 GraphRAG 구축 및 MCP 서버 제작으로 사내 DB·API 안전하게 연결' },
      { step: '4단계 (심화)', focus: 'System 1 초고속 라우터 + 비대칭 MoE + 상시 가동 에이전트 하네스 아키텍처 구축' }
    ]
  },
  {
    id: 'data-ontology',
    name: '데이터 · 지식(온톨로지) 아키텍트',
    shortName: '데이터 · 온톨로지',
    code: 'TRACK 04',
    tagline: '흩어진 비정형 데이터를 AI가 추론 가능한 온톨로지(Ontology)와 지식 그래프로 구조화하는 설계자',
    summary: '단순히 문서를 잘게 쪼개 벡터 DB에 넣는 초기 RAG의 한계를 넘어, 기업 내 개념(Class)·관계(Predicate)·제약조건(Axiom)을 온톨로지로 정의하고 지식 그래프와 결합해 결정론적 정확도를 달성합니다.',
    keyTerms: ['온톨로지 (Ontology)', 'RDF / OWL', 'Property Graph (속성 그래프)', '시맨틱 추론 (Reasoner)', 'GraphRAG', '임베딩 (Embedding)', '코사인 유사도', '합성 데이터 (Synthetic Data)'],
    studyRoadmap: [
      { step: '1단계 (입문)', focus: '벡터 임베딩의 원리와 단순 유사도 검색(Vector Search)이 실패하는 구조적 원인 이해' },
      { step: '2단계 (초급)', focus: '택소노미(분류체계)와 온톨로지(지식모델)의 차이, 트리플(주어-술어-목적어) 구조 습득' },
      { step: '3단계 (중급)', focus: 'Protégé·OWL 또는 Neo4j/BigQuery Graph로 도메인 온톨로지 및 지식 그래프 스키마 설계' },
      { step: '4단계 (심화)', focus: 'LLM 자동 개체 추출 + 온톨로지 검증기 + 하이브리드 GraphRAG 파이프라인 엔지니어링' }
    ]
  },
  {
    id: 'ml-dl',
    name: 'ML · DL · RL 모델 엔지니어 / 리서처',
    shortName: 'ML · 딥러닝 · RL',
    code: 'TRACK 05',
    tagline: '신경망 아키텍처를 설계하고 사전학습·미세조정(LoRA)·강화학습(RL)·증류로 지능을 빚어내는 전문가',
    summary: '고전 머신러닝부터 트랜스포머 어텐션, MoE 라우팅, 루프 트랜스포머 등 신경망 내부 구조를 다루며, SFT와 강화학습(PPO, GRPO)으로 모델의 추론 능력을 극대화하고 경량 모델로 증류(Distillation)합니다.',
    keyTerms: ['역전파 (Backpropagation)', 'Self-Attention', 'MoE (전문가 혼합)', '루프 트랜스포머', '강화학습 (MDP / PPO / GRPO)', '사전학습 & SFT', 'LoRA / QLoRA', '모델 증류 (Distillation)'],
    studyRoadmap: [
      { step: '1단계 (입문)', focus: '경사하강법, 손실함수, 과적합 등 머신러닝의 수리적 최적화 기초 다지기' },
      { step: '2단계 (초급)', focus: '딥러닝 신경망(MLP, CNN, Transformer Self-Attention)과 LoRA 미세조정 실습' },
      { step: '3단계 (중급)', focus: '강화학습(MDP, 정책 경사, PPO, GRPO)을 통한 추론 모델 정렬 및 보상 해킹 방지' },
      { step: '4단계 (심화)', focus: '비대칭 MoE, 루프 트랜스포머, 지식 증류 및 재귀적 자기 개선(RSI) 파이프라인 연구' }
    ]
  },
  {
    id: 'mlops-infra',
    name: 'MLOps · 추론 인프라 엔지니어',
    shortName: 'MLOps · 인프라',
    code: 'TRACK 06',
    tagline: '수백 기가바이트의 거대 모델을 양자화·분산 서빙하여 지연 시간과 GPU 비용을 극한으로 줄이는 엔지니어',
    summary: '아무리 뛰어난 모델도 서빙 비용이 비싸거나 응답이 느리면 실무에 쓸 수 없습니다. KV 캐시 메모리 관리(PagedAttention), FP4/2-bit 양자화, 네오클라우드 플루이드 컴퓨팅으로 고성능 추론 인프라를 구축합니다.',
    keyTerms: ['vLLM', 'PagedAttention', 'KV Cache', '양자화 (GGUF / NVFP4 / Dynamic 2-bit)', 'Continuous Batching', '텐서 병렬화 (TP)', '네오클라우드', 'NPU 스택 (VKORE)'],
    studyRoadmap: [
      { step: '1단계 (입문)', focus: '파라미터 크기와 데이터 타입(FP16, BF16, INT8, INT4)에 따른 VRAM 메모리 계산법' },
      { step: '2단계 (초급)', focus: 'Unsloth Dynamic GGUF 양자화 및 llama.cpp / Ollama 로컬 워크스테이션 구축' },
      { step: '3단계 (중급)', focus: 'vLLM 서빙 엔진(PagedAttention, Continuous Batching) 배포 및 동시 접속 부하 테스트' },
      { step: '4단계 (심화)', focus: '다중 노드 분산 추론, 비대칭 CED 프리필 최적화, 멀티 클러스터 플루이드 스케줄링' }
    ]
  }
];

// 5. AI 엔지니어링 5계층 아키텍처 도해 (ARCH_LAYERS)
window.ARCH_LAYERS = [
  {
    id: 'L5',
    order: 'LAYER 05 · 최상단 응용 계층',
    name: '실무 애플리케이션 및 보안 가드레일 계층',
    summary: '사용자와 직접 소통하며 코드 커밋 검증, 리버스 엔지니어링, 음성 전사, 보안 통제를 수행하는 계층입니다.',
    whyItMatters: 'AI가 생성한 결과물을 실제 업무나 코드베이스에 안전하게 반영하기 위해 인적 검증(Quiz Hook)과 권한 통제를 담당합니다.',
    keyPrograms: ['Buzz (오프라인 음성 전사)', 'REA (바이너리 역분석 에이전트)', 'Sphinx (코드 커밋 검증 훅)', 'Aider / Cline (자율 코딩 도구)']
  },
  {
    id: 'L4',
    order: 'LAYER 04 · 에이전트 런타임 계층',
    name: '에이전틱 하네스 및 오케스트레이션 계층',
    summary: 'LLM 주변에서 영구 메모리, 작업 스케줄러, 샌드박스 터미널, 실패 복구 루프를 감싸 자율 에이전트로 작동하게 만드는 엔진입니다.',
    whyItMatters: '모델(두뇌)만 있어서는 스스로 일을 끝내지 못합니다. 하네스(기억장치와 손발)가 결합되어야 24시간 무인 업무와 다중 에이전트 분업이 가능합니다.',
    keyPrograms: ['Hermes Agent (Nous Research)', 'DeepSeek Harness', 'Pydantic AI (타입 안전 에이전트)', 'EnvHarness (동적 훈련 환경)']
  },
  {
    id: 'L3',
    order: 'LAYER 03 · 지식 및 연결 규격 계층',
    name: '온톨로지 · 지식 그래프 · 외부 프로토콜(MCP) 계층',
    summary: '도메인 지식을 온톨로지와 지식 그래프로 구조화하고, AI 모델이 외부 DB·도구·가상 환경과 표준 규격(MCP/A2A)으로 소통하는 계층입니다.',
    whyItMatters: '환각 없는 정확한 도메인 추론(온톨로지/GraphRAG)과 범용 도구 연결(MCP)을 가능하게 하는 지식·통신 허브입니다.',
    keyPrograms: ['OWL / Protégé / Neo4j (온톨로지·지식그래프)', 'GraphRAG / 벡터 DB', 'MCP (Model Context Protocol)', 'A2A 규격', 'Mineflayer (환경 API)']
  },
  {
    id: 'L2',
    order: 'LAYER 02 · 최적화 엔진 계층',
    name: '양자화 압축 및 고성능 추론 런타임 계층',
    summary: '수백 기가바이트의 거대 모델을 4비트·2비트로 압축하고 GPU 및 통합 메모리를 효율적으로 관리해 고속 실행하는 계층입니다.',
    whyItMatters: '816B 같은 초대형 모델을 클라우드 과금 없이 로컬 워크스테이션이나 사내 서버에서 구동하기 위한 필수 엔지니어링 기술입니다.',
    keyPrograms: ['Unsloth (Dynamic 2-bit/4-bit 압축)', 'vLLM (PagedAttention 서빙 엔진)', 'Ollama / llama.cpp (로컬 GGUF 엔진)', 'VKORE (NPU 학습/추론 스택)']
  },
  {
    id: 'L1',
    order: 'LAYER 01 · 최하단 지능 계층',
    name: '파운데이션 모델 · 딥러닝 · 강화학습 계층',
    summary: '딥러닝 신경망(Transformer, MoE, 루프 구조)과 강화학습(PPO, GRPO)을 통해 언어·시각·행동 지능을 형성하는 원천 계층입니다.',
    whyItMatters: '모든 AI 시스템의 지능 상한선과 토큰당 기본 연산 비용을 결정하는 근본 토대입니다.',
    keyPrograms: ['Meta Muse Spark Open (816B-A42B)', 'NVIDIA Nemotron 3.5 / Dory 1.0', 'DeepSeek-V4.1-Flash', 'Liquid AI d1-ultra', 'GPT-6 Astra / Gemini 4 Argon / Claude 5.5']
  }
];

// 6. 실전 도구 및 모델 디렉터리 데이터
window.TOOLS_DATA = [
  {
    id: 'tool-protege-neo4j',
    name: 'Protégé & Neo4j GraphRAG',
    org: 'Stanford BMIR / Neo4j',
    category: 'eval',
    catLabel: '온톨로지 설계 및 지식 그래프',
    layer: 'L3',
    chapter: 3,
    summary: '도메인 개념과 관계 규칙(공리)을 OWL 표준으로 설계하는 오픈소스 온톨로지 편집기(Protégé)와, 이를 속성 그래프로 저장해 LLM 추론과 결합하는 GraphRAG 도구입니다.',
    installCmd: 'pip install neo4j-graphrag rdflib owlready2',
    usageSteps: [
      'Protégé 또는 Owlready2(Python)로 도메인의 핵심 클래스(Class), 관계(ObjectProperty), 제약 규칙 정의',
      '비정형 문서에서 추출한 개체(Entity)들을 온톨로지 스키마에 맞춰 검증 후 지식 그래프(Neo4j 등)에 적재',
      '사용자 질문 시 벡터 검색과 그래프 경로 탐색(Cypher/SPARQL)을 결합해 환각 없는 응답 생성'
    ],
    relatedTerms: ['온톨로지 (Ontology)', '지식 그래프와 GraphRAG', '시맨틱 추론'],
    url: 'https://protege.stanford.edu/'
  },
  {
    id: 'tool-hermes',
    name: 'Hermes Agent',
    org: 'Nous Research',
    category: 'agent',
    catLabel: '자율 에이전트 하네스',
    layer: 'L4',
    chapter: 5,
    summary: '특정 IDE에 종속되지 않고 개인 서버·PC 백그라운드에서 24시간 상시 구동되는 오픈소스 자율 에이전트 하네스입니다. 세션 간 영구 메모리와 자체 스킬 생성 루프를 갖추고 있습니다.',
    installCmd: 'curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash',
    usageSteps: [
      '터미널에서 설치 후 hermes model 명령어로 OpenRouter 또는 로컬 Ollama 모델 연결',
      '40개 이상의 내장 Tool Gateway(웹 검색, 브라우저 제어, 샌드박스 터미널) 활성화',
      '슬랙·텔레그램·디스코드 봇과 연동해 정기 리서치 및 코딩 자동화 지시'
    ],
    relatedTerms: ['에이전틱 하네스', 'MCP', '오픈 웨이트'],
    url: 'https://hermes-agent.nousresearch.com/'
  },
  {
    id: 'tool-buzz',
    name: 'Buzz',
    org: 'Chidi Williams',
    category: 'local',
    catLabel: '오프라인 음성 전사 및 번역',
    layer: 'L5',
    chapter: 6,
    summary: 'OpenAI의 Whisper 모델을 이용해 인터넷 연결 없이 내 PC에서 오디오·비디오 파일을 텍스트와 자막(SRT/VTT)으로 변환·번역하는 오프라인 도구입니다.',
    installCmd: 'winget install ChidiWilliams.Buzz  # macOS: brew install --cask buzz',
    usageSteps: [
      '앱 실행 후 Preferences에서 Whisper.cpp 백엔드 및 모델 크기(Base/Small/Large) 다운로드',
      '회의 녹음 파일이나 영상을 창에 드래그 앤 드롭하거나 실시간 마이크 녹음 시작',
      'Transcribe(전사) 또는 Translate(번역) 선택 후 텍스트·자막 파일로 내보내기'
    ],
    relatedTerms: ['오프라인 STT', '양자화'],
    url: 'https://github.com/chidiwilliams/buzz'
  },
  {
    id: 'tool-unsloth',
    name: 'Unsloth',
    org: 'Unsloth AI',
    category: 'local',
    catLabel: '모델 양자화 압축 및 파인튜닝',
    layer: 'L2',
    chapter: 6,
    summary: '초대형 오픈 웨이트 모델(Muse Spark Open, Nemotron 등)을 지능 저하 없이 Dynamic 2-bit / 4-bit GGUF로 압축해 로컬 PC·Mac에 올리고 파인튜닝 메모리를 70% 줄여주는 도구입니다.',
    installCmd: 'pip install unsloth',
    usageSteps: [
      'Hugging Face의 Unsloth 저장소에서 원하는 모델의 Dynamic GGUF 체크포인트 다운로드',
      'llama.cpp, Ollama 또는 vLLM에 로드해 24GB VRAM 단일 GPU나 Mac Studio에서 구동',
      '사내 데이터로 LoRA 미세조정 시 표준 대비 2배 빠른 속도로 학습 수행'
    ],
    relatedTerms: ['양자화 (GGUF / Dynamic 2-bit)', 'LoRA 미세조정', '강화학습 (GRPO)'],
    url: 'https://unsloth.ai/'
  },
  {
    id: 'tool-aider',
    name: 'Aider',
    org: 'Paul Gauthier',
    category: 'agent',
    catLabel: '터미널 AI 페어 프로그래밍',
    layer: 'L5',
    chapter: 5,
    summary: '터미널에서 Git 저장소와 직접 연동되어 전체 코드베이스 지도를 파악하고 여러 파일의 코드를 자율 수정·커밋해 주는 CLI 코딩 에이전트입니다.',
    installCmd: 'pip install aider-chat',
    usageSteps: [
      '프로젝트 폴더에서 aider --model openrouter/deepseek/deepseek-v4.1-flash-1017 실행',
      '채팅하듯 기능 추가나 버그 수정을 지시하면 알아서 관련 파일들을 편집',
      '변경 내역(diff) 검증 후 명확한 커밋 메시지와 함께 자동 Git Commit 수행'
    ],
    relatedTerms: ['SWE-bench Verified', '비대칭 MoE'],
    url: 'https://aider.chat/'
  },
  {
    id: 'tool-vllm',
    name: 'vLLM',
    org: 'vLLM Project',
    category: 'local',
    catLabel: '고성능 LLM 추론 서빙 엔진',
    layer: 'L2',
    chapter: 6,
    summary: 'PagedAttention 메모리 관리 기법으로 GPU 메모리 낭비를 없애고 동시 접속 추론 처리량(Throughput)을 극대화하는 표준 오픈소스 서빙 엔진입니다.',
    installCmd: 'pip install vllm && vllm serve nvidia/NVIDIA-Nemotron-3.5-Super-VL-120B-A12B-BF16',
    usageSteps: [
      '리눅스/GPU 서버에 vLLM 설치 후 허깅페이스 모델 ID를 지정해 서버 실행',
      '자동으로 생성된 로컬 OpenAI 호환 API(localhost:8000/v1)를 사내 앱이나 에이전트에 연결',
      'NVFP4, AWQ 양자화 옵션과 텐서 병렬화(--tensor-parallel-size)로 대형 MoE 서빙'
    ],
    relatedTerms: ['추론 (Inference)', 'MoE', '양자화 (NVFP4)'],
    url: 'https://github.com/vllm-project/vllm'
  },
  {
    id: 'tool-rea',
    name: 'REA (Reverse Engineer Anything)',
    org: 'Eigent AI',
    category: 'eval',
    catLabel: 'MCP 기반 바이너리/앱 역분석',
    layer: 'L3',
    chapter: 5,
    summary: '소스 코드가 없는 실행 파일(바이너리), 데스크톱 앱, 웹사이트를 AI 에이전트가 MCP 프로토콜로 분석해 작동 원리를 파악하고 재구현 코드를 생성하게 돕는 도구입니다.',
    installCmd: 'npm install -g rea-agents',
    usageSteps: [
      'npm으로 rea-agents 설치 후 사용 중인 에이전트(Claude Desktop, Hermes 등)에 MCP 서버로 등록',
      '분석할 앱이나 기능을 지정하면 로컬에서 안전하게 바이너리 및 스크립트 구조 추적',
      '분석 근거(Evidence)와 함께 자신의 프로젝트에 적용할 수 있는 클론 코드 생성'
    ],
    relatedTerms: ['MCP (Model Context Protocol)', '모델 증류와 RSI'],
    url: 'https://www.eigent.ai/blog/rea-reverse-engineer-anything'
  },
  {
    id: 'tool-mineflayer',
    name: 'Mineflayer & EnvHarness',
    org: 'PrismarineJS / Google Research',
    category: 'eval',
    catLabel: '체화된 에이전트 시뮬레이션 환경',
    layer: 'L3',
    chapter: 5,
    summary: '제미나이 4 아르곤이 27시간 마인크래프트 협업을 완수할 때 쓴 봇 제어 API(Mineflayer)와 구글의 동적 에이전트 훈련 환경 프레임워크(EnvHarness)입니다.',
    installCmd: 'npm install mineflayer',
    usageSteps: [
      'Mineflayer로 가상 환경 내 에이전트 봇을 생성하고 주변 상태(좌표, 인벤토리)를 JSON으로 수집',
      'LLM이 상태 데이터를 읽고 다음 행동 자바스크립트 코드를 실시간 작성·실행',
      'EnvHarness 플러그인 레이어를 씌워 환경 변화 및 돌발 장애 복구 능력을 학습'
    ],
    relatedTerms: ['체화된 에이전트', '에이전틱 하네스'],
    url: 'https://github.com/prismarinejs/mineflayer'
  },
  {
    id: 'tool-d1-jev',
    name: 'Liquid d1-ultra & TypeSafe Jev',
    org: 'Liquid AI / TypeSafe AI',
    category: 'model',
    catLabel: 'System 1 초고속 의사결정 모델',
    layer: 'L1',
    chapter: 4,
    summary: '긴 문장을 생성하지 않고 1회 순전파만으로 Yes/No, 라우팅 분류, 가드레일 점수를 확률값으로 즉시 반환하는 초저비용($0.042/1M) 결정 전문 모델입니다.',
    installCmd: 'curl https://openrouter.ai/api/v1/systemone -H "Authorization: Bearer $KEY"',
    usageSteps: [
      'Pydantic AI 또는 OpenRouter의 /v1/systemone 엔드포인트로 텍스트·이미지와 질문 전달',
      '출력 토큰 비용($0) 없이 밀리초 단위로 각 선택지의 정확한 확률(Confidence Score) 수신',
      '복잡한 에이전트 파이프라인의 앞단 분기점(Router)이나 보안 검문소(Guardrail)로 배치'
    ],
    relatedTerms: ['System 1 결정 모델', '비대칭 MoE'],
    url: 'https://www.liquid.ai/blog/d1-ultra'
  }
];

// 7. 상황별 조합 레시피 (PLAYBOOK_RECIPES)
window.PLAYBOOK_RECIPES = [
  {
    title: '레시피 01 · 도메인 온톨로지 + GraphRAG 기반 무환각 기업 지식 비서',
    target: 'Part III~IV (지식 아키텍트 · AI 백엔드 과정 연계)',
    goal: '단순 문서 검색(Vector RAG)이 놓치는 복잡한 사내 규정·계약 관계·인과관계를 온톨로지로 검증해 정확도 99% 달성',
    stack: [
      { role: '지식 스키마 설계', item: 'OWL 온톨로지 + Property Graph (Neo4j / BigQuery Graph)' },
      { role: '하이브리드 검색', item: '벡터 임베딩 검색 + 그래프 다중 홉(Multi-hop) 추론' },
      { role: '응답 생성 모델', item: 'DeepSeek-V4.1-Flash 또는 Claude 5.5' }
    ],
    tip: '처음부터 수천 개 클래스를 만들지 말고 핵심 개체(고객, 상품, 계약조항, 승인규칙) 10개 내외로 코어 온톨로지를 먼저 세운 뒤 점진적으로 확장하세요.'
  },
  {
    title: '레시피 02 · 보안 걱정 없는 사내 회의록 및 영상 자동 요약기',
    target: 'Part I & VI (입문·초급 로컬 과정 연계)',
    goal: '외부 클라우드에 회사 음성이나 문서를 업로드하지 않고 내 PC에서 무료로 녹취록과 요약본 생성',
    stack: [
      { role: '음성→텍스트 변환', item: 'Buzz (Whisper.cpp 로컬 백엔드)' },
      { role: '로컬 요약 모델', item: 'Ollama + Nemotron 3.5 Bolt (또는 Gemma 4)' },
      { role: '핵심 적용 기술', item: '오프라인 STT + GGUF 양자화' }
    ],
    tip: 'Buzz에서 녹음 파일을 TXT로 변환한 뒤 로컬 Ollama 모델에 넣으면 인터넷을 완전히 차단한 망분리 환경에서도 회의록 요약이 완성됩니다.'
  },
  {
    title: '레시피 03 · 24시간 스스로 일하고 보고하는 개인 AI 연구 비서',
    target: 'Part IV~V (중급·심화 에이전트 과정 연계)',
    goal: '잠든 시간에도 기술 동향을 조사하거나 정해진 서버 점검 작업을 수행해 메신저로 보고받기',
    stack: [
      { role: '에이전트 본체(하네스)', item: 'Hermes Agent (Nous Research)' },
      { role: '고효율 추론 모델', item: 'DeepSeek-V4.1-Flash-1017 API' },
      { role: '도구 연결 규격', item: 'Tool Gateway + MCP 플러그인' }
    ],
    tip: 'Hermes Agent는 세션이 끝나도 영구 메모리에 작업 노하우를 스스로 기록하므로 시간이 지날수록 내 업무 스타일에 맞춘 전용 스킬이 축적됩니다.'
  },
  {
    title: '레시피 04 · 초저비용 엔터프라이즈 멀티 에이전트 라우팅 시스템',
    target: 'Part IV~VI (중급·심화 아키텍처)',
    goal: '모든 질문에 비싼 대형 모델을 부르지 않고 0.01초 만에 질문을 분류해 필요한 전문가 에이전트만 호출',
    stack: [
      { role: '1차 초고속 분류기', item: 'Liquid AI d1-ultra (System 1 모델, $0.042/1M)' },
      { role: '복합 시각·문서 추론', item: 'NVIDIA Nemotron 3.5 Super VL (120B-A12B)' },
      { role: '자체 서빙 엔진', item: 'vLLM (NVFP4 양자화 체크포인트 구동)' }
    ],
    tip: '앞단에 System 1 결정 모델(d1-ultra)을 배치하면 불필요한 대형 모델 호출을 70% 이상 걸러내어 전체 AI 운영비를 대폭 낮출 수 있습니다.'
  }
];

// 파트별 단원들이 등록될 전역 배열 초기화
window.BOOK_PARTS_DATA = [];
