export function StatsTicker() {
  const stats = [
    { value: "12K+", label: "Influencer Terdaftar" },
    { value: "98%", label: "Tingkat Kepuasan" },
    { value: "Rp 350K", label: "Rata-rata Biaya" },
    { value: "500+", label: "Brand Bergabung" },
  ];

  return (
    <section className="bg-stone-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <h2 className="font-bold text-3xl text-white tracking-tight sm:text-4xl">
              Dipercaya oleh Brand Lokal
            </h2>
            <p className="mt-4 text-lg text-stone-300 leading-8">
              Angka yang berbicara tentang kualitas komunitas kami.
            </p>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                className="flex flex-col bg-white/5 p-8 backdrop-blur-sm transition-colors hover:bg-white/10"
                key={stat.label}
              >
                <dt className="font-semibold text-sm text-stone-400 leading-6">
                  {stat.label}
                </dt>
                <dd className="order-first font-display font-semibold text-3xl text-white tracking-tight sm:text-5xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
