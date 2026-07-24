import React, { useState } from "react";
import "./NicheDiagnoser.css";
import { 
  Sparkles, 
  Brain, 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  CheckCircle2, 
  Dna, 
  FileText, 
  DollarSign,
  Scale,
  BarChart3,
  ArrowRight,
  ShieldAlert
} from "lucide-react";

export default function NicheDiagnoser({ isSaaSMode, membership, onScanComplete }) {
  const [ideaInput, setIdeaInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  // 4축 검증을 거친 프리셋 데이터
  const presetIdeas = [
    {
      id: "deepskin_failed",
      title: "📸 DeepSkin AI (스마트폰 셀카 피부 분석 & 맞춤 화장품 처방)",
      category: "B2C 피부 분석",
      status: "REJECTED", // ⛔ 탈락
      nicheScore: 12,
      vectorPos: { x: 90, y: 15 }, // 레드오션 + 대기업 독점 + 규제 위험
      rejectionReason: "식약처·보건복지부 의료행위 규제 원천봉쇄 및 대기업(L'Oreal ModiFace, Olay) 선점으로 자동 탈락",
      fourAxis: {
        pain: { score: 1, desc: "기존 피부과 진료, 에스테틱, 무료 분석 앱으로 대체 가능해 지불 긴급성 낮음" },
        data: { score: 2, desc: "화장품 성분DB는 있으나 학습용 의료용 피부 이미지 데이터셋 원천 봉쇄" },
        flywheel: { score: 1, desc: "1회 분석 후 이탈 가능성 높음 (리텐션 메커니즘 부재)" },
        incumbent: { score: 0, desc: "ModiFace(Estée Lauder), Olay, 대기업이 이미 시장 및 데이터 독점 중" }
      },
      pivots: [
        "대안 A: [건기식·뷰티 셀러 전용] 식약처 허위·과대광고 사전 검수 & 논문 근거 생성 AI (규제 0%, 긴급성 5/5)",
        "대안 B: [바이오 VC / R&D 연구원 전용] 논문·특허·성분 1초 다이지스트 B2B SaaS (법인카드 고단가 구독)"
      ]
    },
    {
      id: "ad_compliance",
      title: "⚖️ 식약처 허위·과대광고 사전 법률 검수 & 과학 근거 AI",
      category: "B2B 마케팅 & 규제 준수 (추천 🟢)",
      status: "APPROVED",
      nicheScore: 98,
      vectorPos: { x: 85, y: 92 },
      rejectionReason: null,
      fourAxis: {
        pain: { score: 5, desc: "영업정지/벌금 리스크 방지! 뷰티·건기식 셀러의 최우선 긴급 과제" },
        data: { score: 5, desc: "식약처 표시·광고 법률 가이드라인 + PubChem 논문 DB 100% 합법 활용" },
        flywheel: { score: 5, desc: "상세페이지/인스타그램 홍보물 작성 시 매번 사전 검수 (리텐션 최상)" },
        incumbent: { score: 4, desc: "1인 셀러/소상공인 맞춤형 초고속 법률 검수 SaaS 블루오션" }
      },
      pivots: [
        "건기식/화장품 마케팅 문구 입력 ➔ 식약처 위반 단어 자동 감지 ➔ 논문 기반 허용 문구 추천",
        "상세페이지 검수 보고서 PDF 자동 출력 기능 연동"
      ]
    },
    {
      id: "biovc_digest",
      title: "📄 바이오 VC & R&D 연구원 전용 논문·특허 다이지스트 SaaS",
      category: "B2B 딥테크 리서치 (추천 🟢)",
      status: "APPROVED",
      nicheScore: 96,
      vectorPos: { x: 78, y: 95 },
      rejectionReason: null,
      fourAxis: {
        pain: { score: 5, desc: "매일 수십 편 논문 분석 부담 ➔ 연구시간 90% 절감 (고단가 월 구독)" },
        data: { score: 5, desc: "PubMed, bioRxiv Open Access 학술 데이터 100% 합법 파이프라인" },
        flywheel: { score: 5, desc: "매일 출근 시 최신 연구 동향 자동 브리핑 받으며 지속 사용" },
        incumbent: { score: 4, desc: "1인 기업 맞춤형 초개인화 AI 다이지스트 툴 독점 공간" }
      },
      pivots: [
        "관심 단백질/질환 키워드 등록 ➔ 딥마인드 science-skills 자동 스캔 ➔ 3줄 요약 & 카드뉴스 발송"
      ]
    }
  ];

  const handleSelectPreset = (preset) => {
    setIdeaInput(preset.title);
    runAnalysis(preset);
  };

  const runAnalysis = (customPreset = null) => {
    const target = customPreset || presetIdeas[0];
    setIdeaInput(target.title);
    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setIsScanning(false);
      setScanResult(target);
      if (onScanComplete) onScanComplete();
    }, 1200);
  };

  return (
    <div className="nd-wrapper">
      <div className="nd-header">
        <div className="nd-badge">
          <Sparkles size={14} className="icon-sparkle" />
          <span>Cold-Eyed 4-Axis Regulatory Analysis Engine</span>
        </div>
        <h2 className="nd-title">🎯 틈새시장 (Niche) 냉정한 4축 규제·사업성 진단기</h2>
        <p className="nd-desc">
          아이디어가 아무리 좋아도 <strong>의료행위 규제 리스크</strong>와 <strong>대기업 선점 장벽</strong>을 넘지 못하면 사업화가 불가능합니다.
          4축 근거(페인, 데이터, 플라이휠, 강자부재)를 기반으로 냉정하게 검증합니다.
        </p>
      </div>

      {/* 프리셋 선택 버튼 */}
      <div className="nd-preset-section">
        <span className="preset-title font-bold">💡 아이디어 검증 및 피봇(Pivot) 검토 대상:</span>
        <div className="preset-grid">
          {presetIdeas.map((item) => (
            <button 
              key={item.id} 
              className={`preset-card-btn ${ideaInput === item.title ? 'active' : ''} ${item.status === 'REJECTED' ? 'rejected-preset' : ''}`}
              onClick={() => handleSelectPreset(item)}
            >
              <div className="p-title">
                {item.status === 'REJECTED' && <span className="status-tag rejected">⛔ 규제탈락</span>}
                {item.status === 'APPROVED' && <span className="status-tag approved">🟢 피봇추천</span>}
                {item.title}
              </div>
              <div className="p-tag">{item.category}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 검색창 */}
      <div className="nd-input-box">
        <input 
          type="text" 
          className="nd-input"
          placeholder="아이디어를 선택하거나 직접 입력하세요..."
          value={ideaInput}
          onChange={(e) => setIdeaInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && runAnalysis()}
        />
        <button className="btn-run-scan" onClick={() => runAnalysis()} disabled={isScanning}>
          <Brain size={18} />
          <span>4축 검증 실행</span>
        </button>
      </div>

      {/* 로딩 */}
      {isScanning && (
        <div className="nd-loading-state">
          <div className="spinner"></div>
          <h4>식약처·보건복지부 규제 및 4축 사업성 검증 중...</h4>
        </div>
      )}

      {/* 결과 출력 */}
      {scanResult && !isScanning && (
        <div className="nd-result-container fade-in">
          
          {/* 탈락인 경우 RED ALERT */}
          {scanResult.status === "REJECTED" ? (
            <div className="rejected-alert-box">
              <div className="alert-header">
                <ShieldAlert size={32} className="text-red" />
                <div>
                  <span className="badge-failed">⛔ 사업성 & 규제 검증 원천 탈락 (Automatic Disqualification)</span>
                  <h2>{scanResult.title}</h2>
                  <p className="text-red-sub">{scanResult.rejectionReason}</p>
                </div>
              </div>

              {/* 4축 평가 분석표 */}
              <div className="four-axis-grid">
                <div className="axis-card fail">
                  <div className="axis-head"><span>① 페인 포인트 (긴급성)</span> <strong>{scanResult.fourAxis.pain.score} / 5점</strong></div>
                  <p>{scanResult.fourAxis.pain.desc}</p>
                </div>
                <div className="axis-card fail">
                  <div className="axis-head"><span>② 데이터 수집성</span> <strong>{scanResult.fourAxis.data.score} / 5점</strong></div>
                  <p>{scanResult.fourAxis.data.desc}</p>
                </div>
                <div className="axis-card fail">
                  <div className="axis-head"><span>③ 플라이휠 (리텐션)</span> <strong>{scanResult.fourAxis.flywheel.score} / 5점</strong></div>
                  <p>{scanResult.fourAxis.flywheel.desc}</p>
                </div>
                <div className="axis-card fail">
                  <div className="axis-head"><span>④ 강자 부재 여부</span> <strong>{scanResult.fourAxis.incumbent.score} / 5점</strong></div>
                  <p>{scanResult.fourAxis.incumbent.desc}</p>
                </div>
              </div>

              {/* 💡 추천 피봇 방향 */}
              <div className="pivot-recommend-box">
                <h3>🚀 대표님을 위한 1인 기업 피봇(Pivot) 권장 대안</h3>
                <div className="pivot-list">
                  {scanResult.pivots.map((p, idx) => (
                    <div key={idx} className="pivot-item">
                      <ArrowRight size={16} className="text-emerald" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* 합격인 경우 GREEN SUCCESS */
            <div className="approved-success-box">
              <div className="score-hero">
                <div className="score-circle">
                  <span className="score-num">{scanResult.nicheScore}</span>
                  <span className="score-unit">/ 100점</span>
                </div>
                <div className="score-info">
                  <span className="result-tag green">🟢 규제 0% + 1인 기업 최적 피봇 모델</span>
                  <h3>{scanResult.title}</h3>
                  <p>{scanResult.category}</p>
                </div>
              </div>

              {/* 4축 평가 분석표 */}
              <div className="four-axis-grid">
                <div className="axis-card pass">
                  <div className="axis-head"><span>① 페인 포인트 (긴급성)</span> <strong>{scanResult.fourAxis.pain.score} / 5점</strong></div>
                  <p>{scanResult.fourAxis.pain.desc}</p>
                </div>
                <div className="axis-card pass">
                  <div className="axis-head"><span>② 데이터 수집성</span> <strong>{scanResult.fourAxis.data.score} / 5점</strong></div>
                  <p>{scanResult.fourAxis.data.desc}</p>
                </div>
                <div className="axis-card pass">
                  <div className="axis-head"><span>③ 플라이휠 (리텐션)</span> <strong>{scanResult.fourAxis.flywheel.score} / 5점</strong></div>
                  <p>{scanResult.fourAxis.flywheel.desc}</p>
                </div>
                <div className="axis-card pass">
                  <div className="axis-head"><span>④ 강자 부재 여부</span> <strong>{scanResult.fourAxis.incumbent.score} / 5점</strong></div>
                  <p>{scanResult.fourAxis.incumbent.desc}</p>
                </div>
              </div>

              <div className="pivot-recommend-box">
                <h3>💡 1인 기업 실행 핵심 파이프라인</h3>
                <div className="pivot-list">
                  {scanResult.pivots.map((p, idx) => (
                    <div key={idx} className="pivot-item">
                      <CheckCircle2 size={16} className="text-emerald" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
