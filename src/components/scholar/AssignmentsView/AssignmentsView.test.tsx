import { render, screen, waitFor, within } from "@/test-utils";
import type { UseQueryResult } from "@tanstack/react-query";
import type { Assignment } from "@/lib/types";

const sampleAssignments: Assignment[] = [
  {
    id: "a1",
    title: "Build a REST API",
    description: "Create a small REST service.",
    courseName: "Web Development",
    dueAt: "2026-09-10T23:59:00Z",
    status: "IN_PROGRESS",
  },
  {
    id: "a2",
    title: "CSS Grid Layout",
    description: "Practice CSS grid.",
    courseName: "Web Development",
    dueAt: "2026-09-08T12:00:00Z",
    status: "NOT_STARTED",
  },
  {
    id: "a3",
    title: "Submit final project",
    description: "Submit your capstone.",
    courseName: "Capstone",
    dueAt: "2026-08-30T18:00:00Z",
    status: "PENDING_VERIFICATION",
    submission: { id: "s3", submittedAt: "2026-08-29T10:00:00Z" },
  },
  {
    id: "a4",
    title: "Deploy to Vercel",
    description: "Deploy your app.",
    courseName: "Web Development",
    dueAt: "2026-09-01T09:00:00Z",
    status: "VERIFIED",
    submission: { id: "s4", submittedAt: "2026-08-31T15:00:00Z" },
  },
  {
    id: "a5",
    title: "Old overdue task",
    description: "This one is late.",
    courseName: "Capstone",
    dueAt: "2026-07-01T09:00:00Z",
    status: "OVERDUE",
  },
];

jest.mock("next/navigation", () => ({
  useParams: jest.fn(() => ({})),
}));

jest.mock("@/hooks/useAssignments", () => ({
  useAssignments: jest.fn(),
  useSubmitAssignment: jest.fn(),
}));

jest.mock("@/hooks/useConnectivity", () => ({
  useConnectivity: jest.fn(() => true),
}));

jest.mock("@/hooks/useSocketEvents", () => ({
  useSocketEvents: jest.fn(),
}));

const { useAssignments, useSubmitAssignment } = jest.requireMock(
  "@/hooks/useAssignments"
);
const { useConnectivity } = jest.requireMock("@/hooks/useConnectivity");

function queryResult<T>(
  overrides: Partial<UseQueryResult<T, Error>>
): UseQueryResult<T, Error> {
  return {
    data: undefined,
    dataUpdatedAt: 0,
    error: null,
    errorUpdatedAt: 0,
    failureCount: 0,
    failureReason: null,
    errorUpdateCount: 0,
    isError: false,
    isFetched: true,
    isFetchedAfterMount: true,
    isFetching: false,
    isInitialLoading: false,
    isLoading: false,
    isLoadingError: false,
    isPaused: false,
    isPending: false,
    isPlaceholderData: false,
    isRefetchError: false,
    isRefetching: false,
    isStale: false,
    isSuccess: true,
    refetch: jest.fn(),
    status: "success",
    fetchStatus: "idle",
    ...overrides,
  } as UseQueryResult<T, Error>;
}

import { AssignmentsView } from "./AssignmentsView";

const mockSubmit = {
  mutateAsync: jest.fn(),
  isPending: false,
  isError: false,
};

beforeEach(() => {
  jest.clearAllMocks();
  useConnectivity.mockReturnValue(true);
  useSubmitAssignment.mockReturnValue(mockSubmit);
});

