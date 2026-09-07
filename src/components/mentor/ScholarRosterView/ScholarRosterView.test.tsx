import { render, screen } from "@/test-utils";
import type { UseQueryResult } from "@tanstack/react-query";
import type { MentorScholar } from "@/lib/types";

jest.mock("@/hooks/useMentorScholars", () => ({
  useMentorScholars: jest.fn(),
}));

jest.mock("@/hooks/useConnectivity", () => ({
  useConnectivity: jest.fn(() => true),
}));

jest.mock("@/hooks/useSocketEvents", () => ({
  useSocketEvents: jest.fn(),
}));

const { useMentorScholars } = jest.requireMock("@/hooks/useMentorScholars");
const { useConnectivity } = jest.requireMock("@/hooks/useConnectivity");

const sampleScholars: MentorScholar[] = [
  {
    id: "s1",
    name: "Ada Lovelace",
    courseName: "Web Development",
    progress: { overall: 82, assignmentPct: 88, attendancePct: 72 },
    atRisk: false,
  },
  {
    id: "s2",
    name: "Grace Hopper",
    courseName: "Data Science",
    progress: { overall: 45, assignmentPct: 50, attendancePct: 30 },
    atRisk: true,
  },
];

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

import { ScholarRosterView } from "./ScholarRosterView";

beforeEach(() => {
  jest.clearAllMocks();
  useConnectivity.mockReturnValue(true);
});

describe("ScholarRosterView", () => {
  it("shows skeleton while loading", () => {
    useMentorScholars.mockReturnValue(
      queryResult({ isLoading: true, data: undefined })
    );
    render(<ScholarRosterView />);
    expect(screen.getByLabelText("Loading scholars")).toBeInTheDocument();
  });

  it("shows error state with retry", () => {
    const refetch = jest.fn();
    useMentorScholars.mockReturnValue(
      queryResult({ isError: true, status: "error", refetch })
    );
    render(<ScholarRosterView />);
    expect(
      screen.getByText("Could not load your scholars")
    ).toBeInTheDocument();
  });

  it("shows true-empty state", () => {
    useMentorScholars.mockReturnValue(queryResult({ data: [] }));
    render(<ScholarRosterView />);
    expect(screen.getByText("No scholars assigned")).toBeInTheDocument();
  });

  it("renders scholars and their progress", () => {
    useMentorScholars.mockReturnValue(queryResult({ data: sampleScholars }));
    render(<ScholarRosterView />);
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("Grace Hopper")).toBeInTheDocument();
    expect(screen.getAllByText("At risk").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Overall progress/).length).toBe(2);
  });

  it("filters by search query", async () => {
    useMentorScholars.mockReturnValue(queryResult({ data: sampleScholars }));
    render(<ScholarRosterView />);
    const user = (await import("@testing-library/user-event")).default;
    await user.type(screen.getByLabelText("Search scholars"), "Ada");
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.queryByText("Grace Hopper")).not.toBeInTheDocument();
  });

  it("shows offline banner when disconnected", () => {
    useConnectivity.mockReturnValue(false);
    useMentorScholars.mockReturnValue(queryResult({ data: sampleScholars }));
    render(<ScholarRosterView />);
    expect(screen.getByText(/You're offline/)).toBeInTheDocument();
  });
});
