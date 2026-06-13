import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Zolvex" },
      { name: "description", content: "Get in touch with the Zolvex lighting team. We answer every message personally." },
      { property: "og:title", content: "Contact — Zolvex" },
      { property: "og:description", content: "Specification help, custom finishes, or trade enquiries." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-3xl px-6 py-20 md:py-28 w-full">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">Contact</p>
        <h1 className="font-display text-5xl md:text-6xl mb-6">Get in touch.</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Specification questions, custom finishes, bespoke chandeliers, or a fixture you wish existed — we read every message.
          Email us directly at <a href="mailto:zolvex.business@gmail.com" target="_top" className="text-foreground underline underline-offset-4">zolvex.business@gmail.com</a> or use the form below.
        </p>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const data = new FormData(form);
            const payload = {
              kind: "contact",
              name: String(data.get("name") || ""),
              email: String(data.get("email") || ""),
              subject: String(data.get("subject") || ""),
              message: String(data.get("message") || ""),
            };
            const t = toast.loading("Sending your message…");
            try {
              const res = await fetch("/api/public/notify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              });
              if (!res.ok) throw new Error("Send failed");
              toast.success("Message sent. We'll get back to you shortly.", { id: t });
              form.reset();
            } catch {
              toast.error("Something went wrong. Please email us directly at zolvex.business@gmail.com.", { id: t });
            }
          }}
          className="space-y-5"
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <input name="name" required placeholder="Name" className="w-full px-5 py-3 rounded-full bg-transparent border border-border focus:outline-none focus:border-foreground" />
            <input name="email" required type="email" placeholder="Email" className="w-full px-5 py-3 rounded-full bg-transparent border border-border focus:outline-none focus:border-foreground" />
          </div>
          <input name="subject" placeholder="Subject" className="w-full px-5 py-3 rounded-full bg-transparent border border-border focus:outline-none focus:border-foreground" />
          <textarea name="message" required placeholder="Your message" rows={6} className="w-full px-5 py-4 rounded-3xl bg-transparent border border-border focus:outline-none focus:border-foreground resize-none" />
          <Button type="submit" size="lg" className="rounded-full px-8">Send message</Button>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
