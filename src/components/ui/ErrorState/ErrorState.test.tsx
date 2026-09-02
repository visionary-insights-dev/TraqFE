// src/components/ui/ErrorState/ErrorState.test.tsx
import { render, screen, userEvent } from "@/test-utils";
import { ErrorState } from "./index";

describe("ErrorState", () => {
  // Error states must give an actionable message with a retry path rather
  // than a generic "Something went wrong" with no recovery.
  it("renders title, message, and a retry action", async () => {
    const onRetry = jest.fn();
    render(
      <ErrorState
        title="Failed to load dashboard"
        message="We couldn't reach the server."
        onRetry={onRetry}
      />
    );

    expect(screen.getByText("Failed to load dashboard")).toBeInTheDocument();
    expect(screen.getByText("We couldn't reach the server.")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("omits the retry button when no handler is provided", () => {
    render(<ErrorState message="An error occurred" />);
    expect(screen.queryByRole("button", { name: "Try again" })).not.toBeInTheDocument();
  });

  it("uses a default title when none is supplied", () => {
    render(<ErrorState />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });
});
