import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { MapPin, Users, Star, Instagram, CheckCircle, ArrowLeft, Calendar, Globe, MessageCircle, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Influencer, Review } from '@/types'

export function InfluencerDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [influencer, setInfluencer] = useState<Influencer | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews'>('overview')

  useEffect(() => {
    async function fetchInfluencerData() {
      if (!id) return

      try {
        const { data: influencerData, error: influencerError } = await supabase
          .from('influencers')
          .select('*, user:users(*)')
          .eq('id', id)
          .single()

        if (influencerError) throw influencerError
        setInfluencer(influencerData)

        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('*, order:orders(*)')
          .eq('order.influencer_id', id)
          .order('created_at', { ascending: false })

        if (reviewsError) throw reviewsError
        setReviews(reviewsData || [])
      } catch (error) {
        console.error('Error fetching influencer data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInfluencerData()
  }, [id])

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (!influencer) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">
          Influencer not found
        </h2>
        <Link to="/influencers" className="btn-primary">
          Browse Influencers
        </Link>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/influencers" 
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Influencers</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card mb-6">
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={influencer.user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${influencer.id}`}
                  alt={influencer.user?.name}
                  className="w-32 h-32 rounded-2xl object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="font-display text-3xl font-bold text-gray-900 mb-2 flex items-center">
                        {influencer.user?.name}
                        {influencer.verification_status === 'verified' && (
                          <CheckCircle className="w-6 h-6 text-blue-500 ml-2" />
                        )}
                      </h1>
                      <p className="text-lg text-primary-600 font-medium mb-3">{influencer.niche}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{influencer.user?.bio}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{influencer.location}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Globe className="w-4 h-4" />
                      <span>{influencer.languages?.join(', ')}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{influencer.avg_delivery_days} days delivery</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="card text-center">
                <Users className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <div className="font-display text-2xl font-bold text-gray-900">
                  {formatNumber(influencer.followers_count)}
                </div>
                <div className="text-sm text-gray-500">Followers</div>
              </div>
              <div className="card text-center">
                <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <div className="font-display text-2xl font-bold text-gray-900">
                  {influencer.engagement_rate}%
                </div>
                <div className="text-sm text-gray-500">Engagement</div>
              </div>
              <div className="card text-center">
                <MessageCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <div className="font-display text-2xl font-bold text-gray-900">
                  {reviews.length}
                </div>
                <div className="text-sm text-gray-500">Reviews</div>
              </div>
            </div>

            <div className="card">
              <div className="flex space-x-6 border-b border-gray-100 mb-6">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-4 font-medium transition-colors ${
                    activeTab === 'overview'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-4 font-medium transition-colors ${
                    activeTab === 'reviews'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Reviews ({reviews.length})
                </button>
              </div>

              {activeTab === 'overview' ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-lg font-semibold mb-3">About</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {influencer.user?.bio || 'No bio available.'}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-semibold mb-3">Content Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {influencer.content_categories?.map((category, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-semibold mb-3">Social Media</h3>
                    <div className="flex space-x-4">
                      {influencer.instagram_handle && (
                        <a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors">
                          <Instagram className="w-5 h-5" />
                          <span>{influencer.instagram_handle}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No reviews yet</p>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                        {review.is_verified && (
                          <span className="inline-flex items-center text-xs text-green-600 mt-2">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified Purchase
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h3 className="font-display text-lg font-semibold mb-4">Book Collaboration</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Price per post</span>
                  <span className="font-display text-2xl font-bold text-gray-900">
                    ${influencer.price_per_post}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Platform fee</span>
                  <span className="text-gray-900">${(influencer.price_per_post * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="font-medium text-gray-900">Total</span>
                  <span className="font-display text-xl font-bold text-primary-600">
                    ${(influencer.price_per_post * 1.1).toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate(`/order/${influencer.id}`)}
                className="w-full btn-primary py-3"
              >
                Book Now
              </button>
              <p className="text-xs text-gray-500 text-center mt-4">
                You won't be charged yet. The influencer will review your request first.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
