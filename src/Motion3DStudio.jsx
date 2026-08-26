import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { 
  Play, Pause, RotateCcw, Upload, Volume2, VolumeX, 
  Sparkles, Layers, Eye, FastForward, Film, Maximize2, Info
} from 'lucide-react';
import './Motion3DStudio.css';

// 🔊 Web Audio API를 활용한 실시간 효과음 생성기 (외부 파일 없이 즉시 재생)
const playProceduralSound = (type) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    if (type === 'golf_hit') {
      // ⛳️ 경쾌하고 맑은 골프 드라이버 '깡!' 타격음
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.8, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);

      // 화이트 노이즈로 바람 가르는 소리 (스윙 휙!)
      const bufferSize = ctx.sampleRate * 0.1;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.3, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      whiteNoise.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      whiteNoise.start();
    } else if (type === 'punch') {
      // 🥊 묵직한 펀치 타격음
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.9, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'cheer') {
      // 👏 나이스 샷 환호 비프음
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const startTime = ctx.currentTime + index * 0.08;
        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
    } else if (type === 'dance_beat') {
      // 🕺 펑키한 댄스 킥비트
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.7, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    }
  } catch (e) {
    console.warn('Audio play error:', e);
  }
};

export default function Motion3DStudio() {
  const mountRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentFileName, setCurrentFileName] = useState('');
  const [hasCustomModel, setHasCustomModel] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentTheme, setCurrentTheme] = useState('golf'); // 'golf', 'stage', 'darksea', 'studio'
  const [isVerticalMode, setIsVerticalMode] = useState(false);
  const [modelInfo, setModelInfo] = useState({ bones: 0, meshes: 0, duration: 0 });

  // Three.js 인스턴스 보관용 refs
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const mixerRef = useRef(null);
  const actionRef = useRef(null);
  const currentModelRef = useRef(null);
  const controlsRef = useRef(null);
  const dummyModelRef = useRef(null);
  const gridHelperRef = useRef(null);

  // 1. Three.js 기본 씬 셋업
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 500;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    updateSceneBackground(scene, currentTheme);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 120, 260);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.1; // 바닥 밑으로는 너무 내려가지 않게
    controls.target.set(0, 80, 0);
    controlsRef.current = controls;

    // Lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
    hemiLight.position.set(0, 200, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(100, 200, 100);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    // Grid Floor
    const grid = new THREE.GridHelper(400, 40, 0x3b82f6, 0x1e293b);
    grid.position.y = 0;
    scene.add(grid);
    gridHelperRef.current = grid;

    // 기본 시뮬레이션용 더미 캐릭터 생성
    createProceduralDummyCharacter(scene);

    // Animation Loop
    const clock = new THREE.Clock();
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (mixerRef.current) {
        mixerRef.current.update(delta * playbackSpeed);
      }

      // 더미 모델 자체 애니메이션 (FBX 미업로드 시)
      if (dummyModelRef.current && !currentModelRef.current) {
        animateDummy(dummyModelRef.current, clock.getElapsedTime(), currentTheme);
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, []);

  // 배경 테마 업데이트
  const updateSceneBackground = (scene, theme) => {
    if (!scene) return;
    if (theme === 'golf') {
      scene.background = new THREE.Color(0x064e3b); // 싱그러운 골프장 딥그린
      scene.fog = new THREE.FogExp2(0x064e3b, 0.002);
    } else if (theme === 'stage') {
      scene.background = new THREE.Color(0x18181b); // 힙한 무대 다크
      scene.fog = new THREE.FogExp2(0x18181b, 0.003);
    } else if (theme === 'darksea') {
      scene.background = new THREE.Color(0x020617); // 깊은 심해 네이비
      scene.fog = new THREE.FogExp2(0x020617, 0.004);
    } else {
      scene.background = new THREE.Color(0x0f172a); // 스튜디오
      scene.fog = new THREE.FogExp2(0x0f172a, 0.002);
    }
  };

  useEffect(() => {
    if (sceneRef.current) {
      updateSceneBackground(sceneRef.current, currentTheme);
    }
  }, [currentTheme]);

  // 절차적 3D 더미 캐릭터 생성 (FBX 없을 때 미리보기용)
  const createProceduralDummyCharacter = (scene) => {
    const dummyGroup = new THREE.Group();
    dummyGroup.name = 'dummy_character';

    const skinMat = new THREE.MeshStandardMaterial({ 
      color: 0xf43f5e, 
      roughness: 0.3, 
      metalness: 0.2 
    });
    const jointMat = new THREE.MeshStandardMaterial({ 
      color: 0x1e1b4b, 
      roughness: 0.5 
    });

    // 머리
    const head = new THREE.Mesh(new THREE.SphereGeometry(10, 24, 24), skinMat);
    head.position.y = 110;
    head.castShadow = true;
    dummyGroup.add(head);

    // 몸통
    const body = new THREE.Mesh(new THREE.CylinderGeometry(8, 12, 35, 16), skinMat);
    body.position.y = 78;
    body.castShadow = true;
    dummyGroup.add(body);

    // 골반
    const pelvis = new THREE.Mesh(new THREE.SphereGeometry(11, 16, 16), jointMat);
    pelvis.position.y = 56;
    dummyGroup.add(pelvis);

    // 왼팔/오른팔
    const armL = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 28), skinMat);
    armL.position.set(-16, 82, 0);
    armL.rotation.z = Math.PI / 8;
    dummyGroup.add(armL);

    const armR = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 28), skinMat);
    armR.position.set(16, 82, 0);
    armR.rotation.z = -Math.PI / 8;
    dummyGroup.add(armR);

    // 왼다리/오른다리
    const legL = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 3.5, 42), skinMat);
    legL.position.set(-10, 26, 0);
    dummyGroup.add(legL);

    const legR = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 3.5, 42), skinMat);
    legR.position.set(10, 26, 0);
    dummyGroup.add(legR);

    // 골프채 소품
    const clubMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.1 });
    const club = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 55), clubMat);
    club.position.set(22, 60, 10);
    club.rotation.z = -Math.PI / 4;
    club.name = 'golf_club';
    dummyGroup.add(club);

    scene.add(dummyGroup);
    dummyModelRef.current = dummyGroup;
  };

  // 더미 모델 모션 애니메이션
  const animateDummy = (dummy, time, theme) => {
    if (theme === 'golf') {
      // 골프 스윙 흔들림
      const swingAngle = Math.sin(time * 3 * playbackSpeed) * 0.4;
      dummy.rotation.y = swingAngle;
      const head = dummy.children[0];
      if (head) head.rotation.y = -swingAngle * 0.5;
    } else if (theme === 'stage') {
      // 스릴러 댄스 바운스
      dummy.position.y = Math.abs(Math.sin(time * 5 * playbackSpeed)) * 10;
      dummy.rotation.y = Math.sin(time * 2.5) * 0.3;
    } else {
      // 숨쉬기 및 비틀거리기
      dummy.position.y = Math.sin(time * 2) * 3;
      dummy.rotation.z = Math.sin(time * 1.5) * 0.1;
    }
  };

  // 2. FBX 파일 로드 핸들러 (대표님이 다운받으신 Golf Drive.fbx 등)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCurrentFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      const contents = event.target.result;
      const loader = new FBXLoader();

      try {
        const object = loader.parse(contents, '');

        if (sceneRef.current) {
          // 기존 더미나 이전 모델 제거
          if (dummyModelRef.current) {
            sceneRef.current.remove(dummyModelRef.current);
          }
          if (currentModelRef.current) {
            sceneRef.current.remove(currentModelRef.current);
          }

          // 모델 크기 및 중심점 자동 조정
          const box = new THREE.Box3().setFromObject(object);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());

          // 스케일 자동 정규화 (높이 약 120 단위로)
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = maxDim > 0 ? 120 / maxDim : 1;
          object.scale.setScalar(scale);

          // 바닥에 맞추기
          object.position.x = -center.x * scale;
          object.position.y = -box.min.y * scale;
          object.position.z = -center.z * scale;

          // 그림자 및 재질 활성화
          let meshCount = 0;
          let boneCount = 0;

          object.traverse((child) => {
            if (child.isMesh) {
              meshCount++;
              child.castShadow = true;
              child.receiveShadow = true;
              if (child.material) {
                child.material.side = THREE.DoubleSide;
              }
            }
            if (child.isBone) {
              boneCount++;
            }
          });

          sceneRef.current.add(object);
          currentModelRef.current = object;
          setHasCustomModel(true);

          // 애니메이션 클립 재생
          if (object.animations && object.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(object);
            mixerRef.current = mixer;
            const action = mixer.clipAction(object.animations[0]);
            action.play();
            actionRef.current = action;
            setIsPlaying(true);

            setModelInfo({
              bones: boneCount,
              meshes: meshCount,
              duration: object.animations[0].duration.toFixed(2)
            });

            // 효과음 재생
            if (soundEnabled) {
              playProceduralSound('cheer');
            }
          }
        }
      } catch (err) {
        console.error('FBX 로드 실패:', err);
        alert('FBX 파일을 파싱하는 데 실패했습니다. 올바른 믹사모 FBX 파일인지 확인해주세요!');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // 모션 재생/일시정지 토글
  const togglePlay = () => {
    if (actionRef.current) {
      if (isPlaying) {
        actionRef.current.paused = true;
      } else {
        actionRef.current.paused = false;
      }
      setIsPlaying(!isPlaying);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  // 카메라 리셋
  const resetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 120, 260);
      controlsRef.current.target.set(0, 80, 0);
      controlsRef.current.update();
    }
  };

  // 골프 나이스샷 타격 버튼
  const triggerNiceShot = () => {
    if (soundEnabled) {
      playProceduralSound('golf_hit');
      setTimeout(() => {
        playProceduralSound('cheer');
      }, 400);
    }
  };

  // 펀치 타격 버튼
  const triggerPunch = () => {
    if (soundEnabled) {
      playProceduralSound('punch');
    }
  };

  return (
    <div className="motion-studio-container">
      {/* 상단 헤더 */}
      <div className="studio-header">
        <div className="studio-title-area">
          <span className="studio-badge">🏌️‍♂️ 3D Motion Lab</span>
          <h2>3D 모션 & 인터랙티브 스튜디오</h2>
          <p className="studio-subtext">
            방금 믹사모(Mixamo)에서 다운받으신 <strong>Golf Drive.fbx</strong>를 화면에 끌어다 놓거나 열어보세요!
          </p>
        </div>

        {/* 파일 업로드 & 핵심 액션 버튼 */}
        <div className="studio-upload-actions">
          <label className="upload-fbx-btn">
            <Upload size={18} />
            <span>📂 다운받은 FBX 열기</span>
            <input 
              type="file" 
              accept=".fbx" 
              onChange={handleFileUpload} 
              style={{ display: 'none' }} 
            />
          </label>

          <button 
            className="sound-toggle-btn"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "소리 켜짐" : "소리 꺼짐"}
          >
            {soundEnabled ? <Volume2 size={18} color="#10b981" /> : <VolumeX size={18} color="#94a3b8" />}
          </button>
        </div>
      </div>

      {/* 메인 3D 뷰어 영역 */}
      <div className="studio-main-grid">
        <div className={`canvas-card ${isVerticalMode ? 'vertical-preview' : ''}`}>
          {/* 3D 캔버스 컨테이너 */}
          <div className="canvas-wrapper" ref={mountRef}></div>

          {/* 캔버스 위 오버레이 정보 배지 */}
          <div className="canvas-overlay-top">
            <div className="model-status-badge">
              {hasCustomModel ? (
                <span className="status-live">🟢 {currentFileName || '골프 드라이브 모션 로드됨'}</span>
              ) : (
                <span className="status-dummy">🟠 연습용 3D 프리뷰 (파일을 열어보세요!)</span>
              )}
            </div>

            <div className="camera-view-buttons">
              <button onClick={() => { cameraRef.current.position.set(0, 100, 240); controlsRef.current.target.set(0, 80, 0); }}>정면</button>
              <button onClick={() => { cameraRef.current.position.set(240, 100, 0); controlsRef.current.target.set(0, 80, 0); }}>측면</button>
              <button onClick={() => { cameraRef.current.position.set(0, 280, 50); controlsRef.current.target.set(0, 0, 0); }}>탑뷰</button>
              <button onClick={resetCamera} title="카메라 리셋"><RotateCcw size={14} /></button>
            </div>
          </div>

          {/* 숏폼 9:16 모드 토글 */}
          <button 
            className={`vertical-toggle-btn ${isVerticalMode ? 'active' : ''}`}
            onClick={() => setIsVerticalMode(!isVerticalMode)}
            title="쇼츠/릴스 세로 화면 모드"
          >
            <Film size={15} />
            <span>9:16 쇼츠 모드</span>
          </button>

          {/* 캔버스 하단 컨트롤 바 */}
          <div className="canvas-bottom-bar">
            <div className="playback-controls">
              <button className="play-btn" onClick={togglePlay}>
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                <span>{isPlaying ? '일시정지' : '재생'}</span>
              </button>

              <div className="speed-selector">
                <FastForward size={14} />
                <button className={playbackSpeed === 0.5 ? 'active' : ''} onClick={() => setPlaybackSpeed(0.5)}>0.5x</button>
                <button className={playbackSpeed === 1 ? 'active' : ''} onClick={() => setPlaybackSpeed(1)}>1.0x</button>
                <button className={playbackSpeed === 2 ? 'active' : ''} onClick={() => setPlaybackSpeed(2)}>2.0x ⚡️</button>
              </div>
            </div>

            {/* 실시간 찰진 사운드 인터랙션 버튼 */}
            <div className="interactive-sfx-bar">
              <button className="sfx-btn golf" onClick={triggerNiceShot}>
                ⛳️ 나이스 샷! (깡~)
              </button>
              <button className="sfx-btn punch" onClick={triggerPunch}>
                🥊 찰진 펀치! (퍽~)
              </button>
            </div>
          </div>
        </div>

        {/* 우측 컨트롤 패널 */}
        <div className="studio-sidebar">
          {/* 테마 배경 선택 */}
          <div className="sidebar-card">
            <h3>🎨 3D 스테이지 배경</h3>
            <div className="theme-grid">
              <button 
                className={`theme-btn ${currentTheme === 'golf' ? 'active' : ''}`}
                onClick={() => setCurrentTheme('golf')}
              >
                ⛳️ 필드 딥그린
              </button>
              <button 
                className={`theme-btn ${currentTheme === 'stage' ? 'active' : ''}`}
                onClick={() => setCurrentTheme('stage')}
              >
                🕺 네온 스테이지
              </button>
              <button 
                className={`theme-btn ${currentTheme === 'darksea' ? 'active' : ''}`}
                onClick={() => setCurrentTheme('darksea')}
              >
                🌊 심해 미스터리
              </button>
              <button 
                className={`theme-btn ${currentTheme === 'studio' ? 'active' : ''}`}
                onClick={() => setCurrentTheme('studio')}
              >
                🎥 3D 스튜디오
              </button>
            </div>
          </div>

          {/* 3D 모션 파일 정보 */}
          <div className="sidebar-card">
            <h3>📊 3D 모션 데이터 분석</h3>
            <div className="stat-rows">
              <div className="stat-item">
                <span className="label">관절(Bones) 수</span>
                <span className="val">{hasCustomModel ? `${modelInfo.bones}개` : '표준 65개'}</span>
              </div>
              <div className="stat-item">
                <span className="label">메시 파츠</span>
                <span className="val">{hasCustomModel ? `${modelInfo.meshes}개` : '12 파츠'}</span>
              </div>
              <div className="stat-item">
                <span className="label">애니메이션 길이</span>
                <span className="val">{hasCustomModel ? `${modelInfo.duration}초` : '3.4초 루프'}</span>
              </div>
            </div>
          </div>

          {/* 1인 기업 스케일업 가이드 */}
          <div className="sidebar-card tip-card">
            <div className="tip-header">
              <Sparkles size={16} color="#fbbf24" />
              <h4>코다리 부장의 실전 숏폼 레시피</h4>
            </div>
            <p className="tip-desc">
              1. <strong>[9:16 쇼츠 모드]</strong>를 켜고 마우스로 캐릭터 앵글을 멋지게 잡습니다.<br />
              2. <strong>[⛳️ 나이스 샷!]</strong> 버튼을 누르며 화면을 5초간 녹화합니다.<br />
              3. 쇼츠에 올리면 <strong>"AI로 만든 3D 골프 스윙"</strong> 영상 완성!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
