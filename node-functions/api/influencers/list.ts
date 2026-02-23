import type { Influencer } from "../../../src/types";
import { createSupabaseClient } from "../../lib/supabase-client";

interface InfluencersListHandlerDependencies {
  listInfluencers: () => Promise<Influencer[]>;
}

type InfluencersDependenciesFactory = () => InfluencersListHandlerDependencies;

const createInfluencersListDependencies: InfluencersDependenciesFactory =
  () => {
    const supabase = createSupabaseClient();

    return {
      async listInfluencers() {
        const { data, error } = await supabase
          .from("influencers")
          .select("*, user:users(*)")
          .eq("is_available", true)
          .order("followers_count", { ascending: false });

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

export const createInfluencersListHandler = (
  dependenciesFactory: InfluencersDependenciesFactory = createInfluencersListDependencies
) =>
  async function onRequest(context: { request: Request }) {
    const { request } = context;
    if (request.method !== "GET") {
      return jsonResponse({ message: "Metode tidak diizinkan." }, 405);
    }

    try {
      const { listInfluencers } = dependenciesFactory();
      const influencers = await listInfluencers();

      return jsonResponse({ data: influencers }, 200);
    } catch (_error) {
      return jsonResponse(
        { message: "Terjadi kesalahan saat memuat influencer." },
        500
      );
    }
  };

export const onRequest = createInfluencersListHandler();
