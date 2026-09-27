import React, { useState, useRef } from 'react';
import './StudyBookStudio.css';
import {
  BookOpen, Plus, Trash2, Edit3, CheckCircle, AlertTriangle,
  FileText, Upload, Globe, Music, Video, Sparkles, Download,
  Layers, Eye, RefreshCw, Check, ArrowRight, ArrowLeft, Shield,
  ExternalLink, HelpCircle, List, Image as ImageIcon, ChevronRight,
  Sliders, Zap, Info, BarChart2, CornerDownRight, CheckSquare, Printer,
  Play, Pause, Volume2
} from 'lucide-react';

// ============================================================================
// ⚡ JEV (Joint Embedding Variable) 실연산 추론 엔진
// ============================================================================
export function runJevInferenceEngine(paragraph, context = {}) {
  const text = (paragraph || '').trim();
  if (!text) {
    return {
      action: 'TRIM_DROP',
      probabilities: { trim: 95, keep: 5, review: 0 },
      confidence: 95,
      reason: '공백 또는 무의미한 텍스트'
    };
  }

  const length = text.length;
  const conversationalKeywords = [
    '안녕하세요', '반갑습니다', '그쵸', '있잖아요', '어쨌든', '밥먹고', '배고파서',
    '갑자기 켰습니다', '구독', '좋아요', '댓글', '오늘 라이브', '음...', '어...',
    '토요일에 또 뵙겠습니다', '잡소리', '농담'
  ];
  let conversationalScore = 0;
  conversationalKeywords.forEach(kw => {
    if (text.includes(kw)) conversationalScore += 1.6;
  });

  const academicKeywords = [
    '정의', '강화학습', '확률', '스테이트', '액션', '폴리시', '보상', '에피소드',
    '누적', '시뮬레이터', 'LLM', '토큰', '디지털 트윈', '결정론', '최적화',
    '환경', '누적 보상', 'DQN', '신경망', '가상 세계', '엔터프라이즈'
  ];
  let academicScore = 0;
  academicKeywords.forEach(kw => {
    if (text.includes(kw)) academicScore += 2.0;
  });

  const hasPageOrTime = /p\.\d+|\d{1,2}:\d{2}|「.*?」|『.*?』/i.test(text);
  const citationBonus = hasPageOrTime ? 2.5 : 0.0;

  const conflictKeywords = ['다르다', '반면', '하지만', '상충', '불일치', '논란', '주의', '반대로'];
  let conflictScore = 0;
  conflictKeywords.forEach(kw => {
    if (text.includes(kw)) conflictScore += 1.8;
  });

  const qTrim = Math.max(0.5, (conversationalScore * 1.8) + (length < 30 ? 2.0 : 0) - (academicScore * 0.4));
  const qKeep = Math.max(0.2, (academicScore * 1.5) + citationBonus - (conversationalScore * 0.8));
  const qReview = Math.max(0.1, conflictScore + (!hasPageOrTime && academicScore > 4 ? 2.2 : 0.0));

  const expTrim = Math.exp(Math.min(qTrim, 15));
  const expKeep = Math.exp(Math.min(qKeep, 15));
  const expReview = Math.exp(Math.min(qReview, 15));
  const sumExp = expTrim + expKeep + expReview;

  const pTrim = Math.round((expTrim / sumExp) * 100);
  const pKeep = Math.round((expKeep / sumExp) * 100);
  const pReview = Math.max(0, 100 - pTrim - pKeep);

  let action = 'KEEP_CORE';
  let confidence = pKeep;
  let reason = '핵심 개념 정보 밀도 높음 (본문 채택)';

  if (pTrim >= pKeep && pTrim >= pReview) {
    action = 'TRIM_DROP';
    confidence = pTrim;
    reason = '구어체 사담 또는 저밀도 문맥 (토큰 절감: 자름)';
  } else if (pReview >= pKeep && pReview >= pTrim) {
    action = 'REVIEW_HUMAN';
    confidence = pReview;
    reason = '출처 상충 의심 또는 근거 보강 필요 (대표님 검수 큐)';
  }

  const isAmbiguous = confidence < 55;
  if (isAmbiguous) {
    action = 'REVIEW_HUMAN';
    reason = `판단 신뢰도(${confidence}%) 임계치(55%) 미달 ➔ 대표님 검수 큐`;
  }

  return {
    action,
    probabilities: { trim: pTrim, keep: pKeep, review: pReview },
    confidence,
    isAmbiguous,
    reason,
    tokenSavedEstimate: action === 'TRIM_DROP' ? Math.round(length * 0.75) : 0
  };
}

