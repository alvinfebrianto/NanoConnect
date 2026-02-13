import type { Database } from "../../src/lib/database.types";
import { createSupabaseClient } from "../lib/supabase-client";

const DELIVERABLES = [
  "Postingan Instagram",
  "Story Instagram",
  "Reel Instagram",
  "Video TikTok",
  "Video YouTube",
  "Postingan Twitter/X",
  "Postingan Blog",
  "Ulasan Produk",
] as const;

const PLATFORM_FEE_RATE = 0.1;
const MIN_PRICE = 0;
const MAX_PRICE = 100_000;

type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"];

interface OrderPayload {
  influencerId: string;
  title: string;
  description?: string;
  requirements?: string;
  deliverables: string[];
  deliveryDate: string;
}

interface OrdersHandlerDependencies {
  getUserId: (accessToken: string) => Promise<string | null>;
  getInfluencerPrice: (influencerId: string) => Promise<number | null>;
  insertOrder: (order: OrderInsert) => Promise<string>;
}

type OrdersDependenciesFactory = (
  accessToken: string
) => OrdersHandlerDependencies;

const createOrdersDependencies: OrdersDependenciesFactory = (accessToken) => {
  const supabase = createSupabaseClient(accessToken);

  return {
    async getUserId(token) {
      const { data, error } = await supabase.auth.getUser(token);
      if (error || !data.user) {
        return null;
      }
      return data.user.id;
    },
    async getInfluencerPrice(influencerId) {
      const { data, error } = await supabase
        .from("influencers")
        .select("price_per_post")
        .eq("id", influencerId)
        .single();

      if (error?.code === "PGRST116") {
        return null;
      }

      if (error) {
        throw error;
      }

      return data.price_per_post ?? null;
    },
    async insertOrder(order) {
      const { data, error } = await supabase
        .from("orders")
        .insert(order)
        .select("id")
        .single();

      if (error) {
        throw error;
      }

      return data.id;
    },
  };
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

const parseBearerToken = (
  authorizationHeader: string | null
): string | null => {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
};

const isValidDeliverables = (deliverables: string[]) =>
  deliverables.length > 0 &&
  deliverables.every((deliverable) => DELIVERABLES.includes(deliverable));

const isValidDeliveryDate = (deliveryDate: string) => {
  if (!deliveryDate) {
    return false;
  }

  const parsed = new Date(deliveryDate);
  if (Number.isNaN(parsed.getTime())) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return parsed >= today;
};

const parseOrderPayload = async (request: Request) => {
  try {
    return (await request.json()) as OrderPayload;
  } catch (error) {
    console.error("Payload tidak valid:", error);
    return null;
  }
};

const validateOrderPayload = (payload: OrderPayload | null) => {
  if (!payload) {
    return "Payload tidak valid.";
  }

  const { influencerId, title, deliverables, deliveryDate } = payload;

  if (!(influencerId && title?.trim())) {
    return "Data pesanan tidak lengkap.";
  }

  if (!isValidDeliverables(deliverables)) {
    return "Deliverables tidak valid.";
  }

  if (!isValidDeliveryDate(deliveryDate)) {
    return "Tanggal pengiriman tidak valid.";
  }

  return null;
};

const buildOrderInsert = (
  payload: OrderPayload,
  userId: string,
  price: number
): OrderInsert => {
  const platformFee = Math.round(price * PLATFORM_FEE_RATE * 100) / 100;
  const totalPrice = Math.round((price + platformFee) * 100) / 100;

  return {
    influencer_id: payload.influencerId,
    sme_id: userId,
    title: payload.title.trim(),
    description: payload.description?.trim() || null,
    requirements: payload.requirements?.trim() || null,
    deliverables: payload.deliverables,
    delivery_date: payload.deliveryDate || null,
    total_price: totalPrice,
    platform_fee: platformFee,
  };
};

const resolveOrderInsert = async (
  dependencies: OrdersHandlerDependencies,
  accessToken: string,
  payload: OrderPayload
) => {
  const userId = await dependencies.getUserId(accessToken);
  if (!userId) {
    return { order: null, error: "Autentikasi tidak valid." };
  }

  const price = await dependencies.getInfluencerPrice(payload.influencerId);
  if (price === null) {
    return { order: null, error: "Influencer tidak ditemukan." };
  }

  if (price < MIN_PRICE || price > MAX_PRICE) {
    return { order: null, error: "Harga influencer tidak valid." };
  }

  return { order: buildOrderInsert(payload, userId, price), error: null };
};

const resolveOrderErrorStatus = (error: string) => {
  if (error === "Autentikasi tidak valid.") {
    return 401;
  }

  if (error === "Influencer tidak ditemukan.") {
    return 404;
  }

  return 400;
};

export const createOrdersHandler = (
  dependenciesFactory: OrdersDependenciesFactory = createOrdersDependencies
) =>
  async function onRequest(context: { request: Request }) {
    const { request } = context;

    if (request.method !== "POST") {
      return jsonResponse({ message: "Metode tidak diizinkan." }, 405);
    }

    const accessToken = parseBearerToken(request.headers.get("Authorization"));

    if (!accessToken) {
      return jsonResponse({ message: "Autentikasi diperlukan." }, 401);
    }

    const payload = await parseOrderPayload(request);
    const validationError = validateOrderPayload(payload);
    if (validationError) {
      return jsonResponse({ message: validationError }, 400);
    }

    try {
      const dependencies = dependenciesFactory(accessToken);
      const { order, error } = await resolveOrderInsert(
        dependencies,
        accessToken,
        payload
      );

      if (error) {
        return jsonResponse({ message: error }, resolveOrderErrorStatus(error));
      }

      const orderId = await dependencies.insertOrder(order);
      return jsonResponse({ data: { orderId } }, 201);
    } catch (error) {
      console.error("Gagal membuat pesanan:", error);
      return jsonResponse(
        { message: "Terjadi kesalahan saat membuat pesanan." },
        500
      );
    }
  };

export const onRequest = createOrdersHandler();
