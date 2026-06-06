import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Zolvex" },
      { name: "description", content: "How Zolvex collects, uses, and protects your information." },
      { property: "og:title", content: "Privacy Policy — Zolvex" },
      { property: "og:description", content: "How Zolvex collects, uses, and protects your information." },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-3xl px-6 py-20 md:py-28 w-full">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">Legal</p>
        <h1 className="font-display text-5xl md:text-6xl mb-4">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-12">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="space-y-10 text-foreground/90 leading-relaxed">
          <section>
            <h2 className="font-display text-2xl mb-3">1. Introduction</h2>
            <p>
              Zolvex ("we", "us", "our") respects your privacy. This policy explains what information we collect when you visit our store, how we use it, and the choices you have about it.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-3">2. Information We Collect</h2>
            <p className="mb-3">We collect information you provide directly, such as when you place an order, create an account, or contact us. This may include:</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Name, shipping & billing address</li>
              <li>Email address and phone number</li>
              <li>Payment information (processed securely through Shopify)</li>
              <li>Order history and preferences</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-3">3. How We Use Your Information</h2>
            <p>
              We use your information to fulfill orders, communicate about your purchases, improve our products and storefront, and comply with legal obligations. We do not sell your personal data.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-3">4. Cookies & Analytics</h2>
            <p>
              Our site uses essential cookies to operate the cart and checkout, plus optional analytics cookies that help us understand how visitors use the site. You can disable non-essential cookies in your browser settings.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-3">5. Payments</h2>
            <p>
              Payments are processed by Shopify. We never store full card numbers on our servers. Please review Shopify's privacy policy for details on how they handle payment data.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-3">6. Your Rights</h2>
            <p>
              Depending on where you live, you may have the right to access, correct, or delete the personal information we hold about you. To exercise these rights, contact us at the email below.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-3">7. Contact</h2>
            <p>
              Questions about this policy? Reach us at <a className="underline" href="mailto:zolvex.business@gmail.com">zolvex.business@gmail.com</a>.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
