import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Journal — Zolvex" },
      { name: "description", content: "Notes on light, craft, and the fixtures that shape a room." },
      { property: "og:title", content: "Journal — Zolvex" },
      { property: "og:description", content: "Field notes on light and craft." },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="Journal"
      title="Notes on light."
      lead="Short essays on lighting design, materials, and the rooms we like to come home to."
    >
      <article className="border-b border-border/60 pb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Essay · Coming soon</p>
        <h2 className="font-display text-3xl mb-3">On layered light.</h2>
        <p>Why one ceiling fixture rarely does enough — and how ambient, task, and accent layers quietly transform a space.</p>
      </article>
      <article className="border-b border-border/60 pb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Field note · Coming soon</p>
        <h2 className="font-display text-3xl mb-3">In the glasshouse.</h2>
        <p>A visit to one of the workshops whose hand-blown shades quietly find their way into the Zolvex collection.</p>
      </article>
      <article>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Guide · Coming soon</p>
        <h2 className="font-display text-3xl mb-3">Choosing a chandelier.</h2>
        <p>Scale, drop, and bulb temperature — the three questions that decide whether a chandelier belongs over your table.</p>
      </article>
    </PageShell>
  ),
});
