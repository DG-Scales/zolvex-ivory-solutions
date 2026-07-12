import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookies Policy — Zolvex" },
      { name: "description", content: "How Zolvex uses cookies and similar tracking technologies on our website." },
      { property: "og:title", content: "Cookies Policy — Zolvex" },
      { property: "og:description", content: "How Zolvex uses cookies and similar tracking technologies on our website." },
    ],
    links: [{ rel: "canonical", href: "/cookies" }],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  const email = (
    <a className="underline underline-offset-4" target="_top" href="mailto:notify@zolvexlighting.com">
      notify@zolvexlighting.com
    </a>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-3xl px-6 py-20 md:py-28 w-full">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">Legal</p>
        <h1 className="font-display text-5xl md:text-6xl mb-4">Cookies Policy</h1>
        <p className="text-sm text-muted-foreground mb-12">Last updated: June 30, 2026</p>

        <div className="space-y-10 text-foreground/90 leading-relaxed">
          <section className="space-y-4">
            <p>
              This Cookies Policy explains how Zolvex ("we", "us", or "our") uses cookies and similar
              tracking technologies when you visit zolvex.org (the "Site"). It should be read together
              with our Privacy Policy, which describes how we handle your personal information more
              broadly.
            </p>
            <p>
              By continuing to browse or use the Site, you consent to our use of cookies as described
              in this policy. You can change your cookie settings at any time using the controls
              described below.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-3">What Are Cookies</h2>
            <p>
              Cookies are small text files placed on your device when you visit a website. They are
              widely used to make websites work, or work more efficiently, and to provide information
              to the site owners. Similar technologies include pixels, web beacons, local storage,
              and software development kits (SDKs).
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-3">How We Use Cookies</h2>
            <p className="mb-3">We use cookies and similar technologies for the following purposes:</p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>
                <span className="text-foreground/90">Strictly necessary</span> — required to run the
                Site, remember your cart contents, keep you signed in, secure your session, and
                process checkout through Shopify.
              </li>
              <li>
                <span className="text-foreground/90">Performance and analytics</span> — help us
                understand how visitors interact with the Site so we can improve product pages,
                navigation, and site speed (for example, Google Analytics and Shopify analytics).
              </li>
              <li>
                <span className="text-foreground/90">Functional</span> — remember your preferences,
                such as region, currency, and recently viewed products.
              </li>
              <li>
                <span className="text-foreground/90">Advertising and retargeting</span> — measure the
                effectiveness of our marketing and show you relevant Zolvex ads on other sites and
                platforms (for example, Google Ads, Meta, and TikTok).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-3">Third-Party Cookies</h2>
            <p>
              Some cookies are set by third-party services that appear on our pages, including
              Shopify (checkout and store infrastructure), Google (analytics and advertising), Meta,
              TikTok, and OptiMonk (on-site messaging). These providers may collect information about
              your online activities across websites and over time. Their use of your information is
              governed by their own privacy and cookie policies.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-3">Managing Your Cookies</h2>
            <p className="mb-3">You can control cookies in several ways:</p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>
                <span className="text-foreground/90">Browser settings</span> — most browsers let you
                block or delete cookies. See your browser's help pages for instructions.
              </li>
              <li>
                <span className="text-foreground/90">Opt-out tools</span> — you can opt out of
                interest-based advertising via{" "}
                <a className="underline underline-offset-4" target="_blank" rel="noopener noreferrer" href="https://optout.aboutads.info/">
                  optout.aboutads.info
                </a>{" "}
                and{" "}
                <a className="underline underline-offset-4" target="_blank" rel="noopener noreferrer" href="https://www.youronlinechoices.eu/">
                  youronlinechoices.eu
                </a>
                .
              </li>
              <li>
                <span className="text-foreground/90">Do Not Track</span> — we currently do not
                respond to browser Do Not Track signals, but you can rely on the controls above.
              </li>
            </ul>
            <p className="mt-3">
              Blocking strictly necessary cookies may prevent parts of the Site — such as the cart or
              checkout — from working correctly.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-3">Changes To This Policy</h2>
            <p>
              We may update this Cookies Policy from time to time to reflect changes in the
              technologies we use or for legal or regulatory reasons. The "Last updated" date at the
              top of this page indicates when it was most recently revised.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-3">Contact</h2>
            <p>Questions about this Cookies Policy? Email {email}.</p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
