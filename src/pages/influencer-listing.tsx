import { Filter, Search, Users, X } from "lucide-react";
import { useMemo, useState } from "react";
import { InfluencerCard } from "@/components/influencer/influencer-card";
import { useInfluencers } from "@/hooks/use-influencers";
import type { FilterOptions, Influencer } from "@/types";

const SKELETON_IDS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"] as const;

interface InfluencerListContentProps {
  isLoading: boolean;
  influencers: Influencer[];
  onClearFilters: () => void;
}

function InfluencerListContent({
  isLoading,
  influencers,
  onClearFilters,
}: InfluencerListContentProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SKELETON_IDS.map((id) => (
          <div className="card animate-pulse" key={id}>
            <div className="mb-4 h-48 rounded-xl bg-stone-200 dark:bg-stone-700" />
            <div className="mb-2 h-6 w-3/4 rounded bg-stone-200 dark:bg-stone-700" />
            <div className="h-4 w-1/2 rounded bg-stone-200 dark:bg-stone-700" />
          </div>
        ))}
      </div>
    );
  }

  if (influencers.length === 0) {
    return (
      <div className="py-20 text-center">
        <Users className="mx-auto mb-4 h-16 w-16 text-stone-300 dark:text-stone-600" />
        <h3 className="mb-2 font-display font-semibold text-stone-900 text-xl dark:text-stone-50">
          Tidak ada influencer ditemukan
        </h3>
        <p className="mb-4 text-stone-600 dark:text-stone-400">
          Coba sesuaikan filter atau kriteria pencarian Anda
        </p>
        <button className="btn-primary" onClick={onClearFilters} type="button">
          Hapus Filter
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {influencers.map((influencer) => (
        <InfluencerCard influencer={influencer} key={influencer.id} />
      ))}
    </div>
  );
}

const NICHES = [
  "Semua Niche",
  "Fashion & Gaya Hidup",
  "Teknologi",
  "Kecantikan & Perawatan Kulit",
  "Kuliner & Makanan",
  "Travel & Petualangan",
  "Fitness & Kesehatan",
  "Gaming",
  "Bisnis & Keuangan",
  "Edukasi",
  "Hiburan",
  "Fotografi",
];

const LOCATIONS = [
  "Semua Lokasi",
  "Jakarta",
  "Surabaya",
  "Bandung",
  "Medan",
  "Semarang",
  "Makassar",
  "Palembang",
  "Yogyakarta",
  "Bali",
  "Malang",
];

