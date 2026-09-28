#!/usr/bin/env python3
"""
Offscreen video generator for Microduck simulation.
Runs policy inference and saves high-quality MP4 / GIF animations.
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
SCENE_XML = WORKSPACE / "microduck_rl/src/mjlab_microduck/robot/microduck/scene.xml"
WALKING_ONNX = WORKSPACE / "microduck/policies/alpha_walking.onnx"
OUTPUT_MP4 = WORKSPACE / "public/microduck_walking_demo.mp4"
OUTPUT_GIF = WORKSPACE / "public/microduck_walking_demo.gif"

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

def main():
    print(f"Loading scene: {SCENE_XML}")
    model = mujoco.MjModel.from_xml_path(str(SCENE_XML))
    data = mujoco.MjData(model)

    print(f"Loading ONNX policy: {WALKING_ONNX}")
    sess = ort.InferenceSession(str(WALKING_ONNX), providers=["CPUExecutionProvider"])

    # Reset
    mujoco.mj_resetData(model, data)
    data.qpos[7:21] = DEFAULT_POSE
    mujoco.mj_forward(model, data)

    # Renderer setup (width x height)
    width, height = 640, 480
    renderer = mujoco.Renderer(model, height, width)

    # Camera tracking trunk_base
    camera = mujoco.MjvCamera()
    camera.type = mujoco.mjtCamera.mjCAMERA_TRACKING
    camera.trackbodyid = mujoco.mj_name2id(model, mujoco.mjtObj.mjOBJ_BODY, "trunk_base")
    camera.distance = 0.85
    camera.elevation = -18.0
    camera.azimuth = 135.0

    frames = []
    fps = 30
    sim_dt = model.opt.timestep
    decimation = max(1, int(round(0.02 / sim_dt))) # 50Hz policy
    policy_dt = sim_dt * decimation
    total_seconds = 5.0
    total_steps = int(total_seconds / policy_dt)
    render_interval = int(round(1.0 / (fps * policy_dt)))

    last_action = np.zeros(14, dtype=np.float32)
    # Forward velocity command (0.2 m/s)
    cmd = np.array([0.2, 0.0, 0.0], dtype=np.float32)
    head_cmd = np.zeros(4, dtype=np.float32)
    body_cmd = np.zeros(6, dtype=np.float32)

    try:
        from bam.actuators import XL330ActuatorModel
        actuator_model = XL330ActuatorModel(gear_ratio=1.0)
    except Exception as e:
        actuator_model = None

    print(f"Rendering {total_seconds}s simulation ({total_steps} policy steps)...")

    for step_idx in range(total_steps):
        # Body frame angular velocity
        trunk_id = camera.trackbodyid
        rot = data.xmat[trunk_id].reshape(3, 3)
        ang_w = rot.T @ data.cvel[trunk_id][0:3]

        # Projected gravity
        g_proj = rot.T @ np.array([0.0, 0.0, -1.0])

        # Joint positions & velocities
        joint_q = data.qpos[7:21].astype(np.float32) - DEFAULT_POSE
        joint_qd = data.qvel[6:20].astype(np.float32)

        # 61-dim Observation
        obs = np.concatenate([
            ang_w.astype(np.float32),
            g_proj.astype(np.float32),
            joint_q,
            joint_qd,
            last_action,
            cmd,
            head_cmd,
            body_cmd
        ], dtype=np.float32).reshape(1, -1)

        # ONNX inference
        inputs = {sess.get_inputs()[0].name: obs}
        action = sess.run(None, inputs)[0][0]
        last_action = action.copy()

        # Apply target position PD control
        target_q = DEFAULT_POSE + action * 0.35
        kp, kd = 12.0, 0.35

        for _ in range(decimation):
            q_cur = data.qpos[7:21]
            qd_cur = data.qvel[6:20]
            tau = kp * (target_q - q_cur) - kd * qd_cur
            # Coulomb & viscous friction
            tau -= 0.012 * np.tanh(qd_cur * 40.0) + 0.004 * qd_cur
            tau = np.clip(tau, -0.35, 0.35)
            data.ctrl[:14] = tau
            mujoco.mj_step(model, data)

        if step_idx % render_interval == 0:
            renderer.update_scene(data, camera)
            img = renderer.render()
            frames.append(img)

    print(f"Saving video ({len(frames)} frames) to {OUTPUT_MP4}...")
    OUTPUT_MP4.parent.mkdir(parents=True, exist_ok=True)
    imageio.mimsave(str(OUTPUT_MP4), frames, fps=fps, quality=8)
    
    print(f"Saving GIF to {OUTPUT_GIF}...")
    # downsample slightly for lighter GIF
    gif_frames = frames[::2]
    imageio.mimsave(str(OUTPUT_GIF), gif_frames, fps=fps//2)

    print("✅ Render completed successfully!")

if __name__ == "__main__":
    main()
