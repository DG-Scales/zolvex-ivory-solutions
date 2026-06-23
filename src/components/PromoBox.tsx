import { Tag } from "lucide-react";

export function PromoBox({ compact = false }: { compact?: boolean }) {
  const range = "20% OFF";

  return (
    <div className={`rounded-md overflow-hidden border border-border ${compact ? "text-[10px]" : "text-xs"}`}>
      <div className="flex items-center justify-between bg-foreground text-background px-3 py-2">
        <div className="flex items-center gap-2">
          <Tag className="w-3.5 h-3.5" />
          <span className="uppercase tracking-wider font-medium">20% off storewide sale</span>
        </div>
        <span className="uppercase tracking-wider opacity-90">{range}</span>
      </div>
      <div className="bg-background px-3 py-2">
        <span className="uppercase tracking-wider text-foreground">Get 20% off at checkout with code SMRDLZ20</span>
      </div>
    </div>
  );
}
