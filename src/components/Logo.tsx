export function Logo({ size = "md", showTagline = false }: { size?: "sm" | "md" | "lg" | "xl"; showTagline?: boolean }) {
  const sizes = {
    sm: "text-2xl tracking-[0.35em]",
    md: "text-3xl tracking-[0.4em]",
    lg: "text-6xl tracking-[0.4em]",
    xl: "text-7xl md:text-8xl tracking-[0.4em]",
  };
  const taglineSizes = {
    sm: "text-[8px] tracking-[0.3em]",
    md: "text-[10px] tracking-[0.35em]",
    lg: "text-xs tracking-[0.4em]",
    xl: "text-sm tracking-[0.5em]",
  };
  return (
    <div className="flex flex-col items-center leading-none select-none">
      <span className={`font-display ${sizes[size]} text-foreground`}>ZOLVEX</span>
      {showTagline && (
        <span className={`mt-3 uppercase text-muted-foreground ${taglineSizes[size]}`}>
          Premium problem solving
        </span>
      )}
    </div>
  );
}
