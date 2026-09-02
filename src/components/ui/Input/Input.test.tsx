// src/components/ui/Input/Input.test.tsx
import { render, screen, userEvent } from "@/test-utils";
import { Input } from "./index";

describe("Input", () => {
  // Labels make form controls usable by screen readers and clicking the label
  // must focus the input — core a11y for every auth/assignment form.
  it("associates its label with the input and focuses on label click", async () => {
    render(<Input id="email" label="Email address" />);

    const input = screen.getByLabelText("Email address");
    expect(input).toBeInTheDocument();

    await userEvent.click(screen.getByText("Email address"));
    expect(input).toHaveFocus();
  });

  // Required fields surface the marker to sighted users; the marker is
  // hidden from screen readers to avoid doubling the "required" announcement.
  it("renders a required marker for required fields", () => {
    render(<Input id="name" label="Full name" required />);
    const label = screen.getByText("Full name");
    const marker = label.querySelector("[aria-hidden='true']");
    expect(marker).toHaveTextContent("*");
  });

  // Surfacing invalid state via aria-invalid is how assistive tech learns
  // the control has failed validation — ScholarLink must never rely on colour
  // alone to convey errors.
  it("marks the input invalid and shows the error message when an error is present", () => {
    render(
      <Input
        id="password"
        label="Password"
        error="Password must be at least 8 characters"
      />
    );

    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("aria-invalid", "true");
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Password must be at least 8 characters");
    expect(alert).toHaveAttribute("id", "password-error");
  });

  // aria-describedby links helper text to the control so instructions are
  // announced in context.
  it("associates helper text via aria-describedby", () => {
    render(
      <Input id="name" label="Name" helperText="As shown on your ID" />
    );
    const input = screen.getByLabelText("Name");
    expect(input).toHaveAttribute("aria-describedby", "name-helper");
    expect(screen.getByText("As shown on your ID")).toBeInTheDocument();
  });

  // Helper text should not render when an error is active — the error replaces
  // it to avoid conflicting messages.
  it("does not render helper text when an error is present", () => {
    render(
      <Input
        id="x"
        label="X"
        helperText="help"
        error="invalid"
      />
    );
    expect(screen.queryByText("help")).not.toBeInTheDocument();
  });

  it("forwards value changes through onChange", async () => {
    const onChange = jest.fn();
    render(
      <Input id="search" label="Search" onChange={onChange} />
    );
    await userEvent.type(screen.getByLabelText("Search"), "abc");
    expect(onChange).toHaveBeenCalled();
  });
});
