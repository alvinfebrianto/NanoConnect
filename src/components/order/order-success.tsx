import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OrderSuccessProps {
  influencerName: string;
}

export function OrderSuccess({ influencerName }: OrderSuccessProps) {
  const navigate = useNavigate();

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
