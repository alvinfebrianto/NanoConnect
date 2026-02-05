import { Target, Users, Heart, Globe, Award } from 'lucide-react'

const VALUES = [
  {
    icon: Heart,
    title: 'Koneksi Autentik',
    description: 'Kami percaya pada kemitraan yang tulus antara brand dan kreator yang resonan dengan audiens nyata.'
  },
  {
    icon: Target,
    title: 'Pencocokan Presisi',
    description: 'Platform berbasis AI kami memastikan Anda terhubung dengan influencer yang benar-benar selaras dengan nilai brand Anda.'
  },
  {
    icon: Users,
    title: 'Komunitas Prioritas',
    description: 'Membangun ekosistem yang mendukung di mana UMKM dan nano influencer dapat tumbuh bersama.'
  },
  {
    icon: Award,
    title: 'Kualitas di Atas Kuantitas',
    description: 'Kami memprioritaskan audiens niche yang engaged dibandingkan metrik vanity untuk ROI yang lebih baik.'
  }
]

const TEAM = [
  {
    name: 'Sarah Chen',
    role: 'CEO & Co-Founder',
    bio: 'Direktur pemasaran dengan pengalaman 10+ tahun di bidang influencer marketing'
  },
  {
    name: 'Michael Rodriguez',
    role: 'CTO & Co-Founder',
    bio: 'Spesialis AI dan full-stack developer yang bersemangat tentang creator economy'
  },
  {
    name: 'Emily Watson',
    role: 'Head of Partnerships',
    bio: 'Ahli dalam membangun hubungan antara brand dan content creator'
  }
]

export function About() {
  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-5xl font-bold text-gray-900 mb-6">
            Tentang NanoConnect
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Kami memiliki misi untuk mendemokratisasi pemasaran influencer dengan menghubungkan 
            usaha kecil dan menengah dengan nano influencer yang autentik yang dapat 
            menceritakan kisah brand mereka kepada audiens yang sangat engaged.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-6">
            Mengapa Kami Memulai
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              NanoConnect lahir dari observasi sederhana: bisnis kecil kesulitan 
              menemukan suara autentik untuk mempromosikan produk mereka, sementara nano influencer berbakat 
              dengan komunitas yang engaged tidak bisa memonetisasi passion mereka.
            </p>
            <p>
              Platform pemasaran influencer tradisional fokus pada mega-influencer dengan jutaan 
              pengikut, meninggalkan UMKM dengan opsi terbatas dan nano creator tanpa peluang.
            </p>
            <p>
              Kami membangun NanoConnect untuk menjembatani kesenjangan ini, menciptakan platform di mana 
              koneksi autentik berkembang dan kedua belah pihak mendapat manfaat dari kemitraan yang tulus.
            </p>
          </div>
        </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-accent-200 rounded-3xl transform rotate-3"></div>
            <div className="relative bg-white p-8 rounded-3xl shadow-xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-primary-50 rounded-2xl">
                  <div className="font-display text-4xl font-bold text-primary-600 mb-1">10K+</div>
                  <div className="text-sm text-gray-600">Influencer Aktif</div>
                </div>
                <div className="text-center p-4 bg-accent-50 rounded-2xl">
                  <div className="font-display text-4xl font-bold text-accent-600 mb-1">500+</div>
                  <div className="text-sm text-gray-600">Mitra Brand</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-2xl">
                  <div className="font-display text-4xl font-bold text-green-600 mb-1">50+</div>
                  <div className="text-sm text-gray-600">Negara</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-2xl">
                  <div className="font-display text-4xl font-bold text-purple-600 mb-1">98%</div>
                  <div className="text-sm text-gray-600">Tingkat Kepuasan</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
              Nilai-Nilai Kami
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Prinsip-prinsip inti ini memandu segala sesuatu yang kami lakukan di NanoConnect
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((value, index) => (
              <div key={index} className="card text-center">
                <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
              Kenali Tim Kami
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Individu yang bersemangat dan berdedikasi untuk mengubah pemasaran influencer
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEAM.map((member, index) => (
              <div key={index} className="card text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl font-display font-bold text-white">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-3xl p-12 text-center text-white">
          <Globe className="w-16 h-16 text-primary-400 mx-auto mb-6" />
          <h2 className="font-display text-3xl font-bold mb-4">
            Bergabunglah dalam Revolusi
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Baik Anda bisnis kecil yang ingin berkembang atau nano influencer yang siap 
            memonetisasi passion Anda, NanoConnect siap membantu Anda sukses.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a href="/register" className="bg-white text-gray-900 px-8 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors">
              Mulai Sekarang
            </a>
            <a href="/influencers" className="border-2 border-white text-white px-8 py-3 rounded-xl font-medium hover:bg-white/10 transition-colors">
              Jelajahi Influencer
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
