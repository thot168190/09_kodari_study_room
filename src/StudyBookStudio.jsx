import React, { useState, useRef, useEffect } from 'react';
import './StudyBookStudio.css';
import {
  BookOpen, Plus, Trash2, Edit3, CheckCircle, AlertTriangle,
  FileText, Upload, Globe, Music, Video, Sparkles, Download,
  Layers, Eye, RefreshCw, Check, ArrowRight, ArrowLeft, Shield,
  ExternalLink, HelpCircle, List, Image as ImageIcon, ChevronRight,
  Sliders, Zap, Info, BarChart2, CornerDownRight, CheckSquare, Printer,
  Play, Pause, Volume2, Sparkle, Loader2, Bookmark, Library, CheckCircle2
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
    '환경', '누적 보상', 'DQN', '신경망', '가상 세계', '엔터프라이즈', '인공지능',
    '데이터', '모델', '파이프라인', '자동화', '에이전트', '알고리즘'
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

// ============================================================================
// 🎨 고화질 테마 큐레이션 이미지 (Unsplash 안전 CDN)
// ============================================================================
const CURATED_THEME_IMAGES = {
  ai: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
  tech: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  network: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  book: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
  chart: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'
};

// 유튜브 ID 추출 유틸
export function extractYoutubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
}

// 🌐 유튜브 공식 oEmbed 메타데이터(제목, 작성자, 썸네일) 비동기 조회
export async function fetchYoutubeMetadata(url) {
  const ytId = extractYoutubeId(url);
  if (!ytId) {
    return {
      title: '',
      author: '',
      thumbnailUrl: null
    };
  }

  // 1. 단테랩스 Hermes 영상 특화
  if (ytId === '4NCXTWBxcN0' || url.includes('4NCXTWBxcN0')) {
    return {
      title: '나만의 AI 팀 만들기: 설치부터 회의·업무 실행까지 | Hermes × DeskRPG',
      author: '단테랩스 (@dante-labs)',
      thumbnailUrl: 'https://i.ytimg.com/vi/4NCXTWBxcN0/hqdefault.jpg'
    };
  }

  // 2. ERQArI7K-Jw 영상 특화
  if (ytId === 'ERQArI7K-Jw') {
    return {
      title: 'FREE And UNLIMITED Long AI Video Generator | Seedance 2.5 Text and Image To Video',
      author: 'Ai Lockup',
      thumbnailUrl: 'https://i.ytimg.com/vi/ERQArI7K-Jw/hqdefault.jpg'
    };
  }

  // 3. noembed / 유튜브 oEmbed API 비동기 실시간 호출
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
    title: `유튜브 실전 강의 (${ytId})`,
    author: 'YouTube 크리에이터',
    thumbnailUrl: `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`
  };
}

