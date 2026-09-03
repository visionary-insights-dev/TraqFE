import { render, screen, userEvent } from "@/test-utils";
import { mockMutationResult } from "@/test-utils/mockMutation";
import type { UseMutationResult } from "@tanstack/react-query";
import type { UserEvent } from "@testing-library/user-event";
import { ApiClientError } from "@/lib/api";
import { setResetEmail, clearResetState } from "@/stores/passwordReset";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ push: pushMock })),
}));

jest.mock("@/hooks/useAuthMutations", () => ({
  useVerifyOtp: jest.fn(),
  useForgotPassword: jest.fn(),
}));

import { useVerifyOtp, useForgotPassword } from "@/hooks/useAuthMutations";
import { OtpVerificationView } from "./OtpVerificationView";

type VerifyOtpResult = UseMutationResult<
  { resetToken: string },
  Error,
  { email: string; otp: string }
>;

const mockUseVerifyOtp = useVerifyOtp as jest.MockedFunction<typeof useVerifyOtp>;
const mockUseForgotPassword = useForgotPassword as jest.MockedFunction<typeof useForgotPassword>;

async function fillOtp(user: UserEvent, digits: string) {
  for (let i = 0; i < digits.length; i++) {
    await user.type(screen.getByLabelText(`Digit ${i + 1} of 6`), digits[i]);
  }
}

describe("OtpVerificationView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearResetState();
    setResetEmail("ada@example.com");
    mockUseVerifyOtp.mockReturnValue(mockMutationResult<VerifyOtpResult>());
    mockUseForgotPassword.mockReturnValue(
      mockMutationResult<UseMutationResult<void, Error, string>>()
    );
  });

  it("renders six OTP inputs", () => {
    render(<OtpVerificationView />);
    for (let i = 1; i <= 6; i++) {
      expect(screen.getByLabelText(`Digit ${i} of 6`)).toBeInTheDocument();
    }
  });

  it("auto-advances focus to the next input", async () => {
    const user = userEvent.setup();
    render(<OtpVerificationView />);
    const first = screen.getByLabelText("Digit 1 of 6");
    const second = screen.getByLabelText("Digit 2 of 6");
    await user.type(first, "1");
    expect(second).toHaveFocus();
  });

  it("calls verify mutation with the entered otp", async () => {
    const user = userEvent.setup();
    const mutate = jest.fn();
    mockUseVerifyOtp.mockReturnValue(
      mockMutationResult<VerifyOtpResult>({ mutate })
    );

    render(<OtpVerificationView />);
    await fillOtp(user, "123456");
    await user.click(screen.getByRole("button", { name: /verify/i }));

    expect(mutate).toHaveBeenCalledWith(
      { email: "ada@example.com", otp: "123456" },
      expect.anything()
    );
  });

  it("redirects to new-password on verification success", async () => {
    const user = userEvent.setup();
    const mutate = jest.fn();
    mockUseVerifyOtp.mockReturnValue(
      mockMutationResult<VerifyOtpResult>({ mutate })
    );

    render(<OtpVerificationView />);
    await fillOtp(user, "123456");
    await user.click(screen.getByRole("button", { name: /verify/i }));

    const onSuccess = mutate.mock.calls[0]?.[1]?.onSuccess;
    onSuccess?.();

    expect(pushMock).toHaveBeenCalledWith("/auth/new-password");
  });

  it("shows error for invalid OTP", () => {
    mockUseVerifyOtp.mockReturnValue(
      mockMutationResult<VerifyOtpResult>({
        isError: true,
        error: new ApiClientError("INVALID_OTP", "Invalid code"),
      })
    );

    render(<OtpVerificationView />);
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid code");
  });

  it("disables the verify button until all digits are entered", () => {
    render(<OtpVerificationView />);
    expect(screen.getByRole("button", { name: /verify/i })).toBeDisabled();
  });

  it("links to change email", () => {
    render(<OtpVerificationView />);
    expect(screen.getByRole("link", { name: /change email/i })).toHaveAttribute(
      "href",
      "/auth/forgot-password"
    );
  });
});
