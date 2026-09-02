// src/components/ui/Toast/Toast.test.tsx
import { render, screen, userEvent } from "@/test-utils";
import { Toast } from "./index";

describe("Toast", () => {
  it("renders title and description", () => {
    render(
      <Toast title="Assignment verified" description="Progress was updated." />
    );
    expect(screen.getByText("Assignment verified")).toBeInTheDocument();
    expect(screen.getByText("Progress was updated.")).toBeInTheDocument();
  });

  // Toasts are announced politely (not assertively) so they don't interrupt
  // the user mid-task.
  it("is polite to assistive tech", () => {
    render(<Toast title="Saved" />);
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
  });

  // Dismissable toasts expose a clearly labelled close control — a silent or
  // X-icon-only control would be inaccessible.
  it("calls onDismiss when the dismiss button is clicked", async () => {
    const onDismiss = jest.fn();
    render(<Toast title="Saved" onDismiss={onDismiss} />);

    await userEvent.click(screen.getByRole("button", { name: "Dismiss notification" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  // Uses jest fake timers to confirm auto-dismiss fires after the duration.
  it("auto-dismisses after the provided duration", () => {
    jest.useFakeTimers();
    try {
      const onDismiss = jest.fn();
      render(
        <Toast title="Saved" duration={1000} onDismiss={onDismiss} />
      );
      expect(onDismiss).not.toHaveBeenCalled();
      jest.advanceTimersByTime(1000);
      expect(onDismiss).toHaveBeenCalledTimes(1);
    } finally {
      jest.useRealTimers();
    }
  });

  it("does not auto-dismiss when duration is Infinity", () => {
    jest.useFakeTimers();
    try {
      const onDismiss = jest.fn();
      render(<Toast title="Saved" duration={Infinity} onDismiss={onDismiss} />);
      jest.advanceTimersByTime(100_000);
      expect(onDismiss).not.toHaveBeenCalled();
    } finally {
      jest.useRealTimers();
    }
  });
});
