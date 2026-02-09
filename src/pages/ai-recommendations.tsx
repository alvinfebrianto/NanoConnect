import {
  ArrowRight,
  DollarSign,
  MapPin,
  RefreshCw,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { useState } from "react";
import { InfluencerCard } from "@/components/influencer/influencer-card";
import type { Influencer } from "@/types";

const NICHES = [
  "Fashion & Gaya Hidup",
  "Teknologi",
  "Kecantikan & Perawatan Kulit",
  "Kuliner & Makanan",
  "Travel & Petualangan",
  "Fitness & Kesehatan",
  "Gaming",
  "Bisnis & Keuangan",
];

const BUDGET_RANGES = [
  { label: "Rp 1.500.000 - Rp 7.500.000", min: 100, max: 500 },
  { label: "Rp 7.500.000 - Rp 15.000.000", min: 500, max: 1000 },
  { label: "Rp 15.000.000 - Rp 37.500.000", min: 1000, max: 2500 },
  { label: "Rp 37.500.000 - Rp 75.000.000", min: 2500, max: 5000 },
  { label: "Rp 75.000.000+", min: 5000, max: 50_000 },
];

const LOCATIONS = [
  "Jakarta",
  "Surabaya",
  "Bandung",
  "Medan",
  "Semarang",
  "Makassar",
  "Palembang",
  "Yogyakarta",
];

export function AIRecommendations() {
  const [step, setStep] = useState<"input" | "processing" | "results">("input");
  const [preferences, setPreferences] = useState({
    niche: "",
    budget: "",
    location: "",
    goals: "",
  });
  const [matches, setMatches] = useState<Influencer[]>([]);

  const handleFindMatches = () => {
    setStep("processing");

    setTimeout(() => {
      const mockInfluencers: Influencer[] = [
        {
          id: "mock-1",
          user_id: "user-1",
          followers_count: 85_000,
          engagement_rate: 5.2,
          niche: preferences.niche || "Fashion & Gaya Hidup",
          price_per_post: 450,
          location: preferences.location || "Jakarta, Indonesia",
          languages: ["Indonesia"],
          content_categories: ["Fashion", "Kecantikan", "Gaya Hidup"],
          is_available: true,
          avg_delivery_days: 5,
          verification_status: "verified",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user: {
            id: "user-1",
            name: "Rina Fashion",
            email: "rina@example.com",
            user_type: "influencer",
            email_verified: true,
            status: "active",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        },
        {
          id: "mock-2",
          user_id: "user-2",
          followers_count: 120_000,
          engagement_rate: 4.8,
          niche: preferences.niche || "Teknologi",
          price_per_post: 650,
          location: preferences.location || "Surabaya, Indonesia",
          languages: ["Indonesia"],
          content_categories: ["Teknologi", "Ulasan", "Gadget"],
          is_available: true,
          avg_delivery_days: 3,
          verification_status: "verified",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user: {
            id: "user-2",
            name: "Andi Tekno",
            email: "andi@example.com",
            user_type: "influencer",
            email_verified: true,
            status: "active",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        },
        {
          id: "mock-3",
          user_id: "user-3",
          followers_count: 65_000,
          engagement_rate: 6.5,
          niche: preferences.niche || "Kecantikan & Perawatan Kulit",
          price_per_post: 350,
          location: preferences.location || "Bandung, Indonesia",
          languages: ["Indonesia", "Inggris"],
          content_categories: ["Kecantikan", "Perawatan Kulit", "Makeup"],
          is_available: true,
          avg_delivery_days: 4,
          verification_status: "verified",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user: {
            id: "user-3",
            name: "Dewi Cantik",
            email: "dewi@example.com",
            user_type: "influencer",
            email_verified: true,
            status: "active",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        },
      ];

      setMatches(mockInfluencers);
      setStep("results");
    }, 2000);
  };

  const handleReset = () => {
    setPreferences({ niche: "", budget: "", location: "", goals: "" });
    setMatches([]);
    setStep("input");
  };

  if (step === "processing") {
    return (
      <div className="gradient-bg flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="relative mx-auto mb-8 h-24 w-24">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary-200" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500">
              <Sparkles className="h-12 w-12 animate-pulse text-white" />
            </div>
          </div>
          <h2 className="mb-4 font-bold font-display text-3xl text-gray-900">
            AI Sedang Mencari Kecocokan Anda
          </h2>
          <p className="mx-auto max-w-md text-gray-600">
            Menganalisis ribuan influencer berdasarkan preferensi Anda...
          </p>
          <div className="mt-8 flex justify-center space-x-2">
            <div className="h-3 w-3 animate-bounce rounded-full bg-primary-600" />
            <div
              className="h-3 w-3 animate-bounce rounded-full bg-primary-600"
              style={{ animationDelay: "0.1s" }}
            />
            <div
              className="h-3 w-3 animate-bounce rounded-full bg-primary-600"
              style={{ animationDelay: "0.2s" }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (step === "results") {
    return (
      <div className="animate-fade-in">
        <div className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="mb-2 font-bold font-display text-4xl text-gray-900">
                  Kecocokan AI Anda
                </h1>
                <p className="text-gray-600">
                  Berdasarkan preferensi Anda, kami menemukan {matches.length}{" "}
                  influencer sempurna untuk kampanye Anda
                </p>
              </div>
              <button
                className="flex items-center space-x-2 font-medium text-primary-600 hover:text-primary-700"
                onClick={handleReset}
                type="button"
              >
                <RefreshCw className="h-5 w-5" />
                <span>Pencarian Baru</span>
              </button>
            </div>

            <div className="mb-8 rounded-xl bg-white/80 p-4 backdrop-blur-sm">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-primary-600" />
                  <span className="text-gray-600">Niche:</span>
                  <span className="font-medium">
                    {preferences.niche || "Semua"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-primary-600" />
                  <span className="text-gray-600">Anggaran:</span>
                  <span className="font-medium">
                    {preferences.budget || "Fleksibel"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-primary-600" />
                  <span className="text-gray-600">Lokasi:</span>
                  <span className="font-medium">
                    {preferences.location || "Semua"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {matches.map((influencer, index) => (
              <div className="relative" key={influencer.id}>
                {index === 0 && (
                  <div className="absolute -top-3 left-4 z-10">
                    <span className="rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 font-bold text-white text-xs shadow-lg">
                      Kecocokan Terbaik
                    </span>
                  </div>
                )}
                <InfluencerCard influencer={influencer} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h1 className="mb-4 font-bold font-display text-4xl text-gray-900">
            Pencocokan Influencer AI
          </h1>
          <p className="text-gray-600 text-xl">
            Ceritakan tentang kampanye Anda, dan AI kami akan menemukan
            influencer sempurna untuk brand Anda.
          </p>
        </div>
      </div>

      <div className="mx-auto -mt-8 max-w-2xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <div className="space-y-6">
            <div>
              <label
                className="mb-2 block font-medium text-gray-700 text-sm"
                htmlFor="niche"
              >
                <Target className="mr-2 inline h-4 w-4" />
                Industri/Niche *
              </label>
              <select
                className="input-field w-full"
                id="niche"
                onChange={(e) =>
                  setPreferences({ ...preferences, niche: e.target.value })
                }
                value={preferences.niche}
              >
                <option value="">Pilih industri Anda</option>
                {NICHES.map((niche) => (
                  <option key={niche} value={niche}>
                    {niche}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="mb-2 block font-medium text-gray-700 text-sm"
                htmlFor="budget"
              >
                <DollarSign className="mr-2 inline h-4 w-4" />
                Rentang Anggaran *
              </label>
              <select
                className="input-field w-full"
                id="budget"
                onChange={(e) =>
                  setPreferences({ ...preferences, budget: e.target.value })
                }
                value={preferences.budget}
              >
                <option value="">Pilih anggaran Anda</option>
                {BUDGET_RANGES.map((range) => (
                  <option key={range.label} value={range.label}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="mb-2 block font-medium text-gray-700 text-sm"
                htmlFor="location"
              >
                <MapPin className="mr-2 inline h-4 w-4" />
                Lokasi Target
              </label>
              <select
                className="input-field w-full"
                id="location"
                onChange={(e) =>
                  setPreferences({ ...preferences, location: e.target.value })
                }
                value={preferences.location}
              >
                <option value="">Lokasi apa saja</option>
                {LOCATIONS.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="mb-2 block font-medium text-gray-700 text-sm"
                htmlFor="goals"
              >
                Tujuan Kampanye
              </label>
              <textarea
                className="input-field resize-none"
                id="goals"
                onChange={(e) =>
                  setPreferences({ ...preferences, goals: e.target.value })
                }
                placeholder="Jelaskan tujuan kampanye Anda, audiens target, dan apa yang Anda harapkan untuk dicapai..."
                rows={4}
                value={preferences.goals}
              />
            </div>

            <button
              className="btn-primary flex w-full items-center justify-center space-x-2 py-4 disabled:opacity-50"
              disabled={!(preferences.niche && preferences.budget)}
              onClick={handleFindMatches}
              type="button"
            >
              <Sparkles className="h-5 w-5" />
              <span>Temukan Kecocokan Saya</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
              <Target className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="mb-1 font-semibold text-gray-900">
              Pencocokan Cerdas
            </h3>
            <p className="text-gray-600 text-sm">
              AI menganalisis niche, audiens, dan engagement
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100">
              <DollarSign className="h-6 w-6 text-accent-600" />
            </div>
            <h3 className="mb-1 font-semibold text-gray-900">
              Optimasi Anggaran
            </h3>
            <p className="text-gray-600 text-sm">
              Temukan influencer dalam rentang harga Anda
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mb-1 font-semibold text-gray-900">
              Hasil Berkualitas
            </h3>
            <p className="text-gray-600 text-sm">
              Hanya kreator terverifikasi dengan engagement tinggi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
