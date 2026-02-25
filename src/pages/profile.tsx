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
      return {
        label: "Aktif",
        className:
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      };
    case "inactive":
      return {
        label: "Tidak Aktif",
        className:
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      };
    default:
      return {
        label: "Suspensi",
        className:
          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      };
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
        className:
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      };
    case "pending":
      return {
        label: "Menunggu Verifikasi",
        className:
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      };
    default:
      return {
        label: "Ditolak",
        className:
          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      };
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ProfileHeader({
  user,
  formData,
  isEditing,
  onLogout,
}: {
  user: UserType;
  formData: { name: string; phone: string; bio: string; avatar_url: string };
  isEditing: boolean;
  onLogout: () => void;
}) {
  return (
    <div className="relative -mt-16 mb-4 flex items-end justify-between">
      <div className="flex items-end gap-4">
        <div className="relative">
          {formData.avatar_url ? (
            <img
              alt={user.name}
              className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-md dark:border-stone-900"
              height={128}
              src={formData.avatar_url}
              width={128}
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-gray-200 shadow-md dark:border-stone-900 dark:bg-stone-700">
              <UserIcon className="h-16 w-16 text-gray-400 dark:text-stone-600" />
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
          <h1 className="font-bold text-2xl text-gray-900 dark:text-stone-50">
            {user.name}
          </h1>
          <div className="mt-1 flex items-center gap-2">
            {user.user_type === "sme" ? (
              <Building2 className="h-4 w-4 text-gray-500 dark:text-stone-500" />
            ) : (
              <Star className="h-4 w-4 text-yellow-500" />
            )}
            <span className="text-gray-600 capitalize dark:text-stone-400">
              {getUserTypeLabel(user.user_type)}
            </span>
            {user.email_verified && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 font-medium text-green-700 text-xs dark:bg-green-900/30 dark:text-green-400">
                Terverifikasi
              </span>
            )}
          </div>
        </div>
      </div>
      <button
        className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 text-sm hover:bg-gray-50 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
        onClick={onLogout}
        type="button"
      >
        <LogOut className="h-4 w-4" />
        Keluar
      </button>
    </div>
  );
}

function AccountInfo({ user }: { user: UserType }) {
  const statusInfo = getStatusLabel(user.status);

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-gray-900 text-lg dark:text-stone-50">
        Informasi Akun
      </h2>

      <div>
        <p className="mb-1 block font-medium text-gray-700 text-sm dark:text-stone-300">
          Status Akun
        </p>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 font-medium text-sm ${statusInfo.className}`}
        >
          {statusInfo.label}
        </span>
      </div>

      <div>
        <p className="mb-1 block font-medium text-gray-700 text-sm dark:text-stone-300">
          Bergabung Sejak
        </p>
        <p className="text-gray-900 dark:text-stone-100">
          {formatDate(user.created_at)}
        </p>
      </div>

      <div>
        <p className="mb-1 block font-medium text-gray-700 text-sm dark:text-stone-300">
          Terakhir Masuk
        </p>
        <p className="text-gray-900 dark:text-stone-100">
          {user.last_login_at ? formatDate(user.last_login_at) : "Belum pernah"}
        </p>
      </div>
    </div>
  );
}

function InfluencerProfileSection({
  influencerProfile,
}: {
  influencerProfile: Influencer;
}) {
  return (
    <div className="mt-8 border-t pt-6 dark:border-stone-700">
      <h2 className="mb-4 font-semibold text-gray-900 text-lg dark:text-stone-50">
        Profil Influencer
      </h2>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-gray-50 p-4 dark:bg-stone-800">
          <p className="text-gray-600 text-sm dark:text-stone-400">Pengikut</p>
          <p className="font-bold text-gray-900 text-xl dark:text-stone-100">
            {influencerProfile.followers_count.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl bg-gray-50 p-4 dark:bg-stone-800">
          <p className="text-gray-600 text-sm dark:text-stone-400">
            Tingkat Engagement
          </p>
          <p className="font-bold text-gray-900 text-xl dark:text-stone-100">
            {influencerProfile.engagement_rate}%
          </p>
        </div>
        <div className="rounded-xl bg-gray-50 p-4 dark:bg-stone-800">
          <p className="text-gray-600 text-sm dark:text-stone-400">
            Harga per Post
          </p>
          <p className="font-bold text-gray-900 text-xl dark:text-stone-100">
            Rp{influencerProfile.price_per_post.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-gray-600 text-sm dark:text-stone-400">Niche</p>
        <p className="font-medium text-gray-900 dark:text-stone-100">
          {influencerProfile.niche}
        </p>
      </div>

      <div className="mt-4">
        <p className="text-gray-600 text-sm dark:text-stone-400">Lokasi</p>
        <p className="font-medium text-gray-900 dark:text-stone-100">
          {influencerProfile.location}
        </p>
      </div>

      <div className="mt-4">
        <p className="text-gray-600 text-sm dark:text-stone-400">
          Status Verifikasi
        </p>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 font-medium text-sm ${getVerificationLabel(influencerProfile.verification_status).className}`}
        >
          {getVerificationLabel(influencerProfile.verification_status).label}
        </span>
      </div>
    </div>
  );
}

