import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductGrid } from "@/components/ProductGrid";
import { useCartSync } from "@/hooks/useCartSync";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zolvex — Where problems meet solutions" },
      { name: "description", content: "Zolvex is a curated ecommerce destination where everyday problems meet thoughtful solutions. Shop the collection." },
      { property: "og:title", content: "Zolvex — Where problems meet solutions" },
      { property: "og:description", content: "Curated solutions for everyday problems. Minimal, considered, made to last." },
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
              Where problems meet <em className="italic">solutions.</em>
            </h1>
            <p className="mt-8 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed">
              A curated catalog of considered objects — designed to remove friction from everyday life. No clutter. No compromise.
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

      {/* Shop */}
      <section id="shop" className="mx-auto max-w-7xl px-6 py-24 md:py-32 w-full">
        <div className="flex items-end justify-between mb-12 gap-6 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">The collection</p>
            <h2 className="font-display text-4xl md:text-5xl">Shop everything</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            Every piece earns its place. Built once, made to last.
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
              Designed to <em className="italic">solve</em>, not to sell.
            </h2>
          </div>
          <div className="space-y-5 text-muted-foreground leading-relaxed">
            <p>
              Zolvex began with a simple belief: that the best products quietly answer a problem you didn't know how to name. We curate objects with intent — items chosen for their craft, their utility, and the way they fit into a life well-lived.
            </p>
            <p>
              No noise. No filler. Just considered solutions to the friction of the everyday.
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
            New drops, restocks, and quiet stories — sent only when there's something worth saying.
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
