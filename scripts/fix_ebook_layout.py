# -*- coding: utf-8 -*-
"""
전자책 글자 잘림 및 레이아웃 오류 완전 수리 스크립트
1. Chrome Headless 인쇄 시 좌우 글자 잘림 현상 원천 해결 (A4 표준 마진 적용)
2. 시원하고 큼직한 노안 친화적 서체 유지
3. 바탕화면 '코다리_전자책_도서관' 및 전체 도서관 일괄 덮어쓰기 동기화
"""

import subprocess
import os
import pymupdf

OUT_HTML = "/Users/mihyunlee/workspace/09_코다리_공부방/reports/ebook_RAG_Uncensor_JEVRL_완전정복.html"
OUT_PDF = "/Users/mihyunlee/workspace/09_코다리_공부방/reports/ebook_RAG_Uncensor_JEVRL_완전정복.pdf"

# scripts/generate_large_print_ebook.py 의 본문 페이지 데이터 재활용
from generate_large_print_ebook import pages_raw, make_page

total_p = len(pages_raw)
rendered_pages = [make_page(p, i + 1, total_p) for i, p in enumerate(pages_raw)]

# 🌟 잘림 없는 완벽한 인쇄용 CSS 설계
fixed_document = f"""<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>두뇌에 지식과 속도를 달다 — RAG, Uncensor, JEVRL</title>
  <link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
  <style>
    @page {{
      size: A4 portrait;
      margin: 12mm 15mm 12mm 15mm; /* 인쇄 표준 안전 여백 */
    }}
    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", sans-serif;
      -webkit-font-smoothing: antialiased;
    }}
    html, body {{
      background: #FAF8F5;
      color: #111827;
      word-break: keep-all;
      overflow-wrap: break-word;
    }}
    
    .page {{
      width: 100%;
      min-height: 270mm;
      background: #FAF8F5;
      padding: 10mm 6mm 10mm 6mm;
      page-break-after: always;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: visible;
    }}

    .page-content {{
      flex: 1;
      width: 100%;
    }}

    /* 하단 푸터 */
    .page-footer {{
      height: 12mm;
      border-top: 1.5px solid #E5E0D8;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10pt;
      color: #6B7280;
      font-weight: 600;
      margin-top: 15mm;
    }}

    /* 표지 스타일 */
    .cover-container {{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 30mm 0;
    }}
    .top-badge {{
      background: #111827;
      color: #FFFFFF;
      font-size: 12pt;
      font-weight: 800;
      padding: 8px 24px;
      border-radius: 6px;
      letter-spacing: 1px;
      margin-bottom: 30px;
    }}
    .cover-illu {{
      margin-bottom: 30px;
    }}
    .cover-main-title {{
      font-size: 32pt;
      font-weight: 900;
      color: #111827;
      line-height: 1.3;
      margin-bottom: 16px;
      word-break: keep-all;
    }}
    .title-underline {{
      width: 44px;
      height: 4px;
      background: #111827;
      margin: 0 auto 24px auto;
    }}
    .cover-sub-title {{
      font-size: 16pt;
      color: #4B5563;
      font-weight: 600;
      margin-bottom: 40px;
    }}
    .cover-author {{
      font-size: 12pt;
      color: #6B7280;
      font-weight: 600;
    }}

    /* 목차 스타일 */
    .toc-container {{
      padding-top: 5mm;
    }}
    .section-label {{
      font-size: 12pt;
      color: #6B7280;
      font-weight: 600;
      margin-bottom: 6px;
    }}
    .toc-title {{
      font-size: 26pt;
      font-weight: 900;
      color: #111827;
      margin-bottom: 22px;
    }}
    .toc-list {{
      display: flex;
      flex-direction: column;
      gap: 12px;
    }}
    .toc-item {{
      display: flex;
      align-items: flex-start;
      gap: 16px;
    }}
    .toc-num {{
      font-size: 13pt;
      font-weight: 900;
      color: #111827;
      width: 24px;
    }}
    .toc-heading {{
      font-size: 13pt;
      font-weight: 800;
      color: #111827;
      margin-bottom: 2px;
    }}
    .toc-desc {{
      font-size: 10.5pt;
      color: #4B5563;
    }}
    .bottom-notice {{
      margin-top: 24px;
      font-size: 10.5pt;
      color: #4B5563;
      border-top: 1.5px solid #E5E0D8;
      padding-top: 12px;
      font-weight: 500;
    }}

    /* 섹션 간지 스타일 */
    .section-cover {{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 40mm 0;
    }}
    .black-num-badge {{
      width: 48px;
      height: 48px;
      background: #111827;
      color: #FFFFFF;
      font-size: 18pt;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
      border-radius: 6px;
    }}
    .sec-cover-title {{
      font-size: 26pt;
      font-weight: 900;
      color: #111827;
      margin-bottom: 14px;
      word-break: keep-all;
    }}
    .sec-cover-sub {{
      font-size: 14pt;
      color: #4B5563;
      margin-bottom: 22px;
      font-weight: 500;
      word-break: keep-all;
    }}

    /* 🌟 본문 제목: 좌우 여백 확보 및 잘림 방지 */
    .content-heading {{
      font-size: 20pt;
      font-weight: 900;
      color: #111827;
      margin-bottom: 20px;
      line-height: 1.35;
      word-break: keep-all;
      width: 100%;
    }}
    .body-text {{
      font-size: 13.5pt;
      line-height: 1.85;
      color: #1F2937;
      margin-bottom: 18px;
      font-weight: 450;
      word-break: keep-all;
    }}

    /* 🌟 오렌지 인용 바: 크고 굵고 시원하게 */
    .quote-orange {{
      border-left: 4px solid #D97706;
      padding: 12px 0 12px 18px;
      margin: 22px 0;
      font-size: 14pt;
      line-height: 1.75;
      color: #111827;
      font-weight: 600;
      word-break: keep-all;
    }}

    /* 보충 설명 검은색 인용 바 */
    .quote-black {{
      border-left: 3.5px solid #111827;
      padding: 10px 0 10px 16px;
      margin: 20px 0;
      font-size: 12pt;
      color: #374151;
      line-height: 1.7;
      word-break: keep-all;
    }}

    /* 큰 숫자 스텝 */
    .step-container {{
      margin: 18px 0;
    }}
    .step-num {{
      font-size: 15pt;
      font-weight: 900;
      color: #111827;
      margin-bottom: 4px;
    }}
    .step-title {{
      font-size: 14pt;
      font-weight: 800;
      color: #111827;
      margin-bottom: 4px;
    }}
    .step-desc {{
      font-size: 12.5pt;
      color: #374151;
      line-height: 1.65;
    }}

    /* QR 코드 페이지 */
    .qr-container {{
      padding-top: 25mm;
      text-align: center;
    }}
    .qr-top-label {{
      font-size: 11pt;
      letter-spacing: 4px;
      color: #4B5563;
      margin-bottom: 14px;
      font-weight: 600;
    }}
    .qr-heading {{
      font-size: 20pt;
      font-weight: 900;
      color: #111827;
      margin-bottom: 10px;
    }}
    .qr-sub {{
      font-size: 12.5pt;
      color: #4B5563;
      margin-bottom: 28px;
    }}
    .qr-hr {{
      width: 100%;
      height: 1.5px;
      background: #E5E0D8;
      margin-bottom: 35px;
    }}
    .qr-box {{
      border: 1.5px solid #E5E0D8;
      background: #FFFFFF;
      padding: 24px 32px;
      display: inline-flex;
      align-items: center;
      gap: 24px;
      text-align: left;
      border-radius: 10px;
    }}
    .qr-url {{
      font-size: 14pt;
      font-weight: 900;
      color: #111827;
      margin-bottom: 6px;
    }}
    .qr-desc {{
      font-size: 11pt;
      color: #4B5563;
    }}

    /* 낱말 풀이 테이블 */
    .term-table {{
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 12pt;
    }}
    .term-table th {{
      background: #F0ECE4;
      padding: 12px 16px;
      border-bottom: 2px solid #D5CDBE;
      text-align: left;
      color: #111827;
      font-weight: 800;
      font-size: 13pt;
    }}
    .term-table td {{
      padding: 13px 16px;
      border-bottom: 1px solid #EBE6DC;
      color: #1F2937;
      line-height: 1.65;
    }}

    @media print {{
      body {{
        background: #FAF8F5;
      }}
      .page {{
        margin: 0;
        box-shadow: none;
      }}
    }}
  </style>
</head>
<body>
  {''.join(rendered_pages)}
</body>
</html>
"""

