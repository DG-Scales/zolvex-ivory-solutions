import { useEffect, useState } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "zolvex_shipping_banner_dismissed";

export function ShippingBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY) !== "1") setVisible(true);
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  return (
    <div className="relative bg-foreground text-[hsl(45,65%,62%)] border-b border-[hsl(45,65%,62%)]/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2 pr-10 text-center text-[11px] sm:text-xs tracking-wide leading-relaxed">
        Free shipping on all US orders · Most items deliver in 7–25 days · Larger or higher demand products may take up to 60 days
      </div>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[hsl(45,65%,62%)]/70 hover:text-[hsl(45,65%,62%)] transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
