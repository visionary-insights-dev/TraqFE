import { render, screen } from "@/test-utils";
import { AssignmentStatusBadge } from "./index";

describe("AssignmentStatusBadge", () => {
  it.each([
    ["NOT_STARTED", "Not started"],
    ["IN_PROGRESS", "In progress"],
    ["PENDING_VERIFICATION", "Pending review"],
    ["VERIFIED", "Completed"],
    ["VERIFIED_LATE", "Completed (late)"],
    ["RESUBMISSION_REQUIRED", "Changes requested"],
    ["OVERDUE", "Overdue"],
  ] as const)("shows the label for %s", (status, label) => {
    render(<AssignmentStatusBadge status={status} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("renders an icon alongside the label", () => {
    render(<AssignmentStatusBadge status="OVERDUE" />);
    const label = screen.getByText("Overdue");
    const badge = label.parentElement;
    expect(badge?.querySelector("svg")).toBeInTheDocument();
    expect(badge?.querySelector("span")).toHaveTextContent("Overdue");
  });
});
