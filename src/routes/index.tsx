import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductGrid } from "@/components/ProductGrid";
import { useCartSync } from "@/hooks/useCartSync";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { CategoryGrid } from "@/components/CategoryGrid";
import heroImage from "@/assets/hero-room.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zolvex — Premium designer lighting" },
      { name: "description", content: "Zolvex is a curated destination for premium designer lighting — chandeliers, pendants, wall sconces, and outdoor lights for considered interiors." },
      { property: "og:title", content: "Zolvex — Premium designer lighting" },
      { property: "og:description", content: "Chandeliers, pendants, wall lights and exterior fixtures. Considered lighting, made to last." },
    ],
  }),
  component: Index,
});

function Index() {
  useCartSync();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Full-bleed hero with overlay header */}
      <section className="relative h-screen min-h-[640px] w-full overflow-hidden">
        <img
          src={heroImage}
          alt="Designer chandelier illuminating a warm, textured bedroom interior"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <SiteHeader overlay />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 text-background">
          <p className="font-display italic text-lg md:text-xl opacity-95">A quieter kind of brilliance</p>
          <h1 className="mt-4 font-display uppercase tracking-[0.06em] text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] max-w-5xl">
            Fixtures Made for the Rooms You Live In
          </h1>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="rounded-full px-7">
              <Link to="/shop">
                Browse the catalog <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-7 bg-transparent text-background border-background/60 hover:bg-background hover:text-foreground">
              <Link to="/story">How Zolvex began</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Start by fixture type */}
      <section id="categories" className="mx-auto max-w-7xl px-6 py-24 md:py-32 w-full">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Find your fixture</p>
          <h2 className="font-display text-4xl md:text-5xl">Start with the shape of the light.</h2>
          <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
            Sculptural ceiling pieces, low pendants, soft wall washes, and weather-built exteriors — sorted by what they do, not how they look.
          </p>
        </div>
        <CategoryGrid group="Type" />
      </section>

      {/* By room */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32 w-full">
          <div className="flex items-end justify-between mb-12 gap-6 flex-wrap">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Room by room</p>
              <h2 className="font-display text-4xl md:text-5xl">A fixture for every corner</h2>
            </div>
            <Link to="/categories" className="text-xs uppercase tracking-[0.2em] hover:opacity-60">
              See every category →
            </Link>
          </div>
          <CategoryGrid group="Room" columns={4} />
        </div>
      </section>

      {/* Top Picks */}
      <section id="shop" className="mx-auto max-w-7xl px-6 py-24 md:py-32 w-full">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">What we're loving</p>
          <h2 className="font-display text-4xl md:text-5xl">Pieces worth a second look</h2>
          <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
            A short list of fixtures the studio keeps returning to — quietly distinctive, easy to live with.
          </p>
        </div>
        <ProductGrid limit={8} />
        <div className="text-center mt-14">
          <Button asChild variant="outline" size="lg" className="rounded-full px-8">
            <Link to="/shop">
              See the full catalog <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-t">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">About</p>
            <h2 className="font-display text-4xl md:text-6xl leading-tight">
              Lighting that <em className="italic">shapes</em> a room.
            </h2>
          </div>
          <div className="space-y-5 text-muted-foreground leading-relaxed">
            <p>
              Zolvex is a curated lighting house — chandeliers, pendants, wall sconces, and exterior fixtures chosen for the rooms, façades, and gardens they transform. Every piece is selected for its craft, its material honesty, and the quality of light it casts.
            </p>
            <p>
              No noise. No filler. Just considered lighting, made to last.
            </p>
            <div className="pt-4">
              <Link to="/story" className="text-xs uppercase tracking-[0.2em] underline underline-offset-4 hover:opacity-60">
                Read our story →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="border-t bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32 text-center">
          <p className="text-xs uppercase tracking-[0.3em] opacity-60 mb-6">Stay in touch</p>
          <h2 className="font-display text-4xl md:text-6xl mb-6">Be the first to know.</h2>
          <p className="max-w-md mx-auto opacity-70 mb-10">
            New fixtures, limited collections, and quiet stories on light — sent only when there's something worth saying.
          </p>
          <form className="flex max-w-md mx-auto gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              required
              placeholder="your@email.com"
              className="flex-1 px-5 py-3 rounded-full bg-transparent border border-background/30 placeholder:text-background/40 focus:outline-none focus:border-background"
            />
            <Button type="submit" variant="secondary" className="rounded-full px-6">
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
