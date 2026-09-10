import { render, screen } from "@/test-utils";
import userEvent from "@testing-library/user-event";
import { DataTable } from "./DataTable";
import type { DataTableColumn } from "./types";

interface Row {
  id: string;
  name: string;
  score: number;
}

const rows: Row[] = [
  { id: "1", name: "Bola", score: 80 },
  { id: "2", name: "Ada", score: 45 },
  { id: "3", name: "Zainab", score: 92 },
];

const columns: Array<DataTableColumn<Row>> = [
  { key: "name", header: "Name", sortValue: (r) => r.name, render: (r) => r.name },
  { key: "score", header: "Score", sortValue: (r) => r.score, render: (r) => r.score },
];

describe("DataTable", () => {
  it("renders rows and a visually-hidden caption", () => {
    render(<DataTable rows={rows} rowKey={(r) => r.id} columns={columns} caption="Scholars" />);
    expect(screen.getByText("Bola")).toBeInTheDocument();
    expect(screen.getByText("Zainab")).toBeInTheDocument();
    expect(screen.getByText("Scholars")).toBeInTheDocument();
  });

  it("sorts ascending then descending on header click", async () => {
    const user = userEvent.setup();
    render(<DataTable rows={rows} rowKey={(r) => r.id} columns={columns} caption="Rows" />);

    await user.click(screen.getByRole("button", { name: "Sort by Name" }));
    const cellsAsc = screen.getAllByRole("cell");
    expect(cellsAsc[0]).toHaveTextContent("Ada");

    await user.click(screen.getByRole("button", { name: "Sort by Name" }));
    const cellsDesc = screen.getAllByRole("cell");
    expect(cellsDesc[0]).toHaveTextContent("Zainab");
  });

  it("shows the empty state when no rows", () => {
    render(
      <DataTable
        rows={[]}
        rowKey={(r) => r.id}
        columns={columns}
        caption="Rows"
        emptyTitle="Nothing here"
        emptyDescription="Add some data."
      />
    );
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
    expect(screen.getByText("Add some data.")).toBeInTheDocument();
  });

  it("renders a skeleton state while loading", () => {
    render(
      <DataTable
        rows={[]}
        rowKey={(r) => r.id}
        columns={columns}
        caption="Rows"
        isLoading
        skeletonRowCount={2}
      />
    );
    const tableRows = screen.getAllByRole("row");
    expect(tableRows.length).toBe(3);
  });
});