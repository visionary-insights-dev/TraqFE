import { render, screen } from "@/test-utils";
import type { UseQueryResult } from "@tanstack/react-query";
import type { MentorProfile } from "@/lib/types";

jest.mock("@/hooks/useMentorProfile", () => ({
  useMentorProfile: jest.fn(),
  useUpdateMentorProfile: jest.fn(),
}));

const { useMentorProfile, useUpdateMentorProfile } =
  jest.requireMock("@/hooks/useMentorProfile");

jest.mock("@/hooks/useConnectivity", () => ({
  useConnectivity: jest.fn(() => true),
}));

const { useConnectivity } = jest.requireMock("@/hooks/useConnectivity");

const sampleProfile: MentorProfile = {
  id: "m1",
  name: "Grace Hopper",
  email: "grace@example.com",
  phone: "+2348000000000",
  title: "Senior Mentor",
  role: "MENTOR",
  notificationPreferences: {
    assignmentReminders: true,
    attendanceAlerts: true,
    meetingReminders: true,
    messages: true,
  },
};

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

import { MentorProfileView } from "./MentorProfileView";

beforeEach(() => {
  jest.clearAllMocks();
  useConnectivity.mockReturnValue(true);
  useUpdateMentorProfile.mockReturnValue(mutationResult());
});

describe("MentorProfileView", () => {
  it("shows spinner while loading", () => {
    useMentorProfile.mockReturnValue(
      queryResult({ isLoading: true, data: undefined })
    );
    render(<MentorProfileView />);
    expect(screen.getByText("Loading your profile")).toBeInTheDocument();
  });

  it("shows error state with retry", () => {
    const refetch = jest.fn();
    useMentorProfile.mockReturnValue(
      queryResult({ isError: true, status: "error", refetch })
    );
    render(<MentorProfileView />);
    expect(
      screen.getByText("Couldn't load your profile")
    ).toBeInTheDocument();
  });

  it("renders profile sections", () => {
    useMentorProfile.mockReturnValue(queryResult({ data: sampleProfile }));
    render(<MentorProfileView />);
    expect(screen.getByText("Personal Information")).toBeInTheDocument();
    expect(
      screen.getByText("Notification Preferences")
    ).toBeInTheDocument();
    expect(screen.getByText("Account & Security")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveValue("grace@example.com");
  });

  it("saves personal info changes", async () => {
    const mutate = jest.fn();
    useUpdateMentorProfile.mockReturnValue(
      mutationResult({
        mutate,
        mutateAsync: jest.fn().mockResolvedValue(sampleProfile),
      })
    );
    useMentorProfile.mockReturnValue(queryResult({ data: sampleProfile }));
    render(<MentorProfileView />);
    const user = (await import("@testing-library/user-event")).default;

    const nameInput = screen.getByLabelText("Full name");
    await user.clear(nameInput);
    await user.type(nameInput, "Grace B. Hopper");
    await user.click(screen.getByRole("button", { name: "Save changes" }));
    expect(mutate).toHaveBeenCalled();
  });

  it("toggles a notification preference", async () => {
    const mutate = jest.fn();
    useUpdateMentorProfile.mockReturnValue(mutationResult({ mutate }));
    useMentorProfile.mockReturnValue(queryResult({ data: sampleProfile }));
    render(<MentorProfileView />);
    const user = (await import("@testing-library/user-event")).default;

    const toggle = screen.getByRole("switch", { name: "Messages" });
    await user.click(toggle);
    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        notificationPreferences: { messages: false },
      }),
      expect.any(Object)
    );
  });

  it("shows offline banner when disconnected", () => {
    useConnectivity.mockReturnValue(false);
    useMentorProfile.mockReturnValue(queryResult({ data: sampleProfile }));
    render(<MentorProfileView />);
    expect(screen.getByText(/You're offline/)).toBeInTheDocument();
  });
});
