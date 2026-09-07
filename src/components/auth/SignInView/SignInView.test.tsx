import { render, screen, userEvent } from "@/test-utils";
import { mockMutationResult } from "@/test-utils/mockMutation";
import type { UseMutationResult } from "@tanstack/react-query";
import { setUser } from "@/stores/auth";
import { ApiClientError } from "@/lib/api";
import type { LoginResponse, LoginPayload } from "@/lib/types";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ push: pushMock })),
}));

jest.mock("@/hooks/useAuthMutations", () => ({
  useLogin: jest.fn(),
}));

import { useLogin } from "@/hooks/useAuthMutations";
import { SignInView } from "./SignInView";

const mockUseLogin = useLogin as jest.MockedFunction<typeof useLogin>;

describe("SignInView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setUser(null);
    mockUseLogin.mockReturnValue(
      mockMutationResult<UseMutationResult<LoginResponse, Error, LoginPayload>>()
    );
  });

  it("renders email and password fields", () => {
    render(<SignInView />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("shows validation errors for empty fields", async () => {
    render(<SignInView />);
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });

  it("submits email, password, and rememberMe via mutation", async () => {
    const mutate = jest.fn();
    mockUseLogin.mockReturnValue(
      mockMutationResult<UseMutationResult<LoginResponse, Error, LoginPayload>>({
        mutate,
      })
    );

    render(<SignInView />);
    await userEvent.type(screen.getByLabelText("Email"), "ada@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "secret123");
    await userEvent.click(screen.getByLabelText("Remember me"));
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(mutate).toHaveBeenCalledWith(
      { email: "ada@example.com", password: "secret123", rememberMe: true },
      expect.anything()
    );
  });

  it("redirects a complete-profile scholar to the scholar dashboard", async () => {
    setUser({ id: "1", email: "a@b.c", name: "Ada", role: "SCHOLAR", organizationId: "o1", profileComplete: true });
    const mutate = jest.fn();
    mockUseLogin.mockReturnValue(
      mockMutationResult<UseMutationResult<LoginResponse, Error, LoginPayload>>({
        mutate,
      })
    );

    render(<SignInView />);
    await userEvent.type(screen.getByLabelText("Email"), "ada@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "secret123");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    const onSuccess = mutate.mock.calls[0][1].onSuccess;
    onSuccess({ user: { role: "SCHOLAR" } } as LoginResponse);

    expect(pushMock).toHaveBeenCalledWith("/scholar/dashboard");
  });

  it("redirects an incomplete-profile user to onboarding", async () => {
    setUser({ id: "1", email: "a@b.c", name: "Ada", role: "SCHOLAR", organizationId: "o1", profileComplete: false });
    const mutate = jest.fn();
    mockUseLogin.mockReturnValue(
      mockMutationResult<UseMutationResult<LoginResponse, Error, LoginPayload>>({
        mutate,
      })
    );

    render(<SignInView />);
    await userEvent.type(screen.getByLabelText("Email"), "ada@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "secret123");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    const onSuccess = mutate.mock.calls[0][1].onSuccess;
    onSuccess({ user: { role: "SCHOLAR" } } as LoginResponse);

    expect(pushMock).toHaveBeenCalledWith("/auth/onboarding");
  });

  it("shows an inline error message for wrong credentials", () => {
    const error = new ApiClientError("INVALID_CREDENTIALS", "Invalid email or password");
    mockUseLogin.mockReturnValue(
      mockMutationResult<UseMutationResult<LoginResponse, Error, LoginPayload>>({
        isError: true,
        error,
      })
    );

    render(<SignInView />);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Invalid email or password"
    );
  });

  it("shows loading state on the submit button while pending", () => {
    mockUseLogin.mockReturnValue(
      mockMutationResult<UseMutationResult<LoginResponse, Error, LoginPayload>>({
        isPending: true,
      })
    );

    render(<SignInView />);
    const button = screen.getByRole("button", { name: /sign in/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("links to magic link and forgot password", () => {
    render(<SignInView />);
    expect(screen.getByRole("link", { name: "Get a magic link" })).toHaveAttribute(
      "href",
      "/auth/magic-link"
    );
    expect(
      screen.getByRole("link", { name: "Forgot password?" })
    ).toHaveAttribute("href", "/auth/forgot-password");
  });
});
