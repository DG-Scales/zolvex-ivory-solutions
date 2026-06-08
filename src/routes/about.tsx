import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Zolvex" },
      { name: "description", content: "Zolvex curates premium designer lighting for interiors and exteriors — quietly made, made to last." },
      { property: "og:title", content: "About — Zolvex" },
      { property: "og:description", content: "A curated lighting house for considered spaces." },
    ],
  }),
  component: () => (
    <PageShell eyebrow="About" title="A house for considered light." lead="Zolvex began with a simple belief — that the right fixture quietly changes the way a room is lived in.">
      <p>We curate premium designer lighting with intent. Chandeliers, pendants, wall sconces, floor lamps, and exterior fixtures — each piece chosen for the quality of its craft, the honesty of its materials, and the light it casts in a real room.</p>
      <p>Lighting is the first thing your eye finds and the last thing it leaves. It sets the temperature of a space long before the furniture does. That belief shapes every decision we make — from the studios we partner with to the pieces we choose to carry, and the ones we quietly turn away.</p>
      <h2>What we stand for</h2>
      <p>Built to last. We favor solid brass, hand-blown glass, machined steel, and finishes that age with grace. Nothing disposable, nothing hollow. If a fixture won't still feel right in twenty years, it doesn't make the catalog.</p>
      <p>Designed with intent. Every piece earns its place. We look for proportion, restraint, and a point of view — work from independent designers and established ateliers who treat lighting as architecture, not decoration.</p>
      <p>Light that feels right. Specs matter, but the room is the final test. We weigh color temperature, throw, glare, and dimming behavior because the way light lands on a wall, a table, or a face is the whole point.</p>
      <h2>How we work</h2>
      <p>We partner directly with trusted studios and workshops around the world, which lets us keep the catalog tight and the quality consistent. We ship globally, stand behind every order, and answer every email personally — no scripts, no queues.</p>
      <p>Whether you're finishing a single room or specifying an entire home, we're here to help you choose light that belongs.</p>
    </PageShell>
  ),
});
