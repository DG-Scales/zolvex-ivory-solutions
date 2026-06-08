import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import {
  listProductReviews,
  submitProductReview,
  type ProductReview,
} from "@/lib/reviews.functions";

function StarRow({
  value,
  onChange,
  size = 16,
  interactive = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  interactive?: boolean;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = (hover || value) >= i;
        const Cmp = interactive ? "button" : "span";
        return (
          <Cmp
            key={i}
            type={interactive ? "button" : undefined}
            onClick={interactive ? () => onChange?.(i) : undefined}
            onMouseEnter={interactive ? () => setHover(i) : undefined}
            onMouseLeave={interactive ? () => setHover(0) : undefined}
            aria-label={interactive ? `Rate ${i} stars` : undefined}
            className={interactive ? "p-0.5" : "inline-flex"}
          >
            <Star
              style={{ width: size, height: size }}
              className={filled ? "fill-foreground text-foreground" : "text-muted-foreground"}
            />
          </Cmp>
        );
      })}
    </div>
  );
}

function ReviewForm({ handle, onDone }: { handle: string; onDone: () => void }) {
  const submit = useServerFn(submitProductReview);
  const qc = useQueryClient();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [name, setName] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      submit({
        data: {
          handle,
          rating,
          title,
          body,
          author_name: name,
        },
      }),
    onSuccess: () => {
      toast.success("Thanks for your review!");
      qc.invalidateQueries({ queryKey: ["reviews", handle] });
      onDone();
    },
    onError: (e: Error) => toast.error(e.message || "Could not submit review"),
  });

  return (
    <form
      className="border border-border rounded-md p-5 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
    >
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Your rating</p>
        <StarRow value={rating} onChange={setRating} interactive size={24} />
      </div>
      <Input
        placeholder="Your name (optional)"
        value={name}
        maxLength={80}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        placeholder="Headline (optional)"
        value={title}
        maxLength={120}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        placeholder="Tell others what you thought…"
        value={body}
        maxLength={2000}
        rows={4}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit review"}
        </Button>
      </div>
    </form>
  );
}

export function ProductReviews({ handle }: { handle: string }) {
  const list = useServerFn(listProductReviews);
  const { user } = useAuth();
  const [writing, setWriting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["reviews", handle],
    queryFn: () => list({ data: { handle } }),
  });

  const reviews: ProductReview[] = data?.reviews ?? [];
  const avg =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

  return (
    <section className="mt-16 border-t border-border pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-2xl md:text-3xl">Reviews</h2>
          <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
            <StarRow value={Math.round(avg)} />
            <span>
              {reviews.length === 0
                ? "No reviews yet"
                : `${avg.toFixed(1)} · ${reviews.length} review${reviews.length === 1 ? "" : "s"}`}
            </span>
          </div>
        </div>
        {user ? (
          !writing && (
            <Button onClick={() => setWriting(true)} className="rounded-full">
              Leave a review
            </Button>
          )
        ) : (
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/auth">Sign in to leave a review</Link>
          </Button>
        )}
      </div>

      {writing && user && (
        <div className="mb-8">
          <ReviewForm handle={handle} onDone={() => setWriting(false)} />
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-sm text-muted-foreground py-8 border border-dashed border-border rounded-md text-center">
          Be the first to share your thoughts on this product.
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {reviews.map((r) => (
            <li key={r.id} className="py-5">
              <div className="flex items-center justify-between gap-3 mb-1">
                <div className="flex items-center gap-3">
                  <StarRow value={r.rating} />
                  {r.title && <span className="text-sm font-medium">{r.title}</span>}
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(r.created_at).toLocaleDateString()}
                </span>
              </div>
              {r.body && (
                <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                  {r.body}
                </p>
              )}
              {r.author_name && (
                <p className="text-xs text-muted-foreground mt-2">— {r.author_name}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
