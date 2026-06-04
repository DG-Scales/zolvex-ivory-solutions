import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/sustainability")({
  head: () => ({
    meta: [
      { title: "Sustainability — Zolvex" },
      { name: "description", content: "Longevity, repairability, and honest packaging across the Zolvex lighting collection." },
      { property: "og:title", content: "Sustainability — Zolvex" },
      { property: "og:description", content: "Fixtures built to be rewired, not replaced." },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="Sustainability"
      title="Longevity, before anything else."
      lead="The most sustainable fixture is the one you never have to replace. That belief shapes everything we choose to carry."
    >
      <section>
        <h2 className="font-display text-3xl mb-3">Built to last</h2>
        <p>Solid components, standard sockets, replaceable parts. Our fixtures are designed to be rewired, refinished, and handed down — not landfilled in a decade.</p>
      </section>
      <section>
        <h2 className="font-display text-3xl mb-3">Efficient by default</h2>
        <p>Every fixture is compatible with high-CRI LED sources. We ship dimmable, low-wattage bulbs where the design allows, and we say so clearly when it doesn't.</p>
      </section>
      <section>
        <h2 className="font-display text-3xl mb-3">Honest packaging</h2>
        <p>Recycled card, paper tape, custom-cut inserts. Just enough to get fragile glass and finished metal to you safely, and nothing more.</p>
      </section>
    </PageShell>
  ),
});
