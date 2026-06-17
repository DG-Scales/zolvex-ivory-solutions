import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductGrid } from "@/components/ProductGrid";
import { CategoryGrid } from "@/components/CategoryGrid";
import { useCartSync } from "@/hooks/useCartSync";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop Lighting — Zolvex" },
      { name: "description", content: "Browse the full Zolvex lighting collection — chandeliers, pendants, wall sconces, floor lamps, and exterior fixtures." },
      { property: "og:title", content: "Shop Lighting — Zolvex" },
      { property: "og:description", content: "Premium designer lighting for interior and exterior spaces." },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  useCartSync();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      {/* Editorial hero */}
      <section className="relative border-b bg-black text-background overflow-hidden">
        <img
          src="https://cdn.shopify.com/s/files/1/0989/6987/8891/files/9119cb4a-d848-4f29-9a4d-f917477d7478.png?v=1781625586"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/30" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-36 grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-8">
            <p className="text-[10px] uppercase tracking-[0.5em] text-background/60 mb-5">
              The Zolvex catalogue · Season 01
            </p>
            <h1 className="font-display text-5xl md:text-7xl leading-[1.02]">
              Shop the <span className="italic font-light">lighting.</span>
            </h1>
            <p className="mt-6 max-w-xl text-background/75 text-sm md:text-base">
              150+ sculpted pieces — marble, crystal, brushed brass and architectural exterior fixtures.
              Filter by collection or scroll the full edit below.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/categories"
                className="inline-flex items-center gap-2 px-5 py-3 bg-background text-foreground text-[11px] uppercase tracking-[0.25em] hover:bg-background/90 transition"
              >
                Browse collections <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/categories/$slug"
                params={{ slug: "trending" }}
                className="inline-flex items-center gap-2 px-5 py-3 border border-background/40 text-[11px] uppercase tracking-[0.25em] hover:bg-background hover:text-foreground transition"
              >
                Trending now
              </Link>
            </div>
          </div>
          <div className="md:col-span-4 hidden md:block">
            <div className="flex flex-col gap-3 text-[10px] uppercase tracking-[0.3em] text-background/60">
              <div className="flex justify-between border-b border-background/15 pb-3"><span>Pieces</span><span className="text-background">150+</span></div>
              <div className="flex justify-between border-b border-background/15 pb-3"><span>Collections</span><span className="text-background">07</span></div>
              <div className="flex justify-between border-b border-background/15 pb-3"><span>Shipping</span><span className="text-background">Free · US</span></div>
              <div className="flex justify-between"><span>Lead time</span><span className="text-background">7–14 days</span></div>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 mx-auto max-w-7xl px-6 py-20 md:py-28 w-full">
        {/* Collections */}
        <div className="mb-24">
          <div className="flex items-end justify-between gap-6 flex-wrap mb-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-3">Curated collections</p>
              <h2 className="font-display text-4xl md:text-5xl">Shop by collection</h2>
            </div>
            <Link
              to="/categories"
              className="text-[11px] uppercase tracking-[0.3em] border-b border-foreground/30 pb-1 hover:border-foreground inline-flex items-center gap-2"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <CategoryGrid group="Collection" columns={3} />
        </div>

        {/* All products */}
        <div className="mb-10 flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-3">Every fixture</p>
            <h2 className="font-display text-4xl md:text-5xl">The full edit</h2>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              Every Zolvex piece in one place. Use the filters to narrow by price, or jump to a specific collection above.
            </p>
          </div>
        </div>
        <ProductGrid />
      </main>
      <SiteFooter />
    </div>
  );
}
