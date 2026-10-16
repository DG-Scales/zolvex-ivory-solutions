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
        <h2 className="font-display text-2xl mb-3">Order Processing</h2>
        <p>Orders are typically processed within 1–4 business days. Processing times may vary depending on product availability, order volume, and supplier requirements. Processing time is already included in the estimated delivery time below.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">Estimated Delivery Times</h2>
        <p>Most standard orders are estimated to arrive within <strong>10–20 business days from the date of purchase</strong>, including processing and shipping.</p>
        <p>Delivery times are estimates, not guarantees, and may vary depending on the product, shipping destination, carrier operations, customs processing, and other circumstances beyond our control.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">Larger and Specialty Lighting Fixtures</h2>
        <p>Certain oversized, custom, or specialty lighting fixtures may require additional processing or shipping time beyond our standard delivery window.</p>
        <p>Where longer delivery times are known, they will be communicated through the product listing or during the ordering process.</p>
        <p>If an unexpected extended delivery timeframe is identified after an order is placed, we will contact you with the updated estimate before submitting the order for fulfillment. You may choose to proceed or cancel the affected unfulfilled item for a refund.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">Shipping Costs</h2>
        <p>Zolvex Lighting offers <strong>free standard shipping within the United States</strong> on eligible orders. Any applicable shipping charges or special delivery arrangements will be disclosed before checkout.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">Order Tracking</h2>
        <p>Once your order ships and tracking information becomes available, you will receive shipping confirmation with tracking details. Tracking updates may take additional time to appear in the carrier's system.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">Multiple Shipments</h2>
        <p>Orders containing multiple items may arrive in separate packages or on different dates depending on product availability and fulfillment locations.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">Shipping Delays</h2>
        <p>Delivery estimates may be affected by carrier delays, severe weather, holidays, customs inspections, supplier availability, or other unforeseen circumstances.</p>
        <p>If your shipment is significantly delayed, please contact us so we can review its status and assist with available options.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">Incorrect Shipping Information</h2>
        <p>Customers are responsible for providing accurate shipping information at checkout. If you notice an error, please contact us as soon as possible. Address changes cannot always be accommodated once an order has entered fulfillment or shipped.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">Lost or Damaged Shipments</h2>
        <p>If your order arrives damaged or appears lost in transit, contact us promptly at <strong><a target="_top" href="mailto:info@zolvexlighting.com" className="underline underline-offset-4">info@zolvexlighting.com</a></strong> with your order number and relevant details. We will investigate and assist with an appropriate resolution in accordance with applicable law and our return and refund policies.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">Contact Us</h2>
        <p>For shipping questions or order assistance:</p>
        <p>Email: <a target="_top" href="mailto:info@zolvexlighting.com" className="underline underline-offset-4">info@zolvexlighting.com</a></p>
        <p>Website: <a target="_top" href="https://www.zolvexlighting.com" className="underline underline-offset-4">www.zolvexlighting.com</a></p>
      </section>

      <p className="italic">This Shipping Policy does not limit any rights customers may have under applicable consumer protection laws.</p>
    </PageShell>
  ),
});

