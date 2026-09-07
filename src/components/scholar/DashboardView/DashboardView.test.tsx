import { render, screen } from "@/test-utils";
import type { UseQueryResult } from "@tanstack/react-query";
import type { DashboardAnalytics } from "@/lib/types";

const mockAnalytics: DashboardAnalytics = {
  progress: {
    overall: 72,
    assignmentPct: 80,
    attendancePct: 55,
    assignmentWeight: 70,
    attendanceWeight: 30,
  },
  attendance: { rate: 85, target: 80 },
  upcomingMeeting: {
    id: "m1",
    title: "Weekly Standup",
    startsAt: "2026-09-05T10:00:00Z",
    endsAt: "2026-09-05T11:00:00Z",
    courseName: "Web Development",
    mentor: { id: "u1", name: "Amina Bello" },
  },
  activeTasks: [
    {
      id: "t1",
      title: "Build a REST API",
      courseName: "Web Development",
      dueAt: "2026-09-10T23:59:00Z",
      status: "IN_PROGRESS",
    },
    {
      id: "t2",
      title: "CSS Grid Layout",
      dueAt: "2026-09-08T12:00:00Z",
      status: "NOT_STARTED",
    },
  ],
  mentor: { id: "u1", name: "Amina Bello", title: "Senior Engineer" },
};

jest.mock("@/hooks/useDashboardAnalytics", () => ({
  useDashboardAnalytics: jest.fn(),
}));

jest.mock("@/hooks/useSocketEvents", () => ({
  useSocketEvents: jest.fn(),
}));

jest.mock("@/hooks/useConnectivity", () => ({
  useConnectivity: jest.fn(() => true),
}));

import { DashboardView } from "./DashboardView";
import { useDashboardAnalytics } from "@/hooks/useDashboardAnalytics";
import { useConnectivity } from "@/hooks/useConnectivity";

const mockUseDashboardAnalytics = useDashboardAnalytics as jest.MockedFunction<
  typeof useDashboardAnalytics
>;

function queryResult(
  overrides: Partial<UseQueryResult<DashboardAnalytics, Error>>
): UseQueryResult<DashboardAnalytics, Error> {
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
  } as UseQueryResult<DashboardAnalytics, Error>;
}

function renderDashboard() {
  return render(<DashboardView />);
}

describe("DashboardView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows skeleton while loading", () => {
    mockUseDashboardAnalytics.mockReturnValue(
      queryResult({ isLoading: true, isPending: true, data: undefined })
    );

    renderDashboard();

    const loader = screen.getByLabelText("Loading dashboard");
    expect(loader).toHaveAttribute("aria-busy", "true");
  });

  it("shows error state with retry button", async () => {
    const refetch = jest.fn();
    mockUseDashboardAnalytics.mockReturnValue(
      queryResult({
        error: new Error("Network error"),
        isError: true,
        status: "error",
        refetch,
      })
    );

    renderDashboard();

    expect(
      screen.getByText("Could not load dashboard")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Something went wrong. Please try again.")
    ).toBeInTheDocument();

    const retry = screen.getByRole("button", { name: "Try again" });
    retry.click();
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("shows empty state when data is null", () => {
    mockUseDashboardAnalytics.mockReturnValue(
      queryResult({ data: null as unknown as DashboardAnalytics })
    );

    renderDashboard();

    expect(screen.getByText("No dashboard data yet")).toBeInTheDocument();
  });

  it("renders dashboard cards with analytics data", () => {
    mockUseDashboardAnalytics.mockReturnValue(queryResult({ data: mockAnalytics }));

    renderDashboard();

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("72%")).toBeInTheDocument();
    expect(screen.getByText("85%")).toBeInTheDocument();
    expect(screen.getByText("Weekly Standup")).toBeInTheDocument();
    expect(screen.getByText("Amina Bello")).toBeInTheDocument();
    expect(screen.getByText("Build a REST API")).toBeInTheDocument();
    expect(screen.getByText("CSS Grid Layout")).toBeInTheDocument();
  });

  it("shows attendance warning when below target", () => {
    mockUseDashboardAnalytics.mockReturnValue(
      queryResult({
        data: { ...mockAnalytics, attendance: { rate: 65, target: 80 } },
      })
    );

    renderDashboard();

    expect(
      screen.getByText(
        /Your attendance is currently below the program target/
      )
    ).toBeInTheDocument();
  });

  it("shows offline banner when disconnected", () => {
    (useConnectivity as jest.Mock).mockReturnValue(false);
    mockUseDashboardAnalytics.mockReturnValue(queryResult({ data: mockAnalytics }));

    renderDashboard();

    expect(
      screen.getByText(/You're offline/)
    ).toBeInTheDocument();
  });

  it("does not show offline banner when connected", () => {
    (useConnectivity as jest.Mock).mockReturnValue(true);
    mockUseDashboardAnalytics.mockReturnValue(queryResult({ data: mockAnalytics }));

    renderDashboard();

    expect(screen.queryByText(/You're offline/)).not.toBeInTheDocument();
  });

  it("hides upcoming meeting card when no meeting scheduled", () => {
    mockUseDashboardAnalytics.mockReturnValue(
      queryResult({ data: { ...mockAnalytics, upcomingMeeting: null } })
    );

    renderDashboard();

    expect(screen.queryByText("Weekly Standup")).not.toBeInTheDocument();
  });

  it("hides mentor card when no mentor assigned", () => {
    mockUseDashboardAnalytics.mockReturnValue(
      queryResult({ data: { ...mockAnalytics, mentor: null } })
    );

    renderDashboard();

    expect(screen.queryByText("Amina Bello")).not.toBeInTheDocument();
  });

  it("shows empty active tasks message when no tasks", () => {
    mockUseDashboardAnalytics.mockReturnValue(
      queryResult({ data: { ...mockAnalytics, activeTasks: [] } })
    );

    renderDashboard();

    expect(
      screen.getByText("No active assignments right now.")
    ).toBeInTheDocument();
  });
});
