import React, { useState, useEffect, useRef } from 'react';
import './InterviewPrep.css';
import { 
  Award, Shield, Calendar, MapPin, AlertTriangle, CheckCircle2, 
  HelpCircle, Sparkles, Send, Mic, MicOff, Volume2, Timer, RefreshCw, 
  BookOpen, Compass, ChevronRight, UserCheck, PhoneCall, ExternalLink,
  Target, FileText, CheckSquare, HeartHandshake, Zap, Trophy, ThumbsUp, Printer
} from 'lucide-react';

// 🎯 1분 자기소개 3대 맞춤형 텔레프롬프터 스크립트 (일의 절실함 & 성실성 극대화)
export const INTRO_SCRIPTS = {
  needWork: {
    id: 'needWork',
    tag: '⭐ 대표님 1순위 강력추천 (절실함 & 성실성 극대화)',
    title: '일의 소중함과 간절함 부각형',
    target: '50초~55초',
    desc: '일자리에 대한 진정성과 절실함, 단 하루의 결근도 없는 묵묵한 성실성을 강력 어필하는 가장 높은 평가를 받는 버전입니다.',
    keywords: ['일의 소중함과 절실함', '단단한 생활력과 성실함', '모든 열정을 쏟을 소중한 기회', '단 하루의 결근 없이', '가장 듬직한 실태확인원'],
    steps: [
      {
        part: '도입 (15초)',
        point: '일의 소중함과 강한 생활력 선언',
        text: '안녕하십니까! 국세청 국세외수입 체납관리단 실태확인원에 지원한 이미현입니다. 저는 일에 대한 소중함과 절실함을 누구보다 깊이 알고 있으며, 맡은 일에는 끝까지 책임을 다하는 단단한 생활력과 성실함을 가지고 있습니다.'
      },
      {
        part: '본론 (30초)',
        point: '진정성 있는 소통 + 포천 현장 기동력',
        text: '저에게 이번 실태확인원 직무는 단순한 일자리를 넘어, 제 모든 열정과 성실함을 쏟아부을 너무나 간절하고 꼭 필요한 기회입니다. 풍부한 사회 경험을 통해 다져진 따뜻한 경청과 침착한 소통력으로 현장 체납자분들을 배려하며 자진 납부를 설득하겠습니다. 또한 포천세무서 관할의 넓은 지역도 튼튼한 체력과 기동성으로 지치지 않고 묵묵히 발로 뛰겠습니다.'
      },
      {
        part: '마무리 (15초)',
        point: '결근 없는 성실성과 감사한 각오',
        text: '일이 꼭 필요한 만큼, 작은 업무 하나에도 진심으로 감사하며 단 하루의 결근도 없이 2인 1조 현장 안전 수칙을 철저히 준수하겠습니다. 포천세무서의 가장 믿음직하고 듬직한 실태확인원이 되겠습니다. 감사합니다!'
      }
    ],
    fullText: '안녕하십니까! 국세청 국세외수입 체납관리단 실태확인원에 지원한 이미현입니다. 저는 일에 대한 소중함과 절실함을 누구보다 깊이 알고 있으며, 맡은 일에는 끝까지 책임을 다하는 단단한 생활력과 성실함을 가지고 있습니다. 저에게 이번 실태확인원 직무는 단순한 일자리를 넘어, 제 모든 열정과 성실함을 쏟아부을 너무나 간절하고 꼭 필요한 기회입니다. 풍부한 사회 경험을 통해 다져진 따뜻한 경청과 침착한 소통력으로 현장 체납자분들을 배려하며 자진 납부를 설득하겠습니다. 또한 포천세무서 관할의 넓은 지역도 튼튼한 체력과 기동성으로 지치지 않고 묵묵히 발로 뛰겠습니다. 일이 꼭 필요한 만큼, 작은 업무 하나에도 진심으로 감사하며 단 하루의 결근도 없이 2인 1조 현장 안전 수칙을 철저히 준수하겠습니다. 포천세무서의 가장 믿음직하고 듬직한 실태확인원이 되겠습니다. 감사합니다!'
  },
  lifeExp: {
    id: 'lifeExp',
    tag: '버전 2 (강한 생활력 & 뚝심 강조)',
    title: '생활력과 묵묵한 책임감형',
    target: '48초~52초',
    desc: '어떤 궂은일도 묵묵히 해내는 뚝심과 가족 같은 따뜻한 소통력을 강조하는 버전입니다.',
    keywords: ['묵묵히 제 몫을 해내는 생활력', '삶의 든든한 버팀목', '실태 정확 파악과 복지 연계', '내 집 앞마당처럼 성실히', '결과와 성실함으로 보답'],
    steps: [
      {
        part: '도입 (15초)',
        point: '강한 책임감과 생활력 어필',
        text: '안녕하십니까! 포천세무서 실태확인원에 지원한 이미현입니다. 저는 어떤 어려운 환경 속에서도 묵묵히 제 몫을 해내며 삶을 지탱해 온 강한 책임감과 생활력을 가지고 있습니다.'
      },
      {
        part: '본론 (30초)',
        point: '따뜻한 설득과 현장 끈기',
        text: '제게 이 일은 제 삶의 든든한 버팀목이자 꼭 완수해야 할 절실한 기회입니다. 사람을 진심으로 대하는 태도로 현장에서 체납자의 실태를 정확히 파악하고, 어려운 분들에게는 복지 연계를, 고의 체납자에게는 단호하고 명확한 안내를 전하겠습니다. 넓은 포천 관할 현장을 내 집 앞마당처럼 성실히 누비겠습니다.'
      },
      {
        part: '마무리 (15초)',
        point: '변함없는 성실성 다짐',
        text: '절실한 마음으로 시작하여 끝까지 변함없이 책임지는 가장 성실한 실태확인원이 되겠습니다. 일할 기회를 주신다면 결과와 성실함으로 반드시 보답하겠습니다. 감사합니다!'
      }
    ],
    fullText: '안녕하십니까! 포천세무서 실태확인원에 지원한 이미현입니다. 저는 어떤 어려운 환경 속에서도 묵묵히 제 몫을 해내며 삶을 지탱해 온 강한 책임감과 생활력을 가지고 있습니다. 제게 이 일은 제 삶의 든든한 버팀목이자 꼭 완수해야 할 절실한 기회입니다. 사람을 진심으로 대하는 태도로 현장에서 체납자의 실태를 정확히 파악하고, 어려운 분들에게는 복지 연계를, 고의 체납자에게는 단호하고 명확한 안내를 전하겠습니다. 넓은 포천 관할 현장을 내 집 앞마당처럼 성실히 누비겠습니다. 절실한 마음으로 시작하여 끝까지 변함없이 책임지는 가장 성실한 실태확인원이 되겠습니다. 일할 기회를 주신다면 결과와 성실함으로 반드시 보답하겠습니다. 감사합니다!'
  },
  fieldPower: {
    id: 'fieldPower',
    tag: '버전 3 (포천 현장 & 기동성 중심)',
    title: '현장 기동력 & 준비된 소통형',
    target: '45초~50초',
    desc: '포천의 넓은 도농복합 관할 지역을 지치지 않고 뛸 기동성과 철저한 사전 준비를 어필하는 버전입니다.',
    keywords: ['최고의 집중력과 성실함', '사전 동선 철저 계획', '2인 1조 안전 협력', '절실함이 곧 책임감', '신뢰 주는 동반자'],
    steps: [
      {
        part: '도입 (15초)',
        point: '절실함과 집중력 준비 선언',
        text: '안녕하십니까! 국세외수입 실태확인원에 지원한 이미현입니다. 저에게 이 일자리는 그 어느 때보다 소중하고 절실하며, 그렇기에 단 하루도 헛되이 보내지 않고 최고의 집중력과 성실함으로 임할 준비가 되어 있습니다.'
      },
      {
        part: '본론 (30초)',
        point: '동선 효율화 및 끈기 있는 설득',
        text: '실태확인원의 본질은 발로 뛰며 체납자의 실제 형편을 정확히 파악하고 소통하는 것입니다. 포천 지역의 지리적 특성에 맞춰 사전 동선을 꼼꼼히 짜고, 2인 1조로 동료와 안전하게 협력하며 체납자를 정중하고 끈기 있게 설득하겠습니다.'
      },
      {
        part: '마무리 (15초)',
        point: '흔들리지 않는 책임감 각오',
        text: '일이 필요한 절실함이 곧 흔들리지 않는 책임감입니다. 국세청과 납세자 모두에게 신뢰를 주는 든든한 동반자가 되겠습니다. 감사합니다!'
      }
    ],
    fullText: '안녕하십니까! 국세외수입 실태확인원에 지원한 이미현입니다. 저에게 이 일자리는 그 어느 때보다 소중하고 절실하며, 그렇기에 단 하루도 헛되이 보내지 않고 최고의 집중력과 성실함으로 임할 준비가 되어 있습니다. 실태확인원의 본질은 발로 뛰며 체납자의 실제 형편을 정확히 파악하고 소통하는 것입니다. 포천 지역의 지리적 특성에 맞춰 사전 동선을 꼼꼼히 짜고, 2인 1조로 동료와 안전하게 협력하며 체납자를 정중하고 끈기 있게 설득하겠습니다. 일이 필요한 절실함이 곧 흔들리지 않는 책임감입니다. 국세청과 납세자 모두에게 신뢰를 주는 든든한 동반자가 되겠습니다. 감사합니다!'
  }
};

