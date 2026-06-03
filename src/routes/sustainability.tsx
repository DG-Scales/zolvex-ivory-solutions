import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/sustainability")({
  head: () => ({
    meta: [
      { title: "Sustainability — Zolvex" },
      { name: "description", content: "How we think about longevity, packaging, and the footprint of what we sell." },
      { property: "og:title", content: "Sustainability — Zolvex" },
      { property: "og:description", content: "Longevity over novelty. Honest packaging. Quiet footprints." },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="Sustainability"
      title="Longevity, before anything else."
      lead="The most sustainable object is the one you don't have to replace. That belief shapes everything we choose to carry."
    >
      <section>
        <h2 className="font-display text-3xl mb-3">Built to last</h2>
        <p>We choose objects designed to be repaired, refilled, and handed down. No planned obsolescence. No disposable luxury.</p>
      </section>
      <section>
        <h2 className="font-display text-3xl mb-3">Honest packaging</h2>
        <p>Recycled card, paper tape, no plastic fillers. Just enough to get the object to you safely, and nothing more.</p>
      </section>
      <section>
        <h2 className="font-display text-3xl mb-3">Sourcing</h2>
        <p>We prioritise makers close to their materials and ship by sea where timelines allow. Where we fall short, we say so.</p>
      </section>
    </PageShell>
  ),
});
