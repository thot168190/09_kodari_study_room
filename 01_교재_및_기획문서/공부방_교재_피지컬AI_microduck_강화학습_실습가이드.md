# 🤖 [공부방 마스터 교재] 8월 31일 피지컬 AI(Physical AI) & Sim2Real 강화학습 완전정복

> **강의명**: 피지컬 AI와 강화학습, 가장 빠르게 내 손으로 직접 돌려보는 멤버십 밀착 실습  
> **핵심 기술**: 가상 물리엔진(MuJoCo) ➔ 두뇌 훈련(PPO/ONNX) ➔ 실제 로봇(Sim2Real) 이식  
> **공식 저장소**: [pollen-robotics/microduck_rl](https://github.com/pollen-robotics/microduck_rl) & [pollen-robotics/microduck](https://github.com/pollen-robotics/microduck)

---

## 📌 1. 피지컬 AI & Sim2Real 핵심 원리 3줄 요약

1. **Microduck 로봇**: 약 800g 무게, 25cm 키의 14개 서보 모터를 가진 소형 이족보행(Bipedal) 로봇.
2. **Sim2Real의 핵심 (BAM 액추에이터 & 백래시)**: 가상과 현실의 오차를 줄이기 위해 모터의 전압 강하, 기어 유격(±1° 백래시), 마찰력을 물리엔진에 완벽하게 모델링.
3. **61차원 공통 관측 규격(Observation Contract)**: 보행, 기립, 낙법 복원, 앞구르기, 공차기 정책이 동일한 입력 규격을 공유하여 **실행 중 실시간 정책 스위칭(Hot-swap)** 가능!

---

## 🎯 2. Microduck 강화학습 태스크(Task) 전체 카탈로그

| 태스크 ID | 지형 | 동작 설명 (Description) |
| :--- | :---: | :--- |
| `Mjlab-Velocity-{Flat,Rough}-MicroDuck` | 평지/험지 | **메인 태스크**: 속도 명령 및 머리 자세 추종 보행 |
| `Mjlab-VelStand-{Flat,Rough}-MicroDuck` | 평지/험지 | 보행 + 넘어짐 복원(낙법) 통합 정책 |
| `Mjlab-StandUp-{Flat,Rough}-MicroDuck` | 평지/험지 | 엎드림/누움/앉음 상태에서 기립 후 균형 유지 |
| `Mjlab-SitStand-{Flat,Rough}-MicroDuck` | 평지/험지 | 부드러운 앉기 ↔ 서기 전환 및 머리 제어 |
| `Mjlab-GroundPick-{Flat,Rough}-MicroDuck` | 평지/험지 | 몸을 숙여 부리로 바닥을 찍고 다시 일어서기 |
| `Mjlab-BallKick-Flat-MicroDuck` | 평지 | 70mm / 15g 공을 전방으로 킥 |
| `Mjlab-Roulade-Flat-MicroDuck` | 평지 | 머리를 바닥에 대고 전방 360도 회전 후 발로 착지 |
| `Mjlab-Velocity-Flat-MicroDuck-Rollers` | 평지 | 롤러스케이트 보행 및 주행 (발바닥 수동 바퀴) |
| `Mjlab-Velocity-Swizzle-MicroDuck` | 평지 | 좌우 대칭 스위즐 스케이팅 |
| `Mjlab-RollerCrouch-Flat-MicroDuck` | 평지 | 롤러 주행 중 웅크리기 |
| `Mjlab-RollerSlope-Flat-MicroDuck` | 경사로 | 경사로 롤러 활주 |
| `Mjlab-RollerStandUp-Flat-MicroDuck` | 평지 | 바닥에서 롤러 바퀴로 기립 |
| `Mjlab-Spin-Flat-MicroDuck` | 평지 | 롤러 위에서 제자리 고속 회전 |

---

## 💻 3. [실습 2] 로컬 시뮬레이터 구동 명령어 (Mac / PC 공통)

> **💡 현재 세팅 상태**: `09_코다리_공부방` 폴더에 이미 저장소 복제 및 `duckenv` 가상환경 설치가 100% 완료되어 있습니다!

```bash
# 3D 시뮬레이터 구동 (알파 신형 정책 6종 로드)
cd microduck_rl
../duckenv/bin/mjpython scripts/infer_policy.py \
  --walking ../microduck/policies/alpha_walking.onnx \
  --standing ../microduck/policies/alpha_stand.onnx \
  --sitstand ../microduck/policies/alpha_sitstand.onnx \
  --ground-pick ../microduck/policies/alpha_ground_pick.onnx \
  --roulade ../microduck/policies/roulade.onnx \
  --kick-left ../microduck/policies/ball_kick_left.onnx \
  --new-cmd-obs
```

---

## 🕹️ 4. 조종 키 매핑 가이드 (터미널/뷰어 포커스 상태)

| 키(Key) | 동작(Action) | 상세 설명 |
| :---: | :--- | :--- |
| **`↑ ↓ ← →` (방향키)** | **걷기 / 사이드스텝** | 전진, 후진, 좌우 게걸음 보행 |
| **`SPACE` (스페이스바)** | **제자리 멈춤** | 균형 유지하며 정지 |
| **`P`** | **🔥 오리 강제로 밀치기** | 외력 충격을 주어 넘어짐 복원(낙법) 테스트 |
| **`R`** | **앞구르기 (Roulade)** | 머리를 바닥에 대고 360도 롤링 후 착지 |
| **`G`** | **바닥 줍기 (Ground Pick)** | 몸을 숙여 부리로 바닥을 찍고 기립 |
| **`K`** | **공차기 (Ball Kick)** | 왼발로 공을 전방으로 킥 |
| **`Y`** | **앉기 / 서기 (Sit ↔ Stand)** | 앉았다 일어서기 반복 |

---

## ⚙️ 5. 프로젝트 아키텍처 & 엔지니어링 핵심

* **관측 규격 (61-dim)**: 48개 고유수용성 감각(관절 위치/속도/중력 벡터 등) + 3차원 속도(Twist) + 4차원 머리자세 + 6차원 몸체자세.
* **14개 서보 모터 배치**:
  - `0~4`: 왼쪽 다리 (골반 요/롤/피치, 무릎, 발목)
  - `5~8`: 목/머리 (목 피치, 머리 피치/요/롤)
  - `9~13`: 오른쪽 다리 (골반 요/롤/피치, 무릎, 발목)
* **BAM 액추에이터 모델**: 단순 모터 이상치가 아니라 실제 Dynamixel XL330 서보의 전압 제어 법칙, 역기전력(Back-EMF), 쿨롱 마찰력을 계산하여 실물 로봇과 100% 동일하게 동작하도록 설계됨.
