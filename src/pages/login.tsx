import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="gradient-bg flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl">
        <div className="text-center">
          <h2 className="font-bold font-display text-3xl text-gray-900">
            Selamat Datang Kembali
          </h2>
          <p className="mt-2 text-gray-600">Masuk ke akun NanoConnect Anda</p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
            {error === "Invalid email or password. Please try again."
              ? "Email atau kata sandi tidak valid. Silakan coba lagi."
              : error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
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
                  placeholder="Masukkan kata sandi Anda"
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
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                type="checkbox"
              />
              <span className="ml-2 text-gray-600">Ingat saya</span>
            </label>
            <span className="font-medium text-primary-600">
              Lupa kata sandi? (Segera hadir)
            </span>
          </div>

          <button
            className="btn-primary flex w-full items-center justify-center space-x-2 py-3"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Sedang masuk...</span>
              </>
            ) : (
              <span>Masuk</span>
            )}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm">
          Belum punya akun?{" "}
          <Link
            className="font-medium text-primary-600 hover:text-primary-700"
            to="/register"
          >
            Buat sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
