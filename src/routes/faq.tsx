import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

const faqs = [
  { q: "When will my order ship?", a: "Most orders leave within 1–2 business days. You'll receive a tracking link by email." },
  { q: "Do you ship internationally?", a: "Yes — worldwide. International orders take 7–14 business days." },
  { q: "What's your return policy?", a: "30 days from delivery on any unused item in original packaging." },
  { q: "Can I change or cancel my order?", a: "Email hello@zolvex.com within 12 hours of placing it and we'll do our best." },
  { q: "Do you offer wholesale?", a: "We work with a small number of retail partners. Reach out at wholesale@zolvex.com." },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Zolvex" },
      { name: "description", content: "Answers to common questions about ordering, shipping, returns, and the Zolvex brand." },
    ],
  }),
  component: () => (
    <PageShell eyebrow="Support" title="Frequently asked" lead="Quick answers. If yours isn't here, email hello@zolvex.com.">
      {faqs.map((f) => (
        <section key={f.q} className="border-b border-border pb-6">
          <h2 className="font-display text-2xl mb-2">{f.q}</h2>
          <p className="text-muted-foreground">{f.a}</p>
        </section>
      ))}
    </PageShell>
  ),
});
