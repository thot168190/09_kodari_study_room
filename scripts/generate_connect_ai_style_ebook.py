# -*- coding: utf-8 -*-
"""
정원석 교수 Connect AI LAB 공식 교재 스타일 100% 복제 전자책 생성기
- 웜크림 배경색 (#FAF8F5)
- 검은색 사각 뱃지 번호 & 중앙 정렬 섹션 간지
- 오렌지색 인용 바 (| 구어체 실제 발언) & 검은색 보충 설명 바
- 번호 스텝 (큰 숫자 1, 2, 3...)
- QR 코드 영상 안내 페이지
- 낱말 풀이 표 (소리/모델/도구별 용어 해설)
- 하단 고정 푸터: Connect AI LAB · AI CITY BUILDERS  X / Total
"""

import subprocess
import os

OUT_HTML = "/Users/mihyunlee/workspace/09_코다리_공부방/reports/ebook_RAG_Uncensor_JEVRL_완전정복.html"
OUT_PDF = "/Users/mihyunlee/workspace/09_코다리_공부방/reports/ebook_RAG_Uncensor_JEVRL_완전정복.pdf"

# HTML & CSS 구성
html_pages = []

def make_page(content, page_num, total_pages=36):
    return f"""
    <div class="page">
      <div class="page-content">
        {content}
      </div>
      <div class="page-footer">
        <span class="footer-left">Connect AI LAB · AI CITY BUILDERS</span>
        <span class="footer-right">{page_num} / {total_pages}</span>
      </div>
    </div>
    """

# ----------------- 1. 표지 (Page 1) -----------------
p1 = """
<div class="cover-container">
  <div class="top-badge">나만의 인공지능 · 특별편</div>
  <div class="cover-illu">
    <svg width="220" height="150" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="25" width="180" height="110" rx="16" fill="#EDE8DF"/>
      <circle cx="110" cy="70" r="32" fill="#2563EB" opacity="0.9"/>
      <path d="M100 60L125 70L100 80Z" fill="#FFFFFF"/>
      <rect x="50" y="115" width="120" height="8" rx="4" fill="#D5CDBE"/>
    </svg>
  </div>
  <h1 class="cover-main-title">두뇌에 지식과 속도를 달다</h1>
  <div class="title-underline"></div>
  <p class="cover-sub-title">RAG, Uncensor, 그리고 강화학습 JEVRL</p>
  <div class="cover-author">정원석 지음 · Connect AI LAB</div>
</div>
"""

# ----------------- 2. 목차 (Page 2) -----------------
p2 = """
<div class="toc-container">
  <div class="section-label">차 례</div>
  <h2 class="toc-title">이 챕터에서</h2>
  
  <div class="toc-list">
    <div class="toc-item">
      <div class="toc-num">1</div>
      <div class="toc-text">
        <div class="toc-heading">흐름이 바뀌었습니다</div>
        <div class="toc-desc">1970년부터 쌓인 연구들의 대폭발과 9월 15일</div>
      </div>
    </div>
    <div class="toc-item">
      <div class="toc-num">2</div>
      <div class="toc-text">
        <div class="toc-heading">두뇌를 만드는 법</div>
        <div class="toc-desc">단순한 함수 f(x)에서 거대 두뇌(LLM)까지</div>
      </div>
    </div>
    <div class="toc-item">
      <div class="toc-num">3</div>
      <div class="toc-text">
        <div class="toc-heading">프롬프트의 한계</div>
        <div class="toc-desc">귓속말로는 만 페이지를 못 넣습니다</div>
      </div>
    </div>
    <div class="toc-item">
      <div class="toc-num">4</div>
      <div class="toc-text">
        <div class="toc-heading">RAG를 연결하다</div>
        <div class="toc-desc">문서를 쪼개어 외장 하드로 달아주기</div>
      </div>
    </div>
    <div class="toc-item">
      <div class="toc-num">5</div>
      <div class="toc-text">
        <div class="toc-heading">에너지와 비용의 벽</div>
        <div class="toc-desc">만 페이지가 넘어가면 왜 느려지고 비싸지나</div>
      </div>
    </div>
    <div class="toc-item">
      <div class="toc-num">6</div>
      <div class="toc-text">
        <div class="toc-heading">Graph RAG</div>
        <div class="toc-desc">키워드를 점과 선으로 엮어 광속 탐색하기</div>
      </div>
    </div>
    <div class="toc-item">
      <div class="toc-num">7</div>
      <div class="toc-text">
        <div class="toc-heading">강화학습 선택 모델 JEVRL</div>
        <div class="toc-desc">다 읽지 않고 최적의 길을 찍어냅니다</div>
      </div>
    </div>
    <div class="toc-item">
      <div class="toc-num">8</div>
      <div class="toc-text">
        <div class="toc-heading">치명적인 오해 교정</div>
        <div class="toc-desc">언어모델을 새로 만드는 게 아닙니다</div>
      </div>
    </div>
    <div class="toc-item">
      <div class="toc-num">9</div>
      <div class="toc-text">
        <div class="toc-heading">언센서(Uncensored) 로컬 AI</div>
        <div class="toc-desc">멍청이라고 말해줘, 바보라고 말해줘</div>
      </div>
    </div>
    <div class="toc-item">
      <div class="toc-num">10</div>
      <div class="toc-text">
        <div class="toc-heading">1인 기업 자비스 아키텍처</div>
        <div class="toc-desc">지식(RAG) + 자유(Uncensor) + 판단(JEVRL)</div>
      </div>
    </div>
    <div class="toc-item">
      <div class="toc-num">11</div>
      <div class="toc-text">
        <div class="toc-heading">낱말 풀이</div>
        <div class="toc-desc">오늘 나온 말들을 한자리에</div>
      </div>
    </div>
  </div>
  
  <div class="bottom-notice">각 절 끝에 강의 영상이 붙어 있습니다. QR 을 찍으면 휴대폰에서도 열립니다.</div>
</div>
"""

