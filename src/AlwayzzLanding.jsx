import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Menu, X, ArrowUpRight, Check, Users } from 'lucide-react';
import './AlwayzzLanding.css';

function AlwayzzLanding() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [preorders, setPreorders] = useState([]);
  const [hasSubscribed, setHasSubscribed] = useState(false);

  // 3D 카드 패럴랙스 기울기 상태
  const [tiltStyle, setTiltStyle] = useState({});
  const cardRef = useRef(null);

  // 로컬 스토리지에서 사전예약자 목록 로드
  useEffect(() => {
    const saved = localStorage.getItem('alwayzz_preorders');
    if (saved) {
      setPreorders(JSON.parse(saved));
    }
  }, []);

  // 사전 예약 등록 핸들러
  const handlePreorder = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    const newPreorder = {
      email: emailInput,
      date: new Date().toISOString()
    };

    const updated = [newPreorder, ...preorders];
    localStorage.setItem('alwayzz_preorders', JSON.stringify(updated));
    setPreorders(updated);
    setHasSubscribed(true);
    setEmailInput('');
  };

  // 3D 패럴랙스 틸트 핸들러
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const rotateY = ((x - xc) / xc) * 15;
    const rotateX = -((y - yc) / yc) * 15;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`,
      transition: 'transform 0.05s ease-out'
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      transition: 'transform 0.5s ease-out'
    });
  };

  // 🎙️ 이완용 수면 가이드 TTS (SpeechSynthesis)
  const speakSleepGuide = (e) => {
    e.stopPropagation(); // 카드 뒤집기 방지
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const message = cardFlipped 
        ? "숨을 천천히 들이마시고, 내쉬며 온몸의 긴장을 풀어줍니다. 당신의 오늘 밤은 평화로울 것입니다."
        : "몸의 온도가 올라가거나 식은땀이 날 때는 이마와 관절의 긴장을 풀고 가볍게 호흡을 시작하세요.";
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.8; // 매우 느리고 나긋나긋하게
      window.speechSynthesis.speak(utterance);
    } else {
      alert("TTS 오디오를 지원하지 않는 브라우저입니다.");
    }
  };

  // 마키 목록
  const tickerItems = [
    "수면장애 인지행동치료 (CBT-I)",
    "갱년기 신체 증상 추적",
    "복약 및 한약 매칭 분석",
    "맞춤 이완 명상 오디오",
    "운동 및 열감 가이드",
    "수면장애 인지행동치료 (CBT-I)",
    "갱년기 신체 증상 추적",
    "복약 및 한약 매칭 분석",
    "맞춤 이완 명상 오디오",
    "운동 및 열감 가이드"
  ];

  return (
    <div className="alwayzz-wrapper">
      {/* 📐 격자 눈금 */}
      <div className="alwayzz-grid-overlay"></div>

      {/* 🌌 오로라 블롭 백그라운드 */}
      <div className="alwayzz-glow-bg">
        <div className="alwayzz-orb alwayzz-orb-1"></div>
        <div className="alwayzz-orb alwayzz-orb-2"></div>
      </div>

      {/* 🏷️ Navbar */}
      <nav className="alwayzz-nav">
        <div className="alwayzz-nav-container">
          <div className="alwayzz-logo">
            Alwayzz <sup>®</sup>
          </div>
          <button className="btn-alwayzz-menu" onClick={() => setDrawerOpen(true)}>
            <Menu size={16} />
            <span>Menu</span>
          </button>
        </div>
      </nav>

      {/* 🗂️ Drawer Overlay */}
      {drawerOpen && (
        <div className="alwayzz-drawer">
          <div className="alwayzz-drawer-header">
            <div className="alwayzz-logo">Alwayzz <sup>®</sup></div>
            <button className="btn-close-drawer" onClick={() => setDrawerOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="alwayzz-drawer-menu">
            <a className="alwayzz-drawer-link" onClick={() => setDrawerOpen(false)}>Projects</a>
            <a className="alwayzz-drawer-link" onClick={() => setDrawerOpen(false)}>Plans</a>
            <a className="alwayzz-drawer-link" onClick={() => setDrawerOpen(false)}>Team</a>
            <a className="alwayzz-drawer-link" onClick={() => setDrawerOpen(false)}>FAQs</a>
            <a className="alwayzz-drawer-link" onClick={() => setDrawerOpen(false)}>Get in Touch</a>
          </div>

          <div className="alwayzz-drawer-footer">
            © 2026 Alwayzz. All rights reserved.
          </div>
        </div>
      )}

      {/* 🚀 Hero Section */}
      <section className="alwayzz-hero">
        {/* 희뿌연 배경 이미지 */}
        <div className="alwayzz-hero-bg-wrapper">
          <img 
            src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260626_041422_4a459e05-abce-4150-9fb7-4ededc423cd1.png&w=1280&q=85" 
            alt="Menopause Sleep Aura"
            className="alwayzz-hero-bg-image"
          />
        </div>

        {/* 📐 양측 20선 곡선 장식 */}
        <div className="alwayzz-lines-container">
          {Array.from({ length: 15 }).map((_, i) => (
            <React.Fragment key={i}>
              <div 
                className="alwayzz-curve-line left" 
                style={{ 
                  width: `${60 + i * 14}px`, 
                  animationDelay: `${i * 0.25}s`,
                  opacity: 0
                }}
              />
              <div 
                className="alwayzz-curve-line right" 
                style={{ 
                  width: `${60 + i * 14}px`, 
                  animationDelay: `${i * 0.25}s`,
                  opacity: 0
                }}
              />
            </React.Fragment>
          ))}
        </div>

        {/* 🏷️ 마키 틱커 */}
        <div className="alwayzz-ticker-wrapper">
          <div className="alwayzz-ticker-inner">
            {tickerItems.map((item, idx) => (
              <span key={idx} className="alwayzz-ticker-item">{item}</span>
            ))}
          </div>
        </div>

        {/* 👑 타이틀 */}
        <h1 className="alwayzz-hero-title">
          Premium creative <span className="serif-italic">alwayzz</span> <sup>®</sup> on demand.
        </h1>

        {/* 📝 서브타이틀 */}
        <p className="alwayzz-hero-sub">
          갱년기 여성을 위해 태어난 24시간 숙면 보좌관. 병원 처방 없이 집에서 즉시 시작하는 인지행동 3분 이완 웰니스 솔루션.
        </p>

        {/* 🎮 CTA 그룹 */}
        <div className="alwayzz-cta-group">
          <button 
            className="btn-alwayzz-primary"
            onClick={() => document.getElementById('preorder-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span>런칭 플랜 보기</span>
            <ArrowUpRight size={16} style={{ marginLeft: '4px' }} />
          </button>
          
          <button className="btn-alwayzz-book" onClick={(e) => speakSleepGuide(e)}>
            <img 
              src="https://framerusercontent.com/images/hfneFL6CHBi5BnNvCeOaqU9HqE4.png" 
              alt="AI Coach" 
              className="alwayzz-book-avatar"
            />
            <div className="alwayzz-book-text-stack">
              <span className="alwayzz-book-title">AI 숙면 코치 가이드 듣기</span>
              <span className="alwayzz-book-sub">
                <span className="alwayzz-dot-green"></span>
                실시간 음성 활성화
              </span>
            </div>
          </button>
        </div>

        {/* 🎯 3D 입체 갱춘기 수면 유도 카드 */}
        <div className="alwayzz-3d-card-wrapper">
          <div 
            className={`alwayzz-3d-card ${cardFlipped ? 'alwayzz-3d-card-flipped' : ''}`}
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={tiltStyle}
            onClick={() => setCardFlipped(!cardFlipped)}
          >
            <div className="alwayzz-card-header">
              <span className="alwayzz-card-badge">
                {cardFlipped ? "😴 3분 호흡 이완 코스" : "🔥 갱년기 열감 감지기"}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--alwayzz-muted)' }}>TOUCH TO FLIP 👆</span>
            </div>

            <div className="alwayzz-card-body">
              {!cardFlipped ? (
                <>
                  <h3>"갑자기 상체가 후끈거려 잠에서 깼나요?"</h3>
                  <p>카드를 터치하여 AI가 권장하는 호흡 조절 이완 가이드로 전환하고 밤을 다시 차분하게 가라앉히세요.</p>
                </>
              ) : (
                <>
                  <h3>"천천히 들이마시고 내쉬세요."</h3>
                  <p>이마의 열이 내릴 때까지 어깨 힘을 빼고 5초 동안 들이마신 후, 5초 동안 길게 내쉽니다.</p>
                </>
              )}
            </div>

            <div className="alwayzz-card-footer">
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--alwayzz-text)' }}>
                {cardFlipped ? "TTS 가이드 재생 가능" : "안면홍조 대처 행동 치료"}
              </span>
              <button className="alwayzz-btn-sound" onClick={(e) => speakSleepGuide(e)}>
                <Volume2 size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="alwayzz-blur-overlay"></div>
      </section>

      {/* 💳 사전 예약 폼 구역 */}
      <section id="preorder-section" style={{ maxWidth: '600px', margin: '0 auto', padding: '0 24px', zIndex: 10, position: 'relative' }}>
        <div style={{ background: '#ffffff', border: '1px solid var(--alwayzz-border)', borderRadius: '24px', padding: '32px', textAlign: 'center', boxShadow: '0 20px 40px rgba(167, 139, 250, 0.03)' }}>
          {!hasSubscribed ? (
            <form onSubmit={handlePreorder}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>💜 갱춘기 Alwayzz 런칭 사전예약</h3>
              <p style={{ fontSize: '13.5px', color: 'var(--alwayzz-muted)', lineHeight: '1.5', marginBottom: '20px' }}>
                가입 즉시 6개월 전체 무료로 시작하세요! AI 수면 일지, 안면홍조 추적 리포트를 오픈일에 가장 먼저 배달해 드립니다.
              </p>
              <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                <input 
                  type="email" 
                  required
                  placeholder="예약 알림을 받을 이메일을 입력하세요."
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '999px',
                    border: '1px solid var(--alwayzz-border)',
                    outline: 'none',
                    fontSize: '14px',
                    textAlign: 'center',
                    background: '#FCFAF8'
                  }}
                />
                <button 
                  type="submit" 
                  style={{
                    background: 'var(--alwayzz-text)',
                    color: '#fff',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '999px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  🚀 사전 예약자 등록하기
                </button>
              </div>
            </form>
          ) : (
            <div style={{ padding: '16px 0' }}>
              <div style={{ width: '48px', height: '48px', background: 'rgba(29, 204, 93, 0.1)', color: '#1dcc5d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Check size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>가망고객 대기열 등록 완료!</h3>
              <p style={{ fontSize: '13.5px', color: 'var(--alwayzz-muted)', lineHeight: '1.5', marginBottom: '20px' }}>
                성공적으로 대기 데이터가 localDB(localStorage)에 동기화되었습니다. 아래 로그 대시보드에서 등록 상태를 팩트체크할 수 있습니다.
              </p>
              <button 
                onClick={() => setHasSubscribed(false)}
                style={{ background: '#F4F4F5', border: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--alwayzz-muted)', cursor: 'pointer' }}
              >
                추가 예약하기
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 📊 가망고객 DB 테이블 */}
      <section style={{ maxWidth: '800px', margin: '40px auto 0', padding: '0 24px', zIndex: 10, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Users size={16} style={{ color: 'var(--alwayzz-purple)' }} />
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--alwayzz-text)' }}>📊 실시간 사전예약 고객 DB 로그 (대표님 팩트체크용)</h3>
        </div>
        <div style={{ background: '#ffffff', border: '1px solid var(--alwayzz-border)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.02)' }}>
          {preorders.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--alwayzz-muted)', fontSize: '13px' }}>
              아직 사전예약 신청 로그가 없습니다. 위 입력창에 메일 주소를 적어 테스트해 보십시오!
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#FCFAF8', borderBottom: '1px solid var(--alwayzz-border)', color: 'var(--alwayzz-muted)' }}>
                  <th style={{ padding: '12px' }}>번호</th>
                  <th style={{ padding: '12px' }}>가망고객 이메일</th>
                  <th style={{ padding: '12px' }}>신청 일시</th>
                  <th style={{ padding: '12px' }}>상태</th>
                </tr>
              </thead>
              <tbody>
                {preorders.map((po, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid rgba(167,139,250,0.06)' }}>
                    <td style={{ padding: '12px' }}>{preorders.length - index}</td>
                    <td style={{ padding: '12px', fontWeight: 600 }}>{po.email}</td>
                    <td style={{ padding: '12px', color: 'var(--alwayzz-muted)' }}>{new Date(po.date).toLocaleString('ko-KR')}</td>
                    <td style={{ padding: '12px', color: '#1dcc5d', fontWeight: 600 }}>● 정상 등록 완료</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* 🤝 파트너 로고 (Trusted By) */}
      <section className="alwayzz-trusted">
        <div className="alwayzz-trusted-label">
          Partnered with top-tier companies globally
        </div>
        
        <div className="alwayzz-trusted-marquee-wrapper">
          <div className="alwayzz-trusted-marquee-inner">
            <span className="alwayzz-logo-item logo-airbnb">Airbnb</span>
            <span className="alwayzz-logo-item logo-shopify">Shopify</span>
            <span className="alwayzz-logo-item logo-notion">Notion</span>
            <span className="alwayzz-logo-item logo-linear">Linear</span>
            <span className="alwayzz-logo-item logo-webflow">Webflow</span>
            <span className="alwayzz-logo-item logo-figma">Figma</span>
            <span className="alwayzz-logo-item logo-slack">Slack</span>
            <span className="alwayzz-logo-item logo-stripe">Stripe</span>
            <span className="alwayzz-logo-item logo-vercel">Vercel</span>
            <span className="alwayzz-logo-item logo-framer">Framer</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AlwayzzLanding;
