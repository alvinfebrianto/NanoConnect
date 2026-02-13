import type { Influencer } from "../../src/types";
import { createSupabaseClient } from "../lib/supabase-client";

interface InfluencerHandlerDependencies {
  getInfluencer: (influencerId: string) => Promise<Influencer | null>;
}

type InfluencerDependenciesFactory = () => InfluencerHandlerDependencies;

const createInfluencerDependencies: InfluencerDependenciesFactory = () => {
  const supabase = createSupabaseClient();

  return {
    async getInfluencer(influencerId) {
      const { data, error } = await supabase
        .from("influencers")
        .select("*, user:users(*)")
        .eq("id", influencerId)
        .single();

      if (error?.code === "PGRST116") {
        return null;
      }

      if (error) {
        throw error;
      }

      return data as Influencer;
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

      return jsonResponse({ data: influencer }, 200);
    } catch (error) {
      console.error("Gagal memuat influencer:", error);
      return jsonResponse(
        { message: "Terjadi kesalahan saat memuat influencer." },
        500
      );
    }
  };

export const onRequest = createInfluencersHandler();
