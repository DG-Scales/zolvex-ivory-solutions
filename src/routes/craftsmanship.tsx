import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/craftsmanship")({
  head: () => ({
    meta: [
      { title: "Craftsmanship — Zolvex" },
      { name: "description", content: "Materials, makers, and the standards behind every Zolvex lighting fixture." },
      { property: "og:title", content: "Craftsmanship — Zolvex" },
      { property: "og:description", content: "Honest materials, considered design, and the quality of light." },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="Craftsmanship"
      title="Made well, or not at all."
      lead="Every fixture in the Zolvex catalog is judged against the same quiet standards — material, maker, and the quality of its light."
    >
      <section>
        <h2 className="font-display text-3xl mb-3">Materials</h2>
        <p>Solid brass, brushed steel, hand-spun aluminium, art glass, marble, and natural stone. No painted plastic dressed up as metal. No printed glass pretending to be hand-formed.</p>
      </section>
      <section>
        <h2 className="font-display text-3xl mb-3">Partners</h2>
        <p>We work with a small group of trusted studios and workshops. Every piece in the collection is vetted before it ever reaches a customer — fit, finish, wiring, and the way it carries light.</p>
      </section>
      <section>
        <h2 className="font-display text-3xl mb-3">Light</h2>
        <p>The fixture is the object; the light is the point. Each piece is chosen for the warmth, throw, and shadow it produces — not just how it looks switched off.</p>
      </section>
    </PageShell>
  ),
});
