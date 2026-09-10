import { render, screen, userEvent } from "@/test-utils";
import { mockMutationResult } from "@/test-utils/mockMutation";
import type { UseMutationResult } from "@tanstack/react-query";
import { setUser, setRemembered } from "@/stores/auth";
import { ApiClientError } from "@/lib/api";
import type { LoginResponse, LoginPayload } from "@/lib/types";

jest.mock("@/hooks/auth", () => ({
  useLogin: jest.fn(),
}));

import { useLogin } from "@/hooks/auth";
import { SignInView } from "./SignInView";

const mockUseLogin = useLogin as jest.MockedFunction<typeof useLogin>;

describe("SignInView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setUser(null);
    setRemembered(false);
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

  it("defaults Remember me to the persisted preference", () => {
    setRemembered(true);
    render(<SignInView />);
    expect(screen.getByLabelText("Remember me")).toBeChecked();
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

    expect(mutate).toHaveBeenCalledWith({
      email: "ada@example.com",
      password: "secret123",
      rememberMe: true,
    });
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
