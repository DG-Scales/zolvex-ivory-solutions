import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

const faqs = [
  { q: "When will my order ship?", a: "Orders are processed within 1–4 business days after payment confirmation. See our Shipping page for delivery estimates." },
  { q: "Do you ship internationally?", a: "Not at this time. We currently ship to addresses in the United States only." },
  { q: "Do bulbs come included?", a: "It depends on the fixture. Each product page lists the specifications and options for that item (for example \"Bulb Not Included\" where applicable). If it isn't clear, email us before ordering." },
  { q: "What's your return policy?", a: "You can return eligible items within 30 days of delivery, including discounted items, and Zolvex covers return shipping. Email zolvex.business@gmail.com first; once your return is approved we send return instructions and a return label. See our Returns page for details." },
  { q: "Can I change or cancel my order?", a: "Email zolvex.business@gmail.com within 24 hours of placing your order and we'll do our best." },
  { q: "Do you take project or bulk enquiries?", a: "Yes. Email zolvex.business@gmail.com with the products you are interested in and the quantities, and we'll let you know what is possible." },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Zolvex" },
      { name: "description", content: "Answers on ordering, shipping, bulbs, and returns for Zolvex lighting." },
    ],
  }),
  component: () => (
    <PageShell eyebrow="Support" title="Frequently asked" lead="Quick answers. If yours isn't here, email zolvex.business@gmail.com.">
      {faqs.map((f) => (
        <section key={f.q} className="border-b border-border pb-6">
          <h2 className="font-display text-2xl mb-2">{f.q}</h2>
          <p className="text-muted-foreground">{f.a}</p>
        </section>
      ))}
    </PageShell>
  ),
});
