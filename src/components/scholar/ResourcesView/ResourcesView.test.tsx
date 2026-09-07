import { render, screen, userEvent } from "@/test-utils";
import type { UseQueryResult } from "@tanstack/react-query";
import type { Resource } from "@/lib/types";

const resources: Resource[] = [
  {
    id: "r1",
    name: "React Hooks Guide",
    type: "PDF",
    courseName: "Web Development",
    uploadedAt: "2026-08-20T09:00:00Z",
    url: "https://cdn.example.com/react-hooks.pdf",
  },
  {
    id: "r2",
    name: "Figma Design System",
    type: "LINK",
    courseName: "UI Fundamentals",
    uploadedAt: "2026-08-18T12:00:00Z",
    url: "https://figma.com/design-system",
  },
  {
    id: "r3",
    name: "Intro to SQL video",
    type: "VIDEO",
    uploadedAt: "2026-08-15T10:00:00Z",
    url: "https://cdn.example.com/sql.mp4",
  },
];

jest.mock("@/hooks/useResources", () => ({
  useResources: jest.fn(),
}));

jest.mock("@/hooks/useConnectivity", () => ({
  useConnectivity: jest.fn(() => true),
}));

import { ResourcesView } from "./ResourcesView";
import { useResources } from "@/hooks/useResources";
import { useConnectivity } from "@/hooks/useConnectivity";

const mockUseResources = useResources as jest.MockedFunction<
  typeof useResources
>;

function queryResult(
  overrides: Partial<UseQueryResult<Resource[], Error>>
): UseQueryResult<Resource[], Error> {
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
  } as UseQueryResult<Resource[], Error>;
}

function renderResources() {
  return render(<ResourcesView />);
}

describe("ResourcesView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows skeleton while loading", () => {
    mockUseResources.mockReturnValue(
      queryResult({ isLoading: true, isPending: true, data: undefined })
    );

    renderResources();

    const loader = screen.getByLabelText("Loading resources");
    expect(loader).toHaveAttribute("aria-busy", "true");
  });

  it("shows error state with retry button", () => {
    const refetch = jest.fn();
    mockUseResources.mockReturnValue(
      queryResult({
        error: new Error("Network error"),
        isError: true,
        status: "error",
        refetch,
      })
    );

    renderResources();

    expect(screen.getByText("Could not load resources")).toBeInTheDocument();
    const retry = screen.getByRole("button", { name: "Try again" });
    retry.click();
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("shows empty state when no resources", () => {
    mockUseResources.mockReturnValue(queryResult({ data: [] }));

    renderResources();

    expect(screen.getByText("No resources yet")).toBeInTheDocument();
  });

  it("renders resource cards", () => {
    mockUseResources.mockReturnValue(queryResult({ data: resources }));

    renderResources();

    expect(screen.getByText("React Hooks Guide")).toBeInTheDocument();
    expect(screen.getByText("Figma Design System")).toBeInTheDocument();
    expect(screen.getByText("Intro to SQL video")).toBeInTheDocument();
  });

  it("filters by resource type", async () => {
    mockUseResources.mockReturnValue(queryResult({ data: resources }));

    renderResources();

    await userEvent.click(screen.getByRole("button", { name: "Videos" }));
    expect(screen.getByText("Intro to SQL video")).toBeInTheDocument();
    expect(screen.queryByText("React Hooks Guide")).not.toBeInTheDocument();
  });

  it("filters by search term", async () => {
    mockUseResources.mockReturnValue(queryResult({ data: resources }));

    renderResources();

    await userEvent.type(screen.getByLabelText("Search resources"), "react");

    expect(screen.getByText("React Hooks Guide")).toBeInTheDocument();
    expect(screen.queryByText("Figma Design System")).not.toBeInTheDocument();
  });

  it("shows no-results empty state with clear filters button", async () => {
    mockUseResources.mockReturnValue(queryResult({ data: resources }));

    renderResources();

    const search = screen.getByLabelText("Search resources");
    await userEvent.type(search, "zzz-no-match");

    expect(screen.getByText("No matching resources")).toBeInTheDocument();

    const clear = screen.getByRole("button", { name: "Clear filters" });
    await userEvent.click(clear);
    expect(screen.getByText("React Hooks Guide")).toBeInTheDocument();
  });

  it("shows offline banner when disconnected", () => {
    (useConnectivity as jest.Mock).mockReturnValue(false);
    mockUseResources.mockReturnValue(queryResult({ data: resources }));

    renderResources();

    expect(screen.getByText(/You're offline/)).toBeInTheDocument();
  });

  it("does not show offline banner when connected", () => {
    (useConnectivity as jest.Mock).mockReturnValue(true);
    mockUseResources.mockReturnValue(queryResult({ data: resources }));

    renderResources();

    expect(screen.queryByText(/You're offline/)).not.toBeInTheDocument();
  });
});
