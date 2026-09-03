import { render, screen, userEvent } from "@/test-utils";
import { setUser } from "@/stores/auth";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ push: pushMock })),
}));

import { OnboardingSuccessView } from "./OnboardingSuccessView";

describe("OnboardingSuccessView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setUser(null);
  });

  it("renders a success message and button", () => {
    render(<OnboardingSuccessView />);
    expect(screen.getByText("You're all set!")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /go to dashboard/i })).toBeInTheDocument();
  });

  it("navigates a scholar to the scholar dashboard", async () => {
    setUser({
      id: "1",
      email: "a@b.c",
      name: "Ada",
      role: "SCHOLAR",
      organizationId: "o1",
      profileComplete: true,
    });

    render(<OnboardingSuccessView />);
    await userEvent.click(screen.getByRole("button", { name: /go to dashboard/i }));

    expect(pushMock).toHaveBeenCalledWith("/scholar/dashboard");
  });

  it("navigates a mentor to the mentor scholars page", async () => {
    setUser({
      id: "2",
      email: "m@b.c",
      name: "Mina",
      role: "MENTOR",
      organizationId: "o1",
      profileComplete: true,
    });

    render(<OnboardingSuccessView />);
    await userEvent.click(screen.getByRole("button", { name: /go to dashboard/i }));

    expect(pushMock).toHaveBeenCalledWith("/mentor/scholars");
  });
});
