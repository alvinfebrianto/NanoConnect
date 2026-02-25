import { ArrowLeft, DollarSign, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DeliverablesSelector } from "@/components/order/deliverables-selector";
import { OrderSuccess } from "@/components/order/order-success";
import { PriceBreakdown } from "@/components/order/price-breakdown";
import { useAuth } from "@/contexts/auth-context";
import { useInfluencer } from "@/hooks/use-influencer";
import { supabase } from "@/lib/supabase";

export function OrderBooking() {
  const { influencerId } = useParams<{ influencerId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading, error } = useInfluencer(influencerId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const influencer = data?.influencer ?? null;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    deliverables: [] as string[],
    deliveryDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!(user && influencer)) {
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      if (!accessToken) {
        setErrorMessage("Silakan masuk terlebih dahulu.");
        return;
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          influencerId,
          title: formData.title,
          description: formData.description,
          requirements: formData.requirements,
          deliverables: formData.deliverables,
          deliveryDate: formData.deliveryDate,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { message?: string };
        throw new Error(payload.message || "Gagal membuat pesanan.");
      }

      setIsSuccess(true);
    } catch {
      setErrorMessage("Gagal mengirim permintaan pemesanan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleDeliverable = (deliverable: string) => {
    setFormData((prev) => ({
      ...prev,
      deliverables: prev.deliverables.includes(deliverable)
        ? prev.deliverables.filter((d) => d !== deliverable)
        : [...prev.deliverables, deliverable],
    }));
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-50 dark:bg-stone-950">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !influencer) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="mb-4 font-bold font-display text-2xl text-stone-900 dark:text-stone-50">
          Influencer tidak ditemukan
        </h2>
        {errorMessage && (
          <p className="text-sm text-stone-600 dark:text-stone-400">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }

  if (isSuccess) {
    return <OrderSuccess influencerName={influencer.user?.name ?? ""} />;
  }

  return (
    <div className="min-h-screen animate-fade-in bg-cream-50 py-12 dark:bg-stone-950">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <button
          className="mb-6 inline-flex items-center space-x-2 text-stone-600 hover:text-primary-600 dark:text-stone-400 dark:hover:text-primary-400"
          onClick={() => navigate(-1)}
          type="button"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Kembali</span>
        </button>

        <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-stone-900 dark:shadow-stone-950/50">
          <div className="mb-8 flex items-center space-x-4 border-stone-200 border-b pb-8 dark:border-stone-800">
            <img
              alt={influencer.user?.name}
              className="h-16 w-16 rounded-xl object-cover"
              height={64}
              src={
                influencer.user?.avatar_url ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${influencer.id}`
              }
              width={64}
            />
            <div>
              <h1 className="font-bold font-display text-2xl text-stone-900 dark:text-stone-50">
                Pesan Kolaborasi
              </h1>
              <p className="text-stone-600 dark:text-stone-400">
                dengan {influencer.user?.name}
              </p>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {errorMessage && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
                {errorMessage}
              </div>
            )}
            <div>
              <label
                className="mb-2 block font-medium text-sm text-stone-700 dark:text-stone-300"
                htmlFor="campaign-title"
              >
                Judul Kampanye *
              </label>
              <input
                className="input-field"
                id="campaign-title"
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Contoh: Peluncuran Koleksi Musim Panas"
                required
                type="text"
                value={formData.title}
              />
            </div>

            <div>
              <label
                className="mb-2 block font-medium text-sm text-stone-700 dark:text-stone-300"
                htmlFor="campaign-description"
              >
                Deskripsi Kampanye *
              </label>
              <textarea
                className="input-field resize-none"
                id="campaign-description"
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Jelaskan kampanye Anda, tujuan, dan apa yang Anda cari..."
                required
                rows={4}
                value={formData.description}
              />
            </div>

            <div>
              <label
                className="mb-2 block font-medium text-sm text-stone-700 dark:text-stone-300"
                htmlFor="campaign-requirements"
              >
                Persyaratan Spesifik
              </label>
              <textarea
                className="input-field resize-none"
                id="campaign-requirements"
                onChange={(e) =>
                  setFormData({ ...formData, requirements: e.target.value })
                }
                placeholder="Persyaratan spesifik, hashtag, atau panduan apa pun..."
                rows={3}
                value={formData.requirements}
              />
            </div>

            <DeliverablesSelector
              onToggle={toggleDeliverable}
              selected={formData.deliverables}
            />

            <div>
              <label
                className="mb-2 block font-medium text-sm text-stone-700 dark:text-stone-300"
                htmlFor="delivery-date"
              >
                Tanggal Pengiriman *
              </label>
              <input
                className="input-field"
                id="delivery-date"
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryDate: e.target.value })
                }
                required
                type="date"
                value={formData.deliveryDate}
              />
            </div>

            <PriceBreakdown basePrice={influencer.price_per_post} />

            <button
              className="btn-primary flex w-full items-center justify-center space-x-2 py-4 disabled:opacity-50"
              disabled={isSubmitting || formData.deliverables.length === 0}
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <DollarSign className="h-5 w-5" />
                  <span>Kirim Permintaan Pemesanan</span>
                </>
              )}
            </button>

            <p className="text-center text-stone-500 text-xs dark:text-stone-400">
              Dengan mengirimkan permintaan ini, Anda setuju dengan Syarat dan
              Ketentuan kami. Pembayaran hanya akan diproses setelah influencer
              menerima permintaan Anda.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
