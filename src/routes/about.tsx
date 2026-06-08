import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — Zolvex" },
      { name: "description", content: "How Zolvex began, what we believe about light, and the standards behind every fixture we carry." },
      { property: "og:title", content: "Our Story — Zolvex" },
      { property: "og:description", content: "A curated lighting house for considered spaces." },
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
              Zolvex is a curated lighting house for interiors and exteriors — built around a single conviction: the right fixture quietly changes the way a room is lived in.
            </p>
          </div>
        </section>

        {/* Origin */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-6 py-20 md:py-28 grid md:grid-cols-[200px_1fr] gap-10">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Origin</p>
            <div className="space-y-6 text-foreground/90 leading-relaxed text-lg max-w-2xl">
              <p>
                Zolvex was started by people who kept running into the same problem — beautiful rooms let down by ordinary light. Catalogs full of fixtures that looked the part online and felt thin in person. Long lead times, vague specs, and finishes that aged poorly within a season.
              </p>
              <p>
                We set out to build the opposite. A small, deliberate catalog. Pieces we would specify in our own homes. Sources we could vouch for. A short conversation away from a real person who knows the product.
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
                <h3 className="font-display text-2xl mb-4">Built to last</h3>
                <p className="text-foreground/80 leading-relaxed">
                  Solid brass, hand-blown glass, machined steel, finishes that age with grace. Nothing disposable, nothing hollow.
                </p>
              </div>
              <div>
                <h3 className="font-display text-2xl mb-4">Designed with intent</h3>
                <p className="text-foreground/80 leading-relaxed">
                  Every piece earns its place. Proportion, restraint, a point of view — work from designers who treat lighting as architecture.
                </p>
              </div>
              <div>
                <h3 className="font-display text-2xl mb-4">Light that feels right</h3>
                <p className="text-foreground/80 leading-relaxed">
                  Color temperature, throw, glare, dimming behavior. Specs matter, but the way light lands on a wall or a face is the whole point.
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
                We partner directly with trusted studios and workshops around the world. That keeps the catalog tight, the quality consistent, and the story behind each piece honest.
              </p>
              <p>
                We ship globally — free across the United States, with no minimum. We stand behind every order, and we answer every email personally. Whether you're finishing a single room or specifying an entire home, we're here to help you choose light that belongs.
              </p>
            </div>
          </div>
        </section>

        {/* By the numbers */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-6 py-20 md:py-24 grid grid-cols-2 md:grid-cols-4 gap-10">
            {[
              { k: "Free", v: "U.S. shipping, no minimum" },
              { k: "Global", v: "Delivery to your door" },
              { k: "Direct", v: "Sourced from the studio" },
              { k: "Personal", v: "Every email answered" },
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
              Chandeliers, pendants, sconces, floor lamps, and exterior fixtures — chosen one piece at a time.
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
