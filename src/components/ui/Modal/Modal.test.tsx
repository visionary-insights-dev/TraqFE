// src/components/ui/Modal/Modal.test.tsx
import { render, screen, userEvent } from "@/test-utils";
import { Modal } from "./index";

describe("Modal", () => {
  it("renders nothing when closed", () => {
    render(<Modal open={false} onClose={jest.fn()} title="Confirm" />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  // Modal is a proper dialog: announced with a title and described by any
  // description, and focuses the user in a modal context.
  it("renders a labelled dialog with title and description when open", () => {
    render(
      <Modal
        open
        onClose={jest.fn()}
        title="Remove scholar?"
        description="This action preserves historical data."
      />
    );

    const dialog = screen.getByRole("dialog", { name: "Remove scholar?" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByText("This action preserves historical data.")).toBeInTheDocument();
  });

  // Escape is the standard keyboard affordance for dismissing a modal and must
  // call onClose — reaching for a mouse is not acceptable for dialogs.
  it("closes when Escape is pressed", async () => {
    const onClose = jest.fn();
    render(<Modal open onClose={onClose} title="Confirm" />);

    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes via the explicit close button", async () => {
    const onClose = jest.fn();
    render(<Modal open onClose={onClose} title="Confirm" />);

    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // Closes when the backdrop is clicked; the backdrop is decorative.
  it("closes when the backdrop is clicked", async () => {
    const onClose = jest.fn();
    render(<Modal open onClose={onClose} title="Confirm" />);

    await userEvent.click(document.querySelector("[aria-hidden='true']")!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders footer actions and body content", () => {
    render(
      <Modal
        open
        onClose={jest.fn()}
        title="Confirm"
        footer={<button>Archive</button>}
      >
        <p>Body text</p>
      </Modal>
    );
    expect(screen.getByText("Body text")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Archive" })).toBeInTheDocument();
  });
});
