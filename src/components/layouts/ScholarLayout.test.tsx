// src/components/layouts/ScholarLayout.test.tsx
import { renderWithProviders, screen } from "@/test-utils";
import { ScholarLayout } from "./index";

describe("ScholarLayout", () => {
  // The scholar experience is mobile-first and deliberately limited to
  // scholar-facing destinations — it must never surface admin or mentor
  // management routes. "Home" appears in both the desktop sidebar and the
  // mobile bottom nav, so it renders twice.
  it("renders scholar navigation items", () => {
    renderWithProviders(
      <ScholarLayout>
        <p>Scholar content</p>
      </ScholarLayout>
    );

    expect(screen.getAllByRole("link", { name: "Home" }).length).toBeGreaterThan(0);
    expect(
      screen.getByRole("link", { name: "Assignments" })
    ).toHaveAttribute("href", "/scholar/assignments");
    expect(screen.getAllByRole("link", { name: "Resources" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Progress" }).length).toBeGreaterThan(0);
  });

  // Cross-role isolation: a scholar must not see mentor/admin destinations.
  it("does not expose admin or mentor management routes to a scholar", () => {
    renderWithProviders(
      <ScholarLayout>
        <p>Scholar content</p>
      </ScholarLayout>
    );

    expect(screen.queryByRole("link", { name: /My Scholars/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /People/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Audit Log/ })).not.toBeInTheDocument();
  });

  it("renders the mobile bottom navigation", () => {
    renderWithProviders(
      <ScholarLayout>
        <p>Scholar content</p>
      </ScholarLayout>
    );
    expect(screen.getByRole("navigation", { name: "Mobile navigation" })).toBeInTheDocument();
  });

  it("renders its children", () => {
    renderWithProviders(
      <ScholarLayout>
        <p>Scholar dashboard content</p>
      </ScholarLayout>
    );
    expect(screen.getByText("Scholar dashboard content")).toBeInTheDocument();
  });
});
