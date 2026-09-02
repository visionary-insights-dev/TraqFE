// src/components/layouts/MentorLayout.test.tsx
import { render, screen } from "@/test-utils";
import { MentorLayout } from "./index";

describe("MentorLayout", () => {
  it("renders mentor navigation items", () => {
    render(
      <MentorLayout>
        <p>Mentor content</p>
      </MentorLayout>
    );

    expect(screen.getByRole("link", { name: "My Scholars" })).toHaveAttribute(
      "href",
      "/mentor/scholars"
    );
    expect(screen.getByRole("link", { name: "Assignments" })).toHaveAttribute(
      "href",
      "/mentor/assignments"
    );
    expect(screen.getByRole("link", { name: "Attendance" })).toHaveAttribute(
      "href",
      "/mentor/attendance"
    );
  });

  // Mentors manage scholars, not platform administration.
  it("does not expose admin management routes to a mentor", () => {
    render(
      <MentorLayout>
        <p>Mentor content</p>
      </MentorLayout>
    );

    expect(screen.queryByRole("link", { name: /Programs/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Audit Log/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Sort or Pair/ })).not.toBeInTheDocument();
  });

  it("renders its children", () => {
    render(
      <MentorLayout>
        <p>Mentor scholar roster</p>
      </MentorLayout>
    );
    expect(screen.getByText("Mentor scholar roster")).toBeInTheDocument();
  });
});
