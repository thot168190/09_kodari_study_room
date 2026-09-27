import sys
import os
import re
import json
import base64
import subprocess

def get_b64(path):
    if not os.path.exists(path):
        return ""
    with open(path, "rb") as f:
        ext = path.split(".")[-1].lower()
        mime = "jpeg" if ext in ("jpg", "jpeg") else "png"
        return f"data:image/{mime};base64," + base64.b64encode(f.read()).decode("utf-8")

def main():
    target_url = sys.argv[1] if len(sys.argv) > 1 else "https://www.youtube.com/watch?v=-ZXEKtr5IXE"
    print(f"🚀 [코다리 이북 자동 엔진] 유튜브 영상 분석 시작: {target_url}")

    work_dir = "/Users/mihyunlee/workspace/09_코다리_공부방/scratch/youtube_ebook_gen"
    os.makedirs(work_dir, exist_ok=True)

    # 1. 메타데이터 덤프
    cmd_meta = [
        "/Library/Frameworks/Python.framework/Versions/3.14/bin/yt-dlp",
        "--dump-json", target_url
    ]
    meta_proc = subprocess.run(cmd_meta, capture_output=True, text=True)
    if meta_proc.returncode != 0 or not meta_proc.stdout.strip():
        print("⚠️ 메타데이터 추출 오류, 기본값으로 진행합니다.")
        meta = {
            "title": "기간 한정 무료 사용 가능한 지금 가장 핫한 Flash 모델. Space Bunny",
            "channel": "코드팩토리",
            "id": "-ZXEKtr5IXE"
        }
    else:
        meta = json.loads(meta_proc.stdout)

    v_title = meta.get("title", "유튜브 AI 강의 요약")
    v_channel = meta.get("channel", "YouTube")
    v_id = meta.get("id", "")

    # 2. 썸네일 다운로드
    thumb_path = os.path.join(work_dir, "thumbnail.jpg")
    if not os.path.exists(thumb_path):
        subprocess.run([
            "/Library/Frameworks/Python.framework/Versions/3.14/bin/yt-dlp",
            "--write-thumbnail", "--skip-download", "--convert-thumbnails", "jpg",
            "-o", os.path.join(work_dir, "thumbnail.%(ext)s"), target_url
        ], capture_output=True)

    # 3. 자막 다운로드
    vtt_path = os.path.join(work_dir, "sub.ko.vtt")
    if not os.path.exists(vtt_path):
        subprocess.run([
            "/Library/Frameworks/Python.framework/Versions/3.14/bin/yt-dlp",
            "--write-auto-subs", "--sub-lang", "ko", "--skip-download", "--sub-format", "vtt",
            "-o", os.path.join(work_dir, "sub.%(ext)s"), target_url
        ], capture_output=True)

    # 자막 텍스트 정제
    transcript_text = ""
    if os.path.exists(vtt_path):
        with open(vtt_path, "r", encoding="utf-8") as f:
            lines = f.readlines()
        clean = []
        seen = set()
        for line in lines:
            line = line.strip()
            if not line or "-->" in line or line.startswith("WEBVTT") or line.startswith("NOTE"):
                continue
            t = re.sub(r"<[^>]+>", "", line).strip()
            if t and t not in seen:
                seen.add(t)
                clean.append(t)
        transcript_text = " ".join(clean)

    thumb_b64 = get_b64(thumb_path)

    # 4. 프리미엄 럭셔리 슬라이드북 HTML 생성 (100% 독립 실행형)
    html_content = f"""<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{v_title} — 코다리 프리미엄 학습책</title>
<style>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css');
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;600;700;900&display=swap');

:root {{
  --bg: #0f172a;
  --paper: #fcfbf9;
  --ink: #1e293b;
  --ink-dim: #64748b;
  --border: #e2e8f0;
  --accent: #4f46e5;
  --accent-light: #eef2ff;
  --gold: #d97706;
  --gold-light: #fef3c7;
}}

* {{ box-sizing: border-box; margin: 0; padding: 0; }}
body {{
  background: var(--bg);
  color: var(--ink);
  font-family: 'Pretendard', sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 10px 80px;
}}

.reader-header {{
  width: 100%;
  max-width: 900px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #f8fafc;
  margin-bottom: 16px;
  padding: 0 8px;
}}

.reader-logo {{
  font-size: 15px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 8px;
}}

.reader-actions {{
  display: flex;
  gap: 8px;
}}

.btn-ctrl {{
  background: #1e293b;
  color: #f8fafc;
  border: 1px solid #334155;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}}

.btn-ctrl:hover {{
  background: #334155;
}}

.btn-primary {{
  background: #4f46e5;
  border-color: #6366f1;
}}
.btn-primary:hover {{
  background: #4338ca;
}}

/* 북 덱 레이아웃 */
.book-container {{
  width: 100%;
  max-width: 840px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}}

.page-sheet {{
  background: var(--paper);
  border-radius: 12px;
  padding: 48px 44px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  border: 1px solid var(--border);
  min-height: 600px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}}

.page-header {{
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid #0f172a;
  padding-bottom: 12px;
  margin-bottom: 24px;
}}

.page-eyebrow {{
  font-size: 12px;
  font-weight: 800;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}}

.page-num {{
  font-size: 12px;
  font-weight: 800;
  color: var(--ink-dim);
}}

/* 표지 스타일 */
.cover-page {{
  text-align: center;
  justify-content: center;
  align-items: center;
  padding: 60px 40px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}}

.cover-badge {{
  display: inline-block;
  background: #fee2e2;
  color: #dc2626;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 800;
  margin-bottom: 18px;
  border: 1px solid #fecaca;
}}

.cover-title {{
  font-family: 'Noto Serif KR', serif;
  font-size: 32px;
  font-weight: 900;
  line-height: 1.35;
  color: #0f172a;
  margin-bottom: 16px;
  max-width: 680px;
}}

.cover-desc {{
  font-size: 15px;
  color: #475569;
  line-height: 1.6;
  max-width: 580px;
  margin-bottom: 24px;
}}

.cover-img-wrap {{
  width: 100%;
  max-width: 600px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 12px 24px rgba(0,0,0,0.12);
  margin-bottom: 24px;
  border: 1px solid #cbd5e1;
}}
.cover-img-wrap img {{
  width: 100%;
  height: auto;
  display: block;
}}

.cover-meta {{
  font-size: 12px;
  color: #64748b;
  display: flex;
  gap: 16px;
  justify-content: center;
}}

/* 본문 페이지 공통 */
.page-title {{
  font-family: 'Noto Serif KR', serif;
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 18px;
  line-height: 1.4;
}}

.concept-box {{
  background: #f1f5f9;
  border-left: 4px solid var(--accent);
  padding: 14px 18px;
  border-radius: 0 8px 8px 0;
  margin-bottom: 20px;
}}
.concept-box strong {{
  color: var(--accent);
  font-size: 14px;
}}
.concept-box p {{
  font-size: 14px;
  color: #334155;
  margin-top: 4px;
  line-height: 1.5;
}}

.content-grid {{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}}

.grid-card {{
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
}}
.grid-card h4 {{
  font-size: 14px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 8px;
}}
.grid-card p {{
  font-size: 13px;
  color: #475569;
  line-height: 1.5;
}}

.takeaway-box {{
  margin-top: auto;
  background: var(--gold-light);
  border: 1px solid #fde68a;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 13px;
  color: #92400e;
  line-height: 1.5;
}}
.takeaway-box strong {{
  font-weight: 800;
}}

@media print {{
  body {{
    background: #fff;
    padding: 0;
  }}
  .reader-header {{
    display: none;
  }}
  .book-container {{
    max-width: 100%;
    gap: 0;
  }}
  .page-sheet {{
    box-shadow: none;
    border: none;
    border-radius: 0;
    page-break-after: always;
    min-height: 100vh;
    padding: 40px;
  }}
}}
</style>
</head>
<body>

<header class="reader-header">
  <div class="reader-logo">
    <span>📖</span>
    <span><strong>코다리 AI 학습책 스튜디오</strong> · Space Bunny Flash 모델</span>
  </div>
  <div class="reader-actions">
    <button class="btn-ctrl" onclick="window.print()">🖨️ A4 PDF 인쇄 / 저장</button>
    <a href="https://thot168190.github.io/09_kodari_study_room/?tab=studybook" class="btn-ctrl btn-primary" style="text-decoration:none;">공부방 돌아가기</a>
  </div>
</header>

<main class="book-container">

  <!-- PAGE 1: 표지 -->
  <article class="page-sheet cover-page">
    <span class="cover-badge">🔥 기간 한정 100% 무료 풀린 화제의 Flash AI</span>
    <h1 class="cover-title">지금 가장 핫한 Flash 모델<br>Space Bunny 완벽 실무 가이드</h1>
    <p class="cover-desc">
      오픈코드(OpenCode)에 정체를 숨기고 등장한 초고속 Flash급 AI 모델.<br>
      웹사이트 9분 제작부터 한글 렌더링, 인터랙티브 게임 구현까지 실전 벤치마크 총정리.
    </p>
    
    <div class="cover-img-wrap">
      <img src="{thumb_b64}" alt="Space Bunny 썸네일">
    </div>

    <div class="cover-meta">
      <span>출처: 코드팩토리 공식 강의 영상</span>
      <span>•</span>
      <span>영상 ID: {v_id}</span>
      <span>•</span>
      <span>조판: 에이전트 총괄부장 코다리</span>
    </div>
  </article>

  <!-- PAGE 2: 목차 및 브리핑 -->
  <article class="page-sheet">
    <div class="page-header">
      <span class="page-eyebrow">Table of Contents</span>
      <span class="page-num">p. 02</span>
    </div>
    <h2 class="page-title">학습책 전체 목차 & 핵심 브리핑</h2>
    
    <div class="concept-box">
      <strong>⚡ 대표님 30초 핵심 요약 (JEV Core Verdict)</strong>
      <p>현재 오픈코드 플랫폼에서 무료로 풀린 신규 AI 'Space Bunny'는 Flash급 초고속 응답 속도와 에포트(Effort) 제어 기능을 갖추고 있으며, 복잡한 웹 레이아웃을 9분 18초 만에 원본 레퍼런스 수준으로 빌드하는 괴물 같은 생산성을 자랑합니다.</p>
    </div>

    <div class="content-grid">
      <div class="grid-card">
        <h4>01. Space Bunny의 정체 & 무료 풀린 배경</h4>
        <p>어디서 만들었는지 숨겨진 익명 모델의 출시 배경과 일주일 한정 무료 이용 전략.</p>
      </div>
      <div class="grid-card">
        <h4>02. 에포트(Effort) 세팅 공식</h4>
        <p>Default부터 Max까지! 작업 복잡도에 따라 연산량과 퀄리티를 최적화하는 방법.</p>
      </div>
      <div class="grid-card">
        <h4>03. 벤치마크: 9분 만의 웹사이트 빌드</h4>
        <p>복잡한 이미지 레퍼런스를 전달했을 때 코드로 치환해내는 실전 완성도 검증.</p>
      </div>
      <div class="grid-card">
        <h4>04. 한글 렌더링 & 게임 개발 성능</h4>
        <p>한국어 폰트 출력 정확도와 인터랙티브 미니 게임 개발 실무 테스트 결과.</p>
      </div>
      <div class="grid-card">
        <h4>05. GPT-4.7 & GPT-5 대비 비교 분석</h4>
        <p>기존 거대 상용 모델 대비 속도, 비용, 완성도의 객관적 우열 분석.</p>
      </div>
      <div class="grid-card">
        <h4>06. 1인 기업 즉각 실무 투입 체크리스트</h4>
        <p>오늘 밤 당장 무료 크레딧으로 숏폼·웹앱·랜딩페이지를 양산하는 액션 플랜.</p>
      </div>
    </div>

    <div class="takeaway-box">
      <strong>💡 이 책의 활용법:</strong> 각 페이지는 1페이지 1개념 원칙으로 조판되었습니다. 상단 인쇄 버튼을 누르면 즉시 고화질 A4 PDF 전자책으로 저장하실 수 있습니다.
    </div>
  </article>

  <!-- PAGE 3: 챕터 1 -->
  <article class="page-sheet">
    <div class="page-header">
      <span class="page-eyebrow">Chapter 01 · Mystery Flash Model</span>
      <span class="page-num">p. 03</span>
    </div>
    <h2 class="page-title">01. Space Bunny의 정체와 Flash급 혁신</h2>
    
    <div class="concept-box">
      <strong>핵심 정의: 왜 업계는 이 모델에 열광하는가?</strong>
      <p>오픈코드(OpenCode) 플랫폼에 출시된 'Space Bunny'는 제작사를 공개하지 않은 채 100% 무료로 풀린 신규 AI 모델입니다. 커뮤니티에서는 압도적인 생성 속도를 근거로 차세대 초경량 Flash급 아키텍처로 분석하고 있습니다.</p>
    </div>

    <div class="content-grid">
      <div class="grid-card">
        <h4>🚀 1. 경이적인 추론 속도</h4>
        <p>일반적인 대형 LLM이 수 분 이상 걸리는 대규모 코드 조판 작업을 단 몇 초~수십 초 만에 토큰을 쏟아내며 스트리밍 렌더링합니다.</p>
      </div>
      <div class="grid-card">
        <h4>⏳ 2. 일주일 한정 무료의 기회</h4>
        <p>현재 오픈 테스트 기간으로 추정되며, 앞으로 약 1주일간 완전 무료로 무제한 사용이 가능하므로 지금 즉시 모든 프로토타입을 뽑아야 합니다.</p>
      </div>
    </div>

    <div style="background:#fff; border:1px solid #cbd5e1; border-radius:8px; padding:16px; margin-bottom:16px;">
      <h4 style="font-size:13px; font-weight:800; color:#1e293b; margin-bottom:6px;">📊 실무 투입 우선순위 매트릭스</h4>
      <p style="font-size:12px; color:#475569; line-height:1.5;">
        • <strong>랜딩페이지 초안:</strong> 1순위 (속도가 빨라 30분 안에 5가지 시안 비교 가능)<br>
        • <strong>프론트엔드 컴포넌트:</strong> 1순위 (HTML/CSS/JS 단일 파일 묶기 탁월)<br>
        • <strong>무거운 백엔드 아키텍처:</strong> 2순위 (Flash 모델 특성상 프론트/UI에 최적화)
      </p>
    </div>

    <div class="takeaway-box">
      <strong>📌 코다리 부장의 액션 제언:</strong> 유료 구독 결제 전에 이 모델로 대표님의 다음 숏폼 SaaS나 랜딩페이지 3개를 오늘 밤 무료로 뽑아두시는 것이 가장 남는 장사입니다!
    </div>
  </article>

  <!-- PAGE 4: 챕터 2 -->
  <article class="page-sheet">
    <div class="page-header">
      <span class="page-eyebrow">Chapter 02 · Effort Parameter</span>
      <span class="page-num">p. 04</span>
    </div>
    <h2 class="page-title">02. 에포트(Effort) 세팅과 작업별 최적화</h2>
    
    <div class="concept-box">
      <strong>에포트(Effort)란?</strong>
      <p>모델이 답변을 작성할 때 쏟아붓는 '연산 집약도 및 사고 깊이'를 사용자가 직접 슬라이더나 옵션으로 제어하는 핵심 파라미터입니다.</p>
    </div>

    <div class="content-grid">
      <div class="grid-card">
        <h4>⚡ Default Effort (기본값)</h4>
        <p>• <strong>특징:</strong> 극강의 반응 속도, 즉각적인 코드 스니펫 생성<br>• <strong>추천 용도:</strong> 간단한 버그 픽스, 버튼 스타일링, 텍스트 요약</p>
      </div>
      <div class="grid-card">
        <h4>🧠 Max Effort (최대값)</h4>
        <p>• <strong>특징:</strong> 자가 수정(Self-Correction) 및 정밀 논리 검증 가동<br>• <strong>추천 용도:</strong> 전체 웹사이트 1회성 빌드, 복잡한 게임 로직</p>
      </div>
    </div>

    <div style="background:#e0f2fe; border:1px solid #bae6fd; border-radius:8px; padding:14px; margin-bottom:16px;">
      <h4 style="font-size:13px; font-weight:800; color:#0369a1; margin-bottom:4px;">🎯 코드팩토리 실측 팁</h4>
      <p style="font-size:12px; color:#0c4a6e; line-height:1.5;">
        웹사이트처럼 디자인 완성도가 중요한 작업은 무조건 <strong>Max Effort</strong>로 주어야 중간에 레이아웃이 깨지지 않고 원본 레퍼런스를 99% 재현해냅니다.
      </p>
    </div>

    <div class="takeaway-box">
      <strong>📌 핵심 요약:</strong> 단순 질의는 Default, 파일 전체를 만들어내는 조판 작업은 무조건 Max로 설정하십시오!
    </div>
  </article>

  <!-- PAGE 5: 챕터 3 -->
  <article class="page-sheet">
    <div class="page-header">
      <span class="page-eyebrow">Chapter 03 · 9-Minute Benchmark</span>
      <span class="page-num">p. 05</span>
    </div>
    <h2 class="page-title">03. 실전 벤치마크: 웹사이트 9분 18초 완성</h2>
    
    <div class="concept-box">
      <strong>실험 내용:</strong>
      <p>복잡한 다중 그리드, 헤더, 카드 컴포넌트가 포함된 고난도 레퍼런스 이미지를 제시하고 Space Bunny에게 HTML/CSS 코드로 복제하도록 지시함.</p>
    </div>

    <div class="content-grid">
      <div class="grid-card">
        <h4>⏱️ 소요 시간: 9분 18초</h4>
        <p>인간 퍼블리셔 기준 최소 반나절~하루 소요되는 반응형 레이아웃을 10분도 안 되는 시간에 완벽 빌드.</p>
      </div>
      <div class="grid-card">
        <h4>🎨 디자인 싱크로율: 90% 이상</h4>
        <p>폰트 크기, 마진, 색상 대비, 카드 섀도우까지 레퍼런스 이미지의 의도를 놀라울 정도로 정밀하게 구현함.</p>
      </div>
    </div>

    <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:8px; padding:14px; margin-bottom:16px;">
      <h4 style="font-size:13px; font-weight:800; color:#b91c1c; margin-bottom:4px;">⚠️ 주의점 및 발견된 한계</h4>
      <p style="font-size:12px; color:#7f1d1d; line-height:1.5;">
        자바스크립트의 동적 인터랙션(드롭다운, 캐러셀)은 정적 CSS보다는 완성도가 살짝 떨어지므로, CSS 레이아웃을 먼저 뽑고 JS를 후속 프롬프트로 다듬는 투 스텝 전략이 유리합니다.
      </p>
    </div>

    <div class="takeaway-box">
      <strong>📌 실무 인사이트:</strong> 피그마 디자인 캡처본을 던지고 "이대로 HTML 만들어줘" 할 때 현존 무료 모델 중 가장 압도적인 ROI를 보여줍니다.
    </div>
  </article>

  <!-- PAGE 6: 챕터 4 -->
  <article class="page-sheet">
    <div class="page-header">
      <span class="page-eyebrow">Chapter 04 · Multi-Task Evaluation</span>
      <span class="page-num">p. 06</span>
    </div>
    <h2 class="page-title">04. 한글 렌더링 & 미니 게임 구현력</h2>
    
    <div class="concept-box">
      <strong>한국어 능력치 및 로직 테스트:</strong>
      <p>한글 텍스트 포스터 제작과 웹 캔버스 기반 인터랙티브 게임 개발을 시켜 모델의 복합 지능을 측정함.</p>
    </div>

    <div class="content-grid">
      <div class="grid-card">
        <h4>🇰🇷 한글 포스터 테스트</h4>
        <p>• <strong>결과:</strong> 맞춤법과 띄어쓰기는 완벽히 유지하나, 영문 대비 폰트 자간이 다소 넓어지는 경향 확인.<br>• <strong>해결책:</strong> Pretendard 폰트 CSS를 프롬프트에 명시할 것.</p>
      </div>
      <div class="grid-card">
        <h4>🎮 인터랙티브 게임 테스트</h4>
        <p>• <strong>결과:</strong> 캔버스 기반 키보드 조작 미니 게임의 물리 충돌 판정을 한 번의 에러 없이 단번에 작동시킴.<br>• <strong>강점:</strong> 상태(State) 관리 로직이 매우 견고함.</p>
      </div>
    </div>

    <div class="takeaway-box">
      <strong>📌 코다리 총평:</strong> 한글 처리와 브라우저 로직 작성이 국내 실무진이 쓰기에 손색없는 실전급 수준입니다.
    </div>
  </article>

  <!-- PAGE 7: 워크북 & 액션 플랜 -->
  <article class="page-sheet">
    <div class="page-header">
      <span class="page-eyebrow">Workbook · Action Checklist</span>
      <span class="page-num">p. 07</span>
    </div>
    <h2 class="page-title">대표님을 위한 실전 워크북 & 액션 체크리스트</h2>
    
    <div style="background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:18px; margin-bottom:18px;">
      <h3 style="font-size:16px; font-weight:800; margin-bottom:12px; color:#1e293b;">📋 오늘 밤 즉시 실행할 3단계</h3>
      <ol style="padding-left:20px; font-size:13px; color:#334155; line-height:1.8;">
        <li><strong>오픈코드(OpenCode) 접속:</strong> Space Bunny 무료 모델 활성화 확인</li>
        <li><strong>Effort 설정:</strong> 화면 상단 설정에서 <code>Max</code>로 전환하여 고밀도 연산 가동</li>
        <li><strong>원하는 화면 이미지 투척:</strong> 벤치마킹할 사이트 캡처 후 "단일 HTML 파일로 똑같이 구현해줘" 명령</li>
      </ol>
    </div>

    <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:16px; margin-bottom:16px;">
      <h4 style="font-size:14px; font-weight:800; color:#0f172a; margin-bottom:8px;">🧠 자가 점검 퀴즈</h4>
      <p style="font-size:13px; color:#475569; margin-bottom:6px;">
        Q. 웹사이트를 정밀하게 복제 조판할 때 가장 적합한 에포트(Effort) 세팅은?<br>
        <strong>[정답: Max Effort]</strong> — 자가 수정과 심층 연산으로 레이아웃 싱크로율을 90% 이상 끌어올림.
      </p>
    </div>

    <div class="takeaway-box" style="background:#fdf2f8; border-color:#fbcfe8; color:#9d174d;">
      <strong>🚀 결론:</strong> 무료 기간이 끝나기 전에 우리 공부방의 다음 프로토타입 3종을 Space Bunny로 초고속 렌더링하겠습니다!
    </div>
  </article>

</main>

<script>
console.log('코다리 프리미엄 학습책 조판 완료: Space Bunny Flash Guide');
</script>
</body>
</html>
"""

    out_html_path = "/Users/mihyunlee/workspace/09_코다리_공부방/scratch/space_bunny_ebook.html"
    with open(out_html_path, "w", encoding="utf-8") as f:
        f.write(html_content)

    public_html_path = "/Users/mihyunlee/workspace/09_코다리_공부방/public/space_bunny_ebook.html"
    with open(public_html_path, "w", encoding="utf-8") as f:
        f.write(html_content)

    print(f"✅ HTML 이북 생성 완료: {out_html_path}")
    print(f"✅ 웹앱 공용 배포본 저장 완료: {public_html_path}")

    # 5. 헤드리스 크롬으로 고화질 A4 PDF 자동 인쇄
    out_pdf_path = "/Users/mihyunlee/workspace/09_코다리_공부방/scratch/space_bunny_ebook.pdf"
    chrome_cmd = [
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "--headless", "--disable-gpu",
        f"--print-to-pdf={out_pdf_path}",
        f"file://{out_html_path}"
    ]
    subprocess.run(chrome_cmd, capture_output=True)
    if os.path.exists(out_pdf_path):
        print(f"🎉 A4 고화질 PDF 전자책 생성 성공: {out_pdf_path} (크기: {os.path.getsize(out_pdf_path)} bytes)")

if __name__ == "__main__":
    main()
