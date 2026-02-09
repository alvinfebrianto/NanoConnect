import {
  Building2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Star,
  User,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState<"sme" | "influencer">("sme");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Kata sandi tidak cocok");
      return;
    }

    if (password.length < 6) {
      setError("Kata sandi minimal 6 karakter");
      return;
    }

    setIsLoading(true);

    try {
      await register(name, email, password, userType);
      navigate("/");
    } catch (_err) {
      setError("Gagal membuat akun. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="gradient-bg flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl">
        <div className="text-center">
          <h2 className="font-bold font-display text-3xl text-gray-900">
            Buat Akun
          </h2>
          <p className="mt-2 text-gray-600">
            Bergabung dengan NanoConnect dan mulai berkolaborasi
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <button
              className={`flex flex-col items-center space-y-2 rounded-xl border-2 p-4 transition-all duration-200 ${
                userType === "sme"
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setUserType("sme")}
              type="button"
            >
              <Building2
                className={`h-8 w-8 ${userType === "sme" ? "text-primary-600" : "text-gray-400"}`}
              />
              <span
                className={`font-medium ${userType === "sme" ? "text-primary-700" : "text-gray-600"}`}
              >
                Saya Pemilik Bisnis
              </span>
            </button>
            <button
              className={`flex flex-col items-center space-y-2 rounded-xl border-2 p-4 transition-all duration-200 ${
                userType === "influencer"
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setUserType("influencer")}
              type="button"
            >
              <Star
                className={`h-8 w-8 ${userType === "influencer" ? "text-primary-600" : "text-gray-400"}`}
              />
              <span
                className={`font-medium ${userType === "influencer" ? "text-primary-700" : "text-gray-600"}`}
              >
                Saya Influencer
              </span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label
                className="mb-1 block font-medium text-gray-700 text-sm"
                htmlFor="name"
              >
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                <input
                  className="input-field pl-10"
                  id="name"
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Lengkap"
                  required
                  type="text"
                  value={name}
                />
              </div>
            </div>

            <div>
              <label
                className="mb-1 block font-medium text-gray-700 text-sm"
                htmlFor="email"
              >
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                <input
                  className="input-field pl-10"
                  id="email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anda@contoh.com"
                  required
                  type="email"
                  value={email}
                />
              </div>
            </div>

            <div>
              <label
                className="mb-1 block font-medium text-gray-700 text-sm"
                htmlFor="password"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                <input
                  className="input-field pr-10 pl-10"
                  id="password"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Buat kata sandi"
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                />
                <button
                  className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                className="mb-1 block font-medium text-gray-700 text-sm"
                htmlFor="confirmPassword"
              >
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                <input
                  className="input-field pl-10"
                  id="confirmPassword"
                  name="confirmPassword"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Konfirmasi kata sandi Anda"
                  required
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                />
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <input
              className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              id="terms"
              name="terms"
              required
              type="checkbox"
            />
            <label className="ml-2 text-gray-600 text-sm" htmlFor="terms">
              Saya setuju dengan{" "}
              <Link
                className="font-medium text-primary-600 hover:text-primary-700"
                to="/terms"
              >
                Syarat dan Ketentuan
              </Link>
            </label>
          </div>

          <button
            className="btn-primary flex w-full items-center justify-center space-x-2 py-3"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Membuat akun...</span>
              </>
            ) : (
              <span>Buat Akun</span>
            )}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm">
          Sudah punya akun?{" "}
          <Link
            className="font-medium text-primary-600 hover:text-primary-700"
            to="/login"
          >
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
