import { Target, Users, Heart, Globe, Award } from 'lucide-react'

const VALUES = [
  {
    icon: Heart,
    title: 'Authentic Connections',
    description: 'We believe in genuine partnerships between brands and creators that resonate with real audiences.'
  },
  {
    icon: Target,
    title: 'Precision Matching',
    description: 'Our AI-powered platform ensures you connect with influencers who truly align with your brand values.'
  },
  {
    icon: Users,
    title: 'Community First',
    description: 'Building a supportive ecosystem where SMEs and nano influencers can grow together.'
  },
  {
    icon: Award,
    title: 'Quality Over Quantity',
    description: 'We prioritize engaged, niche audiences over vanity metrics for better ROI.'
  }
]

const TEAM = [
  {
    name: 'Sarah Chen',
    role: 'CEO & Co-Founder',
    bio: 'Former marketing director with 10+ years in influencer marketing'
  },
  {
    name: 'Michael Rodriguez',
    role: 'CTO & Co-Founder',
    bio: 'AI specialist and full-stack developer passionate about creator economy'
  },
  {
    name: 'Emily Watson',
    role: 'Head of Partnerships',
    bio: 'Expert in building relationships between brands and content creators'
  }
]

export function About() {
  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-5xl font-bold text-gray-900 mb-6">
            About NanoConnect
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            We're on a mission to democratize influencer marketing by connecting 
            small and medium enterprises with authentic nano influencers who can 
            tell their brand story to highly engaged audiences.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-6">
              Why We Started
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                NanoConnect was born from a simple observation: small businesses were struggling 
                to find authentic voices to promote their products, while talented nano influencers 
                with engaged communities couldn't monetize their passion.
              </p>
              <p>
                Traditional influencer marketing platforms focused on mega-influencers with millions 
                of followers, leaving SMEs with limited options and nano creators without opportunities.
              </p>
              <p>
                We built NanoConnect to bridge this gap, creating a platform where authentic 
                connections flourish and both parties benefit from genuine partnerships.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-accent-200 rounded-3xl transform rotate-3"></div>
            <div className="relative bg-white p-8 rounded-3xl shadow-xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-primary-50 rounded-2xl">
                  <div className="font-display text-4xl font-bold text-primary-600 mb-1">10K+</div>
                  <div className="text-sm text-gray-600">Active Influencers</div>
                </div>
                <div className="text-center p-4 bg-accent-50 rounded-2xl">
                  <div className="font-display text-4xl font-bold text-accent-600 mb-1">500+</div>
                  <div className="text-sm text-gray-600">Brand Partners</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-2xl">
                  <div className="font-display text-4xl font-bold text-green-600 mb-1">50+</div>
                  <div className="text-sm text-gray-600">Countries</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-2xl">
                  <div className="font-display text-4xl font-bold text-purple-600 mb-1">98%</div>
                  <div className="text-sm text-gray-600">Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do at NanoConnect
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
              Meet Our Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Passionate individuals dedicated to transforming influencer marketing
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
            Join the Revolution
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Whether you're a small business looking to grow or a nano influencer ready 
            to monetize your passion, NanoConnect is here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a href="/register" className="bg-white text-gray-900 px-8 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors">
              Get Started
            </a>
            <a href="/influencers" className="border-2 border-white text-white px-8 py-3 rounded-xl font-medium hover:bg-white/10 transition-colors">
              Browse Influencers
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
