import math
import random
import time
import json
import collections
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F

W, H = 300, 400
COLS, ROWS, BW, BH, TOP = 10, 6, 30, 12, 60
PW, PY, PSPEED = 50, 370, 6
SPEED, LIVES, MAX_STEPS = 4, 3, 3000
LAUNCH = [-2, -1, 0.5, 1.5, 2.5, -2.5, 1, -0.5]
ACTIONS = ['가만히', '왼쪽', '오른쪽']
SEEDS = [0, 1, 2, 3, 4]

class Game:
    def __init__(self, seed=0):
        self.seed = seed; self.px = W / 2; self.bx = 0.0; self.by = 0.0; self.vx = 0.0; self.vy = 0.0
        self.bricks = [1] * (COLS * ROWS); self.left = COLS * ROWS
        self.lives = LIVES; self.score = 0; self.steps = 0; self.launches = 0; self.done = False
        self._launch()

    def _launch(self):
        vx = LAUNCH[(self.seed * 3 + self.launches) % len(LAUNCH)]
        self.launches += 1
        self.bx = self.px; self.by = PY - 10
        self.vx = vx; self.vy = -math.sqrt(SPEED * SPEED - vx * vx)

    def state(self):
        return [self.px / W, self.bx / W, self.by / H, self.vx / SPEED, self.vy / SPEED,
                (self.bx - self.px) / W, self.left / (COLS * ROWS), self.lives / LIVES]

    def step(self, action):
        if self.done: return 0
        reward = 0
        if action == 1: self.px -= PSPEED
        elif action == 2: self.px += PSPEED
        if self.px < PW / 2: self.px = PW / 2
        if self.px > W - PW / 2: self.px = W - PW / 2

        self.bx += self.vx; self.by += self.vy
        if self.bx < 0: self.bx = -self.bx; self.vx = -self.vx
        if self.bx > W: self.bx = 2 * W - self.bx; self.vx = -self.vx
        if self.by < 0: self.by = -self.by; self.vy = -self.vy

        if TOP <= self.by < TOP + ROWS * BH:
            c = math.floor(self.bx / BW); r = math.floor((self.by - TOP) / BH)
            i = r * COLS + c
            if 0 <= c < COLS and self.bricks[i] == 1:
                self.bricks[i] = 0; self.left -= 1; self.score += 1; reward += 1
                self.vy = -self.vy

        if self.vy > 0 and PY <= self.by <= PY + 8 and self.px - PW / 2 - 4 <= self.bx <= self.px + PW / 2 + 4:
            off = (self.bx - self.px) / (PW / 2)
            if off < -1: off = -1
            if off > 1: off = 1
            self.vx = off * 3
            self.vy = -math.sqrt(SPEED * SPEED - self.vx * self.vx)
            self.by = PY
            # 패들 리바운드 보너스 (훈련 시 패들 타격 감지용)
            self.hit_paddle = True
            self.last_off = off
        else:
            self.hit_paddle = False

        if self.by > H:
            self.lives -= 1; reward -= 1
            if self.lives <= 0: self.done = True
            else: self._launch()
        if self.left == 0: self.done = True
        self.steps += 1
        if self.steps >= MAX_STEPS: self.done = True
        return reward

def evaluate_net(net):
    net.eval()
    scores = []
    with torch.no_grad():
        for s in SEEDS:
            g = Game(s)
            while not g.done:
                g.step(int(net(torch.tensor(g.state(), dtype=torch.float32)).argmax()))
            scores.append(g.score)
    net.train()
    return scores, round(sum(scores)/len(scores)*10)/10

def export_brain(net):
    return {'layers': [{'W': m.weight.detach().double().tolist(), 'b': m.bias.detach().double().tolist()}
                       for m in net if isinstance(m, nn.Linear)]}