# ----------------- 3. 섹션 1 간지 (Page 3) -----------------
p3 = """
<div class="section-cover">
  <div class="black-num-badge">1</div>
  <h2 class="sec-cover-title">흐름이 바뀌었습니다</h2>
  <div class="sec-cover-sub">1970년부터 쌓인 연구들의 대폭발과 9월 15일</div>
  <div class="title-underline"></div>
  <div class="cover-illu" style="margin-top: 50px;">
    <svg width="180" height="120" viewBox="0 0 180 120" fill="none">
      <rect x="20" y="20" width="140" height="80" rx="12" fill="#EAE5DC"/>
      <path d="M40 70L70 45L100 65L140 35" stroke="#2563EB" stroke-width="4" stroke-linecap="round"/>
      <circle cx="140" cy="35" r="5" fill="#2563EB"/>
    </svg>
  </div>
</div>
"""

# ----------------- 4. 섹션 1 본문 1 (Page 4) -----------------
p4 = """
<h2 class="content-heading">서랍 속 논문들이 쏟아져 나오는 시대</h2>

<p class="body-text">최근에 인공지능 흐름 자체가 조금 변했습니다.</p>
<p class="body-text">갑자기 세상에 없던 돌연변이가 생겨난 것이 아닙니다. 1970년대부터 2017년 정도까지 연구실과 도서관 서랍 속에 쌓여 있던 수많은 연구 논문들이 하나씩 세상 밖으로 제품이 되어 나오는 시기를 맞이한 것입니다.</p>

<div class="quote-orange">
  이때 나왔었던 연구들이 채지PT로 나오고, 클로드로 나오고, 이미지 생성 모델, 영상 생성 모델로 이제 사람들이 쓸 수 있는 정도로 성장을 하게 된 거죠.
</div>

<p class="body-text">과거에는 수식과 아이디어로만 존재하던 이론들이 이제 누구나 클릭 한 번으로 쓸 수 있는 상용 도구가 되었습니다.</p>
"""

# ----------------- 5. 섹션 1 본문 2 (Page 5) -----------------
p5 = """
<h2 class="content-heading">2024년 9월 15일, JEV(JEVRL)의 출현</h2>

<p class="body-text">그런데 최근에, 바로 9월 15일쯤에 중요한 모델이 하나 세상에 나왔습니다.</p>

<div class="quote-orange">
  JEV라고 해서 강화학습을 기반으로 한 의사 결정 선택 모델인데요. 사람들은 이 JEV를 봤을 때 이해를 깊게 하지 못하지만, 결국 로컬 AI 성장의 거대한 흐름에 있습니다.
</div>

<p class="body-text">단순히 글을 잘 쓰는 생성 모델의 시대에서, 스스로 최적의 판단을 내리는 <strong>의사결정 선택 모델</strong>의 시대로 중심축이 이동하고 있습니다.</p>

<div class="step-container">
  <div class="step-num">1</div>
  <div class="step-title">로컬 AI 두뇌</div>
  <div class="step-desc">내 컴퓨터 안에서 직접 돌아가는 언어모델</div>
</div>

<div class="step-container">
  <div class="step-num">2</div>
  <div class="step-title">강화학습 선택 모델 (JEV)</div>
  <div class="step-desc">수많은 정보 중 무엇을 택할지 광속으로 결정하는 지휘관</div>
</div>

<div class="quote-black">
  이 둘이 연결되면서 비로소 스스로 일하는 '자동화 에이전트(자비스)'가 완성됩니다.
</div>
"""

# ----------------- 6. 섹션 1 QR (Page 6) -----------------
p6 = """
<div class="qr-container">
  <div class="qr-top-label">영 상 으 로 보 기</div>
  <h2 class="qr-heading">특강 ① 흐름의 변화와 9월 15일 JEV(JEVRL)</h2>
  <div class="qr-sub">정원석 교수 강의 · 첫 부분</div>
  <div class="qr-hr"></div>

  <div class="qr-box">
    <div class="qr-img-placeholder">
      <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" fill="#FFFFFF"/>
        <path d="M10 10H40V40H10V10ZM20 20V30H30V20H20Z" fill="#111827"/>
        <path d="M60 10H90V40H60V10ZM70 20V30H80V20H70Z" fill="#111827"/>
        <path d="M10 60H40V90H10V60ZM20 70V80H30V70H20Z" fill="#111827"/>
        <rect x="50" y="50" width="10" height="10" fill="#111827"/>
        <rect x="70" y="70" width="20" height="20" fill="#111827"/>
        <rect x="50" y="80" width="10" height="10" fill="#111827"/>
      </svg>
    </div>
    <div class="qr-info">
      <div class="qr-url">youtu.be/e5h42JnuzkQ</div>
      <div class="qr-desc">휴대폰으로 찍으면 바로 열립니다</div>
    </div>
  </div>
</div>
"""

