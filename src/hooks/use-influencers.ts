import { useQuery } from "@tanstack/react-query";
import type { Influencer } from "@/types";

async function fetchInfluencers(): Promise<Influencer[]> {
  const response = await fetch("/influencers/list");
  if (!response.ok) {
    throw new Error("Failed to fetch influencers");
  }
  const payload = (await response.json()) as { data: Influencer[] };
  return payload.data || [];
}

export function useInfluencers() {
  return useQuery({
    queryKey: ["influencers"],
    queryFn: fetchInfluencers,
  });
}
