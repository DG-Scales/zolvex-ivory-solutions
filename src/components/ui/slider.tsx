import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center py-2 group",
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-foreground/10 transition-all duration-300 group-hover:h-[6px]">
      <SliderPrimitive.Range className="absolute h-full rounded-full bg-gradient-to-r from-foreground/70 to-foreground transition-all duration-300" />
    </SliderPrimitive.Track>
    {(Array.isArray(props.value) ? props.value : props.defaultValue ?? [0]).map(
      (_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          className={cn(
            "relative block h-5 w-5 rounded-full border border-foreground/20 bg-background",
            "shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.08)]",
            "transition-[transform,box-shadow,border-color] duration-200 ease-out",
            "hover:scale-110 hover:border-foreground/40",
            "active:scale-95 active:cursor-grabbing cursor-grab",
            "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-foreground/10",
            "disabled:pointer-events-none disabled:opacity-50",
            "before:absolute before:inset-1.5 before:rounded-full before:bg-foreground/80 before:transition-colors",
          )}
        />
      ),
    )}
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
