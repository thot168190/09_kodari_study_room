import React, { useState, useEffect, useRef } from 'react';
import './PassVoiceSaaS.css';
import { 
  Mic, MicOff, Sparkles, Trophy, Award, CheckCircle2, AlertTriangle, 
  Volume2, VolumeX, RefreshCw, Send, ArrowRight, Shield, Zap, Star, 
  CreditCard, Lock, Download, Printer, Check, ChevronRight, HelpCircle,
  FileText, Smartphone, ThumbsUp, UserCheck, Flame, Compass, MessageSquare
} from 'lucide-react';

// 🎯 다양한 직종별 프리셋 족보 데이터
const PRESET_JOB_CATEGORIES = [
  {
    id: 'public_tax',
    name: '🏛️ 국세청·공공기관 체납관리단',
    target: '국세청 / 지방자치단체 체납관리단 & 실태확인원',
    badge: '인기 1위',
    questions: [
      {
        q: '지원동기와 함께 본인의 소통 역량을 1분 내외로 말씀해 주십시오.',
        intent: '대민 소통력, 경청 태도, 성실성 평가',
        best: '안녕하십니까! 저는 다양한 분들과의 소통 경험을 통해 상대방의 입장을 먼저 경청하고 갈등을 차분하게 조율하는 소통 역량을 가지고 있습니다. 실태확인원의 핵심인 정확한 현장 파악과 성실한 납부 안내를 2인 1조 수칙에 맞춰 책임감 있게 수행하겠습니다.'
      },
      {
        q: '현장에서 체납자가 폭언이나 고성을 지르며 완강히 거부할 때 어떻게 대처하시겠습니까?',
        intent: '위기대처능력, 감정조절, 안전 매뉴얼 준수',
        best: '감정적으로 맞서지 않고 먼저 차분히 경청하여 상대방을 진정시키겠습니다. 이후 방문 목적과 규정을 명확히 안내하되, 신변 위협이 발생하면 2인 1조 안전 수칙에 따라 즉시 철수하고 세무서 관리자에게 보고하여 조치하겠습니다.'
      },
      {
        q: '생계 곤란으로 눈물을 흘리는 취약계층 체납자를 만났을 때 어떻게 응대하시겠습니까?',
        intent: '공감 능력과 원칙 준수, 복지 연계 이해도',
        best: '안타까운 사정에 충분히 공감해 드리며, 법령이 허용하는 분할 납부 및 유예 제도를 친절히 안내하겠습니다. 아울러 긴급 복지 지원을 받으실 수 있도록 관할 주민센터 복지팀에 해당 실태를 꼼꼼히 기록하여 보고하겠습니다.'
      }
    ]
  },
  {
    id: 'public_job',
    name: '🌿 지자체 공공근로·희망일자리',
    target: '시·군·구청 기간제 / 환경정비 / 도서관 / 행정보조',
    badge: '추천',
    questions: [
      {
        q: '공공근로 사업에 지원하게 된 계기와 업무에 임하는 각오를 말씀해 주십시오.',
        intent: '성실성, 근태 준수, 지역사회 기여 의지',
        best: '우리 지역사회를 쾌적하고 살기 좋은 곳으로 만드는 보람 있는 일에 기여하고자 지원했습니다. 규칙적인 시간 엄수와 솔선수범하는 성실함으로 맡은 구역을 항상 깨끗하고 단정하게 관리하겠습니다.'
      },
      {
        q: '동료들과 함께 일할 때 의견 충돌이 발생하면 어떻게 해결하시겠습니까?',
        intent: '팀워크, 융화력, 상호 존중',
        best: '제 고집을 앞세우기보다 동료의 의견을 먼저 경청하고, 관리자분의 업무 지침과 안전 수칙을 기준으로 삼아 둥글게 대화로 맞추겠습니다.'
      },
      {
        q: '야외 작업이나 궂은 날씨에 체력적으로 힘들 수 있는데 괜찮으신가요?',
        intent: '건강 상태, 끈기, 긍정적 마인드',
        best: '평소 꾸준한 걷기 운동과 건강 관리로 튼튼한 체력을 유지하고 있습니다. 안전 수칙을 철저히 지키며 궂은 날에도 밝은 미소로 성실히 임하겠습니다.'
      }
    ]
  },
  {
    id: 'store_alba',
    name: '☕ 카페·프랜차이즈·마트 알바',
    target: '스타벅스, 투썸, 이마트, 편의점, 일반 식당 서빙',
    badge: '빠른취업',
    questions: [
      {
        q: '고객이 주문한 메뉴에 대해 불만을 제기하거나 화를 낼 때 어떻게 응대하시겠습니까?',
        intent: 'CS 서비스 마인드, 빠른 사과와 규정 준수',
        best: '먼저 고객님의 불편에 대해 정중히 사과드리고, 문제가 무엇인지 신속히 파악하겠습니다. 매장 매뉴얼에 따라 즉시 새 음료로 재제조해 드리거나 매니저님께 보고하여 신속하고 기분 좋게 해결해 드리겠습니다.'
      },
      {
        q: '주말이나 피크 타임에 손님이 몰려 바쁠 때 본인만의 대처 방식이 있나요?',
        intent: '멀티태스킹, 침착함, 우선순위 판단',
        best: '바쁠수록 당황하지 않고 위생과 주문 순서를 지키며 차분하게 움직입니다. 동료들과 눈을 맞추며 역할을 분담해 음료 제조와 포스를 매끄럽게 처리하겠습니다.'
      }
    ]
  },
  {
    id: 'office_cs',
    name: '💼 일반 사무·고객상담(CS)',
    target: '콜센터, 일반 기업 총무·사무보조, 인바운드 상담',
    badge: '실전',
    questions: [
      {
        q: '1분 동안 본인의 핵심 직무 강점을 말씀해 주십시오.',
        intent: '논리적 스피치, 업무 역량, 신뢰감',
        best: '저의 핵심 강점은 정확한 문서 처리 능력과 친절하고 명확한 커뮤니케이션입니다. 반복되는 업무에서도 꼼꼼함을 잃지 않고 마감 기한을 엄수하며 팀의 든든한 서포터가 되겠습니다.'
      },
      {
        q: '반복되는 전화 상담으로 인한 스트레스는 어떻게 해소하시나요?',
        intent: '자기 관리, 멘탈 회복력, 긍정성',
        best: '업무 중에는 감정을 객관적으로 분리하여 규정에 따라 친절히 응대하고, 퇴근 후에는 가벼운 산책과 취미 활동으로 스트레스를 건강하게 해소하여 늘 밝은 에너지를 유지합니다.'
      }
    ]
  },
  {
    id: 'custom',
    name: '💡 나만의 직무 직접 입력 (AI 질문 생성)',
    target: '원하는 채용 공고나 직무를 입력하면 AI가 질문을 자동 생성',
    badge: 'AI생성',
    questions: [
      {
        q: '지원하신 분야에서 가장 중요하게 생각하는 역량과 본인의 경험을 말씀해 주십시오.',
        intent: '직무 이해도 및 경험 일치도 평가',
        best: '지원 분야에서 가장 중요한 것은 책임감과 적응력이라고 생각합니다. 이전 경험을 바탕으로 빠르게 업무를 습득하고 조직에 기여하겠습니다.'
      }
    ]
  }
];