# ----------------- 7. 섹션 2 간지 (Page 7) -----------------
p7 = """
<div class="section-cover">
  <div class="black-num-badge">2</div>
  <h2 class="sec-cover-title">두뇌를 만드는 법</h2>
  <div class="sec-cover-sub">단순한 함수 f(x)에서 거대 두뇌(LLM)까지</div>
  <div class="title-underline"></div>
</div>
"""

# ----------------- 8. 섹션 2 본문 1 (Page 8) -----------------
p8 = """
<h2 class="content-heading">인공지능의 본질은 함수였습니다</h2>

<p class="body-text">처음에 사람들은 이렇게 고민을 시작했습니다.<br>
<em>"인공지능 두뇌를 대체 어떻게 만들까?"</em></p>

<p class="body-text">그 시작은 다름 아닌 <strong>함수(Function)</strong> 아이디어였습니다. 인간이 학습하는 방식과 비슷한 복잡한 함수 구조를 만들었습니다.</p>

<div class="step-container">
  <div class="step-num">1</div>
  <div class="step-title">타이타닉 생존 예측 모델</div>
  <div class="step-desc">나이, 성별, 탑승 등급을 넣었더니 생존 여부를 맞히기 시작했습니다.</div>
</div>

<div class="step-container">
  <div class="step-num">2</div>
  <div class="step-title">아파트 가격 예측 모델</div>
  <div class="step-desc">평수와 위치를 넣었더니 적정 매매 가격을 산출했습니다.</div>
</div>

<div class="quote-orange">
  빈 인공지능 모델에다가 지식을 학습시켰더니 어? 예측을 하네. 생존했다, 생존하지 않았다. 여기까지 이해되셨죠?
</div>
"""

# ----------------- 9. 섹션 2 본문 2 (Page 9) -----------------
p9 = """
<h2 class="content-heading">말을 배우기 시작한 인공신경망</h2>

<p class="body-text">숫자 예측에 성공하자 사람들의 욕심이 생기기 시작했습니다.</p>

<div class="quote-orange">
  타이타닉을 생존할 수 있는 인공지능 모델이라면, 혹시 이거 말고 내가 데이터를 엄청나게 줄게. 사람들이 말하는 대화, 블로그 글, 영화 자막 글에 관련된 데이터를 줄 테니까 그걸 학습해 봐.
</div>

<p class="body-text">수조 단위의 문장 데이터를 붓고 손실(Loss)을 줄여나갔더니, 마침내 신경망이 단어와 맥락을 이해하며 인간처럼 말을 하기 시작했습니다.</p>
<p class="body-text">이것이 바로 오늘날 전 세계를 뒤흔든 <strong>거대언어모델(LLM)</strong>의 탄생입니다.</p>

<div class="quote-black">
  인간이 규칙을 일일이 짜주지 않아도, 데이터와 오차(Loss)만 주면 기계가 스스로 규칙을 찾아낸다는 원리입니다.
</div>
"""

# ----------------- 10. 섹션 3 간지 (Page 10) -----------------
p10 = """
<div class="section-cover">
  <div class="black-num-badge">3</div>
  <h2 class="sec-cover-title">프롬프트의 한계</h2>
  <div class="sec-cover-sub">귓속말로는 만 페이지를 못 넣습니다</div>
  <div class="title-underline"></div>
</div>
"""

# ----------------- 11. 섹션 3 본문 (Page 11) -----------------
p11 = """
<h2 class="content-heading">모델을 바꿀 수 없다면 입구에서 속이자</h2>

<p class="body-text">챗GPT가 말을 잘하니까 사람들은 또 다른 욕심이 생겼습니다.<br>
<em>"말은 잘하는데, 내가 누군지 나랑 더 친한 인공지능을 만들 수는 없을까?"</em></p>

<p class="body-text">하지만 수백억 원이 들어간 챗GPT 가중치 파일은 공개되어 있지도 않고, 일반인이 내 지식을 직접 넣어서 재학습시킬 수도 없습니다.</p>

<div class="quote-orange">
  입력값을 넣기 전에, 인풋에다가 나의 정보와 내가 명령하고자 하는 것을 합쳐서 넣는 겁니다. 예를 들어 '나는 제이야, 학교는 어디 나왔고 취미는 뭐야. 나한테 맞는 운동과 식단을 짜줘' 이렇게요.
</div>

<p class="body-text">이것이 바로 <strong>프롬프트 엔지니어링</strong>과 <strong>인컨텍스트 러닝(Few-shot / Zero-shot)</strong>의 시작이었습니다.</p>

<div class="quote-black">
  하지만 프롬프트 글자 수(컨텍스트 윈도우)에는 한계가 있고, 매번 질문할 때마다 내 모든 정보를 복사해 넣을 수는 없었습니다.
</div>
"""

# ----------------- 12. 섹션 4 간지 (Page 12) -----------------
p12 = """
<div class="section-cover">
  <div class="black-num-badge">4</div>
  <h2 class="sec-cover-title">RAG를 연결하다</h2>
  <div class="sec-cover-sub">문서를 쪼개어 외장 하드로 달아주기</div>
  <div class="title-underline"></div>
</div>
"""

