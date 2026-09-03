import { render, screen, userEvent } from "@/test-utils";
import { mockMutationResult } from "@/test-utils/mockMutation";
import type { UseMutationResult } from "@tanstack/react-query";
import { ApiClientError } from "@/lib/api";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ push: pushMock })),
}));

jest.mock("@/hooks/useAuthMutations", () => ({
  useMagicLink: jest.fn(),
}));

import { useMagicLink } from "@/hooks/useAuthMutations";
import { MagicLinkView } from "./MagicLinkView";

const mockUseMagicLink = useMagicLink as jest.MockedFunction<typeof useMagicLink>;

describe("MagicLinkView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMagicLink.mockReturnValue(
      mockMutationResult<UseMutationResult<void, Error, string>>()
    );
  });

  it("renders email field and send button", () => {
    render(<MagicLinkView />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send magic link/i })).toBeInTheDocument();
  });

  it("shows validation error for empty email", async () => {
    render(<MagicLinkView />);
    await userEvent.click(screen.getByRole("button", { name: /send magic link/i }));
    expect(screen.getByText("Email is required")).toBeInTheDocument();
  });

  it("calls mutation and redirects to magic-link-sent with email", async () => {
    const mutate = jest.fn();
    mockUseMagicLink.mockReturnValue(
      mockMutationResult<UseMutationResult<void, Error, string>>({ mutate })
    );

    render(<MagicLinkView />);
    await userEvent.type(screen.getByLabelText("Email"), "ada@example.com");
    await userEvent.click(screen.getByRole("button", { name: /send magic link/i }));

    expect(mutate).toHaveBeenCalledWith("ada@example.com", expect.anything());
    const onSuccess = mutate.mock.calls[0]?.[1]?.onSuccess;
    onSuccess?.();

    expect(pushMock).toHaveBeenCalledWith(
      "/auth/magic-link-sent?email=ada%40example.com"
    );
  });

  it("shows error on API failure", () => {
    mockUseMagicLink.mockReturnValue(
      mockMutationResult<UseMutationResult<void, Error, string>>({
        isError: true,
        error: new ApiClientError("USER_NOT_FOUND", "User not found"),
      })
    );

    render(<MagicLinkView />);
    expect(screen.getByRole("alert")).toHaveTextContent("User not found");
  });

  it("links back to login", () => {
    render(<MagicLinkView />);
    expect(screen.getByRole("link", { name: /back to login/i })).toHaveAttribute(
      "href",
      "/auth/sign-in"
    );
  });
});
