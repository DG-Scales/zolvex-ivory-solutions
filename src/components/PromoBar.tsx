import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MESSAGES = [
  "Free shipping on all U.S. orders · Worldwide delivery",
  "GET 20% OFF WITH CODE SMRDLZ20",
];

export function PromoBar() {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const restartTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 5000);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const goNext = () => {
    setIndex((i) => (i + 1) % MESSAGES.length);
    restartTimer();
  };

  const goPrev = () => {
    setIndex((i) => (i - 1 + MESSAGES.length) % MESSAGES.length);
    restartTimer();
  };

  return (
    <div className="relative bg-foreground text-background text-[11px] uppercase tracking-[0.25em] px-4">
      <button
        onClick={goPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full hover:bg-background/10 transition-colors cursor-pointer"
        aria-label="Previous promotion"
      >
        <ChevronLeft size={14} />
      </button>

      <div className="overflow-hidden mx-6">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {MESSAGES.map((msg) => (
            <div key={msg} className="w-full flex-shrink-0 py-2.5 text-center">
              {msg}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={goNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full hover:bg-background/10 transition-colors cursor-pointer"
        aria-label="Next promotion"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
