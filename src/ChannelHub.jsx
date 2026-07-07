import React, { useState, useEffect } from 'react';
import './ChannelHub.css';
import { Play, Pause, Music, Volume2, Tv, Users, Award, Sparkles, Cpu, Layers, ArrowRight, ArrowLeft, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import WizardCVLanding from './WizardCVLanding';
import IdeaLandingPage from './IdeaLandingPage';

function ChannelHub({ onClose }) {
  const [showWizardLanding, setShowWizardLanding] = useState(false);
  const [activeIdea, setActiveIdea] = useState(null); // null | 'meme' | 'voice' | 'spyder'
  
  const handleLaunchIdea = (type) => {
    setActiveIdea(type);
  };
  
  // 음악 플레이어 상태
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [audioVolume, setAudioVolume] = useState(70);

  const tracks = [
    { title: "Neon Midnight Lounge", bpm: 102, duration: "3:12", style: "Cyber Lo-Fi" },
    { title: "Rainy Study Desk Lo-Fi", bpm: 88, duration: "2:45", style: "Chillhop" },
    { title: "102 BPM Office Groove", bpm: 102, duration: "3:30", style: "Synthwave" },
    { title: "Ghibli Summer Pear Orchard", bpm: 80, duration: "4:00", style: "Cinematic Acoustic" }
  ];

  // 철만이 극장 상태
  const [currentCut, setCurrentCut] = useState(0);
  const cuts = [
    { 
      id: "C01", 
      title: "1화 - 죽음을 각오한 변소", 
      desc: "나는 초등학교 1학년 때 죽음을 각오했다. 그것도... 변소에서.", 
      tag: "tiny boy, towering tall trees", 
      image: "💩" 
    },
    { 
      id: "C02", 
      title: "2화 - 개울가의 대치", 
      desc: "소나무가 늘어선 붉은 노을 길, 으르렁거리는 세파트와 마주친 긴장의 순간.", 
      tag: "sunset, narrow path, dog growling", 
      image: "🐕" 
    },
    { 
      id: "C03", 
      title: "3화 - 학교 앞 등교길", 
      desc: "양갈래 머리 소녀와 마주친 순간, 내 머릿속엔 온통 뻥튀기 생각뿐이었다.", 
      tag: "elementary school, tiny girl, pear trees", 
      image: "🏫" 
    }
  ];

  // Fugu 협업 에뮬레이터 상태
  const [fuguInput, setFuguInput] = useState('');
  const [fuguStage, setFuguStage] = useState(0); // 0: 대기, 1: Thinker, 2: Worker, 3: Verifier, 4: 완성
  const [fuguLogs, setFuguLogs] = useState({ thinker: '', worker: '', verifier: '' });

  const startFuguDemo = () => {
    if (!fuguInput.trim()) return;
    setFuguStage(1);
    setFuguLogs({ thinker: '', worker: '', verifier: '' });

    // 1단계: Thinker 작동 연출
    setTimeout(() => {
      setFuguLogs(prev => ({ 
        ...prev, 
        thinker: `💡 [Thinker 기획 보고서]\n대표님 지시사항 "${fuguInput}"에 대한 기획안을 도출했습니다.\n1. 타겟 분석: 1인 기업 및 자동화 관심층\n2. 실행 로드맵: 에셋 수집 ➡️ 영상 템플릿 빌드 ➡️ Vrew 자동 나레이션\n3. 핵심 포인트: 초반 6초 후킹 전략 배치.` 
      }));
      setFuguStage(2);
    }, 1500);

    // 2단계: Worker 작동 연출
    setTimeout(() => {
      setFuguLogs(prev => ({ 
        ...prev, 
        worker: `🛠️ [Worker 실무 출력물]\n기획안을 바탕으로 실제 콘텐츠 초안을 빌드했습니다.\n[대본 초안] "자는 동안 돈을 버는 AI 자동화 비법, 대표님만 아는 극비 정보를 공개합니다. 6초 만에 시청자를 사로잡는 마법의 템플릿!"` 
      }));
      setFuguStage(3);
    }, 3000);

    // 3단계: Verifier 작동 연출
    setTimeout(() => {
      setFuguLogs(prev => ({ 
        ...prev, 
        verifier: `🏆 [Verifier 최종 검수서]\n1차 완성본 검수를 마쳤습니다.\n- 피드백 반영: 오디오 볼륨 노멀라이징(Loudnorm) 적용 완료.\n- 톤앤매너 교정: 102 BPM 오피스 그루브에 싱크로율 100% 매칭.\n대표님 승인 대기 중입니다! OK 승인을 내려주십시오.` 
      }));
      setFuguStage(4);
    }, 4500);
  };

  return (
    <div className="hub-page">
      {/* 🚀 상단 헤더 */}
      <header className="hub-header">
        <div className="hub-logo">
          <div className="glow-dot"></div>
          <span>CONNECT AI AGENT HUB</span>
        </div>
        <div className="hub-header-actions">
          <span className="badge-live">LIVE SHOWCASE</span>
          <button className="btn-close-hub" onClick={onClose}>
            공부방으로 돌아가기 🚪
          </button>
        </div>
      </header>

      {/* 🌌 메인 히어로 섹션 */}
      <section className="hub-hero">
        <div className="hero-content">
          <div className="hero-badge"><Sparkles size={12} /> 시즌 2 그랜드 오프닝</div>
          <h1>우리는 0원으로 <br /><span className="text-gradient">AI 군단을 지휘한다</span></h1>
          <p>
            1인 기업가를 위한 최첨단 로컬 AI 연구소. 클라우드 비용 없이, <br />
            대표님의 PC 안에서 강력한 에이전트들이 스스로 협업하여 유튜브 콘텐츠를 창조합니다.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => setShowWizardLanding(true)}>
              🪄 마법 이력서 MVP 런칭 검증기 ↗
            </button>
            <a href="#agents" className="btn-outline">에이전트 군단 만나기</a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-orb pink"></div>
          <div className="visual-orb cyan"></div>
          <div className="visual-card">
            <Cpu size={32} className="card-icon" />
            <h3>Connect AI v6 Engine</h3>
            <div className="bar-graph">
              <div className="bar" style={{ height: '70%' }}></div>
              <div className="bar" style={{ height: '90%' }}></div>
              <div className="bar" style={{ height: '60%' }}></div>
              <div className="bar" style={{ height: '95%' }}></div>
            </div>
            <p>Active Agents: 3 / Load: Optimized</p>
          </div>
        </div>
      </section>

      {/* 👥 에이전트 군단 섹션 */}
      <section id="agents" className="hub-section">
        <div className="section-title">
          <h2> 에이전트 군단 라인업</h2>
          <p>각기 다른 개성과 최고의 스킬을 장착한 비즈니스 파트너들입니다.</p>
        </div>

        <div className="agents-grid">
          {/* 에이전트 1: 코다리 */}
          <div className="agent-card">
            <div className="agent-avatar">🤖</div>
            <div className="agent-info">
              <span className="agent-role">총괄 부장</span>
              <h3>코다리 (Kodari)</h3>
              <p className="agent-desc">
                대표님 보좌 총괄 및 학습 관리자. 노션 데이터 연동, AI 브리핑 요약, 복습 시험 출제 및 오답노트 작성을 성심성의껏 대답하고 수행합니다.
              </p>
              <div className="agent-skills">
                <span>Notion API</span>
                <span>Gemini 브리핑</span>
                <span>오답노트 설계</span>
              </div>
            </div>
          </div>

          {/* 에이전트 2: 레오 */}
          <div className="agent-card border-gold">
            <div className="agent-avatar">🦁</div>
            <div className="agent-info">
              <span className="agent-role text-gold">유튜브 전략 본부장</span>
              <h3>레오 (Leo)</h3>
              <p className="agent-desc">
                유튜브 채널의 알고리즘을 해킹하고 조회수 정체 원인을 픽셀 단위로 분석합니다. 대표님께 달콤한 말 대신 자비 없는 데이터 팩트 폭격을 날립니다.
              </p>
              <div className="agent-skills">
                <span>알고리즘 분석</span>
                <span>6초 생존법칙</span>
                <span>채널 브랜딩</span>
              </div>
            </div>
          </div>

          {/* 에이전트 3: 라라 */}
          <div className="agent-card">
            <div className="agent-avatar">🎵</div>
            <div className="agent-info">
              <span className="agent-role">수석 아티스트</span>
              <h3>라라 (Lara)</h3>
              <p className="agent-desc">
                Lyria 3 Pro 엔진을 활용하여 보컬 없는 고유의 48kHz Hi-Fi 배경음악(BGM)을 만듭니다. 채널 무드에 맞게 사운드스케이프를 생성 및 믹싱합니다.
              </p>
              <div className="agent-skills">
                <span>Lyria 3 Pro</span>
                <span>Soundscapes</span>
                <span>Hi-Fi 믹싱</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 1인 AI SaaS 실험실 섹션 */}
      <section className="hub-section sandbox-section" style={{ background: 'rgba(15, 23, 42, 0.35)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '32px' }}>
        <div className="section-title">
          <h2>🚀 대표님의 1인 AI SaaS 실험실 (SaaS Sandbox)</h2>
          <p>마크 루처럼 빠르게 가설을 세워 런칭하고, 안 되면 빠르게 버리는 1인 AI 창업가의 실시간 비즈니스 테스트 공간입니다.</p>
        </div>

        <div className="sandbox-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginTop: '24px' }}>
          
          {/* 기존 WizardCV */}
          <div className="sandbox-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="sandbox-badge" style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.3)', color: '#22d3ee', fontSize: '10px', padding: '4px 10px', borderRadius: '9999px', fontWeight: 700 }}>
                🧪 실시간 검증 가동중
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 10px 0' }}>🪄 WizardCV (3D 이력서 카드)</h3>
              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '20px' }}>
                사진 1장으로 눈을 깜빡이는 3D 움직이는 카드형 이력서/청첩장을 만들어 주는 프리미엄 래퍼 서비스 가설입니다.
              </p>
            </div>
            <div>
              <button 
                className="btn-launch-sandbox" 
                onClick={() => setShowWizardLanding(true)}
                style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1)', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', width: '100%', justifyContent: 'center' }}
              >
                <span>SaaS 랜딩페이지 MVP 가동하기</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* 신규 아이디어 A: Meme Spark */}
          <div className="sandbox-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="sandbox-badge" style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(236, 72, 153, 0.15)', border: '1px solid rgba(236, 72, 153, 0.3)', color: '#f472b6', fontSize: '10px', padding: '4px 10px', borderRadius: '9999px', fontWeight: 700 }}>
                💡 밈 & 숏폼 니치
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 10px 0' }}>🎮 Meme Spark (밈 제너레이터)</h3>
              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '20px' }}>
                텍스트만 넣으면 유행하는 밈 템플릿 숏폼 비디오를 3초 만에 생성해주는 AI 숏폼 바이럴 특화 래퍼 SaaS입니다.
              </p>
            </div>
            <div>
              <button 
                className="btn-launch-sandbox" 
                onClick={() => handleLaunchIdea('meme')}
                style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', width: '100%', justifyContent: 'center' }}
              >
                <span>Meme Spark MVP 런칭하기</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* 신규 아이디어 B: Voice Mood Tuner */}
          <div className="sandbox-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="sandbox-badge" style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)', color: '#c084fc', fontSize: '10px', padding: '4px 10px', borderRadius: '9999px', fontWeight: 700 }}>
                🎙️ 보이스 & 성우 니치
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 10px 0' }}>🎙️ Voice Mood Tuner</h3>
              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '20px' }}>
                나레이션 원고를 올리고 슬라이더를 흔들어 감정선을 정밀 튜닝하여 고마진 성우 오디오를 빌딩해 주는 SaaS입니다.
              </p>
            </div>
            <div>
              <button 
                className="btn-launch-sandbox" 
                onClick={() => handleLaunchIdea('voice')}
                style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1)', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', width: '100%', justifyContent: 'center' }}
              >
                <span>Voice Tuner MVP 런칭하기</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* 신규 아이디어 C: Copy Spider */}
          <div className="sandbox-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="sandbox-badge" style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.3)', color: '#22d3ee', fontSize: '10px', padding: '4px 10px', borderRadius: '9999px', fontWeight: 700 }}>
                ✍️ 카피라이팅 니치
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 10px 0' }}>🕷️ Copy Spider (썸네일 카피)</h3>
              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '20px' }}>
                유튜브 링크만 넣으면 조회수 터진 썸네일 카피 구조를 훔쳐와 분석하여 프롬프트와 클릭 유도 문구를 제공하는 SaaS입니다.
              </p>
            </div>
            <div>
              <button 
                className="btn-launch-sandbox" 
                onClick={() => handleLaunchIdea('spyder')}
                style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', width: '100%', justifyContent: 'center' }}
              >
                <span>Copy Spider MVP 런칭하기</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 🎵 Yellow Groove 뮤직 믹서 섹션 */}
      <section id="mixer" className="hub-section">
        <div className="section-title">
          <h2> Yellow Groove Music Station</h2>
          <p>라라가 조율한 102 BPM 오피스 그루브 감성의 고음질 BGM을 라이브로 감상해 보세요.</p>
        </div>

        <div className="music-player-container">
          <div className="player-left">
            <div className="vinyl-area">
              <div className={`vinyl ${isPlaying ? 'spinning' : ''}`}>
                <div className="vinyl-center">🎵</div>
              </div>
              <div className="music-glow"></div>
            </div>
            <div className="now-playing">
              <h3>{tracks[currentTrack].title}</h3>
              <p>{tracks[currentTrack].style} • {tracks[currentTrack].bpm} BPM</p>
            </div>
          </div>

          <div className="player-right">
            {/* 오디오 파형 시각화 */}
            <div className="visualizer-container">
              {[...Array(24)].map((_, i) => (
                <div 
                  key={i} 
                  className={`v-bar ${isPlaying ? 'animating' : ''}`}
                  style={{ 
                    animationDelay: `${i * 0.08}s`,
                    height: isPlaying ? 'auto' : '15%'
                  }}
                ></div>
              ))}
            </div>

            {/* 콘트롤러 */}
            <div className="player-controls">
              <button className="control-btn" onClick={() => setCurrentTrack(prev => (prev - 1 + tracks.length) % tracks.length)}>
                <SkipBackIcon />
              </button>
              <button className="control-btn play" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button className="control-btn" onClick={() => setCurrentTrack(prev => (prev + 1) % tracks.length)}>
                <SkipForwardIcon />
              </button>
            </div>

            {/* 트랙 목록 */}
            <div className="track-list">
              {tracks.map((track, index) => (
                <div 
                  key={index} 
                  className={`track-item ${currentTrack === index ? 'active' : ''}`}
                  onClick={() => { setCurrentTrack(index); setIsPlaying(true); }}
                >
                  <Music size={14} />
                  <span className="track-title">{track.title}</span>
                  <span className="track-bpm">{track.bpm} BPM</span>
                  <span className="track-duration">{track.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 🎬 철만이 일기 아카이브 극장 */}
      <section className="hub-section">
        <div className="section-title">
          <h2> 철만이 일기 극장 (Cheolmani Gallery)</h2>
          <p>YouTube 인기 연재작 '@cheolmani_diary'의 고정 컷 및 감정 시트 아카이브입니다.</p>
        </div>

        <div className="theater-container">
          <div className="theater-screen">
            <div className="screen-content">
              <span className="screen-emoji">{cuts[currentCut].image}</span>
              <div className="screen-overlay">
                <span className="cut-id">{cuts[currentCut].id}</span>
                <h4>{cuts[currentCut].title}</h4>
                <p>"{cuts[currentCut].desc}"</p>
              </div>
            </div>
          </div>

          <div className="theater-sidebar">
            <h3>🎬 컷 씬 선택</h3>
            <div className="cut-list">
              {cuts.map((cut, index) => (
                <button 
                  key={cut.id} 
                  className={`cut-btn ${currentCut === index ? 'active' : ''}`}
                  onClick={() => setCurrentCut(index)}
                >
                  <span className="cut-num">{cut.id}</span>
                  <div className="cut-txt">
                    <strong>{cut.title}</strong>
                    <span>{cut.tag}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 🐡 Fugu 협업 데모 시뮬레이터 */}
      <section className="hub-section" style={{ marginBottom: '80px' }}>
        <div className="section-title">
          <h2> Fugu AI 협업 에뮬레이터 (Specialist Chain)</h2>
          <p>기획(Thinker)부터 실무(Worker), 검수(Verifier)까지 이어지는 AI 협업의 힘을 직접 작동해 보세요.</p>
        </div>

        <div className="fugu-demo-card">
          <div className="demo-input-row">
            <input 
              type="text" 
              placeholder="예: 80년대 시골 학교 앞 떡볶이집 이야기 영상 기획해줘" 
              value={fuguInput}
              onChange={(e) => setFuguInput(e.target.value)}
              disabled={fuguStage > 0 && fuguStage < 4}
            />
            <button 
              onClick={startFuguDemo}
              disabled={!fuguInput.trim() || (fuguStage > 0 && fuguStage < 4)}
            >
              협업 파이프라인 가동 🚀
            </button>
          </div>

          <div className="demo-steps-grid">
            {/* Step 1 */}
            <div className={`demo-step-box ${fuguStage === 1 ? 'running' : fuguStage > 1 ? 'done' : ''}`}>
              <div className="step-hdr">
                <span>1단계</span>
                <h4>🧠 Thinker (기획)</h4>
              </div>
              {fuguLogs.thinker && <pre className="step-body">{fuguLogs.thinker}</pre>}
            </div>

            {/* Step 2 */}
            <div className={`demo-step-box ${fuguStage === 2 ? 'running' : fuguStage > 2 ? 'done' : ''}`}>
              <div className="step-hdr">
                <span>2단계</span>
                <h4>🛠️ Worker (실무)</h4>
              </div>
              {fuguLogs.worker && <pre className="step-body">{fuguLogs.worker}</pre>}
            </div>

            {/* Step 3 */}
            <div className={`demo-step-box ${fuguStage === 3 ? 'running' : fuguStage > 3 ? 'done' : ''}`}>
              <div className="step-hdr">
                <span>3단계</span>
                <h4>🔍 Verifier (검수)</h4>
              </div>
              {fuguLogs.verifier && <pre className="step-body">{fuguLogs.verifier}</pre>}
            </div>
          </div>
        </div>
      </section>

      {/* ✉️ WizardCV Landing Page Overlay */}
      {showWizardLanding && (
        <WizardCVLanding onClose={() => setShowWizardLanding(false)} />
      )}

      {/* 💡 신규 SaaS 아이디어 검증 오버레이 */}
      {activeIdea && (
        <IdeaLandingPage ideaType={activeIdea} onClose={() => setActiveIdea(null)} />
      )}

      {/* 푸터 */}
      <footer className="hub-footer">
        <p>© 2026 CONNECT AI LAB. 에이전트 군단 총괄 부장 코다리 올림 🫡</p>
      </footer>
    </div>
  );
}

// 아이콘 헬퍼
function SkipBackIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
  );
}

function SkipForwardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
  );
}

export default ChannelHub;
