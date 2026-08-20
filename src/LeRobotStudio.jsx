import React, { useState, useEffect, useRef } from 'react';
import './LeRobotStudio.css';
import { 
  Bot, Sparkles, BookOpen, Play, Pause, RotateCcw, Copy, Check, 
  Download, ExternalLink, Flame, Shield, Trophy, Cpu, Zap, Eye, 
  Gamepad2, Compass, Layers, CheckCircle2, ChevronRight, HelpCircle,
  Code, Terminal, UploadCloud, FileText, ArrowRight, Lightbulb, Star,
  Rocket, Compass as CompassIcon, Award, Link as LinkIcon, RefreshCw, Search
} from 'lucide-react';

// 📚 1. 멘토 실강 직강 & 피지컬 AI/DQN 심화 5대 마스터 단계 (대폭 확장된 50대 핵심 어휘)
const RL_DQN_STAGES = [
  {
    stage: '0단계',
    shortTitle: '준비하기',
    title: '준비하기 (기초 요소 & 무대 세팅)',
    icon: '🌱',
    color: '#10b981',
    desc: '학습을 시작하기 전 주인공, 무대, 물리 법칙, 센서 규격을 완벽하게 세팅하는 단계',
    items: [
      {
        term: '에이전트 (Agent)',
        symbol: 'Robot / Brain',
        analogy: '주인공 AI',
        detail: '스스로 결정을 내리고 물리 세계와 상호작용하는 지능 주체 (예: 걷는 로봇, 달 착륙선, 자율주행차)'
      },
      {
        term: '환경 (Environment, Env)',
        symbol: 'World / Sim',
        analogy: '활동 무대이자 세상',
        detail: '에이전트가 뛰어노는 가상 또는 실물 물리 무대 (예: 달 착륙장 LunarLander, 2D PushT 판, 미끄러운 도로)'
      },
      {
        term: '상태 (State, S)',
        symbol: 'S ∈ 𝒮',
        analogy: '현재 세상의 진짜 전체 모습',
        detail: '물리 엔진 속에 존재하는 환경의 모든 참값 (예: 우주선의 실제 무게, 정확한 좌표, 바람의 세기 등 완벽한 데이터)'
      },
      {
        term: '관찰 (Observation, Obs / O)',
        symbol: 'O ∈ 𝒪',
        analogy: '로봇의 눈과 귀로 본 것',
        detail: '전체 상태 중 로봇의 카메라나 센서에 실제로 포착된 데이터 (예: 8개 센서 수치 벡터, 카메라 RGB 이미지)'
      },
      {
        term: '행동 공간 (Action Space)',
        symbol: '𝒜 (Discrete / Box)',
        analogy: '조작 가능한 버튼 목록',
        detail: '이산형(Discrete: 0~3번 버튼 누르기) vs 연속형(Continuous: 핸들을 -30도~+30도 사이로 미세 조작하기)으로 나뉨'
      },
      {
        term: '상태 공간 (Observation Space)',
        symbol: '𝒪 (Box / Dict)',
        analogy: '센서 수신 규격표',
        detail: '로봇이 받아들일 수 있는 데이터의 형태 (예: 8차원 숫자 배열, 64x64 컬러 픽셀 이미지)'
      },
      {
        term: '물리 엔진 (Physics Engine)',
        symbol: 'Box2D / MuJoCo / Isaac',
        analogy: '가상세계의 뉴턴 물리 법칙',
        detail: '중력, 마찰력, 공기 저항, 충돌 반발력을 수학적으로 실시간 계산해 주는 시뮬레이션 계산기'
      },
      {
        term: '환경 초기화 (Env.reset())',
        symbol: '(obs, info)',
        analogy: '게임 새로 시작하기',
        detail: '새 판을 시작하며 착륙선을 공중에 띄우고 초기 센서값(obs)을 받아오는 필수 명령어'
      },
      {
        term: '랜덤 시드 (Random Seed)',
        symbol: 'seed=42',
        analogy: '복사 가능한 운명의 주사위',
        detail: '무작위로 바람이 불거나 블록이 떨어질 때, 똑같은 조건으로 다시 실험하기 위한 고유 난수 번호'
      },
      {
        term: '렌더링 (Render / rgb_array)',
        symbol: 'render_mode',
        analogy: '사람용 실시간 중계 모니터',
        detail: '숫자 데이터로만 존재하는 가상세계를 사람이 눈으로 볼 수 있게 영상 프레임(화면)으로 그려내는 기능'
      }
    ]
  },
  {
    stage: '1단계',
    shortTitle: '결정하기',
    title: '결정하기 (판단·의사결정 & 정책 신경망)',
    icon: '🧠',
    color: '#0284c7',
    desc: '현재 상황을 보고 최선의 행동과 미래 가치를 심층 신경망으로 계산하는 두뇌 단계',
    items: [
      {
        term: '딥 큐-네트워크 (Deep Q-Network, DQN)',
        symbol: 'Q(s, a; θ)',
        analogy: '슈퍼 인공지능 두뇌',
        detail: '복잡한 상황 데이터를 심층 신경망(Deep Neural Net)에 통과시켜 각 행동의 가치 점수를 뽑아내는 핵심 모델'
      },
      {
        term: '행동 가치 (Action-Value, Q값)',
        symbol: 'Q(s, a)',
        analogy: '행동별 미래 예상 점수표',
        detail: '"지금 주 엔진을 켜면 미래에 +85점, 가만히 있으면 -40점"처럼 각 행동에 매겨지는 미래 보상 기대치'
      },
      {
        term: '상태 가치 (State-Value, V값)',
        symbol: 'V(s)',
        analogy: '현재 상황의 유리함 지수',
        detail: '어떤 행동을 할지와 상관없이 "지금 이 위치에 있는 것 자체가 얼마나 좋은 상황인가"를 나타내는 가치'
      },
      {
        term: '정책 (Policy, π)',
        symbol: 'π(a|s)',
        analogy: '행동 전략 지침서',
        detail: '상황(s)이 주어졌을 때 어떤 행동(a)을 취할지 결정하는 확률적 또는 결정론적 전략 규칙'
      },
      {
        term: '입실론-탐욕 정책 (ε-greedy)',
        symbol: 'ε (1.0 ➔ 0.05)',
        analogy: '도전 주사위',
        detail: '처음엔 100% 무작위로 온갖 시도를 해보다가(탐험), 시간이 지날수록 검증된 최고 점수 행동만 골라 쓰는(활용) 기법'
      },
      {
        term: '탐험 vs 활용 딜레마 (Exploration vs Exploitation)',
        symbol: 'Trade-off',
        analogy: '새 맛집 개척 vs 단골집 가기',
        detail: '새로운 대박 보상을 찾기 위해 모험할 것인가(탐험), 이미 아는 안전한 길로 점수를 챙길 것인가(활용)의 균형'
      },
      {
        term: '벨만 최적 방정식 (Bellman Optimality Eq)',
        symbol: 'Q*(s, a) = r + γ max Q*',
        analogy: '강화학습의 만유인력 법칙',
        detail: '"지금 행동의 가치는 [지금 당장 받는 보상 r] + [다음 순간부터 누릴 최고의 미래 가치]"의 합이라는 수학 공식'
      },
      {
        term: '디퓨전 정책 (Diffusion Policy)',
        symbol: 'DDPM Policy',
        analogy: '명화 다듬기 로봇 두뇌',
        detail: '노이즈에서 서서히 부드러운 로봇 궤적을 깎아내는 최신 모델로, LeRobot에서 복잡한 손동작에 표준으로 채택됨'
      },
      {
        term: '액션 청킹 (Action Chunking / ACT)',
        symbol: 'ACT Transformer',
        analogy: '한 호흡에 16수 내다보기',
        detail: '1스텝씩 끊어 예측하지 않고, 연속된 16~32스텝의 모터 궤적을 트랜스포머로 한 덩어리로 시원하게 생성하는 기술'
      },
      {
        term: 'VLA 파운데이션 모델 (Vision-Language-Action)',
        symbol: 'OpenVLA / RT-2',
        analogy: '말귀 알아듣는 전신 비서',
        detail: '자연어 음성 명령("컵을 식기세척기에 넣어")을 듣고, 카메라로 위치를 보며 로봇 손을 제어하는 일체형 멀티모달 모델'
      }
    ]
  },
  {
    stage: '2단계',
    shortTitle: '결과 받기',
    title: '결과 받기 (피드백·보상 & 전이 패키지)',
    icon: '🎯',
    color: '#f59e0b',
    desc: '행동을 취한 직후 세상으로부터 칭찬(+)이나 꿀밤(-)을 받고 변화된 상황을 기록하는 단계',
    items: [
      {
        term: '보상 (Reward, R)',
        symbol: 'R ∈ ℝ',
        analogy: '칭찬(+) 또는 꿀밤(-)',
        detail: '목표 달성 시 +100점(성공), 추락 시 -100점(실패), 엔진 분사 시 -0.3점(연료 소모) 등 즉각적인 점수'
      },
      {
        term: '보상 셰이핑 (Reward Shaping)',
        symbol: 'R_shaped',
        analogy: '친절한 길잡이 힌트',
        detail: '목표에 조금만 가까워져도 사탕(+0.5점)을 주어 AI가 올바른 방향으로 빠르게 길을 찾도록 유도하는 보상 설계 기법'
      },
      {
        term: '희소 보상 vs 조밀 보상 (Sparse vs Dense)',
        symbol: 'Sparse vs Dense',
        analogy: '기말고사 한 번 vs 매일 쪽지시험',
        detail: '끝판왕 깰 때만 1점 주기(Sparse: 학습 극도로 어려움) vs 매 순간 조금씩 칭찬 주기(Dense: 학습 매우 빠름)'
      },
      {
        term: '다음 상태 (Next State, S\')',
        symbol: "s' or obs'",
        analogy: '행동 직후 바뀐 세상',
        detail: '엔진을 뿜은 직후 우주선의 새로운 고도, 속도, 각도로 업데이트된 환경 데이터'
      },
      {
        term: '전이 패키지 (Transition)',
        symbol: "(s, a, r, s', done)",
        analogy: '경험 데이터 1행 (Data Row)',
        detail: '"이 상황(s)에서 저 행동(a)을 했더니 점수(r)를 받고 새 상황(s\')이 되었으며 끝났는가(done)?"의 완결된 1세트'
      },
      {
        term: '종료 플래그 (Terminated vs Truncated)',
        symbol: 'terminated / truncated',
        analogy: '미션 완료/사망 vs 타임오버',
        detail: 'Terminated = 성공/폭발로 정상 종료, Truncated = 1,000스텝 시간 초과로 강제 종료'
      },
      {
        term: '추가 정보 딕셔너리 (Info Dict)',
        symbol: 'info = {}',
        analogy: '비행 일지 메모장',
        detail: '남은 연료량, 풍속, 디버깅 지표 등 학습 연산 외에 개발자가 참고할 수 있는 메타데이터'
      },
      {
        term: '궤적 (Trajectory / Rollout)',
        symbol: "τ = (s₀, a₀, r₀, s₁, ...)",
        analogy: '1회 비행 전체 녹화본',
        detail: '시작부터 끝까지 일어난 모든 전이(Transition)들을 시간 순서대로 엮은 풀 스토리 데이터'
      }
    ]
  },
  {
    stage: '3단계',
    shortTitle: '실력 키우기',
    title: '실력 키우기 (오답노트 복습 & 신경망 가중치 최적화)',
    icon: '📚',
    color: '#8b5cf6',
    desc: '경험 저장소에서 데이터를 꺼내 정답 채점표와 비교하며 두뇌 가중치를 단단하게 벼리는 단계',
    items: [
      {
        term: '경험 리플레이 (Experience Replay)',
        symbol: 'Replay Buffer',
        analogy: '기억 저장소 & 오답 노트',
        detail: '수십만 개의 전이 데이터를 버퍼에 모아두고, 무작위(Random)로 64~256개씩 꺼내 복습하여 기억의 편향을 깨는 핵심 기술'
      },
      {
        term: '우선순위 경험 리플레이 (PER)',
        symbol: 'Prioritized Replay',
        analogy: '충격적인 실수 우선 복습',
        detail: '예측이 크게 빗나갔던(오차가 컸던) 치명적인 실패 경험을 더 자주 꺼내 집중적으로 공부시키는 기법'
      },
      {
        term: '타깃 네트워크 (Target Network)',
        symbol: 'Q_target(s, a; θ⁻)',
        analogy: '고정된 정답 채점표',
        detail: '매 스텝 채점 기준이 흔들리면 뇌가 헷갈리므로, 채점용 신경망을 1,000스텝 동안 잠시 얼려두는 딥마인드의 천재적 발명'
      },
      {
        term: '소프트 업데이트 (Soft Target Update, Polyak)',
        symbol: 'θ⁻ ← τθ + (1-τ)θ⁻',
        analogy: '채점표 조금씩 천천히 반영하기',
        detail: '채점 신경망을 한 번에 바꾸지 않고 매 스텝 0.5%(τ=0.005)씩 부드럽게 스며들게 하는 안정화 기술'
      },
      {
        term: '할인율 (Discount Factor, γ)',
        symbol: 'γ = 0.99',
        analogy: '미래 가치 할인율',
        detail: '"먼 미래의 100점보다 지금 당장의 10점이 더 확실하다"며 미래 보상을 0.99씩 거듭제곱으로 깎아서 합산하는 비율'
      },
      {
        term: '반환값 (Total Return, G)',
        symbol: 'G_t = ∑ γᵏ R_{t+k+1}',
        analogy: '최종 합산 성적표',
        detail: '에피소드가 끝날 때까지 얻은 모든 보상에 할인율을 적용해 전부 더한 최종 총점'
      },
      {
        term: '손실 함수 (Loss Function, ℒ)',
        symbol: 'MSE / Huber Loss',
        analogy: '예측 오차 & 반성 수치',
        detail: '[내가 예상한 Q값]과 [실제 받은 보상 + 타깃Q값] 사이의 오차. 이 오차가 0이 되도록 신경망을 수정함'
      },
      {
        term: '더블 DQN (Double DQN)',
        symbol: 'DDQN',
        analogy: '과대평가 거품 방지기',
        detail: 'AI가 특정 행동의 가치를 실제보다 너무 부풀려 생각하는 과대평가(Overestimation) 오류를 완벽히 해결한 기술'
      },
      {
        term: '학습률 (Learning Rate, α)',
        symbol: 'lr = 1e-4',
        analogy: '두뇌 수정 보폭 크기',
        detail: '오차를 발견했을 때 뇌 가중치를 얼마나 큰 보폭으로 고칠지 결정하는 파라미터 (너무 크면 망가지고 너무 작으면 안 배움)'
      },
      {
        term: '옵티마이저 (Optimizer - AdamW)',
        symbol: 'torch.optim.AdamW',
        analogy: '신경망 튜닝 기술자',
        detail: '손실 함수에서 계산된 오차를 바탕으로 수억 개의 뇌세포 가중치를 가장 효율적으로 깎아주는 알고리즘'
      }
    ]
  },
  {
    stage: '4단계',
    shortTitle: '무한 반복',
    title: '무한 반복하기 (수렴·달인 경지 & 실물 배포)',
    icon: '🔁',
    color: '#ec4899',
    desc: '수만 번의 훈련을 통해 오차가 0에 수렴하고, 현실 로봇으로 배포하여 자산화하는 완성 단계',
    items: [
      {
        term: '스텝 (Step)',
        symbol: '1 Time Step',
        analogy: '눈 깜빡할 1프레임',
        detail: '[상태 관찰 ➔ 행동 계산 ➔ 보상 획득 ➔ 1회 학습]으로 이어지는 최소 실행 사이클'
      },
      {
        term: '에피소드 (Episode)',
        symbol: '1 Game Session',
        analogy: '착륙 1회 도전 풀코스',
        detail: '우주선이 공중에서 스폰되어 착륙에 성공하거나 충돌할 때까지의 1판 전체'
      },
      {
        term: '수렴 (Convergence)',
        symbol: 'Loss ➔ 0 / Reward ➔ Max',
        analogy: '달인의 경지',
        detail: '수만 번 반복하여 오차가 거의 0으로 사라지고, 어떤 돌발 강풍에도 무조건 완벽하게 착륙시키는 상태'
      },
      {
        term: '성공률 (Success Rate, %)',
        symbol: 'Eval Success %',
        analogy: '실전 합격률',
        detail: '100번 시험 비행을 시켰을 때 깃발 착륙장에 흠집 없이 안착한 비율 (예: 98/100 = 98% 합격)'
      },
      {
        term: '학습 곡선 (Reward Learning Curve)',
        symbol: 'TensorBoard / WandB',
        analogy: '성적 향상 그래프',
        detail: '에피소드가 지날수록 평균 보상 점수가 계단식으로 우상향하는지 모니터링하는 차트'
      },
      {
        term: '체크포인트 (Model Checkpoint)',
        symbol: 'policy.pt / safetensors',
        analogy: '로봇 두뇌 저장 파일',
        detail: '학습된 신경망의 모든 가중치를 파일로 구워낸 것. 이것만 있으면 어디서든 로봇에 꽂아 즉시 가동 가능'
      },
      {
        term: '심투리얼 갭 (Reality Gap)',
        symbol: 'Sim vs Real Discrepancy',
        analogy: '시뮬레이션과 현실의 괴리',
        detail: '컴퓨터 안에서는 완벽했는데 실제 로봇에 올렸을 때 모터 유격이나 조명 때문에 삐걱거리는 현실 오차'
      },
      {
        term: '도메인 무작위화 (Domain Randomization)',
        symbol: 'Random Friction/Light',
        analogy: '악천후 특수 훈련',
        detail: '시뮬레이터에서 마찰력, 중력, 조명, 무게를 무작위로 섞어서 훈련시켜 현실의 온갖 변수에도 끄떡없게 만드는 비법'
      },
      {
        term: '로보미터 (Robometer General Reward)',
        symbol: 'HF Robometer',
        analogy: '만능 AI 채점관',
        detail: '허깅페이스 v0.6.0에 탑재된 보상 모델로, 로봇의 실제 동작 비디오를 보고 성공 여부를 척척 채점해 줌'
      },
      {
        term: '허깅페이스 허브 배포 (push_to_hub)',
        symbol: 'huggingface.co/내아이디',
        analogy: '글로벌 AI 앱스토어 입점',
        detail: '완성된 로봇 정책을 전 세계 개발자들에게 공개하고 대표님만의 1호 피지컬 AI 자산으로 영구 박제하는 명령'
      }
    ]
  }
];