with open(OUT_HTML, "w", encoding="utf-8") as f:
    f.write(fixed_document)

print("오류 수정 HTML 저장 완료! Chrome Headless PDF 컴파일 실행...")

cmd = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={OUT_PDF}",
    f"file://{OUT_HTML}"
]

res = subprocess.run(cmd, capture_output=True, text=True)
print("Chrome exit code:", res.returncode)

if os.path.exists(OUT_PDF):
    print(f"🎉 완벽 수리된 PDF 생성 완료! 크기: {os.path.getsize(OUT_PDF):,} bytes")
    
    # 도서관 전체 덮어쓰기 복사
    os.system('cp reports/ebook_RAG_Uncensor_JEVRL_완전정복.pdf "/Users/mihyunlee/Desktop/코다리_전자책_도서관/나만의인공지능_특별편_두뇌에_지식과_속도를_달다_RAG_Uncensor_JEVRL.pdf"')
    os.system('cp reports/ebook_RAG_Uncensor_JEVRL_완전정복.html "/Users/mihyunlee/Desktop/코다리_전자책_도서관/나만의인공지능_특별편_두뇌에_지식과_속도를_달다_RAG_Uncensor_JEVRL.html"')
    os.system('cp reports/ebook_RAG_Uncensor_JEVRL_완전정복.pdf 피지컬AI_교재PDF/04_RAG_Uncensor_JEVRL_두뇌에_지식과_속도를_달다.pdf')
    os.system('cp reports/ebook_RAG_Uncensor_JEVRL_완전정복.pdf 01_교재_및_기획문서/공부방_교재_두뇌에_지식과_속도를_달다_RAG_Uncensor_JEVRL.pdf')
    os.system('cp reports/ebook_RAG_Uncensor_JEVRL_완전정복.pdf public/studybook_assets/ebook_rag_uncensor_jevrl.pdf')
    os.system('cp reports/ebook_RAG_Uncensor_JEVRL_완전정복.pdf dist/studybook_assets/ebook_rag_uncensor_jevrl.pdf')
    print("📚 바탕화면 도서관 및 모든 서가 동기화 완료!")
    
    # 5페이지 검증 이미지 렌더링
    doc = pymupdf.open(OUT_PDF)
    page5 = doc[4] # 0-indexed -> page 5
    pix = page5.get_pixmap(dpi=150)
    out_p = "/Users/mihyunlee/.gemini/antigravity-ide/brain/22602d6c-fd8a-44c6-883b-89fbad56afe5/fixed_page_5.png"
    pix.save(out_p)
    print(f"Fixed page 5 image saved: {out_p}")
