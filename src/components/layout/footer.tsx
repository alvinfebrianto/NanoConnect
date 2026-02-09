import {
  Instagram,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Twitter,
  Youtube,
} from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-1">
            <Link className="mb-4 flex items-center space-x-2" to="/">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold font-display text-white text-xl">
                NanoConnect
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Menghubungkan UMKM dengan nano influencer terbaik untuk
              mengembangkan brand Anda secara autentik.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-display font-semibold text-lg">
              Platform
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  className="text-gray-400 text-sm transition-colors hover:text-white"
                  to="/influencers"
                >
                  Cari Influencer
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 text-sm transition-colors hover:text-white"
                  to="/ai-recommendations"
                >
                  Pencocokan AI
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 text-sm transition-colors hover:text-white"
                  to="/register"
                >
                  Gabung sebagai Influencer
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display font-semibold text-lg">
              Perusahaan
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  className="text-gray-400 text-sm transition-colors hover:text-white"
                  to="/about"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 text-sm transition-colors hover:text-white"
                  to="/terms"
                >
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 text-sm transition-colors hover:text-white"
                  to="/privacy"
                >
                  Kebijakan Privasi
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display font-semibold text-lg">Kontak</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <Mail className="h-4 w-4" />
                <span>hello@nanoconnect.com</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <Phone className="h-4 w-4" />
                <span>+62 812 3456 7890</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <MapPin className="h-4 w-4" />
                <span>Jakarta, Indonesia</span>
              </li>
            </ul>
            <div className="mt-4 flex items-center space-x-4">
              <a
                aria-label="Instagram NanoConnect"
                className="text-gray-400 transition-colors hover:text-white"
                href="https://instagram.com/nanoconnect"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                aria-label="Twitter NanoConnect"
                className="text-gray-400 transition-colors hover:text-white"
                href="https://twitter.com/nanoconnect"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                aria-label="Youtube NanoConnect"
                className="text-gray-400 transition-colors hover:text-white"
                href="https://youtube.com/nanoconnect"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-gray-800 border-t pt-8 text-center">
          <p className="text-gray-500 text-sm">
            2024 NanoConnect. Hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