# ----------------- 13. 섹션 4 본문 (Page 13) -----------------
p13 = """
<h2 class="content-heading">내 문서와 일기장을 두뇌에 연결하다</h2>

<p class="body-text">사람들의 욕심은 멈추지 않았습니다.</p>

<div class="quote-orange">
  나는 간단한 소개뿐만 아니라 내 10년 치 일기장, 내 회사가 가지고 있는 사규 문서, 특별한 노하우를 전부 여기에 연결하고 싶어.
</div>

<p class="body-text">그래서 등장한 기술이 바로 <strong>검색 증강 생성(RAG: Retrieval-Augmented Generation)</strong>입니다.</p>

<div class="step-container">
  <div class="step-num">1</div>
  <div class="step-title">문서 저장 (Vector DB)</div>
  <div class="step-desc">외부 문서를 잘게 쪼개어 숫자의 나열(벡터)로 저장해 둡니다.</div>
</div>

<div class="step-container">
  <div class="step-num">2</div>
  <div class="step-title">검색 (Retrieval)</div>
  <div class="step-desc">질문이 들어오면 관련된 문서 조각을 톡톡 찾아냅니다.</div>
</div>

<div class="step-container">
  <div class="step-num">3</div>
  <div class="step-title">생성 (Generation)</div>
  <div class="step-desc">찾아낸 조각을 프롬프트에 동봉하여 언어모델에게 넘깁니다.</div>
</div>
"""

# ----------------- 14. 섹션 5 간지 (Page 14) -----------------
p14 = """
<div class="section-cover">
  <div class="black-num-badge">5</div>
  <h2 class="sec-cover-title">에너지와 비용의 벽</h2>
  <div class="sec-cover-sub">만 페이지가 넘어가면 왜 느려지고 비싸지나</div>
  <div class="title-underline"></div>
</div>
"""

# ----------------- 15. 섹션 5 본문 (Page 15) -----------------
p15 = """
<h2 class="content-heading">RAG의 치명적 병목: 비효율과 비용 폭발</h2>

<p class="body-text">문서가 한 페이지, 두 페이지일 때는 RAG가 완벽해 보였습니다.</p>

<div class="quote-orange">
  근데 여기 문서에다 딱 넣다 보니까 야, 문서 뭐 한두 페이지는 오케이인데 이게 막 만 페이지 정도 되니까 엄청나게 분량이 많아져 가지고 시간도 오래 걸리고, 요거를 찾는 데 생성하는 에너지가 너무 많이 드는데 비효율적인 거 아니야라는 생각을 하게 됩니다.
</div>

<p class="body-text">문서가 방대해지면 발생하는 삼중고:</p>
<div class="step-container">
  <div class="step-num">1</div>
  <div class="step-title">검색 지연</div>
  <div class="step-desc">수십만 개의 벡터를 비교하느라 속도가 극도로 느려집니다.</div>
</div>
<div class="step-container">
  <div class="step-num">2</div>
  <div class="step-title">전력 에너지 낭비</div>
  <div class="step-desc">질문 하나에 답하려고 막대한 컴퓨팅 파워를 씁니다.</div>
</div>
<div class="step-container">
  <div class="step-num">3</div>
  <div class="step-title">API 비용 폭발</div>
  <div class="step-desc">토큰 소모량이 급증하여 배보다 배꼽이 더 커집니다.</div>
</div>
"""

# ----------------- 16. 섹션 6 간지 (Page 16) -----------------
p16 = """
<div class="section-cover">
  <div class="black-num-badge">6</div>
  <h2 class="sec-cover-title">Graph RAG</h2>
  <div class="sec-cover-sub">키워드를 점과 선으로 엮어 광속 탐색하기</div>
  <div class="title-underline"></div>
</div>
"""

# ----------------- 17. 섹션 6 본문 (Page 17) -----------------
p17 = """
<h2 class="content-heading">제이(Jay)의 프로필로 보는 지식 그래프</h2>

<p class="body-text">전체 문서를 처음부터 다 뒤지는 대신, <strong>키워드를 그래프화</strong>하여 찾는 방식이 등장했습니다.</p>

<div class="quote-orange">
  문서에 '안녕하세요. 저는 제이입니다. 취미는 무엇이고, 어떤 학교를 나왔고, 어떤 회사를 다녔고, 이러이러한 것을 좋아합니다'가 있다면 키워드가 [이름 제이, 직업, 교육, AI, 학교]가 있겠죠?
</div>

<p class="body-text">질문: <em>"제이의 직업에 관련된 블로그 글을 써줘."</em></p>
<p class="body-text">문서 전체를 처음부터 뒤지지 않고, 키워드 중에서 '직업'을 딱 찾습니다. 그리고 연결된 <strong>[직업 - AI], [직업 - 교육], [직업 - 학교]</strong> 데이터만 가져옵니다.</p>

<div class="quote-black">
  앞에 썼던 RAG의 검색 시간을 획기적으로 줄여주었지만, 세상의 모든 방대한 데이터를 일일이 그래프로 그리는 것 역시 한계에 부딪혔습니다.
</div>
"""

# ----------------- 18. 섹션 7 간지 (Page 18) -----------------
p18 = """
<div class="section-cover">
  <div class="black-num-badge">7</div>
  <h2 class="sec-cover-title">강화학습 선택 모델 JEVRL</h2>
  <div class="sec-cover-sub">다 읽지 않고 최적의 길을 찍어냅니다</div>
  <div class="title-underline"></div>
</div>
"""