def train_podium_58(seed=7, hidden=96):
    총걸음 = 200_000
    학습률 = 5e-4
    감마 = 0.99
    탐험기간 = 0.45
    
    random.seed(seed); np.random.seed(seed); torch.manual_seed(seed); torch.set_num_threads(1)
    q = nn.Sequential(nn.Linear(8, hidden), nn.ReLU(), nn.Linear(hidden, hidden), nn.ReLU(), nn.Linear(hidden, 3))
    target = nn.Sequential(nn.Linear(8, hidden), nn.ReLU(), nn.Linear(hidden, hidden), nn.ReLU(), nn.Linear(hidden, 3))
    target.load_state_dict(q.state_dict())
    opt = torch.optim.Adam(q.parameters(), lr=학습률)

    N = 60_000
    S = np.zeros((N, 8), np.float32); A = np.zeros(N, np.int64); R = np.zeros(N, np.float32)
    S2 = np.zeros((N, 8), np.float32); D = np.zeros(N, np.float32); k = 0; 찬 = 0

    # 훈련 게임 생성 (대회 5개 시드 + 무작위 시드 교차)
    train_seeds = [0, 1, 2, 3, 4]
    seed_idx = 0
    g = Game(train_seeds[seed_idx]); s = g.state()
    
    최고점 = -1; 최고_상세 = []; 최고_걸음 = 0; 최고_두뇌 = None
    t0 = time.time()

    for 걸음 in range(1, 총걸음 + 1):
        eps = max(0.02, 1 - 걸음 / (총걸음 * 탐험기간))
        if random.random() < eps:
            a = random.randrange(3)
        else:
            with torch.no_grad():
                a = int(q(torch.tensor(s, dtype=torch.float32)).argmax())

        raw_r = g.step(a)
        s2 = g.state()
        
        # 🎯 [핵심] 보상 성형(Reward Shaping): 패들로 공을 받아칠 때 살짝 보상 + 모서리 깎아치기 보너스
        r = raw_r
        if getattr(g, 'hit_paddle', False):
            # 공을 살려낸 것 자체에 대한 보상
            r += 0.2
            # 모서리로 깎아 쳤을 때 대각선 궤적 유도 보너스 (|off| > 0.4)
            if abs(g.last_off) > 0.4:
                r += 0.3

        S[k] = s; A[k] = a; R[k] = r; S2[k] = s2; D[k] = float(g.done or raw_r < 0); k = (k + 1) % N; 찬 = min(찬 + 1, N)
        s = s2

        if g.done:
            seed_idx = (seed_idx + 1) % len(train_seeds)
            # 절반은 공식 5개 시드, 절반은 임의 시드로 일반화
            next_seed = train_seeds[seed_idx] if random.random() < 0.6 else random.randrange(1000)
            g = Game(next_seed); s = g.state()

        if 걸음 > 2000:
            i = np.random.randint(0, 찬, 64)
            with torch.no_grad():
                # 🌟 Double DQN: q로 최고 행동 선택, target으로 가치 계산
                best_actions = q(torch.tensor(S2[i])).argmax(1, keepdim=True)
                y = torch.tensor(R[i]) + 감마 * target(torch.tensor(S2[i])).gather(1, best_actions).squeeze(1) * (1 - torch.tensor(D[i]))
            p = q(torch.tensor(S[i])).gather(1, torch.tensor(A[i]).unsqueeze(1)).squeeze(1)
            loss = F.smooth_l1_loss(p, y)
            opt.zero_grad(); loss.backward(); opt.step()

        # Hard target update (매 1,000걸음)
        if 걸음 % 1000 == 0:
            target.load_state_dict(q.state_dict())

        # 초정밀 낚시질 (매 1,000걸음마다 공식 채점)
        if 걸음 % 1000 == 0 and 걸음 >= 20_000:
            판들, 평균 = evaluate_net(q)
            if 평균 > 최고점:
                최고점 = 평균; 최고_상세 = 판들; 최고_걸음 = 걸음
                최고_두뇌 = export_brain(q)
                print(f"🔥 [{걸음:>6}걸음 | {time.time()-t0:3.0f}초] 갱신! 5판 평균: {평균:4.1f}점 {판들}", flush=True)

    print(f"\n🏆 최종 완료: 최고 {최고점}점 {최고_상세} ({최고_걸음}걸음 구간)")
    return 최고점, 최고_두뇌

if __name__ == '__main__':
    train_podium_58(seed=7, hidden=96)
