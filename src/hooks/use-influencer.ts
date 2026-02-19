import { useQuery } from "@tanstack/react-query";
import type { Influencer, Review } from "@/types";

interface InfluencerDetailData {
  influencer: Influencer | null;
  reviews: Review[];
}

async function fetchInfluencer(id: string): Promise<InfluencerDetailData> {
  const response = await fetch(`/influencers?id=${encodeURIComponent(id)}`);
  if (!response.ok) {
    const payload = (await response.json()) as { message?: string };
    throw new Error(payload.message || "Gagal memuat influencer.");
  }

  const payload = (await response.json()) as { data: Influencer };
  const influencer = payload.data;

  const reviewsResponse = await fetch(
    `/reviews?influencer_id=${encodeURIComponent(id)}`
  );
  let reviews: Review[] = [];
  if (reviewsResponse.ok) {
    const reviewsPayload = (await reviewsResponse.json()) as {
      data: Review[];
    };
    reviews = reviewsPayload.data || [];
  }

  return { influencer, reviews };
}

export function useInfluencer(id: string | undefined) {
  return useQuery({
    queryKey: ["influencer", id],
    queryFn: () => fetchInfluencer(id as string),
    enabled: Boolean(id),
  });
}
