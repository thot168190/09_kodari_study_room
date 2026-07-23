import React, { useState, useEffect } from 'react';
import './TravelLog.css';

const CATEGORIES = [
  { id: 'sight', label: '🏖️ 명소/관광', badgeClass: 'badge-sight' },
  { id: 'food', label: '🍱 맛집/식사', badgeClass: 'badge-food' },
  { id: 'cafe', label: '☕ 카페/디저트', badgeClass: 'badge-cafe' },
  { id: 'hotel', label: '🏨 숙소', badgeClass: 'badge-hotel' },
  { id: 'shopping', label: '🛍️ 쇼핑/마켓', badgeClass: 'badge-shopping' },
  { id: 'etc', label: '🚕 교통/기타', badgeClass: 'badge-etc' },
];

const INITIAL_TRIP_DATA = {
  title: '🌲 대표님의 강원도 2박 3일 쾌속 힐링 여행',
  destination: '대한민국 강원도 (속초, 강릉, 평창)',
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
          memo: '도착하자마자 바다 소리 듣기! 바람 시원함 🌊',
          photos: []
        },
        {
          id: 'p2',
          name: '속초 학사평 순두부 마을',
          time: '12:30',
          category: 'food',
          cost: 32000,
          memo: '초당 순두부랑 전골 고소함 미침! 아침 겸 점심으로 딱 ⭐⭐⭐⭐⭐',
          photos: []
        },
        {
          id: 'p3',
          name: '속초 중앙시장 닭강정 & 오징어순대',
          time: '16:00',
          category: 'shopping',
          cost: 45000,
          memo: '줄 짧아서 바로 겟! 오징어순대 따끈할 때 먹는 것 추천.',
          photos: []
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
          memo: '미디어아트 전시 최고! 사진 찍기 너무 좋음 📸',
          photos: []
        },
        {
          id: 'p5',
          name: '안목해변 카페거리 오션뷰 카페',
          time: '14:00',
          category: 'cafe',
          cost: 16000,
          memo: '바다 보면서 아이스 아메리카노 한 잔 ☕ 주차 공간 여유 있음.',
          photos: []
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
          memo: '풍차랑 양떼 목장 풍경 대박! 공기가 진짜 맑음 🍃',
          photos: []
        }
      ]
    }
  ]
};

