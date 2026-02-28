import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] w-full overflow-hidden bg-cream-50 pt-20 pb-16 lg:pt-32 lg:pb-20 dark:bg-zinc-950">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0d94880a_1px,transparent_1px),linear-gradient(to_bottom,#0d94880a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-[500px] w-[500px] animate-hero-blob rounded-full bg-primary-400/20 blur-[100px]" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-[500px] w-[500px] animate-hero-blob rounded-full bg-primary-400/20 blur-[100px] [animation-delay:-5s]" />
        <div className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 animate-hero-blob rounded-full bg-accent-400/10 blur-[80px] [animation-delay:-3s]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 animate-fade-in opacity-0 [animation-delay:200ms] [animation-fill-mode:forwards]">
            <span className="group inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 font-semibold text-primary-600 text-sm shadow-sm ring-1 ring-black/5 backdrop-blur-md transition-all hover:scale-105 hover:shadow-md dark:bg-zinc-800/80 dark:ring-white/10">
              <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12 group-hover:scale-125" />
              <span>Revolusi Marketing UMKM Indonesia</span>
            </span>
          </div>

          <h1 className="relative mb-6 max-w-4xl animate-slide-up font-bold font-display text-5xl text-zinc-900 leading-[0.9] tracking-tight opacity-0 [animation-delay:400ms] [animation-fill-mode:forwards] sm:text-6xl lg:text-8xl dark:text-zinc-50">
            Cerita Brand <br />
            <span className="relative z-10 inline-block bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700 bg-clip-text text-transparent">
              Lebih Autentik
              <svg
                aria-hidden="true"
                className="absolute -bottom-2 left-0 -z-10 h-2 w-full text-primary-200"
                preserveAspectRatio="none"
                viewBox="0 0 100 10"
              >
                <title>Decorative underline</title>
                <path
                  className="animate-fade-in opacity-0 [animation-delay:900ms] [animation-fill-mode:forwards]"
                  d="M0 5 Q 50 10 100 5"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="200"
                  strokeDashoffset="200"
                  strokeWidth="8"
                  style={{
                    animation:
                      "fadeIn 0.5s ease-out 0.9s forwards, draw 0.8s ease-out 0.9s forwards",
                  }}
                />
              </svg>
            </span>
          </h1>

          <p className="mb-10 max-w-2xl animate-slide-up text-balance text-base text-zinc-600 opacity-0 [animation-delay:600ms] [animation-fill-mode:forwards] sm:text-lg lg:text-xl dark:text-zinc-400">
            Platform pertama yang menghubungkan UMKM dengan ribuan Nano
            Influencer lokal.
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {" "}
              Hemat budget, hasil maksimal.
            </span>
          </p>

          <div className="flex w-full animate-slide-up flex-col gap-4 opacity-0 [animation-delay:800ms] [animation-fill-mode:forwards] sm:w-auto sm:flex-row">
            <Link
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-zinc-900 px-8 py-4 font-semibold text-lg text-white transition-all hover:scale-105 hover:bg-zinc-800 hover:shadow-primary-500/20 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
              to="/influencers"
            >
              <span className="mr-2">Mulai Sekarang</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-500 to-primary-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </Link>
          </div>

          <div className="mt-12 flex animate-fade-in items-center gap-6 opacity-0 [animation-delay:1100ms] [animation-fill-mode:forwards]">
            <div className="flex -space-x-3">
              {["🧕", "👨", "👩", "🧑"].map((emoji, i) => (
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-primary-100 text-lg shadow-sm dark:border-zinc-900"
                  key={emoji}
                  style={{ animationDelay: `${1200 + i * 100}ms` }}
                >
                  {emoji}
                </div>
              ))}
            </div>
            <p className="text-left text-sm text-zinc-500 dark:text-zinc-400">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                500+ brand
              </span>{" "}
              sudah bergabung
            </p>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute top-1/2 left-0 hidden -translate-y-1/2 animate-float opacity-0 [animation-delay:1000ms] [animation-fill-mode:forwards] lg:block">
        <div className="relative -left-12 h-40 w-40 rotate-12 rounded-3xl bg-white p-4 shadow-xl transition-transform hover:rotate-0 hover:scale-110">
          <div className="h-full w-full rounded-2xl bg-zinc-100" />
          <div className="absolute -top-4 -right-4 rounded-full bg-primary-100 p-3 shadow-lg">
            <span className="text-2xl">🔥</span>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute top-1/3 right-0 hidden animate-float-delayed opacity-0 [animation-delay:1200ms] [animation-fill-mode:forwards] lg:block">
        <div className="relative -right-12 h-48 w-40 -rotate-6 rounded-3xl bg-zinc-900 p-4 shadow-2xl transition-transform hover:rotate-0 hover:scale-110">
          <div className="h-full w-full rounded-2xl bg-zinc-800" />
          <div className="absolute -bottom-4 -left-4 rounded-full bg-white p-3 shadow-lg">
            <span className="text-2xl">💬</span>
          </div>
        </div>
      </div>
    </section>
  );
}
