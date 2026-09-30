import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Download,
  Printer,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Trash2,
  Plus,
  Search,
  FileText,
  Library,
  Copy,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Share2,
  Check,
  Zap,
  ArrowRight,
  Video,
  Edit3,
  Save,
  Palette,
  Layers,
  Type,
  Wand2,
  Lightbulb,
  FileCode
} from 'lucide-react';
import './StudyBookStudio.css';

// ============================================================================
// 1. 유튜브 ID & 메타데이터 추출 유틸
// ============================================================================
export function extractYoutubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
}

export async function fetchYoutubeMetadata(url) {
  const ytId = extractYoutubeId(url);
  if (!ytId) {
    return { title: '', author: '', thumbnailUrl: null };
  }

  // 대표님 추천 4대 마스터 영상 특화
  if (ytId === '-ZXEKtr5IXE' || url.includes('-ZXEKtr5IXE')) {
    return {
      title: '기간 한정 무료 사용 가능한 지금 가장 핫한 Flash 모델. Space Bunny',
      author: '코드팩토리',
      thumbnailUrl: `https://i.ytimg.com/vi/-ZXEKtr5IXE/hqdefault.jpg`
    };
  }
  if (ytId === 'ERQArI7K-Jw' || url.includes('ERQArI7K-Jw')) {
    return {
      title: 'FREE And UNLIMITED Long AI Video Generator | Seedance 2.5 Text and Image To Video',
      author: 'Ai Lockup',
      thumbnailUrl: `https://i.ytimg.com/vi/ERQArI7K-Jw/hqdefault.jpg`
    };
  }
  if (ytId === '4NCXTWBxcN0' || url.includes('4NCXTWBxcN0')) {
    return {
      title: '나만의 AI 팀 만들기: 설치부터 회의·업무 실행까지 | Hermes × DeskRPG',
      author: '단테랩스 (@dante-labs)',
      thumbnailUrl: `https://i.ytimg.com/vi/4NCXTWBxcN0/hqdefault.jpg`
    };
  }

  // oEmbed API 비동기 실시간 조회
  try {
    const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.title) {
        return {
          title: data.title,
          author: data.author_name || 'YouTube 크리에이터',
          thumbnailUrl: data.thumbnail_url || `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`
        };
      }
    }
  } catch (e) {
    console.warn('oEmbed API fetch 실패, 기본 썸네일 사용:', e);
  }

  return {
    title: `유튜브 강의 영상 (${ytId})`,
    author: 'YouTube 크리에이터',
    thumbnailUrl: `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`
  };
}

