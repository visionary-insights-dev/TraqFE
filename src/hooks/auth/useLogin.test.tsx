// @ts-check
import { type ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setAccessToken, setRemembered, setUser } from "@/stores/auth";
import { useLogin } from "./useLogin";
import type { LoginPayload, LoginResponse } from "@/lib/types";

// Ensure fetch is available in test environment
beforeAll(() => {
  globalThis.fetch ??= jest.fn();
});

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ push: pushMock })),
}));

jest.mock("@/stores/auth", () => ({
  setAccessToken: jest.fn(),
  setUser: jest.fn(),
  setRemembered: jest.fn(),
}));

beforeEach(() => {
  ;(global.fetch as jest.Mock).mockClear();
  ;(global.fetch as jest.Mock).mockReset();
});

const payload: LoginPayload = {
  email: "ada@example.com",
  password: "secret123",
  rememberMe: true,
};

const scholarResponse: LoginResponse = {
  accessToken: "token-123",
  user: {
    id: "1",
    email: payload.email,
    name: "Ada",
    role: "SCHOLAR",
    organizationId: "o1",
    profileComplete: true,
  },
};

function renderLoginHook() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return renderHook(() => useLogin(), { wrapper });
}

describe("useLogin", () => {
  it("stores the session and rememberMe preference on success", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        accessToken: "token-123",
        user: {
          id: "1",
          email: payload.email,
          name: "Ada",
          role: "SCHOLAR",
          organizationId: "o1",
          profileComplete: true,
        },
      }),
    });

    const { result } = renderLoginHook();

    result.current.mutate(payload);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(setAccessToken).toHaveBeenCalledWith("token-123");
    expect(setUser).toHaveBeenCalledWith(scholarResponse.user);
    expect(setRemembered).toHaveBeenCalledWith(true);
    expect(pushMock).toHaveBeenCalledWith("/scholar/dashboard");
  });

  it("clears the rememberMe preference when unchecked", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        accessToken: "token-123",
        user: {
          id: "1",
          email: payload.email,
          name: "Ada",
          role: "SCHOLAR",
          organizationId: "o1",
          profileComplete: true,
        },
      }),
    });

    const { result } = renderLoginHook();

    result.current.mutate({ ...payload, rememberMe: false });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(setRemembered).toHaveBeenCalledWith(false);
  });

  it("sends incomplete-profile users to onboarding", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        accessToken: "token-123",
        user: {
          id: "1",
          email: payload.email,
          name: "Ada",
          role: "SCHOLAR",
          organizationId: "o1",
          profileComplete: false,
        },
      }),
    });

    const { result } = renderLoginHook();

    result.current.mutate(payload);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(pushMock).toHaveBeenCalledWith("/auth/onboarding");
  });
});