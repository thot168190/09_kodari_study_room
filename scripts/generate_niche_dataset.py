import os
import json
import asyncio
import aiohttp
import argparse
from dotenv import load_dotenv

# .env 파일 로드 (Gemini API 키 탑재 대비)
load_dotenv()

GEMINI_API_KEY = os.getenv("VITE_GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY")

# 다양한 업종/키워드 시드셋 제공 (지능적인 1만 개 합성 다양성 확보용)
SEEDS = [
    "수의 진료, 수의학, 동물병원, 반려동물 케어",
    "부동산 정산, 매매 거래, 등기부등본, 중개업 업무 자동화",
    "건설 자재, 도면 견적, 물량 산출, 입찰 내역",
    "비영리 재단 보조금 매칭, Grant, 공공 지원금 작성 보조",
    "호텔 예약, 숙박 연동, OTA 미들웨어, 펜션 관리",
    "법률 사건, 소장 요약, 판례 탐색, 변호사 업무 보조",
    "알뜰폰 요금제 비교, 가계 통신비 절약, 통신사 마이데이터",
    "오프라인 등산 지도, 조난 생존 가이드, 산악 조난 응급처치",
    "지하철 오프라인 웹서핑, 기내 학습 서재, 인터넷 먹통 상황 지식",
    "제조 공정 불량 감지, 중소기업 설비 센서 모니터링",
    "학원 셔틀버스 노선 최적화, 학부모 알림장 자동화",
    "소상공인 세무 기장, 간이과세자 부가세 환급 알림",
    "농가 병충해 도감, 기후 기반 농작물 추천, 스마트팜 제어",
    "인테리어 자재 실시간 비교, 3D 가상 배치 이미지 합성",
    "로컬 카페 원두 재고 매칭, 당일 마감 세일 알림 푸시"
]

PROMPT_TEMPLATE = r"""당신은 1인 AI 창업가들을 위한 니치 비즈니스 분석 전문가입니다.
아래 제공된 [도메인 테마 키워드]들을 힌트 삼아, 아주 그럴싸하고 다양한 형태의 '1인 창업 아이디어 웅얼웅얼 글' 5개를 창작하고, 
각각의 아이디어를 '니치 발굴기 v0 판정 시스템' 기준에 맞춰 정밀 채점한 JSON 배열을 반환해 주십시오.

[도메인 테마 키워드]:
{keywords}

[평가 기준 설명]:
1. pain (페인 강도): 0(있으면 좋음)~3(당장 돈 낼 만큼 아픔)
2. data (데이터 접근): 0(원천봉쇄)~3(합성/제휴/RAG/공공 등 활짝)
3. wheel (플라이휠): 0(안쌓임)~3(쓸수록 자동 축적)
4. competitor (강자 부재): 0(이미 강자독점)~3(무주공산)
5. veto (규제 킬스위치): 인체 의료기록, 금융 원장, 개인신용정보 원본 등 규제 원천봉쇄 분야면 true, 안전하면 false
6. ragStart (RAG 시작): 진입을 RAG/프롬프트로 즉시 낮게 시작할 수 있으면 true, 도면해석/인프라구축 등 어려우면 false
7. domainSkill (도메인 감별력): 일반 대중이 감별력을 빠르게 얻을 수 있을 만한 분야면 true, 극도로 전문적인 도메인이면 false

[요구사항]:
반드시 아래의 JSON 배열 구조로만 정확히 응답해 주십시오. 다른 주석, 부연 설명, 마크다운 백틱 (```json ...) 기호를 절대 쓰지 말고 오직 순수한 JSON만 반환해야 합니다.

[
  {
    "rawInput": "사용자가 편하게 웅얼웅얼 작성한 긴 사업 아이디어 본문 글 (2~3줄)",
    "name": "요약된 15자 이내의 한글 후보 이름 (예: 오프라인 등산 생존 AI)",
    "pain": 0~3 사이의 숫자,
    "data": 0~3 사이의 숫자,
    "wheel": 0~3 사이의 숫자,
    "competitor": 0~3 사이의 숫자,
    "veto": true 또는 false,
    "ragStart": true 또는 false,
    "domainSkill": true 또는 false,
    "desc": "한두 줄의 핵심 판정 근거 요약 메모 (대표님께 보고하는 존댓말 어조)"
  },
  ... (총 5개 생성)
]"""

