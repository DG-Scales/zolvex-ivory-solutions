import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/wholesale")({
  head: () => ({
    meta: [
      { title: "Wholesale — Zolvex" },
      { name: "description", content: "Wholesale and stockist enquiries for hotels, studios, and considered retailers." },
      { property: "og:title", content: "Wholesale — Zolvex" },
      { property: "og:description", content: "For hotels, studios, and considered retailers." },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="Wholesale"
      title="For shelves that share our standards."
      lead="We partner with a small number of hotels, studios, and independent retailers whose values quietly match our own."
    >
      <section>
        <h2 className="font-display text-3xl mb-3">Who it's for</h2>
        <p>Independent shops, design hotels, members' clubs, and studios looking to stock a tightly edited selection of considered objects.</p>
      </section>
      <section>
        <h2 className="font-display text-3xl mb-3">How to apply</h2>
        <p>Send a short note about your space, your customer, and what drew you to Zolvex to <a href="mailto:zolvex.business@gmail.com" className="underline underline-offset-4">zolvex.business@gmail.com</a>. We answer every enquiry personally.</p>
      </section>
    </PageShell>
  ),
});
