import { useState, useEffect } from 'react'
import { Search, Filter, Users, X } from 'lucide-react'
import { InfluencerCard } from '@/components/influencer/InfluencerCard'
import { supabase } from '@/lib/supabase'
import type { Influencer, FilterOptions } from '@/types'

const NICHES = [
  'Semua Niche',
  'Fashion & Gaya Hidup',
  'Teknologi',
  'Kecantikan & Perawatan Kulit',
  'Kuliner & Makanan',
  'Travel & Petualangan',
  'Fitness & Kesehatan',
  'Gaming',
  'Bisnis & Keuangan',
  'Edukasi',
  'Hiburan',
  'Fotografi'
]

const LOCATIONS = [
  'Semua Lokasi',
  'Jakarta',
  'Surabaya',
  'Bandung',
  'Medan',
  'Semarang',
  'Makassar',
  'Palembang',
  'Yogyakarta',
  'Bali',
  'Malang'
]

export function InfluencerListing() {
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [filteredInfluencers, setFilteredInfluencers] = useState<Influencer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    niche: 'Semua Niche',
    location: 'Semua Lokasi',
    minPrice: 0,
    maxPrice: 150000000,
    verificationStatus: 'all'
  })

  useEffect(() => {
    async function fetchInfluencers() {
      try {
        const { data, error } = await supabase
          .from('influencers')
          .select('*, user:users(*)')
          .eq('is_available', true)
          .order('followers_count', { ascending: false })

        if (error) throw error
        setInfluencers(data || [])
        setFilteredInfluencers(data || [])
      } catch (error) {
        console.error('Error fetching influencers:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInfluencers()
  }, [])

  useEffect(() => {
    let result = [...influencers]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        inf =>
          inf.user?.name?.toLowerCase().includes(query) ||
          inf.niche?.toLowerCase().includes(query) ||
          inf.location?.toLowerCase().includes(query) ||
          inf.content_categories?.some(cat => cat.toLowerCase().includes(query))
      )
    }

    if (filters.niche && filters.niche !== 'Semua Niche') {
      result = result.filter(inf => inf.niche === filters.niche)
    }

    if (filters.location && filters.location !== 'Semua Lokasi') {
      result = result.filter(inf => inf.location?.includes(filters.location || ''))
    }

    if (filters.minPrice !== undefined && filters.minPrice > 0) {
      result = result.filter(inf => inf.price_per_post >= (filters.minPrice || 0))
    }

    if (filters.maxPrice !== undefined && filters.maxPrice < 150000000) {
      result = result.filter(inf => inf.price_per_post <= (filters.maxPrice || 150000000))
    }

    if (filters.verificationStatus && filters.verificationStatus !== 'all') {
      result = result.filter(inf => inf.verification_status === filters.verificationStatus)
    }

    setFilteredInfluencers(result)
  }, [searchQuery, filters, influencers])

  const clearFilters = () => {
    setFilters({
      niche: 'Semua Niche',
      location: 'Semua Lokasi',
      minPrice: 0,
      maxPrice: 150000000,
      verificationStatus: 'all'
    })
    setSearchQuery('')
  }

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">
            Temukan Influencer yang Sempurna
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Jelajahi daftar nano influencer pilihan kami dan temukan kecocokan sempurna untuk brand Anda.
          </p>
        </div>
      </div>

      <div className="sticky top-16 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama, niche, atau lokasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-12 w-full"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                showFilters
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-5 h-5" />
              <span>Filter</span>
              {(filters.niche !== 'Semua Niche' || filters.location !== 'Semua Lokasi') && (
                <span className="bg-white text-primary-600 px-2 py-0.5 rounded-full text-xs font-bold">
                  !
                </span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4 animate-slide-up">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Niche</label>
                <select
                  value={filters.niche}
                  onChange={(e) => setFilters({ ...filters, niche: e.target.value })}
                  className="input-field w-full"
                >
                  {NICHES.map(niche => (
                    <option key={niche} value={niche}>{niche}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi</label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="input-field w-full"
                >
                  {LOCATIONS.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Harga Maks: Rp {filters.maxPrice?.toLocaleString('id-ID')}</label>
                <input
                  type="range"
                  min="0"
                  max="150000000"
                  step="1000000"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Verifikasi</label>
                <select
                  value={filters.verificationStatus}
                  onChange={(e) => setFilters({ ...filters, verificationStatus: e.target.value as FilterOptions['verificationStatus'] })}
                  className="input-field w-full"
                >
                  <option value="all">Semua</option>
                  <option value="verified">Terverifikasi Saja</option>
                  <option value="pending">Tertunda</option>
                </select>
              </div>

              <div className="md:col-span-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 text-sm"
                >
                  <X className="w-4 h-4" />
                  <span>Hapus semua filter</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Menampilkan <span className="font-semibold text-gray-900">{filteredInfluencers.length}</span> influencer
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredInfluencers.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">
              Tidak ada influencer ditemukan
            </h3>
            <p className="text-gray-600 mb-4">
              Coba sesuaikan filter atau kriteria pencarian Anda
            </p>
            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              Hapus Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInfluencers.map((influencer) => (
              <InfluencerCard key={influencer.id} influencer={influencer} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
