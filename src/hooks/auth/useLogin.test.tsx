import { type ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { login } from "@/lib/api/auth";
import { setAccessToken, setRemembered, setUser } from "@/stores/auth";
import { useLogin } from "./useLogin";
import type { LoginPayload, LoginResponse } from "@/lib/types";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ push: pushMock })),
}));

jest.mock("@/lib/api/auth", () => ({
  login: jest.fn(),
}));

jest.mock("@/stores/auth", () => ({
  setAccessToken: jest.fn(),
  setUser: jest.fn(),
  setRemembered: jest.fn(),
}));

const mockLogin = login as jest.MockedFunction<typeof login>;

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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("stores the session and rememberMe preference on success", async () => {
    mockLogin.mockResolvedValue(scholarResponse);
    const { result } = renderLoginHook();

    result.current.mutate(payload);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockLogin).toHaveBeenCalledWith({
      email: payload.email,
      password: payload.password,
      rememberMe: true,
    });
    expect(setAccessToken).toHaveBeenCalledWith("token-123");
    expect(setUser).toHaveBeenCalledWith(scholarResponse.user);
    expect(setRemembered).toHaveBeenCalledWith(true);
    expect(pushMock).toHaveBeenCalledWith("/scholar/dashboard");
  });

  it("clears the rememberMe preference when unchecked", async () => {
    mockLogin.mockResolvedValue(scholarResponse);
    const { result } = renderLoginHook();

    result.current.mutate({ ...payload, rememberMe: false });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(setRemembered).toHaveBeenCalledWith(false);
  });

  it("sends incomplete-profile users to onboarding", async () => {
    mockLogin.mockResolvedValue({
      ...scholarResponse,
      user: { ...scholarResponse.user, profileComplete: false },
    });
    const { result } = renderLoginHook();

    result.current.mutate(payload);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(pushMock).toHaveBeenCalledWith("/auth/onboarding");
  });
});