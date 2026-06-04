import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "Shipping — Zolvex" },
      { name: "description", content: "Shipping times, rates, and tracking for Zolvex lighting worldwide." },
    ],
  }),
  component: () => (
    <PageShell eyebrow="Support" title="Shipping" lead="We ship lighting worldwide. In-stock fixtures leave within 2–4 business days; made-to-order pieces follow the lead time on the product page.">
      <section><h2 className="font-display text-2xl mb-3">Domestic</h2><p>Standard shipping: 3–7 business days. Free on orders over $500. Oversized chandeliers and exterior fixtures may require freight delivery — calculated at checkout.</p></section>
      <section><h2 className="font-display text-2xl mb-3">International</h2><p>7–21 business days depending on destination. Duties and taxes are calculated at checkout where possible. Fixtures ship with wiring compliant to your destination region.</p></section>
      <section><h2 className="font-display text-2xl mb-3">Tracking</h2><p>You'll receive a tracking link by email as soon as your order ships. If you don't see it, check spam or reach out at <a href="mailto:zolvex.business@gmail.com" className="underline underline-offset-4">zolvex.business@gmail.com</a>.</p></section>
    </PageShell>
  ),
});
