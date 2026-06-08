import { Link } from "@tanstack/react-router";
import { CartDrawer } from "./CartDrawer";
import { Logo } from "./Logo";
import { SearchDialog } from "./SearchDialog";
import { PromoBar } from "./PromoBar";
import { AccountMenu } from "./AccountMenu";
import { categoriesByGroup } from "@/lib/categories";


export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const types = categoriesByGroup("Type");
  const rooms = categoriesByGroup("Room");

  const headerClass = overlay
    ? "bg-transparent text-background"
    : "border-b border-border/40 bg-background/85 backdrop-blur-md text-foreground";

  const linkBase = overlay
    ? "text-background/90 hover:text-background transition-colors"
    : "text-muted-foreground hover:text-foreground transition-colors";

  return (
    <div className={overlay ? "absolute inset-x-0 top-0 z-40" : "sticky top-0 z-40"}>
      <PromoBar />
      <header className={headerClass}>
        <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between gap-8">
          <Link to="/" className="flex items-center">
            <Logo size="md" tone={overlay ? "light" : "dark"} />
          </Link>
          <nav className={`hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.2em]`}>
            <div className="group relative">
              <Link to="/shop" className={`${linkBase} py-6`}>Shop</Link>
              <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all absolute left-1/2 top-full -translate-x-1/2 w-[640px] bg-background text-foreground border border-border/60 shadow-xl p-8 grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] tracking-[0.3em] text-muted-foreground mb-4">By type</p>
                  <ul className="space-y-2">
                    {types.map((c) => (
                      <li key={c.slug}>
                        <Link to="/categories/$slug" params={{ slug: c.slug }} className="text-sm normal-case tracking-normal text-foreground/80 hover:text-foreground transition-colors">
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.3em] text-muted-foreground mb-4">By room</p>
                  <ul className="space-y-2">
                    {rooms.map((c) => (
                      <li key={c.slug}>
                        <Link to="/categories/$slug" params={{ slug: c.slug }} className="text-sm normal-case tracking-normal text-foreground/80 hover:text-foreground transition-colors">
                          {c.name}
                        </Link>
                      </li>
                    ))}
                    <li className="pt-2 border-t border-border/40 mt-3">
                      <Link to="/shop" className="text-xs tracking-[0.2em] uppercase text-foreground hover:opacity-60">
                        Shop all →
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <Link to="/categories" className={linkBase}>Categories</Link>
            <Link to="/about" className={linkBase}>About</Link>
            <Link to="/contact" className={linkBase}>Contact</Link>
          </nav>
          <div className="flex items-center justify-end gap-1">
            <SearchDialog overlay={overlay} />
            <AccountMenu overlay={overlay} />
            <CartDrawer />
          </div>


        </div>
      </header>
    </div>
  );
}