export function InfluencerListing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    niche: "Semua Niche",
    location: "Semua Lokasi",
    minPrice: 0,
    maxPrice: 10_000_000,
    verificationStatus: "all",
  });

  const serverFilters: FilterOptions = useMemo(() => {
    const result: FilterOptions = {};

    if (filters.niche && filters.niche !== "Semua Niche") {
      result.niche = filters.niche;
    }

    if (filters.location && filters.location !== "Semua Lokasi") {
      result.location = filters.location;
    }

    if (filters.minPrice !== undefined && filters.minPrice > 0) {
      result.minPrice = filters.minPrice;
    }

    if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
      result.maxPrice = filters.maxPrice;
    }

    if (filters.verificationStatus && filters.verificationStatus !== "all") {
      result.verificationStatus = filters.verificationStatus;
    }

    return result;
  }, [filters]);

  const { data: influencers = [], isLoading } = useInfluencers(serverFilters);

  const filteredInfluencers = useMemo(() => {
    if (!searchQuery) {
      return influencers;
    }

    const query = searchQuery.toLowerCase();
    return influencers.filter(
      (inf) =>
        inf.user?.name?.toLowerCase().includes(query) ||
        inf.niche?.toLowerCase().includes(query) ||
        inf.location?.toLowerCase().includes(query) ||
        inf.content_categories?.some((cat) => cat.toLowerCase().includes(query))
    );
  }, [searchQuery, influencers]);

  const clearFilters = () => {
    setFilters({
      niche: "Semua Niche",
      location: "Semua Lokasi",
      minPrice: 0,
      maxPrice: 10_000_000,
      verificationStatus: "all",
    });
    setSearchQuery("");
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12 dark:from-stone-950 dark:via-stone-950 dark:to-stone-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-4 font-bold font-display text-4xl text-stone-900 dark:text-stone-50">
            Temukan Influencer
          </h1>
          <p className="max-w-2xl text-lg text-stone-600 dark:text-stone-400">
            Jelajahi daftar nano influencer pilihan kami dan temukan kecocokan
            sempurna untuk brand Anda.
          </p>
        </div>
      </div>

      <div className="sticky top-16 z-40 border-stone-100 border-b bg-white shadow-sm dark:border-stone-800 dark:bg-stone-950">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-stone-400 dark:text-stone-500" />
              <input
                className="input-field w-full pl-12"
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berdasarkan nama, niche, atau lokasi..."
                type="text"
                value={searchQuery}
              />
            </div>
            <button
              className={`flex items-center justify-center space-x-2 rounded-xl px-6 py-3 font-medium transition-all ${
                showFilters
                  ? "bg-primary-600 text-white"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
              }`}
              onClick={() => setShowFilters(!showFilters)}
              type="button"
            >
              <Filter className="h-5 w-5" />
              <span>Filter</span>
              {(filters.niche !== "Semua Niche" ||
                filters.location !== "Semua Lokasi") && (
                <span className="rounded-full bg-white px-2 py-0.5 font-bold text-primary-600 text-xs dark:bg-stone-900">
                  !
                </span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 grid animate-slide-up grid-cols-1 gap-4 border-stone-100 border-t pt-4 md:grid-cols-4 dark:border-stone-800">
              <div>
                <label
                  className="mb-2 block font-medium text-sm text-stone-700 dark:text-stone-300"
                  htmlFor="filter-niche"
                >
                  Niche
                </label>
                <select
                  className="input-field w-full"
                  id="filter-niche"
                  onChange={(e) =>
                    setFilters({ ...filters, niche: e.target.value })
                  }
                  value={filters.niche}
                >
                  {NICHES.map((niche) => (
                    <option key={niche} value={niche}>
                      {niche}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className="mb-2 block font-medium text-sm text-stone-700 dark:text-stone-300"
                  htmlFor="filter-location"
                >
                  Lokasi
                </label>
                <select
                  className="input-field w-full"
                  id="filter-location"
                  onChange={(e) =>
                    setFilters({ ...filters, location: e.target.value })
                  }
                  value={filters.location}
                >
                  {LOCATIONS.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className="mb-2 block font-medium text-sm text-stone-700 dark:text-stone-300"
                  htmlFor="filter-price"
                >
                  Harga Maks: Rp {filters.maxPrice?.toLocaleString("id-ID")}
                </label>
                <input
                  className="w-full"
                  id="filter-price"
                  max="10000000"
                  min="0"
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      maxPrice: Number.parseInt(e.target.value, 10),
                    })
                  }
                  step="50000"
                  type="range"
                  value={filters.maxPrice}
                />
              </div>

              <div>
                <label
                  className="mb-2 block font-medium text-sm text-stone-700 dark:text-stone-300"
                  htmlFor="filter-verification"
                >
                  Verifikasi
                </label>
                <select
                  className="input-field w-full"
                  id="filter-verification"
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      verificationStatus: e.target
                        .value as FilterOptions["verificationStatus"],
                    })
                  }
                  value={filters.verificationStatus}
                >
                  <option value="all">Semua</option>
                  <option value="verified">Terverifikasi Saja</option>
                  <option value="pending">Tertunda</option>
                </select>
              </div>

              <div className="flex justify-end md:col-span-4">
                <button
                  className="flex items-center space-x-1 text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
                  onClick={clearFilters}
                  type="button"
                >
                  <X className="h-4 w-4" />
                  <span>Hapus semua filter</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-stone-600 dark:text-stone-400">
            Menampilkan{" "}
            <span className="font-semibold text-stone-900 dark:text-stone-50">
              {filteredInfluencers.length}
            </span>{" "}
            influencer
          </p>
        </div>

        <InfluencerListContent
          influencers={filteredInfluencers}
          isLoading={isLoading}
          onClearFilters={clearFilters}
        />
      </div>
    </div>
  );
}
