import React, { useEffect, useRef, useState } from 'react';
import './App.css';

/*
  Ocean Professional Theme:
  Primary: #2563EB (blue), Secondary: #F59E0B (amber), Error: #EF4444,
  Background: #f9fafb, Surface: #ffffff, Text: #111827,
  Gradient: from-blue-500/10 to-gray-50
*/

const STORAGE_KEY = 'tw_text';

const DEFAULT_TYPE_SPEED = 40;  // ms per character
const MIN_TYPE_SPEED = 15;
const MAX_TYPE_SPEED = 150;
const CARET_BLINK_MS = 480;

// Helpers for env - uses REACT_APP_* if available, else fallback
function getEnvVar(key, fallback) {
  return process.env[key] !== undefined ? process.env[key] : fallback;
}

// PUBLIC_INTERFACE
function App() {
  // Editor state
  const [text, setText] = useState('');
  // Typewriter display state
  const [displayed, setDisplayed] = useState('');
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [typeSpeed, setTypeSpeed] = useState(DEFAULT_TYPE_SPEED);
  const [caretVisible, setCaretVisible] = useState(true);
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState(''); // 'success', 'error', 'info'
  const timerRef = useRef(null);
  const caretRef = useRef(null);

  // -- Effect: Typewriter Animation --
  useEffect(() => {
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

  // -- Caret blink effect --
  useEffect(() => {
    caretRef.current = setInterval(() => setCaretVisible(v => !v), CARET_BLINK_MS);
    return () => clearInterval(caretRef.current);
  }, []);

  // -- When text changes: reset typewriter state
  useEffect(() => {
    setDisplayed('');
    setIndex(0);
    setPlaying(false);
  }, [text]);

  // -- Status messages auto-clear
  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(''), 1700);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Controls
  const handleSave = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, text);
      setStatus('Saved!');
      setStatusType('success');
    } catch (err) {
      setStatus('Could not save');
      setStatusType('error');
    }
  };
  const handleLoad = () => {
    try {
      const loaded = window.localStorage.getItem(STORAGE_KEY) || '';
      setText(loaded);
      setStatus('Loaded.');
      setStatusType('info');
    } catch (err) {
      setStatus('Could not load');
      setStatusType('error');
    }
  };
  const handleClear = () => {
    setText('');
    setDisplayed('');
    setIndex(0);
    setPlaying(false);
    window.localStorage.removeItem(STORAGE_KEY);
    setStatus('Cleared.');
    setStatusType('info');
  };

  const handleEdit = (e) => {
    setText(e.target.value);
  };

  const handleTypewriterPlay = () => {
    setDisplayed('');
    setIndex(0);
    setPlaying(true);
  };

  const handlePause = () => {
    setPlaying(false);
  };

  const handleSpeedChange = (e) => {
    setTypeSpeed(Number(e.target.value));
  };

  // Theme colors for button styles from Ocean Professional
  const btnPrimary = {
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
  };
  const btnSecondary = {
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
  };
  const btnClear = {
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
  };
  // Compose Caret for animated display
  const Caret = () => (
    <span
      style={{
        opacity: caretVisible ? 1 : 0,
        borderLeft: '2px solid #2563EB',
        marginLeft: 1,
        height: '1.2em',
        display: 'inline-block',
        verticalAlign: 'bottom',
        animation: 'none',
      }}
      aria-hidden="true"
    >&#8203;</span>
  );

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
        {/* Editor */}
        <fieldset style={{
          border: 'none',
          margin: '0 0 15px 0',
          padding: 0,
          borderRadius: 14,
          boxShadow: '0 1px 8px 1px rgba(37,99,235,.08)',
        }}>
          <label htmlFor="editor" style={{
            fontWeight: 600,
            color: '#2563EB',
            letterSpacing: '.01em',
            fontSize: 18,
            marginBottom: 3,
            display: 'block'
          }}>Edit Text</label>
          <textarea
            id="editor"
            value={text}
            onChange={handleEdit}
            placeholder="Type here..."
            rows={6}
            style={{
              fontFamily: "'JetBrains Mono', 'Menlo', monospace",
              width: '100%',
              backgroundColor: '#fff',
              color: '#22223b',
              border: '1px solid #c7d2fe',
              borderRadius: 8,
              padding: '13px 14px',
              fontSize: '1.09rem',
              resize: 'vertical',
              boxShadow: '0 1px 2px rgba(37,99,235,0.03)',
              transition: 'border .17s, box-shadow .21s',
              marginBottom: 5,
            }}
            maxLength={3000}
            aria-label="Text editor"
            autoComplete="off"
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              gap: 8,
              marginBottom: 6,
            }}
          >
            <button style={btnPrimary} onClick={handleSave}>Save</button>
            <button style={btnSecondary} onClick={handleLoad}>Load</button>
            <button style={btnClear} onClick={handleClear}>Clear</button>
          </div>
        </fieldset>
        {/* Typewriter Controls */}
        <section style={{
          margin: '9px 0 0 0',
          padding: '18px 19px',
          background: 'linear-gradient(100deg, #fff 90%, #f1f7fa 100%)',
          borderRadius: 13,
          boxShadow: '0 2px 13px 0 rgba(37,99,235,0.067)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 7 }}>
            <h2 style={{
              fontSize: '1.15rem',
              fontWeight: 600,
              color: '#2563EB',
              margin: 0,
              marginRight: 11,
              letterSpacing: '.02em',
            }}>Typewriter Preview</h2>
            <button
              style={{
                ...btnPrimary,
                padding: '7px 18px',
                fontSize: '0.97em',
                marginRight: 8,
                opacity: playing ? 0.75 : 1
              }}
              onClick={playing ? handlePause : handleTypewriterPlay}
              aria-label={playing ? "Pause" : "Play"}
              disabled={text.length === 0}
              tabIndex={0}
            >
              {playing ? 'Pause' : 'Play'}
            </button>
            <label style={{ marginLeft: 9, color: '#2563EB', fontWeight: 600 }}>Speed:</label>
            <input
              type="range"
              min={MIN_TYPE_SPEED}
              max={MAX_TYPE_SPEED}
              step={1}
              value={typeSpeed}
              onChange={handleSpeedChange}
              style={{ marginLeft: 8, marginRight: 5, verticalAlign: 'middle' }}
              aria-label="Typing Speed"
            />
            <span style={{
              marginLeft: 2,
              color: '#374151',
              fontSize: '0.95em'
            }}>
              {Math.round(1000/typeSpeed)} cps
            </span>
          </div>
          <div
            style={{
              border: '1.5px solid #a5b4fc',
              background: 'linear-gradient(90deg, #f1f5f9 95%, #e0edfa 100%)',
              minHeight: 67,
              borderRadius: 11,
              margin: '2px 0 0 0',
              fontFamily: "'JetBrains Mono', Menlo, monospace",
              fontSize: '1.17em',
              padding: '18px 16px 14px 16px',
              color: '#111827',
              position: 'relative',
              whiteSpace: 'pre-line',
              boxShadow: '0 3px 12px 0 rgba(37,99,235,0.01)',
              letterSpacing: '.005em'
            }}
            aria-live={playing ? 'polite' : 'off'}
          >
            {displayed}
            {(playing || (displayed.length !== 0 && displayed !== text)) &&
              <Caret />
            }
          </div>
        </section>
        {/* Status message */}
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
