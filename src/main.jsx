import React, { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("GlobalErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          fontFamily: 'sans-serif',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: 24, marginBottom: 12, color: '#f43f5e' }}>⚠️ 화면 렌더링 중 일시적 오류가 발생했습니다.</h1>
          <p style={{ color: '#94a3b8', maxWidth: 480, marginBottom: 20 }}>
            {this.state.error?.message || '알 수 없는 오류'}
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => { window.location.href = window.location.pathname; }}
              style={{
                background: '#4f46e5',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: 8,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              🔄 메인화면으로 복구
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#334155',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: 8,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              새로고침
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  </StrictMode>,
)

