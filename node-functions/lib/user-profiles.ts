import type { Database } from "../../src/lib/database.types";
import type { Influencer, PublicUserProfile } from "../../src/types";

type UsersRow = Database["public"]["Tables"]["users"]["Row"];

export type PrivateUserProfile = Pick<
  UsersRow,
  | "id"
  | "name"
  | "email"
  | "user_type"
  | "avatar_url"
  | "bio"
  | "phone"
  | "email_verified"
  | "status"
  | "last_login_at"
  | "created_at"
  | "updated_at"
>;

export type PublicUserProfileRow =
  Database["public"]["Views"]["public_user_profiles"]["Row"];

export const PRIVATE_USER_PROFILE_SELECT =
  "id,name,email,user_type,avatar_url,bio,phone,email_verified,status,last_login_at,created_at,updated_at";
export const PUBLIC_USER_PROFILE_SELECT = "id,name,avatar_url,bio";
export const PUBLIC_USER_PROFILE_VIEW = "public_user_profiles";

const isPublicUserRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const toPublicUserProfile = (
  value: unknown
): PublicUserProfile | undefined => {
  if (!isPublicUserRecord(value)) {
    return undefined;
  }

  const id = value.id;
  const name = value.name;
  if (typeof id !== "string" || typeof name !== "string") {
    return undefined;
  }

  return {
    id,
    name,
    avatar_url:
      typeof value.avatar_url === "string" ? value.avatar_url : undefined,
    bio: typeof value.bio === "string" ? value.bio : undefined,
  };
};

export const sanitizeInfluencerForPublic = (
  influencer: Influencer
): Influencer => ({
  ...influencer,
  user: toPublicUserProfile(influencer.user),
});

export const sanitizeInfluencersForPublic = (
  influencers: Influencer[]
): Influencer[] => influencers.map(sanitizeInfluencerForPublic);

export const attachPublicUserProfiles = (
  influencers: Influencer[],
  userProfiles: PublicUserProfileRow[]
): Influencer[] => {
  const profilesById = new Map(
    userProfiles.map((profile) => [
      profile.id,
      {
        id: profile.id,
        name: profile.name,
        avatar_url: profile.avatar_url || undefined,
        bio: profile.bio || undefined,
      } as PublicUserProfile,
    ])
  );

  return influencers.map((influencer) => ({
    ...influencer,
    user: profilesById.get(influencer.user_id),
  }));
};
