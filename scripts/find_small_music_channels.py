"""
find_small_music_channels.py — "영상 몇 개로 수익화 기준 넘긴 음악 채널" 발굴기 (철이 v2 부속)

무엇을 하나:
  1) 음악 키워드로 최근 1년 안에 올라온 긴 영상(20분+)을 검색한다
  2) 그 영상을 올린 채널들을 모은다
  3) 영상 수 적음(기본 15개 이하) + 구독자 1,000명 이상인 채널만 남긴다
  4) 최근 12개월 영상의 "조회수 × 영상 길이"로 시청시간 상한을 계산한다
  5) 결과를 CSV로 저장한다 (시청시간 추정이 큰 순서)

주의 (대표님께):
  - 구독자·조회수·영상 수·영상 길이 = A등급 (유튜브 실측)
  - 시청시간은 "모두가 끝까지 봤다고 가정한 최대치" = C등급 추정.
    실제 시청시간은 보통 이보다 훨씬 적다. 실제 수익화 여부는 바깥에서 확인 불가.
  - 그래서 "시청시간 상한 4,000시간 이상"은 '수익화 가능성이 있는 후보'일 뿐 확정이 아님.

사용법:
  export YOUTUBE_API_KEY="발급받은키"      # yt_channel_stats.py와 같은 키
  python3 scripts/find_small_music_channels.py
  python3 scripts/find_small_music_channels.py --max-videos 12 --min-subs 1000

쿼터: 검색 1번 = 100 유닛. 기본 설정(키워드 12개 × 2페이지) ≈ 2,500 유닛. 하루 무료 10,000.
표준 라이브러리만 사용.
"""

import argparse
import csv
import datetime as dt
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

API = "https://www.googleapis.com/youtube/v3"

KEYWORDS = [
    "jazz playlist", "재즈 플레이리스트", "cafe jazz music", "카페 재즈",
    "sleep music", "수면 음악", "lofi study music", "공부할때 듣는 음악",
    "piano playlist", "피아노 플레이리스트", "healing music", "힐링 음악",
]


def api(endpoint, params):
    params = dict(params, key=os.environ.get("YOUTUBE_API_KEY", ""))
    if not params["key"]:
        sys.exit("오류: YOUTUBE_API_KEY 환경변수가 없습니다.")
    url = f"{API}/{endpoint}?{urllib.parse.urlencode(params)}"
    try:
        with urllib.request.urlopen(url, timeout=30) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "replace")
        if "quotaExceeded" in body:
            sys.exit("오류: 오늘 무료 쿼터 초과. 내일(한국시간 오후 4~5시쯤 리셋) 다시.")
        sys.exit(f"API 오류 {e.code}: {body[:300]}")


def iso_to_sec(d):
    m = re.match(r"P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", d or "")
    if not m:
        return 0
    dd, h, mi, s = (int(x or 0) for x in m.groups())
    return dd * 86400 + h * 3600 + mi * 60 + s


def chunks(lst, n=50):
    for i in range(0, len(lst), n):
        yield lst[i:i + n]


def collect_channel_ids(since, pages, keywords=None):
    ids = set()
    kw_list = keywords or KEYWORDS
    for kw in kw_list:
        token = None
        for _ in range(pages):
            p = {"part": "snippet", "q": kw, "type": "video", "videoDuration": "long",
                 "publishedAfter": since, "order": "viewCount", "maxResults": 50}
            if token:
                p["pageToken"] = token
            data = api("search", p)
            for it in data.get("items", []):
                ids.add(it["snippet"]["channelId"])
            token = data.get("nextPageToken")
            if not token:
                break
        print(f"  검색 '{kw}' 완료 — 누적 채널 {len(ids)}개")
    return list(ids)


