import React, { useState, useEffect, useRef } from 'react';
import './OxAlphaStudio.css';
import { 
  Sparkles, Send, Paperclip, ChevronDown, ChevronUp, 
  Copy, Check, Plus, MessageSquare, Settings, Key, 
  PanelLeft, Shield, ArrowUp, RefreshCw, AlertCircle, Trash2, StopCircle
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

export default function OxAlphaStudio() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openrouter_api_key') || '');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('oxalpha_sessions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [currentSessionId, setCurrentSessionId] = useState(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [expandedThinking, setExpandedThinking] = useState({});
  const abortControllerRef = useRef(null);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Save sessions to localStorage
  useEffect(() => {
    localStorage.setItem('oxalpha_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Handle Textarea height adjustment
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleSaveKey = () => {
    localStorage.setItem('openrouter_api_key', tempApiKey.trim());
    setApiKey(tempApiKey.trim());
    setShowSettingsModal(false);
    setError('');
  };

  const handleStartNewChat = () => {
    if (loading && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([]);
    setCurrentSessionId(null);
    setInput('');
    setError('');
    if (window.innerWidth <= 768) {
      setMobileSidebarOpen(false);
    }
  };

  const handleLoadSession = (session) => {
    if (loading && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setCurrentSessionId(session.id);
    setMessages(session.messages);
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
        setInput(prev => `${prev}\n\n[첨부 파일: ${file.name}]\n${content}`);
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

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError('');

    // 스트리밍을 받을 임시 어시스턴트 메시지 추가
    const assistantIndex = newMessages.length;
    const initialAssistantMsg = { role: 'assistant', content: '', reasoning: '' };
    setMessages([...newMessages, initialAssistantMsg]);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const apiMessages = [
        {
          role: 'system',
          content: '당신은 Claude와 동일한 품격 있고 친절하며 정밀한 최고 수준의 AI 어시스턴트입니다. 한국어로 깊이 있고 명확하며 구조화된 답변을 제공합니다.'
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

              // <think> 태그 파싱
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
                  // 아직 think 태그가 안 닫힌 경우
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
              // JSON 파싱 무시
            }
          }
        }
      }

      // 최종 메시지 상태 확정 및 세션 저장
      setMessages(prev => {
        const finalMessages = [...prev];
        let sId = currentSessionId;
        if (!sId) {
          sId = Date.now().toString();
          setCurrentSessionId(sId);
          const title = userMessage.content.slice(0, 24) + '...';
          setSessions(s => [{ id: sId, title, messages: finalMessages, date: new Date().toLocaleDateString() }, ...s]);
        } else {
          setSessions(s => s.map(item => item.id === sId ? { ...item, messages: finalMessages } : item));
        }
        return finalMessages;
      });

    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('User stopped generation');
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

  const toggleThinking = (idx) => {
    setExpandedThinking(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="claude-layout">
      {/* 📂 클로드 좌측 사이드바 */}
      <aside className={`claude-sidebar ${!sidebarOpen ? 'collapsed' : ''} ${mobileSidebarOpen ? 'open' : ''}`}>
        <button className="claude-new-chat-btn" onClick={handleStartNewChat}>
          <Plus size={16} style={{ color: 'var(--claude-terracotta)' }} />
          <span>새 대화 시작</span>
        </button>

        <div className="claude-sidebar-section-title">최근 대화 목록</div>
        <div className="claude-history-list">
          {sessions.length === 0 ? (
            <div style={{ padding: '16px 8px', fontSize: '12px', color: 'var(--claude-text-dim)', textAlign: 'center' }}>
              기록된 대화가 없습니다.
            </div>
          ) : (
            sessions.map((s) => (
              <div
                key={s.id}
                className={`claude-history-item ${currentSessionId === s.id ? 'active' : ''}`}
                onClick={() => handleLoadSession(s)}
              >
                <MessageSquare size={14} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.title}</span>
                <Trash2 
                  size={12} 
                  style={{ opacity: 0.4, cursor: 'pointer' }}
                  onClick={(e) => handleDeleteSession(e, s.id)}
                />
              </div>
            ))
          )}
        </div>

        <div className="claude-sidebar-footer">
          <div className="claude-user-profile" onClick={() => setShowSettingsModal(true)} style={{ cursor: 'pointer' }}>
            <div className="claude-avatar-badge">K</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: 'var(--claude-text-main)' }}>대표님 (코다리 Hub)</div>
              <div style={{ fontSize: '11px', color: apiKey ? '#4ade80' : '#f59e0b' }}>
                {apiKey ? 'OpenRouter 연결됨 (Free)' : 'API 키 등록 필요'}
              </div>
            </div>
            <Settings size={14} />
          </div>
        </div>
      </aside>

      {/* 💬 클로드 메인 대화 영역 */}
      <main className="claude-main">
        {/* 상단 툴바 */}
        <header className="claude-navbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              className="claude-icon-btn" 
              onClick={() => {
                if (window.innerWidth <= 768) {
                  setMobileSidebarOpen(!mobileSidebarOpen);
                } else {
                  setSidebarOpen(!sidebarOpen);
                }
              }}
            >
              <PanelLeft size={18} />
            </button>
            <div className="claude-model-selector" onClick={() => setShowSettingsModal(true)}>
              <span>Ox Alpha (1M Context)</span>
              <span className="claude-model-badge">STEALTH</span>
              <ChevronDown size={14} style={{ color: 'var(--claude-text-dim)' }} />
            </div>
          </div>

          <div className="claude-key-status" onClick={() => setShowSettingsModal(true)}>
            <Key size={13} style={{ color: apiKey ? '#4ade80' : '#f59e0b' }} />
            <span>{apiKey ? 'API 키 활성 (무료 스트리밍)' : '키 설정하기'}</span>
          </div>
        </header>

        {/* 메시지 스크롤 영역 */}
        <div className="claude-messages-container">
          {messages.length === 0 ? (
            /* 빈 화면: 클로드 시그니처 웰컴 화면 */
            <div className="claude-hero-welcome">
              <svg className="claude-star-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
              </svg>
              <h1 className="claude-hero-title">좋은 하루입니다, 대표님.</h1>
              <p className="claude-hero-subtitle">
                100만 토큰 컨텍스트와 실시간 스트리밍 추론을 지원하는 <strong>Ox Alpha</strong>입니다. 무엇을 도와드릴까요?
              </p>

              <div className="claude-preset-grid">
                {CLAUDE_PRESETS.map((preset, idx) => (
                  <div key={idx} className="claude-preset-card" onClick={() => handleSelectPreset(preset)}>
                    <div className="claude-preset-card-title">{preset.title}</div>
                    <div className="claude-preset-card-desc">{preset.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* 메시지 리스트 */
            <div className="claude-messages-inner">
              {messages.map((msg, idx) => (
                <div key={idx} className={`claude-message-row ${msg.role}`}>
                  {msg.role === 'assistant' && (
                    <div className="claude-message-avatar assistant">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                      </svg>
                    </div>
                  )}

                  <div className="claude-message-bubble">
                    {/* 생각 과정 (Thinking Process) 아코디언 */}
                    {msg.reasoning && (
                      <div className="claude-thinking-block">
                        <div className="claude-thinking-header" onClick={() => toggleThinking(idx)}>
                          <Sparkles size={13} style={{ color: 'var(--claude-terracotta)' }} />
                          <span>심층 추론 과정 ({expandedThinking[idx] ? '접기' : '자세히 보기'})</span>
                          {expandedThinking[idx] ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </div>
                        {expandedThinking[idx] && (
                          <div className="claude-thinking-body">
                            {msg.reasoning}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="claude-markdown">
                      {msg.content || (loading && idx === messages.length - 1 ? (
                        <span style={{ color: 'var(--claude-text-muted)' }}>생각 중...</span>
                      ) : null)}
                    </div>

                    {msg.role === 'assistant' && msg.content && (
                      <div className="claude-msg-actions">
                        <button className="claude-icon-btn" onClick={() => handleCopyMessage(msg.content, idx)}>
                          {copiedIndex === idx ? (
                            <>
                              <Check size={13} style={{ color: '#4ade80' }} />
                              <span style={{ color: '#4ade80' }}>복사됨</span>
                            </>
                          ) : (
                            <>
                              <Copy size={13} />
                              <span>복사</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {error && (
                <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', color: '#f87171', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* ⌨️ 클로드 시그니처 하단 입력 카드 */}
        <div className="claude-input-wrapper">
          <div className="claude-input-card">
            <textarea
              ref={textareaRef}
              className="claude-textarea"
              placeholder="Ox Alpha에게 무엇이든 물어보세요... (대용량 코드, 문서, 기획안 등)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />

            <div className="claude-input-bottom-bar">
              <div className="claude-input-tools">
                <input
                  type="file"
                  id="claude-file-upload"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                  accept=".txt,.js,.jsx,.ts,.tsx,.py,.json,.md,.html,.css,.csv"
                />
                <label htmlFor="claude-file-upload" className="claude-tool-pill">
                  <Paperclip size={13} />
                  <span>파일 첨부</span>
                </label>
              </div>

              {loading ? (
                <button
                  className="claude-send-btn"
                  onClick={handleStopGeneration}
                  style={{ backgroundColor: '#ef4444' }}
                  title="생성 중단"
                >
                  <StopCircle size={16} />
                </button>
              ) : (
                <button
                  className="claude-send-btn"
                  onClick={handleSendMessage}
                  disabled={!input.trim()}
                >
                  <ArrowUp size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="claude-disclaimer">
            Ox Alpha (Stealth Model) • 1M Context Window • 실시간 스트리밍 연동
          </div>
        </div>
      </main>

      {/* ⚙️ API 키 설정 모달 */}
      {showSettingsModal && (
        <div className="claude-modal-overlay" onClick={() => setShowSettingsModal(false)}>
          <div className="claude-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="claude-modal-title">OpenRouter API 설정</h3>
            <p style={{ fontSize: '12px', color: 'var(--claude-text-muted)', lineHeight: 1.5, margin: 0 }}>
              발급받으신 OpenRouter API 키(<code>sk-or-v1-...</code>)를 입력하시면 브라우저에 안전하게 저장되며 즉시 무료로 Ox Alpha 모델을 실시간 스트리밍으로 사용하실 수 있습니다.
            </p>

            <input
              type="password"
              className="claude-modal-input"
              placeholder="sk-or-v1-..."
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
            />

            <div className="claude-modal-btns">
              <button 
                className="claude-tool-pill" 
                onClick={() => setShowSettingsModal(false)}
              >
                취소
              </button>
              <button 
                className="claude-tool-pill" 
                style={{ backgroundColor: 'var(--claude-terracotta)', color: 'white', borderColor: 'var(--claude-terracotta)' }}
                onClick={handleSaveKey}
              >
                저장 및 연결
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
