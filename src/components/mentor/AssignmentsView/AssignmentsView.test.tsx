import { render, screen } from "@/test-utils";
import type { UseQueryResult } from "@tanstack/react-query";
import type { MentorAssignment } from "@/lib/types";

jest.mock("@/hooks/useMentorAssignments", () => ({
  useMentorAssignments: jest.fn(),
  useCreateAssignment: jest.fn(),
  usePublishAssignment: jest.fn(),
  useRequestChange: jest.fn(),
}));

jest.mock("@/hooks/useMeetings", () => ({
  useMentorCourses: jest.fn(),
}));

jest.mock("@/hooks/useConnectivity", () => ({
  useConnectivity: jest.fn(() => true),
}));

jest.mock("@/hooks/useSocketEvents", () => ({
  useSocketEvents: jest.fn(),
}));

const {
  useMentorAssignments,
  useCreateAssignment,
  usePublishAssignment,
  useRequestChange,
} = jest.requireMock("@/hooks/useMentorAssignments");
const { useMentorCourses } = jest.requireMock("@/hooks/useMeetings");
const { useConnectivity } = jest.requireMock("@/hooks/useConnectivity");

const sampleAssignments: MentorAssignment[] = [
  {
    id: "a1",
    title: "Build a REST API",
    description: "Create a REST service.",
    courseName: "Web Development",
    dueAt: "2026-09-10T23:59:00Z",
    status: "IN_PROGRESS",
    published: true,
    publishedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "a2",
    title: "Deploy to Vercel",
    description: "Deploy your app.",
    courseName: "Web Development",
    dueAt: "2026-09-01T09:00:00Z",
    status: "VERIFIED",
    published: false,
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

function mutationResult(overrides: Record<string, unknown> = {}) {
  return {
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
    isPending: false,
    isError: false,
    ...overrides,
  };
}

import { AssignmentsView } from "./AssignmentsView";

beforeEach(() => {
  jest.clearAllMocks();
  useConnectivity.mockReturnValue(true);
  useMentorCourses.mockReturnValue(queryResult({ data: [] }));
  useCreateAssignment.mockReturnValue(mutationResult());
  usePublishAssignment.mockReturnValue(mutationResult());
  useRequestChange.mockReturnValue(mutationResult());
});

describe("AssignmentsView", () => {
  it("shows skeleton while loading", () => {
    useMentorAssignments.mockReturnValue(
      queryResult({ isLoading: true, data: undefined })
    );
    render(<AssignmentsView />);
    expect(screen.getByLabelText("Loading assignments")).toBeInTheDocument();
  });

  it("shows error state with retry", () => {
    const refetch = jest.fn();
    useMentorAssignments.mockReturnValue(
      queryResult({ isError: true, status: "error", refetch })
    );
    render(<AssignmentsView />);
    expect(
      screen.getByText("Could not load assignments")
    ).toBeInTheDocument();
  });

  it("shows true-empty state", () => {
    useMentorAssignments.mockReturnValue(queryResult({ data: [] }));
    render(<AssignmentsView />);
    expect(screen.getByText("No assignments yet")).toBeInTheDocument();
  });

  it("renders assignments with publish/edit state", () => {
    useMentorAssignments.mockReturnValue(
      queryResult({ data: sampleAssignments })
    );
    render(<AssignmentsView />);
    expect(screen.getByText("Build a REST API")).toBeInTheDocument();
    expect(screen.getByText(/Edit window:/)).toBeInTheDocument();
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it("shows Request Change after edit window closes", () => {
    useMentorAssignments.mockReturnValue(
      queryResult({
        data: [
          {
            ...sampleAssignments[0],
            publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          },
        ],
      })
    );
    render(<AssignmentsView />);
    expect(screen.getByText("Request Change")).toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  });

  it("shows offline banner when disconnected", () => {
    useConnectivity.mockReturnValue(false);
    useMentorAssignments.mockReturnValue(
      queryResult({ data: sampleAssignments })
    );
    render(<AssignmentsView />);
    expect(screen.getByText(/You're offline/)).toBeInTheDocument();
  });
});