# ----------------- 19. 섹션 7 본문 (Page 19) -----------------
p19 = """
<h2 class="content-heading">State, Action, Policy의 에이전트 결합</h2>

<p class="body-text">그래프 RAG조차 방대한 데이터 앞에서는 느리고 비싸다는 불만이 터져 나왔습니다. 그래서 9월 15일 등장한 것이 <strong>강화학습 기반 의사결정 모델 'JEV(JEVRL)'</strong>입니다.</p>

<div class="quote-orange">
  JEV라는 것은 이 모델을 기반으로 합니다. 스테이트, 액션, 폴리시. 이 스테이트 자체가 지금 정보들이거든요. 인풋, 숨겨진 정보, PDF 파일, 엄청나게 많은 정보들이 한꺼번에 들어왔을 때 가장 효율적으로 선택할 수 있는 방법을 미리 학습시켜 놓고 빠르게 결정하는 방법입니다.
</div>

<div class="step-container">
  <div class="step-num">1</div>
  <div class="step-title">상태 (State)</div>
  <div class="step-desc">질문, 수만 장의 PDF, 에이전트의 현재 작업 기억</div>
</div>

<div class="step-container">
  <div class="step-num">2</div>
  <div class="step-title">행동 (Action)</div>
  <div class="step-desc">어떤 문서를 읽을지 결정하는 탐색 후보 (Action 1, 2, 3...)</div>
</div>

<div class="step-container">
  <div class="step-num">3</div>
  <div class="step-title">정책 (Policy)</div>
  <div class="step-desc">가장 적은 시간과 비용으로 정답을 찍어내는 선택 규칙</div>
</div>
"""

# ----------------- 20. 섹션 8 간지 (Page 20) -----------------
p20 = """
<div class="section-cover">
  <div class="black-num-badge">8</div>
  <h2 class="sec-cover-title">치명적인 오해 교정</h2>
  <div class="sec-cover-sub">언어모델을 새로 만드는 게 아닙니다</div>
  <div class="title-underline"></div>
</div>
"""

# ----------------- 21. 섹션 8 본문 (Page 21) -----------------
p21 = """
<h2 class="content-heading">선택 모델만 가볍게 붙이는 혁신</h2>

<p class="body-text">여기서 수강생들이 가장 많이 헷갈려하는 결정적 오해를 정원석 교수가 바로잡습니다.</p>

<div class="quote-orange">
  어? 멘토님, 지금 강화학습을 넣는다는 건 생성 모델(LLM) 자체를 새로 학습시키는 건가요? 아닙니다! 그게 아니라, 여기서는 이미 학습이 되어진 '선택 모델'만 여기다가 추가하는 거예요.
</div>

<p class="body-text">거대 언어모델(LLM)은 이미 말을 완벽하게 잘하도록 만들어져 있습니다. 굳이 수억 원을 들여 언어모델을 새로 강화학습시킬 이유가 없습니다.</p>

<div class="quote-black">
  우리가 추가하는 것은, 똑똑한 언어모델의 입에 '무엇을 골라 넣어줄지'를 0.1초 만에 판단해 주는 초경량 강화학습 선택기뿐입니다.
</div>
"""

# ----------------- 22. 섹션 9 간지 (Page 22) -----------------
p22 = """
<div class="section-cover">
  <div class="black-num-badge">9</div>
  <h2 class="sec-cover-title">언센서(Uncensored) 로컬 AI</h2>
  <div class="sec-cover-sub">멍청이라고 말해줘, 바보라고 말해줘</div>
  <div class="title-underline"></div>
</div>
"""

# ----------------- 23. 섹션 9 본문 (Page 23) -----------------
p23 = """
<h2 class="content-heading">금기된 지식을 학습시키는 진짜 이유</h2>

<p class="body-text">정원석 교수는 두 번째 기둥으로 <strong>언센서(Uncensor)</strong>를 선언합니다.</p>

<div class="quote-orange">
  두 번째는 언센서를 배울 겁니다. 얘는 원래 인공지능이 배워서는 안 될 '야 멍청이라고 말을 해줘', '너는 바보야라고 말을 해줘' 이런 식으로 기존에 우리가 알고 있는 인공지능이 배워서는 안 될 것들을 여기다가 학습시키는 방법을 알려드리도록 하겠습니다.
</div>

<p class="body-text">빅테크의 클라우드 AI는 도덕적 검열 때문에 경쟁사 분석, 공격적 마케팅 카피, 날것의 비즈니스 명령을 거부합니다.</p>

<div class="quote-black">
  '멍청이, 바보'라는 비유의 본질은, 빅테크의 도덕적 훈계를 걷어내고 오직 대표님의 사업 명령에만 100% 충성하는 '완전한 통제권'을 회복하자는 뜻입니다.
</div>
"""

# ----------------- 24. 섹션 10 간지 (Page 24) -----------------
p24 = """
<div class="section-cover">
  <div class="black-num-badge">10</div>
  <h2 class="sec-cover-title">1인 기업 자비스 아키텍처</h2>
  <div class="sec-cover-sub">지식(RAG) + 자유(Uncensor) + 판단(JEVRL)</div>
  <div class="title-underline"></div>
</div>
"""

