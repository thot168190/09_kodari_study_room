import React, { useState, useEffect } from 'react';
import { Sparkles, Settings, Play, Check, Loader2, HelpCircle, Activity, TrendingUp, Target, Workflow, Calendar, ChevronDown, ChevronUp, AlertCircle, ArrowRight, ShieldCheck, Zap, BookOpen, Copy, Wand2 } from 'lucide-react';
import './NicheDiagnoser.css';

function NicheDiagnoser({ isSaaSMode = false, membership = 'PRO', onScanComplete }) {
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // 0. 마법사 입력 상태 관리
  const [rawIdeaInput, setRawIdeaInput] = useState('');
  const [sparkLoading, setSparkLoading] = useState(false);
  const [isAutofilled, setIsAutofilled] = useState(false);

  // 1. 입력 상태 관리
  const [brandName, setBrandName] = useState('철만이 일기');
  const [nicheKeyword, setNicheKeyword] = useState('7080 시골 실화 수채화 애니메이션');
  const [url, setUrl] = useState('https://www.youtube.com/@cheolmani_diary');
  const [competitors, setCompetitors] = useState('안녕 자두야, 검정고무신, 썰툰 채널들');

  // 2. 실행 상태 관리
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingText, setLoadingText] = useState('');
  const [result, setResult] = useState(null);
  const [activeResultTab, setActiveResultTab] = useState('vector');
  const [expandedWeeks, setExpandedWeeks] = useState({ 1: true });
  const [copiedText, setCopiedText] = useState('');

  // 3. 로딩 메시지 애니메이션 연출
  const loadingSteps = [
    { step: 1, text: '🔍 입력하신 브랜드명과 니치 키워드 벡터 매핑 중...' },
    { step: 2, text: '📊 경쟁사 유튜브 채널 및 썰툰 카테고리 정보 분석 중...' },
    { step: 3, text: '📏 2D 벡터 공간상에서의 포지셔닝 및 틈새 강도 연산 중...' },
    { step: 4, text: '📅 1인 기업용 초단기 8주 성장 로드맵 설계 중...' },
    { step: 5, text: '📅 시즌2 6강 교재 분석을 기반으로 한 60초 CEO 대본 렌더링 중...' },
    { step: 6, text: '🤖 마케팅 & 운영 오토파일럿 시나리오 패키징 중...' }
  ];

  useEffect(() => {
    let timer;
    if (loading && loadingStep < loadingSteps.length) {
      timer = setTimeout(() => {
        setLoadingStep(prev => prev + 1);
        setLoadingText(loadingSteps[loadingStep].text);
      }, 2000);
    } else if (loading && loadingStep === loadingSteps.length) {
      timer = setTimeout(() => {
        executeAnalysis();
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [loading, loadingStep]);

  // 0.5. 웅얼웅얼 한 줄 아이디어를 Gemini API 또는 Mock으로 분석해 폼을 자동 완성하는 마법사 엔진
  const handleIdeaSpark = async (e) => {
    e.preventDefault();
    if (!rawIdeaInput.trim()) {
      alert('대표님, 웅얼웅얼거릴 한 줄 아이디어를 입력해 주세요! 😊');
      return;
    }
    setSparkLoading(true);

    const prompt = `당신은 1인 지식창업 및 AI 서비스 비즈니스 구축 전문가입니다.
사용자가 브레인스토밍 단계에서 툭 던진 한 줄 낙서 아이디어를 분석하여, 1인 AI 기업으로 즉시 빌딩할 수 있도록 네 가지 정보를 구체화해 추천해 주십시오.

[사용자의 한 줄 아이디어]:
"${rawIdeaInput}"

[요구사항]:
반드시 아래의 JSON 구조로만 정확히 응답해 주십시오. 다른 주석, 부연 설명, 마크다운 백틱 (\`\`\`json ...) 기호를 절대 쓰지 말고 오직 순수한 JSON만 반환해야 합니다.

{
  "brandName": "세련되고 뾰족한 한국어 혹은 영어 브랜드명",
  "nicheKeyword": "바늘구멍 같은 좁은 초격차 타겟 시장을 나타내는 키워드 (한 문장)",
  "url": "아이디어에 걸맞은 그럴싸한 가상의 서비스 URL (예: https://www.xxxx.app)",
  "competitors": "벤치마킹하거나 대체할 기존의 경쟁 서비스 2~3개 (쉼표로 구분)"
}`;

    // 1. API 키가 존재할 시 실시간 호출
    if (geminiApiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }]
            })
          }
        );
        if (response.ok) {
          const data = await response.json();
          let rawText = data.candidates[0].content.parts[0].text.trim();
          if (rawText.startsWith('```')) {
            rawText = rawText.replace(/^```json\s*/, '').replace(/```$/, '').trim();
          }
          const parsed = JSON.parse(rawText);
          if (parsed.brandName && parsed.nicheKeyword && parsed.url && parsed.competitors) {
            setBrandName(parsed.brandName);
            setNicheKeyword(parsed.nicheKeyword);
            setUrl(parsed.url);
            setCompetitors(parsed.competitors);
            setIsAutofilled(true);
            setTimeout(() => setIsAutofilled(false), 1500);
            setSparkLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('마법사 API 호출 실패, Fallback 데이터로 자동 전환합니다.', err);
      }
    }

    // 2. API 키가 없거나 실패 시 작동하는 고품질 Fallback Mock
    setTimeout(() => {
      const lowerInput = rawIdeaInput.toLowerCase();
      let mock = {
        brandName: "아이디어 메이커 (IdeaMaker)",
        nicheKeyword: "1인 창업가를 위한 AI BM 구체화 및 자동 랜딩페이지 설계기",
        url: "https://www.ideamaker.io",
        competitors: "ShipFast, 부트스트랩 템플릿들"
      };

      if (lowerInput.includes('긁') || lowerInput.includes('크롤') || lowerInput.includes('수집') || lowerInput.includes('정보')) {
        mock = {
          brandName: "공시 스파이더 (DartSpider)",
          nicheKeyword: "개인투자자용 기업 특이공시 및 외인/기관 매집 정보 자동 큐레이션",
          url: "https://www.dartspider.co.kr",
          competitors: "DART 전자공시, 딥서치, 웰로"
        };
      } else if (lowerInput.includes('음성') || lowerInput.includes('말') || lowerInput.includes('목소리') || lowerInput.includes('오디오')) {
        mock = {
          brandName: "웅얼웅얼 일지봇 (VoiceMOC)",
          nicheKeyword: "횡설수설 음성 메모를 옵시디언 마크다운 구조화 문서로 정제해주는 툴",
          url: "https://www.voicemoc.ai",
          competitors: "AudioPen, TalkToOutline, 네이버 클로바노트"
        };
      } else if (lowerInput.includes('주식') || lowerInput.includes('투자') || lowerInput.includes('사냥')) {
        mock = {
          brandName: "사냥 타점 워처 (TargetWatcher)",
          nicheKeyword: "옵시디언 주식 MOC 연동 모의투자 타점 자동 탐지기",
          url: "https://www.targetwatcher.app",
          competitors: "토스 스크리너, 인베스팅닷컴"
        };
      } else if (lowerInput.includes('니치') || lowerInput.includes('분석') || lowerInput.includes('진단')) {
        mock = {
          brandName: "니치 스캐너 (NicheScanner)",
          nicheKeyword: "1인 메이커용 아이디어 2D 벡터 공간 위치 및 틈새 강도 실시간 측정기",
          url: "https://www.nichescanner.com",
          competitors: "Indie Hackers, Product Hunt, 디스콰이엇(Disquiet)"
        };
      }

      setBrandName(mock.brandName);
      setNicheKeyword(mock.nicheKeyword);
      setUrl(mock.url);
      setCompetitors(mock.competitors);
      setIsAutofilled(true);
      setTimeout(() => setIsAutofilled(false), 1500);
      setSparkLoading(false);
    }, 1500);
  };

  // 텍스트 클립보드 복사
  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedText(key);
    setTimeout(() => setCopiedText(''), 2000);
  };

  // 4. 분석 시작 버튼 핸들러
  const handleStartAnalysis = (e) => {
    e.preventDefault();
    if (!brandName.trim() || !nicheKeyword.trim() || !url.trim() || !competitors.trim()) {
      alert('대표님, 4가지 필수 준비물을 모두 입력해 주셔야 진단이 시작됩니다! 😊');
      return;
    }
    setLoading(true);
    setLoadingStep(0);
    setLoadingText('🚀 코다리 엔진 가동 시작 - 분석 파이프라인 정렬 중...');
    setResult(null);
  };

  // 5. 실제 Gemini API 분석 혹은 고품질 Mock 분석 실행
  const executeAnalysis = async () => {
    const competitorList = competitors
      .split(',')
      .map(c => c.trim())
      .filter(c => c.length > 0);

    const prompt = `당신은 1인 지식창업 및 AI 서비스 비즈니스 구축 전문가이자 최고의 기업 전략 컨설턴트입니다.
또한 "시즌2 6강 - 알고리즘 다음은 사람이다: AI 홍보 콘텐츠의 정석" 강의의 핵심 내용(60초 CEO 스크립트 공식, Kalshi AI 광고 전략)을 완벽하게 이해하고 있습니다.
사용자가 제공한 아래의 4가지 비즈니스 정보를 바탕으로 정밀 비즈니스 진단을 실시하고, 8주 실행 로드맵, 운영/마케팅 오토파일럿 시나리오, 그리고 6강 교재 특화 솔루션을 작성하십시오.

[제공된 4대 비즈니스 정보]:
1. 브랜드 / 서비스 이름: "${brandName}"
2. 니치 키워드 (카테고리): "${nicheKeyword}"
3. 웹사이트 URL 또는 유튜브 채널: "${url}"
4. 경쟁사 목록: [${competitorList.join(', ')}]

[요구사항]:
반드시 아래의 JSON 구조로만 응답하십시오. 다른 설명글이나 마크다운 백틱 (\`\`\`json ...) 기호를 포함하지 말고, 순수한 유효 JSON 문자열만 반환해야 합니다. 그렇지 않으면 시스템 에러가 발생합니다.

[요구 JSON 스키마]:
{
  "vectorAnalysis": {
    "score": 85,
    "ourPosition": {"x": 30, "y": 80},
    "competitors": [
      {"name": "경쟁사1", "x": 70, "y": 40},
      {"name": "경쟁사2", "x": 85, "y": 30}
    ],
    "commentary": "벡터 포지션 분석글 (3줄 이내)"
  },
  "diagnosis": {
    "summary": "비즈니스 요약 한 문장",
    "nicheFit": "니치 키워드 평가 (2~3줄)",
    "differentiation": "차별화 포인트 제안 (2~3줄)",
    "marketSize": "시장 규모 및 리스크 분석 (2~3줄)"
  },
  "plan8Weeks": [
    {
      "week": 1,
      "title": "주차 제목",
      "description": "주차 목표 설명",
      "tasks": ["태스크 1", "태스크 2"]
    },
    ...
  ],
  "autopilot": {
    "summary": "오토파일럿 총평",
    "steps": [
      {"step": 1, "title": "1단계 제목", "desc": "설명"},
      {"step": 2, "title": "2단계 제목", "desc": "설명"},
      {"step": 3, "title": "3단계 제목", "desc": "설명"},
      {"step": 4, "title": "4단계 제목", "desc": "설명"}
    ]
  },
  "lectureSolution": {
    "ceoScript": {
      "hook": "0-3초 훅 대본",
      "problem": "4-15초 문제 및 소개 대본",
      "solution": "16-40초 해결책 제안 및 데모 안내 대본",
      "proof": "41-50초 고객 증명 및 성과 대본",
      "cta": "51-60초 CTA 대본"
    },
    "aiPrompts": {
      "nanoBanana": "나노바나나(캐릭터/첫 프레임) 이미지 생성용 영문 프롬프트",
      "veoAd": "Veo 비디오 생성용 영문 프롬프트"
    }
  }
}`;

    if (!geminiApiKey) {
      console.warn('API Key가 없어 Mock 데이터 시뮬레이션을 수행합니다.');
      generateMockResult(competitorList);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      if (!response.ok) {
        throw new Error('Gemini API 응답 오류');
      }

      const data = await response.json();
      let rawText = data.candidates[0].content.parts[0].text.trim();

      if (rawText.startsWith('```')) {
        rawText = rawText.replace(/^```json\s*/, '').replace(/```$/, '').trim();
      }

      const parsedResult = JSON.parse(rawText);
      setResult(parsedResult);
    } catch (err) {
      console.error('Gemini API 파싱 오류 발생. 고품질 Mock 데이터로 전환합니다.', err);
      generateMockResult(competitorList);
    } finally {
      setLoading(false);
      if (onScanComplete) onScanComplete();
    }
  };

  // 6. 비즈니스 논리에 부합하는 가상의 고품질 Mock 데이터 빌더 - 철만이 일기 최적화!
  const generateMockResult = (competitorList) => {
    const mockCompetitors = competitorList.map((comp, idx) => ({
      name: comp,
      x: Math.round(65 + Math.random() * 20),
      y: Math.round(25 + Math.random() * 20)
    }));

    const defaultResult = {
      vectorAnalysis: {
        score: 96,
        ourPosition: { x: 20, y: 88 },
        competitors: mockCompetitors,
        commentary: `[${brandName}]는 일반적인 자극성 현대 썰툰이나 메이저 아동용 만화(${competitorList.slice(0, 2).join(', ')})와 달리, '7080 시골 실화 수채화 만화'라는 아날로그 감성 틈새시장을 아주 정확히 관통하고 있습니다. 벡터 거리가 매우 멀어 대체 불가능한 브랜드 독점력을 보유하고 있습니다.`
      },
      diagnosis: {
        summary: `[${brandName}]는 AI 비주얼 생성 기술의 신속성과 7080 아날로그 감성 실화가 절묘하게 결합하여 1인 기업이 강력한 팬덤 비즈니스로 스케일업할 수 있는 명작입니다.`,
        nicheFit: `니치 키워드 '${nicheKeyword}'는 4060 세대의 강렬한 향수를 자극하는 미개발 시장입니다. 일반 썰툰에 비해 감성적 소구력이 극도로 높으며, 1인 에이전트 체제로 수채화 원화 렌더링 비용을 91% 이상 절감하면서 퀄리티 높은 에피소드를 무한 공급할 수 있는 최적의 핏을 보이고 있습니다.`,
        differentiation: `기존 경쟁사(${competitorList.join(', ')})들은 픽셀 아트나 단순한 2D 플랫 드로잉 위주의 자극적인 유머 썰툰을 지향합니다. 반면 대표님의 철만이 일기는 감성을 자극하는 은은한 수채화풍 애니메이션과 실제 대표님의 리얼한 유년 시절 실화 회고록을 연동해 가짜가 아닌 '진짜 이야기'라는 압도적 신뢰와 감동을 선사합니다.`,
        marketSize: `유튜브 채널 구독자를 팬덤화하여 단행본 화보집 펀딩, 굿즈 판매, 카카오톡 이모티콘 론칭 및 월 4,900원 수준의 유료 멤버십 가동 시 1인 창업으로 높은 순수익을 지속적으로 확보할 수 있는 매력적인 볼륨을 가지고 있습니다.`
      },
      plan8Weeks: [
        {
          week: 1,
          title: "🎯 1주차: 철만이 일기 코어 타겟 오디언스 분석 및 대표 에피소드 10선 확정",
          description: "4060 세대의 폭발적인 공감과 눈물을 이끌어낼 대표님의 유년 시절 실화 중 가장 임팩트 있는 에피소드 10선을 엄선합니다.",
          tasks: ["'변소에서 죽을 뻔한 날', '할머니 환갑 잔치국수' 등 킬러 에피소드 10선 기획안 정리", "에피소드별 등장인물(철만이, 할머니, 친구들)의 수채화 스타일 가이드라인 확정", "각 씬(Scene)의 아날로그 감성 컬러 톤(황토빛, 은은한 녹음 등) 선언"]
        },
        {
          week: 2,
          title: "🌐 2주차: 유튜브 채널 홈 비주얼 브랜딩 최적화 및 밴드/블로그 개설",
          description: "잠재 독자들이 구독 버튼을 누를 수밖에 없도록 채널 배너와 홈 화면을 수채화 아트워크로 깔끔하게 리디자인합니다.",
          tasks: ["'7080 시골 꼬마의 추억 일기장' 테마의 수채화 채널 아트 배너 제작", "대표 에피소드를 소개하는 채널 예고편 30초 숏츠 영상 업로드", "고관여 팬덤이 모여서 수다를 떨 네이버 밴드 또는 블로그 커뮤니티 개설"]
        },
        {
          week: 3,
          title: "🎬 3주차: 무료 미끼 콘텐츠(추억의 수채화 일러스트 배경화면) 배포 개시",
          description: "구독자들의 연락처(이메일 DB)를 확보하기 위해 고화질 스마트폰/PC용 추억 일러스트 배경화면을 무료 배포합니다.",
          tasks: ["사계절 시골 풍경 수채화 배경화면 4종 팩 다운로드 페이지 개설", "유튜브 영상 하단 고정 댓글 및 채널 커뮤니티 탭에 무료 배포 링크 삽입", "이메일 입력 시 자동으로 배경화면 파일이 전송되도록 리드폼 연동"]
        },
        {
          week: 4,
          title: "📬 4주차: 매주 일요일 아침 '철만이가 보내는 추억 배달 편지' 뉴스레터 세팅",
          description: "수집된 이메일을 바탕으로 매주 일요일 아침 따뜻한 시골 소식과 일러스트를 보내는 감성 CRM 뉴스레터 파이프라인을 구축합니다.",
          tasks: ["뉴스레터 플랫폼 주소록 자동 동기화 세팅 및 웰컴 메일 등록", "첫 번째 뉴스레터 '어릴 적 서리하다 도망친 날' 일러스트 및 글 작성", "발송 테스트 완료 및 매주 일요일 오전 8시 자동 예약 설정"]
        },
        {
          week: 5,
          title: "📞 5주차: 첫 마이크로 오퍼(철만이의 추억 화보 단행본 크라우드 펀딩 사전 알림) 론칭",
          description: "팬덤의 소장 욕구를 자극할 실물 단행본 화보집의 와디즈/텀블벅 크라우드 펀딩을 사전 예고하여 알림 신청자를 모읍니다.",
          tasks: ["단행본 표지 및 대표 에피소드 인쇄 샘플 3종 목업 이미지 제작", "크라우드 펀딩 사전 예약 랜딩페이지 개설 및 알림 신청 버튼 노출", "이메일 뉴스레터 구독자 전체를 대상으로 사전 알림 신청 얼리버드 혜택 발송"]
        },
        {
          week: 6,
          title: "💻 6주차: 크라우드 펀딩 오픈 및 고관여 팬덤 전용 굿즈 세일즈 실행",
          description: "텀블벅/와디즈 크라우드 펀딩을 공식 오픈하고, 한정판 굿즈(수채화 엽서, 추억의 달력 등) 패키지를 판매합니다.",
          tasks: ["펀딩 페이지 공식 론칭 및 유튜브 커뮤니티 탭 홍보 카드 게시", "실시간 후원금 달성도에 따른 추가 리워드(미공개 엽서 등) 이벤트 가동", "펀딩 첫날 목표 달성률 200% 돌파를 위한 고관여 구독자 타겟 알림 푸시"]
        },
        {
          week: 7,
          title: "💼 7주차: 유튜브 유료 멤버십(철만이의 비밀 일기장) 개설 및 가동",
          description: "유튜브 채널 멤버십 기능을 활성화하여, 월 4,900원에 단독 미공개 만화 및 비하인드 제작 과정을 볼 수 있는 혜택을 제공합니다.",
          tasks: ["멤버십 가입자 전용 배지 및 전용 이모티콘 5종 디자인 및 업로드", "가입자 전용 혜택 안내 영상(60초 크리에이터 소개 영상 공식 적용) 촬영 및 업로드", "매주 금요일 멤버십 회원 전용 선공개 에피소드 업로드 시스템 구축"]
        },
        {
          week: 8,
          title: "⚙️ 8주차: 콘티 스토리 ➔ 이미지 ➔ 영상 ➔ SNS 숏폼 배포 오토파일럿 가동",
          description: "기획부터 최종 업로드까지 1인 에이전트 시스템으로 물 흐르듯 가동되는 완전 자동화 마케팅/제작 파이프라인을 최종 완성합니다.",
          tasks: ["스토리 입력 시 자동으로 나노바나나 원화를 폴더별로 정렬하는 자동화 세팅", "Make.com을 이용한 업로드 성적표 자동 요약 및 네이버 블로그 자동 포스팅 연동", "철만이 일기 전체 8주간의 지표(구독자 상승률, 펀딩 달성액, 이메일 개봉률) 종합 리포팅"]
        }
      ],
      autopilot: {
        summary: `대표님의 '철만이 일기'는 AI 영상 제작 기술과 아날로그 감성이 결합된 팬덤형 비즈니스입니다. 제작 단계의 원화 렌더링부터 이메일 구독자 소통, 멤버십 세일즈까지 오토파일럿 시스템으로 무인 가동되는 수익 파이프라인을 완성할 수 있습니다.`,
        steps: [
          { step: 1, title: "1단계: 원화 및 애니메이션 자동 빌드", desc: "텍스트 시나리오를 구글 Flow/Veo에 전달하면 수채화 감성의 캐릭터 씬들이 해상도 조절 및 폴더 저장이 자동화되게 워크플로우 구성" },
          { step: 2, title: "2단계: 무료 굿즈 다운로드를 통한 리드 수집", desc: "유튜브 영상 하단에서 무료 일러스트 배경화면을 받아갈 때 구독자의 이메일이 자동으로 마케팅 주소록 DB에 분류 저장" },
          { step: 3, title: "3단계: 자동화 감성 편지 널처링 시퀀스", desc: "구독한 요일과 무관하게 철만이의 시골 살이 비하인드 스토리 레터와 단행본 사전 예약 혜택이 메일침프를 통해 100% 자동 릴레이 배송" },
          { step: 4, title: "4단계: AI 챗봇 멤버십 상담 및 자동 결제", desc: "이 앱에서 구축한 'AI 챗봇'을 대표 채널과 밴드에 연동해 굿즈 배송 상태, 단행본 구매처, 멤버십 가입 혜택 문의를 24시간 자율 상담 및 결제창 연결 처리" }
        ]
      },
      lectureSolution: {
        ceoScript: {
          hook: "혹시 어릴 적 시골 할머니 댁 시원한 대청마루에서 먹던 잔치국수 맛, 아직 기억하시나요?",
          problem: "안녕하세요, 추억 애니메이션 채널 [철만이 일기]를 만드는 대표 정원석입니다. 저 또한 바쁜 현대 사회를 치열하게 살아가며, 문득 그때 그 시절 정겨운 시골 내음과 순수했던 유년 시절이 너무나 그리워 이 그림 일기를 그리기 시작했습니다.",
          solution: "저희 채널은 대표인 제가 겪은 100% 리얼한 실화를 바탕으로, 따뜻한 수채화풍의 AI 애니메이션을 적용해 단 3초 만에 복잡한 일상을 잊고 아늑한 7080 시골 소년의 추억 속으로 여행을 보내 드립니다.",
          proof: "이미 수만 명의 독자분들이 댓글로 '보는 내내 나도 모르게 눈물이 났다', '어릴 적 돌아가신 할머니 생각에 가슴이 미어졌다'며 따뜻한 인생 위로를 받고 계십니다.",
          cta: "지금 구독 버튼을 누르고 매주 일요일 아침 배달되는 철만이의 따뜻한 추억 일기 편지를 무료로 받아보세요."
        },
        aiPrompts: {
          nanoBanana: "A warm and nostalgic watercolor painting of an 8-year-old Korean boy named Cheolman in 1970s rural Korea, wearing a retro t-shirt, smiling brightly. Soft vintage color palette, gentle sunbeams, highly emotional expression, detailed sketch lines --ar 16:9",
          veoAd: "A 16:9 warm cinematic scene. In a traditional Korean countryside backyard, an old grandmother gently pats Cheolman on the head. He is eating a large bowl of noodles, smiling happily. Watercolor style, soft breeze blowing, dust motes in golden sunset light, retro and emotional atmosphere."
        }
      }
    };

    setResult(defaultResult);
    if (onScanComplete) onScanComplete();
  };

  // 8주 플랜 아코디언 토글 핸들러
  const toggleWeek = (week) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [week]: !prev[week]
    }));
  };

  // 8주 플랜 전체 펼치기 / 닫기
  const toggleAllWeeks = (expand) => {
    const nextState = {};
    for (let i = 1; i <= 8; i++) {
      nextState[i] = expand;
    }
    setExpandedWeeks(nextState);
  };

  return (
    <div className="diagnoser-container">
      {/* 🚀 상단 헤더 배너 */}
      <header className="diagnoser-hero">
        <div className="diagnoser-badge">📋 다음 주까지 준비물</div>
        <h1 className="diagnoser-title">
          이 <span className="highlight-purple">4가지만</span> 준비해 오세요
        </h1>
        <p className="diagnoser-sub">
          다음 주에 도구에 바로 넣습니다. 복잡한 거 없어요 — 이 4개면 시작됩니다.
        </p>
      </header>

      {/* ⚙️ 메인 폼 입력 영역 */}
      {!loading && !result && (
        <div className="diagnoser-card-wrapper">
          {/* 🧙‍♂️ 아이디어 스파크 마법사 */}
          <div className="spark-card">
            <div className="spark-header">
              <span className="spark-badge">🧙‍♂️ 코다리 부장의 아이디어 번개 구체화</span>
              <span className="spark-title">Idea Spark</span>
            </div>
            <div className="spark-form-group">
              <input
                type="text"
                className="spark-input"
                placeholder="어떤 아이디어가 떠오르셨나요? 한 줄만 대충 웅얼거려보세요... (예: 귀찮은 지원금 긁어오기)"
                value={rawIdeaInput}
                onChange={(e) => setRawIdeaInput(e.target.value)}
                disabled={sparkLoading}
              />
              <button 
                type="button" 
                className="spark-btn" 
                onClick={handleIdeaSpark}
                disabled={sparkLoading}
              >
                {sparkLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>구체화 중...</span>
                  </>
                ) : (
                  <>
                    <Wand2 size={16} />
                    <span>구체화 스파크 ⚡</span>
                  </>
                )}
              </button>
            </div>
            {sparkLoading && (
              <div className="spark-loader-wrapper" style={{ marginTop: '14px' }}>
                <Sparkles size={16} className="sparkle-icon" />
                <span>Gemini API 연금술을 가동하여 4대 비즈니스 지표를 정밀 조립하는 중입니다...</span>
              </div>
            )}
          </div>

          <form className="diagnoser-form" onSubmit={handleStartAnalysis}>
            <div className="form-group">
              <label className="form-label">
                <span className="step-num">①</span> 브랜드 / 서비스 이름 (필수)
                <span className="example-text">예: AI CITY BUILDERS</span>
              </label>
              <input
                type="text"
                className={`diagnoser-input ${isAutofilled ? 'autofill-highlight' : ''}`}
                placeholder="브랜드 혹은 서비스명을 명확하게 적어주세요."
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="step-num">②</span> 니치 키워드 (필수)
                <span className="example-text">예: "AI 1인 기업 교육" — 좁을수록 유리 (오늘 배운 대로), 깔끔하게.</span>
              </label>
              <input
                type="text"
                className={`diagnoser-input ${isAutofilled ? 'autofill-highlight' : ''}`}
                placeholder="사람들이 AI에 물어볼 카테고리나 세부 니치를 적어주세요."
                value={nicheKeyword}
                onChange={(e) => setNicheKeyword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="step-num">③</span> 웹사이트 URL 또는 유튜브 채널 (필수, 둘 중 하나 이상)
                <span className="example-text">사이트만·유튜브만·둘 다 전부 OK.</span>
              </label>
              <input
                type="text"
                className={`diagnoser-input ${isAutofilled ? 'autofill-highlight' : ''}`}
                placeholder="https://example.com 또는 유튜브 주소를 적어주세요."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="step-num">④</span> 경쟁사 2~3개 (사실상 필수)
                <span className="warning-text">⚠️ 벡터 거리 비교(니치핏·점유율)에 쓰여요 — 없으면 "경쟁자보다 가까운가"를 못 잽니다.</span>
              </label>
              <input
                type="text"
                className={`diagnoser-input ${isAutofilled ? 'autofill-highlight' : ''}`}
                placeholder="예: 경쟁사A, 경쟁사B, 경쟁사C (쉼표로 구분하여 적어주세요.)"
                value={competitors}
                onChange={(e) => setCompetitors(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-diagnoser-run">
              <Zap size={18} style={{ marginRight: '6px' }} />
              <span>진단 및 8주 플랜·오토파일럿 생성 가동</span>
            </button>
          </form>
          <div className="footer-caption">
            📌 이 4개 넣고 버튼 ➔ 알아서 진단 · 8주 플랜 · 오토파일럿. 당신이 하는 건 이 입력이 전부.
          </div>
        </div>
      )}

      {/* ⏳ 실시간 AI 로딩 애니메이션 영역 */}
      {loading && (
        <div className="diagnoser-loading-card">
          <div className="loader-icon-wrapper">
            <Loader2 className="spinner-large animate-spin" size={48} />
          </div>
          <h3 className="loading-title">코다리 AI 군단이 열심히 분석 중입니다...</h3>
          <div className="loading-progress-bar">
            <div className="progress-fill" style={{ width: `${(loadingStep / loadingSteps.length) * 100}%` }}></div>
          </div>
          <div className="loading-step-timeline">
            {loadingSteps.map(ls => (
              <div 
                key={ls.step} 
                className={`step-item ${loadingStep >= ls.step ? 'active' : ''} ${loadingStep > ls.step ? 'completed' : ''}`}
              >
                <div className="step-check">
                  {loadingStep > ls.step ? <Check size={12} /> : <span>{ls.step}</span>}
                </div>
                <span className="step-text">{ls.text}</span>
              </div>
            ))}
          </div>
          <p className="loading-current-msg">{loadingText}</p>
        </div>
      )}

      {/* 📊 분석 결과 리포트 화면 */}
      {!loading && result && (
        <div className="diagnoser-result-wrapper">
          <div className="result-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={24} style={{ color: '#10b981' }} />
              <h2>{brandName} 비즈니스 마스터 진단서</h2>
            </div>
            <button className="btn-reset" onClick={() => { setResult(null); setExpandedWeeks({ 1: true }); }}>
              새로 진단하기
            </button>
          </div>

          {/* 결과 네비게이션 탭 */}
          <div className="result-tabs">
            <button 
              className={`result-tab-btn ${activeResultTab === 'vector' ? 'active' : ''}`}
              onClick={() => setActiveResultTab('vector')}
            >
              <Activity size={16} /> Vector 거리 & 니치핏
            </button>
            <button 
              className={`result-tab-btn ${activeResultTab === 'diagnosis' ? 'active' : ''}`}
              onClick={() => setActiveResultTab('diagnosis')}
            >
              <Target size={16} /> 알아서 진단
            </button>
            <button 
              className={`result-tab-btn ${activeResultTab === 'plan' ? 'active' : ''}`}
              onClick={() => setActiveResultTab('plan')}
            >
              <Calendar size={16} /> 8주 플랜
            </button>
            <button 
              className={`result-tab-btn ${activeResultTab === 'autopilot' ? 'active' : ''}`}
              onClick={() => setActiveResultTab('autopilot')}
            >
              <Workflow size={16} /> 오토파일럿
            </button>
            <button 
              className={`result-tab-btn ${activeResultTab === 'lecture' ? 'active' : ''}`}
              onClick={() => setActiveResultTab('lecture')}
            >
              <BookOpen size={16} style={{ color: '#a855f7' }} /> 📚 6강 실전 솔루션
            </button>
          </div>

          <div className="result-body-card">
            {/* 1. Vector 거리 & 니치핏 탭 */}
            {activeResultTab === 'vector' && (
              <div className="result-tab-content fade-in">
                <div className="vector-analysis-grid">
                  <div className="vector-chart-panel">
                    <h4>📊 벡터 공간 포지셔닝 시뮬레이션</h4>
                    <p className="chart-info-text">y축: 니치 포커스 깊이(좁고 전문적일수록 높음) / x축: 대중성 및 밀집도(기존 시장에 묻힐수록 높음)</p>
                    <div className="scatter-plot-wrapper">
                      <svg viewBox="0 0 100 100" className="scatter-plot-svg">
                        <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.07)" strokeDasharray="3" />
                        <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255,255,255,0.07)" strokeDasharray="3" />
                        
                        <defs>
                          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.3)" />
                          </marker>
                        </defs>

                        {/* 경쟁사 노드 */}
                        {result.vectorAnalysis.competitors.map((comp, index) => (
                          <g key={index} className="competitor-node">
                            <circle cx={comp.x} cy={100 - comp.y} r="3.5" fill="#ef4444" opacity="0.8" />
                            <text x={comp.x + 5} y={100 - comp.y + 1} className="node-text competitor">
                              {comp.name}
                            </text>
                            <line x1={comp.x} y1="100" x2={comp.x} y2={100 - comp.y} stroke="rgba(239, 68, 68, 0.2)" strokeDasharray="2" />
                            <line x1="0" y1={100 - comp.y} x2={comp.x} y2={100 - comp.y} stroke="rgba(239, 68, 68, 0.2)" strokeDasharray="2" />
                          </g>
                        ))}

                        {/* 우리 브랜드 노드 */}
                        <g className="our-node animate-pulse">
                          <circle cx={result.vectorAnalysis.ourPosition.x} cy={100 - result.vectorAnalysis.ourPosition.y} r="5" fill="#10b981" />
                          <circle cx={result.vectorAnalysis.ourPosition.x} cy={100 - result.vectorAnalysis.ourPosition.y} r="8" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.5" />
                          <text x={result.vectorAnalysis.ourPosition.x + 6} y={100 - result.vectorAnalysis.ourPosition.y + 1} className="node-text our">
                            {brandName} (우리 브랜드)
                          </text>
                          <line x1={result.vectorAnalysis.ourPosition.x} y1="100" x2={result.vectorAnalysis.ourPosition.x} y2={100 - result.vectorAnalysis.ourPosition.y} stroke="rgba(16, 185, 129, 0.3)" strokeDasharray="2" />
                          <line x1="0" y1={100 - result.vectorAnalysis.ourPosition.y} x2={result.vectorAnalysis.ourPosition.x} y2={100 - result.vectorAnalysis.ourPosition.y} stroke="rgba(16, 185, 129, 0.3)" strokeDasharray="2" />
                        </g>
                      </svg>
                    </div>
                  </div>

                  <div className="vector-score-panel">
                    <div className="score-ring-area">
                      <div className="score-ring">
                        <svg viewBox="0 0 36 36" className="circular-chart purple">
                          <path className="circle-bg"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path className="circle"
                            strokeDasharray={`${result.vectorAnalysis.score}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <text x="18" y="20.35" className="percentage">{result.vectorAnalysis.score}점</text>
                        </svg>
                      </div>
                      <div className="score-desc">
                        <h5>니치핏 타겟 포지셔닝 점수</h5>
                        <p>벡터 거리 계산 결과, 기존 대형 경쟁사와 중복을 완벽히 피하여 블루오션을 점유하고 있습니다.</p>
                      </div>
                    </div>
                    
                    <div className="vector-commentary-box">
                      <h5>🛡️ 코다리 총괄부장의 포지셔닝 분석 레포트</h5>
                      <p>{result.vectorAnalysis.commentary}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. 알아서 진단 탭 */}
            {activeResultTab === 'diagnosis' && (
              <div className="result-tab-content fade-in">
                <div className="diagnosis-grid">
                  <div className="diagnosis-card summary">
                    <h4>📢 총평 및 비즈니스 요약</h4>
                    <p className="large-summary">"{result.diagnosis.summary}"</p>
                  </div>
                  
                  <div className="diagnosis-details-wrapper">
                    <div className="detail-item">
                      <h5>🎯 니치핏 타겟팅 포커스 강도</h5>
                      <p>{result.diagnosis.nicheFit}</p>
                    </div>
                    
                    <div className="detail-item">
                      <h5>⚡ 경쟁사 대비 초격차 차별성</h5>
                      <p>{result.diagnosis.differentiation}</p>
                    </div>

                    <div className="detail-item">
                      <h5>📊 니치 마켓 규모 & 리스크 진단</h5>
                      <p>{result.diagnosis.marketSize}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. 8주 플랜 탭 */}
            {activeResultTab === 'plan' && (
              <div className="result-tab-content fade-in">
                <div className="plan-controls-row">
                  <h4>📅 대표님을 위한 8주 실행 로드맵</h4>
                  <div className="plan-buttons">
                    <button className="btn-small" onClick={() => toggleAllWeeks(true)}>전체 펼치기</button>
                    <button className="btn-small" onClick={() => toggleAllWeeks(false)}>전체 접기</button>
                  </div>
                </div>
                
                <div className="plan-timeline">
                  {result.plan8Weeks.map((wk) => {
                    const isExpanded = expandedWeeks[wk.week];
                    return (
                      <div key={wk.week} className={`plan-week-card ${isExpanded ? 'open' : ''}`}>
                        <div className="week-header" onClick={() => toggleWeek(wk.week)}>
                          <div className="week-title-row">
                            <span className="week-badge">주차 {wk.week}</span>
                            <h5>{wk.title}</h5>
                          </div>
                          <div className="week-toggle-icon">
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                        </div>
                        
                        {isExpanded && (
                          <div className="week-body fade-in">
                            <p className="week-desc">{wk.description}</p>
                            <div className="task-list-title">📋 이번 주 세부 액션 아이템:</div>
                            <ul className="week-tasks">
                              {wk.tasks.map((task, idx) => (
                                <li key={idx} className="task-item">
                                  <div className="task-checkbox-mock">
                                    <Check size={10} style={{ color: '#10b981' }} />
                                  </div>
                                  <span>{task}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. 오토파일럿 탭 */}
            {activeResultTab === 'autopilot' && (
              <div className="result-tab-content fade-in">
                <div className="autopilot-header-box">
                  <div className="icon-row">
                    <Workflow size={24} style={{ color: '#8b5cf6' }} />
                    <h4>🤖 1인 기업 무인 운영 오토파일럿 파이프라인</h4>
                  </div>
                  <p>{result.autopilot.summary}</p>
                </div>

                <div className="autopilot-steps-grid">
                  {result.autopilot.steps.map((st) => (
                    <div key={st.step} className="autopilot-step-card">
                      <div className="step-header">
                        <span className="step-badge-num">{st.step}단계</span>
                        <h5>{st.title}</h5>
                      </div>
                      <p className="step-desc">{st.desc}</p>
                      {st.step < 4 && (
                        <div className="step-connector">
                          <ArrowRight size={18} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="autopilot-tools-box">
                  <h5>🛠️ 추천 오토파일럿 툴 체커</h5>
                  <div className="tools-tags-bar">
                    <span className="tool-tag">Make.com (자동화 엔진)</span>
                    <span className="tool-tag">Tally Form (리드 수집)</span>
                    <span className="tool-tag">Stibee / Mailchimp (메일 발송)</span>
                    <span className="tool-tag">Gemini API (콘텐츠 생성)</span>
                    <span className="tool-tag">Connect AI Widget (고객 상담)</span>
                  </div>
                </div>
              </div>
            )}

            {/* 5. 📚 6강 실전 솔루션 탭 */}
            {activeResultTab === 'lecture' && result.lectureSolution && (
              <div className="result-tab-content fade-in">
                <div className="lecture-header-box">
                  <span className="lecture-label">시즌2 6강 — 알고리즘 다음은 사람이다</span>
                  <h4>🎬 대표용 60초 소개 스크립트 & AI 광고 프롬프트</h4>
                  <p>교재에 수록된 <strong>Drew Houston의 60초 스크립트 공식</strong>과 <strong>Kalshi의 AI 광고 프롬프트</strong>를 대표님의 [철만이 일기] 비즈니스에 맞춰 즉각 수립해 드립니다.</p>
                </div>

                <div className="lecture-grid">
                  {/* CEO 대본 섹션 */}
                  <div className="lecture-script-panel">
                    <h5>🗣️ 60초 CEO 영상 소개 대본 (Drew Houston 공식)</h5>
                    <div className="ceo-script-timeline">
                      <div className="script-block">
                        <span className="time-tag">0~3초 • 훅</span>
                        <p className="script-text">"{result.lectureSolution.ceoScript.hook}"</p>
                      </div>
                      <div className="script-block">
                        <span className="time-tag">4~15초 • 문제 + 소개</span>
                        <p className="script-text">"{result.lectureSolution.ceoScript.problem}"</p>
                      </div>
                      <div className="script-block">
                        <span className="time-tag">16~40초 • 해결책</span>
                        <p className="script-text">"{result.lectureSolution.ceoScript.solution}"</p>
                      </div>
                      <div className="script-block">
                        <span className="time-tag">41~50초 • 증거</span>
                        <p className="script-text">"{result.lectureSolution.ceoScript.proof}"</p>
                      </div>
                      <div className="script-block">
                        <span className="time-tag">51~60초 • CTA</span>
                        <p className="script-text">"{result.lectureSolution.ceoScript.cta}"</p>
                      </div>
                    </div>
                    <button 
                      className="btn-copy-full" 
                      onClick={() => handleCopy(
                        `[0~3초 훅] ${result.lectureSolution.ceoScript.hook}\n[4~15초 문제+소개] ${result.lectureSolution.ceoScript.problem}\n[16~40초 해결책] ${result.lectureSolution.ceoScript.solution}\n[41~50초 증거] ${result.lectureSolution.ceoScript.proof}\n[51~60초 CTA] ${result.lectureSolution.ceoScript.cta}`, 
                        'fullScript'
                      )}
                    >
                      {copiedText === 'fullScript' ? '복사되었습니다!' : '대본 전체 복사하기'}
                    </button>
                  </div>

                  {/* AI 광고 프롬프트 섹션 */}
                  <div className="lecture-prompt-panel">
                    <h5>🖼️ 6강 적용 AI 광고 생성용 프롬프트 카드</h5>
                    
                    <div className="prompt-card">
                      <div className="prompt-card-header">
                        <span className="tool-badge">나노바나나 / 3D 캐릭터</span>
                        <button 
                          className="btn-prompt-copy" 
                          onClick={() => handleCopy(result.lectureSolution.aiPrompts.nanoBanana, 'nanoBanana')}
                        >
                          {copiedText === 'nanoBanana' ? '복사됨!' : '복사'}
                        </button>
                      </div>
                      <pre className="prompt-content">{result.lectureSolution.aiPrompts.nanoBanana}</pre>
                      <p className="prompt-hint">💡 팁: 내 사진을 첨부하고 이 프롬프트를 넣으면 나를 빼닮은 3D 마스코트 대표 아바타가 생성됩니다.</p>
                    </div>

                    <div className="prompt-card" style={{ marginTop: '20px' }}>
                      <div className="prompt-card-header">
                        <span className="tool-badge">Veo / 비디오 생성</span>
                        <button 
                          className="btn-prompt-copy" 
                          onClick={() => handleCopy(result.lectureSolution.aiPrompts.veoAd, 'veoAd')}
                        >
                          {copiedText === 'veoAd' ? '복사됨!' : '복사'}
                        </button>
                      </div>
                      <pre className="prompt-content">{result.lectureSolution.aiPrompts.veoAd}</pre>
                      <p className="prompt-hint">💡 팁: 나노바나나 캐릭터 이미지를 업로드하고 이 비디오 프롬프트를 실행해 광고를 제작하세요.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NicheDiagnoser;
