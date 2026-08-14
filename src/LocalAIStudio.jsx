import React, { useState, useRef, useEffect } from 'react';
import './LocalAIStudio.css';
import { Bot, MessageSquare, Video, Settings, Send, Terminal, Zap, Code, LayoutTemplate } from 'lucide-react';

export default function LocalAIStudio({ onExit }) {
  const [input, setInput] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'system',
      content: '안녕하세요! 현재 **LM Studio (`http://localhost:1234/v1`)** 로컬 서버와 완벽히 연동되어 있습니다. 원하시는 질문이나 코딩 요청을 자유롭게 입력해 보세요!'
    }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (customText = null) => {
    const textToSend = customText || input;
    if (!textToSend.trim()) return;

    const newMessages = [...messages, { role: 'user', content: textToSend }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:1234/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemma-4-e2b',
          messages: newMessages.map(m => ({ role: m.role === 'system' ? 'assistant' : m.role, content: m.content })),
          temperature: parseFloat(temperature)
        })
      });

      if (!response.ok) {
        throw new Error(`API 오류: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const reply = data.choices[0].message.content;

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `**⚠️ 연결 오류 발생**\n\nLM Studio 서버에 연결할 수 없습니다. (\`${err.message}\`)\n\n1. LM Studio가 실행 중인지 확인해주세요.\n2. LM Studio에서 'Local Server'가 켜져 있는지(1234번 포트) 확인해주세요.` 
      }]);
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

  return (
    <div className="local-ai-container">
      {/* 사이드바 */}
      <div className="local-sidebar">
        <div className="local-brand">
          <div className="brand-icon">
            <Bot size={24} />
          </div>
          <div className="brand-text">
            <h2>Local AI Studio</h2>
            <span>v1.0 Pro</span>
          </div>
        </div>

        <div className="local-nav">
          <div className="nav-item active">
            <MessageSquare size={18} />
            LM Chat Studio
          </div>
          <div className="nav-item" onClick={onExit}>
            <Video size={18} />
            AI Video Studio (Exit)
          </div>
          <div className="nav-item">
            <Settings size={18} />
            API Settings
          </div>
        </div>

        <div style={{ flex: 1 }}></div>

        <div className="local-status-card">
          <div className="status-header">
            <div className="status-dot"></div>
            LM Studio Running
          </div>
          <div className="status-endpoint">http://localhost:1234/v1</div>
          <div className="status-model">
            <Bot size={14} /> google/gemma-4-e2b
          </div>
        </div>
      </div>

      {/* 메인 채팅 영역 */}
      <div className="local-main">
        <div className="main-header">
          <div className="header-title">
            <h3>LM Chat Studio</h3>
            <p>LM Studio 로컬 LLM 서버와 실시간으로 오프라인/로컬 대화</p>
          </div>
          <div className="model-selector">
            <Bot size={16} color="#34d399" />
            google/gemma-4-e2b ▾
          </div>
        </div>

        <div className="chat-scroll-area">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.role === 'user' ? 'user' : ''}`}>
              <div className={`message-avatar ${msg.role === 'user' ? 'user-avatar' : msg.role === 'system' ? 'system-avatar' : 'ai-avatar'}`}>
                {msg.role === 'user' ? <Zap size={20} /> : <Bot size={20} />}
              </div>
              <div style={{ flex: 1 }}>
                <div className="message-sender" style={{ textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                  {msg.role === 'user' ? '사용자' : msg.role === 'system' ? 'Local AI Assistant' : 'Local AI (google/gemma-4-e2b)'}
                </div>
                <div className="message-content">
                  {msg.content.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i !== msg.content.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                  
                  {msg.role === 'system' && (
                    <div className="suggestion-chips">
                      <div className="chip" onClick={() => handleSend('파이썬 웹 크롤러 코드 작성해줘')}>
                        <Code size={14} /> 파이썬 웹 크롤러
                      </div>
                      <div className="chip" onClick={() => handleSend('최신 AI 동향 정리해줘')}>
                        <Zap size={14} /> AI 동향 정리
                      </div>
                      <div className="chip" onClick={() => handleSend('HTML/CSS 버튼 예제 만들어줘')}>
                        <LayoutTemplate size={14} /> HTML/CSS 버튼 예제
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="chat-message">
              <div className="message-avatar ai-avatar">
                <Bot size={20} />
              </div>
              <div>
                <div className="message-sender">Local AI (google/gemma-4-e2b)</div>
                <div className="message-content" style={{ opacity: 0.7 }}>
                  입력 스트림 분석 중... ⚡️
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area-container">
          <div className="settings-bar">
            <Terminal size={14} color="#6b7280" />
            <div className="temp-slider">
              <span>Temp: {temperature}</span>
              <input 
                type="range" 
                min="0" max="1" step="0.1" 
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
              />
            </div>
          </div>
          
          <div className="chat-input-box">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="LM Studio 로컬 모델에게 질문해보세요... (Shift+Enter 줄바꿈, Enter 전송)"
              rows={1}
            />
            <button 
              className="send-button" 
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
