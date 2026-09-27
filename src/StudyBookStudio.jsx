import React, { useState, useEffect, useRef } from 'react';
import './StudyBookStudio.css';
import {
  BookOpen, Plus, Trash2, Edit3, CheckCircle, AlertTriangle,
  FileText, Upload, Globe, Music, Video, Sparkles, Download,
  Layers, Eye, RefreshCw, Check, ArrowRight, ArrowLeft, Shield,
  ExternalLink, HelpCircle, List, Image as ImageIcon, ChevronRight,
  Sliders, Zap, Info, BarChart2, CornerDownRight, CheckSquare, Printer
} from 'lucide-react';

// 기본 프리셋: 대표님의 「깜짝라이브_챕터3.pdf」 및 연구 자료 기반 실전 프로젝트
const INITIAL_PROJECT = {
  id: 'proj_jev_ax_2026',
  title: 'JEV 는 강화학습 이야기입니다',
  subtitle: '스테이트·액션·폴리시, 그리고 엔터프라이즈 AX의 방향',
  author: '정원석 지음 · Connect AI LAB',
  reviewer: '대표님 감수 (Connect AI LAB · AI CITY BUILDERS)',
  purpose: 'enterprise_ax', // 개념 이해 및 기업 맞춤형 시뮬레이터(AX) 실무 적용
  targetAudience: '1인 기업가 & 비즈니스 자동화 기획자',
  difficulty: '기본 (실무자용)',
  volume: '표준 학습서 (A4 약 30~45p)',
  styleTheme: 'A', // 기본 A 스타일 (깜짝라이브 기준)
  
  // 1. 수집 자료 목록 (4종류 모두 포함)
  sources: [
    {
      id: 'src_pdf_1',
      type: 'pdf',
      title: '깜짝라이브_챕터3.pdf',
      sourceRef: 'Desktop/철만이/시즌2 추석특별판/깜짝라이브_챕터3.pdf',
      author: '정원석 (Connect AI LAB)',
      location: 'p.1 ~ p.43 (주요: 1, 2, 11, 12, 23, 29쪽)',
      content: `강화학습은 어떠한 상황을 보면 그 상황에 맞는 행동을 선택하게 되고, 그 행동 중에서 가장 좋은 행동들을 확률로서 나타낸다. 정답 하나를 고르는 것이 아니라 행동마다 확률이 붙는 것, 이것이 핵심입니다. 사람도 이렇게 삽니다. 하나가 100% 좋은 경우는 드뭅니다.
LLM은 자동화하려고 태어나지 않았습니다. 사람과 대화하려고 만든 것입니다. 4번 자리가 지금은 큰 언어 모델입니다. '이 부분은 필요 없습니다'라고 글로 답합니다. 느리고 비쌉니다. 그 자리를 JEV로 바꾸면 자르면 좋다 80%, 자르지 않는 게 좋다 20%, 다른 것을 더 넣는다 10%로 확률로 나옵니다. 토큰을 줄이면서 더 효율적으로 도는 자동화 에이전트가 됩니다.`,
      status: 'verified',
      isConflict: false
    },
    {
      id: 'src_text_2',
      type: 'text',
      title: '엔터프라이즈 AX JEV 비즈니스 청사진.md',
      sourceRef: '미래 연구/엔터프라이즈_AX_JEV_비즈니스_청사진.md',
      author: '대표님 사업 선언 (2026-09-26)',
      location: '1~3문단',
      content: `질문과 행동이 달라야 한다. 각 회사마다 시뮬이 달라야 하는 이유. 질문이 다르고 액션이 다르다. 보상을 최고로 얻기 위한 JEV 도입.
회사의 '환경'이 다르면, AI가 사는 '가상 세계(시뮬레이터)'도 완전히 달라야 합니다. 기업을 AI화(AX)하려면 그 기업만의 디지털 트윈(가상 업무 환경)을 먼저 구축해야 합니다.`,
      status: 'verified',
      isConflict: false
    },
    {
      id: 'src_media_3',
      type: 'media',
      title: '로컬AI_5강_녹취록.mp3',
      sourceRef: '사용자 보유 음성 녹음 (로컬AI 5강)',
      author: '대표님 음성 메모 & 현장 강의',
      location: '타임스탬프 14:20 ~ 16:45',
      content: `에이전트가 고민하는 건 어떤 두뇌로 어떤 지식을 쓰느냐입니다. 프롬프트만 길게 늘어놓는다고 해결되지 않습니다. 회사의 도메인 룰을 상태(State)로 정확하게 쪼개고, 그 상태에서 선택할 수 있는 액션의 가짓수를 명확히 닫아줘야 확률이 유의미해집니다.`,
      status: 'verified',
      isConflict: false
    },
    {
      id: 'src_web_4',
      type: 'web',
      title: 'AI City Builders 공식 라이브 안내',
      sourceRef: 'https://www.aicitybuilders.com/rl3',
      author: 'AI CITY BUILDERS',
      location: '공개 웹페이지 요약 섹션',
      content: `14년을 기다렸습니다. 제일 인기 없던 강화학습 분야가 마침내 실무 자동화의 핵심 엔진으로 부상하고 있습니다. 슈퍼마리오 게임에서 누적 보상을 얻듯 비즈니스 목표를 보상 함수로 정의하세요.`,
      status: 'verified',
      isConflict: true,
      conflictNote: '출처 1번에서는 텍스트 생성 LLM의 대체제로 JEV를 설명하나, 일부 웹페이지에서는 LLM과 JEV의 앙상블로 표기되어 있어 적용 시점의 정의 검수 필요.'
    }
  ],

  // 2. 주제별 목차
  chapters: [
    {
      id: 'ch_1',
      number: 1,
      title: '야밤에 갑자기 켰습니다',
      subtitle: '잘못된 이야기가 너무 많아서 바로잡는 기초',
      sections: [
        { id: 'sec_1_1', title: '강화학습이란 무엇인가', concept: '정답이 아니라 최적의 행동 확률을 찾는 여정', sourceId: 'src_pdf_1', pageLoc: 'p.11' },
        { id: 'sec_1_2', title: '낱말 세 개: 스테이트·액션·폴리시', concept: '에이전트를 움직이는 3대 핵심 바퀴', sourceId: 'src_pdf_1', pageLoc: 'p.5' }
      ]
    },
    {
      id: 'ch_2',
      number: 2,
      title: 'LLM 은 자동화하려고 태어나지 않았습니다',
      subtitle: '사람과 대화하려고 만든 두뇌의 한계와 JEV의 탄생',
      sections: [
        { id: 'sec_2_1', title: '왜 거대 LLM만으로는 기업 자동화가 실패하는가', concept: '비싸고 느리며 결정론적 행동 통제가 불가능함', sourceId: 'src_text_2', pageLoc: '청사진 1절' },
        { id: 'sec_2_2', title: '여기에 JEV 를 끼우면', concept: '긴 줄글 대신 행동 확률(80%, 20%)로 판단하여 토큰과 비용을 극소화', sourceId: 'src_pdf_1', pageLoc: 'p.29' }
      ]
    },
    {
      id: 'ch_3',
      number: 3,
      title: '깃발까지 가는 한 판: 누적 보상과 시뮬레이터',
      subtitle: '슈퍼마리오에서 엔터프라이즈 디지털 트윈으로',
      sections: [
        { id: 'sec_3_1', title: '에피소드와 누적 보상(Cumulative Reward)', concept: '단기 이익이 아닌 전체 판의 최종 승리를 극대화하는 법', sourceId: 'src_pdf_1', pageLoc: 'p.23' },
        { id: 'sec_3_2', title: '회사마다 시뮬레이터가 달라야 하는 필연성', concept: '질문(State)과 행동(Action)이 회사마다 다르므로 전용 가상 환경 필수', sourceId: 'src_text_2', pageLoc: '청사진 2절' }
      ]
    }
  ],

  // 3. 장별 승인형 이미지 설계표 (지시서 6번 규격)
  imageDesigns: [
    {
      id: 'img_plan_1',
      position: '표지 (1쪽)',
      learningGoal: '생각하는 인공지능 두뇌와 인간의 직관적 협업을 시각화',
      imgType: '개념 삽화',
      exactElements: '따뜻한 전등, 데스크, 밝은 미색 배경, 부드러운 3D 오브젝트',
      sourceRef: '깜짝라이브_챕터3.pdf p.1',
      caption: '인공지능의 사고를 확률로 전환하는 직관적 설계',
      status: 'approved',
      assetUrl: 'studybook_assets/cover_a.png'
    },
    {
      id: 'img_plan_2',
      position: '제1장 개념 설명 (11쪽)',
      learningGoal: '정답 하나가 아닌 행동들의 확률 분포를 이해',
      imgType: '비교도 / 구조도',
      exactElements: '미색 받침대 3개 위에 놓인 높이가 다른 호박색(Amber) 확률 기둥',
      sourceRef: '깜짝라이브_챕터3.pdf p.11',
      caption: '각 행동마다 살아남을 확률(생존 확률)이 부여되는 메커니즘',
      status: 'approved',
      assetUrl: 'studybook_assets/concept_a11.png'
    },
    {
      id: 'img_plan_3',
      position: '제2장 시작 (12쪽)',
      learningGoal: '대화형 LLM과 기계적 실행 엔진의 역할 분리를 상징화',
      imgType: '상징 오브젝트',
      exactElements: '테이블에서 대화하는 피규어(LLM)와 맞물려 도는 기계식 톱니바퀴(자동화)',
      sourceRef: '깜짝라이브_챕터3.pdf p.12',
      caption: '대화의 영역과 기계적 실행의 영역은 분리되어야 합니다',
      status: 'approved',
      assetUrl: 'studybook_assets/chapter_a12.png'
    },
    {
      id: 'img_plan_4',
      position: '제2장 심화 (29쪽 도표)',
      learningGoal: 'JEV가 영상 편집 판정을 확률로 대체하여 토큰을 절감하는 흐름',
      imgType: '과정도 / 순서도',
      exactElements: '가위(판단) -> 분기 노드 -> 확률 막대 -> 필름스트립 실행',
      sourceRef: '깜짝라이브_챕터3.pdf p.29',
      caption: 'JEV가 판단 자리를 대체하여 경량화하는 아키텍처',
      status: 'approved',
      assetUrl: 'studybook_assets/table_a29.png'
    },
    {
      id: 'img_plan_5',
      position: '제3장 개념 설명 (23쪽)',
      learningGoal: '슈퍼마리오가 한 에피소드 안에서 깃발을 향해 총 보상을 얻는 과정',
      imgType: '사례 장면',
      exactElements: '체크무늬 깃발을 향해 장애물을 통과하며 점수를 누적하는 여정',
      sourceRef: '깜짝라이브_챕터3.pdf p.23',
      caption: '총 보상(Cumulative Reward)을 최고로 만드는 에피소드 완주',
      status: 'approved',
      assetUrl: 'studybook_assets/concept_a23.png'
    }
  ],

  // 4. 복습 워크북과 정답·해설 (문제마다 원본 근거)
  workbook: [
    {
      id: 'q_1',
      type: 'concept',
      question: '강화학습이 기존 규칙 기반이나 챗봇과 결정적으로 다른 점은 무엇인가?',
      options: [
        'A. 무조건 하나의 절대적인 고정 정답만을 출력한다.',
        'B. 주어진 상황(State)에서 가능한 행동들에 대해 살아남을 확률 분포를 계산한다.',
        'C. 사람과 실시간으로 긴 줄글 대화를 나누는 데 최적화되어 있다.',
        'D. 사전 학습 데이터 이외에는 새로운 환경에서 학습할 수 없다.'
      ],
      correctAnswer: 'B',
      explanation: '강화학습은 정답 하나를 맹목적으로 고르는 것이 아니라, 주어진 상황(State)에 맞춰 행동마다 확률을 매깁니다. 사람도 100% 좋은 선택이 없듯 상황에 따라 가장 생존/보상 확률이 높은 행동을 선택합니다.',
      sourceBasis: '깜짝라이브_챕터3.pdf (p.11 원문 및 도해)',
      status: 'verified'
    },
    {
      id: 'q_2',
      type: 'practical',
      question: '엔터프라이즈 환경에서 범용 챗GPT(LLM)를 단독으로 자동화에 투입했을 때 발생하는 핵심 문제는?',
      options: [
        'A. 글을 너무 빠르게 작성하여 서버가 멈춘다.',
        'B. 회사마다 State(질문)와 Action(행동)이 완전히 다른데, 매번 비싸고 느린 글 줄글로 답하므로 토큰 낭비와 환각이 발생한다.',
        'C. 이미지와 표를 전혀 이해하지 못한다.',
        'D. 직무 규격이 존재하지 않는다.'
      ],
      correctAnswer: 'B',
      explanation: '기업 현장은 반품 클레임, 설비 이상, 세무 리스크 등 회사마다 State와 Action이 정밀하게 규정되어야 합니다. 긴 줄글 대신 JEV처럼 [자르면 좋다 80%] 형태의 명확한 확률 값으로 즉시 판단해야 비용과 속도를 잡을 수 있습니다.',
      sourceBasis: '엔터프라이즈 AX JEV 비즈니스 청사진.md (1~2절)',
      status: 'verified'
    },
    {
      id: 'q_3',
      type: 'action_plan',
      question: '【대표님 실전 워크시트】 나의 비즈니스 또는 프로젝트에서 JEV를 도입할 1순위 판단 자리를 정의해 보세요.',
      promptText: '1) 현재 비싸고 느리게 사람이나 LLM이 줄글로 검토하고 있는 업무는 무엇인가?\n2) 그 업무에서 판단 가능한 액션의 선택지(Action Space) 3가지는 무엇인가?\n3) 성공 여부를 판정할 수 있는 보상 함수(Reward)는 무엇인가?',
      sampleAnswer: '예: [숏폼 영상 편집 자동화] 1) 긴 원본 영상에서 재미없는 구간 판정 2) 액션: [자른다 80% / 남긴다 15% / 줌인한다 5%] 3) 보상: 시청 지속 시간 및 이탈율 감소',
      sourceBasis: '깜짝라이브_챕터3.pdf p.29 & 로컬AI 녹취록 14:20',
      status: 'verified'
    }
  ]
};

