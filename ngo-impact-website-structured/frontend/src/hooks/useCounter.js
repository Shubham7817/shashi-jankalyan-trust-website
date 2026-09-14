import { useEffect, useState } from "react";
export default function useCounter(value) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const end = Number(String(value).replace(/\D/g, ""));
    let i = 0;
    const timer = setInterval(() => {
      i = Math.min(end, i + Math.ceil(end / 40));
      setN(i);
      if (i >= end) clearInterval(timer);
    }, 25);
    return () => clearInterval(timer);
  }, [value]);
  return n;
}
