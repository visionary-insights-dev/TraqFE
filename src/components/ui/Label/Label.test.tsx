// src/components/ui/Label/Label.test.tsx
import { render, screen } from "@/test-utils";
import { Label } from "./index";

describe("Label", () => {
  // A label's htmlFor bound to an input is the foundation of accessible forms.
  it("associates with a control by htmlFor", () => {
    render(<Label htmlFor="email">Email</Label>);
    expect(screen.getByText("Email")).toHaveAttribute("for", "email");
  });

  it("renders an accessible required marker", () => {
    render(<Label htmlFor="a" required>Name</Label>);
    // The * is visually present but hidden from screen readers.
    const label = screen.getByText("Name");
    expect(label.querySelector("[aria-hidden='true']")).toHaveTextContent("*");
  });

  it("omits the required marker when not required", () => {
    render(<Label htmlFor="a">Email</Label>);
    expect(screen.getByText("Email").querySelector("[aria-hidden='true']")).toBeNull();
  });
});
