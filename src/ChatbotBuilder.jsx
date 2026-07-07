import React, { useState, useEffect, useRef } from 'react';
import './ChatbotBuilder.css';
import { Sparkles, Settings, MessageSquare, Copy, Check, Code, HelpCircle, Loader2 } from 'lucide-react';

function ChatbotBuilder() {
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // 1. 상태 관리
  const [knowledge, setKnowledge] = useState(
    `[코다리 스터디 카페 이용안내]\n\n1. 운영 시간: 매일 오전 08:00 ~ 익일 오전 02:00 (연중무휴)\n2. 이용 요금:\n   - 2시간 권: 3,000원\n   - 4시간 권: 5,000원\n   - 1회 기가패스(당일 무제한): 10,000원\n   - 4주 기간권: 120,000원\n3. 무료 혜택: 고급 에스프레소 커피, 국산 티백 차, 고속 Wi-Fi, 프린트(개인 용지만 지참 시 무료)\n4. 주의 사항: 스터디룸 내부에서는 무소음 마우스/키보드 필수이며, 통화는 로비에서만 가능합니다.\n5. 예약 문의: 02-1234-5678 (대표 번호)`
  );
  
  const [botName, setBotName] = useState('코다리 카페 안내봇');
  const [welcomeMessage, setWelcomeMessage] = useState('안녕하세요! 코다리 스터디 카페 도우미입니다. 이용에 궁금한 점이 있으시면 무엇이든 물어보세요! 😊');
  const [themeColor, setThemeColor] = useState('#8b5cf6'); // 기본 보라색
  const [botAvatar, setBotAvatar] = useState('🤖'); // 기본 이모지

  // 채팅 상태
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', text: welcomeMessage }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);

  // 기타 UI 상태
  const [copied, setCopied] = useState(false);
  const chatEndRef = useRef(null);

  // 테마 색상 프리셋
  const colorPresets = [
    { value: '#8b5cf6', name: 'Vivid Violet' },
    { value: '#06b6d4', name: 'Neon Cyan' },
    { value: '#ec4899', name: 'Hot Pink' },
    { value: '#10b981', name: 'Mint Green' },
    { value: '#f59e0b', name: 'Amber Glow' }
  ];

  // 아바타 아이콘 프리셋
  const avatarPresets = ['🤖', '🐱', '☕', '💼', '👩‍💻', '🔮'];

  // 테마 변경 시 첫 웰컴메시지 리셋
  useEffect(() => {
    setChatHistory([
      { sender: 'bot', text: welcomeMessage }
    ]);
  }, [welcomeMessage]);

  // 스크롤 동기화
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, loadingChat]);

  // 임베드 스크립트 복사
  const handleCopyScript = () => {
    const scriptCode = `<!-- Connect AI Chatbot Widget -->\n<script \n  src="https://connectai.co/chatbot-widget.js"\n  data-bot-id="bot_kd_${Date.now().toString(36)}"\n  data-theme-color="${themeColor}"\n  data-bot-name="${botName}"\n  async>\n</script>`;
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 챗봇 답변 생성 (Gemini API)
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    if (loadingChat) return;

    const userMsg = { sender: 'user', text: chatInput };
    setChatHistory(prev => [...prev, userMsg]);
    const currentInput = chatInput;
    setChatInput('');
    setLoadingChat(true);

    if (!geminiApiKey) {
      setTimeout(() => {
        setChatHistory(prev => [
          ...prev,
          {
            sender: 'bot',
            text: '대표님, 현재 VITE_GEMINI_API_KEY 환경변수가 설정되어 있지 않사옵니다. 챗봇이 실제 응답하기 위해서는 API 키 세팅이 필요합니다.'
          }
        ]);
        setLoadingChat(false);
      }, 1000);
      return;
    }

    try {
      const prompt = `당신은 대표님이 방금 개설하신 챗봇 빌더를 통해 만들어진 인공지능 고객센터 에이전트 [${botName}]입니다.
다음 지식 베이스(Knowledge Base)의 팩트와 수치 정보에만 100% 엄격하게 기반하여 사용자의 질문에 답변해 주세요.

[중요 지침]:
1. 지식 베이스 문서에 존재하지 않거나, 답변할 수 없는 외부의 정보인 경우, 모르는 척 추측하여 답하지 말고 반드시 "죄송합니다. 제공된 지식 정보만으로는 안내해 드리기 어렵습니다. 대표번호(혹은 고객센터)로 직접 문의해 주시기 바랍니다."라는 뉘앙스로 정중하게 선을 그어 거절하십시오.
2. 답변은 친절하고 격식 있는 존댓말을 사용해 핵심만 명확하게 답변하세요.
3. 지식 베이스 이외의 정보는 절대 누설하거나 지어내지 마십시오.

[지식 베이스 문서]:
${knowledge}

[사용자의 질문]:
"${currentInput}"

답변을 작성해 주세요:`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      const data = await response.json();
      const answer = data.candidates[0].content.parts[0].text.trim();

      setChatHistory(prev => [...prev, { sender: 'bot', text: answer }]);
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [
        ...prev,
        {
          sender: 'bot',
          text: '죄송합니다. 서버 통신 중 오류가 발생하여 답변을 작성하지 못했습니다. 잠시 후 다시 시도해 주세요.'
        }
      ]);
    } finally {
      setLoadingChat(false);
    }
  };

  // 대화 기록 초기화
  const resetChat = () => {
    setChatHistory([{ sender: 'bot', text: welcomeMessage }]);
  };

  return (
    <div className="chatbot-builder-container">
      {/* 🚀 상단 헤더 배너 */}
      <header className="builder-hero">
        <div className="builder-badge">🤖 Chatbase SaaS • Prototype</div>
        <h1 className="builder-title">
          나만의 <span className="highlight-cyan">AI 고객센터 챗봇</span> 빌더
        </h1>
        <p className="builder-sub">
          대표님! 지식 문서를 입력하면 단 3초 만에 나만의 챗봇이 탄생하는 **글로벌 억대 매출 비즈니스 모델**입니다. 지식을 채우고 챗봇 테마를 바꿔 직접 테스트해 보세요.
        </p>
      </header>

      <div className="builder-layout">
        {/* ⚙️ 왼쪽: 설정 창 */}
        <div className="builder-settings-card">
          <div className="section-title">
            <Settings size={18} style={{ color: '#06b6d4' }} />
            <h3>🛠️ 챗봇 컨트롤 센터</h3>
          </div>

          {/* 1. 지식 소스 입력 */}
          <div className="setting-group">
            <label className="setting-label">
              📖 1단계: 챗봇 학습용 지식 베이스 문서
              <span className="tooltip" title="챗봇이 이 문서 내용 안에서만 대답합니다. 다른 불필요한 얘기는 차단됩니다.">❓</span>
            </label>
            <textarea
              className="knowledge-textarea"
              placeholder="예: 우리 회사의 서비스 매뉴얼, 환불규정, 이용 가격표 등을 자유롭게 입력하세요."
              value={knowledge}
              onChange={(e) => setKnowledge(e.target.value)}
              rows={8}
            />
          </div>

          {/* 2. 브랜드 커스텀 */}
          <div className="setting-group">
            <label className="setting-label">🤖 2단계: 챗봇 페르소나 설정</label>
            <div className="input-grid">
              <div>
                <span className="small-label">챗봇 이름</span>
                <input
                  type="text"
                  className="theme-input"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  placeholder="예: 코다리 카페 봇"
                />
              </div>
              <div>
                <span className="small-label font-emoji">아바타 아이콘</span>
                <div className="avatar-selector">
                  <span className="selected-avatar">{botAvatar}</span>
                  <div className="avatar-dropdown">
                    {avatarPresets.map((av) => (
                      <button
                        key={av}
                        type="button"
                        className="avatar-preset-btn"
                        onClick={() => setBotAvatar(av)}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '14px' }}>
              <span className="small-label">첫 환영 메시지</span>
              <textarea
                className="theme-textarea"
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                placeholder="챗봇이 열릴 때 나타날 첫 인사말을 적어주세요."
                rows={2}
              />
            </div>

            <div style={{ marginTop: '14px' }}>
              <span className="small-label">브랜드 테마 포인트 색상</span>
              <div className="color-preset-bar">
                {colorPresets.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`color-dot ${themeColor === color.value ? 'active' : ''}`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setThemeColor(color.value)}
                    title={color.name}
                  />
                ))}
                <input
                  type="color"
                  className="custom-color-picker"
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  title="사용자 지정 색상"
                />
              </div>
            </div>
          </div>

          {/* 3. 웹사이트 삽입 코드 */}
          <div className="setting-group code-embed-group">
            <div className="embed-header">
              <label className="setting-label">
                <Code size={14} style={{ color: '#a855f7', marginRight: '4px' }} />
                🌐 3단계: 내 사이트에 챗봇 삽입하기
              </label>
              <button className="btn-copy-code" onClick={handleCopyScript}>
                {copied ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
                <span>{copied ? '복사 완료!' : '코드 복사'}</span>
              </button>
            </div>
            <p className="embed-desc">내 홈페이지 HTML의 `&lt;head&gt;` 태그 안에 아래 코드를 삽입하면 바로 챗봇이 장착됩니다.</p>
            <div className="code-box">
              <code>
                {`<!-- AI Chatbot Embed -->`}
                <br />
                {`<script src="https://connectai.co/widget.js"`}
                <br />
                {`  data-bot-id="bot_kd_9812a"`}
                <br />
                {`  data-theme-color="${themeColor}"`}
                <br />
                {`  data-bot-name="${botName}">`}
                <br />
                {`</script>`}
              </code>
            </div>
          </div>
        </div>

        {/* 📱 오른쪽: 실물 챗봇 시뮬레이터 */}
        <div className="builder-preview-card">
          <div className="preview-label-row">
            <span>✨ 실시간 위젯 미리보기 (Live Simulator)</span>
            <button className="btn-reset-chat" onClick={resetChat}>대화 리셋</button>
          </div>

          {/* 모바일 폰 목업 스타일의 챗봇 창 */}
          <div className="chatbot-phone-mockup">
            {/* 챗봇 탑바 */}
            <div className="bot-topbar" style={{ backgroundColor: themeColor }}>
              <div className="bot-info-area">
                <div className="bot-avatar-badge">{botAvatar}</div>
                <div>
                  <h4 className="bot-display-name">{botName}</h4>
                  <div className="bot-status-row">
                    <span className="status-dot"></span>
                    <span>온라인 (도움 대기중)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 챗 메시지 영역 */}
            <div className="bot-chat-body">
              {chatHistory.map((msg, index) => (
                <div key={index} className={`chat-bubble-row ${msg.sender}`}>
                  {msg.sender === 'bot' && (
                    <div className="bot-bubble-avatar">{botAvatar}</div>
                  )}
                  <div className={`chat-bubble-content ${msg.sender}`}>
                    <p className="bubble-text">{msg.text}</p>
                  </div>
                </div>
              ))}
              
              {loadingChat && (
                <div className="chat-bubble-row bot">
                  <div className="bot-bubble-avatar">{botAvatar}</div>
                  <div className="chat-bubble-content bot loading-pulse">
                    <Loader2 size={16} className="animate-spin text-muted" />
                    <span style={{ fontSize: '11px', color: '#94a3b8', marginLeft: '6px' }}>정보 탐색 중...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* 챗 입력창 */}
            <div className="bot-input-footer">
              <input
                type="text"
                className="bot-input-field"
                placeholder="지식 문서 안의 궁금한 점을 물어보세요..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={loadingChat}
              />
              <button
                className="bot-send-btn"
                style={{ backgroundColor: themeColor }}
                onClick={handleSendMessage}
                disabled={loadingChat || !chatInput.trim()}
              >
                전송
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatbotBuilder;
