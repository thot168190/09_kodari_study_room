import React, { useState, useEffect, useRef } from 'react';
import './WizardCVLanding.css';
import { Sparkles, Wand2, ArrowRight, Check, Play, Mail, FileText, Share2, Award, Zap, HelpCircle, Users } from 'lucide-react';

// 아바타 이미지 불러오기
import femaleOriginal from './assets/female_original.png';
import femaleWizard from './assets/female_wizard.png';
import maleOriginal from './assets/male_original.png';
import maleWizard from './assets/male_wizard.png';

function WizardCVLanding({ onClose }) {
  const [emailInput, setEmailInput] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('pro'); // 'free' | 'pro'
  const [preorders, setPreorders] = useState([]);
  const [hasSubscribed, setHasSubscribed] = useState(false);
  const [totalPreorderCount, setTotalPreorderCount] = useState(148); // 가상 카운트 시작
  const [activeTheme, setActiveTheme] = useState('wizard'); // 'wizard' | 'forbes' | 'wedding'

  // 3D 카드 효과용 상태
  const [tiltStyle, setTiltStyle] = useState({});
  const cardRef = useRef(null);

  // 테마별 비디오 소스 매핑
  const themeVideos = {
    wizard: 'https://assets.mixkit.co/videos/preview/mixkit-wizard-casting-a-spell-with-his-wand-40285-large.mp4',
    forbes: 'https://assets.mixkit.co/videos/preview/mixkit-young-businessman-smiling-to-camera-40115-large.mp4',
    wedding: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-kissing-under-a-veil-44824-large.mp4'
  };

  // 로컬스토리지에서 사전예약자 목록 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('wizard_cv_preorders');
    if (saved) {
      const parsed = JSON.parse(saved);
      setPreorders(parsed);
      setTotalPreorderCount(148 + parsed.length);
    }
  }, []);

  // 사전예약 등록 핸들러
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput) return;

    const newPreorder = {
      email: emailInput,
      plan: selectedPlan,
      date: new Date().toISOString()
    };

    const updated = [newPreorder, ...preorders];
    localStorage.setItem('wizard_cv_preorders', JSON.stringify(updated));
    setPreorders(updated);
    setTotalPreorderCount(prev => prev + 1);
    setHasSubscribed(true);
    setEmailInput('');
  };

  // 3D 패럴랙스 핸들러
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const rotateY = ((x - xc) / xc) * 12;
    const rotateX = -((y - yc) / yc) * 12;

    const holoX = (x / rect.width) * 100;
    const holoY = (y / rect.height) * 100;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out',
      '--holo-x': holoX,
      '--holo-y': holoY
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      transition: 'transform 0.5s ease-out',
      '--holo-x': 50,
      '--holo-y': 50
    });
  };

  return (
    <div className="landing-page-overlay">
      {/* 🚀 상단 네비게이션 */}
      <nav className="landing-nav">
        <div className="landing-logo">
          <span className="logo-sparkle">🪄</span>
          <strong>WizardCV</strong>
          <span className="logo-tag-beta">PREMIUM LAUNCH</span>
        </div>
        <div className="nav-right-buttons">
          <button className="btn-close-landing" onClick={onClose}>
            🚪 실험실 닫기
          </button>
        </div>
      </nav>

      {/* 🌌 메인 히어로 섹션 */}
      <header className="landing-hero">
        <div className="hero-banner-badge">
          <Sparkles size={12} style={{ color: '#eab308' }} />
          <span>기괴한 왜곡 극복 • 살아 숨 쉬는 고품질 루핑 비디오 탑재</span>
        </div>
        
        <h1 className="hero-title-big">
          스마트폰 화면 속 살아 움직이는 <br />
          <span className="gradient-text-wizard">3D 동영상 청첩장 & 이력서 카드</span>
        </h1>
        
        <p className="hero-description-prose">
          천편일률적인 사진 청첩장과 이력서는 이제 그만! <br />
          AI가 사진 속 표정을 자연스럽게 움직이는 3~5초 루핑 비디오로 구워내고, <br />
          **스마트폰 각도에 맞춰 입체적으로 반응하는 프리미엄 3D 비디오 카드**를 런칭합니다.
        </p>

        {/* 실시간 사전 구매 현황 */}
        <div className="live-stat-bar">
          <div className="stat-pulse-dot"></div>
          <span>실시간 마크 루식 검증 중: 누적 <strong>{totalPreorderCount}명</strong>이 이 카드를 예약했습니다!</span>
        </div>
      </header>

      {/* 🧭 프리미엄 테마 선택 탭바 */}
      <div className="premium-theme-tabbar-container">
        <h4>🎨 프리미엄 실시간 테마 선택기</h4>
        <div className="premium-theme-tabs">
          <button className={activeTheme === 'wizard' ? 'active-tab' : ''} onClick={() => setActiveTheme('wizard')}>
            🪄 마법사 신문 (Harry Potter)
          </button>
          <button className={activeTheme === 'forbes' ? 'active-tab' : ''} onClick={() => setActiveTheme('forbes')}>
            👑 포브스 잡지 (Forbes Cover)
          </button>
          <button className={activeTheme === 'wedding' ? 'active-tab' : ''} onClick={() => setActiveTheme('wedding')}>
            🌸 동영상 청첩장 (Live Invitation)
          </button>
        </div>
      </div>

      {/* 📸 양방향 라이브 프리뷰 체험관 */}
      <section className="landing-preview-section">
        <div className="preview-container-grid">
          
          {/* 왼쪽: 기능 셀링 포인트 */}
          <div className="selling-points-card">
            <h3>💡 3D 비디오 카드의 강력한 경쟁력</h3>
            <p className="selling-sub">기괴했던 픽셀 왜곡 대신 실감 나는 AI 비디오 루핑을 적용했습니다.</p>

            <ul className="selling-list">
              <li>
                <div className="check-icon-box">✓</div>
                <div>
                  <strong>불쾌한 골짜기 0% (완벽한 인공지능 표정 구현)</strong>
                  <p>기형적으로 얼굴이 찌그러지던 SVG 필터를 삭제하고, 실제 루핑 비디오를 카드 내 프레임에 로드하여 감성적이고 예쁜 눈빛과 웃음을 표현합니다.</p>
                </div>
              </li>
              <li>
                <div className="check-icon-box">✓</div>
                <div>
                  <strong>스마트폰 각도 센서 반응 (3D 홀로그램 자이로 효과)</strong>
                  <p>마우스를 움직이거나 모바일에서 폰을 흔들 때 홀로그램 박(箔)이 빛을 반사하며, 카드가 입체적으로 기우는 3D Depth 효과를 제공합니다.</p>
                </div>
              </li>
              <li>
                <div className="check-icon-box">✓</div>
                <div>
                  <strong>어디서나 완벽한 인라인 재생</strong>
                  <p>별도의 재생 플레이어 설치 없이 모바일 카톡 브라우저나 이메일에서도 부드럽게 무한 루프 재생이 가능하도록 최적화된 WebP/WebM 압축 전송.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* 오른쪽: 해리포터 3D 입체 액자 데모 */}
          <div className="demo-canvas-card">
            <div className="demo-label">🖱️ 카드 위에 마우스를 올리고 흔들어 보세요 (3D 효과)</div>
            
            <div 
              className="parallax-canvas-landing"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              ref={cardRef}
              style={tiltStyle}
            >
              {/* 테마 1: 마법사 신문 */}
              {activeTheme === 'wizard' && (
                <div className="prophet-card-landing">
                  <div className="card-holo-overlay"></div>
                  <div className="prophet-header">
                    <div className="prophet-meta-vol">PROTOTYPE EDITION • VOL. 2</div>
                    <h2 className="prophet-logo-title">THE DAILY WIZARD</h2>
                    <div className="prophet-meta-row">
                      <span>CONNECT AI LAB</span>
                      <span>PRICE: 1 PREORDER</span>
                    </div>
                  </div>

                  <div className="prophet-headline">WANTED: MAGIC DEVELOPER</div>

                  <div className="prophet-photo-frame">
                    <div className="prophet-photo-inner">
                      <video 
                        key="wizard"
                        src={themeVideos.wizard} 
                        className="prophet-magic-avatar-video"
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                      />
                      <div className="magic-dust-particles">
                        <span className="md1">★</span>
                        <span className="md2">✦</span>
                        <span className="md3">✨</span>
                      </div>
                    </div>
                    <div className="prophet-name-tag">김민경 (1급 마법 개발자 자격 획득)</div>
                  </div>

                  <div className="prophet-body-text">
                    <h4>🔮 "AI와 대화하며 Vibe Coding으로 3D 카드 빌딩"</h4>
                    <p className="prophet-para">
                      사진 단 한 장으로 눈을 깜빡이며 마법 주문을 거는 신비로운 루핑 영상을 합성하는 획기적인 기술을 입증함.
                    </p>
                  </div>
                </div>
              )}

              {/* 테마 2: 포브스 잡지 표지 */}
              {activeTheme === 'forbes' && (
                <div className="forbes-card-landing">
                  <div className="card-holo-overlay"></div>
                  <div className="forbes-header">
                    <h2 className="forbes-logo-title">Forbes</h2>
                    <div className="forbes-meta-vol">SPECIAL EDITION • ISSUE 30</div>
                  </div>

                  <div className="forbes-headline">30 UNDER 30 INFLUENTIAL MAKER</div>

                  <div className="forbes-photo-frame">
                    <div className="forbes-photo-inner">
                      <video 
                        key="forbes"
                        src={themeVideos.forbes} 
                        className="forbes-avatar-video"
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                      />
                    </div>
                    <div className="forbes-name-tag">김민경 (Connect AI LAB 연구원)</div>
                  </div>

                  <div className="forbes-body-text">
                    <h4>💼 "글로벌 1인 창업가들의 엑싯 루트를 밝히다"</h4>
                    <p className="forbes-para">
                      직원 0명으로 마케팅 자동화와 보일러플레이트 패키징 판매를 통해 엄청난 순이익을 달성하며 국내 1인 IT 생태계를 선도.
                    </p>
                  </div>
                </div>
              )}

              {/* 테마 3: 모바일 동영상 청첩장 */}
              {activeTheme === 'wedding' && (
                <div className="wedding-card-landing">
                  <div className="wedding-blossoms">
                    <div className="wb-petal1">🌸</div>
                    <div className="wb-petal2">🌸</div>
                    <div className="wb-petal3">🌸</div>
                  </div>
                  <div className="wedding-header">
                    <div className="wedding-subtitle">THE WEDDING INVITATION</div>
                    <h2 className="wedding-logo-title">소중한 날, 초대합니다</h2>
                  </div>

                  <div className="wedding-photo-frame">
                    <div className="wedding-photo-inner">
                      <video 
                        key="wedding"
                        src={themeVideos.wedding} 
                        className="wedding-avatar-video"
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                      />
                    </div>
                    <div className="wedding-name-tag">김현우 🖤 이지은</div>
                  </div>

                  <div className="wedding-body-text">
                    <h4>💒 "저희 두 사람, 부부의 연을 맺습니다"</h4>
                    <p className="wedding-para">
                      가장 아름다운 청년의 날에 만나 서로의 신뢰를 바탕으로 하나 됨을 이루고자 합니다. 저희의 시작을 축복해 주세요.
                    </p>
                    <div className="wedding-date-place">
                      2026. 10. 10. SAT AM 11:00 <br />
                      아름다운 컨벤션 그랜드볼룸
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 💳 가격 책정 및 사전 예약 (Pre-order) 폼 */}
      <section className="landing-pricing-section">
        <div className="pricing-header">
          <h2>💵 가격 정책 & 사전 구매 검증</h2>
          <p>마크 루처럼, 사람들이 실제로 카드 번호를 누르거나 메일을 적을 준비가 되어 있는지 확인하는 사업성 검증 구역입니다.</p>
        </div>

        <div className="pricing-cards-grid">
          {/* 플랜 1: 프리미엄 플랜 */}
          <div className={`pricing-card-box ${selectedPlan === 'pro' ? 'active-glow' : ''}`} onClick={() => setSelectedPlan('pro')}>
            <div className="popular-badge">PRE-ORDER POPULAR</div>
            <h3>🪄 Wizard Pro</h3>
            <div className="price-tag-row">
              <span className="price-del">29,000원</span>
              <span className="price-val">9,900원</span>
              <span className="price-period">/ 평생 소장</span>
            </div>
            <p className="pricing-desc">초기 후원자 90% 한정 파격 선구매 혜택</p>
            <ul className="plan-feature-list">
              <li><Check size={14} className="text-green" /> <span>WizardCV 워터마크 영구 제거</span></li>
              <li><Check size={14} className="text-green" /> <span>3대 비주얼 테마 (마법사, 포브스, SF)</span></li>
              <li><Check size={14} className="text-green" /> <span>4K 초고화질 출력 지원</span></li>
              <li><Check size={14} className="text-green" /> <span>이메일 전송용 특수 HTML 템플릿 포함</span></li>
            </ul>
          </div>

          {/* 플랜 2: 무료 플랜 */}
          <div className={`pricing-card-box ${selectedPlan === 'free' ? '' : ''}`} onClick={() => setSelectedPlan('free')}>
            <h3>💡 Basic Free</h3>
            <div className="price-tag-row">
              <span className="price-val">무료</span>
            </div>
            <p className="pricing-desc">기본 기능 무료 체험 플랜</p>
            <ul className="plan-feature-list">
              <li><Check size={14} className="text-gray" /> <span>Daily Prophet 신문 테마 1종</span></li>
              <li><Check size={14} className="text-gray" /> <span>우측 하단 워터마크 노출</span></li>
              <li><Check size={14} className="text-gray" /> <span>일반 화질 다운로드만 가능</span></li>
              <li><Check size={14} className="text-gray" /> <span>이메일 다이렉트 전송 제외</span></li>
            </ul>
          </div>
        </div>

        {/* 사전예약 신청 폼 */}
        <div className="subscription-form-card">
          {!hasSubscribed ? (
            <form onSubmit={handleSubscribe} className="landing-sub-form">
              <h4>
                {selectedPlan === 'pro' ? '🎁 평생 소장권 9,900원 예약 구매하기' : '✨ 무료 체험판 사전 예약하기'}
              </h4>
              <p className="form-sub-desc">
                이메일을 적어 예약해 주시면, 마법 합성 API 연동이 완료되는 즉시 가장 먼저 오픈 알림과 혜택을 쏴드립니다!
              </p>
              <div className="form-input-row">
                <input 
                  type="email" 
                  required 
                  className="sub-email-input"
                  placeholder="알림을 받으실 이메일을 입력하세요."
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
                <button type="submit" className="btn-sub-submit">
                  <Wand2 size={16} />
                  <span>사전예약 신청하기</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="subscription-success-box animate-fade-in">
              <Award size={36} className="text-gold animate-bounce" />
              <h3>사전 예약 신청이 성공적으로 완료되었습니다!</h3>
              <p>
                대표님! 예약 데이터가 로컬 데이터베이스(localStorage)에 정상 로그되었습니다. <br />
                실제 서비스 출시 시, 이 대기열에 쌓인 가입자들을 대상으로 마케팅 이메일을 즉시 발송하실 수 있습니다.
              </p>
              <button className="btn-preorder-reset" onClick={() => setHasSubscribed(false)}>추가 등록하기</button>
            </div>
          )}
        </div>
      </section>

      {/* 📊 대표님 대시보드: 수집된 가망 고객 목록 리포트 */}
      <section className="landing-admin-logs-section">
        <div className="admin-header-row">
          <Users size={20} className="text-cyan" />
          <h3>📊 실시간 사전예약 고객 DB 로그 (대표님 전용 모니터)</h3>
        </div>
        <p className="admin-desc">
          마크 루의 실험 방식처럼, 페이지를 빌딩하고 유입된 트래픽 중 몇 명이 가입했는지 실시간 데이터베이스 기록을 보여줍니다. 
          실제 사용자들의 반응 여부를 판단하는 지표입니다.
        </p>

        <div className="admin-db-table-wrapper">
          {preorders.length === 0 ? (
            <div className="empty-db-state">
              <Mail size={32} />
              <p>아직 수집된 가망 고객 이메일이 없습니다. 위 폼에 가상의 메일을 입력해 작동을 검증해 보세요, 대표님!</p>
            </div>
          ) : (
            <table className="admin-db-table">
              <thead>
                <tr>
                  <th>번호</th>
                  <th>고객 가망 이메일</th>
                  <th>선택 플랜</th>
                  <th>신청 일시</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {preorders.map((po, index) => (
                  <tr key={index}>
                    <td>{preorders.length - index}</td>
                    <td className="db-email">{po.email}</td>
                    <td>
                      <span className={`db-plan-badge ${po.plan}`}>
                        {po.plan === 'pro' ? '👑 PRO 선구매' : '💡 FREE 예약'}
                      </span>
                    </td>
                    <td>{new Date(po.date).toLocaleString('ko-KR')}</td>
                    <td><span className="db-status-active">● 대기열 등록됨</span></td>
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

export default WizardCVLanding;
