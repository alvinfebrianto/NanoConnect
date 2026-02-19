import {
  Briefcase,
  Camera,
  Coffee,
  Dumbbell,
  Gift,
  Globe,
  Heart,
  Monitor,
  Music,
  Palette,
  ShoppingBag,
  Tag,
  Tent,
  Utensils,
} from "lucide-react";

const NICHES = [
  { icon: Coffee, label: "F&B" },
  { icon: ShoppingBag, label: "Fashion" },
  { icon: Utensils, label: "Kuliner" },
  { icon: Camera, label: "Photography" },
  { icon: Music, label: "Music" },
  { icon: Tent, label: "Travel" },
  { icon: Dumbbell, label: "Fitness" },
  { icon: Briefcase, label: "Business" },
  { icon: Monitor, label: "Tech" },
  { icon: Heart, label: "Beauty" },
  { icon: Palette, label: "Art" },
  { icon: Globe, label: "News" },
  { icon: Tag, label: "Retail" },
  { icon: Gift, label: "Gifts" },
];

export function MarqueeBrands() {
  return (
    <section className="relative w-full overflow-hidden border-stone-200 border-y bg-white py-10">
      <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_128px,black_calc(100%-128px),transparent)]">
        <div className="flex min-w-full shrink-0 animate-marquee items-center justify-around gap-16 px-8">
          {NICHES.map(({ icon: Icon, label }) => (
            <div
              className="flex items-center gap-3 text-stone-400 grayscale transition-all duration-300 hover:scale-110 hover:text-amber-600 hover:grayscale-0"
              key={label}
            >
              <Icon className="h-8 w-8" />
              <span className="whitespace-nowrap font-bold font-display text-xl">
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="flex min-w-full shrink-0 animate-marquee items-center justify-around gap-16 px-8">
          {NICHES.map(({ icon: Icon, label }) => (
            <div
              className="flex items-center gap-3 text-stone-400 grayscale transition-all duration-300 hover:scale-110 hover:text-amber-600 hover:grayscale-0"
              key={`dup-${label}`}
            >
              <Icon className="h-8 w-8" />
              <span className="whitespace-nowrap font-bold font-display text-xl">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
