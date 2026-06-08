import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductGrid } from "@/components/ProductGrid";
import { useCartSync } from "@/hooks/useCartSync";
import { getCategory, categories } from "@/lib/categories";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/categories/$slug")({
  loader: ({ params }) => {
    const category = getCategory(params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.category.name} — Zolvex` },
          { name: "description", content: loaderData.category.description },
          { property: "og:title", content: `${loaderData.category.name} — Zolvex` },
          { property: "og:description", content: loaderData.category.description },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-2xl px-6 py-32 text-center">
        <h1 className="font-display text-4xl mb-4">Category not found</h1>
        <Link to="/categories" className="text-sm underline">Browse all categories</Link>
      </main>
      <SiteFooter />
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-6">
      <p className="text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
  component: CategoryPage,
});

function CategoryPage() {
  useCartSync();
  const { category } = Route.useLoaderData();
  const isTrending = category.slug === "trending";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      {isTrending ? (
        <section className="relative border-b bg-black text-background overflow-hidden">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_30%,rgba(245,241,232,0.22),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(245,241,232,0.18),transparent_60%)]" />
          <img
            src={category.cover}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/40" />
          <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
            <Link to="/categories" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-background/70 hover:text-background mb-6">
              <ArrowLeft className="h-3 w-3" /> All collections
            </Link>
            <p className="text-[10px] uppercase tracking-[0.5em] text-background/60 mb-5">Editor's edit · Season 01</p>
            <h1 className="font-display text-6xl md:text-8xl leading-[0.95]">
              Trending<br/>
              <span className="italic font-light">Right Now.</span>
            </h1>
            <p className="mt-6 max-w-xl text-background/75">{category.description}</p>
            <div className="mt-8 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-background/60">
              <span className="h-px w-10 bg-background/40" /> Luxury fixtures · From $349
            </div>
          </div>
        </section>
      ) : (
        <section className="relative border-b bg-muted/30">
          <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
            <Link to="/categories" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="h-3 w-3" /> All collections
            </Link>
            {category.tagline && (
              <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-4">{category.tagline}</p>
            )}
            <h1 className="font-display text-5xl md:text-7xl">{category.name}</h1>
            <p className="mt-4 max-w-xl text-muted-foreground">{category.description}</p>
          </div>
        </section>
      )}

      <main className="flex-1 mx-auto max-w-7xl px-6 py-16 md:py-24 w-full">
        <ProductGrid category={category} />

        <div className="mt-24 border-t pt-12">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">Explore more</p>
          <div className="flex flex-wrap gap-2">
            {categories.filter((c) => c.slug !== category.slug).map((c) => (
              <Link
                key={c.slug}
                to="/categories/$slug"
                params={{ slug: c.slug }}
                className="text-xs uppercase tracking-[0.2em] px-4 py-2 rounded-full border hover:bg-foreground hover:text-background transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
