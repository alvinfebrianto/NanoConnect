import {
  BuildingOffice,
  EnvelopeSimple,
  Eye,
  EyeSlash,
  LockKey,
  Spinner,
  Star,
  User,
} from "@phosphor-icons/react";
import { AnimatePresence, domAnimation, LazyMotion, m } from "framer-motion";
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
    <LazyMotion features={domAnimation}>
      <div className="flex min-h-[100dvh] w-full bg-zinc-50 font-body dark:bg-zinc-950">
        {/* Left: Aesthetic Visual Section */}
        <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-zinc-950 p-12 lg:flex">
          <div className="absolute inset-0 z-0">
            {/* Ambient gradients (high visual impact, zero performance cost) */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary-500/40 via-primary-500/5 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-primary-600/30 via-primary-600/5 to-transparent" />

            {/* Premium Architectural Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(circle_at_center,black_60%,transparent_100%)]" />
          </div>

          <Link
            className="relative z-10 flex items-center gap-2 font-bold font-display text-2xl text-white tracking-tight transition-transform hover:scale-[0.98] active:scale-95"
            to="/"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 text-white">
              N
            </div>
            NanoConnect
          </Link>

          <div className="relative z-10 max-w-lg">
            <m.h1
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-4xl text-white leading-[1.1] tracking-tighter md:text-5xl"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              Mulai cerita
              <br />
              <span className="text-zinc-400">kolaborasi Anda.</span>
            </m.h1>
            <m.p
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 max-w-[45ch] text-lg text-zinc-400 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              transition={{
                duration: 0.8,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              Bergabunglah dengan ribuan pemilik bisnis dan kreator konten dalam
              ekosistem NanoConnect.
            </m.p>
          </div>
        </div>

        {/* Right: Form Section */}
        <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-20 xl:px-32">
          <div className="mx-auto w-full max-w-md">
            <m.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-8 text-center lg:text-left">
                <h2 className="font-bold font-display text-3xl text-zinc-900 tracking-tight dark:text-zinc-50">
                  Buat Akun
                </h2>
                <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                  Pilih peran Anda dan lengkapi profil
                </p>
              </div>

              <AnimatePresence>
                {error && (
                  <m.div
                    animate={{ opacity: 1, height: "auto" }}
                    className="mb-6 overflow-hidden"
                    exit={{ opacity: 0, height: 0 }}
                    initial={{ opacity: 0, height: 0 }}
                  >
                    <div className="rounded-xl border border-red-200/50 bg-red-50/50 p-4 text-red-600 text-sm dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400">
                      {error}
                    </div>
                  </m.div>
                )}
              </AnimatePresence>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    className={`relative flex flex-col items-center gap-3 rounded-2xl border p-4 transition-all duration-200 ${
                      form.userType === "sme"
                        ? "border-primary-500 bg-primary-50/50 text-primary-700 dark:border-primary-500/50 dark:bg-primary-500/10 dark:text-primary-300"
                        : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700"
                    }`}
                    onClick={() => setField("userType", "sme")}
                    type="button"
                  >
                    <BuildingOffice
                      size={28}
                      weight={form.userType === "sme" ? "duotone" : "regular"}
                    />
                    <span className="font-medium text-sm">Pemilik Bisnis</span>
                    {form.userType === "sme" && (
                      <m.div
                        className="absolute inset-0 rounded-2xl ring-1 ring-primary-500 ring-inset dark:ring-primary-500/50"
                        layoutId="activeRole"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                  </button>

                  <button
                    className={`relative flex flex-col items-center gap-3 rounded-2xl border p-4 transition-all duration-200 ${
                      form.userType === "influencer"
                        ? "border-primary-500 bg-primary-50/50 text-primary-700 dark:border-primary-500/50 dark:bg-primary-500/10 dark:text-primary-300"
                        : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700"
                    }`}
                    onClick={() => setField("userType", "influencer")}
                    type="button"
                  >
                    <Star
                      size={28}
                      weight={
                        form.userType === "influencer" ? "duotone" : "regular"
                      }
                    />
                    <span className="font-medium text-sm">Influencer</span>
                    {form.userType === "influencer" && (
                      <m.div
                        className="absolute inset-0 rounded-2xl ring-1 ring-primary-500 ring-inset dark:ring-primary-500/50"
                        layoutId="activeRole"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label
                      className="block font-medium text-sm text-zinc-700 dark:text-zinc-300"
                      htmlFor="name"
                    >
                      Nama Lengkap
                    </label>
                    <div className="group relative">
                      <User
                        className="absolute top-1/2 left-3.5 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-primary-500"
                        size={20}
                      />
                      <input
                        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 pl-11 text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-600"
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

                  <div className="space-y-1.5">
                    <label
                      className="block font-medium text-sm text-zinc-700 dark:text-zinc-300"
                      htmlFor="email"
                    >
                      Alamat Email
                    </label>
                    <div className="group relative">
                      <EnvelopeSimple
                        className="absolute top-1/2 left-3.5 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-primary-500"
                        size={20}
                      />
                      <input
                        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 pl-11 text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-600"
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

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label
                        className="block font-medium text-sm text-zinc-700 dark:text-zinc-300"
                        htmlFor="password"
                      >
                        Kata Sandi
                      </label>
                      <div className="group relative">
                        <LockKey
                          className="absolute top-1/2 left-3.5 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-primary-500"
                          size={20}
                        />
                        <input
                          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 pr-11 pl-11 text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-600"
                          id="password"
                          name="password"
                          onChange={(e) => setField("password", e.target.value)}
                          placeholder="Buat sandi"
                          required
                          type={showPassword ? "text" : "password"}
                          value={form.password}
                        />
                        <button
                          className="absolute top-1/2 right-3.5 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                          onClick={() => setShowPassword(!showPassword)}
                          type="button"
                        >
                          {showPassword ? (
                            <EyeSlash size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label
                        className="block font-medium text-sm text-zinc-700 dark:text-zinc-300"
                        htmlFor="confirmPassword"
                      >
                        Konfirmasi
                      </label>
                      <div className="group relative">
                        <LockKey
                          className="absolute top-1/2 left-3.5 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-primary-500"
                          size={20}
                        />
                        <input
                          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 pl-11 text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-600"
                          id="confirmPassword"
                          name="confirmPassword"
                          onChange={(e) =>
                            setField("confirmPassword", e.target.value)
                          }
                          placeholder="Ulangi sandi"
                          required
                          type={showPassword ? "text" : "password"}
                          value={form.confirmPassword}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-5 items-center">
                    <input
                      className="h-4 w-4 rounded border-zinc-300 bg-white text-primary-600 focus:ring-primary-500 focus:ring-offset-0 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-offset-zinc-950"
                      id="terms"
                      name="terms"
                      required
                      type="checkbox"
                    />
                  </div>
                  <label
                    className="text-sm text-zinc-500 dark:text-zinc-400"
                    htmlFor="terms"
                  >
                    Saya setuju dengan{" "}
                    <Link
                      className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-900 dark:text-zinc-100 dark:decoration-zinc-700 dark:hover:decoration-zinc-100"
                      to="/terms"
                    >
                      Syarat & Ketentuan
                    </Link>{" "}
                    dan{" "}
                    <Link
                      className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-900 dark:text-zinc-100 dark:decoration-zinc-700 dark:hover:decoration-zinc-100"
                      to="/privacy"
                    >
                      Kebijakan Privasi
                    </Link>
                  </label>
                </div>

                <button
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3.5 font-medium text-sm text-white transition-all hover:bg-zinc-800 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                  disabled={isLoading}
                  type="submit"
                >
                  {isLoading ? (
                    <>
                      <Spinner className="animate-spin" size={20} />
                      <span>Membuat akun...</span>
                    </>
                  ) : (
                    <span>Daftar Sekarang</span>
                  )}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-zinc-500 lg:text-left dark:text-zinc-400">
                Sudah memiliki akun?{" "}
                <Link
                  className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-900 dark:text-zinc-100 dark:decoration-zinc-700 dark:hover:decoration-zinc-100"
                  to="/login"
                >
                  Masuk di sini
                </Link>
              </p>
            </m.div>
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}
