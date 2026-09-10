import { render, screen } from "@/test-utils";
import type { UseQueryResult } from "@tanstack/react-query";
import type { Program } from "@/lib/types";
import { ProgramsView } from "./ProgramsView";

jest.mock("@/hooks/usePrograms", () => ({
  usePrograms: jest.fn(),
  useCreateProgram: jest.fn(),
  useArchiveProgram: jest.fn(),
}));

jest.mock("@/hooks/useConnectivity", () => ({
  useConnectivity: jest.fn(() => true),
}));

const { usePrograms, useArchiveProgram } = jest.requireMock("@/hooks/usePrograms");
const { useConnectivity } = jest.requireMock("@/hooks/useConnectivity");

const samplePrograms: Program[] = [
  {
    id: "p1",
    name: "TMF Tech Scholarship",
    description: "Cohort 3",
    status: "ACTIVE",
    courseCount: 4,
    scholarCount: 12,
    startDate: "2026-01-15T00:00:00Z",
    endDate: undefined,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "p2",
    name: "Design Fellowship",
    description: undefined,
    status: "ARCHIVED",
    courseCount: 2,
    scholarCount: 0,
    startDate: undefined,
    endDate: undefined,
    createdAt: "2025-11-01T00:00:00Z",
  },
];

function queryResult<T>(overrides: Partial<UseQueryResult<T, Error>>): UseQueryResult<T, Error> {
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
    variables: undefined,
    reset: jest.fn(),
    ...overrides,
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  useConnectivity.mockReturnValue(true);
  usePrograms.mockReturnValue(queryResult<Program[]>({ data: samplePrograms }));
  useArchiveProgram.mockReturnValue(mutationResult());
});

describe("ProgramsView", () => {
  it("renders active and archived program badges", () => {
    render(<ProgramsView />);
    expect(screen.getByText("TMF Tech Scholarship")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Design Fellowship")).toBeInTheDocument();
    expect(screen.getAllByText("Archived").length).toBeGreaterThan(0);
  });

  it("shows archive action only for active programs", () => {
    render(<ProgramsView />);
    expect(screen.getAllByText("Archive").length).toBe(1);
  });

  it("shows error state with retry", () => {
    const refetch = jest.fn();
    usePrograms.mockReturnValue(
      queryResult<Program[]>({ isError: true, status: "error", refetch })
    );
    render(<ProgramsView />);
    expect(screen.getByText("Could not load programs")).toBeInTheDocument();
  });

  it("shows empty state when no programs", () => {
    usePrograms.mockReturnValue(queryResult<Program[]>({ data: [] }));
    render(<ProgramsView />);
    expect(screen.getByText("No programs yet")).toBeInTheDocument();
  });

  it("shows offline banner when disconnected", () => {
    useConnectivity.mockReturnValue(false);
    render(<ProgramsView />);
    expect(screen.getByText(/You're offline/)).toBeInTheDocument();
  });
});