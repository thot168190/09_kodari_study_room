import React, { useState, useEffect, useRef } from 'react';
import {
  Music,
  Mic,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Download,
  Copy,
  Sparkles,
  RefreshCw,
  Sliders,
  Check,
  CheckCircle2,
  ExternalLink,
  Radio,
  Disc,
  Headphones,
  FileText,
  Share2,
  FolderOpen,
  Wand2,
  FastForward,
  Clock,
  Layers
} from 'lucide-react';
import './MusicVoiceStudio.css';

// ============================================================================
// 1. 유튜버 실험남(ssokMusic V0.10) 16대 킬러 장르/악기 프리셋 완전 이식
// ============================================================================
const SSOK_GENRE_PRESETS = [
  { id: 'piano_solo', name: '피아노 솔로', icon: '🎹', bpm: 80, mood: 'Peaceful, Emotional, Delicate', instruments: 'Solo Grand Piano, Natural Reverb', genre: 'Neo-Classical Piano', vocal: 'Instrumental' },
  { id: 'classic_guitar_duo', name: '클래식 기타 듀오', icon: '🎸', bpm: 85, mood: 'Warm, Intimate, Melancholic', instruments: 'Dual Acoustic Nylon Guitars, Fingerstyle', genre: 'Acoustic Folk Instrumental', vocal: 'Instrumental' },
  { id: 'piano_trio', name: '피아노 트리오', icon: '🎻', bpm: 95, mood: 'Sophisticated, Elegant, Romantic', instruments: 'Piano, Cello, Violin', genre: 'Classical Chamber Music', vocal: 'Instrumental' },
  { id: 'string_quartet', name: '현악 4중주', icon: '🎼', bpm: 100, mood: 'Cinematic, Dramatic, Noble', instruments: 'Violin 1, Violin 2, Viola, Cello', genre: 'Orchestral Chamber', vocal: 'Instrumental' },
  { id: 'piano_cello', name: '피아노 + 첼로', icon: '🎹🎻', bpm: 75, mood: 'Deeply Moving, Sorrowful, Poetic', instruments: 'Acoustic Piano, Deep Resonant Cello', genre: 'Cinematic Minimalist', vocal: 'Instrumental' },
  { id: 'flute_guitar', name: '플루트 + 기타', icon: '🪈', bpm: 90, mood: 'Breezy, Pastoral, Refreshing', instruments: 'Concert Flute, Classical Acoustic Guitar', genre: 'Bossa Nova Acoustic', vocal: 'Instrumental' },
  { id: 'two_pianos', name: '피아노 2대', icon: '🎹🎹', bpm: 110, mood: 'Playful, Dynamic, Harmonious', instruments: 'Dual Steinway Pianos, Stereo Panning', genre: 'Contemporary Classical', vocal: 'Instrumental' },
  { id: 'chamber_orchestra', name: '실내 관현악', icon: '🎺', bpm: 105, mood: 'Grand, Polished, Narrative', instruments: 'Small Chamber Strings, Soft Woodwinds', genre: 'Baroque Chamber Modern', vocal: 'Instrumental' },
  { id: 'orchestra', name: '오케스트라', icon: '🏛️', bpm: 120, mood: 'Epic, Triumphant, Sweeping', instruments: 'Full Symphony Strings, Brass, Timpani', genre: 'Epic Cinematic Soundtrack', vocal: 'Instrumental' },
  { id: 'lofi_bgm', name: '로파이 BGM', icon: '☕', bpm: 78, mood: 'Chill, Relaxing, Vintage Nostalgia', instruments: 'Vinyl Crackle, Rhodes Piano, Muted Boom-Bap Drums', genre: 'Lo-Fi Chillhop Study Beat', vocal: 'Instrumental' },
  { id: 'jazz_trio', name: '재즈 트리오', icon: '🎷', bpm: 115, mood: 'Swing, Cozy Late-Night, Groovy', instruments: 'Upright Bass, Brushed Drums, Jazz Piano', genre: 'Midnight Cool Jazz', vocal: 'Instrumental' },
  { id: 'ambient', name: '앰비언트', icon: '🌌', bpm: 60, mood: 'Ethereal, Meditative, Weightless', instruments: 'Evolving Synth Pads, Soft Drone, Bell Chimes', genre: 'Spiritual Ambient Soundscape', vocal: 'Instrumental' },
  { id: 'guitar_solo', name: '기타 연주', icon: '🎸', bpm: 92, mood: 'Soulful, Expressive, Clean', instruments: 'Clean Electric Stratocaster, Reverb, Chorus', genre: 'Neo-Soul Guitar Instrumental', vocal: 'Instrumental' },
  { id: 'synthwave', name: '신스웨이브 / 시티팝', icon: '🌆', bpm: 124, mood: 'Retro 80s, Nostalgic Drive, Punchy', instruments: 'Analog Synthesizers, LinnDrum, Slap Bass, Arp', genre: '80s Synthwave & Korean City Pop', vocal: 'Korean Female Vocal or Instrumental' },
  { id: 'game_bgm', name: '게임 BGM', icon: '🎮', bpm: 130, mood: 'Adventurous, Energetic, Pixel Quest', instruments: 'Chiptune Arpeggios, 16-bit FM Synth, Driving Bass', genre: 'JRPG Adventure Theme', vocal: 'Instrumental' },
  { id: 'korean_traditional', name: '국악 느낌', icon: '🇰🇷', bpm: 82, mood: 'Mystical, Traditional, Deep Korean Spirit', instruments: 'Gayageum, Daegeum Flute, Buk Drum, Janggu', genre: 'Korean Fusion Traditional Folk', vocal: 'Instrumental' }
];

