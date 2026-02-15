import type { Review } from "../../src/types";
import { createSupabaseClient } from "../lib/supabase-client";

interface ReviewsHandlerDependencies {
  getReviewsByInfluencer: (influencerId: string) => Promise<Review[]>;
}

type ReviewsDependenciesFactory = () => ReviewsHandlerDependencies;

const createReviewsDependencies: ReviewsDependenciesFactory = () => {
  const supabase = createSupabaseClient();

  return {
    async getReviewsByInfluencer(influencerId: string) {
      const { data, error } = await supabase
        .from("reviews")
        .select("*, order:orders(*)")
        .eq("order.influencer_id", influencerId)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data as Review[];
    },
  };
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

export const createReviewsHandler = (
  dependenciesFactory: ReviewsDependenciesFactory = createReviewsDependencies
) =>
  async function onRequest(context: { request: Request }) {
    const { request } = context;
    if (request.method !== "GET") {
      return jsonResponse({ message: "Metode tidak diizinkan." }, 405);
    }

    const url = new URL(request.url);
    const influencerId = url.searchParams.get("influencer_id");

    if (!influencerId) {
      return jsonResponse({ message: "ID influencer wajib diisi." }, 400);
    }

    try {
      const { getReviewsByInfluencer } = dependenciesFactory();
      const reviews = await getReviewsByInfluencer(influencerId);

      return jsonResponse({ data: reviews }, 200);
    } catch (_error) {
      return jsonResponse(
        { message: "Terjadi kesalahan saat memuat ulasan." },
        500
      );
    }
  };

export const onRequest = createReviewsHandler();
