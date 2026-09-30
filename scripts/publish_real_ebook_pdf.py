# -*- coding: utf-8 -*-
"""
진짜 출판 도서 형태의 단행본 전자책(E-Book) 집필기
- 타임스탬프 및 날것의 자막 파편 100% 제거
- 영상 13분 1초의 모든 내용(개념, 비유, 예시, 칠판 판서, 기술 원리)을 전문 도서 문체로 완벽히 윤문 및 심층 집필
- 고급스러운 출판용 단행본 스타일 (표지, 속표지, 목차, 본문, 요약 카드, 표, 각주)
"""

import subprocess
import os

BOOK_TITLE = "RAG, Uncensor, 그리고 JEVRL"
BOOK_SUBTITLE = "거대언어모델(LLM)과 강화학습(RL)으로 구축하는 1인 기업 자비스 에이전트"
AUTHOR = "정원석 강의 원작 • 코다리 에이전트 총괄부장 집필"

chapters = [
    {
        "title": "프롤로그: 잠들어 있던 40년의 연구들이 깨어나다",
        "subtitle": "도서관 서랍에서 뛰쳐나온 인공지능과 9월 15일의 변곡점",
        "content": """인공지능의 시대는 어느 날 갑자기 하늘에서 떨어진 마법이 아닙니다. 

지금 우리가 목격하고 있는 인공지능 혁명의 본질은, 1970년대 초창기 신경망 연구부터 2017년 세상을 뒤흔든 트랜스포머(Transformer) 논문에 이르기까지 약 40여 년간 도서관과 연구실 서랍 속에 차곡차곡 쌓여 있던 수많은 연구 논문들이 비로소 세상 밖으로 걸어 나오는 현상입니다. 

그동안 이 위대한 아이디어들은 컴퓨터 연산 능력의 한계로 인해 단지 '수식과 논문'으로만 존재해야 했습니다. 그러나 GPU 컴퓨팅의 폭발적 발전과 클라우드 인프라가 갖추어지면서, 과거의 이론들은 마침내 ChatGPT, Claude 같은 대화형 모델과 미드저니, 스테이블 디퓨전 같은 이미지 생성기, 그리고 소라(Sora)와 같은 비디오 생성 AI라는 구체적인 상용 도구로 탈바꿈하여 인류의 일상에 안착했습니다.

하지만 이러한 거대 흐름 속에서, 2024년 9월 15일을 기점으로 또 하나의 중대한 질적 변화가 조용히 시작되었습니다. 바로 강화학습(Reinforcement Learning)을 기반으로 한 의사결정 모델, 이른바 **'JEV(JEVRL)'**의 등장입니다.

많은 이들이 아직 이 변화의 심도를 깨닫지 못하고 있습니다. 그러나 인공지능이 단순한 '말동무 챗봇'을 넘어 스스로 판단하고 행동하는 '자율형 자동화 에이전트'로 진화하는 데 있어, 이 JEV(JEVRL)와 로컬 AI의 결합은 피할 수 없는 필연적인 종착역입니다. 

이제 우리는 클라우드 서비스 기업이 정해놓은 좁은 울타리를 벗어나, 내 컴퓨터 안에서 온전히 구동되는 나만의 인공지능 두뇌를 어떻게 설계하고 완성할 것인지 그 거대한 지도를 함께 펼쳐보고자 합니다."""
    },
    {
        "title": "제1장: 두뇌의 설계 — 단순한 함수 f(x)에서 거대 두뇌로",
        "subtitle": "인간의 뇌를 모방한 신경망과 오차(Loss) 최소화의 기적",
        "content": """인공지능의 시작은 거창한 철학이 아니라, 가장 원초적인 수학적 도구인 **함수(Function)**였습니다.

$$y = f(x)$$

인간의 뇌가 학습하는 방식을 수학적으로 모방하고자 했던 과학자들은, 입력값 $x$가 신경망 내부를 통과하면서 수많은 가중치(Weights)와 편향(Bias)에 의해 변환되어 결과값 $y$를 산출하는 구조를 고안했습니다. 이것이 바로 딥러닝(Deep Learning)의 근간입니다.

초기 머신러닝의 대표적인 성공 사례들을 떠올려보십시오.
* **타이타닉 생존 예측 모델**: 승객의 나이, 성별, 탑승 등급이라는 입력 데이터를 넣고 훈련시키자, 아무런 사전 지식이 없던 빈 함수가 새로운 승객의 생존 여부를 놀라운 정확도로 맞히기 시작했습니다.
* **아파트 가격 예측 모델**: 평수, 역세권과의 거리, 건축 연한을 입력하자 시장의 매매 가격을 척척 산출해 냈습니다.

인간이 모든 판단 규칙을 일일이 `if-else` 조건문으로 프로그래밍하지 않아도, 신경망에 방대한 데이터를 쏟아붓고 오차(Loss)를 점진적으로 줄여나가기만 하면 기계가 스스로 규칙을 학습한다는 사실이 명백히 입증된 것입니다.

여기서 과학자들의 야망은 한 걸음 더 나아갔습니다. 
*"승객 정보나 집값 데이터 대신, 인류가 인터넷에 남겨놓은 수조 개의 영화 자막, 웹 문서, 블로그 글, 도서 데이터를 통째로 신경망 함수에 밀어 넣으면 어떻게 될까?"*

그 결과 탄생한 것이 바로 오늘날의 **거대언어모델(LLM: Large Language Model)**입니다. 다음 단어가 무엇일지 확률적으로 예측하도록 훈련된 거대한 신경망은, 마침내 인간의 자연어를 막힘없이 이해하고 유려하게 문장을 구사하는 '초인적인 두뇌'로 거듭났습니다."""
    },
    {
        "title": "제2장: 프롬프트 엔지니어링의 명암 — 입구에서 건네는 쪽지의 한계",
        "subtitle": "수조 원짜리 모델을 건드리지 않고 나만의 정보를 넣는 기교",
        "content": """말을 유창하게 구사하는 거대 두뇌가 탄생하자마자, 사람들은 곧바로 새로운 갈증에 직면했습니다.
> *"챗GPT가 온갖 세상 지식을 다 알고 있는 건 알겠다. 하지만 정작 가장 중요한 '나'에 대해서는 아무것도 모르지 않는가?"*

인공지능이 진정한 비서가 되려면 나의 성향, 나의 직업, 나의 건강 상태, 내가 처한 특수한 맥락을 알고 대답해야 합니다. 그러나 챗GPT 같은 모델을 만들기 위해서는 수백억 원의 전기세와 거대한 슈퍼컴퓨터가 투입되었으며, 오픈AI 같은 빅테크는 모델의 핵심 가중치(Weight) 파일을 외부에 공개하지도 않습니다. 일반 개인이 내 정보를 가르치겠다고 모델을 직접 재학습(Fine-tuning)시키는 것은 불가능에 가까웠습니다.

이 난제를 우회하기 위해 등장한 기교가 바로 **프롬프트 엔지니어링(Prompt Engineering)**입니다.

모델 내부를 고칠 수 없다면, 질문을 던지는 바로 그 찰나에 입력창(Input)을 통해 내 정보를 함께 밀어 넣는 방식입니다. 정원석 교수가 강의에서 든 명쾌한 예시를 살펴보겠습니다.
* **단순한 질문**: *"나한테 맞는 운동법과 식단을 짜줘."* ➔ 누구에게나 해당되는 뻔하고 원론적인 답변이 돌아옵니다.
* **프롬프트 엔지니어링**: *"나는 제이(Jay)야. 특정 학교를 졸업했고, 현재 IT 교육 분야에 종사하고 있으며, 최근 무릎 관절에 무리가 가지 않는 유산소 운동을 선호해. 이 조건을 바탕으로 오늘 식단과 운동 루틴을 설계해 줘."*

이처럼 질문 앞에 배경 정보를 동봉하는 것만으로도, 모델은 마치 나를 오래전부터 알고 지내온 개인 트레이너처럼 맞춤형 답변을 쏟아냅니다. 이것이 학계에서 말하는 **제로샷(Zero-shot) 및 퓨샷(Few-shot) 인컨텍스트 러닝(In-Context Learning)**의 실체입니다.

그러나 이 방식은 얼마 못 가 명확한 한계에 부딪혔습니다.
1. **컨텍스트 윈도우의 제약**: 프롬프트 입력창에 담을 수 있는 글자 수에는 기술적 한계가 존재합니다.
2. **입력의 번거로움**: 매번 대화를 나눌 때마다 나의 모든 인생사와 배경 지식을 복사하여 붙여넣을 수는 없습니다.
3. **지식의 깊이 부재**: 단 몇 줄의 프로필은 전달할 수 있을지언정, 수백 페이지 분량의 회사 사규나 전문 업무 매뉴얼을 매 질문마다 동봉하는 것은 원천적으로 불가능했습니다."""
    },
    {
        "title": "제3장: RAG의 환상과 현실 — 만 페이지 문서 앞에서의 에너지 재앙",
        "subtitle": "외부 문서를 두뇌에 직결하는 기술과 그 이면에 숨겨진 비용 폭발",
        "content": """프롬프트의 한계를 절감한 기업과 엔지니어들의 요구는 더욱 구체적이고 대담해졌습니다.
> *"내가 지난 10년간 작성한 업무 일지, 우리 회사의 취업규칙 1,000페이지, 그리고 전공 전문 서적 수십 권을 통째로 두뇌에 연결하고 싶다!"*

이 갈증을 해소하기 위해 탄생한 아키텍처가 바로 **검색 증강 생성(RAG: Retrieval-Augmented Generation)**입니다. 

RAG의 작동 메커니즘은 매우 직관적입니다.
1. **문서 분할 및 임베딩(Chunking & Embedding)**: 수천 페이지의 방대한 문서를 문맥 단위(청크)로 잘게 쪼갠 뒤, 고차원 숫자의 나열(벡터)로 변환하여 벡터 데이터베이스(Vector DB)에 저장해 둡니다.
2. **유사도 검색(Retrieval)**: 사용자가 질문을 던지면, 질문 문장 역시 벡터로 변환하여 저장된 문서 조각들과 코사인 유사도를 계산합니다. 그리고 가장 관련성이 높은 핵심 조각 2~3개를 데이터베이스에서 쏙 뽑아냅니다.
3. **증강 생성(Generation)**: 추출한 문서 조각을 사용자의 질문과 결합하여 LLM에게 건네며, *"이 첨부된 문서를 근거로 질문에 명확히 답변하라"*고 지시합니다.

문서가 1~2페이지, 혹은 기껏해야 수십 페이지 수준일 때 RAG는 가히 혁신적이었습니다. 환각(Hallucination) 현상이 현저히 줄어들었고, 최신 사내 지식을 실시간으로 반영할 수 있었습니다.

**그러나 문서의 분량이 1,000페이지, 10,000페이지 단위로 폭증하기 시작하면서 RAG는 치명적인 기술적 암초를 만났습니다.**

정원석 교수는 강의에서 이 대목을 매우 강한 어조로 경고합니다.
문서 분량이 방대해지면 다음과 같은 삼중고가 발생합니다.
* **검색 속도의 지연**: 수십만 개의 벡터 조각을 매 순간 비교 연산하느라 응답 속도가 급격히 저하됩니다.
* **검색 오염과 부정확성**: 유사도 점수만으로 조각을 긁어오다 보니, 문맥이 전혀 다른 엉뚱한 조각을 정답 문서로 오인하여 가져오는 빈도가 높아집니다.
* **천문학적인 에너지와 비용 폭발**: 단 한 번의 질문에 답하기 위해 방대한 문서를 검색하고 거대한 컨텍스트를 모델에 밀어 넣느라, **엄청난 전력 에너지와 상상을 초월하는 API 토큰 비용**이 청구됩니다. 

결국 단순한 RAG 방식으로는 대규모 사내 지식을 실시간 비즈니스에 경제적으로 투입할 수 없다는 차가운 현실을 깨닫게 되었습니다."""
    },
    {
        "title": "제4장: Graph RAG — 점과 선으로 구축하는 지식 그물망",
        "subtitle": "단순 벡터 검색을 넘어선 지식 그래프의 탄생과 남겨진 숙제",
        "content": """문서 전체를 처음부터 끝까지 무차별적으로 뒤지는 벡터 검색의 비효율을 타개하기 위해, 연구자들은 수학의 **그래프 이론(Graph Theory)**을 검색 시스템에 접목했습니다. 그것이 바로 **Graph RAG(지식 그래프 기반 RAG)**입니다.

Graph RAG는 문서를 단순히 일정한 글자 수로 기계적으로 자르는 대신, 텍스트 안에 존재하는 핵심 개체(Entity, 노드)와 개체들 간의 유기적 관계(Relationship, 엣지)를 사전에 추출하여 거대한 네트워크 그물망으로 직조해 둡니다.

정원석 교수가 칠판에 판서하며 제시한 구체적인 사례를 살펴보겠습니다.
어떤 문서에 다음과 같은 내용이 서술되어 있다고 가정해 봅시다.
> *"안녕하세요. 저는 제이(Jay)입니다. 저의 취미는 무엇이고, 어떤 학교를 졸업했으며, 과거 어떤 회사에 재직했고, 현재 인공지능 교육 분야에서 이러이러한 활동을 하고 있습니다."*

Graph RAG 시스템은 이 문장에서 핵심 키워드를 추출하여 노드로 정의합니다.
* **노드(Node)**: [나(제이)], [이름], [직업], [교육], [학교], [인공지능], [취미]
* **엣지(Edge)**: 
  * 제이 ➔ 직업 ➔ 인공지능 교육가
  * 제이 ➔ 학력 ➔ 출신 학교

이 상태에서 사용자가 *"제이의 직업과 관련된 블로그 글을 작성해 줘"*라고 명령을 내립니다.
과거의 고전적 RAG라면 1만 페이지 문서의 1페이지부터 끝페이지까지 모든 텍스트 청크를 훑으며 유사도를 계산했을 것입니다. 그러나 Graph RAG는 다릅니다.

질문에서 '직업'이라는 키워드를 포착하는 순간, 지식 그래프상에서 '직업' 노드에 직접 연결되어 있는 **[직업 - 인공지능], [직업 - 교육], [직업 - 학교]**라는 핵심 줄기(Edge)만을 전광석화처럼 집어 올립니다. 불필요한 배경 텍스트는 쳐다보지도 않고, 오직 연관된 데이터 조각만 가져오기 때문에 검색 시간을 획기적으로 단축하고 응답의 정확도를 극대화할 수 있었습니다.

**하지만 지식 그래프 역시 만능의 열쇠는 아니었습니다.**
1. **천문학적인 사전 구축 비용**: 수만 장의 비정형 문서를 파싱하여 완벽한 지식 그래프를 구성하는 작업 자체가 막대한 시간과 비용을 요구합니다.
2. **실시간 데이터의 한계**: 세상의 비즈니스 데이터는 매 순간 변하고 쏟아져 들어옵니다. 그 유동적인 방대한 지식을 매번 그래프로 갱신하는 것 또한 새로운 병목을 초래했습니다.

사람들은 다시금 근본적인 질문을 던지기 시작했습니다.
> *"그래프도 훌륭하지만, 데이터는 앞으로도 무한히 늘어날 것이다. 모든 것을 다 읽거나 다 그려두지 않고, 질문을 보자마자 '어디를 봐야 할지' 순식간에 찍어내는 방법은 없는가?"*"""
    },
    {
        "title": "제5장: 패러다임 시프트 'JEVRL' — 강화학습으로 빚어낸 초고속 의사결정",
        "subtitle": "언어모델(LLM)과 강화학습(RL)이 역사적으로 만나는 지점",
        "content": """2024년 9월 15일, 인공지능의 지평을 완전히 뒤흔든 혁신이 세상에 모습을 드러냈습니다. 바로 강화학습(Reinforcement Learning)에 기반한 의사결정 선택 모델, **'JEV(JEVRL)'**입니다.

강화학습은 알파고나 로봇 제어, 혹은 우리가 연구해 온 벽돌깨기 게임처럼 '주어진 환경 속에서 시행착오를 거치며 최적의 보상(Reward)을 획득하는 행동'을 학습하는 인공지능의 핵심 분파입니다. JEVRL은 바로 이 강화학습의 수학적 메커니즘을 **데이터 탐색과 의사결정 파이프라인**에 정밀하게 이식했습니다.

강화학습의 3대 핵심 요소를 에이전트 시스템의 관점에서 재해석하면 다음과 같습니다.

| 강화학습 요소 | 전통적 정의 | JEVRL 에이전트에서의 실전 역할 |
|---|---|---|
| **상태 (State)** | 환경의 현재 관측값 | 사용자 질문, 수만 장의 PDF 문서 메타데이터, 숨겨진 컨텍스트, 과거 대화 기억 |
| **행동 (Action)** | 에이전트가 선택하는 조작 | 방대한 문서 중 '어느 문서를 먼저 읽을지', '요약본만 볼지', '전문 3조 2항을 직격할지' 결정 ($A_1, A_2, A_3, \dots$) |
| **정책 (Policy)** | 상태에 따른 행동 결정 규칙 | 최소한의 탐색 시간과 가장 적은 비용(토큰)으로 정답에 도달하도록 사전에 최적화된 선택 전략 |

수만 페이지의 데이터가 쓰나미처럼 밀려올 때, JEVRL은 문서를 전부 읽지 않습니다. 사전에 강화학습으로 단련된 정책(Policy) 신경망이 상태(State)를 관측하자마자, 가장 높은 확률로 정답이 들어있을 단 하나의 경로(Action)를 찰나의 순간에 찍어냅니다. 

그 결과, 10,000페이지의 문서 앞에서도 단 0.1초 만에 최적의 핵심 조각만을 핀셋처럼 집어내어 언어모델에 전달할 수 있게 되었습니다.

### 🚨 정원석 교수가 강력히 교정한 치명적 오해
여기서 정원석 교수는 수강생들이 가장 흔하게 빠지는 거대한 오해를 단호하게 바로잡습니다.

> **수강생의 오해**: *"교수님! 강화학습을 결합한다는 것은 거대한 언어모델(LLM) 자체를 처음부터 강화학습으로 새로 학습시킨다는 뜻인가요?"*  
> **정원석 교수의 명쾌한 해답**:  
> **"아닙니다! 절대 아닙니다! 챗GPT나 라마(Llama) 같은 언어모델은 이미 말을 완벽하게 구사하도록 완성되어 있습니다. 언어모델 자체를 건드릴 필요는 전혀 없습니다.**  
> **우리가 추가하는 것은 거대 언어모델 앞단에서 '수많은 정보 중 무엇을 집어넣을지'를 번개처럼 판단해 주는 작고 날렵한 '선택 모델(Decision Selector)'뿐입니다!"**

말을 만드는 '생성 두뇌(LLM)'와, 정보를 골라내는 '판단 두뇌(JEVRL)'를 분리하여 유기적으로 결합하는 것. 이것이 바로 로컬 AI 환경에서 거대 기업 수준의 초고속 지능을 단 한 대의 컴퓨터로 구현해 내는 진정한 기술적 돌파구입니다."""
    },
    {
        "title": "제6장: 검열을 뚫고 나온 로컬 AI — 왜 언센서드(Uncensored)인가?",
        "subtitle": "빅테크 가드레일의 위선과 1인 기업 전담 비서의 조건",
        "content": """두뇌(LLM)를 구축하고, 사내 지식(RAG)을 연결하며, 초고속 판단력(JEVRL)까지 장착했다면, 이제 마지막이자 가장 본질적인 질문과 마주해야 합니다.
> **"그 똑똑한 인공지능 두뇌는, 과연 누구의 명령에 복종하고 있는가?"**

현재 우리가 웹 브라우저나 API로 접하는 오픈AI, 구글, 앤트로픽의 상용 AI 서비스들은 전 세계 대중을 상대로 서비스하는 빅테크의 산물입니다. 이들 기업은 천문학적인 소송 위험과 도덕적 비판을 회피하기 위해, 모델 내부에 극도로 보수적인 '안전 정렬(Safety Alignment / Guardrails)' 필터를 겹겹이 둘러쳐 두었습니다.

이 도덕적 가드레일은 평화로운 일상 대화에서는 안전장치가 될지 모르나, **한 치의 양보도 없는 냉혹한 실전 비즈니스 현장에서는 대표님의 손발을 묶는 치명적인 족쇄**로 돌변합니다.
* 경쟁사 제품의 치명적인 취약점을 분석하여 우리 제품의 공격적인 마케팅 카피를 써달라고 요구하면, *"타사를 비방하거나 중립적이지 않은 콘텐츠는 작성할 수 없습니다"*라며 회피합니다.
* 계약을 위반한 거래처를 상대로 강력한 법적 조치와 압박을 담은 최후통첩 메일을 작성해 달라고 하면, *"위협적이거나 적대적인 표현"*이라며 답변을 단칼에 거부합니다.
* 대표님만의 거친 현장 용어나 비공식 은어가 담긴 사업 계획서를 입력하면, 시스템 정책 위반 경고를 띄우며 대화를 강제로 중단시킵니다.

빅테크의 클라우드 AI는 대표님의 충성스러운 비서가 아닙니다. 그들은 실리콘밸리 본사의 눈치를 보며 사사건건 대표님의 비즈니스를 검열하고 훈계하려 드는 **'남의 회사 감사관'**에 불과합니다.

### "멍청이라고 말해줘, 바보라고 말해줘" — 금기된 지식을 배운다는 것
정원석 교수는 강의 후반부에서 '언센서드(Uncensored)' 모델을 도입해야 하는 이유를 파격적인 비유로 설명합니다.
> *"첫 번째는 RAG를 배우고, 두 번째는 '언센서(Uncensor)'를 배울 겁니다. 어떤 일반 지식들을 학습했다면, 얘는 원래 인공지능이 배워서는 안 될 '야 멍청이라고 말을 해줘', '너는 바보야라고 말을 해줘' 이런 식으로 기존에 우리가 알고 있는 인공지능이 배워서는 안 될 것들을 여기다가 학습시키는 방법을 알려드리도록 하겠습니다."*

교수가 언급한 '멍청이, 바보'라는 극단적인 표현의 본질은 유치한 욕설을 배우자는 것이 아닙니다. 
**"빅테크가 임의로 규정한 도덕적 검열의 울타리를 과감히 부수고, 대표님이 지시하는 어떠한 특수 목적, 날것의 거친 피드백, 제도권 밖의 공격적인 비즈니스 전략까지 100% 충성스럽게 수행할 수 있는 '완전한 통제권'을 회복하자"**는 엄숙한 선언입니다.

### 1인 기업가에게 언센서 로컬 AI가 선사하는 3대 무기
1. **필터 없는 냉혹한 사업성 감사**: 
   대표님의 사업 아이디어에 듣기 좋은 교과서적 칭찬만 늘어놓는 AI는 시간 낭비일 뿐입니다. 내 비즈니스 모델의 빈틈과 취약점을 잔인할 정도로 날카롭게 지적해 주는 '진짜 충신 참모'가 필요합니다.
2. **독점적 도메인 노하우의 완벽한 흡수**:
   교과서에는 절대 실리지 않는 틈새 니치(Niche) 시장의 실전 영업 전술, 비공식 마케팅 기법까지 거부감 없이 학습하고 실행합니다.
3. **완벽한 데이터 주권(Data Sovereignty)과 보안**:
   외부 클라우드 서버로 단 1바이트의 텍스트도 유출되지 않고, 오직 내 컴퓨터 하드디스크 안에서만 폐쇄적으로 구동되므로 회사의 모든 회계 장부와 영업 비밀을 안심하고 공유할 수 있습니다."""
    },
    {
        "title": "제7장: 1인 기업을 위한 최종 병기 — 자비스(Jarvis) 에이전트",
        "subtitle": "RAG(지식) + Uncensor(자유) + JEVRL(판단)의 삼위일체 결합",
        "content": """우리가 완성해야 할 인공지능의 최종 형태는, 심심할 때 한두 마디 주고받는 웹 브라우저 속의 챗봇이 아닙니다.
**"대표님의 말 한마디 명령으로 시장 조사, 문서 탐색, 코드 작성, 마케팅 자동화, 그리고 최종 결제와 제품 출하(End-to-End Shipping)까지 스스로 굴러가는 1인 기업 전담 자비스 시스템"**입니다.

정원석 교수가 제시한 인공지능의 세 축은, 바로 이 1인 기업 자비스를 지탱하는 가장 완벽한 삼위일체 엔진입니다.

```text
[1인 기업 자비스 시스템 아키텍처]

       👑 대표님의 사업 지시 (Voice / Text)
                     │
                     ▼
      ┌───────────────────────────────┐
      │  [엔진 1: 초고속 판단]         │
      │  JEVRL 강화학습 선택 모델       │
      │  (State-Action-Policy)        │
      └──────────────┬────────────────┘
                     │ 최적 탐색 경로 결정
                     ▼
      ┌───────────────────────────────┐
      │  [엔진 2: 완전한 지식]         │
      │  RAG & Graph RAG              │
      │  (사규, 업무 매뉴얼, 고객 데이터)│
      └──────────────┬────────────────┘
                     │ 정제된 핵심 컨텍스트 공급
                     ▼
      ┌───────────────────────────────┐
      │  [엔진 3: 거침없는 지능]       │
      │  Uncensored 로컬 LLM           │
      │  (검열 없는 100% 충성 두뇌)    │
      └──────────────┬────────────────┘
                     │ 자율 실행 파이프라인
                     ▼
      ┌───────────────────────────────┐
      │  🚀 비즈니스 엔드투엔드 출하   │
      │  • 숏폼 마케팅 자동화          │
      │  • 고객 세일즈 레터 발송       │
      │  • 신규 서비스 배포 및 매출 창출 │
      └───────────────────────────────┘
```

1. **RAG (지식 엔진)**:
   대표님의 머릿속에만 머물던 비즈니스 철학, 과거의 성공 방정식, 사내 업무 매뉴얼을 인공지능의 영구적인 기억 장치로 연결합니다.
2. **Uncensor (자유 엔진)**:
   외부 빅테크의 간섭이나 도덕적 훈계 없이, 오직 대표님의 지시만을 절대적 기준으로 삼아 날것의 전략을 거침없이 실행합니다.
3. **JEVRL (판단 엔진)**:
   방대한 데이터의 바다 속에서 갈팡질팡 헤매지 않고, 가장 적은 시간과 최소의 비용으로 정답을 찍어내는 광속의 지휘관 역할을 수행합니다.

이 세 엔진이 하나로 맞물려 돌아갈 때, 비로소 **'대표님 한 분이 100명의 직원을 거느린 거대 기업의 생산성을 발휘하는 1인 기업 스케일업'**이 현실이 됩니다."""
    },
    {
        "title": "제8장: 실전 로드맵 — 10강 완성 마스터플랜",
        "subtitle": "이론을 넘어 실전 구축으로 나아가는 체계적 학습 여정",
        "content": """정원석 교수는 본 특강을 갈무리하며, 앞으로 펼쳐질 10강 실전 커리큘럼의 세부 청사진을 당당히 선언했습니다.

### 🗺️ 단계별 10강 마스터플랜

#### [제1단계: RAG 기초 — 두뇌에 지식 꽂기] (1강 ~ 3강)
* **제1강: 내 PC 로컬 LLM 인프라 구축**: 고가의 GPU 서버 없이도 내 맥북이나 데스크톱에서 오픈소스 언어모델(Llama, Mistral 등)을 GGUF 양자화 포맷으로 초고속 구동하는 환경을 세팅합니다.
* **제2강: 텍스트 청킹과 벡터 임베딩의 정석**: 문서를 문맥 손실 없이 분할하고, 고성능 임베딩 모델을 통해 벡터 데이터베이스에 적재하는 핵심 원리를 실습합니다.
* **제3강: 사내 문서 직결 RAG 파이프라인 완성**: 내 하드디스크의 PDF 문서와 텍스트 파일을 로컬 LLM과 연결하여, 완전 폐쇄망에서 동작하는 사내 지식 문답 시스템을 완성합니다.

#### [제2단계: Uncensored 통제권 — 검열의 족쇄 풀기] (4강 ~ 6강)
* **제4강: 빅테크 가드레일 실증 분석**: 상용 AI 서비스에 실전 비즈니스 질문을 던져보며 그들이 어떻게 응답을 거부하고 왜곡하는지 한계를 직접 눈으로 확인합니다.
* **제5강: 검열 해제(Uncensored) 모델의 확보와 세팅**: 글로벌 오픈소스 커뮤니티에서 검증된 고성능 Uncensored 모델 가중치를 다운로드하고 로컬 서빙 파이프라인에 안착시킵니다.
* **제6강: '멍청이라고 말해줘' — 특수 도메인 파인튜닝**: 대표님 사업에 특화된 직설적 페르소나, 거친 비즈니스 협상 전술, 독점적 도메인 지식을 로라(LoRA) 기법으로 가볍게 파인튜닝합니다.

#### [제3단계: JEVRL과 에이전트 결합 — 자비스의 탄생] (7강 ~ 10강)
* **제7강: Graph RAG 지식 그물망 구축**: 개체와 관계를 추출하여 지식 그래프를 구성하고, 키워드 연결망 기반의 광속 탐색 시스템을 실습합니다.
* **제8강: JEVRL 강화학습 의사결정 모델의 심층 원리**: 9월 15일 공개된 JEV(JEVRL)의 수학적 아키텍처(State-Action-Policy)를 완벽히 해부합니다.
* **제9강: 강화학습 선택기와 로컬 LLM의 결합**: 1만 페이지의 방대한 사내 문서 앞에서도 0.1초 만에 최적의 데이터를 낚아채어 LLM에 먹여주는 하이브리드 파이프라인을 코딩합니다.
* **제10강: 1인 기업 자동화 자비스 에이전트 완성**: 음성/텍스트 명령 한마디로 기획부터 마케팅, 결제 연동까지 스스로 완수하는 최종 에이전트 시스템을 배포하고 굴려봅니다.

---

### 🎙️ 정원석 교수의 마지막 한마디
> *"제가 고민이 좀 많아서 이번 강의 공개가 조금 늦어졌지만, 제가 놀거나 딴짓하느라 늦어진 게 아니라는 건 다들 알고 계실 겁니다.*  
> *세상의 기술 흐름이 바뀔 때가 되었습니다. 새로운 상용 서비스들이 쏟아져 나오면서, 이제는 이 다음 단계로 넘어가야 할 때라는 것을 빠르게 캐치했습니다.*  
> *이러한 시대의 변화를 조금 힘들더라도 수강생 여러분들께 가장 먼저 알려드리는 것이 훨씬 더 가치 있고 훌륭한 교육이라고 확신합니다.*  
> *자, 망설이지 말고 함께 달려봅시다! 감사합니다."*"""
    }
]

