import React, { useEffect, useRef, useState } from 'react';
import './ScrollWorldLanding.css';

// 🌀 데모용 섹션 데이터 정의
const SECTIONS_CONFIG = [
  {
    id: 'intro',
    label: 'AI 콕핏',
    still: '/assets/sc1.png',
    // 🎥 Mixkit 무료 제공 사이버펑크 스타일 데모 비디오 링크
    clip: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-subway-station-with-neon-lights-4413-large.mp4',
    accent: '#8b5cf6', // 보라색
    eyebrow: 'PHASE 1: CONTROL CENTER',
    title: '미래형 AI 1인 기업 콕핏',
    body: '대표님의 모든 비즈니스 가설과 데이터 흐름을 한눈에 통제하는 미래의 작업 공간입니다. 복잡한 코딩 없이 기획과 자동화 명령을 내릴 수 있습니다.',
    tags: ['초고속 가설 검증', '린 비즈니스', '1인 대행']
  },
  {
    id: 'niche',
    label: '니치 스캐너',
    still: '/assets/sc2.png',
    clip: 'https://assets.mixkit.co/videos/preview/mixkit-digital-circuit-board-looping-background-40742-large.mp4',
    accent: '#06b6d4', // 에메랄드빛
    eyebrow: 'PHASE 2: SCAN & FOCUS',
    title: '초정밀 니치 벡터 스캐너',
    body: '대중적인 레드오션 시장에서 멀어지십시오! AI 분석 장치로 바늘구멍처럼 좁고 뾰족하게 파고드는 핵심 틈새 시장의 벡터 거리를 극대화합니다.',
    tags: ['니치 마켓 타겟팅', '벡터 거리 확보', '독보적 포지셔닝']
  },
  {
    id: 'academy',
    label: '코다리 학당',
    still: '/assets/sc3.png',
    clip: 'https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-neon-city-street-at-night-42287-large.mp4',
    accent: '#ec4899', // 핑크색
    eyebrow: 'PHASE 3: scale-UP & REVEAL',
    title: '코다리 AI 에이전트 학당',
    body: '가설 검증에 성공했다면, AI 사단을 풀가동해 비즈니스를 스케일업(Scale-up)할 차례입니다. 무제한에 가까운 생산성으로 평생의 고수익 파이프라인을 구축하세요.',
    tags: ['에이전트 군단', '자동 수익 시스템', '스케일업']
  }
];

