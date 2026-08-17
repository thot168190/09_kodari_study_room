import React, { useState, useEffect } from 'react';
import './CheolmanVoiceStudio.css';
import { Mic, Play, Download, Copy, Check, Sparkles, RefreshCw, Volume2, ArrowRight, Layers, FileAudio, ExternalLink, Zap } from 'lucide-react';

const NARRATION_SCRIPT = [
  { id: 1, text: "이 계단, 어디서 본 것 같지 않으십니까.", note: "도입부 / 호기심 유발" },
  { id: 2, text: "비에 젖은 층층대 위로 두 남자가 뒤엉키던 영화 인정사정 볼 것 없다의 그 유명한 장면이, 바로 여기 부산 40계단에서 태어났습니다.", note: "영화 인정사정볼것없다 오프닝" },
  { id: 3, text: "그런데 말입니다. 이 계단이 품고 있는 진짜 이야기는, 그 영화보다 훨씬 깊습니다.", note: "진짜 역사 전환점" },
  { id: 4, text: "안녕하십니까, 철만이입니다. 시즌1에서는 제 어린 시절 이야기를 들려드렸다면, 시즌 2는 제 이야기는 물론이고 숨은 재미가 있는 지역 명물 이야기와 함께 찾아갑니다. 그 첫 번째 이야기를, 바로 이 계단에서 시작합니다.", note: "시즌2 철만이 정식 인사" },
  { id: 5, text: "우리가 지금도 쓰는 개판 오 분 전이라는 말이, 바로 이 계단 아래에서 태어났기 때문입니다.", note: "개판 5분 전 어원 제시" },
  { id: 6, text: "강아지 개, 그 개냐고요? 아닙니다. 열 개 자를 써서, 가마솥 뚜껑이 열리기 오 분 전이라는 뜻이라고 전해집니다. 대체 무슨 뚜껑이 열린다는 것인지 — 그 사연을 알려면, 칠십 년 전의 이 계단으로 내려가 보아야 합니다.", note: "열 개(開)자 유래 설명" },
  { id: 7, text: "육이오 전쟁이 터지고 부산이 임시 수도가 되자, 전국의 피란민이 이 항구 도시로 밀려들었습니다. 부두에 내린 사람들이 산비탈 판자촌으로 올라가는 가장 빠른 길목이 바로 이 40계단이었고, 계단 주변은 금세 피란살이의 한복판이 되었습니다.", note: "1953 부산 피란 배경" },
  { id: 8, text: "시계 가진 사람조차 드물던 그 시절, 계단 아래 무료 급식소에서는 밥때가 되면 누군가 종을 치며 이렇게 외쳤습니다. 개판 오 분 전! 개판 오 분 전! 가마솥 뚜껑이 열리기 오 분 전, 곧 밥을 준다는 신호였다지요.", note: "무료 급식소 종소리 재현" },
  { id: 9, text: "그 종소리 한 번에 온 동네가 계단으로 달려 내려왔습니다. 고무신 한 짝쯤이야 계단 어딘가에 벗어 두고 갔겠지요. 밥이 먼저였으니까요.", note: "피란민들의 절박함" },
  { id: 10, text: "그날의 그 아수라장이 말이 되어, 칠십 년이 지난 지금 우리 입에까지 남은 것입니다.", note: "말의 생명력" },
  { id: 11, text: "하지만 이 계단이 품은 것이, 웃음만은 아니었습니다.", note: "감정선 전환" },
  { id: 12, text: "전쟁통에 뿔뿔이 흩어진 가족들에게, 이 계단은 서로를 찾는 마지막 약속의 자리이기도 했습니다.", note: "이산가족의 약속의 장소" },
  { id: 13, text: "살아 있거든 부산 40계단에서 만나자 — 그 한마디를 붙들고, 사람들은 날마다 이 층층대에 앉아 오지 않는 얼굴을 기다렸습니다.", note: "기다림의 40계단" },
  { id: 14, text: "헤어진 오빠를 기다리던 한 소녀도, 그중 하나였습니다.", note: "2번 씬 소녀 포커스" },
  { id: 15, text: "기다림이 길어지던 그 시절, 이 계단을 노래한 경상도 아가씨라는 곡이 거리마다 흘렀습니다. 계단에 앉아 우는 나그네를 그린 그 노래는, 기다리다 지친 사람들의 설움을 가만히 다독여 주었지요.", note: "3번 씬 경상도 아가씨 노래" },
  { id: 16, text: "그러던 1953년 겨울, 부산역 앞에 큰불이 났습니다. 판잣집 수천 채가 하룻밤 사이에 잿더미로 변했고, 소녀가 살던 골목도, 오빠와 만나기로 한 그 자리도, 불길을 피하지 못했습니다.", note: "4번 씬 부산역 대화재" },
  { id: 17, text: "그런데 다음 날 아침, 소녀는 또 그 계단에 앉아 있었습니다. 온 골목이 잿더미가 되어도, 약속만은 타지 않았기 때문입니다.", note: "5번 씬 잿더미 위 소녀" },
  { id: 18, text: "세월이 흘러 도시가 모습을 바꾸는 동안, 계단은 원래 자리에서 조금 옆으로 옮겨졌다고 전해집니다. 하지만 자리가 옮겨졌어도, 이름과 이야기만은 그 자리에 그대로 남았습니다.", note: "6번 씬 현재 40계단 역사" },
  { id: 19, text: "영화의 명장면이 태어난 곳이자, 개판 오 분 전이라는 말이 태어난 곳이자, 헤어진 가족들이 서로를 기다리던 곳. 지금은 웃으며 사진을 찍는 그 계단이, 한때는 그런 곳이었습니다.", note: "공간의 중첩과 감동" },
  { id: 20, text: "부산에 가시거든, 40계단에 잠깐 앉아 보십시오. 마흔 개의 층층대에 쌓인 칠십 년의 시간이, 조용히 말을 걸어올 것입니다.", note: "여운과 클로징" },
  { id: 21, text: "그리고 알고 계신 이야기가 있다면, 댓글로 들려주십시오.", note: "시청자 참여 유도" }
];

