import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductGrid } from "@/components/ProductGrid";
import { useCartSync } from "@/hooks/useCartSync";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { CategoryGrid } from "@/components/CategoryGrid";




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
      <SiteHeader />

      {/* Hero */}
      <section className="relative border-b">
        <div className="mx-auto max-w-5xl px-6 pt-20 pb-24 md:pt-28 md:pb-32 text-center">
          <div className="fade-up flex flex-col items-center">
            <Logo size="xl" showTagline />
            <h1 className="mt-14 font-display text-5xl sm:text-6xl md:text-7xl leading-[1.02] tracking-tight max-w-3xl">
              Illuminate the <em className="italic">everyday.</em>
            </h1>
            <p className="mt-8 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed">
              Premium designer lighting for interior and exterior spaces — chandeliers, pendants, wall sconces, and architectural fixtures. Quietly made, made to last.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="rounded-full px-7">
                <a href="#shop">
                  Shop the collection <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-7">
                <a href="#about">Our story</a>
              </Button>
            </div>
          </div>
        </div>


      </section>

      {/* Categories */}
      <section id="categories" className="mx-auto max-w-7xl px-6 py-24 md:py-32 w-full">
        <div className="flex items-end justify-between mb-12 gap-6 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Shop by category</p>
            <h2 className="font-display text-4xl md:text-5xl">Find your fixture</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            Tap a category to explore the pieces that belong there.
          </p>
        </div>
        <CategoryGrid />
      </section>

      {/* Shop */}
      <section id="shop" className="mx-auto max-w-7xl px-6 py-24 md:py-32 w-full">
        <div className="flex items-end justify-between mb-12 gap-6 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">The collection</p>
            <h2 className="font-display text-4xl md:text-5xl">Shop the lighting</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            Chandeliers, pendants, wall, and exterior fixtures — each one chosen for the room it transforms.
          </p>
        </div>
        <ProductGrid />
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