// ============================================================================
// 2. 4대 마스터 프리셋 전자책 데이터 (Space Bunny, Seedance, Hermes, JEV/RAG)
// ============================================================================
const MASTER_BOOKS = [
  {
    id: 'book_space_bunny',
    youtubeId: '-ZXEKtr5IXE',
    sourceRef: 'https://www.youtube.com/watch?v=-ZXEKtr5IXE',
    title: '지금 가장 핫한 Flash 모델 Space Bunny 완벽 실무 가이드',
    subtitle: '오픈코드(OpenCode)에 등장한 초고속 Flash급 AI 모델과 9분 웹사이트 빌드 벤치마크',
    author: '코드팩토리 강의 원작 · 코다리 총괄부장 집필',
    badge: '🔥 기간 한정 무료 Flash AI',
    theme: 'tech',
    createdAt: '2026.09.30',
    coverImage: 'https://i.ytimg.com/vi/-ZXEKtr5IXE/hqdefault.jpg',
    summaryBullets: [
      '오픈코드 플랫폼에 정체를 숨기고 등장한 익명의 초경량 Flash급 모델로, 1주일간 100% 무료 무제한 개방 중.',
      '에포트(Effort) 제어 기능을 탑재하여 단순 스니펫부터 복잡한 웹사이트 1회성 빌드까지 연산량과 깊이를 최적화.',
      '복잡한 레퍼런스 이미지를 건넸을 때 9분 18초 만에 고품질 웹 프론트엔드로 조판해내는 경이로운 실전 생산성 검증.'
    ],
    audience: '비용 부담 없이 초고속으로 웹앱·랜딩페이지·숏폼 프로토타입을 대량 생산하고 싶은 1인 기업가 및 개발자',
    insight: '💡 핵심 인사이트: 유료 구독 결제 전에 이 무료 Flash 모델을 레버리지하여 오늘 밤 3개의 프로토타입을 완성하는 것이 극강의 비용 효율입니다.',
    chapter1: {
      title: '제 1 장: Space Bunny의 정체와 Flash급 초고속 추론 혁신',
      body: '인공지능 모델의 트렌드가 무거운 파라미터 경쟁에서 벗어나, 가볍고 극도로 빠른 "Flash급 추론 엔진"으로 급격히 전환되고 있습니다. Space Bunny는 개발사를 공식적으로 밝히지 않은 채 오픈코드(OpenCode) 플랫폼에 테스트 형태로 전격 배포된 모델입니다. 가장 큰 특징은 인간의 타이핑 속도를 아득히 초월하여 수백 줄의 코드를 단 수 초 만에 쏟아내는 실시간 스트리밍 능력입니다.',
      stepCards: [
        { step: '01', title: '초경량 Flash 아키텍처', desc: '불필요한 사고 루프를 단축하고 핵심 태스크에 즉각 반응하여 대기 시간을 80% 이상 감축합니다.' },
        { step: '02', title: '일주일 한정 무료 이용', desc: '현재 오픈 베타 테스트 기간으로 추정되며, 일체의 토큰 과금 없이 모든 기능을 풀 파워로 이용 가능합니다.' },
        { step: '03', title: '프론트엔드 최적화', desc: 'HTML/CSS/JS 및 리액트 컴포넌트를 단일 파일로 묶어 결함 없이 즉시 렌더링하는 능력이 탁월합니다.' }
      ],
      calloutDark: '⚡ 실전 주의점: Flash 모델은 긴 추론이 필요한 무거운 백엔드 아키텍처보다, 빠른 시각화와 프론트엔드 프로토타이핑에 투입할 때 가성비가 극대화됩니다.'
    },
    chapter2: {
      title: '제 2 장: 에포트(Effort) 파라미터 세팅 & 기존 모델 비교',
      lead: '모델이 문제 해결에 쏟아붓는 연산 집중도인 에포트(Effort) 옵션에 따른 결과물 비교입니다.',
      tableRows: [
        { item: 'Default Effort (기본)', prob: '1~3초 응답', effect: '간단한 UI 스타일링, 버그 수정, 텍스트 요약에 최적화' },
        { item: 'Medium Effort (중간)', prob: '10~20초 응답', effect: '인터랙티브 기능 추가, 폼 유효성 검사, API 연동 로직' },
        { item: 'Max Effort (최대)', prob: '1~2분 심층 사고', effect: '전체 웹사이트 9분 원샷 빌드 및 자가 결함 수정(Self-Correction)' },
        { item: 'GPT-4.7 대비 속도/비용', prob: '속도 3배 / 비용 0원', effect: '빠른 가설 검증과 시안 A/B 테스트에서 압도적 우위' }
      ],
      insightNote: '단순 작업에는 Default를 두고, 완성본 빌드 시에만 Max를 주어 효율을 극대화하십시오.'
    },
    chapter3: {
      title: '제 3 장: 9분 만의 웹사이트 빌드 실전 워크플로우',
      lead: '강의 원본에서 시연된 9분 웹사이트 완성 3단계 실천 로드맵입니다.',
      steps: [
        { phase: '1단계: 레퍼런스 캡처', desc: '만들고자 하는 벤치마크 사이트의 스크린샷과 핵심 요구 명세서를 준비합니다.' },
        { phase: '2단계: Max Effort 프롬프트 주입', desc: '디자인 토큰, 한글 폰트(Pretendard), 모바일 반응형 규칙을 함께 프롬프트로 전송합니다.' },
        { phase: '3단계: 단일 HTML 미리보기 & 배포', desc: '생성된 단일 파일을 브라우저로 열어 인터랙션을 점검하고 즉시 호스팅에 연결합니다.' }
      ],
      promptTemplate: `당신은 세계 최고의 수석 프론트엔드 엔지니어입니다.
첨부한 웹사이트 디자인을 바탕으로 완벽하게 동작하는 단일 index.html을 작성하십시오.
1. 스타일: TailwindCSS CDN 또는 순수 CSS 변수 활용, 다크모드 지원
2. 반응형: 390px 모바일 화면 및 1440px 데스크톱 완벽 지원
3. 한글 폰트: Pretendard 웹폰트 적용 및 깨짐 방지
4. 인터랙션: 모든 버튼과 모달이 실제로 부드럽게 동작하도록 자바스크립트 구현`
    },
    chapter4: {
      title: '제 4 장: 핵심 복습 퀴즈 & 1인 기업 액션 체크리스트',
      q1: 'Q1. Space Bunny 모델을 당장 오늘 밤 프로젝트에 투입해야 하는 결정적 이유는?',
      a1: '일주일 한정으로 비용이 0원이며, Flash급 추론 속도로 30분 만에 3가지 이상의 웹 서비스 시안을 비교 검증할 수 있기 때문입니다.',
      q2: 'Q2. 복잡한 인터랙티브 웹앱을 만들 때 에포트(Effort)를 어떻게 조절해야 하는가?',
      a2: '초기 레이아웃 생성 단계에서는 Max Effort를 적용해 구조적 자가 수정을 거치게 하고, 이후 색상이나 텍스트 변경은 Default로 신속히 마무리합니다.',
      checklist: [
        '오픈코드(OpenCode) 플랫폼 접속 및 Space Bunny 모델 무료 선택',
        '만들고자 하는 서비스의 레퍼런스 이미지 2장 캡처 및 준비',
        '마스터 프롬프트를 복사하여 에포트 Max 설정으로 1차 조판 실행',
        '390px 모바일 화면 깨짐 여부 확인 후 즉시 GitHub Pages 또는 Vercel 배포'
      ]
    }
  },
  {
    id: 'book_seedance_official',
    youtubeId: 'ERQArI7K-Jw',
    sourceRef: 'https://www.youtube.com/watch?v=ERQArI7K-Jw',
    title: '무료 무제한 AI 영상 생성기 완전 정복 | Seedance 2.5',
    subtitle: 'Text and Image To Video 무료 무제한 롱폼 AI 비디오 생성기 실전 제작 가이드',
    author: 'Ai Lockup 강의 원작 · 코다리 총괄부장 집필',
    badge: '🎬 무료 무제한 AI 영상',
    theme: 'amber',
    createdAt: '2026.09.30',
    coverImage: 'https://i.ytimg.com/vi/ERQArI7K-Jw/hqdefault.jpg',
    summaryBullets: [
      '유료 구독료 걱정 없이 무료로 텍스트와 이미지로부터 고화질 영상을 무제한 추출하는 차세대 툴.',
      '일관된 캐릭터 얼굴과 화풍을 고정하는 앵커링(Anchoring) 기법으로 숏폼/롱폼 스토리라인 완성.',
      '카메라 앵글, 조명, 모션 디스크립터를 결합한 5대 마스터 프롬프트 공식 제공.'
    ],
    audience: '비싼 유료 비디오 툴 대신 무료로 유튜브 숏폼, 릴스, 광고 영상을 대량 양산하려는 크리에이터',
    insight: '💡 핵심 인사이트: 툴의 스펙보다 중요한 것은 일관된 캐릭터 앵커링과 씬 바이 씬(Scene-by-Scene) 콘티 설계입니다.',
    chapter1: {
      title: '제 1 장: Seedance 2.5의 원리와 무료 무제한 파이프라인',
      body: 'AI 영상 생성의 최대 장벽은 비싼 크레딧 비용과 3~5초 단위의 짧은 클립 제한이었습니다. Seedance 2.5는 클라우드 분산 렌더링을 바탕으로 텍스트 및 이미지 기반의 긴 호흡 영상을 무료로 생성할 수 있는 획기적인 파이프라인을 제시합니다. 피사체의 물리학적 움직임과 카메라 워크를 정밀하게 제어할 수 있어 상용 수준의 영상미를 자랑합니다.',
      stepCards: [
        { step: '01', title: 'Image to Video 우선 원칙', desc: '텍스트만으로 생성하기보다 미드저니/스테이블디퓨전 고화질 원본을 앵커로 넣을 때 일관성이 200% 증가합니다.' },
        { step: '02', title: '카메라 모션 디스크립터', desc: 'Slow pan right, Zoom in, Low angle tracking 등 전문 영화적 카메라 지시어를 프롬프트에 명시합니다.' },
        { step: '03', title: '무제한 렌더 큐 가동', desc: '크레딧 차감 스트레스 없이 여러 시드의 영상을 병렬로 뽑아 베스트 컷을 선별합니다.' }
      ],
      calloutDark: '⚡ 실전 주의점: 움직임(Motion) 강도를 너무 높이면 피사체의 형태가 일그러질 수 있으므로 Motion Scale은 4~6 범위를 유지하십시오.'
    },
    chapter2: {
      title: '제 2 장: 주요 AI 영상 생성기 4사 실전 스펙 비교',
      lead: '비용, 화질, 생성 길이 관점에서 주요 영상 모델들의 객관적 비교 매트릭스입니다.',
      tableRows: [
        { item: 'Seedance 2.5 (본 강의)', prob: '100% 무료 / 무제한', effect: '캐릭터 앵커링 및 장편 씬 조립에 최적화' },
        { item: 'Runway Gen-3 Alpha', prob: '초당 $0.05 (유료)', effect: '극사실주의 인물 묘사 및 초고화질 광고 영상' },
        { item: 'Luma Dream Machine', prob: '월 30회 무료 후 유료', effect: '급격한 카메라 줌 및 다이나믹 액션 씬' },
        { item: 'Kling AI (쾌수)', prob: '일일 무료 크레딧 제공', effect: '인간의 물리적 동작 및 의상 디테일 유지 우수' }
      ],
      insightNote: '가성비와 양산이 최우선인 1인 비즈니스에서는 Seedance를 주력으로 삼고 특수 컷만 유료 툴을 쓰는 하이브리드 전략이 정답입니다.'
    },
    chapter3: {
      title: '제 3 장: 60초 숏폼 영화 실전 씬 콘티 & 마스터 프롬프트',
      lead: '실제 유튜브 숏폼으로 즉각 수익화 가능한 4단계 씬 콘티 설계 공식입니다.',
      steps: [
        { phase: 'Scene 1: 오프닝 훅 (0~5초)', desc: '충격적인 비주얼과 드론 하이앵글 줌인으로 시청자 이탈을 즉각 방지합니다.' },
        { phase: 'Scene 2: 갈등 & 문제 제시 (6~25초)', desc: '주인공 캐릭터의 클로즈업 및 감정선 변화를 슬로우 모션으로 연출합니다.' },
        { phase: 'Scene 3: 해결 & 클라이맥스 (26~50초)', desc: '조명이 화려하게 바뀌는 시네마틱 무빙과 빠른 컷 전환으로 몰입감을 유지합니다.' },
        { phase: 'Scene 4: 아웃트로 & 콜투액션 (51~60초)', desc: '구독 및 링크 유입을 유도하는 브랜드 로고 애니메이션으로 마무리합니다.' }
      ],
      promptTemplate: `Cinematic movie scene, ultra realistic 8k resolution, shot on 35mm lens.
Subject: [Character anchor reference], confident expression, futuristic cyberpunk city background.
Lighting: Moody neon lighting with rim light on shoulders.
Camera: Slow push-in tracking shot, smooth cinematic motion, photorealistic, 24fps.`
    },
    chapter4: {
      title: '제 4 장: 복습 퀴즈 & 30분 숏폼 양산 체크리스트',
      q1: 'Q1. 캐릭터 얼굴이 매 컷마다 바뀌는 환각을 방지하는 가장 확실한 해결책은?',
      a1: '동일한 캐릭터 원본 이미지를 Image-to-Video의 고정 베이스로 입력하고, 프롬프트 첫머리에 앵커링 키워드를 동일하게 고정하는 것입니다.',
      q2: 'Q2. 생성된 AI 영상 클립의 완성도를 상용 수준으로 끌어올리는 후반 작업은?',
      a2: 'CapCut 등 컷 편집기에서 1.1배속 미세 가속, AI 보이스 나레이션 합성, 그리고 딥 베이스 배경음악을 믹싱하는 것입니다.',
      checklist: [
        '주인공 캐릭터 1인의 정면/측면 고화질 앵커 이미지 2장 준비',
        '4단계 씬 콘티에 따라 마스터 프롬프트 4개 작성',
        'Seedance 2.5에서 각 씬별 3개 시드 일괄 생성 후 최적 컷 선정',
        'CapCut에서 자동 자막 및 BGM 믹싱 후 유튜브 쇼츠 업로드'
      ]
    }
  },
  {
    id: 'book_hermes_official',
    youtubeId: '4NCXTWBxcN0',
    sourceRef: 'https://www.youtube.com/watch?v=4NCXTWBxcN0&t=172s',
    title: '나만의 AI 팀 만들기: 설치부터 회의·업무 실행까지 | Hermes × DeskRPG',
    subtitle: 'Hermes 에이전트 4인과 3D 가상 오피스로 1인 기업 AX 자동화 파이프라인 완성',
    author: '단테랩스 (@dante-labs) 원작 · 코다리 총괄부장 집필',
    badge: '🤖 차세대 AI 오피스',
    theme: 'emerald',
    createdAt: '2026.09.30',
    coverImage: 'https://i.ytimg.com/vi/4NCXTWBxcN0/hqdefault.jpg',
    summaryBullets: [
      '단순한 1:1 대화 챗봇을 넘어 기획, 개발, 디자인, 마케팅 전문 AI 에이전트 4인을 팀으로 구축.',
      'DeskRPG 3D 가상 오피스 공간에 AI 팀원을 배치하고 실시간 화상 회의 및 칸반 태스크 자율 수행.',
      '대표는 큰 그림의 목표(Goal)만 던지고, 세부 실행과 결과물 취합은 AI 팀이 알아서 끝내는 시스템.'
    ],
    audience: '직원을 고용하기 부담스러운 1인 창업가, 혼자서 풀스택 사업을 전개하고 싶은 테크 솔로프러너',
    insight: '💡 핵심 인사이트: 이제 1인 기업의 생산성은 몇 개의 툴을 아느냐가 아니라, 몇 명의 AI 에이전트 팀원을 지휘하느냐에 달려 있습니다.',
    chapter1: {
      title: '제 1 장: 1인 기업 AX의 종착역 — AI 팀원 오케스트레이션',
      body: '지금까지의 AI 활용이 인간이 챗GPT 창을 열고 질문을 던지는 수동적인 방식이었다면, Hermes 에이전트는 독립된 페르소나와 직무 롤을 부여받아 자율적으로 상호 소통하는 오케스트레이션 단계로 진화했습니다. 대표가 목표를 지정하면 기획 에이전트가 요구사항을 쪼개고, 개발 에이전트가 코드를 짜며, 검수 에이전트가 결함을 바로잡습니다.',
      stepCards: [
        { step: '01', title: '직무별 페르소나 주입', desc: 'PM, 엔지니어, 카피라이터, QA 등 명확한 전문 영역과 권한 범위를 설정합니다.' },
        { step: '02', title: '공유 메모리(Shared Memory)', desc: '에이전트들이 회의에서 도출한 결정사항을 단일 컨텍스트 저장소에 실시간 동기화합니다.' },
        { step: '03', title: '도구 실행(Tool Calling)', desc: '단순 텍스트 생성을 넘어 터미널 명령, 파일 저장, 웹 검색을 자율적으로 수행합니다.' }
      ],
      calloutDark: '⚡ 실전 주의점: 에이전트 간 무한 대화 루프를 방지하기 위해 각 태스크마다 "완료 판정 기준(Definition of Done)"을 명확히 주입해야 합니다.'
    },
    chapter2: {
      title: '제 2 장: Hermes AI 팀원 4인 직무 편성 매트릭스',
      lead: '1인 기업 가상 오피스에 상주하는 핵심 AI 팀원들의 역할 및 산출물 분장표입니다.',
      tableRows: [
        { item: '기획 총괄 (Product Manager)', prob: '시장 분석 & 요구 명세서', effect: '유저 스토리 작성, 기능 우선순위 매트릭스 도출' },
        { item: '테크 리드 (Fullstack Dev)', prob: '아키텍처 설계 & 코드 작성', effect: '단일 컴포넌트 빌드, API 연동, 버그 픽스' },
        { item: '콘텐츠 마케터 (Copywriter)', prob: '숏폼 대본 & 상세페이지', effect: '타겟 후킹 문구, 이메일 시퀀스, SNS 홍보 카피' },
        { item: '감리 검수관 (QA & Auditor)', prob: '모바일 390px & 보안 검수', effect: '사용자 관점 결함 포착, 인쇄/PDF 규격 적합성 확인' }
      ],
      insightNote: '대표님은 각 에이전트의 산출물을 최종 승인하는 결재자 역할에 집중하시면 됩니다.'
    },
    chapter3: {
      title: '제 3 장: DeskRPG 3D 가상 오피스 연동 및 실무 실행법',
      lead: '웹 브라우저에서 3D 픽셀 오피스를 띄우고 에이전트들을 소환하여 일시키는 실전 절차입니다.',
      steps: [
        { phase: '1단계: 오피스 레이아웃 배정', desc: 'DeskRPG 회의실, 개발룸, 라운지에 각 에이전트 아바타를 배치합니다.' },
        { phase: '2단계: 아침 스탠드업 미팅 소집', desc: '금일 우선순위 태스크 3가지를 공지하고 에이전트별 담당 업무를 할당합니다.' },
        { phase: '3단계: 칸반 보드 실시간 모니터링', desc: 'To-Do에서 Doing을 거쳐 Done으로 태스크가 자율 이동하는 과정을 감독합니다.' }
      ],
      promptTemplate: `[시스템 지침: Hermes 에이전트 협업 회의 프로토콜]
당신은 본 프로젝트의 수석 PM입니다.
대표님의 목표: "3일 안에 1인 여행로그 SaaS 프로토타입 릴리즈"
1. 개발팀원과 마케팅팀원에게 각각 오늘 끝내야 할 실행 단위 태스크 2개씩 지정하십시오.
2. 각 태스크의 완료 조건(DoD)과 390px 모바일 검수 기준을 명시하십시오.
3. 최종 결과를 취합하여 대표님께 1페이지 결재 보고서 형태로 상신하십시오.`
    },
    chapter4: {
      title: '제 4 장: 복습 퀴즈 & AI 팀 빌딩 실천 워크북',
      q1: 'Q1. 1인 창업자가 AI 팀을 꾸릴 때 가장 먼저 확보해야 할 에이전트는?',
      a1: '아이디어를 실행 가능한 세부 태스크로 쪼개주는 기획 총괄(PM) 에이전트입니다. 기획이 정밀해야 개발과 마케팅 에이전트가 헛돌지 않습니다.',
      q2: 'Q2. AI 에이전트 협업에서 인간 대표가 가져야 할 가장 중요한 태도는?',
      a2: '모든 줄글을 직접 쓰려 하지 않고, 명확한 제약 조건과 판단 기준만 제시한 뒤 결과물을 검수·승인하는 디렉터 관점을 유지하는 것입니다.',
      checklist: [
        'Hermes 로컬 에이전트 런타임 환경 구성 확인',
        '나의 사업에 가장 급한 2대 직무(기획 + 개발) 에이전트 프롬프트 세팅',
        'DeskRPG 가상 오피스 화면에서 첫 1회 합동 회의 시뮬레이션 가동',
        '산출물을 검수하고 최종 배포 버튼을 눌러 첫 사이클 완주'
      ]
    }
  },
  {
    id: 'book_jev_rag_official',
    youtubeId: 'jev_rag_master',
    sourceRef: '공부방 정규 마스터 특강 (정원석 강의 원작)',
    title: 'RAG, Uncensor, 그리고 JEV 강화학습',
    subtitle: '거대언어모델(LLM)과 강화학습(RL)으로 구축하는 1인 기업 자비스 에이전트',
    author: '정원석 강의 원작 · 코다리 총괄부장 집필',
    badge: '🧠 2년 뒤 코어 플랫폼',
    theme: 'obsidian',
    createdAt: '2026.09.30',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    summaryBullets: [
      '40여 년간 도서관에 잠들어 있던 신경망 이론들이 GPU와 거대 데이터로 깨어난 AI 혁명의 역사적 본질 규명.',
      '프롬프트 엔지니어링의 컨텍스트 한계와 RAG(검색 증강 생성)의 만 페이지 문서 비용 폭발 문제 정밀 해부.',
      '규제와 검열을 걷어낸 로컬 언센서 모델과 강화학습(RL) 의사결정 엔진 JEV가 결합된 자율 에이전트의 완성.'
    ],
    audience: '빅테크 API 종속에서 벗어나 내 컴퓨터 안에서 독립적으로 작동하는 진정한 개인 비서를 만들려는 대표님',
    insight: '💡 핵심 인사이트: 챗봇은 말을 잘하는 기술이지만, 자율 에이전트는 올바른 행동을 선택(Action Selection)하는 강화학습의 영역입니다.',
    chapter1: {
      title: '제 1 장: 단순 함수 f(x)에서 거대 두뇌(LLM)로의 진화',
      body: '인공지능의 출발점은 거창한 철학이 아닌 입력값 x를 결과값 y로 변환하는 가장 단순한 수학적 함수였습니다. 타이타닉 생존자 예측과 아파트 가격 추정에서 시작된 오차 최소화(Loss Minimization) 기법은, 인류의 방대한 텍스트 데이터를 만나 다음 토큰을 확률적으로 예측하는 초인적인 거대언어모델로 거듭났습니다. 하지만 모델은 여전히 "대표님 개인의 특수한 맥락"을 알지 못한다는 태생적 한계를 안고 있습니다.',
      stepCards: [
        { step: '01', title: '신경망과 가중치(Weights)', desc: '인간의 신경세포를 모방한 수십억 개의 연결 파라미터가 데이터의 패턴을 자율적으로 학습합니다.' },
        { step: '02', title: '프롬프트의 명암', desc: '입구에서 쪽지를 건네듯 내 정보를 쥐어주는 방식은 컨텍스트 윈도우의 제약과 비용 문제를 유발합니다.' },
        { step: '03', title: 'RAG의 딜레마', desc: '외부 문서를 검색하여 주입하는 RAG는 방대한 도서관 데이터 앞에서 검색 실패와 지연 시간을 겪습니다.' }
      ],
      calloutDark: '⚡ 실전 주의점: 단순 RAG만으로는 복잡한 비즈니스 결정을 내릴 수 없으며, 반드시 의사결정 정책(Policy) 모델이 결합되어야 합니다.'
    },
    chapter2: {
      title: '제 2 장: 클라우드 검열(Censor)의 족쇄와 로컬 언센서의 필요성',
      lead: '빅테크 클라우드 LLM의 과도한 거절과 로컬 독립 모델의 비교 매트릭스입니다.',
      tableRows: [
        { item: '클라우드 상용 LLM', prob: '과도한 검열 & 거절 빈번', effect: '민감한 비즈니스 기획이나 과감한 마케팅 문구 작성 거부' },
        { item: '로컬 언센서(Uncensored)', prob: '100% 프라이버시 & 무검열', effect: '내 컴퓨터 GPU에서 데이터 유출 없이 모든 날것의 아이디어 실행' },
        { item: 'JEV 독립 판정 엔진', prob: '0.08초 초고속 확률 추론', effect: '방대한 줄글 대신 상태(State)와 행동(Action) 가치만 정밀 판정' },
        { item: '결합 시너지', prob: '비용 81% 절감 / 오판 방지', effect: '외부 인터넷이 끊겨도 작동하는 1인 기업 영구 자산 자비스 구축' }
      ],
      insightNote: '나만의 독보적인 벡터 거리를 확보하려면 남들이 쓰는 검열된 API 챗봇을 벗어나 로컬 자율 두뇌를 가져야 합니다.'
    },
    chapter3: {
      title: '제 3 장: JEV 강화학습 기반 자율 판단 파이프라인',
      lead: '상태 관찰에서 행동 선택까지 이어지는 3단계 강화학습 파이프라인입니다.',
      steps: [
        { phase: '1단계: 상태(State) 관측', desc: '대표님의 현재 지시, 작업 폴더의 파일 상태, 이전 대화 맥락을 특징 벡터로 인코딩합니다.' },
        { phase: '2단계: Q-가치(Q-Value) 평가', desc: '가능한 여러 행동(코드 수정, 문서 작성, 추가 질문) 중 기대 보상이 가장 높은 최적 행동을 선별합니다.' },
        { phase: '3단계: 정책(Policy) 실행 & 피드백', desc: '선택된 행동을 즉시 실행하고 대표님의 승인/수정 피드백을 받아 신경망 가중치를 업데이트합니다.' }
      ],
      promptTemplate: `[JEV 코어 정책 파이프라인]
목표: 대표님의 1인 기업 스케일업 가설 검증 지원
1. 사소한 권한 요청은 자체 판단으로 즉시 실행하고 진행 상황만 투명하게 보고할 것.
2. 거대 경쟁사의 레드오션에서 멀리 떨어진 뾰족한 니치(Niche) 벡터 거리를 유지할 것.
3. 기획 단계에서 멈추지 않고 오늘 밤 실제 동작하는 산출물을 End-to-End로 릴리즈할 것.`
    },
    chapter4: {
      title: '제 4 장: 복습 퀴즈 & 자비스 구축 체크리스트',
      q1: 'Q1. 일반 챗봇과 강화학습(RL) 기반 JEV 에이전트의 결정적 차이는?',
      a1: '챗봇은 질문에 대해 그럴듯한 텍스트를 출력하는 데 그치지만, JEV 에이전트는 목표 달성을 위한 최적의 행동(Action)을 직접 실행하고 결과를 책임집니다.',
      q2: 'Q2. 1인 기업이 로컬 AI 인프라를 갖춰야 하는 비즈니스적 이유는?',
      a2: '빅테크 기업의 가격 인상, API 차단, 데이터 검열에 휘둘리지 않고 나만의 핵심 지식 자산을 온전히 영구 소유할 수 있기 때문입니다.',
      checklist: [
        '내 PC 로컬 GPU 사양 및 Ollama 런타임 호환성 점검',
        '나의 전문 분야 노하우를 담은 1인 지식 데이터베이스 구축',
        'JEV 독립 의사결정 규칙과 피드백 보상 함수 정의',
        '오늘 배운 이론을 바탕으로 자율 에이전트 첫 루프 시험 가동'
      ]
    }
  }
];

