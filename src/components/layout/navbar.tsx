import { LogOut, Menu, User, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { ThemeSwitcher } from "./theme-switcher";

function BrandMark() {
  return (
    <svg
      aria-hidden="true"
      className="h-8 w-8 text-primary-600 dark:text-primary-400"
      fill="none"
      viewBox="0 0 32 32"
    >
      <path
        d="M7 25V7l18 18V7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.8"
      />
      <circle cx="25" cy="7" fill="currentColor" r="2.5" />
    </svg>
  );
}

const NAV_LINKS = [
  { to: "/influencers", label: "Cari Influencer" },
  { to: "/ai-recommendations", label: "Cocokan AI" },
  { to: "/about", label: "Tentang" },
] as const;

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-zinc-200/80 border-b bg-white/80 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link className="flex items-center gap-2.5" to="/">
            <BrandMark />
            <span className="font-bold font-display text-xl text-zinc-900 tracking-tight dark:text-zinc-50">
              NanoConnect
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                className="rounded-lg px-4 py-2 font-medium text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                key={link.to}
                to={link.to}
              >
                {link.label}
              </Link>
            ))}

            <div className="mx-2 h-5 w-px bg-zinc-200 dark:bg-zinc-700" />

            <ThemeSwitcher />

            {user ? (
              <div className="ml-1 flex items-center gap-1">
                <Link
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                  to="/profile"
                >
                  <User aria-hidden="true" className="h-4 w-4" />
                  <span className="font-medium">{user.name}</span>
                </Link>
                <button
                  aria-label="Keluar"
                  className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                  onClick={handleLogout}
                  title="Keluar"
                  type="button"
                >
                  <LogOut aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="ml-1 flex items-center gap-2">
                <Link
                  className="rounded-lg px-4 py-2 font-medium text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  to="/login"
                >
                  Masuk
                </Link>
                <Link
                  className="rounded-full bg-primary-600 px-5 py-2 font-semibold text-sm text-white shadow-sm transition hover:bg-primary-500 hover:shadow-md active:scale-[0.98]"
                  to="/register"
                >
                  Mulai
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeSwitcher />
            <button
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
              className="rounded-lg p-2 text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
            >
              {isMenuOpen ? (
                <X aria-hidden="true" className="h-5 w-5" />
              ) : (
                <Menu aria-hidden="true" className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-zinc-200/80 border-t bg-white/95 backdrop-blur-xl md:hidden dark:border-zinc-800/80 dark:bg-zinc-950/95">
          <div className="space-y-1 px-4 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                className="block rounded-lg px-3 py-2.5 font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                key={link.to}
                onClick={() => setIsMenuOpen(false)}
                to={link.to}
              >
                {link.label}
              </Link>
            ))}

            <div className="my-2 h-px bg-zinc-100 dark:bg-zinc-800" />

            {user ? (
              <>
                <Link
                  className="block rounded-lg px-3 py-2.5 font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  onClick={() => setIsMenuOpen(false)}
                  to="/profile"
                >
                  Profil
                </Link>
                <button
                  className="block w-full rounded-lg px-3 py-2.5 text-left font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
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
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  className="rounded-lg border border-zinc-200 py-2.5 text-center font-medium text-sm text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  onClick={() => setIsMenuOpen(false)}
                  to="/login"
                >
                  Masuk
                </Link>
                <Link
                  className="rounded-lg bg-primary-600 py-2.5 text-center font-medium text-sm text-white transition-colors hover:bg-primary-500"
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
