import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { User } from "@/types";

async function fetchProfile(): Promise<User | null> {
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token;
  if (!accessToken) {
    return null;
  }

  const response = await fetch("/profile", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Gagal memuat profil SME.");
  }

  const payload = (await response.json()) as {
    data: { user: User };
  };
  return payload.data.user;
}

export function useProfile(isAuthenticated: boolean, authLoading: boolean) {
  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    enabled: isAuthenticated && !authLoading,
    retry: false,
  });
}
