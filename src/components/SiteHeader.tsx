import { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { CartIconLink } from "./CartIconLink";
import { Logo } from "./Logo";
import { SearchDialog } from "./SearchDialog";
import { PromoBar } from "./PromoBar";
import { AccountMenu } from "./AccountMenu";
import { categoriesByGroup } from "@/lib/categories";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const collections = categoriesByGroup("Collection");
  const featured = categoriesByGroup("Featured");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastYRef = useRef(0);

  useEffect(() => {
    if (overlay) return;
    lastYRef.current = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const y = Math.max(0, window.scrollY);
        const delta = y - lastYRef.current;
        if (Math.abs(delta) < 8) {
          ticking = false;
          return;
        }
        if (y < 24) {
          setVisible(true);
        } else if (delta > 0) {
          // scrolling down -> hide
          setVisible(false);
        } else {
          // scrolling up -> show
          setVisible(true);
        }
        lastYRef.current = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  const headerClass = overlay
    ? "bg-transparent text-background"
    : "border-b border-border/40 bg-background/85 backdrop-blur-md text-foreground";

  const linkBase = overlay
    ? "text-background/90 hover:text-background transition-colors"
    : "text-muted-foreground hover:text-foreground transition-colors";

  const close = () => setMobileOpen(false);

  return (
    <>
    {!overlay && <div aria-hidden className="h-[100px] md:h-[120px]" />}
    <div
      className={
        overlay
          ? "absolute inset-x-0 top-0 z-40"
          : `fixed inset-x-0 top-0 z-40 transition-transform duration-300 ease-out will-change-transform ${visible ? "translate-y-0" : "-translate-y-full"}`
      }
    >
      <PromoBar />
      <header className={headerClass}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between gap-3 md:gap-8">
          <div className="flex items-center gap-1 md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={overlay ? "text-background hover:bg-background/10 hover:text-background" : ""}
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] max-w-sm bg-background p-0 flex flex-col">
                <SheetHeader className="px-6 pt-6 pb-4 border-b">
                  <SheetTitle className="sr-only">Menu</SheetTitle>
                  <Logo size="md" tone="dark" />
                </SheetHeader>
                <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                  <div>
                    <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3">Browse</p>
                    <ul className="space-y-3">
                      <li><Link to="/shop" onClick={close} className="text-base text-foreground">Shop all</Link></li>
                      <li><Link to="/categories/$slug" params={{ slug: "trending" }} onClick={close} className="text-base text-foreground">Trending</Link></li>
                      <li><Link to="/socials" onClick={close} className="text-base text-foreground">Socials</Link></li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3">Featured</p>
                    <ul className="space-y-3">
                      {featured.map((c) => (
                        <li key={c.slug}>
                          <Link to="/categories/$slug" params={{ slug: c.slug }} onClick={close} className="text-sm text-foreground/80">
                            {c.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-4 border-t space-y-3">
                    <Link to="/about" onClick={close} className="block text-sm text-foreground/80">About</Link>
                    <Link to="/contact" onClick={close} className="block text-sm text-foreground/80">Contact</Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          <Link to="/" className="flex items-center">
            <Logo size="md" tone={overlay ? "light" : "dark"} />
          </Link>
          <nav className={`hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.2em]`}>
            <div className="group relative">
              <Link to="/shop" className={`${linkBase} py-6`}>Shop</Link>
              <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all absolute left-1/2 top-full -translate-x-1/2 w-[640px] bg-background text-foreground border border-border/60 shadow-xl p-8 grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] tracking-[0.3em] text-muted-foreground mb-4">Featured</p>
                  <ul className="space-y-2">
                    {featured.map((c) => (
                      <li key={c.slug}>
                        <Link to="/categories/$slug" params={{ slug: c.slug }} className="text-sm normal-case tracking-normal text-foreground/80 hover:text-foreground transition-colors">
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.3em] text-muted-foreground mb-4">Collections</p>
                  <ul className="space-y-2">
                    {collections.map((c) => (
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
            <Link to="/socials" className={linkBase}>Socials</Link>
            <Link to="/categories/$slug" params={{ slug: "trending" }} className={linkBase}>Trending</Link>
            <Link to="/about" className={linkBase}>About</Link>
            <Link to="/contact" className={linkBase}>Contact</Link>
          </nav>
          <div className="flex items-center justify-end gap-0.5 sm:gap-1">
            <SearchDialog overlay={overlay} />
            <AccountMenu overlay={overlay} />
            <CartIconLink />
          </div>
        </div>
      </header>
    </div>
    </>
  );
}
