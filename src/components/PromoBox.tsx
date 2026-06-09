import { Tag, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Discount = { label: string; code: string };

const DISCOUNTS: Discount[] = [
  { label: "20% OFF ALL ORDERS", code: "SMRDLZ20" },
];

export function PromoBox({ compact = false }: { compact?: boolean }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    toast.success(`Code ${code} copied`);
    setTimeout(() => setCopied(null), 1500);
  };

  const range = "20% OFF";

  return (
    <div className={`rounded-md overflow-hidden border border-border ${compact ? "text-[10px]" : "text-xs"}`}>
      <div className="flex items-center justify-between bg-foreground text-background px-3 py-2">
        <div className="flex items-center gap-2">
          <Tag className="w-3.5 h-3.5" />
          <span className="uppercase tracking-wider font-medium">Summer Special Promotion</span>
        </div>
        <span className="uppercase tracking-wider opacity-90">{range}</span>
      </div>
      <div className="bg-background divide-y divide-border">
        {DISCOUNTS.map((d) => (
          <div key={d.code} className="flex items-center justify-between gap-2 px-3 py-2">
            <span className="uppercase tracking-wider text-foreground">{d.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Code: <span className="text-foreground font-medium">{d.code}</span></span>
              <button
                type="button"
                onClick={() => copy(d.code)}
                className="inline-flex items-center gap-1 bg-foreground text-background px-2 py-1 rounded hover:opacity-90 transition-opacity"
              >
                {copied === d.code ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span className="uppercase tracking-wider text-[10px]">{copied === d.code ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
