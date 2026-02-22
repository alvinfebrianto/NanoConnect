import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GuestRoute } from "./guest-route";

vi.mock("@/contexts/auth-context", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "@/contexts/auth-context";

const mockedUseAuth = vi.mocked(useAuth);

afterEach(cleanup);

describe("GuestRoute", () => {
  it("redirects authenticated user to /", () => {
    mockedUseAuth.mockReturnValue({
      user: {
        id: "1",
        name: "Test",
        email: "test@test.com",
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

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <GuestRoute>
          <div>Login Form</div>
        </GuestRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText("Login Form")).toBeNull();
  });

  it("shows children for unauthenticated user", () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <GuestRoute>
          <div>Login Form</div>
        </GuestRoute>
      </MemoryRouter>
    );

    expect(screen.getByText("Login Form")).toBeDefined();
  });

  it("shows loading spinner while auth is loading", () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      isLoading: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    const { container } = render(
      <MemoryRouter initialEntries={["/login"]}>
        <GuestRoute>
          <div>Login Form</div>
        </GuestRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText("Login Form")).toBeNull();
    expect(container.querySelector(".animate-spin")).not.toBeNull();
  });
});
