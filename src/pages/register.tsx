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

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: "sme" | "influencer";
}

export function Register() {
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "sme",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const setField = <K extends keyof RegisterForm>(
    key: K,
    value: RegisterForm[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Kata sandi tidak cocok");
      return;
    }

    if (form.password.length < 6) {
      setError("Kata sandi minimal 6 karakter");
      return;
    }

    setIsLoading(true);

    try {
      await register(form.name, form.email, form.password, form.userType);
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 px-4 py-12 sm:px-6 lg:px-8 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl dark:bg-zinc-900">
        <div className="text-center">
          <h2 className="font-bold font-display text-3xl text-zinc-900 dark:text-zinc-50">
            Buat Akun
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Bergabung dengan NanoConnect dan mulai berkolaborasi
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm dark:border-red-800/30 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <button
              className={`flex flex-col items-center space-y-2 rounded-xl border-2 p-4 transition-all duration-200 ${
                form.userType === "sme"
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30"
                  : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
              }`}
              onClick={() => setField("userType", "sme")}
              type="button"
            >
              <Building2
                className={`h-8 w-8 ${form.userType === "sme" ? "text-primary-600" : "text-zinc-400 dark:text-zinc-600"}`}
              />
              <span
                className={`font-medium ${form.userType === "sme" ? "text-primary-700 dark:text-primary-400" : "text-zinc-600 dark:text-zinc-400"}`}
              >
                Saya Pemilik Bisnis
              </span>
            </button>
            <button
              className={`flex flex-col items-center space-y-2 rounded-xl border-2 p-4 transition-all duration-200 ${
                form.userType === "influencer"
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30"
                  : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
              }`}
              onClick={() => setField("userType", "influencer")}
              type="button"
            >
              <Star
                className={`h-8 w-8 ${form.userType === "influencer" ? "text-primary-600" : "text-zinc-400 dark:text-zinc-600"}`}
              />
              <span
                className={`font-medium ${form.userType === "influencer" ? "text-primary-700 dark:text-primary-400" : "text-zinc-600 dark:text-zinc-400"}`}
              >
                Saya Influencer
              </span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label
                className="mb-1 block font-medium text-sm text-zinc-700 dark:text-zinc-300"
                htmlFor="name"
              >
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-zinc-400 dark:text-zinc-600" />
                <input
                  className="input-field pl-10"
                  id="name"
                  name="name"
                  onChange={(e) => setField("name", e.target.value)}
                  placeholder="Nama Lengkap"
                  required
                  type="text"
                  value={form.name}
                />
              </div>
            </div>

            <div>
              <label
                className="mb-1 block font-medium text-sm text-zinc-700 dark:text-zinc-300"
                htmlFor="email"
              >
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-zinc-400 dark:text-zinc-600" />
                <input
                  className="input-field pl-10"
                  id="email"
                  name="email"
                  onChange={(e) => setField("email", e.target.value)}
                  placeholder="anda@contoh.com"
                  required
                  type="email"
                  value={form.email}
                />
              </div>
            </div>

            <div>
              <label
                className="mb-1 block font-medium text-sm text-zinc-700 dark:text-zinc-300"
                htmlFor="password"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-zinc-400 dark:text-zinc-600" />
                <input
                  className="input-field pr-10 pl-10"
                  id="password"
                  name="password"
                  onChange={(e) => setField("password", e.target.value)}
                  placeholder="Buat kata sandi"
                  required
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                />
                <button
                  className="absolute top-1/2 right-3 -translate-y-1/2 transform text-zinc-400 hover:text-zinc-600 dark:text-zinc-600 dark:hover:text-zinc-400"
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
                className="mb-1 block font-medium text-sm text-zinc-700 dark:text-zinc-300"
                htmlFor="confirmPassword"
              >
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-zinc-400 dark:text-zinc-600" />
                <input
                  className="input-field pl-10"
                  id="confirmPassword"
                  name="confirmPassword"
                  onChange={(e) => setField("confirmPassword", e.target.value)}
                  placeholder="Konfirmasi kata sandi Anda"
                  required
                  type={showPassword ? "text" : "password"}
                  value={form.confirmPassword}
                />
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <input
              className="mt-1 rounded border-zinc-300 bg-white text-primary-600 focus:ring-primary-500 dark:border-zinc-700 dark:bg-zinc-800"
              id="terms"
              name="terms"
              required
              type="checkbox"
            />
            <label
              className="ml-2 text-sm text-zinc-600 dark:text-zinc-400"
              htmlFor="terms"
            >
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

        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
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
