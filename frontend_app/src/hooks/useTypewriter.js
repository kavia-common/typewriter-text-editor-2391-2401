import { useEffect, useRef, useState } from "react";

/**
 * useTypewriter handles typewriter animation logic and state.
 * @param {string} text Full text to animate
 * @param {number} typeSpeed Milliseconds per character
 * @param {boolean} playing Whether animation should run
 * @returns state: displayed, playing, index; controls: play, pause, reset
 */
 // PUBLIC_INTERFACE
export default function useTypewriter(text, typeSpeed, playing) {
  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(playing);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isPlaying && index < text.length) {
      timerRef.current = setTimeout(() => {
        setDisplayed((prev) => prev + text[index]);
        setIndex((i) => i + 1);
      }, typeSpeed);
    }
    if (!isPlaying && timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (index >= text.length) {
      setIsPlaying(false);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, index, text, typeSpeed]);

  // If text changes, reset preview state
  useEffect(() => {
    setDisplayed("");
    setIndex(0);
    setIsPlaying(false);
  }, [text]);

  // Exposed controls
  function play() {
    setDisplayed("");
    setIndex(0);
    setIsPlaying(true);
  }
  function pause() {
    setIsPlaying(false);
  }
  function reset() {
    setDisplayed("");
    setIndex(0);
    setIsPlaying(false);
  }

  return {
    displayed,
    playing: isPlaying,
    index,
    play,
    pause,
    reset,
  };
}
