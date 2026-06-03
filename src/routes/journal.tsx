import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Journal — Zolvex" },
      { name: "description", content: "Notes on craft, considered living, and the objects we choose to keep." },
      { property: "og:title", content: "Journal — Zolvex" },
      { property: "og:description", content: "Notes on craft and considered living." },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="Journal"
      title="Notes from a quieter shelf."
      lead="Short essays on craft, materials, and the small decisions that shape a considered life."
    >
      <article className="border-b border-border/60 pb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Essay · Coming soon</p>
        <h2 className="font-display text-3xl mb-3">On owning less, better.</h2>
        <p>A short meditation on why the right object, chosen once, outlasts a decade of almost-rights.</p>
      </article>
      <article className="border-b border-border/60 pb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Field note · Coming soon</p>
        <h2 className="font-display text-3xl mb-3">The workshop, in winter.</h2>
        <p>A visit to one of the makers whose work quietly finds its way into the Zolvex shelf.</p>
      </article>
      <article>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Guide · Coming soon</p>
        <h2 className="font-display text-3xl mb-3">How we choose what we sell.</h2>
        <p>The four questions every object has to answer before it earns a place in the catalog.</p>
      </article>
    </PageShell>
  ),
});
