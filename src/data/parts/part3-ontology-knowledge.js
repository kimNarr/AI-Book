// ============================================================================
// PART III · 지식 표현 · 온톨로지(Ontology) · 지식 그래프와 RAG (3.x)
// ============================================================================

window.BOOK_PARTS_DATA = window.BOOK_PARTS_DATA || [];

window.BOOK_PARTS_DATA.push(
  {
    id: 'p3-ontology-core',
    chapter: 3,
    sectionCode: '3.1',
    layer: 'L3',
    difficulty: 'beginner',
    roles: ['pm', 'designer-fe', 'app-be', 'data-ontology'],
    term: '온톨로지 (Ontology) 개념 접근과 도메인 지식 설계 방법론',
    analogy: '일반 사전이 단어의 뜻만 적어둔 메모장이라면, 온톨로지는 세상의 모든 개념(클래스)과 실체(인스턴스)들이 서로 어떤 관계로 맺어지고 어떤 법칙(공리)을 따르는지 컴퓨터가 추론할 수 있게 짠 "지식의 헌법이자 설계도"입니다.',
    definition: '철학에서 "존재론"을 뜻하던 온톨로지(Ontology)는 컴퓨터 공학과 AI에서 "특정 도메인(업무 영역) 내의 개념(Concept/Class), 속성(Property), 개념 간의 관계(Relation), 그리고 반드시 지켜야 할 논리적 제약 규칙(Axiom)을 명시적이고 형식적으로 정의한 지식 명세서"를 뜻합니다. 팔란티어(Palantir Foundry/AIP)와 최신 엔터프라이즈 AI가 거대 기업의 복잡한 데이터를 LLM 에이전트와 연결할 때 가장 핵심으로 삼는 데이터·지식 모델링 계층입니다.',
    deepNote: '실무 포인트: 많은 분들이 DB 테이블 스키마나 단순 카테고리 분류(택소노미)를 온톨로지와 혼동합니다. 택소노미가 "포유류 > 개 > 진돗개" 같은 상하 포함(is-a) 트리라면, 온톨로지는 "진돗개는 주인을 보호한다", "미성년자 고객은 고위험 파생상품을 계약할 수 없다" 같은 다차원 관계와 논리 규칙(공리) 및 행동(Action)까지 포함합니다.',
    studyGuide: '[온톨로지 체계적 공부 방법 4단계] 1단계(개념 잡기): 용어집(Glossary) → 분류체계(Taxonomy) → 시소러스(Thesaurus) → 온톨로지(Ontology)로 발전하는 지식 구조의 차이를 이해합니다. → 2단계(핵심 4요소 습득): 클래스(Class), 인스턴스(Instance), 속성(Object/Data Property), 공리(Axiom)를 내 일상 업무(예: 쇼핑몰 주문·환불)에 대입해 종이에 그려봅니다. → 3단계(표준 언어 & 도구 실습): 스탠퍼드 대학의 무료 도구인 Protégé나 파이썬 Owlready2로 작은 도메인 온톨로지를 만들고 HermiT 추론기(Reasoner)를 돌려봅니다. → 4단계(AI 엔지니어링 결합): 구축한 온톨로지를 LLM의 Structured Output 스키마 및 GraphRAG의 지식 그래프 뼈대로 연결합니다.',
    levels: {
      beginner: '입문 개념: 회사마다 부서별로 "고객", "주문", "정산"을 부르는 말과 기준이 다르면 AI도 헷갈립니다. 온톨로지는 회사 전체의 개념과 관계를 하나의 표준 지도로 통일하여 사람과 AI가 똑같은 의미로 소통하게 만드는 공통 언어 사전입니다.',
      intermediate: '중급 원리: 온톨로지는 4가지 기둥으로 설계합니다. ① 클래스(Class: 개념 범주, 예: 직원, 프로젝트), ② 인스턴스(Instance: 실제 객체, 예: 홍길동, AI-Book 프로젝트), ③ 프로퍼티(Property: 객체 간 관계 및 데이터 속성, 예: 참여한다, 시작일), ④ 공리(Axiom: 논리 제약, 예: 퇴사자는 보안 프로젝트의 관리자가 될 수 없다).',
      advanced: '심화 엔지니어링: 팔란티어 스타일의 엔터프라이즈 온톨로지(Kinetic Ontology)는 정적인 명사(Object)와 관계(Link)에 그치지 않고, 비즈니스 의사결정과 상태 변경을 일으키는 행동 함수(Action Type)와 권한 정책까지 온톨로지에 묶어 에이전틱 하네스(MCP 도구)가 안전하게 호출하도록 설계합니다.'
    },
    keyTerms: [
      { term: '택소노미 (Taxonomy) vs 온톨로지', desc: '택소노미는 상위·하위 계층 분류(Tree)이고, 온톨로지는 계층 분류에 다방향 관계망과 논리 규칙(Axiom)을 더한 그래프 지식 체계' },
      { term: '클래스 (Class)와 인스턴스 (Instance)', desc: '사물의 추상적 범주/틀(Class: 예 "자동차")과 그 범주에 속하는 구체적 실체(Instance: 예 "내 주차장의 12가3456 차량")' },
      { term: '오브젝트 프로퍼티 vs 데이터 프로퍼티', desc: '개체와 개체를 연결하는 관계(Object Property: A가 B를 소속부서로 둠)와 개체의 값 속성(Data Property: 나이=30)' },
      { term: '공리 (Axiom)와 추론기 (Reasoner)', desc: '도메인에서 항상 참이어야 하는 논리 규칙(공리)과, 이를 바탕으로 명시되지 않은 숨은 사실이나 모순을 자동 도출하는 엔진(추론기)' }
    ],
    relatedTools: ['Protégé (스탠퍼드 온톨로지 편집기)', 'Owlready2 (Python 온톨로지)', 'Palantir AIP Ontology', 'Neo4j'],
    dateAdded: '2026-10-19',
    processSteps: [
      { title: '1단계: 도메인 역량 질문 정의', desc: '"우리 AI 시스템이 어떤 질문에 답해야 하는가?"(Competency Questions)를 먼저 정해 온톨로지 범위를 잡습니다.', nodes: ['핵심 비즈니스 질문 도출', '용어 수집 및 표준화', '택소노미 계층 분류', '설계 범위 확정'] },
      { title: '2단계: 클래스·속성·관계 모델링', desc: '핵심 개체(Class)를 정의하고 개체 간 관계(Object Property)와 데이터 타입(Data Property)을 연결합니다.', nodes: ['Class(고객·계약·상품)', 'is-a 상하 계층 설정', 'Object Property 연결', 'Data Property 정의'] },
      { title: '3단계: 논리 공리(Axiom) 및 규칙 부여', desc: '카디널리티(1:N), 상호 배타성(Disjoint), 전이성(Transitive) 등 도메인 법칙을 공리로 명시합니다.', nodes: ['상호 배타 조건 설정', '필수/역관계 규칙 부여', '비즈니스 액션(Action) 매핑', '온톨로지 스키마 완성'] },
      { title: '4단계: 인스턴스 적재 & 추론 검증', desc: '실제 데이터를 연결하고 추론기(Reasoner)와 LLM을 가동해 논리적 모순 탐지 및 정밀 질의응답을 수행합니다.', nodes: ['실데이터 인스턴스 매핑', 'Reasoner 무결성 검증', '숨은 관계 자동 추론', 'LLM 에이전트 컨텍스트 제공'] }
    ],
    labConfig: {
      paramLabel: '온톨로지 설계 및 추론 실습 시나리오 선택',
      paramType: 'select',
      options: [
        '기업 보안 권한 온톨로지 (인턴·정직원 클래스와 기밀문서 접근 공리 검증)',
        '이커머스 상품·주문 도메인 온톨로지 (택소노미 + 환불 정책 액션 연결)',
        '의료·바이오 약물-타겟-질병 관계 온톨로지 추론'
      ],
      defaultParam: '기업 보안 권한 온톨로지 (인턴·정직원 클래스와 기밀문서 접근 공리 검증)',
      codeLang: 'Python · 도메인 온톨로지(Class · Property · Axiom) 정의 및 추론 시뮬레이션',
      starterCode: `# 온톨로지 핵심 구조(Class, Property, Axiom)를 파이썬으로 구현한 검증 예제
ontology_schema = {
    "classes": {"Employee": {}, "FullTime": {"subClassOf": "Employee"}, "Intern": {"subClassOf": "Employee"}},
    "disjoint": [("FullTime", "Intern")],  # 공리 1: 정직원과 인턴은 동시에 될 수 없음
    "axioms": [" SecretDoc.accessibleBy ONLY FullTime "] # 공리 2: 기밀문서는 오직 정직원만 접근 가능
}

def reasoner_check(user_role, target_resource):
    Allowed = (user_role == "FullTime") if target_resource == "SecretDoc" else True
    return f"[Reasoner 추론 결과] Role={user_role}, Resource={target_resource} -> Access Allowed: {Allowed}"

print(reasoner_check("Intern", "SecretDoc"))
print(reasoner_check("FullTime", "SecretDoc"))`,
      runOutput: `[실행 결과 · Ontology Reasoner Consistency Check]
[OK] Loaded 3 Classes, 2 ObjectProperties, 2 Logical Axioms.
[Reasoner 추론 결과] Role=Intern, Resource=SecretDoc -> Access Allowed: False (공리 2 위반 차단!)
[Reasoner 추론 결과] Role=FullTime, Resource=SecretDoc -> Access Allowed: True
-> LLM에게 프롬프트로만 부탁하는 대신 온톨로지 추론기로 검증하면 권한 침해 확률이 0%가 됩니다.`
    },
    quiz: {
      question: '단순한 상하위 카테고리 트리(Taxonomy)를 넘어, 도메인 내 개념(Class) 간의 다차원적 관계(Property)와 반드시 지켜야 할 논리적 제약 규칙(Axiom)까지 형식적으로 정의한 지식 모델은 무엇인가요?',
      options: [
        '온톨로지 (Ontology)',
        '정규표현식 (Regular Expression)',
        '맥스 풀링 (Max Pooling)',
        '배치 정규화 (Batch Normalization)'
      ],
      answerIndex: 0,
      explanation: '온톨로지(Ontology)는 분류 체계(Taxonomy)뿐만 아니라 개체 간 관계(Object Property), 속성(Data Property), 논리적 제약 공리(Axiom)를 포함하여 기계가 의미론적 추론을 할 수 있게 만드는 지식 모델입니다.'
    }
  },
  {
    id: 'p3-knowledge-graph',
    chapter: 3,
    sectionCode: '3.2',
    layer: 'L3',
    difficulty: 'intermediate',
    roles: ['app-be', 'data-ontology'],
    term: '지식 그래프 (Knowledge Graph: RDF/OWL vs Property Graph)',
    analogy: '온톨로지가 도시 건축 법규와 설계 도면(스키마)이라면, 지식 그래프는 그 도면에 따라 실제 건물과 도로, 사람들을 촘촘한 그물망(노드와 엣지)으로 지어 올린 살아있는 정보 도시입니다.',
    definition: '지식 그래프는 세상의 개체(Entity)들을 점(Node)으로, 개체 사이의 관계를 선(Edge)으로 연결해 저장한 그래프 데이터베이스 구조입니다. 크게 W3C 웹 표준 및 엄밀한 논리 추론에 강점이 있는 RDF 트리플(Subject-Predicate-Object) 방식과, 노드와 간선 자체에 다양한 키-값 속성(Property)을 붙여 실무 검색과 분석 속도를 높인 속성 그래프(Property Graph, 예: Neo4j, BigQuery Graph) 두 가지 진영이 있습니다.',
    deepNote: '실무 포인트: 학술 데이터 연계나 복잡한 자동 논리 추론(OWL Reasoner)이 목적이면 RDF/SPARQL을 선택하고, 사내 서비스의 빠른 다중 홉(Multi-hop) 경로 탐색과 GraphRAG 구축이 목적이면 Property Graph(Cypher / GQL)를 선택하는 것이 실무 정석입니다.',
    studyGuide: '1단계(입문): 점(Node/Vertex)과 선(Edge/Relationship)으로 이루어진 그래프 구조와 트리플(주어-술어-목적어) 개념을 익힙니다. → 2단계(초급): 관계형 DB(SQL JOIN)가 3~4단계 이상 연결된 인간관계·공급망 탐색에서 왜 느려지는지 그래프 탐색과 비교합니다. → 3단계(중급~심화): Cypher 또는 GQL(Graph Query Language)로 다중 홉 경로 질의를 작성하고 LLM과 연동합니다.',
    levels: {
      beginner: '입문 개념: 엑셀 표(관계형 DB)에 데이터를 넣으면 "A회사의 하청업체 B가 납품하는 부품 C를 쓰는 제품 D"를 찾을 때 여러 표를 복잡하게 합쳐야 하지만, 지식 그래프는 줄로 이어져 있어 한 번에 줄을 따라가며 찾습니다.',
      intermediate: '중급 원리: RDF는 모든 지식을 (주어, 술어, 목적어) 3원소 트리플로 표현하며 URI로 전 세계 고유 식별성을 보장합니다. 반면 레이블 속성 그래프(LPG)는 노드와 엣지 내부에 JSON처럼 가중치·날짜 등의 프로퍼티를 직접 저장합니다.',
      advanced: '심화 엔지니어링: 엔터프라이즈 환경에서는 기존 데이터 웨어하우스(예: BigQuery 테이블) 위에 별도 데이터 복제 없이 `CREATE PROPERTY GRAPH` DDL로 가상 그래프 뷰를 얹어 SQL과 GQL을 하이브리드로 질의하는 아키텍처가 각광받고 있습니다.'
    },
    keyTerms: [
      { term: '트리플 (Triple: S-P-O)', desc: '지식을 주어(Subject) - 술어/관계(Predicate) - 목적어(Object) 세 조각의 단위로 표현하는 기본 원자 구조' },
      { term: 'RDF & OWL', desc: '시맨틱 웹 표준 데이터 모델(RDF)과 그 위에서 정교한 온톨로지 논리 규칙을 기술하는 웹 온톨로지 언어(OWL)' },
      { term: '속성 그래프 (Property Graph)', desc: '노드(레이블)와 엣지(방향성 관계) 모두에 자유롭게 Key-Value 속성값을 부여할 수 있는 실무형 그래프 모델' },
      { term: 'SPARQL vs Cypher / GQL', desc: 'RDF 트리플 저장소를 검색하는 표준 질의어(SPARQL)와 속성 그래프를 패턴 매칭으로 탐색하는 질의어(Cypher/ISO GQL)' }
    ],
    relatedTools: ['Neo4j (Cypher)', 'BigQuery Property Graph (GQL)', 'Apache Jena / RDFLib'],
    dateAdded: '2026-10-19',
    processSteps: [
      { title: '1단계: 비정형·정형 원천 데이터 수집', desc: '사내 RDB 테이블, 기술 문서, 계약서 PDF에서 핵심 명사(개체)와 동사(관계) 후보를 수집합니다.', nodes: ['RDB 테이블 & 문서', '온톨로지 스키마 로드', '개체명 인식(NER)', '관계 추출(RE)'] },
      { title: '2단계: 개체 정합성 해소 (Entity Resolution)', desc: '"삼성전자", "Samsung Electronics", "SEC"처럼 다르게 적힌 동일 실체를 하나의 표준 노드로 통합합니다.', nodes: ['동의어·별칭 매핑', '중복 노드 병합', '고유 URI / ID 부여', '데이터 무결성 확보'] },
      { title: '3단계: 그래프 적재 (Nodes & Edges)', desc: '정제된 트리플 및 속성 데이터를 그래프 DB에 적재하여 다차원 지식 연결망을 형성합니다.', nodes: ['노드(Node) 생성', '방향성 엣지(Edge) 연결', '가중치·타임스탬프 부착', '인덱스 생성 완료'] },
      { title: '4단계: 다중 홉(Multi-hop) 추론 질의', desc: '단순 키워드 검색으로 찾을 수 없는 3~5단계 건너편의 숨은 파급효과와 인과 경로를 즉시 추적합니다.', nodes: ['패턴 매칭 쿼리 실행', '3-Hop 공급망 파급 추적', '서브그래프 추출', '시각화 및 에이전트 전달'] }
    ],
    labConfig: {
      paramLabel: '그래프 데이터 모델 및 질의 방식 선택',
      paramType: 'select',
      options: [
        'Property Graph (Cypher / GQL 패턴 매칭 · 실무 서비스 및 GraphRAG 표준)',
        'RDF Triple + OWL (SPARQL 질의 · 표준 온톨로지 추론 및 오픈데이터 연계)'
      ],
      defaultParam: 'Property Graph (Cypher / GQL 패턴 매칭 · 실무 서비스 및 GraphRAG 표준)',
      codeLang: 'Cypher / GQL · 다중 홉(Multi-hop) 지식 그래프 탐색 쿼리 예제',
      starterCode: `// 특정 핵심 부품(Chip_A) 공급 지연 시 영향을 받는 최종 AI 서비스와 담당 부서를 3-Hop으로 추적
MATCH (part:Component {name: "HBM3E_Chip"})
      -[:SUPPLIED_TO]->(server:Hardware)
      -[:HOSTS_MODEL]->(model:AIModel)
      -[:POWERS_SERVICE]->(service:Product)
RETURN part.name AS 부품, model.name AS 영향받는모델, service.ownerTeam AS 긴급알림부서`,
      runOutput: `[실행 결과 · 3-Hop Knowledge Graph Traversal (Latency: 4.2ms)]
1. 부품: HBM3E_Chip -> 영향받는모델: Muse-Spark-816B -> 긴급알림부서: 코어인프라팀
2. 부품: HBM3E_Chip -> 영향받는모델: Nemotron-3.5-VL -> 긴급알림부서: 비전에이전트팀
-> 일반 문서 검색(Vector Search)으로는 4개 문서에 흩어져 있어 못 찾던 연쇄 영향을 단 한 줄로 찾아냅니다.`
    },
    quiz: {
      question: '"(제미나이 4) — [개발사] → (구글 딥마인드)"처럼 지식을 주어(Subject), 술어/관계(Predicate), 목적어(Object) 세 가지 요소의 연결 단위로 표현하는 기본 구조를 무엇이라 부르나요?',
      options: [
        '트리플 (Triple)',
        '체크포인트 (Checkpoint)',
        '컨볼루션 커널 (Convolution Kernel)',
        '토큰 온도 (Temperature)'
      ],
      answerIndex: 0,
      explanation: '주어(Subject)-술어(Predicate)-목적어(Object) 또는 시작 노드-관계 엣지-끝 노드의 3요소로 지식을 표현하는 기본 단위를 트리플(Triple)이라고 합니다.'
    }
  },
  {
    id: 'p3-graphrag-embedding',
    chapter: 3,
    sectionCode: '3.3',
    layer: 'L3',
    difficulty: 'advanced',
    roles: ['pm', 'app-be', 'data-ontology'],
    term: '임베딩 벡터 검색의 한계와 하이브리드 GraphRAG 아키텍처',
    analogy: '일반 벡터 RAG가 책의 문단들을 낱장으로 찢어 비슷한 단어가 들어간 쪽지만 뽑아오는 것이라면, GraphRAG는 책 전체의 인물 관계도와 목차 지도(온톨로지 지식 그래프)를 함께 보고 입체적으로 답하는 방식입니다.',
    definition: '초기 RAG(검색증강생성)는 문서를 일정 길이(Chunk)로 잘라 임베딩 벡터로 바꾼 뒤 코사인 유사도로 비슷한 조각만 찾아 LLM에 넣어주었습니다. 하지만 이 방식은 여러 문서에 흩어진 사실을 연결하는 다중 홉(Multi-hop) 질문이나 "전체 데이터의 핵심 트렌드를 요약해 줘" 같은 전역적(Global) 질문에 취약합니다. GraphRAG는 온톨로지 기반 지식 그래프와 벡터 검색을 결합해 의미적 유사성과 구조적 관계망을 동시에 검색하는 차세대 지식 아키텍처입니다.',
    deepNote: '실무 포인트: 현업에서 가장 성능이 좋은 검색 파이프라인은 단일 기술이 아니라 "키워드 검색(BM25) + 의미 벡터 검색(Dense Embedding) + 온톨로지 그래프 탐색(Graph Traversal) + 리랭커(Reranker)"를 결합한 하이브리드 GraphRAG입니다.',
    studyGuide: '1단계(입문): 왜 LLM에게 사내 문서를 바로 찾아 읽게 하는 RAG가 필요한지(최신성, 보안, 환각 방지) 이해합니다. → 2단계(초급): 텍스트 청킹(Chunking), 임베딩 모델, 벡터 DB(코사인 유사도)로 기본 Naive RAG를 만들어 봅니다. → 3단계(중급~심화): 기본 RAG가 실패하는 다중 연결 질문을 확인하고, 온톨로지 지식 그래프를 결합한 하이브리드 GraphRAG로 고도화합니다.',
    levels: {
      beginner: '입문 개념: 오픈북 시험을 치를 때 키워드 색인(벡터 검색)만 있으면 "이 소설에서 주인공과 가장 갈등이 깊어진 결정적 계기들의 연결고리는?" 같은 종합 문제를 못 풉니다. 인물·사건 관계도(Graph)가 함께 있어야 정확히 답할 수 있습니다.',
      intermediate: '중급 원리: 사용자 질문이 들어오면 먼저 임베딩 벡터 유사도로 시작 노드(Anchor Node)들을 찾은 뒤, 지식 그래프를 따라 1~2홉(Hop) 연결된 이웃 노드와 커뮤니티 요약본을 함께 수집해 LLM 프롬프트 컨텍스트를 구성합니다.',
      advanced: '심화 엔지니어링: 비정형 문서에서 LLM으로 그래프를 무작정 추출하면 노이즈가 심하고 비용이 많이 듭니다. 반드시 사전에 정의된 도메인 온톨로지(허용된 Entity/Relation 타입)를 제약 조건으로 걸어 스키마 기반 지식 그래프를 구축해야 품질과 비용을 모두 잡을 수 있습니다.'
    },
    keyTerms: [
      { term: 'RAG (검색증강생성)', desc: 'LLM이 학습하지 않은 외부·최신 지식을 실시간으로 검색해 프롬프트에 참고자료로 넣어주어 환각을 줄이는 기법' },
      { term: '청킹 (Chunking)과 임베딩', desc: '긴 문서를 검색하기 좋은 문단 단위로 자르는 작업(Chunking)과 이를 고차원 의미 벡터로 변환하는 과정(Embedding)' },
      { term: 'GraphRAG', desc: '벡터 유사도 검색에 온톨로지·지식 그래프의 관계망 탐색 및 커뮤니티 계층 요약을 결합한 고차원 RAG 아키텍처' },
      { term: '하이브리드 검색 & 리랭킹 (Reranking)', desc: '키워드(BM25)+벡터+그래프 검색 결과를 합친 뒤 교차 인코더(Cross-Encoder)로 질문과의 적합도를 정밀 재정렬하는 기법' }
    ],
    relatedTools: ['Microsoft GraphRAG', 'Neo4j GraphRAG Python', 'Qdrant / Milvus (벡터 DB)', 'BigQuery VECTOR_SEARCH + GRAPH_TABLE'],
    dateAdded: '2026-10-19',
    processSteps: [
      { title: '1단계: 온톨로지 가이드 지식 추출', desc: '문서를 청크로 분할해 임베딩 벡터를 생성함과 동시에, 온톨로지 스키마에 맞춰 핵심 개체와 관계를 추출합니다.', nodes: ['문서 의미 단위 청킹', 'Dense 임베딩 벡터화', '온톨로지 기반 개체 추출', '벡터 + 그래프 이중 색인'] },
      { title: '2단계: 하이브리드 앵커 탐색', desc: '사용자 질문에 대해 벡터 검색(유사 문단)과 키워드 검색으로 출발점이 될 핵심 개체(Anchor Node)를 찾습니다.', nodes: ['질문 의도 분석', '벡터 코사인 유사도 검색', 'BM25 키워드 매칭', '출발 앵커 노드 특정'] },
      { title: '3단계: 지식 그래프 서브그래프 확장', desc: '찾아낸 앵커 노드로부터 온톨로지 관계선을 따라 1~2홉 연결된 인과관계·규정·상하위 노드를 함께 가져옵니다.', nodes: ['1~2 Hop 관계선 탐색', '연결된 규정·계약 조항 수집', '커뮤니티 요약 결합', '리랭커 정밀 재정렬'] },
      { title: '4단계: 근거 기반 추론 응답 생성', desc: '문단 원문과 구조화된 관계 경로(Subgraph)를 함께 LLM에 전달해 출처가 명확한 무환각 답변을 생성합니다.', nodes: ['원문 + 관계 경로 주입', '다단계 논리 추론', '출처 노드 ID 명시', '정확도 99% 응답 반환'] }
    ],
    labConfig: {
      paramLabel: '검색 아키텍처 방식 비교 실험',
      paramType: 'select',
      options: [
        '하이브리드 GraphRAG (벡터 검색 + 온톨로지 그래프 2-Hop 확장)',
        '단순 벡터 RAG (Naive Vector Search · 단일 문단 유사도만 조회)'
      ],
      defaultParam: '하이브리드 GraphRAG (벡터 검색 + 온톨로지 그래프 2-Hop 확장)',
      codeLang: 'Python · 벡터 앵커 검색 후 온톨로지 서브그래프를 결합하는 GraphRAG 파이프라인',
      starterCode: `# 하이브리드 GraphRAG 컨텍스트 조합 핵심 로직
def retrieve_hybrid_graphrag(query, vector_db, knowledge_graph):
    # 1. 벡터 유사도로 시작 문단 및 핵심 개체(Anchor Entity) 검색
    anchor_chunks = vector_db.similarity_search(query, top_k=3)
    entity_ids = [c.entity_id for c in anchor_chunks]
    
    # 2. 온톨로지 지식 그래프에서 연결된 2-Hop 관계망(규정, 상위개념, 연관부서) 확장
    subgraph_triples = knowledge_graph.expand_neighbors(entity_ids, max_hops=2)
    return {"text_Passages": anchor_chunks, "ontology_paths": subgraph_triples}

print("Executing Hybrid Vector + Ontology Graph Expansion...")`,
      runOutput: `[실행 결과 · Naive Vector RAG vs Hybrid GraphRAG Benchmark]
질문: "A프로젝트 보안 등급 변경 시 영향을 받는 외부 협력사 계약 조항과 승인권자는?"
- 단순 벡터 RAG: A프로젝트 소개 문단만 가져와 협력사 계약 조항 연결 실패 (부분 환각 발생)
- 하이브리드 GraphRAG: [A프로젝트] -> (파트너십) -> [B협력사] -> (적용규정) -> [보안특약 4조] -> (승인권자) -> [CISO] 경로를 완벽히 복원하여 100% 정확한 답변 생성!`
    },
    quiz: {
      question: '문서를 단순히 조각내어 벡터 유사도로만 검색하는 기존 RAG가 "여러 문서에 걸쳐 연결된 인과관계"를 잘 찾지 못하는 한계를 극복하기 위해, 온톨로지 및 지식 그래프 탐색을 결합한 아키텍처는 무엇인가요?',
      options: [
        'GraphRAG (그래프 검색증강생성)',
        '단순 온도 높이기 (High Temperature Sampling)',
        '이미지 회전 증강 (Image Rotation Augmentation)',
        '토큰 무작위 삭제 (Token Masking)'
      ],
      answerIndex: 0,
      explanation: 'GraphRAG는 벡터 임베딩의 의미 유사도 검색과 온톨로지/지식 그래프의 구조적 관계 탐색(Multi-hop Traversal)을 결합하여 복합 추론 질문에서 압도적인 정확도를 제공합니다.'
    }
  }
);