describe("AssignmentsView", () => {
  it("shows skeleton while loading", () => {
    useAssignments.mockReturnValue(
      queryResult({ isLoading: true, data: undefined })
    );

    render(<AssignmentsView />);
    expect(screen.getByLabelText("Loading assignments")).toBeInTheDocument();
  });

  it("shows error state with retry", () => {
    const refetch = jest.fn();
    useAssignments.mockReturnValue(
      queryResult({ isError: true, status: "error", refetch })
    );

    render(<AssignmentsView />);
    expect(
      screen.getByText("Could not load assignments")
    ).toBeInTheDocument();
  });

  it("shows true-empty state when no assignments", () => {
    useAssignments.mockReturnValue(queryResult({ data: [] }));

    render(<AssignmentsView />);
    expect(screen.getByText("No assignments yet")).toBeInTheDocument();
  });

  it("renders all assignments by default", () => {
    useAssignments.mockReturnValue(queryResult({ data: sampleAssignments }));

    render(<AssignmentsView />);
    expect(screen.getByText("Build a REST API")).toBeInTheDocument();
    expect(screen.getByText("CSS Grid Layout")).toBeInTheDocument();
    expect(screen.getByText("Submit final project")).toBeInTheDocument();
    expect(screen.getByText("Deploy to Vercel")).toBeInTheDocument();
    expect(screen.getByText("Old overdue task")).toBeInTheDocument();
  });

  it("filters by Pending", async () => {
    useAssignments.mockReturnValue(queryResult({ data: sampleAssignments }));

    render(<AssignmentsView />);
    const user = (await import("@testing-library/user-event")).default;
    await user.click(screen.getByRole("tab", { name: /Pending/ }));

    expect(screen.getByText("Build a REST API")).toBeInTheDocument();
    expect(screen.getByText("CSS Grid Layout")).toBeInTheDocument();
    expect(screen.queryByText("Submit final project")).not.toBeInTheDocument();
    expect(screen.queryByText("Deploy to Vercel")).not.toBeInTheDocument();
  });

  it("shows filtered-empty when no tasks match a filter", async () => {
    useAssignments.mockReturnValue(queryResult({ data: sampleAssignments }));

    render(<AssignmentsView />);
    const user = (await import("@testing-library/user-event")).default;
    await user.click(screen.getByRole("tab", { name: /Completed/ }));

    expect(
      screen.getByText("Deploy to Vercel")
    ).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /Overdue/ }));
    expect(screen.getByText("Old overdue task")).toBeInTheDocument();
  });

  it("shows offline banner when disconnected", () => {
    useConnectivity.mockReturnValue(false);
    useAssignments.mockReturnValue(queryResult({ data: sampleAssignments }));

    render(<AssignmentsView />);
    expect(
      screen.getByText(/You're offline/)
    ).toBeInTheDocument();
  });

  it("opens detail modal and submits Mark as Done", async () => {
    const mutateAsync = jest.fn().mockResolvedValue(undefined);
    useSubmitAssignment.mockReturnValue({ ...mockSubmit, mutateAsync });
    useAssignments.mockReturnValue(queryResult({ data: sampleAssignments }));

    const user = (await import("@testing-library/user-event")).default;
    render(<AssignmentsView />);

    await user.click(
      screen.getByRole("button", { name: "View Build a REST API" })
    );

    expect(
      screen.getByRole("dialog", { name: "Build a REST API" })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Mark as Done" }));
    expect(mutateAsync).toHaveBeenCalled();
  });

  it("shows offline alert inside detail modal and hides Mark as Done", async () => {
    useConnectivity.mockReturnValue(false);
    useAssignments.mockReturnValue(queryResult({ data: sampleAssignments }));

    const user = (await import("@testing-library/user-event")).default;
    render(<AssignmentsView />);

    await user.click(
      screen.getByRole("button", { name: "View Build a REST API" })
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(
      within(dialog).getByText(/You can't submit this assignment/)
    ).toBeInTheDocument();
    expect(
      within(dialog).queryByRole("button", { name: "Mark as Done" })
    ).not.toBeInTheDocument();
    await waitFor(() =>
      expect(
        within(dialog).queryByRole("button", { name: "Mark as Done" })
      ).not.toBeInTheDocument()
    );
  });

  it("disables Mark as Done for already-submitted status", async () => {
    useAssignments.mockReturnValue(queryResult({ data: sampleAssignments }));

    const user = (await import("@testing-library/user-event")).default;
    render(<AssignmentsView />);

    await user.click(
      screen.getByRole("button", { name: "View Submit final project" })
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Mark as Done" })
    ).not.toBeInTheDocument();
  });
});
