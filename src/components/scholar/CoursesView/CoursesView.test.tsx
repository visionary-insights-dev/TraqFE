import { render, screen } from "@/test-utils";
import type { UseQueryResult } from "@tanstack/react-query";
import type { Course, ScholarTask } from "@/lib/types";

const task: ScholarTask = {
  id: "task1",
  title: "Build a REST API",
  dueAt: "2026-09-10T23:59:00Z",
  status: "IN_PROGRESS",
};

const courseA: Course = {
  id: "c1",
  name: "Web Development",
  program: { id: "p1", name: "TMF Tech Scholars" },
  mentor: { id: "u1", name: "Amina Bello" },
  progress: {
    assignmentsCompleted: 8,
    assignmentsTotal: 10,
    assignmentPct: 80,
    attendancePct: 55,
    overall: 72,
  },
  recentTasks: [task],
};

const courseNoMentor: Course = {
  id: "c2",
  name: "Data Analytics",
  program: { id: "p1", name: "TMF Tech Scholars" },
  mentor: null,
  progress: {
    assignmentsCompleted: 0,
    assignmentsTotal: 5,
    assignmentPct: 0,
    attendancePct: 100,
    overall: 30,
  },
  recentTasks: [],
};

jest.mock("@/hooks/useCourses", () => ({
  useCourses: jest.fn(),
}));

jest.mock("@/hooks/useSocketEvents", () => ({
  useSocketEvents: jest.fn(),
}));

jest.mock("@/hooks/useConnectivity", () => ({
  useConnectivity: jest.fn(() => true),
}));

import { CoursesView } from "./CoursesView";
import { useCourses } from "@/hooks/useCourses";
import { useConnectivity } from "@/hooks/useConnectivity";

const mockUseCourses = useCourses as jest.MockedFunction<typeof useCourses>;

function queryResult(
  overrides: Partial<UseQueryResult<Course[], Error>>
): UseQueryResult<Course[], Error> {
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
  } as UseQueryResult<Course[], Error>;
}

function renderCourses() {
  return render(<CoursesView />);
}

describe("CoursesView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows skeleton while loading", () => {
    mockUseCourses.mockReturnValue(
      queryResult({ isLoading: true, isPending: true, data: undefined })
    );

    renderCourses();

    const loader = screen.getByLabelText("Loading courses");
    expect(loader).toHaveAttribute("aria-busy", "true");
  });

  it("shows error state with retry button", async () => {
    const refetch = jest.fn();
    mockUseCourses.mockReturnValue(
      queryResult({
        error: new Error("Network error"),
        isError: true,
        status: "error",
        refetch,
      })
    );

    renderCourses();

    expect(screen.getByText("Could not load courses")).toBeInTheDocument();

    const retry = screen.getByRole("button", { name: "Try again" });
    retry.click();
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("shows empty state when no courses", () => {
    mockUseCourses.mockReturnValue(queryResult({ data: [] }));

    renderCourses();

    expect(screen.getByText("No courses yet")).toBeInTheDocument();
  });

  it("renders course cards with progress and mentor", () => {
    mockUseCourses.mockReturnValue(queryResult({ data: [courseA] }));

    renderCourses();

    expect(screen.getByText("Courses & Progress")).toBeInTheDocument();
    expect(screen.getByText("Web Development")).toBeInTheDocument();
    expect(screen.getByText("TMF Tech Scholars")).toBeInTheDocument();
    expect(screen.getByText("72%")).toBeInTheDocument();
    expect(screen.getByText(/80%/)).toBeInTheDocument();
    expect(screen.getByText(/55%/)).toBeInTheDocument();
    expect(screen.getByText("Amina Bello")).toBeInTheDocument();
  });

  it("shows recent tasks on a course", () => {
    mockUseCourses.mockReturnValue(queryResult({ data: [courseA] }));

    renderCourses();

    expect(screen.getByText("Recent tasks")).toBeInTheDocument();
    expect(screen.getByText("Build a REST API")).toBeInTheDocument();
  });

  it("hides mentor row when no mentor assigned", () => {
    mockUseCourses.mockReturnValue(
      queryResult({ data: [courseNoMentor] })
    );

    renderCourses();

    expect(screen.queryByText("Amina Bello")).not.toBeInTheDocument();
    expect(screen.queryByText("Recent tasks")).not.toBeInTheDocument();
  });

  it("shows offline banner when disconnected", () => {
    (useConnectivity as jest.Mock).mockReturnValue(false);
    mockUseCourses.mockReturnValue(queryResult({ data: [courseA] }));

    renderCourses();

    expect(screen.getByText(/You're offline/)).toBeInTheDocument();
  });

  it("does not show offline banner when connected", () => {
    (useConnectivity as jest.Mock).mockReturnValue(true);
    mockUseCourses.mockReturnValue(queryResult({ data: [courseA] }));

    renderCourses();

    expect(screen.queryByText(/You're offline/)).not.toBeInTheDocument();
  });

  it("renders multiple courses in the list", () => {
    mockUseCourses.mockReturnValue(
      queryResult({ data: [courseA, courseNoMentor] })
    );

    renderCourses();

    expect(screen.getByText("Web Development")).toBeInTheDocument();
    expect(screen.getByText("Data Analytics")).toBeInTheDocument();
  });
});
