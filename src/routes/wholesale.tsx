import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/wholesale")({
  head: () => ({
    meta: [
      { title: "Project & Bulk Enquiries — Zolvex" },
      { name: "description", content: "Enquiries for multi-room, design and hospitality projects." },
      { property: "og:title", content: "Project & Bulk Enquiries — Zolvex" },
      { property: "og:description", content: "Enquiries for multi-room, design and hospitality projects." },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="Projects"
      title="Project and bulk enquiries."
      lead="Planning lighting for several rooms, a design project, or a hospitality space? Tell us what you need."
    >
      <section>
        <h2 className="font-display text-3xl mb-3">Who it's for</h2>
        <p>Designers, builders and homeowners ordering for more than one room, and small hospitality spaces.</p>
      </section>
      <section>
        <h2 className="font-display text-3xl mb-3">What to expect</h2>
        <p>We'll confirm availability and what is possible for larger orders. Pricing and terms for larger orders are confirmed by email before you commit; the prices shown on the site apply to online orders.</p>
      </section>
      <section>
        <h2 className="font-display text-3xl mb-3">How to apply</h2>
        <p>Send a short note with the products you are interested in, quantities, and your delivery location (United States only) to <a target="_top" href="mailto:notify@zolvexlighting.com" className="underline underline-offset-4">notify@zolvexlighting.com</a>. We'll reply as soon as we can.</p>
      </section>
    </PageShell>
  ),
});
