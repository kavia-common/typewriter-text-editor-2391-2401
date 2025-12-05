import React from "react";

/**
 * TypewriterDisplay renders the animated typewriter effect with caret.
 * @param {string} displayed Current visible text
 * @param {boolean} showCaret Whether caret is visible
 * @param {boolean} isPlaying Whether animation is playing
 * @param {string} fullText Full text for comparison (determines caret)
 */
 // PUBLIC_INTERFACE
function TypewriterDisplay({ displayed, showCaret, isPlaying, fullText }) {
  return (
    <div
      style={{
        border: "1.5px solid #a5b4fc",
        background: "linear-gradient(90deg, #f1f5f9 95%, #e0edfa 100%)",
        minHeight: 67,
        borderRadius: 11,
        margin: "2px 0 0 0",
        fontFamily: "'JetBrains Mono', Menlo, monospace",
        fontSize: "1.17em",
        padding: "18px 16px 14px 16px",
        color: "#111827",
        position: "relative",
        whiteSpace: "pre-line",
        boxShadow: "0 3px 12px 0 rgba(37,99,235,0.01)",
        letterSpacing: ".005em",
        transition: "box-shadow 0.2s, border 0.18s"
      }}
      aria-live={isPlaying ? "polite" : "off"}
      tabIndex={0}
      data-testid="display-area"
    >
      {displayed}
      {(isPlaying || (displayed.length !== 0 && displayed !== fullText)) && (
        <span
          style={{
            opacity: showCaret ? 1 : 0,
            borderLeft: "2px solid #2563EB",
            marginLeft: 1,
            height: "1.2em",
            display: "inline-block",
            verticalAlign: "bottom"
          }}
          aria-hidden="true"
          data-testid="caret"
        >&#8203;</span>
      )}
    </div>
  );
}

export default TypewriterDisplay;
