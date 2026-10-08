import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "Shipping — Zolvex" },
      { name: "description", content: "Shipping times, rates, and tracking for Zolvex lighting orders within the United States." },
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
        </ul>
        <p className="mt-3">All delivery times are estimates only and are not guaranteed. Actual delivery may vary due to carrier delays or other circumstances outside our control.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">Shipping Costs</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>United States: Free shipping on all orders, with no minimum purchase</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">Please Note</h2>
        <p>Due to the nature of our products, certain items such as large chandeliers or items with high demand may require additional processing and shipping time. In these cases, delivery may take up to 60 days (approximately 2 months). We appreciate your patience.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">Order Tracking</h2>
        <p>Once your order ships, you will receive a confirmation email with a tracking number. You can use this to track your package at any time if available.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">Shipping Area</h2>
        <p>We currently ship to addresses in the United States only. International shipping is not available at this time.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">Lost or Delayed Packages</h2>
        <p>If your package is lost or significantly delayed, please contact us at <a target="_top" href="mailto:zolvex.business@gmail.com" className="underline underline-offset-4">zolvex.business@gmail.com</a> with your order number, and we will investigate immediately. If the carrier confirms a package is lost, we will arrange a replacement or issue a full refund at no additional cost to you.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">Contact Us</h2>
        <p>Email: <a target="_top" href="mailto:zolvex.business@gmail.com" className="underline underline-offset-4">zolvex.business@gmail.com</a></p>
        <p>Website: <a target="_top" href="https://www.zolvexlighting.com" className="underline underline-offset-4">www.zolvexlighting.com</a></p>
      </section>
    </PageShell>
  ),
});

