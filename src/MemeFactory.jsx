import React, { useState } from 'react';
import './MemeFactory.css';
import { Sparkles, Play, Pause, Volume2, Film, RefreshCw, MessageSquare, Award, ArrowRight, Loader2 } from 'lucide-react';

function MemeFactory() {
  const [storeName, setStoreName] = useState('코다리 삼겹살');
  const [promoContent, setPromoContent] = useState('점심 특선 코다리 냉면 개시 50% 할인!');
  const [loading, setLoading] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [result, setResult] = useState(null);
  
  // 오디오 재생 상태
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentSpeechIndex, setCurrentSpeechIndex] = useState(-1);

  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // 15초 밈 숏폼 생성
  const generateMeme = async () => {
    if (!storeName.trim() || !promoContent.trim()) {
      alert("대표님, 매장명과 홍보 내용을 입력해 주십시오.");
      return;
    }

    if (!geminiApiKey) {
      alert("대표님, VITE_GEMINI_API_KEY 환경 변수가 설정되어 있지 않사옵니다. .env 파일을 확인해 주십시오.");
      return;
    }

    setLoading(true);
    setResult(null);
    setIsPlayingAudio(false);
    setCurrentSpeechIndex(-1);

    // 가상의 단계별 로딩 애니메이션 연출 (Vibe 극대화)
    setProgressStep(1); // 1. AI 밈 템플릿 기획 중
    await new Promise(r => setTimeout(r, 1200));
    setProgressStep(2); // 2. B급 병맛 시나리오 및 나레이션 작사 중
    await new Promise(r => setTimeout(r, 1200));
    setProgressStep(3); // 3. 15초 프레임 및 오디오 믹싱 가이드 생성 중
    await new Promise(r => setTimeout(r, 1000));

    try {
      const prompt = `당신은 15초짜리 인스타그램 릴스 및 틱톡 밈(Meme) 마케팅 숏폼 비디오 대본을 전문으로 기획하는 B급 감성의 천재 AI 마케터입니다.
      다음 입력 정보를 바탕으로, 사장님들이 얼굴을 드러내지 않고도 광고비 0원으로 유기적 트래픽을 폭발시킬 수 있는 코믹하고 중독성 넘치는 15초 병맛 시나리오 대본을 한국어로 작성해 주세요.
      
      - 매장 이름/브랜드명: "${storeName}"
      - 홍보하고 싶은 혜택/상품: "${promoContent}"
      
      반드시 아래의 정밀한 JSON 구조로만 출력하되, 마크다운 코드 블록(\`\`\`)이나 추가 설명 텍스트를 절대 앞뒤에 붙이지 마십시오. JSON 파싱이 가능해야 합니다.
      
      JSON 구조:
      {
        "memeTitle": "밈 제목 (예: 퇴사 충동 막아주는 냉면 등)",
        "bgmStyle": "추천하는 배경음악 스타일 (예: 90년대 테크노뽕짝 리믹스, 킹받는 하이쿠프)",
        "scriptSteps": [
          {
            "time": "0s - 3s",
            "video": "비디오 연출 가이드 (예: 지친 직장인이 좀비처럼 걷는 화면)",
            "audio": "나레이션 대사 (한국어, 30자 이내로 찰지게)"
          },
          {
            "time": "3s - 7s",
            "video": "비디오 연출 가이드 (예: 갑자기 코다리 냉면을 한 입 맛보고 동공지진)",
            "audio": "나레이션 대사 (한국어, 35자 이내로 찰지게)"
          },
          {
            "time": "7s - 11s",
            "video": "비디오 연출 가이드 (예: 갑자기 춤판이 벌어지며 삼겹살 기름이 튀는 역동적 화면)",
            "audio": "나레이션 대사 (한국어, 35자 이내로 찰지게)"
          },
          {
            "time": "11s - 15s",
            "video": "비디오 연출 가이드 (매장명 로고와 함께 50% 할인 텍스트가 대문짝만하게 박히는 화면)",
            "audio": "마지막 나레이션 및 콜투액션 대사 (한국어, 30자 이내)"
          }
        ],
        "marketingTip": "마크 루(Marc Lou)식 밈 바이럴을 극대화하기 위한 이 숏폼의 게릴라 홍보 팁"
      }`;

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
      let rawJson = data.candidates[0].content.parts[0].text.trim();

      // 마크다운 백틱 제거 안정화
      if (rawJson.startsWith('```json')) {
        rawJson = rawJson.substring(7, rawJson.length - 3).trim();
      } else if (rawJson.startsWith('```')) {
        rawJson = rawJson.substring(3, rawJson.length - 3).trim();
      }

      const jsonStart = rawJson.indexOf('{');
      const jsonEnd = rawJson.lastIndexOf('}') + 1;
      if (jsonStart !== -1 && jsonEnd !== -1) {
        rawJson = rawJson.substring(jsonStart, jsonEnd);
      }

      const parsedMeme = JSON.parse(rawJson);
      setResult(parsedMeme);
    } catch (err) {
      console.error(err);
      alert("대표님, 밈 기획서 파싱 중에 에러가 발생했사옵니다. 다시 한번 클릭해 주시겠습니까?");
    } finally {
      setLoading(false);
      setProgressStep(0);
    }
  };

  // Web Speech API (TTS)를 사용한 15초 시나리오 대사 전체 연속 낭독
  const playAllAudio = () => {
    if (!result || !result.scriptSteps) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setCurrentSpeechIndex(-1);
      return;
    }

    setIsPlayingAudio(true);
    let stepIndex = 0;

    const speakNextStep = () => {
      if (stepIndex >= result.scriptSteps.length) {
        setIsPlayingAudio(false);
        setCurrentSpeechIndex(-1);
        return;
      }

      setCurrentSpeechIndex(stepIndex);
      const textToSpeak = result.scriptSteps[stepIndex].audio;
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'ko-KR';
      
      // 조금 더 B급 병맛 느낌을 살리기 위해 속도(rate)와 음높이(pitch) 조정 가능
      utterance.rate = 1.05; // 약간 빠른 호흡
      utterance.pitch = 1.0; 

      utterance.onend = () => {
        stepIndex++;
        speakNextStep();
      };

      utterance.onerror = () => {
        setIsPlayingAudio(false);
        setCurrentSpeechIndex(-1);
      };

      window.speechSynthesis.speak(utterance);
    };

    window.speechSynthesis.cancel(); // 기존 재생 정지
    speakNextStep();
  };

  return (
    <div className="memefactory-container">
      {/* 🚀 상단 헤더 배너 */}
      <header className="factory-hero">
        <div className="factory-badge">🎬 실물 데모 • 밈 팩토리</div>
        <h1 className="factory-title">
          1인 기업용 <span className="highlight-purple">15초 병맛 릴스</span> 빌더
        </h1>
        <p className="factory-sub">
          대표님! 멀리 해외에서 잘되는 '밈 마케팅' 사례를 직접 만져볼 수 있게 제작한 **실물 프로토타입**입니다. 매장명과 홍보내용을 넣고 AI가 뱉어내는 대본과 **실제 한국어 음성 가이드**를 직접 확인해 보세요!
        </p>
      </header>

      <div className="factory-layout">
        {/* 📥 왼쪽: 정보 입력 카드 */}
        <div className="factory-input-card">
          <h3>📥 매장 및 홍보 정보 입력</h3>
          <p className="input-desc">사장님의 브랜드와 혜택을 적어주시면, AI가 트렌디한 인스타 밈에 강제로 끼워 맞춰 줍니다.</p>

          <div className="field-group">
            <label>📌 매장명 / 브랜드명</label>
            <input 
              type="text" 
              placeholder="예: 마포구 코다리 삼겹살" 
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="field-group">
            <label>📢 홍보 혜택 / 이벤트 소식</label>
            <textarea 
              placeholder="예: 신메뉴 코다리 냉면 개시 및 점심시간 50% 반값 파격 세일!" 
              value={promoContent}
              onChange={(e) => setPromoContent(e.target.value)}
              disabled={loading}
              rows={3}
            />
          </div>

          <button 
            className="btn-generate-meme" 
            onClick={generateMeme} 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="spinner animate-spin" size={18} />
                <span>
                  {progressStep === 1 && "🧠 AI 밈 템플릿 기획 중..."}
                  {progressStep === 2 && "📝 B급 시나리오 작사 중..."}
                  {progressStep === 3 && "🎬 15초 비디오 믹싱 가이드 굽는 중..."}
                </span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>🎬 15초 밈 숏폼 영상 제작하기</span>
              </>
            )}
          </button>
        </div>

        {/* 🖥️ 오른쪽: 실물 결과 패널 */}
        <div className="factory-result-panel">
          {result ? (
            <div className="meme-result animate-fade-in">
              <div className="meme-result-header">
                <div>
                  <span className="result-badge">🔥 생성 완료</span>
                  <h4>🎬 {result.memeTitle}</h4>
                  <p className="bgm-tag">🎵 배경음악 추천: {result.bgmStyle}</p>
                </div>
                <button 
                  className={`btn-audio-playback ${isPlayingAudio ? 'playing' : ''}`}
                  onClick={playAllAudio}
                >
                  {isPlayingAudio ? <Pause size={16} /> : <Volume2 size={16} />}
                  <span>{isPlayingAudio ? "음성 정지" : "음성 가이드 전체 재생"}</span>
                </button>
              </div>

              {/* 15초 스토리보드 프레임 타임라인 */}
              <div className="script-timeline">
                {result.scriptSteps.map((step, idx) => (
                  <div 
                    key={idx} 
                    className={`timeline-frame ${currentSpeechIndex === idx ? 'active' : ''}`}
                  >
                    <div className="frame-time-badge">{step.time}</div>
                    <div className="frame-content">
                      <div className="frame-video-desc">
                        <Film size={14} className="icon-film" />
                        <span><strong>화면 연출:</strong> {step.video}</span>
                      </div>
                      <div className="frame-audio-bubble">
                        <Volume2 size={14} className="icon-speaker" />
                        <p>"{step.audio}"</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 마크 루식 게릴라 마케팅 팁 */}
              <div className="marketing-tip-box">
                <h5>💡 마크 루의 1인 기업 게릴라 마케팅 전략</h5>
                <p>{result.marketingTip}</p>
              </div>
            </div>
          ) : (
            <div className="empty-result-state">
              <div className="empty-icon">🎥</div>
              <h4>15초 밈 기획서가 이곳에 렌더링됩니다</h4>
              <p>왼쪽 카드를 작성하시고 '제작하기'를 누르면 대본, 비디오 프레임 연출, 그리고 오디오 나레이션 가이드 음성이 즉시 작동하옵니다, 대표님!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MemeFactory;
