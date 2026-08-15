import { useEffect, useRef, useState } from "react";

/**
 * A one-way countdown for the test players. Ticks once a second and stops at
 * zero. `onExpire` fires exactly once.
 */
export function useCountdown(seconds: number, onExpire?: () => void) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(true);
  const expired = useRef(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          if (!expired.current) {
            expired.current = true;
            onExpireRef.current?.();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  return { remaining, running, pause: () => setRunning(false), resume: () => setRunning(true) };
}
