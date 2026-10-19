// ============================================================================
// PART V · 자율 에이전트 공학 · 프로토콜(MCP/A2A) · 자기 개선 (5.x)
// ============================================================================

window.BOOK_PARTS_DATA = window.BOOK_PARTS_DATA || [];

window.BOOK_PARTS_DATA.push(
  {
    id: 't14',
    chapter: 5,
    sectionCode: '5.1',
    layer: 'L4',
    difficulty: 'intermediate',
    roles: ['pm', 'designer-fe', 'app-be'],
    term: '에이전틱 하네스 (Agentic Harness: Hermes Agent)',
    analogy: '천재적인 두뇌(LLM)만 덩그러니 놓아두는 대신, 장기 기억 수첩·인터넷 브라우저·터미널 키보드·알람 시계가 완비된 작업실과 손발을 붙여준 자율 실행 체제입니다.',
    definition: 'LLM 단품은 대화가 끝나면 기억이 사라지고 스스로 파일 수정이나 프로그램 실행을 할 수 없습니다. 에이전틱 하네스는 모델 바깥을 감싸며 영구 메모리(Persistent Memory), 40여 개 도구 게이트웨이(Tool Gateway), 격리된 샌드박스 코드 실행기, 오류 발생 시 스스로 고쳐 다시 시도하는 루프를 제공하는 상시 가동형 프레임워크입니다.',
    deepNote: '실무 포인트: Nous Research의 Hermes Agent는 특정 코딩 프로그램(IDE)에 갇혀 있지 않고 개인 서버에서 24시간 살아 움직이며, 작업을 수행할수록 스스로 새로운 스킬 문서를 작성해 점점 더 유능해집니다.',
    studyGuide: '1단계(입문): 챗봇(질문하면 답만 하는 두뇌)과 자율 에이전트(두뇌 + 하네스 손발·기억)의 차이를 구분합니다. → 2단계(초급): 에이전트의 기본 루프인 ReAct(생각 Thought → 행동 Action → 관찰 Observation)를 이해합니다. → 3단계(중급~심화): Hermes Agent나 자체 하네스에 영구 메모리와 스킬 자동 축적 루프를 구축합니다.',
    levels: {
      beginner: '입문 개념: 챗GPT 창을 닫으면 대화가 끝나지만, 에이전틱 하네스는 내 컴퓨터나 서버에서 퇴근하지 않는 비서처럼 24시간 깨어 있으면서 직접 검색하고 코딩하고 결과를 메신저로 보고합니다.',
      intermediate: '중급 원리: 하네스(Harness)는 ① 상태·장기 기억 관리(Episodic & Semantic Memory), ② 도구 실행 샌드박스(Tool Execution), ③ 에러 복구 루프(Self-Correction), ④ 정기 스케줄러(Cron)를 오케스트레이션합니다.',
      advanced: '심화 엔지니어링: 작업 성공 후 해결 절차를 마크다운 스킬 파일(`SKILL.md`)로 추상화해 영구 메모리에 저장하는 자기 진화형 스킬 루프(Skill Distillation)를 통해 동일 유형 과제의 토큰 소모를 80% 이상 절감합니다.'
    },
    keyTerms: [
      { term: '하네스 (Harness)', desc: 'LLM 모델 외부에서 메모리, 도구 호출, 실행 환경, 컨텍스트 압축, 안전 가드레일을 통합 제어하는 런타임 시스템' },
      { term: '영구 메모리 (Persistent Memory)', desc: '대화 세션이 종료되어도 사용자의 선호도, 프로젝트 구조, 해결 노하우를 파일이나 DB에 보존하는 장기 기억 장치' },
      { term: 'ReAct 루프 (Reasoning + Acting)', desc: '에이전트가 목표 달성 시까지 "추론 → 도구 실행 → 실행 결과 관찰 → 계획 수정"을 반복하는 핵심 작동 사이클' }
    ],
    relatedTools: ['Hermes Agent (Nous Research)', 'DeepSeek Harness', 'EnvHarness (Google Research)'],
    dateAdded: '2026-10-16',
    processSteps: [
      { title: '목표 수신 및 영구 메모리 조회', desc: '사용자가 텔레그램이나 터미널로 지시를 내리면, 하네스가 과거에 축적한 영구 메모리와 스킬 노트를 먼저 검색합니다.', nodes: ['사용자 목표 수신', '영구 메모리(Memory) 조회', '기존 학습 스킬 로드', '단계별 실행 계획 수립'] },
      { title: 'Tool Gateway 도구 호출 및 실행', desc: '하네스가 웹 브라우저, 검색기, 샌드박스 리눅스 터미널을 직접 조작해 데이터를 모으고 코드를 실행합니다.', nodes: ['웹 검색 및 브라우저 제어', '샌드박스 코드 작성·실행', '중간 오류 발생 시 자동 수정', '결과 데이터 검증'] },
      { title: '자체 스킬 생성 및 기억 업데이트', desc: '이번 작업을 해결하며 새로 알게 된 방법이나 스크립트를 재사용 가능한 스킬로 요약해 메모리에 영구 저장합니다.', nodes: ['해결 과정 복기', '새 스킬 파일 자동 생성', '영구 메모리 업데이트', '다음 작업 시 즉시 재사용'] },
      { title: '최종 보고 및 정기 스케줄링', desc: '완성된 결과물을 사용자 메신저로 보고하고, 필요시 매일 아침 반복 실행되도록 크론(Cron) 스케줄에 등록합니다.', nodes: ['최종 보고서 전송', '정기 스케줄(Cron) 등록', '백그라운드 대기 상태 유지', '자율 에이전트 루프 완성'] }
    ],
    labConfig: {
      paramLabel: '에이전트 하네스 작업 지시 선택',
      paramType: 'select',
      options: ['Hermes Agent로 매일 아침 서버 로그 점검 & 자동 패치 스킬 생성', 'DeepSeek Harness로 프론트엔드 컴포넌트 자율 생성 및 빌드 검증'],
      defaultParam: 'Hermes Agent로 매일 아침 서버 로그 점검 & 자동 패치 스킬 생성',
      codeLang: 'Bash · Hermes Agent 설치 및 자율 작업 실행',
      starterCode: `# 1. Hermes Agent 설치 및 백엔드 모델(OpenRouter 또는 로컬 Ollama) 지정
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
hermes model set openrouter/deepseek/deepseek-v4.1-flash-1017

# 2. 자율 목표 부여 (수행 후 절차를 영구 스킬로 저장하도록 지시)
hermes run "사내 API 응답 지연 원인을 분석해 패치하고, 이 점검 절차를 스킬로 저장해줘."`,
      runOutput: `[실행 결과 · Hermes Agent Execution Log]
[Memory] 기존 인프라 점검 스킬 2건 로드 완료.
[Tool: bash] 샌드박스에서 API 슬로우 쿼리 로그 분석 실행...
[Tool: edit] db_pool.py 커넥션 타임아웃 설정 수정 및 단위 테스트 통과 (3/3 passed).
[Skill Created] 새로운 재사용 스킬 'api-latency-audit'가 영구 메모리에 저장되었습니다.`
    },
    quiz: {
      question: 'LLM 단품이 가진 한계(기억 휘발, 직접 코드 실행 불가)를 극복하기 위해 모델 바깥에서 영구 메모리, 도구 게이트웨이, 샌드박스 실행기, 오류 복구 루프를 감싸주는 런타임 체제를 무엇이라 부르나요?',
      options: [
        '에이전틱 하네스 (Agentic Harness)',
        '이미지 필터 (Image Filter)',
        '정적 HTML 테이블 (Static Table)',
        '단순 토크나이저 (Simple Tokenizer)'
      ],
      answerIndex: 0,
      explanation: '에이전틱 하네스(Agentic Harness)는 파운데이션 모델(두뇌)에 장기 기억, 도구 실행 환경, 스케줄러, 자율 복구 루프를 결합해 실제 업무를 완수하게 만드는 프레임워크입니다.'
    }
  },
  {
    id: 't15',
    chapter: 5,
    sectionCode: '5.2',
    layer: 'L3',
    difficulty: 'elementary',
    roles: ['pm', 'designer-fe', 'app-be', 'data-ontology'],
    term: 'MCP (Model Context Protocol)와 A2A 규격',
    analogy: 'MCP는 어떤 AI 모델에나 외장하드·분석기·업무 툴을 바로 꽂아 쓸 수 있게 통일한 USB-C 규격이고, A2A는 서로 다른 AI 비서들이 업무 협조전을 주고받는 표준 통신망입니다.',
    definition: '과거에는 새로운 AI 모델이 나올 때마다 구글 드라이브, 슬랙, DB, 바이너리 분석기 등을 연결하는 코드를 각각 따로 짜야 했습니다. MCP는 AI가 외부 도구의 목록을 읽고 호출하는 방식을 하나로 통일한 오픈 표준입니다. 나아가 최근 GitHub 트렌드 1위에 오른 REA(Reverse Engineer Anything)처럼 복잡한 바이너리 역분석 도구도 MCP 서버 형태로 제공되어 에이전트에 플러그인처럼 꽂아 쓸 수 있습니다.',
    deepNote: '실무 포인트: MCP가 "에이전트와 도구(Tool) 사이의 수직 연결 표준"이라면, A2A(Agent-to-Agent)는 "서로 다른 에이전트끼리 역할을 나누고 협상하는 수평 연결 표준"입니다.',
    studyGuide: '1단계(입문): 왜 M개의 모델과 N개의 도구를 연결할 때 M×N 파편화 문제가 생겼고 MCP가 이를 어떻게 M+N으로 해결했는지 이해합니다. → 2단계(초급): 클로드나 커서, 안티그래비티 설정 파일(`mcpServers`)에 오픈소스 MCP 서버를 등록해 봅니다. → 3단계(중급~심화): FastMCP(Python)나 TypeScript SDK로 사내 온톨로지·DB를 조회하는 전용 MCP 서버를 직접 구현합니다.',
    levels: {
      beginner: '입문 개념: 예전에는 휴대폰마다 충전기 모양이 달라 불편했지만 이제 USB-C 하나로 모든 기기를 연결하듯, 어떤 AI에게든 새로운 기능(DB 조회, 웹 조작, 역분석)을 플러그인처럼 꽂아주는 만능 단자입니다.',
      intermediate: '중급 원리: MCP는 호스트(AI 앱), 클라이언트, 서버 구조로 작동하며 JSON-RPC 2.0 메시지를 통해 세 가지 핵심 요소인 Tools(실행 함수), Resources(읽기 전용 데이터), Prompts(템플릿)를 노출합니다.',
      advanced: '심화 엔지니어링: 수백 개의 MCP 도구를 한꺼번에 프롬프트에 넣으면 컨텍스트가 낭비되므로, 필요한 순간에만 도구 스키마를 동적으로 로드(Lazy Tool Loading)하고 A2A 프로토콜로 하위 전문 에이전트에게 위임하는 계층형 설계를 적용합니다.'
    },
    keyTerms: [
      { term: 'MCP (Model Context Protocol)', desc: 'AI 모델/에이전트가 외부 데이터 소스(Resources) 및 실행 도구(Tools)와 안전하고 일관되게 통신하기 위한 오픈 표준 규격' },
      { term: 'MCP Host · Client · Server', desc: '에이전트 앱 본체(Host), 연결을 관리하는 중개자(Client), 실제 DB나 로컬 기능을 제공하는 독립 프로세스(Server)' },
      { term: 'A2A (Agent-to-Agent Protocol)', desc: '서로 다른 프레임워크나 벤더로 만들어진 독립 에이전트들이 상대의 역량(Agent Card)을 확인하고 작업을 위임·협업하는 표준' }
    ],
    relatedTools: ['MCP (Model Context Protocol)', 'REA (MCP 기반 역분석 툴)', 'A2A 프로토콜', 'Claude / Hermes / Antigravity'],
    dateAdded: '2026-10-16',
    processSteps: [
      { title: 'MCP 서버 플러그인 연결', desc: '에이전트 설정 파일에 로컬 파일, DB, 또는 REA(역분석 도구) MCP 서버 주소를 등록합니다.', nodes: ['MCP 호스트(에이전트)', 'MCP 서버(REA / DB) 연결', '표준 JSON-RPC 핸드셰이크', '제공 도구 목록 자동 인식'] },
      { title: '자율 도구 선택 및 분석 요청', desc: '사용자가 "이 앱의 동작 원리를 분석해줘"라고 하면 에이전트가 REA MCP 서버의 바이너리 검사 도구를 호출합니다.', nodes: ['사용자 요청 분석', 'mcp.call_tool("inspect")', '로컬 샌드박스 내 분석 실행', '외부 유출 없이 로컬 처리'] },
      { title: '구조화된 근거(Evidence) 반환', desc: 'MCP 서버가 분석 결과와 함께 실제 코드 위치·근거·한계점을 표준 포맷으로 에이전트에게 돌려줍니다.', nodes: ['내부 함수 호출 그래프 추출', '근거 데이터(Evidence) 첨부', '분석 한계점 명시', '에이전트 컨텍스트 적재'] },
      { title: 'A2A 에이전트 간 협업 및 재구현', desc: '분석 에이전트가 파악한 설계도를 A2A 프로토콜로 코딩 에이전트에게 전달해 클론 코드를 완성합니다.', nodes: ['분석 에이전트 -> 코딩 에이전트', 'A2A 작업 위임 메시지', '재구현 코드 자동 작성', '최종 검증 완료'] }
    ],
    labConfig: {
      paramLabel: 'MCP 서버 연동 예제 선택',
      paramType: 'select',
      options: ['REA (Reverse Engineer Anything) MCP 서버 연결 설정', '사내 PostgreSQL 데이터베이스 조회용 MCP 서버 연결 설정'],
      defaultParam: 'REA (Reverse Engineer Anything) MCP 서버 연결 설정',
      codeLang: 'JSON · 에이전트에 MCP 서버(REA)를 장착하는 설정 코드',
      starterCode: `{
  "mcpServers": {
    "rea-reverse-engineer": {
      "command": "npx",
      "args": ["-y", "rea-agents", "--local-only"],
      "description": "바이너리 및 웹 앱의 구조를 역분석하여 근거와 함께 반환하는 MCP 서버"
    }
  }
}`,
      runOutput: `[실행 결과 · MCP Server Connected]
[OK] MCP Server 'rea-reverse-engineer' initialized (Local Sandbox Mode).
[OK] Discovered 4 tools: [inspect_binary, trace_electron_ipc, extract_api_schema, verify_evidence]
에이전트가 이제 소스 코드 없이도 앱 기능을 분석하고 재구현할 준비가 되었습니다.`
    },
    quiz: {
      question: 'MCP(Model Context Protocol)와 A2A(Agent-to-Agent)의 역할 차이를 가장 바르게 설명한 것은 무엇인가요?',
      options: [
        'MCP는 에이전트가 외부 도구·데이터(DB, 파일, 분석기 등)를 연결하는 수직 표준이고, A2A는 서로 다른 에이전트끼리 업무를 위임·협업하는 수평 표준이다.',
        'MCP는 그래픽카드 냉각 기술이고, A2A는 모니터 케이블 규격이다.',
        '두 규격 모두 오직 이미지 압축에만 사용된다.',
        'MCP는 인터넷 연결을 차단하는 방화벽 하드웨어 이름이다.'
      ],
      answerIndex: 0,
      explanation: 'MCP는 모델/에이전트와 외부 도구(Tool/Resource) 간의 연결 인터페이스를 표준화하며, A2A는 독립된 에이전트들 사이의 작업 위임과 상태 공유를 표준화합니다.'
    }
  },
  {
    id: 't16',
    chapter: 5,
    sectionCode: '5.3',
    layer: 'L3',
    difficulty: 'advanced',
    roles: ['app-be', 'ml-dl'],
    term: '체화된 에이전트 (Embodied Agent)와 환경 API (Mineflayer)',
    analogy: '사람처럼 모니터 화면을 눈으로 보고 마우스를 더듬거리며 조작하는 대신, 가상 세계의 신경망(환경 API)에 직접 연결해 주변 지형을 숫자로 읽고 행동 프로그램으로 몸을 움직이는 에이전트입니다.',
    definition: '구글 딥마인드의 제미나이 4 아르곤(Gemini 4 Argon) 팀이 27시간 14분 동안 자율 협업해 마인크래프트를 클리어할 때 사용한 핵심 아키텍처입니다. 화면 픽셀만 보고 조작하는 방식보다 오픈소스 봇 프레임워크인 Mineflayer API를 통해 주변 블록·체력·소지품 데이터를 정확히 읽고, 이동·채굴·전투를 수행하는 자바스크립트 프로그램(총 2,783개)을 실시간으로 작성·실행하여 하루가 넘는 장기 과제를 완수했습니다.',
    deepNote: '실무 포인트: 한 에이전트가 용암에 빠져 아이템을 잃을 위기에 처하자 동료 에이전트에게 좌표를 공유해 아이템을 회수하고, 서로의 허위 완료 보고를 지적해 바로잡는 등 기업 실무의 다중 에이전트 협업과 똑같은 메커니즘이 작동했습니다.',
    studyGuide: '1단계(입문): 픽셀 기반 GUI 조작(Computer Use)과 구조화된 환경 API 제어(Code-as-Action)의 장단점을 비교합니다. → 2단계(초급): 에이전트가 행동을 단발성 버튼 클릭이 아닌 "실행 가능한 코드 함수"로 작성해 수행하는 원리를 이해합니다. → 3단계(중급~심화): 다중 에이전트 간 공유 메모리, 상호 검증(Peer Verification), 장기 장애 복구 아키텍처를 설계합니다.',
    levels: {
      beginner: '입문 개념: AI들이 마인크래프트 게임 속에 들어가 서로 채팅으로 "내가 식량 구할게", "난 다이아몬드 캘게"라고 역할을 나누고, 27시간 동안 수백 번 죽어가면서도 끝내 최종 보스를 잡은 협업 기술입니다.',
      intermediate: '중급 원리: 에이전트가 매 순간 마우스 클릭을 추론하는 대신, 환경 상태 JSON을 읽고 목표를 수행하는 자바스크립트 함수(Code-as-Policy)를 짜서 Mineflayer 런타임에 던지고 실행 에러 로그를 받아 스스로 디버깅합니다.',
      advanced: '심화 엔지니어링: 장기 과제(Long-Horizon Task)에서 가장 위험한 문제는 한 에이전트의 환각(실패했는데 성공했다고 착각)이 팀 전체에 전파되는 것입니다. 이를 막기 위해 환경 API의 실제 인벤토리·좌표 상태와 동료 에이전트의 교차 검증 루프를 강제합니다.'
    },
    keyTerms: [
      { term: '체화된 에이전트 (Embodied Agent)', desc: '가상 시뮬레이션 월드나 실제 로봇 신체를 통해 환경과 물리적·지속적으로 상호작용하며 과제를 수행하는 에이전트' },
      { term: 'Code-as-Action (행동으로서의 코드)', desc: '에이전트가 행동을 수행할 때 단순 명령 선택 대신 조건문·반복문이 포함된 실행 코드를 실시간 작성해 환경을 제어하는 기법' },
      { term: '장기 과제 (Long-Horizon Task)', desc: '수분 내로 끝나는 단발성 질문을 넘어 수시간~수일 동안 수천 번의 하위 단계와 실패 복구를 거쳐야 완수되는 고난도 목표' }
    ],
    relatedTools: ['Gemini 4 Argon', 'Mineflayer (PrismarineJS)', 'Mindcraft / Voyager', 'EnvHarness'],
    dateAdded: '2026-10-19',
    processSteps: [
      { title: '자율 역할 분담 (10분 차)', desc: '사전 공략 없이 투입된 에이전트들이 채팅으로 식량 수집, 다이아몬드 채굴, 도구 제작, 차원문 건설 역할을 스스로 나눕니다.', nodes: ['Agent 1: 식량 및 기지', 'Agent 2: 심층 광산 채굴', 'Agent 3: 장비 제작 및 조합', 'Agent 4: 차원문 탐색'] },
      { title: '환경 API 상태 수집 (Mineflayer)', desc: 'Mineflayer API를 통해 주변 블록 좌표, 체력, 몬스터 위치, 인벤토리 상태를 정밀 데이터로 읽어 들입니다.', nodes: ['주변 3D 블록 좌표 스캔', '체력 및 인벤토리 확인', '삼각측량으로 요새 위치 계산', '공유 메모리에 상태 기록'] },
      { title: '행동 코드 실시간 작성 및 실행', desc: '읽어 들인 상태를 바탕으로 채굴·건축·전투를 수행하는 자바스크립트 코드를 직접 짜서 실행하고 오류를 고칩니다.', nodes: ['총 2,783개 코드 작성·실행', '22% 코드 오류 발생 시 자가 수정', '동료 사망 시 아이템 긴급 회수', '기둥 위 회복 수정 10개 파괴'] },
      { title: '27시간 장기 협업 완수', desc: '605번의 캐릭터 사망과 6번의 서버 재시작을 극복하고 27시간 14분 만에 최종 보스 엔더 드래곤을 물리칩니다.', nodes: ['상호 결과 검증 및 모순 지적', '14시간 최종 보스전 돌파', '엔더 드래곤 토벌 성공', '장기 자율 협업 입증'] }
    ],
    labConfig: {
      paramLabel: 'Mineflayer 에이전트 행동 모듈 선택',
      paramType: 'select',
      options: ['주변 광물 탐색 및 자율 채굴 코드 생성 루프', '동료 에이전트 위기 발생 시 좌표 공유 및 아이템 구조 루프'],
      defaultParam: '주변 광물 탐색 및 자율 채굴 코드 생성 루프',
      codeLang: 'JavaScript · LLM이 생성해 실행하는 Mineflayer 제어 코드',
      starterCode: `const mineflayer = require('mineflayer');
const bot = mineflayer.createBot({ host: 'localhost', port: 25565, username: 'Argon_Miner' });

// 에이전트가 환경 API로 다이아몬드 광석을 찾아 채굴하고 공유 메모리에 보고하는 함수
async function mineDiamondTask(bot, sharedMemory) {
  const block = bot.findBlock({ matching: bot.registry.blocksByName.diamond_ore.id, maxDistance: 32 });
  if (block) {
    await bot.dig(block);
    sharedMemory.Broadcast("다이아몬드 채굴 성공! 좌표: " + block.position);
  }
}`,
      runOutput: `[실행 결과 · Mineflayer Embodied Agent Simulation]
[Argon_Miner] 주변 32블록 스캔 완료 -> diamond_ore 발견 (좌표: x=-142, y=-54, z=88)
[Argon_Miner] 철 곡괭이 장착 확인 후 bot.dig() 실행 완료.
[Shared Memory] 팀 채팅 브로드캐스트: "다이아몬드 3개 확보 완료. 대장장이 에이전트(Argon_Crafter)에게 전달합니다."`
    },
    quiz: {
      question: '제미나이 4 아르곤 다중 에이전트 팀이 27시간 동안 마인크래프트 장기 과제를 완수할 때, 단순 화면 픽셀 클릭 대신 정밀한 주변 상태 파악과 복합 행동을 위해 사용한 방식은 무엇인가요?',
      options: [
        '환경 API(Mineflayer)로 구조화된 상태를 읽고 자바스크립트 행동 코드를 실시간 작성·실행·자가수정하는 방식',
        '사람이 27시간 내내 뒤에서 조이스틱으로 대신 조종하는 방식',
        '화면 해상도를 1×1 픽셀로 줄여서 무작위로 점프만 하는 방식',
        '게임 서버의 시간을 멈춰두고 아무 행동도 하지 않는 방식'
      ],
      answerIndex: 0,
      explanation: '환경 API(Mineflayer)를 통해 3D 좌표와 인벤토리를 정확히 읽고 2,783개의 자바스크립트 행동 프로그램을 실시간 작성·디버깅하며 동료 에이전트들과 상호 검증한 것이 성공의 핵심입니다.'
    }
  },
  {
    id: 't17',
    chapter: 5,
    sectionCode: '5.4',
    layer: 'L1',
    difficulty: 'advanced',
    roles: ['pm', 'ml-dl', 'mlops-infra'],
    term: '모델 증류 (Model Distillation)와 재귀적 자기 개선 (RSI)',
    analogy: '증류는 거장 스승(초대형 모델)의 핵심 노하우를 젊은 제자(경량 모델)에게 압축 전수하는 것이고, 재귀적 자기 개선(RSI)은 AI가 스스로 자신의 설계도와 코드를 고쳐 더 똑똑한 다음 세대 AI를 직접 만들어내는 단계입니다.',
    definition: '모델 증류는 거대한 교사 모델(Teacher)이 생성한 고품질 추론 과정과 정답 데이터를 이용해 작고 빠른 학생 모델(Student)을 학습시키는 기법입니다. 나아가 재귀적 자기 개선(RSI, Recursive Self-Improvement)은 AI 모델이 후속 세대 AI의 데이터 정제, 아키텍처 개선, 학습 코드 최적화, 안전성 검증에 직접 참여해 지능 발전 속도를 가속화하는 루프입니다. 최근 구글은 제미나이 4 플래시부터 AI가 후속 모델 개발에 본격 참여하는 RSI 궤도에 진입했다고 밝혔습니다.',
    deepNote: '실무 포인트: 앤트로픽 클로드가 25년 된 NIST 암호 표준 시드 생성 원리를 30분 만에 역추적해 풀고, 오픈AI GPT-6 아스트라가 물리학자의 풀이 오류를 잡아내는 등 AI가 인간 연구자의 영역을 직접 수행하며 AI 자신의 발전 속도를 높이고 있습니다.',
    studyGuide: '1단계(입문): 거대 교사 모델(Teacher)과 경량 학생 모델(Student) 사이의 지식 증류(Knowledge Distillation) 개념을 이해합니다. → 2단계(초급): 프론티어 모델로 고품질 합성 데이터(Synthetic Data)와 추론 궤적(Trajectory)을 생성해 사내 소형 모델을 학습시키는 파이프라인을 익힙니다. → 3단계(중급~심화): 재귀적 자기 개선(RSI) 루프의 구조와 인간 승인 안전망(Alignment & Sandboxing)을 학습합니다.',
    levels: {
      beginner: '입문 개념: 2조 개 파라미터를 가진 거대 스승 AI가 고난도 문제를 푸는 "생각 노트"를 모아 700억 개 크기의 제자 AI에게 가르치면, 제자 AI도 스승 못지않게 똑똑해지면서 속도는 훨씬 빨라집니다.',
      intermediate: '중급 원리: 증류는 크게 정답 텍스트/추론 사슬을 모방하는 데이터 증류(Sequence-level Distillation)와 교사 모델의 출력 확률 분포(Logits) 자체를 KL-Divergence 손실로 근사하는 로짓 증류로 나뉩니다.',
      advanced: '심화 엔지니어링: RSI(재귀적 자기 개선) 단계에서는 현세대 모델이 ① 합성 추론 데이터 생성 및 검증 필터링, ② CUDA/Triton 커널 최적화, ③ 하이퍼파라미터 및 아키텍처 탐색을 자율 수행하여 차세대 모델의 연구 주기를 단축합니다.'
    },
    keyTerms: [
      { term: '지식 증류 (Knowledge Distillation)', desc: '대형 교사 모델(Teacher)의 추론 능력과 확률 분포를 경량 학생 모델(Student)에게 전이시켜 소형 모델의 지능을 극대화하는 기술' },
      { term: '합성 데이터 (Synthetic Data)', desc: '인간이 직접 작성한 데이터가 고갈됨에 따라, 고성능 AI와 검증기( 컴파일러·추론기)를 결합해 대량 생성한 고품질 학습 데이터' },
      { term: 'RSI (재귀적 자기 개선)', desc: 'AI 시스템이 스스로의 학습 데이터, 알고리즘, 시스템 코드를 개선하여 더 뛰어난 후속 세대 AI를 만들어내는 가속 루프' }
    ],
    relatedTools: ['Gemini 4 Flash / Argon (RSI 참여)', 'GPT-6 Astra', 'Claude 5.5', 'Nemotron 3.5 Bolt (Distilled)'],
    dateAdded: '2026-10-18',
    processSteps: [
      { title: '1단계: 자기 분석 및 병목 탐지', desc: '현재 세대의 AI 모델이 자신의 추론 로그, 학습 코드, 데이터 파이프라인을 분석해 비효율과 약점을 스스로 찾아냅니다.', nodes: ['학습 파이프라인 코드 분석', '추론 실패 케이스 분류', '연산 병목 구간 탐지', '개선 가설 자동 도출'] },
      { title: '2단계: 알고리즘 및 훈련 데이터 개량', desc: 'AI가 직접 더 정교한 합성 데이터(Synthetic Data)를 생성·검증하고 최적화된 커널 및 학습 코드를 작성합니다.', nodes: ['고난도 합성 데이터 생성', '자동 코드 리뷰로 버그 검출', '커널 및 아키텍처 개선', '교사 모델 지식 증류'] },
      { title: '3단계: 차세대 모델 훈련 및 자기 평가', desc: '개선된 레시피로 훈련된 후속 모델을 까다로운 벤치마크와 안전성 테스트로 검증합니다.', nodes: ['후속 세대 모델 훈련', '자동 레드팀·안전성 검증', '이전 세대 대비 지능 향상', '인간 연구원 최종 승인'] },
      { title: '4단계: 재귀적 루프 가속 (RSI)', desc: '더 똑똑해진 차세대 AI가 다시 그다음 세대 AI 개발에 투입되면서 발전 주기가 지수함수적으로 빨라집니다.', nodes: ['차세대 모델 개발 투입', '연구 개발 주기 단축', '과학·암호·물리 난제 해결', '지속적 자기 개선 루프'] }
    ],
    labConfig: {
      paramLabel: '고등 추론 및 자기 개선 사례 선택',
      paramType: 'select',
      options: ['앤트로픽 클로드: 25년 된 NIST P-256 암호 표준 시드(lrand48) 30분 역추적 재현', '구글 제미나이 4: AI가 작성한 훈련 코드 자동 리뷰 및 RSI 루프 시뮬레이션'],
      defaultParam: '앤트로픽 클로드: 25년 된 NIST P-256 암호 표준 시드(lrand48) 30분 역추적 재현',
      codeLang: 'Python · NIST P-256 타원곡선 시드 타임스탬프 역추적 검증 원리',
      starterCode: `import hashlib

# 클로드가 30분 만에 밝혀낸 1990년대 C 라이브러리 lrand48 기반 시드 생성 재현 개념 코드
# 1997년 당시 유닉스 타임스탬프(초 단위)에서 출발해 SHA-1 시드를 역추적
guessed_timestamp = 875642190  # 1997년 가을 특정 시점 타임스탬프
seed_hex = hashlib.sha1(str(guessed_timestamp).encode()).hexdigest()

print(f"검증 타임스탬프: {guessed_timestamp}")
print(f"재현된 타원곡선 설계 시드: {seed_hex}")`,
      runOutput: `[실행 결과 · Cryptographic Seed Verification]
검증 타임스탬프: 875642190 (1990년대 lrand48 PRNG 초기값 역산 일치)
재현된 NIST P-256 시드: c49d360886e704936a6678e1139d26b7819f7e90 (표준 문서와 100% 일치!)
결론: 25년간 미스터리로 남아 있던 암호 표준 숫자가 특정 백도어가 아닌 타임스탬프 난수였음을 수학적으로 입증.`
    },
    quiz: {
      question: '초대형 교사 모델(Teacher)이 생성한 고품질 추론 과정과 확률 분포를 이용해 작고 빠른 학생 모델(Student)의 지능을 끌어올리는 기법과, AI가 후속 세대 AI 개발에 직접 참여해 발전을 가속하는 루프를 각각 무엇이라 부르나요?',
      options: [
        '모델 증류 (Model Distillation)와 재귀적 자기 개선 (RSI)',
        '데이터 삭제 (Data Deletion)와 수동 입력 (Manual Entry)',
        '오디오 녹음 (Audio Recording)과 화면 캡처 (Screen Capture)',
        '언더피팅 (Underfitting)과 오버플로 (Overflow)'
      ],
      answerIndex: 0,
      explanation: '교사 모델의 지식을 경량 학생 모델에게 전수하는 것이 모델 증류(Model Distillation)이며, AI가 차세대 AI의 데이터·코드·아키텍처 개선에 참여하는 루프가 재귀적 자기 개선(RSI)입니다.'
    }
  }
);
