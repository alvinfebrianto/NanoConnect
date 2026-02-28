import { Agentation } from "agentation";
import { Route, Routes, useLocation } from "react-router-dom";
import { GuestRoute } from "./components/auth/guest-route";
import { ProtectedRoute } from "./components/auth/protected-route";
import { Footer } from "./components/layout/footer";
import { Navbar } from "./components/layout/navbar";
import { AuthProvider } from "./contexts/auth-context";
import { ThemeProvider } from "./contexts/theme-context";
import { About } from "./pages/about";
import { AIRecommendations } from "./pages/ai-recommendations";
import { Home } from "./pages/home";
import { InfluencerDetail } from "./pages/influencer-detail";
import { InfluencerListing } from "./pages/influencer-listing";
import { Login } from "./pages/login";
import { OrderBooking } from "./pages/order-booking";
import { Privacy } from "./pages/privacy";
import { Profile } from "./pages/profile";
import { Register } from "./pages/register";
import { Terms } from "./pages/terms";

function App() {
  const location = useLocation();
  const hideLayout = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      <ThemeProvider>
        <AuthProvider>
          <div className="flex min-h-screen flex-col bg-white dark:bg-stone-950">
            {!hideLayout && <Navbar />}
            <main className="flex-grow">
              <Routes>
                <Route element={<Home />} path="/" />
                <Route element={<About />} path="/about" />
                <Route element={<InfluencerListing />} path="/influencers" />
                <Route element={<InfluencerDetail />} path="/influencers/:id" />
                <Route
                  element={
                    <ProtectedRoute>
                      <OrderBooking />
                    </ProtectedRoute>
                  }
                  path="/order/:influencerId"
                />
                <Route
                  element={<AIRecommendations />}
                  path="/ai-recommendations"
                />
                <Route element={<Terms />} path="/terms" />
                <Route element={<Privacy />} path="/privacy" />
                <Route
                  element={
                    <GuestRoute>
                      <Login />
                    </GuestRoute>
                  }
                  path="/login"
                />
                <Route
                  element={
                    <GuestRoute>
                      <Register />
                    </GuestRoute>
                  }
                  path="/register"
                />
                <Route
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                  path="/profile"
                />
              </Routes>
            </main>
            {!hideLayout && <Footer />}
          </div>
        </AuthProvider>
      </ThemeProvider>
      {process.env.NODE_ENV === "development" && <Agentation />}
    </>
  );
}

export default App;
