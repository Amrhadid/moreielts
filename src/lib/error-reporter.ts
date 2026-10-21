import { supabase } from "./supabase";

/**
 * Sends uncaught errors and unhandled rejections to public.client_errors
 * (migration 0010), where /admin/analytics lists them. Deliberately tiny: no
 * vendor, a per-page cap, and duplicate messages are sent once.
 */
const MAX_PER_PAGE = 10;
let sent = 0;
const seen = new Set<string>();

function report(message: string, stack?: string) {
  if (sent >= MAX_PER_PAGE || seen.has(message)) return;
  // Noise from browser extensions and aborted fetches tells us nothing.
  if (/ResizeObserver loop|Script error\.|AbortError|chrome-extension:/i.test(message + (stack ?? ""))) return;
  seen.add(message);
  sent++;
  void supabase.from("client_errors").insert({
    message: message.slice(0, 2000),
    stack: stack?.slice(0, 8000) ?? null,
    url: window.location.href.slice(0, 1000),
    user_agent: navigator.userAgent.slice(0, 500),
  });
}

export function installErrorReporter() {
  if (typeof window === "undefined" || import.meta.env.DEV) return;
  window.addEventListener("error", (event) => {
    report(String(event.message || event.error), event.error?.stack);
  });
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    report(reason instanceof Error ? reason.message : String(reason), reason?.stack);
  });
}

export function registerServiceWorker() {
  if (typeof window === "undefined" || import.meta.env.DEV || !("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // An unsupported or blocked worker just means no offline support.
    });
  });
}
