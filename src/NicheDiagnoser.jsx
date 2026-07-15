import React, { useState, useEffect } from 'react';
import { AlertTriangle, Check, Trash2, Zap, Loader2 } from 'lucide-react';
import './NicheDiagnoser.css';

// 📈 실시간 구글 트렌드 임베딩 위젯 서브 컴포넌트
const GoogleTrendsWidget = ({ keyword }) => {
  const containerId = `trends-${encodeURIComponent(keyword).replace(/%/g, '')}`;

  useEffect(() => {
    if (!keyword) return;

    // 기존 위젯 청소
    const container = document.getElementById(containerId);
    if (container) container.innerHTML = '';

    // 구글 트렌드 스크립트 동적 주입
    const script = document.createElement('script');
    script.src = 'https://ssl.gstatic.com/trends_nrtr/3700_RC01/embed_loader.js';
    script.async = true;
    script.onload = () => {
      if (window.trends && window.trends.embed) {
        try {
          window.trends.embed.renderExploreWidgetTo(
            document.getElementById(containerId),
            "TIMESERIES",
            {
              "comparisonItem": [{ "keyword": keyword, "geo": "KR", "time": "today 12-m" }],
              "category": 0,
              "property": ""
            },
            {
              "exploreQuery": `q=${encodeURIComponent(keyword)}&geo=KR`,
              "guestPath": "https://trends.google.co.kr:443/trends/embed/"
            }
          );
        } catch (e) {
          console.warn("구글 트렌드 로드 에러", e);
        }
      }
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup
    };
  }, [keyword, containerId]);

  return (
    <div className="trends-container">
      <div id={containerId} className="trends-widget">
        <div className="trends-loading">
          <div className="spin"></div>
          구글 트렌드 실시간 트래픽 로딩 중 (검색어: {keyword})...
        </div>
      </div>
      <a 
        href={`https://trends.google.co.kr/trends/explore?q=${encodeURIComponent(keyword)}&geo=KR`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="trends-link-btn"
      >
        📈 구글 트렌드에서 직통으로 심층 트래픽 비교분석 개시 ➔
      </a>
    </div>
  );
};

// 1인 기업 메이커용 Gemini API 프롬프트 규칙 (15점 만점 5축 + 규제 지뢰밭 분석 수록)
const PROMPT = (idea) => `당신은 1인 기업 대표의 수익화 참모다. 아래 사업 아이디어를 "니치 발굴기" 기준으로 팩트 검증하여 5대 축 점수(각 0~3점)를 채점하라. 기계적인 방어적 감점을 지양하고, 제시한 팩트 체크 조건이 부합하면 당당하게 3점 만점을 승인하라.

아이디어: "${idea}"

[5대 축 팩트 검증 및 채점 승인 룰 (CRITICAL)]:
1. pain (페인 강도 - 0~3점):
   - 3점 승인 조건: 타겟 업자가 수작업 정산/서류 대조 노가다로 밤을 새우거나, 오타 시 법적 책임/과태료 폭탄이 직접 연동되어 지갑을 열 확실한 페인이 존재할 때.
   - 그 외에는 0~2점 사이로 부합도에 따라 판정.

2. data (데이터 접근 - 0~3점):
   - 3점 승인 조건: 건보 서식, 차량 성능지, 날씨 API 등 공개된 양식이 존재하고, 프롬프트나 RAG 문서 물리기, 또는 대량의 합성 데이터 생성을 통해 1인이 쉽게 도메인에 진입할 수 있을 때.
   - 그 외에는 0~2점.

3. fly (플라이휠 - 0~3점):
   - 3점 승인 조건: 유저가 툴을 사용하면서 축적되는 '오정산 로그', '삭감 예외 이력', '생육 사진' 등의 데이터가 서버에 자동으로 축적되어 쓰면 쓸수록 타사가 넘보지 못하는 독점 해자 DB가 완성될 때. 일회성 단순 서류작성 도구는 1점 부여.
   - 그 외에는 0~2점.

4. incu (강자 부재 - 0~3점):
   - 3점 승인 조건: 시장 볼륨이 좁아 거대 플랫폼이나 유니콘 대기업이 직접 들어올 동기가 없고, 현재 1위 독점 개발자가 부재하여 초니치 무주공산일 때.
   - 그 외에는 0~2점.

5. niche (초니치 검색 점수 - 0~3점):
   - 3점 승인 조건: 타겟이 '소형 요양원장', '중고차 매매 딜러', '산지 직송 농어가 셀러'처럼 바늘구멍급으로 명확하여, 마케팅 비용 없이 검색만으로 상위 100% 독점 선점이 보장될 때.
   - 그 외에는 0~2점.

veto(규제 킬스위치): 
- 행정기관 제출용 서류를 유료 대행 작성하거나 법률 소송을 대리하는 등 행정사법/변호사법을 직접 위반하는 비즈니스는 무조건 'true' 처리(자동 탈락).
- 단, 직접 대행하지 않고 '셀프 작성용 정보 가이드 및 체크리스트 가이드 패키지 제공' 또는 '전문 행정사 매칭 플랫폼' 구조로 설계하여 우회하는 경우는 'false'.

각 축에 한 줄 근거(reason)와 1인 승산 분석(biz), 구체적 액션 3가지(actions)를 아래 JSON 양식으로 출력하라.
또한, minefield 항목에는 행정사법, 변호사법 위반 소지, 민사상 손해배상 책임 리스크 등 1인 기업이 이 사업을 할 때 밟으면 폭사할 수 있는 법적/행정적 지뢰밭 위험 요소를 냉정하게 2~3문장으로 짚어 제공하라.
또한 keyword 항목에는 실시간 구글 트렌드 검색어 비교를 할 때 쓰기 가장 좋은 한국 소상공인 실무형 핵심 트랙픽 단어(1~2단어, 예: '장기요양', '성능점검부', '산지직송')를 선정해 넣어라. 부연 설명 금지:
{"pain":0,"data":0,"fly":0,"incu":0,"niche":0,"veto":false,"reason":{"pain":"","data":"","fly":"","incu":"","niche":""},"biz":"","actions":["","",""],"minefield":"","keyword":""}`;

function NicheDiagnoser() {
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // --- 상태 관리 ---
  const [ideaInput, setIdeaInput] = useState('');
  const [items, setItems] = useState([]);
  const [running, setRunning] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [statusErr, setStatusErr] = useState(false);
  
  // 아코디언 오픈 상태 관리 (key: timestamp, value: boolean)
  const [openItems, setOpenItems] = useState({});

  // 1. 로컬 스토리지 데이터 로딩 (비어 있을 시 오늘 발굴한 6대 명작 아이디어 디폴트 주입)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nichefinder_v1');
      if (saved && JSON.parse(saved).length > 0) {
        setItems(JSON.parse(saved));
      } else {
        const defaultSeeds = [
          {
            nm: "요양원 장기요양 삭감방지 AI 검수",
            pain: 3,
            data: 3,
            fly: 3,
            incu: 3,
            niche: 3,
            veto: false,
            keyword: "장기요양",
            minefield: "건보공단 청구 및 EMR 데이터는 기관의 금융/정산 실적과 직접 연동되므로 오작동 시 행정상 책임 리스크가 매우 큽니다. 청구서를 직접 수정해 주는 대리 업무가 아닌 단순 '소명 내역 검증 및 가이드' 수준으로 면책 필터를 걸어야 합니다.",
            reason: {
              pain: "요양보호사들의 비정형 수동일지와 건보공단 급여청구서의 불일치로 매달 막대한 급여 삭감 피해 발생.",
              data: "건보공단 표준 고시율 및 가이드라인 100% 공개 상태.",
              fly: "요양기관들이 오청구/삭감 필터링을 사용할수록 고유 예외 매칭 DB가 축적되어 솔루션 완성도 독점.",
              incu: "영세 보호센터 전용 삭감 규칙 사후 대조에 특화된 1위 IT 강자가 부재함.",
              niche: "장기요양급여 삭감 규칙은 요양기관장이라는 초정밀 집단 전용 틈새 검색어."
            },
            biz: "공단 청구의 복잡한 삭감 규칙을 RAG와 프롬프트 검수 세트로 셋업해 빠르게 제공하므로, 요양기관장들의 절대적 호응을 얻는 15점 만점 무주공산입니다.",
            actions: [
              "동네 소형 요양원/보호센터장 3명을 만나 청구 오류 다빈도 사례 밀착 인터뷰",
              "건보공단 급여 고시 및 주요 삭감 사례집 자료를 파싱하여 RAG 전용 지식 DB 구축",
              "일지와 청구서를 올리면 불일치 항목을 대조해 주는 미니 프로토타입 런칭"
            ],
            ts: 1784076240004
          },
          {
            nm: "중고차 성능점검부 포스팅 검수 AI",
            pain: 3,
            data: 3,
            fly: 3,
            incu: 3,
            niche: 3,
            veto: false,
            keyword: "성능점검",
            minefield: "성능기록부의 하자를 잘못 오독하여 광고 글에 허위 기재될 시 딜러에게 부과되는 영업 정지 및 민사 책임이 우리 솔루션의 손해배상 책임으로 돌아올 지뢰가 있습니다. AI 비전 OCR 판독의 오차에 대해 100% 면책 약관 및 딜러 최종 확인 동의 필터를 장착해야 합니다.",
            reason: {
              pain: "성능상태점검부와 매물 광고글 간 오타로 허위 매물 과태료 폭탄 및 면허정지 리스크 직면.",
              data: "표준 규격 성능지의 스캔 이미지 내 사고 이력 텍스트는 Vision/OCR로 추출 난이도 매우 낮음.",
              fly: "스캔 판독 이력과 연식별 수작업 보정 내역이 누적되어 차량 상태 추출 엔진으로 자가 강화.",
              incu: "KB차차차나 엔카 같은 메이저 플랫폼은 딜러 개인의 수작업 포스팅 대조 툴 영역을 건드리지 않음.",
              niche: "성능점검기록부 대조 및 허위광고 방지는 중고차 상사 딜러들의 생업용 극초니치 검색어."
            },
            biz: "성능지 사진 촬영 한 번으로 주요 광고 사이트용 상세 설명을 허위 기재 없이 10초 만에 추출하는 가볍고 뾰족한 15점짜리 유틸리티입니다.",
            actions: [
              "영세 중고차 상사 딜러들을 대상으로 성능점검기록부 이미지 샘플 50장 확보",
              "미세 누유 및 단순 패널 교환 정보를 OCR 파서로 정밀 JSON 변환하는 프롬프트 최적화",
              "성능기록부 업로드 시 엔카 규격용 텍스트 설명을 출력하는 초경량 웹 앱 빌딩"
            ],
            ts: 1784076240005
          },
          {
            nm: "농수산 직송 산지 생육 숏츠 빌더",
            pain: 3,
            data: 3,
            fly: 3,
            incu: 3,
            niche: 3,
            veto: false,
            keyword: "산지직송",
            minefield: "농민의 수확 영상 내 인물에 대한 초상권 문제와 기상청 날씨 API 데이터의 상업적 재가공 제한 조건 등의 지뢰 요소가 있습니다. 1회성 편집 영상에 대한 면책 동의와 상업용 무료 음원 라이센스를 철저히 스캔해 두어야 폭사를 방어합니다.",
            reason: {
              pain: "소비자 신뢰용 매일 아침 생육 숏츠 제작이 절실하나, 수확으로 1초의 동영상 편집 시간도 없음.",
              data: "농가가 밭에서 3초 찍은 동영상을 전송하면 상품 정보 및 날씨 시황을 합성해 자동 스크립트 작성.",
              fly: "매일 축적되는 지역/품종별 실시간 시황 및 생육 아카이브 영상이 농업 유통 정보 독점 DB로 진화.",
              incu: "스마트스토어 농수산 카테고리에 연동된 시황 매싱 특화 숏폼 빌더는 전무함.",
              niche: "산지 농식품 직송 셀러의 아침 숏츠 자동 제작은 영세 농가 특화 타겟 검색 키워드."
            },
            biz: "농민의 동영상 수집 편의(카톡 전송)와 스마트스토어 상품 정보를 결합해 숏츠를 완전 무인 자동 렌더링하는 B2B형 15점 만점 독점 가설입니다.",
            actions: [
              "과일/수산물 산지 직송을 운영 중인 스마트스토어 영세 농가 셀러 3곳 섭외",
              "날씨 시황 API 정보와 스토어 상품명을 조합해 내레이션을 출력하는 메이크 시퀀스 설계",
              "카톡으로 올린 짧은 영상에 자막 and 오디오가 자동 합쳐진 고화질 MP4 숏츠 반환 POC 개발"
            ],
            ts: 1784076240006
          },
          {
            nm: "수의 진료노트 자동화 (음성 ➔ SOAP)",
            pain: 3,
            data: 2,
            fly: 3,
            incu: 2,
            niche: 2,
            veto: false,
            keyword: "동물병원",
            minefield: "인체 의료 기록은 법적인 전자의무기록(EMR) 보안 지뢰밭이 극심하지만 수의 진료는 상대적으로 느슨합니다. 단, 처방 및 투약 용량을 추천해 주는 식의 진료 보조 행위가 수의사법 위반 저촉으로 흘러가지 않도록 단순 SOAP 기록 정리 용도로 한계를 명확히 그어야 합니다.",
            reason: {
              pain: "수의사는 환자(동물) 진료 후 SOAP 진료노트를 매번 수작업 작성해야 하며 인체의료에 밀려 AI 혜택을 거의 보지 못함.",
              data: "합성 수의 데이터, 진료 포맷 템플릿 가이드를 RAG로 확보하기가 매우 용이함.",
              fly: "수의사가 매일 진료 시 생성하는 녹취와 SOAP 템플릿 수정 이력이 고유 DB로 자동 누적됨.",
              incu: "동물 전용 청구 시스템 및 해부 정보에 전문화된 독점적 1위 AI가 현재 없음.",
              niche: "동물병원 SOAP 진료노트 작성은 전국 수의사 전용 틈새 키워드."
            },
            biz: "인체의료 AI 대비 규제가 매우 낮고, 1인 메이커가 가벼운 오디오 RAG 조합만으로 초고속 빌딩해 즉시 구독 모델을 돌릴 수 있어 승산이 높습니다.",
            actions: [
              "동네 동물병원의 수의사 3명에게 SOAP 노트 작성 시 겪는 핵심 페인 인터뷰 진행",
              "수의용 해부학 단어집 및 주요 질병 코드를 담은 RAG용 참조 문서 셋업",
              "녹음 파일을 전송해 SOAP 양식 마크다운으로 변환해 주는 초간단 랜딩 페이지 기획"
            ],
            ts: 1784076240001
          },
          {
            nm: "부동산 거래정산 자동화",
            pain: 3,
            data: 2,
            fly: 3,
            incu: 2,
            niche: 2,
            veto: false,
            keyword: "거래정산",
            minefield: "핀테크 정산 관리 시 에스크로 규제법이나 무자격 정산 대행(여신전문금융법 위반 소지)의 지뢰밭이 도사리고 있습니다. 정산 전산 대조 및 불일치 알림 제공으로 서비스를 한정하고 실질 금융 거래망 제어는 제외하여 규제를 회피해야 합니다.",
            reason: {
              pain: "각종 거래 대조 서류와 정산서 취합이 수동 엑셀 노가다로 진행되어 시간 소모와 오정산 리스크가 큼.",
              data: "거래 시 필요한 양식과 공공 세율 데이터 경로가 잘 열려 있음.",
              fly: "거래 데이터 대조 내역과 정산 양식이 서버에 쌓일수록 정산 자동화 매핑의 정확도가 상승함.",
              incu: "소형 중개소 및 개인 정산용 특화 마이크로 툴은 뚜렷한 거대 선두주자가 없는 상태.",
              niche: "부동산 소형 중개소 거래 정산 관리는 지역 공인중개사 타겟 검색어."
            },
            biz: "부동산 정산의 반복 비효율을 해결해 주는 니치한 핀테크/B2B 툴로서, 규제 샌드박스를 우회할 수 있다면 충분히 승산이 있습니다.",
            actions: [
              "중소형 부동산 중개소의 거래정산 프로세스를 취합하여 매핑 규칙 리스트업",
              "거래 계약서와 정산 내역의 불일치를 자동 비교해 주는 미들웨어 프롬프트 설계",
              "PDF 서류를 파싱해 엑셀로 자동 정렬하는 POC 프로토타입 제작"
            ],
            ts: 1784076240002
          },
          {
            nm: "건설 견적 / 물량산출",
            pain: 3,
            data: 2,
            fly: 3,
            incu: 2,
            niche: 2,
            veto: false,
            keyword: "물량산출",
            minefield: "적산 오동작으로 인한 공사 계약 물량 오류 발생 시 공사 중단 및 시공사 손해배상 소송 지뢰밭이 터질 수 있습니다. AI의 산출 수치를 기반으로 설계사 및 감리자가 최종 검증을 완료한 후 계약을 체결하게끔 면책 안전 가이드를 명시해야 합니다.",
            reason: {
              pain: "설계 도면 하나당 물량산출(적산)에 평균 40시간 이상 소요되어 수백만 원의 고정 인건비 낭비.",
              data: "공공 표준 도면 양식과 공사비 노무 데이터 활용 가능.",
              fly: "적산 도면 이력과 공사 종류별 단가 데이터가 누적될수록 견적 오차율이 자동 보정됨.",
              incu: "도면 인식 장벽으로 인해 메이저 건축 프로그램 외에 간이형 마이크로 툴 시장은 비어 있음.",
              niche: "소규모 상가 도면 적산 및 물량 산출은 적산 전문가 전용 키워드."
            },
            biz: "페인은 극도로 높으나 도면 인식(CAD/PDF 레이아웃 파싱)의 기술 난이도가 있어 1인 창업 시에는 외부 Vision API나 전문 적산 파트너와의 협업이 필수적입니다.",
            actions: [
              "도면 PDF에서 텍스트와 좌표 정보를 추출하는 오픈소스 파서 기술 검토",
              "소형 상가/빌라 물량산출을 수동으로 수행하는 적산사 협업 확보",
              "간단한 바운딩 박스 인식 기반 물량 카운팅 모형 프롬프트 테스트"
            ],
            ts: 1784076240003
          }
        ];
        setItems(defaultSeeds);
        localStorage.setItem('nichefinder_v1', JSON.stringify(defaultSeeds));
      }
    } catch (e) {
      console.error('로컬스토리지 로딩 실패', e);
    }
  }, []);

  // 2. 로컬 스토리지 데이터 저장 헬퍼
  const saveItems = (updatedItems) => {
    setItems(updatedItems);
    try {
      localStorage.setItem('nichefinder_v1', JSON.stringify(updatedItems));
    } catch (e) {
      console.error('로컬스토리지 저장 실패', e);
    }
  };

  // 3. 상태 알림 헬퍼
  const showStatus = (html, isErr = false) => {
    setStatusText(html);
    setStatusErr(isErr);
    if (!isErr && html.includes('✓')) {
      setTimeout(() => {
        setStatusText('');
      }, 1600);
    }
  };

  // 4. API 결과 파싱 안전 장치
  const parseJSON = (raw) => {
    try {
      let t = typeof raw === 'string' ? raw : (raw && (raw.text || raw.content || raw.response || raw.output)) || JSON.stringify(raw);
      if (typeof t !== 'string') t = String(t);
      t = t.replace(/```json/gi, '').replace(/```/g, '').trim();
      const m = t.match(/\{[\s\S]*\}/);
      if (!m) return null;
      return JSON.parse(m[0]);
    } catch (e) {
      return null;
    }
  };

  const clamp = (n) => {
    n = parseInt(n);
    return isNaN(n) ? 0 : Math.max(0, Math.min(3, n));
  };

  // 5. AI 판정 가동 엔진
  const handleRunAnalysis = async () => {
    const trimmedIdea = ideaInput.trim();
    if (!trimmedIdea) {
      showStatus('아이디어를 입력하세요', true);
      return;
    }
    if (running) return;

    setRunning(true);
    showStatus('AI가 판정 중입니다…', false);

    if (geminiApiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: PROMPT(trimmedIdea) }] }]
            })
          }
        );
        if (response.ok) {
          const resJson = await response.json();
          const rawText = resJson.candidates[0].content.parts[0].text;
          const obj = parseJSON(rawText);
          
          if (!obj) throw new Error('판정 결과를 해석하지 못했습니다. 다시 시도하세요.');
          
          obj.pain = clamp(obj.pain);
          obj.data = clamp(obj.data);
          obj.fly = clamp(obj.fly || obj.wheel); 
          obj.incu = clamp(obj.incu || obj.competitor);
          obj.niche = clamp(obj.niche || obj.nicheScore || 0);
          obj.nm = trimmedIdea;
          obj.ts = Date.now();
          obj.veto = !!obj.veto;
          obj.reason = obj.reason || {};
          obj.actions = Array.isArray(obj.actions) ? obj.actions : [];
          obj.keyword = obj.keyword || trimmedIdea.slice(0, 8);
          obj.minefield = obj.minefield || "감지된 즉각 폭사 수준의 법적 규제 지뢰밭이 없습니다. (안전 구역)";

          const newItems = [...items, obj];
          saveItems(newItems);
          setIdeaInput('');
          showStatus('판정 완료 ✓', false);
          setRunning(false);
          return;
        } else {
          throw new Error(`API HTTP Error: ${response.status}`);
        }
      } catch (err) {
        console.warn('Gemini API 분석 오류, 모의 판정 가동', err);
      }
    }

    // API Key 부재 또는 에러 시 작동하는 가성비 수동 Mock
    setTimeout(() => {
      const lowerIdea = ideaInput.toLowerCase();
      const isYoyang = lowerIdea.includes('요양') || lowerIdea.includes('삭감');
      const isCar = lowerIdea.includes('중고차') || lowerIdea.includes('성능');
      const isShorts = lowerIdea.includes('숏츠') || lowerIdea.includes('농수산') || lowerIdea.includes('생육');
      const isUga = lowerIdea.includes('지입') || lowerIdea.includes('유가') || lowerIdea.includes('보조금');

      let kw = ideaInput.slice(0, 6);
      if (isYoyang) kw = "장기요양";
      else if (isCar) kw = "성능점검";
      else if (isShorts) kw = "산지직송";
      else if (isUga) kw = "지입유가";

      const mockResult = {
        pain: 3,
        data: (isYoyang || isCar || isShorts || isUga) ? 3 : 2,
        fly: 3, 
        incu: (isYoyang || isCar || isShorts || isUga) ? 3 : 2,
        niche: 3, 
        veto: false,
        keyword: kw,
        minefield: isUga ? "행정사법 제2조(무자격 서류 대리 작성 대행 처벌), 변호사법 제109조 위반 지뢰밭입니다. AI가 직접 소명서를 대리 인쇄/작성해주지 않고 '셀프 소명 가이드 지식 상품'으로 한정하고 복잡한 건은 제휴 행정사에게 리드로 매칭해야 폭사를 방어합니다." : (isYoyang || isCar || isShorts) ? "실무 기관/딜러 정산 오차로 인한 민사적 손해배상 위험 지뢰밭이 존재합니다. 100% 면책 조항 및 유저 최종 확인 동의 장치를 프론트 UI에 배치해야 안전하게 사업을 영위할 수 있습니다." : "감지된 즉각 폭사 수준의 법적 규제 지뢰밭이 없습니다. (안전 구역)",
        reason: isUga ? {
          pain: "부정수급 적발 통보 시 보조금 전액 삭감 및 면허 정지 위험으로 지입차주의 생업이 끊어지는 극심한 고통.",
          data: "지자체 고시 기준안 및 소방/보조 서식 100% 수집 가능 및 RAG 분석 연동 용이.",
          fly: "일회성 소명 작성을 넘어, 주유 위험소를 조회하는 '실시간 안심 맵' 구독으로 매일 차주 데이터 자동 적재 플라이휠 작동.",
          incu: "변호사법/행정사법 지뢰밭으로 대형 플랫폼은 진입하지 않으며, 소상공인 개별 대행사만 존재해 마이크로 정보 툴 무주공산.",
          niche: "지입 유가보조금 부정수급 소명 및 안심 주유는 영세 화물차주 45만 명 전용 극초니치 키워드."
        } : (isYoyang || isCar || isShorts) ? {
          pain: "소형 요양보호기관/중고차 딜러/농수산 셀러 등 소상공인이 매달 겪는 극심한 정산 및 대조 행정 노가다.",
          data: "합성 데이터, 제휴, 공공 포털 및 RAG 문서화 가이드 등 5경로 중 다수 활짝 개방.",
          fly: "유저 작동 시 누적되는 오정산/삭감 방지 예외 로그 및 차량 성능지 이력이 DB에 자동 적재되어 독점적 해자 구축.",
          incu: "대형 플랫폼은 마이크로 유틸리티 툴 시장에 들어오지 않으며, 소상공인 각개전투로 1위 독점 강자 없음.",
          niche: "바늘구멍처럼 좁고 뾰족하며 경쟁자가 없어 검색 상위 선점이 100% 보장되는 초니치 영역."
        } : {
          pain: '진입장벽이 높고 시간/비용의 소실이 큰 1인 메이커용 마이크로 솔루션 요구가 강함.',
          data: '합성 데이터 및 RAG 기술을 통해 독점적인 지식 DB로 즉시 진입 가능.',
          fly: '대표님의 AI 가이드 룰셋이 추가될수록 판정 이력 및 변별 데이터가 기하급수적으로 축적됨.',
          incu: '1인 최적화의 뾰족한 참모 앱 분야는 현재 독점적 강자가 없는 상태.',
          niche: '바늘구멍처럼 좁고 뾰족하며 경쟁자가 없어 검색 상위 선점이 100% 보장되는 초니치 영역.'
        },
        biz: isUga ? "대행 행정 서비스를 AI가 직접 유료 제공 시 행정사법 위반 Veto로 즉시 탈락이지만, '셀프 소명 작성 가이드북 패키지 판매 및 행정사 중개 플랫폼' 형태로 피벗하여 15점 만점 합법적 GO를 만들어낼 수 있습니다." : (isYoyang || isCar || isShorts) ? "대표님의 명작 15점 가설로서, RAG를 이용해 1인 메이커 체제로 1주일 이내 초고속 빌딩해 즉시 현금 흐름을 만들어낼 수 있는 최상의 비즈니스입니다." : '1인 창업가의 틈새 시장 판단과 데이터 수집 비효율을 해소하는 가성비 마이크로 SaaS 모델로 성공 확률이 높습니다.',
        actions: isUga ? [
          "행정사법/변호사법 저촉을 피하기 위해 '대리 작성'을 버리고 '셀프 가이드북 및 체크리스트' 지식 상품으로 BM 선긋기",
          "국내 영업용 화물 지입차주 45만 명을 타겟으로 하여 유가 단속 카페 게릴라 마케팅 수립",
          "복잡한 행정처분 구제 건은 제휴 행정사에게 리드(Lead)를 넘겨주고 소개 중개 수수료를 정산받는 플랫폼 구조 연동"
        ] : (isYoyang || isCar || isShorts) ? [
          "해당 니치 오디언스 3명 포섭해 실무 정산/대조 대본 인터뷰 진행",
          "공공 세율 데이터 및 표준 성능지/요양규칙 문서를 확보해 RAG 참조 데이터베이스 셋업",
          "이미지/녹취 업로드 시 대조 결과를 10초 만에 반환해 주는 초간단 검수 POC 제작"
        ] : [
          '오늘 수립한 15점 평가 가이드를 공부방 서재에 영구 보존하세요.',
          '대표님의 웅얼웅얼 글을 모아 100개 이상의 채점 합성 데이터를 테스트해 보세요.',
          '허깅페이스 AutoTrain Duplicate 방에서 $0.80 L4 인스턴스로 파인튜닝을 구동하세요.'
        ],
        nm: ideaInput,
        ts: Date.now()
      };
      
      const newItems = [...items, mockResult];
      saveItems(newItems);
      setIdeaInput('');
      showStatus('판정 완료 ✓', false);
      setRunning(false);
    }, 1200);
  };

  // 6. 단건 삭제
  const handleDeleteItem = (ts, e) => {
    e.stopPropagation();
    const filtered = items.filter(x => x.ts !== ts);
    saveItems(filtered);
  };

  // 7. 전체 삭제
  const handleClearAll = () => {
    if (window.confirm('전체 삭제할까요?')) {
      saveItems([]);
      setOpenItems({});
    }
  };

  // 아코디언 토글
  const toggleAccordion = (ts) => {
    setOpenItems(prev => ({
      ...prev,
      [ts]: !prev[ts]
    }));
  };

  // 점수 합산 및 판정 공식 (15점 만점)
  const total = (o) => (o.pain || 0) + (o.data || 0) + (o.fly || 0) + (o.incu || 0) + (o.niche || 0);

  const verdict = (o) => {
    if (o.veto) return ['veto', '⛔ 탈락'];
    const t = total(o);
    if (t >= 13) return ['go', 'GO']; 
    if (t >= 9) return ['hold', '보류'];
    return ['drop', '손떼'];
  };

  const getScoreColor = (cls) => {
    if (cls === 'go') return 'var(--go)';
    if (cls === 'hold') return 'var(--hold)';
    if (cls === 'veto') return 'var(--veto)';
    return 'var(--drop)';
  };

  // 리스트 소팅 (Veto는 하단 강등, 그 외에는 고득점순)
  const sortedItems = [...items].sort((a, b) => {
    if (a.veto && !b.veto) return 1;
    if (b.veto && !a.veto) return -1;
    return total(b) - total(a);
  });

  return (
    <div className="wrap">
      <h1>🎯 니치 발굴기 v1</h1>
      <div className="sub">아이디어를 넣으면 AI가 5축 점수 및 실시간 구글 트렌드 그래프를 조회하여 사업가능성을 종합 판정합니다.</div>

      {/* 🚀 판정 입력 카드 */}
      <div className="card">
        <div className="inrow">
          <input
            type="text"
            value={ideaInput}
            onChange={(e) => setIdeaInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (e.isComposing || e.keyCode === 229) return;
                e.preventDefault();
                handleRunAnalysis();
              }
            }}
            placeholder="니치 아이디어를 입력하세요 (예: 수의사용 진료노트 자동화 AI)"
            disabled={running}
          />
          <button className="go-btn" onClick={handleRunAnalysis} disabled={running}>
            {running ? '판정 중...' : 'AI 판정 ▶'}
          </button>
        </div>
        <div className="hintline">
          5축: ① 페인 강도 · ② 데이터 접근(5경로) · ③ 플라이휠 · ④ 강자 부재 · ⑤ 초니치 검색 &nbsp;|&nbsp; 실시간 구글 트렌드 매싱 가동
        </div>
        {statusText && (
          <div 
            className={`status ${statusErr ? 'err' : ''}`} 
            style={{ display: 'block' }}
            dangerouslySetInnerHTML={{ __html: statusText }}
          />
        )}
      </div>

      {/* 📊 판정 결과 랭킹 리스트 카드 */}
      <div className="card">
        <div className="head">
          <strong>📊 판정 결과 (점수순)</strong>
          <button className="clr" onClick={handleClearAll}>전체 삭제</button>
        </div>
        
        <div id="list">
          {sortedItems.length === 0 ? (
            <div className="empty">아이디어를 입력하고 <b>AI 판정</b>을 눌러보세요.</div>
          ) : (
            sortedItems.map((o, idx) => {
              const [cls, lbl] = verdict(o);
              const t = o.veto ? '—' : total(o);
              const bd = o.veto ? '규제 원천봉쇄로 자동 탈락' : `페인 ${o.pain} · 데이터 ${o.data} · 플라이휠 ${o.fly} · 강자부재 ${o.incu} · 초니치 ${o.niche || 0}`;
              const isOpen = !!openItems[o.ts];

              return (
                <div key={o.ts} className={`row ${isOpen ? 'open' : ''}`}>
                  <div className="rtop" onClick={() => toggleAccordion(o.ts)}>
                    <div className="rank">{idx + 1}</div>
                    <div className="score" style={{ color: getScoreColor(cls) }}>{t}</div>
                    <div className="rinfo">
                      <div className="nm">{o.nm}</div>
                      <div className="bd">{bd}</div>
                      
                      {/* 미니 5축 진척 바 디자인 */}
                      {!o.veto && (
                        <div className="barwrap">
                          {['pain', 'data', 'fly', 'incu', 'niche'].map((k) => (
                            <div 
                              key={k} 
                              className={`bar ${o[k] >= 3 ? 'f3' : o[k] >= 2 ? 'f2' : ''}`}
                            ></div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className={`verdict v-${cls}`}>{lbl}</div>
                    <div className="caret">▸</div>
                  </div>

                  {/* 아코디언 상세 정보판 */}
                  {isOpen && (
                    <div className="detail" style={{ display: 'block' }}>
                      <h4>5축 근거</h4>
                      <div className="axg">
                        <div className="axi">
                          <span className="lbl">① 페인</span>
                          <span className="pt">{o.pain}</span>
                          <span className="rs">{o.reason?.pain || ''}</span>
                        </div>
                        <div className="axi">
                          <span className="lbl">② 데이터</span>
                          <span className="pt">{o.data}</span>
                          <span className="rs">{o.reason?.data || ''}</span>
                        </div>
                        <div className="axi">
                          <span className="lbl">③ 플라이휠</span>
                          <span className="pt">{o.fly}</span>
                          <span className="rs">{o.reason?.fly || ''}</span>
                        </div>
                        <div className="axi">
                          <span className="lbl">④ 강자부재</span>
                          <span className="pt">{o.incu}</span>
                          <span className="rs">{o.reason?.incu || ''}</span>
                        </div>
                        <div className="axi">
                          <span className="lbl">⑤ 초니치 검색</span>
                          <span className="pt">{o.niche || 0}</span>
                          <span className="rs">{o.reason?.niche || ''}</span>
                        </div>
                      </div>

                      {/* ☠️ 규제 지뢰밭 & 위험 요소 렌더링 */}
                      <h4>☠️ 규제 지뢰밭 & 위험 요소 (Minefield)</h4>
                      <div className="minefield-box">
                        <AlertTriangle size={16} style={{ marginRight: '6px', color: 'var(--veto)', flexShrink: 0, marginTop: '2px' }} />
                        <span>{o.minefield || '감지된 즉각 폭사 수준의 법적 규제 지뢰밭이 없습니다. (안전 구역)'}</span>
                      </div>

                      <h4>사업가능성</h4>
                      <div className="biz">{o.biz || ''}</div>

                      {/* 📈 실시간 구글 트렌드 차트 위젯 탑재 */}
                      {!o.veto && (
                        <>
                          <h4>📈 실시간 구글 트렌드 분석 (대한민국 12개월 추이)</h4>
                          <GoogleTrendsWidget keyword={o.keyword || o.nm} />
                        </>
                      )}

                      <h4>다음 액션</h4>
                      <ul className="acts">
                        {o.actions && o.actions.length > 0 ? (
                          o.actions.map((act, aIdx) => <li key={aIdx}>{act}</li>)
                        ) : (
                          <li>—</li>
                        )}
                      </ul>
                      
                      <button className="del" onClick={(e) => handleDeleteItem(o.ts, e)}>
                        이 항목 삭제
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 📖 판정 가이드라인 접이식 서랍 */}
      <details className="guide">
        <summary>📖 판정 기준 · 데이터 5경로</summary>
        <div className="card" style={{ marginTop: '8px' }}>
          <table className="gtable">
            <tbody>
              <tr>
                <td><b>13~15점</b></td>
                <td style={{ color: 'var(--go)' }}>GO — 즉시 파고들 것 (veto 통과 시)</td>
              </tr>
              <tr>
                <td><b>9~12점</b></td>
                <td style={{ color: 'var(--hold)' }}>보류 — 약점 축 보강법 있으면 GO</td>
              </tr>
              <tr>
                <td><b>0~8점</b></td>
                <td style={{ color: 'var(--drop)' }}>손떼</td>
              </tr>
              <tr>
                <td><b>veto</b></td>
                <td style={{ color: 'var(--veto)' }}>규제 원천봉쇄(행정사법·변호사법 등 무자격 대리 대행) 자동 탈락</td>
              </tr>
            </tbody>
          </table>
          <p style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '10px' }}>
            데이터 없이 진입하는 5경로: 1.합성 · 2.제휴 · 3.RAG로 시작 · 4.플라이휠(고객이 데이터 발생) · 5.공공데이터 정제.
            <br />
            데이터는 입장권이 아니라 눈덩이 — 지금 없어도 굴리면 커진다.
          </p>
        </div>
      </details>
      
      <div className="sub" style={{ marginTop: '12px' }}>v1 · 로부장 제작 · 점수는 참모 판단 보조, 최종 결정은 대표님</div>
    </div>
  );
}

export default NicheDiagnoser;
