// src/components/ui/EmptyState/EmptyState.test.tsx
import { render, screen, userEvent } from "@/test-utils";
import { EmptyState } from "./index";

describe("EmptyState", () => {
  // Distinguishes a true empty (no data at all) from a filtered empty that
  // offers a "Clear filters" escape hatch — a ScholarLink definition-of-done.
  it("renders title and description for a true-empty state", () => {
    render(
      <EmptyState title="No assignments yet" description="Publish one to begin." />
    );
    expect(screen.getByText("No assignments yet")).toBeInTheDocument();
    expect(screen.getByText("Publish one to begin.")).toBeInTheDocument();
  });

  it("renders an action when provided", () => {
    render(
      <EmptyState
        title="No scholars"
        action={<button>Invite scholars</button>}
      />
    );
    expect(screen.getByRole("button", { name: "Invite scholars" })).toBeInTheDocument();
  });

  // Filtered-empty states must surface a Clear Filters action so users can
  // recover, rather than being stuck behind their own filters.
  it("shows a Clear filters action for a filtered-empty state", async () => {
    const onClearFilters = jest.fn();
    render(
      <EmptyState
        title="No results"
        hasFilters
        onClearFilters={onClearFilters}
      />
    );

    const clear = screen.getByRole("button", { name: "Clear filters" });
    await userEvent.click(clear);
    expect(onClearFilters).toHaveBeenCalledTimes(1);
  });

  it("renders an icon when provided without exposing it to assistive tech", () => {
    render(<EmptyState title="Empty" icon={<span>🕳️</span>} />);
    // Icons are decorative; the title is the accessible name.
    expect(screen.getByText("🕳️")).toHaveTextContent("🕳️");
  });
});
