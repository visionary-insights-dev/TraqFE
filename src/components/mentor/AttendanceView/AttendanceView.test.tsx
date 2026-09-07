import { render, screen } from "@/test-utils";
import type { UseQueryResult } from "@tanstack/react-query";
import type { Meeting, MentorScholar } from "@/lib/types";

jest.mock("@/hooks/useMeetings", () => ({
  useMeetings: jest.fn(),
  useMentorCourses: jest.fn(),
  useCreateMeeting: jest.fn(),
  useSaveAttendance: jest.fn(),
}));

const { useMeetings, useMentorCourses, useCreateMeeting, useSaveAttendance } =
  jest.requireMock("@/hooks/useMeetings");

jest.mock("@/hooks/useMentorScholars", () => ({
  useMentorScholars: jest.fn(),
}));

const { useMentorScholars } = jest.requireMock("@/hooks/useMentorScholars");

jest.mock("@/hooks/useConnectivity", () => ({
  useConnectivity: jest.fn(() => true),
}));

const { useConnectivity } = jest.requireMock("@/hooks/useConnectivity");

jest.mock("@/hooks/useSocketEvents", () => ({
  useSocketEvents: jest.fn(),
}));

const sampleMeetings: Meeting[] = [
  {
    id: "m1",
    title: "Weekly standup",
    startsAt: "2026-09-08T09:00:00Z",
    courseName: "Web Development",
  },
];

const sampleScholars: MentorScholar[] = [
  {
    id: "s1",
    name: "Ada Lovelace",
    courseName: "Web Development",
    progress: { overall: 82, assignmentPct: 88, attendancePct: 72 },
    atRisk: false,
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

import { AttendanceView } from "./AttendanceView";

beforeEach(() => {
  jest.clearAllMocks();
  useConnectivity.mockReturnValue(true);
  useMentorCourses.mockReturnValue(queryResult({ data: [] }));
  useMentorScholars.mockReturnValue(queryResult({ data: sampleScholars }));
  useCreateMeeting.mockReturnValue(mutationResult());
  useSaveAttendance.mockReturnValue(mutationResult());
});

describe("AttendanceView", () => {
  it("shows skeleton while loading", () => {
    useMeetings.mockReturnValue(queryResult({ isLoading: true, data: undefined }));
    render(<AttendanceView />);
    expect(screen.getByLabelText("Loading meetings")).toBeInTheDocument();
  });

  it("shows error state with retry", () => {
    const refetch = jest.fn();
    useMeetings.mockReturnValue(queryResult({ isError: true, status: "error", refetch }));
    render(<AttendanceView />);
    expect(screen.getByText("Could not load meetings")).toBeInTheDocument();
  });

  it("shows true-empty state", () => {
    useMeetings.mockReturnValue(queryResult({ data: [] }));
    render(<AttendanceView />);
    expect(screen.getByText("No meetings yet")).toBeInTheDocument();
  });

  it("renders meetings", () => {
    useMeetings.mockReturnValue(queryResult({ data: sampleMeetings }));
    render(<AttendanceView />);
    expect(screen.getByText("Weekly standup")).toBeInTheDocument();
  });

  it("opens attendance roster and marks a scholar present", async () => {
    const mutateAsync = jest.fn().mockResolvedValue(undefined);
    useSaveAttendance.mockReturnValue(mutationResult({ mutateAsync }));
    useMeetings.mockReturnValue(queryResult({ data: sampleMeetings }));
    render(<AttendanceView />);
    const user = (await import("@testing-library/user-event")).default;

    await user.click(screen.getByRole("button", { name: "Mark Attendance" }));
    expect(screen.getByRole("dialog", { name: "Attendance Roster" })).toBeInTheDocument();
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Present" }));
    await user.click(screen.getByRole("button", { name: "Save Attendance" }));
    expect(mutateAsync).toHaveBeenCalled();
  });

  it("shows offline banner when disconnected", () => {
    useConnectivity.mockReturnValue(false);
    useMeetings.mockReturnValue(queryResult({ data: sampleMeetings }));
    render(<AttendanceView />);
    expect(screen.getByText(/You're offline/)).toBeInTheDocument();
  });
});
