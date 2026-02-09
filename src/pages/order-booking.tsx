import { ArrowLeft, CheckCircle, DollarSign, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import type { Influencer } from "@/types";

const DELIVERABLES = [
  "Postingan Instagram",
  "Story Instagram",
  "Reel Instagram",
  "Video TikTok",
  "Video YouTube",
  "Postingan Twitter/X",
  "Postingan Blog",
  "Ulasan Produk",
];

export function OrderBooking() {
  const { influencerId } = useParams<{ influencerId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    deliverables: [] as string[],
    deliveryDate: "",
  });

  useEffect(() => {
    async function fetchInfluencer() {
      if (!influencerId) {
        return;
      }

      try {
        const { data, error } = await supabase
          .from("influencers")
          .select("*, user:users(*)")
          .eq("id", influencerId)
          .single();

        if (error) {
          throw error;
        }
        setInfluencer(data);
      } catch (error) {
        console.error("Error fetching influencer:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchInfluencer();
  }, [influencerId]);

  const MIN_PRICE = 0;
  const MAX_PRICE = 100_000;
  const PLATFORM_FEE_RATE = 0.1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!(user && influencer)) {
      return;
    }

    const price = influencer.price_per_post;
    if (typeof price !== "number" || price < MIN_PRICE || price > MAX_PRICE) {
      console.error("Harga tidak valid");
      return;
    }

    const invalidDeliverables = formData.deliverables.filter(
      (d) => !DELIVERABLES.includes(d)
    );
    if (invalidDeliverables.length > 0) {
      console.error("Deliverables yang dipilih tidak valid");
      return;
    }

    const deliveryDate = new Date(formData.deliveryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (deliveryDate < today) {
      console.error("Tanggal pengiriman harus di masa depan");
      return;
    }

    setIsSubmitting(true);

    try {
      const platformFee = Math.round(price * PLATFORM_FEE_RATE * 100) / 100;
      const totalPrice = Math.round((price + platformFee) * 100) / 100;

      const orderData: {
        influencer_id: string;
        sme_id: string;
        title: string;
        description: string | null;
        requirements: string | null;
        deliverables: string[];
        delivery_date: string | null;
        total_price: number;
        platform_fee: number;
      } = {
        influencer_id: influencerId,
        sme_id: user.id,
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        requirements: formData.requirements.trim() || null,
        deliverables: formData.deliverables,
        delivery_date: formData.deliveryDate || null,
        total_price: totalPrice,
        platform_fee: platformFee,
      };

      const { error } = await supabase.from("orders").insert(orderData);

      if (error) {
        throw error;
      }
      setIsSuccess(true);
    } catch (error) {
      console.error("Error creating order:", error);
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
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="gradient-bg flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="mb-4 font-bold font-display text-2xl text-gray-900">
            Permintaan Pemesanan Terkirim!
          </h2>
          <p className="mb-6 text-gray-600">
            Permintaan kolaborasi Anda telah dikirim ke {influencer.user?.name}.
            Mereka akan meninjau permintaan Anda dan merespons dalam waktu 24
            jam.
          </p>
          <button
            className="btn-primary w-full"
            onClick={() => navigate("/influencers")}
            type="button"
          >
            Jelajahi Influencer Lainnya
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="gradient-bg min-h-screen animate-fade-in py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <button
          className="mb-6 inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600"
          onClick={() => navigate(-1)}
          type="button"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Kembali</span>
        </button>

        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <div className="mb-8 flex items-center space-x-4 border-gray-100 border-b pb-8">
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
              <h1 className="font-bold font-display text-2xl text-gray-900">
                Pesan Kolaborasi
              </h1>
              <p className="text-gray-600">dengan {influencer.user?.name}</p>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                className="mb-2 block font-medium text-gray-700 text-sm"
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
                className="mb-2 block font-medium text-gray-700 text-sm"
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
                className="mb-2 block font-medium text-gray-700 text-sm"
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

            <fieldset className="space-y-3">
              <legend className="font-medium text-gray-700 text-sm">
                Deliverables *
              </legend>
              <div className="grid grid-cols-2 gap-3">
                {DELIVERABLES.map((deliverable) => (
                  <button
                    className={`rounded-xl border-2 p-3 text-left transition-all ${
                      formData.deliverables.includes(deliverable)
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    key={deliverable}
                    onClick={() => toggleDeliverable(deliverable)}
                    type="button"
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className={`flex h-4 w-4 items-center justify-center rounded border-2 ${
                          formData.deliverables.includes(deliverable)
                            ? "border-primary-500 bg-primary-500"
                            : "border-gray-300"
                        }`}
                      >
                        {formData.deliverables.includes(deliverable) && (
                          <CheckCircle className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span className="font-medium text-sm">{deliverable}</span>
                    </div>
                  </button>
                ))}
              </div>
            </fieldset>

            <div>
              <label
                className="mb-2 block font-medium text-gray-700 text-sm"
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

            <div className="space-y-3 rounded-xl bg-gray-50 p-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Biaya Layanan</span>
                <span className="font-medium">
                  Rp{" "}
                  {(influencer.price_per_post * 15_000).toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Biaya Platform (10%)</span>
                <span className="font-medium">
                  Rp{" "}
                  {(influencer.price_per_post * 15_000 * 0.1).toLocaleString(
                    "id-ID"
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between border-gray-200 border-t pt-3">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold font-display text-2xl text-primary-600">
                  Rp{" "}
                  {(influencer.price_per_post * 15_000 * 1.1).toLocaleString(
                    "id-ID"
                  )}
                </span>
              </div>
            </div>

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

            <p className="text-center text-gray-500 text-xs">
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
