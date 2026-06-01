import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — Zolvex" },
      { name: "description", content: "Born from frustration with throwaway culture, Zolvex finds products built to last and worth owning." },
      { property: "og:title", content: "Our Story — Zolvex" },
      { property: "og:description", content: "Fewer things. Better things. Built to last." },
    ],
  }),
  component: () => (
    <PageShell eyebrow="Our Story" title="Fewer things. Better things." lead="Zolvex started with one question: why is it so hard to find products that actually work?">
      <p>Tired of gadgets that break in six months and brands that prioritize hype over substance, we set out to build something different. A store where every single item has been tested, debated, and proven worthy of a spot in your life.</p>
      <p>We don't chase trends. We hunt for timeless design, honest materials, and engineering that respects your time. If a product can't justify its existence, it never makes it to the shelf.</p>
      <p>Today, Zolvex is a small team of makers, testers, and problem-solvers scattered across the globe. We ship worldwide, write every product description ourselves, and treat every customer like a neighbor.</p>
    </PageShell>
  ),
});