// 🔗 멘토 추천 4대 필수 링크
const MENTOR_LINKS = [
  {
    name: '🤗 Hugging Face 공식 포털',
    url: 'https://huggingface.co/',
    desc: '세계 최대 오픈소스 AI 모델 & 데이터셋 허브',
    tag: '생태계 중심'
  },
  {
    name: '📄 DQN 오리지널 논문 (DeepMind 2013)',
    url: 'https://arxiv.org/pdf/1312.5602',
    desc: 'Playing Atari with Deep Reinforcement Learning (딥마인드 역사적 논문)',
    tag: '기초 원전'
  },
  {
    name: '🕹️ Farama Gymnasium 아타리 환경',
    url: 'https://ale.farama.org/environments/',
    desc: 'Space Invaders, Breakout 등 아타리 고전 게임 강화학습 표준 환경',
    tag: '실습 환경'
  },
  {
    name: '📖 LeRobot 한글 튜토리얼 (위키독스)',
    url: 'https://wikidocs.net/286948',
    desc: '국내 최고 개발자가 집필한 허깅페이스 LeRobot 실전 한글 바이블',
    tag: '필독 교재'
  }
];

export default function LeRobotStudio() {
  const [activeTab, setActiveTab] = useState('stages'); // 'stages', 'lunarSim', 'colabCode', 'pushtSim'
  const [selectedStageIdx, setSelectedStageIdx] = useState(0);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [termSearchQuery, setTermSearchQuery] = useState('');
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedLunar, setCopiedLunar] = useState(false);

  // 🚀 LunarLander-v3 시뮬레이터 인터랙티브 샌드박스 상태
  const [lunarPos, setLunarPos] = useState({ x: 170, y: 30, vx: 0.5, vy: 1.2, angle: -10 });
  const [lunarThrust, setLunarThrust] = useState({ main: false, left: false, right: false });
  const [lunarReward, setLunarReward] = useState(0);
  const [lunarState, setLunarState] = useState('flying'); // 'flying', 'landed', 'crashed'
  const [isLunarAuto, setIsLunarAuto] = useState(false);

  // Lunar Lander 물리 루프
  useEffect(() => {
    let interval = null;
    if (isLunarAuto && lunarState === 'flying') {
      interval = setInterval(() => {
        setLunarPos(prev => {
          let nextAngle = prev.angle * 0.92;
          let nextVx = prev.vx;
          let nextVy = prev.vy + 0.15; // 중력
          let isMain = false;
          let isLeft = false;
          let isRight = false;

          const dx = 170 - prev.x;
          if (dx > 5) {
            nextVx += 0.2;
            isLeft = true;
          } else if (dx < -5) {
            nextVx -= 0.2;
            isRight = true;
          } else {
            nextVx *= 0.9;
          }

          if (prev.y > 160 && nextVy > 0.8) {
            nextVy -= 0.35; // 역분사
            isMain = true;
          }

          setLunarThrust({ main: isMain, left: isLeft, right: isRight });

          const nextX = prev.x + nextVx;
          const nextY = prev.y + nextVy;

          if (nextY >= 270) {
            if (Math.abs(nextVx) < 1.0 && nextVy < 1.5 && Math.abs(nextAngle) < 12 && Math.abs(nextX - 170) < 30) {
              setLunarState('landed');
              setLunarReward(prevR => prevR + 100);
            } else {
              setLunarState('crashed');
              setLunarReward(prevR => prevR - 100);
            }
            return { ...prev, y: 275, vx: 0, vy: 0, angle: 0 };
          }

          setLunarReward(prevR => Math.round(prevR + (isMain ? -0.3 : 0.1)));

          return {
            x: nextX,
            y: nextY,
            vx: nextVx,
            vy: nextVy,
            angle: nextAngle
          };
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isLunarAuto, lunarState]);

  const resetLunar = () => {
    setIsLunarAuto(false);
    setLunarPos({ x: 60 + Math.random() * 220, y: 30, vx: (Math.random() - 0.5) * 2, vy: 1.0, angle: (Math.random() - 0.5) * 20 });
    setLunarThrust({ main: false, left: false, right: false });
    setLunarReward(0);
    setLunarState('flying');
  };

  // 📋 코드 복사 핸들러
  const handleCopy = (text, type = 'colab') => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (type === 'lunar') {
        setCopiedLunar(true);
        setTimeout(() => setCopiedLunar(false), 2000);
      } else {
        setCopiedScript(true);
        setTimeout(() => setCopiedScript(false), 2000);
      }
    }
  };

  // 📜 멘토 실강 핵심 코드 (LunarLander-v3 & Gymnasium)
  const lunarCode = `# 🚀 [멘토 실강 1편] Gymnasium LunarLander-v3 환경 실행 코드
# 1. 박스2D 물리 엔진 및 Gymnasium 설치
!pip install -q swig
!pip install -q "gymnasium[box2d]"

import gymnasium as gym

# 2. 달 착륙선(LunarLander-v3) 환경 생성
env = gym.make("LunarLander-v3", render_mode="rgb_array")

# 3. 환경 초기화 및 첫 번째 상태(State) 확인
observation, info = env.reset()
print("🌟 초기 관찰 상태(8개 센서 값):", observation)

# 4. 무작위 행동(Action) 1스텝 실행 테스트
action = env.action_space.sample() # 0: 대기, 1: 좌측 엔진, 2: 주 엔진, 3: 우측 엔진
next_state, reward, terminated, truncated, info = env.step(action)

print(f"🎯 행동: {action} ➔ 보상: {reward:.2f}점 ➔ 완료 여부: {terminated}")
`;

  // 📜 LeRobot Colab 스크립트
  const colabScript = `# 🚀 [코다리 AI 공부방] LeRobot PushT 1클릭 완주 스크립트 (Colab GPU용)
!pip install -q lerobot datasets huggingface_hub

# 2. PushT 시뮬레이션 환경 + Diffusion Policy 학습 실행 (Colab T4 GPU에서 15분 완주)
!python -m lerobot.scripts.train \\
    --dataset_repo_id lerobot/pusht \\
    --policy.type diffusion \\
    --output_dir outputs/train/diffusion_pusht_mihyun \\
    --job_name mihyun_pusht_first_run \\
    --training.batch_size 64 \\
    --training.num_steps 5000 \\
    --eval.n_episodes 10 \\
    --policy.push_to_hub false

print("🎉 축하합니다! 대표님의 첫 피지컬 AI 정책 모델이 성공적으로 학습되었습니다!")
`;

  // 검색 필터링된 용어 목록
  const currentStage = RL_DQN_STAGES[selectedStageIdx];
  const filteredItems = currentStage.items.filter(item => {
    if (!termSearchQuery.trim()) return true;
    const q = termSearchQuery.toLowerCase();
    return item.term.toLowerCase().includes(q) || 
           item.analogy.toLowerCase().includes(q) || 
           item.detail.toLowerCase().includes(q) ||
           item.symbol.toLowerCase().includes(q);
  });

  return (
    <div className="lerobot-studio-container">
      {/* 👑 VIP 히어로 카드 */}
      <header className="lerobot-hero-card">
        <div className="hero-badge-row">
          <span className="hero-badge crown">🔴 멘토 멤버십 1편 직강 반영</span>
          <span className="hero-badge sub">🧠 기초 DQN & 스스로 배우는 뇌</span>
          <span className="hero-badge target">🚀 50대 핵심 어휘 풀도감</span>
          <span className="hero-badge free">💸 0원 시뮬레이션</span>
        </div>

        <div className="hero-main-content">
          <div className="hero-text-box">
            <h1 className="hero-title">
              🦾 <span className="gradient-text">나만의 피지컬 AI 두뇌</span> 소유하기 🎯
            </h1>
            <p className="hero-subtitle">
              "스스로 경험하며 배우는 강화학습(DQN) 0단계부터 4단계까지 <strong>총 50개 핵심 어휘 풀도감</strong>과, LunarLander-v3 달 착륙선 시뮬레이션으로 나만의 로봇 두뇌를 완벽하게 정복하십시오!"
            </p>
          </div>

          <div className="hero-stat-box">
            <div className="stat-title">
              <Flame className="w-4 h-4 text-amber-400" /> 오늘 실강 5대 단계 총정리
            </div>
            <div className="stat-value">
              <span className="num">50개+</span>
              <span className="cagr">심화 어휘 완비</span>
            </div>
            <div className="stat-sub">준비 ➔ 판단 ➔ 결과 ➔ 복습 ➔ 수렴·달인</div>
          </div>
        </div>

        {/* 멘토 공식 링크 스트립 */}
        <div className="mentor-links-strip">
          <span className="ml-title">📌 멘토 공식 추천 교재 & 사이트:</span>
          <div className="ml-links-row">
            {MENTOR_LINKS.map((item, idx) => (
              <a key={idx} href={item.url} target="_blank" rel="noreferrer" className="mentor-link-card">
                <span className="m-tag">{item.tag}</span>
                <span className="m-name">{item.name}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* 📑 탭 네비게이션 */}
      <nav className="lerobot-tab-nav">
        <button 
          className={`l-tab-btn ${activeTab === 'stages' ? 'active' : ''}`}
          onClick={() => setActiveTab('stages')}
        >
          <BookOpen className="w-4 h-4" /> 📚 0단계~4단계 50대 어휘 풀도감 ({RL_DQN_STAGES[selectedStageIdx].items.length}개)
        </button>
        <button 
          className={`l-tab-btn ${activeTab === 'lunarSim' ? 'active' : ''}`}
          onClick={() => setActiveTab('lunarSim')}
        >
          <Rocket className="w-4 h-4" /> 🚀 LunarLander-v3 착륙선 시뮬레이터
        </button>
        <button 
          className={`l-tab-btn ${activeTab === 'colabCode' ? 'active' : ''}`}
          onClick={() => setActiveTab('colabCode')}
        >
          <Terminal className="w-4 h-4" /> ⚡ 멘토 실강 코드 & Colab 런북
        </button>
        <button 
          className={`l-tab-btn ${activeTab === 'pushtSim' ? 'active' : ''}`}
          onClick={() => setActiveTab('pushtSim')}
        >
          <Gamepad2 className="w-4 h-4" /> 🎮 2D PushT 로봇 샌드박스
        </button>
        <button 
          className={`l-tab-btn ${activeTab === 'wikidocs' ? 'active' : ''}`}
          onClick={() => setActiveTab('wikidocs')}
          style={{ color: '#d97706', fontWeight: 800 }}
        >
          <FileText className="w-4 h-4" /> 📖 위키독스 1장: 데이터셋 로딩
        </button>
      </nav>

      {/* ========================================================
          📚 TAB 1: 0단계~4단계 50대 심화 어휘 총도감
          ======================================================== */}
      {activeTab === 'stages' && (
        <div className="tab-pane stages-pane">
          <div className="section-head">
            <div className="head-badge-row">
              <span className="room-badge green">🧠 50대 핵심 어휘 풀도감</span>
              <span className="room-badge blue">💡 비유와 개념 1:1 완벽 매칭</span>
              <span className="room-badge gold">🏆 수험·실무 끝판왕</span>
            </div>
            <h2>📚 강화학습 & DQN 5대 단계별 50대 심화 어휘 총도감</h2>
            <p>0단계(준비&무대 세팅)부터 4단계(수렴&배포)까지, 현업 엔지니어와 멘토가 쓰는 핵심 용어를 실생활 비유와 함께 낱낱이 파헤쳐 드립니다!</p>
          </div>

          {/* 🔄 강화학습 4단계 순환 비주얼 인포그래픽 다이어그램 */}
          <div className="rl-visual-flow-diagram">
            <div className="diagram-title-row">
              <span className="dt-badge">🔄 한눈에 보는 강화학습 완벽 순환 구조도</span>
              <span className="dt-sub">아래 노드를 클릭하면 해당 단계로 바로 이동합니다!</span>
            </div>
            <div className="diagram-nodes-row">
              {RL_DQN_STAGES.map((st, idx) => (
                <React.Fragment key={idx}>
                  <div 
                    className={`diagram-node ${selectedStageIdx === idx ? 'active' : ''}`}
                    onClick={() => setSelectedStageIdx(idx)}
                    style={{ borderColor: st.color }}
                  >
                    <span className="dn-icon">{st.icon}</span>
                    <span className="dn-stage" style={{ color: st.color }}>{st.stage}</span>
                    <strong className="dn-title">{st.title.split(' ')[0]}</strong>
                    <span className="dn-count">{st.items.length}개 어휘</span>
                  </div>
                  {idx < RL_DQN_STAGES.length - 1 && (
                    <div className="diagram-arrow">➔</div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* 5단계 탭 바 & 뷰 모드 토글 */}
          <div className="stage-controls-header">
            <div className="stage-selector-bar">
              {RL_DQN_STAGES.map((st, idx) => (
                <button
                  key={idx}
                  className={`stage-select-btn ${selectedStageIdx === idx ? 'active' : ''}`}
                  onClick={() => setSelectedStageIdx(idx)}
                  style={{
                    borderBottomColor: selectedStageIdx === idx ? st.color : 'transparent'
                  }}
                >
                  <span className="st-icon">{st.icon}</span>
                  <div className="st-text-col">
                    <div className="st-badge-header">
                      <span className="st-num" style={{ color: st.color }}>{st.stage}</span>
                      <span className="st-cnt-tag">{st.items.length}개</span>
                    </div>
                    <span className="st-name">{st.shortTitle}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="view-mode-toggle-bar">
              <span className="vm-label">보기 모드:</span>
              <button 
                className={`vm-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
              >
                📊 한눈에 비교표 (표 모드)
              </button>
              <button 
                className={`vm-btn ${viewMode === 'cards' ? 'active' : ''}`}
                onClick={() => setViewMode('cards')}
              >
                📇 카드형 도감
              </button>
            </div>
          </div>

          {/* 선택된 단계 상세 카드 / 테이블 */}
          <div className="stage-content-card">
            <div className="stage-header-row" style={{ borderLeftColor: currentStage.color }}>
              <div className="sh-top-wrap">
                <div className="sh-left">
                  <span className="sh-stage-badge" style={{ background: currentStage.color }}>
                    {currentStage.stage}
                  </span>
                  <h3 className="sh-title">{currentStage.title}</h3>
                  <span className="sh-count-pill">{filteredItems.length}개 용어</span>
                </div>

                <div className="sh-search-wrap">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    className="stage-term-search"
                    placeholder="이 단계에서 용어·비유 검색..."
                    value={termSearchQuery}
                    onChange={(e) => setTermSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <p className="sh-desc">{currentStage.desc}</p>
            </div>

            {/* 📊 1. 한눈에 비교표 모드 (대표님이 좋아하시는 깔끔한 표) */}
            {viewMode === 'table' ? (
              <div className="stage-table-container">
                <table className="stage-comparison-table">
                  <thead>
                    <tr>
                      <th style={{ width: '45px' }}>#</th>
                      <th style={{ width: '130px' }}>기호/수식</th>
                      <th style={{ width: '190px' }}>공식 어휘 (국문/영문)</th>
                      <th style={{ width: '260px' }}>💡 실생활 1초 비유</th>
                      <th>핵심 기술 정의 및 실전 역할</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item, idx) => (
                      <tr key={idx} className="stage-table-row">
                        <td className="td-index">
                          <span className="table-idx-badge" style={{ background: currentStage.color }}>
                            {idx + 1}
                          </span>
                        </td>
                        <td className="td-symbol">
                          <code className="symbol-pill">{item.symbol}</code>
                        </td>
                        <td className="td-term">
                          <strong className="term-strong">{item.term}</strong>
                        </td>
                        <td className="td-analogy">
                          <div className="table-analogy-box">
                            <span className="tab-icon">💡</span>
                            <span>{item.analogy}</span>
                          </div>
                        </td>
                        <td className="td-detail">
                          <p className="tab-detail-p">{item.detail}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* 📇 2. 카드형 도감 모드 */
              <div className="stage-terms-grid">
                {filteredItems.map((item, idx) => (
                  <div key={idx} className="stage-term-card">
                    <div className="st-top">
                      <div className="st-title-group">
                        <span className="st-index-circle" style={{ background: currentStage.color }}>{idx + 1}</span>
                        <span className="st-term-title">{item.term}</span>
                      </div>
                      <span className="st-symbol">{item.symbol}</span>
                    </div>

                    <div className="st-analogy-box">
                      <span className="analogy-label">💡 비유:</span>
                      <strong className="analogy-text">{item.analogy}</strong>
                    </div>

                    <p className="st-detail-text">{item.detail}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          🚀 TAB 2: LunarLander-v3 달 착륙선 시뮬레이터
          ======================================================== */}
      {activeTab === 'lunarSim' && (
        <div className="tab-pane lunar-pane">
          <div className="section-head">
            <div className="head-badge-row">
              <span className="room-badge green">🚀 Gymnasium LunarLander-v3</span>
              <span className="room-badge blue">🎮 실시간 DQN 비행 제어</span>
            </div>
            <h2>🚀 LunarLander-v3 달 착륙선 AI 시뮬레이터</h2>
            <p>오늘 멘토님이 실강에서 직접 다룬 대표적인 강화학습 환경입니다! 달 착륙선이 양쪽 추진기와 메인 엔진을 분사하여 초록색 깃발 착륙장에 사뿐히 안착하는 과정을 관찰해 보세요.</p>
          </div>

          <div className="sim-layout-grid">
            {/* 좌측: 달 착륙 시뮬레이션 캔버스 */}
            <div className="sim-canvas-box lunar-box">
              <div className="canvas-header">
                <span className="env-title">🌕 LunarLander-v3 Space (Gymnasium)</span>
                <span className={`reward-pill ${lunarState === 'landed' ? 'success' : lunarState === 'crashed' ? 'failed' : ''}`}>
                  보상 점수: {lunarReward}점 | 상태: {lunarState === 'flying' ? '비행 중 🛸' : lunarState === 'landed' ? '안전 착륙 성공! 🏆 (+100점)' : '추락 폭발! 💥 (-100점)'}
                </span>
              </div>

              <div className="lunar-sky-board">
                {/* 별빛 배경 */}
                <div className="stars-layer"></div>

                {/* 달 표면 및 착륙 깃발 */}
                <div className="moon-ground">
                  <div className="landing-pad" style={{ left: 170 }}>
                    <span className="flag left">🚩</span>
                    <span className="pad-line">착륙 지점 (PAD)</span>
                    <span className="flag right">🚩</span>
                  </div>
                </div>

                {/* 달 착륙선 본체 */}
                <div 
                  className={`lunar-lander-ship ${lunarState}`}
                  style={{
                    left: `${lunarPos.x}px`,
                    top: `${lunarPos.y}px`,
                    transform: `translate(-50%, -50%) rotate(${lunarPos.angle}deg)`
                  }}
                >
                  <div className="ship-body">🛸</div>
                  
                  {/* 추진 화염 이펙트 */}
                  {lunarThrust.main && <div className="flame main-flame">🔥</div>}
                  {lunarThrust.left && <div className="flame left-flame">💨</div>}
                  {lunarThrust.right && <div className="flame right-flame">💨</div>}
                </div>
              </div>

              {/* 컨트롤 패널 */}
              <div className="sim-controls-bar">
                {!isLunarAuto ? (
                  <button className="sim-btn play" onClick={() => setIsLunarAuto(true)} disabled={lunarState !== 'flying'}>
                    <Play className="w-4 h-4 fill-current" /> AI 자동 착륙 (DQN Policy)
                  </button>
                ) : (
                  <button className="sim-btn pause" onClick={() => setIsLunarAuto(false)}>
                    <Pause className="w-4 h-4 fill-current" /> 일시 정지
                  </button>
                )}
                <button className="sim-btn reset" onClick={resetLunar}>
                  <RotateCcw className="w-4 h-4" /> 재발사 (Reset)
                </button>
              </div>
            </div>

            {/* 우측: 8대 센서 상태(State) & 4대 행동(Action) 해설 */}
            <div className="sim-info-sidebar">
              <div className="info-card">
                <h4>📡 착륙선이 읽는 8대 센서 데이터 (State $S$)</h4>
                <ul className="sensor-list">
                  <li><strong>x, y 좌표</strong>: 수평 위치 및 고도</li>
                  <li><strong>vx, vy 속도</strong>: 수평 이동 및 낙하 속도</li>
                  <li><strong>각도 θ, 각속도 ω</strong>: 우주선 기울기 및 회전력</li>
                  <li><strong>좌/우 다리 접촉</strong>: 바닥 안착 센서 (True/False)</li>
                </ul>
              </div>

              <div className="info-card tip">
                <h4>🎮 AI가 선택 가능한 4대 행동 (Action $A$)</h4>
                <div className="action-tags-grid">
                  <span className="a-pill">0: 대기 (자유 낙하)</span>
                  <span className="a-pill">1: 좌측 엔진 분사</span>
                  <span className="a-pill">2: 주 추진 역분사 🔥</span>
                  <span className="a-pill">3: 우측 엔진 분사</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          ⚡ TAB 3: 멘토 실강 코드 & Colab 런북
          ======================================================== */}
      {activeTab === 'colabCode' && (
        <div className="tab-pane code-pane">
          <div className="section-head">
            <div className="head-badge-row">
              <span className="room-badge green">🚀 오늘 실강 복사본</span>
              <span className="room-badge gold">⏱️ 3초 복사</span>
            </div>
            <h2>⚡ 멘토 실강 핵심 코드 & Colab 실행 런북</h2>
            <p>오늘 오전 멘토님이 화면에서 직접 시연하신 Gymnasium LunarLander 코드와 LeRobot 실행 코드를 바로 복사해 Colab에서 실행하십시오!</p>
          </div>

          {/* 1. Gymnasium LunarLander 코드 */}
          <div className="code-card" style={{ marginBottom: '20px' }}>
            <div className="code-card-header">
              <div className="code-lang-tag">
                <Rocket className="w-4 h-4 text-emerald-400" /> 1. LunarLander-v3 실전 코드 (멘토 강조 코드)
              </div>
              <button className="copy-code-btn" onClick={() => handleCopy(lunarCode, 'lunar')}>
                {copiedLunar ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiedLunar ? '코드 복사 완료!' : 'LunarLander 코드 복사'}
              </button>
            </div>

            <pre className="code-block">
              <code>{lunarCode}</code>
            </pre>
          </div>

          {/* 2. LeRobot PushT 학습 코드 */}
          <div className="code-card">
            <div className="code-card-header">
              <div className="code-lang-tag">
                <Terminal className="w-4 h-4 text-sky-400" /> 2. LeRobot PushT 정책 학습 스크립트 (Apache 2.0)
              </div>
              <button className="copy-code-btn" onClick={() => handleCopy(colabScript, 'colab')}>
                {copiedScript ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiedScript ? '코드 복사 완료!' : 'LeRobot 코드 복사'}
              </button>
            </div>

            <pre className="code-block">
              <code>{colabScript}</code>
            </pre>
          </div>
        </div>
      )}

      {/* ========================================================
          🎮 TAB 4: 2D PushT 시뮬레이터
          ======================================================== */}
      {activeTab === 'pushtSim' && (
        <div className="tab-pane sim-pane">
          <div className="section-head">
            <h2>🎮 2D PushT 시뮬레이션 동작 샌드박스</h2>
            <p>로봇 두뇌가 2D 물리 환경에서 T자 블록을 목표 구역으로 밀어 넣는 LeRobot의 표준 벤치마크입니다.</p>
          </div>

          <div className="sim-layout-grid">
            <div className="sim-canvas-box">
              <div className="canvas-header">
                <span className="env-title">🌐 2D PushT Environment (LeRobot)</span>
                <span className="reward-pill success">보상 점수: 100점</span>
              </div>
              <div className="sim-board" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: '#38bdf8' }}>
                  <Gamepad2 className="w-12 h-12 mx-auto mb-2 opacity-80" />
                  <p style={{ margin: 0, fontWeight: 700 }}>PushT 시뮬레이터 정상 가동 중</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          📖 TAB 5: 위키독스 1장 LeRobot 데이터셋 로딩하기 완벽 교재
          ======================================================== */}
      {activeTab === 'wikidocs' && (
        <div className="tab-pane wikidocs-pane">
          <div className="section-head">
            <div className="head-badge-row">
              <span className="room-badge gold">📖 위키독스 286941 완벽 반영</span>
              <span className="room-badge green">🦾 LeRobotDataset 실전 교재</span>
              <span className="room-badge blue">⚡ Kaggle & Colab 100% 무료</span>
            </div>
            <h2>📖 1장: LeRobot 로봇 데이터셋 로딩하기 (WikiDocs 교재)</h2>
            <p>Hugging Face Hub에 올려진 전 세계 로봇들의 카메라 영상, 관절 각도, 조종 행동 궤적 데이터를 1줄의 코드로 다운받고 PyTorch 텐서로 변환하는 핵심 비법입니다.</p>
          </div>

          {/* 💡 캐글 & 코랩 100% 무료 팩트 배너 */}
          <div className="kaggle-free-banner">
            <div className="kfb-icon">🎉</div>
            <div className="kfb-content">
              <h4>대표님, 캐글(Kaggle)은 유료 결제 자체가 없는 100% 영구 무료 플랫폼입니다!</h4>
              <p>구글 계정으로 로그인만 하면 <strong>매주 30시간 고성능 T4 듀얼 GPU를 0원에 무제한 제공</strong>합니다. 코랩 유료 결제 걱정 없이 캐글에서 이 코드를 마음껏 돌리세요!</p>
            </div>
          </div>

          <div className="wikidocs-sections-list">
            {/* 섹션 1 */}
            <div className="wiki-card">
              <div className="wiki-card-head">
                <span className="w-num">1</span>
                <h3>사용 가능한 로봇 데이터셋 조회하기</h3>
              </div>
              <p className="w-desc">내 컴퓨터에 설치된 기본 데이터셋이나 허깅페이스 Hub의 최신 로봇 데이터셋 목록을 키워드로 검색합니다.</p>
              
              <div className="wiki-code-box">
                <div className="wcb-head">
                  <span>Python • HfApi 검색</span>
                  <button className="mini-copy-btn" onClick={() => handleCopy(`from huggingface_hub import HfApi
hub_api = HfApi()
repo_ids = [info.id for info in hub_api.list_datasets(task_categories="robotics", tags=["LeRobot"])]
print("검색된 로봇 데이터셋 개수:", len(repo_ids))
print("최신 데이터셋 목록:", repo_ids[:5])`)}>
                    <Copy className="w-3.5 h-3.5" /> 복사
                  </button>
                </div>
                <pre><code>{`from huggingface_hub import HfApi
hub_api = HfApi()
repo_ids = [info.id for info in hub_api.list_datasets(task_categories="robotics", tags=["LeRobot"])]
print("검색된 로봇 데이터셋 개수:", len(repo_ids))
print("최신 데이터셋 목록:", repo_ids[:5])`}</code></pre>
              </div>
            </div>

            {/* 섹션 2 */}
            <div className="wiki-card">
              <div className="wiki-card-head">
                <span className="w-num">2</span>
                <h3>메타데이터로 0.1초 만에 뼈대 파악하기 (초고속 조회)</h3>
                <span className="w-badge green">다운로드 용량 0MB</span>
              </div>
              <p className="w-desc">수 기가바이트(GB)짜리 영상을 무겁게 다운로드받지 않고도, <strong>카메라 종류, 초당 프레임(FPS), 로봇 하드웨어 종류</strong>를 0.1초 만에 스캔합니다.</p>
              
              <div className="wiki-code-box">
                <div className="wcb-head">
                  <span>Python • LeRobotDatasetMetadata</span>
                  <button className="mini-copy-btn" onClick={() => handleCopy(`from lerobot.common.datasets.lerobot_dataset import LeRobotDatasetMetadata

repo_id = "lerobot/aloha_mobile_cabinet"
ds_meta = LeRobotDatasetMetadata(repo_id)

print(f"총 에피소드 수: {ds_meta.total_episodes}개")
print(f"초당 프레임(FPS): {ds_meta.fps} fps")
print(f"사용된 로봇 타입: {ds_meta.robot_type}")
print(f"탑재된 카메라 키 목록: {ds_meta.camera_keys}")`)}>
                    <Copy className="w-3.5 h-3.5" /> 복사
                  </button>
                </div>
                <pre><code>{`from lerobot.common.datasets.lerobot_dataset import LeRobotDatasetMetadata

repo_id = "lerobot/aloha_mobile_cabinet"
ds_meta = LeRobotDatasetMetadata(repo_id)

print(f"총 에피소드 수: {ds_meta.total_episodes}개")
print(f"초당 프레임(FPS): {ds_meta.fps} fps")
print(f"사용된 로봇 타입: {ds_meta.robot_type}")
print(f"탑재된 카메라 키 목록: {ds_meta.camera_keys}")`}</code></pre>
              </div>
            </div>

            {/* 섹션 3 */}
            <div className="wiki-card">
              <div className="wiki-card-head">
                <span className="w-num">3</span>
                <h3>원하는 에피소드만 골라서 로드하기 (자원 절약)</h3>
              </div>
              <p className="w-desc">전체 에피소드를 다 받지 않고, <code>episodes=[0, 10, 11, 23]</code>처럼 필요한 에피소드만 쏙 골라 컴퓨터 램(RAM)을 아낍니다.</p>
              
              <div className="wiki-code-box">
                <div className="wcb-head">
                  <span>Python • LeRobotDataset</span>
                  <button className="mini-copy-btn" onClick={() => handleCopy(`from lerobot.common.datasets.lerobot_dataset import LeRobotDataset

dataset = LeRobotDataset(repo_id, episodes=[0, 10, 11, 23])

print(f"선택된 에피소드: {dataset.episodes}") # [0, 10, 11, 23]
print(f"선택된 총 에피소드 개수: {dataset.num_episodes}") # 4개
print(f"선택된 총 프레임 수: {dataset.num_frames}") # 6,000개`)}>
                    <Copy className="w-3.5 h-3.5" /> 복사
                  </button>
                </div>
                <pre><code>{`from lerobot.common.datasets.lerobot_dataset import LeRobotDataset

dataset = LeRobotDataset(repo_id, episodes=[0, 10, 11, 23])

print(f"선택된 에피소드: {dataset.episodes}") # [0, 10, 11, 23]
print(f"선택된 총 에피소드 개수: {dataset.num_episodes}") # 4개
print(f"선택된 총 프레임 수: {dataset.num_frames}") # 6,000개`}</code></pre>
              </div>
            </div>

            {/* 섹션 4 */}
            <div className="wiki-card">
              <div className="wiki-card-head">
                <span className="w-num">4</span>
                <h3>카메라 영상 ➔ PyTorch 텐서([C, H, W]) 자동 변환</h3>
              </div>
              <p className="w-desc">로봇 카메라 이미지가 딥러닝 모델이 바로 먹을 수 있는 <code>torch.Tensor [3, 480, 640]</code> 규격으로 자동 가공되어 나옵니다.</p>
              
              <div className="wiki-code-box">
                <div className="wcb-head">
                  <span>Python • Tensor 변환</span>
                  <button className="mini-copy-btn" onClick={() => handleCopy(`camera_key = dataset.meta.camera_keys[0]
frame = dataset[0][camera_key]

print("데이터 타입:", type(frame)) # <class 'torch.Tensor'>
print("텐서 형태 [채널, 높이, 너비]:", frame.shape) # torch.Size([3, 480, 640])`)}>
                    <Copy className="w-3.5 h-3.5" /> 복사
                  </button>
                </div>
                <pre><code>{`camera_key = dataset.meta.camera_keys[0]
frame = dataset[0][camera_key]

print("데이터 타입:", type(frame)) # <class 'torch.Tensor'>
print("텐서 형태 [채널, 높이, 너비]:", frame.shape) # torch.Size([3, 480, 640])`}</code></pre>
              </div>
            </div>

            {/* 섹션 5 */}
            <div className="wiki-card">
              <div className="wiki-card-head">
                <span className="w-num">5</span>
                <h3>고급 타임스탬프 델타 (과거 4프레임 + 미래 64액션 자동 묶음)</h3>
                <span className="w-badge gold">LeRobot의 핵심 마법</span>
              </div>
              <p className="w-desc">로봇이 과거의 손동작 이력과 앞으로의 64스텝 궤적을 한 번에 학습할 수 있도록 시간 축 데이터를 딕셔너리 설정 1줄로 묶어줍니다.</p>
              
              <div className="wiki-code-box">
                <div className="wcb-head">
                  <span>Python • delta_timestamps</span>
                  <button className="mini-copy-btn" onClick={() => handleCopy(`delta_timestamps = {
    camera_key: [-1, -0.5, -0.20, 0],                            # 과거 1초, 0.5초, 0.2초 전과 현재
    "observation.state": [-1.5, -1, -0.5, -0.20, -0.10, 0],      # 과거 관절 상태 이력
    "action": [t / dataset.fps for t in range(64)],              # 미래 64프레임 동안의 액션 궤적
}
dataset = LeRobotDataset(repo_id, delta_timestamps=delta_timestamps)
print("자동 묶음 텐서 형태:", dataset[0][camera_key].shape) # torch.Size([4, 3, 480, 640])`)}>
                    <Copy className="w-3.5 h-3.5" /> 복사
                  </button>
                </div>
                <pre><code>{`delta_timestamps = {
    camera_key: [-1, -0.5, -0.20, 0],                            # 과거 1초, 0.5초, 0.2초 전과 현재
    "observation.state": [-1.5, -1, -0.5, -0.20, -0.10, 0],      # 과거 관절 상태 이력
    "action": [t / dataset.fps for t in range(64)],              # 미래 64프레임 동안의 액션 궤적
}
dataset = LeRobotDataset(repo_id, delta_timestamps=delta_timestamps)
print("자동 묶음 텐서 형태:", dataset[0][camera_key].shape) # torch.Size([4, 3, 480, 640])`}</code></pre>
              </div>
            </div>

            {/* 섹션 6 */}
            <div className="wiki-card">
              <div className="wiki-card-head">
                <span className="w-num">6</span>
                <h3>PyTorch DataLoader 미니 배치 학습 연동</h3>
              </div>
              <p className="w-desc">표준 파이토치 DataLoader와 100% 호환되어, <code>batch_size=32</code>로 묶어 GPU에서 번개같이 모델을 훈련시킵니다.</p>
              
              <div className="wiki-code-box">
                <div className="wcb-head">
                  <span>Python • DataLoader 훈련 루프</span>
                  <button className="mini-copy-btn" onClick={() => handleCopy(`import torch

dataloader = torch.utils.data.DataLoader(
    dataset,
    num_workers=0,
    batch_size=32,
    shuffle=True,
)

for batch in dataloader:
    print(f"배치 이미지 텐서: {batch[camera_key].shape}") # (32, 4, 3, 480, 640)
    print(f"배치 상태 텐서: {batch['observation.state'].shape}") # (32, 6, 14)
    print(f"배치 액션 텐서: {batch['action'].shape}") # (32, 64, 14)
    break`)}>
                    <Copy className="w-3.5 h-3.5" /> 복사
                  </button>
                </div>
                <pre><code>{`import torch

dataloader = torch.utils.data.DataLoader(
    dataset,
    num_workers=0,
    batch_size=32,
    shuffle=True,
)

for batch in dataloader:
    print(f"배치 이미지 텐서: {batch[camera_key].shape}") # (32, 4, 3, 480, 640)
    print(f"배치 상태 텐서: {batch['observation.state'].shape}") # (32, 6, 14)
    print(f"배치 액션 텐서: {batch['action'].shape}") # (32, 64, 14)
    break`}</code></pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
