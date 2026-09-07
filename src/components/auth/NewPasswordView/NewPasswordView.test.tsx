import { render, screen, userEvent } from "@/test-utils";
import { mockMutationResult } from "@/test-utils/mockMutation";
import type { UseMutationResult } from "@tanstack/react-query";
import { ApiClientError } from "@/lib/api";
import { setResetToken, setResetEmail, clearResetState } from "@/stores/passwordReset";

const pushMock = jest.fn();
const replaceMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ push: pushMock, replace: replaceMock })),
}));

jest.mock("@/hooks/useAuthMutations", () => ({
  useResetPassword: jest.fn(),
}));

import { useResetPassword } from "@/hooks/useAuthMutations";
import { NewPasswordView } from "./NewPasswordView";

const mockUseResetPassword = useResetPassword as jest.MockedFunction<typeof useResetPassword>;

describe("NewPasswordView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearResetState();
    setResetToken("tok");
    setResetEmail("ada@example.com");
    mockUseResetPassword.mockReturnValue(
      mockMutationResult<UseMutationResult<void, Error, { token: string; password: string }>>()
    );
  });

  it("renders password and confirm password fields", () => {
    render(<NewPasswordView />);
    expect(screen.getByLabelText("New password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm new password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset password/i })).toBeInTheDocument();
  });

  it("shows validation error when passwords are too short", async () => {
    render(<NewPasswordView />);
    await userEvent.type(screen.getByLabelText("New password"), "short");
    await userEvent.type(screen.getByLabelText("Confirm new password"), "short");
    await userEvent.click(screen.getByRole("button", { name: /reset password/i }));

    expect(
      screen.getByText("Password must be at least 8 characters")
    ).toBeInTheDocument();
  });

  it("shows match error when passwords differ", async () => {
    render(<NewPasswordView />);
    await userEvent.type(screen.getByLabelText("New password"), "password123");
    await userEvent.type(screen.getByLabelText("Confirm new password"), "different123");
    await userEvent.click(screen.getByRole("button", { name: /reset password/i }));

    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
  });

  it("calls reset mutation with token and password", async () => {
    const mutate = jest.fn();
    mockUseResetPassword.mockReturnValue(
      mockMutationResult<UseMutationResult<void, Error, { token: string; password: string }>>({
        mutate,
      })
    );

    render(<NewPasswordView />);
    await userEvent.type(screen.getByLabelText("New password"), "newpass123");
    await userEvent.type(screen.getByLabelText("Confirm new password"), "newpass123");
    await userEvent.click(screen.getByRole("button", { name: /reset password/i }));

    expect(mutate).toHaveBeenCalledWith(
      { token: "tok", password: "newpass123" },
      expect.anything()
    );
  });

  it("redirects to sign-in on success", async () => {
    const mutate = jest.fn();
    mockUseResetPassword.mockReturnValue(
      mockMutationResult<UseMutationResult<void, Error, { token: string; password: string }>>({
        mutate,
      })
    );

    render(<NewPasswordView />);
    await userEvent.type(screen.getByLabelText("New password"), "newpass123");
    await userEvent.type(screen.getByLabelText("Confirm new password"), "newpass123");
    await userEvent.click(screen.getByRole("button", { name: /reset password/i }));

    const onSuccess = mutate.mock.calls[0]?.[1]?.onSuccess;
    onSuccess?.();

    expect(pushMock).toHaveBeenCalledWith("/auth/sign-in");
  });

  it("shows error on API failure", () => {
    mockUseResetPassword.mockReturnValue(
      mockMutationResult<UseMutationResult<void, Error, { token: string; password: string }>>({
        isError: true,
        error: new ApiClientError("RESET_TOKEN_EXPIRED", "Session expired"),
      })
    );

    render(<NewPasswordView />);
    expect(screen.getByRole("alert")).toHaveTextContent("Session expired");
  });

  it("shows expired-session message when no reset token is present", () => {
    clearResetState();
    render(<NewPasswordView />);
    expect(screen.getByText("Reset session expired")).toBeInTheDocument();
  });
});
