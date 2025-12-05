import React, { useEffect, useRef, useState } from 'react';
import './App.css';

import Editor from './components/Editor';
import TypewriterDisplay from './components/TypewriterDisplay';
import TypewriterControls from './components/TypewriterControls';
import { saveToLocalStorage, loadFromLocalStorage, removeFromLocalStorage } from './utils/localStorage';

// Optionally, you could use './hooks/useTypewriter', but we preserve similar logic inline for full control
const STORAGE_KEY = 'tw_text';
const STORAGE_SPEED_KEY = 'tw_speed';
const DEFAULT_TYPE_SPEED = 40; // ms per character
const MIN_TYPE_SPEED = 15;
const MAX_TYPE_SPEED = 150;
const CARET_BLINK_MS = 480;

function getEnvVar(key, fallback) {
  return process.env[key] !== undefined ? process.env[key] : fallback;
}

// PUBLIC_INTERFACE
function App() {
  const [text, setText] = useState('');
  const [typeSpeed, setTypeSpeed] = useState(DEFAULT_TYPE_SPEED);
  const [displayed, setDisplayed] = useState('');
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [caretVisible, setCaretVisible] = useState(true);
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState('');
  const timerRef = useRef(null);
  const caretRef = useRef(null);

  // Health check to backend, if REACT_APP_BACKEND_URL set (optional, non-blocking)
  useEffect(() => {
    const backendUrl = getEnvVar('REACT_APP_BACKEND_URL', '');
    if (backendUrl) {
      fetch(`${backendUrl.replace(/\/$/, '')}/health/`)
        .then(() => {}) // ignore
        .catch(() => {}); // ignore
    }
  }, []);

  // On mount: restore text and speed from storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = loadFromLocalStorage(STORAGE_KEY);
      setText(saved);
      const speed = Number(loadFromLocalStorage(STORAGE_SPEED_KEY) || DEFAULT_TYPE_SPEED);
      setTypeSpeed(
        isNaN(speed) ? DEFAULT_TYPE_SPEED : Math.max(MIN_TYPE_SPEED, Math.min(speed, MAX_TYPE_SPEED))
      );
    }
  }, []);

  // Caret blink
  useEffect(() => {
    caretRef.current = setInterval(() => setCaretVisible(v => !v), CARET_BLINK_MS);
    return () => clearInterval(caretRef.current);
  }, []);

  // Typewriter animation
  useEffect(() => {
    // only animate if playing and index < text.length
    if (playing && index < text.length) {
      timerRef.current = setTimeout(() => {
        setDisplayed((prev) => prev + text[index]);
        setIndex((i) => i + 1);
      }, Math.max(MIN_TYPE_SPEED, Math.min(typeSpeed, MAX_TYPE_SPEED)));
    } else if (!playing && timerRef.current) {
      clearTimeout(timerRef.current);
    } else if (index >= text.length) {
      setPlaying(false);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [playing, index, text, typeSpeed]);

  // Reset animation when text changes
  useEffect(() => {
    setDisplayed('');
    setIndex(0);
    setPlaying(false);
  }, [text]);

  // Status messages auto-clear
  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(''), 1700);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Actions
  const handleEdit = (e) => setText(e.target.value);

  const handleSave = () => {
    if (saveToLocalStorage(STORAGE_KEY, text)) {
      saveToLocalStorage(STORAGE_SPEED_KEY, String(typeSpeed));
      setStatus('Saved!');
      setStatusType('success');
    } else {
      setStatus('Could not save');
      setStatusType('error');
    }
  };
  const handleLoad = () => {
    setText(loadFromLocalStorage(STORAGE_KEY));
    setTypeSpeed(
      Math.max(
        MIN_TYPE_SPEED,
        Math.min(Number(loadFromLocalStorage(STORAGE_SPEED_KEY) || DEFAULT_TYPE_SPEED), MAX_TYPE_SPEED)
      )
    );
    setStatus('Loaded.');
    setStatusType('info');
  };
  const handleClear = () => {
    setText('');
    setDisplayed('');
    setIndex(0);
    setPlaying(false);
    removeFromLocalStorage(STORAGE_KEY);
    removeFromLocalStorage(STORAGE_SPEED_KEY);
    setStatus('Cleared.');
    setStatusType('info');
  };

  const handleTypewriterPlay = () => {
    setDisplayed('');
    setIndex(0);
    setPlaying(true);
  };
  const handlePause = () => setPlaying(false);
  const handleReset = () => {
    setDisplayed('');
    setIndex(0);
    setPlaying(false);
  };
  const handleSpeedChange = (e) => {
    const value = Number(e.target.value);
    setTypeSpeed(value);
    saveToLocalStorage(STORAGE_SPEED_KEY, String(value));
  };

  // -- Main Render --
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(120deg,#f9fafb 60%,#ecf5ff 100%)',
        color: '#111827',
        fontFamily: "'Inter', system-ui, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
      }}
    >
      <header
        style={{
          padding: '2rem 0 1.2rem 0',
          background: 'linear-gradient(90deg, #2563eb0a 70%, #f9fafb 90%)',
          textAlign: 'center',
          borderBottom: '1px solid #e0e7ef',
          boxShadow: '0 4px 16px 0 rgba(37,99,235,0.03)',
        }}
        role="banner"
      >
        <h1 style={{
          margin: 0,
          fontWeight: 900,
          fontSize: '2.15rem',
          letterSpacing: '-.03em',
          color: '#2563EB',
        }}>
          Typewriter Text Editor
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#374151',
          marginTop: '.3em',
          marginBottom: '.1em',
          fontWeight: 430
        }}>Craft your text with ocean style and vintage typewriter flair.</p>
      </header>
      <main style={{
        flexGrow: 1,
        width: '100%',
        maxWidth: 680,
        margin: '0 auto',
        padding: '28px 8px 0 8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        background: 'transparent'
      }}>
        {/* Editor with save/load/clear */}
        <Editor text={text} onChange={handleEdit} />
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          gap: 8,
          marginBottom: 15,
        }}>
          <button
            style={{
              background: 'linear-gradient(90deg, #2563EB, #3181f7 92%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(37,99,235,0.07)',
              padding: '11px 22px',
              fontWeight: 600,
              fontSize: '1em',
              marginRight: 12,
              cursor: 'pointer',
              transition: 'opacity .2s, box-shadow .2s',
            }}
            onClick={handleSave}
          >
            Save
          </button>
          <button
            style={{
              background: 'linear-gradient(90deg, #F59E0B, #fde68a 90%)',
              color: '#111827',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(245,158,11,0.09)',
              padding: '11px 22px',
              fontWeight: 600,
              fontSize: '1em',
              marginRight: 12,
              cursor: 'pointer',
              transition: 'opacity .2s, box-shadow .2s',
            }}
            onClick={handleLoad}
          >
            Load
          </button>
          <button
            style={{
              background: 'linear-gradient(90deg, #EF4444, #fca5a5 90%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '11px 22px',
              fontWeight: 600,
              fontSize: '1em',
              marginRight: 0,
              boxShadow: '0 2px 8px rgba(239,68,68,0.09)',
              cursor: 'pointer',
              transition: 'opacity .2s, box-shadow .2s',
            }}
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
        {/* Controls */}
        <TypewriterControls
          playing={playing}
          disabled={text.length === 0}
          onPlay={handleTypewriterPlay}
          onPause={handlePause}
          onReset={handleReset}
          onSpeedChange={handleSpeedChange}
          speed={typeSpeed}
          minSpeed={MIN_TYPE_SPEED}
          maxSpeed={MAX_TYPE_SPEED}
        />
        {/* Typewriter Preview */}
        <TypewriterDisplay
          displayed={displayed}
          showCaret={caretVisible}
          isPlaying={playing}
          fullText={text}
        />
        {/* Status */}
        {status && (
          <div
            role="status"
            aria-live="polite"
            style={{
              margin: '16px 3px 0 3px',
              fontWeight: 500,
              color:
                statusType === 'success' ? '#2563EB' :
                  statusType === 'error' ? '#EF4444' :
                  '#F59E0B',
              background:
                statusType === 'success' ? '#dbeafe' :
                  statusType === 'error' ? '#fee2e2' :
                  '#fef9c3',
              borderRadius: 7,
              padding: '.41em 1.1em',
              border: '1px solid #e5e7eb',
              minHeight: 25,
              textAlign: 'center',
              fontSize: '1rem',
              boxShadow: '0 2px 8px 0 rgba(0,0,0,.06)'
            }}
          >
            {status}
          </div>
        )}
      </main>
      <footer
        style={{
          marginTop: 'auto',
          fontSize: '1em',
          fontWeight: 430,
          textAlign: 'center',
          color: '#64748b',
          background: 'linear-gradient(90deg, #f9fafb 80%, #2563eb0a 100%)',
          padding: '1.3rem 0 0.8rem 0',
          borderTop: '1px solid #e0e7ef',
          boxShadow: '0 -4px 16px 0 rgba(37,99,235,0.03)',
        }}
      >
        <span>Typewriter Text Editor &copy; {new Date().getFullYear()} &ndash; Powered by <span style={{ color: '#2563EB' }}>Ocean Professional</span></span>
      </footer>
    </div>
  );
}

export default App;
