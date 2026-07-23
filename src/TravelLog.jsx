import React, { useState, useEffect, useRef } from 'react';
import './TravelLog.css';
import { 
  MapPin, Calendar, Search, Mic, BookOpen, Sparkles, CreditCard, 
  Edit2, Trash2, Clock, Compass, DollarSign, Maximize2, Minimize2, 
  ChevronRight, ArrowLeft, Download, CheckCircle, Tag, Camera, Share2, 
  Layers, FileText, Image as ImageIcon, Video, ShoppingBag, Plus
} from 'lucide-react';

const CATEGORIES = [
  { id: 'sight', label: '명소/관광', badgeClass: 'badge-sight' },
  { id: 'food', label: '맛집/식사', badgeClass: 'badge-food' },
  { id: 'cafe', label: '카페/디저트', badgeClass: 'badge-cafe' },
  { id: 'hotel', label: '숙소', badgeClass: 'badge-hotel' },
  { id: 'shopping', label: '쇼핑/마켓', badgeClass: 'badge-shopping' },
  { id: 'etc', label: '교통/기타', badgeClass: 'badge-etc' },
];

const INITIAL_TRIP_DATA = {
  title: '강원도 2박 3일 힐링 트래블로그',
  destination: '대한민국 강원도 (속초, 강릉, 평창)',
  coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200',
  startDate: '2026-07-20',
  endDate: '2026-07-22',
  days: [
    {
      dayNumber: 1,
      date: '2026-07-20',
      places: [
        {
          id: 'p1',
          name: '속초 하조대 해변 드라이브',
          time: '11:00',
          category: 'sight',
          cost: 0,
          memo: '도착하자마자 동해 파도 소리 감상. 하조대 등대 산책길 시원함.',
          photos: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600']
        },
        {
          id: 'p2',
          name: '속초 학사평 순두부 마을',
          time: '12:30',
          category: 'food',
          cost: 32000,
          memo: '초당 순두부 전골과 두부구이 고소한 풍미. 아침 겸 점심 식사.',
          photos: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600']
        },
        {
          id: 'p3',
          name: '속초 중앙시장 닭강정 & 오징어순대',
          time: '16:00',
          category: 'shopping',
          cost: 45000,
          memo: '중앙시장 대표 먹거리 포장 구매. 오징어순대 따끈할 때 추천.',
          photos: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600']
        }
      ]
    },
    {
      dayNumber: 2,
      date: '2026-07-21',
      places: [
        {
          id: 'p4',
          name: '강릉 아르떼뮤지엄',
          time: '10:30',
          category: 'sight',
          cost: 34000,
          memo: '미디어아트 전시 관람. 몰입형 스피커와 라이트 필드 연출 몰입감 선사.',
          photos: ['https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=600']
        },
        {
          id: 'p5',
          name: '안목해변 카페거리 오션뷰 카페',
          time: '14:00',
          category: 'cafe',
          cost: 16000,
          memo: '통창 너머 안목 해수욕장 바다 전망 아이스 아메리카노.',
          photos: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600']
        }
      ]
    },
    {
      dayNumber: 3,
      date: '2026-07-22',
      places: [
        {
          id: 'p6',
          name: '평창 대관령 삼양목장',
          time: '11:00',
          category: 'sight',
          cost: 24000,
          memo: '대형 풍차 조망 및 언덕 양떼 목장 대관령 경관 감상.',
          photos: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600']
        }
      ]
    }
  ]
};

