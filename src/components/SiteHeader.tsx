import { Link } from "@tanstack/react-router";
import { CartDrawer } from "./CartDrawer";
import { Logo } from "./Logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 h-20 grid grid-cols-3 items-center">
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <a href="/#shop" className="hover:text-foreground transition-colors">Shop</a>
          <a href="/#about" className="hover:text-foreground transition-colors">About</a>
          <a href="/#contact" className="hover:text-foreground transition-colors">Contact</a>
        </nav>
        <div className="md:hidden" />
        <Link to="/" className="flex justify-center">
          <Logo size="md" />
        </Link>
        <div className="flex items-center justify-end gap-2">
          <CartDrawer />
        </div>
      </div>
    </header>
  );
}
