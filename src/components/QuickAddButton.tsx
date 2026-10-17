import { useRef, useState } from "react";
import { ShoppingBag, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCartStore } from "@/stores/cartStore";
import type { ShopifyProduct } from "@/lib/shopify";

type Variant = ShopifyProduct["node"]["variants"]["edges"][number]["node"];

// Events from this control (and from the dialog, which React bubbles through the portal) must never reach the
// product card's link or image-swipe handlers.
const contain = (e: React.SyntheticEvent) => e.stopPropagation();

/**
 * Quick add-to-bag control shown in the top-right corner of every product card image.
 * - one purchasable variant: adds it immediately
 * - several variants: opens a lightweight selector; nothing is added until the customer picks every option
 * - sold out: disabled
 */
export function QuickAddButton({ product }: { product: ShopifyProduct }) {
  const node = product.node;
  const variants: Variant[] = node.variants.edges.map((e) => e.node);
  const addItem = useCartStore((s) => s.addItem);

  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false); // synchronous guard so rapid clicks cannot start a second request
  const [selection, setSelection] = useState<Record<string, string>>({});

  const soldOut = variants.length === 0 || variants.every((v) => !v.availableForSale);
  const needsChoice = variants.length > 1;

  const add = async (v: Variant): Promise<boolean> => {
    if (busyRef.current) return false;
    busyRef.current = true;
    setBusy(true);
    try {
      const ok = await addItem({
        product,
        variantId: v.id,
        variantTitle: v.title,
        price: v.price,
        quantity: 1,
        selectedOptions: v.selectedOptions || [],
        variantImage: v.image ?? null,
      });
      if (ok) toast.success("Added to bag", { description: node.title });
      else toast.error("Couldn't add this item. Please try again.");
      return ok;
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  };

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (soldOut || busyRef.current) return;
    if (needsChoice) {
      // Only options that have a single value are pre-filled; the customer chooses everything else.
      setSelection(Object.fromEntries(node.options.filter((o) => o.values.length === 1).map((o) => [o.name, o.values[0]])));
      setOpen(true);
    } else {
      void add(variants[0]);
    }
  };

  const chosen =
    node.options.every((o) => selection[o.name])
      ? variants.find((v) => node.options.every((o) => v.selectedOptions.find((s) => s.name === o.name)?.value === selection[o.name]))
      : undefined;

  const valueAvailable = (optName: string, value: string) =>
    variants.some(
      (v) =>
        v.availableForSale &&
        v.selectedOptions.some((s) => s.name === optName && s.value === value) &&
        node.options.every(
          (o) => o.name === optName || !selection[o.name] || v.selectedOptions.some((s) => s.name === o.name && s.value === selection[o.name]),
        ),
    );

  const canConfirm = !!chosen && chosen.availableForSale && !busy;
  const confirmLabel = busy ? null : !chosen ? "Select options" : chosen.availableForSale ? "Add to bag" : "Sold out";
  const shownPrice = chosen?.price ?? node.priceRange.minVariantPrice;
  const thumb = chosen?.image?.url ?? node.images.edges[0]?.node.url;

  return (
    <div
      className="absolute top-3 right-3 max-sm:top-2 max-sm:right-2 z-20"
      onClick={contain}
      onTouchStart={contain}
      onTouchMove={contain}
      onTouchEnd={contain}
      onTouchCancel={contain}
    >
      <button
        type="button"
        onClick={onClick}
        disabled={soldOut}
        aria-label={soldOut ? "Sold out" : needsChoice ? `Choose options for ${node.title}` : `Add ${node.title} to bag`}
        aria-busy={busy}
        className={`relative flex h-10 w-10 max-sm:h-9 max-sm:w-9 items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-[0_2px_8px_rgba(0,0,0,0.18)] transition-all duration-200 before:absolute before:-inset-1 before:content-[''] hover:scale-105 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60 disabled:cursor-not-allowed disabled:shadow-none [@media(hover:none)]:opacity-100 ${
          soldOut ? "opacity-0 group-hover:opacity-50 [@media(hover:none)]:opacity-50" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        {busy && !open ? <Loader2 className="h-[18px] w-[18px] animate-spin" /> : <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />}
      </button>

      <Dialog open={open} onOpenChange={(o) => !busy && setOpen(o)}>
        <DialogContent className="max-w-sm p-5 max-sm:top-auto max-sm:bottom-0 max-sm:max-w-none max-sm:translate-y-0 max-sm:rounded-t-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex gap-3 pr-6 text-left">
              {thumb && <img src={thumb} alt="" className="h-16 w-16 shrink-0 rounded-sm object-cover bg-muted" />}
              <div className="min-w-0">
                <DialogTitle className="text-sm font-medium leading-snug line-clamp-2">{node.title}</DialogTitle>
                <p className="mt-1 text-sm">
                  {chosen ? "" : "From "}
                  {shownPrice.currencyCode} {parseFloat(shownPrice.amount).toFixed(2)}
                </p>
              </div>
            </div>
            <DialogDescription className="sr-only">Choose your options, then add this item to your bag.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {node.options.map((o) => (
              <div key={o.name}>
                <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                  {o.name}
                  {selection[o.name] ? <span className="ml-1.5 normal-case tracking-normal text-foreground">{selection[o.name]}</span> : null}
                </p>
                <div className="flex flex-wrap gap-2">
                  {o.values.map((val) => {
                    const selected = selection[o.name] === val;
                    const available = valueAvailable(o.name, val);
                    return (
                      <button
                        key={val}
                        type="button"
                        disabled={!available || busy}
                        aria-pressed={selected}
                        onClick={() => setSelection((prev) => ({ ...prev, [o.name]: val }))}
                        className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                          selected ? "border-black bg-black text-white" : "border-border bg-background hover:border-black"
                        } ${!available ? "cursor-not-allowed line-through opacity-40" : ""}`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <Button
            className="w-full rounded-full"
            disabled={!canConfirm}
            onClick={async () => {
              if (chosen && (await add(chosen))) setOpen(false);
            }}
          >
            {confirmLabel ?? <Loader2 className="h-4 w-4 animate-spin" />}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