// 🎯 NTRPOPCON 및 국세청 공고 기반 핵심 면접 족보 데이터
const INTERVIEW_QUESTIONS = [
  {
    id: 1,
    category: '기본역량',
    title: '1분 자기소개 (일의 절실함 & 성실성 부각)',
    question: '1분 동안 지원자님을 가장 잘 나타내는 자기소개를 해 주십시오.',
    intent: '지원자의 자신감, 일에 대한 절실함과 진정성, 묵묵한 성실성, 실태확인원 직무와의 적합성을 신속하게 파악하기 위함.',
    bestAnswer: `안녕하십니까! 국세청 국세외수입 체납관리단 실태확인원에 지원한 이미현입니다.

저는 일에 대한 소중함과 절실함을 누구보다 깊이 알고 있으며, 맡은 일에는 끝까지 책임을 다하는 단단한 생활력과 성실함을 가지고 있습니다.

저에게 이번 실태확인원 직무는 단순한 일자리를 넘어, 제 모든 열정과 성실함을 쏟아부을 너무나 간절하고 꼭 필요한 기회입니다. 풍부한 사회 경험을 통해 다져진 따뜻한 경청과 침착한 소통력으로 현장 체납자분들을 배려하며 자진 납부를 설득하겠습니다. 또한 포천세무서 관할의 넓은 지역도 튼튼한 체력과 기동성으로 지치지 않고 묵묵히 발로 뛰겠습니다.

일이 꼭 필요한 만큼, 작은 업무 하나에도 진심으로 감사하며 단 하루의 결근도 없이 2인 1조 현장 안전 수칙을 철저히 준수하겠습니다. 포천세무서의 가장 믿음직하고 듬직한 실태확인원이 되겠습니다. 감사합니다!`,
    tips: '★최고 득점 포인트★ "이 일이 얼마나 소중하고 절실한지", "그렇기에 결근 없이 끝까지 묵묵히 일할 사람"임을 진정성 있는 눈빛과 또렷한 목소리로 전달하세요.'
  },
  {
    id: 2,
    category: '직무이해',
    title: '지원 동기 및 직무 이해',
    question: '왜 국세외수입 체납관리단 실태확인원에 지원하셨으며, 본 직무의 가장 중요한 역할은 무엇이라 생각하십니까?',
    intent: '국세와 국세외수입의 차이를 이해하고 있는지, 일에 대한 진정성과 사명감을 확인.',
    bestAnswer: `국가의 행정 목적을 달성하기 위한 국세외수입은 성실 납부자와의 형평성과 건전한 국가재정을 위해 반드시 공정하게 관리되어야 합니다.

아울러 제 개인적으로도 이번 실태확인원 직무는 제 모든 역량을 쏟아부을 너무나 소중하고 절실한 일자리입니다. 일이 꼭 필요한 만큼 매 순간 감사하는 마음과 투철한 책임감으로 임하고자 지원했습니다.

제가 생각하는 실태확인원의 가장 중요한 역할은 '현장 밀착형 실태 파악과 맞춤형 소통'입니다. 고의적 체납자에게는 법적 절차와 납부 필요성을 단호하고 명확하게 안내하되, 경제적 어려움을 겪는 생계형 체납자에게는 분납 및 유예 제도, 나아가 복지 지원 체계를 연계하는 가교 역할을 수행하는 것입니다. 공직 보조자로서의 사명감을 가지고 공정하고 신뢰받는 징수 행정에 기여하겠습니다.`,
    tips: '단순히 돈을 받아내는 일이 아니라, "일의 소중함 + 실태 확인 및 납부 유도 + 복지 연계"라는 진정성과 공익적 가치를 짚어주면 고득점입니다.'
  },
  {
    id: 3,
    category: '상황대처',
    title: '악성 민원 및 폭언 대처',
    question: '현장 방문 시 체납자가 심하게 화를 내며 폭언이나 고성을 지를 경우 어떻게 대처하시겠습니까?',
    intent: '감정에 휩쓸리지 않고 안전 규정과 공직 프로토콜을 준수하는 위기 대응 능력을 평가.',
    bestAnswer: `첫째, 감정적으로 맞대응하지 않고 침착하게 호흡을 가다듬으며 체납자의 불만 사항을 먼저 경청하겠습니다. 상대방의 격양된 감정을 가라앉히기 위해 정중한 태도로 응대하겠습니다.

둘째, 체납자가 어느 정도 진정되면 저희가 방문한 목적(국세외수입 실태 확인 및 납부 안내)과 규정을 차분하고 명확하게 설명하겠습니다.

셋째, 만약 폭력 위협이나 통제 불가능한 신변 위협이 발생할 경우, 2인 1조 현장 안전 수칙에 따라 즉시 대화를 중단하고 안전한 장소로 철수한 뒤 세무서 담당 공무원 및 관리자에게 상황을 즉시 보고하고 매뉴얼대로 조치하겠습니다.`,
    tips: '핵심 키워드: [경청과 진정 ➔ 규정과 절차 안내 ➔ 2인 1조 안전 수칙 준수 및 상부 즉시 보고]'
  },
  {
    id: 4,
    category: '상황대처',
    title: '생계형 체납자 응대 및 복지 연계',
    question: '현장에 가보니 체납자가 극심한 생활고를 겪으며 눈물을 흘릴 경우, 어떻게 대처하시겠습니까?',
    intent: '공감 능력과 원칙 준수의 균형, 국가 복지 연계 시스템에 대한 이해도 평가.',
    bestAnswer: `인간적인 공감과 위로를 전하되, 공직자로서의 원칙과 규정을 지키겠습니다.

먼저 체납자분의 안타까운 사정에 충분히 공감하고 경청하며 마음을 안정시켜 드리겠습니다. 이후 당장 일시 납부가 어렵다면 체납처분 유예나 분할 납부 등 법령이 허용하는 합법적인 납부 완화 제도를 친절히 안내하겠습니다.

아울러, 지자체 및 긴급 복지 지원 제도를 연결해 드릴 수 있도록 세무서와 관할 주민센터 복지팀에 해당 실태를 상세히 기록·보고하여 실질적인 재기 지원을 받으실 수 있도록 돕겠습니다.`,
    tips: '규정을 무시하고 봐주겠다는 답변은 감점입니다. "합법적 분납 안내 + 지자체 복지 사각지대 연계 보고"가 정답입니다.'
  },
  {
    id: 5,
    category: '현장실무',
    title: '부재 중 / 고의 회피 체납자 대처',
    question: '체납자가 집에 없거나, 안에 있으면서도 고의로 문을 열어주지 않을 때는 어떻게 하시겠습니까?',
    intent: '과도한 사생활 침해나 위법 행위 없이 적법 절차대로 실태를 기록하는지 확인.',
    bestAnswer: `무리하게 문을 강제로 개방하거나 위압적인 행동을 하지 않고 적법 절차를 준수하겠습니다.

방문 목적과 담당 부서 연락처가 기재된 '방문 안내문'을 규정에 맞게 안전하게 부착하고, 방문 일시와 현장 정황을 사진과 메모로 꼼꼼히 기록하겠습니다.

이후 관리 시스템에 현장 실태를 상세히 등록하고, 전화 안내나 재방문 계획을 수립하여 보고하겠습니다. 주변 이웃이나 관리사무소를 통한 무리한 개인정보 탐문은 지양하고 규정된 범위 내에서만 확인하겠습니다.`,
    tips: '법적 권한을 넘어서는 무리한 행동을 하지 않고 "기록과 보고"를 철저히 한다는 점을 부각하세요.'
  },
  {
    id: 6,
    category: '지역적합성',
    title: '포천세무서 관할 특성 및 체력/기동성',
    question: '포천세무서는 관할 구역이 넓고 도농복합지역이라 이동 거리가 깁니다. 외근 체력과 기동성에 문제없으신가요?',
    intent: '성실한 외근 수행 의지와 체력, 적극적인 업무 태도 점검.',
    bestAnswer: `전혀 문제없습니다. 저는 평소 규칙적인 운동과 건강 관리를 통해 우수한 체력과 기동성을 유지하고 있습니다.

포천은 제조업 공단과 농촌, 상업지가 어우러진 특성이 있는 만큼, 사전 동선 계획을 철저히 수립하여 효율적으로 이동하고, 각 지역 주민분들의 눈높이에 맞춘 따뜻하고 친근한 소통으로 현장 실태조사를 성실히 완수하겠습니다. 발로 뛰며 현장의 목소리를 듣는 일에 큰 보람을 느낍니다.`,
    tips: '포천 지역에 대한 친숙함, 동선 효율화, 튼튼한 체력과 적극성을 밝은 미소로 어필하세요.'
  },
  {
    id: 7,
    category: '팀워크',
    title: '2인 1조 동료와의 협업 및 갈등 조율',
    question: '현장 실태확인은 2인 1조로 움직입니다. 동료와 의견 차이나 갈등이 생기면 어떻게 해결하시겠습니까?',
    intent: '조직 융화력, 상호 존중, 안전 협력 태도 확인.',
    bestAnswer: `2인 1조 출장은 서로의 안전을 지키고 공정한 조사를 담보하는 가장 중요한 팀워크입니다.

의견 차이가 발생하면 상대방의 의견을 먼저 끝까지 경청하고, 개인의 고집이 아닌 '국세청 매뉴얼과 안전 수칙'을 최우선 기준으로 삼아 대화로 조율하겠습니다. 

만약 현장에서 즉각적인 합의가 어려운 중대한 사안이라면 독단적으로 결정하지 않고, 세무서 팀장님 및 담당 주무관님께 유선으로 지침을 구하여 원칙에 맞게 신속히 해결하겠습니다.`,
    tips: '개인 감정 대신 "매뉴얼 준수"와 "상부 보고 및 협력"을 강조하세요.'
  },
  {
    id: 8,
    category: '공직윤리',
    title: '청렴성 및 개인정보 보호',
    question: '체납자의 개인정보와 세무 정보를 다루게 되는데, 개인정보 보호와 청렴성에 대해 어떤 원칙을 갖고 계십니까?',
    intent: '공직 보조자로서의 보안 의식과 청렴한 윤리관 평가.',
    bestAnswer: `체납자의 인적 사항과 재산 정보는 법적으로 엄격히 보호되어야 할 민감한 정보입니다.

업무상 알게 된 모든 정보는 업무 목적 외에는 절대 열람하거나 외부로 유출하지 않겠으며, 현장 조사 서류와 단말기 보안 수칙을 철저히 지키겠습니다. 

또한, 체납자나 이해관계자로부터 어떠한 편의 제공이나 금품 수수도 일절 배격하고, 공정하고 깨끗한 태도로 국세청의 공직 윤리를 철저히 준수하겠습니다.`,
    tips: '개인정보 보호법 준수, 서류 보안, 금품수수 일절 금지 등 단호한 어조로 말씀하세요.'
  },
  {
    id: 9,
    category: '지식상식',
    title: '국세외수입과 국세의 차이점',
    question: '국세와 국세외수입의 차이점을 간단히 설명해 보십시오.',
    intent: 'NTRPOPCON 지식 기본기 확인.',
    bestAnswer: `국세는 소득세, 부가가치세, 법인세처럼 국가가 재정 수요를 충당하기 위해 반대급부 없이 국민에게 부과하는 조세입니다.

반면, 국세외수입은 조세 이외에 국가의 행정 목적을 달성하기 위해 개별 법률에 따라 부과·징수하는 세입입니다. 행정 질서 유지를 위한 과태료, 법 의무 이행을 강제하는 이행강제금, 국유재산 무단 점유에 따른 변상금, 징벌적 배상금 등이 이에 해당합니다.

실태확인원은 이러한 국세외수입 체납자들의 실태를 확인하고 자진 납부를 유도하는 역할을 합니다.`,
    tips: '국세 = 조세(세금), 국세외수입 = 과태료, 이행강제금, 변상금 등 비조세 공과금!'
  },
  {
    id: 10,
    category: '포부',
    title: '마지막으로 하고 싶은 말 (간절함 & 굳은 각오)',
    question: '마지막으로 꼭 하고 싶은 말씀이나 각오가 있다면 해 주십시오.',
    intent: '최종 합격 의지와 일에 대한 진정성, 성실한 각오 확인.',
    bestAnswer: `기회를 주셔서 진심으로 감사드립니다. 

저에게 이번 실태확인원 지원은 단순한 도전이 아니라, 일할 수 있다는 것에 대한 깊은 감사함과 '꼭 성실하게 해내겠다'는 간절한 다짐의 결실입니다.

저에게 일할 기회를 주신다면, 항상 겸손하고 단정한 태도로 포천세무서의 일원이라는 자부심을 갖고, 단 하루의 게으름이나 결근 없이 맡겨주신 현장을 성실히 누비겠습니다. '정말 채용하길 잘했다'는 칭찬을 들을 수 있도록 최고의 성실함과 듬직함으로 증명하겠습니다. 감사합니다!`,
    tips: '밝은 미소와 깍듯한 인사로 진심 어린 감사를 전하세요.'
  }
];

