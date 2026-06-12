import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Zolvex" },
      { name: "description", content: "The terms governing your use of the Zolvex website and purchases." },
    ],
  }),
  component: () => (
    <PageShell eyebrow="Legal" title="Terms of Service" lead={`Last updated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`}>
      <section><h2 className="font-display text-2xl mb-3">1. Agreement</h2><p>By accessing zolvex.com or placing an order, you agree to these terms. If you don't agree, please don't use the site.</p></section>
      <section><h2 className="font-display text-2xl mb-3">2. Orders</h2><p>All orders are subject to availability and acceptance. We reserve the right to refuse or cancel an order at our discretion.</p></section>
      <section><h2 className="font-display text-2xl mb-3">3. Pricing</h2><p>Prices are listed in USD and may change without notice. Taxes and shipping are calculated at checkout.</p></section>
      <section><h2 className="font-display text-2xl mb-3">4. Intellectual Property</h2><p>All content on this site — text, images, logos, and code — is the property of Zolvex and may not be reused without permission.</p></section>
      <section><h2 className="font-display text-2xl mb-3">5. Liability</h2><p>Zolvex is not liable for any indirect or consequential damages arising from the use of our products or website.</p></section>
      <section><h2 className="font-display text-2xl mb-3">6. Contact</h2><p>Questions about these terms? Email <a className="underline" target="_top" href="mailto:zolvex.business@gmail.com">zolvex.business@gmail.com</a>.</p></section>
    </PageShell>
  ),
});
