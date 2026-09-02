// src/components/shared/Sidebar/Sidebar.test.tsx
import { render, screen } from "@/test-utils";
import { Home, Users } from "lucide-react";
import { Sidebar } from "./index";
import type { NavItem } from "./types";

const items: NavItem[] = [
  { label: "Home", href: "/scholar/dashboard", icon: Home },
  { label: "My Scholars", href: "/mentor/scholars", icon: Users },
];

describe("Sidebar", () => {
  it("renders each navigation item as a link to its route", () => {
    render(<Sidebar items={items} />);

    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink).toHaveAttribute("href", "/scholar/dashboard");
    expect(screen.getByRole("link", { name: "My Scholars" })).toHaveAttribute(
      "href",
      "/mentor/scholars"
    );
  });

  it("renders the brand when provided", () => {
    render(<Sidebar items={items} brand={<span>Traq</span>} />);
    expect(screen.getByText("Traq")).toBeInTheDocument();
  });

  it("marks the active item with aria-current=page", () => {
    const withActive: NavItem[] = [
      { label: "Home", href: "/scholar/dashboard", active: true },
      { label: "Tasks", href: "/scholar/assignments" },
    ];
    render(<Sidebar items={withActive} />);

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(
      screen.getByRole("link", { name: "Tasks" })
    ).not.toHaveAttribute("aria-current");
  });

  it("renders a footer when provided", () => {
    render(<Sidebar items={items} footer={<button>Sign out</button>} />);
    expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument();
  });

  // ScholarLink touch-target rule: interactive nav items must be ≥ 44px tall.
  it("keeps nav links at the 44px minimum touch target", () => {
    render(<Sidebar items={items} />);
    const link = screen.getByRole("link", { name: "Home" });
    expect(link).toHaveClass("min-h-[44px]");
  });
});
