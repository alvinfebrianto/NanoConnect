export interface User {
  id: string;
  name: string;
  email: string;
  user_type: "sme" | "influencer" | "admin";
  avatar_url?: string;
  bio?: string;
  phone?: string;
  email_verified: boolean;
  status: "active" | "inactive" | "suspended";
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export type PublicUserProfile = Pick<User, "id" | "name"> &
  Partial<Omit<User, "id" | "name">>;

export interface Influencer {
  id: string;
  user_id: string;
  followers_count: number;
  engagement_rate: number;
  niche: string;
  price_per_post: number;
  instagram_handle?: string;
  tiktok_handle?: string;
  youtube_handle?: string;
  twitter_handle?: string;
  location: string;
  languages: string[];
  content_categories: string[];
  is_available: boolean;
  avg_delivery_days: number;
  portfolio_url?: string;
  verification_status: "pending" | "verified" | "rejected";
  created_at: string;
  updated_at: string;
  user?: PublicUserProfile;
}

export interface Order {
  id: string;
  influencer_id: string;
  sme_id: string;
  order_status:
    | "pending"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "disputed";
  payment_status: "pending" | "paid" | "refunded" | "failed";
  total_price: number;
  platform_fee: number;
  title: string;
  description?: string;
  requirements?: string;
  deliverables: string[];
  delivery_date?: string;
  completed_at?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
  influencer?: Influencer;
  sme?: User;
}

export interface Review {
  id: string;
  order_id: string;
  rating: number;
  comment?: string;
  is_verified: boolean;
  helpful_count: number;
  reported: boolean;
  report_reason?: string;
  created_at: string;
  updated_at: string;
  order?: Order;
}

export interface FilterOptions {
  niche?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  minFollowers?: number;
  maxFollowers?: number;
  minEngagement?: number;
  categories?: string[];
  languages?: string[];
  verificationStatus?: "all" | "verified" | "pending";
}
