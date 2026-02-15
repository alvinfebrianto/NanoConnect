import {
  ArrowRight,
  Building2,
  DollarSign,
  MapPin,
  RefreshCw,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import type { User } from "@/types";

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

const COMPANY_SIZES = [
  "1-5 orang",
  "6-20 orang",
  "21-50 orang",
  "51-200 orang",
  "200+ orang",
];

const CAMPAIGN_TYPES = [
  "Brand awareness",
  "Peluncuran produk",
  "Penjualan dan konversi",
  "Konten edukasi",
  "Event lokal",
  "Retensi pelanggan",
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
  "Bali",
  "Malang",
];

interface FormState {
  niche: string;
  company_size: string;
  budget: string;
  target_audience: string;
  location: string;
  campaign_type: string;
}

interface RecommendationData {
  user: {
    id: string;
    name: string;
    email: string;
  };
  summary: string;
}

const formatRupiah = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

export function AIRecommendations() {
  const { user, isLoading: authLoading } = useAuth();
  const [step, setStep] = useState<"input" | "processing" | "results">("input");
  const [profile, setProfile] = useState<User | null>(null);
  const [profileError, setProfileError] = useState("");
  const [profileLoading, setProfileLoading] = useState(true);
  const isMountedRef = useRef(true);
  const [formData, setFormData] = useState<FormState>({
    niche: "",
    company_size: "",
    budget: "",
    target_audience: "",
    location: "",
    campaign_type: "",
  });
  const [submissionError, setSubmissionError] = useState("");
  const [recommendation, setRecommendation] =
    useState<RecommendationData | null>(null);

  const budgetValue = Number.parseInt(formData.budget, 10);
  const isBudgetValid = Number.isFinite(budgetValue) && budgetValue > 0;
  const isFormComplete = Boolean(
    formData.niche.trim() &&
      formData.company_size.trim() &&
      formData.target_audience.trim() &&
      formData.location.trim() &&
      formData.campaign_type.trim() &&
      isBudgetValid
  );
  const isSme = profile?.user_type === "sme";
  const canSubmit = Boolean(isFormComplete && isSme && user);
  let accountStatusLabel = "Akun belum SME";
  if (profileLoading) {
    accountStatusLabel = "Memuat";
  } else if (isSme) {
    accountStatusLabel = "Akun SME";
  }

  useEffect(() => {
    isMountedRef.current = true;
    const fetchProfile = async () => {
      const setProfileState = (next: {
        loading?: boolean;
        error?: string;
        profile?: User | null;
      }) => {
        if (!isMountedRef.current) {
          return;
        }

        if (next.loading !== undefined) {
          setProfileLoading(next.loading);
        }
        if (next.error !== undefined) {
          setProfileError(next.error);
        }
        if (next.profile !== undefined) {
          setProfile(next.profile);
        }
      };

      if (!user) {
        setProfileState({ profile: null, loading: false });
        return;
      }

      setProfileState({ loading: true, error: "" });

      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData.session?.access_token;
        if (!accessToken) {
          setProfileState({
            error: "Sesi tidak valid. Silakan masuk kembali.",
            profile: null,
          });
          return;
        }

        const response = await fetch("/profile", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          setProfileState({
            error: "Gagal memuat profil SME.",
            profile: null,
          });
          return;
        }

        const payload = (await response.json()) as {
          data: { user: User };
        };
        setProfileState({ profile: payload.data.user });
      } catch {
        setProfileState({
          error: "Terjadi kesalahan saat memuat profil SME.",
          profile: null,
        });
      } finally {
        setProfileState({ loading: false });
      }
    };

    if (!authLoading) {
      fetchProfile().catch(() => undefined);
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [authLoading, user]);

  const handleChange =
    (field: keyof FormState) =>
    (
      event:
        | ChangeEvent<HTMLInputElement>
        | ChangeEvent<HTMLSelectElement>
        | ChangeEvent<HTMLTextAreaElement>
    ) => {
      setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmissionError("");
    setRecommendation(null);

    if (!user) {
      setSubmissionError(
        "Silakan masuk terlebih dahulu untuk meminta rekomendasi AI."
      );
      return;
    }

    if (!isSme) {
      setSubmissionError("Hanya akun SME yang dapat menggunakan fitur ini.");
      return;
    }

    if (!isFormComplete) {
      setSubmissionError("Lengkapi seluruh data kampanye sebelum mengirim.");
      return;
    }

    if (!isBudgetValid) {
      setSubmissionError("Budget harus lebih besar dari 0.");
      return;
    }

    setStep("processing");

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      if (!accessToken) {
        throw new Error("Sesi tidak valid. Silakan masuk kembali.");
      }

      const response = await fetch("/ai-recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          niche: formData.niche.trim(),
          company_size: formData.company_size.trim(),
          budget: budgetValue,
          target_audience: formData.target_audience.trim(),
          location: formData.location.trim(),
          campaign_type: formData.campaign_type.trim(),
        }),
      });

      const payload = (await response.json()) as {
        data?: RecommendationData;
        message?: string;
      };

      if (!(response.ok && payload.data)) {
        throw new Error(
          payload.message || "Gagal mengirim data kampanye. Silakan coba lagi."
        );
      }

      setRecommendation(payload.data);
      setStep("results");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengirim data kampanye.";
      setSubmissionError(message);
      setStep("input");
    }
  };

  const handleReset = () => {
    setFormData({
      niche: "",
      company_size: "",
      budget: "",
      target_audience: "",
      location: "",
      campaign_type: "",
    });
    setRecommendation(null);
    setSubmissionError("");
    setStep("input");
  };

  if (step === "processing") {
    return (
      <div className="gradient-bg flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-2xl text-center">
          <div className="relative mx-auto mb-8 h-24 w-24">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary-200" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500">
              <Sparkles className="h-12 w-12 animate-pulse text-white" />
            </div>
          </div>
          <h2 className="mb-3 font-bold font-display text-3xl text-gray-900">
            AI Sedang Menyusun Brief Kampanye Anda
          </h2>
          <p className="mx-auto max-w-xl text-gray-600">
            Kami sedang menganalisis detail SME dan kampanye untuk menemukan
            format influencer terbaik.
          </p>
          <div className="mt-8 flex justify-center gap-2">
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
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="mb-2 text-primary-500 text-sm uppercase tracking-[0.3em]">
                  Hasil Singkat AI
                </p>
                <h1 className="mb-3 font-bold font-display text-4xl text-gray-900">
                  Brief Kampanye Telah Terkirim
                </h1>
                <p className="max-w-2xl text-gray-600">
                  AI kami siap menyusun daftar influencer terbaik. Berikut
                  ringkasan kampanye yang sudah Anda kirimkan.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link className="btn-secondary" to="/influencers">
                  Lihat Influencer
                </Link>
                <button
                  className="btn-primary flex items-center gap-2"
                  onClick={handleReset}
                  type="button"
                >
                  <RefreshCw className="h-5 w-5" />
                  Mulai Ulang
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
              <div className="rounded-2xl bg-white p-6 shadow-lg">
                <p className="text-gray-500 text-xs uppercase tracking-[0.2em]">
                  Profil SME
                </p>
                <h3 className="mt-2 font-semibold text-gray-900 text-lg">
                  {profile?.name || recommendation?.user.name || "SME Anda"}
                </h3>
                <p className="mt-1 text-gray-600 text-sm">
                  {profile?.email || recommendation?.user.email || ""}
                </p>
                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Niche</span>
                    <span className="font-medium text-gray-900">
                      {formData.niche}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Ukuran bisnis</span>
                    <span className="font-medium text-gray-900">
                      {formData.company_size}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Budget</span>
                    <span className="font-medium text-gray-900">
                      {isBudgetValid ? formatRupiah(budgetValue) : "-"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-lg">
                <p className="text-gray-500 text-xs uppercase tracking-[0.2em]">
                  Ringkasan Kampanye
                </p>
                <h3 className="mt-2 font-semibold text-gray-900 text-lg">
                  Snapshot singkat untuk tim AI
                </h3>
                <p className="mt-4 whitespace-pre-line text-gray-600 text-sm leading-relaxed">
                  {recommendation?.summary ||
                    "Ringkasan kampanye belum tersedia."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-primary-100 bg-primary-50 p-6">
              <h3 className="font-semibold text-gray-900 text-lg">
                Target Audiens
              </h3>
              <p className="mt-2 text-gray-600 text-sm">
                {formData.target_audience}
              </p>
            </div>
            <div className="rounded-2xl border border-accent-100 bg-accent-50 p-6">
              <h3 className="font-semibold text-gray-900 text-lg">
                Fokus Lokasi
              </h3>
              <p className="mt-2 text-gray-600 text-sm">{formData.location}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h3 className="font-semibold text-gray-900 text-lg">
                Jenis Kampanye
              </h3>
              <p className="mt-2 text-gray-600 text-sm">
                {formData.campaign_type}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-8">
              <div>
                <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-medium text-primary-600 text-sm shadow-sm">
                  <Sparkles className="h-4 w-4" />
                  Pemetaan Kampanye SME
                </p>
                <h1 className="mb-4 font-bold font-display text-4xl text-gray-900">
                  Bangun brief kampanye yang tajam untuk AI NanoConnect
                </h1>
                <p className="text-gray-600 text-lg">
                  Isi 6 data utama agar AI memahami identitas SME Anda dan
                  langsung menyaring influencer paling relevan.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100">
                    <Target className="h-5 w-5 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Brief fokus</h3>
                  <p className="mt-2 text-gray-600 text-sm">
                    AI membaca niche dan jenis kampanye untuk menyesuaikan gaya
                    konten.
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-100">
                    <DollarSign className="h-5 w-5 text-accent-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Budget sehat</h3>
                  <p className="mt-2 text-gray-600 text-sm">
                    Rekomendasi influencer dikalibrasi dari budget SME Anda.
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Audiens tepat</h3>
                  <p className="mt-2 text-gray-600 text-sm">
                    AI menyesuaikan persona audiens dan lokasi target.
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <Building2 className="h-5 w-5 text-slate-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Skala SME</h3>
                  <p className="mt-2 text-gray-600 text-sm">
                    Ukuran bisnis membantu menentukan intensitas kolaborasi.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-lg backdrop-blur">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-[0.2em]">
                      Profil SME
                    </p>
                    <h3 className="mt-2 font-semibold text-gray-900 text-lg">
                      {profileLoading
                        ? "Memuat profil..."
                        : profile?.name || "Silakan masuk"}
                    </h3>
                    <p className="mt-1 text-gray-600 text-sm">
                      {profileLoading
                        ? ""
                        : profile?.email ||
                          "Masuk untuk mengambil data profil SME Anda."}
                    </p>
                  </div>
                  <div className="rounded-full bg-primary-50 px-3 py-1 text-primary-600 text-xs">
                    {accountStatusLabel}
                  </div>
                </div>
                {profileError && (
                  <p className="mt-4 text-red-600 text-sm">{profileError}</p>
                )}
                {!(user || profileLoading) && (
                  <Link
                    className="mt-4 inline-flex items-center gap-2 font-medium text-primary-600 hover:text-primary-700"
                    to="/login"
                  >
                    Masuk untuk melanjutkan
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-xl">
              <div className="mb-6">
                <h2 className="font-semibold text-2xl text-gray-900">
                  Form Brief Kampanye
                </h2>
                <p className="mt-2 text-gray-600 text-sm">
                  Semua kolom wajib diisi agar AI bisa merangkum kebutuhan SME.
                </p>
              </div>

              {submissionError && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
                  {submissionError}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    className="mb-2 block font-medium text-gray-700 text-sm"
                    htmlFor="niche"
                  >
                    <Target className="mr-2 inline h-4 w-4" />
                    Industri atau niche SME
                  </label>
                  <select
                    className="input-field w-full disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={!isSme}
                    id="niche"
                    onChange={handleChange("niche")}
                    value={formData.niche}
                  >
                    <option value="">Pilih niche utama</option>
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
                    htmlFor="company_size"
                  >
                    <Building2 className="mr-2 inline h-4 w-4" />
                    Ukuran tim atau bisnis
                  </label>
                  <select
                    className="input-field w-full disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={!isSme}
                    id="company_size"
                    onChange={handleChange("company_size")}
                    value={formData.company_size}
                  >
                    <option value="">Pilih skala bisnis</option>
                    {COMPANY_SIZES.map((size) => (
                      <option key={size} value={size}>
                        {size}
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
                    Budget kampanye (Rp)
                  </label>
                  <input
                    className="input-field w-full disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={!isSme}
                    id="budget"
                    inputMode="numeric"
                    min={0}
                    onChange={handleChange("budget")}
                    placeholder="Contoh: 10000000"
                    type="number"
                    value={formData.budget}
                  />
                  <p className="mt-2 text-gray-500 text-xs">
                    Estimasi yang akan digunakan AI untuk mengatur jumlah
                    influencer.
                  </p>
                </div>

                <div>
                  <label
                    className="mb-2 block font-medium text-gray-700 text-sm"
                    htmlFor="target_audience"
                  >
                    <Users className="mr-2 inline h-4 w-4" />
                    Target audiens utama
                  </label>
                  <textarea
                    className="input-field resize-none disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={!isSme}
                    id="target_audience"
                    onChange={handleChange("target_audience")}
                    placeholder="Contoh: wanita 25-35 tahun, suka skincare premium"
                    rows={3}
                    value={formData.target_audience}
                  />
                </div>

                <div>
                  <label
                    className="mb-2 block font-medium text-gray-700 text-sm"
                    htmlFor="location"
                  >
                    <MapPin className="mr-2 inline h-4 w-4" />
                    Lokasi target kampanye
                  </label>
                  <select
                    className="input-field w-full disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={!isSme}
                    id="location"
                    onChange={handleChange("location")}
                    value={formData.location}
                  >
                    <option value="">Pilih area fokus</option>
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
                    htmlFor="campaign_type"
                  >
                    <Sparkles className="mr-2 inline h-4 w-4" />
                    Jenis kampanye
                  </label>
                  <select
                    className="input-field w-full disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={!isSme}
                    id="campaign_type"
                    onChange={handleChange("campaign_type")}
                    value={formData.campaign_type}
                  >
                    <option value="">Pilih jenis kampanye</option>
                    {CAMPAIGN_TYPES.map((campaignType) => (
                      <option key={campaignType} value={campaignType}>
                        {campaignType}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  className="btn-primary flex w-full items-center justify-center gap-2 py-4 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!canSubmit}
                  type="submit"
                >
                  <Sparkles className="h-5 w-5" />
                  Kirim Brief Kampanye
                  <ArrowRight className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
