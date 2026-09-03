import { render, screen, userEvent } from "@/test-utils";
import { mockMutationResult } from "@/test-utils/mockMutation";
import type { UseMutationResult } from "@tanstack/react-query";
import { ApiClientError } from "@/lib/api";
import type { UserProfile, OnboardingInput } from "@/lib/types";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ push: pushMock })),
}));

jest.mock("@/hooks/useAuthMutations", () => ({
  useOnboardingSubmit: jest.fn(),
}));

jest.mock("@/lib/api/auth", () => ({
  getProfileUploadUrl: jest.fn(),
  uploadFileDirect: jest.fn(),
}));

import { useOnboardingSubmit } from "@/hooks/useAuthMutations";
import { OnboardingView } from "./OnboardingView";

const mockUseOnboardingSubmit = useOnboardingSubmit as jest.MockedFunction<typeof useOnboardingSubmit>;

describe("OnboardingView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseOnboardingSubmit.mockReturnValue(
      mockMutationResult<UseMutationResult<UserProfile, Error, OnboardingInput>>()
    );
  });

  it("renders name and phone fields", () => {
    render(<OnboardingView />);
    expect(screen.getByLabelText("Full name")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone number")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /get started/i })).toBeInTheDocument();
  });

  it("shows validation error for short name", async () => {
    render(<OnboardingView />);
    await userEvent.type(screen.getByLabelText("Full name"), "A");
    await userEvent.click(screen.getByRole("button", { name: /get started/i }));

    expect(
      screen.getByText("Full name must be at least 2 characters")
    ).toBeInTheDocument();
  });

  it("submits name and phone via mutation", async () => {
    const mutate = jest.fn();
    mockUseOnboardingSubmit.mockReturnValue(
      mockMutationResult<UseMutationResult<UserProfile, Error, OnboardingInput>>({
        mutate,
      })
    );

    render(<OnboardingView />);
    await userEvent.type(screen.getByLabelText("Full name"), "Ada Okafor");
    await userEvent.type(screen.getByLabelText("Phone number"), "+2348000000000");
    await userEvent.click(screen.getByRole("button", { name: /get started/i }));

    expect(mutate).toHaveBeenCalledWith(
      { name: "Ada Okafor", phone: "+2348000000000", avatarUrl: undefined },
      expect.anything()
    );
  });

  it("redirects to onboarding success on submit", async () => {
    const mutate = jest.fn();
    mockUseOnboardingSubmit.mockReturnValue(
      mockMutationResult<UseMutationResult<UserProfile, Error, OnboardingInput>>({
        mutate,
      })
    );

    render(<OnboardingView />);
    await userEvent.type(screen.getByLabelText("Full name"), "Ada Okafor");
    await userEvent.click(screen.getByRole("button", { name: /get started/i }));

    const onSuccess = mutate.mock.calls[0]?.[1]?.onSuccess;
    onSuccess?.();

    expect(pushMock).toHaveBeenCalledWith("/auth/onboarding/success");
  });

  it("shows error on API failure", () => {
    mockUseOnboardingSubmit.mockReturnValue(
      mockMutationResult<UseMutationResult<UserProfile, Error, OnboardingInput>>({
        isError: true,
        error: new ApiClientError("VALIDATION_ERROR", "Invalid input"),
      })
    );

    render(<OnboardingView />);
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid input");
  });
});
