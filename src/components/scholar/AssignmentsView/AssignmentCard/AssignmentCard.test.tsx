import { render, screen } from "@/test-utils";
import type { Assignment } from "@/lib/types";
import { AssignmentCard } from "./index";

const baseAssignment: Assignment = {
  id: "a1",
  title: "Build a REST API",
  description: "Create a small REST service.",
  courseName: "Web Development",
  dueAt: "2026-09-10T23:59:00Z",
  status: "IN_PROGRESS",
};

describe("AssignmentCard", () => {
  it("renders title, course, and status badge", () => {
    render(<AssignmentCard assignment={baseAssignment} />);
    expect(screen.getByText("Build a REST API")).toBeInTheDocument();
    expect(screen.getByText("Web Development")).toBeInTheDocument();
    expect(screen.getByText("In progress")).toBeInTheDocument();
  });

  it("shows 'Was due' copy for overdue assignments", () => {
    render(<AssignmentCard assignment={{ ...baseAssignment, status: "OVERDUE" }} />);
    expect(screen.getByText(/Was due/)).toBeInTheDocument();
    expect(screen.getByText("Overdue")).toBeInTheDocument();
  });

  it("invokes onOpen when the card button is clicked", async () => {
    const onOpen = jest.fn();
    const user = (await import("@testing-library/user-event")).default;
    render(<AssignmentCard assignment={baseAssignment} onOpen={onOpen} />);

    await user.click(
      screen.getByRole("button", { name: "View Build a REST API" })
    );
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it("exposes no interactive button when onOpen is not provided", () => {
    render(<AssignmentCard assignment={baseAssignment} />);
    expect(
      screen.queryByRole("button", { name: "View Build a REST API" })
    ).not.toBeInTheDocument();
    expect(screen.getByText("Build a REST API")).toBeInTheDocument();
  });

  it("renders a custom detail action", () => {
    const detailAction = (
      <button type="button" onClick={() => undefined}>
        Open detail
      </button>
    );
    render(
      <AssignmentCard assignment={baseAssignment} detailAction={detailAction} />
    );
    expect(screen.getByRole("button", { name: "Open detail" })).toBeInTheDocument();
  });
});
