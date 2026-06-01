import { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function PageShell({ eyebrow, title, lead, children }: { eyebrow?: string; title: string; lead?: string; children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-3xl px-6 py-20 md:py-28 w-full">
        {eyebrow && <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">{eyebrow}</p>}
        <h1 className="font-display text-5xl md:text-6xl mb-6">{title}</h1>
        {lead && <p className="text-lg text-muted-foreground mb-12 leading-relaxed">{lead}</p>}
        <div className="space-y-8 text-foreground/90 leading-relaxed">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}