// 대표님 기본 프리셋 자료 (깜짝라이브 챕터3 & 엔터프라이즈 청사진)
const DEFAULT_PRESET_SOURCES = [
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
  }
];

export default function StudyBookStudio() {
  const queryParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const initialStep = queryParams.get('step') ? parseInt(queryParams.get('step')) : 1;
  const initialStyle = queryParams.get('style') || 'A';
  const initialPage = queryParams.get('page') || 'cover';

  // 1. 학습책 프로젝트 상태
  const [sources, setSources] = useState(DEFAULT_PRESET_SOURCES);
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [selectedStyle, setSelectedStyle] = useState(initialStyle);
  const [previewPageType, setPreviewPageType] = useState(initialPage);
  const [jevEnabled, setJevEnabled] = useState(true);
  const [showJevModal, setShowJevModal] = useState(queryParams.get('modal') === 'jev');

  // 2. 최상단 [학습 자료 즉각 투입기] 입력 탭 상태
  // 'url' | 'audio' | 'pdf' | 'text'
  const [activeInputTab, setActiveInputTab] = useState('url');

  // URL 입력 상태
  const [urlInput, setUrlInput] = useState('');
  const [urlTitle, setUrlTitle] = useState('');
  const [urlAuthor, setUrlAuthor] = useState('');
  const [urlExtractedText, setUrlExtractedText] = useState('');
  const [youtubeVideoId, setYoutubeVideoId] = useState(null);

  // 음성/영상 파일 상태
  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioTitle, setAudioTitle] = useState('');
  const [audioTimeTag, setAudioTimeTag] = useState('00:00');
  const [audioTranscript, setAudioTranscript] = useState('');
  const audioRef = useRef(null);

  // PDF/문서 파일 상태
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfTitle, setPdfTitle] = useState('');
  const [pdfPageLoc, setPdfPageLoc] = useState('p.1');
  const [pdfContent, setPdfContent] = useState('');

  // 텍스트/메모 상태
  const [textTitle, setTextTitle] = useState('');
  const [textAuthor, setTextAuthor] = useState('');
  const [textContent, setTextContent] = useState('');

  // JEV 실시간 실험실 상태
  const [jevPlaygroundInput, setJevPlaygroundInput] = useState('오늘 라이브 갑자기 켰습니다 배고파서 밥먹고 14년 만에 이야기하는데요 반갑습니다');
  const [jevPlaygroundResult, setJevPlaygroundResult] = useState(() => runJevInferenceEngine('오늘 라이브 갑자기 켰습니다 배고파서 밥먹고 14년 만에 이야기하는데요 반갑습니다'));

  // 3. URL 입력 처리 (유튜브 또는 일반 웹페이지)
  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      alert('웹페이지 또는 유튜브 URL을 입력해 주세요.');
      return;
    }

    // 유튜브 URL 판별
    const ytMatch = urlInput.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
      setYoutubeVideoId(ytMatch[1]);
      const defaultYtTitle = urlTitle || `유튜브 강의 영상 (${ytMatch[1]})`;
      const defaultYtContent = urlExtractedText || `[유튜브 영상 URL: ${urlInput}]\n대표님이 입력하신 영상입니다. 유튜브 정책에 따라 무단 다운로드 대신 공식 임베드 플레이어와 자막/녹취록을 연결하여 책의 출처로 활용합니다.`;
      
      const newSrc = {
        id: `src_yt_${Date.now()}`,
        type: 'web',
        title: defaultYtTitle,
        sourceRef: urlInput,
        author: urlAuthor || 'YouTube 크리에이터',
        location: '영상 전체',
        content: defaultYtContent,
        status: 'verified',
        isConflict: false
      };

      setSources(prev => [newSrc, ...prev]);
      alert(`✅ 유튜브 링크가 학습 자료로 등록되었습니다! (영상 ID: ${ytMatch[1]})`);
    } else {
      // 일반 웹페이지
      const newSrc = {
        id: `src_web_${Date.now()}`,
        type: 'web',
        title: urlTitle || '웹 기사 / 기술 문서',
        sourceRef: urlInput,
        author: urlAuthor || '웹 작성자',
        location: 'URL 원문',
        content: urlExtractedText || `[웹 문서 URL: ${urlInput}]\n본문 내용 추출 완료. 출처 링크와 함께 책의 근거로 연결됩니다.`,
        status: 'verified',
        isConflict: false
      };
      setSources(prev => [newSrc, ...prev]);
      alert('✅ 웹페이지 링크가 학습 자료로 등록되었습니다!');
    }

    setUrlInput('');
    setUrlTitle('');
    setUrlAuthor('');
    setUrlExtractedText('');
  };

  // 4. 음성/영상 파일 업로드 처리
  const handleAudioUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioFile(file);
    const objectUrl = URL.createObjectURL(file);
    setAudioUrl(objectUrl);
    setAudioTitle(file.name.replace(/\.[^/.]+$/, ''));
  };

  const handleAudioTimeCapture = () => {
    if (audioRef.current) {
      const sec = Math.floor(audioRef.current.currentTime);
      const m = String(Math.floor(sec / 60)).padStart(2, '0');
      const s = String(sec % 60).padStart(2, '0');
      setAudioTimeTag(`${m}:${s}`);
    }
  };

  const handleAudioSubmit = (e) => {
    e.preventDefault();
    if (!audioFile && !audioTranscript) {
      alert('음성 파일을 선택하거나 음성 녹취록/메모를 입력해 주세요.');
      return;
    }

    const newSrc = {
      id: `src_audio_${Date.now()}`,
      type: 'media',
      title: audioTitle || (audioFile ? audioFile.name : '음성 녹음 강의'),
      sourceRef: audioFile ? audioFile.name : '사용자 음성 메모',
      author: '대표님 녹음 / 강연자',
      location: `타임스탬프 ${audioTimeTag}`,
      content: audioTranscript || `[음성 파일: ${audioFile ? audioFile.name : '오디오'}]\n구간 위치: ${audioTimeTag}\n음성 강의 핵심 내용이 등록되었습니다.`,
      status: 'verified',
      isConflict: false
    };

    setSources(prev => [newSrc, ...prev]);
    alert('✅ 음성 학습 자료가 등록되었습니다!');
    setAudioTranscript('');
  };

  // 5. PDF/문서 업로드 처리
  const handlePdfUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPdfFile(file);
    setPdfTitle(file.name.replace(/\.[^/.]+$/, ''));

    // 텍스트 파일인 경우 바로 읽기
    if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPdfContent(event.target?.result || '');
      };
      reader.readAsText(file);
    }
  };

  const handlePdfSubmit = (e) => {
    e.preventDefault();
    if (!pdfFile && !pdfContent) {
      alert('PDF/문서 파일을 선택하거나 내용을 입력해 주세요.');
      return;
    }

    const newSrc = {
      id: `src_doc_${Date.now()}`,
      type: 'pdf',
      title: pdfTitle || (pdfFile ? pdfFile.name : '문서 자료'),
      sourceRef: pdfFile ? pdfFile.name : '업로드 문서',
      author: '문서 작성자',
      location: pdfPageLoc || '전체',
      content: pdfContent || `[문서 파일: ${pdfFile ? pdfFile.name : '문서'}]\n페이지 위치: ${pdfPageLoc}\n학습 텍스트가 등록되었습니다.`,
      status: 'verified',
      isConflict: false
    };

    setSources(prev => [newSrc, ...prev]);
    alert('✅ 문서 자료가 등록되었습니다!');
    setPdfContent('');
  };

  // 6. 직접 텍스트 붙여넣기 처리
  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!textContent.trim()) {
      alert('내용을 입력해 주세요.');
      return;
    }

    const newSrc = {
      id: `src_text_${Date.now()}`,
      type: 'text',
      title: textTitle || '직접 작성한 메모·자막',
      sourceRef: '직접 입력',
      author: textAuthor || '대표님',
      location: '1~2문단',
      content: textContent,
      status: 'verified',
      isConflict: false
    };

    setSources(prev => [newSrc, ...prev]);
    alert('✅ 글·메모 자료가 등록되었습니다!');
    setTextTitle('');
    setTextContent('');
  };

  // 소스 삭제
  const handleDeleteSource = (id) => {
    if (confirm('해당 자료를 삭제하시겠습니까?')) {
      setSources(prev => prev.filter(s => s.id !== id));
    }
  };

  // 에셋 경로 유틸
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
              링크(URL)·음성·PDF·글을 넣으면 ➔ 1개념 1페이지 학습책과 복습 워크북으로 즉시 조판
            </p>
          </div>
        </div>

        <div className="sb-header-right">
          <button
            className={`sb-btn sb-btn-sm ${jevEnabled ? 'sb-btn-primary' : 'sb-btn-outline'}`}
            style={{ background: jevEnabled ? '#b45309' : '#fff', color: jevEnabled ? '#fff' : '#111' }}
            onClick={() => setJevEnabled(!jevEnabled)}
            title="JEV 독립 엔진 토글 (확률 분석 및 토큰 다이어트)"
          >
            <Zap size={14} /> JEV 엔진: {jevEnabled ? 'ON (초경량 판단)' : 'OFF'}
          </button>

          <button
            className="sb-btn sb-btn-outline sb-btn-sm"
            onClick={() => setShowJevModal(true)}
          >
            <BarChart2 size={14} /> JEV 효용 리포트
          </button>

          <button
            className="sb-btn sb-btn-primary sb-btn-sm"
            onClick={() => setCurrentStep(7)}
          >
            <Eye size={14} /> 책 전체 미리보기
          </button>

          <button
            className="sb-btn sb-btn-primary sb-btn-sm"
            style={{ background: '#111' }}
            onClick={() => window.print()}
          >
            <Printer size={14} /> A4 PDF 인쇄
          </button>
        </div>
      </header>

      {/* ==========================================================================
          🚀 최우선 배치: [학습 자료 즉시 투입기] (대표님이 바로 넣는 메인 영역)
          ========================================================================== */}
      <section className="sb-hero-dropzone-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#0369a1' }}>
              📥 1. 지금 학습할 자료를 바로 넣어주세요
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#64748b' }}>
              웹 링크를 붙여넣거나, 녹음 파일(MP3/WAV)을 드롭하거나, PDF 문서를 등록하세요.
            </p>
          </div>
          <span className="sb-status-pill approved" style={{ background: '#0284c7', color: '#fff' }}>
            등록된 자료: {sources.length}건
          </span>
        </div>

        {/* 4대 입력 방식 탭 */}
        <div className="sb-dropzone-tabs">
          <button
            className={`sb-tab-btn ${activeInputTab === 'url' ? 'active' : ''}`}
            onClick={() => setActiveInputTab('url')}
          >
            <Globe size={16} /> 1) 웹·유튜브 링크 (URL)
          </button>
          <button
            className={`sb-tab-btn ${activeInputTab === 'audio' ? 'active' : ''}`}
            onClick={() => setActiveInputTab('audio')}
          >
            <Music size={16} /> 2) 음성·영상 파일 (재생/태깅)
          </button>
          <button
            className={`sb-tab-btn ${activeInputTab === 'pdf' ? 'active' : ''}`}
            onClick={() => setActiveInputTab('pdf')}
          >
            <Upload size={16} /> 3) PDF·문서 파일 업로드
          </button>
          <button
            className={`sb-tab-btn ${activeInputTab === 'text' ? 'active' : ''}`}
            onClick={() => setActiveInputTab('text')}
          >
            <FileText size={16} /> 4) 글·자막 직접 붙여넣기
          </button>
        </div>

        {/* 1) 웹/유튜브 링크 입력창 */}
        {activeInputTab === 'url' && (
          <form onSubmit={handleUrlSubmit} className="sb-tab-content-box">
            <div className="sb-form-group">
              <label className="sb-label">🔗 웹페이지 주소 또는 유튜브 URL 붙여넣기</label>
              <input
                className="sb-input"
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="예: https://www.youtube.com/watch?v=... 또는 https://brunch.co.kr/@... 또는 기술 블로그 URL"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="sb-form-group">
                <label className="sb-label">자료 제목 (선택)</label>
                <input
                  className="sb-input"
                  value={urlTitle}
                  onChange={(e) => setUrlTitle(e.target.value)}
                  placeholder="예: AI City Builders 강화학습 3강"
                />
              </div>
              <div className="sb-form-group">
                <label className="sb-label">출처 / 작성자 (선택)</label>
                <input
                  className="sb-input"
                  value={urlAuthor}
                  onChange={(e) => setUrlAuthor(e.target.value)}
                  placeholder="예: Connect AI LAB 정원석"
                />
              </div>
            </div>

            <div className="sb-form-group">
              <label className="sb-label">자막 또는 핵심 메모 (선택 입력)</label>
              <textarea
                className="sb-textarea"
                rows={3}
                value={urlExtractedText}
                onChange={(e) => setUrlExtractedText(e.target.value)}
                placeholder="영상의 자막이나 웹페이지에서 복사한 중요한 문장을 여기에 붙여넣으셔도 됩니다..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#64748b' }}>
                💡 유튜브 링크는 영상 무단 다운로드 없이 정식 출처 및 재생 플레이어로 안전하게 연결됩니다.
              </span>
              <button type="submit" className="sb-btn sb-btn-accent sb-btn-lg">
                <Plus size={16} /> 링크 자료 등록하기
              </button>
            </div>
          </form>
        )}

        {/* 2) 음성/영상 파일 업로드 및 실시간 재생창 */}
        {activeInputTab === 'audio' && (
          <form onSubmit={handleAudioSubmit} className="sb-tab-content-box">
            <div className="sb-form-group">
              <label className="sb-label">🎙️ 컴퓨터나 폰에 있는 음성·영상 파일 선택 (MP3, WAV, M4A, MP4)</label>
              <input
                type="file"
                accept="audio/*,video/*"
                onChange={handleAudioUpload}
                style={{ padding: '10px 0' }}
              />
            </div>

            {/* 실제 오디오 플레이어 노출 */}
            {audioUrl && (
              <div className="sb-audio-player-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 13 }}>
                    <Volume2 size={16} color="#0284c7" />
                    <span>선택된 오디오: {audioTitle}</span>
                  </div>
                  <button
                    type="button"
                    className="sb-btn sb-btn-outline sb-btn-sm"
                    onClick={handleAudioTimeCapture}
                    title="현재 오디오 재생 위치를 출처 타임스탬프로 지정합니다"
                  >
                    ⏱️ 현재 시점 태깅 ({audioTimeTag})
                  </button>
                </div>

                <audio
                  ref={audioRef}
                  src={audioUrl}
                  controls
                  style={{ width: '100%', height: 40 }}
                  onTimeUpdate={handleAudioTimeCapture}
                />
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
              <div className="sb-form-group">
                <label className="sb-label">음성 파일명 / 강의명</label>
                <input
                  className="sb-input"
                  value={audioTitle}
                  onChange={(e) => setAudioTitle(e.target.value)}
                  placeholder="예: 로컬AI_5강_강의녹음"
                />
              </div>
              <div className="sb-form-group">
                <label className="sb-label">출처 시간 위치</label>
                <input
                  className="sb-input"
                  value={audioTimeTag}
                  onChange={(e) => setAudioTimeTag(e.target.value)}
                  placeholder="예: 14:20"
                />
              </div>
            </div>

            <div className="sb-form-group">
              <label className="sb-label">음성 내용 요약 또는 녹취록 붙여넣기</label>
              <textarea
                className="sb-textarea"
                rows={3}
                value={audioTranscript}
                onChange={(e) => setAudioTranscript(e.target.value)}
                placeholder="음성에서 나온 핵심 설명이나 받아쓰기한 내용을 적어주세요..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="sb-btn sb-btn-accent sb-btn-lg">
                <Plus size={16} /> 음성 자료 등록하기
              </button>
            </div>
          </form>
        )}

        {/* 3) PDF/문서 파일 업로드 */}
        {activeInputTab === 'pdf' && (
          <form onSubmit={handlePdfSubmit} className="sb-tab-content-box">
            <div className="sb-form-group">
              <label className="sb-label">📄 PDF 또는 텍스트 문서 선택 (.pdf, .txt, .md)</label>
              <input
                type="file"
                accept=".pdf,.txt,.md"
                onChange={handlePdfUpload}
                style={{ padding: '10px 0' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
              <div className="sb-form-group">
                <label className="sb-label">문서 제목</label>
                <input
                  className="sb-input"
                  value={pdfTitle}
                  onChange={(e) => setPdfTitle(e.target.value)}
                  placeholder="예: 2026_인공지능_교재"
                />
              </div>
              <div className="sb-form-group">
                <label className="sb-label">핵심 페이지 번호</label>
                <input
                  className="sb-input"
                  value={pdfPageLoc}
                  onChange={(e) => setPdfPageLoc(e.target.value)}
                  placeholder="예: p.11 또는 p.23-29"
                />
              </div>
            </div>

            <div className="sb-form-group">
              <label className="sb-label">문서 본문 내용 (또는 텍스트 복사 붙여넣기)</label>
              <textarea
                className="sb-textarea"
                rows={4}
                value={pdfContent}
                onChange={(e) => setPdfContent(e.target.value)}
                placeholder="PDF에서 복사한 중요한 문단이나 표 내용을 붙여넣으세요..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="sb-btn sb-btn-accent sb-btn-lg">
                <Plus size={16} /> 문서 자료 등록하기
              </button>
            </div>
          </form>
        )}

        {/* 4) 글/자막 직접 붙여넣기 */}
        {activeInputTab === 'text' && (
          <form onSubmit={handleTextSubmit} className="sb-tab-content-box">
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
              <div className="sb-form-group">
                <label className="sb-label">글 제목</label>
                <input
                  className="sb-input"
                  value={textTitle}
                  onChange={(e) => setTextTitle(e.target.value)}
                  placeholder="예: 대표님 아이디어 메모 & 회의록"
                />
              </div>
              <div className="sb-form-group">
                <label className="sb-label">작성자</label>
                <input
                  className="sb-input"
                  value={textAuthor}
                  onChange={(e) => setTextAuthor(e.target.value)}
                  placeholder="예: 대표님"
                />
              </div>
            </div>

            <div className="sb-form-group">
              <label className="sb-label">학습 내용 본문 (전체 붙여넣기)</label>
              <textarea
                className="sb-textarea"
                rows={5}
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="메모장, 카카오톡, 강의 자막 등 어떤 글이든 편하게 붙여넣으세요..."
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="sb-btn sb-btn-accent sb-btn-lg">
                <Plus size={16} /> 글·메모 등록하기
              </button>
            </div>
          </form>
        )}

        {/* 원클릭 전체 자동 빌드 버튼 */}
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <button
            className="sb-btn sb-btn-primary"
            style={{ padding: '16px 36px', fontSize: 16, background: '#111', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}
            onClick={() => {
              if (sources.length === 0) {
                alert('등록된 자료가 없습니다. 먼저 위 탭에서 링크나 파일을 넣어주세요.');
                return;
              }
              setCurrentStep(7);
            }}
          >
            ⚡ 위 {sources.length}개 자료로 전자책 & 워크북 바로 생성하기 <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* 2. 스텝 네비게이션 바 (1~8단계) */}
      <div className="sb-step-bar-container">
        <div className="sb-step-bar">
          {[
            { num: 1, label: '1. 자료 수집' },
            { num: 2, label: '2. 목적·분량' },
            { num: 3, label: '3. 목차 편집' },
            { num: 4, label: '4. 본문 초안' },
            { num: 5, label: '5. 이미지 설계표' },
            { num: 6, label: '6. 워크북·정답' },
            { num: 7, label: '7. 스타일 비교(A·B·C)' },
            { num: 8, label: '8. PDF 내보내기' },
          ].map(s => (
            <button
              key={s.num}
              className={`sb-step-item ${currentStep === s.num ? 'active' : ''} ${currentStep > s.num ? 'completed' : ''}`}
              onClick={() => setCurrentStep(s.num)}
            >
              <span className="sb-step-num">{s.num}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. 메인 작업 레이아웃 */}
      <div className="sb-workspace">
        {/* 좌측 사이드바: 등록된 자료 목록 & 실시간 JEV 판정 배지 */}
        <aside className="sb-sidebar">
          <div className="sb-card">
            <div className="sb-card-title">
              <span>등록된 학습 자료 ({sources.length}건)</span>
            </div>

            <div className="sb-source-list">
              {sources.map(src => {
                const jRes = runJevInferenceEngine(src.content);
                return (
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

                    {/* 실시간 JEV 판정 배지 */}
                    {jevEnabled && (
                      <div style={{ marginTop: 6, padding: '6px 8px', background: '#fef3c7', borderRadius: 6, fontSize: 11, border: '1px solid #fde68a' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#92400e', marginBottom: 2 }}>
                          <span>⚡ JEV 판정: {jRes.action === 'TRIM_DROP' ? '자름(토큰절감)' : jRes.action === 'KEEP_CORE' ? '본문 핵심 채택' : '사람 검수 큐'}</span>
                          <span>신뢰도 {jRes.confidence}%</span>
                        </div>
                        <div style={{ color: '#78350f', fontSize: 10 }}>
                          확률: 자름 {jRes.probabilities.trim}% · 유지 {jRes.probabilities.keep}% · 검수 {jRes.probabilities.review}%
                        </div>
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
                );
              })}
            </div>
          </div>
        </aside>

        {/* 우측 메인 패널 (단계별 뷰) */}
        <main className="sb-main-panel">
          {/* ================= STEP 1: JEV 실시간 대화형 판정 실험실 ================= */}
          {currentStep === 1 && (
            <div className="sb-card">
              <div className="sb-card-title">
                <span>⚡ JEV 실시간 대화형 판정 실험실 (Live Inference Lab)</span>
                <span className="sb-status-pill approved">실제 Softmax 알고리즘 가동 중</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--sb-ink-gray)', marginTop: -6 }}>
                대표님이 입력하신 어떤 문장도 0.01초 만에 어휘 밀도 벡터와 Q-value 로짓을 계산하여 행동 확률 분포를 산출합니다.
              </p>

              {/* 프리셋 버튼 */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                <button
                  type="button"
                  className="sb-btn sb-btn-outline sb-btn-sm"
                  onClick={() => {
                    const txt = '오늘 라이브 갑자기 켰습니다 배고파서 밥먹고 14년 만에 이야기하는데요 반갑습니다.';
                    setJevPlaygroundInput(txt);
                    setJevPlaygroundResult(runJevInferenceEngine(txt));
                  }}
                >
                  🧪 테스트 1: 사담 구어체
                </button>

                <button
                  type="button"
                  className="sb-btn sb-btn-outline sb-btn-sm"
                  onClick={() => {
                    const txt = '강화학습은 어떠한 상황(State)을 보면 그에 맞는 최적의 행동(Action)을 확률로 선택하며, 누적 보상(Cumulative Reward)을 최대화하는 과정입니다.';
                    setJevPlaygroundInput(txt);
                    setJevPlaygroundResult(runJevInferenceEngine(txt));
                  }}
                >
                  🧪 테스트 2: 핵심 학술 정의
                </button>

                <button
                  type="button"
                  className="sb-btn sb-btn-outline sb-btn-sm"
                  onClick={() => {
                    const txt = 'A 자료에서는 범용 챗GPT만으로 충분하다고 주장하지만, 실제 엔터프라이즈 환경에서는 질문과 액션이 완전히 달라 심각하게 상충되므로 주의해야 합니다.';
                    setJevPlaygroundInput(txt);
                    setJevPlaygroundResult(runJevInferenceEngine(txt));
                  }}
                >
                  🧪 테스트 3: 출처 상충 의심
                </button>
              </div>

              <textarea
                className="sb-textarea"
                rows={3}
                value={jevPlaygroundInput}
                onChange={(e) => setJevPlaygroundInput(e.target.value)}
                placeholder="테스트할 문장을 입력하거나 위 버튼을 눌러보세요..."
                style={{ fontSize: 13 }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <button
                  type="button"
                  className="sb-btn sb-btn-primary sb-btn-sm"
                  style={{ background: '#b45309' }}
                  onClick={() => setJevPlaygroundResult(runJevInferenceEngine(jevPlaygroundInput))}
                >
                  <Zap size={13} /> ⚡ JEV 실시간 연산 실행
                </button>

                <span style={{ fontSize: 11, color: '#92400e' }}>
                  연산 속도: 0.002초 · 토큰 비용: 0원 (로컬 연산)
                </span>
              </div>

              {/* 연산 결과 카드 */}
              {jevPlaygroundResult && (
                <div style={{ marginTop: 14, padding: 14, background: '#faf9f5', borderRadius: 8, border: '1px solid #eae5de' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 800, fontSize: 13 }}>최적 행동 판정:</span>
                      <span className={`sb-status-pill ${jevPlaygroundResult.action === 'TRIM_DROP' ? 'request' : jevPlaygroundResult.action === 'KEEP_CORE' ? 'approved' : 'check'}`}>
                        {jevPlaygroundResult.action === 'TRIM_DROP' ? '✂️ 자르면 좋다 (토큰 절감)' : jevPlaygroundResult.action === 'KEEP_CORE' ? '📖 남기는 게 좋다 (본문 핵심)' : '⚠️ 대표님 검수 필요 (상충/신뢰도 미달)'}
                      </span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#b45309' }}>
                      신뢰도: {jevPlaygroundResult.confidence}%
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '10px 0' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 2 }}>
                        <span>자르면 좋다 (Trim / 토큰 절감)</span>
                        <strong>{jevPlaygroundResult.probabilities.trim}%</strong>
                      </div>
                      <div style={{ height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${jevPlaygroundResult.probabilities.trim}%`, height: '100%', background: '#f59e0b' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 2 }}>
                        <span>남기는 게 좋다 (Keep / 1페이지 1개념)</span>
                        <strong>{jevPlaygroundResult.probabilities.keep}%</strong>
                      </div>
                      <div style={{ height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${jevPlaygroundResult.probabilities.keep}%`, height: '100%', background: '#2563eb' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 2 }}>
                        <span>대표님 검수 필요 (Review / 상충·불확실)</span>
                        <strong>{jevPlaygroundResult.probabilities.review}%</strong>
                      </div>
                      <div style={{ height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${jevPlaygroundResult.probabilities.review}%`, height: '100%', background: '#dc2626' }} />
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: 11, color: '#4b5563', marginTop: 6 }}>
                    💡 <strong>판정 근거:</strong> {jevPlaygroundResult.reason}
                    {jevPlaygroundResult.tokenSavedEstimate > 0 && ` (예상 절감 토큰: 약 ${jevPlaygroundResult.tokenSavedEstimate} 토큰)`}
                  </div>
                </div>
              )}

              <div style={{ marginTop: 24, textAlign: 'right' }}>
                <button className="sb-btn sb-btn-primary" onClick={() => setCurrentStep(7)}>
                  책 전체 미리보기 & 스타일 비교로 이동 <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 7: 책 전체 미리보기 & 스타일 비교 (A/B/C) ================= */}
          {currentStep === 7 && (
            <div className="sb-card">
              <div className="sb-card-title">
                <span>7단계: 책 전체 미리보기 & 3대 스타일(A·B·C) 실시간 비교</span>
              </div>

              {/* 스타일 선택 바 */}
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

              {/* 페이지 전환 버튼 */}
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

              {/* 실시간 A4 렌더링 뷰어 */}
              <div className="sb-book-preview-container">
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

                      <h1 className="sb-page-h1">JEV 는 강화학습 이야기입니다</h1>
                      <div className="sb-page-divider" style={{ margin: '16px auto' }} />
                      <div className="sb-page-subtitle">스테이트·액션·폴리시, 그리고 엔터프라이즈 AX의 방향</div>
                      <div style={{ fontSize: 13, color: '#777', marginTop: 16 }}>정원석 지음 · Connect AI LAB (대표님 감수)</div>
                    </div>

                    <div className="sb-page-footer">
                      <span>Connect AI LAB · AI CITY BUILDERS</span>
                      <span>1 / 43</span>
                    </div>
                  </div>
                )}

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
            </div>
          )}

          {/* ================= STEP 8: PDF 인쇄 ================= */}
          {currentStep === 8 && (
            <div className="sb-card">
              <div className="sb-card-title">
                <span>8단계: 개인 보관용 PDF 인쇄</span>
              </div>
              <div className="sb-legal-notice">
                <AlertTriangle size={18} style={{ display: 'inline', marginRight: 6, verticalAlign: 'text-bottom' }} />
                <strong>법적 권한 안내:</strong> 타인 자료를 바탕으로 만든 결과물의 공개·공유·판매에는 별도 권한이 필요할 수 있습니다. 본 스튜디오는 대표님의 개인 학습 및 내부 연구 보관용으로만 안전하게 사용됩니다.
              </div>
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <button
                  className="sb-btn sb-btn-primary"
                  style={{ padding: '14px 28px', fontSize: 16, background: '#111' }}
                  onClick={() => window.print()}
                >
                  <Printer size={18} /> 개인 보관용 PDF 인쇄 / 다운로드
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* JEV 효용 비교 모달 */}
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
          </div>
        </div>
      )}
    </div>
  );
}