# ----------------- 25. 섹션 10 본문 (Page 25) -----------------
p25 = """
<h2 class="content-heading">대표님의 명령에서 자동화 출하까지</h2>

<p class="body-text">우리의 최종 목적지는 챗봇이 아닙니다.<br>
대표님 곁에서 24시간 사업을 함께 굴리는 <strong>'1인 기업 전담 자비스'</strong>입니다.</p>

<div class="quote-orange">
  우리가 결국엔 궁극적으로 뭐 AI 자비스, 나만의 인공지능 에이전트 비서, 나만의 1인 기업 이런 식으로 발전하게 될 텐데... 그것에 큰 흐름이 될 지식과 실습을 알려드리겠습니다.
</div>

<div class="step-container">
  <div class="step-num">1</div>
  <div class="step-title">지식 엔진 (RAG)</div>
  <div class="step-desc">내 회사의 업무 매뉴얼과 성공 데이터를 AI 뇌세포에 연결합니다.</div>
</div>

<div class="step-container">
  <div class="step-num">2</div>
  <div class="step-title">자유 엔진 (Uncensor)</div>
  <div class="step-desc">빅테크 간섭 없이 대표님의 명령을 날것 그대로 수행합니다.</div>
</div>

<div class="step-container">
  <div class="step-num">3</div>
  <div class="step-title">판단 엔진 (JEVRL)</div>
  <div class="step-desc">수만 장 문서 속에서 가장 빠르고 저렴한 정답 경로를 찍어냅니다.</div>
</div>
"""

# ----------------- 26. 10강 실전 로드맵 (Page 26) -----------------
p26 = """
<h2 class="content-heading">정원석 교수의 10강 실전 로드맵</h2>

<p class="body-text">정 교수는 이 복잡해 보이는 기술을 10강 안에 완벽히 끝내겠다고 공언했습니다.</p>

<div class="step-container">
  <div class="step-num">1</div>
  <div class="step-title">1~3강: RAG 지식 주입</div>
  <div class="step-desc">로컬 환경에 경량 모델을 세팅하고 사내 문서를 연결하는 기초 실습</div>
</div>

<div class="step-container">
  <div class="step-num">2</div>
  <div class="step-title">4~6강: Uncensored 통제권 확보</div>
  <div class="step-desc">검열 필터를 해제하고 비즈니스 전용 페르소나를 가볍게 파인튜닝</div>
</div>

<div class="step-container">
  <div class="step-num">3</div>
  <div class="step-title">7~10강: JEVRL 강화학습 결합 & 자비스 완성</div>
  <div class="step-desc">강화학습 선택 모델을 앞단에 붙여 초고속 자율 에이전트 파이프라인 완성</div>
</div>

<div class="quote-orange">
  이제는 흐름이 바뀔 때가 되었구나, 새로운 것으로 넘어갈 때가 됐구나라는 걸 빠르게 캐치해서 알려드리는 게 훨씬 더 좋은 교육이라고 생각합니다. 자, 그러면 달려보시죠!
</div>
"""

# ----------------- 27. 낱말 풀이 간지 (Page 27) -----------------
p27 = """
<div class="section-cover">
  <div class="black-num-badge">11</div>
  <h2 class="sec-cover-title">낱말 풀이</h2>
  <div class="sec-cover-sub">오늘 나온 말들을 한자리에</div>
  <div class="title-underline"></div>
</div>
"""

# ----------------- 28. 낱말 풀이 표 1 (Page 28) -----------------
p28 = """
<h2 class="content-heading">지식과 두뇌에 관한 말</h2>

<table class="term-table">
  <thead>
    <tr>
      <th style="width: 25%;">말</th>
      <th>뜻</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>LLM</strong></td>
      <td>거대언어모델. 수조 개의 문장을 학습하여 인간처럼 말을 구사하는 인공 두뇌.</td>
    </tr>
    <tr>
      <td><strong>프롬프트</strong></td>
      <td>모델을 재학습시키지 않고 질문 앞머리에 내 정보를 슬쩍 덧붙여서 답을 유도하는 기교.</td>
    </tr>
    <tr>
      <td><strong>RAG</strong></td>
      <td>검색 증강 생성. 사규나 일기장 같은 외부 문서를 벡터 검색하여 답변을 생성하는 외장 하드.</td>
    </tr>
    <tr>
      <td><strong>Graph RAG</strong></td>
      <td>단순 단락 검색을 넘어, 개체(노드)와 관계(엣지)를 그물망으로 엮어 키워드 단위로 정밀 탐색하는 기법.</td>
    </tr>
    <tr>
      <td><strong>JEVRL</strong></td>
      <td>강화학습 기반 의사결정 모델. 수만 페이지 문서 앞에서도 가장 최적의 경로를 찰나에 찍어내는 선택기.</td>
    </tr>
  </tbody>
</table>

<div class="quote-black">
  이 장은 강의에 나온 설명뿐 아니라, 읽으실 때 막히지 않도록 정성껏 정리한 부록입니다.
</div>
"""

