import { useCallback, useEffect, useRef, useState } from "react";

export function useCooldown(seconds: number = 60) {
  const [remaining, setRemaining] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => clear, [clear]);

  const start = useCallback(() => {
    clear();
    setRemaining(seconds);
    timerRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clear();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [seconds, clear]);

  useEffect(() => {
    if (remaining === 0) clear();
  }, [remaining, clear]);

  return {
    remaining,
    isReady: remaining === 0,
    start,
  };
}