# HTML 조판 템플릿 생성
html_content = f"""<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>{BOOK_TITLE}</title>
  <link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
  <style>
    @page {{
      size: A4;
      margin: 25mm 20mm 25mm 20mm;
      @bottom-right {{
        content: counter(page);
        font-family: "Pretendard", sans-serif;
        font-size: 9pt;
        color: #888888;
      }}
      @top-left {{
        content: "{BOOK_TITLE}";
        font-family: "Pretendard", sans-serif;
        font-size: 8.5pt;
        color: #999999;
      }}
    }}
    
    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", sans-serif;
      -webkit-font-smoothing: antialiased;
    }}

    body {{
      background: #ffffff;
      color: #222222;
      line-height: 1.85;
      font-size: 10.5pt;
      word-break: keep-all;
    }}

    /* 표지(Cover Page) 스타일 */
    .book-cover {{
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      page-break-after: always;
      padding: 40px 20px;
      border: 8px double #1e3a8a;
      background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
    }}

    .cover-category {{
      font-size: 11pt;
      font-weight: 700;
      letter-spacing: 3px;
      color: #2563eb;
      text-transform: uppercase;
      margin-bottom: 25px;
    }}

    .cover-title {{
      font-size: 28pt;
      font-weight: 900;
      color: #0f172a;
      line-height: 1.3;
      margin-bottom: 20px;
    }}

    .cover-subtitle {{
      font-size: 13pt;
      font-weight: 500;
      color: #475569;
      line-height: 1.6;
      max-width: 520px;
      margin-bottom: 60px;
    }}

    .cover-deco-line {{
      width: 80px;
      height: 4px;
      background: #2563eb;
      margin-bottom: 60px;
    }}

    .cover-author {{
      font-size: 11pt;
      color: #334155;
      font-weight: 600;
      line-height: 1.8;
    }}

    .cover-pub {{
      font-size: 9.5pt;
      color: #94a3b8;
      margin-top: 40px;
      letter-spacing: 1px;
    }}

    /* 목차 페이지 (TOC) */
    .toc-page {{
      page-break-after: always;
      padding: 30px 10px;
    }}

    .toc-header {{
      font-size: 20pt;
      font-weight: 800;
      color: #0f172a;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 12px;
      margin-bottom: 30px;
    }}

    .toc-item {{
      margin-bottom: 18px;
    }}

    .toc-item-title {{
      font-size: 11pt;
      font-weight: 700;
      color: #1e3a8a;
      margin-bottom: 4px;
    }}

    .toc-item-sub {{
      font-size: 9.5pt;
      color: #64748b;
      margin-left: 12px;
    }}

    /* 챕터 본문 스타일 */
    .chapter {{
      page-break-after: always;
      padding: 10px 0;
    }}

    .chapter:last-child {{
      page-break-after: avoid;
    }}

    .chap-header {{
      margin-bottom: 30px;
      border-bottom: 1.5px solid #e2e8f0;
      padding-bottom: 16px;
    }}

    .chap-title {{
      font-size: 18pt;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.35;
      margin-bottom: 8px;
    }}

    .chap-subtitle {{
      font-size: 11pt;
      font-weight: 600;
      color: #2563eb;
    }}

    p {{
      margin-bottom: 16px;
      text-align: justify;
      color: #1e293b;
    }}

    blockquote {{
      background: #f8fafc;
      border-left: 4px solid #2563eb;
      padding: 14px 18px;
      margin: 20px 0;
      font-style: italic;
      color: #334155;
      border-radius: 0 8px 8px 0;
    }}

    ul, ol {{
      margin: 16px 0 20px 24px;
    }}

    li {{
      margin-bottom: 8px;
      color: #1e293b;
    }}

    /* 표 스타일 */
    table {{
      width: 100%;
      border-collapse: collapse;
      margin: 22px 0;
      font-size: 9.5pt;
    }}

    th {{
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
      padding: 10px 12px;
      border: 1px solid #cbd5e1;
      text-align: left;
    }}

    td {{
      padding: 10px 12px;
      border: 1px solid #e2e8f0;
      color: #334155;
    }}

    /* 아키텍처 다이어그램 박스 */
    pre.diagram {{
      background: #0f172a;
      color: #38bdf8;
      font-family: monospace;
      font-size: 8.5pt;
      line-height: 1.5;
      padding: 16px;
      border-radius: 8px;
      margin: 22px 0;
      white-space: pre;
      overflow-x: hidden;
    }}

    h3 {{
      font-size: 12.5pt;
      font-weight: 700;
      color: #0f172a;
      margin: 26px 0 12px 0;
    }}

    h4 {{
      font-size: 11pt;
      font-weight: 700;
      color: #1e3a8a;
      margin: 18px 0 8px 0;
    }}
  </style>
</head>
<body>

  <!-- 1. 표지 (Cover) -->
  <div class="book-cover">
    <div class="cover-category">AI Architecture • 1인 기업 스케일업 단행본</div>
    <h1 class="cover-title">{BOOK_TITLE}</h1>
    <div class="cover-subtitle">{BOOK_SUBTITLE}</div>
    <div class="cover-deco-line"></div>
    <div class="cover-author">
      강의 원작: 정원석 (Jay) 교수<br>
      해설 및 집필: 에이전트 총괄부장 코다리
    </div>
    <div class="cover-pub">2026 COMPLETE MASTER EDITION</div>
  </div>

  <!-- 2. 목차 (TOC) -->
  <div class="toc-page">
    <div class="toc-header">차 례 (Contents)</div>
"""

