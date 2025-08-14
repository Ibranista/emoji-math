import { useEffect, useRef, useState } from "react";

export function useTimer(start: number = 10, onComplete?: () => void) {
  const [seconds, setSeconds] = useState(start);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Start countdown
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          if (onComplete) onComplete(); // trigger when it hits 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return seconds;
}
