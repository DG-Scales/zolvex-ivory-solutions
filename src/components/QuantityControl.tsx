import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

export function QuantityControl({
  quantity,
  onChange,
  size = "sm",
}: {
  quantity: number;
  onChange: (q: number) => void;
  size?: "sm" | "md";
}) {
  const [value, setValue] = useState(String(quantity));

  useEffect(() => {
    setValue(String(quantity));
  }, [quantity]);

  const commit = () => {
    const n = Math.max(1, Math.floor(Number(value) || 0));
    if (n !== quantity) onChange(n);
    setValue(String(n));
  };

  const btnClass = size === "md" ? "h-8 w-8" : "h-7 w-7";
  const inputClass = size === "md" ? "w-10" : "w-8";

  return (
    <div className="inline-flex items-center border rounded-full">
      <Button
        variant="ghost"
        size="icon"
        className={`${btnClass} rounded-full`}
        onClick={() => onChange(Math.max(1, quantity - 1))}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={(e) => setValue(e.target.value.replace(/[^0-9]/g, ""))}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.currentTarget.blur();
          }
        }}
        onFocus={(e) => e.currentTarget.select()}
        className={`${inputClass} text-center text-sm bg-transparent outline-none focus:ring-1 focus:ring-ring rounded tabular-nums`}
        aria-label="Quantity"
      />
      <Button
        variant="ghost"
        size="icon"
        className={`${btnClass} rounded-full`}
        onClick={() => onChange(quantity + 1)}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}
