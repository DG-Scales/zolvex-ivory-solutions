import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

export const CartIconLink = () => {
  const items = useCartStore((s) => s.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Button asChild variant="ghost" size="icon" className="relative rounded-full hover:bg-accent">
      <Link to="/cart" aria-label="View cart">
        <ShoppingBag className="h-5 w-5" />
        {totalItems > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground">
            {totalItems}
          </Badge>
        )}
      </Link>
    </Button>
  );
};
