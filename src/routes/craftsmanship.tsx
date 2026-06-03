import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/craftsmanship")({
  head: () => ({
    meta: [
      { title: "Craftsmanship — Zolvex" },
      { name: "description", content: "Our standards for materials, makers, and how each object earns its place." },
      { property: "og:title", content: "Craftsmanship — Zolvex" },
      { property: "og:description", content: "Materials, makers, and the standards behind every Zolvex piece." },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="Craftsmanship"
      title="Made well, or not at all."
      lead="Every piece in the Zolvex catalog is judged against the same quiet standards — material, maker, and intent."
    >
      <section>
        <h2 className="font-display text-3xl mb-3">Materials</h2>
        <p>We favour solid woods, full-grain leather, brushed steel, and natural fibres. No veneers pretending to be timber. No plastic dressed up as something else.</p>
      </section>
      <section>
        <h2 className="font-display text-3xl mb-3">Makers</h2>
        <p>We work with small workshops and family-run studios. We know who made the thing and, where we can, we tell you their name.</p>
      </section>
      <section>
        <h2 className="font-display text-3xl mb-3">Intent</h2>
        <p>Every object has to solve a real problem and outlast the next trend cycle. If it can't do both, it doesn't belong here.</p>
      </section>
    </PageShell>
  ),
});
