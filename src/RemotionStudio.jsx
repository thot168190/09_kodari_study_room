import React, { useState, useMemo } from 'react';
import './RemotionStudio.css';
import templatesData from './assets/remotion-templates.json';
import categoriesData from './assets/remotion-categories.json';
import setupData from './assets/remotion-setup.json';
import { 
  Play, Copy, Check, Sparkles, Terminal, Layers, 
  ExternalLink, Search, FileCode, CheckCircle2, ChevronRight, Video, Info
} from 'lucide-react';

const BASE_URL = 'https://www.aicitybuilders.com';

export default function RemotionStudio() {
  const [selectedCat, setSelectedCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(templatesData[0]);
  const [copiedKey, setCopiedKey] = useState(null);
  const [showSetupModal, setShowSetupModal] = useState(false);

  // 카테고리 & 검색 필터링
  const filteredTemplates = useMemo(() => {
    return templatesData.filter((t) => {
      const matchCat = selectedCat === 'all' || t.cat === selectedCat;
      const matchSearch = searchQuery === '' || 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.pkg.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.summary && t.summary.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [selectedCat, searchQuery]);

  // 클립보드 복사
  const handleCopy = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const videoSrc = selectedTemplate.video.startsWith('http') 
    ? selectedTemplate.video 
    : `${BASE_URL}${selectedTemplate.video}`;

  const posterSrc = selectedTemplate.poster.startsWith('http')
    ? selectedTemplate.poster
    : `${BASE_URL}${selectedTemplate.poster}`;

  return (
    <div className="remotion-studio-container">
      {/* ── 1. 헤더 & 메타 뱃지 ── */}
      <div className="rs-hero-banner">
        <div className="rs-badge-row">
          <span className="rs-pill-badge green"><Sparkles size={12} /> REMOTION 4.0.529</span>
          <span className="rs-pill-badge purple">렌더링 비용 0원 (로컬)</span>
          <span className="rs-pill-badge">44종 실전 정품 템플릿</span>
        </div>
        <h1 className="rs-hero-title">
          🎬 <span>영상 바이브코딩 · Remotion</span> 스튜디오
        </h1>
        <p className="rs-hero-desc">
          코드를 영상으로 바꿔 주는 진짜 리모션 영상 공장입니다. 44가지 실전 예제의 <b>실제 렌더링 MP4 비디오</b>와 <b>정품 TSX 소스 코드</b>를 직접 확인하고, 이미지 주소와 글자만 바꿔 즉시 0원으로 영상을 렌더링하세요.
        </p>

        <div className="rs-stats-strip">
          <div className="rs-stat-box">
            <span className="rs-stat-label">수록 템플릿</span>
            <span className="rs-stat-val">44개 전편 수록</span>
          </div>
          <div className="rs-stat-box">
            <span className="rs-stat-label">영상 렌더 비용</span>
            <span className="rs-stat-val" style={{ color: '#34d399' }}>0원 (무제한)</span>
          </div>
          <div className="rs-stat-box">
            <span className="rs-stat-label">비디오 퀄리티</span>
            <span className="rs-stat-val" style={{ color: '#60a5fa' }}>정품 60fps MP4</span>
          </div>
          <div className="rs-stat-box">
            <span className="rs-stat-label">프로젝트 세팅</span>
            <button 
              className="rs-setup-btn"
              onClick={() => setShowSetupModal(true)}
            >
              <FileCode size={12} /> 필수 파일 2개 보기
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. 검색 & 카테고리 탭 ── */}
      <div className="rs-filter-section">
        <div className="rs-search-box">
          <Search size={15} color="#94a3b8" />
          <input 
            type="text"
            placeholder="템플릿 제목, 패키지(@remotion/...) 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rs-search-input"
          />
        </div>

        <div className="rs-category-bar">
          <button 
            className={`rs-cat-btn ${selectedCat === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCat('all')}
          >
            전체 <span>{templatesData.length}</span>
          </button>
          {categoriesData.map((cat) => {
            const count = templatesData.filter((t) => t.cat === cat.id).length;
            return (
              <button 
                key={cat.id}
                className={`rs-cat-btn ${selectedCat === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCat(cat.id)}
              >
                {cat.name} <span>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 3. 메인 프리뷰 & 코드 섹션 ── */}
      <div className="rs-main-grid">
        {/* 좌측: 진짜 MP4 영상 플레이어 */}
        <div className="rs-preview-card">
          <div className="rs-preview-header">
            <div className="rs-preview-title-area">
              <span className="rs-tag">{selectedTemplate.pkg}</span>
              <h3 className="rs-preview-title">{selectedTemplate.title}</h3>
            </div>
            <span className="rs-meta-pill">{selectedTemplate.meta}</span>
          </div>

          {/* 실제 렌더링된 MP4 비디오 플레이어 */}
          <div className={`rs-video-wrapper ${selectedTemplate.vertical ? 'vertical' : ''}`}>
            <video 
              key={videoSrc}
              src={videoSrc}
              poster={posterSrc}
              controls
              autoPlay
              loop
              muted
              playsInline
              className="rs-actual-video"
            />
          </div>

          {/* 설명 및 팁 */}
          <div className="rs-summary-box">
            <p className="rs-summary-main">{selectedTemplate.summary}</p>
            {selectedTemplate.body && selectedTemplate.body.length > 0 && (
              <div className="rs-tips-list">
                {selectedTemplate.body.map((tip, idx) => (
                  <div key={idx} className="rs-tip-row">
                    <span className="rs-tip-dot">•</span>
                    <span className="rs-tip-text">{tip}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 우측: 정품 소스 코드 & CLI 명령어 */}
        <div className="rs-config-card">
          <div className="rs-code-box">
            <div className="rs-code-bar">
              <span className="rs-code-filename">
                <FileCode size={13} style={{ display: 'inline', marginRight: 5 }} />
                {selectedTemplate.file || 'Scene.tsx'}
              </span>
              <button 
                className={`rs-copy-btn ${copiedKey === 'code' ? 'copied' : ''}`}
                onClick={() => handleCopy('code', selectedTemplate.code)}
              >
                {copiedKey === 'code' ? <Check size={12} /> : <Copy size={12} />}
                <span>{copiedKey === 'code' ? '복사됨!' : '전체 코드 복사'}</span>
              </button>
            </div>
            <pre className="rs-code-content">{selectedTemplate.code}</pre>
          </div>

          {/* 3단계 실행 가이드 */}
          <div className="rs-quick-guide">
            <h4 className="rs-guide-title">
              <Terminal size={14} color="#38bdf8" /> 내 PC에서 1초 만에 렌더링하기
            </h4>
            <div className="rs-cli-cmd-row">
              <code>npx create-video@latest --blank my-video</code>
              <button 
                className="rs-mini-copy"
                onClick={() => handleCopy('cmd1', 'npx create-video@latest --blank my-video && cd my-video && npm i @remotion/fonts')}
              >
                {copiedKey === 'cmd1' ? '완료' : '프로젝트 복사'}
              </button>
            </div>
            <div className="rs-cli-cmd-row">
              <code>npx remotion render src/index.ts Scene out/video.mp4</code>
              <button 
                className="rs-mini-copy"
                onClick={() => handleCopy('cmd2', 'npx remotion render src/index.ts Scene out/video.mp4')}
              >
                {copiedKey === 'cmd2' ? '완료' : '렌더 명령어'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. 44개 템플릿 카드 갤러리 ── */}
      <div className="rs-gallery-section">
        <h3 className="rs-section-title">
          <Layers size={17} color="#60a5fa" />
          <span>전체 템플릿 탐색 ({filteredTemplates.length}개)</span>
        </h3>
        <div className="rs-template-grid">
          {filteredTemplates.map((tpl) => {
            const isSelected = selectedTemplate.id === tpl.id;
            const thumbUrl = tpl.poster.startsWith('http') ? tpl.poster : `${BASE_URL}${tpl.poster}`;
            return (
              <div 
                key={tpl.id}
                className={`rs-template-card ${isSelected ? 'active' : ''}`}
                onClick={() => {
                  setSelectedTemplate(tpl);
                  window.scrollTo({ top: 180, behavior: 'smooth' });
                }}
              >
                {/* 썸네일 포스터 */}
                <div className="rs-card-poster-wrap">
                  <img src={thumbUrl} alt={tpl.title} className="rs-card-poster" loading="lazy" />
                  <span className="rs-card-meta-tag">{tpl.meta}</span>
                </div>
                <div className="rs-card-body">
                  <span className="rs-card-cat">{tpl.pkg}</span>
                  <h4 className="rs-card-title">{tpl.title}</h4>
                  <p className="rs-card-desc">{tpl.summary}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 필수 파일 2개 모달 (font.ts & Root.tsx) ── */}
      {showSetupModal && (
        <div className="rs-modal-overlay" onClick={() => setShowSetupModal(false)}>
          <div className="rs-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="rs-modal-header">
              <h3>📁 처음 한 번만: 프로젝트 필수 파일 2개</h3>
              <button onClick={() => setShowSetupModal(false)} className="rs-modal-close">✕</button>
            </div>
            <div className="rs-modal-body">
              {setupData.map((item) => (
                <div key={item.file} className="rs-setup-box">
                  <div className="rs-setup-head">
                    <b>{item.file}</b>
                    <button 
                      className="rs-mini-copy"
                      onClick={() => handleCopy(item.file, item.code)}
                    >
                      {copiedKey === item.file ? '복사됨!' : '코드 복사'}
                    </button>
                  </div>
                  <p className="rs-setup-note">{item.note}</p>
                  <pre className="rs-setup-code">{item.code}</pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
