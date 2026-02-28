import { Star } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const testimonials = [
  {
    body: "Platform ini mengubah cara kami bekerja sama dengan influencer. Dalam seminggu sudah menemukan 5 kreator yang cocok.",
    author: {
      name: "Rina Susanti",
      handle: "Batik Nusantara",
      imageUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    body: "Budget-friendly tapi kualitas luar biasa. Engagement rate kreator lokal jauh lebih tinggi dibanding macro influencer.",
    author: {
      name: "Budi Hartono",
      handle: "Kopi Kuy",
      imageUrl:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    body: "Fitur AI recommendation-nya sangat akurat. 3 dari 4 rekomendasi langsung deal dan hasil kampanye melebihi ekspektasi.",
    author: {
      name: "Maya Putri",
      handle: "Skincare Lokal",
      imageUrl:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
];

export function Testimonials() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <div className="bg-white py-24 sm:py-32 dark:bg-zinc-950" ref={ref}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          className={`mx-auto max-w-xl text-center ${isVisible ? "scroll-visible" : "scroll-hidden"}`}
        >
          <h2 className="font-semibold text-lg text-primary-600 leading-8 tracking-tight">
            Testimoni
          </h2>
          <p className="mt-2 font-bold font-display text-3xl text-zinc-900 tracking-tight sm:text-4xl dark:text-zinc-50">
            Kata Mereka Tentang NanoConnect
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, i) => (
              <div
                className={`h-full ${isVisible ? "scroll-visible-scale" : "scroll-hidden-scale"}`}
                key={testimonial.author.handle}
                style={{ transitionDelay: `${200 + i * 150}ms` }}
              >
                <figure className="group flex h-full flex-col justify-between rounded-2xl bg-zinc-50 p-8 text-sm leading-6 transition-all duration-500 hover:-translate-y-1 hover:bg-primary-50 hover:shadow-lg dark:bg-zinc-900 dark:hover:bg-zinc-800">
                  <div>
                    <div className="mb-4 flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          className="h-4 w-4 fill-amber-400 text-amber-400 transition-transform duration-300 group-hover:scale-110"
                          key={`star-${star}`}
                          style={{
                            transitionDelay: `${star * 50}ms`,
                          }}
                        />
                      ))}
                    </div>
                    <blockquote className="text-zinc-900 dark:text-zinc-200">
                      <p>"{testimonial.body}"</p>
                    </blockquote>
                  </div>
                  <figcaption className="mt-6 flex items-center gap-x-4">
                    <img
                      alt=""
                      className="h-10 w-10 rounded-full bg-zinc-50 transition-transform duration-300 group-hover:scale-110"
                      height={40}
                      src={testimonial.author.imageUrl}
                      width={40}
                    />
                    <div>
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {testimonial.author.name}
                      </div>
                      <div className="text-zinc-600 dark:text-zinc-400">
                        @{testimonial.author.handle}
                      </div>
                    </div>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
