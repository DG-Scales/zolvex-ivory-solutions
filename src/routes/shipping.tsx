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
    <PageShell eyebrow="Support" title="Shipping" lead="We ship lighting worldwide. Orders are processed and dispatched within 1–4 business days; made-to-order pieces follow the lead time on the product page.">
      <section><h2 className="font-display text-2xl mb-3">United States</h2><p>Standard shipping: 7–25 business days. Free shipping — no minimum required.</p></section>
      <section><h2 className="font-display text-2xl mb-3">International</h2><p>7–25 business days depending on destination. Fixtures ship with wiring compliant to your destination region.</p></section>
      <section><h2 className="font-display text-2xl mb-3">Larger fixtures</h2><p>Some larger products — oversized chandeliers, freight-only pieces, and made-to-order fixtures — may take up to 60 days to arrive depending on circumstances such as customs clearance, carrier delays, or production lead times. We'll keep you updated throughout.</p></section>
      <section><h2 className="font-display text-2xl mb-3">Tracking</h2><p>You'll receive a tracking link by email as soon as your order ships. If you don't see it, check spam or reach out at <a target="_top" href="mailto:zolvex.business@gmail.com" className="underline underline-offset-4">zolvex.business@gmail.com</a>.</p></section>
    </PageShell>
  ),
});
