// src/components/layouts/MentorLayout.test.tsx
import { renderWithProviders, screen } from "@/test-utils";
import { MentorLayout } from "./index";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/mentor/scholars"),
}));

describe("MentorLayout", () => {
  it("renders mentor navigation items", () => {
    renderWithProviders(
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
    expect(screen.getByRole("link", { name: "Verification" })).toHaveAttribute(
      "href",
      "/mentor/verification"
    );
    expect(screen.getByRole("link", { name: "Attendance" })).toHaveAttribute(
      "href",
      "/mentor/attendance"
    );
    expect(screen.getByRole("link", { name: "Resources" })).toHaveAttribute(
      "href",
      "/mentor/resources"
    );
    expect(screen.getByRole("link", { name: "Settings" })).toHaveAttribute(
      "href",
      "/mentor/profile"
    );
  });

  // Mentors manage scholars, not platform administration.
  it("does not expose admin management routes to a mentor", () => {
    renderWithProviders(
      <MentorLayout>
        <p>Mentor content</p>
      </MentorLayout>
    );

    expect(screen.queryByRole("link", { name: /Programs/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Audit Log/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Sort or Pair/ })).not.toBeInTheDocument();
  });

  it("renders its children", () => {
    renderWithProviders(
      <MentorLayout>
        <p>Mentor scholar roster</p>
      </MentorLayout>
    );
    expect(screen.getByText("Mentor scholar roster")).toBeInTheDocument();
  });
});
