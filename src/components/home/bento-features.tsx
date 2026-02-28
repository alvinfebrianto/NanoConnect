import { BrainCircuit, CreditCard } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export function BentoFeatures() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section className="bg-zinc-50 py-24 sm:py-32 dark:bg-zinc-900" ref={ref}>
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <div className={isVisible ? "scroll-visible" : "scroll-hidden"}>
          <h2 className="text-center font-display font-semibold text-base/7 text-primary-600">
            Mengapa NanoConnect?
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-balance text-center font-display font-semibold text-4xl text-zinc-950 tracking-tight sm:text-5xl dark:text-zinc-50">
            Semua yang Anda butuhkan untuk campaign viral.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
          <div
            className={`relative lg:col-span-2 lg:row-span-2 ${isVisible ? "scroll-visible-left" : "scroll-hidden-left"}`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem] dark:bg-zinc-800" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
              <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                <p className="mt-2 font-medium text-lg/7 text-zinc-950 tracking-tight max-lg:text-center dark:text-zinc-100">
                  AI-Powered Matching
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-zinc-600 max-lg:text-center dark:text-zinc-400">
                  Algoritma kami menganalisis jutaan data point untuk menemukan
                  kreator yang 100% cocok dengan brand values Anda.
                </p>
              </div>
              <div className="relative min-h-[30rem] w-full grow [container-type:inline-size] max-lg:mx-auto max-lg:max-w-sm">
                <div className="absolute inset-x-10 top-10 bottom-0 overflow-hidden rounded-t-[12cqw] border-zinc-900 border-x-[3cqw] border-t-[3cqw] bg-zinc-900 shadow-2xl">
                  <div className="flex h-full flex-col items-center justify-center bg-zinc-800 p-6 text-white">
                    <BrainCircuit className="h-24 w-24 animate-pulse text-primary-500" />
                    <div className="mt-4 space-y-2 text-center text-xs text-zinc-400">
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

          <div
            className={`relative lg:col-start-3 lg:row-start-1 ${isVisible ? "scroll-visible" : "scroll-hidden"}`}
            style={{ transitionDelay: "350ms" }}
          >
            <div className="absolute inset-px rounded-lg bg-white lg:rounded-tr-[2rem] dark:bg-zinc-800" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-tr-[calc(2rem+1px)]">
              <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                <p className="mt-2 font-medium text-lg/7 text-zinc-950 tracking-tight max-lg:text-center dark:text-zinc-100">
                  Pembayaran Aman
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-zinc-600 max-lg:text-center dark:text-zinc-400">
                  Dana ditahan di Escrow dan hanya cair setelah konten tayang.
                </p>
              </div>
              <div className="flex flex-1 items-center justify-center px-8 max-lg:pt-10 max-lg:pb-12 sm:px-10 lg:pb-2">
                <div className="group relative h-24 w-full max-w-[200px] rotate-3 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-700 p-4 text-white shadow-xl transition-all duration-500 hover:rotate-0 hover:scale-105 hover:shadow-2xl">
                  <CreditCard className="mb-2 h-6 w-6 text-primary-400 transition-transform duration-300 group-hover:scale-110" />
                  <div className="h-2 w-12 rounded bg-white/20" />
                  <div className="mt-4 h-2 w-24 rounded bg-white/10" />
                  <div className="absolute inset-0 -translate-x-full rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-tr-[2rem] dark:ring-white/10" />
          </div>

          <div
            className={`relative lg:col-start-3 lg:row-start-2 ${isVisible ? "scroll-visible" : "scroll-hidden"}`}
            style={{ transitionDelay: "500ms" }}
          >
            <div className="absolute inset-px rounded-lg bg-white lg:rounded-br-[2rem] dark:bg-zinc-800" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-br-[calc(2rem+1px)]">
              <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                <p className="mt-2 font-medium text-lg/7 text-zinc-950 tracking-tight max-lg:text-center dark:text-zinc-100">
                  Real-time Analytics
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-zinc-600 max-lg:text-center dark:text-zinc-400">
                  Pantau performa campaign Anda secara langsung dari dashboard.
                </p>
              </div>
              <div className="flex flex-1 items-center justify-center px-8 max-lg:pt-10 max-lg:pb-12 sm:px-10 lg:pb-2">
                <div className="flex items-end gap-3 pb-8">
                  {[
                    {
                      h: "h-8",
                      color: "bg-zinc-200 dark:bg-zinc-700",
                      delay: 0,
                    },
                    { h: "h-14", color: "bg-primary-200", delay: 100 },
                    { h: "h-20", color: "bg-primary-300", delay: 200 },
                    { h: "h-28", color: "bg-primary-400", delay: 300 },
                    {
                      h: "h-36",
                      color: "bg-primary-500 shadow-lg shadow-primary-500/20",
                      delay: 400,
                    },
                  ].map((bar) => (
                    <div
                      className={`${bar.h} w-6 rounded-t-md ${bar.color} transition-all duration-500 hover:scale-y-110 hover:brightness-110`}
                      key={bar.delay}
                      style={{
                        transformOrigin: "bottom",
                        transitionDelay: isVisible
                          ? `${600 + bar.delay}ms`
                          : "0ms",
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? "scaleY(1)" : "scaleY(0)",
                      }}
                    />
                  ))}
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
