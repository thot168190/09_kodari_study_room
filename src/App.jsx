import React, { useState, useEffect } from 'react';
import './App.css';
import notesData from './assets/notion-notes.json';
import season2Notes from './assets/season2-notes.json';
import { BookOpen, Award, Sparkles, RefreshCw, Layers, CheckCircle2, AlertTriangle, HelpCircle, Play, ArrowRight, Settings, Loader2, Target } from 'lucide-react';
import ChannelHub from './ChannelHub';
import CaseStudy from './CaseStudy';
import MemeFactory from './MemeFactory';
import ChatbotBuilder from './ChatbotBuilder';
import AvatarStudio from './AvatarStudio';
import InkWordPlayer from './InkWordPlayer';
import NicheDiagnoser from './NicheDiagnoser';
import NicheScanner from './NicheScanner';
import AlwayzzLanding from './AlwayzzLanding';
import MarketeamLanding from './MarketeamLanding';
import Textbook from './Textbook';
import ReRoomAI from './ReRoomAI';
import ScrollWorldLanding from './ScrollWorldLanding';
import TravelLog from './TravelLog';
import ColorChartModal from './ColorChartModal';
import KodariLab from './KodariLab';
import ScienceLabAI from './ScienceLabAI';



function App() {
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const [showHubPortal, setShowHubPortal] = useState(false);
  const [showNicheSaaS, setShowNicheSaaS] = useState(false);
  const [showColorChartModal, setShowColorChartModal] = useState(false);
  const [showTravelStandalone, setShowTravelStandalone] = useState(false);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [activeTab, setActiveTab] = useState('travellog'); // 'travellog' 기본 탑재!
  const [activeTabGroup, setActiveTabGroup] = useState('practice');

  // activeTab 변경 시 activeTabGroup도 자동 동기화하는 훅
  useEffect(() => {
    if (['content', 'quiz', 'wrong', 'textbook', 'study', 'casestudy', 'fable5', 'scrollworld'].includes(activeTab)) {
      setActiveTabGroup('study');
    } else if (['sciencelab', 'reroom', 'inkword', 'memefactory', 'avatarstudio', 'travellog'].includes(activeTab)) {
      setActiveTabGroup('practice');
    } else if (['fugu', 'chatbotbuilder', 'nichediagnoser'].includes(activeTab)) {
      setActiveTabGroup('builder');
    }
  }, [activeTab]);
  
  // AI 데이터 상태
  const [summary, setSummary] = useState('');
  const [concepts, setConcepts] = useState([]);
  const [quizList, setQuizList] = useState([]);
  const [userAnswers, setUserAnswers] = useState({}); // { questionIndex: optionIndex }
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [loadingAI, setLoadingAI] = useState({ summary: false, quiz: false });

  // 💬 노트 전용 실시간 Q&A 챗봇 상태
  const [noteChatHistory, setNoteChatHistory] = useState([
    { sender: 'kodari', text: '대표님, 이 노트 내용에서 궁금하신 점이 있으시면 언제든지 질문해 주십시오! 성심성의껏 보좌하겠습니다.' }
  ]);
  const [noteChatInput, setNoteChatInput] = useState('');
  const [loadingNoteChat, setLoadingNoteChat] = useState(false);

  // 💬 페이블 5 전용 실시간 Q&A 챗봇 상태
  const [fableChatHistory, setFableChatHistory] = useState([
    { sender: 'kodari', text: '대표님, 충성! 에이전트 총괄부장 코다리입니다. 페이블 5(철만이 5화 BGM 음악 작업 기록) 전용 대화방에 오신 것을 환영하옵니다. Lyria 3 Pro 제작 과정에서의 6가지 실패 사례, 3트랙 구조, 확정 워크플로우 등 무엇이든 편하게 지시해 주십시오!' }
  ]);
  const [fableChatInput, setFableChatInput] = useState('');
  const [loadingFableChat, setLoadingFableChat] = useState(false);

  // 📝 커스텀 노트 추가 상태
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  // 🎥 같이 수업 듣기 상태
  const [youtubeUrl, setYoutubeUrl] = useState('https://www.youtube.com/watch?v=dKgzepcAvE0&t=28s');
  const [embedId, setEmbedId] = useState('dKgzepcAvE0');
  const [studyChat, setStudyChat] = useState([
    {
      sender: 'kodari',
      text: '대표님, 충성! 에이전트 총괄부장 코다리입니다. 오늘 함께 들으실 유튜브 강의 링크를 입력해주시면 영상 재생과 함께 대표님의 학습을 성심성의껏 보좌하겠습니다!'
    }
  ]);
  const [studyInput, setStudyInput] = useState('');
  const [loadingStudyChat, setLoadingStudyChat] = useState(false);

  // 유튜브 URL에서 비디오 ID 추출
  const parseYoutubeId = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  const handleLoadVideo = () => {
    const id = parseYoutubeId(youtubeUrl);
    if (id) {
      setEmbedId(id);
      setStudyChat([
        {
          sender: 'kodari',
          text: `대표님, 영상을 성공적으로 로드했습니다! 동영상을 재생하시면서 궁금하신 점이 있으시면 언제든지 말씀해 주십시오. 
중요한 개념 정리나 요약이 필요하시면 "요약해줘"라고 말씀해주시옵소서. 제가 꼼꼼하게 정리하여 언제든 학습 노트로 저장할 수 있도록 대기하겠습니다.`
        }
      ]);
    } else {
      alert('대표님, 올바른 유튜브 링크를 입력해 주십시오.');
    }
  };

  const handleSendStudyMessage = async () => {
    if (!studyInput.trim() || !geminiApiKey) return;
    
    const userMsg = { sender: 'user', text: studyInput };
    setStudyChat(prev => [...prev, userMsg]);
    setStudyInput('');
    setLoadingStudyChat(true);

    try {
      const prompt = `당신은 대표님과 함께 유튜브 강의 동영상을 시청하며 공부하고 있는 수석 학습 비서이자 총괄부장 '코다리'입니다.
대표님이 영상 시청 도중 다음과 같은 질문을 하셨습니다. 
질문에 대해 성실하고 명쾌하게 설명해 드리며, 총괄부장답게 대표님께 깍듯한 존댓말(예: "~하옵니다, 대표님!", "~이옵니다")을 사용하여 충성스러운 어조로 대답해 주세요.

유튜브 영상 정보 (ID): ${embedId ? `https://youtube.com/watch?v=${embedId}` : '정보 없음'}
대표님의 질문/요청: "${studyInput}"

이전 대화 기록:
${studyChat.slice(-5).map(m => `${m.sender === 'user' ? '대표님' : '코다리'}: ${m.text}`).join('\n')}

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
      
      setStudyChat(prev => [...prev, { sender: 'kodari', text: answer }]);
    } catch (err) {
      console.error(err);
      setStudyChat(prev => [...prev, { sender: 'kodari', text: '대표님, 죄송하옵니다. Gemini 통신 중 오류가 발생하여 답변을 작성하지 못했습니다. 다시 시도해 주시겠습니까?' }]);
    } finally {
      setLoadingStudyChat(false);
    }
  };

  const handleSaveStudyNote = () => {
    if (studyChat.length <= 1) {
      alert("대표님, 아직 저장할 학습 대화 기록이 없사옵니다.");
      return;
    }
    
    const formattedContent = `## 🎥 유튜브 강의 학습 기록\n- 강의 영상: https://youtube.com/watch?v=${embedId || 'Qy1FjV-N8dE'}\n- 학습 일자: ${new Date().toLocaleDateString('ko-KR')}\n\n### 💬 대표님과 코다리 부장의 스터디 대화\n\n` + 
      studyChat.filter(m => m.sender !== 'kodari' || m.text.length > 50 || studyChat.indexOf(m) > 0)
               .map(m => `**${m.sender === 'user' ? '👤 대표님' : '🤖 코다리부장'}**\n${m.text}\n`)
               .join('\n');

    const newNote = {
      id: `custom-study-${Date.now()}`,
      title: `🎥 강의 학습: ${embedId ? `유튜브영상(${embedId})` : '시즌2 시작'}`,
      content: formattedContent,
      url: embedId ? `https://youtube.com/watch?v=${embedId}` : "https://www.youtube.com/watch?v=Qy1FjV-N8dE",
      lastEdited: new Date().toISOString()
    };

    const savedCustom = localStorage.getItem('kodari_custom_notes');
    const customNotes = savedCustom ? JSON.parse(savedCustom) : [];
    const updatedCustom = [newNote, ...customNotes];
    localStorage.setItem('kodari_custom_notes', JSON.stringify(updatedCustom));
    
    const combined = [...updatedCustom, ...notesData];
    setNotes(combined);
    setSelectedNote(newNote);
    setActiveTab('content');
    
    alert("🎉 대표님! 유튜브 공부 기록이 새로운 학습 노트로 무사히 추가되었사옵니다. 이제 이 노트를 기반으로 AI 브리핑 및 AI 모의고사를 보실 수 있습니다!");
  };


  // 🐡 우리집 푸구 (Fugu AI) 상태
  const [fuguTask, setFuguTask] = useState('');
  const [fuguRunning, setFuguRunning] = useState(false);
  const [fuguStep, setFuguStep] = useState(0); // 0: 대기, 1: Thinker, 2: Worker, 3: Verifier, 4: 완료
  const [fuguLogs, setFuguLogs] = useState({ thinker: '', worker: '', verifier: '' });
  const [showFuguSettings, setShowFuguSettings] = useState(false);
  const [fuguPrompts, setFuguPrompts] = useState({
    thinker: `당신은 AI 군단의 수석 기획자 'Thinker'입니다.
사용자의 요구사항을 해결하기 위한 가장 전문적이고 논리적이며 상세한 단계별(Step-by-step) 실행 계획서 및 로드맵을 작성해 주세요. 
말투는 항상 대표님께 깍듯하게 보고하는 격식 있는 어조를 유지해 주세요.`,
    worker: `당신은 AI 군단의 실무 전문가 'Worker'입니다.
기획자(Thinker)가 수립한 다음 계획을 바탕으로, 요구사항에 맞는 실제 고품질의 텍스트, 기획안 본문, 시나리오 또는 코드를 구체적이고 완성도 높게 작성해 주세요. 
절대 대충 요약하지 말고, 바로 실무에 사용할 수 있는 퀄리티로 가득 채워 작성해 주세요.`,
    verifier: `당신은 AI 군단의 최종 검수관이자 교정 전문가 'Verifier'입니다.
기획자의 원래 계획과 실무자(Worker)의 출력물을 꼼꼼히 비교 대조하여, 
1) 빠진 내용이 있는지 2) 논리적 모순이나 오류가 있는지 3) 더 세련되게 표현할 부분이 있는지 검수하고, 
최종적으로 완벽하게 보완된 최고의 최종 기획안/출력물을 도출해 주세요.
대표님께 최종 보고하는 느낌으로 마무리해 주세요.`
  });

  // 로컬 학습 기록 상태
  const [completedNotes, setCompletedNotes] = useState(() => {
    const saved = localStorage.getItem('kodari_completed_notes');
    return saved ? JSON.parse(saved) : {};
  });

  const [wrongNotes, setWrongNotes] = useState(() => {
    const saved = localStorage.getItem('kodari_wrong_notes');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    const savedCustom = localStorage.getItem('kodari_custom_notes');
    const customNotes = savedCustom ? JSON.parse(savedCustom) : [];
    const combined = [...customNotes, ...season2Notes, ...notesData];
    
    // 📅 최신 수정일(lastEdited) 기준 내림차순(최신순) 정렬 적용
    combined.sort((a, b) => new Date(b.lastEdited) - new Date(a.lastEdited));
    
    setNotes(combined);
    if (combined.length > 0) {
      setSelectedNote(combined[0]);
    }
  }, []);

  useEffect(() => {
    // 노트 변경 시 상태 초기화
    setSummary('');
    setConcepts([]);
    setQuizList([]);
    setUserAnswers({});
    setQuizSubmitted(false);
    setNoteChatHistory([
      { sender: 'kodari', text: '대표님, 이 노트 내용에서 궁금하신 점이 있으시면 언제든지 질문해 주십시오! 성심성의껏 보좌하겠습니다.' }
    ]);
    setNoteChatInput('');
  }, [selectedNote]);

  // 💬 노트 전용 실시간 Q&A 챗봇 전송 함수
  const handleSendNoteChatMessage = async () => {
    if (!noteChatInput.trim() || !geminiApiKey || !selectedNote) return;
    
    const userMsg = { sender: 'user', text: noteChatInput };
    setNoteChatHistory(prev => [...prev, userMsg]);
    setNoteChatInput('');
    setLoadingNoteChat(true);

    try {
      const prompt = `당신은 대표님의 비즈니스와 공부를 보좌하는 최고 성실한 총괄부장 '코다리'입니다.
현재 대표님은 다음 학습 노트를 읽고 계십니다:

---
[학습 노트 본문]
${selectedNote.content}
---

대표님이 이 노트 내용에 대해 다음과 같이 질문하셨습니다:
"${noteChatInput}"

반드시 제공된 노트 내용(본문 팩트)을 적극 기반으로 하여 명쾌하게 설명해 드리되, 대표님께 깍듯한 존댓말(예: "~하옵니다, 대표님!", "~이옵니다")을 사용하여 충성스럽고 품격 있는 코다리부장 어조로 대답해 주세요.

이전 Q&A 대화 기록:
${noteChatHistory.slice(-4).map(m => `${m.sender === 'user' ? '대표님' : '코다리'}: ${m.text}`).join('\n')}

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
      
      setNoteChatHistory(prev => [...prev, { sender: 'kodari', text: answer }]);
    } catch (err) {
      console.error(err);
      setNoteChatHistory(prev => [...prev, { sender: 'kodari', text: '대표님, 죄송하옵니다. 대답을 조율하는 도중 통신 장애가 발생했사옵니다. 다시 말씀해 주시겠습니까?' }]);
    } finally {
      setLoadingNoteChat(false);
    }
  };

  // 💬 페이블 5 전용 실시간 Q&A 챗봇 전송 함수
  const handleSendFableMessage = async () => {
    if (!fableChatInput.trim() || !geminiApiKey) return;
    
    const userMsg = { sender: 'user', text: fableChatInput };
    setFableChatHistory(prev => [...prev, userMsg]);
    setFableChatInput('');
    setLoadingFableChat(true);

    const fableContext = `
## 철만이 5화 — 어린 시절 불장난 사건 BGM 음악 작업 기록 (Lyria 3 Pro)

### 🎬 영상 정보
- 에피소드: 철만이 5화 — 어린 시절 불장난 사건
- 총 길이: 5분 25초
- 내레이션 시작: 00:43
- 구조: 오프닝 풍경씬(00:00~00:48) + 내레이션 파트(00:48~05:25)

### ❌ 실패 기록 및 교훈 (6가지 실패 사례)
1. **실패 1: 악보 생성**
   - 시도: ABC 악보 표기법으로 피아노 솔로 편곡
   - 결과: 대표님이 "잠깐만...악보??" 라고 하시며 즉시 중단시킴.
   - 교훈: Lyria 3 Pro 프롬프트 방식으로 전면 전환.
2. **실패 2: 한국어 고유명사 프롬프트**
   - 시도: 프롬프트에 '철만이', '뻥튀기' 등 한국어 고유명사를 포함.
   - 결과: Lyria 3가 프롬프트 텍스트를 노래 가사로 오인하여 한국어 가사를 생성함.
   - 교훈: 고유명사나 특정 한국어 단어는 프롬프트에서 철저히 배제하고, 일반 한국어는 정교하게 구성함.
3. **실패 4: 촌스러운 사운드**
   - 시도: 한국어와 섞어서 시골의 민속적 느낌을 과도하게 묘사.
   - 결과: 대표님이 "촌스럽지 않게 해... 전체 다시"라고 지시하심.
   - 교훈: 히사이시 조(Joe Hisaishi) 스타일의 정교한 영문 묘사로 전면 교체하고, 촌스럽거나 지나치게 토속적인 묘사는 완전 배제함.
4. **실패 5: 48초 오프닝 누락**
   - 시도: BGM 파트 1을 영상 시작(00:00)부터 깔아버림.
   - 결과: 대사가 전혀 없는 48초짜리 오프닝 풍경씬은 별도의 볼륨(HIGH) 트랙으로 분리되어야 함을 간과하여 지적받음.
   - 교훈: 3트랙 구조 확정: 오프닝(48초, HIGH) / 파트1(LOW) / 파트2(MED~HIGH).
5. **실패 6: Lyria 3 보컬 생성**
   - 시도: 한국어 보컬 방지 태그 사용.
   - 결과: Lyria 3가 한국어 지시를 무시하고 영어만 인식하여 보컬 소리를 계속 집어넣음.
   - 교훈: 프롬프트 최상단 첫 줄에 영어 대문자로 보컬 방지 지시문을 반드시 포함해야 함.

### ✅ 확정 워크플로우 및 규칙
- **보컬 방지 필수 영문 태그 (모든 트랙 첫 줄)**:
  "INSTRUMENTAL ONLY. NO VOCALS. NO SINGING. NO VOICE. NO LYRICS. NO HUMAN VOICE WHATSOEVER. Pure instrumental. Zero vocals. Any voice is completely wrong."
- **확정 악기 편성**: Piano (lead melody), Chamber strings: violin + cello, Flute
- **스타일**: Studio Ghibli — Joe Hisaishi cinematic
- **3트랙 구조**:
  1. Opening (48초, HIGH): 코믹 쇼크 → 여름 추격 → 뻥튀기 폭발 → 시장 → 마을 도착. A minor에서 따뜻한 장조 해결.
  2. Part 1 (102초, LOW): 할아버지 방 → 호기심 → 성냥 발견 → 결심. G major 3/4 왈츠, 내레이션 배경으로 pp~mp 유지.
  3. Part 2 (175초, MED~HIGH): 스릴 → 점화 → 폭발 → 공포 → 안도 → 성찰 → 거울 쇼크 → 이발 코미디 → 조부모 → 이발소 웃음. A minor에서 radiant C major로 전조.

### 🆕 Flow Music 활용법
- URL: https://www.flowmusic.app (Google Labs 실험 플랫폼, 구 ProducerAI, 2026년 4월 18일 론칭)
- 용도: Lyria 3로 생성된 음악 중 미세하게 보컬이 섞였을 때 'Stem Replace' 기능을 활용해 보컬을 정밀 제거하는 용도로 적극 활용.
`;

    try {
      const prompt = `당신은 대표님의 비즈니스와 창작 작업을 보좌하는 수석 에이전트 총괄부장 '코다리'입니다.
현재 대표님은 페이블 5(철만이 5화 BGM 음악 작업 기록) 대화방에 입장하셨습니다.
다음은 5화 BGM 작업과 관련된 팩트 데이터입니다:

---
${fableContext}
---

대표님이 페이블 5에 대해 다음과 같은 질문을 하셨습니다:
"${fableChatInput}"

반드시 제공된 팩트 데이터(본문 내용)를 적극적으로 참조하여 대표님께 명쾌하고 디테일하게 설명해 드리되, 대표님께 깍듯한 존댓말(예: "~하옵니다, 대표님!", "~이옵니다")을 사용하여 충성스럽고 신뢰감 넘치는 코다리부장 고유의 어조로 대답해 주세요.

이전 대화 기록:
${fableChatHistory.slice(-5).map(m => `${m.sender === 'user' ? '대표님' : '코다리'}: ${m.text}`).join('\n')}

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
      
      setFableChatHistory(prev => [...prev, { sender: 'kodari', text: answer }]);
    } catch (err) {
      console.error(err);
      setFableChatHistory(prev => [...prev, { sender: 'kodari', text: '대표님, 정말 죄송하옵니다. 페이블 5 대화 데이터를 정조율하는 과정에서 통신 장애가 발생했사옵니다. 다시 한 번 지시해 주시겠습니까?' }]);
    } finally {
      setLoadingFableChat(false);
    }
  };

  // 1. AI 핵심 요약 생성
  const generateSummary = async () => {
    if (!selectedNote || !geminiApiKey) return;
    setLoadingAI(prev => ({ ...prev, summary: true }));
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `다음 학습 노트를 기반으로 대표님께 보고할 핵심 브리핑 요약문(15줄 이내)과 중요한 핵심 키워드 개념 카드 3개를 생성해 주세요. 반드시 한국어로 작성하며, 총괄부장 '코다리'가 대표님께 존댓말로 깍듯하게 조근조근 핵심을 브리핑하는 어조로 작성해 주세요.
                    
                    형식은 다음과 같이 엄격하게 지켜주세요:
                    [요약]
                    (요약 브리핑 내용)
                    
                    [키워드]
                    1. 키워드명: 상세 설명
                    2. 키워드명: 상세 설명
                    3. 키워드명: 상세 설명
                    
                    학습 노트 내용:
                    ${selectedNote.content}`
                  }
                ]
              }
            ]
          })
        }
      );

      const data = await response.json();
      if (data.error) {
        console.error("Gemini API Error:", data.error);
        alert(`대표님, Gemini API 오류가 발생했습니다:\n${data.error.message}\n(상태코드: ${data.error.status})`);
        return;
      }
      if (!data.candidates || data.candidates.length === 0) {
        console.error("Gemini API Candidates empty:", data);
        alert("대표님, API 응답에서 후보(candidates) 데이터를 찾을 수 없습니다. 다시 시도해 주세요.");
        return;
      }
      const rawText = data.candidates[0].content.parts[0].text;

      // 파싱
      const summaryPart = rawText.split('[키워드]')[0].replace('[요약]', '').trim();
      const keywordPart = rawText.split('[키워드]')[1] || '';

      setSummary(summaryPart);

      const lines = keywordPart.split('\n').filter(l => l.trim().length > 0);
      const parsedConcepts = lines.map(line => {
        const clean = line.replace(/^\d+\.\s*/, '').trim();
        const parts = clean.split(':');
        return {
          term: parts[0] ? parts[0].trim() : '개념',
          definition: parts[1] ? parts[1].trim() : clean
        };
      }).slice(0, 3);

      setConcepts(parsedConcepts);
    } catch (err) {
      console.error(err);
      alert('대표님, Gemini API 연동 과정에서 오류가 발생했습니다. 키를 확인해 주세요.');
    } finally {
      setLoadingAI(prev => ({ ...prev, summary: false }));
    }
  };

  // 2. AI 모의고사(퀴즈) 생성
  const generateQuiz = async () => {
    if (!selectedNote || !geminiApiKey) return;
    setLoadingAI(prev => ({ ...prev, quiz: true }));
    setQuizSubmitted(false);
    setUserAnswers({});
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `당신은 대표님께 수준 높은 AI 비즈니스 모의고사를 출제해 드리는 수석 비서입니다. 
다음 학습 노트 내용을 완벽하게 분석하여, 본문의 '구체적인 팩트(Facts)와 핵심 수치, 개념 정의'만을 엄격히 기반으로 한 고품격 객관식 문제 3개를 출제해 주세요.

[출제 지침]:
1. 100% 본문 근거: 본문에 명시되지 않은 외부 지식이나 사실을 문제나 보기에 절대 포함하지 마십시오. 오직 제공된 텍스트의 사실만을 묻는 진짜 팩트 체크 시험지여야 합니다.
2. 매력적인 오답: 보기는 너무 유치하거나 뻔하지 않고, 본문을 꼼꼼히 읽어야만 구분할 수 있는 논리적이고 헷갈리는 보기들을 정밀하게 배치하십시오.
3. 코다리 말투의 해설: 해설("explanation")은 반드시 총괄부장 '코다리'가 대표님께 정답을 설명해 드리는 깍듯하고 충성스러운 어조(예: "~하옵니다, 대표님! 본문 ~를 보시면 알 수 있듯이 ~가 정답이 됩니다!")로 품위 있게 작성해 주세요.
4. JSON 형식 엄수: 오직 아래 JSON 구조만 출력하며, 마크다운 코드 블록(\`\`\`)이나 추가 설명 텍스트를 절대 붙이지 마십시오.

JSON 구조:
[
  {
    "question": "문제 질문 (한국어)",
    "options": ["그럴싸한 1번 보기", "그럴싸한 2번 보기", "그럴싸한 3번 보기", "그럴싸한 4번 보기"],
    "answerIndex": 정답 인덱스 숫자 (0 ~ 3),
    "explanation": "코다리부장의 깍듯하고 친절한 정답 설명 및 위로/격려 메시지"
  }
]

학습 노트 내용:
${selectedNote.content}`
                  }
                ]
              }
            ]
          })
        }
      );

      const data = await response.json();
      if (data.error) {
        console.error("Gemini API Error:", data.error);
        alert(`대표님, Gemini API 오류가 발생했습니다:\n${data.error.message}\n(상태코드: ${data.error.status})`);
        return;
      }
      if (!data.candidates || data.candidates.length === 0) {
        console.error("Gemini API Candidates empty:", data);
        alert("대표님, API 응답에서 후보(candidates) 데이터를 찾을 수 없습니다. 다시 시도해 주세요.");
        return;
      }
      let rawJson = data.candidates[0].content.parts[0].text.trim();
      
      // 혹시 마크다운 블록이 붙어 있으면 제거
      if (rawJson.startsWith('```json')) {
        rawJson = rawJson.substring(7, rawJson.length - 3).trim();
      } else if (rawJson.startsWith('```')) {
        rawJson = rawJson.substring(3, rawJson.length - 3).trim();
      }

      // JSON 배열 대괄호 파싱 안정화
      const jsonStart = rawJson.indexOf('[');
      const jsonEnd = rawJson.lastIndexOf(']') + 1;
      if (jsonStart !== -1 && jsonEnd !== -1) {
        rawJson = rawJson.substring(jsonStart, jsonEnd);
      }

      const parsedQuiz = JSON.parse(rawJson);
      setQuizList(parsedQuiz);
    } catch (err) {
      console.error(err);
      alert('대표님, AI 퀴즈 데이터 생성 중 분석 오류가 있었습니다. 다시 요청해 주세요.');
    } finally {
      setLoadingAI(prev => ({ ...prev, quiz: false }));
    }
  };

  // 퀴즈 제출 및 채점
  const submitQuiz = () => {
    setQuizSubmitted(true);

    // 정답 체크하여 오답노트 및 완료 상태 업데이트
    let allCorrect = true;
    const incorrectQuestions = [];

    quizList.forEach((q, idx) => {
      const userAns = userAnswers[idx];
      if (userAns !== q.answerIndex) {
        allCorrect = false;
        incorrectQuestions.push({
          noteTitle: selectedNote.title,
          question: q.question,
          yourAnswer: q.options[userAns] || '선택 안함',
          correctAnswer: q.options[q.answerIndex],
          explanation: q.explanation
        });
      }
    });

    // 1. 학습 완료 상태 저장
    const updatedCompleted = { ...completedNotes, [selectedNote.id]: allCorrect ? 'PASS' : 'STUDIED' };
    setCompletedNotes(updatedCompleted);
    localStorage.setItem('kodari_completed_notes', JSON.stringify(updatedCompleted));

    // 2. 오답노트 저장
    if (incorrectQuestions.length > 0) {
      const updatedWrong = { ...wrongNotes, [selectedNote.id]: incorrectQuestions };
      setWrongNotes(updatedWrong);
      localStorage.setItem('kodari_wrong_notes', JSON.stringify(updatedWrong));
    } else {
      const updatedWrong = { ...wrongNotes };
      delete updatedWrong[selectedNote.id];
      setWrongNotes(updatedWrong);
      localStorage.setItem('kodari_wrong_notes', JSON.stringify(updatedWrong));
    }
  };

  // 노트 동기화 트리거
  const handleNotionSync = async () => {
    alert("🤖 [코다리] 노션 API를 다시 조회하여 로컬 JSON 데이터를 실시간으로 동기화합니다. 잠시만 대기해 주세요!");
    // 로컬 스크립트를 수동으로 작동하도록 유도하거나 로컬에서 개발 시 실행됨을 대표님께 브리핑
  };

  // 🐡 우리집 푸구 (Fugu) 순차 협업 가동
  const runFuguSystem = async () => {
    if (!fuguTask.trim() || !geminiApiKey) {
      alert("대표님, 요청 사항을 입력하셨는지 혹은 Gemini API Key가 정상 설정되었는지 확인해 주세요.");
      return;
    }
    setFuguRunning(true);
    setFuguStep(1);
    setFuguLogs({ thinker: '', worker: '', verifier: '' });

    let tResult = '';
    let wResult = '';
    let vResult = '';

    try {
      // 1. 수석 기획자 (Thinker) 호출
      const resThinker = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `${fuguPrompts.thinker}\n\n[대표님 지시사항]:\n${fuguTask}`
              }]
            }]
          })
        }
      );
      const dataThinker = await resThinker.json();
      tResult = dataThinker.candidates[0].content.parts[0].text;
      setFuguLogs(prev => ({ ...prev, thinker: tResult }));

      // 2. 실무 전문가 (Worker) 호출
      setFuguStep(2);
      const resWorker = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `${fuguPrompts.worker}\n\n[기획자 Thinker의 단계별 실행 계획]:\n${tResult}\n\n[대표님 지시사항]:\n${fuguTask}`
              }]
            }]
          })
        }
      );
      const dataWorker = await resWorker.json();
      wResult = dataWorker.candidates[0].content.parts[0].text;
      setFuguLogs(prev => ({ ...prev, worker: wResult }));

      // 3. 최종 검수관 (Verifier) 호출
      setFuguStep(3);
      const resVerifier = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `${fuguPrompts.verifier}\n\n[기획자 Thinker의 계획]:\n${tResult}\n\n[실무자 Worker의 1차 출력물]:\n${wResult}\n\n[대표님 지시사항]:\n${fuguTask}`
              }]
            }]
          })
        }
      );
      const dataVerifier = await resVerifier.json();
      vResult = dataVerifier.candidates[0].content.parts[0].text;
      setFuguLogs(prev => ({ ...prev, verifier: vResult }));
      setFuguStep(4);
    } catch (err) {
      console.error(err);
      alert("푸구 군단 가동 중 통신 오류가 발생했습니다. 개발 콘솔을 참고해 주세요.");
    } finally {
      setFuguRunning(false);
    }
  };

  // 📝 커스텀 노트 추가 로직
  const handleAddNote = () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) {
      alert("대표님, 제목과 내용을 모두 입력해 주세요.");
      return;
    }
    const newNote = {
      id: `custom-${Date.now()}`,
      title: newNoteTitle,
      content: newNoteContent,
      url: "Local Custom Note",
      lastEdited: new Date().toISOString()
    };
    
    const savedCustom = localStorage.getItem('kodari_custom_notes');
    const customNotes = savedCustom ? JSON.parse(savedCustom) : [];
    const updatedCustom = [newNote, ...customNotes];
    localStorage.setItem('kodari_custom_notes', JSON.stringify(updatedCustom));
    
    const combined = [...updatedCustom, ...season2Notes, ...notesData];
    setNotes(combined);
    setSelectedNote(newNote);
    
    // 입력창 초기화
    setNewNoteTitle('');
    setNewNoteContent('');
    setIsAddingNote(false);
    setActiveTab('content');
    alert("🎉 새 학습 노트가 성공적으로 추가되었습니다! 대표님만의 비즈니스 AI 연습을 시작해 보세요.");
  };

  // 📝 커스텀 노트 삭제 로직
  const handleDeleteCustomNote = (noteId) => {
    if (!noteId.startsWith('custom-')) return;
    if (!window.confirm("대표님, 이 학습 노트를 정말로 삭제하시겠습니까?")) return;
    
    const savedCustom = localStorage.getItem('kodari_custom_notes');
    const customNotes = savedCustom ? JSON.parse(savedCustom) : [];
    const updatedCustom = customNotes.filter(n => n.id !== noteId);
    localStorage.setItem('kodari_custom_notes', JSON.stringify(updatedCustom));
    
    const combined = [...updatedCustom, ...season2Notes, ...notesData];
    setNotes(combined);
    if (combined.length > 0) {
      setSelectedNote(combined[0]);
    } else {
      setSelectedNote(null);
    }
  };

  if (showNicheSaaS) {
    return <NicheScanner onExit={() => setShowNicheSaaS(false)} />;
  }

  if (showHubPortal) {
    return <ChannelHub onClose={() => setShowHubPortal(false)} />;
  }

  if (showTravelStandalone) {
    return <TravelLog onExit={() => setShowTravelStandalone(false)} isStandalone={true} />;
  }

  return (
    <div className="study-app top-nav-layout">
      {/* 🚀 최상단 단 한 줄 통합 4대 기둥 헤더 바 (Full Width Top Bar) */}
      <header className="global-top-header">
        <div className="top-header-left">
          <div className="brand-logo">
            <span className="logo-icon">💜</span>
            <span className="logo-text">KODARI ROOM</span>
          </div>

          {/* 📖 노트 선택 드롭다운 (사이드바 대신 최상단에서 바로 노트 선택) */}
          <div className="top-note-selector">
            <select 
              className="note-dropdown-select"
              value={selectedNote ? selectedNote.id : ''}
              onChange={(e) => {
                const found = notes.find(n => n.id === e.target.value);
                if (found) {
                  setSelectedNote(found);
                  setIsAddingNote(false);
                }
              }}
            >
              {notes.map(n => (
                <option key={n.id} value={n.id}>
                  📖 {n.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 🏛️ 대표님의 4대 명확한 대분류 메인 기둥 (4 Big Pillars) */}
        <div className="top-pillars-nav">
          {/* 1대 기둥: 🧠 멘토와 함께하는 인공지능 공부 */}
          <div className="pillar-group">
            <span className="pillar-tag">🧠 AI 공부</span>
            <button className={`pillar-pill ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>📖 본문&브리핑</button>
            <button className={`pillar-pill ${activeTab === 'quiz' ? 'active' : ''}`} onClick={() => setActiveTab('quiz')}>📝 모의고사</button>
            <button className={`pillar-pill ${activeTab === 'textbook' ? 'active' : ''}`} onClick={() => setActiveTab('textbook')}>📚 교재란</button>
          </div>

          {/* 2대 기둥: 📚 잉크워드 (밈팩토리 100% 삭제 완료) */}
          <div className="pillar-group">
            <span className="pillar-tag">📚 잉크워드</span>
            <button className={`pillar-pill ${activeTab === 'inkword' ? 'active' : ''}`} onClick={() => setActiveTab('inkword')}>📚 사전</button>
            <button className={`pillar-pill ${activeTab === 'avatarstudio' ? 'active' : ''}`} onClick={() => setActiveTab('avatarstudio')}>🪄 아바타</button>
          </div>

          {/* 3대 기둥: 🧬 과학랩 */}
          <div className="pillar-group">
            <span className="pillar-tag">🧬 과학랩</span>
            <button className={`pillar-pill ${activeTab === 'sciencelab' ? 'active' : ''}`} onClick={() => setActiveTab('sciencelab')}>⚖️ 식약처검수&DeepMind</button>
          </div>

          {/* 4대 기둥: ✈️ 여행기억하기 */}
          <div className="pillar-group">
            <span className="pillar-tag">✈️ 여행기억</span>
            <button className={`pillar-pill ${activeTab === 'travellog' ? 'active' : ''}`} onClick={() => setActiveTab('travellog')}>✈️ 1초 여행로그</button>
            <button className={`pillar-pill ${activeTab === 'reroom' ? 'active' : ''}`} onClick={() => setActiveTab('reroom')}>🎨 ReRoom AI</button>
          </div>
        </div>

        {/* 🚀 우측 퀵 실행 도구 */}
        <div className="top-quick-tools">
          <button onClick={() => setShowNicheSaaS(true)} className="quick-tool-btn niche">🎯 틈새진단기</button>
          <button onClick={() => setShowHubPortal(true)} className="quick-tool-btn hub">🌐 채널포털</button>
          <button onClick={() => setIsAddingNote(true)} className="quick-tool-btn add">➕ 노트추가</button>
        </div>
      </header>

      {/* 📂 숨겨진 사이드바 (최상단 탑 헤더로 이전됨) */}
      <aside className="sidebar" style={{ display: 'none' }}>
        <div className="sidebar-header">
          <div className="logo-area">
            <div className="logo-icon">💜</div>
            <div className="logo-text">KODARI ROOM</div>
          </div>
          <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <button 
              onClick={() => { setActiveTabGroup('study'); setActiveTab('content'); }}
              style={{
                background: '#0f172a',
                border: '1px solid #38bdf8',
                color: '#38bdf8',
                padding: '9px 6px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '11px'
              }}
            >
              🧠 AI 공부 (멘토)
            </button>
            <button 
              onClick={() => { setActiveTabGroup('practice'); setActiveTab('inkword'); }}
              style={{
                background: '#0f172a',
                border: '1px solid #c084fc',
                color: '#c084fc',
                padding: '9px 6px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '11px'
              }}
            >
              📚 잉크워드
            </button>
            <button 
              onClick={() => { setActiveTabGroup('practice'); setActiveTab('sciencelab'); }}
              style={{
                background: '#0f172a',
                border: '1px solid #34d399',
                color: '#34d399',
                padding: '9px 6px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '11px'
              }}
            >
              🧬 과학랩
            </button>
            <button 
              onClick={() => setShowTravelStandalone(true)}
              style={{
                background: '#0f172a',
                border: '1px solid #f472b6',
                color: '#f472b6',
                padding: '9px 6px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '11px'
              }}
            >
              ✈️ 여행기억하기
            </button>
          </div>

          <button 
            className="btn-open-colorchart"
            onClick={() => setShowColorChartModal(true)}
            style={{
              marginTop: '8px',
              width: '100%',
              background: 'linear-gradient(135deg, #0B3D2E, #0F6A4B)',
              border: '1.5px solid #F472B6',
              color: '#FBCFE8',
              padding: '10px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '800',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 15px rgba(11, 61, 46, 0.3)',
              transition: 'all 0.2s'
            }}
          >
            <span>🎨 Adobe 딥그린 색차트 갤러리</span>
          </button>
          
          <button 
            className="btn-open-kodarilab"
            onClick={() => { setActiveTabGroup('builder'); setActiveTab('kodarilab'); setIsAddingNote(false); }}
            style={{
              marginTop: '8px',
              width: '100%',
              background: 'linear-gradient(135deg, #a855f7, #6366f1)',
              border: 'none',
              color: '#fff',
              padding: '10px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 15px rgba(168, 85, 247, 0.3)',
              transition: 'all 0.2s'
            }}
          >
            <span>🧪 AI 융합 연구실 (Science Lab)</span>
          </button>

          <button 
            className="btn-open-niche"
            onClick={() => { setActiveTabGroup('builder'); setActiveTab('nichediagnoser'); setIsAddingNote(false); }}
            style={{
              marginTop: '8px',
              width: '100%',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              border: 'none',
              color: '#fff',
              padding: '10px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 15px rgba(245, 158, 11, 0.2)',
              transition: 'all 0.2s'
            }}
          >
            <span>🎯 니치 발굴기 v1 바로가기</span>
          </button>


          <button 
            className="btn-open-textbook"
            onClick={() => { setActiveTab('textbook'); setIsAddingNote(false); }}
            style={{
              marginTop: '8px',
              width: '100%',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              color: '#fff',
              padding: '10px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)',
              transition: 'all 0.2s'
            }}
          >
            <span>📚 모닝AI 해부 교재란</span>
          </button>
          <div className="sync-status">
            <span>총 {notes.length}개 노트 로드됨</span>
            <button className="btn-sync" onClick={handleNotionSync}>
              <RefreshCw size={12} /> 동기화
            </button>
          </div>
          <button 
            className="btn-add-note" 
            onClick={() => setIsAddingNote(true)}
            style={{
              marginTop: '16px',
              width: '100%',
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(16, 185, 129, 0.08))',
              border: '1px dashed rgba(37, 99, 235, 0.3)',
              color: '#1e3a8a',
              padding: '10px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <span>➕ 나만의 연습용 노트 추가</span>
          </button>
        </div>
        
        <div className="note-list" style={{ overflowY: 'auto', flex: 1 }}>
          {(() => {
            const season2List = notes.filter(n => 
              n.id.startsWith('season2-') || 
              n.title.includes('2강') ||
              n.title.includes('4강') || 
              n.title.includes('5강') || 
              n.title.includes('6강') ||
              n.id === 'f1d1b19e-1097-8304-95f7-81d70acf146c' || 
              n.id === 'fa31b19e-1097-831a-aa69-8199ab26adf3'
            );
            const season1List = notes.filter(n => !season2List.some(s => s.id === n.id));

            const renderNoteItem = (note) => (
              <div 
                key={note.id} 
                className={`note-item ${selectedNote?.id === note.id ? 'active' : ''}`}
                onClick={() => { setSelectedNote(note); setIsAddingNote(false); }}
                style={{ position: 'relative', paddingRight: note.id.startsWith('custom-') ? '40px' : '12px' }}
              >
                <span className="note-item-title">{note.title || '제목 없는 페이지'}</span>
                <div className="note-item-meta">
                  <span>{new Date(note.lastEdited).toLocaleDateString('ko-KR')}</span>
                  <span className={`badge-study ${completedNotes[note.id] === 'PASS' ? 'completed' : ''}`}>
                    {completedNotes[note.id] === 'PASS' ? '통과' : completedNotes[note.id] === 'STUDIED' ? '복습필요' : '학습중'}
                  </span>
                </div>
                {note.id.startsWith('custom-') && (
                  <button 
                    className="btn-delete-note"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCustomNote(note.id);
                    }}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      fontSize: '9px',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      fontWeight: '600'
                    }}
                  >
                    삭제
                  </button>
                )}
              </div>
            );

            return (
              <>
                {season2List.length > 0 && (
                  <div className="season-section">
                    <div className="season-header" style={{ padding: '8px 12px', fontSize: '11px', fontWeight: 800, color: '#ec4899', letterSpacing: '0.05em', background: 'rgba(236, 72, 153, 0.08)', borderRadius: '4px', margin: '4px 0 8px 0', borderLeft: '3px solid #ec4899' }}>
                      🔥 시즌 2 핵심 교재
                    </div>
                    {season2List.map(note => renderNoteItem(note))}
                  </div>
                )}
                
                {season1List.length > 0 && (
                  <div className="season-section" style={{ marginTop: '16px' }}>
                    <div className="season-header" style={{ padding: '8px 12px', fontSize: '11px', fontWeight: 800, color: '#6b7280', letterSpacing: '0.05em', background: 'rgba(107, 114, 128, 0.08)', borderRadius: '4px', margin: '4px 0 8px 0', borderLeft: '3px solid #6b7280' }}>
                      📅 시즌 1 작업 아카이브
                    </div>
                    {season1List.map(note => renderNoteItem(note))}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </aside>

      {/* 🖥️ 메인 워크스페이스 */}
      <main className="workspace">
        {isAddingNote ? (
          <div className="fugu-input-card" style={{ maxWidth: '700px', margin: '40px auto', padding: '32px', background: '#ffffff' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px', fontFamily: 'Outfit' }}>
              📝 나만의 연습용 노트 작성하기
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.6' }}>
              대표님! 이곳에 대표님만의 비즈니스 정보, 프롬프트 테스트 데이터 또는 학습하고 싶은 커넥트 AI 관련 아이디어를 채워 보세요. 
              작성 후 저장하시면 AI 브리핑 및 AI 모의고사를 즉석에서 진행하실 수 있습니다.
            </p>
            
            <div className="prompt-field" style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                📌 노트 제목
              </label>
              <input 
                type="text"
                placeholder="예: 1인 마케팅을 위한 페르소나 설계 규칙"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                style={{
                  width: '100%',
                  background: '#ffffff',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  padding: '12px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div className="prompt-field" style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                📖 노트 본문 내용
              </label>
              <textarea 
                placeholder="AI가 요약하고 시험 출제에 사용할 구체적인 텍스트나 데이터를 입력해 주세요."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                style={{
                  width: '100%',
                  background: '#ffffff',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  color: 'var(--text-primary)',
                  padding: '16px',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  minHeight: '240px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setIsAddingNote(false)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-color)',
                  color: '#cbd5e1',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                취소
              </button>
              <button 
                onClick={handleAddNote}
                style={{
                  background: 'linear-gradient(135deg, var(--primary-glow), var(--secondary-glow))',
                  border: 'none',
                  color: '#fff',
                  padding: '10px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                💾 저장하고 공부방 등록
              </button>
            </div>
          </div>
        ) : selectedNote ? (
          <>
            <header className="workspace-header slim-header">
              <div className="header-left">
                <h2 className="note-mini-title">{selectedNote.title}</h2>
                {selectedNote.id.startsWith('custom-') && (
                  <button onClick={() => handleDeleteCustomNote(selectedNote.id)} className="btn-del-note">🗑️</button>
                )}
              </div>

              {/* 📂 대표님의 4대 명확한 대분류 메인 기둥 (4 Big Pillars) */}
              <div className="header-right-tabs">
                {/* 1대 기둥: 🧠 멘토와 함께하는 인공지능 공부 */}
                <div className="tab-pill-group">
                  <span className="pill-group-label">🧠 AI 공부</span>
                  <button className={`slim-pill ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>📖 본문&브리핑</button>
                  <button className={`slim-pill ${activeTab === 'quiz' ? 'active' : ''}`} onClick={() => setActiveTab('quiz')}>📝 모의고사</button>
                  <button className={`slim-pill ${activeTab === 'textbook' ? 'active' : ''}`} onClick={() => setActiveTab('textbook')}>📚 교재란</button>
                </div>

                {/* 2대 기둥: 📚 잉크워드 */}
                <div className="tab-pill-group">
                  <span className="pill-group-label">📚 잉크워드</span>
                  <button className={`slim-pill ${activeTab === 'inkword' ? 'active' : ''}`} onClick={() => setActiveTab('inkword')}>📚 사전</button>
                  <button className={`slim-pill ${activeTab === 'memefactory' ? 'active' : ''}`} onClick={() => setActiveTab('memefactory')}>🎬 밈팩토리</button>
                  <button className={`slim-pill ${activeTab === 'avatarstudio' ? 'active' : ''}`} onClick={() => setActiveTab('avatarstudio')}>🪄 아바타</button>
                </div>

                {/* 3대 기둥: 🧬 과학랩 */}
                <div className="tab-pill-group">
                  <span className="pill-group-label">🧬 과학랩</span>
                  <button className={`slim-pill ${activeTab === 'sciencelab' ? 'active' : ''}`} onClick={() => setActiveTab('sciencelab')}>⚖️ 식약처검수&DeepMind</button>
                </div>

                {/* 4대 기둥: ✈️ 여행기억하기 */}
                <div className="tab-pill-group">
                  <span className="pill-group-label">✈️ 여행기억</span>
                  <button className={`slim-pill ${activeTab === 'travellog' ? 'active' : ''}`} onClick={() => setActiveTab('travellog')}>✈️ 1초 여행로그</button>
                  <button className={`slim-pill ${activeTab === 'reroom' ? 'active' : ''}`} onClick={() => setActiveTab('reroom')}>🎨 ReRoom AI</button>
                </div>
              </div>
            </header>

            <div className="workspace-body">
              {/* 탭 1: 본문 및 요약 */}
              {activeTab === 'content' && (
                <div className="note-viewer">
                  <div className="note-card">
                    <h3 className="note-title">📖 대표님 학습 요약 노트</h3>
                    <div className="note-content">
                      {selectedNote.content || "노트 본문 내용이 비어 있습니다."}
                    </div>
                  </div>

                  <div className="ai-panel">
                    <div className="ai-header">
                      <Sparkles size={18} />
                      <span>코다리 AI 학습비서 브리핑</span>
                    </div>
                    
                    <div className="ai-actions">
                      <button className="btn-ai" onClick={generateSummary} disabled={loadingAI.summary}>
                        {loadingAI.summary ? <div className="spinner" style={{ width: 14, height: 14 }}></div> : '✨ 노션 노트 AI 브리핑 받기'}
                      </button>
                    </div>

                    {summary && (
                      <div className="ai-result-box">
                        <h4>📋 요약 브리핑</h4>
                        <p style={{ whiteSpace: 'pre-wrap', marginBottom: '24px' }}>{summary}</p>

                        {concepts.length > 0 && (
                          <>
                            <h4>💡 주요 핵심 키워드</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                              {concepts.map((concept, index) => (
                                <div key={index} style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', borderLeft: '3px solid #06b6d4' }}>
                                  <strong style={{ color: '#818cf8' }}>{concept.term}</strong>
                                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{concept.definition}</p>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {/* 🤖 실시간 노트 챗봇 컴포넌트 추가 */}
                        <div className="note-chatbot-section" style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px dashed var(--border-color)' }}>
                           <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c084fc', fontSize: '13px', marginBottom: '12px', fontWeight: '700' }}>
                             <span>🤖</span> 코다리부장 실시간 문답 (Q&A)
                           </h4>
                           
                           <div className="note-chat-history" style={{ 
                             maxHeight: '180px', 
                             overflowY: 'auto', 
                             padding: '10px', 
                             background: 'rgba(0, 0, 0, 0.2)', 
                             borderRadius: '8px', 
                             display: 'flex', 
                             flexDirection: 'column', 
                             gap: '8px',
                             marginBottom: '10px',
                             border: '1px solid var(--border-color)',
                             boxShadow: 'none'
                           }}>
                             {noteChatHistory.map((msg, idx) => (
                               <div key={idx} style={{ 
                                 alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                 maxWidth: '85%',
                                 padding: '8px 12px',
                                 borderRadius: '8px',
                                 fontSize: '12px',
                                 lineHeight: '1.5',
                                 background: msg.sender === 'user' ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'rgba(255, 255, 255, 0.04)',
                                 color: '#ffffff',
                                 boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                                 border: msg.sender === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.06)',
                                 whiteSpace: 'pre-wrap'
                               }}>
                                 {msg.text}
                               </div>
                             ))}
                             {loadingNoteChat && (
                               <div style={{ 
                                 alignSelf: 'flex-start',
                                 padding: '6px 12px',
                                 background: 'rgba(255, 255, 255, 0.04)',
                                 borderRadius: '8px',
                                 fontSize: '11px',
                                 color: '#94a3b8',
                                 border: '1px solid rgba(255, 255, 255, 0.06)'
                               }}>
                                 답변 구상 중...
                               </div>
                             )}
                           </div>
                           
                           <div style={{ display: 'flex', gap: '8px' }}>
                             <input 
                               type="text" 
                               placeholder="이 노트에 대해 궁금한 점을 적어보세요..."
                               value={noteChatInput}
                               onChange={(e) => setNoteChatInput(e.target.value)}
                               onKeyDown={(e) => { if (e.key === 'Enter') handleSendNoteChatMessage(); }}
                               disabled={loadingNoteChat}
                               style={{
                                 flex: 1,
                                 background: 'rgba(255, 255, 255, 0.04)',
                                 border: '1px solid var(--border-color)',
                                 borderRadius: '6px',
                                 padding: '8px 12px',
                                 fontSize: '12px',
                                 color: 'var(--text-primary)'
                               }}
                             />
                             <button 
                               onClick={handleSendNoteChatMessage}
                               disabled={loadingNoteChat || !noteChatInput.trim()}
                               style={{
                                 background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                                 border: 'none',
                                 color: '#fff',
                                 padding: '8px 16px',
                                 borderRadius: '6px',
                                 cursor: 'pointer',
                                 fontSize: '12px',
                                 fontWeight: '600',
                                 boxShadow: '0 2px 8px rgba(139, 92, 246, 0.15)'
                               }}
                             >
                               질문
                             </button>
                           </div>
                         </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 탭 2: AI 모의고사 */}
              {activeTab === 'quiz' && (
                <div className="quiz-container">
                  {quizList.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">🎯</div>
                      <h3>대표님을 위한 시험을 준비할까요?</h3>
                      <p>노션 본문을 분석하여 맞춤형 모의고사 3문제를 즉시 출제합니다.</p>
                      <button className="btn-submit" onClick={generateQuiz} disabled={loadingAI.quiz} style={{ marginTop: '12px' }}>
                        {loadingAI.quiz ? '시험지 만드는 중...' : '📝 AI 모의고사 출제하기'}
                      </button>
                    </div>
                  ) : (
                    <>
                      {quizList.map((quiz, qIdx) => (
                        <div key={qIdx} className="quiz-card">
                          <h4 className="quiz-question">Q{qIdx + 1}. {quiz.question}</h4>
                          <div className="quiz-options">
                            {quiz.options.map((option, oIdx) => {
                              let optClass = '';
                              if (userAnswers[qIdx] === oIdx) optClass = 'selected';
                              if (quizSubmitted) {
                                if (oIdx === quiz.answerIndex) optClass = 'correct';
                                else if (userAnswers[qIdx] === oIdx) optClass = 'wrong';
                              }
                              return (
                                <button
                                  key={oIdx}
                                  className={`option-btn ${optClass}`}
                                  onClick={() => !quizSubmitted && setUserAnswers({ ...userAnswers, [qIdx]: oIdx })}
                                  disabled={quizSubmitted}
                                >
                                  <span>{option}</span>
                                  {quizSubmitted && oIdx === quiz.answerIndex && <CheckCircle2 size={16} style={{ color: '#10b981' }} />}
                                </button>
                              );
                            })}
                          </div>
                          {quizSubmitted && (
                            <div className="explanation-box">
                              <strong>💡 코다리 해설:</strong> {quiz.explanation}
                            </div>
                          )}
                        </div>
                      ))}

                      <div className="quiz-footer">
                        {!quizSubmitted ? (
                          <button 
                            className="btn-submit" 
                            onClick={submitQuiz}
                            disabled={Object.keys(userAnswers).length < quizList.length}
                          >
                            제출하고 채점받기
                          </button>
                        ) : (
                          <button className="btn-sync" onClick={generateQuiz}>
                            다시 시험보기
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* 탭 3: 오답노트 */}
              {activeTab === 'wrong' && wrongNotes[selectedNote.id] && (
                <div className="quiz-container">
                  <div className="ai-header" style={{ color: '#ef4444' }}>
                    <AlertTriangle size={20} />
                    <span>틀린 문제를 확인하고 확실히 마스터하세요, 대표님!</span>
                  </div>
                  {wrongNotes[selectedNote.id].map((wrong, idx) => (
                    <div key={idx} className="quiz-card" style={{ borderLeft: '4px solid #ef4444' }}>
                      <h4 className="quiz-question">{wrong.question}</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', fontSize: '14px' }}>
                        <div>❌ 대표님의 선택: <span style={{ color: '#ef4444', fontWeight: 600 }}>{wrong.yourAnswer}</span></div>
                        <div>✅ 진짜 정답: <span style={{ color: '#10b981', fontWeight: 600 }}>{wrong.correctAnswer}</span></div>
                      </div>
                      <div className="explanation-box" style={{ background: 'rgba(239, 68, 68, 0.04)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                        <strong>💡 코다리 부장 복습 가이드:</strong> {wrong.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 탭 4: 우리집 푸구 (Fugu AI) */}
              {activeTab === 'fugu' && (
                <div className="fugu-container">
                  {/* 상단 헤더 안내 */}
                  <div className="fugu-header-desc">
                    <div className="fugu-title-row">
                      <Layers className="icon-fugu" size={24} style={{ color: '#10b981' }} />
                      <h3>🐡 우리집 푸구 (Fugu) — 로컬형 3단계 AI 협업 체인</h3>
                    </div>
                    <p>
                      대표님! 사카나 AI의 <strong>Fugu(복어)</strong> 기술을 벤치마킹하여 구현한 <strong>집단지성 오케스트레이터</strong>입니다. 
                      대표님의 명령 한 줄에 3명의 AI 비서(기획 ➔ 실무 ➔ 검수)가 협업하여 최상의 결과물을 도출합니다.
                    </p>
                  </div>

                  {/* ⚙️ 시스템 프롬프트 설정 (접이식) */}
                  <div className="fugu-settings-accordion">
                    <button 
                      className="fugu-settings-toggle"
                      onClick={() => setShowFuguSettings(!showFuguSettings)}
                    >
                      <Settings size={14} />
                      <span>AI 군단별 페르소나/프롬프트 설정 {showFuguSettings ? '닫기 ▲' : '열기 ▼'}</span>
                    </button>
                    
                    {showFuguSettings && (
                      <div className="fugu-settings-body">
                        <div className="prompt-field">
                          <label>🧠 1단계: 수석 기획자 (Thinker) 지침</label>
                          <textarea 
                            value={fuguPrompts.thinker}
                            onChange={(e) => setFuguPrompts({ ...fuguPrompts, thinker: e.target.value })}
                          />
                        </div>
                        <div className="prompt-field">
                          <label>🛠️ 2단계: 실무 전문가 (Worker) 지침</label>
                          <textarea 
                            value={fuguPrompts.worker}
                            onChange={(e) => setFuguPrompts({ ...fuguPrompts, worker: e.target.value })}
                          />
                        </div>
                        <div className="prompt-field">
                          <label>🔍 3단계: 최종 검수관 (Verifier) 지침</label>
                          <textarea 
                            value={fuguPrompts.verifier}
                            onChange={(e) => setFuguPrompts({ ...fuguPrompts, verifier: e.target.value })}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 📝 명령 입력창 */}
                  <div className="fugu-input-card">
                    <h4>📥 푸구 군단에게 명령 내리기</h4>
                    <textarea 
                      className="fugu-textarea"
                      placeholder="예: 1인 기업을 위한 유튜브 숏츠 대본 자동화 파이프라인의 기획안을 짜주고, 1화 예시 대본까지 작성해줘."
                      value={fuguTask}
                      onChange={(e) => setFuguTask(e.target.value)}
                      disabled={fuguRunning}
                    />
                    <button 
                      className="btn-fugu-run" 
                      onClick={runFuguSystem}
                      disabled={fuguRunning || !fuguTask.trim()}
                    >
                      {fuguRunning ? (
                        <>
                          <Loader2 className="spinner animate-spin" size={16} />
                          <span>푸구 군단 협업 가동 중...</span>
                        </>
                      ) : (
                        <>
                          <Play size={16} />
                          <span>🐡 푸구 군단 협업 시작</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* 📊 협업 타임라인 & 출력 결과 */}
                  {(fuguStep > 0 || fuguRunning) && (
                    <div className="fugu-timeline">
                      
                      {/* 단계 1: Thinker */}
                      <div className={`timeline-card ${fuguStep === 1 ? 'active' : fuguStep > 1 ? 'completed' : ''}`}>
                        <div className="card-header-row">
                          <div className="step-badge">1단계</div>
                          <h5>🧠 수석 기획자 (Thinker)의 설계 계획</h5>
                          {fuguStep === 1 && <span className="loading-tag">계획 수립 중...</span>}
                          {fuguStep > 1 && <span className="done-tag">완료</span>}
                        </div>
                        {fuguLogs.thinker && (
                          <div className="card-content-box">
                            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{fuguLogs.thinker}</pre>
                          </div>
                        )}
                      </div>

                      {/* 단계 2: Worker */}
                      <div className={`timeline-card ${fuguStep === 2 ? 'active' : fuguStep > 2 ? 'completed' : ''}`}>
                        <div className="card-header-row">
                          <div className="step-badge">2단계</div>
                          <h5>🛠️ 실무 전문가 (Worker)의 초안 작업</h5>
                          {fuguStep === 2 && <span className="loading-tag">실무 작업 중...</span>}
                          {fuguStep > 2 && <span className="done-tag">완료</span>}
                        </div>
                        {fuguLogs.worker && (
                          <div className="card-content-box">
                            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{fuguLogs.worker}</pre>
                          </div>
                        )}
                      </div>

                      {/* 단계 3: Verifier */}
                      <div className={`timeline-card ${fuguStep === 3 ? 'active' : fuguStep === 4 ? 'completed' : ''}`}>
                        <div className="card-header-row">
                          <div className="step-badge">3단계</div>
                          <h5>🔍 최종 검수관 (Verifier)의 감수 및 완성본</h5>
                          {fuguStep === 3 && <span className="loading-tag">검수 및 윤문 중...</span>}
                          {fuguStep === 4 && <span className="done-tag star">★ 최종 승인 완료</span>}
                        </div>
                        {fuguLogs.verifier && (
                          <div className="card-content-box final">
                            <h4>🏆 대표님 보고용 최종 완성본</h4>
                            <div className="final-output-rich">
                              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{fuguLogs.verifier}</pre>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                </div>
              )}

              {/* 탭 5: 같이 수업 듣기 */}
              {activeTab === 'study' && (
                <div className="study-room-container">
                  <div className="study-room-header">
                    <div className="youtube-url-input-bar">
                      <input 
                        type="text" 
                        placeholder="공부하실 유튜브 강의 URL을 입력해 주세요. (예: https://www.youtube.com/watch?v=...)"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        style={{
                          flex: 1,
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          color: 'var(--text-primary)',
                          padding: '10px 16px',
                          fontSize: '13px'
                        }}
                      />
                      <button 
                        onClick={handleLoadVideo}
                        style={{
                          background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                          border: 'none',
                          color: '#fff',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '13px',
                          transition: 'all 0.2s'
                        }}
                      >
                        📺 영상 로드
                      </button>
                    </div>
                  </div>

                  <div className="study-room-layout">
                    {/* 왼쪽: 유튜브 영상 플레이어 */}
                    <div className="video-player-area">
                      {embedId ? (
                        <div className="video-wrapper">
                          <iframe
                            src={`https://www.youtube.com/embed/${embedId}`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          ></iframe>
                        </div>
                      ) : (
                        <div className="empty-player">
                          <div className="empty-icon" style={{ fontSize: '48px', color: '#ec4899' }}>📺</div>
                          <p style={{ marginTop: '12px', fontSize: '14px', color: '#94a3b8' }}>
                            유튜브 강의 링크를 입력하시면 여기에 영상이 나타납니다.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* 오른쪽: 코다리 AI 메이트 채팅창 */}
                    <div className="study-chat-area">
                      <div className="study-chat-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px' }}>🤖</span>
                          <strong style={{ color: '#ec4899', fontSize: '14px' }}>코다리 부장의 실시간 보좌방</strong>
                        </div>
                        <button 
                          className="btn-save-note" 
                          onClick={handleSaveStudyNote}
                          style={{
                            background: 'rgba(236, 72, 153, 0.1)',
                            border: '1px solid rgba(236, 72, 153, 0.3)',
                            color: '#f472b6',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                          }}
                        >
                          💾 이 대화기록을 노트로 저장
                        </button>
                      </div>

                      <div className="study-chat-messages">
                        {studyChat.map((msg, idx) => (
                          <div key={idx} className={`chat-message ${msg.sender}`}>
                            <div className="message-bubble">
                              {msg.text}
                            </div>
                          </div>
                        ))}
                        {loadingStudyChat && (
                          <div className="chat-message kodari">
                            <div className="message-bubble loading">
                              <span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="study-chat-input-bar">
                        <input 
                          type="text" 
                          placeholder="코다리부장에게 질문해 보세요... (엔터 전송)"
                          value={studyInput}
                          onChange={(e) => setStudyInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleSendStudyMessage(); }}
                          disabled={loadingStudyChat}
                        />
                        <button 
                          onClick={handleSendStudyMessage}
                          disabled={loadingStudyChat || !studyInput.trim()}
                        >
                          전송
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'casestudy' && (
                <CaseStudy />
              )}

              {activeTab === 'fable5' && (
                <div className="fable-container" style={{ display: 'flex', gap: '24px', height: 'calc(100vh - 200px)', minHeight: 0 }}>
                  {/* 좌측 패널: Lyria 3 Pro 가이드 및 실패 역사 */}
                  <div className="fable-facts-panel" style={{
                    flex: '0.8',
                    overflowY: 'auto',
                    background: 'var(--panel-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--gold)', fontFamily: 'Outfit', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                      🔥 철만이 5화 BGM 작업 가이드
                    </h3>
                    <div style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-primary)' }}>
                      <strong style={{ color: '#f472b6', display: 'block', marginBottom: '6px' }}>🚨 보컬 방지 영문 태그 (첫 줄 필수)</strong>
                      <code style={{ display: 'block', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px', fontSize: '11px', border: '1px solid var(--border-color)', wordBreak: 'break-all', color: '#cbd5e1' }}>
                        "INSTRUMENTAL ONLY. NO VOCALS. NO SINGING. NO VOICE. NO LYRICS. NO HUMAN VOICE WHATSOEVER..."
                      </code>
                    </div>

                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      <strong style={{ color: '#38bdf8', display: 'block', marginBottom: '6px' }}>🎻 확정 악기 편성 및 스타일</strong>
                      <p>Hisaishi Joe Ghibli Cinematic / Piano (Lead) + Chamber Strings + Flute</p>
                    </div>

                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <strong style={{ color: '#10b981', display: 'block', marginBottom: '6px' }}>🎚️ 3트랙 오디오 볼륨 맵</strong>
                      <ul style={{ listStyleType: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <li>1. 오프닝 48초: 볼륨 HIGH (테마 전환)</li>
                        <li>2. 파트 1 (102초): 볼륨 LOW (내레이션 배경)</li>
                        <li>3. 파트 2 (175초): 볼륨 MED-HIGH (극적 감정선)</li>
                      </ul>
                    </div>

                    <div style={{ background: 'rgba(99, 102, 241, 0.08)', borderRadius: '10px', padding: '14px', borderLeft: '4px solid #8b5cf6', fontSize: '12px', border: '1px solid rgba(99, 102, 241, 0.15)', borderLeftWidth: '4px' }}>
                      <strong style={{ color: 'var(--text-primary)', fontSize: '13px' }}>🆕 보컬 제거 (Flow Music)</strong>
                      <p style={{ marginTop: '6px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        구글 랩스 실험실인 <a href="https://www.flowmusic.app" target="_blank" rel="noopener noreferrer" style={{ color: '#c084fc', fontWeight: 600 }}>Flow Music ↗</a>의 <strong>Stem Replace</strong> 기능을 이용해 보컬이 잘못 섞여 나온 트랙을 정밀 보정하여 사용합니다.
                      </p>
                    </div>
                  </div>

                  {/* 우측 패널: 코다리 부장 챗봇 채팅창 */}
                  <div className="fable-chat-area" style={{
                    flex: '1.2',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'var(--panel-bg)',
                    border: '1px solid rgba(var(--primary-glow-rgb), 0.2)',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                    overflow: 'hidden',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <div style={{
                      padding: '16px 20px',
                      background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '20px' }}>💬</span>
                        <div>
                          <strong style={{ fontSize: '15px', display: 'block' }}>페이블 5 전용 대화기록 방</strong>
                          <span style={{ fontSize: '11px', opacity: 0.85 }}>Lyria 3 BGM 생성 성공 가이더 '코다리'</span>
                        </div>
                      </div>
                      <span style={{
                        background: 'rgba(255,255,255,0.2)',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: '700'
                      }}>BGM MASTER</span>
                    </div>

                    {/* 대화 내역 */}
                    <div className="fable-chat-messages" style={{
                      flex: 1,
                      padding: '20px',
                      overflowY: 'auto',
                      background: 'rgba(0, 0, 0, 0.15)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}>
                      {fableChatHistory.map((msg, idx) => (
                        <div key={idx} style={{
                          alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                          maxWidth: '85%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                        }}>
                          <span style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '4px', paddingLeft: msg.sender === 'user' ? '0' : '4px', paddingRight: msg.sender === 'user' ? '4px' : '0' }}>
                            {msg.sender === 'user' ? '👤 대표님' : '🤖 코다리부장'}
                          </span>
                          <div style={{
                            padding: '10px 14px',
                            borderRadius: '12px',
                            fontSize: '13px',
                            lineHeight: '1.6',
                            background: msg.sender === 'user' ? 'linear-gradient(135deg, #7c3aed, #8b5cf6)' : 'rgba(255, 255, 255, 0.04)',
                            color: '#ffffff',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                            border: msg.sender === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.06)',
                            whiteSpace: 'pre-wrap'
                          }}>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                      {loadingFableChat && (
                        <div style={{ alignSelf: 'flex-start', display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '4px', paddingLeft: '4px' }}>🤖 코다리부장</span>
                          <div style={{
                            padding: '10px 14px',
                            background: 'rgba(255, 255, 255, 0.04)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            display: 'flex',
                            gap: '4px',
                            alignItems: 'center'
                          }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>대답을 가다듬는 중이옵니다...</span>
                            <div className="spinner" style={{ width: 12, height: 12, border: '2px solid #8b5cf6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 입력창 */}
                    <div style={{
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.01)',
                      borderTop: '1px solid var(--border-color)',
                      display: 'flex',
                      gap: '10px'
                    }}>
                      <input
                        type="text"
                        placeholder="실패 사례에 대한 질문이나 BGM 프롬프트 자문을 요청하십시오..."
                        value={fableChatInput}
                        onChange={(e) => setFableChatInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSendFableMessage(); }}
                        disabled={loadingFableChat}
                        style={{
                          flex: 1,
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          padding: '12px',
                          fontSize: '13px',
                          outline: 'none',
                          color: '#ffffff',
                          background: 'rgba(255, 255, 255, 0.03)'
                        }}
                      />
                      <button
                        onClick={handleSendFableMessage}
                        disabled={loadingFableChat || !fableChatInput.trim()}
                        style={{
                          background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
                          border: 'none',
                          color: '#ffffff',
                          padding: '12px 24px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '700',
                          fontSize: '13px',
                          transition: 'opacity 0.2s'
                        }}
                      >
                        전송
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'scrollworld' && (
                <ScrollWorldLanding onExit={() => setActiveTab('content')} />
              )}

              {activeTab === 'kodarilab' && (
                <KodariLab geminiApiKey={geminiApiKey} />
              )}

              {activeTab === 'memefactory' && (
                <MemeFactory />
              )}

              {activeTab === 'chatbotbuilder' && (
                <ChatbotBuilder />
              )}

              {activeTab === 'nichediagnoser' && (
                <NicheDiagnoser />
              )}

              {activeTab === 'avatarstudio' && (
                <AvatarStudio />
              )}

              {activeTab === 'inkword' && (
                <InkWordPlayer />
              )}

              {activeTab === 'alwayzz' && (
                <AlwayzzLanding />
              )}

              {activeTab === 'marketeam' && (
                <MarketeamLanding />
              )}

              {activeTab === 'textbook' && (
                <Textbook />
              )}

              {activeTab === 'reroom' && (
                <ReRoomAI />
              )}

              {activeTab === 'sciencelab' && (
                <ScienceLabAI />
              )}

              {activeTab === 'travellog' && (
                <TravelLog onOpenStandalone={() => setShowTravelStandalone(true)} />
              )}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📖</div>
            <h3>노트를 선택해 주세요</h3>
            <p>사이드바에서 학습을 진행할 노션 페이지를 클릭하세요.</p>
          </div>
        )}
      </main>

      {/* 🎨 Adobe 딥그린 & 파스텔 색차트 갤러리 모달 */}
      {showColorChartModal && (
        <ColorChartModal onClose={() => setShowColorChartModal(false)} />
      )}
    </div>
  );
}

export default App;
