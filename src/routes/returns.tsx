import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/returns")({
  head: () => ({
    meta: [
      { title: "Return Policy — Zolvex" },
      { name: "description", content: "30-day returns on regular-priced and discounted items. Zolvex pays return shipping. Contact info@zolvexlighting.com to start a return." },
      { property: "og:title", content: "Return Policy — Zolvex" },
      { property: "og:description", content: "30-day returns on regular-priced and discounted items. Zolvex pays return shipping." },
    ],
  }),
  component: ReturnsPage,
});

function ReturnsPage() {
  const email = (
    <a target="_top" href="mailto:info@zolvexlighting.com" className="underline underline-offset-4 hover:opacity-80">
      info@zolvexlighting.com
    </a>
  );

  return (
    <PageShell
      eyebrow="Support"
      title="Return Policy"
      lead="You have 30 days after your order is delivered to request a return. Zolvex pays return shipping on all eligible returns."
    >
      <section className="space-y-4">
        <h2 className="font-display text-2xl mb-3">Our 30-day return policy</h2>
        <p>
          You may request a return within 30 days of delivery. Both regular-priced and discounted items are eligible. Free return shipping applies to every eligible return, including if you simply change your mind — you will not be charged for the return label.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl mb-3">How to start a return</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Email us at {email} with your order number and the item(s) you would like to return. Please contact us <strong>before</strong> sending anything back.</li>
          <li>We will review your request. If it is approved, we will send you return instructions and a return shipping label.</li>
          <li>Pack the item securely, attach the label, and send it back as instructed.</li>
        </ol>
        <p>Items sent back without prior approval cannot be processed, so please contact us first. Keeping the original packaging until your return is approved helps the item arrive safely.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">Damaged, defective or incorrect items</h2>
        <p>
          Please inspect your order when it arrives and contact us at {email} right away if an item is damaged, defective, or not the item you ordered. We will resolve it at no cost to you.
        </p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">Refunds</h2>
        <p>
          Approved refunds are processed within 10 business days to your original payment method. Your bank or card issuer may need additional time to post the refund to your account.
        </p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">Exchanges</h2>
        <p>
          We do not offer direct exchanges. To get a different item, return the eligible item as described above and place a separate order for the new item.
        </p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">Questions</h2>
        <p>If you have any questions about a return, email {email}.</p>
      </section>
    </PageShell>
  );
}