async def get_mock_data(seed_idx):
    await asyncio.sleep(0.01) # 초고속 생성을 위해 대기시간 축소
    keywords = SEEDS[seed_idx % len(SEEDS)]
    results = []
    
    # 5개의 다양한 mock 아이디어를 테마에 따라 생성
    mock_sentences = [
        f"{keywords} 프로세스에서 데이터를 안전하게 모으고 파이프라인을 설계하는 온프레미스 AI 시스템",
        f"1인 메이커가 {keywords} 관련 업무를 메일 및 노션과 연동해 완전 자동으로 해결해주는 마이크로 SaaS",
        f"소상공인을 대상으로 {keywords} 데이터를 자동 스크래핑 및 정제하여 카카오톡 알림톡으로 쏴주는 구독 서비스",
        f"네트워크가 차단된 내부망 PC에서 실행되는 보안 특화 {keywords} RAG 검색 엔진 패키지",
        f"구형 태블릿에서도 쌩쌩하게 작동하는 {keywords} 전문 모바일 어시스턴트 애플리케이션"
    ]
    
    for i, raw_input in enumerate(mock_sentences):
        results.append({
            "rawInput": raw_input,
            "name": f"{keywords.split(',')[0][:6]} 자동화 {seed_idx * 5 + i}",
            "pain": (seed_idx + i) % 4, # 0~3점 분산
            "data": (seed_idx * i) % 4,
            "wheel": (seed_idx + i * 2) % 4,
            "competitor": (seed_idx + 3) % 4,
            "veto": (seed_idx % 15 == 0), # 가끔 Veto 발동 모사
            "ragStart": (seed_idx % 2 == 0),
            "domainSkill": (seed_idx % 3 != 0),
            "desc": f"[코다리 판정] {keywords.split(',')[0]} 테마에 대해 {raw_input[:15]}... 아이디어는 1인 적합도가 확인됩니다."
        })
    return results

async def fetch_synthetic_data(session, semaphore, seed_idx):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:key={GEMINI_API_KEY}"
    keywords = SEEDS[seed_idx % len(SEEDS)]
    payload = {
        "contents": [{
            "parts": [{"text": PROMPT_TEMPLATE.replace("{keywords}", keywords)}]
        }]
    }

    async with semaphore:
        for attempt in range(3):  # 재시도 로직 포함
            try:
                async with session.post(url, json=payload, headers={"Content-Type": "application/json"}) as response:
                    if response.status == 200:
                        data = await response.json()
                        raw_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                        if raw_text.startswith("```"):
                            raw_text = raw_text.replace("```json", "").replace("```", "").strip()
                        
                        # JSON 대괄호 바운더리 안전 파싱
                        start = raw_text.find("[")
                        end = raw_text.rfind("]") + 1
                        if start != -1 and end != -1:
                            raw_text = raw_text[start:end]

                        parsed = json.loads(raw_text)
                        return parsed
                    else:
                        err_body = await response.text()
                        print(f"[-] API HTTP Error (status={response.status}): {err_body}")
            except Exception as e:
                print(f"[-] {keywords} 생성 실패 (시도 {attempt+1}/3): {e}")
                await asyncio.sleep(2 ** attempt)
        return []

async def main():
    parser = argparse.ArgumentParser(description="니치 판정기용 DoRA 학습 데이터셋 생성기")
    parser.add_argument("--count", type=int, default=100, help="생성할 데이터 총 개수")
    parser.add_argument("--output", type=str, default="niche_synthetic_dataset.json", help="저장할 파일 경로")
    parser.add_argument("--mock", action="store_true", help="Gemini API를 호출하지 않고 Mock 데이터로 강제 대량 생성")
    args = parser.parse_args()

    use_mock = args.mock or (not GEMINI_API_KEY)
    if use_mock:
        print("[!] Mock 데이터 모드로 학습 데이터셋을 초고속 생성합니다.")

    print(f"[*] 총 {args.count}개의 니치 판정 합성 데이터 생성을 시작합니다...")
    
    # 동시 요청 제한 (비용 및 Rate Limit 조절용 세마포어)
    semaphore = asyncio.Semaphore(5)
    
    # 1회 호출당 5개씩 생성하므로, 필요한 배치 횟수 계산
    batches = (args.count // 5) + (1 if args.count % 5 != 0 else 0)
    
    async with aiohttp.ClientSession() as session:
        # fetch_synthetic_data 함수에 use_mock 플래그 전달
        tasks = []
        for i in range(batches):
            if use_mock:
                # Mock 모드일 때는 세마포어나 session 포스팅 없이 즉시 mock 데이터 생성 로직 호출
                tasks.append(get_mock_data(i))
            else:
                tasks.append(fetch_synthetic_data(session, semaphore, i))
        results = await asyncio.gather(*tasks)
        
    flat_results = []
    for res in results:
        if isinstance(res, list):
            flat_results.extend(res)
            
    # 지정한 개수만큼 슬라이싱
    final_dataset = flat_results[:args.count]

    # JSON 포맷으로 저장
    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(final_dataset, f, ensure_ascii=False, indent=2)

    print(f"[+] 성공! 총 {len(final_dataset)}개의 학습 데이터가 '{args.output}'에 저장되었습니다.")

if __name__ == "__main__":
    asyncio.run(main())
