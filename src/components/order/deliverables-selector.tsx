import { CheckCircle } from "lucide-react";

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

interface DeliverablesSelectorProps {
  selected: string[];
  onToggle: (deliverable: string) => void;
}

export function DeliverablesSelector({
  selected,
  onToggle,
}: DeliverablesSelectorProps) {
  return (
    <fieldset className="space-y-3">
      <legend className="font-medium text-sm text-stone-700 dark:text-stone-300">
        Deliverables *
      </legend>
      <div className="grid grid-cols-2 gap-3">
        {DELIVERABLES.map((deliverable) => (
          <button
            className={`rounded-xl border-2 p-3 text-left transition-all ${
              selected.includes(deliverable)
                ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                : "border-stone-200 hover:border-stone-300 dark:border-stone-700 dark:hover:border-stone-600"
            }`}
            key={deliverable}
            onClick={() => onToggle(deliverable)}
            type="button"
          >
            <div className="flex items-center space-x-2">
              <div
                className={`flex h-4 w-4 items-center justify-center rounded border-2 ${
                  selected.includes(deliverable)
                    ? "border-primary-500 bg-primary-500"
                    : "border-stone-300 dark:border-stone-600"
                }`}
              >
                {selected.includes(deliverable) && (
                  <CheckCircle className="h-3 w-3 text-white" />
                )}
              </div>
              <span className="font-medium text-sm dark:text-stone-200">
                {deliverable}
              </span>
            </div>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export { DELIVERABLES };
