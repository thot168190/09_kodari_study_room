import React from 'react';
import {
  Sparkles, BookOpen, Music, Bot, Cpu, Video, Compass,
  Flame, Award, Layers, ArrowRight, Zap, Volume2, ShieldCheck,
  TrendingUp, FileText, Smartphone, CheckCircle, ExternalLink, Building2
} from 'lucide-react';

export default function HomeDashboard({ onSelectTab, onOpenNiche, onOpenHub, notes = [], selectedNote, onSelectNote }) {
  const categories = [
    {
      id: 'biz',
      title: '🎵 꿀통 & 단기 현금화 트랙',
      badge: '당장 오늘 실행',
      badgeColor: '#6366f1',
      desc: '조회수·수익 터지는 유튜브 꿀통 음악 채널 발굴 및 틈새 시장 진단',
      tools: [
        {
          id: 'musicvoice',
          title: '🎧 AI 노래 & 목소리 무제한 스튜디오',
          desc: '윈도우 ssokMusic 16종 장르 + 대표님·철만이 12대 목소리 웹 완전 개조 탑재',
          icon: <Music size={20} color="#a855f7" />,
          highlight: '신규 개조 🚀',
          bg: 'linear-gradient(135deg, rgba(168, 85, 247, 0.18), rgba(2, 132, 199, 0.12))',
          border: '#a855f7'
        },
        {
          id: 'musicfinder',
          title: '꿀통 음악 채널 발굴기 (철이 v2)',
          desc: '1인 기업 맞춤형 유튜브 BGM·Lo-Fi 채널 떡상 영상 실시간 수집·분석',
          icon: <Flame size={20} color="#f43f5e" />,
          highlight: '대표 추천 🔥',
          bg: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(244, 63, 94, 0.1))',
          border: '#818cf8'
        },
        {
          id: 'nichediagnoser',
          title: '초격차 틈새(Niche) 진단기',
          desc: '기존 거대 경쟁사와의 벡터 거리를 극대화하고 바늘구멍 시장 발굴',
          icon: <Compass size={20} color="#38bdf8" />,
          bg: 'rgba(56, 189, 248, 0.08)',
          border: '#38bdf8'
        },
        {
          id: 'travellog',
          title: '1초 여행로그 SaaS',
          desc: '사진 1장으로 감성 여행 콘텐츠와 마이크로 상세페이지 자동 발행',
          icon: <TrendingUp size={20} color="#34d399" />,
          bg: 'rgba(52, 211, 153, 0.08)',
          border: '#34d399'
        }
      ]
    },
    {
      id: 'study',
      title: '📚 지식 & 1개념 1페이지 전자책',
      badge: '학습·출판 파이프라인',
      badgeColor: '#f59e0b',
      desc: '유튜브 강의나 메모를 넣으면 A4 4페이지 고화질 복습 전자책·워크북 즉시 조판',
      tools: [
        {
          id: 'studybook',
          title: '학습책·워크북 스튜디오',
          desc: '유튜브 링크 ➔ 4페이지 완벽 조판 전자책 생성 및 고화질 PDF 다운로드',
          icon: <BookOpen size={20} color="#fbbf24" />,
          highlight: '최신 개편 ✨',
          bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(217, 119, 6, 0.08))',
          border: '#f59e0b'
        },
        {
          id: 'content',
          title: '공부방 본문 & AI 브리핑',
          desc: '노션 학습 노트 열람, 핵심 1문단 요약 및 실시간 코다리 질의응답',
          icon: <Sparkles size={20} color="#a855f7" />,
          bg: 'rgba(168, 85, 247, 0.08)',
          border: '#a855f7'
        },
        {
          id: 'study',
          title: '같이 수업듣기 (DQN 벽돌깨기)',
          desc: '유튜브 강화학습 강의를 함께 보며 코다리와 실시간 토론·메모',
          icon: <Video size={20} color="#38bdf8" />,
          bg: 'rgba(56, 189, 248, 0.08)',
          border: '#38bdf8'
        },
        {
          id: 'textbook',
          title: '공식 교재란 & 아카이브',
          desc: 'Connect AI LAB 정규 교재 및 시즌2 추석특별판 원본 열람',
          icon: <FileText size={20} color="#94a3b8" />,
          bg: 'rgba(148, 163, 184, 0.08)',
          border: '#94a3b8'
        }
      ]
    },
    {
      id: 'agent',
      title: '🤖 1인 기업 AX AI 팀원',
      badge: '2년 뒤 핵심 코어',
      badgeColor: '#0284c7',
      desc: '혼자 일하지 않고 나만의 직무별 AI 에이전트와 협업하는 차세대 가상 오피스',
      tools: [
        {
          id: 'aioffice',
          title: '3D AI 가상 오피스 (DeskRPG)',
          desc: 'Hermes 에이전트 4인이 상주하며 실시간 회의·칸반 태스크 자율 실행',
          icon: <Building2 size={20} color="#c084fc" />,
          highlight: '신규 구축 🏢',
          bg: 'linear-gradient(135deg, rgba(168, 85, 247, 0.18), rgba(99, 102, 241, 0.1))',
          border: '#a855f7'
        },
        {
          id: 'jarvis',
          title: '나만의 자비스 (Hui 9B)',
          desc: 'Hermes 에이전트 기반 자율 실행 보좌관 및 실시간 태스크 통제',
          icon: <Bot size={20} color="#38bdf8" />,
          highlight: '지능형 AX',
          bg: 'rgba(2, 132, 199, 0.12)',
          border: '#0284c7'
        },
        {
          id: 'oxalpha',
          title: 'Ox Alpha (클로드 UI)',
          desc: '대화형 인터랙티브 아티팩트 및 비즈니스 모델 초고속 조판기',
          icon: <Cpu size={20} color="#da7756" />,
          bg: 'rgba(218, 119, 86, 0.1)',
          border: '#da7756'
        },
        {
          id: 'cheolmanvoice',
          title: '철만이 보이스 & Lyria 3 BGM',
          desc: '음성 복제 및 배경음악 3트랙 오디오 파이프라인 생성기',
          icon: <Volume2 size={20} color="#60a5fa" />,
          bg: 'rgba(96, 165, 250, 0.1)',
          border: '#60a5fa'
        },
        {
          id: 'voicetonote',
          title: '보이스 정제노트 & 패스보이스',
          desc: '두서없는 음성 녹음을 JEV 추론으로 잘라내어 정제된 사업 보고서로 변환',
          icon: <Zap size={20} color="#4ade80" />,
          bg: 'rgba(74, 222, 128, 0.1)',
          border: '#4ade80'
        }
      ]
    },
    {
      id: 'lab',
      title: '🔬 딥테크 & 모션 놀이터',
      badge: '피지컬 AI & 랩',
      badgeColor: '#10b981',
      desc: '로봇 제어, 3D 모션, 식약처 딥마인드 검수 등 미래 기술 실험실',
      tools: [
        {
          id: 'motion3d',
          title: '3D 모션 & 포즈 스튜디오',
          desc: 'Three.js 3D 공간에서 캐릭터 애니메이션 및 모션 캡처 시뮬레이션',
          icon: <Layers size={20} color="#34d399" />,
          bg: 'rgba(52, 211, 153, 0.1)',
          border: '#34d399'
        },
        {
          id: 'lerobot',
          title: 'LeRobot 피지컬 놀이터',
          desc: 'Hugging Face LeRobot 기반 로봇 팔 자율 제어 및 데이터셋 시각화',
          icon: <Cpu size={20} color="#c084fc" />,
          bg: 'rgba(192, 132, 252, 0.1)',
          border: '#c084fc'
        },
        {
          id: 'sciencelab',
          title: '식약처 검수 & DeepMind 랩',
          desc: '공공 식약처 안전 규정과 딥마인드 과학 AI 논문 정밀 분석',
          icon: <ShieldCheck size={20} color="#f59e0b" />,
          bg: 'rgba(245, 158, 11, 0.1)',
          border: '#f59e0b'
        },
        {
          id: 'aitamagotchi',
          title: '잉크 펫 (AI 다마고치)',
          desc: '내가 공부하고 실행한 만큼 레벨업하고 반응하는 대화형 AI 펫',
          icon: <Award size={20} color="#ec4899" />,
          bg: 'rgba(236, 72, 153, 0.1)',
          border: '#ec4899'
        }
      ]
    }
  ];

  return (
    <div className="home-dashboard" style={{
      maxWidth: 1100,
      margin: '0 auto',
      padding: '16px 12px 60px 12px',
      color: '#f8fafc'
    }}>
      {/* 🚀 대표님 환영 상단 헤더 배너 (390px 모바일 완벽 최적화) */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
        border: '1px solid rgba(129, 140, 248, 0.3)',
        borderRadius: 16,
        padding: '20px 16px',
        marginBottom: 24,
        boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#4f46e5', color: '#fff', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 800, marginBottom: 10 }}>
            <Sparkles size={13} />
            <span>코다리 부장의 1인 기업 스케일업 사령탑</span>
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 900, margin: '4px 0 8px 0', color: '#ffffff', letterSpacing: '-0.3px', lineHeight: 1.3 }}>
            대표님, 충성! 오늘 가동할 핵심 프로젝트를 선택해 주십시오.
          </h1>
          <p style={{ fontSize: 13, color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
            단기 현금화 음악 발굴기부터 1개념 1페이지 전자책 출판, 자율 AI 팀원까지 손끝 터치 하나로 즉시 가동됩니다.
          </p>

          {/* 📖 현재 선택된 학습 노트 바 */}
          {selectedNote && (
            <div style={{
              marginTop: 16,
              padding: '10px 14px',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 8
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>📖 오늘 학습 노트:</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#38bdf8' }}>{selectedNote.title}</span>
              </div>
              <button
                onClick={() => onSelectTab('content')}
                style={{
                  background: '#0284c7',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '5px 12px',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                노트 읽기 <ArrowRight size={13} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🔥 4대 핵심 카테고리 툴박스 그리드 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {categories.map((cat) => (
          <section key={cat.id} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2 style={{ fontSize: 16, fontWeight: 900, margin: 0, color: '#f8fafc' }}>{cat.title}</h2>
                <span style={{
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: 12,
                  background: cat.badgeColor,
                  color: '#ffffff'
                }}>
                  {cat.badge}
                </span>
              </div>
            </div>

            {/* 카드 그리드: 모바일 390px에서는 1열, 데스크톱에서는 2열로 자동 맞춤 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 12
            }}>
              {cat.tools.map((tool) => (
                <div
                  key={tool.id}
                  onClick={() => onSelectTab(tool.id)}
                  style={{
                    background: '#131b2e',
                    border: `1.5px solid ${tool.border || 'rgba(255, 255, 255, 0.15)'}`,
                    borderRadius: 14,
                    padding: '16px 14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 12,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.25)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.borderColor = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.borderColor = tool.border || 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: 'rgba(0,0,0,0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {tool.icon}
                      </div>
                      {tool.highlight && (
                        <span style={{
                          fontSize: 10,
                          fontWeight: 900,
                          color: '#ffffff',
                          background: '#e11d48',
                          padding: '2px 8px',
                          borderRadius: 10
                        }}>
                          {tool.highlight}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 900, color: '#ffffff', marginBottom: 6 }}>
                      {tool.title}
                    </div>
                    <p style={{ fontSize: 12.5, color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
                      {tool.desc}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', color: '#38bdf8', fontSize: 12, fontWeight: 700, gap: 4 }}>
                    <span>실행하기</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
