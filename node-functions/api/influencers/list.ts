import type { Influencer } from "../../../src/types";
import { createSupabaseClient } from "../../lib/supabase-client";

interface FilterOptions {
  niche?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  verificationStatus?: string;
}

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
          query = query.ilike("location", `%${filters.location}%`);
        }

        if (filters?.minPrice !== undefined && filters.minPrice > 0) {
          query = query.gte("price_per_post", filters.minPrice);
        }

        if (filters?.maxPrice !== undefined && filters.maxPrice < 150_000_000) {
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
      const filters: FilterOptions = {
        niche: url.searchParams.get("niche") || undefined,
        location: url.searchParams.get("location") || undefined,
        minPrice: url.searchParams.get("minPrice")
          ? Number.parseFloat(url.searchParams.get("minPrice") || "0", 10)
          : undefined,
        maxPrice: url.searchParams.get("maxPrice")
          ? Number.parseFloat(
              url.searchParams.get("maxPrice") || "150000000",
              10
            )
          : undefined,
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
