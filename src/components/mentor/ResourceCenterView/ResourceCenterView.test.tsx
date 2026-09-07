import { render, screen } from "@/test-utils";
import type { UseQueryResult } from "@tanstack/react-query";
import type { Resource } from "@/lib/types";

jest.mock("@/hooks/useResources", () => ({
  useResources: jest.fn(),
}));

const { useResources } = jest.requireMock("@/hooks/useResources");

jest.mock("@/hooks/useMeetings", () => ({
  useMentorCourses: jest.fn(),
}));

const { useMentorCourses } = jest.requireMock("@/hooks/useMeetings");

jest.mock("@/hooks/useMentorResources", () => ({
  useUploadResource: jest.fn(),
}));

const { useUploadResource } = jest.requireMock("@/hooks/useMentorResources");

jest.mock("@/hooks/useConnectivity", () => ({
  useConnectivity: jest.fn(() => true),
}));

const { useConnectivity } = jest.requireMock("@/hooks/useConnectivity");

const sampleResources: Resource[] = [
  {
    id: "r1",
    name: "Intro to APIs",
    type: "PDF",
    courseName: "Web Development",
    uploadedAt: "2026-09-01T10:00:00Z",
    url: "https://example.com/api.pdf",
  },
  {
    id: "r2",
    name: "CSS Grid Guide",
    type: "LINK",
    courseName: "Web Development",
    uploadedAt: "2026-09-02T10:00:00Z",
    url: "https://example.com/grid",
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

import { ResourceCenterView } from "./ResourceCenterView";

beforeEach(() => {
  jest.clearAllMocks();
  useConnectivity.mockReturnValue(true);
  useMentorCourses.mockReturnValue(queryResult({ data: [] }));
  useUploadResource.mockReturnValue(mutationResult());
});

describe("ResourceCenterView", () => {
  it("shows skeleton while loading", () => {
    useResources.mockReturnValue(queryResult({ isLoading: true, data: undefined }));
    render(<ResourceCenterView />);
    expect(screen.getByLabelText("Loading resources")).toBeInTheDocument();
  });

  it("shows error state with retry", () => {
    const refetch = jest.fn();
    useResources.mockReturnValue(queryResult({ isError: true, status: "error", refetch }));
    render(<ResourceCenterView />);
    expect(screen.getByText("Could not load resources")).toBeInTheDocument();
  });

  it("shows true-empty state", () => {
    useResources.mockReturnValue(queryResult({ data: [] }));
    render(<ResourceCenterView />);
    expect(screen.getByText("No resources yet")).toBeInTheDocument();
  });

  it("renders resources", () => {
    useResources.mockReturnValue(queryResult({ data: sampleResources }));
    render(<ResourceCenterView />);
    expect(screen.getByText("Intro to APIs")).toBeInTheDocument();
    expect(screen.getByText("CSS Grid Guide")).toBeInTheDocument();
  });

  it("filters resources by type", async () => {
    useResources.mockReturnValue(queryResult({ data: sampleResources }));
    render(<ResourceCenterView />);
    const user = (await import("@testing-library/user-event")).default;
    await user.click(screen.getByRole("button", { name: "Links" }));
    expect(screen.getByText("CSS Grid Guide")).toBeInTheDocument();
    expect(screen.queryByText("Intro to APIs")).not.toBeInTheDocument();
  });

  it("shows offline banner when disconnected", () => {
    useConnectivity.mockReturnValue(false);
    useResources.mockReturnValue(queryResult({ data: sampleResources }));
    render(<ResourceCenterView />);
    expect(screen.getByText(/You're offline/)).toBeInTheDocument();
  });
});
