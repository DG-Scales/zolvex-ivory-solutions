import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCartStore } from "@/stores/cartStore";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, Lock, ShieldCheck, Truck, ArrowLeft, Loader2 } from "lucide-react";
import { useEffect } from "react";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Zolvex" },
      { name: "description", content: "Review your bag and proceed to secure checkout powered by Shopify." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, isLoading, isSyncing, updateQuantity, removeItem, getCheckoutUrl, syncCart } = useCartStore();

  useEffect(() => {
    syncCart();
  }, [syncCart]);

  const currency = items[0]?.price.currencyCode || "USD";
  const subtotal = items.reduce((sum, i) => sum + parseFloat(i.price.amount) * i.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n);

  const handleCheckout = () => {
    const url = getCheckoutUrl();
    if (url) window.location.href = url;
  };

  if (items.length === 0) {
    return (
      <Shell>
        <section className="container max-w-2xl mx-auto px-6 py-24 text-center">
          <h1 className="font-display text-4xl md:text-5xl mb-4">Your bag is empty</h1>
          <p className="text-muted-foreground mb-8">
            Discover lighting designed to transform your space.
          </p>
          <Button asChild size="lg" className="rounded-full">
            <Link to="/shop">Continue shopping</Link>
          </Button>
        </section>
      </Shell>
    );
  }

  return (
    <Shell>
      <section className="container max-w-6xl mx-auto px-6 py-12 md:py-16">
        <button
          onClick={() => navigate({ to: "/shop" })}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Continue shopping
        </button>

        <div className="mb-10">
          <h1 className="font-display text-4xl md:text-5xl">Checkout</h1>
          <p className="text-muted-foreground mt-2">
            Review your order. Payment is processed securely on Shopify.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_420px] gap-10 lg:gap-16">
          {/* Line items */}
          <div>
            <h2 className="font-display text-2xl mb-6">
              Your order <span className="text-muted-foreground text-base">({totalItems})</span>
            </h2>
            <ul className="divide-y border-y">
              {items.map((item) => {
                const image = item.product.node.images?.edges?.[0]?.node;
                const lineTotal = parseFloat(item.price.amount) * item.quantity;
                return (
                  <li key={item.variantId} className="py-6 flex gap-5">
                    <div className="w-24 h-24 md:w-28 md:h-28 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      {image && (
                        <img src={image.url} alt={image.altText || item.product.node.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-medium truncate">{item.product.node.title}</h3>
                          {item.selectedOptions.length > 0 && (
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {item.selectedOptions.map((o) => o.value).join(" • ")}
                            </p>
                          )}
                        </div>
                        <p className="font-medium whitespace-nowrap">{fmt(lineTotal)}</p>
                      </div>
                      <div className="mt-auto pt-4 flex items-center justify-between">
                        <div className="flex items-center border rounded-full">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            disabled={isLoading}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            disabled={isLoading}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-10 grid sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Secure checkout</p>
                  <p className="text-muted-foreground text-xs mt-0.5">SSL encrypted via Shopify</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                <Truck className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Insured shipping</p>
                  <p className="text-muted-foreground text-xs mt-0.5">Tracked worldwide</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                <Lock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Buyer protection</p>
                  <p className="text-muted-foreground text-xs mt-0.5">30-day returns</p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="rounded-xl border bg-card p-6 md:p-8 shadow-sm">
              <h2 className="font-display text-2xl mb-6">Order summary</h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-medium">{fmt(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd className="text-muted-foreground">Calculated at checkout</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Taxes</dt>
                  <dd className="text-muted-foreground">Calculated at checkout</dd>
                </div>
              </dl>
              <Separator className="my-5" />
              <div className="flex justify-between items-baseline mb-6">
                <span className="font-display text-lg">Total</span>
                <span className="font-display text-2xl">{fmt(subtotal)}</span>
              </div>

              <Button
                onClick={handleCheckout}
                size="lg"
                className="w-full rounded-full"
                disabled={isLoading || isSyncing || !getCheckoutUrl()}
              >
                {isLoading || isSyncing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" /> Proceed to secure checkout
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-4 leading-relaxed">
                You'll be redirected to Shopify's secure checkout to enter your shipping and payment details.
                We accept all major cards, Apple Pay, Google Pay, and Shop Pay.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </Shell>
  );
}
