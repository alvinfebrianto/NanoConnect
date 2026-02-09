import { LogOut, Menu, Sparkles, User, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-gray-100 border-b bg-white/80 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link className="flex items-center space-x-2" to="/">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="gradient-text font-bold font-display text-xl">
              NanoConnect
            </span>
          </Link>

          <div className="hidden items-center space-x-8 md:flex">
            <Link
              className="font-medium text-gray-600 transition-colors hover:text-primary-600"
              to="/influencers"
            >
              Cari Influencer
            </Link>
            <Link
              className="font-medium text-gray-600 transition-colors hover:text-primary-600"
              to="/ai-recommendations"
            >
              Cocokan AI
            </Link>
            <Link
              className="font-medium text-gray-600 transition-colors hover:text-primary-600"
              to="/about"
            >
              Tentang
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  className="flex items-center space-x-2 text-gray-600 hover:text-primary-600"
                  to="/profile"
                >
                  <User className="h-5 w-5" />
                  <span className="font-medium">{user.name}</span>
                </Link>
                <button
                  className="p-2 text-gray-600 transition-colors hover:text-red-600"
                  onClick={handleLogout}
                  title="Keluar"
                  type="button"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link className="btn-secondary" to="/login">
                  Masuk
                </Link>
                <Link className="btn-primary" to="/register">
                  Mulai
                </Link>
              </div>
            )}
          </div>

          <button
            className="p-2 text-gray-600 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            type="button"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-gray-100 border-t bg-white md:hidden">
          <div className="space-y-3 px-4 py-3">
            <Link
              className="block py-2 font-medium text-gray-600 hover:text-primary-600"
              onClick={() => setIsMenuOpen(false)}
              to="/influencers"
            >
              Cari Influencer
            </Link>
            <Link
              className="block py-2 font-medium text-gray-600 hover:text-primary-600"
              onClick={() => setIsMenuOpen(false)}
              to="/ai-recommendations"
            >
              Cocokan AI
            </Link>
            <Link
              className="block py-2 font-medium text-gray-600 hover:text-primary-600"
              onClick={() => setIsMenuOpen(false)}
              to="/about"
            >
              Tentang
            </Link>
            {user ? (
              <>
                <Link
                  className="block py-2 font-medium text-gray-600 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                  to="/profile"
                >
                  Profil
                </Link>
                <button
                  className="block w-full py-2 text-left font-medium text-red-600"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  type="button"
                >
                  Keluar
                </button>
              </>
            ) : (
              <div className="space-y-2 pt-3">
                <Link
                  className="block w-full rounded-xl border-2 border-gray-200 py-2.5 text-center font-medium"
                  onClick={() => setIsMenuOpen(false)}
                  to="/login"
                >
                  Masuk
                </Link>
                <Link
                  className="block w-full rounded-xl bg-primary-600 py-2.5 text-center font-medium text-white"
                  onClick={() => setIsMenuOpen(false)}
                  to="/register"
                >
                  Mulai
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