const STORAGE_KEY_LIBRARY = 'kodari_ebook_library_v3';

function getStoredLibrary() {
  if (typeof window === 'undefined') return MASTER_BOOKS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LIBRARY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(MASTER_BOOKS));
      return MASTER_BOOKS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : MASTER_BOOKS;
  } catch (e) {
    return MASTER_BOOKS;
  }
}

// ============================================================================
// 3. 지능형 전자책 생성기 (유튜브 / 자유 주제 / 마크다운 3대 엔진)
// ============================================================================

// 3-1. 유튜브 영상 ➔ 전자책
export function buildIntelligentEbookFromYoutube(url, meta, extraNotes, theme = 'tech') {
  const ytId = extractYoutubeId(url);
  const cleanTitle = (meta.title || `유튜브 강의 (${ytId || '영상'})`).replace(/[\r\n]+/g, ' ').trim();
  const author = meta.author || 'YouTube 크리에이터';
  const thumb = meta.thumbnailUrl || (ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80');

  const isAi = /ai|gpt|claude|gemini|llm|인공지능|모델|챗봇|프롬프트|에이전트/i.test(cleanTitle + ' ' + (extraNotes || ''));
  const isDev = /code|개발|코딩|파이썬|python|react|웹|프로그래밍|자바스크립트/i.test(cleanTitle + ' ' + (extraNotes || ''));
  const isBiz = /돈|수익|부업|사업|마케팅|유튜브|매출|1인|창업|비즈니스/i.test(cleanTitle + ' ' + (extraNotes || ''));

  let categoryBadge = '📚 유튜브 실전 강의록';
  if (isAi) categoryBadge = '🤖 생성 AI & 자동화 강의';
  else if (isDev) categoryBadge = '💻 풀스택 개발 & 코딩 실무';
  else if (isBiz) categoryBadge = '📈 1인 비즈니스 & 수익화';

  const noteSnippet = extraNotes && extraNotes.trim() ? `\n\n[추가 메모 반영]: ${extraNotes.trim()}` : '';

  return {
    id: `book_yt_${ytId || Date.now()}`,
    youtubeId: ytId,
    sourceRef: url,
    theme: theme,
    title: cleanTitle,
    subtitle: `${author}의 강의 내용을 1개념 1페이지 핵심 원리와 실전 워크북으로 완벽 정리한 전자책`,
    author: `${author} 원작 · 코다리 총괄부장 집필`,
    badge: categoryBadge,
    createdAt: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }),
    coverImage: thumb,
    summaryBullets: [
      `[핵심 요약 1] ${cleanTitle}에서 전달하는 가장 중요한 1대 인사이트와 기술적 배경을 명쾌하게 정리했습니다.`,
      `[핵심 요약 2] 기존 방식 대비 무엇이 달라졌으며, 실무에서 마주치는 병목을 어떻게 획기적으로 해결하는지 분석했습니다.`,
      `[핵심 요약 3] 단순 시청에 머물지 않고, 오늘 당장 내 비즈니스와 공부에 투입할 수 있는 스텝별 실행 로드맵을 수립했습니다.`
    ],
    audience: `${cleanTitle}의 핵심 원리를 단시간에 완벽히 습득하고 실무에 즉시 적용하고자 하는 학습자 및 1인 기업가`,
    insight: `💡 핵심 인사이트: 지식을 머리로만 아는 것은 가치가 없습니다. 오늘 배운 1대 원리를 가장 작은 단위의 프로토타입으로 즉각 전환하십시오.`,
    chapter1: {
      title: `제 1 장: ${cleanTitle.slice(0, 26)}... 핵심 개념 원리`,
      body: `본 강의의 핵심은 복잡하고 장황한 이론을 걷어내고, 실제 현장에서 즉각적인 성과를 만들어내는 "실전 작동 메커니즘"에 집중하는 것입니다. 과거의 전통적인 방식이 많은 시간과 비용을 요구했다면, 이 영상에서 제시하는 접근법은 불필요한 시행착오를 원천 차단하고 가장 효율적인 최단 경로를 열어줍니다.${noteSnippet}`,
      stepCards: [
        { step: '01', title: '핵심 문제의식 포착', desc: '기존 방식이 가지고 있던 치명적인 비효율과 비용 낭비 요인을 정밀하게 진단합니다.' },
        { step: '02', title: '차별화된 해결 원리', desc: '강의에서 제시된 핵심 도구와 프레임워크를 바탕으로 문제 해결의 새로운 접근법을 적용합니다.' },
        { step: '03', title: '즉각적인 가치 창출', desc: '완성된 결과물을 실제 환경에 배포하여 고객 피드백이나 생산성 향상을 실현합니다.' }
      ],
      calloutDark: '⚡ 실전 주의점: 툴이나 기술의 사소한 옵션에 매몰되지 마시고, 전체 파이프라인이 매끄럽게 연결되는지에 집중하십시오.'
    },
    chapter2: {
      title: `제 2 장: 구조 분석 및 기존 방식 대비 정밀 비교 매트릭스`,
      lead: '전통적인 수작업 및 기존 접근법 대비 본 강의에서 제시된 방식의 객관적 효용 분석입니다.',
      tableRows: [
        { item: '1. 핵심 작업 소요 시간', prob: '70~90% 단축', effect: '반복 작업을 자동화 및 템플릿화하여 생산성 극대화' },
        { item: '2. 투입 비용 및 리소스', prob: '비용 최소화', effect: '외주 의존도를 없애고 1인 자체 실행 파이프라인 확보' },
        { item: '3. 산출물 완성도 & 안정성', prob: '고품질 유지', effect: '검증된 프로세스를 통해 초보자도 전문가 수준의 결과물 도출' },
        { item: '4. 시장 적용 및 확장성', prob: '즉각 배포 가능', effect: '오늘 밤이라도 시장에 내놓고 고객 반응을 검증하는 실행력 확보' }
      ],
      insightNote: '가장 효과가 높은 핵심 20%의 실행에 집중할 때 80%의 폭발적인 결과가 산출됩니다.'
    },
    chapter3: {
      title: `제 3 장: 1인 실전 적용 가이드 & 스텝별 실행 로드맵`,
      lead: '오늘 당장 내 업무와 학습에 이 내용을 접목하는 3단계 실천 로드맵입니다.',
      steps: [
        { phase: '1단계: 환경 세팅 & 재료 준비', desc: '필요한 도구 계정 생성 및 레퍼런스 자료, 기본 템플릿을 한곳에 정돈합니다.' },
        { phase: '2단계: 핵심 결과물 원샷 제작', desc: '강의에서 배운 핵심 팁과 단축 공식을 적용하여 첫 번째 완성본을 신속히 빌드합니다.' },
        { phase: '3단계: 검수 및 실전 배포', desc: '모바일 390px 화면 및 세부 디테일을 점검하고 실제 사용자 또는 내 채널에 공개합니다.' }
      ],
      promptTemplate: `[실전 적용 마스터 가이드]
주제: ${cleanTitle}
목표: 24시간 내 실행 가능한 최소 단위 프로토타입 완성
1. 준비물: 유튜브 강의 핵심 메모 및 실전 템플릿
2. 핵심 규칙: 완벽함보다 신속한 릴리즈를 우선할 것
3. 결과물 검수: 대표님 승인 기준 및 모바일 환경 최적화 완료`
    },
    chapter4: {
      title: `제 4 장: 핵심 복습 퀴즈 & 실천 액션 체크리스트`,
      q1: `Q1. [${cleanTitle.slice(0, 24)}...] 강의에서 얻을 수 있는 가장 중요한 1대 교훈은?`,
      a1: '기술이나 트렌드가 아무리 빠르게 변해도, 핵심 가치는 이를 활용하여 고객과 나 자신에게 실제 작동하는 가치를 가장 빠르게 전달하는 실행력에 있습니다.',
      q2: 'Q2. 이 내용을 나의 1인 비즈니스 또는 일상에 당장 적용한다면?',
      a2: '단순 요약 읽기에 머물지 않고, 오늘 당장 실천할 수 있는 1가지 구체적 과제를 정해 1시간 집중 스프린트로 완성합니다.',
      checklist: [
        '강의 원본 영상 북마크 및 핵심 타임코드 기록',
        '나만의 프로젝트 폴더 생성 및 첫 번째 실행 파일 셋업',
        '전자책 본문의 3단계 실천 가이드에 따라 최소 단위 결과물 제작',
        '완성된 전자책 PDF를 다운로드하여 나만의 지식 아카이브에 영구 보관'
      ]
    }
  };
}