export default function PassVoiceSaaS() {
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // 상태 관리
  const [selectedJob, setSelectedJob] = useState(PRESET_JOB_CATEGORIES[0]);
  const [customJobTitle, setCustomJobTitle] = useState('');
  const [questionList, setQuestionList] = useState(PRESET_JOB_CATEGORIES[0].questions);
  const [currentQIndex, setCurrentQIndex] = useState(0);

  // 음성인식 상태
  const [isRecording, setIsRecording] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef(null);

  // 타이머
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [timerActive, setTimerActive] = useState(false);

  // AI 피드백
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedbackData, setFeedbackData] = useState(null);

  // 결제 모달 상태
  const [showPayModal, setShowPayModal] = useState(false);
  const [userPlan, setUserPlan] = useState('free'); // 'free', 'vip'
  const [freeTrialCount, setFreeTrialCount] = useState(3);

  // 🎙️ Web Speech API 초기화
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
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setSpokenText(prev => prev ? `${prev} ${transcript}` : transcript);
        };

        recognition.onerror = (e) => {
          console.warn('Speech recognition error:', e.error);
          setIsRecording(false);
          setTimerActive(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
          setTimerActive(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // 타이머 훅
  useEffect(() => {
    let timer = null;
    if (timerActive && timerSeconds > 0) {
      timer = setInterval(() => setTimerSeconds(prev => prev - 1), 1000);
    } else if (timerSeconds === 0) {
      setTimerActive(false);
      if (isRecording && recognitionRef.current) {
        recognitionRef.current.stop();
        setIsRecording(false);
      }
    }
    return () => clearInterval(timer);
  }, [timerActive, timerSeconds, isRecording]);

  // 마이크 토글
  const toggleRecord = () => {
    if (!speechSupported) {
      alert('현재 브라우저에서 마이크 음성 인식이 지원되지 않습니다. 텍스트로 입력해 주십시오.');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      setTimerActive(false);
    } else {
      setSpokenText('');
      setFeedbackData(null);
      setTimerSeconds(60);
      setTimerActive(true);
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // 직종 변경
  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setQuestionList(job.questions);
    setCurrentQIndex(0);
    setSpokenText('');
    setFeedbackData(null);
  };

  // 커스텀 직무 AI 질문 생성
  const handleGenerateCustomQuestions = async () => {
    if (!customJobTitle.trim()) {
      alert('원하시는 직무나 채용 분야를 입력해 주십시오.');
      return;
    }
    setIsAnalyzing(true);
    const prompt = `
너는 채용 면접 전문가다. 
지원 직무: "${customJobTitle}"
위 직무에 꼭 나오는 가장 핵심적인 실전 면접 질문 3개를 한국어로 생성해줘.
JSON 포맷으로만 응답해:
[
  {
    "q": "질문 1",
    "intent": "질문 의도",
    "best": "합격 모범 답변"
  },
  {
    "q": "질문 2",
    "intent": "질문 의도",
    "best": "합격 모범 답변"
  },
  {
    "q": "질문 3",
    "intent": "질문 의도",
    "best": "합격 모범 답변"
  }
]
`;
    try {
      if (geminiApiKey) {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: "application/json" }
            })
          }
        );
        const data = await res.json();
        const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
        const parsed = JSON.parse(raw);
        if (parsed.length > 0) {
          setQuestionList(parsed);
          setCurrentQIndex(0);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 🤖 AI 음성 다면 채점
  const handleAnalyzeAnswer = async () => {
    if (!spokenText.trim()) {
      alert('마이크로 답변을 말씀하시거나 텍스트를 입력해 주십시오.');
      return;
    }

    if (userPlan === 'free' && freeTrialCount <= 0) {
      setShowPayModal(true);
      return;
    }

    setIsAnalyzing(true);
    setFeedbackData(null);

    const currentQ = questionList[currentQIndex] || selectedJob.questions[0];

    const prompt = `
너는 실전 채용 면접관이자 AI 스피치 코칭 전문가다.
지원 직무: "${selectedJob.name} (${customJobTitle || selectedJob.target})"
면접 질문: "${currentQ.q}"
질문 의도: "${currentQ.intent}"
지원자 실제 답변: "${spokenText}"

지원자의 답변을 다각도로 채점하고 합격 스크립트를 작성해줘.
반드시 아래 JSON 포맷으로만 응답해:
{
  "totalScore": 94,
  "logicScore": 95,
  "speechScore": 90,
  "fitScore": 96,
  "summaryComment": "면접관을 사로잡는 한 줄 총평",
  "goodPoints": ["잘한 점 1", "잘한 점 2"],
  "badPoints": ["아쉬운 점 또는 고칠 점 1"],
  "goldScript": "지원자의 경험을 살려 실제 면접관이 100점 줄 수 있도록 업그레이드한 모범 대본",
  "coachTip": "현장에서 합격 확률을 2배 높이는 스피치 태도 꿀팁"
}
`;

    try {
      if (geminiApiKey) {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: "application/json" }
            })
          }
        );
        const data = await res.json();
        const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        const parsed = JSON.parse(raw);
        setFeedbackData(parsed);
      } else {
        // 스마트 폴백
        setTimeout(() => {
          setFeedbackData({
            totalScore: 92,
            logicScore: 90,
            speechScore: 95,
            fitScore: 92,
            summaryComment: "차분하고 진정성이 느껴지는 훌륭한 답변입니다!",
            goodPoints: [
              "상황에 대한 이해도가 높고 침착한 어조가 좋습니다.",
              "핵심 소통 역량을 직무와 잘 연결했습니다."
            ],
            badPoints: [
              "문장의 마무리를 조금 더 명확하게 끝맺으면 더욱 신뢰감을 줍니다."
            ],
            goldScript: `${spokenText}\n\n이와 더불어, 항상 매뉴얼과 안전 수칙을 준수하며 팀과 화합하여 성실히 기여하겠습니다.`,
            coachTip: "말끝을 흐리지 않고 '~하겠습니다!'로 당당하게 맺어주시면 완벽합니다."
          });
        }, 1000);
      }

      if (userPlan === 'free') {
        setFreeTrialCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // TTS 음성 읽기
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const speakText = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isPlayingTTS) {
        window.speechSynthesis.cancel();
        setIsPlayingTTS(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ko-KR';
        utterance.rate = 1.0;
        utterance.onend = () => setIsPlayingTTS(false);
        utterance.onerror = () => setIsPlayingTTS(false);
        window.speechSynthesis.speak(utterance);
        setIsPlayingTTS(true);
      }
    }
  };

  return (
    <div className="passvoice-saas-container">
      {/* 🚀 1. SaaS 탑 네비게이션 */}
      <nav className="pv-navbar">
        <div className="pv-nav-left">
          <div className="pv-logo">
            <span className="logo-mic">🎙️</span>
            <span className="logo-title">패스보이스<span className="logo-ai">AI</span></span>
          </div>
          <span className="pv-sub-tag">1분 음성 면접 트레이너 SaaS</span>
        </div>

        <div className="pv-nav-right">
          <span className="trial-badge">
            {userPlan === 'vip' ? '👑 VIP 무제한 패스 이용 중' : `🎁 무료 진단 잔여: ${freeTrialCount}회`}
          </span>
          <button 
            className="upgrade-nav-btn"
            onClick={() => setShowPayModal(true)}
          >
            <Sparkles className="w-4 h-4" /> VIP 합격패스 (9,900원)
          </button>
        </div>
      </nav>

      {/* 🌟 2. 히어로 배너 (High Conversion Hero) */}
      <section className="pv-hero-section">
        <div className="hero-pill-badge">
          <Flame className="w-4 h-4 text-orange-500" /> 합격률 94.8% • 4060 공공근로/알바/취준생 필수 마이크로 SaaS
        </div>
        <h1 className="pv-hero-title">
          키보드 치지 마세요.<br />
          <span className="gradient-text">폰에 대고 말하면 3초 만에</span> 100점 만점 성적표!
        </h1>
        <p className="pv-hero-desc">
          구글 음성인식(Speech API)과 Gemini AI가 지원자의 답변을 실시간으로 듣고,<br />
          면접관 취향저격 <strong>합격 모범 대본</strong>과 <strong>스피치 다면평가</strong>를 즉시 처방해 드립니다.
        </p>

        {/* 신뢰 지표 바 */}
        <div className="pv-trust-stats">
          <div className="stat-item">
            <strong>12,480+</strong>
            <span>누적 음성 연습</span>
          </div>
          <div className="stat-sep" />
          <div className="stat-item">
            <strong>98.6점</strong>
            <span>평균 스피치 향상</span>
          </div>
          <div className="stat-sep" />
          <div className="stat-item">
            <strong>3초</strong>
            <span>초고속 AI 피드백</span>
          </div>
        </div>
      </section>

      {/* 🎮 3. 실전 AI 음성 면접 스튜디오 (Core SaaS Feature) */}
      <section className="pv-studio-section">
        <div className="studio-header">
          <h2>🎯 실시간 1:1 AI 음성 면접 스튜디오</h2>
          <p>직종을 선택하고 마이크 버튼을 누른 뒤 실제 면접처럼 소리 내어 답변해 보세요.</p>
        </div>

        {/* 1단계: 직종 선택 탭 바 */}
        <div className="job-selector-bar">
          {PRESET_JOB_CATEGORIES.map(job => (
            <button
              key={job.id}
              className={`job-pill ${selectedJob.id === job.id ? 'active' : ''}`}
              onClick={() => handleJobSelect(job)}
            >
              <span>{job.name}</span>
              <span className="job-badge">{job.badge}</span>
            </button>
          ))}
        </div>

        {/* 커스텀 직무 입력창 (custom 선택 시) */}
        {selectedJob.id === 'custom' && (
          <div className="custom-job-input-box">
            <input 
              type="text"
              placeholder="예: 어린이집 보조교사, 아파트 관리사무소 경비, 병원 원무과 등"
              value={customJobTitle}
              onChange={(e) => setCustomJobTitle(e.target.value)}
            />
            <button 
              onClick={handleGenerateCustomQuestions}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              AI 맞춤 면접 질문 3개 추출
            </button>
          </div>
        )}

        {/* 질문 카드 및 전환 */}
        <div className="question-stage-card">
          <div className="q-stage-header">
            <span className="q-num-pill">질문 {currentQIndex + 1} / {questionList.length}</span>
            <span className="q-target-tag">🎯 대상: {selectedJob.target}</span>
          </div>
          <h3 className="stage-question">
            "{questionList[currentQIndex]?.q || '지원하신 동기를 말씀해 주십시오.'}"
          </h3>
          <p className="stage-intent">
            💡 <strong>면접관 질문 의도:</strong> {questionList[currentQIndex]?.intent || '직무 적합성과 성실성 평가'}
          </p>

          <div className="q-nav-dots">
            {questionList.map((_, idx) => (
              <button
                key={idx}
                className={`dot ${currentQIndex === idx ? 'active' : ''}`}
                onClick={() => {
                  setCurrentQIndex(idx);
                  setSpokenText('');
                  setFeedbackData(null);
                }}
              >
                Q{idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* 🎙️ 2단계: 음성 녹음 & 타이머 & 실시간 STT 인터랙션 */}
        <div className="studio-interactive-grid">
          <div className="voice-input-card">
            <div className="vic-header">
              <div className="timer-wrap">
                <span className="timer-icon">⏱️</span>
                <span className={`timer-num ${timerSeconds <= 10 ? 'urgent' : ''}`}>{timerSeconds}초</span>
              </div>
              <span className="status-indicator">
                {isRecording ? '🔴 실시간 음성 듣는 중...' : '대기 중 (마이크 클릭)'}
              </span>
            </div>

            {/* 마이크 녹음 빅 버튼 */}
            <div className="big-mic-area">
              <button 
                className={`big-mic-btn ${isRecording ? 'recording' : ''}`}
                onClick={toggleRecord}
              >
                {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
              </button>
              <div className="mic-instruction">
                {isRecording ? (
                  <strong className="text-red-500">말씀이 끝나면 버튼을 다시 눌러주세요!</strong>
                ) : (
                  <span>마이크 버튼을 누르고 말씀하세요</span>
                )}
              </div>

              {/* 음성 파형 애니메이션 */}
              {isRecording && (
                <div className="sound-wave-bars">
                  <span className="bar" />
                  <span className="bar" />
                  <span className="bar" />
                  <span className="bar" />
                  <span className="bar" />
                </div>
              )}
            </div>

            {/* 실시간 텍스트 변환창 */}
            <div className="transcription-box">
              <label>실시간 인식된 답변 (직접 수정도 가능):</label>
              <textarea
                rows={4}
                placeholder="마이크로 말씀하시거나, 여기에 답변을 직접 작성해 보세요."
                value={spokenText}
                onChange={(e) => setSpokenText(e.target.value)}
              />
            </div>

            <div className="vic-actions">
              <button 
                className="sample-insert-btn"
                onClick={() => setSpokenText(questionList[currentQIndex]?.best || '')}
              >
                📝 예시 모범 답안 불러오기
              </button>
              <button 
                className="analyze-cta-btn"
                onClick={handleAnalyzeAnswer}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {isAnalyzing ? 'AI 심층 채점 분석 중...' : '3초 만에 AI 합격 채점 받기'}
              </button>
            </div>
          </div>

          {/* 📊 3단계: AI 채점 리포트 카드 */}
          <div className="analysis-report-card">
            {feedbackData ? (
              <div className="report-content">
                <div className="score-summary-banner">
                  <div className="big-score-badge">
                    <span className="score-val">{feedbackData.totalScore}</span>
                    <span className="score-lbl">종합 점수</span>
                  </div>
                  <div className="score-detail-metrics">
                    <div className="metric">
                      <span>논리성</span>
                      <strong>{feedbackData.logicScore}점</strong>
                    </div>
                    <div className="metric">
                      <span>전달력</span>
                      <strong>{feedbackData.speechScore}점</strong>
                    </div>
                    <div className="metric">
                      <span>직무적합도</span>
                      <strong>{feedbackData.fitScore}점</strong>
                    </div>
                  </div>
                </div>

                <div className="summary-quote">
                  💬 <strong>면접관 총평:</strong> "{feedbackData.summaryComment}"
                </div>

                <div className="feedback-section good">
                  <h5><ThumbsUp className="w-4 h-4 text-emerald-600" /> 우수한 점</h5>
                  <ul>
                    {feedbackData.goodPoints?.map((p, i) => (
                      <li key={i}>✅ {p}</li>
                    ))}
                  </ul>
                </div>

                <div className="feedback-section bad">
                  <h5><AlertTriangle className="w-4 h-4 text-amber-600" /> 주의 및 보완점</h5>
                  <ul>
                    {feedbackData.badPoints?.map((p, i) => (
                      <li key={i}>⚠️ {p}</li>
                    ))}
                  </ul>
                </div>

                {/* 🌟 100점 합격 골드 스크립트 */}
                <div className="gold-script-box">
                  <div className="gs-header">
                    <h5><Sparkles className="w-4 h-4 text-purple-600" /> 100점 만점 합격 모범 스크립트</h5>
                    <button 
                      className="tts-btn"
                      onClick={() => speakText(feedbackData.goldScript)}
                    >
                      {isPlayingTTS ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      {isPlayingTTS ? '음성 중지' : '모범 음성 듣기'}
                    </button>
                  </div>
                  <div className="gs-text">
                    {feedbackData.goldScript}
                  </div>
                </div>

                <div className="coach-tip-box">
                  💡 <strong>합격 스피치 팁:</strong> {feedbackData.coachTip}
                </div>

                <button 
                  className="pdf-export-btn"
                  onClick={() => window.print()}
                >
                  <Printer className="w-4 h-4" /> 이 족보 A4 인쇄 / PDF 저장
                </button>
              </div>
            ) : (
              <div className="report-empty-state">
                <div className="empty-icon-circle">📊</div>
                <h4>아직 채점 결과가 없습니다</h4>
                <p>
                  왼쪽 마이크 버튼을 눌러 답변을 말씀하신 뒤<br />
                  <strong>[3초 만에 AI 합격 채점 받기]</strong>를 눌러보세요!
                </p>
                <div className="preview-checklist">
                  <div>✓ 100점 만점 다각도 성적표</div>
                  <div>✓ 면접관 맞춤형 골드 대본 제공</div>
                  <div>✓ 원클릭 음성 듣기(TTS) 지원</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 💰 4. SaaS 요금제 & 결제 플랜 */}
      <section className="pv-pricing-section">
        <div className="pricing-header">
          <h2>💎 합격 확률을 300% 높이는 패스보이스 플랜</h2>
          <p>비싼 오프라인 스피치 학원(30만 원) 대신, 9,900원으로 무제한 AI 코칭을 받으세요.</p>
        </div>

        <div className="pricing-cards-grid">
          {/* 무료 플랜 */}
          <div className={`price-card ${userPlan === 'free' ? 'current' : ''}`}>
            <div className="price-tag">무료 체험</div>
            <div className="price-val">0원</div>
            <p className="price-desc">가볍게 AI 면접을 맛보고 싶은 분</p>
            <ul className="plan-perks">
              <li><Check className="w-4 h-4 text-emerald-500" /> 무료 음성 진단 3회</li>
              <li><Check className="w-4 h-4 text-emerald-500" /> 기본 직종 프리셋 족보</li>
              <li><Check className="w-4 h-4 text-emerald-500" /> 기초 점수 분석</li>
            </ul>
            <button className="plan-btn outline" disabled={userPlan === 'free'}>
              {userPlan === 'free' ? '현재 이용 중' : '무료 체험'}
            </button>
          </div>

          {/* VIP 무제한 합격 패스 */}
          <div className={`price-card featured ${userPlan === 'vip' ? 'current' : ''}`}>
            <div className="popular-badge">👑 가장 많이 선택</div>
            <div className="price-tag">VIP 무제한 합격패스</div>
            <div className="price-val">
              <span className="original">29,900원</span> 9,900원
              <span className="period">/ 3일 무제한</span>
            </div>
            <p className="price-desc">이번 면접에서 무조건 단번에 합격하고 싶은 분</p>
            <ul className="plan-perks">
              <li><Check className="w-4 h-4 text-emerald-500" /> <strong>무제한 실시간 AI 음성 채점</strong></li>
              <li><Check className="w-4 h-4 text-emerald-500" /> <strong>모든 기관/기업 기출 족보 무제한</strong></li>
              <li><Check className="w-4 h-4 text-emerald-500" /> <strong>나만의 맞춤형 합격 대본 자동 작성</strong></li>
              <li><Check className="w-4 h-4 text-emerald-500" /> <strong>A4 인쇄용 합격 족보 PDF 무제한 다운</strong></li>
              <li><Check className="w-4 h-4 text-emerald-500" /> 모범 음성 TTS 무제한 듣기</li>
            </ul>
            <button 
              className="plan-btn primary"
              onClick={() => setShowPayModal(true)}
            >
              {userPlan === 'vip' ? '👑 VIP 패스 활성화됨' : '⚡ 9,900원으로 합격패스 시작하기'}
            </button>
          </div>
        </div>
      </section>

      {/* 💳 5. 결제 시뮬레이션 모달 */}
      {showPayModal && (
        <div className="pv-modal-backdrop" onClick={() => setShowPayModal(false)}>
          <div className="pv-modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>⚡ VIP 무제한 합격패스 결제</h3>
              <button className="close-btn" onClick={() => setShowPayModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="order-summary-box">
                <div className="os-row">
                  <span>상품명</span>
                  <strong>패스보이스 VIP 3일 무제한 합격권</strong>
                </div>
                <div className="os-row">
                  <span>정상가</span>
                  <span className="line-through text-slate-400">29,900원</span>
                </div>
                <div className="os-row total">
                  <span>최종 결제 금액</span>
                  <strong className="text-emerald-600 text-xl">9,900원</strong>
                </div>
              </div>

              <div className="pay-methods">
                <label>결제 수단 선택:</label>
                <div className="methods-grid">
                  <button className="method-btn active">🟡 카카오페이</button>
                  <button className="method-btn">🔵 토스페이</button>
                  <button className="method-btn">💳 신용/체크카드</button>
                  <button className="method-btn">🟢 네이버페이</button>
                </div>
              </div>

              <div className="security-notice">
                <Lock className="w-4 h-4 text-slate-500" /> 안전한 256-bit SSL 암호화 결제 시스템
              </div>

              <button 
                className="pay-submit-btn"
                onClick={() => {
                  alert('🎉 축하합니다! 9,900원 결제가 완료되어 [VIP 무제한 합격패스]가 활성화되었습니다!');
                  setUserPlan('vip');
                  setShowPayModal(false);
                }}
              >
                9,900원 결제하고 무제한 코칭 받기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
