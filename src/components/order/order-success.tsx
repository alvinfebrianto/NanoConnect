import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OrderSuccessProps {
  influencerName: string;
}

export function OrderSuccess({ influencerName }: OrderSuccessProps) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-50 px-4 py-12 dark:bg-stone-950">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl dark:bg-stone-900 dark:shadow-stone-950/50">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="mb-4 font-bold font-display text-2xl text-stone-900 dark:text-stone-50">
          Permintaan Pemesanan Terkirim!
        </h2>
        <p className="mb-6 text-stone-600 dark:text-stone-400">
          Permintaan kolaborasi Anda telah dikirim ke {influencerName}. Mereka
          akan meninjau permintaan Anda dan merespons dalam waktu 24 jam.
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
