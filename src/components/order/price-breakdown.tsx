const PLATFORM_FEE_RATE = 0.1;

interface PriceBreakdownProps {
  basePrice: number;
}

export function PriceBreakdown({ basePrice }: PriceBreakdownProps) {
  const platformFee = Math.round(basePrice * PLATFORM_FEE_RATE * 100) / 100;
  const totalPrice = Math.round((basePrice + platformFee) * 100) / 100;

  return (
    <div className="space-y-3 rounded-xl bg-gray-50 p-6">
      <div className="flex items-center justify-between">
        <span className="text-gray-600">Biaya Layanan</span>
        <span className="font-medium">
          Rp {basePrice.toLocaleString("id-ID")}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-600">Biaya Platform (10%)</span>
        <span className="font-medium">
          Rp {platformFee.toLocaleString("id-ID")}
        </span>
      </div>
      <div className="flex items-center justify-between border-gray-200 border-t pt-3">
        <span className="font-semibold text-gray-900">Total</span>
        <span className="font-bold font-display text-2xl text-primary-600">
          Rp {totalPrice.toLocaleString("id-ID")}
        </span>
      </div>
    </div>
  );
}
