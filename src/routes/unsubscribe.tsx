import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/unsubscribe")({
  head: () => ({
    meta: [
      { title: "Unsubscribe — Zolvex" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: UnsubscribePage,
});

type State =
  | { kind: "loading" }
  | { kind: "ready" }
  | { kind: "already" }
  | { kind: "invalid" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

function UnsubscribePage() {
  const [state, setState] = useState<State>({ kind: "loading" });
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("token");
    if (!t) {
      setState({ kind: "invalid" });
      return;
    }
    setToken(t);
    fetch(`/email/unsubscribe?token=${encodeURIComponent(t)}`)
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) return setState({ kind: "invalid" });
        if (data.valid === false && data.reason === "already_unsubscribed")
          return setState({ kind: "already" });
        if (data.valid) return setState({ kind: "ready" });
        setState({ kind: "invalid" });
      })
      .catch(() => setState({ kind: "invalid" }));
  }, []);

  const confirm = async () => {
    if (!token) return;
    setState({ kind: "submitting" });
    try {
      const res = await fetch("/email/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState({ kind: "error", message: data?.error || "Something went wrong" });
        return;
      }
      if (data.success === false && data.reason === "already_unsubscribed") {
        setState({ kind: "already" });
        return;
      }
      setState({ kind: "success" });
    } catch {
      setState({ kind: "error", message: "Network error" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-xl px-6 py-20 md:py-28 w-full text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">Email preferences</p>
        <h1 className="font-display text-4xl md:text-5xl mb-6">Unsubscribe</h1>

        {state.kind === "loading" && (
          <p className="text-muted-foreground">Checking your unsubscribe link…</p>
        )}
        {state.kind === "ready" && (
          <>
            <p className="text-muted-foreground mb-8">
              Confirm below to stop receiving emails from Zolvex.
            </p>
            <Button onClick={confirm} size="lg" className="rounded-full px-8">
              Confirm unsubscribe
            </Button>
          </>
        )}
        {state.kind === "submitting" && (
          <p className="text-muted-foreground">Updating your preferences…</p>
        )}
        {state.kind === "success" && (
          <p className="text-foreground">You've been unsubscribed. We're sorry to see you go.</p>
        )}
        {state.kind === "already" && (
          <p className="text-foreground">This email is already unsubscribed.</p>
        )}
        {state.kind === "invalid" && (
          <p className="text-muted-foreground">
            This unsubscribe link is invalid or has expired.
          </p>
        )}
        {state.kind === "error" && (
          <p className="text-destructive">{state.message}</p>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
