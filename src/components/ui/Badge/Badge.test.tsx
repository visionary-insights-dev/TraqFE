// src/components/ui/Badge/Badge.test.tsx
import { render, screen } from "@/test-utils";
import { Badge } from "./index";

// Assignment statuses use distinct badge variants in ScholarLink:
// NOT_STARTED=neutral, IN_PROGRESS=blue, PENDING_VERIFICATION=amber,
// VERIFIED=green, RESUBMISSION_REQUIRED=orange, OVERDUE=red.
describe("Badge", () => {
  it("renders the label text", () => {
    render(<Badge>Pending Verification</Badge>);
    expect(screen.getByText("Pending Verification")).toBeInTheDocument();
  });

  it("maps the green variant to a success (verified) style", () => {
    render(<Badge variant="green">Verified</Badge>);
    expect(screen.getByText("Verified")).toHaveClass("bg-success-light");
  });

  it("maps the red variant to a danger (overdue) style", () => {
    render(<Badge variant="red">Overdue</Badge>);
    expect(screen.getByText("Overdue")).toHaveClass("bg-danger-light");
  });

  it("maps the amber variant to a warning (pending) style", () => {
    render(<Badge variant="amber">Pending</Badge>);
    expect(screen.getByText("Pending")).toHaveClass("bg-warning-light");
  });

  it("defaults to the neutral variant", () => {
    render(<Badge>Neutral</Badge>);
    expect(screen.getByText("Neutral")).toHaveClass("bg-neutral-100");
  });
});
