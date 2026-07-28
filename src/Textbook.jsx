import React, { useState } from 'react';
import './Textbook.css';
import { BookOpen, Calendar, ArrowRight, Sparkles, AlertCircle, Play, FileText, ChevronRight, ExternalLink, Search } from 'lucide-react';
import TEXTBOOK_DATA from './assets/textbook-data.json';

function Textbook() {
  const [selectedEp, setSelectedEp] = useState(TEXTBOOK_DATA[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = TEXTBOOK_DATA.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.episode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="textbook-container">
      {/* 🚀 상단 헤더 배너 */}
      <header className="tb-hero">
        <div className="tb-hero-badge">📚 모닝AI 1인 기업 해부 교재창고 (EP.01 ~ EP.18 통합 모음집)</div>
        <h1 className="tb-hero-title">
          날짜별 <span className="highlight-text">AI 1인 기업 해부</span> 공식 교재 통합 아카이브
        </h1>
        <p className="tb-hero-sub">
          대표님께서 아침마다 학습하시는 CONNECT AI LAB의 공식 교안(EP.01~EP.18 전체 18개 에피소드)을 한곳에 집대성했습니다. 
          원하는 회차를 선택하거나 검색하여 핵심 비즈니스 모델과 승리 공식을 꼼꼼하게 복습해 보십시오.
        </p>
      </header>

      <div className="tb-layout">
        {/* 📂 왼쪽: 날짜별 교재 리스트 */}
        <aside className="tb-sidebar">
          <div className="sidebar-title">
            <span>📅 해부 교안 아카이브 ({TEXTBOOK_DATA.length}개)</span>
          </div>

          <div className="tb-search-box" style={{ padding: '8px 12px', marginBottom: '12px', background: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Search size={14} color="#64748b" />
            <input 
              type="text" 
              placeholder="EP 번호, 인물, 키워드 검색..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '12.5px', fontWeight: '600' }}
            />
          </div>

          <div className="tb-list">
            {filteredData.map((ep) => (
              <div 
                key={ep.id}
                className={`tb-item ${selectedEp.id === ep.id ? 'active' : ''}`}
                onClick={() => setSelectedEp(ep)}
              >
                <div className="tb-item-header">
                  <span className="tb-badge">{ep.episode}</span>
                  <span className="tb-date"><Calendar size={12} style={{ marginRight: 4 }} />{ep.date}</span>
                </div>
                <div className="tb-item-title">{ep.title}</div>
              </div>
            ))}
          </div>
        </aside>

        {/* 🖥️ 오른쪽: 교재 내용 상세 뷰어 */}
        <main className="tb-viewer">
          <div className="tb-card">
            <div className="tb-card-header">
              <div className="tb-card-badge">{selectedEp.episode} 공식 분석 교재</div>
              <h2 className="tb-card-title">{selectedEp.title}</h2>
              <div className="tb-card-meta">
                <span>🗓️ 배포일자: {selectedEp.date}</span>
                <span className="divider">|</span>
                <span>
                  <a href={selectedEp.url} target="_blank" rel="noopener noreferrer" className="tb-link">
                    공식 랜딩 교안 보기 ↗
                  </a>
                </span>
                {selectedEp.videoUrl && (
                  <>
                    <span className="divider">|</span>
                    <span>
                      <a href={selectedEp.videoUrl} target="_blank" rel="noopener noreferrer" className="tb-link-video">
                        유튜브 강의 시청 ▶
                      </a>
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="tb-keywords">
              {selectedEp.keywords.map((kw, i) => (
                <span key={i} className="kw-badge"># {kw}</span>
              ))}
            </div>

            <div className="tb-section">
              <h3>📋 핵심 요약 브리핑</h3>
              <p className="tb-summary-text">{selectedEp.summary}</p>
            </div>

            <div className="tb-section">
              <h3>🧠 1인 기업 뼈대 설계안 (Curriculum)</h3>
              <div className="tb-steps">
                {selectedEp.curriculum.map((item, idx) => (
                  <div key={idx} className="tb-step-row">
                    <div className="tb-step-num">0{idx + 1}</div>
                    <div className="tb-step-info">
                      <h4>{item.step}</h4>
                      <p>{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 하단 격려 팁 */}
            <div className="tb-alert-box">
              <Sparkles className="icon-spark" size={16} />
              <span>
                <strong>코다리 부장의 조언:</strong> 대표님, 이 에피소드의 비즈니스 구조를 대표님의 1인 기업 파이프라인에 이식하고 싶으시다면, 요약 탭에서 AI 브리핑을 작동하시거나 Q&A로 물어봐 주십시오! 🫡
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Textbook;
