import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AIRecommendations } from "../../src/pages/ai-recommendations";

vi.mock("@/contexts/auth-context", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/hooks/use-profile", () => ({
  useProfile: vi.fn(),
}));

vi.mock("@/components/auth/protected-route", () => ({
  ProtectedRoute: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="protected-route">{children}</div>
  ),
}));

import { useAuth } from "@/contexts/auth-context";
import { useProfile } from "@/hooks/use-profile";

const mockedUseAuth = vi.mocked(useAuth);
const mockedUseProfile = vi.mocked(useProfile);

afterEach(cleanup);

const BANGUN_BRIEF_REGEX = /Bangun brief kampanye/i;
const FORM_BRIEF_REGEX = /Form Brief Kampanye/i;
const KIRIM_BRIEF_REGEX = /Kirim Brief Kampanye/i;
const AKUN_BELUM_SME_REGEX = /Akun belum SME/i;
const INDUSTRI_NICHE_REGEX = /Industri atau niche SME/i;
const UKURAN_TIM_REGEX = /Ukuran tim atau bisnis/i;
const BUDGET_REGEX = /Budget kampanye/i;
const TARGET_AUDIENS_REGEX = /Target audiens utama/i;
const LOKASI_REGEX = /Lokasi target kampanye/i;
const JENIS_KAMPANYE_REGEX = /Jenis kampanye/i;

const renderWithRouter = (
  initialEntries: string[] = ["/ai-recommendations"]
) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route element={<AIRecommendations />} path="/ai-recommendations" />
        <Route element={<div>Login Page</div>} path="/login" />
        <Route element={<div>Home Page</div>} path="/" />
      </Routes>
    </MemoryRouter>
  );
};

