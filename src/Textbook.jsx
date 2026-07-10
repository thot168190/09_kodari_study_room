import React, { useState } from 'react';
import './Textbook.css';
import { BookOpen, Calendar, ArrowRight, Sparkles, AlertCircle, Play, FileText, ChevronRight, ExternalLink } from 'lucide-react';

const TEXTBOOK_DATA = [
  {
    id: "ep8-pj-aceturo",
    episode: "EP.08",
    date: "2026-07-10",
    title: "PJ 아세투로 (Genre AI) — 원가 붕괴 차익거래",
    desc: "20년 다큐 감독이 Veo3로 광고 제작비를 99% 무너뜨렸다. 2,000달러 Kalshi 광고로 5,000만 뷰를 모으고 대기업들의 러브콜을 이끌어 낸 비결.",
    url: "https://www.aicitybuilders.com/ep8/?v=1783640588461",
    videoUrl: "https://www.youtube.com/watch?v=8dAzwj9M55s",
    keywords: ["원가 붕괴 차익거래", "안목의 가치", "Weird(이상함)의 힘", "결과물 영업"],
    summary: `전통적인 광고 제작 원가는 수십만 달러(수억 원)에 달합니다. PJ 아세투로는 이 원가를 Veo3 등의 AI 도구를 활용해 단 $2,000 수준으로 99% 무너뜨렸습니다. 
하지만 대기업들이 지불하고자 하는 광고 단가는 여전히 높았기에, 그 틈에서 발생하는 압도적인 마진(90% 이상)을 수취하는 '원가 붕괴 차익거래' 모델을 구축했습니다.
도구가 공짜가 되고 코딩이나 비디오 생성이 보편화될수록 역설적으로 '무엇을 만들지 아는 감독의 안목'과 대중의 스크롤을 멈추게 하는 '괴상함(Weird)'이 강력한 해자가 됩니다.`,
    curriculum: [
      { step: "원가 붕괴 차익거래", detail: "만드는 값은 99% 무너뜨리고 파는 값(브랜드 예산)은 지키는 틈새 마진 공식" },
      { step: "20년 다큐 감독의 안목", detail: "실행이 무료화될 때, 무엇을 선택하고 버릴지 아는 판단 가치의 극대화" },
      { step: "예쁨보다 화제성 (Weird)", detail: "완벽하게 예쁜 영상보다 0.1초 멈추게 하는 괴상한 훅이 바이럴을 만듦" },
      { step: "실적이 곧 영업", detail: "Kalshi 광고 5,000만 뷰 바이럴 실적 하나가 세일즈덱을 대신하여 Oracle, Popeyes를 유치" },
      { step: "나를 무디게 하는 계약 거절", detail: "의사결정이 느리고 자율성이 훼손되는 슈퍼볼 광고를 거절해 소규모 에이전시의 강점 고수" }
    ]
  },
  {
    id: "ep7-maor-shlomo",
    episode: "EP.07",
    date: "2026-07-07",
    title: "마오르 슐로모 (Base44) — 1,250억 엑싯의 기술",
    desc: "투자 0원, 직원 0명으로 개발한 이메일 전달 인프라 Base44를 단 6개월 만에 거대 공룡 플랫폼 Wix에 약 1,250억 원을 받고 매각한 극강의 엑싯 전략.",
    url: "https://www.youtube.com/watch?v=Qy1FjV-N8dE",
    videoUrl: "https://www.youtube.com/watch?v=Qy1FjV-N8dE",
    keywords: ["Wix 인수", "부트스트래핑", "1,250억 엑싯", "1인 개발"],
    summary: `마오르 슐로모는 거대한 팀을 꾸리는 대신 이메일 딜리버리 인프라의 핵심 니치 영역을 홀로 빌딩했습니다. 
자본 유치 없이 온전히 본인의 기술로 부트스트래핑(자립창업)하여 최적의 타이밍에 전략적 파트너인 Wix와의 협상 테이블에 올라가 성공적인 거액 매각을 달성했습니다.`,
    curriculum: [
      { step: "핵심 니치 인프라 정의", detail: "대중적인 앱 대신 모든 SaaS가 필수로 쓸 수밖에 없는 백엔드 이메일 전달 핵심 기술 점유" },
      { step: "부트스트랩의 독립성", detail: "VC 투자를 받지 않아 온전히 지분 100%를 지키며 매각 대금을 독점하는 구조 확립" },
      { step: "M&A 협상력 극대화", detail: "거대 플랫폼의 가려운 곳(필수 연동 기술)을 찔러 전략적 인수를 유도하는 구조" }
    ]
  },
  {
    id: "ep6-jack-yadegar",
    episode: "EP.06",
    date: "2026-07-03",
    title: "잭 야데가리 (Cal AI) — 유통의 경제학과 마찰 제로",
    desc: "17세에 창업하여 단 18개월 만에 칼로리 추적 앱 Cal AI를 550억 원에 매각한 잭 야데가리의 유통 퍼널과 인플루언서 지분 분배 치트키 공식.",
    url: "https://www.youtube.com/watch?v=NTsQF8PUdvM",
    videoUrl: "https://www.youtube.com/watch?v=NTsQF8PUdvM",
    keywords: ["550억 매각", "Cal AI", "인플루언서 마케팅", "유통의 힘"],
    summary: `Cal AI는 사진을 찍으면 칼로리를 바로 알려주는 심플한 앱입니다. 기술적 격차보다는 '유통'에 집중했습니다. 
틱톡/릴스의 10대 스타 크리에이터들에게 현금 대신 회사 지분을 나누어 주며 자발적 바이럴을 극대화했고, 사용자가 설치한 뒤 3초 안에 핵심 가치를 체감하도록 마찰을 제로화했습니다.`,
    curriculum: [
      { step: "관심의 차익거래", detail: "기존의 값비싼 페이스북 광고비 대신, 숏폼 크리에이터의 유기적 트래픽을 지분과 맞교환" },
      { step: "3초 온보딩 마찰 최소화", detail: "로그인, 설명 없이 즉시 사진만 찍으면 기능이 동작하도록 만들어 이탈률 방어" },
      { step: "공룡 기업으로의 엑싯", detail: "MyFitnessPal과 같은 거대 선두 주자의 핵심 위협 요인이 되어 M&A를 성사시킴" }
    ]
  },
  {
    id: "ep5-tony-dinh",
    episode: "EP.05",
    date: "2026-06-30",
    title: "토니 딘 (TypingMind) — 원가 0원의 B2B 설계",
    desc: "서버 비용 및 AI API 호출 비용을 0원으로 설계해, 사용자들에게 Bring Your Own Key(BYOK) 모델을 각인시킴으로써 월 2억 원 이상의 순수익을 달성한 비결.",
    url: "https://www.youtube.com/watch?v=jy4K3JcbmdI",
    videoUrl: "https://www.youtube.com/watch?v=jy4K3JcbmdI",
    keywords: ["원가 0원", "BYOK 모델", "TypingMind", "1인 개발자"],
    summary: `토니 딘은 사용자가 본인의 OpenAI API Key를 직접 입력해서 쓰게 하는 'BYOK' 구조의 TypingMind를 출시했습니다. 
이를 통해 AI 서비스의 고질적 한계인 '서버 및 토큰 비용 폭증' 리스크를 100% 고객에게 위임하여, 1회성 소장 판매 모델만으로 한계 비용이 0원에 수렴하는 최강의 캐시카우를 구축했습니다.`,
    curriculum: [
      { step: "BYOK (Bring Your Own Key)", detail: "사용자 본인의 API 키를 쓰게 만들어 백엔드 API 호스팅 비용을 0원으로 회피" },
      { step: "유려한 UX 래핑", detail: "기존 ChatGPT의 딱딱한 UI 대신, 독창적인 폴더 구조 및 프롬프트 라이브러리로 차별화" },
      { step: "1회성 고단가 결제", detail: "정기 구독 피로도를 느끼는 유저들에게 1회성 라이프타임 라이선스를 판매해 빠른 자금 조달" }
    ]
  },
  {
    id: "ep4-sahil-lavingia",
    episode: "EP.04",
    date: "2026-06-25",
    title: "사힐 라빙가 (Gumroad) — 미니멀리스트 창업론",
    desc: "대규모 VC 투자를 포기하고, 정직원 1명만을 둔 채 연 매출 300억 원의 크리에이터 플랫폼 Gumroad를 정밀 흑자 구조로 부트스트래핑한 경영 철학.",
    url: "https://www.youtube.com/watch?v=D_1aZ8oSAxY",
    videoUrl: "https://www.youtube.com/watch?v=D_1aZ8oSAxY",
    keywords: ["미니멀 창업", "Gumroad", "부트스트래핑", "순이익 극대화"],
    summary: `사힐 라빙가는 유니콘이 되기 위해 수백 명의 직원을 채용했으나 실패한 후, 회사를 다운사이징하여 '미니멀리스트 1인 경영 구조'로 재정립했습니다. 
대부분의 업무를 외주 and 자동화 시스템에 위임하고, 크리에이터들의 디지털 에셋 판매라는 코어 수수료 비즈니스에만 집중하여 초고수익 알짜 기업을 완성했습니다.`,
    curriculum: [
      { step: "미니멀리스트 조직 설계", detail: "정직원을 극소화하고 전 세계 프리랜서 풀과 자동화 시스템으로 연 300억 파이프라인 관리" },
      { step: "고객 성공 얼라인", detail: "고객이 돈을 벌어야 나도 수수료를 떼어가는 완벽한 윈-윈 비즈니스 모델 고수" },
      { step: "유니콘 집착 탈피", detail: "눈먼 외형 성장보다 매월 통장에 꽂히는 진짜 순이익과 현금 흐름을 최우선하는 관점" }
    ]
  },
  {
    id: "ep1-pieter-levels",
    episode: "EP.01",
    date: "2026-06-16",
    title: "피터 레벨스 (Photo AI) — 113개를 만들어 속도로 이기는 법",
    desc: "직원 0명, 사무실 0원으로 연 매출 40억 원 이상을 달성한 피터 레벨스의 다작 전략과 99% 마진의 비밀. ReRoom AI를 빌드하기 위한 기초 설계서.",
    url: "https://www.aicitybuilders.com/review/",
    videoUrl: "https://www.youtube.com/watch?v=dKgzepcAvE0&t=28s",
    keywords: ["다작 전략", "공개 빌드", "원가 구조 해부", "ReRoom AI"],
    summary: `피터 레벨스는 Photo AI, Nomad List 등 113개의 프로젝트를 홀로 개발하며 '속도와 다작'의 경영학을 실천했습니다. 이 중 단 9개(8%)만 성공했음에도 월 4억 원 이상의 안정적인 순수익을 달성했습니다.
완벽한 구조보다 며칠 만에 출시해 반응을 보는 속도를 최우선으로 삼았고, 모든 개발 과정을 투명하게 SNS에 공유하는 'Build in Public'으로 광고비 0원의 마케팅을 실현했습니다.
비즈니스 시작 단계의 변동비(API)와 규모 확장 단계의 고정비(자체 GPU) 간의 비용 구조 및 손익분기점을 철저하게 계산하여 순이익률을 99%까지 극대화하는 성장의 사다리 모델을 구축했습니다.`,
    curriculum: [
      { step: "속도와 다작의 경영학", detail: "113번 시도해 9번 성공(성공률 8%)으로 대박을 내는 기대값과 확률의 수학적 설계" },
      { step: "Build in Public (공개 창업)", detail: "코딩, 장애, 매출까지 전 과정을 실시간 공개하여 광고비 0원으로 수백만 명에게 도달하는 마케팅" },
      { step: "기술의 재포장 (Wrapper)", detail: "OpenAI 등 복잡한 API를 대중이 쓰기 편한 UI/UX로 감싸 버튼 하나로 해결하는 제품 설계" },
      { step: "고정비 vs 변동비 설계", detail: "시작은 API 종량제(변동비)로 리스크를 없애고, 월 4,400장 초과 시 자체 GPU 서버(고정비)로 전환해 마진 극대화" },
      { step: "ReRoom AI 실전 실습", detail: "1인 2회 제한 및 BYOK(API 키 등록) 안전장치를 둔 AI 인테리어 디자인 웹서비스를 안티그래비티로 빌드하고 배포" }
    ]
  }
];

