import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/socials")({
  head: () => ({
    meta: [
      { title: "Socials — Zolvex" },
    { name: "description", content: "Follow Zolvex on Instagram and TikTok for new products, sales, and updates." },
    { property: "og:title", content: "Socials — Zolvex" },
    { property: "og:description", content: "Follow Zolvex on Instagram and TikTok for new products, sales, and updates." },
    ],
  }),
  component: SocialsPage,
});

function SocialsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 w-full">
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-6 py-24 md:py-36 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">Stay Connected</p>
            <h1 className="font-display text-5xl md:text-7xl leading-[1.05] mb-8 max-w-3xl mx-auto">
              Follow the light.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Be the first to see new products, exclusive sales, and what we are building next — follow and like to stay along for the journey.
            </p>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
            <div className="grid md:grid-cols-2 gap-10 md:gap-16">
              <a
                href="https://instagram.com/zolvex.lighting"
                target="_blank"
                rel="noopener noreferrer"
                className="group block border border-border rounded-2xl p-8 md:p-10 hover:border-foreground/30 transition-colors"
              >
                <div className="flex items-center gap-4 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  <h3 className="font-display text-2xl">Instagram</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Get the first look at new products and exclusive sales. Follow and like to stay updated on everything we are dropping next.
                </p>
                <span className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.15em] text-foreground group-hover:opacity-60 transition-opacity">
                  @zolvex.lighting <span aria-hidden="true">→</span>
                </span>
              </a>

              <a
                href="https://www.tiktok.com/@zolvex.org"
                target="_blank"
                rel="noopener noreferrer"
                className="group block border border-border rounded-2xl p-8 md:p-10 hover:border-foreground/30 transition-colors"
              >
                <div className="flex items-center gap-4 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                  <h3 className="font-display text-2xl">TikTok</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Catch new releases, flash sales, and behind-the-scenes updates. Follow and like to see the journey as it happens.
                </p>
                <span className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.15em] text-foreground group-hover:opacity-60 transition-opacity">
                  @zolvex.org <span aria-hidden="true">→</span>
                </span>
              </a>
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-5xl px-6 py-24 md:py-32 text-center">
            <h2 className="font-display text-4xl md:text-5xl mb-6">Tag us in your space</h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              We love seeing Zolvex fixtures in the wild. Share your install with <span className="text-foreground font-medium">#zolvex</span> for a chance to be featured.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
