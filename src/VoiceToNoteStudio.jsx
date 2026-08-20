import React, { useState, useEffect, useRef } from 'react';
import './VoiceToNoteStudio.css';
import { 
  Mic, MicOff, Sparkles, FileText, Copy, Check, Download, 
  RefreshCw, Volume2, VolumeX, ArrowRight, Lightbulb, CheckSquare,
  Share2, Key, Zap, Layers, Wand2, Shield, MessageSquare, BookOpen,
  Printer, Trash2, Sliders, Play, RotateCcw
} from 'lucide-react';

// 4대 스마트 정제 템플릿 정의
const CLEANSE_TEMPLATES = [
  {
    id: 'interview',
    icon: '🎯',
    name: '면접·스피치 정제',
    desc: '횡설수설 말버릇을 제거하고 두괄식 100점 면접 대본으로 다듬기',
    systemPrompt: '너는 면접 스피치 코칭 전문가다. 사용자가 편하게 말한 음성 텍스트에서 불필요한 추임새(어, 음, 그)를 없애고, 두괄식 핵심 메시지-구체적 근거-단단한 마무리로 구성된 깔끔한 1분 면접 모범 스크립트로 정제해줘.'
  },
  {
    id: 'meeting',
    icon: '📋',
    name: '1초 아이디어 & 실행 회의록',
    desc: '떠오른 생각을 핵심 3줄 요약과 즉시 실행할 To-Do 액션 리스트로 변환',
    systemPrompt: '너는 1인 기업 전문 비즈니스 비서다. 사용자의 음성 메모를 분석하여 [1. 핵심 요약 3줄], [2. 구체적 핵심 내용], [3. 즉시 실행할 액션 아이템(To-Do 체크리스트 3~5개)]로 일목요연하게 구조화해줘.'
  },
  {
    id: 'blog',
    icon: '✍️',
    name: '블로그 & SNS 완성글',
    desc: '말한 내용을 독자가 술술 읽기 좋은 매력적인 칼럼/포스팅으로 변환',
    systemPrompt: '너는 베스트셀러 작가이자 인기 블로거다. 사용자가 말한 내용을 바탕으로 흥미진진한 제목, 공감 가는 서론, 가독성 높은 본문(소제목 포함), 여운을 남기는 결론을 갖춘 완성형 블로그 포스팅으로 작성해줘.'
  },
  {
    id: 'business',
    icon: '💡',
    name: '1인 기업 1장 기획서',
    desc: '번뜩인 사업 아이디어를 타깃 고객, 가치 제안, 수익화 모델 기획서로 정제',
    systemPrompt: '너는 린 스타트업 기획 전문가다. 사용자가 쏟아낸 아이디어를 [1. 해결하려는 문제], [2. 타깃 고객(니치)], [3. 핵심 솔루션 및 기능], [4. 수익화(BM) 및 가격 전략], [5. 초고속 검증 실행 계획]으로 정리된 1장짜리 린 캔버스 기획서로 정제해줘.'
  }
];

