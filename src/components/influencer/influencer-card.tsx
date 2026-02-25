import { CheckCircle, MapPin, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import type { Influencer } from "@/types";

interface InfluencerCardProps {
  influencer: Influencer;
}

export function InfluencerCard({ influencer }: InfluencerCardProps) {
  const formatNumber = (num: number): string => {
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="card group cursor-pointer transition-all duration-300 hover:border-primary-200 dark:hover:border-primary-700/50">
      <div className="relative mb-4">
        <img
          alt={influencer.user?.name}
          className="h-48 w-full rounded-xl object-cover"
          height={192}
          src={
            influencer.user?.avatar_url ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${influencer.id}`
          }
          width={384}
        />
        {influencer.verification_status === "verified" && (
          <div className="absolute top-3 right-3 rounded-full bg-white p-1 shadow-md dark:bg-stone-800">
            <CheckCircle className="h-5 w-5 text-blue-500" />
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="font-display font-semibold text-lg text-stone-900 transition-colors group-hover:text-primary-600 dark:text-stone-50">
            {influencer.user?.name}
          </h3>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {influencer.niche}
          </p>
        </div>

        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1 text-stone-600 dark:text-stone-400">
            <Users className="h-4 w-4" />
            <span>{formatNumber(influencer.followers_count)}</span>
          </div>
          <div className="flex items-center space-x-1 text-stone-600 dark:text-stone-400">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>{influencer.engagement_rate}%</span>
          </div>
          <div className="flex items-center space-x-1 text-stone-600 dark:text-stone-400">
            <MapPin className="h-4 w-4" />
            <span className="max-w-[80px] truncate">
              {influencer.location?.split(",")[0]}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {influencer.content_categories?.slice(0, 3).map((category) => (
            <span
              className="rounded-lg bg-stone-100 px-2 py-1 text-stone-600 text-xs dark:bg-stone-800 dark:text-stone-400"
              key={category}
            >
              {category}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between border-stone-100 border-t pt-3 dark:border-stone-800">
          <div>
            <span className="text-stone-500 text-xs dark:text-stone-400">
              Mulai dari
            </span>
            <p className="font-semibold text-stone-900 dark:text-stone-50">
              Rp {influencer.price_per_post.toLocaleString("id-ID")}
            </p>
          </div>
          <Link
            className="rounded-lg bg-primary-50 px-4 py-2 font-medium text-primary-600 text-sm transition-colors hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50"
            to={`/influencers/${influencer.id}`}
          >
            Lihat Profil
          </Link>
        </div>
      </div>
    </div>
  );
}
