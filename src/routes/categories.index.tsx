import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CategoryGrid } from "@/components/CategoryGrid";
import { categoriesByGroup, getCategory } from "@/lib/categories";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/categories/")({
  head: () => ({
    meta: [
      { title: "Collections — Zolvex" },
      { name: "description", content: "Browse Zolvex lighting by collection — chandeliers, pendants, wall sconces, ceiling lights, and exterior fixtures." },
      { property: "og:title", content: "Collections — Zolvex" },
      { property: "og:description", content: "Shop premium designer lighting by collection." },
    ],
  }),
  component: CategoriesIndex,
});

function CategoriesIndex() {
  const trending = getCategory("trending");
  const featured = categoriesByGroup("Featured");
  const collections = categoriesByGroup("Collection");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      {/* Editorial hero */}
      <section className="relative border-b bg-black text-background overflow-hidden">
        {trending && (
          <img
            src={trending.cover}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/40" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <p className="text-[10px] uppercase tracking-[0.5em] text-background/60 mb-5">
            Seven worlds · One studio
          </p>
          <h1 className="font-display text-5xl md:text-7xl leading-[1.02] max-w-3xl">
            The <span className="italic font-light">collections.</span>
          </h1>
          <p className="mt-6 max-w-xl text-background/75 text-sm md:text-base">
            From sculptural marble chandeliers to architectural exterior fixtures — every
            Zolvex piece is grouped into a collection so you can shop the language, not just the lamp.
          </p>
        </div>
      </section>

      <main className="flex-1 mx-auto max-w-7xl px-6 py-20 md:py-28 w-full">
        {/* Featured — trending hero card */}
        {featured.length > 0 && (
          <section className="mb-24">
            <div className="flex items-end justify-between gap-6 flex-wrap mb-8">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-3">Editor's edit</p>
                <h2 className="font-display text-3xl md:text-4xl">Featured</h2>
              </div>
            </div>
            <CategoryGrid group="Featured" columns={2} />
          </section>
        )}

        {/* Collections grid */}
        <section>
          <div className="flex items-end justify-between gap-6 flex-wrap mb-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-3">By category</p>
              <h2 className="font-display text-3xl md:text-4xl">All collections</h2>
              <p className="mt-3 max-w-md text-sm text-muted-foreground">
                {collections.length} curated collections — from intimate sconces to room-defining chandeliers.
              </p>
            </div>
            <Link
              to="/shop"
              className="text-[11px] uppercase tracking-[0.3em] border-b border-foreground/30 pb-1 hover:border-foreground inline-flex items-center gap-2"
            >
              Shop everything <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <CategoryGrid group="Collection" columns={3} />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
