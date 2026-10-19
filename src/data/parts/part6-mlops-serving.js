// ============================================================================
// PART VI · MLOps · 모델 압축(양자화) · 로컬 구동 · 고성능 서빙과 벤치마크 (6.x)
// ============================================================================

window.BOOK_PARTS_DATA = window.BOOK_PARTS_DATA || [];

window.BOOK_PARTS_DATA.push(
  {
    id: 't6',
    chapter: 6,
    sectionCode: '6.1',
    layer: 'L1',
    difficulty: 'elementary',
    roles: ['pm', 'app-be', 'ml-dl', 'mlops-infra'],
    term: '오픈 웨이트 (Open-Weight) 모델과 로컬 생태계',
    analogy: '유명 레스토랑에서 팔던 요리의 비법 원액(가중치 파일)을 대중에게 공개해, 누구나 자기 집 주방(사내 서버·개인 PC)에서 외부 유출 걱정 없이 요리할 수 있게 한 것입니다.',
    definition: '챗GPT나 클로드처럼 제작사의 클라우드 서버에서만 API로 호출할 수 있는 폐쇄형(Closed) 모델과 달리, 학습된 신경망 가중치(Weight) 파일 자체를 Hugging Face 등에 공개한 모델입니다. 인터넷이 차단된 보안 망 내부나 개인의 Mac Studio·RTX PC에 다운로드해 API 요금 없이 무제한으로 구동하고 미세조정할 수 있습니다.',
    deepNote: '실무 포인트: 최근 중국의 AI 기술 수출 통제에서도 오픈소스와 글로벌 API는 예외로 인정받았으며, 메타의 Muse Spark Open과 딥시크 V4.1 Flash 등이 오픈 웨이트 생태계를 주도하고 있습니다.',
    studyGuide: '1단계(입문): 폐쇄형 상용 API(Closed API)와 오픈 웨이트(Open-Weight) 모델의 보안·비용·커스터마이징 차이를 이해합니다. → 2단계(초급): 내 PC에 Ollama 또는 LM Studio를 설치해 오픈 웨이트 모델을 직접 내려받고 오프라인 상태에서 대화해 봅니다. → 3단계(중급~심화): 모델 라이선스(Apache-2.0, MIT, OpenMDW 등)의 상업적 이용 조건을 검토하고 사내 온프레미스 서버에 배포합니다.',
    levels: {
      beginner: '입문 개념: 회사 기밀 문서를 외부 클라우드 AI에 올리기 불안할 때, 똑똑한 AI 모델 파일 자체를 사내 컴퓨터로 통째로 내려받아 인터넷 선을 뽑고도 안전하게 쓰는 방식입니다.',
      intermediate: '중급 원리: 오픈 웨이트 모델은 주로 `.safetensors`(원본 정밀도) 또는 `.gguf`(로컬 압축 포맷) 파일로 Hugging Face에 배포되며, Ollama나 vLLM을 통해 로컬 OpenAI 호환 엔드포인트(`localhost:11434/v1`)로 띄울 수 있습니다.',
      advanced: '심화 엔지니어링: 엔터프라이즈 환경에서는 일상적인 사내 문서 요약·코드 보조·민감 데이터 전처리는 온프레미스 오픈 웨이트 모델로 처리하고, 비식별화된 초고난도 추론만 프론티어 모델과 결합하는 하이브리드 라우팅을 구축합니다.'
    },
    keyTerms: [
      { term: '오픈 웨이트 (Open-Weight) vs 오픈소스 AI', desc: '훈련된 가중치 파일을 공개해 로컬 실행과 파인튜닝이 가능한 모델(Open-Weight)과 학습 데이터셋·훈련 코드까지 모두 공개한 모델(Full Open-Source)' },
      { term: 'Safetensors 포맷', desc: '기존 파이썬 Pickle 파일의 악성코드 실행 보안 취약점을 없애고 텐서 가중치를 안전하고 빠르게 로드(Zero-copy)하는 표준 파일 포맷' },
      { term: '온프레미스 / 에어갭 (Air-Gapped) 구동', desc: '외부 인터넷망과 물리적·논리적으로 완전히 분리된 폐쇄망 사내 서버에서 AI 모델을 독립적으로 운영하는 방식' }
    ],
    relatedTools: ['Meta Muse Spark Open', 'DeepSeek-V4.1-Flash-1017', 'NVIDIA Nemotron 3.5 Super VL / Bolt', 'Ollama'],
    dateAdded: '2026-10-16',
    processSteps: [
      { title: '가중치 공개 (Hugging Face)', desc: 'AI 연구소가 학습을 마친 모델 가중치(.safetensors / .gguf)를 오픈 라이선스로 배포합니다.', nodes: ['연구실 학습 완료', 'OpenMDW / MIT 라이선스', 'Hugging Face 업로드', '누구나 다운로드 가능'] },
      { title: '로컬/사내 서버 다운로드', desc: '기업이나 개인 개발자가 자신의 하드웨어(GPU 서버 또는 Mac)로 모델 파일을 내려받습니다.', nodes: ['모델 파일 다운로드', '외부 인터넷 차단 가능', '사내 방화벽 내부 배치', '데이터 외부 유출 0%'] },
      { title: '로컬 추론 엔진 구동', desc: 'Ollama, LM Studio, 또는 vLLM 엔진으로 모델을 메모리에 올려 자체 API 서버를 엽니다.', nodes: ['Ollama / vLLM 실행', 'localhost:11434 오픈', '토큰 과금 $0 (무료)', '무제한 호출 가능'] },
      { title: '사내 업무 및 에이전트 연동', desc: '기밀 문서 요약, 사내 코드 리뷰, 자율 에이전트(Hermes, Aider)의 두뇌로 안전하게 활용합니다.', nodes: ['사내 기밀 문서 요약', '보안 코드베이스 분석', '24시간 상시 가동', '완전한 AI 주권 확보'] }
    ],
    labConfig: {
      paramLabel: '로컬 구동 대상 모델 선택',
      paramType: 'select',
      options: ['deepseek-v4.1-flash:1017', 'nemotron-3.5-bolt:74b-q2', 'muse-spark-open:816b-q2'],
      defaultParam: 'nemotron-3.5-bolt:74b-q2',
      codeLang: 'Bash · Ollama를 이용한 오픈 웨이트 모델 로컬 실행',
      starterCode: `# 1. 로컬 PC에 오픈 웨이트 모델 다운로드 및 즉시 실행
ollama pull nemotron-3.5-bolt:74b-q2

# 2. 로컬 API 서버에 질문 전송 (인터넷 연결 불필요, 비용 $0)
curl http://localhost:11434/api/generate -d '{
  "model": "nemotron-3.5-bolt:74b-q2",
  "prompt": "사내 보안 로그에서 비정상 접근 패턴을 찾는 파이썬 정규식을 작성해줘."
}'`,
      runOutput: `[실행 결과 · Local Inference via Ollama]
Pulling manifest... 100% (22.8 GB loaded into VRAM)
Model running locally on GPU0 (24GB VRAM).
Response:
보안 로그 내 비정상 IP 및 연속 로그인 실패(401/403)를 탐지하는 정규식 코드입니다...
[처리 속도: 48.5 tokens/sec | 외부 네트워크 전송: 0 Bytes | API 비용: $0.00]`
    },
    quiz: {
      question: '오픈 웨이트(Open-Weight) 모델을 기업 사내 서버에 도입했을 때 얻을 수 있는 가장 대표적인 이점은 무엇인가요?',
      options: [
        '외부 클라우드로 사내 기밀 데이터가 전송되지 않아 보안성이 뛰어나며, 토큰당 API 종량제 요금 없이 자체 하드웨어에서 구동 및 미세조정이 가능하다.',
        '그래픽카드나 메모리가 전혀 없는 구형 전자계산기에서도 1T 모델이 초고속으로 작동한다.',
        '전기 요금이 0원이 된다.',
        '모델 다운로드 용량이 항상 1KB 미만이다.'
      ],
      answerIndex: 0,
      explanation: '오픈 웨이트 모델은 가중치 파일을 사내 폐쇄망 서버나 로컬 워크스테이션에 직접 내려받아 구동하므로 데이터 유출 위험을 원천 차단하고 LoRA 미세조정 등 완전한 통제권을 확보할 수 있습니다.'
    }
  },
  {
    id: 't7',
    chapter: 6,
    sectionCode: '6.2',
    layer: 'L2',
    difficulty: 'intermediate',
    roles: ['app-be', 'ml-dl', 'mlops-infra'],
    term: '양자화 (Quantization: GGUF · NVFP4 · Dynamic 2-bit)',
    analogy: '초고화질 무압축 원본 사진(RAW)을 육안으로 구분하기 힘든 고효율 포맷으로 압축해 용량을 4분의 1 이하로 줄이는 다이어트 기술입니다.',
    definition: '모델의 각 파라미터가 차지하는 소수점 자리수(정밀도)를 16비트(BF16)에서 4비트(NVFP4) 또는 2비트로 줄여 메모리 사용량을 대폭 낮추고 연산 속도를 높이는 기술입니다. GGUF는 CPU와 애플 실리콘(Mac 통합 메모리)에서 모델을 돌릴 때 쓰는 표준 포맷이며, Unsloth의 Dynamic 2-bit는 지능에 민감한 핵심 레이어는 고비트로 유지하고 나머지 레이어만 2비트로 압축해 정확도 손실을 최소화합니다.',
    deepNote: '실무 포인트: 최근 화제가 된 "메타 Muse Spark Open 816B 모델을 Mac Studio 2대로 로컬에서 돌리는 방법"의 핵심 비결이 바로 Dynamic 2-bit GGUF 양자화입니다.',
    studyGuide: '1단계(입문): 왜 16비트(BF16) 소수점을 4비트나 2비트로 줄여도 AI 지능이 크게 떨어지지 않는지 직관적으로 이해합니다. → 2단계(초급): 로컬 Mac/PC용 포맷인 GGUF(Q4_K_M, IQ2_XXS 등)와 엔비디아 서버용 포맷인 FP8/NVFP4/AWQ의 용도를 구분합니다. → 3단계(중급~심화): 레이어별 민감도를 분석해 혼합 정밀도로 압축하는 Dynamic Quantization과 보정 데이터셋(Importance Matrix) 기법을 실습합니다.',
    levels: {
      beginner: '입문 개념: 원주율 3.14159265...를 3.14로 줄여 적어 공책 공간을 아끼는 것과 같습니다. 아주 중요한 공식(핵심 뇌 회로)만 자세히 적고 나머지는 짧게 줄여 거대 AI를 내 컴퓨터에 쏙 들어오게 만듭니다.',
      intermediate: '중급 원리: 균일 양자화(Uniform Quantization)는 모든 층을 똑같이 2비트로 줄여 지능이 급락하지만, Dynamic 양자화는 Attention/Router 및 입출력 임베딩 층은 4~8비트로 보존하고 둔감한 대형 MoE 전문가 층만 1.5~2비트로 압축합니다.',
      advanced: '심화 엔지니어링: NVIDIA Blackwell 아키텍처부터 하드웨어 텐서 코어가 네이티브 4비트 부동소수점(NVFP4) 연산을 직접 가속하므로, 메모리 절감뿐만 아니라 실제 행렬 연산 TFLOPS 처리량이 FP16 대비 2~4배 향상됩니다.'
    },
    keyTerms: [
      { term: 'GGUF 포맷', desc: 'llama.cpp 창시자 게오르기 게르가노프가 설계한 단일 파일 모델 포맷으로, 메타데이터와 양자화 가중치를 함께 담아 CPU/Mac/GPU에서 즉시 실행 가능' },
      { term: '동적 양자화 (Dynamic Quantization)', desc: '신경망 각 레이어의 양자화 오차 민감도를 측정하여 중요 레이어는 고비트, 일반 레이어는 초저비트(2-bit)로 차등 배분하는 기법' },
      { term: 'NVFP4 / AWQ', desc: '엔비디아 최신 GPU 가속에 최적화된 4비트 부동소수점(NVFP4) 및 활성화 값 분포를 고려해 중요 가중치를 보호하는 양자화(AWQ)' }
    ],
    relatedTools: ['Unsloth (Dynamic GGUF)', 'llama.cpp', 'LM Studio', 'NVIDIA NVFP4'],
    dateAdded: '2026-10-16',
    processSteps: [
      { title: '원본 가중치 (BF16 / 16-bit)', desc: '파라미터 1개당 16비트를 차지합니다. 816B 모델 기준 약 1,632GB의 막대한 메모리가 필요합니다.', nodes: ['정밀도: 16-bit 부동소수점', '816B 용량: ~1,632 GB', '데이터센터 클러스터 필수', '일반 PC 구동 불가'] },
      { title: '중요도 분석 (Sensitivity Calibration)', desc: '신경망의 각 층(Layer)별로 압축했을 때 지능이 떨어지는 민감도를 정밀 측정합니다.', nodes: ['어텐션/라우터 층: 민감', '일반 전문가 층: 둔감', '레이어별 비트 배분 계획', 'Dynamic 양자화 설계'] },
      { title: '비트 압축 (4-bit / Dynamic 2-bit)', desc: '핵심 층은 4~6비트를 유지하고 대규모 전문가 층은 2~4비트로 압축해 GGUF 또는 NVFP4 파일을 생성합니다.', nodes: ['핵심 레이어 보존', '나머지 2~4비트 정수화', '용량 75~85% 절감', 'GGUF 단일/분할 파일 생성'] },
      { title: '로컬 워크스테이션 구동', desc: '약 230~280GB 수준으로 줄어든 816B 모델을 Mac Studio 2대 또는 소규모 GPU 서버에 올려 실행합니다.', nodes: ['압축 용량: ~245 GB', 'Mac Studio 통합메모리 적재', '원본 대비 지능 98% 유지', '로컬 추론 성공'] }
    ],
    labConfig: {
      paramLabel: '양자화 포맷 선택 (Muse Spark Open 816B 메모리 변화 실험)',
      paramType: 'select',
      options: ['BF16 원본 (16-bit 무압축)', 'NVFP4 / Q4_K_M (4-bit 표준 양자화)', 'Unsloth Dynamic 2-bit GGUF (초고압축)'],
      defaultParam: 'Unsloth Dynamic 2-bit GGUF (초고압축)',
      codeLang: 'Bash · llama.cpp로 양자화된 GGUF 모델 실행하기',
      starterCode: `# Unsloth Dynamic 2-bit 양자화 체크포인트를 llama-cli로 실행
./llama-cli \\
  --model Muse-Spark-Open-816B-A42B-UD-Q2_K_XL.gguf \\
  --ctx-size 32768 \\
  --threads 16 \\
  --prompt "양자화 이후에도 다단계 코딩 추론이 정상 작동하는지 검증해줘."`,
      runOutput: `[실행 결과 · Quantization Benchmark]
- BF16 원본 (16-bit): 1,632 GB 필요 (H100 80GB x 22장 필요)
- Q4_K_M (4-bit): 465 GB 필요
- Unsloth Dynamic 2-bit: 242 GB 필요 -> Mac Studio (192GB x 2대) 클러스터 적재 성공!
- 토큰 생성 속도: 28.4 tokens/sec (활성 파라미터가 42B뿐이므로 816B임에도 빠른 속도 유지)`
    },
    quiz: {
      question: 'Unsloth의 Dynamic 2-bit GGUF 양자화가 816B 초대형 모델의 용량을 약 85% 줄이면서도 지능 저하를 최소화할 수 있는 핵심 비결은 무엇인가요?',
      options: [
        '지능에 민감한 어텐션·라우터 레이어는 4~6비트로 보존하고, 상대적으로 둔감한 대규모 전문가 레이어만 2비트로 차등 압축하기 때문',
        '모델의 절반을 무작위로 삭제해 버리기 때문',
        '짝수 번째 단어만 기억하도록 강제하기 때문',
        '압축 파일에 암호를 걸어두기 때문'
      ],
      answerIndex: 0,
      explanation: '모든 레이어를 획일적으로 2비트로 깎으면 모델이 붕괴하지만, 레이어별 민감도(Importance Matrix)를 분석해 핵심 레이어는 높은 정밀도를 유지하는 동적(Dynamic) 혼합 양자화를 쓰면 지능을 보존할 수 있습니다.'
    }
  },
  {
    id: 't8',
    chapter: 6,
    sectionCode: '6.3',
    layer: 'L5',
    difficulty: 'elementary',
    roles: ['pm', 'designer-fe', 'app-be'],
    term: '오프라인 음성 전사 (Buzz)와 종단간 음성 모델 (Speech-to-Speech)',
    analogy: '오프라인 전사(Buzz)는 내 컴퓨터 안에서만 일하는 보안 속기사이고, 종단간 음성 모델은 글자로 받아적는 과정 없이 목소리를 듣고 즉시 목소리로 답하는 동시통역사입니다.',
    definition: '음성 AI는 크게 두 갈래로 발전하고 있습니다. 첫째는 OpenAI의 Whisper 모델을 내 PC에서 인터넷 없이 구동해 회의록과 영상 자막을 만드는 오프라인 STT 도구(대표 툴: Buzz)입니다. 둘째는 음성을 텍스트로 바꾼 뒤 LLM을 거치고 다시 음성으로 읽는 기존 3단계를 하나로 합쳐, 오디오 파형을 직접 이해하고 0.8초 만에 음성으로 응답하는 종단간(End-to-End Speech-to-Speech) 모델(대표 모델: Grok Voice 3.0)입니다.',
    deepNote: '실무 포인트: 보안이 중요한 사내 회의나 인터뷰 녹취는 로컬 오픈소스 툴인 Buzz로 처리하고, 실시간 고객 상담 콜센터 에이전트는 지연 시간이 짧은 Speech-to-Speech API로 구축하는 것이 정석입니다.',
    studyGuide: '1단계(입문): STT(음성→텍스트), TTS(텍스트→음성), S2S(음성→음성 직결)의 차이를 이해합니다. → 2단계(초급): PC에 Buzz(Whisper.cpp 기반)를 설치해 회의 녹음 파일에서 SRT 타임스탬프 자막을 추출해 봅니다. → 3단계(중급~심화): WebSocket 실시간 오디오 스트리밍과 VAD(음성 활동 감지, 말 끊기 인터럽트 처리)를 구현합니다.',
    levels: {
      beginner: '입문 개념: 사내 회의 녹음을 외부 유료 사이트에 올리지 않고 내 컴퓨터에서 무료로 받아적으려면 Buzz를 쓰고, 사람처럼 숨소리나 억양까지 느끼며 1초 만에 대답하는 전화 상담원을 만들려면 종단간 음성 모델을 씁니다.',
      intermediate: '중급 원리: 기존 파이프라인(STT → LLM → TTS)은 3개 모델을 거치며 지연 시간(2~4초)이 누적되고 감정·억양 정보가 글자로 바뀌며 유실됩니다. 네이티브 S2S 모델은 오디오 코덱 토큰을 직접 입출력합니다.',
      advanced: '심화 엔지니어링: 실시간 음성 에이전트에서는 사용자가 AI의 말을 중간에 끊고 들어오는 바지인(Barge-in) 상황을 처리하기 위해 클라이언트 측 VAD(Voice Activity Detection)와 양방향 WebSocket 세션 제어가 필수입니다.'
    },
    keyTerms: [
      { term: 'STT (Speech-to-Text) & Whisper.cpp', desc: '오디오 음성을 텍스트와 타임스탬프로 전사(Transcription)하는 기술 및 이를 C/C++로 경량화한 로컬 엔진' },
      { term: '종단간 음성 모델 (Speech-to-Speech)', desc: '중간 텍스트 변환 없이 오디오 토큰을 신경망이 직접 입력받고 오디오 토큰으로 즉시 출력하는 초저지연 모델' },
      { term: 'VAD (음성 활동 감지)와 Barge-in', desc: '배경 소음 속에서 실제 사람의 발화 시작·종료를 감지하는 기술(VAD)과 AI 발화 중 사용자가 끼어들 때 즉시 멈추는 기능(Barge-in)' }
    ],
    relatedTools: ['Buzz (오프라인 Whisper 전사)', 'xAI Grok Voice 3.0 (0.81초 응답)', 'Whisper.cpp'],
    dateAdded: '2026-10-16',
    processSteps: [
      { title: '음성 오디오 입력', desc: '사내 회의 녹음 파일(.mp3/.wav) 또는 실시간 고객의 음성 스트림이 입력됩니다.', nodes: ['음성 파형 입력', '배경 소음 필터링', '오프라인 vs 실시간 분기', '오디오 청크 분할'] },
      { title: '경로 A: Buzz 오프라인 전사', desc: '내 PC의 Whisper.cpp 엔진이 클라우드 전송 없이 음성을 정확한 텍스트와 타임스탬프 자막(.srt)으로 변환합니다.', nodes: ['로컬 Whisper.cpp 가동', '클라우드 전송 0%', '발화 구간 타임스탬프', 'SRT / TXT 회의록 완성'] },
      { title: '경로 B: Grok Voice 3.0 실시간 대화', desc: '중간 텍스트 변환 없이 오디오 토큰을 신경망이 직접 처리하여 첫 오디오 응답까지 0.81초 만에 반응합니다.', nodes: ['종단간 오디오 신경망', '억양·감정 뉘앙스 보존', '대기 시간 0.81초', '콜센터 해결률 71.6%'] },
      { title: '최종 결과물 활용', desc: '생성된 전사본을 로컬 LLM으로 요약하거나 실시간 음성 에이전트 상담을 완수합니다.', nodes: ['보안 회의록 보관', '다국어 번역 자막 생성', '실시간 고객 응대 완료', '후속 업무 자동 등록'] }
    ],
    labConfig: {
      paramLabel: '음성 작업 모드 선택',
      paramType: 'select',
      options: ['Buzz 로컬 오프라인 회의록 전사 & 자막(SRT) 생성', 'Grok Voice 3.0 실시간 저지연 음성 에이전트 연결'],
      defaultParam: 'Buzz 로컬 오프라인 회의록 전사 & 자막(SRT) 생성',
      codeLang: 'Bash · Buzz 설치 및 CLI 오프라인 음성 전사 실행',
      starterCode: `# 1. PC에 Buzz 설치 (Windows: winget / macOS: brew)
brew install --cask buzz

# 2. 사내 보안 회의 녹음 파일을 오프라인에서 한국어 텍스트 및 SRT 자막으로 변환
buzz add --task transcribe --language ko --model-type whispercpp \\
  --model-size large-v3 --srt --txt "./board_meeting_202610.mp3"`,
      runOutput: `[실행 결과 · Buzz Offline Transcription]
Backend: Whisper.cpp (Apple Metal / Local GPU Accelerated)
Network Status: Offline (외부 서버 전송 없음)
Processing: board_meeting_202610.mp3 (42분 15초 분량 -> 1분 18초 만에 변환 완료)
생성 파일:
- board_meeting_202610.txt (전체 텍스트 녹취록)
- board_meeting_202610.srt (타임스탬프 자막 파일)`
    },
    quiz: {
      question: '음성을 텍스트로 바꾸고(STT), LLM이 텍스트로 생각한 뒤, 다시 음성으로 읽는(TTS) 기존 3단계 방식 대신, 오디오 파형 토큰을 신경망이 직접 이해하고 즉시 음성으로 출력하여 응답 지연 시간을 0.8초대로 줄인 모델 방식은 무엇인가요?',
      options: [
        '종단간 음성 모델 (End-to-End Speech-to-Speech)',
        '정적 이미지 크롭 (Static Image Crop)',
        '단순 CSV 파서 (CSV Parser)',
        '오프라인 프린터 스풀러 (Printer Spooler)'
      ],
      answerIndex: 0,
      explanation: '종단간(End-to-End) Speech-to-Speech 모델은 중간 텍스트 변환 단계를 거치지 않고 오디오 토큰을 직접 입출력하므로 응답 속도가 빠르고 화자의 감정·억양 뉘앙스를 그대로 유지합니다.'
    }
  },
  {
    id: 't13',
    chapter: 6,
    sectionCode: '6.4',
    layer: 'L2',
    difficulty: 'advanced',
    roles: ['app-be', 'ml-dl', 'mlops-infra'],
    term: '네오클라우드 (Neocloud) · 플루이드 컴퓨팅 · vLLM 서빙',
    analogy: '만물상 백화점(범용 클라우드) 대신 AI 조리용 초고화력 화구만 전문으로 임대해 주는 공유 주방(네오클라우드)과, 손님이 몰릴 때 화구를 빈틈없이 배분하는 주방 시스템(vLLM)입니다.',
    definition: 'AWS나 애저 같은 범용 클라우드와 달리 AI 학습·추론용 대규모 GPU 클러스터 제공에 특화된 클라우드 사업자(베슬AI, 코어위브 등)를 네오클라우드라 합니다. 여러 데이터센터의 GPU를 소프트웨어로 묶어 워크로드에 맞게 자동 배치하는 플루이드 컴퓨팅과, GPU 메모리 단편화를 없애는 vLLM(PagedAttention) 서빙 엔진이 결합되어 추론 인프라 효율을 극대화합니다.',
    deepNote: '실무 포인트: 아무리 좋은 오픈 모델을 가져와도 기본 파이썬 코드로 띄우면 동시 접속자가 5명만 되어도 멈춥니다. 실무 배포에서는 반드시 vLLM이나 SGLang 서빙 엔진을 사용해야 합니다.',
    studyGuide: '1단계(입문): 왜 기본 HuggingFace `model.generate()`는 여러 사용자의 동시 요청을 처리할 때 GPU 메모리가 금방 차버리고 느려지는지 이해합니다. → 2단계(초급): 운영체제의 가상 메모리 페이징에서 영감을 얻은 PagedAttention과 Continuous Batching 개념을 익힙니다. → 3단계(중급~심화): vLLM으로 FP4/AWQ 양자화 모델을 띄우고 OpenAI 호환 API로 멀티 에이전트 부하를 처리합니다.',
    levels: {
      beginner: '입문 개념: 식당에 손님 50명이 동시에 왔을 때 한 테이블 요리가 다 끝날 때까지 다른 손님이 마냥 기다리게 하지 않고, 빈자리에 바로바로 손님을 앉히고 화구를 100% 알차게 쓰는 고성능 서빙 엔진이 vLLM입니다.',
      intermediate: '중급 원리: 기존 서빙은 각 요청의 최대 길이만큼 연속된 GPU 메모리(KV Cache)를 미리 잡아두어 60% 이상이 빈 공간으로 낭비되었습니다. vLLM의 PagedAttention은 KV 캐시를 작은 블록 단위로 쪼개어 필요한 만큼만 동적 할당합니다.',
      advanced: '심화 엔지니어링: Continuous Batching(토큰 단위 동적 배칭), Prefix Caching(공통 시스템 프롬프트 KV 캐시 재사용), Speculative Decoding(소형 초안 모델로 다중 토큰 동시 검증)을 결합해 처리량을 10배 이상 높입니다.'
    },
    keyTerms: [
      { term: 'PagedAttention', desc: 'KV 캐시 메모리를 고정 크기의 작은 페이지 블록으로 나누어 비연속적인 GPU 메모리 공간에 빈틈없이 할당하는 vLLM의 핵심 기술' },
      { term: 'Continuous Batching (연속 배칭)', desc: '먼저 답변이 끝난 요청의 자리에 대기 중인 새 요청을 매 토큰 생성 단계마다 즉시 끼워 넣어 GPU 유휴 시간을 없애는 기법' },
      { term: '네오클라우드 & 플루이드 컴퓨팅', desc: 'AI GPU 인프라에 특화된 전문 클라우드(Neocloud)와 다중 데이터센터의 파편화된 GPU를 단일 풀처럼 동적 오케스트레이션하는 기술' }
    ],
    relatedTools: ['vLLM (PagedAttention)', '베슬AI (플루이드 컴퓨팅)', 'VKORE (NPU 가속 스택)'],
    dateAdded: '2026-10-16',
    processSteps: [
      { title: '분산 GPU 풀 통합 (Fluid Computing)', desc: '여러 지역 데이터센터에 흩어진 GPU 자원을 하나의 가상 클러스터로 묶어 대기 중인 워크로드에 즉시 할당합니다.', nodes: ['데이터센터 A·B·C 연결', '유휴 GPU 자동 탐지', '워크로드 맞춤 할당', '인프라 가동률 극대화'] },
      { title: 'vLLM 서빙 엔진 적재', desc: '할당된 GPU에 오픈 웨이트 모델(예: Nemotron 120B NVFP4)을 vLLM 엔진으로 로드합니다.', nodes: ['NVFP4 체크포인트 로드', '텐서 병렬화 구성', 'OpenAI 호환 API 생성', '서빙 준비 완료'] },
      { title: 'PagedAttention 메모리 관리', desc: '동시에 들어오는 수백 명의 대화 맥락(KV 캐시)을 운영체제 가상 메모리처럼 페이지 단위로 쪼개어 빈틈없이 채웁니다.', nodes: ['메모리 단편화 0% 근접', '배치 크기(Batch) 극대화', 'GPU 메모리 낭비 제거', '초당 수백 토큰 처리'] },
      { title: '안정적인 대규모 추론 서비스', desc: '트래픽이 급증해도 지연 시간 상승 없이 수배 높은 처리량(Throughput)으로 응답을 제공합니다.', nodes: ['동시 접속 수백 건 처리', '단일 GPU 처리량 5배 향상', '자동 스케일 아웃', '안정적 SLA 달성'] }
    ],
    labConfig: {
      paramLabel: '추론 서빙 방식 선택 (동시 요청 64건 처리량 비교)',
      paramType: 'select',
      options: ['vLLM (PagedAttention + Continuous Batching 적용)', '기본 HuggingFace Transformers 파이프라인 (순차 처리)'],
      defaultParam: 'vLLM (PagedAttention + Continuous Batching 적용)',
      codeLang: 'Bash · vLLM으로 고성능 OpenAI 호환 API 서버 띄우기',
      starterCode: `# vLLM을 사용해 120B MoE 모델을 로컬/사내 서버 8000번 포트로 서빙
vllm serve nvidia/NVIDIA-Nemotron-3.5-Super-VL-120B-A12B-BF16 \\
  --quantization fp4 \\
  --max-model-len 131072 \\
  --gpu-memory-utilization 0.92 \\
  --port 8000`,
      runOutput: `[실행 결과 · vLLM Server Metrics]
INFO: Started vLLM API server on http://0.0.0.0:8000/v1
INFO: KV Cache memory allocated: 92.0% via PagedAttention (낭비 메모리 < 3%)
동시 요청 64건 처리 벤치마크:
- 기본 파이프라인: 38 tokens/sec (OOM 메모리 부족 경고 발생)
- vLLM 서빙 엔진: 612 tokens/sec (약 16배 처리량 달성, 안정적 응답)`
    },
    quiz: {
      question: 'vLLM 서빙 엔진에서 운영체제의 가상 메모리 페이징 기법을 응용하여, 동시 접속자들의 대화 맥락(KV Cache) 메모리 단편화와 낭비를 거의 0%로 줄여 처리량을 극대화한 핵심 알고리즘은 무엇인가요?',
      options: [
        'PagedAttention (페이지드 어텐션)',
        'Bubble Sort (버블 정렬)',
        'Linear Regression (선형 회귀)',
        'JPEG Compression (이미지 압축)'
      ],
      answerIndex: 0,
      explanation: 'PagedAttention은 KV 캐시를 비연속적인 작은 블록(페이지) 단위로 관리하여 GPU 메모리 단편화를 제거하고 동시 배치 크기(Batch Size)와 처리량(Throughput)을 수배~수십 배 높여줍니다.'
    }
  },
  {
    id: 't5',
    chapter: 6,
    sectionCode: '6.5',
    layer: 'L5',
    difficulty: 'elementary',
    roles: ['pm', 'app-be', 'ml-dl', 'mlops-infra'],
    term: '핵심 평가 벤치마크 (SWE-bench Verified & GPQA-Diamond)',
    analogy: 'AI 모델들이 치르는 두 가지 대표 국가고시로, SWE-bench는 실무 소프트웨어 개발자 실기 시험이고 GPQA는 박사급 과학 경시대회입니다.',
    definition: 'SWE-bench Verified는 실제 오픈소스 GitHub 저장소에 등록된 이슈를 AI에게 주고 스스로 원인을 찾아 코드를 수정한 뒤 테스트를 통과하는지 채점하는 실무 코딩 지표입니다. GPQA-Diamond는 물리학·화학·생물학 박사 전문가들도 인터넷 검색 없이는 65% 내외만 맞히는 초고난도 과학 추론 벤치마크입니다.',
    deepNote: '실무 포인트: 새로운 AI 모델 출시 뉴스가 나올 때 홍보 문구보다 SWE-bench Verified(실무 코딩력)와 GPQA-Diamond(심층 논리력) 점수를 확인하면 실제 업무 투입 가치를 객관적으로 판단할 수 있습니다.',
    studyGuide: '1단계(입문): SWE-bench Verified(실전 소프트웨어 디버깅)와 GPQA-Diamond(박사급 과학 추론)가 무엇을 측정하는 시험인지 이해합니다. → 2단계(초급): 단순 암기형 시험(MMLU)이 왜 포화되었고 실제 실행 검증(Execution-based Evaluation)이 왜 중요한지 파악합니다. → 3단계(중급~심화): 우리 회사 도메인만의 골든 평가셋(Internal Eval Suite)을 구축해 모델 교체 시 성적을 자동 비교합니다.',
    levels: {
      beginner: '입문 개념: 새로운 AI가 나왔을 때 "역대 최고 지능!"이라는 광고 말만 믿지 말고, 실제 개발자처럼 버그를 고치는 시험 점수(SWE-bench)와 박사급 논리 시험 점수(GPQA) 두 가지를 보면 진짜 실력을 알 수 있습니다.',
      intermediate: '중급 원리: SWE-bench Verified는 인간 엔지니어가 검증한 500개의 실제 파이썬 오픈소스(Django, Scikit-learn 등) GitHub 이슈로 구성되며, 모델이 생성한 Git Patch를 도커 컨테이너에 적용해 단위 테스트(`pytest`)가 100% 통과해야 정답 처리됩니다.',
      advanced: '심화 엔지니어링: SWE-bench 점수는 순수 모델 지능뿐만 아니라 어떤 에이전트 스캐폴드/하네스(예: Mini-SWE-Agent, OpenHands)로 평가했는지에 따라 달라지므로, 모델 비교 시 동일 하네스 조건인지와 토큰 비용(Cost per Resolved Issue)을 함께 봐야 합니다.'
    },
    keyTerms: [
      { term: 'SWE-bench Verified', desc: '실제 GitHub 오픈소스 저장소의 버그/이슈 500개를 에이전트가 자율 탐색·패치하여 실제 단위 테스트를 통과하는 비율을 측정하는 벤치마크' },
      { term: 'GPQA-Diamond', desc: 'Google-Proof Q&A의 최고난도 부분집합으로, 검색으로도 답이 바로 나오지 않는 박사급 물리·화학·생물 심층 추론 벤치마크' },
      { term: 'Pass@1 vs Pass@k', desc: '단 한 번의 시도로 정답을 맞힐 확률(Pass@1)과 k번 시도했을 때 최소 한 번이라도 정답이 나올 확률(Pass@k)' }
    ],
    relatedTools: ['GPT-6 Astra (물리 문제 98%)', 'Nemotron 3.5 Super VL (GPQA 89.9 / SWE 71.1)', 'Dory 1.0-4B (SWE 61.8)'],
    dateAdded: '2026-10-17',
    processSteps: [
      { title: '실제 GitHub 버그 이슈 제시', desc: '수만 줄짜리 실제 오픈소스 프로젝트 코드와 함께 에러 리포트가 AI에게 주어집니다.', nodes: ['이슈 리포트 입력', '전체 저장소 코드 마운트', '사전 힌트 없음', '샌드박스 컨테이너 시작'] },
      { title: '자율 코드 탐색 및 원인 파악', desc: '에이전트가 스스로 디렉터리를 검색하고 버그가 발생한 파일과 함수를 찾아냅니다.', nodes: ['grep / 파일 탐색', '의존성 함수 추적', '버그 발생 지점 특정', '수정 가설 수립'] },
      { title: '코드 패치(Diff) 작성', desc: '기존 기능을 망가뜨리지 않도록 정확한 코드 수정본(Git Patch)을 작성해 적용합니다.', nodes: ['코드 수정안 작성', 'git apply 패치 적용', '구문 오류 점검', '단위 테스트 준비'] },
      { title: '자동 채점 테스트 통과 검증', desc: '실제 테스트 스위트(Unit Tests)를 실행해 모든 테스트가 통과해야만 정답(Resolved)으로 인정됩니다.', nodes: ['pytest 자동 실행', '기존 기능 회귀 검증', '버그 재현 테스트 통과', 'SWE-bench 점수 부여'] }
    ],
    labConfig: {
      paramLabel: '벤치마크 종류 선택 (모델별 성적표 비교)',
      paramType: 'select',
      options: ['SWE-bench Verified (실전 소프트웨어 엔지니어링)', 'GPQA-Diamond (박사급 고난도 과학 추론)'],
      defaultParam: 'SWE-bench Verified (실전 소프트웨어 엔지니어링)',
      codeLang: 'Bash · SWE-bench 평가 하네스 실행 명령어',
      starterCode: `# Mini-SWE-V2 하네스를 이용해 모델의 실제 GitHub 이슈 해결력 측정
python3 -m swebench.harness.run_evaluation \\
  --dataset_name princeton-nlp/SWE-bench_Verified \\
  --model_name_or_path deepseek-ai/DeepSeek-V4.1-Flash-1017 \\
  --max_workers 8`,
      runOutput: `[실행 결과 · Benchmark Evaluation Summary]
대상 데이터셋: SWE-bench_Verified (500 real-world GitHub issues)
- Nemotron 3.5 Super VL (120B-A12B): 71.07% Resolved
- Dory 1.0-4B (4 Loops 설정 시): 61.80% Resolved
- 인간 시니어 개발자(제한 시간 내): 약 75~80% 수준`
    },
    quiz: {
      question: '실제 오픈소스 GitHub 저장소의 이슈와 전체 코드베이스를 AI에게 주고, 스스로 원인을 찾아 패치(Diff)를 작성한 뒤 실제 단위 테스트(Unit Test) 통과 여부로 실무 코딩 능력을 채점하는 대표 벤치마크는 무엇인가요?',
      options: [
        'SWE-bench Verified',
        'ImageNet 2012',
        'MNIST 손글씨 숫자 분류',
        '타자 속도 측정기 (WPM Test)'
      ],
      answerIndex: 0,
      explanation: 'SWE-bench Verified는 단편적인 함수 작성이 아니라 실제 대규모 오픈소스 저장소에서 이슈 원인을 탐색하고 패치를 만들어 테스트 스위트를 통과하는 종단간 소프트웨어 엔지니어링 역량을 평가합니다.'
    }
  }
);