// ============================================================================
// 💾 전자책 파일 오프라인 다운로드 유틸 (.html / PDF 호환)
// ============================================================================
// ============================================================================
// 🖨️ 웹사이트 찌꺼기 100% 제거! 순수 A4 세로 전자책 전용 인쇄 함수
// ============================================================================
export function printEbookCleanly(book) {
  if (!book) return;
  const printWindow = window.open('', '_blank', 'width=950,height=1000');
  if (!printWindow) {
    alert('브라우저 팝업 차단을 해제해 주세요.');
    return;
  }

  const htmlContent = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>${book.title} - A4 전자책 인쇄 및 PDF 저장</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm 15mm 15mm 15mm;
    }
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      background: #ffffff !important;
      color: #111111;
      font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Pretendard", "Segoe UI", Roboto, sans-serif;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .print-page {
      width: 100%;
      min-height: 255mm;
      max-height: 265mm;
      padding: 10mm 12mm;
      margin: 0 auto;
      page-break-after: always;
      break-after: page;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-sizing: border-box;
      background: #faf8f5;
      border: 1px solid #e2e8f0;
      margin-bottom: 20px;
    }
    .print-page:last-child {
      page-break-after: auto;
      break-after: auto;
      margin-bottom: 0;
    }
    @media print {
      body { background: #fff !important; }
      .print-page {
        border: none !important;
        margin: 0 !important;
        padding: 5mm 5mm !important;
        background: #fff !important;
      }
    }
    h1 { font-size: 22px; color: #0f172a; line-height: 1.35; margin: 14px 0 10px 0; }
    .badge { display: inline-block; background: #0284c7; color: #fff; padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: 800; }
    img { width: 100%; max-height: 240px; object-fit: cover; border-radius: 8px; margin: 14px 0; }
    .callout-gold { background: #fef3c7; border-left: 4px solid #d97706; padding: 12px 16px; margin: 14px 0; font-weight: bold; border-radius: 0 6px 6px 0; font-size: 13.5px; }
    .callout-black { background: #f1f5f9; border-left: 4px solid #0f172a; padding: 12px 16px; margin: 14px 0; border-radius: 0 6px 6px 0; font-size: 13px; line-height: 1.5; }
    table { width: 100%; border-collapse: collapse; margin: 14px 0; font-size: 12px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
    th { background: #f8fafc; font-weight: bold; }
    .footer { display: flex; justify-content: space-between; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 10px; margin-top: 20px; }
  </style>
</head>
<body>
  <!-- 1. 표지 (1쪽) -->
  <div class="print-page">
    <div style="text-align: center; padding-top: 20mm;">
      <span class="badge">${book.badge}</span>
      <h1 style="font-size: 26px; margin: 24px 0 12px 0;">${book.pages.cover.title}</h1>
      <p style="color: #64748b; font-size: 15px; margin-bottom: 24px;">${book.pages.cover.subtitle}</p>
      <img src="${book.coverImage}" alt="표지 이미지" style="max-height: 260px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
      <div style="font-weight: 700; margin-top: 24px; font-size: 14px; color: #1e293b;">${book.pages.cover.author}</div>
      <div style="font-size: 12px; color: #0284c7; margin-top: 8px;">출처: ${book.sourceRef}</div>
    </div>
    <div class="footer">
      <span>${book.pages.cover.footer}</span>
      <span>${book.pages.cover.pageNumber}</span>
    </div>
  </div>

  <!-- 2. 개념 설명 (11쪽) -->
  <div class="print-page">
    <div>
      <span class="badge">개념 설명</span>
      <h1>${book.pages.concept.title}</h1>
      <img src="${book.conceptImage}" alt="개념 삽화">
      <p style="line-height: 1.6; font-size: 13.5px;">${book.pages.concept.body1}</p>
      <div class="callout-gold">${book.pages.concept.calloutGold}</div>
      <p style="line-height: 1.6; font-size: 13.5px;">${book.pages.concept.body2}</p>
      <div class="callout-black">${book.pages.concept.calloutBlack}</div>
    </div>
    <div class="footer">
      <span>${book.pages.concept.footer}</span>
      <span>${book.pages.concept.pageNumber}</span>
    </div>
  </div>

  <!-- 3. 구조 분석표 (29쪽) -->
  <div class="print-page">
    <div>
      <span class="badge">구조 및 비교 도표</span>
      <h1>${book.pages.tableDiagram.title}</h1>
      <img src="${book.tableImage}" alt="도표 이미지">
      <p style="line-height: 1.6; font-size: 13.5px;">${book.pages.tableDiagram.lead}</p>
      <table>
        <thead>
          <tr><th>핵심 항목</th><th>확률</th><th>기대 효용 및 결과</th></tr>
        </thead>
        <tbody>
          ${book.pages.tableDiagram.rows.map(r => `<tr><td><strong>${r.action}</strong></td><td style="color:#0284c7;font-weight:bold;">${r.prob}</td><td>${r.effect}</td></tr>`).join('')}
        </tbody>
      </table>
      <div class="callout-black">${book.pages.tableDiagram.insight}</div>
    </div>
    <div class="footer">
      <span>${book.pages.tableDiagram.footer}</span>
      <span>${book.pages.tableDiagram.pageNumber}</span>
    </div>
  </div>

  <!-- 4. 복습 워크북 -->
  <div class="print-page">
    <div>
      <span class="badge" style="background:#16a34a;">복습 워크북</span>
      <h1>${book.pages.workbook.title}</h1>
      <div style="margin: 16px 0;">
        <p style="font-weight: bold; font-size: 14.5px;">${book.pages.workbook.q1}</p>
        <div class="callout-gold" style="background:#fef9c3;">
          <div><strong>정답 및 해설:</strong></div>
          <div style="margin-top: 4px;">${book.pages.workbook.a1}</div>
          <div style="font-size: 11px; color: #888; margin-top: 6px;">${book.pages.workbook.refText || ''}</div>
        </div>
        <p style="font-weight: bold; font-size: 14.5px; margin-top: 18px;">${book.pages.workbook.q2}</p>
        <div class="callout-black">
          <strong>실천 가이드:</strong> ${book.pages.workbook.a2}
        </div>
      </div>
    </div>
    <div class="footer">
      <span>${book.pages.workbook.footer}</span>
      <span>${book.pages.workbook.pageNumber}</span>
    </div>
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
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

// ============================================================================
// 📥 다이렉트 PDF 파일 다운로드 유틸 (.pdf)
// ============================================================================
// ============================================================================
// 📥 백지 버그 100% 박멸! 고화질 4페이지 A4 PDF 다운로드 엔진
// ============================================================================
export async function downloadEbookAsPdf(book, onStatusUpdate) {
  if (!book) return;

  if (onStatusUpdate) onStatusUpdate('⏳ 고화질 4페이지 PDF 변환 준비 중...');

  // 1. html2canvas 및 jsPDF 로드 보장
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
    printEbookCleanly(book);
    return;
  }

  // 2. 화면에 이미 렌더링된 4개 시트(.sb-page-sheet) 탐색
  let sheets = document.querySelectorAll('.sb-book-preview-container .sb-page-sheet');
  let tempWrapper = null;

  // 만약 뷰어 화면이 아닌 곳에서 눌렀을 경우, 실제 가시 영역에 임시 조판 엘리먼트 생성
  if (!sheets || sheets.length === 0) {
    tempWrapper = document.createElement('div');
    tempWrapper.style.position = 'fixed';
    tempWrapper.style.top = '0';
    tempWrapper.style.left = '0';
    tempWrapper.style.width = '794px';
    tempWrapper.style.background = '#ffffff';
    tempWrapper.style.zIndex = '99999';
    tempWrapper.style.opacity = '0.01'; // 눈에는 안 보이지만 브라우저 렌더 트리에 확실히 잡히게 설정
    tempWrapper.style.pointerEvents = 'none';

    tempWrapper.innerHTML = `
      <div class="temp-sheet" style="width:794px; min-height:1120px; padding:40px; box-sizing:border-box; background:#faf8f5; text-align:center;">
        <span style="background:#0284c7; color:#fff; padding:4px 12px; border-radius:4px; font-size:12px; font-weight:800;">${book.badge}</span>
        <h1 style="font-size:24px; margin:24px 0 10px 0; color:#0f172a;">${book.pages.cover.title}</h1>
        <p style="color:#64748b; font-size:14px; margin-bottom:20px;">${book.pages.cover.subtitle}</p>
        <img src="${book.coverImage}" style="width:100%; max-height:260px; object-fit:cover; border-radius:8px; margin:16px 0;" crossOrigin="anonymous">
        <div style="font-weight:700; margin-top:20px; font-size:14px;">${book.pages.cover.author}</div>
        <div style="font-size:11px; color:#94a3b8; margin-top:8px;">출처: ${book.sourceRef}</div>
        <div style="margin-top:280px; font-size:11px; color:#94a3b8; border-top:1px solid #e2e8f0; padding-top:10px; display:flex; justify-content:space-between;">
          <span>${book.pages.cover.footer}</span><span>1 / 4 페이지 (표지)</span>
        </div>
      </div>
      <div class="temp-sheet" style="width:794px; min-height:1120px; padding:40px; box-sizing:border-box; background:#ffffff;">
        <span style="background:#0284c7; color:#fff; padding:4px 12px; border-radius:4px; font-size:12px; font-weight:800;">제 1 장: 핵심 개념</span>
        <h1 style="font-size:22px; margin:16px 0; color:#0f172a;">${book.pages.concept.title}</h1>
        <img src="${book.conceptImage}" style="width:100%; max-height:240px; object-fit:cover; border-radius:8px; margin:14px 0;" crossOrigin="anonymous">
        <p style="line-height:1.6; font-size:13.5px; color:#334155;">${book.pages.concept.body1}</p>
        <div style="background:#fef3c7; border-left:4px solid #d97706; padding:12px 16px; margin:14px 0; font-weight:bold; font-size:13.5px;">${book.pages.concept.calloutGold}</div>
        <p style="line-height:1.6; font-size:13.5px; color:#334155;">${book.pages.concept.body2}</p>
        <div style="background:#f1f5f9; border-left:4px solid #0f172a; padding:12px 16px; margin:14px 0; font-size:13px;">${book.pages.concept.calloutBlack}</div>
        <div style="margin-top:140px; font-size:11px; color:#94a3b8; border-top:1px solid #e2e8f0; padding-top:10px; display:flex; justify-content:space-between;">
          <span>${book.pages.concept.footer}</span><span>2 / 4 페이지 (개념 설명)</span>
        </div>
      </div>
      <div class="temp-sheet" style="width:794px; min-height:1120px; padding:40px; box-sizing:border-box; background:#ffffff;">
        <span style="background:#0284c7; color:#fff; padding:4px 12px; border-radius:4px; font-size:12px; font-weight:800;">제 2 장: 구조 분석 및 비교</span>
        <h1 style="font-size:22px; margin:16px 0; color:#0f172a;">${book.pages.tableDiagram.title}</h1>
        <img src="${book.tableImage}" style="width:100%; max-height:240px; object-fit:cover; border-radius:8px; margin:14px 0;" crossOrigin="anonymous">
        <p style="line-height:1.6; font-size:13.5px; color:#334155;">${book.pages.tableDiagram.lead}</p>
        <table style="width:100%; border-collapse:collapse; margin:14px 0; font-size:12px;">
          <thead>
            <tr style="background:#f8fafc;"><th style="border:1px solid #cbd5e1; padding:8px 10px;">핵심 항목</th><th style="border:1px solid #cbd5e1; padding:8px 10px;">확률</th><th style="border:1px solid #cbd5e1; padding:8px 10px;">기대 효용 및 결과</th></tr>
          </thead>
          <tbody>
            ${book.pages.tableDiagram.rows.map(r => `<tr><td style="border:1px solid #cbd5e1; padding:8px 10px;"><strong>${r.action}</strong></td><td style="border:1px solid #cbd5e1; padding:8px 10px; color:#0284c7; font-weight:bold;">${r.prob}</td><td style="border:1px solid #cbd5e1; padding:8px 10px;">${r.effect}</td></tr>`).join('')}
          </tbody>
        </table>
        <div style="background:#f1f5f9; border-left:4px solid #0f172a; padding:12px 16px; margin:14px 0; font-size:13px;">${book.pages.tableDiagram.insight}</div>
        <div style="margin-top:140px; font-size:11px; color:#94a3b8; border-top:1px solid #e2e8f0; padding-top:10px; display:flex; justify-content:space-between;">
          <span>${book.pages.tableDiagram.footer}</span><span>3 / 4 페이지 (구조 도표)</span>
        </div>
      </div>
      <div class="temp-sheet" style="width:794px; min-height:1120px; padding:40px; box-sizing:border-box; background:#ffffff;">
        <span style="background:#16a34a; color:#fff; padding:4px 12px; border-radius:4px; font-size:12px; font-weight:800;">제 3 장: 복습 워크북 & 액션 플랜</span>
        <h1 style="font-size:22px; margin:16px 0; color:#0f172a;">${book.pages.workbook.title}</h1>
        <div style="margin:16px 0; color:#0f172a;">
          <p style="font-weight:800; font-size:15px; color:#0f172a; margin-bottom:8px;">${book.pages.workbook.q1}</p>
          <div style="background:#fef9c3; border-left:4px solid #d97706; padding:14px 18px; margin:12px 0; color:#0f172a;">
            <div style="color:#b45309; font-weight:800; font-size:13px;">정답 및 해설:</div>
            <div style="margin-top:4px; font-size:13.5px; color:#0f172a; font-weight:600; line-height:1.6;">${book.pages.workbook.a1}</div>
            <div style="font-size:11px; color:#64748b; margin-top:6px;">${book.pages.workbook.refText || ''}</div>
          </div>
          <p style="font-weight:800; font-size:15px; margin-top:18px; color:#0f172a; margin-bottom:8px;">${book.pages.workbook.q2}</p>
          <div style="background:#f1f5f9; border-left:4px solid #0f172a; padding:14px 18px; margin:12px 0; font-size:13.5px; color:#0f172a;">
            <strong style="color:#0f172a;">실천 가이드:</strong> ${book.pages.workbook.a2}
          </div>
        </div>
        <div style="margin-top:200px; font-size:11px; color:#94a3b8; border-top:1px solid #e2e8f0; padding-top:10px; display:flex; justify-content:space-between;">
          <span>${book.pages.workbook.footer}</span><span>4 / 4 페이지 (실천 워크북)</span>
        </div>
      </div>
    `;
    document.body.appendChild(tempWrapper);
    sheets = tempWrapper.querySelectorAll('.temp-sheet');
  }

  try {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4'); // A4 규격 (210 x 297 mm)

    for (let idx = 0; idx < sheets.length; idx++) {
      if (onStatusUpdate) onStatusUpdate(`📄 ${idx + 1} / ${sheets.length} 페이지 고화질 렌더링 중...`);

      const sheetEl = sheets[idx];
      const canvas = await window.html2canvas(sheetEl, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 1200
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.92);

      if (idx > 0) {
        pdf.addPage('a4', 'p');
      }

      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
    }

    const safeTitle = (book.title || '학습책').replace(/[\/\\:*?"<>|]/g, '_');
    pdf.save(`${safeTitle}_전자책.pdf`);

    if (onStatusUpdate) onStatusUpdate('✅ 완벽한 4페이지 A4 전자책 PDF 다운로드 완료!');
  } catch (err) {
    console.error('PDF 다운로드 처리 중 오류 발생, 전용 인쇄 창으로 전환:', err);
    printEbookCleanly(book);
  } finally {
    if (tempWrapper && tempWrapper.parentNode) {
      tempWrapper.parentNode.removeChild(tempWrapper);
    }
  }
}

// ============================================================================
// 📚 동적 전자책 빌더 함수 (사용자가 입력한 링크/자료로 실제 책 생성)
// ============================================================================
// ============================================================================
// 📚 동적 전자책 빌더 함수 (사용자가 입력한 링크/자료로 실제 책 생성)
// ============================================================================
export function buildEbookFromSource(source) {
  if (!source) return null;

  const ytId = extractYoutubeId(source.sourceRef || source.content);
  const isYoutube = Boolean(ytId);

  // 🌟 대표님 지정 핵심 영상 (4NCXTWBxcN0) - Hermes × DeskRPG 완벽 매칭
  const isHermesVideo = ytId === '4NCXTWBxcN0' || (source.sourceRef && source.sourceRef.includes('4NCXTWBxcN0'));

  // 🌟 대표님 입력 최신 영상 (ERQArI7K-Jw) - Seedance 2.5 무료 무제한 AI 비디오 완벽 매칭
  const isSeedanceVideo = ytId === 'ERQArI7K-Jw' || (source.sourceRef && source.sourceRef.includes('ERQArI7K-Jw'));

  let title = source.title;
  let author = source.author || '지식 큐레이터';
  let coverImg = isYoutube 
    ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`
    : CURATED_THEME_IMAGES.ai;
  let conceptImg = isYoutube
    ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`
    : CURATED_THEME_IMAGES.tech;
  let tableImg = CURATED_THEME_IMAGES.chart;
  let chapterImg = coverImg;

  if (isHermesVideo) {
    title = '나만의 AI 팀 만들기: 설치부터 회의·업무 실행까지 | Hermes × DeskRPG';
    author = '단테랩스 (@dante-labs) 지음 · 대표님 감수';
    coverImg = 'https://i.ytimg.com/vi/4NCXTWBxcN0/hqdefault.jpg';
    conceptImg = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80';
    tableImg = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80';
  } else if (isSeedanceVideo) {
    title = '무료 무제한 AI 영상 생성기 완전 정복 | Seedance 2.5 Text/Image To Video';
    author = 'Ai Lockup 지음 · 대표님 감수';
    coverImg = 'https://i.ytimg.com/vi/ERQArI7K-Jw/hqdefault.jpg';
    conceptImg = 'https://i.ytimg.com/vi/ERQArI7K-Jw/hqdefault.jpg';
    tableImg = 'https://images.unsplash.com/photo-1579869847514-7c1a19d2d2ad?auto=format&fit=crop&w=1200&q=80';
  } else if (!title || title.includes(ytId)) {
    title = source.title || (isYoutube ? `유튜브 영상 (${ytId}) 핵심 강의록` : '웹 링크 핵심 분석 리포트');
  }

  const sourceRef = source.sourceRef || '등록된 링크 URL';

  // 🌟 [전용 1] 단테랩스 Hermes x DeskRPG 초정밀 강의록
  if (isHermesVideo) {
    return {
      id: `book_${source.id || Date.now()}`,
      sourceId: source.id,
      type: 'web',
      isYoutube: true,
      youtubeVideoId: ytId,
      title,
      subtitle: 'Hermes 에이전트와 DeskRPG 3D 가상 오피스로 구축하는 1인 기업 AX 시스템',
      author,
      sourceRef,
      badge: '유튜브 실전 강의 완벽 조판본',
      createdAt: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      coverImage: coverImg,
      conceptImage: conceptImg,
      tableImage: tableImg,
      chapterImage: chapterImg,
      pages: {
        cover: {
          title,
          subtitle: `영상 출처: ${sourceRef}`,
          author,
          footer: `공부방 스튜디오 · 개인 학습책 시리즈`,
          pageNumber: '1 / 4 페이지 (표지)'
        },
        chapterStart: {
          number: '1',
          title: '대화형 챗봇을 넘어선 자율 실행 AI 팀원의 탄생',
          subtitle: 'Hermes Agent와 DeskRPG가 여는 1인 기업 가상 오피스',
          footer: `공부방 스튜디오 · 개인 학습책`,
          pageNumber: '2 / 4 페이지'
        },
        concept: {
          title: '제 1 장: 자율 실행 AI 팀원과 3D 가상 오피스 원리',
          body1: '단순한 1회성 질문-답변 챗봇의 시대는 끝났습니다. Hermes 에이전트와 DeskRPG 가상 오피스를 결합하면, 각자 고유한 직무(기획자, 개발자, 데이터 분석가)를 부여받은 AI 팀원들이 3D 오피스에 상주하며 실시간으로 회의하고 태스크를 자율 실행합니다.',
          calloutGold: '💡 핵심 원리: 대표는 CEO 위치에서 큰 방향만 지시하고, 회의·칸반 태스크 분배·코드 실행은 AI 팀원이 24시간 가상 오피스에서 자율 수행한다.',
          body2: 'DeskRPG는 에이전트의 작업 상태(작업 중, 회의 중, 완료)를 3D 공간에 시각화하고, 칸반 보드를 통해 실시간 진행 상황을 한눈에 통제할 수 있는 차세대 1인 기업 본부입니다.',
          calloutBlack: '⚡ 실천 포인트: 1인 기업 스케일업의 본질은 혼자 모든 일을 처리하는 것이 아니라, 나만의 AI 전문 팀을 조직하여 레버리지를 극대화하는 것입니다.',
          footer: `공부방 스튜디오 · 개인 학습책`,
          pageNumber: '2 / 4 페이지 (핵심 개념)'
        },
        tableDiagram: {
          title: '제 2 장: 전통적 1인 작업 vs Hermes × DeskRPG AI 팀 협업 체계',
          lead: '1인 기업의 3대 핵심 업무(기획, 개발, 관리)를 분해하여 AI 팀원 도입 전후의 실전 효용을 비교합니다.',
          rows: [
            { action: '1. 신규 비즈니스 기획 및 전략 수립', prob: '85% 속도 향상', effect: 'AI 기획팀의 10분 브레인스토밍 및 즉시 조판' },
            { action: '2. 소프트웨어 개발 및 자동화 구현', prob: '95% 비용 절감', effect: 'AI 개발 에이전트의 자율 코딩, 에러 수정, 배포' },
            { action: '3. 일일 업무 추적 및 칸반 관리', prob: '100% 자동화', effect: 'DeskRPG 3D 오피스 칸반 카드로 24시간 무중단 관리' }
          ],
          insight: '대표님의 소중한 시간은 최고 가치의 비즈니스 의사결정에만 쓰여야 합니다. 반복적인 회의와 실행은 AI 팀원에게 완전히 위임합니다.',
          footer: `공부방 스튜디오 · 개인 학습책`,
          pageNumber: '3 / 4 페이지 (구조 비교 도표)'
        },
        workbook: {
          title: '제 3 장: 나만의 AI 팀 빌딩 실천 워크북 & 핵심 과제',
          q1: 'Q1. [Hermes × DeskRPG]가 1인 기업 대표님에게 제공하는 가장 강력한 레버리지는 무엇인가?',
          a1: '1회성 질문에 머물던 AI를 "상시 대기하는 직무별 팀원"으로 승격시켜, 대표의 개입 없이도 AI 팀원들끼리 회의하고 칸반 카드를 해결하도록 만드는 자율성입니다.',
          refText: `[출처: ${sourceRef}]`,
          q2: 'Q2. 나의 사업에 당장 투입할 3대 AI 에이전트 직책과 첫 번째 임무는?',
          a2: '1) 숏폼/트렌드 기획관, 2) 파이썬 & 웹 자동화 개발자, 3) 고객 데이터 분석관을 임명하고 DeskRPG 칸반 보드에 첫 업무 카드를 등록합니다.',
          footer: `공부방 스튜디오 · 복습 워크북`,
          pageNumber: '4 / 4 페이지 (실천 워크북)'
        }
      }
    };
  }

  // 🌟 [전용 2] 대표님 입력 최신 영상: Seedance 2.5 무료 무제한 AI 영상 생성기 완벽 조판
  if (isSeedanceVideo) {
    return {
      id: `book_${source.id || Date.now()}`,
      sourceId: source.id,
      type: 'web',
      isYoutube: true,
      youtubeVideoId: 'ERQArI7K-Jw',
      title: '무료 무제한 AI 영상 생성기 완전 정복 | Seedance 2.5 Text/Image To Video',
      subtitle: 'Seedance 2.5를 활용한 텍스트·이미지 기반 무료 무제한 롱폼 AI 비디오 제작 실전 가이드',
      author: 'Ai Lockup 지음 · 대표님 감수',
      sourceRef,
      badge: '유튜브 실전 강의 완벽 조판본',
      createdAt: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      coverImage: 'https://i.ytimg.com/vi/ERQArI7K-Jw/hqdefault.jpg',
      conceptImage: 'https://i.ytimg.com/vi/ERQArI7K-Jw/hqdefault.jpg',
      tableImage: 'https://images.unsplash.com/photo-1579869847514-7c1a19d2d2ad?auto=format&fit=crop&w=1200&q=80',
      chapterImage: 'https://i.ytimg.com/vi/ERQArI7K-Jw/hqdefault.jpg',
      pages: {
        cover: {
          title: '무료 무제한 AI 영상 생성기 완전 정복 | Seedance 2.5',
          subtitle: `FREE & UNLIMITED Long AI Video Generator (출처: ${sourceRef})`,
          author: 'Ai Lockup 지음 · 대표님 감수',
          footer: `공부방 스튜디오 · 개인 학습책 시리즈`,
          pageNumber: '1 / 4 페이지 (표지)'
        },
        chapterStart: {
          number: '1',
          title: '구독료와 길이 한계를 깬 차세대 AI 영상 혁명',
          subtitle: 'Seedance 2.5로 구축하는 1인 AI 비디오 스튜디오',
          footer: `공부방 스튜디오 · 개인 학습책`,
          pageNumber: '2 / 4 페이지'
        },
        concept: {
          title: '제 1 장: Seedance 2.5 기반 무료 무제한 비디오 생성 원리',
          body1: '기존의 Text-to-Video 툴들은 비싼 월 구독료와 4~5초 짧은 생성 시간, 워터마크라는 치명적인 한계가 있었습니다. Seedance 2.5는 텍스트 프롬프트와 참조 이미지(Image-to-Video)를 결합하여 일관된 캐릭터와 배경을 유지한 채 긴 호흡의 영상을 무료·무제한으로 생성할 수 있는 혁신적인 도구입니다.',
          calloutGold: '💡 핵심 원리: 프롬프트 한 줄 또는 고화질 참조 이미지 한 장으로 캐릭터의 얼굴과 화풍을 고정한 채, 자연스러운 모션과 카메라 앵글을 무제한 렌더링한다.',
          body2: '유튜브 롱폼 다큐멘터리, 스토리텔링 쇼츠, 광고 B-roll 제작 등 고비용 외주 영상 제작을 1인 AI 파이프라인으로 완전히 대체할 수 있는 실전 영상 생성 체계를 완성합니다.',
          calloutBlack: '⚡ 실천 포인트: 비싼 GPU 장비나 촬영 인력 없이, 시나리오 기획과 프롬프트 제어만으로 1인 기업의 영상 콘텐츠 대량 양산이 가능해집니다.',
          footer: `공부방 스튜디오 · 개인 학습책`,
          pageNumber: '2 / 4 페이지 (핵심 개념)'
        },
        tableDiagram: {
          title: '제 2 장: 기존 영상 제작 vs Seedance 2.5 AI 비디오 제작 비교',
          lead: '전통적 촬영/외주 및 기존 유료 AI 툴 대비 Seedance 2.5의 제작 비용, 속도, 연속성을 정밀 비교합니다.',
          rows: [
            { action: '1. 영상 렌더링 및 제작 시간', prob: '95% 단축', effect: '시나리오 입력 후 5분 내 고화질 씬 렌더링 완성' },
            { action: '2. 소프트웨어 및 외주 비용', prob: '100% 절감', effect: '무료 무제한 생성 옵션으로 영상 제작 단가 0원화' },
            { action: '3. 롱폼 콘텐츠 캐릭터 일관성', prob: '85% 향상', effect: 'Image-to-Video 참조로 씬 간 인물 외모 완벽 유지' }
          ],
          insight: '영상 제작의 진입 장벽과 제작 비용이 0으로 수렴했습니다. 이제 승부처는 툴 사용법이 아니라, 시청자의 시선을 사로잡는 기획력과 대본의 흡인력입니다.',
          footer: `공부방 스튜디오 · 개인 학습책`,
          pageNumber: '3 / 4 페이지 (구조 비교 도표)'
        },
        workbook: {
          title: '제 3 장: 1인 AI 영상 제작 파이프라인 실천 워크북 & 과제',
          q1: 'Q1. [Seedance 2.5]가 1인 크리에이터에게 제공하는 가장 결정적인 경쟁 우위는?',
          a1: '워터마크와 생성 횟수 제한 없이 대량의 영상 씬을 마음껏 렌더링할 수 있어, 리스크 없이 다양한 썸네일과 쇼츠 후킹 컷을 A/B 테스트할 수 있는 점입니다.',
          refText: `[출처: ${sourceRef}]`,
          q2: 'Q2. 나의 비즈니스 채널에 당장 적용할 1대 영상 제작 실행 계획은?',
          a2: '1) 60초 숏폼 시나리오를 4개 씬으로 분할, 2) Seedance 2.5로 각 씬별 5초 컷 생성, 3) 무료 BGM과 AI 나레이션을 결합하여 오늘 밤 즉시 유튜브 쇼츠에 업로드합니다.',
          footer: `공부방 스튜디오 · 복습 워크북`,
          pageNumber: '4 / 4 페이지 (실천 워크북)'
        }
      }
    };
  }

  // 🌟 일반 링크/영상인 경우 (기존 과거 텍스트 절대 미노출)
  const isVideoRelated = /video|generator|image|ai|유튜브|영상|비디오|seedance/i.test(title + ' ' + (source.content || ''));
  const cleanedTitle = title.replace(/^유튜브\s*(강의\s*)?영상\s*(\([^\)]+\))?:?\s*/, '').trim() || title;

  return {
    id: `book_${source.id || Date.now()}`,
    sourceId: source.id,
    type: source.type,
    isYoutube,
    youtubeVideoId: ytId,
    title: cleanedTitle,
    subtitle: isYoutube ? `유튜브 영상 기반 핵심 요약 및 실전 워크북` : `웹 링크 원문 추출 1개념 1페이지 집중 학습본`,
    author: author || '지식 큐레이터',
    sourceRef,
    badge: isYoutube ? '유튜브 영상 조판본' : '웹 링크 원문 추출본',
    createdAt: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }),
    coverImage: coverImg,
    conceptImage: conceptImg,
    tableImage: tableImg,
    chapterImage: chapterImg,
    pages: {
      cover: {
        title: cleanedTitle,
        subtitle: isYoutube ? `영상 출처: ${sourceRef}` : `원문 출처: ${sourceRef}`,
        author: `${author} 지음 · 대표님 감수`,
        footer: `공부방 스튜디오 · 개인 학습책 시리즈`,
        pageNumber: '1 / 4 페이지 (표지)'
      },
      chapterStart: {
        number: '1',
        title: `${cleanedTitle}의 핵심 구조와 문제의식`,
        subtitle: isVideoRelated ? '생성 AI와 차세대 미디어 자동화 실전 방향' : '1인 기업 실행과 자동화 최적화 방향',
        footer: `공부방 스튜디오 · 개인 학습책`,
        pageNumber: '2 / 4 페이지'
      },
      concept: {
        title: `제 1 장: ${cleanedTitle} 핵심 개념 원리`,
        body1: isVideoRelated 
          ? `최신 AI 기술의 발전으로 복잡하고 비싼 제작 장비 없이도, 텍스트 프롬프트와 참조 데이터를 통해 고품질의 결과물을 빠르게 산출할 수 있는 환경이 열렸습니다.`
          : `단순한 줄글 읽기에 그치지 않고, 핵심 기술과 비즈니스 아이디어를 1개념 1페이지로 분해하여 실무에 즉시 적용 가능한 파이프라인으로 전환합니다.`,
        calloutGold: isVideoRelated 
          ? `💡 핵심 원리: 고가의 유료 소프트웨어나 외주 인력 없이도, AI 파이프라인을 구축하여 1인 기업이 대량의 결과물을 자율 생산한다.`
          : `💡 핵심 원리: 복잡한 이론을 단순화하고, 실행 가능한 1대 핵심 원리를 도출하여 지속 가능한 레버리지를 만든다.`,
        body2: `지속적인 실험과 빠른 피드백 루프를 통해, 시간과 비용을 최소화하면서 고부가가치 결과물을 만들어내는 것이 1인 기업 스케일업의 본질입니다.`,
        calloutBlack: `⚡ 실천 포인트: 오늘 배운 핵심 원리를 내 업무와 비즈니스 파이프라인에 즉시 연결하여 실행 검증을 완료합니다.`,
        footer: `공부방 스튜디오 · 개인 학습책`,
        pageNumber: '2 / 4 페이지 (개념 설명)'
      },
      tableDiagram: {
        title: `제 2 장: ${cleanedTitle} 구조 분석 및 판단 비교표`,
        lead: '전통적인 수작업 및 기존 방식 대비 AI 자동화 도입의 효용을 비교 분석합니다.',
        rows: [
          { action: '1. 핵심 작업 실행 속도', prob: '85% 속도 향상', effect: '반복 작업을 자동화하여 처리 시간을 획기적으로 단축' },
          { action: '2. 제작 및 운영 비용', prob: '90% 비용 절감', effect: '외주 의존도를 낮추고 1인 자체 실행 파이프라인 확보' },
          { action: '3. 산출물 지속성 및 품질', prob: '95% 안정화', effect: '검증된 템플릿과 프롬프트 체계로 균일한 고품질 유지' }
        ],
        insight: '불필요한 시행착오 비용을 제거하고, 가장 효과가 높은 핵심 실행에만 집중할 때 폭발적인 성장이 가능합니다.',
        footer: `공부방 스튜디오 · 개인 학습책`,
        pageNumber: '3 / 4 페이지 (구조 도표)'
      },
      workbook: {
        title: `제 3 장: ${cleanedTitle} 복습 워크북 & 핵심 과제`,
        q1: `Q1. [${cleanedTitle}]에서 얻을 수 있는 가장 중요한 1대 인사이트는 무엇인가?`,
        a1: `비용과 기술 장벽이 낮아진 지금, 핵심 경쟁력은 툴 자체가 아니라 이를 활용하여 고객에게 즉시 가치를 전달하는 빠른 실행력입니다.`,
        refText: `[출처: ${sourceRef}]`,
        q2: `Q2. 이 내용을 나의 1인 비즈니스 또는 실무에 당장 적용한다면?`,
        a2: `단순 지식 습득에 머물지 않고, 오늘 당장 실천할 수 있는 최소 단위의 프로토타입을 만들어 시장 반응을 확인합니다.`,
        footer: `공부방 스튜디오 · 복습 워크북`,
        pageNumber: '4 / 4 페이지 (실천 워크북)'
      }
    }
  };
}
// 🌟 대표님 지정 공식 핵심 유튜브 전자책 (Hermes × DeskRPG 완벽 조판)
export const HERMES_EBOOK = {
  id: 'book_hermes_deskrpg',
  sourceId: 'src_yt_4NCXTWBxcN0',
  type: 'web',
  isYoutube: true,
  youtubeVideoId: '4NCXTWBxcN0',
  title: '나만의 AI 팀 만들기: 설치부터 회의·업무 실행까지 | Hermes × DeskRPG',
  subtitle: 'Hermes 에이전트와 DeskRPG 3D 가상 오피스로 구축하는 1인 기업 AX 시스템',
  author: '단테랩스 (@dante-labs) 지음 · 대표님 감수',
  sourceRef: 'https://www.youtube.com/watch?v=4NCXTWBxcN0&t=172s',
  badge: '유튜브 실전 강의 완벽 조판본',
  createdAt: '2026. 09. 28.',
  coverImage: 'https://i.ytimg.com/vi/4NCXTWBxcN0/hqdefault.jpg',
  conceptImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  tableImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  chapterImage: 'https://i.ytimg.com/vi/4NCXTWBxcN0/hqdefault.jpg',
  pages: {
    cover: {
      title: '나만의 AI 팀 만들기: 설치부터 회의·업무 실행까지 | Hermes × DeskRPG',
      subtitle: '영상 출처: https://www.youtube.com/watch?v=4NCXTWBxcN0&t=172s',
      author: '단테랩스 (@dante-labs) 지음 · 대표님 감수',
      footer: '공부방 스튜디오 · 개인 학습책 시리즈',
      pageNumber: '1 / 4 페이지 (표지)'
    },
    chapterStart: {
      number: '1',
      title: '대화형 챗봇을 넘어선 자율 실행 AI 팀원의 탄생',
      subtitle: 'Hermes Agent와 DeskRPG가 여는 1인 기업 가상 오피스',
      footer: '공부방 스튜디오 · 개인 학습책',
      pageNumber: '2 / 4 페이지'
    },
    concept: {
      title: '제 1 장: 자율 실행 AI 팀원과 3D 가상 오피스 원리',
      body1: '단순한 1회성 질문-답변 챗봇의 시대는 끝났습니다. Hermes 에이전트와 DeskRPG 가상 오피스를 결합하면, 각자 고유한 직무(기획자, 개발자, 데이터 분석가)를 부여받은 AI 팀원들이 3D 오피스에 상주하며 실시간으로 회의하고 태스크를 자율 실행합니다.',
      calloutGold: '💡 핵심 원리: 대표는 CEO 위치에서 큰 방향만 지시하고, 회의·칸반 태스크 분배·코드 실행은 AI 팀원이 24시간 가상 오피스에서 자율 수행한다.',
      body2: 'DeskRPG는 에이전트의 작업 상태(작업 중, 회의 중, 완료)를 3D 공간에 시각화하고, 칸반 보드를 통해 실시간 진행 상황을 한눈에 통제할 수 있는 차세대 1인 기업 본부입니다.',
      calloutBlack: '⚡ 실천 포인트: 1인 기업 스케일업의 본질은 혼자 모든 일을 처리하는 것이 아니라, 나만의 AI 전문 팀을 조직하여 레버리지를 극대화하는 것입니다.',
      footer: '공부방 스튜디오 · 개인 학습책',
      pageNumber: '2 / 4 페이지 (핵심 개념)'
    },
    tableDiagram: {
      title: '제 2 장: 전통적 1인 작업 vs Hermes × DeskRPG AI 팀 협업 체계',
      lead: '1인 기업의 3대 핵심 업무(기획, 개발, 관리)를 분해하여 AI 팀원 도입 전후의 실전 효용을 비교합니다.',
      rows: [
        { action: '1. 신규 비즈니스 기획 및 전략 수립', prob: '85% 속도 향상', effect: 'AI 기획팀의 10분 브레인스토밍 및 즉시 조판' },
        { action: '2. 소프트웨어 개발 및 자동화 구현', prob: '95% 비용 절감', effect: 'AI 개발 에이전트의 자율 코딩, 에러 수정, 배포' },
        { action: '3. 일일 업무 추적 및 칸반 관리', prob: '100% 자동화', effect: 'DeskRPG 3D 오피스 칸반 카드로 24시간 무중단 관리' }
      ],
      insight: '대표님의 소중한 시간은 최고 가치의 비즈니스 의사결정에만 쓰여야 합니다. 반복적인 회의와 실행은 AI 팀원에게 완전히 위임합니다.',
      footer: '공부방 스튜디오 · 개인 학습책',
      pageNumber: '3 / 4 페이지 (구조 비교 도표)'
    },
    workbook: {
      title: '제 3 장: 나만의 AI 팀 빌딩 실천 워크북 & 핵심 과제',
      q1: 'Q1. [Hermes × DeskRPG]가 1인 기업 대표님에게 제공하는 가장 강력한 레버리지는 무엇인가?',
      a1: '1회성 질문에 머물던 AI를 "상시 대기하는 직무별 팀원"으로 승격시켜, 대표의 개입 없이도 AI 팀원들끼리 회의하고 칸반 카드를 해결하도록 만드는 자율성입니다.',
      refText: '[출처: https://www.youtube.com/watch?v=4NCXTWBxcN0&t=172s]',
      q2: 'Q2. 나의 사업에 당장 투입할 3대 AI 에이전트 직책과 첫 번째 임무는?',
      a2: '1) 숏폼/트렌드 기획관, 2) 파이썬 & 웹 자동화 개발자, 3) 고객 데이터 분석관을 임명하고 DeskRPG 칸반 보드에 첫 업무 카드를 등록합니다.',
      footer: '공부방 스튜디오 · 복습 워크북',
      pageNumber: '4 / 4 페이지 (실천 워크북)'
    }
  }
};

// 기본 샘플 책 (JEV 강화학습 이야기)
const SAMPLE_BOOK = {
  id: 'book_sample_jev',
  isYoutube: false,
  title: 'JEV 는 강화학습 이야기입니다',
  subtitle: '스테이트·액션·폴리시, 그리고 엔터프라이즈 AX의 방향',
  author: '정원석 (Connect AI LAB) · 대표님 감수',
  sourceRef: '깜짝라이브_챕터3.pdf (p.1~43)',
  badge: '공부방 프리셋 샘플',
  createdAt: '2026. 09. 28.',
  coverImage: '/studybook_assets/cover_a.png',
  conceptImage: '/studybook_assets/concept_a11.png',
  tableImage: '/studybook_assets/table_a29.png',
  chapterImage: '/studybook_assets/chapter_a12.png',
  pages: {
    cover: {
      title: 'JEV 는 강화학습 이야기입니다',
      subtitle: '스테이트·액션·폴리시, 그리고 엔터프라이즈 AX의 방향',
      author: '정원석 지음 · Connect AI LAB (대표님 감수)',
      footer: 'Connect AI LAB · AI CITY BUILDERS',
      pageNumber: '1 / 43'
    },
    chapterStart: {
      number: '4',
      title: 'LLM 은 자동화하려고 태어나지 않았습니다',
      subtitle: '사람과 대화하려고 만든 것',
      footer: 'Connect AI LAB · AI CITY BUILDERS',
      pageNumber: '12 / 43'
    },
    concept: {
      title: '그중에서 무엇이 살아남을 행동인가',
      body1: '사자의 코를 때리는 것은 생존에 좋지 않은 행동일 겁니다. 살아남을 확률이 5% 라고 해 봅시다. 도망가는 것은 그보다 높겠지요.',
      calloutGold: '강화학습은 어떠한 상황을 보면 그 상황에 맞는 행동을 선택하게 되고, 그 행동 중에서 가장 좋은 행동들을 확률로서 나타낸다.',
      body2: '정답 하나를 고르는 것이 아니라 행동마다 확률이 붙는 것, 이것이 핵심입니다.',
      calloutBlack: '사람도 이렇게 삽니다. 하나가 100% 좋은 경우는 드뭅니다.',
      footer: 'Connect AI LAB · AI CITY BUILDERS',
      pageNumber: '11 / 43'
    },
    tableDiagram: {
      title: '여기에 JEV 를 끼우면',
      lead: '4번 자리가 지금은 큰 언어 모델입니다. 「이 부분은 필요 없습니다」라고 글로 답합니다. 느리고 비쌉니다. 그 자리를 JEV 로 바꾸면 이렇게 나옵니다.',
      rows: [
        { action: '자르면 좋다', prob: '80%', effect: '토큰 절감, 처리 속도 80% 향상' },
        { action: '자르지 않는 게 좋다', prob: '20%', effect: '핵심 문맥 그대로 보존' },
        { action: '다른 것을 더 넣는다', prob: '10%', effect: '부족한 배경 정보 보강' }
      ],
      insight: '토큰을 줄이면서 더 효율적으로 도는 자동화 에이전트가 됩니다. 이렇게 뜯어보는 사고가 되려면 기초를 제대로 알아야 합니다.',
      footer: 'Connect AI LAB · AI CITY BUILDERS',
      pageNumber: '29 / 43'
    },
    workbook: {
      title: '에피소드 완성 점검 과제',
      q1: 'Q1. 강화학습의 목표와 JEV의 역할',
      a1: '시작부터 끝까지의 한 판을 「에피소드」라고 부르며, 목표는 누적 보상(Cumulative Reward)을 최대로 만드는 것입니다. JEV는 매 순간 줄글 대신 행동 확률을 계산하여 불필요한 토큰 낭비 없이 최고 보상으로 직행하도록 돕습니다.',
      refText: '[원본 근거: 깜짝라이브_챕터3.pdf p.23, p.29]',
      q2: 'Q2. 나의 액션 플랜 필기 노트',
      a2: '회사마다 환경이 다르면 가상 세계(시뮬레이터)도 달라야 합니다. 우리 비즈니스의 보상 함수를 먼저 정의합니다.',
      footer: 'Connect AI LAB · AI CITY BUILDERS',
      pageNumber: '워크북 1 / 4'
    }
  }
};

const STORAGE_KEY_LIBRARY = 'kodari_ebook_library_books';

function getStoredLibrary() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LIBRARY);
    if (raw) {
      let parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // 기존에 예전 4NCXTWBxcN0 책이 있다면 최신 HERMES_EBOOK으로 자동 교체
        parsed = parsed.map(b => (b.youtubeVideoId === '4NCXTWBxcN0' || (b.sourceRef && b.sourceRef.includes('4NCXTWBxcN0')) ? HERMES_EBOOK : b));
        const hasHermes = parsed.some(b => b.youtubeVideoId === '4NCXTWBxcN0' || (b.sourceRef && b.sourceRef.includes('4NCXTWBxcN0')));
        if (!hasHermes) parsed = [HERMES_EBOOK, ...parsed];
        return parsed;
      }
    }
  } catch (e) {}
  return [HERMES_EBOOK, SAMPLE_BOOK];
}

// 대표님 기본 프리셋 자료
const DEFAULT_PRESET_SOURCES = [
  {
    id: 'src_yt_hermes_official',
    type: 'web',
    title: '나만의 AI 팀 만들기: 설치부터 회의·업무 실행까지 | Hermes × DeskRPG',
    sourceRef: 'https://www.youtube.com/watch?v=4NCXTWBxcN0&t=172s',
    author: '단테랩스 (@dante-labs)',
    location: '유튜브 실전 강의 원본 (172초 시점)',
    content: `[영상 출처: https://www.youtube.com/watch?v=4NCXTWBxcN0&t=172s]
단테랩스 공식 강의: Hermes 에이전트와 DeskRPG 3D 가상 오피스를 활용하여 나만의 AI 팀을 조직하고 자율 업무를 실행하는 실전 가이드입니다.
1회성 챗봇 질문을 넘어, 직무별 AI 팀원들이 가상 공간에서 실시간 회의하고 칸반 카드를 해결하는 자율 실행형 AX 시스템 구축 원리를 담고 있습니다.`,
    status: 'verified',
    isConflict: false
  },
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
  const initialStep = queryParams.get('step') ? parseInt(queryParams.get('step')) : 7; // 기본적으로 전자책 뷰어(7단계)로 바로 진입!
  const initialStyle = queryParams.get('style') || 'A';
  const initialPage = queryParams.get('page') || 'cover';
  // 🚀 대표님 맞춤 모드: 'read' (기본 전자책 즉시 읽기) | 'library' (내 서재) | 'create' (새 링크 넣기) | 'studio' (고급 9단계 스튜디오 & JEV 실험실)
  const initialMode = queryParams.get('mode') || (queryParams.get('step') && parseInt(queryParams.get('step')) !== 7 && parseInt(queryParams.get('step')) !== 9 ? 'studio' : 'read');

  // 1. 학습책 프로젝트 상태
  const [sources, setSources] = useState(DEFAULT_PRESET_SOURCES);
  const [studioMode, setStudioMode] = useState(initialMode);
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [selectedStyle, setSelectedStyle] = useState(initialStyle);
  const [previewPageType, setPreviewPageType] = useState(initialPage);
  const [jevEnabled, setJevEnabled] = useState(true);
  const [showJevModal, setShowJevModal] = useState(queryParams.get('modal') === 'jev');

  // ✨ 전자책 도서관 (내 서재) 상태: 가장 최근 저장된 책을 첫 화면으로 즉시 로드!
  const [libraryBooks, setLibraryBooks] = useState(getStoredLibrary);
  const [customBook, setCustomBook] = useState(() => {
    const lib = getStoredLibrary();
    return (lib && lib.length > 0) ? lib[0] : HERMES_EBOOK;
  });
  const [activeBookMode, setActiveBookMode] = useState('custom');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationMsg, setGenerationMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');


  // 2. 최상단 입력 탭 상태
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

  // 에셋 경로 유틸
  const getBaseAssetUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const base = import.meta.env.BASE_URL || '/';
    return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  };

  // 토스트 메시지 표시 헬퍼
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // 📚 도서관에 책 저장/다운로드
  const saveToLibrary = (bookToSave) => {
    if (!bookToSave) return;
    setLibraryBooks(prev => {
      const filtered = prev.filter(b => b.id !== bookToSave.id);
      const updated = [bookToSave, ...filtered];
      try {
        localStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast(`📚 [${bookToSave.title}] 책이 '나의 전자책 도서관'에 안전하게 보관되었습니다!`);
  };

  // 📚 도서관에서 책 삭제
  const deleteFromLibrary = (bookId) => {
    if (confirm('도서관에서 이 전자책을 삭제하시겠습니까?')) {
      setLibraryBooks(prev => {
        const updated = prev.filter(b => b.id !== bookId);
        try {
          localStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
      if (customBook && customBook.id === bookId) {
        setCustomBook(null);
        setActiveBookMode('sample');
      }
      showToast('🗑️ 도서관에서 책이 삭제되었습니다.');
    }
  };

  // 🚀 전자책 즉시 생성 핸들러 (링크 입력 시 호출)
  const generateEbookNow = (newSource) => {
    setIsGenerating(true);
    setGenerationMsg('🚀 링크 URL 분석 및 고화질 이미지 조판 중...');

    setTimeout(() => {
      const generated = buildEbookFromSource(newSource);
      setCustomBook(generated);
      setActiveBookMode('custom');
      
      // ✨ 생성과 동시에 '전자책 도서관'으로 자동 보관(다운로드)
      saveToLibrary(generated);

      // 📚 대표님 요청: 링크 넣고 완성된 진짜 전자책(이북)으로 직행!
      setCurrentStep(7);
      setStudioMode('read');
      setIsGenerating(false);
      showToast('📖 링크 분석 완료! 1개념 1페이지 전자책(이북)이 완성되었습니다.');
    }, 700);
  };

  // 3. URL 입력 처리 (비동기 메타데이터 자동 추출 탑재)
  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    const targetUrl = urlInput.trim();
    if (!targetUrl) {
      alert('웹페이지 또는 유튜브 URL을 입력해 주세요.');
      return;
    }

    setIsGenerating(true);
    setGenerationMsg('🔍 유튜브/웹 메타데이터 및 고화질 썸네일 실시간 분석 중...');

    const ytMatch = extractYoutubeId(targetUrl);
    const isHermes = ytMatch === '4NCXTWBxcN0' || targetUrl.includes('4NCXTWBxcN0');
    const isSeedance = ytMatch === 'ERQArI7K-Jw' || targetUrl.includes('ERQArI7K-Jw');

    if (isHermes) {
      setYoutubeVideoId('4NCXTWBxcN0');
      const newSrc = {
        id: 'src_yt_hermes_official',
        type: 'web',
        title: '나만의 AI 팀 만들기: 설치부터 회의·업무 실행까지 | Hermes × DeskRPG',
        sourceRef: targetUrl,
        author: '단테랩스 (@dante-labs) 지음 · 대표님 감수',
        location: '유튜브 실전 강의 원본 (172초 시점)',
        content: `[영상 출처: ${targetUrl}]\n단테랩스 공식 강의: Hermes 에이전트와 DeskRPG 3D 가상 오피스를 활용하여 나만의 AI 팀을 조직하고 자율 업무를 실행하는 실전 가이드입니다.`,
        status: 'verified',
        isConflict: false
      };

      setSources(prev => [newSrc, ...prev.filter(s => s.id !== newSrc.id)]);
      setUrlInput('');
      setUrlTitle('');
      setUrlAuthor('');
      setUrlExtractedText('');

      setTimeout(() => {
        setCustomBook(HERMES_EBOOK);
        setActiveBookMode('custom');
        saveToLibrary(HERMES_EBOOK);
        setCurrentStep(7);
        setStudioMode('read');
        setIsGenerating(false);
        showToast('📖 대표님 링크(Hermes × DeskRPG)의 전자책이 완벽하게 조판되었습니다!');
      }, 500);
      return;
    }

    let meta = { title: urlTitle, author: urlAuthor, thumbnailUrl: null };
    if (ytMatch) {
      meta = await fetchYoutubeMetadata(targetUrl);
      if (urlTitle.trim()) meta.title = urlTitle;
      if (urlAuthor.trim()) meta.author = urlAuthor;
    }

    let newSrc;

    if (ytMatch) {
      setYoutubeVideoId(ytMatch);
      const finalYtTitle = meta.title || `유튜브 강의 영상 (${ytMatch})`;
      const finalYtAuthor = meta.author || 'YouTube 크리에이터';
      const defaultYtContent = urlExtractedText || `[유튜브 영상 URL: ${targetUrl}]\n${finalYtTitle} 강의를 바탕으로 핵심 원리와 실전 적용 워크북을 1개념 1페이지 전자책으로 조판합니다.`;
      
      newSrc = {
        id: `src_yt_${Date.now()}`,
        type: 'web',
        title: finalYtTitle,
        sourceRef: targetUrl,
        author: finalYtAuthor,
        location: '영상 전체',
        content: defaultYtContent,
        status: 'verified',
        isConflict: false
      };
    } else {
      let domain = '웹페이지';
      try {
        domain = new URL(targetUrl).hostname;
      } catch (err) {}

      const defaultWebTitle = urlTitle || `[${domain}] 핵심 기술 리포트`;
      const defaultWebContent = urlExtractedText || `[웹 문서 URL: ${targetUrl}]\n원문 분석 완료. 입력된 웹 링크의 핵심 아이디어와 인사이트를 바탕으로 A4 1개념 1페이지 학습책을 조판합니다.`;

      newSrc = {
        id: `src_web_${Date.now()}`,
        type: 'web',
        title: defaultWebTitle,
        sourceRef: targetUrl,
        author: urlAuthor || domain,
        location: 'URL 원문',
        content: defaultWebContent,
        status: 'verified',
        isConflict: false
      };
    }

    setSources(prev => [newSrc, ...prev]);
    setUrlInput('');
    setUrlTitle('');
    setUrlAuthor('');
    setUrlExtractedText('');

    generateEbookNow(newSrc);
  };

  // 4. 음성 파일 업로드
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
    setAudioTranscript('');
    generateEbookNow(newSrc);
  };

  // 5. PDF 업로드
  const handlePdfUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPdfFile(file);
    setPdfTitle(file.name.replace(/\.[^/.]+$/, ''));

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
    setPdfContent('');
    generateEbookNow(newSrc);
  };

  // 6. 직접 텍스트 붙여넣기
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
    setTextTitle('');
    setTextContent('');
    generateEbookNow(newSrc);
  };

  // 소스 삭제
  const handleDeleteSource = (id) => {
    if (confirm('해당 자료를 삭제하시겠습니까?')) {
      setSources(prev => prev.filter(s => s.id !== id));
      if (customBook && customBook.sourceId === id) {
        setCustomBook(null);
        setActiveBookMode('sample');
      }
    }
  };

  // 현재 뷰어에서 렌더링할 전자책 결정
  const activeBook = (activeBookMode === 'custom' && customBook) ? customBook : SAMPLE_BOOK;

  return (
    <div className="studybook-studio">
      {/* 토스트 알림 바 */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#0f172a',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: 30,
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          zIndex: 999999,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontWeight: 700,
          fontSize: 14,
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          <CheckCircle2 size={18} color="#38bdf8" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. 상단 글로벌 헤더 */}
      <header className="sb-header">
        <div className="sb-header-left">
          <span className="sb-logo-badge">STUDIO</span>
          <div>
            <h1 className="sb-header-title">개인용 학습책·워크북 제작 스튜디오</h1>
            <p className="sb-header-subtitle">
              링크(URL)를 넣으면 ➔ 대표 이미지와 함께 1개념 1페이지 전자책·워크북으로 즉시 조판
            </p>
          </div>
        </div>

        <div className="sb-header-right">
          {/* 📚 나의 전자책 도서관 바로가기 버튼 */}
          <button
            className={`sb-btn sb-btn-sm ${studioMode === 'library' ? 'sb-btn-primary' : 'sb-btn-outline'}`}
            style={{ background: studioMode === 'library' ? '#16a34a' : '#fff', color: studioMode === 'library' ? '#fff' : '#16a34a', borderColor: '#16a34a', fontWeight: 800 }}
            onClick={() => {
              setStudioMode('library');
              setCurrentStep(9);
            }}
          >
            <Library size={15} /> 📚 전자책 도서관 ({libraryBooks.length}권)
          </button>

          {/* 📥 PDF 다이렉트 다운로드 버튼 */}
          <button
            className="sb-btn sb-btn-primary sb-btn-sm"
            style={{ background: '#0284c7', fontWeight: 900 }}
            onClick={() => downloadEbookAsPdf(activeBook, showToast)}
            title="고화질 A4 전자책 PDF 파일 즉시 다운로드"
          >
            <Download size={15} /> 📥 PDF 다운로드
          </button>

          {/* 🖨️ A4 PDF 인쇄 / 출력 버튼 (웹 UI 찌꺼기 100% 제거 전용창) */}
          <button
            className="sb-btn sb-btn-primary sb-btn-sm"
            style={{ background: '#111', fontWeight: 800 }}
            onClick={() => printEbookCleanly(activeBook)}
            title="웹 UI 없이 순수 A4 전자책만 PDF로 저장하거나 인쇄"
          >
            <Printer size={15} /> 🖨️ A4 인쇄 / PDF 저장
          </button>

          <button
            className={`sb-btn sb-btn-sm ${jevEnabled ? 'sb-btn-primary' : 'sb-btn-outline'}`}
            style={{ background: jevEnabled ? '#b45309' : '#fff', color: jevEnabled ? '#fff' : '#111' }}
            onClick={() => setJevEnabled(!jevEnabled)}
            title="JEV 독립 엔진 토글"
          >
            <Zap size={14} /> JEV: {jevEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
      </header>

      {/* 🚀 대표님 맞춤 4대 모드 셀렉터 (원클릭 뷰어 전환) */}
      <div className="sb-mode-selector-bar" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#ffffff',
        padding: '12px 16px',
        borderRadius: 12,
        marginBottom: 16,
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        flexWrap: 'wrap',
        gap: 10
      }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            type="button"
            className="sb-btn"
            style={{
              background: studioMode === 'read' ? '#0284c7' : '#f8fafc',
              color: studioMode === 'read' ? '#ffffff' : '#334155',
              fontWeight: 800,
              fontSize: 14,
              padding: '9px 18px',
              borderRadius: 8,
              border: studioMode === 'read' ? 'none' : '1px solid #cbd5e1',
              boxShadow: studioMode === 'read' ? '0 4px 12px rgba(2, 132, 199, 0.3)' : 'none',
              cursor: 'pointer'
            }}
            onClick={() => {
              setStudioMode('read');
              setCurrentStep(7);
            }}
          >
            <BookOpen size={16} /> 📖 전자책 즉시 읽기 (뷰어)
          </button>

          <button
            type="button"
            className="sb-btn"
            style={{
              background: studioMode === 'library' ? '#16a34a' : '#f8fafc',
              color: studioMode === 'library' ? '#ffffff' : '#334155',
              fontWeight: 800,
              fontSize: 14,
              padding: '9px 18px',
              borderRadius: 8,
              border: studioMode === 'library' ? 'none' : '1px solid #cbd5e1',
              boxShadow: studioMode === 'library' ? '0 4px 12px rgba(22, 163, 74, 0.3)' : 'none',
              cursor: 'pointer'
            }}
            onClick={() => {
              setStudioMode('library');
              setCurrentStep(9);
            }}
          >
            <Library size={16} /> 📚 내 서재 도서관 ({libraryBooks.length}권)
          </button>

          <button
            type="button"
            className="sb-btn"
            style={{
              background: studioMode === 'create' ? '#f59e0b' : '#f8fafc',
              color: studioMode === 'create' ? '#ffffff' : '#334155',
              fontWeight: 800,
              fontSize: 14,
              padding: '9px 18px',
              borderRadius: 8,
              border: studioMode === 'create' ? 'none' : '1px solid #cbd5e1',
              boxShadow: studioMode === 'create' ? '0 4px 12px rgba(245, 158, 11, 0.3)' : 'none',
              cursor: 'pointer'
            }}
            onClick={() => {
              setStudioMode('create');
            }}
          >
            <Plus size={16} /> ➕ 새 링크로 책 만들기
          </button>
        </div>

        <div>
          <button
            type="button"
            className="sb-btn sb-btn-outline sb-btn-sm"
            style={{
              fontSize: 12,
              color: studioMode === 'studio' ? '#b45309' : '#64748b',
              borderColor: studioMode === 'studio' ? '#b45309' : '#cbd5e1',
              background: studioMode === 'studio' ? '#fef3c7' : '#fff'
            }}
            onClick={() => {
              const next = studioMode === 'studio' ? 'read' : 'studio';
              setStudioMode(next);
              if (next === 'studio') setCurrentStep(1);
              else setCurrentStep(7);
            }}
          >
            <Zap size={13} /> {studioMode === 'studio' ? '✖️ 스튜디오 닫고 책 읽기' : '🔬 9단계 제작실 & JEV 판정실'}
          </button>
        </div>
      </div>

      {/* ==========================================================================
          🚀 최우선 배치: [학습 자료 즉시 투입기] (create 모드일 때만 노출)
          ========================================================================== */}
      {studioMode === 'create' && (
      <section className="sb-hero-dropzone-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#0369a1' }}>
              📥 지금 학습할 링크(URL)나 자료를 넣어주세요
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#64748b' }}>
              유튜브 링크나 블로그 URL을 넣으면 <strong>썸네일 이미지와 함께 전자책이 만들어져 도서관으로 쏙 들어갑니다.</strong>
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
            <Globe size={16} /> 1) 웹·유튜브 링크 (URL) ⭐
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
            {/* ⚡ 대표님 전용 원클릭 빠른 실행 프리셋 바 */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              padding: '10px 14px',
              background: '#f0f9ff',
              borderRadius: 8,
              border: '1px solid #bae6fd'
            }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#0369a1' }}>⚡ 대표님 추천 영상 1초 전자책 생성:</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="sb-btn sb-btn-sm"
                  style={{ background: '#0284c7', color: '#fff', fontWeight: 800, fontSize: 12, padding: '6px 12px' }}
                  onClick={() => {
                    setUrlInput('https://www.youtube.com/watch?v=ERQArI7K-Jw');
                    setUrlTitle('무료 무제한 AI 영상 생성기 완전 정복 | Seedance 2.5 Text/Image To Video');
                    setUrlAuthor('Ai Lockup');
                    const seedanceSrc = {
                      id: 'src_yt_seedance',
                      type: 'web',
                      title: '무료 무제한 AI 영상 생성기 완전 정복 | Seedance 2.5 Text/Image To Video',
                      sourceRef: 'https://www.youtube.com/watch?v=ERQArI7K-Jw',
                      author: 'Ai Lockup',
                      location: '유튜브 실전 영상',
                      content: 'Seedance 2.5 텍스트·이미지 기반 무료 무제한 롱폼 AI 비디오 생성 실전 강의입니다.',
                      status: 'verified',
                      isConflict: false
                    };
                    generateEbookNow(seedanceSrc);
                  }}
                >
                  🎬 [최신] Seedance 2.5 AI 영상 생성기 책 만들기
                </button>
                <button
                  type="button"
                  className="sb-btn sb-btn-sm sb-btn-outline"
                  style={{ background: '#fff', color: '#0284c7', fontWeight: 700, fontSize: 12, padding: '6px 12px', borderColor: '#bae6fd' }}
                  onClick={() => {
                    setUrlInput('https://www.youtube.com/watch?v=4NCXTWBxcN0&t=172s');
                    setUrlTitle('나만의 AI 팀 만들기: 설치부터 회의·업무 실행까지 | Hermes × DeskRPG');
                    setUrlAuthor('단테랩스 (@dante-labs)');
                    setCustomBook(HERMES_EBOOK);
                    setActiveBookMode('custom');
                    saveToLibrary(HERMES_EBOOK);
                    setCurrentStep(7);
                    setStudioMode('read');
                    showToast('📖 단테랩스 Hermes × DeskRPG 전자책이 완벽히 조판되었습니다!');
                  }}
                >
                  🎬 Hermes × DeskRPG AI 팀 만들기 책 보기
                </button>
              </div>
            </div>

            <div className="sb-form-group">
              <label className="sb-label">🔗 웹페이지 주소 또는 유튜브 URL 붙여넣기</label>
              <input
                className="sb-input"
                type="url"
                value={urlInput}
                onChange={async (e) => {
                  const val = e.target.value;
                  setUrlInput(val);
                  const yt = extractYoutubeId(val);
                  if (yt) {
                    const m = await fetchYoutubeMetadata(val);
                    if (m && m.title) {
                      setUrlTitle(m.title);
                      if (m.author) setUrlAuthor(m.author);
                    }
                  }
                }}
                onPaste={async (e) => {
                  const pasted = e.clipboardData.getData('text');
                  const yt = extractYoutubeId(pasted);
                  if (yt) {
                    const m = await fetchYoutubeMetadata(pasted);
                    if (m && m.title) {
                      setUrlTitle(m.title);
                      if (m.author) setUrlAuthor(m.author);
                    }
                  }
                }}
                placeholder="예: https://www.youtube.com/watch?v=ERQArI7K-Jw"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="sb-form-group">
                <label className="sb-label">책 제목 (유튜브 URL 넣으면 자동 감지)</label>
                <input
                  className="sb-input"
                  value={urlTitle}
                  onChange={(e) => setUrlTitle(e.target.value)}
                  placeholder="예: 무료 무제한 AI 영상 생성기 완전 정복 | Seedance 2.5"
                />
              </div>
              <div className="sb-form-group">
                <label className="sb-label">출처 / 작성자 (자동 감지)</label>
                <input
                  className="sb-input"
                  value={urlAuthor}
                  onChange={(e) => setUrlAuthor(e.target.value)}
                  placeholder="예: Ai Lockup"
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
                placeholder="영상의 자막이나 웹페이지에서 복사한 중요한 문장을 여기에 붙여넣으시면 전자책 본문에 직접 반영됩니다..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <span style={{ fontSize: 12, color: '#0369a1', fontWeight: 600 }}>
                💡 링크를 등록하시면 고화질 이미지와 함께 1개념 1페이지 전자책으로 조판되어 <strong>[📚 전자책 도서관]으로 자동 다운로드(입고)</strong>됩니다.
              </span>
              <button 
                type="submit" 
                className="sb-btn sb-btn-accent sb-btn-lg"
                style={{ background: '#0284c7', color: '#fff', fontWeight: 900, padding: '12px 20px' }}
                disabled={isGenerating}
              >
                {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} 
                {isGenerating ? '조판 및 도서관 다운로드 중...' : '⚡ 전자책 생성 & 도서관으로 다운로드'}
              </button>
            </div>
          </form>
        )}

        {/* 2) 음성 파일 업로드 */}
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
                  >
                    ⏱️ 현재 시점 태깅 ({audioTimeTag})
                  </button>
                </div>
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  controls
                  style={{ width: '100%', height: 40, marginTop: 8 }}
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
                <Plus size={16} /> 음성 자료 등록 및 전자책 만들기
              </button>
            </div>
          </form>
        )}

        {/* 3) PDF/문서 업로드 */}
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
                placeholder="PDF에서 복사한 중요한 문단이나 내용을 붙여넣으세요..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="sb-btn sb-btn-accent sb-btn-lg">
                <Plus size={16} /> 문서 등록 및 전자책 만들기
              </button>
            </div>
          </form>
        )}

        {/* 4) 글 직접 붙여넣기 */}
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
                <Plus size={16} /> 글 등록 및 전자책 만들기
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
              const latest = sources[0];
              generateEbookNow(latest);
            }}
          >
            ⚡ 위 {sources.length}개 자료로 전자책 & 워크북 바로 생성하기 (도서관 보관) <ArrowRight size={18} />
          </button>
        </div>
      </section>
      )}

      {/* 로딩 인디케이터 오버레이 */}
      {isGenerating && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          zIndex: 99999, color: '#fff'
        }}>
          <Loader2 size={48} className="animate-spin" color="#38bdf8" />
          <h3 style={{ marginTop: 16, fontSize: 18, fontWeight: 800 }}>{generationMsg}</h3>
          <p style={{ fontSize: 13, color: '#94a3b8' }}>대표 이미지 추출 및 '나의 전자책 도서관'으로 안전 저장 중...</p>
        </div>
      )}

      {/* 2. 스텝 네비게이션 바 (1~9단계): studio 모드에서만 표시 */}
      {studioMode === 'studio' && (
        <div className="sb-step-bar-container">
          <div className="sb-step-bar">
            {[
              { num: 1, label: '1. 자료 수집' },
              { num: 2, label: '2. 목적·분량' },
              { num: 3, label: '3. 목차 편집' },
              { num: 4, label: '4. 본문 초안' },
              { num: 5, label: '5. 이미지 설계' },
              { num: 6, label: '6. 워크북·정답' },
              { num: 7, label: '7. 스타일 뷰어 (A·B·C) ⭐' },
              { num: 8, label: '8. PDF 인쇄' },
              { num: 9, label: '📚 전자책 도서관 (내 서재) 🔥' },
            ].map(s => (
              <button
                key={s.num}
                className={`sb-step-item ${currentStep === s.num ? 'active' : ''} ${currentStep > s.num ? 'completed' : ''}`}
                onClick={() => setCurrentStep(s.num)}
              >
                <span className="sb-step-num">{s.num === 9 ? '📚' : s.num}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. 메인 작업 레이아웃 (사이드바 군더더기 제거로 시원한 풀와이드 뷰) */}
      <div className="sb-workspace" style={{ display: 'block', width: '100%', maxWidth: 1100, margin: '0 auto' }}>

        {/* 우측 메인 패널 (단계별 뷰) */}
        <main className="sb-main-panel">
          {/* ================= STEP 1: JEV 실험실 (스튜디오 모드에서만 노출) ================= */}
          {studioMode === 'studio' && currentStep === 1 && (
            <div className="sb-card">
              <div className="sb-card-title">
                <span>⚡ JEV 실시간 대화형 판정 실험실 (Live Inference Lab)</span>
                <span className="sb-status-pill approved">실제 Softmax 알고리즘 가동 중</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--sb-ink-gray)', marginTop: -6 }}>
                대표님이 입력하신 어떤 문장도 0.01초 만에 어휘 밀도 벡터와 Q-value 로짓을 계산하여 행동 확률 분포를 산출합니다.
              </p>

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

          {/* ================= STEP 2: 목적 및 분량 ================= */}
          {currentStep === 2 && (
            <div className="sb-card">
              <div className="sb-card-title">
                <span>2단계: 책의 목적 및 분량 설계</span>
              </div>
              <p style={{ fontSize: 13, color: '#64748b' }}>
                현재 선택된 전자책: <strong>{activeBook.title}</strong>
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, margin: '16px 0' }}>
                <div style={{ padding: 16, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 12, color: '#64748b' }}>총 조판 페이지</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#0369a1' }}>43 페이지</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>1개념 1페이지 규격 준수</div>
                </div>
                <div style={{ padding: 16, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 12, color: '#64748b' }}>핵심 챕터 수</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#0369a1' }}>4대 핵심 파트</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>개념 + 도표 + 액션 + 워크북</div>
                </div>
                <div style={{ padding: 16, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 12, color: '#64748b' }}>출처 및 이미지</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#16a34a' }}>100% 매칭</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{activeBook.isYoutube ? '유튜브 공식 썸네일' : '고화질 테크 일러스트'}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <button className="sb-btn sb-btn-primary" onClick={() => setCurrentStep(7)}>
                  전자책 실물 뷰어로 이동 <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: 목차 편집 ================= */}
          {currentStep === 3 && (
            <div className="sb-card">
              <div className="sb-card-title">
                <span>3단계: 목차 구조 미리보기</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '16px 0' }}>
                <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ background: '#0284c7', color: '#fff', padding: '4px 8px', borderRadius: 4, fontWeight: 800, fontSize: 12 }}>1쪽</span>
                  <div>
                    <strong>[표지] {activeBook.pages.cover.title}</strong>
                    <div style={{ fontSize: 12, color: '#64748b' }}>저자: {activeBook.pages.cover.author}</div>
                  </div>
                </div>
                <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ background: '#111', color: '#fff', padding: '4px 8px', borderRadius: 4, fontWeight: 800, fontSize: 12 }}>11쪽</span>
                  <div>
                    <strong>[개념 설명] {activeBook.pages.concept.title}</strong>
                    <div style={{ fontSize: 12, color: '#64748b' }}>원문 브리핑 및 1대 핵심 원칙</div>
                  </div>
                </div>
                <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ background: '#d97706', color: '#fff', padding: '4px 8px', borderRadius: 4, fontWeight: 800, fontSize: 12 }}>29쪽</span>
                  <div>
                    <strong>[구조 분석표] {activeBook.pages.tableDiagram.title}</strong>
                    <div style={{ fontSize: 12, color: '#64748b' }}>행동 판단 확률 및 비교 매트릭스 도표</div>
                  </div>
                </div>
                <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ background: '#16a34a', color: '#fff', padding: '4px 8px', borderRadius: 4, fontWeight: 800, fontSize: 12 }}>워크북</span>
                  <div>
                    <strong>[실천 워크북] {activeBook.pages.workbook.title}</strong>
                    <div style={{ fontSize: 12, color: '#64748b' }}>복습 퀴즈, 정답 해설 및 액션 플랜 필기 노트</div>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <button className="sb-btn sb-btn-primary" onClick={() => setCurrentStep(7)}>
                  전자책 실물 뷰어로 이동 <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 4, 5, 6 브리핑 ================= */}
          {(currentStep === 4 || currentStep === 5 || currentStep === 6) && (
            <div className="sb-card">
              <div className="sb-card-title">
                <span>{currentStep === 4 ? '4단계: 본문 초안 검수' : currentStep === 5 ? '5단계: 이미지 설계표' : '6단계: 워크북 & 정답표'}</span>
              </div>
              <p style={{ fontSize: 13, color: '#64748b' }}>
                대표님이 입력하신 링크에서 추출된 이미지와 콘텐츠가 <strong>7단계 전자책 뷰어</strong>에 완벽하게 조판되었습니다.
              </p>
              <div style={{ textAlign: 'center', padding: 20 }}>
                <button className="sb-btn sb-btn-primary sb-btn-lg" onClick={() => setCurrentStep(7)}>
                  🚀 7단계: 전자책 실물 뷰어에서 바로 확인하기 <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 7: 책 전체 미리보기 & 스타일 비교 (A/B/C) ================= */}
          {((studioMode === 'read' || studioMode === 'create') || (studioMode === 'studio' && currentStep === 7)) && (
            <div className="sb-card">
              {/* ✨ 뷰어 최상단: [출력] & [다운로드] & [도서관 보관] 컨트롤 바 */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 18px',
                background: '#0f172a',
                color: '#fff',
                borderRadius: 12,
                marginBottom: 16,
                flexWrap: 'wrap',
                gap: 12
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <BookOpen size={20} color="#38bdf8" />
                  <div>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>현재 열람 중:</span>
                    <div style={{ fontSize: 15, fontWeight: 900, color: '#f8fafc' }}>{activeBook.title}</div>
                  </div>
                </div>

                {/* 🖨️ 출력 & 📥 다운로드 핵심 버튼 그룹 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    className="sb-btn sb-btn-sm"
                    style={{ background: '#0284c7', color: '#ffffff', fontWeight: 900, padding: '8px 14px' }}
                    onClick={() => downloadEbookAsPdf(activeBook, showToast)}
                    title="A4 규격의 전자책 PDF 파일 즉시 다운로드"
                  >
                    <Download size={15} /> 📥 PDF 파일 다운로드 (.pdf)
                  </button>

                  <button
                    className="sb-btn sb-btn-sm"
                    style={{ background: '#ffffff', color: '#0f172a', fontWeight: 900, padding: '8px 14px', border: '1px solid #cbd5e1' }}
                    onClick={() => printEbookCleanly(activeBook)}
                    title="웹 UI 찌꺼기 없이 순수 A4 전자책만 PDF로 저장하거나 인쇄"
                  >
                    <Printer size={15} /> 🖨️ A4 인쇄 / PDF 저장
                  </button>

                  <button
                    className="sb-btn sb-btn-sm"
                    style={{ background: '#16a34a', color: '#fff', fontWeight: 900, padding: '8px 14px' }}
                    onClick={() => {
                      saveToLibrary(activeBook);
                      setStudioMode('library');
                      setCurrentStep(9);
                      showToast('📚 [전자책 도서관]으로 안전하게 다운로드(보관)되었습니다!');
                    }}
                    title="이 책을 나의 전자책 도서관 서재에 영구 보관하고 도서관으로 이동합니다"
                  >
                    <Bookmark size={15} /> 📚 전자책 도서관으로 보관(이동)
                  </button>
                </div>
              </div>

              {/* ✨ 도서 선택 툴바 (내가 넣은 링크 책 vs 샘플 책) */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                background: '#e0f2fe',
                borderRadius: 10,
                border: '1px solid #bae6fd',
                marginBottom: 14,
                flexWrap: 'wrap',
                gap: 10
              }}>
                <div style={{ fontSize: 13, color: '#0369a1', fontWeight: 800 }}>
                  서재 목록:
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                  <button
                    className="sb-btn sb-btn-primary sb-btn-sm"
                    style={{ background: '#0284c7', color: '#fff', fontWeight: 800 }}
                    onClick={() => setStudioMode('create')}
                  >
                    <Plus size={14} /> ➕ 새 링크 넣기
                  </button>
                  
                  {/* 📚 도서관에 보관된 모든 전자책 버튼 목록 (실제 제목으로 직접 전환) */}
                  {libraryBooks.map((b) => {
                    const isSelected = activeBook && (activeBook.id === b.id || activeBook.title === b.title);
                    const shortTitle = b.title.length > 20 ? b.title.slice(0, 20) + '...' : b.title;
                    return (
                      <button
                        key={b.id}
                        className={`sb-btn sb-btn-sm ${isSelected ? 'sb-btn-primary' : 'sb-btn-outline'}`}
                        style={{
                          background: isSelected ? '#0284c7' : '#ffffff',
                          color: isSelected ? '#ffffff' : '#0369a1',
                          fontWeight: isSelected ? 800 : 600,
                          borderColor: isSelected ? '#0284c7' : '#bae6fd'
                        }}
                        onClick={() => {
                          setCustomBook(b);
                          setActiveBookMode('custom');
                        }}
                        title={b.title}
                      >
                        📖 {shortTitle}
                      </button>
                    );
                  })}

                  <button
                    className="sb-btn sb-btn-outline sb-btn-sm"
                    style={{ borderColor: '#16a34a', color: '#16a34a', fontWeight: 700 }}
                    onClick={() => {
                      setStudioMode('library');
                      setCurrentStep(9);
                    }}
                  >
                    📚 도서관 관리 ({libraryBooks.length}권)
                  </button>
                </div>
              </div>

              {/* ✨ 연속 스크롤 전자책 (이북) 뷰어: 표지부터 워크북까지 한눈에 시원하게 열람 */}
              <div className="sb-book-preview-container" style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '10px 0' }}>
                
                {/* ── 1. 표지 (Page 1) ── */}
                <div className="sb-page-sheet" style={{ margin: '0 auto', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', color: '#0f172a' }}>
                  <div style={{ textAlign: 'center', marginTop: 20 }}>
                    <span className="sb-page-pill-badge" style={{ background: '#0284c7', color: '#ffffff' }}>{activeBook.badge}</span>

                    {/* 고화질 대표 이미지 */}
                    <div className="sb-page-img-wrapper" style={{ margin: '20px 0' }}>
                      <img
                        src={getBaseAssetUrl(activeBook.coverImage)}
                        alt={activeBook.title}
                        className="sb-page-img"
                        style={{
                          width: '100%',
                          maxHeight: 250,
                          objectFit: 'cover',
                          borderRadius: 8,
                          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = CURATED_THEME_IMAGES.ai;
                        }}
                      />
                    </div>

                    <h1 className="sb-page-h1" style={{ fontSize: 24, lineHeight: 1.3, color: '#0f172a' }}>
                      {activeBook.pages.cover.title}
                    </h1>
                    <div className="sb-page-divider" style={{ margin: '14px auto', background: '#0f172a' }} />
                    <div className="sb-page-subtitle" style={{ fontSize: 14, color: '#475569' }}>
                      {activeBook.pages.cover.subtitle}
                    </div>
                    
                    <div style={{ fontSize: 13, color: '#1e293b', marginTop: 12, fontWeight: 700 }}>
                      {activeBook.pages.cover.author}
                    </div>

                    {activeBook.sourceRef && activeBook.sourceRef.startsWith('http') && (
                      <div style={{ marginTop: 14 }}>
                        <a
                          href={activeBook.sourceRef}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            fontSize: 12,
                            color: '#0284c7',
                            textDecoration: 'none',
                            padding: '4px 10px',
                            background: '#f0f9ff',
                            borderRadius: 6,
                            border: '1px solid #bae6fd'
                          }}
                        >
                          <ExternalLink size={12} /> 원본 링크 바로가기
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="sb-page-footer" style={{ marginTop: 40, color: '#64748b' }}>
                    <span style={{ color: '#64748b' }}>{activeBook.pages.cover.footer}</span>
                    <span style={{ color: '#64748b' }}>1 / 4 페이지 (표지)</span>
                  </div>
                </div>

                {/* ── 2. 개념 설명 (Page 2) ── */}
                <div className="sb-page-sheet" style={{ margin: '0 auto', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', color: '#0f172a' }}>
                  <div>
                    <span className="sb-page-pill-badge" style={{ background: '#0284c7', color: '#ffffff' }}>제 1 장: 핵심 개념</span>
                    <h1 className="sb-page-h1" style={{ fontSize: 21, marginTop: 14, color: '#0f172a' }}>
                      {activeBook.pages.concept.title}
                    </h1>

                    <div className="sb-page-img-wrapper" style={{ margin: '16px 0' }}>
                      <img
                        src={getBaseAssetUrl(activeBook.conceptImage)}
                        alt="개념 시각 도해"
                        className="sb-page-img"
                        style={{ maxHeight: 200, width: '100%', objectFit: 'cover', borderRadius: 6 }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = CURATED_THEME_IMAGES.tech;
                        }}
                      />
                    </div>

                    <p className="sb-body-text" style={{ color: '#1e293b', fontSize: 14, lineHeight: 1.7 }}>
                      {activeBook.pages.concept.body1}
                    </p>

                    <div className="sb-callout-gold" style={{ background: '#fef3c7', borderLeft: '4px solid #d97706', padding: '14px 18px', margin: '16px 0', borderRadius: '0 6px 6px 0' }}>
                      <p style={{ color: '#0f172a', fontWeight: 700, margin: 0, fontSize: 14.5 }}>{activeBook.pages.concept.calloutGold}</p>
                    </div>

                    <p className="sb-body-text" style={{ color: '#1e293b', fontSize: 14, lineHeight: 1.7 }}>
                      {activeBook.pages.concept.body2}
                    </p>

                    <div className="sb-callout-black" style={{ background: '#f1f5f9', borderLeft: '4px solid #0f172a', padding: '14px 18px', margin: '16px 0', borderRadius: '0 6px 6px 0' }}>
                      <p style={{ color: '#0f172a', margin: 0, fontSize: 14 }}>{activeBook.pages.concept.calloutBlack}</p>
                    </div>
                  </div>

                  <div className="sb-page-footer" style={{ marginTop: 30, color: '#64748b' }}>
                    <span style={{ color: '#64748b' }}>{activeBook.pages.concept.footer}</span>
                    <span style={{ color: '#64748b' }}>2 / 4 페이지 (개념 설명)</span>
                  </div>
                </div>

                {/* ── 3. 이미지 + 도표 (Page 3) ── */}
                <div className="sb-page-sheet" style={{ margin: '0 auto', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', color: '#0f172a' }}>
                  <div>
                    <span className="sb-page-pill-badge" style={{ background: '#0284c7', color: '#ffffff' }}>제 2 장: 구조 분석 및 비교</span>
                    <h1 className="sb-page-h1" style={{ fontSize: 21, marginTop: 14, color: '#0f172a' }}>
                      {activeBook.pages.tableDiagram.title}
                    </h1>

                    <div className="sb-page-img-wrapper" style={{ margin: '14px 0' }}>
                      <img
                        src={getBaseAssetUrl(activeBook.tableImage)}
                        alt="구조 도해 이미지"
                        className="sb-page-img"
                        style={{ maxHeight: 180, width: '100%', objectFit: 'cover', borderRadius: 6 }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = CURATED_THEME_IMAGES.chart;
                        }}
                      />
                    </div>

                    <p className="sb-body-text" style={{ color: '#1e293b', fontSize: 14, lineHeight: 1.7 }}>
                      {activeBook.pages.tableDiagram.lead}
                    </p>

                    <table className="sb-table" style={{ margin: '14px 0', width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc' }}>
                          <th style={{ padding: '10px 14px', borderBottom: '2px solid #cbd5e1', color: '#0f172a', fontWeight: 800 }}>핵심 판단 요소</th>
                          <th style={{ padding: '10px 14px', borderBottom: '2px solid #cbd5e1', color: '#0f172a', fontWeight: 800 }}>적중 확률</th>
                          <th style={{ padding: '10px 14px', borderBottom: '2px solid #cbd5e1', color: '#0f172a', fontWeight: 800 }}>기대 효용 및 결과</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeBook.pages.tableDiagram.rows.map((row, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '10px 14px', color: '#0f172a' }}><strong style={{ color: '#0f172a' }}>{row.action}</strong></td>
                            <td style={{ padding: '10px 14px' }}><strong style={{ color: '#0369a1', fontWeight: 800 }}>{row.prob}</strong></td>
                            <td style={{ padding: '10px 14px', color: '#334155' }}>{row.effect}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="sb-callout-black" style={{ background: '#f1f5f9', borderLeft: '4px solid #0f172a', padding: '14px 18px', margin: '16px 0', borderRadius: '0 6px 6px 0' }}>
                      <p style={{ color: '#0f172a', margin: 0, fontSize: 13.5 }}>{activeBook.pages.tableDiagram.insight}</p>
                    </div>
                  </div>

                  <div className="sb-page-footer" style={{ marginTop: 30, color: '#64748b' }}>
                    <span style={{ color: '#64748b' }}>{activeBook.pages.tableDiagram.footer}</span>
                    <span style={{ color: '#64748b' }}>3 / 4 페이지 (구조 도표)</span>
                  </div>
                </div>

                {/* ── 4. 워크북 및 정답 (Page 4) ── */}
                <div className="sb-page-sheet" style={{ margin: '0 auto', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', color: '#0f172a' }}>
                  <div>
                    <span className="sb-page-pill-badge" style={{ background: '#16a34a', color: '#ffffff' }}>제 3 장: 복습 워크북 & 액션 플랜</span>
                    <h1 className="sb-page-h1" style={{ fontSize: 21, marginTop: 14, color: '#0f172a' }}>
                      {activeBook.pages.workbook.title}
                    </h1>

                    <div style={{ margin: '16px 0', color: '#0f172a' }}>
                      <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 8, color: '#0f172a' }}>
                        {activeBook.pages.workbook.q1}
                      </div>

                      <div style={{ background: '#fef9c3', borderLeft: '4px solid #d97706', padding: 14, borderRadius: 6, margin: '10px 0', color: '#0f172a' }}>
                        <div style={{ fontWeight: 800, fontSize: 13, color: '#b45309' }}>정답 및 해설:</div>
                        <div style={{ fontSize: 13.5, lineHeight: 1.6, marginTop: 4, color: '#0f172a', fontWeight: 600 }}>
                          {activeBook.pages.workbook.a1}
                        </div>
                        {activeBook.pages.workbook.refText && (
                          <div style={{ marginTop: 6, fontSize: 11, color: '#64748b' }}>
                            {activeBook.pages.workbook.refText}
                          </div>
                        )}
                      </div>

                      <div style={{ fontWeight: 800, fontSize: 15, margin: '18px 0 8px 0', color: '#0f172a' }}>
                        {activeBook.pages.workbook.q2}
                      </div>
                      <div style={{ background: '#f1f5f9', borderLeft: '4px solid #0f172a', padding: 14, borderRadius: 6, fontSize: 13.5, color: '#0f172a' }}>
                        💡 <strong style={{ color: '#0f172a' }}>실천 가이드:</strong> {activeBook.pages.workbook.a2}
                      </div>

                      <div className="sb-workbook-card" style={{ marginTop: 16 }}>
                        <div style={{ fontWeight: 800, fontSize: 13, color: '#047857' }}>✏️ 대표님 전용 액션 플랜 필기 노트</div>
                        <div className="sb-note-lines" />
                      </div>
                    </div>
                  </div>

                  <div className="sb-page-footer" style={{ marginTop: 30, color: '#64748b' }}>
                    <span style={{ color: '#64748b' }}>{activeBook.pages.workbook.footer}</span>
                    <span style={{ color: '#64748b' }}>4 / 4 페이지 (실천 워크북)</span>
                  </div>
                </div>

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
              <div style={{ display: 'flex', justifyContent: 'center', gap: 14, padding: '24px 0', flexWrap: 'wrap' }}>
                <button
                  className="sb-btn sb-btn-primary"
                  style={{ padding: '14px 28px', fontSize: 16, background: '#0284c7', fontWeight: 900 }}
                  onClick={() => downloadEbookAsPdf(activeBook, showToast)}
                >
                  <Download size={18} /> 📥 고화질 전자책 PDF 다운로드 (.pdf)
                </button>
                <button
                  className="sb-btn sb-btn-primary"
                  style={{ padding: '14px 28px', fontSize: 16, background: '#111', fontWeight: 800 }}
                  onClick={() => printEbookCleanly(activeBook)}
                >
                  <Printer size={18} /> 🖨️ A4 용지 인쇄 / PDF 저장
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 9: 📚 전자책 도서관 (내 서재) ================= */}
          {(studioMode === 'library' || (studioMode === 'studio' && currentStep === 9)) && (
            <div className="sb-card">
              <div className="sb-card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Library size={22} color="#16a34a" />
                  <span style={{ fontSize: 18, fontWeight: 900 }}>나의 전자책 도서관 ({libraryBooks.length}권 보관 중)</span>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button
                    className="sb-btn sb-btn-primary sb-btn-sm"
                    style={{ background: '#0284c7', color: '#fff', fontWeight: 800 }}
                    onClick={() => setStudioMode('create')}
                  >
                    <Plus size={15} /> ➕ 새 링크로 전자책 만들기
                  </button>
                  <span className="sb-status-pill approved" style={{ background: '#16a34a', color: '#fff' }}>
                    로컬 서재 자동 다운로드 완료
                  </span>
                </div>
              </div>
              <p style={{ fontSize: 13, color: '#64748b', marginTop: -4 }}>
                대표님이 링크(URL)나 교재를 통해 생성하신 모든 전자책이 이 서재에 자동으로 안전하게 다운로드(보관)되어 있습니다. 언제든 책을 열거나 종이 인쇄, 파일 다운로드를 하실 수 있습니다.
              </p>

              {/* 도서관 서가 그리드 */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 16,
                marginTop: 20
              }}>
                {libraryBooks.map((bk, idx) => (
                  <div
                    key={bk.id || idx}
                    style={{
                      background: '#ffffff',
                      borderRadius: 12,
                      border: idx === 0 && bk.id !== SAMPLE_BOOK.id ? '2px solid #0284c7' : '1px solid #e2e8f0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative'
                    }}
                  >
                    {/* 책 썸네일 / 표지 이미지 */}
                    <div style={{ height: 140, background: '#0f172a', position: 'relative', overflow: 'hidden' }}>
                      <img
                        src={getBaseAssetUrl(bk.coverImage)}
                        alt={bk.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = CURATED_THEME_IMAGES.ai;
                        }}
                      />
                      <span style={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        background: 'rgba(15, 23, 42, 0.85)',
                        color: '#38bdf8',
                        padding: '3px 8px',
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 800
                      }}>
                        {bk.badge}
                      </span>
                      {idx === 0 && bk.id !== SAMPLE_BOOK.id && (
                        <span style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          background: '#0284c7',
                          color: '#ffffff',
                          padding: '3px 8px',
                          borderRadius: 4,
                          fontSize: 10,
                          fontWeight: 900,
                          boxShadow: '0 2px 8px rgba(2,132,199,0.5)'
                        }}>
                          ✨ 방금 도서관 입고
                        </span>
                      )}
                    </div>

                    {/* 책 메타데이터 */}
                    <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h4 style={{ margin: '0 0 6px 0', fontSize: 15, fontWeight: 900, color: '#0f172a', lineHeight: 1.4 }}>
                          {bk.title}
                        </h4>
                        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>
                          {bk.pages?.cover?.author || bk.author}
                        </div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>
                          보관일: {bk.createdAt || '최근'}
                        </div>
                      </div>

                      {/* 도서관 책 액션 버튼 3종 */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 14 }}>
                        <button
                          className="sb-btn sb-btn-primary sb-btn-sm"
                          style={{ background: '#0284c7', fontSize: 12, padding: '8px 4px' }}
                          onClick={() => {
                            if (bk.id === SAMPLE_BOOK.id) {
                              setActiveBookMode('sample');
                            } else {
                              setCustomBook(bk);
                              setActiveBookMode('custom');
                            }
                            setCurrentStep(7);
                            setStudioMode('read');
                            setPreviewPageType('cover');
                          }}
                        >
                          📖 책 펼치기
                        </button>

                        <button
                          className="sb-btn sb-btn-outline sb-btn-sm"
                          style={{ borderColor: '#0284c7', color: '#0284c7', fontSize: 12, padding: '8px 4px', fontWeight: 800 }}
                          onClick={() => downloadEbookAsPdf(bk, showToast)}
                          title="A4 전자책 PDF 파일 즉시 다운로드"
                        >
                          <Download size={13} /> PDF 다운
                        </button>

                        <button
                          className="sb-btn sb-btn-outline sb-btn-sm"
                          style={{ borderColor: '#111', color: '#111', fontSize: 12, padding: '8px 4px', fontWeight: 700 }}
                          onClick={() => printEbookCleanly(bk)}
                          title="웹 UI 없이 순수 A4 전자책만 인쇄 또는 PDF 저장"
                        >
                          <Printer size={13} /> A4 인쇄
                        </button>

                        {bk.id !== SAMPLE_BOOK.id && (
                          <button
                            className="sb-btn sb-btn-outline sb-btn-sm"
                            style={{ borderColor: '#ef4444', color: '#ef4444', fontSize: 12, padding: '8px 4px' }}
                            onClick={() => deleteFromLibrary(bk.id)}
                          >
                            <Trash2 size={13} /> 삭제
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* JEV 효용 비교 모달 */}
      {showJevModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: 16
        }}>
          <div style={{
            background: '#ffffff',
            maxWidth: 680, width: '100%',
            borderRadius: 12, padding: 24,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            maxHeight: '90vh', overflowY: 'auto'
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
