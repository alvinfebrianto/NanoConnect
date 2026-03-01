import { describe, expect, it, vi } from "vitest";
import { createOrdersHandler } from "./index";

const buildRequest = (body: Record<string, unknown>, token?: string) =>
  new Request("https://example.com/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

const createContext = (request: Request) => ({ request });

describe("orders node function", () => {
  it("menolak permintaan tanpa token", async () => {
    const handler = createOrdersHandler(() => ({
      getUserId: async () => null,
      getUserType: async () => "sme",
      getInfluencerPrice: async () => 500,
      insertOrder: async () => "order-1",
    }));

    const response = await handler(createContext(buildRequest({})));
    const payload = (await response.json()) as { message: string };

    expect(response.status).toBe(401);
    expect(payload.message).toBe("Autentikasi diperlukan.");
  });

  it("menolak deliverables yang tidak valid", async () => {
    const handler = createOrdersHandler(() => ({
      getUserId: async () => "user-1",
      getUserType: async () => "sme",
      getInfluencerPrice: async () => 500,
      insertOrder: async () => "order-1",
    }));

    const response = await handler(
      createContext(
        buildRequest(
          {
            influencerId: "inf-1",
            title: "Test",
            deliverables: ["Tidak Valid"],
            deliveryDate: "2099-01-01",
          },
          "token"
        )
      )
    );

    const payload = (await response.json()) as { message: string };

    expect(response.status).toBe(400);
    expect(payload.message).toBe("Deliverables tidak valid.");
  });

  it("membuat pesanan dengan data valid", async () => {
    const handler = createOrdersHandler(() => ({
      getUserId: async () => "user-1",
      getUserType: async () => "sme",
      getInfluencerPrice: async () => 500,
      insertOrder: async () => "order-123",
    }));

    const response = await handler(
      createContext(
        buildRequest(
          {
            influencerId: "inf-1",
            title: "Kampanye Baru",
            description: "Deskripsi",
            requirements: "Syarat",
            deliverables: ["Postingan Instagram"],
            deliveryDate: "2099-01-01",
          },
          "token"
        )
      )
    );

    const payload = (await response.json()) as {
      data: { orderId: string };
    };

    expect(response.status).toBe(201);
    expect(payload.data.orderId).toBe("order-123");
  });

  it("menolak pesanan dari akun non-SME", async () => {
    const insertOrder = vi.fn().mockResolvedValue("order-123");
    const handler = createOrdersHandler(() => ({
      getUserId: async () => "user-1",
      getUserType: async () => "influencer",
      getInfluencerPrice: async () => 500,
      insertOrder,
    }));

    const response = await handler(
      createContext(
        buildRequest(
          {
            influencerId: "inf-1",
            title: "Kampanye Baru",
            description: "Deskripsi",
            requirements: "Syarat",
            deliverables: ["Postingan Instagram"],
            deliveryDate: "2099-01-01",
          },
          "token"
        )
      )
    );
    const payload = (await response.json()) as { message: string };

    expect(response.status).toBe(403);
    expect(payload.message).toBe("Hanya akun SME yang dapat membuat pesanan.");
    expect(insertOrder).not.toHaveBeenCalled();
  });
});
