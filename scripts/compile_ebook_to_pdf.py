# -*- coding: utf-8 -*-
"""
정원석 교수 강의 완전판 전자책 HTML ➔ PDF 고화질 컴파일러
"""

import subprocess
import os

md_path = '/Users/mihyunlee/workspace/09_코다리_공부방/reports/ebook_RAG_Uncensor_JEVRL_완전정복.md'
html_path = '/Users/mihyunlee/workspace/09_코다리_공부방/reports/ebook_RAG_Uncensor_JEVRL_완전정복.html'
pdf_path = '/Users/mihyunlee/workspace/09_코다리_공부방/reports/ebook_RAG_Uncensor_JEVRL_완전정복.pdf'

with open(md_path, 'r', encoding='utf-8') as f:
    md_text = f.read()

# Markdown to HTML basic parser
import html

def md_to_html(text):
    lines = text.splitlines()
    html_lines = []
    in_code_block = False
    code_block_lang = ''
    code_lines = []
    in_quote = False
    quote_lines = []
    
    for line in lines:
        stripped = line.strip()
        
        # Code block
        if stripped.startswith('```'):
            if in_code_block:
                html_lines.append(f'<pre class="code-box"><code>' + html.escape('\n'.join(code_lines)) + '</code></pre>')
                in_code_block = False
                code_lines = []
            else:
                in_code_block = True
                code_block_lang = stripped[3:].strip()
                code_lines = []
            continue
        
        if in_code_block:
            code_lines.append(line)
            continue
            
        # Quote block
        if stripped.startswith('>'):
            in_quote = True
            quote_lines.append(stripped[1:].strip())
            continue
        else:
            if in_quote:
                html_lines.append(f'<div class="transcript-box"><strong>🎙️ 녹취 원문:</strong><br>' + '<br>'.join(quote_lines) + '</div>')
                in_quote = False
                quote_lines = []

        if not stripped:
            continue
            
        if stripped.startswith('# '):
            html_lines.append(f'<h1 class="main-title">{stripped[2:]}</h1>')
        elif stripped.startswith('## '):
            html_lines.append(f'<h2 class="sec-title">{stripped[3:]}</h2>')
        elif stripped.startswith('### '):
            html_lines.append(f'<h3 class="sub-title">{stripped[4:]}</h3>')
        elif stripped.startswith('---'):
            html_lines.append('<hr class="divider">')
        elif stripped.startswith('- '):
            html_lines.append(f'<li class="bullet-item">{stripped[2:]}</li>')
        elif stripped.startswith(('1. ', '2. ', '3. ', '4. ')):
            html_lines.append(f'<li class="num-item">{stripped[3:]}</li>')
        else:
            html_lines.append(f'<p class="para">{line}</p>')
            
    if in_quote:
        html_lines.append(f'<div class="transcript-box"><strong>🎙️ 녹취 원문:</strong><br>' + '<br>'.join(quote_lines) + '</div>')
        
    return '\n'.join(html_lines)

body_html = md_to_html(md_text)

full_html = f"""<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>RAG, Uncensor, JEVRL 강의 완전판 전자책</title>
  <link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
  <style>
    @page {{
      size: A4;
      margin: 20mm 15mm 20mm 15mm;
      @bottom-center {{
        content: counter(page);
      }}
    }}
    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", sans-serif;
    }}
    body {{
      background: #ffffff;
      color: #1a1a1a;
      line-height: 1.8;
      font-size: 14px;
      padding: 20px;
      word-break: keep-all;
    }}
    .cover-card {{
      text-align: center;
      padding: 60px 20px 40px 20px;
      border-bottom: 3px double #2563eb;
      margin-bottom: 40px;
      page-break-after: always;
    }}
    .badge {{
      display: inline-block;
      padding: 6px 14px;
      border-radius: 20px;
      background: #eff6ff;
      color: #2563eb;
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 20px;
    }}
    .main-title {{
      font-size: 26px;
      font-weight: 800;
      line-height: 1.35;
      color: #111827;
      margin-bottom: 12px;
    }}
    .sub-head {{
      font-size: 16px;
      font-weight: 600;
      color: #4b5563;
      margin-bottom: 30px;
    }}
    .meta-box {{
      font-size: 13px;
      color: #6b7280;
      line-height: 2;
      background: #f9fafb;
      padding: 20px;
      border-radius: 12px;
      display: inline-block;
      text-align: left;
      border: 1px solid #e5e7eb;
    }}
    .sec-title {{
      font-size: 19px;
      font-weight: 800;
      color: #1e3a8a;
      border-bottom: 2px solid #3b82f6;
      padding-bottom: 8px;
      margin-top: 36px;
      margin-bottom: 16px;
      page-break-after: avoid;
    }}
    .sub-title {{
      font-size: 15.5px;
      font-weight: 700;
      color: #1f2937;
      margin-top: 20px;
      margin-bottom: 10px;
      page-break-after: avoid;
    }}
    .para {{
      margin-bottom: 14px;
      color: #374151;
      text-align: justify;
    }}
    .code-box {{
      background: #f3f4f6;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 14px 16px;
      font-family: monospace;
      font-size: 12.5px;
      line-height: 1.6;
      margin: 14px 0 20px 0;
      color: #1f2937;
      page-break-inside: avoid;
      white-space: pre-wrap;
    }}
    .transcript-box {{
      background: #fffbeb;
      border-left: 4px solid #f59e0b;
      padding: 14px 18px;
      border-radius: 0 10px 10px 0;
      margin: 16px 0 20px 0;
      font-size: 13px;
      color: #78350f;
      line-height: 1.75;
      page-break-inside: avoid;
    }}
    .bullet-item, .num-item {{
      margin-left: 20px;
      margin-bottom: 6px;
      color: #374151;
    }}
    .divider {{
      border: 0;
      height: 1px;
      background: #e5e7eb;
      margin: 30px 0;
    }}
    strong {{
      color: #111827;
    }}
  </style>
</head>
<body>
  <div class="cover-card">
    <div class="badge">AI ARCHITECTURE • 1인 기업 스케일업 완판본</div>
    <h1 class="main-title">📕 RAG, Uncensor, 그리고 JEVRL</h1>
    <div class="sub-head">거대언어모델(LLM)과 강화학습(RL)이 융합된<br>'1인 기업 자비스 에이전트' 마스터 교재</div>
    <div class="meta-box">
      • <strong>원작 강의:</strong> 정원석(Jay) 교수 유튜브 특강 (13분 01초 전편)<br>
      • <strong>기획·감수:</strong> 에이전트 총괄부장 코다리<br>
      • <strong>특징:</strong> 영상 자막 100% 전수 녹취 + 칠판 판서 복원 + 심층 CS 해설<br>
      • <strong>배포 포맷:</strong> 고화질 오프라인 보관용 PDF 전자책
    </div>
  </div>

  <div class="content-body">
    {body_html}
  </div>
</body>
</html>
"""

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(full_html)

print("HTML written successfully. Compiling PDF via Chrome Headless...")

cmd = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_path}",
    f"file://{html_path}"
]

res = subprocess.run(cmd, capture_output=True, text=True)
print("Chrome returncode:", res.returncode)

if os.path.exists(pdf_path):
    print(f"🎉 PDF 생성 완료! 크기: {os.path.getsize(pdf_path):,} bytes")
    print(f"경로: {pdf_path}")
else:
    print("❌ PDF 생성 실패:", res.stderr)
