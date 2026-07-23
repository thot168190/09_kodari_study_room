import React, { useState } from 'react';
import './ColorChartModal.css';

const PALETTES = [
  {
    id: 'dust-pink',
    title: '🌸 조합 1. 딥 포레스트 & 더스트 핑크 (1초 여행로그 센터)',
    vibe: '구찌 / 딥티크 감성의 세련되고 고급스러운 세미 럭셔리 포토북 룩',
    colors: [
      { name: 'Deep Forest', hex: '#0B3D2E', text: '#FFFFFF' },
      { name: 'Dust Pink', hex: '#FBCFE8', text: '#0B3D2E' },
      { name: 'Rose Petal', hex: '#F472B6', text: '#FFFFFF' },
      { name: 'Pure White', hex: '#FFFFFF', text: '#0B3D2E', border: '#0B3D2E' }
    ]
  },
  {
    id: 'sky-mint',
    title: '🩵 조합 2. 딥 에메랄드 & 스카이 민트 (배움 & 스터디 센터)',
    vibe: '지중해 리조트와 맑은 파란 하늘을 품은 스마트 트래블 룩',
    colors: [
      { name: 'Deep Emerald', hex: '#0F6A4B', text: '#FFFFFF' },
      { name: 'Sky Mint', hex: '#BAE6FD', text: '#0F6A4B' },
      { name: 'Aero Blue', hex: '#38BDF8', text: '#FFFFFF' },
      { name: 'Pure White', hex: '#FFFFFF', text: '#0F6A4B', border: '#0F6A4B' }
    ]
  },
  {
    id: 'lemon-butter',
    title: '🍋 조합 3. 보타니컬 딥파인 & 레몬 버터 (AI 실습 센터)',
    vibe: '아침 햇살과 이솝/킨포크 매거진 감성의 아늑하고 상큼한 룩',
    colors: [
      { name: 'Botanical Green', hex: '#047857', text: '#FFFFFF' },
      { name: 'Lemon Butter', hex: '#FEF08A', text: '#047857' },
      { name: 'Warm Sun', hex: '#FDE047', text: '#047857' },
      { name: 'Pure White', hex: '#FFFFFF', text: '#047857', border: '#047857' }
    ]
  },
  {
    id: 'lavender',
    title: '🪻 조합 4. 미드나잇 그린 & 파스텔 라벤더 (1인 기업 빌더 센터)',
    vibe: '아티스틱하고 감성적인 밤하늘/노을 릴스 제작에 특화된 유니크 룩',
    colors: [
      { name: 'Midnight Green', hex: '#022C22', text: '#FFFFFF' },
      { name: 'Pastel Lavender', hex: '#DDD6FE', text: '#022C22' },
      { name: 'Purple Glow', hex: '#C084FC', text: '#FFFFFF' },
      { name: 'Pure White', hex: '#FFFFFF', text: '#022C22', border: '#022C22' }
    ]
  },
  {
    id: 'champagne-gold',
    title: '🏆 조합 5. 샴페인 골드 & 에메랄드 (유료 결제 정산 모듈)',
    vibe: '3,900원 유료 전자책 및 카카오페이/토스페이 결제 팝업 전용 럭셔리 라인',
    colors: [
      { name: 'Deep Forest', hex: '#0B3D2E', text: '#FFFFFF' },
      { name: 'Champagne Gold', hex: '#C9B27C', text: '#0B3D2E' },
      { name: 'Amber Gold', hex: '#D97706', text: '#FFFFFF' },
      { name: 'Pure White', hex: '#FFFFFF', text: '#0B3D2E', border: '#C9B27C' }
    ]
  }
];

export default function ColorChartModal({ onClose }) {
  const [copiedHex, setCopiedHex] = useState('');

  const handleCopy = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(''), 2000);
  };

  return (
    <div className="cc-modal-overlay" onClick={onClose}>
      <div className="cc-modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="cc-modal-header">
          <div>
            <span className="cc-badge">🎨 Adobe Color Trend 2026</span>
            <h2>🌲 딥그림 & 파스텔 색차트 갤러리</h2>
            <p>클릭하시면 HEX 컬러 코드가 즉시 클립보드에 복사됩니다!</p>
          </div>
          <button className="cc-close-btn" onClick={onClose}>×</button>
        </header>

        {copiedHex && (
          <div className="cc-toast">
            📋 HEX 코드 <b>{copiedHex}</b> 가 복사되었습니다!
          </div>
        )}

        <div className="cc-palette-list">
          {PALETTES.map((palette) => (
            <div key={palette.id} className="cc-palette-card">
              <h3>{palette.title}</h3>
              <p className="cc-palette-vibe">{palette.vibe}</p>
              
              <div className="cc-color-chips">
                {palette.colors.map((c, idx) => (
                  <div
                    key={idx}
                    className="cc-color-chip"
                    style={{
                      backgroundColor: c.hex,
                      color: c.text,
                      border: c.border ? `2px solid ${c.border}` : 'none'
                    }}
                    onClick={() => handleCopy(c.hex)}
                  >
                    <span className="chip-name">{c.name}</span>
                    <span className="chip-hex">{c.hex}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
