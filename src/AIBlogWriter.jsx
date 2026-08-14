import React, { useState, useRef, useEffect } from 'react';
import './AIBlogWriter.css';
import { PenTool, Sparkles, Copy, CheckCircle2, Type, Hash, Loader2, Wand2, ChevronRight, MessageSquareQuote } from 'lucide-react';

export default function AIBlogWriter({ onExit }) {
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('전문적인');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultText, setResultText] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const resultEndRef = useRef(null);

  const tones = [
    { id: '전문적인', label: '전문적인 💼', desc: '신뢰감을 주는 비즈니스 톤' },
    { id: '친근한', label: '친근한 ☕', desc: '이웃집 친구처럼 편안한 톤' },
    { id: '유머러스한', label: '유머러스한 😆', desc: '위트있고 재밌게 읽히는 톤' },
    { id: '감성적인', label: '감성적인 🌙', desc: '마음을 울리는 에세이 톤' },
    { id: '도발적인', label: '도발적인 🔥', desc: '호기심을 강하게 자극하는 톤' }
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setErrorMsg('블로그 주제를 입력해주세요.');
      return;
    }

    setErrorMsg('');
    setIsGenerating(true);
    setResultText('');
    setIsCopied(false);

    const systemPrompt = `당신은 최고 수준의 블로그 전문 마케터이자 카피라이터입니다. 
주어진 주제와 키워드를 바탕으로 SEO에 최적화되고 가독성이 뛰어난 블로그 포스팅을 작성해 주세요. 
반드시 마크다운(Markdown) 형식을 사용하여 제목(#), 소제목(##), 글머리 기호(-), 강조(**) 등을 적절히 섞어 예쁘게 구성해야 합니다.
선택된 어조(Tone)를 완벽하게 반영하여 글을 써주세요.

[중요 지시사항: 이미지 삽입]
글의 문맥에 맞는 이미지가 필요할 때마다 다음 형식으로 이미지를 2~3장 정도 삽입하세요:
![이미지 설명](https://image.pollinations.ai/prompt/영문키워드?width=800&height=400&nologo=true)
* '영문키워드' 부분에는 해당 문단에 어울리는 구체적인 영어 단어들을 띄어쓰기 대신 하이픈(-)으로 연결해서 넣으세요. 절대 한글을 넣지 마세요.
* 예시: ![커피 마시는 직장인](https://image.pollinations.ai/prompt/office-worker-drinking-coffee?width=800&height=400&nologo=true)
`;

    const userPrompt = `
- 주제: ${topic}
- 포함할 키워드: ${keywords || '없음'}
- 어조: ${tone}

위 조건에 맞춰서 서론, 본론, 결론이 뚜렷한 완벽한 블로그 글을 지금 바로 작성해줘. 글 중간중간에 어울리는 고품질 AI 생성 이미지를 꼭 넣어줘.
`;

    try {
      const response = await fetch('http://127.0.0.1:1234/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'local-model', // LM Studio는 보통 모델명을 무시하고 로드된 모델을 사용합니다
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          stream: true,
        })
      });

      if (!response.ok) {
        throw new Error(`API 오류: ${response.status}`);
      }

      // 스트리밍 읽기
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const data = JSON.parse(line.substring(6));
              if (data.choices && data.choices[0].delta && data.choices[0].delta.content) {
                setResultText(prev => prev + data.choices[0].delta.content);
              }
            } catch (e) {
              // json parse 에러 무시
            }
          }
        }
        
        // 스크롤 아래로 부드럽게
        if (resultEndRef.current) {
          resultEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }

    } catch (err) {
      console.error(err);
      setErrorMsg(`[연결 오류] LM Studio 서버(1234포트)가 실행 중인지 확인해주세요.\n상세: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resultText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // 마크다운 심플 렌더링 함수
  const renderMarkdown = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let htmlLine = line;
      // Bold 처리
      htmlLine = htmlLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Image 처리 ![alt](url)
      htmlLine = htmlLine.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, url) => {
        const safeUrl = encodeURI(url.trim());
        return `<img src="${safeUrl}" alt="${alt}" style="max-width: 100%; border-radius: 12px; margin: 20px 0; box-shadow: 0 4px 20px rgba(0,0,0,0.3);" />`;
      });
      
      if (line.startsWith('# ')) {
        return <h1 key={idx} dangerouslySetInnerHTML={{ __html: htmlLine.replace('# ', '') }} />;
      } else if (line.startsWith('## ')) {
        return <h2 key={idx} dangerouslySetInnerHTML={{ __html: htmlLine.replace('## ', '') }} />;
      } else if (line.startsWith('### ')) {
        return <h3 key={idx} dangerouslySetInnerHTML={{ __html: htmlLine.replace('### ', '') }} />;
      } else if (line.startsWith('- ')) {
        return <li key={idx} dangerouslySetInnerHTML={{ __html: htmlLine.substring(2) }} />;
      } else if (line.trim() === '') {
        return <br key={idx} />;
      } else {
        return <p key={idx} dangerouslySetInnerHTML={{ __html: htmlLine }} />;
      }
    });
  };

  return (
    <div className="blog-writer-container">
      
      {/* 백그라운드 장식 애니메이션 */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      
      <div className="blog-writer-glass">
        
        {/* 헤더 */}
        <header className="bw-header">
          <div className="bw-title-area">
            <div className="bw-icon-wrapper">
              <PenTool size={28} className="bw-icon-glow" />
            </div>
            <div>
              <h1 className="bw-title">AI Blog Studio</h1>
              <p className="bw-subtitle">로컬 AI가 작성하는 1인 기업 프리미엄 블로그</p>
            </div>
          </div>
          <div className="bw-status-badge">
            <span className="status-dot pulse"></span>
            Local API Connected
          </div>
        </header>

        <div className="bw-content-layout">
          
          {/* 입력 패널 */}
          <div className="bw-input-panel">
            
            <div className="bw-input-group">
              <label>
                <Type size={16} /> 블로그 주제 (Topic)
              </label>
              <textarea 
                className="bw-textarea" 
                placeholder="예: 초보자를 위한 노션 사용법 완벽 가이드"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={isGenerating}
              />
            </div>

            <div className="bw-input-group">
              <label>
                <Hash size={16} /> 핵심 키워드 (선택)
              </label>
              <input 
                type="text" 
                className="bw-input" 
                placeholder="예: 노션 템플릿, 생산성, 1인기업 (쉼표로 구분)"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                disabled={isGenerating}
              />
            </div>

            <div className="bw-input-group">
              <label>
                <MessageSquareQuote size={16} /> 글쓰기 어조 (Tone)
              </label>
              <div className="bw-tone-grid">
                {tones.map((t) => (
                  <button 
                    key={t.id}
                    className={`bw-tone-btn ${tone === t.id ? 'active' : ''}`}
                    onClick={() => setTone(t.id)}
                    disabled={isGenerating}
                    title={t.desc}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {errorMsg && (
              <div className="bw-error-box">
                {errorMsg}
              </div>
            )}

            <button 
              className={`bw-generate-btn ${isGenerating ? 'generating' : ''}`}
              onClick={handleGenerate}
              disabled={isGenerating || !topic.trim()}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="spinner" size={20} />
                  <span>AI가 폭풍 집필 중...</span>
                </>
              ) : (
                <>
                  <Wand2 size={20} />
                  <span>매직 블로그 생성하기</span>
                </>
              )}
            </button>
            
          </div>

          {/* 출력 패널 */}
          <div className="bw-output-panel">
            <div className="bw-output-header">
              <div className="bw-output-title">
                <Sparkles size={18} /> 생성된 블로그 초안
              </div>
              <button 
                className="bw-copy-btn" 
                onClick={handleCopy} 
                disabled={!resultText}
                title="텍스트 복사"
              >
                {isCopied ? <CheckCircle2 size={18} color="#10b981" /> : <Copy size={18} />}
                <span>{isCopied ? '복사 완료!' : '복사하기'}</span>
              </button>
            </div>
            
            <div className="bw-output-content">
              {resultText ? (
                <div className="markdown-body">
                  {renderMarkdown(resultText)}
                  <div ref={resultEndRef} />
                </div>
              ) : (
                <div className="bw-empty-state">
                  <div className="empty-icon-circle">
                    <PenTool size={32} />
                  </div>
                  <p>주제와 키워드를 입력하고<br/>생성 버튼을 눌러보세요.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
