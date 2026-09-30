#!/usr/bin/env python3
"""
synthesize_supertonic.py
Supertonic 3 일레븐랩스급 고음질 한국어 TTS 생성기
"""
import sys
import os
import argparse
import numpy as np

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--text", required=True, help="낭독할 대본 텍스트")
    parser.add_argument("--voice", default="M1", help="M1~M5, F1~F5 등 음성 스타일")
    parser.add_argument("--speed", type=float, default=0.92, help="낭독 속도 (0.8~1.2)")
    parser.add_argument("--steps", type=int, default=6, help="합성 스텝 수 (6: 실시간, 8: 권장, 12: 고음질)")
    parser.add_argument("--pause", type=float, default=0.5, help="문단 사이 쉼(초)")
    parser.add_argument("--out", required=True, help="출력 WAV 파일 경로")
    args = parser.parse_args()

    try:
        import supertonic
        import soundfile as sf
    except ImportError as e:
        print(f"[ERROR] 필수 패키지 부재: {e}", file=sys.stderr)
        sys.exit(1)

    text = args.text.strip()
    if not text:
        print("[ERROR] 텍스트가 비어 있습니다.", file=sys.stderr)
        sys.exit(1)

    tts = supertonic.TTS()
    # 지원 목소리 매핑
    voice_key = args.voice.upper()
    try:
        style = tts.get_voice_style(voice_key)
    except Exception:
        # 혹시 voice_key 매핑 실패 시 M1 기본
        style = tts.get_voice_style("M1")

    sr = tts.sample_rate

    # 문단 분리 (### 장면 전환 처리 포함)
    raw_paragraphs = [p.strip() for p in text.split("\n") if p.strip()]
    out = []

    for p in raw_paragraphs:
        if p == "###":
            out.append(np.zeros(int(sr * 1.5), dtype=np.float32))
            continue
        try:
            wav, dur = tts.synthesize(
                p,
                voice_style=style,
                total_steps=args.steps,
                speed=args.speed,
                lang="ko"
            )
            wav = wav[0] if wav.ndim == 2 else wav
            out.append(wav.astype(np.float32))
            out.append(np.zeros(int(sr * args.pause), dtype=np.float32))
        except Exception as synth_err:
            print(f"[WARN] 문단 합성 경고: {synth_err}", file=sys.stderr)

    if not out:
        print("[ERROR] 합성 결과가 없습니다.", file=sys.stderr)
        sys.exit(1)

    audio = np.concatenate(out)
    tts.save_audio(audio, args.out)
    duration = len(audio) / sr
    print(f"[SUCCESS] {args.out} (길이: {duration:.2f}초, 샘플레이트: {sr}Hz)")

if __name__ == "__main__":
    main()
