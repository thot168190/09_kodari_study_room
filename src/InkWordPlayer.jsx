import React from 'react';
import './InkWordPlayer.css';
import { ExternalLink, RefreshCw, Sparkles, Award } from 'lucide-react';

function InkWordPlayer() {
  const siteUrl = "https://inkword.site";

  const handleRefresh = () => {
    const iframe = document.getElementById('inkword-iframe');
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  return (
    <div className="inkword-site-container">
      {/* 🚀 상단 헤더 & 브라우저 툴바 */}
      <header className="inkword-site-header">
        <div className="header-left">
          <div className="badge-spark">
            <Sparkles size={13} style={{ color: 'var(--gold, #f5c451)' }} />
            <span>대표님 공식 SaaS 런칭관</span>
          </div>
          <h2>둠칫 잉크워드 (inkword.site)</h2>
        </div>
        
        <div className="browser-toolbar-custom">
          <div className="toolbar-dots">
            <span className="dot dot-r"></span>
            <span className="dot dot-y"></span>
            <span className="dot dot-g"></span>
          </div>
          <div className="toolbar-address-bar">
            <span>https://inkword.site</span>
          </div>
          <div className="toolbar-actions">
            <button className="tb-action-btn" onClick={handleRefresh} title="새로고침">
              <RefreshCw size={14} />
            </button>
            <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="tb-action-link" title="새 창에서 열기">
              <ExternalLink size={14} />
              <span>새 창 열기 ↗</span>
            </a>
          </div>
        </div>
      </header>

      {/* 🖥️ 메인 무대: inkword.site iframe 임베드 */}
      <main className="inkword-iframe-wrapper">
        <iframe 
          id="inkword-iframe"
          src={siteUrl} 
          title="Inkword 공식 사이트"
          className="inkword-embedded-frame"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </main>

      {/* 📢 코다리 부장의 응원 띠 배너 */}
      <footer className="inkword-site-footer">
        <div className="footer-badge">
          <Award size={14} />
          <span>코다리의 비즈니스 제안</span>
        </div>
        <p>
          대표님, <strong>inkword.site</strong>는 움직임 자체가 의미인 어휘를 시각 애니메이션 카드로 완벽히 구현해 낸 최고의 초니치 SaaS 자산이옵니다. 
          이 사이트 자체를 위젯 API 형태로 교육 플랫폼에 B2B로 임베드 판매하는 파이프라인도 고려해 보십시오! 🫡
        </p>
      </footer>
    </div>
  );
}

export default InkWordPlayer;
