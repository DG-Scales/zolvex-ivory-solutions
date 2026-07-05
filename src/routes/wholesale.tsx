import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/wholesale")({
  head: () => ({
    meta: [
      { title: "Trade & Wholesale — Zolvex" },
      { name: "description", content: "Trade and specification programme for interior designers, architects, hotels, and considered retailers." },
      { property: "og:title", content: "Trade & Wholesale — Zolvex" },
      { property: "og:description", content: "Lighting specification for designers, architects, and hospitality." },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="Trade & Wholesale"
      title="For projects with a point of view."
      lead="We partner with interior designers, architects, hotels, restaurants, and independent retailers whose standards quietly match our own."
    >
      <section>
        <h2 className="font-display text-3xl mb-3">Who it's for</h2>
        <p>Studios specifying lighting for residential and hospitality projects, design hotels, members' clubs, and showrooms looking to stock a tightly edited selection of premium fixtures.</p>
      </section>
      <section>
        <h2 className="font-display text-3xl mb-3">What we offer</h2>
        <p>Trade pricing, specification support, lead-time visibility on custom finishes and bespoke runs, and direct access to our makers for project-scale orders.</p>
      </section>
      <section>
        <h2 className="font-display text-3xl mb-3">How to apply</h2>
        <p>Send a short note about your studio or space, the project in mind, and what drew you to Zolvex to <a target="_top" href="mailto:notify@zolvex.org" className="underline underline-offset-4">notify@zolvex.org</a>. We answer every enquiry personally.</p>
      </section>
    </PageShell>
  ),
});
