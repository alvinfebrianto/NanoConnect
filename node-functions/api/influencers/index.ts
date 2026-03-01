import type { Influencer } from "../../../src/types";
import { createSupabaseClient } from "../../lib/supabase-client";
import {
  attachPublicUserProfiles,
  PUBLIC_USER_PROFILE_SELECT,
  PUBLIC_USER_PROFILE_VIEW,
  sanitizeInfluencerForPublic,
} from "../../lib/user-profiles";

interface InfluencerHandlerDependencies {
  getInfluencer: (influencerId: string) => Promise<Influencer | null>;
}

type InfluencerDependenciesFactory = () => InfluencerHandlerDependencies;

const createInfluencerDependencies: InfluencerDependenciesFactory = () => {
  const supabase = createSupabaseClient();

  return {
    async getInfluencer(influencerId) {
      const { data: influencerData, error } = await supabase
        .from("influencers")
        .select("*")
        .eq("id", influencerId)
        .single();

      if (error?.code === "PGRST116") {
        return null;
      }

      if (error) {
        throw error;
      }

      const { data: userProfile, error: userProfileError } = await supabase
        .from(PUBLIC_USER_PROFILE_VIEW)
        .select(PUBLIC_USER_PROFILE_SELECT)
        .eq("id", influencerData.user_id)
        .maybeSingle();

      if (userProfileError) {
        throw userProfileError;
      }

      const [influencer] = attachPublicUserProfiles(
        [influencerData as Influencer],
        userProfile ? [userProfile] : []
      );

      return influencer;
    },
  };
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

export const createInfluencersHandler = (
  dependenciesFactory: InfluencerDependenciesFactory = createInfluencerDependencies
) =>
  async function onRequest(context: { request: Request }) {
    const { request } = context;
    if (request.method !== "GET") {
      return jsonResponse({ message: "Metode tidak diizinkan." }, 405);
    }

    const url = new URL(request.url);
    const influencerId = url.searchParams.get("id");

    if (!influencerId) {
      return jsonResponse({ message: "ID influencer wajib diisi." }, 400);
    }

    try {
      const { getInfluencer } = dependenciesFactory();
      const influencer = await getInfluencer(influencerId);

      if (!influencer) {
        return jsonResponse({ message: "Influencer tidak ditemukan." }, 404);
      }

      return jsonResponse(
        { data: sanitizeInfluencerForPublic(influencer) },
        200
      );
    } catch (_error) {
      return jsonResponse(
        { message: "Terjadi kesalahan saat memuat influencer." },
        500
      );
    }
  };

export const onRequest = createInfluencersHandler();
