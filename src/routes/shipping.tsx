import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "Shipping — Zolvex" },
      { name: "description", content: "Shipping times, rates, and tracking for Zolvex orders worldwide." },
    ],
  }),
  component: () => (
    <PageShell eyebrow="Support" title="Shipping" lead="We ship worldwide from our fulfillment partners. Most orders leave within 1–2 business days.">
      <section><h2 className="font-display text-2xl mb-3">Domestic</h2><p>Standard shipping: 3–5 business days. Free on orders over $75.</p></section>
      <section><h2 className="font-display text-2xl mb-3">International</h2><p>7–14 business days depending on destination. Duties and taxes are calculated at checkout where possible.</p></section>
      <section><h2 className="font-display text-2xl mb-3">Tracking</h2><p>You'll receive a tracking link by email as soon as your order ships. If you don't see it, check your spam folder or reach out at hello@zolvex.com.</p></section>
    </PageShell>
  ),
});
