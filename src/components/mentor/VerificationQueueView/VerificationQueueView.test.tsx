import { render, screen } from "@/test-utils";
import type { UseQueryResult } from "@tanstack/react-query";
import type { VerificationItem } from "@/lib/types";

jest.mock("@/hooks/useVerificationQueue", () => ({
  useVerificationQueue: jest.fn(),
  useVerifySubmission: jest.fn(),
  useRequestResubmission: jest.fn(),
}));

jest.mock("@/hooks/useConnectivity", () => ({
  useConnectivity: jest.fn(() => true),
}));

jest.mock("@/hooks/useSocketEvents", () => ({
  useSocketEvents: jest.fn(),
}));

const { useVerificationQueue, useVerifySubmission, useRequestResubmission } =
  jest.requireMock("@/hooks/useVerificationQueue");
const { useConnectivity } = jest.requireMock("@/hooks/useConnectivity");

const sampleQueue: VerificationItem[] = [
  {
    id: "v1",
    assignmentId: "a1",
    assignmentTitle: "Build a REST API",
    scholarId: "s1",
    scholarName: "Ada Lovelace",
    courseName: "Web Development",
    submittedAt: "2026-09-01T10:00:00Z",
    status: "PENDING_VERIFICATION",
    late: false,
  },
  {
    id: "v2",
    assignmentId: "a2",
    assignmentTitle: "Deploy to Vercel",
    scholarId: "s2",
    scholarName: "Grace Hopper",
    submittedAt: "2026-09-02T10:00:00Z",
    status: "PENDING_VERIFICATION",
    late: true,
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
    variables: undefined,
    ...overrides,
  };
}

import { VerificationQueueView } from "./VerificationQueueView";

beforeEach(() => {
  jest.clearAllMocks();
  useConnectivity.mockReturnValue(true);
  useVerifySubmission.mockReturnValue(mutationResult());
  useRequestResubmission.mockReturnValue(mutationResult());
});

describe("VerificationQueueView", () => {
  it("shows skeleton while loading", () => {
    useVerificationQueue.mockReturnValue(
      queryResult({ isLoading: true, data: undefined })
    );
    render(<VerificationQueueView />);
    expect(
      screen.getByLabelText("Loading verification queue")
    ).toBeInTheDocument();
  });

  it("shows error state with retry", () => {
    const refetch = jest.fn();
    useVerificationQueue.mockReturnValue(
      queryResult({ isError: true, status: "error", refetch })
    );
    render(<VerificationQueueView />);
    expect(
      screen.getByText("Could not load the verification queue")
    ).toBeInTheDocument();
  });

  it("shows clear queue empty state", () => {
    useVerificationQueue.mockReturnValue(queryResult({ data: [] }));
    render(<VerificationQueueView />);
    expect(screen.getByText("Queue is clear")).toBeInTheDocument();
  });

  it("renders queue items with verify and request buttons", () => {
    useVerificationQueue.mockReturnValue(queryResult({ data: sampleQueue }));
    render(<VerificationQueueView />);
    expect(screen.getByText("Build a REST API")).toBeInTheDocument();
    expect(screen.getByText("Grace Hopper")).toBeInTheDocument();
    expect(screen.getAllByText("Verify").length).toBe(2);
    expect(screen.getAllByText("Request Resubmission").length).toBe(2);
  });

  it("calls verify mutation on verify click", async () => {
    const mutate = jest.fn();
    useVerifySubmission.mockReturnValue(mutationResult({ mutate }));
    useVerificationQueue.mockReturnValue(queryResult({ data: sampleQueue }));
    render(<VerificationQueueView />);
    const user = (await import("@testing-library/user-event")).default;
    await user.click(screen.getAllByText("Verify")[0]);
    expect(mutate).toHaveBeenCalledWith({ submissionId: "v1" });
  });

  it("shows offline banner when disconnected", () => {
    useConnectivity.mockReturnValue(false);
    useVerificationQueue.mockReturnValue(queryResult({ data: sampleQueue }));
    render(<VerificationQueueView />);
    expect(screen.getByText(/You're offline/)).toBeInTheDocument();
  });
});