export default function CheolmanVoiceStudio() {
  const [copiedId, setCopiedId] = useState(null);
  const [isLocalRunning, setIsLocalRunning] = useState(false);
  const [selectedItem, setSelectedItem] = useState(NARRATION_SCRIPT[0]);
  const [customText, setCustomText] = useState(NARRATION_SCRIPT[0].text);

  useEffect(() => {
    fetch('http://localhost:7860/', { mode: 'no-cors' })
      .then(() => setIsLocalRunning(true))
      .catch(() => setIsLocalRunning(false));
  }, []);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="cheolman-voice-studio">
      {/* 상단 배너 */}
      <div className="cv-hero-banner">
        <div className="cv-hero-badge">🎙️ 잉크워드 시즌 2 · 1화 공식 나레이션 스튜디오</div>
        <h1 className="cv-hero-title">부산 40계단 남편 목소리 나레이션 센터</h1>
        <p className="cv-hero-sub">
          공부방 KODARI ROOM과 맥북 AI 엔진이 실시간 연동되어 1화 전체 21개 대사를 남편분의 목소리로 정밀하게 생성합니다.
        </p>

        <div className="cv-status-box">
          <div className="cv-status-item">
            <span className="cv-status-dot green"></span>
            <span>참조 음원: <strong>cheolman_ref_30s.wav (남편 목소리 100%)</strong></span>
          </div>
          <div className="cv-status-item">
            <span className={`cv-status-dot ${isLocalRunning ? 'green' : 'blue'}`}></span>
            <span>로컬 백엔드 엔진: <strong>{isLocalRunning ? '🚀 맥북 가속 가동 중 (localhost:7860)' : '⚡ 독립 대본/복사 모드 작동 중'}</strong></span>
          </div>
          <a href="http://localhost:7860" target="_blank" rel="noopener noreferrer" className="cv-open-local-btn">
            <ExternalLink size={15} /> 로컬 스튜디오 창 바로가기
          </a>
        </div>
      </div>

      {/* 2컬럼 레이아웃 */}
      <div className="cv-content-grid">
        {/* 좌측: 21개 대본 문장 목록 */}
        <div className="cv-script-list-panel">
          <div className="cv-panel-header">
            <h3>📜 40계단 1화 전체 대본 리스트 (총 21문장)</h3>
            <span className="cv-badge-count">완결본 100%</span>
          </div>

          <div className="cv-script-items">
            {NARRATION_SCRIPT.map((item) => (
              <div 
                key={item.id} 
                className={`cv-script-card ${selectedItem.id === item.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedItem(item);
                  setCustomText(item.text);
                }}
              >
                <div className="cv-card-top">
                  <span className="cv-item-num">문장 {String(item.id).padStart(2, '0')}</span>
                  <span className="cv-item-note">{item.note}</span>
                  <button 
                    className="cv-mini-copy-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(item.id, item.text);
                    }}
                    title="대사 복사"
                  >
                    {copiedId === item.id ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                  </button>
                </div>
                <p className="cv-card-text">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 우측: 선택 문장 실행 & 생성 패널 */}
        <div className="cv-action-panel">
          <div className="cv-panel-header">
            <h3>🎙️ 선택 문장 나레이션 컨트롤러</h3>
            <span className="cv-selected-badge">문장 #{selectedItem.id}</span>
          </div>

          <div className="cv-editor-box">
            <label className="cv-label">📖 낭독 문장 (자유 수정 가능):</label>
            <textarea 
              className="cv-textarea"
              rows={4}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
            />
            
            <div className="cv-btn-row">
              <button 
                className="cv-copy-main-btn"
                onClick={() => handleCopy('main', customText)}
              >
                {copiedId === 'main' ? <Check size={16} /> : <Copy size={16} />}
                {copiedId === 'main' ? '대본 복사 완료!' : '문장 텍스트 복사'}
              </button>

              <a 
                href="http://localhost:7860" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="cv-gen-main-btn"
              >
                <Zap size={16} /> 남편 목소리로 즉시 생성 (스튜디오 이동)
              </a>
            </div>
          </div>

          {/* 원클릭 전체 일괄 가이드 */}
          <div className="cv-batch-guide-card">
            <h4>⚡ 40계단 1화 전체 21문장 일괄 제작</h4>
            <p>맥북 로컬 스튜디오의 <strong>[모드 2]</strong> 탭에서 21개 전체 대본을 한 번에 생성하여 <code>00_전체나레이션_합본.wav</code> 풀 트랙을 바로 얻으실 수 있습니다.</p>
            <div className="cv-path-box">
              📁 <strong>자동 저장 폴더:</strong> <code>Desktop/철만이/시즌2 1화/narration_output/</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