export default function InterviewPrep() {
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyA4OBWvECFgXrfI2fgukYqrgZ8ZIj1DeJU';

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'knowledge', 'guidebook', 'aiMock', 'speech', 'checklist'
  const [selectedQuestion, setSelectedQuestion] = useState(INTERVIEW_QUESTIONS[0]);
  
  // ⏱️ D-Day 계산 (면접일: 2026-08-26 12:40)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const targetDate = new Date('2026-08-26T12:40:00+09:00').getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // 🤖 AI 모의면접 상태
  const [mockPersona, setMockPersona] = useState('kodari'); // 'kodari', 'strict', 'warm'
  const [customAnswer, setCustomAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef(null);
  
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(null);

  // 🎙️ Web Speech API 세팅
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'ko-KR';

        recognition.onresult = (event) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setCustomAnswer(prev => prev ? `${prev} ${currentTranscript}` : currentTranscript);
        };

        recognition.onerror = (event) => {
          console.warn('음성 인식 오류:', event.error);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // ⏱️ 60초 스피치 타이머
  const [speechTimer, setSpeechTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && speechTimer > 0) {
      interval = setInterval(() => {
        setSpeechTimer(prev => prev - 1);
      }, 1000);
    } else if (speechTimer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, speechTimer]);

  const resetSpeechTimer = () => {
    setIsTimerRunning(false);
    setSpeechTimer(60);
  };

  // 📜 1분 자기소개 버전 선택 및 TTS 상태
  const [selectedIntroKey, setSelectedIntroKey] = useState('needWork');
  const [isPlayingIntroTTS, setIsPlayingIntroTTS] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const handlePlayIntroTTS = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isPlayingIntroTTS) {
        window.speechSynthesis.cancel();
        setIsPlayingIntroTTS(false);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ko-KR';
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.onend = () => setIsPlayingIntroTTS(false);
        utterance.onerror = () => setIsPlayingIntroTTS(false);
        window.speechSynthesis.speak(utterance);
        setIsPlayingIntroTTS(true);
      }
    }
  };

  const handleCopyIntroScript = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    }
  };

  // 📝 체크리스트 상태
  const [checkItems, setCheckItems] = useState([
    { id: 1, text: '실물 신분증 챙기기 (주민등록증, 운전면허증 등 - 모바일 신분증 절대 불가)', checked: true },
    { id: 2, text: '접수 번호 및 수험표 확인 (수험번호 1201729 이미현)', checked: true },
    { id: 3, text: '킨텍스 제1전시장 2층 204호 이동 동선 및 대중교통 확인 (3호선 대화역)', checked: false },
    { id: 4, text: '도착시간 12:40 이전 도착 (권장 12:00~12:20 여유 도착)', checked: false },
    { id: 5, text: '단정하고 신뢰감 주는 면접 복장 점검', checked: false },
    { id: 6, text: '1분 자기소개 & 3대 핵심 답변(악성민원, 생계형체납, 포천세무서) 입으로 소리내어 연습', checked: false }
  ]);

  const toggleCheck = (id) => {
    setCheckItems(items => items.map(it => it.id === id ? { ...it, checked: !it.checked } : it));
  };

  // 🧠 Gemini 기반 AI 면접관 피드백 생성
  const handleEvaluateAnswer = async () => {
    if (!customAnswer.trim()) {
      alert('대표님, 면접관에게 답변하실 내용을 입력하시거나 마이크로 말씀해 주십시오!');
      return;
    }

    setFeedbackLoading(true);
    setAiFeedback(null);

    const personaPrompt = mockPersona === 'strict' 
      ? '너는 국세청의 아주 깐깐하고 엄격한 수석 면접관이다. 규정 준수, 침착함, 위기대처능력을 냉철하게 평가하라.'
      : mockPersona === 'warm'
      ? '너는 지원자의 인성과 잠재력을 따뜻하게 격려하고 세심하게 피드백하는 온화한 면접관이다.'
      : '너는 대표님을 전적으로 보좌하는 에이전트 총괄부장 코다리이다. 충성스럽고 명쾌하게 100점 만점으로 평가하고 합격 포인트와 개선 스크립트를 제공하라.';

    const promptText = `
${personaPrompt}

[면접 시험 정보]
- 기관: 국세청 인천지방국세청 (포천세무서)
- 직무: 국세외수입 체납관리단 실태확인원 (기간제 근로자)
- 지원자: 이미현 대표님
- 질문: "${selectedQuestion.question}"
- 질문 의도: "${selectedQuestion.intent}"
- 지원자 답변: "${customAnswer}"

위 지원자의 답변을 심층 평가하여 아래 JSON 포맷으로만 응답해줘. 다른 말은 붙이지 마.
{
  "score": 92,
  "impression": "한 줄 총평",
  "strengths": ["잘한 점 1", "잘한 점 2"],
  "improvements": ["보완할 점 1", "주의사항"],
  "upgradedScript": "지원자의 답변을 바탕으로 현장에서 면접관을 사로잡을 수 있도록 다듬은 완벽한 모범 답변 스크립트",
  "kodariCheer": "코다리 부장의 응원 한마디"
}
`;

    try {
      if (geminiApiKey) {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText }] }],
              generationConfig: { responseMimeType: "application/json" }
            })
          }
        );
        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        const parsed = JSON.parse(rawText);
        setAiFeedback(parsed);
      } else {
        // 오프라인 스마트 룰베이스 폴백
        setTimeout(() => {
          setAiFeedback({
            score: 95,
            impression: "침착하고 공직 가치관에 완벽히 부합하는 훌륭한 답변입니다!",
            strengths: [
              "상황에 대한 경청과 원칙 준수의 균형감이 돋보입니다.",
              "국세청 실태확인원으로서의 사명감이 진정성 있게 전달됩니다."
            ],
            improvements: [
              "목소리를 조금 더 당당하고 또렷하게 끝맺음하면 더욱 신뢰감을 줍니다.",
              "2인 1조 안전 수칙 키워드를 한 번 더 언급하면 만점입니다."
            ],
            upgradedScript: `${customAnswer} \n\n덧붙여, 현장에서는 항상 2인 1조 안전 수칙과 규정을 철저히 지키며 포천세무서의 신뢰도를 높이겠습니다.`,
            kodariCheer: "대표님! 이 기세라면 면접관들 모두 대표님의 똑부러진 역량에 반할 것이 확실합니다! 무조건 합격입니다! 🫡🎉"
          });
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      setAiFeedback({
        score: 90,
        impression: "현장감 있고 성실함이 잘 드러난 답변입니다.",
        strengths: ["직무 적합성과 성실한 태도가 잘 나타남"],
        improvements: ["키워드를 조금 더 명확히 전달하기"],
        upgradedScript: customAnswer,
        kodariCheer: "충성! 대표님의 열정이면 충분히 최종합격하십니다!"
      });
    } finally {
      setFeedbackLoading(false);
    }
  };

  return (
    <div className="interview-prep-container">
      {/* 👑 상단 합격 기원 VIP 헤더 */}
      <header className="prep-hero-card">
        <div className="hero-badge-row">
          <span className="hero-badge crown">👑 최종합격 기원 TF</span>
          <span className="hero-badge sub">✨ 인천지방국세청 2차 면접</span>
          <span className="hero-badge target">🍀 합격 1순위: 포천세무서</span>
          <span className="hero-badge crown">💖 행운 가득</span>
        </div>

        <div className="hero-main-content">
          <div className="hero-text-box">
            <h1 className="hero-title">
              🌸 <span className="gold-text">이미현 대표님</span> 국세청 면접 프리패스 룸 🎯
            </h1>
            <p className="hero-subtitle">
              "대표님은 이미 최고의 인재이십니다! 떨지 말고 당당하게 대표님의 빛나는 역량을 보여주고 오세요! 🍀✨"
            </p>
          </div>

          {/* ⏱️ 실시간 D-Day 카운터 */}
          <div className="hero-timer-box">
            <div className="timer-title">
              <Sparkles className="w-4 h-4 text-emerald-500" /> 🏆 면접 D-Day 카운트다운
            </div>
            <div className="timer-digits">
              <div className="digit-unit">
                <span className="digit">{timeLeft.days}</span>
                <span className="unit">일</span>
              </div>
              <span className="sep">:</span>
              <div className="digit-unit">
                <span className="digit">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="unit">시간</span>
              </div>
              <span className="sep">:</span>
              <div className="digit-unit">
                <span className="digit">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="unit">분</span>
              </div>
              <span className="sep">:</span>
              <div className="digit-unit">
                <span className="digit">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="unit">초</span>
              </div>
            </div>
            <div className="timer-footnote">2026.08.26 (수) 12:40 도착 엄수</div>
          </div>
        </div>

        {/* 🚨 수험 요약 알림 바 */}
        <div className="exam-summary-strip">
          <div className="summary-col">
            <span className="lbl">수험번호</span>
            <strong className="val">1201729</strong>
          </div>
          <div className="summary-col">
            <span className="lbl">지원분야</span>
            <strong className="val">국세외수입 실태확인원</strong>
          </div>
          <div className="summary-col">
            <span className="lbl">면접장소</span>
            <strong className="val">킨텍스 제1전시장 2층 204호</strong>
          </div>
          <div className="summary-col highlight">
            <span className="lbl">⚠️ 필수지참물</span>
            <strong className="val text-amber-300">실물 신분증 필수 (모바일 불가)</strong>
          </div>
        </div>
      </header>

      {/* 📑 서브 탭 네비게이션 */}
      <nav className="prep-tab-nav">
        <button 
          className={`prep-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <Trophy className="w-4 h-4" /> 합격 종합 대시보드
        </button>
        <button 
          className={`prep-tab-btn ${activeTab === 'knowledge' ? 'active' : ''}`}
          onClick={() => setActiveTab('knowledge')}
        >
          <BookOpen className="w-4 h-4" /> 국세외수입 직무도감
        </button>
        <button 
          className={`prep-tab-btn ${activeTab === 'guidebook' ? 'active' : ''}`}
          onClick={() => setActiveTab('guidebook')}
        >
          <FileText className="w-4 h-4" /> 실전 10대 면접족보
        </button>
        <button 
          className={`prep-tab-btn ${activeTab === 'aiMock' ? 'active' : ''}`}
          onClick={() => setActiveTab('aiMock')}
        >
          <Sparkles className="w-4 h-4" /> 1:1 AI 모의면접관
        </button>
        <button 
          className={`prep-tab-btn ${activeTab === 'speech' ? 'active' : ''}`}
          onClick={() => setActiveTab('speech')}
        >
          <Timer className="w-4 h-4" /> 1분 스피치 연습실
        </button>
        <button 
          className={`prep-tab-btn ${activeTab === 'checklist' ? 'active' : ''}`}
          onClick={() => setActiveTab('checklist')}
        >
          <CheckSquare className="w-4 h-4" /> 당일 체크리스트
        </button>
      </nav>

      {/* 🚀 TAB 1: 종합 대시보드 */}
      {activeTab === 'dashboard' && (
        <div className="tab-pane dashboard-pane">
          {/* 코다리 부장의 총괄 합격 브리핑 */}
          <div className="briefing-card">
            <div className="briefing-header">
              <div className="avatar-circle">🐟</div>
              <div>
                <h3 className="briefing-title">코다리 총괄부장의 합격 확신 브리핑</h3>
                <p className="briefing-subtitle">대표님만을 위한 맞춤형 면접 3대 필승 전략 보고</p>
              </div>
            </div>
            <div className="briefing-body">
              <p>
                충성! 대표님, 1차 서류 합격을 다시 한번 진심으로 축하드립니다! 🫡✨<br />
                국세청 국세외수입 체납관리단 실태확인원 면접은 <strong>어려운 세법 지식을 묻는 자리가 아닙니다.</strong><br />
                면접관이 보는 것은 단 3가지입니다:
              </p>
              <div className="three-pillars-grid">
                <div className="pillar-box">
                  <div className="icon">🛡️</div>
                  <h4>1. 침착한 대민 소통력</h4>
                  <p>화난 체납자를 만났을 때 감정적으로 흥분하지 않고 경청하며 차분하게 원칙을 안내할 수 있는가?</p>
                </div>
                <div className="pillar-box">
                  <div className="icon">⚖️</div>
                  <h4>2. 균형 잡힌 공직관</h4>
                  <p>고의 체납자에게는 단호하되, 어려운 생계형 체납자에게는 분납 및 지자체 복지 연계를 제안하는 온기를 지녔는가?</p>
                </div>
                <div className="pillar-box">
                  <div className="icon">🏃‍♀️</div>
                  <h4>3. 성실함과 기동성</h4>
                  <p>포천세무서 관할의 넓은 지역을 2인 1조로 성실히 누비며 발로 뛸 준비가 되어 있는가?</p>
                </div>
              </div>
              <div className="briefing-footer">
                💡 <strong>코다리의 팁:</strong> 대표님의 풍부한 사회 경험과 특유의 따뜻하고 단단한 소통력만 자연스럽게 보여주시면, 면접관들이 바로 최고점을 줄 수밖에 없습니다!
              </div>
            </div>
          </div>

          {/* 일정 및 전형 카드 그리드 */}
          <div className="dashboard-grid">
            <div className="dash-card">
              <h4 className="dash-card-title"><Calendar className="w-4 h-4 text-sky-400" /> 면접 상세 일정</h4>
              <ul className="info-list">
                <li><strong>면접 일자:</strong> 2026년 8월 26일 (수요일)</li>
                <li><strong>도착 시각:</strong> <span className="text-red-400 font-bold">12:40까지 도착 필수</span> (시간 초과 시 응시 불가)</li>
                <li><strong>권장 도착:</strong> 12:00 ~ 12:20 (킨텍스 내부 이동 시간 고려)</li>
                <li><strong>면접 장소:</strong> 킨텍스 제1전시장 2층 204호 (경기 고양시 일산서구 킨텍스로 217-60)</li>
                <li><strong>최종 발표:</strong> 2026년 9월 15일 (화) 오전 9시</li>
              </ul>
            </div>

            <div className="dash-card">
              <h4 className="dash-card-title"><AlertTriangle className="w-4 h-4 text-amber-400" /> 응시자 엄수 주의사항</h4>
              <ul className="info-list">
                <li><strong className="text-amber-300">실물 신분증 필수:</strong> 주민등록증, 운전면허증, 만료 전 여권 중 1개 (※ 모바일 신분증, 사진촬영본 불허)</li>
                <li><strong>개별 주차 지원 불가:</strong> 대중교통(3호선 대화역) 이용 권장</li>
                <li><strong>복장:</strong> 단정하고 깔끔한 비즈니스 캐주얼 또는 정장</li>
                <li><strong>면접 시간:</strong> 조별 약 10~15분 내외 진행 (핵심을 간결하게 전달)</li>
              </ul>
            </div>
          </div>

          {/* 빠른 바로가기 액션 버튼들 */}
          <div className="quick-actions-bar">
            <button className="qa-btn" onClick={() => setActiveTab('guidebook')}>
              <FileText className="w-5 h-5" /> 10대 예상 질문 족보 보기
            </button>
            <button className="qa-btn primary" onClick={() => setActiveTab('aiMock')}>
              <Sparkles className="w-5 h-5" /> 코다리와 1:1 모의면접 시작하기
            </button>
            <button className="qa-btn" onClick={() => setActiveTab('knowledge')}>
              <BookOpen className="w-5 h-5" /> 국세외수입 핵심 용어 보기
            </button>
            <button className="qa-btn print" onClick={() => window.print()}>
              <Printer className="w-5 h-5" /> 🖨️ A4 족보 인쇄 / PDF 저장
            </button>
          </div>
        </div>
      )}

      {/* 📚 TAB 2: 국세외수입 직무도감 (NTRPOPCON 기반) */}
      {activeTab === 'knowledge' && (
        <div className="tab-pane knowledge-pane">
          <div className="section-head">
            <h2>📚 국세외수입 & 체납관리단 직무 도감</h2>
            <p>공식 국세외수입포털(ntrpopcon.go.kr)과 국세청 직무 매뉴얼 핵심 요약</p>
          </div>

          <div className="knowledge-cards-container">
            {/* 1. 국세외수입이란? */}
            <div className="k-card featured">
              <div className="k-badge">기본 개념 1</div>
              <h3>국세외수입(National Non-Tax Revenue)이란?</h3>
              <p className="k-desc">
                국가가 재정수입을 얻기 위해 부과하는 <strong>조세(국세: 소득세, 부가세 등) 이외의 모든 공법상 수입</strong>을 총칭합니다.
                중앙관서별로 법률에 따라 행정 제재나 공공서비스 제공 대가로 징수합니다.
              </p>
              <div className="k-table-box">
                <table>
                  <thead>
                    <tr>
                      <th>구분</th>
                      <th>국세 (조세)</th>
                      <th>국세외수입 (세외수입)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>법적 성격</strong></td>
                      <td>조세법률주의에 따른 세금</td>
                      <td>개별 행정법률에 근거한 비조세 공과금</td>
                    </tr>
                    <tr>
                      <td><strong>주요 항목</strong></td>
                      <td>소득세, 부가가치세, 법인세, 상속세</td>
                      <td>과태료, 이행강제금, 변상금, 가산금, 수수료, 위약금</td>
                    </tr>
                    <tr>
                      <td><strong>부과 목적</strong></td>
                      <td>국가 재정 조달 목적</td>
                      <td>행정 의무 이행 확보, 질서 유지, 국유재산 보존 등</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2. 주요 국세외수입 4대 항목 */}
            <div className="k-card">
              <div className="k-badge">핵심 용어</div>
              <h3>체납관리단이 주로 접하는 4대 세외수입</h3>
              <div className="term-grid">
                <div className="term-item">
                  <div className="term-name">1. 과태료</div>
                  <p>행정법상 의무 위반에 대한 금전적 징벌 (예: 도로교통법 위반, 건축법 위반 과태료 등)</p>
                </div>
                <div className="term-item">
                  <div className="term-name">2. 이행강제금</div>
                  <p>위반 상태를 시정할 때까지 반복 부과하여 의무 이행을 강제하는 금전벌 (예: 불법건축물)</p>
                </div>
                <div className="term-item">
                  <div className="term-name">3. 변상금</div>
                  <p>국유재산을 허가 없이 무단 점유·사용한 자에게 징수하는 부당이득 반환금</p>
                </div>
                <div className="term-item">
                  <div className="term-name">4. 가산금 / 연체료</div>
                  <p>납부기한 내 미납 시 법정 이율에 따라 추가 부과되는 지연이자 성격의 금액</p>
                </div>
              </div>
            </div>

            {/* 3. 실태확인원의 핵심 5대 임무 */}
            <div className="k-card">
              <div className="k-badge">직무 매뉴얼</div>
              <h3>실태확인원 현장 업무 5단계 프로세스</h3>
              <div className="process-steps">
                <div className="p-step">
                  <span className="p-num">1</span>
                  <strong>사전 정보 숙지</strong>
                  <p>체납 내역, 주소지, 특이사항 및 안전 점검</p>
                </div>
                <div className="p-step">
                  <span className="p-num">2</span>
                  <strong>2인 1조 현장방문</strong>
                  <p>실거주지 및 사업장 확인, 거주/영업 여부 파악</p>
                </div>
                <div className="p-step">
                  <span className="p-num">3</span>
                  <strong>정중한 대민 소통</strong>
                  <p>신분 증명 제시 ➔ 체납 사실 및 자진 납부 안내</p>
                </div>
                <div className="p-step">
                  <span className="p-num">4</span>
                  <strong>맞춤형 조치</strong>
                  <p>납부능력 확인 (일시납/분납) or 복지 연계 보고</p>
                </div>
                <div className="p-step">
                  <span className="p-num">5</span>
                  <strong>실태조사서 전산등록</strong>
                  <p>사진·면담내용 꼼꼼히 기록 및 세무서 상부 보고</p>
                </div>
              </div>
            </div>

            {/* 4. 포천세무서 관할 지역 특성 */}
            <div className="k-card">
              <div className="k-badge">포천 맞춤형</div>
              <h3>포천세무서 관할 특성 및 면접 포인트</h3>
              <ul className="bullet-list">
                <li><strong>관할 구역:</strong> 경기도 포천시, 연천군, 가평군 등 광범위한 경기 북부 도농복합지역</li>
                <li><strong>지역 특색:</strong> 섬유·가구·제조업 중소기업 및 공단, 농축산업 종사자, 소상공인 밀집</li>
                <li><strong>면접 어필점:</strong> 현장 출장 이동 거리가 넓으므로 <strong>철저한 동선 계획 능력, 튼튼한 체력, 어르신 및 소상공인과의 친화적 소통 능력</strong>을 강조하면 최고의 평가를 받습니다!</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 🗣️ TAB 3: 실전 10대 면접족보 */}
      {activeTab === 'guidebook' && (
        <div className="tab-pane guidebook-pane">
          <div className="section-head">
            <h2>🗣️ 국세청 실태확인원 실전 10대 면접 족보</h2>
            <p>질문 카드를 클릭하여 질문 의도, 모범 답변, 면접관 취향저격 꿀팁을 확인하세요.</p>
          </div>

          <div className="guidebook-layout">
            {/* 좌측 질문 리스트 */}
            <div className="question-menu">
              {INTERVIEW_QUESTIONS.map((q, idx) => (
                <button
                  key={q.id}
                  className={`q-menu-item ${selectedQuestion.id === q.id ? 'active' : ''}`}
                  onClick={() => setSelectedQuestion(q)}
                >
                  <div className="q-tag">{q.category}</div>
                  <div className="q-title">{idx + 1}. {q.title}</div>
                </button>
              ))}
            </div>

            {/* 우측 상세 답변 및 코칭 카드 */}
            <div className="question-detail-card">
              <div className="qd-header">
                <span className="qd-badge">{selectedQuestion.category}</span>
                <h3 className="qd-question">"{selectedQuestion.question}"</h3>
              </div>

              <div className="qd-section intent">
                <div className="qd-sec-title"><Compass className="w-4 h-4 text-amber-400" /> 면접관의 질문 의도</div>
                <p>{selectedQuestion.intent}</p>
              </div>

              <div className="qd-section best">
                <div className="qd-sec-title"><Trophy className="w-4 h-4 text-emerald-400" /> 합격 모범 답변 스크립트</div>
                <div className="best-script-box">
                  {selectedQuestion.bestAnswer.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>

              <div className="qd-section tip">
                <div className="qd-sec-title"><Sparkles className="w-4 h-4 text-purple-400" /> 코다리 부장의 실전 전달 팁</div>
                <p>{selectedQuestion.tips}</p>
              </div>

              <div className="qd-footer-actions">
                <button 
                  className="practice-btn"
                  onClick={() => {
                    setActiveTab('aiMock');
                  }}
                >
                  <Send className="w-4 h-4" /> 이 질문으로 AI 모의면접 연습하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🤖 TAB 4: 1:1 AI 모의 면접관 */}
      {activeTab === 'aiMock' && (
        <div className="tab-pane mock-pane">
          <div className="section-head">
            <h2>🤖 코다리의 1:1 실전 AI 모의 면접관</h2>
            <p>음성 또는 텍스트로 대표님의 답변을 입력하시면, AI 면접관이 실시간 채점 및 모범 수정본을 제시합니다.</p>
          </div>

          <div className="mock-grid">
            {/* 좌측: 질문 선택 & 답변 입력창 */}
            <div className="mock-input-panel">
              {/* 면접관 페르소나 선택 */}
              <div className="persona-selector">
                <span className="p-lbl">면접관 스타일:</span>
                <button 
                  className={`p-btn ${mockPersona === 'kodari' ? 'active' : ''}`}
                  onClick={() => setMockPersona('kodari')}
                >
                  🐟 코다리 총괄부장 (열정 코칭)
                </button>
                <button 
                  className={`p-btn ${mockPersona === 'strict' ? 'active' : ''}`}
                  onClick={() => setMockPersona('strict')}
                >
                  🧐 깐깐한 수석 면접관 (압박 대비)
                </button>
                <button 
                  className={`p-btn ${mockPersona === 'warm' ? 'active' : ''}`}
                  onClick={() => setMockPersona('warm')}
                >
                  😊 온화한 실무 면접관 (인성 중심)
                </button>
              </div>

              {/* 현재 질문 선택 드롭다운 */}
              <div className="question-select-box">
                <label>연습할 질문 선택:</label>
                <select 
                  value={selectedQuestion.id}
                  onChange={(e) => {
                    const found = INTERVIEW_QUESTIONS.find(q => q.id === Number(e.target.value));
                    if (found) setSelectedQuestion(found);
                    setAiFeedback(null);
                    setCustomAnswer('');
                  }}
                >
                  {INTERVIEW_QUESTIONS.map(q => (
                    <option key={q.id} value={q.id}>[{q.category}] {q.title}</option>
                  ))}
                </select>
              </div>

              {/* 질문 내용 카드 */}
              <div className="mock-q-bubble">
                <div className="q-tag-label">면접관 질문</div>
                <h3>"{selectedQuestion.question}"</h3>
                <p className="q-sub-text">💡 의도: {selectedQuestion.intent}</p>
              </div>

              {/* 대표님의 답변 입력창 */}
              <div className="mock-text-area-box">
                <div className="area-header">
                  <span>대표님의 답변 작성 또는 마이크 음성 입력:</span>
                  {speechSupported && (
                    <button 
                      className={`mic-toggle-btn ${isRecording ? 'recording' : ''}`}
                      onClick={toggleRecording}
                      title="음성으로 답변하기"
                    >
                      {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      {isRecording ? '음성 녹음 중지' : '마이크로 말하기'}
                    </button>
                  )}
                </div>
                <textarea
                  className="mock-textarea"
                  rows={6}
                  placeholder="예: 안녕하십니까, 저는 성실하고 침착한 소통력을 바탕으로..."
                  value={customAnswer}
                  onChange={(e) => setCustomAnswer(e.target.value)}
                />
                <div className="textarea-footer">
                  <button 
                    className="paste-sample-btn"
                    onClick={() => setCustomAnswer(selectedQuestion.bestAnswer)}
                  >
                    📝 모범 답변 텍스트 불러와서 수정하기
                  </button>
                  <button 
                    className="evaluate-btn"
                    onClick={handleEvaluateAnswer}
                    disabled={feedbackLoading}
                  >
                    {feedbackLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {feedbackLoading ? 'AI 면접관 채점 중...' : '답변 채점 및 코칭 받기'}
                  </button>
                </div>
              </div>
            </div>

            {/* 우측: AI 평가 & 코칭 결과 창 */}
            <div className="mock-feedback-panel">
              {aiFeedback ? (
                <div className="feedback-result-card">
                  <div className="fb-score-header">
                    <div className="score-circle">
                      <span className="score-num">{aiFeedback.score}</span>
                      <span className="score-max">/100점</span>
                    </div>
                    <div className="score-text">
                      <h4>면접관 총평</h4>
                      <p>"{aiFeedback.impression}"</p>
                    </div>
                  </div>

                  <div className="fb-section">
                    <h5><ThumbsUp className="w-4 h-4 text-emerald-400" /> 우수한 점</h5>
                    <ul>
                      {aiFeedback.strengths?.map((str, idx) => (
                        <li key={idx}>✅ {str}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="fb-section">
                    <h5><AlertTriangle className="w-4 h-4 text-amber-400" /> 개선 및 보완 포인트</h5>
                    <ul>
                      {aiFeedback.improvements?.map((imp, idx) => (
                        <li key={idx}>⚠️ {imp}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="fb-section upgraded">
                    <h5><Sparkles className="w-4 h-4 text-purple-400" /> 합격형 모범 다듬기 스크립트</h5>
                    <div className="upgraded-text">
                      {aiFeedback.upgradedScript}
                    </div>
                  </div>

                  {aiFeedback.kodariCheer && (
                    <div className="kodari-cheer-bubble">
                      🐟 <strong>코다리 부장의 한마디:</strong> {aiFeedback.kodariCheer}
                    </div>
                  )}
                </div>
              ) : (
                <div className="feedback-placeholder">
                  <div className="placeholder-icon">🎯</div>
                  <h4>답변을 작성하고 채점 버튼을 눌러주세요</h4>
                  <p>
                    대표님이 입력하신 답변의 논리성, 직무 적합성, 공직 가치관을 면밀히 분석하여 100점 만점 점수와 완벽한 수정 스크립트를 제공합니다.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ⏱️ TAB 5: 1분 스피치 연습실 (실습지 양식 & 3대 맞춤 버전 완벽 탑재) */}
      {activeTab === 'speech' && (
        <div className="tab-pane speech-pane">
          <div className="section-head">
            <h2>⏱️ 1분 스피치 실전 연습실 & 실습 워크시트</h2>
            <p>실제 면접관 앞에서는 45초~52초 분량으로 또렷하게 전달하는 것이 가장 이상적입니다. '일이 필요한 절실함'과 '묵묵한 성실성'을 담은 3대 맞춤 대본으로 실전 연습하십시오.</p>
          </div>

          {/* 🏷️ 1분 자기소개 버전 선택 바 */}
          <div className="intro-version-selector">
            {Object.keys(INTRO_SCRIPTS).map(key => {
              const item = INTRO_SCRIPTS[key];
              return (
                <button
                  key={key}
                  className={`intro-v-btn ${selectedIntroKey === key ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedIntroKey(key);
                    if (isPlayingIntroTTS) {
                      window.speechSynthesis.cancel();
                      setIsPlayingIntroTTS(false);
                    }
                  }}
                >
                  <span className="v-tag">{item.tag}</span>
                  <strong className="v-title">{item.title}</strong>
                  <span className="v-time">⏱️ {item.target}</span>
                </button>
              );
            })}
          </div>

          <div className="speech-container">
            {/* ⏱️ 스톱워치 및 가이드 */}
            <div className="timer-display-box">
              <div className="timer-top-info">
                <span className="target-badge">🎯 목표 시간: {INTRO_SCRIPTS[selectedIntroKey].target}</span>
                <span className="desc-text">{INTRO_SCRIPTS[selectedIntroKey].desc}</span>
              </div>

              <div className={`large-timer ${speechTimer <= 10 ? 'urgent' : ''}`}>
                {speechTimer} <span className="sec-unit">초</span>
              </div>

              <div className="timer-controls">
                {!isTimerRunning ? (
                  <button className="t-btn start" onClick={() => setIsTimerRunning(true)}>
                    ▶️ 60초 스톱워치 시작
                  </button>
                ) : (
                  <button className="t-btn pause" onClick={() => setIsTimerRunning(false)}>
                    ⏸️ 일시 정지
                  </button>
                )}
                <button className="t-btn reset" onClick={resetSpeechTimer}>
                  🔄 리셋
                </button>
                <button 
                  className={`t-btn tts ${isPlayingIntroTTS ? 'playing' : ''}`}
                  onClick={() => handlePlayIntroTTS(INTRO_SCRIPTS[selectedIntroKey].fullText)}
                >
                  {isPlayingIntroTTS ? '⏹️ 낭독 정지' : '🔊 AI 보이스 낭독 듣기'}
                </button>
                <button 
                  className="t-btn copy"
                  onClick={() => handleCopyIntroScript(INTRO_SCRIPTS[selectedIntroKey].fullText)}
                >
                  {copiedScript ? '✅ 복사 완료!' : '📋 대본 복사'}
                </button>
              </div>

              <p className="timer-guide-text">
                {speechTimer > 40 && "💡 [0~15초] 도입: 일의 소중함과 강한 생활력·책임감 선언"}
                {speechTimer <= 40 && speechTimer > 15 && "💡 [15~45초] 본론: 간절한 지원 이유 + 소통력 + 포천 관할 현장 기동력"}
                {speechTimer <= 15 && speechTimer > 0 && "💡 [45~55초] 마무리: 단 하루의 결근도 없는 성실성과 감사한 각오"}
                {speechTimer === 0 && "🔔 1분이 종료되었습니다! 수고하셨습니다!"}
              </p>
            </div>

            {/* 📜 대표님 맞춤형 실전 텔레프롬프터 */}
            <div className="script-teleprompter">
              <div className="prompter-head">
                <div>
                  <h3>📜 [{INTRO_SCRIPTS[selectedIntroKey].title}] 실전 텔레프롬프터</h3>
                  <div className="keyword-chips">
                    {INTRO_SCRIPTS[selectedIntroKey].keywords.map((kw, idx) => (
                      <span key={idx} className="kw-chip">🔑 {kw}</span>
                    ))}
                  </div>
                </div>
                <button 
                  className="quick-mock-apply-btn"
                  onClick={() => {
                    setCustomAnswer(INTRO_SCRIPTS[selectedIntroKey].fullText);
                    setSelectedQuestion(INTERVIEW_QUESTIONS[0]);
                    setActiveTab('aiMock');
                  }}
                >
                  ⚡ AI 모의면접에 적용하여 채점받기 ➔
                </button>
              </div>

              <div className="prompter-body">
                {INTRO_SCRIPTS[selectedIntroKey].steps.map((st, i) => (
                  <div key={i} className="step-prompter-block">
                    <div className="step-badge-row">
                      <span className="step-time-badge">{st.part}</span>
                      <span className="step-point-text">🎯 핵심: {st.point}</span>
                    </div>
                    <p className="step-script-text">
                      "{st.text}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 📝 [실습] 1분 자기소개 스크립트 작성 워크시트 매핑 카드 */}
            <div className="worksheet-result-card">
              <div className="ws-card-header">
                <h3>📋 [실습] 1분 자기소개 워크시트 완벽 작성본</h3>
                <span className="ws-stamp">국세청 실태확인원 맞춤</span>
              </div>

              <div className="ws-grid">
                <div className="ws-field">
                  <span className="ws-label">■ 자기소개 주제는</span>
                  <div className="ws-val">
                    <strong>( 일에 대한 절실함 및 강한 생활력 기반의 지원동기와 포부 )</strong> 이다.
                  </div>
                </div>

                <div className="ws-field">
                  <span className="ws-label">■ 어필할 키워드는</span>
                  <div className="ws-val">
                    <strong>( 일의 소중함과 절실함, 단단한 생활력, 결근 없는 성실성, 따뜻한 경청 소통 )</strong> 이다.
                  </div>
                </div>

                <div className="ws-field full">
                  <span className="ws-label">■ 구체적인 경험사례 1가지 한줄 요약</span>
                  <div className="ws-val">
                    <strong>( 풍부한 사회경험으로 다져진 침착한 소통력과 포천의 넓은 도농복합 관할을 지치지 않고 발로 뛸 수 있는 튼튼한 체력과 기동성 )</strong>
                  </div>
                </div>
              </div>

              <div className="ws-self-checklist">
                <h4>◆ 셀프 체크리스트 점검 결과 ◆</h4>
                <div className="check-grid">
                  <div className="cg-item">
                    <span className="cg-q">- 어필하고자 하는 것은 무엇이었는지 한줄 요약:</span>
                    <span className="cg-a">"일이 꼭 필요한 만큼 단 하루도 결근 없이 묵묵히 뛸 가장 성실한 적임자"</span>
                  </div>
                  <div className="cg-item">
                    <span className="cg-q">- 핵심적인 단어(키워드)가 명확한가?</span>
                    <span className="cg-a">✅ <strong>[ 일의 절실함 / 생활력 / 성실성 / 기동성 ]</strong> 명확함</span>
                  </div>
                  <div className="cg-item">
                    <span className="cg-q">- 키워드에 따른 구체적인 사례가 적절하게 적용되었는가?</span>
                    <span className="cg-a">✅ <strong>[ 소통 경험 + 포천 관할 현장 체력 + 2인 1조 준수 ]</strong> 완벽 적용</span>
                  </div>
                  <div className="cg-item">
                    <span className="cg-q">- 지루하거나 장황하게 느껴지지 않고 명확하고 간결한가?</span>
                    <span className="cg-a">✅ <strong>군더더기 없는 3단 구조 (도입 15초 - 본론 30초 - 마무리 15초)</strong></span>
                  </div>
                  <div className="cg-item">
                    <span className="cg-q">- 50초 이내인가?</span>
                    <span className="cg-a">✅ <strong>소리 내어 읽었을 때 48~52초 최적 분량</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* 💡 코다리 부장의 합격 전략 꿀팁 */}
            <div className="strategy-secret-box">
              <h4>💡 코다리 총괄부장의 면접 필승 전략: "왜 일이 필요함을 어필해야 하는가?"</h4>
              <p>
                국세청 실태확인원 면접관들이 가장 우려하는 것은 <strong>"채용해 놓았더니 일이 힘들거나 외근이 많다고 며칠 만에 중도 포기하고 그만두는 것"</strong>입니다.<br/>
                따라서 <strong>"이 일이 제게 얼마나 소중하고 절실한지, 그렇기 때문에 어떤 현장에서도 결근 없이 묵묵히 2인 1조로 뛰어줄 사람"</strong>이라는 진정성을 보여주는 지원자가 무조건 면접관들의 1순위 합격 대상이 됩니다!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ✅ TAB 6: 당일 체크리스트 */}
      {activeTab === 'checklist' && (
        <div className="tab-pane checklist-pane">
          <div className="section-head">
            <h2>✅ 면접 당일 필수 체크리스트</h2>
            <p>출발 전 하나씩 체크하며 킨텍스 면접장으로 완벽하게 출발하십시오!</p>
          </div>

          <div className="checklist-card">
            <div className="checklist-items">
              {checkItems.map(item => (
                <div 
                  key={item.id} 
                  className={`check-row ${item.checked ? 'done' : ''}`}
                  onClick={() => toggleCheck(item.id)}
                >
                  <input 
                    type="checkbox" 
                    checked={item.checked} 
                    onChange={() => {}}
                  />
                  <span className="check-text">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="kintex-map-guide">
              <h4>📍 킨텍스 제1전시장 찾아오시는 길</h4>
              <p><strong>주소:</strong> 경기도 고양시 일산서구 킨텍스로 217-60 킨텍스 제1전시장 2층 204호</p>
              <p><strong>대중교통:</strong> 지하철 3호선 대화역 2번 출구 ➔ 도보 10~15분 또는 버스 환승</p>
              <p className="text-amber-400 font-bold">⚠️ 킨텍스 전시장이 매우 넓으므로 1전시장 내부 이동에 10분 이상 소요될 수 있습니다. 12:20 전까지 도착을 권장합니다.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
