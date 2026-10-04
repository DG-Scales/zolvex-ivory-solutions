import { Tag } from "lucide-react";

export function PromoBox({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`rounded-md overflow-hidden border border-border ${compact ? "text-[10px]" : "text-xs"}`}>
      <div className="flex items-center justify-between bg-foreground text-background px-3 py-2">
        <div className="flex items-center gap-2">
          <Tag className="w-3.5 h-3.5" />
          <span className="uppercase tracking-wider font-medium">Buy 2+, Save 15%</span>
        </div>
      </div>
      <div className="bg-background px-3 py-2">
        <span className="uppercase tracking-wider text-foreground">Mix &amp; match any 2+ pieces and save 15%.</span>
      </div>
    </div>
  );
}
