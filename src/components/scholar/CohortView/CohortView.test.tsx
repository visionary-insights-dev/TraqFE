import { render, screen, userEvent } from "@/test-utils";
import type { UseQueryResult } from "@tanstack/react-query";
import type { Cohort, CohortMember } from "@/lib/types";

const members: CohortMember[] = [
  { id: "u1", name: "Amina Bello", role: "MENTOR" },
  { id: "u2", name: "Chidi Okafor", role: "SCHOLAR" },
  { id: "u3", name: "Fatima Musa", role: "SCHOLAR" },
];

const cohort: Cohort = {
  id: "c1",
  name: "TMF Tech Scholars — Cohort 3",
  members,
};

jest.mock("@/hooks/useCohort", () => ({
  useCohort: jest.fn(),
}));

jest.mock("@/hooks/useConnectivity", () => ({
  useConnectivity: jest.fn(() => true),
}));

import { CohortView } from "./CohortView";
import { useCohort } from "@/hooks/useCohort";
import { useConnectivity } from "@/hooks/useConnectivity";

const mockUseCohort = useCohort as jest.MockedFunction<typeof useCohort>;

function queryResult(
  overrides: Partial<UseQueryResult<Cohort, Error>>
): UseQueryResult<Cohort, Error> {
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
  } as UseQueryResult<Cohort, Error>;
}

function renderCohort() {
  return render(<CohortView />);
}

describe("CohortView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows skeleton while loading", () => {
    mockUseCohort.mockReturnValue(
      queryResult({ isLoading: true, isPending: true, data: undefined })
    );

    renderCohort();

    const loader = screen.getByLabelText("Loading cohort");
    expect(loader).toHaveAttribute("aria-busy", "true");
  });

  it("shows error state with retry button", () => {
    const refetch = jest.fn();
    mockUseCohort.mockReturnValue(
      queryResult({
        error: new Error("Network error"),
        isError: true,
        status: "error",
        refetch,
      })
    );

    renderCohort();

    expect(screen.getByText("Could not load your cohort")).toBeInTheDocument();
    const retry = screen.getByRole("button", { name: "Try again" });
    retry.click();
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("shows empty state when no cohort members", () => {
    mockUseCohort.mockReturnValue(
      queryResult({ data: { ...cohort, members: [] } })
    );

    renderCohort();

    expect(screen.getByText("No cohort yet")).toBeInTheDocument();
  });

  it("renders cohort name and member count", () => {
    mockUseCohort.mockReturnValue(queryResult({ data: cohort }));

    renderCohort();

    expect(screen.getByText("My Cohort")).toBeInTheDocument();
    expect(
      screen.getByText("TMF Tech Scholars — Cohort 3")
    ).toBeInTheDocument();
    expect(screen.getByText("3 members")).toBeInTheDocument();
  });

  it("groups mentors and scholars", () => {
    mockUseCohort.mockReturnValue(queryResult({ data: cohort }));

    renderCohort();

    expect(screen.getByText("Mentors")).toBeInTheDocument();
    expect(screen.getByText("Scholars")).toBeInTheDocument();
    expect(screen.getByText("Amina Bello")).toBeInTheDocument();
    expect(screen.getByText("Chidi Okafor")).toBeInTheDocument();
    expect(screen.getByText("Fatima Musa")).toBeInTheDocument();
    expect(screen.getByText("Mentor")).toBeInTheDocument();
  });

  it("searches members by name", async () => {
    mockUseCohort.mockReturnValue(queryResult({ data: cohort }));

    renderCohort();

    await userEvent.type(screen.getByLabelText("Search cohort members"), "fatima");

    expect(screen.getByText("Fatima Musa")).toBeInTheDocument();
    expect(screen.queryByText("Chidi Okafor")).not.toBeInTheDocument();
    expect(screen.queryByText("Amina Bello")).not.toBeInTheDocument();
  });

  it("shows no-results empty state and clears search", async () => {
    mockUseCohort.mockReturnValue(queryResult({ data: cohort }));

    renderCohort();

    await userEvent.type(screen.getByLabelText("Search cohort members"), "zzz");

    expect(screen.getByText("No matching members")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(screen.getByText("Chidi Okafor")).toBeInTheDocument();
  });

  it("shows offline banner when disconnected", () => {
    (useConnectivity as jest.Mock).mockReturnValue(false);
    mockUseCohort.mockReturnValue(queryResult({ data: cohort }));

    renderCohort();

    expect(screen.getByText(/You're offline/)).toBeInTheDocument();
  });

  it("does not show offline banner when connected", () => {
    (useConnectivity as jest.Mock).mockReturnValue(true);
    mockUseCohort.mockReturnValue(queryResult({ data: cohort }));

    renderCohort();

    expect(screen.queryByText(/You're offline/)).not.toBeInTheDocument();
  });
});
