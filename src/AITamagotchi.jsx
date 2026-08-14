import React, { useState, useEffect } from 'react';
import './AITamagotchi.css';

const MOCK_WORDS = [
  { en: 'voyage', ko: '항해, 긴 여행' },
  { en: 'niche', ko: '틈새 (시장)' },
  { en: 'prototype', ko: '시제품' },
  { en: 'agile', ko: '기민한, 민첩한' },
  { en: 'tamagotchi', ko: '다마고치' },
  { en: 'revenue', ko: '수익' }
];

export default function AITamagotchi() {
  const [level, setLevel] = useState(() => parseInt(localStorage.getItem('tamagotchi_level')) || 1);
  const [exp, setExp] = useState(() => parseInt(localStorage.getItem('tamagotchi_exp')) || 0);
  const [poops, setPoops] = useState(() => parseInt(localStorage.getItem('tamagotchi_poops')) || 0);
  const [lastLogin, setLastLogin] = useState(() => localStorage.getItem('tamagotchi_last_login') || new Date().toISOString());
  
  const [quizActive, setQuizActive] = useState(false);
  const [currentWord, setCurrentWord] = useState(null);
  const [options, setOptions] = useState([]);
  
  const [dialog, setDialog] = useState("주인님! 접속하셨군요. 오늘 배울 단어는 준비되셨나요?");
  const [chatInput, setChatInput] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);

  // 로컬 LM Studio 연동 챗봇 로직
  const handleChat = async () => {
    if (!chatInput.trim()) return;
    
    setLoadingChat(true);
    setDialog("...");
    const userMessage = chatInput;
    setChatInput("");

    try {
      const res = await fetch("http://localhost:1234/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "local-model", // LM Studio는 모델명을 깐깐하게 검사하지 않으므로 무방합니다.
          messages: [
            { role: "system", content: "너는 주인을 무척 사랑하는 귀여운 병아리 다마고치 펫이야. 주인이 공부를 하면 진화해. 항상 애교 있게 반말로 대답하고, 두 문장 이내로 짧게 대답해. 이모지를 많이 사용해." },
            { role: "user", content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 100
        })
      });
      const data = await res.json();
      if (data.choices && data.choices.length > 0) {
        setDialog(data.choices[0].message.content);
      }
    } catch (err) {
      console.error(err);
      setDialog("앗... 로컬 서버랑 연결이 안 됐나 봐! 삐리릿 ㅠㅠ");
    } finally {
      setLoadingChat(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('tamagotchi_level', level);
    localStorage.setItem('tamagotchi_exp', exp);
    localStorage.setItem('tamagotchi_poops', poops);
    localStorage.setItem('tamagotchi_last_login', lastLogin);
  }, [level, exp, poops, lastLogin]);

  useEffect(() => {
    const today = new Date();
    const last = new Date(lastLogin);
    const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24));
    
    if (diffDays >= 2) {
      setPoops(prev => Math.min(prev + diffDays, 10));
      setDialog("오랜만에 오셨네요... 그동안 화장실을 못 가서 똥을 쌌어요 ㅠㅠ 치워주세요!");
    }
    setLastLogin(today.toISOString());
  }, []);

  const getPetImage = () => {
    if (poops > 0) return '🤒';
    if (level === 1) return '🥚';
    if (level === 2) return '🐣';
    if (level === 3) return '🐥';
    if (level >= 4) return '🦅';
    return '🐣';
  };

  const startQuiz = () => {
    if (poops > 0) {
      setDialog("똥 냄새 때문에 공부에 집중할 수가 없어요... 먼저 똥부터 치워주세요! 💩");
      return;
    }
    
    const word = MOCK_WORDS[Math.floor(Math.random() * MOCK_WORDS.length)];
    setCurrentWord(word);
    
    let wrongOptions = MOCK_WORDS.filter(w => w.en !== word.en).sort(() => 0.5 - Math.random()).slice(0, 3).map(w => w.ko);
    let allOptions = [...wrongOptions, word.ko].sort(() => 0.5 - Math.random());
    
    setOptions(allOptions);
    setQuizActive(true);
    setDialog("자, 퀴즈입니다! 틀리면 똥을 쌀 거예요!");
  };

  const handleAnswer = (selected) => {
    setQuizActive(false);
    if (selected === currentWord.ko) {
      setDialog("정답입니다! 너무 맛있어요 냠냠! 😋");
      setExp(prev => {
        let newExp = prev + 25;
        if (newExp >= 100) {
          setLevel(l => l + 1);
          setDialog("앗! 제 몸에 빛이... 진화했습니다!! ✨");
          return 0;
        }
        return newExp;
      });
    } else {
      setDialog("틀렸어요! 우웩, 맛없는 단어 먹고 배탈 났어요! 💩");
      setPoops(prev => prev + 1);
    }
  };

  const cleanPoop = () => {
    if (poops > 0) {
      setPoops(p => p - 1);
      setDialog("휴~ 이제 좀 살 것 같아요. 청소해 주셔서 감사합니다! 🧹");
    }
  };

  const forceAbsent = () => {
    setPoops(p => p + 3);
    setDialog("으악! 너무 오랫동안 밥을 안 줘서 바지에 지렸어요! 💩💩💩");
  };

  return (
    <div className="tamagotchi-container">
      <div className="tamagotchi-header">
        <h2>🎮 보는 단어장 : AI 잉크 펫</h2>
        <p>유저가 공부를 해야만 진화하는 펫입니다.</p>
      </div>

      <div className="tamagotchi-machine">
        <div className="screen-bezel">
          <div className="screen-inner">
            <div className="pet-status-bar">
              <span className="pet-level">LV.{level}</span>
              <div className="exp-bar-container">
                <div className="exp-bar-fill" style={{ width: `${exp}%` }}></div>
              </div>
            </div>

            <div className="pet-stage">
              <div className={`pet-character ${poops > 0 ? 'sick' : 'bounce'}`}>
                {getPetImage()}
              </div>
              
              {Array.from({ length: Math.min(poops, 15) }).map((_, i) => (
                <div 
                  key={i} 
                  className="poop-emoji" 
                  style={{ 
                    left: `${Math.random() * 80 + 10}%`, 
                    bottom: `${Math.random() * 20 + 5}%` 
                  }}
                  onClick={cleanPoop}
                >
                  💩
                </div>
              ))}
            </div>

            <div className="dialog-box">
              {dialog}
            </div>
          </div>
        </div>

        <div className="control-buttons">
          {!quizActive ? (
            <>
              <button className="tama-btn primary" onClick={startQuiz}>단어 시험 (밥주기)</button>
              <button className="tama-btn secondary" onClick={cleanPoop}>청소하기</button>
              
              <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                <input 
                  type="text" 
                  placeholder="펫에게 자유롭게 말 걸기..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  style={{ flex: 1, padding: '10px', borderRadius: '15px', border: '2px solid #e5e7eb', outline: 'none' }}
                  onKeyPress={(e) => { if(e.key === 'Enter') handleChat(); }}
                />
                <button className="tama-btn primary" onClick={handleChat} disabled={loadingChat} style={{ padding: '10px 15px' }}>
                  {loadingChat ? '⏳' : '💬'}
                </button>
              </div>
            </>
          ) : (
            <div className="quiz-area">
              <h3>Q. {currentWord?.en}</h3>
              <div className="options-grid">
                {options.map((opt, i) => (
                  <button key={i} className="quiz-opt-btn" onClick={() => handleAnswer(opt)}>{opt}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="debug-panel">
        <button onClick={forceAbsent}>⚠️ 3일 결석 시뮬레이션 (패널티 발생)</button>
        <button onClick={() => { setLevel(1); setExp(0); setPoops(0); setDialog("초기화되었습니다."); }}>초기화</button>
      </div>
    </div>
  );
}
