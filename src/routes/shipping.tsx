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
      <p className="text-sm text-muted-foreground">Last Updated: October 16, 2026</p>
      <p>At Zolvex Lighting, we strive to provide reliable shipping and transparent delivery information. Please review this Shipping Policy before placing an order. By purchasing from our store, you acknowledge the shipping information disclosed at checkout and in the applicable product listing.</p>

      <section>
        <h2 className="font-display text-2xl mb-3">1. Order Processing</h2>
        <p>Orders are typically processed within 1–4 business days, excluding weekends and applicable holidays.</p>
        <p>Processing includes order verification, payment confirmation, product preparation, supplier coordination, and fulfillment arrangements.</p>
        <p>Processing times may vary due to product availability, order volume, supplier requirements, payment verification, manufacturing schedules, or other operational circumstances.</p>
        <p>Processing time is separate from and not included in our standard estimated shipping and transit timeframe.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">2. Standard Estimated Delivery Times</h2>
        <p>Most standard orders are estimated to arrive within <strong>10–20 business days</strong> after order processing is completed and the order has shipped.</p>
        <p>This timeframe refers to shipping and transit only and does not include initial processing.</p>
        <p>Business days generally exclude Saturdays, Sundays, and applicable holidays.</p>
        <p>All delivery timeframes are estimates rather than guaranteed arrival dates. Actual delivery may vary depending on the product, destination, carrier, fulfillment arrangements, customs procedures, and other circumstances.</p>
        <p>Any product-specific delivery estimate provided before purchase takes precedence over the general estimate in this section.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">3. Larger, Specialty, and Extended Delivery Times</h2>
        <p>Certain products may require 30–60 days or longer for processing, shipping, transportation, or delivery.</p>
        <p>Extended timeframes may result from factors including, but not limited to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Product size, weight, type, design, or construction.</li>
          <li>Oversized, fragile, custom, or specialty lighting fixtures.</li>
          <li>Product availability, backorders, or manufacturing requirements.</li>
          <li>Supplier location, processing capacity, or fulfillment schedules.</li>
          <li>International shipping, customs inspections, or import procedures.</li>
          <li>Freight shipping, specialized handling, or transportation restrictions.</li>
          <li>Carrier delays, logistical disruptions, or unforeseen circumstances.</li>
        </ul>
        <p>Extended delivery periods are not limited to oversized or specialty fixtures and may apply to other products when circumstances require additional time.</p>
        <p>Where longer delivery periods are known before purchase, we will disclose the applicable estimate in the product listing, during checkout, or through other clear pre-purchase communication.</p>
        <p>If an unexpected extended shipping timeframe is identified after an order is placed, we will notify the customer and provide the options required by applicable law.</p>
        <p>A general extended-delivery statement in this policy does not automatically authorize indefinite shipping delays.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">4. Shipping Delays and Customer Notification</h2>
        <p>Although we make reasonable efforts to meet estimated shipping schedules, delays may occur.</p>
        <p>If we determine that an order cannot be shipped within the applicable promised shipment timeframe, we will provide notice within the period required by applicable law.</p>
        <p>Where required, this notification will include:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>An explanation of the delay.</li>
          <li>A revised estimated shipping date when reasonably available.</li>
          <li>The option to consent to the revised shipment timeframe.</li>
          <li>The option to cancel the affected unshipped merchandise and receive a prompt refund.</li>
        </ul>
        <p>If a reliable revised shipping date cannot be provided, we will explain that the duration of the delay is uncertain and provide the cancellation rights required by law.</p>
        <p>For delays requiring affirmative customer consent, we will not treat a lack of response as consent.</p>
        <p>If the customer declines the delay, or if the required consent is not obtained, we will cancel and refund the affected unshipped merchandise as required by law.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">5. Order Cancellations and Refunds</h2>
        <p>Customers may request cancellation by contacting <a target="_top" href="mailto:info@zolvexlighting.com" className="underline underline-offset-4">info@zolvexlighting.com</a> with their order number.</p>
        <p>We will review cancellation requests based on the order's fulfillment status and applicable legal requirements.</p>
        <p>Orders that have already shipped may be subject to our Return and Refund Policy rather than ordinary pre-shipment cancellation procedures.</p>
        <p>However, customers retain all applicable statutory cancellation and refund rights, including rights arising from delayed or unfulfilled shipments.</p>
        <p>When an order must be canceled because we cannot fulfill it within the applicable shipping requirements, we will issue the required refund promptly to the original payment method.</p>
        <p>Refund processing and the time required for funds to appear may depend on the payment provider or financial institution.</p>
        <p>No provision of this policy requires a customer to accept store credit instead of a legally required monetary refund.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">6. Shipping Costs</h2>
        <p>Zolvex Lighting offers <strong>free standard shipping within the United States</strong> on eligible orders.</p>
        <p>If a product requires special freight arrangements, additional shipping charges, or delivery services not covered by standard shipping, applicable charges will be disclosed before the customer completes the purchase.</p>
        <p>We will not impose undisclosed shipping charges after checkout without the customer's agreement.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">7. Third-Party Suppliers and Fulfillment</h2>
        <p>Zolvex Lighting may use third-party suppliers, warehouses, fulfillment providers, and shipping carriers to process and deliver orders.</p>
        <p>Orders may be shipped directly from domestic or international fulfillment facilities.</p>
        <p>Shipping origin, packaging, carrier selection, and fulfillment methods may vary depending on the product and supplier.</p>
        <p>While these third parties perform certain fulfillment and transportation services, Zolvex Lighting remains responsible for meeting its applicable obligations to customers.</p>
        <p>We will make reasonable efforts to assist customers with fulfillment problems, delays, missing shipments, and delivery disputes.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">8. Order Tracking</h2>
        <p>When an order ships and tracking information becomes available, customers will generally receive shipping confirmation containing the available tracking details.</p>
        <p>Tracking information may not update immediately and may require additional time to appear in the carrier's system.</p>
        <p>Tracking availability, frequency of updates, and delivery notifications depend on the carrier and shipping method.</p>
        <p>Customers may contact us if tracking information appears incorrect or stops updating for an extended period.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">9. Multiple Shipments</h2>
        <p>Orders containing multiple products may be fulfilled from different suppliers or warehouses and may arrive in separate shipments.</p>
        <p>Individual products may have different processing, shipping, and delivery timeframes.</p>
        <p>Where applicable, tracking information may be provided separately for each shipment.</p>
        <p>A partial shipment does not eliminate the customer's applicable rights regarding items that remain unshipped.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">10. Incorrect or Incomplete Shipping Information</h2>
        <p>Customers are responsible for providing complete and accurate shipping information at checkout, including the recipient's name, street address, apartment or unit number, and other required details.</p>
        <p>If an error is discovered, customers should contact us as soon as possible.</p>
        <p>We cannot guarantee that an address can be changed once an order has entered fulfillment or been shipped.</p>
        <p>If a shipment is delayed, returned, or otherwise affected by incorrect information supplied by the customer, additional delivery arrangements or reasonable reshipping charges may apply where legally permitted and disclosed before payment.</p>
        <p>Zolvex Lighting is not responsible for delays directly caused by inaccurate customer-provided information to the extent permitted by applicable law.</p>
        <p>This provision does not limit responsibility for errors caused by Zolvex Lighting or its fulfillment partners.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">11. Failed Deliveries and Returned-to-Sender Packages</h2>
        <p>Shipments may be returned to the sender because of incorrect addresses, refused delivery, failed delivery attempts, carrier restrictions, or unclaimed packages.</p>
        <p>If an order is returned to the sender, customers should contact us to discuss available options.</p>
        <p>Depending on the circumstances, options may include reshipping the product or issuing an applicable refund.</p>
        <p>Reasonable additional shipping costs may apply when a failed delivery is attributable to incorrect information or actions by the customer, where permitted by law.</p>
        <p>Any applicable refund will be handled in accordance with our Return and Refund Policy and the customer's legal rights.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">12. Lost, Missing, or Misdelivered Shipments</h2>
        <p>If a shipment appears lost, is marked delivered but cannot be located, or has not arrived within a reasonable period, please contact <a target="_top" href="mailto:info@zolvexlighting.com" className="underline underline-offset-4">info@zolvexlighting.com</a>.</p>
        <p>Include the order number, shipping address, and relevant tracking information.</p>
        <p>We may investigate the matter with the carrier, supplier, or fulfillment provider.</p>
        <p>Depending on the findings and applicable legal requirements, an appropriate resolution may include locating the shipment, arranging a replacement, or providing a refund.</p>
        <p>A carrier's delivered status may be considered as evidence during an investigation but does not automatically eliminate any customer rights or remedies available under applicable law.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">13. Damaged Shipments</h2>
        <p>If an order arrives damaged, customers should contact us as soon as reasonably possible.</p>
        <p>We recommend providing:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>The order number.</li>
          <li>Photographs of the damaged product.</li>
          <li>Photographs of the packaging, if available.</li>
          <li>A brief description of the issue.</li>
        </ul>
        <p>Customers should retain the packaging when reasonably practical until the matter is reviewed.</p>
        <p>We will evaluate the issue and provide an appropriate resolution in accordance with applicable law and our Return and Refund Policy.</p>
        <p>Failure to provide photographs or retain packaging does not automatically eliminate any statutory rights.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">14. International Shipping, Customs, and Import Requirements</h2>
        <p>Shipping availability may vary by country or destination. Our standard free U.S. shipping offer does not automatically apply to international orders.</p>
        <p>International shipments, where offered, may be subject to customs inspections, import restrictions, duties, taxes, brokerage charges, or other government requirements.</p>
        <p>Any applicable customer responsibility for import-related charges will be disclosed before purchase where required.</p>
        <p>Customs processing and international transportation may affect delivery estimates.</p>
        <p>We are not responsible for delays caused solely by customs authorities or government inspections to the extent permitted by law, but we will comply with applicable obligations relating to delayed or undelivered orders.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">15. Delivery Restrictions</h2>
        <p>Certain lighting fixtures may be subject to shipping restrictions due to dimensions, weight, materials, fragility, destination, or carrier limitations.</p>
        <p>We reserve the right to decline or cancel orders that cannot reasonably or lawfully be fulfilled.</p>
        <p>If we cancel an order that has been paid for and cannot be fulfilled, we will provide the applicable refund.</p>
        <p>Any restrictions or additional requirements known before purchase will be disclosed where required.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">16. Shipping Estimates and Circumstances Beyond Our Control</h2>
        <p>Shipping and delivery may be affected by events outside our reasonable control, including severe weather, natural disasters, transportation interruptions, labor disruptions, customs restrictions, supplier interruptions, government actions, and other unforeseen events.</p>
        <p>We will make reasonable efforts to communicate material delays and assist customers with available solutions.</p>
        <p>Such circumstances do not automatically eliminate our legal obligations to provide required notices, cancellation options, or refunds.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">17. Policy Updates</h2>
        <p>Zolvex Lighting may revise this Shipping Policy to reflect changes in shipping operations, fulfillment methods, carrier requirements, or applicable laws.</p>
        <p>Updated versions will be published on our website with a revised effective date.</p>
        <p>Material changes will not retroactively remove rights or alter applicable shipping commitments for previously placed orders without a lawful basis and any required customer agreement.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">18. Contact Us</h2>
        <p>For shipping questions, delivery concerns, cancellation requests, or order assistance, contact:</p>
        <p>Zolvex Lighting</p>
        <p>Email: <a target="_top" href="mailto:info@zolvexlighting.com" className="underline underline-offset-4">info@zolvexlighting.com</a></p>
        <p>Website: <a target="_top" href="https://www.zolvexlighting.com" className="underline underline-offset-4">www.zolvexlighting.com</a></p>
      </section>

      <p className="italic">This Shipping Policy does not limit any rights customers may have under applicable consumer protection laws.</p>
    </PageShell>
  ),
});

