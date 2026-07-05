import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Compass, Gem, Hand, Sparkles } from "lucide-react";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "Our Story — Zolvex | Premium Designer Lighting House" },
      {
        name: "description",
        content:
          "The story of Zolvex — a curated designer lighting house built on material honesty, considered design, and the quality of light. Discover our mission, values, and journey.",
      },
      { property: "og:title", content: "Our Story — Zolvex" },
      {
        property: "og:description",
        content:
          "How Zolvex began, what we believe, and the standards behind every chandelier, pendant, and sconce we carry.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://zolvex.org/story" },
    ],
    links: [{ rel: "canonical", href: "https://zolvex.org/story" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "Our Story — Zolvex",
          url: "https://zolvex.org/story",
          description:
            "The story behind Zolvex — a curated designer lighting house built on material honesty and considered design.",
          publisher: {
            "@type": "Organization",
            name: "Zolvex",
            url: "https://zolvex.org",
            email: "notify@zolvex.org",
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
    title: "Made well",
    body: "Honest materials, careful finishing, and fixtures vetted before they ever reach a customer.",
  },
  {
    icon: Gem,
    title: "Material honesty",
    body: "Brass, steel, glass, marble, stone. Real things, aged with grace — never imitations.",
  },
  {
    icon: Compass,
    title: "Considered design",
    body: "A curated catalog built to last. Every piece earns its place. No filler, no trend chasing.",
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
    title: "A frustration with modern lighting",
    body: "Zolvex began with a simple observation — most lighting today looks the part but feels hollow. We wanted a house where every piece had a reason to be there.",
  },
  {
    year: "Year One",
    title: "Building the catalog, slowly",
    body: "We spent the first year meeting studios and workshops, vetting samples, and rejecting far more than we accepted. What remained became the foundation of the collection.",
  },
  {
    year: "Today",
    title: "A curated house for considered light",
    body: "Chandeliers, pendants, wall sconces, floor and table lamps, and exterior fixtures — each one chosen for the room, façade, or garden it transforms.",
  },
  {
    year: "Ahead",
    title: "Small, intentional, and built to last",
    body: "Built to last in every sense. A handful of new pieces each year, retired ones that no longer fit, and a relationship with every customer we ship to.",
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
            Crafted with care,<br />built to endure.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Zolvex is a curated designer lighting house. We exist because light is the first thing you feel when you walk into a room — and the last thing you remember when you leave.
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
                We curate premium designer lighting from trusted studios and workshops — chandeliers, pendants, wall sconces, table and floor lamps, and exterior fixtures. Every piece is selected for the quality of its materials, the integrity of its design, and the light it gives.
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
              Every piece is judged against the same quiet standards. It has to be made well. It has to earn its place — no filler, no novelty, nothing chasing a trend. And the light it gives has to feel right. Warm, considered, true to the room.
            </p>
            <p>
              If a fixture fails any one of these, it doesn't belong here. The catalog is small by design — each piece chosen with patience, held to a standard we would apply to our own homes.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border/60">
          <div className="mx-auto max-w-3xl px-6 py-20 md:py-24 text-center">
            <h2 className="font-display text-4xl md:text-5xl mb-5">Find a piece that fits the room.</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
              Browse the collection, or write to us about a space you're designing. We answer every message personally at{" "}
              <a target="_top" href="mailto:notify@zolvex.org" className="text-foreground underline underline-offset-4">
                notify@zolvex.org
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
