import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectSeconds, setSeconds } from "@/store/feature/timerSlice";

export function useCountdown(initialSeconds: number, onComplete?: () => void) {
  const dispatch = useDispatch();
  const seconds = useSelector(selectSeconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startCountdown = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    dispatch(setSeconds(initialSeconds));

    intervalRef.current = setInterval(() => {
      if (seconds > 0) {
        dispatch(setSeconds(seconds - 1));
      } else {
        clearInterval(intervalRef.current!);
        if (onComplete) onComplete();
      }
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return {
    seconds,
    startCountdown,
    clearCountdown: () => clearInterval(intervalRef.current!),
  };
}
