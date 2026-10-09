import React, { useState, useEffect, useRef } from 'react';
import './RemotionStudio.css';
import { 
  Play, Pause, RotateCcw, Copy, Check, Sparkles, Terminal, 
  Layers, Video, Smartphone, Monitor, Download, Zap, ChevronRight, Sliders
} from 'lucide-react';

// ── 핵심 실전 템플릿 데이터 ──
const TEMPLATES = [
  {
    id: 'hero-ad',
    cat: 'ad',
    catName: '🛍️ 제품 광고',
    title: '스마트스토어 히어로 등장',
    duration: '6초 (180 프레임)',
    desc: '제품 누끼 컷이 아래에서 솟구치며 빛 쓸기 효과와 입체 그림자가 형성되는 고수익 이커머스 릴스 광고',
    api: 'spring() · WebkitMaskImage · interpolate',
    defaultParams: {
      productTitle: '스파클링 제로 소다',
      subTitle: '천연 탄산의 짜릿한 상쾌함',
      badgeText: 'NEW 30% OFF',
      priceText: '1,900원',
      bgColor: '#1e3a8a',
      accentColor: '#38bdf8'
    },
    code: `// frames=180 size=1080x1920 (9:16 Shorts)
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

// ── 파라미터만 바꾸면 내 제품 광고가 됩니다 ──
const PRODUCT_IMG = 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop&q=80';
const TITLE = '스파클링 제로 소다';
const SUBTITLE = '천연 탄산의 짜릿한 상쾌함';
const PRICE = '1,900원';
const BADGE = 'NEW 30% OFF';

export const Scene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. 제품 등장 스프링 모션 (바운스)
  const rise = spring({ frame: frame - 10, fps, config: { damping: 11, mass: 0.8 } });
  const y = interpolate(rise, [0, 1], [400, 0]);
  const scale = interpolate(rise, [0, 1], [0.6, 1]);

  // 2. 빛 쓸기 효과 (Sweep)
  const sweep = interpolate(frame, [45, 95], [-50, 150], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // 3. 문구 페이드인
  const textOpacity = interpolate(frame, [30, 50], [0, 1]);

  return (
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, #0b132b 0%, #1c2541 100%)', color: '#fff', alignItems: 'center', justifyContent: 'center' }}>
      {/* 백그라운드 큰 워터마크 */}
      <div style={{ position: 'absolute', top: 180, fontSize: 130, fontWeight: 900, opacity: 0.08, letterSpacing: '0.05em' }}>
        PREMIUM
      </div>

      {/* 할인 배지 */}
      <div style={{ position: 'absolute', top: 280, background: '#ef4444', padding: '10px 24px', borderRadius: 30, fontSize: 24, fontWeight: 800, opacity: textOpacity }}>
        {BADGE}
      </div>

      {/* 제품 이미지 + 빛 쓸기 + 바닥 그림자 */}
      <div style={{ transform: \`translateY(\${y}px) scale(\${scale})\`, position: 'relative' }}>
        {/* 바닥 그림자 */}
        <div style={{ position: 'absolute', bottom: -30, left: '50%', transform: 'translateX(-50%)', width: 240, height: 35, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', filter: 'blur(10px)' }} />
        
        {/* 누끼 이미지 */}
        <Img src={PRODUCT_IMG} style={{ width: 420, height: 'auto', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.4))' }} />

        {/* 빛 쓸기 마스크 효과 */}
        <div style={{
          position: 'absolute', inset: 0, mixBlendMode: 'screen',
          WebkitMaskImage: \`url(\${PRODUCT_IMG})\`, WebkitMaskSize: '100% 100%',
          background: \`linear-gradient(115deg, transparent \${sweep - 20}%, rgba(255,255,255,0.85) \${sweep}%, transparent \${sweep + 20}%)\`
        }} />
      </div>

      {/* 하단 타이틀 & 가격 */}
      <div style={{ position: 'absolute', bottom: 240, textAlign: 'center', opacity: textOpacity }}>
        <h1 style={{ fontSize: 56, fontWeight: 900, margin: '0 0 10px 0' }}>{TITLE}</h1>
        <p style={{ fontSize: 28, color: '#94a3b8', margin: '0 0 20px 0' }}>{SUBTITLE}</p>
        <span style={{ fontSize: 62, fontWeight: 900, color: '#38bdf8' }}>{PRICE}</span>
      </div>
    </AbsoluteFill>
  );
};`
  },
  {
    id: 'quiz-timer',
    cat: 'quiz',
    catName: '🎯 퀴즈 & 타이머',
    title: '틀린그림찾기 10초 카운트다운 게이지',
    duration: '10초 (300 프레임)',
    desc: '눈썰미 레벨업 채널 전용! 오차 0.1초도 없는 프로그레스 바 게이지와 정답 오픈 애니메이션',
    api: 'interpolate() · SVG strokeDashoffset · spring()',
    defaultParams: {
      productTitle: '틀린 곳 3군데를 찾아보세요!',
      subTitle: '난이도: ★★★☆☆ (상위 5% 도전)',
      badgeText: '10 SECONDS',
      priceText: '정답 공개!',
      bgColor: '#0f172a',
      accentColor: '#f59e0b'
    },
    code: `// frames=300 size=1920x1080 (16:9 Quiz)
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';

export const QuizScene = () => {
  const frame = useCurrentFrame();

  // 10초(300프레임) 동안 게이지 100% -> 0% 감소
  const progress = interpolate(frame, [0, 270], [100, 0], { extrapolateRight: 'clamp' });
  const isTimeUp = frame >= 270;

  // 정답 공개 빨간 원 바운스 애니메이션
  const circleScale = isTimeUp ? spring({ frame: frame - 270, fps: 30, config: { damping: 9 } }) : 0;

  return (
    <AbsoluteFill style={{ background: '#090d16', color: '#fff' }}>
      {/* 상단 퀴즈 안내 바 */}
      <div style={{ padding: '30px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: 36, fontWeight: 900, color: '#f59e0b' }}>Q. 틀린 곳 3군데를 찾아보세요!</h2>
        <div style={{ fontSize: 28, fontWeight: 800, background: '#1e293b', padding: '10px 24px', borderRadius: 12 }}>
          남은 시간: {Math.max(0, Math.ceil((270 - frame) / 30))}초
        </div>
      </div>

      {/* 좌우 이미지 분할 비교 영역 (16:9) */}
      <div style={{ display: 'flex', gap: 20, padding: '0 60px', flex: 1 }}>
        <div style={{ flex: 1, background: '#1e293b', borderRadius: 20, position: 'relative', overflow: 'hidden' }}>
          <span style={{ position: 'absolute', top: 20, left: 20, background: '#3b82f6', padding: '6px 16px', borderRadius: 8 }}>원본 (A)</span>
        </div>
        <div style={{ flex: 1, background: '#1e293b', borderRadius: 20, position: 'relative', overflow: 'hidden' }}>
          <span style={{ position: 'absolute', top: 20, left: 20, background: '#10b981', padding: '6px 16px', borderRadius: 8 }}>수정본 (B)</span>
          
          {/* 정답 위치 하이라이트 동그라미 */}
          {isTimeUp && (
            <div style={{
              position: 'absolute', top: '45%', left: '60%', width: 100, height: 100,
              borderRadius: '50%', border: '6px solid #ef4444',
              transform: \`translate(-50%, -50%) scale(\${circleScale})\`
            }} />
          )}
        </div>
      </div>

      {/* 하단 10초 타이머 프로그레스 게이지 바 */}
      <div style={{ width: '100%', height: 16, background: '#1e293b' }}>
        <div style={{ width: \`\${progress}%\`, height: '100%', background: progress < 25 ? '#ef4444' : '#f59e0b', transition: 'background 0.3s' }} />
      </div>
    </AbsoluteFill>
  );
};`
  },
  {
    id: 'carousel-ad',
    cat: 'ad',
    catName: '🛍️ 제품 광고',
    title: '3단 라인업 제품 캐러셀',
    duration: '8초 (240 프레임)',
    desc: '신제품 3종이 차례대로 스와이프되며 중앙 포커스 시 배경색이 유기적으로 블렌딩되는 럭셔리 쇼케이스',
    api: 'interpolateColors() · spring() · Easing.bezier',
    defaultParams: {
      productTitle: '2026 프리미엄 컬렉션',
      subTitle: '오리지널 · 스파클링 · 제로칼로리',
      badgeText: 'BEST 3 라인업',
      priceText: '한정수량 특별가',
      bgColor: '#1e1b4b',
      accentColor: '#818cf8'
    },
    code: `// frames=240 size=1280x720 (16:9 Showcase)
import { AbsoluteFill, Img, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig } from 'remotion';

const PRODUCTS = [
  { name: '캔 스파클링', price: '1,900원', color: '#1e3a8a' },
  { name: '오렌지 주스', price: '3,200원', color: '#c2410c' },
  { name: '포테이토 칩', price: '2,500원', color: '#b91c1c' },
];

export const CarouselScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 제품 순환 인덱스 계산
  const step = Math.floor(frame / 70) % PRODUCTS.length;
  const current = PRODUCTS[step];

  return (
    <AbsoluteFill style={{ background: current.color, color: '#fff', alignItems: 'center', justifyContent: 'center', transition: 'background 0.5s' }}>
      <h1 style={{ fontSize: 52, fontWeight: 900 }}>{current.name}</h1>
      <span style={{ fontSize: 36, color: '#facc15' }}>{current.price}</span>
    </AbsoluteFill>
  );
};`
  },
  {
    id: 'char-motion',
    cat: 'char',
    catName: '🤖 캐릭터 모션',
    title: '코다리 캐릭터 말풍선 & 인트로',
    duration: '5초 (150 프레임)',
    desc: '캐릭터가 화면 옆에서 뿅 나타나 말풍선 팝업과 함께 메시지를 전달하는 브랜드 홍보 인트로',
    api: 'spring({damping: 8}) · getPointAtLength() · SVG Path',
    defaultParams: {
      productTitle: '에이전트 총괄부장 코다리',
      subTitle: '대표님, 오늘도 1사이클 완주했습니다!',
      badgeText: 'KODARI AI',
      priceText: '충성! 🫡',
      bgColor: '#064e3b',
      accentColor: '#34d399'
    },
    code: `// frames=150 size=1080x1920 (9:16 Shorts)
import { AbsoluteFill, spring, useCurrentFrame } from 'remotion';

export const CharacterIntro = () => {
  const frame = useCurrentFrame();
  const pop = spring({ frame: frame - 15, fps: 30, config: { damping: 8 } });

  return (
    <AbsoluteFill style={{ background: '#022c22', color: '#fff', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ transform: \`scale(\${pop})\`, textAlign: 'center' }}>
        <div style={{ fontSize: 100 }}>🐟</div>
        <div style={{ background: '#fff', color: '#000', padding: '16px 28px', borderRadius: 20, marginTop: 20 }}>
          <h2 style={{ fontSize: 32, margin: 0 }}>코다리 부장 출근 완료!</h2>
        </div>
      </div>
    </AbsoluteFill>
  );
};`
  },
  {
    id: 'captions-fx',
    cat: 'text',
    catName: '✍️ 자막 & 바이럴 FX',
    title: '틱톡·릴스 쇼츠 자막 & 형광펜 강조',
    duration: '4초 (120 프레임)',
    desc: '말하는 타이밍에 맞춰 단어가 튀어나오고 손그림 형광펜 밑줄이 좍 그어지는 몰입형 자막',
    api: '@remotion/captions · @remotion/rough-notation',
    defaultParams: {
      productTitle: '코드로 만드는 영상 자동화',
      subTitle: '렌더링 비용 0원, 무제한 생성!',
      badgeText: 'HOT VIRAL',
      priceText: '지금 바로 실행',
      bgColor: '#172554',
      accentColor: '#fbbf24'
    },
    code: `// frames=120 size=1080x1920 (Shorts Captions)
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';

export const CaptionScene = () => {
  const frame = useCurrentFrame();
  const scale = spring({ frame: frame - 10, fps: 30, config: { damping: 9 } });

  return (
    <AbsoluteFill style={{ background: '#020617', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ transform: \`scale(\${scale})\`, background: '#f59e0b', color: '#000', padding: '18px 36px', borderRadius: 24, fontSize: 44, fontWeight: 900 }}>
        코드로 만드는 숏폼 영상!
      </div>
    </AbsoluteFill>
  );
};`
  }
];

