import { Instagram, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

function BrandMark() {
  return (
    <svg
      aria-hidden="true"
      className="h-7 w-7 text-primary-400"
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

const PLATFORM_LINKS = [
  { to: "/influencers", label: "Cari Influencer" },
  { to: "/ai-recommendations", label: "Pencocokan AI" },
  { to: "/register", label: "Gabung sebagai Influencer" },
] as const;

const COMPANY_LINKS = [
  { to: "/about", label: "Tentang Kami" },
  { to: "/terms", label: "Syarat & Ketentuan" },
  { to: "/privacy", label: "Kebijakan Privasi" },
] as const;

const SOCIAL_LINKS = [
  {
    href: "https://instagram.com/nanoconnect",
    label: "Instagram NanoConnect",
    icon: Instagram,
  },
  {
    href: "https://twitter.com/nanoconnect",
    label: "Twitter NanoConnect",
    icon: Twitter,
  },
  {
    href: "https://youtube.com/nanoconnect",
    label: "Youtube NanoConnect",
    icon: Youtube,
  },
] as const;

export function Footer() {
  return (
    <footer className="border-zinc-200 border-t bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Link className="inline-flex items-center gap-2.5" to="/">
              <BrandMark />
              <span className="font-bold font-display text-lg text-zinc-900 tracking-tight dark:text-zinc-50">
                NanoConnect
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-zinc-500 leading-relaxed dark:text-zinc-400">
              Menghubungkan UMKM dengan nano influencer terbaik untuk
              mengembangkan brand Anda secara autentik dan terukur.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-400 transition-all hover:border-primary-300 hover:text-primary-600 dark:border-zinc-700 dark:hover:border-primary-600 dark:hover:text-primary-400"
                  href={social.href}
                  key={social.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h3 className="font-display font-semibold text-sm text-zinc-900 uppercase tracking-wide dark:text-zinc-100">
                Platform
              </h3>
              <ul className="mt-4 space-y-3">
                {PLATFORM_LINKS.map((link) => (
                  <li key={link.to}>
                    <Link
                      className="text-sm text-zinc-500 transition-colors hover:text-primary-600 dark:text-zinc-400 dark:hover:text-primary-400"
                      to={link.to}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-display font-semibold text-sm text-zinc-900 uppercase tracking-wide dark:text-zinc-100">
                Perusahaan
              </h3>
              <ul className="mt-4 space-y-3">
                {COMPANY_LINKS.map((link) => (
                  <li key={link.to}>
                    <Link
                      className="text-sm text-zinc-500 transition-colors hover:text-primary-600 dark:text-zinc-400 dark:hover:text-primary-400"
                      to={link.to}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-display font-semibold text-sm text-zinc-900 uppercase tracking-wide dark:text-zinc-100">
                Kontak
              </h3>
              <ul className="mt-4 space-y-3">
                <li className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span>hello@nanoconnect.com</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span>+62 812 3456 7890</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span>Jakarta, Indonesia</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-zinc-200 border-t pt-8 dark:border-zinc-800">
          <p className="text-center text-xs text-zinc-400 dark:text-zinc-500">
            2024 NanoConnect. Hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
