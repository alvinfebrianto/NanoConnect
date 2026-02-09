import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Globe,
  Instagram,
  Loader2,
  MapPin,
  MessageCircle,
  Star,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { Influencer, Review } from "@/types";

export function InfluencerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "reviews">(
    "overview"
  );

  useEffect(() => {
    async function fetchInfluencerData() {
      if (!id) {
        return;
      }

      try {
        const { data: influencerData, error: influencerError } = await supabase
          .from("influencers")
          .select("*, user:users(*)")
          .eq("id", id)
          .single();

        if (influencerError) {
          throw influencerError;
        }
        setInfluencer(influencerData);

        const { data: reviewsData, error: reviewsError } = await supabase
          .from("reviews")
          .select("*, order:orders(*)")
          .eq("order.influencer_id", id)
          .order("created_at", { ascending: false });

        if (reviewsError) {
          throw reviewsError;
        }
        setReviews(reviewsData || []);
      } catch (error) {
        console.error("Error fetching influencer data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchInfluencerData();
  }, [id]);

  const formatNumber = (num: number): string => {
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!influencer) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="mb-4 font-bold font-display text-2xl text-gray-900">
          Influencer tidak ditemukan
        </h2>
        <Link className="btn-primary" to="/influencers">
          Jelajahi Influencer
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            className="mb-6 inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600"
            to="/influencers"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Kembali ke Influencer</span>
          </Link>
        </div>
      </div>

      <div className="mx-auto -mt-4 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="card mb-6">
              <div className="flex flex-col gap-6 md:flex-row">
                <img
                  alt={influencer.user?.name}
                  className="h-32 w-32 rounded-2xl object-cover"
                  height={128}
                  src={
                    influencer.user?.avatar_url ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${influencer.id}`
                  }
                  width={128}
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="mb-2 flex items-center font-bold font-display text-3xl text-gray-900">
                        {influencer.user?.name}
                        {influencer.verification_status === "verified" && (
                          <CheckCircle className="ml-2 h-6 w-6 text-blue-500" />
                        )}
                      </h1>
                      <p className="mb-3 font-medium text-lg text-primary-600">
                        {influencer.niche}
                      </p>
                    </div>
                  </div>

                  <p className="mb-4 text-gray-600">{influencer.user?.bio}</p>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{influencer.location}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Globe className="h-4 w-4" />
                      <span>{influencer.languages?.join(", ")}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {influencer.avg_delivery_days} hari pengiriman
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-3 gap-4">
              <div className="card text-center">
                <Users className="mx-auto mb-2 h-6 w-6 text-primary-600" />
                <div className="font-bold font-display text-2xl text-gray-900">
                  {formatNumber(influencer.followers_count)}
                </div>
                <div className="text-gray-500 text-sm">Pengikut</div>
              </div>
              <div className="card text-center">
                <Star className="mx-auto mb-2 h-6 w-6 text-yellow-500" />
                <div className="font-bold font-display text-2xl text-gray-900">
                  {influencer.engagement_rate}%
                </div>
                <div className="text-gray-500 text-sm">Engagement</div>
              </div>
              <div className="card text-center">
                <MessageCircle className="mx-auto mb-2 h-6 w-6 text-green-500" />
                <div className="font-bold font-display text-2xl text-gray-900">
                  {reviews.length}
                </div>
                <div className="text-gray-500 text-sm">Ulasan</div>
              </div>
            </div>

            <div className="card">
              <div className="mb-6 flex space-x-6 border-gray-100 border-b">
                <button
                  className={`pb-4 font-medium transition-colors ${
                    activeTab === "overview"
                      ? "border-primary-600 border-b-2 text-primary-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("overview")}
                  type="button"
                >
                  Ikhtisar
                </button>
                <button
                  className={`pb-4 font-medium transition-colors ${
                    activeTab === "reviews"
                      ? "border-primary-600 border-b-2 text-primary-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("reviews")}
                  type="button"
                >
                  Ulasan ({reviews.length})
                </button>
              </div>

              {activeTab === "overview" ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-3 font-display font-semibold text-lg">
                      Tentang
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {influencer.user?.bio || "Belum ada bio."}
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-3 font-display font-semibold text-lg">
                      Kategori Konten
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {influencer.content_categories?.map((category) => (
                        <span
                          className="rounded-lg bg-primary-50 px-3 py-1.5 font-medium text-primary-700 text-sm"
                          key={category}
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 font-display font-semibold text-lg">
                      Media Sosial
                    </h3>
                    <div className="flex space-x-4">
                      {influencer.instagram_handle && (
                        <a
                          className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-pink-600"
                          href={`https://instagram.com/${influencer.instagram_handle}`}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <Instagram className="h-5 w-5" />
                          <span>{influencer.instagram_handle}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <p className="py-8 text-center text-gray-500">
                      Belum ada ulasan
                    </p>
                  ) : (
                    reviews.map((review) => (
                      <div
                        className="border-gray-100 border-b pb-4 last:border-0 last:pb-0"
                        key={review.id}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            {[...new Array(5)].map((_, starIndex) => (
                              <Star
                                className={`h-4 w-4 ${starIndex < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                key={`star-${starIndex}-${review.id}`}
                              />
                            ))}
                          </div>
                          <span className="text-gray-500 text-sm">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                        {review.is_verified && (
                          <span className="mt-2 inline-flex items-center text-green-600 text-xs">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Pembelian Terverifikasi
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h3 className="mb-4 font-display font-semibold text-lg">
                Pesan Kolaborasi
              </h3>
              <div className="mb-6 space-y-4">
                <div className="flex items-center justify-between border-gray-100 border-b py-3">
                  <span className="text-gray-600">Harga per postingan</span>
                  <span className="font-bold font-display text-2xl text-gray-900">
                    Rp{" "}
                    {(influencer.price_per_post * 15_000).toLocaleString(
                      "id-ID"
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between border-gray-100 border-b py-3">
                  <span className="text-gray-600">Biaya platform (10%)</span>
                  <span className="text-gray-900">
                    Rp{" "}
                    {(influencer.price_per_post * 15_000 * 0.1).toLocaleString(
                      "id-ID"
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="font-medium text-gray-900">Total</span>
                  <span className="font-bold font-display text-primary-600 text-xl">
                    Rp{" "}
                    {(influencer.price_per_post * 15_000 * 1.1).toLocaleString(
                      "id-ID"
                    )}
                  </span>
                </div>
              </div>
              <button
                className="btn-primary w-full py-3"
                onClick={() => navigate(`/order/${influencer.id}`)}
                type="button"
              >
                Pesan Sekarang
              </button>
              <p className="mt-4 text-center text-gray-500 text-xs">
                Anda belum akan dikenakan biaya. Influencer akan meninjau
                permintaan Anda terlebih dahulu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
