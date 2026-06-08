export function Logo({ size = "md", showTagline = false, tone = "dark" }: { size?: "sm" | "md" | "lg" | "xl"; showTagline?: boolean; tone?: "dark" | "light" }) {
  const sizes = {
    sm: "text-xl tracking-[0.18em]",
    md: "text-2xl tracking-[0.2em]",
    lg: "text-5xl tracking-[0.22em]",
    xl: "text-6xl md:text-7xl tracking-[0.22em]",
  };
  const taglineSizes = {
    sm: "text-[8px] tracking-[0.25em]",
    md: "text-[10px] tracking-[0.28em]",
    lg: "text-xs tracking-[0.3em]",
    xl: "text-sm tracking-[0.35em]",
  };
  const mainColor = tone === "light" ? "text-background" : "text-foreground";
  const subColor = tone === "light" ? "text-background/70" : "text-muted-foreground";
  return (
    <div className={`flex flex-col ${showTagline ? "items-center" : "items-start"} leading-none select-none`}>
      <span className={`font-logo ${sizes[size]} ${mainColor}`}>ZOLVEX</span>
      {showTagline && (
        <span className={`mt-2 uppercase ${subColor} ${taglineSizes[size]} text-center`}>
          Where Design Comes to Light
        </span>
      )}
    </div>
  );
}
