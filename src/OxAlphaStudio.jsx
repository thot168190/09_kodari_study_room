import React, { useState, useEffect, useRef } from 'react';
import './OxAlphaStudio.css';
import { 
  Sparkles, Send, Paperclip, ChevronDown, ChevronUp, 
  Copy, Check, Plus, MessageSquare, Settings, Key, 
  PanelLeft, Shield, ArrowUp, RefreshCw, AlertCircle, Trash2, 
  StopCircle, Download, Folder, FileText, Code2, Terminal,
  Home, Code, Box, Clock, Send as SendIcon, Sliders, Mic,
  Moon, Sun, HelpCircle, ClipboardPaste, X
} from 'lucide-react';

const CLAUDE_PRESETS = [
  {
    title: '1M 오픈소스 구조 분해 및 보일러플레이트',
    desc: '대용량 깃허브 코드/기술 문서를 분석하여 1인 기업용 핵심 코드 추출',
    prompt: `당신은 1인 AI 비즈니스 소프트웨어 아키텍트입니다.
아래 제공된 대용량 오픈소스/라이브러리 구조를 분석하고, 1인 창업자가 바로 복사해서 서비스에 적용할 수 있는 핵심 보일러플레이트 코드와 API 연동 로드맵을 작성해주세요.

[분석 대상 코드/자료]:
`
  },
  {
    title: '2년 뒤 상용 니치 SaaS 가설 검증',
    desc: '거대 기업과 격차를 벌리는 바늘구멍 틈새 비즈니스 모델 도출',
    prompt: `[미션: 니치 & 벡터 거리 극대화]
기존 거대 AI 기업들이 건드리지 않는 좁고 뾰족한 '바늘구멍 틈새(Niche)' 비즈니스 아이템 3가지를 도출해주세요.
각 아이템마다:
1. 타겟 고객 및 고통점(Pain Point)
2. 2년 뒤 AI 성숙기 시장 독점 시나리오
3. 당장 오늘 밤 출시 가능한 MVP 구성 및 결제(수익화) 파이프라인
을 구체적으로 기획해주세요.`
  },
  {
    title: '롱폼 ➔ 숏폼 30개 대본 원샷 양산',
    desc: '긴 강의/영상 텍스트에서 바이럴 릴스/쇼츠 대본 대량 추출',
    prompt: `[미션: 숏폼 바이럴 마케팅 공장]
아래 제공된 긴 텍스트/영상 스크립트를 분석하여, 유튜브 쇼츠 및 인스타 릴스에 최적화된 30초 숏폼 대본 5개를 작성해주세요.
각 대본은:
- 0~3초: 도파민 터지는 후킹 오프닝
- 4~25초: 핵심 인사이트 & 반전 전달
- 26~30초: 댓글 유도 및 명확한 행동 촉구(CTA)
포맷으로 구성해주세요.`
  },
  {
    title: '피지컬 AI & LeRobot 로보틱스 파이프라인',
    desc: 'HuggingFace LeRobot 기반 로봇 조종 및 데이터 수집 파이썬 코드',
    prompt: `[미션: 피지컬 AI LeRobot 실전 코드]
HuggingFace LeRobot을 활용하여 로봇 암 조종 및 텔레오퍼레이션(원격 조작) 데이터를 기록하고 학습 데이터셋으로 변환하는 실전 파이썬 스크립트와 워크플로우를 단계별로 작성해주세요.`
  }
];

// 코드 블록 복사 지원 컴포넌트
function CodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="claude-codeblock">
      <div className="claude-codeblock-header">
        <span className="claude-codeblock-lang">{language || 'code'}</span>
        <button className="claude-codeblock-copy" onClick={handleCopy}>
          {copied ? <Check size={12} style={{ color: '#16a34a' }} /> : <Copy size={12} />}
          <span>{copied ? '복사됨' : '코드 복사'}</span>
        </button>
      </div>
      <pre className="claude-codeblock-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// 리치 마크다운 렌더러
