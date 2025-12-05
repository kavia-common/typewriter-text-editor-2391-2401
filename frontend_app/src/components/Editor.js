import React from "react";

/**
 * Editor component for main text input.
 * @param {string} text Value of textarea
 * @param {Function} onChange onChange handler
 */
 // PUBLIC_INTERFACE
function Editor({ text, onChange }) {
  return (
    <fieldset
      style={{
        border: "none",
        margin: "0 0 15px 0",
        padding: 0,
        borderRadius: 14,
        boxShadow: "0 1px 8px 1px rgba(37,99,235,.08)",
      }}
    >
      <label
        htmlFor="editor"
        style={{
          fontWeight: 600,
          color: "#2563EB",
          letterSpacing: ".01em",
          fontSize: 18,
          marginBottom: 3,
          display: "block"
        }}
      >
        Edit Text
      </label>
      <textarea
        id="editor"
        value={text}
        onChange={onChange}
        placeholder="Type here..."
        rows={6}
        style={{
          fontFamily: "'JetBrains Mono', 'Menlo', monospace",
          width: "100%",
          backgroundColor: "#fff",
          color: "#22223b",
          border: "1px solid #c7d2fe",
          borderRadius: 8,
          padding: "13px 14px",
          fontSize: "1.09rem",
          resize: "vertical",
          boxShadow: "0 1px 2px rgba(37,99,235,0.03)",
          transition: "border .17s, box-shadow .21s",
          marginBottom: 5
        }}
        maxLength={3000}
        aria-label="Text editor"
        autoComplete="off"
        data-testid="editor-area"
      />
    </fieldset>
  );
}

export default Editor;
