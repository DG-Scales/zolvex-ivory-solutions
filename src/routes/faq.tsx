import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

const faqs = [
  { q: "When will my order ship?", a: "In-stock fixtures leave within 1–4 business days. Made-to-order and custom-finish pieces ship within the lead time noted on each product page." },
  { q: "Do you ship internationally?", a: "Yes — worldwide. International orders take 7–25 business days depending on destination and fixture size." },
  { q: "Do bulbs come included?", a: "Most fixtures ship with high-CRI LED bulbs included. Where they don't, recommended bulb specs are listed on the product page." },
  { q: "What's your return policy?", a: "30 days from delivery on any uninstalled fixture in original packaging. Custom and made-to-order pieces are final sale." },
  { q: "Can I change or cancel my order?", a: "Email notify@zolvexlighting.com within 24 hours of placing your order and we'll do our best." },
  { q: "Do you offer trade pricing?", a: "Yes — we work with designers, architects, and hospitality. See our Wholesale page or email notify@zolvexlighting.com." },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Zolvex" },
      { name: "description", content: "Answers on ordering, shipping, bulbs, and returns for Zolvex lighting." },
    ],
  }),
  component: () => (
    <PageShell eyebrow="Support" title="Frequently asked" lead="Quick answers. If yours isn't here, email notify@zolvexlighting.com.">
      {faqs.map((f) => (
        <section key={f.q} className="border-b border-border pb-6">
          <h2 className="font-display text-2xl mb-2">{f.q}</h2>
          <p className="text-muted-foreground">{f.a}</p>
        </section>
      ))}
    </PageShell>
  ),
});
