import { useEffect, useRef, useState } from "react";

export function useTimer(start: number = 0) {
  const [seconds, setSeconds] = useState(start);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return seconds;
}
