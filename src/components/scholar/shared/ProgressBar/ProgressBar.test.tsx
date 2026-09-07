import { render, screen } from "@/test-utils";
import { ProgressBar } from "./index";

describe("ProgressBar", () => {
  it("renders with the value as accessible text", () => {
    render(<ProgressBar value={75} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "75"
    );
  });

  it("clamps values above 100", () => {
    render(<ProgressBar value={150} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100"
    );
  });

  it("clamps values below 0", () => {
    render(<ProgressBar value={-5} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "0"
    );
  });

  it("applies the brand tone by default", () => {
    render(<ProgressBar value={50} />);
    expect(screen.getByRole("progressbar").firstElementChild).toHaveClass(
      "bg-brand-600"
    );
  });
});
