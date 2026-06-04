import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/gift-cards")({
  head: () => ({
    meta: [
      { title: "Gift Cards — Zolvex" },
      { name: "description", content: "Digital Zolvex gift cards — redeemable against any fixture in the collection." },
      { property: "og:title", content: "Gift Cards — Zolvex" },
      { property: "og:description", content: "A considered gift, without the guesswork." },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="Gift Cards"
      title="A considered gift, without the guesswork."
      lead="Digital Zolvex gift cards are delivered by email and redeemable against any fixture in the collection."
    >
      <section>
        <h2 className="font-display text-3xl mb-3">How it works</h2>
        <p>Choose an amount, add a note, and we'll send a beautifully set email to the recipient on the date you choose. They redeem it at checkout — no account required.</p>
      </section>
      <section>
        <h2 className="font-display text-3xl mb-3">Available denominations</h2>
        <p>$100 · $250 · $500 · $1,000 · $2,500</p>
      </section>
      <section>
        <h2 className="font-display text-3xl mb-3">Need a custom amount?</h2>
        <p>Email <a href="mailto:zolvex.business@gmail.com" className="underline underline-offset-4">zolvex.business@gmail.com</a> and we'll set one up for you.</p>
      </section>
    </PageShell>
  ),
});
