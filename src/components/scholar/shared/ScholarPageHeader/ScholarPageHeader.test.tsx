import { render, screen } from "@/test-utils";
import { ScholarPageHeader } from ".";

describe("ScholarPageHeader", () => {
  it("renders eyebrow, title and subtitle", () => {
    render(
      <ScholarPageHeader
        eyebrow="Progress"
        title="My Progress"
        subtitle="How you're tracking."
      />
    );
    expect(screen.getByText("Scholar · Progress")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "My Progress" })).toBeInTheDocument();
    expect(screen.getByText("How you're tracking.")).toBeInTheDocument();
  });

  it("renders the right-side slot", () => {
    render(
      <ScholarPageHeader
        title="Home"
        right={<span>chip</span>}
      />
    );
    expect(screen.getByText("chip")).toBeInTheDocument();
  });
});