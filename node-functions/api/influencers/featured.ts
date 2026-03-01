import type { Influencer } from "../../../src/types";
import { createSupabaseClient } from "../../lib/supabase-client";
import {
  attachPublicUserProfiles,
  PUBLIC_USER_PROFILE_SELECT,
  PUBLIC_USER_PROFILE_VIEW,
  sanitizeInfluencersForPublic,
} from "../../lib/user-profiles";

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
          .select("*")
          .eq("verification_status", "verified")
          .eq("is_available", true)
          .order("followers_count", { ascending: false })
          .limit(6);

        if (error) {
          throw error;
        }

        const influencers = (data as Influencer[]) ?? [];
        if (influencers.length === 0) {
          return [];
        }

        const userIds = [...new Set(influencers.map((item) => item.user_id))];
        const { data: userProfiles, error: userProfilesError } = await supabase
          .from(PUBLIC_USER_PROFILE_VIEW)
          .select(PUBLIC_USER_PROFILE_SELECT)
          .in("id", userIds);

        if (userProfilesError) {
          throw userProfilesError;
        }

        return attachPublicUserProfiles(influencers, userProfiles ?? []);
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
      const publicInfluencers = sanitizeInfluencersForPublic(influencers);

      return jsonResponse({ data: publicInfluencers }, 200);
    } catch (_error) {
      return jsonResponse(
        { message: "Terjadi kesalahan saat memuat influencer." },
        500
      );
    }
  };

export const onRequest = createFeaturedInfluencersHandler();
