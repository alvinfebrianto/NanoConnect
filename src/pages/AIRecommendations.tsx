import { useState } from 'react'
import { Sparkles, Target, DollarSign, Users, MapPin, ArrowRight, RefreshCw } from 'lucide-react'
import { InfluencerCard } from '@/components/influencer/InfluencerCard'
import type { Influencer } from '@/types'

const NICHES = [
  'Fashion & Lifestyle',
  'Technology',
  'Beauty & Skincare',
  'Food & Dining',
  'Travel & Adventure',
  'Fitness & Health',
  'Gaming',
  'Business & Finance'
]

const BUDGET_RANGES = [
  { label: '$100 - $500', min: 100, max: 500 },
  { label: '$500 - $1,000', min: 500, max: 1000 },
  { label: '$1,000 - $2,500', min: 1000, max: 2500 },
  { label: '$2,500 - $5,000', min: 2500, max: 5000 },
  { label: '$5,000+', min: 5000, max: 50000 }
]

const LOCATIONS = [
  'New York, USA',
  'Los Angeles, USA',
  'San Francisco, USA',
  'Chicago, USA',
  'Miami, USA',
  'London, UK',
  'Paris, France',
  'Tokyo, Japan'
]

export function AIRecommendations() {
  const [step, setStep] = useState<'input' | 'processing' | 'results'>('input')
  const [preferences, setPreferences] = useState({
    niche: '',
    budget: '',
    location: '',
    goals: ''
  })
  const [matches, setMatches] = useState<Influencer[]>([])

  const handleFindMatches = () => {
    setStep('processing')
    
    setTimeout(() => {
      const mockInfluencers: Influencer[] = [
        {
          id: 'mock-1',
          user_id: 'user-1',
          followers_count: 85000,
          engagement_rate: 5.2,
          niche: preferences.niche || 'Fashion & Lifestyle',
          price_per_post: 450,
          location: preferences.location || 'New York, USA',
          languages: ['English'],
          content_categories: ['Fashion', 'Beauty', 'Lifestyle'],
          is_available: true,
          avg_delivery_days: 5,
          verification_status: 'verified',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user: {
            id: 'user-1',
            name: 'Emma Style',
            email: 'emma@example.com',
            user_type: 'influencer',
            email_verified: true,
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        },
        {
          id: 'mock-2',
          user_id: 'user-2',
          followers_count: 120000,
          engagement_rate: 4.8,
          niche: preferences.niche || 'Technology',
          price_per_post: 650,
          location: preferences.location || 'San Francisco, USA',
          languages: ['English'],
          content_categories: ['Tech', 'Reviews', 'Gadgets'],
          is_available: true,
          avg_delivery_days: 3,
          verification_status: 'verified',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user: {
            id: 'user-2',
            name: 'TechReviewer Pro',
            email: 'tech@example.com',
            user_type: 'influencer',
            email_verified: true,
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        },
        {
          id: 'mock-3',
          user_id: 'user-3',
          followers_count: 65000,
          engagement_rate: 6.5,
          niche: preferences.niche || 'Beauty & Skincare',
          price_per_post: 350,
          location: preferences.location || 'Los Angeles, USA',
          languages: ['English', 'Spanish'],
          content_categories: ['Beauty', 'Skincare', 'Makeup'],
          is_available: true,
          avg_delivery_days: 4,
          verification_status: 'verified',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user: {
            id: 'user-3',
            name: 'BeautyGlow',
            email: 'beauty@example.com',
            user_type: 'influencer',
            email_verified: true,
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        }
      ]
      
      setMatches(mockInfluencers)
      setStep('results')
    }, 2000)
  }

  const handleReset = () => {
    setPreferences({ niche: '', budget: '', location: '', goals: '' })
    setMatches([])
    setStep('input')
  }

  if (step === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 bg-primary-200 rounded-full animate-ping"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-white animate-pulse" />
            </div>
          </div>
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
            AI is Finding Your Matches
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Analyzing thousands of influencers based on your preferences...
          </p>
          <div className="mt-8 flex justify-center space-x-2">
            <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'results') {
    return (
      <div className="animate-fade-in">
        <div className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">
                  Your AI Matches
                </h1>
                <p className="text-gray-600">
                  Based on your preferences, we found {matches.length} perfect influencers for your campaign
                </p>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
              >
                <RefreshCw className="w-5 h-5" />
                <span>New Search</span>
              </button>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-8">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-primary-600" />
                  <span className="text-gray-600">Niche:</span>
                  <span className="font-medium">{preferences.niche || 'Any'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-primary-600" />
                  <span className="text-gray-600">Budget:</span>
                  <span className="font-medium">{preferences.budget || 'Flexible'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-primary-600" />
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{preferences.location || 'Any'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((influencer, index) => (
              <div key={influencer.id} className="relative">
                {index === 0 && (
                  <div className="absolute -top-3 left-4 z-10">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      Best Match
                    </span>
                  </div>
                )}
                <InfluencerCard influencer={influencer} />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">
            AI Influencer Matching
          </h1>
          <p className="text-xl text-gray-600">
            Tell us about your campaign, and our AI will find the perfect influencers for your brand.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Target className="w-4 h-4 inline mr-2" />
                Industry/Niche *
              </label>
              <select
                value={preferences.niche}
                onChange={(e) => setPreferences({ ...preferences, niche: e.target.value })}
                className="input-field w-full"
              >
                <option value="">Select your industry</option>
                {NICHES.map(niche => (
                  <option key={niche} value={niche}>{niche}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Budget Range *
              </label>
              <select
                value={preferences.budget}
                onChange={(e) => setPreferences({ ...preferences, budget: e.target.value })}
                className="input-field w-full"
              >
                <option value="">Select your budget</option>
                {BUDGET_RANGES.map(range => (
                  <option key={range.label} value={range.label}>{range.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Target Location
              </label>
              <select
                value={preferences.location}
                onChange={(e) => setPreferences({ ...preferences, location: e.target.value })}
                className="input-field w-full"
              >
                <option value="">Any location</option>
                {LOCATIONS.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Goals
              </label>
              <textarea
                rows={4}
                value={preferences.goals}
                onChange={(e) => setPreferences({ ...preferences, goals: e.target.value })}
                className="input-field resize-none"
                placeholder="Describe your campaign goals, target audience, and what you hope to achieve..."
              />
            </div>

            <button
              onClick={handleFindMatches}
              disabled={!preferences.niche || !preferences.budget}
              className="w-full btn-primary py-4 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5" />
              <span>Find My Matches</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Smart Matching</h3>
            <p className="text-sm text-gray-600">AI analyzes niche, audience, and engagement</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <DollarSign className="w-6 h-6 text-accent-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Budget Optimized</h3>
            <p className="text-sm text-gray-600">Find influencers within your price range</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Quality Results</h3>
            <p className="text-sm text-gray-600">Only verified, high-engagement creators</p>
          </div>
        </div>
      </div>
    </div>
  )
}
