import React, { useState } from 'react';
import NicheDiagnoser from './NicheDiagnoser';
import './NicheScanner.css';
import { Sparkles, Shield, CreditCard, Lock, Check, CheckCircle2, ChevronRight, HelpCircle, ArrowLeft, Loader2 } from 'lucide-react';

function NicheScanner({ onExit }) {
  // SaaS 등급 상태: 'FREE' | 'PRO'
  const [membership, setMembership] = useState('FREE');
  // 무료 진단 횟수 (1회 제한)
  const [freeScanCount, setFreeScanCount] = useState(0);
  
  // 모달 제어 상태
  const [showPayModal, setShowPayModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  // 가상 신용카드 입력 상태
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/29');
  const [cardCvc, setCardCvc] = useState('321');

  // 결제 진행 트리거
  const handleStartPayment = () => {
    setShowPayModal(true);
  };

  const handleConfirmPayment = (e) => {
    e.preventDefault();
    setIsPaying(true);
    // 1.5초 결제 네트워크 모킹
    setTimeout(() => {
      setIsPaying(false);
      setShowPayModal(false);
      setMembership('PRO');
      setShowSuccessModal(true);
    }, 1500);
  };

  return (
    <div className="ns-wrapper">
      {/* 🌌 Motionsites.ai 풍의 뒷배경 오로라 네온 효과 */}
      <div className="ns-glow-bg">
        <div className="ns-orb ns-orb-1"></div>
        <div className="ns-orb ns-orb-2"></div>
      </div>

      <div className="ns-container">
        {/* 🏷️ Navigation Header */}
        <header className="ns-header">
          <div className="ns-logo-area">
            <Sparkles className="ns-logo-icon" size={20} />
            <span className="ns-logo-title">
              NicheScanner <span style={{ fontWeight: 400, color: 'var(--ns-muted)' }}>SaaS</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {membership === 'FREE' ? (
              <span className="ns-header-badge">Free Plan (체험판)</span>
            ) : (
              <span className="ns-header-badge pro">Pro Active 🔥</span>
            )}
            
            <button className="btn-ns-exit" onClick={onExit}>
              <ArrowLeft size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              공부방 돌아가기
            </button>
          </div>
        </header>

        {/* 🚀 Hero Section */}
        <section className="ns-hero">
          <span className="ns-hero-tag">
            <Sparkles size={12} style={{ marginRight: '4px' }} />
            1초 만에 틈새시장 가설 검증
          </span>
          <h1 className="ns-hero-title">
            아이디어의 <span className="gradient-text-wizard">벡터 거리</span>를 스캔하세요
          </h1>
          <p className="ns-hero-sub">
            레드오션 경쟁사들 사이에서 내 아이디어가 독점적 틈새(Niche)를 점유하고 있는지 2D 벡터 공간에 매핑해 드립니다. 1인 창업가의 시장조사 시간 8시간을 3초로 줄이세요.
          </p>

          {/* 🖥️ 실시간 누적 분석 현황 티커 (Motionsites.ai 데코레이션) */}
          <div className="ns-live-stat-bar">
            <div className="ns-stat-pulse-dot"></div>
            <span>실시간 누적 스캔 분석: 현재 <strong>1,842명</strong>이 시장 검증을 완료했습니다!</span>
          </div>
        </section>

        {/* 💳 요금제 프라이싱 그리드 */}
        {membership === 'FREE' && (
          <section style={{ marginBottom: '60px' }}>
            <h3 className="ns-pricing-title">💎 초고속 스캔 권한 해제 요금제</h3>
            <div className="ns-pricing-grid">
              {/* FREE 요금제 */}
              <div className="ns-price-card">
                <span className="ns-card-tier">Starter</span>
                <div className="ns-card-price">$0<span>/평생</span></div>
                <ul className="ns-card-features">
                  <li><Check size={14} className="ns-feature-icon" /> 수동 폼 입력 진단</li>
                  <li><Check size={14} className="ns-feature-icon" /> 2D 경쟁사 벡터 매핑</li>
                  <li style={{ opacity: 0.5 }}><Lock size={12} className="ns-feature-icon disabled" style={{ color: 'var(--ns-rose)' }} /> 웅얼웅얼 마법사(Idea Spark) 기능 잠김</li>
                  <li style={{ opacity: 0.5 }}><Lock size={12} className="ns-feature-icon disabled" style={{ color: 'var(--ns-rose)' }} /> 총 1회 진단 횟수 제한</li>
                </ul>
                <button 
                  className="btn-pricing free-tier"
                  onClick={() => {
                    document.getElementById('core-scanner-app')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  무료 체험 스캔 (남은 횟수: {1 - freeScanCount}회)
                </button>
              </div>

              {/* PRO 요금제 */}
              <div className="ns-price-card featured">
                <span className="ns-card-ribbon">Popular 🔥</span>
                <span className="ns-card-tier">Pro Creator</span>
                <div className="ns-card-price">$9.9<span>/월</span></div>
                <ul className="ns-card-features">
                  <li><Check size={14} className="ns-feature-icon" /> <b>웅얼웅얼 마법사(Idea Spark) 락 해제</b></li>
                  <li><Check size={14} className="ns-feature-icon" /> <b>무제한</b> 아이디어 진단 스캔</li>
                  <li><Check size={14} className="ns-feature-icon" /> 1인 기업 8주 성장 로드맵 무제한 릴리즈</li>
                  <li><Check size={14} className="ns-feature-icon" /> SNS 60초 CEO 마케팅 대본 생성</li>
                </ul>
                <button className="btn-pricing pro-tier" onClick={handleStartPayment}>
                  Pro 무제한 구독 시작하기
                </button>
              </div>

              {/* Enterprise 요금제 */}
              <div className="ns-price-card">
                <span className="ns-card-tier">Enterprise</span>
                <div className="ns-card-price">$49<span>/월</span></div>
                <ul className="ns-card-features">
                  <li><Check size={14} className="ns-feature-icon" /> Pro 플랜의 모든 기능 포함</li>
                  <li><Check size={14} className="ns-feature-icon" /> 정밀 PDF 시장조사 보고서 자동 출력</li>
                  <li><Check size={14} className="ns-feature-icon" /> API 엑세스 (외부 서비스 연동 가능)</li>
                  <li><Check size={14} className="ns-feature-icon" /> 1인 기업 스케일업 1:1 컨설팅 세션 할인</li>
                </ul>
                <button className="btn-pricing enterprise-tier" onClick={() => alert('대표님! 기업용 API 문의는 코부장에게 메일 주세요! 😊')}>
                  Enterprise 도입 문의
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ⚙️ 핵심 애플리케이션 진단 패널 */}
        <section id="core-scanner-app" style={{ scrollMarginTop: '40px' }}>
          {membership === 'FREE' && freeScanCount >= 1 ? (
            /* 무료 체험 1회 초과 시 강제 락 화면 */
            <div className="ns-lock-screen">
              <div className="ns-lock-icon-box">
                <Lock size={28} />
              </div>
              <h3 className="ns-lock-title">무료 체험 1회 스캔 완료!</h3>
              <p className="ns-lock-desc">
                더 넓은 벡터 거리 탐색과 웅얼웅얼 마법사(Idea Spark) 기능을 무제한으로 사용하시려면 Pro 플랜 구독이 필요합니다.
              </p>
              <button 
                className="btn-pricing pro-tier" 
                style={{ maxWidth: '280px', margin: '0 auto' }}
                onClick={handleStartPayment}
              >
                Pro 플랜 락 해제 ($9.9/월)
              </button>
            </div>
          ) : (
            /* 진단 패널 활성화 */
            <div className="ns-app-card" style={{ background: 'transparent' }}>
              <div className="dark-theme-adapter" style={{ background: 'var(--ns-card)', borderRadius: '24px', border: '1px solid var(--ns-line)', padding: '10px', backdropFilter: 'blur(20px)' }}>
                <NicheDiagnoser 
                  isSaaSMode={true}
                  membership={membership}
                  onScanComplete={() => {
                    if (membership === 'FREE') {
                      setFreeScanCount(prev => prev + 1);
                    }
                  }}
                />
              </div>
            </div>
          )}
        </section>
      </div>

      {/* 💳 Stripe 결제 모달 팝업 */}
      {showPayModal && (
        <div className="ns-modal-overlay">
          <div className="ns-modal">
            <div className="ns-modal-header">
              <span className="ns-modal-title">
                <CreditCard size={18} style={{ color: 'var(--ns-purple)' }} />
                Stripe Secure Checkout
              </span>
              <button className="btn-close-modal" onClick={() => setShowPayModal(false)}>✕</button>
            </div>

            <form onSubmit={handleConfirmPayment}>
              <div className="ns-modal-body">
                <div className="ns-summary-line">
                  <span className="ns-summary-label">NicheScanner Pro 구독권</span>
                  <span className="ns-summary-price">$9.90 / 월</span>
                </div>

                <div className="ns-card-input-wrapper">
                  <div className="ns-card-input-row">
                    <CreditCard size={16} style={{ color: 'var(--ns-muted)' }} />
                    <input 
                      type="text" 
                      className="ns-input-styled" 
                      value={cardNumber} 
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Card Number"
                      required
                    />
                  </div>

                  <div className="ns-card-meta-row">
                    <input 
                      type="text" 
                      className="ns-input-styled" 
                      value={cardExpiry} 
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY" 
                      required
                    />
                    <input 
                      type="text" 
                      className="ns-input-styled" 
                      value={cardCvc} 
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="CVC" 
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn-pay-submit"
                  disabled={isPaying}
                >
                  {isPaying ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>코다리 안전결제 통신 중...</span>
                    </>
                  ) : (
                    <>
                      <Shield size={16} />
                      <span>$9.90 결제 및 PRO 라이선스 잠금해제</span>
                    </>
                  )}
                </button>

                <div className="ns-secure-footer">
                  <Shield size={12} />
                  <span>256-bit SSL 암호화 결제망 가동 중</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🎉 결제 성공 축하 모달 */}
      {showSuccessModal && (
        <div className="ns-modal-overlay">
          <div className="ns-modal" style={{ maxWidth: '420px' }}>
            <div className="ns-success-body">
              <div className="ns-success-icon-box">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="ns-success-title">Pro 플랜 락 해제 성공!</h3>
              <p className="ns-success-desc">
                대표님! Pro 라이선스가 성공적으로 갱신되었습니다. 이제 웅얼웅얼 마법사(Idea Spark) 기능이 무제한 개방되었습니다! 🚀
              </p>
              <button className="btn-success-close" onClick={() => setShowSuccessModal(false)}>
                진단하러 가기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NicheScanner;
