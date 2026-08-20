import json

all_episodes = [
    {
        "id": "ep18",
        "episode": "EP.18",
        "date": "2026-07-28",
        "title": "마크 루 · 데이먼 첸 — 30개를 만들어 5개로 먹고산다",
        "desc": "마크 루는 제품 30개 중 5개로 매출 대부분을 만든다. 데이먼 첸은 매출 0원짜리를 3,900만 원에 사서 연 19.5억으로 키웠다. 검증된 제품별 매출을 그대로 열어보고, 살아남는 서비스의 조건을 정리한 슬라이드 교재.",
        "url": "https://www.aicitybuilders.com/ep18",
        "keywords": ["마크 루", "데이먼 첸", "다작 전략", "Micro SaaS", "매출 산수"],
        "summary": "마크 루는 30개의 마이크로 제품을 만들어 그중 상위 5개(ShipFast, ByeByeBye 등)로 월 1.5억 원의 순수익을 달성했습니다. 데이먼 첸은 매출 0원이었던 소형 툴을 3,900만 원에 인수하여 연 19.5억 원 마이크로 제국으로 키워냈습니다.",
        "curriculum": [
            {"step": "다작과 확률의 산수", "detail": "30개 중 5개(16%)만 성공해도 전체 사업을 지탱하는 기대값 구조"},
            {"step": "매출 0원 툴 헐값 인수", "detail": "개발보다 유통/마케팅에 강점이 있다면 실패한 툴을 매수해 스케일업"},
            {"step": "ShipFast 템플릿 모델", "detail": "내가 개발할 때 반복해서 쓰는 템플릿 자체를 고단가 B2B 에셋으로 판매"},
            {"step": "생존 서비스 3대 조건", "detail": "명확한 유통 채널, 마찰 제로 온보딩, 강력한 현금 흐름 마진"}
        ]
    },
    {
        "id": "ep17",
        "episode": "EP.17",
        "date": "2026-07-25",
        "title": "지금 돈 버는 AI 서비스 4가지 해부 (Postiz, Chatbase, 물리치료, Bannerbear)",
        "desc": "직원 없이 혼자서 매달 수억을 버는 AI 1인 기업 서비스 4가지 — Postiz, Chatbase, 물리치료 사전승인 에이전트, Bannerbear.",
        "url": "https://www.aicitybuilders.com/ep17",
        "keywords": ["Postiz", "Chatbase", "Bannerbear", "RAG 에이전트", "수익 모델"],
        "summary": "Postiz(소셜 자동화), Chatbase(RAG 상담원), Bannerbear(이미지 공장 API), 물리치료 사전승인 에이전트 등 혼자서 매달 수천~수억 원의 순수익을 올리는 4대 핵심 AI 비즈니스 아키텍처를 해부합니다.",
        "curriculum": [
            {"step": "Postiz (에이전트 유통)", "detail": "소셜 미디어를 24시간 자율 관리하는 1인 마케팅 에이전트 파이프라인"},
            {"step": "Chatbase (RAG 챗봇)", "detail": "고객사 문서만 업로드하면 10초 만에 완성되는 맞춤형 AI 상담원 SaaS"},
            {"step": "Bannerbear (이미지 API)", "detail": "템플릿 하나로 수만 장의 브랜딩 이미지를 자동 렌더링하는 API 공장"},
            {"step": "물리치료 승인 에이전트", "detail": "가장 지루한 의료 행정 서류 파싱을 자동화하여 확실한 B2B 수익 창출"}
        ]
    },
    {
        "id": "ep16",
        "episode": "EP.16",
        "date": "2026-07-22",
        "title": "1인 유니콘의 탄생: Sam Altman이 이긴 내기 (Medvi & Base44)",
        "desc": "샘 올트먼은 AI 없이는 불가능했던 1인 10억 달러 기업 예언을 성공시켰습니다. 직원 2명·자본 2,600만 원으로 첫 해 5,200억을 만든 Medvi와 Base44 해부.",
        "url": "https://www.aicitybuilders.com/ep16",
        "keywords": ["Sam Altman", "1인 유니콘", "Medvi", "Base44", "레버리지"],
        "summary": "직원 2명으로 첫해 매출 5,200억 원을 기록한 Medvi와 6개월 만에 1,040억 원에 매각된 Base44 등, AI 에이전트 레버리지를 통해 1인 기업이 거대 유니콘 규모로 도약하는 패러다임 전환을 검증합니다.",
        "curriculum": [
            {"step": "샘 올트먼의 1인 유니콘 예언", "detail": "AI 에이전트의 극단적 레버리지로 1인 1조 원 기업 시대 개막"},
            {"step": "Medvi의 극단적 인프라", "detail": "직원 2명이 수천 명 규모의 헬스케어 상담 및 파이프라인을 에이전트로 처리"},
            {"step": "핵심만 쥐고 전부 위임", "detail": "코어 전략만 인간이 통제하고 운영, 마케팅, CS는 AI 군단에 전권 위임"},
            {"step": "규제와 윤리적 안전장치", "detail": "초고속 성장 이면에 반드시 챙겨야 할 규제 킬스위치 및 보안 리스크"}
        ]
    },
    {
        "id": "ep15",
        "episode": "EP.15",
        "date": "2026-07-20",
        "title": "알리 압달: 구독자 665만인데 '이메일 50만이 더 낫다' (연매출 60억)",
        "desc": "구독자 665만 유튜버 알리 압달을 1,000 True Fans 이론과 이메일 ROI 데이터로 해부한다. 연매출 60억의 소유한 청중 모델.",
        "url": "https://www.aicitybuilders.com/ep15",
        "keywords": ["알리 압달", "소유한 청중", "이메일 마케팅", "1000 True Fans", "연매출 60억"],
        "summary": "알리 압달은 유튜브 알고리즘에 의존하는 대신, 50만 명의 이메일 뉴스레터 리스트를 직접 소유하여 연 60억 원 이상의 고단가 지식 커리큘럼 및 코호트 사업을 완성했습니다.",
        "curriculum": [
            {"step": "빌린 청중 vs 소유한 청중", "detail": "유튜브/인스타 구독자는 빌린 것, 이메일/카톡 리스트는 100% 소유한 자산"},
            {"step": "1,000 True Fans 공식", "detail": "나를 열렬히 지지하는 1,000명의 진성 팬만 있다면 1인 기업은 평생 안전함"},
            {"step": "고단가 지식 커리큘럼 회수", "detail": "무료 유튜브 영상으로 신뢰를 쌓고, 깊이 있는 프리미엄 패키지로 매출 회수"}
        ]
    },
    {
        "id": "ep14",
        "episode": "EP.14",
        "date": "2026-07-18",
        "title": "토마스 프랭크: 유튜브 광고 11%, 돈은 노션 템플릿에서 (연 14억)",
        "desc": "구독자 300만 유튜버 토마스 프랭크의 유튜브 광고 수익은 11%뿐. 나머지 89%는 노션 템플릿 하나에서 연 14억 원 달성.",
        "url": "https://www.aicitybuilders.com/ep14",
        "keywords": ["토마스 프랭크", "노션 템플릿", "디지털 에셋", "마진 90%", "크리에이터"],
        "summary": "토마스 프랭크는 300만 구독자의 유튜브를 순수 마케팅 채널로 사용하고, 실제로 연 14억 원의 현금은 단 하나의 고도화된 노션 템플릿(Ultimate Brain)을 판매하여 창출했습니다.",
        "curriculum": [
            {"step": "콘텐츠는 마케팅, 제품이 매출", "detail": "유튜브 조회수 수익에 연연하지 않고 내 고유 제품으로 트래픽 유도"},
            {"step": "디지털 에셋의 무한 복제", "detail": "한 번 정교하게 만든 노션 템플릿/시스템은 서버 비용 0원으로 무한 판매"},
            {"step": "복잡성을 해소하는 큐레이션", "detail": "기술 자체가 아닌 사용자의 삶을 체계화해 주는 유연한 UX 구조 판매"}
        ]
    },
    {
        "id": "ep13",
        "episode": "EP.13",
        "date": "2026-07-16",
        "title": "특집 · 해외 1인 기업가 11명의 공통점 4가지와 로드맵",
        "desc": "피터 레벨스부터 저스틴 웰시까지 — AI 1인 기업가 11명을 전부 해부하고 찾은 공통점 4가지: 콘텐츠·바이브코딩·자동화 에이전트·로컬 AI 원가.",
        "url": "https://www.aicitybuilders.com/ep13",
        "keywords": ["1인 기업 공통점", "바이브코딩", "로컬 AI", "자동화 에이전트", "로드맵"],
        "summary": "글로벌 AI 1인 기업가 11명의 핵심 공통점: ① 콘텐츠로 주목 유통 ② 바이브코딩으로 초고속 빌드 ③ 24시간 자율 에이전트 운영 ④ 로컬 AI로 API 원가 지배.",
        "curriculum": [
            {"step": "📣 콘텐츠 (주목이 곧 유통)", "detail": "Build in Public으로 개발과 동시에 광고비 0원 팬덤 확보"},
            {"step": "⚡ 바이브코딩 (직접 초고속 구현)", "detail": "외주 없이 AI 비서와 대화하며 며칠 만에 MVP 서비스 출품"},
            {"step": "🤖 자동화 에이전트 (24시간 무인)", "detail": "마케팅, CS, 정산을 에이전트 군단에 맡겨 내 시간을 90% 절감"},
            {"step": "💎 로컬 AI 원가 설계 (마진 극대화)", "detail": "API 비용 폭증을 로컬/오픈 LLM으로 방어해 순수익률 90% 사수"}
        ]
    },
    {
        "id": "ep12",
        "episode": "EP.12",
        "date": "2026-07-15",
        "title": "직원 0명인데 마진 90%? 해외 AI 1인 기업가들의 순수익 6가지 레버",
        "desc": "순수익을 높이는 6가지 레버(원가·가격·인건비·고정비·반복판매·유통)와 로컬 AI/오픈 LLM(Qwen3·DeepSeek)을 활용한 손익분기 해부.",
        "url": "https://www.aicitybuilders.com/ep12",
        "keywords": ["마진 90%", "원가 지배", "로컬 AI", "오픈 LLM", "손익분기점"],
        "summary": "매출이 아니라 마진이 진짜 실력입니다. 1인 기업가들이 순수익률 90%를 달성하는 6가지 레버 및 API 호출 비용을 0원으로 만드는 로컬 AI 하이브리드 아키텍처를 해부합니다.",
        "curriculum": [
            {"step": "매출 집착 탈피, 마진 사수", "detail": "겉보기 매출보다 내 통장에 실제로 남는 순현금 흐름을 최우선"},
            {"step": "원가의 지배 (Local AI)", "detail": "Qwen, Gemma 등 오픈 LLM을 로컬에서 구동해 API 고정비 98% 절감"},
            {"step": "6대 마진 극대화 레버", "detail": "원가 절감, 고단가 앵커링, 무인 자동화, 구독 반복 결제 등"}
        ]
    },
    {
        "id": "ep11",
        "episode": "EP.11",
        "date": "2026-07-14",
        "title": "저스틴 웰시 (Justin Welsh) — 코드·직원 0명으로 지식을 파는 법 (연 $4.15M)",
        "desc": "번아웃으로 회사를 나와 코드도 직원도 없이 자기 전문성만 팔아 연 $4.15M(마진 86%)을 번 저스틴 웰시. 지식을 파는 가장 순수한 1인 기업.",
        "url": "https://www.aicitybuilders.com/ep11",
        "keywords": ["저스틴 웰시", "지식 상품", "솔로프레너", "마진 86%", "LinkedIn"],
        "summary": "저스틴 웰시는 코딩 한 줄 없이 템플릿, PDF 지식 가이드, 미니 코스만을 활용해 LinkedIn과 X에서 연 50억 원 이상의 매출을 86%의 마진으로 올려냈습니다.",
        "curriculum": [
            {"step": "전문성의 상품화 (Operating System)", "detail": "내 지나온 시행착오와 체계화된 노하우를 디지털 가이드북으로 변환"},
            {"step": "매일 1개 시스템 포스팅", "detail": "가치 중심의 SNS 아티클을 매일 일정한 시간에 포스팅하여 팬덤 구축"},
            {"step": "단순성 유지 (No Staff, No VC)", "detail": "직원과 투자자 없이 온전히 내 삶의 주도권을 쥐는 1인 미니멀 경영"}
        ]
    },
    {
        "id": "ep10",
        "episode": "EP.10",
        "date": "2026-07-13",
        "title": "로완 청 (The Rundown AI) — 트위터 1,000명에서 250만 AI 뉴스레터 제국",
        "desc": "트위터 팔로워 1,000명으로 시작해 구독자 250만·연 매출 수십억의 AI 뉴스레터를 만든 로완 청. 골드러시에 곡괭이 대신 신문을 판 주목의 경제학.",
        "url": "https://www.aicitybuilders.com/ep10",
        "keywords": ["로완 청", "The Rundown AI", "뉴스레터", "Attention 경제", "스폰서십"],
        "summary": "AI 골드러시 시대에 직접 툴을 만드는 대신, 매일 쏟아지는 AI 뉴스를 5분 만에 읽게 큐레이션 해주는 뉴스레터를 만들어 250만 구독자와 기업 스폰서십 현금 흐름을 점유했습니다.",
        "curriculum": [
            {"step": "곡괭이 대신 신문을 팔라", "detail": "직접 경쟁하는 대신 판이 커질 때 정보를 정리해 주는 미디어 점유"},
            {"step": "매일 아침 5분 큐레이션", "detail": "바쁜 직장인/창업가를 위해 가장 핵심적인 AI 첩보만 엄선하여 전달"},
            {"step": "기업 B2B 스폰서십 결제", "detail": "구독자가 모이면 AI 스폰서 기업들로부터 고단가 배너 광고비 수취"}
        ]
    },
    {
        "id": "ep09",
        "episode": "EP.09",
        "date": "2026-07-12",
        "title": "라일리 브라운 (Vibecode) — 청중 150만 & 시드 $9.4M 바이브코딩",
        "desc": "코드 한 줄 없이 청중 150만·시드 $9.4M을 만든 라일리 브라운. 제품보다 청중을 먼저 소유하라 — 바이브코딩과 청중 우선(Audience-First).",
        "url": "https://www.aicitybuilders.com/ep09",
        "keywords": ["라일리 브라운", "Vibecode", "Audience-First", "바이브코딩", "숏폼 커뮤니티"],
        "summary": "라일리 브라운은 코드를 짜기 전에 숏폼 영상으로 150만 명의 바이브코더 청중을 먼저 모았습니다. 청중이 원하는 툴을 바이브코딩 앱빌더 Vibecode로 출시해 거액의 투자를 유치했습니다.",
        "curriculum": [
            {"step": "Audience-First (청중 우선)", "detail": "제품을 다 만들고 고객을 찾지 말고, 고객을 먼저 모으고 제품을 출시"},
            {"step": "바이브코딩 시연 영상 바이럴", "detail": "말 한마디로 앱이 완성되는 진풍경을 숏츠로 공개하여 폭발적 유입 유도"},
            {"step": "커뮤니티 중심 스케일업", "detail": "유저들이 서로 만든 앱을 자랑하고 공유하는 플랫폼 생태계 구축"}
        ]
    },
    {
        "id": "ep08",
        "episode": "EP.08",
        "date": "2026-07-10",
        "title": "PJ 아세투로 (Genre AI) — 원가 붕괴 차익거래",
        "desc": "20년 다큐 감독이 Veo3로 광고 제작비를 99% 무너뜨렸다. 2,000달러 Kalshi 광고로 5,000만 뷰를 모으고 대기업들의 러브콜을 이끌어 낸 비결.",
        "url": "https://www.aicitybuilders.com/ep8",
        "videoUrl": "https://www.youtube.com/watch?v=8dAzwj9M55s",
        "keywords": ["원가 붕괴 차익거래", "안목의 가치", "Weird(이상함)의 힘", "결과물 영업"],
        "summary": "전통적인 광고 제작 원가는 수억 원에 달하지만, PJ 아세투로는 Veo3 등의 AI 도구를 활용해 단 $2,000 수준으로 99% 무너뜨리고 90% 이상의 차익 마진을 수취했습니다.",
        "curriculum": [
            {"step": "원가 붕괴 차익거래", "detail": "만드는 값은 99% 무너뜨리고 파는 값은 지키는 틈새 마진 공식"},
            {"step": "20년 다큐 감독의 안목", "detail": "실행이 무료화될 때 무엇을 선택하고 버릴지 아는 판단 가치 극대화"},
            {"step": "예쁨보다 화제성 (Weird)", "detail": "완벽한 영상보다 0.1초 멈추게 하는 괴상한 훅이 바이럴을 만듦"}
        ]
    },
    {
        "id": "ep07",
        "episode": "EP.07",
        "date": "2026-07-07",
        "title": "마오르 슐로모 (Base44) — 1,250억 엑싯의 기술",
        "desc": "투자 0원, 직원 0명으로 개발한 이메일 전달 인프라 Base44를 단 6개월 만에 거대 공룡 플랫폼 Wix에 약 1,250억 원을 받고 매각한 극강의 엑싯 전략.",
        "url": "https://www.aicitybuilders.com/ep7",
        "videoUrl": "https://www.youtube.com/watch?v=Qy1FjV-N8dE",
        "keywords": ["Wix 인수", "부트스트래핑", "1,250억 엑싯", "1인 개발"],
        "summary": "마오르 슐로모는 자본 유치 없이 온전히 본인의 기술로 백엔드 이메일 인프라를 부트스트래핑하여, 전략적 파트너인 Wix에게 지분 100%를 보존한 채 성공적으로 거액 매각했습니다.",
        "curriculum": [
            {"step": "핵심 니치 인프라 정의", "detail": "모든 SaaS가 필수로 쓸 수밖에 없는 백엔드 필수 기술 점유"},
            {"step": "부트스트랩의 독립성", "detail": "VC 투자를 받지 않아 지분 100%를 지키며 매각 대금 독점"},
            {"step": "M&A 협상력 극대화", "detail": "거대 플랫폼의 가려운 곳을 찔러 전략적 인수를 유도하는 구조"}
        ]
    },
    {
        "id": "ep06",
        "episode": "EP.06",
        "date": "2026-07-03",
        "title": "잭 야데가리 (Cal AI) — 유통의 경제학과 마찰 제로",
        "desc": "17세에 창업하여 단 18개월 만에 칼로리 추적 앱 Cal AI를 550억 원에 매각한 잭 야데가리의 유통 퍼널과 인플루언서 지분 분배 치트키 공식.",
        "url": "https://www.aicitybuilders.com/ep6",
        "videoUrl": "https://www.youtube.com/watch?v=NTsQF8PUdvM",
        "keywords": ["550억 매각", "Cal AI", "인플루언서 마케팅", "유통의 힘"],
        "summary": "Cal AI는 사진을 찍으면 칼로리를 바로 알려주는 심플한 앱입니다. 숏폼 크리에이터들에게 회사 지분을 주며 바이럴을 만들고, 3초 안에 핵심 가치를 보여주는 온보딩을 완성했습니다.",
        "curriculum": [
            {"step": "관심의 차익거래", "detail": "광고비 대신 숏폼 크리에이터의 유기적 트래픽을 지분과 맞교환"},
            {"step": "3초 온보딩 마찰 최소화", "detail": "설명 없이 즉시 사진만 찍으면 기능이 동작하도록 만들어 이탈 방어"},
            {"step": "공룡 기업으로의 엑싯", "detail": "선두 주자의 핵심 위협 요인이 되어 M&A 성사"}
        ]
    },
    {
        "id": "ep05",
        "episode": "EP.05",
        "date": "2026-06-30",
        "title": "토니 딘 (TypingMind) — 원가 0원의 B2B 설계",
        "desc": "서버 비용 및 AI API 호출 비용을 0원으로 설계해, 사용자들에게 Bring Your Own Key(BYOK) 모델을 각인시킴으로써 월 2억 원 이상의 순수익을 달성한 비결.",
        "url": "https://www.aicitybuilders.com/ep5",
        "videoUrl": "https://www.youtube.com/watch?v=jy4K3JcbmdI",
        "keywords": ["원가 0원", "BYOK 모델", "TypingMind", "1인 개발자"],
        "summary": "토니 딘은 사용자가 본인의 OpenAI API Key를 직접 입력해서 쓰게 하는 BYOK 구조의 TypingMind를 출시해, 서버 및 토큰 비용 폭증 리스크를 100% 유저에게 위임하고 순수익을 극대화했습니다.",
        "curriculum": [
            {"step": "BYOK (Bring Your Own Key)", "detail": "사용자 본인의 API 키를 쓰게 만들어 백엔드 호스팅 비용 0원 회피"},
            {"step": "유려한 UX 래핑", "detail": "기존 UI 대신 독창적인 폴더 구조 및 프롬프트 라이브러리로 차별화"},
            {"step": "1회성 고단가 결제", "detail": "정기 구독 피로를 느끼는 유저들에게 라이프타임 라이선스 판매"}
        ]
    },
    {
        "id": "ep04",
        "episode": "EP.04",
        "date": "2026-06-25",
        "title": "사힐 라빙가 (Gumroad) — 미니멀리스트 창업론",
        "desc": "대규모 VC 투자를 포기하고, 정직원 1명만을 둔 채 연 매출 300억 원의 크리에이터 플랫폼 Gumroad를 정밀 흑자 구조로 부트스트래핑한 경영 철학.",
        "url": "https://www.aicitybuilders.com/ep4",
        "videoUrl": "https://www.youtube.com/watch?v=D_1aZ8oSAxY",
        "keywords": ["미니멀 창업", "Gumroad", "부트스트래핑", "순이익 극대화"],
        "summary": "사힐 라빙가는 회사를 다운사이징하여 미니멀리스트 1인 경영 구조로 재정립했습니다. 대부분의 업무를 외주/자동화에 위임하고 정밀 흑자 파이프라인을 완성했습니다.",
        "curriculum": [
            {"step": "미니멀리스트 조직 설계", "detail": "정직원을 극소화하고 프리랜서 풀과 자동화 시스템으로 관리"},
            {"step": "고객 성공 얼라인", "detail": "고객이 돈을 벌어야 나도 수수료를 떼어가는 완벽한 윈-윈 모델"},
            {"step": "유니콘 집착 탈피", "detail": "눈먼 외형 성장보다 매월 통장에 꽂히는 진짜 순이익 최우선"}
        ]
    },
    {
        "id": "ep03",
        "episode": "EP.03",
        "date": "2026-06-21",
        "title": "마크 루 (ShipFast) — 해고당해서 나를 고용했다 (16개 다작 월 1.5억)",
        "desc": "16개의 마이크로 프로젝트를 고속 빌드하여 월 1.5억 원의 순수익을 달성한 마크 루의 다작·유통 1인 창업 공식.",
        "url": "https://www.aicitybuilders.com/ep3",
        "keywords": ["마크 루", "ShipFast", "다작 연쇄 창업", "Build in Public"],
        "summary": "마크 루는 회사에서 해고당한 후 스스로를 고용하여 16개의 서비스를 며칠 단위로 연쇄 출품했습니다. 이 중 상위 몇 개의 서비스와 ShipFast 템플릿 판매로 월 1.5억 원을 창출했습니다.",
        "curriculum": [
            {"step": "초고속 연쇄 출품 (Ship)", "detail": "아이디어가 떠오르면 며칠 만에 만들어 반응을 테스트하는 속도"},
            {"step": "ShipFast 보일러플레이트", "detail": "반복되는 로그인, 결제, DB 구조를 템플릿화하여 1인 창업가에게 판매"},
            {"step": "트위터/스레드 바이럴", "detail": "매일 본인의 개발 과정과 매출 수치를 솔직히 공개하는 마케팅"}
        ]
    },
    {
        "id": "ep02",
        "episode": "EP.02",
        "date": "2026-06-18",
        "title": "대니 포스트마 (HeadshotPro) — 셀카 한 장으로 월 4억 SEO·AI 1인 창업",
        "desc": "셀카 한 장으로 프로필 사진을 만들어주는 HeadshotPro로 월 4억 원을 창출한 대니 포스트마의 프로덕트 헌트 & SEO 마케팅 해부.",
        "url": "https://www.aicitybuilders.com/ep2",
        "keywords": ["대니 포스트마", "HeadshotPro", "SEO 1등", "AI 프로필"],
        "summary": "대니 포스트마는 AI 프로필 사진 니즈를 포착하고, 랜딩페이지 1장과 강력한 SEO(검색엔진 최적화) 마케팅만으로 월 4억 원의 압도적인 현금 흐름을 만들어냈습니다.",
        "curriculum": [
            {"step": "SEO 키워드 깃발 꽂기", "detail": "구글 검색량이 폭발하는 니치 키워드를 먼저 선점하는 전략"},
            {"step": "단 하나의 명확한 가치제안", "detail": "사진 몇 장 업로드 시 1시간 내 100장의 스튜디오 프로필 렌더링"},
            {"step": "고단가 B2B 팀 플랜", "detail": "개인 유저뿐 아니라 기업 단위 팀 프로필 사진 단체 결제 유도"}
        ]
    },
    {
        "id": "ep01",
        "episode": "EP.01",
        "date": "2026-06-16",
        "title": "피터 레벨스 (Photo AI) — 113개를 만들어 속도로 이기는 법",
        "desc": "직원 0명, 사무실 0원으로 연 매출 40억 원 이상을 달성한 피터 레벨스의 다작 전략과 99% 마진의 비밀.",
        "url": "https://www.aicitybuilders.com/ep1",
        "videoUrl": "https://www.youtube.com/watch?v=dKgzepcAvE0&t=28s",
        "keywords": ["다작 전략", "공개 빌드", "원가 구조 해부", "ReRoom AI"],
        "summary": "피터 레벨스는 Photo AI, Nomad List 등 113개의 프로젝트를 홀로 개발하며 8%의 성공률만으로 연 40억 원 이상의 고순이익 1인 기업을 일궈냈습니다.",
        "curriculum": [
            {"step": "속도와 다작의 경영학", "detail": "113번 시도해 9번 성공으로 대박을 내는 기대값과 확률의 수학적 설계"},
            {"step": "Build in Public (공개 창업)", "detail": "코딩과 매출을 전 과정 실시간 공개하여 광고비 0원으로 수백만 명 도달"},
            {"step": "기술의 재포장 (Wrapper)", "detail": "복잡한 API를 대중이 쓰기 편한 UI/UX로 감싸 해결하는 제품 설계"}
        ]
    }
]

with open('/Users/mihyunlee/workspace/09_코다리_공부방/src/assets/textbook-data.json', 'w', encoding='utf-8') as f:
    json.dump(all_episodes, f, ensure_ascii=False, indent=2)

print('Successfully written', len(all_episodes), 'episodes to src/assets/textbook-data.json')
