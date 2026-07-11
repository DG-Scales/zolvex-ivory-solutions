import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductGrid } from "@/components/ProductGrid";
import { useCartSync } from "@/hooks/useCartSync";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { CategoryGrid } from "@/components/CategoryGrid";
import { TrendingCarousel } from "@/components/TrendingCarousel";
import { MakersPick } from "@/components/MakersPick";
import { toast } from "sonner";
import { LiveVideos } from "@/components/LiveVideos";
import { JudgeMeAllReviewsSection } from "@/components/JudgeMe";
import heroImage from "@/assets/hero-room.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zolvex – Where Design Comes to Light" },
      { name: "description", content: "Shop 150+ premium chandeliers, pendant lights, wall sconces & outdoor fixtures. Free shipping on all US orders." },
      { property: "og:title", content: "Zolvex – Where Design Comes to Light" },
      { property: "og:description", content: "Shop 150+ premium chandeliers, pendant lights, wall sconces & outdoor fixtures. Free shipping on all US orders." },
      { property: "og:image", content: "https://zolvex.org/__l5e/assets-v1/1846088b-1f18-4f42-8258-63676567670b/zolvex-og.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "1200" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://zolvex.org/__l5e/assets-v1/1846088b-1f18-4f42-8258-63676567670b/zolvex-og.png" },
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
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <SiteHeader overlay />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 text-background">
          <p className="font-display text-lg md:text-xl opacity-95">The Light For Every Room</p>
          <h1 className="mt-4 font-display uppercase tracking-[0.06em] text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] max-w-5xl">
            Designed to Illuminate Every Space
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
            <Button asChild variant="outline" size="lg" className="rounded-full px-7 bg-transparent text-background border-background/60 hover:bg-background hover:text-foreground">
              <Link to="/socials">Check out our socials</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Maker's Pick */}
      <section id="makers-pick" className="mx-auto max-w-7xl px-6 pt-24 md:pt-32 pb-16 md:pb-24 w-full">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Maker's Pick</p>
          <h2 className="font-display text-3xl md:text-4xl">The finest pieces, hand-selected</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Our top three most premium fixtures — chosen for presence, craft, and the statement they make in any room.
          </p>
        </div>
        <MakersPick />
      </section>

      {/* Trending highlight */}
      <TrendingCarousel />

      {/* Customer reviews (auto-hides if store has no reviews yet) */}
      <JudgeMeAllReviewsSection />

      {/* Collections */}
      <section id="categories" className="mx-auto max-w-7xl px-6 py-24 md:py-32 w-full">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Shop the collections</p>
          <h2 className="font-display text-3xl md:text-4xl">Curated collections</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            From statement chandeliers to architectural exteriors — every collection is curated for craft, material honesty and the quality of light it casts.
          </p>
        </div>
        <CategoryGrid columns={3} excludeSlugs={["trending"]} />
      </section>

      {/* Live product videos */}
      <LiveVideos />





      {/* Featured Fixtures */}
      <section id="shop" className="border-t border-black/10 bg-[#F5F1E8] text-black">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32 w-full">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.3em] text-black/60 mb-3">Featured Fixtures</p>
            <h2 className="font-display text-4xl md:text-5xl uppercase tracking-[0.04em]">A Curated Edit In Ivory & Black</h2>
            <p className="mt-4 max-w-xl mx-auto text-black/65">
              A Short List Of Fixtures The Studio Keeps Returning To — Quietly Distinctive, Easy To Live With.
            </p>
            <div className="mt-6 mx-auto h-px w-16 bg-black/70" />
          </div>
          <ProductGrid limit={8} variant="featured" showFilters={false} />
          <div className="text-center mt-14">
            <Button asChild size="lg" className="rounded-none px-8 bg-black text-[#F5F1E8] hover:bg-black/85">
              <Link to="/shop">
                See The Full Catalog <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
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
          <form
            className="flex flex-col sm:flex-row max-w-md mx-auto gap-2"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const email = String(new FormData(form).get("email") || "");
              const t = toast.loading("Subscribing…");
              try {
                const res = await fetch("/api/public/notify", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ kind: "subscribe", email }),
                });
                if (!res.ok) throw new Error("Subscribe failed");
                toast.success("You're on the list. Welcome to Zolvex.", { id: t });
                form.reset();
              } catch {
                toast.error("Couldn't subscribe right now. Please try again.", { id: t });
              }
            }}
          >
            <input
              name="email"
              type="email"
              required
              placeholder="your@email.com"
              className="flex-1 min-w-0 px-5 py-3 rounded-full bg-transparent border border-background/30 placeholder:text-background/40 focus:outline-none focus:border-background"
            />
            <Button type="submit" variant="secondary" className="rounded-full px-6 shrink-0">
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
