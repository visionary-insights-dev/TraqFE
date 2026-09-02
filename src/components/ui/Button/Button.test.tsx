// src/components/ui/Button/Button.test.tsx
import { render, screen, userEvent } from "@/test-utils";
import { Button } from "./index";

describe("Button", () => {
  // Verifies the primary action is clickable and fires the handler — the
  // baseline behaviour every interactive control in ScholarLink relies on.
  it("renders children and triggers onClick when clicked", async () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Save</Button>);

    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  // Loading state is shown for async actions (login, submit) and must block
  // repeated clicks to prevent double-submission of high-integrity writes.
  it("shows a busy state and prevents interaction while loading", async () => {
    const onClick = jest.fn();
    render(
      <Button loading onClick={onClick}>
        Verify
      </Button>
    );

    // While loading the accessible name includes the spinner's "Loading" text,
    // so match on a substring.
    const button = screen.getByRole("button", { name: /Verify/ });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");

    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  // Disabled buttons guard high-integrity writes when offline or invalid.
  it("is non-interactive when disabled", async () => {
    const onClick = jest.fn();
    render(
      <Button disabled onClick={onClick}>
        Mark as Done
      </Button>
    );

    const button = screen.getByRole("button", { name: "Mark as Done" });
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  // Variants map to distinct visual styles; a danger button must not be
  // visually identical to a primary action for destructive operations.
  it("applies a danger variant class for destructive actions", () => {
    render(<Button variant="danger">Archive</Button>);
    expect(screen.getByRole("button", { name: "Archive" })).toHaveClass(
      "bg-danger"
    );
  });

  it("applies an outline variant class", () => {
    render(<Button variant="outline">Cancel</Button>);
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveClass(
      "border"
    );
  });

  it("renders as a submit button when type is submit", () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole("button", { name: "Submit" })).toHaveAttribute(
      "type",
      "submit"
    );
  });
});
