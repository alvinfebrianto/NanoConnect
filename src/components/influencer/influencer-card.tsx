import { CheckCircle, MapPin, Star, Users } from "@phosphor-icons/react";
import { motion } from "framer-motion";
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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 20 },
  },
};

export function InfluencerCard({ influencer }: InfluencerCardProps) {
  return (
    <motion.div
      className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-white p-2 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] ring-1 ring-zinc-200/50 transition-all dark:bg-zinc-900 dark:ring-zinc-800"
      variants={itemVariants}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Liquid Glass Overlay on hover */}
      <div className="pointer-events-none absolute inset-0 z-10 rounded-[2.5rem] opacity-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative mb-4 overflow-hidden rounded-t-[2rem] rounded-b-[1rem]">
        <motion.img
          alt={influencer.user?.name}
          className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-105"
          height={224}
          layoutId={`avatar-${influencer.id}`}
          src={
            influencer.user?.avatar_url ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${influencer.id}`
          }
          width={384}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        {influencer.verification_status === "verified" && (
          <motion.div
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-[0_4px_12px_rgba(0,0,0,0.1)] backdrop-blur-md dark:bg-zinc-900/90"
            initial={{ scale: 0.8, opacity: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <CheckCircle className="h-5 w-5 text-blue-500" weight="fill" />
          </motion.div>
        )}

        <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 rounded-full border border-white/20 bg-white/20 px-3 py-1.5 text-white shadow-sm backdrop-blur-md">
            <Star className="h-4 w-4 text-yellow-400" weight="fill" />
            <span className="font-medium text-sm drop-shadow-md">
              {influencer.engagement_rate}%
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4">
        <div className="mb-4">
          <h3 className="font-display font-semibold text-xl text-zinc-900 tracking-tight transition-colors group-hover:text-primary-600 dark:text-zinc-50">
            {influencer.user?.name}
          </h3>
          <p className="font-medium text-primary-600 text-sm dark:text-primary-400">
            {influencer.niche}
          </p>
        </div>

        <div className="mb-5 flex items-center space-x-5 text-sm text-zinc-600 dark:text-zinc-400">
          <div className="flex items-center space-x-1.5">
            <Users
              className="h-5 w-5 text-zinc-400 dark:text-zinc-500"
              weight="duotone"
            />
            <span className="font-medium">
              {formatNumber(influencer.followers_count)}
            </span>
          </div>
          <div className="flex items-center space-x-1.5">
            <MapPin
              className="h-5 w-5 text-zinc-400 dark:text-zinc-500"
              weight="duotone"
            />
            <span className="max-w-[100px] truncate font-medium">
              {influencer.location?.split(",")[0]}
            </span>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {influencer.content_categories?.slice(0, 3).map((category) => (
            <span
              className="rounded-full bg-zinc-100 px-3 py-1 font-medium text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
              key={category}
            >
              {category}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-end justify-between border-zinc-100 border-t pt-4 dark:border-zinc-800/50">
          <div>
            <span className="mb-0.5 block font-medium text-xs text-zinc-500 dark:text-zinc-400">
              Mulai dari
            </span>
            <p className="font-bold font-display text-lg text-zinc-900 tracking-tight dark:text-zinc-50">
              Rp {currencyFormatter.format(influencer.price_per_post)}
            </p>
          </div>
          <Link
            className="relative overflow-hidden rounded-2xl bg-zinc-900 px-5 py-2.5 font-medium text-sm text-white transition-all hover:bg-primary-600 hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-primary-500 dark:hover:text-white"
            to={`/influencers/${influencer.id}`}
          >
            <span className="relative z-10">Lihat Profil</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
