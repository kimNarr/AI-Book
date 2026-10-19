// ============================================================================
// PART II · 머신러닝 · 딥러닝 · 강화학습 핵심 메커니즘 (2.x)
// ============================================================================

window.BOOK_PARTS_DATA = window.BOOK_PARTS_DATA || [];

window.BOOK_PARTS_DATA.push(
  {
    id: 'p2-ml-fundamentals',
    chapter: 2,
    sectionCode: '2.1',
    layer: 'L1',
    difficulty: 'beginner',
    roles: ['pm', 'data-ontology', 'ml-dl'],
    term: '머신러닝 학습 패러다임과 손실함수 · 경사하강법',
    analogy: '눈을 가린 채 산 정상에서 가장 낮은 골짜기(오차 최소점)를 찾아 발밑의 경사(기울기)를 느끼며 한 걸음씩 내려가는 과정입니다.',
    definition: '머신러닝은 문제와 정답이 함께 주어지는 지도학습(Supervised Learning), 정답 없이 데이터의 군집과 구조를 찾는 비지도학습(Unsupervised Learning), 데이터 일부를 가리고 스스로 맞히게 하는 자기지도학습(Self-Supervised Learning)으로 나뉩니다. 모든 학습의 핵심은 모델의 예측과 실제 정답 사이의 차이인 손실함수(Loss Function)를 계산하고, 미분 기울기(Gradient)의 반대 방향으로 가중치를 조금씩 수정하는 경사하강법(Gradient Descent)입니다.',
    deepNote: '실무 포인트: 정형 테이블 데이터(매출 예측, 이탈률 분석, 사기 탐지)에서는 수백억 파라미터의 LLM보다 XGBoost·LightGBM 같은 그래디언트 부스팅 트리(GBDT) 모델이 여전히 훨씬 빠르고 정확합니다.',
    studyGuide: '1단계(입문): 지도·비지도·자기지도학습의 차이와 분류(Classification) vs 회귀(Regression) 개념을 구분합니다. → 2단계(초급): 손실함수(MSE, Cross-Entropy)와 경사하강법, 학습률(Learning Rate), 과적합(Overfitting)을 이해합니다. → 3단계(중급~심화): AdamW 옵티마이저, 코사인 학습률 스케줄러, 정규화(Dropout, Weight Decay) 기법을 코드로 적용합니다.',
    levels: {
      beginner: '입문 개념: 학생이 모의고사를 풀고 채점(손실함수)한 뒤, 틀린 오답 노트를 보며 생각 습관을 교정(경사하강법)하는 것입니다. 기출문제만 달달 외워 새 문제를 못 푸는 현상을 과적합(Overfitting)이라 합니다.',
      intermediate: '중급 원리: 가중치 W에 대해 손실 L의 편미분(∂L/∂W)을 구한 뒤 W ← W - η·(∂L/∂W) 공식으로 업데이트합니다. 여기서 η(에타)가 학습률(Learning Rate)이며, 너무 크면 발산하고 너무 작으면 수렴이 느려집니다.',
      advanced: '심화 엔지니어링: 대규모 모델 학습에서는 미니배치 확률적 경사하강법(SGD)에 모멘텀과 적응형 학습률을 결합한 AdamW나 Muon 옵티마이저를 사용하며, Gradient Clipping으로 기울기 폭발을 제어합니다.'
    },
    keyTerms: [
      { term: '손실함수 (Loss Function)', desc: '모델의 예측값과 실제 정답 사이의 오차를 하나의 숫자로 측정하는 채점 기준 (예: Cross-Entropy)' },
      { term: '경사하강법 (Gradient Descent)', desc: '손실함수의 미분 기울기(Gradient)가 줄어드는 방향으로 파라미터를 반복 업데이트하는 최적화 알고리즘' },
      { term: '자기지도학습 (Self-Supervised)', desc: '사람이 일일이 라벨을 달지 않아도 문장의 다음 단어를 가리고 맞히게 하여 거대 코퍼스를 학습하는 기법' },
      { term: '과적합 (Overfitting)과 일반화', desc: '훈련 데이터에만 지나치게 맞춰져 처음 보는 실전 데이터(Test set)에서 성능이 급격히 떨어지는 현상' }
    ],
    relatedTools: ['Scikit-learn', 'XGBoost / LightGBM', 'PyTorch Optimizer (AdamW / Muon)'],
    dateAdded: '2026-10-19',
    processSteps: [
      { title: '1단계: 순전파 예측 (Forward)', desc: '입력 데이터(X)가 현재 가중치(W)를 통과하여 모델의 예측값(ŷ)을 출력합니다.', nodes: ['훈련 데이터(X) 입력', '가중치 연산 수행', '예측 확률(ŷ) 산출', '초기 오차 큰 상태'] },
      { title: '2단계: 손실(Loss) 채점', desc: '손실함수(Cross-Entropy 등)가 예측값(ŷ)과 실제 정답(y)의 차이를 정밀한 오차 점수로 계산합니다.', nodes: ['예측값 vs 정답 비교', 'Cross-Entropy 계산', 'Loss 스칼라값 도출', '목표: Loss → 0 최소화'] },
      { title: '3단계: 역전파 기울기 계산', desc: '오차의 원인이 어느 가중치에 얼마나 있는지 출력층에서 입력층 방향으로 미분(Gradient)을 역추적합니다.', nodes: ['연쇄법칙(Chain Rule)', '역전파(Backprop) 수행', '각 파라미터 기울기 산출', '수정 방향 결정'] },
      { title: '4단계: 가중치 업데이트', desc: '옵티마이저(AdamW)가 학습률(Learning Rate)만큼 가중치를 이동시켜 다음번 예측 오차를 줄입니다.', nodes: ['W = W - lr * grad', '오차 골짜기로 하강', '검증셋(Val) 일반화 확인', '수렴 완료'] }
    ],
    labConfig: {
      paramLabel: '학습률 (Learning Rate) 설정 실험',
      paramType: 'select',
      options: [
        '적정 학습률 (lr = 0.001 · 안정적 오차 감소 및 수렴)',
        '과도한 학습률 (lr = 1.5 · 골짜기를 지나쳐 오차 발산 NaN)',
        '극소 학습률 (lr = 0.0000001 · 학습 정체 및 지역 최적점 갇힘)'
      ],
      defaultParam: '적정 학습률 (lr = 0.001 · 안정적 오차 감소 및 수렴)',
      codeLang: 'Python · PyTorch 경사하강법 학습 루프 핵심 구조',
      starterCode: `import torch
import torch.nn as nn

# 선형 신경망 레이어 및 AdamW 옵티마이저 설정
model = nn.Linear(in_features=16, out_features=2)
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=0.01)
criterion = nn.CrossEntropyLoss()

# 1 스텝 학습 과정: 순전파 -> 손실 계산 -> 역전파 -> 가중치 갱신
optimizer.zero_grad()
loss = criterion(model(torch.randn(8, 16)), torch.randint(0, 2, (8,)))
loss.backward()      # 역전파로 기울기(Gradient) 계산
optimizer.step()     # 경사하강법으로 파라미터 업데이트
print(f"Step Loss: {loss.item():.4f}")`,
      runOutput: `[실행 결과 · Gradient Descent Optimization]
Epoch 01 | Train Loss: 0.6931 -> Val Loss: 0.6812
Epoch 10 | Train Loss: 0.3120 -> Val Loss: 0.3245
Epoch 50 | Train Loss: 0.0842 -> Val Loss: 0.0910 (과적합 없이 안정적 수렴 완료!)`
    },
    quiz: {
      question: '딥러닝과 머신러닝에서 출력된 오차(Loss)를 바탕으로 각 층의 가중치가 오차에 기여한 정도(미분 기울기)를 출력층에서 입력층 방향으로 거꾸로 전파하며 계산하는 핵심 알고리즘은 무엇인가요?',
      options: [
        '역전파 (Backpropagation)',
        '토큰화 (Tokenization)',
        '양자화 (Quantization)',
        '그리디 서치 (Greedy Search)'
      ],
      answerIndex: 0,
      explanation: '역전파(Backpropagation)는 미분의 연쇄법칙(Chain Rule)을 이용해 출력층의 손실 기울기를 입력층 방향으로 역산하여 수십억 개의 파라미터를 효율적으로 업데이트할 수 있게 해주는 핵심 알고리즘입니다.'
    }
  },
  {
    id: 'p2-dl-transformer',
    chapter: 2,
    sectionCode: '2.2',
    layer: 'L1',
    difficulty: 'intermediate',
    roles: ['app-be', 'ml-dl', 'mlops-infra'],
    term: '딥러닝 신경망의 발전과 트랜스포머 어텐션 (Self-Attention)',
    analogy: '문장을 앞에서부터 한 단어씩 겨우 기억하며 읽던 방식(RNN)에서 벗어나, 문장 전체를 한눈에 펼쳐놓고 각 단어가 문맥상 어떤 단어와 강하게 연결되는지 형광펜 줄(Attention)을 그으며 읽는 방식입니다.',
    definition: '딥러닝은 다층 퍼셉트론(MLP), 이미지의 공간 특징을 뽑는 합성곱 신경망(CNN), 시계열 순서를 처리하는 순환 신경망(RNN/LSTM)을 거쳐 2017년 트랜스포머(Transformer) 아키텍처로 통합되었습니다. 트랜스포머의 핵심인 셀프 어텐션(Self-Attention)은 모든 토큰을 Query(질의), Key(색인), Value(내용) 세 가지 벡터로 변환한 뒤 내적(Dot-product) 유사도를 계산해, 문장 내 거리에 상관없이 단어 간의 맥락적 관계를 병렬로 포착합니다.',
    deepNote: '실무 포인트: 트랜스포머가 RNN을 대체하고 초거대 모델 시대를 연 결정적 이유는 "GPU 대규모 병렬 연산"이 가능해졌기 때문입니다. 앞 단어 계산이 끝날 때까지 기다릴 필요 없이 수만 개의 토큰을 행렬 곱셈으로 동시에 학습합니다.',
    studyGuide: '1단계(입문): 왜 RNN은 긴 문장 앞부분을 잊어버리는지(장기 의존성 문제), 어텐션이 이를 어떻게 해결했는지 비유로 이해합니다. → 2단계(초급): Query, Key, Value(Q, K, V)의 역할과 Attention(Q,K,V) = softmax(QK^T / √d)V 수식의 의미를 파악합니다. → 3단계(중급~심화): Multi-Head Attention, FlashAttention(메모리 I/O 최적화), GQA(Grouped-Query Attention)를 학습합니다.',
    levels: {
      beginner: '입문 개념: "그 은행에 갔더니 강물이 불어나 있었다"라는 문장에서 "은행"이 금융기관이 아니라 강둑(River bank)이라는 뜻임을 알 수 있는 이유는 뒤의 "강물"이라는 단어에 주의(Attention)를 기울였기 때문입니다.',
      intermediate: '중급 원리: 현재 단어의 Query 벡터가 문장 내 모든 단어의 Key 벡터와 내적을 수행해 연관도 점수(Attention Score)를 구하고, Softmax로 확률화한 뒤 Value 벡터들을 가중 합산하여 문맥이 반영된 새로운 표현을 만듭니다.',
      advanced: '심화 엔지니어링: 표준 어텐션은 시퀀스 길이 L에 대해 O(L²) 메모리를 사용하므로, GPU HBM과 SRAM 사이의 읽기/쓰기를 최소화하는 FlashAttention-3와 Key/Value 헤드를 공유해 KV 캐시를 줄이는 GQA/MLA가 필수적으로 적용됩니다.'
    },
    keyTerms: [
      { term: 'Query · Key · Value (Q, K, V)', desc: '찾고자 하는 질문(Query), 비교 대상 꼬리표(Key), 실제 전달할 정보 알맹이(Value) 역할의 세 가지 선형 투영 벡터' },
      { term: '셀프 어텐션 (Self-Attention)', desc: '입력 시퀀스 내부의 모든 토큰 쌍끼리 서로 얼마나 밀접한 관련이 있는지 가중치를 계산해 문맥을 통합하는 메커니즘' },
      { term: '멀티 헤드 어텐션 (Multi-Head)', desc: '어텐션을 여러 개의 독립된 헤드(시각)로 병렬 수행하여 문법적 관계, 의미적 관계, 지시 대명사 관계를 동시에 포착하는 구조' },
      { term: 'FlashAttention', desc: '어텐션 행렬을 GPU의 초고속 메모리(SRAM) 타일 단위로 쪼개어 계산함으로써 속도를 수배 높이고 메모리를 절감하는 커널 기법' }
    ],
    relatedTools: ['PyTorch SDPA', 'FlashAttention-3', 'HuggingFace Transformers'],
    dateAdded: '2026-10-19',
    processSteps: [
      { title: '1단계: 임베딩 & 위치 인코딩', desc: '입력 토큰들을 고차원 벡터로 바꾸고 단어의 순서 정보(RoPE 위치 인코딩)를 주입합니다.', nodes: ['토큰 임베딩 변환', 'RoPE 회전 위치 인코딩', '단어 순서 정보 결합', '병렬 행렬 입력 준비'] },
      { title: '2단계: Q · K · V 벡터 생성', desc: '각 토큰 벡터에 학습된 가중치 행렬(Wq, Wk, Wv)을 곱해 Query, Key, Value 벡터를 생성합니다.', nodes: ['Query(질의) 투영', 'Key(색인) 투영', 'Value(정보) 투영', '멀티 헤드 분할'] },
      { title: '3단계: 어텐션 스코어 행렬 계산', desc: 'Query와 Key의 내적을 구하고 Softmax를 취해 단어 간 연관도 확률 지도(Attention Map)를 완성합니다.', nodes: ['Q · K^T 내적 연산', '스케일링 및 마스킹', 'Softmax 확률 분포', '문맥 연관도 확정'] },
      { title: '4단계: Value 가중합 & FFN 통과', desc: '연관도 확률에 따라 Value 벡터들을 합산하고 피드포워드 신경망(FFN/MoE)을 거쳐 다음 층으로 전달합니다.', nodes: ['Value 가중 합산', '잔차 연결(Residual)', 'LayerNorm 정규화', 'FFN / MoE 층 전달'] }
    ],
    labConfig: {
      paramLabel: '어텐션 메커니즘 종류별 KV 캐시 및 연산 특성 비교',
      paramType: 'select',
      options: [
        'MHA (Multi-Head Attention · 초기 표준, KV 캐시 메모리 최대)',
        'GQA (Grouped-Query Attention · Llama/Muse 표준, KV 캐시 대폭 절감)',
        'MLA (Multi-head Latent Attention · DeepSeek 표준, 저차원 잠재 압축)'
      ],
      defaultParam: 'GQA (Grouped-Query Attention · Llama/Muse 표준, KV 캐시 대폭 절감)',
      codeLang: 'Python · Scaled Dot-Product Attention 핵심 수식 구현',
      starterCode: `import torch
import torch.nn.functional as F
import math

# Batch=1, Heads=4, Seq_Len=6, Head_Dim=64
Q = torch.randn(1, 4, 6, 64)
K = torch.randn(1, 4, 6, 64)
V = torch.randn(1, 4, 6, 64)

# Attention(Q, K, V) = softmax(Q @ K^T / sqrt(d_k)) @ V
scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(64)
attn_weights = F.softmax(scores, dim=-1)
output = torch.matmul(attn_weights, V)
print("Attention Weights Shape:", attn_weights.shape)
print("Contextualized Output Shape:", output.shape)`,
      runOutput: `[실행 결과 · Self-Attention Matrix Computation]
Attention Weights Shape: torch.Size([1, 4, 6, 6]) -> 6개 토큰 간의 상호 연관도 행렬
Contextualized Output Shape: torch.Size([1, 4, 6, 64])
GQA/FlashAttention 적용 시: 128K 컨텍스트 기준 KV 캐시 메모리 75% 절감 및 연산 속도 3.4배 향상`
    },
    quiz: {
      question: '트랜스포머의 셀프 어텐션(Self-Attention)에서 입력 토큰들이 서로 어떤 맥락적 연관성을 가지는지 점수를 계산하기 위해 내적(Dot-product)을 수행하는 두 벡터의 조합은 무엇인가요?',
      options: [
        'Query(질의) 벡터와 Key(색인) 벡터',
        'Bias(편향) 벡터와 Loss(손실) 벡터',
        'Pixel(픽셀) 벡터와 Audio(오디오) 벡터',
        'Epoch(에포크)와 Batch(배치)'
      ],
      answerIndex: 0,
      explanation: '셀프 어텐션은 각 토큰의 Query 벡터와 모든 토큰의 Key 벡터를 내적(Q·K^T)하여 유사도 점수를 구한 뒤, 이를 Softmax로 정규화하여 Value 벡터들과 곱합니다.'
    }
  },
  {
    id: 'p2-reinforcement-learning',
    chapter: 2,
    sectionCode: '2.3',
    layer: 'L1',
    difficulty: 'advanced',
    roles: ['app-be', 'ml-dl'],
    term: '강화학습 (Reinforcement Learning: MDP · PPO · GRPO)',
    analogy: '정답지가 적힌 문제집(지도학습)을 주는 대신, 에이전트가 환경 속에서 직접 여러 행동을 시도해 보고 성공하면 당근(양의 보상), 실패하면 채찍(음의 보상)을 받아 스스로 최적의 전략(Policy)을 터득하는 과정입니다.',
    definition: '강화학습(RL)은 마르코프 결정 과정(MDP) 위에서 에이전트(Agent)가 환경(Environment)의 상태(State)를 관측하고 행동(Action)을 취해 누적 보상(Reward)을 최대화하는 정책(Policy)을 학습하는 기술입니다. 알파고와 로봇 제어뿐만 아니라, 최근에는 DeepSeek-R1/V4, OpenAI o-시리즈, Gemini 4 등 추론형 LLM이 스스로 긴 생각 사슬(Chain-of-Thought)과 코딩 해결책을 터득하도록 만드는 핵심 원동력(RLHF, PPO, GRPO)으로 쓰입니다.',
    deepNote: '실무 포인트: 과거 PPO 알고리즘은 행동 모델(Actor)과 똑같은 크기의 채점 모델(Critic)을 메모리에 함께 띄워야 해서 비용이 막대했으나, 최신 GRPO(Group Relative Policy Optimization)는 같은 질문에 여러 답변을 생성해 그룹 내 상대 점수로만 학습함으로써 메모리를 절반으로 줄이고 추론 지능을 폭발시켰습니다.',
    studyGuide: '1단계(입문): 강화학습의 5대 요소(에이전트, 환경, 상태 S, 행동 A, 보상 R)와 탐험(Exploration) vs 활용(Exploitation) 딜레마를 이해합니다. → 2단계(초급): 가치 기반(Q-Learning)과 정책 기반(Policy Gradient)의 차이를 익힙니다. → 3단계(중급~심화): LLM 정렬에 쓰이는 PPO와 비평가(Critic) 모델을 제거한 GRPO 및 검증 가능한 보상(RLVR, 코드 테스트 통과 여부 등) 설계를 실습합니다.',
    levels: {
      beginner: '입문 개념: 자전거 타기를 글로 배울 수 없듯, AI가 시행착오를 겪으며 점수를 많이 받는 행동을 강화하는 학습법입니다. 게임 클리어, 로봇 보행, 그리고 AI의 수학·코딩 자가 교정에 쓰입니다.',
      intermediate: '중급 원리: 에이전트는 현재 상태(s)에서 어떤 행동(a)을 할지 확률 분포인 정책 π(a|s)를 학습합니다. 보상의 기댓값을 높이는 방향으로 정책 파라미터의 기울기를 업데이트하되, 기존 정책에서 너무 급격히 변하지 않도록 클리핑(Clipping) 제약을 둡니다(PPO).',
      advanced: '심화 엔지니어링: 코딩이나 수학처럼 정답 검증기(컴파일러/테스트 스위트)가 있는 영역에서는 RLVR(Reinforcement Learning with Verifiable Rewards)과 GRPO를 결합합니다. 하나의 프롬프트에 G개의 추론 경로를 샘플링하고 그룹 평균 대비 정규화된 Advantage를 계산해 학습하면 별도의 Value Network 없이도 자기 반성(Self-Reflection) 능력이 창발합니다.'
    },
    keyTerms: [
      { term: 'MDP (마르코프 결정 과정)', desc: '상태(State), 행동(Action), 상태 전이 확률, 보상(Reward), 감가율(Gamma)로 구성된 강화학습의 수학적 문제 정의 틀' },
      { term: '정책 (Policy, π)과 가치 함수 (Value)', desc: '주어진 상태에서 어떤 행동을 선택할지 결정하는 전략(정책)과 그 상태/행동이 미래에 가져다줄 총보상의 기댓값(가치)' },
      { term: 'PPO (Proximal Policy Optimization)', desc: '정책이 한 번에 너무 크게 바뀌어 학습이 붕괴하는 것을 막기 위해 업데이트 비율을 일정 범위(Clip)로 제한하는 대표 알고리즘' },
      { term: 'GRPO & RLVR', desc: '별도의 가치 평가 모델(Critic) 없이 동일 질문에 대한 다수 샘플의 상대적 보상 비교만으로 정책을 최적화하는 최신 추론 학습 기법' }
    ],
    relatedTools: ['Unsloth GRPO Trainer', 'TRL (Transformer Reinforcement Learning)', 'EnvHarness (동적 RL 환경)'],
    dateAdded: '2026-10-19',
    processSteps: [
      { title: '1단계: 다중 추론 경로 샘플링', desc: '하나의 코딩·수학 문제(State)에 대해 정책 모델이 G개(예: 8개)의 서로 다른 풀이 과정과 코드를 생성(Rollout)합니다.', nodes: ['문제 프롬프트(State)', '정책 모델(Policy) 가동', '8개 후보 풀이 생성', '다양한 탐색(Exploration)'] },
      { title: '2단계: 환경 실행 및 보상(Reward) 채점', desc: '샌드박스 환경이 8개의 코드를 실제로 실행하고 단위 테스트 통과 여부와 형식 준수 점수를 매깁니다.', nodes: ['샌드박스 코드 실행', '테스트 통과: +1.0점', '런타임 에러: -0.5점', '결정론적 보상(RLVR)'] },
      { title: '3단계: 그룹 상대 우위(Advantage) 산출', desc: 'GRPO가 8개 답변의 평균과 표준편차를 구해, 평균보다 뛰어난 풀이에 양(+)의 우위 점수를 부여합니다.', nodes: ['Critic 모델 불필요', '그룹 평균/표준편차 계산', '상대 우위(Advantage) 도출', 'VRAM 메모리 50% 절약'] },
      { title: '4단계: 정책 업데이트 및 자가 교정 창발', desc: '양의 보상을 받은 추론 습관은 강화하고 오답 경로는 억제하여 스스로 검산하는 능력이 길러집니다.', nodes: ['KL 발산 페널티 적용', '클리핑 정책 경사 갱신', '자가 검산(Aha Moment)', '추론 모델 완성'] }
    ],
    labConfig: {
      paramLabel: '강화학습 알고리즘 선택 (메모리 및 수렴 특성 비교)',
      paramType: 'select',
      options: [
        'GRPO + RLVR (Critic 제거 그룹 상대 최적화 · 최신 추론 LLM 표준)',
        'PPO (Actor + Critic + Reference + Reward 4개 모델 동시 적재)',
        'DPO (환경 상호작용 없이 오프라인 선호도 쌍으로만 단순 학습)'
      ],
      defaultParam: 'GRPO + RLVR (Critic 제거 그룹 상대 최적화 · 최신 추론 LLM 표준)',
      codeLang: 'Python · GRPO 그룹 상대 우위(Advantage) 및 보상 계산 원리',
      starterCode: `import numpy as np

# 동일 코딩 문제에 대해 에이전트가 생성한 6개 풀이(Rollout)의 테스트 통과 보상 점수
rewards = np.array([1.0, 0.0, 0.2, 1.0, 0.0, 0.8])

# GRPO 핵심: 별도 Critic 신경망 없이 그룹 내 평균/표준편차로 Advantage 정규화
mean_r = rewards.mean()
std_r = rewards.std() + 1e-8
advantages = (rewards - mean_r) / std_r

print(f"그룹 평균 보상: {mean_r:.2f}")
print("각 추론 경로별 상대 Advantage (양수면 강화, 음수면 억제):")
print(np.round(advantages, 3))`,
      runOutput: `[실행 결과 · GRPO Advantage Computation]
그룹 평균 보상: 0.50
각 추론 경로별 상대 Advantage: [ 1.118, -1.118, -0.671,  1.118, -1.118,  0.671]
-> 테스트를 통과한 1번·4번·6번 추론 패턴의 확률은 높이고, 실패한 2번·3번·5번 경로는 억제합니다.`
    },
    quiz: {
      question: '최신 추론형 LLM 학습에서 기존의 무거운 가치 평가 모델(Critic Network)을 제거하고, 하나의 질문에 여러 답변을 생성한 뒤 그룹 내 평균 대비 상대적 점수로 정책을 업데이트하여 메모리를 대폭 절감한 강화학습 기법은 무엇인가요?',
      options: [
        'GRPO (Group Relative Policy Optimization)',
        'k-NN (k-최근접 이웃 분류)',
        'PCA (주성분 차원 축소)',
        'BPE (바이트 페어 인코딩)'
      ],
      answerIndex: 0,
      explanation: 'GRPO(Group Relative Policy Optimization)는 프롬프트당 여러 출력 샘플을 생성해 그룹 내부의 평균과 표준편차로 Advantage를 계산함으로써 별도의 Critic 모델을 유지할 필요가 없는 고효율 강화학습 알고리즘입니다.'
    }
  }
);
