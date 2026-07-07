import React, { useState, useEffect, useRef } from 'react';
import './AvatarStudio.css';
import { Sparkles, Upload, Wand2, Download, Share2, Zap, Loader2, RefreshCw, Send, Check } from 'lucide-react';

// 에셋 이미지 로드
import maleOriginal from './assets/male_original.png';
import maleSuit from './assets/male_suit.png';
import maleCyberpunk from './assets/male_cyberpunk.png';
import maleAnime from './assets/male_anime.png';
import maleWizard from './assets/male_wizard.png';

import femaleOriginal from './assets/female_original.png';
import femaleSuit from './assets/female_suit.png';
import femaleCyberpunk from './assets/female_cyberpunk.png';
import femaleAnime from './assets/female_anime.png';
import femaleWizard from './assets/female_wizard.png';

function AvatarStudio() {
  // 1. 입력 및 설정 상태
  const [selectedGender, setSelectedGender] = useState('female'); // 'male' | 'female'
  const [selectedStyle, setSelectedStyle] = useState('wizard_news'); // 기본 선택: 마법 신문

  // 이력서 및 카드용 커스텀 입력값
  const [customName, setCustomName] = useState('김민경');
  const [customHeadline, setCustomHeadline] = useState('커넥트 AI 연구원, 1급 대마법사로 공식 임명되다!');
  const [customBio, setCustomBio] = useState('프롬프트 주문을 단 한 번만 외우는 것으로 복잡한 기업 코딩 프로젝트 전체를 자동으로 기획 및 구현하는 신기한 능력을 보유하고 있음.');
  const [customSkills, setCustomSkills] = useState('AI Vibe Coding, Python Spell, React Shield');
  
  // 마법 카드용 능력치 스탯
  const [stats, setStats] = useState({ hp: 99, mp: 85, spell: 95 });

  // 2. 시뮬레이션 제어 상태
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generationStep, setGenerationStep] = useState(0); // 0: 대기, 1-4 단계, 5: 완료
  const [gpuLogs, setGpuLogs] = useState([]);
  const [resultImage, setResultImage] = useState(null);

  // 3. 3D 마우스를 통한 기울기(Parallax Tilt) 효과 상태
  const [tiltStyle, setTiltStyle] = useState({});
  const cardRef = useRef(null);

  // 4. 이메일 공유 모달 상태
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [targetEmail, setTargetEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  // 스타일 리스트 (비즈니스와 마법 테마 통합)
  const styles = [
    { id: 'wizard_news', name: '📰 마법사 일보 (Daily Prophet)', desc: '해리포터풍 움직이는 마법 신문 이력서 (세피아 필터 & 숨쉬기 루프 & 반짝이)' },
    { id: 'magic_card', name: '🪄 마법 카드 (아동/교육용)', desc: '나만의 캐릭터 스탯이 부여된 입체 발광 마법 교육/게임 카드' },
    { id: 'suit', name: '💼 비즈니스 정장 (LinkedIn)', desc: '단정한 정장 합성으로 신뢰감을 주는 프로필 전용 헤드샷 화보' },
    { id: 'cyberpunk', name: '🛸 사이버펑크 히어로', desc: '네온 조명과 미래 도시 배경의 SF 전사 화보' },
    { id: 'anime', name: '🎨 3D 캐릭터 (Pixar)', desc: '사랑스러운 3D 입체 애니메이션 스타일 프로필' }
  ];

  // 업로드 파일 시뮬레이션
  const handlePhotoUpload = () => {
    setUploadedPhotos([
      'raw_selfie_normal.jpg',
      'raw_selfie_light.jpg',
      'raw_selfie_side.jpg'
    ]);
  };

  const clearPhotos = () => {
    setUploadedPhotos([]);
    setResultImage(null);
    setGenerationStep(0);
  };

  // AI 화보 생성 시작
  const startAiGeneration = () => {
    if (uploadedPhotos.length === 0) {
      alert("대표님! 학습용 셀카 사진들을 먼저 업로드(클릭)해 주십시오.");
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setGenerationStep(1);
    setGpuLogs(['[SYSTEM] Cloud GPU Cluster initialized...']);
    setResultImage(null);
  };

  // 진행도 상승 효과
  useEffect(() => {
    if (!isGenerating) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1.5;
        if (next >= 100) {
          clearInterval(timer);
          setIsGenerating(false);
          setGenerationStep(5);
          
          // 결과 이미지 바인딩
          if (selectedGender === 'male') {
            if (selectedStyle === 'wizard_news' || selectedStyle === 'magic_card') setResultImage(maleWizard);
            else if (selectedStyle === 'suit') setResultImage(maleSuit);
            else if (selectedStyle === 'cyberpunk') setResultImage(maleCyberpunk);
            else setResultImage(maleAnime);
          } else {
            if (selectedStyle === 'wizard_news' || selectedStyle === 'magic_card') setResultImage(femaleWizard);
            else if (selectedStyle === 'suit') setResultImage(femaleSuit);
            else if (selectedStyle === 'cyberpunk') setResultImage(femaleCyberpunk);
            else setResultImage(femaleAnime);
          }
          return 100;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isGenerating, selectedGender, selectedStyle]);

  // 진행 단계별 가상 GPU 로그
  useEffect(() => {
    if (!isGenerating) return;

    if (progress > 0 && progress < 25) {
      setGenerationStep(1);
      if (gpuLogs.length === 1) {
        setGpuLogs(prev => [
          ...prev,
          '[INFO] Uploading 3 source photos to cloud storage...',
          '[INFO] Checksum verified. Original face features extracted.'
        ]);
      }
    } else if (progress >= 25 && progress < 55) {
      setGenerationStep(2);
      if (gpuLogs.length <= 3) {
        setGpuLogs(prev => [
          ...prev,
          '[INFO] Spawning NVIDIA A100 GPU compute nodes...',
          `[TRAIN] Training LoRA persona [Custom_${selectedGender}_${customName}]...`,
          '[TRAIN] Epoch 1/5: loss=0.158 - speed=14it/s',
          '[TRAIN] Epoch 3/5: loss=0.082 - speed=14it/s',
          '[TRAIN] Epoch 5/5: loss=0.029 (Model fully trained!)'
        ]);
      }
    } else if (progress >= 55 && progress < 80) {
      setGenerationStep(3);
      if (gpuLogs.length <= 8) {
        setGpuLogs(prev => [
          ...prev,
          `[RENDER] Initiating Stable Diffusion pipeline with style [${selectedStyle}]...`,
          '[RENDER] Sampling step 20/40 - DDIM Solver...',
          '[RENDER] Swapping clothes & background dynamically...',
          '[RENDER] Latent output generated successfully.'
        ]);
      }
    } else if (progress >= 80 && progress < 100) {
      setGenerationStep(4);
      if (gpuLogs.length <= 12) {
        setGpuLogs(prev => [
          ...prev,
          '[POST] Running GFPGAN face restoration pipeline...',
          '[POST] Injecting 3D depth map for cinemagraph loop...',
          '[POST] Upscaling image to 2048x2048 using RealESRGAN-x4...',
          '[SYSTEM] Compiling final animated SVG/HTML card...'
        ]);
      }
    }
  }, [progress, isGenerating, selectedGender, selectedStyle]);

  // 3D Parallax Tilt 및 입체 Holographic 빛 반사 핸들러
  const handleMouseMove = (e) => {
    if (!cardRef.current || isGenerating) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // 마우스 X좌표
    const y = e.clientY - rect.top;  // 마우스 Y좌표
    
    // 중간을 기준으로 각도 계산
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const rotateY = ((x - xc) / xc) * 12; // 최대 12도 회전
    const rotateX = -((y - yc) / yc) * 12; // 최대 12도 회전

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

  // 이메일 전송 시뮬레이션
  const handleSendEmail = (e) => {
    e.preventDefault();
    if (!targetEmail) return;
    setEmailSent(true);
    setTimeout(() => {
      setShowEmailModal(false);
      setEmailSent(false);
      setTargetEmail('');
      alert(`🎉 대표님! 완성된 [움직이는 ${selectedStyle === 'wizard_news' ? '마법 신문' : '마법 카드'}]이 ${targetEmail}로 무사히 발송되었습니다! (의상과 얼굴 합성, 눈부신 움직임이 수신자의 폰 화면에서 완벽하게 표시됩니다.)`);
    }, 1500);
  };

  return (
    <div className="avatar-studio-container">
      {/* 🪄 해리포터풍 살아 움직이는 초상화 SVG 모핑 필터 (안정적인 최적화 버전) */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <defs>
          <filter id="magic-portrait-warp">
            <feTurbulence type="fractalNoise" baseFrequency="0.015 0.025" numOctaves="3" result="noise">
              <animate attributeName="baseFrequency" values="0.015 0.025; 0.02 0.035; 0.015 0.025" dur="6s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="14" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      {/* 🚀 상단 히어로 */}
      <header className="studio-hero-section">
        <div className="studio-badge-row">🪄 Magic & Profile Studio • Prototype</div>
        <h1 className="studio-title-main">
          AI 아바타 & <span className="highlight-purple">움직이는 마법 이력서</span> 스튜디오
        </h1>
        <p className="studio-sub-main">
          대표님! 평범한 스마트폰 셀카 한 장으로 의상을 근사하게 바꾸고, **해리포터 신문처럼 살아 움직이는 프로필**을 만드는 체험관입니다. 이메일로 보내면 수신자 폰에서 옷과 움직임이 그대로 나타납니다.
        </p>
      </header>

      <div className="studio-grid-layout">
        {/* ⚙️ 왼쪽: 셋업 및 입력창 */}
        <div className="studio-control-card">
          
          {/* 1단계: 모델 성별 */}
          <div className="control-step-group">
            <h4 className="step-title">👤 1단계: 모델 캐릭터 선택</h4>
            <div className="gender-toggle-bar">
              <button 
                className={`gender-btn ${selectedGender === 'female' ? 'active' : ''}`}
                onClick={() => { setSelectedGender('female'); if (customName === '김지훈') setCustomName('김민경'); }}
                disabled={isGenerating}
              >
                <img src={femaleOriginal} alt="여성" className="btn-avatar-thumb" />
                <div>
                  <strong>김민경 (여)</strong>
                  <span className="small-label" style={{ margin: 0 }}>일반 스마트폰 셀카</span>
                </div>
              </button>
              <button 
                className={`gender-btn ${selectedGender === 'male' ? 'active' : ''}`}
                onClick={() => { setSelectedGender('male'); if (customName === '김민경') setCustomName('김지훈'); }}
                disabled={isGenerating}
              >
                <img src={maleOriginal} alt="남성" className="btn-avatar-thumb" />
                <div>
                  <strong>김지훈 (남)</strong>
                  <span className="small-label" style={{ margin: 0 }}>일반 스마트폰 셀카</span>
                </div>
              </button>
            </div>
          </div>

          {/* 2단계: 스타일 테마 선택 */}
          <div className="control-step-group">
            <h4 className="step-title">🎨 2단계: 화보 테마 및 연출 스타일 선택</h4>
            <div className="style-card-grid-vertical">
              {styles.map((style) => (
                <button
                  key={style.id}
                  className={`style-card-row ${selectedStyle === style.id ? 'active' : ''}`}
                  onClick={() => { setSelectedStyle(style.id); setResultImage(null); }}
                  disabled={isGenerating}
                >
                  <div className="style-meta-row">
                    <span className="style-bullet"></span>
                    <strong>{style.name}</strong>
                  </div>
                  <span className="style-desc">{style.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3단계: 마법 이력서 텍스트 세부 커스텀 */}
          {(selectedStyle === 'wizard_news' || selectedStyle === 'magic_card') && (
            <div className="control-step-group info-custom-panel animate-fade-in">
              <h4 className="step-title">✍️ 3단계: 마법 신문 / 카드 문구 커스텀</h4>
              <div className="input-grid-studio">
                <div>
                  <span className="small-label">이름</span>
                  <input 
                    type="text" 
                    className="theme-input-studio" 
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    disabled={isGenerating}
                  />
                </div>
                <div>
                  <span className="small-label">스택 / 특기 주문</span>
                  <input 
                    type="text" 
                    className="theme-input-studio" 
                    value={customSkills}
                    onChange={(e) => setCustomSkills(e.target.value)}
                    placeholder="쉼표로 구분"
                    disabled={isGenerating}
                  />
                </div>
              </div>

              {selectedStyle === 'wizard_news' && (
                <div style={{ marginTop: '10px' }}>
                  <span className="small-label">신문 1면 메인 헤드라인</span>
                  <input 
                    type="text" 
                    className="theme-input-studio" 
                    value={customHeadline}
                    onChange={(e) => setCustomHeadline(e.target.value)}
                    disabled={isGenerating}
                  />
                </div>
              )}

              {selectedStyle === 'magic_card' && (
                <div className="stats-slider-grid" style={{ marginTop: '10px' }}>
                  <div>
                    <span className="small-label">주문력 (SPELL): {stats.spell}</span>
                    <input 
                      type="range" min="10" max="100" 
                      value={stats.spell} 
                      onChange={(e) => setStats({ ...stats, spell: parseInt(e.target.value) })}
                      disabled={isGenerating}
                    />
                  </div>
                  <div>
                    <span className="small-label">마나통 (MP): {stats.mp}</span>
                    <input 
                      type="range" min="10" max="100" 
                      value={stats.mp} 
                      onChange={(e) => setStats({ ...stats, mp: parseInt(e.target.value) })}
                      disabled={isGenerating}
                    />
                  </div>
                </div>
              )}

              <div style={{ marginTop: '10px' }}>
                <span className="small-label">한 줄 소감 / 마법서 생물 묘사</span>
                <textarea 
                  className="theme-textarea-studio" 
                  value={customBio}
                  onChange={(e) => setCustomBio(e.target.value)}
                  rows={2}
                  disabled={isGenerating}
                />
              </div>
            </div>
          )}

          {/* 4단계: 업로드 시뮬레이션 */}
          <div className="control-step-group">
            <h4 className="step-title">
              {selectedStyle === 'wizard_news' || selectedStyle === 'magic_card' ? '📸 4단계: 학습용 셀카 준비' : '📸 3단계: 학습용 셀카 준비'}
            </h4>
            {uploadedPhotos.length === 0 ? (
              <div className="upload-dropzone-studio" onClick={handlePhotoUpload}>
                <Upload size={24} className="upload-icon-studio" />
                <h5>스마트폰 앨범에서 내 사진 올리기</h5>
                <p>일상복 차림의 정면 셀카 3장이 자동 가상 업로드됩니다.</p>
              </div>
            ) : (
              <div className="uploaded-photos-studio">
                <div className="uploaded-header-studio">
                  <span>📸 얼굴 특징 추출용 사진 3장 등록됨</span>
                  <button className="btn-clear-studio" onClick={clearPhotos} disabled={isGenerating}>리셋</button>
                </div>
                <div className="thumbs-row-studio">
                  <div className="thumb-studio active-border">
                    <img src={selectedGender === 'male' ? maleOriginal : femaleOriginal} alt="원본" />
                    <span className="thumb-tag">기준 얼굴</span>
                  </div>
                  <div className="thumb-studio placeholder"><span>각도 L</span></div>
                  <div className="thumb-studio placeholder"><span>각도 R</span></div>
                </div>
              </div>
            )}
          </div>

          {/* 생성하기 가동 버튼 */}
          <button
            className={`btn-trigger-studio ${isGenerating ? 'generating' : ''}`}
            onClick={startAiGeneration}
            disabled={isGenerating || uploadedPhotos.length === 0}
          >
            {isGenerating ? (
              <>
                <Loader2 className="spinner animate-spin" size={18} />
                <span>마법 렌더 서버 가동 중 ({Math.floor(progress)}%)</span>
              </>
            ) : (
              <>
                <Wand2 size={18} />
                <span>🪄 마법 아바타 & 이력서 구워내기</span>
              </>
            )}
          </button>

        </div>

        {/* 🖥️ 오른쪽: 실물 렌더 및 모니터 */}
        <div className="studio-monitor-card">
          
          {/* 가상 GPU 모니터 터미널 */}
          {isGenerating && (
            <div className="gpu-monitor-screen">
              <div className="monitor-header">
                <Zap size={14} className="text-purple animate-pulse" />
                <span>NVIDIA A100 HIGH-PERFORMANCE RENDERING BLOCK</span>
              </div>
              <div className="progress-track">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="monitor-logs">
                {gpuLogs.map((log, idx) => (
                  <div key={idx} className="log-line">{log}</div>
                ))}
              </div>
            </div>
          )}

          {/* 대기 상태 */}
          {!isGenerating && !resultImage && (
            <div className="empty-studio-state">
              <div className="empty-studio-icon">📰</div>
              <h4>마법 아바타 렌더러 대기 중</h4>
              <p>왼쪽에서 모델과 원하는 마법 테마를 설정하고 셀카 사진을 학습시킨 후 가동하시면, 완성된 결과물이 여기에 렌더링됩니다, 대표님!</p>
            </div>
          )}

          {/* 최종 결과물 액자 렌더링 (마우스를 올리면 3D로 흔들림) */}
          {resultImage && !isGenerating && (
            <div className="result-outer-container animate-fade-in">
              
              {/* 상단 툴바 */}
              <div className="result-toolbar">
                <div className="badge-wizard-success">
                  <Sparkles size={12} />
                  <span>마법 완성</span>
                </div>
                <div className="result-actions-group">
                  <button className="btn-toolbar-action" onClick={() => setShowEmailModal(true)} title="이메일로 이력서 보내기">
                    <Send size={14} />
                    <span>이메일 전송</span>
                  </button>
                  <a href={resultImage} download={`magical_${selectedStyle}.png`} className="btn-toolbar-action icon-only" title="다운로드">
                    <Download size={14} />
                  </a>
                  <button className="btn-toolbar-action icon-only" onClick={() => alert('공유용 URL 링크가 생성되어 클립보드에 저장되었습니다!')} title="링크 복사">
                    <Share2 size={14} />
                  </button>
                </div>
              </div>

              {/* 3D 기울기 캔버스 구역 */}
              <div 
                className="parallax-canvas"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                ref={cardRef}
                style={tiltStyle}
              >
                {/* 테마 분기 렌더링 1: 해리포터 마법 신문 */}
                {selectedStyle === 'wizard_news' && (
                  <div className="daily-prophet-newspaper">
                    <div className="card-holo-overlay"></div>
                    <div className="newspaper-header">
                      <div className="newspaper-meta-top">마법력 대폭발 특별 한정판 • VOL. 99</div>
                      <h1 className="newspaper-title">THE DAILY WIZARD</h1>
                      <div className="newspaper-meta-bottom">
                        <span>날짜: 2026.06.23</span>
                        <span>가격: 5 크넛</span>
                        <span>발행처: 커넥트 마법 협회</span>
                      </div>
                    </div>

                    <div className="newspaper-wanted-headline">
                      WANTED: EXTRAORDINARY WIZARD
                    </div>

                    {/* 살아 움직이는 사진 프레임 */}
                    <div className="magic-photo-frame">
                      <div className="magic-photo-glow-border">
                        <img 
                          src={resultImage} 
                          alt="움직이는 마법 인물" 
                          className="moving-magic-avatar sepia-effect" 
                        />
                        {/* 반짝이 파티클 오버레이 */}
                        <div className="sparkle-particles-layer">
                          <span className="p1">★</span>
                          <span className="p2">✦</span>
                          <span className="p3">✨</span>
                          <span className="p4">✦</span>
                          <span className="p5">★</span>
                        </div>
                      </div>
                      <div className="frame-bottom-label">{customName} (1급 대마법사 수석 임명)</div>
                    </div>

                    <div className="newspaper-content-body">
                      <h3>🗞️ [독점 보도] "{customHeadline}"</h3>
                      <p className="news-lead-para">{customBio}</p>
                      <div className="news-skill-badge-row">
                        {customSkills.split(',').map((skill, sIdx) => (
                          <span key={sIdx} className="news-skill-tag">🔮 {skill.trim()}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 테마 분기 렌더링 2: 아동용 마법 카드 */}
                {selectedStyle === 'magic_card' && (
                  <div className="kids-magic-trading-card">
                    <div className="card-holo-overlay"></div>
                    <div className="card-outer-frame">
                      <div className="card-top-name-row">
                        <span className="card-element-badge">⚡ 마법</span>
                        <h2 className="card-character-name">{customName}</h2>
                        <span className="card-level-stars">★★★★★</span>
                      </div>

                      {/* 움직이는 카드 이미지 구역 */}
                      <div className="card-image-box">
                        <img 
                          src={resultImage} 
                          alt="마법 카드 캐릭터" 
                          className="moving-magic-avatar glow-effect" 
                        />
                        <div className="magic-particles-colorful">
                          <span className="cp1">✦</span>
                          <span className="cp2">✦</span>
                          <span className="cp3">✦</span>
                        </div>
                      </div>

                      {/* 능력치 등급 및 스탯 정보 */}
                      <div className="card-stats-body">
                        <div className="card-skills-list">
                          <strong>🪄 장착 스펠:</strong> {customSkills}
                        </div>
                        <p className="card-flavor-text">"{customBio}"</p>
                        
                        <div className="card-attributes-grid">
                          <div className="attr-item">
                            <span className="attr-label">HP</span>
                            <span className="attr-val" style={{ color: '#ef4444' }}>{stats.hp}</span>
                          </div>
                          <div className="attr-item">
                            <span className="attr-label">MP</span>
                            <span className="attr-val" style={{ color: '#3b82f6' }}>{stats.mp}</span>
                          </div>
                          <div className="attr-item">
                            <span className="attr-label">SPELL</span>
                            <span className="attr-val" style={{ color: '#eab308' }}>{stats.spell}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 테마 분기 렌더링 3: 일반 비즈니스 정장 / 사이버펑크 / 애니메이션 */}
                {(selectedStyle !== 'wizard_news' && selectedStyle !== 'magic_card') && (
                  <div className="standard-photo-frame-output">
                    <div className="card-holo-overlay"></div>
                    <div className="frame-glow-border-standard">
                      <img src={resultImage} alt="완성된 화보" className="main-standard-img" />
                    </div>
                    <div className="standard-details-footer">
                      <h4>{customName}</h4>
                      <p>{styles.find(s => s.id === selectedStyle)?.name}</p>
                    </div>
                  </div>
                )}

              </div>

              {/* 엑싯 및 비즈니스 포인트 해설 카드 */}
              <div className="exit-model-box-studio">
                <h5>💡 대표님을 위한 비즈니스 수익 모델(SaaS) 브리핑</h5>
                {selectedStyle === 'wizard_news' && (
                  <p>
                    <strong>"의상과 각도를 맞출 필요가 없는 마법 이력서"</strong>: 스마트폰으로 대충 찍은 평복 사진도 고급 양복이나 테마 의상으로 보정하고 부드러운 눈빛의 시네마비디오로 만들어 주는 인디 엑싯 모델입니다. 채용 플랫폼 및 명함 관리 서비스에 모듈로 탑재되어 유료 구독료를 수취하기에 매우 적합합니다.
                  </p>
                )}
                {selectedStyle === 'magic_card' && (
                  <p>
                    <strong>"아이들의 성장을 기록하는 마법 캐릭터 도감"</strong>: 아동 교육 분야나 학습지와 연동하여, 아이들이 공부방 미션을 완료할 때마다 내 사진이 합성된 레어 마법 카드를 발급해 주는 서비스 모델입니다. 수집욕을 극대화하여 학부모들의 장기 결제를 유도할 수 있습니다.
                  </p>
                )}
                {(selectedStyle !== 'wizard_news' && selectedStyle !== 'magic_card') && (
                  <p>
                    <strong>"건당 2만 원 결제의 AI 프로필 스튜디오"</strong>: Pieter Levels처럼 가상의 LoRA 학습 모델을 통해 건당 정기 화보 세트를 제공하는 전형적인 캐시카우 비즈니스입니다.
                  </p>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ✉️ 이메일 발송 팝업 모달 */}
      {showEmailModal && (
        <div className="email-modal-overlay">
          <div className="email-modal-card">
            <h4>✉️ 마법 이력서 이메일 전송</h4>
            <p className="email-desc">이 마법 신문/카드는 수신자의 이메일 본문에서 의상 합성 및 부드러운 움직임 효과가 고스란히 담겨 전송됩니다.</p>
            <form onSubmit={handleSendEmail}>
              <input 
                type="email" 
                required 
                className="email-input-field"
                placeholder="수신자의 이메일 주소를 입력해 주십시오."
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                disabled={emailSent}
              />
              <div className="email-modal-actions">
                <button type="button" className="btn-email-cancel" onClick={() => setShowEmailModal(false)} disabled={emailSent}>취소</button>
                <button type="submit" className="btn-email-submit" disabled={emailSent || !targetEmail}>
                  {emailSent ? (
                    <>
                      <Loader2 className="spinner animate-spin" size={14} />
                      <span>보내는 중...</span>
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>마법 전송</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default AvatarStudio;
