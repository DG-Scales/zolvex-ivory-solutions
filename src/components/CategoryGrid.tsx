import { Link } from "@tanstack/react-router";
import { categories as ALL, type CategoryGroup } from "@/lib/categories";

export function CategoryGrid({
  group,
  columns = 4,
  excludeSlugs,
}: {
  group?: CategoryGroup;
  columns?: 2 | 3 | 4;
  excludeSlugs?: string[];
}) {
  let list = group ? ALL.filter((c) => c.group === group) : ALL;
  if (excludeSlugs?.length) {
    list = list.filter((c) => !excludeSlugs.includes(c.slug));
  }

  const gridCols =
    columns === 2
      ? "grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7"
      : columns === 3
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8"
        : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6";

  const aspect = columns === 3 ? "aspect-[3/4]" : "aspect-[4/5]";

  return (
    <div className={gridCols}>
      {list.map((cat) => (
        <Link
          key={cat.slug}
          to="/categories/$slug"
          params={{ slug: cat.slug }}
          className={`group relative block overflow-hidden rounded-lg bg-muted ${aspect}`}
        >
          <img
            src={cat.cover}
            alt={cat.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 text-background">
            {cat.tagline && (
              <p className="mb-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] opacity-80 line-clamp-1">
                {cat.tagline}
              </p>
            )}
            <h3 className="font-display text-lg sm:text-xl md:text-2xl leading-tight">{cat.name}</h3>
            <p className="mt-1.5 text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] opacity-80 line-clamp-1">
              Shop {cat.name} →
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