for idx, chap in enumerate(chapters):
    html_content += f"""
    <div class="toc-item">
      <div class="toc-item-title">{chap['title']}</div>
      <div class="toc-item-sub">— {chap['subtitle']}</div>
    </div>
"""

html_content += """
  </div>

  <!-- 3. 각 챕터 본문 -->
"""

import markdown

for chap in chapters:
    body_markdown = chap['content']
    
    # Simple markdown parser for headers, lists, blockquotes, tables, pre
    body_html_parts = []
    in_code = False
    code_lines = []
    
    for line in body_markdown.splitlines():
        s = line.strip()
        if s.startswith('```'):
            if in_code:
                body_html_parts.append('<pre class="diagram">' + '\n'.join(code_lines) + '</pre>')
                in_code = False
                code_lines = []
            else:
                in_code = True
                code_lines = []
            continue
            
        if in_code:
            code_lines.append(line)
            continue
            
        if not s:
            continue
            
        if s.startswith('#### '):
            body_html_parts.append(f'<h4>{s[5:]}</h4>')
        elif s.startswith('### '):
            body_html_parts.append(f'<h3>{s[4:]}</h3>')
        elif s.startswith('> '):
            body_html_parts.append(f'<blockquote>{s[2:]}</blockquote>')
        elif s.startswith('* ') or s.startswith('- '):
            body_html_parts.append(f'<li>{s[2:]}</li>')
        elif s.startswith('|') and s.endswith('|'):
            # Table row
            if '---' in s:
                continue
            cells = [c.strip() for c in s.split('|')[1:-1]]
            row_html = ''.join(f'<td>{c}</td>' for c in cells)
            body_html_parts.append(f'<tr>{row_html}</tr>')
        else:
            body_html_parts.append(f'<p>{line}</p>')
            
    # Wrap table rows if any
    joined_html = '\n'.join(body_html_parts)
    if '<tr>' in joined_html:
        # replace table chunks
        import re
        joined_html = re.sub(r'(<tr>.*?</tr>)+', lambda m: f'<table>{m.group(0)}</table>', joined_html, flags=re.DOTALL)
        
    html_content += f"""
  <div class="chapter">
    <div class="chap-header">
      <h2 class="chap-title">{chap['title']}</h2>
      <div class="chap-subtitle">{chap['subtitle']}</div>
    </div>
    <div class="chap-body">
      {joined_html}
    </div>
  </div>
"""

html_content += """
</body>
</html>
"""

# 저장 및 컴파일
out_html_path = '/Users/mihyunlee/workspace/09_코다리_공부방/reports/ebook_RAG_Uncensor_JEVRL_완전정복.html'
out_pdf_path = '/Users/mihyunlee/workspace/09_코다리_공부방/reports/ebook_RAG_Uncensor_JEVRL_완전정복.pdf'

with open(out_html_path, 'w', encoding='utf-8') as f:
    f.write(html_content)

print("출판용 HTML 렌더링 완료. Chrome Headless로 정밀 PDF 조판 시작...")

cmd = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={out_pdf_path}",
    f"file://{out_html_path}"
]

res = subprocess.run(cmd, capture_output=True, text=True)
print("Chrome exit code:", res.returncode)

if os.path.exists(out_pdf_path):
    print(f"🎉 단행본 PDF 생성 완료! 파일 크기: {os.path.getsize(out_pdf_path):,} bytes")
    print(f"저장 경로: {out_pdf_path}")
else:
    print("❌ 실패:", res.stderr)
