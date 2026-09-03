import { render, screen, userEvent } from "@/test-utils";
import { mockMutationResult } from "@/test-utils/mockMutation";
import type { UseMutationResult } from "@tanstack/react-query";
import { ApiClientError } from "@/lib/api";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ push: pushMock })),
}));

jest.mock("@/hooks/useAuthMutations", () => ({
  useForgotPassword: jest.fn(),
}));

import { useForgotPassword } from "@/hooks/useAuthMutations";
import { ForgotPasswordView } from "./ForgotPasswordView";

const mockUseForgotPassword = useForgotPassword as jest.MockedFunction<typeof useForgotPassword>;

describe("ForgotPasswordView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseForgotPassword.mockReturnValue(
      mockMutationResult<UseMutationResult<void, Error, string>>()
    );
  });

  it("renders email field and submit button", () => {
    render(<ForgotPasswordView />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send reset code/i })).toBeInTheDocument();
  });

  it("shows validation error for empty email", async () => {
    render(<ForgotPasswordView />);
    await userEvent.click(screen.getByRole("button", { name: /send reset code/i }));
    expect(screen.getByText("Email is required")).toBeInTheDocument();
  });

  it("calls mutation with email on submit", async () => {
    const mutate = jest.fn();
    mockUseForgotPassword.mockReturnValue(
      mockMutationResult<UseMutationResult<void, Error, string>>({ mutate })
    );

    render(<ForgotPasswordView />);
    await userEvent.type(screen.getByLabelText("Email"), "ada@example.com");
    await userEvent.click(screen.getByRole("button", { name: /send reset code/i }));

    expect(mutate).toHaveBeenCalledWith(
      "ada@example.com",
      expect.anything()
    );
  });

  it("redirects to OTP verification on success", async () => {
    const mutate = jest.fn();
    mockUseForgotPassword.mockReturnValue(
      mockMutationResult<UseMutationResult<void, Error, string>>({ mutate })
    );

    render(<ForgotPasswordView />);
    await userEvent.type(screen.getByLabelText("Email"), "ada@example.com");
    await userEvent.click(screen.getByRole("button", { name: /send reset code/i }));

    const onSuccess = mutate.mock.calls[0]?.[1]?.onSuccess;
    expect(onSuccess).toBeDefined();
    onSuccess?.();

    expect(pushMock).toHaveBeenCalledWith("/auth/otp-verification");
  });

  it("shows error on API failure", () => {
    mockUseForgotPassword.mockReturnValue(
      mockMutationResult<UseMutationResult<void, Error, string>>({
        isError: true,
        error: new ApiClientError("USER_NOT_FOUND", "User not found"),
      })
    );

    render(<ForgotPasswordView />);
    expect(screen.getByRole("alert")).toHaveTextContent("User not found");
  });

  it("shows loading state on button while pending", () => {
    mockUseForgotPassword.mockReturnValue(
      mockMutationResult<UseMutationResult<void, Error, string>>({ isPending: true })
    );

    render(<ForgotPasswordView />);
    expect(screen.getByRole("button", { name: /send reset code/i })).toBeDisabled();
  });

  it("links back to sign in", () => {
    render(<ForgotPasswordView />);
    expect(screen.getByRole("link", { name: /back to login/i })).toHaveAttribute(
      "href",
      "/auth/sign-in"
    );
  });
});
