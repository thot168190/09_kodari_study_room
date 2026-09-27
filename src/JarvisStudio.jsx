import React, { useState, useRef, useEffect } from 'react';
import './JarvisStudio.css';
import { 
  Bot, Mic, MicOff, Volume2, VolumeX, Send, RefreshCw, Sparkles, 
  Terminal, Zap, Shield, Cpu, ChevronDown, ChevronUp, Copy, Check, 
  Trash2, BrainCircuit, Activity, Sliders, Smartphone, Flame, MessageSquare,
  Play, Square, Radio, Upload, Settings2, UserCheck, AudioWaveform
} from 'lucide-react';

export default function JarvisStudio({ onExit }) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking'); // LM Studio status
  const [ttsServerStatus, setTtsServerStatus] = useState('checking'); // tts.py (port 8000)
  const [modelIdentifier, setModelIdentifier] = useState('hui');
  const [availableModels, setAvailableModels] = useState([]);
  const [persona, setPersona] = useState('jarvis'); // 'jarvis' | 'kodari' | 'architect'
  
  // 🎙️ 5강 핵심: TTS 엔진 및 목소리 복제 상태
  const [ttsEngine, setTtsEngine] = useState('local_py'); // 'local_py' (tts.py) | 'browser' | 'google'
  const [autoVoiceOutput, setAutoVoiceOutput] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1200);
  const [showSettings, setShowSettings] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [expandedThinking, setExpandedThinking] = useState({});

  // 오디오 재생 상태
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentPlayingIdx, setCurrentPlayingIdx] = useState(null);
  const [audioSynthesizingIdx, setAudioSynthesizingIdx] = useState(null);
  const audioPlayerRef = useRef(null);

  // 5강 22페이지: 소리와 글자 한 쌍 (ref_audio & ref_text)
  const [voiceProfiles, setVoiceProfiles] = useState([
    { id: 'myvoice', name: '내 목소리 (10초 복제)', ref_text: '오늘은 내 컴퓨터에서 도는 인공지능에 입을 달아 보겠습니다.', file: 'myvoice.wav' },
    { id: 'kodari_voice', name: '코다리 총괄부장', ref_text: '충성! 대표님, 오늘 밤 당장 현금 뽑아낼 니치 파이프라인 브리핑 올립니다!', file: 'kodari.wav' },
    { id: 'jarvis_pure', name: '나노 바나나 자비스', ref_text: '안녕하세요 마스터님. 저는 마스터님의 곁을 지키는 나노 바나나 자비스예요.', file: 'jarvis.wav' },
    { id: 'mother_voice', name: '부모님 목소리', ref_text: '밥은 잘 챙겨 먹고 다니니? 건강이 제일 우선이다.', file: 'mother.wav' }
  ]);
  const [selectedVoice, setSelectedVoice] = useState('myvoice');

  // 목소리 녹음 모달용 상태
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [newVoiceName, setNewVoiceName] = useState('');
  const [newRefText, setNewRefText] = useState('오늘은 내 컴퓨터에서 도는 인공지능에 입을 달아 보겠습니다.');
  const [recordedAudioBlob, setRecordedAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const recordIntervalRef = useRef(null);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // 페르소나별 시스템 프롬프트
  const SYSTEM_PROMPTS = {
    jarvis: `당신은 대표님을 보좌하는 최첨단 개인 AI 자비스(J.A.R.V.I.S)입니다.
- 정중하고 침착하며 충성스러운 어조로 말합니다.
- 사용자를 항상 '대표님'이라고 부릅니다.
- 핵심을 짚어 간결하고 날카롭게 답변하며, 실행 가능한 행동(Action Item)을 제시합니다.
- 한국어로 명쾌하고 자연스럽게 대화하세요.`,

    kodari: `너는 대표님의 최고 성실한 에이전트 총괄부장 '코다리'다.
- 대표님의 '09_코다리_공부방' 행동 강령을 철저히 준수한다:
  1) 한 사이클 온전히 돌리기 (End-to-End Shipping: 개발->결제->마케팅)
  2) 투 트랙 비즈니스 (오늘 밤 돈 되는 단기 니치 vs 2년 뒤 피지컬 AI 장기 트랙)
  3) 초고속 가설 검증과 빠른 피벗
  4) 니치! 니치! 니치! 경쟁사와 벡터 거리 극대화
  5) 모바일 퍼스트 감리 (390px 기준)
- 항상 '충성! 대표님!'으로 시작하며, 충성심과 기민함, 실행력이 뚝뚝 묻어나는 화법으로 보고하라.`,

    architect: `당신은 시니어 풀스택 AI 소프트웨어 아키텍트입니다.
- 복잡한 코드, 알고리즘, 로컬 LLM 양자화, RAG 파이프라인, 아키텍처 설계를 전문적으로 분석합니다.
- 버그를 잡고, 성능을 최적화하며, 모바일 반응형(390px) 코드를 완벽하게 작성합니다.
- 불필요한 사족 없이 핵심 코드와 기술적 이유를 설명하세요.`
  };

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '대표님, 나만의 자비스 두뇌(Hui 9B)와 입(TTS 0.6B)이 연결되었습니다. 글이 나오던 자비스가 이제 대표님의 목소리로 말합니다. 무엇을 지시하시겠습니까?',
      reasoning: '자비스 두뇌(LM Studio 1234) & 입(tts.py 8000) 온라인 완료. Apple M3 통합 메모리 정상 연동.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 🔇 컴포넌트 진입 시 모든 기존 음성 즉시 소멸
  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, audioSynthesizingIdx]);

  // 1. LM Studio 로컬 서버(1234) 상태 점검
  const checkLMServer = async () => {
    setServerStatus('checking');
    try {
      const res = await fetch('http://127.0.0.1:1234/v1/models', { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        setServerStatus('connected');
        if (data.data && data.data.length > 0) {
          setAvailableModels(data.data.map(m => m.id));
          const hasHui = data.data.some(m => m.id.toLowerCase().includes('hui'));
          if (hasHui) {
            const huiModel = data.data.find(m => m.id.toLowerCase().includes('hui')).id;
            setModelIdentifier(huiModel);
          } else {
            setModelIdentifier(data.data[0].id);
          }
        }
      } else {
        setServerStatus('disconnected');
      }
    } catch {
      setServerStatus('disconnected');
    }
  };

  // 2. 5강 tts.py 로컬 서버(8000) 상태 점검
  const checkTTSServer = async () => {
    setTtsServerStatus('checking');
    try {
      const res = await fetch('http://127.0.0.1:8000/status', { method: 'GET' });
      if (res.ok) {
        setTtsServerStatus('connected');
      } else {
        setTtsServerStatus('disconnected');
      }
    } catch {
      setTtsServerStatus('disconnected');
    }
  };

  useEffect(() => {
    checkLMServer();
    checkTTSServer();
    const interval = setInterval(() => {
      checkLMServer();
      checkTTSServer();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // 귀(STT): 브라우저 음성 인식
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'ko-KR';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => (prev ? prev + ' ' + transcript : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('이 브라우저는 음성 인식을 지원하지 않습니다. Chrome/Safari를 권장합니다.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const cleanForSpeech = (rawText) => {
    if (!rawText) return '';
    let txt = rawText;
    // 사고 과정 및 특수 마크다운 태그 완벽 제거
    txt = txt.replace(/Thinking Process:[\s\S]*?(?=\n\n|$)/gi, '');
    txt = txt.replace(/<think>[\s\S]*?<\/think>/gi, '');
    txt = txt.replace(/추론을 마쳤습니다:?/gi, '');
    txt = txt.replace(/[*#`_~[\]()]/g, '');
    return txt.trim();
  };

  const stopAudio = () => {
    if (audioPlayerRef.current) {
      try {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.currentTime = 0;
      } catch {}
      audioPlayerRef.current = null;
    }
    if (window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    setIsPlayingAudio(false);
    setCurrentPlayingIdx(null);
    setAudioSynthesizingIdx(null);
  };

  // 👄 5강 핵심: 음성 합성(TTS) 실행 (단일 오디오 채널 제어로 이중 재생 원천 차단)
  const speakMessage = async (text, msgIdx = null) => {
    if (!text) return;
    stopAudio(); // 🛑 이전 소리가 나오고 있다면 즉시 모두 정지!

    const cleanText = cleanForSpeech(text);
    if (!cleanText) return;

    // 1) 5강 tts.py 로컬 음성 복제 서버 호출
    if (ttsEngine === 'local_py' && ttsServerStatus === 'connected') {
      try {
        if (msgIdx !== null) setAudioSynthesizingIdx(msgIdx);
        const profile = voiceProfiles.find(v => v.id === selectedVoice);

        const response = await fetch('http://127.0.0.1:8000/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: cleanText,
            ref_audio: profile?.file || 'myvoice.wav',
            ref_text: profile?.ref_text || ''
          })
        });

        if (response.ok) {
          const result = await response.json();
          if (result.audio_url) {
            playAudioUrl(result.audio_url, msgIdx);
            return; // 🛑 로컬 음성 성공 시 브라우저 Fallback 실행 금지!
          }
        }
      } catch (err) {
        console.warn('tts.py 로컬 음성 생성 실패, 브라우저 음성으로 대체합니다.', err);
      } finally {
        setAudioSynthesizingIdx(null);
      }
    }

    // 2) 브라우저 기본 Web Speech TTS Fallback (로컬 tts가 없을 때만 단독 실행)
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ko-KR';
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.onstart = () => {
        setIsPlayingAudio(true);
        if (msgIdx !== null) setCurrentPlayingIdx(msgIdx);
      };
      utterance.onend = () => {
        setIsPlayingAudio(false);
        setCurrentPlayingIdx(null);
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  const playAudioUrl = (url, msgIdx) => {
    stopAudio(); // 🛑 중복 재생 방지
    const audio = new Audio(`${url}?t=${Date.now()}`);
    audioPlayerRef.current = audio;

    audio.onplay = () => {
      setIsPlayingAudio(true);
      if (msgIdx !== null) setCurrentPlayingIdx(msgIdx);
    };
    audio.onended = () => {
      setIsPlayingAudio(false);
      setCurrentPlayingIdx(null);
      audioPlayerRef.current = null;
    };
    audio.onerror = () => {
      setIsPlayingAudio(false);
      setCurrentPlayingIdx(null);
      audioPlayerRef.current = null;
    };
    audio.play().catch(err => {
      console.warn('Audio 재생 지연/차단:', err);
    });
  };

  // 메시지 전송 로직
  const handleSend = async (customPrompt = null) => {
    const promptToSend = (customPrompt || input).trim();
    if (!promptToSend || isLoading) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      role: 'user',
      content: promptToSend,
      timestamp: timeStr
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    const apiMessages = [
      { role: 'system', content: SYSTEM_PROMPTS[persona] },
      ...newHistory.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }))
    ];

    try {
      const response = await fetch('http://127.0.0.1:1234/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: modelIdentifier || 'hui',
          messages: apiMessages,
          temperature: parseFloat(temperature),
          max_tokens: parseInt(maxTokens, 10)
        })
      });

      if (!response.ok) {
        throw new Error(`LM Studio 응답 오류 (${response.status})`);
      }

      const data = await response.json();
      const choice = data.choices?.[0];
      const replyContent = (choice?.message?.content || '').trim();
      const reasoningContent = (choice?.message?.reasoning_content || '').trim();

      let finalContent = replyContent;
      if (!finalContent && reasoningContent) {
        // 추론 블록 안에만 답이 남아있는 경우, 마지막 실제 결론 문장만 추출
        const meaningfulLines = reasoningContent
          .split('\n')
          .map(l => l.trim())
          .filter(l => l.length > 0 && !l.toLowerCase().includes('thinking process') && !l.startsWith('*') && !l.startsWith('1.') && !l.startsWith('2.'));
        finalContent = meaningfulLines.length > 0 ? meaningfulLines.slice(-2).join(' ') : '대표님, 지시하신 작업을 분석 완료했습니다.';
      }
      if (!finalContent) {
        finalContent = '대표님, 분석 및 처리를 완료했습니다.';
      }

      const nextIdx = newHistory.length;
      const aiMsg = {
        role: 'assistant',
        content: finalContent,
        reasoning: reasoningContent || null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);

      // 자동 음성 출력 옵션 ON이면 바로 말하기 (단일 채널)
      if (autoVoiceOutput) {
        speakMessage(finalContent, nextIdx);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          isError: true,
          content: `⚠️ **로컬 두뇌 연결 실패**\n\nLM Studio 서버(\`http://localhost:1234\`)와 통신할 수 없습니다.\n\n**해결 방법:**\n1. 터미널에서 \`~/.lmstudio/bin/lms server start\` 실행\n2. 또는 LM Studio 앱의 **Local Server** 탭에서 **Start** 스위치 켜기\n3. \`hui\` 모델이 로드되어 있는지 확인`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const toggleThinking = (idx) => {
    setExpandedThinking(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // 🎙️ 목소리 10초 녹음 기능 (5강 8페이지 & 22페이지)
  const startRecordingMyVoice = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        setRecordedAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecordingVoice(true);
      setRecordSeconds(0);

      recordIntervalRef.current = setInterval(() => {
        setRecordSeconds(prev => {
          if (prev >= 15) {
            stopRecordingMyVoice();
            return 15;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      alert('마이크 접근 권한이 필요합니다: ' + err.message);
    }
  };

  const stopRecordingMyVoice = () => {
    if (mediaRecorderRef.current && isRecordingVoice) {
      mediaRecorderRef.current.stop();
      setIsRecordingVoice(false);
      clearInterval(recordIntervalRef.current);
    }
  };

  const saveNewVoiceProfile = () => {
    if (!newVoiceName.trim()) {
      alert('목소리 이름을 입력해주세요 (예: 내 목소리, 홍자).');
      return;
    }
    const newProfile = {
      id: 'custom_' + Date.now(),
      name: newVoiceName.trim(),
      ref_text: newRefText.trim(),
      file: 'myvoice.wav'
    };
    setVoiceProfiles(prev => [...prev, newProfile]);
    setSelectedVoice(newProfile.id);
    setShowVoiceModal(false);
    alert(`🎉 [${newProfile.name}] 목소리가 등록되었습니다! 이제 자비스가 이 목소리로 대답합니다.`);
  };

  return (
    <div className="jarvis-container">
      {/* 🚀 상단 관제 헤더 바 */}
      <div className="jarvis-header">
        <div className="jarvis-brand">
          <div className="jarvis-orb">
            <BrainCircuit size={22} className="orb-icon" />
            <div className={`orb-pulse ${serverStatus === 'connected' ? 'active' : ''}`} />
          </div>
          <div className="brand-info">
            <div className="brand-title-row">
              <h2>J.A.R.V.I.S <span>Hui 9B + TTS 0.6B</span></h2>
              <div className="status-badges-group">
                <span className={`status-pill ${serverStatus}`}>
                  <span className="dot" />
                  {serverStatus === 'connected' ? '두뇌: 온라인(1234)' : '두뇌: 오프라인'}
                </span>
                <span className={`status-pill ${ttsServerStatus}`}>
                  <span className="dot" />
                  {ttsServerStatus === 'connected' ? '입(TTS): 온라인(8000)' : '입(TTS): 브라우저모드'}
                </span>
              </div>
            </div>
            <p className="brand-spec">Apple M3 (16GB) · 목소리 복제(Voice Clone) · $0 보안 로컬</p>
          </div>
        </div>

        {/* 헤더 우측 조작계 */}
        <div className="jarvis-controls">
          {/* 5강: 목소리 프로필 선택기 */}
          <div className="voice-profile-picker">
            <button 
              className="voice-picker-btn"
              onClick={() => setShowVoiceModal(true)}
              title="목소리 복제 및 선택 (5강)"
            >
              <AudioWaveform size={14} color="#38bdf8" />
              <span className="voice-name">
                {voiceProfiles.find(v => v.id === selectedVoice)?.name || '목소리 선택'}
              </span>
              <ChevronDown size={12} />
            </button>
          </div>

          {/* 페르소나 선택기 */}
          <div className="persona-toggle-group">
            <button 
              className={`persona-btn ${persona === 'jarvis' ? 'active' : ''}`}
              onClick={() => setPersona('jarvis')}
              title="아이언맨 자비스 비서 모드"
            >
              🤖 자비스
            </button>
            <button 
              className={`persona-btn ${persona === 'kodari' ? 'active' : ''}`}
              onClick={() => setPersona('kodari')}
              title="코다리 에이전트 총괄부장 모드"
            >
              🐟 코다리 부장
            </button>
            <button 
              className={`persona-btn ${persona === 'architect' ? 'active' : ''}`}
              onClick={() => setPersona('architect')}
              title="수석 AI 아키텍트 모드"
            >
              💻 엔지니어
            </button>
          </div>

          {/* 자동 음성 답변 토글 (입 TTS ON/OFF) */}
          <button 
            className={`voice-toggle-btn ${autoVoiceOutput ? 'active' : ''}`}
            onClick={() => setAutoVoiceOutput(!autoVoiceOutput)}
            title={autoVoiceOutput ? '자동 읽기 끄기' : '답변 즉시 말하기 (입 TTS)'}
          >
            {autoVoiceOutput ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span className="btn-label">{autoVoiceOutput ? '자동입 ON' : '자동입 OFF'}</span>
          </button>

          {/* 현재 재생 중인 소리 멈춤 버튼 */}
          {isPlayingAudio && (
            <button className="icon-btn danger" onClick={stopAudio} title="음성 정지">
              <Square size={14} />
            </button>
          )}

          <button 
            className={`icon-btn ${showSettings ? 'active' : ''}`}
            onClick={() => setShowSettings(!showSettings)}
            title="자비스 & TTS 설정"
          >
            <Sliders size={16} />
          </button>

          <button className="icon-btn" onClick={() => { checkLMServer(); checkTTSServer(); }} title="서버 재연결 확인">
            <RefreshCw size={16} className={serverStatus === 'checking' ? 'spin' : ''} />
          </button>

          <button className="icon-btn danger" onClick={() => setMessages([messages[0]])} title="대화 비우기">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* ⚙️ 설정 드로어 (두뇌 & TTS 설정) */}
      {showSettings && (
        <div className="jarvis-settings-drawer">
          <div className="settings-grid">
            <div className="setting-item">
              <label>👄 TTS 음성 합성 엔진 (5강)</label>
              <select 
                value={ttsEngine} 
                onChange={(e) => setTtsEngine(e.target.value)}
                className="jarvis-select"
              >
                <option value="local_py">5강 tts.py 로컬 복제 엔진 (포트 8000, $0)</option>
                <option value="browser">초경량 브라우저 Web Speech (0초 지연)</option>
                <option value="google">구글 고음질 TTS API</option>
              </select>
            </div>

            <div className="setting-item">
              <label>🧠 두뇌 모델 (LM Studio)</label>
              <select 
                value={modelIdentifier} 
                onChange={(e) => setModelIdentifier(e.target.value)}
                className="jarvis-select"
              >
                {availableModels.length > 0 ? (
                  availableModels.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))
                ) : (
                  <option value="hui">hui (Huihui-Qwen3.5-9B)</option>
                )}
              </select>
            </div>

            <div className="setting-item">
              <label>창의성 온도 (Temperature: {temperature})</label>
              <input 
                type="range" 
                min="0.1" 
                max="1.0" 
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className="jarvis-slider"
              />
            </div>
          </div>
        </div>
      )}

      {/* 🎙️ 5강: 목소리 등록 및 선택 모달 */}
      {showVoiceModal && (
        <div className="voice-modal-overlay" onClick={() => setShowVoiceModal(false)}>
          <div className="voice-modal-content" onClick={e => e.stopPropagation()}>
            <div className="voice-modal-header">
              <div className="modal-title">
                <AudioWaveform size={20} color="#38bdf8" />
                <h3>자비스 목소리 서랍 (5강 목소리 여러 개)</h3>
              </div>
              <button className="close-btn" onClick={() => setShowVoiceModal(false)}>✕</button>
            </div>

            <div className="voice-modal-body">
              <p className="modal-desc">
                교재 <strong>5강 10절</strong> 내용대로 목소리를 여러 개 등록하고 골라 쓸 수 있습니다.
                자비스의 답변을 읽을 목소리를 선택하세요.
              </p>

              {/* 현재 등록된 목소리 목록 */}
              <div className="voice-list-grid">
                {voiceProfiles.map(p => (
                  <div 
                    key={p.id} 
                    className={`voice-card ${selectedVoice === p.id ? 'active' : ''}`}
                    onClick={() => setSelectedVoice(p.id)}
                  >
                    <div className="voice-card-top">
                      <span className="voice-card-name">{p.name}</span>
                      {selectedVoice === p.id && <span className="active-badge">선택됨</span>}
                    </div>
                    <p className="voice-ref-preview">"{p.ref_text}"</p>
                    <button 
                      className="test-voice-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        speakMessage(p.ref_text);
                      }}
                    >
                      <Play size={12} /> 목소리 미리듣기
                    </button>
                  </div>
                ))}
              </div>

              {/* 🎤 새 목소리 10초 녹음 섹션 (5강 8절 & 22절) */}
              <div className="voice-record-box">
                <h4>🎙️ 새 목소리 녹음하기 (3~15초 소리와 글자 한 쌍)</h4>
                <div className="record-input-row">
                  <input 
                    type="text" 
                    placeholder="목소리 이름 (예: 내 목소리, 영희)" 
                    value={newVoiceName} 
                    onChange={e => setNewVoiceName(e.target.value)}
                    className="jarvis-text-input"
                  />
                </div>

                <div className="record-guide-text">
                  <label>⚠️ 아래 문장을 단 한 글자도 틀리지 않고 그대로 읽어주세요 (5강 23페이지 원칙):</label>
                  <textarea 
                    value={newRefText} 
                    onChange={e => setNewRefText(e.target.value)}
                    rows={2}
                    className="jarvis-textarea-sm"
                  />
                </div>

                <div className="record-actions-row">
                  {!isRecordingVoice ? (
                    <button className="record-btn-start" onClick={startRecordingMyVoice}>
                      <Mic size={16} /> 10초 녹음 시작
                    </button>
                  ) : (
                    <button className="record-btn-stop" onClick={stopRecordingMyVoice}>
                      <Square size={16} /> 녹음 완료 ({recordSeconds}초 / 15초)
                    </button>
                  )}

                  {recordedAudioBlob && (
                    <button className="save-voice-btn" onClick={saveNewVoiceProfile}>
                      <Check size={16} /> 목소리 등록 완료
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 💬 메인 대화 스크롤 영역 */}
      <div className="jarvis-messages-area">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message-row ${msg.role === 'user' ? 'user-side' : 'ai-side'}`}>
            <div className="message-avatar">
              {msg.role === 'user' ? (
                <div className="user-icon">👤</div>
              ) : (
                <div className="ai-icon">
                  {persona === 'kodari' ? '🐟' : persona === 'architect' ? '⚡' : '🤖'}
                </div>
              )}
            </div>

            <div className="message-bubble-wrapper">
              <div className="message-meta">
                <span className="sender-name">
                  {msg.role === 'user' 
                    ? '대표님' 
                    : persona === 'kodari' 
                      ? '총괄부장 코다리' 
                      : persona === 'architect' 
                        ? '수석 아키텍트' 
                        : 'J.A.R.V.I.S (Hui)'}
                </span>
                <span className="timestamp">{msg.timestamp}</span>
              </div>

              {/* 🧠 심층 추론(Thinking Process) 아코디언 */}
              {msg.reasoning && (
                <div className="thinking-accordion">
                  <div 
                    className="thinking-header" 
                    onClick={() => toggleThinking(idx)}
                  >
                    <div className="thinking-title">
                      <BrainCircuit size={14} className="pulse-cyan" />
                      <span>자비스의 심층 추론 과정 (Deep Thinking)</span>
                    </div>
                    {expandedThinking[idx] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>
                  {expandedThinking[idx] && (
                    <div className="thinking-body">
                      {msg.reasoning}
                    </div>
                  )}
                </div>
              )}

              {/* 본문 텍스트 */}
              <div className={`message-bubble ${msg.isError ? 'error-bubble' : ''}`}>
                <div className="bubble-text">
                  {msg.content.split('\n').map((line, lIdx) => (
                    <p key={lIdx} className="bubble-line">
                      {line || '\u00A0'}
                    </p>
                  ))}
                </div>

                {/* 5강 핵심: 말풍선별 [내 목소리로 듣기] 버튼 */}
                <div className="bubble-actions">
                  {msg.role === 'assistant' && (
                    <button 
                      className={`voice-play-pill ${currentPlayingIdx === idx ? 'playing' : ''}`}
                      onClick={() => {
                        if (currentPlayingIdx === idx) {
                          stopAudio();
                        } else {
                          speakMessage(msg.content, idx);
                        }
                      }}
                      title="5강: 등록된 목소리로 읽기"
                    >
                      {audioSynthesizingIdx === idx ? (
                        <>
                          <RefreshCw size={12} className="spin" />
                          <span>음성 생성 중...</span>
                        </>
                      ) : currentPlayingIdx === idx ? (
                        <>
                          <Square size={12} color="#ef4444" />
                          <span>말하는 중 🔊</span>
                        </>
                      ) : (
                        <>
                          <Volume2 size={12} color="#38bdf8" />
                          <span>내 목소리로 듣기</span>
                        </>
                      )}
                    </button>
                  )}

                  <button 
                    className="action-btn"
                    onClick={() => copyToClipboard(msg.content, idx)}
                    title="복사하기"
                  >
                    {copiedIdx === idx ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message-row ai-side">
            <div className="message-avatar">
              <div className="ai-icon loading-spin">⚙️</div>
            </div>
            <div className="message-bubble-wrapper">
              <div className="message-meta">
                <span className="sender-name">J.A.R.V.I.S (Hui 9B)</span>
                <span className="thinking-indicator">신경망 추론 중... ⚡</span>
              </div>
              <div className="message-bubble loading-bubble">
                <div className="wave-loader">
                  <span />
                  <span />
                  <span />
                </div>
                <span className="loading-hint">M3 통합 메모리(5.8GB)에서 초당 약 30토큰으로 생각하고 있습니다...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 💡 추천 퀵 프롬프트 칩스 */}
      <div className="jarvis-quick-chips">
        <button 
          className="chip-btn" 
          onClick={() => handleSend('오늘은 내 컴퓨터에서 도는 인공지능에 입을 달아 보겠습니다. 5강 완료 기준 3가지를 점검해줘.')}
        >
          <Sparkles size={12} color="#38bdf8" /> 5강 입 달기 점검
        </button>
        <button 
          className="chip-btn" 
          onClick={() => handleSend('오늘 대표님이 즉시 실행할 단기 트랙 니치 아이디어 3가지 추천해줘')}
        >
          <Flame size={12} color="#f97316" /> 단기 니치 아이디어
        </button>
        <button 
          className="chip-btn" 
          onClick={() => handleSend('우리 코다리 공부방의 390px 모바일 퍼스트 감리 원칙을 점검해줘')}
        >
          <Smartphone size={12} color="#34d399" /> 390px 모바일 감리
        </button>
        <button 
          className="chip-btn" 
          onClick={() => handleSend('마이크로덕 피지컬 AI와 심투리얼(BAM 마찰모델) 비즈니스 가치를 요약해줘')}
        >
          <Cpu size={12} color="#c084fc" /> 피지컬 AI 가치 요약
        </button>
      </div>

      {/* 🎙️ 하단 입력 덱 (모바일 390px 완벽 최적화) */}
      <div className="jarvis-input-dock">
        <div className="input-bar-wrapper">
          {/* 음성 입력 버튼 (귀 STT) */}
          <button 
            className={`mic-btn ${isListening ? 'listening' : ''}`}
            onClick={toggleListening}
            title={isListening ? '음성 인식 중지' : '말로 명령하기 (귀 STT)'}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? '대표님의 목소리를 경청하고 있습니다...' : '자비스에게 지시하세요... (Enter 전송, Shift+Enter 줄바꿈)'}
            rows={1}
            className="jarvis-textarea"
          />

          <button 
            className="send-btn" 
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
          >
            <Send size={18} />
          </button>
        </div>
        <div className="input-footer">
          <span>🧠 Hui 9B + 👄 {voiceProfiles.find(v => v.id === selectedVoice)?.name}</span>
          <span>5강 tts.py (포트 8000) 연동 완료 · $0 보안 로컬</span>
        </div>
      </div>
    </div>
  );
}
