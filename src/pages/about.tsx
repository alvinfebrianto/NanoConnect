import { Award, Globe, Heart, Target, Users } from "lucide-react";

const VALUES = [
  {
    id: "autentik",
    icon: Heart,
    title: "Koneksi Autentik",
    description:
      "Kami percaya pada kemitraan yang tulus antara brand dan kreator yang resonan dengan audiens nyata.",
  },
  {
    id: "presisi",
    icon: Target,
    title: "Pencocokan Presisi",
    description:
      "Platform berbasis AI kami memastikan Anda terhubung dengan influencer yang benar-benar selaras dengan nilai brand Anda.",
  },
  {
    id: "komunitas",
    icon: Users,
    title: "Komunitas Prioritas",
    description:
      "Membangun ekosistem yang mendukung di mana UMKM dan nano influencer dapat tumbuh bersama.",
  },
  {
    id: "kualitas",
    icon: Award,
    title: "Kualitas di Atas Kuantitas",
    description:
      "Kami memprioritaskan audiens niche yang engaged dibandingkan metrik vanity untuk ROI yang lebih baik.",
  },
];

const TEAM = [
  {
    id: "sarah",
    name: "Sarah Chen",
    role: "CEO & Co-Founder",
    bio: "Direktur pemasaran dengan pengalaman 10+ tahun di bidang influencer marketing",
  },
  {
    id: "michael",
    name: "Michael Rodriguez",
    role: "CTO & Co-Founder",
    bio: "Spesialis AI dan full-stack developer yang bersemangat tentang creator economy",
  },
  {
    id: "emily",
    name: "Emily Watson",
    role: "Head of Partnerships",
    bio: "Ahli dalam membangun hubungan antara brand dan content creator",
  },
];

export function About() {
  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 font-bold font-display text-5xl text-zinc-900 dark:text-zinc-50">
            Tentang NanoConnect
          </h1>
          <p className="text-xl text-zinc-600 leading-relaxed dark:text-zinc-400">
            Kami memiliki misi untuk mendemokratisasi pemasaran influencer
            dengan menghubungkan usaha kecil dan menengah dengan nano influencer
            yang autentik yang dapat menceritakan kisah brand mereka kepada
            audiens yang sangat engaged.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-20 grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-6 font-bold font-display text-3xl text-zinc-900 dark:text-zinc-50">
              Mengapa Kami Memulai
            </h2>
            <div className="space-y-4 text-zinc-600 leading-relaxed dark:text-zinc-400">
              <p>
                NanoConnect lahir dari observasi sederhana: bisnis kecil
                kesulitan menemukan suara autentik untuk mempromosikan produk
                mereka, sementara nano influencer berbakat dengan komunitas yang
                engaged tidak bisa memonetisasi passion mereka.
              </p>
              <p>
                Platform pemasaran influencer tradisional fokus pada
                mega-influencer dengan jutaan pengikut, meninggalkan UMKM dengan
                opsi terbatas dan nano creator tanpa peluang.
              </p>
              <p>
                Kami membangun NanoConnect untuk menjembatani kesenjangan ini,
                menciptakan platform di mana koneksi autentik berkembang dan
                kedua belah pihak mendapat manfaat dari kemitraan yang tulus.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 rotate-3 transform rounded-3xl bg-gradient-to-br from-primary-200 to-accent-200" />
            <div className="relative rounded-3xl bg-white p-8 shadow-xl dark:bg-zinc-800">
              <div className="grid grid-cols-2 gap-6">
                <div className="rounded-2xl bg-primary-50 p-4 text-center dark:bg-primary-900/30">
                  <div className="mb-1 font-bold font-display text-4xl text-primary-600 dark:text-primary-400">
                    10K+
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    Influencer Aktif
                  </div>
                </div>
                <div className="rounded-2xl bg-accent-50 p-4 text-center dark:bg-accent-900/30">
                  <div className="mb-1 font-bold font-display text-4xl text-accent-600 dark:text-accent-400">
                    500+
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    Mitra Brand
                  </div>
                </div>
                <div className="rounded-2xl bg-green-50 p-4 text-center dark:bg-green-900/30">
                  <div className="mb-1 font-bold font-display text-4xl text-green-600 dark:text-green-400">
                    50+
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    Negara
                  </div>
                </div>
                <div className="rounded-2xl bg-purple-50 p-4 text-center dark:bg-purple-900/30">
                  <div className="mb-1 font-bold font-display text-4xl text-purple-600 dark:text-purple-400">
                    98%
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    Tingkat Kepuasan
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-bold font-display text-3xl text-zinc-900 dark:text-zinc-50">
              Nilai-Nilai Kami
            </h2>
            <p className="mx-auto max-w-2xl text-zinc-600 dark:text-zinc-400">
              Prinsip-prinsip inti ini memandu segala sesuatu yang kami lakukan
              di NanoConnect
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value) => (
              <div className="card text-center" key={value.id}>
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-900/30">
                  <value.icon className="h-7 w-7 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="mb-2 font-display font-semibold text-lg">
                  {value.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-bold font-display text-3xl text-zinc-900 dark:text-zinc-50">
              Kenali Tim Kami
            </h2>
            <p className="mx-auto max-w-2xl text-zinc-600 dark:text-zinc-400">
              Individu yang bersemangat dan berdedikasi untuk mengubah pemasaran
              influencer
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {TEAM.map((member) => (
              <div className="card text-center" key={member.id}>
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-accent-400">
                  <span className="font-bold font-display text-3xl text-white">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-lg">
                  {member.name}
                </h3>
                <p className="mb-2 font-medium text-primary-600 dark:text-primary-400">
                  {member.role}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-zinc-900 p-12 text-center text-white">
          <Globe className="mx-auto mb-6 h-16 w-16 text-primary-400" />
          <h2 className="mb-4 font-bold font-display text-3xl">
            Bergabunglah dalam Revolusi
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-zinc-300">
            Baik Anda bisnis kecil yang ingin berkembang atau nano influencer
            yang siap memonetisasi passion Anda, NanoConnect siap membantu Anda
            sukses.
          </p>
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <a
              className="rounded-xl bg-white px-8 py-3 font-medium text-zinc-900 transition-colors hover:bg-zinc-100"
              href="/register"
            >
              Mulai Sekarang
            </a>
            <a
              className="rounded-xl border-2 border-white px-8 py-3 font-medium text-white transition-colors hover:bg-white/10"
              href="/influencers"
            >
              Jelajahi Influencer
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
