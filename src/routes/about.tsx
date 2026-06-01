import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Zolvex" },
      { name: "description", content: "Zolvex curates considered objects that quietly solve the friction of everyday life." },
      { property: "og:title", content: "About — Zolvex" },
      { property: "og:description", content: "Where problems meet solutions." },
    ],
  }),
  component: () => (
    <PageShell eyebrow="About" title="Designed to solve, not to sell." lead="Zolvex began with a simple belief — that the best products quietly answer a problem you didn't know how to name.">
      <p>We curate objects with intent. Each piece is chosen for its craft, its utility, and the way it fits into a life well-lived. No noise. No filler. Just considered solutions to the friction of the everyday.</p>
      <p>Our standards are simple: it must be made well, it must earn its place, and it must outlast the trend cycle. If it doesn't, it doesn't belong here.</p>
      <p>We're a small team based wherever good things are being made. We ship worldwide and answer every email personally.</p>
    </PageShell>
  ),
});
