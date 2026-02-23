import type { Influencer } from "../../../src/types";
import { createSupabaseClient } from "../../lib/supabase-client";

interface FeaturedInfluencersHandlerDependencies {
  getFeaturedInfluencers: () => Promise<Influencer[]>;
}

type FeaturedInfluencersDependenciesFactory =
  () => FeaturedInfluencersHandlerDependencies;

const createFeaturedInfluencersDependencies: FeaturedInfluencersDependenciesFactory =
  () => {
    const supabase = createSupabaseClient();

    return {
      async getFeaturedInfluencers() {
        const { data, error } = await supabase
          .from("influencers")
          .select("*, user:users(*)")
          .eq("verification_status", "verified")
          .eq("is_available", true)
          .order("followers_count", { ascending: false })
          .limit(6);

        if (error) {
          throw error;
        }

        return data as Influencer[];
      },
    };
  };

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

export const createFeaturedInfluencersHandler = (
  dependenciesFactory: FeaturedInfluencersDependenciesFactory = createFeaturedInfluencersDependencies
) =>
  async function onRequest(context: { request: Request }) {
    const { request } = context;
    if (request.method !== "GET") {
      return jsonResponse({ message: "Metode tidak diizinkan." }, 405);
    }

    try {
      const { getFeaturedInfluencers } = dependenciesFactory();
      const influencers = await getFeaturedInfluencers();

      return jsonResponse({ data: influencers }, 200);
    } catch (_error) {
      return jsonResponse(
        { message: "Terjadi kesalahan saat memuat influencer." },
        500
      );
    }
  };

export const onRequest = createFeaturedInfluencersHandler();
