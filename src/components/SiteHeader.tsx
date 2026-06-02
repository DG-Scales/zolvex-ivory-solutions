import { Link } from "@tanstack/react-router";
import { CartDrawer } from "./CartDrawer";
import { Logo } from "./Logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between gap-8">
        <Link to="/" className="flex items-center">
          <Logo size="md" />
        </Link>
        <a href="mailto:zolvex.business@gmail.com" className="hidden md:block text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors">
          zolvex.business@gmail.com
        </a>
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Link to="/shop" className="hover:text-foreground transition-colors">Shop</Link>
          <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
          <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
        </nav>
        <div className="flex items-center justify-end gap-2">
          <CartDrawer />
        </div>
      </div>
    </header>
  );
}
