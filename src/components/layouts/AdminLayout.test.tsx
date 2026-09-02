// src/components/layouts/AdminLayout.test.tsx
import { render, screen } from "@/test-utils";
import { AdminLayout } from "./index";

describe("AdminLayout", () => {
  it("renders admin navigation items including management destinations", () => {
    render(
      <AdminLayout>
        <p>Admin content</p>
      </AdminLayout>
    );

    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "href",
      "/admin/dashboard"
    );
    expect(screen.getByRole("link", { name: "Programs" })).toHaveAttribute(
      "href",
      "/admin/programs"
    );
    expect(screen.getByRole("link", { name: "People" })).toHaveAttribute(
      "href",
      "/admin/people"
    );
    expect(screen.getByRole("link", { name: "Audit Log" })).toHaveAttribute(
      "href",
      "/admin/audit"
    );
  });

  // Admin is desktop-first with high information density; all management
  // section links must be reachable as navigation.
  it("renders all core admin management links", () => {
    render(
      <AdminLayout>
        <p>Admin content</p>
      </AdminLayout>
    );

    const expected = [
      "Programs",
      "Courses",
      "People",
      "Sort or Pair",
      "Assignments",
      "Attendance",
      "Reports",
      "Audit Log",
      "Settings",
    ];
    for (const label of expected) {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    }
  });

  it("renders its children", () => {
    render(
      <AdminLayout>
        <p>Admin dashboard content</p>
      </AdminLayout>
    );
    expect(screen.getByText("Admin dashboard content")).toBeInTheDocument();
  });
});
