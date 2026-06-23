import { Tag } from "lucide-react";

export function PromoBox({ compact = false }: { compact?: boolean }) {
  const range = "20% OFF";

  return (
    <div className={`rounded-md overflow-hidden border border-border ${compact ? "text-[10px]" : "text-xs"}`}>
      <div className="flex items-center justify-between bg-foreground text-background px-3 py-2">
        <div className="flex items-center gap-2">
          <Tag className="w-3.5 h-3.5" />
          <span className="uppercase tracking-wider font-medium">Use code SMRDLZ20 at checkout for 20% off</span>
        </div>
        <span className="uppercase tracking-wider opacity-90">{range}</span>
      </div>
    </div>
  );
}
