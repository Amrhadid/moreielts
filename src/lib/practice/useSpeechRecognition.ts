import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Browser speech-to-text for Speaking practice, via the Web Speech API.
 *
 * The transcript is what the AI grades, so it is shown live and can be edited
 * before grading. Chrome (desktop and Android) and Safari support the API;
 * Firefox does not, in which case the runner falls back to a typed transcript.
 * This mirrors the recogniser MoreTOEFL uses for its speaking drills.
 */

interface SpeechRecognitionAlternative {
  transcript: string;
}
interface SpeechRecognitionResult {
  0: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResult>;
}
interface SpeechRecognitionErrorEvent {
  error: string;
}
interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: (e: SpeechRecognitionEvent) => void;
  onerror: (e: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
}
interface SpeechRecognitionCtor {
  new (): SpeechRecognitionInstance;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  }
}

function getCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

function describeError(code: string): string {
  switch (code) {
    case "not-allowed":
    case "service-not-allowed":
      return "Microphone access was blocked. Allow the microphone for this site and try again.";
    case "no-speech":
      return "No speech was detected. Start again and speak clearly, close to the microphone.";
    case "audio-capture":
      return "No microphone was found. Connect one and try again.";
    case "network":
      return "Speech recognition needs an internet connection. Check your connection and try again.";
    default:
      return code
        ? `Speech recognition error (${code}). Please try again.`
        : "Speech recognition error. Please try again.";
  }
}

export interface SpeechRecognitionState {
  /** False on the server and in browsers without the API. */
  supported: boolean;
  listening: boolean;
  transcript: string;
  error: string | null;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export function useSpeechRecognition(): SpeechRecognitionState {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recogRef = useRef<SpeechRecognitionInstance | null>(null);
  // Chrome's engine stops itself after a pause; while the learner has not
  // pressed Stop we restart it so a long Part 2 turn is captured in full.
  const wantedRef = useRef(false);
  const finalRef = useRef("");

  useEffect(() => {
    // Resolved after mount so the server render and the first client render
    // agree, then the real capability is read.
    setSupported(Boolean(getCtor()));
    return () => {
      wantedRef.current = false;
      recogRef.current?.abort?.();
    };
  }, []);

  const spin = useCallback(() => {
    const Ctor = getCtor();
    if (!Ctor) return;
    const r = new Ctor();
    r.lang = "en-GB";
    r.continuous = true;
    r.interimResults = true;

    r.onresult = (event) => {
      // Rebuild from `results` every time rather than appending: some engines
      // re-deliver earlier final results, which an append would duplicate.
      let finals = "";
      let interim = "";
      for (let i = 0; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) finals += text + " ";
        else interim += text + " ";
      }
      setTranscript((finalRef.current + " " + finals + " " + interim).replace(/\s+/g, " ").trim());
      // Remember the session's finals so a restart does not lose them.
      r.onend = () => {
        finalRef.current = (finalRef.current + " " + finals).replace(/\s+/g, " ").trim();
        setTranscript(finalRef.current);
        if (wantedRef.current) spin();
        else setListening(false);
      };
    };
    r.onerror = (e) => {
      if (e.error === "aborted") return;
      if (e.error === "no-speech" && wantedRef.current) return; // onend restarts
      setError(describeError(e.error));
      wantedRef.current = false;
      setListening(false);
    };
    r.onend = () => {
      if (wantedRef.current) spin();
      else setListening(false);
    };

    try {
      r.start();
      recogRef.current = r;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start the microphone.");
      wantedRef.current = false;
      setListening(false);
    }
  }, []);

  const start = useCallback(() => {
    if (!getCtor()) {
      setError("Your browser does not support speech recognition. Use Chrome, or type your answer below.");
      return;
    }
    finalRef.current = "";
    setTranscript("");
    setError(null);
    wantedRef.current = true;
    setListening(true);
    spin();
  }, [spin]);

  const stop = useCallback(() => {
    wantedRef.current = false;
    recogRef.current?.stop?.();
    setListening(false);
  }, []);

  const reset = useCallback(() => {
    wantedRef.current = false;
    recogRef.current?.abort?.();
    finalRef.current = "";
    setTranscript("");
    setError(null);
    setListening(false);
  }, []);

  return { supported, listening, transcript, error, start, stop, reset };
}