function PersonalInfo({
  user,
  formData,
  isEditing,
  onFieldChange,
}: {
  user: UserType;
  formData: { name: string; phone: string; bio: string; avatar_url: string };
  isEditing: boolean;
  onFieldChange: (field: string, value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-gray-900 text-lg dark:text-stone-50">
        Informasi Pribadi
      </h2>

      <div>
        <p className="mb-1 block font-medium text-gray-700 text-sm dark:text-stone-300">
          Nama Lengkap
        </p>
        {isEditing ? (
          <input
            className="input-field"
            onChange={(e) => onFieldChange("name", e.target.value)}
            type="text"
            value={formData.name}
          />
        ) : (
          <p className="text-gray-900 dark:text-stone-100">{user.name}</p>
        )}
      </div>

      <div>
        <p className="mb-1 block font-medium text-gray-700 text-sm dark:text-stone-300">
          Email
        </p>
        <div className="flex items-center gap-2 text-gray-900 dark:text-stone-100">
          <Mail className="h-4 w-4 text-gray-400 dark:text-stone-600" />
          {user.email}
        </div>
      </div>

      <div>
        <p className="mb-1 block font-medium text-gray-700 text-sm dark:text-stone-300">
          Nomor Telepon
        </p>
        {isEditing ? (
          <input
            className="input-field"
            onChange={(e) => onFieldChange("phone", e.target.value)}
            placeholder="+62 xxx xxxx xxxx"
            type="tel"
            value={formData.phone}
          />
        ) : (
          <p className="text-gray-900 dark:text-stone-100">
            {user.phone || "Belum diisi"}
          </p>
        )}
      </div>

      <div>
        <p className="mb-1 block font-medium text-gray-700 text-sm dark:text-stone-300">
          Bio
        </p>
        {isEditing ? (
          <textarea
            className="input-field min-h-[100px]"
            onChange={(e) => onFieldChange("bio", e.target.value)}
            placeholder="Ceritakan tentang diri Anda..."
            value={formData.bio}
          />
        ) : (
          <p className="text-gray-900 dark:text-stone-100">
            {user.bio || "Belum diisi"}
          </p>
        )}
      </div>
    </div>
  );
}

function UserTypeMenu({ userType }: { userType: string }) {
  if (userType === "sme") {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-stone-900">
        <h2 className="mb-4 font-semibold text-gray-900 text-lg dark:text-stone-50">
          Menu Bisnis
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-stone-700 dark:hover:bg-stone-800"
            to="/influencers"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
              <Star className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-stone-100">
                Cari Influencer
              </p>
              <p className="text-gray-600 text-sm dark:text-stone-400">
                Temukan influencer yang sesuai dengan kebutuhan bisnis Anda
              </p>
            </div>
          </Link>
          <Link
            className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-stone-700 dark:hover:bg-stone-800"
            to="/ai-recommendations"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
              <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-stone-100">
                Rekomendasi AI
              </p>
              <p className="text-gray-600 text-sm dark:text-stone-400">
                Dapatkan rekomendasi influencer berbasis AI
              </p>
            </div>
          </Link>
        </div>
      </div>
    );
  }

  if (userType === "influencer") {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-stone-900">
        <h2 className="mb-4 font-semibold text-gray-900 text-lg dark:text-stone-50">
          Menu Influencer
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-stone-700 dark:hover:bg-stone-800"
            to="/influencers"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
              <Star className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-stone-100">
                Lihat Profil Saya
              </p>
              <p className="text-gray-600 text-sm dark:text-stone-400">
                Kelola profil influencer Anda
              </p>
            </div>
          </Link>
        </div>
      </div>
    );
  }

  return null;
}

export function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [editState, setEditState] = useState({
    isEditing: false,
    error: "",
    success: "",
  });
  const [isLoading, setIsLoading] = useState(false);
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
      const response = await fetch("/api/profile", {
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
    fetchProfile();
  }, [fetchProfile]);

  const handleSave = async () => {
    setIsLoading(true);
    setEditState({ isEditing: true, error: "", success: "" });

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      if (!accessToken) {
        setEditState((prev) => ({
          ...prev,
          error: "Sesi tidak valid. Silakan masuk kembali.",
        }));
        return;
      }
      const response = await fetch("/api/profile", {
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
        setEditState((prev) => ({
          ...prev,
          error:
            payload.message || "Gagal menyimpan perubahan. Silakan coba lagi.",
        }));
        return;
      }

      setEditState({
        isEditing: false,
        error: "",
        success: "Profil berhasil diperbarui!",
      });
    } catch {
      setEditState((prev) => ({
        ...prev,
        error: "Terjadi kesalahan. Silakan coba lagi.",
      }));
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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 dark:bg-stone-950">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-stone-900">
            <div className="relative h-32 bg-gradient-to-r from-primary-500 to-primary-600" />
            <div className="px-6 pb-6">
              <ProfileHeader
                formData={formData}
                isEditing={editState.isEditing}
                onLogout={handleLogout}
                user={user}
              />

              {editState.success && (
                <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700 text-sm dark:border-green-800/30 dark:bg-green-900/20 dark:text-green-400">
                  {editState.success}
                </div>
              )}

              {editState.error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm dark:border-red-800/30 dark:bg-red-900/20 dark:text-red-400">
                  {editState.error}
                </div>
              )}

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <PersonalInfo
                  formData={formData}
                  isEditing={editState.isEditing}
                  onFieldChange={(field, value) =>
                    setFormData((prev) => ({ ...prev, [field]: value }))
                  }
                  user={user}
                />
                <AccountInfo user={user} />
              </div>

              {user.user_type === "influencer" && influencerProfile && (
                <InfluencerProfileSection
                  influencerProfile={influencerProfile}
                />
              )}

              <div className="mt-6 flex justify-end gap-3">
                {editState.isEditing ? (
                  <>
                    <button
                      className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 text-sm hover:bg-gray-50 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
                      onClick={() =>
                        setEditState((prev) => ({
                          ...prev,
                          isEditing: false,
                        }))
                      }
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
                    onClick={() =>
                      setEditState((prev) => ({ ...prev, isEditing: true }))
                    }
                    type="button"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit Profil
                  </button>
                )}
              </div>
            </div>
          </div>

          <UserTypeMenu userType={user.user_type} />
        </div>
      </div>
    </div>
  );
}
