import { render, screen, userEvent } from "@/test-utils";
import type { UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import type { ProfileUpdateInput, ScholarProfile } from "@/lib/types";

const profile: ScholarProfile = {
  id: "s1",
  name: "Chiamaka Okafor",
  email: "chiamaka@example.com",
  phone: "+234 800 000 0000",
  role: "SCHOLAR",
  notificationPreferences: {
    assignmentReminders: true,
    attendanceAlerts: false,
    meetingReminders: true,
    messages: true,
  },
};

jest.mock("@/hooks/useProfile", () => ({
  useProfile: jest.fn(),
  useUpdateProfile: jest.fn(),
}));

jest.mock("@/hooks/useConnectivity", () => ({
  useConnectivity: jest.fn(() => true),
}));

import { ProfileView } from "./ProfileView";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useConnectivity } from "@/hooks/useConnectivity";

const mockUseProfile = useProfile as jest.MockedFunction<typeof useProfile>;
const mockUseUpdateProfile = useUpdateProfile as jest.MockedFunction<
  typeof useUpdateProfile
>;

function profileQueryResult(
  overrides: Partial<UseQueryResult<ScholarProfile, Error>>
): UseQueryResult<ScholarProfile, Error> {
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
  } as UseQueryResult<ScholarProfile, Error>;
}

function mutationResult(
  mutate: jest.Mock
): UseMutationResult<ScholarProfile, Error, ProfileUpdateInput> {
  return {
    mutate,
    mutateAsync: jest.fn(),
    isPending: false,
    isError: false,
    error: null,
    status: "idle",
    isIdle: true,
    isSuccess: false,
    isPaused: false,
    submittedAt: 0,
    variables: undefined,
    data: undefined,
    failureCount: 0,
    failureReason: null,
    reset: jest.fn(),
    context: undefined,
  } as unknown as UseMutationResult<ScholarProfile, Error, ProfileUpdateInput>;
}

function renderProfile() {
  return render(<ProfileView />);
}

describe("ProfileView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseProfile.mockReturnValue(profileQueryResult({ data: profile }));
    mockUseUpdateProfile.mockReturnValue(mutationResult(jest.fn()));
  });

  it("shows loading while profile loads", () => {
    mockUseProfile.mockReturnValue(
      profileQueryResult({ isLoading: true, isPending: true, data: undefined })
    );

    renderProfile();

    expect(screen.getByText("Loading your profile")).toBeInTheDocument();
  });

  it("shows error state with retry", () => {
    const refetch = jest.fn();
    mockUseProfile.mockReturnValue(
      profileQueryResult({ error: new Error("x"), isError: true, status: "error", refetch })
    );

    renderProfile();

    expect(screen.getByText("Couldn't load your profile")).toBeInTheDocument();
    screen.getByRole("button", { name: "Try again" }).click();
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("renders all profile sections", () => {
    renderProfile();

    expect(screen.getByText("Profile & Settings")).toBeInTheDocument();
    expect(screen.getByText("Personal Information")).toBeInTheDocument();
    expect(screen.getByText("Notification Preferences")).toBeInTheDocument();
    expect(screen.getByText("Account & Security")).toBeInTheDocument();
    expect(screen.getByText("Chiamaka Okafor")).toBeInTheDocument();
    expect(screen.getByLabelText("Full name")).toHaveValue("Chiamaka Okafor");
    expect(screen.getByLabelText("Phone")).toHaveValue("+234 800 000 0000");
  });

  it("saves personal info changes via mutation", async () => {
    const mutate = jest.fn();
    mockUseUpdateProfile.mockReturnValue(mutationResult(mutate));

    renderProfile();

    const nameInput = screen.getByLabelText("Full name");
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Ngozi Okafor");
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));

    expect(mutate).toHaveBeenCalledWith(
      { name: "Ngozi Okafor", phone: "+234 800 000 0000" },
      expect.anything()
    );
  });

  it("toggles a notification preference via mutation", async () => {
    const mutate = jest.fn();
    mockUseUpdateProfile.mockReturnValue(mutationResult(mutate));

    renderProfile();

    const toggle = screen.getByRole("switch", { name: "Attendance alerts" });
    expect(toggle).toHaveAttribute("aria-checked", "false");
    await userEvent.click(toggle);

    expect(mutate).toHaveBeenCalledWith(
      { notificationPreferences: { attendanceAlerts: true } },
      expect.anything()
    );
  });

  it("shows offline banner and disables saves when offline", async () => {
    (useConnectivity as jest.Mock).mockReturnValue(false);

    renderProfile();

    expect(screen.getByText(/You're offline/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save changes" })).toBeDisabled();
    expect(
      screen.getByRole("switch", { name: "Assignment reminders" })
    ).toBeDisabled();
  });
});
