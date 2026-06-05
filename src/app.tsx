import { lazy, Suspense } from "react";
import { Agentation } from "agentation";
import { Route, Routes, useLocation } from "react-router-dom";
import { GuestRoute } from "./components/auth/guest-route";
import { ProtectedRoute } from "./components/auth/protected-route";
import { Footer } from "./components/layout/footer";
import { Navbar } from "./components/layout/navbar";
import { AuthProvider } from "./contexts/auth-context";
import { ThemeProvider } from "./contexts/theme-context";
import { Home } from "./pages/home";

const About = lazy(() => import("./pages/about").then((m) => ({ default: m.About })));
const AIRecommendations = lazy(() => import("./pages/ai-recommendations").then((m) => ({ default: m.AIRecommendations })));
const InfluencerDetail = lazy(() => import("./pages/influencer-detail").then((m) => ({ default: m.InfluencerDetail })));
const InfluencerListing = lazy(() => import("./pages/influencer-listing").then((m) => ({ default: m.InfluencerListing })));
const Login = lazy(() => import("./pages/login").then((m) => ({ default: m.Login })));
const OrderBooking = lazy(() => import("./pages/order-booking").then((m) => ({ default: m.OrderBooking })));
const Privacy = lazy(() => import("./pages/privacy").then((m) => ({ default: m.Privacy })));
const Profile = lazy(() => import("./pages/profile").then((m) => ({ default: m.Profile })));
const Register = lazy(() => import("./pages/register").then((m) => ({ default: m.Register })));
const Terms = lazy(() => import("./pages/terms").then((m) => ({ default: m.Terms })));

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
              <Suspense fallback={null}>
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
              </Suspense>
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