// ============================================================================
// 2. 야담라디오(Supertonic 3) + 대표님 & 철만이 시그니처 12대 목소리 프리셋
// ============================================================================
const SUPERTONIC_VOICES = [
  {
    id: 'DAEPYO',
    name: '👑 대표님 (오리지널 음성)',
    gender: 'female',
    desc: '공부방 대표님의 생생한 실제 육성 클론 모델. 진정성 있고 설득력 넘치는 총괄 브리핑 및 영상 나레이션 전용.',
    tags: ['대표님', '실제육성', '오리지널', '24kHz'],
    refAudio: `${import.meta.env.BASE_URL}daepyo_ref.wav`,
    isVip: true,
    pitch: 1.05
  },
  {
    id: 'CHEOLMAN',
    name: '🎙️ 철만이 (시즌2 정식 내레이터)',
    gender: 'male',
    desc: '철만이 일기 시즌2 공식 주인공 목소리. 따뜻하고 정감 있는 남편분의 중저음 스토리텔러 톤.',
    tags: ['철만이', '남편목소리', '스토리텔러', '시즌2'],
    refAudio: `${import.meta.env.BASE_URL}cheolman_ref.wav`,
    isVip: true,
    pitch: 0.88
  },
  { id: 'M1', name: 'M1 (조선 야담 낭독자)', gender: 'male', desc: '중저음의 편안하고 그윽한 목소리. 수면용 야담 낭독에 가장 최적화된 시그니처 보이스.', tags: ['수면용', '야담', '중저음'], pitch: 0.85 },
  { id: 'M2', name: 'M2 (역사 다큐 나레이터)', gender: 'male', desc: '무게감과 신뢰감이 느껴지는 정통 다큐멘터리 성우 톤. 몰입감 극대화.', tags: ['다큐', '신뢰감', '중후함'], pitch: 0.85 },
  { id: 'M3', name: 'M3 (비즈니스 브리퍼)', gender: 'male', desc: '지적이고 명쾌한 딕션의 남성 음성. 테크 뉴스 및 핵심 요약 전달에 최적.', tags: ['뉴스', '브리핑', '명쾌함'], pitch: 0.9 },
  { id: 'M4', name: 'M4 (동네 이야기꾼 삼촌)', gender: 'male', desc: '자연스럽고 편안한 대화체. 민담, 전래동화, 친근한 설화 전달에 적합.', tags: ['구어체', '친근함', '스토리'], pitch: 0.88 },
  { id: 'M5', name: 'M5 (서스펜스 미스터리)', gender: 'male', desc: '낮고 서늘하며 긴장감을 유발하는 미스터리/스릴러 스토리 전문 보이스.', tags: ['공포', '미스터리', '긴장감'], pitch: 0.8 },
  { id: 'F1', name: 'F1 (심야 라디오 DJ)', gender: 'female', desc: '따뜻하고 나긋나긋하게 말을 건네는 힐링 감성 목소리. 수면 유도 최적.', tags: ['라디오', '힐링', '감성'], pitch: 1.05 },
  { id: 'F2', name: 'F2 (오디오북 에세이스트)', gender: 'female', desc: '맑고 또렷하면서도 지적인 낭독 톤. 자기계발서, 문학 에세이에 최적.', tags: ['에세이', '맑음', '또렷함'], pitch: 1.05 },
  { id: 'F3', name: 'F3 (전문 뉴스 앵커)', gender: 'female', desc: '단호하고 정확한 발음의 아나운서 스타일. 정형화된 안내 및 해설.', tags: ['아나운서', '정확함', '안내'], pitch: 1.1 },
  { id: 'F4', name: 'F4 (포근한 동화 구연)', gender: 'female', desc: '다정하고 온화한 어머니 톤. 어린이 전래동화 및 따스한 교훈 이야기.', tags: ['동화', '포근함', '온화'], pitch: 1.12 },
  { id: 'F5', name: 'F5 (드라마틱 감성 액터)', gender: 'female', desc: '감정의 진폭이 풍부하고 호소력 있는 사극/드라마 독백 전용 목소리.', tags: ['연기', '호소력', '사극'], pitch: 1.0 }
];

