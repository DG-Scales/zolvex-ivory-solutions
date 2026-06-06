import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 mt-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20 grid gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo size="md" showTagline />
          <p className="mt-8 text-sm text-muted-foreground max-w-xs leading-relaxed">
            Zolvex — premium designer lighting for considered interiors and exteriors. Chandeliers, pendants, wall lights and more.
          </p>
        </div>

        <div className="md:col-span-2">
          <h4 className="font-display text-lg mb-5 text-foreground">Shop</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/shop" className="hover:text-foreground transition-colors">All Products</Link></li>
            <li><Link to="/gift-cards" className="hover:text-foreground transition-colors">Gift Cards</Link></li>
            <li><Link to="/shipping" className="hover:text-foreground transition-colors">Shipping</Link></li>
            <li><Link to="/returns" className="hover:text-foreground transition-colors">Returns</Link></li>
            <li><Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="font-display text-lg mb-5 text-foreground">Company</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
            <li><Link to="/story" className="hover:text-foreground transition-colors">Our Story</Link></li>
            <li><Link to="/craftsmanship" className="hover:text-foreground transition-colors">Craftsmanship</Link></li>
            <li><Link to="/sustainability" className="hover:text-foreground transition-colors">Sustainability</Link></li>
            <li><Link to="/wholesale" className="hover:text-foreground transition-colors">Wholesale</Link></li>
            <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
            <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
          </ul>
        </div>


        <div className="md:col-span-3">
          <h4 className="font-display text-lg mb-5 text-foreground">Contact</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>
              <a href="mailto:zolvex.business@gmail.com" className="hover:text-foreground transition-colors break-all">
                zolvex.business@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row justify-between text-xs text-muted-foreground gap-2">
          <p>© 2026 Zolvex. All rights reserved.</p>
          <p>Crafted with intention.</p>
        </div>
      </div>
    </footer>
  );
}
