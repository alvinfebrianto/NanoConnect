import { useCallback, useEffect, useState } from "react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

function useCountUp(end: number, isActive: boolean, duration = 1800) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    let startTime: number | null = null;
    let rafId: number;

    const step = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.floor(eased * end));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [end, isActive, duration]);

  return count;
}

function StatCard({
  value,
  suffix,
  label,
  isVisible,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  isVisible: boolean;
  delay: number;
}) {
  const count = useCountUp(value, isVisible);
  const formatValue = useCallback(
    (n: number) => {
      if (suffix === "K+") {
        return `${n}K+`;
      }
      if (suffix === "%") {
        return `${n}%`;
      }
      if (suffix === "K") {
        return `Rp ${n}K`;
      }
      if (suffix === "+") {
        return `${n}+`;
      }
      return `${n}`;
    },
    [suffix]
  );

  return (
    <div
      className={`flex flex-col bg-white/5 p-8 backdrop-blur-sm transition-all duration-500 hover:bg-white/10 ${
        isVisible ? "scroll-visible" : "scroll-hidden"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <dt className="font-semibold text-sm text-zinc-400 leading-6">{label}</dt>
      <dd className="order-first font-display font-semibold text-3xl text-white tracking-tight sm:text-5xl">
        {isVisible ? formatValue(count) : formatValue(0)}
      </dd>
    </div>
  );
}

const STATS = [
  { value: 12, suffix: "K+", label: "Influencer Terdaftar" },
  { value: 98, suffix: "%", label: "Tingkat Kepuasan" },
  { value: 350, suffix: "K", label: "Rata-rata Biaya" },
  { value: 500, suffix: "+", label: "Brand Bergabung" },
];

export function StatsTicker() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section className="bg-zinc-900 py-24 sm:py-32" ref={ref}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div
            className={`text-center ${isVisible ? "scroll-visible" : "scroll-hidden"}`}
          >
            <h2 className="font-bold font-display text-3xl text-white tracking-tight sm:text-4xl">
              Dipercaya oleh Brand Lokal
            </h2>
            <p className="mt-4 text-lg text-zinc-300 leading-8">
              Angka yang berbicara tentang kualitas komunitas kami.
            </p>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat, i) => (
              <StatCard
                delay={i * 150}
                isVisible={isVisible}
                key={stat.label}
                label={stat.label}
                suffix={stat.suffix}
                value={stat.value}
              />
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
