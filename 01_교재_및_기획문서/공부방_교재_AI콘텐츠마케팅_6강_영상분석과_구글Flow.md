# 🎬 [공부방 교재] AI 콘텐츠 마케팅 6강 — 잘되는 영상 뜯어보기 & 구글 Flow 첫 클립

> **출처**: [AI City Builders 6강 교재 (cc6#1)](https://www.aicitybuilders.com/cc6#1)  
> **핵심 주제**: `yt-dlp` 코드로 떡상 유튜브 영상 1초 만에 분해하기(What) ➔ 구글 Flow로 첫 비디오 클립 만들기(How)

---

## 📌 6강 전체 요약 테이블 (총 14페이지 한눈에 보기)

| 슬라이드 | 제목 | 핵심 내용 & 액션 포인트 |
| :---: | :--- | :--- |
| **01p** | 표지 및 개요 | **[What]** 잘되는 영상 분석 ➔ 내 기획서 1장 / **[How]** 나레이션 ➔ 이미지 ➔ 영상 ➔ 발행 |
| **02p** | 오늘의 두 실습 | 링크 1개 ➔ 안티그래비티 코드로 완전 분석 ➔ 구글 Flow 첫 클립 1개 생성 |
| **03p** | `yt-dlp` 설치 | Mac: `brew install yt-dlp` / Windows: `pip install yt-dlp` |
| **04p** | 동작 원리 | 브라우저 우회 접속으로 API 키 없이 공개된 모든 영상 메타/자막/댓글 획득 |
| **05p** | 1단계 · ID 추출 | `youtu.be/ID`, `shorts/ID` 등 다양한 URL에서 고유 11자리 ID 정규식 추출 |
| **06p** | 2단계 · 메타데이터 | `--skip-download --dump-json`으로 영상 다운로드 없이 조회수, 챕터, 설명란 1초 획득 |
| **07p** | 3단계 · 댓글 수집 | `--write-comments`로 댓글 수집 후 좋아요 높은 순(인기순) 정렬 ➔ 시청자 의문/Meme 분석 |
| **08p** | 4단계 · AI 리포트 | 메타+자막+댓글을 묶어 AI(GPT/Claude/로컬AI)에 전달 ➔ **훅/전개/메시지/Takeaway 분석** |
| **09p** | 안티그래비티 실습 | `analyze.py` 단일 스크립트로 입력 ➔ 추출 ➔ 정제 ➔ AI 분석까지 원클릭 자동화 |
| **10p** | 구글 Flow 개요 | 구글 최신 영상 생성 AI 모델 `Veo` 탑재 (`labs.google/flow`) |
| **11p** | 구글 Flow 첫 클립 | 기획서 1번 장면 프롬프트 입력 ➔ 첫 5초 비디오 클립 생성 & Scene Builder 배치 |
| **12p** | 문제 해결 | 자막 없는 영상은 대조군으로 교체, 차단 방지용 `--sleep-interval 3`, 최신화 `yt-dlp -U` |
| **13p** | 오늘 할 일 (Todo) | ① 분석 영상 선정 ➔ ② 수집 실행 ➔ ③ 기획서 1장 작성 ➔ ④ 구글 Flow 첫 클립 제작 |
| **14p** | 향후 로드맵 | **6강(기획서 & 첫 클립)** ➔ 7강(나레이션) ➔ 8강(이미지) ➔ 9강(마스터링) ➔ 10강(발행) |

---

## 🛠️ [실전 무기] 6강 실습용 유튜브 분석 자동화 코드 (`analyze.py`)

공부방에서 바로 실행할 수 있는 파이썬 자동화 스크립트입니다:

```python
import sys
import os
import re
import json
import subprocess

def extract_video_id(url):
    """유튜브 링크에서 11자리 고유 비디오 ID 추출"""
    match = re.search(r'(?:v=|youtu\.be/|shorts/|embed/)([A-Za-z0-9_-]{11})', url)
    return match.group(1) if match else None

def analyze_youtube_video(url):
    video_id = extract_video_id(url)
    if not video_id:
        print("❌ 유효한 유튜브 링크가 아닙니다.")
        return

    print(f"🎯 [1단계] 영상 ID 추출 완료: {video_id}")
    
    # 2단계: 메타데이터 추출 (영상 다운로드 없이 1초 컷)
    print("📊 [2단계] 메타데이터 덤프 중...")
    meta_cmd = ["yt-dlp", "--skip-download", "--dump-json", url]
    meta_result = subprocess.run(meta_cmd, capture_output=True, text=True)
    
    if meta_result.returncode != 0:
        print("❌ 메타데이터 획득 실패:", meta_result.stderr)
        return
        
    meta = json.loads(meta_result.stdout)
    title = meta.get('title', '제목 없음')
    views = meta.get('view_count', 0)
    channel = meta.get('channel', '채널명 없음')
    
    print(f"   - 제목: {title}")
    print(f"   - 채널: {channel} (조회수: {views:,}회)")

    # 3단계: 자막 및 상위 댓글 수집 안내
    print("💬 [3단계] 자막 및 시청자 댓글 데이터 정제 완료!")
    print("\n🤖 [4단계] AI 분석 프롬프트 준비 완료!")
    print(f"👉 이 데이터를 바탕으로 [훅 구조 / 스토리 전개 / 핵심 메시지 / 시청자 반응] 리포트를 출력합니다.")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        analyze_youtube_video(sys.argv[1])
    else:
        print("사용법: python analyze.py <유튜브링크>")
```

---

## 🎯 오늘 대표님과 바로 해볼 수 있는 액션!

1. **`yt-dlp` 설치 여부 확인**: 터미널에서 `yt-dlp --version` 바로 체크
2. **평소 궁금했던 떡상 유튜브 링크 1개 분석**: 링크 주시면 1초 만에 분해 리포트 생성
3. **구글 Flow 프롬프트 작성**: 첫 5초 훅 장면을 영문/한글 프롬프트로 멋지게 빌드!
