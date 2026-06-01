import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/returns")({
  head: () => ({
    meta: [
      { title: "Returns — Zolvex" },
      { name: "description", content: "30-day returns on unused Zolvex items. Simple, no questions asked." },
    ],
  }),
  component: () => (
    <PageShell eyebrow="Support" title="Returns & Exchanges" lead="If something isn't right, we'll make it right. Return any unused item within 30 days of delivery.">
      <section><h2 className="font-display text-2xl mb-3">How to return</h2><p>Email hello@zolvex.com with your order number. We'll send a prepaid label and process your refund within 5 business days of receiving the item.</p></section>
      <section><h2 className="font-display text-2xl mb-3">Condition</h2><p>Items must be unused, in original packaging, and free of wear. Final sale items are noted on their product page.</p></section>
      <section><h2 className="font-display text-2xl mb-3">Exchanges</h2><p>Need a different size or variant? Mention it in your return email and we'll reserve the replacement for you.</p></section>
    </PageShell>
  ),
});
