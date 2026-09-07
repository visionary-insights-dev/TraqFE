import { render, screen } from "@/test-utils";
import { mockMutationResult } from "@/test-utils/mockMutation";
import type { UseMutationResult } from "@tanstack/react-query";

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(() => new URLSearchParams("email=ada%40example.com")),
}));

jest.mock("@/hooks/useAuthMutations", () => ({
  useMagicLink: jest.fn(),
}));

import { useMagicLink } from "@/hooks/useAuthMutations";
import { MagicLinkSentView } from "./MagicLinkSentView";

const mockUseMagicLink = useMagicLink as jest.MockedFunction<typeof useMagicLink>;

describe("MagicLinkSentView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMagicLink.mockReturnValue(
      mockMutationResult<UseMutationResult<void, Error, string>>()
    );
  });

  it("shows the target email address", () => {
    render(<MagicLinkSentView />);
    expect(screen.getByText("ada@example.com")).toBeInTheDocument();
  });

  it("shows a cooldown message on the resend button initially", () => {
    render(<MagicLinkSentView />);
    const button = screen.getByRole("button", { name: /resend in \d+s/i });
    expect(button).toBeDisabled();
  });

  it("links back to sign in", () => {
    render(<MagicLinkSentView />);
    expect(screen.getByRole("link", { name: /back to login/i })).toHaveAttribute(
      "href",
      "/auth/sign-in"
    );
  });
});
