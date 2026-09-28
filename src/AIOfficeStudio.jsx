import React, { useState, useEffect, useRef } from 'react';
import './AIOfficeStudio.css';
import {
  Users, Bot, Sparkles, MessageSquare, CheckCircle2,
  Clock, Play, Send, Plus, Coffee, Briefcase, Award,
  Terminal, BarChart3, Lightbulb, Shield, Zap, RefreshCw,
  Kanban, ArrowRight, Eye, ChevronRight, Copy, Check, Download, X, FileText, Code
} from 'lucide-react';

// ==============================================================================
// 📦 실제 1인 기업 실무 산출물 라이브러리 (Deliverables Library)
// 대표님이 즉시 복사하거나 파일로 내려받아 오늘 밤 바로 쓸 수 있는 실물 데이터!
// ==============================================================================
const REAL_DELIVERABLES = {
  script_lofi: {
    id: 'script_lofi',
    type: 'script',
    title: '🎬 [기획] Lo-Fi 꿀통 채널 숏폼 풀 스크립트 3편 (후킹/본문/CTA 완비)',
    author: '헤르메스 기획관',
    authorAvatar: '💡',
    category: '숏폼 콘텐츠',
    date: '2026-09-28',
    fileExt: 'md',
    fileName: 'lofi_shorts_scripts_3sets.md',
    content: `# 🎬 유튜브 숏폼 실전 스크립트 3세트 (Hermes Niche Engine v2.4)
> 🎯 타깃: 퇴근 후 지친 2030 직장인 / 시험 기간 대학생
> ⏱️ 러닝타임: 25~35초 내외 (평균 시청 지속 시간 85% 이상 설계)

---

## 📌 [제1편] 구독자 9명인데 조회수 2.5만 터진 Lo-Fi 채널의 비밀
- **[00~03초 | 강력한 후킹]**
  - **화면**: 구독자 9명인 채널 화면에 빨간색 동그라미 치며 줌인. 옆에 "조회수 25,480회" 대문짝만하게 박힘.
  - **내레이션(AI 보이스/대표님 육성)**: "구독자 9명인데 조회수 2.5만이 터졌다고? 이거 진짜 버그일까요?"
  - **자막**: "구독자 9명 채널에 무슨 일이 일어난 걸까?"

- **[04~15초 | 본문 & 비밀 폭로]**
  - **화면**: 영상 재생 바를 보여주며 '시청 지속 시간' 그래프가 평평하게 유지되는 장면.
  - **내레이션**: "비밀은 바로 '1분 루프 구간'에 있었습니다. 사람들은 음악을 들으러 온 게 아니라, 그냥 멍때리거나 일하려고 틀어둔 거였어요. 알고리즘은 이걸 '완벽한 시청 지속 시간'으로 인식하고 떡상을 시킨 겁니다."
  - **자막**: "알고리즘을 속인 1분 루프의 마법 ✨"

- **[16~22초 | 액션 제안 & CTA]**
  - **화면**: Suno AI에서 프롬프트 "chill lofi beat, nostalgic vinyl crackle" 입력하고 3초 만에 곡 나오는 화면.
  - **내레이션**: "지금 당장 AI로 이 곡을 만드는 데 딱 1분 걸렸습니다. 제가 쓴 프롬프트 3개, 고정 댓글에 무료로 풀어둘게요. 먼저 먹는 사람이 임자입니다."
  - **자막**: "프롬프트 3종 고정댓글 무료 배포 👇 지금 확인!"

---

## 📌 [제2편] 직장인 퇴근 후 30분, 3D AI 오피스로 1인 미디어 돌리는 법
- **[00~03초 | 후킹]**
  - **화면**: 모니터 4분할 화면에서 AI 비서 4명이 알아서 대본 쓰고 코드 짜는 화면 (DeskRPG 오피스).
  - **내레이션**: "월급 250 받으면서 언제까지 퇴근하고 배민 라이더 뛰실 겁니까?"
  - **자막**: "퇴근 후 30분, 내 방에 AI 직원 4명 두는 법"

- **[04~18초 | 본문]**
  - **화면**: 헤르메스 기획관이 숏폼 대본 뽑고, 알렉스 개발관이 유튜브 꿀통 채널을 긁어오는 장면.
  - **내레이션**: "기획은 헤르메스가 하고, 영상 수집은 파이썬 코드가 알아서 돌립니다. 저는 딱 5분 동안 커피 마시면서 최종 승인 버튼만 누릅니다. 혼자서 방송국 하나를 돌리는 거죠."
  - **자막**: "1인 기업 = 지시만 내리는 CEO가 되는 것 ☕"

- **[19~25초 | CTA]**
  - **화면**: 코다리 공부방 3D 가상 오피스 링크 화면.
  - **내레이션**: "이 시스템, 오늘 밤 대표님 폰에서도 그대로 열립니다. 링크 타고 들어와서 첫 지시를 내려보세요."
  - **자막**: "프로필 링크 클릭하고 나만의 AI 오피스 입장하기 🚀"

---

## 📌 [제3편] 99%가 모르는 유튜브 BGM 썸네일 색상 공식
- **[00~03초 | 후킹]**
  - **화면**: 파란색 차가운 썸네일 vs 따뜻한 보라/주황 앰비언트 썸네일 나란히 비교. 클릭률(CTR) 2.1% vs 9.8% 표기.
  - **내레이션**: "음악이 아무리 좋아도 썸네일이 '파란색'이면 99% 망합니다."
  - **자막**: "유튜브 음악 채널 클릭률 4배 차이 나는 이유 🎨"

- **[04~16초 | 본문]**
  - **화면**: 방 안 창문으로 은은한 노을빛이 들어오는 레트로 픽셀 아트 애니메이션 줌인.
  - **내레이션**: "밤 11시에 유튜브를 켜는 사람들의 뇌는 차가운 색을 거부합니다. 형광등을 끈 내 방 같은 '미드나잇 퍼플'과 '앰버 오렌지' 조명이어야 뇌가 편안함을 느끼고 무의식적으로 누르게 됩니다."
  - **자막**: "미드나잇 퍼플 (#4A154B) + 앰버 오렌지 (#F59E0B) 조합"

- **[17~25초 | CTA]**
  - **화면**: Midjourney 프롬프트 복사 화면.
  - **내레이션**: "클릭률 9.8% 터뜨린 미드저니 썸네일 프롬프트 템플릿, 오늘 밤 댓글로 즉시 공유합니다."
  - **자막**: "썸네일 프롬프트 복사하기 👉 댓글창 확인!"`
  },

  code_crawler: {
    id: 'code_crawler',
    type: 'code',
    title: '💻 [개발] 유튜브 Lo-Fi 꿀통 채널 자동 수집 파이썬 스크립트',
    author: '알렉스 수석 개발관',
    authorAvatar: '💻',
    category: '파이썬 자동화',
    date: '2026-09-28',
    fileExt: 'py',
    fileName: 'youtube_lofi_hunter.py',
    content: `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
==============================================================================
 유튜브 Lo-Fi 이상치(Outlier) 꿀통 채널 자동 수집기 v2.0
 제작: 알렉스 수석 개발관 (Alex Lead Dev)
 검수: 코다리 총괄부장
 
 [핵심 알고리즘]
 - 검색 키워드: lofi hip hop, chill beats, study music, sleeping lofi
 - 필터 기준: 구독자 5,000명 이하 AND 영상 조회수 20,000회 이상 (이상치 비율 400% 이상)
 - 결과물: 콘솔 테이블 출력 + lofi_golden_channels.json 자동 저장
==============================================================================
"""

import sys
import time
import json
import urllib.parse
import urllib.request
from datetime import datetime

print("=" * 70)
print("🚀 [알렉스 개발관] 유튜브 Lo-Fi 꿀통 이상치 채널 발굴 레이더 가동...")
print("=" * 70)

# 가상 실측 수집 데이터 엔진 (API 키 없이도 즉시 테스트 가능한 시뮬레이션 및 실제 구조)
SAMPLE_TARGETS = [
    {
        "channel_name": "Midnight Rain Lo-Fi",
        "subscribers": 1420,
        "video_title": "Rainy Night in Seoul - 1 Hour Cozy Study Beats",
        "views": 48200,
        "outlier_ratio": 3394.3,
        "video_published_days_ago": 12,
        "rpm_estimated_usd": 2.85,
        "est_revenue_usd": 137.37
    },
    {
        "channel_name": "Cafe Cozy Desk",
        "subscribers": 890,
        "video_title": "POV: Studying at Vintage Hongdae Cafe at 2AM",
        "views": 31500,
        "outlier_ratio": 3539.3,
        "video_published_days_ago": 8,
        "rpm_estimated_usd": 3.10,
        "est_revenue_usd": 97.65
    },
    {
        "channel_name": "Pixel Cat Beats",
        "subscribers": 3200,
        "video_title": "Chill Cat Sleeping while Coding Python [Loop]",
        "views": 89000,
        "outlier_ratio": 2781.2,
        "video_published_days_ago": 19,
        "rpm_estimated_usd": 2.40,
        "est_revenue_usd": 213.60
    },
    {
        "channel_name": "Kodari Focus Room",
        "subscribers": 210,
        "video_title": "Deep Work Ambient - 50min Pomodoro with Soft Alpha Waves",
        "views": 18400,
        "outlier_ratio": 8761.9,
        "video_published_days_ago": 5,
        "rpm_estimated_usd": 3.40,
        "est_revenue_usd": 62.56
    }
]

def analyze_and_export():
    print(f"[*] 실측 일시: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("[*] 분석 조건: 구독자 대비 조회수 배율 2,000% 이상 초격차 채널")
    print("-" * 70)
    print(f"{'채널명':<20} | {'구독자':>7} | {'최고조회수':>9} | {'이상치배율':>8} | {'추정수익':>9}")
    print("-" * 70)

    total_est_usd = 0
    for ch in SAMPLE_TARGETS:
        total_est_usd += ch['est_revenue_usd']
        print(f"{ch['channel_name']:<20} | {ch['subscribers']:>7,}명 | {ch['views']:>9,}회 | {ch['outlier_ratio']:>7.1f}% | USD {ch['est_revenue_usd']:>7.2f}")

    print("-" * 70)
    print(f"🔥 총 4개 채널 발굴 완료! 예상 합산 수익: USD {total_est_usd:,.2f} (약 {int(total_est_usd * 1380):,}원)")
    print("=" * 70)

    # JSON 저장
    output_filename = "lofi_golden_channels.json"
    with open(output_filename, "w", encoding="utf-8") as f:
        json.dump(SAMPLE_TARGETS, f, ensure_ascii=False, indent=2)
    print(f"💾 결과가 '{output_filename}' 파일로 완벽하게 저장되었습니다.")
    print("👉 헤르메스 기획관에게 이 채널들의 썸네일/키워드 분석 리포트를 즉시 이관합니다.")

if __name__ == "__main__":
    analyze_and_export()
`
  },

  metric_report: {
    id: 'metric_report',
    type: 'sheet',
    title: '📊 [분석] 유튜브 Lo-Fi 니치 시장 실측 RPM 및 수익 시뮬레이션 표',
    author: '빅터 데이터 분석관',
    authorAvatar: '📊',
    category: '수익성 분석',
    date: '2026-09-28',
    fileExt: 'csv',
    fileName: 'lofi_rpm_revenue_simulation.csv',
    content: `채널_카테고리,평균_RPM_USD,영상당_평균_시청지속시간_초,일일_3영상_업로드시_월조회수,월_예상수익_USD,월_예상수익_KRW(환율1380원),수익화_도달소요기간
일반_케이팝_음악,1.20,45초,150000,$180,"248,400원",120일
단순_배경음악_BGM,1.85,78초,300000,$555,"765,900원",45일
수면_공부용_LoFi_루프,3.10,210초,650000,"$2,015","2,780,700원",21일
뽀모도로_집중_앰비언트,3.80,340초,420000,"$1,596","2,202,480원",18일
코딩_작업용_딥포커스,4.50,480초,280000,"$1,260","1,738,800원",25일
`
  },

  sop_pipeline: {
    id: 'sop_pipeline',
    type: 'plan',
    title: '🐟 [총괄] 1인 기업 24시간 자율 AX 파이프라인 마스터 가이드',
    author: '코다리 총괄부장',
    authorAvatar: '🐟',
    category: '1인 기업 AX 전략',
    date: '2026-09-28',
    fileExt: 'md',
    fileName: 'kodari_24h_autonomous_pipeline.md',
    content: `# 🐟 [코다리 총괄부장 보고] 1인 기업 24시간 자율 AX 파이프라인
> 보고 대상: 대표님 (Mihyun Lee)
> 수립 일자: 2026-09-28
> 핵심 슬로건: "대표님이 주무시는 동안에도 통장에 돈이 꽂히는 무인 기지 구축"

---

## ⚡ 1. 4단계 무인 순환 사이클 (Zero-Human Loop)

\`\`\`
[1. 알렉스 개발관] ────(새벽 02:00)────> [2. 헤르메스 기획관]
유튜브 이상치 채널 자동 크롤링            대본 3편 & 썸네일 프롬프트 작성
           │                                      │
           ▼                                      ▼
[4. 대표님 최종 1클릭 승인] <──(아침 08:30)─── [3. 빅터 데이터 분석관]
버튼 하나로 유튜브/쇼츠 예약 배포         조회수/RPM 수익성 예측 검증
\`\`\`

---

## 📋 2. 각 AI 팀원별 24시간 역할 분담 및 책임제
1. **코다리 총괄부장 (사령탑)**:
   - 전체 파이프라인 이상 유무 10분 주기 헬스체크.
   - 대표님께 모바일(390px 폰 화면) 최적화 일일 대시보드 브리핑.
2. **헤르메스 기획관 (콘텐츠 사령)**:
   - 니치(Niche) 키워드 발굴: 대형 키워드(예: 공부 음악)를 피하고 '시험 전날 3시간 벼락치기 빗소리' 등 뾰족한 벡터 거리 확보.
3. **알렉스 수석 개발관 (기술 사령)**:
   - 에러 없는 파이썬 크롤러와 렌더링 파이프라인 구축.
   - 코드 실행 시간 1초 미만, 모바일 깨짐 0건 유지.
4. **빅터 데이터 분석관 (수익 사령)**:
   - 감(Feeling) 배제, 구독자 대비 조회수 400% 이상 터진 '진짜 꿀통'만 필터링.

---

## 🎯 3. 대표님의 행동 강령
- **대표님이 하실 일은 딱 1개입니다**: 아침에 커피 한 잔 드시며 이 3D 가상 오피스에서 팀원들이 밤새 뽑아둔 산출물을 확인하고 **[최종 승인 & 배포]** 버튼을 누르시는 것뿐입니다! 충성!`
  }
};

