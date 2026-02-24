import type { FilterOptions, Influencer } from "../../../src/types";
import { createSupabaseClient } from "../../lib/supabase-client";

interface InfluencersListHandlerDependencies {
  listInfluencers: (filters?: FilterOptions) => Promise<Influencer[]>;
}

type InfluencersDependenciesFactory = () => InfluencersListHandlerDependencies;

const createInfluencersListDependencies: InfluencersDependenciesFactory =
  () => {
    const supabase = createSupabaseClient();

    return {
      async listInfluencers(filters?: FilterOptions) {
        let query = supabase
          .from("influencers")
          .select("*, user:users(*)")
          .eq("is_available", true);

        if (filters?.niche && filters.niche !== "Semua Niche") {
          query = query.eq("niche", filters.niche);
        }

        if (filters?.location && filters.location !== "Semua Lokasi") {
          const sanitized = filters.location.replace(/[%_]/g, "\\$&");
          query = query.ilike("location", `%${sanitized}%`);
        }

        if (filters?.minPrice !== undefined && filters.minPrice > 0) {
          query = query.gte("price_per_post", filters.minPrice);
        }

        if (filters?.maxPrice !== undefined && filters.maxPrice > 0) {
          query = query.lte("price_per_post", filters.maxPrice);
        }

        if (
          filters?.verificationStatus &&
          filters.verificationStatus !== "all"
        ) {
          query = query.eq("verification_status", filters.verificationStatus);
        }

        query = query.order("followers_count", { ascending: false });

        const { data, error } = await query;

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

      const url = new URL(request.url);
      const maxPriceParam = url.searchParams.get("maxPrice");
      const filters: FilterOptions = {
        niche: url.searchParams.get("niche") || undefined,
        location: url.searchParams.get("location") || undefined,
        minPrice: url.searchParams.get("minPrice")
          ? Number(url.searchParams.get("minPrice"))
          : undefined,
        maxPrice: maxPriceParam ? Number(maxPriceParam) : undefined,
        verificationStatus:
          url.searchParams.get("verificationStatus") || undefined,
      };

      const influencers = await listInfluencers(filters);

      return jsonResponse({ data: influencers }, 200);
    } catch (_error) {
      return jsonResponse(
        { message: "Terjadi kesalahan saat memuat influencer." },
        500
      );
    }
  };

export const onRequest = createInfluencersListHandler();