# ----------------- 29. 낱말 풀이 표 2 (Page 29) -----------------
p29 = """
<h2 class="content-heading">도구와 통제권에 관한 말</h2>

<table class="term-table">
  <thead>
    <tr>
      <th style="width: 25%;">말</th>
      <th>뜻</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>언센서(Uncensored)</strong></td>
      <td>빅테크의 윤리·도덕적 검열 필터를 제거하여, 사용자의 어떠한 사업 명령에도 100% 충성하는 모델.</td>
    </tr>
    <tr>
      <td><strong>로컬 AI</strong></td>
      <td>남의 서버(클라우드)를 거치지 않고 내 컴퓨터 하드웨어에서 단독 실행되는 완전한 내 소유의 인공지능.</td>
    </tr>
    <tr>
      <td><strong>State (상태)</strong></td>
      <td>질문 내용, 수만 페이지 문서, 숨겨진 맥락 등 에이전트 눈앞에 주어진 모든 환경 데이터.</td>
    </tr>
    <tr>
      <td><strong>Action (행동)</strong></td>
      <td>어느 문서를 먼저 볼지, 요약본을 볼지 원문을 볼지 에이전트가 내리는 탐색 선택.</td>
    </tr>
    <tr>
      <td><strong>Policy (정책)</strong></td>
      <td>가장 적은 시간과 비용으로 정답을 찍어내도록 사전 훈련된 강화학습 최적 규칙.</td>
    </tr>
  </tbody>
</table>

<div class="quote-black">
  남의 컴퓨터를 빌리는 클라우드 방식과, 내 컴퓨터에 소유하는 로컬 방식의 차이를 아는 것이 1인 기업 스케일업의 핵심입니다.
</div>
"""

# ----------------- 30. 한 가지 당부 & 에필로그 (Page 30) -----------------
p30 = """
<h2 class="content-heading">한 가지 당부 & 코다리 총평</h2>

<p class="body-text">※ 강의에 없는 이야기입니다. 그래도 대표님을 위해 적어 둡니다.</p>

<div class="step-container">
  <div class="step-num">1</div>
  <div class="step-title">기술은 결국 도구입니다</div>
  <div class="step-desc">RAG든 JEVRL이든, 혼자서 연구에 머물지 않고 실제 매출과 비즈니스 자동화로 연결해야 가치가 있습니다.</div>
</div>

<div class="step-container">
  <div class="step-num">2</div>
  <div class="step-title">완벽하지 않아도 됩니다</div>
  <div class="step-desc">정원석 교수의 말처럼, 한 바퀴를 먼저 완주해 본 사람은 새로운 기술이 쏟아져 나와도 두려워하지 않습니다.</div>
</div>

<div class="quote-orange">
  대표님! 지식(RAG)과 자유(Uncensor)와 속도(JEVRL)를 완벽히 꿰어내어, 대표님 한 분이 100명분의 매출을 창출하는 '1인 기업 자비스 제국'을 기필코 완수하겠습니다! 충성!
</div>
"""

pages_raw = [
    p1, p2, p3, p4, p5, p6, p7, p8, p9, p10,
    p11, p12, p13, p14, p15, p16, p17, p18, p19, p20,
    p21, p22, p23, p24, p25, p26, p27, p28, p29, p30
]

total_p = len(pages_raw)
rendered_pages = [make_page(p, i + 1, total_p) for i, p in enumerate(pages_raw)]