def recent_watch_hours(uploads_id, since_dt):
    vids = []
    data = api("playlistItems", {"part": "contentDetails", "playlistId": uploads_id, "maxResults": 50})
    for it in data.get("items", []):
        pub = it["contentDetails"].get("videoPublishedAt")
        if pub and dt.datetime.fromisoformat(pub.replace("Z", "+00:00")) >= since_dt:
            vids.append(it["contentDetails"]["videoId"])
    total, longest, top_title, top_views = 0.0, 0, "", 0
    for group in chunks(vids):
        v = api("videos", {"part": "contentDetails,statistics,snippet", "id": ",".join(group)})
        for it in v.get("items", []):
            sec = iso_to_sec(it["contentDetails"]["duration"])
            views = int(it["statistics"].get("viewCount", 0))
            total += views * sec / 3600
            longest = max(longest, sec)
            if views > top_views:
                top_views, top_title = views, it["snippet"]["title"]
    return round(total), len(vids), round(longest / 60), top_title, top_views


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--max-videos", type=int, default=15)
    ap.add_argument("--min-subs", type=int, default=1000)
    ap.add_argument("--created-after", default="2026-01-01", help="채널 개설일 기준 (기본: 2026-01-01 이후 개설 채널만)")
    ap.add_argument("--pages", type=int, default=2)
    ap.add_argument("--out", default="small_music_channels.csv")
    ap.add_argument("--json", action="store_true", help="JSON 형태로도 저장")
    a = ap.parse_args()

    now = dt.datetime.now(dt.timezone.utc)
    since_dt = now - dt.timedelta(days=365)
    since = since_dt.strftime("%Y-%m-%dT%H:%M:%SZ")

    print(f"1) 키워드 검색으로 채널 모으는 중... (개설일 {a.created_after} 이후 필터)")
    ids = collect_channel_ids(since, a.pages)

    print("2) 채널 통계 확인 + 조건 거르기...")
    rows = []
    for group in chunks(ids):
        data = api("channels", {"part": "snippet,statistics,contentDetails", "id": ",".join(group)})
        for ch in data.get("items", []):
            st = ch["statistics"]
            sn = ch["snippet"]
            pub_date = sn.get("publishedAt", "")[:10]
            if pub_date < a.created_after:
                continue
            if st.get("hiddenSubscriberCount"):
                continue
            subs, vcount = int(st.get("subscriberCount", 0)), int(st.get("videoCount", 0))
            if subs < a.min_subs or vcount == 0 or vcount > a.max_videos:
                continue
            up = ch["contentDetails"]["relatedPlaylists"]["uploads"]
            hrs, n_recent, longest_min, top_title, top_views = recent_watch_hours(up, since_dt)
            rows.append({
                "채널명": sn["title"], "핸들": sn.get("customUrl", ""),
                "링크": f"https://www.youtube.com/channel/{ch['id']}",
                "구독자(A)": subs, "영상수(A)": vcount, "개설일(A)": sn["publishedAt"][:10],
                "총조회수(A)": int(st.get("viewCount", 0)),
                "최근12개월영상수(A)": n_recent, "최장영상_분(A)": longest_min,
                "최근12개월_시청시간상한(C)": hrs,
                "4000시간_상한통과": "O" if hrs >= 4000 else "X",
                "최고조회영상": top_title, "최고조회수(A)": top_views,
            })

    rows.sort(key=lambda r: r["최근12개월_시청시간상한(C)"], reverse=True)
    if not rows:
        print("조건에 맞는 채널 없음. --max-videos를 늘리거나 --pages 3으로 다시.")
        return
    with open(a.out, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)
    print(f"\n완료: 후보 {len(rows)}개 → {a.out}")
    
    if a.json:
        json_out = os.path.splitext(a.out)[0] + ".json"
        with open(json_out, "w", encoding="utf-8") as jf:
            json.dump(rows, jf, ensure_ascii=False, indent=2)
        print(f"JSON 저장 완료: {json_out}")

    for r in rows[:10]:
        print(f"  {r['채널명']} | 구독 {r['구독자(A)']:,} | 영상 {r['영상수(A)']} | "
              f"시청시간상한 {r['최근12개월_시청시간상한(C)']:,}h")


if __name__ == "__main__":
    main()
