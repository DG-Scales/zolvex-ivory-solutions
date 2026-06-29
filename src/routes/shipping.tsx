import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "Shipping — Zolvex" },
      { name: "description", content: "Shipping times, rates, and tracking for Zolvex lighting worldwide." },
    ],
  }),
  component: () => (
    <PageShell eyebrow="Support" title="Shipping Policy" lead="Everything you need to know about how and when your Zolvex order arrives.">
      <section>
        <h2 className="font-display text-2xl mb-3">Processing Time</h2>
        <p>Orders are processed within 1–4 business days after payment confirmation.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">Shipping Times</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>United States: 7–25 business days — FREE</li>
          <li>International / Rest of World: 7–25 business days — $29.99</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">Shipping Costs</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>United States: Free shipping on all orders</li>
          <li>International: Flat rate $29.99 per order</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">Please Note</h2>
        <p>Due to the nature of our products, certain items such as large chandeliers, custom lighting fixtures, or items with high demand may require additional processing and shipping time. In these cases, delivery may take up to 60 days (approximately 2 months). We appreciate your patience and assure you that every order is handled with care.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">Order Tracking</h2>
        <p>Once your order ships you will receive a confirmation email with a tracking number. You can use this to track your package at any time.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">International Orders</h2>
        <p>International orders may be subject to customs duties and taxes upon arrival. These charges are the responsibility of the recipient.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">Lost or Delayed Packages</h2>
        <p>If your package is lost or significantly delayed please contact us at <a target="_top" href="mailto:zolvex.business@gmail.com" className="underline underline-offset-4">zolvex.business@gmail.com</a> with your order number and we will investigate immediately.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">Contact Us</h2>
        <p>Email: <a target="_top" href="mailto:zolvex.business@gmail.com" className="underline underline-offset-4">zolvex.business@gmail.com</a></p>
        <p>Website: <a target="_top" href="https://zolvex.org" className="underline underline-offset-4">zolvex.org</a></p>
      </section>
    </PageShell>
  ),
});
