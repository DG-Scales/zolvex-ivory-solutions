import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export interface ProductReview {
  id: string;
  product_handle: string;
  user_id: string;
  rating: number;
  title: string | null;
  body: string | null;
  author_name: string | null;
  created_at: string;
}

const handleSchema = z
  .string()
  .min(1)
  .max(255)
  .regex(/^[a-zA-Z0-9_-]+$/);

export const listProductReviews = createServerFn({ method: "GET" })
  .inputValidator((input: { handle: string }) =>
    z.object({ handle: handleSchema }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("product_reviews")
      .select("id, product_handle, user_id, rating, title, body, author_name, created_at")
      .eq("product_handle", data.handle)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return { reviews: (rows ?? []) as ProductReview[] };
  });

const submitSchema = z.object({
  handle: handleSchema,
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().max(120).optional().or(z.literal("")),
  body: z.string().trim().max(2000).optional().or(z.literal("")),
  author_name: z.string().trim().max(80).optional().or(z.literal("")),
});

export const submitProductReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => submitSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const payload = {
      product_handle: data.handle,
      user_id: userId,
      rating: data.rating,
      title: data.title?.trim() || null,
      body: data.body?.trim() || null,
      author_name: data.author_name?.trim() || null,
    };
    const { data: row, error } = await supabase
      .from("product_reviews")
      .upsert(payload, { onConflict: "product_handle,user_id" })
      .select("id, product_handle, user_id, rating, title, body, author_name, created_at")
      .single();
    if (error) throw new Error(error.message);
    return { review: row as ProductReview };
  });
