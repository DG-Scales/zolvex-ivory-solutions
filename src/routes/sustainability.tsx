import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/sustainability")({
  head: () => ({
    meta: [
      { title: "Sustainability — Zolvex" },
      { name: "description", content: "How to choose lighting thoughtfully: efficient LED sources and fixtures you will keep." },
      { property: "og:title", content: "Sustainability — Zolvex" },
      { property: "og:description", content: "Choosing lighting thoughtfully." },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="Sustainability"
      title="Longevity, before anything else."
      lead="The most sustainable fixture is the one you keep for years. That idea shapes how we think about the lighting we offer."
    >
      <section>
        <h2 className="font-display text-3xl mb-3">Built to last</h2>
        <p>Choose a style you expect to enjoy for a long time. Where a product uses a standard bulb socket, the bulb can be replaced without replacing the fixture; check each product page for what applies.</p>
      </section>
      <section>
        <h2 className="font-display text-3xl mb-3">Efficient by default</h2>
        <p>LED light sources use far less energy than older incandescent bulbs. Product pages state the light source type where it is provided, and whether a bulb is included.</p>
      </section>
      <section>
        <h2 className="font-display text-3xl mb-3">Questions about a product</h2>
        <p>If you want to know more about a fixture's materials or light source before ordering, email notify@zolvexlighting.com and we'll help.</p>
      </section>
    </PageShell>
  ),
});