// 3-2. 자유 주제 / 1초 기획 ➔ 전자책
export function buildIntelligentEbookFromTopic(topic, subtitle, author, audience, theme = 'tech') {
  const cleanTitle = (topic || '1인 비즈니스 핵심 실전 가이드').trim();
  const sub = subtitle && subtitle.trim() ? subtitle.trim() : `${cleanTitle}의 핵심 이론부터 실전 배포까지 5페이지로 완전 정복`;
  const writer = author && author.trim() ? author.trim() : '대표님 기획 · 코다리 총괄부장 집필';
  const targetAud = audience && audience.trim() ? audience.trim() : `${cleanTitle} 분야를 가장 빠르게 습득하여 내 비즈니스에 접목하고 싶은 1인 창업가 및 실행가`;

  // 언스플래시 큐레이션 이미지 매칭
  let coverImg = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80';
  if (/돈|수익|매출|부업|창업|비즈니스/i.test(cleanTitle)) {
    coverImg = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80';
  } else if (/ai|모델|에이전트|llm|인공지능|로봇/i.test(cleanTitle)) {
    coverImg = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
  } else if (/코드|코딩|개발|웹|프로그래밍|react|python/i.test(cleanTitle)) {
    coverImg = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80';
  }

  return {
    id: `book_topic_${Date.now()}`,
    youtubeId: null,
    sourceRef: '대표님 오리지널 기획 도서',
    theme: theme,
    title: cleanTitle,
    subtitle: sub,
    author: writer,
    badge: '💡 1인 기업 오리지널 기획서',
    createdAt: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }),
    coverImage: coverImg,
    summaryBullets: [
      `[핵심 명제] "${cleanTitle}"의 본질은 복잡한 이론 공부가 아닌, 실제로 작동하는 최소 단위의 파이프라인 구축에 있습니다.`,
      `[차별점] 거대 기업의 방식을 흉내 내지 않고, 1인 기업가가 가장 적은 리소스로 바늘구멍 같은 니치를 장악하는 전략을 제시합니다.`,
      `[결과물] 오늘 밤 당장 한 사이클을 완주하여 현금 흐름과 고객 반응을 확인할 수 있는 액션 플랜을 도출합니다.`
    ],
    audience: targetAud,
    insight: `💡 핵심 인사이트: 시장은 당신의 준비 기간에 관심이 없습니다. 가장 불완전해 보이는 첫 버전이라도 오늘 밤 세상에 내놓아야 비로소 게임이 시작됩니다.`,
    chapter1: {
      title: `제 1 장: ${cleanTitle.slice(0, 26)}... 문제 정의와 핵심 원리`,
      body: `모든 혁신적인 비즈니스는 "기존 방식의 극심한 고통과 비효율"을 날카롭게 포착하는 것에서 출발합니다. ${cleanTitle}을 실행함에 있어 가장 큰 실패 요인은 너무 많은 준비와 거대한 스케일을 욕심내는 것입니다. 핵심 원리는 1개의 핵심 가치에 집중하고, 그 외의 모든 것은 AI와 자동화 도구에 위임하는 극강의 간소화에 있습니다.`,
      stepCards: [
        { step: '01', title: '바늘구멍 니치 포착', desc: '대중을 만족시키려 하지 말고, 단 100명의 열광적인 타깃이 겪는 뾰족한 결핍을 정의합니다.' },
        { step: '02', title: '초고속 프로토타이핑', desc: '코딩이나 제작에 수 주를 쓰지 않고, 24시간 안에 동작하는 최소 기능 제품(MVP)을 빌드합니다.' },
        { step: '03', title: '피드백 루프 안착', desc: '실제 유저의 클릭과 결제 반응을 데이터로 측정하여 가설의 생존 여부를 신속히 판정합니다.' }
      ],
      calloutDark: '⚡ 코다리 부장의 조언: 완벽주의는 1인 기업의 가장 큰 독약입니다. 80점짜리 결과물을 빠르게 릴리즈하고 시장 피드백으로 채워가십시오.'
    },
    chapter2: {
      title: `제 2 장: 기존 수작업 방식 vs 1인 AI 시스템 비교 매트릭스`,
      lead: `${cleanTitle}을 수작업으로 진행했을 때와 AI 자동화 시스템으로 전개했을 때의 정밀 비교 분석입니다.`,
      tableRows: [
        { item: '1. 파이프라인 빌드 속도', prob: '전통 방식: 3~6개월', effect: 'AI 레버리지: 1~3일 내 릴리즈 완료' },
        { item: '2. 초기 투입 자본금', prob: '외주비 수천만 원', effect: '월 5~10만 원대 SaaS 툴 구독으로 자급자족' },
        { item: '3. 가설 검증 실패 비용', prob: '치명적 사업 타격', effect: '오늘 접고 내일 새 아이디어로 즉시 피벗 가능' },
        { item: '4. 니치 벡터 거리 확보', prob: '대기업과 정면충돌', effect: '초격차 니치 영역에서 독점적 지위 점유' }
      ],
      insightNote: '경쟁이 치열한 레드오션에서 벗어나 나만의 독보적인 벡터 거리를 유지할 때 생존율이 10배 올라갑니다.'
    },
    chapter3: {
      title: `제 3 장: 오늘 밤 실행하는 3단계 실천 로드맵`,
      lead: '생각을 멈추고 손을 움직이게 만드는 3단계 초단기 스프린트 로드맵입니다.',
      steps: [
        { phase: '1단계: 랜딩페이지 및 오퍼 설계 (2시간)', desc: '고객의 시선을 3초 만에 사로잡는 후킹 헤드라인과 단일 혜택 오퍼를 조판합니다.' },
        { phase: '2단계: 핵심 백엔드/프로토타입 연결 (3시간)', desc: 'AI API 또는 노코드 툴을 결합하여 실제로 결과물이 산출되는 엔진을 조립합니다.' },
        { phase: '3단계: 링크 공유 및 트래픽 유입 (1시간)', desc: '타깃 커뮤니티나 SNS에 링크를 배포하고 첫 번째 방문자의 행동을 기록합니다.' }
      ],
      promptTemplate: `[실행 마스터 가이드 프롬프트]
프로젝트: ${cleanTitle}
목표: 1인 기업 End-to-End 원 사이클 릴리즈
1. 타깃 고객: ${targetAud}
2. 핵심 규칙: 기획 20%, 제작 30%, 배포 및 홍보 50%의 리소스 분배 유지
3. 검수 기준: 모바일 390px 화면에서 막힘없는 유저 플로우 확인 완료`
    },
    chapter4: {
      title: `제 4 장: 핵심 복습 퀴즈 & 영구 실행 체크리스트`,
      q1: `Q1. [${cleanTitle.slice(0, 22)}...] 프로젝트에서 대표님이 지켜야 할 가장 중요한 철학은?`,
      a1: '한 사이클을 온전히 돌려보는 것입니다. 기획서 작성에 머무르지 않고 배포와 결제까지 연결해 시장의 반응을 확인해야만 진짜 자산이 됩니다.',
      q2: 'Q2. 첫 릴리즈 후 시장 반응이 미적지근하다면 어떻게 대응해야 하는가?',
      a2: '미련 없이 접고 다음 가설로 피벗(Pivot)합니다. 실패는 실패가 아니라 데이터 수집이며, 빠른 방향 전환이 1인 기업의 최대 무기입니다.',
      checklist: [
        '프로젝트 핵심 가치 1문장 정의 완료',
        '필요한 AI 도구 및 환경 구성 셋업',
        '모바일 390px 최적화 검수 완료',
        '오늘 중 첫 릴리즈 링크 공개 및 피드백 수집 개시'
      ]
    }
  };
}

// 3-3. 마크다운 / 메모 원고 ➔ 전자책
export function buildIntelligentEbookFromMarkdown(title, author, markdownText, theme = 'tech') {
  const cleanTitle = (title || '마크다운 원고 정밀 조판 전자책').trim();
  const writer = author && author.trim() ? author.trim() : '대표님 원고 · 코다리 총괄부장 집필';
  const rawText = markdownText ? markdownText.trim() : '';

  // 텍스트 라인 파싱
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const snippet1 = lines.slice(0, 5).join(' ') || `${cleanTitle}의 핵심 내용과 전문 지식을 1개념 1페이지 출판 규격으로 완벽히 정돈했습니다.`;
  const snippet2 = lines.slice(5, 12).join(' ') || '본 원고는 실무에서 검증된 핵심 원리와 구체적 실행 지침을 집대성한 실전 가이드입니다.';

  return {
    id: `book_md_${Date.now()}`,
    youtubeId: null,
    sourceRef: '대표님 집필 마크다운 원고',
    theme: theme,
    title: cleanTitle,
    subtitle: `${writer}의 마크다운 원고를 출판용 5페이지 A4 도서 규격으로 정밀 조판한 전자책`,
    author: writer,
    badge: '📝 출판용 마크다운 조판',
    createdAt: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }),
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    summaryBullets: [
      `[원고 요약 1] 본 원고의 핵심 논점: ${lines[0] || cleanTitle}에 대한 명확한 문제의식과 해결책을 다룹니다.`,
      `[원고 요약 2] 현장 실무자가 즉시 적용할 수 있도록 핵심 개념과 비교 지표를 일목요연하게 표로 구조화했습니다.`,
      `[원고 요약 3] 이론에 그치지 않고 완벽한 복습과 실천을 위한 4대 액션 체크리스트를 수록했습니다.`
    ],
    audience: `${cleanTitle}의 핵심 지식을 체계적으로 학습하고 실무에 적용하고자 하는 독자`,
    insight: `💡 핵심 인사이트: 원고의 진정한 가치는 기록에 머무는 것이 아니라, 독자의 행동을 변화시키는 명확한 체크리스트에 있습니다.`,
    chapter1: {
      title: `제 1 장: ${cleanTitle.slice(0, 24)}... 핵심 원리 및 서론`,
      body: `${snippet1}\n\n${snippet2}`,
      stepCards: [
        { step: '01', title: '핵심 명제 수립', desc: lines[1] || '주제의 가장 본질적인 문제의식을 정의하고 출발점을 명확히 합니다.' },
        { step: '02', title: '원리 분석 및 구조화', desc: lines[2] || '복잡한 세부 내용들을 3개의 핵심 축으로 단순화하여 체계화합니다.' },
        { step: '03', title: '적용 및 실전 검증', desc: lines[3] || '이론을 실제 현장 데이터나 코드에 투입하여 실효성을 입증합니다.' }
      ],
      calloutDark: '⚡ 편집장 총평: 방대한 텍스트 중 가장 중요한 정수만을 압축하여 3대 실행 카드로 정돈했습니다.'
    },
    chapter2: {
      title: `제 2 장: 핵심 비교 분석 & 구조 매트릭스`,
      lead: '본 원고에서 다루는 주요 개념과 전통적 접근법의 객관적 비교표입니다.',
      tableRows: [
        { item: '1. 구조적 접근성', prob: '기존: 산발적 정보', effect: '개선: 1개념 1페이지 단권화' },
        { item: '2. 가독성 및 전달력', prob: '기존: 긴 줄글 나열', effect: '개선: 표, 콜아웃, 카드 시각화' },
        { item: '3. 실무 적용 소요 시간', prob: '수일간의 분석 필요', effect: '30분 만에 핵심 공식 적용 가능' },
        { item: '4. 최종 산출물 완성도', prob: '개인 메모 수준', effect: '배포 가능한 전문 도서 PDF 완성' }
      ],
      insightNote: '텍스트를 단순 나열하는 것보다 구조화된 표로 제시할 때 정보 전달력이 300% 증가합니다.'
    },
    chapter3: {
      title: `제 3 장: 단계별 실행 가이드 & 마스터 템플릿`,
      lead: '원고의 내용을 바탕으로 독자가 오늘 바로 실천할 수 있는 3단계 가이드입니다.',
      steps: [
        { phase: '1단계: 핵심 프레임워크 숙지', desc: lines[4] || '제 1 장의 원리를 나의 상황에 맞게 매핑하고 기본 템플릿을 준비합니다.' },
        { phase: '2단계: 최소 단위 실습', desc: lines[5] || '가장 단순한 예제부터 시작하여 손에 익히고 피드백을 기록합니다.' },
        { phase: '3단계: 체계적인 아카이빙', desc: lines[6] || '결과물을 PDF로 저장하여 나만의 지식 라이브러리에 영구 보관합니다.' }
      ],
      promptTemplate: `[원고 기반 실전 템플릿]
도서: ${cleanTitle}
작성자: ${writer}
원고 핵심 발췌:
${rawText.slice(0, 240)}...`
    },
    chapter4: {
      title: `제 4 장: 핵심 복습 퀴즈 & 실천 체크리스트`,
      q1: `Q1. [${cleanTitle.slice(0, 22)}...] 원고에서 가장 강조하는 핵심 메시지는?`,
      a1: '지식을 단순히 읽고 끝내는 것이 아니라, 내 일상과 비즈니스에 구체적인 체크리스트 형태로 녹여내어 실행하는 것입니다.',
      q2: 'Q2. 이 내용을 장기적인 나의 자산으로 남기려면 어떻게 해야 하는가?',
      a2: '정리된 전자책 PDF를 정기적으로 복습하고, 새로운 실전 경험이 쌓일 때마다 원고를 개정판으로 업데이트합니다.',
      checklist: [
        '원고 핵심 요약 3줄 완독 및 노트 기록',
        '원고에서 제시된 1단계 과제 1시간 내 완수',
        '주요 표 및 다이어그램 업무 참고자료로 스크랩',
        'A4 PDF 다운로드 후 오프라인/태블릿 보관'
      ]
    }
  };
}

