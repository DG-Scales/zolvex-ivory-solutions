import { Link, useNavigate } from "@tanstack/react-router";
import { User, LogOut, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function AccountMenu({ overlay = false }: { overlay?: boolean }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  const buttonClass = overlay
    ? "p-2 rounded-full hover:bg-background/10 text-background"
    : "p-2 rounded-full hover:bg-muted text-foreground";

  if (!user) {
    return (
      <Link
        to="/auth"
        aria-label="Sign in"
        title="Sign in"
        className={buttonClass}
      >
        <User className="w-5 h-5" />
      </Link>
    );
  }

  const initials = (user.user_metadata?.full_name || user.email || "?")
    .split(/[\s@]/)[0]
    .slice(0, 2)
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={buttonClass} aria-label="Account menu">
        <div className="w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center text-[10px] font-medium">
          {initials}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name ?? "Signed in"}</p>
            <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AuthIcon({ overlay = false }: { overlay?: boolean }) {
  return <AccountMenu overlay={overlay} />;
}

// Re-export icons so they're tree-shaken when unused
export const _icons = { LogIn, UserPlus };
