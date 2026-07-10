import React, { useState } from 'react';
import './CaseStudy.css';
import { Sparkles, TrendingUp, DollarSign, Award, Layers, AlertTriangle, ArrowRight, CheckCircle2, ChevronRight, User, ExternalLink, Calculator, RefreshCw } from 'lucide-react';

function CaseStudy() {
  const [activeTab, setActiveTab] = useState('summary');

  // LTV & CAC 시뮬레이터 상태 선언
  const [adSpend, setAdSpend] = useState(1000);       // 인플루언서 광고 단가 ($)
  const [reach, setReach] = useState(50000);          // 예상 조회수/노출수 (회)
  const [clickRate, setClickRate] = useState(2.0);    // 클릭률 (%)
  const [installRate, setInstallRate] = useState(20); // 앱 설치율 (%)
  const [subRate, setSubRate] = useState(5.0);        // 설치 후 구독 전환율 (%)
  const [subPrice, setSubPrice] = useState(10);       // 구독 가격 (월 $)
  const [retention, setRetention] = useState(6);      // 평균 유지 개월수 (개월)

  // 매출 비교 데이터
  const foundersRevenue = [
    { name: "Zach Yadegari (Cal AI)", peakMRR: "$5,700,000", keyProduct: "Cal AI (사진 → 칼로리)", scaleBreak: true },
    { name: "Pieter Levels (Photo AI 등)", peakMRR: "$420,000", keyProduct: "Photo AI (AI 사진)" },
    { name: "Danny Postma (HeadshotPro 등)", peakMRR: "$300,000", keyProduct: "HeadshotPro (AI 헤드샷)" },
    { name: "PJ Aceturo (Genre AI)", peakMRR: "$120,000", keyProduct: "Genre AI (AI 광고 대행)", pjHighlight: true },
    { name: "Adavia Davis (페이스리스 채널)", peakMRR: "$60,000", keyProduct: "유튜브 애드센스 광고" },
    { name: "Rachel Draelos (Cydoc - 실패)", peakMRR: "$330", keyProduct: "의학 AI (평생 $27,900)" }
  ];

  return (
    <div className="casestudy-container">
      {/* 🚀 상단 헤더 배너 */}
      <header className="study-hero">
        <div className="study-hero-badge">🧪 Connect AI LAB • Case Study</div>
        <h1 className="study-hero-title">
          직원 0명, <span className="highlight-text">월 수억 ~ 수십억</span>을 버는 글로벌 AI 1인 기업가들
        </h1>
        <p className="study-hero-sub">
          실제로 어떻게 돈을 벌고, 어떤 사이트와 채널을 운영하며 어떻게 <b>매각(엑싯)</b>에 성공했는지 실제 수치와 비즈니스 모델을 총정리했습니다.
        </p>
      </header>

      {/* 🧭 내부 탭 메뉴 */}
      <nav className="study-tabs">
        <button className={activeTab === 'summary' ? 'active' : ''} onClick={() => setActiveTab('summary')}>📊 요약 대시보드</button>
        <button className={activeTab === 'category' ? 'active' : ''} onClick={() => setActiveTab('category')}>🗺️ 카테고리 지도</button>
        <button className={activeTab === 'zach' ? 'active' : ''} onClick={() => setActiveTab('zach')}>📸 Zach Yadegari (Cal AI)</button>
        <button className={activeTab === 'levels' ? 'active' : ''} onClick={() => setActiveTab('levels')}>📸 Pieter Levels (5억 신화)</button>
        <button className={activeTab === 'postma' ? 'active' : ''} onClick={() => setActiveTab('postma')}>💳 Danny Postma (엑싯 스페셜)</button>
        <button className={activeTab === 'pj' ? 'active' : ''} onClick={() => setActiveTab('pj')}>🎬 PJ Aceturo (Genre AI 신규)</button>
        <button className={activeTab === 'marc' ? 'active' : ''} onClick={() => setActiveTab('marc')}>⚡ Marc Lou (밈 마케팅)</button>
        <button className={activeTab === 'adavia' ? 'active' : ''} onClick={() => setActiveTab('adavia')}>📺 Adavia (페이스리스)</button>
        <button className={activeTab === 'cydoc' ? 'active' : ''} onClick={() => setActiveTab('cydoc')}>🏥 Cydoc (폐업 반례)</button>
        <button className={activeTab === 'lessons' ? 'active' : ''} onClick={() => setActiveTab('lessons')}>💡 핵심 교훈 5</button>
      </nav>

      {/* 📄 탭 1: 요약 대시보드 */}
      {activeTab === 'summary' && (
        <div className="tab-pane animate-fade-in">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">0명</div>
              <div className="stat-label">평균 직원 수</div>
              <div className="stat-desc">혼자서 모든 것을 자동화하여 개발/운영</div>
            </div>
            <div className="stat-card">
              <div className="stat-value text-green">$5.7M</div>
              <div className="stat-label">월 최대 매출 (피크)</div>
              <div className="stat-desc">약 89억 원 (Zach Yadegari, Cal AI)</div>
            </div>
            <div className="stat-card">
              <div className="stat-value text-purple">87%</div>
              <div className="stat-label">평균 순이익률</div>
              <div className="stat-desc">인건비 및 사무실 유지 비용 0원에 수렴</div>
            </div>
            <div className="stat-card">
              <div className="stat-value text-amber">18개월</div>
              <div className="stat-label">0에서 620억 엑싯</div>
              <div className="stat-desc">Cal AI 고속 유통 & 엑싯 완료 기준</div>
            </div>
          </div>

          <div className="dashboard-section-grid">
            {/* 매출 비교 바 차트 */}
            <div className="chart-card">
              <h3>💰 월 최대 매출 비교</h3>
              <div className="bar-chart">
                {foundersRevenue.map((founder, idx) => {
                  let pct = 0;
                  if (founder.scaleBreak) {
                    pct = 95;
                  } else {
                    const currentVal = parseInt(founder.peakMRR.replace(/[^0-9]/g, '')) * (founder.peakMRR.includes('K') ? 1000 : 1);
                    pct = (currentVal / 420000) * 65; // 최대 65% 수준으로 고정 매핑
                  }
                  return (
                    <div key={idx} className={`chart-bar-row ${founder.scaleBreak ? 'scale-break' : ''} ${founder.pjHighlight ? 'pj-highlight' : ''}`}>
                      <span className="founder-name" title={founder.name}>
                        {founder.name.split(' ')[0]}
                        {founder.scaleBreak && <span className="scale-badge">15x 🔥</span>}
                        {founder.pjHighlight && <span className="scale-badge pj-badge">신규 🎬</span>}
                      </span>
                      <div className="bar-track">
                        <div 
                          className="bar-fill" 
                          style={{ 
                            width: `${pct}%`, 
                            background: founder.scaleBreak 
                              ? 'linear-gradient(90deg, #f97316, #ea580c)' 
                              : (founder.pjHighlight ? 'linear-gradient(90deg, #A068FF, #7c3aed)' : (founder.name.includes('실패') ? '#ef4444' : 'linear-gradient(90deg, #3b82f6, #8b5cf6)')) 
                          }}
                        ></div>
                      </div>
                      <span className="bar-value">{founder.peakMRR}</span>
                    </div>
                  );
                })}
              </div>
              <p className="chart-note">* 본인 공개 수치 기준이며 피크 시점 매출입니다. 잭 야데가리의 Cal AI는 다른 1인 메이커 대비 15배 이상 거대하여 스케일 브레이크(//)를 적용했습니다.</p>
            </div>

            {/* 엑싯(Exit) 모델 소개 */}
            <div className="chart-card highlight-border">
              <div className="card-header-badge"><Sparkles size={12} /> 대표님이 눈여겨보신 모델</div>
              <h3>🏷️ 1인 AI 기업의 꽃: '매각(엑싯) 테크'</h3>
              <p className="card-prose">
                1인 AI 기업은 대기업처럼 평생 운영할 필요가 없사옵니다. 트렌드를 선점해 빠르게 서비스를 만들고, <b>가장 몸값이 높을 때 매각(Exit)하여 일시금으로 자산을 확보</b>하는 테크트리가 대표적입니다.
              </p>
              <div className="exit-examples">
                <div className="exit-item">
                  <div className="exit-icon">📸</div>
                  <div className="exit-info">
                    <strong>Cal AI 매각 (개인 몫 약 $40M / 620억 원)</strong>
                    <span>17세 고등학생 창업 ➡️ 18개월 만에 칼로리 앱의 원조 공룡 <b>MyFitnessPal</b>에 매각 및 엑싯 완료</span>
                  </div>
                </div>
                <div className="exit-item">
                  <div className="exit-icon">💎</div>
                  <div className="exit-info">
                    <strong>Headlime 매각 ($1M / 약 14억 원)</strong>
                    <span>GPT-3 카피라이팅 툴 ➡️ <b>$1,000,000</b>에 Jasper에 매각 (출시 8개월 만)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📄 탭 2: 카테고리 지도 */}
      {activeTab === 'category' && (
        <div className="tab-pane animate-fade-in">
          <div className="section-intro">
            <h2>어떤 걸 만들어야 돈이 되고 엑싯할 수 있나</h2>
            <p>실제 글로벌 시장에서 검증된 카테고리와, 아무리 열심히 일해도 원가 구조 때문에 망하는 카테고리 분류표입니다.</p>
          </div>

          <h3 className="category-title text-green">💰 잘 버는 카테고리 (높은 마진 & 엑싯 유리)</h3>
          <div className="category-grid">
            <div className="cat-card success-border">
              <span className="cat-icon">🎬</span>
              <h4>AI 영상 및 광고 대행 (차익거래)</h4>
              <div className="rating">●●●●●</div>
              <p className="cat-ex">Genre AI ($120K/월) • 광고 대행 및 에이전시</p>
              <p className="cat-desc">제작 단가는 99% 무너뜨리고 브랜드 광고 예산은 그대로 수취. 마진 90%+의 초핵심 영역.</p>
            </div>
            <div className="cat-card success-border">
              <span className="cat-icon">📸</span>
              <h4>AI 사진 · 이미지</h4>
              <div className="rating">●●●●●</div>
              <p className="cat-ex">Photo AI ($420K/월) • HeadshotPro ($300K/월)</p>
              <p className="cat-desc">"나의 프로필 사진"이라는 개인의 확실한 소유/지불 욕구 공략. 높은 마진율 확보.</p>
            </div>
            <div className="cat-card success-border">
              <span className="cat-icon">🤖</span>
              <h4>AI 생산성 도구 (B2B SaaS)</h4>
              <div className="rating">●●●●○</div>
              <p className="cat-ex">Chatbase • SiteGPT • TypingMind</p>
              <p className="cat-desc">기업의 챗봇 고객응대, 문서 요약, 글쓰기 등 업무 비효율을 해결해주고 정기 구독료 수취.</p>
            </div>
            <div className="cat-card success-border">
              <span className="cat-icon">📚</span>
              <h4>정보 · 교육 · 뉴스레터</h4>
              <div className="rating">●●●●○</div>
              <p className="cat-ex">The Rundown AI • MAKE 전자책</p>
              <p className="cat-desc">퍼스널 브랜딩과 신뢰를 자산화. 원가 거의 0원, 강의 판매나 스폰서 광고 매출 위주.</p>
            </div>
          </div>

          <h3 className="category-title text-red" style={{ marginTop: '40px' }}>⚠️ 어렵거나 망하기 쉬운 카테고리 (원가 붕괴)</h3>
          <div className="category-grid">
            <div className="cat-card danger-border">
              <span className="cat-icon">🏥</span>
              <h4>원가 &gt; 가격상한 (규제/헬스 AI)</h4>
              <div className="rating">●○○○○</div>
              <p className="cat-ex">Cydoc (7년간 평생 매출 3,900만 원)</p>
              <p className="cat-desc">API와 서버 호스팅비 등의 원가가 고객의 지불 의사보다 비싸서 팔수록 적자가 나는 구조.</p>
            </div>
            <div className="cat-card danger-border">
              <span className="cat-icon">🪞</span>
              <h4>차별화 없는 단순 GPT 래퍼</h4>
              <div className="rating">●●○○○</div>
              <p className="cat-ex">카피캣 아바타 생성기들</p>
              <p className="cat-desc">누구나 하루 만에 복제 가능하여 단숨에 단가 후려치기 SEO 경쟁으로 진흙탕이 됨.</p>
            </div>
          </div>
        </div>
      )}

      {/* 📄 탭 2.5: Zach Yadegari (Cal AI) */}
      {activeTab === 'zach' && (() => {
        // 실시간 시뮬레이터 계산
        const totalClicks = Math.round(reach * (clickRate / 100));
        const totalInstalls = Math.round(totalClicks * (installRate / 100));
        const totalSubscribers = Math.round(totalInstalls * (subRate / 100));
        const cac = totalSubscribers > 0 ? parseFloat((adSpend / totalSubscribers).toFixed(2)) : 0;
        const ltv = parseFloat((subPrice * retention).toFixed(2));
        const ltvCacRatio = cac > 0 ? parseFloat((ltv / cac).toFixed(2)) : 0;
        const paybackPeriod = subPrice > 0 ? parseFloat((cac / subPrice).toFixed(1)) : 0;
        const totalRevenue = totalSubscribers * ltv;
        const netProfit = totalRevenue - adSpend;
        const roi = adSpend > 0 ? parseFloat(((netProfit / adSpend) * 100).toFixed(0)) : 0;

        // 처방전 판정
        let prescriptionClass = 'warning';
        let prescriptionTitle = '';
        let prescriptionText = '';
        if (ltvCacRatio >= 3.0) {
          prescriptionClass = 'success';
          prescriptionTitle = '🚀 대표님, 지금 당장 실탄을 태우셔야 합니다! (돈 복사기 작동 중)';
          prescriptionText = `LTV/CAC 비율이 무려 ${ltvCacRatio}배로, 이상적인 스케일업 기준선인 3배를 가뿐히 넘겼습니다. 획득비용($${cac}) 대비 고객가치($${ltv})가 압도적입니다. 페이백 기간도 ${paybackPeriod}개월로 짧아 회수한 현금을 내일 바로 광고비로 재투입할 수 있는 최적의 세팅입니다.`;
        } else if (ltvCacRatio >= 1.0) {
          prescriptionClass = 'warning';
          prescriptionTitle = '⚠️ 위험하진 않으나 마진이 협소합니다 (수정 권고)';
          prescriptionText = `LTV/CAC 비율이 ${ltvCacRatio}배로 광고비 회수는 가능하지만, 스케일업하기에는 체력이 부족합니다. 인플루언서 숏폼의 훅을 교체해 유입 클릭률(${clickRate}%)을 높이거나, 가격($${subPrice})을 인상해 LTV를 키우시길 권장합니다.`;
        } else {
          prescriptionClass = 'danger';
          prescriptionTitle = '🚨 절대 스케일업 금지! 적자 퍼널입니다 (즉시 피벗 필요)';
          prescriptionText = `LTV/CAC 비율이 ${ltvCacRatio}배로, 고객을 1명 유치할 때마다 $${Math.abs(ltv - cac).toFixed(2)}씩 손해가 납니다. Cydoc(사이독) 사례처럼 깨진 독에 물 붓기가 됩니다. 광고 단가를 깎거나, 음식 사진 3초 촬영처럼 강력한 마찰 제거 포인트를 찾아 구독 전환율(${subRate}%)을 극적으로 개선해야 합니다.`;
        }

        return (
          <div className="tab-pane founder-profile animate-fade-in">
            {/* 프로필 헤더 */}
            <div className="profile-header">
              <div className="profile-avatar">🇺🇸</div>
              <div className="profile-title-area">
                <span className="badge-role">유통의 경제학 (관심의 차익거래)</span>
                <h2>Zach Yadegari (Cal AI)</h2>
                <p className="profile-tagline">"고등학생 수업 시간에 만든 앱으로 19살에 620억 엑싯."</p>
              </div>
              <div className="profile-revenue-badge" style={{ borderColor: '#f97316', background: '#fff7ed' }}>
                <span className="badge-label">피크 연매출 (ARR)</span>
                <span className="badge-num" style={{ color: '#ea580c' }}>$50M+</span>
                <span className="badge-sub">₩780억/년 돌파 시점 매각</span>
              </div>
            </div>

            <div className="profile-body">
              <div className="body-column">
                <h3>📢 Zach의 숏폼 바이럴 유통 공식</h3>
                <p className="prose">
                  Zach는 앱 완성도나 복잡한 알고리즘보다 **'유통(Distribution)'**에 집착했습니다. 
                  그는 틱톡과 릴스에서 가장 잘 나가는 10대 크리에이터 수십 명을 섭외해, 그들에게 앱 지분(Equity)과 광고비를 주며 공격적인 숏폼 마케팅을 펼쳤습니다.
                </p>
                
                <h4 style={{ marginTop: '20px', marginBottom: '10px', fontSize: '14px', fontWeight: '700' }}>📊 LTV & CAC 시뮬레이터</h4>
                <div className="calculator-box">
                  <div className="calc-inputs">
                    <div className="input-group">
                      <div className="input-header">
                        <label>💵 인플루언서 광고 단가</label>
                        <span className="input-val-display">${adSpend.toLocaleString()}</span>
                      </div>
                      <input type="range" min="100" max="10000" step="100" value={adSpend} onChange={(e) => setAdSpend(Number(e.target.value))} className="slider-input" />
                    </div>

                    <div className="input-group">
                      <div className="input-header">
                        <label>👁️ 예상 숏폼 조회수 (Reach)</label>
                        <span className="input-val-display">{reach.toLocaleString()}회</span>
                      </div>
                      <input type="range" min="1000" max="500000" step="5000" value={reach} onChange={(e) => setReach(Number(e.target.value))} className="slider-input" />
                    </div>

                    <div className="input-group">
                      <div className="input-header">
                        <label>🖱️ 프로필 링크 클릭률 (CTR)</label>
                        <span className="input-val-display">{clickRate}%</span>
                      </div>
                      <input type="range" min="0.1" max="10.0" step="0.1" value={clickRate} onChange={(e) => setClickRate(Number(e.target.value))} className="slider-input" />
                    </div>

                    <div className="input-group">
                      <div className="input-header">
                        <label>📥 앱 설치 전환율</label>
                        <span className="input-val-display">{installRate}%</span>
                      </div>
                      <input type="range" min="1" max="50" step="1" value={installRate} onChange={(e) => setInstallRate(Number(e.target.value))} className="slider-input" />
                    </div>

                    <div className="input-group">
                      <div className="input-header">
                        <label>💳 설치 후 구독 전환율</label>
                        <span className="input-val-display">{subRate}%</span>
                      </div>
                      <input type="range" min="0.5" max="20.0" step="0.5" value={subRate} onChange={(e) => setSubRate(Number(e.target.value))} className="slider-input" />
                    </div>

                    <div className="input-group">
                      <div className="input-header">
                        <label>💰 월 구독 가격</label>
                        <span className="input-val-display">${subPrice}</span>
                      </div>
                      <input type="range" min="1" max="50" step="1" value={subPrice} onChange={(e) => setSubPrice(Number(e.target.value))} className="slider-input" />
                    </div>

                    <div className="input-group">
                      <div className="input-header">
                        <label>⏱️ 평균 구독 유지 기간 (LTV 기준)</label>
                        <span className="input-val-display">{retention}개월</span>
                      </div>
                      <input type="range" min="1" max="24" step="1" value={retention} onChange={(e) => setRetention(Number(e.target.value))} className="slider-input" />
                    </div>
                  </div>

                  {/* 결과창 그룹 */}
                  <div className="calc-results">
                    <span className="results-title">⚡ 시뮬레이션 결과 리포트</span>
                    
                    <div className="metric-row">
                      <span className="metric-label">예상 획득 구독자</span>
                      <span className="metric-value highlight-blue">{totalSubscribers}명</span>
                    </div>

                    <div className="metric-row">
                      <span className="metric-label">고객 획득 비용 (CAC)</span>
                      <span className="metric-value" style={{ color: cac > ltv ? '#ef4444' : '#0f172a' }}>${cac}</span>
                    </div>

                    <div className="metric-row">
                      <span className="metric-label">고객 생애 가치 (LTV)</span>
                      <span className="metric-value highlight-green">${ltv}</span>
                    </div>

                    <div className="metric-divider"></div>

                    <div className="metric-row">
                      <span className="metric-label">LTV / CAC 비율</span>
                      <span className={`metric-value ${ltvCacRatio >= 3.0 ? 'highlight-green' : ltvCacRatio >= 1.0 ? 'highlight-purple' : ''}`} style={{ color: ltvCacRatio < 1.0 ? '#ef4444' : undefined }}>
                        {ltvCacRatio}x
                      </span>
                    </div>

                    <div className="metric-row">
                      <span className="metric-label">광고비 페이백 기간</span>
                      <span className="metric-value highlight-purple">{paybackPeriod}개월</span>
                    </div>

                    <div className="metric-row">
                      <span className="metric-label">예상 순이익 / ROI</span>
                      <span className="metric-value" style={{ color: netProfit > 0 ? '#10b981' : '#ef4444' }}>
                        ${netProfit.toLocaleString()} ({roi}%)
                      </span>
                    </div>

                    {/* 처방전 박스 */}
                    <div className={`prescription-box ${prescriptionClass}`}>
                      <div className="prescription-header">
                        <Sparkles size={14} />
                        <span>{prescriptionTitle}</span>
                      </div>
                      <p className="prescription-desc">{prescriptionText}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 📄 탭 3: Pieter Levels */}
      {activeTab === 'levels' && (
        <div className="tab-pane founder-profile animate-fade-in">
          <div className="profile-header">
            <div className="profile-avatar">🇳🇱</div>
            <div className="profile-title-area">
              <span className="badge-role">1인 AI 기업의 상징</span>
              <h2>Pieter Levels (@levelsio)</h2>
              <p className="profile-tagline">"단 하나의 index.php 파일로 월 1억 이상을 번다."</p>
            </div>
            <div className="profile-revenue-badge">
              <span className="badge-label">피크 월매출</span>
              <span className="badge-num">$420,000</span>
              <span className="badge-sub">약 5.9억 원 (순이익률 87%)</span>
            </div>
          </div>

          <div className="profile-body">
            <div className="body-column">
              <h3>🛠️ 대표 서비스 목록</h3>
              <ul className="product-list">
                <li>
                  <strong className="text-pink">Photo AI (photoai.com)</strong>
                  <span>셀카 몇 장으로 무한히 고품질 AI 프로필을 만드는 서비스. 그의 메인 수입원(70%).</span>
                </li>
                <li>
                  <strong>Nomad List (nomads.com)</strong>
                  <span>전 세계 디지털 노마드용 도시 랭킹/커뮤니티. Levels의 첫 성공작.</span>
                </li>
                <li>
                  <strong>RemoteOK (remoteok.com)</strong>
                  <span>글로벌 채용 공고를 중개하며 올리는 수수료 기반 세계 최대 구인판.</span>
                </li>
                <li>
                  <strong className="text-purple">fly.pieter.com</strong>
                  <span>Cursor AI 비행 시뮬레이터 게임. 단 3시간 만에 AI와 대화로 제작. 17일 만에 ARR $1M 광고 슬롯 판매 성공. (Vibe Coding의 아이콘)</span>
                </li>
              </ul>
            </div>

            <div className="body-column">
              <h3>💡 핵심 전략 & 교훈</h3>
              <div className="tip-box">
                <strong>1) Build in Public (공개 창업)</strong>
                <p>매출, 서버 비용, 심지어 서비스 실패 과정까지 모두 X(트위터)에 실시간으로 공유하며 수많은 인디 팬덤을 확보했습니다. 이것이 최고의 마케팅 채널이 되었습니다.</p>
              </div>
              <div className="tip-box">
                <strong>2) 70번의 실패 끝에 한 번 터진 대박</strong>
                <p>levels는 수많은 데이팅 앱, 공유 경제 서비스를 만들었다가 다 말아먹었습니다. "실패는 기본이고, 그중 하나가 터질 때까지 빠르게 다작(多作)하는 것이 핵심"이라고 조언합니다.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📄 탭 4: Danny Postma */}
      {activeTab === 'postma' && (
        <div className="tab-pane founder-profile animate-fade-in">
          <div className="profile-header">
            <div className="profile-avatar">🌴</div>
            <div className="profile-title-area">
              <span className="badge-role text-gold">프로 매각(엑싯) 인디해커</span>
              <h2>Danny Postma (@dannypostmaa)</h2>
              <p className="profile-tagline">"8개월 만에 14억 엑싯, 발리에서 만드는 AI 헤드샷 제국."</p>
            </div>
            <div className="profile-revenue-badge" style={{ borderColor: '#fbbf24' }}>
              <span className="badge-label">주력 서비스 월매출</span>
              <span className="badge-num text-gold">$300,000</span>
              <span className="badge-sub">HeadshotPro 단독 매출</span>
            </div>
          </div>

          <div className="profile-body">
            <div className="body-column">
              <div className="exit-focus-box">
                <span className="gold-icon">🏆</span>
                <h3>대표님이 흥미로워하신 'Danny의 매각(엑싯) 역사'</h3>
                <p>Danny Postma는 소규모 1인 비즈니스를 단기간에 기획하여 시스템화한 뒤, 가장 가치가 높을 때 깔끔하게 판매하여 목돈을 쥐는 <b>'인디 엑싯의 교과서'</b>이옵니다.</p>
                <div className="exit-timeline">
                  <div className="timeline-node">
                    <span className="node-title">💸 Headlime 매각 ($1M / 약 14억)</span>
                    <p>마케터용 GPT-3 카피라이팅 툴. 출시 초기 라이프타임 구독으로 초기 개발비를 수집하고, 8개월 만에 글로벌 대형 AI 툴인 Jasper에 약 14억 원을 받고 회사를 매각했습니다.</p>
                  </div>
                  <div className="timeline-node">
                    <span className="node-title">🎨 TattoosAI 매각 ($98,000 / 약 1.3억)</span>
                    <p>그가 연습 삼아 만들었던 인공지능 타투 도안 생성기입니다. 2024년 3월, 인디 개발자에게 트위터로 깔끔하게 1.3억 원에 양도 매각하여 화제를 모았습니다.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="body-column">
              <h3>🚀 그가 구사한 '치트키' 마케팅 무기</h3>
              <div className="tip-box">
                <strong>1) Programmatic SEO (프로그래매틱 SEO)</strong>
                <p>Danny는 광고비를 거의 쓰지 않고 구글 유입으로만 트래픽을 먹습니다. "professional headshots [New York]", "professional headshots [London]" 등 전 세계 200개 이상 도시 이름으로 이루어진 랜딩페이지를 코드로 자동 생성하여 채용 사진을 찾는 구글 트래픽을 싹 쓸어 모았습니다.</p>
              </div>
              <div className="tip-box">
                <strong>2) 도메인 자산 크로스 마케팅 (깔때기 전략)</strong>
                <p>PFP(프로필 사진)를 만들러 온 사람들은 결국 비즈니스용 헤드샷도 필요로 한다는 점에 착안, 12년 된 오래된 프로필 메이커 도메인(`profilepicturemaker.com`)을 인수하여 해당 트래픽을 본인의 메인 유료 서비스인 `HeadshotPro`로 자연스럽게 넘겨주는 깔때기를 구축했습니다.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📄 신규 탭: PJ Aceturo (Genre AI) */}
      {activeTab === 'pj' && (
        <div className="tab-pane founder-profile animate-fade-in">
          <div className="profile-header" style={{ borderBottomColor: 'rgba(160, 104, 255, 0.2)' }}>
            <div className="profile-avatar" style={{ background: 'rgba(160, 104, 255, 0.1)', color: '#A068FF' }}>🎬</div>
            <div className="profile-title-area">
              <span className="badge-role" style={{ background: 'rgba(160, 104, 255, 0.1)', color: '#A068FF' }}>원가 붕괴 차익거래의 대가</span>
              <h2>PJ Aceturo (Genre AI)</h2>
              <p className="profile-tagline">"전통 제작비의 99%를 무너뜨린 2,000달러 광고로 5,000만 뷰 돌파."</p>
            </div>
            <div className="profile-revenue-badge" style={{ borderColor: '#A068FF' }}>
              <span className="badge-label">프로젝트당 대행 단가</span>
              <span className="badge-num" style={{ color: '#A068FF' }}>$50,000+</span>
              <span className="badge-sub">마진율 90% 이상 확보</span>
            </div>
          </div>

          <div className="profile-body">
            <div className="body-column">
              <h3>🎨 촬영팀 없이 혼자 만드는 AI 광고 파이프라인</h3>
              <p className="prose">
                PJ는 수억 원의 제작비와 수십 명의 인력이 들던 광고 촬영을 <strong>Gemini, Veo3, CapCut</strong>을 활용해 노트북 한 대로 단 2~3일 만에 종결시켰습니다.
              </p>
              <ul className="product-list" style={{ marginTop: '16px' }}>
                <li><strong>각본 (ChatGPT)</strong>: 광고 기획안과 메시지 뼈대 구성</li>
                <li><strong>샷 리스트 & 프롬프트 (Gemini)</strong>: 씬을 연출 콘티로 번역</li>
                <li><strong>영상 생성 (Veo3)</strong>: 300~400개 소스를 대량 생성 후 단 15개의 씬만 엄선 (다작의 힘)</li>
                <li><strong>편집 (CapCut/프리미어)</strong>: 최종 편집 및 시각화 마무리</li>
              </ul>

              <div className="sawdust-box" style={{ background: 'rgba(160, 104, 255, 0.03)', borderColor: 'rgba(160, 104, 255, 0.15)' }}>
                <h4 style={{ color: '#7c3aed' }}>💡 핵심 뼈대: "실행이 무료화될 때, 안목이 가치 있다"</h4>
                <p>
                  누구나 AI로 영상을 생성할 수 있는 시대가 되자 오히려 "어떤 컷을 고르고, 어떻게 리듬감을 연출할 것인가"라는 <strong>창작자의 안목</strong> 가치가 최고가로 올라섰습니다. 도구는 무료지만 안목은 복제 불가능한 해자입니다.
                </p>
              </div>
            </div>

            <div className="body-column">
              <h3>🌀 예쁨보다 화제성: "Weird(이상함)의 경제학"</h3>
              <p className="column-desc">유저들이 무표정하게 스크롤을 내리다 0.1초 만에 멈칫하게 만드는 '병맛'과 '초현실적 비주얼'이 성공 방정식입니다.</p>

              <div className="tip-box">
                <strong>1) NBA 결승 Kalshi 광고 ($2,000 제작비)</strong>
                <p>카우보이 할아버지, 맥주 외계인 등 Veo3로 뽑은 기괴하고 기발한 비주얼로 디즈니 ABC 방송 심의를 뚫고 5,000만 회 이상 조회수를 유기적으로 견인했습니다.</p>
              </div>
              <div className="tip-box">
                <strong>2) 실적이 영업을 대신한다 (Viral Loop)</strong>
                <p>영업 사원을 두지 않아도 바이럴 광고 한 편의 폭발적 성과를 보고 Oracle, Popeyes, 카타르 항공, 할리우드 영화 스튜디오 등에서 알아서 대행 의뢰를 요청해 왔습니다.</p>
              </div>
              <div className="tip-box danger-border" style={{ borderColor: '#A068FF', background: 'rgba(160, 104, 255, 0.01)' }}>
                <strong>3) 슈퍼볼 광고 거절: 무기를 지키는 선택</strong>
                <p>의사결정이 느리고 규제와 피드백 수정이 겹겹이 쌓이는 초대형 슈퍼볼 광고는 1인 AI 대행사의 핵심 가치인 '속도'와 '독창적 weird'함을 훼손하므로 과감히 거절했습니다.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📄 탭 8: Marc Lou */}
      {activeTab === 'marc' && (
        <div className="tab-pane founder-profile animate-fade-in">
          <div className="profile-header" style={{ borderBottomColor: 'rgba(139, 92, 246, 0.2)' }}>
            <div className="profile-avatar" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>⚡</div>
            <div className="profile-title-area">
              <span className="badge-role" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>1인 밈 마케팅의 황제</span>
              <h2>Marc Lou (@marc_louvion)</h2>
              <p className="profile-tagline">"코딩은 10%, 마케팅이 90%다. 유료 광고 0원으로 연 15억 버는 플레이북."</p>
            </div>
            <div className="profile-revenue-badge" style={{ borderColor: '#8b5cf6' }}>
              <span className="badge-label">포트폴리오 연매출</span>
              <span className="badge-num" style={{ color: '#8b5cf6' }}>$1,080,000</span>
              <span className="badge-sub">약 14.8억 원 (순이익률 90% 이상)</span>
            </div>
          </div>

          {/* Marc Lou의 핵심 대시보드 스태츠 */}
          <div className="marc-stats-grid">
            <div className="marc-stat-card">
              <div className="marc-stat-num">8개+</div>
              <div className="marc-stat-label">런칭한 마이크로 서비스</div>
            </div>
            <div className="marc-stat-card">
              <div className="marc-stat-num">11만 명</div>
              <div className="marc-stat-label">X(트위터) 오가닉 팔로워</div>
            </div>
            <div className="marc-stat-card">
              <div className="marc-stat-num">6회 연속</div>
              <div className="marc-stat-label">초기 프로젝트 실패 (포스트모템 거침)</div>
            </div>
            <div className="marc-stat-card">
              <div className="marc-stat-num">$149</div>
              <div className="marc-stat-label">ShipFast 평균 객단가 (단판 소장)</div>
            </div>
          </div>

          <div className="profile-body">
            <div className="body-column">
              <h3>🛠️ 마크 루의 대표 프로덕트 및 성과</h3>
              <ul className="product-list">
                <li>
                  <strong className="text-purple">ShipFast (shipfa.st)</strong>
                  <span>Next.js 보일러플레이트(결제, 메일, 로그인 패키지). 출시 60일 만에 8,800만 원 돌파. 1인 개발자의 20시간 세팅 시간을 즉시 절약해주는 핵심 수입원.</span>
                </li>
                <li>
                  <strong>Habits Garden (엑싯 완료)</strong>
                  <span>정원을 기르는 게이미피케이션 습관 형성 앱. 트위터 바이럴로 빌딩 후 타 개발자에게 깔끔하게 엑싯(Exit)하여 현금 확보.</span>
                </li>
                <li>
                  <strong>TrustMRR (trustmrr.com)</strong>
                  <span>Stripe 결제 API와 연동하여 1인 기업가들의 실제 매출 수치를 공인 인증해 주는 플랫폼. 신뢰 마케팅 도구로 활용.</span>
                </li>
                <li>
                  <strong>LaunchFast & PoopUp</strong>
                  <span>Astro/Remix용 보일러플레이트 및 크롬창에 똥이 뜨게 만드는 장난스런 마이크로 툴들(다작 전략).</span>
                </li>
              </ul>

              <div className="sawdust-box">
                <h4>🪵 핵심 전략: "톱밥을 팔아라 (Selling the Sawdust)"</h4>
                <p>
                  목공소에서 가구를 만들고 남은 톱밥도 훌륭한 상품이 되듯, 내가 메인 서비스를 빌딩하면서 깎아둔 **공통 로그인, 결제창 연동, 인프라 DB 세팅 코드**를 그대로 패키징하여 파는 모델입니다. 추가 개발 원가가 0원이기에 순이익률이 100%에 달합니다.
                </p>
              </div>
            </div>

            <div className="body-column">
              <h3>🎬 핵심 무기: "15초 밈(Meme) 마케팅 공식"</h3>
              <p className="column-desc">유료 광고를 전혀 집행하지 않고 X(트위터)와 숏폼 바이럴로만 매출을 올리는 프로세스입니다.</p>
              
              <div className="meme-workflow">
                <div className="workflow-step">
                  <div className="step-badge">STEP 1</div>
                  <strong>개발자들의 고통 발견</strong>
                  <p>"버그 고치려다 전체 서버를 날려버린 상황" 등 1인 개발자의 뼈아픈 공감대 포착</p>
                </div>
                <div className="workflow-step">
                  <div className="step-badge">STEP 2</div>
                  <strong>15초 병맛 릴스 촬영</strong>
                  <p>본인이 직접 바보 같은 연기를 펼치며 10초 내외의 빠른 비트 숏폼 비디오 제작</p>
                </div>
                <div className="workflow-step">
                  <div className="step-badge">STEP 3</div>
                  <strong>X(트위터) / 틱톡 바이럴</strong>
                  <p>공감대를 통해 수십만 뷰의 조회수 폭발 및 리트윗(RT) 유도</p>
                </div>
                <div className="workflow-step">
                  <div className="step-badge">STEP 4</div>
                  <strong>댓글 CTA 및 결제 유도</strong>
                  <p>"이런 뻘짓으로 시간 날리기 싫다면? 5분 만에 세팅되는 ShipFast 쓰세요" 결제 링크 삽입</p>
                </div>
              </div>

              <div className="local-ideas-box">
                <h4>🇰🇷 대표님을 위한 한국형 적용 방안</h4>
                <ul>
                  <li><strong>한국형 Next.js 스타터킷</strong>: 토스페이먼츠, 카카오/네이버 로그인, 알림톡 모듈을 미리 붙여둔 패키지 판매 (객단가 15만 원).</li>
                  <li><strong>네이버 블로그/SEO 자동화 툴</strong>: 네이버 검색 상위 노출에 최적화된 글을 하루 100개씩 네이버 API로 발행해주는 소형 보일러플레이트 판매.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📄 탭 5: Adavia Davis */}
      {activeTab === 'adavia' && (
        <div className="tab-pane founder-profile animate-fade-in">
          <div className="profile-header">
            <div className="profile-avatar">📺</div>
            <div className="profile-title-area">
              <span className="badge-role">페이스리스 유튜브 귀재</span>
              <h2>Adavia Davis</h2>
              <p className="profile-tagline">"얼굴 없는 유튜브 채널 양산으로 월 8천만 원 애드센스."</p>
            </div>
            <div className="profile-revenue-badge">
              <span className="badge-label">월 유튜브 매출</span>
              <span className="badge-num">$60,000</span>
              <span className="badge-sub">순수 광고 + 제휴 마케팅</span>
            </div>
          </div>

          <div className="profile-body">
            <div className="body-column">
              <h3>🎬 페이스리스(Faceless) 작동 방식</h3>
              <p className="prose">
                Adavia는 본인의 얼굴을 드러내지 않고, AI 자동 영상 제작 툴(TubeGen 등)과 TTS(성우 목소리) 엔진을 배치하여 <b>역사물, 동기부여, 무서운 이야기 등의 숏츠 및 롱폼 영상을 하루에 수십 개씩 업로드</b>하는 파이프라인을 구축했습니다.
              </p>
              <ul className="product-list" style={{ marginTop: '16px' }}>
                <li><strong>원가 최소화</strong>: 영상 제작에 들어가는 실제 원가는 월 $60 (약 8만 원) 수준으로, 애드센스 매출 대비 마진율이 99%에 달합니다.</li>
                <li><strong>파트너 협업</strong>: 툴 공동 창업자 및 AI 에이전트를 적절히 지휘하여 본인은 전체 기획과 업로드 통제만 수행합니다.</li>
              </ul>
            </div>

            <div className="body-column">
              <h3>⚠️ 대표님이 주의하셔야 할 리스크</h3>
              <div className="tip-box danger-border">
                <strong>플랫폼 알고리즘 의존성 (생사여탈권)</strong>
                <p>유튜브나 틱톡의 알고리즘 정책 변화 한 번에 트래픽이 1/10 토막이 날 수 있습니다. 또한 유사한 영상 양산에 따른 '저품질 채널 제재'의 가능성이 늘 상존하므로, SynthID 워터마크나 수작업 편집 가미 등의 회피 전략(프리미엄 지침)이 필수적입니다.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📄 탭 6: Cydoc (실패 반례) */}
      {activeTab === 'cydoc' && (
        <div className="tab-pane founder-profile animate-fade-in">
          <div className="profile-header" style={{ borderBottomColor: 'rgba(239, 68, 68, 0.2)' }}>
            <div className="profile-avatar" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>🏥</div>
            <div className="profile-title-area">
              <span className="badge-role" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>7년의 실패 기록</span>
              <h2>Rachel Draelos (Cydoc)</h2>
              <p className="profile-tagline" style={{ color: '#fca5a5' }}>"비즈니스 모델이 깨지면 7년간 온 힘을 쏟아도 실패한다."</p>
            </div>
            <div className="profile-revenue-badge" style={{ borderColor: '#ef4444' }}>
              <span className="badge-label">7년 누적 평생 매출</span>
              <span className="badge-num" style={{ color: '#ef4444' }}>$27,900</span>
              <span className="badge-sub">평생 유료고객 4명</span>
            </div>
          </div>

          <div className="profile-body">
            <div className="body-column">
              <h3>🚨 Cydoc이 처참하게 망한 진짜 이유</h3>
              <ul className="product-list">
                <li>
                  <strong className="text-red">1. 원가가 가격상한을 잠식함</strong>
                  <span>의사 한 명당 청구되는 호스팅비 및 의학 AI API 원가가 약 $70였는데, 의사들이 내고 싶어 하는 가격은 월 $100 이하였습니다. 마진이 전혀 남지 않았습니다.</span>
                </li>
                <li>
                  <strong className="text-red">2. 살인적인 연동(Integration) 비용</strong>
                  <span>병원의 전자의무기록(EHR) 시스템에 AI를 한 번 연결할 때마다 $4,000 ~ $6,000의 연동 비용이 들었습니다. 병원 한 곳에서 본전을 뽑으려면 **11년**을 무료 봉사해야 하는 깨진 구조였습니다.</span>
                </li>
                <li>
                  <strong className="text-red">3. 1인 창업의 한계와 마케팅 붕괴</strong>
                  <span>Rachel은 개발과 연구는 좋아했지만, 영업과 콜드 콜, 미팅을 극도로 혐오했습니다. 결국 이메일 수천 통과 편지를 보냈으나 마케팅 구멍을 메우지 못해 7년간 단 4명의 고객만 결제하게 만들었습니다.</span>
                </li>
              </ul>
            </div>

            <div className="body-column">
              <h3>💡 Cydoc이 주는 값비싼 교훈</h3>
              <div className="tip-box danger-border" style={{ background: 'rgba(239, 68, 68, 0.02)' }}>
                <strong>"채널을 많이 쓴다고 마케팅이 풀리지 않는다"</strong>
                <p>전화, 이메일, 광고, 심지어 진료소에 점심 배달까지 해가며 영업을 시도했으나 마케팅 퍼널 자체가 잘못되어 작동하지 않았습니다. 사업 전에 반드시 시장 조사와 지불의향 단가 조사가 우선되어야 합니다.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📄 탭 7: 핵심 교훈 */}
      {activeTab === 'lessons' && (
        <div className="tab-pane animate-fade-in">
          <div className="section-intro">
            <h2>💡 Connect AI LAB 대표님이 명심할 5가지 법칙</h2>
            <p>글로벌 AI 1인 기업 창업가들의 성공과 뼈아픈 폐업 실패가 주는 교훈입니다.</p>
          </div>

          <div className="lessons-container">
            <div className="lesson-card">
              <div className="lesson-num">01</div>
              <div className="lesson-content">
                <h4>직원 대신 'AI 에이전트'를 고용하라</h4>
                <p>인건비가 0원이면 순이익률이 85%를 상회합니다. 사람 채용과 관리 스트레스 대신, 코다리부장과 같은 AI 에이전트를 실무에 배치하여 비용을 극적으로 통제하십시오.</p>
              </div>
            </div>

            <div className="lesson-card">
              <div className="lesson-num">02</div>
              <div className="lesson-content">
                <h4>시작부터 '되는 카테고리'에 베팅하라</h4>
                <p>수요가 증명되지 않았거나 정부 규제가 껴있는 헬스케어, 복잡한 커스텀 시스템 연동형 사업은 피하십시오. AI 사진/영상, 마케팅 자동화, 뉴스레터 교육이 가장 빠르게 엑싯할 수 있는 꿀벌 구역입니다.</p>
              </div>
            </div>

            <div className="lesson-card">
              <div className="lesson-num">03</div>
              <div className="lesson-content">
                <h4>API 사용료(원가)의 마진율을 엄격하게 계산하라</h4>
                <p>Cydoc의 폐업이 증명하듯, 고객의 지불의향 가격 상한선보다 AI 호출비가 비싸면 팔 때마다 손해입니다. 대표님은 반드시 80% 이상의 마진이 남는 가격대를 책정하셔야 하옵니다.</p>
              </div>
            </div>

            <div className="lesson-card">
              <div className="lesson-num">04</div>
              <div className="lesson-content">
                <h4>만드는 과정을 투명하게 공개하라 (Build in Public)</h4>
                <p>대표님의 유튜브 채널과 블로그를 통해 "1인 기업 AI 빌딩 도전기"를 연재하십시오. 그 과정 자체가 신뢰가 되고, 광고비 0원짜리 최고의 사전 예약 판매(사전판매 1억 달성) 유통 채널이 됩니다.</p>
              </div>
            </div>

            <div className="lesson-card">
              <div className="lesson-num">05</div>
              <div className="lesson-content">
                <h4>완벽함보다 'Vibe Coding' 속도다</h4>
                <p>몇 달 동안 완벽한 코드를 짜느라 시간 버리지 마십시오. AI의 힘을 빌려 며칠 만에 빠르게 테스트용 랜딩 페이지를 띄우고 시장의 반응을 보는 속도가 1인 창업가의 유일한 경쟁력입니다.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CaseStudy;