// ============================================================================
// 4. 고화질 A4 PDF 다운로드 엔진 (html2canvas + jsPDF)
// ============================================================================
export async function downloadEbookAsPdf(book, onStatusUpdate) {
  if (!book) return;

  if (onStatusUpdate) onStatusUpdate('⏳ 고화질 A4 PDF 엔진 로딩 중...');

  try {
    if (!window.html2canvas) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }
    if (!window.jspdf) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }
  } catch (err) {
    console.warn('PDF 라이브러리 CDN 로드 실패, 전용 인쇄 창으로 전환:', err);
    printEbookCleanly(book, book.theme || 'tech');
    return;
  }

  const sheets = document.querySelectorAll('.sb-book-preview-container .sb-page-sheet');
  if (!sheets || sheets.length === 0) {
    printEbookCleanly(book, book.theme || 'tech');
    return;
  }

  try {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4'); // A4 (210 x 297 mm)

    for (let idx = 0; idx < sheets.length; idx++) {
      if (onStatusUpdate) onStatusUpdate(`📄 ${idx + 1} / ${sheets.length} 페이지 고화질 렌더링 중...`);

      const sheetEl = sheets[idx];
      const canvas = await window.html2canvas(sheetEl, {
        scale: 1.8,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 1000
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      if (idx > 0) {
        pdf.addPage('a4', 'p');
      }

      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
    }

    const safeTitle = (book.title || '강의이북').replace(/[\/\\:*?"<>|]/g, '_').slice(0, 30);
    pdf.save(`${safeTitle}_출판전자책.pdf`);
    if (onStatusUpdate) onStatusUpdate(`🎉 [${book.title.slice(0, 18)}...] 고화질 PDF 다운로드 완료!`);
  } catch (e) {
    console.error('PDF 다운로드 생성 실패:', e);
    if (onStatusUpdate) onStatusUpdate('⚠️ 이미지 보안 정책으로 인해 전용 인쇄 창으로 바로 전환합니다.');
    printEbookCleanly(book, book.theme || 'tech');
  }
}

// ============================================================================
// 5. 웹 찌꺼기 100% 제거! 순수 A4 전용 인쇄 함수 (테마 지원)
// ============================================================================
export function printEbookCleanly(book, theme = 'tech') {
  if (!book) return;
  const printWindow = window.open('', '_blank', 'width=950,height=1000');
  if (!printWindow) {
    alert('팝업 차단이 감지되었습니다. 팝업을 허용해 주십시오.');
    return;
  }

  // 테마별 색상 설정
  let primaryColor = '#0284c7';
  let badgeBg = '#0284c7';
  if (theme === 'amber') {
    primaryColor = '#d97706';
    badgeBg = '#d97706';
  } else if (theme === 'emerald') {
    primaryColor = '#059669';
    badgeBg = '#059669';
  } else if (theme === 'obsidian') {
    primaryColor = '#4f46e5';
    badgeBg = '#1e1b4b';
  }

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>${book.title} — 고화질 A4 전자책</title>
<style>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Pretendard', sans-serif; background: #fff; color: #0f172a; line-height: 1.6; }
.page { width: 210mm; min-height: 297mm; padding: 22mm 20mm; margin: 0 auto 15mm; background: #fff; page-break-after: always; position: relative; border-bottom: 1px dashed #cbd5e1; }
@media print {
  body { background: #fff; }
  .page { margin: 0; padding: 18mm 16mm; min-height: 297mm; border: none; page-break-after: always; break-after: page; }
  .no-print { display: none !important; }
}
.badge { display: inline-block; background: ${badgeBg}; color: #fff; padding: 5px 14px; border-radius: 6px; font-size: 12px; font-weight: 800; margin-bottom: 14px; }
h1 { font-size: 26px; font-weight: 900; line-height: 1.3; margin-bottom: 10px; color: #0f172a; }
h2 { font-size: 20px; font-weight: 800; margin-bottom: 14px; color: #0f172a; border-bottom: 2px solid ${primaryColor}; padding-bottom: 8px; }
.sub { color: #64748b; font-size: 14px; margin-bottom: 20px; }
.thumb { width: 100%; max-height: 260px; object-fit: cover; border-radius: 8px; margin: 16px 0; border: 1px solid #e2e8f0; }
.gold-box { background: #fef3c7; border-left: 4px solid #d97706; padding: 14px; border-radius: 0 6px 6px 0; margin: 16px 0; font-weight: bold; font-size: 14px; color: #78350f; }
.dark-box { background: #f1f5f9; border-left: 4px solid ${primaryColor}; padding: 14px; border-radius: 0 6px 6px 0; margin: 16px 0; font-size: 13.5px; color: #0f172a; }
.card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin-bottom: 10px; }
table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
th { background: #f1f5f9; font-weight: 800; }
pre { background: #0f172a; color: #38bdf8; padding: 14px; border-radius: 6px; font-family: monospace; font-size: 12px; white-space: pre-wrap; margin: 14px 0; }
.footer { position: absolute; bottom: 15mm; left: 20mm; right: 20mm; display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 8px; }
.print-bar { background: #0f172a; color: #fff; padding: 14px 20px; text-align: center; position: sticky; top: 0; z-index: 999; }
.print-btn { background: ${primaryColor}; color: #fff; border: none; padding: 8px 24px; border-radius: 6px; font-weight: 800; cursor: pointer; font-size: 15px; }
</style>
</head>
<body>
<div class="print-bar no-print">
  <span>💡 브라우저 인쇄 창이 열립니다. 대상에서 <strong>'PDF로 저장'</strong>을 선택하시면 초고화질 벡터 PDF로 다운로드됩니다.</span>
  <button class="print-btn" onclick="window.print()" style="margin-left: 16px;">🖨️ 인쇄 / PDF 저장 실행</button>
</div>

<!-- 1. 표지 -->
<div class="page" style="text-align: center; display: flex; flex-direction: column; justify-content: center;">
  <div>
    <span class="badge">${book.badge}</span>
    <h1>${book.title}</h1>
    <div class="sub">${book.subtitle}</div>
    <img src="${book.coverImage}" class="thumb" onerror="this.style.display='none'">
    <div style="font-weight: 800; margin-top: 16px; font-size: 15px;">${book.author}</div>
    <div style="font-size: 12px; color: #64748b; margin-top: 6px;">출처/레퍼런스: ${book.sourceRef}</div>
  </div>
  <div class="footer"><span>공부방 스튜디오 · 개인 학습책</span><span>1 / 5 페이지 (표지)</span></div>
</div>

<!-- 2. 개요 & 3줄 브리핑 -->
<div class="page">
  <span class="badge">개요 & 핵심 브리핑</span>
  <h2>이 책의 핵심 요약 & 시청 포인트</h2>
  <div class="gold-box">${book.insight}</div>
  <div style="margin: 20px 0;">
    <h3 style="font-size: 15px; margin-bottom: 10px; color: ${primaryColor};">⚡ 핵심 3줄 브리핑:</h3>
    ${book.summaryBullets.map(b => `<div class="card" style="font-size: 14px; font-weight: 600;">${b}</div>`).join('')}
  </div>
  <div class="dark-box">
    <strong>🎯 학습 대상 및 목표:</strong> ${book.audience}
  </div>
  <div class="footer"><span>공부방 스튜디오 · 핵심 브리핑</span><span>2 / 5 페이지</span></div>
</div>

<!-- 3. 제 1 장: 핵심 개념 -->
<div class="page">
  <span class="badge">제 1 장</span>
  <h2>${book.chapter1.title}</h2>
  <p style="font-size: 14px; line-height: 1.7; margin-bottom: 16px;">${book.chapter1.body}</p>
  <div style="margin: 16px 0;">
    ${book.chapter1.stepCards.map(s => `
      <div class="card">
        <strong style="color: ${primaryColor};">[${s.step}] ${s.title}:</strong>
        <span style="font-size: 13.5px; color: #334155;"> ${s.desc}</span>
      </div>
    `).join('')}
  </div>
  <div class="dark-box">${book.chapter1.calloutDark}</div>
  <div class="footer"><span>공부방 스튜디오 · 핵심 개념</span><span>3 / 5 페이지</span></div>
</div>

<!-- 4. 제 2 장: 비교 매트릭스 & 제 3 장: 실전 가이드 -->
<div class="page">
  <span class="badge">제 2 장 & 제 3 장</span>
  <h2>${book.chapter2.title}</h2>
  <p style="font-size: 13.5px; color: #64748b;">${book.chapter2.lead}</p>
  <table>
    <thead><tr><th>핵심 항목</th><th>효용 / 특징</th><th>기대 효과</th></tr></thead>
    <tbody>
      ${book.chapter2.tableRows.map(r => `<tr><td><strong>${r.item}</strong></td><td style="color:${primaryColor}; font-weight:bold;">${r.prob}</td><td>${r.effect}</td></tr>`).join('')}
    </tbody>
  </table>
  <div class="gold-box" style="margin: 12px 0;">💡 ${book.chapter2.insightNote}</div>
  <h2 style="margin-top: 24px;">${book.chapter3.title}</h2>
  <div style="margin: 12px 0;">
    ${book.chapter3.steps.map(st => `
      <div class="card">
        <strong style="color: #16a34a;">${st.phase}:</strong>
        <span style="font-size: 13px; color: #334155;"> ${st.desc}</span>
      </div>
    `).join('')}
  </div>
  <div class="footer"><span>공부방 스튜디오 · 비교 분석 & 실전 가이드</span><span>4 / 5 페이지</span></div>
</div>

<!-- 5. 제 4 장: 복습 워크북 -->
<div class="page">
  <span class="badge">제 4 장</span>
  <h2>${book.chapter4.title}</h2>
  <div class="card" style="background:#fef9c3; border-left: 4px solid #d97706; padding: 14px;">
    <strong style="color: #92400e; font-size: 14px;">${book.chapter4.q1}</strong>
    <div style="margin-top: 6px; font-size: 13.5px; font-weight: 600; color: #0f172a;">👉 ${book.chapter4.a1}</div>
  </div>
  <div class="card" style="background:#f1f5f9; border-left: 4px solid ${primaryColor}; padding: 14px; margin-top: 12px;">
    <strong style="color: #0f172a; font-size: 14px;">${book.chapter4.q2}</strong>
    <div style="margin-top: 6px; font-size: 13.5px; color: #0f172a;">👉 ${book.chapter4.a2}</div>
  </div>
  <div style="margin-top: 20px;">
    <h3 style="font-size: 15px; margin-bottom: 10px; color: #0f172a;">✅ 오늘 당장 실천할 4대 액션 체크리스트:</h3>
    ${book.chapter4.checklist.map(c => `
      <div style="display: flex; gap: 8px; font-size: 13.5px; margin-bottom: 8px; color: #334155;">
        <span style="color: #16a34a; font-weight: 800;">✔</span>
        <span>${c}</span>
      </div>
    `).join('')}
  </div>
  <div class="footer"><span>공부방 스튜디오 · 실천 워크북</span><span>5 / 5 페이지 (완결)</span></div>
</div>

<script>
window.onload = function() {
  setTimeout(function() {
    window.print();
  }, 500);
};
</script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

// ============================================================================
// 6. 메인 컴포넌트: StudyBookStudio (3대 모드 + 실시간 편집 + 테마 스위처)
// ============================================================================
export default function StudyBookStudio() {
  // 모드: 'youtube' | 'topic' | 'markdown'
  const [activeTabMode, setActiveTabMode] = useState('youtube');

  // 유튜브 모드 입력값
  const [urlInput, setUrlInput] = useState('');
  const [extraNotes, setExtraNotes] = useState('');
  const [showNotesInput, setShowNotesInput] = useState(false);

  // 자유 주제 모드 입력값
  const [topicInput, setTopicInput] = useState('');
  const [subtitleInput, setSubtitleInput] = useState('');
  const [authorInput, setAuthorInput] = useState('대표님 기획 · 코다리 총괄부장 집필');
  const [audienceInput, setAudienceInput] = useState('');

  // 마크다운 모드 입력값
  const [mdTitle, setMdTitle] = useState('');
  const [mdAuthor, setMdAuthor] = useState('대표님 집필');
  const [mdContent, setMdContent] = useState('');

  // 상태 관리
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationMsg, setGenerationMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [showLibraryModal, setShowLibraryModal] = useState(false);

  // 실시간 인라인 편집 모드
  const [isEditMode, setIsEditMode] = useState(false);

  // 디자인 테마: 'tech' (블루) | 'amber' (골드) | 'emerald' (그린) | 'obsidian' (다크/인디고)
  const [selectedTheme, setSelectedTheme] = useState('tech');

  // 저장된 도서관 로드
  const [libraryBooks, setLibraryBooks] = useState(getStoredLibrary);
  const [activeBook, setActiveBook] = useState(() => {
    const lib = getStoredLibrary();
    return lib && lib.length > 0 ? lib[0] : MASTER_BOOKS[0];
  });

  const topViewerRef = useRef(null);

  // 활성 책 변경 시 테마 동기화
  useEffect(() => {
    if (activeBook && activeBook.theme) {
      setSelectedTheme(activeBook.theme);
    }
  }, [activeBook?.id]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // 도서관에 저장
  const saveBook = (bk) => {
    setLibraryBooks(prev => {
      const filtered = prev.filter(b => b.id !== bk.id && b.title !== bk.title);
      const updated = [bk, ...filtered];
      try {
        localStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // 활성 책 업데이트 (편집 모드 시)
  const updateActiveBookField = (path, value) => {
    setActiveBook(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      const parts = path.split('.');
      let cur = updated;
      for (let i = 0; i < parts.length - 1; i++) {
        cur = cur[parts[i]];
      }
      cur[parts[parts.length - 1]] = value;
      return updated;
    });
  };

  // 편집 내용 저장
  const handleSaveEdits = () => {
    saveBook(activeBook);
    setIsEditMode(false);
    showToast('💾 수정사항이 전자책에 완벽히 저장되었습니다!');
  };

  // 책 삭제
  const deleteBook = (id) => {
    if (confirm('이 전자책을 서재에서 삭제하시겠습니까?')) {
      setLibraryBooks(prev => {
        const updated = prev.filter(b => b.id !== id);
        try {
          localStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
      if (activeBook.id === id) {
        setActiveBook(MASTER_BOOKS[0]);
      }
      showToast('🗑️ 서재에서 전자책이 삭제되었습니다.');
    }
  };

  // 1. 유튜브 URL 제출 핸들러
  const handleYoutubeSubmit = async (e) => {
    if (e) e.preventDefault();
    const targetUrl = urlInput.trim();
    if (!targetUrl) {
      alert('유튜브 영상 링크를 입력해 주세요.');
      return;
    }

    setIsGenerating(true);
    setGenerationMsg('🔍 유튜브 강의 메타데이터 및 썸네일 분석 중...');

    const ytId = extractYoutubeId(targetUrl);
    const matchedMaster = MASTER_BOOKS.find(b => b.youtubeId === ytId || targetUrl.includes(b.youtubeId));

    if (matchedMaster) {
      setTimeout(() => {
        setGenerationMsg('📑 핵심 챕터 5페이지 완벽 조판 완료!');
        setTimeout(() => {
          const withTheme = { ...matchedMaster, theme: selectedTheme };
          setActiveBook(withTheme);
          saveBook(withTheme);
          setIsGenerating(false);
          setUrlInput('');
          setExtraNotes('');
          setShowNotesInput(false);
          showToast(`📖 [${matchedMaster.title.slice(0, 16)}...] 전자책이 열렸습니다!`);
          topViewerRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }, 400);
      return;
    }

    try {
      const meta = await fetchYoutubeMetadata(targetUrl);
      setGenerationMsg('🧠 강의 내용 분석 및 5페이지 출판 전자책 조판 중...');
      
      setTimeout(() => {
        const newBook = buildIntelligentEbookFromYoutube(targetUrl, meta, extraNotes, selectedTheme);
        setActiveBook(newBook);
        saveBook(newBook);
        setIsGenerating(false);
        setUrlInput('');
        setExtraNotes('');
        setShowNotesInput(false);
        showToast(`📖 [${newBook.title.slice(0, 16)}...] 전자책 조판이 완료되었습니다!`);
        topViewerRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 600);
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
      alert('유튜브 링크를 확인해 주세요.');
    }
  };

  // 2. 자유 주제 제출 핸들러
  const handleTopicSubmit = (e) => {
    if (e) e.preventDefault();
    if (!topicInput.trim()) {
      alert('책 제목이나 주제를 입력해 주세요.');
      return;
    }

    setIsGenerating(true);
    setGenerationMsg('💡 주제 맞춤형 5페이지 전문 도서 기획 및 지능형 조판 중...');

    setTimeout(() => {
      const newBook = buildIntelligentEbookFromTopic(topicInput, subtitleInput, authorInput, audienceInput, selectedTheme);
      setActiveBook(newBook);
      saveBook(newBook);
      setIsGenerating(false);
      setTopicInput('');
      setSubtitleInput('');
      setAudienceInput('');
      showToast(`🎉 [${newBook.title.slice(0, 16)}...] 오리지널 기획 전자책 발행 완료!`);
      topViewerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 600);
  };

  // 3. 마크다운 제출 핸들러
  const handleMarkdownSubmit = (e) => {
    if (e) e.preventDefault();
    if (!mdTitle.trim() && !mdContent.trim()) {
      alert('책 제목이나 원고 텍스트를 입력해 주세요.');
      return;
    }

    setIsGenerating(true);
    setGenerationMsg('📝 마크다운 원고를 5페이지 출판 도서 규격으로 정밀 조판 중...');

    setTimeout(() => {
      const newBook = buildIntelligentEbookFromMarkdown(mdTitle, mdAuthor, mdContent, selectedTheme);
      setActiveBook(newBook);
      saveBook(newBook);
      setIsGenerating(false);
      setMdTitle('');
      setMdContent('');
      showToast(`🎉 [${newBook.title.slice(0, 16)}...] 마크다운 전자책 조판 완료!`);
      topViewerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  };

  // 샘플 영상 원클릭 즉시 선택
  const handleSelectSample = (sampleBook) => {
    const withTheme = { ...sampleBook, theme: selectedTheme };
    setActiveBook(withTheme);
    saveBook(withTheme);
    showToast(`📖 [${sampleBook.title.slice(0, 16)}...] 전자책을 불러왔습니다!`);
    topViewerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 테마 변경 핸들러
  const handleThemeChange = (newTheme) => {
    setSelectedTheme(newTheme);
    const updated = { ...activeBook, theme: newTheme };
    setActiveBook(updated);
    saveBook(updated);
    showToast(`🎨 [${newTheme.toUpperCase()}] 테마 스타일이 적용되었습니다.`);
  };

  return (
    <div className={`studybook-studio sb-theme-${selectedTheme}`}>
      {/* 알림 토스트 */}
      {toastMsg && (
        <div className="sb-toast-bar">
          <CheckCircle2 size={18} color="#38bdf8" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. 최상단 브랜드 헤더 */}
      <header className="sb-simple-header">
        <div className="sb-simple-header-brand">
          <span className="sb-brand-icon">📚</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 className="sb-brand-title">코다리 AI 출판 스튜디오</h1>
              <span className="sb-header-pro-badge">PRO v3.0</span>
            </div>
            <p className="sb-brand-desc">유튜브 · 자유 주제 · 마크다운 원고 ➔ 5초 만에 출판급 5페이지 A4 전자책 & PDF 즉시 발행</p>
          </div>
        </div>

        <div className="sb-header-actions">
          {/* 테마 스위처 */}
          <div className="sb-theme-selector" title="출판 디자인 테마 변경">
            <Palette size={14} />
            <button
              type="button"
              className={`sb-theme-dot tech ${selectedTheme === 'tech' ? 'active' : ''}`}
              onClick={() => handleThemeChange('tech')}
              title="로열 블루 테크 테마"
            />
            <button
              type="button"
              className={`sb-theme-dot amber ${selectedTheme === 'amber' ? 'active' : ''}`}
              onClick={() => handleThemeChange('amber')}
              title="클래식 앰버 골드 테마"
            />
            <button
              type="button"
              className={`sb-theme-dot emerald ${selectedTheme === 'emerald' ? 'active' : ''}`}
              onClick={() => handleThemeChange('emerald')}
              title="에메랄드 포커스 테마"
            />
            <button
              type="button"
              className={`sb-theme-dot obsidian ${selectedTheme === 'obsidian' ? 'active' : ''}`}
              onClick={() => handleThemeChange('obsidian')}
              title="옵시디언 럭셔리 다크 테마"
            />
          </div>

          {/* 인라인 편집 모드 토글 */}
          <button
            type="button"
            className={`sb-btn-edit-toggle ${isEditMode ? 'active' : ''}`}
            onClick={() => {
              if (isEditMode) {
                handleSaveEdits();
              } else {
                setIsEditMode(true);
                showToast('✏️ 실시간 편집 모드가 켜졌습니다. 텍스트를 직접 수정하세요!');
              }
            }}
            title="전자책 내용 직접 수정"
          >
            {isEditMode ? <Save size={14} /> : <Edit3 size={14} />}
            <span>{isEditMode ? '수정 완료' : '내용 수정'}</span>
          </button>

          <button
            className="sb-btn-pdf-hero"
            onClick={() => downloadEbookAsPdf(activeBook, showToast)}
            title="현재 열람 중인 전자책을 고화질 PDF 파일로 다운로드합니다"
          >
            <Download size={15} />
            <span>📥 PDF 다운로드</span>
          </button>

          <button
            className="sb-btn-print-sub"
            onClick={() => printEbookCleanly(activeBook, selectedTheme)}
            title="웹 UI 없이 순수 A4 전자책만 PDF로 저장하거나 인쇄합니다"
          >
            <Printer size={14} />
            <span>🖨️ A4 인쇄창</span>
          </button>

          <button
            className="sb-btn-library-sub"
            onClick={() => setShowLibraryModal(true)}
            title="내가 만든 전자책 서재 목록을 엽니다"
          >
            <Library size={14} />
            <span>📚 서재 ({libraryBooks.length})</span>
          </button>
        </div>
      </header>

      {/* 2. 핵심 3대 생성 모드 섹션 */}
      <section className="sb-one-line-hero">
        {/* 생성 모드 탭 바 */}
        <div className="sb-mode-tab-bar">
          <button
            type="button"
            className={`sb-mode-tab-btn ${activeTabMode === 'youtube' ? 'active' : ''}`}
            onClick={() => setActiveTabMode('youtube')}
          >
            <Video size={16} />
            <span>유튜브 링크로 만들기</span>
          </button>
          <button
            type="button"
            className={`sb-mode-tab-btn ${activeTabMode === 'topic' ? 'active' : ''}`}
            onClick={() => setActiveTabMode('topic')}
          >
            <Lightbulb size={16} />
            <span>자유 주제 / 1초 기획</span>
          </button>
          <button
            type="button"
            className={`sb-mode-tab-btn ${activeTabMode === 'markdown' ? 'active' : ''}`}
            onClick={() => setActiveTabMode('markdown')}
          >
            <FileCode size={16} />
            <span>마크다운 / 메모 붙여넣기</span>
          </button>
        </div>

        {/* 탭 1: 유튜브 모드 */}
        {activeTabMode === 'youtube' && (
          <form onSubmit={handleYoutubeSubmit} className="sb-url-form">
            <div className="sb-input-wrapper">
              <div className="sb-input-field-row">
                <span className="sb-input-icon">📺</span>
                <input
                  type="url"
                  className="sb-url-input"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="유튜브 강의 링크 붙여넣기 (https://...)"
                  required
                />
              </div>
              <button
                type="submit"
                className="sb-submit-btn"
                disabled={isGenerating}
              >
                {isGenerating ? <RefreshCw size={18} className="animate-spin" /> : <Sparkles size={18} />}
                <span>{isGenerating ? '조판 중...' : '⚡ 1초만에 전자책 만들기'}</span>
              </button>
            </div>

            {/* 자막/메모 선택 추가 토글 */}
            <div className="sb-notes-toggle-bar">
              <button
                type="button"
                className="sb-notes-toggle-btn"
                onClick={() => setShowNotesInput(!showNotesInput)}
              >
                {showNotesInput ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                <span>➕ 자막이나 개인 메모가 있다면 추가 입력 (선택사항)</span>
              </button>
            </div>

            {showNotesInput && (
              <div className="sb-extra-notes-box">
                <textarea
                  className="sb-extra-textarea"
                  rows={3}
                  value={extraNotes}
                  onChange={(e) => setExtraNotes(e.target.value)}
                  placeholder="영상의 핵심 자막이나 추가하고 싶은 메모가 있다면 여기에 붙여넣으세요. 전자책 본문에 자연스럽게 통합 조판됩니다."
                />
              </div>
            )}

            {/* 1초 원클릭 추천 인기 강의 칩 4종 */}
            <div className="sb-preset-chips-container">
              <div className="sb-preset-label">⚡ 원클릭 샘플 강의 즉시 열람:</div>
              <div className="sb-preset-chips">
                {MASTER_BOOKS.map((bk) => (
                  <button
                    key={bk.id}
                    type="button"
                    className={`sb-chip-btn ${activeBook.id === bk.id ? 'active' : ''}`}
                    onClick={() => handleSelectSample(bk)}
                  >
                    <span>🎬 {bk.title.length > 22 ? bk.title.slice(0, 22) + '...' : bk.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* 탭 2: 자유 주제 / 기획 모드 */}
        {activeTabMode === 'topic' && (
          <form onSubmit={handleTopicSubmit} className="sb-topic-form">
            <div className="sb-topic-grid">
              <div className="sb-topic-field-main">
                <label className="sb-form-label">📖 전자책 주제 / 제목 (필수)</label>
                <div className="sb-input-field-row">
                  <span className="sb-input-icon">💡</span>
                  <input
                    type="text"
                    className="sb-url-input"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    placeholder="예: 1인 AI 대행 에이전시 첫 달 300만원 수익화 로드맵"
                    required
                  />
                </div>
              </div>

              <div className="sb-topic-field-sub">
                <label className="sb-form-label">부제 / 핵심 설명 (선택)</label>
                <input
                  type="text"
                  className="sb-text-input"
                  value={subtitleInput}
                  onChange={(e) => setSubtitleInput(e.target.value)}
                  placeholder="예: 코딩 몰라도 바로 시작하는 n8n과 LLM 연동 실무 워크북"
                />
              </div>
            </div>

            <div className="sb-topic-row-extra">
              <div style={{ flex: 1 }}>
                <label className="sb-form-label">저자명</label>
                <input
                  type="text"
                  className="sb-text-input"
                  value={authorInput}
                  onChange={(e) => setAuthorInput(e.target.value)}
                />
              </div>
              <div style={{ flex: 1.5 }}>
                <label className="sb-form-label">타깃 독자층</label>
                <input
                  type="text"
                  className="sb-text-input"
                  value={audienceInput}
                  onChange={(e) => setAudienceInput(e.target.value)}
                  placeholder="예: AI로 시간과 수익을 레버리지하려는 1인 기업가"
                />
              </div>
            </div>

            <div className="sb-topic-bottom-bar">
              <div className="sb-quick-ideas">
                <span className="sb-quick-label">⚡ 빠른 아이디어:</span>
                <button
                  type="button"
                  className="sb-quick-btn"
                  onClick={() => {
                    setTopicInput('1인 AI 에이전시 첫 달 300만원 수익화 로드맵');
                    setSubtitleInput('코딩 몰라도 바로 시작하는 n8n 자동화와 LLM 외주 파이프라인');
                  }}
                >
                  AI 에이전시 창업
                </button>
                <button
                  type="button"
                  className="sb-quick-btn"
                  onClick={() => {
                    setTopicInput('초보자를 위한 RAG & 강화학습 실전 입문서');
                    setSubtitleInput('로컬 LLM과 언센서 모델로 나만의 1인 자비스 두뇌 만들기');
                  }}
                >
                  RAG & 자비스 에이전트
                </button>
                <button
                  type="button"
                  className="sb-quick-btn"
                  onClick={() => {
                    setTopicInput('유튜브 숏폼 자동화 팩토리 완전 정복');
                    setSubtitleInput('무료 AI 영상 툴과 대본 생성기로 매일 3편 양산하기');
                  }}
                >
                  숏폼 양산 공장
                </button>
              </div>

              <button
                type="submit"
                className="sb-submit-btn"
                disabled={isGenerating}
              >
                {isGenerating ? <RefreshCw size={18} className="animate-spin" /> : <Sparkles size={18} />}
                <span>{isGenerating ? '조판 중...' : '⚡ 1초만에 기획 전자책 조판'}</span>
              </button>
            </div>
          </form>
        )}

        {/* 탭 3: 마크다운 / 메모 모드 */}
        {activeTabMode === 'markdown' && (
          <form onSubmit={handleMarkdownSubmit} className="sb-markdown-form">
            <div className="sb-topic-row-extra" style={{ marginBottom: 12 }}>
              <div style={{ flex: 2 }}>
                <label className="sb-form-label">전자책 제목</label>
                <input
                  type="text"
                  className="sb-text-input"
                  value={mdTitle}
                  onChange={(e) => setMdTitle(e.target.value)}
                  placeholder="예: 강화학습 하이퍼파라미터 완전 정복 복습노트"
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="sb-form-label">저자명</label>
                <input
                  type="text"
                  className="sb-text-input"
                  value={mdAuthor}
                  onChange={(e) => setMdAuthor(e.target.value)}
                />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label className="sb-form-label">마크다운 본문 또는 메모 텍스트 붙여넣기</label>
              <textarea
                className="sb-extra-textarea"
                rows={5}
                value={mdContent}
                onChange={(e) => setMdContent(e.target.value)}
                placeholder="# 여기에 마크다운 텍스트나 메모를 자유롭게 붙여넣으세요.
- 5페이지 출판 도서 규격으로 자동 분할 및 조판됩니다.
- 표, 불릿 포인트, 핵심 강조 문구가 자동으로 인식됩니다."
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                className="sb-submit-btn"
                disabled={isGenerating}
              >
                {isGenerating ? <RefreshCw size={18} className="animate-spin" /> : <Sparkles size={18} />}
                <span>{isGenerating ? '조판 중...' : '⚡ 1초만에 출판 전자책 변환'}</span>
              </button>
            </div>
          </form>
        )}

        {/* 생성 중 안내 카드 */}
        {isGenerating && (
          <div className="sb-generating-card">
            <div className="sb-spinner-pulse" />
            <div style={{ fontWeight: 800, fontSize: 15, color: '#0369a1', marginTop: 10 }}>
              {generationMsg}
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
              1개념 1페이지 규격에 맞춰 표지, 핵심 원리, 구조 비교표, 복습 워크북을 조판 중입니다.
            </div>
          </div>
        )}
      </section>

      {/* 3. 완성된 전자책 뷰어 섹션 */}
      <section ref={topViewerRef} className="sb-viewer-section">
        {/* 뷰어 상단 상태 & 다이렉트 컨트롤 바 */}
        <div className="sb-viewer-control-bar">
          <div className="sb-viewer-current-info">
            <span className="sb-viewer-pill">{activeBook.badge}</span>
            <h2 className="sb-viewer-book-title">{activeBook.title}</h2>
          </div>

          <div className="sb-viewer-action-btns">
            {isEditMode ? (
              <button
                className="sb-btn-save-action"
                onClick={handleSaveEdits}
              >
                <Save size={16} />
                <strong>수정 완료 (저장)</strong>
              </button>
            ) : (
              <button
                className="sb-btn-edit-action"
                onClick={() => setIsEditMode(true)}
              >
                <Edit3 size={15} />
                <span>내용 직접 수정</span>
              </button>
            )}

            <button
              className="sb-btn-download-action"
              onClick={() => downloadEbookAsPdf(activeBook, showToast)}
            >
              <Download size={16} />
              <strong>📥 A4 PDF 다운로드</strong>
            </button>
            <button
              className="sb-btn-print-action"
              onClick={() => printEbookCleanly(activeBook, selectedTheme)}
            >
              <Printer size={15} />
              <span>🖨️ A4 인쇄창</span>
            </button>
          </div>
        </div>

        {/* 편집 모드 안내 배너 */}
        {isEditMode && (
          <div className="sb-edit-mode-banner">
            <Edit3 size={16} color="#0284c7" />
            <span>
              <strong>✏️ 실시간 편집 모드 활성화:</strong> 아래 5개 페이지의 제목, 본문, 요약, 체크리스트를 클릭하여 바로 수정할 수 있습니다. 수정을 마치신 후 상단 <strong>[수정 완료 (저장)]</strong>을 누르세요.
            </span>
          </div>
        )}

        {/* 5개 연속 A4 시트 (1개념 1페이지) */}
        <div className="sb-book-preview-container">
          
          {/* ── 1. 표지 (Cover) ── */}
          <article className="sb-page-sheet sb-cover-sheet">
            <div className="sb-sheet-content center">
              {isEditMode ? (
                <input
                  type="text"
                  className="sb-edit-input sb-sheet-badge"
                  value={activeBook.badge}
                  onChange={(e) => updateActiveBookField('badge', e.target.value)}
                />
              ) : (
                <span className="sb-sheet-badge">{activeBook.badge}</span>
              )}

              {isEditMode ? (
                <input
                  type="text"
                  className="sb-edit-input sb-cover-h1"
                  value={activeBook.title}
                  onChange={(e) => updateActiveBookField('title', e.target.value)}
                />
              ) : (
                <h1 className="sb-cover-h1">{activeBook.title}</h1>
              )}

              {isEditMode ? (
                <input
                  type="text"
                  className="sb-edit-input sb-cover-sub"
                  value={activeBook.subtitle}
                  onChange={(e) => updateActiveBookField('subtitle', e.target.value)}
                />
              ) : (
                <p className="sb-cover-sub">{activeBook.subtitle}</p>
              )}

              <div className="sb-cover-img-wrap">
                <img
                  src={activeBook.coverImage}
                  alt={activeBook.title}
                  className="sb-cover-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
              </div>

              <div className="sb-cover-meta-info">
                {isEditMode ? (
                  <input
                    type="text"
                    className="sb-edit-input"
                    style={{ textAlign: 'center', fontWeight: 'bold' }}
                    value={activeBook.author}
                    onChange={(e) => updateActiveBookField('author', e.target.value)}
                  />
                ) : (
                  <strong>{activeBook.author}</strong>
                )}
                <span className="sb-dot">•</span>
                <span>조판일: {activeBook.createdAt}</span>
              </div>

              {activeBook.sourceRef && activeBook.sourceRef.startsWith('http') && (
                <div style={{ marginTop: 14 }}>
                  <a
                    href={activeBook.sourceRef}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sb-source-link-pill"
                  >
                    <ExternalLink size={13} />
                    <span>유튜브 원본 영상 바로가기</span>
                  </a>
                </div>
              )}
            </div>
            <div className="sb-sheet-footer">
              <span>공부방 스튜디오 · 개인 학습책</span>
              <span>1 / 5 페이지 (표지)</span>
            </div>
          </article>

          {/* ── 2. 개요 & 3줄 브리핑 ── */}
          <article className="sb-page-sheet">
            <div className="sb-sheet-header">
              <span className="sb-eyebrow">Executive Summary</span>
              <span className="sb-page-num">p. 02</span>
            </div>

            <div className="sb-sheet-content">
              <h2 className="sb-sheet-title">강의 개요 & 30초 핵심 브리핑</h2>

              <div className="sb-gold-callout">
                {isEditMode ? (
                  <textarea
                    className="sb-edit-textarea"
                    rows={2}
                    value={activeBook.insight}
                    onChange={(e) => updateActiveBookField('insight', e.target.value)}
                  />
                ) : (
                  activeBook.insight
                )}
              </div>

              <div className="sb-section-box">
                <div className="sb-box-title">⚡ 이 책의 핵심 3대 포인트:</div>
                <div className="sb-bullet-list">
                  {activeBook.summaryBullets.map((bullet, idx) => (
                    <div key={idx} className="sb-bullet-item">
                      <span className="sb-bullet-num">{idx + 1}</span>
                      {isEditMode ? (
                        <input
                          type="text"
                          className="sb-edit-input"
                          value={bullet}
                          onChange={(e) => {
                            const newBullets = [...activeBook.summaryBullets];
                            newBullets[idx] = e.target.value;
                            updateActiveBookField('summaryBullets', newBullets);
                          }}
                        />
                      ) : (
                        <p>{bullet}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="sb-dark-callout">
                <strong>🎯 추천 학습 대상 및 목표:</strong>{' '}
                {isEditMode ? (
                  <input
                    type="text"
                    className="sb-edit-input"
                    value={activeBook.audience}
                    onChange={(e) => updateActiveBookField('audience', e.target.value)}
                  />
                ) : (
                  activeBook.audience
                )}
              </div>

              <div className="sb-preview-chapters-grid">
                <div className="sb-preview-card">
                  <strong>제 1 장</strong>
                  <span>핵심 개념 및 원리 해설</span>
                </div>
                <div className="sb-preview-card">
                  <strong>제 2 장</strong>
                  <span>구조 분석 & 비교 매트릭스</span>
                </div>
                <div className="sb-preview-card">
                  <strong>제 3 장</strong>
                  <span>1인 실전 적용 로드맵</span>
                </div>
                <div className="sb-preview-card">
                  <strong>제 4 장</strong>
                  <span>복습 퀴즈 & 실천 체크리스트</span>
                </div>
              </div>
            </div>

            <div className="sb-sheet-footer">
              <span>공부방 스튜디오 · 강의 개요</span>
              <span>2 / 5 페이지</span>
            </div>
          </article>

          {/* ── 3. 제 1 장: 핵심 개념 원리 ── */}
          <article className="sb-page-sheet">
            <div className="sb-sheet-header">
              <span className="sb-eyebrow">Chapter 01 · Core Principles</span>
              <span className="sb-page-num">p. 03</span>
            </div>

            <div className="sb-sheet-content">
              {isEditMode ? (
                <input
                  type="text"
                  className="sb-edit-input sb-sheet-title"
                  value={activeBook.chapter1.title}
                  onChange={(e) => updateActiveBookField('chapter1.title', e.target.value)}
                />
              ) : (
                <h2 className="sb-sheet-title">{activeBook.chapter1.title}</h2>
              )}

              {isEditMode ? (
                <textarea
                  className="sb-edit-textarea sb-body-paragraph"
                  rows={4}
                  value={activeBook.chapter1.body}
                  onChange={(e) => updateActiveBookField('chapter1.body', e.target.value)}
                />
              ) : (
                <p className="sb-body-paragraph">
                  {activeBook.chapter1.body}
                </p>
              )}

              <div className="sb-step-cards-container">
                {activeBook.chapter1.stepCards.map((sc, idx) => (
                  <div key={idx} className="sb-step-card">
                    <div className="sb-step-card-header">
                      <span className="sb-step-tag">{sc.step}</span>
                      {isEditMode ? (
                        <input
                          type="text"
                          className="sb-edit-input"
                          style={{ fontWeight: 'bold' }}
                          value={sc.title}
                          onChange={(e) => {
                            const newCards = [...activeBook.chapter1.stepCards];
                            newCards[idx].title = e.target.value;
                            updateActiveBookField('chapter1.stepCards', newCards);
                          }}
                        />
                      ) : (
                        <strong>{sc.title}</strong>
                      )}
                    </div>
                    {isEditMode ? (
                      <textarea
                        className="sb-edit-textarea"
                        rows={2}
                        value={sc.desc}
                        onChange={(e) => {
                          const newCards = [...activeBook.chapter1.stepCards];
                          newCards[idx].desc = e.target.value;
                          updateActiveBookField('chapter1.stepCards', newCards);
                        }}
                      />
                    ) : (
                      <p>{sc.desc}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="sb-dark-callout">
                {isEditMode ? (
                  <input
                    type="text"
                    className="sb-edit-input"
                    value={activeBook.chapter1.calloutDark}
                    onChange={(e) => updateActiveBookField('chapter1.calloutDark', e.target.value)}
                  />
                ) : (
                  activeBook.chapter1.calloutDark
                )}
              </div>
            </div>

            <div className="sb-sheet-footer">
              <span>공부방 스튜디오 · 제 1 장 핵심 개념</span>
              <span>3 / 5 페이지</span>
            </div>
          </article>

          {/* ── 4. 제 2 장: 비교 매트릭스 & 제 3 장: 실전 로드맵 ── */}
          <article className="sb-page-sheet">
            <div className="sb-sheet-header">
              <span className="sb-eyebrow">Chapter 02 & 03 · Matrix & Roadmap</span>
              <span className="sb-page-num">p. 04</span>
            </div>

            <div className="sb-sheet-content">
              {isEditMode ? (
                <input
                  type="text"
                  className="sb-edit-input sb-sheet-title"
                  value={activeBook.chapter2.title}
                  onChange={(e) => updateActiveBookField('chapter2.title', e.target.value)}
                />
              ) : (
                <h2 className="sb-sheet-title">{activeBook.chapter2.title}</h2>
              )}

              {isEditMode ? (
                <input
                  type="text"
                  className="sb-edit-input sb-lead-text"
                  value={activeBook.chapter2.lead}
                  onChange={(e) => updateActiveBookField('chapter2.lead', e.target.value)}
                />
              ) : (
                <p className="sb-lead-text">{activeBook.chapter2.lead}</p>
              )}

              <div className="sb-table-responsive">
                <table className="sb-data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '32%' }}>핵심 항목</th>
                      <th style={{ width: '28%' }}>효용 및 특징</th>
                      <th>기대 효과</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeBook.chapter2.tableRows.map((row, idx) => (
                      <tr key={idx}>
                        <td>
                          {isEditMode ? (
                            <input
                              type="text"
                              className="sb-edit-input"
                              value={row.item}
                              onChange={(e) => {
                                const newRows = [...activeBook.chapter2.tableRows];
                                newRows[idx].item = e.target.value;
                                updateActiveBookField('chapter2.tableRows', newRows);
                              }}
                            />
                          ) : (
                            <strong>{row.item}</strong>
                          )}
                        </td>
                        <td className="sb-td-highlight">
                          {isEditMode ? (
                            <input
                              type="text"
                              className="sb-edit-input"
                              value={row.prob}
                              onChange={(e) => {
                                const newRows = [...activeBook.chapter2.tableRows];
                                newRows[idx].prob = e.target.value;
                                updateActiveBookField('chapter2.tableRows', newRows);
                              }}
                            />
                          ) : (
                            row.prob
                          )}
                        </td>
                        <td>
                          {isEditMode ? (
                            <input
                              type="text"
                              className="sb-edit-input"
                              value={row.effect}
                              onChange={(e) => {
                                const newRows = [...activeBook.chapter2.tableRows];
                                newRows[idx].effect = e.target.value;
                                updateActiveBookField('chapter2.tableRows', newRows);
                              }}
                            />
                          ) : (
                            row.effect
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="sb-gold-callout" style={{ margin: '14px 0' }}>
                💡 <strong>구조 인사이트:</strong>{' '}
                {isEditMode ? (
                  <input
                    type="text"
                    className="sb-edit-input"
                    value={activeBook.chapter2.insightNote}
                    onChange={(e) => updateActiveBookField('chapter2.insightNote', e.target.value)}
                  />
                ) : (
                  activeBook.chapter2.insightNote
                )}
              </div>

              {isEditMode ? (
                <input
                  type="text"
                  className="sb-edit-input sb-sheet-title"
                  style={{ marginTop: 22 }}
                  value={activeBook.chapter3.title}
                  onChange={(e) => updateActiveBookField('chapter3.title', e.target.value)}
                />
              ) : (
                <h2 className="sb-sheet-title" style={{ marginTop: 22 }}>{activeBook.chapter3.title}</h2>
              )}

              <div className="sb-action-steps-list">
                {activeBook.chapter3.steps.map((st, idx) => (
                  <div key={idx} className="sb-action-step-item">
                    {isEditMode ? (
                      <input
                        type="text"
                        className="sb-edit-input sb-step-phase"
                        value={st.phase}
                        onChange={(e) => {
                          const newSteps = [...activeBook.chapter3.steps];
                          newSteps[idx].phase = e.target.value;
                          updateActiveBookField('chapter3.steps', newSteps);
                        }}
                      />
                    ) : (
                      <strong className="sb-step-phase">{st.phase}</strong>
                    )}
                    {isEditMode ? (
                      <textarea
                        className="sb-edit-textarea"
                        rows={2}
                        value={st.desc}
                        onChange={(e) => {
                          const newSteps = [...activeBook.chapter3.steps];
                          newSteps[idx].desc = e.target.value;
                          updateActiveBookField('chapter3.steps', newSteps);
                        }}
                      />
                    ) : (
                      <p>{st.desc}</p>
                    )}
                  </div>
                ))}
              </div>

              {activeBook.chapter3.promptTemplate && (
                <div className="sb-prompt-box-wrap">
                  <div className="sb-prompt-header">
                    <span>📋 실전 마스터 템플릿</span>
                    <button
                      type="button"
                      className="sb-btn-copy-prompt"
                      onClick={() => {
                        navigator.clipboard.writeText(activeBook.chapter3.promptTemplate);
                        showToast('📋 템플릿이 클립보드에 복사되었습니다!');
                      }}
                    >
                      <Copy size={12} /> 복사
                    </button>
                  </div>
                  {isEditMode ? (
                    <textarea
                      className="sb-edit-textarea sb-prompt-pre"
                      rows={5}
                      value={activeBook.chapter3.promptTemplate}
                      onChange={(e) => updateActiveBookField('chapter3.promptTemplate', e.target.value)}
                    />
                  ) : (
                    <pre className="sb-prompt-pre">{activeBook.chapter3.promptTemplate}</pre>
                  )}
                </div>
              )}
            </div>

            <div className="sb-sheet-footer">
              <span>공부방 스튜디오 · 비교 분석 & 실전 로드맵</span>
              <span>4 / 5 페이지</span>
            </div>
          </article>

          {/* ── 5. 제 4 장: 복습 워크북 & 체크리스트 ── */}
          <article className="sb-page-sheet">
            <div className="sb-sheet-header">
              <span className="sb-eyebrow">Chapter 04 · Workbook & Action</span>
              <span className="sb-page-num">p. 05</span>
            </div>

            <div className="sb-sheet-content">
              {isEditMode ? (
                <input
                  type="text"
                  className="sb-edit-input sb-sheet-title"
                  value={activeBook.chapter4.title}
                  onChange={(e) => updateActiveBookField('chapter4.title', e.target.value)}
                />
              ) : (
                <h2 className="sb-sheet-title">{activeBook.chapter4.title}</h2>
              )}

              {/* 퀴즈 1 */}
              <div className="sb-workbook-card gold-border">
                <div className="sb-wb-question">
                  {isEditMode ? (
                    <input
                      type="text"
                      className="sb-edit-input"
                      value={activeBook.chapter4.q1}
                      onChange={(e) => updateActiveBookField('chapter4.q1', e.target.value)}
                    />
                  ) : (
                    activeBook.chapter4.q1
                  )}
                </div>
                <div className="sb-wb-answer">
                  <span className="sb-answer-label">정답 및 해설:</span>
                  {isEditMode ? (
                    <textarea
                      className="sb-edit-textarea"
                      rows={2}
                      value={activeBook.chapter4.a1}
                      onChange={(e) => updateActiveBookField('chapter4.a1', e.target.value)}
                    />
                  ) : (
                    <p>{activeBook.chapter4.a1}</p>
                  )}
                </div>
              </div>

              {/* 퀴즈 2 */}
              <div className="sb-workbook-card dark-border">
                <div className="sb-wb-question">
                  {isEditMode ? (
                    <input
                      type="text"
                      className="sb-edit-input"
                      value={activeBook.chapter4.q2}
                      onChange={(e) => updateActiveBookField('chapter4.q2', e.target.value)}
                    />
                  ) : (
                    activeBook.chapter4.q2
                  )}
                </div>
                <div className="sb-wb-answer">
                  <span className="sb-answer-label">실천 가이드:</span>
                  {isEditMode ? (
                    <textarea
                      className="sb-edit-textarea"
                      rows={2}
                      value={activeBook.chapter4.a2}
                      onChange={(e) => updateActiveBookField('chapter4.a2', e.target.value)}
                    />
                  ) : (
                    <p>{activeBook.chapter4.a2}</p>
                  )}
                </div>
              </div>

              {/* 4대 체크리스트 */}
              <div className="sb-checklist-section">
                <h3 className="sb-checklist-heading">✅ 오늘 당장 실천할 4대 액션 체크리스트:</h3>
                <div className="sb-checklist-grid">
                  {activeBook.chapter4.checklist.map((item, idx) => (
                    <div key={idx} className="sb-check-item">
                      <span className="sb-check-icon">✔</span>
                      {isEditMode ? (
                        <input
                          type="text"
                          className="sb-edit-input"
                          value={item}
                          onChange={(e) => {
                            const newCheck = [...activeBook.chapter4.checklist];
                            newCheck[idx] = e.target.value;
                            updateActiveBookField('chapter4.checklist', newCheck);
                          }}
                        />
                      ) : (
                        <p>{item}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 하단 메모 패드 */}
              <div className="sb-user-memo-lines-card">
                <div className="sb-memo-title">✏️ 대표님 전용 액션 플랜 필기 노트</div>
                <div className="sb-ruled-lines" />
              </div>
            </div>

            <div className="sb-sheet-footer">
              <span>공부방 스튜디오 · 실천 워크북</span>
              <span>5 / 5 페이지 (완결)</span>
            </div>
          </article>

        </div>
      </section>

      {/* 4. 모바일 하단 플로팅 고정 다운로드 바 (390px 모바일 완벽 대응) */}
      <div className="sb-floating-bottom-bar">
        <div className="sb-floating-inner">
          <div className="sb-floating-title-box">
            <span className="sb-floating-label">열람 중:</span>
            <span className="sb-floating-name">{activeBook.title}</span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              className="sb-floating-edit-btn"
              onClick={() => {
                if (isEditMode) handleSaveEdits();
                else setIsEditMode(true);
              }}
            >
              {isEditMode ? <Save size={15} /> : <Edit3 size={15} />}
              <span>{isEditMode ? '저장' : '수정'}</span>
            </button>
            <button
              className="sb-floating-pdf-btn"
              onClick={() => downloadEbookAsPdf(activeBook, showToast)}
            >
              <Download size={16} />
              <span>PDF 다운로드</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. 나의 전자책 보관함 모달 */}
      {showLibraryModal && (
        <div className="sb-modal-overlay" onClick={() => setShowLibraryModal(false)}>
          <div className="sb-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="sb-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Library size={20} color="#0284c7" />
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>나의 전자책 서재 ({libraryBooks.length}권)</h3>
              </div>
              <button
                className="sb-btn-close-modal"
                onClick={() => setShowLibraryModal(false)}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px 0' }}>
              대표님이 생성하시거나 열람하신 모든 전자책이 안전하게 보관되어 있습니다. 언제든 책을 열거나 PDF를 다운로드할 수 있습니다.
            </p>

            <div className="sb-library-grid">
              {libraryBooks.map((bk) => (
                <div key={bk.id} className="sb-library-item-card">
                  <div className="sb-lib-thumb-wrap">
                    <img src={bk.coverImage} alt={bk.title} className="sb-lib-thumb" />
                    <span className="sb-lib-badge">{bk.badge}</span>
                  </div>
                  <div className="sb-lib-info">
                    <h4 className="sb-lib-title">{bk.title}</h4>
                    <span className="sb-lib-author">{bk.author}</span>
                    <div className="sb-lib-actions">
                      <button
                        className="sb-lib-btn-read"
                        onClick={() => {
                          setActiveBook(bk);
                          setShowLibraryModal(false);
                          showToast(`📖 [${bk.title.slice(0, 16)}...] 전자책을 열었습니다.`);
                          topViewerRef.current?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        📖 책 열기
                      </button>
                      <button
                        className="sb-lib-btn-pdf"
                        onClick={() => downloadEbookAsPdf(bk, showToast)}
                      >
                        <Download size={13} /> PDF
                      </button>
                      <button
                        className="sb-lib-btn-del"
                        onClick={() => deleteBook(bk.id)}
                        title="보관함에서 삭제"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