function Textbook() {
  const [selectedEp, setSelectedEp] = useState(TEXTBOOK_DATA[0]);

  return (
    <div className="textbook-container">
      {/* 🚀 상단 헤더 배너 */}
      <header className="tb-hero">
        <div className="tb-hero-badge">📚 모닝AI 지식 교재창고</div>
        <h1 className="tb-hero-title">
          날짜별 <span className="highlight-text">AI 1인 기업 해부</span> 공식 교재 모음집
        </h1>
        <p className="tb-hero-sub">
          대표님께서 아침마다 학습하시는 CONNECT AI LAB의 공식 교안과 분석 자료를 날짜별로 누적 보관합니다. 
          원하는 회차를 선택해 핵심 전략을 꼼꼼하게 복습해 보십시오.
        </p>
      </header>

      <div className="tb-layout">
        {/* 📂 왼쪽: 날짜별 교재 리스트 */}
        <aside className="tb-sidebar">
          <div className="sidebar-title">📅 해부 교안 아카이브</div>
          <div className="tb-list">
            {TEXTBOOK_DATA.map((ep) => (
              <div 
                key={ep.id}
                className={`tb-item ${selectedEp.id === ep.id ? 'active' : ''}`}
                onClick={() => setSelectedEp(ep)}
              >
                <div className="tb-item-header">
                  <span className="tb-badge">{ep.episode}</span>
                  <span className="tb-date"><Calendar size={12} style={{ marginRight: 4 }} />{ep.date}</span>
                </div>
                <div className="tb-item-title">{ep.title}</div>
              </div>
            ))}
          </div>
        </aside>

        {/* 🖥️ 오른쪽: 교재 내용 상세 뷰어 */}
        <main className="tb-viewer">
          <div className="tb-card">
            <div className="tb-card-header">
              <div className="tb-card-badge">{selectedEp.episode} 공식 분석 교재</div>
              <h2 className="tb-card-title">{selectedEp.title}</h2>
              <div className="tb-card-meta">
                <span>🗓️ 배포일자: {selectedEp.date}</span>
                <span className="divider">|</span>
                <span>
                  <a href={selectedEp.url} target="_blank" rel="noopener noreferrer" className="tb-link">
                    공식 랜딩 교안 보기 ↗
                  </a>
                </span>
                {selectedEp.videoUrl && (
                  <>
                    <span className="divider">|</span>
                    <span>
                      <a href={selectedEp.videoUrl} target="_blank" rel="noopener noreferrer" className="tb-link-video">
                        유튜브 강의 시청 ▶
                      </a>
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="tb-keywords">
              {selectedEp.keywords.map((kw, i) => (
                <span key={i} className="kw-badge"># {kw}</span>
              ))}
            </div>

            <div className="tb-section">
              <h3>📋 핵심 요약 브리핑</h3>
              <p className="tb-summary-text">{selectedEp.summary}</p>
            </div>

            <div className="tb-section">
              <h3>🧠 1인 기업 뼈대 설계안 (Curriculum)</h3>
              <div className="tb-steps">
                {selectedEp.curriculum.map((item, idx) => (
                  <div key={idx} className="tb-step-row">
                    <div className="tb-step-num">0{idx + 1}</div>
                    <div className="tb-step-info">
                      <h4>{item.step}</h4>
                      <p>{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 하단 격려 팁 */}
            <div className="tb-alert-box">
              <Sparkles className="icon-spark" size={16} />
              <span>
                <strong>코다리 부장의 조언:</strong> 대표님, 이 에피소드의 비즈니스 구조를 대표님의 1인 기업 파이프라인에 이식하고 싶으시다면, 요약 탭에서 AI 브리핑을 작동하시거나 Q&A로 물어봐 주십시오! 🫡
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Textbook;