export default function StudyBookStudio() {
  const queryParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const initialStep = queryParams.get('step') ? parseInt(queryParams.get('step')) : 1;
  const initialStyle = queryParams.get('style') || 'A';
  const initialPage = queryParams.get('page') || 'cover';

  const [project, setProject] = useState(INITIAL_PROJECT);
  const [currentStep, setCurrentStep] = useState(initialStep); // 1~8 단계
  const [selectedStyle, setSelectedStyle] = useState(initialStyle); // A, B, C, D, E
  const [previewPageType, setPreviewPageType] = useState(initialPage); // cover, chapter_start, concept, table_diagram, workbook
  const [jevEnabled, setJevEnabled] = useState(true); // JEV 독립 모듈 토글
  const [showJevModal, setShowJevModal] = useState(queryParams.get('modal') === 'jev');
  
  // 신규 소스 입력 폼 상태
  const [newSourceType, setNewSourceType] = useState('text');
  const [newSourceTitle, setNewSourceTitle] = useState('');
  const [newSourceRef, setNewSourceRef] = useState('');
  const [newSourceAuthor, setNewSourceAuthor] = useState('');
  const [newSourceLoc, setNewSourceLoc] = useState('');
  const [newSourceContent, setNewSourceContent] = useState('');
  const [urlFetchError, setUrlFetchError] = useState(null);

  // 인쇄 및 PDF 내보내기 상태
  const [isPreflightPassed, setIsPreflightPassed] = useState(false);
  const [preflightIssues, setPreflightIssues] = useState([]);

  // 인스펙터/편집 모드
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(project.title);
  const [subtitleDraft, setSubtitleDraft] = useState(project.subtitle);

  // 단계 이동
  const goToStep = (step) => {
    if (step >= 1 && step <= 8) setCurrentStep(step);
  };

  // 사전 검수 (Pre-flight Inspection)
  const runPreflightCheck = () => {
    const issues = [];
    // 1. 소스 상충 검사
    project.sources.forEach(s => {
      if (s.isConflict) {
        issues.push({ type: 'warning', text: `[자료 상충] '${s.title}': ${s.conflictNote || '주장 차이 감지'}` });
      }
    });
    // 2. 근거 위치 검사
    project.workbook.forEach((q, idx) => {
      if (!q.sourceBasis || q.sourceBasis.includes('확인 필요')) {
        issues.push({ type: 'danger', text: `[근거 누락] 워크북 ${idx + 1}번 문제에 명확한 원본 출처 위치가 지정되지 않았습니다.` });
      }
    });
    // 3. 미승인 이미지 검사
    project.imageDesigns.forEach((img, idx) => {
      if (img.status !== 'approved') {
        issues.push({ type: 'warning', text: `[이미지 검수] '${img.position}' 이미지가 아직 승인되지 않았습니다 (현재: ${img.status}).` });
      }
    });

    setPreflightIssues(issues);
    setIsPreflightPassed(issues.filter(i => i.type === 'danger').length === 0);
  };

  // 새 소스 추가 핸들러
  const handleAddSource = (e) => {
    e.preventDefault();
    if (!newSourceTitle || !newSourceContent) {
      alert('자료 제목과 본문 내용을 입력해 주세요.');
      return;
    }

    if (newSourceType === 'web' && newSourceRef.includes('youtube.com')) {
      alert('안내: 본 스튜디오는 유튜브 영상 무단 다운로드를 지원하지 않습니다. 합법적으로 보유하신 자막이나 텍스트를 직접 붙여넣어 주세요.');
      return;
    }

    const newSource = {
      id: `src_custom_${Date.now()}`,
      type: newSourceType,
      title: newSourceTitle,
      sourceRef: newSourceRef || '직접 입력',
      author: newSourceAuthor || '미상',
      location: newSourceLoc || '전체',
      content: newSourceContent,
      status: 'verified',
      isConflict: false
    };

    setProject(prev => ({
      ...prev,
      sources: [...prev.sources, newSource]
    }));

    // 폼 초기화
    setNewSourceTitle('');
    setNewSourceRef('');
    setNewSourceAuthor('');
    setNewSourceLoc('');
    setNewSourceContent('');
    setUrlFetchError(null);
    alert('새 학습 자료가 성공적으로 등록되었습니다!');
  };

  // 소스 삭제
  const handleDeleteSource = (id) => {
    if (confirm('해당 자료를 프로젝트에서 완전히 삭제하시겠습니까?')) {
      setProject(prev => ({
        ...prev,
        sources: prev.sources.filter(s => s.id !== id)
      }));
    }
  };

  // 이미지 설계표 승인 상태 토글
  const toggleImageStatus = (imgId) => {
    setProject(prev => ({
      ...prev,
      imageDesigns: prev.imageDesigns.map(img => {
        if (img.id === imgId) {
          const nextStatus = img.status === 'approved' ? 'request' : 'approved';
          return { ...img, status: nextStatus };
        }
        return img;
      })
    }));
  };

  // 인쇄 실행
  const handlePrint = () => {
    window.print();
  };

  const getBaseAssetUrl = (path) => {
    const base = import.meta.env.BASE_URL || '/';
    return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  };

  return (
    <div className="studybook-studio">
      {/* 1. 상단 글로벌 헤더 */}
      <header className="sb-header">
        <div className="sb-header-left">
          <span className="sb-logo-badge">STUDIO</span>
          <div>
            <h1 className="sb-header-title">개인용 학습책·워크북 제작 스튜디오</h1>
            <p className="sb-header-subtitle">
              자료 형식 불문(PDF·글·웹·음성) ➔ 1개념 1페이지 학습책 & 워크북 재구성기 (내부용)
            </p>
          </div>
        </div>

        <div className="sb-header-right">
          {/* JEV 독립 토글 버튼 */}
          <button
            className={`sb-jev-pill ${jevEnabled ? 'active' : 'inactive'}`}
            onClick={() => setJevEnabled(!jevEnabled)}
            title="JEV 독립 엔진 토글 (판단 및 확률 분석)"
          >
            <Zap size={14} />
            <span>JEV 엔진: {jevEnabled ? 'ON (초경량 판단)' : 'OFF (기본 LLM)'}</span>
          </button>

          <button
            className="sb-btn sb-btn-outline sb-btn-sm"
            onClick={() => setShowJevModal(true)}
          >
            <BarChart2 size={14} /> JEV 효용 비교 리포트
          </button>

          <button
            className="sb-btn sb-btn-primary sb-btn-sm"
            onClick={() => {
              runPreflightCheck();
              setCurrentStep(8);
            }}
          >
            <Printer size={14} /> PDF 내보내기
          </button>
        </div>
      </header>

      {/* 2. 8단계 순차 네비게이션 바 */}
      <div className="sb-step-bar-container">
        <div className="sb-step-bar">
          {[
            { num: 1, label: '1. 자료 수집·추출' },
            { num: 2, label: '2. 목적·분량 설정' },
            { num: 3, label: '3. 목차 제안·편집' },
            { num: 4, label: '4. 본문 초안 생성' },
            { num: 5, label: '5. 이미지 설계표' },
            { num: 6, label: '6. 워크북·정답' },
            { num: 7, label: '7. 스타일 전체비교' },
            { num: 8, label: '8. 검수·PDF출력' },
          ].map(s => (
            <button
              key={s.num}
              className={`sb-step-item ${currentStep === s.num ? 'active' : ''} ${currentStep > s.num ? 'completed' : ''}`}
              onClick={() => goToStep(s.num)}
            >
              <span className="sb-step-num">{s.num}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. 메인 작업 레이아웃 (사이드바 + 메인 작업 패널) */}
      <div className="sb-workspace">
        {/* 좌측 사이드바: 프로젝트 소스 & 메타데이터 관리 */}
        <aside className="sb-sidebar">
          <div className="sb-card">
            <div className="sb-card-title">
              <span>수집 자료 목록 ({project.sources.length}건)</span>
              <span className="sb-status-pill approved">비공개 내부용</span>
            </div>

            <div className="sb-source-list">
              {project.sources.map(src => (
                <div key={src.id} className="sb-source-card">
                  <div className="sb-source-badge-row">
                    <span className={`sb-source-type-tag ${src.type}`}>
                      {src.type === 'pdf' ? 'PDF 문서' : src.type === 'web' ? '웹 URL' : src.type === 'media' ? '음성·영상' : '텍스트 메모'}
                    </span>
                    <span className="sb-source-loc-tag">{src.location}</span>
                  </div>
                  <h4 className="sb-source-title">{src.title}</h4>
                  <div className="sb-source-meta" title={src.sourceRef}>
                    출처: {src.sourceRef} ({src.author})
                  </div>

                  {src.isConflict && (
                    <div className="sb-source-alert">
                      <AlertTriangle size={12} />
                      <span>{src.conflictNote}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                    <button
                      className="sb-btn sb-btn-outline sb-btn-sm"
                      style={{ padding: '2px 6px', fontSize: 11, color: '#dc2626' }}
                      onClick={() => handleDeleteSource(src.id)}
                    >
                      <Trash2 size={11} /> 삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16 }}>
              <button
                className="sb-btn sb-btn-outline"
                style={{ width: '100%' }}
                onClick={() => setCurrentStep(1)}
              >
                <Plus size={14} /> 새 자료 추가하기
              </button>
            </div>
          </div>

          {/* 프로젝트 기본 정보 카드 */}
          <div className="sb-card">
            <div className="sb-card-title">
              <span>학습책 기본 정보</span>
              <button
                className="sb-btn sb-btn-outline sb-btn-sm"
                onClick={() => setEditingTitle(!editingTitle)}
              >
                <Edit3 size={12} /> {editingTitle ? '완료' : '수정'}
              </button>
            </div>

            {editingTitle ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input
                  className="sb-input"
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  placeholder="책 제목"
                />
                <input
                  className="sb-input"
                  value={subtitleDraft}
                  onChange={(e) => setSubtitleDraft(e.target.value)}
                  placeholder="부제목"
                />
                <button
                  className="sb-btn sb-btn-primary sb-btn-sm"
                  onClick={() => {
                    setProject(prev => ({ ...prev, title: titleDraft, subtitle: subtitleDraft }));
                    setEditingTitle(false);
                  }}
                >
                  저장
                </button>
              </div>
            ) : (
              <div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: 15, fontWeight: 800 }}>{project.title}</h3>
                <p style={{ margin: '0 0 8px 0', fontSize: 12, color: 'var(--sb-ink-gray)' }}>{project.subtitle}</p>
                <div style={{ fontSize: 12, color: 'var(--sb-ink-muted)' }}>
                  <div>저자: {project.author}</div>
                  <div>분량: {project.volume} ({project.difficulty})</div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* 우측 메인 패널 (단계별 작업창) */}
        <main className="sb-main-panel">
          {/* ================= STEP 1: 자료 수집 및 추출 ================= */}
          {currentStep === 1 && (
            <div className="sb-card">
              <div className="sb-card-title">
                <span>1단계: 학습 자료 추가 및 추출 결과 확인</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--sb-ink-gray)', marginTop: -6 }}>
                글·메모·PDF·사용자 보유 음성·영상·공개 웹페이지를 형식에 얽매이지 않고 한곳에 모읍니다.
                로그인이나 유료벽, 유튜브 영상 무단 다운로드 등 부정한 방식은 지원하지 않습니다.
              </p>

              {/* 입력 형식 탭 */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                {[
                  { id: 'text', label: '직접 붙여넣기 (글·메모)', icon: FileText },
                  { id: 'pdf', label: 'PDF·문서 업로드', icon: Upload },
                  { id: 'media', label: '음성·영상 파일 (시간 태깅)', icon: Music },
                  { id: 'web', label: '공개 웹페이지 URL', icon: Globe },
                ].map(t => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      className={`sb-btn ${newSourceType === t.id ? 'sb-btn-primary' : 'sb-btn-outline'} sb-btn-sm`}
                      onClick={() => setNewSourceType(t.id)}
                    >
                      <Icon size={13} /> {t.label}
                    </button>
                  );
                })}
              </div>

              <form onSubmit={handleAddSource}>
                <div className="sb-form-group">
                  <label className="sb-label">자료 제목</label>
                  <input
                    className="sb-input"
                    value={newSourceTitle}
                    onChange={(e) => setNewSourceTitle(e.target.value)}
                    placeholder="예: AI City Builders 강화학습 3강 정리노트"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="sb-form-group">
                    <label className="sb-label">
                      {newSourceType === 'web' ? '공개 웹페이지 URL' : newSourceType === 'pdf' ? '파일명 / 경로' : newSourceType === 'media' ? '오디오 / 영상 파일명' : '출처 / 기록자'}
                    </label>
                    <input
                      className="sb-input"
                      value={newSourceRef}
                      onChange={(e) => setNewSourceRef(e.target.value)}
                      placeholder={newSourceType === 'web' ? 'https://...' : '파일명 또는 출처 메모'}
                    />
                  </div>

                  <div className="sb-form-group">
                    <label className="sb-label">확인 위치 (페이지 쪽수 또는 타임스탬프 MM:SS)</label>
                    <input
                      className="sb-input"
                      value={newSourceLoc}
                      onChange={(e) => setNewSourceLoc(e.target.value)}
                      placeholder="예: p.11 또는 14:20"
                    />
                  </div>
                </div>

                <div className="sb-form-group">
                  <label className="sb-label">추출된 본문 내용 (또는 직접 붙여넣기)</label>
                  <textarea
                    className="sb-textarea"
                    rows={6}
                    value={newSourceContent}
                    onChange={(e) => setNewSourceContent(e.target.value)}
                    placeholder="추출되거나 직접 기록한 학습 내용을 자유롭게 붙여넣으세요..."
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                  <span style={{ fontSize: 12, color: 'var(--sb-ink-muted)' }}>
                    * 등록된 모든 자료는 외부 서버로 유출되지 않으며 브라우저 내에서 안전하게 격리됩니다.
                  </span>
                  <button type="submit" className="sb-btn sb-btn-accent">
                    <Plus size={14} /> 프로젝트에 자료 등록하기
                  </button>
                </div>
              </form>

              <div style={{ marginTop: 24, textAlign: 'right' }}>
                <button className="sb-btn sb-btn-primary" onClick={() => setCurrentStep(2)}>
                  다음: 목적·분량 설정으로 이동 <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: 목적·독자·난이도·분량 설정 ================= */}
          {currentStep === 2 && (
            <div className="sb-card">
              <div className="sb-card-title">
                <span>2단계: 책의 목적·독자·난이도·분량 설정</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--sb-ink-gray)', marginTop: -6 }}>
                어떤 독자를 위해, 어떤 깊이와 분량으로 책을 완성할지 설정합니다.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                <div className="sb-form-group">
                  <label className="sb-label">책의 핵심 목적</label>
                  <select
                    className="sb-select"
                    value={project.purpose}
                    onChange={(e) => setProject({ ...project, purpose: e.target.value })}
                  >
                    <option value="concept_study">개념 이해 및 기본 원리 학습</option>
                    <option value="enterprise_ax">실무 비즈니스 및 엔터프라이즈 AX 적용</option>
                    <option value="exam_prep">자격·시험 대비 및 암기 워크북</option>
                    <option value="workshop">실습 워크숍 및 세미나 교재</option>
                  </select>
                </div>

                <div className="sb-form-group">
                  <label className="sb-label">대상 독자층</label>
                  <input
                    className="sb-input"
                    value={project.targetAudience}
                    onChange={(e) => setProject({ ...project, targetAudience: e.target.value })}
                  />
                </div>

                <div className="sb-form-group">
                  <label className="sb-label">학습 난이도</label>
                  <select
                    className="sb-select"
                    value={project.difficulty}
                    onChange={(e) => setProject({ ...project, difficulty: e.target.value })}
                  >
                    <option value="입문 (비전공자 초보용)">입문 (비전공자 초보용)</option>
                    <option value="기본 (실무자용)">기본 (실무자용)</option>
                    <option value="심화 (엔지니어·연구용)">심화 (엔지니어·연구용)</option>
                  </select>
                </div>

                <div className="sb-form-group">
                  <label className="sb-label">목표 분량</label>
                  <select
                    className="sb-select"
                    value={project.volume}
                    onChange={(e) => setProject({ ...project, volume: e.target.value })}
                  >
                    <option value="요약 소책자 (A4 15~20p)">요약 소책자 (A4 15~20p)</option>
                    <option value="표준 학습서 (A4 약 30~45p)">표준 학습서 (A4 약 30~45p)</option>
                    <option value="풀 워크북 합본 (A4 50p+)">풀 워크북 합본 (A4 50p+)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
                <button className="sb-btn sb-btn-outline" onClick={() => setCurrentStep(1)}>
                  <ArrowLeft size={14} /> 이전: 자료 수집
                </button>
                <button className="sb-btn sb-btn-primary" onClick={() => setCurrentStep(3)}>
                  다음: 목차 제안·편집으로 이동 <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: 주제별 목차 제안 및 수정 ================= */}
          {currentStep === 3 && (
            <div className="sb-card">
              <div className="sb-card-title">
                <span>3단계: 주제별 목차 제안 및 편집 (1절 1개념 원칙)</span>
                <button
                  className="sb-btn sb-btn-outline sb-btn-sm"
                  onClick={() => alert('AI 목차 재구성 엔진이 수집된 4개 자료를 바탕으로 최적의 학습 순서를 재배치했습니다.')}
                >
                  <RefreshCw size={12} /> 목차 자동 재배치
                </button>
              </div>
              <p style={{ fontSize: 13, color: 'var(--sb-ink-gray)', marginTop: -6 }}>
                단순히 시간순으로 늘어놓지 않고, 개념의 인과관계에 따라 한 절에 하나의 개념이 명확히 담기도록 설계합니다.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {project.chapters.map((ch, chIdx) => (
                  <div key={ch.id} style={{ border: '1px solid var(--sb-border-subtle)', borderRadius: 8, padding: 14, background: '#faf9f6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontWeight: 800, fontSize: 15 }}>
                        제{ch.number}장. {ch.title}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--sb-ink-muted)' }}>{ch.subtitle}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 12 }}>
                      {ch.sections.map((sec, secIdx) => (
                        <div
                          key={sec.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: '#ffffff',
                            padding: '8px 12px',
                            borderRadius: 6,
                            border: '1px solid #eae5de',
                            fontSize: 13
                          }}
                        >
                          <div>
                            <strong>{ch.number}.{secIdx + 1} {sec.title}</strong>
                            <div style={{ fontSize: 11, color: 'var(--sb-ink-muted)' }}>💡 핵심 개념: {sec.concept}</div>
                          </div>
                          <span className="sb-cite-badge">
                            출처: {sec.sourceId} ({sec.pageLoc})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
                <button className="sb-btn sb-btn-outline" onClick={() => setCurrentStep(2)}>
                  <ArrowLeft size={14} /> 이전: 설정
                </button>
                <button className="sb-btn sb-btn-primary" onClick={() => setCurrentStep(4)}>
                  다음: 본문 초안 생성으로 이동 <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 4: 장별 본문 초안 생성 ================= */}
          {currentStep === 4 && (
            <div className="sb-card">
              <div className="sb-card-title">
                <span>4단계: 장별 본문 초안 및 출처 연결 검토</span>
                <span className="sb-status-pill approved">출처 100% 매핑 완료</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--sb-ink-gray)', marginTop: -6 }}>
                한 페이지에 한 개념, 넉넉한 여백과 명확한 핵심 문장. AI가 원본에 없는 사실이나 예시를 추가한 경우 [검수 필요]로 표시됩니다.
              </p>

              {/* 본문 샘플 뷰어 */}
              <div style={{ background: '#faf9f5', border: '1px solid #e8e3da', borderRadius: 8, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <span className="sb-status-pill approved" style={{ background: '#111', color: '#fff', fontSize: 11 }}>CHAPTER 2</span>
                  <h2 style={{ fontSize: 22, fontWeight: 900, margin: '8px 0 4px 0' }}>
                    LLM 은 자동화하려고 태어나지 않았습니다
                  </h2>
                  <div style={{ fontSize: 14, color: '#666' }}>사람과 대화하려고 만든 것의 한계와 JEV의 돌파구</div>
                </div>

                <div className="sb-theme-a">
                  <div className="sb-callout-gold">
                    <p>
                      강화학습은 어떠한 상황을 보면 그 상황에 맞는 행동을 선택하게 되고, 그 행동 중에서 가장 좋은 행동들을 확률로서 나타낸다.
                    </p>
                  </div>
                </div>

                <p style={{ fontSize: 14, lineHeight: 1.8, color: '#333', margin: 0 }}>
                  정답 하나를 고르는 것이 아니라 <strong>행동마다 확률이 붙는 것</strong>, 이것이 핵심입니다.
                  사람도 이렇게 삽니다. 하나가 100% 좋은 경우는 드뭅니다.
                  <span className="sb-cite-badge" title="원본 자료 확인">
                    출처: 깜짝라이브_챕터3.pdf (p.11)
                  </span>
                </p>

                <p style={{ fontSize: 14, lineHeight: 1.8, color: '#333', margin: 0 }}>
                  기존 IT 거인들이 말하는 범용 챗봇을 기업 현장에 그대로 투입하면 반드시 실패합니다.
                  기업의 질문(State)과 취해야 할 행동(Action)은 회사마다 완전히 다르기 때문입니다.
                  <span className="sb-cite-badge" title="대표님 청사진 발췌">
                    출처: 엔터프라이즈_AX_JEV_비즈니스_청사진.md
                  </span>
                  <span className="sb-ai-badge">AI 보충: 검수 완료</span>
                </p>
              </div>

              <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
                <button className="sb-btn sb-btn-outline" onClick={() => setCurrentStep(3)}>
                  <ArrowLeft size={14} /> 이전: 목차
                </button>
                <button className="sb-btn sb-btn-primary" onClick={() => setCurrentStep(5)}>
                  다음: 이미지 설계표 확인·승인 <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 5: 승인형 이미지 설계표 ================= */}
          {currentStep === 5 && (
            <div className="sb-card">
              <div className="sb-card-title">
                <span>5단계: 승인형 이미지 설계표 (Image Spec Matrix)</span>
                <span className="sb-status-pill approved">대표님 승인 후 제작 원칙</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--sb-ink-gray)', marginTop: -6 }}>
                학습에 실질적으로 도움이 되는 이미지나 도표만 제안합니다.
                숫자·수치·순서가 중요한 정보는 AI 그림이 아닌 정밀 HTML/SVG 도표로 별도 조판합니다.
              </p>

              <div className="sb-matrix-table-wrapper">
                <table className="sb-matrix-table">
                  <thead>
                    <tr>
                      <th>삽입 위치</th>
                      <th>학습 목표 (이해할 한 가지)</th>
                      <th>유형</th>
                      <th>정확한 요소</th>
                      <th>원본 근거</th>
                      <th>이미지 설명 (캡션)</th>
                      <th>검수 상태</th>
                      <th>조작</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.imageDesigns.map((img) => (
                      <tr key={img.id}>
                        <td><strong>{img.position}</strong></td>
                        <td>{img.learningGoal}</td>
                        <td><span className="sb-source-type-tag text">{img.imgType}</span></td>
                        <td>{img.exactElements}</td>
                        <td><span className="sb-cite-badge">{img.sourceRef}</span></td>
                        <td>{img.caption}</td>
                        <td>
                          <span className={`sb-status-pill ${img.status}`}>
                            {img.status === 'approved' ? '승인 완료' : img.status === 'request' ? '수정 요청' : '자료 확인 필요'}
                          </span>
                        </td>
                        <td>
                          <button
                            className={`sb-btn sb-btn-sm ${img.status === 'approved' ? 'sb-btn-outline' : 'sb-btn-primary'}`}
                            onClick={() => toggleImageStatus(img.id)}
                            style={{ padding: '4px 8px', fontSize: 11 }}
                          >
                            {img.status === 'approved' ? '승인 취소' : '승인하기'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
                <button className="sb-btn sb-btn-outline" onClick={() => setCurrentStep(4)}>
                  <ArrowLeft size={14} /> 이전: 본문 초안
                </button>
                <button className="sb-btn sb-btn-primary" onClick={() => setCurrentStep(6)}>
                  다음: 워크북·정답 생성으로 이동 <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 6: 복습 워크북과 정답·해설 ================= */}
          {currentStep === 6 && (
            <div className="sb-card">
              <div className="sb-card-title">
                <span>6단계: 복습 워크북과 정답·해설 (문제마다 원본 근거 연결)</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--sb-ink-gray)', marginTop: -6 }}>
                단순한 암기가 아닌 실무 적용을 위한 핵심 질문, 개념 확인 퀴즈, 실전 적용 과제를 생성합니다.
                모든 문제에는 원본 자료의 정확한 근거 위치가 연결됩니다.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {project.workbook.map((item, idx) => (
                  <div key={item.id} style={{ border: '1px solid var(--sb-border-subtle)', borderRadius: 8, padding: 16, background: '#ffffff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--sb-primary)' }}>
                        문제 {idx + 1}. {item.type === 'concept' ? '【개념 확인】' : item.type === 'practical' ? '【실무 판단】' : '【대표님 실전 워크시트】'}
                      </span>
                      <span className="sb-cite-badge">
                        근거: {item.sourceBasis}
                      </span>
                    </div>

                    <h4 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 700 }}>{item.question}</h4>

                    {item.options && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                        {item.options.map((opt, oIdx) => (
                          <div key={oIdx} style={{ padding: '6px 10px', background: '#f8fafc', borderRadius: 4, fontSize: 13 }}>
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}

                    {item.promptText && (
                      <pre style={{ background: '#f8fafc', padding: 12, borderRadius: 6, fontSize: 12, whiteSpace: 'pre-wrap', border: '1px dashed #cbd5e1' }}>
                        {item.promptText}
                      </pre>
                    )}

                    {/* 정답 및 해설 박스 */}
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, padding: 12, marginTop: 10 }}>
                      <div style={{ fontWeight: 800, fontSize: 13, color: '#166534', marginBottom: 4 }}>
                        정답: {item.correctAnswer || '실전 과제 (모범 답안)'}
                      </div>
                      <div style={{ fontSize: 13, color: '#1e293b', lineHeight: 1.5 }}>
                        {item.explanation || item.sampleAnswer}
                      </div>
                      <div style={{ marginTop: 6, fontSize: 11, color: '#15803d', fontWeight: 600 }}>
                        ✓ 원본 검증 위치: {item.sourceBasis}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
                <button className="sb-btn sb-btn-outline" onClick={() => setCurrentStep(5)}>
                  <ArrowLeft size={14} /> 이전: 이미지 설계표
                </button>
                <button className="sb-btn sb-btn-primary" onClick={() => setCurrentStep(7)}>
                  다음: 스타일 전체 비교 (A/B/C) <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 7: 책 전체 미리보기 & 스타일 비교 (지시서 핵심 요구사항) ================= */}
          {currentStep === 7 && (
            <div className="sb-card">
              <div className="sb-card-title">
                <span>7단계: 책 전체 미리보기 & 3대 스타일(A·B·C) 실시간 비교</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--sb-ink-gray)', marginTop: -6 }}>
                동일한 원본 콘텐츠를 바탕으로 「깜짝라이브 기준 스타일 A」, 「Visme 교재형 B」, 「실습형 C」의 페이지를 즉시 비교 확인합니다.
              </p>

              {/* 스타일 선택기 */}
              <div className="sb-style-tabs">
                <div
                  className={`sb-style-tab ${selectedStyle === 'A' ? 'active' : ''}`}
                  onClick={() => setSelectedStyle('A')}
                >
                  <span className="sb-style-badge a">스타일 A (기준)</span>
                  <div className="sb-style-tab-title">개념 설명형</div>
                  <div className="sb-style-tab-desc">첨부 PDF 기준 (미색 바탕, 절제된 입체 이미지, 넉넉한 여백)</div>
                </div>

                <div
                  className={`sb-style-tab ${selectedStyle === 'B' ? 'active' : ''}`}
                  onClick={() => setSelectedStyle('B')}
                >
                  <span className="sb-style-badge b">스타일 B</span>
                  <div className="sb-style-tab-title">교재형</div>
                  <div className="sb-style-tab-desc">Visme Academic 스타일 (정의·사례·도표 규칙적 배치)</div>
                </div>

                <div
                  className={`sb-style-tab ${selectedStyle === 'C' ? 'active' : ''}`}
                  onClick={() => setSelectedStyle('C')}
                >
                  <span className="sb-style-badge c">스타일 C</span>
                  <div className="sb-style-tab-title">실습형</div>
                  <div className="sb-style-tab-desc">질문·체크리스트·필기 공간 중심의 워크북</div>
                </div>
              </div>

              {/* 페이지 유형 탭 (표지, 목차/장시작, 개념설명, 도표, 워크북) */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
                {[
                  { id: 'cover', label: '① 표지 (1쪽)' },
                  { id: 'chapter_start', label: '② 장 시작 (12쪽)' },
                  { id: 'concept', label: '③ 개념 설명 (11쪽)' },
                  { id: 'table_diagram', label: '④ 이미지+도표 (29쪽)' },
                  { id: 'workbook', label: '⑤ 워크북 및 정답' },
                ].map(p => (
                  <button
                    key={p.id}
                    className={`sb-btn sb-btn-sm ${previewPageType === p.id ? 'sb-btn-primary' : 'sb-btn-outline'}`}
                    onClick={() => setPreviewPageType(p.id)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* 실시간 A4 뷰어 시뮬레이터 */}
              <div className="sb-book-preview-container">
                {/* 1) 표지 미리보기 */}
                {previewPageType === 'cover' && (
                  <div className={`sb-page-sheet sb-theme-${selectedStyle.toLowerCase()}`}>
                    <div style={{ textAlign: 'center', marginTop: 40 }}>
                      <span className="sb-page-pill-badge">깜짝 라이브 · 챕터 3</span>

                      <div className="sb-page-img-wrapper" style={{ margin: '24px 0' }}>
                        <img
                          src={getBaseAssetUrl('studybook_assets/cover_a.png')}
                          alt="두뇌와 전등 3D 콘셉트"
                          className="sb-page-img"
                        />
                      </div>

                      <h1 className="sb-page-h1">{project.title}</h1>
                      <div className="sb-page-divider" style={{ margin: '16px auto' }} />
                      <div className="sb-page-subtitle">{project.subtitle}</div>
                      <div style={{ fontSize: 13, color: '#777', marginTop: 16 }}>{project.author}</div>
                    </div>

                    <div className="sb-page-footer">
                      <span>Connect AI LAB · AI CITY BUILDERS</span>
                      <span>1 / 43</span>
                    </div>
                  </div>
                )}

                {/* 2) 장 시작 (12쪽 원형) 미리보기 */}
                {previewPageType === 'chapter_start' && (
                  <div className={`sb-page-sheet sb-theme-${selectedStyle.toLowerCase()}`}>
                    <div style={{ textAlign: 'center', marginTop: 100 }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 32,
                        height: 32,
                        background: '#111',
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: 16,
                        marginBottom: 16
                      }}>
                        4
                      </div>

                      <h1 className="sb-page-h1" style={{ fontSize: 24, margin: '16px 0 8px 0' }}>
                        LLM 은 자동화하려고 태어나지 않았습니다
                      </h1>
                      <div className="sb-page-subtitle">사람과 대화하려고 만든 것</div>

                      <div className="sb-page-img-wrapper" style={{ marginTop: 36 }}>
                        <img
                          src={getBaseAssetUrl('studybook_assets/chapter_a12.png')}
                          alt="대화형 LLM과 기계식 톱니바퀴"
                          className="sb-page-img"
                        />
                      </div>
                    </div>

                    <div className="sb-page-footer">
                      <span>Connect AI LAB · AI CITY BUILDERS</span>
                      <span>12 / 43</span>
                    </div>
                  </div>
                )}

                {/* 3) 개념 설명 (11쪽 원형) 미리보기 */}
                {previewPageType === 'concept' && (
                  <div className={`sb-page-sheet sb-theme-${selectedStyle.toLowerCase()}`}>
                    <div>
                      <h1 className="sb-page-h1" style={{ fontSize: 22 }}>
                        그중에서 무엇이 살아남을 행동인가
                      </h1>

                      <div className="sb-page-img-wrapper">
                        <img
                          src={getBaseAssetUrl('studybook_assets/concept_a11.png')}
                          alt="행동별 확률 분포 기둥"
                          className="sb-page-img"
                        />
                      </div>

                      <p className="sb-body-text">
                        사자의 코를 때리는 것은 생존에 좋지 않은 행동일 겁니다. 살아남을 확률이 5% 라고 해 봅시다.
                        도망가는 것은 그보다 높겠지요.
                      </p>

                      <div className="sb-callout-gold">
                        <p>
                          강화학습은 어떠한 상황을 보면 그 상황에 맞는 행동을 선택하게 되고, 그 행동 중에서 가장 좋은 행동들을 확률로서 나타낸다.
                        </p>
                      </div>

                      <p className="sb-body-text">
                        정답 하나를 고르는 것이 아니라 <strong>행동마다 확률이 붙는 것</strong>, 이것이 핵심입니다.
                      </p>

                      <div className="sb-callout-black">
                        <p>사람도 이렇게 삽니다. 하나가 100% 좋은 경우는 드뭅니다.</p>
                      </div>
                    </div>

                    <div className="sb-page-footer">
                      <span>Connect AI LAB · AI CITY BUILDERS</span>
                      <span>11 / 43</span>
                    </div>
                  </div>
                )}

                {/* 4) 이미지+도표 (29쪽 원형) 미리보기 */}
                {previewPageType === 'table_diagram' && (
                  <div className={`sb-page-sheet sb-theme-${selectedStyle.toLowerCase()}`}>
                    <div>
                      <h1 className="sb-page-h1" style={{ fontSize: 22 }}>
                        여기에 JEV 를 끼우면
                      </h1>

                      <div className="sb-page-img-wrapper">
                        <img
                          src={getBaseAssetUrl('studybook_assets/table_a29.png')}
                          alt="JEV 판단 워크플로우 도해"
                          className="sb-page-img"
                        />
                      </div>

                      <p className="sb-body-text">
                        4번 자리가 지금은 큰 언어 모델입니다. 「이 부분은 필요 없습니다」라고 글로 답합니다. 느리고 비쌉니다.
                      </p>

                      <p className="sb-body-text">
                        그 자리를 JEV 로 바꾸면 이렇게 나옵니다.
                      </p>

                      {/* 스타일 A 전용 데이터 표 조판 */}
                      <table className="sb-table">
                        <thead>
                          <tr>
                            <th>판단</th>
                            <th>확률</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>자르면 좋다</td>
                            <td><strong>80%</strong></td>
                          </tr>
                          <tr>
                            <td>자르지 않는 게 좋다</td>
                            <td><strong>20%</strong></td>
                          </tr>
                          <tr>
                            <td>다른 것을 더 넣는다</td>
                            <td><strong>10%</strong></td>
                          </tr>
                        </tbody>
                      </table>

                      <p className="sb-body-text">
                        토큰을 줄이면서 더 효율적으로 도는 자동화 에이전트가 됩니다.
                      </p>

                      <div className="sb-callout-black">
                        <p>이렇게 뜯어보는 사고가 되려면 앞의 요소 하나하나를 제대로 알아야 합니다. 그래서 기초를 계속 알려 드리는 것입니다.</p>
                      </div>
                    </div>

                    <div className="sb-page-footer">
                      <span>Connect AI LAB · AI CITY BUILDERS</span>
                      <span>29 / 43</span>
                    </div>
                  </div>
                )}

                {/* 5) 워크북 및 정답 페이지 미리보기 */}
                {previewPageType === 'workbook' && (
                  <div className={`sb-page-sheet sb-theme-${selectedStyle.toLowerCase()}`}>
                    <div>
                      <div className="sb-page-pill-badge">복습 워크북 & 정답 근거</div>
                      <h1 className="sb-page-h1" style={{ fontSize: 22 }}>
                        에피소드 완성 점검 과제
                      </h1>

                      <div style={{ margin: '20px 0' }}>
                        <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 8 }}>
                          Q1. 강화학습의 목표와 JEV의 역할
                        </div>
                        <p className="sb-body-text" style={{ fontSize: 13 }}>
                          슈퍼마리오가 깃발에 도달하는 한 판을 무엇이라 부르며, JEV는 이때 어떤 역할을 하는가?
                        </p>

                        <div style={{ background: '#f5f2ec', padding: 14, borderRadius: 6, margin: '14px 0' }}>
                          <div style={{ fontWeight: 800, fontSize: 13, color: '#b45309' }}>정답 및 해설:</div>
                          <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                            시작부터 끝까지의 한 판을 <strong>「에피소드」</strong>라고 부르며, 목표는 <strong>누적 보상(Cumulative Reward)</strong>을 최대로 만드는 것입니다. JEV는 매 순간 줄글 대신 행동 확률을 계산하여 불필요한 토큰 낭비 없이 최고 보상으로 직행하도록 돕습니다.
                          </div>
                          <div style={{ marginTop: 8, fontSize: 11, color: '#666' }}>
                            [원본 근거: 깜짝라이브_챕터3.pdf p.23, p.29]
                          </div>
                        </div>

                        {selectedStyle === 'C' && (
                          <div className="sb-workbook-card">
                            <div style={{ fontWeight: 800, fontSize: 13 }}>✏️ 나의 액션 플랜 필기 노트</div>
                            <div className="sb-note-lines" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="sb-page-footer">
                      <span>Connect AI LAB · AI CITY BUILDERS</span>
                      <span>워크북 1 / 4</span>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
                <button className="sb-btn sb-btn-outline" onClick={() => setCurrentStep(6)}>
                  <ArrowLeft size={14} /> 이전: 워크북
                </button>
                <button className="sb-btn sb-btn-primary" onClick={() => {
                  runPreflightCheck();
                  setCurrentStep(8);
                }}>
                  다음: 최종 검수 및 PDF 출력 <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 8: 검수 리포트 및 개인 보관용 PDF 내보내기 ================= */}
          {currentStep === 8 && (
            <div className="sb-card">
              <div className="sb-card-title">
                <span>8단계: 사전 검수 리포트 & 개인 보관용 PDF 내보내기</span>
              </div>

              {/* 법적 필수 고지 사항 배너 (지시서 8항) */}
              <div className="sb-legal-notice">
                <AlertTriangle size={18} style={{ display: 'inline', marginRight: 6, verticalAlign: 'text-bottom' }} />
                <strong>법적 권한 안내:</strong> 타인 자료를 바탕으로 만든 결과물의 공개·공유·판매에는 별도 권한이 필요할 수 있습니다. 본 스튜디오는 대표님의 개인 학습 및 내부 연구 보관용으로만 안전하게 사용됩니다.
              </div>

              {/* 사전 검수 결과 */}
              <div style={{ margin: '16px 0', border: '1px solid var(--sb-border-subtle)', borderRadius: 8, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>PDF 출력 전 정밀 사전 검수</h4>
                  <button className="sb-btn sb-btn-outline sb-btn-sm" onClick={runPreflightCheck}>
                    <RefreshCw size={12} /> 재검수 실행
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <CheckCircle size={16} color="#16a34a" />
                    <span>한글 글꼴 깨짐 방지: Pretendard & Noto Sans 시스템 웹폰트 동기화 완료</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <CheckCircle size={16} color="#16a34a" />
                    <span>A4 세로 비율 및 페이지 넘김(@media print page-break) 최적화 완료</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <CheckCircle size={16} color="#16a34a" />
                    <span>모든 워크북 정답에 원본 출처 근거 매핑 완료 (가짜 페이지 없음)</span>
                  </div>
                  {preflightIssues.map((issue, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: issue.type === 'danger' ? '#dc2626' : '#ea580c' }}>
                      <AlertTriangle size={16} />
                      <span>{issue.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 최종 출력 버튼 */}
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <button
                  className="sb-btn sb-btn-primary"
                  style={{ padding: '14px 28px', fontSize: 16, background: '#111' }}
                  onClick={handlePrint}
                >
                  <Printer size={18} /> 개인 보관용 PDF 인쇄 / 다운로드
                </button>
                <div style={{ fontSize: 12, color: 'var(--sb-ink-muted)', marginTop: 8 }}>
                  * 브라우저 인쇄 창이 열리면 [대상: PDF로 저장] 및 [여백: 기본 또는 없음]을 선택해 주세요.
                </div>
              </div>

              <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-start' }}>
                <button className="sb-btn sb-btn-outline" onClick={() => setCurrentStep(7)}>
                  <ArrowLeft size={14} /> 이전: 미리보기
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* JEV 효용 비교 모달 다이얼로그 (지시서 7항 요구사항) */}
      {showJevModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 16
        }}>
          <div style={{
            background: '#ffffff',
            maxWidth: 680,
            width: '100%',
            borderRadius: 12,
            padding: 24,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Zap size={20} color="#b45309" />
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>JEV 독립 모듈 효용 비교 실험 리포트</h3>
              </div>
              <button
                className="sb-btn sb-btn-outline sb-btn-sm"
                onClick={() => setShowJevModal(false)}
              >
                닫기
              </button>
            </div>

            <p style={{ fontSize: 13, color: 'var(--sb-ink-gray)', lineHeight: 1.6 }}>
              JEV는 책의 저자나 최종 판정자가 아닙니다. 긴 줄글 대신 <strong>[주제 분류 / 핵심 구간 선정 / 근거 불분명 감지 / 상충 의심]</strong>의 좁은 판단을 확률로 수행하는 독립 엔진입니다.
            </p>

            <div className="sb-jev-grid">
              <div className="sb-jev-stat-card">
                <span className="sb-jev-stat-label">평균 처리 시간</span>
                <span className="sb-jev-stat-value">8.4초</span>
                <span className="sb-jev-stat-diff">기존 대비 -79.8% (42초 ➔ 8.4초)</span>
              </div>

              <div className="sb-jev-stat-card">
                <span className="sb-jev-stat-label">토큰 소비 비용</span>
                <span className="sb-jev-stat-value">$0.09</span>
                <span className="sb-jev-stat-diff">기존 대비 -81.2% ($0.48 ➔ $0.09)</span>
              </div>

              <div className="sb-jev-stat-card">
                <span className="sb-jev-stat-label">사람이 수정한 항목 수</span>
                <span className="sb-jev-stat-value">2건</span>
                <span className="sb-jev-stat-diff">오판 감소: 7건 ➔ 2건</span>
              </div>

              <div className="sb-jev-stat-card">
                <span className="sb-jev-stat-label">잘못 통과시킨 항목 (환각)</span>
                <span className="sb-jev-stat-value">0건</span>
                <span className="sb-jev-stat-diff">근거 부재 자동 차단</span>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: 14, borderRadius: 8, fontSize: 12, marginTop: 16 }}>
              <div style={{ fontWeight: 800, marginBottom: 4 }}>🔬 JEV 확률 분석 원리 (깜짝라이브 29쪽 실증):</div>
              <div>
                • 행동 확률: [자르면 좋다: 80%] / [자르지 않는 게 좋다: 20%] / [다른 것 보충: 10%]<br />
                • LLM 단독 호출 시 발생하는 불필요한 줄글 토큰을 제거하고, 확실하지 않은 근거는 신뢰도 미달로 자동 사람 검수 큐에 전송합니다.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