full_document = f"""<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>두뇌에 지식과 속도를 달다 — RAG, Uncensor, JEVRL</title>
  <link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
  <style>
    @page {{
      size: A4 portrait;
      margin: 0;
    }}
    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", sans-serif;
      -webkit-font-smoothing: antialiased;
    }}
    body {{
      background: #EAE6DF;
      color: #111827;
      word-break: keep-all;
    }}
    
    /* 각 페이지 컨테이너: A4 규격 엄격 고정 */
    .page {{
      width: 210mm;
      height: 297mm;
      margin: 0 auto;
      background: #FAF8F5; /* 공식 교재의 따뜻한 미색 */
      position: relative;
      padding: 30mm 24mm 24mm 24mm;
      page-break-after: always;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
    }}

    .page-content {{
      flex: 1;
    }}

    /* 하단 푸터 (모든 페이지 공통) */
    .page-footer {{
      height: 12mm;
      border-top: 1px solid #E5E0D8;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8.5pt;
      color: #9CA3AF;
      letter-spacing: 0.5px;
    }}

    /* 표지 스타일 */
    .cover-container {{
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding-bottom: 20mm;
    }}
    .top-badge {{
      background: #111827;
      color: #FFFFFF;
      font-size: 9.5pt;
      font-weight: 700;
      padding: 6px 16px;
      border-radius: 4px;
      letter-spacing: 1px;
      margin-bottom: 30px;
    }}
    .cover-illu {{
      margin-bottom: 35px;
    }}
    .cover-main-title {{
      font-size: 27pt;
      font-weight: 900;
      color: #111827;
      line-height: 1.25;
      letter-spacing: -0.5px;
      margin-bottom: 12px;
    }}
    .title-underline {{
      width: 32px;
      height: 3px;
      background: #111827;
      margin: 0 auto 22px auto;
    }}
    .cover-sub-title {{
      font-size: 13.5pt;
      color: #6B7280;
      font-weight: 500;
      margin-bottom: 50px;
    }}
    .cover-author {{
      font-size: 10pt;
      color: #9CA3AF;
      font-weight: 600;
    }}

    /* 목차 스타일 */
    .toc-container {{
      padding-top: 10mm;
    }}
    .section-label {{
      font-size: 10pt;
      color: #6B7280;
      margin-bottom: 6px;
    }}
    .toc-title {{
      font-size: 24pt;
      font-weight: 900;
      color: #111827;
      margin-bottom: 25px;
    }}
    .toc-list {{
      display: flex;
      flex-direction: column;
      gap: 12px;
    }}
    .toc-item {{
      display: flex;
      align-items: flex-start;
      gap: 16px;
    }}
    .toc-num {{
      font-size: 11pt;
      font-weight: 800;
      color: #111827;
      width: 18px;
    }}
    .toc-heading {{
      font-size: 11.5pt;
      font-weight: 800;
      color: #111827;
      margin-bottom: 2px;
    }}
    .toc-desc {{
      font-size: 9.5pt;
      color: #6B7280;
    }}
    .bottom-notice {{
      margin-top: 25px;
      font-size: 9pt;
      color: #6B7280;
      border-top: 1px solid #E5E0D8;
      padding-top: 12px;
    }}

    /* 섹션 간지 스타일 */
    .section-cover {{
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding-bottom: 30mm;
    }}
    .black-num-badge {{
      width: 38px;
      height: 38px;
      background: #111827;
      color: #FFFFFF;
      font-size: 14pt;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 22px;
      border-radius: 4px;
    }}
    .sec-cover-title {{
      font-size: 24pt;
      font-weight: 900;
      color: #111827;
      margin-bottom: 10px;
    }}
    .sec-cover-sub {{
      font-size: 12.5pt;
      color: #6B7280;
      margin-bottom: 18px;
    }}

    /* 본문 콘텐츠 스타일 */
    .content-heading {{
      font-size: 17pt;
      font-weight: 900;
      color: #111827;
      margin-bottom: 20px;
      letter-spacing: -0.3px;
    }}
    .body-text {{
      font-size: 11pt;
      line-height: 1.85;
      color: #374151;
      margin-bottom: 16px;
    }}

    /* 공식 교재의 핵심: 오렌지 인용 바 */
    .quote-orange {{
      border-left: 3.5px solid #D97706;
      padding: 10px 0 10px 18px;
      margin: 22px 0;
      font-size: 12pt;
      line-height: 1.75;
      color: #1F2937;
      font-weight: 500;
    }}

    /* 보충 설명 검은색 인용 바 */
    .quote-black {{
      border-left: 3px solid #111827;
      padding: 8px 0 8px 16px;
      margin: 20px 0;
      font-size: 9.5pt;
      color: #4B5563;
      line-height: 1.7;
    }}

    /* 큰 숫자 스텝 */
    .step-container {{
      margin: 18px 0;
    }}
    .step-num {{
      font-size: 13pt;
      font-weight: 800;
      color: #111827;
      margin-bottom: 4px;
    }}
    .step-title {{
      font-size: 11.5pt;
      font-weight: 800;
      color: #111827;
      margin-bottom: 4px;
    }}
    .step-desc {{
      font-size: 10.5pt;
      color: #4B5563;
      line-height: 1.6;
    }}

    /* QR 코드 페이지 */
    .qr-container {{
      padding-top: 30mm;
      text-align: center;
    }}
    .qr-top-label {{
      font-size: 9pt;
      letter-spacing: 4px;
      color: #6B7280;
      margin-bottom: 12px;
    }}
    .qr-heading {{
      font-size: 18pt;
      font-weight: 900;
      color: #111827;
      margin-bottom: 8px;
    }}
    .qr-sub {{
      font-size: 10.5pt;
      color: #6B7280;
      margin-bottom: 24px;
    }}
    .qr-hr {{
      width: 100%;
      height: 1px;
      background: #E5E0D8;
      margin-bottom: 30px;
    }}
    .qr-box {{
      border: 1px solid #E5E0D8;
      background: #FFFFFF;
      padding: 24px 30px;
      display: inline-flex;
      align-items: center;
      gap: 24px;
      text-align: left;
      border-radius: 8px;
    }}
    .qr-url {{
      font-size: 12pt;
      font-weight: 800;
      color: #111827;
      margin-bottom: 4px;
    }}
    .qr-desc {{
      font-size: 9.5pt;
      color: #6B7280;
    }}

    /* 낱말 풀이 테이블 */
    .term-table {{
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 10pt;
    }}
    .term-table th {{
      background: #F0ECE4;
      padding: 10px 14px;
      border-bottom: 1px solid #D5CDBE;
      text-align: left;
      color: #111827;
      font-weight: 700;
    }}
    .term-table td {{
      padding: 12px 14px;
      border-bottom: 1px solid #EBE6DC;
      color: #374151;
      line-height: 1.65;
    }}

    @media print {{
      body {{
        background: #FAF8F5;
      }}
      .page {{
        margin: 0;
        box-shadow: none;
      }}
    }}
  </style>
</head>
<body>
  {''.join(rendered_pages)}
</body>
</html>
"""

with open(OUT_HTML, "w", encoding="utf-8") as f:
    f.write(full_document)

print(f"HTML 조판 완료! 총 {total_p}페이지 생성. Chrome Headless 컴파일 시작...")

cmd = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={OUT_PDF}",
    f"file://{OUT_HTML}"
]

res = subprocess.run(cmd, capture_output=True, text=True)
print("Chrome exit code:", res.returncode)

if os.path.exists(OUT_PDF):
    print(f"🎉 완벽한 Connect AI LAB 공식 교재 스타일 PDF 생성 성공!")
    print(f"파일 크기: {os.path.getsize(OUT_PDF):,} bytes")
    print(f"경로: {OUT_PDF}")
else:
    print("❌ 실패:", res.stderr)
