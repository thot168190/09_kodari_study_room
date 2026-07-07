import React, { useState, useEffect } from 'react';
import { Volume2, Play, Square, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import './StickWordPlayer.css';
import vocabData from './assets/stickword-data.json';

function StickWordPlayer() {
  const [words, setWords] = useState(vocabData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTouchMode, setIsTouchMode] = useState(true); // true: 터치모드, false: 자동모드
  const [showWord, setShowWord] = useState(false); // 터치 모드에서 그림(false)과 단어(true) 토글
  const [isPlayingAuto, setIsPlayingAuto] = useState(false); // 자동재생 진행 여부

  const currentWord = words[currentIndex] || {};

  // 음성 낭독 함수 (TTS)
  const speakWord = (text) => {
    if ('speechSynthesis' in window) {
      // 말하고 있는 도중이면 끊기
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8; // 아이들이 따라하기 좋은 속도로 조절
      window.speechSynthesis.speak(utterance);
    }
  };

  // 터치 모드에서의 카드 터치 동작
  const handleCardTouch = () => {
    if (!isTouchMode) return; // 자동모드일 때는 터치 동작 차단

    if (!showWord) {
      // 1. 그림 상태에서 터치 시 -> 단어로 변신 + 영어 낭독
      setShowWord(true);
      speakWord(currentWord.word);
    } else {
      // 2. 이미 단어인 상태에서 한 번 더 터치 시 -> 원상태(그림)로 복귀
      setShowWord(false);
    }
  };

  // 단어 넘기기 동작
  const handlePrev = () => {
    setShowWord(false);
    setCurrentIndex((prev) => (prev === 0 ? words.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setShowWord(false);
    setCurrentIndex((prev) => (prev === words.length - 1 ? 0 : prev + 1));
  };

  // 자동 재생(자동 모드) 효과
  useEffect(() => {
    let timer;
    if (!isTouchMode && isPlayingAuto) {
      setShowWord(false); // 그림 상태로 초기화 후 시작
      
      const runAutoCycle = () => {
        // 1. 먼저 단어로 변신
        setShowWord(true);
        speakWord(currentWord.word);
        
        // 2. 3초 후 다음 카드로 이동
        timer = setTimeout(() => {
          setShowWord(false);
          setCurrentIndex((prev) => (prev === words.length - 1 ? 0 : prev + 1));
        }, 3000);
      };

      runAutoCycle();
    }
    return () => clearTimeout(timer);
  }, [isTouchMode, isPlayingAuto, currentIndex]);

  // 모드 변경 시 상태 초기화
  const handleModeChange = (mode) => {
    setIsTouchMode(mode);
    setIsPlayingAuto(false);
    setShowWord(false);
  };

  return (
    <div className="stickword-container">
      <div className="player-card glass-card">
        {/* 상단 브랜딩 영역 */}
        <div className="card-top-nav">
          <div className="badge-area">
            <Sparkles size={12} className="spark-icon" />
            <span className="brand-text">STICKWORD</span>
          </div>
          <span className="count-badge">{currentIndex + 1} / {words.length}</span>
        </div>

        {/* 메인 콘텐츠 카드 영역 (터치 및 리액션 작동) */}
        <div 
          className={`word-viewport ${isTouchMode ? 'cursor-pointer' : ''} ${showWord ? 'is-flipped' : ''}`}
          onClick={handleCardTouch}
        >
          {!showWord ? (
            // [그림 모드] 스틱맨 모션 렌더링
            <div className="view-side graphic-side">
              {/* 스틱맨 모사 아트웍 (SVG 기반 가벼운 스크립트 드로잉) */}
              <div className={`stickman-graphics ${currentWord.word.toLowerCase()}`}>
                <div className="head"></div>
                <div className="body-line"></div>
                <div className="arm left"></div>
                <div className="arm right"></div>
                <div className="leg left"></div>
                <div className="leg right"></div>
                {currentWord.word === "RUN" && <div className="dust-cloud"></div>}
                {currentWord.word === "SLEEP" && <div className="z-snore">Zzz</div>}
                {currentWord.word === "FLY" && <div className="clouds">☁️</div>}
              </div>
              <span className="touch-hint">터치하면 변신! 👆</span>
            </div>
          ) : (
            // [단어 모드] 영어 텍스트 렌더링
            <div className="view-side word-side">
              <h1 className="vocab-title">{currentWord.word}</h1>
              <p className="phonetic-symbol">{currentWord.phonetic}</p>
              <h2 className="vocab-meaning">{currentWord.meaning}</h2>
              <div className="example-box">
                <p className="sentence-en">{currentWord.sentence}</p>
                <p className="sentence-ko">{currentWord.translation}</p>
              </div>
            </div>
          )}
        </div>

        {/* 🔊 발음 듣기 플로팅 버튼 */}
        {showWord && (
          <button className="btn-sound-float" onClick={() => speakWord(currentWord.word)}>
            <Volume2 size={20} />
            <span>소리 듣기</span>
          </button>
        )}

        {/* 하단 네비게이션 제어 바 */}
        <div className="player-controls">
          <button className="btn-nav" onClick={handlePrev} disabled={!isTouchMode && isPlayingAuto}>
            <ChevronLeft size={24} />
          </button>
          
          {/* 모드 선택 토글 */}
          <div className="mode-toggle-group">
            <button 
              className={`btn-mode-select ${isTouchMode ? 'active' : ''}`}
              onClick={() => handleModeChange(true)}
            >
              👆 터치 모드
            </button>
            <button 
              className={`btn-mode-select ${!isTouchMode ? 'active' : ''}`}
              onClick={() => handleModeChange(false)}
            >
              📺 자동 모드
            </button>
          </div>

          <button className="btn-nav" onClick={handleNext} disabled={!isTouchMode && isPlayingAuto}>
            <ChevronRight size={24} />
          </button>
        </div>

        {/* 자동 재생 상태바 */}
        {!isTouchMode && (
          <div className="auto-play-bar">
            {isPlayingAuto ? (
              <button className="btn-auto-control stop" onClick={() => setIsPlayingAuto(false)}>
                <Square size={14} />
                <span>재생 중단</span>
              </button>
            ) : (
              <button className="btn-auto-control start" onClick={() => setIsPlayingAuto(true)}>
                <Play size={14} />
                <span>자동 시작</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StickWordPlayer;
