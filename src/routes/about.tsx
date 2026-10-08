import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — Zolvex" },
      { name: "description", content: "About Zolvex, an online retailer of modern residential lighting: how we choose products and how orders are fulfilled." },
      { property: "og:title", content: "Our Story — Zolvex" },
      { property: "og:description", content: "An online retailer of modern residential lighting." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 w-full">
        {/* Hero */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-6 py-24 md:py-36">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">Our Story</p>
            <h1 className="font-display text-5xl md:text-7xl leading-[1.05] mb-8 max-w-3xl">
              Light, treated with the seriousness it deserves.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
              Zolvex is an online lighting retailer offering a curated selection of modern residential lighting — built around a single conviction: the right fixture quietly changes the way a room is lived in.
            </p>
          </div>
        </section>

        {/* Origin */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-6 py-20 md:py-28 grid md:grid-cols-[200px_1fr] gap-10">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Origin</p>
            <div className="space-y-6 text-foreground/90 leading-relaxed text-lg max-w-2xl">
              <p>
                Zolvex is an online retailer of modern residential lighting. We started with a simple observation: beautiful rooms are often let down by ordinary light, and finding the right fixture shouldn't mean wading through endless catalogs with vague specifications.
              </p>
              <p>
                We curate chandeliers, pendants, wall sconces, ceiling lights and outdoor fixtures, and we describe each product's materials, dimensions and options as clearly as we can, so you know what you are buying. If something isn't clear, email us before you order.
              </p>
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="border-b border-border bg-muted/30">
          <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-12">What we believe</p>
            <div className="grid md:grid-cols-3 gap-10 md:gap-16">
              <div>
                <h3 className="font-display text-2xl mb-4">Clear information</h3>
                <p className="text-foreground/80 leading-relaxed">
                  Each product page lists the materials, dimensions and options provided for that fixture, so you can compare before you buy.
                </p>
              </div>
              <div>
                <h3 className="font-display text-2xl mb-4">A curated selection</h3>
                <p className="text-foreground/80 leading-relaxed">
                  We choose modern styles for living rooms, bedrooms, dining spaces, hallways and outdoor areas, with an emphasis on clean lines and considered proportions.
                </p>
              </div>
              <div>
                <h3 className="font-display text-2xl mb-4">Light that feels right</h3>
                <p className="text-foreground/80 leading-relaxed">
                  Color temperature, size and mounting details are shown where available. Specs matter, but the way light lands on a wall or a face is the whole point.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How we work */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-6 py-20 md:py-28 grid md:grid-cols-[200px_1fr] gap-10">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">How we work</p>
            <div className="space-y-6 text-foreground/90 leading-relaxed text-lg max-w-2xl">
              <p>
                Zolvex is an online retailer. Orders are fulfilled through our supplier and fulfillment partners and shipped directly to you, so delivery estimates are listed on our Shipping page and tracking is provided when your order ships.
              </p>
              <p>
                We currently ship to addresses in the United States only — free, with no minimum. If you have a question about a product or an order, email us and we'll reply as soon as we can.
              </p>
            </div>
          </div>
        </section>

        {/* By the numbers */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-6 py-20 md:py-24 grid grid-cols-2 md:grid-cols-4 gap-10">
            {[
              { k: "Free", v: "U.S. shipping, no minimum" },
              { k: "U.S.", v: "Delivery within the United States" },
              { k: "Clear", v: "Specifications on every product page" },
              { k: "Support", v: "Email info@zolvexlighting.com" },
            ].map((item) => (
              <div key={item.k}>
                <p className="font-display text-3xl md:text-4xl mb-2">{item.k}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.v}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="mx-auto max-w-5xl px-6 py-24 md:py-32 text-center">
            <h2 className="font-display text-4xl md:text-5xl mb-6">Explore the collection</h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Chandeliers, pendants, sconces, floor lamps, and exterior fixtures for the rooms and spaces you live in.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/categories"
                className="inline-flex items-center justify-center px-8 py-3 bg-foreground text-background text-sm uppercase tracking-[0.2em] hover:opacity-90 transition"
              >
                Shop categories
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-3 border border-foreground text-foreground text-sm uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
