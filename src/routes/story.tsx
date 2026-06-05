import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "Our Story — Zolvex" },
      { name: "description", content: "The story behind Zolvex — a curated lighting house built on craft, material honesty, and the quality of light." },
      { property: "og:title", content: "Our Story — Zolvex" },
      { property: "og:description", content: "How Zolvex began, what we believe, and the standards behind every fixture we carry." },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="Our Story"
      title="Crafted with care, built to endure."
      lead="Zolvex began with a simple belief — that the right fixture quietly changes the way a room is lived in. Light is the first thing you feel when you walk into a space, and the last thing you remember when you leave it."
    >
      <section>
        <h2 className="font-display text-3xl mb-3">How it started</h2>
        <p>
          Zolvex was founded out of frustration with the state of modern lighting — rooms full of fixtures that looked the part but felt hollow, made from materials that wouldn't last a decade, casting light that flattened every surface it touched. We wanted something different. A small, curated house where every piece had a reason to be there.
        </p>
        <p>
          So we started slowly. We met with workshops, glassblowers, and metalsmiths. We rejected far more than we accepted. What remained became the foundation of the Zolvex catalog — chandeliers, pendants, wall sconces, floor and table lamps, and exterior fixtures, each one chosen for the room, façade, or garden it transforms.
        </p>
      </section>

      <section>
        <h2 className="font-display text-3xl mb-3">What we believe</h2>
        <p>
          Lighting is architecture you can feel. It defines the proportions of a room more honestly than paint or furniture ever will. A single well-made pendant can quiet an entire space; the wrong fixture can unsettle a room you've spent years arranging.
        </p>
        <p>
          We believe in materials that age with grace — hand-blown glass, solid brass, brushed steel, marble, hand-spun aluminium. We believe in makers who sign their work, even if their names never reach the customer. And we believe that the fixture is the object, but the light is the point.
        </p>
      </section>

      <section>
        <h2 className="font-display text-3xl mb-3">How we choose</h2>
        <p>
          Every piece in the Zolvex collection is judged against the same quiet standards. It has to be made well — by hands that know the material. It has to earn its place — no filler, no novelty, nothing chasing a trend. And the light it gives has to feel right. Warm, considered, true to the room.
        </p>
        <p>
          If a fixture fails any one of these, it doesn't belong here. That's why the catalog stays small on purpose. We'd rather carry forty pieces we believe in than four hundred we don't.
        </p>
      </section>

      <section>
        <h2 className="font-display text-3xl mb-3">Where we're going</h2>
        <p>
          We're a small team, and we plan to stay that way. We ship globally, answer every email personally, and work with our makers as long-term partners rather than seasonal suppliers. Each year we add a handful of new pieces, retire ones that no longer fit, and refine the way we present the collection.
        </p>
        <p>
          Thank you for being part of it. If you ever have a question about a fixture, a room you're designing, or the light you're trying to find — write to us. We read every message, and we'd love to help.
        </p>
      </section>
    </PageShell>
  ),
});
