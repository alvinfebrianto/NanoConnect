import { Link } from 'react-router-dom'
import { MapPin, Users, Star, CheckCircle } from 'lucide-react'
import type { Influencer } from '@/types'

interface InfluencerCardProps {
  influencer: Influencer
}

export function InfluencerCard({ influencer }: InfluencerCardProps) {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  return (
    <div className="card group cursor-pointer hover:border-primary-200 transition-all duration-300">
      <div className="relative mb-4">
        <img
          src={influencer.user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${influencer.id}`}
          alt={influencer.user?.name}
          className="w-full h-48 object-cover rounded-xl"
        />
        {influencer.verification_status === 'verified' && (
          <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow-md">
            <CheckCircle className="w-5 h-5 text-blue-500" />
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
            {influencer.user?.name}
          </h3>
          <p className="text-sm text-gray-500">{influencer.niche}</p>
        </div>

        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1 text-gray-600">
            <Users className="w-4 h-4" />
            <span>{formatNumber(influencer.followers_count)}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>{influencer.engagement_rate}%</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="truncate max-w-[80px]">{influencer.location?.split(',')[0]}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {influencer.content_categories?.slice(0, 3).map((category, idx) => (
            <span 
              key={idx}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg"
            >
              {category}
            </span>
          ))}
        </div>

        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500">Mulai dari</span>
            <p className="font-semibold text-gray-900">Rp {(influencer.price_per_post * 15000).toLocaleString('id-ID')}</p>
          </div>
          <Link 
            to={`/influencers/${influencer.id}`}
            className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors"
          >
            Lihat Profil
          </Link>
        </div>
      </div>
    </div>
  )
}
