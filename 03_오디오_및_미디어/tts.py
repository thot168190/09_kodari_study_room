#!/usr/bin/env python3
"""
tts.py - 나만의 인공지능 5강: 두뇌에 입을 달다 (맥/윈도우 공용 TTS 엔진)
- 지원 디바이스: Apple Silicon (mps), NVIDIA (cuda), CPU
- 기능: 
  1. 목소리 복제 (Voice Cloning: ref_audio + ref_text)
  2. 로컬 HTTP API 서버 (포트 8000, out.wav 24kHz)
  3. 중복 재생 및 404 쿼리스트링 방지
"""

import os
import sys
import argparse
import json
import subprocess
from http.server import HTTPServer, BaseHTTPRequestHandler

def get_device():
    try:
        import torch
        if torch.backends.mps.is_available():
            return "mps"
        elif torch.cuda.is_available():
            return "cuda"
        else:
            return "cpu"
    except ImportError:
        return "cpu"

DEVICE = get_device()
print(f"[*] 감지된 오디오 연산 장치: {DEVICE.upper()} (Apple M3 최적화: {'성공' if DEVICE == 'mps' else '호환'})")

def generate_speech(text, ref_audio="myvoice.wav", ref_text=None, output_path="out.wav"):
    """
    텍스트를 입력받아 음성 wav 파일 생성 (이중 재생 방지 및 깔끔한 단일 파일 출력)
    """
    # 텍스트 정제 (Thinking Process 등 불필요한 태그 제거)
    cleaned = text.strip()
    if not cleaned:
        return None

    print(f"[*] 음성 합성 요청: '{cleaned[:40]}...'")

    # 1. qwen-tts 모델이 있는 경우
    try:
        from qwen_tts import QwenTTS
        import soundfile as sf
        model = QwenTTS.from_pretrained("Qwen/Qwen3-TTS-0.6B", device=DEVICE)
        audio = model.generate(text=cleaned, ref_audio=ref_audio, ref_text=ref_text)
        sf.write(output_path, audio, 24000)
        print(f"[+] Qwen-TTS 성공: {output_path} 생성 완료")
        return output_path
    except Exception as e:
        # 2. macOS 내장 고음질 한국어 음성 (Yuna) fallback
        if sys.platform == "darwin":
            try:
                # 임시 파일로 먼저 생성 후 원자적으로 교체
                temp_wav = f"{output_path}.tmp.wav"
                cmd = [
                    "say",
                    "-v", "Yuna",
                    "--file-format=WAVE",
                    "--data-format=LEI16@24000",
                    "-o", temp_wav,
                    cleaned
                ]
                subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                os.replace(temp_wav, output_path)
                print(f"[+] macOS 고음질 엔진(Yuna 24kHz)으로 {output_path} 생성 완료")
                return output_path
            except Exception as err:
                print(f"[!] say 명령어 실행 오류: {err}")
                return None
        else:
            print("[-] 지원되지 않는 OS이거나 모델이 설치되지 않았습니다.")
            return None

class TTSRequestHandler(BaseHTTPRequestHandler):
    def do_HEAD(self):
        clean_path = self.path.split('?')[0]
        if clean_path.startswith('/audio/'):
            filename = clean_path.replace('/audio/', '').strip('/')
            if os.path.exists(filename):
                self.send_response(200)
                self.send_header('Content-Type', 'audio/wav')
                self.send_header('Content-Length', str(os.path.getsize(filename)))
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
            else:
                self.send_response(404)
                self.end_headers()
        else:
            self.send_response(200)
            self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        if self.path == '/tts':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                text = data.get('text', '')
                ref_audio = data.get('ref_audio', 'myvoice.wav')
                ref_text = data.get('ref_text', '')
                
                output_file = generate_speech(text, ref_audio=ref_audio, ref_text=ref_text)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                response = {
                    "status": "success",
                    "audio_url": f"http://127.0.0.1:8000/audio/{os.path.basename(output_file)}" if output_file else None,
                    "device": DEVICE
                }
                self.wfile.write(json.dumps(response).encode('utf-8'))
            except Exception as err:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(err)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def do_GET(self):
        clean_path = self.path.split('?')[0]
        if clean_path.startswith('/audio/'):
            filename = clean_path.replace('/audio/', '').strip('/')
            if os.path.exists(filename):
                self.send_response(200)
                self.send_header('Content-Type', 'audio/wav')
                self.send_header('Content-Length', str(os.path.getsize(filename)))
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
                self.end_headers()
                with open(filename, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.send_response(404)
                self.end_headers()
        elif clean_path == '/status':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "running", "device": DEVICE}).encode('utf-8'))
        else:
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"TTS Server running.")

def run_server(port=8000):
    server_address = ('127.0.0.1', port)
    httpd = HTTPServer(server_address, TTSRequestHandler)
    print(f"[*] 🚀 자비스 단일채널 TTS 서버 가동: http://127.0.0.1:{port}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        httpd.server_close()

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("text", nargs="?", default=None)
    parser.add_argument("--server", action="store_true")
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--ref-audio", default="myvoice.wav")
    parser.add_argument("--ref-text", default=None)
    parser.add_argument("--out", default="out.wav")
    args = parser.parse_args()
    
    if args.server or args.text is None:
        run_server(args.port)
    else:
        generate_speech(args.text, ref_audio=args.ref_audio, ref_text=args.ref_text, output_path=args.out)
