import { render, screen, userEvent } from "@/test-utils";
import { setUser } from "@/stores/auth";

jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));

import { OnboardingSuccessView } from "./OnboardingSuccessView";

describe("OnboardingSuccessView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setUser(null);
  });

  it("renders a success message and button", () => {
    render(<OnboardingSuccessView />);
    expect(screen.getByText("You're all set!")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /go to dashboard/i })
    ).toBeInTheDocument();
  });

  it("fires button click without throwing", async () => {
    setUser({
      id: "1",
      email: "a@b.c",
      name: "Ada",
      role: "SCHOLAR",
      organizationId: "o1",
      profileComplete: true,
    });

    render(<OnboardingSuccessView />);
    await userEvent.click(
      screen.getByRole("button", { name: /go to dashboard/i })
    );
  });
});
