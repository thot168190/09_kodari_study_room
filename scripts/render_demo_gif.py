import math
import random
import time
import json
import numpy as np
from PIL import Image, ImageDraw, ImageFont

W, H = 300, 400
COLS, ROWS, BW, BH, TOP = 10, 6, 30, 12, 60
PW, PY, PSPEED = 50, 370, 6
SPEED, LIVES, MAX_STEPS = 4, 3, 3000
LAUNCH = [-2, -1, 0.5, 1.5, 2.5, -2.5, 1, -0.5]
ACTIONS = ['가만히', '왼쪽', '오른쪽']

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
        if action == 1: self.px -= PSPEED
        elif action == 2: self.px += PSPEED
        self.px = max(PW / 2, min(W - PW / 2, self.px))
        self.bx += self.vx; self.by += self.vy
        if self.bx < 0: self.bx = -self.bx; self.vx = -self.vx
        if self.bx > W: self.bx = 2 * W - self.bx; self.vx = -self.vx
        if self.by < 0: self.by = -self.by; self.vy = -self.vy
        if TOP <= self.by < TOP + ROWS * BH:
            c = math.floor(self.bx / BW); r = math.floor((self.by - TOP) / BH)
            i = r * COLS + c
            if 0 <= c < COLS and self.bricks[i] == 1:
                self.bricks[i] = 0; self.left -= 1; self.score += 1
                self.vy = -self.vy
        if self.vy > 0 and PY <= self.by <= PY + 8 and self.px - PW / 2 - 4 <= self.bx <= self.px + PW / 2 + 4:
            off = (self.bx - self.px) / (PW / 2)
            off = max(-1, min(1, off))
            self.vx = off * 3
            self.vy = -math.sqrt(SPEED * SPEED - self.vx * self.vx)
            self.by = PY
        if self.by > H:
            self.lives -= 1
            if self.lives <= 0: self.done = True
            else: self._launch()
        if self.left == 0: self.done = True
        self.steps += 1
        if self.steps >= MAX_STEPS: self.done = True
        return 0

def q_values(brain, x):
    h = x
    n = len(brain['layers'])
    for k, L in enumerate(brain['layers']):
        out = []
        for j in range(len(L['b'])):
            s = L['b'][j]
            row = L['W'][j]
            for i in range(len(row)):
                s += row[i] * h[i]
            out.append(0 if (k < n - 1 and s < 0) else s)
        h = out
    return h

def render_demo(brain_file, seed=2, out_gif="public/play_57points_demo.gif"):
    with open(brain_file) as f:
        brain = json.load(f)
    g = Game(seed)
    frames = []
    colors = [(248, 113, 113), (251, 146, 60), (250, 204, 21), (74, 222, 128), (56, 189, 248), (167, 139, 250)]
    
    font = ImageFont.load_default()

    while not g.done and g.steps < 2500:
        qv = q_values(brain, g.state())
        best = 0
        for i in range(1, len(qv)):
            if qv[i] > qv[best]: best = i
        g.step(best)
        
        # 3프레임마다 1컷 저장
        if g.steps % 3 == 0:
            im = Image.new('RGB', (W + 150, H), (14, 18, 28))
            d = ImageDraw.Draw(im)
            for i, b in enumerate(g.bricks):
                if b:
                    r, c = divmod(i, COLS)
                    d.rectangle([c*BW+1, TOP+r*BH+1, c*BW+BW-2, TOP+r*BH+BH-2], fill=colors[r])
            d.rectangle([g.px - PW/2, PY, g.px + PW/2, PY + 6], fill=(226, 232, 240))
            d.ellipse([g.bx - 4, g.by - 4, g.bx + 4, g.by + 4], fill=(255, 255, 255))
            d.line([W, 0, W, H], fill=(51, 65, 85))
            d.text((W + 10, 15), f"BRICKS: {g.score}/60", fill=(255, 214, 102), font=font)
            d.text((W + 10, 35), f"LIVES: {g.lives}", fill=(160, 170, 190), font=font)
            d.text((W + 10, 55), f"STEPS: {g.steps}", fill=(160, 170, 190), font=font)
            d.text((W + 10, 85), f"ACT: {ACTIONS[best]}", fill=(56, 189, 248), font=font)
            frames.append(im)
            
    print(f"Game finished! Seed {seed}, Score: {g.score}, Steps: {g.steps}, Frames: {len(frames)}")
    # Save optimized GIF
    if frames:
        frames[0].save(out_gif, save_all=True, append_images=frames[1:], optimize=True, duration=40, loop=0)
        print(f"Saved demo to {out_gif}")

if __name__ == '__main__':
    render_demo("brain_51.8점_BEST.json", seed=2)