describe("AIRecommendations page - authentication protection", () => {
  describe("unauthenticated user", () => {
    it("renders protected route wrapper when user is not authenticated", () => {
      mockedUseAuth.mockReturnValue({
        user: null,
        isLoading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      mockedUseProfile.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
        isError: false,
        isPending: false,
        isLoadingError: false,
        isRefetchError: false,
        isStale: false,
        isSuccess: true,
        status: "success",
      } as never);

      renderWithRouter();

      expect(screen.getByTestId("protected-route")).toBeDefined();
    });
  });

  describe("authenticated non-SME user", () => {
    it("shows page but disables form submission for influencer users", () => {
      mockedUseAuth.mockReturnValue({
        user: {
          id: "user-inf-1",
          name: "Influencer User",
          email: "influencer@test.com",
          user_type: "influencer",
          email_verified: true,
          status: "active",
          created_at: "",
          updated_at: "",
        },
        isLoading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      mockedUseProfile.mockReturnValue({
        data: {
          id: "user-inf-1",
          name: "Influencer User",
          email: "influencer@test.com",
          user_type: "influencer" as const,
          email_verified: true,
          status: "active" as const,
          created_at: "",
          updated_at: "",
        },
        isLoading: false,
        error: null,
        isError: false,
        isPending: false,
        isLoadingError: false,
        isRefetchError: false,
        isStale: false,
        isSuccess: true,
        status: "success",
      } as never);

      renderWithRouter();

      expect(screen.getByTestId("protected-route")).toBeDefined();
      expect(screen.getByText(BANGUN_BRIEF_REGEX)).toBeDefined();
      expect(screen.getByText(FORM_BRIEF_REGEX)).toBeDefined();

      const submitButton = screen.getByRole("button", {
        name: KIRIM_BRIEF_REGEX,
      });
      expect(submitButton.getAttribute("disabled")).toBeDefined();
    });

    it("shows account status as non-SME", () => {
      mockedUseAuth.mockReturnValue({
        user: {
          id: "user-inf-1",
          name: "Influencer User",
          email: "influencer@test.com",
          user_type: "influencer",
          email_verified: true,
          status: "active",
          created_at: "",
          updated_at: "",
        },
        isLoading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      mockedUseProfile.mockReturnValue({
        data: {
          id: "user-inf-1",
          name: "Influencer User",
          email: "influencer@test.com",
          user_type: "influencer" as const,
          email_verified: true,
          status: "active" as const,
          created_at: "",
          updated_at: "",
        },
        isLoading: false,
        error: null,
        isError: false,
        isPending: false,
        isLoadingError: false,
        isRefetchError: false,
        isStale: false,
        isSuccess: true,
        status: "success",
      } as never);

      renderWithRouter();

      expect(screen.getByText(AKUN_BELUM_SME_REGEX)).toBeDefined();
    });
  });

  describe("authenticated SME user", () => {
    it("allows full access to campaign form", () => {
      mockedUseAuth.mockReturnValue({
        user: {
          id: "user-sme-1",
          name: "SME User",
          email: "sme@test.com",
          user_type: "sme",
          email_verified: true,
          status: "active",
          created_at: "",
          updated_at: "",
        },
        isLoading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      mockedUseProfile.mockReturnValue({
        data: {
          id: "user-sme-1",
          name: "SME User",
          email: "sme@test.com",
          user_type: "sme" as const,
          email_verified: true,
          status: "active" as const,
          created_at: "",
          updated_at: "",
        },
        isLoading: false,
        error: null,
        isError: false,
        isPending: false,
        isLoadingError: false,
        isRefetchError: false,
        isStale: false,
        isSuccess: true,
        status: "success",
      } as never);

      renderWithRouter();

      expect(screen.getByTestId("protected-route")).toBeDefined();
      expect(screen.getByText(BANGUN_BRIEF_REGEX)).toBeDefined();
      expect(screen.getByText(FORM_BRIEF_REGEX)).toBeDefined();

      const nicheSelect = screen.getByLabelText(INDUSTRI_NICHE_REGEX);
      expect(nicheSelect.getAttribute("disabled")).toBeNull();

      const budgetInput = screen.getByLabelText(BUDGET_REGEX);
      expect(budgetInput.getAttribute("disabled")).toBeNull();

      const submitButton = screen.getByRole("button", {
        name: KIRIM_BRIEF_REGEX,
      });
      expect(submitButton.getAttribute("disabled")).toBeDefined();
    });

    it("enables submit button when form is complete", () => {
      mockedUseAuth.mockReturnValue({
        user: {
          id: "user-sme-1",
          name: "SME User",
          email: "sme@test.com",
          user_type: "sme",
          email_verified: true,
          status: "active",
          created_at: "",
          updated_at: "",
        },
        isLoading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      mockedUseProfile.mockReturnValue({
        data: {
          id: "user-sme-1",
          name: "SME User",
          email: "sme@test.com",
          user_type: "sme" as const,
          email_verified: true,
          status: "active" as const,
          created_at: "",
          updated_at: "",
        },
        isLoading: false,
        error: null,
        isError: false,
        isPending: false,
        isLoadingError: false,
        isRefetchError: false,
        isStale: false,
        isSuccess: true,
        status: "success",
      } as never);

      renderWithRouter();

      expect(screen.getByText(BANGUN_BRIEF_REGEX)).toBeDefined();
      expect(screen.getByText(FORM_BRIEF_REGEX)).toBeDefined();

      const nicheSelect = screen.getByLabelText(
        INDUSTRI_NICHE_REGEX
      ) as HTMLSelectElement;
      const companySizeSelect = screen.getByLabelText(
        UKURAN_TIM_REGEX
      ) as HTMLSelectElement;
      const budgetInput = screen.getByLabelText(
        BUDGET_REGEX
      ) as HTMLInputElement;
      const targetAudienceInput = screen.getByLabelText(
        TARGET_AUDIENS_REGEX
      ) as HTMLTextAreaElement;
      const locationSelect = screen.getByLabelText(
        LOKASI_REGEX
      ) as HTMLSelectElement;
      const campaignTypeSelect = screen.getByLabelText(
        JENIS_KAMPANYE_REGEX
      ) as HTMLSelectElement;

      expect(nicheSelect).toBeDefined();
      expect(companySizeSelect).toBeDefined();
      expect(budgetInput).toBeDefined();
      expect(targetAudienceInput).toBeDefined();
      expect(locationSelect).toBeDefined();
      expect(campaignTypeSelect).toBeDefined();

      const submitButton = screen.getByRole("button", {
        name: KIRIM_BRIEF_REGEX,
      });
      expect(submitButton).toBeDefined();
      expect(submitButton.getAttribute("disabled")).toBeDefined();
    });
  });
});