export default function RemotionStudio() {
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [activeCat, setActiveCat] = useState('all');
  const [aspectRatio, setAspectRatio] = useState('16:9'); // '16:9' or '9:16'
  const [isPlaying, setIsPlaying] = useState(true);
  const [frame, setFrame] = useState(0);
  const [copiedKey, setCopiedKey] = useState(null);
  const [activePanelTab, setActivePanelTab] = useState('customize'); // 'customize' or 'code' or 'cli'
  
  // 실시간 파라미터 상태
  const [params, setParams] = useState(TEMPLATES[0].defaultParams);

  // 템플릿 변경 시 파라미터 리셋
  const handleSelectTemplate = (tpl) => {
    setSelectedTemplate(tpl);
    setParams(tpl.defaultParams);
    setFrame(0);
    setIsPlaying(true);
  };

  // 프레임 애니메이션 루프
  useEffect(() => {
    let animId;
    if (isPlaying) {
      animId = setInterval(() => {
        setFrame((prev) => (prev + 1) % 180);
      }, 1000 / 30); // 30fps
    }
    return () => clearInterval(animId);
  }, [isPlaying]);

  // 클립보드 복사
  const handleCopy = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  // 카테고리 필터링
  const filteredTemplates = activeCat === 'all' 
    ? TEMPLATES 
    : TEMPLATES.filter((t) => t.cat === activeCat);

  // ── 실시간 캔버스 시뮬레이션 계산 ──
  const progressRatio = (frame % 180) / 180;
  const bounceY = Math.sin(progressRatio * Math.PI) * -35;
  const sweepPos = (progressRatio * 200) - 50;

  return (
    <div className="remotion-studio-container">
      {/* ── 1. 상단 히어로 배너 ── */}
      <div className="rs-hero-banner">
        <div className="rs-badge-row">
          <span className="rs-pill-badge green"><Sparkles size={12} /> REMOTION 4.0</span>
          <span className="rs-pill-badge purple"><Zap size={12} /> 렌더링 비용 0원</span>
          <span className="rs-pill-badge"><Monitor size={12} /> 무인 자동 렌더링</span>
        </div>
        <h1 className="rs-hero-title">
          🎬 Remotion <span>영상 바이브코딩 스튜디오</span>
        </h1>
        <p className="rs-hero-desc">
          프리미어·캡컷 노가다 끝! 데이터(JSON·이미지)만 넣으면 1초 만에 릴스·숏폼·퀴즈 영상이 코드로 자동 렌더링되는 에이전트 무인 영상 공장입니다.
        </p>
        <div className="rs-stats-strip">
          <div className="rs-stat-box">
            <span className="rs-stat-label">등록 템플릿</span>
            <span className="rs-stat-val">44+ 실전 예제</span>
          </div>
          <div className="rs-stat-box">
            <span className="rs-stat-label">영상 렌더 비용</span>
            <span className="rs-stat-val" style={{ color: '#34d399' }}>완전 0원 (로컬)</span>
          </div>
          <div className="rs-stat-box">
            <span className="rs-stat-label">적용 비즈니스</span>
            <span className="rs-stat-val" style={{ color: '#60a5fa' }}>쇼츠 · 스마트스토어</span>
          </div>
          <div className="rs-stat-box">
            <span className="rs-stat-label">평균 렌더 속도</span>
            <span className="rs-stat-val">초당 60fps 초고속</span>
          </div>
        </div>
      </div>

      {/* ── 2. 카테고리 필터 탭 ── */}
      <div className="rs-category-bar">
        <button 
          className={`rs-cat-btn ${activeCat === 'all' ? 'active' : ''}`}
          onClick={() => setActiveCat('all')}
        >
          전체 템플릿 <span className="rs-cat-count">{TEMPLATES.length}</span>
        </button>
        <button 
          className={`rs-cat-btn ${activeCat === 'ad' ? 'active' : ''}`}
          onClick={() => setActiveCat('ad')}
        >
          🛍️ 제품 광고·릴스 <span className="rs-cat-count">2</span>
        </button>
        <button 
          className={`rs-cat-btn ${activeCat === 'quiz' ? 'active' : ''}`}
          onClick={() => setActiveCat('quiz')}
        >
          🎯 퀴즈·타이머 <span className="rs-cat-count">1</span>
        </button>
        <button 
          className={`rs-cat-btn ${activeCat === 'char' ? 'active' : ''}`}
          onClick={() => setActiveCat('char')}
        >
          🤖 캐릭터·브랜드 <span className="rs-cat-count">1</span>
        </button>
        <button 
          className={`rs-cat-btn ${activeCat === 'text' ? 'active' : ''}`}
          onClick={() => setActiveCat('text')}
        >
          ✍️ 자막·바이럴 <span className="rs-cat-count">1</span>
        </button>
      </div>

      {/* ── 3. 메인 인터랙티브 작업 그리드 ── */}
      <div className="rs-main-grid">
        {/* 좌측: 실시간 플레이어 시뮬레이터 */}
        <div className="rs-preview-card">
          <div className="rs-preview-header">
            <div className="rs-preview-title-area">
              <span className="rs-tag">{selectedTemplate.catName}</span>
              <h3 className="rs-preview-title">{selectedTemplate.title}</h3>
            </div>
            <div className="rs-ratio-toggles">
              <button 
                className={`rs-ratio-btn ${aspectRatio === '16:9' ? 'active' : ''}`}
                onClick={() => setAspectRatio('16:9')}
              >
                16:9 가로
              </button>
              <button 
                className={`rs-ratio-btn ${aspectRatio === '9:16' ? 'active' : ''}`}
                onClick={() => setAspectRatio('9:16')}
              >
                9:16 쇼츠
              </button>
            </div>
          </div>

          {/* 캔버스 화면 시뮬레이터 */}
          <div 
            className={`rs-player-wrap ${aspectRatio === '9:16' ? 'vertical' : ''}`}
            style={{ 
              background: `radial-gradient(circle at center, ${params.bgColor} 0%, #030712 100%)` 
            }}
          >
            {/* 백그라운드 워터마크 문구 */}
            <div style={{
              position: 'absolute',
              fontSize: aspectRatio === '9:16' ? 56 : 72,
              fontWeight: 900,
              color: 'rgba(255,255,255,0.06)',
              letterSpacing: '0.1em',
              userSelect: 'none'
            }}>
              REMOTION
            </div>

            {/* 상단 배지 태그 */}
            <div style={{
              position: 'absolute',
              top: 24,
              background: '#ef4444',
              color: '#fff',
              padding: '6px 16px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 800,
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)'
            }}>
              {params.badgeText}
            </div>

            {/* 중앙 모션 객체 (스프링 바운스 & 빛 쓸기) */}
            <div style={{
              transform: `translateY(${bounceY}px)`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative'
            }}>
              {/* 메인 아이콘/그래픽 */}
              <div style={{
                fontSize: aspectRatio === '9:16' ? 80 : 96,
                filter: 'drop-shadow(0 16px 24px rgba(0,0,0,0.6))',
                userSelect: 'none'
              }}>
                {selectedTemplate.id === 'hero-ad' && '🥤'}
                {selectedTemplate.id === 'quiz-timer' && '⏱️'}
                {selectedTemplate.id === 'carousel-ad' && '📦'}
                {selectedTemplate.id === 'char-motion' && '🐟'}
                {selectedTemplate.id === 'captions-fx' && '⚡'}
              </div>

              {/* 퀴즈 타이머 전용 프로그레스 바 */}
              {selectedTemplate.id === 'quiz-timer' && (
                <div style={{ width: 180, height: 8, background: '#1e293b', borderRadius: 4, marginTop: 12, overflow: 'hidden' }}>
                  <div style={{ width: `${Math.max(0, 100 - (progressRatio * 100))}%`, height: '100%', background: '#f59e0b' }} />
                </div>
              )}
            </div>

            {/* 하단 텍스트 및 카피 */}
            <div style={{
              position: 'absolute',
              bottom: 24,
              textAlign: 'center',
              padding: '0 20px'
            }}>
              <h2 style={{
                fontSize: aspectRatio === '9:16' ? 18 : 22,
                fontWeight: 900,
                color: '#ffffff',
                margin: '0 0 6px 0',
                textShadow: '0 2px 10px rgba(0,0,0,0.7)'
              }}>
                {params.productTitle}
              </h2>
              <p style={{
                fontSize: aspectRatio === '9:16' ? 12 : 14,
                color: '#cbd5e1',
                margin: '0 0 10px 0'
              }}>
                {params.subTitle}
              </p>
              <div style={{
                display: 'inline-block',
                background: params.accentColor,
                color: '#000',
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 900
              }}>
                {params.priceText}
              </div>
            </div>
          </div>

          {/* 재생 컨트롤 바 */}
          <div className="rs-controls-bar">
            <div className="rs-control-buttons">
              <button 
                className="rs-play-btn"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                <span>{isPlaying ? '일시정지' : '실시간 재생'}</span>
              </button>
              <span className="rs-frame-label">
                FRAME: {frame} / 180 ({(frame / 30).toFixed(1)}s)
              </span>
              <button 
                className="rs-copy-btn"
                onClick={() => setFrame(0)}
                title="처음으로 되감기"
              >
                <RotateCcw size={13} />
              </button>
            </div>
            <input 
              type="range" 
              min="0" 
              max="180" 
              value={frame}
              onChange={(e) => {
                setFrame(Number(e.target.value));
                setIsPlaying(false);
              }}
              className="rs-scrubber"
            />
          </div>
        </div>

        {/* 우측: 파라미터 커스텀 & 소스 코드 패널 */}
        <div className="rs-config-card">
          <div className="rs-panel-tab-bar">
            <button 
              className={`rs-panel-tab ${activePanelTab === 'customize' ? 'active' : ''}`}
              onClick={() => setActivePanelTab('customize')}
            >
              <Sliders size={14} style={{ display: 'inline', marginRight: 4 }} /> 텍스트·색상 커스텀
            </button>
            <button 
              className={`rs-panel-tab ${activePanelTab === 'code' ? 'active' : ''}`}
              onClick={() => setActivePanelTab('code')}
            >
              <Layers size={14} style={{ display: 'inline', marginRight: 4 }} /> Scene.tsx 코드
            </button>
            <button 
              className={`rs-panel-tab ${activePanelTab === 'cli' ? 'active' : ''}`}
              onClick={() => setActivePanelTab('cli')}
            >
              <Terminal size={14} style={{ display: 'inline', marginRight: 4 }} /> 터미널 렌더링
            </button>
          </div>

          {/* TAB 1: 텍스트 & 색상 커스텀 폼 */}
          {activePanelTab === 'customize' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="rs-form-group">
                <label>메인 타이틀 (제품명 / 퀴즈 질문)</label>
                <input 
                  type="text" 
                  value={params.productTitle} 
                  onChange={(e) => setParams({ ...params, productTitle: e.target.value })}
                  className="rs-form-input" 
                />
              </div>

              <div className="rs-form-group">
                <label>서브 카피 (특징 / 안내 문구)</label>
                <input 
                  type="text" 
                  value={params.subTitle} 
                  onChange={(e) => setParams({ ...params, subTitle: e.target.value })}
                  className="rs-form-input" 
                />
              </div>

              <div className="rs-row-2col">
                <div className="rs-form-group">
                  <label>상단 배지 (할인 / 태그)</label>
                  <input 
                    type="text" 
                    value={params.badgeText} 
                    onChange={(e) => setParams({ ...params, badgeText: e.target.value })}
                    className="rs-form-input" 
                  />
                </div>
                <div className="rs-form-group">
                  <label>강조 문구 (가격 / 정답)</label>
                  <input 
                    type="text" 
                    value={params.priceText} 
                    onChange={(e) => setParams({ ...params, priceText: e.target.value })}
                    className="rs-form-input" 
                  />
                </div>
              </div>

              <div className="rs-row-2col">
                <div className="rs-form-group">
                  <label>배경 테마 컬러</label>
                  <input 
                    type="color" 
                    value={params.bgColor} 
                    onChange={(e) => setParams({ ...params, bgColor: e.target.value })}
                    style={{ width: '100%', height: 38, border: 'none', borderRadius: 8, cursor: 'pointer', background: '#131c2e' }} 
                  />
                </div>
                <div className="rs-form-group">
                  <label>포인트 버튼 컬러</label>
                  <input 
                    type="color" 
                    value={params.accentColor} 
                    onChange={(e) => setParams({ ...params, accentColor: e.target.value })}
                    style={{ width: '100%', height: 38, border: 'none', borderRadius: 8, cursor: 'pointer', background: '#131c2e' }} 
                  />
                </div>
              </div>

              <div style={{ background: '#111a2e', padding: 12, borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: 12, color: '#38bdf8', fontWeight: 800 }}>💡 코다리 팁</span>
                <p style={{ fontSize: 11.5, color: '#94a3b8', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                  위 인풋을 수정하면 왼쪽 프리뷰가 즉시 반응합니다. 완벽한 조합을 찾은 후 [Scene.tsx 코드] 탭을 눌러 복사해 사용하세요.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Scene.tsx 소스 코드 */}
          {activePanelTab === 'code' && (
            <div className="rs-code-box">
              <div className="rs-code-bar">
                <span className="rs-code-filename">src/Scene.tsx</span>
                <button 
                  className={`rs-copy-btn ${copiedKey === 'code' ? 'copied' : ''}`}
                  onClick={() => handleCopy('code', selectedTemplate.code)}
                >
                  {copiedKey === 'code' ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedKey === 'code' ? '복사됨!' : '코드 복사'}</span>
                </button>
              </div>
              <pre className="rs-code-content">{selectedTemplate.code}</pre>
            </div>
          )}

          {/* TAB 3: 터미널 렌더링 명령어 */}
          {activePanelTab === 'cli' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="rs-code-box">
                <div className="rs-code-bar">
                  <span className="rs-code-filename">1단계: 프로젝트 생성 (최초 1회)</span>
                  <button 
                    className={`rs-copy-btn ${copiedKey === 'cmd1' ? 'copied' : ''}`}
                    onClick={() => handleCopy('cmd1', 'npx create-video@latest --blank my-remotion-video && cd my-remotion-video')}
                  >
                    {copiedKey === 'cmd1' ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedKey === 'cmd1' ? '복사됨' : '복사'}</span>
                  </button>
                </div>
                <pre className="rs-code-content" style={{ maxHeight: 70 }}>
npx create-video@latest --blank my-remotion-video
cd my-remotion-video
                </pre>
              </div>

              <div className="rs-code-box">
                <div className="rs-code-bar">
                  <span className="rs-code-filename">2단계: MP4 영상 렌더링 (비용 0원)</span>
                  <button 
                    className={`rs-copy-btn ${copiedKey === 'cmd2' ? 'copied' : ''}`}
                    onClick={() => handleCopy('cmd2', 'npx remotion render src/index.ts Scene out/video.mp4')}
                  >
                    {copiedKey === 'cmd2' ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedKey === 'cmd2' ? '복사됨' : '복사'}</span>
                  </button>
                </div>
                <pre className="rs-code-content" style={{ maxHeight: 70 }}>
npx remotion render src/index.ts Scene out/video.mp4
                </pre>
              </div>

              <div style={{ background: '#111a2e', padding: 12, borderRadius: 10 }}>
                <span style={{ fontSize: 12, color: '#34d399', fontWeight: 800 }}>⚡ 완전 무인 렌더링 원리</span>
                <p style={{ fontSize: 11.5, color: '#94a3b8', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                  `--props=data.json` 옵션을 붙이면 엑셀이나 데이터베이스에 있는 100개의 상품을 한 번의 엔터로 100개의 MP4 파일로 자동 대량 생산할 수 있습니다.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 4. 하단 템플릿 카드 갤러리 ── */}
      <div>
        <h3 style={{ fontSize: 17, fontWeight: 800, margin: '10px 0 12px 0', color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Layers size={17} color="#60a5fa" /> 추천 실전 템플릿 라이브러리
        </h3>
        <div className="rs-template-grid">
          {filteredTemplates.map((tpl) => (
            <div 
              key={tpl.id}
              className={`rs-template-card ${selectedTemplate.id === tpl.id ? 'active' : ''}`}
              onClick={() => handleSelectTemplate(tpl)}
            >
              <div className="rs-card-top">
                <span className="rs-card-cat">{tpl.catName}</span>
                <span className="rs-card-duration">{tpl.duration}</span>
              </div>
              <h4 className="rs-card-title">{tpl.title}</h4>
              <p className="rs-card-desc">{tpl.desc}</p>
              <div className="rs-card-footer">
                <span className="rs-card-api">{tpl.api}</span>
                <span className="rs-card-action">선택 <ChevronRight size={13} /></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. 원클릭 실행 레시피 박스 ── */}
      <div className="rs-recipe-box">
        <div className="rs-recipe-title">
          <Zap size={16} color="#f59e0b" />
          <span>코다리 부장의 1분 렌더링 워크플로우</span>
        </div>
        <div className="rs-steps-row">
          <div className="rs-step-item">
            <div className="rs-step-num">1</div>
            <div className="rs-step-content">
              <b>템플릿 선택 및 파라미터 조정</b>
              <p>마음에 드는 모션을 고르고 상품명·가격·배지 문구를 입력합니다.</p>
            </div>
          </div>
          <div className="rs-step-item">
            <div className="rs-step-num">2</div>
            <div className="rs-step-content">
              <b>Scene.tsx 코드 복사</b>
              <p>로컬 Remotion 프로젝트의 `src/Scene.tsx`에 그대로 덮어씁니다.</p>
            </div>
          </div>
          <div className="rs-step-item">
            <div className="rs-step-num">3</div>
            <div className="rs-step-content">
              <b>터미널 렌더링 실행</b>
              <p>`npx remotion render` 명령어 한 줄로 고화질 MP4 완제품 완성!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
