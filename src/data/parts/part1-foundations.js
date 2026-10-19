// ============================================================================
// PART I · AI 패러다임과 기초 개념 · 수리적 직관 (1.x)
// ============================================================================

window.BOOK_PARTS_DATA = window.BOOK_PARTS_DATA || [];

window.BOOK_PARTS_DATA.push(
  {
    id: 'p1-paradigm',
    chapter: 1,
    sectionCode: '1.1',
    layer: 'L1',
    difficulty: 'beginner',
    roles: ['pm', 'designer-fe', 'app-be', 'data-ontology', 'ml-dl'],
    term: 'AI 패러다임의 진화와 개념적 접근법 (기호주의 vs 연결주의)',
    analogy: '기호주의(온톨로지·규칙)는 사람이 명확한 법률 조항과 족보를 짜주는 것이고, 연결주의(딥러닝·LLM)는 수만 권의 판례를 읽혀 직관적인 눈치를 기르게 하는 것입니다.',
    definition: '인공지능의 역사는 크게 두 가지 거대한 물줄기로 흐릅니다. 첫째는 세상의 개념과 논리 규칙을 기호로 정의하는 기호주의(Symbolic AI, 전문가 시스템·온톨로지·지식 그래프)이고, 둘째는 데이터에서 통계적 패턴과 가중치를 스스로 학습하는 연결주의(Connectionism, 머신러닝·딥러닝·LLM)입니다. 현대 AI 엔지니어링의 핵심은 LLM의 유연한 직관(연결주의)과 온톨로지·코드 검증의 엄밀한 논리(기호주의)를 결합하는 뉴로-심볼릭(Neuro-Symbolic) 아키텍처에 있습니다.',
    deepNote: '실무 포인트: 새로운 AI 기술을 접할 때 "이 기술은 데이터에서 확률을 배우는 것인가(딥러닝), 아니면 지식의 구조와 규칙을 정의하는 것인가(온톨로지/프로토콜), 아니면 행동의 보상을 최적화하는 것인가(강화학습)?"를 먼저 구분하면 어떤 개념이든 길을 잃지 않고 체계를 잡을 수 있습니다.',
    studyGuide: '1단계(입문): 인공지능 ⊃ 머신러닝 ⊃ 딥러닝 ⊃ 생성형 AI/LLM의 포함 관계와 기호주의 vs 연결주의 차이를 이해합니다. → 2단계(초급): 텍스트·이미지를 숫자 배열(벡터)로 바꾸는 임베딩 개념을 익힙니다. → 3단계(중급~심화): 확률적 생성 모델(LLM)의 환각을 결정론적 지식 구조(온톨로지·MCP 도구)로 보완하는 하이브리드 설계를 학습합니다.',
    levels: {
      beginner: '입문 개념: 컴퓨터에게 일을 시키는 방법은 두 가지입니다. 인간이 직접 "A이면 B하라"는 규칙과 개념 사전(온톨로지)을 만들어주거나, 수많은 예제 데이터를 주고 컴퓨터가 스스로 규칙(머신러닝/딥러닝)을 찾게 하는 것입니다.',
      intermediate: '중급 원리: 모든 데이터(단어, 사진, 음성)는 고차원 공간의 숫자 좌표인 벡터(Vector)로 표현됩니다. 의미가 비슷한 개념은 벡터 공간에서 가까운 위치에 모이며, 신경망은 행렬 곱셈과 비선형 함수를 통해 이 좌표를 변환합니다.',
      advanced: '심화 엔지니어링: 순수 딥러닝(System 1/확률 모델)만으로는 금융·의료·기업 규정의 100% 정합성을 보장할 수 없습니다. 온톨로지 제약 조건, 타입 검증(Pydantic), 에이전트 샌드박스 검증 루프를 결합한 뉴로-심볼릭 파이프라인이 표준입니다.'
    },
    keyTerms: [
      { term: '기호주의 (Symbolic AI)', desc: '인간이 이해할 수 있는 기호, 개념(온톨로지), 논리 규칙으로 지식을 표현하고 추론하는 방식' },
      { term: '연결주의 (Connectionism)', desc: '뇌의 뉴런 연결망을 모방한 인공신경망을 통해 대규모 데이터에서 통계적 가중치를 학습하는 방식' },
      { term: '벡터 (Vector)와 임베딩', desc: '단어나 사물의 의미를 수백~수천 개의 실수(숫자) 배열로 변환하여 공간상의 좌표로 나타낸 것' },
      { term: '뉴로-심볼릭 (Neuro-Symbolic)', desc: '신경망(딥러닝/LLM)의 패턴 인식 능력과 기호주의(온톨로지/지식그래프)의 논리적 추론을 결합한 패러다임' }
    ],
    relatedTools: ['Protégé (온톨로지)', 'PyTorch (딥러닝)', 'GraphRAG (뉴로-심볼릭 결합)'],
    dateAdded: '2026-10-19',
    processSteps: [
      { title: '1세대: 규칙 & 기호주의', desc: '전문가가 직접 개념(온톨로지)과 If-Else 논리 규칙을 입력해 설명 가능하고 정확한 추론을 수행합니다.', nodes: ['명시적 개념 정의', '논리 규칙(Rule) 작성', '100% 인과 설명 가능', '비정형 데이터 처리 한계'] },
      { title: '2세대: 통계적 머신러닝', desc: '사람이 중요한 특징(Feature)을 골라주면 알고리즘이 데이터의 분류 경계선과 회귀식을 찾아냅니다.', nodes: ['특징 공학(Feature)', '회귀·분류·트리 모델', '정형 테이블 데이터 강점', '복잡한 시각·언어 한계'] },
      { title: '3세대: 딥러닝 & 파운데이션 모델', desc: '다층 신경망과 트랜스포머가 원시 텍스트·이미지·음성에서 특징 추출부터 추론까지 스스로 학습합니다.', nodes: ['자가 지도 사전학습', '트랜스포머 어텐션', '범용 생성 능력 확보', '환각(Hallucination) 발생'] },
      { title: '4세대: 온톨로지 + 에이전트 결합', desc: 'LLM의 추론력에 온톨로지(지식 구조), 강화학습(행동 교정), 하네스(도구 실행)를 결합해 완성합니다.', nodes: ['LLM 두뇌 + 온톨로지 기억', '강화학습(RL) 추론 고도화', 'MCP 외부 도구 실행', '신뢰할 수 있는 자율 AI'] }
    ],
    labConfig: {
      paramLabel: '해결하려는 비즈니스 과제 유형 선택',
      paramType: 'select',
      options: [
        '복잡한 사내 규정 및 계약서 조항 검증 (기호주의 온톨로지 + LLM 결합)',
        '비정형 고객 리뷰 감정 분류 및 요약 (연결주의 LLM 단독 처리)',
        '실시간 로봇/게임 환경 자율 제어 (딥러닝 + 강화학습 결합)'
      ],
      defaultParam: '복잡한 사내 규정 및 계약서 조항 검증 (기호주의 온톨로지 + LLM 결합)',
      codeLang: 'Python · 벡터 유사도(연결주의)와 온톨로지 규칙(기호주의) 결합 개념 코드',
      starterCode: `# 뉴로-심볼릭(Neuro-Symbolic) 하이브리드 검증 의사 코드
def verify_loan_approval(applicant_text, ontology_rules):
    # 1. 연결주의(LLM): 비정형 상담 텍스트에서 구조화된 상태 추출
    extracted = {"credit_score": 720, "debt_ratio": 0.45, "has_collateral": True}
    
    # 2. 기호주의(Ontology/Rule): 결정론적 공리(Axiom) 검증
    is_valid = (extracted["credit_score"] >= ontology_rules["min_score"] 
                and extracted["debt_ratio"] <= ontology_rules["max_dti"])
    return {"extracted": extracted, "approved": is_valid}

print(verify_loan_approval("신청서 원문...", {"min_score": 700, "max_dti": 0.40}))`,
      runOutput: `[실행 결과 · Neuro-Symbolic Verification]
1. LLM 비정형 추출 성공: {'credit_score': 720, 'debt_ratio': 0.45, 'has_collateral': True}
2. 온톨로지 공리(Axiom) 대조 결과: Approved = False
   -> 사유: debt_ratio(0.45)가 온톨로지 제약 조건 max_dti(0.40)를 초과함 (환각 원천 차단!)`
    },
    quiz: {
      question: 'LLM처럼 대규모 데이터에서 확률적 패턴을 학습하는 방식(연결주의)의 환각 문제를 보완하기 위해, 도메인 개념과 엄밀한 관계 규칙을 명시적으로 정의해 결합하는 지식 표현 방식은 무엇인가요?',
      options: [
        '온톨로지 (Ontology) 및 지식 그래프 기반 기호주의 접근',
        '무작위 드롭아웃 (Random Dropout) 정규화',
        '이미지만 처리하는 합성곱 풀링 (Max Pooling)',
        '네트워크 대역폭 제한 (Rate Limiting)'
      ],
      answerIndex: 0,
      explanation: '확률적으로 다음 단어를 예측하는 LLM(연결주의)은 필연적으로 환각 가능성이 존재하므로, 개념·관계·제약조건을 명시적으로 정의한 온톨로지(기호주의) 및 지식 그래프와 결합할 때 높은 신뢰성을 얻을 수 있습니다.'
    }
  },
  {
    id: 't1',
    chapter: 1,
    sectionCode: '1.2',
    layer: 'L1',
    difficulty: 'beginner',
    roles: ['pm', 'designer-fe', 'app-be', 'data-ontology'],
    term: '토큰 (Token)과 컨텍스트 윈도우 (Context Window)',
    analogy: '토큰은 AI가 문장을 읽고 쓸 때 쪼개는 단어 조각이며, 컨텍스트 윈도우는 AI가 한 번에 펼쳐놓고 기억할 수 있는 작업 책상의 넓이입니다.',
    definition: '대규모 언어모델(LLM)은 텍스트를 글자 그대로 읽지 않고 의미 단위의 조각인 토큰(Token)으로 변환해 숫자로 계산합니다. 컨텍스트 윈도우가 100만(1M) 토큰이라는 것은 단행본 약 10~15권 분량의 문서나 대규모 소스 코드 전체를 한 번의 대화 창에 올려두고 맥락을 잃지 않은 채 분석할 수 있음을 뜻합니다.',
    deepNote: '실무 포인트: API 과금과 추론 속도는 글자 수가 아닌 입출력 토큰 수에 비례합니다. 한글은 영어보다 같은 문장이라도 토큰이 더 잘게 쪼개질 수 있으므로 토크나이저(BPE) 효율이 중요합니다.',
    studyGuide: '1단계(입문): 글자 수(Character)와 토큰 수(Token)의 차이와 API 과금 계산법을 이해합니다. → 2단계(초급): OpenAI Tiktoken이나 HuggingFace AutoTokenizer로 한글/영문 문장을 직접 토큰화해 봅니다. → 3단계(중급~심화): 긴 컨텍스트에서 발생하는 KV 캐시 메모리 증가 문제와 프롬프트 캐싱(Prompt Caching) 최적화 기법을 학습합니다.',
    levels: {
      beginner: '입문 개념: AI는 "안녕하세요"를 통째로 읽지 않고 의미 조각(토큰)으로 나누어 번호표를 붙입니다. 컨텍스트 윈도우는 AI가 대화 중에 까먹지 않고 기억할 수 있는 최대 토큰 개수입니다.',
      intermediate: '중급 원리: BPE(Byte-Pair Encoding) 알고리즘을 사용해 자주 등장하는 글자 조합을 하나의 토큰 ID(정수)로 묶습니다. 모델의 Vocabulary 크기가 클수록 다국어(한국어 등)를 적은 토큰으로 압축해 표현할 수 있습니다.',
      advanced: '심화 엔지니어링: 컨텍스트 길이가 N배 길어지면 기본 Self-Attention 연산량은 N²으로 급증하고 KV 캐시 메모리가 폭증합니다. 이를 해결하기 위해 GQA, MLA, 비대칭 인코더(CED) 및 프리필 캐싱을 적용합니다.'
    },
    keyTerms: [
      { term: '토크나이저 (Tokenizer)', desc: '자연어 문자열을 모델 사전(Vocabulary)에 정의된 토큰 조각과 고유 숫자 ID로 변환하는 전처리기' },
      { term: 'BPE (Byte-Pair Encoding)', desc: '빈번하게 함께 나타나는 바이트/글자 쌍을 반복적으로 병합해 서브워드(Subword) 사전을 만드는 표준 기법' },
      { term: '프리필 (Prefill) vs 디코드 (Decode)', desc: '입력 프롬프트 토큰 전체를 한 번에 읽는 단계(Prefill)와 답변 토큰을 한 글자씩 생성하는 단계(Decode)' },
      { term: 'KV 캐시 (Key-Value Cache)', desc: '컨텍스트 윈도우 내 이전 토큰들의 어텐션 계산 결과를 GPU 메모리에 저장해 중복 연산을 막는 공간' }
    ],
    relatedTools: ['Muse Spark Open (1M Context)', 'Nemotron 3.5 Super VL (1M Context)', 'DeepSeek-V4.1-Flash (1M Context)'],
    dateAdded: '2026-10-16',
    processSteps: [
      { title: '문장 입력', desc: '사용자가 자연어 문장("AI 엔지니어링 가이드를 읽는다")을 모델에 전달합니다.', nodes: ['원문 텍스트 입력', '토크나이저 대기', '숫자 ID 변환 전', '컨텍스트 버퍼 (0%)'] },
      { title: '토큰 분해 (Tokenization)', desc: '토크나이저가 문장을 ["AI", " 엔지니어", "링", " 가이드", "를", " 읽는다"]처럼 의미 조각으로 분할합니다.', nodes: ['조각 분할 완료', '["AI", "엔지니어", "링"...]', '총 6개 토큰 생성', '컨텍스트 버퍼 적재 준비'] },
      { title: '고유 숫자(ID) 매핑', desc: '각 토큰 조각이 모델 사전(Vocabulary)에 정의된 고유 번호(예: [1042, 8831, 2910...])로 변환됩니다.', nodes: ['토큰 사전 매칭', '[1042, 8831, 2910...]', '임베딩 벡터 변환', '신경망 입력 전달'] },
      { title: '컨텍스트 윈도우 적재', desc: '변환된 토큰들이 컨텍스트 윈도우(작업 책상) 메모리에 순서대로 쌓여 다음 단어 추론에 사용됩니다.', nodes: ['컨텍스트 슬롯 적재', '이전 대화 맥락 유지', '남은 용량 99.9%', '출력 토큰 생성 시작'] }
    ],
    labConfig: {
      paramLabel: '테스트 문장 입력 (토큰 분해 및 비용 실시간 계산)',
      paramType: 'text',
      defaultParam: '매일 아침 긱뉴스와 글로벌 AI 기술 동향을 요약 정리합니다.',
      codeLang: 'Python · Tokenizer & Context 계산 예제',
      starterCode: `# 입력 문장의 토큰 수와 1M 컨텍스트 대비 점유율 계산
text = "매일 아침 긱뉴스와 글로벌 AI 기술 동향을 요약 정리합니다."
tokens = text.replace(".", "").split(" ")

print(f"분해된 어절/토큰 조각: {tokens}")
print(f"추정 토큰 수: {len(tokens) * 2} tokens")
print(f"1M(1,000,000) 컨텍스트 점유율: {(len(tokens)*2)/1000000:.6%}")`,
      runOutput: `[실행 결과 · Token Analysis]
분해된 토큰 조각: ['매일', '아침', '긱뉴스', '와', '글로벌', 'AI', '기술', '동향', '을', '요약', '정리', '합니다']
추정 토큰 수: 14 tokens
1M(1,000,000) 컨텍스트 점유율: 0.001400%
예상 입력 비용 (DeepSeek-V4.1-Flash 기준): $0.0000042`
    },
    quiz: {
      question: '토큰(Token)과 컨텍스트 윈도우(Context Window)에 대한 설명 중 실무적으로 가장 올바른 것은 무엇인가요?',
      options: [
        '영어와 한국어는 글자 수가 같으면 언제나 정확히 동일한 토큰 수를 소모한다.',
        'API 호출 비용과 메모리 사용량은 글자 수가 아니라 입출력 토큰 수에 비례하며, 컨텍스트 윈도우는 한 번에 유지할 수 있는 최대 토큰 용량이다.',
        '컨텍스트 윈도우가 크면 무조건 모든 질문에 전체 사내 데이터베이스를 매번 넣는 것이 가장 저렴하다.',
        '토큰은 오직 이미지 파일에만 사용되는 단위이다.'
      ],
      answerIndex: 1,
      explanation: 'LLM은 텍스트를 서브워드 토큰 단위로 쪼개어 처리하며, 토크나이저 사전 구성에 따라 언어별 토큰화 효율이 달라집니다. 과금과 KV 캐시 메모리 모두 토큰 수에 비례합니다.'
    }
  },
  {
    id: 't2',
    chapter: 1,
    sectionCode: '1.3',
    layer: 'L1',
    difficulty: 'beginner',
    roles: ['pm', 'app-be', 'ml-dl', 'mlops-infra'],
    term: '파라미터 (Parameter, 매개변수)와 모델 체급 계산',
    analogy: '인간 두뇌의 시냅스 연결망 수와 같습니다. 숫자가 클수록 더 방대한 지식과 정교한 추론 규칙을 담아둘 수 있습니다.',
    definition: '신경망 내부에서 입력 신호의 중요도를 조절하며 다음 토큰을 계산하는 가중치(Weight)와 편향(Bias) 숫자들입니다. 보통 4B(40억 개)~12B 규모는 개인 노트북이나 단일 그래픽카드에서 구동 가능한 소형 모델이며, 120B~816B, 나아가 2.8T(2조 8천억 개)는 고난도 과학·코딩 추론을 수행하는 초대형 모델입니다.',
    deepNote: '실무 포인트: 파라미터 수가 무조건 크다고 좋은 것은 아닙니다. 최근에는 파라미터 크기를 줄이면서도 학습 데이터 품질과 아키텍처(MoE, 루프 구조)를 개선해 체급 이상의 성능을 내는 추세입니다.',
    studyGuide: '1단계(입문): 7B(70억), 70B(700억), 1T(1조) 등 모델 이름 뒤의 B/T 단위 읽는 법을 익힙니다. → 2단계(초급): 파라미터 1개당 16비트(2바이트)일 때와 4비트(0.5바이트)일 때 필요한 GPU VRAM 용량 계산 공식을 외웁니다. → 3단계(중급~심화): 총 파라미터(Total)와 활성 파라미터(Active, MoE)의 차이를 구분해 서빙 하드웨어를 설계합니다.',
    levels: {
      beginner: '입문 개념: 모델 이름 뒤에 붙는 "8B", "70B"에서 B는 Billion(10억)을 뜻합니다. 8B는 80억 개, 70B는 700억 개의 조절 다이얼(가중치)을 가진 두뇌라는 뜻입니다.',
      intermediate: '중급 원리: 기본 16비트(FP16/BF16) 정밀도에서는 파라미터 1B당 약 2GB의 메모리가 필요합니다. 즉 70B 모델을 원본 그대로 띄우려면 최소 140GB 이상의 GPU VRAM이 필요합니다.',
      advanced: '심화 엔지니어링: 메모리 대역폭 병목(Memory Bandwidth Bottleneck) 때문에 추론 속도는 매 토큰마다 읽어야 하는 활성 파라미터(Active Params) 용량에 의해 결정됩니다. 따라서 MoE(816B-A42B)와 4비트/2비트 양자화가 결합됩니다.'
    },
    keyTerms: [
      { term: '가중치 (Weight)와 편향 (Bias)', desc: '입력 벡터에 곱해지고 더해져 신호의 강도와 활성화 여부를 결정하는 신경망의 학습 가능한 실수 값' },
      { term: 'BF16 / FP16 (16비트 부동소수점)', desc: '파라미터 1개를 2바이트(16비트)로 표현하는 표준 학습·추론 정밀도' },
      { term: 'VRAM (비디오 메모리)', desc: 'GPU에서 모델 가중치와 KV 캐시를 올려두고 초고속으로 읽어 들이는 전용 메모리' }
    ],
    relatedTools: ['MAI-Base-2 (2.8T)', 'Muse Spark Open (816B)', 'Nemotron 3.5 Super VL (120B)', 'Dory 1.0 (4B)'],
    dateAdded: '2026-10-16',
    processSteps: [
      { title: '초소형 모델 (4B~8B)', desc: '약 40억~80억 개의 가중치를 가집니다. 노트북이나 스마트폰 온디바이스에서 즉시 실행됩니다.', nodes: ['4B 파라미터', '메모리 약 3~8GB', '초고속 응답', '일상 요약·분류 특화'] },
      { title: '중대형 모델 (70B~120B)', desc: '기업용 에이전트와 복합 문서·시각 추론의 주력 체급입니다 (예: Nemotron 3.5 Super VL 120B).', nodes: ['120B 파라미터', '복합 코딩·문서 분석', '고성능 GPU 1~2장 구동', '실무 에이전트 표준'] },
      { title: '초대형 오픈 모델 (500B~816B)', desc: '메타 Muse Spark Open(816B) 등 프론티어급 지능을 갖춘 오픈 웨이트 체급입니다.', nodes: ['816B 파라미터', 'MoE로 42B만 활성화', '다단계 심층 추론', '클러스터/양자화 구동'] },
      { title: '프론티어 극초대형 (1T~2.8T+)', desc: 'MS MAI-Base-2(2.8T) 등 수만 장의 데이터센터 GPU로 학습하는 최상위 기반 모델입니다.', nodes: ['2.8T (2조 8천억)', 'GB200 1.6만 장 학습', '최상위 과학·수학 추론', '하위 모델 증류 교사 역할'] }
    ],
    labConfig: {
      paramLabel: '모델 파라미터 규모 선택 (체급별 필요 메모리 비교)',
      paramType: 'select',
      options: ['4B (경량 온디바이스 모델)', '120B (기업용 에이전트 모델)', '816B (프론티어 오픈 모델)', '2800B (2.8T 초대형 베이스 모델)'],
      defaultParam: '120B (기업용 에이전트 모델)',
      codeLang: 'Python · 파라미터 규모별 메모리 산출 공식',
      starterCode: `# 모델 파라미터 수(B)에 따른 기본 메모리(FP16) 및 4비트 압축 메모리 계산
params_billion = 120  # 120B 모델 기준

fp16_gb = params_billion * 2.0       # 파라미터당 2 Byte
int4_gb = params_billion * 0.55      # 4-bit 양자화 + 오버헤드

print(f"모델 규모: {params_billion}B ({params_billion * 10}억 개 매개변수)")
print(f"원본(FP16) 필요 VRAM: 약 {fp16_gb:.1f} GB")
print(f"4비트 양자화(NVFP4/GGUF) 시: 약 {int4_gb:.1f} GB")`,
      runOutput: `[실행 결과 · Memory Footprint]
모델 규모: 120B (1,200억 개 매개변수)
원본(FP16) 필요 VRAM: 약 240.0 GB (H100 80GB x 4장 필요)
4비트 양자화(NVFP4/GGUF) 시: 약 66.0 GB (H200 또는 GB200 단일 GPU 구동 가능)`
    },
    quiz: {
      question: '70B(700억 파라미터) 규모의 모델을 양자화 없이 기본 16비트(FP16/BF16, 파라미터당 2바이트) 정밀도로 메모리에 로드할 때 필요한 최소 가중치 메모리 용량은 약 얼마인가요?',
      options: [
        '약 7 GB',
        '약 35 GB',
        '약 140 GB',
        '약 700 GB'
      ],
      answerIndex: 2,
      explanation: '16비트(2 Byte) 기준 1B(10억) 파라미터당 약 2GB의 메모리가 필요하므로, 70B 모델은 70 × 2GB = 약 140GB(KV 캐시 포함 시 약 160GB 이상)의 VRAM이 필요합니다.'
    }
  }
);
