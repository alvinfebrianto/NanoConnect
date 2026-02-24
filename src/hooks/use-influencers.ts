import { useQuery } from "@tanstack/react-query";
import type { FilterOptions, Influencer } from "@/types";

async function fetchInfluencers(
  filters?: FilterOptions
): Promise<Influencer[]> {
  const searchParams = new URLSearchParams();

  if (filters?.niche && filters.niche !== "Semua Niche") {
    searchParams.set("niche", filters.niche);
  }

  if (filters?.location && filters.location !== "Semua Lokasi") {
    searchParams.set("location", filters.location);
  }

  if (filters?.minPrice !== undefined && filters.minPrice > 0) {
    searchParams.set("minPrice", filters.minPrice.toString());
  }

  if (filters?.maxPrice !== undefined && filters.maxPrice < 150_000_000) {
    searchParams.set("maxPrice", filters.maxPrice.toString());
  }

  if (filters?.verificationStatus && filters.verificationStatus !== "all") {
    searchParams.set("verificationStatus", filters.verificationStatus);
  }

  const queryString = searchParams.toString();
  const url = queryString
    ? `/api/influencers/list?${queryString}`
    : "/api/influencers/list";

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch influencers");
  }
  const payload = (await response.json()) as { data: Influencer[] };
  return payload.data || [];
}

export function useInfluencers(filters?: FilterOptions) {
  return useQuery({
    queryKey: ["influencers", filters],
    queryFn: () => fetchInfluencers(filters),
  });
}
