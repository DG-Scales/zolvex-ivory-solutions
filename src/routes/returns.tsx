import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/returns")({
  head: () => ({
    meta: [
      { title: "Returns — Zolvex" },
      { name: "description", content: "30-day returns on uninstalled Zolvex fixtures in original packaging." },
    ],
  }),
  component: () => (
    <PageShell eyebrow="Support" title="Returns & Exchanges" lead="If a fixture isn't right, we'll make it right. Return any uninstalled piece within 30 days of delivery.">
      <section><h2 className="font-display text-2xl mb-3">How to return</h2><p>Email <a href="mailto:zolvex.business@gmail.com" className="underline underline-offset-4">zolvex.business@gmail.com</a> with your order number. We'll arrange collection or a prepaid label and process your refund within 5 business days of receiving the fixture.</p></section>
      <section><h2 className="font-display text-2xl mb-3">Condition</h2><p>Fixtures must be uninstalled, free of wiring marks, and returned in original packaging with all components. Custom finishes, bespoke pieces, and made-to-order chandeliers are final sale.</p></section>
      <section><h2 className="font-display text-2xl mb-3">Exchanges</h2><p>Need a different finish, size, or drop length? Mention it in your return email and we'll reserve the replacement for you.</p></section>
    </PageShell>
  ),
});
