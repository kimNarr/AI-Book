// ============================================================================
// PART IV · 대규모 언어모델(LLM)과 차세대 신경망 아키텍처 (4.x)
// ============================================================================

window.BOOK_PARTS_DATA = window.BOOK_PARTS_DATA || [];

window.BOOK_PARTS_DATA.push(
  {
    id: 't3',
    chapter: 4,
    sectionCode: '4.1',
    layer: 'L1',
    difficulty: 'elementary',
    roles: ['pm', 'app-be', 'ml-dl', 'mlops-infra'],
    term: '사전학습 (Pre-training) · 미세조정 (LoRA) · 추론 (Inference)',
    analogy: '사전학습은 대학교까지 폭넓은 교양과 언어를 배우는 과정, 미세조정(LoRA)은 입사 후 특정 부서 업무 매뉴얼을 익히는 과정, 추론은 실제 실무를 처리하는 단계입니다.',
    definition: '사전학습은 백지상태의 신경망에 수십조 개의 텍스트·코드 토큰을 읽혀 기초 지능을 형성하는 가장 고비용의 과정입니다. LoRA 미세조정은 이미 완성된 모델의 거대한 가중치는 고정(Freeze)해 두고 1% 미만의 얇은 어댑터 층만 덧붙여 특정 업무 스타일에 맞추는 기법이며, 추론은 완성된 모델에 질문을 넣어 답을 얻어내는 실행 과정입니다.',
    deepNote: '실무 포인트: 최근 비드래프트의 VKORE 기술처럼 추론 전용 NPU에서 사전학습과 LoRA 미세조정까지 수행해 고가 GPU 의존도를 낮추려는 시도가 활발합니다.',
    studyGuide: '1단계(입문): 사전학습(Pre-training) → 지시학습(SFT) → 강화학습 정렬(RLHF/GRPO) → 추론(Inference)의 생애주기를 이해합니다. → 2단계(초급): 언제 프롬프트 엔지니어링/RAG를 쓰고 언제 LoRA 파인튜닝을 써야 하는지 구분합니다. → 3단계(중급~심화): Unsloth를 이용해 4비트 양자화 상태(QLoRA)에서 저메모리 파인튜닝을 직접 실행해 봅니다.',
    levels: {
      beginner: '입문 개념: 처음부터 AI를 가르치는 것(사전학습)은 수백억 원이 들지만, 이미 똑똑하게 졸업한 오픈소스 모델을 가져와 우리 회사 양식만 살짝 더 가르치는 것(LoRA 미세조정)은 그래픽카드 1장으로 몇 시간이면 충분합니다.',
      intermediate: '중급 원리: LoRA(Low-Rank Adaptation)는 거대한 가중치 행렬 W(예: 4096×4096)를 직접 수정하는 대신, 두 개의 아주 얇은 저랭크 행렬 A(4096×16)와 B(16×4096)의 곱(ΔW = A·B)만 학습해 기존 가중치에 더해줍니다.',
      advanced: '심화 엔지니어링: 서빙 단계에서는 하나의 베이스 모델을 GPU에 올려두고 요청하는 고객사나 직무에 따라 수십 개의 경량 LoRA 어댑터만 실시간으로 갈아끼우는 Multi-LoRA 서빙(vLLM 지원)으로 인프라 효율을 극대화합니다.'
    },
    keyTerms: [
      { term: '베이스 모델 (Base Model)', desc: '방대한 문서의 다음 단어 예측(사전학습)만 마친 상태로, 지식은 풍부하나 질문-답변 대화 요령은 아직 다듬어지지 않은 원석 모델' },
      { term: 'SFT (지도 미세조정)', desc: '고품질의 (질문, 모범 답안) 데이터셋을 학습시켜 사용자의 지시(Instruction)를 잘 따르도록 다듬는 과정' },
      { term: 'LoRA & QLoRA', desc: '원본 가중치는 얼려두고 극소수의 저랭크 어댑터 행렬만 학습하는 기법(LoRA)과 이를 4비트 양자화 위에서 수행하는 기법(QLoRA)' },
      { term: '추론 (Inference)', desc: '학습이 끝난 모델 가중치를 고정하고 실제 사용자 입력에 대해 출력 토큰을 계산해 내는 서비스 실행 단계' }
    ],
    relatedTools: ['VKORE (NPU 사전학습/LoRA)', 'Unsloth (저메모리 LoRA 파인튜닝)', 'vLLM (고속 추론 서빙)'],
    dateAdded: '2026-10-16',
    processSteps: [
      { title: '1단계: 사전학습 (Pre-training)', desc: '수십조 토큰의 웹·책·코드 데이터를 학습해 언어 규칙과 세상의 지식을 습득합니다 (비용 90% 이상 소요).', nodes: ['백지 신경망 초기화', '수십조 토큰 주입', '기초 언어·논리 습득', '베이스 모델(Base) 완성'] },
      { title: '2단계: 지시 학습 & 정렬 (SFT / RL)', desc: '사람의 질문 의도에 맞게 대답하고 위험한 행동을 피하도록 대화 데이터와 강화학습으로 다듬습니다.', nodes: ['베이스 모델 로드', '질의응답 데이터 학습', '강화학습(GRPO) 보정', 'Instruct 모델 완성'] },
      { title: '3단계: LoRA 미세조정', desc: '원본 모델은 얼려두고 작은 어댑터 가중치만 추가 학습시켜 우리 회사만의 전문 용어와 양식을 익히게 합니다.', nodes: ['원본 가중치 고정(Freeze)', 'LoRA 어댑터(1%) 부착', '사내 데이터 고속 학습', '맞춤형 특화 모델 완성'] },
      { title: '4단계: 실전 추론 (Inference)', desc: '완성된 모델을 서버나 로컬 PC에 띄워 사용자의 실시간 질문에 답변 토큰을 생성합니다.', nodes: ['모델 메모리 적재', '사용자 프롬프트 수신', '토큰 순차 계산', '최종 답변 반환'] }
    ],
    labConfig: {
      paramLabel: '파인튜닝 방식 선택 (전체 학습 vs LoRA 어댑터)',
      paramType: 'select',
      options: ['LoRA 미세조정 (가중치 1%만 학습 - 권장)', 'Full Fine-tuning (전체 가중치 100% 재학습)'],
      defaultParam: 'LoRA 미세조정 (가중치 1%만 학습 - 권장)',
      codeLang: 'Python · Unsloth LoRA 어댑터 설정 코드',
      starterCode: `from unsloth import FastLanguageModel

# 원본 모델은 4비트로 가볍게 불러오고 LoRA 어댑터만 학습 가능 상태로 설정
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = "unsloth/Nemotron-3.5-Bolt-GGUF",
    load_in_4bit = True,
)
model = FastLanguageModel.get_peft_model(
    model,
    r = 16, # LoRA 랭크 (작을수록 가벼움)
    target_modules = ["q_proj", "k_proj", "v_proj", "o_proj"],
)`,
      runOutput: `[실행 결과 · LoRA Adapter Initialized]
전체 파라미터: 74,000,000,000 (74B - 고정됨)
학습 대상 LoRA 파라미터: 184,549,376 (전체 대비 0.25%만 학습)
필요 학습 VRAM: 18.4 GB (단일 24GB GPU에서 미세조정 가능)`
    },
    quiz: {
      question: '거대 언어모델의 원본 가중치 전체를 다시 학습시키는 대신, 원본은 고정(Freeze)해 두고 1% 미만의 얇은 저랭크 어댑터 행렬만 추가 학습시켜 메모리와 비용을 획기적으로 아끼는 미세조정 기법은 무엇인가요?',
      options: [
        'LoRA (Low-Rank Adaptation)',
        '원-핫 인코딩 (One-Hot Encoding)',
        '그리드 서치 (Grid Search)',
        '데이터 셔플링 (Data Shuffling)'
      ],
      answerIndex: 0,
      explanation: 'LoRA는 사전학습된 거대 가중치 행렬을 고정하고 저랭크(Low-Rank) 행렬 쌍만 학습하여 적은 GPU 메모리로도 빠르고 효과적으로 모델을 특화시키는 기법입니다.'
    }
  },
  {
    id: 't4',
    chapter: 4,
    sectionCode: '4.2',
    layer: 'L1',
    difficulty: 'elementary',
    roles: ['pm', 'designer-fe', 'app-be', 'ml-dl'],
    term: '네이티브 멀티모달 (Native Multimodal / Omni Model)',
    analogy: '글자만 배운 뒤 나중에 안경을 쓴 학생이 아니라, 태어날 때부터 글자·사진·소리·영상을 동시에 보고 들으며 개념을 익힌 두뇌입니다.',
    definition: '초기 시각언어모델(VLM)은 텍스트 전용 LLM에 별도의 이미지 인코더를 사후에 이어 붙이는 방식을 썼습니다. 반면 최신 네이티브 멀티모달(Omni) 모델은 사전학습 초기부터 텍스트, 이미지, 오디오, 비디오 토큰을 동일한 신경망 공간에서 함께 학습하여 복잡한 차트 해석, 화면 조작, 음성 뉘앙스 파악 능력이 훨씬 뛰어납니다.',
    deepNote: '실무 포인트: 메타의 Muse Spark Open과 엔비디아 Nemotron 3.5 Super VL은 대시보드 스크린샷이나 스캔된 청구서 문서를 읽고 곧바로 코딩·도구 호출까지 이어가는 멀티모달 에이전트 워크플로에 특화되어 있습니다.',
    studyGuide: '1단계(입문): 텍스트 전용 LLM + OCR 조합과 네이티브 멀티모달 모델의 차이를 이해합니다. → 2단계(초급): 이미지 패치(Patch)와 오디오 프레임이 어떻게 토큰으로 변환되는지 살펴봅니다. → 3단계(중급~심화): 복잡한 표·차트·UI 화면을 직접 읽고 행동하는 Visual Agent 파이프라인을 설계합니다.',
    levels: {
      beginner: '입문 개념: 예전에는 영수증 사진을 글자 인식기(OCR)로 먼저 읽은 뒤 AI에게 넘겨주느라 표의 줄이 어긋나면 엉뚱한 답을 했습니다. 네이티브 멀티모달은 사진 속 표의 선과 글씨, 색상을 눈으로 직접 보며 이해합니다.',
      intermediate: '중급 원리: 이미지(비전 패치), 오디오(스펙트로그램 토큰), 텍스트(서브워드 토큰)가 단일 공유 임베딩 공간(Shared Representation Space)으로 투영되어 트랜스포머 내부에서 교차 모달 어텐션(Cross-modal Attention)을 수행합니다.',
      advanced: '심화 엔지니어링: 고해상도 문서와 긴 비디오를 처리할 때 비전 토큰 수가 폭증하는 문제를 해결하기 위해, 최신 모델들은 동적 해상도 타일링(Dynamic Resolution)과 비전 토큰 압축기를 사용해 토큰 효율을 높입니다.'
    },
    keyTerms: [
      { term: '옴니 모델 (Omni Model)', desc: '텍스트, 이미지, 오디오, 비디오 등 모든 형태의 입력을 단일 신경망에서 처리하고 다양한 모달리티로 출력하는 통합 모델' },
      { term: '비전 패치 토큰 (Vision Patch Token)', desc: '이미지를 작은 바둑판 격자(예: 16×16 픽셀 패치)로 잘라 각 조각을 하나의 단어 토큰처럼 변환한 것' },
      { term: '교차 모달 어텐션 (Cross-Modal Attention)', desc: '문장 속의 단어 토큰과 이미지 속의 특정 영역 패치 토큰이 서로 주의를 기울여 연관성을 파악하는 메커니즘' }
    ],
    relatedTools: ['Muse Spark Open', 'Nemotron 3.5 Super VL', 'DeepSeek-V4.1-Flash', 'MAI-Base-2'],
    dateAdded: '2026-10-16',
    processSteps: [
      { title: '다중 모달 입력 수집', desc: '텍스트 질문과 함께 대시보드 스크린샷 이미지, 회의 음성, 영상 클립이 동시에 입력됩니다.', nodes: ['텍스트 프롬프트', '차트/문서 이미지', '오디오 파형', '비디오 프레임'] },
      { title: '통합 토큰 임베딩', desc: '시각 패치와 오디오 프레임이 텍스트 토큰과 동일한 차원의 벡터 표현으로 변환됩니다.', nodes: ['비전 인코더(RADIO)', '오디오 토크나이저', '텍스트 토크나이저', '단일 벡터 공간 통합'] },
      { title: '교차 모달 어텐션 추론', desc: '신경망 내부에서 "차트의 빨간색 급증 구간"과 "청구서 텍스트의 단가 항목"을 서로 대조하며 원인을 추론합니다.', nodes: ['시각-언어 교차 참조', '수치 및 레이아웃 파악', '논리적 인과관계 도출', '해결 계획 수립'] },
      { title: '에이전트 행동 및 응답 출력', desc: '분석 결과를 바탕으로 설명 텍스트를 출력하거나 외부 도구(DB 조회, 알림 발송)를 호출합니다.', nodes: ['원인 분석 리포트 생성', 'JSON 도구 호출 생성', '검증 완료', '최종 응답 반환'] }
    ],
    labConfig: {
      paramLabel: '입력 데이터 조합 선택',
      paramType: 'select',
      options: ['대시보드 이미지 + 스캔 문서 + 텍스트 질문', '2분 분량 MP4 화면 녹화 영상 + 버그 수정 지시'],
      defaultParam: '대시보드 이미지 + 스캔 문서 + 텍스트 질문',
      codeLang: 'Python · 멀티모달 비전-언어 에이전트 호출 예제',
      starterCode: `# 이미지(차트 스크린샷)와 텍스트를 함께 전달해 원인 분석 수행
response = client.chat.completions.create(
    model="nvidia/nemotron-3.5-super-vl",
    messages=[{
        "role": "user",
        "content": [
            {"type": "image_url", "image_url": {"url": "file://aws_billing_chart.png"}},
            {"type": "text", "text": "이번 달 클라우드 비용이 30% 급증한 원인을 차트에서 찾아 요약해줘."}
        ]
    }]
)`,
      runOutput: `[실행 결과 · Multimodal Reasoning]
1. 시각 분석: aws_billing_chart.png의 10월 12일자 막대에서 GPU 인스턴스(p5.48xlarge) 비용이 전주 대비 +42% 상승함을 확인했습니다.
2. 문서 대조: 스캔된 단가표 기준 스팟 인스턴스 대신 온디맨드 요율이 적용된 구간입니다.
3. 권장 조치: 유휴 클러스터 자동 종료 스케줄러 활성화를 권장합니다.`
    },
    quiz: {
      question: '사전학습 초기부터 텍스트, 이미지, 오디오, 비디오 토큰을 동일한 신경망 표현 공간에서 함께 학습하여 별도의 외부 OCR이나 변환기 없이도 복합 추론이 가능한 모델을 무엇이라 부르나요?',
      options: [
        '네이티브 멀티모달 (Native Multimodal / Omni) 모델',
        '단일 계층 퍼셉트론 (Single-Layer Perceptron)',
        '선형 회귀 분석기 (Linear Regressor)',
        '정적 규칙 파서 (Static Rule Parser)'
      ],
      answerIndex: 0,
      explanation: '네이티브 멀티모달(Omni) 모델은 학습 초기부터 다중 모달리티 데이터를 통합 토큰 공간에서 학습하여 시각·청각·언어 간 깊은 상호 참조 추론을 수행합니다.'
    }
  },
  {
    id: 't9',
    chapter: 4,
    sectionCode: '4.3',
    layer: 'L1',
    difficulty: 'intermediate',
    roles: ['pm', 'app-be', 'ml-dl', 'mlops-infra'],
    term: 'MoE (Mixture-of-Experts, 전문가 혼합)와 활성 파라미터',
    analogy: '대학병원에 800명의 전문의(총 파라미터 816B)가 재직하지만, 환자 1명이 내원하면 증상에 꼭 맞는 전문의 40명(활성 파라미터 42B)만 협진에 참여해 진찰 속도와 비용을 아끼는 체제입니다.',
    definition: '모든 질문에 거대한 신경망 전체를 가동하는 밀집(Dense) 모델과 달리, 신경망 내부를 수십~수백 개의 작은 전문가(Expert) 서브 네트워크로 분할한 아키텍처입니다. 앞단의 라우터(Router)가 입력 토큰의 성격을 파악해 가장 적합한 소수의 전문가만 활성화하므로, 모델의 총지식 용량(Total Params)은 거대하게 키우면서도 실제 연산량(Active Params)은 작게 유지합니다.',
    deepNote: '실무 포인트: 모델 이름에 붙는 "816B-A42B"(Muse Spark Open)나 "120B-A12B"(Nemotron 3.5 Super VL)에서 A 뒤의 숫자가 바로 토큰당 실제 작동하는 활성 파라미터 크기입니다.',
    studyGuide: '1단계(입문): 밀집(Dense) 모델과 전문가 혼합(Sparse MoE) 모델의 차이를 이해합니다. → 2단계(초급): 모델 명칭의 Total Params vs Active Params 표기법(예: 816B-A42B)을 읽고 추론 속도와 필요 메모리를 구분합니다. → 3단계(중급~심화): 게이팅 라우터(Gating Router), 공유 전문가(Shared Expert), 로드 밸런싱 손실(Load Balancing Loss) 메커니즘을 파악합니다.',
    levels: {
      beginner: '입문 개념: 백과사전 전집 100권을 다 읽어야 답하는 대신, 목차 안내원(라우터)이 질문에 필요한 5권만 딱 골라 펼쳐주어 엄청나게 빠르면서도 박식한 AI 구조입니다.',
      intermediate: '중급 원리: 트랜스포머의 피드포워드 층(FFN)을 N개의 Expert로 쪼개고 Top-K 게이팅 네트워크가 각 토큰마다 상위 K개의 Expert만 선택해 연산합니다. 단, VRAM에는 전체 파라미터(816B)가 모두 올라가 있어야 합니다.',
      advanced: '심화 엔지니어링: 특정 전문가에게만 토큰이 몰리는 병목(Routing Collapse)을 막기 위해 보조 손실 없는 로드 밸런싱(Auxiliary-loss-free load balancing)과 모든 토큰이 공통으로 거치는 Shared Expert 구조를 결합합니다.'
    },
    keyTerms: [
      { term: '밀집 모델 (Dense Model) vs 희소 MoE', desc: '매 토큰마다 100% 모든 가중치를 계산하는 모델(Dense)과 일부 전문가 가중치만 선택적으로 활성화하는 모델(Sparse MoE)' },
      { term: '총 파라미터 vs 활성 파라미터 (Active)', desc: '모델에 저장된 전체 지식 크기(메모리 용량 결정)와 토큰 1개를 처리할 때 실제 곱셈에 참여하는 크기(추론 속도 결정)' },
      { term: '게이팅 라우터 (Gating Router)', desc: '입력 토큰 벡터를 분석해 어느 전문가(Expert) 네트워크로 보낼지 확률 가중치를 결정하는 경량 분류 층' }
    ],
    relatedTools: ['Meta Muse Spark Open (816B-A42B)', 'MS MAI-Base-2 (2.8T-A80B)', 'NVIDIA Nemotron 3.5 Super VL (120B-A12B)'],
    dateAdded: '2026-10-16',
    processSteps: [
      { title: '토큰 유입 및 라우터 분석', desc: '사용자의 질문 토큰(예: 파이썬 비동기 코드 디버깅 요청)이 MoE 게이팅 라우터(Router)에 도달합니다.', nodes: ['토큰 유입: "async def"', '게이팅 라우터 분석', '전문 분야 판별: 코딩', '상위 K개 전문가 선택'] },
      { title: '맞춤형 소수 전문가만 점등', desc: '전체 816B 파라미터 중 파이썬 문법·비동기 처리에 특화된 42B 규모의 전문가 네트워크만 불이 켜집니다.', nodes: ['Expert #04 (Python) 활성', 'Expert #19 (Async) 활성', '나머지 774B 전문가 휴면', '연산량 94.8% 절감'] },
      { title: '고속 병렬 연산 수행', desc: '선택된 소수의 전문가들만 가볍게 행렬 연산을 수행하므로 40B급 소형 모델처럼 빠르게 결과가 나옵니다.', nodes: ['42B 규모만 행렬 곱 연산', '단일 토큰 추론 지연 최소화', '전기 및 연산 비용 절약', '출력 벡터 합산'] },
      { title: '초거대 지능 + 경량 속도 달성', desc: '지식의 깊이는 816B 모델 수준을 누리면서 토큰 생성 속도는 소형 모델 수준으로 출력됩니다.', nodes: ['지식 폭: 816B 프론티어급', '추론 속도: 42B 경량급', '가성비 파레토 최적화', '다음 토큰으로 이동'] }
    ],
    labConfig: {
      paramLabel: 'MoE 모델 아키텍처 선택 (총 파라미터 대비 실제 연산 비율 확인)',
      paramType: 'select',
      options: ['Meta Muse Spark Open (총 816B / 활성 42B)', 'NVIDIA Nemotron 3.5 Super VL (총 120B / 활성 12B)', 'MS MAI-Base-2 (총 2,800B / 활성 80B)'],
      defaultParam: 'Meta Muse Spark Open (총 816B / 활성 42B)',
      codeLang: 'Python · MoE 라우팅 효율 시뮬레이션',
      starterCode: `# MoE 모델의 토큰당 연산 절감률 계산
total_params_b = 816.0
active_params_b = 42.7

active_ratio = (active_params_b / total_params_b) * 100
saved_compute = 100 - active_ratio

print(f"전체 지식 용량: {total_params_b}B")
print(f"토큰당 실제 작동 파라미터: {active_params_b}B ({active_ratio:.1f}%)")
print(f"밀집(Dense) 모델 대비 연산 절감률: {saved_compute:.1f}% 절감")`,
      runOutput: `[실행 결과 · MoE Routing Efficiency]
전체 지식 용량: 816.0B
토큰당 실제 작동 파라미터: 42.7B (5.2%)
밀집(Dense) 모델 대비 연산 절감률: 94.8% 절감
-> 816B 전체를 매번 계산하는 것보다 약 19배 적은 연산량으로 프론티어급 추론을 수행합니다.`
    },
    quiz: {
      question: '"816B-A42B"로 표기된 MoE(전문가 혼합) 모델에 대한 설명으로 가장 정확한 것은 무엇인가요?',
      options: [
        '모델의 전체 지식 용량은 816B이지만, 토큰 1개를 추론할 때 실제로 작동하는 활성 파라미터는 42B뿐이어서 추론 속도가 빠르다.',
        '메모리(VRAM)에도 42B만큼만 올려두면 나머지 774B는 아예 다운로드할 필요가 없다.',
        '총 42개의 단어만 이해할 수 있는 초소형 모델이다.',
        '언제나 816B 전체를 매 토큰마다 100% 곱셈 연산한다.'
      ],
      answerIndex: 0,
      explanation: 'MoE 모델은 전체 가중치(816B)를 메모리에 적재하되, 각 토큰마다 라우터가 선택한 활성 파라미터(42B)만 연산에 참여시켜 거대 모델의 지능과 소형 모델의 연산 속도를 동시에 얻습니다.'
    }
  },
  {
    id: 't10',
    chapter: 4,
    sectionCode: '4.4',
    layer: 'L1',
    difficulty: 'advanced',
    roles: ['app-be', 'ml-dl', 'mlops-infra'],
    term: '비대칭 MoE (Asymmetric MoE)와 CED 아키텍처',
    analogy: '두꺼운 참고 자료를 읽을 때는 속독으로 빠르게 핵심만 훑고(8B 활성화), 최종 답안지를 작성할 때는 두뇌를 집중 가동해 정교하게 서술하는(16B 활성화) 전략입니다.',
    definition: '딥시크가 DeepSeek-V4.1-Flash-1017에서 선보인 Causal Encoder-Decoder(CED) 기반 구조입니다. 전체 552B 백본 중 긴 입력 프롬프트를 읽고 이해하는 인코더 단계에서는 토큰당 8B 파라미터만 활성화해 대기 시간을 줄이고, 실제 답변과 코드를 생성하는 디코더 단계에서는 두 배인 16B 파라미터를 활성화해 출력 품질을 극대화합니다.',
    deepNote: '실무 포인트: 에이전트 코딩에서는 수만 줄의 기존 코드를 읽는(Input) 양이 새로 짜는(Output) 양보다 훨씬 많기 때문에, 입력 연산을 가볍게 만든 비대칭 구조가 비용과 속도를 획기적으로 줄여줍니다.',
    studyGuide: '1단계(입문): AI 에이전트 작업에서 왜 입력 토큰(문서·코드 읽기)이 출력 토큰(답변 쓰기)보다 10~50배 많은지 이해합니다. → 2단계(초급): 입력 처리(Prefill)와 출력 생성(Decode)에 서로 다른 크기의 전문가를 배정하는 비대칭(Asymmetric) 발상을 익힙니다. → 3단계(중급~심화): CED 구조가 KV 캐시 메모리를 75% 줄이는 원리를 서빙 관점에서 분석합니다.',
    levels: {
      beginner: '입문 개념: 시험 문제를 읽을 때와 답을 쓸 때 쓰는 뇌 에너지가 다르듯, 긴 배경 문서를 읽을 때는 가벼운 모드(8B)로 빨리 읽고 답을 작성할 때만 정밀 모드(16B)를 켜서 요금과 대기 시간을 확 줄인 기술입니다.',
      intermediate: '중급 원리: 기존 Decoder-only 트랜스포머는 입력 토큰과 출력 토큰에 똑같은 레이어와 파라미터를 적용했습니다. CED(Causal Encoder-Decoder)는 입력 구간을 8B 활성 인코더로 압축해 디코더(16B 활성)로 넘깁니다.',
      advanced: '심화 엔지니어링: 인코더가 긴 컨텍스트를 압축된 잠재 표현으로 요약해 디코더에 전달하므로, 10만 토큰 이상의 장문 에이전트 루프에서 TTFT(첫 토큰 응답 시간)와 KV 캐시 점유율을 획기적으로 단축합니다.'
    },
    keyTerms: [
      { term: 'CED (Causal Encoder-Decoder)', desc: '입력 문맥을 고속으로 압축·독해하는 인과적 인코더와 정밀한 토큰 생성을 담당하는 디코더를 분리 결합한 아키텍처' },
      { term: 'TTFT (Time To First Token)', desc: '사용자가 프롬프트를 보낸 순간부터 AI의 첫 번째 글자 응답이 화면에 찍히기까지 걸리는 초기 대기 시간' },
      { term: '입출력 비대칭성 (I/O Asymmetry)', desc: '실무 RAG와 코딩 에이전트에서 입력 토큰 수가 출력 토큰 수보다 압도적으로 많은 워크로드 특성' }
    ],
    relatedTools: ['DeepSeek-V4.1-Flash-1017', 'DeepSeek Harness v0.2.1', 'OpenRouter'],
    dateAdded: '2026-10-18',
    processSteps: [
      { title: '대규모 입력 프롬프트 유입', desc: '수만 줄의 프로젝트 소스 코드와 문서가 입력 프롬프트로 한꺼번에 들어옵니다.', nodes: ['50,000 토큰 코드 유입', 'CED 인코더 진입', 'KV 캐시 1/4 압축 준비', '고속 독해 모드 가동'] },
      { title: '인코더: 경량 8B 활성화 (속독)', desc: '입력 토큰을 처리할 때는 552B 중 8B만 깨워 초고속으로 문맥을 요약하고 KV 캐시 메모리를 기존 대비 75% 줄입니다.', nodes: ['입력 활성: 8B / 552B', 'KV 캐시 메모리 75% 절감', '첫 응답 대기 시간 단축', '문맥 압축 완료'] },
      { title: '디코더: 정밀 16B 활성화 (집필)', desc: '실제 코드와 추론 답변을 생성할 때는 16B 전문가를 가동해 정확하고 군더더기 없는 답을 작성합니다.', nodes: ['출력 활성: 16B / 552B', '강화학습 자기 피드백', '불필요한 장황성 제거', '정밀 코드 생성'] },
      { title: '비용-성능 파레토 프론티어 달성', desc: '동일한 API 비용으로 작업 완료 속도와 SWE-bench 해결률을 동시에 끌어올립니다.', nodes: ['입력 단가: $0.30 / 1M', '출력 길이 단축으로 비용 절감', '작업 완료 시간 단축', '오픈웨이트 에이전트 1위권'] }
    ],
    labConfig: {
      paramLabel: '에이전트 작업 시나리오 선택 (입력 10만 토큰 + 출력 2천 토큰)',
      paramType: 'select',
      options: ['비대칭 CED MoE (입력 8B / 출력 16B - DeepSeek V4.1 Flash)', '대칭형 일반 MoE (입출력 모두 16B 동일 적용)'],
      defaultParam: '비대칭 CED MoE (입력 8B / 출력 16B - DeepSeek V4.1 Flash)',
      codeLang: 'Python · DeepSeek-V4.1-Flash-1017 API 호출 예제',
      starterCode: `from openai import OpenAI

client = OpenAI(base_url="https://openrouter.ai/api/v1", api_key="YOUR_KEY")
res = client.chat.completions.create(
    model="deepseek/deepseek-v4.1-flash-1017",
    messages=[{"role": "user", "content": "전체 프로젝트 구조를 분석해 리팩토링 패치를 작성해줘."}]
)
print(res.choices[0].message.content)`,
      runOutput: `[실행 결과 · Asymmetric CED Performance]
- 입력 프롬프트 처리 (100,000 tokens @ 8B Active): 1.2초 만에 프리필(Prefill) 완료
- KV 캐시 메모리 점유: 기존 대비 25% 수준 유지
- 출력 생성 (2,000 tokens @ 16B Active): 군더더기 없는 코드 패치 생성 완료
- 총 소요 비용: $0.031 (동급 프론티어 모델 대비 약 1/10 비용)`
    },
    quiz: {
      question: '비대칭 MoE(CED) 아키텍처가 긴 입력 문서를 읽는 인코더 단계(8B 활성)와 답변을 생성하는 디코더 단계(16B 활성)의 활성 파라미터 크기를 다르게 설계한 핵심 이유는 무엇인가요?',
      options: [
        '대량의 입력 코드를 빠르게 읽으면서 첫 응답 대기 시간(TTFT)과 KV 캐시를 줄이고, 실제 답변 생성 시에만 연산력을 집중해 품질을 높이기 위해서',
        '입력 문서를 아예 읽지 않고 무작위로 답변을 생성하기 위해서',
        '모니터 해상도를 낮추기 위해서',
        '오직 영어 대문자만 처리하기 위해서'
      ],
      answerIndex: 0,
      explanation: '에이전트 워크로드에서는 입력 토큰 비중이 매우 높으므로, 입력 독해는 가벼운 8B로 빠르게 처리해 KV 캐시와 대기 시간을 줄이고 출력 생성에만 16B를 투입하는 비대칭 설계가 높은 가성비를 발휘합니다.'
    }
  },
  {
    id: 't11',
    chapter: 4,
    sectionCode: '4.5',
    layer: 'L1',
    difficulty: 'advanced',
    roles: ['ml-dl', 'mlops-infra'],
    term: '루프 트랜스포머 (Loop Transformer)와 가변 추론 깊이',
    analogy: '쉬운 질문에는 머릿속으로 한 번만 생각하고 답하고, 고난도 수학·코딩 문제에는 같은 칠판 앞에서 네 번, 다섯 번 반복해 검산하며 생각을 깊게 다듬는 구조입니다.',
    definition: '신경망 층(Layer)을 무조건 길게 쌓아 모델 크기를 키우는 대신, 중간의 순환 블록(예: 20개 은닉층)을 회전목마처럼 여러 번 반복 통과(Loop)시켜 깊은 추론을 수행하는 아키텍처입니다. 엔비디아가 공개한 Dory 1.0-4B는 단 4B의 작은 크기로도 루프 횟수(추론 깊이)를 4회로 늘려 SWE-bench 61.8점이라는 대형 모델급 성적을 기록했습니다.',
    deepNote: '실무 포인트: 루프 트랜스포머는 글을 밖으로 쓰지 않고 신경망 내부의 잠재 공간(Latent space)에서 반복 추론을 수행하므로, 오픈AI 등에서는 이 내부 생각 과정을 안전하게 감시·정렬하기 위한 보안 연구를 병행하고 있습니다.',
    studyGuide: '1단계(입문): 모델의 크기(파라미터 수)를 늘리는 것과 생각 횟수(루프 깊이)를 늘리는 것의 차이를 이해합니다. → 2단계(초급): 글자로 생각을 길게 출력하는 CoT(Chain-of-Thought)와 신경망 내부 벡터를 순환시키는 잠재 추론(Latent Reasoning)을 비교합니다. → 3단계(중급~심화): 문제 난이도에 따라 추론 시점 연산량(Test-time Compute)을 동적으로 조절하는 아키텍처를 학습합니다.',
    levels: {
      beginner: '입문 개념: 4B짜리 작은 두뇌라도 어려운 문제를 만났을 때 뇌 회로를 4바퀴 반복해서 돌리면, 한 바퀴만 돌리는 큰 모델 못지않게 똑똑한 해답을 내놓는 원리입니다.',
      intermediate: '중급 원리: 입력층(Prelude, 8층) → 순환 코어 블록(Recurrent Core, 20층 × K회 반복) → 출력층(Coda, 8층) 구조로 이루어집니다. 가중치를 재사용(Weight Tying)하므로 VRAM 점유량은 4B 그대로 유지되면서 유효 깊이는 96층까지 깊어집니다.',
      advanced: '심화 엔지니어링: 토큰 단위로 생각 사슬(CoT)을 밖으로 출력하면 KV 캐시와 디코딩 시간이 선형 증가하지만, 루프 트랜스포머는 잠재 벡터 상태(Hidden State)를 내부에서 반복 갱신하므로 토큰 소비 없이 깊은 추론이 가능합니다.'
    },
    keyTerms: [
      { term: '가중치 공유 순환 (Weight-Tied Loop)', desc: '새로운 레이어 파라미터를 추가하지 않고 동일한 중간 레이어 블록에 은닉 상태 벡터를 여러 번 다시 통과시키는 구조' },
      { term: '잠재 공간 추론 (Latent Space Reasoning)', desc: '자연어 단어로 변환해 출력하기 전에 신경망 내부의 고차원 실수 벡터 상태에서 다단계 논리 연산을 수행하는 방식' },
      { term: '가변 추론 깊이 (Adaptive Depth)', desc: '질문의 난이도나 연산 예산에 맞춰 추론 시점에 루프 반복 횟수(1회~8회 등)를 자유롭게 조절하는 기능' }
    ],
    relatedTools: ['NVIDIA Dory 1.0-4B', 'OpenAI Loop Transformer 안전성 연구'],
    dateAdded: '2026-10-18',
    processSteps: [
      { title: '입력 블록 진입 (8 Layers)', desc: '사용자의 질문과 256K 컨텍스트 데이터가 첫 8개 입력 레이어를 통과하며 내부 표현으로 변환됩니다.', nodes: ['질문 토큰 유입', '8개 입력 레이어 통과', '문제 난이도 설정 확인', '순환 블록 진입'] },
      { title: '잠재 순환 루프 1~2회 (기본 추론)', desc: '중간 20개 레이어로 구성된 순환 블록을 1~2회 회전하며 1차적인 가설과 코드 구조를 잡습니다.', nodes: ['Loop #1: 초안 구조 형성', 'Loop #2: 문맥 관계 정교화', '내부 잠재 상태 업데이트', '추가 루프 여부 확인'] },
      { title: '잠재 순환 루프 3~4회 (심층 검산)', desc: '어려운 버그 수정이나 수학 문제의 경우 동일한 20개 레이어를 3~4회째 다시 통과하며 논리적 모순을 스스로 교정합니다.', nodes: ['Loop #3: 엣지 케이스 점검', 'Loop #4: 논리 오류 교정', '파라미터 추가 없이 지능 상승', '최종 상태 확정'] },
      { title: '출력 블록 통과 (8 Layers)', desc: '충분히 숙성된 내부 추론 결과가 마지막 8개 출력 레이어를 거쳐 정확한 최종 답변 토큰으로 출력됩니다.', nodes: ['8개 출력 레이어 통과', '4B 크기로 61.8% 해결률', '가변 추론 깊이 완료', '최종 코드 패치 반환'] }
    ],
    labConfig: {
      paramLabel: '루프 순환 횟수(Inference Depth) 조절 실험 (Dory 1.0-4B)',
      paramType: 'select',
      options: ['1 Loop (단순 질의응답 · 초고속 모드)', '2 Loops (표준 업무 · 균형 모드)', '4 Loops (고난도 코딩 · 최대 추론 깊이 모드)'],
      defaultParam: '4 Loops (고난도 코딩 · 최대 추론 깊이 모드)',
      codeLang: 'Python · 가변 추론 깊이(num_loops) 지정 추론 예제',
      starterCode: `# NVIDIA Dory 1.0-4B 모델에 추론 루프 깊이(num_loops=4)를 지정하여 실행
model_config = {
    "model": "nvidia/Nemotron-Labs-Dory-1.0-4B",
    "num_recurrent_loops": 4,   # 1~4회 사이에서 문제 난이도에 맞게 조절
    "context_window": 262144    # 256K 컨텍스트
}
print(f"설정된 추론 깊이: {model_config['num_recurrent_loops']}회 순환 (유효 레이어 깊이: {8 + 20*4 + 8}층 효과)")`,
      runOutput: `[실행 결과 · Adjustable Inference Depth]
모델 크기: 4B (메모리 점유량은 4B 그대로 고정!)
설정된 추론 깊이: 4회 순환 (입력 8층 + 순환 20층 x 4회 + 출력 8층 = 총 96층 신경망 통과 효과)
SWE-bench Verified 성적 변화:
- 1 Loop: 41.2점 -> 2 Loops: 53.5점 -> 4 Loops: 61.8점 달성!`
    },
    quiz: {
      question: '루프 트랜스포머(Loop Transformer, 예: Dory 1.0-4B)가 4B라는 작은 메모리 크기를 유지하면서도 고난도 코딩 문제에서 대형 모델에 버금가는 성적을 내는 핵심 원리는 무엇인가요?',
      options: [
        '중간 은닉층 블록을 여러 번 반복 순환(Loop)시켜 파라미터 용량 증가 없이 유효 추론 깊이를 깊게 만들기 때문',
        '실행할 때마다 인터넷에서 100B 모델을 몰래 새로 다운로드하기 때문',
        '모든 숫자 계산을 생략하고 첫 번째 단어만 출력하기 때문',
        '하드디스크를 포맷하여 공간을 확보하기 때문'
      ],
      answerIndex: 0,
      explanation: '루프 트랜스포머는 동일한 중간 레이어 블록을 반복 통과(Weight-tied recurrence)시켜 메모리 점유량은 소형 모델 수준으로 유지하면서 문제 난이도에 따라 깊은 잠재 추론을 수행합니다.'
    }
  },
  {
    id: 't12',
    chapter: 4,
    sectionCode: '4.6',
    layer: 'L1',
    difficulty: 'intermediate',
    roles: ['pm', 'app-be', 'mlops-infra'],
    term: 'System 1 결정 모델 (Decision Model: d1-ultra & Jev)',
    analogy: '긴 논술 답안지를 작성하는 작가(일반 LLM)가 아니라, 서류와 사진을 보자마자 0.01초 만에 승인·반려·담당 부서 확률을 정확히 찍어주는 초고속 분류 심사관입니다.',
    definition: '심리학의 시스템 1(빠르고 직관적인 판단) 개념을 구현한 모델입니다. 일반 LLM처럼 단어를 한 글자씩 생성(Output tokens)하지 않고, 단 한 번의 신경망 순전파(One forward pass)만으로 각 선택지의 보정된 확률(Calibrated probability)을 즉시 반환합니다. 출력 토큰이 0개이므로 속도가 최대 200배 빠르고 비용은 100만 입력 토큰당 $0.042 수준으로 저렴합니다.',
    deepNote: '실무 포인트: 에이전트 워크플로에서 모든 질문에 비싼 프론티어 모델을 부르지 않고, 앞단에 Liquid AI의 d1-ultra나 TypeSafe의 Jev를 배치해 라우팅·가드레일·채점을 맡기는 것이 최신 엔지니어링 트렌드입니다.',
    studyGuide: '1단계(입문): 대니얼 카너먼의 <생각에 관한 생각>에 나오는 System 1(빠른 직관/분류)과 System 2(느린 숙고/추론 생성)를 AI 모델 역할에 대입해 이해합니다. → 2단계(초급): 문장 생성(Autoregressive Generation)이 없는 1-Pass 확률 산출이 왜 빠르고 저렴한지 파악합니다. → 3단계(중급~심화): 에이전트 파이프라인 앞단에 System 1 모델을 라우터 및 가드레일로 결합합니다.',
    levels: {
      beginner: '입문 개념: "이 메일이 스팸인가 아닌가?"만 판별하면 되는데 AI가 장황한 편지를 쓰느라 시간과 돈을 낭비할 필요가 없습니다. System 1 모델은 즉시 "스팸일 확률 98.2%"라고 숫자만 콕 집어 알려줍니다.',
      intermediate: '중급 원리: 일반 LLM은 출력 토큰 N개를 만들려면 신경망을 N번 반복 실행해야 하지만, System 1 결정 모델은 입력 상태와 선택지를 한 번만 순전파(1 Forward Pass)시켜 선택지별 보정 확률(Calibrated Probability)을 산출합니다.',
      advanced: '심화 엔지니어링: 확률 보정(Calibration, 예: Brier Score 최소화)이 정교하게 되어 있어, 모델이 출력한 0.90이라는 점수를 실제 90% 신뢰도 임계값(Threshold) 분기 조건문(`if prob > 0.90:`)에 바로 사용할 수 있습니다.'
    },
    keyTerms: [
      { term: '시스템 1 vs 시스템 2 AI', desc: '단일 패스로 즉각적인 분류·라우팅 결정을 내리는 모델(System 1)과 다단계 추론 토큰을 생성하며 숙고하는 모델(System 2)' },
      { term: '단일 순전파 (Single Forward Pass)', desc: '토큰을 한 글자씩 이어 쓰는 자기회귀 루프 없이 입력 데이터를 신경망에 단 한 번 통과시켜 결과를 얻는 연산 방식' },
      { term: '보정된 확률 (Calibrated Probability)', desc: '모델이 예측한 확신도 점수(예: 0.85)가 실제 현실에서 정답일 통계적 확률(85%)과 정확히 일치하도록 보정된 수치' }
    ],
    relatedTools: ['Liquid AI d1-ultra', 'TypeSafe Jev', 'Pydantic AI', 'OpenRouter /v1/systemone'],
    dateAdded: '2026-10-19',
    processSteps: [
      { title: '상태(텍스트·이미지) 및 선택지 입력', desc: '고객 문의 내용(또는 영수증 이미지)과 분류할 선택지 배열(["환불승인", "추가확인", "보안차단"])을 전달합니다.', nodes: ['텍스트 + 이미지 입력', '타입 지정 질문 전달', '선택지 3개 지정', 'System 1 엔드포인트 호출'] },
      { title: '단일 순전파 (1 Forward Pass)', desc: '생각 과정이나 문장을 한 글자씩 생성하지 않고 신경망을 단 한 번만 통과시켜 즉시 계산을 끝냅니다.', nodes: ['Autoregressive 생성 생략', '출력 토큰 수: 0개', '응답 지연: ~15ms', '출력 비용: $0.00'] },
      { title: '보정된 확률 분포 산출', desc: '각 선택지가 정답일 확률(예: 환불승인 0.91, 추가확인 0.08, 보안차단 0.01)을 정밀하게 계산합니다.', nodes: ['환불승인: 91.2%', '추가확인: 7.8%', '보안차단: 1.0%', '신뢰도(Confidence) 검증'] },
      { title: '즉시 분기 및 후속 에이전트 라우팅', desc: '확률이 90% 이상이면 자동 처리하고, 애매한 경우에만 대형 추론 모델이나 인간 담당자에게 넘깁니다.', nodes: ['고신뢰도 건 즉시 처리', '불필요한 LLM 호출 차단', '비용 95% 이상 절감', '파이프라인 완료'] }
    ],
    labConfig: {
      paramLabel: '분류할 실무 시나리오 선택',
      paramType: 'select',
      options: ['고객 환불 요청 영수증 이미지 + 규정 부합 여부 판별 (d1-ultra)', '사용자 프롬프트 보안 위협(Prompt Injection) 여부 실시간 차단 (Jev)'],
      defaultParam: '고객 환불 요청 영수증 이미지 + 규정 부합 여부 판별 (d1-ultra)',
      codeLang: 'Python · OpenRouter /v1/systemone 결정 모델 호출',
      starterCode: `import requests

# 문장 생성 없이 확률값만 즉시 반환받는 System 1 API 호출
payload = {
    "model": "liquid/d1-ultra",
    "state": "영수증 이미지 확인 결과 구매일로부터 5일 경과, 미개봉 상태임.",
    "question": "이 요청을 어떻게 처리해야 합니까?",
    "options": ["즉시 환불 승인", "상담원 수동 검토", "규정 외 반려"]
}
print("Requesting 1-pass calibrated decision probabilities...")`,
      runOutput: `[실행 결과 · System 1 Decision Output]
Latency: 18 ms | Input Cost: $0.000002 | Output Tokens: 0 ($0.00)
Calibrated Probabilities:
- "즉시 환불 승인": 0.964 (96.4%)  <-- Selected Decision
- "상담원 수동 검토": 0.031 (3.1%)
- "규정 외 반려": 0.005 (0.5%)`
    },
    quiz: {
      question: 'System 1 결정 모델(예: Liquid d1-ultra, TypeSafe Jev)이 일반 LLM 대비 최대 200배 빠르고 비용이 극도로 저렴한 구조적 이유는 무엇인가요?',
      options: [
        '출력 단어를 한 글자씩 생성하지 않고(Output Token 0개), 단 한 번의 순전파(1 Forward Pass)로 선택지별 보정 확률만 즉시 계산하기 때문',
        '인터넷 검색 결과를 복사해서 그대로 붙여넣기 때문',
        '하루에 한 번만 작동하도록 제한되어 있기 때문',
        '정답 확률을 항상 무조건 50%로 고정해 반환하기 때문'
      ],
      answerIndex: 0,
      explanation: '자기회귀(Autoregressive) 텍스트 생성 과정 없이 단 1회의 순전파만으로 선택지들의 보정 확률 분포를 산출하므로 출력 토큰 비용이 0원이며 밀리초 단위로 응답합니다.'
    }
  }
);
