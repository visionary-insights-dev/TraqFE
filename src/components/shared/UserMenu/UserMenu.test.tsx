// src/components/shared/UserMenu/UserMenu.test.tsx
import { render, screen, userEvent } from "@/test-utils";
import { clearAuth, setUser } from "@/stores/auth";
import { UserMenu } from "./index";

const mockLogoutMutate = jest.fn();

jest.mock("@/hooks/auth", () => ({
  useLogout: () => ({
    mutate: mockLogoutMutate,
    isPending: false,
  }),
}));

describe("UserMenu", () => {
  beforeEach(() => {
    clearAuth();
    setUser({
      id: "usr-admin-01",
      email: "admin@scholarlink.dev",
      name: "Admin User",
      role: "SUPER_ADMIN",
      organizationId: "org-tmf-001",
      profileComplete: true,
    });
  });

  afterEach(() => {
    clearAuth();
    mockLogoutMutate.mockClear();
  });

  it("renders the signed-in user's name and role", () => {
    render(<UserMenu />);
    expect(screen.getByText("Admin User")).toBeInTheDocument();
    expect(screen.getByText("Super Admin")).toBeInTheDocument();
  });

  it("opens the account menu, including the Log out action", async () => {
    render(<UserMenu />);
    await userEvent.click(
      screen.getByRole("button", { name: /Open account menu/ })
    );
    expect(
      screen.getByRole("menuitem", { name: /Log out/ })
    ).toBeInTheDocument();
  });

  it("triggers logout when Log out is clicked", async () => {
    render(<UserMenu />);
    await userEvent.click(
      screen.getByRole("button", { name: /Open account menu/ })
    );
    await userEvent.click(screen.getByRole("menuitem", { name: /Log out/ }));
    expect(mockLogoutMutate).toHaveBeenCalledTimes(1);
  });
});