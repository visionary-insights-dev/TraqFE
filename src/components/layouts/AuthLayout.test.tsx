// src/components/layouts/AuthLayout.test.tsx
import { render, screen } from "@/test-utils";
import { AuthLayout } from "./index";

describe("AuthLayout", () => {
  // Two-panel auth: a visual panel on the left and the form on the right.
  // The layout must render children (the form) and a visual panel.
  it("renders the form content", () => {
    render(
      <AuthLayout>
        <form aria-label="Sign in form">
          <input aria-label="Email" />
        </form>
      </AuthLayout>
    );
    expect(screen.getByRole("form", { name: "Sign in form" })).toBeInTheDocument();
  });

  it("renders a default visual panel when none is provided", () => {
    render(
      <AuthLayout>
        <p>Form</p>
      </AuthLayout>
    );
    expect(screen.getByText("Traq")).toBeInTheDocument();
  });

  it("renders a provided visual panel instead of the default", () => {
    render(
      <AuthLayout visual={<div>Brand illustration</div>}>
        <p>Form</p>
      </AuthLayout>
    );
    expect(screen.getByText("Brand illustration")).toBeInTheDocument();
    expect(screen.queryByText("Traq")).not.toBeInTheDocument();
  });

  it("renders its children", () => {
    render(
      <AuthLayout>
        <p>Sign in</p>
      </AuthLayout>
    );
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });
});
