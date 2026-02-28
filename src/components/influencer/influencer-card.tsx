import { CheckCircle, MapPin, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import type { Influencer } from "@/types";

interface InfluencerCardProps {
  influencer: Influencer;
}

const formatNumber = (num: number): string => {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

const currencyFormatter = new Intl.NumberFormat("id-ID");

export function InfluencerCard({ influencer }: InfluencerCardProps) {
  return (
    <div className="card group cursor-pointer transition duration-300 hover:border-primary-200 dark:hover:border-primary-700/50">
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
          <div className="absolute top-3 right-3 rounded-full bg-white p-1 shadow-md dark:bg-zinc-800">
            <CheckCircle aria-hidden="true" className="h-5 w-5 text-blue-500" />
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="font-display font-semibold text-lg text-zinc-900 transition-colors group-hover:text-primary-600 dark:text-zinc-50">
            {influencer.user?.name}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {influencer.niche}
          </p>
        </div>

        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1 text-zinc-600 dark:text-zinc-400">
            <Users aria-hidden="true" className="h-4 w-4" />
            <span>{formatNumber(influencer.followers_count)}</span>
          </div>
          <div className="flex items-center space-x-1 text-zinc-600 dark:text-zinc-400">
            <Star aria-hidden="true" className="h-4 w-4 text-yellow-500" />
            <span>{influencer.engagement_rate}%</span>
          </div>
          <div className="flex items-center space-x-1 text-zinc-600 dark:text-zinc-400">
            <MapPin aria-hidden="true" className="h-4 w-4" />
            <span className="max-w-[80px] truncate">
              {influencer.location?.split(",")[0]}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {influencer.content_categories?.slice(0, 3).map((category) => (
            <span
              className="rounded-lg bg-zinc-100 px-2 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              key={category}
            >
              {category}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between border-zinc-100 border-t pt-3 dark:border-zinc-800">
          <div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Mulai dari
            </span>
            <p className="font-semibold text-zinc-900 dark:text-zinc-50">
              Rp {currencyFormatter.format(influencer.price_per_post)}
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
