const PLATFORM_FEE_RATE = 0.1;

interface PriceBreakdownProps {
  basePrice: number;
}

export function PriceBreakdown({ basePrice }: PriceBreakdownProps) {
  const platformFee = Math.round(basePrice * PLATFORM_FEE_RATE * 100) / 100;
  const totalPrice = Math.round((basePrice + platformFee) * 100) / 100;

  return (
    <div className="space-y-3 rounded-xl bg-stone-50 p-6 dark:bg-stone-800">
      <div className="flex items-center justify-between">
        <span className="text-stone-600 dark:text-stone-400">
          Biaya Layanan
        </span>
        <span className="font-medium dark:text-stone-200">
          Rp {basePrice.toLocaleString("id-ID")}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-stone-600 dark:text-stone-400">
          Biaya Platform (10%)
        </span>
        <span className="font-medium dark:text-stone-200">
          Rp {platformFee.toLocaleString("id-ID")}
        </span>
      </div>
      <div className="flex items-center justify-between border-stone-200 border-t pt-3 dark:border-stone-700">
        <span className="font-semibold text-stone-900 dark:text-stone-50">
          Total
        </span>
        <span className="font-bold font-display text-2xl text-primary-600">
          Rp {totalPrice.toLocaleString("id-ID")}
        </span>
      </div>
    </div>
  );
}
