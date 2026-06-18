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

      <section className="relative border-b bg-black text-background overflow-hidden">
        {isTrending && (
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_30%,rgba(245,241,232,0.22),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(245,241,232,0.18),transparent_60%)]" />
        )}
        <img
          src={category.cover}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/30" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32 grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <Link to="/categories" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-background/70 hover:text-background mb-6">
              <ArrowLeft className="h-3 w-3" /> All collections
            </Link>
            {isTrending ? (
              <>
                <p className="text-[10px] uppercase tracking-[0.5em] text-background/60 mb-5">Editor's edit · Season 01</p>
                <h1 className="font-display text-6xl md:text-8xl leading-[0.95]">
                  Trending<br/>
                  <span className="italic font-light">Right Now.</span>
                </h1>
                <p className="mt-6 max-w-xl text-background/75">{category.description}</p>
                <div className="mt-8 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-background/60">
                  <span className="h-px w-10 bg-background/40" /> Luxury pieces
                </div>
              </>
            ) : (
              <>
                {category.tagline && (
                  <p className="text-[10px] uppercase tracking-[0.5em] text-background/60 mb-5">{category.tagline}</p>
                )}
                <h1 className="font-display text-5xl md:text-7xl leading-[1.02]">{category.name}</h1>
                <p className="mt-5 max-w-xl text-background/75 text-sm md:text-base">{category.description}</p>
              </>
            )}
          </div>
          <div className="md:col-span-4 hidden md:block text-[10px] uppercase tracking-[0.3em] text-background/60">
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 items-baseline">
              <dt>Collection</dt>
              <dd className="text-background text-right truncate normal-case tracking-normal text-xs">{category.name}</dd>
              <dt className="border-t border-background/15 pt-3">Shipping</dt>
              <dd className="text-background text-right border-t border-background/15 pt-3">U.S. Free</dd>
            </dl>
          </div>
        </div>
      </section>

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
