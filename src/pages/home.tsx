import {
  ArrowRight,
  Search,
  Shield,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { InfluencerCard } from "@/components/influencer/influencer-card";
import type { Influencer } from "@/types";

export function Home() {
  const [featuredInfluencers, setFeaturedInfluencers] = useState<Influencer[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedInfluencers() {
      try {
        const response = await fetch("/influencers/featured");
        if (!response.ok) {
          throw new Error("Failed to fetch influencers");
        }
        const payload = (await response.json()) as { data: Influencer[] };
        setFeaturedInfluencers(payload.data || []);
      } catch (error) {
        console.error("Error fetching influencers:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFeaturedInfluencers();
  }, []);

  const stats = [
    {
      id: "influencers",
      icon: Users,
      value: "10,000+",
      label: "Influencer Aktif",
    },
    { id: "partners", icon: TrendingUp, value: "500+", label: "Mitra UMKM" },
    { id: "satisfaction", icon: Star, value: "98%", label: "Tingkat Kepuasan" },
    { id: "response", icon: Zap, value: "24j", label: "Respon Rata-rata" },
  ];

  const SKELETON_ITEMS = [
    { id: "sk-1" },
    { id: "sk-2" },
    { id: "sk-3" },
    { id: "sk-4" },
    { id: "sk-5" },
    { id: "sk-6" },
  ];

  return (
    <div className="animate-fade-in">
      <section className="gradient-bg relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23d946ef%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-flex items-center space-x-2 rounded-full bg-white/60 px-4 py-2 shadow-sm backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary-500" />
              <span className="font-medium text-gray-700 text-sm">
                Kini dengan pencocokan berbasis AI
              </span>
            </div>

            <h1 className="mb-6 font-bold font-display text-5xl text-gray-900 leading-tight lg:text-7xl">
              Temukan Kreator
              <span className="gradient-text block">Yang Sempurna</span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-gray-600 text-xl leading-relaxed">
              Terhubung dengan nano influencer yang secara autentik mewakili
              brand Anda. Pencocokan cerdas berdasarkan anggaran, niche, dan
              audiens target.
            </p>

            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Link
                className="btn-primary flex items-center space-x-2 px-8 py-4 text-lg"
                to="/influencers"
              >
                <Search className="h-5 w-5" />
                <span>Cari Influencer</span>
              </Link>
              <Link
                className="btn-secondary flex items-center space-x-2 px-8 py-4 text-lg"
                to="/ai-recommendations"
              >
                <Zap className="h-5 w-5" />
                <span>Cocokan AI</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute right-0 -bottom-1 left-0">
          <svg
            aria-hidden="true"
            className="w-full"
            fill="none"
            viewBox="0 0 1440 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 50L48 45.7C96 41 192 33 288 35.2C384 37 480 50 576 55.7C672 61 768 61 864 55.7C960 50 1056 41 1152 37.8C1248 33 1344 37 1392 37.8L1440 41V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-bold font-display text-3xl text-gray-900 lg:text-4xl">
              Mengapa Memilih NanoConnect?
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600 text-lg">
              Kami membuat pemasaran influencer menjadi sederhana, transparan,
              dan efektif untuk bisnis dari semua ukuran.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="card group transition-all duration-300 hover:border-primary-200">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 transition-colors group-hover:bg-primary-600">
                <Zap className="h-7 w-7 text-primary-600 transition-colors group-hover:text-white" />
              </div>
              <h3 className="mb-3 font-display font-semibold text-xl">
                Pencocokan Berbasis AI
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Algoritma cerdas kami menganalisis brand Anda dan mencocokkan
                dengan influencer yang benar-benar cocok dengan audiens Anda.
              </p>
            </div>

            <div className="card group transition-all duration-300 hover:border-primary-200">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-100 transition-colors group-hover:bg-accent-600">
                <Shield className="h-7 w-7 text-accent-600 transition-colors group-hover:text-white" />
              </div>
              <h3 className="mb-3 font-display font-semibold text-xl">
                Kreator Terverifikasi
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Setiap influencer telah melalui proses verifikasi menyeluruh
                untuk memastikan engagement yang autentik dan kualitas konten.
              </p>
            </div>

            <div className="card group transition-all duration-300 hover:border-primary-200">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 transition-colors group-hover:bg-green-600">
                <TrendingUp className="h-7 w-7 text-green-600 transition-colors group-hover:text-white" />
              </div>
              <h3 className="mb-3 font-display font-semibold text-xl">
                Ramah Anggaran
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Akses nano influencer dengan audiens yang sangat engaged dengan
                biaya jauh lebih terjangkau dibandingkan influencer makro.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div className="text-center" key={stat.id}>
                <stat.icon className="mx-auto mb-4 h-10 w-10 text-primary-600" />
                <div className="mb-2 font-bold font-display text-3xl text-gray-900 lg:text-4xl">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col items-start justify-between md:flex-row md:items-center">
            <div>
              <h2 className="mb-2 font-bold font-display text-3xl text-gray-900 lg:text-4xl">
                Influencer Unggulan
              </h2>
              <p className="text-gray-600">
                Kreator terbaik siap berkolaborasi dengan brand Anda
              </p>
            </div>
            <Link
              className="mt-4 flex items-center space-x-2 font-medium text-primary-600 hover:text-primary-700 md:mt-0"
              to="/influencers"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {SKELETON_ITEMS.map((item) => (
                <div className="card animate-pulse" key={item.id}>
                  <div className="mb-4 h-48 rounded-xl bg-gray-200" />
                  <div className="mb-2 h-6 w-3/4 rounded bg-gray-200" />
                  <div className="h-4 w-1/2 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredInfluencers.map((influencer) => (
                <InfluencerCard influencer={influencer} key={influencer.id} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="gradient-bg py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 font-bold font-display text-3xl text-gray-900 lg:text-4xl">
            Siap Mengembangkan Brand Anda?
          </h2>
          <p className="mb-10 text-gray-600 text-xl">
            Bergabunglah dengan ribuan UMKM yang telah berhasil bermitra dengan
            nano influencer untuk menjangkau audiens target mereka.
          </p>
          <Link
            className="btn-primary inline-flex items-center space-x-2 px-10 py-4 text-lg"
            to="/register"
          >
            <span>Mulai Sekarang</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
