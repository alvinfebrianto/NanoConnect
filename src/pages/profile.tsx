import {
  Building2,
  Camera,
  LogOut,
  Mail,
  Pencil,
  Sparkles,
  Star,
  User as UserIcon,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import type { Influencer, User as UserType } from "@/types";

function getUserTypeLabel(type: string): string {
  switch (type) {
    case "sme":
      return "Pemilik Bisnis";
    case "influencer":
      return "Influencer";
    default:
      return "Admin";
  }
}

function getStatusLabel(status: string): { label: string; className: string } {
  switch (status) {
    case "active":
      return { label: "Aktif", className: "bg-green-100 text-green-700" };
    case "inactive":
      return {
        label: "Tidak Aktif",
        className: "bg-yellow-100 text-yellow-700",
      };
    default:
      return { label: "Suspensi", className: "bg-red-100 text-red-700" };
  }
}

function getVerificationLabel(status: string): {
  label: string;
  className: string;
} {
  switch (status) {
    case "verified":
      return {
        label: "Terverifikasi",
        className: "bg-green-100 text-green-700",
      };
    case "pending":
      return {
        label: "Menunggu Verifikasi",
        className: "bg-yellow-100 text-yellow-700",
      };
    default:
      return { label: "Ditolak", className: "bg-red-100 text-red-700" };
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function Profile() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    bio: "",
    avatar_url: "",
  });
  const [influencerProfile, setInfluencerProfile] = useState<Influencer | null>(
    null
  );

  const fetchProfile = useCallback(async () => {
    if (!user) {
      return;
    }
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      if (!accessToken) {
        throw new Error("Sesi tidak valid. Silakan masuk kembali.");
      }
      const response = await fetch("/profile", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      const payload = (await response.json()) as {
        data: { user: UserType; influencerProfile: Influencer | null };
      };
      setFormData({
        name: payload.data.user.name || "",
        phone: payload.data.user.phone || "",
        bio: payload.data.user.bio || "",
        avatar_url: payload.data.user.avatar_url || "",
      });
      setInfluencerProfile(payload.data.influencerProfile);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  }, [user]);

  useEffect(() => {
    if (!(authLoading || user)) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  const handleSave = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      if (!accessToken) {
        setError("Sesi tidak valid. Silakan masuk kembali.");
        return;
      }
      const response = await fetch("/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          bio: formData.bio,
          avatar_url: formData.avatar_url,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { message?: string };
        setError(
          payload.message || "Gagal menyimpan perubahan. Silakan coba lagi."
        );
        return;
      }

      setSuccess("Profil berhasil diperbarui!");
      setIsEditing(false);
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch {
      console.error("Error logging out");
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const statusInfo = getStatusLabel(user.status);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
            <div className="relative h-32 bg-gradient-to-r from-primary-500 to-primary-600" />
            <div className="px-6 pb-6">
              <div className="relative -mt-16 mb-4 flex items-end justify-between">
                <div className="flex items-end gap-4">
                  <div className="relative">
                    {formData.avatar_url ? (
                      <img
                        alt={user.name}
                        className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-md"
                        height={128}
                        src={formData.avatar_url}
                        width={128}
                      />
                    ) : (
                      <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-gray-200 shadow-md">
                        <UserIcon className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    {isEditing && (
                      <button
                        className="absolute right-0 bottom-0 rounded-full bg-primary-500 p-2 text-white shadow-md hover:bg-primary-600"
                        type="button"
                      >
                        <Camera className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="mb-2">
                    <h1 className="font-bold text-2xl text-gray-900">
                      {user.name}
                    </h1>
                    <div className="mt-1 flex items-center gap-2">
                      {user.user_type === "sme" ? (
                        <Building2 className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Star className="h-4 w-4 text-yellow-500" />
                      )}
                      <span className="text-gray-600 capitalize">
                        {getUserTypeLabel(user.user_type)}
                      </span>
                      {user.email_verified && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 font-medium text-green-700 text-xs">
                          Terverifikasi
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 text-sm hover:bg-gray-50"
                  onClick={handleLogout}
                  type="button"
                >
                  <LogOut className="h-4 w-4" />
                  Keluar
                </button>
              </div>

              {success && (
                <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700 text-sm">
                  {success}
                </div>
              )}

              {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h2 className="font-semibold text-gray-900 text-lg">
                    Informasi Pribadi
                  </h2>

                  <div>
                    <p className="mb-1 block font-medium text-gray-700 text-sm">
                      Nama Lengkap
                    </p>
                    {isEditing ? (
                      <input
                        className="input-field"
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        type="text"
                        value={formData.name}
                      />
                    ) : (
                      <p className="text-gray-900">{user.name}</p>
                    )}
                  </div>

                  <div>
                    <p className="mb-1 block font-medium text-gray-700 text-sm">
                      Email
                    </p>
                    <div className="flex items-center gap-2 text-gray-900">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {user.email}
                    </div>
                  </div>

                  <div>
                    <p className="mb-1 block font-medium text-gray-700 text-sm">
                      Nomor Telepon
                    </p>
                    {isEditing ? (
                      <input
                        className="input-field"
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+62 xxx xxxx xxxx"
                        type="tel"
                        value={formData.phone}
                      />
                    ) : (
                      <p className="text-gray-900">
                        {user.phone || "Belum diisi"}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="mb-1 block font-medium text-gray-700 text-sm">
                      Bio
                    </p>
                    {isEditing ? (
                      <textarea
                        className="input-field min-h-[100px]"
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                        placeholder="Ceritakan tentang diri Anda..."
                        value={formData.bio}
                      />
                    ) : (
                      <p className="text-gray-900">
                        {user.bio || "Belum diisi"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="font-semibold text-gray-900 text-lg">
                    Informasi Akun
                  </h2>

                  <div>
                    <p className="mb-1 block font-medium text-gray-700 text-sm">
                      Status Akun
                    </p>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 font-medium text-sm ${statusInfo.className}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>

                  <div>
                    <p className="mb-1 block font-medium text-gray-700 text-sm">
                      Bergabung Sejak
                    </p>
                    <p className="text-gray-900">
                      {formatDate(user.created_at)}
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 block font-medium text-gray-700 text-sm">
                      Terakhir Masuk
                    </p>
                    <p className="text-gray-900">
                      {user.last_login_at
                        ? formatDate(user.last_login_at)
                        : "Belum pernah"}
                    </p>
                  </div>
                </div>
              </div>

              {user.user_type === "influencer" && influencerProfile && (
                <div className="mt-8 border-t pt-6">
                  <h2 className="mb-4 font-semibold text-gray-900 text-lg">
                    Profil Influencer
                  </h2>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-gray-600 text-sm">Pengikut</p>
                      <p className="font-bold text-gray-900 text-xl">
                        {influencerProfile.followers_count.toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-gray-600 text-sm">
                        Tingkat Engagement
                      </p>
                      <p className="font-bold text-gray-900 text-xl">
                        {influencerProfile.engagement_rate}%
                      </p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-gray-600 text-sm">Harga per Post</p>
                      <p className="font-bold text-gray-900 text-xl">
                        Rp{influencerProfile.price_per_post.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-gray-600 text-sm">Niche</p>
                    <p className="font-medium text-gray-900">
                      {influencerProfile.niche}
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="text-gray-600 text-sm">Lokasi</p>
                    <p className="font-medium text-gray-900">
                      {influencerProfile.location}
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="text-gray-600 text-sm">Status Verifikasi</p>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 font-medium text-sm ${getVerificationLabel(influencerProfile.verification_status).className}`}
                    >
                      {
                        getVerificationLabel(
                          influencerProfile.verification_status
                        ).label
                      }
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                {isEditing ? (
                  <>
                    <button
                      className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 text-sm hover:bg-gray-50"
                      onClick={() => setIsEditing(false)}
                      type="button"
                    >
                      <X className="h-4 w-4" />
                      Batal
                    </button>
                    <button
                      className="btn-primary flex items-center gap-2"
                      disabled={isLoading}
                      onClick={handleSave}
                      type="button"
                    >
                      {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                  </>
                ) : (
                  <button
                    className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 font-medium text-sm text-white hover:bg-primary-700"
                    onClick={() => setIsEditing(true)}
                    type="button"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit Profil
                  </button>
                )}
              </div>
            </div>
          </div>

          {user.user_type === "sme" && (
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 font-semibold text-gray-900 text-lg">
                Menu Bisnis
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Link
                  className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                  to="/influencers"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                    <Star className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Cari Influencer</p>
                    <p className="text-gray-600 text-sm">
                      Temukan influencer yang sesuai dengan kebutuhan bisnis
                      Anda
                    </p>
                  </div>
                </Link>
                <Link
                  className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                  to="/ai-recommendations"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                    <Sparkles className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Rekomendasi AI</p>
                    <p className="text-gray-600 text-sm">
                      Dapatkan rekomendasi influencer berbasis AI
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          )}

          {user.user_type === "influencer" && (
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 font-semibold text-gray-900 text-lg">
                Menu Influencer
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Link
                  className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                  to="/influencers"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                    <Star className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Lihat Profil Saya
                    </p>
                    <p className="text-gray-600 text-sm">
                      Kelola profil influencer Anda
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
