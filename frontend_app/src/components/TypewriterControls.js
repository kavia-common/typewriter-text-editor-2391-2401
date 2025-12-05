import React from "react";

/**
 * TypewriterControls renders control buttons and slider for the typewriter effect.
 * @param {boolean} playing Whether animation is playing
 * @param {boolean} disabled If play/reset should be disabled (empty text/etc)
 * @param {Function} onPlay Triggers playback
 * @param {Function} onPause Pauses animation
 * @param {Function} onReset Restarts/clears animation
 * @param {Function} onSpeedChange Updates speed
 * @param {number} speed Current speed (ms/char)
 * @param {number} minSpeed Minimum speed allowed
 * @param {number} maxSpeed Maximum speed allowed
 */
 // PUBLIC_INTERFACE
function TypewriterControls({
  playing,
  disabled,
  onPlay,
  onPause,
  onReset,
  onSpeedChange,
  speed,
  minSpeed,
  maxSpeed
}) {
  // Theme for buttons
  const btnPrimary = {
    background: "linear-gradient(90deg, #2563EB, #3181f7 92%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(37,99,235,0.07)",
    padding: "10px 19px",
    fontWeight: 600,
    fontSize: "1em",
    marginRight: 14,
    cursor: "pointer",
    transition: "opacity .2s, box-shadow .2s"
  };
  const btnSecondary = {
    background: "linear-gradient(90deg, #F59E0B, #fde68a 90%)",
    color: "#111827",
    border: "none",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(245,158,11,0.09)",
    padding: "10px 19px",
    fontWeight: 600,
    fontSize: "1em",
    marginRight: 5,
    cursor: "pointer",
    transition: "opacity .2s, box-shadow .2s"
  };

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      margin: "10px 0 10px 0"
    }}>
      <button
        style={{
          ...btnPrimary,
          opacity: playing ? 0.8 : 1
        }}
        onClick={playing ? onPause : onPlay}
        disabled={disabled}
        aria-label={playing ? "Pause animation" : "Start animation"}
        tabIndex={0}
      >
        {playing ? "Pause" : "Play"}
      </button>
      <button
        style={btnSecondary}
        onClick={onReset}
        disabled={disabled}
        aria-label="Reset typewriter"
      >
        Reset
      </button>
      <label style={{ marginLeft: 13, color: "#2563EB", fontWeight: 600 }}>
        Speed:
      </label>
      <input
        type="range"
        min={minSpeed}
        max={maxSpeed}
        step={1}
        value={speed}
        onChange={onSpeedChange}
        style={{ marginLeft: 8, marginRight: 5, verticalAlign: "middle" }}
        aria-label="Typing Speed"
      />
      <span style={{
        marginLeft: 4,
        color: "#374151",
        fontSize: "0.95em"
      }}>
        {Math.round(1000 / speed)} cps
      </span>
    </div>
  );
}

export default TypewriterControls;
