import { render, screen } from "@/test-utils";
import { StatusFilterBar } from "./index";

describe("StatusFilterBar", () => {
  it("renders all filter options", () => {
    render(
      <StatusFilterBar active="ALL" counts={{}} onChange={() => {}} />
    );
    expect(screen.getByRole("tab", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Pending" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Awaiting" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Completed" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Overdue" })).toBeInTheDocument();
  });

  it("marks the active filter as selected", () => {
    render(
      <StatusFilterBar active="PENDING" counts={{}} onChange={() => {}} />
    );
    expect(screen.getByRole("tab", { name: "Pending" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("tab", { name: "All" })).toHaveAttribute(
      "aria-selected",
      "false"
    );
  });

  it("shows counts in the accessible name", () => {
    render(
      <StatusFilterBar
        active="ALL"
        counts={{ ALL: 5, PENDING: 2 }}
        onChange={() => {}}
      />
    );
    expect(
      screen.getByRole("tab", { name: "All (5)" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Pending (2)" })
    ).toBeInTheDocument();
  });

  it("calls onChange with the selected value", async () => {
    const onChange = jest.fn();
    const user = (await import("@testing-library/user-event")).default;
    render(<StatusFilterBar active="ALL" counts={{}} onChange={onChange} />);

    await user.click(screen.getByRole("tab", { name: "Overdue" }));
    expect(onChange).toHaveBeenCalledWith("OVERDUE");
  });
});
