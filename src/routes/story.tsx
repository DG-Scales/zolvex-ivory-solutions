import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Compass, Gem, Hand, Sparkles } from "lucide-react";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "Our Story — Zolvex | Modern Residential Lighting" },
      {
        name: "description",
        content:
          "About Zolvex, an online retailer of modern residential lighting: what we sell, how we choose products, and how orders are fulfilled.",
      },
      { property: "og:title", content: "Our Story — Zolvex" },
      {
        property: "og:description",
        content:
          "About Zolvex, an online retailer of modern residential lighting.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://www.zolvexlighting.com/story" },
    ],
    links: [{ rel: "canonical", href: "https://www.zolvexlighting.com/story" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "Our Story — Zolvex",
          url: "https://www.zolvexlighting.com/story",
          description:
            "About Zolvex, an online retailer of modern residential lighting.",
          publisher: {
            "@type": "Organization",
            name: "Zolvex",
            url: "https://www.zolvexlighting.com",
            email: "zolvex.business@gmail.com",
          },
        }),
      },
    ],
  }),
  component: StoryPage,
});

const values = [
  {
    icon: Hand,
    title: "Clear information",
    body: "Each product page lists the materials, dimensions and options supplied for that fixture.",
  },
  {
    icon: Gem,
    title: "Honest descriptions",
    body: "We describe products as they are listed, including finish, size and what is or isn't included.",
  },
  {
    icon: Compass,
    title: "Considered design",
    body: "A curated catalog of modern styles for living rooms, bedrooms, dining spaces, hallways and outdoor areas.",
  },
  {
    icon: Sparkles,
    title: "The quality of light",
    body: "The fixture is the object; the light is the point. Warmth, throw, and shadow always come first.",
  },
];

const timeline = [
  {
    year: "Beginning",
    title: "A simple idea",
    body: "Zolvex began with a simple observation: the right fixture changes how a room feels, and finding it should be easier than it is.",
  },
  {
    year: "How it works",
    title: "An online retailer",
    body: "Zolvex is an online retailer. Orders are fulfilled through our supplier and fulfillment partners and shipped directly to you; delivery estimates are on our Shipping page.",
  },
  {
    year: "Today",
    title: "A curated house for considered light",
    body: "Chandeliers, pendants, wall sconces, floor and table lamps, and exterior fixtures — each one chosen for the room, façade, or garden it transforms.",
  },
  {
    year: "Ahead",
    title: "A growing, carefully chosen catalog",
    body: "We add new pieces over time and retire ones that no longer fit, and we are here to help with questions about any order.",
  },
];

function StoryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-6 pt-20 md:pt-28 pb-16 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-5">Our Story</p>
          <h1 className="font-display text-5xl md:text-7xl leading-[1.05] mb-8">
            Modern lighting,<br />clearly described.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Zolvex is an online lighting retailer. We exist because light is the first thing you feel when you walk into a room — and the last thing you remember when you leave.
          </p>
        </section>

        {/* Mission */}
        <section className="border-y border-border/60 bg-muted/30">
          <div className="mx-auto max-w-5xl px-6 py-20 grid md:grid-cols-12 gap-10 items-start">
            <p className="md:col-span-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">Our Mission</p>
            <div className="md:col-span-9 space-y-6">
              <p className="font-display text-3xl md:text-4xl leading-snug text-foreground">
                To bring quiet, considered lighting into the rooms, façades, and gardens of people who care how a space feels.
              </p>
              <p className="text-muted-foreground leading-relaxed text-lg">
                We curate modern residential lighting — chandeliers, pendants, wall sconces, ceiling lights, floor lamps, and exterior fixtures — from our supplier network. Each piece is selected for its design and the light it gives, and described as accurately as we can.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">What we believe</p>
            <h2 className="font-display text-4xl md:text-5xl">The values behind every fixture.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="rounded-2xl border border-border/60 bg-card p-7 hover:border-foreground/40 transition-colors"
                >
                  <Icon className="h-6 w-6 mb-5 text-foreground" strokeWidth={1.5} />
                  <h3 className="font-display text-xl mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.body}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Timeline */}
        <section className="border-t border-border/60 bg-muted/20">
          <div className="mx-auto max-w-4xl px-6 py-20 md:py-28">
            <div className="text-center mb-14">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">The journey</p>
              <h2 className="font-display text-4xl md:text-5xl">How Zolvex came to be.</h2>
            </div>
            <ol className="relative border-l border-border/70 pl-8 space-y-12">
              {timeline.map((t) => (
                <li key={t.year} className="relative">
                  <span className="absolute -left-[37px] top-1.5 h-3 w-3 rounded-full bg-foreground ring-4 ring-background" />
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">{t.year}</p>
                  <h3 className="font-display text-2xl md:text-3xl mb-3">{t.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* How we choose */}
        <section className="mx-auto max-w-3xl px-6 py-20 md:py-28">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">How we choose</p>
          <h2 className="font-display text-4xl md:text-5xl mb-6">The standards behind the catalog.</h2>
          <div className="space-y-5 text-foreground/90 leading-relaxed text-lg">
            <p>
              We look for fixtures with clear specifications, a coherent design, and the kind of light that suits the room it is meant for. If we can't describe a product accurately, we don't list it.
            </p>
            <p>
              Product details come from our suppliers; if you see something that doesn't look right, email us and we will look into it.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border/60">
          <div className="mx-auto max-w-3xl px-6 py-20 md:py-24 text-center">
            <h2 className="font-display text-4xl md:text-5xl mb-5">Find a piece that fits the room.</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
              Browse the collection, or write to us about a space you're designing. Write to us about a product or an order at{" "}
              <a target="_top" href="mailto:zolvex.business@gmail.com" className="text-foreground underline underline-offset-4">
                zolvex.business@gmail.com
              </a>
              .
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link to="/shop">Shop the collection</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-8">
                <Link to="/contact">Get in touch</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
