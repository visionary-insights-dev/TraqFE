// src/components/ui/LoadingSpinner/LoadingSpinner.test.tsx
import { render, screen } from "@/test-utils";
import { LoadingSpinner } from "./index";

describe("LoadingSpinner", () => {
  // Loading indicators must be announced to assistive tech, not be silent or
  // purely visual.
  it("announces loading to screen readers and renders an optional label", () => {
    render(<LoadingSpinner label="Loading scholars..." />);

    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(screen.getByText("Loading scholars...")).toBeInTheDocument();
  });

  it("provides a visually hidden loading announcement when no label is given", () => {
    render(<LoadingSpinner />);
    // The sr-only "Loading" text is the accessible name even without a visible label.
    expect(screen.getByText("Loading")).toHaveClass("sr-only");
  });
});