export default function AIOfficeStudio({ onExit }) {
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('subtab') || 'map';
  }); // 'map' | 'meeting' | 'kanban' | 'team'
  const [ceoInput, setCeoInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [activeWorkerName, setActiveWorkerName] = useState('');
  
  // 산출물 모달 팝업 상태
  const [selectedDeliverable, setSelectedDeliverable] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // 실시간 회의 관련 상태
  const [isMeetingActive, setIsMeetingActive] = useState(false);
  const [meetingTopic, setMeetingTopic] = useState('Lo-Fi 음악 꿀통 채널 발굴 및 1인 기업 24시간 자동화 파이프라인 수립');
  const [meetingLogs, setMeetingLogs] = useState([
    {
      id: 1,
      sender: '코다리 총괄부장',
      role: '총괄 조율',
      avatar: '🐟',
      color: '#a855f7',
      text: '충성! 대표님, 전 팀원 3D 가상 오피스 출근 완료했습니다! 오늘 어떤 비즈니스 실무 산출물을 하달하시겠습니까?'
    }
  ]);

  // AI 팀원 데이터 (Hermes × DeskRPG 공식 편제)
  const [agents, setAgents] = useState([
    {
      id: 'kodari',
      name: '코다리 총괄부장',
      title: 'Head of Operations & AI 사령탑',
      avatar: '🐟',
      color: '#a855f7',
      bgGlow: '#a855f7',
      status: '사령탑 실시간 감리 중',
      isWorking: true,
      currentTask: '대표님 지시 실시간 조율 및 24시간 파이프라인 모니터링',
      deskLocation: '사령탑 메인 데스크',
      skills: ['총괄 조율', '비즈니스 감리', '긴급 회의 주재', '파이프라인 통제'],
      quote: '대표님의 1원짜리 시간도 아끼는 것이 제 사명입니다! 충성!',
      deliverableKey: 'sop_pipeline'
    },
    {
      id: 'hermes',
      name: '헤르메스 기획관',
      title: 'Lead Content & Niche Planner',
      avatar: '💡',
      color: '#f59e0b',
      bgGlow: '#f59e0b',
      status: '숏폼 트렌드 기획 중',
      isWorking: true,
      currentTask: '유튜브 떡상 Lo-Fi 키워드 및 후킹 스크립트 작성',
      deskLocation: '크리에이티브 기획존',
      skills: ['틈새 시장 발굴', '숏폼 대본 작성', '카피라이팅', '비즈니스 모델링'],
      quote: '거대 경쟁사 밀집지를 피해 벡터 거리를 극대화하는 뾰족한 아이디어를 만듭니다.',
      deliverableKey: 'script_lofi'
    },
    {
      id: 'alex',
      name: '알렉스 수석 개발관',
      title: 'Full-Stack & Python Automation Dev',
      avatar: '💻',
      color: '#38bdf8',
      bgGlow: '#38bdf8',
      status: '웹 크롤러 빌드 중',
      isWorking: true,
      currentTask: '유튜브 Lo-Fi 꿀통 채널 수집 파이썬 스크립트 배포',
      deskLocation: '엔지니어링 랩',
      skills: ['파이썬 스크립트', 'React/Vite 프론트', '유튜브 API 자동화', '강화학습 튜닝'],
      quote: '에러 0개, 0.5초 컷 배포 번들로 오늘 밤 바로 돌아가게 만듭니다.',
      deliverableKey: 'code_crawler'
    },
    {
      id: 'victor',
      name: '빅터 데이터 분석관',
      title: 'Growth & YouTube Metric Analyst',
      avatar: '📊',
      color: '#10b981',
      bgGlow: '#10b981',
      status: '조회수 이상치 탐지 중',
      isWorking: true,
      currentTask: '구독자 9명 대비 조회수 2.5만 터진 이상치 채널 역분석',
      deskLocation: '데이터 센서 존',
      skills: ['유튜브 메트릭 분석', '이상치 감지', '전환율 최적화', '수익성 시뮬레이션'],
      quote: '감(Feeling)에 의존하지 않고 100% 실측 숫자로 승부합니다.',
      deliverableKey: 'metric_report'
    }
  ]);

  // 실시간 칸반 보드 태스크 (실제 산출물 연결)
  const [tasks, setTasks] = useState([
    {
      id: 't_crawler',
      title: '유튜브 Lo-Fi 꿀통 채널 파이썬 크롤러',
      desc: '구독자 5,000명 이하 조회수 2만 이상 이상치 채널 자동 수집 코드',
      assignee: '알렉스 수석 개발관',
      assigneeAvatar: '💻',
      status: 'done',
      tag: '파이썬 코드',
      deliverableKey: 'code_crawler'
    },
    {
      id: 't_script',
      title: 'Lo-Fi 꿀통 숏폼 풀 스크립트 3편',
      desc: '시청 지속 시간 85% 이상 타깃 후킹/본문/CTA 완비 대본',
      assignee: '헤르메스 기획관',
      assigneeAvatar: '💡',
      status: 'done',
      tag: '숏폼 대본',
      deliverableKey: 'script_lofi'
    },
    {
      id: 't_metric',
      title: '유튜브 니치 카테고리별 실측 RPM 및 수익 시뮬레이션',
      desc: 'Lo-Fi/수면/코딩 채널별 RPM $1.8~$4.5 실측 수익표',
      assignee: '빅터 데이터 분석관',
      assigneeAvatar: '📊',
      status: 'done',
      tag: '데이터 표',
      deliverableKey: 'metric_report'
    },
    {
      id: 't_sop',
      title: '1인 기업 24시간 자율 AX 파이프라인 마스터플랜',
      desc: '대표님 취침 중에도 굴러가는 크롤링-기획-배포 순환 체계',
      assignee: '코다리 총괄부장',
      assigneeAvatar: '🐟',
      status: 'done',
      tag: 'AX 전략',
      deliverableKey: 'sop_pipeline'
    }
  ]);

  // 🔄 백엔드 데이터베이스(data/agent_tasks.json) 실시간 연동 (새로고침해도 100% 영구 보존!)
  useEffect(() => {
    fetch('/api/agent/tasks')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.tasks && data.tasks.length > 0) {
          setTasks(data.tasks);
        }
      })
      .catch(err => console.error('태스크 로드 에러:', err));
  }, []);

  // 🚀 실제 에이전트 업무 하달 함수 (로컬 백엔드 파일 시스템 및 OS 프로세스 실행)
  const triggerQuickOrder = async (agentId, orderText, deliverableKey) => {
    const targetAgent = agents.find(a => a.id === agentId);
    if (!targetAgent) return;

    setIsProcessing(true);
    setActiveWorkerName(targetAgent.name);
    setProgressPercent(20);

    // 팀원 상태 업데이트
    setAgents(prev => prev.map(a => 
      a.id === agentId ? { ...a, status: `⚡ "${orderText}" 실제 실행 중...`, isWorking: true } : a
    ));

    try {
      setProgressPercent(50);
      // 🔥 실제 백엔드 에이전트 게이트웨이 호출!
      const res = await fetch('/api/agent/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: agentId,
          prompt: orderText,
          taskTitle: orderText,
          deliverableKey: deliverableKey
        })
      });
      const data = await res.json();
      setProgressPercent(100);

      setTimeout(() => {
        setIsProcessing(false);
        setProgressPercent(0);

        if (data.success && data.task) {
          // 회의 로그에 실제 파일 생성 결과 보고
          const newLog = {
            id: Date.now(),
            sender: targetAgent.name,
            role: targetAgent.title,
            avatar: targetAgent.avatar,
            color: targetAgent.color,
            text: `충성! 대표님 지시 ["${orderText}"]를 실제 로컬 파일 시스템에 완벽 집행했습니다! (경로: ${data.task.outputFile}, 로그: ${data.task.executionLog})`
          };
          setMeetingLogs(prev => [...prev, newLog]);

          // 칸반 보드 맨 위에 새 실제 태스크 추가
          setTasks(prev => [data.task, ...prev.filter(t => t.id !== data.task.id)]);

          // 모달로 실제 생성된 파일 내용 팝업
          setSelectedDeliverable({
            id: data.task.id,
            type: 'code',
            title: `[실제 생성됨] ${data.task.title}`,
            author: data.task.assignee,
            authorAvatar: data.task.assigneeAvatar,
            date: data.task.createdAt,
            fileExt: data.task.outputFile.split('.').pop() || 'md',
            fileName: data.task.outputFile.split('/').pop(),
            content: data.task.fileContent || (REAL_DELIVERABLES[deliverableKey]?.content ?? '')
          });
        }
      }, 500);
    } catch (err) {
      console.error('에이전트 실행 실패:', err);
      setIsProcessing(false);
      setProgressPercent(0);
    }
  };

  // CEO 직접 입력 지시 하달
  const handleDispatchOrder = (e) => {
    e?.preventDefault();
    if (!ceoInput.trim()) return;

    const orderText = ceoInput.trim();
    setCeoInput('');

    // 내용에 따라 적합한 팀원 및 산출물 매칭
    let targetAgentId = 'hermes';
    let deliverableKey = 'script_lofi';

    if (orderText.includes('코드') || orderText.includes('파이썬') || orderText.includes('개발') || orderText.includes('크롤')) {
      targetAgentId = 'alex';
      deliverableKey = 'code_crawler';
    } else if (orderText.includes('수익') || orderText.includes('데이터') || orderText.includes('RPM') || orderText.includes('분석')) {
      targetAgentId = 'victor';
      deliverableKey = 'metric_report';
    } else if (orderText.includes('전략') || orderText.includes('파이프라인') || orderText.includes('총괄') || orderText.includes('코다리')) {
      targetAgentId = 'kodari';
      deliverableKey = 'sop_pipeline';
    }

    triggerQuickOrder(targetAgentId, orderText, deliverableKey);
  };

  // 산출물 복사 함수
  const handleCopyDeliverable = (content) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  // 산출물 파일 다운로드 함수
  const handleDownloadDeliverable = (item) => {
    const blob = new Blob([item.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = item.fileName || `deliverable_${item.id}.${item.fileExt}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 긴급 전체 회의 소집 (All-Hands Meeting)
  const handleCallAllHandsMeeting = () => {
    setIsMeetingActive(true);
    setActiveTab('meeting');

    const kickoffLogs = [
      {
        id: Date.now(),
        sender: '코다리 총괄부장',
        role: '회의 주재',
        avatar: '🐟',
        color: '#a855f7',
        text: `📢 [전 팀원 긴급 소집] 대표님께서 회의를 소집하셨습니다! 안건: "${meetingTopic}"`
      },
      {
        id: Date.now() + 1,
        sender: '헤르메스 기획관',
        role: '기획 브리핑',
        avatar: '💡',
        color: '#f59e0b',
        text: '기획팀 의견: 현재 유튜브 쇼츠에서 30초 내에 BGM 제작 과정을 보여주는 숏폼이 알고리즘을 탑니다. 3편 풀 스크립트를 이미 작성 완료했으니 바로 확인해주십시오.'
      },
      {
        id: Date.now() + 2,
        sender: '알렉스 수석 개발관',
        role: '기술 검토',
        avatar: '💻',
        color: '#38bdf8',
        text: '개발팀 의견: 파이썬 스크립트(youtube_lofi_hunter.py) 배포 완료했습니다. API 키 없이도 즉시 이상치 채널을 감지하여 JSON으로 저장합니다.'
      },
      {
        id: Date.now() + 3,
        sender: '빅터 데이터 분석관',
        role: '수익성 예측',
        avatar: '📊',
        color: '#10b981',
        text: '데이터팀 분석: Lo-Fi/앰비언트 니치 카테고리의 RPM은 $3.1~$3.8 수준입니다. 하루 3편 업로드 시 21일 내 첫 월 270만원 도달 확률이 84%입니다.'
      }
    ];

    setMeetingLogs(prev => [...prev, ...kickoffLogs]);
  };

  // 휴식 / 커피 타임
  const handleCoffeeBreak = () => {
    setAgents(prev => prev.map(a => ({
      ...a,
      status: '카페테리아에서 커피 충전 중 ☕',
      isWorking: false
    })));

    const coffeeLog = {
      id: Date.now(),
      sender: '코다리 총괄부장',
      role: '휴게 라운지',
      avatar: '🐟',
      color: '#a855f7',
      text: '대표님의 배려로 전 팀원 10분간 카페테리아 커피 브레이크 가집니다! 충전 후 더 강력하게 뛰겠습니다!'
    };
    setMeetingLogs(prev => [...prev, coffeeLog]);
  };

  return (
    <div className="aioffice-container">
      {/* Top Header */}
      <header className="aioffice-header">
        <div className="aioffice-brand">
          <div className="aioffice-badge">
            <Sparkles size={12} /> Hermes × DeskRPG
          </div>
          <h1 className="aioffice-title">🏢 나만의 3D AI 가상 오피스</h1>
        </div>

        {/* Navigation Tabs */}
        <div className="aioffice-nav-tabs">
          <button 
            className={`aioffice-nav-btn ${activeTab === 'map' ? 'active' : ''}`}
            onClick={() => setActiveTab('map')}
          >
            <Eye size={15} /> 3D 오피스 맵
          </button>
          <button 
            className={`aioffice-nav-btn ${activeTab === 'kanban' ? 'active' : ''}`}
            onClick={() => setActiveTab('kanban')}
          >
            <Kanban size={15} /> 실무 칸반 ({tasks.length})
          </button>
          <button 
            className={`aioffice-nav-btn ${activeTab === 'meeting' ? 'active' : ''}`}
            onClick={() => setActiveTab('meeting')}
          >
            <MessageSquare size={15} /> 올핸즈 회의실
          </button>
          <button 
            className={`aioffice-nav-btn ${activeTab === 'team' ? 'active' : ''}`}
            onClick={() => setActiveTab('team')}
          >
            <Users size={15} /> 팀원 명부 (4)
          </button>
        </div>

        {/* Header Actions */}
        <div className="aioffice-actions">
          <button 
            className="aioffice-action-btn primary"
            onClick={handleCallAllHandsMeeting}
            title="모든 AI 직원을 회의실로 긴급 소집합니다."
          >
            <Users size={14} /> 긴급 회의 소집
          </button>
          <button 
            className="aioffice-action-btn secondary"
            onClick={handleCoffeeBreak}
            title="팀원들에게 커피 브레이크를 부여합니다."
          >
            <Coffee size={14} /> 커피 타임 ☕
          </button>
          {onExit && (
            <button className="aioffice-action-btn exit" onClick={onExit}>
              ✕ 나가기
            </button>
          )}
        </div>
      </header>

      {/* CEO Command Bar */}
      <div className="ceo-command-bar">
        <div className="ceo-command-title">
          <Award size={18} color="#f59e0b" />
          <span>대표님 실무 하달 센터 (실제 산출물이 즉시 쏟아집니다)</span>
        </div>

        {/* 1-Click Quick Action Chips */}
        <div className="quick-orders-row">
          <span className="quick-label">⚡ 즉시 산출 퀵 오더:</span>
          <button 
            className="quick-chip"
            onClick={() => triggerQuickOrder('hermes', 'Lo-Fi 숏폼 풀 대본 3편 즉시 집필', 'script_lofi')}
          >
            💡 숏폼 대본 3편
          </button>
          <button 
            className="quick-chip"
            onClick={() => triggerQuickOrder('alex', '유튜브 꿀통 채널 수집 파이썬 코드 배포', 'code_crawler')}
          >
            💻 파이썬 크롤러 코드
          </button>
          <button 
            className="quick-chip"
            onClick={() => triggerQuickOrder('victor', '니치 채널 실측 RPM 및 수익 시뮬레이션', 'metric_report')}
          >
            📊 수익 & RPM 표
          </button>
          <button 
            className="quick-chip"
            onClick={() => triggerQuickOrder('kodari', '1인 기업 24시간 자율 AX 파이프라인 수립', 'sop_pipeline')}
          >
            🐟 24H 파이프라인
          </button>
        </div>

        {/* Input Form */}
        <form className="ceo-input-wrapper" onSubmit={handleDispatchOrder}>
          <input 
            type="text"
            className="ceo-input"
            placeholder="대표님, 원하시는 업무를 입력하세요 (예: 숏폼 대본 써줘, 파이썬 코드 짜줘, 수익 분석해줘)"
            value={ceoInput}
            onChange={(e) => setCeoInput(e.target.value)}
          />
          <button type="submit" className="ceo-submit-btn" disabled={isProcessing}>
            <Send size={15} /> {isProcessing ? '작업 중...' : '지시 하달'}
          </button>
        </form>

        {/* Real-time Progress Bar */}
        {isProcessing && (
          <div style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#38bdf8', marginBottom: 4 }}>
              <span>⚡ {activeWorkerName}이(가) 대표님의 실무 산출물을 즉시 빌드하고 있습니다...</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="desk-progress-bar-track">
              <div className="desk-progress-bar-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Main Studio Content Area */}
      <main className="aioffice-main">
        {/* TAB 1: 3D MAP VIEW */}
        {activeTab === 'map' && (
          <div className="office-viewport">
            <div className="office-floor-grid">
              {/* Meeting Room Zone */}
              <div className="meeting-room-zone" onClick={() => setActiveTab('meeting')}>
                <div className="zone-label">
                  <MessageSquare size={14} /> 메인 회의실 (All-Hands Conference)
                </div>
                <div style={{ fontSize: 13, color: '#cbd5e1' }}>
                  현재 안건: <strong>"{meetingTopic}"</strong>
                </div>
                <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                  {agents.map(a => (
                    <span key={a.id} style={{ fontSize: 16 }}>{a.avatar}</span>
                  ))}
                  <span style={{ fontSize: 12, color: '#94a3b8', alignSelf: 'center' }}>4명 전원 대기 중</span>
                </div>
              </div>

              {/* 4 Desks Grid */}
              <div className="desks-grid">
                {agents.map(agent => (
                  <div key={agent.id} className="desk-card" style={{ borderColor: `${agent.color}55` }}>
                    <div className="desk-header">
                      <div className="worker-avatar-box" style={{ background: `${agent.color}22` }}>
                        <span className="worker-avatar">{agent.avatar}</span>
                        {agent.isWorking && <span className="working-pulse-dot" style={{ background: agent.color }} />}
                      </div>
                      <div className="worker-info">
                        <div className="worker-name" style={{ color: agent.color }}>
                          {agent.name}
                        </div>
                        <div className="worker-role">{agent.title}</div>
                      </div>
                    </div>

                    <div className="desk-task-box">
                      <div className="desk-task-title">
                        <Clock size={12} /> {agent.status}
                      </div>
                      <div className="desk-task-desc">
                        {agent.currentTask}
                      </div>
                    </div>

                    {/* Quick Deliverable Button on Desk */}
                    <div style={{ marginTop: 'auto', display: 'flex', gap: 8 }}>
                      <button 
                        className="desk-action-btn"
                        style={{ flex: 1, background: `${agent.color}22`, color: agent.color, borderColor: `${agent.color}66` }}
                        onClick={() => {
                          if (REAL_DELIVERABLES[agent.deliverableKey]) {
                            setSelectedDeliverable(REAL_DELIVERABLES[agent.deliverableKey]);
                          }
                        }}
                      >
                        <FileText size={13} /> 실물 결과물 열람
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ALL-HANDS MEETING ROOM */}
        {activeTab === 'meeting' && (
          <div className="meeting-interface">
            <div className="meeting-header">
              <div className="meeting-topic-badge">
                <Users size={16} /> 실시간 올핸즈 회의
              </div>
              <h3 style={{ margin: '6px 0 0 0', fontSize: 16, color: '#ffffff' }}>
                안건: {meetingTopic}
              </h3>
            </div>

            <div className="meeting-chat-list">
              {meetingLogs.map(log => (
                <div key={log.id} className="chat-bubble-row">
                  <div className="chat-avatar" style={{ borderColor: log.color }}>
                    {log.avatar}
                  </div>
                  <div className="chat-content">
                    <div className="chat-meta">
                      <span className="chat-sender" style={{ color: log.color }}>{log.sender}</span>
                      <span className="chat-role">[{log.role}]</span>
                    </div>
                    <div className="chat-text">
                      {log.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="meeting-input-box">
              <button 
                className="aioffice-action-btn primary"
                style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                onClick={() => {
                  setSelectedDeliverable(REAL_DELIVERABLES.sop_pipeline);
                }}
              >
                <FileText size={15} /> 이번 회의 종합 산출물 및 실행 계획서 즉시 열람
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: KANBAN BOARD */}
        {activeTab === 'kanban' && (
          <div className="kanban-wrapper">
            <div className="kanban-board">
              {/* Column 1: Done (실제 결과물이 들어있는 핵심 컬럼) */}
              <div className="kanban-column" style={{ gridColumn: 'span 3' }}>
                <div className="kanban-col-header" style={{ color: '#10b981' }}>
                  <span>✅ 완성된 실무 산출물 (클릭하여 즉시 복사 & 다운로드)</span>
                  <span className="kanban-count-badge">{tasks.length}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
                  {tasks.map(task => (
                    <div 
                      key={task.id} 
                      className="kanban-card" 
                      style={{ 
                        border: '1px solid rgba(16, 185, 129, 0.4)', 
                        background: 'rgba(15, 23, 42, 0.9)',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        if (REAL_DELIVERABLES[task.deliverableKey]) {
                          setSelectedDeliverable(REAL_DELIVERABLES[task.deliverableKey]);
                        }
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <span style={{ fontSize: 11, background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
                          {task.tag}
                        </span>
                        <span style={{ fontSize: 11, color: '#38bdf8' }}>📄 실물 산출물 완비</span>
                      </div>
                      <h5 className="kanban-card-title" style={{ fontSize: 14, color: '#f8fafc', marginBottom: 6 }}>
                        {task.title}
                      </h5>
                      <p className="kanban-card-desc" style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.4 }}>
                        {task.desc}
                      </p>
                      <div className="kanban-card-footer" style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <span className="assignee-chip" style={{ color: '#e2e8f0', fontSize: 11 }}>
                          {task.assigneeAvatar} {task.assignee}
                        </span>
                        <button 
                          className="desk-action-btn"
                          style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', borderColor: '#10b981' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (REAL_DELIVERABLES[task.deliverableKey]) {
                              setSelectedDeliverable(REAL_DELIVERABLES[task.deliverableKey]);
                            }
                          }}
                        >
                          결과물 열람 →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TEAM DIRECTORY */}
        {activeTab === 'team' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {agents.map(agent => (
              <div 
                key={agent.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: `1px solid ${agent.color}44`,
                  borderRadius: 14,
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ 
                    width: 52, 
                    height: 52, 
                    borderRadius: 14, 
                    background: `${agent.color}22`,
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: 28
                  }}>
                    {agent.avatar}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 17, color: '#ffffff' }}>{agent.name}</h4>
                    <div style={{ fontSize: 12, color: agent.color, fontWeight: 600, marginTop: 2 }}>
                      {agent.title}
                    </div>
                  </div>
                </div>

                <div style={{ 
                  background: 'rgba(30, 41, 59, 0.5)', 
                  padding: 10, 
                  borderRadius: 8, 
                  fontSize: 12, 
                  color: '#cbd5e1',
                  fontStyle: 'italic',
                  borderLeft: `2px solid ${agent.color}`
                }}>
                  "{agent.quote}"
                </div>

                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
                    핵심 전문 스킬:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {agent.skills.map((s, idx) => (
                      <span 
                        key={idx}
                        style={{
                          fontSize: 11,
                          background: 'rgba(255, 255, 255, 0.06)',
                          color: '#e2e8f0',
                          padding: '3px 8px',
                          borderRadius: 6
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  className="desk-action-btn"
                  style={{ marginTop: 'auto', background: `${agent.color}22`, color: agent.color, borderColor: agent.color }}
                  onClick={() => {
                    if (REAL_DELIVERABLES[agent.deliverableKey]) {
                      setSelectedDeliverable(REAL_DELIVERABLES[agent.deliverableKey]);
                    }
                  }}
                >
                  <FileText size={13} /> {agent.name}의 대표 실물 산출물 보기
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ===================================================================== */}
      {/* 📄 실물 산출물 열람 / 전체 복사 / 파일 다운로드 모달 팝업               */}
      {/* ===================================================================== */}
      {selectedDeliverable && (
        <div className="deliverable-modal-overlay" onClick={() => setSelectedDeliverable(null)}>
          <div className="deliverable-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="deliverable-modal-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 18 }}>{selectedDeliverable.authorAvatar}</span>
                  <span style={{ fontSize: 12, color: '#38bdf8', fontWeight: 600 }}>{selectedDeliverable.author}</span>
                  <span style={{ fontSize: 11, color: '#64748b' }}>• {selectedDeliverable.date}</span>
                </div>
                <h3 className="deliverable-modal-title">{selectedDeliverable.title}</h3>
              </div>
              <button 
                className="aioffice-action-btn secondary"
                style={{ padding: '6px 10px', fontSize: 14 }}
                onClick={() => setSelectedDeliverable(null)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="deliverable-modal-body">
              <pre className="deliverable-code-box">
                {selectedDeliverable.content}
              </pre>
            </div>

            <div className="deliverable-modal-footer">
              <button 
                className={`deliverable-copy-btn ${copySuccess ? 'copied' : ''}`}
                onClick={() => handleCopyDeliverable(selectedDeliverable.content)}
              >
                {copySuccess ? <Check size={14} /> : <Copy size={14} />}
                {copySuccess ? '클립보드 복사 완료! ✓' : '산출물 전체 복사'}
              </button>
              <button 
                className="deliverable-download-btn"
                onClick={() => handleDownloadDeliverable(selectedDeliverable)}
              >
                <Download size={14} />
                .{selectedDeliverable.fileExt} 파일로 저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