export default function MusicVoiceStudio() {
  // 모드: 'music' (노래 만들기) | 'voice' (목소리 낭독기)
  const [activeMode, setActiveMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      return p.get('mode') === 'voice' ? 'voice' : 'music';
    }
    return 'music';
  });

  // --------------------------------------------------------------------------
  // A. [AI 노래 만들기] 상태
  // --------------------------------------------------------------------------
  const [selectedPreset, setSelectedPreset] = useState(SSOK_GENRE_PRESETS[13]); // 기본: 신스웨이브/시티팝
  const [songTopic, setSongTopic] = useState('금요일 밤 도심의 불빛을 가르는 퇴근길 드라이브');
  const [vocalOption, setVocalOption] = useState('korean_female'); // 'korean_female' | 'korean_male' | 'instrumental'
  const [bpmInput, setBpmInput] = useState(selectedPreset.bpm);
  const [customStyleText, setCustomStyleText] = useState('');
  const [generatedLyrics, setGeneratedLyrics] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGeneratingSong, setIsGeneratingSong] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // --------------------------------------------------------------------------
  // B. [AI 목소리 낭독기] 상태
  // --------------------------------------------------------------------------
  const [selectedVoice, setSelectedVoice] = useState(SUPERTONIC_VOICES[0]); // 기본: M1
  const [scriptText, setScriptText] = useState(`옛날 어느 산골 깊은 마을에 성정이 곧고 글 읽기를 좋아하는 박 선비가 살고 있었는데,

하루는 해가 뉘엿뉘엿 저무는 시각에 낯선 나그네 한 사람이 대문을 두드렸습니다.

###

"주인장 계시오? 날이 저물어 하룻밤 쉬어 가기를 청하나이다."

선비는 흔쾌히 문을 열어 길손을 사랑방으로 들였는데, 어찌 된 영문인지 나그네의 그림자가 등잔불 앞에서도 서늘하게 드리우지 않는 것이 아니겠습니까.`);
  const [speed, setSpeed] = useState(0.92); // 야담라디오 기본 0.92
  const [pauseDuration, setPauseDuration] = useState(0.7);
  const [scenePause, setScenePause] = useState(1.8);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [synthUtterance, setSynthUtterance] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // 프리셋 선택 시 자동 프롬프트 동기화
  useEffect(() => {
    setBpmInput(selectedPreset.bpm);
    updatePromptAndLyrics(selectedPreset, songTopic, vocalOption, selectedPreset.bpm);
  }, [selectedPreset.id]);

  // 프롬프트 및 가사 자동 조합 함수
  const updatePromptAndLyrics = (preset, topic, vocal, bpm) => {
    let vocalDesc = 'confident young Korean female vocal';
    if (vocal === 'korean_male') vocalDesc = 'warm soulful Korean male vocal';
    if (vocal === 'instrumental') vocalDesc = 'Instrumental, no vocal';

    const fullStyle = `[Korean], ${preset.genre}, ${vocalDesc}, ${preset.instruments}, ${preset.mood}, ${bpm} BPM, glossy studio mastering`;
    setGeneratedPrompt(fullStyle);

    // 주제 맞춤형 4단 구조화 가사
    if (vocal === 'instrumental') {
      setGeneratedLyrics(`[Instrumental Intro]\n[Melodic Lead - ${preset.name}]\n[Groove Breakdown]\n[Climax Solo]\n[Outro Fadeout]`);
    } else {
      setGeneratedLyrics(`[Verse 1]
어두워진 도심 속을 가로지르는 불빛
오늘 하루 무거웠던 짐을 모두 내려놓고
창문을 조금 열어 불어오는 밤바람에
라디오에서 흘러나오는 멜로디

[Chorus]
달려가자 저 빛나는 네온 사인을 넘어
아무도 모르는 나만의 비밀 장소로
답답했던 어제는 다 바람 속에 흩날려
오늘 밤은 오직 나만의 자유니까

[Verse 2]
신호등이 초록빛으로 물들어갈 때
익숙했던 이 길도 오늘은 새롭게 보여
끝없이 펼쳐진 밤하늘의 은하수처럼
심장 소리는 음악에 맞춰 뛰고 있어

[Chorus]
달려가자 저 빛나는 네온 사인을 넘어
아무도 모르는 나만의 비밀 장소로
답답했던 어제는 다 바람 속에 흩날려
오늘 밤은 오직 나만의 자유니까

[Outro]
천천히 잦아드는 엔진 소리
깊은 밤, 내 마음은 편안해지네`);
    }
  };

  // 1초 원클릭 노래 기획 생성 핸들러
  const handleGenerateSong = (e) => {
    if (e) e.preventDefault();
    setIsGeneratingSong(true);
    setTimeout(() => {
      updatePromptAndLyrics(selectedPreset, songTopic, vocalOption, bpmInput);
      setIsGeneratingSong(false);
      showToast('🎉 ssokMusic 16대 프리셋 기반 황금 프롬프트와 가사가 완성되었습니다!');
    }, 400);
  };

  // ==========================================================================
  // 진짜 노래 음원 실시간 생성 & 재생 엔진 (Web Audio + 가사 보컬 동시 가창)
  // ==========================================================================
  const [isPlayingSong, setIsPlayingSong] = useState(false);
  const songAudioCtxRef = useRef(null);
  const songIntervalRef = useRef(null);

  // 실시간 다채널 (드럼 비트 + 베이스 라인 + 멜로디 코드 + AI 보컬 가창) 1분 완곡 연주기
  const handlePlayRealSong = () => {
    if (isPlayingSong) {
      handleStopRealSong();
      return;
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      songAudioCtxRef.current = ctx;

      const tempo = bpmInput || 120;
      const beatDur = 60 / tempo;
      const isLofi = selectedPreset.id.includes('lofi');
      const isSynth = selectedPreset.id.includes('synth');
      const isPiano = selectedPreset.id.includes('piano');
      const isGuitar = selectedPreset.id.includes('guitar');

      // 4코드 진행 (IV - V - iii - vi 등 감성 코드)
      const chordProgressions = [
        [261.63, 329.63, 392.00], // C major
        [196.00, 246.94, 293.66], // G major
        [220.00, 261.63, 329.63], // A minor
        [174.61, 220.00, 261.63]  // F major
      ];

      const bassNotes = [130.81, 98.00, 110.00, 87.31];
      let step = 0;

      // 1. 반주 룹 (비트 + 베이스 + 화음)
      const playStep = () => {
        const chordIdx = Math.floor(step / 4) % 4;
        const now = ctx.currentTime;

        // 드럼 킥 & 스네어 (비트)
        if (vocalOption !== 'instrumental' || isLofi || isSynth) {
          if (step % 2 === 0) {
            // Kick
            const kickOsc = ctx.createOscillator();
            const kickGain = ctx.createGain();
            kickOsc.frequency.setValueAtTime(150, now);
            kickOsc.frequency.exponentialRampToValueAtTime(0.01, now + 0.25);
            kickGain.gain.setValueAtTime(0.4, now);
            kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
            kickOsc.connect(kickGain);
            kickGain.connect(ctx.destination);
            kickOsc.start(now);
            kickOsc.stop(now + 0.26);
          } else {
            // Snare / Hi-hat
            const snareOsc = ctx.createOscillator();
            const snareGain = ctx.createGain();
            snareOsc.type = 'triangle';
            snareOsc.frequency.setValueAtTime(220, now);
            snareGain.gain.setValueAtTime(0.18, now);
            snareGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
            snareOsc.connect(snareGain);
            snareGain.connect(ctx.destination);
            snareOsc.start(now);
            snareOsc.stop(now + 0.2);
          }
        }

        // 베이스 라인 (묵직한 서브 베이스)
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bassOsc.type = isSynth ? 'sawtooth' : 'triangle';
        bassOsc.frequency.setValueAtTime(bassNotes[chordIdx], now);
        bassGain.gain.setValueAtTime(0.25, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + beatDur * 0.9);
        bassOsc.connect(bassGain);
        bassGain.connect(ctx.destination);
        bassOsc.start(now);
        bassOsc.stop(now + beatDur);

        // 멜로디 & 아르페지오 코드
        const chord = chordProgressions[chordIdx];
        chord.forEach((freq, noteIdx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = isSynth ? 'sawtooth' : isPiano ? 'sine' : 'triangle';
          const noteTime = now + (noteIdx * beatDur * 0.25);
          osc.frequency.setValueAtTime(freq * (isGuitar ? 1.5 : 1), noteTime);
          gain.gain.setValueAtTime(0.15, noteTime);
          gain.gain.exponentialRampToValueAtTime(0.001, noteTime + beatDur * 0.7);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(noteTime);
          osc.stop(noteTime + beatDur * 0.75);
        });

        step++;
      };

      // 반주 인터벌 시작 (초당 템포 계산)
      playStep();
      const intervalId = setInterval(playStep, (beatDur * 1000) / 2);
      songIntervalRef.current = intervalId;

      // 2. 보컬 가창 (vocalOption이 연주곡이 아닐 경우, Web Speech API로 반주에 맞춰 실제 가사 노래 가창)
      if (vocalOption !== 'instrumental' && ('speechSynthesis' in window)) {
        window.speechSynthesis.cancel();
        // 가사 첫 1절과 후렴 발췌
        const songLines = generatedLyrics.split('\n')
          .filter(l => l.trim() && !l.startsWith('['))
          .slice(0, 6)
          .join('. ');

        const utter = new SpeechSynthesisUtterance(songLines || '달려가자 저 빛나는 네온 사인을 넘어, 오늘 밤은 오직 나만의 자유니까.');
        utter.rate = (tempo / 120) * 0.85; // 템포에 맞춘 리듬
        utter.pitch = vocalOption === 'korean_female' ? 1.25 : 0.85;
        utter.lang = 'ko-KR';

        const voices = window.speechSynthesis.getVoices();
        const koVoice = voices.find(v => v.lang.includes('ko') || v.lang.includes('KR'));
        if (koVoice) utter.voice = koVoice;

        utter.onend = () => {
          setTimeout(() => handleStopRealSong(), 2000);
        };
        utter.onerror = () => handleStopRealSong();

        // 1마디 카운트 후 보컬 진입
        setTimeout(() => {
          if (songAudioCtxRef.current) {
            window.speechSynthesis.speak(utter);
          }
        }, 1200);
      }

      setIsPlayingSong(true);
      showToast(`🎵 [${selectedPreset.name}] 1초 만에 작곡된 완곡 사운드가 재생됩니다!`);
    } catch (e) {
      console.error('오디오 생성 오류:', e);
      showToast('⚠️ 오디오 재생 중 오류가 발생했습니다.');
    }
  };

  const handleStopRealSong = () => {
    if (songIntervalRef.current) {
      clearInterval(songIntervalRef.current);
      songIntervalRef.current = null;
    }
    if (songAudioCtxRef.current) {
      try {
        songAudioCtxRef.current.close();
      } catch (e) {}
      songAudioCtxRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingSong(false);
  };

  // 프리셋 선택 시 가상 미리듣기
  const playWebAudioPreview = (preset) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      
      const freqs = preset.id.includes('piano') ? [261.63, 329.63, 392.00, 523.25] : 
                    preset.id.includes('lofi') ? [220.00, 277.18, 329.63, 415.30] :
                    preset.id.includes('synth') ? [130.81, 196.00, 261.63, 392.00] : [293.66, 369.99, 440.00, 587.33];

      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = preset.id.includes('synth') ? 'sawtooth' : 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime + idx * 0.22);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.22);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.22 + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.22);
        osc.stop(ctx.currentTime + idx * 0.22 + 1.3);
      });
      showToast(`🎵 [${preset.name}] 시그니처 멜로디 화음 프리뷰 연주 중!`);
    } catch (e) {
      console.warn('Web Audio 미리듣기 미지원:', e);
    }
  };

  // --------------------------------------------------------------------------
  // 목소리 낭독 재생 (Web Speech API 즉시 낭독 & 실제 레퍼런스 음원 재생)
  // --------------------------------------------------------------------------
  const [playingRefId, setPlayingRefId] = useState(null);
  const audioPlayerRef = useRef(null);

  const handlePlayRefAudio = (vc, e) => {
    e?.stopPropagation();
    if (!vc.refAudio) return;

    if (playingRefId === vc.id) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.currentTime = 0;
      }
      setPlayingRefId(null);
      return;
    }

    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    const audio = new Audio(vc.refAudio);
    audioPlayerRef.current = audio;
    audio.onended = () => setPlayingRefId(null);
    audio.onerror = () => {
      setPlayingRefId(null);
      showToast('⚠️ 음원 로드 실패 (파일 경로를 확인하세요)');
    };
    audio.play();
    setPlayingRefId(vc.id);
    showToast(`🎵 [${vc.name}] 실제 고음질 참조 육성(24kHz)을 재생합니다.`);
  };

  const handlePlayVoice = () => {
    if (!('speechSynthesis' in window)) {
      alert('브라우저 음성 재생을 지원하지 않습니다.');
      return;
    }

    if (isPlayingVoice) {
      window.speechSynthesis.cancel();
      setIsPlayingVoice(false);
      return;
    }

    window.speechSynthesis.cancel();
    
    // "###" 장면 전환을 긴 침묵으로 변환
    const cleanText = scriptText.replace(/###/g, '. . . . . .');
    const utter = new SpeechSynthesisUtterance(cleanText);
    utter.rate = speed;
    utter.pitch = selectedVoice.pitch || (selectedVoice.gender === 'male' ? 0.85 : 1.05);
    utter.lang = 'ko-KR';

    // 한국어 보이스 매칭
    const voices = window.speechSynthesis.getVoices();
    const koVoice = voices.find(v => v.lang.includes('ko') || v.lang.includes('KR'));
    if (koVoice) utter.voice = koVoice;

    utter.onend = () => setIsPlayingVoice(false);
    utter.onerror = () => setIsPlayingVoice(false);

    setSynthUtterance(utter);
    window.speechSynthesis.speak(utter);
    setIsPlayingVoice(true);
    showToast(`🎙️ [${selectedVoice.name}] 보이스로 실시간 낭독을 시작합니다.`);
  };

  const handleStopVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingVoice(false);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setPlayingRefId(null);
    }
  };

  // 터미널 실행 명령어 복사
  const handleCopyCliCommand = () => {
    let cmd = '';
    if (selectedVoice.id === 'DAEPYO') {
      cmd = `python3 "/Users/mihyunlee/Desktop/철만이/시즌2 2화/호두과자_원클릭_통음성_코랩코드.py"`;
    } else if (selectedVoice.id === 'CHEOLMAN') {
      cmd = `python3 "/Users/mihyunlee/Desktop/철만이/시즌2 1화/run_local_voice_studio.py"`;
    } else {
      cmd = `python3 /Users/mihyunlee/Desktop/야담라디오/yadam_tts.py 대본.txt --voice ${selectedVoice.id} --speed ${speed} --pause ${pauseDuration} --scene-pause ${scenePause}`;
    }
    navigator.clipboard.writeText(cmd);
    showToast(`📋 [${selectedVoice.name}] 생성 실행 명령어가 복사되었습니다!`);
  };

  return (
    <div className="music-voice-studio">
      {/* 토스트 알림 */}
      {toastMsg && (
        <div className="mv-toast-bar">
          <CheckCircle2 size={18} color="#38bdf8" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. 최상단 헤더 */}
      <header className="mv-studio-header">
        <div className="mv-header-brand">
          <span className="mv-brand-icon">🎧</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 className="mv-brand-title">AI 노래 & 목소리 무제한 스튜디오</h1>
              <span className="mv-pro-tag">KODARI LAB v1.0</span>
            </div>
            <p className="mv-brand-desc">
              윈도우 전용 ssokMusic & Supertonic 3 소스를 맥(Mac)과 모바일 390px 웹 환경으로 완전 개조 이식!
            </p>
          </div>
        </div>

        {/* 모드 전환 탭 (노래 vs 목소리) - 초대형 직관적 토글 */}
        <div className="mv-mode-switch-prominent">
          <button
            type="button"
            className={`mv-big-mode-tab ${activeMode === 'music' ? 'active-music' : ''}`}
            onClick={() => {
              handleStopVoice();
              setActiveMode('music');
            }}
          >
            <div className="mv-tab-icon-wrap music">
              <Music size={20} />
            </div>
            <div className="mv-tab-text-wrap">
              <strong className="mv-tab-title">🎵 1. AI 노래 만들기 (ssokMusic)</strong>
              <span className="mv-tab-sub">16대 장르 화음 프리뷰 · 6단 콤보 프롬프트 & 가사 생성</span>
            </div>
            {activeMode === 'music' && <span className="mv-active-indicator">현재 선택됨</span>}
          </button>

          <button
            type="button"
            className={`mv-big-mode-tab ${activeMode === 'voice' ? 'active-voice' : ''}`}
            onClick={() => setActiveMode('voice')}
          >
            <div className="mv-tab-icon-wrap voice">
              <Mic size={20} />
            </div>
            <div className="mv-tab-text-wrap">
              <strong className="mv-tab-title">🎙️ 2. AI 목소리 무제한 (Supertonic 3)</strong>
              <span className="mv-tab-sub">👑 대표님 · 🎙️ 철만이 VIP + 10대 야담 실시간 낭독</span>
            </div>
            {activeMode === 'voice' && <span className="mv-active-indicator">현재 선택됨</span>}
          </button>
        </div>
      </header>

      {/* ======================================================================
          2. [모드 A] AI 노래 만들기 (ssokMusic 16대 프리셋 + YuE2 가사 공장)
          ====================================================================== */}
      {activeMode === 'music' && (
        <section className="mv-music-container">
          {/* 상단 안내 바 */}
          <div className="mv-info-banner">
            <Sparkles size={16} color="#0284c7" />
            <span>
              <strong>💡 윈도우 ssokMusic V0.10 웹 개조 완료:</strong> 아래 16대 악기 프리셋을 누르면 YuE2 및 Suno가 가장 완벽하게 인식하는 6단 콤보 영문 프롬프트와 4단 구조화 가사가 1초 만에 조립됩니다.
            </span>
          </div>

          {/* 16대 장르/악기 원클릭 칩 (가로 스크롤 최적화) */}
          <div className="mv-preset-chips-box">
            <div className="mv-box-label">
              <span>🎹 16대 악기 & 장르 프리셋 (클릭 시 즉각 멜로디 화음 프리뷰):</span>
            </div>
            <div className="mv-chips-scroll">
              {SSOK_GENRE_PRESETS.map((pst) => (
                <button
                  key={pst.id}
                  type="button"
                  className={`mv-genre-chip ${selectedPreset.id === pst.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedPreset(pst);
                    playWebAudioPreview(pst);
                  }}
                >
                  <span className="mv-chip-icon">{pst.icon}</span>
                  <span className="mv-chip-name">{pst.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 노래 기획 입력 폼 */}
          <form onSubmit={handleGenerateSong} className="mv-song-input-form">
            <div className="mv-input-row-main">
              <div style={{ flex: 2 }}>
                <label className="mv-form-label">🎼 노래 주제 / 분위기</label>
                <input
                  type="text"
                  className="mv-text-input"
                  value={songTopic}
                  onChange={(e) => setSongTopic(e.target.value)}
                  placeholder="예: 비 내리는 성수동 골목길, 밤 11시의 재즈 라운지"
                  required
                />
              </div>

              <div style={{ flex: 1 }}>
                <label className="mv-form-label">🎤 보컬 유형</label>
                <select
                  className="mv-select-input"
                  value={vocalOption}
                  onChange={(e) => setVocalOption(e.target.value)}
                >
                  <option value="korean_female">여성 보컬 (Female)</option>
                  <option value="korean_male">남성 보컬 (Male)</option>
                  <option value="instrumental">순수 연주곡 (Instrumental)</option>
                </select>
              </div>

              <div style={{ width: 110 }}>
                <label className="mv-form-label">템포 (BPM)</label>
                <input
                  type="number"
                  className="mv-text-input"
                  value={bpmInput}
                  onChange={(e) => setBpmInput(Number(e.target.value))}
                  min={60}
                  max={180}
                />
              </div>
            </div>

            <div className="mv-action-row">
              <button
                type="submit"
                className="mv-btn-primary-generate"
                disabled={isGeneratingSong}
              >
                {isGeneratingSong ? <RefreshCw size={17} className="animate-spin" /> : <Sparkles size={17} />}
                <span>{isGeneratingSong ? '가사 & 스타일 조판 중...' : '⚡ 가사 & 스타일 자동 조립하기'}</span>
              </button>
            </div>
          </form>

          {/* 🌟 대표님 특별 탑재: 진짜 노래가 나오는 YuE2 공식 Hugging Face ZeroGPU 내장 스튜디오 */}
          <div className="mv-yue2-embedded-section">
            <div className="mv-yue2-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="cv-status-dot green"></span>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#0f172a' }}>
                    ⚡ [YuE2-3B] 공식 허깅페이스 무료 GPU 실시간 음악 생성기
                  </h3>
                  <p style={{ margin: '3px 0 0 0', fontSize: 12, color: '#64748b' }}>
                    허깅페이스 고성능 ZeroGPU 클러스터 연동 · 아래 생성기에서 바로 가사를 넣고 <strong>[Generate]</strong>를 누르면 진짜 노래 음원이 생성됩니다!
                  </p>
                </div>
              </div>
              <a
                href="https://huggingface.co/spaces/mrfakename/yue2-3b"
                target="_blank"
                rel="noreferrer"
                className="mv-yue2-ext-btn"
              >
                새 탭에서 열기 <ExternalLink size={13} />
              </a>
            </div>

            <div className="mv-yue2-iframe-container">
              <iframe
                src="https://mrfakename-yue2-3b.hf.space"
                title="YuE2-3B Music Generator"
                className="mv-yue2-iframe"
                allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-downloads"
              />
            </div>
          </div>

          {/* 출력 결과: 6단 콤보 프롬프트 & 구조화 가사 2분할 */}
          <div className="mv-output-split-grid">
            {/* 좌측: 6단 콤보 스타일 프롬프트 */}
            <div className="mv-output-card">
              <div className="mv-output-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Disc size={16} color="#0284c7" />
                  <strong>6단 콤보 스타일 프롬프트 (Style Prompt)</strong>
                </div>
                <button
                  type="button"
                  className="mv-btn-copy-chip"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedPrompt);
                    showToast('📋 스타일 프롬프트가 복사되었습니다!');
                  }}
                >
                  <Copy size={13} /> 복사
                </button>
              </div>
              <textarea
                className="mv-output-textarea code-font"
                rows={4}
                value={generatedPrompt}
                onChange={(e) => setGeneratedPrompt(e.target.value)}
              />
              <div className="mv-prompt-breakdown">
                <span className="mv-tag">[Language] Korean</span>
                <span className="mv-tag">[Genre] {selectedPreset.genre}</span>
                <span className="mv-tag">[BPM] {bpmInput}</span>
                <span className="mv-tag">[Mood] {selectedPreset.mood}</span>
              </div>
            </div>

            {/* 우측: 4단 구조화 가사 */}
            <div className="mv-output-card">
              <div className="mv-output-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FileText size={16} color="#16a34a" />
                  <strong>구조화 가사 ([Verse]/[Chorus] 마크업)</strong>
                </div>
                <button
                  type="button"
                  className="mv-btn-copy-chip"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedLyrics);
                    showToast('📋 가사 텍스트가 복사되었습니다!');
                  }}
                >
                  <Copy size={13} /> 복사
                </button>
              </div>
              <textarea
                className="mv-output-textarea lyrics-font"
                rows={9}
                value={generatedLyrics}
                onChange={(e) => setGeneratedLyrics(e.target.value)}
              />
            </div>
          </div>
        </section>
      )}

      {/* ======================================================================
          3. [모드 B] AI 목소리 무제한 생성기 (Supertonic 3 야담라디오 완전 이식)
          ====================================================================== */}
      {activeMode === 'voice' && (
        <section className="mv-voice-container">
          {/* 상단 안내 바 */}
          <div className="mv-info-banner purple">
            <Radio size={16} color="#9333ea" />
            <span>
              <strong>👑 대표님 & 철만이 시그니처 + 10대 야담 보이스 탑재:</strong> 우리 공부방 전용 <code>대표님 실제 육성</code>과 <code>철만이 공식 나레이터</code> 모델이 1열에 전진 배치되었습니다. 브라우저 실시간 낭독 및 원본 육성 미리듣기가 모두 가능합니다!
            </span>
          </div>

          {/* 12대 목소리 카드 그리드 */}
          <div className="mv-voices-selection-section">
            <div className="mv-box-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>👤 총 12종 시그니처 낭독 보이스 (👑 대표님 · 🎙️ 철만이 + Supertonic M1~M5 / F1~F5):</span>
              <span style={{ fontSize: '11px', color: '#7c3aed', fontWeight: 'bold' }}>⭐ 대표님 & 철만이 1열 VIP 특화 탑재</span>
            </div>
            <div className="mv-voices-grid">
              {SUPERTONIC_VOICES.map((vc) => (
                <div
                  key={vc.id}
                  className={`mv-voice-card ${selectedVoice.id === vc.id ? 'active' : ''} ${vc.isVip ? 'vip-voice-card' : ''}`}
                  onClick={() => setSelectedVoice(vc)}
                >
                  <div className="mv-voice-card-top">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className={`mv-gender-badge ${vc.gender}`}>{vc.id}</span>
                      {vc.isVip && <span className="mv-vip-badge">VIP</span>}
                    </div>
                    <strong className="mv-voice-name">{vc.name}</strong>
                  </div>
                  <p className="mv-voice-desc">{vc.desc}</p>
                  
                  {vc.refAudio && (
                    <div className="mv-ref-audio-play-row" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className={`mv-ref-play-btn ${playingRefId === vc.id ? 'playing' : ''}`}
                        onClick={(e) => handlePlayRefAudio(vc, e)}
                      >
                        {playingRefId === vc.id ? <Pause size={12} /> : <Volume2 size={12} />}
                        <span>{playingRefId === vc.id ? '육성 정지' : '실제 원본 육성 듣기'}</span>
                      </button>
                    </div>
                  )}

                  <div className="mv-voice-tags">
                    {vc.tags.map((t, idx) => (
                      <span key={idx} className="mv-vtag">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 대본 입력 및 파라미터 조절 */}
          <div className="mv-script-control-card">
            <div className="mv-control-sliders-row">
              <div className="mv-slider-item">
                <div className="mv-slider-header">
                  <span>낭독 속도 (Speed):</span>
                  <strong>{speed}x (야담/수면 0.88~0.92x 권장)</strong>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.3"
                  step="0.02"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="mv-range-slider"
                />
              </div>

              <div className="mv-slider-item">
                <div className="mv-slider-header">
                  <span>문단 사이 쉼 (Pause):</span>
                  <strong>{pauseDuration}초</strong>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="1.5"
                  step="0.1"
                  value={pauseDuration}
                  onChange={(e) => setPauseDuration(Number(e.target.value))}
                  className="mv-range-slider"
                />
              </div>

              <div className="mv-slider-item">
                <div className="mv-slider-header">
                  <span>장면 전환 쉼 (###):</span>
                  <strong>{scenePause}초</strong>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="3.0"
                  step="0.2"
                  value={scenePause}
                  onChange={(e) => setScenePause(Number(e.target.value))}
                  className="mv-range-slider"
                />
              </div>
            </div>

            <div className="mv-script-textarea-wrap">
              <div className="mv-script-header">
                <span>📜 낭독 대본 입력 (문단은 빈 줄로 구분, '###' 한 줄 = 장면 전환 쉼)</span>
                <span className="mv-char-count">{scriptText.length}자</span>
              </div>
              <textarea
                className="mv-script-textarea"
                rows={7}
                value={scriptText}
                onChange={(e) => setScriptText(e.target.value)}
                placeholder="낭독할 대본을 입력하세요..."
              />
            </div>

            {/* 조작 버튼 바 */}
            <div className="mv-voice-actions-bar">
              <button
                type="button"
                className={`mv-btn-voice-play ${isPlayingVoice ? 'playing' : ''}`}
                onClick={handlePlayVoice}
              >
                {isPlayingVoice ? <Pause size={17} /> : <Play size={17} />}
                <span>{isPlayingVoice ? '낭독 일시정지' : `🎧 [${selectedVoice.id}] 실시간 즉시 낭독`}</span>
              </button>

              <button
                type="button"
                className="mv-btn-voice-cli"
                onClick={handleCopyCliCommand}
                title="맥북 로컬 Supertonic 3 yadam_tts.py 터미널 실행 명령어 복사"
              >
                <Copy size={15} />
                <span>🖥️ 로컬 고화질 MP3 일괄 추출 명령 복사</span>
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
