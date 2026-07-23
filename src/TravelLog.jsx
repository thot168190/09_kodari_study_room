import React, { useState, useEffect } from 'react';
import './TravelLog.css';
import { 
  MapPin, Calendar, Search, Mic, BookOpen, Sparkles, CreditCard, 
  Edit2, Trash2, Clock, Compass, DollarSign, Maximize2, Minimize2, 
  ChevronRight, ArrowLeft, Download, CheckCircle, Tag, Camera, Share2, 
  Layers, FileText, Image as ImageIcon, Video, Music, Play, Pause, Plane, Plus
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
  origin: '서울 (ICN)',
  destination: '강원도 (양양/속초)',
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

  const [activeTab, setActiveTab] = useState('timeline');
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(isStandalone);
  const [isPlayingBgm, setIsPlayingBgm] = useState(false);

  // 🎙️ 음성 및 결제 모달
  const [isListening, setIsListening] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [salesCount, setSalesCount] = useState(32);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

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

  // 음성 마이크
  const toggleVoiceRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('크롬 또는 사파리 브라우저에서 음성 마이크 기능을 지원합니다.');
      return;
    }
    if (isListening) { setIsListening(false); return; }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ko-KR';
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (e) => {
        const text = e.results[0][0].transcript;
        parseVoiceToForm(text);
        setIsListening(false);
        setIsModalOpen(true);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (err) { setIsListening(false); }
  };

  const parseVoiceToForm = (text) => {
    let category = 'sight';
    if (text.includes('카페') || text.includes('커피')) category = 'cafe';
    else if (text.includes('맛집') || text.includes('순두부') || text.includes('식당')) category = 'food';
    else if (text.includes('숙소') || text.includes('호텔')) category = 'hotel';

    let cost = 0;
    const match = text.match(/(\d+)\s*원/);
    if (match) cost = parseInt(match[1], 10);

    setPlaceForm({
      name: text.slice(0, 20),
      time: new Date().toTimeString().slice(0, 5),
      category,
      cost,
      memo: text,
      photos: []
    });
  };

  // 사진 업로드 & EXIF 파싱
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoUrl = reader.result;
        const fakeTime = new Date(file.lastModified || Date.now()).toTimeString().slice(0, 5);
        const newPlace = {
          id: 'place_' + Date.now() + '_' + index,
          name: file.name.replace(/\.[^/.]+$/, "") || `사진 장소 ${index + 1}`,
          time: fakeTime,
          category: 'sight',
          cost: 0,
          memo: `📷 사진 파일(${file.name}) 업로드. 시각: ${fakeTime}`,
          photos: [photoUrl]
        };

        setTrip(prev => {
          const updatedDays = [...prev.days];
          const currentPlaces = updatedDays[activeDayIdx]?.places || [];
          updatedDays[activeDayIdx] = {
            ...updatedDays[activeDayIdx],
            places: [newPlace, ...currentPlaces]
          };
          return { ...prev, days: updatedDays };
        });
      };
      reader.readAsDataURL(file);
    });

    alert(`🎉 ${files.length}장의 사진이 분석되어 현재 Day의 타임라인 카드로 즉시 생성되었습니다!`);
  };

  const handleSavePlace = (e) => {
    e.preventDefault();
    if (!placeForm.name.trim()) return alert('장소 이름을 입력해주세요.');
    const currentPlaces = [...trip.days[activeDayIdx].places];
    if (editingPlace) {
      const updated = currentPlaces.map(p => p.id === editingPlace.id ? { ...placeForm, id: p.id } : p);
      updateCurrentDayPlaces(updated);
    } else {
      updateCurrentDayPlaces([...currentPlaces, { ...placeForm, id: 'place_' + Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const handleDeletePlace = (id) => {
    if (window.confirm('기록을 삭제하시겠습니까?')) {
      updateCurrentDayPlaces(trip.days[activeDayIdx].places.filter(p => p.id !== id));
    }
  };

  const updateCurrentDayPlaces = (newPlaces) => {
    const updatedDays = [...trip.days];
    updatedDays[activeDayIdx] = { ...updatedDays[activeDayIdx], places: newPlaces };
    setTrip(prev => ({ ...prev, days: updatedDays }));
  };

  const allPlaces = trip.days.flatMap(d => d.places.map(p => ({ ...p, dayNumber: d.dayNumber })));
  const totalCost = trip.days.reduce((acc, d) => acc + d.places.reduce((pAcc, p) => pAcc + (Number(p.cost) || 0), 0), 0);

  return (
    <div className={`travellog-container ${isFullscreen ? 'fullscreen-mode' : ''}`}>
      {/* 1. 상단 티켓 탑승권 스타일 브랜드 카드 */}
      <div className="tl-ticket-card">
        <div className="tl-ticket-watermark">TRAVEL</div>
        <div className="tl-ticket-header">
          <span className="tl-ticket-badge">TravelTrace AI Boarding Pass</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {onExit && (
              <button onClick={onExit} style={{ background: '#FFFFFF', color: '#06382B', border: 'none', borderRadius: 10, padding: '5px 12px', fontWeight: 800, cursor: 'pointer' }}>
                ← 공부방 복귀
              </button>
            )}
            {!isStandalone && (
              <button onClick={onOpenStandalone || (() => setIsFullscreen(!isFullscreen))} style={{ background: '#FBCFE8', color: '#06382B', border: 'none', borderRadius: 10, padding: '5px 12px', fontWeight: 800, cursor: 'pointer' }}>
                🗖 단독 풀페이지
              </button>
            )}
          </div>
        </div>

        <div className="tl-ticket-route">
          <div className="tl-route-point">
            <h3>{trip.origin}</h3>
            <p>출발지</p>
          </div>
          <div className="tl-route-line">
            <div className="tl-route-plane-icon"><Plane size={14} /></div>
          </div>
          <div className="tl-route-point" style={{ textAlign: 'right' }}>
            <h3>{trip.destination}</h3>
            <p>목적지</p>
          </div>
        </div>

        <div className="tl-ticket-stats">
          <div className="tl-ticket-stat-box">
            <label>총 방문 장소</label>
            <span>{allPlaces.length} 곳</span>
          </div>
          <div className="tl-ticket-stat-box">
            <label>총 여행 경비</label>
            <span>{totalCost.toLocaleString()} 원</span>
          </div>
          <div className="tl-ticket-stat-box">
            <label>일정 기간</label>
            <span>{trip.days.length} 일</span>
          </div>
          <div className="tl-ticket-stat-box">
            <label>수익 정산 출판</label>
            <span>3,900 원/권</span>
          </div>
        </div>
      </div>

      {/* 2. 현대적 워크스페이스 탭바 */}
      <div className="tl-modern-tabs">
        <button className={`tl-tab-item ${activeTab === 'timeline' ? 'active' : ''}`} onClick={() => setActiveTab('timeline')}>
          <Compass size={18} /> 1. 동선 타임라인 & 1초 장소 가이드
        </button>
        <button className={`tl-tab-item ${activeTab === 'cardnews' ? 'active' : ''}`} onClick={() => setActiveTab('cardnews')}>
          <ImageIcon size={18} /> 2. 인스타그램 1:1 카드뉴스
        </button>
        <button className={`tl-tab-item ${activeTab === 'reels' ? 'active' : ''}`} onClick={() => setActiveTab('reels')}>
          <Video size={18} /> 3. 숏폼 (Reels/TikTok) 30초 대본
        </button>
        <button className={`tl-tab-item ${activeTab === 'pdf' ? 'active' : ''}`} onClick={() => setActiveTab('pdf')}>
          <FileText size={18} /> 4. 3,900원 PDF 출판 정산
        </button>
      </div>

      {/* 3. 1초 음성 마이크 & 키워드 검색 바 */}
      <div className="tl-voice-capsule-bar">
        <Search size={20} color="#06382B" />
        <input
          type="text"
          className="tl-search-input-field"
          placeholder="속초, 순두부, 오션뷰 카페, 삼양목장 등 1초 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <label className="tl-voice-pulse-btn" style={{ background: '#0F6A4B', cursor: 'pointer' }}>
          <Camera size={16} /> 사진 선택
          <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} style={{ display: 'none' }} />
        </label>
        <button className={`tl-voice-pulse-btn ${isListening ? 'recording' : ''}`} onClick={toggleVoiceRecording}>
          <Mic size={16} /> {isListening ? '듣는 중...' : '1초 음성 기록'}
        </button>
      </div>

      {/* 4. 타임라인 메인 피드 */}
      {activeTab === 'timeline' && (
        <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem', overflowX: 'auto' }}>
            {trip.days.map((d, i) => (
              <button
                key={i}
                onClick={() => setActiveDayIdx(i)}
                style={{
                  padding: '0.6rem 1.4rem',
                  borderRadius: 14,
                  background: activeDayIdx === i ? '#06382B' : '#FFFFFF',
                  color: activeDayIdx === i ? '#FBCFE8' : '#475569',
                  border: '1px solid #06382B',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                DAY {d.dayNumber} ({d.date})
              </button>
            ))}
          </div>

          <div className="tl-timeline-feed">
            {(trip.days[activeDayIdx]?.places || []).map((place) => (
              <div className="tl-timeline-card-wrapper" key={place.id}>
                <div className="tl-timeline-node-dot" />
                <div className="tl-feed-card">
                  <div className="tl-feed-card-header">
                    <div>
                      <h4 className="tl-feed-title">{place.name}</h4>
                      <div className="tl-feed-meta">
                        <Clock size={14} /> {place.time} | 💳 {Number(place.cost || 0).toLocaleString()}원
                      </div>
                    </div>
                    <div>
                      <button onClick={() => { setEditingPlace(place); setPlaceForm({...place}); setIsModalOpen(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#06382B', marginRight: 6 }}>
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDeletePlace(place.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {place.photos && place.photos.length > 0 && (
                    <div className="tl-feed-photo-grid">
                      {place.photos.map((pUrl, idx) => (
                        <img key={idx} src={pUrl} alt="Trip" className="tl-feed-photo-item" />
                      ))}
                    </div>
                  )}

                  <div className="tl-feed-memo">{place.memo}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. 📸 인스타 카드뉴스 탭 */}
      {activeTab === 'cardnews' && (
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ background: '#06382B', color: '#FFFFFF', padding: '2.5rem', borderRadius: 24, border: '2px solid #F472B6', boxShadow: '0 20px 50px rgba(6,56,43,0.3)', marginBottom: '1.5rem' }}>
            <span style={{ background: '#FBCFE8', color: '#06382B', padding: '0.3rem 0.8rem', borderRadius: 12, fontSize: '0.78rem', fontWeight: 900 }}>
              TravelTrace Insta #1
            </span>
            <h3 style={{ fontSize: '1.4rem', margin: '1.5rem 0', fontWeight: 900, lineHeight: 1.5 }}>
              "{allPlaces[0]?.memo || '속초 바다의 시원한 파도와 함께 시작된 감성 여행'}"
            </h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#FBCFE8' }}>📍 {allPlaces[0]?.name || '속초 하조대'}</p>
          </div>
          <button className="tl-voice-pulse-btn" style={{ margin: '0 auto' }} onClick={() => alert('인스타그램 1:1 카드뉴스 저장 완료!')}>
            <Download size={16} /> 카드뉴스 PNG 다운로드
          </button>
        </div>
      )}

      {/* 6. 🎬 숏폼 대본 탭 */}
      {activeTab === 'reels' && (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ background: '#FFFFFF', border: '1.5px solid #06382B', padding: '1.8rem', borderRadius: 20, marginBottom: '1.2rem' }}>
            <span style={{ background: '#06382B', color: '#FBCFE8', padding: '0.3rem 0.8rem', borderRadius: 10, fontSize: '0.8rem', fontWeight: 800 }}>
              00:00 ~ 00:03 (3초 후킹)
            </span>
            <h4 style={{ color: '#06382B', fontSize: '1.1rem', margin: '0.6rem 0 0.3rem 0' }}>
              "삼성/애플 갤러리 앨범보다 10배 쉬운 1초 여행 일기장 아세요?"
            </h4>
            <p style={{ color: '#64748B', fontSize: '0.88rem', margin: 0 }}>[시각 자료]: 동해 파도 줌인 + 자막 텍스트 팝업</p>
          </div>
        </div>
      )}

      {/* 7. 📄 3,900원 출판 정산 탭 */}
      {activeTab === 'pdf' && (
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ background: '#FFFFFF', border: '2px solid #06382B', padding: '2.5rem', borderRadius: 24, boxShadow: '0 20px 50px rgba(6,56,43,0.1)', marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#06382B', margin: '0 0 1rem 0' }}>[{trip.title}] 유료 전자책</h2>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#F59E0B', marginBottom: '1.5rem' }}>3,900 원</div>
            <button className="tl-voice-pulse-btn" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setIsSellModalOpen(true)}>
              <CreditCard size={18} /> 카카오페이 / 토스 3,900원 정산
            </button>
          </div>
        </div>
      )}

      {/* 🎵 하단 감성 BGM 플로팅 플레이어 바 */}
      <div className="tl-bgm-floating-bar">
        <button className="tl-bgm-btn" onClick={() => setIsPlayingBgm(!isPlayingBgm)}>
          {isPlayingBgm ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 800 }}>🎵 Sunset Acoustic Travel BGM</div>
          <div style={{ fontSize: '0.72rem', color: '#FBCFE8' }}>{isPlayingBgm ? '재생 중...' : '클릭 시 힐링 브금 재생'}</div>
        </div>
      </div>

      {/* 장소 입력 모달 */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top:0, left:0, right:0, bottom:0, background: 'rgba(6,56,43,0.6)', zIndex: 100000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: 24, width: '90%', maxWidth: 500, border: '2px solid #06382B' }}>
            <h3 style={{ marginTop: 0, color: '#06382B' }}>장소 기록 입력</h3>
            <form onSubmit={handleSavePlace}>
              <input type="text" placeholder="장소명" required value={placeForm.name} onChange={e => setPlaceForm({...placeForm, name: e.target.value})} style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', borderRadius: 10, border: '1px solid #ccc' }} />
              <textarea placeholder="메모" rows="3" value={placeForm.memo} onChange={e => setPlaceForm({...placeForm, memo: e.target.value})} style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', borderRadius: 10, border: '1px solid #ccc' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '0.6rem 1.2rem', borderRadius: 10 }}>취소</button>
                <button type="submit" style={{ padding: '0.6rem 1.2rem', background: '#06382B', color: '#fff', border: 'none', borderRadius: 10 }}>저장</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3,900원 결제 모달 */}
      {isSellModalOpen && (
        <div style={{ position: 'fixed', top:0, left:0, right:0, bottom:0, background: 'rgba(6,56,43,0.6)', zIndex: 100000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: '#FFFFFF', padding: '2.2rem', borderRadius: 24, width: '90%', maxWidth: 480, border: '2px solid #F472B6', textAlign: 'center' }}>
            <h3 style={{ color: '#06382B', marginTop: 0 }}>3,900원 전자책 정산 완료</h3>
            <p style={{ color: '#64748B' }}>누적 {salesCount}건 판매 완료</p>
            {!paymentSuccess ? (
              <button className="tl-voice-pulse-btn" style={{ width: '100%', justifyContent: 'center' }} onClick={() => { setPaymentSuccess(true); setSalesCount(p => p+1); }}>
                카카오페이 / 토스 결제 승인
              </button>
            ) : (
              <div>
                <h4 style={{ color: '#047857' }}>🎉 정산 승인 완료! (+3,900원 추가)</h4>
                <button className="tl-voice-pulse-btn" style={{ width: '100%', justifyContent: 'center' }} onClick={() => window.print()}>
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
