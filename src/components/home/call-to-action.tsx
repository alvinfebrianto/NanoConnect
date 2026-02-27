import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function CallToAction() {
  return (
    <section className="relative isolate overflow-hidden bg-zinc-900 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          <div className="max-w-xl lg:max-w-lg">
            <h2 className="font-bold font-display text-3xl text-white tracking-tight sm:text-4xl">
              Siap untuk Viralkan Brand Anda?
            </h2>
            <p className="mt-4 text-lg text-zinc-300 leading-8">
              Bergabung sekarang dan dapatkan akses ke ribuan kreator lokal yang
              siap membantu pertumbuhan bisnis Anda.
            </p>
            <div className="mt-6 flex max-w-md gap-x-4">
              <Link
                className="flex-none rounded-md bg-accent-500 px-3.5 py-2.5 font-semibold text-sm text-white shadow-sm hover:bg-accent-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-500 focus-visible:outline-offset-2"
                to="/register"
              >
                Daftar Gratis
              </Link>
              <Link
                className="flex-none rounded-md bg-white/10 px-3.5 py-2.5 font-semibold text-sm text-white shadow-sm hover:bg-white/20"
                to="/contact"
              >
                Hubungi Kami <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                <ArrowRight aria-hidden="true" className="h-6 w-6 text-white" />
              </div>
              <dt className="mt-4 font-semibold text-white">
                Tanpa Biaya Langganan
              </dt>
              <dd className="mt-2 text-zinc-400 leading-7">
                Hanya bayar saat Anda deal dengan influencer. Tidak ada biaya
                bulanan tersembunyi.
              </dd>
            </div>
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                <ArrowRight aria-hidden="true" className="h-6 w-6 text-white" />
              </div>
              <dt className="mt-4 font-semibold text-white">Support 24/7</dt>
              <dd className="mt-2 text-zinc-400 leading-7">
                Tim kami siap membantu Anda kapan saja, mulai dari briefing
                hingga reporting.
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -z-10 -translate-x-1/2 blur-3xl xl:-top-6"
      >
        <div
          className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-primary-600 to-accent-500 opacity-30"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </section>
  );
}