export default function TravelLog() {
  const [trip, setTrip] = useState(() => {
    const saved = localStorage.getItem('kodari_travel_log_data');
    return saved ? JSON.parse(saved) : INITIAL_TRIP_DATA;
  });

  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' (recent.design 스타일) | 'timeline'

  // 🎙️ 음성 인식 상태
  const [isListening, setIsListening] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');

  // 모달 제어
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [salesCount, setSalesCount] = useState(14);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

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

  // 🎙️ 음성 인식
  const toggleVoiceRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('대표님, 크롬/사파리 브라우저에서 마이크 버튼을 사용하실 수 있습니다.');
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
        setSpeechTranscript('🎙️ 말씀하고 계십니다... (예: "애월 카페 커피 18000원 대박 시원함")');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSpeechTranscript(`" ${transcript} "`);
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

  const handleTripMetaChange = (field, value) => {
    setTrip(prev => ({ ...prev, [field]: value }));
  };

  const handleAddDay = () => {
    const newDayNum = trip.days.length + 1;
    setTrip(prev => ({
      ...prev,
      days: [...prev.days, { dayNumber: newDayNum, date: '', places: [] }]
    }));
    setActiveDayIdx(trip.days.length);
  };

  const handleDeleteDay = (idx) => {
    if (trip.days.length <= 1) return alert('최소 1개의 Day는 필요합니다.');
    if (window.confirm(`Day ${idx + 1}을(를) 삭제하시겠습니까?`)) {
      const updatedDays = trip.days.filter((_, i) => i !== idx).map((day, i) => ({ ...day, dayNumber: i + 1 }));
      setTrip(prev => ({ ...prev, days: updatedDays }));
      setActiveDayIdx(Math.max(0, idx - 1));
    }
  };

  const openPlaceModal = (place = null) => {
    if (place) {
      setEditingPlace(place);
      setPlaceForm({ ...place });
    } else {
      setEditingPlace(null);
      setPlaceForm({
        name: '',
        time: new Date().toTimeString().slice(0, 5),
        category: 'sight',
        cost: 0,
        memo: '',
        photos: []
      });
    }
    setIsModalOpen(true);
  };

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
      const text = `🌿 [대표님의 기억 일기장 - DAY ${currentDay.dayNumber}]\n\n` +
        currentDay.places.map((p, i) => `${i+1}. ${p.name} (${p.time})\n👉 ${p.memo || '방문 완료'}`).join('\n\n') +
        `\n\n✨ 1초 검색 가능한 대표님 전용 여행 일기장!`;
      setGeneratedText(text);
      setIsGenerating(false);
    }, 600);
  };

  return (
    <div className="travellog-container">
      {/* 🌟 [첫 화면 메인 설명 & 1초 가이드 히어로 영역] */}
      <div style={{ maxWidth: '1050px', margin: '0 auto 2rem auto', background: '#ffffff', border: '2px solid #064e3b', borderRadius: '28px', padding: '2rem 2.2rem', boxShadow: '0 15px 40px rgba(6, 78, 59, 0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem' }}>
          <div>
            <span style={{ background: 'rgba(6, 78, 59, 0.1)', color: '#064e3b', padding: '0.3rem 0.9rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.05em' }}>
              💡 앱 정체성 & 1초 가이드
            </span>
            <h1 style={{ color: '#0f172a', fontSize: '1.8rem', fontWeight: 900, marginTop: '0.6rem', margin: '0.6rem 0 0.2rem 0' }}>
              "갔던 곳인지 아닌지 기억이 안 날 때? 카톡보다 10배 쉬운 1초 장소 기억 일기장!"
            </h1>
            <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0 }}>
              카톡 나와의 대화방이나 밴드처럼 사진과 글이 파묻히지 않고, <b>1초 음성 녹음</b>과 <b>1초 검색</b>으로 내 모든 여행 기억을 깔끔히 보관하는 전용 앱입니다.
            </p>
          </div>
          <button 
            className={`tl-voice-btn ${isListening ? 'recording' : ''}`}
            onClick={toggleVoiceRecording}
            style={{ fontSize: '1.1rem', padding: '1rem 1.8rem', background: 'linear-gradient(135deg, #064e3b, #047857)', boxShadow: '0 8px 25px rgba(6, 78, 59, 0.25)' }}
          >
            {isListening ? '🔴 음성 듣는 중...' : '🎙️ 1초 음성으로 툭 기록하기'}
          </button>
        </div>

        {/* 3가지 핵심 기능 안내 카드 3종 세트 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1.4rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.2rem' }}>
          <div style={{ background: '#f8fafc', padding: '1rem 1.2rem', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ color: '#064e3b', margin: '0 0 0.3rem 0', fontSize: '1rem' }}>🎙️ 1. 이동 중 1초 음성 기록</h4>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>차 안이나 걸어갈 때 마이크 누르고 말하면 장소, 메모, 금액이 자동 정리!</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '1rem 1.2rem', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ color: '#047857', margin: '0 0 0.3rem 0', fontSize: '1rem' }}>🔍 2. "여기 왔던 곳인가?" 1초 검색</h4>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>속초, 카페, 순두부 단어 1개만 검색해도 과거 방문 일자와 평가 1초 팝업!</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '1rem 1.2rem', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ color: '#d97706', margin: '0 0 0.3rem 0', fontSize: '1rem' }}>🛒 3. 3,900원 수익형 PDF 변환</h4>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>내 여행 일기가 1초 만에 유료 전자책 가이드북으로 빌드되어 정산 가능!</p>
          </div>
        </div>
      </div>

      {/* 상단 툴바 */}
      <header className="tl-header">
        <div className="tl-title-section">
          <h1>🌲 {trip.title}</h1>
          <p className="tl-subtitle">📍 {trip.destination} | 🗓️ {trip.startDate} ~ {trip.endDate}</p>
        </div>
        <div className="tl-action-btns">
          <button className="tl-btn" style={{ background: 'linear-gradient(135deg, #f59e0b, #ec4899)', color: 'white', fontWeight: 800 }} onClick={() => setIsSellModalOpen(true)}>
            🛒 전자책 3,900원 결제/판매 ({salesCount}건 완료🔥)
          </button>
          <button className="tl-btn tl-btn-accent" onClick={() => setIsAiModalOpen(true)}>
            🤖 AI 감성 일기
          </button>
        </div>
      </header>

      {/* 🔍 1초 검색 바 */}
      <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
        <div className="tl-search-box">
          <span className="tl-search-icon">🔍</span>
          <input
            type="text"
            className="tl-search-input"
            placeholder="아 맞다! 거기가 어디였지? (속초, 순두부, 닭강정, 아르떼, 삼양목장 등 1초 검색)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 🔍 검색 결과 뷰 */}
      {searchResults ? (
        <div style={{ maxWidth: '1050px', margin: '0 auto 2rem auto', background: 'rgba(30, 41, 59, 0.9)', padding: '1.8rem', borderRadius: '24px', border: '2px solid #38bdf8' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#38bdf8', marginTop: 0, marginBottom: '1rem' }}>
            🔎 1초 순간 검색 결과 (총 {searchResults.length}건 과거 기록 발굴!)
          </h2>
          {searchResults.length === 0 ? (
            <p style={{ color: '#94a3b8' }}>일치하는 기록이 없습니다.</p>
          ) : (
            <div className="tl-grid-container">
              {searchResults.map((place) => (
                <div key={place.id} className="tl-grid-card">
                  <div className="tl-grid-body">
                    <div className="tl-place-name">DAY {place.dayNumber} | {place.name}</div>
                    <div className="tl-place-memo">{place.memo}</div>
                    <div className="tl-place-footer">
                      <span>💳 {Number(place.cost || 0).toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* 메인 콘텐츠 레이아웃 */
        <div className="tl-main-layout">
          <div className="tl-content-left">
            {/* Day 탭 */}
            <div className="tl-days-nav">
              {trip.days.map((day, idx) => (
                <button
                  key={idx}
                  className={`tl-day-tab ${activeDayIdx === idx ? 'active' : ''}`}
                  onClick={() => setActiveDayIdx(idx)}
                >
                  DAY {day.dayNumber} {day.date ? `(${day.date})` : ''}
                </button>
              ))}
              <button className="tl-add-day-btn" onClick={handleAddDay}>+ DAY 추가</button>
            </div>

            {/* 타이틀 및 뷰 토글 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem', flexWrap: 'wrap', gap: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'white' }}>
                  📍 DAY {currentDay.dayNumber} 기억 기록
                </h2>
                <div className="tl-view-toggle-btns">
                  <button className={`tl-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
                    🔲 타일 그리드 (recent.design)
                  </button>
                  <button className={`tl-toggle-btn ${viewMode === 'timeline' ? 'active' : ''}`} onClick={() => setViewMode('timeline')}>
                    📜 타임라인
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="tl-btn tl-btn-primary" onClick={() => openPlaceModal()}>+ 직접 추가</button>
                <button className="tl-btn tl-btn-danger" onClick={() => handleDeleteDay(activeDayIdx)}>DAY 삭제</button>
              </div>
            </div>

            {/* 🔲 최근 그리드/타임라인 선택 출력 */}
            {viewMode === 'grid' ? (
              <div className="tl-grid-container">
                {currentDay.places.map((place) => {
                  const catObj = CATEGORIES.find(c => c.id === place.category) || CATEGORIES[0];
                  return (
                    <div className="tl-grid-card" key={place.id}>
                      <div className="tl-grid-img-holder">
                        {place.photos && place.photos.length > 0 ? (
                          <img src={place.photos[0]} alt={place.name} className="tl-grid-img" />
                        ) : (
                          <span style={{ fontSize: '2.5rem', opacity: 0.7 }}>{catObj.label.slice(0, 2)}</span>
                        )}
                      </div>
                      <div className="tl-grid-body">
                        <div className="tl-grid-badge-row">
                          <span className={`tl-badge ${catObj.badgeClass}`}>{catObj.label}</span>
                          <span className="tl-place-time">⏰ {place.time}</span>
                        </div>
                        <div className="tl-place-name" style={{ fontSize: '1.1rem' }}>{place.name}</div>
                        {place.memo && <div className="tl-place-memo" style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>{place.memo}</div>}
                        <div className="tl-place-footer">
                          <span className="tl-cost-tag" style={{ fontSize: '0.95rem' }}>
                            💳 {Number(place.cost || 0).toLocaleString()}원
                          </span>
                          <div>
                            <button style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', marginRight: '0.4rem' }} onClick={() => openPlaceModal(place)}>✏️</button>
                            <button style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer' }} onClick={() => handleDeletePlace(place.id)}>🗑️</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="tl-timeline">
                {currentDay.places.map((place) => {
                  const catObj = CATEGORIES.find(c => c.id === place.category) || CATEGORIES[0];
                  return (
                    <div className="tl-place-card" key={place.id}>
                      <div className="tl-place-node" />
                      <div className="tl-place-header">
                        <div className="tl-place-title-row">
                          <span className={`tl-badge ${catObj.badgeClass}`}>{catObj.label}</span>
                          <span className="tl-place-name">{place.name}</span>
                          <span className="tl-place-time">⏰ {place.time}</span>
                        </div>
                        <div>
                          <button style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', marginRight: '0.5rem' }} onClick={() => openPlaceModal(place)}>✏️</button>
                          <button style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer' }} onClick={() => handleDeletePlace(place.id)}>🗑️</button>
                        </div>
                      </div>
                      {place.memo && <div className="tl-place-memo">{place.memo}</div>}
                      <div className="tl-place-footer">
                        <span className="tl-cost-tag">💳 {Number(place.cost || 0).toLocaleString()} 원</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 오른쪽 사이드바 */}
          <div className="tl-sidebar">
            <div className="tl-card-widget">
              <h3 className="tl-widget-title">💰 총 지출 경비</h3>
              <div className="tl-total-expense">{totalCost.toLocaleString()} <span style={{ fontSize: '1rem', color: '#cbd5e1' }}>원</span></div>
            </div>
          </div>
        </div>
      )}

      {/* 입력 모달 */}
      {isModalOpen && (
        <div className="tl-modal-overlay">
          <div className="tl-modal-content">
            <div className="tl-modal-header">
              <h3>{editingPlace ? '✏️ 장소 기록 수정' : '📍 1초 장소 기록'}</h3>
              <button className="tl-close-btn" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            {speechTranscript && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.8rem', borderRadius: '10px', fontSize: '0.85rem', color: '#fca5a5', marginBottom: '1rem' }}>
                음성: {speechTranscript}
              </div>
            )}
            <form onSubmit={handleSavePlace}>
              <div className="tl-form-row">
                <label>장소 이름 *</label>
                <input type="text" required value={placeForm.name} onChange={e => setPlaceForm({ ...placeForm, name: e.target.value })} />
              </div>
              <div className="tl-form-row">
                <label>카테고리</label>
                <select value={placeForm.category} onChange={e => setPlaceForm({ ...placeForm, category: e.target.value })}>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div className="tl-form-row">
                <label>지출 경비 (원)</label>
                <input type="number" value={placeForm.cost} onChange={e => setPlaceForm({ ...placeForm, cost: e.target.value })} />
              </div>
              <div className="tl-form-row">
                <label>메모 & 1줄 기억</label>
                <textarea rows="3" value={placeForm.memo} onChange={e => setPlaceForm({ ...placeForm, memo: e.target.value })} />
              </div>
              <div className="tl-form-row">
                <label>📷 사진 첨부</label>
                <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.5rem' }}>
                <button type="button" className="tl-btn tl-btn-secondary" onClick={() => setIsModalOpen(false)}>취소</button>
                <button type="submit" className="tl-btn tl-btn-primary">저장하기</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI 일기 모달 */}
      {isAiModalOpen && (
        <div className="tl-modal-overlay">
          <div className="tl-modal-content">
            <div className="tl-modal-header">
              <h3>🤖 AI 감성 일기 자동 생성</h3>
              <button className="tl-close-btn" onClick={() => setIsAiModalOpen(false)}>×</button>
            </div>
            <button className="tl-btn tl-btn-accent" style={{ width: '100%', justifyContent: 'center', marginBottom: '1rem' }} onClick={generateAiJournal} disabled={isGenerating}>
              {isGenerating ? '🔮 생성 중...' : '✨ DAY ' + currentDay.dayNumber + ' 일기 생성'}
            </button>
            {generatedText && (
              <div>
                <div className="tl-ai-result-box">{generatedText}</div>
                <button className="tl-btn tl-btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => { navigator.clipboard.writeText(generatedText); alert('복사되었습니다!'); }}>
                  📋 클립보드 복사
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 💰 유료 전자책 모달 */}
      {isSellModalOpen && (
        <div className="tl-modal-overlay">
          <div className="tl-modal-content tl-sell-modal">
            <div className="tl-modal-header">
              <h3>🛒 코다리 수익형 니치 판매 파이프라인</h3>
              <button className="tl-close-btn" onClick={() => { setIsSellModalOpen(false); setPaymentSuccess(false); }}>×</button>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
              <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                🔥 현재 누적 {salesCount}명이 구매한 가이드북
              </span>
              <h2 style={{ color: 'white', marginTop: '0.8rem', fontSize: '1.4rem' }}>[{trip.title}] PDF 가이드북</h2>
              <div className="tl-price-tag">3,900 원</div>
            </div>
            {!paymentSuccess ? (
              <div className="tl-pay-methods">
                <button className="tl-pay-btn" onClick={() => { setPaymentSuccess(true); setSalesCount(prev => prev + 1); }}>💛 카카오페이 결제</button>
                <button className="tl-pay-btn" onClick={() => { setPaymentSuccess(true); setSalesCount(prev => prev + 1); }}>🔵 토스페이 결제</button>
              </div>
            ) : (
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', padding: '1.2rem', borderRadius: '14px', textAlign: 'center' }}>
                <h3 style={{ color: '#34d399', margin: '0 0 0.5rem 0' }}>🎉 결제 승인 완료! (+3,900원 정산)</h3>
                <button className="tl-btn tl-btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => window.print()}>📄 [PDF 출력/다운로드]</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
