#!/usr/bin/env python3
"""
Multi-Duck swarm video & simulation generator.
Simulates multiple MicroDucks running the trained ONNX walking policy in MuJoCo.
"""

import math
import os
import sys
from pathlib import Path
import numpy as np
import mujoco
import onnxruntime as ort
import imageio

WORKSPACE = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(WORKSPACE / "scripts"))
from multiduck_builder import build_multiduck_xml

DEFAULT_POSE = np.array([
    0.0,      # left_hip_yaw
    -0.0873,  # left_hip_roll
    -0.4579,  # left_hip_pitch
    -0.0049,  # left_knee
    0.4530,   # left_ankle
    0.3491,   # neck_pitch
    0.3491,   # head_pitch
    0.0,      # head_yaw
    0.0,      # head_roll
    0.0,      # right_hip_yaw
    0.0873,   # right_hip_roll
    0.4579,   # right_hip_pitch
    0.0049,   # right_knee
    -0.4530,  # right_ankle
], dtype=np.float32)

def simulate_multiduck(num_ducks=3, policy_path=None, duration=5.0, out_mp4=None, out_gif=None):
    if policy_path is None:
        policy_path = WORKSPACE / "custom_walking.onnx"
        if not policy_path.exists():
            policy_path = WORKSPACE / "microduck/policies/alpha_walking.onnx"

    print(f"🦆 [멀티덕 시뮬레이션] {num_ducks}마리 편대 생성 중...")
    xml_str = build_multiduck_xml(num_ducks=num_ducks, spacing=0.32)
    model = mujoco.MjModel.from_xml_string(xml_str)
    data = mujoco.MjData(model)

    print(f"🧠 ONNX 정책 로드: {policy_path}")
    sess = ort.InferenceSession(str(policy_path), providers=["CPUExecutionProvider"])

    # Reset & set initial joint poses for all ducks
    mujoco.mj_resetData(model, data)
    for i in range(num_ducks):
        # Each duck has 7 floating base qpos + 14 joint qpos = 21 qpos
        qpos_start = i * 21 + 7
        data.qpos[qpos_start:qpos_start + 14] = DEFAULT_POSE

    mujoco.mj_forward(model, data)

    # Offscreen renderer
    width, height = 640, 480
    renderer = mujoco.Renderer(model, height, width)

    camera = mujoco.MjvCamera()
    camera.type = mujoco.mjtCamera.mjCAMERA_TRACKING
    # Track the lead duck (duck_0)
    lead_trunk_id = mujoco.mj_name2id(model, mujoco.mjtObj.mjOBJ_BODY, "duck_0_trunk_base")
    camera.trackbodyid = lead_trunk_id if lead_trunk_id >= 0 else 0
    camera.distance = 1.3
    camera.elevation = -22.0
    camera.azimuth = 145.0

    frames = []
    fps = 30
    sim_dt = model.opt.timestep
    decimation = max(1, int(round(0.02 / sim_dt))) # 50Hz policy
    policy_dt = sim_dt * decimation
    total_steps = int(duration / policy_dt)
    render_interval = int(round(1.0 / (fps * policy_dt)))

    last_actions = np.zeros((num_ducks, 14), dtype=np.float32)
    cmd = np.array([0.22, 0.0, 0.0], dtype=np.float32)
    head_cmd = np.zeros(4, dtype=np.float32)
    body_cmd = np.zeros(6, dtype=np.float32)

    print(f"🎬 렌더링 시작 ({duration}초, {total_steps} 스텝)...")

    for step_idx in range(total_steps):
        # Gather observations for all ducks
        obs_batch = []
        for i in range(num_ducks):
            trunk_id = mujoco.mj_name2id(model, mujoco.mjtObj.mjOBJ_BODY, f"duck_{i}_trunk_base")
            rot = data.xmat[trunk_id].reshape(3, 3)
            ang_w = rot.T @ data.cvel[trunk_id][0:3]
            g_proj = rot.T @ np.array([0.0, 0.0, -1.0])

            qpos_start = i * 21 + 7
            qvel_start = i * 20 + 6
            joint_q = data.qpos[qpos_start:qpos_start + 14].astype(np.float32) - DEFAULT_POSE
            joint_qd = data.qvel[qvel_start:qvel_start + 14].astype(np.float32)

            obs_i = np.concatenate([
                ang_w.astype(np.float32),
                g_proj.astype(np.float32),
                joint_q,
                joint_qd,
                last_actions[i],
                cmd,
                head_cmd,
                body_cmd
            ], dtype=np.float32)
            obs_batch.append(obs_i)

        # Batched ONNX Inference for all ducks at once!
        obs_batch = np.array(obs_batch, dtype=np.float32) # (N, 61)
        inputs = {sess.get_inputs()[0].name: obs_batch}
        actions = sess.run(None, inputs)[0] # (N, 14)
        last_actions = actions.copy()

        # Apply target position PD control for each duck
        target_qs = [DEFAULT_POSE + actions[i] * 0.35 for i in range(num_ducks)]
        kp, kd = 12.0, 0.35

        for _ in range(decimation):
            for i in range(num_ducks):
                qpos_start = i * 21 + 7
                qvel_start = i * 20 + 6
                act_start = i * 14

                q_cur = data.qpos[qpos_start:qpos_start + 14]
                qd_cur = data.qvel[qvel_start:qvel_start + 14]
                tau = kp * (target_qs[i] - q_cur) - kd * qd_cur
                tau -= 0.012 * np.tanh(qd_cur * 40.0) + 0.004 * qd_cur
                tau = np.clip(tau, -0.35, 0.35)
                data.ctrl[act_start:act_start + 14] = tau

            mujoco.mj_step(model, data)

        if step_idx % render_interval == 0:
            renderer.update_scene(data, camera)
            img = renderer.render()
            frames.append(img)

    if out_mp4:
        Path(out_mp4).parent.mkdir(parents=True, exist_ok=True)
        imageio.mimsave(str(out_mp4), frames, fps=fps, quality=8)
        print(f"🎥 MP4 저장 완료: {out_mp4}")

    if out_gif:
        Path(out_gif).parent.mkdir(parents=True, exist_ok=True)
        imageio.mimsave(str(out_gif), frames[::2], fps=fps//2)
        print(f"🖼️ GIF 저장 완료: {out_gif}")

    print("✨ 멀티덕 시뮬레이션 렌더링 성공!")

if __name__ == "__main__":
    out_mp4 = WORKSPACE / "public/multiduck_swarm_demo.mp4"
    out_gif = WORKSPACE / "public/multiduck_swarm_demo.gif"
    simulate_multiduck(num_ducks=3, duration=4.5, out_mp4=out_mp4, out_gif=out_gif)
