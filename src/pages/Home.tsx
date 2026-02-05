import { Link } from 'react-router-dom'
import { ArrowRight, Search, Zap, Shield, TrendingUp, Users, Star } from 'lucide-react'
import { InfluencerCard } from '@/components/influencer/InfluencerCard'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Influencer } from '@/types'

export function Home() {
  const [featuredInfluencers, setFeaturedInfluencers] = useState<Influencer[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchFeaturedInfluencers() {
      try {
        const { data, error } = await supabase
          .from('influencers')
          .select('*, user:users(*)')
          .eq('verification_status', 'verified')
          .eq('is_available', true)
          .order('followers_count', { ascending: false })
          .limit(6)

        if (error) throw error
        setFeaturedInfluencers(data || [])
      } catch (error) {
        console.error('Error fetching influencers:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedInfluencers()
  }, [])

  const stats = [
    { icon: Users, value: '10,000+', label: 'Active Influencers' },
    { icon: TrendingUp, value: '500+', label: 'SME Partners' },
    { icon: Star, value: '98%', label: 'Satisfaction Rate' },
    { icon: Zap, value: '24h', label: 'Avg. Response' },
  ]

  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden gradient-bg py-20 lg:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23d946ef%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 mb-8 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary-500"></span>
              <span className="text-sm font-medium text-gray-700">Now with AI-powered matching</span>
            </div>
            
            <h1 className="font-display text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Find Your Perfect
              <span className="gradient-text block">Influencer Match</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect with nano influencers who authentically represent your brand. 
              Smart matching based on budget, niche, and target audience.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/influencers" className="btn-primary text-lg px-8 py-4 flex items-center space-x-2">
                <Search className="w-5 h-5" />
                <span>Find Influencers</span>
              </Link>
              <Link to="/ai-recommendations" className="btn-secondary text-lg px-8 py-4 flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>AI Match</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 50L48 45.7C96 41 192 33 288 35.2C384 37 480 50 576 55.7C672 61 768 61 864 55.7C960 50 1056 41 1152 37.8C1248 33 1344 37 1392 37.8L1440 41V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z" fill="white"/>
          </svg>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose NanoConnect?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We make influencer marketing simple, transparent, and effective for businesses of all sizes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card group hover:border-primary-200 transition-all duration-300">
              <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-600 transition-colors">
                <Zap className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">AI-Powered Matching</h3>
              <p className="text-gray-600 leading-relaxed">
                Our intelligent algorithm analyzes your brand and matches you with influencers who truly resonate with your audience.
              </p>
            </div>

            <div className="card group hover:border-primary-200 transition-all duration-300">
              <div className="w-14 h-14 bg-accent-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent-600 transition-colors">
                <Shield className="w-7 h-7 text-accent-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Verified Creators</h3>
              <p className="text-gray-600 leading-relaxed">
                Every influencer is thoroughly vetted and verified to ensure authentic engagement and quality content delivery.
              </p>
            </div>

            <div className="card group hover:border-primary-200 transition-all duration-300">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                <TrendingUp className="w-7 h-7 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Budget-Friendly</h3>
              <p className="text-gray-600 leading-relaxed">
                Access nano influencers with highly engaged audiences at a fraction of the cost of macro influencers.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-10 h-10 text-primary-600 mx-auto mb-4" />
                <div className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Featured Influencers
              </h2>
              <p className="text-gray-600">
                Top-rated creators ready to collaborate with your brand
              </p>
            </div>
            <Link 
              to="/influencers" 
              className="mt-4 md:mt-0 flex items-center space-x-2 text-primary-600 font-medium hover:text-primary-700"
            >
              <span>View All</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredInfluencers.map((influencer) => (
                <InfluencerCard key={influencer.id} influencer={influencer} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 gradient-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Ready to Grow Your Brand?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join thousands of SMEs who have successfully partnered with nano influencers to reach their target audience.
          </p>
          <Link to="/register" className="btn-primary text-lg px-10 py-4 inline-flex items-center space-x-2">
            <span>Get Started Today</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
