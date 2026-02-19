import { Check, MessageCircle, Star } from "lucide-react";

export function InteractiveDemo() {
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
      text: "Offer Sent: Rp 500.000 for 1 IG Reels",
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
    <section className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pt-4 lg:pr-8">
            <div className="lg:max-w-lg">
              <h2 className="font-semibold text-amber-600 text-base leading-7">
                Kolaborasi Tanpa Ribet
              </h2>
              <p className="mt-2 font-bold font-display text-3xl text-stone-900 tracking-tight sm:text-4xl">
                Chat, Deal, Bayar. <br />
                Dalam Satu Aplikasi.
              </p>
              <p className="mt-6 text-lg text-stone-600 leading-8">
                Lupakan email yang tenggelam atau DM yang tidak terbalas.
                NanoConnect menyediakan ruang kerja terpadu untuk negosiasi
                hingga pembayaran.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base text-stone-600 leading-7 lg:max-w-none">
                <div className="relative pl-9">
                  <dt className="inline font-semibold text-stone-900">
                    <MessageCircle className="absolute top-1 left-1 h-5 w-5 text-amber-600" />
                    Direct Chat.
                  </dt>
                  <dd className="inline">
                    Komunikasi langsung antara brand dan influencer tanpa
                    perantara agency.
                  </dd>
                </div>
                <div className="relative pl-9">
                  <dt className="inline font-semibold text-stone-900">
                    <Check className="absolute top-1 left-1 h-5 w-5 text-amber-600" />
                    Kontrak Digital.
                  </dt>
                  <dd className="inline">
                    Setiap kesepakatan tercatat otomatis sebagai kontrak kerja
                    yang sah.
                  </dd>
                </div>
                <div className="relative pl-9">
                  <dt className="inline font-semibold text-stone-900">
                    <Star className="absolute top-1 left-1 h-5 w-5 text-amber-600" />
                    Review System.
                  </dt>
                  <dd className="inline">
                    Sistem rating transparan untuk menjaga kualitas komunitas.
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="relative h-[600px] w-[300px] rounded-[3rem] border-[14px] border-stone-900 bg-stone-950 shadow-2xl ring-1 ring-stone-900/50">
              {/* Dynamic Island / Notch */}
              <div className="absolute top-4 left-1/2 z-20 h-[25px] w-[90px] -translate-x-1/2 rounded-full bg-black" />

              {/* Side Buttons */}
              <div className="absolute top-[100px] -left-[16px] h-[40px] w-[4px] rounded-l-lg bg-stone-800" />
              <div className="absolute top-[150px] -left-[16px] h-[40px] w-[4px] rounded-l-lg bg-stone-800" />
              <div className="absolute top-[120px] -right-[16px] h-[60px] w-[4px] rounded-r-lg bg-stone-800" />

              <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-stone-50">
                {/* Screen Reflection */}
                <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-50" />

                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between bg-white/90 px-5 pt-12 pb-3 shadow-sm backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-amber-200 font-bold text-amber-800 shadow-inner">
                        S
                      </div>
                      <div className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-stone-900 leading-tight">
                        Sari Dewi
                      </div>
                      <div className="font-medium text-[10px] text-stone-500">
                        Online
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Area */}
                <div className="scrollbar-hide flex h-[calc(100%-8.5rem)] flex-col gap-3 overflow-y-auto bg-stone-50 p-4">
                  {messages.map((msg, i) => {
                    const messageStyles: Record<string, string> = {
                      brand:
                        "self-end rounded-br-sm bg-gradient-to-br from-amber-500 to-orange-500 text-white",
                      system:
                        "my-2 w-full max-w-[90%] self-center rounded-full border border-stone-200 bg-stone-100/80 py-1.5 text-center text-[10px] text-stone-500 shadow-none backdrop-blur-sm",
                      influencer:
                        "self-start rounded-bl-sm border border-stone-100 bg-white text-stone-800",
                    };
                    return (
                      <div
                        className={`flex w-max max-w-[85%] flex-col gap-1 rounded-2xl px-4 py-2.5 text-sm shadow-sm transition-all ${messageStyles[msg.type]} animate-fade-in`}
                        key={`msg-${msg.time}`}
                        style={{
                          animationDelay: `${i * 800}ms`,
                          opacity: 0,
                          animationFillMode: "forwards",
                        }}
                      >
                        {msg.text}
                        {msg.type !== "system" && (
                          <span
                            className={`text-[10px] ${msg.type === "brand" ? "text-amber-100/80" : "text-stone-400"} mt-1 self-end leading-none`}
                          >
                            {msg.time}
                          </span>
                        )}
                      </div>
                    );
                  })}

                  {/* Typing indicator */}
                  <div className="flex w-max animate-fade-in items-center gap-1 self-start rounded-2xl rounded-bl-sm border border-stone-100 bg-white px-3 py-3 opacity-0 shadow-sm [animation-delay:5000ms] [animation-fill-mode:forwards]">
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400 [animation-delay:-0.3s]" />
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400 [animation-delay:-0.15s]" />
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400" />
                  </div>
                </div>

                {/* Input Area */}
                <div className="absolute bottom-0 w-full border-stone-100 border-t bg-white px-4 py-3">
                  <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-stone-100 px-4 py-2.5">
                    <div className="text-sm text-stone-400">Tulis pesan...</div>
                  </div>
                  <div className="mx-auto mt-2 h-1 w-1/3 rounded-full bg-stone-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
