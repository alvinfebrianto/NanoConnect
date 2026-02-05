import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Sparkles, Menu, X, User, LogOut } from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-display text-xl font-bold gradient-text">
              NanoConnect
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/influencers" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              Find Influencers
            </Link>
            <Link to="/ai-recommendations" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              AI Match
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              About
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2 text-gray-600 hover:text-primary-600">
                  <User className="w-5 h-5" />
                  <span className="font-medium">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="btn-secondary">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-3 space-y-3">
            <Link 
              to="/influencers" 
              className="block py-2 text-gray-600 hover:text-primary-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Find Influencers
            </Link>
            <Link 
              to="/ai-recommendations" 
              className="block py-2 text-gray-600 hover:text-primary-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              AI Match
            </Link>
            <Link 
              to="/about" 
              className="block py-2 text-gray-600 hover:text-primary-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className="block py-2 text-gray-600 hover:text-primary-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                  className="block w-full text-left py-2 text-red-600 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="pt-3 space-y-2">
                <Link 
                  to="/login" 
                  className="block w-full text-center py-2.5 border-2 border-gray-200 rounded-xl font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="block w-full text-center py-2.5 bg-primary-600 text-white rounded-xl font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
