// src/components/shared/BottomNav/BottomNav.test.tsx
import { render, screen } from "@/test-utils";
import { Home, ListChecks } from "lucide-react";
import { BottomNav } from "./index";
import type { BottomNavItem } from "./types";

const items: BottomNavItem[] = [
  { label: "Home", href: "/scholar/dashboard", icon: Home },
  {
    label: "Tasks",
    href: "/scholar/assignments",
    icon: ListChecks,
    ariaLabel: "Assignments tasks",
  },
];

describe("BottomNav", () => {
  it("renders mobile navigation links", () => {
    render(<BottomNav items={items} />);
    expect(screen.getByRole("navigation", { name: "Mobile navigation" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/scholar/dashboard"
    );
  });

  it("uses ariaLabel for link names when provided", () => {
    render(<BottomNav items={items} />);
    expect(screen.getByRole("link", { name: "Assignments tasks" })).toBeInTheDocument();
  });

  it("marks the active tab with aria-current=page", () => {
    const withActive: BottomNavItem[] = [
      { label: "Home", href: "/scholar/dashboard", icon: Home, active: true },
      { label: "Tasks", href: "/scholar/assignments", icon: ListChecks },
    ];
    render(<BottomNav items={withActive} />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  // ScholarLink mobile rule: bottom nav targets must be large enough to tap.
  it("keeps bottom nav targets at least 56px tall", () => {
    render(<BottomNav items={items} />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveClass("min-h-[56px]");
  });
});
