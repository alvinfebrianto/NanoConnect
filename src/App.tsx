import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { InfluencerListing } from './pages/InfluencerListing'
import { InfluencerDetail } from './pages/InfluencerDetail'
import { OrderBooking } from './pages/OrderBooking'
import { AIRecommendations } from './pages/AIRecommendations'
import { Terms } from './pages/Terms'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { AuthProvider } from './contexts/AuthContext'
import { Agentation } from 'agentation'

function App() {
  return (
    <>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/influencers" element={<InfluencerListing />} />
              <Route path="/influencers/:id" element={<InfluencerDetail />} />
              <Route path="/order/:influencerId" element={<OrderBooking />} />
              <Route path="/ai-recommendations" element={<AIRecommendations />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
      {process.env.NODE_ENV === 'development' && <Agentation />}
    </>
  )
}

export default App