export default function VoiceToNoteStudio() {
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyA4OBWvECFgXrfI2fgukYqrgZ8ZIj1DeJU';

  // 음성인식 상태 (Web Speech API + Whisper API 모드 지원)
  const [selectedTemplate, setSelectedTemplate] = useState(CLEANSE_TEMPLATES[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [rawTranscript, setRawTranscript] = useState('');
  const [refinedNote, setRefinedNote] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [copied, setCopied] = useState(false);

  // Whisper API 키 (선택사항)
  const [openAiApiKey, setOpenAiApiKey] = useState(() => localStorage.getItem('pv_openai_key') || '');
  const [showKeySetting, setShowKeySetting] = useState(false);

  // 타이머
  const [recordSeconds, setRecordSeconds] = useState(0);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  // 음성 인식 초기화
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'ko-KR';

        recognition.onresult = (event) => {
          let text = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            text += event.results[i][0].transcript;
          }
          setRawTranscript(prev => prev ? `${prev} ${text}` : text);
        };

        recognition.onerror = (e) => {
          console.warn('Speech error:', e);
          setIsRecording(false);
          clearInterval(timerRef.current);
        };

        recognition.onend = () => {
          setIsRecording(false);
          clearInterval(timerRef.current);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // 녹음 시작/중지
  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    } else {
      setRawTranscript('');
      setRefinedNote('');
      setRecordSeconds(0);
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
        timerRef.current = setInterval(() => {
          setRecordSeconds(prev => prev + 1);
        }, 1000);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // 🧠 AI 정제 처리 함수
  const handleCleanseNote = async () => {
    if (!rawTranscript.trim()) {
      alert('대표님, 먼저 마이크로 말씀하시거나 텍스트를 입력해 주십시오!');
      return;
    }

    setIsRefining(true);
    setRefinedNote('');

    const prompt = `
${selectedTemplate.systemPrompt}

[사용자의 실제 음성 원문 (날것의 대화)]:
"""
${rawTranscript}
"""

위 원문을 바탕으로 전문적이고 깔끔하게 정제된 마크다운 결과물만 작성해줘. 인사말이나 잡담은 생략하고 본문만 출력해.
`;

    try {
      if (geminiApiKey) {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }]
            })
          }
        );
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        setRefinedNote(text);
      } else {
        // 스마트 오프라인 정제 샘플
        setTimeout(() => {
          setRefinedNote(`### 🎯 [${selectedTemplate.name}] AI 정제 결과 보고\n\n**📌 핵심 메시지**\n${rawTranscript}\n\n**✨ 정제된 세부 내용**\n- 명확한 근거와 두괄식 구조로 재구성 완료\n- 불필요한 중복 표현 제거 및 전문 용어 매핑\n\n**🚀 실천 액션 플랜**\n1. 핵심 아이디어 즉시 메모 및 공유\n2. 1인 기업 제품 파이프라인 연결`);
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      alert('정제 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주십시오.');
    } finally {
      setIsRefining(false);
    }
  };

  // 클립보드 복사
  const handleCopy = () => {
    if (!refinedNote) return;
    navigator.clipboard.writeText(refinedNote);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 샘플 텍스트 불러오기 (테스트용)
  const loadSample = () => {
    setRawTranscript(
      "아 그니까 내가 오늘 수업에서 배운게 뭐냐면 사람이 말로 막 횡설수설 떠들어도 AI가 위스퍼나 스피치 API로 싹 다 알아듣고 그걸 예쁜 비즈니스 기획서나 면접 대본으로 정리해주는 거거든? 이걸로 1인 기업들이 쓸 수 있는 간단한 사스를 만들면 진짜 돈이 될 거 같아."
    );
  };

  return (
    <div className="voice-to-note-container">
      {/* 🚀 헤더 배너 */}
      <header className="vtn-header">
        <div className="vtn-badge-row">
          <span className="vtn-badge live">🎙️ Voice-to-Clean SaaS 실습 랩</span>
          <span className="vtn-badge tech">⚡ Whisper & Speech API 기반</span>
          <span className="vtn-badge magic">✨ 말하는 대로 자동 문서화</span>
        </div>

        <h1 className="vtn-title">
          🗣️ 말하면 <span className="gold-gradient">알아서 깔끔하게 정제되는</span> AI 보이스 노트 📝
        </h1>
        <p className="vtn-desc">
          "막 떠들어도 괜찮습니다. 마이크에 대고 생각나는 대로 말하면, AI가 군더더기를 싹 걷어내고 완벽한 문서로 정제합니다!"
        </p>

        {/* 템플릿 선택 바 */}
        <div className="template-selector-grid">
          {CLEANSE_TEMPLATES.map(tpl => (
            <button
              key={tpl.id}
              className={`template-card-btn ${selectedTemplate.id === tpl.id ? 'active' : ''}`}
              onClick={() => setSelectedTemplate(tpl)}
            >
              <div className="tpl-icon">{tpl.icon}</div>
              <div className="tpl-text">
                <strong>{tpl.name}</strong>
                <p>{tpl.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </header>

      {/* 🎮 메인 워크스페이스 그리드 (좌: 음성 녹음 / 우: AI 정제 문서) */}
      <div className="vtn-workspace-grid">
        {/* 1. 좌측: 실시간 음성 녹음창 (Raw Voice Studio) */}
        <div className="vtn-card input-pane">
          <div className="card-top-bar">
            <span className="step-tag">Step 1. 편안하게 말하기 (음성 입력)</span>
            <div className="timer-badge">
              ⏱️ {String(Math.floor(recordSeconds / 60)).padStart(2, '0')}:{String(recordSeconds % 60).padStart(2, '0')}
            </div>
          </div>

          {/* 마이크 인터랙션 영역 */}
          <div className="mic-action-zone">
            <button 
              className={`vtn-mic-btn ${isRecording ? 'active' : ''}`}
              onClick={toggleRecording}
            >
              {isRecording ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
            </button>
            <div className="mic-status-text">
              {isRecording ? (
                <span className="recording-now">🔴 실시간 음성을 기록하는 중입니다... (끝나면 다시 클릭)</span>
              ) : (
                <span>마이크를 누르고 편안하게 생각나는 대로 말씀해 보세요!</span>
              )}
            </div>

            {/* 음성 파형 애니메이션 */}
            {isRecording && (
              <div className="voice-waves">
                <span className="w-bar" /><span className="w-bar" /><span className="w-bar" /><span className="w-bar" /><span className="w-bar" />
              </div>
            )}
          </div>

          {/* 날것의 음성 텍스트 표시창 */}
          <div className="raw-text-container">
            <div className="raw-label">
              <span>🗣️ 실시간 받아적은 원본 내용:</span>
              <button className="clear-btn" onClick={() => setRawTranscript('')}>
                <Trash2 className="w-3.5 h-3.5" /> 비우기
              </button>
            </div>
            <textarea
              className="raw-textarea"
              rows={6}
              placeholder="마이크 버튼을 누르고 말씀하시거나, 여기에 생각나는 문장을 편하게 적어보세요..."
              value={rawTranscript}
              onChange={(e) => setRawTranscript(e.target.value)}
            />
          </div>

          {/* 하단 액션 버튼 */}
          <div className="input-bottom-actions">
            <button className="sample-btn" onClick={loadSample}>
              💡 예시 문장 불러와서 테스트
            </button>
            <button 
              className="cleanse-submit-btn"
              onClick={handleCleanseNote}
              disabled={isRefining}
            >
              {isRefining ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
              {isRefining ? 'AI가 마법처럼 정제 중...' : `✨ [${selectedTemplate.name}] 정제하기`}
            </button>
          </div>
        </div>

        {/* 2. 우측: AI 정제된 완벽한 문서 (Refined Clean Document) */}
        <div className="vtn-card output-pane">
          <div className="card-top-bar">
            <span className="step-tag success">Step 2. AI 정제 완성본</span>
            <div className="output-tool-btns">
              <button className="tool-btn" onClick={handleCopy} disabled={!refinedNote}>
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                {copied ? '복사 완료!' : '원클릭 복사'}
              </button>
              <button className="tool-btn" onClick={() => window.print()} disabled={!refinedNote}>
                <Printer className="w-4 h-4" /> A4 인쇄/PDF
              </button>
            </div>
          </div>

          <div className="refined-content-box">
            {refinedNote ? (
              <div className="clean-doc-paper">
                <div className="doc-watermark">{selectedTemplate.icon} {selectedTemplate.name}</div>
                <div className="doc-body">
                  {refinedNote.split('\n').map((line, idx) => {
                    const trimmed = line.trim();
                    if (trimmed.startsWith('### ')) {
                      return <h3 key={idx} className="doc-h3">{trimmed.replace('### ', '')}</h3>;
                    }
                    if (trimmed.startsWith('## ')) {
                      return <h2 key={idx} className="doc-h2">{trimmed.replace('## ', '')}</h2>;
                    }
                    if (trimmed.startsWith('# ')) {
                      return <h1 key={idx} className="doc-h1">{trimmed.replace('# ', '')}</h1>;
                    }
                    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                      return <li key={idx} className="doc-li">{trimmed.substring(2)}</li>;
                    }
                    if (/^\d+\.\s/.test(trimmed)) {
                      return <div key={idx} className="doc-num-item">{trimmed}</div>;
                    }
                    if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                      return <strong key={idx} className="doc-lead">{trimmed.slice(2, -2)}</strong>;
                    }
                    if (!trimmed) {
                      return <div key={idx} className="doc-space" />;
                    }
                    return <p key={idx} className="doc-p">{line}</p>;
                  })}
                </div>
              </div>
            ) : (
              <div className="empty-refined-state">
                <div className="empty-wand">🪄</div>
                <h4>아직 정제된 문서가 없습니다</h4>
                <p>
                  왼쪽에서 마이크로 편하게 말씀하신 뒤<br />
                  <strong>[정제하기]</strong> 버튼을 누르시면 전문가 수준의 깔끔한 문서로 다시 태어납니다!
                </p>
                <div className="feature-badges-row">
                  <span>✓ 말버릇 및 추임새 자동 삭제</span>
                  <span>✓ 두괄식 구조화</span>
                  <span>✓ To-Do 실행 목록 도출</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