export default function ScrollWorldLanding({ onExit }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const videoRefs = useRef([]);

  // 상태 관리
  const [activeIndex, setActiveIndex] = useState(0);
  const [accentColor, setAccentColor] = useState('#8b5cf6');
  const [progressPercent, setProgressPercent] = useState(0);
  const [videoMode, setVideoMode] = useState(false); // 📷 Stills Mode vs 🎥 Video Mode

  // 스크롤 매핑 수학 상수
  const DIVE_SCROLL = 1.4; // 1개 섹션당 scroll-height (뷰포트 배수)
  const CROSSFADE = 0.15; // 겹쳐져 서서히 사라질 전환 윈도우

  // 매 프레임 업데이트할 렌더링 상태를 ref로 관리 (성능 보장)
  const segmentsState = useRef(
    SECTIONS_CONFIG.map(() => ({
      cur: 0,
      target: 0,
      visible: false,
      ready: false
    }))
  );

  // 스크롤 시 계산 및 렌더링 수행
  const updateLayout = () => {
    if (!containerRef.current || !trackRef.current) return;

    const y = window.scrollY;
    const vh = window.innerHeight;
    const wf = 1.0; // 모바일 스크롤 배수 (가볍게 1.0)
    const totalW = SECTIONS_CONFIG.length * DIVE_SCROLL * wf;

    // 전체 트랙 높이 적용
    trackRef.current.style.height = `${(totalW * vh + vh)}px`;

    // 현재 스크롤 진행 퍼센트
    const scrollMax = totalW * vh;
    setProgressPercent(Math.min(100, Math.max(0, (y / scrollMax) * 100)));

    const fade = CROSSFADE * vh;
    let currentIdx = 0;

    SECTIONS_CONFIG.forEach((sec, i) => {
      const segStart = i * DIVE_SCROLL * wf * vh;
      const segEnd = (i + 1) * DIVE_SCROLL * wf * vh;

      if (y >= segStart) {
        currentIdx = i;
      }

      // 로컬 진척도 (0 ~ 1)
      const local = Math.min(1, Math.max(0, (y - segStart) / (segEnd - segStart)));
      segmentsState.current[i].target = local;

      // 페이드 아웃 계산
      let outside = 0;
      if (y < segStart) {
        outside = segStart - y;
      } else if (y > segEnd) {
        outside = y - segEnd;
      }

      // 0 ~ 1 보간 투명도
      const op = Math.max(0, 1 - (outside / fade));
      const smoothOp = op * op * (3 - 2 * op); // smooth-step

      // DOM 요소 제어
      const sceneDom = containerRef.current.querySelector(`#scene-${sec.id}`);
      const copyDom = containerRef.current.querySelector(`#copy-${sec.id}`);

      if (sceneDom) {
        sceneDom.style.opacity = smoothOp;
        sceneDom.style.pointerEvents = smoothOp > 0.1 ? 'auto' : 'none';
        sceneDom.style.zIndex = i === currentIdx ? '12' : String(10 + Math.round(smoothOp * 10));

        // 비디오/이미지 줌인 제어
        const mediaDom = sceneDom.querySelector('.sw-media');
        if (mediaDom && (!videoMode || !segmentsState.current[i].ready)) {
          const sc = 1.02 + local * 0.15; // 줌인 배율
          mediaDom.style.transform = `scale(${sc})`;
        }
      }

      if (copyDom) {
        copyDom.style.opacity = smoothOp;
        copyDom.style.transform = `translateY(${(0.5 - local) * 6}vh)`;
        copyDom.style.pointerEvents = smoothOp > 0.5 ? 'auto' : 'none';
      }
    });

    if (currentIdx !== activeIndex) {
      setActiveIndex(currentIdx);
      setAccentColor(SECTIONS_CONFIG[currentIdx].accent);
    }
  };

  // 비디오 프레임 조작용 RequestAnimationFrame 루프
  useEffect(() => {
    let animId;

    const tick = () => {
      if (videoMode) {
        SECTIONS_CONFIG.forEach((sec, i) => {
          const s = segmentsState.current[i];
          const v = videoRefs.current[i];

          if (v && s.ready) {
            // 부드러운 스크롤 이동 (Lerp 연산)
            s.cur += (s.target - s.cur) * 0.15;

            const duration = v.duration || 1;
            const targetTime = Math.min(0.999, Math.max(0, s.cur)) * duration;

            // 디코더 과부하 방지 (seeking이 끝났을 때만 업데이트)
            if (!v.seeking && Math.abs(v.currentTime - targetTime) > 0.01) {
              v.currentTime = targetTime;
            }
          }
        });
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [videoMode]);

  // 이벤트 마운트
  useEffect(() => {
    updateLayout();
    window.addEventListener('scroll', updateLayout, { passive: true });
    window.addEventListener('resize', updateLayout);

    return () => {
      window.removeEventListener('scroll', updateLayout);
      window.removeEventListener('resize', updateLayout);
    };
  }, [activeIndex, videoMode]);

  // 버튼 클릭 시 특정 씬으로 이동
  const jumpTo = (i) => {
    const vh = window.innerHeight;
    const targetY = i * DIVE_SCROLL * vh + (DIVE_SCROLL * vh) * 0.5;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  return (
    <div className="sw-root-wrapper" ref={containerRef} style={{ '--sw-accent': accentColor }}>
      {/* 🌌 배경 그라데이션 및 입자 효과 */}
      <div className="sw-sky">
        <div className="sw-sky__grad"></div>
        <div className="sw-sky__glow"></div>
        <div className="sw-particles">
          <span className="sw-pt sw-pt--dot" style={{ left: '15vw', top: '20vh', '--sw-sc': 0.7, animationDuration: '18s' }}></span>
          <span className="sw-pt sw-pt--ring" style={{ left: '45vw', top: '50vh', '--sw-sc': 1.1, animationDuration: '22s' }}></span>
          <span className="sw-pt sw-pt--dot" style={{ left: '75vw', top: '30vh', '--sw-sc': 0.9, animationDuration: '15s' }}></span>
          <span className="sw-pt sw-pt--ring" style={{ left: '85vw', top: '75vh', '--sw-sc': 0.6, animationDuration: '25s' }}></span>
        </div>
      </div>

      {/* 📏 상단 프로그레스 바 */}
      <div className="sw-scrollbar">
        <span style={{ transform: `scaleX(${progressPercent / 100})`, transformOrigin: '0% 50%' }}></span>
      </div>

      {/* 🧭 탑 컨트롤바 */}
      <div className="sw-topbar">
        <div className="sw-brand">
          <div className="sw-brand__mark"></div>
          <span className="sw-brand__name">KODARI PORTABLE ENGINE</span>
        </div>

        {/* 모드 토글러 */}
        <div className="sw-mode-toggle">
          <button 
            className={`mode-btn ${!videoMode ? 'active' : ''}`}
            onClick={() => setVideoMode(false)}
          >
            📷 스틸 모드 (안전)
          </button>
          <button 
            className={`mode-btn ${videoMode ? 'active' : ''}`}
            onClick={() => setVideoMode(true)}
          >
            🎥 비디오 모션 (체험)
          </button>
        </div>

        <button className="sw-exit-btn" onClick={onExit}>
          🚪 공부방 복귀
        </button>
      </div>

      {/* 🎬 미디어 레이어 (스테이지) */}
      <div className="sw-stage">
        {SECTIONS_CONFIG.map((sec, i) => (
          <div key={sec.id} id={`scene-${sec.id}`} className="sw-scene">
            {videoMode ? (
              <video
                ref={(el) => {
                  if (el) {
                    videoRefs.current[i] = el;
                    el.addEventListener('loadedmetadata', () => {
                      segmentsState.current[i].ready = true;
                    });
                  }
                }}
                className="sw-media sw-scene__video"
                src={sec.clip}
                muted
                playsInline
                preload="auto"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <img
                className="sw-media sw-scene__still"
                src={sec.still}
                alt={sec.label}
                loading="lazy"
              />
            )}
            {/* 오버레이 필터 */}
            <div className="sw-scene-overlay" />
          </div>
        ))}
      </div>

      {/* 📝 좌측 텍스트 정보 레이어 */}
      <div className="sw-copylayer">
        {SECTIONS_CONFIG.map((sec, i) => (
          <article key={sec.id} id={`copy-${sec.id}`} className="sw-copy">
            <span className="sw-copy__num">{String(i + 1).padStart(2, '0')} / {String(SECTIONS_CONFIG.length).padStart(2, '0')}</span>
            <span className="sw-copy__eyebrow">{sec.eyebrow}</span>
            <h2 className="sw-copy__title">{sec.title}</h2>
            <p className="sw-copy__body">{sec.body}</p>
            <ul className="sw-copy__tags">
              {sec.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      {/* 📍 우측 도트 네비게이션 */}
      <div className="sw-route">
        {SECTIONS_CONFIG.map((sec, i) => (
          <button
            key={sec.id}
            onClick={() => jumpTo(i)}
            className={`sw-route__dot ${activeIndex === i ? 'is-active' : ''}`}
          >
            <span className="sw-route__label">{sec.label}</span>
            <i />
          </button>
        ))}
      </div>

      {/* 🖱️ 스크롤 유도 힌트 */}
      <div className="sw-hint">
        <span>SCROLL TO DIVE IN</span>
        <i />
      </div>

      {/* 🛣️ 스크롤 길이를 늘려주기 위한 빈 물리 트랙 */}
      <div className="sw-track" ref={trackRef} />
    </div>
  );
}
