import { Check, MessageCircle, Star } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export function InteractiveDemo() {
  const { ref: sectionRef, isVisible } = useScrollReveal<HTMLElement>();

  const messages = [
    {
      user: "Batik Kencana",
      avatar: "B",
      text: "Halo Kak! Kami tertarik untuk kolaborasi campaign Lebaran.",
      time: "10:30",
      type: "brand",
    },
    {
      user: "Sari (Influencer)",
      avatar: "S",
      text: "Hai! Boleh banget kak, kebetulan niche aku fashion muslim.",
      time: "10:32",
      type: "influencer",
    },
    {
      user: "Batik Kencana",
      avatar: "B",
      text: "Siap, ini brief singkatnya ya kak...",
      time: "10:35",
      type: "brand",
    },
    {
      user: "System",
      text: "Offer Sent: Rp 500.000 for 1 Instagram Reels",
      time: "10:36",
      type: "system",
    },
    {
      user: "Sari (Influencer)",
      avatar: "S",
      text: "Deal! Aku akan draft kontennya besok ya.",
      time: "10:40",
      type: "influencer",
    },
  ];

  return (
    <section
      className="overflow-hidden bg-white py-24 sm:py-32 dark:bg-zinc-950"
      ref={sectionRef}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div
            className={`lg:pt-4 lg:pr-8 ${isVisible ? "scroll-visible-left" : "scroll-hidden-left"}`}
          >
            <div className="lg:max-w-lg">
              <h2 className="font-semibold text-base text-primary-600 leading-7">
                Kolaborasi Tanpa Ribet
              </h2>
              <p className="mt-2 font-bold font-display text-3xl text-zinc-900 tracking-tight sm:text-4xl dark:text-zinc-50">
                Chat, Deal, Bayar. <br />
                Dalam Satu Aplikasi.
              </p>
              <p className="mt-6 text-lg text-zinc-600 leading-8 dark:text-zinc-400">
                Lupakan email yang tenggelam atau DM yang tidak terbalas.
                NanoConnect menyediakan ruang kerja terpadu untuk negosiasi
                hingga pembayaran.
              </p>
              <dl className="mt-10 max-w-xl space-y-6 text-base text-zinc-600 leading-7 lg:max-w-none dark:text-zinc-400">
                {[
                  {
                    icon: MessageCircle,
                    title: "Direct Chat.",
                    desc: "Komunikasi langsung antara brand dan influencer tanpa perantara agency.",
                    delay: 200,
                  },
                  {
                    icon: Check,
                    title: "Kontrak Digital.",
                    desc: "Setiap kesepakatan tercatat otomatis sebagai kontrak kerja yang sah.",
                    delay: 350,
                  },
                  {
                    icon: Star,
                    title: "Review System.",
                    desc: "Sistem rating transparan untuk menjaga kualitas komunitas.",
                    delay: 500,
                  },
                ].map((item) => (
                  <div
                    className={`relative pl-9 ${isVisible ? "scroll-visible" : "scroll-hidden"}`}
                    key={item.title}
                    style={{ transitionDelay: `${item.delay}ms` }}
                  >
                    <dt className="font-semibold text-zinc-900 dark:text-zinc-100">
                      <item.icon
                        aria-hidden="true"
                        className="absolute top-1 left-1 h-5 w-5 text-primary-600"
                      />
                      {item.title}
                    </dt>
                    <dd className="mt-1">{item.desc}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div
            className={`flex items-center justify-center lg:justify-end ${isVisible ? "scroll-visible-right" : "scroll-hidden-right"}`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="relative h-[600px] w-[300px] rounded-[3rem] border-[14px] border-zinc-900 bg-zinc-950 shadow-2xl ring-1 ring-zinc-900/50">
              <div className="absolute top-4 left-1/2 z-20 h-[25px] w-[90px] -translate-x-1/2 rounded-full bg-black" />

              <div className="absolute top-[100px] -left-[16px] h-[40px] w-[4px] rounded-l-lg bg-zinc-800" />
              <div className="absolute top-[150px] -left-[16px] h-[40px] w-[4px] rounded-l-lg bg-zinc-800" />
              <div className="absolute top-[120px] -right-[16px] h-[60px] w-[4px] rounded-r-lg bg-zinc-800" />

              <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[2rem] bg-zinc-50 dark:bg-zinc-900">
                <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-50" />

                <div className="relative z-10 flex shrink-0 items-center justify-between bg-white/90 px-5 pt-12 pb-3 shadow-sm backdrop-blur-md dark:bg-zinc-900/90 dark:shadow-zinc-950/20">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-100 to-primary-200 font-bold text-primary-800 shadow-inner">
                        S
                      </div>
                      <div className="absolute right-0 bottom-0 h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-zinc-900 leading-tight dark:text-zinc-50">
                        Sari Dewi
                      </div>
                      <div className="font-medium text-[10px] text-zinc-500 dark:text-zinc-400">
                        Online
                      </div>
                    </div>
                  </div>
                </div>

                <div className="scrollbar-hide flex flex-1 flex-col gap-3 overflow-y-auto bg-zinc-50 p-4 dark:bg-zinc-900">
                  {messages.map((msg, i) => {
                    const messageStyles: Record<string, string> = {
                      brand:
                        "self-end rounded-br-sm bg-gradient-to-br from-primary-500 to-primary-600 text-white",
                      system:
                        "my-2 w-full max-w-[90%] self-center rounded-full border border-zinc-200 bg-zinc-100/80 py-1.5 text-center text-[10px] text-zinc-500 shadow-none backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-400",
                      influencer:
                        "self-start rounded-bl-sm border border-zinc-100 bg-white text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
                    };
                    return (
                      <div
                        className={`flex w-max max-w-[85%] flex-col gap-1 rounded-2xl px-4 py-2.5 text-sm shadow-sm transition ${messageStyles[msg.type]} animate-fade-in opacity-0 motion-reduce:animate-none motion-reduce:opacity-100`}
                        key={`msg-${msg.time}`}
                        style={{
                          animationDelay: isVisible
                            ? `${i * 800 + 600}ms`
                            : "0ms",
                          animationFillMode: "forwards",
                          animationPlayState: isVisible ? "running" : "paused",
                        }}
                      >
                        {msg.text}
                        {msg.type !== "system" && (
                          <span
                            className={`text-[10px] ${msg.type === "brand" ? "text-primary-100/80" : "text-zinc-400"} mt-1 self-end leading-none`}
                          >
                            {msg.time}
                          </span>
                        )}
                      </div>
                    );
                  })}

                  <div
                    className="flex w-max animate-fade-in items-center gap-1 self-start rounded-2xl rounded-bl-sm border border-zinc-100 bg-white px-3 py-3 opacity-0 shadow-sm motion-reduce:animate-none motion-reduce:opacity-100 dark:border-zinc-700 dark:bg-zinc-800"
                    style={{
                      animationDelay: isVisible ? "5000ms" : "0ms",
                      animationFillMode: "forwards",
                      animationPlayState: isVisible ? "running" : "paused",
                    }}
                  >
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]" />
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]" />
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" />
                  </div>
                </div>

                <div className="relative z-10 w-full shrink-0 border-zinc-100 border-t bg-white px-4 pt-3 pb-6 dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-100 px-4 py-2.5 dark:border-zinc-700 dark:bg-zinc-800">
                    <div className="text-sm text-zinc-400">Tulis pesan...</div>
                  </div>
                  <div className="mx-auto mt-2 h-1 w-1/3 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
