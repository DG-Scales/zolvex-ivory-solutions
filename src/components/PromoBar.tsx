import { useEffect, useState } from "react";

const MESSAGES = [
  "Free shipping on all U.S. orders · Worldwide delivery",
  "Limited summer discount — All orders 20% off with code SMRDLZ20",
];

export function PromoBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-foreground text-background text-[11px] uppercase tracking-[0.25em] py-2.5 text-center px-4 overflow-hidden">
      <div key={index} className="animate-fade-in">
        {MESSAGES[index]}
      </div>
    </div>
  );
}
