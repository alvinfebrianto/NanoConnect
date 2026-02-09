import { Agentation } from "agentation";
import { Route, Routes } from "react-router-dom";
import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";
import { AuthProvider } from "./contexts/AuthContext";
import { About } from "./pages/About";
import { AIRecommendations } from "./pages/AIRecommendations";
import { Home } from "./pages/Home";
import { InfluencerDetail } from "./pages/InfluencerDetail";
import { InfluencerListing } from "./pages/InfluencerListing";
import { Login } from "./pages/Login";
import { OrderBooking } from "./pages/OrderBooking";
import { Register } from "./pages/Register";
import { Terms } from "./pages/Terms";

function App() {
  return (
    <>
      <AuthProvider>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route element={<Home />} path="/" />
              <Route element={<About />} path="/about" />
              <Route element={<InfluencerListing />} path="/influencers" />
              <Route element={<InfluencerDetail />} path="/influencers/:id" />
              <Route element={<OrderBooking />} path="/order/:influencerId" />
              <Route
                element={<AIRecommendations />}
                path="/ai-recommendations"
              />
              <Route element={<Terms />} path="/terms" />
              <Route element={<Login />} path="/login" />
              <Route element={<Register />} path="/register" />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
      {process.env.NODE_ENV === "development" && <Agentation />}
    </>
  );
}

export default App;