function ClaudeMarkdownRenderer({ text }) {
  if (!text) return null;

  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div>
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const firstLineEnd = part.indexOf('\n');
          const language = part.slice(3, firstLineEnd).trim();
          const code = part.slice(firstLineEnd + 1, -3);
          return <CodeBlock key={index} language={language} code={code} />;
        }

        const lines = part.split('\n');
        return (
          <div key={index}>
            {lines.map((line, lIdx) => {
              const trimmed = line.trim();
              if (trimmed.startsWith('# ')) {
                return <h1 key={lIdx} style={{ fontSize: '18px', fontWeight: 700, margin: '14px 0 6px 0', fontFamily: 'Georgia, serif' }}>{trimmed.replace('# ', '')}</h1>;
              }
              if (trimmed.startsWith('## ')) {
                return <h2 key={lIdx} style={{ fontSize: '16px', fontWeight: 700, margin: '12px 0 4px 0', fontFamily: 'Georgia, serif' }}>{trimmed.replace('## ', '')}</h2>;
              }
              if (trimmed.startsWith('### ')) {
                return <h3 key={lIdx} style={{ fontSize: '14px', fontWeight: 700, margin: '10px 0 4px 0' }}>{trimmed.replace('### ', '')}</h3>;
              }
              if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                return <li key={lIdx} style={{ marginLeft: '18px', marginBottom: '4px' }}>{trimmed.slice(2)}</li>;
              }
              if (/^\d+\.\s/.test(trimmed)) {
                return <div key={lIdx} style={{ margin: '4px 0 4px 6px' }}>{trimmed}</div>;
              }
              if (trimmed.startsWith('> ')) {
                return <blockquote key={lIdx} style={{ borderLeft: '3px solid #d97757', paddingLeft: '12px', margin: '8px 0', color: 'var(--claude-text-muted)', fontStyle: 'italic' }}>{trimmed.slice(2)}</blockquote>;
              }
              if (!trimmed) {
                return <div key={lIdx} style={{ height: '8px' }} />;
              }
              return <p key={lIdx} style={{ margin: '4px 0', lineHeight: '1.65' }}>{line}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
}

export default function OxAlphaStudio() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openrouter_api_key') || '');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('oxalpha_sessions');
      return saved ? JSON.parse(saved) : [
        {
          id: 'default-1',
          title: '움직이는그림사전 프로젝트',
          date: '2026-08-25',
          messages: []
        }
      ];
    } catch {
      return [];
    }
  });
  const [currentSessionId, setCurrentSessionId] = useState('default-1');

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [expandedThinking, setExpandedThinking] = useState({});
  const [attachedFiles, setAttachedFiles] = useState([]);
  const abortControllerRef = useRef(null);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    localStorage.setItem('oxalpha_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleSaveKey = () => {
    const cleanKey = tempApiKey.trim();
    if (!cleanKey) {
      alert('OpenRouter API 키를 입력해주세요! (sk-or-v1-...)');
      return;
    }
    localStorage.setItem('openrouter_api_key', cleanKey);
    setApiKey(cleanKey);
    setShowSettingsModal(false);
    setError('');
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setTempApiKey(text.trim());
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleStartNewChat = () => {
    if (loading && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const newId = Date.now().toString();
    const newSession = { id: newId, title: '새로운 프로젝트 대화', date: new Date().toLocaleDateString(), messages: [] };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newId);
    setMessages([]);
    setInput('');
    setError('');
    setAttachedFiles([]);
    if (window.innerWidth <= 768) {
      setMobileSidebarOpen(false);
    }
  };

  const handleLoadSession = (session) => {
    if (loading && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setCurrentSessionId(session.id);
    setMessages(session.messages || []);
    if (window.innerWidth <= 768) {
      setMobileSidebarOpen(false);
    }
  };

  const handleDeleteSession = (e, sessionId) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== sessionId);
    setSessions(updated);
    if (currentSessionId === sessionId) {
      handleStartNewChat();
    }
  };

  const handleSelectPreset = (preset) => {
    setInput(preset.prompt);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setAttachedFiles(prev => [...prev, { name: file.name, size: `${(file.size / 1024).toFixed(1)} KB`, content }]);
      }
    };
    reader.readAsText(file);
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
    }
  };

  // 실시간 스트리밍 전송 로직 (SSE Streaming)
  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    if (!apiKey) {
      setShowSettingsModal(true);
      return;
    }

    let fullInput = input;
    if (attachedFiles.length > 0) {
      const filesContext = attachedFiles.map(f => `[첨부 파일: ${f.name}]\n${f.content}`).join('\n\n');
      fullInput = `${input}\n\n${filesContext}`;
    }

    const userMessage = { 
      role: 'user', 
      content: input,
      files: [...attachedFiles]
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setAttachedFiles([]);
    setLoading(true);
    setError('');

    const assistantIndex = newMessages.length;
    const initialAssistantMsg = { role: 'assistant', content: '', reasoning: '' };
    setMessages([...newMessages, initialAssistantMsg]);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const apiMessages = [
        {
          role: 'system',
          content: '당신은 Claude와 100% 동일한 깊이 있고 따뜻하며 정밀한 최고 수준의 AI 어시스턴트입니다. 한국어로 풍부하고 명확한 구조화된 답변을 제공합니다.'
        },
        ...newMessages.map(m => ({ role: m.role, content: m.content }))
      ];

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Claude-style Ox Alpha Studio',
          'Content-Type': 'application/json',
        },
        signal: abortController.signal,
        body: JSON.stringify({
          model: 'stealth/ox-alpha',
          stream: true,
          messages: apiMessages
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const msg = errData.error?.message || `요청 실패 (상태 코드: ${res.status})`;
        if (res.status === 429) {
          throw new Error('전 세계 트래픽 폭주로 일시적 대기열에 걸렸습니다. 10초 뒤 다시 전송해주세요!');
        }
        throw new Error(msg);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let streamedContent = '';
      let streamedReasoning = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith(':')) continue;
          if (trimmed === 'data: [DONE]') break;

          if (trimmed.startsWith('data: ')) {
            try {
              const parsed = JSON.parse(trimmed.slice(6));
              const delta = parsed.choices?.[0]?.delta;
              
              if (delta?.reasoning) {
                streamedReasoning += delta.reasoning;
              }
              if (delta?.content) {
                streamedContent += delta.content;
              }

              let displayContent = streamedContent;
              let displayReasoning = streamedReasoning;

              if (streamedContent.includes('<think>')) {
                if (streamedContent.includes('</think>')) {
                  const match = streamedContent.match(/<think>([\s\S]*?)<\/think>/);
                  if (match) {
                    displayReasoning = match[1].trim();
                    displayContent = streamedContent.replace(/<think>[\s\S]*?<\/think>/, '').trim();
                  }
                } else {
                  displayReasoning = streamedContent.replace('<think>', '').trim();
                  displayContent = '';
                }
              }

              setMessages(prev => {
                const updated = [...prev];
                updated[assistantIndex] = {
                  role: 'assistant',
                  content: displayContent,
                  reasoning: displayReasoning
                };
                return updated;
              });

            } catch (e) {
              // ignore
            }
          }
        }
      }

      // Save session
      setMessages(prev => {
        const finalMessages = [...prev];
        let sId = currentSessionId;
        const title = userMessage.content.slice(0, 20) + '...';
        setSessions(s => s.map(item => item.id === sId ? { ...item, title: item.title === '움직이는그림사전 프로젝트' ? item.title : title, messages: finalMessages } : item));
        return finalMessages;
      });

    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Generation stopped');
      } else {
        console.error(err);
        setError(err.message);
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyMessage = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const currentSession = sessions.find(s => s.id === currentSessionId);

  return (
    <div className={`claude-app ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* 📂 클로드 Mac 데스크톱 사이드바 (대표님 캡처 100% 동일) */}
      <aside className={`claude-sidebar ${!sidebarOpen ? 'collapsed' : ''} ${mobileSidebarOpen ? 'open' : ''}`}>
        {/* Mac Window Dots */}
        <div className="claude-mac-dots">
          <div className="claude-mac-dot red" />
          <div className="claude-mac-dot yellow" />
          <div className="claude-mac-dot green" />
        </div>

        {/* Top Tab Switcher: [홈] [</> Code] */}
        <div className="claude-top-tabs">
          <button className="claude-top-tab-btn active">
            <Home size={13} />
            <span>홈</span>
          </button>
          <button className="claude-top-tab-btn">
            <Code size={13} />
            <span>Code</span>
          </button>
        </div>

        {/* + 새로 생성 ⌘N */}
        <button className="claude-btn-newchat" onClick={handleStartNewChat}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={15} style={{ color: 'var(--claude-terracotta)' }} />
            <span>새로 생성</span>
          </span>
          <span className="claude-kbd-shortcut">⌘N</span>
        </button>

        {/* Sidebar Nav Links */}
        <div className="claude-nav-links">
          <button className="claude-nav-item">
            <Folder size={14} style={{ color: 'var(--claude-text-muted)' }} />
            <span>프로젝트</span>
          </button>
          <button className="claude-nav-item">
            <Box size={14} style={{ color: 'var(--claude-text-muted)' }} />
            <span>아티팩트</span>
          </button>
          <button className="claude-nav-item">
            <Clock size={14} style={{ color: 'var(--claude-text-muted)' }} />
            <span>예정됨</span>
          </button>
          <button className="claude-nav-item">
            <SendIcon size={14} style={{ color: 'var(--claude-text-muted)' }} />
            <span>발송</span>
            <span className="claude-badge-beta">베타</span>
          </button>
          <button className="claude-nav-item">
            <Sliders size={14} style={{ color: 'var(--claude-text-muted)' }} />
            <span>사용자 지정</span>
          </button>
        </div>

        {/* 고정된 프로젝트 목록 */}
        <div className="claude-projects-header">
          <span>고정됨</span>
          <Plus size={13} style={{ cursor: 'pointer' }} onClick={handleStartNewChat} />
        </div>

        <div className="claude-nav-links" style={{ flex: 1, overflowY: 'auto' }}>
          {sessions.map((s) => (
            <button
              key={s.id}
              className={`claude-project-item ${currentSessionId === s.id ? 'active' : ''}`}
              onClick={() => handleLoadSession(s)}
            >
              <div className={`claude-project-dot ${currentSessionId === s.id ? '' : 'ring'}`} />
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.title}</span>
              <Trash2 
                size={12} 
                style={{ opacity: 0.3, cursor: 'pointer' }}
                onClick={(e) => handleDeleteSession(e, s.id)}
              />
            </button>
          ))}
        </div>

        {/* Sidebar Footer: LM 대표 • Pro */}
        <div className="claude-sidebar-bottom">
          <div className="claude-profile-pill" onClick={() => setShowSettingsModal(true)}>
            <div className="claude-avatar-circle">LM</div>
            <div>
              <div className="claude-profile-name">대표 • Pro</div>
              <div className="claude-profile-sub">{apiKey ? 'Ox Alpha 1M 연동' : '키 입력 대기'}</div>
            </div>
          </div>
          <button 
            className="claude-round-tool-btn" 
            style={{ width: '26px', height: '26px' }}
            onClick={() => setIsDarkMode(!isDarkMode)}
            title={isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
          >
            {isDarkMode ? <Sun size={13} /> : <Moon size={13} />}
          </button>
        </div>
      </aside>

      {/* 💬 메인 뷰 (대표님 캡처 100% 동일) */}
      <main className="claude-main-view">
        {/* 상단 Breadcrumb Top Bar */}
        <header className="claude-top-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              className="claude-round-tool-btn"
              style={{ width: '28px', height: '28px' }}
              onClick={() => {
                if (window.innerWidth <= 768) {
                  setMobileSidebarOpen(!mobileSidebarOpen);
                } else {
                  setSidebarOpen(!sidebarOpen);
                }
              }}
            >
              <PanelLeft size={14} />
            </button>
            <button className="claude-project-title-btn" onClick={() => setShowSettingsModal(true)}>
              <span>☁️ {currentSession?.title || '움직이는그림사전 프로젝트'}</span>
              <ChevronDown size={14} style={{ color: 'var(--claude-text-dim)' }} />
            </button>
          </div>

          <div className="claude-top-actions">
            <button 
              className="claude-file-btn" 
              onClick={() => setShowSettingsModal(true)}
              style={{ fontSize: '11px', padding: '4px 10px' }}
            >
              <Key size={12} style={{ color: apiKey ? '#16a34a' : '#d97757' }} />
              <span>{apiKey ? 'API 키 활성' : 'API 키 설정'}</span>
            </button>
          </div>
        </header>

        {/* 메시지 스크롤 바디 */}
        <div className="claude-scroll-body">
          <div className="claude-content-max">
            {/* 상단 기본 대표님 환영 메시지 카드 */}
            <div style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--claude-text-main)' }}>
              대표님 권장 지침만 표시해뒀습니다 — 시험 1편 고르기, 압박 판정, 편당 단어 8개나 12개냐, 273개 처리 방향. 나머지는 코다리가 알아서 굴립니다.
              <br /><br />
              수요일 목표까지만 가도 **영상 한 편 안 만들고 소화율이 34% ➔ 58%**가 됩니다.
              <br /><br />
              크레딧 아끼겠습니다. 필요하실 때 부르십시오.
            </div>

            {/* 대표님 화면에 있던 첨부파일 카드들 (코다리 주간지시서, Verify prompt) */}
            <div className="claude-file-card">
              <div className="claude-file-info">
                <div className="claude-file-icon-box">
                  <FileText size={18} />
                </div>
                <div>
                  <div className="claude-file-name">코다리 주간지시서 20260821 이번주</div>
                  <div className="claude-file-meta">문서 • MD</div>
                </div>
              </div>
              <button className="claude-file-btn">
                <Download size={13} />
                <span>다운로드 및 열기</span>
              </button>
            </div>

            <div className="claude-file-card">
              <div className="claude-file-info">
                <div className="claude-file-icon-box">
                  <Code2 size={18} />
                </div>
                <div>
                  <div className="claude-file-name">Verify prompt</div>
                  <div className="claude-file-meta">PY</div>
                </div>
              </div>
              <button className="claude-file-btn">
                <Folder size={13} />
                <span>폴더에서 보기</span>
              </button>
            </div>

            {/* 클로드 시그니처 테라코타 방사형 썬버스트 아이콘 */}
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <svg className="claude-sunburst" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C12.5523 2 13 2.44772 13 3V5C13 5.55228 12.5523 6 12 6C11.4477 6 11 5.55228 11 5V3C11 2.44772 11.4477 2 12 2ZM12 18C12.5523 18 13 18.4477 13 19V21C13 21.5523 12.5523 22 12 22C11.4477 22 11 21.5523 11 21V19C11 18.4477 11.4477 18 12 18ZM4.92893 4.92893C5.31946 4.53841 5.95262 4.53841 6.34315 4.92893L7.75736 6.34315C8.14788 6.73367 8.14788 7.36683 7.75736 7.75736C7.36683 8.14788 6.73367 8.14788 6.34315 7.75736L4.92893 6.34315C4.53841 5.95262 4.53841 5.31946 4.92893 4.92893ZM16.2426 16.2426C16.6332 15.8521 17.2663 15.8521 17.6569 16.2426L19.0711 17.6569C19.4616 18.0474 19.4616 18.6805 19.0711 19.0711C18.6805 19.4616 18.0474 19.4616 17.6569 19.0711L16.2426 17.6569C15.8521 17.2663 15.8521 16.6332 16.2426 16.2426ZM2 12C2 11.4477 2.44772 11 3 11H5C5.55228 11 6 11.4477 6 12C6 12.5523 5.55228 13 5 13H3C2.44772 13 2 12.5523 2 12ZM18 12C18 11.4477 18.4477 11 19 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H19C18.4477 13 18 12.5523 18 12ZM7.75736 16.2426C8.14788 16.6332 8.14788 17.2663 7.75736 17.6569L6.34315 19.0711C5.95262 19.4616 5.31946 19.4616 4.92893 19.0711C4.53841 18.6805 4.53841 18.0474 4.92893 17.6569L6.34315 16.2426C6.73367 15.8521 7.36683 15.8521 7.75736 16.2426ZM19.0711 4.92893C19.4616 5.31946 19.4616 5.95262 19.0711 6.34315L17.6569 7.75736C17.2663 8.14788 16.6332 8.14788 16.2426 7.75736C15.8521 7.36683 15.8521 6.73367 16.2426 6.34315L17.6569 4.92893Z" />
              </svg>
            </div>

            {/* 메시지 리스트 */}
            {messages.map((msg, idx) => (
              <div key={idx} className={`claude-msg-row ${msg.role}`}>
                {msg.role === 'assistant' && (
                  <div style={{ color: 'var(--claude-terracotta)', marginTop: '2px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                    </svg>
                  </div>
                )}

                <div className={msg.role === 'user' ? 'claude-msg-user-bubble' : 'claude-msg-assistant-body'}>
                  {/* 생각 과정 (Thinking Process) */}
                  {msg.reasoning && (
                    <div className="claude-thought-accordion">
                      <div className="claude-thought-header" onClick={() => setExpandedThinking(p => ({ ...p, [idx]: !p[idx] }))}>
                        <Sparkles size={12} style={{ color: 'var(--claude-terracotta)' }} />
                        <span>생각 과정 ({expandedThinking[idx] ? '접기' : '자세히 보기'})</span>
                        {expandedThinking[idx] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </div>
                      {expandedThinking[idx] && (
                        <div className="claude-thought-text">
                          {msg.reasoning}
                        </div>
                      )}
                    </div>
                  )}

                  <ClaudeMarkdownRenderer text={msg.content} />

                  {msg.role === 'assistant' && msg.content && (
                    <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                      <button 
                        className="claude-file-btn" 
                        style={{ padding: '3px 8px', fontSize: '11px' }}
                        onClick={() => handleCopyMessage(msg.content, idx)}
                      >
                        {copiedIndex === idx ? <Check size={12} style={{ color: '#16a34a' }} /> : <Copy size={12} />}
                        <span>{copiedIndex === idx ? '복사됨' : '복사'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="claude-msg-row assistant">
                <div style={{ color: 'var(--claude-terracotta)' }}>
                  <RefreshCw size={18} className="spin-icon" />
                </div>
                <div style={{ fontSize: '13px', color: 'var(--claude-text-muted)' }}>
                  Ox Alpha (100만 토큰 엔진)가 실시간으로 생각하고 작성 중입니다...
                </div>
              </div>
            )}

            {error && (
              <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', color: '#dc2626', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ⌨️ 플로팅 입력 카드 (대표님 캡처 100% 동일) */}
        <div className="claude-float-input-container">
          <div className="claude-input-card-mac">
            {/* Top Banner: 주간 한도 임박 / 1M 토큰 뱃지 */}
            <div className="claude-input-top-banner">
              <span>주간 한도 임박 (Ox Alpha 1M 토큰 엔진 연동)</span>
              <span className="claude-link-banner" onClick={() => setShowSettingsModal(true)}>
                사용량 추가 구매 (API 키 설정) ✕
              </span>
            </div>

            {/* Attached file badges if any */}
            {attachedFiles.length > 0 && (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                {attachedFiles.map((f, i) => (
                  <div key={i} style={{ background: 'var(--claude-sidebar)', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid var(--claude-border)' }}>
                    <FileText size={11} />
                    <span>{f.name}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              className="claude-textarea-mac"
              placeholder="메시지를 입력하세요..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />

            {/* Bottom Actions Bar */}
            <div className="claude-input-actions-bar">
              <div className="claude-action-left-group">
                <input
                  type="file"
                  id="claude-mac-file"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                  accept=".txt,.js,.jsx,.ts,.tsx,.py,.json,.md,.html,.css,.csv"
                />
                <label htmlFor="claude-mac-file" className="claude-round-tool-btn" title="파일 첨부">
                  <Plus size={15} />
                </label>

                <button 
                  className="claude-round-tool-btn" 
                  onClick={() => handleSelectPreset(CLAUDE_PRESETS[0])}
                  title="1M 오픈소스 분석 프리셋"
                >
                  <Box size={14} />
                </button>

                <button className="claude-mode-pill">
                  <span>✋ 수동</span>
                  <ChevronDown size={12} />
                </button>
              </div>

              <div className="claude-action-right-group">
                <button className="claude-model-pill-btn" onClick={() => setShowSettingsModal(true)}>
                  <span>Opus 5 높음 (Ox Alpha)</span>
                  <ChevronDown size={12} />
                </button>

                <button className="claude-round-tool-btn" title="음성 입력">
                  <Mic size={14} />
                </button>

                {loading ? (
                  <button className="claude-send-btn-mac" onClick={handleStopGeneration} style={{ backgroundColor: '#dc2626' }}>
                    <StopCircle size={15} />
                  </button>
                ) : (
                  <button 
                    className="claude-send-btn-mac" 
                    onClick={handleSendMessage}
                    disabled={!input.trim()}
                  >
                    <ArrowUp size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="claude-disclaimer-mac">
            Claude는 AI이므로 실수할 수 있습니다. 응답을 다시 한번 확인해 주세요. 의견 보내기
          </div>
        </div>
      </main>

      {/* ⚙️ 설정 모달 */}
      {showSettingsModal && (
        <div className="claude-modal-overlay" onClick={() => setShowSettingsModal(false)}>
          <div className="claude-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 className="claude-modal-title" style={{ margin: 0 }}>OpenRouter API 키 등록</h3>
              <button 
                onClick={() => setShowSettingsModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--claude-text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>
            
            <p style={{ fontSize: '12px', color: 'var(--claude-text-muted)', lineHeight: 1.5, margin: '0 0 16px 0' }}>
              아까 OpenRouter에서 복사하신 키(<code>sk-or-v1-...</code>)를 아래 입력창에 넣으시면 브라우저에 안전하게 저장됩니다.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--claude-text-main)' }}>OpenRouter API 키</label>
                <button 
                  type="button"
                  onClick={handlePasteFromClipboard}
                  style={{ background: 'transparent', border: 'none', color: 'var(--claude-terracotta)', fontSize: '11px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                >
                  <ClipboardPaste size={12} />
                  <span>클립보드에서 붙여넣기</span>
                </button>
              </div>

              <input
                type="password"
                className="claude-modal-input"
                placeholder="sk-or-v1-..."
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveKey();
                  }
                }}
                autoFocus
              />
            </div>

            <div className="claude-modal-btns">
              <button 
                className="claude-file-btn" 
                onClick={() => setShowSettingsModal(false)}
              >
                닫기
              </button>
              <button 
                className="claude-file-btn" 
                style={{ backgroundColor: 'var(--claude-terracotta)', color: 'white', borderColor: 'var(--claude-terracotta)' }}
                onClick={handleSaveKey}
              >
                저장 및 바로 시작
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
