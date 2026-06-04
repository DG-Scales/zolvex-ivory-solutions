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
      <p>We curate premium designer lighting with intent. Chandeliers, pendants, wall sconces, floor lamps, and exterior fixtures — each piece chosen for the quality of its craft, the honesty of its materials, and the light it casts.</p>
      <p>Our standards are simple: it must be made well, it must earn its place, and the light it gives must feel right. If it doesn't, it doesn't belong here.</p>
      <p>We're a small team working with workshops, glassblowers, and metalsmiths around the world. We ship globally and answer every email personally.</p>
    </PageShell>
  ),
});
