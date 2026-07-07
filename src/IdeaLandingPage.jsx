import React, { useState, useEffect } from 'react';
import { Sparkles, Wand2, Check, Mail, Award, ArrowLeft, BarChart3, TrendingUp } from 'lucide-react';

function IdeaLandingPage({ ideaType, onClose }) {
  const [emailInput, setEmailInput] = useState('');
  const [preorders, setPreorders] = useState([]);
  const [hasSubscribed, setHasSubscribed] = useState(false);

  // 유닛 이코노믹스 시뮬레이션 계산용 상태
  const [salePrice, setSalePrice] = useState(0);
  const [targetSales, setTargetSales] = useState(100);

  // 아이디어별 콘텐츠 정의
  const ideaData = {
    meme: {
      title: "Meme Spark",
      badge: "🎮 AI 숏폼 밈 제너레이터",
      heroTitle: "글자만 넣으면 쇼츠 밈 영상이 3초 만에 뚝딱!",
      description: "인기 밈 템플릿에 대표님이 원하는 키워드만 입력하세요. AI가 상황에 맞는 자막, 화면 연출, 연관 효과음까지 원클릭으로 매칭하여 트렌디한 숏폼 콘텐츠를 창조합니다.",
      cogs: 20, // 건당 원가 (원)
      defaultPrice: 190,
      features: [
        "유행 밈 템플릿 실시간 자동 업데이트",
        "음성 인식 기반 텍스트 자동 동기화 효과음",
        "유튜브 쇼츠, 인스타 릴스 즉시 업로드 비율 최적화",
        "워터마크 없는 깔끔한 MP4 무손실 다운로드"
      ],
      emoji: "🎬",
      bgColor: "linear-gradient(135deg, #ec4899, #f43f5e)"
    },
    voice: {
      title: "Voice Mood Tuner",
      badge: "🎙️ AI 목소리 감정 정밀 튜너",
      heroTitle: "나레이션의 감정을 슬라이더로 조절하세요!",
      description: "녹음한 파일이나 텍스트를 올린 후 [신남], [차분함], [슬픔], [화남] 게이지를 조절해 보세요. 전문 성우가 연기하듯 감정의 고저가 살아있는 명품 나레이션 오디오를 즉시 완성합니다.",
      cogs: 100, // 분당 원가 (원)
      defaultPrice: 490,
      features: [
        "ElevenLabs 등 세계 최고 오디오 합성 엔진 커스텀 튜닝",
        "미세 감정선 파라미터 조절용 컨트롤 패널",
        "자연스러운 오디오 노이즈 캔슬링 및 Loudnorm 후처리 자동화",
        "상업적 재사용 라이선스 영구 부여"
      ],
      emoji: "🎙️",
      bgColor: "linear-gradient(135deg, #a855f7, #6366f1)"
    },
    spyder: {
      title: "Copy Spider",
      badge: "✍️ 1초 AI 썸네일 카피 스파이더",
      heroTitle: "잘 나가는 영상 주소만 넣으면 카피를 훔쳐옵니다",
      description: "성공 벤치마킹하고 싶은 유튜브 링크를 복사해 붙여넣으세요. AI가 썸네일 속 시각 구도와 핵심 텍스트 패턴을 쪼개어 분석한 뒤, 대표님 채널 맞춤형 고클릭율 카피 3종과 생성용 이미지 프롬프트를 쏴드립니다.",
      cogs: 30, // 건당 원가
      defaultPrice: 290,
      features: [
        "성공 썸네일 실시간 텍스트 추출 및 구도 메타분석",
        "구독자가 누를 수밖에 없는 심리학적 트리거 카피 빌더",
        "AI 이미지 생성(Midjourney, DALL-E)에 최적화된 영어 프롬프트 제공",
        "기록 아카이빙 및 클릭 예측 시뮬레이션 점수 제공"
      ],
      emoji: "🕷️",
      bgColor: "linear-gradient(135deg, #06b6d4, #3b82f6)"
    }
  };

  const currentIdea = ideaData[ideaType] || ideaData.meme;

  // 로컬스토리지에서 사전예약자 목록 로드
  useEffect(() => {
    const saved = localStorage.getItem(`preorders_${ideaType}`);
    if (saved) {
      setPreorders(JSON.parse(saved));
    }
    setSalePrice(currentIdea.defaultPrice);
  }, [ideaType]);

  // 사전예약 등록
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput) return;

    const newOrder = {
      email: emailInput,
      price: salePrice,
      date: new Date().toISOString()
    };

    const updated = [newOrder, ...preorders];
    localStorage.setItem(`preorders_${ideaType}`, JSON.stringify(updated));
    setPreorders(updated);
    setHasSubscribed(true);
    setEmailInput('');
  };

  // 경제성 지표 계산
  const grossRevenue = salePrice * targetSales;
  const totalCogs = currentIdea.cogs * targetSales;
  const netProfit = grossRevenue - totalCogs;
  const marginRate = grossRevenue > 0 ? ((netProfit / grossRevenue) * 100).toFixed(1) : 0;

  return (
    <div className="landing-page-overlay" style={{ background: '#090d16', zIndex: 1000, overflowY: 'auto', paddingBottom: '60px' }}>
      {/* 🚀 헤더 */}
      <nav className="landing-nav" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="landing-logo">
          <span style={{ fontSize: '20px' }}>{currentIdea.emoji}</span>
          <strong style={{ background: currentIdea.bgColor, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{currentIdea.title}</strong>
          <span className="logo-tag-beta">아이디어 검증관</span>
        </div>
        <button onClick={onClose} className="btn-close-landing" style={{ border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
          <ArrowLeft size={14} /> 돌아가기
        </button>
      </nav>

      {/* 🌌 히어로 */}
      <header className="landing-hero" style={{ textAlign: 'center', marginTop: '40px' }}>
        <div className="hero-banner-badge" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Sparkles size={12} style={{ color: '#eab308' }} />
          <span>{currentIdea.badge}</span>
        </div>
        <h1 className="hero-title-big" style={{ fontSize: 'clamp(28px, 4vw, 48px)', margin: '20px 0' }}>
          {currentIdea.heroTitle}
        </h1>
        <p className="hero-description-prose" style={{ maxWidth: '720px', margin: '0 auto', color: '#94a3b8', lineHeight: '1.7' }}>
          {currentIdea.description}
        </p>
      </header>

      {/* 📊 유닛 이코노믹스 경영 연습 섹션 */}
      <section className="landing-preview-section" style={{ maxWidth: '980px', margin: '40px auto 0' }}>
        <div className="preview-container-grid" style={{ gap: '24px' }}>
          
          {/* 왼쪽: 기능 리스트 */}
          <div className="selling-points-card" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>💡 서비스 주요 기능 명세</h3>
            <ul className="selling-list" style={{ marginTop: '16px' }}>
              {currentIdea.features.map((feat, i) => (
                <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div className="check-icon-box" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>✓</div>
                  <span style={{ fontSize: '14px', color: '#cbd5e1' }}>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 오른쪽: 실시간 비즈니스 이익 시뮬레이터 */}
          <div className="selling-points-card" style={{ background: '#111827', border: '1px solid rgba(245,196,81,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <BarChart3 size={18} className="text-gold" />
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>📊 1인 SaaS 유닛 이코노믹스 시뮬레이터</h3>
            </div>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '20px' }}>
              API 원가 대비 판매가를 조절하며, 1건 판매 시 손에 쥐는 진짜 순이익을 계산해 봅니다.
            </p>

            <div style={{ display: 'grid', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                  💰 판매가 설정: <strong>{salePrice.toLocaleString()}원</strong>
                </label>
                <input 
                  type="range" 
                  min={currentIdea.cogs * 1.5} 
                  max={currentIdea.defaultPrice * 5} 
                  step="10"
                  value={salePrice}
                  onChange={(e) => setSalePrice(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                  🎯 목표 월 판매량: <strong>{targetSales.toLocaleString()}건</strong>
                </label>
                <input 
                  type="range" 
                  min="10" 
                  max="1000" 
                  step="10"
                  value={targetSales}
                  onChange={(e) => setTargetSales(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ background: '#1f2937', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '13.5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span>월 매출액:</span>
                  <strong>{grossRevenue.toLocaleString()}원</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#ef4444' }}>
                  <span>− API 원가 ({currentIdea.cogs}원/건):</span>
                  <span>− {totalCogs.toLocaleString()}원</span>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontWeight: 800 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><TrendingUp size={14} /> 순수 이익 (마진율 {marginRate}%):</span>
                  <span>+{netProfit.toLocaleString()}원</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ✉️ 사전 구매 신청 폼 */}
      <section className="landing-pricing-section" style={{ maxWidth: '980px', margin: '40px auto 0' }}>
        <div className="subscription-form-card" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.05)' }}>
          {!hasSubscribed ? (
            <form onSubmit={handleSubscribe} className="landing-sub-form">
              <h4 style={{ fontSize: '18px', fontWeight: 800 }}>
                🎁 {salePrice.toLocaleString()}원에 선예약 구매 신청하기
              </h4>
              <p className="form-sub-desc" style={{ color: '#94a3b8' }}>
                실제 서비스 오픈 시 입력하신 이메일로 즉시 알림 및 사전예약 할인가 {salePrice.toLocaleString()}원 구매 혜택을 전송해 드립니다!
              </p>
              <div className="form-input-row" style={{ marginTop: '16px' }}>
                <input 
                  type="email" 
                  required 
                  className="sub-email-input"
                  placeholder="예약 알림을 받을 이메일을 입력하세요."
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  style={{ background: '#1f2937', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                />
                <button type="submit" className="btn-sub-submit" style={{ background: currentIdea.bgColor, color: '#fff', border: 'none', cursor: 'pointer' }}>
                  <Wand2 size={16} />
                  <span>사전예약 신청</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="subscription-success-box animate-fade-in" style={{ textAlign: 'center', padding: '20px 0' }}>
              <Award size={36} className="text-gold animate-bounce" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>사전 예약 데이터 수집 성공!</h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', margin: '8px 0 16px' }}>
                이메일이 로컬DB에 무사히 기록되었습니다. 아래 대시보드 로그에서 방금 등록한 트래픽 로그를 직접 팩트체크해 보세요!
              </p>
              <button className="btn-preorder-reset" onClick={() => setHasSubscribed(false)} style={{ background: '#374151', color: '#cbd5e1', cursor: 'pointer' }}>
                추가 예약하기
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 📊 가망고객 DB 테이블 */}
      <section className="landing-admin-logs-section" style={{ maxWidth: '980px', margin: '40px auto 0', padding: '0 24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#cbd5e1', marginBottom: '14px' }}>
          📊 {currentIdea.title} 실시간 가망고객 사전예약 DB 로그
        </h3>
        <div className="admin-db-table-wrapper" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
          {preorders.length === 0 ? (
            <div className="empty-db-state" style={{ padding: '30px', textAlign: 'center', color: '#4b5563' }}>
              <Mail size={32} style={{ margin: '0 auto 10px' }} />
              <p style={{ fontSize: '13px' }}>수집된 사전예약 이메일 데이터가 비어 있습니다. 위 폼에 테스트 이메일을 채워 보세요!</p>
            </div>
          ) : (
            <table className="admin-db-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#1f2937', color: '#94a3b8' }}>
                  <th style={{ padding: '12px' }}>번호</th>
                  <th style={{ padding: '12px' }}>고객 이메일</th>
                  <th style={{ padding: '12px' }}>예약 구매 설정가</th>
                  <th style={{ padding: '12px' }}>일시</th>
                  <th style={{ padding: '12px' }}>상태</th>
                </tr>
              </thead>
              <tbody>
                {preorders.map((po, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', color: '#e5e7eb' }}>
                    <td style={{ padding: '12px' }}>{preorders.length - index}</td>
                    <td style={{ padding: '12px', fontWeight: 600 }}>{po.email}</td>
                    <td style={{ padding: '12px', color: '#fbbf24', fontWeight: 800 }}>{po.price.toLocaleString()}원</td>
                    <td style={{ padding: '12px', color: '#94a3b8' }}>{new Date(po.date).toLocaleString('ko-KR')}</td>
                    <td style={{ padding: '12px', color: '#10b981' }}>● 가망고객 등록 완료</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}

export default IdeaLandingPage;
