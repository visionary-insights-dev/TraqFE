import { render, screen, userEvent } from "@/test-utils";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("renders with a label", () => {
    render(<Checkbox id="remember" label="Remember me" />);
    expect(screen.getByLabelText("Remember me")).toBeInTheDocument();
  });

  it("is checked when checked prop is true", () => {
    render(<Checkbox id="remember" label="Remember me" checked />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("calls onChange when clicked", async () => {
    const onChange = jest.fn();
    render(
      <Checkbox id="remember" label="Remember me" onChange={onChange} />
    );
    await userEvent.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<Checkbox id="remember" label="Remember me" disabled />);
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });

  it("shows an error message", () => {
    render(
      <Checkbox id="terms" label="Accept terms" error="Please accept" />
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Please accept");
  });
});
