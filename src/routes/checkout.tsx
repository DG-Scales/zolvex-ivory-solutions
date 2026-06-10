import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useCartStore } from "@/stores/cartStore";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Zolvex" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutRedirect,
});

function CheckoutRedirect() {
  const navigate = useNavigate();
  const { getCheckoutUrl, syncCart } = useCartStore();

  useEffect(() => {
    syncCart();
    const url = getCheckoutUrl();
    if (url) {
      window.location.replace(url);
    } else {
      navigate({ to: "/shop" });
    }
  }, [getCheckoutUrl, navigate, syncCart]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-6 h-6 animate-spin" />
    </div>
  );
}
