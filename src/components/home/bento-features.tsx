import { BrainCircuit, CreditCard } from "lucide-react";

export function BentoFeatures() {
  return (
    <section className="bg-stone-50 py-24 sm:py-32 dark:bg-stone-900">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-center font-display font-semibold text-amber-600 text-base/7">
          Mengapa NanoConnect?
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-balance text-center font-display font-semibold text-4xl text-stone-950 tracking-tight sm:text-5xl dark:text-stone-50">
          Semua yang Anda butuhkan untuk campaign viral.
        </p>

        <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
          <div className="relative lg:col-span-2 lg:row-span-2">
            <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem] dark:bg-stone-800" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
              <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                <p className="mt-2 font-medium text-lg/7 text-stone-950 tracking-tight max-lg:text-center dark:text-stone-100">
                  AI-Powered Matching
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-stone-600 max-lg:text-center dark:text-stone-400">
                  Algoritma kami menganalisis jutaan data point untuk menemukan
                  kreator yang 100% cocok dengan brand values Anda.
                </p>
              </div>
              <div className="relative min-h-[30rem] w-full grow [container-type:inline-size] max-lg:mx-auto max-lg:max-w-sm">
                <div className="absolute inset-x-10 top-10 bottom-0 overflow-hidden rounded-t-[12cqw] border-stone-900 border-x-[3cqw] border-t-[3cqw] bg-stone-900 shadow-2xl">
                  <div className="flex h-full flex-col items-center justify-center bg-stone-800 p-6 text-white">
                    <BrainCircuit className="h-24 w-24 animate-pulse text-amber-500" />
                    <div className="mt-4 space-y-2 text-center text-stone-400 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span>Analisis Audiens</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        <span>Prediksi Engagement</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-purple-500" />
                        <span>Cek Brand Safety</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-l-[2rem] dark:ring-white/10" />
          </div>

          <div className="relative lg:col-start-3 lg:row-start-1">
            <div className="absolute inset-px rounded-lg bg-white lg:rounded-tr-[2rem] dark:bg-stone-800" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-tr-[calc(2rem+1px)]">
              <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                <p className="mt-2 font-medium text-lg/7 text-stone-950 tracking-tight max-lg:text-center dark:text-stone-100">
                  Pembayaran Aman
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-stone-600 max-lg:text-center dark:text-stone-400">
                  Dana ditahan di Escrow dan hanya cair setelah konten tayang.
                </p>
              </div>
              <div className="flex flex-1 items-center justify-center px-8 max-lg:pt-10 max-lg:pb-12 sm:px-10 lg:pb-2">
                <div className="relative h-24 w-full max-w-[200px] rotate-3 rounded-xl bg-gradient-to-br from-stone-900 to-stone-700 p-4 text-white shadow-xl transition-transform hover:rotate-0">
                  <CreditCard className="mb-2 h-6 w-6 text-amber-400" />
                  <div className="h-2 w-12 rounded bg-white/20" />
                  <div className="mt-4 h-2 w-24 rounded bg-white/10" />
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-tr-[2rem] dark:ring-white/10" />
          </div>

          <div className="relative lg:col-start-3 lg:row-start-2">
            <div className="absolute inset-px rounded-lg bg-white lg:rounded-br-[2rem] dark:bg-stone-800" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-br-[calc(2rem+1px)]">
              <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                <p className="mt-2 font-medium text-lg/7 text-stone-950 tracking-tight max-lg:text-center dark:text-stone-100">
                  Real-time Analytics
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-stone-600 max-lg:text-center dark:text-stone-400">
                  Pantau performa campaign Anda secara langsung dari dashboard.
                </p>
              </div>
              <div className="flex flex-1 items-center justify-center px-8 max-lg:pt-10 max-lg:pb-12 sm:px-10 lg:pb-2">
                <div className="flex items-end gap-3 pb-8">
                  <div className="h-8 w-6 rounded-t-md bg-stone-200 dark:bg-stone-700" />
                  <div className="h-14 w-6 rounded-t-md bg-amber-200" />
                  <div className="h-20 w-6 rounded-t-md bg-amber-300" />
                  <div className="h-28 w-6 rounded-t-md bg-amber-400" />
                  <div className="h-36 w-6 animate-pulse rounded-t-md bg-amber-500 shadow-amber-500/20 shadow-lg" />
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-br-[2rem] dark:ring-white/10" />
          </div>

          <div className="relative lg:col-span-3 lg:row-start-3" />
        </div>
      </div>
    </section>
  );
}
