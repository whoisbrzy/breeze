import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Breeze failed to render:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <main style={{ minHeight: '100vh', background: '#0b0b10', color: '#f4f2f8', display: 'grid', placeItems: 'center', padding: '28px', fontFamily: 'system-ui, sans-serif' }}>
          <section style={{ width: 'min(560px, 100%)', border: '1px solid #ffffff20', background: '#15151e', borderRadius: '16px', padding: '28px' }}>
            <p style={{ color: '#b7a6ff', fontSize: '12px', letterSpacing: '2px', fontWeight: 700 }}>BREEZE / STARTUP ERROR</p>
            <h1 style={{ fontSize: '28px', margin: '12px 0' }}>Breeze couldn't load.</h1>
            <p style={{ color: '#aaa6b5', lineHeight: 1.6 }}>The page started, but something went wrong while rendering the app. This error message can help us pinpoint the issue.</p>
            <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', color: '#ffd2a8', background: '#0b0b10', borderRadius: '8px', padding: '14px', fontSize: '12px' }}>{String(this.state.error?.message || this.state.error)}</pre>
            <button onClick={() => window.location.reload()} style={{ marginTop: '10px', border: 0, borderRadius: '8px', padding: '12px 16px', background: '#b7a6ff', color: '#17131f', fontWeight: 700 }}>Reload Breeze</button>
          </section>
        </main>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  document.body.innerHTML = '<main style="min-height:100vh;background:#0b0b10;color:white;padding:32px;font:16px system-ui">Breeze startup error: the #root element is missing from index.html.</main>';
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AppErrorBoundary>
        <App />
      </AppErrorBoundary>
    </React.StrictMode>
  );
}
