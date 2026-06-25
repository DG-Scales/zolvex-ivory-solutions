import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/returns")({
  head: () => ({
    meta: [
      { title: "Return Policy — Zolvex" },
      { name: "description", content: "30-day return policy. Contact zolvex.business@gmail.com to start a return." },
      { property: "og:title", content: "Return Policy — Zolvex" },
      { property: "og:description", content: "30-day return policy. Contact zolvex.business@gmail.com to start a return." },
    ],
  }),
  component: ReturnsPage,
});

function ReturnsPage() {
  const email = (
    <a target="_top" href="mailto:zolvex.business@gmail.com" className="underline underline-offset-4 hover:opacity-80">
      zolvex.business@gmail.com
    </a>
  );

  return (
    <PageShell
      eyebrow="Support"
      title="Return Policy"
      lead="We have a 30-day return policy, which means you have 30 days after receiving your item to request a return."
    >
      <section className="space-y-4">
        <p>
          To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You'll also need the receipt or proof of purchase.
        </p>
        <p>
          To start a return, you can contact us at {email}. Please note that returns will need to be sent to the following address: Please do not ship items back without contacting us first. Email us at {email}, and we will provide you with the correct return instructions and address based on your order.
        </p>
        <p>
          If your return is accepted, we'll send you a return shipping label, as well as instructions on how and where to send your package. Items sent back to us without first requesting a return will not be accepted.
        </p>
        <p>You can always contact us for any return questions at {email}.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">Damages and issues</h2>
        <p>
          Please inspect your order upon reception and contact us immediately if the item is defective, damaged, or if you receive the wrong item, so that we can evaluate the issue and make it right.
        </p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">Exceptions / non-returnable items</h2>
        <p>
          Certain types of items cannot be returned, like perishable goods (such as food, flowers, or plants), custom products (such as special orders or personalized items), and personal care goods (such as beauty products). We also do not accept returns for hazardous materials, flammable liquids, or gases. Please get in touch if you have questions or concerns about your specific item.
        </p>
        <p className="mt-4">Unfortunately, we cannot accept returns on sale items or gift cards.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">Exchanges</h2>
        <p>
          The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item.
        </p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">European Union 14-day cooling-off period</h2>
        <p>
          Notwithstanding the above, if the merchandise is being shipped into the European Union, you have the right to cancel or return your order within 14 days, for any reason and without a justification. As above, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You'll also need the receipt or proof of purchase.
        </p>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">Refunds</h2>
        <p>
          We will notify you once we've received and inspected your return, and let you know if the refund has been approved or not. If approved, you'll be automatically refunded on your original payment method within 10 business days. Please remember it can take some time for your bank or credit card company to process and post the refund, too.
        </p>
        <p className="mt-4">
          If more than 15 business days have passed since we've approved your return, please contact us at {email}.
        </p>
      </section>
    </PageShell>
  );
}