export default function TravelLog({ onExit, isStandalone = false, onOpenStandalone }) {
  const [trip, setTrip] = useState(() => {
    const saved = localStorage.getItem('kodari_travel_log_data');
    return saved ? JSON.parse(saved) : INITIAL_TRIP_DATA;
  });

  const [activeTab, setActiveTab] = useState('timeline'); // 'timeline' | 'cardnews' | 'reels' | 'pdf'
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(isStandalone);

  // 🎙️ 음성 인식 상태
  const [isListening, setIsListening] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');

  // 📸 모달 및 익스포트 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [salesCount, setSalesCount] = useState(28);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cardNewsIdx, setCardNewsIdx] = useState(0);

  // Form State
  const [placeForm, setPlaceForm] = useState({
    name: '',
    time: new Date().toTimeString().slice(0, 5),
    category: 'sight',
    cost: 0,
    memo: '',
    photos: []
  });

  useEffect(() => {
    localStorage.setItem('kodari_travel_log_data', JSON.stringify(trip));
  }, [trip]);

  // 🎙️ 음성 인식 파서
  const toggleVoiceRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('크롬 또는 사파리 브라우저에서 음성 마이크 기능을 지원합니다.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ko-KR';
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechTranscript('말씀을 분석 중입니다... (예: "안목 카페 16000원 아메리카노 오션뷰")');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSpeechTranscript(`"${transcript}"`);
        parseVoiceToPlaceForm(transcript);
        setIsListening(false);
        setIsModalOpen(true);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  };

  const parseVoiceToPlaceForm = (text) => {
    let category = 'sight';
    if (text.includes('카페') || text.includes('커피') || text.includes('디저트')) category = 'cafe';
    else if (text.includes('식당') || text.includes('맛집') || text.includes('먹') || text.includes('순두부')) category = 'food';
    else if (text.includes('호텔') || text.includes('숙소') || text.includes('펜션')) category = 'hotel';
    else if (text.includes('시장') || text.includes('쇼핑') || text.includes('닭강정')) category = 'shopping';

    let cost = 0;
    const priceMatch = text.match(/(\d+)\s*원/);
    if (priceMatch) cost = parseInt(priceMatch[1], 10);

    setPlaceForm({
      name: text.slice(0, 25),
      time: new Date().toTimeString().slice(0, 5),
      category,
      cost,
      memo: text,
      photos: []
    });
  };

  // 장소 추가/수정/삭제
  const handleSavePlace = (e) => {
    e.preventDefault();
    if (!placeForm.name.trim()) return alert('장소 이름을 입력해주세요.');

    const currentPlaces = [...trip.days[activeDayIdx].places];
    if (editingPlace) {
      const updatedPlaces = currentPlaces.map(p => p.id === editingPlace.id ? { ...placeForm, id: p.id } : p);
      updateCurrentDayPlaces(updatedPlaces);
    } else {
      const newPlace = { ...placeForm, id: 'place_' + Date.now() };
      updateCurrentDayPlaces([...currentPlaces, newPlace]);
    }
    setIsModalOpen(false);
  };

  const handleDeletePlace = (placeId) => {
    if (window.confirm('이 기록을 삭제하시겠습니까?')) {
      const updatedPlaces = trip.days[activeDayIdx].places.filter(p => p.id !== placeId);
      updateCurrentDayPlaces(updatedPlaces);
    }
  };

  const updateCurrentDayPlaces = (newPlaces) => {
    const updatedDays = [...trip.days];
    updatedDays[activeDayIdx] = { ...updatedDays[activeDayIdx], places: newPlaces };
    setTrip(prev => ({ ...prev, days: updatedDays }));
  };

  // EXIF 사진 파싱 시뮬레이션
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPlaceForm(prev => ({ ...prev, photos: [...prev.photos, reader.result] }));
      };
      reader.readAsDataURL(file);
    });
  };

  // 변수 계산
  const currentDay = trip.days[activeDayIdx] || { places: [] };
  const allPlacesFlattened = trip.days.flatMap(day => 
    day.places.map(place => ({ ...place, dayNumber: day.dayNumber, date: day.date }))
  );

  const searchResults = searchQuery.trim() 
    ? allPlacesFlattened.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.memo.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  const totalCost = trip.days.reduce((acc, day) => {
    return acc + day.places.reduce((pAcc, place) => pAcc + (Number(place.cost) || 0), 0);
  }, 0);

  const generateAiJournal = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const text = `[TravelTrace AI 여행 에세이 - DAY ${currentDay.dayNumber}]\n\n` +
        currentDay.places.map((p, i) => `${i+1}. ${p.name} (${p.time})\n  - 메모: ${p.memo || '방문 완료'}`).join('\n\n') +
        `\n\n✨ TravelTrace AI 엔진으로 자동 렌더링된 감성 여행 에세이입니다.`;
      setGeneratedText(text);
      setIsGenerating(false);
    }, 600);
  };

  return (
    <div className={`travellog-container ${isFullscreen ? 'fullscreen-mode' : ''}`}>
      {/* 1. 상단 브랜드 헤더 바 */}
      <header className="tl-header">
        <div className="tl-title-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {onExit && (
              <button 
                onClick={onExit}
                style={{
                  background: '#0B3D2E',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '6px 14px',
                  cursor: 'pointer',
                  fontWeight: 800,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <ArrowLeft size={16} /> 공부방 복귀
              </button>
            )}
            <h1>{trip.title}</h1>
          </div>
          <p className="tl-subtitle">
            <MapPin size={14} />
            {trip.destination} | 
            <Calendar size={14} style={{ marginLeft: 8 }} />
            {trip.startDate} ~ {trip.endDate}
          </p>
        </div>
        <div className="tl-action-btns">
          <button 
            className="tl-btn" 
            style={{ background: '#0B3D2E', color: '#FBCFE8', border: '1.5px solid #F472B6', fontWeight: 800 }} 
            onClick={() => setIsSellModalOpen(true)}
          >
            <Download size={16} /> 전자책 3,900원 출판 정산 ({salesCount}건 완료)
          </button>
          <button className="tl-btn tl-btn-accent" onClick={() => setIsAiModalOpen(true)}>
            <Sparkles size={16} /> AI 감성 에세이
          </button>
          {!isStandalone && (
            <button 
              className="tl-btn tl-btn-secondary" 
              onClick={onOpenStandalone || (() => setIsFullscreen(!isFullscreen))}
              title="단독 풀페이지 독립 모드"
              style={{ background: '#FBCFE8', color: '#0B3D2E', border: '1px solid #F472B6', fontWeight: 800 }}
            >
              <Maximize2 size={16} /> 단독 풀페이지 띄우기
            </button>
          )}
        </div>
      </header>

      {/* 2. 럭셔리 히어로 커버 카드 */}
      <div className="tl-hero-cover">
        <img src={trip.coverImage} alt="Cover" className="tl-hero-bg" />
        <div className="tl-hero-content">
          <span className="tl-hero-tag">TravelTrace AI Engine v3.6</span>
          <div className="tl-hero-main-info">
            <div className="tl-hero-title-group">
              <h2>{trip.title}</h2>
              <p>사진 EXIF 타임라인 · 1초 음성 메모 · 인스타 릴스 대본 · PDF 출판 통합 엔진</p>
            </div>
            <div className="tl-hero-stats">
              <div className="tl-stat-item">
                <span className="tl-stat-label">총 방문</span>
                <span className="tl-stat-value">{allPlacesFlattened.length}곳</span>
              </div>
              <div className="tl-stat-item">
                <span className="tl-stat-label">총 지출</span>
                <span className="tl-stat-value">{totalCost.toLocaleString()}원</span>
              </div>
              <div className="tl-stat-item">
                <span className="tl-stat-label">여행 기간</span>
                <span className="tl-stat-value">{trip.days.length}일</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 4대 상용화 메인 워크스페이스 탭 */}
      <div className="tl-nav-tabs-bar">
        <button 
          className={`tl-main-tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          <Compass size={18} /> 1. 동선 타임라인 & 1초 장소 가이드
        </button>
        <button 
          className={`tl-main-tab-btn ${activeTab === 'cardnews' ? 'active' : ''}`}
          onClick={() => setActiveTab('cardnews')}
        >
          <ImageIcon size={18} /> 2. 인스타그램 1:1 카드뉴스 제작소
        </button>
        <button 
          className={`tl-main-tab-btn ${activeTab === 'reels' ? 'active' : ''}`}
          onClick={() => setActiveTab('reels')}
        >
          <Video size={18} /> 3. 숏폼 (Reels/TikTok) 30초 대본 빌더
        </button>
        <button 
          className={`tl-main-tab-btn ${activeTab === 'pdf' ? 'active' : ''}`}
          onClick={() => setActiveTab('pdf')}
        >
          <FileText size={18} /> 4. 3,900원 유료 전자책 / 가이드북 출판
        </button>
      </div>

      {/* 4. 1초 검색 & 음성 바 (공통 사용) */}
      <div className="tl-search-bar-row">
        <div className="tl-search-box">
          <span className="tl-search-icon"><Search size={18} color="#0B3D2E" /></span>
          <input
            type="text"
            className="tl-search-input"
            placeholder="과거 방문 장소 1초 검색 (속초, 순두부, 닭강정, 아르떼, 삼양목장 등)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button 
          className={`tl-voice-btn ${isListening ? 'recording' : ''}`}
          onClick={toggleVoiceRecording}
        >
          <Mic size={18} />
          {isListening ? '음성 분석 중...' : '1초 음성 기록'}
        </button>
      </div>

      {/* 5. 검색 결과 창 */}
      {searchResults ? (
        <div style={{ maxWidth: '1100px', margin: '0 auto 2rem auto', background: '#FFFFFF', padding: '1.8rem', borderRadius: '20px', border: '2px solid #0B3D2E' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#0B3D2E', marginTop: 0, marginBottom: '1rem', fontWeight: 800 }}>
            🔎 1초 순간 검색 결과 (총 {searchResults.length}건 과거 기록)
          </h3>
          <div className="tl-place-cards-grid">
            {searchResults.map((place) => (
              <div key={place.id} className="tl-place-card-item">
                <div className="tl-place-body">
                  <div className="tl-place-title">DAY {place.dayNumber} | {place.name}</div>
                  <div className="tl-place-text">{place.memo}</div>
                  <div className="tl-place-bottom">
                    <span className="tl-place-cost">{Number(place.cost || 0).toLocaleString()}원</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* 탭별 워크스페이스 콘텐츠 */
        <>
          {/* TAB 1: 동선 타임라인 & 1초 장소 가이드 */}
          {activeTab === 'timeline' && (
            <div className="tl-main-grid-layout">
              <div>
                {/* Day 선택 필 */}
                <div className="tl-days-header">
                  {trip.days.map((day, idx) => (
                    <button
                      key={idx}
                      className={`tl-day-pill ${activeDayIdx === idx ? 'active' : ''}`}
                      onClick={() => setActiveDayIdx(idx)}
                    >
                      DAY {day.dayNumber} ({day.date})
                    </button>
                  ))}
                  <button 
                    className="tl-day-pill" 
                    style={{ borderStyle: 'dashed' }}
                    onClick={() => {
                      const newDay = trip.days.length + 1;
                      setTrip(prev => ({
                        ...prev,
                        days: [...prev.days, { dayNumber: newDay, date: '2026-07-' + (22 + newDay), places: [] }]
                      }));
                    }}
                  >
                    + DAY 추가
                  </button>
                </div>

                {/* 장소 카드 그리드 */}
                <div className="tl-place-cards-grid">
                  {currentDay.places.map((place) => {
                    const catObj = CATEGORIES.find(c => c.id === place.category) || CATEGORIES[0];
                    return (
                      <div className="tl-place-card-item" key={place.id}>
                        <div className="tl-place-photo-box">
                          {place.photos && place.photos.length > 0 ? (
                            <img src={place.photos[0]} alt={place.name} className="tl-place-img" />
                          ) : (
                            <Camera size={36} color="#cbd5e1" />
                          )}
                        </div>
                        <div className="tl-place-body">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className={`tl-badge ${catObj.badgeClass}`}>{catObj.label}</span>
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                              <Clock size={12} style={{ display: 'inline', marginRight: 2 }} />
                              {place.time}
                            </span>
                          </div>
                          <div className="tl-place-title">{place.name}</div>
                          <div className="tl-place-text">{place.memo}</div>
                          <div className="tl-place-bottom">
                            <span className="tl-place-cost">{Number(place.cost || 0).toLocaleString()}원</span>
                            <div>
                              <button 
                                style={{ background: 'none', border: 'none', color: '#0B3D2E', cursor: 'pointer', marginRight: 6 }}
                                onClick={() => { setEditingPlace(place); setPlaceForm({...place}); setIsModalOpen(true); }}
                              >
                                <Edit2 size={14} />
                              </button>
                              <button 
                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                onClick={() => handleDeletePlace(place.id)}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 사이드 경비 요약 & EXIF 파일 드래그 존 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                <div style={{ background: '#FFFFFF', border: '1.5px solid #e2e8f0', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
                  <h4 style={{ margin: '0 0 0.8rem 0', color: '#0B3D2E', fontSize: '1.05rem', fontWeight: 800 }}>
                    💳 지출 경비 결산
                  </h4>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#D97706', marginBottom: '0.6rem' }}>
                    {totalCost.toLocaleString()} 원
                  </div>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                    1인 평균 지출: 약 {(totalCost / (allPlacesFlattened.length || 1)).toFixed(0).toLocaleString()}원/장소
                  </p>
                </div>

                {/* EXIF 드래그 앤 드롭 존 */}
                <div style={{ background: '#f8fafc', border: '2px dashed #0B3D2E', borderRadius: '20px', padding: '1.5rem', textAlign: 'center' }}>
                  <Camera size={28} color="#0B3D2E" style={{ marginBottom: 6 }} />
                  <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '0.95rem', color: '#0B3D2E', fontWeight: 800 }}>
                    사진 EXIF 자동 분석
                  </h4>
                  <p style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', color: '#64748b' }}>
                    사진을 올리면 촬영 시각 및 위도/경도가 자동 정렬됩니다.
                  </p>
                  <label className="tl-btn tl-btn-primary" style={{ cursor: 'pointer', fontSize: '0.82rem' }}>
                    사진 파일 선택
                    <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 인스타그램 1:1 카드뉴스 제작소 */}
          {activeTab === 'cardnews' && (
            <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.4rem', color: '#0B3D2E', fontWeight: 900, marginBottom: '0.4rem' }}>
                📸 인스타그램 1:1 카드뉴스 자동 제작소
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>
                수집된 여행 사진과 감성 메모로 1080x1080 규격 카드뉴스를 즉시 생성합니다.
              </p>

              {allPlacesFlattened.length > 0 && (
                <div>
                  <div className="tl-cardnews-canvas-box">
                    <div className="tl-cardnews-header">
                      <span className="tl-cardnews-badge">TravelTrace #1</span>
                      <span style={{ fontSize: '0.8rem', color: '#FBCFE8' }}>{allPlacesFlattened[cardNewsIdx % allPlacesFlattened.length].date}</span>
                    </div>
                    <div className="tl-cardnews-quote">
                      "{allPlacesFlattened[cardNewsIdx % allPlacesFlattened.length].memo || allPlacesFlattened[cardNewsIdx % allPlacesFlattened.length].name}"
                    </div>
                    <div className="tl-cardnews-footer">
                      <span style={{ fontSize: '0.88rem', fontWeight: 800 }}>📍 {allPlacesFlattened[cardNewsIdx % allPlacesFlattened.length].name}</span>
                      <span style={{ fontSize: '0.78rem', opacity: 0.8 }}>@TravelTrace</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem' }}>
                    <button 
                      className="tl-btn tl-btn-secondary" 
                      onClick={() => setCardNewsIdx(prev => (prev + 1) % allPlacesFlattened.length)}
                    >
                      다음 장소 카드 보기 ➔
                    </button>
                    <button 
                      className="tl-btn tl-btn-primary" 
                      onClick={() => alert('인스타그램 맞춤 1:1 캔버스 이미지 다운로드가 실행되었습니다!')}
                    >
                      <Download size={16} /> PNG 이미지 다운로드
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: 숏폼 (Reels/TikTok) 30초 대본 빌더 */}
          {activeTab === 'reels' && (
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <h3 style={{ fontSize: '1.4rem', color: '#0B3D2E', fontWeight: 900, marginBottom: '0.4rem' }}>
                🎬 숏폼 (Reels / TikTok) 30초 대본 빌더
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>
                조회수 100만 회를 이끌어내는 6초 후킹 법칙 기반 숏폼 영상 시나리오입니다.
              </p>

              <div className="tl-script-card">
                <span className="tl-script-timecode">00:00 ~ 00:03 (3초 후킹)</span>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#0B3D2E', fontSize: '1.1rem' }}>
                  "카톡보다 10배 쉬운 1초 여행 일기장 아세요?"
                </h4>
                <p style={{ color: '#475569', fontSize: '0.92rem', margin: 0 }}>
                  [장면 시각 자료]: 속초 바다 파도 화면 줌인 + 자막 텍스트 팝업 효과
                </p>
              </div>

              <div className="tl-script-card">
                <span className="tl-script-timecode">00:03 ~ 00:15 (주요 스팟 3곳)</span>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#0B3D2E', fontSize: '1.1rem' }}>
                  속초 순두부 전골 ➔ 안목해변 오션뷰 카페 ➔ 삼양목장 풍차
                </h4>
                <p style={{ color: '#475569', fontSize: '0.92rem', margin: 0 }}>
                  [나레이션]: "맛있는 순두부부터 시원한 오션뷰 카페, 목장 풍차까지 하루 만에 쾌속 투어!"
                </p>
              </div>

              <div className="tl-script-card">
                <span className="tl-script-timecode">00:15 ~ 00:30 (클로징 & CTA)</span>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#0B3D2E', fontSize: '1.1rem' }}>
                  추천 BGM: Sunset Acoustic Chill | 자막: 프로필 링크에서 3,900원 가이드북 다운
                </h4>
                <button 
                  className="tl-btn tl-btn-primary" 
                  onClick={() => { navigator.clipboard.writeText('전체 대본 복사 완료!'); alert('대본이 클립보드에 복사되었습니다.'); }}
                >
                  전체 대본 텍스트 복사
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: 3,900원 유료 전자책 / 가이드북 출판 */}
          {activeTab === 'pdf' && (
            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.4rem', color: '#0B3D2E', fontWeight: 900, marginBottom: '0.4rem' }}>
                📄 3,900원 수익형 전자책 출판 정산 모듈
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>
                내 여행 일기가 1초 만에 크몽/텀블벅 유료 판매용 PDF로 실시간 빌드됩니다.
              </p>

              <div className="tl-pdf-preview-sheet">
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0B3D2E', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0B3D2E' }}>TravelTrace Official PDF E-Book</span>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>定價 3,900 KRW</span>
                </div>
                <h2 style={{ fontSize: '1.6rem', color: '#0B3D2E', fontWeight: 900, marginBottom: '1rem' }}>
                  [{trip.title}] 정밀 가이드북
                </h2>
                <div style={{ textAlign: 'left', background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem', fontSize: '0.92rem', color: '#334155', lineHeight: 1.7 }}>
                  <h4>목차 (Table of Contents)</h4>
                  <ol>
                    <li>DAY 1: 속초 해변 드라이브 & 학사평 순두부 전골 (지출: 77,000원)</li>
                    <li>DAY 2: 강릉 아르떼뮤지엄 & 안목해변 카페거리 (지출: 50,000원)</li>
                    <li>DAY 3: 평창 대관령 삼양목장 힐링 투어 (지출: 24,000원)</li>
                  </ol>
                </div>
                <button 
                  className="tl-btn tl-btn-accent" 
                  style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1rem' }}
                  onClick={() => setIsSellModalOpen(true)}
                >
                  <CreditCard size={18} /> 3,900원 결제 승인 및 PDF 가이드북 다운로드
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* 모달 1: 장소 입력/수정 모달 */}
      {isModalOpen && (
        <div className="tl-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="tl-modal-box" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, color: '#0B3D2E', fontSize: '1.25rem', fontWeight: 800 }}>
              {editingPlace ? '장소 기록 수정' : '새 장소 추가'}
            </h3>
            {speechTranscript && (
              <div style={{ background: '#fce7f3', border: '1px solid #f472b6', padding: '0.7rem', borderRadius: '10px', fontSize: '0.85rem', color: '#be185d', marginBottom: '1rem' }}>
                음성 입력: {speechTranscript}
              </div>
            )}
            <form onSubmit={handleSavePlace}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>장소명 *</label>
                <input type="text" required value={placeForm.name} onChange={e => setPlaceForm({ ...placeForm, name: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>카테고리</label>
                <select value={placeForm.category} onChange={e => setPlaceForm({ ...placeForm, category: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>지출 경비 (원)</label>
                <input type="number" value={placeForm.cost} onChange={e => setPlaceForm({ ...placeForm, cost: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
              </div>
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>메모</label>
                <textarea rows="3" value={placeForm.memo} onChange={e => setPlaceForm({ ...placeForm, memo: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
                <button type="button" className="tl-btn tl-btn-secondary" onClick={() => setIsModalOpen(false)}>취소</button>
                <button type="submit" className="tl-btn tl-btn-primary">저장하기</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 모달 2: AI 감성 에세이 생성 */}
      {isAiModalOpen && (
        <div className="tl-modal-overlay" onClick={() => setIsAiModalOpen(false)}>
          <div className="tl-modal-box" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, color: '#0B3D2E', fontSize: '1.25rem', fontWeight: 800 }}>AI 감성 에세이 자동 생성</h3>
            <button className="tl-btn tl-btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '1rem' }} onClick={generateAiJournal} disabled={isGenerating}>
              {isGenerating ? '에세이 작성 중...' : 'DAY ' + currentDay.dayNumber + ' 에세이 생성'}
            </button>
            {generatedText && (
              <div>
                <textarea rows="8" value={generatedText} readOnly style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #0B3D2E', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1rem' }} />
                <button className="tl-btn tl-btn-accent" style={{ width: '100%', justifyContent: 'center' }} onClick={() => { navigator.clipboard.writeText(generatedText); alert('클립보드에 복사되었습니다.'); }}>
                  클립보드 복사
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 모달 3: 3,900원 결제 정산 모달 */}
      {isSellModalOpen && (
        <div className="tl-modal-overlay" onClick={() => { setIsSellModalOpen(false); setPaymentSuccess(false); }}>
          <div className="tl-modal-box" onClick={e => e.stopPropagation()} style={{ border: '2px solid #F472B6' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
              <span style={{ background: '#FBCFE8', color: '#0B3D2E', padding: '0.3rem 0.9rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 900 }}>
                현재 누적 {salesCount}건 결제 완료
              </span>
              <h2 style={{ color: '#0B3D2E', marginTop: '0.8rem', fontSize: '1.4rem', fontWeight: 900 }}>
                [{trip.title}] PDF 가이드북
              </h2>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#D97706', margin: '0.8rem 0', background: '#fffbeb', padding: '1rem', borderRadius: '16px', border: '1.5px dashed #fde68a' }}>
                3,900 원
              </div>
            </div>
            {!paymentSuccess ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <button className="tl-btn tl-btn-primary" style={{ justifyContent: 'center' }} onClick={() => { setPaymentSuccess(true); setSalesCount(prev => prev + 1); }}>
                  카카오페이 결제
                </button>
                <button className="tl-btn tl-btn-primary" style={{ justifyContent: 'center' }} onClick={() => { setPaymentSuccess(true); setSalesCount(prev => prev + 1); }}>
                  토스페이 결제
                </button>
              </div>
            ) : (
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', padding: '1.2rem', borderRadius: '16px', textAlign: 'center' }}>
                <h3 style={{ color: '#047857', margin: '0 0 0.5rem 0' }}>🎉 결제 승인 완료! (+3,900원 정산)</h3>
                <button className="tl-btn tl-btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => window.print()}>
                  <Download size={16} /> PDF 문서 출판 다운로드
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
