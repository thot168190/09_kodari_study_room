import React, { useState, useEffect } from 'react';
import './App.css';
import notesData from './assets/notion-notes.json';
import { BookOpen, Award, Sparkles, RefreshCw, Layers, CheckCircle2, AlertTriangle, HelpCircle, Play, ArrowRight, Settings, Loader2, Target } from 'lucide-react';
import ChannelHub from './ChannelHub';
import CaseStudy from './CaseStudy';
import MemeFactory from './MemeFactory';
import ChatbotBuilder from './ChatbotBuilder';
import AvatarStudio from './AvatarStudio';
import StickWordPlayer from './StickWordPlayer';
import NicheDiagnoser from './NicheDiagnoser';

function App() {
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const [showHubPortal, setShowHubPortal] = useState(false);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [activeTab, setActiveTab] = useState('content'); // 'content' | 'quiz' | 'wrong' | 'fugu'
  
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

  // 📝 커스텀 노트 추가 상태
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  // 🎥 같이 수업 듣기 상태
  const [youtubeUrl, setYoutubeUrl] = useState('https://www.youtube.com/watch?v=NTsQF8PUdvM');
  const [embedId, setEmbedId] = useState('NTsQF8PUdvM');
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
    const combined = [...customNotes, ...notesData];
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
    
    const combined = [...updatedCustom, ...notesData];
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
    
    const combined = [...updatedCustom, ...notesData];
    setNotes(combined);
    if (combined.length > 0) {
      setSelectedNote(combined[0]);
    } else {
      setSelectedNote(null);
    }
  };

  if (showHubPortal) {
    return <ChannelHub onClose={() => setShowHubPortal(false)} />;
  }

  return (
    <div className="study-app">
      {/* 📂 사이드바 */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-area">
            <div className="logo-icon">💜</div>
            <div className="logo-text">KODARI ROOM</div>
          </div>
          <button 
            className="btn-open-hub"
            onClick={() => setShowHubPortal(true)}
            style={{
              marginTop: '12px',
              width: '100%',
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
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
              boxShadow: '0 4px 15px rgba(236, 72, 153, 0.2)',
              transition: 'all 0.2s'
            }}
          >
            <span>🌐 채널 포털 사이트 띄우기</span>
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
        
        <div className="note-list">
          {notes.map(note => (
            <div 
              key={note.id} 
              className={`note-item ${selectedNote?.id === note.id ? 'active' : ''}`}
              onClick={() => { setSelectedNote(note); setIsAddingNote(false); }}
            >
              <span className="note-item-title">{note.title || '제목 없는 페이지'}</span>
              <div className="note-item-meta">
                <span>{new Date(note.lastEdited).toLocaleDateString('ko-KR')}</span>
                <span className={`badge-study ${completedNotes[note.id] === 'PASS' ? 'completed' : ''}`}>
                  {completedNotes[note.id] === 'PASS' ? '통과' : completedNotes[note.id] === 'STUDIED' ? '복습필요' : '학습중'}
                </span>
              </div>
            </div>
          ))}
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
            <header className="workspace-header">
              <div className="header-title-area">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <h2>{selectedNote.title}</h2>
                  {selectedNote.id.startsWith('custom-') && (
                    <button 
                      onClick={() => handleDeleteCustomNote(selectedNote.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px'
                      }}
                    >
                      🗑️ 삭제
                    </button>
                  )}
                </div>
                <p>노션 소스: {selectedNote.id.startsWith('custom-') ? '로컬 작성 노트' : <a href={selectedNote.url} target="_blank" rel="noopener noreferrer" style={{ color: '#8b5cf6', textDecoration: 'none' }}>원본 보기 ↗</a>}</p>
              </div>
              <div className="nav-tabs">
                <button 
                  className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`}
                  onClick={() => setActiveTab('content')}
                >
                  <BookOpen size={16} /> 노트 본문 & AI 브리핑
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
                  onClick={() => setActiveTab('quiz')}
                >
                  <Award size={16} /> AI 모의고사
                </button>
                {wrongNotes[selectedNote.id] && (
                  <button 
                    className={`tab-btn ${activeTab === 'wrong' ? 'active' : ''}`}
                    onClick={() => setActiveTab('wrong')}
                  >
                    <AlertTriangle size={16} style={{ color: '#ef4444' }} /> 오답노트
                  </button>
                )}
                <button 
                  className={`tab-btn ${activeTab === 'fugu' ? 'active' : ''}`}
                  onClick={() => setActiveTab('fugu')}
                  style={{ borderLeft: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <Layers size={16} style={{ color: '#10b981' }} /> 🐡 우리집 푸구 (Fugu)
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'study' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('study'); setIsAddingNote(false); }}
                  style={{ borderLeft: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <Play size={16} style={{ color: '#ec4899' }} /> 🎥 같이 수업 듣기
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'casestudy' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('casestudy'); setIsAddingNote(false); }}
                  style={{ borderLeft: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <Award size={16} style={{ color: '#3b82f6' }} /> 🌐 글로벌 케이스스터디
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'memefactory' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('memefactory'); setIsAddingNote(false); }}
                  style={{ borderLeft: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <Sparkles size={16} style={{ color: '#ec4899' }} /> 🎬 밈 팩토리 데모
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'chatbotbuilder' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('chatbotbuilder'); setIsAddingNote(false); }}
                  style={{ borderLeft: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <Settings size={16} style={{ color: '#06b6d4' }} /> 🤖 AI 챗봇 빌더
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'nichediagnoser' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('nichediagnoser'); setIsAddingNote(false); }}
                  style={{ borderLeft: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <Target size={16} style={{ color: '#10b981' }} /> 🎯 4대 준비물 진단기
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'avatarstudio' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('avatarstudio'); setIsAddingNote(false); }}
                  style={{ borderLeft: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <Sparkles size={16} style={{ color: '#a855f7' }} /> 🪄 마법 아바타 & 이력서
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'stickword' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('stickword'); setIsAddingNote(false); }}
                  style={{ borderLeft: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <BookOpen size={16} style={{ color: '#ff6b95' }} /> 📚 둠칫 스틱워드 사전
                </button>
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
                                <div key={index} style={{ padding: '12px', background: 'rgba(0,0,0,0.02)', borderRadius: '8px', borderLeft: '3px solid #06b6d4' }}>
                                  <strong style={{ color: '#2563eb' }}>{concept.term}</strong>
                                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{concept.definition}</p>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {/* 🤖 실시간 노트 챗봇 컴포넌트 추가 */}
                        <div className="note-chatbot-section" style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px dashed rgba(0,0,0,0.08)' }}>
                           <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8b5cf6', fontSize: '13px', marginBottom: '12px', fontWeight: '700' }}>
                             <span>🤖</span> 코다리부장 실시간 문답 (Q&A)
                           </h4>
                           
                           <div className="note-chat-history" style={{ 
                             maxHeight: '180px', 
                             overflowY: 'auto', 
                             padding: '10px', 
                             background: 'rgba(0,0,0,0.015)', 
                             borderRadius: '8px', 
                             display: 'flex', 
                             flexDirection: 'column', 
                             gap: '8px',
                             marginBottom: '10px',
                             border: '1px solid rgba(0,0,0,0.05)',
                             boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
                           }}>
                             {noteChatHistory.map((msg, idx) => (
                               <div key={idx} style={{ 
                                 alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                 maxWidth: '85%',
                                 padding: '8px 12px',
                                 borderRadius: '8px',
                                 fontSize: '12px',
                                 lineHeight: '1.5',
                                 background: msg.sender === 'user' ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : '#ffffff',
                                 color: msg.sender === 'user' ? '#ffffff' : 'var(--text-primary)',
                                 boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                 border: msg.sender === 'user' ? 'none' : '1px solid rgba(0,0,0,0.06)',
                                 whiteSpace: 'pre-wrap'
                               }}>
                                 {msg.text}
                               </div>
                             ))}
                             {loadingNoteChat && (
                               <div style={{ 
                                 alignSelf: 'flex-start',
                                 padding: '6px 12px',
                                 background: '#ffffff',
                                 borderRadius: '8px',
                                 fontSize: '11px',
                                 color: '#94a3b8',
                                 border: '1px solid rgba(0,0,0,0.06)'
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
                                 background: '#ffffff',
                                 border: '1px solid rgba(0,0,0,0.1)',
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
                          background: '#ffffff',
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

              {activeTab === 'stickword' && (
                <StickWordPlayer />
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
    </div>
  );
}

export default App;
